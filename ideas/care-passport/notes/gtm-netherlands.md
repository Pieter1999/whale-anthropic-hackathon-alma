# GTM Netherlands/EU

Last checked: 2026-04-25. Scope: MVP for a WhatsApp voice-note companion that preserves patient voice, builds an evidence-backed care passport, and supports later questions by HCPs/caretakers. It must not make legally or medically binding decisions.

## Market Reality

- Netherlands dementia burden is large and growing: Alzheimer Nederland's 2025 key figures estimate **310,000 people with dementia in 2024**, including **230,000 living at home**, **70,000 living alone**, **100,000 without a diagnosis**, and **800,000 mantelzorgers**; VWS' January 2026 strategy update expects **610,000+ people with dementia in 2050**. Sources: [Alzheimer Nederland figures PDF](https://media.alzheimer-nederland.nl/s3fs-public/media/2025-03/documents/nieuwe%20cijfers%20en%20kengetallen%20dementie%20tabellen.pdf?VersionId=ZzpCCg_AU2R7fJ14CyNWnT2F5UUmCtJQ), [VWS/Rijksoverheid NDS update](https://www.rijksoverheid.nl/onderwerpen/dementie/nieuws/2026/01/29/kabinet-maakt-nationale-dementiestrategie-toekomstbestendig).
- Caregiver pressure is the pain point to anchor on: the 2024 Dementiemonitor reports mantelzorgers provide **37 hours/week** on average, partners **72 hours/week**, **13%** feel very heavily burdened/overburdened, and **29%** say they can sustain care for less than a year if nothing changes. Source: [Nivel/Alzheimer Nederland Dementiemonitor 2024](https://www.nivel.nl/en/publicatie/dementiemonitor-2024-mantelzorgers-over-ondersteuning-vanuit-hun-sociale-netwerk).
- Timely diagnosis and proactive care planning are still gaps: among diagnosed people, **22%** of caregivers say diagnosis was not timely; proactive care planning is recommended early because verbal communication and decision capacity decline over time. Sources: [Dementiemonitor 2024](https://media.alzheimer-nederland.nl/s3fs-public/media/2024-11/documents/Dementiemonitor%202024%20-%20Landelijk%20rapport_%20def2.pdf), [Zorgstandaard Dementie - proactieve zorgplanning](https://www.zorgstandaarddementie.nl/zorgstandaard/proactieve-zorgplanning).
- Casemanagement is the adoption wedge: **84%** of caregivers with a home-dwelling person with dementia report a casemanager; **89%** are satisfied, but **13%** say the start was too late, with an average **16-week** wait where late. Source: [Dementiemonitor 2024](https://media.alzheimer-nederland.nl/s3fs-public/media/2024-11/documents/Dementiemonitor%202024%20-%20Landelijk%20rapport_%20def2.pdf).
- Digital readiness is plausible but not universal: in 2025, **93% of 65-74-year-olds** and **70% of 75+** in the Netherlands sent online text messages; WhatsApp is the largest daily Dutch social channel with **12.1M daily users**. Sources: [CBS Digitalisering 2025](https://www.cbs.nl/nl-nl/longread/rapportages/2026/digitalisering-en-kenniseconomie-2025/4-ict-gebruik-personen), [Newcom 2026](https://www.newcom.nl/nationale-sociale-media-onderzoek-2026).

## Why Now

- VWS updated the **Nationale Dementiestrategie 2026-2030** on 2026-01-29, reserving **EUR 23M in 2026** and more funding through 2030, with explicit emphasis on research, care/support coordination, dementia-friendly society, and the voice of people with dementia and their loved ones. Source: [Rijksoverheid](https://www.rijksoverheid.nl/onderwerpen/dementie/nieuws/2026/01/29/kabinet-maakt-nationale-dementiestrategie-toekomstbestendig).
- National elder-care policy is aligned with "zelf als het kan, thuis als het kan, digitaal als het kan" through WOZO and IZA. This supports a story about helping people stay known, supported, and at home longer, while reducing avoidable professional burden. Sources: [WOZO factsheet](https://www.rijksoverheid.nl/onderwerpen/ouderenzorg/documenten/publicaties/2024/12/20/wozo-zelf-als-het-kan-thuis-als-het-kan-digitaal-als-het-kan), [Rijksoverheid IZA](https://www.rijksoverheid.nl/onderwerpen/kwaliteit-van-de-zorg/integraal-zorgakkoord).
- Digital/hybrid care has a reimbursement vocabulary: Zorginstituut says digital/hybrid care can belong in Zvw/Wlz where it meets "stand van wetenschap en praktijk"; a technical variant of existing insured care may need less new evidence than a novel intervention. Source: [Zorginstituut handleiding digitale en hybride zorg](https://www.zorginstituutnederland.nl/documenten/2025/03/31/handleiding-beoordeling-digitale-en-hybride-zorg).
- Casemanagement became clearer as insured care from the **non-pluisfase** in 2024, including guidance/support, monitoring, and proactive planning. That gives the MVP a concrete workflow and buyer path. Source: [Zorginstituut casemanagement duiding](https://www.zorginstituutnederland.nl/actueel/nieuws/2024/04/23/casemanagement-dementie).

## Stakeholders And Buyers

- **Primary user/payer wedge:** dementia case managers and home-care organizations delivering Zvw wijkverpleging/casemanagement. Value: faster life-history capture, less repeated interviewing, better handover, structured evidence for ACP conversations.
- **Clinical referrers:** GP/POH, geriatrician, neurologist/memory clinic. They often initiate casemanagement: Dementiemonitor reports huisarts **41%**, geriater/neuroloog **35%**, POH **12%**. Source: [Dementiemonitor 2024](https://media.alzheimer-nederland.nl/s3fs-public/media/2024-11/documents/Dementiemonitor%202024%20-%20Landelijk%20rapport_%20def2.pdf).
- **Economic buyers:** contracted home-care/VVT providers, regional dementia networks, care groups, and eventually insurers/zorgkantoren if the tool proves labor-saving or improves timely support.
- **Municipality/social domain:** Amsterdam buurtteams/Wmo, mantelzorg support, day activities, living-at-home programs. They are not likely first payer for a health-data AI product, but they are useful pilots for prevention, loneliness, and "no family representative" pathways.
- **Insurers/zorgkantoren:** Zilveren Kruis is strategically relevant in Amsterdam; its Wlz V&V policy highlights self-reliance, care at home, future-proof landscape, and proven effective innovations. Source: [Zilveren Kruis Zorgkantoor V&V inkoopbeleid](https://www.zilverenkruis.nl/zorgkantoor/zorgaanbieders/zorginkoop/inkoopbeleid-vv-2024-2026).
- **Patient/caregiver advocates:** Alzheimer Nederland, Dementie.nl, Patiëntenfederatie, MantelzorgNL, Cliëntenbelang Amsterdam. Bring them in early for consent language and safeguarding.

## Launch Partners / Amsterdam Hooks

- **Amsterdam dementia routing changed recently:** as of **2025-11-03**, Amsterdam casemanagement dementia can be centrally referred via ZorgDomein/Verwijspunt 020, creating citywide insight into demand and fairer routing. Hook: "new central intake still needs a lightweight way to capture patient voice before capacity arrives." Source: [Dementie Amsterdam professionals](https://www.dementieamsterdam.nl/page/9258/professionals.html).
- **City policy hook:** Amsterdam reported on **2026-03-10** that it has **21 Lang Leven Thuisflats** with ~**3,600 homes**, aligned with "zorgzame buurten" and ageing in place. Source: [Gemeente Amsterdam](https://www.amsterdam.nl/nieuws/nieuwsoverzicht/woningen-ouderen/).
- **Care provider pilots:** Cordaan, Amsta, Amstelring, ZGAO, Buurtzorg/Evean-like home-care players. Cordaan explicitly describes casemanager dementia as reimbursed from basic insurance and not subject to own-risk contribution; ZGAO notes Amsterdam wait times can average months. Sources: [Cordaan dementia](https://www.cordaan.nl/ouderenzorg/zorg-thuis/dementie/), [ZGAO casemanager](https://www.zgao.nl/zorg-thuis/casemanager-dementie.html).
- **Research/ethics partners:** Alzheimercentrum Amsterdam/Amsterdam UMC, Ben Sajet Centrum, Hogeschool van Amsterdam, Vrije Universiteit, UNO Amsterdam. Alzheimercentrum is a national dementia diagnostic/research center; Ben Sajet has a specific "Diversiteit en Dementie" program and Amsterdam long-term-care network. Sources: [Alzheimercentrum Amsterdam](https://www.alzheimercentrum.nl/patienten/over-ons-centrum/), [Ben Sajet Centrum](https://bensajetcentrum.nl/programma/diversiteit-en-dementie/).
- **Regional coalition:** Sigra/Elaa/Gemeente Amsterdam/Zilveren Kruis/Cliëntenbelang Amsterdam "Coalitie Ouderen" focuses on vital ageing, caring neighborhoods, passende ondersteuning/zorg, divers-sensitive care, strengthening dementia chains, and Lang Leven Thuisflats. Source: [Sigra Coalitie Ouderen](https://www.sigra.nl/coalitie-ouderen).
- **National scaling network:** Dementie Netwerk Nederland says ~**65 regional dementia networks** are active and works on casemanagement, network organization, support in living with dementia, and information. Source: [DNN regional networks](https://dementienetwerknederland.nl/regionale-netwerken/).

## Product Positioning

- Position as a **voice-backed care passport assistant**, not a diagnosis, triage, treatment, or capacity-decision tool.
- Core workflow: consenting person sends periodic WhatsApp voice notes -> system extracts preferences, routines, values, fears, meaningful activities, social context, representative wishes -> human-readable care passport with source clips/timestamps -> HCP/case manager can ask "what did she say about food, bathing, music, medication worries, who to call, spiritual needs?" and see evidence.
- Start with **early-stage, consent-capable people** plus their chosen representative/casemanager. Avoid starting with non-consenting advanced dementia, surveillance, or family-only upload.
- Make the product valuable before any AI claims: "structured life story + ACP prompts + searchable evidence + export to care plan/PGO/ECD" is enough for a demo.
- For people without family/representatives, frame as "helps identify and document the person's own stated preferences early" and "supports professionals when no informal network exists," not "solves legal representation."

## Reimbursement / Procurement Hints

- **Zvw route:** bundle into dementia casemanagement/wijkverpleging as a digital support tool for insured care. Casemanagement includes guidance/support, monitoring, and proactive planning from the non-pluisfase when clinically indicated. Source: [Zorginstituut](https://www.zorginstituutnederland.nl/documenten/2024/04/09/duiding-vergoeding-van-casemanagement-voor-mensen-met-dementie/).
- **Provider procurement route:** sell pilots to VVT/home-care providers as labor-saving quality infrastructure. Buyer will ask for data processing agreement, DPIA, security, integration/export, and proof that it reduces case-manager time or improves ACP completeness.
- **Insurer route:** after pilot evidence, take to insurer innovation/digital-care desks or Kenniscentrum Digitale Zorg. ZN says digital care should maintain/improve quality, health, staff satisfaction, affordability, and replace rather than simply add care. Source: [ZN digitalisering](https://www.zn.nl/dossier/digitalisering/).
- **Wlz/zorgkantoor route:** later-stage institutional/home Wlz care, especially VPT/MPT and care at home, but procurement is slower and requires evidence of "proven effective innovations." Source: [Zilveren Kruis V&V](https://www.zilverenkruis.nl/zorgkantoor/zorgaanbieders/zorginkoop/inkoopbeleid-vv-2024-2026).
- **Municipal route:** Wmo/prevention subsidies can support community pilots, outreach, diversity-sensitive care, and living-at-home activities, but not the main health-data product revenue line. Amsterdam has subsidy lines for activities supporting 65+ living independently. Source: [Gemeente Amsterdam subsidy](https://www.amsterdam.nl/subsidies/subsidieregelingen/subsidie-langer-zelfstandig-wonen/).
- **Avoid relying on new IZA transformation money for a 24h pitch:** ZN said in 2025 new quick scans closed and many funds were already claimed; use IZA as policy alignment, not as the immediate revenue plan. Source: [ZN transformatiemiddelen update](https://www.zn.nl/actueel/nieuwe-fase-voor-transformatiegelden-integraal-zorgakkoord/).

## Regulatory / Ethical Boundaries

- **Consent and purpose limitation:** voice notes, transcripts, summaries, and inferences are health/sensitive personal data. Use explicit, granular consent while the person is capable; define who can access what; allow withdrawal/export; avoid secondary use unless separately consented/legal basis exists. Rijksoverheid says patients must consent to sharing medical data and access must be authorized. Source: [Rijksoverheid medical data sharing](https://www.rijksoverheid.nl/onderwerpen/digitale-gegevens-in-de-zorg/medische-gegevens-bekijken-en-delen).
- **Security baseline:** expect NEN 7510-aligned controls, role-based access, audit logging, MFA, data minimization, processor agreements, incident response, and a DPIA. AP says DPIA is required for likely high-risk processing; health providers must secure health records and NEN 7510 gives sector guidance. Sources: [AP DPIA](https://autoriteitpersoonsgegevens.nl/themas/basis-avg/praktisch-avg/data-protection-impact-assessment-dpia), [AP health data file](https://autoriteitpersoonsgegevens.nl/themas/gezondheid/gezondheidsgegevens-in-een-dossier).
- **Representation:** if a person later becomes incapacitated, Dutch practice looks first to a written directive/representative, then court-appointed mentor/curator, then spouse/partner, then family. If no one can act, the doctor may decide for medical treatment; the app should surface recorded preferences but not appoint or replace a representative. Sources: [Rijksoverheid wilsonbekwaamheid](https://www.rijksoverheid.nl/onderwerpen/levenseinde-en-euthanasie/vraag-en-antwoord/wilsonbekwaamheid), [Regelhulp wettelijke vertegenwoordiging](https://www.regelhulp.nl/onderwerpen/wettelijke-vertegenwoordiging/bewind-mentor-curatele).
- **Advance directives:** wilsverklaringen can record future treatment wishes and a representative; they should be made early, dated/signed, discussed with loved ones and doctors, and may not bind every medical action. Product can help draft "topics to discuss" but should not generate a legal directive as final output. Sources: [Regelhulp wilsverklaring](https://www.regelhulp.nl/onderwerpen/zorg-in-laatste-levensfase/zorgwensen-vastleggen-in-wilsverklaring), [KNMG wilsverklaring](https://www.knmg.nl/actueel/dossiers/levenseinde-2/zelfbeschikking/wilsverklaring).
- **Medical-device line:** if the software is intended to support diagnosis, prognosis, treatment, monitoring, or decisions that improve patient care, it may become medical device software under MDR; higher risk classes can require notified-body certification. Keep MVP intended use to documentation/search/summarization for human review. Source: [Rijksoverheid software as medical device](https://www.rijksoverheid.nl/onderwerpen/medische-hulpmiddelen/vraag-en-antwoord/wanneer-valt-software-onder-de-nieuwe-europese-regels-voor-medische-hulpmiddelen).
- **AI Act/EHDS:** EU AI Act is in force; high-risk AI systems, including AI-based software intended for medical purposes, require risk management, data quality, transparency, and human oversight. EHDS entered into force 2025-03-26 and will gradually require interoperable health-data access/control. Sources: [European Commission AI in healthcare](https://health.ec.europa.eu/ehealth-digital-health-and-care/artificial-intelligence-healthcare_en), [European Commission EHDS timeline](https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_en).
- **WhatsApp boundary:** WhatsApp is a useful low-friction capture channel, but a production medical workflow needs a formal WhatsApp Business/API data-processing model, EU hosting/transfer review, opt-in, fallback channels, and safeguards for accidental third-party voice content.

## Defensible 24h Pitch Claims

- "There are hundreds of thousands of people with dementia in the Netherlands, many at home and many living alone; the number is rising sharply." Defend with Alzheimer Nederland/VWS.
- "Case managers are highly valued but capacity and wait times are a bottleneck; our first user is the case manager, not the hospital specialist." Defend with Dementiemonitor/Zorginstituut.
- "The Netherlands is policy-aligned for home-first, digital-where-appropriate elder care." Defend with WOZO/IZA/NDS.
- "WhatsApp is a pragmatic input channel because Dutch older adults increasingly use online messaging, but we will not assume every patient can use it." Defend with CBS/Newcom.
- "We preserve the patient's own words and cite source snippets/timestamps for human review." This is the core trust claim.
- "We support ACP and care planning conversations; we do not make medical, legal, euthanasia, capacity, or placement decisions."

## Claims To Avoid

- "We can decide what the patient would have wanted."
- "This replaces a legal representative, mentor, curator, notary, physician, or casemanager."
- "This is an advance directive/wilsverklaring."
- "This is diagnostic/prognostic/treatment decision support."
- "WhatsApp is automatically compliant for medical records."
- "Insurers will reimburse this immediately as a standalone app."
- "AI solves dementia care worker shortages." Safer: "AI can reduce repeated information gathering and help professionals spend scarce time on human care."

## Likely Objections And Counters

- **"Patients may not be capable of valid consent."** Start before capacity declines; record consent status and chosen access roles; support re-consent/check-ins; stop collection when capacity/consent is unclear unless a lawful representative and provider workflow are in place.
- **"Hallucinations could harm care."** No free-floating answers: every answer must cite source notes/clips, show confidence and gaps, and route uncertainty to "ask the person/representative/casemanager."
- **"This creates more data and liability."** Keep a bounded care-passport schema, deletion/retention rules, audit log, and human sign-off before anything enters the formal care record.
- **"Care teams already have ECD/PGO systems."** Do not compete with ECD; export structured summaries and source references. Product is pre-documentation capture and retrieval of the patient's own voice.
- **"Families could manipulate the record."** Separate patient-recorded statements from third-party notes; label provenance; require human review; allow contested/updated statements.
- **"Digital exclusion."** Offer assisted recording with case manager/volunteer, phone-call capture, and non-digital paper interview fallback. WhatsApp is an entry point, not the only path.
- **"Medical device/GDPR risk."** Deliberately constrain intended use to documentation and human-reviewed care planning support; run DPIA; use NEN 7510-aligned controls; get medtech/legal review before adding recommendations.

## MVP Pilot Shape

- 20-30 early-stage participants through one Amsterdam provider/network; include a "no close family" subgroup if ethically approvable.
- 8-week capture period: weekly WhatsApp voice prompt + optional spontaneous notes.
- Case-manager dashboard: care passport sections, unanswered prompts, source-backed Q&A, export PDF/structured JSON.
- Success metrics: case-manager minutes saved on life-history intake, ACP topic completeness, number of patient-authored preferences captured, caregiver/casemanager trust score, zero unsupported answer rate in QA review.
- Ethics/safety: consent script, representative/access register, DPIA checklist, clinical escalation rule for risk statements, deletion/export process.
