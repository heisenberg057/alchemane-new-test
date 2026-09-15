import type { CollectionConfig } from "payload";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { trackingCollectionAccess } from "./access/phase2Access.ts";

export const Calculators: CollectionConfig = {
  slug: "calculators",
  admin: {
    useAsTitle: "sessionId",
    defaultColumns: ["type", "leadCaptured", "createdAt"],
    group: "Lead Engine",
  },
  access: trackingCollectionAccess,
  fields: [
    { name: "sessionId", type: "text", required: true },
    { name: "type", type: "text", required: true },
    {
      name: "inputs",
      type: "json",
      required: true,
      admin: { description: "User inputs (JSON)" },
    },
    {
      name: "results",
      type: "json",
      required: true,
      admin: { description: "Calculated results (JSON)" },
    },
    {
      name: "leadCaptured",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "formSubmission",
      type: "relationship",
      relationTo: "form-submissions",
    },
    { name: "device", type: "text" },
    { name: "referrer", type: "text" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
