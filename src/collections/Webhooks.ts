import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "../lib/audit/logAudit.ts";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { encryptHeaders, decryptHeaders } from "../lib/security/headerEncryption.ts";

export const Webhooks: CollectionConfig = {
  slug: "webhooks",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "url", "isActive", "updatedAt"],
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
    { name: "name", type: "text", required: true },
    { name: "url", type: "text", required: true },
    { name: "method", type: "text", defaultValue: "POST" },
    {
      name: "events",
      type: "json",
      required: true,
      admin: { description: "Events to listen (JSON, e.g. list of event names)" },
    },
    {
      name: "headers",
      type: "json",
      admin: { description: "Custom headers — encrypted at rest" },
    },
    { name: "payload", type: "json", admin: { description: "Custom payload template" } },
    { name: "isActive", type: "checkbox", defaultValue: true },
    { name: "retryAttempts", type: "number", defaultValue: 3 },
    { name: "retryDelay", type: "number", defaultValue: 5000 },
    { name: "timeout", type: "number", defaultValue: 30000 },
    { name: "lastSuccess", type: "date" },
    { name: "lastFailure", type: "date" },
    { name: "successCount", type: "number", defaultValue: 0 },
    { name: "failureCount", type: "number", defaultValue: 0 },
    {
      name: "createdBy",
      type: "relationship",
      relationTo: "users",
      admin: { position: "sidebar" },
    },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    // Encrypt headers before writing to DB
    beforeChange: [
      ({ data }) => {
        if (data.headers !== undefined) {
          data.headers = encryptHeaders(data.headers);
        }
        return data;
      },
    ],
    // Decrypt headers after reading from DB so the delivery service gets real values
    afterRead: [
      ({ doc }) => {
        if (doc?.headers !== undefined) {
          doc.headers = decryptHeaders(doc.headers);
        }
        return doc;
      },
    ],
    afterOperation: [sensitiveCollectionAuditHook("webhooks")],
  },
};
