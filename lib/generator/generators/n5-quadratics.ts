import { GeneratedQuestion } from './types';
import { getRandomInt, gcd, nonZeroInt } from './utils';
import { fmt, type Poly } from './n5-expanding';

/**
 * National 5 Quadratics — the parts that need no diagram.
 *
 * The specification lists these separately:
 *   "Completing the square in a quadratic expression with unitary x^2
 *    coefficient — writing x^2+bx+c in the form (x+p)^2+q where b,c in Z and
 *    p,q in Q"
 *   "Identifying features of a quadratic function — the nature and coordinates
 *    of the turning point, the equation of the axis of symmetry"
 *   "Solving a quadratic equation"
 *
 * Note p,q are rational, not integer, so an odd middle coefficient is in scope
 * and gives a fractional turning point. The papers use both.
 *
 * Zeta adds the discriminant and the quadratic formula as separate skills.
 *
 * Reading a quadratic from its graph and sketching one both need a diagram and
 * wait for the shape library.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
/**
 * Weighted, not narrowed - `quadratics.formula` was never off-book.
 *
 * The eight *Quadratic formula* papers run x:8, p:1, y:1: every one of them
 * uses `x`, and `p` and `y` turn up once each. So all three letters are the
 * exam's, and only the balance was ours - an even third each, where the papers
 * are eight to one.
 *
 * Worth recording because `variables.ts` did **not** flag this: it compares the
 * set a variation prints against the set the papers use, and both sets match.
 * A convention is a weighting as much as a membership, and the check can only
 * see one of those. See `__checks__/variables.ts`.
 */
const VARS = ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'y', 'p'];
type Q = Omit<GeneratedQuestion, 'topic'>;

/**
 * The papers name the completed-square parameters inconsistently — (a,b) in 2014,
 * 2016, 2022, 2024 and 2025, (p,q) in 2019 — so vary it. The variable then has to
 * avoid whichever pair was chosen, or a question reads "(p + p)^2 + q".
 */
function squareForm(): { p: string; q: string; v: string } {
  const [p, q] = pick([['a', 'b'], ['p', 'q']]);
  const v = pick(['x', 'y', 'p'].filter(c => c !== p && c !== q));
  return { p, q, v };
}

/** A rational as LaTeX, in lowest terms, integer where it divides. */
function rat(n: number, d: number): string {
  const g = gcd(Math.abs(n), Math.abs(d)) || 1;
  let [a, b] = [n / g, d / g];
  if (b < 0) { a = -a; b = -b; }
  if (b === 1) return `${a}`;
  return a < 0 ? `-\\frac{${-a}}{${b}}` : `\\frac{${a}}{${b}}`;
}

/** Round to n significant figures. */
function sigFigs(v: number, n: number): number {
  if (v === 0) return 0;
  const mag = Math.ceil(Math.log10(Math.abs(v)));
  const f = Math.pow(10, n - mag);
  return Math.round(v * f) / f;
}

// ── skill: completing the square — 2014 P1 Q3, 2016 P2 Q9, 2019 P2 Q10 ───
//
// x^2 + bx + c = (x + b/2)^2 + (c - b^2/4). The specification allows p and q to
// be rational, so an odd b is in scope; the papers mostly use an even one.

function completeSquare(): Q {
  const evenB = getRandomInt(1, 4) !== 1;
  const { p: pName, q: qName, v } = squareForm();
  const half = nonZeroInt(-8, 8);
  const b = evenB ? 2 * half : 2 * half + (half > 0 ? 1 : -1);
  const c = nonZeroInt(-40, 40);
  const expr: Poly = [c, b, 1];

  // p = b/2, q = c - b^2/4, both over a denominator of 4 at worst
  const pN = b, pD = 2;
  const qN = 4 * c - b * b, qD = 4;
  const pTex = rat(pN, pD), qTex = rat(qN, qD);
  const sign = pN < 0 ? '-' : '+';
  const pAbs = rat(Math.abs(pN), pD);

  return {
    subTopic: 'Completing the Square',
    difficulty: 'skill',
    variationId: 'quadratics.complete-square',
    questionLines: [
      `Express $${fmt(expr, v)}$ in the form $(${v} ${sign} ${pName})^{2} + ${qName}$`,
    ],
    boardQuestionLines: [`$${fmt(expr, v)}$ in the form $(${v} ${sign} ${pName})^{2} + ${qName}$`],
    // Two marks in all four papers — •¹ correct bracket with square, •² complete
    // the process — so writing out the finished expression is part of the second
    // mark, not a third step.
    solutionSteps: [
      `<strong>1.</strong> Halve the coefficient of $${v}$ to get the number in the bracket:<br><br>$${b} \\div 2 = ${pTex}$, so the bracket is $(${v} ${sign} ${pAbs})^{2}$`,
      `<strong>2.</strong> Expanding that bracket gives an extra $${rat(b * b, 4)}$, so subtract it and add the constant:<br><br>$${qName} = ${c} - ${rat(b * b, 4)} = ${qTex}$, giving $(${v} ${sign} ${pAbs})^{2} ${qN < 0 ? '-' : '+'} ${rat(Math.abs(qN), qD)}$`,
    ],
    stepMarks: [1, 1],
    finalAnswer: `$(${v} ${sign} ${pAbs})^{2} ${qN < 0 ? '-' : '+'} ${rat(Math.abs(qN), qD)}$`,
  };
}

// ── shape: turning point — 2022 P1 Q5, 2024 P1 Q12 ──────────────────────
//
// The specification's "identify the nature and coordinates of the turning point,
// and the equation of the axis of symmetry". Both follow from the completed
// square, so the question gives the quadratic and asks for the point.

function turningPoint(): Q {
  const [pName, qName] = pick([['a', 'b'], ['p', 'q']]);
  const curve = pick(['y', 'f(x)']);
  const v = 'x';                              // the curve is named y or f(x)
  const half = nonZeroInt(-7, 7);
  const b = 2 * half;                       // keep the turning point whole here
  const c = nonZeroInt(-40, 40);
  const expr: Poly = [c, b, 1];
  const q = c - half * half;
  const sign = half < 0 ? '-' : '+';

  return {
    subTopic: 'Turning Point of a Parabola',
    difficulty: 'exam',
    variationId: 'quadratics.turning-point',
    // 2022 P1 Q5 and 2024 P1 Q12 are both worded exactly this way, one naming the
    // curve f(x) and the other y.
    questionLines: [
      `(a) Express $${fmt(expr, v)}$ in the form $(${v} ${sign} ${pName})^{2} + ${qName}$.`,
      `(b) Hence, or otherwise, state the coordinates of the turning point of the graph of $${curve} = ${fmt(expr, v)}$.`,
    ],
    boardQuestionLines: [`$${curve} = ${fmt(expr, v)}$. Complete the square, then state the turning point.`],
    // 2022 P1 Q5 is 2 + 1: •¹ correct bracket with square, •² complete the
    // process consistently, •³ state the coordinates. Part (a) was one step
    // carrying two marks, so a pupil taking a hint jumped both; and the closing
    // line about the minimum, useful as it is, is not a mark and was the step
    // the app withheld. It belongs with the coordinates.
    solutionSteps: [
      `<strong>(a)</strong> Halve the coefficient of $${v}$:<br><br>$${b} \\div 2 = ${half}$, so the bracket is $(${v} ${sign} ${Math.abs(half)})^{2}$`,
      `<strong>(a)</strong> Expanding that bracket gives an extra $${half * half}$, so subtract it and add the constant:<br><br>$(${v} ${sign} ${Math.abs(half)})^{2} ${q < 0 ? '-' : '+'} ${Math.abs(q)}$`,
      `<strong>(b)</strong> The bracket is zero when $${v} = ${-half}$, and the whole expression is then $${q}$:<br><br>$(${-half},\\ ${q})$. It is a <strong>minimum</strong> turning point, because the coefficient of $${v}^{2}$ is positive.`,
    ],
    stepMarks: [1, 1, 1],
    finalAnswer: `(a) $(${v} ${sign} ${Math.abs(half)})^{2} ${q < 0 ? '-' : '+'} ${Math.abs(q)}$, (b) $(${-half},\\ ${q})$`,
  };
}

// ── skill and shape: the discriminant — 2016 P1 Q6, 2018 P1 Q8, 2023 P1 Q5, 2025 P1 Q11 ─
//
// 2023 P1 Q5 note 4 is strict about the wording: accept "2 real (and) distinct
// roots" or "2 real unequal roots"; do NOT accept "2 real roots", "2 distinct
// roots" or "real and distinct roots". The other two cases have their own
// expected answers.

function discriminant(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const asFunction = getRandomInt(1, 4) !== 1;   // the papers always use this form
    // All four discriminant questions in the papers are f:4, x:4 - the same
    // function letter and the same variable, every time. `g`, `h`, `p` and `y`
    // reached 68% of draws between them and appear in none of them.
    const fname = 'f';
    const v = 'x';
    const kind = pick(['two', 'equal', 'none'] as const);
    const a = nonZeroInt(1, 4);
    const b = nonZeroInt(-9, 9);
    let c: number;
    if (kind === 'equal') {
      if ((b * b) % (4 * a) !== 0) continue;         // needs an exact c
      c = (b * b) / (4 * a);
    } else {
      c = nonZeroInt(-9, 9);
      const d = b * b - 4 * a * c;
      if (kind === 'two' && d <= 0) continue;
      if (kind === 'none' && d >= 0) continue;
    }
    const d = b * b - 4 * a * c;
    const nature = d > 0 ? 'two real and distinct roots'
      : d === 0 ? 'one repeated real root (two equal real roots)'
      : 'no real roots';
    const there = d === 0 ? 'is' : 'are';

    return {
      subTopic: 'The Discriminant',
      difficulty: 'skill',
      variationId: 'quadratics.discriminant',
      // All four cited papers word it identically — "Determine the nature of the
      // roots of the function f(x)=…", with no prompt to use the discriminant and
      // nothing set equal to zero. The equation form is kept as the plainer drill.
      questionLines: [
        asFunction
          ? `Determine the nature of the roots of the function $${fname}(${v}) = ${fmt([c, b, a], v)}$.`
          : `Determine the nature of the roots of the equation $${fmt([c, b, a], v)} = 0$.`,
      ],
      boardQuestionLines: [`Nature of the roots of $${fmt([c, b, a], v)}$?`],
      // Two marks in all four papers: •¹ calculate the discriminant, •² state
      // the nature of the roots. Naming the coefficients is not a mark, so it
      // opens the first step rather than being one of its own.
      solutionSteps: [
        `<strong>1.</strong> With $a = ${a}$, $b = ${b}$ and $c = ${c}$, calculate $b^{2} - 4ac$:<br><br>$(${b})^{2} - 4 \\times ${a} \\times (${c}) = ${d}$`,
        `<strong>2.</strong> ${d > 0 ? 'The discriminant is positive' : d === 0 ? 'The discriminant is zero' : 'The discriminant is negative'}, so there ${there} <strong>${nature}</strong>.`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$b^{2}-4ac = ${d}$, so there ${there} ${nature}`,
    };
  }
  throw new Error('quadratics.discriminant: no valid question found');
}

// ── skill and shape: the quadratic formula — 2017 P2 Q4, 2019 P2 Q6, 2022 P2 Q7, 2024 P2 Q8 ─
//
// Every paper example asks for a rounded answer, and the rounding varies by
// diet: one decimal place, two decimal places, two significant figures.

function quadraticFormula(): Q {
  const rounding = pick([
    { dp: 1, phrase: 'Give your answers correct to one decimal place.' },
    { dp: 2, phrase: 'Give your answers correct to two decimal places.' },
    { sf: 2, phrase: 'Give your answers correct to two significant figures.' },
  ] as const);

  for (let tries = 0; tries < 400; tries++) {
    const v = pick(VARS);
    const a = nonZeroInt(1, 3);
    const b = nonZeroInt(-9, 9);
    const c = nonZeroInt(-9, 9);
    const d = b * b - 4 * a * c;
    if (d <= 0) continue;
    const r = Math.sqrt(d);
    if (Number.isInteger(r)) continue;              // a perfect square would factorise

    const x1 = (-b + r) / (2 * a), x2 = (-b - r) / (2 * a);
    // a root just below zero rounds to the string "-0.0", which looks like a mistake
    if (Math.abs(x1) < 0.15 || Math.abs(x2) < 0.15) continue;
    const show = (x: number) => 'dp' in rounding
      ? x.toFixed(rounding.dp)
      : `${sigFigs(x, rounding.sf)}`;

    return {
      subTopic: 'The Quadratic Formula',
      difficulty: 'skill',
      variationId: 'quadratics.formula',
      questionLines: [
        `Solve the equation $${fmt([c, b, a], v)} = 0$ using the quadratic formula.`,
        rounding.phrase,
      ],
      boardQuestionLines: [`Solve $${fmt([c, b, a], v)} = 0$ by formula. ${rounding.phrase}`],
      // •¹ correct substitution into the formula, •² evaluate the discriminant,
      // •³ both roots at the stated accuracy. Naming the coefficients is not a
      // mark of its own; it opens the substitution.
      solutionSteps: [
        `<strong>1.</strong> With $a = ${a}$, $b = ${b}$ and $c = ${c}$, substitute into $${v} = \\frac{-b \\pm \\sqrt{b^{2}-4ac}}{2a}$:<br><br>$${v} = \\frac{${-b} \\pm \\sqrt{(${b})^{2} - 4 \\times ${a} \\times (${c})}}{2 \\times ${a}}$`,
        `<strong>2.</strong> Evaluate the discriminant:<br><br>$b^{2}-4ac = ${d}$`,
        `<strong>3.</strong> Work out both roots and round:<br><br>$${v} = ${show(x1)}$ or $${v} = ${show(x2)}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$${v} = ${show(x1)}$ and $${v} = ${show(x2)}$`,
    };
  }
  throw new Error('quadratics.formula: no valid question found');
}

// ── complete the square, the axis, then surd roots — 2018 P1 Q19 ────────
//
// Seven marks in three parts, and the last of them turns on something the
// question does not spell out: the roots come out as d ± d√e, with **the same
// d twice**. That only happens when the completed-square constant is p² times a
// square-free number, since x = p ± √(p²e) = p ± p√e.
//
// So this is built backwards from p and e rather than from the quadratic:
// choose the shift and the square-free part, and the quadratic landing on them
// is x² − 2px + p²(1 − e). The paper's own p = 3, e = 10 gives x² − 6x − 81,
// and its note is explicit that the last mark is only available where the
// simplification actually reaches that form.

function completeSquareSurdRoots(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const p = getRandomInt(2, 7);
    const e = pick([2, 3, 5, 6, 7, 10, 11, 13, 15]);
    const under = p * p * e;                    // what ends up under the root
    const c = p * p - under;                    // the quadratic's constant term
    if (Math.abs(c) > 200) continue;
    const expr: Poly = [c, -2 * p, 1];

    return {
      subTopic: 'Completing the Square with Surd Roots',
      difficulty: 'exam',
      variationId: 'quadratics.complete-square-surd-roots',
      questionLines: [
        `<b>(a)</b>&nbsp;&nbsp;(i) Express $${fmt(expr, 'x')}$ in the form $(x - p)^{2} + q$.`,
        `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(ii) Hence state the equation of the axis of symmetry of the graph of $y = ${fmt(expr, 'x')}$.`,
        `<b>(b)</b>&nbsp;&nbsp;The roots of the equation $${fmt(expr, 'x')} = 0$ can be expressed in the form $x = d \\pm d\\sqrt{e}$. Find, algebraically, the values of $d$ and $e$.`,
      ],
      boardQuestionLines: [
        `$${fmt(expr, 'x')}$: complete the square, state the axis of symmetry, then give the roots as $d \\pm d\\sqrt{e}$.`,
      ],
      solutionSteps: [
        `<strong>1. (a)(i)</strong> Halve the coefficient of $x$ to get the bracket:<br><br>$${-2 * p} \\div 2 = ${-p}$, so the bracket is $(x - ${p})^{2}$`,
        `<strong>2. (a)(i)</strong> That bracket carries an extra $${p * p}$, so take it off again and add the constant:<br><br>$(x - ${p})^{2} - ${under}$`,
        `<strong>3. (a)(ii)</strong> The axis of symmetry runs through the turning point, where the bracket is zero:<br><br>$x = ${p}$`,
        `<strong>4. (b)</strong> Set the completed square to zero:<br><br>$(x - ${p})^{2} - ${under} = 0$, so $(x - ${p})^{2} = ${under}$`,
        `<strong>5. (b)</strong> Take the square root of both sides, keeping both signs:<br><br>$x - ${p} = \\pm\\sqrt{${under}}$, so $x = ${p} \\pm \\sqrt{${under}}$`,
        `<strong>6. (b)</strong> Simplify the surd by taking out the largest square factor:<br><br>$\\sqrt{${under}} = ${p}\\sqrt{${e}}$`,
        `<strong>7. (b)</strong> So the roots are $x = ${p} \\pm ${p}\\sqrt{${e}}$, which is the form the question asks for:<br><br>$d = ${p}$, $e = ${e}$`,
      ],
      // 2018 P1 Q19 is 2 + 1 + 4: •¹ the bracket, •² complete the process,
      // •³ the axis of symmetry, then •⁴ equate to zero, •⁵ start to solve,
      // •⁶ solve, •⁷ complete. Note 2 withholds •⁷ unless the simplification
      // actually reaches the d ± d√e form.
      stepMarks: [1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `(a)(i) $(x - ${p})^{2} - ${under}$, (ii) $x = ${p}$<br>(b) $d = ${p}$, $e = ${e}$`,
    };
  }
  throw new Error('quadratics.complete-square-surd-roots: no valid question found');
}

export const QUADRATIC_GENERATORS: Record<string, () => Q> = {
  'Completing the Square': completeSquare,
  'Turning Point of a Parabola': turningPoint,
  'The Discriminant': discriminant,
  'The Quadratic Formula': quadraticFormula,
  'Completing the Square with Surd Roots': completeSquareSurdRoots,
};
