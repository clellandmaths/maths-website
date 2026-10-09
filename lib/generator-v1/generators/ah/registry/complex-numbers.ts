/**
 * Advanced Higher, Complex Numbers: what each card is.
 * The routines are in `../routines/complex-numbers.ts`, under the same labels.
 */
import type { CardMeta } from '../types';

export const COMPLEX: readonly CardMeta[] = [
  {
    card: '2021 P2 Q13',
    skill: 'Solve $z^{5} \\pm a^{5} = 0$ in polar form from an Argand diagram of two roots, by de Moivre\'s theorem, and use the roots\' sum to find a sum of cosines.',
    marks: [1, 1, 1, 2, 2],
    route: '1 + 1 + 1 + 2 + 2 - (a) -1 as cos π + i sin π; (b) z1 to the power n by de Moivre, giving -1, so a root; (c) z2 in polar form, the next root round; (d) any one more root, then all the rest, each with -π < θ ≤ π; (e) the real part of the sum equated to zero, with cos(-θ) = cos θ and cos π = -1, leading to the sum of cosines.',
    ranges: 'The paper: z^5 + 1 = 0, z1 at π/5, z2 at 3π/5, the rest -π/5, -3π/5 and π, and cos π/5 + cos 3π/5 = 1/2. Its steps need n odd (a real root at -1, or 1, and the others in conjugate pairs, so the real parts pair up) and the equation\'s right side ±1: z^5 + 1 (the paper), z^5 - 1 (1 = cos 0 + i sin 0; z1 at 2π/5; cos 2π/5 + cos 4π/5 = -1/2). z2 always the next root anticlockwise from z1, as the paper\'s. z^7 ± 1 was built and taken out on the owner\'s word: five roots in (d) and three cosines in (e), more working than the paper for the same marks; z^3 leaves one root for (d) and nothing to show in (e). And 1 replaced by a^n, a = 1 (the paper), 2 or 3 (the owner on the 2021 P2 sheet: "Any way to vary with +1 with other numbers?", then "a = 1, 2, 3"): z^5 ± 32 and z^5 ± 243, every root of modulus a, the forms r(cos θ + i sin θ), and in (e) the a divided out, so the cosine sum is the paper\'s. The Argand diagram drawn as the paper\'s: the axes, z1 joined to the origin, z2 dashed, no numbers. 6 questions, exempt at 6 on the owner\'s word (below).',
    exempt: {
      why: 'Only n = 5 keeps the paper\'s size: n = 3 leaves (d) one root and (e) nothing to show, and n = 7 asks five roots and three cosines for the same marks. z^5 ± a^5 with a = 1, 2, 3 makes 6.',
      owner: 'The owner, 2026-10-03, asked "is the complex number question too long now by going up to z7?", then to "z⁵ only (6 questions) or keep z⁷ (12)?": "6 only"',
    },
  },
  {
    card: '2022 P2 Q7',
    skill: 'A complex root of a real quadratic: its conjugate, the quadratic\'s constant, then a cubic it divides.',
    marks: [1, 2, 1],
    route: '1 + 2 + 1 - (a) the conjugate, since the coefficients are real; (b) the product of the two linear factors, then multiplied out for a; (c) the other factor from the z^2 terms, so b. A value with no working in (c) earns nothing.',
    ranges: 'The paper: z = 3 + i a root of z^2 - 6z + a = 0, a = 10; a factor of z^3 - z^2 - 20z + b, b = 50 (the other factor z + 5). The root p + qi with p from 1 to 6 and q from 1 to 4 (the paper\'s 3 and 1), both positive, as the paper\'s; the other factor z + m with m from ±1 to ±6 (the paper\'s 5), so b = am. Kept: the cubic\'s z^2 and z terms never 0, so it prints every term, as the paper\'s.',
  },
  {
    card: '2022 P2 Q12',
    skill: 'De Moivre and the binomial expansion of $(\\cos\\theta + i\\sin\\theta)^{n}$, compared for $\\cos n\\theta$, then $\\sin\\theta\\cot n\\theta$ in $\\cos\\theta$ alone.',
    marks: [1, 3, 2, 2],
    route: '1 + 3 + 2 + 2 - (a) cos nθ + i sin nθ; (b) the binomial expansion with its coefficients, three terms with i simplified, then all; (c)(i) the real parts equated, then sin^2 θ = 1 - cos^2 θ to the given polynomial; (c)(ii) cot nθ as the real part over the imaginary, then the sin θ taken out of the imaginary part so sin θ cot nθ is in cos θ only.',
    ranges: 'The paper: n = 4, cos 4θ = 8cos^4 θ - 8cos^2 θ + 1, sin θ cot 4θ = (8cos^4 θ - 8cos^2 θ + 1)/(8cos^3 θ - 4cos θ). Nothing numerical to vary but n: the paper\'s 4, and 3 and 5, the same steps (4 and 6 terms in the expansion in place of 5). n = 6 would be 7 terms. Always cos nθ in (c)(i) and sin θ cot nθ in (c)(ii): sin nθ and cos θ tan nθ would be a different function, and so a different card. 3 questions, exempt at 3 on the owner\'s word (below).',
    exempt: {
      why: 'A show-that whose only number is the power: n = 3, 4 (the paper) and 5 keep the paper\'s steps. cos θ - i sin θ was offered and declined: the formula list states de Moivre\'s theorem only for cos θ + i sin θ.',
      owner: 'The owner on the 2022 P2 sheet, 2026-10-01: "Keep it positive as de moiver theorem on formula list doesn\'t mention negative. Exempt at 3"',
    },
  },
  {
    card: '2022 P1 Q3',
    skill: 'Multiply one complex number by the conjugate of another, giving $a + ib.$',
    marks: [2],
    route: 'The conjugate of z2; then the product with z1 multiplied out, i^2 = -1, to a + ib. The bar is on z2 only.',
    ranges: 'The paper: z1 = 5 + 3i, z2 = 6 + 2i, giving 36 + 8i. Every part a whole number from 1 to 9, positive as the paper\'s, so the answer\'s real part is positive and whole; its imaginary part, bc - ad, never 0, so the answer always has both parts, as 36 + 8i. All exact: Paper 1.',
  },
  {
    card: '2026 P1 Q3',
    skill: 'Write a complex number in polar form, then show a power of it is purely imaginary by de Moivre.',
    marks: [2, 2],
    route: '2 + 2 - (a) the modulus or the argument, then the polar form; (b) de Moivre\'s theorem applied (the modulus cubed, the argument tripled), then evaluated to a purely imaginary number. Multiplying out the cube instead earns nothing in (b).',
    ranges: 'The paper: z = √3 + i, modulus 2, argument π/6, z³ = 8i. "Purely imaginary" after cubing needs an argument of ±π/6 or ±5π/6, so z = ±a√3 ± ai with a from 1 to 4: modulus 2a, a whole number as the paper\'s, and z³ = ±8a³i. All four quadrants, the paper\'s first among them, so the card makes 16 questions; the paper\'s quadrant alone would make 4 (for the owner, on the sheet). The argument is the principal one, in (-π, π].',
  },
  {
    card: '2026 P1 Q7',
    skill: 'From one complex root of a real quartic, find the conjugate root, then the remaining two.',
    marks: [1, 5],
    route: '1 + 5 - (a) the conjugate, since the coefficients are real; (b) the two linear factors, multiplied into one quadratic, then algebraic division begun and finished to give the second quadratic factor, then its two roots by the formula. A second factor that does not divide exactly loses its mark.',
    ranges: 'The paper: root 2 + i of z^4 - 2z^3 - z^2 + 2z + 10 = 0, remaining roots -1 ± i. Built from the answer: (z² - 2pz + p² + q²)(z² - 2mz + m² + n²) with the given root p + qi (p from ±1 to ±3, q from 1 to 3) and the remaining m ± ni (m from ±1 to ±3, n from 1 to 3), the two pairs different. Kept: every coefficient of the quartic non-zero, as the paper\'s, and within 60. The remaining roots are complex, as the paper\'s: its second quadratic has no real roots.',
  },
  {
    card: '2025 P1 Q3',
    skill: 'Divide one complex number by another, giving $a + bi.$',
    marks: [2],
    route: 'Multiply the numerator and the denominator by the conjugate of w; then multiply out, with i^2 = -1, to a + bi. Multiplying only one of them earns nothing.',
    ranges: 'The paper: z = 11 + 10i, w = 3 - 2i, z/w = 1 + 4i. Built from the answer: z/w = p + qi with p and q whole from ±1 to ±5, never 0, so the answer is whole as the paper\'s; w = r + si with r from 1 to 4 and s from ±1 to ±4, never 1 ± i; z = (p + qi)w, both its parts non-zero and within 30, as 11 and 10 are. All exact: Paper 1.',
  },
  {
    card: '2025 P2 Q18',
    skill: 'An expression in $z$ and its conjugate in Cartesian form and its argument; then both square roots by de Moivre.',
    marks: [2, 1, 2],
    route: '2 + 1 + 2 - (a)(i) the conjugate x - iy, then the expression with its real and imaginary parts grouped; (a)(ii) the argument from the signs of the equal parts; (b) one square root, the root of the modulus and half the argument, then the second, half a turn on, both in the principal range.',
    ranges: 'The paper: z̄ + iz = (x - y) + i(x - y), argument π/4 when x > y; given -3π/4 when x < y, roots at -3π/8 and 5π/8. Nothing numerical varies: the expression is always a multiple of 1 ± i. What can vary honestly is which of z̄ + iz (the paper), z̄ - iz, z + iz̄ or z - iz̄, and which side of its line (a)(ii) asks about, (b) then giving the other: 8 questions, under the floor of 12, so exempt on the owner\'s word. A coefficient on one term makes the parts unequal and the argument depend on x and y; one on the whole expression only scales the modulus.',
    exempt: {
      why: 'Nothing numerical varies: the expression is always a multiple of 1 ± i. The four expressions, each asked on either side of its line, make 8 questions, and a coefficient either breaks the question or changes nothing.',
      owner: 'The owner, 2026-09-29, after asking on the 2025 P2 sheet "What would adding a coefficient to either i or x do?": "Ok we are just keep all 8 for 18 then lock"',
    },
  },
  {
    card: '2024 P1 Q2',
    skill: 'Write a complex number in polar form, then evaluate a power of it by de Moivre.',
    marks: [2, 2],
    route: '2 + 2 - (a) the modulus or the argument, then the polar form; (b) de Moivre\'s theorem applied to the argument (the modulus to the power n, the argument times n), then evaluated to a single number. The argument simplified before it is evaluated.',
    ranges: 'The paper: z = 1 + i, modulus √2, argument π/4, z^8 = 16. z = ±a ± ai in any quadrant, the paper\'s first among them, so the argument is an odd multiple of π/4 and an even power lands on an axis: z^n is a single number, real or imaginary, as 16 is. a = 1 with n 4, 6 or 8 (the paper\'s), or a = 2 with n = 4, so |z^n| is at most 64 and works without a calculator. 16 questions. The argument is the principal one, in (-π, π]. Near the 2026 P1 Q3 card (√3 + i, cubed to show it is purely imaginary).',
  },
  {
    card: '2024 P2 Q12',
    skill: 'Solve an equation in $z$ and its conjugate by equating real and imaginary parts.',
    marks: [5],
    route: 'z-bar = x - iy; both substituted into the equation; the real or the imaginary parts equated; the imaginary part solved for x, dividing by y as y is not 0; the real part then gives y, and both solutions z = x0 ± y0 i.',
    ranges: 'The paper: z^2 + 20 z-bar - 156 = 0, giving x = 10 and z = 10 ± 12i. Built from the roots x0 ± y0 i: the coefficient of z-bar is 2x0 and the constant y0^2 - 3x0^2, so both are whole, as 20 and -156; x0 from ±1 to ±12 (either sign) and y0 from 1 to 15, the constant never 0 and at most 400 in size. Always z^2 with coefficient 1 and z-bar, as the paper\'s.',
  },
  {
    card: '2023 P1 Q6',
    skill: 'Write a complex number in polar form, then show its cube is real by de Moivre.',
    marks: [2, 2],
    route: '2 + 2 - (a) the modulus or the argument, then the polar form; (b) de Moivre\'s theorem applied (the modulus cubed, the argument tripled), then evaluated to show the imaginary part is zero. Working in degrees needs the degree symbol at least once.',
    ranges: 'The paper: z = 1 + √3 i, modulus 2, argument π/3, z³ = -8. "Real" after cubing needs an argument of ±π/3 or ±2π/3, so z = ±a ± a√3 i with a from 1 to 4: modulus 2a, a whole number as the paper\'s, and z³ = ±8a³. All four quadrants, the paper\'s first among them, as the owner kept on 2026 P1 Q3 (√3 + i cubed, purely imaginary), its near twin: 16 questions. The argument is the principal one, in (-π, π]. All exact: Paper 1.',
  },
  {
    card: '2023 P2 Q14',
    skill: 'Find a complex square root, $a + ib$ with $a$ and $b$ positive, by equating real and imaginary parts and solving a quartic.',
    marks: [4],
    route: '(a + ib)^2 expanded with i^2 = -1, a^2 - b^2 + 2abi; the real and imaginary parts equated; b replaced in the real equation, a^2 - (ab)^2/a^2 = p; the quartic in standard form, solved as a quadratic in a^2, and a and b kept positive. Trial and error earns nothing.',
    ranges: 'The paper: w^2 = 8 + 6i, a = 3, b = 1. Built from the answer: a and b whole numbers from 1 to 6, never equal, so w^2 has a real part (either sign: a < b gives a negative real part, a sign, not a step), and the quartic factorises as (a^2 - A^2)(a^2 + B^2), as the paper\'s (a^2 - 9)(a^2 + 1). 30 questions.',
  },
  {
    card: '2019 Q18',
    skill: 'A complex number from an Argand diagram in Cartesian and polar form, then its cube roots by de Moivre, one in a given form.',
    marks: [1, 3, 4, 2],
    route: '1 + 3 + 4 + 2 - (a)(i) w in Cartesian form from the diagram; (a)(ii) the modulus, 2a, the argument with its quadrant checked, then the polar form; (b)(i) de Moivre begun, the modulus and the bracket to the power 1/3, then the argument divided by 3, then k and then m read off the given form; (b)(ii) 2π/3 added and taken away, then the other two roots with arguments in the principal range.',
    ranges: 'The paper: w = a - a√3 i, 2a(cos(-π/3) + i sin(-π/3)); a = 4, k = 2, m = -9; the roots 2(cos 5π/9 + i sin 5π/9) and 2(cos(-7π/9) + i sin(-7π/9)). The given form z1 = k(cos π/m + i sin π/m) needs a third of arg w to be π over a whole number, so arg w is ±π/3 (the paper\'s -π/3, w = a ± a√3 i) or ±π/6 (w = a√3 ± ai), always modulus 2a and the parts labelled in a as the paper\'s; ±2π/3 and ±5π/6 would not give the form. 2a a whole cube, so k is whole: a = 4 (the paper, k = 2) or 32 (k = 4). 8 questions, exempt at 8 on the owner\'s word.',
    exempt: {
      why: 'The given form needs arg w to be ±π/3 or ±π/6, and a whole k needs 2a a cube (a = 4 or 32): 8 questions, and nothing else honest to vary.',
      owner: 'On the 2019 sheet, 2026-10-03, to "Exempt at 8?": "Yes".',
    },
  },
  {
    card: '2018 Q4',
    skill: '$z_{1}$ times the conjugate of $z_{2}$, where $z_{2} = p - ci$, then the $p$ that makes it real.',
    marks: [2, 1],
    route: '2 + 1 - (a) the conjugate, p + ci; then the product expanded with i^2 = -1 and grouped, (ap - bc) + (bp + ac)i; (b) the imaginary part zero, p = -ac/b.',
    ranges: 'The paper: z1 = 2 + 3i, z2 = p - 6i, answers (2p - 18) + (3p + 12)i and p = -4. z1 = a + bi with a from -6 to 6, never 0 (the paper\'s 2), and b from 2 to 6 (the paper\'s 3); z2 = p - ci with c from 1 to 9 (the paper\'s 6); b divides ac, so p is whole, as the paper\'s, and at most 12 in size. z2 is always p - ci, as the paper\'s.',
  },
  {
    card: '2018 Q10',
    skill: 'The locus $|z| = |z - (p + qi)|$: a straight line, sketched.',
    marks: [3],
    route: 'z = x + iy substituted and the real and imaginary parts grouped inside each modulus; squared and simplified to a straight line, 2px + 2qy = p^2 + q^2; the sketch, a line through its axis crossings. The sketch is in the marking instructions only, as 2021 P1 Q7\'s, never under Show answer.',
    ranges: 'The paper: |z| = |z - 2 + 2i|, the line y = x - 2. p and q from -4 to 4, never 0 (the paper\'s 2 and -2), so the line is never parallel to an axis, as the paper\'s. The paper\'s gradient is 1 and its crossings whole; here the gradient is -p/q and the crossings (p^2 + q^2)/(2p) and (p^2 + q^2)/(2q), whole only when p and q are the same size (16 of the 64). 64 questions.',
  },
  {
    card: '2017 Q17',
    skill: 'From one complex root of a real quartic with an unknown constant $q$: the conjugate root, $q$ and the remaining roots, then all four on an Argand diagram.',
    marks: [1, 6, 1],
    route: '1 + 6 + 1 - (a) the conjugate, since the coefficients are real; (b) the two linear factors; their product, a quadratic; the division of the quartic by it set up; completed, quotient and the remainder q - st; q = st; the second quadratic\'s roots by the formula; (c) all four roots in their correct relative positions. The diagram is in the marking instructions only, as 2021 P1 Q7\'s, never under Show answer.',
    ranges: 'The paper: root 2 + i of z^4 - 6z^3 + 16z^2 - 22z + q = 0, q = 15, the remaining roots 1 ± √2 i. Built from the answer: the given root p + ri (p from ±1 to ±3, r from 1 to 3, the paper\'s 2 + i) and the remaining m ± √w i (m from ±1 to ±3, the paper\'s 1, w one of 2, 3, 5, 6, 7, not a square, as the paper\'s √2), m and p different so the pairs stand apart on the diagram, as the paper\'s. Kept: every coefficient of the quartic but q nonzero and within 60, as -6, 16 and -22. A near relation of 2026 P1 Q7 (locked), which gives the constant and asks for no diagram.',
  },
  {
    card: '2016 Q8',
    skill: 'Plot a complex number of modulus 2 on an Argand diagram, write a real multiple of it in polar form, then a power of that in the form $ka^{n}(x + i\\sqrt{y})$ by de Moivre.',
    marks: [1, 2, 3],
    route: '1 + 2 + 3 - (a) the point in its quadrant with its parts marked on the axes; (b) |w| = 2a or arg w; the polar form, 2a(cos θ + i sin θ); (c) the modulus to the power, 2^n a^n; the argument times n, left as nkπ/6; then cos and sin evaluated, k a^n(x + i√3). The diagram is in the marking instructions only, as 2017 Q17\'s, never under Show answer.',
    ranges: 'The paper: z = √3 - i, w = 2a(cos(-π/6) + i sin(-π/6)), w^8 = 128a^8(-1 + i√3). z any of the eight numbers ±√3 ± i and ±1 ± √3i, modulus 2 and an argument a multiple of π/6, as the paper\'s; the power from 4 to 10 (the paper\'s 8) where n times the argument is an odd multiple of π/3, so cos and sin are ±1/2 and ±√3/2, both parts nonzero and w^n in the form asked, with k = ±2^{n-1} carrying the sign of the √3. a stays a letter, as the paper\'s. 32 questions.',
  },
];
