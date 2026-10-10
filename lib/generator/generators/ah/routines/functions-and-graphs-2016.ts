/**
 * Advanced Higher, Functions and Graphs: how each 2016 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/functions-and-graphs.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { pick } from '../../core/draw';
import { type Element, type Pt, type Scene, add, pt, scale, unit } from '../../../diagrams/scene';
import { renderScene } from '../../../diagrams/render';

// ── 2016 Q12 ───────────────────────────────────────────────────────────────
// A straight line y = f(x) through ±c on each axis, given only in c: (a) the
// sketch of |f(x) + d|, the line moved by d and its lower part reflected;
// (b) the sketch of |kf(x)|. Each is a V on the x-axis, described by its
// vertex and where it meets the y-axis, as the paper's answers are. The
// sketches are the marking instructions', never under "Show answer".

/** f(x) = s(x - r)c-style: slope s (±1), root r and y-intercept -sr, in units of c. */
interface Line2016 { s: 1 | -1; r: 1 | -1 }

interface Q12of2016 { line: Line2016; d: number; k: 2 | 3 }

/** The paper's x - c, and the other three lines through ±c on both axes. */
const LINES2016: readonly Line2016[] = [{ s: 1, r: 1 }, { s: 1, r: -1 }, { s: -1, r: 1 }, { s: -1, r: -1 }];

/**
 * (a)'s shift d (in c) on each line: ±c and ±2c, except the one that puts the
 * V's point at O, where it would meet the y-axis at 0 and have nothing to mark.
 */
const SETS2016: readonly Q12of2016[] = LINES2016.flatMap(line =>
  [-2, -1, 1, 2].filter(d => -line.s * line.r + d !== 0)
    .flatMap(d => [2, 3].map(k => ({ line, d, k: k as 2 | 3 }))));

/** A multiple of c as the paper writes it: `c`, `-2c`. */
const inC = (m: number) => (m === 1 ? 'c' : m === -1 ? '-c' : `${m}c`);
/** The same for a figure's label, with a true minus sign. */
const label = (m: number) => inC(m).replace('-', '−');

const UNIT2016 = 30, ARROW2016 = 5, TICK2016 = 2;

function arrow2016(at: Pt, along: Pt): Element[] {
  const u = unit(along);
  return [0.4, -0.4].map((turn): Element => {
    const [c, s] = [Math.cos(turn), Math.sin(turn)];
    const dir = pt(u.x * c - u.y * s, u.x * s + u.y * c);
    return { kind: 'segment', from: at, to: add(at, scale(dir, -ARROW2016)), decoration: true };
  });
}

/**
 * A label at a point, pushed out along the first of `dirs` the renderer finds
 * clear (`alternatives`), starting a few units off it so the lines through
 * the point still count against it.
 */
function seated(text: string, at: Pt, dirs: readonly [number, number][], off = 6): Element {
  const anchor = add(at, pt(off * dirs[0][0], off * dirs[0][1]));
  const [first, ...rest] = dirs.map(([dx, dy]) => add(anchor, pt(-10 * dx, -10 * dy)));
  return { kind: 'label', text, anchor, away: first, alternatives: rest, small: true };
}

/**
 * Axes with arrows, x, y and O, and the graph of y = g(x) (a straight line
 * or a V) across the window, cut where it leaves it; a tick and its number in
 * c where the graph meets each axis. `xs` and `ys` are the window, in c.
 */
function graph2016(
  g: (x: number) => number, xs: [number, number], ys: [number, number],
  marks: { at: Pt; text: string; dirs: [number, number][] }[],
  oDirs: [number, number][] = [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  target = 240,
): Scene {
  const D = (x: number, y: number) => pt(x * UNIT2016, y * UNIT2016);
  const xEnd = D(xs[1] + 0.4, 0), yEnd = D(0, ys[1] + 0.4);
  const points: Pt[] = [];
  for (let i = 0; i <= 400; i++) {
    const x = xs[0] + ((xs[1] - xs[0]) * i) / 400, y = g(x);
    if (y >= ys[0] && y <= ys[1]) points.push(D(x, y));
  }
  const out: Element[] = [
    { kind: 'segment', from: D(xs[0] - 0.3, 0), to: xEnd }, ...arrow2016(xEnd, pt(1, 0)),
    { kind: 'segment', from: D(0, ys[0] - 0.3), to: yEnd }, ...arrow2016(yEnd, pt(0, 1)),
    { kind: 'label', text: 'x', anchor: add(xEnd, pt(0, -6)), away: add(xEnd, pt(0, 10)), small: true },
    { kind: 'label', text: 'y', anchor: add(yEnd, pt(-6, 0)), away: add(yEnd, pt(10, 0)), small: true },
    // O in the paper's bottom-left corner, or the first corner left clear.
    seated('O', pt(0, 0), oDirs, 7),
    { kind: 'path', points },
  ];
  for (const m of marks) {
    const P = D(m.at.x, m.at.y);
    const onX = Math.abs(m.at.y) < 1e-9;
    out.push(onX
      ? { kind: 'segment', from: pt(P.x, -TICK2016), to: pt(P.x, TICK2016), decoration: true }
      : { kind: 'segment', from: pt(-TICK2016, P.y), to: pt(TICK2016, P.y), decoration: true });
    out.push(seated(m.text, P, m.dirs));
  }
  return { elements: out, target };
}

/**
 * Where a graph meets an axis, its number goes in a corner the graph leaves
 * empty: a rising graph fills bottom-left and top-right of the crossing, a
 * falling one top-left and bottom-right. The paper's numbers sit below the
 * x-axis and left of the y-axis, so those come first.
 */
function cornersFor(rising: boolean, onX: boolean): [number, number][] {
  const clear: [number, number][] = rising ? [[1, -1], [-1, 1]] : [[-1, -1], [1, 1]];
  const preferred = clear.filter(([dx, dy]) => (onX ? dy < 0 : dx < 0));
  return [...preferred, ...clear.filter(c => !preferred.includes(c)), onX ? [0, -1] : [-1, 0]];
}

/** The question's line, and the two V sketches. */
function figures2016({ line, d, k }: Q12of2016) {
  const { s, r } = line;
  const f = (x: number) => s * (x - r);
  // O keeps the paper's bottom-left unless the line runs through that corner
  // (-x - c, through -c on both axes); then top-right, opposite it.
  const oDirs: [number, number][] = r < 0 && s < 0 ? [[1, 1], [-1, 1], [1, -1]] : [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  const lineScene = graph2016(f, [-2, 2], [-2, 2], [
    { at: pt(r, 0), text: label(r), dirs: cornersFor(s > 0, true) },
    { at: pt(0, -s * r), text: label(-s * r), dirs: cornersFor(s > 0, false) },
  ], oDirs, 300);
  /** A V with its point at xv, meeting the y-axis at yi. */
  const vee = (g: (x: number) => number, xv: number, yi: number) => {
    const xs: [number, number] = [Math.min(xv, 0) - 1.2, Math.max(xv, 0) + 1.2];
    const ys: [number, number] = [-0.6, Math.max(yi, 1) + 0.9];
    // The arm through the y-axis rises away from the V's point.
    return graph2016(x => Math.abs(g(x)), xs, ys, [
      { at: pt(xv, 0), text: label(xv), dirs: [[0, -1], [1, -1], [-1, -1]] },
      { at: pt(0, yi), text: label(yi), dirs: cornersFor(xv < 0, false) },
    ]);
  };
  // (a) f(x) + d has its root where f(x) = -d.
  const xa = r - d / s, ya = Math.abs(-s * r + d);
  const a = vee(x => f(x) + d, xa, ya);
  const b = vee(x => k * f(x), r, k);
  return { lineScene, a, b, xa, ya };
}

const q2016q12: CardRoutine<Q12of2016> = {
  draw: () => pick(SETS2016),

  build: (n): Built => {
    const { line, d, k } = n;
    const { lineScene, a, b, xa, ya } = figures2016(n);
    const shifted = `|f(x) ${d < 0 ? '-' : '+'} ${inC(Math.abs(d))}|`;
    const stretched = `|${k}f(x)|`;
    const move = d < 0 ? `down by $${inC(-d)}$` : `up by $${inC(d)}$`;
    const sketchA = `a V-shaped graph with its vertex on the $x$-axis at $${inC(xa)}$, passing through $${inC(ya)}$ on the positive $y$-axis`;
    const sketchB = `a symmetrical V-shaped graph with its vertex on the $x$-axis at $${inC(line.r)}$, passing through $${inC(k)}$ on the positive $y$-axis`;
    const cap = (t: string) => t[0].toUpperCase() + t.slice(1);
    return {
      questionLines: [
        'Below is a diagram showing the graph of a linear function, $y = f(x).$',
        renderScene(lineScene),
        'On separate diagrams show:',
        `<b>(a)</b> $y = ${shifted}$`,
        `<b>(b)</b> $y = ${stretched}$`,
      ],
      figure: { scene: lineScene, claims: [] },
      markschemeFigures: [
        { part: '(a)', figure: { scene: a, claims: [] }, svg: renderScene(a) },
        { part: '(b)', figure: { scene: b, claims: [] }, svg: renderScene(b) },
      ],
      solutionSteps: [
        `<strong>(a)</strong> The line moved ${move}, and the part below the $x$-axis reflected in it: ${sketchA}.`,
        `<strong>(b)</strong> Every $y$-value multiplied by ${k}, and the part below the $x$-axis reflected: ${sketchB}.`,
      ],
      stepMarks: [2, 2],
      finalAnswer: [`(a) ${cap(sketchA)}.`, `(b) ${cap(sketchB)}.`].join('<br>'),
      ladder: {
        moves: [
          `Start from $f(x)$ in the diagram. What does ${d < 0 ? 'subtracting' : 'adding'} $${inC(Math.abs(d))}$ do to it, and what does the modulus then do?`,
          `(a) Move the line ${move}, then reflect the part below the $x$-axis in the axis. Mark where it meets both axes.`,
          `(b) Multiply every $y$-value by ${k}, then reflect the part below the $x$-axis. Mark where it meets both axes.`,
        ],
        marks: [0, 2, 2],
        shows: [null, sketchA, sketchB],
        watch: { at: 1, text: 'Reflect at the same angle: the second arm must slope as much as the first.' },
      },
    };
  },
};

export const ROUTINES = {
  '2016 Q12': q2016q12,
};
