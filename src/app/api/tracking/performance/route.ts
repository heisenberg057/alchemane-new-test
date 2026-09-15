import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import {
  aggregateAdPerformance,
} from "@/lib/api/trackingAggregates";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");
  const campaignName = url.searchParams.get("campaignName");

  const rows = await aggregateAdPerformance({
    startDate,
    endDate,
    campaignName: campaignName || null,
  });

  return NextResponse.json(jsonSuccess(rows));
}

export const GET = withErrorHandling(handleGET);
