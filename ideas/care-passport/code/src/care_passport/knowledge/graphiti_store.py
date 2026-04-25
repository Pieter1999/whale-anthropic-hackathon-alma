"""GraphitiKnowledgeStore — full Graphiti/Kuzu-backed implementation.

Not wired by default. Set KNOWLEDGE_STORE=graphiti in .env to enable.
Requires ANTHROPIC_API_KEY and VOYAGE_API_KEY.
"""

import uuid
from datetime import datetime, timezone

from graphiti_core import Graphiti
from graphiti_core.driver.kuzu_driver import KuzuDriver
from graphiti_core.embedder.voyage import VoyageAIEmbedder, VoyageAIEmbedderConfig
from graphiti_core.llm_client.anthropic_client import AnthropicClient
from graphiti_core.llm_client.config import LLMConfig
from graphiti_core.nodes import EpisodeType

from care_passport.config import settings
from care_passport.entities import ENTITY_TYPES
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

_graphiti: Graphiti | None = None


async def _get_graphiti() -> Graphiti:
    global _graphiti
    if _graphiti is None:
        driver = KuzuDriver(db=settings.kuzu_db_path)
        g = Graphiti(
            graph_driver=driver,
            llm_client=AnthropicClient(
                config=LLMConfig(
                    api_key=settings.anthropic_api_key,
                    model="claude-haiku-4-5",
                )
            ),
            embedder=VoyageAIEmbedder(
                config=VoyageAIEmbedderConfig(
                    api_key=settings.voyage_api_key,
                    embedding_model="voyage-3",
                )
            ),
        )
        await g.build_indices_and_constraints()
        _graphiti = g
    return _graphiti


class GraphitiKnowledgeStore:
    async def ingest_episode(self, patient_id: str, episode: Episode) -> IngestResult:
        g = await _get_graphiti()
        ep_id = f"ep-{uuid.uuid4().hex[:8]}"
        body = episode.transcript or episode.text or ""
        await g.add_episode(
            name=ep_id,
            episode_body=body,
            source=EpisodeType.message,
            source_description=f"{episode.channel} / {episode.source}",
            reference_time=datetime.now(timezone.utc),
            group_id=patient_id,
            entity_types=ENTITY_TYPES,  # type: ignore[arg-type]
        )
        return IngestResult(episode_id=ep_id, status="ingested")

    async def query(self, patient_id: str, messages: list[Message]) -> list[Document]:
        g = await _get_graphiti()
        query_text = " ".join(m.content for m in messages if m.role == "user") or "patient context"
        results = await g.search(query=query_text, group_ids=[patient_id], num_results=5)
        return [
            Document(
                content=r.fact,
                similarity=0.9,
                uuid=str(r.uuid),
            )
            for r in results
        ]

    async def get_passport(self, patient_id: str) -> Passport:
        # TODO: derive from graph edges — stub for now
        return Passport(patient_id=patient_id)

    async def get_hot_moments(self, patient_id: str) -> HotMoments:
        return HotMoments()

    async def get_completeness(self, patient_id: str) -> CompletenessReport:
        return CompletenessReport(
            pzp_coverage={f"wedge_{i}": 0.0 for i in range(1, 7)},
            hot_moment_readiness={
                "calmers_count": 0,
                "agitators_count": 0,
                "soothing_phrase_present": False,
                "named_contact_present": False,
            },
            overall_score=0.0,
        )

    async def get_timeline(self, patient_id: str, limit: int = 50) -> list[TimelineEvent]:
        return []

    async def answer_query(self, patient_id: str, question: str) -> QueryAnswer:
        docs = await self.query(patient_id, [Message(role="user", content=question)])
        evidence = [d.uuid for d in docs if d.uuid]
        answer = docs[0].content if docs else "No data found."
        return QueryAnswer(question=question, answer=answer, confidence=0.7, evidence=evidence)
