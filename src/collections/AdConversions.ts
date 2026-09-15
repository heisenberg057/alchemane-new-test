import type { CollectionConfig } from "payload";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { trackingCollectionAccess } from "./access/phase2Access.ts";

export const AdConversions: CollectionConfig = {
  slug: "ad-conversions",
  admin: {
    useAsTitle: "conversionType",
    defaultColumns: ["conversionType", "adClick", "createdAt"],
    group: "Analytics & Tracking",
  },
  access: trackingCollectionAccess,
  fields: [
    {
      name: "adClick",
      type: "relationship",
      relationTo: "ad-clicks",
      required: true,
    },
    { name: "conversionType", type: "text", required: true },
    { name: "conversionValue", type: "number" },
    {
      name: "formSubmission",
      type: "relationship",
      relationTo: "form-submissions",
    },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
