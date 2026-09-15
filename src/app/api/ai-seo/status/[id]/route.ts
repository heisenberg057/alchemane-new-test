import { NextResponse } from "next/server";
import { NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  const { id } = await context.params;
  const payload = await getPayloadSingleton();
  const post = (await payload.findByID({
    collection: "posts",
    id,
    depth: 0,
    overrideAccess: true,
  })) as Record<string, unknown> | null;

  if (!post?.id) {
    throw new NotFoundError("Post not found");
  }

  const ai = post.aiOptimization as Record<string, unknown> | undefined;
  return NextResponse.json(
    jsonSuccess({
      postId: post.id,
      lastOptimizedAt: ai?.lastOptimizedAt,
      score: ai?.score,
      hasFaqs: Boolean(ai?.faqs),
    })
  );
}

export const GET = withErrorHandling(handleGET);
