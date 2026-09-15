// About Us page — Our Mission section asset manifest
// Uploaded via Payload media → Cloudflare R2

const BASE = "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media";

export const ABOUT_MISSION_ASSETS = {
  desktop: {
    url: `${BASE}/Our mission.png`,
    alt: "Our Mission — Building The Future Of Non-Surgical Hair Solutions (desktop)",
    // media ID 214 | source: 3968×2232 | display: 992×558
  },
  mobile: {
    url: `${BASE}/Our mission-1.png`,
    alt: "Our Mission — Building The Future Of Non-Surgical Hair Solutions (mobile)",
    // media ID 215 | source: 1432×1788 | display: 360×450 (aspect 4/5)
  },
} as const;
