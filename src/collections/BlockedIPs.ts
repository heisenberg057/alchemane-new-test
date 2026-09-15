import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "../lib/audit/logAudit.ts";
import {
  persistIpBlockInRedis,
  removeIpBlockFromRedis,
} from "../lib/security/ipBlock.ts";
import { sanitizeHook } from "../lib/security/sanitize.ts";

export const BlockedIPs: CollectionConfig = {
  slug: "blocked-ips",
  admin: {
    useAsTitle: "ip",
    defaultColumns: ["ip", "blockedUntil", "updatedAt"],
    description:
      "Blocked addresses are enforced on /api/* when REDIS_URL is set (synced from this collection) or via BLOCKED_IPS env.",
  },
  access: {
    read: ({ req: { user } }) => {
      const role = (user as Record<string, unknown> | null)?.role
      return role === "ADMIN" || role === "SUPER_ADMIN"
    },
    create: ({ req: { user } }) => {
      const role = (user as Record<string, unknown> | null)?.role
      return role === "ADMIN" || role === "SUPER_ADMIN"
    },
    update: ({ req: { user } }) => {
      const role = (user as Record<string, unknown> | null)?.role
      return role === "ADMIN" || role === "SUPER_ADMIN"
    },
    delete: ({ req: { user } }) => {
      const role = (user as Record<string, unknown> | null)?.role
      return role === "ADMIN" || role === "SUPER_ADMIN"
    },
  },
  fields: [
    {
      name: "ip",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "reason",
      type: "textarea",
    },
    {
      name: "blockedUntil",
      type: "date",
      admin: {
        description: "Leave empty for a permanent block. After this time, the Redis key expires (if using Redis).",
      },
    },
    {
      name: "createdBy",
      type: "relationship",
      relationTo: "users",
      admin: {
        position: "sidebar",
      },
    },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("blocked-ips")],
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === "create" || operation === "update") {
          await persistIpBlockInRedis(doc.ip, doc.blockedUntil as string | null | undefined);
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        const ip = doc?.ip;
        if (typeof ip === "string") await removeIpBlockFromRedis(ip);
      },
    ],
  },
};
