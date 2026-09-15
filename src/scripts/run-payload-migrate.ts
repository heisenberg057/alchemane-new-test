import { existsSync, readdirSync } from 'node:fs'

import { pushDevSchema } from '@payloadcms/drizzle'
import { getPayload } from 'payload'

import configPromise from '../payload.config.ts'

function shouldBootstrapSchema(migrationDir: string): boolean {
  if (!existsSync(migrationDir)) {
    return true
  }

  const migrationFiles = readdirSync(migrationDir).filter((file) => {
    if (!/\.(ts|js|mjs|cjs)$/.test(file)) {
      return false
    }

    return !/^index\./.test(file)
  })

  return migrationFiles.length === 0
}

async function main(): Promise<void> {
  process.env.PAYLOAD_MIGRATING = 'true'

  const payload = await getPayload({
    config: configPromise,
    disableOnInit: true,
  })

  const adapter = payload.db

  if (!adapter) {
    throw new Error('No database adapter found')
  }

  if (shouldBootstrapSchema(adapter.migrationDir)) {
    payload.logger.warn(`No migration files found in ${adapter.migrationDir}. Bootstrapping schema with Drizzle push.`)
    process.env.PAYLOAD_FORCE_DRIZZLE_PUSH = 'true'
    await pushDevSchema(adapter as never)
    payload.logger.info('Schema bootstrap complete.')
  } else {
    await adapter.migrate()
  }

  payload.logger.info('Done.')
  await payload.destroy()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
