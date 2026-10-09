/**
 * Advanced Higher, Vectors: what each card is.
 * The routines are in `../routines/vectors.ts`, under the same labels.
 */
import type { CardMeta } from '../types';

export const VECTORS: readonly CardMeta[] = [
  {
    card: '2021 P2 Q12',
    skill: 'Find the plane through three points, the parallel plane through the origin, then the line along the normal from a point of contact and where it meets the second plane.',
    marks: [4, 1, 1, 2],
    route: '4 + 1 + 1 + 2 - (a) two directed line segments in the plane; the vector product begun (the determinant); a normal; the equation, using a point; (b) the same left-hand side = 0; (c)(i) the line from A along the normal, as parametric equations; (c)(ii) substituted into the equation of the second plane, and the coordinates of Q.',
    ranges: 'The paper: A(4, 0, 8), B(6, -5, 4), C(3, 4, 11), AB × AC = (1, -2, 3) exactly, x - 2y + 3z = 28 and = 0, Q(2, 4, 2) at t = -2. Built backwards: a normal n with no zero component and no common factor, the first from 1 to 3 and the others from -4 to 4 (the paper\'s (1, -2, 3)); Q a whole point on the second plane, no coordinate zero or past 6; A = Q + t n with t from -3 to 3, not zero (the paper\'s 2); AB and AC two sides across n, components up to 6, whose vector product is n itself, as the paper\'s is, so there is no factor to take out; every coordinate up to 12. Part (a) is 2024 P2 Q14(a)(ii)\'s plane through three points.',
  },
  {
    card: '2026 P2 Q14',
    skill: 'The plane through three points; where a line in symmetric form meets it; the angle between them.',
    marks: [4, 3, 3],
    route: '4 + 3 + 3 - (a) two vectors in the plane, the vector product set up, worked out, and the equation from one point; (b) the line in parametric form, substituted into the plane, and S from the parameter; (c) the direction vector, the scalar product with the normal, and 90 degrees minus the angle with the normal. Any multiple of the normal is accepted.',
    ranges: 'The paper: P(2, 3, -4), Q(3, 5, 1), R(6, 0, -6), the plane x + 2y - z = 12; the line through (8, -2, -2) with direction (2, -1, 3), meeting it at S(4, 0, -8); 19.1 degrees. The answer is chosen first: a normal with small whole components, none zero, the first positive; P, Q and R whole points up to 9 whose differences lie in the plane; S a whole point on it; a direction with no zero component (none +1, which a paper would not print as a fraction) not parallel to the plane; the line\'s printed point S minus 1 to 3 directions, with no zero coordinate. The angle is between 8 and 82 degrees and never on a rounding boundary.',
  },
  {
    card: '2025 P1 Q8',
    skill: 'Three planes meeting at a point by Gaussian elimination; where a line meets one of them; the line through the two points.',
    marks: [4, 3, 2],
    route: '4 + 3 + 2 - (a) the augmented matrix, two zeros in the first column, the row operations completed to upper triangular form, and T by back substitution; (b) the line\'s symmetric equations in parametric form, substituted into the third plane, and P from the parameter; (c) a direction from T to P, then the parametric equations of the line through them. The scheme\'s matrices are examples: any valid row operations earn the marks, and ours are the paper\'s own two stages. Substitution instead of row operations earns none of (a)\'s elimination marks.',
    ranges: 'The paper: x - y + 4z = -6, 2x + 3y + z = 15, 3x + 2y - 2z = 16, T(2, 4, -1); the line (x + 4)/3 = (y - 7)/2 = (z - 4)/1, P(2, 11, 6); L2 x = 2, y = 11 + 7λ, z = 6 + 7λ. Built from the answers. T first, each coordinate from ±1 to ±5; the first plane starts with a lone x, as the paper\'s, the first coefficients of the others from ±1 to ±3 and every other coefficient from ±1 to ±4, as the paper\'s 4; kept as 2026 P1 Q2\'s system is: a unique point, no row swap, constants within 30, working within 40, no plane with a common factor, no zero in the working until the one being made. Then P = T + v with v a whole vector in the third plane (so P is on it), up to 8 a component, P within 12; then the line\'s direction, whole components from ±1 to ±3 with no common factor, not parallel to the third plane (a 1 is printed over 1, as the paper\'s (z - 4)/1), and its printed point P minus 1 to 3 directions, no coordinate zero, within 12, so the parameter is whole, as the paper\'s μ = 2. All exact: Paper 1.',
  },
  {
    card: '2024 P2 Q14',
    skill: 'The plane through three points from the vector product, then show a line parallel to it does not meet it.',
    marks: [1, 3, 3],
    route: '1 + 3 + 3 - (a)(i) AB and AC; (a)(ii) the vector product set up, worked out to a normal (a multiple is taken out, as the paper\'s -3(1, 5, 1)), then the plane through A; (b) the line in parametric form, substituted into the plane\'s left-hand side and simplified to a constant, then that constant against the right-hand side: inconsistent, so no intersection.',
    ranges: 'The paper: A(2, -1, 8), B(1, 1, -1), C(4, -2, 11), plane x + 5y + z = 5; the line (x - 1)/1 = (y + 1)/-1 = (z + 1)/4, giving -5, not 5. Built from the normal: whole components with no common factor, the first from 1 to 3 and the others from ±1 to ±5, never 0, as (1, 5, 1); AB and AC whole vectors at right angles to it, no component 0, each at most 9, as (-1, 2, -9); A with coordinates from -5 to 9, never 0, and B and C within 12. The line\'s direction at right angles to the normal too (so it is parallel, as the paper\'s), no common factor, each component at most 5 and never 0; its printed point, coordinates from ±1 to ±6, off the plane.',
  },
  {
    card: '2019 Q15',
    skill: 'Verify the line of intersection of two planes, the acute angle between it and a third plane, then whether it meets the line through a point along that plane\'s normal.',
    marks: [2, 3, 4],
    route: '2 + 3 + 4 - (a) the line substituted into one plane, then the other, and the conclusion that it lies on both; (b) the direction and the normal, the cosine by the scalar product, then the complement, the acute angle with the plane (the angle with the normal alone loses that mark); (c) L2\'s parametric equations from P and the normal; two of the coordinates equated, a parameter each; both parameters solved; the third coordinate checked and the conclusion stated.',
    ranges: 'The paper: π1: 2x - 3y - z = 9, π2: x + y - 3z = 2, L1: x = 2λ + 3, y = λ - 1, z = λ; π3: -2x + 4y + 3z = 4, 13° (0.229 radians); P(1, 3, -2), λ = 0 and μ = -1 from x and y, z gives 0 against -5, no intersection. Built from L1: z = λ as the paper, the other two directions from ±1 to ±3 and its point at λ = 0 from ±1 to ±5; π1 and π2 normals at right angles to it, components from ±1 to ±5, never 0, as the paper\'s, and each plane\'s constant never 0 and within 20 (the paper\'s 9 and 2); π3\'s normal from ±1 to ±4, never 0, at an angle from 8° to 82° clear of a rounding boundary in degrees and radians. (c) decides, so it never always gives the same answer (the owner\'s rule from 2023 P1 Q3): half the draws L2 meets L1, at λ from -2 to 2 and μ from ±1 to ±3; half, the paper\'s kind, P is lifted off that point in z by 1 to 6, so x and y agree and z does not. P within 9.',
  },
  {
    card: '2018 Q16',
    skill: 'Three planes meeting in a line for one $a$ by Gaussian elimination; the line; the acute angle between two planes; how two planes lie, justified.',
    marks: [4, 2, 3, 1],
    route: '4 + 2 + 3 + 1 - (a) the augmented matrix; two zeros in the first column; the last zero; a from the whole last row zero; (b) z = t and y from row 2; x from row 1, and the line; (c) the two normals; cos θ from the scalar product; the acute angle; (d) parallel or perpendicular, with the normals as the reason.',
    ranges: 'The paper: π1: x - 2y + z = -4, π2: 3x - 5y - 2z = 1, π3: -7x + 11y + az = -11, a = 8; π4: -9x + 15y + 6z = 20, 43° (0.75 rad), parallel to π2. Built backwards so the elimination stays in whole numbers, as the paper\'s: π1 starts with x; R2 - pR1 leaves a leading 1 in y (p from 2 to 4, the paper\'s 3); π3 = λπ1 + μπ2 (λ and μ from -3 to 3, never 0; the paper\'s 2 and -3) with its z coefficient a. Every printed coefficient nonzero and at most 15, as is a. π4: on half the draws a multiple of π2\'s normal (by -3, -2, 2 or 3, entries at most 30; the paper\'s -3) with a constant that is not a multiple of it, so π4 does not simplify, as the paper\'s 20, parallel; on the other half a normal at right angles to π2\'s (entries 1 to 6 in size), perpendicular, since a card that asks the pupil to decide must not always give the same answer (the owner\'s rule from 2023 P1 Q3). The angle to 1 decimal place in degrees and 3 in radians, as 2019 Q15.',
  },
  {
    card: '2017 Q15',
    skill: 'The line through two points in parametric form; the plane through three points from the vector product; where the line meets the plane.',
    marks: [2, 4, 3],
    route: '2 + 4 + 3 - (a) the direction vector, BT or a multiple; the parametric equations through B (or T); (b) two vectors in the plane; the vector product set up; the normal worked out; the equation from one point; (c) the line substituted into the plane; the parameter; H. Parametric equations are asked for, not a vector or symmetric form.',
    ranges: 'The paper: B(7, 8, 1), T(-3, -22, 6), d = (2, 6, -1); P(2, 1, 9), Q(1, 2, 7), R(-3, 7, 1), 4x + 2y - z = 1; λ = -2, H(3, -4, 3). Built backwards: PQ (components to 3) and PR (to 6, z to 8) with no zero component and PQ × PR the normal itself, no zero component, no factor to take out, the first positive and within 6, as (4, 2, -1), so the equation starts with a positive x term, as 4x; P, Q and R whole points within 9; H a whole point on the plane, none of P, Q and R; a direction with no zero component and no factor (z component to 3, the paper\'s -1), not parallel to the plane; B a whole number of directions from H, from ±1 to ±3 (the paper\'s -2), within 12; T from 2 to 5 directions on from B either way (the paper\'s -5), within 25, as -22. No zero coordinate in any printed point, as the paper\'s.',
  },
  {
    card: '2016 Q14',
    skill: 'Show two lines, one parametric and one symmetric, intersect and find the point; then the obtuse angle between them.',
    marks: [5, 4],
    route: '5 + 4 - (a) L_2 in parametric form with its own parameter; two coordinates equated, two equations in two parameters; both parameters; the third coordinate checked on both lines, which the scheme requires; the point; (b) d_1; d_2; both magnitudes and the scalar product; the obtuse angle, from the negative scalar product, to one place.',
    ranges: 'The paper: L_1 x = 4 + 3λ, y = 2 + 4λ, z = -7λ; L_2 (x - 3)/-2 = (y - 8)/1 = (z + 1)/3; λ = 1, μ = -2, (7, 6, -7); 135.6°. Built from the point P (coordinates from -8 to 8), the directions d_1 (components ±1 to ±7, the paper\'s 3, 4, -7) and d_2 (±1 to ±4, the paper\'s -2, 1, 3), each with no factor to take out, and the parameters λ and μ at P from ±1 to ±3 (the paper\'s 1 and -2): L_1\'s point P - λd_1 within 12, L_2\'s P - μd_2 within 12 and never 0, so its symmetric form has x - 3, never a bare x, as the paper\'s. Kept: the x and y equations solvable on their own, as the paper\'s; the scalar product negative, so the angle it gives is the obtuse one, as the paper\'s -23, from 100° to 165°, and its first place never a coin toss. Thousands of questions.',
  },
];
