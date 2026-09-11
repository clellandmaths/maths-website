import { GeneratedQuestion } from './types';
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

// ── combine two vectors — 2014 P1 Q4, 2016 P1 Q1, 2024 P1 Q4 and six more ─

function components(): Q {
  for (let tries = 0; tries < 200; tries++) {
    const dim = getRandomInt(0, 1) === 0 ? 2 : 3;
    // The papers name their vectors p/q (3), u/v (2) and a/b (1) - three pairs
    // across seven questions, so the variety here is theirs. `s`/`t` is not a
    // pair any of them uses.
    const [n1, n2] = pick([['p', 'q'], ['p', 'q'], ['p', 'q'], ['u', 'v'], ['u', 'v'], ['a', 'b']]);
    const half = getRandomInt(1, 5) === 1;            // the 2016 P1 Q1 shape
    const k1 = half ? 0.5 : getRandomInt(1, 4);
    const k2 = getRandomInt(1, 3);
    const minus = getRandomInt(0, 1) === 0;

    // a half scalar needs even components, or the answer is not whole
    const step = half ? 2 : 1;
    const A = Array.from({ length: dim }, () => nonZeroInt(-9, 9) * step);
    const B = Array.from({ length: dim }, () => nonZeroInt(-9, 9));
    if (half && A.some(v => Math.abs(v) > 18)) continue;

    const R = A.map((v, i) => k1 * v + (minus ? -1 : 1) * k2 * B[i]);
    if (R.some(v => !Number.isInteger(v) || Math.abs(v) > 40)) continue;
    if (R.every(v => v === 0)) continue;

    const expr = `${scaled(k1, n1)} ${minus ? '-' : '+'} ${scaled(k2, n2)}`;
    return {
      subTopic: 'Vector Components',
      difficulty: 'skill',
      variationId: 'vectors.components',
      questionLines: [
        `Given $${bold(n1)} = ${col(A)}$ and $${bold(n2)} = ${col(B)}$,`,
        `find the resultant vector $${expr}$.`,
        `Express your answer in component form.`,
      ],
      boardQuestionLines: [`$${expr}$ where $${bold(n1)} = ${col(A)}$, $${bold(n2)} = ${col(B)}$`],
      solutionSteps: [
        `<strong>1.</strong> Multiply each vector by its number:<br><br>$${scaled(k1, n1)} = ${col(A.map(v => k1 * v))}$ and $${scaled(k2, n2)} = ${col(B.map(v => k2 * v))}$`,
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
  const dim = getRandomInt(0, 1) === 0 ? 2 : 3;
  const [n1, n2] = pick([['u', 'v'], ['p', 'q'], ['a', 'b']]);
  const A = Array.from({ length: dim }, () => nonZeroInt(-9, 9));
  const V = Array.from({ length: dim }, () => nonZeroInt(-9, 9));
  const sum = A.map((v, i) => v + V[i]);

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
    const a = nonZeroInt(-9, 9);
    const b = nonZeroInt(-9, 9);
    const c = nonZeroInt(-30, 30);
    if (Math.abs(b) === 1 && Math.abs(a) === 1) continue;   // too easy to be worth asking
    const m = -a / b;
    const yInt = -c / b;
    if (wantIntercept && !Number.isInteger(yInt)) continue;
    if (Math.abs(yInt) > 20) continue;

    const zeroForm = getRandomInt(0, 1) === 0;
    const lhs = `${a === 1 ? '' : a === -1 ? '-' : a}x ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y`;
    const equation = zeroForm
      ? `${lhs} ${c < 0 ? '-' : '+'} ${Math.abs(c)} = 0`
      : `${lhs} = ${-c}`;

    const mTex = frac(-a, b);
    const rearranged = `y = ${mTex === '1' ? '' : mTex === '-1' ? '-' : mTex}x ${yInt < 0 ? '-' : '+'} ${frac(Math.abs(-c), Math.abs(b))}`;

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
          `<strong>1.</strong> The line crosses the $y$-axis where $x = 0$, so substitute and solve for $y$:<br><br>$${b < 0 ? '-' : ''}${Math.abs(b) === 1 ? '' : Math.abs(b)}y ${c < 0 ? '-' : '+'} ${Math.abs(c)} = 0$, giving $y = ${yInt}$`,
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
        `<strong>1.</strong> Rearrange into the form $y = mx + c$. Move everything except the $y$ term to the other side, then divide by $${b}$:<br><br>$${rearranged}$`,
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

function twoPoints(wantEquation: boolean): Q {
  for (let tries = 0; tries < 200; tries++) {
    const [x1, y1] = [nonZeroInt(-8, 8), nonZeroInt(-9, 9)];
    const [x2, y2] = [nonZeroInt(-8, 8), nonZeroInt(-9, 9)];
    if (x1 === x2) continue;                        // undefined gradient
    if (y1 === y2) continue;                        // a horizontal line is no test
    const num = y2 - y1, den = x2 - x1;
    const mTex = frac(num, den);
    if (wantEquation && den !== 0 && num % den !== 0) continue;   // keep c whole
    const m = num / den;
    const c = y1 - m * x1;

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
     * **One of the three papers draws the line; two do not.**
     *
     * 2017 P1 Q6 prints axes with A and B marked and their coordinates written
     * beside them - *and* states both in the prose, which is what separates it
     * from `straight-line.from-marked-points`, where the coordinates are only on
     * the picture. 2015 P1 Q8 and 2022 P1 Q6 are pure text. So the figure
     * appears on roughly a third of draws rather than always or never, which is
     * the presentation split those three citations actually have.
     */
    const drawIt = getRandomInt(1, 3) === 1;
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
    const ask = drawIt
      ? `The diagram shows the straight line joining $A(${x1}, ${y1})$ and $B(${x2}, ${y2})$.`
      : `Find the equation of the straight line passing through $A(${x1}, ${y1})$ and $B(${x2}, ${y2})$.`;
    const follow = drawIt ? `Find the equation of the line $AB$.` : null;
    if (fig && verifyFigure(fig, `${ask} ${follow} ${equation}`).length) continue;

    return {
      subTopic: 'Equation of a Line from Two Points',
      difficulty: 'skill',
      variationId: 'straight-line.equation-two-points',
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
    if (whole.every(v => v === 0) || toEnd.every(v => v === 0)) continue;

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

function magnitude(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const difference = getRandomInt(1, 3) === 1;   // the |a - b| shape
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
  if (sum[0] === 0 && sum[1] === 0) return null;
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

export const VECTOR_GENERATORS: Record<string, () => Q> = {
  'Magnitude of a Vector': magnitude,
  'Magnitude as a Surd': magnitudeSurd,
  'A Pathway in Components': componentsMidpoint,
  'Vector Components': components,
  'Finding a Missing Vector': missingVector,
  'Gradient and the x-axis Crossing': gradientAndXIntercept,
  'Gradient from an Equation': () => lineFromEquation(false),
  'Intercept from an Equation': () => lineFromEquation(true),
  'Gradient from Two Points': () => (getRandomInt(1, 5) === 1 ? gradientSpecial() : twoPoints(false)),
  'Equation of a Line from Two Points': () => twoPoints(true),
  'Adding Two Vectors Drawn on a Grid': tried('vectors.add-from-grid', addFromGrid),
  'Drawing the Resultant of Two Vectors': tried('vectors.draw-resultant', drawResultant),
};
