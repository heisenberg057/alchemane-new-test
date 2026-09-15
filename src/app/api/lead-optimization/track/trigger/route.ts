import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { tryGetPayloadSingleton } from "@/lib/api/getPayload";
import { behavioralTriggerSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(behavioralTriggerSchema, body);
  const payload = await tryGetPayloadSingleton();
  if (!payload) {
    return NextResponse.json(jsonSuccess(undefined, "Trigger tracking skipped"));
  }

  const doc = await payload.create({
    collection: "behavioral-triggers",
    data: {
      sessionId: parsed.sessionId,
      triggerType: parsed.triggerType,
      triggerValue: parsed.triggerValue,
      actionType: parsed.actionType,
      actionContent: parsed.actionContent,
      converted: parsed.converted ?? false,
      page: parsed.page,
      device: parsed.device,
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess({ id: doc.id }, "Trigger tracked"),
    { status: 201 }
  );
}

export const POST = withErrorHandling(handlePOST);
