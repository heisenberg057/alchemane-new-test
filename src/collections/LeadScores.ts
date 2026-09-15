import type { CollectionConfig } from "payload";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { trackingCollectionAccess } from "./access/phase2Access.ts";

export const LeadScores: CollectionConfig = {
  slug: "lead-scores",
  admin: {
    useAsTitle: "category",
    defaultColumns: ["category", "totalScore", "priority", "updatedAt"],
    group: "Lead Engine",
  },
  access: trackingCollectionAccess,
  fields: [
    {
      name: "formSubmission",
      type: "relationship",
      relationTo: "form-submissions",
      required: true,
      unique: true,
    },
    { name: "behaviorScore", type: "number", required: true },
    { name: "intentScore", type: "number", required: true },
    { name: "qualityScore", type: "number", required: true },
    { name: "sourceScore", type: "number", required: true },
    { name: "totalScore", type: "number", required: true },
    { name: "category", type: "text", required: true },
    {
      name: "factors",
      type: "json",
      admin: { description: "Detailed breakdown (JSON)" },
    },
    { name: "priority", type: "number", required: true },
    { name: "calculatedAt", type: "date" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
