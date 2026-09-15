import path from 'path';
import { fileURLToPath } from 'url';
import { config as loadDotEnv } from 'dotenv';
import type { Payload } from 'payload';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

loadDotEnv({ path: path.join(projectRoot, '.env.local') });

const ASSET_ROOT = path.resolve(projectRoot, '..');
const DESKTOP_CARD    = path.join(ASSET_ROOT, 'WEBSITE', 'HOW LONG WILL IT LAST (CLIP-ON)', 'DESKTOP', 'Two Base Options for Your Clip-On Hair System section inside card image');
const DESKTOP_OVERLAY = path.join(ASSET_ROOT, 'WEBSITE', 'HOW LONG WILL IT LAST (CLIP-ON)', 'DESKTOP', 'Overlay of Two Base Options for Your Clip-On Hair System section image');
const MOBILE_CARD     = path.join(ASSET_ROOT, 'WEBSITE', 'HOW LONG WILL IT LAST (CLIP-ON)', 'MOBILE', 'Two Base Options for Your Clip-On Hair System section inside card image');
const MOBILE_OVERLAY  = path.join(ASSET_ROOT, 'WEBSITE', 'HOW LONG WILL IT LAST (CLIP-ON)', 'MOBILE', 'Overlay of Two Base Options for Your Clip-On Hair System section image');

const TARGETS = [
  { key: 'thin-card-desktop',    filePath: path.join(DESKTOP_CARD,    'Thin base card.png'),     title: 'clip-on-lifespan-thin-base-card-desktop',    alt: 'Thin Base + Low Density Clip-On Hair System' },
  { key: 'thick-card-desktop',   filePath: path.join(DESKTOP_CARD,    'Thick base card.png'),    title: 'clip-on-lifespan-thick-base-card-desktop',   alt: 'Thick Base + High Density Clip-On Hair System' },
  { key: 'thin-card-mobile',     filePath: path.join(MOBILE_CARD,     'Thin base card.png'),     title: 'clip-on-lifespan-thin-base-card-mobile',     alt: 'Thin Base + Low Density Clip-On Hair System (mobile)' },
  { key: 'thick-card-mobile',    filePath: path.join(MOBILE_CARD,     'Thick base card.png'),    title: 'clip-on-lifespan-thick-base-card-mobile',    alt: 'Thick Base + High Density Clip-On Hair System (mobile)' },
  { key: 'thin-overlay-desktop', filePath: path.join(DESKTOP_OVERLAY, 'Overlay Thin base.png'),  title: 'clip-on-lifespan-thin-base-overlay-desktop',  alt: 'Thin Base Clip-On – overlay detail view' },
  { key: 'thick-overlay-desktop',filePath: path.join(DESKTOP_OVERLAY, 'Overlay Thick base.png'), title: 'clip-on-lifespan-thick-base-overlay-desktop', alt: 'Thick Base Clip-On – overlay detail view' },
  { key: 'thin-overlay-mobile',  filePath: path.join(MOBILE_OVERLAY,  'Overlay Thin base.png'),  title: 'clip-on-lifespan-thin-base-overlay-mobile',   alt: 'Thin Base Clip-On – overlay detail view (mobile)' },
  { key: 'thick-overlay-mobile', filePath: path.join(MOBILE_OVERLAY,  'Overlay Thick base.png'), title: 'clip-on-lifespan-thick-base-overlay-mobile',  alt: 'Thick Base Clip-On – overlay detail view (mobile)' },
];

function getPublicUrl(doc: Record<string, unknown>) {
  const filename = typeof doc.filename === 'string' ? doc.filename : null;
  const directUrl = typeof doc.url === 'string' ? doc.url : null;
  const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (directUrl) return directUrl;
  if (publicBase && filename) return `${publicBase}/media/${filename}`;
  return null;
}

async function findExistingMediaByTitle(payload: Payload, title: string) {
  const res = await payload.find({ collection: 'media', where: { title: { equals: title } }, limit: 1, depth: 0, overrideAccess: true });
  return res.docs[0] ?? null;
}

async function main() {
  const [{ getPayload }, { default: configPromise }] = await Promise.all([
    import('payload'),
    import('../payload.config'),
  ]);
  const payload = await getPayload({ config: configPromise });
  const output: Record<string, unknown>[] = [];

  for (const target of TARGETS) {
    const existing = await findExistingMediaByTitle(payload, target.title);
    if (existing) {
      output.push({ key: target.key, status: 'reused', id: existing.id, title: existing.title, url: getPublicUrl(existing as Record<string, unknown>) });
      continue;
    }
    const created = await payload.create({
      collection: 'media',
      data: { alt: target.alt, title: target.title },
      filePath: target.filePath,
      overrideAccess: true,
      depth: 0,
    });
    output.push({ key: target.key, status: 'created', id: created.id, title: created.title, url: getPublicUrl(created as Record<string, unknown>) });
  }

  console.log(JSON.stringify(output, null, 2));
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
