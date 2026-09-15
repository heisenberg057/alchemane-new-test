import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "../lib/audit/logAudit.ts";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { adminOnlyAccess } from "./access/phase2Access.ts";

export const InternalLinks: CollectionConfig = {
  slug: "internal-links",
  admin: {
    useAsTitle: "anchorText",
    defaultColumns: ["fromPost", "toPost", "relevanceScore", "createdAt"],
    group: "SEO",
  },
  access: adminOnlyAccess,
  fields: [
    {
      name: "fromPost",
      type: "relationship",
      relationTo: "posts",
      required: true,
    },
    {
      name: "toPost",
      type: "relationship",
      relationTo: "posts",
      required: true,
    },
    { name: "anchorText", type: "text", required: true },
    { name: "position", type: "number" },
    { name: "relevanceScore", type: "number" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("internal-links")],
  },
};
