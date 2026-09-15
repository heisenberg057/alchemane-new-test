import { getMediaUrl, gumletEmbedUrl } from '@/lib/media/cdn';

export type ClientStory = {
  name: string;
  quote: string;
  poster: string;
  /** Native CDN mp4 — leave empty; prefer gumletId. */
  src: string;
  /** Gumlet asset id when uploaded (adaptive stream). */
  gumletId?: string;
  alt: string;
};

export const clientStoriesTitle = [
  'Some Of Our Clients',
  'With The Most Natural',
  'Hairline',
] as const;

/**
 * Click-to-play from R2 CDN (preload=none — does not download until tap).
 * Still ~16–32 MB each: upload to Gumlet and set gumletId for adaptive streaming.
 */
export const clientStories: ClientStory[] = [
  {
    name: 'Rylan Rodrigues',
    quote: 'I felt that the hair looks very natural, and it feels really good.',
    poster: getMediaUrl('/media/client-stories/client-story-1.png'),
    src: getMediaUrl('/media/client-stories/client-story-1.mp4'),
    alt: 'Client before and after: thinning crown, then a full swept-back system.',
  },
  {
    name: 'Arun Sharma',
    quote: 'I travel a lot, so now people will not recognize me from my passport photo.',
    poster: getMediaUrl('/media/client-stories/client-story-2.png'),
    src: getMediaUrl('/media/client-stories/client-story-2.mp4'),
    alt: 'Client before and after: receded hairline, then a restored natural front.',
  },
  {
    name: 'Rohan Bera',
    quote: 'The hair patch was very comfortable. It gives a very natural look. I really liked it.',
    poster: getMediaUrl('/media/client-stories/client-story-3.png'),
    src: getMediaUrl('/media/client-stories/client-story-3.mp4'),
    alt: 'Client before and after: visible scalp, then dense matched hair.',
  },
  {
    name: 'Sahil Khan',
    quote: 'I really liked the entire process, from start to finish. I feel like a new person.',
    poster: getMediaUrl('/media/client-stories/client-story-4.png'),
    src: getMediaUrl('/media/client-stories/client-story-4.mp4'),
    alt: 'Client before and after: grey thinning front, then a full styled system.',
  },
  {
    name: 'Rohan Deshmukh',
    quote: 'It feels so good to touch my head again. This is amazing. I am very happy with it.',
    poster: getMediaUrl('/media/client-stories/client-story-5.png'),
    src: getMediaUrl('/media/client-stories/client-story-5.mp4'),
    alt: 'Client before and after: bare crown, then a textured natural finish.',
  },
  {
    name: 'Anup Kumar',
    quote: 'The hair system is amazing, and the facilities are amazing.',
    poster: getMediaUrl('/media/client-stories/client-story-6.png'),
    src: getMediaUrl('/media/client-stories/client-story-6.mp4'),
    alt: 'Client before and after: advanced hair loss, then a matched hairline.',
  },
];

export const backedTitle = ['Backed By Thousands Of', 'Confident Men'] as const;

export const backedProof = [
  {
    icon: getMediaUrl('/media/backed/google.png'),
    alt: 'Google',
    value: '4.9',
    count: 4.9,
    decimals: 1 as const,
    label: 'Google Rating',
    note: '300+ reviews',
    stars: 4.5,
  },
  {
    icon: getMediaUrl('/media/backed/youtube.png'),
    alt: 'YouTube',
    value: '50K+',
    count: 50,
    suffix: 'K+',
    unit: 'Subscribers',
    label: 'on YouTube',
    note: 'Growing community',
  },
] as const;

export const backedFoot = 'Join our community of satisfied customers';

/** Helper if a story still needs a Gumlet embed URL elsewhere. */
export function clientStoryEmbed(story: ClientStory): string {
  return story.gumletId ? gumletEmbedUrl(story.gumletId) : story.src;
}
