import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { FunnelPage } from '@/components/funnel/FunnelPage';
import { FUNNEL_SLUGS, getFunnelMeta, isFunnelSlug } from '@/config/funnel-pages';
import { loadFunnelSections } from '@/lib/funnel/loadFunnelSections';
import { buildPageMetadata } from '@/lib/seo/buildPageMetadata';

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Dedicated React LPs — not HTML funnel blocks. */
const HTML_FUNNEL_SLUGS = FUNNEL_SLUGS.filter(
  (slug) =>
    slug !== 'hair-loss-solution-bangalore' && slug !== 'clip-on-hair-system',
);

export function generateStaticParams() {
  return HTML_FUNNEL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isFunnelSlug(slug)) return {};
  const meta = getFunnelMeta(slug);
  return buildPageMetadata({
    title: meta.title,
    description: meta.description,
    canonical: `/lp/${slug}`,
    robots: meta.indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    fallbackTitle: meta.title,
    fallbackDescription: meta.description,
  });
}

export default async function FunnelLandingPage({ params }: PageProps) {
  const { slug } = await params;
  if (
    !isFunnelSlug(slug) ||
    slug === 'hair-loss-solution-bangalore' ||
    slug === 'clip-on-hair-system'
  ) {
    notFound();
  }

  const meta = getFunnelMeta(slug);
  const sections = loadFunnelSections(slug);

  return <FunnelPage meta={meta} sections={sections} />;
}
