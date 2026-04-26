# API Auth — Care Passport

## Scheme

Every endpoint except `GET /health` requires:

```
Authorization: Bearer <token>
```

Requests missing the header, or with a wrong token, get `401 Unauthorized`.

`GET /health` is intentionally unauthenticated (uptime/tunnel health checks depend on it).

## Token location

The token lives in `.env` as `API_AUTH_TOKEN`. Ask Pascal for the value — it is not committed to the repo.

To generate a new token:
```
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## For the FE teammate (Next.js)

**Never put the token in client-side code.** The browser would expose it to anyone who opens DevTools.

Call the API from a Next.js server-side route handler (Route Handler or `getServerSideProps`), where the token stays on the server:

```ts
// app/api/passport/[patientId]/route.ts
export async function GET(request: Request, { params }: { params: { patientId: string } }) {
  const res = await fetch(
    `${process.env.CARE_PASSPORT_API_URL}/patients/${params.patientId}/passport`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CARE_PASSPORT_API_TOKEN}`,
      },
    }
  );
  const data = await res.json();
  return Response.json(data);
}
```

Set in your `.env.local`:
```
CARE_PASSPORT_API_URL=https://passport.curiloo.com
CARE_PASSPORT_API_TOKEN=<ask Pascal>
```

curl equivalent (for testing):
```bash
curl -H "Authorization: Bearer <token>" https://passport.curiloo.com/patients/anna/passport
```

---

## For the Vapi teammate

Vapi custom knowledge-base webhooks support a `headers` field in the server config. Add the bearer token there so every `POST /vapi/kb` call arrives authenticated:

In the Vapi dashboard → Assistants → Knowledge Base → Server URL config:
```json
{
  "url": "https://passport.curiloo.com/vapi/kb",
  "headers": {
    "Authorization": "Bearer <token>"
  }
}
```

The same applies to the end-of-call webhook if you configure that separately.

---

## Limits of this scheme

This is hackathon-grade auth only:

- Single shared secret — anyone with the token can call any endpoint.
- No per-user identity or role separation.
- No token rotation automation.
- No rate limiting.
- No audit logging.

Production would need per-user tokens (OAuth / API keys), rotation, and rate limits. Do not mistake this for production-ready.

## Rotating the token

1. Generate a new token: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
2. Update `API_AUTH_TOKEN` in `.env` on the server.
3. Restart the stack: `make down && make up` (or `make restart-api` if it exists).
4. Update `CARE_PASSPORT_API_TOKEN` in the FE `.env.local` and redeploy.
5. Update the Vapi server config header.
