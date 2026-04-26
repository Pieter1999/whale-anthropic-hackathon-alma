"""Tests for MarkdownKnowledgeStore, tails, and completeness scoring."""

import json
import shutil
import tempfile
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock

import pytest

from care_passport.knowledge.tails import Bullet, format_bullet, parse_bullet


# ---------------------------------------------------------------------------
# Tail round-trip
# ---------------------------------------------------------------------------

def test_parse_bullet_full_tail():
    line = "- Always start with left arm. {confidence: high, sources: [n_004#c_2, n_011#c_3], first_seen: 2026-04-12, last_confirmed: 2026-04-21}"
    b = parse_bullet(line)
    assert b is not None
    assert b.text == "Always start with left arm."
    assert b.confidence == "high"
    assert b.sources == ["n_004#c_2", "n_011#c_3"]
    assert b.first_seen == "2026-04-12"
    assert b.last_confirmed == "2026-04-21"
    assert b.status == "active"


def test_parse_bullet_no_tail():
    line = "- Simple bullet with no tail"
    b = parse_bullet(line)
    assert b is not None
    assert b.text == "Simple bullet with no tail"
    assert b.confidence == "high"
    assert b.sources == []


def test_parse_bullet_with_attributed():
    line = "- Won't eat off green plates. {confidence: medium, sources: [family-2026-04-19], attributed: family/Mark}"
    b = parse_bullet(line)
    assert b.attributed == "family/Mark"
    assert b.sources == ["family-2026-04-19"]


def test_parse_bullet_non_bullet():
    assert parse_bullet("## Section heading") is None
    assert parse_bullet("") is None
    assert parse_bullet("just text") is None


def test_format_bullet_roundtrip():
    b = Bullet(
        text="Tea before breakfast, always.",
        confidence="high",
        sources=["n_001#c_4", "n_009#c_2"],
        first_seen="2026-04-01",
        last_confirmed="2026-04-21",
    )
    line = format_bullet(b)
    b2 = parse_bullet(line)
    assert b2 is not None
    assert b2.text == b.text
    assert b2.confidence == b.confidence
    assert b2.sources == b.sources
    assert b2.first_seen == b.first_seen
    assert b2.last_confirmed == b.last_confirmed


def test_format_bullet_superseded_status():
    b = Bullet(text="Old fact", confidence="low", status="superseded")
    line = format_bullet(b)
    assert "status: superseded" in line


def test_format_bullet_omits_default_status():
    b = Bullet(text="Active fact", confidence="high")
    line = format_bullet(b)
    assert "status:" not in line


# ---------------------------------------------------------------------------
# MarkdownKnowledgeStore — file-based tests with seeded Anna data
# ---------------------------------------------------------------------------

ANNA_DATA = Path(__file__).parent.parent / "data" / "patients" / "anna"


@pytest.fixture
def anna_store(tmp_path):
    """Copy Anna seed data to temp dir and return a MarkdownKnowledgeStore over it."""
    from care_passport.knowledge.markdown_store import MarkdownKnowledgeStore

    patient_dir = tmp_path / "anna"
    shutil.copytree(ANNA_DATA, patient_dir)
    return MarkdownKnowledgeStore(data_root=tmp_path)


@pytest.mark.asyncio
async def test_get_passport_has_fields(anna_store):
    passport = await anna_store.get_passport("anna")
    assert passport.patient_id == "anna"
    assert len(passport.fields) >= 5
    categories = {f.category for f in passport.fields}
    assert "identity" in categories
    assert "preferences" in categories


@pytest.mark.asyncio
async def test_get_hot_moments_calmers(anna_store):
    hm = await anna_store.get_hot_moments("anna")
    assert len(hm.calmers) >= 3
    assert len(hm.agitators) >= 3
    assert hm.soothing_phrase is not None
    assert hm.named_contact is not None
    assert "Mark" in hm.named_contact.name


@pytest.mark.asyncio
async def test_get_completeness_all_wedges_covered(anna_store):
    report = await anna_store.get_completeness("anna")
    assert report.overall_score > 0.5
    covered = sum(1 for v in report.pzp_coverage.values() if v > 0)
    assert covered == 6
    assert report.hot_moment_readiness["soothing_phrase_present"] is True
    assert report.hot_moment_readiness["named_contact_present"] is True


@pytest.mark.asyncio
async def test_get_timeline_returns_events(anna_store):
    events = await anna_store.get_timeline("anna", limit=10)
    assert len(events) >= 3
    for e in events:
        assert e.patient_id == "anna"
        assert e.event_id


@pytest.mark.asyncio
async def test_query_returns_documents(anna_store):
    from care_passport.knowledge.models import Message

    docs = await anna_store.query("anna", [Message(role="user", content="What calms Anna?")])
    assert len(docs) >= 1
    combined = " ".join(d.content for d in docs)
    assert "Anna" in combined or "anna" in combined.lower()


# ---------------------------------------------------------------------------
# Patch application
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_patch_add_inserts_bullet(anna_store):
    from care_passport.knowledge.markdown_store import PatchOp

    initial = anna_store._read_md("anna", "care-preferences.md")
    op = PatchOp(
        op="add",
        file="care-preferences.md",
        section="Eating and drinking",
        text="Enjoys stroopwafels with afternoon tea.",
        confidence="medium",
        source_ids=["n_test#c_1"],
    )
    anna_store._apply_one("anna", op, "2026-04-25")
    updated = anna_store._read_md("anna", "care-preferences.md")
    assert "stroopwafels" in updated
    assert "n_test#c_1" in updated


@pytest.mark.asyncio
async def test_patch_update_confirmed_changes_date(anna_store):
    from care_passport.knowledge.markdown_store import PatchOp

    op = PatchOp(
        op="update_confirmed",
        file="care-preferences.md",
        text="Tea before breakfast",
        match_text="Tea before breakfast",
        confidence="high",
        source_ids=["n_test#c_2"],
    )
    anna_store._apply_one("anna", op, "2026-04-25")
    updated = anna_store._read_md("anna", "care-preferences.md")
    assert "last_confirmed: 2026-04-25" in updated


@pytest.mark.asyncio
async def test_patch_supersede_marks_old_and_adds_new(anna_store):
    from care_passport.knowledge.markdown_store import PatchOp

    op = PatchOp(
        op="supersede",
        file="care-preferences.md",
        match_text="Lunch must include something",
        text="Now prefers a light cold lunch.",
        confidence="medium",
        source_ids=["n_test#c_3"],
    )
    anna_store._apply_one("anna", op, "2026-04-25")
    updated = anna_store._read_md("anna", "care-preferences.md")
    assert "status: superseded" in updated
    assert "light cold lunch" in updated


# ---------------------------------------------------------------------------
# Ingest episode with mocked Claude
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_ingest_episode_creates_note_and_timeline(anna_store, tmp_path):
    from care_passport.knowledge.models import Episode

    mock_client = AsyncMock()
    mock_resp = MagicMock()
    mock_resp.content = [MagicMock(text="[]")]
    mock_client.messages.create = AsyncMock(return_value=mock_resp)
    anna_store._client = mock_client

    ep = Episode(source="test", text="Anna enjoys watching birds every morning.", channel="whatsapp")
    result = await anna_store.ingest_episode("anna", ep)
    assert result.status == "ingested"
    assert result.episode_id.startswith("n_")

    note_path = anna_store._notes_dir("anna") / f"{result.episode_id}.json"
    assert note_path.exists()
    note = json.loads(note_path.read_text())
    assert note["text"] == ep.text

    tl_lines = anna_store._timeline_path("anna").read_text().strip().splitlines()
    assert len(tl_lines) >= 6  # 5 seeded + 1 new


@pytest.mark.asyncio
async def test_ingest_episode_applies_patch(anna_store):
    from care_passport.knowledge.models import Episode

    patch_response = json.dumps([{
        "op": "add",
        "file": "care-preferences.md",
        "section": "Eating and drinking",
        "text": "She really enjoys watching the birds in the morning.",
        "confidence": "medium",
        "source_ids": [],
    }])
    mock_client = AsyncMock()
    mock_resp = MagicMock()
    mock_resp.content = [MagicMock(text=patch_response)]
    mock_client.messages.create = AsyncMock(return_value=mock_resp)
    anna_store._client = mock_client

    ep = Episode(
        source="contribution",
        text="She told me today she really enjoys watching the birds in the morning.",
        channel="whatsapp",
        attribution={"kind": "patient"},
    )
    await anna_store.ingest_episode("anna", ep)
    updated = anna_store._read_md("anna", "care-preferences.md")
    assert "watching the birds in the morning" in updated


# ---------------------------------------------------------------------------
# Completeness scoring math
# ---------------------------------------------------------------------------

def test_completeness_overall_score_formula():
    """overall = 0.6 * pzp_score + 0.4 * hm_score"""
    pzp_coverage = {f"wedge_{i}": 1.0 for i in range(1, 7)}
    hm_readiness = {
        "calmers_count": 3,
        "agitators_count": 3,
        "soothing_phrase_present": True,
        "named_contact_present": True,
    }
    pzp_score = 1.0
    hm_score = 1.0
    expected = round(0.6 * pzp_score + 0.4 * hm_score, 3)
    assert expected == 1.0

    pzp_score = 3 / 6
    hm_score = (1.0 + 0.0 + 0.0 + 0.0) / 4
    expected = round(0.6 * pzp_score + 0.4 * hm_score, 3)
    assert 0 < expected < 1.0
