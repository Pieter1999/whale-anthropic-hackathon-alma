import logging
import os

import httpx

logger = logging.getLogger(__name__)

async def get_patients() -> list[dict]:
    base = os.environ.get("CARE_PASSPORT_URL", "http://localhost:8000")
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            resp = await client.get(f"{base}/patients")
            resp.raise_for_status()
        return [
            {
                "id": p["patient_id"],
                "name": p["patient_id"].replace("-", " ").title(),
            }
            for p in resp.json().get("patients", [])
        ]
    except Exception as e:
        logger.warning("Could not reach care passport API: %s", e)
        return []
