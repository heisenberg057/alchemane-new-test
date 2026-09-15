import { NextResponse } from "next/server";
import {
  aggregateAnalyticsOverview,
  buildAnalyticsOverviewWhere,
  type OverviewDoc,
} from "@/lib/api/analyticsOverview";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { cacheGet, cacheSet } from "@/lib/services/cache.service";

const OVERVIEW_FETCH_LIMIT = 50_000;
const CACHE_TTL_SEC = 60;

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);

  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  const cacheKey = `analytics:overview:${startDate ?? "null"}:${endDate ?? "null"}`;
  const cached = await cacheGet<ReturnType<typeof aggregateAnalyticsOverview>>(
    cacheKey
  );
  if (cached) {
    return NextResponse.json(jsonSuccess(cached, "Success"));
  }

  const payload = await getPayloadSingleton();
  const where = buildAnalyticsOverviewWhere(startDate, endDate);

  const { docs } = await payload.find({
    collection: "analytics",
    where,
    limit: OVERVIEW_FETCH_LIMIT,
    depth: 0,
    overrideAccess: true,
  });

  const rows: OverviewDoc[] = docs.map((d) => ({
    pageUrl: typeof d.pageUrl === "string" ? d.pageUrl : null,
    referrer: typeof d.referrer === "string" ? d.referrer : null,
    ipAddress: typeof d.ipAddress === "string" ? d.ipAddress : null,
    createdAt:
      typeof d.createdAt === "string" ? d.createdAt : undefined,
  }));

  const overview = aggregateAnalyticsOverview(rows);

  const hotLeadsAgg = await payload.find({
    collection: "lead-scores",
    where: { category: { equals: "hot" } },
    limit: 1,
    overrideAccess: true,
  });

  const finalResult = {
    ...overview,
    hotLeads: hotLeadsAgg.totalDocs,
  };

  await cacheSet(cacheKey, finalResult, CACHE_TTL_SEC);

  return NextResponse.json(
    jsonSuccess(finalResult, "Success")
  );
}

export const GET = withErrorHandling(handleGET);
