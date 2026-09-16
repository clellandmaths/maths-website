'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Play, FileText, ChevronDown, ChevronUp, BookOpen, List, Compass, GraduationCap, Dices } from 'lucide-react';
import CourseTabs from '@/components/CourseTabs';
import Breadcrumbs from '@/components/Breadcrumbs';
import VideoModal from '@/components/VideoModal';
import QuestionPresenter from '@/components/Explorer/QuestionPresenter';
import FocusMode from '@/components/Explorer/FocusMode';
import { n5PaperVideos, higherPaperVideos, ahPaperVideos, higherAppsPaperVideos, n5AppsPaperVideos, type PaperVideo } from '@/lib/past-paper-videos';
import { getCourseTheme } from '@/lib/course-theme';
import { getAllN5Questions, getAllHigherQuestions, getAllAHQuestions, getAllHigherAppsQuestions, getAllN5AppsQuestions, type QuestionWithMetadata } from '@/lib/data-loader';
import { timestampToSeconds } from '@/lib/timestamp.mjs';

interface CoursePageProps {
  courseId: string;
  // Direct link into the first notes topic (the all-topics hub is at
  // /course/[courseId]/notes)
  notesHref: string;
}

const courseConfig: Record<string, {
  name: string;
  paperVideos: PaperVideo[];
  loadQuestions: () => Promise<QuestionWithMetadata[]>;
}> = {
  n5: { name: 'National 5', paperVideos: n5PaperVideos, loadQuestions: getAllN5Questions },
  higher: { name: 'Higher', paperVideos: higherPaperVideos, loadQuestions: getAllHigherQuestions },
  ah: { name: 'Advanced Higher', paperVideos: ahPaperVideos, loadQuestions: getAllAHQuestions },
  'n5-apps': { name: 'N5 Applications', paperVideos: n5AppsPaperVideos, loadQuestions: getAllN5AppsQuestions },
  'higher-apps': { name: 'Higher Applications', paperVideos: higherAppsPaperVideos, loadQuestions: getAllHigherAppsQuestions },
};

const courseNames: Record<string, string> = {
  n5: 'National 5',
  higher: 'Higher',
  ah: 'Advanced Higher',
  'n5-apps': 'N5 Applications',
  'higher-apps': 'Higher Applications',
};

export default function CoursePage({ courseId, notesHref }: CoursePageProps) {
  // Lazy question loading
  const [allQuestions, setAllQuestions] = useState<QuestionWithMetadata[] | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // UI state
  const [expandedPaper, setExpandedPaper] = useState<string | null>(null);
  const [presenterQuestions, setPresenterQuestions] = useState<QuestionWithMetadata[] | null>(null);
  const [presenterStartIndex, setPresenterStartIndex] = useState(0);
  const [focusQuestions, setFocusQuestions] = useState<QuestionWithMetadata[] | null>(null);
  const [activeVideo, setActiveVideo] = useState<{ videoId: string; timestamp: number; title: string } | null>(null);

  // Explorer and the Exam Hall both open on `preferredCourse`. Until now only
  // choosing a course inside one of those set it, so arriving from a course
  // page still met the chooser — having already said which course you wanted.
  useEffect(() => {
    try { localStorage.setItem('preferredCourse', courseId); } catch { /* private mode */ }
  }, [courseId]);

  const courseName = courseNames[courseId] || 'Course';
  const config = courseConfig[courseId];
  const theme = getCourseTheme(courseId);

  // Group papers by year, preserving registry order (newest first,
  // string years like "Specimen" at the end)
  const papersByYear = useMemo(() => {
    if (!config) return [];
    const yearMap = new Map<number | string, PaperVideo[]>();
    for (const paper of config.paperVideos) {
      const existing = yearMap.get(paper.year) || [];
      existing.push(paper);
      yearMap.set(paper.year, existing);
    }
    return Array.from(yearMap.entries())
      .map(([year, papers]) => ({
        year,
        papers: papers.sort((a, b) => a.paperNumber - b.paperNumber),
      }));
  }, [config]);

  // Load questions lazily (cached after first load)
  const ensureQuestionsLoaded = useCallback(async (): Promise<QuestionWithMetadata[]> => {
    if (allQuestions) return allQuestions;
    if (!config) return [];
    setLoadingQuestions(true);
    const questions = await config.loadQuestions();
    setAllQuestions(questions);
    setLoadingQuestions(false);
    return questions;
  }, [allQuestions, config]);

  // Get questions for a specific paper
  const getQuestionsForPaper = useCallback((questions: QuestionWithMetadata[], year: number | string, paperNumber: number) => {
    return questions.filter(q => q.year === year && q.paperNumber === paperNumber);
  }, []);

  // Action handlers
  const handleStartPaper = useCallback(async (year: number | string, paperNumber: number, startIndex = 0) => {
    const questions = await ensureQuestionsLoaded();
    const paperQuestions = getQuestionsForPaper(questions, year, paperNumber);
    if (paperQuestions.length > 0) {
      setPresenterQuestions(paperQuestions);
      setPresenterStartIndex(startIndex);
    }
  }, [ensureQuestionsLoaded, getQuestionsForPaper]);

  const handleFocusMode = useCallback(async (year: number | string, paperNumber: number) => {
    const questions = await ensureQuestionsLoaded();
    const paperQuestions = getQuestionsForPaper(questions, year, paperNumber);
    if (paperQuestions.length > 0) {
      setFocusQuestions(paperQuestions);
    }
  }, [ensureQuestionsLoaded, getQuestionsForPaper]);

  const handleExpandPaper = useCallback(async (year: number | string, paperNumber: number) => {
    const key = `${year}-${paperNumber}`;
    if (expandedPaper === key) {
      setExpandedPaper(null);
      return;
    }
    await ensureQuestionsLoaded();
    setExpandedPaper(key);
  }, [expandedPaper, ensureQuestionsLoaded]);

  // Full-screen modes take priority over page content
  if (presenterQuestions) {
    return (
      <QuestionPresenter
        theme={theme}
        courseId={courseId}
        hasDataBooklet={courseId === 'higher-apps'}
        questions={presenterQuestions}
        startIndex={presenterStartIndex}
        onClose={() => setPresenterQuestions(null)}
      />
    );
  }

  if (focusQuestions) {
    return (
      <FocusMode
        theme={theme}
        courseId={courseId}
        hasDataBooklet={courseId === 'higher-apps'}
        questions={focusQuestions}
        onClose={() => setFocusQuestions(null)}
      />
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: `${courseName} Maths` }]} />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {courseName} <span className={theme.text}>Maths</span>
          </h1>
          <p className="text-muted-foreground">
            Video lessons, practice questions, and past paper archive
          </p>
        </div>

        {/* Tabs — shared course-context navigation */}
        <CourseTabs courseId={courseId} active="papers" notesHref={notesHref} />

        {/* **A way into the Explorer that is not at the bottom of the page.**
            The cross-link card below says the same thing, but it sits beneath
            the whole paper archive — twenty-odd cards of scrolling — so nobody
            arriving here finds it. This is deliberately NOT a fourth CourseTabs
            tab: measured, that row has 32px of slack at 320px and the word
            "Explorer" cannot wrap, so a fourth tab re-creates the horizontal
            scroll the comment in CourseTabs.tsx was written about.

            The course rides in the query string rather than relying on
            `localStorage.preferredCourse`, so the link means the same thing on
            a device that has never been here. */}
        {config && (
          <Link
            href={`/explorer?c=${courseId}`}
            className="mb-8 inline-flex items-center gap-2 rounded-lg border border-muted px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 hover:text-white"
          >
            <Compass className="h-4 w-4 shrink-0" />
            Open the Topic Explorer
          </Link>
        )}

        {/* Content */}
        {config ? (
          <div className="space-y-6">
            {/* Loading overlay */}
            {loadingQuestions && (
              <div className="flex items-center justify-center py-8">
                <div className={`h-8 w-8 border-4 ${theme.border} border-t-transparent rounded-full animate-spin mr-3`} />
                <p className="text-muted-foreground">Loading questions...</p>
              </div>
            )}

            {papersByYear.map(({ year, papers }, yearRow) => (
              <div key={year}>
                <h3 className="text-xl font-bold mb-4">{year}</h3>
                <div className="space-y-4">
                  {papers.map((paper, paperRow) => {
                    /* The one thumbnail above the fold — first paper of the
                       first year, not the first of every year. Both indexes are
                       needed: this list is grouped, so `paperRow === 0` alone
                       made 11 of 22 images eager, which is the opposite of the
                       point. Checked in the built HTML, not assumed. */
                    const firstOnPage = yearRow === 0 && paperRow === 0;
                    const paperKey = `${paper.year}-${paper.paperNumber}`;
                    const isExpanded = expandedPaper === paperKey;
                    const paperQuestions = allQuestions
                      ? getQuestionsForPaper(allQuestions, paper.year, paper.paperNumber)
                      : [];

                    return (
                      <div
                        key={paperKey}
                        className="bg-card border border-border rounded-xl overflow-hidden"
                      >
                        {/* Paper card */}
                        <div className="flex flex-col sm:flex-row">
                          {/* Thumbnail */}
                          <div className="sm:w-64 shrink-0">
                            <div className="relative aspect-video sm:h-full bg-muted">
                              {paper.videoId ? (
                                /* The first row only is fetched eagerly and at
                                   high priority. It is the one thumbnail that
                                   is above the fold, and on a course page it
                                   can be the largest thing on screen — so
                                   `lazy` was deferring the request for the very
                                   image the page is measured by. Cloudflare
                                   recorded one at 10,952 ms. Every row below it
                                   stays lazy, which is what `lazy` is for. */
                                <img
                                  src={`https://img.youtube.com/vi/${paper.videoId}/mqdefault.jpg`}
                                  alt={`${courseName} ${paper.year} Paper ${paper.paperNumber}`}
                                  className="w-full h-full object-cover"
                                  loading={firstOnPage ? 'eager' : 'lazy'}
                                  fetchPriority={firstOnPage ? 'high' : 'auto'}
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                                  <FileText className={`h-8 w-8 ${theme.text}`} />
                                  <span className="font-mono text-xs text-muted-dim">Markscheme available</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Info + actions */}
                          <div className="flex-1 p-4 sm:p-5 flex flex-col">
                            <div className="mb-3">
                              <h4 className="text-lg font-semibold text-foreground">
                                <Link
                                  href={`/course/${courseId}/papers/${paper.year}/paper-${paper.paperNumber}`}
                                  className="hover:text-white transition-colors"
                                >
                                  {year} Paper {paper.paperNumber}
                                </Link>
                              </h4>
                              <p className="text-sm text-muted-dim">
                                {paper.questionCount} Questions
                              </p>
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-2 mt-auto">
                              {paper.videoId && (
                                <button
                                  onClick={() => setActiveVideo({
                                    videoId: paper.videoId,
                                    timestamp: 0,
                                    title: `${courseName} ${paper.year} Paper ${paper.paperNumber}`,
                                  })}
                                  className={`flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white text-sm font-medium rounded-lg transition-all`}
                                >
                                  <Play className="h-4 w-4" />
                                  Watch Video
                                </button>
                              )}
                              <button
                                onClick={() => handleStartPaper(paper.year, paper.paperNumber)}
                                className={`flex items-center gap-1.5 px-3 py-2 bg-card border ${theme.border} ${theme.text} hover:bg-foreground/5 text-sm font-medium rounded-lg transition-colors`}
                              >
                                <BookOpen className="h-4 w-4" />
                                Start Paper
                              </button>
                              <button
                                onClick={() => handleFocusMode(paper.year, paper.paperNumber)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-muted-hover hover:bg-muted-hover text-foreground text-sm font-medium rounded-lg transition-colors"
                              >
                                <List className="h-4 w-4" />
                                Focus Mode
                              </button>
                              {/* **On the archive, not only on the paper page.**
                                  It went on `/papers/[year]/[paper]` first and
                                  nobody found it — that page is reached only by
                                  clicking the small paper title above it, which
                                  `docs/navigation.md` already records as barely
                                  linked. A feature behind a link nobody presses
                                  is a feature nobody has.

                                  A link, not a button, so the row gains no
                                  handler; the destination does the work.
                                  National 5 only — the one course with audited
                                  variations. */}
                              {courseId === 'n5' && (
                                <Link
                                  href={`/course/${courseId}/generate/paper/${paper.year}/paper-${paper.paperNumber}`}
                                  title={`Build a new practice paper modelled question by question on the ${paper.year} Paper ${paper.paperNumber} — same topics, same marks, numbers you have not seen`}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted-hover text-foreground text-sm font-medium rounded-lg transition-colors"
                                >
                                  <Dices className="h-4 w-4" />
                                  {/* **"Practice Paper" did not say what it
                                      does.** Beside Start Paper and Focus
                                      Mode, which both open *this* paper, it
                                      read as a third way to sit the same one.
                                      It builds a new paper modelled on it, so
                                      the label says new, and the title says
                                      the rest. */}
                                  New Paper Like This
                                </Link>
                              )}
                              <button
                                onClick={() => handleExpandPaper(paper.year, paper.paperNumber)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted-hover text-foreground text-sm font-medium rounded-lg transition-colors ml-auto"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="h-4 w-4" />
                                    <span className="hidden sm:inline">Hide Questions</span>
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-4 w-4" />
                                    <span className="hidden sm:inline">Browse Questions</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded question list */}
                        {isExpanded && paperQuestions.length > 0 && (
                          <div className="border-t border-border">
                            {paperQuestions.map((q, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0"
                              >
                                {/* Question number */}
                                <button
                                  onClick={() => handleStartPaper(paper.year, paper.paperNumber, idx)}
                                  className={`shrink-0 h-8 w-8 flex items-center justify-center ${theme.tint} ${theme.text} text-sm font-bold rounded-lg hover:bg-foreground/10 transition-colors`}
                                >
                                  {q.questionNumber}
                                </button>

                                {/* Topic chips */}
                                <div className="flex-1 flex flex-wrap gap-1.5 min-w-0">
                                  {q.topics?.slice(0, 2).map((topic) => (
                                    <span
                                      key={topic}
                                      className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded truncate max-w-[200px]"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                  {(!q.topics || q.topics.length === 0) && (
                                    <span className="text-muted-dim text-xs">No topics tagged</span>
                                  )}
                                </div>

                                {/* Watch solution */}
                                {q.videoId && (
                                  <button
                                    onClick={() => setActiveVideo({
                                      videoId: q.videoId,
                                      timestamp: timestampToSeconds(q.timestamp),
                                      title: `${courseName} ${q.year} P${q.paperNumber} Q${q.questionNumber}`,
                                    })}
                                    className={`shrink-0 flex items-center gap-1 px-2 py-1 ${theme.text} hover:opacity-80 text-xs font-medium transition-opacity`}
                                  >
                                    <Play className="h-3 w-3" />
                                    Solution
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Loading state for expanded */}
                        {isExpanded && paperQuestions.length === 0 && loadingQuestions && (
                          <div className="border-t border-border p-4 text-center">
                            <div className={`h-6 w-6 border-3 ${theme.border} border-t-transparent rounded-full animate-spin mx-auto`} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-faint mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Past Paper Archive</h3>
              <p className="text-muted-foreground">
                Past paper walkthroughs coming soon.
              </p>
            </div>
          </div>
        )}

        {/* Cross-links — Explorer and Exam Hall support N5 and Higher */}
        {config && (
          <div className="grid sm:grid-cols-2 gap-4 mt-12">
            <Link
              href={`/explorer?c=${courseId}`}
              className="group flex items-center gap-4 bg-card border border-border hover:border-foreground/25 rounded-xl p-5 transition-colors"
            >
              <div className={`p-3 ${theme.tint} rounded-lg shrink-0`}>
                <Compass className={`h-6 w-6 ${theme.text}`} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground">Topic Explorer</h3>
                <p className="text-sm text-muted-foreground">
                  Filter these questions by topic and build a custom worksheet in the Explorer.
                </p>
              </div>
            </Link>
            <Link
              href="/exam-hall"
              className="group flex items-center gap-4 bg-card border border-border hover:border-foreground/25 rounded-xl p-5 transition-colors"
            >
              <div className={`p-3 ${theme.tint} rounded-lg shrink-0`}>
                <GraduationCap className={`h-6 w-6 ${theme.text}`} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground">Exam Hall</h3>
                <p className="text-sm text-muted-foreground">
                  Exam countdown, topic checklists and daily warm-up questions.
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal
          isOpen={true}
          onClose={() => setActiveVideo(null)}
          videoId={activeVideo.videoId}
          timestamp={activeVideo.timestamp}
          title={activeVideo.title}
        />
      )}
    </div>
  );
}
