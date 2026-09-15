import type { NextRequest } from "next/server";

type Bucket = "public" | "auth" | "forms";

type BucketConfig = {
  windowMs: number;
  max: number;
};

type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

const BUCKETS: Record<Bucket, BucketConfig> = {
  public: { windowMs: 60_000, max: 300 },
  auth: { windowMs: 60_000, max: 10 },
  forms: { windowMs: 60_000, max: 20 },
};

type MemoryEntry = {
  count: number;
  resetAt: number;
};

const memoryStore = new Map<string, MemoryEntry>();

type RedisLike = {
  incr(key: string): Promise<number>;
  pexpire(key: string, ttlMs: number): Promise<number>;
  pttl(key: string): Promise<number>;
};

let redisClientPromise: Promise<RedisLike | null> | null = null;

async function getRedisClient(): Promise<RedisLike | null> {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!redisClientPromise) {
    redisClientPromise = (async () => {
      try {
        const { default: Redis } = await import("ioredis");
        return new Redis(process.env.REDIS_URL!) as unknown as RedisLike;
      } catch {
        return null;
      }
    })();
  }

  return redisClientPromise;
}

function getStoreKey(ip: string, bucket: Bucket): string {
  return `rate:${bucket}:${ip}`;
}

function getRouteGroup(pathname: string): Bucket {
  if (pathname.startsWith("/api/auth/")) return "auth";
  if (pathname === "/api/users/login") return "auth";
  if (pathname === "/api/admin/bootstrap-session") return "auth";
  if (pathname === "/api/analytics/overview") return "auth";
  if (pathname.startsWith("/api/webhooks")) return "auth";
  if (pathname.startsWith("/api/search-optimization")) return "auth";
  if (pathname.startsWith("/api/ai-seo")) return "auth";
  if (pathname === "/api/health/deep") return "auth";
  if (pathname === "/api/calculator/stats") return "auth";
  if (pathname === "/api/lead-scoring/hot-leads") return "auth";
  if (pathname === "/api/lead-scoring/score-all") return "auth";
  if (/^\/api\/lead-scoring\/score\/[^/]+$/.test(pathname)) return "auth";
  if (pathname === "/api/lead-optimization/dashboard") return "auth";
  if (pathname.startsWith("/api/forms/")) return "forms";
  if (pathname.startsWith("/api/gdpr/")) return "forms";
  if (pathname.startsWith("/api/comments")) return "forms";
  if (pathname === "/api/analytics/pageview") return "forms";
  if (pathname.startsWith("/api/tracking/")) return "forms";
  if (pathname.startsWith("/api/calculator/") && pathname !== "/api/calculator/stats") {
    return "forms";
  }
  if (pathname.startsWith("/api/lead-scoring/track/")) return "forms";
  if (pathname.startsWith("/api/lead-optimization/track/")) return "forms";
  return "public";
}

export function getClientIpFromHeaders(headers: Headers): string {
  // cf-connecting-ip is set by Cloudflare and is the real visitor IP
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp.trim() || "unknown";
  }
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim() || "unknown";
  }
  return "unknown";
}

export function getClientIpFromNextRequest(req: NextRequest): string {
  return getClientIpFromHeaders(req.headers);
}

function retryAfterSeconds(resetAt: number): number {
  const deltaMs = Math.max(resetAt - Date.now(), 0);
  return Math.max(1, Math.ceil(deltaMs / 1000));
}

async function checkMemoryLimit(key: string, config: BucketConfig): Promise<RateLimitResult> {
  const now = Date.now();
  const existing = memoryStore.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + config.windowMs;
    memoryStore.set(key, { count: 1, resetAt });
    return { ok: true, remaining: config.max - 1, resetAt };
  }

  const nextCount = existing.count + 1;
  existing.count = nextCount;
  memoryStore.set(key, existing);

  return {
    ok: nextCount <= config.max,
    remaining: Math.max(0, config.max - nextCount),
    resetAt: existing.resetAt,
  };
}

async function checkRedisLimit(
  redis: RedisLike,
  key: string,
  config: BucketConfig
): Promise<RateLimitResult> {
  const now = Date.now();
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.pexpire(key, config.windowMs);
  }

  const ttl = await redis.pttl(key);
  const ttlMs = ttl > 0 ? ttl : config.windowMs;
  const resetAt = now + ttlMs;

  return {
    ok: current <= config.max,
    remaining: Math.max(0, config.max - current),
    resetAt,
  };
}

export async function checkRateLimit(req: NextRequest): Promise<
  RateLimitResult & { bucket: Bucket; limit: number; retryAfter: number }
> {
  // Skip rate limiting in local development
  if (process.env.NODE_ENV === "development") {
    const bucket = getRouteGroup(req.nextUrl.pathname);
    const config = BUCKETS[bucket];
    return { ok: true, remaining: config.max, resetAt: Date.now() + config.windowMs, bucket, limit: config.max, retryAfter: 0 };
  }

  const pathname = req.nextUrl.pathname;
  const bucket = getRouteGroup(pathname);
  const config = BUCKETS[bucket];
  const ip = getClientIpFromNextRequest(req);
  const key = getStoreKey(ip, bucket);

  const redis = await getRedisClient();
  const result = redis
    ? await checkRedisLimit(redis, key, config)
    : await checkMemoryLimit(key, config);

  return {
    ...result,
    bucket,
    limit: config.max,
    retryAfter: retryAfterSeconds(result.resetAt),
  };
}

