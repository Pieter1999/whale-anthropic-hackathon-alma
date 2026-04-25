import asyncio
import logging
import os

import httpx

logger = logging.getLogger(__name__)


def _base_url() -> str:
    return os.environ.get("CARE_PASSPORT_URL", "http://localhost:8000")


def _build_document(patient_id: str, passport: dict, hot_moments: dict) -> str:
    lines = [f"# Patient Profile: {patient_id.replace('-', ' ').title()}"]

    # Passport fields grouped by category
    by_category: dict[str, list[str]] = {}
    for field in passport.get("fields", []):
        cat = field.get("category", "general")
        by_category.setdefault(cat, []).append(field["statement"])

    for category, statements in by_category.items():
        lines.append(f"\n## {category.replace('_', ' ').title()}")
        for s in statements:
            lines.append(f"- {s}")

    # Hot moments
    calmers = hot_moments.get("calmers", [])
    agitators = hot_moments.get("agitators", [])
    soothing_phrase = hot_moments.get("soothing_phrase")

    if calmers or agitators or soothing_phrase:
        lines.append("\n## Hot Moments")
        if calmers:
            lines.append("\n### Calming strategies")
            for c in calmers:
                lines.append(f"- {c}")
        if agitators:
            lines.append("\n### Triggers (avoid these)")
            for a in agitators:
                lines.append(f"- {a}")
        if soothing_phrase:
            lines.append(f"\n### Soothing phrase\n- {soothing_phrase}")

    return "\n".join(lines)


async def _fetch_patient_document(client: httpx.AsyncClient, patient_id: str) -> str | None:
    base = _base_url()
    try:
        passport_resp, hm_resp = await asyncio.gather(
            client.get(f"{base}/patients/{patient_id}/passport"),
            client.get(f"{base}/patients/{patient_id}/hot-moments"),
        )
        passport_resp.raise_for_status()
        hm_resp.raise_for_status()
        return _build_document(patient_id, passport_resp.json(), hm_resp.json())
    except Exception as e:
        logger.warning("Could not fetch document for patient %s: %s", patient_id, e)
        return None


async def all_documents() -> dict[str, str]:
    base = _base_url()
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            patients_resp = await client.get(f"{base}/patients")
            patients_resp.raise_for_status()
            patient_ids = [p["patient_id"] for p in patients_resp.json().get("patients", [])]

            results = await asyncio.gather(
                *[_fetch_patient_document(client, pid) for pid in patient_ids]
            )

        return {pid: doc for pid, doc in zip(patient_ids, results) if doc is not None}
    except Exception as e:
        logger.warning("Could not reach care passport API: %s", e)
        return {}


def all_documents_sync() -> dict[str, str]:
    """Synchronous version used by sync_knowledge_base.py."""
    base = _base_url()
    docs: dict[str, str] = {}
    try:
        with httpx.Client(timeout=10) as client:
            patients_resp = client.get(f"{base}/patients")
            patients_resp.raise_for_status()
            patient_ids = [p["patient_id"] for p in patients_resp.json().get("patients", [])]

            for pid in patient_ids:
                try:
                    passport = client.get(f"{base}/patients/{pid}/passport")
                    passport.raise_for_status()
                    hm = client.get(f"{base}/patients/{pid}/hot-moments")
                    hm.raise_for_status()
                    docs[pid] = _build_document(pid, passport.json(), hm.json())
                except Exception as e:
                    logger.warning("Skipping patient %s: %s", pid, e)
    except Exception as e:
        logger.warning("Could not reach care passport API: %s", e)
    return docs
