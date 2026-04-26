"""Unit tests for PatientAgentWorkflow update handlers.

Tests prove each update handler dispatches to the correct activity with the
right arguments and timeout/retry policy, without requiring a live Temporal server.
"""

import datetime
from unittest.mock import AsyncMock, patch

import pytest

from care_passport.knowledge.models import (
    CompletenessReport,
    HotMoments,
    Passport,
    QueryAnswer,
    TimelineEvent,
)
from care_passport.workflow import PatientAgentWorkflow, _READ_TIMEOUT, _QUERY_TIMEOUT, _READ_RETRY


def _make_workflow(patient_id: str = "anna") -> PatientAgentWorkflow:
    wf = PatientAgentWorkflow()
    wf._patient_id = patient_id
    return wf


@pytest.mark.asyncio
async def test_get_passport_update_returns_passport():
    wf = _make_workflow("anna")
    expected = Passport(patient_id="anna")

    async def _fake_execute(fn, pid, **kwargs):
        return expected

    with patch("care_passport.workflow.workflow.execute_activity", side_effect=_fake_execute):
        result = await wf.get_passport()

    assert result is expected


@pytest.mark.asyncio
async def test_get_passport_update_passes_patient_id():
    wf = _make_workflow("greet")
    captured = {}

    async def _fake_execute(fn, pid, **kwargs):
        captured["pid"] = pid
        captured["kwargs"] = kwargs
        return Passport(patient_id=pid)

    with patch("care_passport.workflow.workflow.execute_activity", side_effect=_fake_execute):
        await wf.get_passport()

    assert captured["pid"] == "greet"
    assert captured["kwargs"]["start_to_close_timeout"] == _READ_TIMEOUT
    assert captured["kwargs"]["retry_policy"] == _READ_RETRY


@pytest.mark.asyncio
async def test_get_hot_moments_update_returns_hot_moments():
    wf = _make_workflow("anna")
    expected = HotMoments(calmers=["music"], agitators=["noise"])

    async def _fake_execute(fn, pid, **kwargs):
        return expected

    with patch("care_passport.workflow.workflow.execute_activity", side_effect=_fake_execute):
        result = await wf.get_hot_moments()

    assert result is expected


@pytest.mark.asyncio
async def test_get_completeness_update_returns_completeness():
    wf = _make_workflow("anna")
    expected = CompletenessReport(overall_score=0.75)

    async def _fake_execute(fn, pid, **kwargs):
        return expected

    with patch("care_passport.workflow.workflow.execute_activity", side_effect=_fake_execute):
        result = await wf.get_completeness()

    assert result is expected


@pytest.mark.asyncio
async def test_get_timeline_update_passes_limit():
    wf = _make_workflow("anna")
    captured = {}

    async def _fake_execute(fn, *, args, **kwargs):
        captured["args"] = args
        captured["kwargs"] = kwargs
        return []

    with patch("care_passport.workflow.workflow.execute_activity", side_effect=_fake_execute):
        result = await wf.get_timeline(10)

    assert captured["args"] == ["anna", 10]
    assert captured["kwargs"]["start_to_close_timeout"] == _READ_TIMEOUT
    assert result == []


@pytest.mark.asyncio
async def test_answer_query_update_passes_question_and_uses_longer_timeout():
    wf = _make_workflow("anna")
    captured = {}
    expected = QueryAnswer(question="q", answer="a", confidence=0.9)

    async def _fake_execute(fn, *, args, **kwargs):
        captured["args"] = args
        captured["kwargs"] = kwargs
        return expected

    with patch("care_passport.workflow.workflow.execute_activity", side_effect=_fake_execute):
        result = await wf.answer_query("q")

    assert captured["args"] == ["anna", "q"]
    assert captured["kwargs"]["start_to_close_timeout"] == _QUERY_TIMEOUT
    assert result is expected


@pytest.mark.asyncio
async def test_answer_query_timeout_longer_than_read_timeout():
    assert _QUERY_TIMEOUT > _READ_TIMEOUT
