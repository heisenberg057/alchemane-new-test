import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { internalLinkCreateSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";

async function handlePOST(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(internalLinkCreateSchema, body);
  const payload = await getPayloadSingleton();

  const doc = await payload.create({
    collection: "internal-links",
    data: {
      fromPost: parsed.fromPost,
      toPost: parsed.toPost,
      anchorText: parsed.anchorText,
      position: parsed.position,
      relevanceScore: parsed.relevanceScore,
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess(doc, "Internal link created"),
    { status: 201 }
  );
}

export const POST = withErrorHandling(handlePOST);
