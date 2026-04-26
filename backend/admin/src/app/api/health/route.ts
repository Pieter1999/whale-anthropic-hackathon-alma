import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function GET(req: NextRequest) {
  const probe = req.nextUrl.searchParams.get("probe");
  const path = probe ? `/health?probe=${probe}` : "/health";
  const r = await apiFetch(path);
  return new NextResponse(await r.text(), { status: r.status, headers: { "Content-Type": "application/json" } });
}
