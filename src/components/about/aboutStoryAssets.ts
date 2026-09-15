// About Us page — Our Story section asset manifest
// Uploaded via Payload media → Cloudflare R2

const BASE = "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media";

export const ABOUT_STORY_ASSETS = {
  // Main section card background (text baked in)
  card: {
    desktop: {
      url: `${BASE}/Our story.png`,
      alt: "The Journey of American Hairline — Our Story (desktop)",
      // media ID 208 | source: 4672×2524 | display: 1121×630
    },
    mobile: {
      url: `${BASE}/Our story-1.png`,
      alt: "The Journey of American Hairline — Our Story (mobile)",
      // media ID 209 | source: 1432×2332 | display: 358×583
    },
  },

  // Modal images
  modal: {
    multipleImages: {
      desktop: {
        url: `${BASE}/multiple images.png`,
        alt: "American Hairline journey — team and client collage",
        // media ID 210 | source: 2676×2880
      },
      mobile: {
        url: `${BASE}/multiple images-1.png`,
        alt: "American Hairline journey — team and client collage",
        // media ID 211 | source: 1368×1472
      },
    },
    bigImage: {
      desktop: {
        url: `${BASE}/big image.png`,
        alt: "American Hairline full team photo",
        // media ID 212 | source: 4080×2772
      },
      mobile: {
        url: `${BASE}/big image-1.png`,
        alt: "American Hairline full team photo",
        // media ID 213 | source: 1368×932
      },
    },
  },
} as const;
