import type { CollectionConfig } from "payload";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { trackingCollectionAccess } from "./access/phase2Access.ts";

export const Analytics: CollectionConfig = {
  slug: "analytics",
  admin: {
    useAsTitle: "pageUrl",
    defaultColumns: ["pageUrl", "ipAddress", "createdAt"],
    group: "Analytics & Tracking",
  },
  access: trackingCollectionAccess,
  fields: [
    { name: "pageUrl", type: "text", required: true },
    { name: "referrer", type: "text" },
    { name: "userAgent", type: "textarea" },
    { name: "ipAddress", type: "text" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
