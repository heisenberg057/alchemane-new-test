import type { CollectionConfig } from 'payload'
import { sensitiveCollectionAuditHook } from '../lib/audit/logAudit.ts'
import { sanitizeHook } from '../lib/security/sanitize.ts'
import { POST_CATEGORY_OPTIONS } from '../config/postCategoryOptions.ts'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: ({ req: { user } }) => {
      if (!user) return { _status: { equals: 'published' } }
      return true
    },
    create: ({ req: { user } }) => {
      const role = (user as Record<string, unknown> | null)?.role
      return role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'EDITOR'
    },
    update: ({ req: { user } }) => {
      const role = (user as Record<string, unknown> | null)?.role
      return role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'EDITOR'
    },
    delete: ({ req: { user } }) => {
      const role = (user as Record<string, unknown> | null)?.role
      return role === 'ADMIN' || role === 'SUPER_ADMIN'
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
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
            if (value || !data?.title) return value
            return data.title
              .toLowerCase()
              .replace(/ /g, '-')
              .replace(/[^\w-]+/g, '')
          },
        ],
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: POST_CATEGORY_OPTIONS.map((o) => ({ label: o.label, value: o.value })),
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
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'wordpressHtml',
      type: 'textarea',
      label: 'WordPress HTML (import)',
      admin: {
        description:
          'Raw HTML from WordPress. Used for display when present; Lexical `content` remains for admin/editor metrics.',
        position: 'sidebar',
      },
    },
    {
      name: 'blocksData',
      type: 'textarea',
      label: 'Visual Builder Blocks',
      admin: {
        description: 'JSON serialised Visual Builder block tree. Managed by the custom post editor.',
        position: 'sidebar',
      },
    },
    // SEO Fields
    {
      name: 'meta',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
          minLength: 40,
          maxLength: 60,
          admin: {
            description: 'Optimal length: 50-60 characters.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
          minLength: 140,
          maxLength: 160,
          admin: {
            description: 'Optimal length: 150-160 characters.',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Keywords',
          admin: {
            description: 'Comma-separated list of focus keywords.',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Open Graph Image',
        },
        {
          name: 'twitterTitle',
          type: 'text',
          label: 'Twitter / X Title',
          admin: {
            description: 'Overrides Meta Title for Twitter cards.',
          },
        },
        {
          name: 'twitterDescription',
          type: 'textarea',
          label: 'Twitter / X Description',
          admin: {
            description: 'Overrides Meta Description for Twitter cards.',
          },
        },
        {
          name: 'preview',
          type: 'ui',
          admin: {
            components: {
              Field: '/components/payload/SocialPreview#SocialPreview',
            },
          },
        },
      ],
    },
    {
      name: 'canonicalUrl',
      type: 'text',
      label: 'Canonical URL',
      admin: {
        position: 'sidebar',
        description: 'Custom canonical URL. Leave blank to use the default post URL.',
      },
    },
    // Advanced SEO & Schema
    {
      name: 'structuredData',
      type: 'group',
      label: 'Schema & Structured Data',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'schemaType',
          type: 'select',
          label: 'Schema Type',
          defaultValue: 'Article',
          options: [
            { label: 'Article', value: 'Article' },
            { label: 'Blog Posting', value: 'BlogPosting' },
            { label: 'How-To', value: 'HowTo' },
            { label: 'FAQ Page', value: 'FAQPage' },
            { label: 'Medical Web Page', value: 'MedicalWebPage' },
            { label: 'Product', value: 'Product' },
            { label: 'Custom (Advanced)', value: 'Custom' },
          ],
        },
        {
          name: 'customSchema',
          type: 'json',
          label: 'Custom JSON-LD',
          admin: {
            description: 'Paste valid JSON-LD here. Overrides auto-generated schema.',
            condition: (data) => data?.structuredData?.schemaType === 'Custom',
          },
        },
      ],
    },
    // Advanced SEO & Metrics
    {
      name: 'metrics',
      type: 'group',
      label: 'Content Metrics',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      fields: [
        {
          name: 'readingTime',
          type: 'number',
          label: 'Reading Time (min)',
        },
        {
          name: 'wordCount',
          type: 'number',
          label: 'Word Count',
        },
      ],
    },
    {
      name: 'aiOptimization',
      type: 'group',
      label: 'AI SEO',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'score',
          type: 'number',
          label: 'AI optimization score',
        },
        { name: 'faqs', type: 'json' },
        { name: 'directAnswers', type: 'json' },
        { name: 'keyTakeaways', type: 'json' },
        { name: 'conversationalAnalysis', type: 'json' },
        { name: 'faqSchema', type: 'json', label: 'FAQ JSON-LD' },
        { name: 'lastOptimizedAt', type: 'date' },
      ],
    },
    {
      name: 'seoAnalysis',
      type: 'group',
      label: 'SEO Analysis',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'focusKeyword',
          type: 'text',
          label: 'Focus Keyword',
        },
        {
          name: 'seoScore',
          type: 'number',
          label: 'SEO Score (0-100)',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'seoFeedback',
          type: 'textarea',
          label: 'Analysis Feedback',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook('posts')],
    beforeChange: [
      async ({ data, req }) => {
        // Calculate reading time and word count from content or blocksData
        const contentSource = data.content || data.blocksData;
        if (contentSource) {
          try {
            const contentStr = typeof contentSource === 'string'
              ? contentSource
              : JSON.stringify(contentSource);
            // Count alphanumeric words
            const words = contentStr.match(/\w+/g) || [];
            const wordCount = words.length;
            const readingTime = Math.ceil(wordCount / 200); // 200 wpm

            data.metrics = {
              wordCount,
              readingTime,
            };

            // Simple SEO check
            if (data.seoAnalysis?.focusKeyword && data.metrics) {
              const keyword = data.seoAnalysis.focusKeyword.toLowerCase();
              const lowerContent = contentStr.toLowerCase();
              const keywordCount = (lowerContent.match(new RegExp(keyword, 'g')) || []).length;
              
              let score = 50;
              let feedback = '';

              if (keywordCount > 0) {
                score += 20;
                feedback += `Keyword found ${keywordCount} times. `;
              } else {
                feedback += `Keyword not found in content. `;
              }

              if (data.title?.toLowerCase().includes(keyword)) {
                score += 30;
                feedback += `Keyword found in title. `;
              }

              data.seoAnalysis.seoScore = Math.min(score, 100);
              data.seoAnalysis.seoFeedback = feedback;
            }
          } catch (e) {
            console.error('Error calculating metrics:', e);
          }
        }
        // Handle publishedDate
        if (data._status === 'published' && !data.publishedDate) {
          data.publishedDate = new Date().toISOString();
        }

        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation }) => {
        if (operation !== 'update' && operation !== 'create') return

        const isNowPublished = doc._status === 'published'
        const wasPublished = previousDoc?._status === 'published'

        // Revalidate whenever the post is published or was previously published
        // (covers: publish, unpublish, and edits to already-published posts).
        // Skips pure draft saves where the post has never been published.
        if (!isNowPublished && !wasPublished) return

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL
        const secret = process.env.REVALIDATION_SECRET

        if (!baseUrl || !secret) {
          console.warn('[Cache] NEXT_PUBLIC_APP_URL or REVALIDATION_SECRET not set — skipping revalidation')
          return
        }

        try {
          const res = await fetch(`${baseUrl}/api/revalidate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-revalidate-secret': secret,
            },
            body: JSON.stringify({ slug: doc.slug }),
          })
          if (!res.ok) {
            const text = await res.text().catch(() => res.status.toString())
            console.error('[Cache] Revalidation request rejected for post:', doc.slug, res.status, text)
          }
        } catch (err) {
          console.error('[Cache] Revalidation failed for post:', doc.slug, err)
        }
      },
    ],
  },
  versions: {
    drafts: true,
  },
}
