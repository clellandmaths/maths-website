import { GeneratedQuestion } from './types';
import { getRandomInt, gcd, nonZeroInt } from './utils';
import { fmt, bracket, type Poly } from './n5-expanding';

/**
 * National 5 Factorising.
 *
 * The specification names four cases and then, importantly, a fifth:
 *   "Common factor, Difference of squares p^2x^2 - a^2, Trinomials with
 *    unitary and non-unitary x^2 coefficient, **Combinations of the above**"
 * and separately
 *   "Solving a quadratic equation — solving from factorised form, solving
 *    having factorised first".
 *
 * Zeta splits the trinomial case in two, simple and hard, which is how it is
 * taught: the unitary case is a pair of factors of the constant, the non-unitary
 * one needs trial and error.
 *
 * The papers ask the combination (2016 P2 Q4, "factorise fully 3x^2-48") and
 * both solving cases (2018 P1 Q5 unitary, 2026 P1 Q14 non-unitary, where the
 * roots are fractions).
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
/**
 * `x` three times in four, `y` once, and never `a` or `p`.
 *
 * The four paper questions tagged *Factorising* run x:3, y:1. Ours ran four
 * letters evenly, so `factorising.trinomial-simple` printed `x` in **23%** of
 * draws - a pupil met the course's most familiar question in an unfamiliar
 * letter three times out of four.
 *
 * **The solving variations do not use this pool.** They file under *Quadratic
 * equation by factorising*, whose papers run x:4, h:2, t:2 - and the `h` and
 * `t` are the two contextual questions, height and time. Ours are bare
 * algebra, so they take `x` outright at the call site rather than inheriting a
 * `y` that would be off-book for them. See `__checks__/variables.ts`.
 */
const VARS = ['x', 'x', 'x', 'y'];
type Q = Omit<GeneratedQuestion, 'topic'>;

const SQUARES = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144];
const sqrt = (n: number) => Math.round(Math.sqrt(n));

/** A root as a whole number or a fraction in lowest terms. */
function root(num: number, den: number): string {
  const g = gcd(Math.abs(num), Math.abs(den));
  let [n, d] = [num / g, den / g];
  if (d < 0) { n = -n; d = -d; }
  if (d === 1) return `${n}`;
  return n < 0 ? `-\\frac{${-n}}{${d}}` : `\\frac{${n}}{${d}}`;
}

// ── skill: common factor — Zeta "4x^2+8x = 4x(x+2)", practice "12x^2-20x" ─

function commonFactor(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const v = pick(VARS);
    const withX = getRandomInt(0, 1) === 1;       // 12x^2-20x, or 10x^2-5
    const k = getRandomInt(2, 9);                 // the numeric common factor
    const a = nonZeroInt(1, 6), b = nonZeroInt(-9, 9);
    if (gcd(Math.abs(a), Math.abs(b)) !== 1) continue;   // or k is not the whole factor
    const inner: Poly = withX ? [b, a] : [b, 0, a];
    const outer = withX ? `${k === 1 ? '' : k}${v}` : `${k}`;
    const expanded: Poly = withX
      ? [0, k * b, k * a]
      : [k * b, 0, k * a];
    return {
      subTopic: 'Factorising a Common Factor',
      difficulty: 'skill',
      variationId: 'factorising.common-factor',
      questionLines: [`Factorise $${fmt(expanded, v)}$`],
      boardQuestionLines: [`$${fmt(expanded, v)}$`],
      solutionSteps: [
        `<strong>1.</strong> Find what every term has in common:<br><br>each term divides by $${outer}$`,
        `<strong>2.</strong> Take it outside the bracket:<br><br>$${outer}${bracket(inner, v)}$`,
      ],
      finalAnswer: `$${outer}${bracket(inner, v)}$`,
    };
  }
  throw new Error('factorising.common-factor: no valid question found');
}

// ── skill: difference of two squares — spec "p^2x^2 - a^2" ───────────────

function differenceOfSquares(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const v = pick(VARS);
    const p2 = pick(SQUARES.slice(0, 6));         // coefficient of x^2, a square
    const a2 = pick(SQUARES);
    const p = sqrt(p2), a = sqrt(a2);
    if (a2 === p2) continue;
    if (gcd(p2, a2) !== 1) continue;              // else it needs a common factor first
    const expanded: Poly = [-a2, 0, p2];
    return {
      subTopic: 'Difference of Two Squares',
      difficulty: 'skill',
      variationId: 'factorising.difference-squares',
      questionLines: [`Factorise $${fmt(expanded, v)}$`],
      boardQuestionLines: [`$${fmt(expanded, v)}$`],
      solutionSteps: [
        `<strong>1.</strong> Both terms are squares:<br><br>$${fmt([0, 0, p2], v)} = (${p === 1 ? '' : p}${v})^{2}$ and $${a2} = ${a}^{2}$`,
        `<strong>2.</strong> A difference of two squares factorises as $A^{2}-B^{2} = (A+B)(A-B)$:<br><br>$${bracket([a, p], v)}${bracket([-a, p], v)}$`,
      ],
      finalAnswer: `$${bracket([a, p], v)}${bracket([-a, p], v)}$`,
    };
  }
  throw new Error('factorising.difference-squares: no valid question found');
}

// ── skill: trinomial, unitary — Zeta "simple", practice "x^2+11x+10" ──────

function trinomialSimple(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const v = pick(VARS);
    const r1 = nonZeroInt(-9, 9), r2 = nonZeroInt(-9, 9);
    const b = r1 + r2, c = r1 * r2;
    if (!b) continue;                             // b = 0 makes it a difference of squares
    const expanded: Poly = [c, b, 1];
    return {
      subTopic: 'Factorising a Trinomial',
      difficulty: 'skill',
      variationId: 'factorising.trinomial-simple',
      questionLines: [`Factorise $${fmt(expanded, v)}$`],
      boardQuestionLines: [`$${fmt(expanded, v)}$`],
      solutionSteps: [
        `<strong>1.</strong> Find two numbers that multiply to give $${c}$ and add to give $${b}$:<br><br>$${r1}$ and $${r2}$`,
        `<strong>2.</strong> Write the brackets:<br><br>$${bracket([r1, 1], v)}${bracket([r2, 1], v)}$`,
      ],
      finalAnswer: `$${bracket([r1, 1], v)}${bracket([r2, 1], v)}$`,
    };
  }
  throw new Error('factorising.trinomial-simple: no valid question found');
}

// ── skill: trinomial, non-unitary — Zeta "hard", spec "non-unitary" ──────

function trinomialHard(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const v = pick(VARS);
    const m = getRandomInt(2, 5), n = getRandomInt(1, 4);
    const p = nonZeroInt(-6, 6), q = nonZeroInt(-6, 6);
    if (m === 1 && n === 1) continue;
    if (gcd(m, Math.abs(p)) !== 1 || gcd(n, Math.abs(q)) !== 1) continue;  // no hidden common factor
    const a = m * n, b = m * q + n * p, c = p * q;
    if (!b || a < 2) continue;
    if (gcd(gcd(a, Math.abs(b)), Math.abs(c)) !== 1) continue;             // else factorise fully first
    if (Math.abs(b) > 40 || Math.abs(c) > 40) continue;
    const expanded: Poly = [c, b, a];
    return {
      subTopic: 'Factorising a Harder Trinomial',
      difficulty: 'skill',
      variationId: 'factorising.trinomial-hard',
      questionLines: [`Factorise $${fmt(expanded, v)}$`],
      boardQuestionLines: [`$${fmt(expanded, v)}$`],
      solutionSteps: [
        `<strong>1.</strong> The $${v}^{2}$ terms must multiply to give $${fmt([0, 0, a], v)}$, and the constants to give $${c}$.`,
        `<strong>2.</strong> Try pairs until the outsides and insides add to $${fmt([0, b], v)}$:<br><br>$${m}${v} \\times ${q} + ${n}${v} \\times ${p} = ${fmt([0, b], v)}$`,
        `<strong>3.</strong> Write the brackets:<br><br>$${bracket([p, m], v)}${bracket([q, n], v)}$`,
      ],
      finalAnswer: `$${bracket([p, m], v)}${bracket([q, n], v)}$`,
    };
  }
  throw new Error('factorising.trinomial-hard: no valid question found');
}

// ── shape: factorise fully — 2016 P2 Q4 "3x^2-48", practice "12x^2-27y^2" ─
//
// The specification's "combinations of the above": a common factor first, then
// a difference of two squares. "Fully" is the word that signals it.

function fully(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const v = pick(VARS);
    const k = getRandomInt(2, 6);
    const p2 = pick([1, 1, 4, 9]);
    const a2 = pick(SQUARES.slice(1));
    const p = sqrt(p2), a = sqrt(a2);
    if (p2 === a2 || gcd(p2, a2) !== 1) continue;
    const expanded: Poly = [-k * a2, 0, k * p2];
    if (Math.abs(k * a2) > 300) continue;
    return {
      subTopic: 'Factorising Fully',
      difficulty: 'exam',
      variationId: 'factorising.fully',
      questionLines: [`Factorise fully $${fmt(expanded, v)}$`],
      boardQuestionLines: [`$${fmt(expanded, v)}$`],
      // 2016 P2 Q4 is two marks — •¹ begin to factorise, •² factorise fully —
      // so "put it together" was a third step earning nothing, and it was the
      // step the app withholds.
      solutionSteps: [
        `<strong>1.</strong> Take out the common factor first:<br><br>$${fmt(expanded, v)} = ${k}${bracket([-a2, 0, p2], v)}$`,
        `<strong>2.</strong> What is left is a difference of two squares, so factorise it and put the whole thing together:<br><br>$${fmt([-a2, 0, p2], v)} = ${bracket([a, p], v)}${bracket([-a, p], v)}$, giving $${k}${bracket([a, p], v)}${bracket([-a, p], v)}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${k}${bracket([a, p], v)}${bracket([-a, p], v)}$`,
    };
  }
  throw new Error('factorising.fully: no valid question found');
}

// ── shape: solve by factorising — 2018 P1 Q5, 2026 P1 Q14 ───────────────
//
// 2018 is unitary with whole-number roots; 2026 is non-unitary and the roots
// are fractions, 2/5 and -3/2. Both forms are generated, and they are two
// variations rather than one because the exam prices them differently: the
// unitary form is two marks and the non-unitary three. Under one id the
// non-unitary questions were printed as two, which is the shape a pupil most
// needs the third mark explained on.

function solveByFactorising(): Q {
  const hard = getRandomInt(0, 1) === 1;
  for (let tries = 0; tries < 400; tries++) {
    // Not `VARS`: this files under a different subtopic, whose only bare-algebra
    // letter in the papers is `x`. See the note on VARS above.
    const v = 'x';
    const m = hard ? getRandomInt(2, 5) : 1;
    const n = hard ? getRandomInt(2, 4) : 1;
    const p = nonZeroInt(-6, 6), q = nonZeroInt(-6, 6);
    if (gcd(m, Math.abs(p)) !== 1 || gcd(n, Math.abs(q)) !== 1) continue;
    const a = m * n, b = m * q + n * p, c = p * q;
    if (!b || !c) continue;
    if (gcd(gcd(a, Math.abs(b)), Math.abs(c)) !== 1) continue;
    if (Math.abs(b) > 40 || Math.abs(c) > 40) continue;
    const expanded: Poly = [c, b, a];
    const rootA = root(-p, m), rootB = root(-q, n);
    if (rootA === rootB) continue;                // two equal roots is a different question

    const shared = {
      subTopic: 'Solving by Factorising' as const,
      difficulty: 'exam' as const,
      questionLines: [`Solve the equation by factorising $${fmt(expanded, v)} = 0$`],
      boardQuestionLines: [`$${fmt(expanded, v)} = 0$`],
      finalAnswer: `$${v} = ${rootA}$ and $${v} = ${rootB}$`,
    };
    const solveStep =
      `A product is zero when either bracket is zero, so solve each:<br><br>$${fmt([p, m], v)} = 0$ or $${fmt([q, n], v)} = 0$, giving $${v} = ${rootA}$ or $${v} = ${rootB}$`;

    if (!hard) {
      return {
        ...shared,
        variationId: 'factorising.solve',
        // 2018 P1 Q5 is two marks: •¹ correct factorisation, •² solve for x.
        // Setting each bracket to zero is part of solving, not a mark of its own.
        solutionSteps: [
          `<strong>1.</strong> Factorise the left hand side:<br><br>$${bracket([p, m], v)}${bracket([q, n], v)} = 0$`,
          `<strong>2.</strong> ${solveStep}`,
        ],
        stepMarks: [1, 1],
      };
    }
    // 2026 P1 Q14, three marks and no published scheme. The extra mark over the
    // unitary form is the factorising itself, which takes two moves rather than
    // one: the leading coefficient has to be split before the constant can be,
    // and a pupil who gets the pair of first terms right and the second pair
    // wrong has earned something. Inferred, and flagged as such in the registry.
    return {
      ...shared,
      variationId: 'factorising.solve-non-unitary',
      solutionSteps: [
        `<strong>1.</strong> The $${v}^{2}$ term is not on its own, so start with a pair that multiplies to give it:<br><br>$${a} = ${m} \\times ${n}$, so the brackets open $(${m === 1 ? '' : m}${v} \\ldots)(${n === 1 ? '' : n}${v} \\ldots)$`,
        `<strong>2.</strong> Now find the second pair. They must multiply to $${c}$, and the outsides and insides must add to $${fmt([0, b], v)}$:<br><br>$${bracket([p, m], v)}${bracket([q, n], v)} = 0$`,
        `<strong>3.</strong> ${solveStep}`,
      ],
      stepMarks: [1, 1, 1],
    };
  }
  throw new Error('factorising.solve: no valid question found');
}

export const FACTORISING_GENERATORS: Record<string, () => Q> = {
  'Factorising a Common Factor': commonFactor,
  'Difference of Two Squares': differenceOfSquares,
  'Factorising a Trinomial': trinomialSimple,
  'Factorising a Harder Trinomial': trinomialHard,
  'Factorising Fully': fully,
  'Solving by Factorising': solveByFactorising,
};
