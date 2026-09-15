import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const payload = await getPayloadSingleton();

  const allowed = [
    "content",
    "blocksData",
    "wordpressHtml",
    "title",
    "meta",
    "metrics",
    "seoAnalysis",
  ] as const;
  const data: Record<string, unknown> = {};
  for (const k of allowed) {
    if (k in body) data[k] = body[k];
  }

  if (Object.keys(data).length === 0) {
    throw new BadRequestError("No allowed fields to autosave");
  }

  const updated = await payload.update({
    collection: "posts",
    id,
    data,
    overrideAccess: true,
  });

  return NextResponse.json(jsonSuccess(updated, "Autosaved"));
}

export const PATCH = withErrorHandling(handlePATCH);
