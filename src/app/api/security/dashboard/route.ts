import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { getSecurityDashboardStats } from "@/lib/api/securityAdmin";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const url = new URL(request.url);
  const days = Math.min(90, Math.max(1, Number(url.searchParams.get("days")) || 7));

  const stats = await getSecurityDashboardStats(days);
  return NextResponse.json(jsonSuccess(stats));
}

export const GET = withErrorHandling(handleGET);
