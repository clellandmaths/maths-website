import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Video, Archive, FileText, ClipboardList, MessageCircle, UserCheck, HeartHandshake,
  Lock, ShieldCheck, CalendarDays, Clock, ChevronRight, Rewind, GraduationCap,
  Target, PiggyBank,
} from 'lucide-react';
import { ACADEMY_COURSES, ACADEMY_IMAGES, ACADEMY_PRESS, SEATS_PER_COURSE, TRIAL_PRICE, MONTHLY_PRICE } from '@/lib/academy';
import { getCourseTheme } from '@/lib/course-theme';

export const metadata: Metadata = {
  title: 'Academy — Live Masterclasses',
  description:
    'Clelland Maths Academy: weekly live masterclasses for National 5, Higher, Advanced Higher and Applications of Maths, taught by an active Scottish maths teacher. Strictly 25 seats per course.',
};

/**
 * A picture the page wants.
 *
 * With no file yet it renders a labelled slot describing what belongs there.
 * That is deliberate: a broken image on a page asking parents for money reads
 * as a broken business, whereas an obvious gap reads as a page still being
 * finished — and it tells whoever fills it exactly what to supply.
 */
function ImageSlot({
  name, alt, hint, className = '', aspect = 'aspect-[16/9]',
}: { name: keyof typeof ACADEMY_IMAGES; alt: string; hint: string; className?: string; aspect?: string }) {
  const src = ACADEMY_IMAGES[name];
  if (src) {
    return <img src={src} alt={alt} className={`w-full rounded-2xl ${className}`} loading="lazy" />;
  }
  return (
    <div
      className={`${aspect} w-full rounded-2xl border-2 border-dashed border-border bg-card/50 flex items-center justify-center p-6 ${className}`}
    >
      <p className="text-center text-sm text-muted-dim max-w-xs">{hint}</p>
    </div>
  );
}

function Feature({ icon: Icon, title, children }: { icon: typeof Video; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <Icon className="h-6 w-6 text-accent mb-3" />
      <h3 className="font-display text-lg font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

function Compare({ icon: Icon, title, children }: { icon: typeof Video; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <Icon className="h-5 w-5 text-accent shrink-0 mt-1" />
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

export default function AcademyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">

      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="order-2 md:order-1">
          <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
            Clelland Maths Academy
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Premium online masterclasses
          </h1>
          <p className="text-lg text-foreground/90 leading-relaxed mb-4">
            For the 2026/2027 academic year, taught directly by David Clelland — the Scottish maths
            teacher BBC News turned to for comment on the 2026 Higher Maths exam.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Last year, over 2,400 students relied on my live streams for their final exam
            preparation. This year, I am opening up a strictly limited inner circle to provide
            direct, personalised support to students navigating the new Qualifications Scotland
            exams.
          </p>
          <p className="inline-flex items-center gap-2 text-sm font-semibold bg-accent/10 text-accent rounded-full px-4 py-2 mb-6">
            <Lock className="h-4 w-4" />
            Strictly limited — only {SEATS_PER_COURSE} seats per course
          </p>
          <div>
            <a
              href="#secure-your-seat"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-background font-bold rounded-lg transition-colors"
            >
              Secure your child&rsquo;s seat today
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <ImageSlot
            name="hero"
            alt="David Clelland teaching"
            aspect="aspect-[4/5]"
            hint="Hero photo of David — teaching, holding an iPad, or smiling to camera. Parents need to see the person they are trusting."
          />
        </div>
      </section>

      {/* ─────────────────── Press credits ───────────────────
          The BBC mark is white letters in black boxes, so it needs the white
          chip to be visible at all against a dark page — and that is also the
          only background it is meant to sit on. Each credit links to the piece,
          so the claim can be checked rather than taken on trust. */}
      <section className="mt-14 border-y border-border py-6">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-dim mb-4 text-center">
          As featured on
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          {ACADEMY_PRESS.map(item => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:opacity-80 transition-opacity"
              aria-label={`${item.name} — read the article`}
            >
              {item.logo ? (
                <span className="inline-flex items-center bg-white rounded-md px-3 py-2">
                  <img src={item.logo} alt={item.name} className="h-6 w-auto" />
                </span>
              ) : (
                <span className="text-lg font-display font-semibold">{item.name}</span>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* ──────────────── Navigating the new exams ──────────────── */}
      <section className="mt-14">
        <h2 className="font-display text-3xl font-bold tracking-tight mb-4">
          Navigating the new exams
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              In May 2026, the first Higher Maths exam under Qualifications Scotland made national
              news. More than 14,000 people signed a petition calling for a review of paper one, and
              pupils told BBC Scotland the questions were &ldquo;unrecognisable&rdquo; from what
              they had prepared for.
            </p>
            <p>
              BBC News asked me about that paper. This is what I told them:
            </p>
            <blockquote className="border-l-2 border-accent pl-4 text-foreground/90 italic">
              &ldquo;I run a last-minute livestream the night before the exam, and a lot of the
              questions I went through were pretty much in the exam.&rdquo;
              <cite className="block not-italic text-sm text-muted-dim mt-2">
                —{' '}
                <a
                  href={ACADEMY_PRESS[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  BBC News, 12 May 2026
                </a>
              </cite>
            </blockquote>
            <p>
              I built that livestream out of previous papers. The command words had not changed —
              what caught pupils out was how abstract some of the questions were compared with what
              they had practised.
            </p>
            <p className="text-foreground/90 font-medium">
              Rote memorisation does not work any more. Decoding an unfamiliar question is a skill,
              it can be taught, and it is exactly what we do inside the Academy.
            </p>
          </div>
          <ImageSlot
            name="bbc"
            alt="BBC News article about the Higher Maths exam"
            hint="Screenshot of the BBC article headline and byline. The portrait in that article is credited 'Image source: David Clelland', so that photo is yours to reuse here or as the hero."
          />
        </div>
      </section>

      {/* ──────────────── The masterclass experience ──────────────── */}
      <section className="mt-16">
        <h2 className="font-display text-3xl font-bold tracking-tight mb-3">
          The masterclass experience
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-8 max-w-3xl">
          Forget generic, uninspired tutoring. This is a highly structured, premium curriculum
          designed to decode the toughest exam questions and build absolute confidence in
          mathematics.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <Feature icon={HeartHandshake} title="A low-pressure, anxiety-friendly environment">
            Many teens dread the intense spotlight of one-to-one tutoring. In our live masterclasses
            students are completely in control of how they take part: cameras off and questions by
            private text chat if they feel anxious, or unmute and speak up if they are confident.
          </Feature>
          <Feature icon={Video} title="Weekly live masterclasses">
            One hour of high-impact, interactive teaching every week, breaking down the exact topics
            and questions Qualifications Scotland uses to test students.
          </Feature>
          <Feature icon={Archive} title="The private member vault">
            Every live session is recorded in high definition and uploaded to a secure, members-only
            portal. Your child can re-watch any lesson, at any time, right up until the final exam.
          </Feature>
          <Feature icon={FileText} title="Complete masterclass notes">
            No more frantic scribbling. A high-quality PDF of my exact handwritten iPad notes from
            every live session goes into the vault immediately, so your teen can focus on
            understanding the maths in the moment.
          </Feature>
          <Feature icon={ClipboardList} title="Curated practice and VIP mock exams">
            Students receive targeted assignments using hand-picked resources. As prelims and final
            exams approach, Academy members get VIP access to my mock exam papers and full video
            solutions.
          </Feature>
          <Feature icon={MessageCircle} title="Continuous weekly support">
            The learning does not stop when the hour is up. Inside the vault students can ask
            questions through the week, work with peers and get regular guidance directly from me —
            so they are never left stuck over homework.
          </Feature>
          <Feature icon={UserCheck} title="Direct expert support">
            Your child is not being taught by a university student. They are learning directly from
            an active, qualified Scottish maths teacher who knows exactly what markers need to see
            for top grades.
          </Feature>
        </div>
      </section>

      {/* ──────────────── YouTube proof ──────────────── */}
      <section className="mt-14">
        <ImageSlot
          name="youtube"
          alt="Clelland Maths YouTube channel"
          aspect="aspect-[21/9]"
          hint="Screenshot of the YouTube channel banner showing the subscriber count and total views."
        />
      </section>

      {/* ──────────────── Versus 1-on-1 ──────────────── */}
      <section className="mt-16">
        <h2 className="font-display text-3xl font-bold tracking-tight mb-3">
          Why the Academy beats traditional one-to-one tutoring
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-8 max-w-3xl">
          Many parents default to one-to-one tutoring, but the Academy model is designed to deliver
          better, more consistent results for Qualifications Scotland exams at a fraction of the
          cost.
        </p>
        <div className="space-y-6 max-w-3xl">
          <Compare icon={Rewind} title="You can rewind the teacher">
            In a traditional one-to-one session, once the hour is over the lesson is gone. If your
            teen forgets a concept two weeks later, they are stuck. With the Academy they can pause,
            rewind and re-watch every live lesson right up until the morning of the exam.
          </Compare>
          <Compare icon={GraduationCap} title="Guaranteed expertise">
            Finding a tutor who is an actual active Scottish maths teacher is difficult. Many
            private tutors are well-meaning university students who have never seen the inside of a
            marking room. I know where the marks are won and lost.
          </Compare>
          <Compare icon={Target} title="Proactive, not reactive">
            One-to-one sessions often devolve into helping with that week&rsquo;s homework. The
            Academy follows a rigorous, proactive curriculum designed to conquer the exam syllabus
            from start to finish.
          </Compare>
          <Compare icon={PiggyBank} title="Unbeatable value">
            Hiring a fully qualified, active maths teacher for one-to-one tuition easily costs £45
            to £60+ per hour — £195 to well over £260 every month. The Academy delivers a superior,
            resource-rich experience with recorded lessons and continuous weekly support for a flat
            {' '}{MONTHLY_PRICE} per month.
          </Compare>
        </div>
      </section>

      {/* ──────────────── Schedule ──────────────── */}
      <section className="mt-16">
        <h2 className="font-display text-3xl font-bold tracking-tight mb-3">The schedule</h2>
        <p className="text-muted-foreground mb-6">
          Classes commence mid-August. All classes are hosted via a secure, private video link.
        </p>
        <ul className="grid sm:grid-cols-2 gap-3">
          {ACADEMY_COURSES.map(c => {
            const theme = getCourseTheme(c.courseId);
            return (
              <li key={c.courseId} className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
                <CalendarDays className={`h-5 w-5 shrink-0 ${theme.text}`} />
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.day} @ {c.time}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ──────────────── Pricing ──────────────── */}
      <section className="mt-16">
        <h2 className="font-display text-3xl font-bold tracking-tight mb-3">
          Simple, predictable pricing
        </h2>
        <p className="text-muted-foreground mb-6">No long-term contracts. No hidden fees.</p>

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-2xl">
          <p className="font-display text-4xl font-bold mb-2">
            {TRIAL_PRICE} a week
          </p>
          <p className="text-lg text-foreground/90 mb-1">
            Full Academy membership, billed at a flat {MONTHLY_PRICE} a month.
          </p>
          <p className="text-muted-foreground mb-6">
            A single hour with a qualified maths teacher costs £45 to £60. This is {TRIAL_PRICE} a
            week for the masterclass, the recordings, the notes, the mock papers and support all
            week long.
          </p>

          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-semibold mb-1">Try your first week for {TRIAL_PRICE}</dt>
              <dd className="text-muted-foreground">
                This instantly secures your child&rsquo;s seat (1 of {SEATS_PER_COURSE}) and fully
                covers their first live masterclass week, to make sure it is the right fit.
              </dd>
            </div>
            <div>
              <dt className="font-semibold mb-1">Then {MONTHLY_PRICE} a month</dt>
              <dd className="text-muted-foreground">
                Membership is {TRIAL_PRICE} a week, taken monthly so your billing stays predictable
                rather than hitting your card every week. It covers everything the Academy includes,
                for as long as your child is a member.
              </dd>
            </div>
            <div>
              <dt className="font-semibold mb-1">Zero risk</dt>
              <dd className="text-muted-foreground">
                There is no year-long contract. You can cancel at any time, with no hassle.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ──────────────── Checkout ──────────────── */}
      <section id="secure-your-seat" className="mt-16 scroll-mt-20">
        <h2 className="font-display text-3xl font-bold tracking-tight mb-3">Secure your seat</h2>
        <p className="text-muted-foreground mb-2">
          Select your course below. Each link closes automatically once its {SEATS_PER_COURSE} seats
          are taken — Stripe stops accepting payments at the cap, so a link that still works is a
          seat that is still free.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          At checkout, please give your child&rsquo;s preferred email address so they can be added
          to the private member vault.
        </p>

        <ul className="space-y-3">
          {ACADEMY_COURSES.map(c => {
            const theme = getCourseTheme(c.courseId);
            return (
              <li
                key={c.courseId}
                className="flex flex-col sm:flex-row sm:items-center gap-4 bg-card border border-border rounded-xl p-5"
              >
                <div className="flex-1">
                  <p className="font-semibold">{c.name}</p>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {c.day} @ {c.time}
                  </p>
                </div>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`shrink-0 w-full sm:w-72 inline-flex items-center justify-center gap-2 px-5 py-3 ${theme.bg} ${theme.bgHover} text-white font-bold rounded-lg transition-colors whitespace-nowrap`}
                >
                  {c.cta}
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </a>
              </li>
            );
          })}
        </ul>

        <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-6 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Secure Stripe checkout</span>
          <span className="text-muted-dim">·</span>
          <span>Cancel anytime</span>
          <span className="text-muted-dim">·</span>
          <span>No long-term contracts</span>
        </p>
      </section>

      {/* ──────────────── Terms ──────────────── */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold tracking-tight mb-5">
          Transparent terms and guarantee
        </h2>
        <div className="space-y-6 max-w-3xl">
          <Compare icon={CalendarDays} title="Term-time focused">
            Live masterclasses run only during the Scottish academic term. The programme concludes
            directly before the Qualifications Scotland exam diet in May, so students peak exactly
            when they need to.
          </Compare>
          <Compare icon={ShieldCheck} title="We cancel for you">
            All monthly subscriptions are cancelled by us at the end of the academic year. You do
            not need to do it yourself, and you will never be charged over the summer.
          </Compare>
          <Compare icon={UserCheck} title="The teacher guarantee">
            Because I am an active, serving maths teacher, live sessions occasionally need to move
            for mandatory school commitments such as parents&rsquo; evenings. If a session must be
            rescheduled you will have 48 hours&rsquo; notice. If it cannot be moved within the same
            week, a full pre-recorded masterclass covering that week&rsquo;s syllabus goes into the
            vault instead, so no teaching time is lost.
          </Compare>
        </div>
      </section>

      <p className="mt-14 pt-6 border-t border-border text-sm text-muted-dim">
        Questions before you buy? Ask on the{' '}
        <a
          href="https://www.youtube.com/clellandmaths"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          Clelland Maths YouTube channel
        </a>
        . The rest of the site — past papers, video solutions and course notes — is{' '}
        <Link href="/" className="underline hover:text-foreground">free and always will be</Link>.
      </p>
    </div>
  );
}
