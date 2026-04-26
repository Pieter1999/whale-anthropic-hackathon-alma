import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await apiFetch(`/patients/${id}/hot-moments`);
  return new NextResponse(await r.text(), { status: r.status, headers: { "Content-Type": "application/json" } });
}
