import type { CollectionConfig } from 'payload'
import { sensitiveCollectionAuditHook } from '../lib/audit/logAudit.ts'
import { sanitizeHook } from '../lib/security/sanitize.ts'

function roleOf(user: unknown): string {
  if (!user || typeof user !== 'object') return ''
  const role = (user as { role?: unknown }).role
  return typeof role === 'string' ? role.toUpperCase() : ''
}

function isSuperAdmin(user: unknown): boolean {
  return roleOf(user) === 'SUPER_ADMIN'
}

function isAdminRole(user: unknown): boolean {
  const role = roleOf(user)
  return role === 'ADMIN' || role === 'SUPER_ADMIN'
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    // Payload admin UI: only admin roles may use the CMS.
    admin: ({ req: { user } }) => isAdminRole(user),
    // Admins see everyone; others may only read themselves.
    read: ({ req: { user } }) => {
      if (!user) return false
      if (isAdminRole(user)) return true
      return { id: { equals: user.id } }
    },
    create: ({ req: { user } }) => isSuperAdmin(user),
    update: ({ req: { user } }) => isAdminRole(user),
    delete: ({ req: { user } }) => isSuperAdmin(user),
  },
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook('users')],
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'EDITOR',
      access: {
        // Prevent privilege escalation via REST/self-update.
        update: ({ req: { user } }) => isSuperAdmin(user),
      },
      options: [
        { label: 'Super Admin', value: 'SUPER_ADMIN' },
        { label: 'Admin', value: 'ADMIN' },
        { label: 'Editor', value: 'EDITOR' },
        { label: 'User', value: 'USER' },
      ],
    },
  ],
}
