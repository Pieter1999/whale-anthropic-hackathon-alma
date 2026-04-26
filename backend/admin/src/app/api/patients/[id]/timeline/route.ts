import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const limit = req.nextUrl.searchParams.get("limit");
  const path = limit ? `/patients/${id}/timeline?limit=${limit}` : `/patients/${id}/timeline`;
  const r = await apiFetch(path);
  return new NextResponse(await r.text(), { status: r.status, headers: { "Content-Type": "application/json" } });
}
