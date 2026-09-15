import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { optimizePostWithAI } from "@/lib/services/aiSeo.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

/** Generates FAQs via full AI optimization pipeline (same as optimize/:id). */
async function handlePOST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  const { id } = await context.params;
  const result = await optimizePostWithAI(String(id));
  if (!result.success) {
    throw new BadRequestError(result.error || "FAQ generation failed");
  }
  return NextResponse.json(jsonSuccess({ faqs: result.faqs }, "FAQs generated"));
}

export const POST = withErrorHandling(handlePOST);
