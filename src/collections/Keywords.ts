import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "../lib/audit/logAudit.ts";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { adminOnlyAccess } from "./access/phase2Access.ts";

export const Keywords: CollectionConfig = {
  slug: "keywords",
  admin: {
    useAsTitle: "keyword",
    defaultColumns: ["keyword", "position", "searchVolume", "updatedAt"],
    group: "SEO",
  },
  access: adminOnlyAccess,
  fields: [
    { name: "keyword", type: "text", required: true, unique: true },
    { name: "searchVolume", type: "number" },
    { name: "difficulty", type: "number" },
    { name: "position", type: "number" },
    { name: "url", type: "text" },
    { name: "trackedSince", type: "date" },
    { name: "lastChecked", type: "date" },
    { name: "positionHistory", type: "json" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("keywords")],
  },
};
