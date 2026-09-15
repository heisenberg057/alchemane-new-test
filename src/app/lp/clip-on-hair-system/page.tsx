import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { ClipOnLandingPage } from '@/components/clip-on-lp/ClipOnLandingPage';
import { getFunnelMeta } from '@/config/funnel-pages';
import { buildPageMetadata } from '@/lib/seo/buildPageMetadata';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-clip-on-roboto',
  display: 'swap',
});

const meta = getFunnelMeta('clip-on-hair-system');

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

export default function ClipOnHairSystemPage() {
  return (
    <div className={roboto.variable}>
      <ClipOnLandingPage />
    </div>
  );
}
