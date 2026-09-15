import type { CollectionConfig } from 'payload'
import type { FormSubmissionForScore } from '../lib/services/leadScoring.service'
import { sensitiveCollectionAuditHook } from '../lib/audit/logAudit.ts'
import { sanitizeHook } from '../lib/security/sanitize.ts'
import { leadsAdminAccess } from './access/phase2Access.ts'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'type', 'createdAt'],
  },
  access: leadsAdminAccess,
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Contact Form', value: 'contact' },
        { label: 'Consultation Booking', value: 'consultation' },
        { label: 'Callback Request', value: 'callback' },
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Blog Comment', value: 'comment' },
      ],
      required: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'subject',
      type: 'text',
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'city',
      type: 'text',
      label: 'City',
    },
    {
      name: 'confirmPhone',
      type: 'text',
      label: 'Confirm Phone',
    },
    {
      name: 'preferredTime',
      type: 'text',
      label: 'Preferred Call Time',
    },
    {
      name: 'consultationMode',
      type: 'text',
      label: 'Consultation Mode',
    },
    {
      name: 'funnelSlug',
      type: 'text',
      label: 'Funnel Slug',
      admin: { position: 'sidebar' },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      label: 'Submission Source URL',
    },
    {
      name: 'utmSource',
      type: 'text',
      label: 'UTM Source',
    },
    {
      name: 'utmMedium',
      type: 'text',
      label: 'UTM Medium',
    },
    {
      name: 'utmCampaign',
      type: 'text',
      label: 'UTM Campaign',
    },
    {
      name: 'utmContent',
      type: 'text',
      label: 'UTM Content',
      admin: { position: 'sidebar' }
    },
    {
      name: 'utmTerm',
      type: 'text',
      label: 'UTM Term',
      admin: { position: 'sidebar' }
    },
    {
      name: 'campaignName',
      type: 'text',
      label: 'Campaign Name',
      admin: { position: 'sidebar' }
    },
    {
      name: 'adSetName',
      type: 'text',
      label: 'AdSet Name',
      admin: { position: 'sidebar' }
    },
    {
      name: 'adName',
      type: 'text',
      label: 'Ad Name',
      admin: { position: 'sidebar' }
    },
    {
      name: 'campaignSource',
      type: 'text',
      label: 'Campaign Source',
      admin: { position: 'sidebar' }
    },
    {
      name: 'placement',
      type: 'text',
      label: 'Placement',
      admin: { position: 'sidebar' }
    },
    {
      name: 'gclid',
      type: 'text',
      label: 'GCLID',
      admin: { position: 'sidebar' }
    },
    {
      name: 'fbclid',
      type: 'text',
      label: 'FBCLID',
      admin: { position: 'sidebar' }
    },
    {
      name: 'msclkid',
      type: 'text',
      label: 'MSCLKID',
      admin: { position: 'sidebar' }
    },
    {
      name: 'ttclid',
      type: 'text',
      label: 'TTCLID',
      admin: { position: 'sidebar' }
    },
    {
      name: 'liFatId',
      type: 'text',
      label: 'LI FAT ID',
      admin: { position: 'sidebar' }
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: { position: 'sidebar' }
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: { position: 'sidebar' }
    },
    {
      name: 'timeOnSite',
      type: 'number',
      admin: { position: 'sidebar' }
    },
    {
      name: 'pagesBefore',
      type: 'number',
      admin: { position: 'sidebar' }
    },
    {
      name: 'scrollDepth',
      type: 'number',
      admin: { position: 'sidebar' }
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'NEW',
      options: [
        { label: 'New', value: 'NEW' },
        { label: 'Read', value: 'READ' },
        { label: 'Contacted', value: 'CONTACTED' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Archived', value: 'ARCHIVED' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook('form-submissions')],
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create') {
          const { scheduleScoreLeadFromSubmissionDoc, scheduleDispatchFormSubmitted } =
            await import('@/lib/services/leadScoring.service')
          scheduleScoreLeadFromSubmissionDoc(doc as unknown as FormSubmissionForScore)
          scheduleDispatchFormSubmitted(doc as Record<string, unknown>)
        }
      },
    ],
  },
}
