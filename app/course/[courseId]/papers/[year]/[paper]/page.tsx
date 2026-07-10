import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getAllN5Questions,
  getAllHigherQuestions,
  getAllAHQuestions,
  getAllHigherAppsQuestions,
  getAllN5AppsQuestions,
  type QuestionWithMetadata,
} from '@/lib/data-loader';
import {
  n5PaperVideos,
  higherPaperVideos,
  ahPaperVideos,
  higherAppsPaperVideos,
  n5AppsPaperVideos,
  type PaperVideo,
} from '@/lib/past-paper-videos';
import { getCourseTheme } from '@/lib/course-theme';
import { hasMarkscheme, getMarkschemeEntries } from '@/lib/ah-markschemes';
import CourseTabs from '@/components/CourseTabs';
import Breadcrumbs from '@/components/Breadcrumbs';
import MathHtml from '@/components/MathHtml';
import WatchSolutionButton from '@/components/Papers/WatchSolutionButton';
import BookletButton from '@/components/Papers/BookletButton';
import { Paperclip } from 'lucide-react';

// Every past paper is a statically generated page with all questions,
// answers — and for AH's no-video years, the full marking instructions —
// server-rendered and crawlable.

const COURSE_NAMES: Record<string, string> = {
  n5: 'National 5 Maths',
  higher: 'Higher Maths',
  ah: 'Advanced Higher Maths',
  'n5-apps': 'N5 Applications of Maths',
  'higher-apps': 'Higher Applications of Maths',
};

const loaders: Record<string, () => Promise<QuestionWithMetadata[]>> = {
  n5: getAllN5Questions,
  higher: getAllHigherQuestions,
  ah: getAllAHQuestions,
  'n5-apps': getAllN5AppsQuestions,
  'higher-apps': getAllHigherAppsQuestions,
};

const paperVideoRegistry: Record<string, PaperVideo[]> = {
  n5: n5PaperVideos,
  higher: higherPaperVideos,
  ah: ahPaperVideos,
  'n5-apps': n5AppsPaperVideos,
  'higher-apps': higherAppsPaperVideos,
};

function paperKind(courseId: string, year: string, paperNumber: number): string {
  if (courseId === 'higher-apps') return 'Calculator & software allowed';
  if (courseId === 'ah' && Number(year) < 2020) return 'Calculator allowed';
  return paperNumber === 1 ? 'Non-Calculator' : 'Calculator';
}

interface Params {
  courseId: string;
  year: string;
  paper: string; // "paper-1"
}

export async function generateStaticParams(): Promise<Params[]> {
  const params: Params[] = [];
  for (const courseId of Object.keys(loaders)) {
    const questions = await loaders[courseId]();
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
  const courseName = COURSE_NAMES[courseId];
  if (!courseName || !paperNumber) return {};

  const questions = await loaders[courseId]();
  const paperQuestions = questions.filter(
    q => String(q.year) === year && q.paperNumber === paperNumber
  );
  const withVideo = paperQuestions.some(q => q.videoId);
  const solutions = withVideo ? 'step-by-step video solutions' : 'full SQA marking instructions';

  return {
    title: `${courseName} ${year} Paper ${paperNumber} — Questions & ${withVideo ? 'Video Solutions' : 'Marking Instructions'}`,
    description: `All ${paperQuestions.length} questions from the ${year} ${courseName} Paper ${paperNumber} (${paperKind(courseId, year, paperNumber).toLowerCase()}) with answers and ${solutions}. Free SQA past paper practice.`,
  };
}

export default async function PaperPage(
  { params }: { params: Promise<Params> }
) {
  const { courseId, year, paper } = await params;
  const paperNumber = parsePaper(paper);
  const courseName = COURSE_NAMES[courseId];
  if (!courseName || !paperNumber) notFound();

  const theme = getCourseTheme(courseId);
  const questions = (await loaders[courseId]()).filter(
    q => String(q.year) === year && q.paperNumber === paperNumber
  );
  if (questions.length === 0) notFound();

  const paperVideo = paperVideoRegistry[courseId]?.find(
    p => String(p.year) === year && p.paperNumber === paperNumber
  );
  const isHigherApps = courseId === 'higher-apps';

  // AH no-video years: resolve markscheme entries at build time so the
  // marking instructions are in the HTML
  const markschemes = await Promise.all(
    questions.map(q =>
      !q.videoId && hasMarkscheme(q.year, q.paperNumber)
        ? getMarkschemeEntries(q.year, q.paperNumber, q.question)
        : Promise.resolve([])
    )
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: courseName, href: `/course/${courseId}` },
        { label: `${year} Paper ${paperNumber}` },
      ]} />
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
            {paperKind(courseId, year, paperNumber)} · {questions.length} questions
          </span>
          {paperVideo?.videoId && (
            <WatchSolutionButton
              theme={theme}
              videoId={paperVideo.videoId}
              timestamp="0"
              title={`${courseName} ${year} Paper ${paperNumber}`}
            />
          )}
          {isHigherApps && <BookletButton year={year} theme={theme} />}
        </div>
      </div>

      {/* Questions — content, answers and markschemes server-rendered */}
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
              {/* Higher Apps data files */}
              {q.attachments && q.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {q.attachments.map(file => (
                    <a
                      key={file.url}
                      href={file.url}
                      download
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${theme.tint} ${theme.text} hover:bg-white/10 rounded-lg text-xs font-medium transition-colors`}
                    >
                      <Paperclip className="h-3 w-3" />
                      {file.name}
                    </a>
                  ))}
                </div>
              )}
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

            {/* AH no-video years: full marking instructions, crawlable */}
            {markschemes[idx].length > 0 && (
              <details className="group border-t border-border">
                <summary className={`cursor-pointer list-none px-5 sm:px-6 py-3 text-sm font-medium ${theme.text} hover:bg-white/5 transition-colors flex items-center gap-2`}>
                  <span className="group-open:hidden">Show marking instructions</span>
                  <span className="hidden group-open:inline">Hide marking instructions</span>
                </summary>
                <div className="px-5 sm:px-6 pb-5 space-y-5">
                  {markschemes[idx].map(entry => (
                    <section key={entry.questionNumber}>
                      <h3 className={`font-mono text-xs font-semibold uppercase tracking-widest ${theme.text} mb-2`}>
                        Question {entry.questionNumber}
                      </h3>
                      <MathHtml
                        html={entry.answer}
                        className="answer-content text-foreground/85 text-sm leading-relaxed"
                      />
                    </section>
                  ))}
                </div>
              </details>
            )}

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
