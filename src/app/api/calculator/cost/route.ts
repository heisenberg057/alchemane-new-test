import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { calculatorCostSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";
import { calculateHairCost } from "@/lib/services/calculatorLogic";

function mapHairLossToSeverity(
  hairLossType?: string,
  stage?: string
): string | undefined {
  const s = `${hairLossType ?? ""} ${stage ?? ""}`.toLowerCase();
  if (s.includes("severe") || s.includes("norwood 6") || s.includes("nw6")) {
    return "severe";
  }
  if (s.includes("moderate") || s.includes("norwood 4") || s.includes("nw4")) {
    return "moderate";
  }
  if (s.includes("mild") || s.includes("early") || s.includes("nw2")) {
    return "mild";
  }
  return undefined;
}

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(calculatorCostSchema, body);
  const severity =
    parsed.severity ??
    mapHairLossToSeverity(parsed.hairLossType, parsed.coverageArea);

  const result = calculateHairCost({
    graftsNeeded: parsed.graftsNeeded,
    severity,
    technique: parsed.technique ?? parsed.systemType,
    location: parsed.location,
  });

  if (!result.success) {
    throw new BadRequestError(result.error);
  }

  const sessionId =
    typeof parsed.sessionId === "string" ? parsed.sessionId : undefined;
  if (sessionId) {
    const payload = await getPayloadSingleton();
    payload
      .create({
        collection: "calculators",
        data: {
          sessionId,
          type: "cost",
          inputs: {
            ...parsed,
            severityResolved: severity,
          },
          results: result.results,
          leadCaptured: false,
        },
        overrideAccess: true,
      })
      .catch((e) => console.error("[calculator/cost] background save", e));
  }

  return NextResponse.json(
    jsonSuccess(result.results, "Calculation successful")
  );
}

export const POST = withErrorHandling(handlePOST);
