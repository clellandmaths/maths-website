import Link from 'next/link';
import { ArrowRight, BookOpen, Compass, FileText, GraduationCap, PencilLine, Terminal } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import CourseBar from '@/components/CourseBar';
import { COURSE_NAMES, courseHref } from '@/lib/course-nav';
import FormulaeButton from '@/components/FormulaeButton';
import { DaysToGo, RememberCourse } from '@/components/CourseHubBits';
import { getCourseTheme } from '@/lib/course-theme';
import { getNotesForCourse } from '@/lib/notes-loader';
import { getPracticeTopics } from '@/lib/practice-loader';
import { hasFormulae } from '@/lib/formulae-loader';
import { courseExamDates } from '@/lib/exam-dates';
import {
  n5PaperVideos, higherPaperVideos, ahPaperVideos, higherAppsPaperVideos, n5AppsPaperVideos,
  paperStats, paperYearRange, type PaperVideo,
} from '@/lib/past-paper-videos';

/**
 * A course's front page: everything the course has, one card each.
 *
 * The owner's idea (2026-09-28): "a course card for each that has everything
 * on it". It used to be the past paper archive, 22 rows of five buttons on
 * N5, with the notes and practice as tabs and the Topic Explorer as one small
 * link. The home page's course covers listed "Guided practice", "Worksheet
 * builder" and "Whole course revision marathon" and linked none of them; this
 * is where they are links. The archive is its own tab now, at `…/papers`.
 *
 * A server component, so every count here is worked out at build time from
 * the course's own data and costs the browser nothing. Only the days to the
 * exam run in the browser (`DaysToGo`).
 */
const PAPERS: Record<string, PaperVideo[]> = {
  n5: n5PaperVideos,
  higher: higherPaperVideos,
  ah: ahPaperVideos,
  'n5-apps': n5AppsPaperVideos,
  'higher-apps': higherAppsPaperVideos,
};

export default async function CourseHub({ courseId }: { courseId: string }) {
  const name = COURSE_NAMES[courseId] ?? courseId;
  const theme = getCourseTheme(courseId);

  const notes = await getNotesForCourse(courseId);
  const noteTopics = notes?.sections.reduce((n, s) => n + s.topics.length, 0) ?? 0;

  const practice = await getPracticeTopics(courseId);
  const practiceQuestions = practice.reduce((n, t) => n + t.topic.questions.length, 0);

  const papers = PAPERS[courseId] ?? [];
  const { papers: paperCount, questions: paperQuestions } = paperStats(papers);
  const everyPaperFilmed = papers.length > 0 && papers.every(p => p.videoId);

  const exam = courseExamDates[courseId];
  const examLabel = exam?.date.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London',
  });

  /* **The course's own colour, on every card** (the owner, 2026-09-28: "a bit
     boring. Could do with some colour accents, better hover"). A band of the
     course gradient along the top, the icon on the gradient, and a hover that
     lifts the card and slides its arrow. Static classes only: a hover colour
     built from the theme's class names at run time is one Tailwind never
     generates. */
  const card = `group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card p-5 pt-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-lg`;
  const still = `relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card p-5 pt-6 text-left shadow-sm`;
  const band = `absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.gradient} transition-all duration-200 group-hover:h-1.5`;
  const iconBox = `mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${theme.gradient} text-white shadow-sm`;
  const stat = 'mt-auto pt-4 font-mono text-xs text-muted-foreground';
  const arrow = `h-4 w-4 shrink-0 ${theme.text} transition-transform duration-200 group-hover:translate-x-1`;

  const Card = ({ href, icon: Icon, title, children, foot }: {
    href: string; icon: typeof BookOpen; title: string; children: React.ReactNode; foot?: React.ReactNode;
  }) => (
    <Link href={href} className={card}>
      <span aria-hidden="true" className={band} />
      <span className={iconBox}><Icon className="h-5 w-5" /></span>
      <span className="flex items-center justify-between gap-3">
        <span className="text-lg font-semibold text-foreground">{title}</span>
        <ArrowRight className={arrow} />
      </span>
      <span className="mt-1 text-sm leading-relaxed text-muted-foreground">{children}</span>
      {foot && <span className={stat}>{foot}</span>}
    </Link>
  );

  return (
    <>
      <CourseBar courseId={courseId} active="overview" />
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <RememberCourse courseId={courseId} />
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: `${name} Maths` }]} />

          {/* The course's gradient behind the title, with what the course holds
              as chips. Solid white on it: the gradients are the -700 shades, and
              white at 90% fell below AA on two of them in the Exam Hall. */}
          <div className={`mb-8 rounded-2xl bg-gradient-to-r ${theme.gradient} p-6 text-white shadow-md sm:p-8`}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{name} Maths</h1>
            <p className="max-w-2xl">
              Everything for {name}: notes, practice, past papers and the tools to revise with.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-medium">
              {exam && examLabel && (
                <span className="rounded-full bg-black/25 px-3 py-1"><DaysToGo iso={exam.date.toISOString()} dateLabel={examLabel} /></span>
              )}
              <span className="rounded-full bg-black/25 px-3 py-1">{noteTopics} topics</span>
              <span className="rounded-full bg-black/25 px-3 py-1">{paperCount} past papers</span>
              <span className="rounded-full bg-black/25 px-3 py-1">{practiceQuestions} practice questions</span>
            </div>
          </div>

          <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">Learn and practise</h2>
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card href={courseHref(courseId, 'notes')} icon={BookOpen} title="Course Notes"
              foot={`${noteTopics} topics`}>
              Every topic explained, with a video lesson and worked examples.
            </Card>
            <Card href={courseHref(courseId, 'practice')} icon={PencilLine} title="Practice"
              foot={`${practiceQuestions} questions · ${practice.length} topics`}>
              Questions by topic, each with an answer and a video solution.
            </Card>
            <Card href={courseHref(courseId, 'papers')} icon={FileText} title="Past Papers"
              foot={`${paperCount} papers · ${paperYearRange(papers)}`}>
              {everyPaperFilmed
                ? 'Every paper worked through on video, question by question.'
                : 'Every paper, with video solutions or marking instructions.'}
            </Card>
          </div>

          <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">Revise and build</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card href={courseHref(courseId, 'explorer')} icon={Compass} title="Topic Explorer"
              foot={`${paperQuestions} past paper questions`}>
              Find past paper questions by topic and year, and build a worksheet to print or share.
            </Card>
            <Card href={courseHref(courseId, 'exam-hall')} icon={GraduationCap} title="Exam Hall"
              foot={exam && examLabel ? <DaysToGo iso={exam.date.toISOString()} dateLabel={examLabel} /> : undefined}>
              The countdown to your exam, a daily warm-up, the revision marathon and your topic checklist.
            </Card>
            {hasFormulae(courseId) ? (
              <div className={still}>
                <span aria-hidden="true" className={band} />
                <span className={iconBox}><span className="text-lg font-semibold">Σ</span></span>
                <span className="text-lg font-semibold text-foreground">Formulae</span>
                <span className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  The formulae list you are given in the exam.
                </span>
                <span className="mt-auto pt-4">
                  <FormulaeButton
                    courseId={courseId}
                    theme={theme}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium ${theme.tint} ${theme.text} hover:bg-foreground/10 transition-colors`}
                  />
                </span>
              </div>
            ) : courseId === 'higher-apps' ? (
              <Card href="/course/higher-apps/rstudio/" icon={Terminal} title="RStudio"
                foot="Runs in your browser">
                Run R for the data analysis questions, with nothing to install.
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
