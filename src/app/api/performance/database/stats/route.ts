import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["SUPER_ADMIN"]);
  const payload = await getPayloadSingleton();
  const collections = [
    "posts",
    "pages",
    "media",
    "form-submissions",
    "users",
  ] as const;
  const counts: Record<string, number> = {};
  for (const slug of collections) {
    try {
      const r = await payload.find({
        collection: slug,
        where: {},
        limit: 0,
        depth: 0,
        overrideAccess: true,
      });
      counts[slug] = r.totalDocs;
    } catch {
      counts[slug] = -1;
    }
  }
  return NextResponse.json(jsonSuccess({ collectionCounts: counts }));
}

export const GET = withErrorHandling(handleGET);
