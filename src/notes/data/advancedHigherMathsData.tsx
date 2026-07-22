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
  }
];
