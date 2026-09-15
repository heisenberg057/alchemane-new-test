export function normalizeWebhookEvents(events: unknown): string[] {
  if (Array.isArray(events)) {
    return events.map((e) => String(e));
  }
  if (typeof events === "string") {
    return [events];
  }
  if (events && typeof events === "object" && !Array.isArray(events)) {
    return Object.keys(events as Record<string, unknown>);
  }
  return ["form.submitted"];
}

const MASK = "••••••••••••••••";

/**
 * Header keys whose values are considered non-sensitive and can be returned as-is.
 * Any other header value is masked before being sent over the API.
 */
const SAFE_HEADER_KEYS = new Set([
  "content-type",
  "accept",
  "user-agent",
  "x-api-version",
]);

/**
 * Returns a copy of the headers object with secret values masked.
 * This is applied before any API response so raw secrets never leave the server.
 */
function maskHeaderSecrets(
  headers: unknown
): Record<string, string> {
  if (!headers || typeof headers !== "object" || Array.isArray(headers)) {
    return {};
  }
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers as Record<string, unknown>)) {
    const keyLower = k.toLowerCase();
    const value = String(v ?? "");
    // Short or known-safe values pass through; everything else is masked
    if (SAFE_HEADER_KEYS.has(keyLower) || value.length <= 8) {
      result[k] = value;
    } else {
      result[k] = MASK;
    }
  }
  return result;
}

export function serializeWebhook(
  doc: Record<string, unknown>
): Record<string, unknown> {
  return {
    id: String(doc.id),
    name: doc.name,
    url: doc.url,
    method: doc.method ?? "POST",
    events: doc.events,
    // Mask secret values so raw API keys are never returned in API responses.
    // The webhook service reads headers directly from the DB (overrideAccess: true)
    // and bypasses this serializer, so delivery is not affected.
    headers: maskHeaderSecrets(doc.headers),
    payload: doc.payload ?? null,
    isActive: doc.isActive ?? true,
    retryAttempts: doc.retryAttempts ?? 3,
    retryDelay: doc.retryDelay ?? 5000,
    timeout: doc.timeout ?? 30000,
    lastSuccess: doc.lastSuccess ?? null,
    lastFailure: doc.lastFailure ?? null,
    successCount: doc.successCount ?? 0,
    failureCount: doc.failureCount ?? 0,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
