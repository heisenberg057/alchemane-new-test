import { getMediaUrl } from '@/lib/media/cdn'

/** Scroll-scrubbed hero film — keep as CDN mp4 (Gumlet embeds cannot scrub). ~7MB. */
export const unifiedHairVideo = getMediaUrl('/media/hero-secret/hair-system-unified-clean.mp4')

export const clients = [
  { client: 'Rohan Bera', style: 'wavy side-swept', img: getMediaUrl('/media/hero-secret/clients/client-1.png') },
  { client: 'Daljit Singh', style: 'short natural', img: getMediaUrl('/media/hero-secret/clients/client-2.png') },
  { client: 'Chandan Singh', style: 'thick jet-black', img: getMediaUrl('/media/hero-secret/clients/client-3.png') },
  { client: 'Rylan Rodrigues', style: 'textured crop', img: getMediaUrl('/media/hero-secret/clients/client-4.png') },
  { client: 'Arun Sharma', style: 'classic side part', img: getMediaUrl('/media/hero-secret/clients/client-5.png') },
  { client: 'Advik Sharma', style: 'full volume', img: getMediaUrl('/media/hero-secret/clients/client-6.png') },
] as const

export const secretTitleLines = ['The Secret Behind', 'Our Natural Hairline'] as const

export const secretBenefits = [
  { title: 'Looks Just Like Your Own Scalp', note: 'Nobody can tell' },
  { title: 'No Harsh or Fake Hairline', note: 'Only natural edges' },
  { title: 'Feels Light, Breathable, Comfortable', note: 'Just like your own' },
] as const

export const secretClosingLines = ['No Line. No Shine.', 'Just Real'] as const
