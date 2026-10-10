/**
 * Advanced Higher, Integration: how each 2019 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/integration.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, pick } from '../draw';
import { num, sum } from '../maths/format';
import { gcd } from '../maths/integer';
import { q } from '../maths/rational';

// ── 2019 Q16 ───────────────────────────────────────────────────────────────
// (a) ∫_0^p (x - p)² e^{mx} dx by parts twice, written expanded as the paper's
// x² - 2x + 1: = (2e^{mp} - (p²m² + 2pm + 2))/m³; (b) y = c(x - p)e^{(m/2)x}
// rotated between 0 and p, so y² is c² times (a)'s integrand: c²π times (a).

interface Q16of2019 { m: 2 | 4 | 6 | 8; p: 1 | 2 | 3; c: number }

const q2019q16: CardRoutine<Q16of2019> = {
  // p from 1 to 3 and m to 8 on the owner's yes (variation-depth sheet, card 6,
  // 2026-10-05): twelve integrals where there were six. The single paper, calculator.
  draw: () => ({ m: pick([2, 4, 6, 8] as const), p: pick([1, 2, 3] as const), c: int(2, 5) }),

  build: ({ m, p, c }): Built => {
    const ex = `e^{${m}x}`;
    const quad = sum([{ coef: 1, body: 'x^{2}' }, { coef: -2 * p, body: 'x' }, { coef: p * p, body: '' }]);
    const lin = sum([{ coef: 2, body: 'x' }, { coef: -2 * p, body: '' }]);
    const over = (k: number) => `\\frac{${ex}}{${k}}`;
    const begun = `${over(m)}(${quad}) - \\ldots`;
    const first = `\\ldots\\int (${lin})${over(m)}\\,dx`;
    const second = `\\ldots\\left[${over(m * m)}(${lin}) - ${num(q(2, m * m))}\\int ${ex}\\,dx\\right]`;
    const limits = `\\left[${over(m)}(${quad})\\right]_{0}^{${p}} - \\left[${num(q(1, m * m))}(${lin})${ex} - ${num(q(2, m ** 3))}${ex}\\right]_{0}^{${p}}`;
    // (2e^{mp} - L)/m³ in lowest terms: K e^{mp} - L over D.
    const L = p * p * m * m + 2 * p * m + 2;
    const g = gcd(gcd(2, L), m ** 3);
    const K = 2 / g, Lg = L / g, D = m ** 3 / g;
    const ePow = `e^{${m * p}}`;
    const bracket = `(${K === 1 ? '' : K}${ePow} - ${Lg})`;
    const answerA = `\\frac{1}{${D}}${bracket}`;
    const k = m / 2;
    const yExp = `e^{${k === 1 ? '' : k}x}`;
    const y = `${c}(${sum([{ coef: 1, body: 'x' }, { coef: -p, body: '' }])})${yExp}`;
    const volIntegral = `\\pi\\int_{0}^{${p}} y^{2}\\,dx`;
    const squared = `${c * c}\\pi\\int_{0}^{${p}} (${quad})${ex}\\,dx`;
    const share = q(c * c, D);
    const lead = share.d === 1n ? `${share.n === 1n ? '' : share.n}\\pi` : `\\frac{${share.n === 1n ? '' : share.n}\\pi}{${share.d}}`;
    const answerB = `${lead}${bracket}`;
    return {
      questionLines: [
        '<b>(a)</b> Use integration by parts to find the exact value of',
        '',
        `$\\int_{0}^{${p}}(${quad})${ex}\\,dx.$`,
        '',
        `<b>(b)</b> A solid is formed by rotating the curve with equation $y = ${y}$ between $x = 0$ and $x = ${p}$ through $2\\pi$ radians about the $x$-axis.`,
        'Find the exact value of the volume of this solid.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> By parts, with $${ex}$ integrated: $${begun}$`,
        `<strong>(a)</strong> $${over(m)}(${quad}) - \\int (${lin})${over(m)}\\,dx$`,
        `<strong>(a)</strong> By parts again: $\\int (${lin})${over(m)}\\,dx = ${over(m * m)}(${lin}) - ${num(q(2, m * m))}\\int ${ex}\\,dx$`,
        `<strong>(a)</strong> $${limits}$`,
        `<strong>(a)</strong> $= ${answerA}$`,
        `<strong>(b)</strong> $V = ${volIntegral}$`,
        `<strong>(b)</strong> $V = ${squared}$`,
        `<strong>(b)</strong> By (a), $V = ${c * c}\\pi \\times ${answerA} = ${answerB}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $${answerA}$<br>(b) $${answerB}$`,
      ladder: {
        moves: [
          'The quadratic factor becomes simpler each time you differentiate it. How many times will you need integration by parts?',
          '(a) Choose which factor to integrate, and start the first application.',
          '(a) Complete the first application.',
          '(a) Apply integration by parts again to the integral that is left.',
          '(a) Complete the integration, with the limits.',
          '(a) Evaluate exactly.',
          '(b) Write the volume integral, with its limits.',
          '(b) Square $y$ and compare it with the integral in (a).',
          '(b) Use (a) and evaluate exactly.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [null, `$${begun}$`, `$${first}$`, `$${second}$`, `$${limits}$`, `$${answerA}$`, `$${volIntegral}$`, `$${squared}$`, null],
        watch: { at: 6, text: 'The volume integral needs its limits and $dx$ written, or that mark goes.' },
      },
    };
  },
};

export const ROUTINES = {
  '2019 Q16': q2019q16,
};
