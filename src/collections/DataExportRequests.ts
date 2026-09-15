import type { CollectionConfig } from "payload";
import { sanitizeHook } from "../lib/security/sanitize.ts";
import { immutableAdminReadAccess } from "./access/phase2Access.ts";

export const DataExportRequests: CollectionConfig = {
  slug: "data-export-requests",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "kind", "status", "updatedAt"],
  },
  access: immutableAdminReadAccess,
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "kind",
      type: "select",
      required: true,
      options: [
        { label: "Export", value: "export" },
        { label: "Delete", value: "delete" },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending_verification",
      options: [
        { label: "Pending verification", value: "pending_verification" },
        { label: "Verified", value: "verified" },
        { label: "Processing", value: "processing" },
        { label: "Completed", value: "completed" },
        { label: "Failed", value: "failed" },
      ],
    },
    {
      name: "lastError",
      type: "textarea",
    },
    {
      name: "verifiedAt",
      type: "date",
      admin: { readOnly: true },
    },
    {
      name: "completedAt",
      type: "date",
      admin: { readOnly: true },
    },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
