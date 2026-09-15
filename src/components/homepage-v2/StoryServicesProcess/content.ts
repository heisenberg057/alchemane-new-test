import { getMediaUrl } from '@/lib/media/cdn';

export type StoryIcon = 'frown' | 'eye-off' | 'pill' | 'syringe' | 'shield';

export type StoryPoint = { icon: StoryIcon; text: string };

export const storyTitle = ['This Might Sound Like', 'Your Story'] as const;

export const storyPoints: StoryPoint[] = [
  {
    icon: 'frown',
    text: 'If you are tired of feeling self-conscious about your hair.',
  },
  { icon: 'eye-off', text: 'If you avoid photos, mirrors, or social events.' },
  {
    icon: 'pill',
    text: 'If you have tried oils, pills, & shampoos that never worked.',
  },
  {
    icon: 'syringe',
    text: 'If surgery feels too risky, complicated, or overwhelming.',
  },
  { icon: 'shield', text: 'If you want a natural-looking, pain-free solution.' },
];

export const storyCta = {
  title: 'If Yes, we’ll guide you',
  body: 'Need clarity? Our consultant will guide you step by step to find what truly works for you. Zero pressure. All clarity.',
  action: 'Get Guidance Now',
  href: '#contact-form',
};

export type Service = {
  title: string;
  body: string;
  image: string;
  alt: string;
  href: string;
};

export const servicesTitle = ['Explore Our Trusted Range', 'Of Hair Services'] as const;

export const services: Service[] = [
  {
    title: 'Non-Surgical Hair Replacement',
    body: 'Natural hair systems, no surgery with perfectly blended and built to restore confidence.',
    image: getMediaUrl('/media/services/non-surgical-hair-replacement.png'),
    alt: "A hair system being fitted to a client's crown.",
    href: '#contact-form',
  },
  {
    title: 'Scalp Micro Pigmentation',
    body: 'Pigment placed strand by strand to read as real follicles. It is not a tattoo, and it does not regrow hair — it restores the look of density.',
    image: getMediaUrl('/media/services/scalp-micro-pigmentation.png'),
    alt: 'Scalp micro pigmentation being applied along a hairline.',
    href: '#contact-form',
  },
  {
    title: 'Hair Transplant',
    body: 'A front hairline transplant paired with a hair system, for men whose own density can carry the front but not the crown.',
    image: getMediaUrl('/media/services/hair-transplant.png'),
    alt: 'A transplanted front hairline shortly after the procedure.',
    href: '#contact-form',
  },
];

export const servicesAction = 'Explore Now';

export type ProcessStep = { label: string; title: string; body: string };

export const processTitle = ['The Step-By-Step Process', 'To Natural Hair'] as const;

export const processSteps: ProcessStep[] = [
  {
    label: 'Step 1',
    title: 'Consultation',
    body: 'Meet our expert to discuss your hair goals.',
  },
  {
    label: 'Step 2',
    title: 'Customization',
    body: 'Get a solution tailored exactly for you.',
  },
  {
    label: 'Step 3',
    title: 'Transformation',
    body: 'See your new look come alive instantly.',
  },
];

/**
 * Process video — use Gumlet (old homepage Process desktop/mobile IDs).
 * Do NOT point src at the 350MB R2 mp4.
 */
export const processVideo = {
  poster: getMediaUrl('/media/process/steps.png'),
  src: '',
  /** Desktop/process walkthrough (same family as old homepage Process). */
  gumletId: '69dc8fdfc6b8ccb79da8cd90',
  alt: "A client's template, hairline mapping and fitting shown beside his finished look.",
  label: 'Watch the process',
};

export const processAction = 'Discuss With A Consultant';
