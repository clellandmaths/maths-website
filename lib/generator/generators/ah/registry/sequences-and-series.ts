/**
 * Advanced Higher, Sequences & Series: what each card is.
 * The routines are in `../routines/sequences-and-series.ts`, under the same labels.
 */
import type { CardMeta } from '../types';

export const SEQUENCES: readonly CardMeta[] = [
  {
    card: '2021 P2 Q11(a)(b)',
    skill: 'From three algebraic terms of an arithmetic sequence, find the common difference and $x$, then the first term and a simplified $n$th term.',
    marks: [1, 1, 1, 1],
    route: '1 + 1 + 1 + 1 - (a)(i) the common difference, the second term minus the first; (a)(ii) the next difference set equal to it and solved for x; (b)(i) the first term, from the given term as the first term plus one fewer common differences than its position; (b)(ii) the nth term, simplified.',
    ranges: 'The paper: x - 1, x - 7, 2x - 9 (d = -6, x = -4), x - 1 the 21st term (a = 115, 121 - 6n). The card: x + p, x + q, 2x + s with p and q from -9 to 9, not zero, so d = q - p from 2 to 9 either sign; x from -9 to 9, not zero, and s = d + q - x, not zero and up to 15, so the next difference gives x; x + p, not zero, is the Nth term, N from 12 to 30 (the paper\'s 21); the nth term always has a constant, as the paper\'s 121. Paper 2, so the first term can be any size.',
  },
  {
    card: '2021 P2 Q11(c)(d)',
    skill: 'From three algebraic terms of a geometric sequence, find the two values of $y$ and their ratios, pick the one with a sum to infinity, and decide whether a given sum is possible.',
    marks: [3, 1, 2],
    route: '3 + 1 + 2 - (c) two ratios of consecutive terms equated; rearranged into a quadratic in standard form; both values of y with their common ratios; (d)(i) the value of y with the reason, |r| < 1; (d)(ii) the sum to infinity formula set equal to the given sum; a found, and the decision with its reason.',
    ranges: 'The paper: y - 1, y - 7, 2y - 9, so y^2 + 3y - 40 = 0: y = 5 (r = -1/2) and y = -8 (r = 5/3); 64/3 needs a = 32, whose terms give -4 where y - 1 should be 4, "No". The card: y + p, y + q, 2y + s with p, q from -9 to 9, the quadratic y^2 + (s + 2p - 2q)y + (ps - q^2) = 0 with whole roots, neither 0, and s and the second root up to 20; at one root the ratio negative and inside (-1, 1), as the paper\'s -1/2, and at the other outside [-1, 1], so exactly one has a sum to infinity; no term zero. The y, y, 2y fix the ratios: a negative one inside (-1, 1) needs q - p a multiple of 6 (-1/2 and 5/3, the paper\'s) or 12 (-1/3 and 7/4), so 24 sets of terms, 20 with the paper\'s ratios. A positive ratio (1/2, 1/3, 2/3, 1/4, 3/4) would give 118, but then a "No" shows in the sign of the sum. (d)(ii) decides (the owner\'s rule on 2023 P1: never always the same answer): half the draws "Yes", the sum of the series whose (j + 1)th term is y + p, and half "No", the paper\'s kind, the sum of a series whose (j + 1)th term is -(y + p), with j from 1 to 3 (the paper\'s 3) and its first term a whole number up to 200 (the paper\'s 32). The ratio stays negative, as the paper\'s, so the sum\'s sign never gives the answer away. The ladder\'s last move asks for the terms to be listed, not the first term compared, since a "Yes" first term is not y + p either.',
  },
  {
    card: '2022 P2 Q6',
    skill: 'Show three algebraic terms are arithmetic, find a simplified $n$th term, then $x$ from a given sum.',
    marks: [2, 2, 2],
    route: '2 + 2 + 2 - (a) one difference, then a second pair with the same difference and the conclusion; (b) the first term and the difference in the nth term formula, then simplified; (c) the sum formula set equal to the given sum, then solved for x. Picking a number for x does not show (a).',
    ranges: 'The paper: x + 5, 3x + 2, 5x - 1, the 15th term 29x - 37, the sum of 20 terms 1130, x = 4. Terms px + q, (p + r)x + (q + s), (p + 2r)x + (q + 2s): p from 1 to 3 and r from 1 to 4 (the paper\'s 1 and 2), q from 1 to 9 (the paper\'s 5) and s from ±1 to ±6 (the paper\'s -3). Built from the answer: x from 2 to 9, a natural number as the question says; the term in (b) from the 11th to the 20th (all "th", as the 15th); the sum of an even number of terms, 10 to 30 (the paper\'s 20), so N/2 is whole, as 20/2. Kept: every term, u_n and the bracket in (c) keep their number, and the sum is positive and at most 5000.',
  },
  {
    card: '2026 P2 Q6',
    skill: 'An arithmetic sequence from two terms and its sum; a geometric one from two terms and its sum to $n$; the least $n$ where the second passes the first.',
    marks: [1, 1, 1, 1, 1, 1, 1],
    route: '1 + 1 + 1 + 1 + 1 + 1 + 1 - (a)(i) d from the two terms; (a)(ii) the first term; (a)(iii) the sum by the arithmetic formula; (b)(i) r as one term over the one before; (b)(ii) the first term; (b)(iii) S_n from the geometric formula, simplified; (c) S_n greater than (a)(iii), solved by logs and rounded up to a whole n.',
    ranges: 'The paper: u_3 = 6, u_11 = 10 (d = 1/2, a = 5), S_109 = 3488; v_3 = 18, v_4 = 27 (r = 3/2, a = 8); n = 14. Arithmetic: d a half, 1/2 or 3/2, as the paper\'s fraction; a from 2 to 9; the terms u_3 or u_5 and one 6, 8 or 10 places on, so both are whole; the sum of 61 to 149 terms, 1 more than a multiple of 4, so the sum is whole. Geometric: v_3 and v_4 as the paper, r = 3/2, 4/3 or 5/4 and the first term t s^3 with t 1 or 2, so both terms are whole and S_n is a whole number times (r^n - 1). The log\'s value is kept clear of a whole number, so the rounding up is never a coin toss.',
  },
  {
    card: '2025 P2 Q10',
    skill: 'Sum $r^{3}$ and $r$ terms with the standard formulae, then factorise fully.',
    marks: [2],
    route: 'The standard sums substituted, n^2(n + 1)^2/4 and n(n + 1)/2; then the common factors taken out and the quadratic left factorised as well. A quadratic left unfactorised loses the second mark.',
    ranges: 'The paper: the sum of r^3 - 3r, (1/4) n(n + 1)(n - 2)(n + 3). The leftover quadratic n^2 + n - 2c/a factorises only when 2c/a is p(p + 1), so c = a p(p + 1)/2 with p from 1 to 8 (the paper\'s p = 2), and the answer (a/4) n(n + 1)(n - p)(n + p + 1). The paper\'s shape alone (a = 1) makes 8 questions, below the floor; a = 2, the sum of 2r^3 - p(p + 1)r, answered (1/2) n(n + 1)(n - p)(n + p + 1), makes 16. For the owner on the sheet.',
  },
  {
    card: '2025 P2 Q13',
    skill: 'A positive geometric sequence from its second and fourth terms: the ratio, first term, why the sum to infinity exists, the sum, and multiplying every term by $k.$',
    marks: [2, 1, 1, 1, 1, 1],
    route: '2 + 1 + 1 + 1 + 1 + 1 - (a)(i) ar and ar^3 set equal to the two terms, then r, the positive root; (a)(ii) the first term; (b) -1 < r < 1; (c) a/(1 - r); (d)(i) the ratio unchanged; (d)(ii) the sum to infinity multiplied by k.',
    ranges: 'The paper: second term 100, fourth 16, r = 2/5, a = 250, S = 1250/3. Built from r = s/t, a fraction between 0 and 1 with t up to 6 (the paper\'s 2/5 among them), and a = j t^3 with j from 1 to 4, so the second term j s t^2 and the fourth j s^3 are whole, as 100 and 16; the second at most 600 and the fourth at least 2. (d) is the paper\'s words and answers, unchanged.',
  },
  {
    card: '2024 P1 Q3',
    skill: 'A positive geometric sequence from its third and fifth terms: the ratio, the first term, why the sum to infinity exists, and the sum.',
    marks: [2, 1, 1, 1],
    route: '2 + 1 + 1 + 1 - (a) ar^2 and ar^4 set equal to the two terms, then r, the positive root; (b) the first term; (c) |r| < 1, strictly; (d) a/(1 - r).',
    ranges: 'The paper: third term 36, fifth 16, r = 2/3, a = 81, S = 243. Built from r = s/t, one of 1/2, 1/3, 2/3 (the paper\'s), 1/4 and 3/4, and a = j t^4 with j from 1 to 6, so the third term j s^2 t^2 and the fifth j s^4 are whole, as 36 and 16; j a multiple of t - s, so the sum to infinity is whole, as 243. Kept to numbers worked by hand on Paper 1: the third term at most 150, the sum at most 1100 (fifths make 625 the first term). 15 questions. Near the 2025 P2 Q13 card (the second and fourth terms, on the calculator paper).',
  },
  {
    card: '2024 P2 Q9',
    skill: 'An arithmetic sequence: a term in terms of $d$, $d$ from one term being a multiple of another, then the least number of terms for a sum to pass a total.',
    marks: [1, 1, 3],
    route: '1 + 1 + 3 - (a) the jth term, a + (j - 1)d; (b) the ith term set equal to m times the jth, then d; (c) the sum formula set equal to the total, the quadratic in standard form and its positive root, then the least whole n (the root rounded up).',
    ranges: 'The paper: first term -3, the eighth five times the third, d = 4, the sum past 500 after 18 terms (root 17.1). The first term from -9 to -1, negative as the paper\'s; the term asked for in (a) the second, third (the paper) or fourth; the other at least three terms later, up to the tenth; the multiple twice to six times (the paper\'s five). Kept where d is a whole number from 1 to 10, as 4, positive so the sum grows past the total; the total one of 100 to 1000 (the paper\'s 500), with a root from 6 to 40 that is not whole and not within 0.1 of whole, so its one decimal place, as 17.1, shows why n rounds up.',
  },
  {
    card: '2023 P1 Q7',
    skill: 'Sum $r^{2} + kr$ with the standard formulae into the form $\\frac{1}{3}n(n + a)(n + b)$, then a sum between two limits.',
    marks: [2, 2],
    route: '2 + 2 - (a) the standard sums substituted, n(n + 1)(2n + 1)/6 and k times n(n + 1)/2; then simplified into the given form; (b) the sum to N substituted, with the subtraction shown; then the sum to L - 1 substituted and the difference evaluated. Taking away the sum to L instead is the slip the scheme names.',
    ranges: 'The paper: r^2 + 3r, (1/3)n(n + 1)(n + 5), and the sum from 11 to 20, 2950. The form (1/3)n(n + a)(n + b) needs 2n + 1 + 3k to halve, so k is odd: -3, -1, 1, 3 (the paper), 5 or 7, giving b = (1 + 3k)/2 from -4 to 11; always r^2 with no number before it, since the form is the paper\'s. (b) from L = 6 to 15 up to N = 12 to 20, at least five terms (the paper\'s 11 to 20), and the biggest product worked by hand, N(N + 1)(N + b), no bigger than the paper\'s 20 x 21 x 25 (so N stops at 18 when b = 11): the owner on the 2023 P1 sheet, 2026-09-29, "biggest should be no larger than paper". The sum to L - 1 is always positive, as the paper\'s. All exact: Paper 1.',
  },
  {
    card: '2023 P2 Q8',
    skill: 'A geometric sequence from two terms three apart: the ratio and the first term, then show $\\frac{S_{2n}}{S_{n}} = 1 + r^{n}.$',
    marks: [1, 1, 2],
    route: '1 + 1 + 2 - (a)(i) the later term over the earlier is r^3, so r; (a)(ii) the first term; (b) S_n and S_{2n} from the sum formula; their quotient, 1 - r^{2n} factorised as a difference of two squares and cancelled, leading to 1 + r^n.',
    ranges: 'The paper: the fourth and seventh terms 9 and 243, r = 3, a = 1/3, S_{2n}/S_n = 1 + 3^n. The terms always three apart, as the paper\'s, so r is the one cube root; the first given term the second to the fifth (the paper\'s fourth). Built from r and a: r one of 2, 3 (the paper), 4, 5, -2 or -3 (a sign, not a step: 1 + (-2)^n is still 1 + r^n), and a = c r^e with c from 1 to 3 and e from -2 to 1 (the paper\'s 1/3 is c = 1, e = -1), both given terms whole and the later at most 5000 (the paper\'s 243).',
  },
  {
    card: '2019 Q7',
    skill: 'Sum $ar + b$ with the standard formulae in terms of $n$, then hence a sum from $p + 1$ to $N$ in terms of $p.$',
    marks: [1, 2],
    route: '1 + 2 - (a) a times n(n + 1)/2 and the sum of b as bn, simplified to (a/2)n^2 + (a/2 + b)n; (b) the sum to N substituted and the sum to p taken from it, (… at N) - …; then simplified, the sum to N less (a/2)p^2 + (a/2 + b)p.',
    ranges: 'The paper: 6r + 13, 3n^2 + 16n, and the sum from p + 1 to 20, 1520 - 3p^2 - 16p. a even from 2 to 10 (the paper\'s 6), so the answer has whole coefficients as the paper\'s; b from -15 to 15, never 0 (the paper\'s 13), and a/2 + b never 0, so the answer keeps its n term; N from 10 to 30 (the paper\'s 20), the sum to N never 0.',
  },
  {
    card: '2019 Q17',
    skill: 'Three linear terms in $x$: geometric at one $x$ with its ratio and sum to infinity, then the second $x$ from the quadratic, its terms, and $S_{2n}$ with a reason.',
    marks: [2, 1, 2, 2, 2, 1],
    route: '2 + 1 + 2 + 2 + 2 + 1 - (a) the terms at x and one ratio, then the other ratio and r stated (one ratio alone does not show it is geometric); (b)(i) |r| < 1; (b)(ii) the sum to infinity begun, a/(1 - r), then evaluated; (c)(i) the two ratios equated, then cross-multiplied and collected to the given quadratic; (c)(ii) the second x, then its three terms; (c)(iii) S_{2n} = 0, justified: r = -1, so the terms cancel in pairs.',
    ranges: 'The paper: 5x + 8, -2x + 1, x - 4; at x = 11 the terms 63, -21, 7, r = -1/3, S = 189/4; x^2 - 8x - 33 = 0, x = -3, the terms -7, 7, -7. Built backwards from the two sequences, each term the line through its two values: at the first x the ratio is one of ±1/2, ±1/3, ±1/4, ±2/3 and 3/4 (the paper\'s -1/3; a sign is not a step; -3/4 has no set at these sizes) and the first term positive up to 90; at the second x the terms are B, -B, B, so r = -1 and S_{2n} = 0, the paper\'s point. The first x from 2 to 12 and the second from -12 to -1, as 11 and -3; every slope whole from ±1 to ±9 and constant from ±1 to ±20, as the paper\'s. 791 sets of terms; the ratio drawn first, so each of the nine is as likely.',
  },
  {
    card: '2018 Q14',
    skill: 'A geometric sequence (its 7th term and sum to infinity) and an arithmetic one with the same first term ($d$ from $S_{5}$, the $n$th term, and the $n$ with $S_{n}$ given).',
    marks: [2, 2, 2, 1, 3],
    route: '2 + 2 + 2 + 1 + 3 - (a)(i) a(1/r)^6, then its value; (a)(ii) a/(1 - 1/r), then its value; (b)(i) (5/2)(2a + 4d) = S_5, then d; (b)(ii) a + (n - 1)d simplified; (c) (n/2)[2a + (n - 1)d] = T, the quadratic in general form, then both roots.',
    ranges: 'The paper: a = 80, ratio 1/3, S_5 = 240, d = -16, 96 - 16n, S_n = 144 at n = 2 and 9. Built from the answer: a from 20 to 120 (the paper\'s 80); the ratio 1/r with r from 2 to 5 (the paper\'s 3) and r - 1 dividing a, so the sum to infinity is whole, as the paper\'s 120; d = -e with e from 2 to 24 (the paper\'s 16) dividing 2a; the two values of n chosen first, whole, at least 2 and at least 2 apart (the paper\'s 2 and 9), n₁ + n₂ = 1 + 2a/e from 7 to 15 (the paper\'s 11), so S_5 is positive and both are values of n, as the paper\'s.',
  },
  {
    card: '2017 Q4',
    skill: 'An arithmetic sequence from two of its terms: the first term and the common difference, then $n$ from a given sum, rejecting the negative root.',
    marks: [2, 3],
    route: '2 + 3 - (a) the two terms written as a + (p - 1)d and a + (q - 1)d; solved for a and d; (b) (n/2)[2a + (n - 1)d] = S set up; rearranged to a quadratic in standard form; solved, with the negative root rejected and the reason, n > 0.',
    ranges: 'The paper: the 5th term -6 and the 12th -34, a = 10, d = -4, S_n = -144 at n = 12 (the other root -6). Built from a, d and n: a from 3 to 24 (the paper\'s 10), d = -D with D from 2 to 6 (the paper\'s 4) dividing 2a, so the other root, 1 + 2a/D - n, is whole, as -6, and negative; n from 6 to 20 (the paper\'s 12). The given terms the 3rd to 8th and 4 to 9 later, up to the 15th (the paper\'s 5th and 12th), neither 0; the sum negative, as -144, from -30 to -300. The quadratic is divided through by any common factor.',
  },
  {
    card: '2017 Q10',
    skill: 'Sum $r^{2} + cr$ with the standard formulae, $c$ a number of thirds, fully factorised; then hence a sum from a given number to $2p.$',
    marks: [2, 2],
    route: '2 + 2 - (a) the standard sums substituted, n(n + 1)(2n + 1)/6 and c n(n + 1)/2, collected over 6; then fully factorised, n(n + 1)(n + m)/3; (b) the sums to 2p and to L - 1 substituted and subtracted; then the expression, the sum to L - 1 evaluated.',
    ranges: 'The paper: r^2 + (1/3)r, n(n + 1)^2/3, and the sum from 10 to 2p, p > 5, 2p(2p + 1)^2/3 - 300. c = (2m - 1)/3, so the sum factorises fully as n(n + 1)(n + m)/3: m from 0 to 7 where c is a third that is not whole, -1/3, 1/3 (the paper), 5/3, 7/3, 11/3 and 13/3 (c = 1 and 3 are 2023 P1 Q7\'s, locked, which asks for (1/3)n(n + a)(n + b) and a number in (b)). L from 6 to 13 where the sum to L - 1 is whole, as the paper\'s 300 (L = 6, 7, 9, 10, 12, 13), and p > L/2 rounded down, as the paper\'s p > 5. Always to 2p, as the paper. 36 questions.',
  },
  {
    card: '2016 Q2',
    skill: 'A geometric sequence from its second and fifth terms: the ratio, why the sum to infinity exists, and the sum.',
    marks: [3, 1, 2],
    route: '3 + 1 + 2 - (a) ar and ar^4 equal to the two terms; their quotient, r^3; then r; (b) -1 < r < 1 stated; (c) the first term from the second, a = T_2/r; then a/(1 - r).',
    ranges: 'The paper: 108 and 4, r = 1/3, a = 324, sum 486. Built from the ratio r = p/m, |p| < m, m from 2 to 5, sharing no factor: T_2 = km^3 and T_5 = kp^3, the second term at most 400 (the paper\'s 108) and the fifth from 2 to 20 in size (the paper\'s 4), so a = km^4/p and the sum km^5/(p(m - p)) are whole, as the paper\'s. That leaves 1/2, 1/3 (the paper), 2/3, 1/4, -1/2, -1/3 and -1/4, drawn first and then its terms, since 1/2 alone has most of them. A negative ratio is a sign, not a step: the cube root of a negative is the one negative root, as 2023 P2 Q8 allows -2 and -3. Always the second and fifth terms, as the paper. 39 questions.',
  },
];
