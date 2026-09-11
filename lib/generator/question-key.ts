import type { GeneratedQuestion } from './generators/types';

/**
 * Two questions are the same question when only their names differ.
 *
 * `x^2 + 5x + 6` and `y^2 + 5y + 6` are one question written twice. Counting
 * them as two overstates every pool, and **serving** them as two puts the same
 * problem on a pupil's sheet twice - which is the fault this exists to stop.
 *
 * Both the counting and the serving go through here, so a pool can no longer
 * claim variety a sheet cannot deliver. Before it existed they disagreed:
 * `pool.ts` counted distinct text and so did the two de-duplicating loops, so
 * all three were wrong in the same direction and none of them could show it.
 *
 * **What it measured when it was written.** 46 of 210 National 5 topics counted
 * wordings rather than questions. Mostly harmless - `change-subject.fraction`
 * reported 400 and is 63, far over any floor - but **two were clearing a floor
 * of twenty on letters alone**: `indices.expand` reported 21 and is 3,
 * `indices.root-as-power` reported 30 and is 5. Seven letters times three
 * questions is twenty-one of nothing, and the inflation was worst exactly where
 * the pools were smallest.
 *
 * **Prose is left alone.** Only the maths and the figure's own labels are
 * normalised, or "a badge has `a` sides" would merge two questions that
 * genuinely differ.
 *
 * This is deliberately **not** a claim that varying names is bad: it is good for
 * a pupil, because it stops them pattern-matching on `x`. It must simply never
 * be counted as a different question. Which letters a question may use is a
 * separate matter, and `__checks__/variables.ts` owns it.
 */
export function canonicalMaths(text: string): string {
  const order: string[] = [];
  const token = (m: string) => {
    let i = order.indexOf(m);
    if (i === -1) { order.push(m); i = order.length - 1; }
    return `V${i}`;
  };

  /**
   * `$…$` **and** a figure's own labels, under one shared mapping.
   *
   * A vector pathway names its vectors in the prose *and* prints them on the
   * drawing, and the drawing's copy is an SVG text node rather than maths.
   * Canonicalising only the prose left the figure carrying the difference:
   * cutting that topic's name pairs from six to four took its "pool" from 24 to
   * **exactly 16**, which is 24 × 4/6 — the count was two-thirds naming all
   * along.
   *
   * One shared `order` across both, so the `a` in the sentence and the `a` on
   * the diagram become the same token, and a figure that disagrees with the
   * words beside it does **not** merge with one that agrees.
   */
  return text.replace(/\$[^$]*\$|>\s*([A-Za-z])\s*</g, (seg, label?: string) => {
    if (label !== undefined) return `>${token(label)}<`;

    /**
     * **Every letter, not only the lone ones.**
     *
     * A vector question names its rays `\overrightarrow{AD}` - two letters side
     * by side, which a standalone-letter rule steps straight over. That is how
     * `vectors.pathway-extended` still counted its four point-name sets as four
     * questions when its geometry is **entirely hardcoded**: not one numeric
     * parameter anywhere in it. One question, sixteen spellings.
     *
     * `\text{...}` comes out first and goes back whole. Its contents are English
     * rather than algebra, and mapping them letter by letter would merge "the
     * cost" with "the time".
     *
     * The placeholder is `@@n@@` rather than a bare number, because the letter
     * pass emits `V0`, `V1`... and a digit-only marker could not be told from
     * one of those.
     */
    const words: string[] = [];
    const bare = seg
      .replace(/\\(?:text|mathrm|mbox)\{[^}]*\}/g, m => `@@${words.push(m) - 1}@@`)
      .replace(/\\[a-zA-Z]+/g, ' ')
      .replace(/[A-Za-z]/g, m => token(m));
    return bare.replace(/@@(\d+)@@/g, (_, i) => words[Number(i)]);
  });
}

/**
 * The identity of a question for counting and for de-duplication.
 *
 * Takes the whole of what a pupil is shown, figure included, because two
 * questions with the same prose and different diagrams are two questions.
 */
/**
 * A figure's coordinates, dropped — see `questionKey` for why that is safe
 * only in company.
 */
const withoutGeometry = (text: string): string =>
  text.replace(/<[^>]*>/g, tag => tag.replace(/-?\d+(?:\.\d+)?/g, '#'));

/**
 * The identity of a question, for counting and for de-duplication.
 *
 * **What a pupil is asked, and what it comes to.** Two things had to be true at
 * once, and each one alone gets the other badly wrong.
 *
 * *Drop nothing* and a figure that merely jitters counts as new work:
 * `vectors.pathway-rhombus` has **one** question and reported **31**, because
 * its shape varies a little each draw and every variation reaches the `viewBox`
 * as a different float - `251.04 300.31` against `199.55 302.77`. That is
 * counting the renderer.
 *
 * *Drop the coordinates* and a question whose data **is** the drawing
 * disappears: `Adding Two Vectors Drawn on a Grid` prints the same sentence
 * every time and puts the two vectors on a grid, so its 55 distinct answers in
 * 60 draws collapsed to **1**. One of the richest topics in the course, read as
 * the emptiest.
 *
 * So the coordinates go and **the answer comes in**. The rhombus merges,
 * because its answer never changes however the shape is drawn; the grid vectors
 * separate, because theirs changes every time. Both from one rule, and neither
 * needs to know which topic it is looking at.
 *
 * Question and answer are canonicalised **together**, in one pass, so the `x`
 * in the question and the `x` in the answer become the same token. Canonicalise
 * them apart and a question in `x` answered in `x` would not match itself.
 *
 * Where it errs it errs towards **merging**: two genuinely different questions
 * that happen to share an answer count as one. For a floor that is the safe
 * direction - it can only make the bar harder to clear, never easier.
 */
export function questionKey(q: Pick<GeneratedQuestion, 'questionLines' | 'finalAnswer'>): string {
  return canonicalMaths(`${withoutGeometry(q.questionLines.join('|'))}||${q.finalAnswer ?? ''}`);
}
