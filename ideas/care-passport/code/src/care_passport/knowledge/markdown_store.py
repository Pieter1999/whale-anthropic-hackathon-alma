"""MarkdownKnowledgeStore — file-backed knowledge store using markdown-with-tails."""

import json
import logging
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal

import anthropic
from pydantic import BaseModel

from care_passport.knowledge.models import (
    CompletenessReport,
    Document,
    Episode,
    HotMoments,
    IngestResult,
    Message,
    NamedContact,
    Passport,
    PassportField,
    QueryAnswer,
    TimelineEvent,
)
from care_passport.knowledge.tails import Bullet, format_bullet, parse_bullet

logger = logging.getLogger(__name__)

_DOMAIN_FILES = [
    "personhood.md",
    "care-preferences.md",
    "hot-moments.md",
    "social-network.md",
    "signals.md",
    "acp/01-daily-pleasure.md",
    "acp/02-daily-care.md",
    "acp/03-treatment-wishes.md",
    "acp/04-coping-end-of-life.md",
    "acp/05-finances-legal.md",
    "acp/06-housing-network.md",
]

_ACP_WEDGE_FILES = [
    "acp/01-daily-pleasure.md",
    "acp/02-daily-care.md",
    "acp/03-treatment-wishes.md",
    "acp/04-coping-end-of-life.md",
    "acp/05-finances-legal.md",
    "acp/06-housing-network.md",
]

_TODAY = lambda: datetime.now(timezone.utc).date().isoformat()


class PatchOp(BaseModel):
    op: Literal["add", "update_confirmed", "supersede"]
    file: str
    section: str | None = None
    text: str | None = None
    confidence: Literal["high", "medium", "low"] = "medium"
    source_ids: list[str] = []
    attributed: str | None = None
    match_text: str | None = None


class MarkdownKnowledgeStore:
    def __init__(self, data_root: Path, anthropic_client: anthropic.AsyncAnthropic | None = None):
        self.data_root = data_root
        self._client = anthropic_client or anthropic.AsyncAnthropic()

    def _patient_dir(self, patient_id: str) -> Path:
        return self.data_root / patient_id

    def _md_path(self, patient_id: str, filename: str) -> Path:
        return self._patient_dir(patient_id) / filename

    def _notes_dir(self, patient_id: str) -> Path:
        return self._patient_dir(patient_id) / "notes"

    def _timeline_path(self, patient_id: str) -> Path:
        return self._patient_dir(patient_id) / "timeline.jsonl"

    def _read_md(self, patient_id: str, filename: str) -> str:
        p = self._md_path(patient_id, filename)
        return p.read_text() if p.exists() else ""

    def _write_md(self, patient_id: str, filename: str, content: str) -> None:
        p = self._md_path(patient_id, filename)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content)

    def _all_md_content(self, patient_id: str) -> str:
        parts = []
        for fname in _DOMAIN_FILES:
            content = self._read_md(patient_id, fname)
            if content:
                parts.append(f"### FILE: {fname}\n{content}")
        return "\n\n".join(parts)

    # ------------------------------------------------------------------
    # Ingest
    # ------------------------------------------------------------------

    async def ingest_episode(self, patient_id: str, episode: Episode) -> IngestResult:
        episode_id = f"n_{uuid.uuid4().hex[:6]}"
        note_path = self._notes_dir(patient_id) / f"{episode_id}.json"
        note_path.parent.mkdir(parents=True, exist_ok=True)

        episode_text = episode.transcript or episode.text or ""
        attribution = episode.attribution or {}
        attr_str = attribution.get("kind", "patient")
        if "name" in attribution:
            attr_str = f"{attr_str}/{attribution['name']}"

        note_data = {
            "id": episode_id,
            "source": episode.source,
            "channel": episode.channel,
            "captured_at": episode.captured_at,
            "attribution": attribution,
            "text": episode_text,
            "status": "received",
        }
        note_path.write_text(json.dumps(note_data, indent=2))

        if episode_text.strip():
            await self._extract_and_apply(patient_id, episode_id, episode_text, attr_str)

        event = {
            "event_id": episode_id,
            "patient_id": patient_id,
            "kind": episode.channel,
            "summary": episode_text[:120],
            "occurred_at": episode.captured_at,
            "channel": episode.channel,
            "attribution": attribution,
        }
        with self._timeline_path(patient_id).open("a") as f:
            f.write(json.dumps(event) + "\n")

        return IngestResult(episode_id=episode_id, status="ingested")

    async def _extract_and_apply(
        self, patient_id: str, episode_id: str, text: str, attribution: str
    ) -> None:
        current_md = self._all_md_content(patient_id)
        today = _TODAY()

        system = (
            "You are a care-passport extraction assistant. "
            "Given the current markdown state of a patient's care passport and a new episode, "
            "output a JSON list of patch operations to apply. "
            "Each op has: op (add|update_confirmed|supersede), file (relative path), "
            "section (markdown heading to add bullet under, for add ops), "
            "text (bullet text without dash prefix), "
            "confidence (high|medium|low), source_ids (list), attributed (optional), "
            "match_text (for update_confirmed/supersede: substring of existing bullet to match). "
            "\n\nFILE ROUTING RULES — follow exactly:\n"
            "- What calms the patient (music, touch, humming, rituals, tea, animals): file=hot-moments.md, section=Calmers\n"
            "- What upsets/triggers the patient (things to avoid, approach angles, words, sounds): file=hot-moments.md, section=Agitators and triggers\n"
            "- Soothing phrases to say: file=hot-moments.md, section=Soothing phrase\n"
            "- Named emergency/family contacts: file=hot-moments.md, section=Named contact\n"
            "- Daily routines, food/drink preferences, hygiene: file=care-preferences.md\n"
            "- Identity, language, faith, values: file=personhood.md\n"
            "- Social network (family, friends): file=social-network.md\n"
            "- Daily pleasure / what makes life worth living: file=acp/01-daily-pleasure.md\n"
            "- How they want to be helped / daily care: file=acp/02-daily-care.md\n"
            "- Treatment wishes, hospital preferences: file=acp/03-treatment-wishes.md\n"
            "- Coping with illness, end-of-life wishes: file=acp/04-coping-end-of-life.md\n"
            "- Finances, legal, power of attorney: file=acp/05-finances-legal.md\n"
            "- Housing preferences, network: file=acp/06-housing-network.md\n"
            "- Observable signals/concerns (sleep, medication, isolation): file=signals.md\n"
            "\nOnly extract meaningful care-relevant facts. Do not fabricate. "
            "Output ONLY the JSON array, no prose."
        )

        user = (
            f"CURRENT PATIENT MARKDOWN:\n{current_md}\n\n"
            f"NEW EPISODE (id={episode_id}, attribution={attribution}):\n{text}\n\n"
            f"Output JSON patch ops. Today is {today}."
        )

        try:
            resp = await self._client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=2048,
                system=system,
                messages=[{"role": "user", "content": user}],
            )
            raw = resp.content[0].text.strip()
            # strip markdown code fences if present
            raw = re.sub(r"^```(?:json)?\s*", "", raw)
            raw = re.sub(r"\s*```$", "", raw)
            ops = [PatchOp(**o) for o in json.loads(raw)]
            for op in ops:
                op.source_ids = [episode_id] if not op.source_ids else op.source_ids
                if not op.attributed:
                    op.attributed = attribution if attribution != "patient" else None
            self._apply_patch(patient_id, ops, today)
        except Exception:
            logger.exception("[markdown_store] extraction failed for episode %s", episode_id)

    def _apply_patch(self, patient_id: str, ops: list[PatchOp], today: str) -> None:
        for op in ops:
            try:
                self._apply_one(patient_id, op, today)
            except Exception:
                logger.exception("[markdown_store] patch op failed: %s", op)

    def _apply_one(self, patient_id: str, op: PatchOp, today: str) -> None:
        content = self._read_md(patient_id, op.file)

        if op.op == "add":
            bullet = Bullet(
                text=op.text or "",
                confidence=op.confidence,
                sources=op.source_ids,
                first_seen=today,
                last_confirmed=today,
                attributed=op.attributed,
            )
            content = self._insert_bullet(content, op.section, format_bullet(bullet))
            self._write_md(patient_id, op.file, content)

        elif op.op == "update_confirmed":
            content = self._update_bullet_confirmed(content, op.match_text or op.text or "", today)
            self._write_md(patient_id, op.file, content)

        elif op.op == "supersede":
            new_bullet = Bullet(
                text=op.text or "",
                confidence=op.confidence,
                sources=op.source_ids,
                first_seen=today,
                last_confirmed=today,
                attributed=op.attributed,
            )
            content = self._supersede_bullet(content, op.match_text or "", format_bullet(new_bullet))
            self._write_md(patient_id, op.file, content)

    def _insert_bullet(self, content: str, section: str | None, bullet_line: str) -> str:
        if not section:
            return content + "\n" + bullet_line + "\n"

        lines = content.splitlines(keepends=True)
        insert_at = len(lines)
        in_section = False

        for i, line in enumerate(lines):
            if re.match(r"^#{1,3}\s+" + re.escape(section), line, re.IGNORECASE):
                in_section = True
                continue
            if in_section and re.match(r"^#{1,3}\s+", line):
                insert_at = i
                break
            if in_section and i == len(lines) - 1:
                insert_at = len(lines)

        if not in_section:
            content += f"\n## {section}\n{bullet_line}\n"
            return content

        lines.insert(insert_at, bullet_line + "\n")
        return "".join(lines)

    def _update_bullet_confirmed(self, content: str, match_text: str, today: str) -> str:
        lines = content.splitlines(keepends=True)
        for i, line in enumerate(lines):
            b = parse_bullet(line)
            if b and match_text.lower() in b.text.lower():
                b.last_confirmed = today
                lines[i] = format_bullet(b) + "\n"
                break
        return "".join(lines)

    def _supersede_bullet(self, content: str, match_text: str, new_bullet_line: str) -> str:
        lines = content.splitlines(keepends=True)
        for i, line in enumerate(lines):
            b = parse_bullet(line)
            if b and match_text.lower() in b.text.lower():
                b.status = "superseded"
                lines[i] = format_bullet(b) + "\n"
                lines.insert(i + 1, new_bullet_line + "\n")
                break
        return "".join(lines)

    # ------------------------------------------------------------------
    # Query (KB hot path — no LLM classifier, just load relevant files)
    # ------------------------------------------------------------------

    async def query(self, patient_id: str, messages: list[Message]) -> list[Document]:
        files_to_load = ["personhood.md", "care-preferences.md", "hot-moments.md"]
        docs = []
        for fname in files_to_load:
            content = self._read_md(patient_id, fname)
            if content:
                docs.append(Document(content=content, similarity=1.0, uuid=fname))
        return docs

    # ------------------------------------------------------------------
    # Reads
    # ------------------------------------------------------------------

    async def get_passport(self, patient_id: str) -> Passport:
        fields: list[PassportField] = []
        file_category_map = {
            "personhood.md": "identity",
            "care-preferences.md": "preferences",
            "social-network.md": "social",
            "signals.md": "signals",
            "acp/01-daily-pleasure.md": "values",
            "acp/02-daily-care.md": "preferences",
            "acp/03-treatment-wishes.md": "values",
            "acp/04-coping-end-of-life.md": "values",
            "acp/05-finances-legal.md": "legal",
            "acp/06-housing-network.md": "social",
        }
        for fname, category in file_category_map.items():
            content = self._read_md(patient_id, fname)
            for line in content.splitlines():
                b = parse_bullet(line)
                if b and b.status == "active":
                    fields.append(
                        PassportField(
                            category=category,
                            statement=b.text,
                            confidence={"high": 0.9, "medium": 0.6, "low": 0.3}.get(b.confidence, 0.5),
                            last_confirmed_at=b.last_confirmed,
                            source_ids=b.sources,
                        )
                    )
        return Passport(patient_id=patient_id, fields=fields)

    async def get_hot_moments(self, patient_id: str) -> HotMoments:
        content = self._read_md(patient_id, "hot-moments.md")
        calmers: list[str] = []
        agitators: list[str] = []
        soothing_phrase: str | None = None
        named_contact: NamedContact | None = None
        current_section = ""

        for line in content.splitlines():
            h = re.match(r"^#{1,3}\s+(.*)", line)
            if h:
                current_section = h.group(1).lower()
                continue
            b = parse_bullet(line)
            if not b or b.status != "active":
                continue
            sec = current_section
            if "calmer" in sec or "calm" in sec:
                calmers.append(b.text)
            elif "agitat" in sec or "trigger" in sec or "avoid" in sec:
                agitators.append(b.text)
            elif "soothing" in sec or "phrase" in sec:
                soothing_phrase = b.text
            elif "contact" in sec or "network" in sec:
                # expect text like "Mark (son) – +31 6 12345678"
                parts = re.split(r"\s*[–\-—]\s*", b.text, maxsplit=1)
                name_part = parts[0].strip()
                phone = parts[1].strip() if len(parts) > 1 else None
                rel_m = re.search(r"\(([^)]+)\)", name_part)
                rel = rel_m.group(1) if rel_m else "contact"
                name = re.sub(r"\s*\([^)]+\)", "", name_part).strip()
                named_contact = NamedContact(name=name, relationship=rel, phone=phone)

        return HotMoments(
            calmers=calmers,
            agitators=agitators,
            soothing_phrase=soothing_phrase,
            named_contact=named_contact,
        )

    async def get_completeness(self, patient_id: str) -> CompletenessReport:
        acp_labels = [
            "daily_pleasure",
            "daily_care",
            "treatment_wishes",
            "coping_end_of_life",
            "finances_legal",
            "housing_network",
        ]
        pzp_coverage: dict[str, float] = {}
        for i, label in enumerate(acp_labels, 1):
            fname = f"acp/0{i}-{label.replace('_', '-')}.md"
            content = self._read_md(patient_id, fname)
            active = sum(
                1 for line in content.splitlines()
                if (b := parse_bullet(line)) and b.status == "active"
            )
            pzp_coverage[f"wedge_{i}_{label}"] = min(1.0, active / 3.0)

        hm = await self.get_hot_moments(patient_id)
        hmr = {
            "calmers_count": len(hm.calmers),
            "agitators_count": len(hm.agitators),
            "soothing_phrase_present": hm.soothing_phrase is not None,
            "named_contact_present": hm.named_contact is not None,
        }
        wedges_covered = sum(1 for v in pzp_coverage.values() if v > 0)
        pzp_score = wedges_covered / 6
        hm_score = sum([
            min(1.0, hmr["calmers_count"] / 3),
            min(1.0, hmr["agitators_count"] / 3),
            1.0 if hmr["soothing_phrase_present"] else 0.0,
            1.0 if hmr["named_contact_present"] else 0.0,
        ]) / 4

        overall = round(0.6 * pzp_score + 0.4 * hm_score, 3)
        return CompletenessReport(
            pzp_coverage=pzp_coverage,
            hot_moment_readiness=hmr,
            overall_score=overall,
        )

    async def get_timeline(self, patient_id: str, limit: int = 50) -> list[TimelineEvent]:
        tl_path = self._timeline_path(patient_id)
        if not tl_path.exists():
            return []
        events = []
        for line in tl_path.read_text().splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                events.append(TimelineEvent(**json.loads(line)))
            except Exception:
                pass
        return list(reversed(events))[:limit]

    async def answer_query(self, patient_id: str, question: str) -> QueryAnswer:
        relevant_files = ["personhood.md", "care-preferences.md", "hot-moments.md", "social-network.md"]
        context_parts = []
        for fname in relevant_files:
            c = self._read_md(patient_id, fname)
            if c:
                context_parts.append(f"### {fname}\n{c}")
        context = "\n\n".join(context_parts) or "No data available."

        system = (
            "You are a care-passport assistant helping healthcare professionals understand a patient. "
            "Answer the question using ONLY the information in the provided markdown. "
            "Cite source IDs from the tails (e.g. n_001) when available. "
            "If evidence is thin, say so. "
            "Respond as JSON: {answer, confidence ('high'|'medium'|'low'), evidence (list of source ids), uncertainty (str or null)}"
        )
        user = f"PATIENT DATA:\n{context}\n\nQUESTION: {question}"

        try:
            resp = await self._client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=1024,
                system=system,
                messages=[{"role": "user", "content": user}],
            )
            raw = resp.content[0].text.strip()
            raw = re.sub(r"^```(?:json)?\s*", "", raw)
            raw = re.sub(r"\s*```$", "", raw)
            data = json.loads(raw)
            conf_map = {"high": 0.9, "medium": 0.6, "low": 0.3}
            return QueryAnswer(
                question=question,
                answer=data.get("answer", ""),
                confidence=conf_map.get(data.get("confidence", "medium"), 0.6),
                evidence=data.get("evidence", []),
                uncertainty=data.get("uncertainty"),
            )
        except Exception:
            logger.exception("[markdown_store] answer_query failed")
            return QueryAnswer(
                question=question,
                answer="Unable to answer at this time.",
                confidence=0.0,
                uncertainty="Internal error during query.",
            )
