import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { calculatorSaveSchema } from "@/lib/api/phase3Schemas";
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

  const parsed = withValidation(calculatorSaveSchema, body);
  const payload = await getPayloadSingleton();

  const doc = await payload.create({
    collection: "calculators",
    data: {
      sessionId: parsed.sessionId,
      type: parsed.type,
      inputs: parsed.inputs,
      results: parsed.results,
      leadCaptured: parsed.leadCaptured ?? false,
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess(
      { id: doc.id, saved: true },
      "Calculator usage saved successfully"
    )
  );
}

export const POST = withErrorHandling(handlePOST);
