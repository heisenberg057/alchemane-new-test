/**
 * Stage + upload Clip-on LP heavy stills (webp) to Cloudflare R2.
 *
 * Lightweight SVGs stay in `public/assets/clip-on-lp/` and are not uploaded.
 * Safely reads only R2_* / NEXT_PUBLIC_R2_* from .env.local (skips broken
 * multiline JSON blocks that break `source .env.local` in zsh).
 *
 * Usage:
 *   node scripts/upload-clip-on.mjs
 *   DRY_RUN=1 node scripts/upload-clip-on.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const DRY_RUN = process.env.DRY_RUN === '1'

const SOURCE_DIR = path.join(projectRoot, 'public', 'assets', 'clip-on-lp')
const LOCAL_DIR = path.join(projectRoot, 'public', 'media', 'clip-on-lp')
const R2_PREFIX = 'media/clip-on-lp'

/** Parse only simple KEY=VALUE lines we need — ignore multiline JSON junk. */
function loadR2Env(filePath) {
  if (!fs.existsSync(filePath)) return {}
  const wanted = new Set([
    'R2_ENDPOINT',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET_NAME',
    'NEXT_PUBLIC_R2_PUBLIC_URL',
  ])
  const out = {}
  for (const raw of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq <= 0) continue
    const key = line.slice(0, eq).trim()
    if (!wanted.has(key)) continue
    let val = line.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    out[key] = val
  }
  return out
}

function walkFiles(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walkFiles(p, out)
    else out.push(p)
  }
  return out
}

const envFiles = [
  path.join(projectRoot, '.env.local'),
  path.join(projectRoot, '.env'),
]
const fileEnv = {}
for (const file of envFiles) {
  Object.assign(fileEnv, loadR2Env(file))
}

const endpoint = process.env.R2_ENDPOINT || fileEnv.R2_ENDPOINT
const accessKeyId = process.env.R2_ACCESS_KEY_ID || fileEnv.R2_ACCESS_KEY_ID
const secretAccessKey =
  process.env.R2_SECRET_ACCESS_KEY || fileEnv.R2_SECRET_ACCESS_KEY
const bucket = process.env.R2_BUCKET_NAME || fileEnv.R2_BUCKET_NAME
const publicBase = (
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
  fileEnv.NEXT_PUBLIC_R2_PUBLIC_URL ||
  ''
).replace(/\/$/, '')

if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
  console.error(
    'Missing R2 env (R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME).'
  )
  process.exit(1)
}

if (!fs.existsSync(SOURCE_DIR)) {
  console.error(`Source missing: ${SOURCE_DIR}`)
  process.exit(1)
}

/** Stage webp only — SVGs remain under public/assets/clip-on-lp. */
fs.rmSync(LOCAL_DIR, { recursive: true, force: true })
fs.mkdirSync(LOCAL_DIR, { recursive: true })

const webps = walkFiles(SOURCE_DIR).filter((p) => /\.webp$/i.test(p))
for (const abs of webps) {
  const rel = path.relative(SOURCE_DIR, abs)
  const dest = path.join(LOCAL_DIR, rel)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(abs, dest)
}

console.log(`Staged ${webps.length} webp files → ${LOCAL_DIR}`)
console.log(`Sync → s3://${bucket}/${R2_PREFIX}/  DRY_RUN=${DRY_RUN}`)

const awsArgs = [
  's3',
  'sync',
  LOCAL_DIR + path.sep,
  `s3://${bucket}/${R2_PREFIX}/`,
  '--endpoint-url',
  endpoint,
  '--cache-control',
  'public, max-age=31536000, immutable',
]
if (DRY_RUN) awsArgs.push('--dryrun')

const result = spawnSync('aws', awsArgs, {
  stdio: 'inherit',
  env: {
    ...process.env,
    AWS_ACCESS_KEY_ID: accessKeyId,
    AWS_SECRET_ACCESS_KEY: secretAccessKey,
    AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION || 'auto',
  },
})

if (result.error) {
  console.error(result.error)
  process.exit(1)
}
if (result.status !== 0) {
  process.exit(result.status ?? 1)
}

if (publicBase) {
  console.log('\nSpot-check URLs:')
  console.log(`  ${publicBase}/${R2_PREFIX}/logo-780.webp`)
  console.log(`  ${publicBase}/${R2_PREFIX}/results/group-16-780.webp`)
  console.log(`  ${publicBase}/${R2_PREFIX}/secret/real-vs-fake-780.webp`)
  console.log(`  ${publicBase}/${R2_PREFIX}/choice/bharat-award-780.webp`)
  console.log(`  ${publicBase}/${R2_PREFIX}/location/salon-1-780.webp`)
}

console.log('\nDone.')
