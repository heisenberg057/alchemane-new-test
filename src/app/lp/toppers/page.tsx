import type { Metadata } from 'next';
import { Manrope, Newsreader } from 'next/font/google';
import { AlchemaneToppersLandingPage } from '@/components/alchemane-toppers-lp/AlchemaneToppersLandingPage';
import { TOPPERS_META } from '@/components/alchemane-toppers-lp/content';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-alchemane-sans' });
const newsreader = Newsreader({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-alchemane-serif' });

export const metadata: Metadata = {
  title: { absolute: TOPPERS_META.title },
  description: TOPPERS_META.description,
  openGraph: {
    title: TOPPERS_META.title,
    description: TOPPERS_META.description,
    type: 'website',
  },
};

export default function AlchemaneToppersPage() {
  return (
    <div className={`${manrope.variable} ${newsreader.variable}`}>
      <AlchemaneToppersLandingPage />
    </div>
  );
}
