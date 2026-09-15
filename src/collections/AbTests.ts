import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "../lib/audit/logAudit.ts";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { adminOnlyAccess } from "./access/phase2Access.ts";

export const AbTests: CollectionConfig = {
  slug: "ab-tests",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "element", "status", "updatedAt"],
    group: "Experiments",
  },
  access: adminOnlyAccess,
  fields: [
    { name: "name", type: "text", required: true, unique: true },
    { name: "element", type: "text", required: true },
    { name: "status", type: "text", required: true },
    {
      name: "variants",
      type: "json",
      required: true,
    },
    {
      name: "trafficSplit",
      type: "json",
      required: true,
    },
    { name: "impressions", type: "json" },
    { name: "conversions", type: "json" },
    { name: "conversionRates", type: "json" },
    { name: "winner", type: "text" },
    { name: "confidence", type: "number" },
    { name: "startDate", type: "date" },
    { name: "endDate", type: "date" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("ab-tests")],
  },
};
