import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllN5Questions, getAllHigherQuestions, type QuestionWithMetadata } from '@/lib/data-loader';
import { n5PaperVideos, higherPaperVideos } from '@/lib/past-paper-videos';
import { getCourseTheme } from '@/lib/course-theme';
import CourseTabs from '@/components/CourseTabs';
import MathHtml from '@/components/MathHtml';
import WatchSolutionButton from '@/components/Papers/WatchSolutionButton';

// Every past paper is a statically generated page with all questions and
// answers server-rendered — the highest-value search landing pages on the
// site ("national 5 maths 2024 paper 1 solutions" etc).

const PAPER_COURSES = ['n5', 'higher'] as const;
type PaperCourse = (typeof PAPER_COURSES)[number];

const COURSE_NAMES: Record<PaperCourse, string> = {
  n5: 'National 5 Maths',
  higher: 'Higher Maths',
};

function paperKind(paperNumber: number): string {
  return paperNumber === 1 ? 'Non-Calculator' : 'Calculator';
}

async function loadCourseQuestions(courseId: PaperCourse): Promise<QuestionWithMetadata[]> {
  return courseId === 'n5' ? getAllN5Questions() : getAllHigherQuestions();
}

interface Params {
  courseId: string;
  year: string;
  paper: string; // "paper-1"
}

export async function generateStaticParams(): Promise<Params[]> {
  const params: Params[] = [];
  for (const courseId of PAPER_COURSES) {
    const questions = await loadCourseQuestions(courseId);
    const combos = new Set(questions.map(q => `${q.year}/${q.paperNumber}`));
    for (const combo of combos) {
      const [year, paperNumber] = combo.split('/');
      params.push({ courseId, year, paper: `paper-${paperNumber}` });
    }
  }
  return params;
}

function parsePaper(paper: string): number | null {
  const match = /^paper-(\d)$/.exec(paper);
  return match ? Number(match[1]) : null;
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { courseId, year, paper } = await params;
  const paperNumber = parsePaper(paper);
  const courseName = COURSE_NAMES[courseId as PaperCourse];
  if (!courseName || !paperNumber) return {};

  const questions = await loadCourseQuestions(courseId as PaperCourse);
  const count = questions.filter(q => q.year === Number(year) && q.paperNumber === paperNumber).length;

  return {
    title: `${courseName} ${year} Paper ${paperNumber} — Questions & Video Solutions`,
    description: `All ${count} questions from the ${year} ${courseName} Paper ${paperNumber} (${paperKind(paperNumber).toLowerCase()}) with answers and step-by-step video solutions. Free SQA past paper practice.`,
  };
}

export default async function PaperPage(
  { params }: { params: Promise<Params> }
) {
  const { courseId, year, paper } = await params;
  const paperNumber = parsePaper(paper);
  const courseName = COURSE_NAMES[courseId as PaperCourse];
  if (!courseName || !paperNumber) notFound();

  const theme = getCourseTheme(courseId);
  const questions = (await loadCourseQuestions(courseId as PaperCourse)).filter(
    q => q.year === Number(year) && q.paperNumber === paperNumber
  );
  if (questions.length === 0) notFound();

  const paperVideos = courseId === 'n5' ? n5PaperVideos : higherPaperVideos;
  const paperVideo = paperVideos.find(
    p => p.year === Number(year) && p.paperNumber === paperNumber
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <CourseTabs courseId={courseId} active="papers" />

      {/* Paper header */}
      <div className="mb-10">
        <p className={`font-mono text-xs uppercase tracking-widest ${theme.text} mb-2`}>
          {courseName} · Past paper
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          {year} Paper {paperNumber}
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-mono text-xs text-muted-foreground">
            {paperKind(paperNumber)} · {questions.length} questions
          </span>
          {paperVideo && (
            <WatchSolutionButton
              theme={theme}
              videoId={paperVideo.videoId}
              timestamp="0"
              title={`${courseName} ${year} Paper ${paperNumber}`}
            />
          )}
        </div>
      </div>

      {/* Questions — content and answers server-rendered, crawlable */}
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <article
            key={idx}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className={`flex items-center justify-center h-8 w-8 ${theme.tint} ${theme.text} text-sm font-bold rounded-lg shrink-0`}>
                  {idx + 1}
                </span>
                <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Question {idx + 1}
                </h2>
                {q.topics?.slice(0, 2).map(topic => (
                  <span key={topic} className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded">
                    {topic}
                  </span>
                ))}
              </div>
              <MathHtml
                html={q.question}
                className="question-content text-foreground/90 leading-relaxed"
              />
            </div>

            <details className="group border-t border-border">
              <summary className={`cursor-pointer list-none px-5 sm:px-6 py-3 text-sm font-medium ${theme.text} hover:bg-white/5 transition-colors flex items-center gap-2`}>
                <span className="group-open:hidden">Show answer</span>
                <span className="hidden group-open:inline">Hide answer</span>
              </summary>
              <div className="px-5 sm:px-6 pb-5">
                <MathHtml
                  html={q.answer}
                  className="answer-content text-foreground/85 leading-relaxed"
                />
              </div>
            </details>

            {q.videoId && (
              <div className="border-t border-border px-5 sm:px-6 py-3">
                <WatchSolutionButton
                  theme={theme}
                  videoId={q.videoId}
                  timestamp={q.timestamp}
                  title={`${courseName} ${year} Paper ${paperNumber} Q${idx + 1}`}
                />
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
