# Conversation fab9cddf-016b-4d99-9a05-7d293e150409

- Source: `claude`
- User: `pascal`
- System: `Pascals-MBP.local`
- Started: `2026-04-25T18:52:58.671Z`
- CWD: `/Users/pascal/Code/business/experiments/anthropic-hackathon`

## User

_`2026-04-25T18:52:58.671Z`_

<command-name>/clear</command-name>
            <command-message>clear</command-message>
            <command-args></command-args>

## User

_`2026-04-25T18:52:59.444Z`_

nocl

## Agent

_`2026-04-25T18:53:07.486Z`_

No response requested.

## User

_`2026-04-25T18:53:31.924Z`_

so... ignore the current knowledge layer please but read the other context. 

Then let's discuss how we can design the knowledge layer for our application

## Agent

_`2026-04-25T18:54:47.521Z`_

Read the relevant context (problem, brainstorm, both surfaces, all four user stories, gateway). Here's how I'd frame the design discussion.

## What the knowledge layer has to serve

Four downstream consumers, each with different shape:

1. **Briefing card** (Story 1) — 6 fixed slots, quotes + audio + dates, fast.
2. **Hot-moment cards** (Story 3) — top-3 calmers / top-3 agitators / phrase / contact / clip, ranked by past success. Sub-second, deterministic.
3. **Weekly digest** (Story 2) — *new* / *shifting* / *gaps* / *next questions*. Needs recency math and category-level coverage.
4. **Ask Memory** free-form (HCP frontend) — answer + citations + uncertainty + contradictions.

Plus two write paths: patient voice (primary), family/caregiver (secondary, labelled), clinician corrections (overlay).

## The core design tension

There are basically three shapes in play — pick one as the source of truth:

- **(A) Markdown-with-tails** — one file per category, structured header + appended raw quotes. Easy to read, perfect for LLM stuffing, terrible for gap analysis, recency math, and contradiction detection.
- **(B) Typed records** — JSON/SQLite rows: `(category, statement, patient_voice_quote, source_msg_id, span, confidence, actor_role, last_confirmed_at, status)`. Great for the ranking/digest/gap features, but querying it from an LLM means rendering it back to text at retrieval time anyway.
- **(C) Hybrid: typed records as truth, markdown as projection** — store rows; render per-category markdown on read for prompt-stuffing or page rendering. Gap/recency/contradiction logic stays as SQL-ish queries.

**Recommendation: (C).** It's the only one that makes the gap-analysis feature, source-hierarchy enforcement, and "supersede vs. coexist" honestly tractable — and it still gives you the markdown surface Pascal already wanted.

## The non-obvious decisions worth making explicitly

1. **Extraction granularity = one candidate memory per claim.** A 40-second voice note may yield 4 candidates, each with an exact transcript span. Don't merge at extraction time.
2. **Two-stage lifecycle: candidate → promoted.** Promoted = repeated ≥2× *or* human-confirmed. Briefing/hot-moment cards only read from promoted. Timeline shows both. This kills the "one weird voice note becomes the patient's stated value" failure mode.
3. **Retrieval is deterministic where it can be.** Briefing and hot-moment are SQL queries with category filters and a success-rank ordering — no LLM in the read path. Only Ask-Memory needs an LLM, and even there the candidate set is category-routed first, not vector-only.
4. **Gap rubric is a first-class table, not a derived metric.** `(patient_id, category, promoted_count, last_confirmed_at, staleness_score, suggested_prompt)` updated nightly. The digest reads from it directly. The WhatsApp prompt picker reads from it directly.
5. **Provenance hierarchy enforced at query time, not at write time.** Store all sources; rank `patient > family > caregiver > clinician_inference` when assembling a card. Conflicts across tiers don't auto-resolve — they surface as a contradiction in `Memory Review`.
6. **Transcripts immutable; corrections are overlay rows.** Original always reachable for the audio playback in the briefing card.
7. **Skip vector search for v0.** Category routing + small candidate set + LLM rerank gets you 90% of free-form Q&A quality without an embedding store. Add it day-2 if Ask-Memory recall feels weak.

## What I'd want to align on before sketching schema

- Are we hard-committing to the **6 briefing slots** as the rubric backbone (calmers / agitators / communication / support circle / recent event / preferred-name), or is the rubric broader and the briefing is a 6-slot *projection* of it?
- Is **hot-moment ranking** based purely on repetition count, or do we want a "did this help?" feedback loop in v0 (mentioned in Story 3)? That changes whether we need a feedback table from day one.
- Free-form Q&A: in-loop LLM that synthesizes from candidate rows, or a constrained "show me the rows that matched" interface? The first is more demoable, the second is safer.

Where do you want to push first — pin down the rubric, or sketch the data model?
