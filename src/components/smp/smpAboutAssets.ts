// SMP page — About Scalp Micropigmentation section asset manifest
// Uploaded via Payload media → Cloudflare R2

const BASE = "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media";

export const SMP_ABOUT_ASSETS = {
  // Main section card right-panel image
  card: {
    desktop: {
      url: `${BASE}/image 1-2.png`,
      alt: "About Scalp Micropigmentation — SMP procedure card image",
      // media ID 234 | source: 1920×1080 | display: 1034×582 (167/94)
    },
    mobile: {
      url: `${BASE}/image 1-3.png`,
      alt: "About Scalp Micropigmentation — SMP procedure card image",
      // media ID 235 | source: 1074×1749 | display: 408×665 (127/207)
    },
  },
  // Popup overlay image (replaces right panel on desktop, bottom image on mobile)
  overlay: {
    desktop: {
      url: `${BASE}/image 1-4.png`,
      alt: "About Scalp Micropigmentation — popup overlay image",
      // media ID 236 | source: 1920×1080 | display: 1464×824 (183/103)
    },
    mobile: {
      url: `${BASE}/image 1-5.png`,
      alt: "About Scalp Micropigmentation — popup overlay image",
      // media ID 237 | source: 1074×1749 | display: 537×875 (27/44)
    },
  },
} as const;
