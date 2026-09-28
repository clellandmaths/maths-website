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

  const card = `group flex h-full flex-col rounded-xl border border-border bg-card p-5 text-left transition-colors hover:border-foreground/25 hover:bg-foreground/[0.03]`;
  const iconBox = `mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${theme.tint} ${theme.text}`;
  const stat = 'mt-auto pt-4 font-mono text-xs text-muted-foreground';
  const arrow = `h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground`;

  const Card = ({ href, icon: Icon, title, children, foot }: {
    href: string; icon: typeof BookOpen; title: string; children: React.ReactNode; foot?: React.ReactNode;
  }) => (
    <Link href={href} className={card}>
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

          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              {name} <span className={theme.text}>Maths</span>
            </h1>
            <p className="text-muted-foreground">
              Everything for {name}: notes, practice, past papers and the tools to revise with.
            </p>
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
              <div className={card}>
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
