import type { CollectionConfig } from "payload";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { trackingCollectionAccess } from "./access/phase2Access.ts";

export const ConversionEvents: CollectionConfig = {
  slug: "conversion-events",
  admin: {
    useAsTitle: "eventType",
    defaultColumns: ["eventType", "sessionId", "page", "occurredAt"],
    group: "Lead Engine",
  },
  access: trackingCollectionAccess,
  fields: [
    { name: "sessionId", type: "text", required: true },
    { name: "eventType", type: "text", required: true },
    { name: "eventData", type: "json" },
    { name: "page", type: "text", required: true },
    { name: "formType", type: "text" },
    { name: "abTestVariant", type: "text" },
    { name: "occurredAt", type: "date" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
