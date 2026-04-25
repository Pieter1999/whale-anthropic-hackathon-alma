"""
One-time setup script — uploads patient documents to Vapi and configures
the assistant with a KB query tool.

Run once (and re-run whenever patient profiles change):
    python sync_knowledge_base.py

Updates .env with the resulting VAPI_KB_FILE_IDS.
"""

import io
import os
import sys

import httpx
from dotenv import load_dotenv, set_key  # set_key still used for VAPI_TOOL_ID

from knowledge import all_documents

load_dotenv(dotenv_path="../../.env")

API_KEY = os.environ["VAPI_API_KEY"]
ASSISTANT_ID = os.environ["ASSISTENT_ID"]
VAPI = "https://api.vapi.ai"
ENV_PATH = "../../.env"

HEADERS = {"Authorization": f"Bearer {API_KEY}"}


def upload_file(patient_id: str, content: str) -> str:
    """Upload a markdown document and return its Vapi file ID."""
    file_bytes = content.encode("utf-8")
    resp = httpx.post(
        f"{VAPI}/file",
        headers=HEADERS,
        files={"file": (f"{patient_id}.txt", io.BytesIO(file_bytes), "text/plain")},
        timeout=30,
    )
    resp.raise_for_status()
    file_id = resp.json()["id"]
    print(f"  Uploaded {patient_id}.md → {file_id}")
    return file_id


def create_query_tool(file_ids: list[str]) -> str:
    """Create a standalone query tool and return its Vapi tool ID."""
    payload = {
        "type": "query",
        "async": False,
        "function": {
            "name": "search_patient_profile",
            "description": (
                "Search the patient knowledge base for calming strategies, "
                "triggers, routines, and preferences for the current patient. "
                "Always call this before giving care advice."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": (
                            "A focused search query, e.g. "
                            "'calming strategies for David van der Berg' "
                            "or 'triggers to avoid for Maria Janssen'."
                        ),
                    }
                },
                "required": ["query"],
            },
        },
        "knowledgeBases": [
            {
                "name": "patient_profiles",
                "provider": "google",
                "model": "gemini-2.5-flash-lite",
                "description": (
                    "Profiles for all patients including calming strategies, "
                    "triggers, communication preferences, daily routines, "
                    "and identity anchors."
                ),
                "fileIds": file_ids,
            }
        ],
    }

    resp = httpx.post(
        f"{VAPI}/tool",
        headers={**HEADERS, "Content-Type": "application/json"},
        json=payload,
        timeout=15,
    )
    if not resp.is_success:
        print(f"  Vapi error {resp.status_code}: {resp.text}")
        resp.raise_for_status()

    tool_id = resp.json()["id"]
    print(f"  Query tool created → {tool_id}")
    return tool_id


def attach_tool_to_assistant(tool_id: str) -> None:
    """Patch the assistant to reference the query tool by ID."""
    current = httpx.get(f"{VAPI}/assistant/{ASSISTANT_ID}", headers=HEADERS, timeout=15)
    current.raise_for_status()
    current_model = current.json().get("model", {})

    updated_model = {
        **{k: v for k, v in current_model.items() if k not in ("tools", "toolIds")},
        "toolIds": [tool_id],
    }

    resp = httpx.patch(
        f"{VAPI}/assistant/{ASSISTANT_ID}",
        headers={**HEADERS, "Content-Type": "application/json"},
        json={"model": updated_model},
        timeout=15,
    )
    if not resp.is_success:
        print(f"  Vapi error {resp.status_code}: {resp.text}")
        resp.raise_for_status()
    print(f"  Assistant updated with tool {tool_id}.")


def main() -> None:
    documents = all_documents()
    print(f"Uploading {len(documents)} patient document(s) to Vapi...")

    file_ids: list[str] = []
    for patient_id, content in documents.items():
        fid = upload_file(patient_id, content)
        file_ids.append(fid)

    print("\nCreating query tool...")
    tool_id = create_query_tool(file_ids)
    set_key(ENV_PATH, "VAPI_TOOL_ID", tool_id)

    print("\nAttaching tool to assistant...")
    attach_tool_to_assistant(tool_id)

    print("\nDone. Run the server and web client to test.")


if __name__ == "__main__":
    main()
