import { getMediaUrl } from '@/lib/media/cdn';

export type Achievement = {
  title: string;
  note: string;
  img: string;
  hidden?: boolean;
};

export const achievements: Achievement[] = [
  {
    title: 'Shark Tank India',
    note: 'Offered a deal on national television.',
    img: getMediaUrl('/media/achievements/shark-tank-india.png'),
  },
  {
    title: 'Bharat Innovators Award',
    note: 'Won for advancing non-surgical hair replacement in India.',
    img: getMediaUrl('/media/achievements/bharat-innovators-award.png'),
  },
  {
    title: 'Designed for Bollywood',
    note: 'Built for people whose hairline is examined frame by frame.',
    img: getMediaUrl('/media/achievements/designed-for-bollywood.png'),
  },
  {
    title: 'Advanced 3D Scan',
    note: 'Every base mapped to the scalp before a single strand is knotted.',
    img: getMediaUrl('/media/achievements/advanced-3d-scan.png'),
    hidden: true,
  },
];

export type KeyFactSlot = 'left' | 'middle-top' | 'middle-bottom' | 'right';

export type KeyFact = {
  value: string;
  label: string;
  slot: KeyFactSlot;
  image?: string;
};

export const keyFactsTitle = ['Why Men Around', 'The World Choose Us'] as const;

export const keyFacts: KeyFact[] = [
  {
    value: '12+ Years',
    label: 'Experience',
    slot: 'left',
    image: getMediaUrl('/media/key-facts/12-years-experience.png'),
  },
  {
    value: '6,770+',
    label: 'Men Helped',
    slot: 'middle-top',
    image: getMediaUrl('/media/key-facts/6770-men-helped.png'),
  },
  {
    value: '100%',
    label: 'Natural Looking',
    slot: 'middle-bottom',
    image: getMediaUrl('/media/key-facts/100-natural-looking.png'),
  },
  {
    value: '12+ Countries',
    label: 'Clients Served',
    slot: 'right',
    image: getMediaUrl('/media/key-facts/12-nations.png'),
  },
];
