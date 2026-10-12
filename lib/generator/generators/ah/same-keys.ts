/**
 * **One "same question" test for Advanced Higher**, used both by the guard (never a past paper's
 * question, `not-the-paper.ts`) and by a sheet (no twins, `site.ts`): the owner, 2026-10-11, on
 * https://claude.ai/artifact/HsgUh874rKzLiNnRij1tMc and https://claude.ai/artifact/XYrnXP4ndMcortGbzQHeUU,
 * "Yes" to one test for the guard and for twins, wherever questions are generated.
 *
 * Until then the guard kept out a paper's question only word for word, while a sheet used the
 * owner's wider rulings, so the paper written another way got through: 2019 Q3's f against −f
 * (9.4% of the card's draws), a sister card's own wording (2018 Q1(a) drawing 2026 P2 Q1's
 * 3 sin⁻¹ 7x), a number the working never uses (2016 Q1(c)'s y = 1 − cos t, 2026 P2 Q10's
 * "= 50"). Found by a separate search, tools/never-the-paper `ahagain-*.mts` and `ahdesign.mts`.
 *
 * A built question's identities, each hashed small:
 * - its question and its story-free sum (`question-key.ts`), as a sheet always used;
 * - the owner's "same question" test (`same-question.ts`): wording with letters renamed and
 *   facts in any order, and the working;
 * - THE MATHS KEY: the question's maths with lone letters, punctuation and pieces that carry no
 *   number and no "=" dropped (so "Given f(x) = 3 sin⁻¹ 7x find f′(x)" and "The function f is
 *   defined by f(x) = 3 sin⁻¹ 7x. Find f′(x)." are one), its numbers in words, and its answer;
 * - THE WORKING KEY: every worked step's maths and numbers, in order, and the answer. A number
 *   the working never uses is not in it; a number used anywhere is.
 *
 * Reads the built question only: nothing here draws, so no card's questions change by it.
 */
import { questionKey, storyFreeKey } from '../../question-key';
import { sameQuestionKey, sameWorkingKey, shortHash } from '../../same-question';
import type { Built } from './types';

const strip = (m: string) => m.replace(/\\[,;:! ]|\s+/g, '').replace(/\\(?:ldots|dots|cdots)/g, '').replace(/[.,;:]+$/, '');
/** The maths of a piece of text, each `$…$` piece in order, spaces and closing punctuation dropped. */
export const mathsOf = (s: string): string[] => [...s.matchAll(/\$([^$]*)\$/g)].map(m => strip(m[1])).filter(Boolean);
const proseNumbers = (s: string): string[] => (s.replace(/\$[^$]*\$/g, ' ').replace(/<[^>]+>/g, ' ').match(/-?\d+(?:\.\d+)?/g) ?? []).sort();
const textLines = (b: Built) => b.questionLines.filter(l => !l.startsWith('<svg'));
/** The question's maths that says something: no lone letter or label, and a number or an "=" in it. */
export const questionMaths = (b: Built): string[] => mathsOf(textLines(b).join(' '))
  .filter(m => !/^[a-zA-Z]$/.test(m) && !/^[A-Z]{1,4}$/.test(m) && (/\d/.test(m) || m.includes('='))).sort();
/** The answer's maths, an "(or …)" alternative left out. */
export const answerMaths = (answer: string): string[] => mathsOf(answer.replace(/\(or\s*\$[^$]*\$\s*\)/g, ' ')).sort();

export const mathsKey = (b: Built): string =>
  shortHash(`M:${questionMaths(b).join('|')}#${proseNumbers(b.questionLines.join(' ')).join(',')}#${answerMaths(b.finalAnswer).join('|')}`);
export const workingKey = (b: Built): string =>
  shortHash(`W:${b.solutionSteps.map(s => `${mathsOf(s).join('|')}~${proseNumbers(s).join(',')}`).join('§')}#${answerMaths(b.finalAnswer).join('|')}`);

/** The owner's "same question" test on a built question, as National 5's `twinKeysOf`. */
export function sameTestKeys(b: Built): string[] {
  const w = sameWorkingKey(b.questionLines, b.finalAnswer, b.solutionSteps);
  return [shortHash(`Q:${sameQuestionKey(b.questionLines, b.finalAnswer)}`), ...(w ? [shortHash(w)] : [])];
}

/** Every identity the guard compares with the papers'. */
export function sameKeysOf(b: Built): string[] {
  return [
    shortHash(`QK:${questionKey({ questionLines: b.questionLines, finalAnswer: b.finalAnswer })}`),
    shortHash(`SF:${storyFreeKey(b.questionLines.join('\n'), b.finalAnswer)}`),
    ...sameTestKeys(b), mathsKey(b), workingKey(b),
  ];
}

/**
 * A question's lettered parts for P2 across cards: each part's own maths in the question and in
 * its answer, and the marks its working carries. Parts with romans are taken whole, by letter.
 */
export interface PartMaths { letter: string; q: string[]; a: string[]; marks: number }
export function partsOf(b: Built): PartMaths[] {
  const q = new Map<string, string[]>();
  let letter = '';
  for (const l of textLines(b)) {
    const m = /^\s*(?:<b>)?\(([a-h])\)/.exec(l);
    if (m) letter = m[1];
    if (letter) q.set(letter, [...(q.get(letter) ?? []), ...mathsOf(l).filter(x => /\d|=|\\/.test(x))]);
  }
  const a = new Map<string, string[]>();
  for (const line of b.finalAnswer.split('<br>')) {
    const m = /^\s*\(([a-h])\)/.exec(line);
    if (m) a.set(m[1], [...(a.get(m[1]) ?? []), ...answerMaths(line)]);
  }
  const marks = new Map<string, number>();
  b.solutionSteps.forEach((s, i) => {
    const l = /^(?:<strong>)?\s*\(([a-h])\)/.exec(s)?.[1];
    if (l) marks.set(l, (marks.get(l) ?? 0) + (b.stepMarks[i] ?? 0));
  });
  return [...a.keys()].map(l => ({ letter: l, q: q.get(l) ?? [], a: a.get(l) ?? [], marks: marks.get(l) ?? 0 }));
}

/**
 * P2 across cards (the owner, 2026-10-11, "Yes"): the marks of a paper's parts that a draw holds
 * word for word, each part's question maths in the draw's question and its answer in the draw's
 * answer. A part with nothing of its own to match (no maths in its question, or no answer piece
 * with a number of four or more characters, such as "(c) State why …") never counts.
 */
export interface Held { qs: Set<string>; as: Set<string> }
/** A draw's maths as sets, made once and compared with every paper's parts. */
export const heldOf = (b: Built): Held => ({
  qs: new Set([...questionMaths(b), ...mathsOf(textLines(b).join(' '))]),
  as: new Set(answerMaths(b.finalAnswer)),
});
const real = (p: PartMaths) => p.q.length > 0 && p.a.some(s => /\d/.test(s) && s.length >= 4);
export function marksHeld(paper: readonly PartMaths[], held: Held): number {
  return paper.reduce((t, p) => t + (real(p) && p.q.every(s => held.qs.has(s)) && p.a.every(s => held.as.has(s)) ? p.marks : 0), 0);
}

/**
 * **Sheets that feel distinct** (the owner, 2026-10-11: "We want sheets that feel distinct from each other"; then "Yes"
 * to H as a preference, https://claude.ai/artifact/M6DpEQtAt85G65LoYXqdis): two questions on a sheet that share parts
 * carrying half the marks or more feel like one, so a sheet takes such a question only once the card has no fresh one
 * (`drawCards` in `site.ts`, as a thin card's core). A preference, never a limit: no sheet is shorter for it.
 *
 * A part is the same work when its own lines, its WORKING and its answer are the same under the same stem (its maths,
 * numbers and figure). The working carries what a "hence" builds on: 2023 P1 Q6's (b) "show z³ is real" for
 * z = 2 − 2√3i and 2 + 2√3i (both −64) is worked from each one's own argument, so it differs, while 2018 Q17's (b),
 * tan x, is the same work whatever (a) is. Marks are the working's, by letter.
 *
 * A figure that sits after one part and before the next counts with the NEXT part, which it introduces (the audit,
 * 2026-10-12, the owner "Yes"): 2017 Q18's path is drawn after (a) for (b) to read a point off, and counted with (a)
 * it made the same (a), 5 of 7 marks, look new on every question of a sheet. A figure after the last part stays there.
 */
export interface SheetPart { key: string; marks: number }
const PART_LETTER = /^\s*(?:<b>|<strong>)?\s*\(([a-h])\)/;
const flat = (s: string) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
export function sheetPartsOf(b: Built, withStem = true): SheetPart[] {
  const stem: string[] = [], lines = new Map<string, string[]>();
  const add = (l: string, xs: string[]) => lines.set(l, [...(lines.get(l) ?? []), ...xs]);
  let letter = '', figs: string[] = [];
  for (const l of b.questionLines) {
    const m = PART_LETTER.exec(l);
    if (m) { letter = m[1]; add(letter, figs); figs = []; }
    const fig = l.startsWith('<svg') ? `svg:${shortHash(l)}` : '';
    if (!letter) stem.push(fig || `${mathsOf(l).join('|')}#${proseNumbers(l).join(',')}`);
    else if (fig) figs.push(fig);
    else add(letter, [flat(l)]);
  }
  if (letter) add(letter, figs);
  const ans = new Map<string, string[]>();
  for (const l of b.finalAnswer.split('<br>')) {
    const m = /^\s*\(([a-h])\)/.exec(l);
    if (m) ans.set(m[1], [...(ans.get(m[1]) ?? []), flat(l)]);
  }
  const work = new Map<string, string[]>(), marks = new Map<string, number>();
  b.solutionSteps.forEach((s, i) => {
    const l = PART_LETTER.exec(s)?.[1];
    if (!l) return;
    work.set(l, [...(work.get(l) ?? []), flat(s)]);
    marks.set(l, (marks.get(l) ?? 0) + (b.stepMarks[i] ?? 0));
  });
  // `withStem` false: a part as its WORKING and answer alone, whatever the question's lines say (the guard's own-paper
  // rule, `not-the-paper.ts`: a number changed in the opening line, or in a line between parts, the part's work the
  // same). Not its lines: a line that introduces the next part sits after this one (2022 P2 Q7's "is a factor of …"
  // before (c), 2024 P1 Q4's matrix B before (b)), so a change there read as this part changing (the independent parts
  // search, 2026-10-12).
  const st = withStem ? stem.join('§') : '';
  const own = (l: string) => (withStem ? (lines.get(l) ?? []).join('§') : '');
  return [...ans.keys()].map(l => ({
    key: shortHash(`${st}¶${own(l)}¶${(work.get(l) ?? []).join('§')}¶${(ans.get(l) ?? []).join('§')}`),
    marks: marks.get(l) ?? 0,
  }));
}
/** Do two questions share parts worth half the marks of either, or more? */
export function sharesHalf(x: readonly SheetPart[], y: readonly SheetPart[]): boolean {
  const kx = new Set(x.map(p => p.key)), ky = new Set(y.map(p => p.key));
  const half = (ps: readonly SheetPart[], other: Set<string>) => {
    const tot = ps.reduce((t, p) => t + p.marks, 0);
    return tot > 0 && 2 * ps.filter(p => other.has(p.key)).reduce((t, p) => t + p.marks, 0) >= tot;
  };
  return half(x, ky) || half(y, kx);
}
/**
 * A question's card and parts as one key a sheet's `exclude` can carry (as a core's), and back:
 * `parts:<card>|<key>*<marks>,…`. Single-part questions have none. The card lets a sheet see which card already has a
 * repeat on it, so that card is not searched for a fresh one again on every click (`drawCards`).
 */
export const PARTS_PREFIX = 'parts:';
export const partsKeyOf = (b: Built, card: string): string | undefined => {
  const ps = sheetPartsOf(b);
  return ps.length > 1 ? `${PARTS_PREFIX}${card}|${ps.map(p => `${p.key}*${p.marks}`).join(',')}` : undefined;
};
export const partsFromKey = (k: string): { card: string; parts: SheetPart[] } => {
  const body = k.slice(PARTS_PREFIX.length), bar = body.lastIndexOf('|');
  return {
    card: body.slice(0, bar),
    parts: body.slice(bar + 1).split(',').map(s => { const [key, m] = s.split('*'); return { key, marks: Number(m) }; }),
  };
};
