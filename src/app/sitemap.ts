import { MetadataRoute } from 'next';
import { FUNNEL_PAGE_META, FUNNEL_SLUGS } from '@/config/funnel-pages';

const safeDate = (date: string | undefined) => {
  const d = new Date(date ?? '');
  return isNaN(d.getTime()) ? new Date() : d;
};

type SitemapPost = { slug: string; updatedAt?: string; createdAt?: string };
type SitemapProduct = { slug?: string; id: string | number; updatedAt?: string; createdAt?: string };

/**
 * Fetch posts directly from Payload in-process, bypassing HTTP entirely.
 * This is the primary path — it works at build time with no running server.
 */
async function getPostsDirect(): Promise<SitemapPost[]> {
  const { getPayloadSingleton } = await import('@/lib/api/getPayload');
  const payload = await getPayloadSingleton();
  const result = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit: 200,
    depth: 0,
    overrideAccess: true,
  });
  return result.docs.map((d) => ({
    slug: d.slug as string,
    updatedAt: d.updatedAt as string | undefined,
    createdAt: d.createdAt as string | undefined,
  }));
}

async function getProductsDirect(): Promise<SitemapProduct[]> {
  const { getPayloadSingleton } = await import('@/lib/api/getPayload');
  const payload = await getPayloadSingleton();
  // Products use a plain `status` field (not Payload draft _status)
  const result = await payload.find({
    collection: 'products',
    where: { status: { equals: 'active' } },
    limit: 200,
    depth: 0,
    overrideAccess: true,
  });
  return result.docs.map((d) => ({
    id: d.id as string | number,
    slug: d.slug as string | undefined,
    updatedAt: d.updatedAt as string | undefined,
    createdAt: d.createdAt as string | undefined,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://americanhairline.com').replace(
    /\/$/,
    ''
  );

  // Static routes
  const routes = [
    '',
    '/about-us',
    '/contact-us',
    '/consultation-form',
    '/blog',
    '/products',
    '/results',
    '/scalp-micropigmentation',
    '/hair-transplant',
    '/hair-patch-vs-hair-system',
    '/clip-on-or-stick-on',
    '/clip-on-or-stick-on/clip-on-hair-system',
    '/clip-on-or-stick-on/stick-on-hair-system',
    '/clip-on-system-lifespan',
    '/stick-on-system-lifespan',
    '/will-my-hairline-look-real',
    '/career',
    // ── Priority 1 Service Pages ────────────────────────────────────────
    '/hair-patch-for-men',
    '/hair-replacement-for-men',
    '/hair-wigs-for-men',
    '/swiss-lace-hair-patch',
    '/skin-base-hair-systems',
    '/clip-on-hair-system',
    '/customized-hair-systems',
    '/crown-area-patch',
    // ── City Pages ─────────────────────────────────────────────────────
    '/non-surgical-hair-replacement-in-mumbai',
    '/non-surgical-hair-replacement-systems-in-delhi',
    '/non-surgical-hair-replacement-in-bangalore',
    '/non-surgical-hair-replacement-in-chennai',
    '/non-surgical-hair-replacement-in-hyderabad',
    '/non-surgical-hair-replacement-in-punjab',
    '/non-surgical-hair-replacement-in-rajasthan',
    '/non-surgical-hair-replacement-in-surat',
    '/non-surgical-hair-replacement-for-men-in-pune',
    '/hair-replacement-systems-for-men-in-goa',
    '/hair-replacement-systems-for-men-in-kolkata',
    '/hair-replacement-systems-for-men-in-lucknow',
    '/hair-replacement-systems-in-ahmedabad',
    '/hair-wigs-for-men-in-mumbai',
    '/hair-wigs-for-men-in-delhi',
    '/hair-wigs-for-men-in-bangalore',
    '/hair-wigs-for-men-in-chennai',
    '/hair-wigs-for-men-in-hyderabad',
    '/hair-wigs-for-men-in-kolkata',
    '/hair-wigs-for-men-in-pune',
    // ── Legacy marketing pages (merged from Updated-Design) ───────────────
    '/australian-mirage-hair-patch',
    '/common-questions',
    '/support',
    '/disclaimer',
    '/front-hairline-patch',
    '/hair-replacement-for-men-in-chennai',
    '/hair-replacement-for-men-in-punjab',
    '/hair-replacement-for-men-in-rajasthan',
    '/hair-replacement-services',
    '/non-surgical-hair-replacement',
    '/privacy-policy',
    '/terms-of-service',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const funnelRoutes = FUNNEL_SLUGS.map((slug) => {
    const meta = FUNNEL_PAGE_META[slug];
    if (!meta.indexable) return null;
    return {
      url: `${baseUrl}/lp/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    };
  }).filter(Boolean) as Array<{
    url: string;
    lastModified: Date;
    changeFrequency: 'weekly';
    priority: number;
  }>;

  // Dynamic Blog Posts — query Payload in-process (no HTTP, works at build time)
  let posts: MetadataRoute.Sitemap = [];
  try {
    const docs = await getPostsDirect();
    posts = docs.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: safeDate(post.updatedAt || post.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error(
      'Failed to fetch posts for sitemap (skipping):',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }

  // Dynamic Products — same direct Payload query pattern
  let products: MetadataRoute.Sitemap = [];
  try {
    const docs = await getProductsDirect();
    products = docs.map((product) => ({
      url: `${baseUrl}/products/${product.slug || product.id}`,
      lastModified: safeDate(product.updatedAt || product.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
  } catch (error) {
    console.error(
      'Failed to fetch products for sitemap (skipping):',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }

  return [...routes, ...funnelRoutes, ...posts, ...products];
}
