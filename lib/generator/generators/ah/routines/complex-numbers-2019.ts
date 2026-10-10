/**
 * Advanced Higher, Complex Numbers: how each 2019 card is made.
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

// ── 2019 Q18 ───────────────────────────────────────────────────────────────
// w on an Argand diagram in terms of a, at an argument of ±π/3 (the paper's
// -π/3: w = a - a√3 i) or ±π/6, modulus 2a; (a) w in Cartesian and polar
// form; then with a given, z1 = k(cos π/m + i sin π/m) a cube root of w, so
// k = (2a)^{1/3} and m = 3π/arg w; (b)(ii) the other two roots, 2π/3 either
// side. 2a a whole cube: a = 4 (the paper, k = 2), 32 (k = 4) or 108 (k = 6;
// the owner on the AH widening sheet, 2026-10-10: "A").

interface Q18of2019 { m: -9 | 9 | -18 | 18; a: 4 | 32 | 108 }

/** `\cos\frac{5\pi}{9} + i\sin\frac{5\pi}{9}`, a negative angle in brackets, as the paper. */
function innerOf(top: number, bottom: number): string {
  const angle = piTimes(q(top, bottom));
  return top < 0
    ? `\\cos\\left(${angle}\\right) + i\\sin\\left(${angle}\\right)`
    : `\\cos${angle} + i\\sin${angle}`;
}

/** The paper's polar form, the modulus in front: `2\left(\cos\frac{5\pi}{9} + …\right)`. */
const polar2019 = (mod: string, top: number, bottom: number) => `${mod}\\left(${innerOf(top, bottom)}\\right)`;

const ARROW2019 = 5;
function head2019(at: Pt, along: Pt): Element[] {
  const u = unit(along);
  return [0.4, -0.4].map((turn): Element => {
    const [c, s] = [Math.cos(turn), Math.sin(turn)];
    const dir = pt(u.x * c - u.y * s, u.x * s + u.y * c);
    return { kind: 'segment', from: at, to: add(at, scale(dir, -ARROW2019)), decoration: true };
  });
}

/** The paper's diagram: w a dot, dashed to both axes, its two parts labelled in a. */
function argand2019(m: number, re: string, im: string): Scene {
  const theta = (3 * Math.PI) / m;
  const R = 70;
  const w = pt(R * Math.cos(theta), R * Math.sin(theta));
  const o = pt(0, 0);
  const sx = Math.sign(w.x), sy = Math.sign(w.y);
  // The axes run past w on its side and a little the other way, as the paper's.
  const xs = [-25, Math.max(w.x, 0) + 35], ys = [Math.min(w.y, 0) - 20, Math.max(w.y, 0) + 30];
  const footRe = pt(w.x, 0), footIm = pt(0, w.y);
  return {
    elements: [
      { kind: 'segment', from: pt(xs[0], 0), to: pt(xs[1], 0) },
      ...head2019(pt(xs[1], 0), pt(1, 0)),
      { kind: 'segment', from: pt(0, ys[0]), to: pt(0, ys[1]) },
      ...head2019(pt(0, ys[1]), pt(0, 1)),
      // Re under the arrow and O below-left of the origin, as the scan has them.
      { kind: 'label', text: 'Re', anchor: pt(xs[1], -4), away: pt(xs[1], 10) },
      { kind: 'label', text: 'Im', anchor: pt(0, ys[1]), away: pt(10, ys[1]) },
      { kind: 'label', text: 'O', anchor: pt(-4, -4), away: pt(10, 10) },
      { kind: 'segment', from: w, to: footRe, dashed: true, decoration: true },
      { kind: 'segment', from: w, to: footIm, dashed: true, decoration: true },
      { kind: 'dot', at: w, small: true },
      { kind: 'label', text: 'w', anchor: w, away: pt(w.x - 10, w.y) },
      // Each part on the far side of its axis from w, as the paper's a above the Re axis.
      { kind: 'label', text: re, anchor: footRe, away: pt(footRe.x, 10 * sy), small: true },
      { kind: 'label', text: im, anchor: footIm, away: pt(10 * sx, footIm.y), small: true },
    ],
    target: 260,
  };
}

const q2019q18: CardRoutine<Q18of2019> = {
  draw: () => ({ m: pick([-9, 9, -18, 18] as const), a: pick([4, 32, 108] as const) }),

  build: ({ m, a }): Built => {
    const third = Math.abs(m) === 9;
    const neg = m < 0;
    // arg w = 3π/m: ±π/3 or ±π/6.
    const argTop = neg ? -1 : 1, argBottom = third ? 3 : 6;
    const sign = neg ? '-' : '+';
    const cartesian = third ? `a ${sign} a\\sqrt{3}i` : `a\\sqrt{3} ${sign} ai`;
    const [reLabel, imLabel] = third ? ['a', `${neg ? '−' : ''}a√3`] : ['a√3', `${neg ? '−' : ''}a`];
    const argText = piTimes(q(argTop, argBottom));
    const tanText = third ? '\\tan^{-1}\\sqrt{3} = \\frac{\\pi}{3}' : '\\tan^{-1}\\frac{1}{\\sqrt{3}} = \\frac{\\pi}{6}';
    const quadrant = neg ? 'fourth' : 'first';
    const modulusWork = third ? '\\sqrt{a^{2} + 3a^{2}} = 2a' : '\\sqrt{3a^{2} + a^{2}} = 2a';
    const wPolar = polar2019('2a', argTop, argBottom);
    const M = 2 * a, k = Math.round(Math.cbrt(M));
    const begun = `z_1 = ${M}^{\\frac{1}{3}}\\left(${innerOf(argTop, argBottom)}\\right)^{\\frac{1}{3}}`;
    // z1's argument: π/m. The others ±2π/3 = ±(2|m|/3)π/|m|, in (-π, π].
    const n = Math.abs(m), step = (2 * n) / 3;
    const z1Top = neg ? -1 : 1;
    const completed = `z_1 = ${M}^{\\frac{1}{3}}\\left(${innerOf(z1Top, n)}\\right)`;
    const roots = [z1Top + step, z1Top - step];
    const rootTexts = roots.map(t => polar2019(String(k), t, n));
    const scene = argand2019(m, reLabel, imLabel);
    return {
      questionLines: [
        'The complex number $w$ has been plotted on an Argand diagram, as shown below.',
        renderScene(scene),
        '<b>(a)</b> Express $w$ in',
        '(i) Cartesian form',
        '(ii) polar form.',
        'The complex number $z_1$ is a root of $z^{3} = w$, where',
        '$z_1 = k\\left(\\cos \\frac{\\pi}{m} + i\\sin \\frac{\\pi}{m}\\right)$',
        'for integers $k$ and $m.$',
        `Given that $a = ${a}$,`,
        '<b>(b)</b> (i) use de Moivre\'s theorem to obtain the values of $k$ and $m$, and',
        '(ii) find the remaining roots.',
      ],
      figure: { scene, claims: [] },
      solutionSteps: [
        `<strong>(a)(i)</strong> $w = ${cartesian}$`,
        `<strong>(a)(ii)</strong> $|w| = ${modulusWork}$`,
        `<strong>(a)(ii)</strong> $${tanText}$, and $w$ is in the ${quadrant} quadrant, so $\\arg w = ${argText}$`,
        `<strong>(a)(ii)</strong> $w = ${wPolar}$`,
        `<strong>(b)(i)</strong> With $a = ${a}$, $|w| = ${M}$: $${begun}$`,
        `<strong>(b)(i)</strong> $${completed}$`,
        `<strong>(b)(i)</strong> $k = ${k}$`,
        `<strong>(b)(i)</strong> $m = ${m}$`,
        `<strong>(b)(ii)</strong> The three roots are $\\frac{2\\pi}{3}$ apart: $${piTimes(q(z1Top, n))} \\pm \\frac{2\\pi}{3}$`,
        `<strong>(b)(ii)</strong> $z_2 = ${rootTexts[0]}$, $z_3 = ${rootTexts[1]}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: [
        `(a)(i) $${cartesian}$`,
        `(a)(ii) $${wPolar}$`,
        `(b)(i) $k = ${k}$ and $m = ${m}$`,
        `(b)(ii) $z_2 = ${rootTexts[0]}$, $z_3 = ${rootTexts[1]}$`,
      ].join('<br>'),
      ladder: {
        moves: [
          'Read the real and imaginary parts of $w$ from the diagram. What are its modulus and argument?',
          '(a)(i) Write $w$ in Cartesian form from the diagram.',
          '(a)(ii) Find the modulus.',
          '(a)(ii) Find the argument, checking the quadrant.',
          '(a)(ii) Write $w$ in polar form.',
          // Each step says what it shows (the owner, full read 2026-10-05).
          `(b)(i) Use de Moivre: put in $a = ${a}$, and write $z_1$ as the cube root of $w$.`,
          '(b)(i) Divide the argument by 3.',
          '(b)(i) Compare with the given form to state $k$.',
          '(b)(i) State $m$.',
          '(b)(ii) The three cube roots are equally spaced round the circle. How far apart are they?',
          '(b)(ii) Step round from $z_1$ to find the other two, with arguments in the principal range.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [null, null, null, `$${argText}$`, `$${wPolar}$`, `$${begun}$`, `$${completed}$`, null, null, '$\\ldots \\pm \\frac{2\\pi}{3}$', null],
        watch: { at: 3, text: 'Check the quadrant on the diagram before you find the argument.' },
      },
    };
  },
};

export const ROUTINES = {
  '2019 Q18': q2019q18,
};
