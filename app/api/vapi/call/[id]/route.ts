import { NextRequest } from "next/server";

const VAPI_API_KEY = process.env.VAPI_API_KEY;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!VAPI_API_KEY) {
    return Response.json({ error: "Vapi API key not configured" }, { status: 500 });
  }

  const response = await fetch(`https://api.vapi.ai/call/${id}`, {
    headers: { Authorization: `Bearer ${VAPI_API_KEY}` },
    cache: "no-store",
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
