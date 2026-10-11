/**
 * Advanced Higher, Systems of Equations: what each card is.
 * The routines are in `../routines/systems-of-equations.ts`, under the same labels.
 */
import type { CardMeta } from '../types';

export const SYSTEMS: readonly CardMeta[] = [
  {
    card: '2021 P1 Q4',
    skill: 'Use Gaussian elimination on three equations with $\\lambda$ as a coefficient to find the $\\lambda$ for which there is no solution.',
    marks: [4],
    route: 'The augmented matrix with lambda; two zeros in the first column (R2 - cR1 and R3 - gR1, the paper\'s R2 - 3R1 and R3 + 2R1); the last zero (R3 + mR2, the paper\'s R3 + R2), leaving (lambda - lambda0)z = t; then lambda = lambda0, where the last row reads 0 = t. The scheme\'s matrices are one valid route: any row operations earn the marks.',
    ranges: 'The paper: x + 2y + z = 5, 3x - y + 2z = 4, -2x + 3y + lambda z = -8, last row (0 0 lambda + 1 | -9), lambda = -1. Built from the working: row 1 starts with a lone x, as the paper\'s, its other coefficients from ±1 to ±4 and its constant from ±1 to ±9; rows 2 and 3 start with different multiples of x from ±1 to ±4 (the paper\'s 3 and -2); row 2\'s other coefficients from ±1 to ±6 and constant from ±1 to ±15; row 3\'s y coefficient chosen so the second stage is R3 + mR2 with m one of ±1, ±2 (the paper\'s 1), and from ±1 to ±9. lambda0 from ±1 to ±9 (the paper\'s -1), never 0; the last row\'s constant never 0, so that lambda gives no solution, not infinitely many. Every number in the working nonzero, the coefficients within 10 and the constants within 20, as the paper\'s working is within 11, and no product in the row operations bigger than the paper\'s biggest, 3 × 5 = 15 (the owner on 2023 P1: "biggest should be no larger than paper"); row 2 shares no factor across its terms. A near relation of 2024 P2 Q3 (locked), which also finds an inconsistent lambda: its own routine, its own numbers.',
  },
  {
    card: '2022 P1 Q2',
    skill: 'Solve three equations in three unknowns by Gaussian elimination.',
    marks: [4],
    route: 'Set up the augmented matrix; obtain two zeros in the first column; complete the row operations to upper triangular form; find x, y and z. The scheme\'s matrices are one valid route: any row operations earn the marks, and ours are the paper\'s two stages (R2 - 2R1 and R3 - R1, then R3 + R2). Solving by substitution earns none of the elimination marks.',
    ranges: 'The paper: x - 2y + z = 4, 2x + y - 3z = 3, x - 7y - 4z = 9, solution (2, -1, 0). The solution is chosen first: x and y whole from -5 to 5 and never 0, z from -5 to 5 with 0 allowed, as the paper\'s own z is 0. The first and third equations start with a lone x, as the paper\'s, the second with 2x or 3x either sign (the paper\'s 2x); row 1\'s other coefficients from -4 to 4, row 2\'s from -4 to 4, row 3\'s from -7 to 7 (the paper\'s -7 and -4), never 0. Kept, as on 2026 P1 Q2: a unique solution, no row swap, constants within 30 and reduced entries within 40, no equation with a factor common to all its terms, and no zero in the working until the one being made. The same kind of question as 2026 P1 Q2 (locked): its own routine, and one family label at the port.',
  },
  {
    card: '2026 P1 Q2',
    skill: 'Solve three equations in three unknowns by Gaussian elimination.',
    marks: [4],
    route: 'Set up the augmented matrix; obtain two zeros in the first column; complete the row operations to upper triangular form; find x, y and z. The scheme gives its matrices as examples ("eg"): any valid row operations earn the marks, and ours are the paper\'s own two stages. Solving by substitution earns none of the elimination marks.',
    ranges: 'The paper: x + y - z = 9, 2x - y + 3z = -2, 3x + 2y - 2z = 21, solution (3, 5, -1). The solution is chosen first, each of x, y, z a whole number from -5 to 5 and never 0; the first equation starts with a lone x, as the paper\'s does, so the first stage needs no fractions; every other coefficient is a whole number from -3 to 3 and never 0, as every coefficient in the paper is. Kept: a unique solution, no row swap needed at either stage, constants within 30 and the reduced entries within 40, as the paper\'s are small; no equation with a factor common to all its terms (a pupil would divide through first, as the paper never asks); and no zero in the working until the one being made, since a stray zero hands over an unknown early, which the paper\'s working never does. No row is divided, as the paper\'s working divides none.',
  },
  {
    card: '2024 P2 Q3',
    skill: 'Gaussian elimination with $\\lambda$ as a coefficient: $z$ in terms of $\\lambda$, the $\\lambda$ that makes the system inconsistent, and the solution at one $\\lambda.$',
    marks: [4, 1, 1],
    route: '4 + 1 + 1 - (a) the augmented matrix with lambda; two zeros in the first column (cR1 - R2 or R2 - cR1, and R3 - R1, the paper\'s); the last zero (R3 - dR2), leaving (lambda + m)z = n; z = n/(lambda + m) on its own, which the scheme requires; (b) lambda = -m, where the last row reads 0z = n; (c) z at the given lambda, then y and x by back substitution.',
    ranges: 'The paper: x - y - 3z = 1, 2x - 3y - 5z = 8, x + 2y + lambda z = -7, giving z = 10/(lambda + 6), lambda = -6, and (3, -4, 2) at lambda = -1. Built from the echelon form the paper\'s working reaches, so its own row operations undo it: row 1 starts with a lone x and row 3 with x and ends with lambda z, as the paper\'s; row 2 starts with 2x or 3x (the paper\'s 2); (c)\'s solution is chosen first, whole numbers from -5 to 5 (z from -4 to 4), never 0; the lambda in (c) from -9 to 9, never 0 (the paper\'s -1). Every coefficient from -12 to 12 and every constant from -30 to 30, none 0; row 2 shares no factor across its terms.',
  },
  {
    card: '2023 P1 Q3',
    skill: 'Use Gaussian elimination to decide whether three equations are redundant, inconsistent or have a unique solution.',
    marks: [3],
    route: 'The augmented matrix; two zeros in the first column (R2 - cR1 and R3 - eR1, the paper\'s R2 - 3R1 and R3 - R1); then R3 - R2 leaves a last row 0 = delta, inconsistent, or 0 = 0, redundant (infinitely many solutions), and the conclusion with that reason. The scheme also takes the reason read at the second stage (14 is not 16).',
    ranges: 'The paper: x - 3y + z = -1, 3x - 2y + 4z = 11, x + 4y + 2z = 15, inconsistent (0 = 2). Built from the working: row 1 starts with a lone x, as the paper\'s; its other two coefficients from ±1 to ±4 and its constant from ±1 to ±9; rows 2 and 3 start with different multiples of x from ±1 to ±3 (the paper\'s 3 and 1), chosen so that both reduce to one row (0, p, r | w) with p and r from ±1 to ±8 sharing no factor (the paper\'s 7 and 1), row 3\'s constant delta more, delta from ±1 to ±5 (the paper\'s 2). Every coefficient from -9 to 9 and every constant from -30 to 30, none 0; no equation shares a factor across its terms. Half the draws are inconsistent, as the paper\'s, and half redundant (delta 0, the last row 0 = 0), so the card does not give its answer away: the owner on the 2023 P1 sheet, 2026-09-29, "Make half redundant".',
  },
  {
    card: '2017 Q5',
    skill: 'Gaussian elimination with $2\\lambda$ as a coefficient: $z$ in terms of $\\lambda$, the $\\lambda$ that makes the system inconsistent, and the solution at a half-value of $\\lambda.$',
    marks: [4, 1, 1],
    route: '4 + 1 + 1 - (a)(i) the augmented matrix with 2 lambda; two zeros in the first column (R2 - aR1 and R3 - bR1, the paper\'s R2 - 4R1 and R3 - 3R1); the last zero (pR3 - qR2, the paper\'s 2R3 - R2), leaving (alpha lambda + beta)z = gamma; z = gamma/(alpha lambda + beta) on its own, which the scheme requires; (ii) lambda = -beta/alpha, where the last row reads 0z = gamma; (b) z at the given lambda, then y and x by back substitution.',
    ranges: 'The paper: x + 2y - z = -3, 4x - 2y + 3z = 11, 3x + y + 2 lambda z = 8, giving z = 11/(4 lambda - 1), lambda = 1/4, and (2, -3, -1) at lambda = -2.5. Built from (b)\'s solution, whole numbers from -5 to 5 (z from -4 to 4), never 0, at lambda a half from -4.5 to 4.5 (the paper\'s -2.5), so 2 lambda z is whole; row 1 starts with a lone x, rows 2 and 3 with 2x to 5x either sign (the paper\'s 4x and 3x), and row 3 ends with 2 lambda z, as the paper\'s. Every coefficient from -5 to 5 and every constant from -30 to 30, none 0; every entry of the working within 30, none 0; rows 2 and 3 share no factor across their terms, and z\'s denominator has no factor to take out, as 4 lambda - 1, so the lambda in (a)(ii) is always a fraction, as the scheme\'s 1/4. Its own routine; a near relation of 2024 P2 Q3 (locked), whose lambda has no number in front.',
  },
  {
    card: '2016 Q4',
    skill: 'Use Gaussian elimination on three equations with $2\\lambda$ as a coefficient to find the $\\lambda$ that leads to redundancy.',
    marks: [4],
    route: 'The augmented matrix with 2 lambda; two zeros in the first column (R2 - uR1 or uR1 - R2, and R3 - R1, the paper\'s 2R1 - R2 and R3 - R1); the third zero (R3 ± R2, the paper\'s R3 + R2) or the rows seen to be multiples, leaving 0, 0, 2 lambda - K, 0; then lambda = K/2, the whole last row zero, constant included.',
    ranges: 'The paper: x + 2y + 3z = 3, 2x - y + 4z = 5, x - 3y + 2 lambda z = 2, lambda = 1/2. Built so row 3\'s x, y and constant are alpha R1 + beta R2 with alpha + beta u = 1, beta 1 (the paper) or -1, so the first stage leaves rows 2 and 3 multiples in y and the constant and the last row\'s constant is 0, as the paper\'s; row 1 a lone x with y from ±1 to ±3, z from ±1 to ±4 and its constant from ±1 to ±6 (the paper\'s 2, 3, 3); row 2 starts with 2x or 3x (the paper\'s 2x), y and z from ±1 to ±5 and its constant from ±1 to ±9; row 3 starts with a lone x and ends with 2 lambda z, as the paper\'s. Every number printed nonzero, row 3\'s y within 6 and its constant within 9, the first stage\'s within 9 and none 0, no row with a factor to divide through, and K from ±1 to ±9, so lambda is whole or a half, as 1/2. A near relation of 2023 P1 Q3 (locked), which decides between redundant and inconsistent: here the lambda that makes it redundant.',
  },
];
