import type { Metadata } from 'next';
import { Manrope, Newsreader } from 'next/font/google';
import { AlchemaneExtensionLandingPage } from '@/components/alchemane-extension-lp/AlchemaneExtensionLandingPage';
import { EXTENSION_META } from '@/components/alchemane-extension-lp/content';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-alchemane-sans' });
const newsreader = Newsreader({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-alchemane-serif' });

export const metadata: Metadata = {
  title: { absolute: EXTENSION_META.title },
  description: EXTENSION_META.description,
  openGraph: {
    title: EXTENSION_META.title,
    description: EXTENSION_META.description,
    type: 'website',
  },
};

export default function AlchemaneExtensionPage() {
  return (
    <div className={`${manrope.variable} ${newsreader.variable}`}>
      <AlchemaneExtensionLandingPage />
    </div>
  );
}
