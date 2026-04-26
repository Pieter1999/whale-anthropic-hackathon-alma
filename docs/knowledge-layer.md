# Knowledge Layer (lightweight)

Purpose: preserve the patient's voice as evidence-backed memory that HCPs and caretakers can query later. The system supports human judgement; it does not make legal, medical, or capacity decisions.

**Decision (2026-04-25):** dropped Postgres / pgvector / Supabase from the prototype. Too much DB ceremony for a 24-hour demo. The data model below is conceptual; the prototype stores everything as JSON files per patient and does retrieval in-process.

## Design Principles

- Store raw evidence first. Every generated memory must point back to a transcript span (audio ID + start/end) so a clinician can verify with the patient's actual words.
- Separate memory types. Don't collapse quotes, preferences, events, dates, and risk state into one summary blob.
- Append-only evidence + small derived views. The care passport can be regenerated; the transcript cannot.
- Show uncertainty by default. Answers should say "based on X notes" or "unclear/conflicting" rather than sounding authoritative.
- Keep the build boring: JSON files, LLM structured output, a single processing pass per voice note, retrieval by feeding the relevant slice to the LLM with a citation requirement.

## Memory Taxonomy (conceptual, not a schema)

1. **Raw transcript evidence** — the audio + transcript + chunk-level metadata. Source of truth, never overwritten.
2. **Semantic profile** — current best-known facts and preferences (identity, communication style, food, routines, fears, values, people/places, care preferences). Each item carries evidence links and confidence.
3. **Episodic timeline** — dated or approximate life/care events (falls, appointments, missed meds, anxiety episodes, family mentions, meaningful memories). Append-only.
4. **Temporal facts** — facts with validity windows or recurrence ("physio every Tuesday", "daughter visits monthly"). Recency matters.
5. **Risk / care-gap signals** — derived, non-diagnostic flags (missed meals, medication confusion, isolation, repeated distress). Always framed as "possible care gap signals", never clinical diagnosis.

## Prototype Storage (24h) — markdown-with-tails

**Decision (2026-04-25):** the structured layer is **semi-formal markdown**, one file per domain per patient, with structured tails on every fact. JSON is reserved for raw transcripts and the episodic timeline. No vector DB, no Postgres.

Why this shape:
- LLMs produce markdown-with-tails natively; they fight strict JSON when the content is nuanced ("he calls his wife mama" doesn't fit any pre-written schema).
- Humans can audit at a glance — every domain file opens in any editor.
- The same markdown pastes into Caren *Mijn verhaal* (strip the tails) and parses into FHIR PZP resources (read the tails).
- Demoable: in the pitch you can show the markdown updating live as a voice note is processed.

Folder per patient:

```
data/patients/<patient_id>/
  README.md                   # one-paragraph who-is-this
  personhood.md               # identity, life chapters, language, faith
  care-preferences.md         # bathing, food, communication, hygiene
  acp/
    01-daily-pleasure.md      # what makes life worth living
    02-daily-care.md          # how I want to be helped
    03-treatment-wishes.md    # hospital, medication, escalation ceilings
    04-coping-end-of-life.md  # how I cope, end-of-life wishes
    05-finances-legal.md      # money, mandate, representation
    06-housing-network.md     # where, with whom, social network
  hot-moments.md              # known triggers and calmers — Story 3 lives here
  social-network.md           # who matters, who to call (priority order)
  signals.md                  # things to watch, framed as observations
  timeline.jsonl              # append-only episodic events
  notes/
    n_001.json                # raw transcript + chunks (immutable)
    n_002.json
```

Each markdown file holds bullets with structured tails:

```markdown
# Care preferences — Greet de Vries

## Bathing
- Always start the wash with the left arm — starting on the right causes panic. {confidence: high, sources: [n_004#c_2], first_seen: 2026-04-12, last_confirmed: 2026-04-21}
- Hum the Wilhelmus during the wash — relaxes within seconds. {confidence: high, sources: [n_004#c_8, n_011#c_3]}
- Prefers a female caregiver for intimate care. {confidence: medium, sources: [n_007#c_1]}

## Eating and drinking
- Tea before breakfast, always. Coffee causes panic. {confidence: high, sources: [n_001#c_4, n_009#c_2]}
- Won't eat off green plates. {confidence: medium, sources: [family-2026-04-19], attributed: family/Mark}
```

Tail conventions:
- `confidence`: `high | medium | low`
- `sources`: list of `<note_id>#<chunk_id>` for patient-authored, or `<channel>-<date>` for family/staff
- `first_seen`, `last_confirmed`: ISO dates
- `status`: `active | needs_review | superseded` (default `active`)
- `attributed`: `family/<name>` or `staff/<role>` when not patient-authored
- `by`: chunk ID of the bullet that supersedes this one

## Processing Per Voice Note

1. **Ingest**: receive audio (WhatsApp webhook OR mock upload). Save the file. Create `notes/<note_id>.json` with status `received`.
2. **Transcribe**: speech-to-text with chunking (sentence-level or ~30s segments with start/end timestamps and stable chunk IDs).
3. **Extract**: one LLM call with the patient's existing markdown files in context. Output is a *patch*: which markdown files to update, which new bullets to add, which existing bullets to update (`last_confirmed`) or supersede.
4. **Apply patch**: write the markdown updates. Append to `timeline.jsonl` for episodic events. Conflicts stay as two bullets with `status: needs_review`.
5. **Done**: no separate "refresh views" step — the markdown *is* the view.

Run synchronously behind a "processing…" spinner. No queue.

## Retrieval For HCP Questions

1. **Classify** the question: preference, routine, values, recent events, risk, or out-of-scope (medical/legal decision → refuse).
2. **Pull** the relevant markdown slice: which domain files to load (e.g., a "what calms her" question loads `hot-moments.md` + `care-preferences.md`). Read recent timeline + raw transcript chunks if the question is about events or quotes.
3. **Answer** with one LLM call that must cite source IDs and quote the patient. Refuse if evidence is thin.
4. **Log** the question, answer, and cited sources for audit.

Answer shape:

```json
{
  "answer": "She appears to prefer tea before breakfast and quieter mornings.",
  "confidence": "medium",
  "evidence": [
    {"date": "2026-04-21", "quote": "I always feel better if I have my tea first.", "note_id": "n_123", "chunk_id": "c_4"}
  ],
  "uncertainty": "No evidence from the last 7 days confirms this still holds.",
  "safety_boundary": "Preference support, not a medical instruction."
}
```

## Safety Boundaries

- Every memory carries confidence and evidence count; low-confidence items are visible as "needs review", not care-passport truth.
- Conflicts: keep both sides with dates and quotes. UI says "conflicting evidence" rather than picking silently.
- Recency: profile answers weight `last_confirmed_at`; risk answers default to last 7–30 days.
- No source-less generation: every fact in the profile must trace to at least one transcript citation.
- Out-of-scope: refuse questions asking the AI to decide capacity, consent, treatment, discharge, medication changes, or legal representation.
- Privacy: per-patient data only; no cross-patient retrieval.
- Voice preservation: keep the patient's actual words in citations; don't only render clinical paraphrases.

## Stack (minimal)

- **Frontend**: Next.js App Router + Tailwind + shadcn/ui — single page with patient picker, care-passport view, Q&A box.
- **Backend**: Next.js API routes. No separate service.
- **LLM**: OpenAI or Anthropic SDK directly. Structured outputs for extraction and Q&A.
- **Speech**: OpenAI transcription (`gpt-4o-mini-transcribe`).
- **Storage**: local filesystem during the hackathon. (If hosting requires it, write to /tmp or an S3-like blob — but data is ephemeral demo data anyway.)
- **No DB. No vector store. No auth beyond a fake role switcher.**

## What To Build In 24h

Implement:
- Audio upload (or pasted transcript) → `notes/n_xxx.json` + a markdown patch applied to the patient folder.
- A `/api/passport/query` endpoint that classifies, retrieves the right markdown slice, and answers with citations. This is the single integration surface for both the dashboard (Luc) and the voice agent (Pieter).
- 2–3 seeded patients with rich transcripts so each user-story demo lands.

The dashboard, voice agent, and any export adapters all read from the same patient folder + call the same query API. Markdown is the source of truth.

Fake or skip:
- WhatsApp production integration → mock webhook or file upload.
- Diarization → seeded single-speaker transcripts.
- Conflict resolution → mark and show both sides.
- Risk scoring → LLM-labeled "possible care gap signals", no numbers.
- Consent/legal workflow → status badge + boundary copy, no real legal docs.
- Multi-patient scale → don't.
