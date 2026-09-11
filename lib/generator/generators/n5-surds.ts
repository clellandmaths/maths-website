import { GeneratedQuestion } from './types';
import { getRandomInt, gcd } from './utils';

/**
 * National 5 Surds.
 *
 * Skill axis (Zeta): simplifying, add/subtract, multiply/divide, rationalise.
 * Shape axis (papers): expanding a bracket, and rationalising through function
 * notation.
 *
 * The specification names only two skills — "simplification, rationalising
 * denominators" — but the exam never asks add/subtract or multiply/divide on
 * their own, testing them inside larger questions instead, so a paper-only or
 * spec-only reading would drop two of the four things a pupil is drilled on.
 *
 * Of the eight paper questions tagged Surds, two are not surds questions:
 * 2018 P1 Q19 is completing the square and 2026 P1 Q7 is a vector magnitude,
 * both tagged because the answer happens to contain a surd.
 */

// ── surd arithmetic ────────────────────────────────────────────────────────

/** A surd as coefficient x root: 4√6, or 5 when the root is 1. */
interface Surd { c: number; r: number; }

/** Radicands that never simplify — the root is already in simplest form. */
const SQUAREFREE = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23];

/**
 * The two kinds of quotient a division drill can produce, kept apart on purpose.
 *
 * `K_SURD` leaves a surd behind (√8 = 2√2); `K_SQUARE` divides out to a whole
 * number (√16 = 4). Every value in both has a square factor, because a
 * squarefree one would make the simplifying step restate itself.
 *
 * Only values up to 45 can appear at all, since the smallest denominator is
 * √2 and the radicand cap is 90.
 */
const K_SURD = [8, 12, 18, 20, 24, 27, 32, 40, 44, 45];
const K_SQUARE = [4, 9, 16, 25, 36];

/**
 * How big a root is allowed to get. Decided by the user on 2026-09-09; both
 * numbers are the papers' own worst case, not a guess.
 *
 *   MAX_RADICAND  the largest number a QUESTION may print under a root. The
 *                 hardest thing National 5 has ever asked a pupil to break
 *                 down is sqrt(90) - 2014 P1 Q8, which is also the only place
 *                 the papers go past 40.
 *   MAX_PRODUCT   the largest number the WORKING may form by multiplying two
 *                 roots together. The papers' biggest is sqrt(2) x sqrt(40) =
 *                 sqrt(80), 2019 P1 Q12.
 *
 * **They are two separate limits because one does not imply the other.**
 * `surds.multiply` never printed a radicand above 24 and formed 480 in its
 * working, so a question-side cap alone reported it untouched - and that
 * multiplication is the whole burden of the question. Measured before applying:
 * the worst-hit variation keeps 28 distinct questions and a sheet needs six.
 * `audit-surd-caps.mts` re-runs that measurement.
 *
 * `surds.rationalise` was already inside both, at 15, and needed no change:
 * nothing structural forced the others to drift.
 */
const MAX_RADICAND = 90;
const MAX_PRODUCT = 120;

const isSquarefree = (n: number): boolean => {
  for (let k = 2; k * k <= n; k++) if (n % (k * k) === 0) return false;
  return true;
};

/** √n as coefficient x root: √75 -> 5√3, √16 -> 4 (root 1). */
function simplifySurd(n: number): Surd {
  let c = 1, r = n;
  for (let k = Math.floor(Math.sqrt(r)); k >= 2; k--) {
    if (r % (k * k) === 0) { c *= k; r /= k * k; k = Math.floor(Math.sqrt(r)) + 1; }
  }
  return { c, r };
}

const scale = (s: Surd, by: number): Surd => ({ c: s.c * by, r: s.r });

/** LaTeX. Drops a coefficient of 1, and drops the root when it is 1. */
function tex(s: Surd): string {
  if (s.r === 1) return `${s.c}`;
  if (s.c === 1) return `\\sqrt{${s.r}}`;
  if (s.c === -1) return `-\\sqrt{${s.r}}`;
  return `${s.c}\\sqrt{${s.r}}`;
}

/** "√75" as written in a question, before any simplifying. */
/**
 * One half of "simplify each surd so they share the same root".
 *
 * One of the pair is often already in its simplest form, and writing
 * "3root10 = 3root10" tells the pupil to simplify and then changes nothing.
 * Say so instead.
 */
const simplifyShown = (from: string, to: string): string =>
  from === to ? `$${to}$ is already in its simplest form` : `$${from} = ${to}$`;

const rootTex = (n: number, coeff = 1): string =>
  coeff === 1 ? `\\sqrt{${n}}` : `${coeff}\\sqrt{${n}}`;

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];

type Q = Omit<GeneratedQuestion, 'topic'>;
const SIMPLEST = 'Give your answer in its simplest form.';

// ── skill: simplifying — practice "Simplify √12", "Simplify 3√72" ─────────

function simplifying(): Q {
  const withCoeff = getRandomInt(1, 3) === 1;      // practice has 3√72
  const r = pick([2, 3, 5, 6, 7, 10, 11, 13, 15]);
  const k = getRandomInt(2, 6);                     // the square factor to pull out
  const inside = k * k * r;
  if (inside > MAX_RADICAND) return simplifying();
  const coeff = withCoeff ? getRandomInt(2, 5) : 1;
  const answer = scale(simplifySurd(inside), coeff);

  return {
    subTopic: 'Simplifying Surds',
    difficulty: 'skill',
    variationId: 'surds.simplify',
    questionLines: [`Simplify $${rootTex(inside, coeff)}$`],
    boardQuestionLines: [`$${rootTex(inside, coeff)}$`],
    solutionSteps: [
      `<strong>1.</strong> Take out the largest square factor:<br><br>$${rootTex(inside, coeff)} = ${coeff === 1 ? '' : coeff}\\sqrt{${k * k}} \\times \\sqrt{${r}}$`,
      `<strong>2.</strong> Evaluate the square root:<br><br>$${coeff === 1 ? '' : coeff}\\times ${k}\\sqrt{${r}} = ${tex(answer)}$`,
    ],
    finalAnswer: `$${tex(answer)}$`,
  };
}

// ── skill: add and subtract — 2024 P1 Q6 "√75 − √3", practice "2√20 + 6√45" ─

function addSubtract(add: boolean): Q {
  for (let tries = 0; tries < 400; tries++) {
    const r = pick([2, 3, 5, 6, 7, 10, 11]);
    const k1 = getRandomInt(2, 5), k2 = getRandomInt(1, 4);
    if (k1 === k2) continue;
    const c1 = getRandomInt(1, 3), c2 = getRandomInt(1, 3);
    const n1 = k1 * k1 * r, n2 = k2 * k2 * r;
    if (n1 > MAX_RADICAND || n2 > MAX_RADICAND) continue;

    // both terms must reduce to the same root before they can be combined —
    // that is the whole skill
    const t1 = scale(simplifySurd(n1), c1), t2 = scale(simplifySurd(n2), c2);
    const total = add ? t1.c + t2.c : t1.c - t2.c;
    if (total <= 0) continue;
    if (t1.c === t2.c && !add) continue;            // avoid a zero answer
    const answer: Surd = { c: total, r };

    const sign = add ? '+' : '-';
    return {
      subTopic: add ? 'Adding Surds' : 'Subtracting Surds',
      difficulty: 'skill',
      variationId: add ? 'surds.add' : 'surds.subtract',
      questionLines: [`Simplify $${rootTex(n1, c1)} ${sign} ${rootTex(n2, c2)}$`],
      boardQuestionLines: [`$${rootTex(n1, c1)} ${sign} ${rootTex(n2, c2)}$`],
      solutionSteps: [
        `<strong>1.</strong> Simplify each surd so they share the same root:<br><br>${simplifyShown(rootTex(n1, c1), tex(t1))} and ${simplifyShown(rootTex(n2, c2), tex(t2))}`,
        `<strong>2.</strong> ${add ? 'Add' : 'Subtract'} the coefficients:<br><br>$${tex(t1)} ${sign} ${tex(t2)} = ${tex(answer)}$`,
      ],
      // 2024 P1 Q6 is a subtraction — •¹ simplify surd, •² complete
      // simplification. The addition half has no paper behind it, so it claims
      // no mark split: a split with no scheme under it is the invention this
      // whole exercise exists to stop.
      stepMarks: add ? undefined : [1, 1],
      finalAnswer: `$${tex(answer)}$`,
    };
  }
  throw new Error(`surds.${add ? 'add' : 'subtract'}: no valid question found`);
}

// ── skill: multiply and divide — practice "√8 × √12", Zeta "√48 ÷ √3" ─────

function multiplyDivide(multiply: boolean): Q {
  for (let tries = 0; tries < 400; tries++) {
    if (multiply) {
      const a = pick([2, 3, 5, 6, 8, 10, 12, 15, 18, 20]);
      const b = pick([2, 3, 5, 6, 8, 10, 12, 15, 20, 24]);
      // √5 x √5 is the DEFINITION of a square root, not an exercise in
      // multiplying surds, and it was 10.7% of this drill.
      if (a === b) continue;
      const product = a * b;
      const answer = simplifySurd(product);
      if (answer.c === 1) continue;                 // it must actually simplify
      if (product > MAX_PRODUCT) continue;
      return {
        subTopic: 'Multiplying Surds',
        difficulty: 'skill',
        variationId: 'surds.multiply',
        questionLines: [`Simplify $\\sqrt{${a}} \\times \\sqrt{${b}}$`],
        boardQuestionLines: [`$\\sqrt{${a}} \\times \\sqrt{${b}}$`],
        solutionSteps: [
          `<strong>1.</strong> Multiply under one root:<br><br>$\\sqrt{${a}} \\times \\sqrt{${b}} = \\sqrt{${product}}$`,
          `<strong>2.</strong> Take out the largest square factor:<br><br>$\\sqrt{${product}} = ${tex(answer)}$`,
        ],
        finalAnswer: `$${tex(answer)}$`,
      };
    }
    // divide: √(kn) ÷ √n, and a√(kn) ÷ b√n
    //
    // `k` must carry a square factor. Without one, step 2 reads "√6 = √6" — the
    // tautology `prose.ts` forbids, and a step that tells the pupil to simplify
    // and then changes nothing.
    //
    // **A bare integer is a real shape and used to be most of them.** √75/√3 = 5
    // is exactly what the practice bank sets (√48 ÷ √3 = 4), so it is not a
    // fault — but it was **56.5%** of a drill called *Dividing Surds*, so over
    // half the questions left no surd behind. Splitting the two lists makes the
    // ratio a decision rather than an accident of which values were listed:
    // four of the seven old `k` values were perfect squares.
    const n = pick([2, 3, 5, 6, 7, 10, 11, 13]);
    const keepSurd = getRandomInt(1, 4) > 1;             // 3 in 4 leave a surd behind
    const ks = (keepSurd ? K_SURD : K_SQUARE).filter(v => v * n <= MAX_RADICAND);
    if (!ks.length) continue;                            // e.g. n = 13 has no surd k that fits
    const k = pick(ks);
    const top = k * n;
    const inner = simplifySurd(k);

    // A coefficient on each root, dividing exactly. The practice bank sets
    // 4√20/√8, so a coefficient on top is a shape it teaches; requiring b to
    // divide a keeps the whole-number part whole, which is what makes this a
    // warm-up rather than a second rationalising question.
    const b = pick([1, 1, 2, 3]);
    const m = getRandomInt(2, 4);
    const a = b === 1 ? 1 : b * m;
    const answer = b === 1 ? inner : scale(inner, m);

    return {
      subTopic: 'Dividing Surds',
      difficulty: 'skill',
      variationId: 'surds.divide',
      questionLines: [`Simplify $\\frac{${rootTex(top, a)}}{${rootTex(n, b)}}$`],
      boardQuestionLines: [`$\\frac{${rootTex(top, a)}}{${rootTex(n, b)}}$`],
      solutionSteps: b === 1 ? [
        `<strong>1.</strong> Divide under one root:<br><br>$\\frac{\\sqrt{${top}}}{\\sqrt{${n}}} = \\sqrt{\\frac{${top}}{${n}}} = \\sqrt{${k}}$`,
        `<strong>2.</strong> Simplify:<br><br>$\\sqrt{${k}} = ${tex(answer)}$`,
      ] : [
        `<strong>1.</strong> Divide the whole numbers and the roots separately:<br><br>$\\frac{${a}}{${b}} = ${m}$ and $\\frac{\\sqrt{${top}}}{\\sqrt{${n}}} = \\sqrt{${k}}$`,
        `<strong>2.</strong> Simplify the root:<br><br>$\\sqrt{${k}} = ${tex(inner)}$`,
        `<strong>3.</strong> Multiply the two parts:<br><br>$${m} \\times ${tex(inner)} = ${tex(answer)}$`,
      ],
      finalAnswer: `$${tex(answer)}$`,
    };
  }
  throw new Error(`surds.${multiply ? 'multiply' : 'divide'}: no valid question found`);
}

// ── skill: rationalise — 2018 P1 Q11, 2023 P1 Q8, 2025 P1 Q12 ─────────────
//
// Every paper example simplifies after rationalising: 9/√6 -> 9√6/6 -> 3√6/2,
// 12/√15 -> 12√15/15 -> 4√15/5, 6/√10 -> 6√10/10 -> 3√10/5. The second mark is
// "express in simplest form", so the numerator and the radicand must share a
// factor or that mark cannot be earned.

function rationalise(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const r = pick(SQUAREFREE.filter(n => n <= 15));
    const a = getRandomInt(2, 20);
    const g = gcd(a, r);
    if (g === 1) continue;                          // must simplify after rationalising
    const num = a / g, den = r / g;
    // A denominator of 1 means the root divided out entirely — 7/√7 is just √7,
    // which is not a rationalising question, and printing \frac{√7}{1} is worse.
    // Every paper example leaves a denominator: 9/√6 -> 3√6/2, 12/√15 -> 4√15/5.
    if (den === 1) continue;
    return {
      subTopic: 'Rationalising the Denominator',
      difficulty: 'skill',
      variationId: 'surds.rationalise',
      questionLines: [
        `Express $\\frac{${a}}{\\sqrt{${r}}}$ with a rational denominator.`, SIMPLEST,
      ],
      boardQuestionLines: [`$\\frac{${a}}{\\sqrt{${r}}}$ with a rational denominator`],
      solutionSteps: [
        `<strong>1.</strong> Multiply top and bottom by $\\sqrt{${r}}$:<br><br>$\\frac{${a}}{\\sqrt{${r}}} \\times \\frac{\\sqrt{${r}}}{\\sqrt{${r}}} = \\frac{${a}\\sqrt{${r}}}{${r}}$`,
        `<strong>2.</strong> Simplify by dividing top and bottom by $${g}$:<br><br>$\\frac{${a}\\sqrt{${r}}}{${r}} = \\frac{${num === 1 ? '' : num}\\sqrt{${r}}}{${den}}$`,
      ],
      // •¹ equivalent fraction with a rational denominator, •² simplest form
      stepMarks: [1, 1],
      finalAnswer: `$\\frac{${num === 1 ? '' : num}\\sqrt{${r}}}{${den}}$`,
    };
  }
  throw new Error('surds.rationalise: no valid question found');
}

// ── shape: expanding a bracket — 2022 P1 Q13 ─────────────────────────────
//
// √10(√10 − √2) + 8√5 = 10 − √20 + 8√5 = 10 − 2√5 + 8√5 = 10 + 6√5.
// Built answer-first: choose the root the two surd terms will share, then the
// numbers that produce it.

function expandBracket(): Q {
  for (let tries = 0; tries < 600; tries++) {
    const a = pick([6, 10, 14, 15, 21, 22]);        // not a perfect square
    const b = pick([2, 3, 5, 6, 7]);
    if (a === b) continue;
    const inner = simplifySurd(a * b);              // √(ab), which must simplify
    if (inner.c === 1) continue;
    // The pupil forms this product by hand, so it is the working cap that
    // applies, not the question one: sqrt(22) x sqrt(7) prints two small
    // roots and asks for 154.
    if (a * b > MAX_PRODUCT) continue;
    const c = getRandomInt(2, 9);
    const combined = c - inner.c;                   // coefficient of the shared root
    if (combined <= 0) continue;
    return {
      subTopic: 'Expanding Surd Brackets',
      difficulty: 'exam',
      variationId: 'surds.expand-bracket',
      questionLines: [
        `Expand and simplify $\\sqrt{${a}}\\left(\\sqrt{${a}} - \\sqrt{${b}}\\right) + ${c}\\sqrt{${inner.r}}$`,
      ],
      boardQuestionLines: [
        `$\\sqrt{${a}}\\left(\\sqrt{${a}} - \\sqrt{${b}}\\right) + ${c}\\sqrt{${inner.r}}$`,
      ],
      solutionSteps: [
        `<strong>1.</strong> Expand the bracket:<br><br>$\\sqrt{${a}} \\times \\sqrt{${a}} - \\sqrt{${a}} \\times \\sqrt{${b}} = ${a} - \\sqrt{${a * b}}$`,
        `<strong>2.</strong> Simplify the surd:<br><br>$\\sqrt{${a * b}} = ${tex(inner)}$`,
        `<strong>3.</strong> Collect the like surds:<br><br>$${a} - ${tex(inner)} + ${c}\\sqrt{${inner.r}} = ${a} + ${tex({ c: combined, r: inner.r })}$`,
      ],
      // 2022 P1 Q13: •¹ expand bracket, •² surd in simplest form, •³ complete
      stepMarks: [1, 1, 1],
      finalAnswer: `$${a} + ${tex({ c: combined, r: inner.r })}$`,
    };
  }
  throw new Error('surds.expand-bracket: no valid question found');
}

// ── shape: through function notation — 2016 P1 Q9 ────────────────────────
//
// f(x) = 2/√x, express f(5) with a rational denominator. Two marks: substitute,
// then rationalise. Note this one does NOT simplify afterwards — 2/√5 = 2√5/5
// and stops — which is why it is a separate shape from the plain rationalise.

function inFunction(): Q {
  for (let tries = 0; tries < 200; tries++) {
    const k = getRandomInt(2, 9);
    const x = pick(SQUAREFREE.filter(n => n <= 15));
    if (gcd(k, x) !== 1) continue;                  // this shape does not simplify further
    return {
      subTopic: 'Surds in a Function',
      difficulty: 'exam',
      variationId: 'surds.in-function',
      questionLines: [
        `The function $f(x)$ is defined by $f(x) = \\frac{${k}}{\\sqrt{x}}$, $x > 0$.`,
        `Express $f(${x})$ as a fraction with a rational denominator.`,
      ],
      boardQuestionLines: [
        `$f(x) = \\frac{${k}}{\\sqrt{x}}$. Express $f(${x})$ with a rational denominator.`,
      ],
      solutionSteps: [
        `<strong>1.</strong> Substitute $x = ${x}$:<br><br>$f(${x}) = \\frac{${k}}{\\sqrt{${x}}}$`,
        `<strong>2.</strong> Multiply top and bottom by $\\sqrt{${x}}$:<br><br>$\\frac{${k}}{\\sqrt{${x}}} \\times \\frac{\\sqrt{${x}}}{\\sqrt{${x}}} = \\frac{${k}\\sqrt{${x}}}{${x}}$`,
      ],
      // 2016 P1 Q9: •¹ correct substitution, •² consistent answer
      stepMarks: [1, 1],
      finalAnswer: `$\\frac{${k}\\sqrt{${x}}}{${x}}$`,
    };
  }
  throw new Error('surds.in-function: no valid question found');
}

// ── shape: three surds added — 2014 P1 Q8 ────────────────────────────────
//
// √40 + 4√10 + √90 = 2√10 + 4√10 + 3√10 = 9√10, and the scheme pays for the
// two simplifications separately: •¹ simplify √40, •² simplify √90, •³ state
// the answer. That is why this is not `surds.add` with a third term bolted on
// — there, both marks are the one skill done twice and the total is two.
//
// The middle term is already in simplest form, as the paper sets it. It is
// what tells a pupil which root the other two have to reach.

function sumOfThree(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const r = pick([2, 3, 5, 6, 7, 10, 11, 13, 15]);
    const k1 = getRandomInt(2, 6), k3 = getRandomInt(2, 6);
    if (k1 === k3) continue;                        // two identical surds reads as a slip
    const n1 = k1 * k1 * r, n3 = k3 * k3 * r;
    if (n1 > MAX_RADICAND || n3 > MAX_RADICAND) continue;
    const c = getRandomInt(2, 6);                   // the middle term, already simple
    const total = k1 + c + k3;

    return {
      subTopic: 'A Sum of Three Surds',
      difficulty: 'exam',
      variationId: 'surds.sum-three',
      questionLines: [
        `Express $\\sqrt{${n1}} + ${c}\\sqrt{${r}} + \\sqrt{${n3}}$`,
        'as a surd in its simplest form.',
      ],
      boardQuestionLines: [`$\\sqrt{${n1}} + ${c}\\sqrt{${r}} + \\sqrt{${n3}}$`],
      solutionSteps: [
        `<strong>1.</strong> Simplify the first surd by taking out its largest square factor:<br><br>$\\sqrt{${n1}} = \\sqrt{${k1 * k1}} \\times \\sqrt{${r}} = ${tex({ c: k1, r })}$`,
        `<strong>2.</strong> Do the same to the third:<br><br>$\\sqrt{${n3}} = \\sqrt{${k3 * k3}} \\times \\sqrt{${r}} = ${tex({ c: k3, r })}$`,
        `<strong>3.</strong> All three now have the same root, so add the coefficients:<br><br>$${tex({ c: k1, r })} + ${c}\\sqrt{${r}} + ${tex({ c: k3, r })} = ${tex({ c: total, r })}$`,
      ],
      // 2014 P1 Q8: •¹ simplify √40, •² simplify √90, •³ state the answer
      stepMarks: [1, 1, 1],
      finalAnswer: `$${tex({ c: total, r })}$`,
    };
  }
  throw new Error('surds.sum-three: no valid question found');
}

// ── shape: rationalise where the denominator itself simplifies — 2015 P1 Q13 ─
//
// 4/√8 -> 4√8/8 -> 4 x 2√2/8 -> √2. Three marks where the plain rationalise is
// two, and the extra one is the surd on the bottom coming apart: √8 is not in
// simplest form, so rationalising and simplifying are separate moves rather
// than one. `surds.rationalise` deliberately draws a square-free radicand and
// so can never set this.
//
// Note the paper's answer is a bare √2 — the denominator divides out entirely.
// That is allowed here for the same reason it is not in `surds.rationalise`:
// there it would mean nothing was rationalised, here the rationalising has
// already happened by the time the fraction disappears.

function rationaliseSimplify(): Q {
  for (let tries = 0; tries < 600; tries++) {
    const s = pick(SQUAREFREE.filter(n => n <= 11));
    const k = getRandomInt(2, 4);                   // the square factor hiding in the root
    const inside = k * k * s;                       // what the question prints: √8, √18, √48
    if (inside > MAX_RADICAND) continue;
    const a = getRandomInt(2, 24);
    // after rationalising: a√(k²s)/(k²s) = a·k√s/(k²s) = a√s/(ks)
    const den0 = k * s;
    const g = gcd(a, den0);
    const num = a / g, den = den0 / g;
    // A whole-number answer means the root divided out and it stopped being a
    // surd question; the papers always leave one.
    if (num === den && den === 1) continue;

    const numTex = num === 1 ? `\\sqrt{${s}}` : `${num}\\sqrt{${s}}`;
    const answer = den === 1 ? numTex : `\\frac{${numTex}}{${den}}`;
    return {
      subTopic: 'Rationalising and Simplifying',
      difficulty: 'exam',
      variationId: 'surds.rationalise-simplify',
      questionLines: [
        `Express $\\frac{${a}}{\\sqrt{${inside}}}$ with a rational denominator.`, SIMPLEST,
      ],
      boardQuestionLines: [`$\\frac{${a}}{\\sqrt{${inside}}}$ with a rational denominator`],
      solutionSteps: [
        `<strong>1.</strong> Multiply top and bottom by $\\sqrt{${inside}}$ to clear the root from the denominator:<br><br>$\\frac{${a}}{\\sqrt{${inside}}} \\times \\frac{\\sqrt{${inside}}}{\\sqrt{${inside}}} = \\frac{${a}\\sqrt{${inside}}}{${inside}}$`,
        `<strong>2.</strong> $\\sqrt{${inside}}$ is not in its simplest form, so take out the square factor:<br><br>$\\sqrt{${inside}} = ${k}\\sqrt{${s}}$, giving $\\frac{${a} \\times ${k}\\sqrt{${s}}}{${inside}}$`,
        `<strong>3.</strong> Now simplify the fraction:<br><br>$\\frac{${a * k}\\sqrt{${s}}}{${inside}} = ${answer}$`,
      ],
      // 2015 P1 Q13: •¹ rational denominator, •² manipulate the surd,
      // •³ consistent answer. The scheme takes them in either order.
      stepMarks: [1, 1, 1],
      finalAnswer: `$${answer}$`,
    };
  }
  throw new Error('surds.rationalise-simplify: no valid question found');
}

// ── shape: a surd over a surd — 2019 P1 Q12 ──────────────────────────────
//
// √2/√40 -> √80/40 -> 4√5/40 -> √5/10. Three marks, and the shape is its own
// because the numerator is a surd too: multiplying top and bottom by the
// denominator's root turns the top into a *different* root, which then has to
// be simplified before the fraction can be.

function rationaliseQuotient(): Q {
  for (let tries = 0; tries < 800; tries++) {
    const a = pick([2, 3, 5, 6, 7]);
    const b = getRandomInt(a + 1, 60);
    // A square denominator has nothing to rationalise: sqrt(25) is 5, so
    // "express with a rational denominator" asks for work already done.
    // 17.7% of draws were like that.
    if (Number.isInteger(Math.sqrt(b))) continue;
    // Same as expand-bracket: b alone stays small and a*b is what the
    // pupil actually multiplies. sqrt(7)/sqrt(60) formed sqrt(420).
    if (a * b > MAX_PRODUCT) continue;
    const top = simplifySurd(a * b);                // √(ab) = c√s
    if (top.c === 1 || top.r === 1) continue;       // it must simplify, and stay a surd
    const g = gcd(top.c, b);
    if (g === 1) continue;                          // the last mark must have work in it
    const num = top.c / g, den = b / g;
    if (den === 1) continue;                        // the papers always leave a denominator

    const numTex = num === 1 ? `\\sqrt{${top.r}}` : `${num}\\sqrt{${top.r}}`;
    const answer = `\\frac{${numTex}}{${den}}`;
    return {
      subTopic: 'Rationalising a Quotient of Surds',
      difficulty: 'exam',
      variationId: 'surds.rationalise-quotient',
      questionLines: [
        `Express $\\frac{\\sqrt{${a}}}{\\sqrt{${b}}}$ as a fraction with a rational denominator.`,
        SIMPLEST,
      ],
      boardQuestionLines: [`$\\frac{\\sqrt{${a}}}{\\sqrt{${b}}}$ with a rational denominator`],
      solutionSteps: [
        `<strong>1.</strong> Multiply top and bottom by $\\sqrt{${b}}$. The bottom becomes a whole number and the top becomes a single root:<br><br>$\\frac{\\sqrt{${a}}}{\\sqrt{${b}}} \\times \\frac{\\sqrt{${b}}}{\\sqrt{${b}}} = \\frac{\\sqrt{${a * b}}}{${b}}$`,
        `<strong>2.</strong> Simplify the surd on top:<br><br>$\\sqrt{${a * b}} = ${tex(top)}$, giving $\\frac{${tex(top)}}{${b}}$`,
        `<strong>3.</strong> Divide top and bottom by $${g}$:<br><br>$\\frac{${tex(top)}}{${b}} = ${answer}$`,
      ],
      // 2019 P1 Q12: •¹ rational denominator, •² numerator in simplest form,
      // •³ the whole fraction in simplest form
      stepMarks: [1, 1, 1],
      finalAnswer: `$${answer}$`,
    };
  }
  throw new Error('surds.rationalise-quotient: no valid question found');
}

export const SURD_GENERATORS: Record<string, () => Q> = {
  'Simplifying Surds': simplifying,
  'Adding Surds': () => addSubtract(true),
  'Subtracting Surds': () => addSubtract(false),
  'Multiplying Surds': () => multiplyDivide(true),
  'Dividing Surds': () => multiplyDivide(false),
  'Rationalising the Denominator': rationalise,
  'Expanding Surd Brackets': expandBracket,
  'Surds in a Function': inFunction,
  'A Sum of Three Surds': sumOfThree,
  'Rationalising and Simplifying': rationaliseSimplify,
  'Rationalising a Quotient of Surds': rationaliseQuotient,
};

export const _surdInternals = { simplifySurd, isSquarefree, tex };
