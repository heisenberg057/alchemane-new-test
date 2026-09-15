import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { getHotLeadsForAdmin } from "@/lib/services/leadScoring.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const limit = Math.min(100, Number(url.searchParams.get("limit")) || 20);
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";

  const thresholdParam = url.searchParams.get("threshold");
  const { leads, meta } = await getHotLeadsForAdmin({
    threshold: thresholdParam !== null ? Number(thresholdParam) : 70,
    page,
    limit,
    search,
    status,
  });

  return NextResponse.json(
    jsonSuccess({ leads, meta }, "Hot leads retrieved successfully")
  );
}

export const GET = withErrorHandling(handleGET);
