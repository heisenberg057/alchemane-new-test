// Clip-On Hair System page — Hero section asset manifest
// Uploaded via Payload media → Cloudflare R2

const BASE = "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media";

// Desktop: 1920×1080 displayed at max-w-[1120px] aspect-ratio 16/9 | media ID 325
// Mobile: 1080×1350 displayed at max-w-[359px] aspect-ratio 117/146 | media ID 326
export const CLIP_ON_HERO_ASSETS = {
  desktop: {
    url: `${BASE}/CLIP ON HAIR SYSTEM.png`,
    alt: "Clip-on hair system before and after result — natural hairline coverage without shaving (desktop)",
  },
  mobile: {
    url: `${BASE}/CLIP ON HAIR SYSTEM 4X5.png`,
    alt: "Clip-on hair system before and after result — natural hairline coverage without shaving (mobile)",
  },
} as const;
