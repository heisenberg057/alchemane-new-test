import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { generateMetaDescription } from "@/lib/services/aiSeo.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  let body: {
    content?: string;
    title?: string;
    postId?: string;
    pageId?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    throw new BadRequestError("Invalid JSON");
  }
  const titlePart = body.title?.trim() || "";
  const contentPart = body.content?.trim() || "";
  const merged = [titlePart, contentPart].filter(Boolean).join("\n\n").trim();
  if (!merged) {
    throw new BadRequestError("content is required");
  }
  const text = await generateMetaDescription(merged);
  return NextResponse.json(jsonSuccess({ metaDescription: text }));
}

export const POST = withErrorHandling(handlePOST);
