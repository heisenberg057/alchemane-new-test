import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { BangaloreLandingPage } from '@/components/bangalore-lp/BangaloreTestingPage';
import { buildPageMetadata } from '@/lib/seo/buildPageMetadata';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-bangalore-roboto',
  display: 'swap',
});

export const metadata: Metadata = buildPageMetadata({
  title: 'Bangalore LP Hero Test | American Hairline',
  description:
    'Internal test page for the Bangalore landing-page hero section (design → Next.js).',
  canonical: '/lp/bangalore-testing',
  robots: { index: false, follow: false },
  fallbackTitle: 'Bangalore LP Hero Test | American Hairline',
  fallbackDescription:
    'Internal test page for the Bangalore landing-page hero section (design → Next.js).',
});

export default function BangaloreTestingRoute() {
  return (
    <div className={roboto.variable}>
      <BangaloreLandingPage testing />
    </div>
  );
}
