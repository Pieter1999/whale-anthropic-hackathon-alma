# Distribution: Adapter + Standalone UI

**Decision date:** 2026-04-25

## The strategy

We are not a new patient-portal vendor. We are not a new ECD. We are an **engine that captures the patient's voice and structures it**, and we ship in two modes:

1. **Adapter mode (primary)** — write the structured care-passport output into the patient/family-facing "voice" slots that already exist in dominant Dutch ECDs and portals (Nedap Caren's *Mijn verhaal*, PinkRoccade's equivalent, future MedMij PGO life-story fields). We do not replace those slots; we fill them with structured, voice-native, source-cited content the slot was always meant to hold.
2. **Standalone UI (secondary)** — a small in-house web view for cases where the adapter target doesn't exist or isn't reachable: hospital admission, locum nurse, organisations on niche ECDs, family carers without a portal account, or pre-pilot demos. The standalone view shows the same care passport with the same provenance, gated by patient/representative consent.

Why this is the right shape:
- **Distribution.** Caregivers and case managers already log in to *something* daily. We meet them there instead of asking for one more login.
- **Trust.** "We feed the field your ECD already has" is easier to explain to a procurement officer than "adopt our new system."
- **Defensibility.** The valuable output is the structured-and-cited care passport, not the rendering surface. We can change rendering surfaces; competitors can't easily change what we capture.
- **Pitch clarity.** "We are the engine, not the field" gives us a one-liner against Nedap if/when they extend *Mijn verhaal* themselves.

## Integration surfaces (what we know, what we need)

### Known with reasonable confidence

| Surface | Vendor | Slot | Evidence | Adapter readiness |
|---|---|---|---|---|
| **Caren / Ons Dossier** | Nedap | *Mijn verhaal* / *Persoonlijk cliëntverhaal* | Shipped feature, free-text + photo, family-authored, editing temporarily disabled at time of writing | API status unknown — likely user-facing only; needs investigation |
| **mijnCaress / Ecare / Pluriform** | PinkRoccade / Ecare | Life-story field exists per librarian brief | Vendor pages confirm life-story + Omaha care plan | Field name and family-portal name unknown |
| **MedMij-certified PGOs** | Ivido, Quli, Drimpy, Patient1, etc. | Patient-controlled health environment with life-story support per MedMij standard | MedMij is the national framework; Caren itself is MedMij-compliant | Schema for life-story / preferences may or may not be standardised — needs investigation |

### Unknown and worth a focused librarian pass

1. **Does Nedap publish an API/import path** for *Mijn verhaal*, or is it strictly user-facing? If user-facing only, our v1 adapter is a "structured-export PDF/markdown that the patient or family can paste in," not a programmatic write.
2. **PinkRoccade family portal** — what is their family-facing equivalent of Caren? What is the field name for the life-story slot?
3. **MedMij data schema** — is there a defined data structure for "life story" / "care preferences" / "ACP topics"? If yes, we structure our output to match.
4. **Hospital ECDs (HiX, Epic NL, Nexus)** — do any have patient-voice / personhood slots, or is hospital admission always a standalone-UI moment?
5. **VVT-side standards** — does Vilans / Waardigheid en Trots publish a recommended schema for *persoonsbeeld* / *levensverhaal* that any ECD could adopt?

## Implications for the demo

- The prototype should make the dual mode visible:
  - **Standalone view** — the in-house care-passport UI (already planned).
  - **Adapter export** — a clearly-labelled "Export to Caren / *Mijn verhaal*" button that produces a structured markdown/PDF document mapped to the six ACP themes plus personhood + care-execution preferences. Even if the actual write is manual paste in v1, *showing the export shape* is the pitch moment.
- Seed transcripts should produce passports that obviously fill the *Mijn verhaal* slot better than a free-text family note would. The contrast is the demo.
- The pitch slide for distribution: "We meet you where you already work. Caren day one. PinkRoccade and MedMij PGOs next. Standalone for everyone else."

## Implications for safety / boundaries

- **Consent** must explicitly cover "export to your ECD's family portal." The patient (or representative) authorises which surface receives the passport.
- **Provenance** must survive the export. The rendered *Mijn verhaal* content needs to retain or link to the source quotes; we lose our trust story otherwise.
- **No silent overwrites.** When updating an existing *Mijn verhaal* entry, the adapter shows a diff and asks for human sign-off before pushing.

## Risks this decision creates

- **Platform risk concentrates on Nedap.** If Nedap extends *Mijn verhaal* themselves with structured/voice capture, our adapter advantage shrinks. Mitigation: ship the structured-output spec fast, build the MedMij PGO export early, and make the "engine, not the field" framing dominant.
- **API gating.** If Nedap and PinkRoccade do not expose write APIs, our v1 is paste-based. That's fine for the pitch but creates a friction moat we'll need to break later via partnership or PGO route.
- **Standalone UI scope creep.** It's tempting to make it good enough that customers stay there. Resist. The standalone is a fallback, not a product line.
