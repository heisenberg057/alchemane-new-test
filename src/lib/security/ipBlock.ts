import type { NextRequest } from "next/server";
import { getClientIpFromNextRequest } from "./rateLimit.ts";

let redisPromise: Promise<import("ioredis").default | null> | null = null;

async function getRedis(): Promise<import("ioredis").default | null> {
  if (!process.env.REDIS_URL) {
    return null;
  }
  if (!redisPromise) {
    redisPromise = (async () => {
      try {
        const { default: Redis } = await import("ioredis");
        return new Redis(process.env.REDIS_URL!);
      } catch {
        return null;
      }
    })();
  }
  return redisPromise;
}

function blockedFromEnv(ip: string): boolean {
  const raw = process.env.BLOCKED_IPS;
  if (!raw) return false;
  const list = raw.split(",").map((s) => s.trim()).filter(Boolean);
  return list.includes(ip);
}

/** Redis key used for middleware checks. TTL set from BlockedIPs sync hooks when applicable. */
export function ipBlockRedisKey(ip: string): string {
  return `ipblock:${ip}`;
}

export async function isIpBlocked(ip: string): Promise<boolean> {
  if (ip === "unknown" || !ip) return false;
  if (blockedFromEnv(ip)) return true;
  const redis = await getRedis();
  if (!redis) return false;
  const hit = await redis.get(ipBlockRedisKey(ip));
  return hit != null && hit !== "";
}

export async function isIpBlockedForRequest(req: NextRequest): Promise<boolean> {
  return isIpBlocked(getClientIpFromNextRequest(req));
}

/** Called from BlockedIPs hooks when Redis is configured. */
export async function persistIpBlockInRedis(
  ip: string,
  blockedUntil: string | Date | null | undefined
): Promise<void> {
  const redis = await getRedis();
  if (!redis || !ip) return;
  const key = ipBlockRedisKey(ip.trim());
  if (!blockedUntil) {
    await redis.set(key, "1");
    return;
  }
  const until = new Date(blockedUntil).getTime();
  const now = Date.now();
  if (Number.isNaN(until) || until <= now) {
    await redis.del(key);
    return;
  }
  const ttlSec = Math.max(1, Math.ceil((until - now) / 1000));
  await redis.set(key, "1", "EX", ttlSec);
}

export async function removeIpBlockFromRedis(ip: string): Promise<void> {
  const redis = await getRedis();
  if (!redis || !ip) return;
  await redis.del(ipBlockRedisKey(ip.trim()));
}
