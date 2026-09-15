export type BangaloreResultSlide = {
  id: string;
  /** Bucket-relative media key — resolved via MediaImage / getMediaUrl */
  src: string;
  alt: string;
};

export type BangaloreFitCard = {
  id: string;
  icon: string;
  /** Segments allow bold phrases without dangerouslySetInnerHTML */
  parts: Array<{ text: string; bold?: boolean }>;
};

/** Reuse homepage-v2 deck before/after assets already on R2 CDN */
export const BANGALORE_RESULTS: BangaloreResultSlide[] = [
  {
    id: 'sameer-warma',
    src: '/media/deck/sameer-warma.png',
    alt: 'Sameer Warma before and after natural hair system transformation',
  },
  {
    id: 'daljit-singh',
    src: '/media/deck/daljit-singh.png',
    alt: 'Daljit Singh hair replacement result',
  },
  {
    id: 'advik-sharma',
    src: '/media/deck/advik-sharma.png',
    alt: 'Advik Sharma natural hairline client result',
  },
  {
    id: 'fuzail-khan',
    src: '/media/deck/fuzail-khan.png',
    alt: 'Fuzail Khan hair system client transformation',
  },
  {
    id: 'chandan-singh',
    src: '/media/deck/chandan-singh.png',
    alt: 'Chandan Singh American Hairline client transformation',
  },
];

export const BANGALORE_FIT_CARDS: BangaloreFitCard[] = [
  {
    id: 'pollution',
    icon: '/media/bangalore-lp/fit/pollution.svg',
    parts: [
      { text: 'Hair thinning from ' },
      { text: "Bangalore's dust and pollution.", bold: true },
    ],
  },
  {
    id: 'fast-paced',
    icon: '/media/bangalore-lp/fit/fast-paced.svg',
    parts: [
      { text: 'Fast-paced life', bold: true },
      { text: ' in Bangalore starting to show in your hair.' },
    ],
  },
  {
    id: 'avoiding-photos',
    icon: '/media/bangalore-lp/fit/avoiding-photos.svg',
    parts: [
      { text: 'Avoiding ' },
      { text: 'photos, mirrors, or events', bold: true },
      { text: ' due to hair loss.' },
    ],
  },
  {
    id: 'oils-pills',
    icon: '/media/bangalore-lp/fit/oils-pills.svg',
    parts: [
      { text: 'Oils, pills, and shampoos', bold: true },
      { text: " just didn't give real results." },
    ],
  },
  {
    id: 'surgery-risk',
    icon: '/media/bangalore-lp/fit/surgery-risk.svg',
    parts: [
      { text: 'Surgery feels like ' },
      { text: 'too much risk or downtime.', bold: true },
    ],
  },
  {
    id: 'natural-solution',
    icon: '/media/bangalore-lp/fit/natural-solution.svg',
    parts: [
      { text: 'Want a ' },
      { text: 'natural, pain-free solution', bold: true },
      { text: ' that fits Bangalore life.' },
    ],
  },
];

export type BangaloreGumletVideo = {
  id: string;
  gumletId: string;
  title: string;
};

/**
 * Designer `original_video_{id}.mp4` filenames map 1:1 to live Gumlet asset IDs
 * (same embeds as `/lp/hair-loss-solution-bangalore` funnel blocks).
 */
export const BANGALORE_DECIDE_VIDEO: BangaloreGumletVideo = {
  id: 'decide',
  gumletId: '6866687ef6a1c7ab58a5c810',
  title: 'From bald to bold client transformation',
};

export const BANGALORE_SECRET_VIDEOS: BangaloreGumletVideo[] = [
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

export const BANGALORE_SECRET_BULLETS: Array<Array<{ text: string; bold?: boolean }>> = [
  [
    { text: 'We use ' },
    { text: 'HD Swiss Lace + Nano Fusion tech', bold: true },
    {
      text: " to create a seamless hairline that makes hair look like it's growing from your scalp.",
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

/** Designer responsive stills on R2 (`-390` mobile / `-780` desktop) */
export const BANGALORE_SECRET_COMPARISON = {
  src: '/media/bangalore-lp/secret/real-vs-fake-780.webp',
  srcMobile: '/media/bangalore-lp/secret/real-vs-fake-390.webp',
  alt: 'Natural-looking American Hairline result',
  width: 1200,
  height: 596,
};

export type BangaloreCompareCell = {
  lines: string[];
  status: 'check' | 'cross';
  statusAlt: string;
};

export type BangaloreCompareRow = {
  feature: string[];
  transplant: BangaloreCompareCell;
  ahl: BangaloreCompareCell;
};

export const BANGALORE_COMPARE_ICONS = {
  check: '/media/bangalore-lp/compare/check.svg',
  cross: '/media/bangalore-lp/compare/cross.svg',
} as const;

export const BANGALORE_COMPARE_ROWS: BangaloreCompareRow[] = [
  {
    feature: ['Cost'],
    transplant: {
      lines: ['₹1.5 - ₹3 lacs'],
      status: 'cross',
      statusAlt: 'Not available',
    },
    ahl: {
      lines: ['Starts @ ₹27,000'],
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
      statusAlt: 'Appearance not guaranteed',
    },
    ahl: {
      lines: ['Always'],
      status: 'check',
      statusAlt: 'Always looks natural',
    },
  },
];

export const BANGALORE_CHOICE_STATS = [
  { value: '12+ Yrs', label: 'Experience' },
  { value: '6,770+', label: 'Men Helped' },
  { value: '100%', label: 'Natural Looking' },
  { value: '12+ Nations', label: 'Client Base' },
] as const;

export const BANGALORE_CHOICE_AWARD = {
  src: '/media/bangalore-lp/choice/bharat-award-780.webp',
  srcMobile: '/media/bangalore-lp/choice/bharat-award-390.webp',
  alt: 'Winner of Bharat Innovators Award',
  width: 1440,
  height: 480,
};

export type BangaloreWhyCard = {
  id: string;
  number: string;
  title: string;
  parts: Array<{ text: string; bold?: boolean }>;
};

export const BANGALORE_WHY_CARDS: BangaloreWhyCard[] = [
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

export const BANGALORE_CUSTOM_LEFT = [
  'Natural Hairline',
  'Hair Direction',
  'Hairline Shape',
  'Hair Texture',
  'Baby Hairlines',
  'Hair Color Match',
  'Haircut Blending',
] as const;

export const BANGALORE_CUSTOM_RIGHT = [
  'Hair Density',
  'Base Type',
  'Bleached Knot',
  'Scalp Color',
  'Base Size',
  'Clip Placement',
  'Crown Swirl',
] as const;

export const BANGALORE_CUSTOM_IMAGES = [
  {
    id: '3d-scan',
    src: '/media/bangalore-lp/custom/3d-scan-780.webp',
    srcMobile: '/media/bangalore-lp/custom/3d-scan-390.webp',
    alt: 'Uses advanced 3D scan technology',
    width: 1440,
    height: 480,
  },
  {
    id: 'bollywood',
    src: '/media/bangalore-lp/custom/bollywood-780.webp',
    srcMobile: '/media/bangalore-lp/custom/bollywood-390.webp',
    alt: 'Designed for Bollywood celebrities',
    width: 1440,
    height: 480,
  },
] as const;

/** Designer `original_video_6866687ef6a1c7ab58a5c812.mp4` → live Gumlet */
export const BANGALORE_HOW_IT_WORKS_VIDEO: BangaloreGumletVideo = {
  id: 'how-it-works',
  gumletId: '6866687ef6a1c7ab58a5c812',
  title: 'Consult, customize and transform process',
};

export type BangaloreReview = {
  id: string;
  quote: string;
  initials: string;
  name: string;
  when: string;
};

export const BANGALORE_REVIEWS: BangaloreReview[] = [
  {
    id: 'harsh',
    quote:
      'I spent ₹1.5 lakhs on a transplant, but it looked fake. Then I found American Hairline. Their system gave me the natural look I was after, instantly and pain-free!',
    initials: 'H',
    name: 'Harsh V',
    when: '1 month ago',
  },
  {
    id: 'nikhil',
    quote:
      "After years of battling hair loss in Bangalore's polluted environment, I found American Hairline. Their non-surgical hair system is a game-changer — no pain, just real results.",
    initials: 'N',
    name: 'Nikhil R',
    when: '2 weeks ago',
  },
  {
    id: 'arjun',
    quote:
      "Bangalore's traffic and pollution were taking a toll on my hair. American Hairline's system helped me regain my confidence with a natural, effortless look.",
    initials: 'A',
    name: 'Arjun T',
    when: '1 month ago',
  },
  {
    id: 'renjith',
    quote:
      'I tried various treatments, but nothing worked until I came across American Hairline. The stress and pollution in Bangalore affected my hair, but their system gave me back what I lost.',
    initials: 'R',
    name: 'Renjith A R',
    when: '1 month ago',
  },
  {
    id: 'kunal',
    quote:
      'Living in Bangalore, the constant exposure to pollution left me with thinning hair. American Hairline\'s natural system was the solution I was looking for — no surgery, just instant results.',
    initials: 'K',
    name: 'Kunal S',
    when: '1 month ago',
  },
];

export const BANGALORE_REVIEWS_TRUST = {
  lead: 'Trusted by 6,770+ Clients Across 12 Countries',
  items: [
    {
      id: 'google',
      icon: '/media/bangalore-lp/google.svg',
      label: '4.9 Google rating',
      width: 20,
      height: 20,
    },
    {
      id: 'safe',
      icon: '/media/bangalore-lp/shield.svg',
      label: 'Safe & Certified',
      width: 20,
      height: 20,
    },
  ],
} as const;

/** Designer `original_video_6815f9c232010edd96069f77.mp4` → live Gumlet */
export const BANGALORE_HAPPY_CLIENTS_VIDEO: BangaloreGumletVideo = {
  id: 'happy-clients',
  gumletId: '6815f9c232010edd96069f77',
  title: 'American Hairline happy clients',
};

/** Designer `original_video_684a725de78588ecc9283d7c.mp4` → live Gumlet */
export const BANGALORE_FOUNDER_VIDEO: BangaloreGumletVideo = {
  id: 'founder',
  gumletId: '684a725de78588ecc9283d7c',
  title: 'Vinitt Dessai, founder of American Hairline',
};

export const BANGALORE_FOUNDER_BULLETS: Array<Array<{ text: string; bold?: boolean }>> = [
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
 * Live Gumlet IDs from `/lp/hair-loss-solution-bangalore` block-14 thinnest carousel.
 * Slide 1 matches designer `original_video_68400ea5ed94500acc27bf60.mp4`.
 */
export const BANGALORE_THINNEST_VIDEOS: BangaloreGumletVideo[] = [
  { id: 'thin-1', gumletId: '68400ea5ed94500acc27bf60', title: 'Thin hair system demonstration 1' },
  { id: 'thin-2', gumletId: '68411fb92ea48d13d446fb04', title: 'Thin hair system demonstration 2' },
  { id: 'thin-3', gumletId: '684014632ea48d13d44020d1', title: 'Thin hair system demonstration 3' },
  { id: 'thin-4', gumletId: '684016dc0f8d7a0518309641', title: 'Thin hair system demonstration 4' },
  { id: 'thin-5', gumletId: '684015fa0f8d7a0518308fb4', title: 'Thin hair system demonstration 5' },
  { id: 'thin-6', gumletId: '684017eded94500acc28010d', title: 'Thin hair system demonstration 6' },
  { id: 'thin-7', gumletId: '68402ac80f8d7a0518312f63', title: 'Thin hair system demonstration 7' },
  { id: 'thin-8', gumletId: '684018cd2ea48d13d44043ce', title: 'Thin hair system demonstration 8' },
  { id: 'thin-9', gumletId: '68402bb42ea48d13d440d0ea', title: 'Thin hair system demonstration 9' },
  { id: 'thin-10', gumletId: '684034e6ed94500acc28e271', title: 'Thin hair system demonstration 10' },
  { id: 'thin-11', gumletId: '684031fd2ea48d13d441022f', title: 'Thin hair system demonstration 11' },
  { id: 'thin-12', gumletId: '684129910f8d7a05183791d1', title: 'Thin hair system demonstration 12' },
];

export const BANGALORE_OFFER_GUIDANCE: Array<Array<{ text: string; bold?: boolean }>> = [
  [
    { text: 'Our consultations are designed to give you ' },
    { text: 'clarity,', bold: true },
    { text: ' not push you into buying.' },
  ],
  [
    { text: 'You’ll get to see and ' },
    { text: 'feel real systems', bold: true },
    { text: ' — no guesswork.' },
  ],
  [
    { text: 'We ' },
    { text: 'assess your hair loss', bold: true },
    { text: ' and explain all suitable options.' },
  ],
  [
    { text: 'If we think a hair system ' },
    { text: 'will not work for you, we will say so.', bold: true },
  ],
  [
    { text: 'We will guide you toward what’s best, even if that means ' },
    { text: 'SMP, transplant, or waiting.', bold: true },
  ],
];

export const BANGALORE_OFFER_CHECKS = [
  {
    id: 'no-pressure',
    title: 'No Pressure',
    body: 'A 1-on-1 session to understand your hair goals and give honest, expert advice — not a sales pitch.',
  },
  {
    id: 'no-obligation',
    title: 'No Obligation Consultation',
    body: "Just honest advice to find the best solution for you, from India's top hair system experts.",
  },
] as const;

export type BangaloreFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const BANGALORE_FAQ_CONSULTATION: BangaloreFaqItem[] = [
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
      'You can choose either. We offer both in-person consultations at our Indiranagar studio and online video consultations; whichever is more convenient for you.',
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
      'Yes. We’ll give you a clear breakdown of the cost depending on the type of system you choose with no hidden charges.',
  },
];

export const BANGALORE_FAQ_SYSTEM: BangaloreFaqItem[] = [
  {
    id: 's1',
    question: 'Will it look fake?',
    answer:
      'No. Our HD Swiss lace hairline is designed strand-by-strand for your face, so even barbers and stylists struggle to spot it. That natural finish is why performers trust our systems on camera.',
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
      'The system is customized to your hairline, density, color, and texture. That close match is designed to remain discreet in selfies, bright light, and face-to-face conversations.',
  },
  {
    id: 's5',
    question: 'Can I swim, shower and workout with my hair system on?',
    answer:
      "Yes - you can sleep, swim, shower, and exercise with the system on. It's designed to perform reliably through Bangalore's hot, humid, and all-weather conditions.",
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

export const BANGALORE_LOCATION_IMAGES = [
  {
    id: 'salon-1',
    src: '/media/bangalore-lp/location/salon-1-780.webp',
    srcMobile: '/media/bangalore-lp/location/salon-1-390.webp',
    alt: 'American Hairline Indiranagar studio interior',
    width: 1372,
    height: 1146,
  },
  {
    id: 'salon-2',
    src: '/media/bangalore-lp/location/salon-2-780.webp',
    srcMobile: '/media/bangalore-lp/location/salon-2-390.webp',
    alt: 'American Hairline Indiranagar studio',
    width: 1372,
    height: 1146,
  },
] as const;

export const BANGALORE_LOCATION_ADDRESS =
  'Golden Hive, 484, 2nd Floor, Signature Square Circle, Chinmaya Mission Hospital Rd, near KFC, next to all the plus size store, Indira Nagar 1st Stage, Indiranagar, Bengaluru, Karnataka – 560038.';

export const BANGALORE_FOOTER = {
  logo: '/media/bangalore-lp/logo-780.webp',
  disclaimer:
    'Results may vary from individual to individual depending on factors such as age, gender, metabolic rate, medical background, family history, lifestyle, and physical activity. This implies that outcomes in non-surgical hair replacement may differ among clients. No specific result should be construed as typical.',
  copyright: 'American Hairline © 2026 – All Rights Reserved.',
  links: [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/disclaimer', label: 'Disclaimer Policy' },
  ],
} as const;
