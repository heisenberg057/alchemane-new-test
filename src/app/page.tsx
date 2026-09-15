import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { cache } from 'react';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { LEGACY_SEO_MAP } from '@/config/legacy-seo-map';
import { defaultSEO } from '@/config/seo.config';
import { homeSchema } from '@/config/page-schemas';
import { buildPageMetadata } from '@/lib/seo/buildPageMetadata';

const HeroSecret = dynamic(() => import('@/components/homepage-v2/HeroSecret'));
const AchievementsFacts = dynamic(() => import('@/components/homepage-v2/AchievementsFacts'));
const Checklist = dynamic(() =>
  import('@/components/homepage/Checklist').then((m) => ({ default: m.Checklist }))
);
const ClientStoriesBacked = dynamic(
  () => import('@/components/homepage-v2/ClientStoriesBacked')
);
const SystemsScanDecide = dynamic(
  () => import('@/components/homepage-v2/SystemsScanDecide')
);
const StoryServicesProcess = dynamic(
  () => import('@/components/homepage-v2/StoryServicesProcess')
);
const MethodsPillarsDeck = dynamic(
  () => import('@/components/homepage-v2/MethodsPillarsDeck')
);
const SalonsFaqForm = dynamic(() => import('@/components/homepage-v2/SalonsFaqForm'));
const Ebook = dynamic(() =>
  import('@/components/homepage/Ebook').then((m) => ({ default: m.Ebook }))
);

const getHomePageData = cache(async () => {
  const { tryGetPayloadSingleton } = await import('@/lib/api/getPayload');
  const payload = await tryGetPayloadSingleton();
  if (!payload) return null;

  try {
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    return result.docs[0] ?? null;
  } catch {
    return null;
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePageData();
  const legacySeo = LEGACY_SEO_MAP['/'];
  const fallbackTitle =
    (typeof defaultSEO.title === 'object' && defaultSEO.title && 'default' in defaultSEO.title
      ? defaultSEO.title.default
      : undefined) ||
    'Non Surgical Hair Replacement in India | Hair Patch & Wigs For Men';
  const fallbackDescription =
    (typeof defaultSEO.description === 'string' && defaultSEO.description) ||
    'Discover the best non-surgical hair replacement for men at American Hairline.';

  if (!page) {
    return buildPageMetadata({
      title: legacySeo?.title || fallbackTitle,
      description: legacySeo?.description || fallbackDescription,
      canonical: (legacySeo?.canonical ||
        defaultSEO.alternates?.canonical ||
        'https://americanhairline.com') as string,
      robots: { index: true, follow: true },
      fallbackTitle,
      fallbackDescription,
    });
  }

  let robotsText = page.isIndexable ? 'index' : 'noindex';
  robotsText += page.isFollowable ? ', follow' : ', nofollow';
  if (page.advancedRobots) robotsText += `, ${page.advancedRobots}`;

  return buildPageMetadata({
    title: page.seoTitle || legacySeo?.title || page.title || fallbackTitle,
    description:
      page.metaDescription || legacySeo?.description || fallbackDescription,
    canonical:
      page.canonicalUrl ||
      legacySeo?.canonical ||
      (defaultSEO.alternates?.canonical as string) ||
      'https://americanhairline.com',
    robots: robotsText,
    ogTitle: page.ogTitle,
    ogDescription: page.ogDescription,
    ogImage: page.ogImage,
    featuredImage: page.featuredImage,
    twitterTitle: page.twitterTitle,
    twitterDescription: page.twitterDescription,
    twitterImage: page.twitterImage,
    fallbackTitle,
    fallbackDescription,
  });
}

export default async function HomePage() {
  const page = await getHomePageData();

  return (
    <>
      {page?.enableSchema !== false && (
        <SchemaMarkup
          schema={(page?.customSchema || homeSchema) as unknown as Record<string, unknown>}
        />
      )}
      {page?.customHeadScripts && (
        <div dangerouslySetInnerHTML={{ __html: page.customHeadScripts }} />
      )}

      <main>
        <HeroSecret />
        <AchievementsFacts />
        <Checklist />
        <ClientStoriesBacked />
        <SystemsScanDecide />
        <StoryServicesProcess />
        <MethodsPillarsDeck />
        <SalonsFaqForm />
        <Ebook />
      </main>

      {page?.customFooterScripts && (
        <div dangerouslySetInnerHTML={{ __html: page.customFooterScripts }} />
      )}
    </>
  );
}
