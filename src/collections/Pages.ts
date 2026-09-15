import type { CollectionConfig } from 'payload'
import { sensitiveCollectionAuditHook } from '../lib/audit/logAudit.ts'
import { sanitizeHook } from '../lib/security/sanitize.ts'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    group: 'Website Content',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return { status: { equals: 'PUBLISHED' } }
      return true
    },
    create: ({ req: { user } }) => {
      const role = (user as Record<string, unknown> | null)?.role;
      return role === 'ADMIN' || role === 'SUPER_ADMIN';
    },
    update: ({ req: { user } }) => {
      const role = (user as Record<string, unknown> | null)?.role;
      return role === 'ADMIN' || role === 'SUPER_ADMIN';
    },
    delete: ({ req: { user } }) => {
      const role = (user as Record<string, unknown> | null)?.role;
      return role === 'ADMIN' || role === 'SUPER_ADMIN';
    },
  },
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook('pages')],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'DRAFT',
      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Published', value: 'PUBLISHED' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'featuredImage', type: 'text', admin: { description: 'URL from media library' } },
    {
      name: 'content',
      type: 'textarea',
      admin: { description: 'HTML when not using the visual block builder' },
    },
    {
      name: 'blocksData',
      type: 'textarea',
      admin: { description: 'JSON string of block editor output' },
    },
    { name: 'focusKeyword', type: 'text' },
    { name: 'seoTitle', type: 'text' },
    { name: 'metaDescription', type: 'textarea' },
    { name: 'canonicalUrl', type: 'text' },
    { name: 'ogTitle', type: 'text' },
    { name: 'ogDescription', type: 'textarea' },
    { name: 'ogImage', type: 'text' },
    { name: 'twitterTitle', type: 'text' },
    { name: 'twitterDescription', type: 'textarea' },
    { name: 'twitterImage', type: 'text' },
    { name: 'isIndexable', type: 'checkbox', defaultValue: true },
    { name: 'isFollowable', type: 'checkbox', defaultValue: true },
    { name: 'advancedRobots', type: 'text' },
    { name: 'enableSchema', type: 'checkbox', defaultValue: true },
    {
      name: 'customSchema',
      type: 'textarea',
      validate: (value: unknown) => {
        if (!value || value === '') return true;
        if (typeof value !== 'string') return 'Must be a JSON string';
        try {
          const parsed = JSON.parse(value);
          if (typeof parsed !== 'object' || parsed === null) {
            return 'Must be a JSON object or array';
          }
          return true;
        } catch {
          return 'Must be valid JSON (e.g. {"@context":"https://schema.org",...})';
        }
      },
    },
    {
      name: 'headerStyle',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Hidden', value: 'hidden' },
        { label: 'Transparent', value: 'transparent' },
      ],
    },
    {
      name: 'footerStyle',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Hidden', value: 'hidden' },
      ],
    },
    { name: 'showSidebar', type: 'checkbox', defaultValue: false },
    { name: 'customHeadScripts', type: 'textarea' },
    { name: 'customFooterScripts', type: 'textarea' },
  ],
}
