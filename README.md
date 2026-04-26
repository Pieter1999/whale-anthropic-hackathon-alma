# Care Passport

WhatsApp voice companion / evidence-backed care passport for patients.

## Repo layout

```
app/, modules/, public/    Next.js front-end (Alma iOS preview UI)
backend/                   Python API + Temporal worker + admin Next.js UI
  admin/                   Internal admin dashboard
docs/                      Product notes, research, decisions
```

The front-end and back-end are **two independent systems** with separate stacks.
You normally only run one of them.

- The front-end is a plain Next.js app. Out of the box it talks to a hosted
  back-end (Pascal's server) — you do **not** need a local back-end to run it.
- The back-end is a self-contained docker-compose stack (FastAPI, Temporal,
  Postgres, admin UI, optional cloudflared tunnel). Run it only if you are
  working on the API/worker.

## Front-end (root)

Standard Next.js dev workflow. Out of the box, API calls go to the hosted
back-end via the `/api/care-passport/[...path]` proxy. Just install and run.

```bash
npm install
npm run dev          # http://localhost:3000
```

If you want to point the proxy at a different back-end (e.g. your own local
docker stack, or a cloudflared tunnel), copy `.env.example` to `.env.local` and
set:

```
CARE_PASSPORT_API_BASE_URL=http://localhost:8000     # or tunnel URL
API_AUTH_TOKEN=<must match backend/.env API_AUTH_TOKEN>
```

Vapi keys for the voice integration also live in `.env.local` — see
`.env.example`.

Front-end entry points:

- `app/page.tsx` — root route
- `modules/alma-ios/components/AlmaIosPreview.tsx` — main composition
- `modules/alma-ios/api/carePassportApi.ts` — calls `/api/care-passport/...`
- `app/api/care-passport/[...path]/route.ts` — server-side proxy that attaches
  the bearer token

## Back-end (`backend/`)

Python (uv + FastAPI + Temporal) plus a Next.js admin UI, all wired up via
docker-compose. Only needed if you are developing the API.

```bash
cd backend
cp .env.example .env       # fill in ANTHROPIC_API_KEY etc.
make doctor                # pre-flight check
make up                    # builds & launches the full stack
```

Services:

| Service       | URL                       | Purpose                      |
| ------------- | ------------------------- | ---------------------------- |
| API           | http://localhost:8000     | FastAPI                      |
| Admin UI      | http://localhost:3000     | Next.js (hot-reloads on edits to `backend/admin/`) |
| Temporal UI   | http://localhost:8233     | Workflow inspector           |
| Cloudflared   | (logged on `make up`)     | Public tunnel for Vapi       |

`make up` includes the admin UI automatically; edits in `backend/admin/src/`
hot-reload via the bind-mounted volume.

> Port collision: the front-end and admin UI both default to port 3000. If you
> need them running side-by-side, start the front-end on a different port:
> `PORT=3001 npm run dev`.

## Docs

Product thinking, research, GTM notes and decision logs live in `docs/`.
