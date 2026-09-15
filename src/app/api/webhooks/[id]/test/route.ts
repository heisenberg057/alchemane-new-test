import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api/withAuth";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { testWebhook } from "@/lib/services/webhook.service";

async function handlePOST(request: Request, context: { params: Promise<{ id: string }> }) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  const result = await testWebhook(String(id));

  return NextResponse.json(
    jsonSuccess(
      {
        ok: result.success,
        statusCode: result.statusCode,
        durationMs: result.durationMs,
        error: result.error,
      },
      result.success ? "Test delivery succeeded" : "Test delivery failed"
    )
  );
}

export const POST = withErrorHandling(handlePOST);
