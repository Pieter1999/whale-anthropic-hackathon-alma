"""Per-patient Temporal workflow. One long-running instance per patient_id."""

import datetime

from temporalio import workflow
from temporalio.common import RetryPolicy

with workflow.unsafe.imports_passed_through():
    from care_passport.activities import (
        IngestEpisodeInput,
        answer_query_activity,
        get_completeness_activity,
        get_hot_moments_activity,
        get_passport_activity,
        get_timeline_activity,
        ingest_episode_activity,
    )
    from care_passport.knowledge.models import (
        CompletenessReport,
        HotMoments,
        Passport,
        QueryAnswer,
        TimelineEvent,
    )

_READ_RETRY = RetryPolicy(maximum_attempts=2)
_READ_TIMEOUT = datetime.timedelta(seconds=30)
_QUERY_TIMEOUT = datetime.timedelta(seconds=60)


def _patient_id() -> str:
    return workflow.info().workflow_id.removeprefix("patient-")


@workflow.defn
class PatientAgentWorkflow:
    """Durable, addressable, per-patient runner. Runs until terminated."""

    def __init__(self) -> None:
        self._terminated = False

    @workflow.signal
    async def episode_received(self, payload: dict) -> None:
        await workflow.execute_activity(
            ingest_episode_activity,
            IngestEpisodeInput(patient_id=_patient_id(), payload=payload),
            start_to_close_timeout=datetime.timedelta(minutes=5),
            retry_policy=RetryPolicy(maximum_attempts=3),
        )

    @workflow.signal
    def stop(self) -> None:
        self._terminated = True

    @workflow.update
    async def get_passport(self) -> Passport:
        return await workflow.execute_activity(
            get_passport_activity,
            _patient_id(),
            start_to_close_timeout=_READ_TIMEOUT,
            retry_policy=_READ_RETRY,
        )

    @workflow.update
    async def get_hot_moments(self) -> HotMoments:
        return await workflow.execute_activity(
            get_hot_moments_activity,
            _patient_id(),
            start_to_close_timeout=_READ_TIMEOUT,
            retry_policy=_READ_RETRY,
        )

    @workflow.update
    async def get_completeness(self) -> CompletenessReport:
        return await workflow.execute_activity(
            get_completeness_activity,
            _patient_id(),
            start_to_close_timeout=_READ_TIMEOUT,
            retry_policy=_READ_RETRY,
        )

    @workflow.update
    async def get_timeline(self, limit: int) -> list[TimelineEvent]:
        return await workflow.execute_activity(
            get_timeline_activity,
            args=[_patient_id(), limit],
            start_to_close_timeout=_READ_TIMEOUT,
            retry_policy=_READ_RETRY,
        )

    @workflow.update
    async def answer_query(self, question: str) -> QueryAnswer:
        return await workflow.execute_activity(
            answer_query_activity,
            args=[_patient_id(), question],
            start_to_close_timeout=_QUERY_TIMEOUT,
            retry_policy=_READ_RETRY,
        )

    @workflow.run
    async def run(self, patient_id: str) -> None:
        await workflow.wait_condition(lambda: self._terminated)
