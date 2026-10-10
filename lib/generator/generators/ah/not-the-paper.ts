/**
 * **Never the paper's own question** (the owner, 2026-10-07: "the exam paper
 * question never appears in a draw. This should be for the exact exam paper
 * question, if one thing changes - it can appear in a draw"; for AH, on the
 * repeats sheet, 2026-10-09: "Yes"). A teacher sets generated questions as
 * homework, and a pupil who meets a paper's own question can follow its video
 * walkthrough to the answer.
 *
 * `routineFor` (engine.ts) hands out every card's routine wrapped by `guarded`:
 * a draw whose question is an AH past paper question is drawn again. Which
 * paper does not matter: a family card can land on a sister's paper (2024 P2
 * Q2 drew 2018 Q5's), so every draw is checked against all of them.
 *
 * - **By text**, for almost every card: the draw's plain key (`plain-key.ts`)
 *   against the site's own paper questions (`paper-keys.ts`). Word for word,
 *   once the two ways of writing the same maths are made one.
 * - **Whole, figure included**, for the three cards whose figure carries the
 *   paper's numbers (FIGURE_PAPERS): their text is the paper's on draws whose
 *   figure is not, and those are different questions, so they are kept.
 *
 * A draw that is not a paper question is exactly what it was: nothing else is
 * drawn, so every other draw under a seed is unchanged. Only routines draw
 * (`ah-purity`); this only asks a routine for another draw.
 */
import type { Built, CardLabel, CardRoutine } from './types';
import { AH_PAPER_KEYS } from './paper-keys';
import { keyHash, plainKey } from './plain-key';

/**
 * The numbers that build each figure paper's own question, the figure included
 * (counted by eye from every draw: 2017 Q18 173 in 4,000, 2019 Q18 510, 2016
 * Q12 169; tools/never-the-paper, "Diagram cards"). `ah-not-the-paper` proves
 * each builds the site's question and draws its paper in those numbers.
 */
export const FIGURE_PAPERS: Readonly<Record<string, unknown>> = {
  // A on the negative x-axis, its second crossing, x = t cos t
  '2017 Q18': { k: 1, m: 6 },
  // a = 4, w at (a, -a√3)
  '2019 Q18': { m: -9, a: 4 },
  // the rising line through (c, 0) and (0, -c), with |f(x) - c| and |2f(x)|
  '2016 Q12': { line: { s: 1, r: 1 }, d: -1, k: 2 },
};

const questionOf = (b: Built): string => b.questionLines.join('\n');

/** The paper a built question is, or null: another paper's by its text, or a figure card's own whole. */
export function paperQuestionOf(card: CardLabel, routine: CardRoutine, built: Built): string | null {
  const q = questionOf(built);
  const own = FIGURE_PAPERS[card];
  if (own !== undefined && q === questionOf(routine.build(own))) return card;
  return AH_PAPER_KEYS[keyHash(plainKey(q))] ?? null;
}

/** How many draws in a row may be a paper question before the guard gives up loudly (no card comes close). */
export const GUARD_LIMIT = 200;

/** A card's routine that never draws a past paper question. */
export function guarded<N>(card: CardLabel, routine: CardRoutine<N>): CardRoutine<N> {
  return {
    build: routine.build,
    draw: () => {
      for (let tries = 0; tries < GUARD_LIMIT; tries++) {
        const n = routine.draw();
        if (!paperQuestionOf(card, routine as CardRoutine, routine.build(n))) return n;
      }
      throw new Error(`not-the-paper: ${GUARD_LIMIT} draws in a row of ${card} were a past paper question`);
    },
  };
}
