"""Knowledge layer — Protocol + factory."""

from typing import Protocol, runtime_checkable

from care_passport.knowledge.models import (
    CompletenessReport,
    Document,
    Episode,
    HotMoments,
    IngestResult,
    Message,
    Passport,
    QueryAnswer,
    TimelineEvent,
)


@runtime_checkable
class KnowledgeStore(Protocol):
    async def ingest_episode(self, patient_id: str, episode: Episode) -> IngestResult: ...
    async def query(self, patient_id: str, messages: list[Message]) -> list[Document]: ...
    async def get_passport(self, patient_id: str) -> Passport: ...
    async def get_hot_moments(self, patient_id: str) -> HotMoments: ...
    async def get_completeness(self, patient_id: str) -> CompletenessReport: ...
    async def get_timeline(self, patient_id: str, limit: int = 50) -> list[TimelineEvent]: ...
    async def answer_query(self, patient_id: str, question: str) -> QueryAnswer: ...


def get_store(kind: str = "markdown") -> KnowledgeStore:
    if kind == "graphiti":
        from care_passport.knowledge.graphiti_store import GraphitiKnowledgeStore
        return GraphitiKnowledgeStore()
    if kind == "stub":
        from care_passport.knowledge.stub_store import StubKnowledgeStore
        return StubKnowledgeStore()
    from pathlib import Path

    from care_passport.config import settings
    from care_passport.knowledge.markdown_store import MarkdownKnowledgeStore

    return MarkdownKnowledgeStore(data_root=settings.data_root)


__all__ = [
    "KnowledgeStore",
    "get_store",
    "Episode",
    "IngestResult",
    "Message",
    "Document",
    "Passport",
    "HotMoments",
    "CompletenessReport",
    "TimelineEvent",
    "QueryAnswer",
]
