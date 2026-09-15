import { APIError } from "payload";
import type { CollectionBeforeOperationHook } from "payload";
import { assertNoSqlInjectionInValue } from "./sqlPatternGuard.ts";

const DANGEROUS_ATTR_RE =
  /\s(on\w+|style|formaction)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;

/** Keys whose string values must not be trimmed/sanitized in ways that break auth or structured data. */
export const SKIP_SANITIZE_KEYS = new Set([
  "password",
  "confirmPassword",
  "_password",
  "hash",
  "salt",
  "resetPasswordToken",
  "resetPasswordExpiration",
  /** Raw JSON-LD; SQL-injection heuristics false-positive on words like "select" / "from" in prose. */
  "customSchema",
  /** Long-form CMS content regularly contains prose that trips broad SQL heuristics. */
  "wordpressHtml",
  "blocksData",
  "content",
]);

const MAX_DEPTH = 24;

export function sanitizeString(input: string): string {
  let s = input.trim();
  s = s.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  s = s.replace(/<\/?script\b[^>]*>/gi, "");
  s = s.replace(DANGEROUS_ATTR_RE, "");
  s = s.replace(/javascript:/gi, "");
  return s;
}

function deepSanitize(
  value: unknown,
  depth: number,
  seen: WeakSet<object>
): unknown {
  if (depth > MAX_DEPTH) return value;
  if (typeof value === "string") return sanitizeString(value);
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value as object)) return value;
  seen.add(value as object);
  if (Array.isArray(value)) {
    return value.map((item) => deepSanitize(item, depth + 1, seen));
  }
  const obj = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (SKIP_SANITIZE_KEYS.has(k)) {
      out[k] = v;
      continue;
    }
    out[k] = deepSanitize(v, depth + 1, seen);
  }
  return out;
}

export function sanitizeStructuredData(data: unknown): unknown {
  if (data === null || typeof data !== "object") return data;
  return deepSanitize(data, 0, new WeakSet());
}

export function assertSafeInput(data: unknown): void {
  try {
    assertNoSqlInjectionInValue(data, SKIP_SANITIZE_KEYS);
  } catch {
    throw new APIError("Invalid input", 400);
  }
}

/**
 * Strips risky strings and rejects obvious SQL-injection patterns on create/update.
 */
export const sanitizeHook: CollectionBeforeOperationHook = ({
  operation,
  args,
  req,
  collection,
}) => {
  if (
    operation !== "create" &&
    operation !== "update" &&
    operation !== "updateByID"
  ) {
    return;
  }
  const opArgs = args as { data?: unknown };
  const data = opArgs.data;
  // Upload collections provide a file buffer or stream in `req.file` or internally process multipart.
  // Deep sanitization corrupts file streams/buffers. Explicitly skip media assets.
  if (collection?.slug === "media") {
    return;
  }
  if (data === null || typeof data !== "object") {
    return;
  }
  assertSafeInput(data);
  opArgs.data = sanitizeStructuredData(data);
};
