import type { AlchemaneEmbedAsset } from '@/components/alchemane/AlchemaneEmbedCard';
import type {
  AlchemaneCompareRow,
  AlchemaneFaqTab,
  AlchemaneLocationPhoto,
  AlchemaneTrustItem,
} from '@/components/alchemane/content-types';

export const WIGS_META = {
  title: 'Custom Medical Wigs for Hair Loss | Alchemane',
  description:
    'Custom medical wigs for chemotherapy and alopecia — 100% real human hair, undetectable hairlines, zero compromise. Trusted by cancer hospitals and Bollywood celebrities.',
  ogImage: 'images/hero-application.png',
};

export interface ChecklistItem {
  strong?: string;
  text: string;
}

export const WIGS_HERO = {
  badge: "If it looks like a wig, it's the wrong one.",
  title: "What If People Can Tell You're Wearing A Wig?",
  lead: "You're going to wear it every single day. It's not worth the compromise.",
  checklist: [
    { strong: 'Designed with professionals', text: '— Our experts understand hairlines, density, and what makes hair look naturally real.' },
    { strong: 'Undetectable realism', text: '— Crafted with meticulous attention to detail for confidence that lasts all day.' },
    { strong: 'Premium quality craftsmanship', text: '— Every detail matters when you wear it every single day.' },
  ] as ChecklistItem[],
  photo: { src: 'images/hero-application.png', width: 1432, height: 1952, alt: "Alchemane stylists fitting a client with her new wig, in-studio" },
  quoteLabel: 'The Problem',
  quote: 'I constantly felt like everyone was looking at my wig.',
  bodyCopy: 'For women facing **hair loss** due to **chemotherapy** or **alopecia**. Custom medical wigs designed to look, move, and feel like your **real hair** — not a disguise.',
  bodyChecklist: [
    { strong: 'Trusted by', text: '**cancer hospitals**.' },
    { strong: 'Chosen by', text: '**Bollywood celebrities**.' },
    { strong: 'Designed for real women,', text: '**real lives**.' },
  ] as ChecklistItem[],
  video: {
    embedSrc: 'https://play.gumlet.io/embed/69ba7ee6554f0fb510d81ac2?embed_platform=gumlet&autoplay=true&muted=true&loop=true',
    poster: 'images/hero-video-poster.png',
    width: 1432,
    height: 1952,
    alt: 'Alchemane wig fitting, filmed in-studio',
  } as AlchemaneEmbedAsset,
  ctaLabel: 'Book Your Consultation',
  trustTitle: 'Trusted by 6,700+ Clients',
  trustBreak: 'Across 12 Countries',
  trustItems: [
    { icon: 'icons/devicon_google.svg', width: 20, height: 20, label: '4.9 Google rating' },
    { icon: 'icons/logos_youtube-icon.svg', width: 24, height: 17, label: '11k+ Subscribers on YouTube' },
    { icon: 'icons/Shield.svg', width: 20, height: 20, label: 'Safe & Certified' },
  ] as AlchemaneTrustItem[],
};

export const WIGS_FAIL = {
  titlePrefix: 'Why Most Wigs Fail',
  titleEmphasis: 'Women Like You',
  label: 'Most Wigs Are:',
  items: [
    'Designed for fashion, **not medical needs**.',
    '**Too heavy**, itchy, or suffocating.',
    '**Obvious** at the hairline.',
    'Made in **standard sizes**.',
    'Emotionally **careless**.',
  ],
  resolveEmphasis: "That's why women come to us",
  resolveRest: 'after being disappointed elsewhere.',
};

export const WIGS_REAL = {
  titlePrefix: 'Why Alchemane Wigs',
  titleEmphasis: 'Look Real',
  photo: { src: 'images/why-real-hairline.png', width: 1528, height: 1888, alt: 'An Alchemane wig blending seamlessly into a natural hairline' },
  checklist: [
    'Hand-crafted with **100% real human hair**.',
    '**Exact color, texture & density** matching.',
    'Breathable caps for **chemo-sensitive scalps**.',
    '**No artificial shine.** No bulky crown.',
    '**Ultra-natural hairline**; uneven, soft, invisible up close.',
    'Natural movement; parts, flows, and **falls like real hair**.',
    "Even from a foot away, it **doesn't look like a wig**.",
  ],
};

export const WIGS_PROOF_STATS = [
  { label: 'Experience', value: '12+ Yrs' },
  { label: 'Happy Clients', value: '6,330+' },
  { label: 'Extensions Delivered', value: '7,840+' },
  { label: 'Industry Expertise', value: '15+ Yrs' },
];
export const WIGS_AWARD_IMAGE = {
  src390: 'images/award-photo-390.webp',
  src780: 'images/award-photo-780.webp',
  alt: 'Alchemane founder receiving the Bharat Innovators Award on stage',
};

export interface CelebClip {
  video: AlchemaneEmbedAsset;
}

export const WIGS_TRUST = {
  title: 'Bollywood & Medical Trust',
  lead: 'Trusted Where It Matters Most.',
  celebKicker: 'Celebrity Clientele',
  celebTitlePrefix: 'Designed wigs for numerous',
  celebTitleEmphasis: 'Bollywood celebrities',
  celebs: [
    { video: { embedSrc: 'https://play.gumlet.io/embed/69bb94a4554f0fb510f507d4?embed_platform=gumlet', poster: 'images/celeb-1-sonali.png', width: 992, height: 1768, alt: 'Sonali Bendre, Alchemane client' } },
    { video: { embedSrc: 'https://play.gumlet.io/embed/69bb94a48dd3b7275956c618?embed_platform=gumlet', poster: 'images/celeb-2-lara.png', width: 992, height: 1768, alt: 'Lara Dutta, Alchemane client' } },
    { video: { embedSrc: 'https://play.gumlet.io/embed/69bb94a48dd3b7275956c616?embed_platform=gumlet', poster: 'images/celeb-3-hina.png', width: 992, height: 1768, alt: 'Hina Khan, Alchemane client' } },
  ] as CelebClip[],
  medicalKicker: 'Medical Authority',
  medicalTitlePrefix: 'Trusted by leading',
  medicalTitleEmphasis: 'hospitals',
  hospitals: ['Tata Memorial', 'Kokilaben Hospital', 'Reliance Foundation'],
  medicalNote: 'Referred by oncologists and medical professionals across India.',
  closingPrefix: 'When discretion, realism, and comfort are non-negotiable —',
  closingEmphasis: 'this is where they come.',
  ctaLabel: 'Speak to an Expert',
};

export const WIGS_FOUNDER = {
  photo: { src: 'images/vinitt-founder.png', width: 1528, height: 2044, alt: 'Vinitt sketching a custom wig design at the Alchemane studio' },
  ctaLabel: 'Book A Consultation Now',
  credentials: [
    '**15+ years** in non-surgical hair replacement. Specialist in **chemo & alopecia wigs**.',
    '**Helped 3,000+ women** regain confidence after medical hair loss.',
    'Works closely with **oncologists & hospitals**.',
    'Known for creating **natural-looking wigs** worn by celebrities.',
    'Leads a team trained specifically for **medical hair loss cases**.',
  ],
};

export interface EducationVideo {
  video: AlchemaneEmbedAsset;
  label: string;
}

export interface EducationGroup {
  heading: string;
  lead: string;
  items: EducationVideo[];
}

export const WIGS_EDUCATION = {
  titlePrefix: 'See How Real It Truly Looks,',
  titleEmphasis: 'Up Close',
  lead: 'Photos can be edited. Video cannot. Watch real women, natural hairlines, and real transformations.',
  groups: [
    {
      heading: 'Natural Results. Real Women.',
      lead: 'See how our wigs recreate a natural hairline and restore confidence after chemo or alopecia.',
      items: [
        { video: { embedSrc: 'https://www.youtube.com/embed/cuDSqluHbNk?autoplay=1&rel=0', poster: 'images/edu-natural-hairline.png', width: 1432, height: 804, alt: 'Natural hairline' }, label: 'Natural Hairline' },
        { video: { embedSrc: 'https://www.youtube.com/embed/zp2yEUffymQ?autoplay=1&rel=0', poster: 'images/edu-cancer-survivor.png', width: 1432, height: 804, alt: 'Customised wig changed her life, cancer survivor' }, label: 'Customised Wig Changed Her Life' },
      ],
    },
    {
      heading: 'Understanding Your Wig Options',
      lead: 'Explore different cancer wig types and 100% real human hair options.',
      items: [
        { video: { embedSrc: 'https://www.youtube.com/embed/xdWbadk9rtU?autoplay=1&rel=0', poster: 'images/edu-wig-types.png', width: 1432, height: 804, alt: '3 types of cancer wigs' }, label: '3 Types of Cancer Wigs' },
        { video: { embedSrc: 'https://www.youtube.com/embed/mDI0TsSvTco?autoplay=1&rel=0', poster: 'images/edu-custom-hair.png', width: 1432, height: 804, alt: 'Customized hair wigs, 100 percent real human hair' }, label: 'Customized Hair Wigs' },
      ],
    },
    {
      heading: 'Before You Place an Order',
      lead: 'Common questions, head measurements, and what to know before choosing your wig.',
      items: [
        { video: { embedSrc: 'https://www.youtube.com/embed/QbWRP8ZSNyM?autoplay=1&rel=0', poster: 'images/edu-concerns.png', width: 1432, height: 804, alt: 'Common concerns while placing a wig order' }, label: 'Common Concerns While Ordering' },
        { video: { embedSrc: 'https://www.youtube.com/embed/XtgHaLFjzRc?autoplay=1&rel=0', poster: 'images/edu-place-order.png', width: 1432, height: 804, alt: 'How to place a wig order' }, label: 'How to Place an Order' },
        { video: { embedSrc: 'https://www.youtube.com/embed/IWrdvU82aP4?autoplay=1&rel=0', poster: 'images/edu-measure-head.png', width: 1432, height: 804, alt: 'How to measure the head for a wig' }, label: 'How to Measure the Head' },
      ],
    },
  ] as EducationGroup[],
  stillQuestionsTitle: 'Still Have Questions?',
  stillQuestionsLead: "Speak to our expert privately and understand what's right for you.",
  stillQuestionsCta: 'Speak to an Expert',
};

export const WIGS_GALLERY_CLIPS: AlchemaneEmbedAsset[] = [
  { embedSrc: 'https://play.gumlet.io/embed/69bb99fa554f0fb510f57bf7?embed_platform=gumlet&autoplay=true', poster: 'images/result-1.png', width: 720, height: 1280, alt: 'Client story 1' },
  { embedSrc: 'https://play.gumlet.io/embed/69bb98ddbaa7d9f8a4d5df10?embed_platform=gumlet&autoplay=true', poster: 'images/result-2.png', width: 720, height: 1280, alt: 'Client story 2' },
  { embedSrc: 'https://play.gumlet.io/embed/69bb99fa8dd3b72759573bbd?embed_platform=gumlet&autoplay=true', poster: 'images/result-3.png', width: 720, height: 1280, alt: 'Client story 3' },
  { embedSrc: 'https://play.gumlet.io/embed/69bb98ddbaa7d9f8a4d5df12?embed_platform=gumlet&autoplay=true', poster: 'images/result-4.png', width: 720, height: 1280, alt: 'Client story 4' },
  { embedSrc: 'https://play.gumlet.io/embed/69bb99fabaa7d9f8a4d5fa08?embed_platform=gumlet&autoplay=true', poster: 'images/result-5.png', width: 720, height: 1280, alt: 'Client story 5' },
  { embedSrc: 'https://play.gumlet.io/embed/69bb99fa554f0fb510f57bf9?embed_platform=gumlet&autoplay=true', poster: 'images/result-6.png', width: 720, height: 1280, alt: 'Client story 6' },
  { embedSrc: 'https://play.gumlet.io/embed/69bb99fa8dd3b72759573bbf?embed_platform=gumlet&autoplay=true', poster: 'images/result-7.png', width: 720, height: 1280, alt: 'Client story 7' },
  { embedSrc: 'https://play.gumlet.io/embed/69bb98dd8dd3b727595721ea?embed_platform=gumlet&autoplay=true', poster: 'images/result-8.png', width: 720, height: 1280, alt: 'Client story 8' },
  { embedSrc: 'https://play.gumlet.io/embed/69bb98dd8dd3b727595721ed?embed_platform=gumlet&autoplay=true', poster: 'images/result-9.png', width: 720, height: 1280, alt: 'Client story 9' },
];

export const WIGS_VOICE = {
  title: 'What Made Them Choose Wigs',
  hint: "Confidence returned. Here's how wigs helped.",
  video: {
    embedSrc: 'https://play.gumlet.io/embed/69bb9c39baa7d9f8a4d63599?embed_platform=gumlet&autoplay=true',
    poster: 'images/choose-wigs-poster.jpg',
    width: 1528,
    height: 2044,
    alt: 'Cancer to confidence — client testimonial',
  } as AlchemaneEmbedAsset,
};

export interface WigTypeItem {
  label: string;
  photo?: { src: string; width: number; height: number; alt: string };
}

export const WIGS_TYPES = {
  titlePrefix: 'Types of',
  titleEmphasis: 'Wigs',
  lead: 'Explore the right fit for you.',
  items: [
    { label: 'European Wig', photo: { src: 'images/wig-type-european.png', width: 548, height: 764, alt: 'European wig' } },
    { label: 'Lace Wig' },
    { label: 'Skin-Top Wig' },
  ] as WigTypeItem[],
};

export const WIGS_COMPARE: { titlePrefix: string; titleEmphasis: string; otherHead: string; usHead: string; captionOther: string; ctaLabel: string; rows: AlchemaneCompareRow[] } = {
  titlePrefix: 'Other Wig Companies vs',
  titleEmphasis: 'Alchemane Wigs',
  otherHead: 'Other Wig Companies',
  usHead: 'Alchemane Wigs',
  captionOther: 'Feature comparison between other wig companies and Alchemane Wigs',
  ctaLabel: 'Speak to an Expert',
  rows: [
    { feature: 'Texture', other: 'Looks artificial', us: 'Natural' },
    { feature: 'Volume', other: 'Too bulky', us: 'Balanced' },
    { feature: 'Hairline', other: 'Visible & artificial', us: 'Ultra natural' },
    { feature: 'Size', other: 'One-size', us: 'Custom' },
    { feature: 'Base Type', other: 'Retail', us: 'Tailored' },
    { feature: 'Movement', other: 'Stiff', us: 'Natural' },
    { feature: 'Fit', other: 'Online, often misfit', us: 'Custom, perfect fit' },
    { feature: 'Hair Type', other: 'Synthetic / mixed', us: '100% human hair' },
    { feature: 'Comfort', other: 'Heavy & uncomfortable', us: 'Lightweight & breathable' },
    { feature: 'Safety', other: 'Irritation-prone', us: 'Medical-grade lining' },
  ],
};

export const WIGS_WHY_CHOOSE = {
  titlePrefix: 'Why Women Choose',
  titleEmphasis: 'Alchemane Wigs',
  ctaLabel: 'Speak to an Expert',
  video: {
    embedSrc: 'https://play.gumlet.io/embed/69bba21d554f0fb510f64581?embed_platform=gumlet&autoplay=true',
    poster: 'images/wig-looks-fake-poster.png',
    width: 1528,
    height: 2044,
    alt: 'Wig looks fake? Before and after transformation',
  } as AlchemaneEmbedAsset,
  benefits: [
    { strong: '100% Real Hair', text: 'Soft, tangle-free, natural.' },
    { strong: 'Custom Fit', text: 'Made to your head shape.' },
    { strong: 'Skin-Safe Lining', text: 'No itching or irritation.' },
    { strong: 'Style It Freely', text: 'Curl, straighten, part naturally.' },
    { strong: 'Ready-to-Wear Options', text: 'For urgent hair loss.' },
    { strong: 'Multiple Cap Styles', text: 'Lace front, mono-top, full lace.' },
    { strong: 'Custom Shades', text: 'Blacks, browns, balayage & more.' },
    { strong: 'We Give Back', text: 'Wigs donated to survivors in need.' },
  ],
};

export const WIGS_WHO_FOR = {
  title: 'Who This Is For',
  label: 'This Is For You If:',
  items: [
    "You're undergoing **chemotherapy** and need a gentle, **breathable, non-irritating** wig.",
    'You have **alopecia** and want a long-term, **ultra-natural solution**.',
    'You\'re scared people will "**know**" you\'re wearing a wig.',
    "You've **tried wigs before** and felt disappointed, uncomfortable, or fake.",
    'You want to **feel normal, confident**, and like yourself again.',
  ],
  resolveStrong: 'This is not a fashion wig.',
  resolveEmphasis: 'This is a medical, identity-restoring solution.',
};

export interface JourneyCard {
  titlePrefix: string;
  titleEmphasis: string;
  items: string[];
}

export const WIGS_JOURNEY = {
  title: 'Understanding Your Unique Journey',
  lead: "Every path is different. Here's how we meet you where you are.",
  cards: [
    {
      titlePrefix: "If You're Here Because of",
      titleEmphasis: 'Chemotherapy',
      items: [
        'Extra-soft, **medical-grade lining** for sensitive scalps.',
        '**Lightweight caps** designed for all-day comfort.',
        '**Ready-to-wear** options for urgent needs.',
        '**Private trials** with zero pressure.',
      ],
    },
    {
      titlePrefix: "If You're Here Because of",
      titleEmphasis: 'Alopecia',
      items: [
        '**Custom hairline design** to match your original look.',
        '**Secure**, long-term wear options.',
        'Natural density and movement; **no bulky crowns**.',
        'Solutions that **adapt** as your hair loss changes.',
      ],
    },
  ] as JourneyCard[],
};

export const WIGS_CONSULT = {
  titlePrefix: 'Experience a',
  titleEmphasis: 'Real Consultation',
  video: {
    embedSrc: 'https://play.gumlet.io/embed/69bba4f2baa7d9f8a4d7150b?embed_platform=gumlet&autoplay=true',
    poster: 'images/consult-real-poster.png',
    width: 720,
    height: 1280,
    alt: 'A real Alchemane wig consultation',
  } as AlchemaneEmbedAsset,
  willHappenLabel: 'What Will Happen:',
  willHappen: [
    '**Private**, respectful consultation.',
    'Scalp, face & lifestyle **assessment**.',
    '**Honest guidance**; no pressure.',
    'Wig options shown based on **your condition**.',
  ],
  willNotHappenLabel: 'What Will Not Happen:',
  willNotHappen: [
    'No **forced purchase**.',
    'No **judgement**.',
    'No **upselling**.',
    'No **rushing**.',
    'No **photos without consent**.',
  ],
  optionsLabel: 'Consultation Options:',
  ctaLabel: 'Book Your Consultation',
};

export const WIGS_PROMISE_LEAD = 'Because your wig should feel like you.';
export const WIGS_PROMISE_ITEMS = [
  { title: 'Designed to Match You', text: "Matches your original hair's look and fall." },
  { title: 'Emotionally Grounded', text: 'Restores confidence, not just appearance.' },
  { title: 'Custom-Crafted', text: 'Tailored to your face and lifestyle.' },
  { title: 'Natural Movement', text: 'Flows and parts like real hair.' },
  { title: 'Confidence-First', text: "You'll feel like yourself again." },
];

export const WIGS_FAQ: { lead: string; tabs: AlchemaneFaqTab[] } = {
  lead: 'These are the exact questions most women ask before choosing us. Get clear, honest answers to make a confident decision.',
  tabs: [
    {
      id: 'consultation',
      label: 'Consultation',
      items: [
        { question: 'Can I do the consultation online?', answer: 'Yes. We guide you Pan India via video call, just like an in-person session.' },
        { question: "What's included in the ₹499 fee?", answer: 'A full scalp, face & lifestyle assessment, honest guidance, and wig options shown against a physical or video trial.' },
        { question: 'What happens in the session?', answer: 'We assess your condition, show suitable wig options, and answer every question — no pressure, no pitch.' },
        { question: 'Will I be forced to place an order?', answer: 'No. The consultation is purely advisory. You decide, in your own time.' },
        { question: "What if I don't like any of the options?", answer: "That's completely fine. We'll be honest if nothing feels right, and you owe us nothing further." },
        { question: 'How do I know it will look right on me?', answer: 'We match shade, texture, density and hairline to your face during the trial, so you see it before you decide.' },
        { question: 'Can I make changes after the trial?', answer: 'Yes. Adjustments to fit, shade or style are part of the process.' },
        { question: "What if I'm confused between styles?", answer: 'Our expert will guide you and show different options during the trial, so you can easily choose what feels right.', open: true },
      ],
    },
    {
      id: 'wigs',
      label: 'Full Wigs',
      items: [
        { question: "I've never worn a wig. What if it doesn't suit me?", answer: "That's exactly what the trial is for. You see and feel it on your own head before deciding — nothing is final until you're happy." },
        { question: 'Can I customize the wig after the trial?', answer: 'Yes. Shade, texture, density and hairline can all be adjusted after your trial.' },
        { question: 'I need a wig urgently. Is that possible?', answer: "Yes. We keep ready-to-wear options for urgent hair loss so you're not left waiting." },
        { question: 'Do I need to shave my head?', answer: 'No. We work with whatever hair you currently have, thinning or full.' },
        { question: 'How do I maintain/care for the wig?', answer: 'Gentle washing, air-drying and occasional styling — we walk you through the full routine at fitting.' },
        { question: 'Will it hurt my scalp during chemo?', answer: 'No. Our caps use medical-grade, breathable lining built for sensitive, treatment scalps.' },
        { question: 'Can I do this entirely online?', answer: 'Yes. Consultation, measurements and guidance can all be done over video call, Pan India.' },
        { question: 'What if my hair grows back?', answer: 'We adjust, resize, or help you transition the wig as your hair changes.' },
        { question: "Will anyone know I'm wearing a wig?", answer: "No. Hairlines are hand-knotted strand by strand, so they're undetectable up close." },
        { question: 'Can I get support later?', answer: 'Yes, we provide ongoing support for touch-ups, maintenance, and any questions you may have after the service.', open: true },
      ],
    },
  ],
};

export const WIGS_LOCATION_PHOTOS: AlchemaneLocationPhoto[] = [
  { src: 'images/location-1.webp', width: 664, height: 1200, alt: 'Alchemane reception, Khar West Mumbai' },
  { src: 'images/location-2.webp', width: 670, height: 1200, alt: 'Alchemane styling floor with multiple stations' },
  { src: 'images/location-3.webp', width: 669, height: 1200, alt: 'Alchemane nail and beauty vanity' },
  { src: 'images/location-4.webp', width: 900, height: 1200, alt: 'Alchemane waiting lounge' },
  { src: 'images/location-5.webp', width: 669, height: 1200, alt: 'Alchemane private treatment room' },
  { src: 'images/location-6.webp', width: 666, height: 1200, alt: 'Alchemane styling area with city view' },
  { src: 'images/location-7.webp', width: 680, height: 1200, alt: 'Alchemane consultation corner' },
];
