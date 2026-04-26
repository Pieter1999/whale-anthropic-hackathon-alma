"""Thin Graphiti wrapper using Kuzu as embedded graph backend."""

from datetime import datetime, timezone

from graphiti_core import Graphiti
from graphiti_core.driver.kuzu_driver import KuzuDriver
from graphiti_core.embedder.voyage import VoyageAIEmbedder, VoyageAIEmbedderConfig
from graphiti_core.llm_client.anthropic_client import AnthropicClient
from graphiti_core.llm_client.config import LLMConfig
from graphiti_core.nodes import EpisodeType

from care_passport.config import settings
from care_passport.entities import ENTITY_TYPES

_graphiti: Graphiti | None = None


async def get_graphiti() -> Graphiti:
    global _graphiti
    if _graphiti is None:
        _graphiti = await init_graphiti()
    return _graphiti


async def init_graphiti() -> Graphiti:
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
    return g


async def add_episode(patient_id: str, text: str, name: str = "message") -> None:
    g = await get_graphiti()
    await g.add_episode(
        name=name,
        episode_body=text,
        source=EpisodeType.message,
        source_description="WhatsApp message",
        reference_time=datetime.now(timezone.utc),
        group_id=patient_id,
        entity_types=ENTITY_TYPES,  # type: ignore[arg-type]
    )


async def search(patient_id: str, query: str, limit: int = 10) -> list[dict]:
    g = await get_graphiti()
    results = await g.search(
        query=query,
        group_ids=[patient_id],
        num_results=limit,
    )
    return [
        {
            "uuid": str(r.uuid),
            "fact": r.fact,
            "valid_at": r.valid_at.isoformat() if r.valid_at else None,
        }
        for r in results
    ]
