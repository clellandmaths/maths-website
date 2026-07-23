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
        id: "pascals-triangle",
        title: "1. Pascal's Triangle & Binomial Coefficients",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>Writing out <InlineMath math="(x+y)^n" /> for <InlineMath math="n = 0,1,2,3,\dots" /> and recording only the coefficients produces <strong>Pascal's triangle</strong>:</p>
            <BlockMath math="\begin{array}{c} 1 \\ 1 \quad 1 \\ 1 \quad 2 \quad 1 \\ 1 \quad 3 \quad 3 \quad 1 \\ 1 \quad 4 \quad 6 \quad 4 \quad 1 \\ 1 \quad 5 \quad 10 \quad 10 \quad 5 \quad 1 \end{array}" />
            <p>Every row starts and ends with <InlineMath math="1" />, and each entry inside a row is the sum of the two entries above it. The triangle is also symmetrical about its centre.</p>
            <p>Rather than extend the triangle line by line, we use <strong>factorials</strong>. For <InlineMath math="n \in \mathbb{N}" />, <InlineMath math="n! = n(n-1)(n-2)\cdots 3 \times 2 \times 1" />, with the special definition <InlineMath math="0! = 1" />. The <strong>binomial coefficient</strong> (read &ldquo;<InlineMath math="n" /> choose <InlineMath math="r" />&rdquo;) is then:</p>
            <BlockMath math="\binom{n}{r} = \frac{n!}{r!\,(n-r)!}, \qquad 0 \le r \le n" />
            <p>These are exactly the entries of Pascal's triangle: row <InlineMath math="n" /> is <InlineMath math="\binom{n}{0}, \binom{n}{1}, \dots, \binom{n}{n}" />. Two properties follow, and <strong>you are expected to be able to prove both</strong>:</p>
            <BlockMath math="\textbf{Symmetry:}\quad \binom{n}{r} = \binom{n}{n-r}" />
            <BlockMath math="\textbf{Pascal's rule:}\quad \binom{n}{r} + \binom{n}{r+1} = \binom{n+1}{r+1}" />
            <p>Symmetry is the mirror image of the triangle; Pascal's rule is the &ldquo;add the two above&rdquo; construction written algebraically.</p>
            <p><strong>The Golden Rule:</strong> to prove an identity in binomial coefficients, replace every <InlineMath math="\binom{n}{r}" /> by its factorial definition, put the terms over a common denominator, and simplify until the required form appears. Never argue from a few numerical rows — that is a check, not a proof.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Forgetting <InlineMath math="0! = 1" />:</strong> this is a definition, not a calculation, and it is what makes <InlineMath math="\binom{n}{0} = 1" /> work.</li>
                <li><strong>Verifying instead of proving:</strong> checking an identity for <InlineMath math="n=5,\ r=2" /> earns no marks. A proof must hold for general <InlineMath math="n" /> and <InlineMath math="r" />.</li>
                <li><strong>The common denominator:</strong> in Pascal's rule the two denominators are <InlineMath math="r!(n-r)!" /> and <InlineMath math="(r+1)!(n-r-1)!" />. Use <InlineMath math="(r+1)! = (r+1)\,r!" /> and <InlineMath math="(n-r)! = (n-r)(n-r-1)!" /> to bridge them.</li>
                <li><strong>Discarding invalid solutions:</strong> when solving for <InlineMath math="n" />, only whole-number values with <InlineMath math="n \ge r" /> are admissible.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "pascals-ex1",
            question: <p>Evaluate <InlineMath math="\binom{7}{3}" /> and <InlineMath math="\binom{10}{7}" />, and state which other coefficient equals <InlineMath math="\binom{10}{7}" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Apply the definition to <InlineMath math="\binom{7}{3}" />:</p>
                <BlockMath math="\binom{7}{3} = \frac{7!}{3!\,4!} = \frac{5040}{6 \times 24} = \frac{5040}{144} = 35" />
                <p><strong>Step 2:</strong> Apply it again to <InlineMath math="\binom{10}{7}" />:</p>
                <BlockMath math="\binom{10}{7} = \frac{10!}{7!\,3!} = \frac{3628800}{5040 \times 6} = \frac{3628800}{30240} = 120" />
                <p><strong>Step 3:</strong> By the symmetry property, <InlineMath math="\binom{10}{7} = \binom{10}{10-7} = \binom{10}{3}" />, which is also <InlineMath math="120" />.</p>
              </div>
            )
          },
          {
            id: "pascals-ex2",
            question: <p>Prove that <InlineMath math="\binom{n}{r} = \binom{n}{n-r}" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Start from the right-hand side and use the definition, replacing <InlineMath math="r" /> by <InlineMath math="n-r" />:</p>
                <BlockMath math="\binom{n}{n-r} = \frac{n!}{(n-r)!\,\bigl(n-(n-r)\bigr)!}" />
                <p><strong>Step 2:</strong> Simplify the second factorial in the denominator:</p>
                <BlockMath math="n - (n-r) = r \quad\implies\quad \binom{n}{n-r} = \frac{n!}{(n-r)!\,r!}" />
                <p><strong>Step 3:</strong> Multiplication is commutative, so <InlineMath math="(n-r)!\,r! = r!\,(n-r)!" />:</p>
                <BlockMath math="\binom{n}{n-r} = \frac{n!}{r!\,(n-r)!} = \binom{n}{r}" />
                <p>Hence the two coefficients are equal for all <InlineMath math="0 \le r \le n" />, as required.</p>
              </div>
            )
          },
          {
            id: "pascals-ex3",
            question: <p>Prove Pascal's rule: <InlineMath math="\binom{n}{r} + \binom{n}{r+1} = \binom{n+1}{r+1}" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write both terms using the definition:</p>
                <BlockMath math="\binom{n}{r} + \binom{n}{r+1} = \frac{n!}{r!\,(n-r)!} + \frac{n!}{(r+1)!\,(n-r-1)!}" />
                <p><strong>Step 2:</strong> The common denominator is <InlineMath math="(r+1)!\,(n-r)!" />. Multiply the first fraction by <InlineMath math="\dfrac{r+1}{r+1}" /> and the second by <InlineMath math="\dfrac{n-r}{n-r}" />, using <InlineMath math="(r+1)! = (r+1)r!" /> and <InlineMath math="(n-r)! = (n-r)(n-r-1)!" />:</p>
                <BlockMath math="= \frac{n!\,(r+1)}{(r+1)!\,(n-r)!} + \frac{n!\,(n-r)}{(r+1)!\,(n-r)!}" />
                <p><strong>Step 3:</strong> Combine over the single denominator and simplify the numerator:</p>
                <BlockMath math="= \frac{n!\bigl[(r+1) + (n-r)\bigr]}{(r+1)!\,(n-r)!} = \frac{n!\,(n+1)}{(r+1)!\,(n-r)!} = \frac{(n+1)!}{(r+1)!\,(n-r)!}" />
                <p><strong>Step 4:</strong> Compare with the definition of the target coefficient:</p>
                <BlockMath math="\binom{n+1}{r+1} = \frac{(n+1)!}{(r+1)!\,\bigl((n+1)-(r+1)\bigr)!} = \frac{(n+1)!}{(r+1)!\,(n-r)!}" />
                <p>The two expressions are identical, so the identity holds.</p>
              </div>
            )
          },
          {
            id: "pascals-ex4",
            question: <p>Find the value of <InlineMath math="n" /> for which <InlineMath math="\binom{n}{2} = 55" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Expand the coefficient using the definition, cancelling <InlineMath math="(n-2)!" />:</p>
                <BlockMath math="\binom{n}{2} = \frac{n!}{2!\,(n-2)!} = \frac{n(n-1)}{2}" />
                <p><strong>Step 2:</strong> Set this equal to <InlineMath math="55" /> and rearrange into a quadratic:</p>
                <BlockMath math="\frac{n(n-1)}{2} = 55 \implies n^2 - n - 110 = 0" />
                <p><strong>Step 3:</strong> Factorise and solve:</p>
                <BlockMath math="(n-11)(n+10) = 0 \implies n = 11 \ \text{ or } \ n = -10" />
                <p><strong>Step 4:</strong> Since <InlineMath math="n" /> must be a positive whole number, <InlineMath math="n = -10" /> is rejected. Therefore <InlineMath math="n = 11" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "binomial-expansion",
        title: "2. Binomial Expansion",
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
        title: "3. General Term & Coefficients",
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
                <li><strong>&ldquo;The <InlineMath math="k" />th term&rdquo; means <InlineMath math="r = k-1" />:</strong> a question asking for the fourth term needs <InlineMath math="r = 3" />, not <InlineMath math="r = 4" />.</li>
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
          },
          {
            id: "general-term-ex3",
            question: <p>Find the fourth term in the expansion of <InlineMath math="(2x - 3y)^7" />, written in descending powers of <InlineMath math="x" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The general term is the <InlineMath math="(r+1)" />th term, so the <strong>fourth</strong> term needs <InlineMath math="r = 3" />:</p>
                <BlockMath math="T_{r+1} = \binom{7}{r}(2x)^{7-r}(-3y)^r \quad\implies\quad T_4 = \binom{7}{3}(2x)^{4}(-3y)^{3}" />
                <p><strong>Step 2:</strong> Evaluate each factor separately, taking care to raise the whole bracket to the power:</p>
                <BlockMath math="\binom{7}{3} = 35, \qquad (2x)^4 = 16x^4, \qquad (-3y)^3 = -27y^3" />
                <p><strong>Step 3:</strong> Multiply the three factors together:</p>
                <BlockMath math="T_4 = 35 \times 16x^4 \times (-27y^3) = -15120\,x^4y^3" />
                <p>The odd power of <InlineMath math="-3y" /> makes this term negative.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "binomial-approximation",
        title: "4. Approximating Powers",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>The Binomial Theorem gives a way of evaluating awkward powers such as <InlineMath math="3.1^4" /> or <InlineMath math="1.02^6" /> by hand. Split the number into a convenient part plus a small part, then expand:</p>
            <BlockMath math="3.1^4 = (3 + 0.1)^4, \qquad 1.02^6 = (1 + 0.02)^6, \qquad 0.97^5 = (1 - 0.03)^5" />
            <p>Because the small part is raised to ever higher powers, the terms shrink rapidly. If the index <InlineMath math="n" /> is a positive whole number the expansion <em>terminates</em>, so summing every term gives an <strong>exact</strong> answer. When a question asks only for a stated accuracy, you may stop once the remaining terms are too small to affect the last required figure.</p>
            <p><strong>The Golden Rule:</strong> choose the split so the second term is small and the first is easy to raise to powers — <InlineMath math="(3 + 0.1)" />, not <InlineMath math="(2 + 1.1)" />. Then keep expanding until the next term cannot change the digit you have been asked for, and state clearly why you stopped.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Rounding too early:</strong> keep full accuracy in every term and round only at the very end, or the final digit will be wrong.</li>
                <li><strong>Stopping too soon:</strong> before truncating, check the size of the <em>next</em> term. Only discard it if it cannot affect the required decimal place.</li>
                <li><strong>Powers of the small part:</strong> <InlineMath math="(0.1)^3 = 0.001" />, not <InlineMath math="0.3" /> — a very common slip when the arithmetic is done mentally.</li>
                <li><strong>Signs when subtracting:</strong> for <InlineMath math="(1-a)^n" /> the terms alternate in sign. Write the bracket as <InlineMath math="(1 + (-a))^n" /> to keep them straight.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "binomial-approx-ex1",
            question: <p>Use the Binomial Theorem to find the <strong>exact</strong> value of <InlineMath math="3.1^4" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write the number as a binomial and expand with coefficients <InlineMath math="1, 4, 6, 4, 1" />:</p>
                <BlockMath math="3.1^4 = (3 + 0.1)^4 = 3^4 + 4(3)^3(0.1) + 6(3)^2(0.1)^2 + 4(3)(0.1)^3 + (0.1)^4" />
                <p><strong>Step 2:</strong> Evaluate each term:</p>
                <BlockMath math="\begin{aligned} 3^4 &= 81 \\ 4(27)(0.1) &= 10.8 \\ 6(9)(0.01) &= 0.54 \\ 4(3)(0.001) &= 0.012 \\ (0.1)^4 &= 0.0001 \end{aligned}" />
                <p><strong>Step 3:</strong> Add them. The index is a positive whole number, so the expansion terminates and the total is exact:</p>
                <BlockMath math="3.1^4 = 81 + 10.8 + 0.54 + 0.012 + 0.0001 = 92.3521" />
              </div>
            )
          },
          {
            id: "binomial-approx-ex2",
            question: <p>Use the Binomial Theorem to evaluate <InlineMath math="1.02^6" /> correct to <strong>4 decimal places</strong>.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write <InlineMath math="1.02^6 = (1 + 0.02)^6" />. Since the first term is <InlineMath math="1" />, every power of it is <InlineMath math="1" /> and the expansion simplifies to:</p>
                <BlockMath math="(1+0.02)^6 = 1 + 6(0.02) + 15(0.02)^2 + 20(0.02)^3 + 15(0.02)^4 + \cdots" />
                <p><strong>Step 2:</strong> Evaluate the terms in turn:</p>
                <BlockMath math="\begin{aligned} 6(0.02) &= 0.12 \\ 15(0.0004) &= 0.006 \\ 20(0.000008) &= 0.00016 \\ 15(0.00000016) &= 0.0000024 \end{aligned}" />
                <p><strong>Step 3:</strong> Check the next term before stopping. It is <InlineMath math="6(0.02)^5 = 0.0000000192" />, far too small to affect the fourth decimal place, so we may truncate here.</p>
                <p><strong>Step 4:</strong> Add the terms and round at the end:</p>
                <BlockMath math="1 + 0.12 + 0.006 + 0.00016 + 0.0000024 = 1.1261624\ldots \approx 1.1262" />
              </div>
            )
          },
          {
            id: "binomial-approx-ex3",
            question: <p>Use the Binomial Theorem to evaluate <InlineMath math="0.97^5" /> correct to <strong>5 decimal places</strong>.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write <InlineMath math="0.97^5 = (1 - 0.03)^5" />. With a negative second term the signs alternate, using coefficients <InlineMath math="1, 5, 10, 10, 5, 1" />:</p>
                <BlockMath math="(1-0.03)^5 = 1 - 5(0.03) + 10(0.03)^2 - 10(0.03)^3 + 5(0.03)^4 - (0.03)^5" />
                <p><strong>Step 2:</strong> Evaluate each term, keeping full accuracy:</p>
                <BlockMath math="\begin{aligned} 5(0.03) &= 0.15 \\ 10(0.0009) &= 0.009 \\ 10(0.000027) &= 0.00027 \\ 5(0.00000081) &= 0.00000405 \\ (0.03)^5 &= 0.0000000243 \end{aligned}" />
                <p><strong>Step 3:</strong> Combine with alternating signs:</p>
                <BlockMath math="1 - 0.15 + 0.009 - 0.00027 + 0.00000405 - 0.0000000243 = 0.8587340257\ldots" />
                <p><strong>Step 4:</strong> Round to 5 decimal places: <InlineMath math="0.97^5 \approx 0.85873" />.</p>
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
        id: "algebraic-long-division",
        title: "1. Algebraic Long Division",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>Before partial fractions can be used, the fraction must be <strong>proper</strong> — the degree of the numerator lower than the degree of the denominator. When it is not, we divide first, and the tool for that is <strong>algebraic long division</strong>.</p>
            <p>The process is identical to long division with numbers. Dividing <InlineMath math="745" /> by <InlineMath math="6" /> gives <InlineMath math="124" /> remainder <InlineMath math="1" />, which we can write as:</p>
            <BlockMath math="\frac{745}{6} = 124 + \frac{1}{6}" />
            <p>The same layout works with polynomials. Dividing a polynomial <InlineMath math="f(x)" /> by <InlineMath math="g(x)" /> produces a <strong>quotient</strong> <InlineMath math="q(x)" /> and a <strong>remainder</strong> <InlineMath math="r(x)" />:</p>
            <BlockMath math="\frac{f(x)}{g(x)} = q(x) + \frac{r(x)}{g(x)}" />
            <p>At each stage, divide the leading term of what is left by the leading term of the divisor, multiply the whole divisor by that result, and subtract. Stop when the degree of what remains is <em>lower</em> than the degree of the divisor — that leftover is the remainder, and the fraction <InlineMath math="\frac{r(x)}{g(x)}" /> is guaranteed to be proper.</p>
            <p><strong>The Golden Rule:</strong> compare degrees before you do anything else. Only divide the <em>leading</em> terms to get each new term of the quotient, and keep going only while the degree of the remainder is at least the degree of the divisor.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Missing terms:</strong> write in placeholders such as <InlineMath math="0x^2" /> so that like terms stay in line — this is the single most common source of error.</li>
                <li><strong>Sign errors on subtraction:</strong> you subtract the <em>whole</em> product, so every sign in it changes. Bracket it before subtracting.</li>
                <li><strong>Stopping at the wrong point:</strong> continue only while the degree of the remaining expression is greater than or equal to the degree of the divisor.</li>
                <li><strong>Checking your answer:</strong> multiply back — <InlineMath math="g(x)\,q(x) + r(x)" /> must return the original numerator exactly.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "long-division-ex1",
            question: <p>Divide <InlineMath math="x^3 + 2x^2 - 5x + 1" /> by <InlineMath math="x - 2" />, stating the quotient and remainder.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Divide the leading terms: <InlineMath math="x^3 \div x = x^2" />. Multiply the divisor by <InlineMath math="x^2" /> and subtract:</p>
                <BlockMath math="x^2(x-2) = x^3 - 2x^2 \quad\implies\quad (x^3 + 2x^2) - (x^3 - 2x^2) = 4x^2" />
                <p><strong>Step 2:</strong> Bring down the next term to give <InlineMath math="4x^2 - 5x" />. Now <InlineMath math="4x^2 \div x = 4x" />:</p>
                <BlockMath math="4x(x-2) = 4x^2 - 8x \quad\implies\quad (4x^2 - 5x) - (4x^2 - 8x) = 3x" />
                <p><strong>Step 3:</strong> Bring down the <InlineMath math="+1" /> to give <InlineMath math="3x + 1" />. Now <InlineMath math="3x \div x = 3" />:</p>
                <BlockMath math="3(x-2) = 3x - 6 \quad\implies\quad (3x + 1) - (3x - 6) = 7" />
                <p><strong>Step 4:</strong> The remainder <InlineMath math="7" /> has lower degree than <InlineMath math="x-2" />, so we stop. The quotient is <InlineMath math="x^2 + 4x + 3" /> and the remainder is <InlineMath math="7" />:</p>
                <BlockMath math="\frac{x^3 + 2x^2 - 5x + 1}{x-2} = x^2 + 4x + 3 + \frac{7}{x-2}" />
                <p><strong>Check:</strong> <InlineMath math="(x-2)(x^2+4x+3) + 7 = x^3 + 2x^2 - 5x - 6 + 7 = x^3 + 2x^2 - 5x + 1" /> ✓</p>
              </div>
            )
          },
          {
            id: "long-division-ex2",
            question: <p>Express <InlineMath math="\dfrac{2x^3 - 3x + 5}{x^2 + 1}" /> as a quotient plus a proper fraction.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The numerator has no <InlineMath math="x^2" /> term, so insert a placeholder before dividing:</p>
                <BlockMath math="2x^3 + 0x^2 - 3x + 5 \ \div \ (x^2 + 1)" />
                <p><strong>Step 2:</strong> Divide the leading terms: <InlineMath math="2x^3 \div x^2 = 2x" />. Multiply and subtract:</p>
                <BlockMath math="2x(x^2+1) = 2x^3 + 2x" />
                <BlockMath math="(2x^3 + 0x^2 - 3x + 5) - (2x^3 + 2x) = 0x^2 - 5x + 5" />
                <p><strong>Step 3:</strong> What remains, <InlineMath math="-5x + 5" />, has degree <InlineMath math="1" />, which is lower than the degree of <InlineMath math="x^2+1" />. So the division stops here:</p>
                <BlockMath math="\frac{2x^3 - 3x + 5}{x^2+1} = 2x + \frac{5 - 5x}{x^2+1}" />
                <p><strong>Check:</strong> <InlineMath math="(x^2+1)(2x) + (5-5x) = 2x^3 + 2x + 5 - 5x = 2x^3 - 3x + 5" /> ✓</p>
              </div>
            )
          }
        ]
      },
      {
        id: "proper-rational-functions",
        title: "2. Proper Rational Functions",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>A rational function is <strong>proper</strong> when the degree of the numerator is less than the degree of the denominator. Partial fractions reverse the process of adding fractions, splitting one awkward fraction into a sum of simpler ones (which is exactly what you need before integrating). The shape of the decomposition depends on the denominator's factors:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Distinct linear factor</strong> <InlineMath math="(x-a)" /> gives a term <InlineMath math="\dfrac{A}{x-a}" /></li>
              <li><strong>Repeated linear factor</strong> <InlineMath math="(x-a)^2" /> gives <InlineMath math="\dfrac{A}{x-a} + \dfrac{B}{(x-a)^2}" /></li>
              <li><strong>Irreducible quadratic factor</strong> <InlineMath math="(x^2+bx+c)" /> gives <InlineMath math="\dfrac{Bx+C}{x^2+bx+c}" /></li>
            </ul>
            <p>A denominator may contain several of these at once. Each factor contributes its own term (or terms) independently, so <InlineMath math="(x+1)^2(x^2+4)" /> needs <em>three</em> unknowns in total: two for the repeated linear factor and one linear numerator over the quadratic.</p>
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
          },
          {
            id: "proper-ex4",
            question: <p><strong>Repeated linear <em>and</em> irreducible quadratic.</strong> Express <InlineMath math="\dfrac{2x^3 + 5x^2 + 5x + 12}{(x+1)^2(x^2+4)}" /> in partial fractions.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The numerator has degree <InlineMath math="3" /> and the denominator degree <InlineMath math="4" />, so the fraction is proper. Each factor contributes its own terms — four unknowns in all:</p>
                <BlockMath math="\frac{2x^3+5x^2+5x+12}{(x+1)^2(x^2+4)} = \frac{A}{x+1} + \frac{B}{(x+1)^2} + \frac{Cx+D}{x^2+4}" />
                <p><strong>Step 2:</strong> Multiply through by <InlineMath math="(x+1)^2(x^2+4)" />:</p>
                <BlockMath math="2x^3+5x^2+5x+12 = A(x+1)(x^2+4) + B(x^2+4) + (Cx+D)(x+1)^2" />
                <p><strong>Step 3:</strong> Substitute the real root <InlineMath math="x = -1" />, which kills the <InlineMath math="A" /> and <InlineMath math="(Cx+D)" /> terms:</p>
                <BlockMath math="-2 + 5 - 5 + 12 = B(1+4) \implies 10 = 5B \implies B = 2" />
                <p><strong>Step 4:</strong> There are no other real roots, so compare coefficients. Expanding the right-hand side:</p>
                <BlockMath math="\begin{aligned} x^3: &\quad A + C = 2 \\ x^2: &\quad A + B + 2C + D = 5 \\ \text{constants}: &\quad 4A + 4B + D = 12 \end{aligned}" />
                <p><strong>Step 5:</strong> Substitute <InlineMath math="B = 2" />, giving <InlineMath math="C = 2 - A" /> and <InlineMath math="D = 4 - 4A" />. Put both into the <InlineMath math="x^2" /> equation:</p>
                <BlockMath math="A + 2 + 2(2-A) + (4-4A) = 5 \implies 8 - 5A = 5 \implies A = 1" />
                <p><strong>Step 6:</strong> Back-substitute: <InlineMath math="C = 1" /> and <InlineMath math="D = 0" />. State the result:</p>
                <BlockMath math="\frac{2x^3+5x^2+5x+12}{(x+1)^2(x^2+4)} = \frac{1}{x+1} + \frac{2}{(x+1)^2} + \frac{x}{x^2+4}" />
              </div>
            )
          }
        ]
      },
      {
        id: "improper-rational-functions",
        title: "3. Improper Rational Functions",
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
                <p><strong>Step 1:</strong> The fraction is improper (degree 3 over degree 2), so divide first. Insert a placeholder for the missing <InlineMath math="x" /> term, then divide the leading terms: <InlineMath math="x^3 \div x^2 = x" />.</p>
                <BlockMath math="x(x^2-1) = x^3 - x \quad\implies\quad (x^3 + 2x^2 + 0x) - (x^3 - x) = 2x^2 + x" />
                <p><strong>Step 2:</strong> Bring down the <InlineMath math="+3" /> to give <InlineMath math="2x^2 + x + 3" />. Now <InlineMath math="2x^2 \div x^2 = 2" />:</p>
                <BlockMath math="2(x^2-1) = 2x^2 - 2 \quad\implies\quad (2x^2 + x + 3) - (2x^2 - 2) = x + 5" />
                <p><strong>Step 3:</strong> The remainder <InlineMath math="x+5" /> has lower degree than <InlineMath math="x^2-1" />, so the division is complete with quotient <InlineMath math="x+2" />:</p>
                <BlockMath math="\frac{x^3+2x^2+3}{x^2-1} = x + 2 + \frac{x+5}{x^2-1}" />
                <p><strong>Step 4:</strong> Decompose the proper remainder, using <InlineMath math="x^2-1 = (x-1)(x+1)" />:</p>
                <BlockMath math="\frac{x+5}{(x-1)(x+1)} = \frac{A}{x-1} + \frac{B}{x+1} \implies x+5 = A(x+1) + B(x-1)" />
                <BlockMath math="x=1:\ 6 = 2A \implies A = 3 \qquad x=-1:\ 4 = -2B \implies B = -2" />
                <p><strong>Step 5:</strong> Combine the quotient and the partial fractions:</p>
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
  },
  {
    id: "sequences-and-series",
    title: "Sequences and Series",
    topics: [
      {
        id: "arithmetic-sequences-series",
        title: "1. Arithmetic Sequences & Series",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>An <strong>arithmetic sequence</strong> increases by a constant <strong>common difference</strong> <InlineMath math="d" /> each step. With first term <InlineMath math="a" />, the <InlineMath math="n" />th term is:</p>
            <BlockMath math="u_n = a + (n-1)d" />
            <p>The sum of the first <InlineMath math="n" /> terms is:</p>
            <BlockMath math="S_n = \frac{n}{2}\bigl[2a + (n-1)d\bigr] = \frac{n}{2}(a + l)" />
            <p>where <InlineMath math="l" /> is the last term. Use the second form when you already know the last term.</p>
            <p><strong>The Golden Rule:</strong> almost every arithmetic question reduces to finding <InlineMath math="a" /> and <InlineMath math="d" /> — pin those down first, then substitute.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The <InlineMath math="(n-1)" /> slip:</strong> the <InlineMath math="n" />th term uses <InlineMath math="(n-1)d" />, not <InlineMath math="nd" /> — the first term already counts as one.</li>
                <li><strong>Wrong sum formula:</strong> only use <InlineMath math="\frac{n}{2}(a+l)" /> when the last term <InlineMath math="l" /> is actually known.</li>
                <li><strong>Counting terms:</strong> the number of terms from the <InlineMath math="p" />th to the <InlineMath math="q" />th is <InlineMath math="q - p + 1" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "arithmetic-ex1",
            question: <p>An arithmetic sequence has first term <InlineMath math="5" /> and common difference <InlineMath math="3" />. Find the 20th term and the sum of the first 20 terms.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Apply the <InlineMath math="n" />th term formula with <InlineMath math="a=5" />, <InlineMath math="d=3" />, <InlineMath math="n=20" />:</p>
                <BlockMath math="u_{20} = 5 + (20-1)(3) = 5 + 57 = 62" />
                <p><strong>Step 2:</strong> Apply the sum formula:</p>
                <BlockMath math="S_{20} = \frac{20}{2}\bigl[2(5) + (19)(3)\bigr] = 10\,[10 + 57] = 670" />
              </div>
            )
          },
          {
            id: "arithmetic-ex2",
            question: <p>The 4th term of an arithmetic sequence is <InlineMath math="11" /> and the 9th term is <InlineMath math="26" />. Find the first term and common difference, then the sum of the first 12 terms.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write each term with the formula and subtract to eliminate <InlineMath math="a" />:</p>
                <BlockMath math="a + 3d = 11 \qquad a + 8d = 26 \implies 5d = 15 \implies d = 3" />
                <p><strong>Step 2:</strong> Substitute back to find <InlineMath math="a" />:</p>
                <BlockMath math="a + 3(3) = 11 \implies a = 2" />
                <p><strong>Step 3:</strong> Find the sum of the first 12 terms:</p>
                <BlockMath math="S_{12} = \frac{12}{2}\bigl[2(2) + (11)(3)\bigr] = 6\,[4 + 33] = 222" />
              </div>
            )
          }
        ]
      },
      {
        id: "geometric-sequences-series",
        title: "2. Geometric Sequences & Series",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>A <strong>geometric sequence</strong> multiplies by a constant <strong>common ratio</strong> <InlineMath math="r" /> each step. With first term <InlineMath math="a" />, the <InlineMath math="n" />th term is:</p>
            <BlockMath math="u_n = ar^{\,n-1}" />
            <p>The sum of the first <InlineMath math="n" /> terms (for <InlineMath math="r \neq 1" />) is:</p>
            <BlockMath math="S_n = \frac{a(r^n - 1)}{r - 1}" />
            <p>If <InlineMath math="|r| < 1" /> the series converges, and the <strong>sum to infinity</strong> is:</p>
            <BlockMath math="S_\infty = \frac{a}{1 - r}, \qquad |r| < 1" />
            <p><strong>The Golden Rule:</strong> find <InlineMath math="a" /> and <InlineMath math="r" /> first, and remember that a sum to infinity <em>only exists</em> when <InlineMath math="|r| < 1" />.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Using <InlineMath math="S_\infty" /> when <InlineMath math="|r| \geq 1" />:</strong> the series diverges and has no sum to infinity — always check the ratio first.</li>
                <li><strong>Power slip:</strong> the <InlineMath math="n" />th term is <InlineMath math="ar^{\,n-1}" />, not <InlineMath math="ar^{\,n}" />.</li>
                <li><strong>Negative ratio:</strong> if the terms alternate in sign, <InlineMath math="r" /> is negative — keep the sign throughout.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "geometric-ex1",
            question: <p>A geometric sequence has first term <InlineMath math="3" /> and common ratio <InlineMath math="2" />. Find the 6th term and the sum of the first 6 terms.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Apply the <InlineMath math="n" />th term formula with <InlineMath math="a=3" />, <InlineMath math="r=2" />:</p>
                <BlockMath math="u_6 = 3 \times 2^{\,5} = 3 \times 32 = 96" />
                <p><strong>Step 2:</strong> Apply the sum formula:</p>
                <BlockMath math="S_6 = \frac{3(2^6 - 1)}{2 - 1} = \frac{3(63)}{1} = 189" />
              </div>
            )
          },
          {
            id: "geometric-ex2",
            question: <p>A geometric series has first term <InlineMath math="8" /> and common ratio <InlineMath math="\tfrac{1}{2}" />. Find its sum to infinity.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Check convergence: <InlineMath math="|r| = \tfrac{1}{2} < 1" />, so a sum to infinity exists.</p>
                <p><strong>Step 2:</strong> Apply the formula:</p>
                <BlockMath math="S_\infty = \frac{8}{1 - \tfrac{1}{2}} = \frac{8}{\tfrac{1}{2}} = 16" />
              </div>
            )
          },
          {
            id: "geometric-ex3",
            question: <p>The sum to infinity of a geometric series is <InlineMath math="12" /> and its first term is <InlineMath math="4" />. Find the common ratio.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Substitute into <InlineMath math="S_\infty = \dfrac{a}{1-r}" />:</p>
                <BlockMath math="12 = \frac{4}{1 - r}" />
                <p><strong>Step 2:</strong> Rearrange for <InlineMath math="r" />:</p>
                <BlockMath math="1 - r = \frac{4}{12} = \frac{1}{3} \implies r = \frac{2}{3}" />
                <p><strong>Step 3:</strong> Since <InlineMath math="|r| = \tfrac{2}{3} < 1" />, a sum to infinity is valid, as required.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "summation-formulae",
        title: "3. Summation Formulae",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>Standard results (given on the formula sheet) let us sum powers of the counting variable:</p>
            <BlockMath math="\sum_{r=1}^{n} r = \frac{n(n+1)}{2}, \quad \sum_{r=1}^{n} r^2 = \frac{n(n+1)(2n+1)}{6}, \quad \sum_{r=1}^{n} r^3 = \left[\frac{n(n+1)}{2}\right]^2" />
            <p>Summation is <strong>linear</strong>, so a sum of several terms can be split apart, and a constant <InlineMath math="c" /> sums to:</p>
            <BlockMath math="\sum_{r=1}^{n} c = cn" />
            <p><strong>The Golden Rule:</strong> split the summation using linearity, apply each standard formula, then factorise — the answer almost always simplifies to a neat factorised form.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Summing a constant:</strong> <InlineMath math="\sum_{r=1}^{n} c = cn" />, not <InlineMath math="c" />.</li>
                <li><strong>Coefficients:</strong> a factor multiplies the <em>whole</em> standard formula, e.g. <InlineMath math="\sum 2r = 2 \cdot \frac{n(n+1)}{2}" />.</li>
                <li><strong>Not simplifying:</strong> the exam usually wants the fully factorised expression, not an unexpanded sum of fractions.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "summation-ex1",
            question: <p>Show that <InlineMath math="\displaystyle\sum_{r=1}^{n} (2r + 1) = n(n+2)" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Split the summation using linearity:</p>
                <BlockMath math="\sum_{r=1}^{n} (2r+1) = 2\sum_{r=1}^{n} r + \sum_{r=1}^{n} 1" />
                <p><strong>Step 2:</strong> Apply the standard results:</p>
                <BlockMath math="= 2 \cdot \frac{n(n+1)}{2} + n = n(n+1) + n" />
                <p><strong>Step 3:</strong> Simplify and factorise:</p>
                <BlockMath math="= n^2 + n + n = n^2 + 2n = n(n+2)" />
              </div>
            )
          },
          {
            id: "summation-ex2",
            question: <p>Find a formula for <InlineMath math="\displaystyle\sum_{r=1}^{n} r(r + 2)" /> in fully factorised form.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Expand and split:</p>
                <BlockMath math="\sum_{r=1}^{n} r(r+2) = \sum_{r=1}^{n} (r^2 + 2r) = \sum_{r=1}^{n} r^2 + 2\sum_{r=1}^{n} r" />
                <p><strong>Step 2:</strong> Apply the standard results:</p>
                <BlockMath math="= \frac{n(n+1)(2n+1)}{6} + 2 \cdot \frac{n(n+1)}{2} = \frac{n(n+1)(2n+1)}{6} + n(n+1)" />
                <p><strong>Step 3:</strong> Take out the common factor <InlineMath math="\dfrac{n(n+1)}{6}" /> and simplify:</p>
                <BlockMath math="= \frac{n(n+1)}{6}\bigl[(2n+1) + 6\bigr] = \frac{n(n+1)(2n+7)}{6}" />
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "maclaurin-series",
    title: "Maclaurin Series",
    topics: [
      {
        id: "maclaurin-series",
        title: "1. Maclaurin Series",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>The <strong>Maclaurin series</strong> expresses a function as a power series built from its derivatives at <InlineMath math="x = 0" />:</p>
            <BlockMath math="f(x) = f(0) + f'(0)\,x + \frac{f''(0)}{2!}x^2 + \frac{f'''(0)}{3!}x^3 + \cdots = \sum_{n=0}^{\infty} \frac{f^{(n)}(0)}{n!}x^n" />
            <p>To build it: differentiate repeatedly, evaluate each derivative at <InlineMath math="x=0" />, and substitute into the formula, keeping the factorial in each denominator.</p>
            <p><strong>The Golden Rule:</strong> always evaluate each derivative <em>at</em> <InlineMath math="x = 0" /> before substituting, and never drop the <InlineMath math="n!" /> denominators.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Dropping the factorials:</strong> each term is divided by <InlineMath math="n!" /> — <InlineMath math="\frac{f'''(0)}{3!}" />, not just <InlineMath math="f'''(0)" />.</li>
                <li><strong>Leaving derivatives as functions:</strong> substitute <InlineMath math="x=0" /> into every derivative before using it.</li>
                <li><strong>Sign errors:</strong> series such as <InlineMath math="\cos x" /> alternate in sign — track them carefully.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "maclaurin-ex1",
            question: <p>Find the Maclaurin series for <InlineMath math="f(x) = e^{2x}" /> up to and including the term in <InlineMath math="x^3" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Differentiate and evaluate each derivative at <InlineMath math="x=0" />:</p>
                <BlockMath math="\begin{aligned} f(x) &= e^{2x}, & f(0) &= 1 \\ f'(x) &= 2e^{2x}, & f'(0) &= 2 \\ f''(x) &= 4e^{2x}, & f''(0) &= 4 \\ f'''(x) &= 8e^{2x}, & f'''(0) &= 8 \end{aligned}" />
                <p><strong>Step 2:</strong> Substitute into the Maclaurin formula:</p>
                <BlockMath math="e^{2x} = 1 + 2x + \frac{4}{2!}x^2 + \frac{8}{3!}x^3 + \cdots" />
                <p><strong>Step 3:</strong> Simplify the coefficients:</p>
                <BlockMath math="e^{2x} = 1 + 2x + 2x^2 + \frac{4}{3}x^3 + \cdots" />
              </div>
            )
          },
          {
            id: "maclaurin-ex2",
            question: <p>Find the Maclaurin series for <InlineMath math="f(x) = \cos x" /> up to and including the term in <InlineMath math="x^4" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Differentiate and evaluate at <InlineMath math="x=0" />:</p>
                <BlockMath math="\begin{aligned} f(x) &= \cos x, & f(0) &= 1 \\ f'(x) &= -\sin x, & f'(0) &= 0 \\ f''(x) &= -\cos x, & f''(0) &= -1 \\ f'''(x) &= \sin x, & f'''(0) &= 0 \\ f^{(4)}(x) &= \cos x, & f^{(4)}(0) &= 1 \end{aligned}" />
                <p><strong>Step 2:</strong> Substitute into the formula; the odd-power terms vanish:</p>
                <BlockMath math="\cos x = 1 - \frac{1}{2!}x^2 + \frac{1}{4!}x^4 - \cdots" />
                <p><strong>Step 3:</strong> Simplify:</p>
                <BlockMath math="\cos x = 1 - \frac{x^2}{2} + \frac{x^4}{24} - \cdots" />
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "complex-numbers",
    title: "Complex Numbers",
    topics: [
      {
        id: "complex-algebraic-operations",
        title: "1. Algebraic Operations",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>A complex number has the form <InlineMath math="z = a + bi" />, where <InlineMath math="i^2 = -1" />; <InlineMath math="a" /> is the real part and <InlineMath math="b" /> the imaginary part. Add and subtract by combining real and imaginary parts; multiply by expanding and using <InlineMath math="i^2 = -1" />.</p>
            <p>The <strong>complex conjugate</strong> of <InlineMath math="z = a + bi" /> is <InlineMath math="\bar{z} = a - bi" />, and their product is real:</p>
            <BlockMath math="z\bar{z} = (a+bi)(a-bi) = a^2 + b^2" />
            <p>To <strong>divide</strong>, multiply the numerator and denominator by the conjugate of the denominator, which makes the denominator real.</p>
            <p><strong>The Golden Rule:</strong> to divide complex numbers, multiply top and bottom by the conjugate of the <em>denominator</em> — this clears <InlineMath math="i" /> from the bottom.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Forgetting <InlineMath math="i^2 = -1" />:</strong> the <InlineMath math="i^2" /> term becomes a real number and changes the real part.</li>
                <li><strong>Conjugating the wrong part:</strong> when dividing, it is the denominator you conjugate, not the numerator.</li>
                <li><strong>Mixing parts:</strong> keep real and imaginary terms separate all the way to the final <InlineMath math="a + bi" /> form.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "complex-ops-ex1",
            question: <p>Evaluate <InlineMath math="(3 + 2i)(1 - 4i)" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Expand the brackets:</p>
                <BlockMath math="(3+2i)(1-4i) = 3 - 12i + 2i - 8i^2" />
                <p><strong>Step 2:</strong> Replace <InlineMath math="i^2" /> with <InlineMath math="-1" /> and simplify:</p>
                <BlockMath math="= 3 - 10i - 8(-1) = 3 - 10i + 8 = 11 - 10i" />
              </div>
            )
          },
          {
            id: "complex-ops-ex2",
            question: <p>Express <InlineMath math="\dfrac{5 + i}{2 - 3i}" /> in the form <InlineMath math="a + bi" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Multiply numerator and denominator by the conjugate of the denominator, <InlineMath math="2 + 3i" />:</p>
                <BlockMath math="\frac{5+i}{2-3i} \times \frac{2+3i}{2+3i} = \frac{(5+i)(2+3i)}{(2-3i)(2+3i)}" />
                <p><strong>Step 2:</strong> Expand top and bottom:</p>
                <BlockMath math="= \frac{10 + 15i + 2i + 3i^2}{4 + 9} = \frac{7 + 17i}{13}" />
                <p><strong>Step 3:</strong> Write in <InlineMath math="a + bi" /> form:</p>
                <BlockMath math="= \frac{7}{13} + \frac{17}{13}i" />
              </div>
            )
          },
          {
            id: "complex-ops-ex3",
            question: <p>Find the square roots of <InlineMath math="3 + 4i" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Let <InlineMath math="\sqrt{3+4i} = a + bi" />. Squaring and comparing parts:</p>
                <BlockMath math="(a+bi)^2 = a^2 - b^2 + 2abi = 3 + 4i \implies a^2 - b^2 = 3, \quad 2ab = 4" />
                <p><strong>Step 2:</strong> From <InlineMath math="2ab = 4" /> we get <InlineMath math="b = \dfrac{2}{a}" />. Substitute:</p>
                <BlockMath math="a^2 - \frac{4}{a^2} = 3 \implies a^4 - 3a^2 - 4 = 0 \implies (a^2 - 4)(a^2 + 1) = 0" />
                <p><strong>Step 3:</strong> Since <InlineMath math="a" /> is real, <InlineMath math="a^2 = 4" />, so <InlineMath math="a = \pm 2" /> with <InlineMath math="b = \pm 1" /> to match. The square roots are:</p>
                <BlockMath math="2 + i \quad \text{and} \quad -2 - i" />
              </div>
            )
          }
        ]
      },
      {
        id: "polar-form-loci",
        title: "2. Polar Form & Loci",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>A complex number can be written in <strong>polar (modulus–argument) form</strong>:</p>
            <BlockMath math="z = r(\cos\theta + i\sin\theta), \qquad r = |z| = \sqrt{a^2 + b^2}, \quad \theta = \arg z" />
            <p>The modulus <InlineMath math="r" /> is the distance from the origin on an Argand diagram, and the argument <InlineMath math="\theta" /> is the angle measured from the positive real axis (taken in the range <InlineMath math="-\pi < \theta \leq \pi" />).</p>
            <p><strong>Loci</strong> describe sets of points: <InlineMath math="|z - a| = k" /> is a circle of radius <InlineMath math="k" /> centred at the point <InlineMath math="a" />; <InlineMath math="|z - a| = |z - b|" /> is the perpendicular bisector of the segment joining <InlineMath math="a" /> and <InlineMath math="b" />.</p>
            <p><strong>The Golden Rule:</strong> always identify which quadrant <InlineMath math="z" /> lies in before stating the argument — <InlineMath math="\arctan\frac{b}{a}" /> alone cannot tell the second quadrant from the fourth.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Argument quadrant:</strong> <InlineMath math="\arctan\frac{b}{a}" /> gives a principal value — adjust by <InlineMath math="\pm\pi" /> for the second and third quadrants.</li>
                <li><strong>Circle centre:</strong> <InlineMath math="|z - a| = k" /> is centred at the point <InlineMath math="a" />, not at the origin.</li>
                <li><strong>Argument range:</strong> stick to <InlineMath math="-\pi < \theta \leq \pi" /> unless told otherwise.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "polar-ex1",
            question: <p>Express <InlineMath math="z = 1 + i\sqrt{3}" /> in polar form.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Find the modulus:</p>
                <BlockMath math="r = \sqrt{1^2 + (\sqrt{3})^2} = \sqrt{1 + 3} = 2" />
                <p><strong>Step 2:</strong> The point <InlineMath math="(1, \sqrt{3})" /> is in the first quadrant, so the argument is:</p>
                <BlockMath math="\theta = \arctan\!\left(\frac{\sqrt{3}}{1}\right) = \frac{\pi}{3}" />
                <p><strong>Step 3:</strong> Write in polar form:</p>
                <BlockMath math="z = 2\left(\cos\frac{\pi}{3} + i\sin\frac{\pi}{3}\right)" />
              </div>
            )
          },
          {
            id: "polar-ex2",
            question: <p>Express <InlineMath math="z = -1 + i" /> in polar form.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Find the modulus:</p>
                <BlockMath math="r = \sqrt{(-1)^2 + 1^2} = \sqrt{2}" />
                <p><strong>Step 2:</strong> The point <InlineMath math="(-1, 1)" /> is in the second quadrant. The related acute angle is <InlineMath math="\frac{\pi}{4}" />, so measuring from the positive real axis:</p>
                <BlockMath math="\theta = \pi - \frac{\pi}{4} = \frac{3\pi}{4}" />
                <p><strong>Step 3:</strong> Write in polar form:</p>
                <BlockMath math="z = \sqrt{2}\left(\cos\frac{3\pi}{4} + i\sin\frac{3\pi}{4}\right)" />
              </div>
            )
          },
          {
            id: "polar-ex3",
            question: <p>Describe, and sketch mentally, the locus of points satisfying <InlineMath math="|z - 2 - i| = 3" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Rewrite the condition to identify the fixed point:</p>
                <BlockMath math="|z - (2 + i)| = 3" />
                <p><strong>Step 2:</strong> This is the set of points whose distance from <InlineMath math="2 + i" /> is <InlineMath math="3" />.</p>
                <p><strong>Step 3:</strong> The locus is a <strong>circle</strong> of radius <InlineMath math="3" /> centred at the point <InlineMath math="(2, 1)" /> on the Argand diagram.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "de-moivre-fta",
        title: "3. De Moivre's Theorem & Roots",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p><strong>De Moivre's Theorem</strong> gives powers of a complex number in polar form:</p>
            <BlockMath math="\bigl[r(\cos\theta + i\sin\theta)\bigr]^n = r^n\bigl(\cos n\theta + i\sin n\theta\bigr)" />
            <p>It is used to evaluate powers, to find <InlineMath math="n" />th roots (which are equally spaced around a circle), and to derive multiple-angle trig identities. To find all <InlineMath math="n" />th roots, add <InlineMath math="2k\pi" /> to the argument before dividing by <InlineMath math="n" />.</p>
            <p>The <strong>Fundamental Theorem of Algebra</strong> states that a polynomial of degree <InlineMath math="n" /> has exactly <InlineMath math="n" /> roots in <InlineMath math="\mathbb{C}" /> (counting multiplicity). For a polynomial with <em>real</em> coefficients, any complex roots occur in <strong>conjugate pairs</strong>.</p>
            <p><strong>The Golden Rule:</strong> when finding roots, write the argument as <InlineMath math="\theta + 2k\pi" /> first, then take <InlineMath math="k = 0, 1, \dots, n-1" /> to capture all <InlineMath math="n" /> distinct roots.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Only finding one root:</strong> you must add <InlineMath math="2k\pi" /> to the argument to obtain all <InlineMath math="n" /> roots.</li>
                <li><strong>Forgetting conjugate pairs:</strong> a real polynomial with root <InlineMath math="p + qi" /> also has root <InlineMath math="p - qi" />.</li>
                <li><strong>Applying De Moivre outside polar form:</strong> convert to modulus–argument form first.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "de-moivre-ex1",
            question: <p>Use De Moivre's Theorem to evaluate <InlineMath math="(1 + i)^8" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write <InlineMath math="1 + i" /> in polar form. Here <InlineMath math="r = \sqrt{2}" /> and <InlineMath math="\theta = \frac{\pi}{4}" />:</p>
                <BlockMath math="1 + i = \sqrt{2}\left(\cos\frac{\pi}{4} + i\sin\frac{\pi}{4}\right)" />
                <p><strong>Step 2:</strong> Apply De Moivre's Theorem with <InlineMath math="n = 8" />:</p>
                <BlockMath math="(1+i)^8 = (\sqrt{2})^8\left(\cos 2\pi + i\sin 2\pi\right) = 16(1 + 0)" />
                <p><strong>Step 3:</strong> So <InlineMath math="(1+i)^8 = 16" />.</p>
              </div>
            )
          },
          {
            id: "de-moivre-ex2",
            question: <p>Find the three cube roots of <InlineMath math="8" />, giving your answers in the form <InlineMath math="a + bi" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write <InlineMath math="8" /> in polar form, including the <InlineMath math="2k\pi" />:</p>
                <BlockMath math="8 = 8\bigl(\cos(0 + 2k\pi) + i\sin(0 + 2k\pi)\bigr)" />
                <p><strong>Step 2:</strong> Take the cube root: modulus <InlineMath math="8^{1/3} = 2" />, arguments <InlineMath math="\frac{2k\pi}{3}" /> for <InlineMath math="k = 0, 1, 2" />, giving <InlineMath math="0,\ \frac{2\pi}{3},\ \frac{4\pi}{3}" />.</p>
                <p><strong>Step 3:</strong> Evaluate each root:</p>
                <BlockMath math="2,\qquad 2\left(-\tfrac{1}{2} + \tfrac{\sqrt{3}}{2}i\right) = -1 + i\sqrt{3},\qquad -1 - i\sqrt{3}" />
              </div>
            )
          },
          {
            id: "de-moivre-ex3",
            question: <p>A polynomial with real coefficients has <InlineMath math="3 - 2i" /> as a root. Write down another root, and hence a real quadratic factor of the polynomial.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Real coefficients force complex roots into conjugate pairs, so <InlineMath math="3 + 2i" /> is also a root.</p>
                <p><strong>Step 2:</strong> The quadratic factor is <InlineMath math="(z - (3-2i))(z - (3+2i))" />. Its coefficients come from the sum and product of the roots:</p>
                <BlockMath math="\text{sum} = 6, \qquad \text{product} = (3-2i)(3+2i) = 9 + 4 = 13" />
                <p><strong>Step 3:</strong> So a real quadratic factor is:</p>
                <BlockMath math="z^2 - 6z + 13" />
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "number-theory",
    title: "Number Theory",
    topics: [
      {
        id: "euclids-algorithm",
        title: "1. Euclid's Algorithm",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p><strong>Euclid's algorithm</strong> finds the greatest common divisor (gcd) of two positive integers by repeated division. Write each step as <InlineMath math="a = qb + r" /> with <InlineMath math="0 \leq r < b" />, then replace <InlineMath math="(a, b)" /> with <InlineMath math="(b, r)" /> and repeat until the remainder is <InlineMath math="0" />. The last non-zero remainder is the gcd.</p>
            <p>The gcd can then be written as a <strong>linear combination</strong> of the two numbers, <InlineMath math="\gcd(a,b) = ax + by" /> for integers <InlineMath math="x, y" />, by <strong>back-substituting</strong> through the equations.</p>
            <p><strong>The Golden Rule:</strong> keep dividing until the remainder is <InlineMath math="0" />; the gcd is the <em>last non-zero</em> remainder. For the linear combination, work backwards through the algorithm's equations.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Reading the wrong remainder:</strong> the gcd is the last non-zero remainder, not the final <InlineMath math="0" />.</li>
                <li><strong>Back-substitution slips:</strong> substitute one equation at a time and keep the two original numbers visible so the coefficients stay correct.</li>
                <li><strong>Division form:</strong> each line must be <InlineMath math="a = qb + r" /> with <InlineMath math="0 \leq r < b" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "euclid-ex1",
            question: <p>Use Euclid's algorithm to find <InlineMath math="\gcd(1071, 462)" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Apply repeated division:</p>
                <BlockMath math="\begin{aligned} 1071 &= 2 \times 462 + 147 \\ 462 &= 3 \times 147 + 21 \\ 147 &= 7 \times 21 + 0 \end{aligned}" />
                <p><strong>Step 2:</strong> The last non-zero remainder is <InlineMath math="21" />, so <InlineMath math="\gcd(1071, 462) = 21" />.</p>
              </div>
            )
          },
          {
            id: "euclid-ex2",
            question: <p>Express <InlineMath math="\gcd(1071, 462) = 21" /> as a linear combination of <InlineMath math="1071" /> and <InlineMath math="462" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Rearrange the algorithm's equations to make the remainders the subject:</p>
                <BlockMath math="21 = 462 - 3 \times 147 \qquad 147 = 1071 - 2 \times 462" />
                <p><strong>Step 2:</strong> Substitute the expression for <InlineMath math="147" /> and collect:</p>
                <BlockMath math="21 = 462 - 3(1071 - 2 \times 462) = 7 \times 462 - 3 \times 1071" />
                <p><strong>Step 3:</strong> So <InlineMath math="21 = (-3)(1071) + (7)(462)" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "number-bases",
        title: "2. Number Bases",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>A number written in <strong>base <InlineMath math="b" /></strong> uses digits <InlineMath math="0" /> to <InlineMath math="b-1" />, with place values that are powers of <InlineMath math="b" />. To convert <strong>to base 10</strong>, multiply each digit by its place value and add. To convert <strong>from base 10</strong>, divide repeatedly by <InlineMath math="b" /> and read the remainders from the bottom up.</p>
            <p><strong>The Golden Rule:</strong> converting <em>to</em> base 10 uses place values (powers of the base); converting <em>from</em> base 10 uses repeated division, reading the remainders in reverse.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Remainder order:</strong> when dividing down, the base-<InlineMath math="b" /> digits are read from the <em>last</em> remainder to the first.</li>
                <li><strong>Place values:</strong> the rightmost digit has place value <InlineMath math="b^0 = 1" />, then <InlineMath math="b^1, b^2, \dots" /> moving left.</li>
                <li><strong>Digit range:</strong> every digit must be less than the base.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "bases-ex1",
            question: <p>Convert <InlineMath math="2143_{5}" /> (base 5) to base 10.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write each digit against its place value (powers of 5):</p>
                <BlockMath math="2143_{5} = 2(5^3) + 1(5^2) + 4(5^1) + 3(5^0)" />
                <p><strong>Step 2:</strong> Evaluate and add:</p>
                <BlockMath math="= 250 + 25 + 20 + 3 = 298" />
              </div>
            )
          },
          {
            id: "bases-ex2",
            question: <p>Convert <InlineMath math="100" /> (base 10) to base 7.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Divide repeatedly by 7, recording each remainder:</p>
                <BlockMath math="\begin{aligned} 100 \div 7 &= 14 \ \text{r } 2 \\ 14 \div 7 &= 2 \ \text{r } 0 \\ 2 \div 7 &= 0 \ \text{r } 2 \end{aligned}" />
                <p><strong>Step 2:</strong> Read the remainders from the bottom up:</p>
                <BlockMath math="100 = 202_{7}" />
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "methods-of-proof",
    title: "Methods of Proof",
    topics: [
      {
        id: "direct-proof-counterexample",
        title: "1. Direct Proof & Counterexample",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>A <strong>direct proof</strong> starts from the definitions and assumptions and deduces the conclusion through valid steps. The key is translating words into algebra: an even number is <InlineMath math="2k" />, an odd number is <InlineMath math="2k+1" />, for some integer <InlineMath math="k" />.</p>
            <p>To <strong>disprove</strong> a statement claimed to hold for <em>all</em> cases, a single <strong>counterexample</strong> is enough.</p>
            <p><strong>The Golden Rule:</strong> for a direct proof, turn the words into general algebra and manipulate to the required form. To disprove a &ldquo;for all&rdquo; claim, you need only one case that fails.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Testing numbers instead of proving:</strong> checking a few cases does not prove a general statement — use a general <InlineMath math="2k+1" />, etc.</li>
                <li><strong>Invalid counterexample:</strong> a counterexample must satisfy the hypothesis but break the conclusion.</li>
                <li><strong>Not reaching the required form:</strong> finish by showing the result is exactly what was asked (e.g. of the form <InlineMath math="2 \times \text{integer}" />).</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "direct-ex1",
            question: <p>Prove that the sum of any two odd numbers is even.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Let the two odd numbers be <InlineMath math="2m+1" /> and <InlineMath math="2n+1" />, where <InlineMath math="m, n" /> are integers.</p>
                <p><strong>Step 2:</strong> Add them:</p>
                <BlockMath math="(2m+1) + (2n+1) = 2m + 2n + 2 = 2(m + n + 1)" />
                <p><strong>Step 3:</strong> Since <InlineMath math="m + n + 1" /> is an integer, the sum is a multiple of <InlineMath math="2" />, and is therefore even, as required.</p>
              </div>
            )
          },
          {
            id: "direct-ex2",
            question: <p>Disprove the statement: &ldquo;<InlineMath math="n^2 - n + 41" /> is prime for every positive integer <InlineMath math="n" />.&rdquo;</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Look for a value of <InlineMath math="n" /> that makes the expression factorise. Try <InlineMath math="n = 41" />:</p>
                <BlockMath math="41^2 - 41 + 41 = 41^2 = 1681" />
                <p><strong>Step 2:</strong> But <InlineMath math="1681 = 41 \times 41" />, which is not prime. So <InlineMath math="n = 41" /> is a counterexample, and the statement is false.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "proof-by-contrapositive",
        title: "2. Proof by Contrapositive",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>To prove &ldquo;if <InlineMath math="P" /> then <InlineMath math="Q" />&rdquo;, it is sometimes easier to prove the logically equivalent <strong>contrapositive</strong>: &ldquo;if not <InlineMath math="Q" /> then not <InlineMath math="P" />&rdquo;. The two statements are always true or false together.</p>
            <BlockMath math="(P \Rightarrow Q) \quad\equiv\quad (\lnot Q \Rightarrow \lnot P)" />
            <p><strong>The Golden Rule:</strong> the contrapositive negates <em>and</em> swaps the two parts. It is <em>not</em> the converse &ldquo;if <InlineMath math="Q" /> then <InlineMath math="P" />&rdquo;, which is not equivalent.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Contrapositive vs converse:</strong> the converse <InlineMath math="Q \Rightarrow P" /> is a different statement — do not prove that instead.</li>
                <li><strong>Negating carelessly:</strong> the negation of &ldquo;even&rdquo; is &ldquo;odd&rdquo;; make sure the negations are exact.</li>
                <li><strong>Stopping early:</strong> once the contrapositive is proved, state that the original statement therefore holds.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "contrapositive-ex1",
            question: <p>Prove, by contrapositive, that for any integer <InlineMath math="n" />, if <InlineMath math="n^2" /> is even then <InlineMath math="n" /> is even.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The contrapositive is: &ldquo;if <InlineMath math="n" /> is odd then <InlineMath math="n^2" /> is odd&rdquo;. Assume <InlineMath math="n" /> is odd, so <InlineMath math="n = 2k+1" />.</p>
                <p><strong>Step 2:</strong> Square it:</p>
                <BlockMath math="n^2 = (2k+1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1" />
                <p><strong>Step 3:</strong> This is of the form <InlineMath math="2 \times \text{integer} + 1" />, so <InlineMath math="n^2" /> is odd. The contrapositive holds, so the original statement is true.</p>
              </div>
            )
          },
          {
            id: "contrapositive-ex2",
            question: <p>Prove, by contrapositive, that for any integer <InlineMath math="n" />, if <InlineMath math="3n + 2" /> is odd then <InlineMath math="n" /> is odd.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The contrapositive is: &ldquo;if <InlineMath math="n" /> is even then <InlineMath math="3n + 2" /> is even&rdquo;. Assume <InlineMath math="n" /> is even, so <InlineMath math="n = 2k" />.</p>
                <p><strong>Step 2:</strong> Substitute:</p>
                <BlockMath math="3n + 2 = 3(2k) + 2 = 6k + 2 = 2(3k + 1)" />
                <p><strong>Step 3:</strong> This is even. The contrapositive holds, so the original statement is true.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "proof-by-induction",
        title: "3. Proof by Induction",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p><strong>Proof by induction</strong> establishes a statement <InlineMath math="P(n)" /> for all positive integers <InlineMath math="n" /> in three parts:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Base case:</strong> show <InlineMath math="P(1)" /> is true.</li>
              <li><strong>Inductive step:</strong> assume <InlineMath math="P(k)" /> is true (the inductive hypothesis), and use it to prove <InlineMath math="P(k+1)" />.</li>
              <li><strong>Conclusion:</strong> state that, by induction, <InlineMath math="P(n)" /> holds for all <InlineMath math="n \geq 1" />.</li>
            </ul>
            <p><strong>The Golden Rule:</strong> you must actually <em>use</em> the inductive hypothesis when proving <InlineMath math="P(k+1)" /> — that is the heart of the method — and never skip the base case or the concluding statement.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Missing the base case:</strong> without <InlineMath math="P(1)" /> the induction has no foundation.</li>
                <li><strong>Not using the hypothesis:</strong> the <InlineMath math="P(k+1)" /> working must build on the assumed <InlineMath math="P(k)" />.</li>
                <li><strong>No conclusion:</strong> finish with the &ldquo;therefore true for all <InlineMath math="n" />&rdquo; statement to earn the final mark.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "induction-ex1",
            question: <p>Prove by induction that <InlineMath math="\displaystyle\sum_{r=1}^{n} r = \frac{n(n+1)}{2}" /> for all positive integers <InlineMath math="n" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Base case:</strong> for <InlineMath math="n=1" />, the left side is <InlineMath math="1" /> and the right side is <InlineMath math="\frac{1(2)}{2} = 1" />. True.</p>
                <p><strong>Inductive step:</strong> assume the result holds for <InlineMath math="n = k" />, i.e. <InlineMath math="\sum_{r=1}^{k} r = \frac{k(k+1)}{2}" />. Then:</p>
                <BlockMath math="\sum_{r=1}^{k+1} r = \frac{k(k+1)}{2} + (k+1) = \frac{k(k+1) + 2(k+1)}{2} = \frac{(k+1)(k+2)}{2}" />
                <p><strong>Conclusion:</strong> this is the formula with <InlineMath math="n = k+1" />, so if it holds for <InlineMath math="k" /> it holds for <InlineMath math="k+1" />. Since it holds for <InlineMath math="n=1" />, by induction it holds for all <InlineMath math="n \geq 1" />.</p>
              </div>
            )
          },
          {
            id: "induction-ex2",
            question: <p>Prove by induction that <InlineMath math="8^n - 1" /> is divisible by <InlineMath math="7" /> for all positive integers <InlineMath math="n" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Base case:</strong> for <InlineMath math="n=1" />, <InlineMath math="8^1 - 1 = 7" />, which is divisible by <InlineMath math="7" />. True.</p>
                <p><strong>Inductive step:</strong> assume <InlineMath math="8^k - 1" /> is divisible by <InlineMath math="7" />, so <InlineMath math="8^k = 7m + 1" /> for some integer <InlineMath math="m" />. Then:</p>
                <BlockMath math="8^{k+1} - 1 = 8 \cdot 8^k - 1 = 8(7m + 1) - 1 = 56m + 7 = 7(8m + 1)" />
                <p><strong>Conclusion:</strong> this is a multiple of <InlineMath math="7" />, so the result holds for <InlineMath math="k+1" />. Since it holds for <InlineMath math="n=1" />, by induction <InlineMath math="8^n - 1" /> is divisible by <InlineMath math="7" /> for all <InlineMath math="n \geq 1" />.</p>
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "differentiation",
    title: "Differentiation",
    topics: [
      {
        id: "differentiation-rules",
        title: "1. Rules & Standard Derivatives",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>Advanced Higher extends Higher differentiation with three key rules and a wider set of standard derivatives.</p>
            <BlockMath math="(uv)' = u'v + uv' \qquad \left(\frac{u}{v}\right)' = \frac{u'v - uv'}{v^2} \qquad \bigl(f(g(x))\bigr)' = f'(g(x))\,g'(x)" />
            <p>Standard derivatives you should know include:</p>
            <BlockMath math="\frac{d}{dx}(\tan x) = \sec^2 x, \quad \frac{d}{dx}(\sec x) = \sec x \tan x, \quad \frac{d}{dx}(\tan^{-1} x) = \frac{1}{1 + x^2}" />
            <p><strong>The Golden Rule:</strong> identify the structure before differentiating — a product, a quotient, or a composition — and apply the matching rule. For combinations, work from the outside in.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Quotient rule order:</strong> the numerator is <InlineMath math="u'v - uv'" />, in that order — reversing it flips the sign.</li>
                <li><strong>Chain rule inside factor:</strong> always multiply by the derivative of the inner function.</li>
                <li><strong>Standard derivatives:</strong> know the exact forms, e.g. <InlineMath math="\frac{d}{dx}(\tan x) = \sec^2 x" />, not <InlineMath math="\sec x" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "diff-rules-ex1",
            question: <p>Differentiate <InlineMath math="y = x^2 \sin x" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> This is a product with <InlineMath math="u = x^2" />, <InlineMath math="v = \sin x" />. Apply the product rule:</p>
                <BlockMath math="\frac{dy}{dx} = (2x)(\sin x) + (x^2)(\cos x)" />
                <p><strong>Step 2:</strong> So <InlineMath math="\dfrac{dy}{dx} = 2x\sin x + x^2\cos x" />.</p>
              </div>
            )
          },
          {
            id: "diff-rules-ex2",
            question: <p>Differentiate <InlineMath math="y = \dfrac{2x + 1}{x^2 + 1}" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Quotient rule with <InlineMath math="u = 2x+1" /> (<InlineMath math="u' = 2" />) and <InlineMath math="v = x^2+1" /> (<InlineMath math="v' = 2x" />):</p>
                <BlockMath math="\frac{dy}{dx} = \frac{2(x^2+1) - (2x+1)(2x)}{(x^2+1)^2}" />
                <p><strong>Step 2:</strong> Expand and simplify the numerator:</p>
                <BlockMath math="= \frac{2x^2 + 2 - 4x^2 - 2x}{(x^2+1)^2} = \frac{-2x^2 - 2x + 2}{(x^2+1)^2}" />
              </div>
            )
          },
          {
            id: "diff-rules-ex3",
            question: <p>Differentiate <InlineMath math="y = e^{3x}\cos 2x" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Product rule, using the chain rule on each factor: <InlineMath math="\frac{d}{dx}(e^{3x}) = 3e^{3x}" /> and <InlineMath math="\frac{d}{dx}(\cos 2x) = -2\sin 2x" />.</p>
                <BlockMath math="\frac{dy}{dx} = 3e^{3x}\cos 2x + e^{3x}(-2\sin 2x)" />
                <p><strong>Step 2:</strong> Factor out <InlineMath math="e^{3x}" />:</p>
                <BlockMath math="= e^{3x}(3\cos 2x - 2\sin 2x)" />
              </div>
            )
          }
        ]
      },
      {
        id: "implicit-differentiation",
        title: "2. Implicit Differentiation",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>When <InlineMath math="y" /> is defined <strong>implicitly</strong> (the equation is not solved for <InlineMath math="y" />), differentiate both sides with respect to <InlineMath math="x" />, treating <InlineMath math="y" /> as a function of <InlineMath math="x" />. Each <InlineMath math="y" />-term picks up a factor of <InlineMath math="\frac{dy}{dx}" /> by the chain rule; then collect and solve.</p>
            <BlockMath math="\frac{d}{dx}\bigl(y^n\bigr) = n\,y^{n-1}\frac{dy}{dx}" />
            <p><strong>The Golden Rule:</strong> every time you differentiate a term containing <InlineMath math="y" />, multiply by <InlineMath math="\frac{dy}{dx}" />; then gather all <InlineMath math="\frac{dy}{dx}" /> terms on one side and factor.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Dropping <InlineMath math="\frac{dy}{dx}" />:</strong> differentiating a <InlineMath math="y" />-term without the chain-rule factor is the most common error.</li>
                <li><strong>Mixed terms:</strong> a term like <InlineMath math="xy" /> needs the product rule: <InlineMath math="\frac{d}{dx}(xy) = y + x\frac{dy}{dx}" />.</li>
                <li><strong>Solving slips:</strong> factor <InlineMath math="\frac{dy}{dx}" /> carefully before dividing.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "implicit-ex1",
            question: <p>Find <InlineMath math="\dfrac{dy}{dx}" /> for the circle <InlineMath math="x^2 + y^2 = 25" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Differentiate both sides with respect to <InlineMath math="x" />:</p>
                <BlockMath math="2x + 2y\frac{dy}{dx} = 0" />
                <p><strong>Step 2:</strong> Solve for <InlineMath math="\frac{dy}{dx}" />:</p>
                <BlockMath math="\frac{dy}{dx} = -\frac{x}{y}" />
              </div>
            )
          },
          {
            id: "implicit-ex2",
            question: <p>Find <InlineMath math="\dfrac{dy}{dx}" /> for <InlineMath math="x^2 + xy + y^2 = 7" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Differentiate term by term, using the product rule on <InlineMath math="xy" />:</p>
                <BlockMath math="2x + \left(y + x\frac{dy}{dx}\right) + 2y\frac{dy}{dx} = 0" />
                <p><strong>Step 2:</strong> Gather the <InlineMath math="\frac{dy}{dx}" /> terms:</p>
                <BlockMath math="(x + 2y)\frac{dy}{dx} = -(2x + y)" />
                <p><strong>Step 3:</strong> Solve:</p>
                <BlockMath math="\frac{dy}{dx} = -\frac{2x + y}{x + 2y}" />
              </div>
            )
          }
        ]
      },
      {
        id: "logarithmic-differentiation",
        title: "3. Logarithmic Differentiation",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p><strong>Logarithmic differentiation</strong> takes the natural log of both sides first, using log laws to turn products, quotients and powers into sums and multiples, and then differentiates implicitly. It is essential when the variable appears in the index, such as <InlineMath math="y = x^x" />.</p>
            <p><strong>The Golden Rule:</strong> take <InlineMath math="\ln" /> of both sides, simplify with log laws, differentiate implicitly (the left side becomes <InlineMath math="\frac{1}{y}\frac{dy}{dx}" />), then multiply through by <InlineMath math="y" /> and substitute it back.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The left side:</strong> differentiating <InlineMath math="\ln y" /> gives <InlineMath math="\frac{1}{y}\frac{dy}{dx}" /> — don't forget the <InlineMath math="\frac{dy}{dx}" />.</li>
                <li><strong>Not substituting <InlineMath math="y" /> back:</strong> the final answer should be in terms of <InlineMath math="x" />.</li>
                <li><strong>Log laws:</strong> <InlineMath math="\ln(ab) = \ln a + \ln b" /> and <InlineMath math="\ln(a^n) = n\ln a" /> — apply them before differentiating.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "log-diff-ex1",
            question: <p>Differentiate <InlineMath math="y = x^x" /> for <InlineMath math="x > 0" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Take natural logs and simplify:</p>
                <BlockMath math="\ln y = \ln(x^x) = x\ln x" />
                <p><strong>Step 2:</strong> Differentiate implicitly (product rule on the right):</p>
                <BlockMath math="\frac{1}{y}\frac{dy}{dx} = \ln x + x \cdot \frac{1}{x} = \ln x + 1" />
                <p><strong>Step 3:</strong> Multiply by <InlineMath math="y = x^x" />:</p>
                <BlockMath math="\frac{dy}{dx} = x^x(\ln x + 1)" />
              </div>
            )
          },
          {
            id: "log-diff-ex2",
            question: <p>Use logarithmic differentiation to find <InlineMath math="\dfrac{dy}{dx}" /> for <InlineMath math="y = \dfrac{(2x+1)^3}{(x-1)^2}" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Take logs and use the log laws:</p>
                <BlockMath math="\ln y = 3\ln(2x+1) - 2\ln(x-1)" />
                <p><strong>Step 2:</strong> Differentiate implicitly:</p>
                <BlockMath math="\frac{1}{y}\frac{dy}{dx} = \frac{6}{2x+1} - \frac{2}{x-1}" />
                <p><strong>Step 3:</strong> Multiply by <InlineMath math="y" />:</p>
                <BlockMath math="\frac{dy}{dx} = \frac{(2x+1)^3}{(x-1)^2}\left(\frac{6}{2x+1} - \frac{2}{x-1}\right)" />
              </div>
            )
          }
        ]
      },
      {
        id: "parametric-differentiation",
        title: "4. Parametric Differentiation",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>When a curve is given by <InlineMath math="x" /> and <InlineMath math="y" /> in terms of a <strong>parameter</strong> <InlineMath math="t" />, the gradient is found by the chain rule:</p>
            <BlockMath math="\frac{dy}{dx} = \frac{dy/dt}{dx/dt}" />
            <p>The second derivative differentiates <InlineMath math="\frac{dy}{dx}" /> with respect to <InlineMath math="t" />, then divides by <InlineMath math="\frac{dx}{dt}" /> again:</p>
            <BlockMath math="\frac{d^2y}{dx^2} = \frac{\frac{d}{dt}\!\left(\frac{dy}{dx}\right)}{dx/dt}" />
            <p><strong>The Golden Rule:</strong> divide the <InlineMath math="t" />-derivatives to get <InlineMath math="\frac{dy}{dx}" />. For the second derivative, differentiate <InlineMath math="\frac{dy}{dx}" /> with respect to <InlineMath math="t" /> and divide by <InlineMath math="\frac{dx}{dt}" /> once more.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>The second derivative is NOT <InlineMath math="\frac{d^2y/dt^2}{d^2x/dt^2}" />:</strong> you must divide by <InlineMath math="\frac{dx}{dt}" />, not by <InlineMath math="\frac{d^2x}{dt^2}" />.</li>
                <li><strong>Dividing vs differentiating:</strong> <InlineMath math="\frac{dy}{dx}" /> is a quotient of the two <InlineMath math="t" />-derivatives.</li>
                <li><strong>Chain rule again:</strong> the second derivative needs another division by <InlineMath math="\frac{dx}{dt}" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "parametric-ex1",
            question: <p>A curve is defined by <InlineMath math="x = t^2" />, <InlineMath math="y = t^3" />. Find <InlineMath math="\dfrac{dy}{dx}" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Differentiate each with respect to <InlineMath math="t" />:</p>
                <BlockMath math="\frac{dx}{dt} = 2t, \qquad \frac{dy}{dt} = 3t^2" />
                <p><strong>Step 2:</strong> Divide:</p>
                <BlockMath math="\frac{dy}{dx} = \frac{3t^2}{2t} = \frac{3}{2}t" />
              </div>
            )
          },
          {
            id: "parametric-ex2",
            question: <p>For the curve <InlineMath math="x = t^2" />, <InlineMath math="y = t^3" />, find <InlineMath math="\dfrac{d^2y}{dx^2}" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> From the previous result, <InlineMath math="\frac{dy}{dx} = \frac{3}{2}t" />. Differentiate this with respect to <InlineMath math="t" />:</p>
                <BlockMath math="\frac{d}{dt}\!\left(\frac{3}{2}t\right) = \frac{3}{2}" />
                <p><strong>Step 2:</strong> Divide by <InlineMath math="\frac{dx}{dt} = 2t" />:</p>
                <BlockMath math="\frac{d^2y}{dx^2} = \frac{3/2}{2t} = \frac{3}{4t}" />
              </div>
            )
          }
        ]
      },
      {
        id: "related-rates",
        title: "5. Related Rates of Change",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>In a <strong>related rates</strong> problem, two quantities are linked by an equation and both change with time. Differentiate the relationship with respect to time <InlineMath math="t" /> (using the chain rule) to connect their rates, then substitute the values at the instant asked.</p>
            <p><strong>The Golden Rule:</strong> write the equation relating the quantities, differentiate the whole equation with respect to <InlineMath math="t" />, and only <em>then</em> substitute the given values.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Differentiate with respect to time:</strong> the derivative is with respect to <InlineMath math="t" />, so every variable picks up a rate (e.g. <InlineMath math="\frac{dr}{dt}" />).</li>
                <li><strong>Substituting too early:</strong> keep quantities as variables until after differentiating.</li>
                <li><strong>Chain of rates:</strong> link them correctly, e.g. <InlineMath math="\frac{dA}{dt} = \frac{dA}{dr}\cdot\frac{dr}{dt}" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "related-rates-ex1",
            question: <p>The radius of a circle increases at <InlineMath math="2" /> cm/s. Find the rate at which the area is increasing when the radius is <InlineMath math="5" /> cm.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The area is <InlineMath math="A = \pi r^2" />. Differentiate with respect to <InlineMath math="t" />:</p>
                <BlockMath math="\frac{dA}{dt} = 2\pi r \frac{dr}{dt}" />
                <p><strong>Step 2:</strong> Substitute <InlineMath math="r = 5" /> and <InlineMath math="\frac{dr}{dt} = 2" />:</p>
                <BlockMath math="\frac{dA}{dt} = 2\pi(5)(2) = 20\pi \ \text{cm}^2/\text{s}" />
              </div>
            )
          },
          {
            id: "related-rates-ex2",
            question: <p>A spherical balloon is inflated so that its volume increases at <InlineMath math="100" /> cm³/s. Find the rate at which the radius is increasing when the radius is <InlineMath math="5" /> cm.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The volume is <InlineMath math="V = \frac{4}{3}\pi r^3" />. Differentiate with respect to <InlineMath math="t" />:</p>
                <BlockMath math="\frac{dV}{dt} = 4\pi r^2 \frac{dr}{dt}" />
                <p><strong>Step 2:</strong> Substitute <InlineMath math="\frac{dV}{dt} = 100" /> and <InlineMath math="r = 5" />:</p>
                <BlockMath math="100 = 4\pi(25)\frac{dr}{dt} = 100\pi\frac{dr}{dt}" />
                <p><strong>Step 3:</strong> Solve for the rate:</p>
                <BlockMath math="\frac{dr}{dt} = \frac{100}{100\pi} = \frac{1}{\pi} \ \text{cm/s}" />
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "functions-and-graphs",
    title: "Functions and Graphs",
    topics: [
      {
        id: "asymptotes",
        title: "1. Asymptotes",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>For a rational function, a <strong>vertical asymptote</strong> occurs where the denominator is zero (and the numerator is not). The <strong>non-vertical asymptote</strong> describes behaviour as <InlineMath math="x \to \pm\infty" />:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Equal degrees on top and bottom &rarr; a horizontal asymptote at the ratio of the leading coefficients.</li>
              <li>Numerator one degree higher &rarr; a slant (oblique) asymptote, found by algebraic division.</li>
            </ul>
            <p><strong>The Golden Rule:</strong> vertical asymptotes come from the zeros of the denominator; for the non-vertical asymptote, compare the degrees — divide if the top degree is the larger.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Hidden hole:</strong> if a factor cancels, there is a hole, not an asymptote — check the numerator is non-zero there.</li>
                <li><strong>Slant asymptote:</strong> needs polynomial division; the asymptote is the quotient (ignoring the remainder term).</li>
                <li><strong>Wrong horizontal value:</strong> for equal degrees it is the ratio of the <em>leading</em> coefficients.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "asymptotes-ex1",
            question: <p>Find the asymptotes of <InlineMath math="y = \dfrac{2x + 1}{x - 3}" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The denominator is zero at <InlineMath math="x = 3" />, giving a vertical asymptote <InlineMath math="x = 3" />.</p>
                <p><strong>Step 2:</strong> The degrees are equal, so as <InlineMath math="x \to \pm\infty" /> the function tends to the ratio of leading coefficients:</p>
                <BlockMath math="y \to \frac{2x}{x} = 2" />
                <p>So there is a horizontal asymptote <InlineMath math="y = 2" />.</p>
              </div>
            )
          },
          {
            id: "asymptotes-ex2",
            question: <p>Find the asymptotes of <InlineMath math="y = \dfrac{x^2 + 1}{x - 1}" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Vertical asymptote where the denominator is zero: <InlineMath math="x = 1" />.</p>
                <p><strong>Step 2:</strong> The numerator's degree is one higher, so divide to find the slant asymptote:</p>
                <BlockMath math="\frac{x^2 + 1}{x - 1} = x + 1 + \frac{2}{x - 1}" />
                <p><strong>Step 3:</strong> As <InlineMath math="x \to \pm\infty" /> the remainder term vanishes, so the slant asymptote is <InlineMath math="y = x + 1" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "odd-even-functions",
        title: "2. Odd & Even Functions",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>A function is <strong>even</strong> if <InlineMath math="f(-x) = f(x)" /> (symmetric about the <InlineMath math="y" />-axis, like <InlineMath math="x^2" /> or <InlineMath math="\cos x" />), and <strong>odd</strong> if <InlineMath math="f(-x) = -f(x)" /> (rotational symmetry about the origin, like <InlineMath math="x^3" /> or <InlineMath math="\sin x" />). A function that satisfies neither is simply neither.</p>
            <p><strong>The Golden Rule:</strong> compute <InlineMath math="f(-x)" /> and compare: equal to <InlineMath math="f(x)" /> means even, equal to <InlineMath math="-f(x)" /> means odd, otherwise neither.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>A mixed function is neither:</strong> a sum like <InlineMath math="x^2 + x" /> is neither odd nor even — every term must fit the same pattern.</li>
                <li><strong>Negating the whole function:</strong> <InlineMath math="-f(x)" /> negates every term, not just some.</li>
                <li><strong>Even powers vs odd powers:</strong> even powers of <InlineMath math="x" /> are unchanged by <InlineMath math="x \to -x" />; odd powers change sign.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "odd-even-ex1",
            question: <p>Determine whether <InlineMath math="f(x) = x^3 - 4x" /> is odd, even, or neither.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Compute <InlineMath math="f(-x)" />:</p>
                <BlockMath math="f(-x) = (-x)^3 - 4(-x) = -x^3 + 4x" />
                <p><strong>Step 2:</strong> Compare with <InlineMath math="-f(x) = -(x^3 - 4x) = -x^3 + 4x" />. They match, so <InlineMath math="f" /> is <strong>odd</strong>.</p>
              </div>
            )
          },
          {
            id: "odd-even-ex2",
            question: <p>Determine whether <InlineMath math="f(x) = x^4 + 3x^2 - 1" /> is odd, even, or neither.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Compute <InlineMath math="f(-x)" />:</p>
                <BlockMath math="f(-x) = (-x)^4 + 3(-x)^2 - 1 = x^4 + 3x^2 - 1" />
                <p><strong>Step 2:</strong> This equals <InlineMath math="f(x)" />, so <InlineMath math="f" /> is <strong>even</strong>.</p>
              </div>
            )
          },
          {
            id: "odd-even-ex3",
            question: <p>Determine whether <InlineMath math="f(x) = x^2 + x" /> is odd, even, or neither.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Compute <InlineMath math="f(-x) = (-x)^2 + (-x) = x^2 - x" />.</p>
                <p><strong>Step 2:</strong> This is neither <InlineMath math="f(x) = x^2 + x" /> nor <InlineMath math="-f(x) = -x^2 - x" />, so <InlineMath math="f" /> is <strong>neither</strong> odd nor even.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "stationary-points-inflection",
        title: "3. Stationary Points & Inflection",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p><strong>Stationary points</strong> occur where <InlineMath math="f'(x) = 0" />. Classify them using the second derivative: <InlineMath math="f''(x) > 0" /> gives a minimum, <InlineMath math="f''(x) < 0" /> gives a maximum. A <strong>point of inflection</strong> is where the concavity changes — where <InlineMath math="f''(x) = 0" /> <em>and</em> <InlineMath math="f''" /> changes sign.</p>
            <p><strong>The Golden Rule:</strong> solve <InlineMath math="f'(x) = 0" /> for the stationary points, then use the sign of <InlineMath math="f''(x)" /> to classify each; for an inflection, confirm the concavity actually changes.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong><InlineMath math="f''(x) = 0" /> is not enough:</strong> an inflection also needs a genuine change of sign in <InlineMath math="f''" />.</li>
                <li><strong>Missing the <InlineMath math="y" />-coordinate:</strong> give full coordinates for each stationary point.</li>
                <li><strong>Nature confusion:</strong> keep the sign test straight — positive second derivative is a minimum.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "stationary-ex1",
            question: <p>Find and classify the stationary points of <InlineMath math="y = x^3 - 3x" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Set <InlineMath math="\frac{dy}{dx} = 0" />:</p>
                <BlockMath math="3x^2 - 3 = 0 \implies x = \pm 1" />
                <p><strong>Step 2:</strong> Use <InlineMath math="\frac{d^2y}{dx^2} = 6x" /> to classify:</p>
                <BlockMath math="x = 1:\ 6 > 0 \ (\text{min}), \qquad x = -1:\ -6 < 0 \ (\text{max})" />
                <p><strong>Step 3:</strong> Find the <InlineMath math="y" />-coordinates: minimum at <InlineMath math="(1, -2)" />, maximum at <InlineMath math="(-1, 2)" />.</p>
              </div>
            )
          },
          {
            id: "stationary-ex2",
            question: <p>Find the point of inflection of <InlineMath math="y = x^3 - 6x^2 + 5" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Differentiate twice and set the second derivative to zero:</p>
                <BlockMath math="\frac{dy}{dx} = 3x^2 - 12x, \qquad \frac{d^2y}{dx^2} = 6x - 12 = 0 \implies x = 2" />
                <p><strong>Step 2:</strong> Check the sign change: <InlineMath math="f''(x) < 0" /> for <InlineMath math="x < 2" /> and <InlineMath math="f''(x) > 0" /> for <InlineMath math="x > 2" />, so the concavity changes.</p>
                <p><strong>Step 3:</strong> Evaluate <InlineMath math="y" />: <InlineMath math="8 - 24 + 5 = -11" />. The point of inflection is <InlineMath math="(2, -11)" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "extrema-max-min",
        title: "4. Maximum & Minimum Values",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>On a <strong>closed interval</strong> <InlineMath math="[a, b]" />, the greatest and least values of a continuous function occur either at a stationary point inside the interval or at an endpoint. The method is: find the stationary points in <InlineMath math="(a, b)" />, then evaluate the function at those points and at both endpoints, and compare.</p>
            <p><strong>The Golden Rule:</strong> on a closed interval, always evaluate the endpoints as well as the interior stationary points — the extreme value is often at an end.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Forgetting endpoints:</strong> checking only stationary points can miss the true maximum or minimum.</li>
                <li><strong>Out-of-range stationary points:</strong> discard any that fall outside the interval.</li>
                <li><strong>Compare values, not <InlineMath math="x" />:</strong> the answer is the largest/smallest function <em>value</em>.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "extrema-ex1",
            question: <p>Find the maximum and minimum values of <InlineMath math="f(x) = x^3 - 3x" /> on the closed interval <InlineMath math="[0, 3]" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Stationary points: <InlineMath math="f'(x) = 3x^2 - 3 = 0 \implies x = \pm 1" />. Only <InlineMath math="x = 1" /> lies in <InlineMath math="[0, 3]" />.</p>
                <p><strong>Step 2:</strong> Evaluate at the interior point and both endpoints:</p>
                <BlockMath math="f(0) = 0, \qquad f(1) = -2, \qquad f(3) = 18" />
                <p><strong>Step 3:</strong> The maximum value is <InlineMath math="18" /> (at <InlineMath math="x = 3" />) and the minimum value is <InlineMath math="-2" /> (at <InlineMath math="x = 1" />).</p>
              </div>
            )
          },
          {
            id: "extrema-ex2",
            question: <p>Find the maximum and minimum values of <InlineMath math="f(x) = 2x^3 - 3x^2" /> on <InlineMath math="[-1, 2]" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Stationary points: <InlineMath math="f'(x) = 6x^2 - 6x = 6x(x-1) = 0 \implies x = 0, 1" />. Both lie in <InlineMath math="[-1, 2]" />.</p>
                <p><strong>Step 2:</strong> Evaluate at the stationary points and endpoints:</p>
                <BlockMath math="f(-1) = -5, \quad f(0) = 0, \quad f(1) = -1, \quad f(2) = 4" />
                <p><strong>Step 3:</strong> The maximum value is <InlineMath math="4" /> (at <InlineMath math="x = 2" />) and the minimum value is <InlineMath math="-5" /> (at <InlineMath math="x = -1" />).</p>
              </div>
            )
          }
        ]
      },
      {
        id: "curve-sketching-related-graphs",
        title: "5. Curve Sketching & Related Graphs",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>A full <strong>curve sketch</strong> combines intercepts, stationary points, asymptotes and behaviour at infinity. <strong>Related graphs</strong> are obtained from <InlineMath math="y = f(x)" /> by transformations: <InlineMath math="f(x) + a" /> shifts up, <InlineMath math="f(x + a) " /> shifts left, <InlineMath math="af(x)" /> stretches vertically, <InlineMath math="-f(x)" /> reflects in the <InlineMath math="x" />-axis, <InlineMath math="|f(x)|" /> reflects the negative parts upward, and <InlineMath math="y = f^{-1}(x)" /> reflects in the line <InlineMath math="y = x" />.</p>
            <p><strong>The Golden Rule:</strong> apply one transformation at a time and track how the key features — roots, turning points and asymptotes — move.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Horizontal shift direction:</strong> <InlineMath math="f(x + a)" /> moves the graph <em>left</em> for <InlineMath math="a > 0" /> — the opposite of what many expect.</li>
                <li><strong>Modulus graph:</strong> <InlineMath math="|f(x)|" /> reflects only the parts below the <InlineMath math="x" />-axis; the rest is unchanged.</li>
                <li><strong>Derivative graph:</strong> the roots of <InlineMath math="y = f'(x)" /> are the <InlineMath math="x" />-values of the turning points of <InlineMath math="y = f(x)" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "curve-sketch-ex1",
            question: <p>The graph of <InlineMath math="y = f(x)" /> has a maximum turning point at <InlineMath math="(2, 5)" />. State the coordinates of the corresponding turning point on the graph of <InlineMath math="y = f(x - 1) + 3" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The <InlineMath math="f(x-1)" /> part shifts the graph <InlineMath math="1" /> unit to the right; the <InlineMath math="+3" /> shifts it <InlineMath math="3" /> units up.</p>
                <p><strong>Step 2:</strong> Apply both shifts to the point <InlineMath math="(2, 5)" />:</p>
                <BlockMath math="(2 + 1,\ 5 + 3) = (3, 8)" />
                <p>The turning point is a maximum at <InlineMath math="(3, 8)" />.</p>
              </div>
            )
          },
          {
            id: "curve-sketch-ex2",
            question: <p>The graph of <InlineMath math="y = f(x)" /> has stationary points at <InlineMath math="x = 2" /> and <InlineMath math="x = 4" />. State the <InlineMath math="x" />-coordinates where the graph of <InlineMath math="y = f'(x)" /> crosses the <InlineMath math="x" />-axis.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> A stationary point of <InlineMath math="f" /> is where <InlineMath math="f'(x) = 0" />, i.e. where the derivative graph meets the <InlineMath math="x" />-axis.</p>
                <p><strong>Step 2:</strong> So <InlineMath math="y = f'(x)" /> crosses the <InlineMath math="x" />-axis at <InlineMath math="x = 2" /> and <InlineMath math="x = 4" />.</p>
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "integration",
    title: "Integration",
    topics: [
      {
        id: "standard-integrals-substitution",
        title: "1. Standard Integrals & Substitution",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>Advanced Higher adds several standard integrals and the technique of substitution. Key results include:</p>
            <BlockMath math="\int \sec^2 x\,dx = \tan x + c, \quad \int \frac{1}{1+x^2}\,dx = \tan^{-1} x + c, \quad \int \frac{f'(x)}{f(x)}\,dx = \ln|f(x)| + c" />
            <p>For <strong>integration by substitution</strong>, choose <InlineMath math="u" /> so that its derivative appears (up to a constant) in the integrand, and convert every part — including <InlineMath math="dx" /> — into <InlineMath math="u" />.</p>
            <p><strong>The Golden Rule:</strong> spot the <InlineMath math="\frac{f'(x)}{f(x)}" /> and <InlineMath math="g(f(x))f'(x)" /> patterns for a quick substitution, and always replace <InlineMath math="dx" /> using <InlineMath math="du = \frac{du}{dx}\,dx" />.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Forgetting the <InlineMath math="dx \to du" /> step:</strong> the whole integrand, including <InlineMath math="dx" />, must be in terms of <InlineMath math="u" />.</li>
                <li><strong>Definite limits:</strong> either change the limits to <InlineMath math="u" />-values or substitute back before applying them.</li>
                <li><strong>Missing the log pattern:</strong> <InlineMath math="\int \frac{f'(x)}{f(x)}\,dx = \ln|f(x)| + c" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "std-int-ex1",
            question: <p>Find <InlineMath math="\displaystyle\int \frac{2x}{x^2 + 1}\,dx" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The numerator is the derivative of the denominator, so this is the <InlineMath math="\frac{f'}{f}" /> pattern:</p>
                <BlockMath math="\frac{d}{dx}(x^2 + 1) = 2x" />
                <p><strong>Step 2:</strong> Therefore:</p>
                <BlockMath math="\int \frac{2x}{x^2 + 1}\,dx = \ln|x^2 + 1| + c" />
              </div>
            )
          },
          {
            id: "std-int-ex2",
            question: <p>Find <InlineMath math="\displaystyle\int 2x(x^2 + 1)^5\,dx" /> using the substitution <InlineMath math="u = x^2 + 1" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> With <InlineMath math="u = x^2 + 1" />, we have <InlineMath math="\frac{du}{dx} = 2x" />, so <InlineMath math="du = 2x\,dx" />.</p>
                <p><strong>Step 2:</strong> Rewrite the integral in <InlineMath math="u" /> and integrate:</p>
                <BlockMath math="\int u^5\,du = \frac{u^6}{6} + c" />
                <p><strong>Step 3:</strong> Substitute back:</p>
                <BlockMath math="= \frac{(x^2 + 1)^6}{6} + c" />
              </div>
            )
          },
          {
            id: "std-int-ex3",
            question: <p>Find <InlineMath math="\displaystyle\int \frac{1}{9 + x^2}\,dx" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> This matches the standard form <InlineMath math="\int \frac{1}{a^2 + x^2}\,dx = \frac{1}{a}\tan^{-1}\!\frac{x}{a} + c" /> with <InlineMath math="a = 3" />.</p>
                <p><strong>Step 2:</strong> Therefore:</p>
                <BlockMath math="\int \frac{1}{9 + x^2}\,dx = \frac{1}{3}\tan^{-1}\!\left(\frac{x}{3}\right) + c" />
              </div>
            )
          }
        ]
      },
      {
        id: "integrating-rational-functions",
        title: "2. Integrating Rational Functions",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>To integrate a rational function, first express it in <strong>partial fractions</strong> (dividing first if it is improper), then integrate each simpler piece. Linear factors give logarithms; some quadratic denominators give an inverse tangent.</p>
            <p><strong>The Golden Rule:</strong> decompose into partial fractions before integrating — a term <InlineMath math="\frac{A}{x-a}" /> integrates to <InlineMath math="A\ln|x-a|" />.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Improper fractions:</strong> divide first — you cannot decompose an improper fraction directly.</li>
                <li><strong>Modulus in logs:</strong> the answer is <InlineMath math="\ln|x-a|" />, with the absolute value.</li>
                <li><strong>Constant of integration:</strong> don't lose the <InlineMath math="+c" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "rational-int-ex1",
            question: <p>Find <InlineMath math="\displaystyle\int \frac{5x - 1}{(x+1)(x-2)}\,dx" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> In partial fractions (as found earlier), the integrand is:</p>
                <BlockMath math="\frac{5x-1}{(x+1)(x-2)} = \frac{2}{x+1} + \frac{3}{x-2}" />
                <p><strong>Step 2:</strong> Integrate term by term:</p>
                <BlockMath math="\int \frac{2}{x+1} + \frac{3}{x-2}\,dx = 2\ln|x+1| + 3\ln|x-2| + c" />
              </div>
            )
          },
          {
            id: "rational-int-ex2",
            question: <p>Find <InlineMath math="\displaystyle\int \frac{1}{x^2 - 1}\,dx" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Factorise and decompose <InlineMath math="\frac{1}{(x-1)(x+1)}" />:</p>
                <BlockMath math="\frac{1}{x^2 - 1} = \frac{1}{2}\!\left(\frac{1}{x-1}\right) - \frac{1}{2}\!\left(\frac{1}{x+1}\right)" />
                <p><strong>Step 2:</strong> Integrate each term:</p>
                <BlockMath math="= \frac{1}{2}\ln|x-1| - \frac{1}{2}\ln|x+1| + c = \frac{1}{2}\ln\left|\frac{x-1}{x+1}\right| + c" />
              </div>
            )
          }
        ]
      },
      {
        id: "integration-by-parts",
        title: "3. Integration by Parts",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p><strong>Integration by parts</strong> reverses the product rule:</p>
            <BlockMath math="\int u\,\frac{dv}{dx}\,dx = uv - \int v\,\frac{du}{dx}\,dx" />
            <p>Choose <InlineMath math="u" /> to be the factor that becomes simpler when differentiated. A useful guide is <strong>LIATE</strong> (Logarithm, Inverse trig, Algebraic, Trig, Exponential): the factor earliest in this list is usually <InlineMath math="u" />. Some integrals need parts applied more than once.</p>
            <p><strong>The Golden Rule:</strong> pick <InlineMath math="u" /> so that <InlineMath math="\frac{du}{dx}" /> is simpler, and <InlineMath math="\frac{dv}{dx}" /> as the part you can integrate; then apply <InlineMath math="uv - \int v\,\frac{du}{dx}\,dx" />.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Wrong choice of <InlineMath math="u" />:</strong> if the new integral is harder, you likely chose <InlineMath math="u" /> and <InlineMath math="dv" /> the wrong way round.</li>
                <li><strong>Sign error:</strong> the formula subtracts the second integral.</li>
                <li><strong>The <InlineMath math="\ln x" /> trick:</strong> for <InlineMath math="\int \ln x\,dx" />, take <InlineMath math="u = \ln x" /> and <InlineMath math="\frac{dv}{dx} = 1" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "parts-ex1",
            question: <p>Find <InlineMath math="\displaystyle\int x e^x\,dx" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Let <InlineMath math="u = x" /> (so <InlineMath math="\frac{du}{dx} = 1" />) and <InlineMath math="\frac{dv}{dx} = e^x" /> (so <InlineMath math="v = e^x" />).</p>
                <p><strong>Step 2:</strong> Apply the formula:</p>
                <BlockMath math="\int x e^x\,dx = x e^x - \int e^x\,dx = x e^x - e^x + c" />
                <p><strong>Step 3:</strong> Factor: <InlineMath math="= e^x(x - 1) + c" />.</p>
              </div>
            )
          },
          {
            id: "parts-ex2",
            question: <p>Find <InlineMath math="\displaystyle\int x \cos x\,dx" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Let <InlineMath math="u = x" /> and <InlineMath math="\frac{dv}{dx} = \cos x" /> (so <InlineMath math="v = \sin x" />).</p>
                <p><strong>Step 2:</strong> Apply the formula:</p>
                <BlockMath math="\int x \cos x\,dx = x \sin x - \int \sin x\,dx = x \sin x + \cos x + c" />
              </div>
            )
          },
          {
            id: "parts-ex3",
            question: <p>Find <InlineMath math="\displaystyle\int \ln x\,dx" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Take <InlineMath math="u = \ln x" /> (so <InlineMath math="\frac{du}{dx} = \frac{1}{x}" />) and <InlineMath math="\frac{dv}{dx} = 1" /> (so <InlineMath math="v = x" />).</p>
                <p><strong>Step 2:</strong> Apply the formula:</p>
                <BlockMath math="\int \ln x\,dx = x\ln x - \int x \cdot \frac{1}{x}\,dx = x\ln x - \int 1\,dx" />
                <p><strong>Step 3:</strong> So <InlineMath math="\int \ln x\,dx = x\ln x - x + c" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "volumes-of-revolution",
        title: "4. Volumes of Revolution",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>Rotating a curve about an axis sweeps out a solid whose volume is found by integrating the area of circular cross-sections. About the <InlineMath math="x" />-axis, between <InlineMath math="x = a" /> and <InlineMath math="x = b" />:</p>
            <BlockMath math="V = \pi \int_a^b y^2\,dx" />
            <p>About the <InlineMath math="y" />-axis, between <InlineMath math="y = c" /> and <InlineMath math="y = d" />: <InlineMath math="V = \pi \int_c^d x^2\,dy" />.</p>
            <p><strong>The Golden Rule:</strong> square the radius (the function), integrate, and multiply by <InlineMath math="\pi" />; rotating about the <InlineMath math="x" />-axis uses <InlineMath math="\int y^2\,dx" />, about the <InlineMath math="y" />-axis uses <InlineMath math="\int x^2\,dy" />.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Forgetting to square:</strong> the integrand is <InlineMath math="y^2" /> (or <InlineMath math="x^2" />), not <InlineMath math="y" />.</li>
                <li><strong>Wrong variable:</strong> rotation about the <InlineMath math="y" />-axis integrates with respect to <InlineMath math="y" />.</li>
                <li><strong>Losing the <InlineMath math="\pi" />:</strong> the whole result is multiplied by <InlineMath math="\pi" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "volume-ex1",
            question: <p>The curve <InlineMath math="y = \sqrt{x}" /> is rotated about the <InlineMath math="x" />-axis between <InlineMath math="x = 0" /> and <InlineMath math="x = 4" />. Find the volume generated.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Apply the formula with <InlineMath math="y^2 = (\sqrt{x})^2 = x" />:</p>
                <BlockMath math="V = \pi \int_0^4 x\,dx" />
                <p><strong>Step 2:</strong> Integrate and evaluate:</p>
                <BlockMath math="= \pi\left[\frac{x^2}{2}\right]_0^4 = \pi\left(\frac{16}{2}\right) = 8\pi" />
              </div>
            )
          },
          {
            id: "volume-ex2",
            question: <p>The curve <InlineMath math="y = x^2" /> is rotated about the <InlineMath math="y" />-axis between <InlineMath math="y = 0" /> and <InlineMath math="y = 9" />. Find the volume generated.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Rotating about the <InlineMath math="y" />-axis uses <InlineMath math="\int x^2\,dy" />. Here <InlineMath math="y = x^2" />, so <InlineMath math="x^2 = y" />:</p>
                <BlockMath math="V = \pi \int_0^9 y\,dy" />
                <p><strong>Step 2:</strong> Integrate and evaluate:</p>
                <BlockMath math="= \pi\left[\frac{y^2}{2}\right]_0^9 = \pi\left(\frac{81}{2}\right) = \frac{81\pi}{2}" />
              </div>
            )
          }
        ]
      },
      {
        id: "areas-under-between-curves",
        title: "5. Areas Under & Between Curves",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>The area under <InlineMath math="y = f(x)" /> (above the <InlineMath math="x" />-axis) from <InlineMath math="a" /> to <InlineMath math="b" /> is <InlineMath math="\int_a^b y\,dx" />. The area <strong>between</strong> two curves, with <InlineMath math="f" /> the upper and <InlineMath math="g" /> the lower, is:</p>
            <BlockMath math="\text{Area} = \int_a^b \bigl(f(x) - g(x)\bigr)\,dx" />
            <p>where <InlineMath math="a" /> and <InlineMath math="b" /> are the points of intersection.</p>
            <p><strong>The Golden Rule:</strong> for the area between curves, find the intersection points first (they are the limits), then integrate &ldquo;upper minus lower&rdquo;.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Wrong way round:</strong> it is upper curve minus lower curve — check which is on top over the interval.</li>
                <li><strong>Limits:</strong> the intersection points give the limits of integration — solve <InlineMath math="f(x) = g(x)" /> first.</li>
                <li><strong>Areas below the axis:</strong> a region below the <InlineMath math="x" />-axis gives a negative integral, so account for the sign.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "area-ex1",
            question: <p>Find the area enclosed between the curve <InlineMath math="y = x^2" /> and the line <InlineMath math="y = 2x" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Find the intersection points by solving <InlineMath math="x^2 = 2x" />:</p>
                <BlockMath math="x^2 - 2x = 0 \implies x(x-2) = 0 \implies x = 0,\ 2" />
                <p><strong>Step 2:</strong> Between these, the line <InlineMath math="y = 2x" /> is above <InlineMath math="y = x^2" />, so integrate upper minus lower:</p>
                <BlockMath math="\text{Area} = \int_0^2 (2x - x^2)\,dx = \left[x^2 - \frac{x^3}{3}\right]_0^2" />
                <p><strong>Step 3:</strong> Evaluate:</p>
                <BlockMath math="= 4 - \frac{8}{3} = \frac{4}{3}" />
              </div>
            )
          },
          {
            id: "area-ex2",
            question: <p>Find the area under the curve <InlineMath math="y = 3x^2" /> between <InlineMath math="x = 1" /> and <InlineMath math="x = 2" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Integrate the function between the given limits:</p>
                <BlockMath math="\text{Area} = \int_1^2 3x^2\,dx = \left[x^3\right]_1^2" />
                <p><strong>Step 2:</strong> Evaluate:</p>
                <BlockMath math="= 8 - 1 = 7" />
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "differential-equations",
    title: "Differential Equations",
    topics: [
      {
        id: "first-order-separable",
        title: "1. First-Order Separable",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>A first-order differential equation is <strong>separable</strong> if it can be written as <InlineMath math="\frac{dy}{dx} = f(x)g(y)" />. Separate the variables so that all the <InlineMath math="y" /> terms (with <InlineMath math="dy" />) are on one side and all the <InlineMath math="x" /> terms (with <InlineMath math="dx" />) on the other, then integrate both sides.</p>
            <BlockMath math="\int \frac{1}{g(y)}\,dy = \int f(x)\,dx" />
            <p>The <strong>general solution</strong> contains an arbitrary constant; a <strong>particular solution</strong> uses an initial condition to fix it.</p>
            <p><strong>The Golden Rule:</strong> separate first, integrate both sides, and include just <em>one</em> constant of integration — then apply any initial condition.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Two constants:</strong> only one constant of integration is needed — combine them into one.</li>
                <li><strong>Forgetting the condition:</strong> use the given initial condition to find the constant for a particular solution.</li>
                <li><strong>Separation slips:</strong> make sure every <InlineMath math="y" /> moves with <InlineMath math="dy" /> and every <InlineMath math="x" /> with <InlineMath math="dx" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "separable-ex1",
            question: <p>Find the general solution of <InlineMath math="\dfrac{dy}{dx} = xy" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Separate the variables:</p>
                <BlockMath math="\frac{1}{y}\,dy = x\,dx" />
                <p><strong>Step 2:</strong> Integrate both sides:</p>
                <BlockMath math="\ln|y| = \frac{x^2}{2} + c" />
                <p><strong>Step 3:</strong> Exponentiate to make <InlineMath math="y" /> the subject:</p>
                <BlockMath math="y = A e^{x^2/2} \quad (A = e^c)" />
              </div>
            )
          },
          {
            id: "separable-ex2",
            question: <p>Solve <InlineMath math="\dfrac{dy}{dx} = 2xy^2" /> given that <InlineMath math="y = 1" /> when <InlineMath math="x = 0" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Separate and integrate:</p>
                <BlockMath math="\int \frac{1}{y^2}\,dy = \int 2x\,dx \implies -\frac{1}{y} = x^2 + c" />
                <p><strong>Step 2:</strong> Apply the condition <InlineMath math="y=1" /> at <InlineMath math="x=0" />:</p>
                <BlockMath math="-\frac{1}{1} = 0 + c \implies c = -1" />
                <p><strong>Step 3:</strong> Rearrange for <InlineMath math="y" />:</p>
                <BlockMath math="-\frac{1}{y} = x^2 - 1 \implies y = \frac{1}{1 - x^2}" />
              </div>
            )
          }
        ]
      },
      {
        id: "first-order-linear",
        title: "2. First-Order Linear",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>A <strong>first-order linear</strong> equation has the standard form <InlineMath math="\frac{dy}{dx} + P(x)\,y = Q(x)" />. Multiply through by the <strong>integrating factor</strong>:</p>
            <BlockMath math="I = e^{\int P\,dx}" />
            <p>The left side then becomes an exact derivative, <InlineMath math="\frac{d}{dx}(Iy)" />, so integrating gives <InlineMath math="Iy = \int IQ\,dx" />.</p>
            <p><strong>The Golden Rule:</strong> put the equation in standard form (coefficient of <InlineMath math="\frac{dy}{dx}" /> equal to 1) before reading off <InlineMath math="P" />, then multiply by <InlineMath math="e^{\int P\,dx}" /> and recognise the left side as <InlineMath math="\frac{d}{dx}(Iy)" />.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Not in standard form:</strong> divide through so the <InlineMath math="\frac{dy}{dx}" /> coefficient is 1 before identifying <InlineMath math="P" />.</li>
                <li><strong>Integrating factor:</strong> use <InlineMath math="e^{\int P\,dx}" /> with no separate constant.</li>
                <li><strong>The left side:</strong> after multiplying, it collapses to <InlineMath math="\frac{d}{dx}(Iy)" /> — use that directly.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "linear-ex1",
            question: <p>Solve <InlineMath math="\dfrac{dy}{dx} + \dfrac{1}{x}y = 3x" /> for <InlineMath math="x > 0" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Here <InlineMath math="P = \frac{1}{x}" />, so the integrating factor is:</p>
                <BlockMath math="I = e^{\int \frac{1}{x}\,dx} = e^{\ln x} = x" />
                <p><strong>Step 2:</strong> Multiply through; the left side becomes <InlineMath math="\frac{d}{dx}(xy)" />:</p>
                <BlockMath math="\frac{d}{dx}(xy) = 3x^2" />
                <p><strong>Step 3:</strong> Integrate and solve for <InlineMath math="y" />:</p>
                <BlockMath math="xy = x^3 + c \implies y = x^2 + \frac{c}{x}" />
              </div>
            )
          },
          {
            id: "linear-ex2",
            question: <p>Solve <InlineMath math="\dfrac{dy}{dx} - y = e^{2x}" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Here <InlineMath math="P = -1" />, so the integrating factor is <InlineMath math="I = e^{\int -1\,dx} = e^{-x}" />.</p>
                <p><strong>Step 2:</strong> Multiply through; the left side becomes <InlineMath math="\frac{d}{dx}(e^{-x}y)" />:</p>
                <BlockMath math="\frac{d}{dx}\bigl(e^{-x}y\bigr) = e^{-x}e^{2x} = e^{x}" />
                <p><strong>Step 3:</strong> Integrate and solve:</p>
                <BlockMath math="e^{-x}y = e^{x} + c \implies y = e^{2x} + ce^{x}" />
              </div>
            )
          }
        ]
      },
      {
        id: "second-order-homogeneous",
        title: "3. Second-Order Homogeneous",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>A <strong>second-order homogeneous</strong> equation <InlineMath math="a\,y'' + b\,y' + c\,y = 0" /> is solved via its <strong>auxiliary equation</strong> <InlineMath math="am^2 + bm + c = 0" />. The nature of the roots gives the general solution:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Real distinct roots <InlineMath math="m_1, m_2" />: <InlineMath math="y = Ae^{m_1 x} + Be^{m_2 x}" /></li>
              <li>Real repeated root <InlineMath math="m" />: <InlineMath math="y = (A + Bx)e^{mx}" /></li>
              <li>Complex roots <InlineMath math="p \pm qi" />: <InlineMath math="y = e^{px}(A\cos qx + B\sin qx)" /></li>
            </ul>
            <p><strong>The Golden Rule:</strong> solve the auxiliary equation first — the type of roots (distinct real, repeated, or complex) determines which of the three solution forms to use.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Repeated root:</strong> you need the <InlineMath math="(A + Bx)" /> form, not just <InlineMath math="Ae^{mx}" />.</li>
                <li><strong>Complex roots:</strong> use the <InlineMath math="e^{px}(A\cos qx + B\sin qx)" /> form.</li>
                <li><strong>Two constants:</strong> a second-order equation always has two arbitrary constants.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "homogeneous-ex1",
            question: <p>Find the general solution of <InlineMath math="y'' - 5y' + 6y = 0" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Form and solve the auxiliary equation:</p>
                <BlockMath math="m^2 - 5m + 6 = 0 \implies (m-2)(m-3) = 0 \implies m = 2,\ 3" />
                <p><strong>Step 2:</strong> Real distinct roots, so:</p>
                <BlockMath math="y = Ae^{2x} + Be^{3x}" />
              </div>
            )
          },
          {
            id: "homogeneous-ex2",
            question: <p>Find the general solution of <InlineMath math="y'' - 4y' + 4y = 0" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The auxiliary equation has a repeated root:</p>
                <BlockMath math="m^2 - 4m + 4 = (m-2)^2 = 0 \implies m = 2 \ (\text{repeated})" />
                <p><strong>Step 2:</strong> Use the repeated-root form:</p>
                <BlockMath math="y = (A + Bx)e^{2x}" />
              </div>
            )
          },
          {
            id: "homogeneous-ex3",
            question: <p>Find the general solution of <InlineMath math="y'' + 4y = 0" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The auxiliary equation gives complex roots:</p>
                <BlockMath math="m^2 + 4 = 0 \implies m = \pm 2i \quad (p = 0,\ q = 2)" />
                <p><strong>Step 2:</strong> Use the complex-root form (here <InlineMath math="e^{0x} = 1" />):</p>
                <BlockMath math="y = A\cos 2x + B\sin 2x" />
              </div>
            )
          }
        ]
      },
      {
        id: "second-order-non-homogeneous",
        title: "4. Second-Order Non-Homogeneous",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>For <InlineMath math="a\,y'' + b\,y' + c\,y = f(x)" />, the general solution is the <strong>complementary function</strong> (CF) — the solution of the homogeneous equation — plus a <strong>particular integral</strong> (PI), a trial function shaped like <InlineMath math="f(x)" />:</p>
            <BlockMath math="y = \text{CF} + \text{PI}" />
            <p>Trial forms: a constant or polynomial for a polynomial <InlineMath math="f(x)" />, <InlineMath math="Ce^{kx}" /> for an exponential, and <InlineMath math="C\cos + D\sin" /> for a trig term. If the trial clashes with the CF, multiply it by <InlineMath math="x" />.</p>
            <p><strong>The Golden Rule:</strong> find the CF from the auxiliary equation, find a PI by substituting a suitable trial function, add them — and apply any conditions to the <em>full</em> solution, not just the CF.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Missing a part:</strong> the general solution is CF <em>plus</em> PI — both are required.</li>
                <li><strong>Wrong trial:</strong> match the PI trial to the form of <InlineMath math="f(x)" />.</li>
                <li><strong>Conditions applied too early:</strong> fix the constants using the full CF + PI, not the CF alone.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "non-homogeneous-ex1",
            question: <p>Find the general solution of <InlineMath math="y'' - 5y' + 6y = 12" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The complementary function comes from <InlineMath math="m^2 - 5m + 6 = 0" />, giving <InlineMath math="m = 2, 3" />:</p>
                <BlockMath math="\text{CF} = Ae^{2x} + Be^{3x}" />
                <p><strong>Step 2:</strong> The right side is a constant, so try <InlineMath math="y = C" /> (then <InlineMath math="y' = y'' = 0" />):</p>
                <BlockMath math="6C = 12 \implies C = 2 \quad\Rightarrow\quad \text{PI} = 2" />
                <p><strong>Step 3:</strong> The general solution is CF + PI:</p>
                <BlockMath math="y = Ae^{2x} + Be^{3x} + 2" />
              </div>
            )
          },
          {
            id: "non-homogeneous-ex2",
            question: <p>Find the general solution of <InlineMath math="y'' - 3y' + 2y = e^{3x}" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The auxiliary equation <InlineMath math="m^2 - 3m + 2 = 0" /> gives <InlineMath math="m = 1, 2" />:</p>
                <BlockMath math="\text{CF} = Ae^{x} + Be^{2x}" />
                <p><strong>Step 2:</strong> Try <InlineMath math="y = Ce^{3x}" />, so <InlineMath math="y' = 3Ce^{3x}" /> and <InlineMath math="y'' = 9Ce^{3x}" />. Substitute:</p>
                <BlockMath math="(9C - 9C + 2C)e^{3x} = e^{3x} \implies 2C = 1 \implies C = \tfrac{1}{2}" />
                <p><strong>Step 3:</strong> The general solution is:</p>
                <BlockMath math="y = Ae^{x} + Be^{2x} + \tfrac{1}{2}e^{3x}" />
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "vectors",
    title: "Vectors",
    topics: [
      {
        id: "vector-scalar-triple-product",
        title: "1. Vector & Scalar Triple Product",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>The <strong>scalar (dot) product</strong> gives the angle between two vectors:</p>
            <BlockMath math="\mathbf{a} \cdot \mathbf{b} = |\mathbf{a}||\mathbf{b}|\cos\theta \implies \cos\theta = \frac{\mathbf{a}\cdot\mathbf{b}}{|\mathbf{a}||\mathbf{b}|}" />
            <p>The <strong>vector (cross) product</strong> <InlineMath math="\mathbf{a} \times \mathbf{b}" /> is a vector perpendicular to both, computed as a determinant. The <strong>scalar triple product</strong> <InlineMath math="\mathbf{a}\cdot(\mathbf{b}\times\mathbf{c})" /> gives the volume of the parallelepiped and is zero when the vectors are coplanar.</p>
            <p><strong>The Golden Rule:</strong> use the scalar product for angles, the vector product when you need a perpendicular direction, and the scalar triple product to test coplanarity — a zero value means coplanar.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Scalar vs vector:</strong> the dot product is a number, the cross product is a vector.</li>
                <li><strong>Order of the cross product:</strong> <InlineMath math="\mathbf{a}\times\mathbf{b} = -(\mathbf{b}\times\mathbf{a})" /> — the order matters.</li>
                <li><strong>Angle formula:</strong> the angle between vectors uses the <em>scalar</em> product.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "vector-products-ex1",
            question: <p>Find the angle between <InlineMath math="\mathbf{a} = (1, 0, 1)" /> and <InlineMath math="\mathbf{b} = (1, 1, 0)" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Compute the scalar product and the two magnitudes:</p>
                <BlockMath math="\mathbf{a}\cdot\mathbf{b} = 1 + 0 + 0 = 1, \qquad |\mathbf{a}| = \sqrt{2}, \quad |\mathbf{b}| = \sqrt{2}" />
                <p><strong>Step 2:</strong> Apply the angle formula:</p>
                <BlockMath math="\cos\theta = \frac{1}{\sqrt{2}\,\sqrt{2}} = \frac{1}{2} \implies \theta = 60^\circ" />
              </div>
            )
          },
          {
            id: "vector-products-ex2",
            question: <p>Find <InlineMath math="\mathbf{a} \times \mathbf{b}" /> for <InlineMath math="\mathbf{a} = (1, 2, 3)" /> and <InlineMath math="\mathbf{b} = (2, 1, 0)" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write the cross product as a determinant:</p>
                <BlockMath math="\mathbf{a} \times \mathbf{b} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1 & 2 & 3 \\ 2 & 1 & 0 \end{vmatrix}" />
                <p><strong>Step 2:</strong> Expand along the top row:</p>
                <BlockMath math="= \mathbf{i}(2\cdot 0 - 3\cdot 1) - \mathbf{j}(1\cdot 0 - 3\cdot 2) + \mathbf{k}(1\cdot 1 - 2\cdot 2)" />
                <p><strong>Step 3:</strong> Simplify:</p>
                <BlockMath math="= (-3,\ 6,\ -3)" />
              </div>
            )
          },
          {
            id: "vector-products-ex3",
            question: <p>Determine whether <InlineMath math="\mathbf{a} = (1,0,1)" />, <InlineMath math="\mathbf{b} = (1,1,0)" /> and <InlineMath math="\mathbf{c} = (2,1,1)" /> are coplanar.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> First find <InlineMath math="\mathbf{b}\times\mathbf{c}" />:</p>
                <BlockMath math="\mathbf{b}\times\mathbf{c} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1 & 1 & 0 \\ 2 & 1 & 1 \end{vmatrix} = (1,\ -1,\ -1)" />
                <p><strong>Step 2:</strong> Compute the scalar triple product <InlineMath math="\mathbf{a}\cdot(\mathbf{b}\times\mathbf{c})" />:</p>
                <BlockMath math="(1,0,1)\cdot(1,-1,-1) = 1 + 0 - 1 = 0" />
                <p><strong>Step 3:</strong> The scalar triple product is <InlineMath math="0" />, so the three vectors are <strong>coplanar</strong>.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "equations-of-lines",
        title: "2. Equations of Lines",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>A line in three dimensions needs a point <InlineMath math="\mathbf{a}" /> on it and a direction vector <InlineMath math="\mathbf{d}" />. It can be written in three equivalent ways:</p>
            <BlockMath math="\text{Vector: } \mathbf{r} = \mathbf{a} + t\mathbf{d} \qquad \text{Symmetric: } \frac{x - a_1}{d_1} = \frac{y - a_2}{d_2} = \frac{z - a_3}{d_3}" />
            <p>The angle between two lines is the angle between their direction vectors.</p>
            <p><strong>The Golden Rule:</strong> a line is a point plus a direction. Given two points, subtract to get the direction, then convert freely between vector, parametric and symmetric forms.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Direction from two points:</strong> subtract the position vectors to get <InlineMath math="\mathbf{d}" />.</li>
                <li><strong>Symmetric denominators:</strong> these are the components of the direction vector.</li>
                <li><strong>Angle between lines:</strong> use the direction vectors, not the points.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "lines-ex1",
            question: <p>Find the vector and symmetric equations of the line through <InlineMath math="A(1, 2, 3)" /> and <InlineMath math="B(4, 0, 5)" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The direction vector is <InlineMath math="\mathbf{d} = B - A" />:</p>
                <BlockMath math="\mathbf{d} = (4-1,\ 0-2,\ 5-3) = (3,\ -2,\ 2)" />
                <p><strong>Step 2:</strong> Vector equation, using point <InlineMath math="A" />:</p>
                <BlockMath math="\mathbf{r} = (1, 2, 3) + t(3, -2, 2)" />
                <p><strong>Step 3:</strong> Symmetric form:</p>
                <BlockMath math="\frac{x-1}{3} = \frac{y-2}{-2} = \frac{z-3}{2}" />
              </div>
            )
          },
          {
            id: "lines-ex2",
            question: <p>Find the acute angle between the lines with direction vectors <InlineMath math="\mathbf{d}_1 = (1, 0, 1)" /> and <InlineMath math="\mathbf{d}_2 = (1, 1, 0)" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Use the scalar product of the direction vectors:</p>
                <BlockMath math="\mathbf{d}_1\cdot\mathbf{d}_2 = 1, \qquad |\mathbf{d}_1| = |\mathbf{d}_2| = \sqrt{2}" />
                <p><strong>Step 2:</strong> Apply the angle formula:</p>
                <BlockMath math="\cos\theta = \frac{1}{\sqrt{2}\,\sqrt{2}} = \frac{1}{2} \implies \theta = 60^\circ" />
              </div>
            )
          }
        ]
      },
      {
        id: "equations-of-planes",
        title: "3. Equations of Planes",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>A plane is fixed by a <strong>normal vector</strong> <InlineMath math="\mathbf{n} = (a, b, c)" /> and a point on it. Its Cartesian equation is:</p>
            <BlockMath math="ax + by + cz = d" />
            <p>where <InlineMath math="d" /> is found by substituting a known point. If the plane is given by three points, find the normal by taking the cross product of two direction vectors lying in the plane.</p>
            <p><strong>The Golden Rule:</strong> the coefficients <InlineMath math="(a, b, c)" /> in <InlineMath math="ax + by + cz = d" /> <em>are</em> the normal vector; find <InlineMath math="d" /> by substituting a point on the plane.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Normal from coefficients:</strong> read the normal directly from the Cartesian equation's coefficients.</li>
                <li><strong>Three points:</strong> use a cross product of two in-plane vectors to get the normal.</li>
                <li><strong>Finding <InlineMath math="d" />:</strong> substitute any known point into <InlineMath math="ax + by + cz" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "planes-ex1",
            question: <p>Find the Cartesian equation of the plane with normal <InlineMath math="\mathbf{n} = (2, -1, 3)" /> passing through the point <InlineMath math="(1, 0, 4)" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The equation is <InlineMath math="2x - y + 3z = d" />. Substitute the point to find <InlineMath math="d" />:</p>
                <BlockMath math="2(1) - (0) + 3(4) = 2 + 12 = 14" />
                <p><strong>Step 2:</strong> So the plane is:</p>
                <BlockMath math="2x - y + 3z = 14" />
              </div>
            )
          },
          {
            id: "planes-ex2",
            question: <p>Find the equation of the plane through the points <InlineMath math="A(1, 0, 0)" />, <InlineMath math="B(0, 1, 0)" /> and <InlineMath math="C(0, 0, 1)" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Two direction vectors in the plane are <InlineMath math="\overrightarrow{AB} = (-1, 1, 0)" /> and <InlineMath math="\overrightarrow{AC} = (-1, 0, 1)" />. The normal is their cross product:</p>
                <BlockMath math="\mathbf{n} = \overrightarrow{AB}\times\overrightarrow{AC} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ -1 & 1 & 0 \\ -1 & 0 & 1 \end{vmatrix} = (1,\ 1,\ 1)" />
                <p><strong>Step 2:</strong> Using normal <InlineMath math="(1,1,1)" /> and point <InlineMath math="A(1,0,0)" />, the equation <InlineMath math="x + y + z = d" /> gives <InlineMath math="d = 1" />:</p>
                <BlockMath math="x + y + z = 1" />
              </div>
            )
          }
        ]
      }
    ]
  }
];
