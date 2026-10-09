/**
 * Advanced Higher, Complex Numbers: how each 2017 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/complex-numbers.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../draw';
import { poly, sum } from '../maths/format';
import { conjugatePair, mulPoly } from '../maths/polynomial';
import { type Element, type Pt, type Scene, add, pt, scale, unit } from '../../../diagrams/scene';
import { renderScene } from '../../../diagrams/render';

// ── 2017 Q17 ───────────────────────────────────────────────────────────────
// z⁴ + c3 z³ + c2 z² + c1 z + q = 0 with root p + ri: (a) its conjugate;
// (b) the quadratic factor z² - 2pz + s, the division leaving remainder
// q - st, so q = st, and the other roots m ± √w i; (c) the four roots on an
// Argand diagram, in the marking instructions only (the owner on 2021 P1
// Q7: "just the markscheme").

interface Q17of2017 { p: number; r: number; m: number; w: number }

/** `2 + i`, `-1 - 3i`. */
const complex2017 = (re: number, im: number) => sum([{ coef: re, body: '' }, { coef: im, body: 'i' }]);

/** The quartic's coefficients from z⁴ down, its constant the q the card asks for. */
const quartic2017 = ({ p, r, m, w }: Q17of2017) => mulPoly(conjugatePair(p, r), [1, -2 * m, m * m + w]);

const UNIT2017 = 30, AXIS2017 = 4.4, ARROW2017 = 5, TICK2017 = 2;
function arrow2017(at: Pt, along: Pt): Element[] {
  const u = unit(along);
  return [0.4, -0.4].map((turn): Element => {
    const [c, s] = [Math.cos(turn), Math.sin(turn)];
    const dir = pt(u.x * c - u.y * s, u.x * s + u.y * c);
    return { kind: 'segment', from: at, to: add(at, scale(dir, -ARROW2017)), decoration: true };
  });
}

/**
 * The four roots on an Argand diagram, as the marking instructions want them
 * ("in correct relative positions"): axes numbered from -3 to 3, a dot at
 * each root, no labels to crowd two roots that sit close.
 */
function argand2017({ p, r, m, w }: Q17of2017): Scene {
  const D = (x: number, y: number) => pt(x * UNIT2017, y * UNIT2017);
  const end = AXIS2017 * UNIT2017;
  const out: Element[] = [
    { kind: 'segment', from: pt(-end, 0), to: pt(end, 0) },
    ...arrow2017(pt(end, 0), pt(1, 0)),
    { kind: 'segment', from: pt(0, -end), to: pt(0, end) },
    ...arrow2017(pt(0, end), pt(0, 1)),
    { kind: 'label', text: 'Re', anchor: pt(end, -6), away: pt(end, 10), small: true },
    { kind: 'label', text: 'Im', anchor: pt(6, end), away: pt(-10, end), small: true },
    { kind: 'label', text: 'O', anchor: pt(-7, -7), away: pt(7, 7), small: true },
  ];
  const root = Math.sqrt(w);
  const dots = [[p, r], [p, -r], [m, root], [m, -root]].map(([x, y]) => D(x, y));
  // A root with real part -1 sits against the imaginary axis's numbers, which
  // are on its left: then they all go on the right, and one a root with real
  // part 1 would sit beside is left off, so every dot stands apart (the owner,
  // full read 2026-10-05). Otherwise the numbers keep their place.
  const onRight = p === -1 || m === -1;
  const roots = [[p, r], [p, -r], [m, root], [m, -root]];
  const takenRight = (k: number) => roots.some(([x, y]) => x === 1 && Math.abs(y - k) < 0.6);
  for (let k = -3; k <= 3; k++) {
    if (k === 0) continue;
    const x = D(k, 0), y = D(0, k);
    const text = `${k}`.replace('-', '−');
    out.push({ kind: 'segment', from: pt(x.x, -TICK2017), to: pt(x.x, TICK2017), decoration: true });
    // The real axis's numbers stay: a root p ± i is 12 units under its number
    // in the drawing, clear, and its conjugate would take the other side anyway.
    out.push({ kind: 'label', text, role: 'tick-x', anchor: pt(x.x, -3 * TICK2017), away: pt(x.x, 10), small: true });
    out.push({ kind: 'segment', from: pt(-TICK2017, y.y), to: pt(TICK2017, y.y), decoration: true });
    // The imaginary axis's -1 would sit beside the real axis's -1 and read as
    // one of its numbers, as 2021 P1 Q7 found: its tick stays, the number goes.
    if (k === -1) continue;
    if (!onRight) {
      out.push({ kind: 'label', text, role: 'tick-y', anchor: pt(-3 * TICK2017, y.y), away: pt(10, y.y), small: true });
    } else if (!takenRight(k)) {
      out.push({ kind: 'label', text, role: 'tick-y', anchor: pt(3 * TICK2017, y.y), away: pt(-10, y.y), small: true });
    }
  }
  for (const at of dots) out.push({ kind: 'dot', at, small: true });
  return { elements: out, target: 260 };
}

const q2017q17: CardRoutine<Q17of2017> = {
  draw: () => until(
    () => ({ p: nonZero(-3, 3), r: int(1, 3), m: nonZero(-3, 3), w: pick([2, 3, 5, 6, 7]) }),
    // The two pairs apart on the diagram, as the paper's 2 ± i and 1 ± √2i;
    // every coefficient of the quartic but q nonzero, as -6, 16 and -22.
    (n) => n.p !== n.m && quartic2017(n).slice(1, 4).every(c => c !== 0 && Math.abs(c) <= 60),
  ),

  build: (n): Built => {
    const { p, r, m, w } = n;
    const coefs = quartic2017(n);
    const s = p * p + r * r, t = m * m + w;
    const Q = coefs[4];
    const equation = `${poly([...coefs.slice(0, 4), 0], 'z')} + q`;
    const root = complex2017(p, r), conj = complex2017(p, -r);
    const first = poly(conjugatePair(p, r), 'z');
    const second = poly([1, -2 * m, t], 'z');
    const imag = `\\sqrt{${w}}i`;
    const pair = `${m} \\pm ${imag}`;
    const formula = `z = \\frac{${2 * m} \\pm \\sqrt{${4 * m * m} - ${4 * t}}}{2} = \\frac{${2 * m} \\pm \\sqrt{${-4 * w}}}{2} = ${pair}`;
    const remaining = `$${m} + ${imag}$ and $${m} - ${imag}$`;
    const setUp = `${first} \\,\\big)\\, ${equation}`;
    const division = `quotient $${second}$, remainder $q - ${Q}$`;
    const scene = argand2017(n);
    const plotted = `An Argand diagram with the four roots $${root}$, $${conj}$, $${m} + ${imag}$ and $${m} - ${imag}$ plotted in their correct relative positions`;
    return {
      questionLines: [
        `The complex number $z = ${root}$ is a root of the polynomial equation $${equation} = 0$, where $q \\in \\mathbb{Z}.$`,
        '<b>(a)</b> State a second root of the equation.',
        '<b>(b)</b> Find the value of $q$ and the remaining roots.',
        `<b>(c)</b> Show the solutions to $${equation} = 0$ on an Argand diagram.`,
      ],
      markschemeFigures: [{ part: '(c)', figure: { scene, claims: [] }, svg: renderScene(scene) }],
      solutionSteps: [
        `<strong>(a)</strong> The coefficients are real, so the conjugate $${conj}$ is also a root`,
        `<strong>(b)</strong> Two linear factors: $z - (${root})$ and $z - (${conj})$`,
        `<strong>(b)</strong> Their product: $${first}$`,
        `<strong>(b)</strong> Dividing: $${setUp}$`,
        `<strong>(b)</strong> The division gives ${division}`,
        `<strong>(b)</strong> The remainder is zero, so $q = ${Q}$`,
        `<strong>(b)</strong> $${second} = 0$: $${formula}$`,
        `<strong>(c)</strong> ${plotted}`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: [
        `(a) $${conj}$`,
        `(b) $q = ${Q}$; the remaining roots are ${remaining}`,
        `(c) ${plotted}`,
      ].join('<br>'),
      ladder: {
        moves: [
          'The coefficients are real. What does that tell you about complex roots?',
          `(a) State the conjugate of $${root}$.`,
          '(b) Write the two linear factors.',
          '(b) Multiply them into one quadratic.',
          '(b) Set up the division of the quartic by that quadratic.',
          '(b) Complete the division, keeping $q$ in the remainder.',
          '(b) The remainder must be zero. Find $q$.',
          '(b) Solve the second quadratic factor.',
          '(c) Plot all four roots on an Argand diagram.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          null,
          `$z - (${root}),\\ z - (${conj})$`,
          `$${first}$`,
          `$${setUp}$`,
          division,
          null,
          `$${pair}$`,
          null,
        ],
        watch: { at: 8, text: 'Plot all four roots, in the right positions relative to each other.' },
      },
    };
  },
};

export const ROUTINES = {
  '2017 Q17': q2017q17,
};
