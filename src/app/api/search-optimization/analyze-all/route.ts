import { NextResponse } from "next/server";
import { jsonSuccess, jsonError } from "@/lib/api/response";
import {
  getSeoAnalysisQueue,
  SEO_JOB_ANALYZE_ALL,
} from "@/lib/queue/seoQueue";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);

  // Verify Redis is available before telling the client it's queued
  let queue;
  try {
    queue = getSeoAnalysisQueue();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Queue service unavailable";
    return NextResponse.json(jsonError(msg, 503), { status: 503 });
  }

  await queue.add(SEO_JOB_ANALYZE_ALL, {});
  return NextResponse.json(
    jsonSuccess(
      undefined,
      "Analysis queued. Jobs are running in the background."
    )
  );
}

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const queue = getSeoAnalysisQueue();
  const counts = await queue.getJobCounts(
    "waiting",
    "active",
    "completed",
    "failed"
  );
  return NextResponse.json(
    jsonSuccess({
      waiting: counts.waiting ?? 0,
      active: counts.active ?? 0,
      completed: counts.completed ?? 0,
      failed: counts.failed ?? 0,
    })
  );
}

export const POST = withErrorHandling(handlePOST);
export const GET = withErrorHandling(handleGET);
