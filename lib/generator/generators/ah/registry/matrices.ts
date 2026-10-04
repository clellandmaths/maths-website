/**
 * Advanced Higher, Matrices: what each card is.
 * The routines are in `../routines/matrices.ts`, under the same labels.
 */
import type { CardMeta } from '../types';

export const MATRICES: readonly CardMeta[] = [
  {
    card: '2021 P2 Q5',
    skill: 'From A^2 = pA + qI, express A^4 and the inverse of A in terms of A and I.',
    marks: [2, 2],
    route: '2 + 2 - (a) A^4 as (A^2)^2 expanded in powers of A of two and less, then A^2 replaced and collected, (p^3 + 2pq)A + (p^2q + q^2)I; (b) the identity multiplied by A^{-1}, or A(A - pI) = qI, then A^{-1} = (1/q)A - (p/q)I. A matrix cannot be divided by.',
    ranges: 'The paper: A^2 = 2A + 5I, A^4 = 28A + 45I, A^{-1} = (1/5)A - (2/5)I. p from -5 to 5, never 0 (the paper\'s 2), q from 2 to 9 either sign (the paper\'s 5), never ±1, so the inverse has fractions, as the paper\'s r, s in Q; both coefficients of A^4 never 0, as 28 and 45. A near relation of 2025 P2 Q8 (locked), which builds A^3 and the inverse from the same identity: its own routine. (Named 2025 P1 Q4 until 2026-10-03, a slip, corrected on the owner\'s "Yes fix the note".)',
  },
  {
    card: '2021 P1 Q2',
    skill: 'Transpose a 3 by 2 matrix and multiply a 2 by 2 matrix by it, then find the 2 by 2 matrix\'s inverse.',
    marks: [2, 2],
    route: '2 + 2 - (a) B\' stated, the rows of B as its columns; then AB\', a 2 by 3 matrix; (b) det A = ad - bc; then A^{-1}, the diagonal swapped and the others negated over the determinant. AB itself cannot be multiplied, which the scheme\'s first mark is for.',
    ranges: 'The paper: A = (-2 4; -3 7), det A = -2, B = (4 0; 2 3; -2 1), AB\' = (-8 8 8; -12 15 13), A^{-1} = (1/2)(-7 4; -3 2). A built from its determinant: from 2 to 5 either sign (the paper\'s -2), entries whole from -7 to 7 (the paper\'s) and never 0, sharing no factor with the determinant, so 1/|det A| stays in front. The inverse is written as the paper writes it: 1/|det A| in front, the sign taken into the matrix. B\'s entries from -5 to 5, at most one 0, as the paper\'s; AB\' has no 0 and every entry within 30, as the paper\'s are within 15; no product worked by hand, in AB\' or the determinant, bigger than the paper\'s biggest, 7 × 3 = 21 (the owner on 2023 P1: "biggest should be no larger than paper"). All exact: Paper 1.',
  },
  {
    card: '2022 P2 Q5',
    skill: 'Find the values of k that make a 3 by 3 matrix with k in two entries singular.',
    marks: [3],
    route: 'The determinant expanded along a row or a column; simplified to a quadratic in k, -k^2 + ...; set equal to 0 and solved for both values. Without "= 0" the last mark goes.',
    ranges: 'The paper: A = (1 3 1; 2 k 3; k 18 -7), det A = -k^2 + 2k + 24, k = 6 and -4. The shape kept: 1s at the ends of the first row, k in the middle and at the bottom left, as the paper\'s. Built from the answer: two different whole values of k from -8 to 8, never 0 and never summing to 0 (so the quadratic keeps its k term, as 2k); the other entries b from 1 to 4, d from 1 to 4 and e from 1 to 5 (the paper\'s 3, 2, 3), e never d; g and f then follow from the two values, kept whole, non-zero and within the paper\'s sizes (g to 9, f to 20; the paper\'s -7 and 18).',
  },
  {
    card: '2026 P1 Q5',
    skill: 'A determinant in terms of x, a determinant from a product, and a matrix from its inverse.',
    marks: [1, 1, 2],
    route: '1 + 1 + 2 - (a) the determinant ad - bc as an expression in x; (b) det AB = det A det B, so det B is the factor; (c) B^{-1} rewritten as 1/det B times the adjugate of B, then B stated. A matrix cannot be divided by, so B comes from inverting B^{-1}.',
    ranges: 'The paper: A = (3 5; -2 x), det AB = 12x + 40, B^{-1} = (1 -1; -5/4 3/2), B = (6 4; 5 4), det B = 4. A = (p q; r x) with p from 2 to 5 and q, r from ±1 to ±6, p and qr sharing no factor so det A is as plain as 3x + 10. B has whole entries from 1 to 9, all positive as the paper\'s, and det B from 2 to 6; its inverse is printed in lowest terms and has at least one fraction in it, as the paper\'s does, or (c) is only reading it back. All exact: Paper 1.',
  },
  {
    card: '2025 P1 Q4',
    skill: 'A matrix sum, the product of a transpose and a matrix, its determinant in λ, and the λ that makes it singular.',
    marks: [1, 2, 1, 2],
    route: '1 + 2 + 1 + 2 - (a) kA + mB entry by entry; (b)(i) A\' stated (or implied by the product), then A\'B; (b)(ii) the determinant ad - bc of A\'B as an expression in λ; (b)(iii) that expression equated to zero, then λ. Using A for A\' changes every entry of the product.',
    ranges: 'The paper: A = (-3 2; 0 1), B = (2 2; 5 λ), 3A + 2B, λ = 5. A keeps the paper\'s zero below its diagonal, so A\'B\'s top row has no λ, as the paper\'s (-6 -6); its first entry from ±1 to ±4 (the paper\'s -3), the other two positive, to 4 and to 3. B\'s entries positive, as the paper\'s: the first from 1 to 5, the other two from 1 to 6, chosen so the singular λ = b12 b21 / b11 is whole and at most 10, as 5 is. The multiples k and m two different numbers from 2 to 4, as 3 and 2. Kept: no zero in any matrix of the working but the paper\'s own, every entry within 30, and the determinant\'s first factor never 1. All exact: Paper 1.',
  },
  {
    card: '2025 P2 Q8',
    skill: 'From A^2 = pA + qI, express A^3 in the form pA + qI, then A^{-1} in terms of A and I.',
    marks: [2, 2],
    route: '2 + 2 - (a) multiply the identity by A and expand, pA^2 + qAI; then replace A^2 and collect to (p^2 + q)A + pqI; (b) multiply the identity by A^{-1}; then simplify and make A^{-1} the subject. A matrix cannot be divided by.',
    ranges: 'The paper: A^2 = 6A - I, so A^3 = 35A - 6I and A^{-1} = 6I - A. p from ±1 to ±9 and q = -1 (the paper) or +1, never p = ±1 with q = -1 (A^3 would be -I, with no A in it), so A^{-1} is a whole combination of A and I, as 6I - A: a q past ±1 puts a fraction in every coefficient of (b). Any p and q have a matrix that satisfies the identity, and it is non-singular while q is not 0. 34 questions.',
  },
  {
    card: '2024 P1 Q4',
    skill: 'The inverse of a 2 by 2 matrix, then the matrix M with AM = B.',
    marks: [2, 2],
    route: '2 + 2 - (a) the determinant or the adjugate, then A^{-1} as 1/det A times the adjugate; (b) M = A^{-1}B, the inverse on the left, then the product. A matrix cannot be divided by, and BA^{-1} is the wrong side.',
    ranges: 'The paper: A = (6 1; 11 3), det 7, B = (-4 3; -5 2), M = (-1 1; 2 -3). Built from the answer: A with whole entries from 1 to 12, all positive as the paper\'s, det A from 2 to 9 and no factor shared by all four entries and det A, so A^{-1} keeps its 1/det A in front as 1/7 does; M with whole entries from ±1 to ±4, never 0, both signs among them and M non-singular, as the paper\'s; B = AM, every entry non-zero and within 30. All exact: Paper 1.',
  },
  {
    card: '2024 P1 Q6',
    skill: 'The matrix of a transformation, a description of another from its matrix, and the matrix of the first followed by the second.',
    marks: [1, 1, 2],
    route: '1 + 1 + 2 - (a) the matrix; (b) the transformation described, from where B sends (1, 0) and (0, 1); (c) the product in the right order, BA, the transformation done first on the right, then multiplied out.',
    ranges: 'The paper: (a) a reflection in the x-axis, (b) B = (0 1; 1 0), a reflection in y = x, (c) C = BA = (0 -1; 1 0). The card draws two different transformations from the four reflections (in the x-axis, the y-axis, y = x and y = -x) and the three rotations about the origin (90° either way and 180°), never a pair that undoes itself (C would be the identity): 40 questions. The paper\'s reflections alone make 12, at the floor; for the owner on the sheet.',
  },
  {
    card: '2023 P1 Q9',
    skill: 'The matrix of a quarter-turn, its product with a given rotation matrix, the product\'s angle, and the least power that is the identity.',
    marks: [1, 1, 1, 1],
    route: '1 + 1 + 1 + 1 - (a) A stated; (b)(i) AB multiplied out; (b)(ii) alpha from AB matched to the general rotation matrix, in radians (degrees are not accepted); (c) the least n for which n alpha is a whole number of turns.',
    ranges: 'The paper: A a quarter-turn anticlockwise, B the rotation through 7pi/6 (entries -sqrt(3)/2 and -1/2), AB through 5pi/3, n = 6. B a rotation through k pi/6 off the axes, k one of 1, 2, 4, 5, 7 (the paper), 8, 10 or 11, so its entries are halves and sqrt(3)/2 as the paper\'s and AB is never a quarter- or half-turn; n is then 3, 6 or 12. The paper\'s quarter-turn alone makes 8 questions, below the floor, so A is also a quarter-turn clockwise (the same step, the other sign): 16 questions. alpha is given in (0, 2pi), with its negative equivalent beside it past pi, as the paper\'s 5pi/3 (or -pi/3). All exact: Paper 1.',
  },
  {
    card: '2023 P2 Q3',
    skill: 'A 3 by 3 determinant in terms of x, then whether the inverse exists for every value of x.',
    marks: [2, 1],
    route: '2 + 1 - (a) the expansion begun, each entry of a row times its 2 by 2 minor, then simplified, L x^2 + K; (b) the conclusion with its reason: L x^2 + K is never 0, so the inverse always exists, or it is 0 at x = ±sqrt(-K/L), so it does not.',
    ranges: 'The paper: A = (2, 2x, 4; x, -1, 0; 1, 0, -2), det 4x^2 + 8, never 0, so A^{-1} always exists. The paper\'s layout kept: x in the first column\'s middle, a multiple of x in the first row\'s middle, and zeros where the paper has them, so det A = -bf x^2 + d(af - ce). The first row\'s numbers from 2 to 5 either sign, the multiple of x from 2 to 4 either sign, the rest from 1 to 5 either sign, the constant in det A at most 60. Half the draws the determinant is never 0, as the paper\'s; half it is 0 at x = ±sqrt(m), m a whole number up to 30 that is square or has no square factor, so the answer to (b) is not always the same (the owner\'s rule from 2023 P1 Q3, "Make half redundant").',
  },
  {
    card: '2019 Q2',
    skill: 'A 3 by 3 determinant with p in it equal to a given value, so p; a 3 by 3 times a 3 by 2 with q in it; why the product has no inverse.',
    marks: [3, 2, 1],
    route: '3 + 2 + 1 - (a) the expansion begun, each entry of the first row times its 2 by 2 minor, then simplified, Cp + K, then set equal to the given value and solved for p; (b) any two entries of AB simplified, then all six, with the p from (a), column 1 in q and column 2 numbers; (c) AB is not square, and a general statement that only square matrices have inverses: the statement about AB alone is not enough.',
    ranges: 'The paper: A = (2, 1, 4; -3, p, 2; -1, -2, 5) with det 14p + 45 = 3, p = -3; B = (0, 1; q, 3; 4, 0). A\'s other entries from 1 to 5 either sign, never 0 as the paper\'s; p from 1 to 6 either sign (the paper\'s -3); det A = Cp + K with both terms (C and K never 0), the given value never 0 and at most 30 across (the paper\'s 3), K at most 60 (the paper\'s 45). B\'s entries from -3 to 5, zeros allowed as the paper has two, q in the second row\'s first place as the paper; every entry of AB\'s first column has q, since A\'s middle column has no 0.',
  },
  {
    card: '2018 Q7',
    skill: '2C\' - D, then det D in terms of k, and the k for which D has no inverse.',
    marks: [2, 2, 1],
    route: '2 + 2 + 1 - (a) the transpose C\' stated or implied; 2C\' - D entry by entry, k in one entry; (b)(i) det D expanded along the row with the zero, -(k + s) times its minor; simplified, c(k + s); (b)(ii) det D = 0, so k = -s.',
    ranges: 'The paper: C with entries from -2 to 2, D = (1, 1, 2; k + 3, 0, 2; 1, 1, 1), det D = k + 3, k = -3. C\'s entries from -3 to 3, zeros allowed, as the paper\'s; D keeps the paper\'s shape, a 0 in the middle and rows 1 and 3 sharing their first two entries (from 1 to 3), so expanding along row 2 leaves one minor: r and w (the paper\'s 2 and 1) from -3 to 3, never 0 or equal, u (the paper\'s 2) from 1 to 4; det D = c(k + s) with c from -3 to 3, never 0 (the paper\'s 1), and s from -5 to 5, never 0 (the paper\'s 3).',
  },
  {
    card: '2018 Q11',
    skill: 'The matrices of a rotation and a reflection, their product in the right order, and why the product is not a rotation.',
    marks: [1, 1, 2, 1],
    route: '1 + 1 + 2 + 1 - (a) the rotation matrix for θ; (b) the reflection matrix; (c) P = BA, the transformation done first on the right, then multiplied with exact values; (d) P compared with the general rotation matrix: its leading diagonal entries are not equal.',
    ranges: 'The paper: π/3 anticlockwise, then a reflection in the x-axis. θ one of π/6, π/4, π/3, 2π/3, 3π/4, 5π/6 (exact values, cos and sin both nonzero, so P\'s leading diagonal entries are never equal and (d) always has its reason); the mirror the x-axis (the paper), the y-axis, y = x or y = -x. Always anticlockwise and rotation first, as the paper. 24 questions.',
  },
  {
    card: '2017 Q7',
    skill: 'x from a given 2 by 2 determinant, the inverse, the inverse times a transpose with a letter in it, then the z that makes another matrix singular.',
    marks: [1, 1, 2, 2],
    route: '1 + 1 + 2 + 2 - (a)(i) xd - bc = D, so x; (ii) P^{-1}, the diagonal swapped, the others negated, over D; (iii) Q\' stated; P^{-1}Q\' multiplied out, y kept as a letter, divided through where every entry allows it; (b) the condition det R = 0 (or one row a multiple of the other), stated, which the scheme requires; then z.',
    ranges: 'The paper: P = (x 2; -5 -1) with det P = 2, x = 8; Q = (2 -3; 4 y), P^{-1}Q\' = (2, -2 - y; -7, 10 + 4y); R = (5 -2; z -6), z = 15. det P = D from 2 to 6 (the paper\'s 2); P\'s other entries and Q\'s numbers from ±1 to ±6, never 0 (the paper\'s 2, -5, -1 and 2, -3, 4), with x whole and nonzero, within 12; the product\'s number entries never 0, as the paper\'s; R\'s three numbers from ±1 to ±9 with z whole and within 30. Thousands of questions.',
  },
  {
    card: '2016 Q7',
    skill: 'The determinant of a lower triangular matrix with λ in it, A^2 in the form pA + qI, then A^4 in the same form.',
    marks: [1, 3, 2],
    route: '1 + 3 + 2 - (a) det A; (b) A^2 multiplied out; compared with A, A^2 = sA + tI written as matrices; p and q stated, which the scheme requires; (c) (pA + qI)^2 expanded with A^2 replaced; then simplified to (s^3 + 2st)A + (s^2t + t^2)I.',
    ranges: 'The paper: A = (2 0; λ -1), det -2, A^2 = A + 2I, A^4 = 5A + 6I. λ stays a letter, as the paper\'s, and 0 top right. The diagonal d_1 and d_2 from -4 to 4, never 0 (the paper\'s 2 and -1); their sum s = p never 0 (A^2 would be a multiple of I alone) and at most 3 in size (the paper\'s 1), so A^4\'s numbers stay within 60 (the paper\'s 5 and 6). 22 questions. A near relation of 2021 P2 Q5 and 2025 P2 Q8 (locked), which give A^2 = pA + qI and ask for a power and the inverse.',
  },
];
