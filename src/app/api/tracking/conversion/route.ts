import { NextResponse } from "next/server";
import {
  BadRequestError,
} from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";
import { conversionSchema } from "@/lib/security/validation";

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(conversionSchema, body);
  const payload = await getPayloadSingleton();

  const found = await payload.find({
    collection: "ad-clicks",
    where: { sessionId: { equals: parsed.sessionId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const adClickDoc = found.docs[0];
  if (!adClickDoc) {
    return NextResponse.json(
      jsonSuccess(undefined, "No ad click session found for conversion tracking")
    );
  }

  const conversionValue = parsed.conversionValue ?? 0;

  await payload.update({
    collection: "ad-clicks",
    id: adClickDoc.id,
    data: {
      converted: true,
      conversionType: parsed.conversionType,
      conversionValue,
    },
    overrideAccess: true,
  });

  await payload.create({
    collection: "ad-conversions",
    data: {
      adClick: adClickDoc.id,
      conversionType: parsed.conversionType,
      conversionValue,
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess(undefined, "Conversion tracked successfully")
  );
}

export const POST = withErrorHandling(handlePOST);
