import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { aiOptimizeBodySchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { optimizePostWithAI } from "@/lib/services/aiSeo.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";

async function handlePOST(request: Request, context: any) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  if (id == null || id === "") {
    throw new BadRequestError("Invalid post id");
  }

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  withValidation(aiOptimizeBodySchema, body);

  const result = await optimizePostWithAI(String(id));
  if (!result.success) {
    throw new BadRequestError(result.error || "Optimization failed");
  }

  return NextResponse.json(
    jsonSuccess(
      {
        score: result.score,
        faqs: result.faqs,
        directAnswers: result.directAnswers,
        takeaways: result.takeaways,
        conversational: result.conversational,
      },
      "AI optimization completed"
    )
  );
}

export const POST = withErrorHandling(handlePOST);
