import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";
import { estimateGraftsRequestSchema } from "@/lib/api/phase3Schemas";

/**
 * Stub: replaces OpenRouter AI graft estimation. Returns deterministic fallback.
 */
function stubEstimate(input: {
  description?: string;
  hairLossStage?: string;
  area?: string;
}): Record<string, unknown> {
  const text = `${input.description ?? ""} ${input.hairLossStage ?? ""} ${
    input.area ?? ""
  }`.toLowerCase();
  let norwood = "4";
  let grafts = 2500;
  if (text.includes("severe") || text.includes("nw6") || text.includes("vertex")) {
    norwood = "6";
    grafts = 4000;
  } else if (text.includes("mild") || text.includes("receding") || text.includes("nw2")) {
    norwood = "3";
    grafts = 1800;
  }
  const min = Math.round(grafts * 0.85);
  const max = Math.round(grafts * 1.15);
  return {
    estimatedGrafts: grafts,
    range: { min, max },
    norwood,
    confidence: 0.45,
    recommendation:
      "Stub estimate — connect AI (Phase 5+) for model-based graft analysis.",
    inputsEcho: {
      hasDescription: Boolean(input.description?.length),
      hairLossStage: input.hairLossStage,
      area: input.area,
    },
  };
}

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(estimateGraftsRequestSchema, body);
  const estimate = stubEstimate({
    description: parsed.description,
    hairLossStage: parsed.hairLossStage,
    area: parsed.area,
  });

  return NextResponse.json(jsonSuccess(estimate, "Estimation successful"));
}

export const POST = withErrorHandling(handlePOST);
