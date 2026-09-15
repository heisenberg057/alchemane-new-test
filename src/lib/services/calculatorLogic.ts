/** Ported from backend calculator.service.js (cost math only; AI estimate is separate). */

export type CostInputs = {
  graftsNeeded?: number;
  severity?: string;
  technique?: string;
  location?: string;
};

export function estimateGraftsFromSeverity(severity: string | undefined): number {
  const estimates: Record<string, number> = {
    mild: 1500,
    moderate: 2500,
    severe: 4000,
  };
  return estimates[severity ?? ""] ?? 2500;
}

export function getLocationMultiplier(location: string | undefined): number {
  const multipliers: Record<string, number> = {
    US: 1.0,
    UK: 0.9,
    Canada: 0.85,
    Australia: 0.9,
    India: 0.3,
    Turkey: 0.25,
    Mexico: 0.4,
  };
  return location && multipliers[location] != null ? multipliers[location]! : 1.0;
}

export function calculateHairCost(inputs: CostInputs): {
  success: true;
  results: {
    estimatedGrafts: number;
    costPerGraft: number;
    estimatedCost: number;
    range: { min: number; max: number };
    technique: string;
    location: string;
    breakdown: { baseCost: number; locationAdjustment: number };
  };
} | {
  success: false;
  error: string;
} {
  try {
    const technique = inputs.technique ?? "FUE";
    const location = inputs.location ?? "US";

    let costPerGraft: number;
    if (technique === "FUE") costPerGraft = 7;
    else if (technique === "FUT") costPerGraft = 4;
    else costPerGraft = 6;

    const estimatedGrafts =
      inputs.graftsNeeded && inputs.graftsNeeded > 0
        ? inputs.graftsNeeded
        : estimateGraftsFromSeverity(inputs.severity);

    const baseCost = estimatedGrafts * costPerGraft;
    const locationMultiplier = getLocationMultiplier(location);
    const adjustedCost = baseCost * locationMultiplier;
    const minCost = Math.floor(adjustedCost * 0.8);
    const maxCost = Math.ceil(adjustedCost * 1.2);

    return {
      success: true,
      results: {
        estimatedGrafts,
        costPerGraft,
        estimatedCost: Math.round(adjustedCost),
        range: { min: minCost, max: maxCost },
        technique,
        location,
        breakdown: {
          baseCost,
          locationAdjustment: adjustedCost - baseCost,
        },
      },
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Calculation failed",
    };
  }
}
