import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "../lib/audit/logAudit.ts";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { adminOnlyAccess } from "./access/phase2Access.ts";

export const SecurityLogs: CollectionConfig = {
  slug: "security-logs",
  admin: {
    useAsTitle: "eventType",
    defaultColumns: ["eventType", "eventLevel", "ipAddress", "createdAt"],
    group: "Security",
  },
  access: adminOnlyAccess,
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      admin: { position: "sidebar" },
    },
    { name: "eventType", type: "text", required: true },
    { name: "eventLevel", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    { name: "ipAddress", type: "text", required: true },
    { name: "userAgent", type: "textarea" },
    { name: "endpoint", type: "text" },
    { name: "method", type: "text" },
    { name: "requestData", type: "json" },
    { name: "statusCode", type: "number" },
    { name: "errorMessage", type: "textarea" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("security-logs")],
  },
};
