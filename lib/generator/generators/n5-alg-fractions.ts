import { GeneratedQuestion } from './types';
import { getRandomInt, gcd, nonZeroInt } from './utils';
import { fmt, type Poly } from './n5-expanding';

/**
 * National 5 Algebraic Fractions — the largest Tier 1 topic, 16 paper questions.
 *
 * The paper favours one type heavily: add-subtract is 7 of the 16. Zeta lists
 * four skills — simplifying, add and subtract, multiply, divide — and the papers
 * have never once asked for multiplication on its own, so that topic is skill
 * only. It is the clearest case in the course for keeping the two axes separate.
 *
 * Read off the papers, not the subtopic tag:
 *
 *   - every add-subtract question states the excluded values in the question
 *     ("$x \neq -5$, $x \neq 0$"), so the generator prints them too
 *   - the answer denominator is always left factorised — x(x+5), (x-2)(x+1) —
 *     never expanded
 *   - two of the five simplify questions are scaffolded as "(a) Factorise …
 *     (b) Hence simplify …", which is a different question even though the
 *     algebra is identical
 *   - 2017 P2 Q9 note 4: the final mark "is only available when both the
 *     numerator and denominator have at least two factors", so a generated
 *     fraction must never have a numerator that is already a single factor
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

const frac = (n: string, d: string) => `\\frac{${n}}{${d}}`;

/** "3x - 4", with a unit coefficient and a zero constant left implicit. */
function lin(v: string, c: number, coef = 1): string {
  const head = coef === 1 ? v : coef === -1 ? `-${v}` : `${coef}${v}`;
  if (c === 0) return head;
  return `${head} ${c < 0 ? '-' : '+'} ${Math.abs(c)}`;
}

/**
 * A linear expression written the way a marker would. When the variable term is
 * negative and the constant positive the paper leads with the constant — 2017
 * P1 Q11's answer is "3 - 2a", not "-2a + 3".
 */
function linTex(v: string, coef: number, c: number): string {
  if (coef === 0) return `${c}`;
  if (coef < 0 && c > 0) return `${c} - ${-coef === 1 ? '' : -coef}${v}`;
  return lin(v, c, coef);
}

/** A bracket, unless the factor is the bare variable — SQA writes x(x+5). */
const br = (s: string) => (/^[a-z]$/.test(s) ? s : `(${s})`);

// ── add and subtract — 7 questions, the topic's dominant type ─────────────
//
// 2014 P2 Q9, 2016 P2 Q13, 2019 P2 Q15, 2023 P2 Q10, 2024 P2 Q12, 2025 P1 Q14
// are all "p/(x+m) ± q/(x+n)" for 3 marks. 2017 P1 Q11 is the one exception:
// "3/a^2 - 2/a" for 2 marks, where the common denominator is a power rather
// than a product.
//
// Input-first with rejection. The numerator can never share a factor with the
// denominator here — p(x+n) ± q(x+m) is proportional to (x+m) only when m = n,
// which is already excluded — so the only rejection needed is the degenerate
// case where the x term vanishes.

function addSubtract(minus: boolean): Q {
  const powers = getRandomInt(1, 6) === 1;      // the 2017 shape, 1 in 7 papers
    // x:6, a:1 across the seven papers - and the split is exactly this
    // branch: six ordinary questions in x, and the one 2017 powers question
    // in a. `b`, `n` and `y` appear in none of them.
    const v = powers ? 'a' : 'x';
  const op = minus ? '-' : '+';

  if (powers) {
    const p = nonZeroInt(2, 9), q = nonZeroInt(2, 9);
    // p/v^2 ± q/v  =  (p ± qv)/v^2
    const num = linTex(v, minus ? -q : q, p);
    return {
      subTopic: minus ? 'Subtracting Algebraic Fractions' : 'Adding Algebraic Fractions',
      difficulty: 'skill',
      variationId: minus ? 'alg-fractions.subtract' : 'alg-fractions.add',
      questionLines: [
        `Express $${frac(`${p}`, `${v}^{2}`)} ${op} ${frac(`${q}`, v)}$, $${v} \\neq 0$,`,
        `as a single fraction in its simplest form.`,
      ],
      boardQuestionLines: [`$${frac(`${p}`, `${v}^{2}`)} ${op} ${frac(`${q}`, v)}$ as a single fraction`],
      solutionSteps: [
        `<strong>1.</strong> The lowest common denominator is $${v}^{2}$, so multiply the second fraction top and bottom by $${v}$:<br><br>$${frac(`${p}`, `${v}^{2}`)} ${op} ${frac(`${q}${v}`, `${v}^{2}`)}$`,
        `<strong>2.</strong> Combine over the one denominator:<br><br>$${frac(`${p} ${op} ${q}${v}`, `${v}^{2}`)}$`,
        `<strong>3.</strong> Tidy the numerator:<br><br>$${frac(num, `${v}^{2}`)}$`,
      ],
      // •¹ correct denominator, •² correct numerator, •³ simplest form
      stepMarks: [1, 1, 1],
      finalAnswer: `$${frac(num, `${v}^{2}`)}$`,
    };
  }

  for (let tries = 0; tries < 400; tries++) {
    const p = nonZeroInt(2, 9), q = nonZeroInt(2, 9);
    // one denominator is the bare variable in 3 of the 6 papers
    // Only m can be zero, and it is printed first, so the bare variable always
    // leads — SQA writes x(x+5), never (x+5)x.
    const m = getRandomInt(1, 3) === 1 ? 0 : nonZeroInt(-6, 6);
    const n = nonZeroInt(-6, 6);
    if (n === m) continue;
    const coef = minus ? p - q : p + q;
    if (coef === 0) continue;                   // would collapse to a constant
    const cons = minus ? p * n - q * m : p * n + q * m;

    const d1 = lin(v, m), d2 = lin(v, n);
    const denom = `${br(d1)}${br(d2)}`;
    const num = linTex(v, coef, cons);
    const excluded = [m, n].map(k => `$${v} \\neq ${-k}$`).join(', ');

    return {
      subTopic: minus ? 'Subtracting Algebraic Fractions' : 'Adding Algebraic Fractions',
      difficulty: 'skill',
      variationId: minus ? 'alg-fractions.subtract' : 'alg-fractions.add',
      questionLines: [
        `Express $${frac(`${p}`, d1)} ${op} ${frac(`${q}`, d2)}$, ${excluded},`,
        `as a single fraction in its simplest form.`,
      ],
      boardQuestionLines: [`$${frac(`${p}`, d1)} ${op} ${frac(`${q}`, d2)}$ as a single fraction`],
      // •¹ correct denominator, •² correct numerator, •³ remove the brackets in
      // the numerator and collect like terms. Expanding and collecting are one
      // mark between them, so they are one step.
      solutionSteps: [
        `<strong>1.</strong> The common denominator is the product of the two:<br><br>$${denom}$`,
        `<strong>2.</strong> Multiply each numerator by the other denominator:<br><br>$${frac(`${p}${br(d2)} ${op} ${q}${br(d1)}`, denom)}$`,
        `<strong>3.</strong> Expand the numerator and collect like terms. The denominator is left factorised:<br><br>$${frac(`${linTex(v, p, p * n)} ${op} ${br(linTex(v, q, q * m))}`, denom)} = ${frac(num, denom)}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$${frac(num, denom)}$`,
    };
  }
  throw new Error('alg-fractions.add-subtract: no valid question found');
}

// ── simplify by factorising — 2015 P1 Q12, 2022 P2 Q12, 2023 P2 Q12 ───────
//
// Answer-first. Choose the factors, then print their products, so the fraction
// is guaranteed to cancel. Three shapes appear:
//
//   common factor over trinomial      (x^2-4x)/(x^2+x-20)  -> x/(x+5)
//   difference of squares over trin.  (x^2-16)/(x^2+x-20)  -> (x+4)/(x+5)
//   two letters                       (2ab+6a)/(b^2-9)     -> 2a/(b-3)
//
// Every one satisfies note 4 — numerator and denominator each have two factors.

type Simplified = {
  numTex: string; denTex: string; ansTex: string;
  common: string; numFactors: string; denFactors: string; v: string;
};

function buildSimplify(shape: 'common' | 'squares' | 'two-letter'): Simplified | null {
  if (shape === 'two-letter') {
    // (k·a·b + k·c·a) / (b^2 - c^2)  ->  k·a / (b - c)
    // conventional alphabetical pairs — 6ab - 42a reads properly, 6xn - 42x does not
    // The papers' two-letter fractions use a/b and x/y; m/n is ours.
    const [a, b] = pick([['a', 'b'], ['x', 'y']]);
    const k = getRandomInt(2, 6);
    const c = getRandomInt(2, 9);
    const plus = getRandomInt(0, 1) === 0;      // which denominator factor cancels
    const sgn = plus ? '+' : '-';
    const kept = plus ? `${b} - ${c}` : `${b} + ${c}`;
    return {
      v: b,
      numTex: `${k}${a}${b} ${sgn} ${k * c}${a}`,
      denTex: `${b}^{2} - ${c * c}`,
      ansTex: frac(`${k}${a}`, kept),
      common: `${k}${a}`,
      numFactors: `${k}${a}(${b} ${sgn} ${c})`,
      denFactors: `(${b} - ${c})(${b} + ${c})`,
    };
  }

  // Simplifying: x:6 y:2 in the papers, and no n at all.
  const v = pick(['x', 'x', 'x', 'y']);
  const m = nonZeroInt(-9, 9);                  // the surviving denominator factor

  if (shape === 'common') {
    // (v^2 + kv) / ((v + k)(v + m))  ->  v / (v + m)
    const k = nonZeroInt(-9, 9);
    if (k === m || k === 0) return null;
    const den: Poly = [k * m, k + m, 1];
    if (k + m === 0 || k * m === 0) return null;   // keep a full trinomial
    return {
      v,
      numTex: fmt([0, k, 1], v),
      denTex: fmt(den, v),
      ansTex: frac(v, lin(v, m)),
      common: v,
      numFactors: `${v}(${lin(v, k)})`,
      denFactors: `(${lin(v, k)})(${lin(v, m)})`,
    };
  }

  // squares: (v^2 - c^2) / ((v - c)(v + m))  ->  (v + c) / (v + m)
  const c = getRandomInt(2, 9);
  const cancelPlus = getRandomInt(0, 1) === 0;
  const k = cancelPlus ? c : -c;                // the factor shared with the denominator
  const kept = cancelPlus ? -c : c;             // so the other one survives
  if (k === m) return null;
  const den: Poly = [k * m, k + m, 1];
  if (k + m === 0 || k * m === 0) return null;
  return {
    v,
    numTex: `${v}^{2} - ${c * c}`,
    denTex: fmt(den, v),
    ansTex: frac(lin(v, kept), lin(v, m)),
    common: lin(v, k),
    numFactors: `(${lin(v, -c)})(${lin(v, c)})`,
    denFactors: `(${lin(v, k)})(${lin(v, m)})`,
  };
}

function simplifyFraction(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const s = buildSimplify(pick(['common', 'squares', 'two-letter'] as const));
    if (!s) continue;
    return {
      subTopic: 'Simplifying Algebraic Fractions',
      difficulty: 'exam',
      variationId: 'alg-fractions.simplify',
      questionLines: [`Simplify $${frac(s.numTex, s.denTex)}$`],
      boardQuestionLines: [`Simplify $${frac(s.numTex, s.denTex)}$`],
      solutionSteps: [
        `<strong>1.</strong> Factorise the numerator:<br><br>$${s.numTex} = ${s.numFactors}$`,
        `<strong>2.</strong> Factorise the denominator:<br><br>$${s.denTex} = ${s.denFactors}$`,
        `<strong>3.</strong> Cancel the factor common to both:<br><br>$${frac(s.numFactors, s.denFactors)} = ${s.ansTex}$`,
      ],
      // •¹ factorise numerator, •² factorise denominator, •³ cancel correctly
      stepMarks: [1, 1, 1],
      finalAnswer: `$${s.ansTex}$`,
    };
  }
  throw new Error('alg-fractions.simplify: no valid question found');
}

// ── the scaffolded form — 2017 P2 Q9, 2024 P2 Q6 ──────────────────────────
//
// "(a) Factorise 4x^2-25. (b) Hence simplify (4x^2-25)/(2x^2-x-10)." Two of the
// five simplify questions lead the pupil in this way, and 2017 uses a leading
// coefficient in the denominator, which is the harder trinomial.

function factoriseHence(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const hard = getRandomInt(0, 1) === 0;
    // Simplifying: x:6 y:2 in the papers, and no n at all.
    const v = pick(['x', 'x', 'x', 'y']);

    if (hard) {
      // (k^2 v^2 - c^2) / ((kv - c)(v + m))  ->  (kv + c) / (v + m)
      const k = getRandomInt(2, 4), c = getRandomInt(2, 7), m = nonZeroInt(-6, 6);
      const den: Poly = [-c * m, k * m - c, k];
      if (k * m - c === 0) continue;
      // 4n^2-4 would factorise as (2n-2)(2n+2), which is not fully factorised.
      // The paper's 4x^2-25 keeps the two parts coprime.
      if (gcd(k, c) !== 1) continue;
      const numTex = `${k * k}${v}^{2} - ${c * c}`;
      const numFactors = `(${lin(v, -c, k)})(${lin(v, c, k)})`;
      const denFactors = `(${lin(v, -c, k)})(${lin(v, m)})`;
      return {
        subTopic: 'Simplifying Algebraic Fractions',
        difficulty: 'exam',
        variationId: 'alg-fractions.factorise-simplify',
        questionLines: [
          `(a) Factorise $${numTex}$.`,
          `(b) Hence simplify $${frac(numTex, fmt(den, v))}$.`,
        ],
        boardQuestionLines: [`Factorise $${numTex}$, then simplify $${frac(numTex, fmt(den, v))}$`],
        solutionSteps: [
          `<strong>(a)</strong> This is a difference of two squares:<br><br>$${numTex} = ${numFactors}$`,
          `<strong>(b)</strong> Factorise the denominator:<br><br>$${fmt(den, v)} = ${denFactors}$`,
          `<strong>(b)</strong> Cancel the common factor $(${lin(v, -c, k)})$:<br><br>$${frac(`${lin(v, c, k)}`, `${lin(v, m)}`)}$`,
        ],
        // 2024 P2 Q6 is 1 + 2: •¹ factorise, •² factorise the denominator,
        // •³ simplify
        stepMarks: [1, 1, 1],
        finalAnswer: `(a) $${numFactors}$, (b) $${frac(lin(v, c, k), lin(v, m))}$`,
      };
    }

    // (v^2 + kv) / ((v + k)(v + m))  ->  v / (v + m), led in by the factorising
    const k = nonZeroInt(-9, 9), m = nonZeroInt(-9, 9);
    if (k === m || k + m === 0 || k * m === 0) continue;
    const den: Poly = [k * m, k + m, 1];
    const numTex = fmt([0, k, 1], v);
    return {
      subTopic: 'Simplifying Algebraic Fractions',
      difficulty: 'exam',
      variationId: 'alg-fractions.factorise-simplify',
      questionLines: [
        `(a) Factorise $${numTex}$.`,
        `(b) Hence simplify $${frac(numTex, fmt(den, v))}$.`,
      ],
      boardQuestionLines: [`Factorise $${numTex}$, then simplify $${frac(numTex, fmt(den, v))}$`],
      solutionSteps: [
        `<strong>(a)</strong> Take out the common factor $${v}$:<br><br>$${numTex} = ${v}(${lin(v, k)})$`,
        `<strong>(b)</strong> Factorise the denominator:<br><br>$${fmt(den, v)} = (${lin(v, k)})(${lin(v, m)})$`,
        `<strong>(b)</strong> Cancel the common factor $(${lin(v, k)})$:<br><br>$${frac(v, `${lin(v, m)}`)}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `(a) $${v}(${lin(v, k)})$, (b) $${frac(v, lin(v, m))}$`,
    };
  }
  throw new Error('alg-fractions.factorise-simplify: no valid question found');
}

// ── multiply — Zeta only, no paper has ever asked it on its own ───────────
//
// Skill tier by construction: there is no exam shape to ground it in, so it
// carries an empty basedOn and shows only under the Skills filter.

function multiply(): Q {
  const monomial = getRandomInt(0, 1) === 0;

  if (monomial) {
    // (p·s / t) x (q·t^2 / s)  ->  p·q·s·t, cancelling one of each letter
      // The one two-letter multiply/divide question in the papers uses s and t.
      const s = 's', t = 't';
    const p = getRandomInt(2, 6), q = getRandomInt(2, 6);
    return {
      subTopic: 'Multiplying Algebraic Fractions',
      difficulty: 'skill',
      variationId: 'alg-fractions.multiply',
      questionLines: [`Express $${frac(`${p}${s}`, t)} \\times ${frac(`${q}${t}^{2}`, s)}$ in its simplest form.`],
      boardQuestionLines: [`$${frac(`${p}${s}`, t)} \\times ${frac(`${q}${t}^{2}`, s)}$`],
      solutionSteps: [
        `<strong>1.</strong> Multiply the numerators and the denominators:<br><br>$${frac(`${p * q}${s}${t}^{2}`, `${t}${s}`)}$`,
        `<strong>2.</strong> Cancel one $${s}$ and one $${t}$:<br><br>$${p * q}${t}$`,
      ],
      finalAnswer: `$${p * q}${t}$`,
    };
  }

  // (v + a)/(v + b) x (v + b)/(v + c)  ->  (v + a)/(v + c)
  // Multiply or divide: x:2 n:1 in the papers; y appears in none.
  const v = pick(['x', 'x', 'n']);
  const [a, b, c] = [nonZeroInt(-8, 8), nonZeroInt(-8, 8), nonZeroInt(-8, 8)];
  if (a === b || b === c || a === c) return multiply();
  return {
    subTopic: 'Multiplying Algebraic Fractions',
    difficulty: 'skill',
    variationId: 'alg-fractions.multiply',
    questionLines: [
      `Express $${frac(`${lin(v, a)}`, `${lin(v, b)}`)} \\times ${frac(`${lin(v, b)}`, `${lin(v, c)}`)}$ in its simplest form.`,
    ],
    boardQuestionLines: [`$${frac(`${lin(v, a)}`, `${lin(v, b)}`)} \\times ${frac(`${lin(v, b)}`, `${lin(v, c)}`)}$`],
    solutionSteps: [
      `<strong>1.</strong> Multiply across:<br><br>$${frac(`(${lin(v, a)})(${lin(v, b)})`, `(${lin(v, b)})(${lin(v, c)})`)}$`,
      `<strong>2.</strong> Cancel the factor $(${lin(v, b)})$, which appears top and bottom:<br><br>$${frac(`${lin(v, a)}`, `${lin(v, c)}`)}$`,
    ],
    finalAnswer: `$${frac(lin(v, a), lin(v, c))}$`,
  };
}

// ── divide — 2015 P2 Q7, 2018 P2 Q15, 2022 P1 Q12 ────────────────────────
//
// Three questions, three genuinely different shapes, so all three are built.

function divide(): Q {
  const shape = pick(['monomial', 'factorise', 'powers'] as const);

  if (shape === 'monomial') {
    // 2015 P2 Q7: (5t/s) / (t/2s^2) = 10s
    // The one two-letter multiply/divide question in the papers uses s and t.
    const s = 's', t = 't';
    const p = getRandomInt(2, 7), q = getRandomInt(2, 5);
    return {
      subTopic: 'Dividing Algebraic Fractions',
      difficulty: 'skill',
      variationId: 'alg-fractions.divide',
      questionLines: [`Express $${frac(`${p}${t}`, s)} \\div ${frac(t, `${q}${s}^{2}`)}$ in its simplest form.`],
      boardQuestionLines: [`$${frac(`${p}${t}`, s)} \\div ${frac(t, `${q}${s}^{2}`)}$`],
      solutionSteps: [
        `<strong>1.</strong> Dividing by a fraction is multiplying by its reciprocal:<br><br>$${frac(`${p}${t}`, s)} \\times ${frac(`${q}${s}^{2}`, t)}$`,
        `<strong>2.</strong> Multiply across:<br><br>$${frac(`${p * q}${t}${s}^{2}`, `${s}${t}`)}$`,
        `<strong>3.</strong> Cancel one $${t}$ and one $${s}$:<br><br>$${p * q}${s}$`,
      ],
      // 2015 P2 Q7, 2018 P2 Q15: •¹ start to divide, •² continue the process,
      // •³ express in simplest form
      stepMarks: [1, 1, 1],
      finalAnswer: `$${p * q}${s}$`,
    };
  }

  if (shape === 'powers') {
    // 2022 P1 Q12: 4/(x+2) / (5/(x+2)^2) = 4(x+2)/5
    // Multiply or divide: x:2 n:1 in the papers; y appears in none.
    const v = pick(['x', 'x', 'n']);
    const m = nonZeroInt(-8, 8);
    const p = getRandomInt(2, 9), q = getRandomInt(2, 9);
    if (gcd(p, q) !== 1) return divide();       // keep the coefficients in lowest terms
    const d = lin(v, m);
    return {
      subTopic: 'Dividing Algebraic Fractions',
      difficulty: 'skill',
      variationId: 'alg-fractions.divide-simple',
      questionLines: [
        `Express $${frac(`${p}`, d)} \\div ${frac(`${q}`, `(${d})^{2}`)}$, $${v} \\neq ${-m}$,`,
        `as a single fraction in its simplest form.`,
      ],
      boardQuestionLines: [`$${frac(`${p}`, d)} \\div ${frac(`${q}`, `(${d})^{2}`)}$`],
      solutionSteps: [
        `<strong>1.</strong> Multiply by the reciprocal:<br><br>$${frac(`${p}`, d)} \\times ${frac(`(${d})^{2}`, `${q}`)}$`,
        `<strong>2.</strong> Cancel one factor of $(${d})$:<br><br>$${frac(`${p}(${d})`, `${q}`)}$`,
      ],
      // 2022 P1 Q12 is the two-mark shape — •¹ start to divide, •² simplify —
      // with nothing to factorise in between, which is why it is a separate id
      // from the three-mark divisions above.
      stepMarks: [1, 1],
      finalAnswer: `$${frac(`${p}(${d})`, `${q}`)}$`,
    };
  }

  // 2018 P2 Q15: n/(n^2-4) / (3/(n-2)) = n/(3(n+2))
  // Multiply or divide: x:2 n:1 in the papers; y appears in none.
  const v = pick(['x', 'x', 'n']);
  const c = getRandomInt(2, 7);
  const p = getRandomInt(2, 7);
  const minus = getRandomInt(0, 1) === 0;       // which factor the second fraction uses
  const shared = minus ? lin(v, -c) : lin(v, c);
  const kept = minus ? lin(v, c) : lin(v, -c);
  return {
    subTopic: 'Dividing Algebraic Fractions',
    difficulty: 'exam',
    variationId: 'alg-fractions.divide',
    questionLines: [
      `Express $${frac(v, `${v}^{2} - ${c * c}`)} \\div ${frac(`${p}`, shared)}$, $${v} \\neq ${c}$, $${v} \\neq ${-c}$,`,
      `as a single fraction in its simplest form.`,
    ],
    boardQuestionLines: [`$${frac(v, `${v}^{2} - ${c * c}`)} \\div ${frac(`${p}`, shared)}$`],
    solutionSteps: [
      `<strong>1.</strong> Multiply by the reciprocal:<br><br>$${frac(v, `${v}^{2} - ${c * c}`)} \\times ${frac(shared, `${p}`)}$`,
      `<strong>2.</strong> The denominator is a difference of two squares:<br><br>$${v}^{2} - ${c * c} = (${lin(v, -c)})(${lin(v, c)})$`,
      `<strong>3.</strong> Cancel the factor $(${shared})$:<br><br>$${frac(v, `${p}(${kept})`)}$`,
    ],
    // 2018 P2 Q15: •¹ start to divide, •² factorise, •³ multiply and simplify
    stepMarks: [1, 1, 1],
    finalAnswer: `$${frac(v, `${p}(${kept})`)}$`,
  };
}

// ── applied: a gradient that simplifies — 2019 P2 Q13 ────────────────────
//
// "Find an expression for the gradient of the line joining A(6,9) to B(4p,4p^2)."
// Both points sit on x = 2t, y = t^2, so the gradient is
//   (t2^2 - t1^2) / (2t2 - 2t1) = (t2 + t1) / 2
// — a difference of two squares over a common factor, which is why the answer
// simplifies. The paper's t1 = 3 and t2 = 2p give (2p + 3)/2.

function gradientContext(): Q {
  for (let tries = 0; tries < 200; tries++) {
    // 2019 P2 Q13 writes "B(4p,4p²)" in prose rather than LaTeX, which is why
    // the letter check could not see its `p` until it learned to read prose - and
    // duly reported `p` as off-book against the variation cloning that question.
    // That `p` is the question's own letter; `t` and `k` were ours.
    const v = 'p';
    const k = getRandomInt(1, 4);               // B = (2kv, k^2 v^2)
    const c = getRandomInt(2, 9);               // A = (2c, c^2)
    // the paper's (2p + 3)/2 has coprime parts; k=3, c=6 would give 3(t + 2)/2,
    // which a marker would expect to see factorised
    if (gcd(k, c) !== 1) continue;

    const bx = k === 1 ? `2${v}` : `${2 * k}${v}`;
    const by = k === 1 ? `${v}^2` : `${k * k}${v}^2`;
    const num = `${k === 1 ? '' : k}${v} + ${c}`;

    return {
      subTopic: 'Gradient as an Algebraic Fraction',
      difficulty: 'exam',
      variationId: 'alg-fractions.gradient-context',
      questionLines: [
        `Find an expression for the gradient of the line joining point $A(${2 * c}, ${c * c})$`,
        `to point $B(${bx}, ${by})$. Give your answer in its simplest form.`,
      ],
      boardQuestionLines: [`Gradient of $A(${2 * c}, ${c * c})$ to $B(${bx}, ${by})$, simplified`],
      solutionSteps: [
        `<strong>1.</strong> Substitute into the gradient formula $m = ${frac('y_{2} - y_{1}', 'x_{2} - x_{1}')}$:<br><br>$m = ${frac(`${by} - ${c * c}`, `${bx} - ${2 * c}`)}$`,
        `<strong>2.</strong> The numerator is a difference of two squares:<br><br>$${by} - ${c * c} = (${k === 1 ? '' : k}${v} - ${c})(${k === 1 ? '' : k}${v} + ${c})$`,
        `<strong>3.</strong> Take the common factor out of the denominator, then cancel $(${k === 1 ? '' : k}${v} - ${c})$:<br><br>$${bx} - ${2 * c} = 2(${k === 1 ? '' : k}${v} - ${c})$, so $m = ${frac(num, '2')}$`,
      ],
      // 2019 P2 Q13: •¹ substitute into the gradient formula, •² factorise by
      // difference of two squares, •³ factorise by common factor and simplify —
      // the common factor and the cancelling are one mark between them
      stepMarks: [1, 1, 1],
      finalAnswer: `$${frac(num, '2')}$`,
    };
  }
  throw new Error('alg-fractions.gradient-context: no valid question found');
}

// ── the squares on top instead — 2026 P2 Q9 ──────────────────────────────
//
// (x² − 81)/5 ÷ (x + 9)/2 = 2(x − 9)/5.
//
// `alg-fractions.divide` puts the difference of two squares in a *denominator*
// and cancels down to a fraction with a bracket underneath, which is 2018 P2
// Q15. Here it is in the numerator, both the other terms are plain numbers, and
// what survives is a bracket over a number. The same three moves in the
// opposite arrangement — and a pupil who has only met the first will go looking
// for something to factorise on the bottom and find nothing there.

function divideFactoriseNumerator(): Q {
  for (let tries = 0; tries < 200; tries++) {
    // Multiply or divide: x:2 n:1 in the papers; y appears in none.
    const v = pick(['x', 'x', 'n']);
    const c = getRandomInt(2, 12);
    const a = getRandomInt(2, 9);              // under the difference of squares
    const b = getRandomInt(2, 9);              // under the linear factor
    if (gcd(a, b) !== 1) continue;             // else the numbers cancel too, which is a different question
    const minus = getRandomInt(0, 1) === 0;    // which factor the divisor carries
    const shared = minus ? lin(v, -c) : lin(v, c);
    const kept = minus ? lin(v, c) : lin(v, -c);
    const answer = frac(`${b}(${kept})`, `${a}`);

    return {
      subTopic: 'Dividing with a Difference of Squares',
      difficulty: 'exam',
      variationId: 'alg-fractions.divide-squares-on-top',
      questionLines: [
        `Express $${frac(`${v}^{2} - ${c * c}`, `${a}`)} \\div ${frac(shared, `${b}`)}$, $${v} \\neq ${minus ? c : -c}$,`,
        'as a single fraction in its simplest form.',
      ],
      boardQuestionLines: [`$${frac(`${v}^{2} - ${c * c}`, `${a}`)} \\div ${frac(shared, `${b}`)}$`],
      solutionSteps: [
        `<strong>1.</strong> Dividing by a fraction is multiplying by its reciprocal:<br><br>$${frac(`${v}^{2} - ${c * c}`, `${a}`)} \\times ${frac(`${b}`, shared)}$`,
        `<strong>2.</strong> The numerator is a difference of two squares, so factorise it:<br><br>$${v}^{2} - ${c * c} = (${lin(v, -c)})(${lin(v, c)})$`,
        `<strong>3.</strong> Cancel the factor $(${shared})$, top and bottom:<br><br>$${answer}$`,
      ],
      // 2026 P2 Q9 has no published scheme. Three marks, and the split follows
      // 2018 P2 Q15 — the same question the other way up: start to divide,
      // factorise, then multiply out and simplify.
      stepMarks: [1, 1, 1],
      finalAnswer: `$${answer}$`,
    };
  }
  throw new Error('alg-fractions.divide-squares-on-top: no valid question found');
}

export const ALG_FRACTION_GENERATORS: Record<string, () => Q> = {
  'Simplifying Algebraic Fractions': () =>
    (getRandomInt(1, 5) <= 3 ? simplifyFraction() : factoriseHence()),
  'Adding Algebraic Fractions': () => addSubtract(false),
  'Subtracting Algebraic Fractions': () => addSubtract(true),
  'Multiplying Algebraic Fractions': multiply,
  'Dividing Algebraic Fractions': divide,
  'Dividing with a Difference of Squares': divideFactoriseNumerator,
  'Gradient as an Algebraic Fraction': gradientContext,
};
