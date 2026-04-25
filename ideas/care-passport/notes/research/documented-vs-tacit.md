# Documented vs Tacit — what the chart carries and what nurses know but don't write down

Last checked: 2026-04-25

Scope: map what Dutch dementia/eldercare formally records today (Inventory A), what experienced practitioners know but do not capture (Inventory B), and the gap our care passport should target. Where the Dutch source uses a term that matters conceptually (e.g., *levensboek*, *persoonsbeeld*, *zorgleefplan*) it is named in passing — the product itself will be pitched in English.

---

## Inventory A — What IS documented today

### A1. ECDs / EVS used by Dutch home-care and VVT

- **Nedap Ons** — dominant Dutch ECD (1,000+ institutions). The care plan is structured around the **zorgleefplan**'s four life domains plus problems / goals / interventions, with explicit statements that "the life story and preferences of a resident are saved together with the care plan in the care file and are regularly updated." Source: [Nedap Ons kennisbank — wat is een zorgplan](https://nedap-ons.nl/kennisbank/wat-is-een-zorgplan-en-waarvoor-is-het-bedoeld/), [Nedap Ons kennisbank — ECD](https://nedap-ons.nl/kennisbank/wat-en-voor-wie-is-een-elektronisch-clienten-dossier-ecd/).
- **Nedap "Mijn verhaal" / Persoonlijk cliëntverhaal (in Caren)** — a free-text + photo space where the client (or representative) records "wishes, needs and preferences." It is owned by the client, optional, surfaced under the client's name in Ons Dossier, and shareable to professionals via Caren. **Critical detail: this is the closest thing to our product that already ships in NL — but it is unstructured prose, family-authored more often than client-authored, not voice-native, not searchable, no schema, no citations, and editing was disabled at the time of writing.** Sources: [Nedap support — Persoonlijk cliëntverhaal](https://support.nedap-ons.nl/support/solutions/articles/103000265791-persoonlijk-cli%C3%ABntverhaal-in-ons-dossier-en-caren), [Caren support — Mijn Verhaal](https://support.carenzorgt.nl/support/solutions/articles/75000013508-mijn-verhaal), [Sensire handleiding Mijn Verhaal](https://www.sensire.nl/getmedia/0ef718c9-7603-4640-b3c5-9da2e1e093a7/Handleiding-Mijn-Verhaal-bij-CarenZorgt.pdf).
- **PinkRoccade mijnCaress, Ecare, Pluriform** — same basic shape: care plan + life story field + Omaha-coded problems. Ecare explicitly markets the Omaha System inside the ECD ([Ecare — Omaha](https://ecare.nl/features/omaha-system/)).
- **Family-facing portal — Caren** — distribution surface to mantelzorgers; reads from Ons but does not capture longitudinal patient voice.

### A2. Nursing classifications used in NL

- **Omaha System** is the de-facto classification for Dutch wijkverpleging — **~80% of district nurses** use it ([Omahasystem.nl](https://www.omahasystem.nl/over-omaha-system/het-classificatiesysteem), [Zorg voor Beter — voorbeeldzorgplannen](https://www.zorgvoorbeter.nl/tips-tools/tools/voorbeeldzorgplannen-omaha-system)). It has a published example care plan **"Voorbeeldzorgplan Dementie"** ([Omahasystem.nl — voorbeeld dementie](https://www.omahasystem.nl/tools-en-tips/voorbeeldzorgplannen/voorbeeldzorgplan-dementie)). Omaha codes 42 problems across four domains (environmental, psychosocial, physiological, health-related behaviours), then interventions and outcomes (KBS scale: kennis, gedrag, status). Preferences fit awkwardly: there is a "geestelijke gezondheid" and "rolverandering" problem, but no field for "what calms her during washing."
- **NANDA-I / NIC / NOC** — taught but rarely used in Dutch home-care production; more common in hospitals.
- **ICF** — used by physio/OT and revalidatie; limited in eldercare home settings.
- **Zorgleefplan (ZLP)** — the dominant care-plan structure in VVT, organised around **four life domains**: woon- en leefomstandigheden, participatie, mentaal welbevinden en autonomie, lichamelijk welbevinden en gezondheid ([Zorgleefplanwijzer](https://www.zorgleefplanwijzer.nl/zlp-informatie/wat-is-een-zlp.html), [Kennemerhart](https://kennemerhart.nl/lang-verblijf/zorgleefplan/)). Mentaal welbevinden en autonomie is the closest formal home for personhood data — but in practice this domain is filled with summary sentences, not citable preferences.

### A3. Zorgstandaard Dementie + Leidraad Proactieve Zorgplanning

- **Zorgstandaard Dementie** prescribes proactive care planning starting in the *niet-pluis-/diagnostiek-fase*, anchored in the **gesprekswijzer proactieve zorgplanning bij dementie** developed by Saxion / Windesheim / Consortium Ligare ([Palliaweb](https://palliaweb.nl/overzichtspagina-hulpmiddelen/proactieve-zorgplanning-bij-dementie-en-vergeetach), [Windesheim](https://www.windesheim.nl/onderzoek/onderzoeksprojecten/goed-leven-met-dementie/de-gesprekswijzer-voor-proactieve-zorgplanning), [Zorgstandaard Dementie](https://www.zorgstandaarddementie.nl/actueel/tools/gesprekswijzer-proactieve-zorgplanning-dementie)). The official **six themes** (each a coloured wedge in a circle, addressed when the moment is right, not in fixed order) are:
  1. **Dagelijks plezier** — daily pleasure / what makes life worth living
  2. **Dagelijkse zorg** — daily care, routines, how I want to be helped
  3. **Medische behandeling en beleid** — treatment wishes, hospital admission, medication
  4. **Omgaan met dementie en het levenseinde** — coping, end-of-life, euthanasia wishes
  5. **Financiën en juridische zaken** — money, mandate, wettelijke vertegenwoordiging
  6. **Wonen en sociale netwerk** — housing, who is around me
- **Leidraad Proactieve Zorgplanning** (NHG/Verenso/NVAVG/V&VN/Patiëntenfederatie) is the legal/clinical wrapper and now has a digital fillable form for treatment wishes ([Palliaweb](https://palliaweb.nl/proactieve-zorgplanning), [zorgwensenvoorlater.nu](https://zorgwensenvoorlater.nu/storage/Leidraad-proactieve-zorgplanning.pdf)). It is form-shaped, not voice-shaped, and depends on a coherent author at the moment of filling.

### A4. Handover formats

- **SBAR / SBARR** is the dominant verpleegkundige-overdracht structure in NL — Situation, Background, Assessment, Recommendation ([eNurse — SBAR](https://enurse.nl/tools/methodieken/sbar/), [UKON SBAR template verpleeghuiszorg](https://www.ukonnetwerk.nl/media/i5oergdc/instructie-bij-sbar-template.pdf)). It is medical/incident-shaped: diagnoses, vitals, current problem, next step. Personhood does not fit anywhere in SBAR.
- **Ziekenhuis ↔ VVT overdracht** has *no national standard* and is a known failure mode — Nursing.nl reports ongoing improvement projects on this exact gap ([Nursing.nl](https://www.nursing.nl/praktijk/delier/overdracht-tussen-ziekenhuis-en-vvt-kan-beter-nurs008465w/)). What gets passed: medication, recent diagnosis, mobility, ADL, voorzieningen. What does not: the patient's own voice, calming rituals, food triggers, language patterns.

### A5. Existing person-centred templates already in clinical use

- **"This is me" — Alzheimer's Society UK**, RCN-endorsed since 2010, 840k+ leaflets distributed ([Alzheimer's Society](https://www.alzheimers.org.uk/get-support/publications-factsheets/this-is-me)). Captures: who I am, family/important people, life history, daily routines (sleep, food, washing), preferences, what calms me, what upsets me, communication style, sensory needs. Paper, one-shot, usually filled by family — uptake-and-fidelity in hospitals is mixed ([Baillie & Thomas 2020](https://journals.sagepub.com/doi/abs/10.1177/1471301218778907)).
- **Dutch levensboek / levensverhaal** — Vilans, Zorg voor Beter, Innovatiekring Dementie, BTSG all publish templates ([Zorg voor Beter levensboek](https://www.zorgvoorbeter.nl/tips-tools/tools/levensboek), [BTSG het levensboek](https://btsg.nl/het-levensboek/), [IDé](https://www.innovatiekringdementie.nl/a-1931/levensverhalen-en-dierbare-herinneringen-vastleggen/)). Built over weeks of conversation; ring-binder format with topic pages (family of origin, work, music, hobbies, travel). Strong emotional/identity focus, weak care-execution focus.
- **Waardigheid en Trots — Methodiek persoonsgerichte zorg** with the **Verhaalcirkel** for residents with dementia ([WenT methodiek](https://www.waardigheidentrots.nl/tools/methodiek-persoonsgerichte-zorg/), [WenT verhaalcirkel](https://www.waardigheidentrots.nl/tools/levensverhaal-verhaalcirkel-bewoners-met-dementie/), [WenT goed gesprek over levensloop](https://www.waardigheidentrots.nl/tools-tips/tools/methode-goed-gesprek-over-levensloop)). Explicit: "for methodical and person-centered work, it is necessary to systematically record the resident's story about their life course, desires, and cooperation with loved ones in the ECD." This is national policy aligned with our wedge.
- **Dementia Care Mapping (Bradford / Kitwood)** — observational tool grounded in personhood theory, used in NL pilot programs ([Bradford DCM](https://www.bradford.ac.uk/dementia/training-consultancy/dcm/)). Not a documentation tool but a quality-of-life observation method; teaches the *vocabulary* of well-being / ill-being, "Positive Person Work" vs. "Malignant Social Psychology" ([Kitwood reconsidered, Mitchell & Agnelli 2015](https://pmc.ncbi.nlm.nih.gov/articles/PMC11218012/)).

---

## Inventory B — What experienced nurses know but DON'T document

### B1. The theoretical claim

- **Kitwood's personhood theory + Brooker's VIPS** — care quality depends on five psychological needs (comfort, attachment, identity, occupation, inclusion) that are sustained through micro-interactions, not chart entries. "Positive person work" is observable in tone, pacing, eye contact, choice of words. "Malignant social psychology" — objectification, infantilisation, invalidation — is what happens when staff don't know the person ([Kitwood reconsidered](https://pmc.ncbi.nlm.nih.gov/articles/PMC11218012/), [Music therapy / Kitwood alignment](https://academic.oup.com/mtp/article/41/2/198/7221285)). VIPS = Valuing, Individualised, Perspective, Social — the "I" pillar is precisely the data we want to capture.
- **Buurtzorg's relational-care philosophy** — "humanity over bureaucracy"; nurses explicitly hold *life circumstances, environment, spiritual and social needs* alongside clinical needs, and build trusting relationships as their core method ([Buurtzorg in PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4311562/), [scoping review](https://pmc.ncbi.nlm.nih.gov/articles/PMC11080323/)). The model implies most of what makes a Buurtzorg nurse effective is *not in the chart*.

### B2. The tacit-knowledge research

- "Tacit knowledge in nursing" is a well-defined construct: **"expertise, know-how, hunches, rules-of-thumb, intuitions and subjective insights … acquired implicitly in the course of working and therefore not subject to reflection."** Specifically in dementia: "for people whose cognitive abilities are declining it is particularly important for staff to know how to interpret and understand signals and cues" — and that interpretation is precisely what does not transfer at handover. Sources: [HRA ethnographic study of tacit knowledge in dementia services](https://www.hra.nhs.uk/planning-and-improving-research/application-summaries/research-summaries/an-ethnographic-study-of-tacit-knowledge-in-dementia-services/), [Nursing Times — capturing tacit knowledge](https://www.nursingtimes.net/leadership/learning-from-experts-capturing-the-tacit-knowledge-of-nursing-practice-13-01-2025/), [FoNS — tacit care knowledge in reflective writing](https://www.fons.org/wp-content/uploads/2024/02/IPDJ_07suppl_5.pdf).
- **Nurse intuition** in BPSD: described as "knowledge not preceded by inference, holistic, drawn from synthesis instead of analysis, based on preconditions of experience, empathy, limited information and limited time" ([PMC — nurse intuition in dementia](https://pmc.ncbi.nlm.nih.gov/articles/PMC6846487/), [State of science: intuition in nursing](https://pmc.ncbi.nlm.nih.gov/articles/PMC4800548/)).
- The NIHR PIE programme observed wards with "a strong culture of eliciting and sharing personally meaningful information about patients … *snippets of information gleaned from patients during the shift were shared (e.g. 'whenever we talk about home, she becomes teary and doesn't want a care home')*" — explicitly informal, oral, vulnerable to loss ([NCBI Bookshelf — PIE programme](https://www.ncbi.nlm.nih.gov/books/NBK508103/)). This is the exact data shape we want to make durable.
- **Implementation gap**: 69% of community-living patients with diagnosed dementia had the diagnosis go undocumented in home-health handovers, and undocumented patients had higher acute-care utilisation ([Burgdorf 2025, JAGS](https://agsjournals.onlinelibrary.wiley.com/doi/10.1111/jgs.19491)). If even the diagnosis doesn't transfer, the personhood data certainly doesn't.

### B3. Dutch practitioner voices

- **Vilans — persoonsgerichte zorg** is the national knowledge frame ([Vilans persoonsgerichte zorg](https://www.vilans.nl/thema-s/persoonsgerichte-zorg), [Vilans 11 wetenschappelijk onderbouwde methodes](https://www.vilans.nl/kennis/10-wetenschappelijk-onderbouwde-methodes-dementie)). Definition emphasises *personal needs and wishes* and *room for customisation*.
- **Waardigheid en Trots** is sharper: the **Verhaalcirkel** literally exists because life-history capture happens in conversation and is then *expected* to be transcribed into the ECD — but the burden falls on the casemanager and is often not done, or done once and never refreshed. WenT itself flags this as an open implementation problem.
- **Trimbos / Zorg voor Beter — persoonsgerichte dementiezorg** ([Trimbos persoonsgericht werken](https://www.trimbos.nl/kennis/ouderen/persoonsgerichte-zorg-dementie/), [Zorg voor Beter](https://www.zorgvoorbeter.nl/thema-s/dementie/persoonsgerichte-zorg)) repeats: care is supposed to be tailored to personal wishes, capabilities, history — but the ECD field for that is a free-text blob.

### B4. Concrete examples of "magic-hands" knowledge

A mix of literature-attested and illustrative. Marked accordingly.

1. **"If she gets agitated during washing, hum a familiar lullaby and she relaxes."** Attested pattern: the PIE study reports staff using *touch + positive emotional memory* (singing a favourite song, taking the hand) to alleviate distress ([NCBI — PIE programme](https://www.ncbi.nlm.nih.gov/books/NBK508103/)).
2. **"Always start the wash with the left arm — if you start with the right she panics."** Illustrative; reflects observed agitation triggers documented in DCM literature.
3. **"Don't put the green plate in front of him — he won't eat off it."** Illustrative; reflects the food-perception literature in advanced dementia (contrast and colour affect intake).
4. **"He calls his wife 'mama'; he's not confused, that's just his word for her."** Attested pattern of language-personalisation; if not flagged, staff "correct" the patient and trigger distress ([Kitwood — invalidation as MSP](https://pmc.ncbi.nlm.nih.gov/articles/PMC11218012/)).
5. **"Whenever we talk about home, she becomes teary and doesn't want a care home."** **Verbatim** from PIE programme ethnography.
6. **"He paces before lunch — that's hunger, not anxiety. Offer a banana."** Illustrative; reflects unmet-needs reframing of BPSD.
7. **"She always wants tea before breakfast; coffee makes her panic."** Attested type — daily-rhythm preferences captured in life-story work ([Cooney & O'Shea 2019](https://journals.sagepub.com/doi/abs/10.1177/1471301218756123)).
8. **"Don't approach from behind on the right — deaf side, she startles."** Attested type — sensory access notes are standard in This is Me but rarely in the ECD.
9. **"Call him 'meneer Jansen', never by first name. He's old-fashioned."** Attested — name and address preference is the first item in nearly every life-story template.
10. **"If she asks where her husband is, say 'he's at work' — don't tell her he died, she grieves him fresh every time."** Attested — this is the "therapeutic lying" debate; well documented in dementia practice literature, not in the ECD ([Sensire — geluk in de kleine dingen](https://www.sensire.nl/over-sensire/nieuws/bij-dementie-zit-het-geluk-in-de-kleine-dingen/)).

---

## The Gap (pitch language — quote these verbatim)

- **The ECD captures the diagnosis, the medication, and the schedule. It does not capture how she likes to be approached, what calms her, or what her own word for her husband is. That layer lives in a head, a sticky note, or a paper *ik-boekje*.**
- **The Dutch system already has the right intent — Zorgstandaard Dementie, Waardigheid en Trots, Nedap "Mijn verhaal" — but the data is unstructured prose, mostly family-authored after the fact, refreshed once if at all, and not searchable at the point of care.**
- **National guidance prescribes six ACP themes (dagelijks plezier, dagelijkse zorg, behandeling, omgaan met dementie/levenseinde, financiën, wonen). There is no tool that listens to the patient over time and fills those six wedges with their own voice.**
- **Tacit knowledge — the "magic hands" of an experienced verzorgende — is documented in the academic literature as ungeschreven en niet-overdraagbaar; when the nurse leaves or the patient transfers, it is gone. This is not a bug in the ECD; it is the boundary of what the ECD was designed to hold.**
- **Our wedge: capture this layer in the patient's own voice, before they can't articulate it, and make it queryable for any caregiver who shows up. We do not replace the ECD. We feed it the column it doesn't have.**

---

## Language warnings (English pitch copy)

**Avoid — these English terms imply regulated or medical-device territory:**

- **"Diagnose" / "diagnostic" / "early detection of dementia"** — under MDR + EU AI Act, software with diagnostic intent is a medical device, almost certainly high-risk. We don't diagnose. Use "document", "capture", "surface", "support". The Dutch equivalents *diagnostiek* and *vroegsignalering dementie* are equally regulated.
- **"Advance directive" / "living will"** — these are legal artefacts. The Dutch equivalent is *wilsverklaring*, owned by KNMG ([KNMG](https://www.knmg.nl/actueel/dossiers/levenseinde-2/zelfbeschikking/wilsverklaring)). Our output is never a directive. Say "ACP topics covered" or "future-care wishes captured", not "advance directive generated".
- **"Decision capacity" / "competence to consent"** — clinical-legal judgement made by a physician. The Dutch equivalent is *wilsbekwaamheid* ([Richtlijnendatabase](https://richtlijnendatabase.nl/richtlijn/dementie_en_lichte_cognitieve_stoornissen_mild_cognitive_impairment_mci/dementie_als_comorbiditeit_in_het_ziekenhuis/wils_oordeelsbekwaamheid_en_behandelbeperking.html)). We never assess it.
- **"Treatment plan" / "care plan"** — that is the ECD's *zorgleefplan* / *zorgplan*, owned by the provider organisation. We feed *into* the care plan; we are not it. Use "care passport", "preference record", "personhood profile".
- **"Triage" / "risk score" / "red flag"** — implies decision support. Use "signal", "things to watch", "for clinical review".
- **"Legal representative" / "guardian" / "appoint a proxy"** — court-assigned roles in NL (*mentor*, *curator*, *bewindvoerder*). We never appoint or replace them.
- **"Diagnostic-grade" / "clinical-grade"** — language that implies regulatory clearance we do not have.
- **"Replaces the case manager / nurse / family"** — adversarial framing of human roles. Always say *augments*, *supports*, *prepares*.

**Align with — these English terms have established meaning in person-centered dementia care; use them rather than inventing alternatives:**

- **"Person-centered care" (PCC)** — Kitwood's term, RCN/NICE-blessed, the global standard. Don't say "patient-centric AI" or "personalised care AI". Say person-centered.
- **"Personhood"** — Kitwood's specific construct; signals theoretical literacy.
- **"Life story" / "life-story work"** — established intervention name in nursing literature; the Dutch *levensboek* is the closest analog and Caren's *Mijn verhaal* is its digital placeholder. Use "life story" in pitch copy.
- **"This is Me"** — the Alzheimer's Society UK leaflet, RCN-endorsed since 2010. Name-check it explicitly: we are the digital, voice-native, longitudinal evolution.
- **"Care preferences" / "preference profile"** — neutral, accepted by ECD vendors and clinicians; doesn't claim clinical authority.
- **"Advance care planning (ACP) topics"** — international standard term; matches the Dutch *proactieve zorgplanning* themes one-to-one. Say "ACP topics covered", not "ACP completed".
- **"Caregiver" (formal) / "informal caregiver" / "family carer"** — distinguish professional from family. The Dutch *mantelzorger* maps to "informal caregiver"; do not collapse them.
- **"Case manager" (dementia case manager)** — direct translation of *casemanager dementie*; the role exists in UK/IE/AU and is recognisable.
- **"Source-cited" / "evidence-backed" / "with provenance"** — our trust-and-safety framing; reuse consistently.
- **"Handover" / "transition of care"** — established failure-mode language; use it to anchor the pain.

---

## One surprise the team should reckon with

**Nedap's "Mijn verhaal" is not a placeholder — it is a shipped feature inside Caren and Ons Dossier today.** It is currently a free-text/photo blob, family-authored, and (per Nedap's own support article) had editing temporarily disabled — but the *slot* for the patient's voice already exists in the ECD of the dominant Dutch vendor. This shifts our framing in three ways: (1) we should pitch as "the engine that fills Mijn verhaal with the patient's actual voice and structure" rather than "we invented the patient-voice field"; (2) Nedap has the option to extend Mijn verhaal themselves, which is our biggest single platform risk and argues for moving fast on a Caren-export integration; (3) casemanagers already know what we mean when we say "Mijn verhaal" — we don't have to teach the concept, only the upgrade path. The existence of this field is *evidence the market wants this*, not a competitor that beat us.
