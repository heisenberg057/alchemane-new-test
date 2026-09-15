import { logger } from "@/lib/logger";

const DEFAULT_TIMEOUT_MS = 5000;
const MAX_RETRIES = 2;

function assertHttpsInProd(url: string): void {
  if (process.env.NODE_ENV !== "production") return;
  const u = url.toLowerCase();
  if (u.startsWith("http://")) {
    throw new Error("HTTP URLs are not allowed in production; use HTTPS");
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export type HttpOptions = {
  headers?: Record<string, string>;
  timeoutMs?: number;
};

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

async function requestWithRetries(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  assertHttpsInProd(url);
  let lastErr: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fetchWithTimeout(url, init, timeoutMs);
    } catch (e) {
      lastErr = e;
      if (attempt < MAX_RETRIES) {
        await sleep(200 * 2 ** attempt);
        logger.warn("http retry", {
          url: url.split("?")[0],
          attempt: attempt + 1,
        });
      }
    }
  }
  throw lastErr;
}

export async function httpGet(
  url: string,
  options: HttpOptions = {}
): Promise<Response> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  return requestWithRetries(
    url,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
    },
    timeoutMs
  );
}

export async function httpPost(
  url: string,
  body: unknown,
  options: HttpOptions = {}
): Promise<Response> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  return requestWithRetries(
    url,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(body),
    },
    timeoutMs
  );
}
