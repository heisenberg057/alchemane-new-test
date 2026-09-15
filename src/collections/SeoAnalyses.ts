import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "../lib/audit/logAudit.ts";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { adminOnlyAccess } from "./access/phase2Access.ts";

export const SeoAnalyses: CollectionConfig = {
  slug: "seo-analyses",
  admin: {
    useAsTitle: "url",
    defaultColumns: ["url", "post", "score", "analyzedAt"],
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
    { name: "url", type: "text", required: true },
    { name: "screpyReportId", type: "text" },
    { name: "screpyScore", type: "number" },
    { name: "screpyData", type: "json" },
    {
      name: "lighthouseSimulated",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "True when Lighthouse scores are synthetic (localhost or missing API key). False when scores are from a real PageSpeed API call.",
      },
    },
    { name: "score", type: "number", required: true },
    { name: "issues", type: "json", required: true },
    { name: "recommendations", type: "json", required: true },
    { name: "pageSpeed", type: "number" },
    { name: "mobileScore", type: "number" },
    { name: "titleTag", type: "json" },
    { name: "metaDescription", type: "json" },
    { name: "headings", type: "json" },
    { name: "images", type: "json" },
    { name: "internalLinks", type: "number" },
    { name: "externalLinks", type: "number" },
    { name: "wordCount", type: "number" },
    { name: "readability", type: "number" },
    { name: "keywordUsage", type: "json" },
    { name: "schemaTypes", type: "json" },
    { name: "analyzedAt", type: "date" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("seo-analyses")],
  },
};
