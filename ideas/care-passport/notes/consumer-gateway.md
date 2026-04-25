# Consumer Gateway: WhatsApp Voice Companion

## MVP Goal

Use WhatsApp voice notes as the patient-facing interface for a dementia / degenerative-disease companion that learns routines, preferences, values, anxieties, and care context over time. The gateway should feel warm and familiar, but stay bounded: it preserves patient voice and evidence for human care teams; it does not make medical, legal, capacity, medication, diagnosis, or emergency decisions.

## Current WhatsApp Cloud API Constraints

Sources checked on 2026-04-25:

- Meta official Postman workspace: WhatsApp Cloud API is the official WhatsApp Business Platform API; sending uses `POST /{Phone-Number-ID}/messages`; webhooks require app subscription to the WABA and the `messages` field. <https://www.postman.com/meta/workspace/whatsapp-business-platform>
- Meta Cloud API docs preview: permissions include `whatsapp_business_messaging` for messaging and `whatsapp_business_management` for WABA / webhook management; access tokens should be sent in request headers. <https://meta-preview.mintlify.io/docs/whatsapp/cloud-api/overview>
- Meta official Postman media docs: received media webhooks include a media ID; retrieve URL with `GET /{Media-ID}`; returned media URL is temporary, about 5 minutes, and download still requires `Authorization: Bearer ...`. <https://www.postman.com/meta/whatsapp-business-platform/request/2k4f77e/retrieve-media-url>
- WhatsApp Cloud API supports text, media, templates, and message status webhooks; incoming and outgoing messages are identified by `wamid...`. <https://www.postman.com/meta/whatsapp-business-platform/folder/13382743-9d9b44cd-ffd0-41b6-a812-e9676236669f>
- Audio sending supports a media `id` or HTTPS `link`; to send as a WhatsApp voice message use `audio.voice = true` and `.ogg` with Opus codec. <https://www.postman.com/meta/whatsapp-business-platform/request/13382743-0f89df92-20df-44ff-8aab-b187d10b7c6a>
- Practical media limit to design around: audio max 16 MB; supported audio includes AAC, MP4/M4A, MPEG/MP3, AMR, and OGG/Opus. For the demo, reject oversized audio gracefully and ask for a shorter note.
- Important product constraint: after a patient messages the business, free-form replies are allowed inside the customer-service window; outside that window, proactive check-ins need approved templates. For a hackathon, keep proactive messaging inside test setup or use a fallback simulator if templates are not ready.

## Inbound Voice-Note Flow

1. WhatsApp sends a webhook event to `POST /api/whatsapp/webhook` for the subscribed WABA `messages` field.
2. Verify the webhook signature / verify token and dedupe by WhatsApp message ID (`wamid`). Persist the raw webhook before doing slow work.
3. If `messages[0].type == "audio"`:
   - capture `from` / `wa_id`, `timestamp`, `id`, `audio.id`, `audio.mime_type`, `audio.sha256`, and `audio.voice` if present;
   - create `message` row: `direction=inbound`, `status=received`, `patient_id`, `wa_message_id`, `media_id`, `received_at`, `raw_json`;
   - fetch media metadata: `GET https://graph.facebook.com/{version}/{media_id}?phone_number_id={phone_number_id}`;
   - download the temporary media URL immediately with bearer token;
   - store encrypted audio object in local/S3-style storage with `sha256`, MIME type, byte size, and retention tag;
   - send to transcription (`whisper-1`, equivalent hosted STT, or local fallback);
   - persist transcript with confidence, language, and link to audio evidence.
4. Run extraction into the knowledge layer:
   - preference, routine, value, person/place, risk signal, uncertainty, consent signal;
   - each extracted fact must cite the source message ID and transcript span;
   - low-confidence facts stay as "candidate memories" until repeated or reviewed.
5. Generate a companion reply with at most one follow-up question.

Non-audio inbound messages:

- Text: process directly as transcript-equivalent.
- Image/document/location/contact: store as unsupported-for-MVP evidence and reply that the demo works best with voice notes or short text.
- Emergency words: reply with a bounded safety message and trigger care-gap alert; do not triage.

## Outbound Response Flow

Default: text replies, because they are fast, reliable, searchable, and easier to moderate.

Endpoint shape:

```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "{{patient_wa_id}}",
  "type": "text",
  "text": {
    "preview_url": false,
    "body": "Thanks, Anna. I heard that mornings feel easier when breakfast is quiet. Is there one thing that helps you feel settled after waking up?"
  }
}
```

Optional voice response:

- Generate short TTS, transcode to `.ogg` Opus, upload or host via HTTPS, then send `type=audio` with `audio.voice=true`.
- Use only for demo delight after text path works. Keep voice under 20 seconds.
- Store outbound `wamid`, prompt version, generated text, audio URL/media ID, and status webhook updates.

Message policy:

- If within active WhatsApp window: send free-form text/audio.
- If outside window: send only an approved utility template such as "Anna, would you like to leave today's voice note?" or use simulator fallback.
- Always mark inbound as read after durable persistence, not before.

## Companion Behavior Principles

- Warm and familiar: use the patient's name, reflect one concrete thing they said, avoid clinical tone.
- One follow-up question only: reduce cognitive load and keep WhatsApp interaction easy.
- No medical advice: never recommend medication changes, diagnosis, treatment, discharge decisions, or capacity judgments.
- Consent-first: explain what is saved, who can see it, and how to pause/delete.
- Evidence-backed memory: "I remember this because you told me..." with source date when surfacing facts.
- Bounded uncertainty: say "I may have misunderstood" and ask for correction.
- Crisis boundary: if patient mentions immediate danger, self-harm, severe symptoms, or abuse, reply with emergency guidance and alert the configured human contact.
- No deception: the assistant is a digital companion, not a clinician, family member, or legal representative.

## Onboarding Flow

Patient onboarding in WhatsApp:

1. HCP/caretaker creates a patient profile and phone number in the dashboard.
2. System sends or displays a join link / QR. Patient sends first WhatsApp message to open the messaging window.
3. Companion introduces itself: what it does, what it does not do, and asks for consent to save voice notes.
4. Patient confirms with voice or text: "Yes, you can save my notes."
5. Companion asks one setup question: "What name should I call you?"
6. Companion asks one first memory prompt: "What is one thing people caring for you should know about your mornings?"

HCP/caretaker onboarding:

1. Create organization and user account.
2. Add patient with minimal demographics: name, preferred language, WhatsApp number, diagnosis/context optional.
3. Select role: HCP, formal caretaker, trusted contact, demo admin.
4. Record basis for access: patient consent, care relationship, hackathon demo seed.
5. Configure alert recipients and alert severity thresholds.
6. Dashboard shows a care passport with evidence links, not raw full history by default.

## Active Monitoring And Care-Gap Alerts

Check-in types:

- Daily/weekly reflective prompt: "How did today feel?" or "Was anything harder than usual today?"
- Routine probe: meals, sleep, medication confidence, appointments, loneliness, getting outside.
- Preference deepening: food, music, touch, visitors, privacy, faith/culture, hygiene, fears, calming routines.

Alert triggers for MVP:

- Missed check-in after configured cadence, e.g. no response for 48 hours.
- Repeated confusion around medication, appointments, address, money, food, or locked doors.
- Safety language: falls, wandering, stove/gas, not eating/drinking, abuse, self-harm, severe pain.
- Emotional distress trend: loneliness, fear, agitation, "I don't know who to call."
- Care-gap evidence: "No one came", "I ran out", "I cannot get there", "I forgot again."

Alert behavior:

- Create `care_gap_alert` with severity, source message IDs, quoted transcript snippets, and suggested human follow-up.
- Send HCP/caretaker dashboard notification. For demo, also post to an internal Slack/log panel.
- Patient-facing reply stays non-alarming: "That sounds difficult. I will make sure your care team can see this. If you are in immediate danger, call your local emergency number now."
- Do not promise that help is on the way unless a human has acknowledged.

## Identity, Permissions, And Consent

Hackathon model:

- Patient identity key: WhatsApp `wa_id` + patient record created by HCP/caretaker.
- HCP/caretaker identity key: email login; role-based access to assigned patients only.
- Consent record: `patient_id`, `consent_type`, `granted_by`, `method=whatsapp_voice|whatsapp_text|demo_admin`, `timestamp`, `source_message_id`, `scope`.
- Scope options: save voice notes, transcribe notes, summarize into care passport, share with named care team, send check-ins, trigger alerts.
- Patient commands: `pause`, `resume`, `delete my notes`, `who can see this?`, `help`.
- MVP deletion can be soft-delete/redact in UI, with a note that production needs full retention/legal policy.
- Raw audio should be restricted to demo admin; HCP view defaults to transcript snippets and extracted evidence.

Permission rules:

- A user can only query a patient if assigned in `patient_user_access`.
- HCP answers must include evidence and date; no unsourced claims.
- High-risk alerts visible to assigned care team; no broad organization feed.
- Export/download disabled for MVP unless needed in pitch.

## Recommended 24h Implementation Path

Build order:

1. Webhook receiver with verify-token challenge, raw payload persistence, and ngrok/cloudflared public URL.
2. Inbound text path first: WhatsApp webhook -> message DB -> memory extraction -> safe text reply.
3. Add audio media retrieval and transcription.
4. Add care passport facts with source message evidence.
5. Add outbound text reply and status tracking.
6. Add HCP dashboard query integration.
7. Add scheduled check-in job and alert table.
8. Optional: TTS voice reply only after the above works.

Minimal tables:

- `patients(id, name, wa_id, phone, language, status, created_at)`
- `consents(id, patient_id, scope, granted_by, method, source_message_id, granted_at, revoked_at)`
- `messages(id, patient_id, direction, wa_message_id, type, body, media_id, storage_url, status, raw_json, created_at)`
- `transcripts(id, message_id, text, language, confidence, stt_provider, created_at)`
- `memories(id, patient_id, category, value, confidence, source_message_id, source_span, status, created_at)`
- `care_gap_alerts(id, patient_id, severity, reason, source_message_ids, status, created_at, acknowledged_by)`

Fallback if WhatsApp setup is slow:

- Build a `/demo/anna` web page that mimics WhatsApp chat and accepts audio upload + text input.
- Use Twilio WhatsApp sandbox only if Meta setup stalls but phone testing is still important.
- Seed Anna's transcript messages from a JSON file and run the same extraction/reply pipeline.
- Demo claim should be honest: "WhatsApp Cloud API path designed; simulator uses the same backend contract."

## Anna Demo Scripts

Onboarding:

- Companion: "Hi Anna, I am your memory companion. You can send me short voice notes. I save what matters to you so your care team can understand your wishes later. I do not make medical decisions. Is it okay if I save and transcribe your notes for your care team?"
- Anna: "Yes, that's okay."
- Companion: "Thank you. What should I call you?"
- Anna: "Anna."
- Companion: "Thanks, Anna. What is one thing people caring for you should know about your mornings?"

Preference capture:

- Anna voice: "I like tea before anyone starts asking me questions. Coffee makes me shaky. And I don't like people opening the curtains too quickly."
- Companion: "Thanks, Anna. I heard that quiet tea matters in the morning, coffee can make you shaky, and bright light too quickly feels unpleasant. Is there a kind of tea you usually prefer?"

Values capture:

- Anna voice: "If I get confused, I don't want people talking over me. I want them to explain slowly and let me hold my blue scarf."
- Companion: "I will remember that being spoken to slowly and holding your blue scarf helps you feel respected. Who, if anyone, should your care team call when you feel very unsettled?"

Care-gap alert:

- Anna voice: "I think I forgot my pills again. The boxes all look the same and no one came this morning."
- Companion: "That sounds worrying, Anna. I cannot advise on medicines, but I will flag this for your care team. If you feel very unwell or unsafe, call your local emergency number now."
- HCP alert: "Medication confidence / missed visit concern. Anna said she may have forgotten pills and that no one came this morning. Source: WhatsApp voice note, 2026-04-25 09:14."

Evidence-backed HCP query:

- HCP: "How should morning care be handled?"
- System answer: "Anna prefers a quiet start with tea before questions. Avoid coffee because she says it makes her shaky. Open curtains slowly because sudden bright light is unpleasant. Evidence: Anna voice note on 2026-04-25."
