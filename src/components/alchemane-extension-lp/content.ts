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

export const EXTENSION_META = {
  title: 'Permanent Hair Extensions for Women | Alchemane',
  description:
    'Thin hair? Get 100% natural, lasting volume with Alchemane permanent hair extensions — 100% human hair, custom matched, zero damage. Trusted by 6,700+ clients across 12 countries.',
  ogImage: 'images/lara-dutta-780.webp',
};

export const EXTENSION_HERO: {
  badge: string;
  title: string;
  ctaLabel: string;
  ctaNote: string;
  video: AlchemaneVideoAsset;
  trustTitle: string;
  trustBreak: string;
  trustItems: AlchemaneTrustItem[];
} = {
  badge: 'Thin Hair?',
  title: 'Get 100% Natural, Lasting Volume with Permanent Extensions.',
  ctaLabel: 'Book Your Consultation',
  ctaNote: 'Paid consultation · Fee confirmed at booking · In-person in Mumbai or online',
  video: {
    src: 'https://video.gumlet.io/680b63470527a5bd8ddeac39/6ab42ead456e563d43cf6802/main.mp4', gumletId: '6ab42ead456e563d43cf6802',
    poster: 'images/hero-video-poster-390.webp',
    width: 640,
    height: 800,
    ariaLabel: 'Real Alchemane hair extension application, filmed in-studio',
  },
  trustTitle: 'Trusted by 6,700+ Clients',
  trustBreak: 'Across 12 Countries',
  trustItems: [
    { icon: 'icons/devicon_google.svg', width: 20, height: 20, label: '4.9 Google rating' },
    { icon: 'icons/logos_youtube-icon.svg', width: 24, height: 17, label: '11k+ Subscribers on YouTube' },
    { icon: 'icons/Shield.svg', width: 20, height: 20, label: 'Non-Damaging', suffix: 'Certified Safe' },
  ],
};

export const EXTENSION_WHO_ARIA_LABEL = 'Who Alchemane extensions are for';
export const EXTENSION_WHO_ITEMS: AlchemanePersonaItem[] = [
  { icon: 'icons/Card Icon Container.svg', text: 'Hate **clipping and removing** extensions daily.' },
  { icon: 'icons/Card Icon Container-1.svg', text: '**Insecure** about thin hair and craving **volume that lasts**.' },
  { icon: 'icons/Card Icon Container-2.svg', text: '**Tired** of spending time **every morning** on your hair.' },
  { icon: 'icons/Card Icon Container-3.svg', text: 'Feel your **hair stops you** from **looking your best**.' },
  { icon: 'icons/Card Icon Container-4.svg', text: 'Used **serums, sprays, clip-ons** but still not satisfied.' },
  { icon: 'icons/Card Icon Container-5.svg', text: 'Not just party nights but **want to look great always**.' },
  { icon: 'icons/Card Icon Container-6.svg', text: '**Avoid selfies** or group pics because of hair.' },
  { icon: 'icons/Card Icon Container-7.svg', text: "**Can't risk it** on your wedding or big meeting." },
];

export const EXTENSION_STORY = {
  id: 'lara',
  kicker: 'Celebrity story',
  title: 'The Hair Story Of',
  titleEmphasis: 'Lara Dutta',
  ctaLabel: 'Start Your Hair Journey',
  video: {
    src: 'videos/lara-dutta.mp4', gumletId: '6ab245b72394588e66b6560c',
    poster: 'images/lara-dutta-780.webp',
    width: 720,
    height: 900,
    ariaLabel: "Lara Dutta's hair story",
  } as AlchemaneVideoAsset,
};

const GALLERY_FILES = [
  { file: 'original_video_685fd65fb5460c50cec212e2.mp4', poster: 'result-1-390.webp', gumletId: '6ab2457ed017a04767ab986c' },
  { file: 'original_video_685fd65fddc393022dae23d1.mp4', poster: 'result-2-390.webp', gumletId: '6ab245852394588e66b654a8' },
  { file: 'original_video_685fd65fb5460c50cec212e4.mp4', poster: 'result-3-390.webp', gumletId: '6ab24582d017a04767ab9896' },
  { file: 'original_video_685fd65fddc393022dae23d6.mp4', poster: 'result-4-390.webp', gumletId: '6ab245882394588e66b654b8' },
  { file: 'original_video_685fd65f523fd47acaf1147d.mp4', poster: 'result-5-390.webp', gumletId: '6ab245788a8d9ca7fc044154' },
  { file: 'original_video_685fd65f523fd47acaf11483.mp4', poster: 'result-6-390.webp', gumletId: '6ab2457a2394588e66b65476' },
  { file: 'original_video_685fd65f523fd47acaf1147a.mp4', poster: 'result-7-390.webp', gumletId: '6ab24570d017a04767ab981c' },
];
export const EXTENSION_GALLERY_CLIPS: AlchemaneVideoAsset[] = GALLERY_FILES.map(({ file, poster, gumletId }, i) => ({
  src: `videos/Do They Look Natural section videos/${file}`,
  gumletId,
  poster: `images/${poster}`,
  width: 351,
  height: 621,
  ariaLabel: `Client story ${i + 1}`,
}));

export const EXTENSION_PROOF_STATS = [
  { label: 'Experience', value: '12+ Yrs' },
  { label: 'Happy Clients', value: '6,330+' },
  { label: 'Extensions Delivered', value: '7,840+' },
  { label: 'Industry Expertise', value: '15+ Yrs' },
];
export const EXTENSION_AWARD_IMAGE = {
  src390: 'images/award-photo-390.webp',
  src780: 'images/award-photo-780.webp',
  alt: 'Alchemane founder receiving the Bharat Innovators Award on stage',
};

export const EXTENSION_SECOND_STORY = {
  id: 'neha',
  kicker: 'Celebrity story',
  title: 'The Quiet Comeback Of',
  titleEmphasis: 'Neha Dhupia',
  ctaLabel: 'Start Your Hair Journey',
  flip: true,
  video: {
    src: 'videos/The Quiet Comeback of Neha Dhupia section video.mp4', gumletId: '6ab245add017a04767ab99a5',
    poster: 'images/neha-dhupia-780.webp',
    width: 1080,
    height: 1350,
    ariaLabel: "Neha Dhupia's hair journey",
  } as AlchemaneVideoAsset,
};

export const EXTENSION_WHY = {
  kicker: 'Technique & expertise',
  title: 'Why Alchemane',
  titleEmphasis: 'Permanent Extensions?',
  ctaLabel: 'Speak to an Expert',
  video: {
    src: 'videos/Why Alchemane video.mp4', gumletId: '6ab245b28a8d9ca7fc0442b0',
    poster: 'images/why-extensions-fail-780.webp',
    width: 1080,
    height: 1350,
    ariaLabel: 'Why Alchemane permanent extensions',
  } as AlchemaneVideoAsset,
};
export const EXTENSION_BENEFITS: AlchemaneBenefitItem[] = [
  { strong: 'Precision, Not Guesswork', text: "We analyze your scalp to apply extensions where they're safest and most natural-looking." },
  { strong: 'No Damage to Roots', text: 'No stress on weak areas. No bald patches. Just secure, healthy application.' },
  { strong: 'Designed for You', text: 'Every extension is placed with intention, blended to match your hair perfectly.' },
  { strong: '21,000+ Applications', text: "This isn't a side service. It's our core. Trusted by celebrities and women across India." },
  { strong: 'Honest Guidance', text: "We only recommend extensions if your hair is ready. No pushing. Just what's right for you." },
  { strong: 'All Major Methods', text: 'Keratin bonds, tape-ins, micro rings — even a custom mix if needed.' },
  { strong: 'Invisible Blending', text: "We match texture, length and volume so well, they don't look like extensions." },
  { strong: 'Complete Aftercare', text: 'Includes tutorials, product advice and ongoing support after installation.' },
];

export const EXTENSION_CONSULT_HINT = 'See exactly what happens before you decide';
const CONSULT_FILES = [
  { file: 'original_video_685fdda4523fd47acaf13fe0.mp4', poster: 'consult-1-390.webp', h: 621, gumletId: '6ab245ab8a8d9ca7fc04428a' },
  { file: 'original_video_685fdb45b5460c50cec2305d.mp4', poster: 'consult-2-390.webp', h: 621, gumletId: '6ab245a68a8d9ca7fc044269' },
  { file: 'original_video_685fdb45b5460c50cec23072.mp4', poster: 'consult-3-390.webp', h: 619, gumletId: '6ab245a92394588e66b655b8' },
  { file: 'original_video_685fdb45523fd47acaf13155.mp4', poster: 'consult-4-390.webp', h: 615, gumletId: '6ab245a42394588e66b65591' },
];
export const EXTENSION_CONSULT_CLIPS: AlchemaneVideoAsset[] = CONSULT_FILES.map(({ file, poster, h, gumletId }, i) => ({
  src: `videos/Real Consultation videos/${file}`,
  gumletId,
  poster: `images/${poster}`,
  width: 349,
  height: h,
  ariaLabel: `Consultation clip ${i + 1}`,
}));

export const EXTENSION_VOICE = {
  kicker: 'Client testimonial',
  title: 'Hear What They Say',
  ctaLabel: 'Start Your Hair Journey',
  video: {
    src: 'videos/Hear What They Say section video.mp4', gumletId: '6ab245902394588e66b65500',
    poster: 'images/longer-hair-780.webp',
    width: 1080,
    height: 1350,
    ariaLabel: 'Hear what our client says',
  } as AlchemaneVideoAsset,
  quotes: [
    'Caused by **stress, styling, or postpartum**? We get it.',
    "Skip the **painful treatments** — there's a better way.",
    'Try our 100% human hair extensions for a **natural, seamless** look no one can spot.',
  ],
};

export const EXTENSION_METHODS_HINT = 'Watch each technique up close';
export const EXTENSION_METHODS: AlchemaneMethodItem[] = [
  { video: { src: 'videos/Popular Method VIDEOS/P1.mp4', gumletId: '6ab2459e8a8d9ca7fc04422b', poster: 'images/method-1-390.webp', width: 1080, height: 1920, ariaLabel: 'Tape-in extensions' }, label: 'Tape-in extensions' },
  { video: { src: 'videos/Popular Method VIDEOS/E1.mp4', gumletId: '6ab245948a8d9ca7fc0441ee', poster: 'images/method-2-390.webp', width: 1080, height: 1920, ariaLabel: 'Extremely comfortable extensions' }, label: 'Extremely comfortable extensions' },
  { video: { src: 'videos/Popular Method VIDEOS/P2.mp4', gumletId: '6ab245a02394588e66b65569', poster: 'images/method-3-390.webp', width: 1080, height: 1920, ariaLabel: 'Micro-ring hair extensions' }, label: 'Micro-ring hair extensions' },
  { video: { src: 'videos/Popular Method VIDEOS/E2.mp4', gumletId: '6ab245962394588e66b65528', poster: 'images/method-4-390.webp', width: 1080, height: 1920, ariaLabel: 'Hair extension option' }, label: 'Hair extension option' },
  { video: { src: 'videos/Popular Method VIDEOS/P3.mp4', gumletId: '6ab245a18a8d9ca7fc044248', poster: 'images/method-5-390.webp', width: 1080, height: 1920, ariaLabel: 'Keratin bond extensions' }, label: 'Keratin bond extensions' },
  { video: { src: 'videos/Popular Method VIDEOS/E3.mp4', gumletId: '6ab24598d017a04767ab991b', poster: 'images/method-6-390.webp', width: 1080, height: 1920, ariaLabel: 'Reusable extensions' }, label: 'Reusable extensions' },
  { video: { src: 'videos/Popular Method VIDEOS/Feather.mp4', gumletId: '6ab2459b2394588e66b6554b', poster: 'images/method-7-390.webp', width: 720, height: 1280, ariaLabel: 'Feather-tip extensions' }, label: 'Feather-tip extensions' },
  { video: { src: 'videos/Popular Method VIDEOS/Ice extension.mp4', gumletId: '6ab2459c2394588e66b65552', poster: 'images/method-8-390.webp', width: 720, height: 1280, ariaLabel: 'Ice-tip extensions' }, label: 'Ice-tip extensions' },
  { video: { src: 'videos/Popular Method VIDEOS/Vlight.mp4', gumletId: '6ab245a2d017a04767ab9958', poster: 'images/method-9-390.webp', width: 720, height: 1280, ariaLabel: 'V-Light extensions' }, label: 'V-Light extensions' },
];

export const EXTENSION_COMPARE: { titlePrefix: string; titleEmphasis: string; otherHead: string; usHead: string; captionOther: string; ctaLabel: string; rows: AlchemaneCompareRow[] } = {
  titlePrefix: 'Other Salons vs Alchemane',
  titleEmphasis: 'See the Clear Winner',
  otherHead: 'Other Salons',
  usHead: 'At Alchemane',
  captionOther: 'Feature comparison between other salons and Alchemane',
  ctaLabel: 'Speak to an Expert',
  rows: [
    { feature: 'Texture Match', other: 'Off or patchy', us: 'Custom matched' },
    { feature: 'Fixing', other: 'Bulky or visible', us: 'Seamless blend' },
    { feature: 'Volume', other: 'Overdone', us: 'Face-flattering' },
    { feature: 'Method', other: 'One-size fits-all', us: '3 tailored options' },
    { feature: 'Hair Type', other: 'Synthetic feel', us: '100% human hair' },
    { feature: 'Execution', other: 'Untrained staff', us: 'Expert stylists' },
    { feature: 'Damage Risk', other: 'Glue or breakage', us: 'Zero damage' },
    { feature: 'Aftercare', other: 'None', us: 'Free touch-ups' },
  ],
};

export const EXTENSION_FOUNDER = {
  background: 'ivory' as const,
  ctaLabel: 'Start Your Hair Journey',
  video: {
    src: 'videos/Founder video.mp4', gumletId: '6ab2458b2394588e66b654db',
    poster: 'images/vinitt-dessai-780.webp',
    width: 1080,
    height: 1350,
    ariaLabel: 'Meet Vinitt Dessai, founder of Alchemane',
  } as AlchemaneVideoAsset,
  credentials: [
    'Globally certified hair expert with over **15 years of experience**.',
    'Trusted by thousands of women — including top **Bollywood celebrities**.',
    'Known for creating **ultra-natural** silk hair extensions that blend seamlessly.',
    'Believes every woman deserves hair that **looks real, flawless**, and full of life.',
  ],
};

export const EXTENSION_PROMISE_LEAD = 'Because your hair journey deserves more than just extensions.';

export const EXTENSION_FAQ: { lead: string; tabs: AlchemaneFaqTab[] } = {
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
      id: 'extensions',
      label: 'Extensions',
      items: [
        { question: 'Will it damage my real hair?', answer: 'No. All our methods are non-damaging and safe for regular wear.' },
        { question: 'Are they made from real human hair?', answer: 'Yes. We use 100% premium human hair for the most natural look and feel.' },
        { question: 'Can I wash and style them?', answer: 'Yes. Treat them just like your real hair.' },
        { question: "Will people know I'm wearing extensions?", answer: 'No. We blend them so well, no one will know.' },
        { question: 'What if I have very short or thin hair?', answer: "That's what we specialise in — we work with all hair types." },
        { question: 'How long do they last?', answer: '2 to 4 months depending on the method and care.' },
        { question: 'Will it match my current hair perfectly?', answer: 'Yes. We custom-match shade, texture, volume & fall.' },
      ],
    },
  ],
};

export const EXTENSION_LOCATION_PHOTOS: AlchemaneLocationPhoto[] = [
  { src: 'images/location-1.webp', width: 664, height: 1200, alt: 'Alchemane reception, Khar West Mumbai' },
  { src: 'images/location-2.webp', width: 670, height: 1200, alt: 'Alchemane styling floor with multiple stations' },
  { src: 'images/location-3.webp', width: 669, height: 1200, alt: 'Alchemane nail and beauty vanity' },
  { src: 'images/location-4.webp', width: 900, height: 1200, alt: 'Alchemane waiting lounge' },
  { src: 'images/location-5.webp', width: 669, height: 1200, alt: 'Alchemane private treatment room' },
  { src: 'images/location-6.webp', width: 666, height: 1200, alt: 'Alchemane styling area with city view' },
  { src: 'images/location-7.webp', width: 680, height: 1200, alt: 'Alchemane consultation corner' },
];
