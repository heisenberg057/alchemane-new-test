import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { analyzeDraftSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { analyzeDraft } from "@/lib/services/seoAnalysis.service";
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

  const parsed = withValidation(analyzeDraftSchema, body) as Record<
    string,
    unknown
  >;
  const content = String(
    parsed.content ?? parsed.html ?? parsed.body ?? ""
  );
  const title = String(
    parsed.title ?? parsed.seoTitle ?? "Draft"
  );
  const focusKeyword = String(
    parsed.keywords ?? parsed.focusKeyword ?? ""
  );

  const draft = await analyzeDraft(content, title, focusKeyword);

  return NextResponse.json(jsonSuccess(draft, "Draft analyzed"));
}

export const POST = withErrorHandling(handlePOST);
