'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Eye, EyeOff } from 'lucide-react';
import { QuestionWithMetadata } from '@/lib/data-loader';
import MathRenderer from '@/components/MathRenderer';
import VideoModal from '@/components/VideoModal';

interface QuestionPresenterProps {
  questions: QuestionWithMetadata[];
  startIndex?: number;
  onClose: () => void;
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

function getTimestampSeconds(ts: string): number {
  if (ts.endsWith('s')) {
    return parseInt(ts.replace('s', ''), 10);
  }
  if (ts.includes(':')) {
    const [mins, secs] = ts.split(':').map(Number);
    return mins * 60 + secs;
  }
  return parseInt(ts, 10);
}

export default function QuestionPresenter({ questions, startIndex = 0, onClose }: QuestionPresenterProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const question = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;

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
              Question <span className="text-emerald-400 font-medium">{currentIndex + 1}</span> of{' '}
              <span className="text-slate-300">{questions.length}</span>
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
              <button
                onClick={() => setShowVideo(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
              >
                <Play className="h-5 w-5" />
                Watch Solution
              </button>
            </div>

            {/* Answer Section */}
            {showAnswer && (
              <div className="shrink-0 mt-4 bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8">
                <h3 className="text-sm font-medium text-emerald-400 mb-3">Answer:</h3>
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
        timestamp={getTimestampSeconds(question.timestamp)}
        title={`${question.year} Paper ${question.paperNumber} Q${question.questionIndex + 1}`}
      />
    </>
  );
}
