import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { listSecurityLogsForAdmin } from "@/lib/api/securityAdmin";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const limit = Math.min(100, Number(url.searchParams.get("limit")) || 20);
  const eventType = url.searchParams.get("eventType") || undefined;
  const eventLevel =
    url.searchParams.get("eventLevel") || url.searchParams.get("severity") || undefined;
  const search = url.searchParams.get("search") || undefined;

  const data = await listSecurityLogsForAdmin({
    page,
    limit,
    eventType,
    eventLevel,
    search,
  });

  return NextResponse.json(jsonSuccess(data));
}

export const GET = withErrorHandling(handleGET);
