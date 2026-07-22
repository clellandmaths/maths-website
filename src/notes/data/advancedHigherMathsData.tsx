import React from 'react';

import { InlineMath, BlockMath } from '@/src/notes/math-components';
import { Section } from '@/src/notes/types';

// Advanced Higher Maths course notes.
// Structure mirrors the 14 Qualifications Scotland (QS) topic areas, matching
// maths.scot and the Explorer's AH filters. Being rebuilt section by section
// with fully worked, independently-verified examples. Videos deferred.

export const advancedHigherMathsData: Section[] = [
  {
    id: "binomial-theorem",
    title: "Binomial Theorem",
    topics: [
      {
        id: "binomial-expansion",
        title: "1. Binomial Expansion",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>The Binomial Theorem lets us expand <InlineMath math="(a+b)^n" /> without multiplying out every bracket. For a positive integer <InlineMath math="n" />:</p>
            <BlockMath math="(a+b)^n = \sum_{r=0}^{n} \binom{n}{r} a^{n-r} b^r" />
            <p>Here <InlineMath math="\binom{n}{r} = \dfrac{n!}{r!\,(n-r)!}" /> is the binomial coefficient — the <InlineMath math="{}^nC_r" /> button on your calculator, or the entries of a row of Pascal's triangle. For example, the coefficients for <InlineMath math="n=4" /> are <InlineMath math="1,\ 4,\ 6,\ 4,\ 1" />.</p>
            <p><strong>The Golden Rule:</strong> the power of the first term counts <strong>down</strong> from <InlineMath math="n" /> to <InlineMath math="0" />, while the power of the second term counts <strong>up</strong> from <InlineMath math="0" /> to <InlineMath math="n" />. In every term the two powers must add up to <InlineMath math="n" />.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Not raising the whole term to the power:</strong> <InlineMath math="(2x)^3 = 8x^3" />, not <InlineMath math="2x^3" />. The coefficient must be raised to the power as well as the variable.</li>
                <li><strong>Sign slips with a negative second term:</strong> in <InlineMath math="(a-b)^n" /> the signs alternate <InlineMath math="+,\,-,\,+,\,-\dots" /> — write the bracket as <InlineMath math="(a+(-b))^n" /> to keep track.</li>
                <li><strong>Miscounting the coefficients:</strong> use <InlineMath math="{}^nC_r" /> on the calculator rather than trying to extend Pascal's triangle from memory under exam pressure.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "binomial-expansion-ex1",
            question: <p>Expand <InlineMath math="(2x + 3)^4" /> fully.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write out the expansion using <InlineMath math="n=4" />, with the coefficients <InlineMath math="1,4,6,4,1" />:</p>
                <BlockMath math="(2x+3)^4 = (2x)^4 + 4(2x)^3(3) + 6(2x)^2(3)^2 + 4(2x)(3)^3 + (3)^4" />
                <p><strong>Step 2:</strong> Evaluate each power and coefficient:</p>
                <BlockMath math="= (16x^4) + 4(8x^3)(3) + 6(4x^2)(9) + 4(2x)(27) + 81" />
                <p><strong>Step 3:</strong> Simplify:</p>
                <BlockMath math="= 16x^4 + 96x^3 + 216x^2 + 216x + 81" />
              </div>
            )
          },
          {
            id: "binomial-expansion-ex2",
            question: <p>Expand <InlineMath math="\left(x - \dfrac{2}{x}\right)^4" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write the general term. With <InlineMath math="a = x" /> and <InlineMath math="b = -\dfrac{2}{x}" />:</p>
                <BlockMath math="\binom{4}{r} x^{4-r}\left(-\frac{2}{x}\right)^r = \binom{4}{r}(-2)^r x^{4-2r}" />
                <p><strong>Step 2:</strong> Evaluate for <InlineMath math="r = 0,1,2,3,4" />:</p>
                <BlockMath math="\begin{aligned} r=0:&\ \ x^4 \\ r=1:&\ -8x^2 \\ r=2:&\ \ 24 \\ r=3:&\ -\frac{32}{x^2} \\ r=4:&\ \ \frac{16}{x^4} \end{aligned}" />
                <p><strong>Step 3:</strong> Collect the terms:</p>
                <BlockMath math="\left(x - \frac{2}{x}\right)^4 = x^4 - 8x^2 + 24 - \frac{32}{x^2} + \frac{16}{x^4}" />
              </div>
            )
          }
        ]
      },
      {
        id: "general-term",
        title: "2. General Term & Coefficients",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>Often an exam asks only for one term — the term in <InlineMath math="x^5" />, or the constant term — so expanding everything is wasted effort. Instead, use the <strong>general term</strong> (the <InlineMath math="(r+1)" />th term) of <InlineMath math="(a+b)^n" />:</p>
            <BlockMath math="T_{r+1} = \binom{n}{r} a^{n-r} b^r" />
            <p><strong>The Golden Rule:</strong> find <InlineMath math="r" /> first. Write the general term, simplify the power of <InlineMath math="x" /> to a single expression in <InlineMath math="r" />, set it equal to the power you need, and solve for <InlineMath math="r" />. Only then substitute back to evaluate that one term.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Off-by-one:</strong> it is the <InlineMath math="(r+1)" />th term, so <InlineMath math="r" /> starts at <InlineMath math="0" />. The term in <InlineMath math="x^k" /> is not the <InlineMath math="k" />th term.</li>
                <li><strong>&ldquo;Independent of <InlineMath math="x" />&rdquo; means power zero:</strong> the constant term is the one where the total power of <InlineMath math="x" /> equals <InlineMath math="0" />.</li>
                <li><strong>Index algebra:</strong> when combining <InlineMath math="x^{n-r}" /> with <InlineMath math="x^{-r}" /> you get <InlineMath math="x^{n-2r}" /> — a very common place to slip.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "general-term-ex1",
            question: <p>Find the term independent of <InlineMath math="x" /> in the expansion of <InlineMath math="\left(2x + \dfrac{1}{x}\right)^6" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write the general term with <InlineMath math="a = 2x" />, <InlineMath math="b = \dfrac{1}{x}" />, <InlineMath math="n = 6" />:</p>
                <BlockMath math="T_{r+1} = \binom{6}{r}(2x)^{6-r}\left(\frac{1}{x}\right)^r = \binom{6}{r}2^{6-r}\,x^{6-2r}" />
                <p><strong>Step 2:</strong> &ldquo;Independent of <InlineMath math="x" />&rdquo; means the power of <InlineMath math="x" /> is zero:</p>
                <BlockMath math="6 - 2r = 0 \implies r = 3" />
                <p><strong>Step 3:</strong> Substitute <InlineMath math="r=3" /> into the general term:</p>
                <BlockMath math="T_4 = \binom{6}{3}2^{3} = 20 \times 8 = 160" />
                <p>The term independent of <InlineMath math="x" /> is <InlineMath math="160" />.</p>
              </div>
            )
          },
          {
            id: "general-term-ex2",
            question: <p>Find the coefficient of <InlineMath math="x^3" /> in the expansion of <InlineMath math="\left(x^2 - \dfrac{2}{x}\right)^6" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write the general term with <InlineMath math="a = x^2" />, <InlineMath math="b = -\dfrac{2}{x}" />, <InlineMath math="n = 6" />:</p>
                <BlockMath math="T_{r+1} = \binom{6}{r}(x^2)^{6-r}\left(-\frac{2}{x}\right)^r = \binom{6}{r}(-2)^r\,x^{12-3r}" />
                <p><strong>Step 2:</strong> We need the power of <InlineMath math="x" /> to be <InlineMath math="3" />:</p>
                <BlockMath math="12 - 3r = 3 \implies r = 3" />
                <p><strong>Step 3:</strong> Evaluate the coefficient at <InlineMath math="r=3" />:</p>
                <BlockMath math="\binom{6}{3}(-2)^3 = 20 \times (-8) = -160" />
                <p>The coefficient of <InlineMath math="x^3" /> is <InlineMath math="-160" />.</p>
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "partial-fractions",
    title: "Partial Fractions",
    topics: [
      {
        id: "proper-rational-functions",
        title: "1. Proper Rational Functions",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>A rational function is <strong>proper</strong> when the degree of the numerator is less than the degree of the denominator. Partial fractions reverse the process of adding fractions, splitting one awkward fraction into a sum of simpler ones (which is exactly what you need before integrating). The shape of the decomposition depends on the denominator's factors:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Distinct linear factor</strong> <InlineMath math="(x-a)" /> gives a term <InlineMath math="\dfrac{A}{x-a}" /></li>
              <li><strong>Repeated linear factor</strong> <InlineMath math="(x-a)^2" /> gives <InlineMath math="\dfrac{A}{x-a} + \dfrac{B}{(x-a)^2}" /></li>
              <li><strong>Irreducible quadratic factor</strong> <InlineMath math="(x^2+bx+c)" /> gives <InlineMath math="\dfrac{Bx+C}{x^2+bx+c}" /></li>
            </ul>
            <p><strong>The Golden Rule:</strong> factorise the denominator fully and check the fraction is proper before you start. Then choose the correct numerator shape for each factor — a <em>constant</em> over a linear factor, but a <em>linear expression</em> <InlineMath math="(Bx+C)" /> over an irreducible quadratic.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Wrong numerator over a quadratic:</strong> use <InlineMath math="Bx+C" /> over an irreducible quadratic, not a single constant.</li>
                <li><strong>Missing the extra term for a repeated factor:</strong> <InlineMath math="(x-a)^2" /> needs <em>both</em> <InlineMath math="\dfrac{A}{x-a}" /> and <InlineMath math="\dfrac{B}{(x-a)^2}" />.</li>
                <li><strong>Method choice:</strong> substituting the roots is quickest for linear factors, but you still need to compare coefficients (or substitute an extra value) to pin down the numerator over a quadratic factor.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "proper-ex1",
            question: <p><strong>Distinct linear factors.</strong> Express <InlineMath math="\dfrac{5x-1}{(x+1)(x-2)}" /> in partial fractions.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Set up the decomposition and clear the denominator:</p>
                <BlockMath math="\frac{5x-1}{(x+1)(x-2)} = \frac{A}{x+1} + \frac{B}{x-2} \implies 5x-1 = A(x-2) + B(x+1)" />
                <p><strong>Step 2:</strong> Substitute the roots to find <InlineMath math="A" /> and <InlineMath math="B" />:</p>
                <BlockMath math="x=2:\ \ 9 = 3B \implies B = 3 \qquad x=-1:\ -6 = -3A \implies A = 2" />
                <p><strong>Step 3:</strong> State the result:</p>
                <BlockMath math="\frac{5x-1}{(x+1)(x-2)} = \frac{2}{x+1} + \frac{3}{x-2}" />
              </div>
            )
          },
          {
            id: "proper-ex2",
            question: <p><strong>Repeated linear factor.</strong> Express <InlineMath math="\dfrac{3x^2 - 4x + 5}{(x-2)(x-1)^2}" /> in partial fractions.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The repeated factor needs both powers:</p>
                <BlockMath math="\frac{3x^2-4x+5}{(x-2)(x-1)^2} = \frac{A}{x-2} + \frac{B}{x-1} + \frac{C}{(x-1)^2}" />
                <BlockMath math="3x^2-4x+5 = A(x-1)^2 + B(x-2)(x-1) + C(x-2)" />
                <p><strong>Step 2:</strong> Substitute the roots, then compare <InlineMath math="x^2" /> terms for the last unknown:</p>
                <BlockMath math="x=2:\ 9 = A \qquad x=1:\ 4 = -C \implies C = -4" />
                <BlockMath math="x^2\text{ terms}:\ 3 = A + B \implies B = -6" />
                <p><strong>Step 3:</strong> State the result:</p>
                <BlockMath math="\frac{3x^2-4x+5}{(x-2)(x-1)^2} = \frac{9}{x-2} - \frac{6}{x-1} - \frac{4}{(x-1)^2}" />
              </div>
            )
          },
          {
            id: "proper-ex3",
            question: <p><strong>Irreducible quadratic factor.</strong> Express <InlineMath math="\dfrac{3x^2 + 1}{(x+1)(x^2+1)}" /> in partial fractions.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Use a linear numerator over the quadratic factor:</p>
                <BlockMath math="\frac{3x^2+1}{(x+1)(x^2+1)} = \frac{A}{x+1} + \frac{Bx+C}{x^2+1}" />
                <BlockMath math="3x^2+1 = A(x^2+1) + (Bx+C)(x+1)" />
                <p><strong>Step 2:</strong> Substitute the real root, then compare coefficients:</p>
                <BlockMath math="x=-1:\ 4 = 2A \implies A = 2" />
                <BlockMath math="x^2\text{ terms}:\ 3 = A + B \implies B = 1 \qquad \text{constants}:\ 1 = A + C \implies C = -1" />
                <p><strong>Step 3:</strong> State the result:</p>
                <BlockMath math="\frac{3x^2+1}{(x+1)(x^2+1)} = \frac{2}{x+1} + \frac{x-1}{x^2+1}" />
              </div>
            )
          }
        ]
      },
      {
        id: "improper-rational-functions",
        title: "2. Improper Rational Functions",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>A rational function is <strong>improper</strong> when the degree of the numerator is greater than or equal to the degree of the denominator. You must <strong>divide first</strong> — using algebraic long division — to get a polynomial quotient plus a proper remainder fraction, and only then apply partial fractions to the remainder.</p>
            <p><strong>The Golden Rule:</strong> if the top degree is greater than or equal to the bottom degree, divide before you decompose. The final answer is a polynomial <em>plus</em> proper partial fractions.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Skipping the division:</strong> setting up partial fractions directly on an improper fraction does not work — divide first.</li>
                <li><strong>Losing the quotient:</strong> the polynomial part of the answer is worth marks — don't drop it.</li>
                <li><strong>Missing-term slips:</strong> when dividing, write placeholder terms like <InlineMath math="0x^2" /> so columns stay lined up.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "improper-ex1",
            question: <p>Express <InlineMath math="\dfrac{x^3 + 2x^2 + 3}{x^2 - 1}" /> in partial fractions.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The fraction is improper (degree 3 over degree 2), so divide first. Long division gives a quotient of <InlineMath math="x+2" /> and remainder <InlineMath math="x+5" />:</p>
                <BlockMath math="\frac{x^3+2x^2+3}{x^2-1} = x + 2 + \frac{x+5}{x^2-1}" />
                <p><strong>Step 2:</strong> Decompose the proper remainder, using <InlineMath math="x^2-1 = (x-1)(x+1)" />:</p>
                <BlockMath math="\frac{x+5}{(x-1)(x+1)} = \frac{A}{x-1} + \frac{B}{x+1} \implies x+5 = A(x+1) + B(x-1)" />
                <BlockMath math="x=1:\ 6 = 2A \implies A = 3 \qquad x=-1:\ 4 = -2B \implies B = -2" />
                <p><strong>Step 3:</strong> Combine the quotient and the partial fractions:</p>
                <BlockMath math="\frac{x^3+2x^2+3}{x^2-1} = x + 2 + \frac{3}{x-1} - \frac{2}{x+1}" />
              </div>
            )
          },
          {
            id: "improper-ex2",
            question: <p>Express <InlineMath math="\dfrac{2x^2 + x}{x + 1}" /> in the form of a polynomial plus a proper fraction.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Degree 2 over degree 1 is improper, so divide. Dividing <InlineMath math="2x^2 + x" /> by <InlineMath math="x+1" /> gives quotient <InlineMath math="2x - 1" /> with remainder <InlineMath math="1" />.</p>
                <p><strong>Step 2:</strong> The denominator is already a single linear factor, so no further decomposition is needed:</p>
                <BlockMath math="\frac{2x^2 + x}{x + 1} = 2x - 1 + \frac{1}{x+1}" />
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "matrices",
    title: "Matrices",
    topics: [
      {
        id: "matrix-algebra",
        title: "1. Matrix Algebra",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>A matrix is a rectangular array of numbers. Its <strong>order</strong> is written as (rows <InlineMath math="\times" /> columns). You can add or subtract matrices of the <em>same</em> order (entry by entry), and multiply any matrix by a scalar.</p>
            <p><strong>Matrix multiplication</strong> combines rows of the first matrix with columns of the second. For the product <InlineMath math="AB" /> to exist, the number of columns of <InlineMath math="A" /> must equal the number of rows of <InlineMath math="B" />:</p>
            <BlockMath math="(m \times n)(n \times p) = (m \times p)" />
            <p>For a <InlineMath math="2\times 2" /> matrix <InlineMath math="A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}" />, the <strong>determinant</strong> is <InlineMath math="\det A = ad - bc" />, and provided <InlineMath math="\det A \neq 0" /> the <strong>inverse</strong> is:</p>
            <BlockMath math="A^{-1} = \frac{1}{ad-bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}" />
            <p>If <InlineMath math="\det A = 0" /> the matrix is <strong>singular</strong> and has no inverse.</p>
            <p><strong>The Golden Rule:</strong> matrix multiplication is <strong>not</strong> commutative — in general <InlineMath math="AB \neq BA" />. Check the inner dimensions match before multiplying, and the result takes the outer dimensions.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Assuming <InlineMath math="AB = BA" />:</strong> order matters. If the question asks for <InlineMath math="AB" />, do not compute <InlineMath math="BA" />.</li>
                <li><strong>Multiplying entry-by-entry:</strong> matrix multiplication is row-into-column, not element-wise.</li>
                <li><strong>Inverse sign slips:</strong> in the <InlineMath math="2\times 2" /> inverse you swap <InlineMath math="a" /> and <InlineMath math="d" />, and negate <InlineMath math="b" /> and <InlineMath math="c" /> — don't negate all four.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "matrix-algebra-ex1",
            question: <p>Given <InlineMath math="A = \begin{pmatrix} 2 & -1 \\ 3 & 4 \end{pmatrix}" /> and <InlineMath math="B = \begin{pmatrix} 1 & 0 \\ 2 & 5 \end{pmatrix}" />, find <InlineMath math="AB" />. Show that <InlineMath math="BA \neq AB" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Multiply row-into-column for <InlineMath math="AB" />:</p>
                <BlockMath math="AB = \begin{pmatrix} (2)(1)+(-1)(2) & (2)(0)+(-1)(5) \\ (3)(1)+(4)(2) & (3)(0)+(4)(5) \end{pmatrix} = \begin{pmatrix} 0 & -5 \\ 11 & 20 \end{pmatrix}" />
                <p><strong>Step 2:</strong> Now compute <InlineMath math="BA" />:</p>
                <BlockMath math="BA = \begin{pmatrix} (1)(2)+(0)(3) & (1)(-1)+(0)(4) \\ (2)(2)+(5)(3) & (2)(-1)+(5)(4) \end{pmatrix} = \begin{pmatrix} 2 & -1 \\ 19 & 18 \end{pmatrix}" />
                <p><strong>Step 3:</strong> Since <InlineMath math="\begin{pmatrix} 0 & -5 \\ 11 & 20 \end{pmatrix} \neq \begin{pmatrix} 2 & -1 \\ 19 & 18 \end{pmatrix}" />, we have <InlineMath math="AB \neq BA" />.</p>
              </div>
            )
          },
          {
            id: "matrix-algebra-ex2",
            question: <p>Find the inverse of <InlineMath math="A = \begin{pmatrix} 3 & 5 \\ 1 & 2 \end{pmatrix}" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Find the determinant:</p>
                <BlockMath math="\det A = (3)(2) - (5)(1) = 6 - 5 = 1" />
                <p><strong>Step 2:</strong> Since <InlineMath math="\det A = 1 \neq 0" />, apply the inverse formula (swap <InlineMath math="a,d" />; negate <InlineMath math="b,c" />):</p>
                <BlockMath math="A^{-1} = \frac{1}{1}\begin{pmatrix} 2 & -5 \\ -1 & 3 \end{pmatrix} = \begin{pmatrix} 2 & -5 \\ -1 & 3 \end{pmatrix}" />
                <p><strong>Step 3:</strong> Check by confirming <InlineMath math="A A^{-1} = I" />:</p>
                <BlockMath math="\begin{pmatrix} 3 & 5 \\ 1 & 2 \end{pmatrix}\begin{pmatrix} 2 & -5 \\ -1 & 3 \end{pmatrix} = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}" />
              </div>
            )
          },
          {
            id: "matrix-algebra-ex3",
            question: <p>Evaluate the determinant of <InlineMath math="A = \begin{pmatrix} 1 & 2 & 3 \\ 0 & 1 & 4 \\ 5 & 6 & 0 \end{pmatrix}" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Expand along the first row, each entry times its <InlineMath math="2\times 2" /> minor, with the sign pattern <InlineMath math="+\,-\,+" />:</p>
                <BlockMath math="\det A = 1\begin{vmatrix} 1 & 4 \\ 6 & 0 \end{vmatrix} - 2\begin{vmatrix} 0 & 4 \\ 5 & 0 \end{vmatrix} + 3\begin{vmatrix} 0 & 1 \\ 5 & 6 \end{vmatrix}" />
                <p><strong>Step 2:</strong> Evaluate each <InlineMath math="2\times 2" /> determinant:</p>
                <BlockMath math="= 1(0 - 24) - 2(0 - 20) + 3(0 - 5)" />
                <p><strong>Step 3:</strong> Simplify:</p>
                <BlockMath math="= -24 + 40 - 15 = 1" />
              </div>
            )
          }
        ]
      },
      {
        id: "transformations-of-the-plane",
        title: "2. Transformations of the Plane",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>A <InlineMath math="2\times 2" /> matrix can act as a <strong>linear transformation</strong> of the plane. To transform a point, write it as a column vector and pre-multiply by the matrix. The standard transformation matrices are:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Anticlockwise rotation by <InlineMath math="\theta" /> about the origin: <InlineMath math="\begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}" /></li>
              <li>Reflection in the <InlineMath math="x" />-axis: <InlineMath math="\begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}" />; in the line <InlineMath math="y=x" />: <InlineMath math="\begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}" /></li>
              <li>Scaling (dilatation) by factor <InlineMath math="k" />: <InlineMath math="\begin{pmatrix} k & 0 \\ 0 & k \end{pmatrix}" /></li>
            </ul>
            <p><strong>The Golden Rule:</strong> to combine transformations, multiply their matrices — but the transformation applied <em>first</em> goes on the <em>right</em>. &ldquo;Do <InlineMath math="A" /> then <InlineMath math="B" />&rdquo; has combined matrix <InlineMath math="BA" />.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Wrong order for a composition:</strong> &ldquo;A then B&rdquo; is <InlineMath math="BA" />, not <InlineMath math="AB" /> — the second transformation sits on the left.</li>
                <li><strong>Rotation direction:</strong> the standard matrix is anticlockwise (positive <InlineMath math="\theta" />); a clockwise rotation uses <InlineMath math="-\theta" />.</li>
                <li><strong>Row instead of column:</strong> the point must be a column vector so the multiplication is defined.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "transformations-ex1",
            question: <p>Find the image of the point <InlineMath math="(3, 1)" /> under an anticlockwise rotation of <InlineMath math="90^\circ" /> about the origin.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> With <InlineMath math="\theta = 90^\circ" />, <InlineMath math="\cos 90^\circ = 0" /> and <InlineMath math="\sin 90^\circ = 1" />, so the rotation matrix is:</p>
                <BlockMath math="\begin{pmatrix} 0 & -1 \\ 1 & 0 \end{pmatrix}" />
                <p><strong>Step 2:</strong> Multiply the matrix by the point written as a column vector:</p>
                <BlockMath math="\begin{pmatrix} 0 & -1 \\ 1 & 0 \end{pmatrix}\begin{pmatrix} 3 \\ 1 \end{pmatrix} = \begin{pmatrix} (0)(3)+(-1)(1) \\ (1)(3)+(0)(1) \end{pmatrix} = \begin{pmatrix} -1 \\ 3 \end{pmatrix}" />
                <p>The image is <InlineMath math="(-1, 3)" />.</p>
              </div>
            )
          },
          {
            id: "transformations-ex2",
            question: <p>A point is first reflected in the <InlineMath math="x" />-axis, then rotated <InlineMath math="90^\circ" /> anticlockwise about the origin. Find the single matrix representing this combined transformation, and describe it.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Let <InlineMath math="R = \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}" /> (reflection, applied first) and <InlineMath math="T = \begin{pmatrix} 0 & -1 \\ 1 & 0 \end{pmatrix}" /> (rotation, applied second). &ldquo;Reflect then rotate&rdquo; is <InlineMath math="TR" />.</p>
                <p><strong>Step 2:</strong> Multiply, with the rotation on the left:</p>
                <BlockMath math="TR = \begin{pmatrix} 0 & -1 \\ 1 & 0 \end{pmatrix}\begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix} = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}" />
                <p><strong>Step 3:</strong> The result <InlineMath math="\begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}" /> is the matrix for a reflection in the line <InlineMath math="y = x" />.</p>
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "systems-of-equations",
    title: "Systems of Equations",
    topics: [
      {
        id: "gaussian-elimination",
        title: "1. Gaussian Elimination",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>A system of three equations in three unknowns can be solved by writing an <strong>augmented matrix</strong> and using <strong>row operations</strong> to reach upper-triangular form, then <strong>back-substituting</strong>. The permitted row operations are: swap two rows, multiply a row by a non-zero constant, and add a multiple of one row to another.</p>
            <p>Reducing a <InlineMath math="3\times 3" /> system leads to one of three outcomes:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Unique solution</strong> — the matrix reduces fully; solve by back-substitution.</li>
              <li><strong>Redundancy</strong> — a row becomes <InlineMath math="0\ 0\ 0\ |\ 0" />, giving infinitely many solutions described by a parameter.</li>
              <li><strong>Inconsistency</strong> — a row becomes <InlineMath math="0\ 0\ 0\ |\ k" /> with <InlineMath math="k \neq 0" />, which is impossible, so there is no solution.</li>
            </ul>
            <p>A related idea is <strong>ill-conditioning</strong>: a system where a tiny change in a coefficient or constant produces a large change in the solution (geometrically, the lines or planes are nearly parallel).</p>
            <p><strong>The Golden Rule:</strong> use <em>row</em> operations only, never column operations, and show each operation (e.g. <InlineMath math="R_2 \to R_2 - 2R_1" />). Read the final row carefully: <InlineMath math="0=0" /> means redundant, <InlineMath math="0=\text{non-zero}" /> means inconsistent.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Redundant vs inconsistent:</strong> a final row of <InlineMath math="0\ 0\ 0\ |\ 0" /> is infinitely many solutions; <InlineMath math="0\ 0\ 0\ |\ k" /> (<InlineMath math="k \neq 0" />) is none.</li>
                <li><strong>Arithmetic under pressure:</strong> keep the augmented bar aligned and state each row operation so slips are easy to spot and recover.</li>
                <li><strong>Column operations:</strong> only row operations are valid — never operate on columns.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "gaussian-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Unique solution.</strong> Use Gaussian elimination to solve:</p>
                <BlockMath math="\begin{aligned} x + y + z &= 6 \\ 2x + y - z &= 1 \\ x - y + 2z &= 5 \end{aligned}" />
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write the augmented matrix and eliminate the first column:</p>
                <BlockMath math="\left(\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 2 & 1 & -1 & 1 \\ 1 & -1 & 2 & 5 \end{array}\right) \xrightarrow{\substack{R_2 \to R_2 - 2R_1 \\ R_3 \to R_3 - R_1}} \left(\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 0 & -1 & -3 & -11 \\ 0 & -2 & 1 & -1 \end{array}\right)" />
                <p><strong>Step 2:</strong> Eliminate the second column below the pivot:</p>
                <BlockMath math="\xrightarrow{R_3 \to R_3 - 2R_2} \left(\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 0 & -1 & -3 & -11 \\ 0 & 0 & 7 & 21 \end{array}\right)" />
                <p><strong>Step 3:</strong> Back-substitute: <InlineMath math="7z = 21 \Rightarrow z = 3" />; then <InlineMath math="-y - 3(3) = -11 \Rightarrow y = 2" />; then <InlineMath math="x + 2 + 3 = 6 \Rightarrow x = 1" />.</p>
                <BlockMath math="(x, y, z) = (1, 2, 3)" />
              </div>
            )
          },
          {
            id: "gaussian-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Redundancy.</strong> Solve the system:</p>
                <BlockMath math="\begin{aligned} x + y + z &= 6 \\ x + 2y + 3z &= 14 \\ x + 3y + 5z &= 22 \end{aligned}" />
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Eliminate the first column:</p>
                <BlockMath math="\left(\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 1 & 2 & 3 & 14 \\ 1 & 3 & 5 & 22 \end{array}\right) \xrightarrow{\substack{R_2 \to R_2 - R_1 \\ R_3 \to R_3 - R_1}} \left(\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 0 & 1 & 2 & 8 \\ 0 & 2 & 4 & 16 \end{array}\right)" />
                <p><strong>Step 2:</strong> Eliminate the second column:</p>
                <BlockMath math="\xrightarrow{R_3 \to R_3 - 2R_2} \left(\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 0 & 1 & 2 & 8 \\ 0 & 0 & 0 & 0 \end{array}\right)" />
                <p><strong>Step 3:</strong> The final row is <InlineMath math="0 = 0" />, so the system is redundant with infinitely many solutions. Let <InlineMath math="z = t" />. Then <InlineMath math="y = 8 - 2t" /> and <InlineMath math="x = 6 - y - z = t - 2" />:</p>
                <BlockMath math="(x, y, z) = (t - 2,\ 8 - 2t,\ t)" />
              </div>
            )
          },
          {
            id: "gaussian-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Inconsistency.</strong> Show that the following system has no solution:</p>
                <BlockMath math="\begin{aligned} x + y + z &= 6 \\ x + 2y + 3z &= 14 \\ x + 3y + 5z &= 20 \end{aligned}" />
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Eliminate the first column:</p>
                <BlockMath math="\left(\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 1 & 2 & 3 & 14 \\ 1 & 3 & 5 & 20 \end{array}\right) \xrightarrow{\substack{R_2 \to R_2 - R_1 \\ R_3 \to R_3 - R_1}} \left(\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 0 & 1 & 2 & 8 \\ 0 & 2 & 4 & 14 \end{array}\right)" />
                <p><strong>Step 2:</strong> Eliminate the second column:</p>
                <BlockMath math="\xrightarrow{R_3 \to R_3 - 2R_2} \left(\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\ 0 & 1 & 2 & 8 \\ 0 & 0 & 0 & -2 \end{array}\right)" />
                <p><strong>Step 3:</strong> The final row reads <InlineMath math="0 = -2" />, which is impossible. The system is inconsistent and has <strong>no solution</strong>.</p>
              </div>
            )
          },
          {
            id: "gaussian-ex4",
            question: <p><strong>Ill-conditioning.</strong> Solve <InlineMath math="x + y = 2,\ x + 1.01y = 2.01" />. Then re-solve with the second constant changed to <InlineMath math="2.02" />, and comment.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Subtracting the first equation from the second gives <InlineMath math="0.01y = 0.01" />, so <InlineMath math="y = 1" /> and <InlineMath math="x = 1" />. Solution <InlineMath math="(1, 1)" />.</p>
                <p><strong>Step 2:</strong> With the constant changed to <InlineMath math="2.02" />, subtracting gives <InlineMath math="0.01y = 0.02" />, so <InlineMath math="y = 2" /> and <InlineMath math="x = 0" />. Solution <InlineMath math="(0, 2)" />.</p>
                <p><strong>Step 3:</strong> A change of just <InlineMath math="0.01" /> in one constant moved the solution from <InlineMath math="(1,1)" /> to <InlineMath math="(0,2)" />. The system is <strong>ill-conditioned</strong> — the two lines are almost parallel, so the solution is highly sensitive to small changes.</p>
              </div>
            )
          }
        ]
      }
    ]
  }
];
