import type { CollectionConfig } from 'payload'
import { sensitiveCollectionAuditHook } from '../lib/audit/logAudit.ts'
import { sanitizeHook } from '../lib/security/sanitize.ts'
import { isContentRole, isAdminRole } from './access/phase2Access.ts'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    // Public read for media served at /media/* URLs (images embedded in public pages).
    // API metadata endpoints (/api/media) are protected separately via withAuth in custom routes.
    read: () => true,
    create: ({ req: { user } }) => isContentRole(user),
    update: ({ req: { user } }) => isContentRole(user),
    delete: ({ req: { user } }) => isAdminRole(user) || isContentRole(user),
  },
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook('media')],
  },
  upload: {
    // In dev (no R2 vars), files are stored locally. In prod, s3Storage plugin overrides this.
    staticDir: process.env.R2_ACCESS_KEY_ID ? undefined : 'public/media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'center',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'center',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'center',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text (SEO)',
      admin: {
        description: 'Crucial for SEO and accessibility. Describe the image content clearly.',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Image Title',
      admin: {
        description: 'Displayed on hover. Keep it short and descriptive.',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      label: 'Caption',
      admin: {
        description: 'Visible text displayed below the image (optional).',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Long Description',
      admin: {
        description: 'For attachment pages or detailed context (not usually visible on post).',
      },
    },
  ],
}
