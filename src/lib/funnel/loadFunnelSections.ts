import fs from 'fs';
import path from 'path';
import type { FunnelSlug } from '@/config/funnel-pages';
import manifest from '@/content/funnel/manifest.json';

type Manifest = Record<string, { sectionIds: string[] }>;

const CONTENT_DIR = path.join(process.cwd(), 'src/content/funnel');
const MANIFEST = manifest as Manifest;

export type FunnelSectionPayload = {
  id: string;
  ownerSlug: FunnelSlug;
  sourceSlug: FunnelSlug;
  sectionKey: string;
  fromFallback: boolean;
  fromShared: boolean;
  html: string;
};

function readSectionHtml(sourceSlug: FunnelSlug, id: string): string {
  const filePath = path.join(CONTENT_DIR, sourceSlug, `${id}.html`);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function toPayload(
  ownerSlug: FunnelSlug,
  sourceSlug: FunnelSlug,
  ids: readonly string[],
  keyPrefix = ''
): FunnelSectionPayload[] {
  const fromFallback = keyPrefix.startsWith('fallback:');
  const fromShared = keyPrefix.startsWith('shared:');
  return ids
    .map((id) => {
      const html = readSectionHtml(sourceSlug, id);
      if (!html) return null;
      return {
        id: `${keyPrefix}${ownerSlug}:${sourceSlug}:${id}`,
        ownerSlug,
        sourceSlug,
        sectionKey: id,
        fromFallback,
        fromShared,
        html,
      };
    })
    .filter((section): section is FunnelSectionPayload => Boolean(section));
}

export function loadFunnelSections(slug: FunnelSlug): FunnelSectionPayload[] {
  const entry = MANIFEST[slug];
  if (!entry?.sectionIds?.length) return [];
  return toPayload(slug, slug, entry.sectionIds);
}
