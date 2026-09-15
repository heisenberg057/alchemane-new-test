import { Worker } from "bullmq";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { logger } from "@/lib/logger";
import { analyzePost } from "@/lib/services/seoAnalysis.service";
import {
  getRedisConnection,
  getSeoAnalysisQueue,
  SEO_JOB_ANALYZE_ALL,
  SEO_JOB_ANALYZE_SINGLE,
  SEO_QUEUE_NAME,
} from "./seoQueue";

/** Redis key where the worker writes a Unix-ms timestamp to prove it is alive */
export const SEO_WORKER_HEARTBEAT_KEY = "seo-worker:heartbeat";
/** Heartbeat TTL in seconds — if missed for this long the health route marks worker as stopped */
export const SEO_WORKER_HEARTBEAT_TTL_S = 30;
/** How often the worker refreshes the heartbeat (ms) */
const HEARTBEAT_INTERVAL_MS = 10_000;

let worker: Worker | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

type AnalyzeSingleData = { postId?: string };

/**
 * Starts the BullMQ worker for `SEO_QUEUE_NAME` if not already running.
 * Safe to call multiple times; returns the existing worker instance.
 */
export function startSeoWorker(): Worker {
  if (worker) {
    return worker;
  }

  worker = new Worker(
    SEO_QUEUE_NAME,
    async (job) => {
      if (job.name === SEO_JOB_ANALYZE_SINGLE) {
        const postId = String((job.data as AnalyzeSingleData).postId ?? "");
        if (!postId) {
          throw new Error("analyze-single-post requires postId");
        }
        await analyzePost(postId);
        return { ok: true, postId };
      }

      if (job.name === SEO_JOB_ANALYZE_ALL) {
        const queue = getSeoAnalysisQueue();
        const payload = await getPayloadSingleton();
        let page = 1;
        let enqueued = 0;

        for (;;) {
          const batch = await payload.find({
            collection: "posts",
            where: { _status: { equals: "published" } },
            limit: 20,
            page,
            depth: 0,
            overrideAccess: true,
          });
          if (!batch.docs.length) break;

          await queue.addBulk(
            batch.docs.map((p) => ({
              name: SEO_JOB_ANALYZE_SINGLE,
              data: { postId: String(p.id) },
              opts: {
                jobId: `seo-analyze-${p.id}`,
              },
            }))
          );
          enqueued += batch.docs.length;

          if (!batch.hasNextPage) break;
          page++;
        }

        return { enqueued };
      }

      throw new Error(`Unknown SEO job name: ${job.name}`);
    },
    { connection: getRedisConnection() }
  );

  worker.on("failed", (job, err) => {
    logger.error("SEO queue job failed", {
      jobId: job?.id,
      name: job?.name,
      error: err instanceof Error ? err.message : String(err),
    });
  });

  // Write an initial heartbeat immediately, then refresh on an interval
  const writeHeartbeat = () => {
    try {
      const redis = getRedisConnection();
      redis
        .set(SEO_WORKER_HEARTBEAT_KEY, Date.now().toString(), "EX", SEO_WORKER_HEARTBEAT_TTL_S)
        .catch((e) => logger.warn("SEO worker heartbeat write failed", { error: String(e) }));
    } catch {
      // Redis may not be available yet on first tick — non-fatal
    }
  };

  writeHeartbeat();
  if (heartbeatTimer) clearInterval(heartbeatTimer);
  heartbeatTimer = setInterval(writeHeartbeat, HEARTBEAT_INTERVAL_MS);

  return worker;
}
