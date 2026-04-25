# Conversation 019dc486-ee77-77b3-a90d-2f0cd689cb07

- Source: `codex`
- User: `pascal`
- System: `Pascals-MBP.local`
- Started: `2026-04-25T12:04:30.512Z`
- CWD: `/Users/pascal/Code/business/experiments/anthropic-hackathon`

## User

_`2026-04-25T12:05:09.603Z`_

You are Worker 3 for a 24-hour hackathon project in /Users/pascal/Code/business/experiments/anthropic-hackathon. You are not alone in the codebase: other workers are editing separate files in notes/. Do not revert or overwrite others' edits. Your write scope is ONLY notes/consumer-gateway.md.

Context: The team is building an MVP for a WhatsApp voice-note companion for people with dementia or degenerative diseases who may lack family/representatives. It listens over time, learns preferences/habits/values, builds a care passport, and lets HCPs/caretakers ask questions later. It should not make legally/medically binding decisions; it preserves patient voice and gives evidence-backed support.

Task: design the consumer/patient gateway and interface layer for the MVP. The product uses WhatsApp voice notes as the main patient interface. It should act as a companion over time, learning preferences and habits, while being safe and bounded.

Research current WhatsApp Cloud API constraints and voice/media webhook flow using official/current docs where possible. Cover:
- inbound WhatsApp voice-note flow: webhook, media retrieval, transcription, message persistence
- outbound response flow: text and optionally voice
- companion behavior principles: warmth, one follow-up question, no medical advice, consent
- onboarding flow for patient and HCP/caretaker
- active monitoring/check-in flow and care-gap alerts
- identity, permissions, and consent model for a hackathon MVP
- recommended implementation path for 24h, including fallback if WhatsApp setup is slow
- sample message scripts for Anna demo

Edit notes/consumer-gateway.md directly. Keep it concise but actionable. Final response: list changed file paths and 5-8 key decisions.

## Agent

_`2026-04-25T12:05:17.825Z`_

I’ll keep edits scoped to `notes/consumer-gateway.md` and first check the existing note shape, then verify the current WhatsApp Cloud API voice/media flow against official docs before patching.

## Agent

_`2026-04-25T12:05:21.832Z`_

`notes/consumer-gateway.md` does not exist yet, so I’ll create just that file. The existing `notes/` files are untracked and I’ll leave them untouched.

## Agent

_`2026-04-25T12:05:55.385Z`_

I found Meta’s official Postman collection, which is accessible and current enough for this sprint, plus Meta-hosted Cloud API overview and WhatsApp’s hosted Node SDK docs for audio sending details. I’m going to turn that into a compact implementation note with explicit assumptions and a fallback path.

## Agent

_`2026-04-25T12:06:44.284Z`_

The note is created. I’m doing a quick pass now for scope, formatting, and whether every requested flow is covered without touching other notes.

## Agent

_`2026-04-25T12:06:51.568Z`_

Changed file:
- [/Users/pascal/Code/business/experiments/anthropic-hackathon/notes/consumer-gateway.md](/Users/pascal/Code/business/experiments/anthropic-hackathon/notes/consumer-gateway.md)

Key decisions:
- Use WhatsApp voice notes as the main patient interface, with text as the default outbound response for reliability.
- Persist raw webhook payloads before media download/transcription to avoid losing evidence.
- Store every memory with source message evidence and confidence; low-confidence facts stay as candidates.
- Keep companion replies warm, bounded, and limited to one follow-up question.
- Explicitly prohibit medical/legal decision-making and medication advice.
- Use consent scopes for saving notes, transcription, care passport summaries, sharing, check-ins, and alerts.
- Build text webhook path first, then audio retrieval/transcription, then alerts; TTS voice replies are optional.
- If WhatsApp setup stalls, use a WhatsApp-like Anna simulator backed by the same pipeline.
