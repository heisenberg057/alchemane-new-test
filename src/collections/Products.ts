import type { CollectionConfig } from 'payload'
import { sensitiveCollectionAuditHook } from '../lib/audit/logAudit.ts'
import { sanitizeHook } from '../lib/security/sanitize.ts'
import { isAdminRole, isContentRole } from './access/phase2Access.ts'

export const Products: CollectionConfig = {
  slug: 'products',
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook('products')],
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'status', 'updatedAt'],
    group: 'Website Content',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return { status: { equals: 'active' } }
      return true
    },
    create: ({ req: { user } }) => isContentRole(user),
    update: ({ req: { user } }) => isContentRole(user),
    delete: ({ req: { user } }) => isAdminRole(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
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
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Out of Stock', value: 'out-of-stock' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Product',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Hair Care', value: 'hair-care' },
        { label: 'Accessories', value: 'accessories' },
        { label: 'Treatments', value: 'treatments' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
