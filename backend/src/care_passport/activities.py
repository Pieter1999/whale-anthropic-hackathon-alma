"""Temporal activities for the care-passport workflow."""

import logging
from dataclasses import dataclass, field

from temporalio import activity

from care_passport.config import settings
from care_passport.knowledge import Episode, get_store
from care_passport.knowledge.models import (
    CompletenessReport,
    HotMoments,
    Passport,
    QueryAnswer,
    TimelineEvent,
)

logger = logging.getLogger(__name__)

_store = get_store(settings.knowledge_store)


@dataclass
class IngestEpisodeInput:
    patient_id: str
    payload: dict = field(default_factory=dict)


@activity.defn
async def ingest_episode_activity(inp: IngestEpisodeInput) -> dict:
    episode = Episode(**inp.payload)
    result = await _store.ingest_episode(inp.patient_id, episode)
    logger.info("[ingest_episode] patient=%s episode_id=%s", inp.patient_id, result.episode_id)
    return result.model_dump()


@activity.defn
async def get_passport_activity(patient_id: str) -> Passport:
    return await _store.get_passport(patient_id)


@activity.defn
async def get_hot_moments_activity(patient_id: str) -> HotMoments:
    return await _store.get_hot_moments(patient_id)


@activity.defn
async def get_completeness_activity(patient_id: str) -> CompletenessReport:
    return await _store.get_completeness(patient_id)


@activity.defn
async def get_timeline_activity(patient_id: str, limit: int) -> list[TimelineEvent]:
    return await _store.get_timeline(patient_id, limit)


@activity.defn
async def answer_query_activity(patient_id: str, question: str) -> QueryAnswer:
    return await _store.answer_query(patient_id, question)
