import net from "net";

let cachedReachable: boolean | null = null;
let cachedAt = 0;
/** Keep in sync with Payload DB backoff so recovery is not delayed. */
const CACHE_MS = 5_000;

function parseHostPort(databaseUrl: string): { host: string; port: number } {
  try {
    const normalized = databaseUrl.replace(/^postgresql:/i, "http:");
    const url = new URL(normalized);
    return {
      host: url.hostname || "127.0.0.1",
      port: url.port ? Number(url.port) : 5432,
    };
  } catch {
    const match = databaseUrl.match(/@([^/:]+)(?::(\d+))?/);
    return {
      host: match?.[1] ?? "127.0.0.1",
      port: Number(match?.[2] ?? 5432),
    };
  }
}

function probeTcp(host: string, port: number, timeoutMs: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port });
    const done = (ok: boolean) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(ok);
    };
    const timer = setTimeout(() => done(false), timeoutMs);
    socket.once("connect", () => {
      clearTimeout(timer);
      done(true);
    });
    socket.once("error", () => {
      clearTimeout(timer);
      done(false);
    });
  });
}

/**
 * Fast TCP check — avoids calling Payload when Postgres is not listening
 * (prevents Payload's rejectInitializing(undefined) unhandledRejection).
 */
export async function isPostgresReachable(force = false): Promise<boolean> {
  if (process.env.PAYLOAD_SKIP_DB === "1") return false;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl?.trim()) return false;

  if (!force && cachedReachable !== null && Date.now() - cachedAt < CACHE_MS) {
    return cachedReachable;
  }

  const { host, port } = parseHostPort(databaseUrl);
  const reachable = await probeTcp(host, port, 400);
  cachedReachable = reachable;
  cachedAt = Date.now();
  return reachable;
}

export function clearPostgresReachableCache(): void {
  cachedReachable = null;
  cachedAt = 0;
}

export function markPostgresReachable(): void {
  cachedReachable = true;
  cachedAt = Date.now();
}
