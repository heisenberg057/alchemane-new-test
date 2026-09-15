import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "../lib/audit/logAudit.ts";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { publicReadAdminWriteAccess } from "./access/phase2Access.ts";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "parent", "updatedAt"],
    group: "Website Content",
  },
  access: publicReadAdminWriteAccess,
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "description", type: "textarea" },
    { name: "icon", type: "text", admin: { description: "URL to icon/image" } },
    { name: "metaTitle", type: "text" },
    { name: "metaDescription", type: "textarea" },
    {
      name: "parent",
      type: "relationship",
      relationTo: "categories",
      admin: { position: "sidebar" },
    },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("categories")],
  },
};
