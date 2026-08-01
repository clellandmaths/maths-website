'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Eye, EyeOff, BookOpen, Paperclip, ClipboardCheck } from 'lucide-react';
import DataBookletModal from '@/components/Explorer/DataBookletModal';
import MarkschemeModal from '@/components/Explorer/MarkschemeModal';
import { hasMarkscheme } from '@/lib/ah-markschemes';
import { QuestionWithMetadata, questionLabel } from '@/lib/data-loader';
import { isWholePaper, lastQuestionNumber } from '@/lib/question-number.mjs';
import MathRenderer from '@/components/MathRenderer';
import Marks from '@/components/Marks';
import FormulaeButton from '@/components/FormulaeButton';
import VideoModal from '@/components/VideoModal';
import type { CourseTheme } from '@/lib/course-theme';
import { timestampToSeconds } from '@/lib/timestamp.mjs';

interface QuestionPresenterProps {
  /** Course this question set belongs to — enables the Formulae button. */
  courseId?: string;
  theme: CourseTheme;
  hasDataBooklet?: boolean;
  questions: QuestionWithMetadata[];
  startIndex?: number;
  onClose: () => void;
  /**
   * A shared handout can withhold the answers or the video. Default true so
   * every existing use — papers, worksheets, marathons — is unaffected; a
   * locked worksheet passes false and full screen then shows exactly what the
   * person who set it decided to give.
   */
  allowAnswers?: boolean;
  allowVideo?: boolean;
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

export default function QuestionPresenter({ theme, hasDataBooklet = false, courseId, questions, startIndex = 0, onClose, allowAnswers = true, allowVideo = true }: QuestionPresenterProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showBooklet, setShowBooklet] = useState(false);
  const [showMarkscheme, setShowMarkscheme] = useState(false);

  // The question card and the answer below it share one scroller. On a long
  // question the answer opens below the fold, so "Show Answer" looked like it
  // did nothing; and moving to the next question kept the previous scroll
  // position, dropping you into the middle of it.
  const scrollerRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  const question = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;

  // Count in the exam's own numbering when this IS the exam. N5 Applications
  // and Advanced Higher papers are split into one entry per part, so 2026 P2
  // is 17 entries but 7 questions — "9 of 17" names a question the pupil's
  // booklet does not contain. A worksheet assembled in the Explorer is a set of
  // N and counts as one. Mirrors the live app.
  const wholePaper = isWholePaper(questions);
  const position = wholePaper
    ? { current: question.questionNumber, total: lastQuestionNumber(questions, questions.length) }
    : { current: String(currentIndex + 1), total: String(questions.length) };

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

  // Every move starts at the top of the new question
  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIndex]);

  // Bring the answer into view when it is revealed, but only if it is not
  // already on screen — scrolling when nothing needed to move is disorienting.
  useEffect(() => {
    if (!showAnswer) return;
    const el = answerRef.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    if (box.bottom > window.innerHeight || box.top < 0) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [showAnswer]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showVideo) return; // Don't navigate while video is open
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goNext, goPrev, showVideo]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
            <span className="hidden sm:inline text-sm">Close</span>
          </button>
          <div className="text-right">
            <p className="text-slate-400 text-sm">
              Question <span className={`${theme.text} font-medium`}>{position.current}</span> of{' '}
              <span className="text-slate-300">{position.total}</span>
            </p>
            <p className="text-muted-dim text-xs mt-0.5">
              {questionLabel(question)}
            </p>
            <Marks marks={question.marks} theme={theme} className="justify-end mt-1" />
          </div>
        </div>

        {/* Scrollable Content */}
        <div ref={scrollerRef} className="flex-1 overflow-y-auto">
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

            {/* Question Card — fixed height container between header & footer */}
            {(() => {
              const imageSrcs = extractImageSrcs(question.question);
              const hasImages = imageSrcs.length > 0;

              return (
                <div className={`flex-1 min-h-0 overflow-hidden bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 ${hasImages ? 'lg:grid lg:grid-cols-[3fr_2fr] lg:gap-6' : 'lg:flex lg:flex-col lg:items-center lg:text-center'}`}>
                  {/* Text column — scrollable if question is long */}
                  <div className={hasImages ? 'lg:[&_img]:!hidden' : ''}>
                    <MathRenderer
                      html={question.question}
                      className="text-slate-200 question-content text-lg sm:text-xl md:text-2xl leading-relaxed"
                    />
                  </div>
                  {/* Desktop only: images absolutely positioned so they never affect layout sizing */}
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
              );
            })()}

            {/* Higher Apps data files */}
            {question.attachments && question.attachments.length > 0 && (
              <div className="shrink-0 flex flex-wrap justify-center gap-2 mt-4">
                {question.attachments.map((file) => (
                  <a
                    key={file.url}
                    href={file.url}
                    download
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${theme.tint} ${theme.text} hover:bg-white/10 rounded-lg text-sm font-medium transition-colors`}
                  >
                    <Paperclip className="h-4 w-4" />
                    {file.name}
                  </a>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="shrink-0 flex flex-col sm:flex-row justify-center items-center gap-3 mt-4">
              {hasDataBooklet && (
                <button
                  onClick={() => setShowBooklet(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <BookOpen className="h-5 w-5" />
                  Data Booklet
                </button>
              )}
              {courseId && (
                <FormulaeButton
                  courseId={courseId}
                  theme={theme}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                />
              )}
              {allowAnswers && (
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  showAnswer
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    : `${theme.bg} ${theme.bgHover} text-white`
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
              )}
              {allowVideo && question.videoId ? (
                <button
                  onClick={() => setShowVideo(true)}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white rounded-lg font-medium transition-all`}
                >
                  <Play className="h-5 w-5" />
                  Watch Solution
                </button>
              ) : allowVideo && hasMarkscheme(question.year, question.paperNumber) ? (
                <button
                  onClick={() => setShowMarkscheme(true)}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white rounded-lg font-medium transition-all`}
                >
                  <ClipboardCheck className="h-5 w-5" />
                  Markscheme
                </button>
              ) : (
                // Neither a video nor marking instructions: say so, rather
                // than leaving a gap that reads as a missing button
                <span className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-dashed border-slate-700 text-muted-dim font-medium">
                  <Play className="h-5 w-5" />
                  Video solution coming soon
                </span>
              )}
            </div>

            {/* Answer Section */}
            {allowAnswers && showAnswer && (
              <div ref={answerRef} className="shrink-0 mt-4 bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8">
                <h3 className={`text-sm font-medium ${theme.text} mb-3`}>Answer:</h3>
                <MathRenderer
                  html={question.answer}
                  className="text-slate-200 answer-content text-lg leading-relaxed"
                />
                {question.solutionUrl && (
                  // Guided practice questions from maths.scot: linking to his
                  // written solution is a condition of using them.
                  // See docs/guided-practice-attribution.md
                  <a
                    href={question.solutionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-4 text-sm text-slate-400 hover:text-slate-200 underline transition-colors"
                  >
                    Full written solution at Maths.scot
                  </a>
                )}
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
              onClick={isLast ? onClose : goNext}
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
        timestamp={timestampToSeconds(question.timestamp)}
        title={questionLabel(question)}
      />

      {/* Data Booklet (Higher Apps) */}
      {showBooklet && (
        <DataBookletModal
          year={question.year}
          theme={theme}
          onClose={() => setShowBooklet(false)}
        />
      )}

      {/* AH marking instructions */}
      {showMarkscheme && (
        <MarkschemeModal
          theme={theme}
          year={question.year}
          paperNumber={question.paperNumber}
          questionHtml={question.question}
          title={questionLabel(question)}
          onClose={() => setShowMarkscheme(false)}
        />
      )}
    </>
  );
}
