import configPromise from "@payload-config";
import type { Payload } from "payload";
import { getPayload } from "payload";
import {
  clearPostgresReachableCache,
  isPostgresReachable,
  markPostgresReachable,
} from "./postgresReachable";

let cache: Payload | null = null;
let inflight: Promise<PayloadInitResult> | null = null;
/** After a connect failure, avoid re-calling getPayload (Payload rejects `initializing` with `undefined`). */
let dbBackoffUntil = 0;
/** Short backoff so Postgres recovery is picked up quickly after brief outages. */
const DB_BACKOFF_MS = 5_000;

function isPayloadSkipped(): boolean {
  return process.env.PAYLOAD_SKIP_DB === "1";
}

function isDatabaseInBackoff(): boolean {
  return Date.now() < dbBackoffUntil;
}

type PayloadInitResult =
  | { ok: true; payload: Payload }
  | { ok: false; error: Error };

function normalizePayloadInitError(err: unknown): Error {
  if (err instanceof Error && err.message.trim()) return err;
  if (err instanceof AggregateError) {
    const detail =
      err.errors?.map((e) => (e instanceof Error ? e.message : String(e))).join("; ") ||
      err.message ||
      "unknown";
    return new Error(`Payload failed to initialize: ${detail}`, { cause: err });
  }
  return new Error(
    typeof err === "string" && err.trim()
      ? err
      : "Payload failed to initialize (database unavailable)"
  );
}

async function getPayloadInitResult(): Promise<PayloadInitResult> {
  if (cache) return { ok: true, payload: cache };
  if (isPayloadSkipped()) {
    return {
      ok: false,
      error: new Error("Payload disabled (PAYLOAD_SKIP_DB=1)"),
    };
  }
  if (isDatabaseInBackoff()) {
    return {
      ok: false,
      error: new Error("Database unavailable — retrying shortly"),
    };
  }
  if (!(await isPostgresReachable())) {
    dbBackoffUntil = Date.now() + DB_BACKOFF_MS;
    return {
      ok: false,
      error: new Error("Postgres is not reachable (start with: npm run db:up)"),
    };
  }
  if (!inflight) {
    inflight = getPayload({ config: configPromise })
      .then((p) => {
        cache = p;
        inflight = null;
        markPostgresReachable();
        return { ok: true as const, payload: p };
      })
      .catch((err) => {
        inflight = null;
        cache = null;
        dbBackoffUntil = Date.now() + DB_BACKOFF_MS;
        return { ok: false as const, error: normalizePayloadInitError(err) };
      });
  }
  return inflight;
}

/**
 * Singleton Payload instance for App Router API handlers (lazy, deduped).
 */
export async function getPayloadSingleton(): Promise<Payload> {
  const result = await getPayloadInitResult();
  if (!result.ok) throw result.error;
  return result.payload;
}

/** Like getPayloadSingleton but never throws — for optional CMS reads (e.g. home page). */
export async function tryGetPayloadSingleton(): Promise<Payload | null> {
  const result = await getPayloadInitResult();
  return result.ok ? result.payload : null;
}

/** Clear cached instance after a failed connect (e.g. Postgres not running). */
export function resetPayloadSingleton(): void {
  cache = null;
  inflight = null;
  dbBackoffUntil = Date.now() + DB_BACKOFF_MS;
  clearPostgresReachableCache();
}
