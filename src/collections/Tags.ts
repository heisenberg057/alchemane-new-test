import type { CollectionConfig } from 'payload'
import { sensitiveCollectionAuditHook } from '../lib/audit/logAudit.ts'
import { sanitizeHook } from '../lib/security/sanitize.ts'
import { publicReadContentWriteAccess } from './access/phase2Access.ts'

export const Tags: CollectionConfig = {
  slug: 'tags',
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook('tags')],
  },
  admin: {
    useAsTitle: 'name',
    group: 'Website Content',
  },
  access: publicReadContentWriteAccess,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value || !data?.name) return value
            return data.name
              .toLowerCase()
              .replace(/ /g, '-')
              .replace(/[^\w-]+/g, '')
          },
        ],
      },
    },
  ],
}
