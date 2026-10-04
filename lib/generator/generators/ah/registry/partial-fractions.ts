/**
 * Advanced Higher, Partial Fractions: what each card is.
 * The routines are in `../routines/partial-fractions.ts`, under the same labels.
 *
 * A card with two site topics lives under the first: 2026 P2 Q13 is
 * "Partial Fractions" then "Differential Equations" on the site.
 */
import type { CardMeta } from '../types';

export const PARTIAL_FRACTIONS: readonly CardMeta[] = [
  {
    card: '2017 Q2',
    skill: 'Express a quadratic over a linear factor and a repeated linear factor in partial fractions.',
    marks: [4],
    route: 'The template, A/(x - α) + B/(x - β) + C/(x - β)^2; multiplied through by the whole denominator; two of A, B and C, from x = β and x = α; the last by comparing the x^2 terms, and the partial fractions stated. A template without both B/(x - β) and C/(x - β)^2 earns nothing after it.',
    ranges: 'The paper: (x^2 - 6x + 20)/((x + 1)(x - 2)^2), answer 3/(x + 1) - 2/(x - 2) + 4/(x - 2)^2. Built from the answer: α and β different, from ±1 to ±5 (the paper\'s -1 and 2), A, B and C from ±1 to ±5 (the paper\'s 3, -2 and 4). Kept: the numerator a quadratic with every term, its x^2 positive (A + B > 0, the paper\'s 1), each coefficient within 40 (the paper\'s 20), with no factor common to all three. Its own routine; a near relation of 2023 P1 Q2 (locked), the same question for three marks. Over 1000 questions.',
  },
  {
    card: '2021 P2 Q9',
    skill: 'Partial fractions for 1/(x(K - x)), then solve the logistic model dP/dt = (1/r)P(K - P) for seals from one count, P in terms of t.',
    marks: [2, 8],
    route: '2 + 8 - (a) the template A/x + B/(K - x), then the constants, 1/(Kx) + 1/(K(K - x)); (b) separated into integrals; split by (a); the 1/P term integrated; the rest and the t side with a constant; the count substituted, in hundreds; the constant; exponentials taken; P made the subject.',
    ranges: 'The paper: K = 5 (hundreds), rate 1/100, 250 seals after 10 years, P = 5e^{0.05t - 0.5}/(1 + e^{0.05t - 0.5}). K from 3 to 9 hundred (the paper\'s 5), the rate 1/50, 1/100 (the paper\'s) or 1/200, the time 5, 10 (the paper\'s) or 20 years. The count is always half the island\'s K, as the paper\'s 250 of 500, so the log term at the count is ln 1 = 0 and the constant is -T/r, as the paper\'s -1/10: another count adds a logarithm to carry through, a step the paper does not have. The exponent\'s coefficients are terminating decimals, as 0.05 and 0.5. 63 questions.',
  },
  {
    card: '2026 P2 Q13',
    skill: 'Partial fractions, then a first-order linear differential equation whose integral they finish.',
    marks: [2, 7],
    route: '2 + 7 - (a) the template, then the constants; (b) the integrating factor as e to the integral, then (x + c)^2; the equation as an integral; its right side through (a); integrated with a constant; the constant from the condition; y on its own. Without an integrating factor none of (b) is available.',
    ranges: 'The paper: (x + 3)/((x + 7)(x + 5)) = 2/(x + 7) - 1/(x + 5); y\' + 2y/(x + 3) = 1/((x + 7)(x + 5)(x + 3)), y = 0 at x = 3. The coefficient of y stays 2/(x + c), so the integrating factor is a square and (a)\'s fraction is exactly what the right side becomes. c from 1 to 5, the factors x + c + jd and x + c + (j + 1)d with d from 1 to 3 and j 1 or 2, so the partial fractions are whole, (j + 1) and -j, as the paper\'s 2 and -1; no factor past x + 12; the condition at x from 1 to 5.',
  },
  {
    card: '2025 P2 Q3',
    skill: 'Split a quadratic over three different linear factors into partial fractions.',
    marks: [3],
    route: 'The template, a constant over each factor; the identity formed and one constant found; the other two found and the partial fractions written. With the wrong template nothing else counts.',
    ranges: 'The paper: (2x^2 - 18x + 4)/((x - 1)(x - 3)(x + 5)) = 1/(x - 1) - 2/(x - 3) + 3/(x + 5). Built from the answer: three different factors x - r, r from ±1 to ±6 (never x alone, as the paper has none), and the three constants whole from ±1 to ±5, never 0, as 1, -2 and 3. Kept: the top a quadratic with all three terms, as the paper\'s, each within 40.',
  },
  {
    card: '2024 P2 Q13',
    skill: 'Partial fractions, then integration by parts, then a first-order linear equation whose integrating factor uses the first and whose integral is the second.',
    marks: [2, 3, 5],
    route: '2 + 3 + 5 - (a) the template A/x + B/(x + b), then A = -n and B = n; (b) by parts with u = x: the uv part, the integral left, then (1/k)xe^{kx} - (1/k^2)e^{kx} + c; (c) the integrating factor as e to the integral of the coefficient of y, the minus kept; (a) put in it; simplified by log laws to (x + b)^n/x^n; the integral equation, whose right side is (b)\'s; then y. Doing the same to both factors in (b) loses it.',
    ranges: 'The paper: -2/(x(x + 1)), the integral of xe^{3x}, and y\' - 2y/(x(x + 1)) = x^3 e^{3x}/(x + 1)^2. The power n of the integrating factor from 1 to 3 (the paper\'s 2), the number b in x + b from 1 (the paper) to 3, and k in e^{kx} from 2 to 6 (the paper\'s 3). The fraction in (a) is -nb/(x(x + b)), so the partial fractions are -n/x + n/(x + b), whole, as the paper\'s; the right side x^{n+1}e^{kx}/(x + b)^n is what the integrating factor (x + b)^n/x^n turns into (b)\'s xe^{kx}, as the paper\'s. 45 questions.',
  },
  {
    card: '2023 P1 Q2',
    skill: 'Express a quadratic over a linear factor and a repeated linear factor in partial fractions.',
    marks: [3],
    route: 'The template, A/(x - a) + B/(x - b) + C/(x - b)^2; the identity formed and one constant found; the other two found (the x^2 terms compared for B) and the partial fractions written. Without both fractions for the repeated factor nothing counts.',
    ranges: 'The paper: (3x^2 - x - 14)/((x + 3)(x - 1)^2) = 1/(x + 3) + 2/(x - 1) - 3/(x - 1)^2. Built from the answer: two different factors x - r, r from ±1 to ±6 (never x alone, as the paper has none), the single one first and the repeated one second, as the paper\'s; the three constants whole from ±1 to ±5, never 0, as 1, 2 and -3. Kept: the top a quadratic with all three terms, its x^2 term positive, as the paper\'s 3x^2, each within 40. All exact: Paper 1.',
  },
  {
    card: '2022 P2 Q1',
    skill: 'Express a quadratic over x times an irreducible quadratic in partial fractions.',
    marks: [3],
    route: 'The template, A/x + (Bx + C)/(x^2 + m); the identity formed and one constant found; the other two found (x = 0 for A, then the x^2 and x terms compared) and the partial fractions written. A constant alone over x^2 + m is the wrong template, and nothing else counts.',
    ranges: 'The paper: (3x^2 - 3x + 5)/(x(x^2 + 5)) = 1/x + (2x - 3)/(x^2 + 5). Built from the answer: A, B and C whole from ±1 to ±5, never 0 (the paper\'s 1, 2 and -3), and x^2 + m with m from 1 to 9 (the paper\'s 5), which never factorises. Always x alone as the linear factor, as the paper\'s. Kept: the top a quadratic with all three terms, its x^2 term A + B positive, as the paper\'s 3x^2, each within 40.',
  },
  {
    card: '2019 Q4',
    skill: 'Divide a quadratic by a quadratic into p + (qx + r)/(…), then hence partial fractions.',
    marks: [1, 3],
    route: '1 + 3 - (a) the algebraic division done and written in the form, p + (qx + r)/(x^2 + bx + c); (b) the denominator factorised and the template A/(x - r1) + B/(x - r2); the identity qx + r = A(x - r2) + B(x - r1) and one constant; the other constant and the whole expression, with the p from (a) kept.',
    ranges: 'The paper: (3x^2 + x - 17)/(x^2 - x - 12) = 3 + (4x + 19)/(x^2 - x - 12) = 3 - 1/(x + 3) + 5/(x - 4). Built from the answer: p from 2 to 5 (the paper\'s 3), two different roots from ±1 to ±6 whose sum is not 0, so the bottom keeps its x term as x^2 - x - 12 does, the smaller root\'s factor first as the paper\'s; A and B whole from ±1 to ±6, never 0 (the paper\'s -1 and 5). Kept: q positive and r never 0 (the paper\'s 4 and 19), so the remainder never opens with a minus, and every term on top, within 40, as 3x^2 + x - 17.',
  },
  {
    card: '2018 Q2',
    skill: 'Integrate (px + c)/((x + m)(x - n)) by partial fractions.',
    marks: [4],
    route: 'The template A/(x + m) + B/(x - n); the identity and one constant; the other, and the integral as two fractions; the logs, with + c, or the last mark goes.',
    ranges: 'The paper: (3x - 7)/(x^2 - 2x - 15) = 2/(x + 3) + 1/(x - 5). Built from the answer: A and B from 1 to 4 (the paper\'s 2 and 1); the factors x + m and x - n with m from 1 to 6 and n from 1 to 7 (the paper\'s 3 and 5), m ≠ n so the denominator has an x term, as the paper\'s -2x; the top\'s constant never 0, as the paper\'s -7.',
  },
  {
    card: '2016 Q13',
    skill: 'Partial fractions for a linear top over (x + p)(q - x), then the definite integral between whole limits as one logarithm.',
    marks: [9],
    route: 'The template A/(x + p) + B/(q - x); the identity; one constant; the other; the integral as two fractions; A ln|x + p|; -B ln|q - x|, the minus from -x; the limits substituted; then one logarithm, ln(P/Q), by the log laws.',
    ranges: 'The paper: (3x + 32)/((x + 4)(6 - x)) = 2/(x + 4) + 5/(6 - x), from 3 to 4, ln(486/49). Built from the answer: A from 1 to 4 and B from 2 to 5 (the paper\'s 2 and 5), B more than A, so the top\'s x term is positive, as the paper\'s 3x; p from 1 to 6 and q from 3 to 9 (the paper\'s 4 and 6); the top sharing no factor, as 3x + 32. The limits L and L + 1 with L from 0 to q - 2 (the paper\'s 3 and 4), inside the factors\' roots, so both logs are of positive numbers, as the paper\'s; the fraction in lowest terms, not whole and within 10 000 each way, as 486/49. A near relation of 2018 Q2 (locked), an indefinite integral over (x + m)(x - n).',
  },
];
