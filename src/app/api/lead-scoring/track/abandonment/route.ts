import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { tryGetPayloadSingleton } from "@/lib/api/getPayload";
import { formAbandonmentSchema } from "@/lib/api/phase3Schemas";
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

  const parsed = withValidation(formAbandonmentSchema, body);
  const payload = await tryGetPayloadSingleton();
  if (!payload) {
    return NextResponse.json(jsonSuccess(undefined, "Abandonment tracking skipped"));
  }

  const existing = await payload.find({
    collection: "form-abandonments",
    where: { sessionId: { equals: parsed.sessionId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const data = {
    sessionId: parsed.sessionId,
    formType: parsed.formType,
    currentStep: parsed.currentStep,
    completedSteps: parsed.completedSteps,
    email: parsed.email,
    name: parsed.name,
    phone: parsed.phone,
    lastField: parsed.lastField,
    timeSpent: parsed.timeSpent,
    device: parsed.device,
    browser: parsed.browser,
    country: parsed.country,
    city: parsed.city,
    campaignName: parsed.campaignName,
    adSetName: parsed.adSetName,
    utmSource: parsed.utmSource,
    utmMedium: parsed.utmMedium,
  };

  if (existing.docs[0]) {
    await payload.update({
      collection: "form-abandonments",
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "form-abandonments",
      data,
      overrideAccess: true,
    });
  }

  return NextResponse.json(jsonSuccess(undefined, "Abandonment tracked"));
}

export const POST = withErrorHandling(handlePOST);
