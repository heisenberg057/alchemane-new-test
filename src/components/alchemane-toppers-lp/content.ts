import type {
  AlchemaneBenefitItem,
  AlchemaneCompareRow,
  AlchemaneFaqTab,
  AlchemaneLocationPhoto,
  AlchemaneMethodItem,
  AlchemanePersonaItem,
  AlchemaneTrustItem,
  AlchemaneVideoAsset,
} from '@/components/alchemane/content-types';

export const TOPPERS_META = {
  title: 'Ultra-Natural Hair Toppers for Women | Alchemane',
  description:
    'Top thinning? Cover it instantly with Alchemane 100% ultra-natural hair toppers — virgin human hair, custom blended, no glue, no damage. Trusted by 6,700+ clients across 12 countries.',
  ogImage: 'images/moment-poster-780.webp',
};

export const TOPPERS_HERO: {
  badge: string;
  title: string;
  ctaLabel: string;
  ctaNote: string;
  video: AlchemaneVideoAsset;
  trustTitle: string;
  trustBreak: string;
  trustItems: AlchemaneTrustItem[];
} = {
  badge: 'Top Thinning?',
  title: 'Cover It Instantly with our 100% Ultra-Natural Hair Toppers.',
  ctaLabel: 'Book Your Consultation',
  ctaNote: 'Paid consultation · Fee confirmed at booking · In-person in Mumbai or online',
  video: {
    src: 'videos/hero.mp4',
    poster: 'images/hero-poster-390.webp',
    width: 1080,
    height: 1350,
    ariaLabel: 'Alchemane hair topper worn and styled, filmed in-studio',
  },
  trustTitle: 'Trusted by 6,700+ Clients',
  trustBreak: 'Across 12 Countries',
  trustItems: [
    { icon: 'icons/devicon_google.svg', width: 20, height: 20, label: '4.9 Google rating' },
    { icon: 'icons/logos_youtube-icon.svg', width: 24, height: 17, label: '11k+ Subscribers on YouTube' },
    { icon: 'icons/Shield.svg', width: 20, height: 20, label: 'Safe', suffix: 'Certified' },
  ],
};

export const TOPPERS_WHO_ARIA_LABEL = 'Who Alchemane hair toppers are for';
export const TOPPERS_WHO_ITEMS: AlchemanePersonaItem[] = [
  { icon: 'icons/Card Icon Container.svg', text: 'Want to cover **thinning crown or parting line** naturally.' },
  { icon: 'icons/Card Icon Container-1.svg', text: 'Feel **self-conscious about scalp showing** in pics or under lighting.' },
  { icon: 'icons/Card Icon Container-2.svg', text: 'Tried ones that **looked fake or felt heavy**? Want natural, light ones.' },
  { icon: 'icons/Card Icon Container-3.svg', text: "Done with **powders, sprays and tricks** that don't last." },
  { icon: 'icons/Card Icon Container-4.svg', text: 'Want **volume on top** without going for wigs or surgery.' },
  { icon: 'icons/Card Icon Container-5.svg', text: "Need a solution that's **quick to wear, remove** & blends perfectly." },
  { icon: 'icons/Card Icon Container-6.svg', text: "**Can't afford hair drama** before a shoot, event or presentation." },
  { icon: 'icons/Card Icon Container-7.svg', text: 'Just want **natural hair** but thicker and better.' },
];

export const TOPPERS_STORY = {
  id: 'moment',
  kicker: 'Bollywood moment',
  title: 'A Moment',
  titleEmphasis: "We'll Never Forget",
  ctaLabel: 'Start Your Hair Journey',
  video: {
    src: 'videos/moment.mp4',
    poster: 'images/moment-poster-780.webp',
    width: 1080,
    height: 1350,
    ariaLabel: "A moment we'll never forget",
  } as AlchemaneVideoAsset,
};

export const TOPPERS_GALLERY_CLIPS: AlchemaneVideoAsset[] = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
  src: `videos/result-${n}.mp4`,
  poster: `images/result-${n}-poster-390.webp`,
  width: 1080,
  height: 1920,
  ariaLabel: `Client story ${n}`,
}));

export const TOPPERS_PROOF_STATS = [
  { label: 'Experience', value: '12+ Yrs' },
  { label: 'Happy Clients', value: '6,330+' },
  { label: 'Extensions Delivered', value: '7,840+' },
  { label: 'Industry Expertise', value: '15+ Yrs' },
];
export const TOPPERS_AWARD_IMAGE = {
  src390: 'images/award-photo-390.webp',
  src780: 'images/award-photo-780.webp',
  alt: 'Alchemane founder receiving the Bharat Innovators Award on stage',
};

export const TOPPERS_SECOND_STORY = {
  id: 'clients',
  kicker: 'Client testimonial',
  title: 'What Our Clients',
  titleEmphasis: 'Really Think',
  lead: "They chose toppers. Here's what changed.",
  ctaLabel: 'Start Your Hair Journey',
  flip: true,
  video: {
    src: 'videos/clients.mp4',
    poster: 'images/clients-poster-780.webp',
    width: 1080,
    height: 1350,
    ariaLabel: 'What our clients really think',
  } as AlchemaneVideoAsset,
};

export const TOPPERS_WHY = {
  kicker: 'Craft & expertise',
  title: 'Why Alchemane',
  titleEmphasis: 'Hair Toppers?',
  ctaLabel: 'Speak to an Expert',
  video: {
    src: 'videos/why.mp4',
    poster: 'images/why-poster-780.webp',
    width: 1080,
    height: 1350,
    ariaLabel: 'Why Alchemane hair toppers',
  } as AlchemaneVideoAsset,
};
export const TOPPERS_BENEFITS: AlchemaneBenefitItem[] = [
  { strong: 'Looks Natural, Never Fake', text: "We match the size, density, texture and scalp tone, so it looks like it's growing from your own head." },
  { strong: 'Flat, Lightweight Design', text: "Low-density toppers that don't feel bulky. Hair lies flat and blends seamlessly." },
  { strong: 'No Visible Gaps', text: 'Extra hair under the front line hides white patches, even when brushed back.' },
  { strong: 'Free-Parting Freedom', text: 'Part it centre, side or zig-zag — it still looks flawless and real.' },
  { strong: '100% Virgin Brazilian Hair', text: 'Soft, smooth and low maintenance. No frizz. No daily styling stress.' },
  { strong: 'Gentle Silicon Clips', text: 'Secure hold without pulling or damaging your natural hair.' },
  { strong: 'Tailored by Hair Loss Stage', text: "From 5x3 for early thinning to 5x6 for full coverage, we help you choose what's right." },
  { strong: 'Fully Colorable Later', text: 'Made with natural, unprocessed hair, so you can style or colour as you wish.' },
  { strong: 'Expert-Guided Selection', text: 'We review your pictures, assess your scalp and guide you step by step. No guesswork.' },
];

export const TOPPERS_CONSULT_HINT = 'See exactly what happens before you decide';
export const TOPPERS_CONSULT_CLIPS: AlchemaneVideoAsset[] = [1, 2, 3].map((n) => ({
  src: `videos/consult-${n}.mp4`,
  poster: `images/consult-${n}-poster-390.webp`,
  width: 1080,
  height: 1920,
  ariaLabel: `Consultation clip ${n}`,
}));

export const TOPPERS_METHODS_HINT = 'We have got many more to explore';
export const TOPPERS_METHODS: AlchemaneMethodItem[] = [
  { video: { src: 'videos/method-1.mp4', poster: 'images/method-1-poster-780.webp', width: 606, height: 1080, ariaLabel: 'Topper application 1' } },
  { video: { src: 'videos/method-2.mp4', poster: 'images/method-2-poster-780.webp', width: 606, height: 1080, ariaLabel: 'Topper application 2' } },
  { video: { src: 'videos/method-3.mp4', poster: 'images/method-3-poster-780.webp', width: 606, height: 1080, ariaLabel: 'Topper application 3' } },
  { video: { src: 'videos/method-4.mp4', poster: 'images/method-4-poster-780.webp', width: 606, height: 1080, ariaLabel: 'Topper application 4' } },
  { video: { src: 'videos/method-5.mp4', poster: 'images/method-5-poster-780.webp', width: 404, height: 720, ariaLabel: 'Topper application 5' } },
  { video: { src: 'videos/method-6.mp4', poster: 'images/method-6-poster-780.webp', width: 404, height: 720, ariaLabel: 'Topper application 6' } },
  { video: { src: 'videos/method-7.mp4', poster: 'images/method-7-poster-780.webp', width: 606, height: 1080, ariaLabel: 'Topper application 7' } },
  { video: { src: 'videos/method-8.mp4', poster: 'images/method-8-poster-780.webp', width: 404, height: 720, ariaLabel: 'Topper application 8' } },
  { video: { src: 'videos/method-9.mp4', poster: 'images/method-9-poster-780.webp', width: 720, height: 1280, ariaLabel: 'Topper application 9' } },
];

export const TOPPERS_COMPARE: { titlePrefix: string; titleEmphasis: string; otherHead: string; usHead: string; captionOther: string; ctaLabel: string; rows: AlchemaneCompareRow[] } = {
  titlePrefix: 'Alchemane vs Other Toppers',
  titleEmphasis: 'See the Clear Winner',
  otherHead: 'Market Toppers',
  usHead: 'Alchemane Toppers',
  captionOther: 'Feature comparison between market toppers and Alchemane toppers',
  ctaLabel: 'Speak to an Expert',
  rows: [
    { feature: 'Fit & Blending', other: 'Bulky or mismatched', us: 'Custom blended fit' },
    { feature: 'Comfort', other: 'Heavy & uncomfortable', us: 'Light & breathable' },
    { feature: 'Hairline Gaps', other: 'Visible', us: 'Filled' },
    { feature: 'Scalp Match', other: 'Generic base color', us: 'Base matched tone' },
    { feature: 'Parting', other: 'Fixed part', us: 'Free part' },
    { feature: 'Hair Type', other: 'Synthetic or frizzy', us: 'Virgin human hair' },
    { feature: 'Attach', other: 'Glued on scalp', us: 'No glue, no damage' },
    { feature: 'Selection Process', other: 'Pick from stock', us: 'Expert-led selection' },
  ],
};

export const TOPPERS_FOUNDER = {
  background: 'white' as const,
  ctaLabel: 'Book A Consultation Now',
  video: {
    src: 'videos/founder.mp4',
    poster: 'images/founder-poster-780.webp',
    width: 1080,
    height: 1350,
    ariaLabel: 'Meet Vinitt Dessai, founder of Alchemane',
  } as AlchemaneVideoAsset,
  credentials: [
    "India's **#1 expert in non-surgical hair solutions** for confidence & transformation.",
    'Known for creating **ultra-natural silk hair toppers** that blend seamlessly.',
    'His work is trusted by top **dermatologists, oncologists and trichologists**.',
  ],
};

export const TOPPERS_PROMISE_LEAD = 'Because your hair journey deserves more than just toppers.';

export const TOPPERS_FAQ: { lead: string; tabs: AlchemaneFaqTab[] } = {
  lead: 'These are the exact questions most women ask before choosing us. Get clear, honest answers to make a confident decision.',
  tabs: [
    {
      id: 'consultation',
      label: 'Consultation',
      items: [
        { question: 'Can I do the consultation online?', answer: 'Yes. We ship Pan India and guide you via video call.' },
        { question: 'Can I decide later after consultation?', answer: 'Absolutely. No pressure.' },
        { question: 'How fast can I get it done?', answer: 'Same-day fixing is often possible.' },
        { question: 'Can I get help after the service?', answer: 'Yes. Maintenance & removal support are available.' },
        { question: 'Do I need to visit again after fixing?', answer: 'Optional. Touch-ups and removal support are always available.', open: true },
      ],
    },
    {
      id: 'toppers',
      label: 'Toppers',
      items: [
        { question: 'Is it heavy or hot?', answer: "Not at all. They're lightweight and breathable." },
        { question: 'Can I wear it daily?', answer: 'Yes. You can wear and remove it easily yourself.' },
        { question: "Will people know I'm wearing a topper?", answer: "No. It's designed to match and blend naturally." },
        { question: 'Can I style it with heat tools?', answer: "Yes. It's 100% human hair." },
        { question: 'Will it damage my real hair?', answer: 'Not at all. No glue. No clips on the scalp.' },
        { question: 'Do I need to visit the salon for fixing?', answer: 'No. You can do it at home in 2 minutes.' },
        { question: 'Can I return or exchange it?', answer: "We make adjustments until it's perfect. Satisfaction guaranteed." },
        { question: 'What if I want a topper quickly?', answer: 'We have ready options for urgent cases too.' },
        { question: 'Can I ask for help even after buying?', answer: "Yes. We're always available for styling help, support and maintenance." },
      ],
    },
  ],
};

export const TOPPERS_LOCATION_PHOTOS: AlchemaneLocationPhoto[] = [
  { src: 'images/location-1-780.webp', width: 390, height: 488, alt: 'Alchemane studio treatment room, Khar West Mumbai' },
  { src: 'images/location-2-780.webp', width: 390, height: 488, alt: 'Alchemane styling station with mirror' },
  { src: 'images/location-3-780.webp', width: 390, height: 488, alt: 'Alchemane consultation corner' },
];
