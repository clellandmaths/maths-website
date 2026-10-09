/**
 * Advanced Higher, Maclaurin Series: what each card is.
 * The routines are in `../routines/maclaurin-series.ts`, under the same labels.
 */
import type { CardMeta } from '../types';

export const MACLAURIN: readonly CardMeta[] = [
  {
    card: '2022 P1 Q5',
    skill: 'Maclaurin series of $e^{-kx}$ to $x^{3}$ from its derivatives, then hence of a linear expression over $e^{kx}.$',
    marks: [2, 2],
    route: '2 + 2 - (a) all three derivatives and all four values at 0, stated or implied, then the simplified series; (b) the quotient written as the product (p + qx)e^{-kx}, then multiplied out to its first four terms. p + qx is a polynomial already and is not expanded as a series.',
    ranges: 'The paper: e^{-4x}, then (3 + 2x)/e^{4x}, giving 1 - 4x + 8x^2 - (32/3)x^3 and 3 - 10x + 16x^2 - 16x^3. k from 2 to 4 (the paper\'s 4), always e^{-kx} so (b) is a division by e^{kx} as the paper\'s; p from 1 to 5 and q from -5 to 5, never 0, sharing no factor (the paper\'s 3 and 2), and none of (b)\'s first four terms 0, as the paper\'s. No product worked by hand bigger than the paper\'s (the owner on 2023 P1, "biggest should be no larger than paper"): k^3 at most 64, and p times k^3/6 and q times k^2/2 at most 32, as 3 x 32/3; so with k = 4, p is at most 3 and q at most 4. A negative q is a sign, not a step. All exact: Paper 1.',
  },
  {
    card: '2026 P2 Q3',
    skill: 'Maclaurin series of an exponential and of $\\ln(1 + x)$ to $x^{3}$, then of their product with a log law.',
    marks: [2, 2, 2],
    route: '2 + 2 + 2 - (a)(i) three derivatives of e^{kx} and all four values at 0, then the simplified series; (a)(ii) the same for ln(1 + x); (b) ln(1/(1 + x)) as minus ln(1 + x), written as the product of the two series, then multiplied out and kept to x^3. A third series started from scratch in (b) is not "hence".',
    ranges: 'The paper: e^{3x} and ln(1/(1 + x)). k from 2 to 12, positive or negative, 22 questions (the owner, 2026-09-29: negative "is fine", and bigger numbers, k to ±12, "Yes"). e^{12x} is 1 + 12x + 72x^2 + 288x^3, still workable on a calculator; past 12 the coefficients grow with nothing new to do. ln(1 + x) and ln(1/(1 + x)) are the paper\'s own: a coefficient inside the log adds a chain factor to every derivative, a step the paper does not have. No coefficient of the answer is ever zero (the x^2 one is 1/2 - k, the x^3 one never vanishes for whole k).',
  },
  {
    card: '2025 P2 Q6',
    skill: 'Maclaurin series of $\\cos kx$ to $x^{4}$ from its derivatives, then hence of $\\cos^{2} kx.$',
    marks: [2, 2],
    route: '2 + 2 - (a) all four derivatives and all five values at 0, then the simplified series; (b) the product of two copies of (a)\'s series, then multiplied out and kept to x^4. Writing (cos kx)^2 and stopping does not earn the product mark.',
    ranges: 'The paper: cos 3x, then cos^2 3x = 1 - 9x^2 + 27x^4. Always the cosine (a different function is a different card). k whole from 2 to 12, or a unit fraction, cos (1/2)x to cos (1/5)x, as the owner took for 2026 P2 Q2 and 2025 P1 Q1: the paper\'s whole k alone makes 11 questions, below the floor. The squared series is 1 - k^2 x^2 + (k^4/3) x^4. 15 questions.',
  },
  {
    card: '2024 P2 Q7',
    skill: 'Maclaurin series of $e^{ax}$ and $\\sin bx$ to $x^{3}$, then hence of $e^{a\\sin bx}$ by composing them.',
    marks: [2, 2, 2],
    route: '2 + 2 + 2 - (a)(i) three derivatives of e^{ax} and all four values at 0, then the simplified series; (a)(ii) the same for sin bx; (b) the sine\'s series put in place of x in the exponential\'s, then expanded and kept to x^3. Multiplying the two series (a product, not a composition) earns nothing in (b).',
    ranges: 'The paper: e^{2x} and sin 3x, then e^{2 sin 3x} = 1 + 6x + 18x^2 + 27x^3. a from 2 to 5, positive or negative (a sign, as the owner took for 2026 P2 Q3\'s e^{kx}); b from 2 to 5 (the paper\'s 3), positive: sin(-bx) is -sin bx, a minus the paper would write outside. Always e and sin: a different function is a different card. The x^3 coefficient, ab^3(a^2 - 1)/6, is never 0 for these a. 32 questions.',
  },
  {
    card: '2023 P2 Q15',
    skill: 'A Maclaurin expansion to $x^{2}$ from a given $f\'(x)$ and first term, then its integral by a given substitution, then $f(x)$ itself.',
    marks: [3, 3, 2],
    route: '3 + 3 + 2 - (a) the quotient rule on f\'(x), begun with the denominator and one term of the numerator, then complete; the values at 0 and the expansion, starting from the given first term; (b) du/dx; the integral in u, (a/2) times the integral of 1/(1 + u^2); the inverse tangent with u replaced; (c) f(0) from the first term; the constant, so f(x). Differentiating twice (f\'(x) is given) is the slip the scheme names.',
    ranges: 'The paper: f\'(x) = (x + 1)/(1 + (x + 1)^4) and first term 1, giving 1 + x/2 - x^2/4, (1/2) tan^{-1}((x + 1)^2) + c and f(x) = (1/2) tan^{-1}((x + 1)^2) + 1 - pi/8. The bracket x + 1 (the paper) or x - 1: only with 1 are (x ± 1)^4 at 0 and tan^{-1} of (±1)^2 the paper\'s 1 and pi/4, so every value stays exact, as the paper\'s; a number on top from 1 (the paper) to 3, a number, not a step (the owner kept a numerator of 2 or 3 on 2025 P1 Q5); the first term from 1 (the paper) to 5. 30 questions.',
  },
  {
    card: '2018 Q17',
    skill: 'Maclaurin series of $e^{kx}$ and of $\\tan x$ (its third derivative shown), their product, then the derivative of the product written down.',
    marks: [2, 3, 2, 2, 1],
    route: '2 + 3 + 2 + 2 + 1 - (a) the derivatives and their values at 0, then the series; (b)(i) g\'\'(x) = 2 sec x sec x tan x, the product rule begun, then completed to the given form; (b)(ii) all four values at 0, then x + x^3/3; (c) the two series multiplied, then simplified to x^3; (d) the expression is the derivative of (c)\'s, so its first three non-zero terms are (c) differentiated.',
    ranges: 'The paper: e^{2x}, e^{2x} tan x = x + 2x^2 + (7/3)x^3, and 1 + 4x + 7x^2. k from -9 to 9, never 0 or ±1 (the paper\'s 2), as 2026 P2 Q3\'s e^{kx} (which the owner widened to ±12); (b) is the paper\'s, fixed, since it is a show-that about tan x. 16 questions.',
  },
  {
    card: '2016 Q6',
    skill: 'Maclaurin series of $\\sin ax$ and $e^{bx}$ to $x^{3}$ from their derivatives, then hence of their product.',
    marks: [6],
    route: 'For sin ax, the derivatives and their values at 0 with the formula; the values substituted, ax - (a^3/3!)x^3; the same for e^{bx}, 1 + bx + (b^2/2)x^2 + (b^3/6)x^3; the two series multiplied; then kept to x^3 and simplified, ax + abx^2 + (ab^2/2 - a^3/6)x^3. Terms past x^3 are left out.',
    ranges: 'The paper: sin 3x and e^{4x}, product 3x + 12x^2 + (39/2)x^3. a and b from 2 to 6 (the paper\'s 3 and 4); the x^3 term of the product, ab^2/2 - a^3/6, is never 0. Always a sine and an exponential multiplied, as the paper: a cosine would be another series. A near relation of 2024 P2 Q7 (locked), e^{ax} and sin bx composed rather than multiplied, and of 2018 Q17\'s product with tan x. 25 questions.',
  },
];
