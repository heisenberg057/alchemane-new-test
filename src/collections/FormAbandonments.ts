import type { CollectionConfig } from "payload";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { trackingCollectionAccess } from "./access/phase2Access.ts";

export const FormAbandonments: CollectionConfig = {
  slug: "form-abandonments",
  admin: {
    useAsTitle: "sessionId",
    defaultColumns: ["formType", "email", "recovered", "createdAt"],
    group: "Lead Engine",
  },
  access: trackingCollectionAccess,
  fields: [
    { name: "sessionId", type: "text", required: true, unique: true },
    { name: "formType", type: "text", required: true },
    { name: "currentStep", type: "number" },
    { name: "completedSteps", type: "number" },
    { name: "email", type: "email" },
    { name: "name", type: "text" },
    { name: "phone", type: "text" },
    { name: "lastField", type: "text" },
    { name: "timeSpent", type: "number" },
    { name: "device", type: "text" },
    { name: "browser", type: "text" },
    { name: "country", type: "text" },
    { name: "city", type: "text" },
    { name: "campaignName", type: "text" },
    { name: "adSetName", type: "text" },
    { name: "utmSource", type: "text" },
    { name: "utmMedium", type: "text" },
    {
      name: "recoveryEmailSent",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "recovered",
      type: "checkbox",
      defaultValue: false,
    },
    { name: "recoveredAt", type: "date" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
