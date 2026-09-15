import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { exitIntentTrackSchema } from "@/lib/api/phase3Schemas";
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

  const parsed = withValidation(exitIntentTrackSchema, body);
  const payload = await getPayloadSingleton();

  const doc = await payload.create({
    collection: "exit-intents",
    data: {
      sessionId: parsed.sessionId,
      page: parsed.page,
      timeOnPage: parsed.timeOnPage,
      scrollDepth: parsed.scrollDepth,
      popupType: parsed.popupType,
      popupContent: parsed.popupContent,
      action: parsed.action,
      emailCaptured: parsed.emailCaptured,
      device: parsed.device,
      referrer: parsed.referrer,
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess({ id: doc.id }, "Exit intent recorded"),
    { status: 201 }
  );
}

export const POST = withErrorHandling(handlePOST);
