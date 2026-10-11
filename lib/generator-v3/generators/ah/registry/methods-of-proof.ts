/**
 * Advanced Higher, Methods of Proof: what each card is.
 * The routines are in `../routines/methods-of-proof.ts`, under the same labels.
 */
import type { CardMeta } from '../types';

export const PROOF: readonly CardMeta[] = [
  {
    card: '2021 P2 Q10',
    skill: 'Prove by induction, from $n = 2$, a sum of reciprocals of two consecutive linear factors.',
    marks: [5],
    route: 'True for n = 2, both sides worked out (the sum starts at r = 2, so n = 1 is not the base case); assume true for n = k and consider n = k + 1; the sum to k + 1 as the assumption plus the next term; as a single fraction; simplified to the statement at k + 1, written in terms of k + 1, with the conclusion in full (true for n = 2 and for all n >= 2).',
    ranges: 'The paper: the sum from r = 2 of 1/(r(r - 1)) is (n - 1)/n. The paper alone makes 1 question, so, as on 2025 P2 Q15 and 2023 P2 Q12, a family in the paper\'s steps: c/((r + a)(r + a - 1)) from r = 2, with a from 0 (the paper) to 3 and c from 1 (the paper) to 4 (the owner on the 2021 P2 sheet, from 3: "Do number in front up to 4"), so 1/(r(r - 1)), 2/(r(r + 1)), 3/((r + 2)(r + 3)) and so on. It telescopes to c(n - 1)/((1 + a)(n + a)), with c/(1 + a) in lowest terms in front, and the step\'s numerator is always (k - 1)(k + a + 1) + (1 + a) = k(k + a), as the paper\'s (k - 1)(k + 1) + 1 = k^2, so the step cancels the same way. Always from r = 2 and n >= 2, the point of the card. 16 questions.',
  },
  {
    card: '2022 P2 Q9',
    skill: 'Prove by induction a formula for the $n$th power of a 2 by 2 matrix.',
    marks: [5],
    route: 'True for n = 1, the right-hand side worked out; true for n = k assumed, A^k written, A^{k+1} considered; A^{k+1} = A A^k by the assumption; the matrices multiplied; each entry simplified to the form for k + 1, and the conclusion in full. The final matrix without the algebra of each entry loses the last mark.',
    ranges: 'The paper: A = (3 -2; 0 1), A^n = (3^n 1 - 3^n; 0 1). The card: A = (a b; 0 1) with a from 2 to 9 (the paper\'s 3) and b = -(a - 1), giving 1 - a^n as the paper\'s, or b = a - 1, giving a^n - 1: a sign, the same steps. Always 0 and 1 on the bottom row: another number there would add a cancelling step the paper does not have (a c^k term on each side). 16 questions.',
  },
  {
    card: '2022 P1 Q6',
    skill: 'Disprove "for all odd $n$, $n^{2} + c$ is prime" by counterexample, then prove directly that the difference between the cubes of two consecutive integers is not divisible by 3.',
    marks: [1, 3],
    route: '1 + 3 - (a) a counterexample, the composite number and that it is not prime, all three (n = 9, 85, not prime); (b) the form of two consecutive integers with the letter an integer, n, n + 1, n in Z; then the difference of the cubes, (n + 1)^3 - n^3; then multiplied out to 3(n^2 + n) + 1 and said to be not divisible by 3.',
    ranges: 'The paper: n^2 + 4 (false first at n = 9, 85 = 5 x 17), and consecutive integers, 3(n^2 + n) + 1. Nothing numerical varies in the proof. (a) n^2 + c with c even, whose first counterexample is at n = 3 to 9, so a pupil tries a few, as the paper\'s: c = 2, 4 (the paper), 6, 10, 12, 16, 18, 28 or 30; an odd c makes every value even, and c = 8, 14, 20, 24, 26 fail at n = 1. (b) the paper\'s consecutive integers, or consecutive odd integers 2n + 1 and 2n + 3, or even 2n and 2n + 2, each 3(...) + 2, in the same three steps, as 2024 P2 Q11 was widened. 27 questions.',
  },
  {
    card: '2026 P2 Q12',
    skill: 'Prove by induction that $a^{n} + b$ is divisible by $d.$',
    marks: [5],
    route: 'True for n = 1 with the substitution shown; "assume true for n = k" in those words and n = k + 1 considered; a^{k+1} + b written with a^k; the hypothesis used to replace a^k; a factor of d taken out and the conclusion in full.',
    ranges: 'The paper: 7^n + 2 divisible by 3. d from 3 to 6; a one more than a multiple of d and b one less, both up to 13, so the statement is true for every n and the step factorises exactly as the paper\'s: a(dm - b) + b = d(am - b(a - 1)/d).',
  },
  {
    card: '2026 P2 Q15',
    skill: 'Write the contrapositive of "if $r$ is irrational then the $n$th root of $r$ is irrational", and use it to prove the statement.',
    marks: [1, 3],
    route: '1 + 3 - (a) the contrapositive: if the root is rational then r is rational; (b) the root as p/q, p and q integers, q not zero, and r = p^n/q^n; which is rational, so the contrapositive is true and so is the statement. A proof by contradiction earns the middle two marks only.',
    ranges: 'The paper\'s statement, with the root varying: square (the paper), cube, fourth, fifth or sixth. The proof is the same three steps with the power changing, and letters are not a different question. The sixth root was added on the AH widening sheet so that, with the paper\'s own question kept out, the card still makes 4 (one over the root was offered and not taken). 5 questions, under the floor of 12, so exempt on the owner\'s word.',
    exempt: {
      why: 'A standard contrapositive proof whose only number is the root: square to sixth roots make 5 questions, 4 once the paper\'s own is kept out.',
      owner: 'The owner on the 2026 P2 sheet, 2026-09-29: "What about any root of r?", then "Yes" to "Roots 2 to 5, exempt (4 questions)?"; on the AH widening sheet, 2026-10-10, "A" (the sixth root as well).',
    },
  },
  {
    card: '2025 P2 Q15',
    skill: 'Prove a sum of reciprocals of two linear factors by induction.',
    marks: [5],
    route: 'True for n = 1, both sides worked out; assume true for n = k and consider n = k + 1; the sum to k + 1 as the assumption plus the next term; as a single fraction; factorised and cancelled to the statement at k + 1, with the conclusion in full. "LHS = RHS" alone for n = 1 does not earn the mark.',
    ranges: 'The paper: the sum of 1/((2r + 1)(2r - 1)) is n/(2n + 1). The factors (ar + b)(ar + b - a), which differ by a as the paper\'s by 2, so the sum telescopes to n/(b(an + b)); a from 2 to 6 and b from 1 to 5 sharing no factor with it (the paper\'s a = 2, b = 1). The proof is the paper\'s five steps with these numbers. 16 questions.',
  },
  {
    card: '2024 P2 Q11',
    skill: 'Disprove one statement about two consecutive integers by counterexample, and prove the other directly.',
    marks: [3],
    route: 'Statement A by a counterexample, with why it fails; for B the form of two consecutive integers, k and k + 1 with k an integer (the mark needs it); then the algebra shown to be 2(...) + 1, odd, and said so.',
    ranges: 'The paper: the sum of the squares of two consecutive integers, "always prime" (false, 3^2 + 4^2 = 25) and "always odd" (true, 2(k^2 + k) + 1). Nothing numerical varies. Honest beside it, each in the same three steps (a counterexample, the form of the integers, the algebra): the difference between the squares (prime false, odd true); and for two consecutive odd integers, 2k + 1 and 2k + 3, the sum (a multiple of 4 false, even true) and the difference (a multiple of 16 false, of 8 true); and for two consecutive even integers, 2k and 2k + 2, the sum and the difference (a multiple of 8 false, of 4 true); and for two consecutive multiples of 3, 3k and 3k + 3, the sum and the difference (a multiple of 18 false, of 9 true). The owner asked for more than 2 on the 2024 P2 sheet ("More please"), and the multiples of 3 were added on the AH widening sheet so seven remain once the paper\'s own is kept out. 8 questions, under the floor of 12, so exempt on the owner\'s word.',
    exempt: {
      why: 'A counterexample and a direct proof about two consecutive integers, with nothing numerical to vary: the eight statements (the sum or difference of the squares of consecutive integers, odd integers, even integers or multiples of 3) keep the paper\'s three steps; past them a statement needs a step the paper does not have, or repeats another card\'s proof (the sum of three consecutive integers is 2018 Q9(a)\'s).',
      owner: 'The owner on the 2024 P2 sheet, 2026-09-29: "More please" (from 2), then "Yes" to "exempt at 6?"; on the AH widening sheet, 2026-10-10, "A" (consecutive multiples of 3 as well).',
    },
  },
  {
    card: '2023 P1 Q8',
    skill: 'Disprove a statement about two integers and their squares by counterexample, then prove directly that $n^{2} + c$ is divisible by 4 for odd $n.$',
    marks: [1, 2],
    route: '1 + 2 - (a) a counterexample, with why it fails (a = -2, b = 1: 4 is not less than 1); (b) the form of an odd integer, 2k + 1 with k an integer (natural numbers are not enough); then n^2 + c expanded, 4 taken out, and said to be divisible by 4.',
    ranges: 'The paper: "if a < b then a^2 < b^2", false (a = -2, b = 1), and n odd, n^2 - 1 divisible by 4. Nothing numerical varies in (a). Honest beside it, each broken the same way by a negative integer in the paper\'s one step: "if a > b then a^2 > b^2", its two converses ("if a^2 < b^2 then a < b", "if a^2 > b^2 then a > b"), and "if a^2 = b^2 then a = b". (b) n^2 + c with c one less than a multiple of 4, -1 (the paper), 3, -5 or 7, so (2k + 1)^2 + c = 4(k^2 + k + (1 + c)/4) in the paper\'s two steps. Always n odd. 20 questions.',
  },
  {
    card: '2023 P2 Q12',
    skill: 'Prove by induction a sum of a power of $a$ times a linear term in $r.$',
    marks: [5],
    route: 'Both sides at n = 1 worked out; the assumption for n = k with the sum to k + 1 aimed at; the sum to k + 1 as the assumption plus the next term; the common factor a^k taken out and simplified, a^k · a(k + c); then the sum in terms of k + 1, and the conclusion in full.',
    ranges: 'The paper: the sum of 2^{r-1}r is 2^n(n - 1) + 1. Nothing numerical varies in it: its one number, 2, is the base. The paper alone makes 1 question, so, as on 2025 P2 Q15 and 2024 P2 Q11, every honest variant in the paper\'s steps: the base a from 2 to 5, with the term a^{r-1}((a - 1)r - (a - 2)), and the sum shifted by c = 0 (the paper), 2, 3 or 4, adding c(a - 1) to each term. The sum is then a^n(n - 1 + c) + 1 - c, and the step always takes out a^k to leave a^k · a(k + c), as the paper\'s 2^k · 2k + 1. So 2^{r-1}r, 3^{r-1}(2r - 1), 2^{r-1}(r + 2), 5^{r-1}(4r + 9) and so on. 16 questions.',
  },
  {
    card: '2019 Q11',
    skill: 'Disprove "$n^{2} + bn + c$ is always prime" by counterexample, then write the contrapositive of a parity statement and prove it.',
    marks: [1, 1, 3],
    route: '1 + 1 + 3 - (a) a counterexample, the value and why it is not prime; (b)(i) the contrapositive, starting with the condition on n: if n is even then n^2 + Bn + C is odd; (b)(ii) n = 2k with k a natural number, and substituted; then 2(…) + 1, odd since the bracket is a natural number; then the contrapositive true, and so the original statement.',
    ranges: 'The paper: n^2 + n + 1 (n = 4 gives 21), and n^2 - 2n + 7, 4k^2 - 4k + 7 = 2(2k^2 - 2k + 3) + 1. (a) n^2 + bn + c with b 1, 3 or 5 and c odd from 1 to 11, so every value is odd and no counterexample is a plain even number, and only those whose first counterexample is n = 2 to 6 (the paper\'s 4). (b) B even from ±2 to ±6 (the paper\'s -2) and C odd from 1 to 15 (the paper\'s 7), so the statement is true, and the bracket 2k^2 + Bk + (C - 1)/2 is a natural number for every k, as the paper\'s.',
  },
  {
    card: '2019 Q14',
    skill: 'Prove by induction a sum of a factorial times its number.',
    marks: [5],
    route: 'Both sides at the first n worked out ("LHS = RHS" alone is not enough); the assumption for n = k with the sum to k + 1 aimed at; the sum to k + 1 as the assumption plus the next term; the factorial (k + s + 1)! taken out as a common factor; the sum in terms of k + 1, and the conclusion in full.',
    ranges: 'The paper: the sum of r!r from 1 is (n + 1)! - 1. Nothing numerical varies in it. The paper alone makes 1 question, so, as on 2021 P2 Q10 and 2023 P2 Q12, a family in the paper\'s steps: the sum from r = m of (r + s)!(r + s) is (n + s + 1)! - (m + s)!, with the start m 1 (the paper) to 4 and the shift s 0 (the paper) to 3. The step always takes out (k + s + 1)!, as the paper\'s (k + 1)!. No number in front, since 2r!r reads as (2r)!r. 16 questions.',
  },
  {
    card: '2018 Q9',
    skill: 'Two direct proofs: a sum of consecutive integers is divisible by a number; a number in general form splits as stated.',
    marks: [2, 1],
    route: '2 + 1 - (a) the sum written with one letter; collected, and why it is divisible; (b) the number in general form, the letter said to be an integer, split as the statement says.',
    ranges: 'The paper: (a) three consecutive integers, divisible by 3; (b) any odd integer as the sum of two consecutive integers. Nothing numerical varies, so the paper alone makes 1 question. Built in the paper\'s steps, for the owner to choose on the sheet: (a) three consecutive integers (the paper) or five (by 5), three consecutive even integers (by 6) or three consecutive odd integers (by 3); (b) the paper\'s, any multiple of 4 as the sum of two consecutive odd integers, any odd integer as the difference of the squares of two consecutive integers, or any multiple of 3 as the sum of three consecutive integers. 16 questions.',
  },
  {
    card: '2018 Q12',
    skill: 'Proof by induction that the sum of $c \\cdot a^{r - 1}$ from 1 to $n$ is $\\frac{c(a^{n} - 1)}{a - 1}.$',
    marks: [5],
    route: 'Both sides at n = 1 worked out ("LHS = RHS" alone is not enough); the assumption for n = k, and the sum to k + 1 aimed at; the sum to k + 1 as the assumption plus c·a^{(k+1)-1}; the terms in a^k combined; the result in terms of k + 1, with the conclusion in full.',
    ranges: 'The paper: the sum of 3^{r-1} is (1/2)(3^n - 1). a from 2 to 7 (the paper\'s 3); a alone makes 6, so a number in front of each term, c from 1 (the paper) to 3, as the owner allowed on 2021 P2 Q10, the right-hand side c/(a - 1) in lowest terms (whole, or nothing, when a - 1 divides c). 18 questions.',
  },
  {
    card: '2017 Q13',
    skill: 'Prove by contrapositive that if $n^{p} + b$ is even (or odd) then $n$ has a stated parity.',
    marks: [4],
    route: 'The contrapositive written, the condition on n first: if n is odd then n^2 is odd; n in the right general form, 2k + 1 or 2k with k an integer; the expression worked out as 2(…) + 1 or 2(…), with why it is odd or even; the contrapositive true, so the original statement.',
    ranges: 'The paper: if n^2 is even then n is even, the contrapositive if n is odd then n^2 is odd, n = 2k + 1, n^2 = 2(2k^2 + 2k) + 1. A proof card with no numbers: n^2 or n^3, plus b from 0 (the paper) to 3, said to be even or odd, each a true statement whose contrapositive takes one case in the paper\'s steps (16 questions, every one with the same four marks). Offered for the owner to choose, as 2018 Q9\'s family was; exempt at 1 is the alternative. A near relation of 2019 Q11(b) (locked), the contrapositive of a parity statement about n^2 + Bn + C.',
  },
  {
    card: '2016 Q5',
    skill: 'Prove by induction that the sum of $r(3r + b)$ from 1 to $n$ is $n(n + 1)(n + c).$',
    marks: [4],
    route: 'Both sides at n = 1 worked out; the assumption for n = k ("assume", not "consider") and the sum to k + 1 as the sum to k plus (k + 1)(3(k + 1) + b); the assumption used, (k + 1) taken out and what is left factorised, (k + 1)(k + 2)(k + 1 + c); the result in terms of k + 1, with the conclusion in full.',
    ranges: 'The paper: the sum of r(3r - 1) is n^2(n + 1). The sum of r(3r + b) is n(n + 1)(n + c) with c = (1 + b)/2, whole only for b odd; b never a multiple of 3, where r(3r + b) has a factor a paper would take out; b from -1 (the paper) to 25, so every term is positive, as the paper\'s, c from 0 to 13, and the same four steps on every draw. Three printings of one question: n^2(n + 1) at c = 0 (the paper), n(n + 1)^2 at c = 1, n(n + 1)(n + c) otherwise. 23 and 25 were added on the AH widening sheet, so nine remain once the paper\'s own is kept out. 10 statements, below the floor, exempt at 10.',
    exempt: {
      why: 'A proof card: r(3r + b) with b odd, not a multiple of 3 and every term positive, as the paper\'s, from -1 to 25, makes 10 statements in the paper\'s four steps; b = -5 and -7 would start the sums negative.',
      owner: 'On the 2016 sheet, 2026-10-04, "Yes" to "Exempt at 8?"; on the AH widening sheet, 2026-10-10, "A" (b on to 25).',
    },
  },
  {
    card: '2016 Q10',
    skill: 'Disprove "if $p$ is prime then so is $ap + b$" by counterexample, then prove directly that a number with remainder $r$ on division by $m$ has a cube with remainder $r$ too.',
    marks: [4],
    route: 'A: a prime p with ap + b not prime, its factors shown, and "false"; B: n = ma + r with a a whole number; (ma + r)^3 expanded, four terms; written m(…) + r, with the conclusion, "true". The scheme takes any counterexample; the working gives the first.',
    ranges: 'The paper: 2p + 1 (false first at p = 7, 15 = 3 × 5), and remainder 1 on division by 3, 27a^3 + 27a^2 + 9a + 1 = 3(9a^3 + 9a^2 + 3a) + 1. A: ap + b with a 2, 4 or 6 and b odd from -5 to 19, so every value is odd and no counterexample is a plain even number, as 2p + 1; only those true at p = 2 and false first at a prime from 3 to 11, so a pupil tries a few, as the paper\'s. B: m from 2 to 5 with r = 1 or m - 1, the remainders whose cube leaves the same remainder, so the paper\'s words "also has remainder r" hold on every draw; always a cube, four terms, as the paper\'s. A is always the false one and B the true one, as the paper, as 2022 P1 Q6, 2019 Q11 and 2024 P2 Q11 keep theirs. 23 A statements and 7 B statements, 161 questions.',
  },
];
