# Care Passport — prototype

WhatsApp/voice companion that builds an evidence-backed knowledge graph per patient.
One Temporal workflow per patient. Knowledge layer sits behind a `KnowledgeStore` protocol —
ships with `StubKnowledgeStore` for demo; swap to `GraphitiKnowledgeStore` via config.

## Quick start (Docker — recommended)

```bash
cp .env.example .env
# KNOWLEDGE_STORE=stub is the default — no API keys needed for the demo
make up
# wait for "API is up" message, then:
make smoke
```

Temporal UI: http://localhost:8233

## Demo day — expose the API to Vapi

`cloudflared` runs as part of the compose stack. Two modes:

- **Persistent (recommended for demo day)**: a Cloudflare named tunnel on a
  domain you control. Stable URL across restarts. One-time setup, then
  `make up` always prints the same URL.
- **Quick (default fallback)**: ephemeral `*.trycloudflare.com` URL — changes
  every `make up`. No setup, but trycloudflare is blocked by some DNS
  filters (NextDNS, Pi-hole, corporate networks).

### Persistent tunnel — one-time setup

1. Cloudflare **Zero Trust dashboard → Networks → Tunnels → Create a tunnel**.
   Pick **Cloudflared**. Name it `care-passport`.
2. On the install screen, copy the token (the long string after `--token`).
   Don't run the install command they show — just copy the token.
3. Switch to the **Public Hostname** tab and add a route:
   - Subdomain: `passport` (or whatever)
   - Domain: a Cloudflare-managed domain you own (e.g. `cloud.curiloo.com`)
   - Type: `HTTP`
   - URL: `api:8000` (the docker service name — not `localhost`)
4. In `.env`, set:
   ```
   CLOUDFLARE_TUNNEL_TOKEN=<the long token from step 2>
   CLOUDFLARE_TUNNEL_HOSTNAME=passport.cloud.curiloo.com
   ```

After that, `make up` runs the named tunnel automatically:

```
=================================================================
  care-passport stack is up
=================================================================
  Local API health:    http://localhost:8000/health
  Temporal UI:         http://localhost:8233

  Public tunnel:       https://passport.cloud.curiloo.com  (named (persistent))
  Vapi KB webhook:     https://passport.cloud.curiloo.com/vapi/kb?patient_id=anna
  Vapi end-of-call:    https://passport.cloud.curiloo.com/vapi/end-of-call?patient_id=anna
=================================================================
```

Cmd-click the URL in iTerm2 / Terminal.app / VS Code to open. With a named
tunnel the URL is stable across restarts — paste once into Vapi and forget.
To re-print without restarting: `make tunnel`. With the quick-tunnel fallback
the URL changes each `make up` and you must paste fresh.

Sanity check before going live:

```bash
curl https://<random>.trycloudflare.com/health
```

## Local dev (no Docker)

```bash
cp .env.example .env
uv sync --extra dev
temporal server start-dev                              # terminal 1
uv run python -m care_passport.worker                 # terminal 2
uv run uvicorn care_passport.api:app --reload         # terminal 3
```

## Make targets

| Target | Description |
|---|---|
| `make up` | Build and start all services, wait for health |
| `make down` | Stop all services |
| `make logs` | Follow all container logs |
| `make restart-api` | Rebuild + restart API container only |
| `make restart-worker` | Rebuild + restart worker container only |
| `make test` | Run pytest suite |
| `make lint` | Run ruff linter |
| `make smoke` | Full happy-path curl test against running stack |
| `make journey` | Tavern E2E journey suite (requires `make up` first) |

## Endpoint reference

### Health
| Method | Path | Description |
|---|---|---|
| GET | `/health` | Service health + Temporal connectivity |

### Patient management
| Method | Path | Description |
|---|---|---|
| POST | `/patients` | Create patient + start Temporal workflow |
| GET | `/patients` | List patients with running workflows |
| GET | `/patients/{id}` | Workflow status + passport summary |
| DELETE | `/patients/{id}` | Terminate workflow (204) |

### Vapi integration
| Method | Path | Description |
|---|---|---|
| POST | `/vapi/kb?patient_id=X` | Custom knowledge base webhook (< 2s hot read) |
| POST | `/vapi/end-of-call?patient_id=X` | End-of-call report → workflow signal |

### Contributions
| Method | Path | Description |
|---|---|---|
| POST | `/patients/{id}/contributions` | Family/staff text → workflow signal |

### Reads (HCP frontend)
| Method | Path | Description |
|---|---|---|
| GET | `/patients/{id}/passport` | Structured passport fields |
| GET | `/patients/{id}/hot-moments` | Calmers, agitators, soothing phrase |
| GET | `/patients/{id}/completeness` | PZP coverage + readiness scores |
| GET | `/patients/{id}/timeline?limit=N` | Last N events |
| POST | `/patients/{id}/query` | Natural language Q&A |

## Switching to Graphiti

Set `KNOWLEDGE_STORE=graphiti` in `.env` (requires `ANTHROPIC_API_KEY` + `VOYAGE_API_KEY`).
The `GraphitiKnowledgeStore` in `src/care_passport/knowledge/graphiti_store.py` is wired automatically.

## Tests

```bash
make test
# or
uv run pytest -q
```

### Journey suite (end-to-end, live stack)

`tests/journey/` is a Tavern suite that walks a cold-start patient through
create → onboarding → 5 conversations → caretaker retrieval → hot-moment
lookups → cleanup. It is excluded from `make test` because it needs a live
stack. Bring up the stack first, then run it:

```bash
make up        # wait for "API is up"
make journey
```

It asserts more than status codes — passport tokens, attribution
preservation, completeness changing off zero, and that query answers cite
source_ids that actually exist in the timeline. See
`tests/journey/README.md` for the full list of invariants and known
limitations (LLM nondeterminism, fixed-delay polling).

## Key files

```
src/care_passport/
  config.py                    — pydantic-settings (KNOWLEDGE_STORE, TEMPORAL_HOST, ...)
  entities.py                  — ONTOLOGY EXTENSION POINT (Pascal's task)
  memory.py                    — original Graphiti wrapper (kept for reference)
  knowledge/
    __init__.py                — KnowledgeStore Protocol + get_store() factory
    models.py                  — Pydantic models: Episode, Passport, HotMoments, ...
    stub_store.py              — StubKnowledgeStore (canned demo data for "anna")
    graphiti_store.py          — GraphitiKnowledgeStore (Kuzu + Voyage + Anthropic)
  activities.py                — ingest_episode_activity (Temporal)
  workflow.py                  — PatientAgentWorkflow (episode_received signal)
  worker.py                    — worker entrypoint
  api.py                       — FastAPI: full endpoint surface
docker-compose.yml             — postgres + temporal + temporal-ui + worker + api
Dockerfile.worker / .api       — uv-based images
Makefile                       — up / down / smoke / test / lint
```
