import { withPayload } from '@payloadcms/next/withPayload'

const isDev = process.env.NODE_ENV !== 'production'

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      isDev
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://www.googletagmanager.com/gtm.js https://challenges.cloudflare.com https://cdn.jsdelivr.net"
        : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://www.googletagmanager.com/gtm.js https://challenges.cloudflare.com https://cdn.jsdelivr.net",
      isDev
        ? "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://challenges.cloudflare.com https://cdn.jsdelivr.net"
        : "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://www.googletagmanager.com/gtm.js https://challenges.cloudflare.com https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' https: https://video.gumlet.io https://play.gumlet.io",
      "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://challenges.cloudflare.com https://play.gumlet.io https://www.google.com https://maps.google.com https://fast.wistia.net https://fast.wistia.com",
      "connect-src 'self' https://api.resend.com https://www.google-analytics.com https://www.googletagmanager.com https://stats.g.doubleclick.net https://connect.facebook.net https://www.facebook.com https://vitals.vercel-insights.com https://*.wistia.com https://*.wistia.net https://*.r2.dev https://video.gumlet.io https://play.gumlet.io https://challenges.cloudflare.com",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "frame-ancestors 'self'",
    ].join('; '),
  },
]

import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output bundles server.js + minimal node_modules for Docker
  output: 'standalone',

  // Pin the tracing root to this directory so Next.js does not walk up to the
  // parent workspace and warn about multiple lockfiles.
  outputFileTracingRoot: __dirname,

  // React Strict Mode
  reactStrictMode: true,

  // Performance: Enable compression (gzip)
  compress: true,

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Cloudflare R2 default public URLs (pub-<id>.r2.dev)
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      // Allow custom R2 domain if configured via NEXT_PUBLIC_R2_PUBLIC_URL
      ...(process.env.NEXT_PUBLIC_R2_PUBLIC_URL
        ? [
            {
              protocol: 'https',
              hostname: new URL(process.env.NEXT_PUBLIC_R2_PUBLIC_URL).hostname,
            },
          ]
        : []),
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },

  // ─── 301 Redirects from WordPress ────────────────────────────────────────
  async redirects() {
    // Helper to build a redirect entry
    const r = (source, destination) => ({ source, destination, permanent: true });

    return [
      // ── Blog Posts → /blog ────────────────────────────────────────────────
      r('/should-i-consider-getting-a-hair-system', '/blog/should-i-consider-getting-a-hair-system'),
      r('/what-causes-itchiness-or-irritation-in-hair-systems', '/blog/what-causes-itchiness-or-irritation-in-hair-systems'),
      r('/the-benefits-of-scalp-micropigmentation-for-thinning-hair-in-india', '/blog/the-benefits-of-scalp-micropigmentation-for-thinning-hair-in-india'),
      r('/travel-tips-for-hair-system-wearers', '/blog/travel-tips-for-hair-system-wearers'),
      r('/myths-about-non-surgical-hair-replacement', '/blog/myths-about-non-surgical-hair-replacement'),
      r('/most-natural-looking-hairline-patches-in-india', '/blog/most-natural-looking-hairline-patches-in-india'),
      r('/selecting-the-correct-hair-density-for-your-hair-system', '/blog/selecting-the-correct-hair-density-for-your-hair-system'),
      r('/are-hair-patches-safe', '/blog/are-hair-patches-safe'),
      r('/everything-you-need-to-know-about-hair-systems-for-men', '/blog/everything-you-need-to-know-about-hair-systems-for-men'),
      r('/everything-you-need-to-know-about-maintaining-your-hair-system-in-india', '/blog/everything-you-need-to-know-about-maintaining-your-hair-system-in-india'),
      r('/9-reasons-smart-professionals-are-switching-to-modern-hair-systems', '/blog/9-reasons-smart-professionals-are-switching-to-modern-hair-systems'),
      r('/your-friends-are-balding-too-but-you-dont-have-to-join-them', '/blog/your-friends-are-balding-too-but-you-dont-have-to-join-them'),
      r('/bollywoods-silent-trend-the-rise-of-non-surgical-hair-systems', '/blog/bollywoods-silent-trend-the-rise-of-non-surgical-hair-systems'),
      r('/client-facing-role-this-hair-hack-boosts-visual-credibility', '/blog/client-facing-role-this-hair-hack-boosts-visual-credibility'),
      r('/from-bald-spot-to-bollywood-look-how-clip-on-systems-create-instant-volume', '/blog/from-bald-spot-to-bollywood-look-how-clip-on-systems-create-instant-volume'),
      r('/can-breathable-hair-system-bases-reduce-sweat-in-humid-weather', '/blog/can-breathable-hair-system-bases-reduce-sweat-in-humid-weather'),
      r('/are-you-shortening-your-hair-patch-lifespan-with-poor-aftercare-practices', '/blog/are-you-shortening-your-hair-patch-lifespan-with-poor-aftercare-practices'),
      r('/can-modern-hair-systems-really-survive-gym-workouts-and-running', '/blog/can-modern-hair-systems-really-survive-gym-workouts-and-running'),
      r('/hair-transplants-in-your-20s-smart-move-or-lifetime-regret', '/blog/hair-transplants-in-your-20s-smart-move-or-lifetime-regret'),
      r('/can-you-really-shower-swim-and-sleep-with-a-stick-on-system', '/blog/can-you-really-shower-swim-and-sleep-with-a-stick-on-system'),
      r('/hair-patch-for-men-or-hair-transplant-in-india-whats-right-for-you', '/blog/hair-patch-for-men-or-hair-transplant-in-india-whats-right-for-you'),
      r('/is-hair-patch-a-better-solution-than-a-hair-transplant', '/blog/is-hair-patch-a-better-solution-than-a-hair-transplant'),
      r('/things-you-need-to-consider-before-buying-hair-wigs', '/blog/things-you-need-to-consider-before-buying-hair-wigs'),
      r('/the-truth-about-swiss-lace-hair-patches-in-india', '/blog/the-truth-about-swiss-lace-hair-patches-in-india'),
      r('/get-a-natural-look-with-non-surgical-hair-replacement-for-the-crown-area', '/blog/get-a-natural-look-with-non-surgical-hair-replacement-for-the-crown-area'),
      r('/how-to-choose-the-right-hairstyle-for-hair-systems', '/blog/how-to-choose-the-right-hairstyle-for-hair-systems'),
      r('/is-scalp-micro-pigmentation-common-in-india', '/blog/is-scalp-micro-pigmentation-common-in-india'),
      r('/does-a-hair-system-damage-the-hair-underneath-scalp', '/blog/does-a-hair-system-damage-the-hair-underneath-scalp'),
      r('/common-challenges-of-non-surgical-hair-replacement', '/blog/common-challenges-of-non-surgical-hair-replacement'),
      r('/human-hair-systems-or-synthetic-hair-systems-which-ones-the-best', '/blog/human-hair-systems-or-synthetic-hair-systems-which-ones-the-best'),
      r('/does-scalp-micropigmentation-look-natural-and-real', '/blog/does-scalp-micropigmentation-look-natural-and-real'),
      r('/failed-hair-transplant-in-india-how-to-avoid-or-fix-it', '/blog/failed-hair-transplant-in-india-how-to-avoid-or-fix-it'),
      r('/human-hair-wigs-for-cancer-or-alopecia', '/blog/human-hair-wigs-for-cancer-or-alopecia'),

      // ── Utility Pages → / ────────────────────────────────────────────────
      r('/contact', '/contact-us'),
      r('/cart', '/'),
      r('/shop', '/'),
      r('/my-account', '/'),
      r('/my-account/lost-password', '/'),
      r('/u-n-l-framework', '/'),

      // ── WordPress Archives / Categories / Author / Pagination → / ────────
      r('/blogs', '/blog'),
      r('/blogs/page/2', '/blog'),
      r('/blogs/page/3', '/blog'),
      r('/blogs/page/16', '/blog'),
      r('/category/clip-on-hair-systems', '/'),
      r('/category/hair-transplant', '/'),
      r('/category/hair-replacement-systems', '/'),
      r('/category/hair-replacement-systems/non-surgical-hair-replacement-systems', '/'),
      r('/category/hair-patch-for-men', '/'),
      r('/category/stick-on-hair-system', '/'),
      r('/category/scalp-micro-pigmentation', '/'),
      r('/category/uncategorized', '/'),
      r('/product-category/clip-on-hair-systems', '/'),
      r('/product-category/uncategorized', '/'),
      r('/author/digitalalchamane', '/'),

      // ── WordPress Date Archives → / ──────────────────────────────────────
      r('/2022/12', '/'),
      r('/2023/01', '/'),
      r('/2023/02', '/'),
      r('/2023/03', '/'),
      r('/2023/04', '/'),
      r('/2023/05', '/'),
      r('/2023/06', '/'),
      r('/2023/07', '/'),
      r('/2023/09', '/'),
      r('/2023/10', '/'),
      r('/2023/11', '/'),
      r('/2023/12', '/'),
      r('/2024/01', '/'),
      r('/2024/02', '/'),
      r('/2024/03', '/'),
      r('/2024/05', '/'),
      r('/2024/06', '/'),
      r('/2024/07', '/'),
      r('/2024/08', '/'),
      r('/2024/09', '/'),
      r('/2024/10', '/'),
      r('/2024/12', '/'),
      r('/2025/01', '/'),
      r('/2025/02', '/'),
      r('/2025/03', '/'),
      r('/2025/04', '/'),
      r('/2025/05', '/'),
      r('/2025/06', '/'),
      r('/2025/07', '/'),
      r('/2025/08', '/'),
      r('/2025/09', '/'),
      r('/2025/10', '/'),
      r('/2025/11', '/'),
      r('/2025/12', '/'),
      r('/2026/01', '/'),
      r('/2026/02', '/'),
      r('/2026/03', '/'),

      // ── City-Specific 404 Remediation (Hair System → Hair Replacement) ──
      r('/non-surgical-hair-system-in-mumbai', '/non-surgical-hair-replacement-in-mumbai'),
      r('/hair-system-in-mumbai', '/non-surgical-hair-replacement-in-mumbai'),
      r('/non-surgical-hair-system-in-bangalore', '/non-surgical-hair-replacement-in-bangalore'),
      r('/non-surgical-hair-system-in-chennai', '/non-surgical-hair-replacement-in-chennai'),
      r('/non-surgical-hair-system-in-hyderabad', '/non-surgical-hair-replacement-in-hyderabad'),
      r('/non-surgical-hair-system-in-delhi', '/non-surgical-hair-replacement-systems-in-delhi'),
      r('/non-surgical-hair-system-in-pune', '/non-surgical-hair-replacement-for-men-in-pune'),
      r('/non-surgical-hair-system-in-kolkata', '/hair-replacement-systems-for-men-in-kolkata'),
      r('/non-surgical-hair-system-in-goa', '/hair-replacement-systems-for-men-in-goa'),
      r('/non-surgical-hair-system-in-lucknow', '/hair-replacement-systems-for-men-in-lucknow'),
      r('/non-surgical-hair-system-in-ahmedabad', '/hair-replacement-systems-in-ahmedabad'),
      r('/non-surgical-hair-system-in-surat', '/non-surgical-hair-replacement-in-surat'),
      r('/non-surgical-hair-system-in-punjab', '/non-surgical-hair-replacement-in-punjab'),
      r('/non-surgical-hair-system-in-rajasthan', '/non-surgical-hair-replacement-in-rajasthan'),
    ];
  },

  // Homepage-v2 (and other) assets live in R2 under media/* because public/media
  // is gitignored. In production, proxy /media/* to the public R2 URL so deploys
  // do not need the 600MB+ folder baked into the image.
  async rewrites() {
    const r2 = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '').replace(/\/$/, '')
    if (!r2) return []
    // Local: prefer disk files when present. Force R2 with MEDIA_REWRITE_R2=1.
    if (process.env.NODE_ENV !== 'production' && process.env.MEDIA_REWRITE_R2 !== '1') {
      return []
    }
    return [
      {
        source: '/media/:path*',
        destination: `${r2}/media/:path*`,
      },
    ]
  },
}

export default withPayload(nextConfig)
