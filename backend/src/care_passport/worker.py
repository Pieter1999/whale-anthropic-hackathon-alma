"""Temporal worker entrypoint. Run: uv run python -m care_passport.worker"""

import asyncio
import logging

from temporalio.client import Client
from temporalio.worker import Worker

from care_passport.activities import (
    answer_query_activity,
    get_completeness_activity,
    get_hot_moments_activity,
    get_passport_activity,
    get_timeline_activity,
    ingest_episode_activity,
)
from care_passport.config import settings
from care_passport.workflow import PatientAgentWorkflow

logging.basicConfig(level=logging.INFO)


async def main() -> None:
    client = await Client.connect(settings.temporal_host)
    async with Worker(
        client,
        task_queue=settings.temporal_task_queue,
        workflows=[PatientAgentWorkflow],
        activities=[
            ingest_episode_activity,
            get_passport_activity,
            get_hot_moments_activity,
            get_completeness_activity,
            get_timeline_activity,
            answer_query_activity,
        ],
    ):
        logging.info("Worker running on task queue: %s", settings.temporal_task_queue)
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
