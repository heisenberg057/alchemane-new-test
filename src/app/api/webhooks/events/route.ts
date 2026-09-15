import { NextResponse } from "next/server";
import { WEBHOOK_EVENT_CATALOG } from "@/lib/api/webhookConstants";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  return NextResponse.json(jsonSuccess(WEBHOOK_EVENT_CATALOG));
}

export const GET = withErrorHandling(handleGET);
