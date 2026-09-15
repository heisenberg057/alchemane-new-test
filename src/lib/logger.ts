type LogMeta = Record<string, unknown>;

const SENSITIVE_KEYS =
  /password|token|secret|authorization|cookie|apikey|api_key/i;

function sanitizeMeta(meta?: LogMeta): LogMeta | undefined {
  if (!meta) return undefined;
  const out: LogMeta = {};
  for (const [k, v] of Object.entries(meta)) {
    if (SENSITIVE_KEYS.test(k)) {
      out[k] = "[redacted]";
      continue;
    }
    if (typeof v === "string" && v.length > 200) {
      out[k] = `${v.slice(0, 80)}…(len ${v.length})`;
      continue;
    }
    out[k] = v;
  }
  return out;
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function baseEntry(
  level: string,
  message: string,
  meta?: LogMeta
): Record<string, unknown> {
  return {
    ts: new Date().toISOString(),
    level,
    message,
    ...(sanitizeMeta(meta) && { meta: sanitizeMeta(meta) }),
  };
}

export const logger = {
  info(message: string, meta?: LogMeta): void {
    const entry = baseEntry("info", message, meta);
    if (isProduction()) {
      console.log(JSON.stringify(entry));
    } else {
      console.log(`[INFO] ${message}`, meta ? sanitizeMeta(meta) : "");
    }
  },

  warn(message: string, meta?: LogMeta): void {
    const entry = baseEntry("warn", message, meta);
    if (isProduction()) {
      console.warn(JSON.stringify(entry));
    } else {
      console.warn(`[WARN] ${message}`, meta ? sanitizeMeta(meta) : "");
    }
  },

  error(message: string, meta?: LogMeta): void {
    const entry = baseEntry("error", message, meta);
    if (isProduction()) {
      console.error(JSON.stringify(entry));
    } else {
      console.error(`[ERROR] ${message}`, meta ? sanitizeMeta(meta) : "");
    }
  },

  debug(message: string, meta?: LogMeta): void {
    if (isProduction()) return;
    console.debug(`[DEBUG] ${message}`, meta ? sanitizeMeta(meta) : "");
  },
};
