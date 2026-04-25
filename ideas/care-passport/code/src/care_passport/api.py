"""FastAPI service. Run: uv run uvicorn care_passport.api:app --reload"""

from contextlib import asynccontextmanager
from datetime import datetime, timezone

import anthropic
from fastapi import FastAPI, Header, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from temporalio.client import Client, WorkflowExecutionStatus
from temporalio.service import RPCError

from care_passport.config import settings
from care_passport.knowledge import KnowledgeStore, Message, get_store
from care_passport.workflow import PatientAgentWorkflow

_temporal: Client | None = None
_store: KnowledgeStore | None = None
_llm_status: dict = {"ok": False, "detail": "not checked"}


async def _probe_llm() -> dict:
    """One-token Anthropic ping. Returns {ok, detail}."""
    try:
        client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
        await client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1,
            messages=[{"role": "user", "content": "hi"}],
        )
        return {"ok": True, "detail": "reachable"}
    except anthropic.AuthenticationError:
        return {"ok": False, "detail": "auth_error: check ANTHROPIC_API_KEY"}
    except anthropic.PermissionDeniedError:
        return {"ok": False, "detail": "permission_denied: key lacks required permissions"}
    except Exception as exc:
        return {"ok": False, "detail": f"error: {type(exc).__name__}"}


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _temporal, _store, _llm_status
    _temporal = await Client.connect(settings.temporal_host)
    _store = get_store(settings.knowledge_store)
    if settings.knowledge_store != "stub":
        _llm_status = await _probe_llm()
        if not _llm_status["ok"]:
            import logging
            logging.getLogger(__name__).error(
                "LLM UNREACHABLE at startup: %s — extraction will fail until this is fixed",
                _llm_status["detail"],
            )
    else:
        _llm_status = {"ok": True, "detail": "stub mode — no LLM needed"}
    yield


app = FastAPI(title="Care Passport API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _wf_id(patient_id: str) -> str:
    return f"patient-{patient_id}"


async def _temporal_ok() -> bool:
    try:
        await _temporal.service_client.check_health()
        return True
    except RPCError:
        return False


async def _get_handle(patient_id: str):
    try:
        handle = _temporal.get_workflow_handle(_wf_id(patient_id))
        desc = await handle.describe()
        if desc.status != WorkflowExecutionStatus.RUNNING:
            raise HTTPException(status_code=404, detail=f"No running workflow for patient {patient_id}")
        return handle
    except RPCError:
        raise HTTPException(status_code=404, detail=f"No running workflow for patient {patient_id}")


async def _start_workflow(patient_id: str):
    wf_id = _wf_id(patient_id)
    try:
        handle = _temporal.get_workflow_handle(wf_id)
        desc = await handle.describe()
        if desc.status == WorkflowExecutionStatus.RUNNING:
            return handle, "already_running"
    except RPCError:
        pass
    handle = await _temporal.start_workflow(
        PatientAgentWorkflow.run,
        patient_id,
        id=wf_id,
        task_queue=settings.temporal_task_queue,
    )
    return handle, "started"


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

@app.get("/health")
async def health(probe: str = Query(default="")):
    global _llm_status
    if probe == "llm":
        _llm_status = await _probe_llm()
    t_ok = await _temporal_ok()
    llm_ok = _llm_status["ok"]
    all_ok = t_ok and llm_ok
    return {
        "status": "ok" if all_ok else "degraded",
        "services": {
            "temporal": t_ok,
            "store": True,
            "llm": llm_ok,
        },
        "details": {"llm": _llm_status["detail"]},
    }


# ---------------------------------------------------------------------------
# Patient management
# ---------------------------------------------------------------------------

class CreatePatientBody(BaseModel):
    id: str
    display_name: str
    language: str = "en"


@app.post("/patients", status_code=201)
async def create_patient(body: CreatePatientBody):
    _, status = await _start_workflow(body.id)
    return {"patient_id": body.id, "workflow_id": _wf_id(body.id), "status": status}


@app.get("/patients")
async def list_patients():
    query = 'WorkflowType="PatientAgentWorkflow" AND ExecutionStatus="Running"'
    patients = []
    async for wf in _temporal.list_workflows(query=query):
        patient_id = wf.id.removeprefix("patient-")
        patients.append({"patient_id": patient_id, "workflow_id": wf.id, "status": "running"})
    return {"patients": patients}


@app.get("/patients/{patient_id}")
async def get_patient(patient_id: str):
    handle = await _get_handle(patient_id)
    desc = await handle.describe()
    passport = await _store.get_passport(patient_id)
    return {
        "patient_id": patient_id,
        "workflow_id": _wf_id(patient_id),
        "workflow_status": desc.status.name,
        "summary": passport.model_dump(),
    }


@app.delete("/patients/{patient_id}", status_code=204)
async def delete_patient(patient_id: str):
    handle = await _get_handle(patient_id)
    await handle.terminate(reason="patient deleted via API")
    return Response(status_code=204)


# ---------------------------------------------------------------------------
# Vapi integration
# ---------------------------------------------------------------------------

@app.post("/vapi/kb")
async def vapi_kb(
    body: dict,
    patient_id: str = Query(default=""),
    x_patient_id: str | None = Header(default=None),
):
    pid = x_patient_id or patient_id
    if not pid:
        raise HTTPException(status_code=400, detail="patient_id required (query param or X-Patient-Id header)")
    msg = body.get("message", {})
    if msg.get("type") != "knowledge-base-request":
        raise HTTPException(status_code=400, detail="Expected message.type == 'knowledge-base-request'")
    raw_messages = msg.get("messages", [])
    messages = [Message(role=m.get("role", "user"), content=m.get("content", "")) for m in raw_messages]
    docs = await _store.query(pid, messages)
    return {"documents": [d.model_dump() for d in docs]}


class VapiEndOfCallBody(BaseModel):
    message: dict


@app.post("/vapi/end-of-call", status_code=202)
async def vapi_end_of_call(body: VapiEndOfCallBody, patient_id: str = Query(...)):
    handle = await _get_handle(patient_id)
    transcript = body.message.get("transcript", "")
    payload = {
        "source": "vapi_call",
        "transcript": transcript,
        "channel": "voice",
        "captured_at": datetime.now(timezone.utc).isoformat(),
    }
    await handle.signal(PatientAgentWorkflow.episode_received, payload)
    return {"status": "accepted", "patient_id": patient_id}


# ---------------------------------------------------------------------------
# Contributions
# ---------------------------------------------------------------------------

class ContributionBody(BaseModel):
    text: str
    attribution: dict = {}
    channel: str = "web"
    captured_at: str | None = None


@app.post("/patients/{patient_id}/contributions", status_code=202)
async def post_contribution(patient_id: str, body: ContributionBody):
    handle = await _get_handle(patient_id)
    payload = {
        "source": "contribution",
        "text": body.text,
        "channel": body.channel,
        "attribution": body.attribution,
        "captured_at": body.captured_at or datetime.now(timezone.utc).isoformat(),
    }
    await handle.signal(PatientAgentWorkflow.episode_received, payload)
    return {"status": "accepted", "patient_id": patient_id}


# ---------------------------------------------------------------------------
# Reads
# ---------------------------------------------------------------------------

@app.get("/patients/{patient_id}/passport")
async def get_passport(patient_id: str):
    return (await _store.get_passport(patient_id)).model_dump()


@app.get("/patients/{patient_id}/hot-moments")
async def get_hot_moments(patient_id: str):
    return (await _store.get_hot_moments(patient_id)).model_dump()


@app.get("/patients/{patient_id}/completeness")
async def get_completeness(patient_id: str):
    return (await _store.get_completeness(patient_id)).model_dump()


@app.get("/patients/{patient_id}/timeline")
async def get_timeline(patient_id: str, limit: int = Query(default=50, ge=1, le=200)):
    events = await _store.get_timeline(patient_id, limit)
    return {"patient_id": patient_id, "events": [e.model_dump() for e in events]}


class QueryBody(BaseModel):
    question: str


@app.post("/patients/{patient_id}/query")
async def query_patient(patient_id: str, body: QueryBody):
    return (await _store.answer_query(patient_id, body.question)).model_dump()
