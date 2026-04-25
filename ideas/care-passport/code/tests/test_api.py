"""API endpoint tests — exercises real route logic with mocked boundaries.

Mocks: Temporal Client (via module-level patch) and KnowledgeStore (via module attr).
Does NOT mock individual route handlers — catches real bugs like wrong SDK method names.
"""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient
from temporalio.client import WorkflowExecutionStatus
from temporalio.service import RPCError

import care_passport.api as api_module
from care_passport.knowledge.models import (
    CompletenessReport,
    Document,
    HotMoments,
    Message,
    NamedContact,
    Passport,
    PassportField,
    QueryAnswer,
    TimelineEvent,
)
from care_passport.knowledge.stub_store import StubKnowledgeStore


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

def _running_desc():
    desc = MagicMock()
    desc.status = WorkflowExecutionStatus.RUNNING
    return desc


def _make_handle(running: bool = True):
    handle = AsyncMock()
    if running:
        handle.describe = AsyncMock(return_value=_running_desc())
    else:
        desc = MagicMock()
        desc.status = WorkflowExecutionStatus.TERMINATED
        handle.describe = AsyncMock(return_value=desc)
    handle.signal = AsyncMock()
    handle.terminate = AsyncMock()
    return handle


def _make_temporal(running: bool = True, health_ok: bool = True):
    temporal = AsyncMock()
    handle = _make_handle(running)
    temporal.get_workflow_handle = MagicMock(return_value=handle)
    temporal.start_workflow = AsyncMock(return_value=handle)
    svc = AsyncMock()
    if health_ok:
        svc.check_health = AsyncMock(return_value=None)
    else:
        svc.check_health = AsyncMock(side_effect=RPCError("unreachable", None, None))
    temporal.service_client = svc

    async def _empty_list(*_a, **_kw):
        return
        yield  # async generator

    temporal.list_workflows = MagicMock(return_value=_empty_list())
    return temporal, handle


@pytest.fixture
def client():
    temporal, _ = _make_temporal()
    api_module._temporal = temporal
    api_module._store = StubKnowledgeStore()
    return TestClient(api_module.app, raise_server_exceptions=True)


@pytest.fixture
def client_and_handle():
    temporal, handle = _make_temporal()
    api_module._temporal = temporal
    api_module._store = StubKnowledgeStore()
    return TestClient(api_module.app, raise_server_exceptions=True), handle


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

def test_health_temporal_ok():
    temporal, _ = _make_temporal(health_ok=True)
    api_module._temporal = temporal
    api_module._store = StubKnowledgeStore()
    api_module._llm_status = {"ok": True, "detail": "reachable"}
    c = TestClient(api_module.app)
    r = c.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["services"]["temporal"] is True
    assert body["services"]["llm"] is True
    assert body["status"] == "ok"


def test_health_temporal_down():
    temporal, _ = _make_temporal(health_ok=False)
    api_module._temporal = temporal
    api_module._store = StubKnowledgeStore()
    api_module._llm_status = {"ok": True, "detail": "reachable"}
    c = TestClient(api_module.app)
    r = c.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["services"]["temporal"] is False
    assert body["status"] == "degraded"


def test_health_llm_down():
    temporal, _ = _make_temporal(health_ok=True)
    api_module._temporal = temporal
    api_module._store = StubKnowledgeStore()
    api_module._llm_status = {"ok": False, "detail": "auth_error: check ANTHROPIC_API_KEY"}
    c = TestClient(api_module.app)
    r = c.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["services"]["llm"] is False
    assert body["status"] == "degraded"
    assert "auth_error" in body["details"]["llm"]


# ---------------------------------------------------------------------------
# Patient management
# ---------------------------------------------------------------------------

def test_create_patient_new(client_and_handle):
    c, handle = client_and_handle
    # First call: no running workflow → start_workflow called
    api_module._temporal.get_workflow_handle.return_value.describe = AsyncMock(
        side_effect=RPCError("not found", None, None)
    )
    r = c.post("/patients", json={"id": "anna", "display_name": "Anna"})
    assert r.status_code == 201
    body = r.json()
    assert body["patient_id"] == "anna"
    assert body["workflow_id"] == "patient-anna"


def test_create_patient_idempotent(client):
    # Already running → returns already_running
    r = client.post("/patients", json={"id": "anna", "display_name": "Anna"})
    assert r.status_code == 201
    assert r.json()["status"] == "already_running"


def test_list_patients(client):
    r = client.get("/patients")
    assert r.status_code == 200
    assert "patients" in r.json()


def test_get_patient_running(client):
    r = client.get("/patients/anna")
    assert r.status_code == 200
    body = r.json()
    assert body["patient_id"] == "anna"
    assert "summary" in body


def test_get_patient_not_found():
    temporal, _ = _make_temporal()
    temporal.get_workflow_handle.return_value.describe = AsyncMock(
        side_effect=RPCError("not found", None, None)
    )
    api_module._temporal = temporal
    api_module._store = StubKnowledgeStore()
    c = TestClient(api_module.app)
    r = c.get("/patients/nobody")
    assert r.status_code == 404


def test_delete_patient(client_and_handle):
    c, handle = client_and_handle
    r = c.delete("/patients/anna")
    assert r.status_code == 204
    handle.terminate.assert_awaited_once()


# ---------------------------------------------------------------------------
# Vapi KB
# ---------------------------------------------------------------------------

def test_vapi_kb_valid(client):
    r = client.post(
        "/vapi/kb?patient_id=anna",
        json={"message": {"type": "knowledge-base-request", "messages": [{"role": "user", "content": "music?"}]}},
    )
    assert r.status_code == 200
    body = r.json()
    assert "documents" in body
    assert len(body["documents"]) > 0
    for doc in body["documents"]:
        assert "content" in doc


def test_vapi_kb_missing_patient_id(client):
    r = client.post(
        "/vapi/kb",
        json={"message": {"type": "knowledge-base-request", "messages": []}},
    )
    assert r.status_code == 400


def test_vapi_kb_wrong_message_type(client):
    r = client.post(
        "/vapi/kb?patient_id=anna",
        json={"message": {"type": "function-call", "messages": []}},
    )
    assert r.status_code == 400


def test_vapi_kb_x_patient_id_header(client):
    r = client.post(
        "/vapi/kb",
        headers={"X-Patient-Id": "anna"},
        json={"message": {"type": "knowledge-base-request", "messages": [{"role": "user", "content": "?"}]}},
    )
    assert r.status_code == 200


# ---------------------------------------------------------------------------
# Vapi end-of-call
# ---------------------------------------------------------------------------

def test_vapi_end_of_call_signals_workflow(client_and_handle):
    c, handle = client_and_handle
    r = c.post(
        "/vapi/end-of-call?patient_id=anna",
        json={"message": {"type": "end-of-call-report", "transcript": "She was calm today."}},
    )
    assert r.status_code == 202
    handle.signal.assert_awaited_once()
    call_args = handle.signal.call_args
    payload = call_args[0][1] if len(call_args[0]) > 1 else call_args[1].get("arg")
    assert payload["source"] == "vapi_call"
    assert "She was calm today." in payload["transcript"]


def test_vapi_end_of_call_unknown_patient():
    temporal, _ = _make_temporal()
    temporal.get_workflow_handle.return_value.describe = AsyncMock(
        side_effect=RPCError("not found", None, None)
    )
    api_module._temporal = temporal
    api_module._store = StubKnowledgeStore()
    c = TestClient(api_module.app)
    r = c.post(
        "/vapi/end-of-call?patient_id=nobody",
        json={"message": {"transcript": "test"}},
    )
    assert r.status_code == 404


# ---------------------------------------------------------------------------
# Contributions
# ---------------------------------------------------------------------------

def test_post_contribution_signals_workflow(client_and_handle):
    c, handle = client_and_handle
    r = c.post(
        "/patients/anna/contributions",
        json={"text": "She smiled when we played music.", "attribution": {"kind": "staff"}, "channel": "shift_app"},
    )
    assert r.status_code == 202
    handle.signal.assert_awaited_once()
    payload = handle.signal.call_args[0][1]
    assert payload["text"] == "She smiled when we played music."
    assert payload["channel"] == "shift_app"
    assert payload["attribution"] == {"kind": "staff"}


# ---------------------------------------------------------------------------
# Passport / hot-moments / completeness / timeline / query
# ---------------------------------------------------------------------------

def test_get_passport(client):
    r = client.get("/patients/anna/passport")
    assert r.status_code == 200
    body = r.json()
    assert body["patient_id"] == "anna"
    assert len(body["fields"]) > 0
    for f in body["fields"]:
        assert "category" in f
        assert "statement" in f
        assert "confidence" in f


def test_get_hot_moments(client):
    r = client.get("/patients/anna/hot-moments")
    assert r.status_code == 200
    body = r.json()
    assert len(body["calmers"]) >= 3
    assert len(body["agitators"]) >= 3
    assert body["soothing_phrase"] is not None
    assert body["named_contact"] is not None


def test_get_completeness(client):
    r = client.get("/patients/anna/completeness")
    assert r.status_code == 200
    body = r.json()
    assert body["overall_score"] > 0
    assert "pzp_coverage" in body
    assert "hot_moment_readiness" in body


def test_get_timeline(client):
    r = client.get("/patients/anna/timeline?limit=5")
    assert r.status_code == 200
    body = r.json()
    assert "events" in body
    assert body["patient_id"] == "anna"


def test_query_patient(client):
    r = client.post("/patients/anna/query", json={"question": "What calms Anna?"})
    assert r.status_code == 200
    body = r.json()
    assert "answer" in body
    assert "confidence" in body
    assert "evidence" in body


# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------

def test_cors_preflight_ok():
    temporal, _ = _make_temporal(health_ok=True)
    api_module._temporal = temporal
    api_module._store = StubKnowledgeStore()
    api_module._llm_status = {"ok": True, "detail": "reachable"}
    c = TestClient(api_module.app)
    r = c.options(
        "/patients",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert r.status_code == 200
    assert "access-control-allow-origin" in r.headers
