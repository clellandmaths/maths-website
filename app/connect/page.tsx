import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Youtube, Music2, Smartphone, Star, Shirt, Coffee, Video, Sparkles, type LucideIcon } from 'lucide-react';
import { FOLLOW_LINKS, SUPPORT_LINKS, CONTACT_EMAIL, type ConnectLink } from '@/lib/connect';

export const metadata: Metadata = {
  title: 'Connect',
  description:
    'Get in touch with Clelland Maths by email, or find the YouTube channel, TikTok, revision app, channel membership and merch store.',
};

// lucide has no TikTok mark; Music2 is the closest honest stand-in and the
// black button colour carries the recognition anyway.
const ICONS: Record<ConnectLink['icon'], LucideIcon> = {
  youtube: Youtube,
  tiktok: Music2,
  app: Smartphone,
  star: Star,
  shirt: Shirt,
  coffee: Coffee,
  cameo: Video,
};

/**
 * Solid colour, white text, icon on the left — the same shape as the live
 * app's Connect buttons, so someone arriving from there recognises the page.
 */
function LinkButton({ link }: { link: ConnectLink }) {
  const Icon = ICONS[link.icon];
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 ${link.colour} text-white font-semibold py-3 px-4 rounded-lg transition-colors`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="flex-1">
        {link.name}
        <span className="block text-xs font-normal text-white/80">{link.description}</span>
      </span>
    </a>
  );
}

export default function ConnectPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">Clelland Maths</p>
      <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">Connect</h1>
      <p className="text-lg text-foreground/90 leading-relaxed">
        Questions about a paper, a topic or the Academy — or just want to say the site helped. Here
        is where to find me.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold tracking-tight mb-4">Get in touch</h2>
        {CONTACT_EMAIL ? (
          <div className="bg-card border border-border rounded-2xl p-6">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-background font-bold py-3 px-5 rounded-lg transition-colors"
            >
              <Mail className="h-5 w-5" />
              Email me
            </a>
            <p className="mt-4 text-sm text-muted-foreground">
              {/* Written out as well as linked: on a shared or school computer a
                  mailto: often opens nothing, and then the address itself is the
                  only useful thing on the page. */}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono underline hover:text-foreground">
                {CONTACT_EMAIL}
              </a>
              {' '}— I read everything, though replies can take a few days in term time.
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground leading-relaxed">
            The quickest way to reach me is a comment on the{' '}
            <a
              href="https://www.youtube.com/clellandmaths"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              YouTube channel
            </a>
            {' '}— I read them all.
          </p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold tracking-tight mb-4">Where the maths is</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {FOLLOW_LINKS.map(link => <LinkButton key={link.url} link={link} />)}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold tracking-tight mb-4">Support and extras</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {SUPPORT_LINKS.map(link => <LinkButton key={link.url} link={link} />)}
        </div>
      </section>

      <section className="mt-12 bg-card border border-border rounded-2xl p-6">
        <p className="flex items-center gap-2 font-display text-lg font-bold mb-2">
          <Sparkles className="h-5 w-5 text-accent" />
          Clelland Maths Academy
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Weekly live masterclasses with recordings, notes and mock papers, limited to 25 seats a
          course. Everything else on this site stays free.
        </p>
        <Link
          href="/academy"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-background font-bold rounded-lg transition-colors"
        >
          See the Academy
        </Link>
      </section>
    </div>
  );
}
