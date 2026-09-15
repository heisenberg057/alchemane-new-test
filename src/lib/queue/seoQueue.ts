import { Queue } from "bullmq";
import Redis from "ioredis";

/** BullMQ queue name for SEO analysis jobs. */
export const SEO_QUEUE_NAME = "seo-analysis";

export const SEO_JOB_ANALYZE_SINGLE = "analyze-single-post";
export const SEO_JOB_ANALYZE_ALL = "analyze-all-posts";

let redisConnection: Redis | null = null;
let seoQueue: Queue | null = null;

/**
 * Shared Redis connection for BullMQ.
 * `maxRetriesPerRequest: null` is required by BullMQ for blocking operations.
 */
export function getRedisConnection(): Redis {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error("REDIS_URL is required for SEO queue");
  }
  if (!redisConnection) {
    redisConnection = new Redis(url, { maxRetriesPerRequest: null });
  }
  return redisConnection;
}

/**
 * Singleton BullMQ queue: "seo-analysis", backed by `process.env.REDIS_URL`.
 */
export function getSeoAnalysisQueue(): Queue {
  if (!seoQueue) {
    seoQueue = new Queue(SEO_QUEUE_NAME, {
      connection: getRedisConnection(),
    });
  }
  return seoQueue;
}
