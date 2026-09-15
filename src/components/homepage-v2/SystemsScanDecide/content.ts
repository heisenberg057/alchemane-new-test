import { getMediaUrl, gumletEmbedUrl } from '@/lib/media/cdn';

export type HairSystem = {
  id: number;
  image: string;
  title: string;
  /** Gumlet embed URL; empty means poster-only */
  src: string;
};

export const systemsTitle = ["World's Finest Thinnest", 'Hair Systems'] as const;

const gumlet = gumletEmbedUrl;

export const hairSystems: HairSystem[] = [
  {
    id: 1,
    image: getMediaUrl('/media/systems/system-01.png'),
    title: 'Styling a finished system',
    src: gumlet('69dc87687e5487dd1d91c6b9'),
  },
  {
    id: 2,
    image: getMediaUrl('/media/systems/system-02.png'),
    title: 'Lace base held in hand',
    src: gumlet('69dc879b7e5487dd1d91cb18'),
  },
  {
    id: 3,
    image: getMediaUrl('/media/systems/system-03.png'),
    title: 'Side profile on the block',
    src: gumlet('69dc879be556529568bbc72d'),
  },
  {
    id: 4,
    image: getMediaUrl('/media/systems/system-04.png'),
    title: 'Base edge in close detail',
    src: gumlet('69dc8768c6b8ccb79da81316'),
  },
  {
    id: 5,
    image: getMediaUrl('/media/systems/system-05.png'),
    title: 'Swept-back dark system',
    src: gumlet('69dc8768c6b8ccb79da81338'),
  },
  {
    id: 6,
    image: getMediaUrl('/media/systems/system-06.png'),
    title: 'Brown volume system',
    src: gumlet('69dc87687e5487dd1d91c69a'),
  },
  {
    id: 7,
    image: getMediaUrl('/media/systems/system-07.png'),
    title: 'Black quiff system',
    src: gumlet('69dc8768c6b8ccb79da81314'),
  },
  {
    id: 8,
    image: getMediaUrl('/media/systems/system-08.png'),
    title: 'Medium brown system',
    src: gumlet('69dc8768c6b8ccb79da81336'),
  },
  {
    id: 9,
    image: getMediaUrl('/media/systems/system-09.png'),
    title: 'Black textured system',
    src: gumlet('69dc87687e5487dd1d91c6a6'),
  },
  {
    id: 10,
    image: getMediaUrl('/media/systems/system-10.png'),
    title: 'Soft brown system',
    src: gumlet('69dc87687e5487dd1d91c6ab'),
  },
  {
    id: 11,
    image: getMediaUrl('/media/systems/system-11.png'),
    title: 'Visible PU base band',
    src: gumlet('69dc8768e556529568bbc2c3'),
  },
  {
    id: 12,
    image: getMediaUrl('/media/systems/system-12.png'),
    title: 'Messy textured system',
    src: gumlet('69dc8768c6b8ccb79da8133d'),
  },
  {
    id: 13,
    image: getMediaUrl('/media/systems/system-13.png'),
    title: 'Short dark system',
    // No matching Gumlet asset in the live homepage set (12 embeds)
    src: '',
  },
];

export const scanTitle = {
  before: 'Uses Advanced',
  after: '3D',
  second: 'Scan Technology',
} as const;

export const scanImage = {
  src: getMediaUrl('/media/scan/advanced-3d-scan.png'),
  alt: "A client's scalp being measured with the Advanced 3D Scan, the density map building on the laptop beside him.",
};

export const decideTitle = ['Real Hair Or Illusion?', 'Watch & Decide'] as const;

/**
 * Decide video — Gumlet from old homepage Real Hair Illusion (desktop).
 * Do NOT point src at the 51MB R2 mp4.
 */
export const decideVideo = {
  poster: getMediaUrl('/media/decide/from-bald-to-bold.png'),
  src: '',
  gumletId: '69dc8c957e5487dd1d9236bd',
  alt: 'Before-and-after transformation of a client, from bald to bold, with the hairline marked on both portraits.',
  label: 'Watch and decide',
};

export const decideNote =
  'Same man, same camera, same light. The only thing that changed is the hairline.';
