// Hair Transplant page — asset manifest
// Uploaded via Payload media → Cloudflare R2

const BASE = "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media";

// ── Why Combination Method (Benefits) ──
// Desktop: 1056×1932 | Mobile: 1040×1520
export const HT_BENEFITS_ASSETS = [
  {
    title: "Natural Hairline",
    desc: "A perfectly designed, natural hairline, including the temples.",
    desktop: {
      url: `${BASE}/Natural Hairline changes.png`,
      alt: "Natural hairline result from front hairline transplant and hair system combination method",
      // media ID 306 | source: 1056×1932
    },
    mobile: {
      url: `${BASE}/Natural Hairline changes-1.png`,
      alt: "Natural hairline result from front hairline transplant and hair system combination method",
      // media ID 309 | source: 1040×1520
    },
  },
  {
    title: "Full Density",
    desc: "Coverage at the back, even if your donor area is weak.",
    desktop: {
      url: `${BASE}/Full Density changes.png`,
      alt: "Full density result from front hairline transplant and hair system combination method",
      // media ID 307 | source: 1056×1932
    },
    mobile: {
      url: `${BASE}/Full Density changes-1.png`,
      alt: "Full density result from front hairline transplant and hair system combination method",
      // media ID 310 | source: 1040×1520
    },
  },
  {
    title: "360° Real Look",
    desc: "Looks like your real hair from every angle.",
    desktop: {
      url: `${BASE}/360 LOOK changes.png`,
      alt: "360 degree real look result from front hairline transplant and hair system combination method",
      // media ID 308 | source: 1056×1932
    },
    mobile: {
      url: `${BASE}/360 look changes.png`,
      alt: "360 degree real look result from front hairline transplant and hair system combination method",
      // media ID 311 | source: 1040×1520
    },
  },
] as const;

// ── The Secret Behind Most Bollywood Actors' Hair ──
// Desktop: 1632×1224 (4/3) | Mobile: 1080×1350 (4/5)
export const HT_SECRET_ASSETS = {
  desktop: {
    url: `${BASE}/The Secret Behind Most Bollywood Actors 4x3.png`,
    alt: "Bollywood actor with natural-looking hair — secret is the front hairline transplant and hair system combination method",
    // media ID 312 | source: 1632×1224 (4/3)
  },
  mobile: {
    url: `${BASE}/The Secret Behind Most Bollywood Actors hair 4x5.png`,
    alt: "Bollywood actor with natural-looking hair — secret is the front hairline transplant and hair system combination method",
    // media ID 313 | source: 1080×1350 (4/5)
  },
} as const;

// ── Meet Our Expert Team of Transplant Surgeons ──
// Desktop: Dr. Ashutosh 544×445, Dr. Vinod 1632×1335 | Mobile: both 1002×1254
export const HT_TEAM_ASSETS = [
  {
    name: "Dr. Ashutosh Mishra",
    role: "Plastic & Cosmetic Surgeon MCH",
    desktop: {
      url: `${BASE}/Dr. Ashutosh Mishra.png`,
      alt: "Dr. Ashutosh Mishra — Plastic & Cosmetic Surgeon MCH, American Hairline hair transplant expert",
      // media ID 314 | source: 544×445
    },
    mobile: {
      url: `${BASE}/Dr. Ashutosh Mishra-1.png`,
      alt: "Dr. Ashutosh Mishra — Plastic & Cosmetic Surgeon MCH, American Hairline hair transplant expert",
      // media ID 316 | source: 1002×1254
    },
  },
  {
    name: "Dr. Vinod Sonawane",
    role: "MD Hair Transplant Surgeon",
    desktop: {
      url: `${BASE}/Dr. vinod sonavne.png`,
      alt: "Dr. Vinod Sonawane — MD Hair Transplant Surgeon, American Hairline hair transplant expert",
      // media ID 315 | source: 1632×1335
    },
    mobile: {
      url: `${BASE}/Dr. vinod sonavne-1.png`,
      alt: "Dr. Vinod Sonawane — MD Hair Transplant Surgeon, American Hairline hair transplant expert",
      // media ID 317 | source: 1002×1254
    },
  },
] as const;
