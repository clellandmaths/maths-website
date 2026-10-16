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
 * - **By the one "same question" test** (`same-keys.ts`, since 2026-10-11): the
 *   paper in another card's words, by the owner's twin rulings, or with a number
 *   its working never uses changed; and P2 against every paper, not only the
 *   card's own. Word for word alone let these through: a separate search found
 *   2019 Q3's f against −f in 9.4% of its card's draws (tools/never-the-paper,
 *   `ahagain-*.mts`, `ahdesign.mts`). The owner: one test for the guard and for
 *   twins, "Yes". `ah-not-the-paper` holds every leak found and every look-alike
 *   ruled different as test cases.
 *
 * A draw that is not a paper question is exactly what it was: nothing else is
 * drawn, so every other draw under a seed is unchanged. Only routines draw
 * (`ah-purity`); this only asks a routine for another draw.
 */
import type { Built, CardLabel, CardRoutine } from './types';
import { AH_PAPER_KEYS } from './paper-keys';
import { PAPER_DRAWS } from './paper-draws';
import { keyHash, plainKey } from './plain-key';
import { PAPER_PARTS, PAPER_SAME, PAPER_TWIN } from './paper-same';
import { heldOf, marksHeld, sameKeysOf, sheetPartsOf, type SheetPart } from './same-keys';
import { cardTwinKey } from './card-twins';

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
/** A figure card's own paper question, built once (it was built again on every check). */
const FIGURE_PAPER_TEXT = new Map<string, string>();

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
 * The one card whose own paper's parts are NOT held against it (the audit's G1, 2026-10-12): 2018 Q17's (b), tan x,
 * is the paper's in every draw (5 of its 10 marks), so holding it would leave the card no question. The owner: "let a
 * vary and keep the rest" (2026-10-11), and on the audit sheet, "Probably best to leave it widening to sec x just means
 * all variations would have sec x instead of tan x" (https://claude.ai/artifact/Ds2CWt7zPQsZ8HBcHZ63Av, card 2).
 */
const OWN_PARTS_LEFT = new Set<string>(['2018 Q17']);

/**
 * The marks of a card's own paper held by a draw: the paper's parts whose own lines, WORKING and answer the draw has
 * word for word, whatever its opening lines (`sheetPartsOf` without the stem). The working as well as the answer, as
 * the owner was shown it ("the other parts stay the paper's own, word for word, working and answer"), and as a sheet
 * compares parts: 2024 P1 Q5's x^3 + x for x^3 - x, ruled a different question (2026-10-11), keeps (b)'s answer but
 * not its working (f'(x) = 3x^2 + 1), so it is not held.
 */
const OWN_PAPER_PARTS = new Map<string, SheetPart[]>();
function ownPaperHeld(card: CardLabel, routine: CardRoutine, built: Built): boolean {
  const n = PAPER_DRAWS[card];
  if (n === undefined) return false;
  let p = OWN_PAPER_PARTS.get(card);
  if (!p) { p = sheetPartsOf(routine.build(n), false); OWN_PAPER_PARTS.set(card, p); }
  if (p.length < 2) return false;
  const have = new Set(sheetPartsOf(built, false).map(x => x.key));
  const total = p.reduce((t, x) => t + x.marks, 0);
  return total > 0 && 2 * p.filter(x => have.has(x.key)).reduce((t, x) => t + x.marks, 0) >= total;
}

/** Each paper identity (`same-keys.ts`) to its paper. */
const PAPER_SAME_KEYS = new Map(Object.entries(PAPER_SAME).flatMap(([p, ks]) => ks.map(k => [k, p] as const)));
/** Each multi-part paper's total marks, for P2 across cards. */
const PART_TOTALS = new Map(Object.entries(PAPER_PARTS).map(([p, ps]) => [p, ps.reduce((t, x) => t + x.marks, 0)]));

/**
 * The paper a built question is, or null:
 * - another paper's (any card's) by its text, word for word;
 * - a figure card's own, whole;
 * - any paper's by the one "same question" test (`same-keys.ts`; the owner, 2026-10-11, "Yes"): the
 *   paper in other words, by the owner's twin rulings, or with a number its working never uses
 *   changed. The paper's identities are its card's own build (`paper-same.ts`);
 * - its own paper by its card's twin rule (`card-twins.ts`), when the draw is given;
 * - its own paper with one part changed, half the marks or more the paper's (P2);
 * - any paper whose parts it holds word for word, half that paper's marks or more (P2 across cards: 2016 Q6's
 *   card drew 2024 P2 Q7's part (a), 4 of its 6 marks), ITS OWN included (the audit's G1, the owner "Yes",
 *   2026-10-12): a number changed in the opening line that only one part uses leaves the other parts the paper's
 *   (2024 P1 Q7, -32 to -108: (a) is the paper's, 3 of 6 marks), which the one-part rule above never saw because
 *   the opening line differs. 2018 Q17 is left (`OWN_PARTS_LEFT`).
 */
export function paperQuestionOf(card: CardLabel, routine: CardRoutine, built: Built, draw?: unknown): string | null {
  const q = questionOf(built);
  const own = FIGURE_PAPERS[card];
  if (own !== undefined) {
    let paper = FIGURE_PAPER_TEXT.get(card);
    if (paper === undefined) { paper = questionOf(routine.build(own)); FIGURE_PAPER_TEXT.set(card, paper); }
    if (q === paper) return card;
  }
  const byText = AH_PAPER_KEYS[keyHash(plainKey(q))];
  if (byText) return byText;
  for (const k of sameKeysOf(built)) { const p = PAPER_SAME_KEYS.get(k); if (p) return p; }
  if (draw !== undefined && PAPER_TWIN[card] !== undefined && cardTwinKey(card, draw) === PAPER_TWIN[card]) return card;
  if (onePartFromPaper(card, routine, built)) return card;
  if (!OWN_PARTS_LEFT.has(card) && ownPaperHeld(card, routine, built)) return card;
  const held = heldOf(built);
  for (const [paper, parts] of Object.entries(PAPER_PARTS)) {
    if (paper === card) continue;
    if (2 * marksHeld(parts, held) >= PART_TOTALS.get(paper)!) return paper;
  }
  return null;
}

/** How many draws in a row may be a paper question before the guard gives up loudly (no card comes close). */
export const GUARD_LIMIT = 200;

/**
 * A card's routine that never draws a past paper question.
 *
 * Each draw's verdict is remembered by its numbers (`drawKey`): a build is a function of its
 * draw alone, so the same numbers always get the same verdict, and a card a sheet has used up
 * no longer builds the same question again and again to check it. 2016 Q12, whose build draws
 * its figure, took 708 ms in Node for one more press once spent, about 2.6 s on a slowed phone
 * (tools/never-the-paper `data/ah/speed/`). Speed only: 86,000 draws and every sheet the same.
 */
export function guarded<N>(card: CardLabel, routine: CardRoutine<N>): CardRoutine<N> {
  const verdicts = new Map<string, boolean>();
  return {
    build: routine.build,
    draw: () => {
      for (let tries = 0; tries < GUARD_LIMIT; tries++) {
        const n = routine.draw();
        const k = drawKey(n);
        let paper = verdicts.get(k);
        if (paper === undefined) {
          paper = !!paperQuestionOf(card, routine as CardRoutine, routine.build(n), n);
          if (verdicts.size < 5000) verdicts.set(k, paper);
        }
        if (!paper) return n;
      }
      throw new Error(`not-the-paper: ${GUARD_LIMIT} draws in a row of ${card} were a past paper question`);
    },
  };
}

/** A draw's numbers as a key (BigInt-safe): a routine's build is a function of its draw alone. */
export function drawKey(n: unknown): string {
  return JSON.stringify(n, (_, v) => (typeof v === 'bigint' ? `${v}n` : v));
}
