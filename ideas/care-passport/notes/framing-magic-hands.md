# Framing: capturing the "magic hands" knowledge

**Decision date:** 2026-04-25

## The sharpened wedge

We are not building a medical record. We are not building an advance directive. We are building the layer that **experienced nurses and family carers carry in their heads but never write down** — the tacit, person-centered knowledge that determines whether daily care goes well or badly.

Examples (illustrative):
- "If she gets agitated during washing, hum the *Wilhelmus* and she relaxes."
- "Don't put the green plate in front of him — he won't eat off it."
- "She panics if you start with the right arm; always left first."
- "He calls his wife 'mama'; that's not confusion, it's his word for her."

This knowledge is real and load-bearing for care quality. It is **not** in the ECD. It lives on a sticky note, in a head, or in a paper *ik-boekje* that gets lost on transfer. When a new caregiver shows up — a different shift, a hospital admission, a temp worker — this layer is gone, and care quality drops even when the medical chart is perfect.

## What this implies for the product

- **Capture from the patient's own voice, while they can still articulate.** The patient is the only person who reliably knows their own preferences and triggers; the nurse with magic hands has learned them, but a new caregiver hasn't.
- **The audience is "any caregiver who suddenly has them"** — not just the long-term case manager. Hospital nurse on admission, weekend home-care substitute, locum GP, family member visiting after a long absence.
- **Don't compete with the ECD.** Sit alongside it. The ECD has diagnoses and meds. We have "she likes her tea before being washed."
- **Frame as "preserving the person before the diagnosis takes them"** — not "AI for dementia."

## Future considerations (parked, not for the pitch)

The product *could* generalize beyond dementia. Anyone who has reduced capacity to articulate in a moment could benefit from "a voice partner that already knows my preferences":

- Panic attacks (the patient knows ahead of time that water and a quiet room help, but can't ask for them mid-attack).
- Autism / sensory overload episodes.
- Post-stroke aphasia.
- ICU sedation / post-op confusion.
- Severe depressive episodes where the person can't advocate for themselves.

For the hackathon pitch we **stay narrow on Alzheimer's / progressive cognitive decline**, because:
- The market reality, regulation, and stakeholder map are concrete (see `gtm-netherlands.md`).
- The "voice fades over time" arc is emotionally legible to judges.
- Generalizing too early dilutes the pitch.

The broader applicability becomes a one-line "and it generalizes to..." slide near the end if there's time, or a v2 thread.

## What this does NOT change

- Safety boundaries from `problem.md` and `knowledge-layer.md` still hold: no medical, legal, capacity, or placement decisions.
- The patient is still the author. We don't capture from family/staff *about* the patient as the primary input — that's a v2 mode.
- The case manager is still the primary professional buyer (see `gtm-netherlands.md`).
