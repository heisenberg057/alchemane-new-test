import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "../lib/audit/logAudit.ts";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { adminOnlyAccess } from "./access/phase2Access.ts";

export const AiCitationTests: CollectionConfig = {
  slug: "ai-citation-tests",
  admin: {
    useAsTitle: "query",
    defaultColumns: ["query", "post", "cited", "testedAt"],
    group: "SEO",
  },
  access: adminOnlyAccess,
  fields: [
    {
      name: "post",
      type: "relationship",
      relationTo: "posts",
      required: true,
    },
    { name: "query", type: "text", required: true },
    { name: "aiModel", type: "text", required: true },
    { name: "cited", type: "checkbox", required: true },
    { name: "position", type: "number" },
    { name: "context", type: "textarea" },
    { name: "response", type: "textarea", required: true },
    { name: "testedAt", type: "date" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("ai-citation-tests")],
  },
};
