import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const payload = await getPayloadSingleton();

  const [tests, posts] = await Promise.all([
    payload.find({
      collection: "ai-citation-tests",
      limit: 1,
      overrideAccess: true,
    }),
    payload.find({
      collection: "posts",
      limit: 1,
      overrideAccess: true,
    }),
  ]);

  const cited = await payload.find({
    collection: "ai-citation-tests",
    where: { cited: { equals: true } },
    limit: 1,
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess(
      {
        totalCitationTests: tests.totalDocs,
        citedCount: cited.totalDocs,
        totalPosts: posts.totalDocs,
        visibilityScore: tests.totalDocs
          ? Math.min(
              100,
              Math.round((cited.totalDocs / tests.totalDocs) * 100)
            )
          : 0,
        note: "In-memory style aggregates from Payload counts (stub visibility score).",
      },
      "AI SEO dashboard"
    )
  );
}

export const GET = withErrorHandling(handleGET);
