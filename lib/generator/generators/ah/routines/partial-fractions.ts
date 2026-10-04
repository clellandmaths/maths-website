/**
 * Advanced Higher, Partial Fractions: how each card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/partial-fractions.ts` under the same label.
 */
import type { Built, CardRoutine } from '../types';
import { distinct, int, nonZero, pick, until } from '../draw';
import { decimal, joinTerms, num, poly, sum } from '../maths/format';
import { gcd } from '../maths/integer';
import { mulPoly } from '../maths/polynomial';
import { type Q, q, isInt } from '../maths/rational';

// ── 2026 P2 Q13 ────────────────────────────────────────────────────────────
// (a) (x + c)/((x + p)(x + r)) = (j + 1)/(x + p) - j/(x + r), with r = c + jδ,
// p = r + δ; (b) y' + 2y/(x + c) = 1/((x + p)(x + r)(x + c)), y = 0 at x = x0

interface P2Q13 { c: number; delta: number; j: 1 | 2; x0: number }

/** `\ln\frac{25}{2}`, or `\ln 12` when the number is whole. */
const lnOf = (v: Q) => (isInt(v) ? `\\ln ${v.n}` : `\\ln\\frac{${v.n}}{${v.d}}`);

const q2026p2q13: CardRoutine<P2Q13> = {
  draw: () => until(
    () => ({ c: int(1, 5), delta: int(1, 3), j: int(1, 2) as 1 | 2, x0: int(1, 5) }),
    ({ c, delta, j }) => c + (j + 1) * delta <= 12,
  ),

  build: ({ c, delta, j, x0 }): Built => {
    const r = c + j * delta, p = r + delta;
    const A = j + 1;
    const xc = `x + ${c}`, xp = `x + ${p}`, xr = `x + ${r}`;
    const fraction = `\\frac{${xc}}{(${xp})(${xr})}`;
    const template = `${fraction} = \\frac{A}{${xp}} + \\frac{B}{${xr}}`;
    const partial = `\\frac{${A}}{${xp}} - \\frac{${j}}{${xr}}`;
    const equation = `\\frac{dy}{dx} + \\frac{2}{${xc}}y = \\frac{1}{(${xp})(${xr})(${xc})}`;
    const factor = `e^{\\int \\frac{2}{${xc}}\\,dx}`;
    const integral = `(${xc})^{2}y = \\int \\frac{(${xc})^{2}}{(${xp})(${xr})(${xc})}\\,dx`;
    const viaA = `\\int \\left(${partial}\\right)dx`;
    const logs = sum([{ coef: A, body: `\\ln(${xp})` }, { coef: -j, body: `\\ln(${xr})` }]);
    const logsAt = sum([{ coef: A, body: `\\ln ${x0 + p}` }, { coef: -j, body: `\\ln ${x0 + r}` }]);
    // c = -(A ln(x0 + p) - j ln(x0 + r)) = -ln R, R = (x0 + p)^A / (x0 + r)^j.
    const R = q(BigInt(x0 + p) ** BigInt(A), BigInt(x0 + r) ** BigInt(j));
    const constant = `-${lnOf(R)}`;
    const other = lnOf(q(R.d, R.n));
    const solution = `y = \\frac{${logs} - ${lnOf(R)}}{(${xc})^{2}}`;
    return {
      questionLines: [
        `<b>(a)</b> Express using partial fractions $${fraction}.$`,
        '<b>(b)</b> Hence find the particular solution of the differential equation',
        '',
        `$${equation},$ where $x \\ge 0,$`,
        '',
        `given that $y = 0$ when $x = ${x0}.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> $${template}$`,
        `<strong>(a)</strong> $${xc} = A(${xr}) + B(${xp})$ gives $A = ${A}$ and $B = ${-j}$, so $${fraction} = ${partial}$`,
        `<strong>(b)</strong> The integrating factor is $${factor}$`,
        `<strong>(b)</strong> $${factor} = e^{2\\ln(${xc})} = (${xc})^{2}$`,
        `<strong>(b)</strong> $${integral}$`,
        `<strong>(b)</strong> $(${xc})^{2}y = ${viaA}$`,
        `<strong>(b)</strong> $(${xc})^{2}y = ${logs} + c$`,
        `<strong>(b)</strong> $y = 0$ when $x = ${x0}$: $0 = ${logsAt} + c$, so $c = ${constant}$`,
        `<strong>(b)</strong> $${solution}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $${fraction} = ${partial}$<br>(b) $${solution}$`,
      ladder: {
        moves: [
          'The equation is linear in $y$. What do you multiply through by to make the left side one derivative?',
          '(a) Write the partial fractions template, with a constant over each factor.',
          '(a) Find the constants.',
          '(b) Write the integrating factor as $e$ to the integral of the coefficient of $y$.',
          '(b) Simplify the integrating factor.',
          '(b) Multiply through and write the left-hand side as an integral equation.',
          '(b) Simplify the right-hand side and use your partial fractions from (a).',
          '(b) Integrate, including a constant.',
          `(b) Substitute $y = 0$ and $x = ${x0}$ to find the constant.`,
          '(b) Rearrange to give $y$ on its own.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [null, `$${template}$`, `$${partial}$`, null, null, `$${integral}$`, `$${viaA}$`, null, `$${constant}$ or $${other}$`, null],
        watch: { at: 3, text: 'Without an integrating factor, none of (b)\'s marks are available.' },
      },
    };
  },
};

// ── 2025 P2 Q3 ─────────────────────────────────────────────────────────────
// A/(x - α) + B/(x - β) + C/(x - γ), combined into a quadratic over the three
// factors: built from the answer.

interface P2Q3 { roots: [number, number, number]; consts: [number, number, number] }

/** The numerator: each constant times the other two factors, added. */
function numeratorOf({ roots, consts }: P2Q3): number[] {
  const [a, b, c] = roots;
  const terms = [mulPoly([1, -b], [1, -c]), mulPoly([1, -a], [1, -c]), mulPoly([1, -a], [1, -b])];
  return [0, 1, 2].map(i => terms.reduce((s, t, j) => s + consts[j] * t[i], 0));
}

const q2025p2q3: CardRoutine<P2Q3> = {
  draw: () => until(
    () => ({
      roots: distinct([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6], 3) as [number, number, number],
      consts: [nonZero(-5, 5), nonZero(-5, 5), nonZero(-5, 5)] as [number, number, number],
    }),
    // A quadratic on top with every term, as 2x^2 - 18x + 4, within 40.
    (n) => numeratorOf(n).every(c => c !== 0 && Math.abs(c) <= 40),
  ),

  build: (n): Built => {
    const { roots, consts } = n;
    const names = ['A', 'B', 'C'];
    const factor = (r: number) => `(${poly([1, -r])})`;
    const top = poly(numeratorOf(n));
    const bottom = roots.map(factor).join('');
    const template = roots.map((r, i) => `\\frac{${names[i]}}{${poly([1, -r])}}`).join(' + ');
    const others = (i: number) => roots.filter((_, j) => j !== i).map(factor).join('');
    const identity = `${roots.map((_, i) => `${names[i]}${others(i)}`).join(' + ')} = ${top}`;
    /** At x = root i, only constant i is left: its bracket product times it. */
    const at = (i: number) => {
      const r = roots[i];
      const k = roots.filter((_, j) => j !== i).reduce((p, s) => p * (r - s), 1);
      return `at $x = ${r}$: $${sum([{ coef: k, body: names[i] }])} = ${k * consts[i]}$, so $${names[i]} = ${consts[i]}$`;
    };
    const answer = sum(roots.map((r, i) => ({ coef: Math.sign(consts[i]), body: `\\frac{${Math.abs(consts[i])}}{${poly([1, -r])}}` })));
    return {
      questionLines: [`Express $\\frac{${top}}{${bottom}}$ in partial fractions.`],
      solutionSteps: [
        `$\\frac{${top}}{${bottom}} = ${template}$`,
        `$${identity}$; ${at(0)}`,
        `${at(1)[0].toUpperCase()}${at(1).slice(1)}, and ${at(2)}; so $\\frac{${top}}{${bottom}} = ${answer}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'Three different linear factors underneath: what does each partial fraction look like?',
          'Write the template, with a constant over each factor.',
          'Multiply through and choose values of $x$ that make brackets vanish, to find one constant.',
          'Find the other two constants and write out the partial fractions.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$${template}$`, `$${identity}$, then one constant`, null],
        watch: { at: 1, text: 'Get the template right first. With the wrong one, nothing else counts.' },
      },
    };
  },
};

// ── 2024 P2 Q13 ────────────────────────────────────────────────────────────
// (a) -nb/(x(x + b)) = -n/x + n/(x + b); (b) ∫xe^{kx} by parts;
// (c) y' - nb y/(x(x + b)) = x^{n+1}e^{kx}/(x + b)^n: the integrating factor
// (x + b)^n/x^n turns the right side into (b)'s xe^{kx}.

interface P2Q13of2024 { n: number; b: number; k: number }

const q2024p2q13: CardRoutine<P2Q13of2024> = {
  draw: () => ({ n: int(1, 3), b: int(1, 3), k: int(2, 6) }),

  build: ({ n, b, k }): Built => {
    const nb = n * b;
    const xb = `x + ${b}`;
    const pow = (base: string, p: number) => (p === 1 ? base : `${base}^{${p}}`);
    // On its own over a line, x + b needs no brackets at the first power: x/(x + 1).
    const xn = pow('x', n), xbn = pow(`(${xb})`, n), xbnAlone = n === 1 ? xb : xbn;
    const fraction = `\\frac{-${nb}}{x(${xb})}`;
    const template = `\\frac{A}{x} + \\frac{B}{${xb}}`;
    const partial = `\\frac{-${n}}{x} + \\frac{${n}}{${xb}}`;
    const e = `e^{${k}x}`;
    const uv = `${sum([{ coef: q(1, k), body: `x${e}` }])}`;
    const left = `\\int ${sum([{ coef: q(1, k), body: e }])}\\,dx`;
    const integral = `${sum([{ coef: q(1, k), body: `x${e}` }, { coef: q(-1, k * k), body: e }])} + c`;
    const equation = `\\frac{dy}{dx} - \\frac{${nb === 1 ? '' : nb}y}{x(${xb})} = \\frac{${pow('x', n + 1)}${e}}{${xbnAlone}}`;
    const ifForm = `e^{\\int ${fraction}dx}`;
    const ifSplit = `e^{\\int ${partial}dx}`;
    const logs = sum([{ coef: -n, body: '\\ln x' }, { coef: n, body: `\\ln(${xb})` }]);
    const factor = `\\frac{${xbnAlone}}{${xn}}`;
    const integralEquation = `\\frac{${xbn}y}{${xn}} = \\int x${e}\\,dx`;
    const y = `y = \\frac{${xn}}{${xbnAlone}}\\left(${integral}\\right)`;
    return {
      questionLines: [
        `<b>(a)</b> Express $${fraction}$ in partial fractions.`,
        `<b>(b)</b> Use integration by parts to find $\\int x${e}\\,dx.$`,
        '<b>(c)</b> Using your answers to (a) and (b), solve',
        '',
        `$${equation}.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> $${fraction} = ${template}$`,
        `<strong>(a)</strong> $-${nb} = A(${xb}) + Bx$: at $x = 0$ and $x = -${b}$, $A = -${n}$ and $B = ${n}$`,
        `<strong>(b)</strong> With $u = x$ and $\\frac{dv}{dx} = ${e}$: $${uv} - \\ldots$`,
        `<strong>(b)</strong> $\\int x${e}\\,dx = ${uv} - ${left}$`,
        `<strong>(b)</strong> $\\int x${e}\\,dx = ${integral}$`,
        `<strong>(c)</strong> The integrating factor is $${ifForm}$`,
        `<strong>(c)</strong> By (a), $${ifSplit}$`,
        `<strong>(c)</strong> $e^{${logs}} = ${factor}$`,
        `<strong>(c)</strong> Multiplying through, $\\frac{d}{dx}\\left(${factor}y\\right) = x${e}$, so $${integralEquation}$`,
        `<strong>(c)</strong> By (b), $${y}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $${partial}$<br>(b) $${integral}$<br>(c) $${y}$`,
      ladder: {
        moves: [
          'The three parts build on each other. Where will (a) and (b) be used in (c)?',
          '(a) Write the partial fractions template.',
          '(a) Find the two constants.',
          '(b) Choose which factor to integrate, and write the "$uv$" part.',
          '(b) Write the integral that is left.',
          '(b) Finish the integration, with a constant.',
          '(c) Write the integrating factor as $e$ to the integral of the coefficient of $y$.',
          '(c) Use (a) to replace the fraction in the integrating factor.',
          '(c) Integrate and simplify the integrating factor, using log laws.',
          '(c) Multiply through, and write the equation as an integral equation.',
          '(c) Use (b) for the right-hand side, and rearrange for $y$.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [null, `$${template}$`, `$A = -${n}$ and $B = ${n}$`, `$${uv} - \\ldots$`, `$\\ldots ${left}$`, `$${integral}$`, `$${ifForm}$`, `$${ifSplit}$`, `$${factor}$`, `$${integralEquation}$`, null],
        watch: { at: 3, text: `Integrate $${e}$ and differentiate $x$. Doing the same to both loses (b).` },
      },
    };
  },
};

// ── 2023 P1 Q2 ─────────────────────────────────────────────────────────────
// A/(x - α) + B/(x - β) + C/(x - β)², combined into a quadratic over
// (x - α)(x - β)²: built from the answer.

interface P1Q2of2023 { alpha: number; beta: number; A: number; B: number; C: number }

/** The numerator: A(x - β)² + B(x - α)(x - β) + C(x - α). */
function repeatedTop({ alpha, beta, A, B, C }: P1Q2of2023): number[] {
  const parts = [mulPoly([1, -beta], [1, -beta]), mulPoly([1, -alpha], [1, -beta]), [0, 1, -alpha]];
  return [0, 1, 2].map(i => A * parts[0][i] + B * parts[1][i] + C * parts[2][i]);
}

const q2023p1q2: CardRoutine<P1Q2of2023> = {
  draw: () => until(
    () => {
      const [alpha, beta] = distinct([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6], 2);
      return { alpha, beta, A: nonZero(-5, 5), B: nonZero(-5, 5), C: nonZero(-5, 5) };
    },
    // A quadratic on top with every term, as 3x^2 - x - 14, its x^2 positive, within 40.
    (n) => repeatedTop(n).every(c => c !== 0 && Math.abs(c) <= 40) && n.A + n.B > 0,
  ),

  build: (n): Built => {
    const { alpha, beta, A, B, C } = n;
    const xa = poly([1, -alpha]), xb = poly([1, -beta]);
    const top = poly(repeatedTop(n));
    const lead = A + B;
    const fraction = `\\frac{${top}}{(${xa})(${xb})^{2}}`;
    const template = `\\frac{A}{${xa}} + \\frac{B}{${xb}} + \\frac{C}{(${xb})^{2}}`;
    const identity = `${top} = A(${xb})^{2} + B(${xa})(${xb}) + C(${xa})`;
    // At x = β only C is left, at x = α only A; then the x² terms give B.
    const cAt = beta - alpha, aAt = (alpha - beta) ** 2;
    const found = `at $x = ${beta}$: $${sum([{ coef: cAt, body: 'C' }])} = ${cAt * C}$, so $C = ${C}$`;
    const rest = `At $x = ${alpha}$: $${sum([{ coef: aAt, body: 'A' }])} = ${aAt * A}$, so $A = ${A}$; comparing the $x^{2}$ terms, $A + B = ${lead}$, so $B = ${B}$`;
    const over = (k: number, bottom: string) => ({ coef: Math.sign(k), body: `\\frac{${Math.abs(k)}}{${bottom}}` });
    const answer = sum([over(A, xa), over(B, xb), over(C, `(${xb})^{2}`)]);
    return {
      questionLines: [`Express $${fraction}$ in partial fractions.`],
      solutionSteps: [
        `$${fraction} = ${template}$`,
        `$${identity}$; ${found}`,
        `${rest}; so $${fraction} = ${answer}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'One factor underneath is repeated. What does that add to the partial fractions?',
          `Write the template, with one fraction for $${xa}$ and two for the repeated factor.`,
          'Multiply through and choose values of $x$ that make brackets vanish, to find one constant.',
          'Find the other constants, comparing coefficients if you need to, and write out the partial fractions.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$${fraction} = ${template}$`, `$${identity}$ and $A = ${A}$ or $B = ${B}$ or $C = ${C}$`, null],
        watch: { at: 1, text: `A repeated factor needs both $\\frac{B}{${xb}}$ and $\\frac{C}{(${xb})^{2}}$. With the wrong template, nothing counts.` },
      },
    };
  },
};

// ── 2022 P2 Q1 ─────────────────────────────────────────────────────────────
// A/x + (Bx + C)/(x² + m), combined into (A + B)x² + Cx + Am over x(x² + m):
// built from the answer.

interface P2Q1of2022 { A: number; B: number; C: number; m: number }

const q2022p2q1: CardRoutine<P2Q1of2022> = {
  draw: () => until(
    () => ({ A: nonZero(-5, 5), B: nonZero(-5, 5), C: nonZero(-5, 5), m: int(1, 9) }),
    // A quadratic on top with every term, as 3x^2 - 3x + 5, its x^2 positive, within 40.
    ({ A, B, m }) => A + B > 0 && Math.abs(A * m) <= 40,
  ),

  build: ({ A, B, C, m }): Built => {
    const quad = `x^{2} + ${m}`;
    const top = poly([A + B, C, A * m]);
    const fraction = `\\frac{${top}}{x(${quad})}`;
    const template = `\\frac{A}{x} + \\frac{Bx + C}{${quad}}`;
    const identity = `${top} = A(${quad}) + (Bx + C)x`;
    const found = `at $x = 0$: $${sum([{ coef: m, body: 'A' }])} = ${A * m}$, so $A = ${A}$`;
    const rest = `Comparing the $x^{2}$ terms, $A + B = ${A + B}$, so $B = ${B}$; comparing the $x$ terms, $C = ${C}$`;
    // Each fraction's sign outside it, as the paper writes -\frac{2}{x}.
    const first = `${A < 0 ? '-' : ''}\\frac{${Math.abs(A)}}{x}`;
    const second = `${B < 0 ? '-' : ''}\\frac{${poly([Math.abs(B), Math.sign(B) * C])}}{${quad}}`;
    const answer = joinTerms([first, second]);
    return {
      questionLines: [`Express $${fraction}$ in partial fractions.`],
      solutionSteps: [
        `$${fraction} = ${template}$`,
        `$${identity}$; ${found}`,
        `${rest}; so $${fraction} = ${answer}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'One factor underneath is a quadratic that will not factorise. What goes over it in the partial fractions?',
          `Write the template: a constant over $x$, and a linear expression over $${quad}$.`,
          'Multiply through, and find one constant by choosing a value of $x$ or comparing coefficients.',
          'Find the others and write out the partial fractions.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$${template}$`, `$${identity}$ and $A = ${A}$`, null],
        watch: { at: 1, text: `Over $${quad}$ the numerator must be $Bx + C$, not just a constant.` },
      },
    };
  },
};

// ── 2021 P2 Q9 ─────────────────────────────────────────────────────────────
// (a) 1/(x(K - x)) = 1/(Kx) + 1/(K(K - x)); (b) dP/dt = (1/r)P(K - P),
// P = K/2 at t = T, as the paper's 250 seals of 500, so the log term
// vanishes and c = -T/r: P/(K - P) = e^{(K/r)t - KT/r}.

interface P2Q9of2021 { K: number; r: number; T: number }

const q2021p2q9: CardRoutine<P2Q9of2021> = {
  draw: () => ({ K: int(3, 9), r: pick([50, 100, 200]), T: pick([5, 10, 20]) }),

  build: ({ K, r, T }): Built => {
    const half = decimal(q(K, 2), 1);
    const dec = (n: number, d: number) => decimal(q(n, d), 6);
    const power = `${dec(K, r)}t - ${dec(K * T, r)}`;
    const e = `e^{${power}}`;
    const split = (v: string) => `\\frac{1}{${K}${v}} + \\frac{1}{${K}(${K} - ${v})}`;
    const integrated = `\\frac{1}{${K}}(\\ln P - \\ln(${K} - P)) = \\frac{1}{${r}}t + c`;
    const subbed = `\\frac{1}{${K}}(\\ln ${half} - \\ln(${K} - ${half})) = ${num(q(T, r))} + c`;
    const c = num(q(-T, r));
    const ratio = `\\frac{P}{${K} - P} = ${e}`;
    const answer = `P = \\frac{${K}${e}}{1 + ${e}}`;
    return {
      questionLines: [
        `<b>(a)</b> Express $\\frac{1}{x(${K} - x)}$ in partial fractions.`,
        'A small island is being populated by seals. The size of the seal population can be modelled by the differential equation',
        '',
        `$\\frac{dP}{dt} = \\frac{1}{${r}}P(${K} - P), \\quad 0 \\lt P \\lt ${K}$`,
        '',
        'where $P$ (in hundreds) is the number of seals on the island $t$ years after the seals arrive.',
        `<b>(b)</b> Given that there are ${50 * K} seals after ${T} years, find an expression for $P$ in terms of $t.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> $\\frac{1}{x(${K} - x)} = \\frac{A}{x} + \\frac{B}{${K} - x}$, so $1 = A(${K} - x) + Bx$`,
        `<strong>(a)</strong> $A = B = \\frac{1}{${K}}$: $\\frac{1}{x(${K} - x)} = ${split('x')}$`,
        `<strong>(b)</strong> $\\int \\frac{1}{P(${K} - P)}\\,dP = \\int \\frac{1}{${r}}\\,dt$`,
        `<strong>(b)</strong> By (a), $\\frac{1}{${K}}\\int\\left(\\frac{1}{P} + \\frac{1}{${K} - P}\\right)dP = \\int \\frac{1}{${r}}\\,dt$`,
        `<strong>(b)</strong> $\\frac{1}{${K}}(\\ln P\\ldots$`,
        `<strong>(b)</strong> $${integrated}$`,
        `<strong>(b)</strong> ${50 * K} seals is $P = ${half}$ (hundreds): $${subbed}$`,
        `<strong>(b)</strong> $\\ln 1 = 0$, so $c = ${c}$`,
        `<strong>(b)</strong> $\\ln\\left(\\frac{P}{${K} - P}\\right) = ${power}$, so $${ratio}$`,
        `<strong>(b)</strong> $P = ${K}${e} - P${e}$, so $${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $${split('x')}$<br>(b) $${answer}$`,
      ladder: {
        moves: [
          '(a) prepares a fraction you will meet again in (b). Where?',
          '(a) Write the partial fractions template.',
          '(a) Find the constants.',
          '(b) Separate the variables and write both sides as integrals.',
          '(b) Use (a) to split the $P$ side.',
          '(b) Integrate the $\\frac{1}{P}$ term.',
          '(b) Integrate the other term, and the $t$ side, with a constant.',
          `(b) Substitute the values after ${T} years. $P$ is in hundreds.`,
          '(b) Find the constant.',
          '(b) Combine the logs and take exponentials.',
          '(b) Rearrange to make $P$ the subject.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$\\frac{1}{x(${K} - x)} = \\frac{A}{x} + \\frac{B}{${K} - x}$`,
          `$${split('x')}$`,
          `$\\int \\frac{1}{P(${K} - P)}\\,dP = \\int \\frac{1}{${r}}\\,dt$`,
          `$\\frac{1}{${K}}\\int\\left(\\frac{1}{P} + \\frac{1}{${K} - P}\\right)dP$`,
          `$\\frac{1}{${K}}(\\ln P\\ldots$`,
          `$${integrated}$`,
          `$${subbed}$`,
          `$${c}$`,
          `$${ratio}$`,
          null,
        ],
        watch: { at: 7, text: '$P$ is in hundreds. Convert the number of seals before you substitute.' },
      },
    };
  },
};

// ── 2019 Q4 ────────────────────────────────────────────────────────────────
// (a) a quadratic over (x - r1)(x - r2), same degree, divided into
// p + (qx + r)/(…); (b) hence p + A/(x - r1) + B/(x - r2). Built from the answer.

interface Q4of2019 { p: number; r1: number; r2: number; A: number; B: number }

/** The remainder qx + r = A(x - r2) + B(x - r1), and the numerator over the quadratic. */
function q4Parts({ p, r1, r2, A, B }: Q4of2019) {
  const qq = A + B, rr = -(A * r2 + B * r1);
  const den = [1, -(r1 + r2), r1 * r2];
  return { qq, rr, den, top: [p, p * den[1] + qq, p * den[2] + rr] };
}

const q2019q4: CardRoutine<Q4of2019> = {
  draw: () => until(
    () => {
      const [a, b] = distinct([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6], 2);
      return { p: int(2, 5), r1: Math.min(a, b), r2: Math.max(a, b), A: nonZero(-6, 6), B: nonZero(-6, 6) };
    },
    (n) => {
      const { qq, rr, den, top } = q4Parts(n);
      // Every term on top and bottom, as 3x^2 + x - 17 over x^2 - x - 12, within 40;
      // q positive, as the paper's 4x + 19, so the remainder never opens with a minus.
      return qq > 0 && rr !== 0 && den[1] !== 0 && top.every(c => c !== 0 && Math.abs(c) <= 40);
    },
  ),

  build: (n): Built => {
    const { p, r1, r2, A, B } = n;
    const { qq, rr, den, top } = q4Parts(n);
    const D = poly(den), N = poly(top);
    const f1 = poly([1, -r1]), f2 = poly([1, -r2]);
    const rem = poly([qq, rr]);
    const divided = `${p} + \\frac{${rem}}{${D}}`;
    const template = `\\frac{A}{${f1}} + \\frac{B}{${f2}}`;
    const identity = `${rem} = A(${f2}) + B(${f1})`;
    const k1 = r1 - r2, k2 = r2 - r1;
    const answer = joinTerms([String(p), `${A < 0 ? '-' : ''}\\frac{${Math.abs(A)}}{${f1}}`, `${B < 0 ? '-' : ''}\\frac{${Math.abs(B)}}{${f2}}`]);
    return {
      questionLines: [
        `<b>(a)</b> Express $\\frac{${N}}{${D}}$ in the form`,
        `$p + \\frac{qx + r}{${D}}$`,
        'where $p$, $q$ and $r$ are integers.',
        `<b>(b)</b> Hence express $\\frac{${N}}{${D}}$ with partial fractions.`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> Dividing, $\\frac{${N}}{${D}} = ${divided}$`,
        `<strong>(b)</strong> $${D} = (${f1})(${f2})$, so $\\frac{${rem}}{${D}} = ${template}$`,
        `<strong>(b)</strong> $${identity}$; at $x = ${r1}$: $${sum([{ coef: k1, body: 'A' }])} = ${k1 * A}$, so $A = ${A}$`,
        `<strong>(b)</strong> At $x = ${r2}$: $${sum([{ coef: k2, body: 'B' }])} = ${k2 * B}$, so $B = ${B}$, and $\\frac{${N}}{${D}} = ${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $${divided}$<br>(b) $${answer}$`,
      ladder: {
        moves: [
          'The top and bottom have the same degree. What do you do before partial fractions?',
          '(a) Divide the numerator by the denominator algebraically, and write the result in the given form.',
          `(b) Factorise $${D}$ and write the template for the fraction part.`,
          '(b) Multiply through and choose values of $x$ to find one constant.',
          '(b) Find the other and write out the whole expression.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$${divided}$`, `$${template}$`, `$${identity}$, $A = ${A}$ or $B = ${B}$`, null],
        watch: { at: 4, text: 'Keep the whole number from (a) in your final answer.' },
      },
    };
  },
};

// ── 2018 Q2 ────────────────────────────────────────────────────────────────
// ∫ (px + c)/((x + m)(x - n)) dx: the fractions A/(x + m) + B/(x - n) chosen
// first, then combined, so A and B come out whole, as the paper's 2 and 1.

interface Q2of2018 { m: number; n: number; A: number; B: number }

const q2018q2: CardRoutine<Q2of2018> = {
  // m ≠ n, so the denominator has an x term, as the paper's -2x; the top's
  // constant Bm - An never 0, as the paper's -7.
  draw: () => until(
    () => ({ m: int(1, 6), n: int(1, 7), A: int(1, 4), B: int(1, 4) }),
    v => v.m !== v.n && v.B * v.m !== v.A * v.n,
  ),

  build: ({ m, n, A, B }): Built => {
    const top = poly([A + B, B * m - A * n]);
    const bottom = poly([1, m - n, -m * n]);
    const plus = `x + ${m}`, minus = `x - ${n}`;
    const frac = (k: number, den: string) => `\\frac{${k}}{${den}}`;
    const ln = (k: number, den: string) => `${k === 1 ? '' : k}\\ln|${den}|`;
    const template = `\\frac{${top}}{${bottom}} = \\frac{A}{${plus}} + \\frac{B}{${minus}}`;
    const identity = `${top} = A(${minus}) + B(${plus})`;
    const split = `\\int\\left(${frac(A, plus)} + ${frac(B, minus)}\\right)dx`;
    const answer = `${ln(A, plus)} + ${ln(B, minus)} + c`;
    return {
      questionLines: [`Use partial fractions to find $\\int \\frac{${top}}{${bottom}} \\, dx.$`],
      solutionSteps: [
        `$${template}$`,
        `$${identity}$; at $x = ${-m}$, $${-(A + B) * m + B * m - A * n} = ${-(m + n)}A$, so $A = ${A}$`,
        `At $x = ${n}$, $${(A + B) * n + B * m - A * n} = ${m + n}B$, so $B = ${B}$, and the integral is $${split}$`,
        `$= ${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'The denominator factorises. Into what, and what do the partial fractions look like?',
          'Factorise the denominator and write the partial fractions template.',
          'Multiply through and choose a value of $x$ to find one constant.',
          'Find the other, and write the integral as two simpler fractions.',
          'Integrate each as a log, and add the constant.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$${template}$`, `$${identity}$ and $A = ${A}$`, `$B = ${B}$ and $${split}$`, null],
        watch: { at: 4, text: 'Add the constant of integration, or the last mark goes.' },
      },
    };
  },
};

// ── 2017 Q2 ────────────────────────────────────────────────────────────────
// A/(x - α) + B/(x - β) + C/(x - β)², combined into a quadratic over
// (x - α)(x - β)²: built from the answer. Its own routine; 2023 P1 Q2 asks
// the same in three marks.

interface Q2of2017 { alpha: number; beta: number; A: number; B: number; C: number }

/** The numerator: A(x - β)² + B(x - α)(x - β) + C(x - α). */
function top2017({ alpha, beta, A, B, C }: Q2of2017): number[] {
  const parts = [mulPoly([1, -beta], [1, -beta]), mulPoly([1, -alpha], [1, -beta]), [0, 1, -alpha]];
  return [0, 1, 2].map(i => A * parts[0][i] + B * parts[1][i] + C * parts[2][i]);
}

const q2017q2: CardRoutine<Q2of2017> = {
  draw: () => until(
    () => {
      const [alpha, beta] = distinct([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5], 2);
      return { alpha, beta, A: nonZero(-5, 5), B: nonZero(-5, 5), C: nonZero(-5, 5) };
    },
    // A quadratic on top with every term, as x^2 - 6x + 20, its x^2 positive,
    // within 40, and no factor common to all three, which a paper would take out.
    (n) => {
      const t = top2017(n);
      return t.every(c => c !== 0 && Math.abs(c) <= 40) && n.A + n.B > 0 && gcd(gcd(t[0], t[1]), t[2]) === 1;
    },
  ),

  build: (n): Built => {
    const { alpha, beta, A, B, C } = n;
    const xa = poly([1, -alpha]), xb = poly([1, -beta]);
    const top = poly(top2017(n));
    const lead = A + B;
    const fraction = `\\frac{${top}}{(${xa})(${xb})^{2}}`;
    const template = `\\frac{A}{${xa}} + \\frac{B}{${xb}} + \\frac{C}{(${xb})^{2}}`;
    const identity = `${top} = A(${xb})^{2} + B(${xa})(${xb}) + C(${xa})`;
    // At x = β only C is left, at x = α only A; then the x² terms give B.
    const cAt = beta - alpha, aAt = (alpha - beta) ** 2;
    const two = `At $x = ${beta}$: $${sum([{ coef: cAt, body: 'C' }])} = ${cAt * C}$, so $C = ${C}$; at $x = ${alpha}$: $${sum([{ coef: aAt, body: 'A' }])} = ${aAt * A}$, so $A = ${A}$`;
    const over = (k: number, bottom: string) => ({ coef: Math.sign(k), body: `\\frac{${Math.abs(k)}}{${bottom}}` });
    const answer = sum([over(A, xa), over(B, xb), over(C, `(${xb})^{2}`)]);
    return {
      questionLines: [`Express $${fraction}$ in partial fractions.`],
      solutionSteps: [
        `$${fraction} = ${template}$`,
        `$${identity}$`,
        two,
        `Comparing the $x^{2}$ terms, $A + B = ${lead}$, so $B = ${B}$; so $${fraction} = ${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'One factor underneath is repeated. What does that add to the partial fractions?',
          `Write the template, with one fraction for $${xa}$ and two for the repeated factor.`,
          'Multiply through by the whole denominator.',
          'Choose values of $x$ that make brackets vanish, to find two constants.',
          'Find the last one by comparing coefficients, and write out the partial fractions.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$${fraction} = ${template}$`, `$${identity}$`, `$A = ${A}$, $C = ${C}$`, null],
        watch: { at: 1, text: `A repeated factor needs both $\\frac{B}{${xb}}$ and $\\frac{C}{(${xb})^{2}}$.` },
      },
    };
  },
};

export const ROUTINES = {
  '2017 Q2': q2017q2,
  '2018 Q2': q2018q2,
  '2019 Q4': q2019q4,
  '2021 P2 Q9': q2021p2q9,
  '2022 P2 Q1': q2022p2q1,
  '2023 P1 Q2': q2023p1q2,
  '2024 P2 Q13': q2024p2q13,
  '2025 P2 Q3': q2025p2q3,
  '2026 P2 Q13': q2026p2q13,
};
