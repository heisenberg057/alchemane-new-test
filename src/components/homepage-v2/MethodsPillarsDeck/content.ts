import { getMediaUrl } from '@/lib/media/cdn';

export type Method = {
  icon: 'sticker' | 'clips';
  title: string;
  body: string;
  href: string;
  image: string;
  alt: string;
};

export const methodsTitle = ['Our Trusted Methods For', 'A Natural Look'] as const;

export const methods: Method[] = [
  {
    icon: 'sticker',
    title: 'Stick-On Hair Systems',
    body: 'No clips, no hassle, just stick, style, and go. Perfect for a natural look all day — the base bonds to the scalp, so nothing moves when you do.',
    href: '#contact-form',
    image: getMediaUrl('/media/methods/stick-on.png'),
    alt: "A hair system base being lifted from a client's scalp during a fitting.",
  },
  {
    icon: 'clips',
    title: 'Clip-On Hair Systems',
    body: 'Clipped to your own hair rather than bonded, so there is no adhesive and nothing to shave. Take it off whenever you want to; put it back in minutes.',
    href: '#contact-form',
    image: getMediaUrl('/media/methods/clip-on.png'),
    alt: "The underside of a clip-on system, its metal clip visible, being lifted away from a client's own hair.",
  },
];

export const methodsAction = 'Explore Now';

export type PillarIcon = 'medal' | 'cpu' | 'sparkles' | 'shield';

export type Pillar = { icon: PillarIcon; title: string; body: string };

export const pillarsTitle = [
  'Why Thousands Of Men',
  'Choose American Hairline',
] as const;

export const pillars: Pillar[] = [
  {
    icon: 'medal',
    title: 'India’s #1 Top Experts',
    body: 'Trusted by thousands and featured in national media, we specialize in **non-surgical hair systems** tailored to Indian men — blending perfectly with your face shape, hair texture, and lifestyle. Our systems use **100% human hair** and are **ISO certified** for safety and quality.',
  },
  {
    icon: 'cpu',
    title: 'Tailored with Technology',
    body: 'From **Invisible Hairline Sculpting™** to **Nano Fusion Technology**, every system is crafted with advanced design and precision engineering for a seamless, natural look. Our **Single-strand Implantation** technique customizes your hairline with unmatched detail.',
  },
  {
    icon: 'sparkles',
    title: 'Celebrity-Trusted',
    body: 'Our systems are trusted by **Bollywood actors** and public figures, designed for high-definition cameras — yet discreet in daily life. Lightweight, breathable, and **virtually invisible** even up close. **USA-manufactured** and **doctor approved**.',
  },
  {
    icon: 'shield',
    title: 'Genuine Advice',
    body: 'No pressure, no upselling. Just expert advice from professionals who care. We guide you to the right solution, with **durability, comfort**, and **natural results** as our priority. We specialize in **ultra-natural looking hairlines** that restore confidence and look truly undetectable.',
  },
];

export type DeckCard = { name: string; quote: string; image: string };

export const deckTitle = ['Before And After,', 'In Their Own Words'] as const;

export const deckCards: DeckCard[] = [
  {
    name: 'Sameer Warma',
    quote:
      'I was amazed at how comfortable and natural the system feels. It’s exactly what I needed.',
    image: getMediaUrl('/media/deck/sameer-warma.png'),
  },
  {
    name: 'Daljit Singh',
    quote:
      'From consultation to final result, the team at American Hairline was incredible. I love my new look!',
    image: getMediaUrl('/media/deck/daljit-singh.png'),
  },
  {
    name: 'Advik Sharma',
    quote:
      'The hair system fits perfectly and looks completely natural. I feel so confident every day!',
    image: getMediaUrl('/media/deck/advik-sharma.png'),
  },
  {
    name: 'Fuzail Khan',
    quote:
      'It blends seamlessly with my natural hair. I feel like myself again, but better!',
    image: getMediaUrl('/media/deck/fuzail-khan.png'),
  },
  {
    name: 'Chandan Singh',
    quote:
      'The hair system feels like my own hair. It’s comfortable, natural, and gives me the perfect look.',
    image: getMediaUrl('/media/deck/chandan-singh.png'),
  },
];
