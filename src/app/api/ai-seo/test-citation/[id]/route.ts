import { NextResponse } from "next/server";
import { BadRequestError, NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { testAiCitation } from "@/lib/services/aiSeo.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

type CitationBody = {
  queries?: string[];
  query?: string;
};

async function handlePOST(request: Request, context: any) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  const postId = Number(id);
  if (!Number.isFinite(postId)) {
    throw new BadRequestError("Invalid post id");
  }

  let body: CitationBody = {};
  try {
    body = (await request.json()) as CitationBody;
  } catch {
    body = {};
  }

  const queries: string[] =
    Array.isArray(body.queries) && body.queries.length > 0
      ? body.queries.map(String).slice(0, 8)
      : body.query
        ? [String(body.query)]
        : [
            "What is non-surgical hair replacement?",
            "How long is FUE recovery?",
          ];

  const payload = await getPayloadSingleton();
  try {
    await payload.findByID({
      collection: "posts",
      id: postId,
      depth: 0,
      overrideAccess: true,
    });
  } catch {
    throw new NotFoundError("Post not found");
  }

  const results: unknown[] = [];
  for (const q of queries) {
    try {
      const r = await testAiCitation(String(postId), q);
      results.push({ query: q, ...r });
    } catch (e) {
      results.push({
        query: q,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return NextResponse.json(
    jsonSuccess({ results }, "Citation tests completed")
  );
}

export const POST = withErrorHandling(handlePOST);
