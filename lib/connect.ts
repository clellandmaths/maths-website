/**
 * Where to find Clelland Maths, and how to get in touch.
 *
 * Carried across from the live app's "Connect With Us" and "Support & More"
 * blocks, so the two sites do not drift into listing different places. Every
 * URL and button colour here was taken from the deployed app rather than
 * reconstructed, so someone arriving from one recognises the other.
 */

export interface ConnectLink {
  name: string;
  description: string;
  url: string;
  /** Lucide icon name, resolved on the page. */
  icon: 'youtube' | 'tiktok' | 'app' | 'star' | 'shirt' | 'coffee' | 'cameo';
  /** Solid button colour, carried over from the live app so the two match. */
  colour: string;
}

/** Where the teaching actually happens. */
export const FOLLOW_LINKS: ConnectLink[] = [
  {
    name: 'YouTube',
    description: 'Every past paper worked through, plus the live exam-night streams.',
    url: 'https://www.youtube.com/clellandmaths',
    icon: 'youtube',
    colour: 'bg-red-600 hover:bg-red-700',
  },
  {
    name: 'TikTok',
    description: 'Short technique clips and exam tips.',
    url: 'https://www.tiktok.com/@clellandmaths',
    icon: 'tiktok',
    colour: 'bg-black hover:bg-gray-800',
  },
  {
    name: 'Revision App',
    description: 'The mobile app — past papers and video solutions on your phone.',
    url: 'https://app.clellandmaths.com',
    icon: 'app',
    colour: 'bg-blue-600 hover:bg-blue-700',
  },
];

/** Ways to support the channel, and the paid extras. */
export const SUPPORT_LINKS: ConnectLink[] = [
  {
    name: 'Channel membership',
    description: 'Members-only content on YouTube.',
    url: 'https://www.youtube.com/channel/UC8XkJnNLavN1Jbicf0nLNdQ/join',
    icon: 'star',
    colour: 'bg-yellow-600 hover:bg-yellow-700',
  },
  {
    name: 'Merch store',
    description: 'T-shirts and hoodies.',
    url: 'https://clellandmaths.teemill.com',
    icon: 'shirt',
    colour: 'bg-green-600 hover:bg-green-700',
  },
  {
    name: 'Buy me a coffee',
    description: 'One-off support for the free resources.',
    url: 'https://buymeacoffee.com/clellandmaths',
    icon: 'coffee',
    colour: 'bg-amber-500 hover:bg-amber-600',
  },
  {
    name: 'Cameo',
    description: 'A personalised video message.',
    url: 'https://www.cameo.com/clellandmaths',
    icon: 'cameo',
    colour: 'bg-purple-600 hover:bg-purple-700',
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
