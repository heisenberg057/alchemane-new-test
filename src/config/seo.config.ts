import { Metadata } from 'next';
import { SITE_ASSET_URLS } from './siteAssetUrls';

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://americanhairline.com').replace(
  /\/$/,
  ''
);

export const defaultSEO: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Non Surgical Hair Replacement in India | Hair Patch & Wigs For Men',
    template: '%s | American Hairline',
  },
  description: 'Discover the best non-surgical hair replacement for men at American Hairline. Achieve a natural look with customized solutions for hair restoration.',
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: APP_URL,
    siteName: 'American Hairline',
    title: 'Non Surgical Hair Replacement in India | Hair Patch & Wigs For Men',
    description: 'Discover the best non-surgical hair replacement for men at American Hairline. Achieve a natural look with customized solutions for hair restoration.',
    images: [
      {
        url: SITE_ASSET_URLS.defaultSocialImage,
        width: 1200,
        height: 630,
        alt: 'American Hairline',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Non Surgical Hair Replacement in India | Hair Patch & Wigs For Men',
    description: 'Discover the best non-surgical hair replacement for men at American Hairline. Achieve a natural look with customized solutions for hair restoration.',
    images: [SITE_ASSET_URLS.defaultSocialImage],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
