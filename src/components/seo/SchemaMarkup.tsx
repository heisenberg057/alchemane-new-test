import Script from 'next/script';
import { SITE_ASSET_URLS } from '@/config/siteAssetUrls';

export type SchemaInput = string | Record<string, unknown> | Record<string, unknown>[];

export interface SchemaMarkupProps {
  schema: SchemaInput;
}

const PLACEHOLDER_VIDEO_IDS = ['XHOmBV4js_E'];

function isPlaceholderVideo(node: Record<string, unknown>): boolean {
  if (node['@type'] !== 'VideoObject') return false;
  const haystack = [node.url, node.contentUrl, node.embedUrl, node['@id']]
    .filter((v): v is string => typeof v === 'string')
    .join(' ');
  return PLACEHOLDER_VIDEO_IDS.some((id) => haystack.includes(id));
}

/** Drop nulls / empty strings and strip known placeholder videos from JSON-LD. */
function sanitizeSchemaNode(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value
      .map(sanitizeSchemaNode)
      .filter((item) => item !== undefined && item !== null);
  }

  if (!value || typeof value !== 'object') {
    return value === '' ? undefined : value;
  }

  const record = value as Record<string, unknown>;
  if (isPlaceholderVideo(record)) return undefined;

  const out: Record<string, unknown> = {};
  for (const [key, raw] of Object.entries(record)) {
    if (raw === null || raw === undefined || raw === '') continue;
    const cleaned = sanitizeSchemaNode(raw);
    if (cleaned === undefined || cleaned === null) continue;
    out[key] = cleaned;
  }

  // Ensure VideoObjects always have a usable thumbnail after null stripping
  if (out['@type'] === 'VideoObject' && !out.thumbnailUrl) {
    out.thumbnailUrl = SITE_ASSET_URLS.defaultSocialImage;
  }

  return out;
}

export function SchemaMarkup({ schema }: SchemaMarkupProps) {
  if (!schema) return null;

  // Strings must be valid JSON — never rendered as raw HTML to prevent stored XSS.
  if (typeof schema === 'string') {
    try {
      const parsed = JSON.parse(schema);
      return <SchemaMarkup schema={parsed} />;
    } catch {
      return null;
    }
  }

  const schemas = Array.isArray(schema) ? schema : [schema];
  const valid = schemas
    .map((s) => sanitizeSchemaNode(s))
    .filter(
      (s): s is Record<string, unknown> =>
        !!s && typeof s === 'object' && !Array.isArray(s) && Object.keys(s).length > 0
    );

  if (!valid.length) return null;

  return (
    <>
      {valid.map((s, i) => (
        <Script
          key={i}
          id={`schema-${String(s['@type'] || 'block')}-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  );
}
