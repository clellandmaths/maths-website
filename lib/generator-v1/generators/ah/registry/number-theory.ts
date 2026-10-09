/**
 * Advanced Higher, Number Theory: what each card is.
 * The routines are in `../routines/number-theory.ts`, under the same labels.
 */
import type { CardMeta } from '../types';

export const NUMBER_THEORY: readonly CardMeta[] = [
  {
    card: '2021 P2 Q2',
    skill: 'The Euclidean algorithm to write the gcd of two numbers as $Aa + Bb$, then hence scale it to a multiple of the gcd.',
    marks: [3, 1],
    route: '3 + 1 - (a) the algorithm to its zero remainder; the gcd equated with the third line and the second substituted; a and b; (b) x and y as a and b times the multiple.',
    ranges: 'The paper: 105a + 72b = 3, a = 11, b = -16; 105x + 72y = 360, x = 1320, y = -1920. Built from the bottom line up, four lines as the paper\'s (quotients 1, 2, 5, 2): the gcd from 2 to 9 (the paper\'s 3), the quotients from 1 to 3, 1 to 3, 2 to 6 and 2 to 4, the larger number from 60 to 400 and the smaller from 30 to 250, as 105 and 72. (b)\'s right-hand side the gcd times a round number from 20 to 150 (the paper\'s 120). A near relation of 2026 P2 Q4 (locked), with the same four-line shape: its own routine.',
  },
  {
    card: '2022 P2 Q3',
    skill: 'Use the Euclidean algorithm to write 1 as a combination of two coprime numbers.',
    marks: [3],
    route: 'The algorithm\'s lines down to the remainder 1, in the scheme\'s order (634 = 7 x 87 + 25); working backwards, 1 in terms of the second number and the first remainder; then that remainder replaced so only the two numbers are left, and a and b stated.',
    ranges: 'The paper: 634a + 87b = 1, quotients 7, 3, 2, remainders 25, 12, 1, a = 7, b = -51. Built from the bottom up, the answer first: the second remainder from 2 to 20, quotients 2 to 9, 1 to 4 and 1 to 4, always three lines to the remainder 1, as the paper; the first number three digits (200 to 999) and the second two (40 to 99), as 634 and 87. Always = 1, as the paper\'s; a positive and b negative always, as the paper\'s. Near 2024 P2 Q2 (the gcd given, four lines, two three-digit numbers), with its own routine.',
  },
  {
    card: '2026 P2 Q4',
    skill: 'Find a greatest common divisor by the Euclidean algorithm, then write it as a combination of the two numbers.',
    marks: [1, 2],
    route: '1 + 2 - (a) the algorithm\'s lines down to remainder 0, and d named; (b) working backwards, the gcd in terms of the second number and the first remainder, then that remainder replaced so only the two numbers are left, and a and b read off. A right a and b with no working backwards earns nothing in (b).',
    ranges: 'The paper: 1428 and 567, gcd 21, four lines with quotients 2, 1, 1, 13, and a = 2, b = -5. Built from the bottom up, so the answer is chosen first: d from 7 to 40, quotients 2 to 4, 1 to 3, 1 to 3 and 2 to 15, always four lines as the paper; the first number has four digits and the second three, as 1428 and 567. Four lines always give a positive and b negative, as the paper\'s.',
  },
  {
    card: '2026 P2 Q9',
    skill: 'Convert a number from one base to another, through base 10.',
    marks: [3],
    route: 'The number in base 10 from its digits\' powers; repeated division by the new base with every remainder; the remainders read from the last to the first. Treating the digits as base 10 loses the first mark.',
    ranges: 'The paper: 3442 in base 5 to base 9 (497). The first base from 3 to 7 and the second larger, up to 9, as 5 to 9 is; four digits in the first base and three in the second, as the paper\'s; no zero digit in either, as the paper has none.',
  },
  {
    card: '2025 P2 Q4',
    skill: 'Find a greatest common divisor by the Euclidean algorithm, then hence write it as a combination of the two numbers.',
    marks: [1, 2],
    route: '1 + 2 - (a) the algorithm\'s lines down to remainder 0, and d named; (b) working backwards, the gcd in terms of the first remainder and the second number, then that remainder replaced so only the two numbers are left, and a and b read off. A right a and b with no working backwards earns nothing in (b).',
    ranges: 'The paper: 1118 and 416, gcd 26, four lines with quotients 2, 1, 2, 5, and a = 3, b = -8. Built from the bottom up, the answer first: d from 7 to 40, quotients 2 to 4, 1 to 3, 1 to 3 and 2 to 9, always four lines as the paper; the first number four digits and the second three. The same shape as 2026 P2 Q4, whose paper asks the same thing: its own routine, so neither moves the other.',
  },
  {
    card: '2024 P2 Q2',
    skill: 'Use the Euclidean algorithm to write a given gcd as a combination of two numbers.',
    marks: [3],
    route: 'The algorithm\'s lines down to remainder 0 (the last in brackets, as the scheme\'s); working backwards, the gcd in terms of the two numbers, d = (A - B q1) a - q3 B; then a and b stated.',
    ranges: 'The paper: 533a + 455b = 13, quotients 1, 5, 1, 5, a = 6, b = -7. Built from the bottom up, the answer first: d from 5 to 40, quotients 1 to 2, 1 to 6, 1 to 3 and 2 to 9, always four lines as the paper, and both numbers three digits, as 533 and 455. The gcd is given in the question, as the paper\'s; a positive and b negative always, as the paper\'s. Near 2025 P2 Q4 and 2026 P2 Q4, which ask for the gcd first and have a four-digit number.',
  },
  {
    card: '2023 P2 Q6',
    skill: 'Find a greatest common divisor by the Euclidean algorithm, write it as a combination of the two numbers, then hence a multiple of it.',
    marks: [1, 2, 1],
    route: '1 + 2 + 1 - (a) the algorithm\'s lines down to remainder 0, and d; (b) working backwards, the gcd in terms of the first remainder and the second number, then that remainder replaced so only the two numbers are left, and a and b; (c) the multiple of d, and a and b scaled by it, named p and q.',
    ranges: 'The paper: 703 and 399, gcd 19, four lines with quotients 1, 1, 3, 5, a = 4, b = -7; then 76 = 4 x 19, p = 16, q = -28. Built from the bottom up, the answer first: d from 5 to 40, quotients 1 to 2, 1 to 3, 1 to 4 and 2 to 9, always four lines as the paper, both numbers three digits, as 703 and 399. (c)\'s number is 2 to 6 times d (the paper\'s 4). Near 2025 P2 Q4 and 2026 P2 Q4 (a four-digit number, no (c)) and 2024 P2 Q2 (three digits, gcd given).',
  },
  {
    card: '2023 P2 Q9',
    skill: 'Convert a base 10 number to another base by repeated division.',
    marks: [2],
    route: 'Repeated division by the base, every remainder written, until the quotient is 0; the remainders read from the last to the first.',
    ranges: 'The paper: 572 in base 9 (705). The base from 5 to 9 (the paper\'s 9) and the number from 100 (and the base squared) to the base cubed less 1, so it has three digits in both, as 572 and 705. A zero digit may come, as the paper\'s 0 does. Near 2026 P2 Q9, which converts from one base to another through base 10.',
  },
  {
    card: '2019 Q12',
    skill: 'Convert a number from one base to a smaller one, through base 10.',
    marks: [3],
    route: 'The number in base 10, each digit times its power of the base; repeated division by the new base, every remainder written, down to a quotient of 0; the remainders read from the last to the first. Treating the given digits as base 10 loses the first mark.',
    ranges: 'The paper: 231 in base 11 = 276 = 543 in base 7. The first base from 8 to 12 (the paper\'s 11) and the new one from 4 to 9 and smaller (the paper\'s 7), the number three digits in both, as 231 and 543, with no 0 in either and no digit above 9, so no letter digits. A near relation of 2026 P2 Q9 (locked), four digits into three in a larger base: its own routine.',
  },
  {
    card: '2018 Q5',
    skill: 'The Euclidean algorithm, then back-substitution: integers $a$ and $b$ with $Aa + Bb = d$, $d$ given.',
    marks: [4],
    route: 'The first two lines of the algorithm; the rest, down to the remainder d; d written in terms of A and B by working back; a and b stated, as well as the final equation.',
    ranges: 'The paper: 306a + 119b = 17, a = 2, b = -5, four lines with quotients 2, 1, 1, 3. Built from the bottom line up, four lines, as the paper\'s: d from 7 to 30 (the paper\'s 17); quotients from 1 to 4, 1 to 3, 1 to 3 and 2 to 5; A three digits, from 200 (the paper\'s 306), and B at least 100 (the paper\'s 119). The gcd is given in the question, as the paper\'s. Near the locked Euclid cards (2021 P2 Q2 to 2026 P2 Q4), on its own routine.',
  },
  {
    card: '2017 Q8',
    skill: 'The Euclidean algorithm, then back-substitution: integers $a$ and $b$ with $Aa + Bb = d$, $d$ given, four-digit numbers.',
    marks: [4],
    route: 'The first line of the algorithm; the rest, down to the remainder d (and 0); d written in terms of r1 and B, d = r1 - q3(B - q2 r1), as the scheme\'s third mark; a and b stated.',
    ranges: 'The paper: 1595a + 1218b = 29, a = 13, b = -17, four lines with quotients 1, 3, 4, 3. Built from the bottom line up, four lines, as the paper\'s: d from 11 to 40 (the paper\'s 29); quotients from 1 to 3, 1 to 4, 1 to 5 and 2 to 5; both numbers four digits, as 1595 and 1218, the larger under 5000. The gcd is given in the question, as the paper\'s. The same question as 2018 Q5 with bigger numbers, and near the other locked Euclid cards (2021 P2 Q2 to 2026 P2 Q4): its own routine, a family label at the port.',
  },
];
