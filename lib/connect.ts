/**
 * Where to find Clelland Maths, and how to get in touch.
 *
 * Carried across from the live app's "Connect With Us" and "Support & More"
 * blocks, so the two sites do not drift into listing different places. Every
 * URL here was taken from the deployed app rather than reconstructed.
 */

export interface ConnectLink {
  name: string;
  description: string;
  url: string;
  /** Brand-ish colour for the tile edge. */
  accent: string;
}

/** Where the teaching actually happens. */
export const FOLLOW_LINKS: ConnectLink[] = [
  {
    name: 'YouTube',
    description: 'Every past paper worked through, plus the live exam-night streams.',
    url: 'https://www.youtube.com/clellandmaths',
    accent: 'text-red-400',
  },
  {
    name: 'TikTok',
    description: 'Short technique clips and exam tips.',
    url: 'https://www.tiktok.com/@clellandmaths',
    accent: 'text-cyan-400',
  },
  {
    name: 'Revision App',
    description: 'The mobile app — past papers and video solutions on your phone.',
    url: 'https://app.clellandmaths.com',
    accent: 'text-violet-400',
  },
];

/** Ways to support the channel, and the paid extras. */
export const SUPPORT_LINKS: ConnectLink[] = [
  {
    name: 'Channel membership',
    description: 'Members-only content on YouTube.',
    url: 'https://www.youtube.com/channel/UC8XkJnNLavN1Jbicf0nLNdQ/join',
    accent: 'text-amber-400',
  },
  {
    name: 'Merch store',
    description: 'T-shirts and hoodies.',
    url: 'https://clellandmaths.teemill.com',
    accent: 'text-emerald-400',
  },
  {
    name: 'Buy me a coffee',
    description: 'One-off support for the free resources.',
    url: 'https://buymeacoffee.com/clellandmaths',
    accent: 'text-yellow-400',
  },
  {
    name: 'Cameo',
    description: 'A personalised video message.',
    url: 'https://www.cameo.com/clellandmaths',
    accent: 'text-pink-400',
  },
];

/**
 * The address for questions.
 *
 * Null until one is chosen. While it is null, every "get in touch" on the site
 * points at the Connect page instead of inventing an address — a mailto: to a
 * guessed inbox is worse than no mailto at all, because the sender believes it
 * arrived.
 */
export const CONTACT_EMAIL: string | null = 'clellandmaths@gmail.com';

export function contactHref(): string {
  return CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : '/connect';
}
