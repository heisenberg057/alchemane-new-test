import Script from 'next/script';
import { SITE_ASSET_URLS } from '@/config/siteAssetUrls';

export const OrganizationSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'American Hairline',
    url: 'https://americanhairline.com',
    logo: SITE_ASSET_URLS.logo,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91 9222666111',
      contactType: 'customer service',
    },
    sameAs: [
      'https://facebook.com/americanhairline',
      'https://instagram.com/americanhairline',
      'https://twitter.com/americanhairline',
    ],
  };

  return (
    <Script id="organization-schema" type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(schema)}
    </Script>
  );
};

export const WebsiteSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'American Hairline',
    url: 'https://americanhairline.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://americanhairline.com/blog?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Script id="website-schema" type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(schema)}
    </Script>
  );
};
