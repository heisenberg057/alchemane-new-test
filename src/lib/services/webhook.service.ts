import { getPayloadSingleton } from "@/lib/api/getPayload";
import { logger } from "@/lib/logger";
import type { Payload } from "payload";
import { validateWebhookUrlAsync } from "@/lib/security/ssrf";

export type WebhookTestResult = {
  success: boolean;
  statusCode?: number;
  error?: string;
  durationMs?: number;
};

function parseJson<T>(raw: unknown, fallback: T): T {
  if (raw == null) return fallback;
  if (typeof raw === "object") return raw as T;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function eventsList(events: unknown): string[] {
  const arr = parseJson<string[]>(events, []);
  if (Array.isArray(arr)) {
    return arr.map(String);
  }
  if (typeof events === "string") {
    try {
      const p = JSON.parse(events);
      return Array.isArray(p) ? p.map(String) : [];
    } catch {
      return events.includes(",")
        ? events.split(",").map((s) => s.trim())
        : [events];
    }
  }
  return [];
}

export function webhookSubscribedTo(events: unknown, event: string): boolean {
  return eventsList(events).includes(event);
}

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce((current: unknown, key: string) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function replaceVariablesRecursive(template: unknown, data: unknown): unknown {
  if (typeof template === "string") {
    return template.replace(/\{\{(\w+(\.\w+)*)\}\}/g, (match, path: string) => {
      const value = getNestedValue(data, path);
      return value !== undefined && value !== null ? String(value) : match;
    });
  }
  if (Array.isArray(template)) {
    return template.map((item) => replaceVariablesRecursive(item, data));
  }
  if (typeof template === "object" && template !== null) {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(template)) {
      result[key] = replaceVariablesRecursive(
        (template as Record<string, unknown>)[key],
        data
      );
    }
    return result;
  }
  return template;
}

function formatPayload(
  template: unknown,
  data: unknown
): unknown {
  if (template) {
    return replaceVariablesRecursive(template, data);
  }
  return data;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function sendWithRetry(
  payloadApi: Payload,
  logId: string | number,
  url: string,
  method: string,
  body: unknown,
  headersObj: Record<string, string>,
  timeoutMs: number,
  maxAttempts: number,
  retryDelayMs: number
): Promise<{ success: boolean; statusCode?: number; error?: string; responseBody?: string }> {
  const start = Date.now();
  let lastError = "";

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await payloadApi.update({
        collection: "webhook-logs",
        id: logId,
        data: {
          attempts: attempt,
          status: "retrying",
        },
        overrideAccess: true,
      });

      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), timeoutMs);
      let res: Response;
      try {
        res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "AmericanHairline-Webhook/1.0",
            ...headersObj,
          },
          body: method.toUpperCase() === "GET" ? undefined : JSON.stringify(body),
          signal: ctrl.signal,
        });
      } finally {
        clearTimeout(t);
      }

      const text = await res.text();
      const duration = Date.now() - start;

      if (res.ok) {
        await payloadApi.update({
          collection: "webhook-logs",
          id: logId,
          data: {
            status: "success",
            statusCode: res.status,
            response: { bodySnippet: text.slice(0, 4000) },
            duration,
          },
          overrideAccess: true,
        });
        return {
          success: true,
          statusCode: res.status,
          responseBody: text,
        };
      }

      lastError = `HTTP ${res.status}`;
      await payloadApi.update({
        collection: "webhook-logs",
        id: logId,
        data: {
          errorMessage: lastError,
          statusCode: res.status,
          response: { bodySnippet: text.slice(0, 2000) },
        },
        overrideAccess: true,
      });
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
      await payloadApi.update({
        collection: "webhook-logs",
        id: logId,
        data: {
          errorMessage: lastError,
        },
        overrideAccess: true,
      });
    }

    if (attempt < maxAttempts) {
      await sleep(retryDelayMs * attempt);
    }
  }

  const duration = Date.now() - start;
  await payloadApi.update({
    collection: "webhook-logs",
    id: logId,
    data: {
      status: "failed",
      errorMessage: lastError,
      duration,
    },
    overrideAccess: true,
  });

  return { success: false, error: lastError };
}

type WebhookDoc = Record<string, unknown> & { id: string | number };

async function deliverToWebhookDoc(
  payloadApi: Payload,
  webhook: WebhookDoc,
  event: string,
  data: unknown
): Promise<{ success: boolean; statusCode?: number; error?: string }> {
  const webhookId = webhook.id;
  if (!webhook.isActive) {
    return { success: false, error: "inactive" };
  }

  const headersRaw = parseJson<Record<string, string>>(webhook.headers, {});
  const payloadTemplate = webhook.payload ?? null;
  const outgoing = formatPayload(payloadTemplate, data);
  const method = String(webhook.method || "POST").toUpperCase();
  const timeoutMs = Math.min(Number(webhook.timeout) || 30000, 120000);
  const maxAttempts = Math.max(1, Number(webhook.retryAttempts) || 3);
  const retryDelay = Math.max(100, Number(webhook.retryDelay) || 5000);
  const url = String(webhook.url);

  // SSRF guard: resolve DNS and reject private/internal network targets.
  // This runs at delivery time as a second line of defence — even if the URL
  // passed validation on save, the resolved IP is checked again here so
  // DNS-rebinding attacks are caught at the moment of the outbound request.
  const ssrfError = await validateWebhookUrlAsync(url);
  if (ssrfError) {
    logger.warn("dispatchWebhook blocked by SSRF guard", { url, reason: ssrfError });
    return { success: false, error: `Blocked: ${ssrfError}` };
  }

  // Store the actual outgoing payload (after template substitution) so logs are truthful
  const log = await payloadApi.create({
    collection: "webhook-logs",
    data: {
      webhook: webhookId,
      event,
      payload: (typeof outgoing === "object" && outgoing !== null
        ? outgoing
        : { value: outgoing }) as Record<string, unknown>,
      status: "pending",
      attempts: 0,
    },
    overrideAccess: true,
  });

  const result = await sendWithRetry(
    payloadApi,
    log.id,
    url,
    method,
    outgoing,
    headersRaw,
    timeoutMs,
    maxAttempts,
    retryDelay
  );

  // Read current counters then increment (SQLite adapter does not support { inc } operator).
  const current = (await payloadApi.findByID({
    collection: "webhooks",
    id: webhookId,
    depth: 0,
    overrideAccess: true,
  })) as Record<string, unknown>;

  if (result.success) {
    await payloadApi.update({
      collection: "webhooks",
      id: webhookId,
      data: {
        lastSuccess: new Date().toISOString(),
        successCount: ((current.successCount as number) ?? 0) + 1,
      },
      overrideAccess: true,
    });
  } else {
    await payloadApi.update({
      collection: "webhooks",
      id: webhookId,
      data: {
        lastFailure: new Date().toISOString(),
        failureCount: ((current.failureCount as number) ?? 0) + 1,
      },
      overrideAccess: true,
    });
  }

  return result;
}

export async function dispatchWebhook(
  event: string,
  payloadData: unknown
): Promise<void> {
  const payloadApi = await getPayloadSingleton();
  const res = await payloadApi.find({
    collection: "webhooks",
    where: { isActive: { equals: true } },
    limit: 500,
    depth: 0,
    overrideAccess: true,
  });

  const targets = res.docs.filter((w) =>
    webhookSubscribedTo(w.events, event)
  );

  logger.info("dispatchWebhook", {
    event,
    targetCount: targets.length,
  });

  await Promise.allSettled(
    targets.map((w) =>
      deliverToWebhookDoc(payloadApi, w as WebhookDoc, event, payloadData)
    )
  );
}

export async function testWebhook(webhookId: string): Promise<WebhookTestResult> {
  const payloadApi = await getPayloadSingleton();
  let wh: WebhookDoc;
  try {
    wh = (await payloadApi.findByID({
      collection: "webhooks",
      id: webhookId,
      depth: 0,
      overrideAccess: true,
    })) as WebhookDoc;
  } catch {
    return { success: false, error: "Webhook not found" };
  }

  if (!wh?.id) {
    return { success: false, error: "Webhook not found" };
  }

  const testPayload = {
    test: true,
    message: "This is a test webhook from AmericanHairline",
    timestamp: new Date().toISOString(),
  };

  const started = Date.now();
  const result = await deliverToWebhookDoc(
    payloadApi,
    wh,
    "test",
    testPayload
  );
  return {
    success: result.success,
    statusCode: result.statusCode,
    error: result.error,
    durationMs: Date.now() - started,
  };
}

export async function retryWebhook(logId: string): Promise<void> {
  const payloadApi = await getPayloadSingleton();
  let log: Record<string, unknown>;
  try {
    log = (await payloadApi.findByID({
      collection: "webhook-logs",
      id: logId,
      depth: 1,
      overrideAccess: true,
    })) as Record<string, unknown>;
  } catch {
    throw new Error("Webhook log not found");
  }

  const whRel = log.webhook;
  let webhookId: string | number;
  if (typeof whRel === "number" || typeof whRel === "string") {
    webhookId = whRel;
  } else if (
    whRel &&
    typeof whRel === "object" &&
    "id" in whRel &&
    (typeof (whRel as { id: unknown }).id === "string" ||
      typeof (whRel as { id: unknown }).id === "number")
  ) {
    webhookId = (whRel as { id: string | number }).id;
  } else {
    throw new Error("Log missing webhook");
  }

  let wh: WebhookDoc;
  try {
    wh = (await payloadApi.findByID({
      collection: "webhooks",
      id: webhookId,
      depth: 0,
      overrideAccess: true,
    })) as WebhookDoc;
  } catch {
    throw new Error("Webhook not found");
  }

  const event = String(log.event || "unknown");
  const payloadData = log.payload ?? {};

  await deliverToWebhookDoc(payloadApi, wh, event, payloadData);
}
