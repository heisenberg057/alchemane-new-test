import { NextResponse } from "next/server";
import { BadRequestError, NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { buildArticleJsonLd } from "@/lib/api/seoHelpers";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(
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
  let post: {
    id: string | number;
    slug?: string;
    title?: string;
    meta?: { description?: string };
  };
  try {
    post = (await payload.findByID({
      collection: "posts",
      id: postId,
      depth: 0,
      overrideAccess: true,
    })) as typeof post;
  } catch {
    throw new NotFoundError("Post not found");
  }

  if (!post?.id) {
    throw new NotFoundError("Post not found");
  }

  const schema = buildArticleJsonLd({
    slug: String(post.slug ?? postId),
    title: post.title,
    description: post.meta?.description,
  });

  await payload.update({
    collection: "posts",
    id: postId,
    data: {
      structuredData: {
        schemaType: "Custom" as const,
        customSchema: schema,
      },
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess({ schema, savedToPost: true }, "Schema generated (stub Article)")
  );
}

export const POST = withErrorHandling(handlePOST);
