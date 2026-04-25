import { NextRequest } from "next/server";

const PRIMARY_BASE_URL = process.env.NEXT_PUBLIC_CARE_PASSPORT_API_BASE_URL;
const FALLBACK_BASE_URL = process.env.LOCAL_CARE_PASSPORT_API_BASE_URL;

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

function buildTargetUrl(request: NextRequest, path: string[], baseUrl: string) {
  const sourceUrl = new URL(request.url);
  return new URL(
    `/${path.join("/")}${sourceUrl.search}`,
    baseUrl,
  ).toString();
}

async function fetchUpstream(
  request: NextRequest,
  path: string[],
  baseUrl: string,
  body: string | undefined,
) {
  return fetch(buildTargetUrl(request, path, baseUrl), {
    method: request.method,
    headers: {
      "Content-Type": request.headers.get("content-type") ?? "application/json",
    },
    body,
    cache: "no-store",
  });
}

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const bases = [PRIMARY_BASE_URL, FALLBACK_BASE_URL].filter(
    (url): url is string => Boolean(url?.trim()),
  );
  if (bases.length === 0) {
    throw new Error(
      "Care Passport API is not configured (NEXT_PUBLIC_CARE_PASSPORT_API_BASE_URL / LOCAL_CARE_PASSPORT_API_BASE_URL).",
    );
  }

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.text();

  let response: Response | undefined;
  for (let i = 0; i < bases.length; i++) {
    const isLast = i === bases.length - 1;
    try {
      response = await fetchUpstream(request, path, bases[i], body);
      if (response.ok || response.status < 500 || isLast) break;
      console.warn(
        `[care-passport proxy] ${bases[i]} → ${response.status}, falling back to ${bases[i + 1]}`,
      );
    } catch (err) {
      if (isLast) throw err;
      console.warn(
        `[care-passport proxy] ${bases[i]} threw; falling back to ${bases[i + 1]}`,
        err,
      );
    }
  }

  return new Response(response!.body, {
    status: response!.status,
    statusText: response!.statusText,
    headers: {
      "Content-Type":
        response!.headers.get("content-type") ?? "application/json",
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
