'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Eye, EyeOff, Flame, ArrowLeft } from 'lucide-react';
import { QuestionWithMetadata, getAllN5Questions, getAllHigherQuestions, getAllAHQuestions, getAllHigherAppsQuestions, getAllN5AppsQuestions } from '@/lib/data-loader';
import MathRenderer from '@/components/MathRenderer';
import VideoModal from '@/components/VideoModal';
import { getCourseTheme } from '@/lib/course-theme';

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

function getTimestampSeconds(ts: string): number {
  if (ts.endsWith('s')) return parseInt(ts.replace('s', ''), 10);
  if (ts.includes(':')) {
    const [mins, secs] = ts.split(':').map(Number);
    return mins * 60 + secs;
  }
  return parseInt(ts, 10);
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
  const [finished, setFinished] = useState(false);

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
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
        <div className="flex flex-col items-center justify-center py-20">
          <div className={`h-10 w-10 border-4 ${theme.border} border-t-transparent rounded-full animate-spin mb-4`} />
          <p className="text-slate-400">Loading today&apos;s questions...</p>
        </div>
      </div>
    );
  }

  // --- Completion screen ---
  if (finished) {
    return (
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-4 bg-orange-600/20 rounded-full mb-6">
            <Flame className="h-12 w-12 text-orange-500" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Session Complete</h2>
          <p className="text-slate-400 text-lg mb-2">
            You completed today&apos;s {DAILY_COUNT} questions
          </p>
          <p className="text-slate-500 text-sm mb-8">{dateString}</p>
          <button
            onClick={onBack}
            className={`px-8 py-3 bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white font-semibold rounded-lg transition-all`}
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
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
            <span className="hidden sm:inline text-sm">Close</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">{dateString}</span>
            <div className="px-2 py-1 bg-orange-600/20 text-orange-400 text-xs font-medium rounded">
              Daily Warm Up
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">
              Question <span className={`${theme.text} font-medium`}>{currentIndex + 1}</span> of{' '}
              <span className="text-slate-300">{questions!.length}</span>
            </p>
            <p className="text-slate-500 text-xs mt-0.5">
              {question.year} Paper {question.paperNumber} Q{question.questionIndex + 1}
            </p>
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
                  className="px-2 py-1 bg-slate-800 text-slate-400 text-xs font-medium rounded"
                >
                  {topic}
                </span>
              ))}
            </div>

            {/* Question Card */}
            <div className={`flex-1 min-h-0 overflow-hidden bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 ${hasImages ? 'lg:grid lg:grid-cols-[3fr_2fr] lg:gap-6' : 'lg:flex lg:flex-col lg:items-center lg:text-center'}`}>
              <div className={hasImages ? 'lg:[&_img]:!hidden' : ''}>
                <MathRenderer
                  html={question.question}
                  className="text-slate-200 question-content text-lg sm:text-xl md:text-2xl leading-relaxed"
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
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  showAnswer
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
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
                  Watch Solution
                </button>
              )}
            </div>

            {/* Answer Section */}
            {showAnswer && (
              <div className="shrink-0 mt-4 bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8">
                <h3 className={`text-sm font-medium ${theme.text} mb-3`}>Answer:</h3>
                <MathRenderer
                  html={question.answer}
                  className="text-slate-200 answer-content text-lg leading-relaxed"
                />
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="border-t border-slate-800 p-4">
          <div className="max-w-4xl lg:max-w-none mx-auto lg:px-12 xl:px-16 flex justify-between gap-4">
            <button
              onClick={goPrev}
              disabled={isFirst}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
              Previous
            </button>
            <button
              onClick={isLast ? handleFinish : goNext}
              className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors ${
                isLast
                  ? 'bg-teal-600 hover:bg-teal-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
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
        timestamp={getTimestampSeconds(question.timestamp)}
        title={`${question.year} Paper ${question.paperNumber} Q${question.questionIndex + 1}`}
      />
    </>
  );
}
