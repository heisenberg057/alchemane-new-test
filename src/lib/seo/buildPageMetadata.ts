import type { Metadata } from 'next';
import { SITE_ASSET_URLS } from '@/config/siteAssetUrls';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || 'https://americanhairline.com'
).replace(/\/$/, '');

const BRAND = 'American Hairline';
const BRAND_SUFFIX = new RegExp(`(\\s*\\|\\s*${BRAND})+$`, 'i');

/** Collapse duplicated "| American Hairline" and decide absolute vs template title. */
export function resolvePageTitle(
  title: string | undefined | null,
  fallback: string
): NonNullable<Metadata['title']> {
  const raw = (title || fallback).trim() || fallback;
  const collapsed = raw.replace(BRAND_SUFFIX, ` | ${BRAND}`).trim();
  // Titles that already include the brand must be absolute or the root
  // template appends it again ("… | American Hairline | American Hairline").
  if (new RegExp(BRAND, 'i').test(collapsed)) {
    return { absolute: collapsed };
  }
  return collapsed;
}

export function absoluteUrl(pathOrUrl: string | undefined | null): string {
  if (!pathOrUrl) return SITE_URL;
  let value = String(pathOrUrl).trim();
  if (!/^https?:\/\//i.test(value)) {
    const path = value.startsWith('/') ? value : `/${value}`;
    value = `${SITE_URL}${path}`;
  }
  // Match Next trailingSlash:false — keep root `/`, strip other trailing slashes.
  if (value.endsWith('/') && !/^https?:\/\/[^/]+\/?$/i.test(value)) {
    value = value.replace(/\/+$/, '');
  }
  return value;
}

export function defaultOgImages(alt = BRAND) {
  return [
    {
      url: SITE_ASSET_URLS.defaultSocialImage,
      width: 1200,
      height: 630,
      alt,
    },
  ];
}

/** Prefer page image; never return [] (that wipes root OG inheritance). */
export function resolveOgImages(
  ...candidates: Array<string | undefined | null>
): NonNullable<NonNullable<Metadata['openGraph']>['images']> {
  for (const c of candidates) {
    if (c && String(c).trim()) {
      return [{ url: absoluteUrl(String(c).trim()) }];
    }
  }
  return defaultOgImages();
}

export function resolveTwitterImages(
  ...candidates: Array<string | undefined | null>
): string[] {
  for (const c of candidates) {
    if (c && String(c).trim()) return [absoluteUrl(String(c).trim())];
  }
  return [SITE_ASSET_URLS.defaultSocialImage];
}

export type BuildPageMetaInput = {
  title?: string | null;
  description?: string | null;
  canonical?: string | null;
  robots?: Metadata['robots'];
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  featuredImage?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
  fallbackTitle: string;
  fallbackDescription: string;
};

export function buildPageMetadata(input: BuildPageMetaInput): Metadata {
  const title = resolvePageTitle(input.title, input.fallbackTitle);
  const description = input.description || input.fallbackDescription;
  const resolvedTitleString =
    typeof title === 'string'
      ? title
      : 'absolute' in title && typeof title.absolute === 'string'
        ? title.absolute
        : input.fallbackTitle;
  const ogTitle = input.ogTitle || resolvedTitleString;
  const ogDescription = input.ogDescription || description;

  return {
    title,
    description,
    alternates: input.canonical
      ? { canonical: absoluteUrl(input.canonical) }
      : undefined,
    robots: input.robots,
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      siteName: BRAND,
      url: input.canonical ? absoluteUrl(input.canonical) : undefined,
      title: ogTitle,
      description: ogDescription,
      images: resolveOgImages(input.ogImage, input.featuredImage),
    },
    twitter: {
      card: 'summary_large_image',
      title: input.twitterTitle || ogTitle,
      description: input.twitterDescription || ogDescription,
      images: resolveTwitterImages(
        input.twitterImage,
        input.ogImage,
        input.featuredImage
      ),
    },
  };
}
