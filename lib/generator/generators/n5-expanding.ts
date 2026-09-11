import { GeneratedQuestion } from './types';
import { getRandomInt, nonZeroInt } from './utils';

/**
 * National 5 Expanding Brackets.
 *
 * The specification is unusually precise here, naming four forms:
 *   a(bx+c) + d(ex+f),  ax(bx+c),  (ax+b)(cx+d),  (ax+b)(cx^2+dx+e)
 * with every coefficient an integer.
 *
 * Zeta covers the same ground as three skills — single bracket, two brackets by
 * FOIL, and "every term in the first bracket must multiply every term in the
 * second" — and practice drills the two simplest, which the papers never ask on
 * their own.
 *
 * The papers ask the two hardest: a binomial times a trinomial (2022 P2 Q1,
 * 2024 P1 Q3, 2026 P1 Q1) and a product plus a single bracket (2018 P1 Q2,
 * 2023 P1 Q2, 2025 P1 Q2).
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
/**
 * `x` ten times in eleven, `y` once, and never `p`.
 *
 * That is exactly what the eleven paper questions tagged *Expanding brackets*
 * do - x:10, y:1 - so the weighting is theirs rather than a preference. `p`
 * appeared in a third of our draws and in none of the papers.
 *
 * Written as a weighted list rather than a set, because the set was never the
 * problem: a pupil meeting `p(p+3)` once in three has met a question the exam
 * does not set, even though `p` is a perfectly good letter.
 * See `__checks__/variables.ts`.
 */
const VARS = ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'y'];
type Q = Omit<GeneratedQuestion, 'topic'>;

// ── polynomials as coefficients, index = power ─────────────────────────────

export type Poly = number[];

const addP = (a: Poly, b: Poly): Poly => {
  const out: Poly = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) out[i] = (a[i] ?? 0) + (b[i] ?? 0);
  return out;
};

const mulP = (a: Poly, b: Poly): Poly => {
  const out: Poly = new Array(a.length + b.length - 1).fill(0);
  a.forEach((ai, i) => b.forEach((bj, j) => { out[i + j] += ai * bj; }));
  return out;
};

const scaleP = (a: Poly, k: number): Poly => a.map(c => c * k);

/** "6x^3 + 11x^2 - 13x + 2", dropping zero terms and coefficients of 1. */
export function fmt(p: Poly, v: string): string {
  const parts: string[] = [];
  for (let i = p.length - 1; i >= 0; i--) {
    const c = p[i];
    if (!c) continue;
    const mag = Math.abs(c);
    const body = i === 0 ? `${mag}`
      : `${mag === 1 ? '' : mag}${v}${i === 1 ? '' : `^{${i}}`}`;
    parts.push(parts.length === 0
      ? (c < 0 ? `-${body}` : body)
      : (c < 0 ? ` - ${body}` : ` + ${body}`));
  }
  return parts.length ? parts.join('') : '0';
}

/** "(3x - 2)" from coefficients, for writing the question. */
export const bracket = (p: Poly, v: string): string => `(${fmt(p, v)})`;

/** A signed multiplier as it is written in front of a bracket: "-2", "5". */
const coeffTex = (k: number): string => (k === 1 ? '' : k === -1 ? '-' : `${k}`);

const EXPAND = 'Expand and simplify';

// ── skill: one bracket — Zeta "3(x+4) = 3x+12" ────────────────────────────

function single(): Q {
  const v = pick(VARS);
  const a = nonZeroInt(-9, 9);
  const b = nonZeroInt(1, 6);
  const c = nonZeroInt(-9, 9);
  const inner: Poly = [c, b];
  const result = scaleP(inner, a);
  return {
    subTopic: 'Expanding a Single Bracket',
    difficulty: 'skill',
    variationId: 'expanding.single',
    questionLines: [`Expand $${coeffTex(a)}${bracket(inner, v)}$`],
    boardQuestionLines: [`$${coeffTex(a)}${bracket(inner, v)}$`],
    solutionSteps: [
      `<strong>1.</strong> Multiply each term inside the bracket by $${a}$:<br><br>$${a} \\times ${b === 1 ? v : `${b}${v}`} = ${fmt([0, a * b], v)}$ and $${a} \\times ${c > 0 ? c : `(${c})`} = ${a * c}$`,
      `<strong>2.</strong> Write the result:<br><br>$${fmt(result, v)}$`,
    ],
    finalAnswer: `$${fmt(result, v)}$`,
  };
}

// ── skill: two single brackets — spec "a(bx+c) + d(ex+f)", practice ───────

function twoSingles(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const v = pick(VARS);
    const a = nonZeroInt(-6, 6), b = nonZeroInt(1, 5), c = nonZeroInt(-9, 9);
    const d = nonZeroInt(-6, 6), e = nonZeroInt(1, 5), f = nonZeroInt(-9, 9);
    const result = addP(scaleP([c, b], a), scaleP([f, e], d));
    if (!result[1] || !result[0]) continue;      // both terms must survive
    return {
      subTopic: 'Expanding Two Single Brackets',
      difficulty: 'skill',
      variationId: 'expanding.two-singles',
      questionLines: [
        `Multiply out the brackets and collect like terms:`,
        `$${coeffTex(a)}${bracket([c, b], v)} ${d < 0 ? '-' : '+'} ${coeffTex(Math.abs(d))}${bracket([f, e], v)}$`,
      ],
      boardQuestionLines: [
        `$${coeffTex(a)}${bracket([c, b], v)} ${d < 0 ? '-' : '+'} ${coeffTex(Math.abs(d))}${bracket([f, e], v)}$`,
      ],
      solutionSteps: [
        `<strong>1.</strong> Expand each bracket:<br><br>$${fmt(scaleP([c, b], a), v)}$ and $${fmt(scaleP([f, e], d), v)}$`,
        `<strong>2.</strong> Collect like terms:<br><br>$${fmt(result, v)}$`,
      ],
      finalAnswer: `$${fmt(result, v)}$`,
    };
  }
  throw new Error('expanding.two-singles: no valid question found');
}

// ── skill: a term outside — spec "ax(bx+c)", practice "6x(-2x+3)" ─────────

function monomial(): Q {
  const v = pick(VARS);
  const a = nonZeroInt(-8, 8);
  const b = nonZeroInt(-5, 5);
  const c = nonZeroInt(-9, 9);
  const result = mulP([0, a], [c, b]);
  return {
    subTopic: 'Expanding with a Term Outside',
    difficulty: 'skill',
    variationId: 'expanding.monomial',
    questionLines: [`Expand $${coeffTex(a)}${v}${bracket([c, b], v)}$`],
    boardQuestionLines: [`$${coeffTex(a)}${v}${bracket([c, b], v)}$`],
    solutionSteps: [
      `<strong>1.</strong> Multiply each term inside the bracket by $${coeffTex(a)}${v}$:<br><br>$${coeffTex(a)}${v} \\times ${fmt([0, b], v)} = ${fmt([0, 0, a * b], v)}$`,
      `<strong>2.</strong> And the constant term:<br><br>$${coeffTex(a)}${v} \\times ${c > 0 ? c : `(${c})`} = ${fmt([0, a * c], v)}$`,
      `<strong>3.</strong> Write the result:<br><br>$${fmt(result, v)}$`,
    ],
    finalAnswer: `$${fmt(result, v)}$`,
  };
}

// ── skill: two binomials — spec "(ax+b)(cx+d)", Zeta FOIL ────────────────

function twoBinomials(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const v = pick(VARS);
    const a = nonZeroInt(1, 4), b = nonZeroInt(-9, 9);
    const c = nonZeroInt(1, 4), d = nonZeroInt(-9, 9);
    const result = mulP([b, a], [d, c]);
    if (!result[1]) continue;                    // a vanishing middle term is a giveaway
    return {
      subTopic: 'Expanding Two Brackets',
      difficulty: 'skill',
      variationId: 'expanding.two-binomials',
      questionLines: [`${EXPAND} $${bracket([b, a], v)}${bracket([d, c], v)}$`],
      boardQuestionLines: [`$${bracket([b, a], v)}${bracket([d, c], v)}$`],
      solutionSteps: [
        `<strong>1.</strong> Multiply every term in the first bracket by every term in the second:<br><br>$${fmt([0, 0, a * c], v)} ${a * d < 0 ? '-' : '+'} ${Math.abs(a * d)}${v} ${b * c < 0 ? '-' : '+'} ${Math.abs(b * c)}${v} ${b * d < 0 ? '-' : '+'} ${Math.abs(b * d)}$`,
        `<strong>2.</strong> Collect the like terms:<br><br>$${fmt(result, v)}$`,
      ],
      // 2014 P1 Q2: •¹ any three terms correct, •² fourth term and collect
      stepMarks: [1, 1],
      finalAnswer: `$${fmt(result, v)}$`,
    };
  }
  throw new Error('expanding.two-binomials: no valid question found');
}

// ── shape: binomial times trinomial — 2022 P2 Q1, 2024 P1 Q3, 2026 P1 Q1 ─
//
// The third mark requires the collected terms to include a term in x^3, and in
// 2017 and 2022 additionally a negative coefficient. So the parameters cannot
// all be positive.

function binomialTrinomial(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const v = pick(VARS);
    const a = nonZeroInt(1, 3), b = nonZeroInt(-6, 6);
    const c = nonZeroInt(1, 3), d = nonZeroInt(-6, 6), e = nonZeroInt(-6, 6);
    const result = mulP([b, a], [e, d, c]);
    if (!result[3]) continue;                             // must have the cubic term
    if (!result.some(k => k < 0)) continue;               // and a negative coefficient
    if (result.some(k => Math.abs(k) > 60)) continue;     // keep it to paper scale
    return {
      subTopic: 'Expanding a Trinomial',
      difficulty: 'exam',
      variationId: 'expanding.binomial-trinomial',
      questionLines: [`${EXPAND} $${bracket([b, a], v)}${bracket([e, d, c], v)}$`],
      boardQuestionLines: [`$${bracket([b, a], v)}${bracket([e, d, c], v)}$`],
      solutionSteps: [
        `<strong>1.</strong> Multiply the trinomial by $${fmt([0, a], v)}$:<br><br>$${fmt(mulP([0, a], [e, d, c]), v)}$`,
        `<strong>2.</strong> Multiply the trinomial by $${b > 0 ? b : `(${b})`}$:<br><br>$${fmt(mulP([b], [e, d, c]), v)}$`,
        `<strong>3.</strong> Add the two and collect like terms:<br><br>$${fmt(result, v)}$`,
      ],
      // •¹ start to expand, •² complete the expansion, •³ collect like terms
      stepMarks: [1, 1, 1],
      finalAnswer: `$${fmt(result, v)}$`,
    };
  }
  throw new Error('expanding.binomial-trinomial: no valid question found');
}

// ── shape: a product plus a single bracket — 2018 P1 Q2, 2023 P1 Q2, 2025 P1 Q2 ─

function productPlusBracket(): Q {
  const squared = getRandomInt(1, 3) === 1;      // 2023 uses (x+7)^2
  for (let tries = 0; tries < 400; tries++) {
    const v = pick(VARS);
    const a = squared ? 1 : nonZeroInt(1, 3);
    const b = nonZeroInt(-9, 9);
    const c = squared ? a : nonZeroInt(1, 3);
    const d = squared ? b : nonZeroInt(-9, 9);
    const k = nonZeroInt(-7, 7);
    const quadratic = getRandomInt(0, 1) === 1;  // 2018/2023 add k(x^2 + m)
    const second: Poly = quadratic ? [nonZeroInt(-10, 10), 0, 1] : [nonZeroInt(-9, 9), nonZeroInt(1, 4)];
    const result = addP(mulP([b, a], [d, c]), scaleP(second, k));
    if (!result[2] || !result[1] || !result[0]) continue;   // every term should survive
    if (result.some(x => Math.abs(x) > 60)) continue;

    const first = squared
      ? `${bracket([b, a], v)}^{2}`
      : `${bracket([b, a], v)}${bracket([d, c], v)}`;
    return {
      subTopic: 'Expanding and Collecting',
      difficulty: 'exam',
      variationId: 'expanding.product-plus',
      questionLines: [
        `${EXPAND} $${first} ${k < 0 ? '-' : '+'} ${coeffTex(Math.abs(k))}${bracket(second, v)}$`,
      ],
      boardQuestionLines: [
        `$${first} ${k < 0 ? '-' : '+'} ${coeffTex(Math.abs(k))}${bracket(second, v)}$`,
      ],
      solutionSteps: [
        `<strong>1.</strong> Expand the product:<br><br>$${first} = ${fmt(mulP([b, a], [d, c]), v)}$`,
        `<strong>2.</strong> Expand the single bracket:<br><br>$${coeffTex(k)}${bracket(second, v)} = ${fmt(scaleP(second, k), v)}$`,
        `<strong>3.</strong> Collect like terms:<br><br>$${fmt(result, v)}$`,
      ],
      // •¹ start expansion, •² complete expansion, •³ collect like terms
      stepMarks: [1, 1, 1],
      finalAnswer: `$${fmt(result, v)}$`,
    };
  }
  throw new Error('expanding.product-plus: no valid question found');
}

export const EXPANDING_GENERATORS: Record<string, () => Q> = {
  'Expanding a Single Bracket': single,
  'Expanding Two Single Brackets': twoSingles,
  'Expanding with a Term Outside': monomial,
  'Expanding Two Brackets': twoBinomials,
  'Expanding a Trinomial': binomialTrinomial,
  'Expanding and Collecting': productPlusBracket,
};
