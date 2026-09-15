import type { CollectionConfig } from 'payload'
import { sanitizeHook } from '../lib/security/sanitize.ts'

export const SystemEvents: CollectionConfig = {
  slug: 'system-events',
  admin: {
    useAsTitle: 'event',
    defaultColumns: ['event', 'user', 'createdAt'],
  },
  access: {
    // Writes only via trusted server code with overrideAccess.
    create: () => false,
    read: ({ req: { user } }) => {
      const role = (user as { role?: unknown } | null)?.role;
      return role === "ADMIN" || role === "SUPER_ADMIN";
    },
    update: () => false,
    delete: () => false, // Immutable logs
  },
  fields: [
    {
      name: 'event',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'metadata',
      type: 'json',
    },
    {
      name: 'ip',
      type: 'text',
    },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
}
