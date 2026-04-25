"""
Quick smoke-tests for the Vapi API. Run with:
    python test_vapi.py

Tests (all read-only, nothing is modified):
  1. Auth check — list assistants
  2. Fetch the Alma assistant by ID (tools + toolIds)
  3. List query tools
  4. List uploaded files (and their processing status)
  5. List knowledge bases
"""

import os
import sys

import httpx
from dotenv import load_dotenv

load_dotenv(dotenv_path="../../.env")

API_KEY = os.environ.get("VAPI_API_KEY", "")
ASSISTANT_ID = os.environ.get("ASSISTENT_ID", "")

if not API_KEY:
    print("ERROR: VAPI_API_KEY not set in .env")
    sys.exit(1)

HEADERS = {"Authorization": f"Bearer {API_KEY}"}
VAPI = "https://api.vapi.ai"

PASS = "\033[92m✓\033[0m"
FAIL = "\033[91m✗\033[0m"


def check(label: str, resp: httpx.Response) -> dict | list | None:
    if resp.is_success:
        data = resp.json()
        print(f"{PASS} {label}")
        return data
    else:
        print(f"{FAIL} {label} — {resp.status_code}: {resp.text[:120]}")
        return None


def main():
    client = httpx.Client(headers=HEADERS, timeout=15)

    print("\n── 1. Auth check (list assistants) ──")
    data = check("GET /assistant", client.get(f"{VAPI}/assistant"))
    if data is not None:
        print(f"   Found {len(data)} assistant(s)")

    print("\n── 2. Fetch Alma assistant ──")
    if ASSISTANT_ID:
        data = check(f"GET /assistant/{ASSISTANT_ID}", client.get(f"{VAPI}/assistant/{ASSISTANT_ID}"))
        if data:
            model = data.get("model", {})
            tools = model.get("tools", [])
            tool_ids = model.get("toolIds", [])
            print(f"   Name    : {data.get('name')}")
            print(f"   tools   : {[t['function']['name'] for t in tools if t.get('function')]}")
            print(f"   toolIds : {tool_ids}")
    else:
        print("  (skipped — ASSISTENT_ID not set in .env)")

    print("\n── 3. List query tools ──")
    data = check("GET /tool", client.get(f"{VAPI}/tool"))
    if data is not None:
        if data:
            for t in data:
                fn = t.get("function", {})
                kbs = t.get("knowledgeBases", [])
                print(f"   {t.get('id')}  name={fn.get('name')}  type={t.get('type')}  KBs={len(kbs)}")
        else:
            print("   No tools found.")

    print("\n── 4. List uploaded files ──")
    data = check("GET /file", client.get(f"{VAPI}/file"))
    if data is not None:
        if data:
            for f in data:
                print(f"   {f.get('id')}  {f.get('name')}  status={f.get('status')}")
        else:
            print("   No files uploaded yet. Run sync_knowledge_base.py first.")

    print("\n── 5. List knowledge bases ──")
    data = check("GET /knowledge-base", client.get(f"{VAPI}/knowledge-base"))
    if data is not None:
        if data:
            for kb in data:
                print(f"   {kb.get('id')}  {kb.get('name')}")
        else:
            print("   No knowledge bases found.")

    print()
    client.close()


if __name__ == "__main__":
    main()
