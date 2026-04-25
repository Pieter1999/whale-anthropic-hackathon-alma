# Journey suite — cold-start E2E

End-to-end Tavern tests that walk a fresh patient (`greet-test-001`) through
create → onboarding → 5 conversations → caretaker retrieval → hot-moment
lookups → cleanup, against a **live stack** (no mocks). The seeded `anna`
patient is *not* used — the point is to prove cold start works.

## Prerequisites

```bash
make up         # postgres + temporal + worker + api on :8000
```

Wait for the "API is up" line, then:

```bash
make journey
```

If the API is not reachable on `http://localhost:8000` the suite skips
itself with a clear message — it does not silently pass.

## What it asserts

Beyond status codes:

- Created patient appears in `GET /patients` and disappears after delete.
- Timeline grows by exactly one event per contribution (bounded — `>=`).
- Attribution kinds (`patient` / `family` / `staff`) survive ingestion.
- Passport contains tokens from the seed content (e.g. `tea`, `home`, `marieke`).
- Completeness has at least one wedge with a non-zero score after ingestion.
- `POST /patients/{id}/query` returns a non-empty answer **whose `evidence`
  intersects the actual timeline event IDs** — catches hallucinated citations.
- `GET /hot-moments` surfaces seed tokens (`wilhelmus`, `right`) in
  calmers / agitators.
- `POST /vapi/kb` returns documents grounded in seed content.

## Known limitations

- Ingestion is async; the suite uses fixed `delay_after` waits (6–8s) instead
  of real polling. If the markdown store exposes a sync flush mode or the
  workflow exposes a query handler, swap the sleeps for a poll loop.
- Bounded keyword assertions, not exact-match. LLM extraction varies across
  runs; we assert presence rather than canonical phrasing.
- The suite assumes a clean `greet-test-001` slot. Phase 6 cleans up; if a
  prior run failed mid-flight, run `curl -X DELETE
  http://localhost:8000/patients/greet-test-001` (or just `make down && make up`).
