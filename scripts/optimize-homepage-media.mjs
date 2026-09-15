/**
 * Optimize homepage media to responsive WebP and upload to R2.
 *
 * Usage:
 *   node scripts/optimize-homepage-media.mjs
 *   DRY_RUN=1 node scripts/optimize-homepage-media.mjs
 *   SKIP_UPLOAD=1 node scripts/optimize-homepage-media.mjs   # write locally only
 *
 * Env (from .env.local):
 *   NEXT_PUBLIC_R2_PUBLIC_URL, R2_BUCKET_NAME, R2_ENDPOINT,
 *   R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY
 *
 * Output keys: media/path/name.w400.webp | .w800.webp | .w1200.webp
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { config as loadDotEnv } from 'dotenv'
import sharp from 'sharp'
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

loadDotEnv({ path: path.join(projectRoot, '.env.local') })
loadDotEnv({ path: path.join(projectRoot, '.env'), override: false })

const WIDTHS = [400, 800, 1200]
const QUALITY = 78
const DRY_RUN = process.env.DRY_RUN === '1'
const SKIP_UPLOAD = process.env.SKIP_UPLOAD === '1'

const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, '')
const bucket = process.env.R2_BUCKET_NAME
const endpoint = process.env.R2_ENDPOINT
const accessKeyId = process.env.R2_ACCESS_KEY_ID
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

if (!publicBase || !bucket || !endpoint || !accessKeyId || !secretAccessKey) {
  throw new Error('Missing R2 env vars (NEXT_PUBLIC_R2_PUBLIC_URL, R2_*)')
}

const client = new S3Client({
  region: 'auto',
  endpoint,
  forcePathStyle: true,
  credentials: { accessKeyId, secretAccessKey },
})

/** Homepage-v2 image keys under media/ (no leading slash). */
const HOMEPAGE_IMAGES = [
  'media/hero-secret/clients/client-1.png',
  'media/hero-secret/clients/client-2.png',
  'media/hero-secret/clients/client-3.png',
  'media/hero-secret/clients/client-4.png',
  'media/hero-secret/clients/client-5.png',
  'media/hero-secret/clients/client-6.png',
  'media/achievements/shark-tank-india.png',
  'media/achievements/bharat-innovators-award.png',
  'media/achievements/designed-for-bollywood.png',
  'media/achievements/advanced-3d-scan.png',
  'media/key-facts/12-years-experience.png',
  'media/key-facts/6770-men-helped.png',
  'media/key-facts/100-natural-looking.png',
  'media/key-facts/12-nations.png',
  'media/backed/google.png',
  'media/backed/youtube.png',
  'media/client-stories/client-story-1.png',
  'media/client-stories/client-story-2.png',
  'media/client-stories/client-story-3.png',
  'media/client-stories/client-story-4.png',
  'media/client-stories/client-story-5.png',
  'media/client-stories/client-story-6.png',
  'media/systems/system-01.png',
  'media/systems/system-02.png',
  'media/systems/system-03.png',
  'media/systems/system-04.png',
  'media/systems/system-05.png',
  'media/systems/system-06.png',
  'media/systems/system-07.png',
  'media/systems/system-08.png',
  'media/systems/system-09.png',
  'media/systems/system-10.png',
  'media/systems/system-11.png',
  'media/systems/system-12.png',
  'media/systems/system-13.png',
  'media/scan/advanced-3d-scan.png',
  'media/decide/from-bald-to-bold.png',
  'media/services/non-surgical-hair-replacement.png',
  'media/services/scalp-micro-pigmentation.png',
  'media/services/hair-transplant.png',
  'media/process/steps.png',
  'media/methods/stick-on.png',
  'media/methods/clip-on.png',
  'media/deck/sameer-warma.png',
  'media/deck/daljit-singh.png',
  'media/deck/advik-sharma.png',
  'media/deck/fuzail-khan.png',
  'media/deck/chandan-singh.png',
  'media/salons/mumbai/salon-1.png',
  'media/salons/mumbai/salon-2.png',
  'media/salons/mumbai/salon-3.png',
  'media/salons/delhi/salon-1.jpg',
  'media/salons/delhi/salon-2.jpg',
  'media/salons/bangalore/salon-1.png',
  'media/salons/bangalore/salon-2.png',
]

const outDir = path.join(projectRoot, '.media-opt')
fs.mkdirSync(outDir, { recursive: true })

async function streamToBuffer(body) {
  const chunks = []
  for await (const chunk of body) chunks.push(chunk)
  return Buffer.concat(chunks)
}

async function fetchSource(key) {
  const local = path.join(projectRoot, 'public', key)
  if (fs.existsSync(local)) {
    return fs.readFileSync(local)
  }
  const res = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: key })
  )
  return streamToBuffer(res.Body)
}

async function objectExists(key) {
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    return true
  } catch (err) {
    if (err?.$metadata?.httpStatusCode === 404) return false
    if (err?.name === 'NotFound' || err?.Code === 'NotFound') return false
    throw err
  }
}

function webpKey(sourceKey, width) {
  return sourceKey.replace(/\.(png|jpe?g|webp|avif)$/i, `.w${width}.webp`)
}

async function optimizeOne(sourceKey) {
  const input = await fetchSource(sourceKey)
  const meta = await sharp(input).metadata()
  const results = []

  for (const width of WIDTHS) {
    const targetW = Math.min(width, meta.width || width)
    const outKey = webpKey(sourceKey, width)
    const buf = await sharp(input)
      .rotate()
      .resize({ width: targetW, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 4 })
      .toBuffer()

    const localOut = path.join(outDir, outKey.replace(/\//g, '__'))
    fs.writeFileSync(localOut, buf)

    const ratio = ((buf.length / input.length) * 100).toFixed(1)
    results.push({
      outKey,
      bytes: buf.length,
      sourceBytes: input.length,
      ratio,
      buf,
    })

    if (DRY_RUN || SKIP_UPLOAD) continue

    const exists = await objectExists(outKey)
    if (exists && process.env.FORCE !== '1') {
      console.log(`  skip (exists) ${outKey}`)
      continue
    }

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: outKey,
        Body: buf,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000, immutable',
      })
    )
    console.log(
      `  uploaded ${outKey} (${(buf.length / 1024).toFixed(1)} KB, ${ratio}% of source)`
    )
  }

  return results
}

async function main() {
  console.log(`Optimizing ${HOMEPAGE_IMAGES.length} homepage images → WebP @ ${WIDTHS.join('/')}`)
  console.log(`Bucket=${bucket} DRY_RUN=${DRY_RUN} SKIP_UPLOAD=${SKIP_UPLOAD}`)

  let totalSrc = 0
  let totalOut = 0
  let ok = 0
  let fail = 0

  for (const key of HOMEPAGE_IMAGES) {
    try {
      console.log(`\n→ ${key}`)
      const rows = await optimizeOne(key)
      if (rows[0]) {
        totalSrc += rows[0].sourceBytes
        totalOut += rows.reduce((s, r) => s + r.bytes, 0)
      }
      ok += 1
    } catch (err) {
      fail += 1
      console.error(`  FAIL ${key}:`, err.message || err)
    }
  }

  console.log('\n=== Summary ===')
  console.log(`ok=${ok} fail=${fail}`)
  console.log(
    `source≈${(totalSrc / 1024 / 1024).toFixed(1)} MB → variants≈${(totalOut / 1024 / 1024).toFixed(1)} MB (all widths)`
  )
  console.log(`Local copies in ${outDir}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
