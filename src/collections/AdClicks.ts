import type { CollectionConfig } from "payload";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { trackingCollectionAccess } from "./access/phase2Access.ts";

export const AdClicks: CollectionConfig = {
  slug: "ad-clicks",
  admin: {
    useAsTitle: "sessionId",
    defaultColumns: ["sessionId", "utmSource", "converted", "createdAt"],
    group: "Analytics & Tracking",
  },
  access: trackingCollectionAccess,
  fields: [
    { name: "sessionId", type: "text", required: true, unique: true },
    { name: "campaignName", type: "text" },
    { name: "adSetName", type: "text" },
    { name: "adName", type: "text" },
    { name: "campaignSource", type: "text" },
    { name: "placement", type: "text" },
    { name: "utmSource", type: "text" },
    { name: "utmMedium", type: "text" },
    { name: "utmCampaign", type: "text" },
    { name: "utmTerm", type: "text" },
    { name: "utmContent", type: "text" },
    { name: "landingPage", type: "text", required: true },
    { name: "referrer", type: "text" },
    { name: "ipAddress", type: "text" },
    { name: "userAgent", type: "textarea" },
    { name: "device", type: "text" },
    { name: "browser", type: "text" },
    { name: "country", type: "text" },
    { name: "city", type: "text" },
    {
      name: "converted",
      type: "checkbox",
      defaultValue: false,
    },
    { name: "conversionType", type: "text" },
    { name: "conversionValue", type: "number" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
