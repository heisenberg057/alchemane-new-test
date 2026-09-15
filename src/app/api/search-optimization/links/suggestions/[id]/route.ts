import { NextResponse } from "next/server";
import { BadRequestError, NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(
  request: Request,
  context: any
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  const postId = Number(id);
  if (!Number.isFinite(postId)) {
    throw new BadRequestError("Invalid post id");
  }

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

  const others = await payload.find({
    collection: "posts",
    limit: 24,
    depth: 0,
    overrideAccess: true,
  });

  const filtered = others.docs.filter((p) => Number(p.id) !== postId).slice(0, 8);

  const suggestions = filtered.map((p) => ({
    postId: p.id,
    slug: (p as { slug?: string }).slug,
    title: (p as { title?: string }).title,
    relevanceScore: 0.42,
    note: "Heuristic stub — replace with embeddings / topic model",
  }));

  return NextResponse.json(jsonSuccess({ suggestions }));
}

export const GET = withErrorHandling(handleGET);
