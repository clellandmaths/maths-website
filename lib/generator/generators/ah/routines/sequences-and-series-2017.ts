/**
 * Advanced Higher, Sequences and Series: how each 2017 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/sequences-and-series.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, pick, until } from '../draw';
import { poly, sum } from '../maths/format';
import { gcd } from '../maths/integer';
import { q } from '../maths/rational';

// ── 2017 Q4 ────────────────────────────────────────────────────────────────
// An arithmetic sequence from its pth and qth terms: (a) a and d; (b) the n
// with S_n = S, from D n² - (2a + D)n + 2S = 0 (d = -D), whose other root is
// negative. Built from a, D and that n: the other root is 1 + 2a/D - n, whole
// when D divides 2a, as the paper's -6.

interface Q4of2017 { a: number; D: number; N: number; p: number; gap: number }

const ORDINALS2017 = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth',
  'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth'];

/** 5th, 12th, 3rd. */
const nth2017 = (k: number) => `${k}${k === 2 ? 'nd' : k === 3 ? 'rd' : 'th'}`;

const q2017q4: CardRoutine<Q4of2017> = {
  draw: () => until(
    () => ({ a: int(3, 24), D: int(2, 6), N: int(6, 20), p: int(3, 8), gap: int(4, 9) }),
    ({ a, D, N, p, gap }) => {
      const qq = p + gap;
      const S = (N * (2 * a - (N - 1) * D)) / 2;
      // The other root whole and negative, as the paper's -6; both given terms
      // nonzero; the sum negative, as -144, from -30 to -300.
      return (2 * a) % D === 0 && 1 + (2 * a) / D - N < 0 && qq <= 15
        && a - (p - 1) * D !== 0 && a - (qq - 1) * D !== 0 && S >= -300 && S <= -30;
    },
  ),

  build: ({ a, D, N, p, gap }): Built => {
    const qq = p + gap;
    const Tp = a - (p - 1) * D, Tq = a - (qq - 1) * D;
    const S = (N * (2 * a - (N - 1) * D)) / 2;
    const other = 1 + (2 * a) / D - N;
    const coefs = [D, -(2 * a + D), 2 * S];
    const g = coefs.reduce((x, v) => gcd(x, v), 0);
    const quadratic = `${poly(coefs.map(c => c / g), 'n')} = 0`;
    const lead = D / g;
    const factored = `${lead === 1 ? '' : lead}(n - ${N})(n + ${-other}) = 0`;
    const pair = `$a + ${p - 1}d = ${Tp}$, $a + ${qq - 1}d = ${Tq}$`;
    const setUp = `\\frac{n}{2}\\left[${2 * a} - ${D}(n - 1)\\right] = ${S}`;
    return {
      questionLines: [
        `The ${ORDINALS2017[p]} term of an arithmetic sequence is $${Tp}$ and the ${ORDINALS2017[qq]} term is $${Tq}.$`,
        '<b>(a)</b> Determine the values of the first term and the common difference.',
        `<b>(b)</b> Obtain algebraically the value of $n$ for which $S_n = ${S}.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> ${pair}`,
        `<strong>(a)</strong> Subtracting, $${gap}d = ${Tq - Tp}$, so $d = ${-D}$ and $a = ${a}$`,
        `<strong>(b)</strong> $${setUp}$`,
        `<strong>(b)</strong> $${quadratic}$`,
        `<strong>(b)</strong> $${factored}$, so $n = ${N}$ or $n = ${other}$; $n$ counts terms, so $n \\gt 0$ and $n = ${N}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: [`(a) $a = ${a}$, $d = ${-D}$`, `(b) $n = ${N}$`].join('<br>'),
      ladder: {
        moves: [
          `Each term is the previous one plus $d$. How many $d$s are in the ${nth2017(p)} term, and in the ${nth2017(qq)}?`,
          `(a) Write the ${nth2017(p)} and ${nth2017(qq)} terms in terms of $a$ and $d$.`,
          '(a) Solve the two equations.',
          `(b) Put $a$ and $d$ into the arithmetic sum formula and set it equal to $${S}$.`,
          '(b) Rearrange into a quadratic in standard form.',
          '(b) Solve it, and say which root is not a possible number of terms.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, pair, null, `$${setUp}$`, `$${quadratic}$`, null],
        watch: { at: 5, text: 'Reject the negative root, and say why.' },
      },
    };
  },
};

// ── 2017 Q10 ───────────────────────────────────────────────────────────────
// (a) Σ (r² + cr) = n(n + 1)(2n + 1 + 3c)/6 = n(n + 1)(n + m)/3 with
// c = (2m - 1)/3, a third that is not whole, as the paper's 1/3 (m = 1, the
// repeated factor (n + 1)²); (b) the sum from L to 2p, the sum to 2p less the
// sum to L - 1.

interface Q10of2017 { m: number; L: number }

/** The sum to `n` written as a paper factorises it, for n a letter, 2p or a number. */
function factorised2017(m: number, n: string): string {
  if (m === 1) return `\\frac{${n}(${n} + 1)^{2}}{3}`;
  // A number or a letter squared as it is, 2p in brackets: 6^{2}, n^{2}, (2p)^{2}.
  if (m === 0) return `\\frac{${/^(\d+|[a-z])$/.test(n) ? n : `(${n})`}^{2}(${n} + 1)}{3}`;
  return `\\frac{${n}(${n} + 1)(${n} + ${m})}{3}`;
}

const q2017q10: CardRoutine<Q10of2017> = {
  // m from 0 to 7 where c is not whole (c = 1 and c = 3 are 2023 P1 Q7's);
  // L from 6 to 13 where the sum to L - 1 is whole, as the paper's 300.
  draw: () => ({ m: pick([0, 1, 3, 4, 6, 7]), L: pick([6, 7, 9, 10, 12, 13]) }),

  build: ({ m, L }): Built => {
    const c = q(2 * m - 1, 3);
    const summand = sum([{ coef: 1, body: 'r^{2}' }, { coef: c, body: 'r' }]);
    const sigma = (from: number | string, to: string) => `\\sum_{r=${from}}^{${to}}\\left(${summand}\\right)`;
    const k = 2 * m - 1, sgn = k < 0 ? '-' : '+';
    const substituted = `${sigma(1, 'n')} = \\frac{n(n + 1)(2n + 1)}{6} ${sgn} \\frac{${Math.abs(k)}}{3}\\left(\\frac{n(n + 1)}{2}\\right) = \\frac{n(n + 1)((2n + 1) ${sgn} ${Math.abs(k)})}{6}`;
    const formA = factorised2017(m, 'n');
    const simplified = `= \\frac{n(n + 1)(${poly([2, 2 * m], 'n')})}{6} = ${formA}`;
    const value = ((L - 1) * L * (L - 1 + m)) / 3;
    const p = Math.floor(L / 2);
    const top = factorised2017(m, '2p'), low = factorised2017(m, String(L - 1));
    const begun = `$${top}$ and $${low}$`;
    const answer = `${top} - ${value}`;
    return {
      questionLines: [
        `$S_n$ is defined by $${sigma(1, 'n')}.$`,
        '<b>(a)</b> Find an expression for $S_n$, fully factorising your answer.',
        `<b>(b)</b> Hence find an expression for $${sigma(L, '2p')}$ where $p \\gt ${p}.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> $${substituted}$`,
        `<strong>(a)</strong> $${simplified}$`,
        `<strong>(b)</strong> The sum to $2p$ less the sum to ${L - 1}: ${begun}, so $${sigma(L, '2p')} = ${top} - ${low}$`,
        `<strong>(b)</strong> $= ${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: [`(a) $S_n = ${formA}$`, `(b) $${answer}$`].join('<br>'),
      ladder: {
        moves: [
          'The sum splits into two sums you have standard results for. Which ones?',
          '(a) Replace $\\sum r^2$ and $\\sum r$ with their formulae.',
          '(a) Take out the common factors and factorise fully.',
          `(b) The sum from ${L} to $2p$ is the sum to $2p$ minus the sum to what?`,
          '(b) Substitute and simplify.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$${substituted}$`, `$${simplified}$`, begun, null],
        watch: { at: 3, text: `The sum starts at $r = ${L}$. Which terms do you need to take away?` },
      },
    };
  },
};

export const ROUTINES = {
  '2017 Q4': q2017q4,
  '2017 Q10': q2017q10,
};
