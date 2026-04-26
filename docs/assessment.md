# Hackathon Submission Review — "Alma" / Care Passport

**Team:** 3 contributors (Pascal, Luc, Pieter), 24 commits over ~24h.
**Pitch artefact:** `alma_pitch_deck_20260426072837.pdf` (committed at submission deadline).

## What they actually built

| Layer | Stack | State |
|---|---|---|
| **Voice capture** | Vapi (browser SDK + named-tunnel webhooks) | Working end-to-end; live transcripts streamed back to UI |
| **Backend orchestration** | FastAPI + **Temporal** (one durable workflow per patient, signals/updates pattern) | Working, dockerized, smoke-tested |
| **Knowledge store** | Pluggable `KnowledgeStore` Protocol with 3 impls: Stub, **Markdown-with-tails (LLM extraction → patches)**, Graphiti/Kuzu/Voyage | Markdown store is the load-bearing one and is genuinely interesting |
| **Frontends** | Two Next.js apps: an iOS-frame "Alma" patient/care-team preview, and a shadcn-based admin/HCP dashboard | Both ship, both call the API |
| **Voice server** | Separate FastAPI that syncs Vapi's KB from passport reads | Working |
| **Tests** | Pytest unit tests + 6-phase **Tavern E2E journey suite** (create → onboard → 5 conversations → caretaker retrieval → hot-moments → cleanup) with non-trivial invariants (citations resolve to timeline events, attribution preserved, completeness changes) | Surprisingly mature for 24h |

## Ratings

### Technical sophistication — 8.5/10
Well above hackathon median. Three specific things stand out:
- **Temporal for per-patient state.** Actual durable workflows with signals (`episode_received`) and updates (`get_passport`, `answer_query`) — not a hand-rolled queue. Right tool, correctly used.
- **"Markdown-with-tails" knowledge representation.** Each bullet carries `confidence|source_ids|first_seen|last_confirmed|attributed|status`. LLM emits patch ops (`add | update_confirmed | supersede`) against current state. This is the kind of representation choice that's well-argued in `docs/knowledge-layer.md` and reflects mature thinking — they explicitly rejected a vector DB for the 24h scope and documented why.
- **Real auth, real CORS, bearer-token compare with `hmac.compare_digest`, LLM health probe at startup, sentinel writes on extraction failure.** Production hygiene that hackathon teams almost never bother with.

Knocks: `GraphitiKnowledgeStore` is half-stubbed (passport/hot-moments return empty) — fine since it's gated behind config, but it's lipstick. `_store` is a module-level singleton in `activities.py`, which is a footgun in worker reload scenarios.

### Product / UX — 8/10
- The **problem framing is unusually sharp** (`docs/problem.md`): "the gradual disappearance of the patient voice before the healthcare system has captured it." Clear ethical boundary (system supports human decisions, doesn't make them). Demoable narrative that judges can grasp in 30 seconds.
- Two distinct frontends serve two distinct user personas (family/patient vs. care team / HCP) — they understood the product is two-sided and built for both.
- The Vapi system prompt is genuinely well-crafted (hard rules, escalation handling, staleness flags, "say if missing") — not the usual "you are a helpful assistant" sludge.
- 4 written user stories, GTM doc for the Netherlands, competitor scan. They thought beyond the demo.

Knocks: Two frontends in 24h is split focus and it shows in the iOS preview being more demo-shell than functional app.

### Scalability / architecture — 7.5/10
- Per-patient Temporal workflow scales horizontally and gives you replay/audit for free — strong choice for healthcare.
- `KnowledgeStore` Protocol means swapping the markdown prototype for Graphiti/Kuzu (or anything else) is a config flip, not a rewrite. The seam is in the right place.
- Markdown-per-patient on disk is obviously not the production answer, but they know that — `docs/knowledge-layer.md` calls it out explicitly.
- CORS is `allow_origins=*` style in the voice server, single bearer token shared across tenants. Fine for demo, would need rework for multi-tenant.

### Engineering rigor — 9/10
The most underrated dimension here. For 24 hours:
- 8 pytest files + 6-phase Tavern journey suite with semantic invariants
- Dockerfile.api / Dockerfile.worker / docker-compose with Temporal + UI + worker + api + cloudflared
- `make up / down / logs / test / smoke / journey / lint`
- `SECURITY.md` in the backend
- pydantic-settings config, ruff, uv lockfile
- Named Cloudflare tunnel docs with the TLS-cert gotcha called out

This is what an experienced team's 24h output looks like.

### Pitch / completeness — 8/10
Pitch deck is committed (1.7MB PDF), problem doc exists, GTM doc exists, 4 user stories, decision logs in docs/. Demo path is obvious from the README (`make up && make smoke`).

## Overall: **8/10 — top-quartile submission**

Strongest points: Temporal-based architecture, markdown-with-tails representation with citation tracking, an actually-runnable end-to-end demo (voice → tunnel → workflow → patches → HCP read) backed by a journey test suite that asserts real invariants. The product framing is more rigorous than 90% of hackathon entries.

Weakest points: split focus between two frontends, Graphiti store is a stub, single shared bearer token, some half-finished surfaces (e.g. `entities.py` marked as "Pascal's task" extension point).

If you're scoring against typical hackathon criteria: **technical 8.5, product 8, scalability 7.5, polish/rigor 9, pitch 8**.
