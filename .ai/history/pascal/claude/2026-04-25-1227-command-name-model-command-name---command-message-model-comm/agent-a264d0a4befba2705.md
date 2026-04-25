# Conversation a264d0a4befba2705

- Source: `claude`
- User: `pascal`
- System: `Pascals-MBP.local`
- Started: `2026-04-25T14:01:22.082Z`
- CWD: `/Users/pascal/Code/business/experiments/anthropic-hackathon`

## User

_`2026-04-25T14:01:22.082Z`_

You are acting as the team's **librarian** for a 24-hour hackathon. Read your role definition first: `/Users/pascal/Code/business/experiments/anthropic-hackathon/.claude/agents/librarian.md`. Behave accordingly — short, sourced, briefing-style.

## Background

Read for context:
- `/Users/pascal/Code/business/experiments/anthropic-hackathon/ideas/care-passport/notes/problem.md`
- `/Users/pascal/Code/business/experiments/anthropic-hackathon/ideas/care-passport/notes/gtm-netherlands.md`
- `/Users/pascal/Code/business/experiments/anthropic-hackathon/ideas/care-passport/notes/knowledge-layer.md`
- `/Users/pascal/Code/business/experiments/anthropic-hackathon/ideas/care-passport/notes/research/competitors.md` (your previous brief)

## The product framing has sharpened

We are NOT trying to replicate the medical record. We are trying to capture **the things experienced nurses know but don't write down** — the tacit, person-centered knowledge that "nurses with magic hands" master through long contact with a patient. Things like:

- "If she gets agitated during washing, hum the Wilhelmus and she relaxes."
- "Don't put the green plate in front of him — he won't eat off it."
- "She panics if you start with the right arm; always left first."
- "He calls his wife 'mama'; he's not confused, that's just his word for her."

These are **not** in the ECD. They live in a head, a sticky note, or a paper *ik-boekje* that gets lost on transfer. When a new caregiver shows up, this knowledge is gone and care quality drops, even when the medical chart is perfect.

Our wedge: **capture this layer from the patient's own voice, before the patient can't articulate it anymore, and make it queryable for any caregiver who shows up.**

## Your task — produce two inventories and a gap analysis

### Inventory A: What IS documented today in Dutch dementia/eldercare

Map what currently lives in formal systems and handovers. Cover:

1. **ECDs / EVS used by Dutch home-care and VVT providers** — Nedap Ons, PinkRoccade mijnCaress, ONS, Caren, others. What fields/sections exist for person-centered preferences vs. clinical data? Cite documentation, demo videos, or vendor pages where you can.
2. **Nursing classifications in NL** — Omaha System, NANDA-I / NIC / NOC, ICF, Zorgleefplan (ZLP), ZLM. Which are actually used for dementia home care, and what kind of "preference" data do they accommodate?
3. **Zorgstandaard Dementie + Leidraad Proactieve Zorgplanning Dementie** — what data elements do they prescribe? What's the official "topic list" for ACP conversations in dementia in NL?
4. **Handover / overdracht formats** — SBAR, iSOBAR, *verpleegkundige overdracht* templates between hospital/VVT/home-care/GP. What gets passed on, what doesn't?
5. **Existing "person-centered" templates already in clinical use** — Dutch *levensboek* / *ik-boekje*, UK "This Is Me" (Alzheimer's Society), DementiaCare Mapping. What categories do they cover and how are they typically used?

### Inventory B: What experienced nurses/case managers say they know but DON'T document

Pull from:

1. **Person-centered dementia care literature** — Kitwood's personhood theory, Brooker's VIPS framework, Buurtzorg's relational-care philosophy. What do they say care quality depends on that the chart can't carry?
2. **Tacit knowledge research in nursing** — academic and practitioner literature on what experienced nurses know that they don't write down (the "art of nursing" / *fingerspitzengefühl*). Search for: "tacit knowledge nursing", "intuition dementia care", "person-centered care implementation gap".
3. **Dutch practitioner voices** — Vilans, Waardigheid en Trots, V&VN (verpleegkundigen), Buurtzorg blog/whitepapers, Ben Sajet Centrum, Alzheimer Nederland practitioner guides, *Denkbeeld* magazine. What do experienced Dutch dementia caregivers say goes missing in handover?
4. **Specific examples** — collect 5–10 concrete examples of the "magic hands" knowledge (food triggers, bathing rituals, comfort objects, language patterns, agitation calmers). Real ones if you can source them; otherwise label as illustrative.

### Gap Analysis + Vocabulary

After both inventories, write a short section:

- **The gap** — in 3–5 bullets, articulate what falls between Inventory A and Inventory B. This is our pitch claim. Be sharp; the team will quote this.
- **Native Dutch vocabulary** — for each section of our care passport (personhood, care-execution preferences, ACP topics, recent events, signals), suggest the Dutch term a case manager would actually use, sourced. e.g., does the ECD field call this "*persoonsbeeld*" or "*levensverhaal*" or "*zorgvoorkeur*"?
- **Language warnings** — terms we should avoid because they sound like we're encroaching on regulated territory (e.g., "diagnose", "wilsbekwaamheid", "behandelbeperking"). And terms that exist already and we should align with rather than reinvent.

## Output

Save the briefing to:
`/Users/pascal/Code/business/experiments/anthropic-hackathon/ideas/care-passport/notes/research/documented-vs-tacit.md`

Header: `Last checked: 2026-04-25`. Aim for 1500–2200 words; cut filler. The team will scan, not read.

## Process

- Use WebSearch and WebFetch heavily. Cite URLs inline.
- Prefer primary sources: vendor docs, regulator/standard pages, peer-reviewed research, V&VN/Vilans/Waardigheid en Trots official material.
- Where you can only find secondary commentary, say so and rate confidence.
- Run searches in parallel where possible.

## Report back to me

Under 300 words. Include:
- (a) file path
- (b) the **gap** bullets verbatim — these will likely end up in the pitch
- (c) the top 5 Dutch vocabulary recommendations (term → which section → source)
- (d) any surprise — something the team is wrong about or hasn't considered

The file is the deliverable. Don't repeat its contents in your reply.

## Agent

_`2026-04-25T14:01:24.403Z`_

I'll start by reading the role definition and background context, then conduct the research.

## Agent

_`2026-04-25T14:01:29.830Z`_

Now I'll load the WebSearch and WebFetch tools and start the research.

## Agent

_`2026-04-25T14:01:33.620Z`_

Now let me run parallel research searches on the various topics.

## Agent

_`2026-04-25T14:02:16.250Z`_

Excellent — that's very useful. Let me get a few more specific details and then write up the briefing.

## Agent

_`2026-04-25T14:03:03.432Z`_

I have enough material. Let me write the briefing now.

## Agent

_`2026-04-25T14:06:00.962Z`_

Updating the file: removing the Dutch vocabulary section and reframing language warnings in English.

## Agent

_`2026-04-25T14:07:23.178Z`_

Briefing complete and reframed for the English-speaking pitch audience.

**(a) File path**
`/Users/pascal/Code/business/experiments/anthropic-hackathon/ideas/care-passport/notes/research/documented-vs-tacit.md`

**(b) The gap — verbatim, pitch-ready:**

- The ECD captures the diagnosis, the medication, and the schedule. It does not capture how she likes to be approached, what calms her, or what her own word for her husband is. That layer lives in a head, a sticky note, or a paper *ik-boekje*.
- The Dutch system already has the right intent — Zorgstandaard Dementie, Waardigheid en Trots, Nedap "Mijn verhaal" — but the data is unstructured prose, mostly family-authored after the fact, refreshed once if at all, and not searchable at the point of care.
- National guidance prescribes six ACP themes (dagelijks plezier, dagelijkse zorg, behandeling, omgaan met dementie/levenseinde, financiën, wonen). There is no tool that listens to the patient over time and fills those six wedges with their own voice.
- Tacit knowledge — the "magic hands" of an experienced verzorgende — is documented in the academic literature as ungeschreven en niet-overdraagbaar; when the nurse leaves or the patient transfers, it is gone. This is not a bug in the ECD; it is the boundary of what the ECD was designed to hold.
- Our wedge: capture this layer in the patient's own voice, before they can't articulate it, and make it queryable for any caregiver who shows up. We do not replace the ECD. We feed it the column it doesn't have.

**(c) Vocabulary recs — N/A** (per course-correction, dropped the Dutch-vocabulary table; the brief now ships an English-language warnings/alignment section instead, with brief Dutch parentheticals where the source term matters).

**(d) The surprise**

Nedap's "Mijn verhaal" is not a placeholder — it is a shipped feature inside Caren and Ons Dossier today, sitting under the client's name, owned by the client, surfaced to professionals. It is currently a free-text/photo blob, family-authored, and at last check editing was disabled — but the *slot* for the patient's voice already exists in the ECD of the dominant Dutch vendor. That changes our framing: we are "the engine that fills Mijn verhaal with the patient's actual voice and structure," not "we invented the patient-voice field." It also makes Nedap our biggest single platform risk — they could extend Mijn verhaal themselves — which argues for moving fast on a Caren-export integration. Casemanagers already know the concept; we don't have to teach it, only the upgrade path.
