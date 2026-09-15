// Zycon Range • Pro Series section — asset manifest
// Uploaded via Payload media → Cloudflare R2

const BASE = "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media";

export const ZYCON_SECTION_ASSETS = {
  card: {
    desktop: {
      url: `${BASE}/MEN PNG WHITE 1.png`,
      alt: "Zycon Range Pro Series man with hair system (desktop)",
      // media ID 347 | source: 598×1064 | aspect: 68/121
    },
    mobile: {
      url: `${BASE}/MEN PNG WHITE 1-1.png`,
      alt: "Zycon Range Pro Series man with hair system (mobile)",
      // media ID 349 | source: 479×852 | aspect: 113/201
    },
  },
  popup: {
    desktop: {
      url: `${BASE}/final MEN PNG GRADIENT 1 (1) 1 (2).png`,
      alt: "Zycon Range Pro Series man with gradient hair glow (desktop)",
      // media ID 348 | source: 770×834 | aspect: 385/417
    },
    mobile: {
      url: `${BASE}/final MEN PNG GRADIENT 1 (1) 1 (2)-1.png`,
      alt: "Zycon Range Pro Series man with gradient hair glow (mobile)",
      // media ID 350 | source: 508×551 | aspect: 59/64
    },
  },
} as const;
