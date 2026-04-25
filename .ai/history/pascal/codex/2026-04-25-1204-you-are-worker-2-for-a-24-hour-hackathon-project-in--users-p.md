# Conversation 019dc486-e7a3-7980-92b3-8435d828de71

- Source: `codex`
- User: `pascal`
- System: `Pascals-MBP.local`
- Started: `2026-04-25T12:04:28.741Z`
- CWD: `/Users/pascal/Code/business/experiments/anthropic-hackathon`

## User

_`2026-04-25T12:05:09.085Z`_

You are Worker 2 for a 24-hour hackathon project in /Users/pascal/Code/business/experiments/anthropic-hackathon. You are not alone in the codebase: other workers are editing separate files in notes/. Do not revert or overwrite others' edits. Your write scope is ONLY notes/hcp-frontend.md.

Context: The team is building an MVP for a WhatsApp voice-note companion for people with dementia or degenerative diseases who may lack family/representatives. It listens over time, learns preferences/habits/values, builds a care passport, and lets HCPs/caretakers ask questions later. It should not make legally/medically binding decisions; it preserves patient voice and gives evidence-backed support.

Task: design the HCP/caretaker frontend for the MVP. It should be a Next.js webapp showing the patient top-down from the HCP perspective, with drill-down into details and ability to query the patient memory assistant. The knowledge layer will be separate, so define UI needs and data contracts without implementing.

Research current UX patterns for AI decision support, evidence/provenance, dashboards, and clinical safety if needed, using primary/official sources where possible. Cover:
- key screens and navigation
- patient overview/cockpit
- care passport details
- HCP query interface and answer card design
- evidence/provenance display
- timeline and risk alerts
- memory inspection/correction workflow
- demo scenario for Anna
- Next.js component structure and mock API contracts for 24h prototype
- visual/design principles for a serious healthcare demo

Edit notes/hcp-frontend.md directly. Keep it concise but actionable. Final response: list changed file paths and 5-8 key decisions.

## Agent

_`2026-04-25T12:05:17.537Z`_

I’ll scope this to `notes/hcp-frontend.md` only, first checking the repo state and whether that file already exists so I can avoid touching other workers’ notes.

## Agent

_`2026-04-25T12:05:31.562Z`_

The target file does not exist yet, and the repo has broad untracked work, so I’ll create only `notes/hcp-frontend.md`. I’m also checking official guidance to anchor the safety/provenance UX in CDS and AI risk practices rather than generic dashboard conventions.

## Agent

_`2026-04-25T12:05:35.814Z`_

I’ve got the local product framing: the frontend should preserve patient voice for human decision-makers, with a clear boundary against medical/legal automation. I’m going to write the note as an MVP spec with screen map, component/data contracts, and a demo path for Anna.

## Agent

_`2026-04-25T12:06:29.603Z`_

The draft is in place and stays within the requested file. I’m doing a quick pass now for scope, concision, and whether the contracts cover the UI states the demo needs.

## Agent

_`2026-04-25T12:06:44.280Z`_

Changed file:
- [notes/hcp-frontend.md](/Users/pascal/Code/business/experiments/anthropic-hackathon/notes/hcp-frontend.md)

Key decisions:
- Single-patient Next.js MVP centered on Anna, with `Overview`, `Care Passport`, `Ask Memory`, `Timeline`, `Risks`, and `Memory Review`.
- Frontend is decision support only: no medical/legal decision claims, no diagnosis, no automated consent framing.
- Answer cards must show direct answer, safety label, confidence, uncertainty, source chips, and evidence drawer.
- Evidence/provenance is a first-class UI element: source type, date, transcript excerpt, extraction path, reviewer history.
- Care passport fields separate patient voice, observed facts, clinician/caregiver notes, and model inference.
- Risks are surfaced only when actionable, recent, and evidence-linked to reduce alert fatigue.
- Memory corrections are stored as auditable overlays, preserving the original source.
- 24h implementation should mock APIs and focus on demoable Anna data, not the knowledge layer.

Research anchors used: [FDA CDS guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software), [ONC CDS](https://healthit.gov/clinical-quality-and-safety/clinical-decision-support/), [ONC SAFER Guides](https://healthit.gov/clinical-quality-and-safety/safer-guides/), [NHS clinical risk standards](https://digital.nhs.uk/services/clinical-safety/clinical-ri[REDACTED]), [WHO AI for health ethics](https://www.who.int/publications/i/item/9789240029200), [NIST AI RMF](https://www.nist.gov/itl/ai-ri[REDACTED]), [NHS accessibility design](https://service-manual.nhs.uk/accessibility/design).
