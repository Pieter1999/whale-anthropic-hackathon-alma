# Care Passport — Agent Notes

WhatsApp voice companion / evidence-backed care passport for patients.

See `README.md` for the human-facing repo overview, layout, and run
instructions for the front-end and back-end stacks. The two are independent
systems and are spun up separately.

## Two-stack TL;DR

- **Front-end** (root: `app/`, `modules/`, `public/`) — Next.js. Out of the box
  it talks to Pascal's hosted back-end via `/api/care-passport/[...path]`. You
  normally do **not** need to run the back-end locally.
- **Back-end** (`backend/`) — Python API + Temporal worker + admin Next.js UI,
  orchestrated by docker-compose. Only run this if you're working on the API.
- **Docs** (`docs/`) — product notes, research, decisions.

## Working principles

- Prioritize a demoable product over broad architecture.
- Keep notes concise and decision-oriented (in `docs/`).
- Keep code scoped to the prototype path needed for the pitch.
- Do not place implementation files at the repository root unless they are
  project-level config.

## Gotchas

- Front-end and admin UI both default to port 3000 — if running both locally,
  start the front-end with `PORT=3001 npm run dev`.
- Front-end auth: the `/api/care-passport/...` proxy requires
  `API_AUTH_TOKEN` and `CARE_PASSPORT_API_BASE_URL` in `.env.local`. Without
  them, every request 401s. See `.env.example`.
- `backend/admin/` runs Next.js 16 — its `AGENTS.md` warns that APIs and
  conventions may differ from training data; check
  `node_modules/next/dist/docs/` before guessing.
