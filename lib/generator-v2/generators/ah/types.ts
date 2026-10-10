/**
 * Advanced Higher: the shape of a card and of the routine that makes it.
 *
 * The rules this encodes are in `docs/ah-course.md`. In short:
 *
 * - **One card, one routine.** A card is a question as the website shows it:
 *   "2019 Q4" with its (a) and (b), or "2019 Q1(b)" where the site already
 *   shows a part on its own. Its routine makes that card and nothing else, and
 *   is called by the card's id, so nothing is ever drawn and thrown away.
 * - **Draw, then build.** `draw` picks every random number the card uses;
 *   `build` turns those numbers into the question and draws nothing. That keeps
 *   a card's numbers in one place, makes `build` testable on chosen numbers,
 *   and lets a whole-question version (2021 P2 Q11's two halves on one set of
 *   expressions) hand one draw to two builds without touching either card.
 * - **Cards share maths, never randomness or wording.** A routine may call the
 *   helpers in `ah/maths/`, which draw nothing and write no sentences. It may
 *   not call another card's routine.
 */
import type { Figure } from '../../diagrams/scene';

/** A card label exactly as the site badges it: "2025 P1 Q3", "2019 Q4", "2019 Q1(b)". */
export type CardLabel = string;

/** Which paper a card sits on, derived from its label (see `paperOf`). */
export interface PaperOf {
  year: number;
  /** 1 or 2 from 2021; null for the single paper of 2016 to 2019. */
  paper: 1 | 2 | null;
  /** Paper 1 is non-calculator. The single paper of 2016 to 2019 allowed one. */
  calculator: boolean;
}

/**
 * What a card's routine returns: the question as the paper sets it.
 *
 * Everything the engine can add itself (the id, the code, the topic, the tier)
 * is left to the engine, so a routine cannot get it wrong.
 */
export interface Built {
  /**
   * One entry per line of the paper, in its order. `''` starts a paragraph,
   * a part starts its own line, displayed maths gets its own line where the
   * paper gives it one, and a figure is an `<svg>` line of its own. Never join
   * lines or add `<br>`: `layoutQuestion` does that.
   */
  questionLines: string[];
  /**
   * The worked solution, one step per mark in the scheme's order. On a card in
   * parts each step's leading `<strong>` names its part: `<strong>(a)</strong>`.
   * The last step states the answer.
   */
  solutionSteps: string[];
  /** Marks for each step. Sums to the card's marks. */
  stepMarks: number[];
  /**
   * The answer "Show answer" gives. On a card in parts, every part, one per
   * line, joined with `<br>`: `(a) … <br>(b) …`. A "show that" gets its result
   * and "(shown)".
   */
  finalAnswer: string;
  /** The hint ladder for this draw. See `Ladder`. */
  ladder: Ladder;
  figure?: Figure;
  /**
   * Drawings the marking instructions give, one per part that asks for a
   * sketch: the finished sketches of 2021 P1 Q7 (b) and (c)(i), as its
   * marking instructions draw them. Shown with the working, the card's
   * marking instructions, and never under "Show answer" (the owner,
   * 2026-10-01: "don't show the sketches on show answer just the
   * markscheme"). `svg` is the rendered figure. Absent on every other card.
   */
  markschemeFigures?: { part: string; figure: Figure; svg: string }[];
}

/**
 * The hints a pupil gets on a generated card: the paper card's ladder, with
 * this draw's numbers.
 *
 * Every Advanced Higher card already has a ladder (`PLAN_AH`, written to the
 * hint rules of 2026-09-27). Some of its moves are general ("Multiply the top
 * and the bottom by the conjugate") and some name the paper's own values
 * ("Factorise x² − x − 12"), and its `shows` are all the paper's working. So a
 * routine builds its card's ladder in the same shape, the same moves with the
 * same marks and watch-out, with its own values where the paper's named one.
 * `ah-draws` holds it to that shape and to the hint rules:
 *
 * - moves of 0 to 2 marks, the first a nudge worth 0, summing to the card;
 * - on a card in parts, every move after the nudge names its part: "(b) …";
 * - maths in `$…$`, never ², √, ≤ or π written out;
 * - the last `shows` is always null: the step that lands the answer is the
 *   pupil's, and no `shows` may print the answer itself.
 */
export interface Ladder {
  /** What to do next, one move each, in our words. */
  moves: string[];
  /** What each move is worth. */
  marks: number[];
  /** The working as each move begins, from this draw; null where withheld. */
  shows: (string | null)[];
  /** One thing pupils get wrong, from the scheme's notes, under move `at`. */
  watch?: { at: number; text: string };
}

/**
 * A card's routine: `draw` then `build`.
 *
 * `N` is the card's own numbers type, declared beside the routine, so what a
 * card varies is written down in one place and a reader never has to hunt for
 * a `getRandomInt` in the middle of the wording.
 */
export interface CardRoutine<N = unknown> {
  /** Every random number the card uses, and nothing else. */
  draw(): N;
  /** The card from those numbers. Must draw nothing; `ah-draws` proves it. */
  build(n: N): Built;
}

/**
 * A card's entry in the registry: what it is, not how it is made.
 *
 * Kept apart from the routine so the website can know every card (for the
 * Worksheet Builder's lists and a shared link's codes) without loading the
 * code that generates them.
 */
export interface CardMeta {
  /** The site's badge for the card. The id and the code are derived from it. */
  card: CardLabel;
  /** One line: what the pupil is asked to do. */
  skill: string;
  /**
   * Marks per part, exactly as the site card's `marks`: `[1, 3]` for 2019 Q4.
   * `ah-registry` compares it with the site and with the marking instructions.
   */
  marks: number[];
  /**
   * What the marks are for, one sentence, written with the marking
   * instructions open. On a card in parts it opens with the split in figures:
   * `1 + 3 - divide to get p + (qx + r)/…, then…`. Say what the scheme refuses
   * as well as what it wants, and which method is taken where it allows two.
   */
  route: string;
  /**
   * The numbers, and why: what the paper used, what the card draws, and the
   * constraints that keep it the paper's question (exact on Paper 1, integer
   * coefficients, no zero term, a denominator that factorises). One or two
   * sentences. Written from the paper's own numbers, before the routine.
   */
  ranges: string;
  /**
   * A card too small to vary honestly (a standard proof, a fixed identity) is
   * recorded here with the owner's words, instead of being widened into a
   * question no paper sets. Its routine may then make few questions.
   */
  exempt?: { why: string; owner: string };
}
