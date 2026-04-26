import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function POST(req: NextRequest) {
  const patientId = req.nextUrl.searchParams.get("patient_id");
  const path = patientId ? `/vapi/kb?patient_id=${patientId}` : "/vapi/kb";
  const body = await req.text();
  const r = await apiFetch(path, { method: "POST", body });
  return new NextResponse(await r.text(), { status: r.status, headers: { "Content-Type": "application/json" } });
}
