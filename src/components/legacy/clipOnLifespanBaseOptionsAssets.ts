const BASE = 'https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media';

export const CLIP_ON_LIFESPAN_BASE_ASSETS = {
  thin: {
    card: {
      desktop: { url: `${BASE}/Thin base card.png`,   alt: 'Thin Base + Low Density Clip-On Hair System' },
      mobile:  { url: `${BASE}/Thin base card-1.png`, alt: 'Thin Base + Low Density Clip-On Hair System' },
    },
    modal: {
      desktop: { url: `${BASE}/Overlay Thin base.png`,   alt: 'Thin Base Clip-On – overlay detail view' },
      mobile:  { url: `${BASE}/Overlay Thin base-1.png`, alt: 'Thin Base Clip-On – overlay detail view' },
    },
  },
  thick: {
    card: {
      desktop: { url: `${BASE}/Thick base card.png`,   alt: 'Thick Base + High Density Clip-On Hair System' },
      mobile:  { url: `${BASE}/Thick base card-1.png`, alt: 'Thick Base + High Density Clip-On Hair System' },
    },
    modal: {
      desktop: { url: `${BASE}/Overlay Thick base.png`,   alt: 'Thick Base Clip-On – overlay detail view' },
      mobile:  { url: `${BASE}/Overlay Thick base-1.png`, alt: 'Thick Base Clip-On – overlay detail view' },
    },
  },
} as const;
