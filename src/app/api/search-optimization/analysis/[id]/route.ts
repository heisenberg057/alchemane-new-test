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
  const res = await payload.find({
    collection: "seo-analyses",
    where: { post: { equals: postId } },
    sort: "-analyzedAt",
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  if (!res.docs[0]) {
    throw new NotFoundError("No SEO analysis for this post");
  }

  return NextResponse.json(jsonSuccess(res.docs[0]));
}

export const GET = withErrorHandling(handleGET);
