/**
 * Advanced Higher, Binomial Theorem: what each card is.
 * The routines are in `../routines/binomial-theorem.ts`, under the same labels.
 */
import type { CardMeta } from '../types';

export const BINOMIAL: readonly CardMeta[] = [
  {
    card: '2021 P2 Q7',
    skill: 'Expand $(a + ki)^{3}$ by the binomial theorem, then equate parts of $z^{3} + mz = b + Di$ to find $a$ and $b.$',
    marks: [3, 3],
    route: '3 + 3 - (a) the binomial expansion with its coefficients, then the coefficients and powers of k worked out, then simplified with i^2 = -1 and i^3 = -i into real and imaginary parts; (b) mz added and set equal to b + Di, then real and imaginary parts equated, then a, the positive root, and b.',
    ranges: 'The paper: z = a + 2i, z^3 + 3z = b + 148i, a = 5, b = 80. Built from a, a whole number from 2 to 6 (the paper\'s 5), so the imaginary equation gives a whole a^2; k from 1 to 3 (the paper\'s 2), m from 1 to 5 (the paper\'s 3); b never 0, as 80. a is always positive, as the paper says, so the negative root is always rejected. 75 questions.',
  },
  {
    card: '2026 P2 Q2',
    skill: 'Expand a power of a binomial with a negative power of $x$, and simplify.',
    marks: [4],
    route: 'The five terms of the expansion with their coefficients, 4 choose r, and both powers; then the signs resolved; then the coefficients or the powers of x simplified; then every term a single number times a single power of x. The scheme gives the last three marks together once the answer is right.',
    ranges: 'The paper: (x^2 - 5/x)^4. Always the fourth power, a minus inside and a number over x, so every term\'s sign has to be worked out, as the paper\'s. The number over x is a whole number from 2 to 10 or a unit fraction, 1/(bx) with b from 2 to 5 (the owner, 2026-09-29: "Let\'s go number 2 to 10 and fraction"); a fraction adds fraction powers to the arithmetic, not a step. The first term x^2 or x^3: x^3 brings a constant term, still a number times a power of x. The coefficient of the first term stays 1: a coefficient there changes every term. 26 questions.',
  },
  {
    card: '2025 P1 Q1',
    skill: 'Expand a power of a binomial with a term in $\\frac{1}{x}$, and simplify.',
    marks: [4],
    route: 'The five terms of the expansion with their coefficients, 4 choose r, and both powers; then the signs resolved; then the coefficients or the powers of x simplified; then every term a single number times a single power of x. The scheme gives the last three marks together once the answer is right.',
    ranges: 'The paper: (1/x - 3x)^4. Always the fourth power, 1 over a power of x first and a minus before the x term, so every term\'s sign has to be worked out, as the paper\'s. The number before x is a whole number from 2 to 5, as the paper\'s 3 (5 gives 625x^4, still a Paper 1 size), or a unit fraction, (1/d)x with d from 2 to 5, as the owner chose for 2026 P2 Q2. The first term 1/x or 1/x^2, as 2026 P2 Q2\'s first term is x^2 or x^3: the powers change, not the steps. The first term\'s numerator stays 1: a number there changes every term. 16 questions. All exact: Paper 1.',
  },
  {
    card: '2024 P2 Q5',
    skill: 'The general term of a binomial expansion with a negative power of $x$, simplified, then the coefficient of one negative power.',
    marks: [3, 2],
    route: '3 + 2 - (a) the general term with n choose r and both powers; the powers of x collected, or the numbers and signs; the simplified term, n choose r (-1)^r a^{n-r} x^{pn-(p+q)r}; (b) the power set equal to the one asked for and solved for r; the coefficient evaluated. Leaving out n choose r loses the first mark.',
    ranges: 'The paper: (2x^2 - 1/x^3)^16 and the coefficient of 1/x^18 (r = 10, 512512). The power n from 8 to 16, the number a 2 (the paper) or 3, and the powers of x (p, q) any two different from 1 to 3 (the paper\'s 2 and 3), always a minus and 1 over the power, as the paper\'s. The power asked for is a negative one, 1/x^N, reached by an r short of n (the last term has no power of a), with the coefficient at most 10^8, a calculator\'s whole number, as 512512. Paper 2: the calculator evaluates it.',
  },
  {
    card: '2023 P2 Q5',
    skill: 'The general term of a binomial expansion with a number over $x^{2}$, simplified, then the coefficient of one negative power.',
    marks: [3, 2],
    route: '3 + 2 - (a) the general term with n choose r and both powers, (ax)^{n-r}(-b/x^2)^r; the numbers, a^{n-r}(-b)^r, or the powers of x, x^{n-3r}; the simplified term, n choose r a^{n-r}(-b)^r x^{n-3r}; (b) n - 3r set equal to the power asked for and solved for r; the coefficient evaluated.',
    ranges: 'The paper: (3x - 2/x^2)^8 and the coefficient of x^{-1} (r = 3, -108864). The power n from 6 to 10 (the paper\'s 8), a and b from 2 to 5 (the paper\'s 3 and 2), always x and b/x^2 with a minus, as the paper\'s. The power asked for is a negative one, x^{-N}, reached by an r short of n, with the coefficient at most 10^7, a calculator\'s whole number, as -108864. Near 2024 P2 Q5, whose second term is 1 over a power: here its number, b, is what (a)\'s simplifying works on, as the paper\'s (-2)^r.',
  },
  {
    card: '2019 Q9',
    skill: 'The general term of a binomial expansion with an unknown constant $d$, simplified, then $d$ from the coefficient of a negative power.',
    marks: [3, 2],
    route: '3 + 2 - (a) the general term with n choose r and both powers, (ax^p)^{n-r}(-d/x^q)^r; the powers of x or the numbers simplified; the whole term, n choose r a^{n-r}(-d)^r x^{pn-(p+q)r}; (b) the power set equal to the one asked for and solved for r; that r put back and the coefficient set equal to the given value, so d.',
    ranges: 'The paper: (2x^2 - d/x^3)^7, the coefficient of 1/x is -70 000, r = 3, d = 5. n from 5 to 9 (the paper\'s 7), a 2 (the paper) or 3, the powers of x any two different from 1 to 3 (the paper\'s 2 and 3); the power asked for 1/x to 1/x^4 (the paper\'s 1/x), always reached at r = 3, as the paper\'s, so d comes from a cube root and (-d)^3 = -d^3 has one real d; d from 2 to 6 (the paper\'s 5); the coefficient within a million, as -70 000. A near relation of 2023 P2 Q5 and 2024 P2 Q5 (locked), which give the constant and ask for the coefficient: here the coefficient is given and the constant asked for.',
  },
  {
    card: '2018 Q3',
    skill: 'The general term of $\\left(ax + \\frac{b}{x^{2}}\\right)^{n}$, simplified; then the term independent of $x.$',
    marks: [3, 2],
    route: '3 + 2 - (a) the general term with n choose r and both powers; the numbers or the powers of x collected; the whole term, (n choose r) a^{n-r} b^r x^{n-3r}; (b) n - 3r = 0, so r; the term evaluated. Putting x = 0 is not "independent of x".',
    ranges: 'The paper: (2x + 5/x^2)^9, r = 3, 672000. n is 6 or 9 (the paper\'s 9), so n/3 is whole; a from 2 to 4 (the paper\'s 2) and b from 2 to 9 (the paper\'s 5), the term at most a million (the paper\'s 672000). Always ax and b/x^2, as the paper. 29 questions.',
  },
  {
    card: '2017 Q1',
    skill: 'Expand $\\left(\\frac{a}{y^{2}} - by\\right)^{3}$ by the binomial theorem, and simplify.',
    marks: [4],
    route: 'The four terms written out, each with 3 choose k and both powers; then the signs resolved, the coefficients and the powers of y simplified, which the scheme marks together, to a^3/y^6 - 3a^2b/y^3 + 3ab^2 - b^3y^3. A y^0 left in the answer loses the last mark.',
    ranges: 'The paper: (2/y^2 - 5y)^3, answer 8/y^6 - 60/y^3 + 150 - 125y^3. a from 1 to 5 (the paper\'s 2) and b from 1 to 6 (the paper\'s 5), not both 1 and sharing no factor, as 2 and 5 (a paper never prints 2/y^2 - 4y); always a over y^2 minus a multiple of y, as the paper, so the powers are y^{-6}, y^{-3}, a constant and y^3 on every draw. The biggest number, 3ab^2, at most 540: a calculator paper. A near relation of 2025 P1 Q1 and 2026 P2 Q2 (locked), fourth powers in x. 20 questions.',
  },
  {
    card: '2016 Q3',
    skill: 'The general term of $\\left(\\frac{a}{x} - bx\\right)^{n}$, simplified, then the term in a positive power of $x.$',
    marks: [5],
    route: 'The general term with n choose r and both powers, (a/x)^{n-r}(-bx)^r; the numbers and signs, (a)^{n-r}(-b)^r, or the powers of x, x^{2r-n}; the simplified term, n choose r (a)^{n-r}(-b)^r x^{2r-n}; 2r - n set equal to the power asked for, so r; the term evaluated, with its power of x.',
    ranges: 'The paper: (3/x - 2x)^13 and the term in x^9 (r = 11, -1437696x^9). n from 8 to 13 (the paper\'s 13), a from 2 to 5 and b 2 or 3 (the paper\'s 3 and 2), sharing no factor, as 3 and 2, so the signs and the numbers both have something to simplify (b = 1 would leave (-1)^r); always a over x minus a multiple of x, as the paper. The power asked for positive, x^2 or more (the paper\'s x^9), reached by an r short of n (the last term has no power of a); the term at most 10^7 in size, a calculator\'s whole number, as -1437696. 70 questions. A near relation of 2023 P2 Q5 and 2024 P2 Q5 (locked), which ask for a negative power: here a positive one, and the term, not the coefficient, as the paper.',
  },
];
