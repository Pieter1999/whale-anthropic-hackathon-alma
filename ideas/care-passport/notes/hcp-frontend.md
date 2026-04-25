# HCP/Caretaker Frontend MVP

## Product Role

Next.js webapp for healthcare professionals and caretakers to understand a patient from the top down: current state, care passport, recent evidence, risk signals, and a query interface for the memory assistant. The knowledge layer is separate; the frontend consumes structured summaries, citations, timeline events, alerts, and answer objects.

Clinical boundary: this is decision support, not a medical device claim, diagnosis engine, care-order tool, or legal representative. Every answer must show evidence and route responsibility back to a human professional.

## UX Principles From Research

- CDS should be timely, person-specific, clear, workflow-fit, and presented in the right format/channel/time. Use this as the organizing rule for alerts, summaries, and query answers.
- Keep AI inspectable: show what is known, why it is believed, source strength, recency, and uncertainty. Do not hide behind a fluent answer.
- Separate patient voice from system inference. Label verbatim patient statements, clinician-entered facts, caregiver notes, and model summaries differently.
- Support correction and auditability. HCPs must be able to flag wrong memories, suggest corrections, and see unresolved contradictions.
- Reduce alert fatigue. Only surface risks that are recent, actionable, and tied to evidence; let lower-confidence patterns live in the timeline.
- Design for clinical safety: patient identity is always visible, alerts avoid ambiguous language, destructive actions require confirmation, and provenance is one click away.

Primary references used: FDA Clinical Decision Support Software guidance (Jan 2026), ONC Clinical Decision Support and SAFER Guides, AHRQ patient-centered CDS / "5 Rights", NHS England DCB0129/DCB0160 clinical risk management standards, WHO AI for health ethics guidance, NIST AI Risk Management Framework, NHS Service Manual accessibility guidance.

## Information Architecture

Single-patient MVP. Use a left rail plus patient header.

- `Overview` - cockpit for shift handover and first 30 seconds.
- `Care Passport` - stable preferences, values, routines, communication guidance.
- `Ask Memory` - query assistant with answer cards and evidence drawer.
- `Timeline` - voice notes, check-ins, events, corrections, alerts.
- `Risks` - actionable care gaps and escalation state.
- `Memory Review` - inspect/correct extracted memories and contradictions.

Persistent header:

- Patient name, preferred name, photo/initials, age, condition stage, living situation.
- Identity safety strip: date of birth, address/care setting, NHS/BSN/mock identifier.
- Status chips: `Updated today`, `3 open risks`, `2 unreviewed corrections`.
- Mode label: `Decision support only - verify before acting`.

## Key Screens

### 1. Patient Overview / Cockpit

Purpose: let an HCP understand Anna quickly before a visit, discharge planning call, or care meeting.

Layout:

- Top row: patient identity, last contact, confidence/coverage meter, primary concerns.
- `What matters to Anna` summary: 3-5 patient-centered bullets.
- `Today / This week` panel: relevant recent changes, missed check-ins, mood/sleep/appetite/routine deviations.
- `Ask about Anna` query box with suggested prompts.
- `Open risks` compact list with severity, evidence count, last observed, owner/status.
- `Care guidance` cards: communication, routines, triggers, medication adherence support, mobility/safety notes.
- `Evidence freshness` footer: last voice note, last reviewed memory, pending contradictions.

Cockpit design rule: no dense EHR clone. It should feel like a clinical handover board: scannable, calm, high signal.

### 2. Care Passport

Purpose: structured view of the patient's voice and care preferences.

Sections:

- Identity and life context: preferred name, language, important people/places, former occupation, values.
- Communication: preferred tone, topics that calm/distress, cognitive aids, hearing/vision needs.
- Daily routines: morning/evening, meals, hygiene, sleep, mobility, transport.
- Preferences: food, activities, privacy, social contact, spiritual/cultural needs.
- Medical-care values: comfort vs intervention preferences, fears, acceptable tradeoffs. Label as `not an advance directive`.
- Safety: wandering triggers, falls, medication problems, emergency contacts, environment notes.
- Evidence map per field: source type, date range, confidence, reviewer status.

Each passport field has:

- `statement`: human-readable summary.
- `patient_voice`: short quote/transcript snippet when available.
- `sources`: linked evidence items.
- `confidence`: high/medium/low plus reason.
- `last_confirmed_at`.
- `review_status`: unreviewed / reviewed / disputed / corrected.

### 3. Ask Memory

Purpose: let HCPs ask natural questions while keeping answers bounded and evidenced.

Example prompts:

- "What helps Anna calm down when she is confused?"
- "Does Anna prefer care at home if her condition worsens?"
- "What changed in Anna's routine this week?"
- "What should I avoid during morning visits?"
- "Is there evidence Anna is missing medication?"

Answer card:

- Direct answer first, max 4-6 lines.
- Safety label: `Preference support`, `Care context`, `Risk pattern`, or `Insufficient evidence`.
- Evidence strength: number of sources, date span, consistency, confidence.
- `Why this answer` bullets separating patient statements, observed patterns, and inferred summary.
- Citations with source chips: `Voice note`, `WhatsApp check-in`, `Caregiver note`, `Clinician correction`.
- Contradictions/uncertainty box when relevant.
- Actions: `Open evidence`, `Add to handover`, `Flag as wrong`, `Ask follow-up`, `Copy summary`.

Answer constraints:

- Never answer as if Anna is currently consenting to a medical/legal decision.
- Prefer "Anna has previously said..." over "Anna wants..." unless recent and repeatedly confirmed.
- If evidence is stale or weak, say so visibly.
- For urgent risk questions, show escalation guidance as `consider contacting care team`, not automated triage.

### 4. Evidence / Provenance Display

Evidence is not a footnote; it is part of the core UI.

Evidence drawer contents:

- Source list grouped by claim.
- Transcript excerpt with timestamp and audio playback placeholder.
- Captured date, channel, speaker, language, transcription confidence.
- Extraction path: source -> memory item -> summary/answer.
- Reviewer history: who reviewed/corrected and when.
- Contradictions: competing statements side by side.

Visual language:

- Use source chips and icons, not long raw IDs in the main card.
- Use confidence as plain language with reasons, not only a percentage.
- Show provenance depth progressively: overview chip -> evidence drawer -> raw transcript.

### 5. Timeline And Risk Alerts

Timeline filters:

- All, voice notes, check-ins, routines, care events, risks, corrections.
- Date range and confidence filter.

Timeline item anatomy:

- Event title, date/time, source, summary, linked memories, confidence, review state.
- For voice notes: short transcript snippet and audio placeholder.
- For corrections: before/after and reviewer.

Risk alerts:

- `Medication adherence concern`: missed/refused mentions, timing drift, evidence links.
- `Nutrition/hydration concern`: reduced appetite/drinking mentions.
- `Mood/social isolation`: repeated loneliness/anxiety markers.
- `Safety at home`: falls, getting lost, stove/door concerns.
- `Care preference conflict`: new statement contradicts existing passport field.

Risk alert anatomy:

- Severity: info / watch / action needed.
- Evidence count and recency.
- Why surfaced now.
- Suggested human next step.
- Owner/status: new / acknowledged / in progress / resolved / dismissed.

### 6. Memory Inspection / Correction

Purpose: make the memory layer editable and accountable without pretending HCPs are directly editing raw model truth.

Workflow:

1. HCP opens `Memory Review`.
2. Unreviewed memories appear as cards grouped by passport category or risk.
3. HCP can `Confirm`, `Flag wrong`, `Edit summary`, `Mark outdated`, or `Request patient follow-up`.
4. Correction form requires reason and optional replacement wording.
5. System stores correction as an overlay event; original source remains available.
6. Corrected memory updates dependent passport fields, answers, and risk cards.

Correction object states:

- `pending_review`
- `accepted`
- `rejected`
- `needs_patient_followup`
- `superseded`

## Demo Scenario: Anna

Anna is 74, lives alone, early dementia, no nearby family. She has used the WhatsApp voice companion for several weeks.

Demo flow:

1. HCP opens Anna's cockpit before a home visit.
2. Overview shows: values independence, dislikes being rushed, calms with Dutch oldies and tea, recent missed evening check-ins, possible medication timing drift.
3. HCP asks: "What should I know before discussing extra home support?"
4. Answer card says Anna fears "being put away", prefers help framed as staying independent at home, and responds better to concrete examples than abstract future planning.
5. HCP opens evidence: two voice notes from Anna, one repeated routine pattern, one low-confidence contradiction about whether she wants a cleaner.
6. HCP flags the cleaner preference as uncertain and requests a patient follow-up question.
7. Risk tab shows `watch`: missed evening medication mentions in 3 of 5 recent days; suggested next step is medication reconciliation with district nurse.
8. Care Passport exports/prints a one-page handover summary for the care meeting.

## Next.js Prototype Structure

Keep implementation demoable and local-first. Mock the API; do not build the knowledge layer.

```text
code/hcp-frontend/
  app/
    layout.tsx
    page.tsx                         # redirect to /patients/anna
    patients/[patientId]/layout.tsx   # patient header + nav
    patients/[patientId]/page.tsx     # overview cockpit
    patients/[patientId]/passport/page.tsx
    patients/[patientId]/ask/page.tsx
    patients/[patientId]/timeline/page.tsx
    patients/[patientId]/risks/page.tsx
    patients/[patientId]/memory/page.tsx
  components/
    PatientHeader.tsx
    PatientNav.tsx
    OverviewCockpit.tsx
    CarePassportSection.tsx
    AskMemoryPanel.tsx
    AnswerCard.tsx
    EvidenceDrawer.tsx
    TimelineList.tsx
    RiskAlertCard.tsx
    MemoryReviewCard.tsx
    ConfidenceBadge.tsx
    SourceChip.tsx
  lib/
    mock-api.ts
    types.ts
    anna-demo-data.ts
```

Use server components for page shell and static mock data. Use client components only for query input, drawers, filters, and correction interactions.

## Mock API Contracts

```ts
type Patient = {
  id: string;
  fullName: string;
  preferredName: string;
  age: number;
  dateOfBirth: string;
  identifiers: { label: string; value: string }[];
  conditionSummary: string;
  livingSituation: string;
  lastMemoryUpdateAt: string;
  status: { label: string; tone: "neutral" | "watch" | "alert" }[];
};

type PassportField = {
  id: string;
  category: "identity" | "communication" | "routine" | "preferences" | "values" | "safety";
  title: string;
  statement: string;
  patientVoice?: string;
  confidence: "high" | "medium" | "low";
  confidenceReason: string;
  lastConfirmedAt?: string;
  reviewStatus: "unreviewed" | "reviewed" | "disputed" | "corrected";
  sourceIds: string[];
};

type EvidenceSource = {
  id: string;
  type: "voice_note" | "check_in" | "caregiver_note" | "clinician_correction";
  title: string;
  capturedAt: string;
  speaker?: string;
  excerpt: string;
  transcriptConfidence?: "high" | "medium" | "low";
  audioUrl?: string;
  linkedMemoryIds: string[];
};

type QueryRequest = {
  patientId: string;
  question: string;
  context?: "overview" | "passport" | "risk" | "handover";
};

type QueryAnswer = {
  id: string;
  question: string;
  answer: string;
  safetyLabel: "preference_support" | "care_context" | "risk_pattern" | "insufficient_evidence";
  confidence: "high" | "medium" | "low";
  evidenceSummary: string;
  reasoning: {
    patientStatements: string[];
    observedPatterns: string[];
    modelInferences: string[];
  };
  uncertainty?: string;
  sourceIds: string[];
  createdAt: string;
};

type RiskAlert = {
  id: string;
  title: string;
  severity: "info" | "watch" | "action_needed";
  status: "new" | "acknowledged" | "in_progress" | "resolved" | "dismissed";
  whyNow: string;
  suggestedHumanNextStep: string;
  sourceIds: string[];
  createdAt: string;
  owner?: string;
};

type MemoryCorrection = {
  id: string;
  memoryId: string;
  action: "confirm" | "flag_wrong" | "edit_summary" | "mark_outdated" | "request_followup";
  replacementStatement?: string;
  reason: string;
  status: "pending_review" | "accepted" | "rejected" | "needs_patient_followup" | "superseded";
  reviewerId: string;
  createdAt: string;
};
```

Mock endpoints:

- `GET /api/patients/anna`
- `GET /api/patients/anna/overview`
- `GET /api/patients/anna/passport`
- `POST /api/patients/anna/query`
- `GET /api/patients/anna/evidence?ids=...`
- `GET /api/patients/anna/timeline`
- `GET /api/patients/anna/risks`
- `POST /api/patients/anna/memory-corrections`

## Visual / Design Principles

- Serious healthcare demo: restrained palette, high contrast, generous spacing, no playful gradients, no chat-bot mascots.
- Use clinical colors sparingly: red only for action-needed safety risks, amber for watch, blue/gray for informational support.
- Make the patient the focus: name, story, voice snippets, and care-relevant context should be more prominent than AI branding.
- Dense enough for clinicians, but not an EHR replica. Prioritize handover cards, tables only where comparison matters.
- Accessibility: WCAG 2.2 AA target, keyboard-accessible drawers/tabs, visible focus states, no color-only risk encoding.
- Use clear labels: `Evidence`, `Uncertainty`, `Human next step`, `Last confirmed`, `Not an advance directive`.
- Avoid overconfidence: never show a single "AI score" as the main decision signal.

## 24h Build Priorities

1. Cockpit page with Anna demo data and visible safety boundary.
2. Ask Memory page with 3-4 canned questions returning rich answer cards.
3. Evidence drawer that links answer claims to mock voice-note excerpts.
4. Care Passport page with field-level confidence/review state.
5. Risks page with 2-3 actionable alerts and human next steps.
6. Memory Review page with local-only correction state.
7. One-click `Handover summary` mock export view if time permits.
