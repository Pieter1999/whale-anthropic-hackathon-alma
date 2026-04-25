"""
Smoke tests for care-passport.

Covers:
- knowledge layer models and StubKnowledgeStore
- activities (ingest_episode_activity)
- FastAPI routes (mocked store + mocked Temporal)
"""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient


# ---------------------------------------------------------------------------
# Knowledge layer
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_stub_store_query_anna():
    from care_passport.knowledge.stub_store import StubKnowledgeStore
    from care_passport.knowledge.models import Message
    store = StubKnowledgeStore()
    docs = await store.query("anna", [Message(role="user", content="What soothes Anna?")])
    assert len(docs) >= 1
    assert all(hasattr(d, "content") for d in docs)


@pytest.mark.asyncio
async def test_stub_store_query_unknown():
    from care_passport.knowledge.stub_store import StubKnowledgeStore
    from care_passport.knowledge.models import Message
    store = StubKnowledgeStore()
    docs = await store.query("unknown-patient", [Message(role="user", content="hello")])
    assert docs == []


@pytest.mark.asyncio
async def test_stub_store_passport_anna():
    from care_passport.knowledge.stub_store import StubKnowledgeStore
    store = StubKnowledgeStore()
    passport = await store.get_passport("anna")
    assert passport.patient_id == "anna"
    assert len(passport.fields) > 0


@pytest.mark.asyncio
async def test_stub_store_hot_moments_anna():
    from care_passport.knowledge.stub_store import StubKnowledgeStore
    store = StubKnowledgeStore()
    hm = await store.get_hot_moments("anna")
    assert len(hm.calmers) > 0
    assert hm.soothing_phrase is not None


@pytest.mark.asyncio
async def test_stub_store_completeness_anna():
    from care_passport.knowledge.stub_store import StubKnowledgeStore
    store = StubKnowledgeStore()
    report = await store.get_completeness("anna")
    assert report.overall_score > 0


@pytest.mark.asyncio
async def test_stub_store_ingest_episode():
    from care_passport.knowledge.stub_store import StubKnowledgeStore
    from care_passport.knowledge.models import Episode
    store = StubKnowledgeStore()
    result = await store.ingest_episode("anna", Episode(source="test", text="hello", channel="web"))
    assert result.status == "ingested"
    assert result.episode_id.startswith("stub-")


# ---------------------------------------------------------------------------
# Activity
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_ingest_episode_activity_delegates():
    from care_passport.activities import IngestEpisodeInput, ingest_episode_activity
    from care_passport.knowledge.models import IngestResult

    mock_store = AsyncMock()
    mock_store.ingest_episode = AsyncMock(return_value=IngestResult(episode_id="ep-test"))

    with patch("care_passport.activities.get_store", return_value=mock_store):
        result = await ingest_episode_activity(
            IngestEpisodeInput(
                patient_id="anna",
                payload={"source": "vapi_call", "transcript": "hello", "channel": "voice"},
            )
        )

    assert result["episode_id"] == "ep-test"
    mock_store.ingest_episode.assert_awaited_once()


# ---------------------------------------------------------------------------
# API routes
# ---------------------------------------------------------------------------

def _make_app():
    """Return TestClient with mocked Temporal + store."""
    import care_passport.api as api_module
    from care_passport.knowledge.stub_store import StubKnowledgeStore

    app = api_module.app
    api_module._store = StubKnowledgeStore()

    # Mock temporal client
    mock_temporal = AsyncMock()
    api_module._temporal = mock_temporal

    mock_handle = AsyncMock()
    mock_desc = MagicMock()
    mock_desc.status = __import__("temporalio.client", fromlist=["WorkflowExecutionStatus"]).WorkflowExecutionStatus.RUNNING
    mock_handle.describe = AsyncMock(return_value=mock_desc)
    mock_handle.signal = AsyncMock()
    mock_handle.terminate = AsyncMock()

    mock_temporal.get_workflow_handle = MagicMock(return_value=mock_handle)
    mock_temporal.start_workflow = AsyncMock(return_value=mock_handle)
    mock_temporal.service_client = AsyncMock()
    mock_temporal.service_client.health_check = AsyncMock()

    # list_workflows returns async iterator
    async def fake_list():
        return
        yield  # make it an async generator

    mock_temporal.list_workflows = AsyncMock(return_value=fake_list())

    return TestClient(app, raise_server_exceptions=True)


def test_health():
    client = _make_app()
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["services"]["store"] is True


def test_create_patient():
    client = _make_app()
    r = client.post("/patients", json={"id": "anna", "display_name": "Anna K"})
    assert r.status_code == 201
    assert r.json()["patient_id"] == "anna"


def test_get_passport():
    client = _make_app()
    r = client.get("/patients/anna/passport")
    assert r.status_code == 200
    body = r.json()
    assert body["patient_id"] == "anna"
    assert len(body["fields"]) > 0


def test_get_hot_moments():
    client = _make_app()
    r = client.get("/patients/anna/hot-moments")
    assert r.status_code == 200
    body = r.json()
    assert len(body["calmers"]) > 0
    assert body["soothing_phrase"] is not None


def test_get_completeness():
    client = _make_app()
    r = client.get("/patients/anna/completeness")
    assert r.status_code == 200
    body = r.json()
    assert body["overall_score"] > 0


def test_vapi_kb():
    client = _make_app()
    r = client.post(
        "/vapi/kb?patient_id=anna",
        json={"message": {"type": "knowledge-base-request", "messages": [{"role": "user", "content": "music?"}]}},
    )
    assert r.status_code == 200
    body = r.json()
    assert "documents" in body
    assert len(body["documents"]) > 0


def test_vapi_end_of_call():
    client = _make_app()
    r = client.post(
        "/vapi/end-of-call?patient_id=anna",
        json={"message": {"type": "end-of-call-report", "transcript": "Anna seemed calm today."}},
    )
    assert r.status_code == 202


def test_post_contribution():
    client = _make_app()
    r = client.post(
        "/patients/anna/contributions",
        json={"text": "Played Sinatra, she smiled.", "attribution": {"kind": "staff"}, "channel": "shift_app"},
    )
    assert r.status_code == 202


def test_get_timeline():
    client = _make_app()
    r = client.get("/patients/anna/timeline?limit=3")
    assert r.status_code == 200
    body = r.json()
    assert "events" in body


def test_query_patient():
    client = _make_app()
    r = client.post("/patients/anna/query", json={"question": "What calms Anna?"})
    assert r.status_code == 200
    body = r.json()
    assert "answer" in body
