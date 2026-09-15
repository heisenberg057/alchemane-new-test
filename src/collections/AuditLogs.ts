import type { CollectionConfig } from "payload";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { immutableAdminReadAccess } from "./access/phase2Access.ts";

export const AuditLogs: CollectionConfig = {
  slug: "audit-logs",
  admin: {
    useAsTitle: "action",
    defaultColumns: ["action", "entity", "entityId", "createdAt"],
    description: "Immutable trail of sensitive changes (no secrets in diff summaries).",
  },
  access: immutableAdminReadAccess,
  fields: [
    {
      name: "action",
      type: "text",
      required: true,
    },
    {
      name: "entity",
      type: "text",
      required: true,
    },
    {
      name: "entityId",
      type: "text",
    },
    {
      name: "actor",
      type: "relationship",
      relationTo: "users",
    },
    {
      name: "ip",
      type: "text",
    },
    {
      name: "userAgent",
      type: "text",
    },
    {
      name: "diffSummary",
      type: "textarea",
    },
    {
      name: "timestamp",
      type: "date",
      required: true,
    },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
