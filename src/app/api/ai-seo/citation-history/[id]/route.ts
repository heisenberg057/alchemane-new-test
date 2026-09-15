import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
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
    collection: "ai-citation-tests",
    where: { post: { equals: postId } },
    sort: "-testedAt",
    limit: 100,
    depth: 0,
    overrideAccess: true,
  });

  return NextResponse.json(jsonSuccess(res.docs));
}

export const GET = withErrorHandling(handleGET);
