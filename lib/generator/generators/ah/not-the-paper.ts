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
import { PAPER_DRAWS } from './paper-draws';
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

/**
 * A question in pieces: its opening lines (before (a)), and each lettered part as its text
 * and its answer, with the marks the part's working carries.
 */
export interface Pieces { stem: string; parts: Record<string, string>; marks: Record<string, number> }
const LABEL = /<b>\(([a-h])\)<\/b>/g;
export function piecesOf(b: Built): Pieces {
  const html = questionOf(b), text: Record<string, string> = {};
  let last = '', at = 0, m: RegExpExecArray | null;
  LABEL.lastIndex = 0;
  while ((m = LABEL.exec(html))) { text[last] = (text[last] ?? '') + html.slice(at, m.index); last = m[1]; at = m.index + m[0].length; }
  text[last] = (text[last] ?? '') + html.slice(at);
  const answer: Record<string, string> = {};
  for (const line of b.finalAnswer.split('<br>')) { const a = /^\s*\(([a-h])\)/.exec(line); if (a) answer[a[1]] = `${answer[a[1]] ?? ''} ${plainKey(line)}`; }
  const marks: Record<string, number> = {};
  b.solutionSteps.forEach((s, i) => { const l = /^(?:<strong>)?\(([a-h])\)/.exec(s)?.[1]; if (l) marks[l] = (marks[l] ?? 0) + (b.stepMarks[i] ?? 0); });
  const parts: Record<string, string> = {};
  for (const [k, v] of Object.entries(text)) if (k) parts[k] = `${plainKey(v)} => ${answer[k] ?? ''}`;
  return { stem: plainKey(text[''] ?? ''), parts, marks };
}

const PAPER_PIECES = new Map<string, Pieces>();

/**
 * The owner's P2 (2026-10-10, https://claude.ai/artifact/MkFza3BMgrXXUvxPboVU9w): "keep out
 * the paper with one part changed when the unchanged parts carry at least half its marks". A
 * draw with the paper's opening lines and every lettered part the paper's, text and answer,
 * but one, where the parts it shares with the paper carry at least half the paper's marks: a
 * pupil following the paper's video would get those marks. A card's own paper only, from the
 * numbers that make it (`paper-draws.ts`).
 */
function onePartFromPaper(card: CardLabel, routine: CardRoutine, built: Built): boolean {
  const n = PAPER_DRAWS[card];
  if (n === undefined) return false;
  let p = PAPER_PIECES.get(card);
  if (!p) { p = piecesOf(routine.build(n)); PAPER_PIECES.set(card, p); }
  const q = piecesOf(built);
  if (q.stem !== p.stem) return false;
  const letters = [...new Set([...Object.keys(p.parts), ...Object.keys(q.parts)])];
  const changed = letters.filter(l => q.parts[l] !== p.parts[l]);
  if (changed.length !== 1 || letters.length < 2) return false;
  const total = Object.values(p.marks).reduce((a, b) => a + b, 0);
  return 2 * (total - (p.marks[changed[0]] ?? 0)) >= total;
}

/**
 * The paper a built question is, or null: another paper's by its text, a figure card's own
 * whole, or its own with one part changed and half the marks or more the paper's (P2).
 */
export function paperQuestionOf(card: CardLabel, routine: CardRoutine, built: Built): string | null {
  const q = questionOf(built);
  const own = FIGURE_PAPERS[card];
  if (own !== undefined && q === questionOf(routine.build(own))) return card;
  const byText = AH_PAPER_KEYS[keyHash(plainKey(q))];
  if (byText) return byText;
  return onePartFromPaper(card, routine, built) ? card : null;
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
