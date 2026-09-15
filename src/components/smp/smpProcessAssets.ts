// SMP page — The Step-By-Step Process section asset manifest
// Uploaded via Payload media → Cloudflare R2
// Desktop images: 1080×1977 | Mobile images: 1040×1920

const BASE = "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media";

export const SMP_PROCESS_ASSETS = [
  {
    step: '01',
    title: 'Hairline Design & Consultation',
    desc: 'We assess your face shape, age, and lifestyle before designing your ideal hairline.',
    desktop: {
      url: `${BASE}/IMAGE  1.png`,
      alt: 'Hairline Design & Consultation — SMP step 1 process (desktop)',
      // media ID 288 | source: 1080×1977
    },
    mobile: {
      url: `${BASE}/STEP 1.png`,
      alt: 'Hairline Design & Consultation — SMP step 1 process (mobile)',
      // media ID 292 | source: 1040×1920
    },
  },
  {
    step: '02',
    title: 'SMP Session',
    desc: 'Our specialists replicate real follicles using 3H & 1H micro-needles and carbon-based ink.',
    desktop: {
      url: `${BASE}/IMAGE 2.png`,
      alt: 'SMP Session — SMP step 2 process (desktop)',
      // media ID 289 | source: 1080×1977
    },
    mobile: {
      url: `${BASE}/STEP 2.png`,
      alt: 'SMP Session — SMP step 2 process (mobile)',
      // media ID 293 | source: 1040×1920
    },
  },
  {
    step: '03',
    title: 'Build Gradually',
    desc: '2-3 sessions, spaced 7-10 days apart, build density layer by layer for a natural look.',
    desktop: {
      url: `${BASE}/IMAGE  3.png`,
      alt: 'Build Gradually — SMP step 3 process (desktop)',
      // media ID 290 | source: 1080×1977
    },
    mobile: {
      url: `${BASE}/STEP 3.png`,
      alt: 'Build Gradually — SMP step 3 process (mobile)',
      // media ID 294 | source: 1040×1920
    },
  },
  {
    step: '04',
    title: 'Final Look & Touch-Up',
    desc: 'Instant confidence restored. Touch-ups are only needed every 18-30 months.',
    desktop: {
      url: `${BASE}/IMAGE  4.png`,
      alt: 'Final Look & Touch-Up — SMP step 4 process (desktop)',
      // media ID 291 | source: 1080×1977
    },
    mobile: {
      url: `${BASE}/STEP 4.png`,
      alt: 'Final Look & Touch-Up — SMP step 4 process (mobile)',
      // media ID 295 | source: 1040×1920
    },
  },
] as const;
