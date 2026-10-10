/**
 * Advanced Higher, Complex Numbers: how each 2018 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/complex-numbers.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { nonZero, pick } from '../../core/draw';
import { num, sum } from '../../core/maths/format';
import { type Q, q, toNumber } from '../../core/maths/rational';
import { type Element, type Pt, type Scene, add, pt, scale, unit } from '../../../diagrams/scene';
import { renderScene } from '../../../diagrams/render';

// ── 2018 Q4 ────────────────────────────────────────────────────────────────
// z1 = a + bi, z2 = p - ci: z1 times the conjugate of z2 is
// (ap - bc) + (bp + ac)i, real when p = -ac/b.

interface Q4of2018 { a: number; b: number; c: number }

/** b divides ac, so p is whole, as the paper's -4; p at most 12 in size. */
const Q4_SETS2018: readonly Q4of2018[] = (() => {
  const out: Q4of2018[] = [];
  for (let a = -6; a <= 6; a++) {
    if (a === 0) continue;
    for (let b = 2; b <= 6; b++) {
      for (let c = 1; c <= 9; c++) {
        if ((a * c) % b === 0 && Math.abs((a * c) / b) <= 12) out.push({ a, b, c });
      }
    }
  }
  return out;
})();

const q2018q4: CardRoutine<Q4of2018> = {
  draw: () => pick(Q4_SETS2018),

  build: ({ a, b, c }): Built => {
    const z1 = sum([{ coef: a, body: '' }, { coef: b, body: 'i' }]);
    const z2 = sum([{ coef: 1, body: 'p' }, { coef: -c, body: 'i' }]);
    const conj = sum([{ coef: 1, body: 'p' }, { coef: c, body: 'i' }]);
    const expanded = sum([{ coef: a, body: 'p' }, { coef: a * c, body: 'i' }, { coef: b, body: 'pi' }, { coef: b * c, body: 'i^{2}' }]);
    const re = sum([{ coef: a, body: 'p' }, { coef: -b * c, body: '' }]);
    const im = sum([{ coef: b, body: 'p' }, { coef: a * c, body: '' }]);
    const product = `(${re}) + (${im})i`;
    const p = -(a * c) / b;
    return {
      questionLines: [
        `Given that $z_1 = ${z1}$ and $z_2 = ${z2}$, $p \\in \\mathbb{R}$, find:`,
        '<b>(a)</b> $z_1 \\overline{z}_2$',
        '<b>(b)</b> the value of $p$ such that $z_1 \\overline{z}_2$ is a real number.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $\\overline{z}_2 = ${conj}$`,
        `<strong>(a)</strong> $z_1 \\overline{z}_2 = (${z1})(${conj}) = ${expanded} = ${product}$`,
        `<strong>(b)</strong> Real when the imaginary part is zero: $${im} = 0$, so $p = ${p}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: [`(a) $${product}$`, `(b) $p = ${p}$`].join('<br>'),
      ladder: {
        moves: [
          `What is the complex conjugate of $${z2}$?`,
          '(a) Write down $\\overline{z}_2$.',
          '(a) Multiply $z_1$ by it, using $i^2 = -1$, and group the real and imaginary parts.',
          '(b) A real number has no imaginary part. Set it to zero and solve.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$\\overline{z}_2 = ${conj}$`, null, null],
      },
    };
  },
};

// ── 2018 Q10 ───────────────────────────────────────────────────────────────
// |z| = |z - (p + qi)|: the perpendicular bisector of O and (p, q),
// 2px + 2qy = p² + q², crossing the axes at (p² + q²)/(2p) and (p² + q²)/(2q).
// Its answer is a sketch, in the marking instructions only, as 2021 P1 Q7's.

interface Q10of2018 { p: number; q: number }

const ARROW2018 = 4;

function head2018(at: Pt, along: Pt): Element[] {
  return [0.4, -0.4].map((turn): Element => {
    const [c, s] = [Math.cos(turn), Math.sin(turn)];
    const dir = pt(along.x * c - along.y * s, along.x * s + along.y * c);
    return { kind: 'segment', from: at, to: add(at, scale(dir, -ARROW2018)), decoration: true };
  });
}

/** `(2, 0)`, `(0, −5/4)`: a point as a sketch labels it, the minus a true minus sign. */
function pointText(x: Q, y: Q): string {
  const t = (v: Q) => num(v).replace(/\\frac\{(\d+)\}\{(\d+)\}/, '$1/$2').replace('-', '−');
  return `(${t(x)}, ${t(y)})`;
}

/**
 * A sketch, not a plot: unnumbered axes, the crossings on the sides their
 * signs give and at distances from O in proportion to their values, the
 * farther one 80 units out, so the line's steepness matches its labels (the
 * owner, full read 2026-10-05: a gradient of -4 had been drawn about -1).
 */
function locusSketch(X: Q, Y: Q): Scene {
  const sx = X.n > 0n ? 1 : -1, sy = Y.n > 0n ? 1 : -1;
  const ax = Math.abs(toNumber(X)), ay = Math.abs(toNumber(Y)), far = Math.max(ax, ay);
  const lx = (80 * ax) / far, ly = (80 * ay) / far;
  const ix = pt(lx * sx, 0), iy = pt(0, ly * sy);
  const along = pt(ix.x - iy.x, ix.y - iy.y);
  const from = add(ix, scale(along, 0.45)), to = add(iy, scale(along, -0.45));
  // Each axis runs 40 past its crossing, and 40 the other way from O.
  const xEnds = [sx > 0 ? -40 : -(lx + 40), sx > 0 ? lx + 40 : 40], yEnds = [sy > 0 ? -38 : -(ly + 38), sy > 0 ? ly + 38 : 38];
  const off = (at: Pt, away: Pt, by: number): Pt => add(at, scale(unit(pt(at.x - away.x, at.y - away.y)), by));
  // Each crossing's label goes outward along its axis, on the side the line
  // leaves clear there; O takes the corner the line is not in.
  const awayOf = (at: Pt) => pt(at.x - 10 * sx, at.y - 10 * sy);
  const oAway = pt(10 * sx, 10 * sy);
  return {
    elements: [
      { kind: 'segment', from: pt(xEnds[0], 0), to: pt(xEnds[1], 0) },
      ...head2018(pt(xEnds[1], 0), pt(1, 0)),
      { kind: 'segment', from: pt(0, yEnds[0]), to: pt(0, yEnds[1]) },
      ...head2018(pt(0, yEnds[1]), pt(0, 1)),
      { kind: 'label', text: 'Re', anchor: pt(xEnds[1], -4), away: pt(xEnds[1], 10), small: true },
      { kind: 'label', text: 'Im', anchor: pt(4, yEnds[1]), away: pt(-10, yEnds[1]), small: true },
      { kind: 'label', text: 'O', anchor: off(pt(0, 0), oAway, 7), away: oAway, small: true },
      { kind: 'segment', from, to },
      { kind: 'dot', at: ix, small: true },
      { kind: 'dot', at: iy, small: true },
      // Far enough off the crossing that the label stands 5 units clear of the axis it is beside.
      { kind: 'label', text: pointText(X, q(0)), anchor: off(ix, awayOf(ix), 12), away: awayOf(ix), small: true },
      { kind: 'label', text: pointText(q(0), Y), anchor: off(iy, awayOf(iy), 12), away: awayOf(iy), small: true },
    ],
    target: 260,
  };
}

const q2018q10: CardRoutine<Q10of2018> = {
  draw: () => ({ p: nonZero(-4, 4), q: nonZero(-4, 4) }),

  build: ({ p, q: qq }): Built => {
    const r2 = p * p + qq * qq;
    const X = q(r2, 2 * p), Y = q(r2, 2 * qq);
    const shifted = sum([{ coef: 1, body: 'z' }, { coef: -p, body: '' }, { coef: -qq, body: 'i' }]);
    const reBracket = sum([{ coef: 1, body: 'x' }, { coef: -p, body: '' }]);
    const imBracket = sum([{ coef: 1, body: 'y' }, { coef: -qq, body: '' }]);
    const moduli = `|x + iy| = |(${reBracket}) + (${imBracket})i|`;
    const squared = `x^{2} + y^{2} = (${reBracket})^{2} + (${imBracket})^{2}`;
    const linear = `${sum([{ coef: -2 * p, body: 'x' }, { coef: -2 * qq, body: 'y' }, { coef: r2, body: '' }])} = 0`;
    const line = `y = ${sum([{ coef: q(-p, qq), body: 'x' }, { coef: Y, body: '' }])}`;
    const crossings = `$(${num(X)}, 0)$ and $(0, ${num(Y)})$`;
    const sketchText = `A straight line through ${crossings}: the perpendicular bisector of the line segment joining $(0, 0)$ and $(${p}, ${qq})$`;
    const scene = locusSketch(X, Y);
    return {
      questionLines: [`Given $z = x + iy$ sketch the locus in the complex plane given by $|z| = |${shifted}|.$`],
      solutionSteps: [
        `$${moduli}$`,
        `$${squared}$, so $${linear}$, which gives $${line}$`,
        sketchText,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `The line $${line}$, through ${crossings}: the perpendicular bisector of the line segment joining $(0, 0)$ and $(${p}, ${qq}).$`,
      markschemeFigures: [{ part: '', figure: { scene, claims: [] }, svg: renderScene(scene) }],
      ladder: {
        moves: [
          '$|z - w|$ is the distance from $z$ to $w$. So which points are the same distance from two fixed points?',
          'Substitute $z = x + iy$ and group the real and imaginary parts inside each modulus.',
          'Square both moduli, set them equal, and simplify to a straight line.',
          'Sketch the line, marking where it crosses an axis.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$${moduli}$`, `$${line}$`, null],
      },
    };
  },
};

export const ROUTINES = {
  '2018 Q4': q2018q4,
  '2018 Q10': q2018q10,
};
