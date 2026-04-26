# Brainstorm — Distilled

Source: team_conversation_brainstorm.md (read 2026-04-25 via .wrapped.md, 507 lines)

## TL;DR

- Team verbally converged on the architecture already in `knowledge-layer.md`: voice input → structured rubric/knowledge base with raw transcripts kept for provenance → two retrieval modes (briefing vs. in-the-moment).
- Two demo moments will anchor the pitch: (1) caretaker briefing card and (2) a hot-moment voice agent that "chimes in" during a struggle. The WhatsApp ingestion path is told as a story but likely faked; the live voice agent (Vapi/11Labs/OpenAI) is the wow.
- Strong endorsement of the gap-analysis / completeness rubric: the system flags thin or stale categories and prompts to fill them. This is more developed verbally than in current notes.
- Scope was deliberately narrowed away from a "360-degree input from baker, neighbor, etc." vision toward a single shepherd (family member or capable patient) plus caregivers.
- Karen / Nedap's *Mijn verhaal* explicitly named as competitor/adapter target — "we are that adapter" was said out loud.

## Decisions made (verbally) that are NOT yet in written notes

- **Continuous always-on recording is dropped.** Discussed (the "Clippy in the room" metaphor) and rejected: not feasible, not desirable, "active ingestion" wins. → land in `knowledge-layer.md` "What we explicitly aren't" or `user-stories/04-feeding-the-system.md` (already aligned but make the rejection explicit).
- **Onboarding shepherd model.** The team rejected the "interview every relative" 360 onboarding in favour of one capable shepherd (the patient themselves, or a forward-looking family member like a son/daughter) configures the system. → land in `user-stories/01-onboarding-briefing.md` or a new `notes/onboarding-shepherd.md`. Mildly refines `user-stories/04-feeding-the-system.md` which currently implies multiple input streams from day one.
- **Demo scope: two moments only.** (1) Briefing one-pager for a new caretaker, (2) hot-moment voice agent role-played live. WhatsApp ingestion is *told*, not *built* (stretch goal). → land in `notes/demo-script.md` (new) or append to existing demo notes.
- **Voice agent stack: Vapi (or 11Labs / OpenAI Realtime) for the live hot-moment demo.** Pieter to drive. → add to `knowledge-layer.md` Stack section.
- **Gap-analysis as a first-class feature.** Not a maybe — Pascal explicitly designed the rubric so completeness can be measured per category, and stale facts are re-surfaced on a schedule. Currently only weakly implied in notes. → add a "Gap analysis & recency" section to `knowledge-layer.md` and reference from Story 2.
- **Hierarchy of input formality** (doctor → nurse → family → patient = ever less structured, ever more anecdotal). Useful framing for the structure of the knowledge base. → land in `knowledge-layer.md` taxonomy section.

## New ideas worth keeping

- **"Time machine for someone you love."** Olivia's framing (paraphrased): the daughter, on her 18th birthday, asks the system "what did my mom hope for me?" and hears mom's actual voice from 2024. → great pitch flourish, fits `framing-magic-hands.md` as a one-line emotional close.
- **Conversation prompts as story-elicitors, not interrogations.** "Ask grandma about Dresden and she'll talk for an hour." Use known anchors (cities, songs, jobs) to elicit narrative rather than asking "what are your preferences?" → fits `user-stories/04-feeding-the-system.md` patient-prompt design.
- **"Meet them at their reality."** Knowing the person's stories lets you trigger moments where *they* lead. Strong reframe of why the passport matters: it's not just for the caregiver, it lets the patient stay an author. → `framing-magic-hands.md`.
- **Hot-moment voice agent "chimes in" rather than waits to be queried.** The voice agent listens (with consent) for a trigger phrase or distress and then surfaces guidance. Stronger than the current "scan QR / open card" framing in Story 3. → consider as a v2 angle in `user-stories/03-hot-moment-support.md`; flag tension with "no silent recording" boundary in Story 4.
- **WhatsApp wave / passive group-call analogy.** Pascal's tangent on the WhatsApp wave feature suggests a UX principle: low-pressure, opt-in pings rather than scheduled mandatory calls. → light touch for `user-stories/04-feeding-the-system.md`.
- **SBAR is the floor, not the goal.** The team explicitly positioned the product *above* SBAR: SBAR is the sterile clinical handover; we add the human layer on top. → great pitch slide; add to `framing-magic-hands.md` or `problem.md`.

## Concerns and objections raised by the team

- "Are we relying on a meltdown to learn?" (Olivia) — the system shouldn't only learn from crises; it needs proactive elicitation.
- Time/labour cost of a sequenced 360 onboarding — rejected as too heavy.
- "We don't want to replace a human" — every time automation creeps in, someone pushes back.
- Continuous recording was challenged on environmental/feasibility grounds, then on principle.
- "Are we just being Karen-esque?" — worry that "according to their preferences" sounds like a complaint-management framing rather than dignity/wellbeing. Wording matters.
- Risk of the product becoming *yet another* dashboard rather than an adapter into existing systems.
- "I don't know anyone with Alzheimer's, am I blocking myself?" (Olivia) — flag that the team's empathy gap is real; the made-up Alzheimer's story is doing heavy lifting.

## Open questions

**Pascal (knowledge layer)**
- What's the rubric exactly? Which domain files, what counts as "complete"? (Largely answered in `knowledge-layer.md` already, but the verbal discussion implied tightening the gap-analysis logic.)
- How does the recency / staleness routine actually run? Daily cron? Triggered by query?
- Where does the patient's raw voice clip live so it can be played back in the briefing card?

**Pieter (voice)**
- Vapi vs. 11Labs vs. OpenAI Realtime for the live demo — which one ships fastest with knowledge-base grounding?
- Trigger phrase design for the "chime-in" moment in the demo.
- WhatsApp ingestion: real or simulated for the demo?

**Luc (frontend)**
- Briefing one-pager layout — what are the ~6 fields? (Name, calmers, triggers, comms, network, recent — see Story 1.)
- How is "gap / stale" visualised in the dashboard?

**Olivia (presentation/profile)**
- Which seeded patient persona? "Joan / third-grade teacher / Patsy Cline" was floated. Pick one.
- The pitch line: "preserving the person behind the patient" vs. "time machine for someone you love" vs. "the chart told her the diagnosis, the passport told her the person."
- How explicitly do we mention Caren / *Mijn verhaal* in the pitch?

**TBD**
- Consent model wording for the "chime-in" voice agent (conflicts with "no silent recording" in Story 4).
- Do we show or skip the ECD-adapter export in the 5-min demo?

## Action items

- **Pieter:** stand up a Vapi (or alternative) voice agent primed with a seeded patient knowledge base; demo the chime-in moment.
- **Pascal:** finalise the markdown-with-tails knowledge layer; ship gap-analysis + staleness; expose `/api/passport/query`.
- **Luc:** build the briefing one-pager + dashboard view that shows raw transcripts, structured facts with citations, and gap/staleness indicators.
- **Olivia:** lock seeded patient ("Joan" or equivalent), write the demo script, choose the pitch headline, decide whether to mention Caren by name.
- **All:** decide tonight whether WhatsApp ingestion is told-only or built. Default: told-only.
- **All:** drop the word "preferences" from the headline framing if it tests as Karen-esque; try "wellbeing" / "person" / "voice."

## Quotes for the pitch

- "The chart told her the diagnosis. The passport told her the person." (already in Story 1 — keep front and centre)
- "It's a tool for caregivers that captures the small personal details medical systems miss." [paraphrased — team converged on this as the one-liner]
- "It's a time machine for someone you love." [paraphrased — Olivia]
- "Meet them at their reality." [paraphrased]
- "By lunch, they were laughing together. Joan's quality of life jumped on day one." [paraphrased — the third-grade teacher / Patsy Cline scenario]
- "LLMs have infinite attention. Humans don't. That's why we never wrote it down." [paraphrased — Pascal]
- "We are the adapter." [verbatim, on Caren/Nedap *Mijn verhaal*]
- "SBAR is the floor. We build up from that floor." [paraphrased]

## Personal stories / anecdotes

- **Pieter — Jan in the elderly home (improvised but emotionally landed):** Jan panics on waking, his usual caretaker calms him with a glass of water; new caretaker doesn't know, escalation. The team called it convincing; worth keeping as the canonical opening anecdote even though it's invented.
- **Pascal — grandmother from Cologne, evacuated to Britain, Dresden stories, slicing the butter thinner each day to hide some away.** Excellent illustration of "ask the right anchor and they'll talk for an hour." Strongly pitch-relevant.
- **Pascal — Wuppertal train station, carrying his mother's wheelchair up two flights of stairs, immigrant teenagers helping where Germans wouldn't.** Tangentially relevant (accessibility), but not for this pitch — park.
- **Pascal — own mother in Germany; he'd be the shepherd-configurer for her.** Grounds the "single shepherd" onboarding model.
- **Olivia — Joan / Lily 18th-birthday recording.** Cheesy but powerful; works as a coda slide.

## Contradictions to resolve

- **Continuous recording / "chime-in" voice agent vs. `user-stories/04-feeding-the-system.md` "Not silent recording" boundary.** The hot-moment chime-in implies the agent is listening. Either (a) the agent is invoked manually by the caregiver in the moment, or (b) we add an explicit consented "listening mode" with a visible indicator. The pitch demo as currently sketched leans (b); the written boundary forbids (a) by default. **Pick one before the demo.**
- **Onboarding scope.** `user-stories/04` describes patient + family + staff streams from day one; verbal consensus is *one shepherd configures, others can add later.* Tighten Story 4 to match.
- **Word "preferences."** Used heavily in written notes as the central abstraction; verbally questioned ("Karen-esque", "diluting what we're doing"). No replacement chosen yet. The notes use "preferences" prominently — leave for now but flag.
- **"It generalises beyond Alzheimer's"** — `framing-magic-hands.md` says park this; verbally Olivia and Pascal kept floating panic attacks, disability, etc. Holds with the existing decision: keep narrow for the pitch, one-line generalisation slide if there's time.

## What we should add to existing notes

- **Add to `knowledge-layer.md`:** explicit "Gap analysis & recency" section describing per-category completeness scoring and the daily/scheduled re-surfacing of stale facts. Reference the SBAR-floor framing.
- **Add to `knowledge-layer.md` Stack:** voice agent layer (Vapi / 11Labs / OpenAI Realtime) for the in-the-moment retrieval mode.
- **Add to `user-stories/01-onboarding-briefing.md`:** the shepherd model — one capable family member or patient configures, not a 360 sweep.
- **Add to `user-stories/03-hot-moment-support.md`:** decide and document whether the hot-moment agent is caregiver-invoked or consented-listening; add the "chime-in" interaction pattern if we keep it.
- **Add to `user-stories/04-feeding-the-system.md`:** story-anchor prompts (cities, songs, jobs) as elicitation strategy; passive WhatsApp-wave-style invitations.
- **Add to `framing-magic-hands.md`:** "time machine for someone you love" coda; "meet them at their reality" reframe; SBAR-as-floor positioning.
- **Add a new `notes/demo-script.md`:** two-moment demo (briefing one-pager + hot-moment voice agent), seeded patient, what's faked vs. live.
- **Add a new `notes/onboarding-shepherd.md`** (or fold into Story 1): the configurer role.
