/**
 * Advanced Higher, Functions & Graphs: how each card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/functions-and-graphs.ts` under the same label.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../../core/draw';
import { poly, sum } from '../../core/maths/format';
import { gcd } from '../../core/maths/integer';
import { type Element, type Pt, type Scene, add, pt, scale, unit } from '../../../diagrams/scene';
import { renderScene } from '../../../diagrams/render';

// ── 2025 P1 Q6 ─────────────────────────────────────────────────────────────
// (x^2 + bx + c)/(x - p) = x + B + C/(x - p), built from the answer;
// then the asymptotes x = p and y = x + B.

interface P1Q6 { p: number; B: number; C: number }

const q2025p1q6: CardRoutine<P1Q6> = {
  draw: () => until(
    () => ({ p: nonZero(-5, 5), B: nonZero(-6, 6), C: int(1, 15) * (int(0, 3) === 0 ? -1 : 1) }),
    // The top has every term, as x^2 + x + 5, and no factor x - p (C is not 0).
    ({ p, B, C }) => B - p !== 0 && C - B * p !== 0 && Math.abs(C - B * p) <= 25,
  ),

  build: ({ p, B, C }): Built => {
    const den = poly([1, -p]);
    const top = poly([1, B - p, C - B * p]);
    const f = `\\frac{${top}}{${den}}`;
    const firstProduct = poly([1, -p, 0]);
    const afterFirst = poly([B, C - B * p]);
    const secondProduct = poly([B, -B * p]);
    const quotient = poly([1, B]);
    const expressed = sum([
      { coef: 1, body: 'x' }, { coef: B, body: '' }, { coef: Math.sign(C), body: `\\frac{${Math.abs(C)}}{${den}}` },
    ]);
    const vertical = `x = ${p}`;
    const slant = `y = ${quotient}`;

    return {
      questionLines: [
        'On a suitable domain a curve is given by the equation $y = f(x)$, where',
        `$f(x) = ${f}.$`,
        `<b>(a)</b> Express $f(x)$ in the form $Ax + B + \\frac{C}{${den}}$, where $A, B$ and $C$ are constants.`,
        '<b>(b)</b> State the equations of the vertical and non-vertical asymptotes of the curve.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> Dividing $${top}$ by $${den}$: the first term is $x$, and $x(${den}) = ${firstProduct}$`,
        `<strong>(a)</strong> $${top} - (${firstProduct}) = ${afterFirst}$; the next term is $${B}$, and $${afterFirst} - (${secondProduct}) = ${C}$, so $f(x) = ${expressed}$`,
        `<strong>(b)</strong> The vertical asymptote is $${vertical}$`,
        `<strong>(b)</strong> The non-vertical asymptote is $${slant}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $f(x) = ${expressed}$<br>(b) Vertical asymptote: $${vertical}$; non-vertical asymptote: $${slant}$`,
      ladder: {
        moves: [
          'The top has a higher power than the bottom. What can you do before looking for asymptotes?',
          `(a) Begin the algebraic division of $${top}$ by $${den}$.`,
          `(a) Finish the division and write $f(x)$ with its remainder over $${den}$.`,
          '(b) Where is the function undefined? That gives the vertical asymptote.',
          '(b) What does $f(x)$ approach as $x$ grows large? Write it as "$y = \\ldots$".',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$${den}$ into $${top}$: the first term is $x$, then $${firstProduct}$`, `$${expressed}$`, null, null],
        watch: { at: 4, text: 'Write each asymptote as an equation: "$x = \\ldots$" and "$y = \\ldots$".' },
      },
    };
  },
};

// ── 2024 P1 Q5 ─────────────────────────────────────────────────────────────
// f(x) = ax³ + bx: odd, from f(-x); then f''(x) = 6ax changes sign at 0.

interface P1Q5of2024 { a: number; b: number }

/** `c(-x)^{n}` as the scheme writes the substitution: `(-x)^{3}`, `-2(-x)^{3}`, `- (-x)`. */
const atMinusX = (c: number, n: number, first: boolean) => {
  const body = n === 1 ? '(-x)' : `(-x)^{${n}}`;
  const size = Math.abs(c) === 1 ? '' : `${Math.abs(c)}`;
  if (first) return `${c < 0 ? '-' : ''}${size}${body}`;
  return `${c < 0 ? ' - ' : ' + '}${size}${body}`;
};

const q2024p1q5: CardRoutine<P1Q5of2024> = {
  draw: () => until(
    () => ({ a: nonZero(-5, 5), b: nonZero(-9, 9) }),
    // No factor common to both terms, as x^3 - x.
    ({ a, b }) => gcd(Math.abs(a), Math.abs(b)) === 1,
  ),

  build: ({ a, b }): Built => {
    const f = sum([{ coef: a, body: 'x^{3}' }, { coef: b, body: 'x' }]);
    const substituted = `${atMinusX(a, 3, true)}${atMinusX(b, 1, false)}`;
    const negated = sum([{ coef: -a, body: 'x^{3}' }, { coef: -b, body: 'x' }]);
    const second = sum([{ coef: 6 * a, body: 'x' }]);
    const [right, left] = a > 0 ? ['\\gt', '\\lt'] : ['\\lt', '\\gt'];
    const signs = `$x \\gt 0 \\Rightarrow f''(x) ${right} 0$ and $x \\lt 0 \\Rightarrow f''(x) ${left} 0$`;

    return {
      questionLines: [
        `The function $f(x)$ is defined by $f(x) = ${f}$, $x \\in \\mathbb{R}.$`,
        '<b>(a)</b> Determine whether $f(x)$ is even, odd or neither.',
        '<b>(b)</b> Show that the graph of $y = f(x)$ has a point of inflection.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $f(-x) = ${substituted}$`,
        `<strong>(a)</strong> $f(-x) = ${negated} = -(${f}) = -f(x)$, so $f(x)$ is odd`,
        `<strong>(b)</strong> $f'(x) = ${sum([{ coef: 3 * a, body: 'x^{2}' }, { coef: b, body: '' }])}$ and $f''(x) = ${second} = 0$ at $x = 0$`,
        `<strong>(b)</strong> ${signs}: the concavity changes, so there is a point of inflection at $x = 0$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: [
        `(a) Odd, since $f(-x) = ${negated} = -(${f}) = -f(x)$`,
        `(b) $f''(x) = ${second} = 0$ at $x = 0.$ Since ${signs}, the concavity changes, indicating a point of inflection.`,
      ].join('<br>'),
      ladder: {
        moves: [
          'What do even and odd mean in terms of $f(-x)$?',
          '(a) Substitute $-x$ into $f$.',
          '(a) Compare the result with $f(x)$ and state which kind of function it is.',
          '(b) Set the second derivative equal to zero.',
          '(b) Check the sign of the second derivative on each side, and state the conclusion.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$f(-x) = ${substituted}$`, `$${negated}$ leading to $= -f(x)$ or $-(${f})$, odd`, null, null],
        watch: { at: 4, text: 'A zero second derivative is not enough on its own. Show the sign changes either side.' },
      },
    };
  },
};

// ── 2021 P1 Q7's diagrams ──────────────────────────────────────────────────
// The question gives the pupil bare axes for (b) and (c)(i), arrows and x and
// y only (the owner, 2026-10-01: "no numbers just y and x", the same on the
// paper's own card). The finished sketches go in the marking instructions,
// never under the answer ("just the markscheme"), drawn as the paper's
// marking instructions draw them: x from -10 to 10 and y from -12 to 12,
// numbered in twos, for x²/(x - 2). Built from the scene's own elements, not
// National 5's `sketchAxes`, so nothing shared with National 5 can move them.
//
// The sketches' window scales with the draw as the paper's does with its
// numbers: x to ±5|p| numbered every |p|, y to ±6a|p| numbered every a|p|. At
// the paper's a = 1, p = 2 that is exactly its diagram.

interface Window2021 { X: number; Y: number; dx: number; dy: number }

const window2021 = (a: number, p: number): Window2021 => {
  const P = Math.abs(p);
  return { X: 5 * P, Y: 6 * a * P, dx: P, dy: a * P };
};

/** One panel, in drawing units: the paper's 20 by 24 graph units. */
const PANEL2021 = { w: 100, h: 120 };
const OVER2021 = 6, ARROW2021 = 4, TICK2021 = 1.8;

/** Graph units to drawing units for a panel whose left edge is at `left`. */
const mapper2021 = (win: Window2021, left: number) => (x: number, y: number): Pt =>
  pt(left + ((x + win.X) * PANEL2021.w) / (2 * win.X), ((y + win.Y) * PANEL2021.h) / (2 * win.Y));

/** An arrowhead at `at` pointing along `along`. */
function arrow2021(at: Pt, along: Pt): Element[] {
  const u = unit(along);
  return [0.4, -0.4].map((turn): Element => {
    const [c, s] = [Math.cos(turn), Math.sin(turn)];
    const dir = pt(u.x * c - u.y * s, u.x * s + u.y * c);
    return { kind: 'segment', from: at, to: add(at, scale(dir, -ARROW2021)), decoration: true };
  });
}

/**
 * Axes through the origin with a part label above: numbered, as the marking
 * instructions draw the finished sketches, or bare, arrows and x and y only,
 * for the pupil to sketch on (the owner: "no numbers just y and x").
 */
function axes2021(win: Window2021, left: number, part: string, numbered = true, yNumbersRight = false): Element[] {
  const D = mapper2021(win, left);
  const o = D(0, 0);
  const xEnd = pt(left + PANEL2021.w + OVER2021, o.y), yEnd = pt(o.x, PANEL2021.h + OVER2021);
  const out: Element[] = [
    { kind: 'segment', from: pt(left - OVER2021, o.y), to: xEnd },
    ...arrow2021(xEnd, pt(1, 0)),
    { kind: 'segment', from: pt(o.x, -OVER2021), to: yEnd },
    ...arrow2021(yEnd, pt(0, 1)),
    { kind: 'label', text: 'x', anchor: xEnd, away: pt(xEnd.x, o.y + 20), small: true },
    { kind: 'label', text: 'y', anchor: yEnd, away: pt(o.x + 20, yEnd.y), small: true },
    { kind: 'label', text: part, anchor: pt(left, PANEL2021.h + OVER2021), away: pt(left + 20, 0), small: true },
  ];
  if (!numbered) return out;
  for (let v = -win.X; v <= win.X; v += win.dx) {
    if (v === 0) continue;
    const at = D(v, 0);
    out.push({ kind: 'segment', from: pt(at.x, o.y - TICK2021), to: pt(at.x, o.y + TICK2021), decoration: true });
    out.push({ kind: 'label', text: `${v}`, role: 'tick-x', anchor: pt(at.x, o.y - 3 * TICK2021), away: pt(at.x, o.y + 20), small: true });
  }
  for (let v = -win.Y; v <= win.Y; v += win.dy) {
    if (v === 0) continue;
    const at = D(0, v);
    out.push({ kind: 'segment', from: pt(o.x - TICK2021, at.y), to: pt(o.x + TICK2021, at.y), decoration: true });
    // The first number below the origin would sit in the row of the x-axis's
    // numbers and read as one of them; its tick stays, the number goes.
    if (v === -win.dy) continue;
    const side = yNumbersRight ? 1 : -1;
    out.push({ kind: 'label', text: `${v}`, role: 'tick-y', anchor: pt(o.x + side * 3 * TICK2021, at.y), away: pt(o.x - side * 20, at.y), small: true });
  }
  return out;
}

/** A line y = mx + c clipped to the window, dashed, or null if it misses it. */
function lineIn2021(win: Window2021, D: (x: number, y: number) => Pt, m: number, c: number): Element | null {
  const xs = [-win.X, win.X, (win.Y - c) / m, (-win.Y - c) / m]
    .filter(x => x >= -win.X - 1e-9 && x <= win.X + 1e-9 && Math.abs(m * x + c) <= win.Y + 1e-9)
    .sort((u, v) => u - v);
  if (xs.length < 2) return null;
  const [lo, hi] = [xs[0], xs[xs.length - 1]];
  return { kind: 'path', points: [D(lo, m * lo + c), D(hi, m * hi + c)], dashed: true };
}

/** `g` sampled across the window, broken at the asymptote and wherever it leaves the window. */
function curve2021(win: Window2021, D: (x: number, y: number) => Pt, g: (x: number) => number, p: number): Element[] {
  const out: Element[] = [];
  let run: Pt[] = [];
  const flush = () => { if (run.length > 1) out.push({ kind: 'path', points: run }); run = []; };
  const N = 600;
  let prev: { x: number; y: number } | null = null;
  for (let i = 0; i <= N; i++) {
    const x = -win.X + (2 * win.X * i) / N;
    // Across the asymptote the branches part: never join them.
    if (Math.abs(x - p) < 1e-9 || (prev && (prev.x - p) * (x - p) < 0)) { flush(); prev = null; continue; }
    const y = g(x);
    if (Math.abs(y) > win.Y) {
      // The stroke runs to the window's edge where the branch leaves it.
      if (run.length) run.push(D(x, Math.sign(y) * win.Y));
      flush();
    } else {
      // And starts from the edge where the branch comes back in.
      if (!run.length && prev && Math.abs(prev.y) > win.Y) run.push(D(prev.x, Math.sign(prev.y) * win.Y));
      run.push(D(x, y));
    }
    prev = { x, y };
  }
  flush();
  return out;
}

/** The blank axes the paper provides for (b) and (c)(i), side by side. */
function blankAxes2021(a: number, p: number): Scene {
  const win = window2021(a, p);
  // Bare, so the same on every draw: the pupil's sketch shows the shape, its
  // asymptotes and the turning points the question gives, as the paper asks.
  return {
    elements: [...axes2021(win, 0, '(b)', false), ...axes2021(win, PANEL2021.w + 40, '(c)(i)', false)],
    target: 460,
  };
}

/** The finished sketch of f, or of |f|, as the marking instructions draw it. */
function sketch2021(a: number, p: number, modulus: boolean): Scene {
  const win = window2021(a, p);
  const D = mapper2021(win, 0);
  const f = (x: number) => (a * x * x) / (x - p);
  const g = modulus ? (x: number) => Math.abs(f(x)) : f;
  const lines = [
    { kind: 'path', points: [D(p, -win.Y), D(p, win.Y)], dashed: true } as Element,
    lineIn2021(win, D, a, a * p),
    modulus ? lineIn2021(win, D, -a, -a * p) : null,
  ].filter((e): e is Element => e !== null);
  const turning = [[0, 0], [2 * p, modulus ? Math.abs(4 * a * p) : 4 * a * p]];
  return {
    elements: [
      // With the vertical asymptote left of the y-axis, the y-axis numbers go on
      // its right, clear of the asymptote and the steep branch beside it (the
      // owner, full read 2026-10-05).
      ...axes2021(win, 0, modulus ? '(c)(i)' : '(b)', true, p < 0),
      ...lines,
      ...curve2021(win, D, g, p),
      ...turning.map(([x, y]): Element => ({ kind: 'dot', at: D(x, y), small: true })),
    ],
    target: 340,
  };
}

// ── 2021 P1 Q7 ─────────────────────────────────────────────────────────────
// f(x) = ax²/(x - p) = ax + ap + ap²/(x - p): the asymptotes x = p and
// y = ax + ap, turning points (0, 0) and (2p, 4ap), the sketches of f and |f|,
// and |f(x)| = k twice exactly for 0 < k < 4a|p|.

interface P1Q7of2021 { a: number; p: number }

const q2021p1q7: CardRoutine<P1Q7of2021> = {
  draw: () => until(
    () => ({ a: int(1, 3), p: nonZero(-5, 5) }),
    // The remainder ap² at most 25, so every number in the working is within
    // 25: the paper's own arithmetic, 4 and 8, kept to the times tables.
    ({ a, p }) => a * p * p <= 25,
  ),

  build: ({ a, p }): Built => {
    const top = a === 1 ? 'x^{2}' : `${a}x^{2}`;
    const den = poly([1, -p]);
    const f = `\\frac{${top}}{${den}}`;
    const remainder = `\\frac{${a * p * p}}{${den}}`;
    const quotient = poly([a, a * p]);
    const expressed = `${quotient} + ${remainder}`;
    const slant = `y = ${quotient}`;
    const reflected = `y = ${poly([-a, -a * p])}`;
    const point = (x: number, y: number) => `(${x}, ${y})`;
    const origin = point(0, 0), other = point(2 * p, 4 * a * p);
    const K = 4 * a * Math.abs(p);
    const [maximum, minimum] = p > 0 ? [origin, other] : [other, origin];
    const sketchF = `a sketch with the asymptotes $x = ${p}$ and $${slant}$ dashed: the left branch rising along $${slant}$ to the maximum at $${maximum}$, then falling to $-\\infty$ as $x \\to ${p}^{-}$; the right branch coming down from $+\\infty$ as $x \\to ${p}^{+}$ to the minimum at $${minimum}$, then rising along $${slant}$`;
    const leftReflected = p > 0
      ? `the left branch runs down along $${reflected}$ to $${origin}$, then rises to $+\\infty$ as $x \\to ${p}^{-}$`
      : `the left branch, reflected, runs down along $${reflected}$ to its minimum at $${point(2 * p, K)}$, then rises to $+\\infty$ as $x \\to ${p}^{-}$`;
    const sketchAbs = `a sketch of $y = |f(x)|$ with the asymptotes $x = ${p}$, $${slant}$ and $${reflected}$: ${leftReflected}; the right branch is unchanged, with its minimum at $${minimum}$`;
    // The branch through the origin meets every y = k > 0 twice; the other
    // branch's turning point is at height K, so it meets y = k only for k ≥ K.
    const [touching, apart] = p > 0 ? ['left', 'right'] : ['right', 'left'];
    const twice = `A line $y = k$ meets the ${touching} branch twice for every $k \\gt 0$, and the ${apart} branch only when $k \\geq ${K}$: exactly two solutions when $0 \\lt k \\lt ${K}$`;
    const justify = `As $x \\to \\pm\\infty$, $${remainder} \\to 0$`;
    const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const blank = blankAxes2021(a, p), drawnF = sketch2021(a, p, false), drawnAbs = sketch2021(a, p, true);
    return {
      questionLines: [
        `A function is defined on a suitable domain by $f(x) = ${f}.$`,
        '<b>(a)</b> For the graph of $y = f(x)$',
        '(i) state the equation of the vertical asymptote',
        '(ii) find the equation of the non-vertical asymptote. Justify your answer.',
        `The turning points on the graph are $${origin}$ and $${other}.$ There are no other stationary points.`,
        // The paper's words, now that the card provides the diagram (the owner
        // on the 2021 P1 sheet: "It should say on the diagram provided").
        '<b>(b)</b> On the diagram provided, sketch the graph of $y = f(x).$',
        '<b>(c)</b> (i) On the diagram provided, sketch the graph of $y = |f(x)|.$ Show all asymptotes.',
        '(ii) State the values of $k$ for which $|f(x)| = k$ has exactly two distinct solutions.',
        renderScene(blank),
      ],
      figure: { scene: blank, claims: [] },
      markschemeFigures: [
        { part: '(b)', figure: { scene: drawnF, claims: [] }, svg: renderScene(drawnF) },
        { part: '(c)(i)', figure: { scene: drawnAbs, claims: [] }, svg: renderScene(drawnAbs) },
      ],
      solutionSteps: [
        `<strong>(a)(i)</strong> The denominator is zero at $x = ${p}$: the vertical asymptote is $x = ${p}$`,
        `<strong>(a)(ii)</strong> Dividing $${top}$ by $${den}$: $f(x) = ${expressed}$`,
        `<strong>(a)(ii)</strong> ${justify}, so the non-vertical asymptote is $${slant}$`,
        `<strong>(b)</strong> ${sentence(sketchF)}`,
        `<strong>(c)(i)</strong> ${sentence(sketchAbs)}`,
        `<strong>(c)(ii)</strong> ${twice}`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: [
        `(a)(i) $x = ${p}$`,
        `(a)(ii) $${slant}$ (${justify})`,
        `(b) ${sentence(sketchF)}`,
        `(c)(i) ${sentence(sketchAbs)}`,
        `(c)(ii) $0 \\lt k \\lt ${K}$`,
      ].join('<br>'),
      ladder: {
        moves: [
          'Where is the function undefined, and what does it look like for very large $x$?',
          '(a)(i) Where is the denominator zero? That gives the vertical asymptote.',
          `(a)(ii) Divide $${top}$ by $${den}$ algebraically and rewrite $f(x)$.`,
          '(a)(ii) Say what happens to the remainder term as $x$ gets large, and state the asymptote.',
          '(b) Sketch the asymptotes, then both branches through the turning points, approaching the asymptotes.',
          '(c)(i) Reflect the parts below the $x$-axis in the axis, and draw the reflected asymptote as well.',
          '(c)(ii) Draw horizontal lines $y = k$ across your sketch. For which $k$ do they cross it exactly twice?',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, null, `$${expressed}$`, `${justify} $\\therefore ${slant}$`, sentence(sketchF), sentence(sketchAbs), null],
        watch: { at: 3, text: 'The question asks you to justify the asymptote. Say what happens to the remainder term.' },
      },
    };
  },
};

// ── 2019 Q3's diagrams ─────────────────────────────────────────────────────
// The paper's: bare axes with arrows, x, y and O, the curve, and its roots
// labelled in a (-a and a), drawn at a = 1. The sketch of |f| is the marking
// instructions', shown with the working only, never under "Show answer" (the
// owner on 2021 P1 Q7, 2026-10-01: "just the markscheme"). Built from the
// scene's own elements, so nothing shared with National 5 can move them.

type Form2019 = 'x2-a2' | 'a2-x2' | 'x3-a2x' | 'a2x-x3' | 'x2-ax' | 'ax-x2'
  // The owner on the 2019 sheet: "Keep as a? Could we have 6 more of similar
  // difficulty to initial question?": six more quadratics, a still a letter.
  | 'x2-4a2' | '4a2-x2' | 'x2-2ax' | '2ax-x2' | 'x2+ax-2a2' | 'x2-ax-2a2';

interface Shape2019 {
  tex: string;
  g: (x: number) => number;
  /** Where the curve crosses the x-axis at a = 1, and how each is labelled. */
  roots: { x: number; text: string }[];
  parity: 'even' | 'odd' | 'neither';
  /** f(-x) worked, as the scheme's alternative reason. */
  atMinusX: string;
  /** The curve's x-range and the y-window around it. */
  xs: [number, number]; ys: [number, number];
  sketch: string;
}

const BOTH = 'sharp points on the $x$-axis at $-a$, $0$ and $a$ (labelled): the part between $-a$ and $0$ and the part between $0$ and $a$ both above the axis, the arms beyond $-a$ and $a$ rising, and line symmetry about the $y$-axis';
const HUMP = 'sharp points on the $x$-axis at $0$ and $a$ (labelled), the part between them reflected above the axis, a hump with its maximum at $\\left(\\frac{a}{2}, \\frac{a^{2}}{4}\\right)$, and the arms outside unchanged';

const SHAPES2019: Record<Form2019, Shape2019> = {
  'x2-a2': {
    tex: 'x^{2} - a^{2}', g: x => x * x - 1, roots: [{ x: -1, text: '−a' }, { x: 1, text: 'a' }], parity: 'even',
    atMinusX: '(-x)^{2} - a^{2} = x^{2} - a^{2} = f(x)', xs: [-2, 2], ys: [-1.6, 3.2],
    sketch: 'a curve meeting the $x$-axis in sharp points at $-a$ and $a$ (labelled), with a local maximum at $(0, a^{2})$ on the $y$-axis, the parts for $|x| \\gt a$ unchanged, and line symmetry about the $y$-axis',
  },
  'a2-x2': {
    tex: 'a^{2} - x^{2}', g: x => 1 - x * x, roots: [{ x: -1, text: '−a' }, { x: 1, text: 'a' }], parity: 'even',
    atMinusX: 'a^{2} - (-x)^{2} = a^{2} - x^{2} = f(x)', xs: [-2, 2], ys: [-3.2, 1.6],
    sketch: 'the part between $-a$ and $a$ unchanged, with its maximum at $(0, a^{2})$, and the arms beyond reflected above the $x$-axis, meeting it in sharp points at $-a$ and $a$ (labelled), with line symmetry about the $y$-axis',
  },
  'x3-a2x': {
    tex: 'x^{3} - a^{2}x', g: x => x ** 3 - x, roots: [{ x: -1, text: '−a' }, { x: 0, text: '' }, { x: 1, text: 'a' }], parity: 'odd',
    atMinusX: '(-x)^{3} - a^{2}(-x) = -x^{3} + a^{2}x = -f(x)', xs: [-1.55, 1.55], ys: [-2.4, 2.4], sketch: BOTH,
  },
  'a2x-x3': {
    tex: 'a^{2}x - x^{3}', g: x => x - x ** 3, roots: [{ x: -1, text: '−a' }, { x: 0, text: '' }, { x: 1, text: 'a' }], parity: 'odd',
    atMinusX: 'a^{2}(-x) - (-x)^{3} = -a^{2}x + x^{3} = -f(x)', xs: [-1.55, 1.55], ys: [-2.4, 2.4], sketch: BOTH,
  },
  'x2-ax': {
    tex: 'x^{2} - ax', g: x => x * x - x, roots: [{ x: 0, text: '' }, { x: 1, text: 'a' }], parity: 'neither',
    atMinusX: '(-x)^{2} - a(-x) = x^{2} + ax', xs: [-1.1, 2.1], ys: [-0.9, 2.6], sketch: HUMP,
  },
  'ax-x2': {
    tex: 'ax - x^{2}', g: x => x - x * x, roots: [{ x: 0, text: '' }, { x: 1, text: 'a' }], parity: 'neither',
    atMinusX: 'a(-x) - (-x)^{2} = -ax - x^{2}', xs: [-1.1, 2.1], ys: [-2.6, 0.9],
    sketch: 'sharp points on the $x$-axis at $0$ and $a$ (labelled), the part between them a hump above the axis with its maximum at $\\left(\\frac{a}{2}, \\frac{a^{2}}{4}\\right)$, and the arms outside reflected upwards',
  },
  'x2-4a2': {
    tex: 'x^{2} - 4a^{2}', g: x => x * x - 4, roots: [{ x: -2, text: '−2a' }, { x: 2, text: '2a' }], parity: 'even',
    atMinusX: '(-x)^{2} - 4a^{2} = x^{2} - 4a^{2} = f(x)', xs: [-2.8, 2.8], ys: [-4.8, 4.5],
    sketch: 'a curve meeting the $x$-axis in sharp points at $-2a$ and $2a$ (labelled), with a local maximum at $(0, 4a^{2})$ on the $y$-axis, the parts for $|x| \\gt 2a$ unchanged, and line symmetry about the $y$-axis',
  },
  '4a2-x2': {
    tex: '4a^{2} - x^{2}', g: x => 4 - x * x, roots: [{ x: -2, text: '−2a' }, { x: 2, text: '2a' }], parity: 'even',
    atMinusX: '4a^{2} - (-x)^{2} = 4a^{2} - x^{2} = f(x)', xs: [-2.8, 2.8], ys: [-4.5, 4.8],
    sketch: 'the part between $-2a$ and $2a$ unchanged, with its maximum at $(0, 4a^{2})$, and the arms beyond reflected above the $x$-axis, meeting it in sharp points at $-2a$ and $2a$ (labelled), with line symmetry about the $y$-axis',
  },
  'x2-2ax': {
    tex: 'x^{2} - 2ax', g: x => x * x - 2 * x, roots: [{ x: 0, text: '' }, { x: 2, text: '2a' }], parity: 'neither',
    atMinusX: '(-x)^{2} - 2a(-x) = x^{2} + 2ax', xs: [-0.9, 2.9], ys: [-1.6, 3],
    sketch: 'sharp points on the $x$-axis at $0$ and $2a$ (labelled), the part between them reflected above the axis, a hump with its maximum at $(a, a^{2})$, and the arms outside unchanged',
  },
  '2ax-x2': {
    tex: '2ax - x^{2}', g: x => 2 * x - x * x, roots: [{ x: 0, text: '' }, { x: 2, text: '2a' }], parity: 'neither',
    atMinusX: '2a(-x) - (-x)^{2} = -2ax - x^{2}', xs: [-0.9, 2.9], ys: [-3, 1.6],
    sketch: 'sharp points on the $x$-axis at $0$ and $2a$ (labelled), the part between them a hump above the axis with its maximum at $(a, a^{2})$, and the arms outside reflected upwards',
  },
  'x2+ax-2a2': {
    tex: 'x^{2} + ax - 2a^{2}', g: x => x * x + x - 2, roots: [{ x: -2, text: '−2a' }, { x: 1, text: 'a' }], parity: 'neither',
    atMinusX: '(-x)^{2} + a(-x) - 2a^{2} = x^{2} - ax - 2a^{2}', xs: [-3, 2], ys: [-2.8, 4.5],
    sketch: 'sharp points on the $x$-axis at $-2a$ and $a$ (labelled), the part between them a hump above the axis with its maximum at $\\left(-\\frac{a}{2}, \\frac{9a^{2}}{4}\\right)$, and the arms outside unchanged',
  },
  'x2-ax-2a2': {
    tex: 'x^{2} - ax - 2a^{2}', g: x => x * x - x - 2, roots: [{ x: -1, text: '−a' }, { x: 2, text: '2a' }], parity: 'neither',
    atMinusX: '(-x)^{2} - a(-x) - 2a^{2} = x^{2} + ax - 2a^{2}', xs: [-2, 3], ys: [-2.8, 4.5],
    sketch: 'sharp points on the $x$-axis at $-a$ and $2a$ (labelled), the part between them a hump above the axis with its maximum at $\\left(\\frac{a}{2}, \\frac{9a^{2}}{4}\\right)$, and the arms outside unchanged',
  },
};

const PANEL2019 = { w: 110, h: 130 }, OVER2019 = 8, ARROW2019 = 4;

/** The graph of g, or of |g|, on bare axes with the roots labelled. */
function graph2019(shape: Shape2019, modulus: boolean): Scene {
  const g = modulus ? (x: number) => Math.abs(shape.g(x)) : shape.g;
  const [x0, x1] = shape.xs;
  // |g| has no part below the axis: its window keeps the top and a margin below.
  const [y0, y1] = modulus ? [-0.15 * Math.max(Math.abs(shape.ys[0]), shape.ys[1]), Math.max(Math.abs(shape.ys[0]), shape.ys[1])] : shape.ys;
  const pad = 0.12 * (x1 - x0);
  const D = (x: number, y: number) => pt(((x - x0 + pad) * PANEL2019.w) / (x1 - x0 + 2 * pad), ((y - y0) * PANEL2019.h) / (y1 - y0));
  const o = D(0, 0);
  const xEnd = pt(PANEL2019.w + OVER2019, o.y), yEnd = pt(o.x, PANEL2019.h + OVER2019);
  const head = (at: Pt, along: Pt): Element[] => [0.4, -0.4].map((turn): Element => {
    const [c, s] = [Math.cos(turn), Math.sin(turn)];
    const dir = pt(along.x * c - along.y * s, along.x * s + along.y * c);
    return { kind: 'segment', from: at, to: add(at, scale(dir, -ARROW2019)), decoration: true };
  });
  const points: Pt[] = [];
  for (let i = 0; i <= 300; i++) {
    const x = x0 + ((x1 - x0) * i) / 300;
    points.push(D(x, g(x)));
  }
  // A label at a root goes where the curve is not: a rising curve fills the
  // bottom-left and top-right of the crossing, so the label sits bottom-right;
  // a falling one, bottom-left; at a sharp point of |f| the curve is above, so
  // straight below. `away` is the point the label is pushed from.
  // A root's label goes outward, away from O and its label: below the axis
  // where the curve leaves room there (as the paper's -a and a), else above.
  const rising = (x: number) => shape.g(x + 1e-4) > shape.g(x - 1e-4);
  const clearOf = (x: number): Pt => {
    const at = D(x, 0);
    if (modulus) return pt(at.x, at.y + 10);
    const out = x < 0 ? -1 : 1;
    // A rising crossing fills bottom-left and top-right, a falling one top-left and bottom-right.
    const belowClear = (out < 0) !== rising(x);
    return pt(at.x - 10 * out, at.y + (belowClear ? 10 : -10));
  };
  // Each label starts a few units off its point, along its push, so it stands
  // clear of the axis it sits under (as 2021 P1 Q7's numbers start off their ticks).
  const off = (at: Pt, away: Pt, by = 5): Pt => add(at, scale(unit(pt(at.x - away.x, at.y - away.y)), by));
  const labels: Element[] = shape.roots.filter(r => r.text).map((r): Element => {
    const at = D(r.x, 0), away = clearOf(r.x);
    return { kind: 'label', text: r.text, anchor: off(at, away), away, small: true };
  });
  // Where the curve passes through the origin, O takes the clear side above
  // the axis (top-left of a rising crossing, top-right of a falling one), as
  // the root labels are all below it. On |f| the curve is all above the axis,
  // so O keeps its bottom-left, clear of the y-axis.
  // Off the origin, O keeps the paper's bottom-left unless the curve runs
  // close by there (x² - ax - 2a² dips just below-left of it); then the first
  // other corner the curve leaves clear.
  const throughO = shape.roots.some(r => r.x === 0);
  const corners = [pt(o.x + 10, o.y + 10), pt(o.x + 10, o.y - 10), pt(o.x - 10, o.y - 10), pt(o.x - 10, o.y + 10)];
  const roomy = (away: Pt) => {
    const at = off(o, away, 7);
    return points.every(p => Math.hypot(p.x - at.x, p.y - at.y) > 11);
  };
  // |f| never goes below the axis, so on the sketch O always has its bottom-left.
  const oAway = modulus ? corners[0]
    : throughO ? (rising(0) ? corners[1] : corners[2])
    : corners.find(roomy) ?? corners[0];
  return {
    elements: [
      { kind: 'segment', from: pt(-OVER2019, o.y), to: xEnd },
      ...head(xEnd, pt(1, 0)),
      { kind: 'segment', from: pt(o.x, -OVER2019), to: yEnd },
      ...head(yEnd, pt(0, 1)),
      { kind: 'label', text: 'x', anchor: xEnd, away: pt(xEnd.x, o.y + 20), small: true },
      { kind: 'label', text: 'y', anchor: yEnd, away: pt(o.x + 20, yEnd.y), small: true },
      // O sits in the corner of both axes, so it needs a little more room than a root label.
      { kind: 'label', text: 'O', anchor: off(o, oAway, 7), away: oAway, small: true },
      { kind: 'path', points },
      ...labels,
    ],
    target: 260,
  };
}

// ── 2019 Q3 ────────────────────────────────────────────────────────────────
// The graph of f in terms of a: (a) odd, even or neither, with the reason;
// (b) the sketch of |f|. The paper's x² - a² is even; a card that asks the
// pupil to decide must not always give the same answer (the owner's rule
// from 2023 P1 Q3), so two even, two odd and two neither, the roots always
// labelled in a.

interface Q3of2019 { form: Form2019 }

const q2019q3: CardRoutine<Q3of2019> = {
  draw: () => ({ form: pick(Object.keys(SHAPES2019) as Form2019[]) }),

  build: ({ form }): Built => {
    const shape = SHAPES2019[form];
    const graph = graph2019(shape, false), sketch = graph2019(shape, true);
    const reason = {
      even: `Even. The graph is symmetrical about the $y$-axis (or $f(-x) = ${shape.atMinusX}$).`,
      odd: `Odd. The graph has half-turn symmetry about the origin (or $f(-x) = ${shape.atMinusX}$).`,
      neither: `Neither. The graph is not symmetrical about the $y$-axis and has no half-turn symmetry about the origin (or $f(-x) = ${shape.atMinusX}$, which is neither $f(x)$ nor $-f(x)$).`,
    }[shape.parity];
    const sketchText = `A sketch of $y = |f(x)|$: ${shape.sketch}.`;
    const naming = { even: 'naming the $y$-axis or working out $f(-x)$', odd: 'naming the origin or working out $f(-x)$', neither: 'saying what symmetry is missing, or working out $f(-x)$' }[shape.parity];
    const watch = {
      even: 'Name the $y$-axis in your reason. "It is symmetrical" alone is not enough.',
      odd: 'Name the origin in your reason. "It is symmetrical" alone is not enough.',
      neither: 'Say which symmetry is missing, or show $f(-x)$. "It is not symmetrical" alone is not enough.',
    }[shape.parity];
    return {
      questionLines: [
        `The function $f(x)$ is defined by $f(x) = ${shape.tex}.$ The graph of $y = f(x)$ is shown in the diagram.`,
        renderScene(graph),
        '<b>(a)</b> State whether $f(x)$ is odd, even or neither. Give a reason for your answer.',
        '<b>(b)</b> Sketch the graph of $y = |f(x)|.$',
      ],
      figure: { scene: graph, claims: [] },
      markschemeFigures: [{ part: '(b)', figure: { scene: sketch, claims: [] }, svg: renderScene(sketch) }],
      solutionSteps: [
        `<strong>(a)</strong> ${reason}`,
        `<strong>(b)</strong> ${sketchText}`,
      ],
      stepMarks: [1, 1],
      finalAnswer: [`(a) ${reason}`, `(b) ${sketchText}`].join('<br>'),
      ladder: {
        moves: [
          'What do even and odd mean, for a graph and for $f(-x)$?',
          `(a) Say which it is, and give the reason, ${naming}.`,
          '(b) Reflect the part of the graph below the $x$-axis in the axis, keeping the rest.',
        ],
        marks: [0, 1, 1],
        shows: [null, reason, null],
        watch: { at: 1, text: watch },
      },
    };
  },
};

export const ROUTINES = {
  '2019 Q3': q2019q3,
  '2021 P1 Q7': q2021p1q7,
  '2024 P1 Q5': q2024p1q5,
  '2025 P1 Q6': q2025p1q6,
};
