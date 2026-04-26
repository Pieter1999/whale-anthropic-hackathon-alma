import { NextRequest } from "next/server";

const CARE_PASSPORT_API_BASE_URL =
  process.env.CARE_PASSPORT_API_BASE_URL ??
  process.env.LOCAL_CARE_PASSPORT_API_BASE_URL ??
  process.env.NEXT_PUBLIC_CARE_PASSPORT_API_BASE_URL;

const API_AUTH_TOKEN =
  process.env.API_AUTH_TOKEN ?? process.env.CARE_PASSPORT_API_AUTH_TOKEN;

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

function buildTargetUrl(request: NextRequest, path: string[]) {
  if (!CARE_PASSPORT_API_BASE_URL) {
    throw new Error("CARE_PASSPORT_API_BASE_URL is not configured.");
  }

  const sourceUrl = new URL(request.url);
  const targetUrl = new URL(
    `/${path.join("/")}${sourceUrl.search}`,
    CARE_PASSPORT_API_BASE_URL,
  );

  return targetUrl.toString();
}

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const targetUrl = buildTargetUrl(request, path);
  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.text();

  const headers: Record<string, string> = {
    "Content-Type": request.headers.get("content-type") ?? "application/json",
  };
  if (API_AUTH_TOKEN) {
    headers["Authorization"] = `Bearer ${API_AUTH_TOKEN}`;
  }

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      "Content-Type":
        response.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}
