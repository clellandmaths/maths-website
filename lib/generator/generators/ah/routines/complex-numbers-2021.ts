/**
 * Advanced Higher, Complex Numbers: how each 2021 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/complex-numbers.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { pick } from '../draw';
import { piTimes } from '../maths/format';
import { q } from '../maths/rational';
import { type Element, type Pt, type Scene, add, pt, scale, unit } from '../../../diagrams/scene';
import { renderScene } from '../../../diagrams/render';

// ── 2021 P2 Q13 ────────────────────────────────────────────────────────────
// The roots of z⁵ + a⁵ = 0 (the paper's, a = 1) or z⁵ - a⁵ = 0, a = 1, 2 or 3
// (the owner on the 2021 P2 sheet: "Any way to vary with +1 with other
// numbers?", then "a = 1, 2, 3"; and on z⁷, five roots in (d) and three
// cosines in (e) for the same marks, 2026-10-03: "6 only"). The build still
// takes any odd n. (a) -aⁿ (or aⁿ) in polar
// form; (b) z1 a root, by de Moivre; (c) z2, the next root anticlockwise, read
// off the Argand diagram; (d) the rest, with -π < θ ≤ π; (e) the real parts of
// the roots summing to zero give the sum of the cosines of the roots above the
// real axis: 1/2 (or -1/2), the modulus a cancelling.

interface P2Q13of2021 { n: 5; plus: boolean; a: 1 | 2 | 3 }

/** An argument of mπ/n in the paper's polar form, with a modulus a in front unless it is 1. */
function polar(m: number, n: number, a = 1): string {
  const angle = piTimes(q(m, n));
  const inner = m === 0 ? '\\cos 0 + i\\sin 0'
    : m < 0 ? `\\cos\\left(${angle}\\right) + i\\sin\\left(${angle}\\right)` : `\\cos${angle} + i\\sin${angle}`;
  return a === 1 ? inner : `${a}\\left(${inner}\\right)`;
}

/** cos of mπ/n: `\cos\frac{3\pi}{5}`, `\cos\left(-\frac{\pi}{5}\right)`, `\cos\pi`, `\cos 0`. */
function cosOf(m: number, n: number): string {
  if (m === 0) return '\\cos 0';
  const a = piTimes(q(m, n));
  return m < 0 ? `\\cos\\left(${a}\\right)` : `\\cos${a}`;
}

/** The paper's diagram: axes, z1 joined to the origin, z2 dashed. Radius 1 drawn as R. */
const R = 60, AXIS = 85, ARROW = 5;

function arrowhead(at: Pt, along: Pt): Element[] {
  const u = unit(along);
  return [0.4, -0.4].map((turn): Element => {
    const [c, s] = [Math.cos(turn), Math.sin(turn)];
    const dir = pt(u.x * c - u.y * s, u.x * s + u.y * c);
    return { kind: 'segment', from: at, to: add(at, scale(dir, -ARROW)), decoration: true };
  });
}

function argand(first: number, second: number): Scene {
  const o = pt(0, 0);
  const at = (theta: number) => pt(R * Math.cos(theta), R * Math.sin(theta));
  const [z1, z2] = [at(first), at(second)];
  return {
    elements: [
      { kind: 'segment', from: pt(-AXIS, 0), to: pt(AXIS, 0) },
      ...arrowhead(pt(AXIS, 0), pt(1, 0)),
      { kind: 'segment', from: pt(0, -AXIS), to: pt(0, AXIS) },
      ...arrowhead(pt(0, AXIS), pt(0, 1)),
      { kind: 'label', text: 'Re', anchor: pt(AXIS, 0), away: pt(AXIS, 20) },
      { kind: 'label', text: 'Im', anchor: pt(0, AXIS), away: pt(20, AXIS) },
      { kind: 'label', text: '0', anchor: o, away: pt(10, 10) },
      { kind: 'segment', from: o, to: z1 },
      { kind: 'segment', from: o, to: z2, dashed: true },
      { kind: 'dot', at: z1, small: true },
      { kind: 'dot', at: z2, small: true },
      { kind: 'label', text: 'z₁', anchor: z1, away: o },
      { kind: 'label', text: 'z₂', anchor: z2, away: o },
    ],
    target: 300,
  };
}

const q2021p2q13: CardRoutine<P2Q13of2021> = {
  draw: () => ({ n: 5 as const, plus: pick([true, false]), a: pick([1, 2, 3] as const) }),

  build: ({ n, plus, a }): Built => {
    const sign = plus ? '+' : '-';
    const A = a ** n;
    const equation = `z^{${n}} ${sign} ${A} = 0`;
    const w = plus ? `-${A}` : `${A}`;
    // The paper's form when a is 1; with a modulus, r in front.
    const form = a === 1 ? '\\cos\\theta + i\\sin\\theta' : 'r(\\cos\\theta + i\\sin\\theta)';
    const scaled = (inner: string) => (a === 1 ? inner : `${A}\\left(${inner}\\right)`);
    // The roots are at mπ/n with m odd (+1) or even (-1); the real one at m = n or 0.
    const real = plus ? n : 0;
    const above = Array.from({ length: (n - 1) / 2 }, (_, i) => 2 * i + (plus ? 1 : 2));
    const [m1, m2] = above;
    const rest = [...above.slice(2), ...above.map(m => -m), real];
    const all = [m1, m2, ...rest];
    const names = Array.from({ length: n }, (_, i) => `z_${i + 1}`);
    const restNames = names.slice(2);
    const listed = (xs: string[]) => `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;
    const restText = listed(restNames.map(z => `$${z}$`));
    const half = plus ? '\\frac{1}{2}' : '-\\frac{1}{2}';
    const cosines = above.map(m => cosOf(m, n)).join(' + ');
    const realW = scaled(plus ? '\\cos\\pi + i\\sin\\pi' : '\\cos 0 + i\\sin 0');
    const power = scaled(plus ? '\\cos\\pi + i\\sin\\pi' : '\\cos 2\\pi + i\\sin 2\\pi');
    const z1Text = polar(m1, n, a), z2Text = polar(m2, n, a);
    // m = n is π itself: `\cos\pi + i\sin\pi`.
    const restPolar = rest.map(m => polar(m, n, a));
    const theta = piTimes(q(m1, n));
    const deMoivre = `z_1^{${n}} = ${scaled(`\\cos\\left(${n} \\times ${theta}\\right) + i\\sin\\left(${n} \\times ${theta}\\right)`)} = ${power} = ${w}`;
    // The real parts: a times the cosines, so a cancels.
    const cosAll = all.map(m => cosOf(m, n)).join(' + ');
    const realParts = a === 1 ? `${cosAll} = 0` : `${a}\\left(${cosAll}\\right) = 0`;
    const cancelled = a === 1 ? '' : ` Dividing by ${a}: $${cosAll} = 0.$`;
    const twice = above.map(m => `2${cosOf(m, n)}`).join(' + ');
    const doubled = `${twice} ${plus ? '-' : '+'} 1 = 0`;
    const scene = argand((m1 * Math.PI) / n, (m2 * Math.PI) / n);
    const spaced = n === 5 ? 'five' : 'seven';
    return {
      questionLines: [
        `<b>(a)</b> Express $${w}$ in the form $${form}.$`,
        `The complex number $z_1$ is defined by $z_1 = ${z1Text}.$`,
        `<b>(b)</b> Use de Moivre's theorem to show that $z_1$ is a root of the equation $${equation}.$`,
        `The complex number $z_2$ is also a root of the equation $${equation}.$ Roots $z_1$ and $z_2$ have been plotted on an Argand diagram, as shown.`,
        renderScene(scene),
        `<b>(c)</b> Express $z_2$ in the form $${form}.$`,
        // The stop inside the last root, as the paper's "$z_4$ and $z_5.$".
        `The remaining roots of the equation $${equation}$ are ${restText.replace(/\$$/, '.$')}`,
        `<b>(d)</b> Express ${restText} in the form $${form}$, where $-\\pi \\lt \\theta \\le \\pi.$`,
        `<b>(e)</b> Given $${names.join(' + ')} = 0$, show algebraically that`,
        `$${cosines} = ${half}.$`,
      ],
      figure: { scene, claims: [] },
      solutionSteps: [
        `<strong>(a)</strong> $${w} = ${realW}$`,
        `<strong>(b)</strong> $${deMoivre}.$ Therefore, $z_1^{${n}} ${sign} ${A} = ${w} ${sign} ${A} = 0.$`,
        `<strong>(c)</strong> The roots are $\\frac{2\\pi}{${n}}$ apart: $z_2 = ${z2Text}$`,
        `<strong>(d)</strong> $${restPolar[0]}$`,
        `<strong>(d)</strong> ${restPolar.map(r => `$${r}$`).join(', ')}`,
        `<strong>(e)</strong> Equating the real parts to zero: $${realParts}.$${cancelled} Since $\\cos(-\\theta) = \\cos\\theta$ and $${plus ? '\\cos\\pi = -1' : '\\cos 0 = 1'}$: $${doubled}$`,
        `<strong>(e)</strong> $2\\left(${cosines}\\right) = ${plus ? '1' : '-1'}$, so $${cosines} = ${half}.$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1],
      finalAnswer: [
        `(a) $${realW}$`,
        `(b) $${deMoivre}.$ Therefore, $z_1^{${n}} ${sign} ${A} = ${w} ${sign} ${A} = 0.$`,
        `(c) $${z2Text}$`,
        `(d) ${listed(restPolar.map(r => `$${r}$`))}`,
        `(e) Equating the real parts to zero gives $${realParts}$; with $\\cos(-\\theta) = \\cos\\theta$, $2\\left(${cosines}\\right) = ${plus ? '1' : '-1'}$, so $${cosines} = ${half}.$`,
      ].join('<br>'),
      ladder: {
        moves: [
          `Where is $${w}$ on an Argand diagram? What are its modulus and argument?`,
          `(a) Write $${w}$ in the form $${form}$.`,
          `(b) De Moivre: raise $z_1$ to the power ${n}, and show that $z_1^{${n}} ${sign} ${A} = 0$.`,
          `(c) The ${spaced} roots are equally spaced round the circle. How far apart are they?`,
          '(d) Find one more root by stepping round the circle.',
          '(d) Find the others, with arguments between $-\\pi$ and $\\pi$.',
          '(e) The sum is zero, so its real part is zero. Write that out.',
          `(e) Use $\\cos(-\\theta) = \\cos\\theta$ and $${plus ? '\\cos\\pi = -1' : '\\cos 0 = 1'}$ to simplify.`,
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$${w} = ${realW}$`,
          null,
          `$z_2 = ${z2Text}$`,
          restPolar.map(r => `$${r}$`).join(' or '),
          restPolar.map(r => `$${r}$`).join(', '),
          `$${realParts}$, $${twice} = ${plus ? '1' : '-1'}$`,
          null,
        ],
        watch: { at: 5, text: 'Keep every argument between $-\\pi$ and $\\pi$, as the question asks.' },
      },
    };
  },
};

export const ROUTINES = {
  '2021 P2 Q13': q2021p2q13,
};
