/**
 * Advanced Higher, Functions and Graphs: how each 2017 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/functions-and-graphs.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, pick, until } from '../draw';
import { num, sum } from '../maths/format';
import { type Q, q, toNumber } from '../maths/rational';
import { type Element, type Pt, type Scene, add, pt, scale, unit } from '../../../diagrams/scene';
import { renderScene } from '../../../diagrams/render';

// ── 2017 Q12 ───────────────────────────────────────────────────────────────
// An odd function through (-p, -h) with the asymptote y = mx - c on the left:
// (a) the half turn gives (p, h) and y = mx + c; (b) |f| through (±p, h) with
// asymptotes y = mx + c and y = -mx + c meeting at (0, c); (c) m < f'(x) ≤ g,
// f'(0) = g given. The curve drawn is mx + c tanh(kx), k from the point, and
// g is its gradient at O rounded, as the paper's 2 is (2.15 at its numbers).

interface Q12of2017 { m: Q; c: number; p: number; h: number }

/** The drawn curve's k, from f(-p) = -h: tanh(kp) = (h - mp)/c. */
const k2017 = ({ m, c, p, h }: Q12of2017) => Math.atanh((h - toNumber(m) * p) / c) / p;

/** f'(0) as the card states it: the drawn curve's m + ck, rounded. */
const g2017 = (n: Q12of2017) => Math.round(toNumber(n.m) + n.c * k2017(n));

/** `(−1, −2)`, the minus a true minus sign, as the paper's labels. */
const pointText2017 = (x: number, y: number) => `(${x}, ${y})`.replace(/-/g, '−');

const ARROW2017 = 5;

function arrow2017(at: Pt, along: Pt): Element[] {
  const u = unit(along);
  return [0.4, -0.4].map((turn): Element => {
    const [cs, sn] = [Math.cos(turn), Math.sin(turn)];
    const dir = pt(u.x * cs - u.y * sn, u.x * sn + u.y * cs);
    return { kind: 'segment', from: at, to: add(at, scale(dir, -ARROW2017)), decoration: true };
  });
}

/**
 * The window: x to ±L, y to ±(mL + c), drawn at one scale on both axes, as the
 * paper's. The sketch of |f| is drawn closer in (`zoom` 0.8), so its arms
 * stand clear of the axis at the V's point, where its number goes.
 */
function window2017(n: Q12of2017, zoom = 1) {
  const m = toNumber(n.m);
  const L = zoom * Math.min(9, Math.max(3 * n.p, (1.3 * n.c) / m));
  const Y = 1.05 * (m * L + n.c);
  const S = 220 / (2 * L);
  return { L, Y, S, D: (x: number, y: number) => pt(x * S, y * S) };
}

type Panel2017 = 'question' | 'odd' | 'modulus';

/**
 * The paper's diagram and the two finished sketches. 'question': the curve
 * for x ≤ 0, the asymptote y = mx - c dashed across, (-p, -h) and -c marked.
 * 'odd': the whole curve, both asymptotes, both points, ±c. 'modulus': |f|,
 * the asymptotes' halves it runs along, meeting at (0, c), and (±p, h).
 */
function figure2017(n: Q12of2017, panel: Panel2017): Scene {
  const m = toNumber(n.m), { c, p, h } = n;
  const k = k2017(n);
  const f = (x: number) => m * x + c * Math.tanh(k * x);
  const { L, Y, D } = window2017(n, panel === 'modulus' ? 0.8 : 1);
  const yLo = panel === 'modulus' ? -0.25 * Y : -Y;
  const xEnd = D(L + 0.6, 0), yEnd = D(0, Y + 0.6), xStart = D(-L - 0.4, 0), yStart = D(0, yLo - 0.4);
  const out: Element[] = [
    { kind: 'segment', from: xStart, to: xEnd }, ...arrow2017(xEnd, pt(1, 0)),
    { kind: 'segment', from: yStart, to: yEnd }, ...arrow2017(yEnd, pt(0, 1)),
    { kind: 'label', text: 'x', anchor: add(xEnd, pt(0, -4)), away: add(xEnd, pt(0, 10)), small: true },
    { kind: 'label', text: 'y', anchor: add(yEnd, pt(4, 0)), away: add(yEnd, pt(-10, 0)), small: true },
  ];
  // O in the quarter the curve leaves empty: top-left beside an odd curve
  // rising through it, bottom-left under the V of |f|.
  const oAway = panel === 'modulus' ? pt(8, 8) : pt(8, -8);
  // The letter O, as on the rest of the course (the owner, full read 2026-10-05).
  out.push({ kind: 'label', text: 'O', anchor: add(pt(0, 0), scale(unit(pt(-oAway.x, -oAway.y)), 7)), away: oAway, small: true });
  /** A line y = a x + b dashed between x0 and x1, cut to the window. */
  const dashed = (a: number, b: number, x0: number, x1: number): Element => {
    const lo = Math.max(x0, a > 0 ? (yLo - b) / a : (Y - b) / a), hi = Math.min(x1, a > 0 ? (Y - b) / a : (yLo - b) / a);
    return { kind: 'path', points: [D(lo, a * lo + b), D(hi, a * hi + b)], dashed: true };
  };
  const curve = (g: (x: number) => number, x0: number, x1: number): Element => {
    const points: Pt[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = x0 + ((x1 - x0) * i) / 200;
      const y = g(x);
      if (y >= yLo && y <= Y) points.push(D(x, y));
    }
    return { kind: 'path', points };
  };
  /**
   * A label at a point, pushed out along the first of `dirs` that the
   * renderer finds clear of every line (`alternatives`), starting a few units
   * off the point so the lines through it still count against it.
   */
  const seated = (text: string, at: Pt, dirs: readonly [number, number][], off: number): Element => {
    const anchor = add(at, pt(off * dirs[0][0], off * dirs[0][1]));
    const [first, ...rest] = dirs.map(([dx, dy]) => add(anchor, pt(-10 * dx, -10 * dy)));
    return { kind: 'label', text, anchor, away: first, alternatives: rest, small: true };
  };
  /**
   * A marked point with its coordinates, out to the side away from the y-axis
   * (as the paper's (-1, -2) sits left of its dot), where the curve runs
   * steeply away from the point; diagonally if that is crowded.
   */
  const marked = (x: number, y: number): Element[] => {
    const s = Math.sign(x);
    return [{ kind: 'dot', at: D(x, y), small: true }, seated(pointText2017(x, y), D(x, y), [[s, 0], [s, -1], [s, 1]], 8)];
  };
  /** The asymptote's crossing of the y-axis, its number beside the axis on the side the line leaves clear. */
  const crossing = (y: number, dirs: readonly [number, number][]): Element => seated(`${y}`.replace('-', '−'), D(0, y), dirs, 5);
  if (panel === 'question') {
    out.push(dashed(m, -c, -L, L), curve(f, -L, 0), ...marked(-p, -h), crossing(-c, [[1, -1], [1, -2], [-1, -1]]));
  } else if (panel === 'odd') {
    out.push(dashed(m, -c, -L, L), dashed(m, c, -L, L), curve(f, -L, L),
      ...marked(-p, -h), ...marked(p, h), crossing(-c, [[1, -1], [1, -2], [-1, -1]]), crossing(c, [[-1, 1], [-1, 2], [1, 1]]));
  } else {
    // The V's point: just under it, right then left of the axis, where the
    // curve is still close to the axis; then above, between the arms. Never
    // further down, where the marked points are.
    out.push(dashed(m, c, 0, L), dashed(-m, c, -L, 0), curve(x => Math.abs(f(x)), -L, L),
      ...marked(-p, h), ...marked(p, h), crossing(c, [[1, -1], [-1, -1], [0.4, 1], [-0.4, 1]]));
  }
  return { elements: out, target: 400 };
}

/**
 * The slopes the card draws from: shallow, as the paper's 1/2, a third or a
 * half. At 1 the two asymptotes run steep and close, and the left point's
 * label has nowhere clear of them and the curve.
 */
const SLOPES2017: readonly Q[] = [q(1, 3), q(1, 2)];

const q2017q12: CardRoutine<Q12of2017> = {
  draw: () => until(
    () => ({ m: pick(SLOPES2017), c: int(2, 6), p: pick([1, 2]), h: int(1, 12) }),
    // The point between the asymptote and the line through O parallel to it,
    // a third to two thirds of the way, as the paper's half way ((2 - 1/2)/3),
    // so the curve bends as the paper's does; f'(0) at least the chord's
    // gradient h/p, as the paper's 2, and at most 8.
    (n) => {
      const m = toNumber(n.m), part = (n.h - m * n.p) / n.c;
      if (part < 0.3 || part > 0.7) return false;
      const g = g2017(n);
      return g > m && g >= n.h / n.p && g <= 8;
    },
  ),

  build: (n): Built => {
    const { m, c, p, h } = n;
    const g = g2017(n);
    const line = (a: Q, b: number) => `y = ${sum([{ coef: a, body: 'x' }, { coef: b, body: '' }])}`;
    const given = line(m, -c), image = line(m, c), mirror = line(q(-m.n, m.d), c);
    const point = `(${-p}, ${-h})`, turned = `(${p}, ${h})`;
    const question = figure2017(n, 'question'), odd = figure2017(n, 'odd'), modulus = figure2017(n, 'modulus');
    const sketchA = `the curve with half-turn symmetry about the origin, through $${point}$, $O$ and $${turned}$, rising smoothly through $O$, between the dashed asymptotes $${given}$ (through $${-c}$ on the $y$-axis) and $${image}$ (through $${c}$), approaching the first in the third quadrant and the second in the first`;
    const sketchB = `a sketch of $y = |f(x)|$: a V-shaped curve with a cusp at $O$, through $(${-p}, ${h})$ and $${turned}$, rising along the dashed asymptotes $${image}$ and $${mirror}$, which meet at $${c}$ on the $y$-axis`;
    const range = `${num(m)} \\lt f'(x) \\leq ${g}`;
    const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    return {
      questionLines: [
        `In the diagram below part of the graph of $y = f(x)$ has been omitted. The point $${point}$ lies on the graph and the line $${given}$ is an asymptote.`,
        renderScene(question),
        'Given that $f(x)$ is an odd function:',
        '<b>(a)</b> Copy and complete the diagram, including any asymptotes and any points you know to be on the graph.',
        '<b>(b)</b> $g(x) = |f(x)|.$ On a separate diagram, sketch $g(x).$',
        'Include known asymptotes and points.',
        `<b>(c)</b> State the range of values of $f'(x)$ given that $f'(0) = ${g}.$`,
      ],
      figure: { scene: question, claims: [] },
      markschemeFigures: [
        { part: '(a)', figure: { scene: odd, claims: [] }, svg: renderScene(odd) },
        { part: '(b)', figure: { scene: modulus, claims: [] }, svg: renderScene(modulus) },
      ],
      solutionSteps: [
        `<strong>(a)</strong> An odd function has half-turn symmetry about the origin, so $${turned}$ is on the graph`,
        `<strong>(a)</strong> The half turn takes the asymptote to $${image}$, through $${c}$ on the $y$-axis: ${sketchA}`,
        `<strong>(b)</strong> The parts of the graph below the $x$-axis reflected in it: ${sketchB}`,
        `<strong>(b)</strong> The asymptotes $${image}$ and $${mirror}$ meet at $(0, ${c})$ on the $y$-axis`,
        `<strong>(c)</strong> The gradient is $${g}$ at $O$ and falls towards $${num(m)}$, the asymptotes' gradient, far out: $${range}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: [
        `(a) ${sentence(sketchA)}, with the point $${turned}$ and the asymptote $${image}$`,
        `(b) ${sentence(sketchB)}`,
        `(c) $${range}$`,
      ].join('<br>'),
      ladder: {
        moves: [
          'An odd function has half-turn symmetry about the origin. Where does that send the point and the asymptote you are given?',
          '(a) Rotate the curve half a turn about the origin: mark the image of the point, and draw the image of the asymptote.',
          '(b) Reflect the parts below the $x$-axis in the axis, with their asymptotes. Where do the asymptotes meet?',
          '(c) What is the gradient at the origin, and what does the gradient approach far out along the asymptote?',
        ],
        marks: [0, 2, 2, 1],
        shows: [null, sentence(sketchA), sentence(sketchB), null],
        watch: { at: 1, text: 'Draw the curve smoothly through the origin, with no corner there.' },
      },
    };
  },
};

export const ROUTINES = {
  '2017 Q12': q2017q12,
};
