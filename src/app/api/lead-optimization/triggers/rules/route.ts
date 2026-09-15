import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { triggerRulesBodySchema } from "@/lib/api/phase3Schemas";
import { getTriggerRulesForBehavior } from "@/lib/api/triggerRules";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";

async function handlePOST(request: Request) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") ?? "/";
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const behavior = withValidation(triggerRulesBodySchema, body);
  const rules = getTriggerRulesForBehavior(page, behavior);

  return NextResponse.json(
    jsonSuccess(rules, "Trigger rules retrieved")
  );
}

export const POST = withErrorHandling(handlePOST);
