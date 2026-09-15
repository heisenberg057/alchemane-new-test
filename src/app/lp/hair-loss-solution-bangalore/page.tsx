import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { BangaloreLandingPage } from '@/components/bangalore-lp/BangaloreTestingPage';
import { getFunnelMeta } from '@/config/funnel-pages';
import { buildPageMetadata } from '@/lib/seo/buildPageMetadata';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-bangalore-roboto',
  display: 'swap',
});

const meta = getFunnelMeta('hair-loss-solution-bangalore');

export const metadata: Metadata = buildPageMetadata({
  title: meta.title,
  description: meta.description,
  canonical: `/lp/${meta.slug}`,
  robots: meta.indexable
    ? { index: true, follow: true }
    : { index: false, follow: false },
  fallbackTitle: meta.title,
  fallbackDescription: meta.description,
});

export default function BangaloreHairLossSolutionPage() {
  return (
    <div className={roboto.variable}>
      <BangaloreLandingPage />
    </div>
  );
}
