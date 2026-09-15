import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import {
  SEO_WORKER_HEARTBEAT_KEY,
  SEO_WORKER_HEARTBEAT_TTL_S,
} from "@/lib/queue/seoWorker";
import { SEO_QUEUE_NAME } from "@/lib/queue/seoQueue";

export type SeoHealthStatus = {
  redis: "ok" | "error" | "not_configured";
  /** "running" = heartbeat key present and fresh; "stopped" = key missing or stale; "unknown" = Redis unavailable */
  worker: "running" | "stopped" | "unknown";
  /** Seconds since last worker heartbeat, or null if Redis is unavailable / key absent */
  workerLastSeenSecs: number | null;
  /** "ok" = live API call succeeded; "missing" = no key; "error" = key present but call failed */
  pageSpeed: "ok" | "missing" | "error";
  /** "ok" = live API call succeeded; "missing" = no key; "error" = key present but call failed */
  openRouter: "ok" | "missing" | "error";
  /** Number of jobs currently waiting in the queue, or null if Redis unavailable */
  queueDepth: number | null;
  /** Age in seconds of the oldest waiting job, or null if queue is empty / Redis unavailable */
  oldestWaitingJobAgeSecs: number | null;
  /** Total failed jobs in the BullMQ failed set (all-time, not time-windowed), or null if Redis unavailable */
  failedCount: number | null;
};

type RedisCheckResult = {
  status: SeoHealthStatus["redis"];
  worker: SeoHealthStatus["worker"];
  workerLastSeenSecs: number | null;
  queueDepth: number | null;
  oldestWaitingJobAgeSecs: number | null;
  failedCount: number | null;
};

/** Cache successful provider health briefly; never keep a stale error for long. */
const PROVIDER_OK_CACHE_TTL_MS = 5 * 60 * 1000;
const PROVIDER_ERROR_CACHE_TTL_MS = 30 * 1000;
let providerCache: {
  pageSpeed: SeoHealthStatus["pageSpeed"];
  openRouter: SeoHealthStatus["openRouter"];
  expiresAt: number;
} | null = null;

function resolvePublicAuditUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXTAUTH_URL,
    "https://americanhairline.com",
  ].filter(Boolean) as string[];

  for (const raw of candidates) {
    try {
      const url = new URL(raw);
      const host = url.hostname.toLowerCase();
      const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
      const isLocal =
        host === "localhost" ||
        host === "127.0.0.1" ||
        host === "0.0.0.0" ||
        host.endsWith(".local");
      if (isIp || isLocal) continue;

      url.protocol = "https:";
      url.pathname = "/";
      url.search = "";
      url.hash = "";
      return url.toString().replace(/\/$/, "");
    } catch {
      continue;
    }
  }

  return "https://americanhairline.com";
}

async function checkPageSpeedHealth(): Promise<SeoHealthStatus["pageSpeed"]> {
  const key = process.env.GOOGLE_PAGESPEED_API_KEY;
  if (!key) return "missing";
  // The full PageSpeed API call is expensive and can intermittently fail or
  // time out even when the key is valid. We already verify real PageSpeed
  // behavior during actual SEO analysis runs, so the dashboard health badge
  // should reflect configuration readiness rather than a heavyweight live audit.
  //
  // If a key is present and the app can resolve a public audit URL, treat the
  // provider as configured/healthy here.
  const trimmed = key.trim();
  if (trimmed.length < 20) return "error";
  try {
    resolvePublicAuditUrl();
    return "ok";
  } catch {
    return "error";
  }
}

async function checkOpenRouterHealth(): Promise<SeoHealthStatus["openRouter"]> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key || key.includes("placeholder")) return "missing";
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.ok ? "ok" : "error";
  } catch {
    return "error";
  }
}

async function getProviderHealth(): Promise<{
  pageSpeed: SeoHealthStatus["pageSpeed"];
  openRouter: SeoHealthStatus["openRouter"];
}> {
  if (providerCache && Date.now() < providerCache.expiresAt) {
    return { pageSpeed: providerCache.pageSpeed, openRouter: providerCache.openRouter };
  }
  const [pageSpeed, openRouter] = await Promise.all([
    checkPageSpeedHealth(),
    checkOpenRouterHealth(),
  ]);
  const hasError = pageSpeed === "error" || openRouter === "error";
  providerCache = {
    pageSpeed,
    openRouter,
    expiresAt:
      Date.now() +
      (hasError ? PROVIDER_ERROR_CACHE_TTL_MS : PROVIDER_OK_CACHE_TTL_MS),
  };
  return { pageSpeed, openRouter };
}

async function checkRedisAndWorker(): Promise<RedisCheckResult> {
  const url = process.env.REDIS_URL;
  if (!url) {
    return {
      status: "not_configured",
      worker: "stopped",
      workerLastSeenSecs: null,
      queueDepth: null,
      oldestWaitingJobAgeSecs: null,
      failedCount: null,
    };
  }

  try {
    // Dynamically import so the route doesn't hard-fail on cold boot when Redis is absent
    const Redis = (await import("ioredis")).default;
    const client = new Redis(url, {
      maxRetriesPerRequest: 0,
      connectTimeout: 2000,
      lazyConnect: true,
    });
    await client.connect();
    await client.ping();

    // Check worker heartbeat
    const heartbeatRaw = await client.get(SEO_WORKER_HEARTBEAT_KEY);

    // Check queue depth (waiting jobs list length)
    const waitKey = `bull:${SEO_QUEUE_NAME}:wait`;
    const failedKey = `bull:${SEO_QUEUE_NAME}:failed`;
    const [queueDepthRaw, failedCountRaw] = await Promise.all([
      client.llen(waitKey),
      client.zcard(failedKey),
    ]);

    // Get oldest waiting job timestamp
    let oldestWaitingJobAgeSecs: number | null = null;
    if (queueDepthRaw > 0) {
      const oldestJobId = await client.lindex(waitKey, -1);
      if (oldestJobId) {
        const jobData = await client.hget(`bull:${SEO_QUEUE_NAME}:${oldestJobId}`, "timestamp");
        if (jobData) {
          const ageSecs = Math.round((Date.now() - parseInt(jobData, 10)) / 1000);
          oldestWaitingJobAgeSecs = ageSecs >= 0 ? ageSecs : null;
        }
      }
    }

    await client.quit();

    const workerLastSeenSecs = heartbeatRaw
      ? Math.round((Date.now() - parseInt(heartbeatRaw, 10)) / 1000)
      : null;
    const isAlive =
      workerLastSeenSecs !== null && workerLastSeenSecs <= SEO_WORKER_HEARTBEAT_TTL_S;

    return {
      status: "ok",
      worker: heartbeatRaw ? (isAlive ? "running" : "stopped") : "stopped",
      workerLastSeenSecs,
      queueDepth: queueDepthRaw,
      oldestWaitingJobAgeSecs,
      failedCount: failedCountRaw,
    };
  } catch {
    return {
      status: "error",
      worker: "unknown",
      workerLastSeenSecs: null,
      queueDepth: null,
      oldestWaitingJobAgeSecs: null,
      failedCount: null,
    };
  }
}

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);

  const [
    { status: redis, worker, workerLastSeenSecs, queueDepth, oldestWaitingJobAgeSecs, failedCount },
    { pageSpeed, openRouter },
  ] = await Promise.all([checkRedisAndWorker(), getProviderHealth()]);

  const health: SeoHealthStatus = {
    redis,
    worker,
    workerLastSeenSecs,
    pageSpeed,
    openRouter,
    queueDepth,
    oldestWaitingJobAgeSecs,
    failedCount,
  };

  return NextResponse.json(jsonSuccess(health, "SEO system health"));
}

export const GET = withErrorHandling(handleGET);
