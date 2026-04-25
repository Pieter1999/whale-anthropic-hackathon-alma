"""Per-patient Temporal workflow. One long-running instance per patient_id."""

from temporalio import workflow

with workflow.unsafe.imports_passed_through():
    from care_passport.activities import IngestEpisodeInput, ingest_episode_activity


@workflow.defn
class PatientAgentWorkflow:
    """Durable, addressable, per-patient runner. Runs until terminated."""

    def __init__(self) -> None:
        self._terminated = False

    @workflow.signal
    async def episode_received(self, payload: dict) -> None:
        await workflow.execute_activity(
            ingest_episode_activity,
            IngestEpisodeInput(patient_id=workflow.info().workflow_id.removeprefix("patient-"), payload=payload),
            start_to_close_timeout=__import__("datetime").timedelta(minutes=5),
        )

    @workflow.signal
    def stop(self) -> None:
        self._terminated = True

    @workflow.run
    async def run(self, patient_id: str) -> None:
        await workflow.wait_condition(lambda: self._terminated)
