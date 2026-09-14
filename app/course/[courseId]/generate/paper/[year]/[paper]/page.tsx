import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllN5Questions } from '@/lib/data-loader';
import { paperRef } from '@/lib/question-number.mjs';
import { getCourseTheme } from '@/lib/course-theme';
import Breadcrumbs from '@/components/Breadcrumbs';
import PracticePaperClient from './PracticePaperClient';

/**
 * A whole practice paper: one new question modelled on each question of a real
 * one, in the same order.
 *
 * **Why this is its own route and not a button on the paper page.** The paper
 * pages are pure server components — 110 of them, sharing one measured 826 KB
 * baseline. Putting a generate button on them makes every one a client surface
 * and opens a chunk-graph relationship between the archive and the engine, so
 * that 826 KB becomes a number to defend at every release. The paper page
 * instead gets a plain link and no new JavaScript at all.
 *
 * Under `/generate/` deliberately: that subtree is already the one place with
 * an engine relationship, and its `generateStaticParams` already returns
 * National 5 only.
 *
 * **These 22 pages are deliberately not in `app/sitemap.ts`**, and the reason
 * corrects an earlier note here that called them an SEO asset. The questions
 * are drawn in the browser after mount, so a crawler is served an empty shell —
 * 22 pages of no content, which is a liability rather than an asset. They are
 * reached from the paper they clone, which is where someone looking for them
 * already is.
 *
 * **The work here happens at build time.** The questions are read, and what
 * reaches the browser is a plan — a label, a number and a mark total per
 * question, a few KB of strings. The engine is loaded in the browser only when
 * this page actually draws, through a dynamic import in the client.
 */

const GENERATOR_COURSES = ['n5'] as const;
const COURSE_NAMES: Record<string, string> = { n5: 'National 5 Maths' };

/** The shape the paper label takes, and the only shape a variation can match. */
const N5_PAPER_LABEL = /^\d{4} P[12] Q\d+$/;

interface Params { courseId: string; year: string; paper: string }

export async function generateStaticParams(): Promise<Params[]> {
  const questions = await getAllN5Questions();
  const combos = new Set(questions.map(q => `${q.year}/${q.paperNumber}`));
  return [...combos].map(c => {
    const [year, paperNumber] = c.split('/');
    return { courseId: 'n5', year, paper: `paper-${paperNumber}` };
  });
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { courseId, year, paper } = await params;
  if (!(GENERATOR_COURSES as readonly string[]).includes(courseId)) return {};
  const paperNumber = Number(paper.replace('paper-', ''));
  const courseName = COURSE_NAMES[courseId] ?? courseId;

  return {
    title: `${courseName} ${year} Paper ${paperNumber} — a practice paper with new numbers`,
    description:
      `A new practice paper modelled question by question on the ${courseName} ${year} ` +
      `Paper ${paperNumber}. Every question is checked against the real paper's marking ` +
      'instructions, so it is new work rather than a reprint. Print it or share one link.',
    alternates: { canonical: `/course/${courseId}/generate/paper/${year}/${paper}/` },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { courseId, year, paper } = await params;
  if (!(GENERATOR_COURSES as readonly string[]).includes(courseId)) notFound();

  const paperNumber = Number(paper.replace('paper-', ''));
  if (!Number.isFinite(paperNumber)) notFound();

  const questions = (await getAllN5Questions()).filter(
    q => String(q.year) === year && q.paperNumber === paperNumber
  );
  if (questions.length === 0) notFound();

  /**
   * What the browser gets: one row per question, no question HTML.
   *
   * The label is read from the printed badge, never rebuilt from
   * year/paper/number — `lib/similar-questions.ts` records that a rebuilt label
   * is plausible and wrong on at least one surface.
   */
  const plan = questions.map((q, i) => {
    const label = paperRef(q.question);
    return {
      label: label && N5_PAPER_LABEL.test(label) ? label : null,
      number: q.questionNumber ?? String(i + 1),
      marks: (q.marks ?? []).reduce((a, b) => a + b, 0),
    };
  });

  const theme = getCourseTheme(courseId);
  const courseName = COURSE_NAMES[courseId] ?? courseId;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <Breadcrumbs items={[
        { label: courseName, href: `/course/${courseId}` },
        { label: `${year} Paper ${paperNumber}`, href: `/course/${courseId}/papers/${year}/${paper}` },
        { label: 'Practice paper' },
      ]} />

      <PracticePaperClient
        courseId={courseId}
        courseName={courseName}
        year={year}
        paperNumber={paperNumber}
        plan={plan}
        theme={theme}
      />
    </div>
  );
}
