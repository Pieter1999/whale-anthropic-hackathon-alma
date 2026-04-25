# Conversation a78d8319bbb563c2f

- Source: `claude`
- User: `pascal`
- System: `Pascals-MBP.local`
- Started: `2026-04-25T14:22:41.789Z`
- CWD: `/Users/pascal/Code/business/experiments/anthropic-hackathon`

## User

_`2026-04-25T14:22:41.789Z`_

You are acting as the team's **librarian**. Read your role definition first: `/Users/pascal/Code/business/experiments/anthropic-hackathon/.claude/agents/librarian.md`. Behave accordingly — short, sourced, briefing-style.

## Background

The team has just locked a distribution strategy: we will be an **adapter** that writes structured patient-voice content into existing "patient/family voice" slots in Dutch ECDs and portals (Caren *Mijn verhaal* etc.), and we ship a standalone UI for cases where the adapter target doesn't exist.

Read for context:
- `/Users/pascal/Code/business/experiments/anthropic-hackathon/ideas/care-passport/notes/distribution-adapter-strategy.md`
- `/Users/pascal/Code/business/experiments/anthropic-hackathon/ideas/care-passport/notes/research/documented-vs-tacit.md` (your previous brief)

## Your task

Produce a focused **integration-surfaces map** answering five concrete questions. The deliverable is a procurement/integration-readiness sheet for the seller and the developer, not a literature review.

### Q1 — Nedap Caren / Ons Dossier *Mijn verhaal*: how do we write into it?

- Is there a documented API, app-marketplace, partner-integration programme, or import path that lets a third-party fill *Mijn verhaal* programmatically? Search Nedap's developer / partner / app-store pages, support articles, and any 2024–2026 announcements.
- If no API, what are the realistic paths? (PDF/markdown export the family pastes; CSV import; partner programme; "Nedap Innovation Studio" or similar; MedMij data exchange.)
- What is the data shape currently — is it free-text only, or are there structured sub-fields?
- Is the editing-disabled state mentioned in earlier research still current, and what was the reason?

### Q2 — PinkRoccade Caress / Ecare / Pluriform: what is the family portal equivalent and the life-story slot?

- What is PinkRoccade's family-facing portal called (if any)? Examples to investigate: *Familienet*, *MedZorg*, *Mijn Zorg*, *Cliëntportaal*, anything bundled with mijnCaress.
- Where in mijnCaress / Ecare / Pluriform does the patient's life story / preferences / *persoonsbeeld* live, and what is the slot called?
- Same API/import question as for Nedap.

### Q3 — MedMij PGOs: is there a national schema for life-story / care preferences / ACP?

- MedMij is the Dutch national framework for Persoonlijke GezondheidsOmgevingen. Are there published *gegevensdiensten* / data services for life-story, personhood, care preferences, or ACP topics?
- Which MedMij-certified PGOs (Ivido, Quli, Drimpy, Patient1, Mijnzorgapp, Patiëntomgeving, others) explicitly support life-story or preference capture today?
- Is there a defined JSON/HL7 FHIR shape we could target?
- Practical path: if we structure our output as MedMij-conformant, do we get vendor-neutral distribution to any compliant PGO?

### Q4 — Hospital ECDs (HiX, Epic NL, Nexus): is there a patient-voice slot anywhere?

- Hospitals are the moment this matters most (admission, ward handover, locum care). HiX (ChipSoft), Epic NL, Nexus — do any of them have a "personhood" / "this is me" / "preferences" slot for dementia or frail-elderly patients? Or is hospital admission always a standalone-UI moment for us?
- Mention any 2024–2026 dementia-friendly-hospital initiatives where this gap is being addressed (e.g., dementia-vriendelijke ziekenhuiszorg programmes).

### Q5 — VVT-side recommended schema

- Have Vilans, Waardigheid en Trots, Zorginstituut, V&VN, or any other national body published a recommended data schema for *persoonsbeeld* / *levensverhaal* / *zorgvoorkeuren* that an ECD-neutral product like ours should align with?
- Is there an InZicht / VIPP-funded standardisation effort we should know about?

## Output

Save to: `/Users/pascal/Code/business/experiments/anthropic-hackathon/ideas/care-passport/notes/research/integration-surfaces.md`

Header: `Last checked: 2026-04-25`. ~1500–2000 words; procurement-style. For each surface produce a **readiness card** with:

- **Surface** (vendor + product + slot)
- **Adapter path** (API / import / paste / nothing) with evidence
- **Data shape** (free text / structured / FHIR)
- **Gating** (consent surface, who authorises, account types)
- **Realistic v1 move** for the hackathon prototype (e.g., "render structured PDF/markdown the family pastes" vs. "FHIR write")
- **Source URLs**

Then close with:

- A **prioritised integration roadmap** for the next 6 months (which surface first, why).
- The **3 realistic adapter paths** for the demo prototype this weekend, in order of credibility.
- Any **policy or standards thread** that could unlock vendor-neutral distribution faster than chasing each vendor (e.g., "MedMij life-story gegevensdienst expected 2027 — push to be the reference implementation").

## Process

- WebSearch and WebFetch heavily. Cite URLs inline.
- Vendor support pages, developer docs, MedMij gegevensdiensten catalogue, Vilans publications, InZicht programme pages.
- If a fact can't be confirmed, say "not confirmed in public sources" rather than inferring.
- Run searches in parallel.

## Report back

Under 250 words:
- (a) file path
- (b) the **3 realistic adapter paths for this weekend's demo** verbatim
- (c) which integration is most strategically important for the seller's pitch, with one-sentence reason
- (d) any blocker we should know about (e.g., "Nedap has no public API and partner programme is closed")

## Agent

_`2026-04-25T14:22:44.907Z`_

I'll start by reading my role definition and the context files, then research the integration surfaces.

## Agent

_`2026-04-25T14:22:48.413Z`_

I need to load the WebSearch and WebFetch tools to do the research.

## Agent

_`2026-04-25T14:22:51.373Z`_

Now let me run parallel searches to gather the information for each of the five questions.

## Agent

_`2026-04-25T14:23:12.882Z`_

Let me drill deeper into key sources, especially the Nedap Ons API page, the MedMij catalogue, and PinkRoccade documentation.

## Agent

_`2026-04-25T14:23:51.323Z`_

Excellent — I now have rich material. Let me grab a few more specifics on PinkRoccade openness, the PZP information standard, and the proactieve zorgplanning consultation.

## Agent

_`2026-04-25T14:24:10.322Z`_

I have enough material. Let me also confirm the eOverdracht v4 BgZ mention of social/personal aspects, then write up the briefing.

## Agent

_`2026-04-25T14:24:22.305Z`_

I have enough. Time to write the briefing.

## Agent

_`2026-04-25T14:27:09.827Z`_

### Report

(a) **File path:** `/Users/pascal/Code/business/experiments/anthropic-hackathon/ideas/care-passport/notes/research/integration-surfaces.md`

(b) **Three realistic adapter paths for this weekend's demo (verbatim):**

1. Structured PDF + markdown export shaped to *Mijn verhaal* (aanspreekvorm, voorkeuren, narrative, photo placeholder), pasted by family or casemanager into Caren. Reads as "fills the field Nedap already ships."
2. FHIR R4 PZP-shaped resource bundle, downloadable from the standalone UI. Reads as "MedMij-grade output today, pre-aligned with the Nictiz Proactieve Zorgplanning standard."
3. Standalone web view with QR-code share link, gated by patient/representative consent — covers the hospital admission, locum nurse, and family-without-portal cases. Reads as "works on day one, in any setting, no integration required."

(c) **Most strategically important integration for the seller's pitch:** The **Nedap Caren *Mijn verhaal* paste-in export**. Procurement officers in Dutch VVT already recognise the field name, the slot is in market but currently editing-disabled, and "we fill the field Nedap already ships" is the cleanest one-liner against any "why not use what we already have" objection.

(d) **Blockers to know:**
- **Nedap has no public API for *Mijn verhaal*.** The Ons API exists but is partner-mediated (Creq/Quattri/Infozorg are the named partners), the partner programme is curated rather than open, and exposure of the *Persoonlijk cliëntverhaal* field via any opened endpoint is not confirmed in public sources. v1 is paste-only.
- **No MedMij gegevensdienst exists for life story / care preferences / ACP** — neither in the active catalogue nor in development. MedMij-conformance does not buy us PGO distribution today.
- **Nictiz PZP is still ReleaseCandidate.2** (April 2026), not production. We can align with it but cannot claim "compliant with a finalised standard" yet.
- **No hospital ECD (HiX, Epic NL, Nexus) has a documented patient-voice slot.** Hospitals are standalone-UI only for now; the route in is via eOverdracht from the VVT side, not via direct EPD integration.
