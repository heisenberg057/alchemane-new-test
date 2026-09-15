import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { tryGetPayloadSingleton } from "@/lib/api/getPayload";
import { leadOptConversionEventSchema } from "@/lib/api/phase3Schemas";
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

  const parsed = withValidation(leadOptConversionEventSchema, body);
  const payload = await tryGetPayloadSingleton();
  if (!payload) {
    return NextResponse.json(jsonSuccess(undefined, "Conversion tracking skipped"));
  }

  const doc = await payload.create({
    collection: "conversion-events",
    data: {
      sessionId: parsed.sessionId,
      eventType: parsed.eventType,
      eventData: parsed.eventData ?? undefined,
      page: parsed.page,
      formType: parsed.formType,
      abTestVariant: parsed.abTestVariant,
      occurredAt: new Date().toISOString(),
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess({ id: doc.id }, "Conversion event tracked"),
    { status: 201 }
  );
}

export const POST = withErrorHandling(handlePOST);
