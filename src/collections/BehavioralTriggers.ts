import type { CollectionConfig } from "payload";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { trackingCollectionAccess } from "./access/phase2Access.ts";

export const BehavioralTriggers: CollectionConfig = {
  slug: "behavioral-triggers",
  admin: {
    useAsTitle: "triggerType",
    defaultColumns: ["triggerType", "actionType", "converted", "createdAt"],
    group: "Lead Engine",
  },
  access: trackingCollectionAccess,
  fields: [
    { name: "sessionId", type: "text", required: true },
    { name: "triggerType", type: "text", required: true },
    { name: "triggerValue", type: "number", required: true },
    { name: "actionType", type: "text", required: true },
    { name: "actionContent", type: "text" },
    {
      name: "converted",
      type: "checkbox",
      defaultValue: false,
    },
    { name: "page", type: "text", required: true },
    { name: "device", type: "text" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
