import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * Privacy notice.
 *
 * Written against what the site actually does, checked rather than assumed. If
 * that ever stops being true — a newsletter added, a form that submits
 * somewhere — this page changes in the same commit. A privacy notice that is
 * out of date is worse than none: it is a statement to the reader that happens
 * to be false.
 *
 * Measurement is Cloudflare Web Analytics, which is cookieless — so there is no
 * consent banner and this page can promise none. Google Search Console is a
 * webmaster tool reading Google's own search logs: it puts no script on the
 * page and sees nothing about a reader, so it is not described here. If a
 * cookie-setting tracker is ever added, it needs consent BEFORE it is set
 * under PECR, which means a banner defaulting to off — and this page changes
 * in that same commit.
 *
 * The audience is largely school pupils, so this is deliberately plain English
 * rather than legal boilerplate. The ICO's Children's Code asks for exactly
 * that: privacy information a child can actually understand.
 */

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'What Clelland Maths does and does not collect. No accounts, no sign-up, and nothing you do on the site leaves your own device.',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-bold tracking-tight mb-3">{title}</h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">Clelland Maths</p>
      <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">Privacy</h1>

      <p className="text-lg text-foreground/90 leading-relaxed">
        Clelland Maths does not ask who you are. There is no sign-up, no login and no form
        anywhere on this site. We do not know your name or your email address, because we never
        ask for them and there is nowhere for them to go.
      </p>

      <Section title="What is stored, and where">
        <p>
          The site remembers a few things to save you repeating yourself: which course you last
          chose, which boxes you have ticked in the Exam Hall, which notes topics and practice
          questions you have marked as done, and the worksheet you are part-way through building.
        </p>
        <p>
          All of it is kept by your own browser, on your own device, and none of it is sent to us
          or to anyone else. Clearing your browser data removes it. Using a different device or a
          private window starts fresh — that is why a worksheet does not follow you between
          computers.
        </p>
      </Section>

      <Section title="Videos">
        <p>
          Video solutions are hosted on YouTube and played here through YouTube&rsquo;s
          privacy-enhanced player (<span className="font-mono text-sm">youtube-nocookie.com</span>),
          which does not set cookies unless you actually press play. Once you do, YouTube receives
          the request and applies its own privacy policy, exactly as if you had opened the video on
          YouTube itself.
        </p>
        <p>
          The course pages also show video thumbnail images, which are loaded from YouTube when the
          page opens. That means YouTube can see that a browser somewhere requested a thumbnail,
          even if you never play anything.
        </p>
      </Section>

      <Section title="The RStudio workbook">
        <p>
          The{' '}
          <Link href="/course/higher-apps/rstudio/" className="underline hover:text-foreground">
            Higher Applications RStudio workbook
          </Link>{' '}
          runs R inside your browser. To do that it downloads the R software and the practice
          datasets from third-party services when you open it — GitHub and the WebR project. Your
          code and your results stay in your browser; nothing you type there is sent to us.
        </p>
      </Section>

      <Section title="Visitor numbers">
        <p>
          We use Cloudflare Web Analytics to count visits and see which pages get used. It does not
          use cookies, does not follow you between sites and does not build a profile of you — it
          simply counts pages. There is nothing to opt in or out of, because there is nothing about
          you in it.
        </p>
        <p>
          That is the only thing measuring visits. We do not use Google Analytics or any other
          tracking script, and nothing on this site sets a cookie.
        </p>
      </Section>

      <Section title="What we do not do">
        <ul className="list-disc pl-5 space-y-2">
          <li>No accounts, no passwords, no email addresses.</li>
          <li>No advertising, and nothing sold or shared with anyone.</li>
          <li>No advertising cookies, no tracking scripts, and no cookies set by us.</li>
          <li>Nothing you type into the site — worksheets, notes progress — is sent to us.</li>
          <li>
            QR codes and worksheet links are made inside your browser, not by a service somewhere
            that would see what you built.
          </li>
        </ul>
      </Section>

      <Section title="Sharing a worksheet">
        <p>
          A shared worksheet link carries the worksheet inside the link itself — which questions,
          in which order, under whatever title was typed. Nothing is stored on our side, which is
          why the links keep working and why we cannot see who made one or who opened it. Anyone
          with the link can open it, so treat it like any other link you pass around.
        </p>
      </Section>

      <Section title="If you are under 13">
        <p>
          You are welcome to use the site. There is nothing to sign up for and nothing to fill in,
          so we hold nothing about you at all. Nothing here asks your age, because nothing here
          needs to know it.
        </p>
        <p>
          If a parent or teacher wants to check what the site does, this page is the whole of it.
        </p>
      </Section>

      <Section title="Questions">
        <p>
          If something here is unclear, or you think the site is doing something this page does not
          describe, get in touch through the{' '}
          <a
            href="https://www.youtube.com/clellandmaths"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Clelland Maths YouTube channel
          </a>
          .
        </p>
      </Section>

      <p className="mt-12 pt-6 border-t border-border text-sm text-muted-dim">
        This page describes the site as it is now. If we ever add something that collects data, we
        will change this page at the same time.
      </p>
    </div>
  );
}
