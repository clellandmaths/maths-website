/**
 * **National 5's one "same question" test**, used by the guard (never a past paper's question, `paper-guard.ts`) and by
 * a sheet (no twins, `worksheet-question.ts`): AH's design (`ah/same-keys.ts`, `ah/not-the-paper.ts`; `docs/new-course.md`
 * "What AH taught" points 1 to 4, 9, 11 and 15) with N5's own rulings. Built 2026-10-16 on the owner's "Yes" to building
 * it, "B" for parts read off a graph, "Yes" for parts with little maths, and their same/different rulings L1 to L10
 * (https://claude.ai/artifact/UWUx2p9MB722HVJ6NjnxBs). Measured first, read-only, by the prototype this is taken from
 * (tools/never-the-paper/scripts/n5d-proto.mts): every card 20,000 draws as the site makes them, against independent
 * searches that share none of this code.
 *
 * N5's own layer, NOT the shared `../same-question.ts`, which AH imports: nothing here can change an AH question or
 * sheet. Reads a built question only, so no draw is changed by it.
 *
 * Where N5 differs from AH, each by an N5 ruling:
 * - N5's own working test (`sameWorkingKey`), never AH's working key, which drops a number of the question the working
 *   never shows ("14 sin x = 10" is written for both 14 sin x − 3 = 7 and 14 sin x + 2 = 12, "which are different
 *   questions");
 * - renamed letters are the same question (AH dropped that test for AH only);
 * - a part is its maths and its numbers, not its words (N5's working names the story: "the rocket", "the flare");
 * - the story-free key and the maths keys only where the question carries numbers, a sign kept as a sign, and never on
 *   a vector answer.
 */
import { questionKey, storyFreeKey } from '../question-key';
import { sameQuestionKey, sameWorkingKey, shortHash } from '../same-question';
import { partMarks, answerPartsOnLines } from '../worksheet-question';
import type { GeneratedQuestion } from './types';

/** A built N5 question, as the guard and a sheet see it. */
export interface Q { questionLines: string[]; solutionSteps: string[]; stepMarks?: number[]; finalAnswer: string; variationId?: string }

// ── the pieces (AH's same-keys.ts, word for word where it can be) ──
const strip = (m: string) => m.replace(/\\[,;:! ]|\s+/g, '').replace(/\\(?:ldots|dots|cdots)/g, '').replace(/[.,;:]+$/, '');
/** The maths of a piece of text, each `$…$` piece in order, spaces and closing punctuation dropped. */
export const mathsOf = (s: string): string[] => [...s.matchAll(/\$([^$]*)\$/g)].map(m => strip(m[1])).filter(Boolean);
const proseNumbers = (s: string): string[] => (s.replace(/\$[^$]*\$/g, ' ').replace(/<[^>]+>/g, ' ').match(/-?\d+(?:\.\d+)?/g) ?? []).sort();
const textLines = (b: Q) => b.questionLines.filter(l => !l.startsWith('<svg'));
const svgText = (b: Q) => [...b.questionLines.filter(l => l.startsWith('<svg')).join('').matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map(m => m[1].trim()).filter(Boolean).sort();
/** The question's maths that says something: no lone letter or label, and a number or an "=" in it. */
export const questionMaths = (b: Q): string[] => mathsOf(textLines(b).join(' '))
  .filter(m => !/^[a-zA-Z]$/.test(m) && !/^[A-Z]{1,4}$/.test(m) && (/\d/.test(m) || m.includes('='))).sort();
/** The answer's maths, an "(or …)" alternative left out. */
export const answerMaths = (answer: string): string[] => mathsOf(answer.replace(/\(or\s*\$[^$]*\$\s*\)/g, ' ')).sort();
// an answer with no maths ("£900", "3,600 litres") is taken as its numbers (2025 P1 Q4's 20% and £720)
const answerOrNumbers = (a: string) => { const m = answerMaths(a); return m.length ? m : (a.replace(/<[^>]+>/g, ' ').replace(/(\d),(\d{3})/g, '$1$2').match(/-?\d+(?:\.\d+)?/g) ?? []); };

/** AH's MATHS key, with the figure's own text in it (N5's figures carry their data). */
export const mathsKey = (b: Q): string =>
  shortHash(`M:${questionMaths(b).join('|')}#${proseNumbers(textLines(b).join(' ')).join(',')}#${svgText(b).join(',')}#${answerOrNumbers(b.finalAnswer).join('|')}`);

/** The owner's "same question" test (`same-question.ts`): wording, then working. */
export function sameTestKeys(b: Q): string[] {
  const w = sameWorkingKey(b.questionLines, b.finalAnswer, b.solutionSteps);
  return [shortHash(`Q:${sameQuestionKey(b.questionLines, b.finalAnswer)}`), ...(w ? [shortHash(w)] : [])];
}

/**
 * N5's MATHS-AND-NUMBERS key: AH's maths key with N5's rulings. Renamed letters are the same question, so the question's
 * maths has its letters renamed, every order of the first three tried and the smallest kept (x and y swapped in a system
 * is the same system: 2015 P1 Q11 as 3x + 2y = 17 and as 2x + 3y = 17); a plain sum's terms in any order; and the answer
 * is its numbers, so a point and a pair of values are one answer (2015 P1 Q11 written as "two lines meet at T, find T").
 */
export const mathsNumbersKey = (b: Q): string => {
  const ms = questionMaths(b);
  const letters = [...new Set(ms.join(' ').replace(/\\[a-zA-Z]+/g, ' ').match(/[a-zA-Z]/g) ?? [])].slice(0, 3);
  const perms = (xs: string[]): string[][] => xs.length <= 1 ? [xs] : xs.flatMap((x, i) => perms([...xs.slice(0, i), ...xs.slice(i + 1)]).map(p => [x, ...p]));
  let named: string[] = [];
  for (const p of perms(letters)) {
    const swapped = ms.map(m => m.replace(/(?<!\\[a-zA-Z]*)[a-zA-Z]/g, c => { const i = letters.indexOf(c); return i < 0 ? c : `§${p.indexOf(c)}§`; }));
    // a plain sum's terms in any order (no brackets or commands): 3V0 + 2V1 = 17 and 2V1 + 3V0 = 17 are one
    const terms = (side: string) => (/[(){}\\^]/.test(side) ? side : side.replace(/^(?=[^+-])/, '+').split(/(?=[+-])/).sort().join(''));
    const k = swapped.map(m => m.replace(/§(\d)§/g, 'V$1').split('=').map(terms).join('=')).sort();
    if (!named.length || k.join('|') < named.join('|')) named = k;
  }
  const ans = (answerMaths(b.finalAnswer).join(' ').match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number).sort((x, y) => x - y);
  // only where the maths and the answer carry numbers: a vector pathway has none, and every pathway would be one key; and
  // only an answer of VALUES ("x = 7", "T(-2, 7)"): in an expression (1/3 a + 4/3 b) the sorted numbers lose which
  // number goes with which letter
  if (!ms.some(m => /\d/.test(m)) || !ans.length) return '';
  if (answerMaths(b.finalAnswer).some(a => /[a-zA-Z]/.test(a.replace(/^[a-zA-Z]=/, '').replace(/^[A-Z]\(/, '(').replace(/\\[a-zA-Z]+/g, '')))) return '';
  // a figure's NUMBERS (its data), not its letters, and not a label that repeats the question's maths (a graph labels
  // its lines with their equations)
  const figNumbers = (svgText(b).filter(t => !ms.includes(strip(t.replace(/−/g, '-')))).join(' ').replace(/−/g, '-').match(/-?\d+(?:\.\d+)?/g) ?? []).sort();
  return shortHash(`MN:${named.join('|')}#${proseNumbers(textLines(b).join(' ')).join(',')}#${figNumbers.join(',')}#${ans.join(',')}`);
};

const carriesNumbers = (b: Q) => /\d/.test([...questionMaths(b), ...proseNumbers(textLines(b).join(' ')), ...svgText(b)].join(' '));

/**
 * Every identity of a built question, each tagged with the rule it is. The story-free key and the maths key only where
 * the question carries numbers: without them each is its answer alone, and a vector pathway's u − v (into the shared
 * vertex) and v − u (2016 P2 Q3's BD, out of it) would be one answer to the story-free key, which renames letters in
 * order. The story-free key reads a spaced minus as a sign (2x² − 4x + 5 is not 2018 P1 Q8's 2x² + 4x + 5: a sign change
 * is a different question), and is never used on a vector answer (its letters are renamed in the answer's own order).
 */
export function identities(b: Q): [string, string][] {
  const mn = mathsNumbersKey(b), nums = carriesNumbers(b);
  return [
    ...(mn ? [['MN', mn] as [string, string]] : []),
    ['QK', shortHash(`QK:${questionKey({ questionLines: b.questionLines, finalAnswer: b.finalAnswer })}`)],
    ...(nums && !/\\mathbf/.test(b.finalAnswer) ? [['SF', shortHash(`SF:${storyFreeKey(b.questionLines.join('\n').replace(/[−–]/g, '-').replace(/-\s+(?=\d)/g, '-'), b.finalAnswer)}`)] as [string, string]] : []),
    ...sameTestKeys(b).map((k, i) => [i ? 'SW' : 'SQ', k] as [string, string]),
    ...(nums ? [['MK', mathsKey(b)] as [string, string]] : []),
    ...rulingKeys(b),
  ];
}

// ── the owner's look-alike rulings (2026-10-16, https://claude.ai/artifact/UWUx2p9MB722HVJ6NjnxBs, L1 to L10) ──
// Each key reads only the shape its ruling is about, and is empty for every other question. L6 (a cuboid's two lengths
// swapped when a part's answer changes, 2025 P2 Q8's M) and L8 (two numbers swapping roles, 2019 P2 Q4: 3.6 × 10⁻⁶ and
// 8% against 8 × 10⁻⁶ and 3.6%) were ruled DIFFERENT: no key may join them (`n5-not-the-paper` holds both pairs). L10 (a
// vector pathway with every arrow reversed) was ruled the same and the maths key already joins it.
const PM2 = /\\begin\{pmatrix\}([^\\]*?)\\\\\s*([^\\]*?)\\end\{pmatrix\}/g;
const allText = (b: Q) => textLines(b).join(' ');

/**
 * L1, "Same": (x + 7)² at x = 3 against 2024 P1 Q2's (x + 3)² at x = 7, both (3 + 7)² = 100 ("the working is one sum
 * either way"). A question that defines f(x) and asks for f at a number, and nothing else, is the sum it makes: the
 * number put in for x, then the owner's test (a sum's terms and a product's factors in any order).
 */
function substitutedKey(b: Q): string {
  const ms = questionMaths(b);
  if (ms.length !== 2) return '';
  const def = ms.map(m => /^([a-zA-Z])\(x\)=(.+)$/.exec(m)).find(Boolean);
  if (!def) return '';
  const at = ms.map(m => new RegExp(`^${def[1]}\\((-?\\d+(?:\\.\\d+)?)\\)$`).exec(m)).find(Boolean);
  if (!at) return '';
  const v = at[1].startsWith('-') ? `(${at[1]})` : at[1];
  // an x after a number or a bracket is a product (3x is 3 × 7)
  const sub = def[2].replace(/(?<![\\a-zA-Z])x(?![a-zA-Z])/g, (_x: string, i: number, s: string) => (/[\d)}]/.test(s[i - 1] ?? '') ? `\\times ${v}` : v));
  return shortHash(`L1:${sameQuestionKey([`$${sub}$`], b.finalAnswer)}#${proseNumbers(allText(b)).join(',')}#${svgText(b).join(',')}`);
}

/**
 * L2, "Same as pupil could just add whole number and fraction parts separately": 2⅘ + ⅓ against 2018 P1 Q1's 2⅓ + ⅘,
 * 2⅔ + 1¾ against 2026 P1 Q5's 2¾ + 1⅔. A sum of mixed numbers and fractions (nothing else in its maths) is its whole
 * numbers and its fractions, each as a set, and its answer.
 */
function mixedNumbersKey(b: Q): string {
  const pieces = mathsOf(allText(b)).filter(m => !/^[A-Z]{1,4}$/.test(m) && !/^[a-zA-Z]$/.test(m));
  if (!pieces.length) return '';
  const wholes: number[] = [], fracs: string[] = [];
  let mixed = 0;
  for (const p of pieces) for (const t of p.split('+')) {
    const m = /^(\d+)?\\[dt]?frac\{(\d+)\}\{(\d+)\}$/.exec(t);
    if (m) { if (m[1]) { wholes.push(+m[1]); mixed++; } fracs.push(`${m[2]}/${m[3]}`); continue; }
    if (/^\d+$/.test(t)) { wholes.push(+t); continue; }
    return '';
  }
  if (!mixed || wholes.length + fracs.length < 3) return '';
  return shortHash(`L2:${wholes.sort((x, y) => x - y).join(',')}#${fracs.sort().join(',')}#${proseNumbers(allText(b)).join(',')}#${svgText(b).join(',')}#${answerOrNumbers(b.finalAnswer).join('|')}`);
}

/**
 * L3, "Same": a vector question with every vector's x and y swapped, its answers swapped with them (2019 P1 Q10's
 * (6, −4) and (−1, 8) against (−4, 6) and (8, −1), its triangle drawn turned with them). Two-component vectors only. The
 * owner's test of the question as written and of it swapped, the smaller kept.
 */
function swappedComponentsKey(b: Q): string {
  // the vectors given in the question's words: vectors only drawn on a grid, swapped, are the paper's grid mirrored in
  // y = x, and a mirror image is a different question (the owner's ruling); there only the answer would be compared
  // (2015 P2 Q5's p + q read off the grid)
  if (!/\\begin\{pmatrix\}/.test(allText(b))) return '';
  const all = [...b.questionLines, b.finalAnswer].join(' ');
  const total = (all.match(/\\begin\{pmatrix\}/g) ?? []).length;
  if (!total || total !== (all.match(PM2) ?? []).length) return '';
  const swap = (s: string) => s.replace(PM2, (_m: string, x: string, y: string) => `\\begin{pmatrix}${y.trim()}\\\\ ${x.trim()}\\end{pmatrix}`);
  const k1 = sameQuestionKey(b.questionLines, b.finalAnswer), k2 = sameQuestionKey(b.questionLines.map(swap), swap(b.finalAnswer));
  return shortHash(`L3:${k1 < k2 ? k1 : k2}`);
}

/**
 * L4, "Same": vectors added with their y components swapped between them (2025 P1 Q13's p = (5, 2), q = (1, −3) against
 * p = (5, −3), q = (1, 2): p + q = (6, −1) from the same two sums, their terms in another order). A question that gives
 * vectors and asks for their plain sum, and nothing else, is each component's values as a set, and its answer.
 */
function vectorSumKey(b: Q): string {
  const all = mathsOf(allText(b));
  const sums = all.filter(m => /^\\mathbf\{[a-z]\}(?:\+\\mathbf\{[a-z]\})+$/.test(m));
  if (new Set(sums).size !== 1) return '';
  const names = [...sums[0].matchAll(/\\mathbf\{([a-z])\}/g)].map(m => m[1]);
  const defs = new Map<string, number[]>();
  for (const m of all) {
    const d = /^\\mathbf\{([a-z])\}=\\begin\{pmatrix\}(.*)\\end\{pmatrix\}$/.exec(m);
    // `mathsOf` leaves a row break as one backslash ("5\\ -3" loses its "\ ")
    if (d) defs.set(d[1], d[2].split(/\\+/).map(Number));
  }
  if (defs.size !== names.length || !names.every(n => defs.has(n))) return '';
  if (all.some(m => /\d/.test(m) && !/^\\mathbf\{[a-z]\}=\\begin\{pmatrix\}/.test(m))) return '';
  const rows = defs.get(names[0])!.length;
  if (names.some(n => defs.get(n)!.length !== rows || defs.get(n)!.some(Number.isNaN))) return '';
  const byRow = Array.from({ length: rows }, (_, r) => names.map(n => defs.get(n)![r]).sort((x, y) => x - y).join(','));
  return shortHash(`L4:${byRow.join('|')}#${proseNumbers(allText(b)).join(',')}#${svgText(b).join(',')}#${answerOrNumbers(b.finalAnswer).join('|')}`);
}

/** A quadratic in x written as a plain sum ("2x^{2}+4x+5"), as its a, b and c, or null. */
function quadraticCoefficients(e: string): [number, number, number] | null {
  const s = e.replace(/\^\{2\}/g, '^2').replace(/^(?=[^+-])/, '+');
  const terms = s.match(/[+-][^+-]+/g);
  if (!terms || terms.join('') !== s) return null;
  let a = 0, bb = 0, c = 0, m: RegExpExecArray | null;
  for (const t of terms) {
    const sign = t[0] === '-' ? -1 : 1;
    if ((m = /^[+-](\d*(?:\.\d+)?)x\^2$/.exec(t))) a += sign * (m[1] ? +m[1] : 1);
    else if ((m = /^[+-](\d*(?:\.\d+)?)x$/.exec(t))) bb += sign * (m[1] ? +m[1] : 1);
    else if ((m = /^[+-](\d+(?:\.\d+)?)$/.exec(t))) c += sign * +m[1];
    else return null;
  }
  return a ? [a, bb, c] : null;
}
/**
 * L5, "Same": a quadratic's a and c swapped when its discriminant is asked (2018 P1 Q8's 2x² + 4x + 5 against
 * 5x² + 4x + 2: 4² − 4 × 2 × 5 either way). Its b, its a and c as a set, and its answer.
 */
function discriminantKey(b: Q): string {
  if (!/nature of (?:the|its) roots|discriminant/i.test(flat(allText(b)))) return '';
  const quads = questionMaths(b).filter(m => /x\^\{?2\}?/.test(m));
  if (quads.length !== 1) return '';
  let e = quads[0].replace(/^(?:[a-zA-Z]\(x\)|y)=/, '');
  if (e.includes('=')) { const [l, r] = e.split('='); if (r !== '0') return ''; e = l; }
  const co = quadraticCoefficients(e);
  if (!co) return '';
  return shortHash(`L5:${co[1]}#${[co[0], co[2]].sort((x, y) => x - y).join(',')}#${proseNumbers(allText(b)).join(',')}#${flat(b.finalAnswer)}`);
}

/** Every number a question gives, in its words, its maths and its figure (a figure's number the text gives counted once). */
function givenNumbers(b: Q): number[] {
  const text = allText(b).replace(/\$\^\{?[23]\}?\$/g, ' ')
    .replace(/\b(\d+|one|two|three|four|five)\s+(decimal places?|significant figures?)/gi, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/(\d),(\d{3})(?!\d)/g, '$1$2').replace(/[−–]/g, '-');
  const inText = (text.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  const pool = [...inText];
  const fig = (svgText(b).join(' ').replace(/[−–]/g, '-').match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)
    .filter(n => { const i = pool.indexOf(n); if (i < 0) return true; pool.splice(i, 1); return false; });
  return [...inText, ...fig];
}
/**
 * L7, "Same": 2022 P2 Q11's cuboid (24 by 6 by 8, its space diagonal 26) asked as a vector's magnitude, (6, 8, 24). A
 * question that gives three numbers and nothing else, whose one answer is √(a² + b² + c²) of them, is that sum: its
 * three numbers as a set, and its answer.
 */
function threeSquaresKey(b: Q): string {
  // a component's sign is squared away: the owner's C2 "Same" (2026-10-17), a magnitude with its signs moved, so a vector
  // (-6, -8, -24) is the cuboid's 24, 6, 8 too
  const ns = givenNumbers(b).map(Math.abs);
  if (ns.length !== 3 || ns.some(n => n <= 0)) return '';
  const ans = (b.finalAnswer.replace(/<[^>]+>/g, ' ').replace(/(\d),(\d{3})(?!\d)/g, '$1$2').match(/-?\d+(?:\.\d+)?/g) ?? []);
  const a = ans[0];
  if (a === undefined || new Set(ans).size !== 1) return '';
  const dp = (a.split('.')[1] ?? '').length;
  if (Math.abs(+a - Math.hypot(...ns)) > 0.5 * 10 ** -dp + 1e-9) return '';
  return shortHash(`L7:${[...ns].sort((x, y) => x - y).join(',')}#${+a}`);
}

// ── the owner's answers on the audit's findings sheet (2026-10-17, https://claude.ai/artifact/TSw6UWy4n6RhKMVmQgEHL5) ──
// The independent audit (tools/n5-audit/report.md) found these "same" kinds drawn past the guard and sitting together on
// sheets. N1, N2, N10, N11, N12 and N14 are the same question, for the guard and for a sheet; N13, N14g, N15 and N16 are a
// paper with one part changed whose kept parts carry half its marks or more (P2), so for the guard only: on a sheet one
// part changed is still a different question (S1).

/**
 * N1, B2 "Yes" (L1 with negative numbers): (x + 5)² at −3 beside (x + 3)² at −5, both (±2)² = 4. f(x) = (x + a)² at b
 * is its a and b as a set, up to the sign of both (−a − b squared is a + b squared): L1's swap and its negative.
 */
function squareAtKey(b: Q): string {
  const ms = questionMaths(b);
  if (ms.length !== 2) return '';
  const def = ms.map(m => /^([a-zA-Z])\(x\)=\(x([+-]\d+(?:\.\d+)?)\)\^\{?2\}?$/.exec(m)).find(Boolean);
  if (!def) return '';
  const at = ms.map(m => new RegExp(`^${def[1]}\\((-?\\d+(?:\\.\\d+)?)\\)$`).exec(m)).find(Boolean);
  if (!at) return '';
  const a = Number(def[2]), v = Number(at[1]);
  const s1 = [a, v].sort((x, y) => x - y).join(','), s2 = [-a, -v].sort((x, y) => x - y).join(',');
  return shortHash(`N1:${s1 < s2 ? s1 : s2}#${proseNumbers(allText(b)).join(',')}#${answerOrNumbers(b.finalAnswer).join('|')}`);
}

/**
 * N2, B2 "Yes" (a power of a power with its powers swapped, with negative numbers): (x⁻³)² × x⁻⁸ beside (m⁻²)³ × m⁻⁸,
 * both x⁻⁶ × x⁻⁸. (v^a)^b is its powers' sizes as a set and the sign of their product.
 */
const POWER_OF_POWER = /\(([a-zA-Z])\^\{?(-?\d+)\}?\)\^\{?(-?\d+)\}?/g;
function powerOfPowerKey(b: Q): string {
  if (!/\)\^\{?-?\d+\}?/.test(allText(b))) return '';
  let found = false;
  const canon = (l: string) => l.replace(POWER_OF_POWER, (_m: string, v: string, p: string, q: string) => {
    found = true;
    const [lo, hi] = [Math.abs(+p), Math.abs(+q)].sort((x, y) => x - y);
    return `(${v}^{${lo}})^{${hi}}${+p * +q < 0 ? '^{-}' : ''}`;
  });
  const lines = b.questionLines.map(l => (l.startsWith('<svg') ? l : canon(l)));
  return found ? shortHash(`N2:${sameQuestionKey(lines, b.finalAnswer)}`) : '';
}

/**
 * N10, A4 "Yes" (the owner's L10 of 2026-10-16, built by structure): a vector pathway with EVERY arrow reversed is the
 * same question (2024 P2 Q14's ZW = a, ZX = b, find WX, against WZ = r, XZ = s, find XW: the same answer). The owner's
 * test of the question as written and of it with every named vector turned round, the smaller kept. Reversing only the
 * target, or only the given vectors, changes the answer's sign, so stays different (C3 "Different").
 */
const NAMED_VECTOR = /\\(?:overrightarrow|vec)\{([A-Z])([A-Z])\}/g;
// a relation between two named vectors, ED = 2AB, says the same with both turned round (DE = 2BA): written one way only
const RELATION = /\\(overrightarrow|vec)\{([A-Z])([A-Z])\}(\s*=\s*(?:\d+(?:\.\d+)?|\\frac\{\d+\}\{\d+\})?\s*)\\(overrightarrow|vec)\{([A-Z])([A-Z])\}/g;
function pathwayKey(b: Q): string {
  if ((allText(b).match(NAMED_VECTOR) ?? []).length < 2) return '';
  const turn = (l: string) => l.replace(NAMED_VECTOR, (m: string, p: string, q: string) => m.replace(`{${p}${q}}`, `{${q}${p}}`));
  const oneWay = (l: string) => l.replace(RELATION, (m: string, c1: string, p: string, q: string, mid: string, c2: string, r: string, s: string) =>
    (p < q ? m : `\\${c1}{${q}${p}}${mid}\\${c2}{${s}${r}}`));
  const text = (ls: string[]) => ls.map(l => (l.startsWith('<svg') ? l : oneWay(l)));
  const k1 = sameQuestionKey(text(b.questionLines), b.finalAnswer);
  const k2 = sameQuestionKey(text(b.questionLines.map(l => (l.startsWith('<svg') ? l : turn(l)))), b.finalAnswer);
  return shortHash(`N10:${k1 < k2 ? k1 : k2}`);
}

/**
 * N11, C1 "Yes same": 2016 P2 Q14's 2 tan x + 5 = −4 against 2 tan x + 4 = −5, both 2 tan x = −9. A trig equation
 * k f(x) ± p = q whose two numbers have opposite signs is the same with their sizes swapped and each sign left in place
 * (with like signs the swap changes the answer, and a sign change stays different: 7 sin x + 2 = 3 against
 * 7 sin x − 3 = −2, the owner's ruling of 2026-10-07). Its domain is in its answer.
 */
function trigSwapKey(b: Q): string {
  const ms = questionMaths(b);
  for (const m of ms) {
    const x = /^(\d*(?:\.\d+)?)\\(sin|cos|tan)x\^\{?\\circ\}?([+-])(\d+(?:\.\d+)?)=(-?\d+(?:\.\d+)?)$/.exec(m);
    if (!x) continue;
    const p = (x[3] === '-' ? -1 : 1) * Number(x[4]), q = Number(x[5]);
    if (!p || !q || Math.sign(p) === Math.sign(q)) return '';
    const sizes = [Math.abs(p), Math.abs(q)].sort((u, v) => u - v).join(',');
    // the domain's numbers count (one changed is a real change); < or ≤ at 360 does not (2026 P2 Q8's card says < 360,
    // 2016 P2 Q14 ≤ 360, the same two answers)
    const rest = ms.filter(o => o !== m).map(o => o.replace(/\\l[et]/g, '≤'));
    return shortHash(`N11:${x[1]}|${x[2]}|${sizes}|${Math.sign(p)}#${rest.join('|')}#${answerOrNumbers(b.finalAnswer).join('|')}`);
  }
  return '';
}

/**
 * N12, C2 "Same": a magnitude with its components' signs moved (2015 P2 Q4's (6, −13, 18) against (−6, 13, 18): every line
 * of working and the answer the same). A magnitude asked of one vector is its components' sizes as a set and its answer
 * (a surd answer too: 2026 P1 Q7's 3√10, which L7's numbers cannot read).
 */
function magnitudeKey(b: Q): string {
  if (!/magnitude/i.test(flat(allText(b)))) return '';
  const vs = [...allText(b).matchAll(/\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/g)];
  if (vs.length !== 1) return '';
  const comps = vs[0][1].split(/\\\\/).map(s => Math.abs(Number(s.trim().replace(/[−–]/g, '-'))));
  if (comps.length < 2 || comps.some(Number.isNaN)) return '';
  return shortHash(`N12:${comps.sort((x, y) => x - y).join(',')}#${flat(b.finalAnswer).replace(/\s+/g, '')}`);
}

/** A straight line written ax + by = c, as a, b and c, or null. */
function lineOf(m: string): [number, number, number] | null {
  const x = /^(-?\d*)x([+-])(\d*)y=(-?\d+(?:\.\d+)?)$/.exec(m);
  if (!x) return null;
  const num = (s: string) => (s === '' ? 1 : s === '-' ? -1 : Number(s));
  return [num(x[1]), (x[2] === '-' ? -1 : 1) * num(x[3]), Number(x[4])];
}

/**
 * N13, C4 "Same" (guard only): 2014 P1 Q11 on its own card with its 12 made −12, 4x + 3y = −12: (a)'s gradient, half the
 * marks, is the paper's. A line's gradient question is its x and y coefficients, its constant's size, and its answers'
 * sizes.
 */
function lineConstantKey(b: Q): string {
  if (!/gradient/i.test(flat(allText(b)))) return '';
  const lines = questionMaths(b).map(lineOf).filter(Boolean) as [number, number, number][];
  if (lines.length !== 1) return '';
  const [a, bb, c] = lines[0];
  const ans = (flat(b.finalAnswer).match(/\d+(?:\.\d+)?/g) ?? []).sort();
  return shortHash(`N13:${a}|${bb}|${Math.abs(c)}#${ans.join(',')}`);
}

/**
 * N14, C5 "Same": a line's x and y swapped (3x + 4y = 12 to the y-axis, (0, 3), against 2014 P1 Q11 (b)'s 4x + 3y = 12 to
 * the x-axis, (3, 0)). Where a line crosses an axis is that axis's coefficient, the other one, the constant and the value.
 * A one-part question is the same question (N14); a question with parts holding it has that part kept (N14g, guard only).
 */
function interceptKey(b: Q): [string, string] | null {
  const axis = /crosses the \$?([xy])\$?-axis/.exec(flat(allText(b)));
  if (!axis) return null;
  const lines = questionMaths(b).map(lineOf).filter(Boolean) as [number, number, number][];
  if (lines.length !== 1) return null;
  const [a, bb, c] = lines[0];
  const [on, other] = axis[1] === 'x' ? [a, bb] : [bb, a];
  if (!on) return null;
  return [letters(b).length >= 2 ? 'N14g' : 'N14', shortHash(`N14:${on}|${other}|${c}|${c / on}`)];
}

/** Each step's part letter (one part: ''), and each letter's marks with the total. */
function partMarksOf(b: Q): { of: string[]; marks: Map<string, number>; total: number } {
  const of = stepParts(b) ?? b.solutionSteps.map(() => '');
  const marks = new Map<string, number>();
  b.solutionSteps.forEach((_, i) => marks.set(of[i], (marks.get(of[i]) ?? 0) + (b.stepMarks?.[i] ?? 0)));
  return { of, marks, total: [...marks.values()].reduce((t, m) => t + m, 0) };
}

/**
 * N15, C6 "Same" (guard only): 2016 P1 Q7 (b), AV from A(2, 0, 0) and V(5, 2, 6), √(3² + 2² + 6²) = 7, 3 of its 4 marks:
 * its own card moves A and V together (the same 3, 2 and 6), and 2025 P2 Q8's cuboid card reaches √(2² + 3² + 6²) = 7.
 * A length worked as the root of three squares, in a part carrying half the question's marks or more, is those three
 * sizes as a set.
 */
function threeSquaresPartKey(b: Q): string {
  const { of, marks, total } = partMarksOf(b);
  if (!total) return '';
  for (let i = 0; i < b.solutionSteps.length; i++) {
    for (const m of mathsOf(b.solutionSteps[i])) {
      const x = /^[A-Z]{1,2}\^\{?2\}?=(.+?)(?:=\d+)?$/.exec(m);
      if (!x) continue;
      const terms = x[1].split('+');
      if (terms.length !== 3) continue;
      const sizes = terms.map(t => {
        const sq = /^\(?(-?\d+(?:\.\d+)?)\)?\^\{?2\}?$/.exec(t);
        if (sq) return Math.abs(Number(sq[1]));
        const r = Math.sqrt(Number(t));
        return /^\d+$/.test(t) && Number.isInteger(r) ? r : NaN;
      });
      if (sizes.some(Number.isNaN) || 2 * (marks.get(of[i]) ?? 0) < total) continue;
      // in any order: a cuboid's 2, 3, 6 against the pyramid's 3, 2, 6 is "same" (the owner, 2026-10-17, contact sheet
      // KEb5ZTCZhAm9LPxc5R7YqT), which also makes L6's pair (2025 P2 Q8's cuboid with two lengths swapped, "Different" on
      // 2026-10-16) the same question: the owner was told so on the card and answered "same"
      return shortHash(`N15:${sizes.sort((u, v) => u - v).join(',')}`);
    }
  }
  return '';
}

/**
 * N16, A8 "Yes" (guard only): 2024 P1 Q9's line D = −2T + 32 from its stated points, or with point B moved along it, or in
 * another story ("the paper's line, not just its points"), its (a) 3 of 4 marks. A line of best fit through points the
 * question STATES, in a part carrying half the marks or more, is that line's gradient and intercept. A line read off a
 * graph is left to the owner's B (the same line off another scattergraph is not the paper's part).
 */
function statedLineKey(b: Q): string {
  const t = flat(allText(b));
  if (!/line of best fit/i.test(t) || !/Point \$?[A-Z]\$? represents/.test(t)) return '';
  const { marks, total } = partMarksOf(b);
  const a = answerByPart(b).get('a')?.flatMap(answerMaths) ?? [];
  const line = a.map(m => /^[A-Za-z]=(-?(?:\\frac\{\d+\}\{\d+\}|\d+(?:\.\d+)?)?)[A-Za-z]([+-]\d+(?:\.\d+)?)?$/.exec(m)).find(Boolean);
  if (!line || !total || 2 * (marks.get('a') ?? 0) < total) return '';
  return shortHash(`N16:${line[1]}|${line[2] ?? '+0'}`);
}

/**
 * N17, A7 "Yes" (guard only): 2025 P1 Q15 shows x² − x − 6 = 0 and solves it to "length 9 cm, breadth 4 cm" (5 of its 6
 * marks); 2016 P1 Q12's card reaches the same equation and answers from a rectangle and a triangle, its area working
 * different and its (b) and (c) the paper's. A quadratic a part shows (= 0), with the answers of the parts from there on,
 * those parts carrying half the marks or more, is that equation and those answers.
 */
function shownQuadraticKey(b: Q): string {
  const ls = letters(b);
  if (ls.length < 2) return '';
  let cur = '', shown = '', eq = '';
  for (const l of textLines(b)) {
    const m = PART.exec(l);
    if (m) cur = m[1];
    const q = cur && /show that/i.test(flat(l)) ? mathsOf(l).find(x => /x\^\{?2\}?.*=0$/.test(x)) : undefined;
    if (q) { shown = cur; eq = q; }
  }
  if (!eq) return '';
  const { marks, total } = partMarksOf(b);
  const from = ls.slice(ls.indexOf(shown));
  if (!total || 2 * from.reduce((t, l) => t + (marks.get(l) ?? 0), 0) < total) return '';
  const ans = answerByPart(b);
  const nums = from.slice(1).flatMap(l => (ans.get(l) ?? []).flatMap(a => flat(a.replace(PART, '')).match(/-?\d+(?:\.\d+)?/g) ?? [])).sort();
  return nums.length ? shortHash(`N17:${sameQuestionKey([`$${eq}$`], '')}#${nums.join(',')}`) : '';
}

/** The ruling keys of a question (all but L9, which is for sheets only: `sheetOnlyKeys`). */
export function rulingKeys(b: Q): [string, string][] {
  const out: [string, string][] = [];
  for (const [tag, f] of [['L1', substitutedKey], ['L2', mixedNumbersKey], ['L3', swappedComponentsKey], ['L4', vectorSumKey], ['L5', discriminantKey], ['L7', threeSquaresKey],
    ['N1', squareAtKey], ['N2', powerOfPowerKey], ['N10', pathwayKey], ['N11', trigSwapKey], ['N12', magnitudeKey], ['N13', lineConstantKey], ['N15', threeSquaresPartKey], ['N16', statedLineKey], ['N17', shownQuadraticKey]] as const) {
    const k = f(b);
    if (k) out.push([tag, k]);
  }
  const ik = interceptKey(b);
  if (ik) out.push(ik);
  return out;
}

/**
 * L9, "Same", on a sheet only (neither is a paper's question): the same quadratic to 2 decimal places and to 2
 * significant figures (2024 P2 Q8's card and 2022 P2 Q7's card share 1,505 of about 1,538 equations). A quadratic
 * equation with a rounding instruction is its equation, whatever the rounding.
 */
export function sheetOnlyKeys(b: Q): [string, string][] {
  if (!/decimal place|significant figure/i.test(flat(allText(b)))) return [];
  if (!questionMaths(b).some(m => /x\^\{?2\}?/.test(m) && /=0$/.test(m))) return [];
  return [['L9', shortHash(`L9:${sameQuestionKey(b.questionLines, '')}`)]];
}

/**
 * A question's twin keys for a sheet (`twinKeysOf` in `worksheet-question.ts` for N5): the owner's test (the wording and
 * the working, as before), the maths keys, the ruling keys, and the sheet-only L9. The question key and the story-free
 * key a sheet already takes from the site question itself (`keysOfQuestion`).
 */
// N13, N14g, N15 and N16 are one part changed (guard only, P2): on a sheet that is still a different question (S1)
const TWIN_TAGS = new Set(['SQ', 'SW', 'MK', 'MN', 'L1', 'L2', 'L3', 'L4', 'L5', 'L7', 'N1', 'N2', 'N10', 'N11', 'N12', 'N14']);
export function n5TwinKeys(b: Q): string[] {
  return [...identities(b).filter(([t]) => TWIN_TAGS.has(t)), ...sheetOnlyKeys(b)].map(([, k]) => k);
}

// ── parts, N5's way ──
// N5 marks its parts "<strong>(a)</strong>" in the question and numbers its working: a step belongs to the part whose
// marks it falls in, counting the step marks against the part marks the site prints (`partMarks`), in order. Where they
// do not line up exactly, the question has no parts here (it is compared whole).
const PART = /^\s*(?:<b>|<strong>)?\s*\(([a-h])\)/;
const flat = (s: string) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const stepNo = (s: string) => s.replace(/^\s*(?:<strong>)?\s*\d+\.\s*(?:<\/strong>)?\s*/, '');
/** The letters a question asks, in order. */
function letters(b: Q): string[] {
  const out: string[] = [];
  for (const l of textLines(b)) { const m = PART.exec(l); if (m && !out.includes(m[1])) out.push(m[1]); }
  return out;
}
/** Each step's part, or null when the working cannot be cut into the question's parts exactly. */
export function stepParts(b: Q): string[] | null {
  const ls = letters(b);
  if (ls.length < 2) return null;
  // steps that name their part ("<strong>1. (b)(i)</strong>"): a roman belongs to its letter; a step naming only a roman
  // ("(ii)") carries the letter before it
  let last = '';
  const labelled = b.solutionSteps.map(s => {
    const m = /^\s*(?:<strong>|<b>)?\s*(?:\d+\.\s*)?\(([a-h])\)/.exec(s);
    if (m) return (last = m[1]);
    return /^\s*(?:<strong>|<b>)?\s*(?:\d+\.\s*)?\((?:i{1,3}|iv|v)\)/.test(s) && last ? last : undefined;
  });
  if (labelled.every(Boolean) && ls.every(l => labelled.includes(l))) return labelled as string[];
  let split = partMarks(b as GeneratedQuestion);
  const sm = b.stepMarks ?? [];
  // the site prints a mark for each roman ("(a) (i)", "(a) (ii)", or "(i) a and (ii) b" inside a letter's line): fold them
  if (split && split.length > ls.length) {
    const romans = new Map<string, Set<string>>(); let cur = '';
    for (const l of textLines(b)) { const m = PART.exec(l); if (m) cur = m[1]; for (const r of l.matchAll(/\((i{1,3}|iv|v)\)/g)) if (cur) romans.set(cur, (romans.get(cur) ?? new Set()).add(r[1])); }
    const counts = ls.map(l => Math.max(1, romans.get(l)?.size ?? 0));
    if (counts.reduce((a, c) => a + c, 0) === split.length) { const s = split; let k = 0; split = counts.map(c => { let t = 0; for (let i = 0; i < c; i++) t += s[k++]; return t; }); }
  }
  if (!split || split.length !== ls.length || sm.length !== b.solutionSteps.length) return null;
  const out: string[] = []; let j = 0, cum = 0, bound = split[0];
  for (let i = 0; i < sm.length; i++) {
    if (cum >= bound && j < split.length - 1 && sm[i] > 0) { j++; bound += split[j]; }
    out.push(ls[j]); cum += sm[i];
    if (cum > bound) return null;
  }
  return cum === bound && j === split.length - 1 ? out : null;
}
const answerByPart = (b: Q): Map<string, string[]> => {
  const m = new Map<string, string[]>();
  for (const l of answerPartsOnLines(b.finalAnswer).split('<br>')) { const x = PART.exec(l); if (x) m.set(x[1], [...(m.get(x[1]) ?? []), l]); }
  return m;
};

/** A part as its own lines (with the stem), its WORKING and its answer, and its marks (AH `sheetPartsOf`). */
export interface SheetPart { letter: string; key: string; marks: number }
// a line, a step or an answer as its maths and its numbers, not its words: the same numbers in another story are the same
// question (2014 P1 Q13's flare draws hold the paper's (a) by working)
const mn = (s: string) => `${mathsOf(s).join('|')}#${proseNumbers(s).join(',')}`;
// A part's maths CANONICAL (A0's audit, 2026-10-17: the literal pieces let the paper's part through written another way:
// 2014 P2 Q10 (a)'s cos K = (11² + 8² − 13²)/(2 × 11 × 8) as cos S = (8² + 11² − 13²)/(2 × 8 × 11), 2025 P1 Q7 (b) with
// f(a) for f(p)). Each piece by the owner's test (a sum's terms and a product's factors in any order, letters renamed); a
// name standing alone on one side of "=" (an angle JKL, a side AV², cos K) is a name; working is its equations and
// expressions, a lone label or number (an explanation's "the angle at S, opposite 13") dropped.
const NAME_SIDE = /^(?:\\(?:sin|cos|tan))?[A-Z]{1,3}(?:\^\{?2\}?)?$/;
const canonPiece = (m: string) => m.split('=').map(side => (NAME_SIDE.test(side) ? 'N' : sameQuestionKey([`$${side}$`], ''))).join('=');
// a LIST of numbers in the step's words counts too (four or more: a data question's sorted list; 2023 P1 Q9's card drew
// other data with the paper's median and IQR, 1 in 400, and was taken for the paper without it); an explanation's one
// or two ("between the sides of 8 and 11 metres") does not
const workOf = (s: string) => {
  const ms = mathsOf(s).filter(m => /[=+\-\\^×]/.test(m) && !/^-?\d+(?:\.\d+)?$/.test(m)).map(canonPiece);
  const all = proseNumbers(s.replace(/&nbsp;/g, ' '));
  const ws = all.length >= 4 ? all : [];
  return ms.length || ws.length ? `${ms.join('|')}#${ws.join(',')}` : '';
};
const answerOf = (s: string) => {
  const ms = mathsOf(s);
  return (ms.length ? ms.map(canonPiece) : (flat(s).replace(/(\d),(\d{3})/g, '$1$2').match(/-?\d+(?:\.\d+)?/g) ?? [])).join('|');
};
const lineOfPart = (s: string) => `${mathsOf(s).filter(m => !/^[A-Za-z]{1,3}$/.test(m)).map(canonPiece).join('|')}#${proseNumbers(s).join(',')}`;
/**
 * A question's parts. `withStem` (a sheet): each part under the question's opening lines. Without it (the guard's own-paper
 * rule): a part as its working and answer alone, whatever the lines say, and with `figure` under the question's figure:
 * the owner's "B" (2026-10-16), a part READ OFF A GRAPH is the paper's only on the paper's own graph (under AH's rule as
 * written, three 1 + 1 mark graph cards lost a third of their questions to the same b read off another curve).
 */
// The paper's own graph. A figure that labels a point with its coordinates shows its data, so it is the paper's graph when
// it shows the paper's numbers, whoever draws it and at whatever scale (2023 P1 Q4's parabola, turning point (3, 2), drawn
// by a sister card that marks another point: the owner's "Yes", card 4, "consistent with B, since the parabola is the
// paper's own curve"; the two cards' strings of points differ). A figure labelled only on its axes shows its curve by the
// drawing alone, so it is the paper's graph only when it is drawn the same: 2023 P1 Q13's y = cos(x − 30) + 1 and a draw's
// y = cos(x − 180) + 1 carry the same axis numbers, and are the same b read off another curve, which B keeps.
// Only a GRAPH: B is about a part read off a graph. A figure that is a diagram (a sector, a rhombus, a plan) is not
// compared at all, as AH's rule: a part as its working and answer (13(f), 2026-10-16: keyed by its drawing, 2019 P2 Q12's
// (b), 2024 P2 Q14's (b) and 2026 P2 Q13's (c) came through, the diagram redrawn with renamed letters or the opening
// line's other number). A graph labels its axes: x and y, or the origin O with an axis letter, or the question says so.
const isGraph = (b: Q) => {
  const ls = svgText(b);
  return (ls.includes('x') && ls.includes('y')) || (ls.includes('O') && ls.some(l => /^[a-z]$/.test(l)))
    || /\b(?:graph|scattergraph)\b/i.test(flat(allText(b)));
};
const figureKey = (b: Q) => {
  if (!isGraph(b)) return '';
  const t = svgText(b).join(' ').replace(/[−–]/g, '-');
  if (/\(\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*\)/.test(t)) return `nums:${(t.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number).sort((x, y) => x - y).join(',')}`;
  return b.questionLines.filter(l => l.startsWith('<svg')).map(l => shortHash(l)).join('§');
};
export function sheetPartsOf(b: Q, withStem = true, figure = false): SheetPart[] {
  const sp = stepParts(b);
  if (!sp) return [];
  const stem: string[] = [], lines = new Map<string, string[]>();
  const add = (l: string, xs: string[]) => lines.set(l, [...(lines.get(l) ?? []), ...xs]);
  let letter = '', figs: string[] = [];
  for (const l of b.questionLines) {
    const m = PART.exec(l);
    if (m) { letter = m[1]; add(letter, figs); figs = []; }
    // the figure whole, as AH (a graph whose curve is the data differs when the curve does, whatever its labels)
    const fig = l.startsWith('<svg') ? `svg:${shortHash(l)}` : '';
    if (!letter) stem.push(fig || lineOfPart(l));
    else if (fig) figs.push(fig);
    else add(letter, [lineOfPart(l.replace(PART, ''))]);
  }
  if (letter) add(letter, figs);
  const ans = answerByPart(b);
  const work = new Map<string, string[]>(), marks = new Map<string, number>();
  b.solutionSteps.forEach((s, i) => {
    const l = sp[i];
    work.set(l, [...(work.get(l) ?? []), workOf(stepNo(s).replace(/^\s*(?:<\/strong>)?\s*(?:\([a-h]\))?(?:\((?:i{1,3}|iv|v)\))?(?:<\/strong>)?/, ''))]);
    marks.set(l, (marks.get(l) ?? 0) + (b.stepMarks?.[i] ?? 0));
  });
  const st = withStem ? stem.join('§') : figure ? figureKey(b) : '';
  const own = (l: string) => (withStem ? (lines.get(l) ?? []).join('§') : '');
  return [...ans.keys()].map(l => ({
    letter: l,
    key: shortHash(`${st}¶${own(l)}¶${(work.get(l) ?? []).filter(Boolean).join('§')}¶${(ans.get(l) ?? []).map(a => answerOf(a.replace(PART, ''))).join('§')}`),
    marks: marks.get(l) ?? 0,
  }));
}
/**
 * **Sheets that feel distinct** (point 9, settled for every course; for N5 measured 2026-10-14: 50 of 1,160 sheets
 * repeated parts, 0 with this, none shorter): a question's parts as one key a sheet's `exclude` can carry, and back.
 * `n5parts:<key>*<marks>,…`, for questions of two parts or more. Its own prefix, so AH's sheets (`parts:`) never read
 * an N5 question's parts, nor N5's an AH question's.
 */
export const N5_PARTS_PREFIX = 'n5parts:';
/**
 * Parts compared WITHOUT the opening lines, by card: a part that reads only some of the given facts is the same part
 * whatever the others say. 2026 P1 Q11 (the owner's "Yes", 2026-10-17, https://claude.ai/artifact/4z24ErrSJkuGJaNxAxXXQy
 * card 2): (a) G takes its x from H and its y from B, so B's height can change and (a) is still G(16, 18, 0); keyed by its
 * working and answer alone, a second one waits aside while fresh questions remain. Sheets only, never the guard.
 */
const PARTS_WITHOUT_STEM: Record<string, string[]> = { 'coords.lettered-cuboid': ['a'] };
export const n5PartsKeyOf = (b: Q): string | undefined => {
  let ps = sheetPartsOf(b);
  const bare = PARTS_WITHOUT_STEM[b.variationId ?? ''];
  if (bare) {
    const free = new Map(sheetPartsOf(b, false).map(p => [p.letter, p.key]));
    ps = ps.map(p => (bare.includes(p.letter) && free.has(p.letter) ? { ...p, key: free.get(p.letter)! } : p));
  }
  return ps.length > 1 ? `${N5_PARTS_PREFIX}${ps.map(p => `${p.key}*${p.marks}`).join(',')}` : undefined;
};
export const n5PartsFromKey = (k: string): { key: string; marks: number }[] =>
  k.slice(N5_PARTS_PREFIX.length).split(',').map(s => { const [key, m] = s.split('*'); return { key, marks: Number(m) }; });

/**
 * A ONE-part question as a part: its whole working and answer, keyed as `sheetPartsOf(b, false, figure)` keys a part, so
 * it can be found among a paper's parts (the owner's "Yes", card 4: a one-part card asking 2025 P1 Q7's part (b),
 * f(a) = 19 for f(x) = 3x + 7, 2 of its 3 marks). Empty for a question with parts.
 */
export function wholeAsPart(b: Q, figure = false): { key: string; marks: number } | null {
  if (letters(b).length >= 2) return null;
  const st = figure ? figureKey(b) : '';
  const work = b.solutionSteps.map(s => workOf(stepNo(s).replace(/^\s*(?:<\/strong>)?\s*(?:\([a-h]\))?(?:\((?:i{1,3}|iv|v)\))?(?:<\/strong>)?/, ''))).filter(Boolean);
  return { key: shortHash(`${st}¶¶${work.join('§')}¶${answerOf(b.finalAnswer.replace(PART, ''))}`), marks: (b.stepMarks ?? []).reduce((t, m) => t + m, 0) };
}
/** Do two questions share parts worth half the marks of either, or more? */
export function sharesHalf(x: readonly { key: string; marks: number }[], y: readonly { key: string; marks: number }[]): boolean {
  const kx = new Set(x.map(p => p.key)), ky = new Set(y.map(p => p.key));
  const half = (ps: readonly { key: string; marks: number }[], other: Set<string>) => {
    const tot = ps.reduce((t, p) => t + p.marks, 0);
    return tot > 0 && 2 * ps.filter(p => other.has(p.key)).reduce((t, p) => t + p.marks, 0) >= tot;
  };
  return half(x, ky) || half(y, kx);
}

/** A part for P2 across cards: its own maths in the question and in its answer, and its marks (AH `partsOf`). */
export interface PartMaths { letter: string; q: string[]; a: string[]; marks: number }
/**
 * N5's rulings on a part's maths: renamed letters are the same question ((x − p)² + q for (x − a)² + b), and "f(x) =" is
 * "y =" (2024 P1 Q12's one-part card held the paper's (a) and (b) that way). Letters other than x and y are one letter;
 * a command (\frac) is left alone.
 */
export const n5Maths = (m: string) => m.replace(/^[a-zA-Z]\(x\)=/, 'y=').replace(/(?<![\\a-zA-Z])([a-zA-Z])(?![a-zA-Z])/g, c => (c === 'x' || c === 'y' ? c : 'L'));
export function partsMaths(b: Q): PartMaths[] {
  const sp = stepParts(b); if (!sp) return [];
  const q = new Map<string, string[]>(); let letter = '';
  for (const l of textLines(b)) { const m = PART.exec(l); if (m) letter = m[1]; if (letter) q.set(letter, [...(q.get(letter) ?? []), ...mathsOf(l).filter(x => /\d|=|\\/.test(x)).map(n5Maths)]); }
  const a = new Map<string, string[]>();
  for (const [l, xs] of answerByPart(b)) a.set(l, xs.flatMap(answerMaths).map(n5Maths));
  const marks = new Map<string, number>();
  b.solutionSteps.forEach((_, i) => marks.set(sp[i], (marks.get(sp[i]) ?? 0) + (b.stepMarks?.[i] ?? 0)));
  return [...a.keys()].map(l => ({ letter: l, q: q.get(l) ?? [], a: a.get(l) ?? [], marks: marks.get(l) ?? 0 }));
}
/** A draw's maths as sets, made once and compared with every paper's parts. */
export interface Held { qs: Set<string>; as: Set<string> }
export const heldOf = (b: Q): Held => ({
  qs: new Set([...questionMaths(b), ...mathsOf(textLines(b).join(' '))].map(n5Maths)),
  as: new Set(answerMaths(answerPartsOnLines(b.finalAnswer)).map(n5Maths)),
});
/**
 * The marks of a paper's parts a draw holds word for word (P2 across cards). A part with nothing of its own to match (no
 * maths in its question, or no answer piece with a number of four or more characters) never counts.
 */
const real = (p: PartMaths) => p.q.length > 0 && p.a.some(s => /\d/.test(s) && s.length >= 4);
export const marksHeld = (paper: readonly PartMaths[], held: Held): number =>
  paper.reduce((t, p) => t + (real(p) && p.q.every(s => held.qs.has(s)) && p.a.every(s => held.as.has(s)) ? p.marks : 0), 0);
