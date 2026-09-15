export type FunnelSlug =
  | 'clip-on-hair-system'
  | 'failed-hair-transplant'
  | 'hair-loss-solution-bangalore'
  | 'hair-loss-solution-for-corporate-men'
  | 'hair-loss-solution-for-gym-goers'
  | 'hair-loss-solution-for-married-men'
  | 'hair-loss-solutions'
  | 'hair-loss-solutions-delhi'
  | 'hair-loss-solutions-for-men'
  | 'hair-replacement-visitors'
  | 'scalp-micro-pigmentation'
  | 'stick-on-hair-system'
  | 'transplant-grade-hair-systems';

export type FunnelPageMeta = {
  slug: FunnelSlug;
  title: string;
  description: string;
  formType: string;
  trackingEventForm: string;
  /** Indexable in search — set false for paid-only LPs if needed */
  indexable: boolean;
};

export const FUNNEL_PAGE_META: Record<FunnelSlug, FunnelPageMeta> = {
  'clip-on-hair-system': {
    slug: 'clip-on-hair-system',
    title: 'Clip-On Hair Systems | American Hairline',
    description: 'Explore clip-on hair systems with a natural-looking hairline.',
    formType: 'consultation',
    trackingEventForm: 'funnel_clip_on_hair_system',
    // Organic page /clip-on-hair-system owns index; keep LP for ads only.
    indexable: false,
  },
  'failed-hair-transplant': {
    slug: 'failed-hair-transplant',
    title: 'Hair Transplant Failed? | American Hairline',
    description: 'Non-surgical alternatives when hair transplant results fall short.',
    formType: 'consultation',
    trackingEventForm: 'funnel_failed_hair_transplant',
    indexable: true,
  },
  'hair-loss-solution-bangalore': {
    slug: 'hair-loss-solution-bangalore',
    title: 'Hair Loss Solutions Bangalore | American Hairline',
    description: 'Hair loss solutions and non-surgical hair systems in Bangalore.',
    formType: 'consultation',
    trackingEventForm: 'funnel_hair_loss_solution_bangalore',
    indexable: true,
  },
  'hair-loss-solution-for-corporate-men': {
    slug: 'hair-loss-solution-for-corporate-men',
    title: 'Hair Loss Solutions for Corporate Men | American Hairline',
    description: 'Natural-looking hair systems for working professionals and corporate men.',
    formType: 'consultation',
    trackingEventForm: 'funnel_hair_loss_solution_for_corporate_men',
    indexable: true,
  },
  'hair-loss-solution-for-gym-goers': {
    slug: 'hair-loss-solution-for-gym-goers',
    title: 'Hair Loss Solutions for Gym Goers | American Hairline',
    description: 'Secure, sweat-friendly hair systems for active men and gym-goers.',
    formType: 'consultation',
    trackingEventForm: 'funnel_hair_loss_solution_for_gym_goers',
    indexable: true,
  },
  'hair-loss-solution-for-married-men': {
    slug: 'hair-loss-solution-for-married-men',
    title: 'Hair Loss Solutions for Married Men | American Hairline',
    description: 'Undetectable hair systems designed for married men who want confidence back.',
    formType: 'consultation',
    trackingEventForm: 'funnel_hair_loss_solution_for_married_men',
    indexable: true,
  },
  'hair-loss-solutions': {
    slug: 'hair-loss-solutions',
    title: 'Hair Loss Solutions | American Hairline',
    description: 'Book a consultation for non-surgical hair replacement and hair systems.',
    formType: 'consultation',
    trackingEventForm: 'funnel_hair_loss_solutions',
    indexable: true,
  },
  'hair-loss-solutions-delhi': {
    slug: 'hair-loss-solutions-delhi',
    title: 'Hair Loss Solutions Delhi | American Hairline',
    description: 'Hair loss solutions and non-surgical hair systems in Delhi.',
    formType: 'consultation',
    trackingEventForm: 'funnel_hair_loss_solutions_delhi',
    indexable: true,
  },
  'hair-loss-solutions-for-men': {
    slug: 'hair-loss-solutions-for-men',
    title: 'Hair Loss Solutions for Men | American Hairline',
    description: 'Non-surgical hair systems for men with natural-looking results.',
    formType: 'consultation',
    trackingEventForm: 'funnel_hair_loss_solutions_for_men',
    indexable: true,
  },
  'hair-replacement-visitors': {
    slug: 'hair-replacement-visitors',
    title: 'Hair Replacement for Visitors | American Hairline',
    description: 'Hair replacement solutions for visitors considering a natural hair system.',
    formType: 'consultation',
    trackingEventForm: 'funnel_hair_replacement_visitors',
    indexable: false,
  },
  'scalp-micro-pigmentation': {
    slug: 'scalp-micro-pigmentation',
    title: 'Scalp Micropigmentation | American Hairline',
    description: 'Scalp micropigmentation and hair restoration consultations.',
    formType: 'consultation',
    trackingEventForm: 'funnel_scalp_micro_pigmentation',
    // Near-duplicate of organic /scalp-micropigmentation
    indexable: false,
  },
  'stick-on-hair-system': {
    slug: 'stick-on-hair-system',
    title: 'Stick-On Hair Systems | American Hairline',
    description: 'Medical-grade stick-on hair systems for a natural look.',
    formType: 'consultation',
    trackingEventForm: 'funnel_stick_on_hair_system',
    // Near-duplicate of /clip-on-or-stick-on/stick-on-hair-system
    indexable: false,
  },
  'transplant-grade-hair-systems': {
    slug: 'transplant-grade-hair-systems',
    title: 'Transplant Grade Hair Systems | American Hairline',
    description: 'Hair-system results with transplant-level density and natural hairlines.',
    formType: 'consultation',
    trackingEventForm: 'funnel_transplant_grade_hair_systems',
    indexable: true,
  },
};

export const FUNNEL_SLUGS = Object.keys(FUNNEL_PAGE_META) as FunnelSlug[];

export function isFunnelSlug(slug: string): slug is FunnelSlug {
  return slug in FUNNEL_PAGE_META;
}

export function getFunnelMeta(slug: FunnelSlug): FunnelPageMeta {
  return FUNNEL_PAGE_META[slug];
}
