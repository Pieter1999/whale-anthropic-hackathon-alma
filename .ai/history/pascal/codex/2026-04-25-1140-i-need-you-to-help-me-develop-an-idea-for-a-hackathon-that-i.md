# Conversation 019dc471-2a8a-7d23-9d3d-7a85ea1623bc

- Source: `codex`
- User: `pascal`
- System: `Pascals-MBP.local`
- Started: `2026-04-25T11:40:44.060Z`
- CWD: `/Users/pascal/Code/business/experiments/anthropic-hackathon`

## User

_`2026-04-25T11:44:19.241Z`_

I need you to help me develop an idea for a hackathon that I'm part of today, 24 hours. And so what I need you to do is be a great coach and assistant in terms of focusing on the 24-hour short timeline, right? So this is what matters. We're a team of four people, and we have to both sharpen our idea and then implement it within 24 hours. The hackathon is between AIM and Amsterdam, and the partners are Anthropic, Reson8, so that's a language model company, and a number of others. And yeah, the ultimate goal is to create an amazing product. And so the idea that I want to really sharpen with you is going towards building a digital representative for elderly or people that are suffering from degenerative diseases that don't have anyone to speak for them, to represent them in the medical system. And so the argument is that when you have, for example, Alzheimer's, your mind fades and you cannot take decisions anymore for yourself, but not everyone has a family member with power of attorney, and the process and the system of the healthcare system struggles to serve people that are between institutions. So say you're not quite yet in a 24-7 care environment, then you're... You often get forgotten in and then your service or your um your care is not thorough or complete. And so we want to solve this problem of people struggling in the last years of their lives in two ways. One is that it's it's their kind of companion for their for those years, but it's also their representative. So think of it like a virtual um companion, like end-of-life companion that has the authority to take decisions because this system knows the patient better than anyone else. This is particularly for people who don't have family members that would normally fill this position. So um yeah, we want to develop this, we want to build this, uh and have a prototype by end of like midday tomorrow. But I think for now let's first dig into the idea, the market, the potential, the problem, really get the problem sharp, the narrative, and the vision. And then from there, we can later on uh solve the technical implementation.

## Agent

_`2026-04-25T11:44:28.026Z`_

I’ll anchor this around a 24-hour prototype, so the core idea has to be emotionally clear, ethically defensible, and demoable without depending on legal authority we cannot prove in a hackathon. I’m going to quickly ground the problem with current healthcare/legal context, then turn it into a tight product wedge and demo story.

## Agent

_`2026-04-25T11:44:55.166Z`_

The legal context is the first hard edge: in the Netherlands, if someone loses decision-making capacity, clinicians look for an advance directive and a human representative; if neither exists and no family can act, the doctor may ultimately decide. So the strongest hackathon framing is not “AI has authority,” but “AI preserves the patient’s voice and makes it usable when humans must decide.”

## Agent

_`2026-04-25T11:45:32.186Z`_

The sharper version is:

**A voice that stays when memory fades.**

Build a digital care advocate for people with early dementia or degenerative illness who are still legally capable today, but are at risk of becoming “unrepresented” later: no reliable family, no appointed representative, no one who knows their values well enough to speak for them.

The product should **not** claim to autonomously make medical decisions. That is legally and ethically fragile. In the Netherlands, doctors first look for an advance directive and a human representative; if none exists and no family can act, the doctor may ultimately decide. So your stronger framing is: **we preserve the patient’s voice, values, routines, fears, and preferences, then make them usable by clinicians, social workers, and care teams when the person can no longer explain themselves.**

**The Problem**
There is a painful gap between “living independently” and “24/7 institutional care.” People with dementia can spend years in that gap: still at home, increasingly confused, increasingly isolated, and served by fragmented care systems.

The data supports this:
- WHO estimates 57 million people lived with dementia globally in 2021, with nearly 10 million new cases each year. Dementia cost the global economy about $1.3T in 2019. [WHO](https://www.who.int/news-room/fact-sheets/detail/dementia)
- In the Netherlands, Alzheimer Nederland estimated 310,000 people with dementia in 2024; 230,000 lived at home, and 70,000 of those lived alone. [Alzheimer Nederland PDF](https://media.alzheimer-nederland.nl/s3fs-public/media/2025-03/documents/nieuwe%20cijfers%20en%20kengetallen%20dementie%20tabellen.pdf)
- CBS reported 3.3 million Dutch people lived alone at the start of 2024, with women aged 70+ the largest group. [CBS](https://longreads.cbs.nl/the-netherlands-in-numbers-2024/how-many-people-live-alone/)
- Dutch government guidance says that if someone cannot decide, clinicians look for a written directive and appointed representative; if none exist and no close relative can act, the doctor decides. [Rijksoverheid](https://www.rijksoverheid.nl/onderwerpen/levenseinde-en-euthanasie/vraag-en-antwoord/wilsonbekwaamheid)

**The Wedge**
Do not start with “AI companion for elderly people.” Too broad, too crowded.

Start with:

> “We help people at risk of losing capacity create a living care passport before it is too late.”

This gives you a concrete user, moment, buyer, and demo.

The first users are people with early-stage dementia, Parkinson’s, ALS, Huntington’s, or other progressive conditions who still have capacity but lack a strong support network.

The first buyers could be dementia case managers, municipalities, home-care organizations, GP networks, insurers, or hospitals trying to reduce unsafe discharges and goal-discordant care.

**Product Concept**
Working name: **Mara** or **CareVoice**.

Core flow:

1. **Memory and values capture**  
   A warm voice agent interviews the person over time: “What does a good day look like?”, “What scares you about care?”, “Would you rather prioritize comfort, independence, or life extension?”, “Who do you trust?”, “What routines keep you calm?”

2. **Living care passport**  
   The system turns conversations into a structured profile: medical preferences, daily routines, food, religion, language, dignity preferences, red lines, important memories, care contacts, and advance-directive status.

3. **Care advocate dashboard**  
   A clinician or case manager sees a concise, sourced summary: “Anna has consistently said she values staying at home, but not if she becomes unsafe overnight. She prefers Dutch, hates being restrained, and wants music from Ramses Shaffy when distressed.”

4. **Decision support, not decision making**  
   When a care decision arises, the system produces a “patient voice memo”: what the person previously said, with timestamps and confidence, so humans can make better decisions.

5. **Gap detection**  
   The system flags missing protections: no legal representative, no advance directive, missed appointments, worsening confusion, unsafe home signals.

**Demo Story For Tomorrow, Sunday April 26, 2026**
Make the demo emotionally simple:

“Meet Anna, 76, living alone in Amsterdam with early Alzheimer’s. She is still capable today, but has no children and no appointed representative.”

Demo scene 1: Anna talks to Mara. Mara asks gentle questions and builds her care passport.

Demo scene 2: Time jump. Anna is confused after a fall. A hospital team opens her care passport.

Demo scene 3: The dashboard shows:
- what Anna values;
- what she repeatedly said;
- what legal documents are missing;
- what care team should verify;
- a generated doctor/social-worker brief.

Final line:

> “When Anna can no longer explain who she is, Mara helps the care system remember.”

**What Makes It Hackathon-Winnable**
The emotional punch is strong, but the implementation can be small:
- voice chat;
- persistent memory;
- structured care passport;
- clinician dashboard;
- sourced “patient voice” summary;
- one beautiful scenario.

Avoid building full companionship, legal automation, EHR integration, emergency response, or autonomous medical advice in 24 hours.

Your strongest narrative is not “AI replaces family.” It is:

> “For people who have no one, we give the care system a way to hear the person before the disease silences them.”

## User

_`2026-04-25T11:45:32.416Z`_

repo structure should be

notes/
code/
AGENTS.md

## Agent

_`2026-04-25T11:45:37.176Z`_

I’ll set the workspace up around that structure first, then check what already exists so I don’t move or overwrite anything unexpectedly.

## Agent

_`2026-04-25T11:45:41.114Z`_

The repo is currently empty apart from `.git`, so there’s no existing layout to preserve. I’m going to create `notes/`, `code/`, and a root `AGENTS.md`, with placeholder files in the directories so the structure is visible to git.

## Agent

_`2026-04-25T11:45:49.550Z`_

The requested top-level structure is now in place. I’ll do a quick status check so the final state is explicit.

## Agent

_`2026-04-25T11:45:53.163Z`_

Set up the repo structure:

- [AGENTS.md](/Users/pascal/Code/business/experiments/anthropic-hackathon/AGENTS.md)
- [code/](/Users/pascal/Code/business/experiments/anthropic-hackathon/code)
- [notes/](/Users/pascal/Code/business/experiments/anthropic-hackathon/notes)

I added `.gitkeep` files so `code/` and `notes/` are tracked even before they contain real files.

## User

_`2026-04-25T11:48:37.903Z`_

can yo briefly check if you can access this page? 
https://www.notion.so/learnloop/Pascal-34d5e7626c0b8079bbf9f3ab62f50606?source=copy_link
If so put the 30s pitch on there

## Agent

_`2026-04-25T11:48:46.517Z`_

I’ll use the Notion workflow here because this is an edit to a specific Notion page. I’ll first check whether the connector can resolve that URL, then I’ll add a compact 30-second pitch if access is available.

## Agent

_`2026-04-25T11:49:00.729Z`_

The connector could not resolve the shared URL directly (`object_not_found`). I’m going to try the raw Notion page ID next, since Notion share URLs sometimes fail while the page ID succeeds if permissions are available.

## Agent

_`2026-04-25T11:49:07.048Z`_

The raw ID also failed, so this looks like a permissions/link visibility issue rather than a URL parsing issue. I’ll do one quick workspace search for the page title before calling it inaccessible.

## Agent

_`2026-04-25T11:49:26.073Z`_

I can’t access that exact Notion page. The Notion connector returns `object_not_found` for both the URL and raw page ID. I also found another page titled “Pascal” in the workspace, but it has a different ID, so I did not edit it.

30s pitch to paste:

> For people with dementia or degenerative disease, there is a moment when they are still themselves, but the system is already beginning to lose them. Our product captures their voice before that happens. Through gentle conversations, it builds a living care passport: their values, routines, fears, medical preferences, and what dignity means to them. Later, when they can no longer explain themselves, doctors and care teams can still hear who they are. It does not replace family or make medical decisions. It preserves the patient’s voice so humans can make better, more humane decisions.

## User

_`2026-04-25T11:49:26.297Z`_

it's a shared page in another perosn's workspace. lmk if that is an issue

## Agent

_`2026-04-25T11:49:35.272Z`_

Yes, that is likely the issue.

The Notion connector can only edit pages available to the connected Notion account/workspace. A shared link from someone else’s workspace does not necessarily grant API/edit access, even if you can open it in your browser.

To let me edit it, either:

1. Have them explicitly share the page with the Notion account connected to Codex, with edit access.
2. Move/duplicate the page into your connected workspace.
3. Paste the page contents here and I’ll give you the exact block to add manually.

I did not edit the other “Pascal” page I found, since it was a different Notion page ID.

## User

_`2026-04-25T11:50:29.562Z`_

Okay, let's do this. Can you distill the problem, like the problem statement into a problem.md file in the notes page, and then I'll work locally.

## Agent

_`2026-04-25T11:50:33.080Z`_

I’ll capture this as a concise problem statement in `notes/problem.md`, focused on the hackathon narrative and avoiding overclaiming legal authority.

## Agent

_`2026-04-25T11:50:44.981Z`_

The problem statement file is written. I’ll quickly verify it exists and check git status so you can pick it up locally.

## Agent

_`2026-04-25T11:50:47.124Z`_

Created [problem.md](/Users/pascal/Code/business/experiments/anthropic-hackathon/notes/problem.md) in `notes/`.

It frames the issue as loss of patient voice before the care system has captured it, with a clear boundary that the AI preserves and structures preferences rather than making medical decisions.

## User

_`2026-04-25T11:54:42.617Z`_

ok we now need to think about the MVP solution. 

I'm thinking whatsapp voice message based interface for people. It acts as a companion but over time learns the preferences and habits of people. Listens, hears them, understands them fully. Then when the time comes, caretakers are able to query and interact with the assistant and speak to their preferences and receive advice and feedback from it as they try to take decisions. 

It may also have an active component. It does not take medically bidning decisions but it does keep taps on the patient and ensures they don't fall between the cracks of the system. If the system forgets about them (e.g. not yet in full caretaking instiutiotn but also struglging a lot at ome) it initiates the next steps needed to get better support

## Agent

_`2026-04-25T11:54:53.613Z`_

I’ll treat WhatsApp voice as the interaction wedge and sanity-check the technical shape against current WhatsApp API constraints, because the MVP depends on what we can actually receive, transcribe, and respond to in 24 hours. Then I’ll turn it into a tight demoable solution.

## Agent

_`2026-04-25T11:55:26.716Z`_

Yes. This is the right MVP direction. The key is to narrow it to:

**WhatsApp voice companion → living care passport → caretaker copilot.**

Not “AI legal guardian.” Not “medical decision-maker.” Not “elderly chatbot.” The MVP is a **patient voice preservation and care-gap detection system**.

**MVP Problem-Solution Fit**
The patient already knows how to use WhatsApp voice notes. Over weeks or months, they send natural messages: memories, worries, daily updates, preferences, complaints, stories. The assistant replies warmly, asks gentle follow-ups, and extracts structured facts into a care passport.

Later, when a caretaker, doctor, or social worker needs to understand the person, they can ask:

> “Would Anna want to move into a care home?”  
> “What calms her down when she is confused?”  
> “Has she mentioned falling or skipping medication?”  
> “What matters most to her at end of life?”

The assistant answers with:
- a clear recommendation;
- supporting evidence from the patient’s own past voice notes;
- confidence level;
- what still needs human verification.

**Core MVP**
Build only three things:

1. **Patient WhatsApp Interface**
   - Receives voice notes.
   - Transcribes them.
   - Responds with a short, warm message.
   - Asks one useful follow-up question.
   - Extracts memories, preferences, routines, worries, and risk signals.

2. **Living Care Passport**
   - Profile summary: values, routines, people, medical preferences, fears, red lines.
   - Evidence-backed: every claim links back to a transcript.
   - Updates over time.
   - Separates “strongly stated preference” from “inferred pattern.”

3. **Caretaker Query Interface**
   - A simple dashboard or chat screen.
   - Caretaker asks questions about the patient.
   - System responds as “patient voice + care reasoning,” not as a doctor.
   - Includes suggested next steps: call GP, notify case manager, schedule visit, check medication, discuss advance directive.

**Active Component**
This is strong, but keep it bounded.

The assistant should not “initiate healthcare decisions.” It should detect when someone may be falling between the cracks and generate an escalation.

Example triggers:
- “I fell again yesterday.”
- “I forgot my pills.”
- “No one has visited this week.”
- “I don’t know where I am.”
- repeated missed check-ins;
- increasing confusion in transcripts;
- worsening mood/loneliness.

MVP behavior:

> “Mara detected three risk signals this week: fall, medication uncertainty, and missed check-ins. Suggested action: notify assigned caretaker and schedule GP/case-manager follow-up.”

For the hackathon demo, make this a visible **Care Gap Alert**, not a real automated healthcare action.

**Demo Narrative**
Use one fictional patient: Anna, 76, early Alzheimer’s, lives alone in Amsterdam.

Flow:
1. Anna sends WhatsApp voice note: “I forgot my pills again. I don’t want to leave my apartment, but I’m scared at night.”
2. Assistant replies gently and asks a follow-up.
3. Dashboard updates care passport.
4. Time jump: caretaker asks, “Is Anna ready for assisted living?”
5. Assistant answers: “Anna has consistently prioritized staying at home, but she has also said she feels unsafe at night and fears being alone after falls. Recommendation: explore supported housing or nightly home-care before full institutional care.”
6. Alert appears: “Risk increasing: medication, falls, loneliness.”

**Strong One-Liner**
> A WhatsApp voice companion that captures who someone is before dementia takes their voice, then helps caretakers make decisions that still sound like the person.

**Non-Goals For 24 Hours**
Do not build:
- legal authority;
- EHR integrations;
- real medical recommendations;
- emergency dispatch;
- full caregiver network;
- long-term scheduling system.

For tomorrow, the product only needs to prove: **voice in, memory built, caretaker asks, patient voice comes back with evidence.**

## User

_`2026-04-25T12:00:26.076Z`_

ok... check hermes agent for inspiration. we don't need such a fully free agent but we need something that maintains state over the same person and learns about them over time. and then a "secondary interface" where HCP can interact with the system to understand the patients needs. 

the HCP I would do UI based, i.e. nextjs webapp showing the "top down" from the perspective of the HCP. with ability to drill into details. but the knoweldge base behind the scenes should be relatively flexible. 

Can you look up latest knowledge and research on ways to build memory systems for agents and how to expose them through a UI

## Agent

_`2026-04-25T12:00:41.233Z`_

I’ll treat this as a short research pass, not implementation yet. I’m going to look for primary sources on Hermes-style agent state, current agent memory architectures, and UI patterns for exposing memory to clinicians/caretakers with traceability.

## Agent

_`2026-04-25T12:02:57.659Z`_

The research points toward a layered memory design rather than one big vector database. For our use case, the crucial difference is that care preferences change over time and every answer to an HCP needs provenance, so we need structured profile memory plus raw voice-note evidence behind it.

## Agent

_`2026-04-25T12:03:25.261Z`_

I’d take Hermes as inspiration, but simplify hard.

Hermes’ useful idea is **layered memory**: small curated facts always available, searchable past sessions, and learned procedures/skills. Official Hermes docs describe bounded `MEMORY.md` / `USER.md` files plus session search over stored conversations. For us, the equivalent is not “free autonomous agent memory,” but a **patient memory system with provenance**.

**Recommended MVP Architecture**
Use five memory layers:

1. **Raw evidence log**  
   Every WhatsApp voice note becomes:
   - audio file
   - transcript
   - timestamp
   - speaker
   - source channel
   - extracted tags

2. **Patient profile memory**  
   A compact, always-loaded “care passport”:
   - values
   - routines
   - fears
   - comfort strategies
   - people/places
   - care preferences
   - red lines
   - known risks

3. **Episodic memory**  
   Important events over time:
   - “fell on Tuesday”
   - “missed medication twice this week”
   - “said she feels unsafe at night”
   - “daughter visited after three months”

4. **Temporal knowledge graph / structured facts**  
   This matters because facts change. “Wants to stay home” may later become “still prefers home, but accepts night care.” Zep/Graphiti’s temporal graph approach is relevant here: facts have time, relationships, and invalidation rather than one overwritten truth.

5. **Risk and care-gap state**  
   A derived layer:
   - risk level
   - unresolved alerts
   - missed check-ins
   - suggested next action
   - responsible human

**Research Takeaways**
The field has converged on layered memory rather than “just vector search.”

- **MemGPT / Letta**: distinguish always-visible core memory from searchable archival memory. This maps very well to “care passport + evidence archive.” [Letta memory docs](https://docs.letta.com/guides/agents/memory)
- **LangGraph / Deep Agents**: classify memory as semantic, episodic, and procedural, with user-scoped memory and background consolidation. Useful design vocabulary. [LangChain memory overview](https://docs.langchain.com/oss/javascript/concepts/memory)
- **Zep / Graphiti**: best inspiration for changing facts over time; temporal graph memory is stronger than static RAG for evolving patient state. [Graphiti docs](https://help.getzep.com/graphiti/getting-started/overview)
- **Mem0**: production-oriented memory layer with add/search/update patterns and user-scoped retrieval. Good if you want a quick managed/open-source memory backend. [Mem0 docs](https://docs.mem0.ai/openmemory/overview)
- **LongMemEval / LoCoMo benchmarks**: current models still struggle with multi-session, temporal, updated memory. So the UI must expose evidence and uncertainty, not just answers. [LongMemEval](https://web.cs.ucla.edu/~kwchang/bibliography/wu2025longmemeval/) and [LoCoMo](https://arxiv.gg/abs/2402.17753)

**HCP UI**
The HCP interface should not look like a chatbot first. It should look like a clinical cockpit:

- **Patient overview**: current state, top risks, last contact, unresolved care gaps.
- **Care passport**: values, routines, triggers, preferences, comfort strategies.
- **Ask the patient voice**: HCP asks natural questions.
- **Evidence cards**: every answer shows supporting voice-note transcripts, dates, and confidence.
- **Timeline**: major events and preference changes over time.
- **Memory inspector**: HCP can confirm, dispute, or mark memories outdated.
- **Alerts**: “medication uncertainty mentioned 3x this week,” “missed check-in,” “fall risk rising.”

For healthcare, provenance is not optional. FDA CDS guidance emphasizes that recommendations to HCPs should provide the basis so the HCP does not rely primarily on the software. [FDA CDS guidance](https://www.fda.gov/medical-devices/software-medical-device-samd/clinical-decision-support-software-frequently-asked-questions-faqs)

**Best Hackathon Cut**
Build:

> WhatsApp voice note in → transcript → extracted memories → care passport → HCP dashboard → HCP asks question → answer with evidence.

Do not build a fully autonomous Hermes-style agent. Build a **stateful patient memory service** with a companion interface and an HCP evidence UI. That is much more credible for 24 hours.

## User

_`2026-04-25T12:03:27.638Z`_

can you spin up subagents? If so have one subagent design the knowledge layer, one the frontend for the HCP and one the gateway / interface layer for the consumer. And one doing research on GTM, national initiatives in NL we can tap into etc. Have them all collaborate on the research in the notes folder.

## Agent

_`2026-04-25T12:03:45.055Z`_

Yes, I can. I’ll split the work into four disjoint note files so they can run in parallel without stepping on each other, then I’ll synthesize their outputs into a single MVP direction after they return.

## Agent

_`2026-04-25T12:04:27.019Z`_

The first spawn attempt hit a tool constraint around full-history forks inheriting settings. I’ll retry with self-contained prompts and explicit worker ownership, which is fine here because each agent has a narrow file to produce.

## Agent

_`2026-04-25T12:04:56.546Z`_

All four workers are running now: knowledge layer, HCP frontend, consumer gateway, and Netherlands GTM. I’ll add a lightweight notes index so their outputs have a clear home and you can navigate the research quickly.

## Agent

_`2026-04-25T12:05:15.899Z`_

I’m waiting on the four research/design agents now. Once they return, I’ll review the note files rather than just trusting the summaries, then I’ll produce a synthesis file that ties the MVP together.

## Agent

_`2026-04-25T12:06:49.668Z`_

The HCP frontend agent is done and has written `notes/hcp-frontend.md`. The other three are still running, so I’m going to wait for those before synthesizing.

## Agent

_`2026-04-25T12:06:57.459Z`_

The consumer gateway design is done too. Still waiting on knowledge layer and Netherlands GTM; those are the two pieces most likely to affect the final architecture and pitch.

## Agent

_`2026-04-25T12:07:30.488Z`_

Knowledge layer is complete. I’m waiting on the Netherlands GTM research now, then I’ll read the actual files and produce the integrated MVP direction.

## User

_`2026-04-25T19:40:32.568Z`_

can you think fo rme how you would structure the knowledge base for a single patient? What hierarchy, required and optional data. we need a "structured core" but keep space for flexibility of other facts/knowledge that give it richness and color

## Agent

_`2026-04-25T19:51:22.795Z`_

I’ll ground this in the knowledge-layer notes the agents just produced, then I’ll give you a concrete single-patient hierarchy you can use both for the backend schema and the HCP UI.

## Agent

_`2026-04-25T19:51:26.658Z`_

The subagent summaries reported those files, but they aren’t visible in this worktree yet, so I’ll proceed from the design decisions we have and make this directly usable. I’ll also check the notes folder so I can avoid assuming files exist.

## Agent

_`2026-04-25T19:52:13.495Z`_

I’d structure the single-patient knowledge base as **a care passport with an evidence-backed memory graph behind it**.

The key design principle:

> Structured enough for safety and UI. Flexible enough to preserve the person.

## Top-Level Hierarchy

```txt
Patient
├── Identity & Consent
├── Clinical Context
├── Care Network
├── Living Situation
├── Core Preferences
├── Daily Life & Routines
├── Communication Profile
├── Emotional & Social World
├── Risk Signals
├── Care Gap State
├── Timeline / Episodes
├── Evidence Vault
└── Open Memory / Rich Context
```

## 1. Identity & Consent

Required:
- `patient_id`
- `display_name`
- `date_of_birth` or age band
- `primary_language`
- `consent_status`
- `consent_scopes`
- `created_at`
- `last_updated_at`

Consent scopes should be explicit:
- store voice notes
- transcribe voice notes
- summarize into care passport
- share with named HCPs/caretakers
- send check-ins
- raise alerts

Optional:
- preferred name
- pronunciation
- photo/avatar
- WhatsApp number
- emergency contact

## 2. Clinical Context

Keep this lightweight. We are not replacing the medical record.

Required:
- `known_conditions`
- `cognitive_status`: e.g. early dementia, suspected decline, unknown
- `capacity_status`: self-reported / clinician-confirmed / unknown
- `medication_context`: free-text or structured summary
- `care_level`: independent, home care, assisted living, nursing home, unknown

Optional:
- diagnosis date
- GP
- dementia case manager
- mobility limitations
- allergies
- assistive devices
- relevant documents: advance directive, care plan, power of attorney

## 3. Care Network

Required:
- named HCP/caretaker users who can access the profile
- role
- permission level

Optional:
- family
- neighbors
- friends
- informal helpers
- trusted people
- people the patient does not want involved

Important distinction:

```txt
trusted_by_patient != legally_authorized
```

That distinction should be visible in the UI.

## 4. Living Situation

Required:
- living arrangement: alone, partner, family, care facility
- home support level
- known vulnerabilities

Optional:
- address/neighborhood
- stairs/elevator
- pets
- food access
- transport access
- home safety notes
- “what makes home feel like home”

This category helps make recommendations humane, not just clinical.

## 5. Core Preferences

This is the heart of the product.

Required:
- `values`
- `care_goals`
- `independence_preferences`
- `comfort_preferences`
- `medical_tradeoffs`
- `red_lines`

Example:

```json
{
  "type": "core_preference",
  "category": "living_arrangement",
  "claim": "Anna strongly prefers to remain at home as long as she feels safe at night.",
  "strength": "strong",
  "confidence": 0.86,
  "status": "active",
  "last_confirmed_at": "2026-04-22",
  "evidence_ids": ["ev_123", "ev_187"]
}
```

Good categories:
- staying at home vs moving
- hospital vs comfort care
- independence vs safety
- social contact
- privacy
- religious/spiritual wishes
- end-of-life wishes
- food/music/clothing/body care
- what dignity means to them

## 6. Daily Life & Routines

Required:
- morning routine
- evening routine
- medication routine if known
- food/drink habits
- sleep pattern
- appointments pattern

Optional:
- favorite meals
- favorite music
- cleaning habits
- TV/radio habits
- walking routes
- shops/cafes
- rituals
- things that cause distress

This is where the system becomes useful for real caretaking.

Example:

```json
{
  "type": "routine",
  "category": "evening",
  "claim": "Anna becomes anxious after sunset and feels calmer when the hallway light is left on.",
  "confidence": 0.78,
  "evidence_ids": ["ev_221"]
}
```

## 7. Communication Profile

Required:
- preferred language
- communication style
- known confusion triggers
- calming strategies

Optional:
- hearing/vision limitations
- words/names that help orient them
- words/topics to avoid
- whether they prefer directness or reassurance
- how they express pain/fear/confusion

This is very valuable for dementia care.

Example:
- “Do not ask multiple questions at once.”
- “She responds better to ‘Anna, it is Tuesday morning’ than ‘Do you remember what day it is?’”

## 8. Emotional & Social World

This is the “richness and color” layer, but still useful.

Optional but important:
- important life stories
- losses/grief
- proud moments
- former profession
- hobbies
- music
- faith
- places
- people they miss
- fears
- sources of joy
- identity statements

Example:

```json
{
  "type": "identity_memory",
  "category": "life_story",
  "claim": "Anna was a primary school teacher and still sees teaching as central to who she is.",
  "emotional_tone": "pride",
  "evidence_ids": ["ev_045", "ev_112"]
}
```

This is not just sentimental. It helps HCPs treat the patient as a person.

## 9. Risk Signals

Required:
- risk type
- severity
- recency
- evidence
- unresolved/resolved status

Risk types:
- falls
- missed medication
- confusion
- loneliness
- unsafe home
- nutrition
- hygiene
- wandering
- financial vulnerability
- missed appointments
- caregiver absence
- mood decline

Example:

```json
{
  "type": "risk_signal",
  "risk": "medication_uncertainty",
  "severity": "medium",
  "status": "active",
  "observed_count_7d": 3,
  "summary": "Anna mentioned forgetting or doubting medication three times this week.",
  "recommended_next_step": "Ask home-care nurse or GP assistant to verify medication setup.",
  "evidence_ids": ["ev_301", "ev_322", "ev_340"]
}
```

## 10. Care Gap State

This is the active component.

Required:
- current overall risk level
- unresolved alerts
- last meaningful contact
- next suggested human action
- assigned responsible human, if known

Example:

```json
{
  "care_gap_status": "watch",
  "reason": "Increasing night anxiety, medication uncertainty, and no confirmed care visit in 5 days.",
  "next_action": "Notify dementia case manager or home-care coordinator.",
  "urgency": "within_48_hours",
  "evidence_ids": ["ev_322", "ev_340"]
}
```

Use labels like:
- stable
- watch
- needs_follow_up
- urgent_human_review

Avoid labels like:
- diagnosis
- unsafe
- requires admission

## 11. Timeline / Episodes

This gives memory temporal structure.

Required:
- date
- event type
- summary
- evidence
- impact

Event types:
- voice note
- fall
- missed medication
- appointment
- care visit
- mood change
- preference update
- conflict detected
- alert raised
- alert resolved

This should power the HCP timeline.

## 12. Evidence Vault

Everything important must point back here.

Required:
- `evidence_id`
- source type: voice note, transcript, HCP note, form, imported document
- timestamp
- raw transcript
- excerpt
- audio URL if available
- speaker
- processing metadata

This is the source of truth.

Generated memories are not source of truth. They are interpretations of evidence.

## 13. Open Memory / Rich Context

This is your flexible layer.

Use a generic memory item format:

```json
{
  "memory_id": "mem_123",
  "patient_id": "anna",
  "type": "open_memory",
  "category": "personal_history",
  "claim": "Anna feels most herself when talking about teaching children to read.",
  "tags": ["identity", "profession", "comfort"],
  "confidence": 0.82,
  "status": "active",
  "importance": "medium",
  "valid_from": "2026-04-18",
  "valid_until": null,
  "evidence_ids": ["ev_045"],
  "created_by": "ai",
  "review_status": "unreviewed"
}
```

This lets you store facts that do not fit the rigid care passport yet.

## Required vs Optional

For the hackathon MVP, required fields should be:

- identity
- consent status
- care network
- top values
- living preference
- daily routine summary
- communication guidance
- active risks
- care gap status
- evidence-backed timeline
- source transcripts

Optional richness:
- life story
- music
- food
- religion
- emotional triggers
- favorite places
- personal objects
- memories
- regrets
- hopes
- humor/personality

## The Core Data Model

I’d use three primary concepts:

```txt
Evidence
Raw things the patient or HCP actually said/did.

Memory
A structured claim extracted from evidence.

State
A current synthesized view derived from memories.
```

That gives you flexibility without losing rigor.

In code terms:

```txt
patients
evidence_items
memory_items
patient_state_snapshots
alerts
care_team_members
```

The most important table is probably `memory_items`, because it can hold both structured and flexible knowledge.

## My Recommendation

Make the structured core these seven sections:

1. **Who Anna Is**
2. **What Matters To Her**
3. **How To Care For Her**
4. **Daily Life**
5. **Health & Support Context**
6. **Current Risks**
7. **Evidence Timeline**

Then allow every memory to also have:
- tags
- confidence
- importance
- source evidence
- recency
- status: active, outdated, disputed, candidate
- reviewer note

That gives you the best balance: a clean HCP cockpit plus a rich, growing patient memory underneath.
