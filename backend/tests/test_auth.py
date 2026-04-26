"""Auth enforcement tests."""

from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi.testclient import TestClient
from temporalio.client import WorkflowExecutionStatus

import care_passport.api as api_module
from care_passport.knowledge.stub_store import StubKnowledgeStore

TOKEN = "test-token-for-pytest"
AUTH = {"Authorization": f"Bearer {TOKEN}"}


def _setup():
    temporal = AsyncMock()
    handle = AsyncMock()
    desc = MagicMock()
    desc.status = WorkflowExecutionStatus.RUNNING
    handle.describe = AsyncMock(return_value=desc)
    temporal.get_workflow_handle = MagicMock(return_value=handle)

    async def _empty():
        return
        yield

    temporal.list_workflows = MagicMock(return_value=_empty())
    api_module._temporal = temporal
    api_module._store = StubKnowledgeStore()
    api_module._llm_status = {"ok": True, "detail": "stub"}


def test_health_no_auth():
    _setup()
    r = TestClient(api_module.app).get("/health")
    assert r.status_code == 200


def test_patients_no_auth():
    _setup()
    r = TestClient(api_module.app).get("/patients")
    assert r.status_code == 401


def test_patients_wrong_token():
    _setup()
    r = TestClient(api_module.app).get("/patients", headers={"Authorization": "Bearer wrong"})
    assert r.status_code == 401


def test_patients_correct_token():
    _setup()
    r = TestClient(api_module.app).get("/patients", headers=AUTH)
    assert r.status_code == 200


def test_cors_preflight_no_auth():
    _setup()
    r = TestClient(api_module.app).options(
        "/patients",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Authorization",
        },
    )
    assert r.status_code == 200
    assert "access-control-allow-origin" in r.headers
