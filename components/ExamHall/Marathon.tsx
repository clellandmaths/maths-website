'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Play, FileDown, Timer, Radio } from 'lucide-react';
import QuestionPresenter from '@/components/Explorer/QuestionPresenter';
import VideoModal from '@/components/VideoModal';
import { getSpecial, toPresenterQuestions, topicRuns, type Special, type SpecialTopic } from '@/lib/specials-loader';
import type { QuestionWithMetadata } from '@/lib/data-loader';
import { getCourseTheme } from '@/lib/course-theme';

interface Props {
  courseId: string;
  courseLabel: string;
  onBack: () => void;
}

/**
 * "National 5 Maths 2026 In 4 Hours" and its four siblings.
 *
 * The contents come first rather than dropping a pupil straight into 125
 * questions: the point of the marathon is that it covers every topic, so being
 * able to see the topics — and jump to the one you are weak on — is the
 * feature. Working through is the same presenter used for a past paper, so
 * answers, marks, the formulae sheet and the timestamped video all behave
 * exactly as they do everywhere else.
 */
export default function Marathon({ courseId, courseLabel, onBack }: Props) {
  const theme = getCourseTheme(courseId);
  const [special, setSpecial] = useState<Special | null>(null);
  const [questions, setQuestions] = useState<QuestionWithMetadata[]>([]);
  const [runs, setRuns] = useState<SpecialTopic[]>([]);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSpecial(courseId).then(s => {
      if (cancelled || !s) { setLoading(false); return; }
      setSpecial(s);
      setQuestions(toPresenterQuestions(s));
      setRuns(topicRuns(s));
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className={`h-8 w-8 border-2 ${theme.border} border-t-transparent rounded-full animate-spin`} />
      </div>
    );
  }

  if (!special) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400 mb-6">There is no revision marathon for {courseLabel} yet.</p>
        <button onClick={onBack} className={`${theme.text} font-medium`}>← Back to Exam Hall</button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Exam Hall
      </button>

      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">{special.name}</h2>
        <p className="text-slate-400">
          {special.questions.length} exam questions · {runs.length} topics · every topic in the course, in one session.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setStartIndex(0)}
          className={`inline-flex items-center gap-2 px-5 py-2.5 ${theme.bg} ${theme.bgHover} text-white font-bold rounded-lg transition-colors`}
        >
          <Timer className="h-4 w-4" />
          Start from the beginning
        </button>
        <button
          onClick={() => setShowVideo(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium rounded-lg transition-colors"
        >
          <Play className="h-4 w-4" />
          Watch the full session
        </button>
        {special.pdfLink && (
          <a
            href={special.pdfLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium rounded-lg transition-colors"
          >
            <FileDown className="h-4 w-4" />
            Download the booklet
          </a>
        )}
      </div>

      {special.liveStreamDate && (
        <div className="flex items-start gap-3 mb-8 p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <Radio className={`h-5 w-5 shrink-0 mt-0.5 ${theme.text}`} />
          <p className="text-sm text-slate-300">
            Originally streamed live on <span className="font-medium">{special.liveStreamDate}</span>.
            The full recording and every question below are free to use any time.
          </p>
        </div>
      )}

      <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
        Topics covered
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {runs.map(run => (
          <button
            key={`${run.topic}-${run.startIndex}`}
            onClick={() => setStartIndex(run.startIndex)}
            className="flex items-center justify-between gap-3 text-left px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-white/25 transition-colors group"
          >
            <span className="text-sm text-slate-200 group-hover:text-white transition-colors">
              {run.topic}
            </span>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {run.count}
            </span>
          </button>
        ))}
      </div>

      {startIndex !== null && (
        <QuestionPresenter
          theme={theme}
          courseId={courseId}
          hasDataBooklet={courseId === 'higher-apps'}
          questions={questions}
          startIndex={startIndex}
          onClose={() => setStartIndex(null)}
        />
      )}

      {showVideo && (
        <VideoModal
          isOpen={true}
          onClose={() => setShowVideo(false)}
          videoId={special.mainVideoId}
          timestamp={0}
          title={special.name}
        />
      )}
    </div>
  );
}
