"""
Generates per-patient text documents for upload to the Vapi knowledge base.
Connect all_documents() to the real data layer once it's available.

Expected return format for all_documents():
    { "patient-id": "Full plaintext profile for this patient..." }

Each document should contain sections for:
- Calming strategies
- Triggers (what to avoid)
- Communication preferences
- Daily routine
- Identity anchors (for redirection)
"""


def get_document(patient_id: str) -> str | None:
    # TODO: fetch single patient profile from real data layer
    return all_documents().get(patient_id)


def all_documents() -> dict[str, str]:
    # TODO: fetch all patient profiles from real data layer
    # Return a dict of { patient_id: profile_text }
    return {}
