import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { retryWebhook } from "@/lib/services/webhook.service";

async function handlePOST(request: Request, context: { params: Promise<{ id: string }> }) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  await retryWebhook(String(id));
  return NextResponse.json(jsonSuccess(undefined, "Retry initiated"));
}

export const POST = withErrorHandling(handlePOST);
