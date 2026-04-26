"""Activity unit tests — exercises ingest_episode_activity directly."""

import json
import shutil
import tempfile
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

import anthropic
import pytest

from care_passport.activities import IngestEpisodeInput, ingest_episode_activity
from care_passport.knowledge.models import Episode, IngestResult


# ---------------------------------------------------------------------------
# ingest_episode_activity — store delegation
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_activity_delegates_to_store():
    mock_store = AsyncMock()
    mock_store.ingest_episode = AsyncMock(return_value=IngestResult(episode_id="ep-test"))

    with patch("care_passport.activities._store", mock_store):
        result = await ingest_episode_activity(
            IngestEpisodeInput(
                patient_id="anna",
                payload={
                    "source": "vapi_call",
                    "transcript": "She was calm today.",
                    "channel": "voice",
                    "captured_at": "2026-04-25T09:00:00Z",
                },
            )
        )

    assert result["episode_id"] == "ep-test"
    assert result["status"] == "ingested"
    mock_store.ingest_episode.assert_awaited_once()
    call_episode: Episode = mock_store.ingest_episode.call_args[0][1]
    assert call_episode.source == "vapi_call"
    assert call_episode.channel == "voice"


@pytest.mark.asyncio
async def test_activity_passes_correct_patient_id():
    mock_store = AsyncMock()
    mock_store.ingest_episode = AsyncMock(return_value=IngestResult(episode_id="ep-xyz"))

    with patch("care_passport.activities._store", mock_store):
        await ingest_episode_activity(
            IngestEpisodeInput(
                patient_id="greet-001",
                payload={"source": "contribution", "text": "hello", "channel": "whatsapp"},
            )
        )

    patient_id_arg = mock_store.ingest_episode.call_args[0][0]
    assert patient_id_arg == "greet-001"


@pytest.mark.asyncio
async def test_activity_constructs_episode_with_attribution():
    mock_store = AsyncMock()
    mock_store.ingest_episode = AsyncMock(return_value=IngestResult(episode_id="ep-att"))

    with patch("care_passport.activities._store", mock_store):
        await ingest_episode_activity(
            IngestEpisodeInput(
                patient_id="anna",
                payload={
                    "source": "contribution",
                    "text": "She likes music.",
                    "channel": "shift_app",
                    "attribution": {"kind": "staff", "name": "Nurse Jo"},
                },
            )
        )

    episode: Episode = mock_store.ingest_episode.call_args[0][1]
    assert episode.attribution == {"kind": "staff", "name": "Nurse Jo"}
    assert episode.channel == "shift_app"


# ---------------------------------------------------------------------------
# ingest_episode_activity → real MarkdownKnowledgeStore (mocked Claude)
# proving the calmer-surfacing path
# ---------------------------------------------------------------------------

ANNA_DATA = Path(__file__).parent.parent / "data" / "patients" / "anna"


@pytest.mark.asyncio
async def test_wilhelmus_calmer_lands_in_hot_moments():
    """An episode containing 'Wilhelmus calms her' must produce a calmers entry."""
    tmp = Path(tempfile.mkdtemp())
    # Start with an empty patient dir (no pre-seeded hot-moments)
    patient_dir = tmp / "greet"
    patient_dir.mkdir()

    patch_response = json.dumps([{
        "op": "add",
        "file": "hot-moments.md",
        "section": "Calmers",
        "text": "Humming the Wilhelmus during washing calms her immediately.",
        "confidence": "high",
        "source_ids": ["n_test01"],
    }])

    mock_client = AsyncMock()
    mock_resp = MagicMock()
    mock_resp.content = [MagicMock(text=patch_response)]
    mock_client.messages.create = AsyncMock(return_value=mock_resp)

    from care_passport.knowledge.markdown_store import MarkdownKnowledgeStore
    store = MarkdownKnowledgeStore(data_root=tmp, anthropic_client=mock_client)

    ep = Episode(
        source="contribution",
        text="When I get washed it helps if someone hums the Wilhelmus.",
        channel="whatsapp",
        attribution={"kind": "patient"},
    )
    await store.ingest_episode("greet", ep)

    hm = await store.get_hot_moments("greet")
    assert len(hm.calmers) >= 1
    calmer_text = " ".join(hm.calmers).lower()
    assert "wilhelmus" in calmer_text

    shutil.rmtree(tmp)


@pytest.mark.asyncio
async def test_right_side_agitator_lands_in_hot_moments():
    """An episode about right-side approach triggering flinching → agitators."""
    tmp = Path(tempfile.mkdtemp())
    patient_dir = tmp / "greet"
    patient_dir.mkdir()

    patch_response = json.dumps([{
        "op": "add",
        "file": "hot-moments.md",
        "section": "Agitators and triggers",
        "text": "Flinches when approached from the right side — always approach from the left.",
        "confidence": "high",
        "source_ids": ["n_test02"],
    }])

    mock_client = AsyncMock()
    mock_resp = MagicMock()
    mock_resp.content = [MagicMock(text=patch_response)]
    mock_client.messages.create = AsyncMock(return_value=mock_resp)

    from care_passport.knowledge.markdown_store import MarkdownKnowledgeStore
    store = MarkdownKnowledgeStore(data_root=tmp, anthropic_client=mock_client)

    ep = Episode(
        source="contribution",
        text="Greet flinches when approached from the right side.",
        channel="shift_app",
        attribution={"kind": "staff"},
    )
    await store.ingest_episode("greet", ep)

    hm = await store.get_hot_moments("greet")
    assert len(hm.agitators) >= 1
    agitator_text = " ".join(hm.agitators).lower()
    assert "right" in agitator_text

    shutil.rmtree(tmp)


# ---------------------------------------------------------------------------
# Auth/permission errors must NOT be swallowed — they must propagate
# ---------------------------------------------------------------------------

def _auth_error() -> anthropic.AuthenticationError:
    import httpx
    req = httpx.Request("POST", "https://api.anthropic.com/v1/messages")
    resp = httpx.Response(401, request=req)
    return anthropic.AuthenticationError(message="invalid x-api-key", response=resp, body={})


def _perm_error() -> anthropic.PermissionDeniedError:
    import httpx
    req = httpx.Request("POST", "https://api.anthropic.com/v1/messages")
    resp = httpx.Response(403, request=req)
    return anthropic.PermissionDeniedError(message="permission denied", response=resp, body={})


@pytest.mark.asyncio
async def test_authentication_error_is_not_swallowed():
    """AuthenticationError re-raises so the Temporal activity fails visibly."""
    tmp = Path(tempfile.mkdtemp())
    (tmp / "greet").mkdir()

    mock_client = AsyncMock()
    mock_client.messages.create = AsyncMock(side_effect=_auth_error())

    from care_passport.knowledge.markdown_store import MarkdownKnowledgeStore
    store = MarkdownKnowledgeStore(data_root=tmp, anthropic_client=mock_client)

    ep = Episode(source="contribution", text="She likes birds.", channel="whatsapp")
    with pytest.raises(anthropic.AuthenticationError):
        await store.ingest_episode("greet", ep)

    shutil.rmtree(tmp)


@pytest.mark.asyncio
async def test_permission_denied_error_is_not_swallowed():
    """PermissionDeniedError re-raises so the Temporal activity fails visibly."""
    tmp = Path(tempfile.mkdtemp())
    (tmp / "greet").mkdir()

    mock_client = AsyncMock()
    mock_client.messages.create = AsyncMock(side_effect=_perm_error())

    from care_passport.knowledge.markdown_store import MarkdownKnowledgeStore
    store = MarkdownKnowledgeStore(data_root=tmp, anthropic_client=mock_client)

    ep = Episode(source="contribution", text="She likes birds.", channel="whatsapp")
    with pytest.raises(anthropic.PermissionDeniedError):
        await store.ingest_episode("greet", ep)

    shutil.rmtree(tmp)


@pytest.mark.asyncio
async def test_generic_error_writes_sentinel_not_raises():
    """Non-auth errors (e.g. JSON parse failure) write a sentinel to signals.md and return."""
    tmp = Path(tempfile.mkdtemp())
    (tmp / "greet").mkdir()

    mock_client = AsyncMock()
    mock_client.messages.create = AsyncMock(
        side_effect=RuntimeError("network timeout")
    )

    from care_passport.knowledge.markdown_store import MarkdownKnowledgeStore
    store = MarkdownKnowledgeStore(data_root=tmp, anthropic_client=mock_client)

    ep = Episode(source="contribution", text="She likes birds.", channel="whatsapp")
    result = await store.ingest_episode("greet", ep)

    assert result.status == "ingested"
    signals = store._read_md("greet", "signals.md")
    assert "Extraction failed" in signals
    assert "needs_review" in signals

    shutil.rmtree(tmp)
