import { GeneratedQuestion } from './types';
import { getRandomInt, gcd } from './utils';

/**
 * National 5 Indices.
 *
 * Skill axis (Zeta): the laws of indices, and evaluating a numeric fractional
 * index. Zeta's third skill, scientific notation, is tagged as its own topic in
 * the papers and belongs there rather than here.
 *
 * Shape axis (papers): a coefficient inside the bracket, and expanding a
 * bracket whose terms carry fractional or negative indices.
 *
 * The specification is explicit about what may appear:
 *   (ab)^m = a^m b^m,  (a^m)^n = a^mn,  a^(m/n) = nth root of a^m,
 *   "multiplication and division using positive and negative indices
 *    including fractions"
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
/**
 * Indices is the one topic whose variety is the papers' own.
 *
 * Across the nine *Laws of indices* questions the papers use `n` three times,
 * `a` twice, and `p`, `m`, `c`, `x` once each. Elsewhere in the course a
 * rotating letter was drift; here it is the convention, and narrowing this to
 * `x` would have been the mistake the whole exercise is meant to avoid.
 *
 * **`y` is the exception, and it is the only one.** It appears in no indices
 * question in any of the eleven papers, and reached 5-23% of draws across seven
 * variations. See `__checks__/variables.ts`.
 */
const VARS = ['a', 'c', 'm', 'n', 'p', 'x'];

type Q = Omit<GeneratedQuestion, 'topic'>;
const POSITIVE_POWER = 'Give your answer with a positive power.';

/**
 * An nth root, written the way it is printed.
 *
 * A square root is never `\sqrt[2]{x}` in a paper, and `indices.evaluate` had
 * been setting exactly that for every question with a root of two.
 */
const nthRoot = (n: number, inside: string | number): string =>
  n === 2 ? `\\sqrt{${inside}}` : `\\sqrt[${n}]{${inside}}`;

/** x^n, dropping the exponent when it is 1. */
const pow = (v: string, n: number | string): string =>
  n === 1 || n === '1' ? v : `${v}^{${n}}`;

/** A fraction as LaTeX, or the integer when it divides out. */
function frac(n: number, d: number): string {
  const g = gcd(n, d);
  const [a, b] = [n / g, d / g];
  return b === 1 ? `${a}` : `\\frac{${a}}{${b}}`;
}

// ── skill: the laws — 2025 P1 Q10 "n⁷ × (n³)² ÷ n⁴" ──────────────────────

function laws(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const v = pick(VARS);
    const a = getRandomInt(3, 9);      // n^a
    const b = getRandomInt(2, 4);      // (n^b)
    const c = getRandomInt(2, 3);      //        ^c
    const d = getRandomInt(2, 6);      // ÷ n^d
    const result = a + b * c - d;
    if (result < 2 || result > 20) continue;   // must be positive, and not trivial

    return {
      subTopic: 'Laws of Indices',
      difficulty: 'skill',
      variationId: 'indices.laws',
      questionLines: [
        `Simplify $\\frac{${pow(v, a)} \\times (${pow(v, b)})^{${c}}}{${pow(v, d)}}$`,
      ],
      boardQuestionLines: [`$\\frac{${pow(v, a)} \\times (${pow(v, b)})^{${c}}}{${pow(v, d)}}$`],
      solutionSteps: [
        `<strong>1.</strong> Apply $(${v}^{m})^{n} = ${v}^{mn}$ to the bracket:<br><br>$(${pow(v, b)})^{${c}} = ${pow(v, b * c)}$`,
        `<strong>2.</strong> Multiply by adding the powers:<br><br>$${pow(v, a)} \\times ${pow(v, b * c)} = ${pow(v, a + b * c)}$`,
        `<strong>3.</strong> Divide by subtracting the powers:<br><br>$\\frac{${pow(v, a + b * c)}}{${pow(v, d)}} = ${pow(v, result)}$`,
      ],
      // 2025 P1 Q10 gives a mark for each law applied, in this order
      stepMarks: [1, 1, 1],
      finalAnswer: `$${pow(v, result)}$`,
    };
  }
  throw new Error('indices.laws: no valid question found');
}

// ── skill: negative indices — 2016 P2 Q10, 2022 P1 Q11 ───────────────────
//
// "(m⁻²)⁴ × m⁻⁵" -> m⁻¹³ -> 1/m¹³. The mark is for expressing it with a
// positive power, so the combined index must come out negative.

function negativePower(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const v = pick(VARS);
    const a = pick([-3, -2, 2, 3]);    // inside the bracket
    const b = getRandomInt(2, 4);      // the bracket's power
    const c = getRandomInt(-10, -2);   // the multiplier's power
    const result = a * b + c;
    if (result >= 0 || result < -18) continue;    // must be negative to need flipping

    const insideTex = a < 0 ? `${v}^{${a}}` : pow(v, a);
    return {
      subTopic: 'Negative Indices',
      difficulty: 'skill',
      variationId: 'indices.negative-power',
      questionLines: [
        `Simplify $(${insideTex})^{${b}} \\times ${v}^{${c}}$`, POSITIVE_POWER,
      ],
      boardQuestionLines: [`$(${insideTex})^{${b}} \\times ${v}^{${c}}$`],
      solutionSteps: [
        `<strong>1.</strong> Apply $(${v}^{m})^{n} = ${v}^{mn}$:<br><br>$(${insideTex})^{${b}} = ${v}^{${a * b}}$`,
        `<strong>2.</strong> Multiply by adding the powers:<br><br>$${v}^{${a * b}} \\times ${v}^{${c}} = ${v}^{${result}}$`,
        `<strong>3.</strong> Write with a positive power using $${v}^{-n} = \\frac{1}{${v}^{n}}$:<br><br>$${v}^{${result}} = \\frac{1}{${pow(v, -result)}}$`,
      ],
      // •¹ power of a power, •² add the powers, •³ express with a positive power
      stepMarks: [1, 1, 1],
      finalAnswer: `$\\frac{1}{${pow(v, -result)}}$`,
    };
  }
  throw new Error('indices.negative-power: no valid question found');
}

// ── skill: evaluating a fractional index — practice "16^{3/2}", Zeta "27^{2/3}" ─

function evaluateFractional(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const root = getRandomInt(2, 3);            // square or cube root
    const base = getRandomInt(2, root === 2 ? 12 : 5);
    const n = Math.round(base ** root);         // so the root is exact
    const p = getRandomInt(2, 5);
    // The power must be in lowest terms, or the question collapses: 27^{3/3} is
    // just 27, and 16^{2/2} is just 16. SQA's examples are 16^{3/2} and
    // 27^{2/3} — coprime either way up.
    if (gcd(p, root) !== 1) continue;
    const answer = Math.round(base ** p);
    if (n > 200 || answer > 400) continue;

    return {
      subTopic: 'Fractional Indices',
      difficulty: 'skill',
      variationId: 'indices.evaluate',
      questionLines: [`Evaluate $${n}^{\\frac{${p}}{${root}}}$`],
      boardQuestionLines: [`$${n}^{\\frac{${p}}{${root}}}$`],
      solutionSteps: [
        `<strong>1.</strong> The denominator of the power is the root and the numerator is the power:<br><br>$${n}^{\\frac{${p}}{${root}}} = \\left(${nthRoot(root, n)}\\right)^{${p}}$`,
        `<strong>2.</strong> Take the root, then raise it to the power:<br><br>$${nthRoot(root, n)} = ${base}$, so $${base}^{${p}} = ${answer}$`,
      ],
      // 2015 P1 Q14 is two marks, not three: •¹ interpret the index, •² complete
      // the evaluation. Taking the root and raising to the power are one mark
      // between them, so splitting them stalled a hint on the easy half.
      stepMarks: [1, 1],
      finalAnswer: `$${answer}$`,
    };
  }
  throw new Error('indices.evaluate: no valid question found');
}

// ── shape: a coefficient inside the bracket — 2018 P1 Q15, 2026 P2 Q11 ───
//
// "(2/3 p⁴)²" -> 4/9 p⁸ and "a¹⁷ ÷ (3a⁴)³" -> a⁵/27. Both hinge on
// (ab)^m = a^m b^m, which the specification names explicitly, but the exam
// prices them differently — two marks and three — so they are two topics.

function withCoefficient(asFraction: boolean): Q {
  for (let tries = 0; tries < 300; tries++) {
    const v = pick(VARS);
    if (asFraction) {
      const num = getRandomInt(2, 4), den = getRandomInt(3, 5);
      if (gcd(num, den) !== 1) continue;
      const a = getRandomInt(2, 5), b = 2;
      return {
        subTopic: 'Indices with Coefficients',
        difficulty: 'exam',
        variationId: 'indices.coefficient',
        questionLines: [
          `Remove the brackets and simplify $\\left(\\frac{${num}}{${den}}${pow(v, a)}\\right)^{${b}}$`,
        ],
        boardQuestionLines: [`$\\left(\\frac{${num}}{${den}}${pow(v, a)}\\right)^{${b}}$`],
        solutionSteps: [
          `<strong>1.</strong> Apply $(ab)^{m} = a^{m}b^{m}$ — the power goes to both parts:<br><br>$\\left(\\frac{${num}}{${den}}\\right)^{${b}} \\times (${pow(v, a)})^{${b}}$`,
          `<strong>2.</strong> Work out each part:<br><br>$\\frac{${num ** b}}{${den ** b}} \\times ${pow(v, a * b)} = \\frac{${num ** b}}{${den ** b}}${pow(v, a * b)}$`,
        ],
        // 2018 P1 Q15: •¹ start process, •² complete process
        stepMarks: [1, 1],
        finalAnswer: `$\\frac{${num ** b}}{${den ** b}}${pow(v, a * b)}$`,
      };
    }
    // a^m ÷ (k a^n)^p — 2026 P2 Q11, and worth three rather than two.
    //
    // It used to share an id with the bracket above and print two marks. The
    // paper says three, and the reason is visible in the working: the bracket
    // question stops once the power has been distributed, while this one then
    // has a division to do and a coefficient left standing under it. Taking the
    // power to both parts, dividing, and assembling the answer are three moves,
    // and only the first is shared with 2018 P1 Q15.
    const k = getRandomInt(2, 4), n = getRandomInt(2, 4), p = getRandomInt(2, 3);
    const m = getRandomInt(n * p + 2, n * p + 9);
    const kp = k ** p;
    if (kp > 200) continue;
    const left = m - n * p;
    return {
      subTopic: 'Indices in a Quotient',
      difficulty: 'exam',
      variationId: 'indices.coefficient-quotient',
      questionLines: [`Simplify $\\frac{${pow(v, m)}}{(${k}${pow(v, n)})^{${p}}}$`],
      boardQuestionLines: [`$\\frac{${pow(v, m)}}{(${k}${pow(v, n)})^{${p}}}$`],
      solutionSteps: [
        `<strong>1.</strong> Apply $(ab)^{m} = a^{m}b^{m}$ to the denominator — the power goes to the number as well as the letter:<br><br>$(${k}${pow(v, n)})^{${p}} = ${kp}${pow(v, n * p)}$`,
        `<strong>2.</strong> Divide the powers of $${v}$ by subtracting them:<br><br>$\\frac{${pow(v, m)}}{${pow(v, n * p)}} = ${pow(v, left)}$`,
        `<strong>3.</strong> The ${kp} stays in the denominator, so put the two together:<br><br>$\\frac{${pow(v, m)}}{(${k}${pow(v, n)})^{${p}}} = \\frac{${pow(v, left)}}{${kp}}$`,
      ],
      // 2026 P2 Q11 has no published scheme; the three-way split is inferred
      // from the three moves the working takes, and flagged in the registry.
      stepMarks: [1, 1, 1],
      finalAnswer: `$\\frac{${pow(v, left)}}{${kp}}$`,
    };
  }
  throw new Error(`indices.coefficient${asFraction ? '' : '-quotient'}: no valid question found`);
}

// ── shape: expanding a bracket — 2024 P1 Q13 "x(x^{1/2} + x^{-1})" ────────
//
// The neat answer depends on one term landing on x⁰ = 1, which is what makes
// the question worth asking.

function expandBracket(): Q {
  const v = pick(VARS);
  /**
   * The root, the numerator over it, the power outside, and the sign.
   *
   * Everything here was pinned tighter than the mathematics needs. The root
   * was 2 or 3, giving only three (p, q) pairs; the outer power was 1, "the
   * paper multiplies by x itself"; and the fractional index was always
   * positive. Between them the variation made **three** questions, then nine
   * once the outer power was freed - and seven letters made that look like
   * twenty-one, so a teacher asking for four got a repeat.
   *
   * The question is worth asking because one term lands on x^0 = 1, and that
   * holds for **any** outer power k so long as the bracket's second term is
   * x^{-k}, and whichever way the fractional index points. So the shape, the
   * skill and the two marks are all untouched by widening any of them.
   *
   * `p` must stay coprime with `q`, or the fraction is not in lowest terms and
   * the question is a smaller root wearing a bigger one: 2/4 is 1/2.
   *
   * 5 pairs x 3 outer powers x 2 signs = **30**.
   */
  const q = pick([2, 3, 4]);
  const p = pick([1, 2, 3].filter(n => n < q && gcd(n, q) === 1));
  const outer = getRandomInt(1, 3);
  const rootIsNegative = getRandomInt(0, 1) === 1;

  // x^{outer} * x^{+-p/q} = x^{(q*outer +- p)/q}, and never reducible, because
  // q*outer is a multiple of q and p is coprime with it.
  const firstNum = q * outer + (rootIsNegative ? -p : p);
  const outTex = pow(v, outer);
  const rootTex = `${v}^{${rootIsNegative ? '-' : ''}\\frac{${p}}{${q}}}`;
  const innerTex = outer === 1 ? `${v}^{-1}` : `${v}^{-${outer}}`;
  return {
    subTopic: 'Expanding with Indices',
    difficulty: 'exam',
    variationId: 'indices.expand',
    questionLines: [
      `Expand and simplify fully $${outTex}\\left(${rootTex} + ${innerTex}\\right)$`,
    ],
    boardQuestionLines: [`$${outTex}\\left(${rootTex} + ${innerTex}\\right)$`],
    solutionSteps: [
      `<strong>1.</strong> Multiply each term in the bracket by $${outTex}$, adding the powers:<br><br>$${v}^{${outer}} \\times ${rootTex} = ${v}^{${frac(firstNum, q)}}$`,
      `<strong>2.</strong> And the second term, then write the two together:<br><br>$${v}^{${outer}} \\times ${innerTex} = ${v}^{0} = 1$, so the answer is $${v}^{${frac(firstNum, q)}} + 1$`,
    ],
    // 2024 P1 Q13: •¹ apply one of the two multiplications, •² apply both and
    // simplify. The second step has to land on the whole expression, not just
    // the second term — the last step is the one that states the answer.
    stepMarks: [1, 1],
    finalAnswer: `$${v}^{${frac(firstNum, q)}} + 1$`,
  };
}

// ── shape: coefficients that cancel — 2014 P2 Q8 ─────────────────────────
//
// (n⁵ × 10n)/(2n²) -> 10n⁶/2n² -> 5n⁶/n² -> 5n⁴, and the scheme names three
// separate things: •¹ the powers in the numerator, •² the constants, •³ the
// variable out of the denominator. `indices.laws` is the same three laws with
// no numbers in it, which is why this is its own shape: the whole difficulty
// here is that a coefficient and a power divide by different rules and a pupil
// who subtracts 10 − 2 has done exactly what the powers told them to.

function cancelCoefficients(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const v = pick(VARS);
    const d = getRandomInt(2, 5);                  // the denominator's coefficient
    const k = d * getRandomInt(2, 6);              // the numerator's, a multiple of it
    if (k > 40) continue;
    const a = getRandomInt(3, 8);                  // v^a in the numerator
    const b = getRandomInt(1, 3);                  // times k v^b
    const c = getRandomInt(2, 4);                  // over d v^c
    const left = a + b - c;
    if (left < 2 || left > 12) continue;

    const numerator = `${pow(v, a)} \\times ${k}${pow(v, b)}`;
    return {
      subTopic: 'Cancelling Coefficients with Indices',
      difficulty: 'exam',
      variationId: 'indices.cancel-coefficients',
      questionLines: [`Simplify $\\frac{${numerator}}{${d}${pow(v, c)}}$`],
      boardQuestionLines: [`$\\frac{${numerator}}{${d}${pow(v, c)}}$`],
      solutionSteps: [
        `<strong>1.</strong> Multiply out the numerator, adding the powers of $${v}$:<br><br>$${numerator} = ${k}${pow(v, a + b)}$`,
        `<strong>2.</strong> The numbers divide on their own, separately from the powers:<br><br>$\\frac{${k}}{${d}} = ${k / d}$, giving $\\frac{${k / d}${pow(v, a + b)}}{${pow(v, c)}}$`,
        `<strong>3.</strong> Now divide the powers by subtracting them:<br><br>$\\frac{${pow(v, a + b)}}{${pow(v, c)}} = ${pow(v, left)}$, so the answer is $${k / d}${pow(v, left)}$`,
      ],
      // 2014 P2 Q8: •¹ simplify the powers in the numerator, •² cancel the
      // constants, •³ eliminate the variable from the denominator
      stepMarks: [1, 1, 1],
      finalAnswer: `$${k / d}${pow(v, left)}$`,
    };
  }
  throw new Error('indices.cancel-coefficients: no valid question found');
}

// ── shape: a root in the denominator — 2019 P2 Q16 ───────────────────────
//
// (a⁴ × 3a)/√a -> 3a⁵/a^{1/2} -> 3a^{9/2}. The mark in the middle is for
// *writing the root as a power at all* — until √a becomes a^{1/2} there is
// nothing the division law can be applied to, and that is the whole question.

function rootInDenominator(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const v = pick(VARS);
    const k = getRandomInt(2, 6);
    const a = getRandomInt(2, 7);
    const b = getRandomInt(1, 3);
    const twiceLeft = 2 * (a + b) - 1;              // the answer's power, over 2
    if (twiceLeft < 5 || twiceLeft > 21) continue;

    const numerator = `${pow(v, a)} \\times ${k}${pow(v, b)}`;
    const answer = `${k}${v}^{\\frac{${twiceLeft}}{2}}`;
    return {
      subTopic: 'A Root in the Denominator',
      difficulty: 'exam',
      variationId: 'indices.root-denominator',
      questionLines: [`Simplify $\\frac{${numerator}}{\\sqrt{${v}}}$`],
      boardQuestionLines: [`$\\frac{${numerator}}{\\sqrt{${v}}}$`],
      solutionSteps: [
        `<strong>1.</strong> Multiply out the numerator, adding the powers:<br><br>$${numerator} = ${k}${pow(v, a + b)}$`,
        `<strong>2.</strong> A square root is a power of a half, so the denominator can be written as one:<br><br>$\\sqrt{${v}} = ${v}^{\\frac{1}{2}}$`,
        `<strong>3.</strong> Now divide by subtracting the powers:<br><br>$${a + b} - \\frac{1}{2} = \\frac{${twiceLeft}}{2}$, so the answer is $${answer}$`,
      ],
      // 2019 P2 Q16: •¹ combine the numerator, •² evidence of √a = a^{1/2},
      // •³ complete the simplification
      stepMarks: [1, 1, 1],
      finalAnswer: `$${answer}$`,
    };
  }
  throw new Error('indices.root-denominator: no valid question found');
}

// ── shape: a root written as a power — 2017 P2 Q12 ───────────────────────
//
// "Express 1/∛x in the form x^n" -> x^{-1/3}. Two marks and two laws, one for
// each: the root becomes a fractional index, then the reciprocal makes it
// negative. Neither is `indices.negative-power`, which runs the other way —
// there a negative index is turned back into a fraction.

function rootAsPower(): Q {
  /**
   * The base, and only from what the papers use as a base.
   *
   * Not `n`: the question asks for the answer "in the form $v^{n}$", and a
   * variable called n makes that "in the form $n^{n}$" - the same letter for
   * the base and for the exponent it is asking about. 13.7% of draws.
   *
   * **And that is why the letter check cannot be followed blindly here.** It
   * reports this subtopic's papers as `n:2 x:1 m:1 c:1` and would have us
   * restore `n` as the commonest letter of all - but those two `n`s are the
   * *exponent* in "express in the form $x^{n}$", not a base. A letter's
   * frequency says nothing about the role it plays. The bases the papers
   * actually use are these three.
   */
  const v = pick(['x', 'm', 'c']);
  const n = pick([2, 3, 3, 4]);                    // the root
  const m = getRandomInt(1, n - 1);                // the power under it, proper
  const g = gcd(m, n);
  if (g !== 1) return rootAsPower();               // 2/4 is 1/2 written twice
  const inside = m === 1 ? v : pow(v, m);
  const rootTex = nthRoot(n, inside);
  const answer = `${v}^{-\\frac{${m}}{${n}}}`;
  return {
    subTopic: 'Writing a Root as a Power',
    difficulty: 'exam',
    variationId: 'indices.root-as-power',
    questionLines: [`Express $\\frac{1}{${rootTex}}$ in the form $${v}^{n}$.`],
    boardQuestionLines: [`$\\frac{1}{${rootTex}}$ in the form $${v}^{n}$`],
    solutionSteps: [
      `<strong>1.</strong> A root is a fractional index — the root goes on the bottom of the fraction, the power on the top:<br><br>$${rootTex} = ${v}^{\\frac{${m}}{${n}}}$`,
      `<strong>2.</strong> One over a power is that power made negative:<br><br>$\\frac{1}{${v}^{\\frac{${m}}{${n}}}} = ${answer}$`,
    ],
    // 2017 P2 Q12: •¹ apply nth root of x^m = x^{m/n}, •² apply 1/x^n = x^{-n}
    stepMarks: [1, 1],
    finalAnswer: `$${answer}$`,
  };
}

export const INDICES_GENERATORS: Record<string, () => Q> = {
  'Laws of Indices': laws,
  'Negative Indices': negativePower,
  'Fractional Indices': evaluateFractional,
  'Indices with Coefficients': () => withCoefficient(true),
  'Indices in a Quotient': () => withCoefficient(false),
  'Expanding with Indices': expandBracket,
  'Cancelling Coefficients with Indices': cancelCoefficients,
  'A Root in the Denominator': rootInDenominator,
  'Writing a Root as a Power': rootAsPower,
};
