/**
 * The question's number as the exam prints it — "6(b)-(c)", not "9".
 *
 * Plain ESM with JSDoc rather than TypeScript for the same reason as
 * lib/timestamp.mjs: scripts/check-question-numbers.mjs imports it, and
 * Cloudflare builds on Node 22.16, which cannot load a .ts file.
 *
 * N5 Applications and Advanced Higher papers are split into one entry per part
 * where the topic changes, so a 7-question paper can be 17 entries. Counting
 * entries tells a pupil they are on "question 9 of 17" while their booklet says
 * 6(b), and there is no question 9. The live app solved this by reading the
 * printed number off the label; this is the same idea.
 *
 * The label is the span inside the <small><strong> wrapper every past-paper
 * question opens with:
 *
 *     <small><strong><span style="white-space: nowrap;">2026 P2 Q6(b)-(c)</span>…
 *
 * Anchored to that wrapper deliberately. Some questions carry a second
 * white-space:nowrap span mid-text (a measurement like "1.5 metres."), so
 * "the first nowrap span in the HTML" picks the wrong one.
 */
const LABEL = /^\s*<small>\s*<strong>\s*<span[^>]*>\s*([^<]+?)\s*<\/span>/i;

/**
 * "2026 P2 Q6(b)-(c)" → "6(b)-(c)". Null when the question carries no label.
 * @param {string} questionHtml
 * @returns {string | null}
 */
export function questionNumber(questionHtml) {
  const m = LABEL.exec(questionHtml ?? '');
  if (!m) return null;
  const number = m[1]
    // year (or "Specimen", which is what Higher Apps uses), optional paper, Q
    .replace(/^(?:\d{4}|Specimen)\s*(?:P\d+\s*)?Q\s*/i, '')
    .replace(/\s*&\s*Q/gi, ' & ')   // "6 & Q7" → "6 & 7"
    .trim();
  return number || null;
}

/**
 * The paper's last question number with any sub-part removed — the count a
 * pupil sees on the front of the booklet. "7(d)" → "7", "11" → "11".
 * @param {{ question: string }[]} questions
 * @param {number} fallback
 * @returns {string}
 */
export function lastQuestionNumber(questions, fallback) {
  const last = questions.length ? questionNumber(questions[questions.length - 1].question) : null;
  if (!last) return String(fallback);
  const stripped = last.replace(/[\s(&-].*$/, '').trim();
  return stripped || String(fallback);
}

/**
 * Are these questions one complete paper, rather than a worksheet somebody
 * assembled in the Explorer? Only then does "Question 6(b) of 7" make sense —
 * for a hand-picked set, position out of total is the honest reading.
 * @param {{ year: number | string, paperNumber: number, questionIndex: number }[]} questions
 * @returns {boolean}
 */
export function isWholePaper(questions) {
  if (questions.length < 2) return false;
  const { year, paperNumber } = questions[0];
  return questions.every(
    (q, i) => q.year === year && q.paperNumber === paperNumber && q.questionIndex === i
  );
}
