export type ClipOnResultSlide = {
  id: string;
  src: string;
  srcMobile: string;
  alt: string;
};

export type ClipOnFitCard = {
  id: string;
  icon: string;
  parts: Array<{ text: string; bold?: boolean }>;
};

/** Designer Group - 2 of 16 / 34–39 (clip-on before/after stills) */
export const CLIP_ON_RESULTS: ClipOnResultSlide[] = [
  {
    id: 'group-16',
    src: '/media/clip-on-lp/results/group-16-780.webp',
    srcMobile: '/media/clip-on-lp/results/group-16-390.webp',
    alt: 'Clip-on hair system client transformation',
  },
  {
    id: 'group-34',
    src: '/media/clip-on-lp/results/group-34-780.webp',
    srcMobile: '/media/clip-on-lp/results/group-34-390.webp',
    alt: 'Clip-on hair system client transformation',
  },
  {
    id: 'group-35',
    src: '/media/clip-on-lp/results/group-35-780.webp',
    srcMobile: '/media/clip-on-lp/results/group-35-390.webp',
    alt: 'Clip-on hair system client transformation',
  },
  {
    id: 'group-36',
    src: '/media/clip-on-lp/results/group-36-780.webp',
    srcMobile: '/media/clip-on-lp/results/group-36-390.webp',
    alt: 'Clip-on hair system client transformation',
  },
  {
    id: 'group-37',
    src: '/media/clip-on-lp/results/group-37-780.webp',
    srcMobile: '/media/clip-on-lp/results/group-37-390.webp',
    alt: 'Clip-on hair system client transformation',
  },
  {
    id: 'group-38',
    src: '/media/clip-on-lp/results/group-38-780.webp',
    srcMobile: '/media/clip-on-lp/results/group-38-390.webp',
    alt: 'Clip-on hair system client transformation',
  },
  {
    id: 'group-39',
    src: '/media/clip-on-lp/results/group-39-780.webp',
    srcMobile: '/media/clip-on-lp/results/group-39-390.webp',
    alt: 'Clip-on hair system client transformation',
  },
];

export const CLIP_ON_FIT_CARDS: ClipOnFitCard[] = [
  {
    id: 'volume',
    icon: '/assets/clip-on-lp/fit/volume.svg',
    parts: [
      { text: 'Want ' },
      { text: 'more volume', bold: true },
      { text: ' without shaving your head.' },
    ],
  },
  {
    id: 'flat-top',
    icon: '/assets/clip-on-lp/fit/flat-top.svg',
    parts: [
      { text: 'Hair looks ' },
      { text: 'flat from the top', bold: true },
      { text: ' in meetings or on dates.' },
    ],
  },
  {
    id: 'sprays',
    icon: '/assets/clip-on-lp/fit/sprays.svg',
    parts: [
      { text: 'Sprays or powders', bold: true },
      { text: " don't hold under lights or wind." },
    ],
  },
  {
    id: 'secure',
    icon: '/assets/clip-on-lp/fit/secure.svg',
    parts: [
      { text: 'Want a ' },
      { text: 'secure fix', bold: true },
      { text: ' for weddings or shoots — ' },
      { text: 'no damage', bold: true },
      { text: '.' },
    ],
  },
  {
    id: 'crown',
    icon: '/assets/clip-on-lp/fit/crown.svg',
    parts: [
      { text: 'Need a ' },
      { text: 'crown piece', bold: true },
      { text: ' that blends in and stays undetectable.' },
    ],
  },
  {
    id: 'no-glue',
    icon: '/assets/clip-on-lp/fit/no-glue.svg',
    parts: [
      { text: "Don't want " },
      { text: 'sticky glue', bold: true },
      { text: ' or patch struggles on your scalp.' },
    ],
  },
];

export type ClipOnGumletVideo = {
  id: string;
  gumletId: string;
  title: string;
};

/** Designer `original_video_6866687ef6a1c7ab58a5c810.mp4` */
export const CLIP_ON_DECIDE_VIDEO: ClipOnGumletVideo = {
  id: 'decide',
  gumletId: '6866687ef6a1c7ab58a5c810',
  title: 'From bald to bold client transformation',
};

export const CLIP_ON_SECRET_VIDEOS: ClipOnGumletVideo[] = [
  {
    id: 'secret-1',
    gumletId: '6866687ef6a1c7ab58a5c80e',
    title: 'Natural hairline demonstration',
  },
  {
    id: 'secret-2',
    gumletId: '6815e49c32010edd96061233',
    title: 'Natural hair system transformation demonstration',
  },
];

export const CLIP_ON_SECRET_BULLETS: Array<Array<{ text: string; bold?: boolean }>> = [
  [
    { text: 'We use ' },
    { text: 'HD Swiss Lace + Nano Fusion tech', bold: true },
    {
      text: ' to create a seamless hairline that looks like hair is growing from your scalp.',
    },
  ],
  [
    { text: 'We ' },
    { text: 'Customize Hairline Sculpting', bold: true },
    { text: ' to match your unique hairline shape, ensuring no harsh edges.' },
  ],
  [
    { text: 'Our systems are ' },
    { text: 'breathable, lightweight, and blend naturally', bold: true },
    { text: ' — no visible line, no unnatural shine, even under bright light.' },
  ],
];

export const CLIP_ON_SECRET_COMPARISON = {
  src: '/media/clip-on-lp/secret/real-vs-fake-780.webp',
  srcMobile: '/media/clip-on-lp/secret/real-vs-fake-390.webp',
  alt: 'Natural-looking American Hairline result',
  width: 1200,
  height: 596,
};

export type ClipOnCompareCell = {
  lines: string[];
  status: 'check' | 'cross';
  statusAlt: string;
};

export type ClipOnCompareRow = {
  feature: string[];
  transplant: ClipOnCompareCell;
  ahl: ClipOnCompareCell;
};

export const CLIP_ON_COMPARE_ICONS = {
  check: '/assets/clip-on-lp/compare/check.svg',
  cross: '/assets/clip-on-lp/compare/cross.svg',
} as const;

/** Designer compare table — clip-on starts @ ₹28,000 (Bangalore LP uses ₹27,000). */
export const CLIP_ON_COMPARE_ROWS: ClipOnCompareRow[] = [
  {
    feature: ['Cost'],
    transplant: {
      lines: ['₹1.5 - ₹3 lacs'],
      status: 'cross',
      statusAlt: 'Not available',
    },
    ahl: {
      lines: ['Starts @ ₹28,000'],
      status: 'check',
      statusAlt: 'Included',
    },
  },
  {
    feature: ['Results'],
    transplant: {
      lines: ['Not', 'Guaranteed'],
      status: 'cross',
      statusAlt: 'Results are not guaranteed',
    },
    ahl: {
      lines: ['Natural,', 'Same-Day Look'],
      status: 'check',
      statusAlt: 'Natural same-day look',
    },
  },
  {
    feature: ['Healing', 'Time'],
    transplant: {
      lines: ['6 - 12 Months'],
      status: 'cross',
      statusAlt: 'Long healing time',
    },
    ahl: {
      lines: ['0 Days'],
      status: 'check',
      statusAlt: 'No healing time',
    },
  },
  {
    feature: ['Pain &', 'Recovery'],
    transplant: {
      lines: ['Yes'],
      status: 'cross',
      statusAlt: 'Pain and recovery required',
    },
    ahl: {
      lines: ['None'],
      status: 'check',
      statusAlt: 'No pain or recovery',
    },
  },
  {
    feature: ['Risk of side', 'Effects'],
    transplant: {
      lines: ['High'],
      status: 'cross',
      statusAlt: 'High risk of side effects',
    },
    ahl: {
      lines: ['None'],
      status: 'check',
      statusAlt: 'No surgical side effects',
    },
  },
  {
    feature: ['Looks', 'Natural?'],
    transplant: {
      lines: ['Maybe'],
      status: 'cross',
      statusAlt: 'Appearance depends on graft take',
    },
    ahl: {
      lines: ['Always'],
      status: 'check',
      statusAlt: 'Always looks natural',
    },
  },
];

export const CLIP_ON_CHOICE_STATS = [
  { value: '12+ Yrs', label: 'Experience' },
  { value: '6,770+', label: 'Men Helped' },
  { value: '100%', label: 'Natural Looking' },
  { value: '12+ Nations', label: 'Client Base' },
] as const;

export const CLIP_ON_CHOICE_AWARD = {
  src: '/media/clip-on-lp/choice/bharat-award-780.webp',
  srcMobile: '/media/clip-on-lp/choice/bharat-award-390.webp',
  alt: 'Winner of Bharat Innovators Award',
  width: 1440,
  height: 480,
};

export type ClipOnWhyCard = {
  id: string;
  number: string;
  title: string;
  parts: Array<{ text: string; bold?: boolean }>;
};

export const CLIP_ON_WHY_CARDS: ClipOnWhyCard[] = [
  {
    id: 'experts',
    number: '01',
    title: "India's #1 Top Experts",
    parts: [
      {
        text: 'Trusted by thousands and featured in national media, we specialize in ',
      },
      { text: 'non-surgical hair systems', bold: true },
      {
        text: ' tailored to Indian men — blending perfectly with your face shape, hair texture, and lifestyle. Our systems use ',
      },
      { text: '100% human hair', bold: true },
      { text: ' and are ' },
      { text: 'ISO certified', bold: true },
      { text: ' for safety and quality.' },
    ],
  },
  {
    id: 'technology',
    number: '02',
    title: 'Tailored with Technology',
    parts: [
      { text: 'From ' },
      { text: 'Invisible Hairline Sculpting™', bold: true },
      { text: ' to ' },
      { text: 'Nano Fusion Technology', bold: true },
      {
        text: ', every system is crafted with advanced design and precision engineering for a seamless, natural look. Our ',
      },
      { text: 'Single-strand Implantation', bold: true },
      { text: ' technique customizes your hairline with unmatched detail.' },
    ],
  },
  {
    id: 'celebrity',
    number: '03',
    title: 'Celebrity-Trusted',
    parts: [
      { text: 'Our systems are trusted by ' },
      { text: 'Bollywood actors', bold: true },
      {
        text: ' and public figures, designed for high-definition cameras — yet discreet in daily life. Lightweight, breathable, and ',
      },
      { text: 'virtually invisible', bold: true },
      { text: ' even up close. ' },
      { text: 'USA-manufactured', bold: true },
      { text: ' and ' },
      { text: 'doctor approved.', bold: true },
    ],
  },
  {
    id: 'advice',
    number: '04',
    title: 'Elite Service, Genuine Advice',
    parts: [
      {
        text: 'No pressure, no upselling. Just expert advice from professionals who care. We guide you to the right solution, with ',
      },
      { text: 'durability, comfort,', bold: true },
      { text: ' and ' },
      { text: 'natural results', bold: true },
      { text: ' as our priority. We specialize in ' },
      { text: 'ultra-natural looking hairlines', bold: true },
      { text: ' that restore confidence and look truly undetectable.' },
    ],
  },
];

export const CLIP_ON_CUSTOM_LEFT = [
  'Natural Hairline',
  'Hair Direction',
  'Hairline Shape',
  'Hair Texture',
  'Baby Hairlines',
  'Hair Color Match',
  'Haircut Blending',
] as const;

/** Clip-on-specific right column includes Clip Placement + Crown Swirl. */
export const CLIP_ON_CUSTOM_RIGHT = [
  'Hair Density',
  'Base Type',
  'Bleached Knot',
  'Scalp Color',
  'Base Size',
  'Clip Placement',
  'Crown Swirl',
] as const;

export const CLIP_ON_CUSTOM_IMAGES = [
  {
    id: '3d-scan',
    src: '/media/clip-on-lp/custom/3d-scan-780.webp',
    srcMobile: '/media/clip-on-lp/custom/3d-scan-390.webp',
    alt: 'Uses advanced 3D scan technology',
    width: 1440,
    height: 480,
  },
  {
    id: 'bollywood',
    src: '/media/clip-on-lp/custom/bollywood-780.webp',
    srcMobile: '/media/clip-on-lp/custom/bollywood-390.webp',
    alt: 'Designed for Bollywood celebrities',
    width: 1440,
    height: 480,
  },
] as const;

/** Designer `original_video_6866687ef6a1c7ab58a5c812.mp4` */
export const CLIP_ON_HOW_IT_WORKS_VIDEO: ClipOnGumletVideo = {
  id: 'how-it-works',
  gumletId: '6866687ef6a1c7ab58a5c812',
  title: 'Consult, customize and transform process',
};

export type ClipOnReview = {
  id: string;
  quote: string;
  initials: string;
  name: string;
  when: string;
};

/** Designer clip-on reviews (volume / crown / no-glue — not Bangalore transplant copy). */
export const CLIP_ON_REVIEWS: ClipOnReview[] = [
  {
    id: 'harsh',
    quote:
      'My crown thinning was really bothering me before events. The clip-on gave me natural volume instantly, and no one even noticed I was wearing one.',
    initials: 'H',
    name: 'Harsh V',
    when: '1 month ago',
  },
  {
    id: 'nikhil',
    quote:
      'I wore my crown piece through my whole wedding — dancing, photos, everything. It stayed secure all night and blended perfectly with my own hair.',
    initials: 'N',
    name: 'Nikhil R',
    when: '2 weeks ago',
  },
  {
    id: 'arjun',
    quote:
      'My hair looked flat under the shoot lights every single time. The clip-on gave me instant volume right before the meeting, and it looked completely natural.',
    initials: 'A',
    name: 'Arjun T',
    when: '2 weeks ago',
  },
  {
    id: 'renjith',
    quote:
      'No glue, no mess — just a safe, simple system I can use every day. Even my barber had no idea I was wearing one.',
    initials: 'R',
    name: 'Renjith A R',
    when: 'a month ago',
  },
  {
    id: 'kunal',
    quote:
      "A friend recommended the clip-on and I'm so glad I tried it. It adds volume so naturally, I wear it on dates and shoots without a second thought.",
    initials: 'K',
    name: 'Kunal S',
    when: '1 month ago',
  },
];

export const CLIP_ON_REVIEWS_TRUST = {
  lead: 'Trusted by 6,700+ Clients Across 12 Countries',
  items: [
    {
      id: 'google',
      icon: '/assets/clip-on-lp/google.svg',
      label: '4.9 Google rating',
      width: 20,
      height: 20,
    },
    {
      id: 'safe',
      icon: '/assets/clip-on-lp/shield.svg',
      label: 'Safe & Certified',
      width: 20,
      height: 20,
    },
  ],
} as const;

/** Designer `original_video_6815f9c232010edd96069f77.mp4` */
export const CLIP_ON_HAPPY_CLIENTS_VIDEO: ClipOnGumletVideo = {
  id: 'happy-clients',
  gumletId: '6815f9c232010edd96069f77',
  title: 'American Hairline happy clients',
};

/** Designer `original_video_684a725de78588ecc9283d7c.mp4` */
export const CLIP_ON_FOUNDER_VIDEO: ClipOnGumletVideo = {
  id: 'founder',
  gumletId: '684a725de78588ecc9283d7c',
  title: 'Vinitt Dessai, founder of American Hairline',
};

export const CLIP_ON_FOUNDER_BULLETS: Array<Array<{ text: string; bold?: boolean }>> = [
  [
    { text: 'Vinitt Dessai', bold: true },
    {
      text: " — founder of American Hairline and the hair artist behind some of Bollywood's best-kept secrets.",
    },
  ],
  [
    { text: 'Known for ' },
    { text: 'custom hairlines', bold: true },
    { text: ' that match age, face shape, and lifestyle.' },
  ],
  [
    { text: 'He is the expert men turn to when they want a solution that doesn’t look like ' },
    { text: '“just another patch”.', bold: true },
  ],
];

/**
 * World's Thinnest carousel (12).
 * Designer folder used local `1.mp4`…`8.mp4` / `t1` / `T2` / `t3` without Gumlet IDs;
 * live `/lp/clip-on-hair-system` block-14 supplies the mapped IDs below (slide 1 also
 * matches designer `original_video_68400ea5ed94500acc27bf60.mp4`).
 */
export const CLIP_ON_THINNEST_VIDEOS: ClipOnGumletVideo[] = [
  {
    id: 'thin-1',
    gumletId: '68400ea5ed94500acc27bf60',
    title: 'Thin hair system demonstration 1',
  },
  {
    id: 'thin-2',
    gumletId: '68411fb92ea48d13d446fb04',
    title: 'Thin hair system demonstration 2',
  },
  {
    id: 'thin-3',
    gumletId: '684014632ea48d13d44020d1',
    title: 'Thin hair system demonstration 3',
  },
  {
    id: 'thin-4',
    gumletId: '684016dc0f8d7a0518309641',
    title: 'Thin hair system demonstration 4',
  },
  {
    id: 'thin-5',
    gumletId: '684015fa0f8d7a0518308fb4',
    title: 'Thin hair system demonstration 5',
  },
  {
    id: 'thin-6',
    gumletId: '684017eded94500acc28010d',
    title: 'Thin hair system demonstration 6',
  },
  {
    id: 'thin-7',
    gumletId: '68402ac80f8d7a0518312f63',
    title: 'Thin hair system demonstration 7',
  },
  {
    id: 'thin-8',
    gumletId: '684018cd2ea48d13d44043ce',
    title: 'Thin hair system demonstration 8',
  },
  {
    id: 'thin-9',
    gumletId: '68402bb42ea48d13d440d0ea',
    title: 'Thin hair system demonstration 9',
  },
  {
    id: 'thin-10',
    gumletId: '684034e6ed94500acc28e271',
    title: 'Thin hair system demonstration 10',
  },
  {
    id: 'thin-11',
    gumletId: '684031fd2ea48d13d441022f',
    title: 'Thin hair system demonstration 11',
  },
  {
    id: 'thin-12',
    gumletId: '684129910f8d7a05183791d1',
    title: 'Thin hair system demonstration 12',
  },
];

/** Designer offer guidance (4 bullets). */
export const CLIP_ON_OFFER_GUIDANCE: Array<Array<{ text: string; bold?: boolean }>> = [
  [
    { text: 'Our consultations give you ' },
    { text: 'clarity,', bold: true },
    { text: ' not pressure to buy.' },
  ],
  [
    { text: 'You see and ' },
    { text: 'feel real systems', bold: true },
    { text: ' before deciding.' },
  ],
  [
    { text: 'We ' },
    { text: 'assess your hair loss', bold: true },
    { text: ' and explain all suitable options.' },
  ],
  [
    { text: 'We guide you toward ' },
    { text: 'what’s best', bold: true },
    { text: ' — even if that means SMP, transplant, or waiting.' },
  ],
];

export const CLIP_ON_OFFER_CHECKS = [
  {
    id: 'no-pressure',
    title: 'No Pressure',
    body: 'A 1-on-1 session based on your hair goals, not a sales pitch.',
  },
  {
    id: 'no-obligation',
    title: 'No Obligation',
    body: 'You decide only if and when the solution feels right.',
  },
] as const;

export type ClipOnFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const CLIP_ON_FAQ_CONSULTATION: ClipOnFaqItem[] = [
  {
    id: 'c1',
    question: 'What happens in the consultation?',
    answer:
      'You’ll speak 1-on-1 with our expert. We’ll understand your current hair loss, show you suitable options, and guide you on what will look best; with full clarity and honesty.',
  },
  {
    id: 'c2',
    question: 'Is it an in-person or online consultation?',
    answer:
      'You can choose either. We offer both in-person consultations at our studio and online video consultations; whichever is more convenient for you.',
  },
  {
    id: 'c3',
    question: 'Will I get to see real samples or demos?',
    answer:
      'Yes. If you come in person, you can feel the hair systems and see demos. If it’s online, we’ll show detailed videos and client photos that match your hair condition.',
  },
  {
    id: 'c4',
    question: 'Will I be pressured to buy during the consultation?',
    answer:
      'Absolutely not. Our consultation is about education and clarity; not pushing you to buy. You decide only if and when you’re ready.',
  },
  {
    id: 'c5',
    question: 'How long does the consultation take?',
    answer:
      'Usually 30 to 45 minutes. We take time to understand you and answer all your questions properly.',
  },
  {
    id: 'c6',
    question: 'Will I know the total cost after the consultation?',
    answer:
      'Yes, we will give you a clear cost breakdown based on the system you choose — with no hidden charges.',
  },
];

export const CLIP_ON_FAQ_SYSTEM: ClipOnFaqItem[] = [
  {
    id: 's1',
    question: 'Will it look fake?',
    answer:
      'No. Our HD Swiss lace hairline is designed strand-by-strand for your face, so even barbers and stylists struggle to spot it. That natural finish holds up in daylight, in photos, and up close at home.',
  },
  {
    id: 's2',
    question: 'Will I need to shave my head?',
    answer:
      'Not always. Clip-on options can work without shaving, while other attachment methods may need a small area prepared for a secure fit. Your expert will show you the suitable choices before you decide.',
  },
  {
    id: 's3',
    question: 'Will it damage my hair?',
    answer:
      'No. We use breathable, skin-safe materials and match the attachment method to your scalp and existing hair. Following the recommended maintenance routine helps keep both comfortable.',
  },
  {
    id: 's4',
    question: 'Will people notice?',
    answer:
      'The system is customized to your hairline, density, color, and texture. That close match is designed to remain discreet in family photos, bright light, and face-to-face conversations.',
  },
  {
    id: 's5',
    question: 'Can I swim, shower and workout with my hair system on?',
    answer:
      "Yes - you can sleep, swim, shower, and exercise with the system on. It's designed to perform reliably through hot, humid, and all-weather conditions.",
  },
  {
    id: 's6',
    question: 'Are your hair systems itchy to the scalp?',
    answer:
      'Modern hair systems are lightweight and breathable. The base and attachment method are selected for your scalp, and regular cleaning helps maintain day-to-day comfort.',
  },
  {
    id: 's7',
    question: 'How long does a hair system last?',
    answer:
      'Lifespan varies with the base type, attachment method, care routine, and daily use. During your consultation, we’ll explain the expected replacement cycle for the system recommended to you.',
  },
  {
    id: 's8',
    question: 'What does maintenance cost per month?',
    answer:
      'The monthly amount depends on your attachment method and service frequency. Our CRM team will explain the recurring maintenance plan and its exact cost before you book.',
  },
];

export const CLIP_ON_LOCATION_IMAGES = [
  {
    id: 'salon-1',
    src: '/media/clip-on-lp/location/salon-1-780.webp',
    srcMobile: '/media/clip-on-lp/location/salon-1-390.webp',
    alt: 'American Hairline Mumbai reception',
    width: 1919,
    height: 854,
  },
  {
    id: 'salon-2',
    src: '/media/clip-on-lp/location/salon-2-780.webp',
    srcMobile: '/media/clip-on-lp/location/salon-2-390.webp',
    alt: 'American Hairline Mumbai consultation room',
    width: 680,
    height: 382,
  },
  {
    id: 'salon-3',
    src: '/media/clip-on-lp/location/salon-3-780.webp',
    srcMobile: '/media/clip-on-lp/location/salon-3-390.webp',
    alt: 'American Hairline clinic interior',
    width: 680,
    height: 382,
  },
] as const;

export const CLIP_ON_LOCATION_ADDRESS =
  '401/402, 4th Floor, Empressa Building, 2nd Road, Opp. BMC Market, Near Kabutar, Above CSB Bank Khar, Ram Krishna Nagar, Khar West, Mumbai – 400052.';

export const CLIP_ON_FOOTER = {
  logo: '/media/clip-on-lp/logo-780.webp',
  logoMobile: '/media/clip-on-lp/logo-390.webp',
  disclaimer:
    'Results may vary from individual to individual depending on factors such as age, gender, metabolic rate, medical background, family history, lifestyle, and physical activity. This implies that outcomes in non-surgical hair replacement may differ among clients. No specific result should be construed as typical.',
  copyright: 'American Hairline © 2026 – All Rights Reserved.',
  links: [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/disclaimer', label: 'Disclaimer Policy' },
  ],
} as const;
