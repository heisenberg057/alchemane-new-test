/**
 * Migrates external hero images used in `/lp/*` funnel pages into R2.
 *
 * What it does:
 * - Reads `src/content/funnel/manifest.json` to find the first N sections per slug.
 * - Extracts <img src="..."> URLs from those sections only (to keep it bounded).
 * - Downloads each unique image and uploads to R2 (S3-compatible).
 * - Rewrites the HTML section files to use the new public R2 URLs.
 *
 * Env vars (same as other upload scripts):
 * - NEXT_PUBLIC_R2_PUBLIC_URL
 * - R2_BUCKET_NAME
 * - R2_ENDPOINT
 * - R2_ACCESS_KEY_ID
 * - R2_SECRET_ACCESS_KEY
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { config as loadDotEnv } from 'dotenv';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

loadDotEnv({ path: path.join(projectRoot, '.env.local') });
loadDotEnv({ path: path.join(projectRoot, '.env'), override: false });

const CONTENT_DIR = path.join(projectRoot, 'src', 'content', 'funnel');
const MANIFEST_PATH = path.join(CONTENT_DIR, 'manifest.json');

const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, '');
const bucket = process.env.R2_BUCKET_NAME;
const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!publicBase || !bucket || !endpoint || !accessKeyId || !secretAccessKey) {
  throw new Error('Missing one or more required R2 environment variables for funnel image migration.');
}

const heroSectionCount = Number(process.env.FUNNEL_HERO_SECTION_COUNT ?? 1);
if (!Number.isFinite(heroSectionCount) || heroSectionCount < 1) {
  throw new Error('FUNNEL_HERO_SECTION_COUNT must be >= 1');
}

const EXTERNAL_SRC_ALLOWLIST = [
  'lh3.googleusercontent.com',
  'cdn.shopify.com',
];

const client = new S3Client({
  region: 'auto',
  endpoint,
  forcePathStyle: true,
  credentials: { accessKeyId, secretAccessKey },
});

function objectKey(filename) {
  return `media/${filename}`;
}

function publicUrl(filename) {
  return `${publicBase}/media/${filename}`;
}

async function objectExists(key) {
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch (err) {
    const status = err?.$metadata?.httpStatusCode;
    if (status === 404) return false;
    // If it’s an auth/endpoint issue, fail fast.
    if (status && status >= 400 && status !== 404) throw err;
    return false;
  }
}

function guessExt(url) {
  try {
    const u = new URL(url);
    const pathname = u.pathname;
    const m = pathname.match(/\\.([a-zA-Z0-9]+)$/);
    if (!m) return '.jpg';
    const ext = m[1].toLowerCase();
    return ext.length <= 5 ? `.${ext}` : '.jpg';
  } catch {
    return '.jpg';
  }
}

function guessContentType(ext) {
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.avif':
      return 'image/avif';
    case '.jpeg':
    case '.jpg':
      return 'image/jpeg';
    default:
      return 'application/octet-stream';
  }
}

function extractImgSrcs(html) {
  const srcs = new Set();

  const reDouble = /<img\b[^>]*\bsrc="([^"]+)"/gi;
  const reSingle = /<img\b[^>]*\bsrc='([^']+)'/gi;

  let m;
  while ((m = reDouble.exec(html))) srcs.add(m[1]);
  while ((m = reSingle.exec(html))) srcs.add(m[1]);

  return [...srcs];
}

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`);
  }
  const contentType = res.headers.get('content-type') ?? undefined;
  const arrayBuffer = await res.arrayBuffer();
  return { contentType, body: Buffer.from(arrayBuffer) };
}

function stableHash(s) {
  return crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

  for (const [slug, entry] of Object.entries(manifest)) {
    const sectionIds = entry?.sectionIds ?? [];
    const heroIds = sectionIds.slice(0, heroSectionCount);
    if (!heroIds.length) continue;

    for (const sectionId of heroIds) {
      const filePath = path.join(CONTENT_DIR, slug, `${sectionId}.html`);
      if (!fs.existsSync(filePath)) continue;

      const html = fs.readFileSync(filePath, 'utf8');
      const srcs = extractImgSrcs(html);

      const replacements = new Map(); // oldSrc -> newSrc

      for (const src of srcs) {
        if (!src.startsWith('http')) continue;

        let hostname;
        try {
          hostname = new URL(src).hostname;
        } catch {
          continue;
        }

        if (!EXTERNAL_SRC_ALLOWLIST.some((h) => h === hostname)) continue;

        if (replacements.has(src)) continue;

        const ext = guessExt(src);
        const filename = `funnel-${slug}-hero-${stableHash(src)}${ext}`;
        const key = objectKey(filename);

        if (!(await objectExists(key))) {
          const { contentType, body } = await download(src);
          const finalContentType = contentType ?? guessContentType(ext);

          await client.send(
            new PutObjectCommand({
              Bucket: bucket,
              Key: key,
              Body: body,
              ContentType: finalContentType,
              CacheControl: 'public, max-age=31536000, immutable',
            })
          );
        }

        replacements.set(src, publicUrl(filename));
      }

      if (replacements.size) {
        let nextHtml = html;
        for (const [oldSrc, newSrc] of replacements.entries()) {
          // Simple global replace is safe enough here because we’re replacing full src strings.
          nextHtml = nextHtml.split(oldSrc).join(newSrc);
        }
        fs.writeFileSync(filePath, nextHtml, 'utf8');
        console.log(`✓ ${slug}/${sectionId}: rewrote ${replacements.size} image(s)`);
      }
    }
  }
}

main().catch((err) => {
  console.error('Funnel hero image migration failed:', err);
  process.exit(1);
});

