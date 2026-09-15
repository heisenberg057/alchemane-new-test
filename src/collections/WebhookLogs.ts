import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "../lib/audit/logAudit.ts";
import { sanitizeHook } from "../lib/security/sanitize.ts";

export const WebhookLogs: CollectionConfig = {
  slug: "webhook-logs",
  admin: {
    useAsTitle: "event",
    defaultColumns: ["event", "webhook", "status", "statusCode", "createdAt"],
    group: "Integrations",
  },
  access: {
    read: ({ req: { user } }) =>
      user?.role === "ADMIN" || user?.role === "SUPER_ADMIN",
    create: ({ req: { user } }) =>
      user?.role === "ADMIN" || user?.role === "SUPER_ADMIN",
    update: ({ req: { user } }) =>
      user?.role === "ADMIN" || user?.role === "SUPER_ADMIN",
    delete: ({ req: { user } }) =>
      user?.role === "ADMIN" || user?.role === "SUPER_ADMIN",
  },
  fields: [
    {
      name: "webhook",
      type: "relationship",
      relationTo: "webhooks",
      required: true,
    },
    { name: "event", type: "text", required: true },
    { name: "payload", type: "json", required: true },
    { name: "response", type: "json" },
    { name: "statusCode", type: "number" },
    { name: "status", type: "text", required: true },
    { name: "attempts", type: "number", defaultValue: 1 },
    { name: "errorMessage", type: "textarea" },
    { name: "duration", type: "number" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("webhook-logs")],
  },
};
