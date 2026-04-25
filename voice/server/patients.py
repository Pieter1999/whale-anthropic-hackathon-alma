"""
Patient registry — connect get_patients() and get_patient_by_id() to the
real data layer once it's available.
"""


def get_patients() -> list[dict]:
    # TODO: replace with real DB / API call
    # Expected shape per patient:
    # { "id": str, "name": str, "room": str, "diagnosis": str }
    return []


def get_patient_by_id(patient_id: str) -> dict | None:
    # TODO: replace with real DB / API call
    return next((p for p in get_patients() if p["id"] == patient_id), None)
