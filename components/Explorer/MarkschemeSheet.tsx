'use client';

import { createPortal } from 'react-dom';
import MathRenderer from '@/components/MathRenderer';
import { variationLabel } from '@/lib/similar-questions';
import type { QuestionWithMetadata } from '@/lib/data-loader';
import type { PaperScheme } from '@/lib/generator/generators/paper-markscheme';

/**
 * The markscheme for one worksheet, as its own printed document.
 *
 * **A teacher's document, and only ever that.** It carries the illustrative
 * answers and the marker's notes, so it is never on a shared pupil sheet and
 * is not behind a flag a URL could set — the pupil-facing components simply do
 * not import the table it reads, and `__checks__/paper-markscheme.ts` fails if
 * one of them ever learns to.
 *
 * **Portaled to `document.body`.** The paper and the markscheme are two
 * documents from one page, and the alternative was a CSS rule naming every
 * part of the worksheet to hide. Sitting at the top level makes it one rule —
 * `body[data-print="markscheme"] > *:not(.markscheme-doc)` — that cannot be
 * broken by rearranging the sheet.
 *
 * Two sources on one sheet, numbered in the worksheet's own order rather than
 * the paper's, because that is the order the teacher is marking in:
 *
 *   a past paper question   the published marking instructions, mark by mark,
 *                           with the notes that say what else to accept
 *   a generated question    its own worked steps and their mark values, which
 *                           regenerate from the seed in the sheet — so the
 *                           markscheme is for the numbers actually printed
 */
interface Props {
  courseId: string;
  courseLabel: string;
  questions: QuestionWithMetadata[];
  schemes: Record<string, PaperScheme>;
  totalMarks: number;
}

export default function MarkschemeSheet({
  courseId, courseLabel, questions, schemes, totalMarks,
}: Props) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="markscheme-doc" data-course={courseId}>
      <div className="markscheme-head">
        <h1>
          Clelland Maths <span>{courseLabel} — Marking Instructions</span>
        </h1>
        <div className="markscheme-meta">
          <div>{new Date().toLocaleDateString('en-GB',
            { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <div>
            {questions.length} question{questions.length === 1 ? '' : 's'}
            {totalMarks > 0 && <> &middot; {totalMarks} marks</>}
          </div>
        </div>
      </div>

      {/* Reproduction is permitted non-commercially with the source named, so
          the printed document names it. This is not decoration. */}
      <p className="markscheme-source">
        Contains information reproduced from Qualifications Scotland marking
        instructions on a non-commercial basis, with Qualifications Scotland
        acknowledged as the source. Generated questions carry their own worked
        solution, not a published scheme.
      </p>

      {questions.map((q, i) => {
        const generated = Boolean(q.uid?.startsWith('g:'));
        const label = variationLabel(q.question);
        const parent = q.basedOn?.[q.parentIndex ?? 0];
        const scheme = !generated && label ? schemes[label] : undefined;
        const steps = generated ? (q.steps ?? []) : [];
        const marks = (q.marks ?? []).reduce((a, b) => a + b, 0);

        return (
          <section key={q.uid ?? i} className="markscheme-question">
            <h2>
              <span className="markscheme-number">{i + 1}.</span>
              {/* Which is which, plainly. A teacher marking thirty scripts
                  needs to know whether they are holding the published scheme
                  or our own working before they take it as final. */}
              <span className="markscheme-origin">
                {generated
                  // A generated question's badge is its own, so the paper it
                  // was modelled on comes from `basedOn` — the same pair the
                  // uid carries, so the teacher's markscheme names the paper
                  // their pupils' video points at.
                  ? `Generated${parent ? ` — based on ${parent}` : ''}`
                  : label ?? `${q.year} Paper ${q.paperNumber}`}
              </span>
              {marks > 0 && <span className="markscheme-marks">{marks} marks</span>}
            </h2>

            {scheme?.subject && (
              <p className="markscheme-subject">
                <MathRenderer html={scheme.subject} className="inline" />
              </p>
            )}

            {scheme ? (
              <table className="markscheme-table">
                <thead>
                  <tr><th>Mark</th><th>Awarded for</th><th>Illustrative answer</th></tr>
                </thead>
                <tbody>
                  {scheme.rows.map((row, n) => (
                    <tr key={n}>
                      <td className="markscheme-bullet">
                        {row.part ? `${row.part} ` : ''}&bull;<sup>{n + 1}</sup>
                      </td>
                      <td><MathRenderer html={row.for} className="inline" /></td>
                      <td><MathRenderer html={row.shows} className="inline" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : steps.length ? (
              <table className="markscheme-table">
                <thead>
                  <tr><th>Mark</th><th>Working</th><th /></tr>
                </thead>
                <tbody>
                  {steps.map((step, n) => (
                    <tr key={n}>
                      <td className="markscheme-bullet">&bull;<sup>{n + 1}</sup></td>
                      <td colSpan={2}>
                        <MathRenderer html={step} className="answer-content" />
                        {q.stepMarks?.[n] !== undefined && (
                          <span className="markscheme-step-mark">
                            {q.stepMarks[n]} mark{q.stepMarks[n] === 1 ? '' : 's'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // Neither a published scheme nor worked steps. Said out loud
              // rather than left as a blank space a marker might read as "no
              // marks to give".
              <p className="markscheme-none">
                No marking instructions are held for this question. The final
                answer is below.
              </p>
            )}

            {q.answer && (
              <p className="markscheme-answer">
                <strong>Answer: </strong>
                <MathRenderer html={q.answer} className="inline answer-content" />
              </p>
            )}

            {scheme?.notes?.length ? (
              <div className="markscheme-notes">
                <strong>Notes</strong>
                <ul>
                  {scheme.notes.map((note, n) => (
                    <li key={n}><MathRenderer html={note} className="inline" /></li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>,
    document.body,
  );
}
