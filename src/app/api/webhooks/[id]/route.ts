import { NextResponse } from "next/server";
import { BadRequestError, NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { webhookUpdateSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import {
  normalizeWebhookEvents,
  serializeWebhook,
} from "@/lib/api/webhooksHelpers";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";
import { validateWebhookUrlAsync } from "@/lib/security/ssrf";
import { decryptHeaders } from "@/lib/security/headerEncryption";

/** The sentinel value the UI sends for masked header values. */
const MASK_SENTINEL = "••••••••••••••••";

/**
 * Merges incoming header updates with existing DB headers, preserving existing
 * values for any key whose incoming value is the mask sentinel.
 *
 * This prevents the UI from accidentally overwriting real secrets with mask tokens
 * when an admin saves a webhook without revealing or changing a header secret.
 *
 * `existingRaw` is the raw (encrypted or plain) value from the DB.
 * `incoming` is the headers object sent by the client (may contain mask sentinels).
 */
function mergeHeaders(
  existingRaw: unknown,
  incoming: Record<string, unknown>
): Record<string, unknown> {
  // Decrypt the stored value to get the real plaintext keys/values
  const existingPlain = decryptHeaders(existingRaw);
  const merged: Record<string, unknown> = { ...incoming };

  for (const [key, value] of Object.entries(incoming)) {
    if (value === MASK_SENTINEL) {
      // Client did not change this key — restore the real value from DB
      if (key in existingPlain) {
        merged[key] = existingPlain[key];
      } else {
        // Key was masked but doesn't exist in DB (shouldn't happen, defensive)
        delete merged[key];
      }
    }
  }

  return merged;
}

async function handleGET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  const payload = await getPayloadSingleton();

  let doc: Record<string, unknown>;
  try {
    doc = (await payload.findByID({
      collection: "webhooks",
      id,
      depth: 0,
      overrideAccess: true,
    })) as Record<string, unknown>;
  } catch {
    throw new NotFoundError("Webhook not found");
  }

  if (!doc?.id) {
    throw new NotFoundError("Webhook not found");
  }

  return NextResponse.json(jsonSuccess(serializeWebhook(doc)));
}

async function handlePUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(webhookUpdateSchema, body);

  if (parsed.url !== undefined) {
    const ssrfError = await validateWebhookUrlAsync(parsed.url);
    if (ssrfError) {
      throw new BadRequestError(`Invalid webhook URL: ${ssrfError}`);
    }
  }

  const payload = await getPayloadSingleton();

  let existing: Record<string, unknown>;
  try {
    existing = (await payload.findByID({
      collection: "webhooks",
      id,
      depth: 0,
      overrideAccess: true,
    })) as Record<string, unknown>;
  } catch {
    throw new NotFoundError("Webhook not found");
  }

  if (!existing?.id) {
    throw new NotFoundError("Webhook not found");
  }

  const data: Record<string, unknown> = {};
  if (parsed.name !== undefined) data.name = parsed.name;
  if (parsed.url !== undefined) data.url = parsed.url;
  if (parsed.method !== undefined) data.method = parsed.method;
  if (parsed.events !== undefined) {
    data.events = normalizeWebhookEvents(parsed.events);
  }
  if (parsed.headers !== undefined) {
    // Merge incoming headers with existing DB values, replacing mask sentinels
    // with the real stored values so secrets are never overwritten with '••••' tokens.
    data.headers = mergeHeaders(existing.headers, parsed.headers as Record<string, unknown>);
  }
  if (parsed.payload !== undefined) data.payload = parsed.payload;
  if (parsed.isActive !== undefined) data.isActive = parsed.isActive;
  if (parsed.retryAttempts !== undefined) data.retryAttempts = parsed.retryAttempts;
  if (parsed.retryDelay !== undefined) data.retryDelay = parsed.retryDelay;
  if (parsed.timeout !== undefined) data.timeout = parsed.timeout;

  const updated = await payload.update({
    collection: "webhooks",
    id,
    data,
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess(serializeWebhook(updated as Record<string, unknown>), "Webhook updated")
  );
}

async function handleDELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  const payload = await getPayloadSingleton();

  try {
    await payload.delete({
      collection: "webhooks",
      id,
      overrideAccess: true,
    });
  } catch {
    throw new NotFoundError("Webhook not found");
  }

  return NextResponse.json(jsonSuccess(undefined, "Webhook deleted"));
}

export const GET = withErrorHandling(handleGET);
export const PUT = withErrorHandling(handlePUT);
export const DELETE = withErrorHandling(handleDELETE);
