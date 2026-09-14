'use client';

import { useRef, useState } from 'react';
import {
  ChevronDown, ChevronUp, Plus, Check, Paperclip, BookOpen, Dices, Loader2, ArrowLeft,
} from 'lucide-react';
import { canAddVariation, variationLabel, withParentVideo } from '@/lib/similar-questions';
import { getMainTopic } from '@/lib/n5-topics';
import { useWorksheet } from '@/lib/worksheet-context';
import { QuestionWithMetadata } from '@/lib/data-loader';
import { questionNumber } from '@/lib/question-number.mjs';
import MathRenderer from '@/components/MathRenderer';
import DataBookletModal from '@/components/Explorer/DataBookletModal';
import FormulaeButton from '@/components/FormulaeButton';
import Marks from '@/components/Marks';
import type { CourseTheme } from '@/lib/course-theme';


export interface Question {
  question: string;
  answer: string;
  videoId: string;
  timestamp: string;
  topics: string[];
  subtopics?: string[];
  attachments?: { name: string; url: string; type: string }[];
  marks?: number[];
  solutionUrl?: string;
}

interface QuestionCardProps {
  theme: CourseTheme;
  /** Course this question belongs to — enables the Formulae button. */
  courseId?: string;
  /**
   * Past paper questions by label, so a generated variation can borrow the
   * video of the question it was modelled on. Omitted where there is no index
   * to hand; the variation simply arrives without a video.
   */
  paperIndex?: Map<string, QuestionWithMetadata>;
  // Higher Apps — show the year's data booklet alongside the question
  hasDataBooklet?: boolean;
  question: Question;
  year: number | string;
  paperNumber: number;
  questionIndex: number;
}


export default function QuestionCard({
  theme,
  courseId,
  paperIndex,
  hasDataBooklet = false,
  question,
  year,
  paperNumber,
  questionIndex,
}: QuestionCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showBooklet, setShowBooklet] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [added, setAdded] = useState(0);
  const [failed, setFailed] = useState(false);
  // Distinct from `failed`: the pool is spent, which is settled and worth
  // saying plainly, where a failure is a thing that might work next time.
  const [exhausted, setExhausted] = useState(false);
  /**
   * The generated question currently showing in place of the exam one, or null
   * for the exam question.
   *
   * **It is shown before it is added.** The button used to draw a question and
   * put it straight in the basket, so a teacher found out what they had added
   * on a different tab. Nothing about the draw changed — only when it becomes
   * yours.
   */
  const [variant, setVariant] = useState<QuestionWithMetadata | null>(null);
  /**
   * Everything this card has drawn, whether or not it was added.
   *
   * The engine dedupes inside one call and remembers nothing between calls, so
   * the exclude set has to be carried. The basket alone is not enough now that
   * a question can be looked at and rejected: press Another twice without this
   * and the second draw can hand back the first question.
   */
  const drawn = useRef<QuestionWithMetadata[]>([]);
  const { items: worksheetItems, addItem, removeItem, isInWorksheet } = useWorksheet();

  const fullQuestion: QuestionWithMetadata = {
    ...question,
    year,
    paperNumber,
    questionIndex,
    questionNumber: questionNumber(question.question) ?? String(questionIndex + 1),
  };

  const inWorksheet = isInWorksheet(fullQuestion);
  /** What the card is currently showing: the exam question, or a variation. */
  const shown = variant ?? fullQuestion;
  const parentLabel = variant?.basedOn?.[variant.parentIndex ?? 0];
  const variantAdded = variant ? isInWorksheet(variant) : false;

  /** Swap the face, and put the answer away — it belonged to the other one. */
  const showFace = (next: QuestionWithMetadata | null) => {
    setVariant(next);
    setShowAnswer(false);
  };
  // AH/Apps courses carry main topics directly; N5/Higher tag subtopic
  // strings, so the main topic is derived
  const mainTopics = question.subtopics
    ? [...new Set(question.topics)]
    : [...new Set(question.topics.map((t) => getMainTopic(t)).filter(Boolean))];

  /**
   * Draw `count` fresh questions modelled on this one.
   *
   * The engine is imported here, at the click, and nowhere else. It is 33,000
   * lines and this card is drawn for every question in the archive — a static
   * import would put the whole generator on the browse page.
   *
   * Everything on the sheet **and** everything this card has already shown is
   * off the table. Measured on a question whose pool is six: without an exclude
   * set, ten clicks gave four different questions and six byte-identical
   * repeats, and the basket's own guard does not catch them because it keys on
   * the uid, which carries the seed.
   */
  const draw = async (count: number): Promise<QuestionWithMetadata[]> => {
    const label = variationLabel(question.question);
    if (!label) return [];
    const { similarTo, worksheetKeys } = await import('@/lib/generated-question');
    const raw = await similarTo(
      label, count, worksheetKeys([...worksheetItems, ...drawn.current]),
    );
    // The paper behind it brings the video that teaches the method.
    const made = paperIndex ? raw.map((q) => withParentVideo(q, paperIndex)) : raw;
    drawn.current = [...drawn.current, ...made];
    return made;
  };

  /** Show one, without adding it. */
  const handleShowVariation = async () => {
    if (drawing) return;
    setDrawing(true);
    setFailed(false);
    setExhausted(false);
    try {
      const [made] = await draw(1);
      // Nothing back is possible — a thin variation, or one withdrawn — and it
      // has to say so rather than leave the card looking unresponsive.
      if (made) showFace(made);
      else setExhausted(true);
    } catch {
      setFailed(true);
    } finally {
      setDrawing(false);
    }
  };

  /** Put the one on screen onto the sheet. */
  const handleAddVariant = () => {
    if (!variant) return;
    addItem(variant);
    setAdded((n) => n + 1);
  };

  /**
   * Add several at once, the one showing included.
   *
   * **Sequentially, never `Promise.all`.** The generator's random stream is
   * module-level, so concurrent draws steal each other's numbers: a measured
   * ten-question `Promise.all` changed all ten, and two concurrent runs did not
   * match each other. `scripts/check-share-refs.mjs` fails if it ever appears.
   */
  const handleAddSeveral = async (want: number) => {
    if (drawing) return;
    setDrawing(true);
    setFailed(false);
    setExhausted(false);
    try {
      let count = 0;
      if (variant && !isInWorksheet(variant)) { addItem(variant); count++; }
      for (let i = count; i < want; i++) {
        const [made] = await draw(1);
        if (!made) break;
        addItem(made);
        count++;
      }
      setAdded((n) => n + count);
      // Short is not a failure, but it must not pass in silence either.
      if (count < want) setExhausted(true);
      // The sheet now holds them; the card goes back to the exam question so it
      // is clear that what is on screen is not waiting to be added.
      showFace(null);
    } catch {
      setFailed(true);
    } finally {
      setDrawing(false);
    }
  };

  const handleToggleWorksheet = () => {
    if (inWorksheet) {
      removeItem(fullQuestion);
    } else {
      addItem(fullQuestion);
    }
  };

  return (
    <>
      <div className={`bg-slate-900 border rounded-xl p-5 transition-colors ${
        inWorksheet
          ? `${theme.border} ring-1 ring-white/10`
          : 'border-slate-800 hover:border-white/20'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            {variant ? (
              <p className="flex flex-wrap items-center gap-1.5 text-sm font-semibold">
                <span className={`px-1.5 py-0.5 rounded text-[11px] ${theme.tint} ${theme.text}`}>
                  New question
                </span>
                {/* Which paper it was modelled on, not its own badge. A
                    generated question's label is the skill it tests, so reading
                    that here printed a bare "Generated" and left a teacher
                    unable to tell what it came from. */}
                {parentLabel && (
                  <span className="text-slate-400 font-normal">based on {parentLabel}</span>
                )}
              </p>
            ) : (
              <p className="text-slate-200 font-semibold text-sm">
                {year} Paper {paperNumber} Q{fullQuestion.questionNumber}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              {mainTopics.slice(0, 2).map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded"
                >
                  {topic}
                </span>
              ))}
              <Marks marks={shown.marks} theme={theme} />
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-1">
            {/* Adding means different things on the two faces, so the control
                is not shared: on the exam question it toggles, because that
                question is one thing that is either on the sheet or not. A
                variation is a fresh question every time, so it only ever adds. */}
            <button
              onClick={variant ? handleAddVariant : handleToggleWorksheet}
              disabled={variant ? variantAdded || drawing : false}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-60 ${
                (variant ? variantAdded : inWorksheet)
                  ? `${theme.tint} ${theme.text} hover:bg-white/10`
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
              }`}
            >
              {(variant ? variantAdded : inWorksheet) ? (
                <>
                  <Check className="h-3 w-3" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="h-3 w-3" />
                  Add
                </>
              )}
            </button>

            {variant ? (
              <button
                onClick={() => showFace(null)}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300 transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                Exam question
              </button>
            ) : (
              /* National 5 only. On the other four courses this is absent, not
                 disabled: a dead control on every card of four courses reads as
                 a broken site rather than as a roadmap. */
              canAddVariation(courseId, question.question) && (
                <button
                  onClick={handleShowVariation}
                  disabled={drawing}
                  title="Show a new question like this one"
                  aria-label="Show a new question like this one"
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                    added > 0
                      ? `${theme.tint} ${theme.text} hover:bg-white/10`
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                  }`}
                >
                  {drawing
                    ? <Loader2 className="h-3 w-3 animate-spin" />
                    : <Dices className="h-3 w-3" />}
                  {added > 0 ? `Variation ×${added}` : 'Variation'}
                </button>
              )
            )}
          </div>
        </div>

        {failed && (
          <p className="text-xs text-amber-300/90 mb-2">
            Could not make a new question like this one just now.
          </p>
        )}

        {/* Not amber, and not phrased as a failure. Running out is a fact about
            how many different questions this one can make, and a teacher who
            has taken all of them has been served, not refused. The button stays
            live: the count comes from the worksheet, so removing one from the
            sheet makes it available again. */}
        {exhausted && (
          <p className="text-xs text-slate-400 mb-2">
            {drawn.current.length > 0
              ? `That is all ${drawn.current.length} different question${drawn.current.length === 1 ? '' : 's'} this one can make.`
              : 'Every variation of this question is already on your worksheet.'}
          </p>
        )}

        {/* Question. The key remounts on a swap so the fade replays; the card
            shell, its border and its position in the grid do not move. */}
        <MathRenderer
          key={variant?.uid ?? 'exam'}
          html={shown.question}
          className="card-face text-slate-300 mb-4 question-content question-card text-sm leading-relaxed"
        />

        {/* Attachments — Higher Apps data files (CSV/XLSX/DOCX). Never on a
            variation: the data file belongs to the exam question. */}
        {!variant && question.attachments && question.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {question.attachments.map((file) => (
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

        {/* Answer Section */}
        <div className="pt-3 mt-3 flex items-start justify-between gap-3">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-300 text-sm font-medium mb-2"
          >
            {showAnswer ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide Answer
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show Answer
              </>
            )}
          </button>
          {hasDataBooklet && (
            <button
              onClick={() => setShowBooklet(true)}
              className={`shrink-0 flex items-center gap-1.5 text-sm font-medium ${theme.text} hover:opacity-80 transition-opacity`}
            >
              <BookOpen className="h-4 w-4" />
              Data Booklet
            </button>
          )}
          {/* Renders nothing for Higher Apps, which gets the booklet above */}
          {courseId && (
            <FormulaeButton
              courseId={courseId}
              theme={theme}
              className={`shrink-0 flex items-center gap-1.5 text-sm font-medium ${theme.text} hover:opacity-80 transition-opacity`}
            />
          )}
        </div>

        {showAnswer && (
          <MathRenderer
            html={shown.answer}
            className="bg-slate-800/50 rounded-lg p-3 text-slate-300 answer-content"
          />
        )}

        {/* What to do with the one on screen. Only on the variation face — the
            exam question has no "another", there is only the one. */}
        {variant && (
          <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-800">
            <button
              onClick={handleShowVariation}
              disabled={drawing}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              {drawing
                ? <Loader2 className="h-3 w-3 animate-spin" />
                : <Dices className="h-3 w-3" />}
              Another
            </button>
            <button
              onClick={() => handleAddSeveral(5)}
              disabled={drawing}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 ${theme.tint} ${theme.text} hover:bg-white/10`}
            >
              Add 5 like it
            </button>
            {/* The video is of the paper question, worked with different
                numbers. A pupil who is not told that concludes they are wrong. */}
            {variant.videoOf && (
              <span className="text-[11px] text-slate-500">
                worked example: {variant.videoOf}
              </span>
            )}
          </div>
        )}

      </div>

      {showBooklet && (
        <DataBookletModal year={year} theme={theme} onClose={() => setShowBooklet(false)} />
      )}
    </>
  );
}
