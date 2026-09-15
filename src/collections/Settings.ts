import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "../lib/audit/logAudit.ts";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { adminOnlyAccess } from "./access/phase2Access.ts";

export const Settings: CollectionConfig = {
  slug: "settings",
  admin: {
    useAsTitle: "key",
    defaultColumns: ["key", "type", "group", "updatedAt"],
    group: "System",
  },
  access: adminOnlyAccess,
  fields: [
    { name: "key", type: "text", required: true, unique: true },
    { name: "value", type: "textarea", required: true },
    { name: "type", type: "text", defaultValue: "STRING" },
    { name: "group", type: "text", defaultValue: "general" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("settings")],
  },
};
