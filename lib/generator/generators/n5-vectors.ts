import { GeneratedQuestion } from './types';
import type { Gen } from './n5';
import { getRandomInt, gcd, nonZeroInt } from './utils';
import { vectorGrid } from '../diagrams/shapes/vector-grid';
import { vectorFigure } from '../diagrams/shapes/vector-figure';
import { sketchAxes } from '../diagrams/shapes/sketch-axes';
import { pt } from '../diagrams/scene';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';

/**
 * National 5 vector components and the straight line — the diagram-free parts.
 *
 * Vectors: 9 paper questions, all two marks and all the same idea — combine two
 * vectors given in component form and answer in component form. Along with
 * function evaluation this is the best board-starter supply in the course.
 *
 *   2u - v          2014 P1 Q4       three components, integer scalars
 *   (1/2)p + q      2016 P1 Q1       two components, a fractional scalar
 *   3a + b          2024 P1 Q4       three components
 *   u and u + v,
 *   find v          2018 P1 Q4       the same thing run backwards
 *
 * Every one says "Express your answer in component form", so that instruction is
 * always printed.
 *
 * Straight line: the papers ask only two of Zeta's six skills — rearrange to
 * find the gradient (2017 P2 Q11, 2024 P1 Q11) and find where the line crosses
 * the y-axis (2018 P2 Q14). Zeta also lists the gradient between two points and
 * the equation through two points, both diagram-free, so both are built as
 * skill-tier topics. "Sketch lines from their equations" needs a diagram and
 * waits for the shape library.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

/** A column vector in the form the papers print. */
const col = (v: number[]): string =>
  `\\begin{pmatrix}${v.join('\\\\ ')}\\end{pmatrix}`;

const bold = (name: string): string => `\\mathbf{${name}}`;

/** "3\mathbf{a}", with 1 implicit and 1/2 written as a fraction. */
function scaled(k: number, name: string): string {
  if (k === 1) return bold(name);
  if (k === -1) return `-${bold(name)}`;
  if (k === 0.5) return `\\frac{1}{2}${bold(name)}`;
  return `${k}${bold(name)}`;
}

/** A fraction in lowest terms, written as an integer where it divides. */
function frac(n: number, d: number): string {
  const g = gcd(Math.abs(n), Math.abs(d)) || 1;
  let [a, b] = [n / g, d / g];
  if (b < 0) { a = -a; b = -b; }
  if (b === 1) return `${a}`;
  return a < 0 ? `-\\frac{${-a}}{${b}}` : `\\frac{${a}}{${b}}`;
}

// ── combine two vectors — 2014 P1 Q4, 2016 P1 Q1, 2024 P1 Q4 ─────────────

/**
 * **What each paper fixes about the components question**, one row per paper
 * id. Nothing asked (a topic sheet) fixes nothing and keeps the coin.
 *
 * - `minus`: adding and subtracting are two different questions (the owner,
 *   2024 P1 sheet: *"Agreed"*, against a coin that handed a pupil the wrong
 *   paper's arithmetic in 141 of 300 draws). 2024 P1 Q4 is 3a + b, 2014 P1 Q4
 *   is 2u - v, and 2016 P1 Q1 is 1/2 p + q (*"Yes key"*, against 196 of 400
 *   draws subtracting). Every mechanical check reads these as one form (same
 *   layout, instruction and LaTeX; only the operation differs), which is why
 *   the coin went unnoticed.
 * - `noZero`: never a zero component in the answer. Their papers answer
 *   (-4, 10, 3) and (-3, -4); these drew a zero in 8 and 21 of 200. The owner,
 *   on the 2018-2014 light pass: "Yes". A rejection on those ids only.
 * - `asksFirst`: 2014 P1 Q4 asks first and gives the vectors after: "Find the
 *   resultant vector 2u - v when u = ... and v = ... ." (light pass: "Yes").
 *
 * `asked` and not `wanted`: 2014's id is an alias of 2024's, so both arrive
 * with the same `wanted` and only the asked id tells them apart.
 */
interface ComponentsPaper { minus: boolean; noZero?: true; asksFirst?: true }
const COMPONENTS_PAPERS: Record<string, ComponentsPaper> = {
  'vectors.components': { minus: false },                                    // 2024 P1 Q4
  'vectors.components-pre2023': { minus: true, noZero: true, asksFirst: true }, // 2014 P1 Q4
  'vectors.components-half': { minus: false, noZero: true },                 // 2016 P1 Q1
};

function components(wanted?: string, asked?: string): Q {
  const paper: ComponentsPaper | undefined = COMPONENTS_PAPERS[asked ?? ''];
  // Taught for docs/one-question-one-generator.md: the id the caller
  // asked for decides this, and the draw is only the fallback for a
  // topic sheet, which names none.
  const half = wanted !== undefined
    ? wanted === 'vectors.components-half'
    : getRandomInt(0, 1) === 0;             // the 2016 P1 Q1 shape
  for (let tries = 0; tries < 200; tries++) {
    /**
     * **Three rows for a multiple, two for a half.** The owner, on the
     * 2026-2023 sign-off sheet against 2024 P1 Q4: *"Needs to be 3 numbers in
     * the vector not 2"*.
     *
     * It was a coin toss, and the three papers do not toss:
     *
     *   2014 P1 Q4   2u - v      three rows   -> `vectors.components`
     *   2024 P1 Q4   3a + b      three rows   -> `vectors.components`
     *   2016 P1 Q1   1/2 p + q   two rows     -> `vectors.components-half`
     *
     * so a pupil asking for 2024 P1 Q4 met a two-row vector half the time. The
     * split that separates the two ids already carries which paper is being
     * cloned - `half` is chosen once, above the loop - and the row count simply
     * had to be read off it rather than drawn again.
     */
    const dim = half ? 2 : 3;
    // The papers name their vectors p/q (3), u/v (2) and a/b (1) - three pairs
    // across seven questions, so the variety here is theirs. `s`/`t` is not a
    // pair any of them uses.
    const [n1, n2] = pick([['p', 'q'], ['p', 'q'], ['p', 'q'], ['u', 'v'], ['u', 'v'], ['a', 'b']]);
    // **One scalar, on the first vector.** All three papers are that shape:
    //
    //   2014 P1 Q4   2u - v      3D, integer scalar
    //   2016 P1 Q1   1/2 p + q   2D, a half
    //   2024 P1 Q4   3a + b      3D, integer scalar
    //
    // and all three schemes pay their first mark for exactly one multiple -
    // "calculate 2u", "calculate 1/2 p", "calculate 3a". Drawing k1 and k2
    // independently scaled both vectors in about half of all draws, which asks
    // for two multiplications where the scheme pays for one, and `3u + 3v` is
    // not a question any paper sets at all. k1 = 1 was reachable too, which
    // leaves no multiple to calculate and no first mark to earn.
    // **A half is a different question from a multiple, so it is its own id.**
    // 2014 P1 Q4 and 2024 P1 Q4 scale by a whole number; 2016 P1 Q1 scales by
    // a half. Drawing between them handed 2024 P1 Q4 a fraction one press in
    // five, which the owner read off the contact sheet. `half` is chosen once
    // before the loop, so the mix is even rather than whatever survives.
    const k1 = half ? 0.5 : getRandomInt(2, 4);
    const k2 = 1;
    // Adding and subtracting are two different questions: see COMPONENTS_PAPERS.
    const minus = paper ? paper.minus : getRandomInt(0, 1) === 0;

    // a half scalar needs even components, or the answer is not whole
    const step = half ? 2 : 1;
    const A = Array.from({ length: dim }, () => nonZeroInt(-9, 9) * step);
    const B = Array.from({ length: dim }, () => nonZeroInt(-9, 9));
    if (half && A.some(v => Math.abs(v) > 18)) continue;

    const R = A.map((v, i) => k1 * v + (minus ? -1 : 1) * k2 * B[i]);
    if (R.some(v => !Number.isInteger(v) || Math.abs(v) > 40)) continue;
    if (R.every(v => v === 0)) continue;
    if (paper?.noZero && R.some(v => v === 0)) continue;

    const expr = `${scaled(k1, n1)} ${minus ? '-' : '+'} ${scaled(k2, n2)}`;
    return {
      subTopic: 'Vector Components',
      difficulty: 'skill',
      variationId: half ? 'vectors.components-half' : 'vectors.components',
      questionLines: paper?.asksFirst
        ? [`Find the resultant vector $${expr}$`,
           `when $${bold(n1)} = ${col(A)}$ and $${bold(n2)} = ${col(B)}.$`,
           `Express your answer in component form.`]
        : [
        `Given $${bold(n1)} = ${col(A)}$ and $${bold(n2)} = ${col(B)}$,`,
        `find the resultant vector $${expr}$.`,
        `Express your answer in component form.`,
      ],
      boardQuestionLines: [`$${expr}$ where $${bold(n1)} = ${col(A)}$, $${bold(n2)} = ${col(B)}$`],
      solutionSteps: [
        // No marker's talk in a pupil's line (2026-10-02 full read, the owner's "Yes")
        `<strong>1.</strong> Multiply $${bold(n1)}$ by $${k1 === 0.5 ? '\\frac{1}{2}' : k1}$:<br><br>$${scaled(k1, n1)} = ${col(A.map(v => k1 * v))}$`,
        `<strong>2.</strong> ${minus ? 'Subtract' : 'Add'} the matching components:<br><br>$${col(R)}$`,
      ],
      // 2024 P1 Q4: •¹ calculate the scalar multiple, •² the solution. The
      // second mark is lost if the brackets go or the answer is written as a
      // coordinate, which is why col() always prints a column vector.
      stepMarks: [1, 1],
      finalAnswer: `$${col(R)}$`,
    };
  }
  throw new Error('vectors.components: no valid question found');
}

// ── run it backwards — 2018 P1 Q4 ───────────────────────────────────────
//    "u and u + v are given. Find v."

function missingVector(): Q {
  // 2018 P1 Q4 is its only paper and prints three rows - u = (1, 5, 1). One
  // paper, one form, so there is nothing here to toss for either.
  const dim = 3;
  const [n1, n2] = pick([['u', 'v'], ['p', 'q'], ['a', 'b']]);
  // **Never a zero in the given u + v — 2026-09-26.** The paper's are (1, 5,
  // 1) and (6, −4, 3); this drew a zero in 33 of 200. The owner, on the
  // 2018-2014 light pass: "Yes". Redrawn until there is none; this routine is
  // 2018 P1 Q4's alone.
  let A: number[], V: number[], sum: number[];
  do {
    A = Array.from({ length: dim }, () => nonZeroInt(-9, 9));
    V = Array.from({ length: dim }, () => nonZeroInt(-9, 9));
    sum = A.map((v, i) => v + V[i]);
  } while (sum.some(v => v === 0));

  return {
    subTopic: 'Finding a Missing Vector',
    difficulty: 'exam',
    variationId: 'vectors.missing',
    questionLines: [
      `Two vectors are given by $${bold(n1)} = ${col(A)}$ and $${bold(n1)} + ${bold(n2)} = ${col(sum)}$.`,
      `Find vector $${bold(n2)}$.`,
      `Express your answer in component form.`,
    ],
    boardQuestionLines: [`$${bold(n1)} = ${col(A)}$, $${bold(n1)} + ${bold(n2)} = ${col(sum)}$. Find $${bold(n2)}$`],
    solutionSteps: [
      `<strong>1.</strong> Rearrange: if $${bold(n1)} + ${bold(n2)}$ is known, then $${bold(n2)} = (${bold(n1)} + ${bold(n2)}) - ${bold(n1)}$.`,
      `<strong>2.</strong> Subtract the matching components:<br><br>$${col(sum)} - ${col(A)} = ${col(V)}$`,
    ],
    // 2018 P1 Q4: •¹ evidence of subtraction, •² all components correct
    stepMarks: [1, 1],
    finalAnswer: `$${col(V)}$`,
  };
}

// ── rearrange to find the gradient — 2017 P2 Q11, 2024 P1 Q11 ───────────
//
//   3x - 5y - 10 = 0  ->  y = (3/5)x - 2,  gradient 3/5
//
// The equation is printed in the two forms the papers use: "= 0" and with the
// constant moved to the right.

function lineFromEquation(wantIntercept: boolean): Q {
  for (let tries = 0; tries < 200; tries++) {
    // **All three papers are `ax + by + c` with a positive and |b| at least 2.**
    //
    //   2017 P2 Q11   3x - 5y - 10 = 0    gradient
    //   2024 P1 Q11   x + 4y - 24 = 0     gradient
    //   2018 P2 Q14   2x - 5y = 20        intercept
    //
    // A leading minus is not a form any of them uses, and b = 1 leaves the y
    // term already isolated, which is the whole of the first mark - "isolate
    // term in y **or divide throughout by 5**". a = 1 stays: 2024 P1 Q11 is a
    // bare x.
    const a = getRandomInt(1, 9);
    const b = getRandomInt(2, 9) * (getRandomInt(0, 1) === 0 ? 1 : -1);
    const c = nonZeroInt(-30, 30);
    // and none of them can be divided through, so neither may these
    if (gcd(gcd(a, Math.abs(b)), Math.abs(c)) !== 1) continue;
    const m = -a / b;
    const yInt = -c / b;
    if (wantIntercept && !Number.isInteger(yInt)) continue;
    if (Math.abs(yInt) > 20) continue;

    // **The form goes with the question, and is not a coin toss.** Both
    // gradient papers write `... = 0`; the intercept paper writes `2x - 5y =
    // 20`. Drawing it randomly gave each of them the other's presentation half
    // the time.
    const zeroForm = !wantIntercept;
    const lhs = `${a === 1 ? '' : a === -1 ? '-' : a}x ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y`;
    const equation = zeroForm
      ? `${lhs} ${c < 0 ? '-' : '+'} ${Math.abs(c)} = 0`
      : `${lhs} = ${-c}`;

    const mTex = frac(-a, b);
    const rearranged = `y = ${mTex === '1' ? '' : mTex === '-1' ? '-' : mTex}x ${yInt < 0 ? '-' : '+'} ${frac(Math.abs(-c), Math.abs(b))}`;
    // The y term on its own, which is the scheme's •1 ("4y = -x + 24") and
    // 2018 P2 Q14's "2y = -18" (2026-10-02 full read, the owner's "Yes").
    const yTerm = `${b < 0 ? '-' : ''}${Math.abs(b) === 1 ? '' : Math.abs(b)}y`;
    const isolated = `${yTerm} = ${-a === 1 ? '' : -a === -1 ? '-' : -a}x ${c > 0 ? '-' : '+'} ${Math.abs(c)}`;

    if (wantIntercept) {
      return {
        subTopic: 'Intercept from an Equation',
        difficulty: 'exam',
        variationId: 'straight-line.intercept-from-equation',
        questionLines: [
          `A straight line has equation $${equation}$.`,
          `Find the coordinates of the point where this line crosses the $y$-axis.`,
        ],
        boardQuestionLines: [`Where does $${equation}$ cross the $y$-axis?`],
        // 2018 P2 Q14 is two marks: •¹ substitute x = 0 (or isolate the y term),
        // •² state the coordinates — and the scheme insists on the brackets, so
        // the last step is the one that writes them.
        solutionSteps: [
          `<strong>1.</strong> The line crosses the $y$-axis where $x = 0$, so substitute and solve for $y$:<br><br>${b === 1 ? `$y = ${yInt}$` : `$${yTerm} = ${-c}$, so $y = ${yInt}$`}`,
          `<strong>2.</strong> Write it as coordinates — the brackets are needed for the mark:<br><br>$(0, ${yInt})$`,
        ],
        stepMarks: [1, 1],
        finalAnswer: `$(0, ${yInt})$`,
      };
    }

    return {
      subTopic: 'Gradient from an Equation',
      difficulty: 'skill',
      variationId: 'straight-line.gradient-from-equation',
      questionLines: [
        `A straight line has equation $${equation}$.`,
        `Find the gradient of this line.`,
      ],
      boardQuestionLines: [`Gradient of $${equation}$?`],
      solutionSteps: [
        b === 1
          ? `<strong>1.</strong> Rearrange into the form $y = mx + c$. Move everything except the $y$ term to the other side:<br><br>$${rearranged}$`
          : `<strong>1.</strong> Rearrange into the form $y = mx + c$. Move everything except the $y$ term to the other side:<br><br>$${isolated}$<br><br>Then divide by $${b}$:<br><br>$${rearranged}$`,
        `<strong>2.</strong> The gradient is the number in front of $x$:<br><br>$m = ${mTex}$`,
      ],
      // •¹ isolate the y term or divide throughout, •² state the gradient
      // explicitly — both papers word it exactly that way
      stepMarks: [1, 1],
      finalAnswer: `$m = ${mTex}$`,
    };
  }
  throw new Error('straight-line: no valid question found');
}

// ── Zeta skills the papers have not asked directly ──────────────────────
//    the gradient between two points, and the equation through two points

function twoPoints(wantEquation: boolean, wanted?: string, asked?: string): Q {
  /**
   * **600 tries, not 200 (the owner, 2026-10-09: "We should fix the rare n5
   * failure").** The equation's caps (gradient 2 to 5, a whole intercept of 20
   * or less and never 0) and, for 2017 P1 Q6, the figure check pass about one
   * try in twenty, so 200 tries all failed on about one draw in 7,000 and the
   * site said "Could not make one just now". **Only the bound moved:** a draw
   * returns at its first passing try, in the same order as before, so every
   * draw that was made within 200 tries is byte for byte what it was (all four
   * ids on this routine, three of them locked); only a draw that used to throw
   * now goes on to make one. So no question shown before and no shared link
   * moves. Proven against the synced copy, seed for seed, before syncing.
   */
  for (let tries = 0; tries < 600; tries++) {
    const [x1, y1] = [nonZeroInt(-8, 8), nonZeroInt(-9, 9)];
    const [x2, y2] = [nonZeroInt(-8, 8), nonZeroInt(-9, 9)];
    if (x1 === x2) continue;                        // undefined gradient
    if (y1 === y2) continue;                        // a horizontal line is no test
    const num = y2 - y1, den = x2 - x1;
    const mTex = frac(num, den);
    if (wantEquation && den !== 0 && num % den !== 0) continue;   // keep c whole
    const m = num / den;
    const c = y1 - m * x1;
    /**
     * **Paper scale, for the equation only.**
     *
     * The three papers set gradients of 2, -2 and -4 and intercepts of 9, 4
     * and -13. Unbounded, this reached `y = -17x - 127`: over 200 draws the
     * gradient passed 4 seventy-six times and ran to 18, and the intercept to
     * 127. A pupil asked for "the equation in its simplest form" can do
     * -17x - 127; it is just not the question any of the three papers set, and
     * a line that steep is barely a line on the axes the diagram form draws.
     *
     * Only the equation is held. `straight-line.gradient-two-points` is a
     * skill with no paper behind it and a steep gradient is no harder there,
     * so it keeps the range it had.
     *
     * **There was a `-pre2022` sibling here for an hour, and it is gone.** It
     * was built to keep 2015 P1 Q8 exactly as it was while 2022 P1 Q6 got the
     * caps. It did not work, and could not: `generateQuestion` discards draws
     * until it lands on the id asked for, so splitting changes which draws
     * each id keeps and the sibling moves anyway - `frozen` said so. What it
     * did do was accept every draw the caps would have rejected, which let it
     * win the retry loop and starved `-diagram` down to 36 draws in 400 until
     * `mix` failed. A branch that does not achieve its purpose and unbalances
     * its topic is worse than the drift it was aimed at.
     */
    // A gradient of 1 or -1 took 49% of draws once the top was capped - the
    // divisibility that keeps c whole favours den = 1 - and no paper here uses
    // it: 2, -2 and -4. It also makes the second mark nearly free, since there
    // is nothing to multiply. So the floor matters as much as the ceiling.
    /**
     * **The line never passes through the origin.** `c === 0` printed
     * `y = 2x`, `y = 3x`, `y = -2x` in 6 of 300 draws on the second pass, and
     * a line with no constant is a step shorter than the question all three
     * papers set: the third mark is determining the equation with both parts,
     * and there is nothing to substitute back for. The three papers' own
     * intercepts are 9, 4 and -13.
     *
     * The owner, on the 2022 P1 sheet: *"Agree can't go through origin"* —
     * brought rather than assumed, because the general form of this is their
     * 2022 P2 Q9 ruling on a different topic: *"it should always have plus or
     * minus something you just can't pick 0."*
     *
     * **This moves 2017 P1 Q6 and 2015 P1 Q8, and both are declared.** The
     * guard is shared by both equation ids — `drawIt` is decided below it, so
     * it cannot be keyed to one without a branch — and 2015 P1 Q8 rides the
     * `-pre2022p1` alias on this same routine. Neither is signed off and both
     * have the identical fault, so both move towards their own papers rather
     * than away. `straight-line.gradient-two-points` is untouched: the guard
     * is gated on `wantEquation`, which is fixed per call.
     */
    if (wantEquation && (Math.abs(m) > 5 || Math.abs(m) < 2 || Math.abs(c) > 20 || c === 0)) continue;

    if (!wantEquation) {
      return {
        subTopic: 'Gradient from Two Points',
        difficulty: 'skill',
        variationId: 'straight-line.gradient-two-points',
        questionLines: [
          `Calculate the gradient of the line joining $A(${x1}, ${y1})$ and $B(${x2}, ${y2})$.`,
        ],
        boardQuestionLines: [`Gradient of $A(${x1}, ${y1})$ to $B(${x2}, ${y2})$?`],
        solutionSteps: [
          `<strong>1.</strong> Use $m = \\frac{y_{2} - y_{1}}{x_{2} - x_{1}}$:<br><br>$m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = \\frac{${num}}{${den}}$`,
          `<strong>2.</strong> Simplify:<br><br>$m = ${mTex}$`,
        ],
        finalAnswer: `$m = ${mTex}$`,
      };
    }

    const mPart = m === 1 ? 'x' : m === -1 ? '-x' : `${m}x`;
    const equation = c === 0 ? `y = ${mPart}` : `y = ${mPart} ${c < 0 ? '-' : '+'} ${Math.abs(c)}`;

    /**
     * **One of the three papers draws the line; two do not - so they are two
     * variations, not one with a coin toss.**
     *
     * 2017 P1 Q6 prints axes with A and B marked and their coordinates written
     * beside them - *and* states both in the prose, which is what separates it
     * from `straight-line.from-marked-points`, where the coordinates are only on
     * the picture. 2015 P1 Q8 and 2022 P1 Q6 are pure text.
     *
     * This used to draw on a third of draws under a single id, on the argument
     * that a third of its citations draw. That is the wrong unit. Press
     * Variation on 2022 P1 Q6 - which is pure text - and one time in three you
     * were handed 2017's diagram. `functions.evaluate` is split for exactly
     * this reason and says so above itself: the owner read that coin toss off
     * a contact sheet as "using more than one generator", because that is what
     * it looks like.
     *
     * So the toss still happens - it is what keeps both forms reachable - but
     * it now chooses the **id**, and `generateQuestion` draws until it has the
     * one that was asked for. The routine is otherwise identical, which is why
     * this is a split and not a copy.
     */
    /**
     * **An even toss, because it now names the id.**
     *
     * One draw in three was right while this was one variation choosing a
     * presentation - a third of the citations print a diagram. Once the toss
     * names the variation the ratio is a worksheet question instead, and a
     * third is not enough: roughly half the diagram draws are then rejected by
     * `verifyFigure`, which left `-diagram` on 67 of 400 against `mix`'s
     * floor of 70 and failed the suite. Cloning a named paper is unaffected -
     * `generateQuestion` asks for the id it wants either way - so this is
     * only about how often each turns up on a mixed sheet.
     */
    // Taught: the diagram shape is its own id (2017 P1 Q6), so the asked id
    // decides it. The gradient topic asks for neither and is untouched.
    const drawIt = wanted !== undefined
      ? wanted === 'straight-line.equation-two-points-diagram'
      : getRandomInt(0, 1) === 0;
    const xs = [0, x1, x2], ys = [0, y1, y2];
    const padX = Math.max(1.5, (Math.max(...xs) - Math.min(...xs)) * 0.22);
    const padY = Math.max(2, (Math.max(...ys) - Math.min(...ys)) * 0.22);
    const fig = drawIt ? sketchAxes({
      view: {
        xMin: Math.min(...xs) - padX, xMax: Math.max(...xs) + padX,
        yMin: Math.min(...ys) - padY, yMax: Math.max(...ys) + padY,
      },
      plot: { kind: 'line', m, c },
      points: [
        { x: x1, y: y1, text: `A (${x1}, ${y1})`, side: 'right' },
        { x: x2, y: y2, text: `B (${x2}, ${y2})`, side: 'right' },
      ],
    }) : null;
    // **2015 P1 Q8 gives bare coordinates:** "the line joining the points
    // (-2, 5) and (3, 15)". The clone named them A and B in 400 of 400 draws.
    // The owner, on the 2015 P1 sheet: *"Yes"*. Wording only, and read by
    // 2015's alias alone. LOCKED 2022 P1 Q6 has the same fault in its own
    // words, "the line passing through the points (-3, -1) and (-5, 7)", and
    // was put to the owner at the foot of the 2015 P1 sheet: *"Yes"*.
    const ask = drawIt
      ? `The diagram shows the straight line joining $A(${x1}, ${y1})$ and $B(${x2}, ${y2})$.`
      : asked === 'straight-line.equation-two-points-pre2022p1'
        ? `Find the equation of the line joining the points $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`
      : asked === 'straight-line.equation-two-points'
        ? `Find the equation of the line passing through the points $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`
        : `Find the equation of the straight line passing through $A(${x1}, ${y1})$ and $B(${x2}, ${y2})$.`;
    const follow = drawIt ? `Find the equation of the line $AB$.` : null;
    if (fig && verifyFigure(fig, `${ask} ${follow} ${equation}`).length) continue;

    return {
      subTopic: 'Equation of a Line from Two Points',
      difficulty: 'skill',
      variationId: drawIt
        ? 'straight-line.equation-two-points-diagram'   // 2017 P1 Q6
        : 'straight-line.equation-two-points',          // 2015 P1 Q8, 2022 P1 Q6
      questionLines: [
        ask,
        ...(fig ? [renderScene(fig.scene), follow as string] : []),
        // every one of the three papers asks for it, and the third mark is
        // "state the equation ... in its simplest form"
        `Give the equation in its simplest form.`,
      ],
      boardQuestionLines: [`Equation of the line through $A(${x1}, ${y1})$ and $B(${x2}, ${y2})$`],
      solutionSteps: [
        `<strong>1.</strong> Find the gradient:<br><br>$m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = ${m}$`,
        `<strong>2.</strong> Put one point into $y = mx + c$ to find $c$:<br><br>$${y1} = ${m} \\times (${x1}) + c$, so $c = ${c}$`,
        `<strong>3.</strong> Write the equation:<br><br>$${equation}$`,
      ],
      // 2015 P1 Q8: •¹ find the gradient, •² substitute the gradient and a
      // point, •³ state the equation in its simplest form
      stepMarks: [1, 1, 1],
      finalAnswer: `$${equation}$`,
      ...(fig ? { figure: fig } : {}),
    };
  }
  throw new Error('straight-line.two-points: no valid question found');
}

// ── a pathway in components — 2019 P1 Q10 ───────────────────────────────
//
// "In triangle PQR, PR and RQ are given. (a) Express PQ. M is the midpoint of
// PR. (b) Express MQ." What is being tested is the pathway itself, and the
// scheme pays for it separately from the arithmetic — •² is "valid pathway",
// •³ "consistent components".
//
// **This used to say "there is no figure to draw and no diagram to read", and
// only the second half was true.** Nothing is read off the picture, since the
// components are printed — but 2019 P1 Q10 draws the triangle all the same,
// with M dotted on PR and no lengths anywhere, and this cloned it without one.
// Found by `audit-lost-figures.mts` after the user picked a different figureless
// clone out of the generator.
//
// The triangle is placed from the **actual vectors** rather than from three side
// lengths: P at the origin, R at P + PR, Q at R + RQ. Placing it from lengths
// alone would let it come out mirrored, and a figure that contradicts the
// vectors it illustrates is worse than no figure.

function componentsMidpoint(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const [P, Q_, R] = pick([['P', 'Q', 'R'], ['A', 'B', 'C'], ['X', 'Y', 'Z'], ['D', 'E', 'F']]);
    // the first vector is halved, so its components have to be even
    const first = [nonZeroInt(-6, 6) * 2, nonZeroInt(-6, 6) * 2];
    const second = [nonZeroInt(-9, 9), nonZeroInt(-9, 9)];
    const whole = first.map((v, i) => v + second[i]);
    const half = first.map(v => v / 2);
    const toEnd = half.map((v, i) => v + second[i]);
    // **Never a zero component in either answer — 2026-09-26.** The paper's
    // are (5, 4) and (2, 6); 68 of 400 draws had a zero in PQ or MQ, which
    // lets a pupil get one component right by accident. The owner, on the
    // 2019 re-review sheet: "Yes", as on 2025 P1 Q13. 2019 P1 Q10 is this
    // routine's only paper.
    if (whole.some(v => v === 0) || toEnd.some(v => v === 0)) continue;

    // The three corners must make a real triangle. Collinear vectors give a
    // straight line and a nearly-collinear pair gives a sliver that cannot be
    // lettered; `verifyFigure` would reject those anyway, but rejecting them
    // here keeps the retry loop cheap.
    const Pp = pt(0, 0);
    const Rp = pt(first[0], first[1]);
    const Qp = pt(Rp.x + second[0], Rp.y + second[1]);
    const area2 = Math.abs((Rp.x - Pp.x) * (Qp.y - Pp.y) - (Qp.x - Pp.x) * (Rp.y - Pp.y));
    const spread = Math.max(Math.hypot(Rp.x, Rp.y), Math.hypot(Qp.x, Qp.y));
    if (area2 < spread * spread * 0.35) continue;

    // 2019 P1 Q10 draws a bare triangle with M dotted on PR and no lengths at
    // all, so there is nothing on it to give away and nothing to read off it.
    const fig = vectorFigure({
      points: { [P]: Pp, [Q_]: Qp, [R]: Rp, M: pt((Pp.x + Rp.x) / 2, (Pp.y + Rp.y) / 2) },
      edges: [[P, Q_], [Q_, R], [R, P]],
      arrows: [],
    });
    if (verifyFigure(fig, `triangle ${P}${Q_}${R} with M the midpoint of ${P}${R}`).length) continue;

    return {
      subTopic: 'A Pathway in Components',
      difficulty: 'exam',
      variationId: 'vectors.components-midpoint',
      questionLines: [
        `In triangle $${P}${Q_}${R}$, $\\overrightarrow{${P}${R}} = ${col(first)}$ and $\\overrightarrow{${R}${Q_}} = ${col(second)}$.`,
        renderScene(fig.scene),
        `<strong>(a)</strong> Express $\\overrightarrow{${P}${Q_}}$ in component form.`,
        `$M$ is the midpoint of $${P}${R}$.`,
        `<strong>(b)</strong> Express $\\overrightarrow{M${Q_}}$ in component form.`,
      ],
      boardQuestionLines: [
        `$\\overrightarrow{${P}${R}} = ${col(first)}$, $\\overrightarrow{${R}${Q_}} = ${col(second)}$. Find $\\overrightarrow{${P}${Q_}}$ and $\\overrightarrow{M${Q_}}$.`,
      ],
      solutionSteps: [
        `<strong>1.</strong> Go from $${P}$ to $${R}$ and then on to $${Q_}$:` +
        `<br><br>$\\overrightarrow{${P}${Q_}} = ${col(first)} + ${col(second)} = ${col(whole)}$`,
        `<strong>2.</strong> $M$ is halfway along $${P}${R}$, so the pathway from $M$ is half of $\\overrightarrow{${P}${R}}$ and then $\\overrightarrow{${R}${Q_}}$:` +
        `<br><br>$\\overrightarrow{M${Q_}} = \\frac{1}{2}${col(first)} + ${col(second)}$`,
        `<strong>3.</strong> Work out the components:<br><br>$= ${col(half)} + ${col(second)} = ${col(toEnd)}$`,
      ],
      // 1 + 2: •¹ the answer to (a), then •² a valid pathway and •³ consistent
      // components. The pathway is a mark of its own, so it is a step of its own
      figure: fig,
      stepMarks: [1, 1, 1],
      finalAnswer: `(a) $${col(whole)}$ &nbsp;&nbsp; (b) $${col(toEnd)}$`,
    };
  }
  throw new Error('vectors.components-midpoint: no valid question found');
}

// ── the magnitude of a vector — a practice skill that was missing ────────
//
// maths.scot drills |v| for 2D and 3D vectors, and |a - b| answered as a surd.
// The answer is exact wherever it can be, which means searching for components
// whose squares sum to a perfect square, or simplifying the surd when they do
// not — a decimal here would be wrong, not merely untidy.

/**
 * Three-dimensional vectors whose magnitude is a whole number.
 *
 * All four papers behind the two-mark variation are like this — (6, -13, 18)
 * comes to 23, (24, -12, 8) to 28 — and the scheme is two marks precisely
 * because there is no surd to simplify: "start process", then "solution". The
 * generator was drawing components freely, so most of what it produced was a
 * surd, printed under a mark total that does not pay for simplifying one.
 *
 * A pool rather than a search: whole-number magnitudes in three dimensions are
 * sparse, and rejecting until one turns up would spend nearly every attempt
 * failing. Built once at load.
 */
const WHOLE_MAGNITUDES: [number, number, number][] = (() => {
  const out: [number, number, number][] = [];
  for (let r = 7; r <= 45; r++) {
    for (let a = 2; a * a < r * r; a++) {
      for (let b = a; a * a + b * b < r * r; b++) {
        const c2 = r * r - a * a - b * b;
        const c = Math.round(Math.sqrt(c2));
        if (c >= b && c * c === c2) out.push([a, b, c]);
      }
    }
  }
  return out;
})();

/**
 * 2026 P1 Q7 — the same question with a surd for an answer, and worth three.
 *
 * "Find |d| ... express your answer as a surd in its simplest form", components
 * (4, -5, 7), answer 3 root 10. The extra mark is the simplification, which is
 * why it is tagged under Simplifying Surds as well and why it cannot share an
 * id with the four whole-number papers. 2026 has no published scheme; three
 * steps for three marks is the reading, one per skill the answer needs.
 */
function magnitudeSurd(): Q {
  for (let tries = 0; tries < 600; tries++) {
    const name = pick(['d', 'u', 'v', 'a', 'p']);
    const V = Array.from({ length: 3 }, () => nonZeroInt(-9, 9));
    const sq = V.reduce((t, x) => t + x * x, 0);
    /**
     * **No bigger than the paper's own sum.** The owner, on the 2026-2023
     * sign-off sheet: *"Check th arithmetic doesn't get too hard on these -
     * this might be ok"*.
     *
     * 2026 P1 Q7 is (4, -5, 7): 16 + 25 + 49 = 90, and the answer is 3 root 10.
     * Nothing capped this before - the components were held to the paper's own
     * range of 1 to 9 and the total was whatever fell out, which reached 243
     * (9, 9, 9 giving 9 root 3) and sat above the paper in about half of all
     * draws. Ninety is the paper's figure, so the sum a pupil adds up and the
     * number they factorise are both the size 2026 P1 Q7 sets.
     *
     * It costs nothing: 400 draws gave 374 different questions before the cap,
     * against `pool`'s floor of twenty.
     */
    if (sq > 90) continue;
    const root = Math.sqrt(sq);
    if (Number.isInteger(root)) continue;        // this one is the surd shape
    let k = 1, rest = sq;
    for (let d = Math.floor(Math.sqrt(sq)); d >= 2; d--) {
      if (rest % (d * d) === 0) { k *= d; rest /= d * d; }
    }
    if (k === 1) continue;                       // nothing to simplify, no third mark
    const out = `${k}\\sqrt{${rest}}`;

    return {
      subTopic: 'Magnitude as a Surd',
      difficulty: 'exam',
      variationId: 'vectors.magnitude-surd',
      questionLines: [
        `Find $\\vert \\mathbf{${name}} \\vert$, the magnitude of vector $\\mathbf{${name}} = ${col(V)}$.`,
        'Express your answer as a surd in its simplest form.',
      ],
      boardQuestionLines: [`$\\vert ${col(V)} \\vert$ as a surd`],
      solutionSteps: [
        `<strong>1.</strong> Square each component and add them:<br><br>$${V.map(x => `(${x})^{2}`).join(' + ')} = ${sq}$`,
        `<strong>2.</strong> The magnitude is the square root of that:<br><br>$\\vert \\mathbf{${name}} \\vert = \\sqrt{${sq}}$`,
        `<strong>3.</strong> Take out the largest square factor:<br><br>$\\sqrt{${sq}} = \\sqrt{${k * k} \\times ${rest}} = ${out}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$${out}$`,
    };
  }
  throw new Error('vectors.magnitude-surd: no valid question found');
}

function magnitude(wanted?: string): Q {
  for (let tries = 0; tries < 400; tries++) {
    // Taught: the |a - b| shape is its own id, so the asked id decides it.
    const difference = wanted !== undefined
      ? wanted === 'vectors.magnitude-difference'
      : getRandomInt(1, 3) === 1;   // the |a - b| shape
    const dim = difference ? (getRandomInt(0, 1) === 0 ? 2 : 3) : 3;
    // The magnitude papers name their vector u, v, r, p or d - never `a`.
    const name = pick(['u', 'v', 'r', 'p', 'd']);
    // The paper shape comes out of the pool, so its answer is whole and its two
    // marks buy exactly what the scheme says they buy. The |a - b| shape is
    // maths.scot's, carries no marks, and is left free to give a surd.
    const A = difference
      ? Array.from({ length: dim }, () => nonZeroInt(-9, 9))
      : pick(WHOLE_MAGNITUDES).map(v => v * (getRandomInt(0, 1) ? 1 : -1))
        .sort(() => getRandomInt(-1, 1));
    const B = Array.from({ length: dim }, () => nonZeroInt(-9, 9));
    const V = difference ? A.map((x, i) => x - B[i]) : A;
    const sq = V.reduce((t, x) => t + x * x, 0);
    if (sq === 0) continue;
    const root = Math.sqrt(sq);
    const whole = Number.isInteger(root);

    // a\sqrt{b} with b square-free
    let out = `${root}`;
    // Whether the radicand has a square factor at all. Without this the step
    // said "take out the largest square factor: sqrt(229) = sqrt(229)", which
    // instructs the pupil to do something and then does not do it.
    let squareFree = false;
    if (!whole) {
      let k = 1, rest = sq;
      for (let d = Math.floor(Math.sqrt(sq)); d >= 2; d--) {
        if (rest % (d * d) === 0) { k *= d; rest /= d * d; }
      }
      squareFree = k === 1;
      out = k === 1 ? `\\sqrt{${rest}}` : `${k}\\sqrt{${rest}}`;
    }

    const second = pick(['b', 'w', 'q']);
    const question = difference
      ? `Find $\\vert \\mathbf{${name}} - \\mathbf{${second}} \\vert$, where $\\mathbf{${name}} = ${col(A)}$ and $\\mathbf{${second}} = ${col(B)}$.`
      : `Find $\\vert \\mathbf{${name}} \\vert$, the magnitude of the vector $\\mathbf{${name}} = ${col(A)}$.`;

    return {
      subTopic: 'Magnitude of a Vector',
      difficulty: 'skill',
      // Two ids: the papers only ever ask for the magnitude of a given vector,
      // two marks — start the process by squaring and adding, then the
      // solution. The |a - b| form is maths.scot's, has no paper behind it, and
      // takes a third step, so it cannot share a mark total with the other.
      variationId: difference ? 'vectors.magnitude-difference' : 'vectors.magnitude',
      questionLines: [question, whole ? '' : 'Give your answer as a surd in its simplest form.'].filter(Boolean),
      boardQuestionLines: [`$\\vert ${col(V)} \\vert$`],
      solutionSteps: [
        ...(difference ? [`<strong>1.</strong> Subtract the matching components first:<br><br>$\\mathbf{${name}} - \\mathbf{${second}} = ${col(V)}$`] : []),
        `<strong>${difference ? 2 : 1}.</strong> The magnitude is the square root of the sum of the squares:<br><br>$\\sqrt{${V.map(x => `(${x})^{2}`).join(' + ')}} = \\sqrt{${sq}}$`,
        whole
          ? `<strong>${difference ? 3 : 2}.</strong> That is an exact square root:<br><br>$${out}$`
          : squareFree
          ? `<strong>${difference ? 3 : 2}.</strong> $${sq}$ has no square factor, so the surd is already in its simplest form:<br><br>$${out}$`
          : `<strong>${difference ? 3 : 2}.</strong> Take out the largest square factor:<br><br>$\\sqrt{${sq}} = ${out}$`,
      ],
      stepMarks: difference ? undefined : [1, 1],
      finalAnswer: `$${out}$`,
    };
  }
  throw new Error('vectors.magnitude: no valid question found');
}

// ── gradient, then the x-axis crossing — 2014 P1 Q11 ────────────────────
//
// One question in two parts, worth 2 + 2. The parts are the two skills already
// built separately — rearrange for the gradient, substitute to find an
// intercept — but the *x*-axis is not the y-axis, and no other paper asks for
// it. Its own variation because a four-mark question is not two two-mark ones
// stapled together: the pupil meets the same equation twice, which is the
// point of setting it that way.
//
// The scheme's second note is a constraint on the answer, not the working:
// "(3, 0) must use brackets", so the last step is the one that writes them.

function gradientAndXIntercept(): Q {
  for (let tries = 0; tries < 400; tries++) {
    // a positive, so the equation reads the way the papers set it: 4x + 3y = 12
    const a = getRandomInt(2, 9);
    const b = nonZeroInt(-9, 9);
    if (Math.abs(b) === 1) continue;                        // nothing to divide out
    const xInt = nonZeroInt(-8, 8);
    const c = a * xInt;                                     // so y = 0 gives a whole x
    if (Math.abs(c) > 40) continue;
    if (c % b === 0 && Math.abs(c / b) < 2) continue;        // a y-intercept too tidy to test
    // **No common factor across the equation**, as the paper's 4x + 3y = 12.
    // 3x + 3y = 6 or 6x - 9y = 30 lets the pupil divide through first, an
    // easier question: 155 of 400 draws. The owner, on the 2014 P1 sheet:
    // "Yes ensure there no common factor". Nothing else serves this routine.
    if (gcd(gcd(a, Math.abs(b)), Math.abs(c)) > 1) continue;

    const lhs = `${a === 1 ? '' : a === -1 ? '-' : a}x ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y`;
    const equation = `${lhs} = ${c}`;
    const mTex = frac(-a, b);

    return {
      subTopic: 'Gradient and the x-axis Crossing',
      difficulty: 'exam',
      variationId: 'straight-line.gradient-and-x-intercept',
      questionLines: [
        `<strong>(a)</strong> A straight line has equation $${equation}$.`,
        `Find the gradient of this line.`,
        `<strong>(b)</strong> Find the coordinates of the point where this line crosses the $x$-axis.`,
      ],
      boardQuestionLines: [`$${equation}$: gradient, and where it crosses the $x$-axis?`],
      solutionSteps: [
        // b keeps its sign here. Printing |b| on the left while moving -a to
        // the right mixes two conventions and gives "4y = 8x + 24" for an
        // equation whose y term is -4y — a sign error in the one step that is
        // supposed to show the rearrangement.
        `<strong>1.</strong> Rearrange into $y = mx + c$ by getting the $y$ term on its own:` +
        `<br><br>$${b === 1 ? '' : b === -1 ? '-' : b}y = ${-a === 1 ? '' : -a === -1 ? '-' : -a}x ${c < 0 ? '-' : '+'} ${Math.abs(c)}$`,
        `<strong>2.</strong> Divide by the coefficient of $y$ and read off the gradient:<br><br>$m = ${mTex}$`,
        `<strong>3.</strong> On the $x$-axis, $y = 0$. Put that into the original equation:` +
        `<br><br>$${a === 1 ? '' : a === -1 ? '-' : a}x ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}(0) = ${c}$`,
        `<strong>4.</strong> Solve for $x$ and write the point as coordinates:<br><br>$x = ${xInt}$, so the line crosses at $(${xInt}, 0)$`,
      ],
      // 2 + 2: •¹ start to rearrange, •² state the gradient, •³ know how to
      // find the x coordinate, •⁴ state the coordinates — brackets and all
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $m = ${mTex}$ &nbsp;&nbsp; (b) $(${xInt}, 0)$`,
    };
  }
  throw new Error('straight-line.gradient-and-x-intercept: no valid question found');
}

// ── a gradient of zero, or none at all ──────────────────────────────────
//
// The first build rejected both: `if (y1 === y2) continue` and the same for x.
// maths.scot teaches them explicitly — a horizontal line has gradient 0 and a
// vertical one has no gradient at all — so rejecting them removed the two cases
// a pupil is most likely to get wrong.

function gradientSpecial(): Q {
  const horizontal = getRandomInt(0, 1) === 0;
  const [x1, y1] = [nonZeroInt(-8, 8), nonZeroInt(-9, 9)];
  const x2 = horizontal ? nonZeroInt(-8, 8) : x1;
  const y2 = horizontal ? y1 : nonZeroInt(-9, 9);
  const ok = horizontal ? x2 !== x1 : y2 !== y1;
  if (!ok) return gradientSpecial();

  return {
    subTopic: 'Gradient from Two Points',
    difficulty: 'skill',
    variationId: 'straight-line.gradient-two-points',
    questionLines: [
      `Determine the gradient of the straight line joining $A(${x1}, ${y1})$ and $B(${x2}, ${y2})$.`,
    ],
    boardQuestionLines: [`Gradient of $A(${x1}, ${y1})$ to $B(${x2}, ${y2})$?`],
    solutionSteps: [
      `<strong>1.</strong> Use $m = \\frac{y_{2} - y_{1}}{x_{2} - x_{1}}$:<br><br>$m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = \\frac{${y2 - y1}}{${x2 - x1}}$`,
      horizontal
        ? `<strong>2.</strong> The top is zero, so the gradient is zero. Both points have the same $y$ value, so the line is <strong>horizontal</strong>:<br><br>$m = 0$`
        : `<strong>2.</strong> The bottom is zero, and dividing by zero is not possible. Both points have the same $x$ value, so the line is <strong>vertical</strong> and its gradient is undefined.`,
    ],
    // A vertical line's gradient genuinely is undefined — maths.scot's own
    // answer is that word — so it is written as a sentence rather than as a
    // bare token, which is also what distinguishes it from an interpolation
    // accident for the property check.
    finalAnswer: horizontal ? `$m = 0$` : 'The gradient is undefined',
  };
}

// ── two vectors drawn on a plain lattice — 2015 P2 Q5, 2025 P1 Q13 ─────
//
// The only two vector questions whose figure is a bare grid: ten squares by ten,
// no axes and no numbers, so the components are *counted* rather than read. They
// run opposite ways round — one draws the vectors and asks for the sum, the other
// gives the components and asks for the drawing — which is why they are two ids
// rather than a parameter.

const GRID = 10;

/**
 * Somewhere on the lattice a vector of these components fits.
 *
 * An arrow with no component in one direction is a straight line along a
 * ruling, and placed on the outermost one it lies along the frame — a
 * horizontal resultant seated on the top row came out looking like the edge of
 * the grid with a label above it, not like a vector. So a flat arrow is kept on
 * an interior ruling.
 */
function seat(dx: number, dy: number): [number, number] | null {
  const span = (d: number, flat: boolean): [number, number] => {
    let lo = d < 0 ? -d : 0;
    let hi = GRID - (d > 0 ? d : 0);
    if (flat) { lo = Math.max(lo, 1); hi = Math.min(hi, GRID - 1); }
    return [lo, hi];
  };
  const [xLo, xHi] = span(dx, dx === 0);
  const [yLo, yHi] = span(dy, dy === 0);
  if (xLo > xHi || yLo > yHi) return null;
  return [getRandomInt(xLo, xHi), getRandomInt(yLo, yHi)];
}

/** 2015 P2 Q5: read both off the grid, then add. */
function addFromGrid(): Q | null {
  const p: [number, number] = [nonZeroInt(-6, 6), nonZeroInt(-6, 6)];
  const q: [number, number] = [nonZeroInt(-6, 6), nonZeroInt(-6, 6)];
  // Two arrows pointing much the same way read as one vector drawn twice, and
  // the question is then about a single direction. Rejecting only the exactly
  // parallel pair was not enough — a sheet came out with p and q both up and to
  // the right at almost the same angle, which is visibly not two vectors.
  const angle = Math.abs(Math.atan2(p[1], p[0]) - Math.atan2(q[1], q[0]));
  const between = Math.min(angle, 2 * Math.PI - angle) * 180 / Math.PI;
  if (between < 35 || between > 145) return null;
  const sum: [number, number] = [p[0] + q[0], p[1] + q[1]];
  // A zero resultant has no arrow to draw and no direction to name, and neither
  // paper sets one.
  if (sum[0] === 0 && sum[1] === 0) return null;
  // Nor a zero in either component: 2015 P2 Q5's answer has none, and this
  // drew one in 26 of 200. The owner, on the 2018-2014 light pass: "Yes".
  // This routine is that paper's alone.
  if (sum[0] === 0 || sum[1] === 0) return null;

  const a = seat(...p), b = seat(...q);
  if (!a || !b) return null;
  const pTo: [number, number] = [a[0] + p[0], a[1] + p[1]];
  const qTo: [number, number] = [b[0] + q[0], b[1] + q[1]];
  // Kept apart, as the paper keeps them: two arrows crossing or touching read
  // as a pathway, which is a different question.
  const near = Math.min(
    Math.hypot(a[0] - b[0], a[1] - b[1]), Math.hypot(a[0] - qTo[0], a[1] - qTo[1]),
    Math.hypot(pTo[0] - b[0], pTo[1] - b[1]), Math.hypot(pTo[0] - qTo[0], pTo[1] - qTo[1]),
  );
  if (near < 3) return null;

  const fig = vectorGrid({
    cols: GRID, rows: GRID,
    vectors: [
      { from: a, to: pTo, label: 'p' },
      { from: b, to: qTo, label: 'q' },
    ],
  });
  if (!fig) return null;

  const prose = [
    `The vectors $${bold('p')}$ and $${bold('q')}$ are shown in the diagram.`,
    renderScene(fig.scene),
    `Find the resultant vector $${bold('p')} + ${bold('q')}$.`,
    'Express your answer in component form.',
  ];
  const steps = [
    `<strong>1.</strong> Count the squares each arrow moves — across first, then up — taking left and down as negative:` +
    `<br><br>$${bold('p')} = ${col(p)}$ and $${bold('q')} = ${col(q)}$`,
    `<strong>2.</strong> Add the components:<br><br>$${bold('p')} + ${bold('q')} = ${col(sum)}$`,
  ];
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;

  return {
    subTopic: 'Adding Two Vectors Drawn on a Grid',
    difficulty: 'exam',
    variationId: 'vectors.add-from-grid',
    questionLines: prose,
    boardQuestionLines: [`Two vectors on a grid. Find $${bold('p')} + ${bold('q')}$ in component form.`],
    solutionSteps: steps,
    // 2015 P2 Q5: •¹ components of either vector, •² components of the sum.
    stepMarks: [1, 1],
    finalAnswer: `$${col(sum)}$`,
    figure: fig,
  };
}

/** 2025 P1 Q13: the components given, and the answer is the drawing. */
function drawResultant(): Q | null {
  const p: [number, number] = [nonZeroInt(-5, 5), nonZeroInt(-5, 5)];
  const q: [number, number] = [nonZeroInt(-5, 5), nonZeroInt(-5, 5)];
  const sum: [number, number] = [p[0] + q[0], p[1] + q[1]];
  // **No zero component in the resultant**, as 2025 P1 Q13's (6, -1). A
  // vector straight up, down or across was 60 of 400 draws - the same kind of
  // degenerate draw as "+ 0". The owner, on the 2025 re-review sheet: "Yes".
  // A rejection, and this variation is alone on its clone.
  if (sum[0] === 0 || sum[1] === 0) return null;
  if (Math.abs(sum[0]) > GRID || Math.abs(sum[1]) > GRID) return null;
  // The resultant has to be visibly its own vector, not a near-copy of either.
  if (p[0] * q[1] === p[1] * q[0]) return null;

  const at = seat(...sum);
  if (!at) return null;
  const to: [number, number] = [at[0] + sum[0], at[1] + sum[1]];

  // The question shows an empty grid; the answer shows the arrow on it. Two
  // figures, the same reasoning as the parabola sketches: the drawing *is* the
  // mark, so the working has to end by showing it.
  const blank = vectorGrid({ cols: GRID, rows: GRID, vectors: [] });
  const drawn = vectorGrid({
    cols: GRID, rows: GRID,
    vectors: [{ from: at, to, label: 'p + q' }],
  });
  if (!blank || !drawn) return null;
  if (verifyFigure(blank).length || verifyFigure(drawn).length) return null;

  const prose = [
    `Vectors $${bold('p')}$ and $${bold('q')}$ have components $${bold('p')} = ${col(p)}$ and $${bold('q')} = ${col(q)}$.`,
    `Draw the resultant vector $${bold('p')} + ${bold('q')}$ on the grid.`,
    renderScene(blank.scene),
  ];
  const steps = [
    `<strong>1.</strong> Add the components, across with across and up with up:` +
    `<br><br>$${bold('p')} + ${bold('q')} = ${col(p)} + ${col(q)} = ${col(sum)}$`,
    `<strong>2.</strong> Draw one arrow moving ${Math.abs(sum[0])} square${Math.abs(sum[0]) === 1 ? '' : 's'} ` +
    `${sum[0] < 0 ? 'left' : 'right'} and ${Math.abs(sum[1])} ${Math.abs(sum[1]) === 1 ? 'square' : 'squares'} ` +
    `${sum[1] < 0 ? 'down' : 'up'}. It may start anywhere on the grid, and it <strong>must</strong> carry an arrowhead:` +
    `<br><br>${renderScene(drawn.scene)}`,
  ];

  return {
    subTopic: 'Drawing the Resultant of Two Vectors',
    difficulty: 'exam',
    variationId: 'vectors.draw-resultant',
    questionLines: prose,
    boardQuestionLines: [`$${bold('p')} = ${col(p)}$, $${bold('q')} = ${col(q)}$. Draw $${bold('p')} + ${bold('q')}$.`],
    solutionSteps: steps,
    // 2025 P1 Q13: •¹ the components of p+q (or a nose-to-tail diagram),
    // •² the resultant drawn consistently, with an arrow.
    stepMarks: [1, 1],
    finalAnswer: `A vector ${Math.abs(sum[0])} ${sum[0] < 0 ? 'left' : 'right'} and ${Math.abs(sum[1])} ${sum[1] < 0 ? 'down' : 'up'}, that is $${col(sum)}$, drawn with an arrowhead`,
    figure: drawn,
  };
}

const tried = (name: string, make: () => Q | null): (() => Q) => () => {
  for (let i = 0; i < 4000; i++) {
    const made = make();
    if (made) return made;
  }
  throw new Error(`${name}: no valid question found`);
};

export const VECTOR_GENERATORS: Record<string, Gen> = {
  'Magnitude of a Vector': (w) => magnitude(w),
  'Magnitude as a Surd': magnitudeSurd,
  'A Pathway in Components': componentsMidpoint,
  'Vector Components': components,
  'Finding a Missing Vector': missingVector,
  'Gradient and the x-axis Crossing': gradientAndXIntercept,
  'Gradient from an Equation': () => lineFromEquation(false),
  'Intercept from an Equation': () => lineFromEquation(true),
  'Gradient from Two Points': () => (getRandomInt(1, 5) === 1 ? gradientSpecial() : twoPoints(false)),
  'Equation of a Line from Two Points': (w, asked) => twoPoints(true, w, asked),
  'Adding Two Vectors Drawn on a Grid': tried('vectors.add-from-grid', addFromGrid),
  'Drawing the Resultant of Two Vectors': tried('vectors.draw-resultant', drawResultant),
};
