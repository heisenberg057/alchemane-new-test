import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { aggregateCampaignList } from "@/lib/api/trackingAggregates";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  const data = await aggregateCampaignList();
  return NextResponse.json(jsonSuccess(data));
}

export const GET = withErrorHandling(handleGET);
