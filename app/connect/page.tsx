import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, ExternalLink, Sparkles } from 'lucide-react';
import { FOLLOW_LINKS, SUPPORT_LINKS, CONTACT_EMAIL, type ConnectLink } from '@/lib/connect';

export const metadata: Metadata = {
  title: 'Connect',
  description:
    'Get in touch with Clelland Maths, or find the YouTube channel, TikTok, revision app, channel membership and merch store.',
};

function Tile({ link }: { link: ConnectLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 bg-card border border-border rounded-xl p-5 hover:border-white/20 transition-colors"
    >
      <div className="flex-1">
        <p className={`font-display font-bold mb-1 ${link.accent}`}>{link.name}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{link.description}</p>
      </div>
      <ExternalLink className="h-4 w-4 text-muted-dim shrink-0 mt-1 group-hover:text-foreground transition-colors" />
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
        <h2 className="font-display text-xl font-bold tracking-tight mb-3">Get in touch</h2>
        {CONTACT_EMAIL ? (
          <>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 px-5 py-3 bg-accent hover:bg-accent-hover text-background font-bold rounded-lg transition-colors"
            >
              <Mail className="h-4 w-4" />
              Email me
            </a>
            <p className="mt-3 text-sm text-muted-foreground">
              <span className="font-mono">{CONTACT_EMAIL}</span> — I read everything, though it can
              take a few days during term time.
            </p>
          </>
        ) : (
          /* No address set yet. Rather than a dead mailto:, point at the channel,
             which is where messages actually get seen today. */
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
          {FOLLOW_LINKS.map(link => <Tile key={link.url} link={link} />)}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold tracking-tight mb-4">Support and extras</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {SUPPORT_LINKS.map(link => <Tile key={link.url} link={link} />)}
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
