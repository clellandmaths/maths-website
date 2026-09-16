'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Eye, EyeOff, Flame, ArrowLeft, BookOpen } from 'lucide-react';
import { QuestionWithMetadata, getAllN5Questions, getAllHigherQuestions, getAllAHQuestions, getAllHigherAppsQuestions, getAllN5AppsQuestions } from '@/lib/data-loader';
import MathRenderer from '@/components/MathRenderer';
import Marks from '@/components/Marks';
import FormulaeButton from '@/components/FormulaeButton';
import DataBookletModal from '@/components/Explorer/DataBookletModal';
import VideoModal from '@/components/VideoModal';
import { getCourseTheme } from '@/lib/course-theme';
import { courseHasHints } from '@/lib/similar-questions';
import { timestampToSeconds } from '@/lib/timestamp.mjs';

const DAILY_COUNT = 5;

// --- Seeded PRNG helpers ---

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  const rng = mulberry32(seed);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getUKDateString(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date());
}

function extractImageSrcs(html: string): string[] {
  const srcs: string[] = [];
  const regex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    srcs.push(match[1]);
  }
  return srcs;
}

const loaders = {
  n5: getAllN5Questions,
  higher: getAllHigherQuestions,
  ah: getAllAHQuestions,
  'n5-apps': getAllN5AppsQuestions,
  'higher-apps': getAllHigherAppsQuestions,
};

type Course = 'n5' | 'higher' | 'ah' | 'n5-apps' | 'higher-apps';

interface WarmUpProps {
  course: Course;
  onBack: () => void;
}

export default function WarmUp({ course, onBack }: WarmUpProps) {
  const theme = getCourseTheme(course);
  const [questions, setQuestions] = useState<QuestionWithMetadata[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showBooklet, setShowBooklet] = useState(false);
  const [finished, setFinished] = useState(false);
  /**
   * Another five, offered only once today's five are done.
   *
   * **Not on the questions themselves**, which is the obvious place and the
   * wrong one. The warm up is five questions, seeded by the date, the same for
   * everybody and finishable — a pupil who can reroll question 3 is no longer
   * doing a fixed set, and the thing that makes it a warm up is gone. The
   * completion screen is the only place the offer costs nothing, and the pupil
   * who reaches it is by definition the one who wants more.
   */
  const [more, setMore] = useState<'idle' | 'drawing' | 'failed' | 'none'>('idle');

  const dateString = getUKDateString();

  // Load and shuffle questions on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    loaders[course]().then((allQuestions) => {
      if (cancelled) return;
      const seed = hashString(`warmup-${course}-${dateString}`);
      const shuffled = seededShuffle(allQuestions, seed);
      setQuestions(shuffled.slice(0, DAILY_COUNT));
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [course, dateString]);

  const question = questions?.[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = questions ? currentIndex === questions.length - 1 : false;

  const goNext = useCallback(() => {
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
      setShowAnswer(false);
    }
  }, [isLast]);

  const goPrev = useCallback(() => {
    if (!isFirst) {
      setCurrentIndex((i) => i - 1);
      setShowAnswer(false);
    }
  }, [isFirst]);

  const handleFinish = useCallback(() => {
    setFinished(true);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (loading || finished) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showVideo) return;
      if (e.key === 'Escape') onBack();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [loading, finished, onBack, goNext, goPrev, showVideo]);

  // Lock body scroll during slideshow
  useEffect(() => {
    if (!loading && !finished) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [loading, finished]);

  // --- Loading state ---
  if (loading) {
    return (
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
        <div className="flex flex-col items-center justify-center py-20">
          <div className={`h-10 w-10 border-4 ${theme.border} border-t-transparent rounded-full animate-spin mb-4`} />
          <p className="text-muted-foreground">Loading today&apos;s questions...</p>
        </div>
      </div>
    );
  }

  /**
   * Five new questions, one modelled on each of the five just done.
   *
   * Sequential, never `Promise.all` — the generator's random stream is
   * module-level and concurrent draws steal each other's numbers. The engine
   * and the paper index are both imported here, at the click: the Exam Hall
   * loads on its own for every course and must not carry either.
   *
   * The result becomes a locked worksheet link rather than anything held in
   * this component. That gives a genuinely new session with its own presenter,
   * and it survives being sent to a friend.
   */
  const drawMore = async () => {
    if (!questions || more === 'drawing') return;
    setMore('drawing');
    try {
      const [{ similarTo, worksheetKeys }, { byPaperLabel, variationLabel, withParentVideo },
             { shareLinks }] = await Promise.all([
        import('@/lib/generated-question'),
        import('@/lib/similar-questions'),
        import('@/lib/worksheet-share'),
      ]);
      const byLabel = byPaperLabel(await loaders[course]());

      const made: QuestionWithMetadata[] = [];
      for (const q of questions) {
        const label = variationLabel(q.question);
        if (!label) continue;
        const [raw] = await similarTo(label, 1, worksheetKeys(made));
        if (raw) made.push(withParentVideo(raw, byLabel));
      }

      if (!made.length) { setMore('none'); return; }
      const { locked } = shareLinks(
        window.location.origin, course, made, `More like the warm up · ${dateString}`,
      );
      window.location.href = locked;
    } catch {
      setMore('failed');
    }
  };

  // --- Completion screen ---
  if (finished) {
    return (
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-4 bg-orange-600/20 rounded-full mb-6">
            <Flame className="h-12 w-12 text-orange-500" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Session Complete</h2>
          <p className="text-muted-foreground text-lg mb-2">
            You completed today&apos;s {DAILY_COUNT} questions
          </p>
          <p className="text-muted-dim text-sm mb-8">{dateString}</p>

          {/* National 5 only — the other four courses have no audited
              variations, so there is nothing to offer and nothing is shown. */}
          {courseHasHints(course) && (
            <div className="mb-6 flex flex-col items-center gap-2">
              <button
                onClick={drawMore}
                disabled={more === 'drawing'}
                className={`px-8 py-3 bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white font-semibold rounded-lg transition-all disabled:opacity-60`}
              >
                {more === 'drawing' ? 'Building them…' : `${DAILY_COUNT} new questions like today's`}
              </button>
              <p className="text-muted-dim text-xs max-w-sm">
                One modelled on each of the five you just did — same methods,
                different numbers. Tomorrow&apos;s warm up is still waiting.
              </p>
              {more === 'none' && (
                <p className="text-muted-foreground text-sm">
                  No new questions could be made from today&apos;s five.
                </p>
              )}
              {more === 'failed' && (
                <p className="text-amber-300/90 text-sm">
                  Could not build them just now. Try again in a moment.
                </p>
              )}
            </div>
          )}

          <button
            onClick={onBack}
            className={
              courseHasHints(course)
                ? 'px-8 py-3 border border-muted text-foreground-2 font-semibold rounded-lg hover:bg-muted transition-colors'
                : `px-8 py-3 bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white font-semibold rounded-lg transition-all`
            }
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- Slideshow ---
  if (!question) return null;

  const imageSrcs = extractImageSrcs(question.question);
  const hasImages = imageSrcs.length > 0;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
            <span className="hidden sm:inline text-sm">Close</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-dim hidden sm:inline">{dateString}</span>
            <div className="px-2 py-1 bg-orange-600/20 text-orange-400 text-xs font-medium rounded">
              Daily Warm Up
            </div>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-sm">
              Question <span className={`${theme.text} font-medium`}>{currentIndex + 1}</span> of{' '}
              <span className="text-foreground-2">{questions!.length}</span>
            </p>
            <p className="text-muted-dim text-xs mt-0.5">
              {question.year} Paper {question.paperNumber} Q{question.questionNumber}
            </p>
            <Marks marks={question.marks} theme={theme} className="justify-end mt-1" />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full flex flex-col max-w-4xl lg:max-w-none mx-auto p-4 sm:p-6 md:p-8 lg:px-12 xl:px-16">
            {/* Topic Tags */}
            <div className="shrink-0 flex flex-wrap gap-2 mb-4">
              {question.topics?.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded"
                >
                  {topic}
                </span>
              ))}
            </div>

            {/* Question Card */}
            <div className={`flex-1 min-h-0 overflow-hidden bg-card border border-border rounded-xl p-6 md:p-8 ${hasImages ? 'lg:grid lg:grid-cols-[3fr_2fr] lg:gap-6' : 'lg:flex lg:flex-col lg:items-center lg:text-center'}`}>
              <div className={hasImages ? 'lg:[&_img]:!hidden' : ''}>
                <MathRenderer
                  html={question.question}
                  className="text-foreground question-content text-xl md:text-2xl leading-relaxed"
                />
              </div>
              {hasImages && (
                <div className="hidden lg:flex lg:flex-col lg:gap-4 min-h-0">
                  {imageSrcs.map((src, i) => (
                    <div key={i} className="flex-1 min-h-0 w-full relative">
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="shrink-0 flex flex-col sm:flex-row justify-center items-center gap-3 mt-4">
              {/* Reference material, as in the exam: the booklet for Higher
                  Apps, the formulae list for everyone else. */}
              {course === 'higher-apps' ? (
                <button
                  onClick={() => setShowBooklet(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-muted hover:bg-muted-hover text-foreground-2 transition-colors"
                >
                  <BookOpen className="h-5 w-5" />
                  Data Booklet
                </button>
              ) : (
                <FormulaeButton
                  courseId={course}
                  theme={theme}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-muted hover:bg-muted-hover text-foreground-2 transition-colors"
                />
              )}
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  showAnswer
                    ? 'bg-muted-hover hover:bg-muted-hover text-foreground-2'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                }`}
              >
                {showAnswer ? (
                  <>
                    <EyeOff className="h-5 w-5" />
                    Hide Answer
                  </>
                ) : (
                  <>
                    <Eye className="h-5 w-5" />
                    Show Answer
                  </>
                )}
              </button>
              {question.videoId && (
                <button
                  onClick={() => setShowVideo(true)}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white rounded-lg font-medium transition-all`}
                >
                  <Play className="h-5 w-5" />
                  {question.videoOf ? 'Watch a worked example' : 'Watch Solution'}
                </button>
              )}
            </div>

            {/* Answer Section */}
            {showAnswer && (
              <div className="shrink-0 mt-4 bg-card border border-border rounded-xl p-6 md:p-8">
                <h3 className={`text-sm font-medium ${theme.text} mb-3`}>Answer:</h3>
                <MathRenderer
                  html={question.answer}
                  className="text-foreground answer-content text-xl leading-relaxed"
                />
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="border-t border-border p-4">
          <div className="max-w-4xl lg:max-w-none mx-auto lg:px-12 xl:px-16 flex justify-between gap-4">
            <button
              onClick={goPrev}
              disabled={isFirst}
              className="flex items-center gap-2 px-6 py-3 bg-muted hover:bg-muted-hover text-foreground font-medium rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
              Previous
            </button>
            <button
              onClick={isLast ? handleFinish : goNext}
              className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors ${
                isLast
                  ? 'bg-teal-600 hover:bg-teal-500 text-white'
                  : 'bg-muted hover:bg-muted-hover text-foreground'
              }`}
            >
              {isLast ? 'Finish' : 'Next'}
              {!isLast && <ChevronRight className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
        videoId={question.videoId}
        timestamp={timestampToSeconds(question.timestamp)}
        title={`${question.year} Paper ${question.paperNumber} Q${question.questionNumber}`}
      />

      {/* Data Booklet (Higher Apps) — the booklet is year-specific, so it
          follows whichever paper today's question came from */}
      {showBooklet && (
        <DataBookletModal
          year={question.year}
          theme={theme}
          onClose={() => setShowBooklet(false)}
        />
      )}
    </>
  );
}
