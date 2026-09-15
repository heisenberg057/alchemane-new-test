import type { Metadata } from 'next';
import { Manrope, Newsreader } from 'next/font/google';
import { AlchemaneThankYouPage } from '@/components/alchemane/AlchemaneThankYouPage';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-alchemane-sans' });
const newsreader = Newsreader({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-alchemane-serif' });

export const metadata: Metadata = {
  title: { absolute: 'Thank You | Alchemane' },
  robots: { index: false, follow: false },
};

export default function AlchemaneExtensionThankYouPage() {
  return (
    <div className={`${manrope.variable} ${newsreader.variable}`}>
      <AlchemaneThankYouPage
        mediaBase="alchemane-extension-lp"
        brandLine="Alchemane Hair Extensions"
        productTerm="hair extensions"
        whatsappHref="#"
        youtubeHref="#"
      />
    </div>
  );
}
