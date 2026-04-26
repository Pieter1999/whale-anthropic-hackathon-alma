"""Temporal activities for the care-passport workflow."""

import logging
from dataclasses import dataclass, field

from temporalio import activity

from care_passport.config import settings
from care_passport.knowledge import Episode, get_store

logger = logging.getLogger(__name__)


@dataclass
class IngestEpisodeInput:
    patient_id: str
    payload: dict = field(default_factory=dict)


@activity.defn
async def ingest_episode_activity(inp: IngestEpisodeInput) -> dict:
    store = get_store(settings.knowledge_store)
    episode = Episode(**inp.payload)
    result = await store.ingest_episode(inp.patient_id, episode)
    logger.info("[ingest_episode] patient=%s episode_id=%s", inp.patient_id, result.episode_id)
    return result.model_dump()
