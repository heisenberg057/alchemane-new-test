import type { CollectionConfig } from "payload";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { trackingCollectionAccess } from "./access/phase2Access.ts";

export const ExitIntents: CollectionConfig = {
  slug: "exit-intents",
  admin: {
    useAsTitle: "page",
    defaultColumns: ["page", "action", "popupType", "createdAt"],
    group: "Lead Engine",
  },
  access: trackingCollectionAccess,
  fields: [
    { name: "sessionId", type: "text", required: true },
    { name: "page", type: "text", required: true },
    { name: "timeOnPage", type: "number", required: true },
    { name: "scrollDepth", type: "number", required: true },
    { name: "popupType", type: "text", required: true },
    { name: "popupContent", type: "text" },
    { name: "action", type: "text", required: true },
    { name: "emailCaptured", type: "text" },
    { name: "device", type: "text" },
    { name: "referrer", type: "text" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
