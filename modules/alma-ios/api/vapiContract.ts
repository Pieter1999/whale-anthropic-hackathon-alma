export const VAPI_BACKEND_CONTRACT = {
  knowledgeBase:
    "POST /vapi/kb?patient_id=:patientId is owned by the FastAPI backend and should be configured directly in Vapi.",
  endOfCall:
    "POST /vapi/end-of-call?patient_id=:patientId is owned by the FastAPI backend and ingests call transcripts into the Care Passport workflow.",
  frontendRole:
    "The Next.js frontend refreshes patient/passport data after backend updates; it does not proxy Vapi webhooks.",
} as const;
