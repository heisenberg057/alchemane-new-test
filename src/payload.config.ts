import { validateEnvAtStartup } from './lib/env.ts'
import { buildConfig } from 'payload'

validateEnvAtStartup()
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { AbTests } from './collections/AbTests.ts'
import { AdClicks } from './collections/AdClicks.ts'
import { AdConversions } from './collections/AdConversions.ts'
import { AiCitationTests } from './collections/AiCitationTests.ts'
import { Analytics } from './collections/Analytics.ts'
import { AuditLogs } from './collections/AuditLogs.ts'
import { Backups } from './collections/Backups.ts'
import { BehavioralTriggers } from './collections/BehavioralTriggers.ts'
import { BlockedIPs } from './collections/BlockedIPs.ts'
import { Calculators } from './collections/Calculators.ts'
import { Categories } from './collections/Categories.ts'
import { ConversionEvents } from './collections/ConversionEvents.ts'
import { DataExportRequests } from './collections/DataExportRequests.ts'
import { ExitIntents } from './collections/ExitIntents.ts'
import { FormAbandonments } from './collections/FormAbandonments.ts'
import { InternalLinks } from './collections/InternalLinks.ts'
import { Keywords } from './collections/Keywords.ts'
import { LeadScores } from './collections/LeadScores.ts'
import { SecurityLogs } from './collections/SecurityLogs.ts'
import { SeoAnalyses } from './collections/SeoAnalyses.ts'
import { Settings } from './collections/Settings.ts'
import { Users } from './collections/Users.ts'
import { WebhookLogs } from './collections/WebhookLogs.ts'
import { Webhooks } from './collections/Webhooks.ts'
import { Media } from './collections/Media.ts'
import { Posts } from './collections/Posts.ts'
import { FormSubmissions } from './collections/FormSubmissions.ts'
import { SystemEvents } from './collections/SystemEvents.ts'
import { Products } from './collections/Products.ts'
import { Tags } from './collections/Tags.ts'
import { Pages } from './collections/Pages.ts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Required so Payload admin, CSRF, and absolute media URLs use the public domain.
  serverURL: (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(
    /\/$/,
    ''
  ),
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- American Hairline Admin',
      icons: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          url: '/assets/icon-natural-hairline.svg',
        },
      ],
      openGraph: {
        images: ['/assets/mkxm0e5x-jjniexs.png'],
        siteName: 'American Hairline Admin',
      },
    },
    components: {
      graphics: {
        Logo: '/components/payload/Logo#Logo',
        Icon: '/components/payload/Icon#Icon',
      },
      views: {
        dashboard: {
          Component: '/components/payload/CustomDashboard#CustomDashboard',
        },
      },
    },
  },
  collections: [
    {
      ...Posts,
      admin: {
        ...Posts.admin,
        group: 'Website Content',
      },
    },
    {
      ...Pages,
      admin: {
        ...Pages.admin,
        group: 'Website Content',
      },
    },
    {
      ...Media,
      admin: {
        ...Media.admin,
        group: 'Website Content',
      },
    },
    {
      ...FormSubmissions,
      admin: {
        ...FormSubmissions.admin,
        group: 'Inbox',
      },
    },
    {
      ...Products,
      admin: {
        ...Products.admin,
        group: 'Website Content',
      },
    },
    {
      ...Tags,
      admin: {
        ...Tags.admin,
        group: 'Website Content',
      },
    },
    {
      ...Users,
      admin: {
        ...Users.admin,
        group: 'System',
      },
    },
    {
      ...SystemEvents,
      admin: {
        ...SystemEvents.admin,
        group: 'System',
      },
    },
    {
      ...BlockedIPs,
      admin: {
        ...BlockedIPs.admin,
        group: 'Security',
      },
    },
    {
      ...AuditLogs,
      admin: {
        ...AuditLogs.admin,
        group: 'Security',
      },
    },
    {
      ...DataExportRequests,
      admin: {
        ...DataExportRequests.admin,
        group: 'Security',
      },
    },
    Analytics,
    AdClicks,
    AdConversions,
    Webhooks,
    WebhookLogs,
    Settings,
    Categories,
    SecurityLogs,
    LeadScores,
    FormAbandonments,
    ExitIntents,
    BehavioralTriggers,
    Calculators,
    SeoAnalyses,
    Keywords,
    InternalLinks,
    AiCitationTests,
    AbTests,
    ConversionEvents,
    Backups,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET!,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  sharp,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    },
  }),
  plugins: [
    // R2 storage is only active when credentials are present (production).
    // In local dev, media files fall back to local disk via the Media collection's staticDir.
    ...(process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET_NAME && process.env.R2_ENDPOINT
      ? [
          s3Storage({
            collections: {
              media: {
                prefix: 'media',
                generateFileURL: ({ filename, prefix }: { filename: string; prefix?: string }) =>
                  `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${prefix}/${filename}`,
              },
            },
            bucket: process.env.R2_BUCKET_NAME!,
            config: {
              endpoint: process.env.R2_ENDPOINT!,
              region: 'auto',
              credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID!,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
              },
              forcePathStyle: true,
            },
          }),
        ]
      : []),
  ],
})
