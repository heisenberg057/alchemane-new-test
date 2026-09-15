import { logger } from "@/lib/logger";
import type { Redis } from "ioredis";

type MemEntry = { value: string; expiresAt: number };

const memoryStore = new Map<string, MemEntry>();

let redisPromise: Promise<Redis | null> | null = null;

async function getRedis(): Promise<Redis | null> {
  const url = process.env.REDIS_URL?.trim();
  if (!url) return null;
  if (!redisPromise) {
    redisPromise = (async () => {
      try {
        const { default: IORedis } = await import("ioredis");
        return new IORedis(url);
      } catch (e) {
        logger.error("Redis init failed", {
          error: e instanceof Error ? e.message : String(e),
        });
        return null;
      }
    })();
  }
  return redisPromise;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = await getRedis();
  if (redis) {
    try {
      const raw = await redis.get(key);
      if (raw == null) return null;
      return JSON.parse(raw) as T;
    } catch (e) {
      logger.warn("cacheGet redis error", {
        error: e instanceof Error ? e.message : String(e),
      });
      return null;
    }
  }

  const entry = memoryStore.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    memoryStore.delete(key);
    return null;
  }
  try {
    return JSON.parse(entry.value) as T;
  } catch {
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds?: number
): Promise<void> {
  const payload = JSON.stringify(value);
  const redis = await getRedis();
  if (redis) {
    try {
      if (ttlSeconds && ttlSeconds > 0) {
        await redis.set(key, payload, "EX", ttlSeconds);
      } else {
        await redis.set(key, payload);
      }
    } catch (e) {
      logger.warn("cacheSet redis error", {
        error: e instanceof Error ? e.message : String(e),
      });
    }
    return;
  }

  const expiresAt =
    ttlSeconds && ttlSeconds > 0
      ? Date.now() + ttlSeconds * 1000
      : Number.MAX_SAFE_INTEGER;
  memoryStore.set(key, { value: payload, expiresAt });
}

export async function cacheDel(key: string): Promise<void> {
  const redis = await getRedis();
  if (redis) {
    try {
      await redis.del(key);
    } catch {
      /* ignore */
    }
    return;
  }
  memoryStore.delete(key);
}

export async function cacheFlush(pattern?: string): Promise<void> {
  const redis = await getRedis();
  if (redis) {
    try {
      if (pattern) {
        const keys = await redis.keys(pattern);
        if (keys.length) await redis.del(...keys);
      } else {
        await redis.flushdb();
      }
    } catch (e) {
      logger.warn("cacheFlush redis error", {
        error: e instanceof Error ? e.message : String(e),
      });
    }
    return;
  }

  if (!pattern) {
    memoryStore.clear();
    return;
  }
  const prefix = pattern.replace(/\*$/, "");
  for (const k of Array.from(memoryStore.keys())) {
    if (k.startsWith(prefix)) memoryStore.delete(k);
  }
}
