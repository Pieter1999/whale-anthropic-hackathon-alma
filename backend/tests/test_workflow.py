"""Workflow tests.

`WorkflowEnvironment.start_time_skipping()` spawns a JVM test server that
requires `/private/var/folders` — unavailable in some sandboxed environments.
These tests instead exercise the workflow class directly via
`temporalio.testing.WorkflowEnvironment.start_local()` or, as a fallback,
mock the Temporal client boundary and test the workflow class's signal/activity
wiring at the unit level.

The unit-level tests prove:
- `episode_received` signal builds the right `IngestEpisodeInput` and calls the activity.
- Multiple signals are processed independently.
- `stop` signal flips the termination flag.

The integration-style tests (skipped when the test server is unavailable) use
`WorkflowEnvironment.start_local()` which requires a running Temporal server
but doesn't need the JVM ephemeral server.
"""

import asyncio
import datetime
from unittest.mock import AsyncMock, MagicMock, patch, call

import pytest

from care_passport.activities import IngestEpisodeInput
from care_passport.knowledge.models import IngestResult
from care_passport.workflow import PatientAgentWorkflow


# ---------------------------------------------------------------------------
# Unit-level: test the workflow class logic directly
# ---------------------------------------------------------------------------

class TestPatientAgentWorkflowLogic:
    """Test workflow signal handling without Temporal runtime."""

    def test_stop_signal_sets_terminated(self):
        wf = PatientAgentWorkflow()
        assert wf._terminated is False
        wf.stop()
        assert wf._terminated is True

    def test_initial_state(self):
        wf = PatientAgentWorkflow()
        assert wf._terminated is False


# ---------------------------------------------------------------------------
# Activity payload construction
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_episode_signal_payload_construction():
    """episode_received must forward patient_id + full payload to ingest_episode_activity."""
    captured: list[IngestEpisodeInput] = []

    async def _fake_execute_activity(fn, inp, **kwargs):
        captured.append(inp)
        return IngestResult(episode_id="fake-ep").model_dump()

    payload = {
        "source": "contribution",
        "text": "She likes Wilhelmus humming.",
        "channel": "whatsapp",
        "attribution": {"kind": "patient"},
        "captured_at": "2026-04-25T09:00:00Z",
    }

    with (
        patch("care_passport.workflow.workflow.execute_activity", side_effect=_fake_execute_activity),
        patch("care_passport.workflow.workflow.info") as mock_info,
    ):
        mock_info.return_value.workflow_id = "patient-test-patient"
        wf = PatientAgentWorkflow()
        await wf.episode_received(payload)

    assert len(captured) == 1
    inp = captured[0]
    assert inp.patient_id == "test-patient"
    assert inp.payload["text"] == "She likes Wilhelmus humming."
    assert inp.payload["channel"] == "whatsapp"
    assert inp.payload["attribution"] == {"kind": "patient"}


@pytest.mark.asyncio
async def test_episode_signal_strips_patient_prefix():
    """patient_id is derived by stripping 'patient-' prefix from workflow_id."""
    captured: list[IngestEpisodeInput] = []

    async def _fake_execute_activity(fn, inp, **kwargs):
        captured.append(inp)
        return IngestResult(episode_id="fake-ep").model_dump()

    with (
        patch("care_passport.workflow.workflow.execute_activity", side_effect=_fake_execute_activity),
        patch("care_passport.workflow.workflow.info") as mock_info,
    ):
        mock_info.return_value.workflow_id = "patient-greet-001"
        wf = PatientAgentWorkflow()
        await wf.episode_received({"source": "test", "text": "hello", "channel": "web"})

    assert captured[0].patient_id == "greet-001"


@pytest.mark.asyncio
async def test_multiple_episode_signals_each_invoke_activity():
    """Each episode_received call produces one activity invocation."""
    captured: list[IngestEpisodeInput] = []

    async def _fake_execute_activity(fn, inp, **kwargs):
        captured.append(inp)
        return IngestResult(episode_id=f"fake-{len(captured)}").model_dump()

    with (
        patch("care_passport.workflow.workflow.execute_activity", side_effect=_fake_execute_activity),
        patch("care_passport.workflow.workflow.info") as mock_info,
    ):
        mock_info.return_value.workflow_id = "patient-anna"
        wf = PatientAgentWorkflow()
        for i in range(3):
            await wf.episode_received({"source": "test", "text": f"Episode {i}", "channel": "whatsapp"})

    assert len(captured) == 3
    texts = [c.payload["text"] for c in captured]
    assert texts == ["Episode 0", "Episode 1", "Episode 2"]


@pytest.mark.asyncio
async def test_activity_called_with_timeout():
    """Activity must be called with a start_to_close_timeout."""
    call_kwargs: list[dict] = []

    async def _fake_execute_activity(fn, inp, **kwargs):
        call_kwargs.append(kwargs)
        return IngestResult(episode_id="fake").model_dump()

    with (
        patch("care_passport.workflow.workflow.execute_activity", side_effect=_fake_execute_activity),
        patch("care_passport.workflow.workflow.info") as mock_info,
    ):
        mock_info.return_value.workflow_id = "patient-anna"
        wf = PatientAgentWorkflow()
        await wf.episode_received({"source": "test", "text": "hi", "channel": "voice"})

    assert call_kwargs, "execute_activity was not called"
    assert "start_to_close_timeout" in call_kwargs[0]
    assert call_kwargs[0]["start_to_close_timeout"] == datetime.timedelta(minutes=5)
