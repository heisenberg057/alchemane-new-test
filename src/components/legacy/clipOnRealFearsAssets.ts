// Clip-On Hair System page — "The Real Fears Men Have" section asset manifest
// Uploaded via Payload media → Cloudflare R2

const BASE = "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media";

// Desktop: 1600×1200 (4/3) displayed at width:544px aspectRatio:'4/3' | media ID 329
// Mobile: 1670×1025 (145/89) displayed w-full aspectRatio:'145/89' | media ID 330
export const CLIP_ON_REAL_FEARS_ASSETS = {
  desktop: {
    url: `${BASE}/The Real Fears Men Have section image.png`,
    alt: "Man contemplating hair loss — The Real Fears Men Have (desktop)",
  },
  mobile: {
    url: `${BASE}/The Real Fears Men Have section image-1.png`,
    alt: "Man contemplating hair loss — The Real Fears Men Have (mobile)",
  },
} as const;
