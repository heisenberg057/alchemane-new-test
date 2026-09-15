import type { Metadata } from 'next';
import { Manrope, Newsreader } from 'next/font/google';
import { AlchemaneWigsLandingPage } from '@/components/alchemane-wigs-lp/AlchemaneWigsLandingPage';
import { WIGS_META } from '@/components/alchemane-wigs-lp/content';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-alchemane-sans' });
const newsreader = Newsreader({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-alchemane-serif' });

export const metadata: Metadata = {
  title: { absolute: WIGS_META.title },
  description: WIGS_META.description,
  openGraph: {
    title: WIGS_META.title,
    description: WIGS_META.description,
    type: 'website',
  },
};

export default function AlchemaneWigsPage() {
  return (
    <div className={`${manrope.variable} ${newsreader.variable}`}>
      <AlchemaneWigsLandingPage />
    </div>
  );
}
