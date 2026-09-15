import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { webhookCreateSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { normalizeWebhookEvents, serializeWebhook } from "@/lib/api/webhooksHelpers";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";
import { validateWebhookUrlAsync } from "@/lib/security/ssrf";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 200);
  const page = Math.max(Number(url.searchParams.get("page")) || 1, 1);

  const payload = await getPayloadSingleton();
  const res = await payload.find({
    collection: "webhooks",
    limit,
    page,
    sort: "-updatedAt",
    depth: 0,
    overrideAccess: true,
  });

  const webhooks = res.docs.map((d) => serializeWebhook(d as Record<string, unknown>));

  return NextResponse.json(
    jsonSuccess({
      webhooks,
      totalDocs: res.totalDocs,
      page: res.page,
      totalPages: res.totalPages,
    })
  );
}

async function handlePOST(request: Request) {
  const user = await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(webhookCreateSchema, body);

  const ssrfError = await validateWebhookUrlAsync(parsed.url);
  if (ssrfError) {
    throw new BadRequestError(`Invalid webhook URL: ${ssrfError}`);
  }

  const events = normalizeWebhookEvents(parsed.events);

  const payload = await getPayloadSingleton();
  const doc = await payload.create({
    collection: "webhooks",
    data: {
      name: parsed.name,
      url: parsed.url,
      method: parsed.method ?? "POST",
      events,
      headers: parsed.headers ?? {},
      payload: parsed.payload ?? undefined,
      isActive: parsed.isActive ?? true,
      retryAttempts: parsed.retryAttempts ?? 3,
      retryDelay: parsed.retryDelay ?? 5000,
      timeout: parsed.timeout ?? 30000,
      createdBy: user.id,
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess(serializeWebhook(doc as Record<string, unknown>), "Webhook created"),
    { status: 201 }
  );
}

export const GET = withErrorHandling(handleGET);
export const POST = withErrorHandling(handlePOST);
