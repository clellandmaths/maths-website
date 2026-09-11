import { GeneratedQuestion } from './types';
import { getRandomInt, gcd, nonZeroInt } from './utils';

/**
 * How heavy a denominator this variation's ANSWER may print.
 *
 * Chosen by the user on 2026-09-10 from a priced table, and every number is
 * anchored to what the cited paper's own answer uses. These are judgements
 * about difficulty rather than fixes for faults - nothing here was wrong, it
 * was heavier than the exam sets, and four of the five are non-calculator.
 *
 * **Cost was not the constraint.** Measured at 600 draws, even the strictest
 * column considered left more than 200 distinct questions per variation, and a
 * sheet needs six. The only thing at stake was how hard they should be.
 */
/** linear-equations.clear-denominators */
const MAX_CLEAR_DEN = 12;

/**
 * National 5 linear equations.
 *
 * The largest gap the practice audit found after Rounding, and a more
 * surprising one: solving a linear equation is the most fundamental algebra in
 * the course and there was no topic for it at all. The name-matching audit had
 * passed it, because "equations" appears in *Solving Simultaneous Equations* —
 * a match on a word is not a match on a skill.
 *
 * maths.scot's nine questions are a complete progression, and each stage is
 * built here:
 *
 *   3x - 2 = 5                    one unknown, and the answer is a fraction
 *   9 - 4a = 1                    the unknown behind a subtraction
 *   7t + 8 = 32 - 5t              unknowns on both sides
 *   4n - 3 = 3(3n - 2)            a bracket to expand first
 *   6 - 2(3x - 5) = -10x          a bracket behind a subtraction
 *   x/3 - 2 = x                   a single fraction
 *   (x-2)/3 = (2x+1)/2            a fraction on each side
 *   (5/6)a - 2 = (3a+4)/8         both kinds at once
 *
 * Five of the nine have fractional answers, so everything is kept in exact
 * rationals and the answer is printed as a fraction. Rounding here would be
 * wrong, not merely untidy.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

/**
 * A linear equation is solved for `x`.
 *
 * **Ten of the ten** paper questions tagged *Linear equations and inequations*
 * use `x`, and nothing else - the most one-sided convention in the course. This
 * used to rotate six letters, so `clear-denominators` solved for something the
 * exam never asks for in 88% of draws, and the warm-ups were worse:
 * `linear-equations.basic` printed `x` **13%** of the time.
 *
 * That the warm-ups drifted furthest is the part worth keeping. They cite no
 * paper, so nothing could measure them against one - and they are the first
 * equations a struggling pupil meets, where an unfamiliar letter costs most.
 * A warm-up inherits the convention of the exam variation of the same skill;
 * there is no separate evidence for it and none is needed.
 *
 * See `__checks__/variables.ts`.
 */
const VARS = ['x'];

/** A fraction in lowest terms as LaTeX, or an integer when it divides. */
function frac(n: number, d: number): string {
  const g = gcd(Math.abs(n), Math.abs(d)) || 1;
  let [a, b] = [n / g, d / g];
  if (b < 0) { a = -a; b = -b; }
  if (b === 1) return `${a}`;
  return a < 0 ? `-\\frac{${-a}}{${b}}` : `\\frac{${a}}{${b}}`;
}

/** "3x", "-x", "x" — a coefficient on a letter. */
const term = (k: number, v: string): string =>
  (k === 1 ? v : k === -1 ? `-${v}` : `${k}${v}`);

/** "3x - 4", with the constant's sign folded in, and no term when it is zero. */
function lin(k: number, c: number, v: string): string {
  if (k === 0) return `${c}`;
  if (c === 0) return term(k, v);
  return `${term(k, v)} ${c < 0 ? '-' : '+'} ${Math.abs(c)}`;
}

/** The two closing steps every one of these ends with. */
function finish(k: number, c: number, v: string): string[] {
  return [
    `<strong>Collect:</strong><br><br>$${term(k, v)} = ${c}$`,
    k === 1
      ? `<strong>The unknown is already on its own:</strong><br><br>$${v} = ${c}$`
      : `<strong>Divide both sides by $${k}$:</strong><br><br>$${v} = ${frac(c, k)}$`,
  ];
}

// ── one unknown, or an unknown on each side ──────────────────────────────

function solveLinear(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const v = pick(VARS);
    const bothSides = getRandomInt(0, 1) === 0;
    const a = nonZeroInt(-9, 9), b = nonZeroInt(-15, 15);
    const c = bothSides ? nonZeroInt(-9, 9) : 0;
    const d = nonZeroInt(-20, 20);
    if (a === c) continue;                       // the unknowns would cancel
    // a·v + b = c·v + d
    const k = a - c, rhs = d - b;
    if (rhs === 0) continue;                     // an answer of zero teaches little

    const left = lin(a, b, v);
    const right = bothSides ? lin(c, d, v) : `${d}`;

    return {
      subTopic: 'Solving Linear Equations',
      difficulty: 'skill',
      variationId: 'linear-equations.basic',
      questionLines: [`Solve $${left} = ${right}$`],
      boardQuestionLines: [`Solve $${left} = ${right}$`],
      solutionSteps: [
        bothSides
          ? `<strong>1.</strong> Gather the $${v}$ terms on one side and the numbers on the other:<br><br>$${term(a, v)} - ${term(Math.abs(c), v)} = ${d} - ${b}$`.replace('- -', '+ ')
          : `<strong>1.</strong> ${b < 0 ? `Add $${-b}$ to` : `Subtract $${b}$ from`} both sides:<br><br>$${term(a, v)} = ${rhs}$`,
        ...finish(k, rhs, v).map((s, i) => `<strong>${i + 2}.</strong> ${s.replace(/<strong>|<\/strong>/g, '')}`),
      ],
      finalAnswer: `$${v} = ${frac(rhs, k)}$`,
    };
  }
  throw new Error('linear-equations.basic: no valid question found');
}

// ── a bracket to expand first ────────────────────────────────────────────

function solveWithBracket(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const v = pick(VARS);
    const outside = nonZeroInt(-6, 6);
    const inK = nonZeroInt(-5, 5), inC = nonZeroInt(-9, 9);
    const bracketOnRight = getRandomInt(0, 1) === 0;
    const otherK = nonZeroInt(-9, 9), otherC = getRandomInt(-15, 15);

    // outside(inK·v + inC) on one side, otherK·v + otherC on the other
    const bk = outside * inK, bc = outside * inC;
    const k = bracketOnRight ? otherK - bk : bk - otherK;
    const rhs = bracketOnRight ? bc - otherC : otherC - bc;
    if (k === 0 || rhs === 0) continue;

    const bracket = `${outside === 1 ? '' : outside === -1 ? '-' : outside}(${lin(inK, inC, v)})`;
    const other = lin(otherK, otherC, v);
    const [left, right] = bracketOnRight ? [other, bracket] : [bracket, other];

    return {
      subTopic: 'Equations with Brackets',
      difficulty: 'skill',
      variationId: 'linear-equations.brackets',
      questionLines: [`Solve $${left} = ${right}$`],
      boardQuestionLines: [`Solve $${left} = ${right}$`],
      solutionSteps: [
        `<strong>1.</strong> Expand the bracket. Every term inside is multiplied by $${outside}$${outside < 0 ? ', so both signs change' : ''}:<br><br>$${bracketOnRight ? `${other} = ${lin(bk, bc, v)}` : `${lin(bk, bc, v)} = ${other}`}$`,
        `<strong>2.</strong> Gather the $${v}$ terms on one side and the numbers on the other:<br><br>$${term(k, v)} = ${rhs}$`,
        k === 1
          ? `<strong>3.</strong> The unknown is already on its own:<br><br>$${v} = ${rhs}$`
          : `<strong>3.</strong> Divide both sides by $${k}$:<br><br>$${v} = ${frac(rhs, k)}$`,
      ],
      finalAnswer: `$${v} = ${frac(rhs, k)}$`,
    };
  }
  throw new Error('linear-equations.brackets: no valid question found');
}

// ── fractions, on one side or both ───────────────────────────────────────

function solveWithFractions(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const v = pick(VARS);
    const bothSides = getRandomInt(0, 1) === 0;

    if (bothSides) {
      // (p·v + q)/m = (r·v + s)/n
      const [m, n] = [getRandomInt(2, 6), getRandomInt(2, 6)];
      if (m === n) continue;
      const p = nonZeroInt(-4, 4), q = nonZeroInt(-9, 9);
      const r = nonZeroInt(-4, 4), s = nonZeroInt(-9, 9);
      // cross-multiply: n(p·v + q) = m(r·v + s)
      const k = n * p - m * r, rhs = m * s - n * q;
      if (k === 0 || rhs === 0) continue;

      return {
        subTopic: 'Equations with Fractions',
        difficulty: 'skill',
        variationId: 'linear-equations.fractions',
        questionLines: [`Solve $\\frac{${lin(p, q, v)}}{${m}} = \\frac{${lin(r, s, v)}}{${n}}$`],
        boardQuestionLines: [`Solve $\\frac{${lin(p, q, v)}}{${m}} = \\frac{${lin(r, s, v)}}{${n}}$`],
        solutionSteps: [
          `<strong>1.</strong> Multiply both sides by $${m}$ and by $${n}$ to clear the fractions — cross-multiplying does both at once:<br><br>$${n}(${lin(p, q, v)}) = ${m}(${lin(r, s, v)})$`,
          `<strong>2.</strong> Expand each side:<br><br>$${lin(n * p, n * q, v)} = ${lin(m * r, m * s, v)}$`,
          `<strong>3.</strong> Gather the $${v}$ terms and the numbers:<br><br>$${term(k, v)} = ${rhs}$`,
          `<strong>4.</strong> Divide by $${k}$:<br><br>$${v} = ${frac(rhs, k)}$`,
        ],
        finalAnswer: `$${v} = ${frac(rhs, k)}$`,
      };
    }

    // v/m + c = k·v   — the shape of "x/3 - 2 = x"
    const m = getRandomInt(2, 8);
    const c = nonZeroInt(-12, 12);
    const kv = nonZeroInt(-4, 4);
    if (kv * m === 1) continue;
    // multiply through by m: v + mc = m·kv·v
    const k = 1 - m * kv, rhs = -m * c;
    if (k === 0 || rhs === 0) continue;

    return {
      subTopic: 'Equations with Fractions',
      difficulty: 'skill',
      variationId: 'linear-equations.fractions',
      questionLines: [`Solve $\\frac{${v}}{${m}} ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${term(kv, v)}$`],
      boardQuestionLines: [`Solve $\\frac{${v}}{${m}} ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${term(kv, v)}$`],
      solutionSteps: [
        `<strong>1.</strong> Multiply <strong>every</strong> term by $${m}$ to clear the fraction:<br><br>$${v} ${c < 0 ? '-' : '+'} ${Math.abs(m * c)} = ${term(m * kv, v)}$`,
        `<strong>2.</strong> Gather the $${v}$ terms and the numbers:<br><br>$${term(k, v)} = ${rhs}$`,
        k === 1
          ? `<strong>3.</strong> The unknown is already on its own:<br><br>$${v} = ${rhs}$`
          : `<strong>3.</strong> Divide by $${k}$:<br><br>$${v} = ${frac(rhs, k)}$`,
      ],
      finalAnswer: `$${v} = ${frac(rhs, k)}$`,
    };
  }
  throw new Error('linear-equations.fractions: no valid question found');
}

// ── the papers' own shape — 2016 P1 Q8, 2019 P1 Q14, 2025 P2 Q13 ─────────
//
// All three set a fraction *and a whole term*:
//
//   2016 P1 Q8    2x/3 - 5/6 = 2x
//   2019 P1 Q14   x/2 - 1 = (3 - x)/5
//   2025 P2 Q13   (5x + 1)/2 = 4x/3 + 1
//
// The skill drill above sets a fraction equal to a fraction, which
// cross-multiplication clears in one move — and that is the one shape the
// papers never set. With a whole term in it, cross-multiplying does not work at
// all: every term has to be multiplied by the lowest common multiple, and that
// is the first of the three marks.
//
// 2016 P1 Q8 notes that the answer must be a non-integer value, so all three
// shapes are rejected until they give one.

const lcm = (a: number, b: number) => Math.abs(a * b) / (gcd(Math.abs(a), Math.abs(b)) || 1);

function clearDenominators(): Q {
  for (let tries = 0; tries < 2000; tries++) {
    const v = pick(VARS);
    const shape = getRandomInt(1, 3);
    const [m, n] = [getRandomInt(2, 6), getRandomInt(2, 8)];
    if (m === n) continue;
    const L = lcm(m, n);

    let question = '', cleared = '', a = 0, b = 0;

    if (shape === 1) {
      // p·v/m - q/n = k·v          the 2016 shape
      const p = getRandomInt(1, 5), q = getRandomInt(1, 9), k = nonZeroInt(-3, 3);
      question = `\\frac{${term(p, v)}}{${m}} - \\frac{${q}}{${n}} = ${term(k, v)}`;
      cleared = `${term(L / m * p, v)} - ${L / n * q} = ${term(L * k, v)}`;
      a = L / m * p - L * k;
      b = L / n * q;
    } else if (shape === 2) {
      // v/m + c = (r·v + s)/n      the 2019 shape
      const c = nonZeroInt(-6, 6), r = nonZeroInt(-3, 3), s = nonZeroInt(-9, 9);
      question = `\\frac{${v}}{${m}} ${c < 0 ? '-' : '+'} ${Math.abs(c)} = \\frac{${lin(r, s, v)}}{${n}}`;
      cleared = `${lin(L / m, L * c, v)} = ${lin(L / n * r, L / n * s, v)}`;
      a = L / m - L / n * r;
      b = L / n * s - L * c;
    } else {
      // (p·v + q)/m = r·v/n + c    the 2025 shape
      const p = getRandomInt(2, 6), q = nonZeroInt(-6, 6);
      const r = nonZeroInt(-5, 5), c = nonZeroInt(-4, 4);
      question = `\\frac{${lin(p, q, v)}}{${m}} = \\frac{${term(r, v)}}{${n}} ${c < 0 ? '-' : '+'} ${Math.abs(c)}`;
      cleared = `${lin(L / m * p, L / m * q, v)} = ${lin(L / n * r, L * c, v)}`;
      a = L / m * p - L / n * r;
      b = L * c - L / m * q;
    }

    if (a === 0 || b === 0) continue;
    if (b % a === 0) continue;                 // 2016 P1 Q8 note 2: not an integer
    if (Math.abs(b / a) > 14) continue;        // an answer a pupil would believe
    // The papers answer -5/8, 16/7 and 3/7. The magnitude was already held;
    // the DENOMINATOR was not, and it reached 144.
    if (Math.abs(a) / (gcd(Math.abs(a), Math.abs(b)) || 1) > MAX_CLEAR_DEN) continue;

    return {
      subTopic: 'Clearing Denominators in an Equation',
      difficulty: 'exam',
      variationId: 'linear-equations.clear-denominators',
      questionLines: [`Solve the equation $${question}$`, 'Give your answer in its simplest form.'],
      boardQuestionLines: [`Solve $${question}$`],
      solutionSteps: [
        `<strong>1.</strong> The denominators are $${m}$ and $${n}$, so multiply <strong>every</strong> term by $${L}$:<br><br>$${cleared}$`,
        `<strong>2.</strong> Gather the $${v}$ terms on one side and the numbers on the other:<br><br>$${term(a, v)} = ${b}$`,
        `<strong>3.</strong> Divide both sides by $${a}$:<br><br>$${v} = ${frac(b, a)}$`,
      ],
      // •¹ eliminate the denominators, •² rearrange into ax = b, •³ solve —
      // the same three marks in all three papers
      stepMarks: [1, 1, 1],
      finalAnswer: `$${v} = ${frac(b, a)}$`,
    };
  }
  throw new Error('linear-equations.clear-denominators: no valid question found');
}

export const LINEAR_EQUATION_GENERATORS: Record<string, () => Q> = {
  'Solving Linear Equations': solveLinear,
  'Equations with Brackets': solveWithBracket,
  'Equations with Fractions': solveWithFractions,
  'Clearing Denominators in an Equation': clearDenominators,
};
