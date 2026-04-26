# Story 4 — "How does this knowledge get in?"

**One-liner:** The patient's own voice is the primary input; family and caregivers can contribute, clearly labelled as secondary, with provenance preserved everywhere.

## The moment

Tuesday morning. A WhatsApp message arrives on a patient's phone: *"Good morning. What is one thing you're looking forward to today?"* She records a 40-second voice note while making tea. Forty minutes later her care passport has updated: a new preference ("morning tea before any care"), a new mention of her late husband, a new fragment about the garden she misses.

Saturday afternoon. Her son visits. He notices she's been calling the dog by her father's name. He opens the family channel and adds a short note: *"She's been calling the dog 'Henk' this week — that was her father's name."* The system saves it as a family contribution, not a patient statement.

Wednesday shift. The home-care nurse notices the patient flinches when approached from the right. She taps a quick "I noticed today" entry into the staff app. It saves as a caregiver observation with her name attached.

Three months later, a new locum nurse opens the briefing card and sees all three pieces of evidence — patient-authored, family-contributed, staff-observed — clearly labelled and source-linked.

## Who's in the scene

- **The patient (primary):** still capable of self-expression, willing to spend a minute or two a day talking to the system. The author of their own story.
- **The informal caregiver / family (secondary):** loving, present, but not the patient. Their input adds context the patient can't or won't share, but it is not the patient's voice.
- **The professional caregiver (tertiary):** observes things in real time that the patient may not articulate. Their input is structured, attributed, and treated as observation.
- **The system (passive):** never makes things up, never blends sources silently.

## What they need from us

> *"Make it easy to contribute. Make it obvious who said what. Never let one source pretend to be another."*

### From the patient

- **Light-touch prompts on a familiar channel** — a weekly WhatsApp question, then occasional follow-ups based on gaps.
- **Spontaneous notes welcome** — they can send a voice note any time without a prompt.
- **No app to install.** Voice notes only — no typing required, no UI to learn. (Phone-call fallback for those who don't use WhatsApp.)
- **Visible consent state.** They can see what's stored, withdraw items, or pause the system.

### From family

- **A separate, clearly-labelled channel** — a different WhatsApp number, or a tagged web form. Their contributions are stored as `source: family/<name>`, not as patient-authored.
- **Acknowledgement that this is supplementary.** The UI never elevates a family note above a patient note on the same topic without flagging the conflict.

### From caregivers

- **Two-tap input on shift** — "I noticed today that..." → speech-to-text → tagged with their role and name.
- **Non-clinical phrasing** — caregiver observations are stored as observations, not as patient preferences.

## What we show

- **Patient-facing:** WhatsApp conversation, voice-only. The system asks, the patient responds. Friendly, slow, no jargon.
- **Family-facing:** a dedicated channel (separate WhatsApp number or web form) for adding context. Always asks "is this something *they* said, or something *you* observed?"
- **Caregiver-facing:** in-app quick-entry on the standalone view; voice or text; auto-attributed.
- **Across all surfaces:** every captured item is tagged with **who said it, when, in what channel, and with what consent state.** No exception.

## What we explicitly aren't

- **Not silent recording.** No background listening, no ambient mics, no continuous capture. Every input is consciously initiated.
- **Not family-authored-by-default.** The patient's voice is the primary trust currency. Family input is real but always labelled.
- **Not a free-text dump.** Every input goes through extraction with provenance — even a casual voice note becomes structured items with quotes and timestamps.
- **Not editable past.** Corrections create new versions; they don't overwrite. The transcript is immutable.
- **Not consent-once.** Consent is granular (who can see what), revisitable, and revocable.

## Demo / pitch angle

This story is **the trust foundation of the entire pitch.** Without it, the other three stories raise the question "where does this data come from and who can I trust?"

Demo it briefly but explicitly. Show:
1. A patient sending a 30-second WhatsApp voice note.
2. The system extracting two structured items, each with a source clip.
3. The same items appearing in the briefing card from Story 1, citable to the patient's own voice.

The line: **"Every piece of knowledge in here came from a real person, on the record, with consent. We don't blend, we don't infer, we don't replace anyone's voice with our own."**

This is also where the **regulatory and ethical posture** lives: GDPR-grade consent, NEN 7510 controls, EU hosting, source-cited output, human sign-off before anything reaches the formal care record. The seller should have one slide that summarises this stack — it converts skepticism into trust.
