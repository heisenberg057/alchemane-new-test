// Clip-On Hair System page — "Three Things Every Man Wants" section asset manifest
// Uploaded via Payload media → Cloudflare R2

const BASE = "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media";

export const CLIP_ON_THREE_THINGS_ASSETS = [
  {
    emoji: "👀",
    title: "Invisible",
    desc: "Ultra-thin breathable base, undetectable even if someone touches your head.",
    desktop: {
      url: `${BASE}/Invisible.png`,
      alt: "Ultra-thin breathable clip-on hair system base — Invisible (desktop)",
      // media ID 339 | source: 1408×1392
    },
    mobile: {
      url: `${BASE}/invisible.png`,
      alt: "Ultra-thin breathable clip-on hair system base — Invisible (mobile)",
      // media ID 342 | source: 1040×1052
    },
  },
  {
    emoji: "🛡️",
    title: "Safe",
    desc: "Anti-bacterial base that protects your scalp from irritation & bacteria.",
    desktop: {
      url: `${BASE}/safe.png`,
      alt: "Anti-bacterial clip-on hair system base — Safe (desktop)",
      // media ID 340 | source: 1408×1640
    },
    mobile: {
      url: `${BASE}/safe-1.png`,
      alt: "Anti-bacterial clip-on hair system base — Safe (mobile)",
      // media ID 343 | source: 1040×1044
    },
  },
  {
    emoji: "🔒",
    title: "Secure",
    desc: "Medical-grade silicon clips engineered for all-day wear.",
    desktop: {
      url: `${BASE}/Secure.png`,
      alt: "Medical-grade silicon clips — Secure (desktop)",
      // media ID 341 | source: 1408×1732
    },
    mobile: {
      url: `${BASE}/secure.png`,
      alt: "Medical-grade silicon clips — Secure (mobile)",
      // media ID 344 | source: 1040×1424
    },
  },
] as const;
