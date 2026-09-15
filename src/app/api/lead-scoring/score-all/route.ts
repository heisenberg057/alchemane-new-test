import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { bulkScoreAllLeads } from "@/lib/services/leadScoring.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { scored, failed } = await bulkScoreAllLeads();

  return NextResponse.json(
    jsonSuccess({ scored, failed }, "Bulk scoring complete")
  );
}

export const POST = withErrorHandling(handlePOST);
