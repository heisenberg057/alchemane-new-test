import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "../lib/audit/logAudit.ts";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { adminOnlyAccess } from "./access/phase2Access.ts";

export const Backups: CollectionConfig = {
  slug: "backups",
  admin: {
    useAsTitle: "fileName",
    defaultColumns: ["type", "status", "startedAt", "verified"],
    group: "System",
  },
  access: adminOnlyAccess,
  fields: [
    { name: "type", type: "text", required: true },
    { name: "status", type: "text", required: true },
    { name: "fileName", type: "text", required: true },
    { name: "fileSize", type: "number" },
    { name: "location", type: "text", required: true },
    { name: "recordCount", type: "number" },
    {
      name: "tables",
      type: "json",
      required: true,
      admin: { description: "JSON array of table names included" },
    },
    { name: "startedAt", type: "date" },
    { name: "completedAt", type: "date" },
    { name: "duration", type: "number" },
    {
      name: "verified",
      type: "checkbox",
      defaultValue: false,
    },
    { name: "verifiedAt", type: "date" },
    { name: "checksum", type: "text" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("backups")],
  },
};
