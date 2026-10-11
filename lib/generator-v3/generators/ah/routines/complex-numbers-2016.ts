/**
 * Advanced Higher, Complex Numbers: how each 2016 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/complex-numbers.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { pick } from '../../core/draw';
import { piTimes } from '../../core/maths/format';
import { q } from '../../core/maths/rational';
import { type Element, type Pt, type Scene, add, pt, scale, unit } from '../../../diagrams/scene';
import { renderScene } from '../../../diagrams/render';

// ── 2016 Q8 ────────────────────────────────────────────────────────────────
// z = ±√3 ± i or ±1 ± √3i, |z| = 2, arg z = kπ/6: (a) z on an Argand
// diagram, in the marking instructions only; (b) w = az in polar form,
// 2a(cos kπ/6 + i sin kπ/6); (c) wⁿ = 2ⁿaⁿ(cos nkπ/6 + i sin nkπ/6), with
// nk a multiple of 2 that is not of 6, so both parts are nonzero and wⁿ is
// ±2ⁿ⁻¹aⁿ(x + i√3), as the paper's 128a⁸(-1 + i√3).

interface Z2016 { tex: string; re: number; im: number; k: number; reText: string; imText: string }

const R3 = Math.sqrt(3);

/** The eight numbers of modulus 2 whose argument is a multiple of π/6 and not of π/2. */
const ZS2016: readonly Z2016[] = [
  { tex: '\\sqrt{3} + i', re: R3, im: 1, k: 1, reText: '√3', imText: '1' },
  { tex: '\\sqrt{3} - i', re: R3, im: -1, k: -1, reText: '√3', imText: '−1' },
  { tex: '-\\sqrt{3} + i', re: -R3, im: 1, k: 5, reText: '−√3', imText: '1' },
  { tex: '-\\sqrt{3} - i', re: -R3, im: -1, k: -5, reText: '−√3', imText: '−1' },
  { tex: '1 + \\sqrt{3}i', re: 1, im: R3, k: 2, reText: '1', imText: '√3' },
  { tex: '1 - \\sqrt{3}i', re: 1, im: -R3, k: -2, reText: '1', imText: '−√3' },
  { tex: '-1 + \\sqrt{3}i', re: -1, im: R3, k: 4, reText: '−1', imText: '√3' },
  { tex: '-1 - \\sqrt{3}i', re: -1, im: -R3, k: -4, reText: '−1', imText: '−√3' },
];

/**
 * Each z with every power from 4 to 10 (the paper's 8) that turns its
 * argument to an odd multiple of π/3, so wⁿ has both parts and is in the form
 * ka^n(x + i√y): for arg ±π/6 or ±5π/6 the powers 4, 8 and 10; for ±π/3 or
 * ±2π/3 those not a multiple of 3.
 */
const SETS2016: readonly { z: Z2016; n: number }[] = ZS2016.flatMap(z =>
  [4, 5, 6, 7, 8, 9, 10].filter(n => [2, 4, 8, 10].includes((((n * z.k) % 12) + 12) % 12)).map(n => ({ z, n })));

const QUADRANT = (re: number, im: number) => (re > 0 ? (im > 0 ? '1st' : '4th') : im > 0 ? '2nd' : '3rd');

/** z's point as LaTeX: `(\sqrt{3}, -1)`. */
const point2016 = (z: Z2016) => {
  const tex = (s: string) => s.replace('√3', '\\sqrt{3}').replace('−', '-');
  return `(${tex(z.reText)}, ${tex(z.imText)})`;
};

const UNIT2016 = 40, AXIS2016 = 2.6, ARROW2016 = 5, TICK2016 = 2;

function arrow2016(at: Pt, along: Pt): Element[] {
  const u = unit(along);
  return [0.4, -0.4].map((turn): Element => {
    const [c, s] = [Math.cos(turn), Math.sin(turn)];
    const dir = pt(u.x * c - u.y * s, u.x * s + u.y * c);
    return { kind: 'segment', from: at, to: add(at, scale(dir, -ARROW2016)), decoration: true };
  });
}

/**
 * z on an Argand diagram, as the marking instructions want it: the point in
 * its quadrant, dashed to each axis, its real and imaginary parts marked
 * there. Each part's number sits on the far side of its axis from the dashed
 * line, so neither crosses it.
 */
function argand2016(z: Z2016): Scene {
  const end = AXIS2016 * UNIT2016;
  const P = pt(z.re * UNIT2016, z.im * UNIT2016);
  const sx = Math.sign(z.re), sy = Math.sign(z.im);
  return {
    elements: [
      { kind: 'segment', from: pt(-end, 0), to: pt(end, 0) },
      ...arrow2016(pt(end, 0), pt(1, 0)),
      { kind: 'segment', from: pt(0, -end), to: pt(0, end) },
      ...arrow2016(pt(0, end), pt(0, 1)),
      { kind: 'label', text: 'Re', anchor: pt(end, -6), away: pt(end, 10), small: true },
      { kind: 'label', text: 'Im', anchor: pt(6, end), away: pt(-10, end), small: true },
      // O in the corner the point is not in.
      { kind: 'label', text: 'O', anchor: pt(-7 * sx, -7 * sy), away: pt(7 * sx, 7 * sy), small: true },
      { kind: 'segment', from: P, to: pt(P.x, 0), dashed: true },
      { kind: 'segment', from: P, to: pt(0, P.y), dashed: true },
      { kind: 'segment', from: pt(P.x, -TICK2016), to: pt(P.x, TICK2016), decoration: true },
      { kind: 'segment', from: pt(-TICK2016, P.y), to: pt(TICK2016, P.y), decoration: true },
      { kind: 'label', text: z.reText, anchor: pt(P.x, -8 * sy), away: pt(P.x, 10 * sy), small: true },
      { kind: 'label', text: z.imText, anchor: pt(-8 * sx, P.y), away: pt(10 * sx, P.y), small: true },
      { kind: 'dot', at: P, small: true },
    ],
    target: 240,
  };
}

/** An angle in a cosine: `\left(-\frac{\pi}{6}\right)` when negative, as the scheme brackets it. */
const angle = (tex: string) => (tex.startsWith('-') ? `\\left(${tex}\\right)` : tex);

const q2016q8: CardRoutine<{ z: Z2016; n: number }> = {
  draw: () => pick(SETS2016),

  build: ({ z, n }): Built => {
    const theta = piTimes(q(z.k, 6));
    const polar = `2a\\left(\\cos ${angle(theta)} + i\\sin ${angle(theta)}\\right)`;
    const nk = n * z.k;
    const big = `${nk < 0 ? '-' : ''}\\frac{${Math.abs(nk)}\\pi}{6}`;
    // cos and sin of nkπ/6, an odd multiple of π/3: ±1/2 and ±√3/2.
    const c = Math.sign(Math.cos((nk * Math.PI) / 6)), s = Math.sign(Math.sin((nk * Math.PI) / 6));
    const power = 2 ** n, half = 2 ** (n - 1);
    // ka^n(x + i√3) with the √3 always positive: the sign goes into k.
    const k = s * half, x = s * c;
    const form = `${k}a^{${n}}(${x} + i\\sqrt{3})`;
    const scene = argand2016(z);
    const plotted = `Point plotted at $${point2016(z)}$ in the ${QUADRANT(z.re, z.im)} quadrant of the Argand diagram`;
    const modArg = `|w| = 2a$ or $\\arg(w) = ${theta}`;
    return {
      questionLines: [
        `Let $z = ${z.tex}.$`,
        '<b>(a)</b> Plot $z$ on an Argand diagram.',
        '<b>(b)</b> Let $w = az$ where $a > 0$, $a \\in \\mathbb{R}.$',
        'Express $w$ in polar form.',
        `<b>(c)</b> Express $w^{${n}}$ in the form $ka^{n}(x + i\\sqrt{y})$ where $k, x, y \\in \\mathbb{Z}.$`,
      ],
      markschemeFigures: [{ part: '(a)', figure: { scene, claims: [] }, svg: renderScene(scene) }],
      solutionSteps: [
        `<strong>(a)</strong> ${plotted}, with its real and imaginary parts marked on the axes.`,
        `<strong>(b)</strong> $${modArg}$`,
        `<strong>(b)</strong> $w = ${polar}$`,
        `<strong>(c)</strong> By de Moivre's theorem, the modulus is $(2a)^{${n}} = ${power}a^{${n}}$`,
        `<strong>(c)</strong> $w^{${n}} = ${power}a^{${n}}\\left(\\cos\\left(${big}\\right) + i\\sin\\left(${big}\\right)\\right)$`,
        `<strong>(c)</strong> $w^{${n}} = ${form}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: [`(a) ${plotted}.`, `(b) $${polar}$`, `(c) $${form}$`].join('<br>'),
      ladder: {
        moves: [
          `Where does $${z.tex}$ sit on an Argand diagram? Which quadrant?`,
          '(a) Plot $z$, marking its real and imaginary parts on the axes.',
          '(b) Find the modulus or the argument of $w$. How does multiplying by $a$ change each?',
          '(b) Write $w$ in polar form.',
          `(c) De Moivre: raise the modulus to the power ${n}.`,
          `(c) Multiply the argument by ${n}.`,
          '(c) Evaluate the cosine and sine, and write the answer in the given form.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `a point in the ${QUADRANT(z.re, z.im)} quadrant at $${point2016(z)}$, with its parts marked on the axes`,
          `$${modArg}$`,
          `$w = ${polar}$`,
          `$${power}a^{${n}}$`,
          `$\\ldots\\left(\\cos\\left(${big}\\right) + i\\sin\\left(${big}\\right)\\right)$`,
          null,
        ],
        watch: { at: 2, text: 'Check which quadrant $z$ is in before you find the argument.' },
      },
    };
  },
};

export const ROUTINES = {
  '2016 Q8': q2016q8,
};
