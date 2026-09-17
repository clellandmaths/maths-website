'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ArrowLeft, Play, Eye, EyeOff, BookOpen, Paperclip, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import DataBookletModal from '@/components/Explorer/DataBookletModal';
import MarkschemeModal from '@/components/Explorer/MarkschemeModal';
import { hasMarkscheme } from '@/lib/ah-markschemes';
import { QuestionWithMetadata, questionLabel } from '@/lib/data-loader';
import { isWholePaper, lastQuestionNumber } from '@/lib/question-number.mjs';
import MathRenderer from '@/components/MathRenderer';
import Hints from '@/components/Hints';
import NoHintNote from '@/components/NoHintNote';
import Marks from '@/components/Marks';
import FormulaeButton from '@/components/FormulaeButton';
import VideoModal from '@/components/VideoModal';
import type { CourseTheme } from '@/lib/course-theme';
import { timestampToSeconds } from '@/lib/timestamp.mjs';

/**
 * Lazily, exactly as `Hints` loads its worked example.
 *
 * This component renders on the paper templates, the course pages and the
 * Explorer, all of which sit inside 10 KB of JS budget headroom — and the
 * Explorer had one kilobyte of it left. The draw pulls the past paper index in
 * behind it and nobody presses it on most pages, so none of it is worth eager
 * bytes. `check:budget` is what says so, and it refused this change twice
 * before the boundary was in the right place.
 */
const TwinControls = dynamic(() => import('@/components/Explorer/TwinControls'), { ssr: false });

interface QuestionPresenterProps {
  /** Course this question set belongs to — enables the Formulae button. */
  courseId?: string;
  theme: CourseTheme;
  hasDataBooklet?: boolean;
  questions: QuestionWithMetadata[];
  startIndex?: number;
  onClose: () => void;
  /**
   * Where this was opened from, when that is somewhere worth returning to.
   *
   * A pupil sent straight here from a notes topic should be able to get back to
   * it without closing the mode and hunting for the link again. Optional, so
   * every other use — papers, worksheets, the marathon — is unchanged.
   */
  backTo?: { href: string; label: string };
  /**
   * A shared handout can withhold the answers or the video. Default true so
   * every existing use — papers, worksheets, marathons — is unaffected; a
   * locked worksheet passes false and full screen then shows exactly what the
   * person who set it decided to give.
   */
  allowAnswers?: boolean;
  /** A handout can grant hints without granting answers. They are not the same. */
  allowHints?: boolean;
  allowVideo?: boolean;
  /**
   * May a pupil draw another question like the one on screen?
   *
   * Default true: a past paper, a marathon and a practice topic all want it,
   * and where nothing is modelled on the question the control is absent anyway.
   *
   * **A shared worksheet passes `options.hints`.** `worksheet-share.ts` sets the
   * test for what belongs to the maker: does it change what the pupil is
   * *given*, or only how they read it? Full screen is always allowed because it
   * is the latter; another question is plainly the former. It rides on the
   * hints flag rather than a fifth one because a teacher who granted hints has
   * already granted a generated twin worked end to end — that is what the
   * bottom of the ladder is — so this hands over nothing new.
   *
   * **The Explorer's own worksheet passes false.** It has *Variation* on every
   * card, *Add a variation of each* and *Generate on N topics*, and a twin drawn
   * in full screen would be the only one of the four that does not end up on
   * the sheet.
   */
  allowAnother?: boolean;
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

export default function QuestionPresenter({ theme, hasDataBooklet = false, courseId, questions, startIndex = 0, onClose, backTo, allowAnswers = true, allowVideo = true, allowHints = true, allowAnother = true }: QuestionPresenterProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showBooklet, setShowBooklet] = useState(false);
  const [showMarkscheme, setShowMarkscheme] = useState(false);

  /**
   * A drawn question standing in for the one at `currentIndex`.
   *
   * **It swaps in rather than opening below**, because there is one card here
   * and no below. That makes getting back an act a pupil has to be offered
   * rather than one they scroll to, so it is a button — and *Next* and
   * *Previous* clear it too, which is how "or just move on" works.
   *
   * `drawn` is every twin this session has produced. It goes back into the
   * draw as `alsoExclude`, so a pupil who takes three does not get the first
   * one again.
   */
  const [twin, setTwin] = useState<QuestionWithMetadata | null>(null);
  const [drawn, setDrawn] = useState<QuestionWithMetadata[]>([]);

  // The question card and the answer below it share one scroller. On a long
  // question the answer opens below the fold, so "Show Answer" looked like it
  // did nothing; and moving to the next question kept the previous scroll
  // position, dropping you into the middle of it.
  const scrollerRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  const question = questions[currentIndex];
  /**
   * What is on the card: the twin when one is showing, otherwise the question.
   *
   * Everything the card is made of reads this — the html, the images, the
   * marks, the hints, the answer, the video. **The position counter does not**:
   * it says where you are in the *set*, and taking a detour does not move you
   * along it.
   */
  const shown = twin ?? question;
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

  // Moving along the set puts the twin away. A pupil who has taken a detour and
  // pressed Next means the next question in the paper, not the next twin.
  const goNext = useCallback(() => {
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
      setShowAnswer(false);
      setTwin(null);
    }
  }, [isLast]);

  const goPrev = useCallback(() => {
    if (!isFirst) {
      setCurrentIndex((i) => i - 1);
      setShowAnswer(false);
      setTwin(null);
    }
  }, [isFirst]);

  // Every move starts at the top of the new question — swapping a twin in is a
  // move, and a twin drawn while scrolled down the answer of the last one would
  // otherwise arrive halfway through itself.
  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIndex, twin]);

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
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-1 min-w-0">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
              <span className="hidden sm:inline text-sm">Close</span>
            </button>
            {/* The way back to wherever this was opened from — a notes topic,
                today. Its label is always visible: `sm:` is 640px, so a phone
                in portrait never reaches it, and a lone icon here would be
                indistinguishable from the close button beside it. */}
            {backTo && (
              <Link
                href={backTo.href}
                className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors min-w-0"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                <span className="text-sm truncate">{backTo.label}</span>
              </Link>
            )}
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-sm">
              Question <span className={`${theme.text} font-medium`}>{position.current}</span> of{' '}
              <span className="text-foreground-2">{position.total}</span>
            </p>
            {/* A twin says what it is and where it came from. Leaving the paper
                question's own label up there would credit this question to a
                paper it is not in. */}
            {/* **The way back belongs to the twin, not to the action row.**

                It was a second button in that row, and the row is centred:
                adding it slid the draw button 182px left and put "Back to the
                question" within 5px of where that button had been, so pressing
                *another* twice in the same place undid it. Every other control
                in the row moved with it.

                Here it costs the row nothing and it sits with the words that
                say why it exists — this line is where the twin announces it is
                not the paper question. */}
            <p className="text-muted-dim text-xs mt-0.5 flex items-center justify-end gap-2">
              <span>
                {twin
                  ? `New question${twin.basedOn?.[twin.parentIndex ?? 0]
                      ? ` · based on ${twin.basedOn[twin.parentIndex ?? 0]}` : ''}`
                  : questionLabel(question)}
              </span>
              {twin && (
                <button
                  onClick={() => { setTwin(null); setShowAnswer(false); }}
                  className={`inline-flex items-center gap-1 whitespace-nowrap rounded px-2 py-1 font-medium ${theme.text} hover:bg-foreground/10 transition-colors`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to the question
                </button>
              )}
            </p>
            <Marks marks={shown.marks} theme={theme} className="justify-end mt-1" />
          </div>
        </div>

        {/* Scrollable Content */}
        <div ref={scrollerRef} className="flex-1 overflow-y-auto">
          <div className="min-h-full flex flex-col max-w-4xl lg:max-w-none mx-auto p-4 sm:p-6 md:p-8 lg:px-12 xl:px-16">
            {/* Topic Tags */}
            <div className="shrink-0 flex flex-wrap gap-2 mb-4">
              {shown.topics?.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded"
                >
                  {topic}
                </span>
              ))}
            </div>

            {/* Question Card — fixed height container between header & footer */}
            {(() => {
              const imageSrcs = extractImageSrcs(shown.question);
              const hasImages = imageSrcs.length > 0;

              return (
                <div className={`flex-1 min-h-0 overflow-hidden bg-card border border-border rounded-xl p-6 md:p-8 ${hasImages ? 'lg:grid lg:grid-cols-[3fr_2fr] lg:gap-6' : 'lg:flex lg:flex-col lg:items-center lg:text-center'}`}>
                  {/* Text column — scrollable if question is long */}
                  <div className={hasImages ? 'lg:[&_img]:!hidden' : ''}>
                    <MathRenderer
                      html={shown.question}
                      // 20px from the smallest phone, not 18px.
                      //
                      // `sm:` is 640px, so no phone in portrait ever reached
                      // the 20px step — full screen was 18px on the exact
                      // device it matters most on, while the page behind it
                      // was 20px. The app sets 20px from the start and that is
                      // the size this was being measured against.
                      className="text-foreground question-content text-xl md:text-2xl leading-relaxed"
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
            {shown.attachments && shown.attachments.length > 0 && (
              <div className="shrink-0 flex flex-wrap justify-center gap-2 mt-4">
                {shown.attachments.map((file) => (
                  <a
                    key={file.url}
                    href={file.url}
                    download
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${theme.tint} ${theme.text} hover:bg-foreground/10 rounded-lg text-sm font-medium transition-colors`}
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
                  className="w-full sm:w-auto flex items-center justify-center gap-2 whitespace-nowrap px-6 py-3 rounded-lg font-medium bg-muted hover:bg-muted-hover text-foreground-2 transition-colors"
                >
                  <BookOpen className="h-5 w-5" />
                  Data Booklet
                </button>
              )}
              {courseId && (
                <FormulaeButton
                  courseId={courseId}
                  theme={theme}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 whitespace-nowrap px-6 py-3 rounded-lg font-medium bg-muted hover:bg-muted-hover text-foreground-2 transition-colors"
                />
              )}
              {/* Before the answer button, deliberately: a pupil who is stuck
                  should meet help before they meet the answer. */}
              {allowHints && (
                <Hints
                  question={shown}
                  theme={theme}
                  courseId={courseId}
                  className="w-full"
                  size="stage"
                  /* The same geometry as the four blocks around it. It used to
                     be 32px tall and 73px wide next to four 48px full-width
                     ones — the smallest control in the row, and the one a stuck
                     pupil is looking for. */
                  buttonClassName={`w-full sm:w-auto flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-6 py-3 font-medium transition-colors disabled:opacity-50 ${theme.tint} ${theme.text} hover:bg-foreground/10`}
                />
              )}
              {allowAnswers && (
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 whitespace-nowrap px-6 py-3 rounded-lg font-medium transition-colors ${
                  showAnswer
                    ? 'bg-muted-hover hover:bg-muted-hover text-foreground-2'
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
              {allowVideo && shown.videoId ? (
                <button
                  onClick={() => setShowVideo(true)}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 whitespace-nowrap px-6 py-3 bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white rounded-lg font-medium transition-all`}
                >
                  <Play className="h-5 w-5" />
                  {/* A generated question's video solves the paper question it
                      was modelled on, not itself. Calling that "Watch Solution"
                      sends a pupil to check an answer that is not theirs. */}
                  {shown.videoOf ? 'Watch a worked example' : 'Watch Solution'}
                </button>
              ) : allowVideo && hasMarkscheme(shown.year, shown.paperNumber) ? (
                <button
                  onClick={() => setShowMarkscheme(true)}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 whitespace-nowrap px-6 py-3 bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white rounded-lg font-medium transition-all`}
                >
                  <ClipboardCheck className="h-5 w-5" />
                  Markscheme
                </button>
              ) : (
                // Neither a video nor marking instructions: say so, rather
                // than leaving a gap that reads as a missing button
                <span className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-dashed border-muted text-muted-dim font-medium">
                  <Play className="h-5 w-5" />
                  Video solution coming soon
                </span>
              )}

              {/* Last in the row, and deliberately after the answer: this is a
                  what-next control rather than a help-me-now one, and a pupil
                  should meet the hints and the video before they are offered a
                  different question.

                  Modelled on the paper question, never on the twin — pressing
                  it three times stays anchored to what the pupil is stuck on
                  rather than wandering off down a chain. */}
              {allowAnother && (
                <TwinControls
                  courseId={courseId}
                  question={question}
                  alsoExclude={drawn}
                  onDrawn={(made) => {
                    setTwin(made);
                    setDrawn(d => [...d, made]);
                    setShowAnswer(false);
                  }}
                />
              )}
            </div>

            {/* Why there is no Hint button in that row.

                Full screen is the surface a stuck pupil reaches for, so an
                unexplained gap where the help usually sits is worse here than
                on the card. `shown` rather than `question`: a drawn twin is a
                generated question and carries its own ladder, so the note must
                follow what is actually on screen. */}
            <NoHintNote
              courseId={courseId}
              question={shown}
              solutionUrl={shown.solutionUrl}
              className="mt-3"
            />

            {/* Answer Section */}
            {allowAnswers && showAnswer && (
              <div ref={answerRef} className="shrink-0 mt-4 bg-card border border-border rounded-xl p-6 md:p-8">
                <h3 className={`text-sm font-medium ${theme.text} mb-3`}>Answer:</h3>
                <MathRenderer
                  html={shown.answer}
                  className="text-foreground answer-content text-xl leading-relaxed"
                />
                {shown.solutionUrl && (
                  // Guided practice questions from maths.scot: linking to his
                  // written solution is a condition of using them.
                  // See docs/guided-practice-attribution.md
                  <a
                    href={shown.solutionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-4 text-sm text-muted-foreground hover:text-foreground underline transition-colors"
                  >
                    Full written solution at Maths.scot
                  </a>
                )}
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
              onClick={isLast ? onClose : goNext}
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
      {/* A twin has no film of its own: `useGeneratedDraw` gives it the video of
          the paper question behind it, and `videoOf` is what that video
          actually shows. Titling it with the question on screen would promise a
          pupil their own numbers worked. */}
      <VideoModal
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
        videoId={shown.videoId}
        timestamp={timestampToSeconds(shown.timestamp)}
        title={shown.videoOf ? `Worked example — ${shown.videoOf}` : questionLabel(shown)}
      />

      {/* Data Booklet (Higher Apps) */}
      {showBooklet && (
        <DataBookletModal
          year={shown.year}
          theme={theme}
          onClose={() => setShowBooklet(false)}
        />
      )}

      {/* AH marking instructions */}
      {showMarkscheme && (
        <MarkschemeModal
          theme={theme}
          year={shown.year}
          paperNumber={shown.paperNumber}
          questionHtml={shown.question}
          title={questionLabel(shown)}
          onClose={() => setShowMarkscheme(false)}
        />
      )}
    </>
  );
}
