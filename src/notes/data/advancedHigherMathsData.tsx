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
            question: <p>Evaluate <InlineMath math="\binom{9}{4}" /> and <InlineMath math="\binom{12}{8}" />, and state which other coefficient equals <InlineMath math="\binom{12}{8}" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Apply the definition to <InlineMath math="\binom{9}{4}" />:</p>
                <BlockMath math="\binom{9}{4} = \frac{9!}{4!\,5!} = \frac{362880}{24 \times 120} = \frac{362880}{2880} = 126" />
                <p><strong>Step 2:</strong> For <InlineMath math="\binom{12}{8}" />, cancelling <InlineMath math="8!" /> first keeps the numbers manageable:</p>
                <BlockMath math="\binom{12}{8} = \frac{12!}{8!\,4!} = \frac{12 \times 11 \times 10 \times 9}{4 \times 3 \times 2 \times 1} = \frac{11880}{24} = 495" />
                <p><strong>Step 3:</strong> By the symmetry property, <InlineMath math="\binom{12}{8} = \binom{12}{12-8} = \binom{12}{4}" />, which is also <InlineMath math="495" /> — and, as Step 2 shows, is the quicker one to compute.</p>
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
            question: <p>Find the value of <InlineMath math="n" /> for which <InlineMath math="\binom{n}{2} = 78" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Expand the coefficient using the definition, cancelling <InlineMath math="(n-2)!" />:</p>
                <BlockMath math="\binom{n}{2} = \frac{n!}{2!\,(n-2)!} = \frac{n(n-1)}{2}" />
                <p><strong>Step 2:</strong> Set this equal to <InlineMath math="78" /> and rearrange into a quadratic:</p>
                <BlockMath math="\frac{n(n-1)}{2} = 78 \implies n^2 - n - 156 = 0" />
                <p><strong>Step 3:</strong> Factorise and solve:</p>
                <BlockMath math="(n-13)(n+12) = 0 \implies n = 13 \ \text{ or } \ n = -12" />
                <p><strong>Step 4:</strong> Since <InlineMath math="n" /> must be a positive whole number, <InlineMath math="n = -12" /> is rejected. Therefore <InlineMath math="n = 13" />, which checks out: <InlineMath math="\frac{13 \times 12}{2} = 78" />.</p>
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
            question: <p>Find the fourth term in the expansion of <InlineMath math="(3a - 2b)^6" />, written in descending powers of <InlineMath math="a" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The general term is the <InlineMath math="(r+1)" />th term, so the <strong>fourth</strong> term needs <InlineMath math="r = 3" />:</p>
                <BlockMath math="T_{r+1} = \binom{6}{r}(3a)^{6-r}(-2b)^r \quad\implies\quad T_4 = \binom{6}{3}(3a)^{3}(-2b)^{3}" />
                <p><strong>Step 2:</strong> Evaluate each factor separately, taking care to raise the whole bracket to the power:</p>
                <BlockMath math="\binom{6}{3} = 20, \qquad (3a)^3 = 27a^3, \qquad (-2b)^3 = -8b^3" />
                <p><strong>Step 3:</strong> Multiply the three factors together:</p>
                <BlockMath math="T_4 = 20 \times 27a^3 \times (-8b^3) = -4320\,a^3b^3" />
                <p>The odd power of <InlineMath math="-2b" /> makes this term negative.</p>
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
            question: <p>Use the Binomial Theorem to find the <strong>exact</strong> value of <InlineMath math="2.2^4" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write the number as a binomial and expand with coefficients <InlineMath math="1, 4, 6, 4, 1" />:</p>
                <BlockMath math="2.2^4 = (2 + 0.2)^4 = 2^4 + 4(2)^3(0.2) + 6(2)^2(0.2)^2 + 4(2)(0.2)^3 + (0.2)^4" />
                <p><strong>Step 2:</strong> Evaluate each term:</p>
                <BlockMath math="\begin{aligned} 2^4 &= 16 \\ 4(8)(0.2) &= 6.4 \\ 6(4)(0.04) &= 0.96 \\ 4(2)(0.008) &= 0.064 \\ (0.2)^4 &= 0.0016 \end{aligned}" />
                <p><strong>Step 3:</strong> Add them. The index is a positive whole number, so the expansion terminates and the total is exact:</p>
                <BlockMath math="2.2^4 = 16 + 6.4 + 0.96 + 0.064 + 0.0016 = 23.4256" />
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
            <p>Two further pieces of notation are needed throughout the topic. The <strong>transpose</strong> <InlineMath math="A^{T}" /> is formed by swapping rows and columns:</p>
            <BlockMath math="A = \begin{pmatrix} 2 & 1 \\ 0 & 3 \end{pmatrix} \implies A^{T} = \begin{pmatrix} 2 & 0 \\ 1 & 3 \end{pmatrix}" />
            <p>It obeys <InlineMath math="(A^{T})^{T} = A" /> and, importantly, <InlineMath math="(AB)^{T} = B^{T}A^{T}" /> — the order <em>reverses</em>. A matrix with <InlineMath math="A^{T} = A" /> is called <strong>symmetric</strong>.</p>
            <p>The <strong>identity matrix</strong> <InlineMath math="I" /> has <InlineMath math="1" />s on the leading diagonal and <InlineMath math="0" />s elsewhere. It behaves like the number <InlineMath math="1" />:</p>
            <BlockMath math="I = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}, \qquad AI = IA = A, \qquad A^{-1}A = AA^{-1} = I" />
            <p>That last statement is the <em>definition</em> of the inverse, and it is what makes the row-reduction method for larger matrices work.</p>
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
          },
          {
            id: "matrix-algebra-ex4",
            question: <p>Given <InlineMath math="A = \begin{pmatrix} 2 & 1 \\ 0 & 3 \end{pmatrix}" /> and <InlineMath math="B = \begin{pmatrix} 1 & 4 \\ -2 & 5 \end{pmatrix}" />, verify that <InlineMath math="(AB)^{T} = B^{T}A^{T}" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Work out <InlineMath math="AB" /> first, combining rows of <InlineMath math="A" /> with columns of <InlineMath math="B" />:</p>
                <BlockMath math="AB = \begin{pmatrix} 2 & 1 \\ 0 & 3 \end{pmatrix}\begin{pmatrix} 1 & 4 \\ -2 & 5 \end{pmatrix} = \begin{pmatrix} 2-2 & 8+5 \\ 0-6 & 0+15 \end{pmatrix} = \begin{pmatrix} 0 & 13 \\ -6 & 15 \end{pmatrix}" />
                <p><strong>Step 2:</strong> Transpose the result by swapping rows and columns:</p>
                <BlockMath math="(AB)^{T} = \begin{pmatrix} 0 & -6 \\ 13 & 15 \end{pmatrix}" />
                <p><strong>Step 3:</strong> Now transpose <InlineMath math="A" /> and <InlineMath math="B" /> separately, and multiply them in the <em>reversed</em> order:</p>
                <BlockMath math="B^{T} = \begin{pmatrix} 1 & -2 \\ 4 & 5 \end{pmatrix}, \qquad A^{T} = \begin{pmatrix} 2 & 0 \\ 1 & 3 \end{pmatrix}" />
                <BlockMath math="B^{T}A^{T} = \begin{pmatrix} 2-2 & 0-6 \\ 8+5 & 0+15 \end{pmatrix} = \begin{pmatrix} 0 & -6 \\ 13 & 15 \end{pmatrix}" />
                <p><strong>Step 4:</strong> The two results agree, confirming <InlineMath math="(AB)^{T} = B^{T}A^{T}" />. Note that <InlineMath math="A^{T}B^{T}" /> would <em>not</em> have worked — the reversal matters.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "three-by-three-inverse",
        title: "2. The 3×3 Inverse",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>For a <InlineMath math="2\times 2" /> matrix there is a formula for the inverse. For a <InlineMath math="3\times 3" /> there is no such shortcut worth memorising, so we use <strong>row reduction</strong> instead — the same elementary row operations used in Gaussian elimination.</p>
            <p>The method rests on the definition <InlineMath math="A^{-1}A = I" />. Write the matrix and the identity side by side in an augmented array, then apply row operations until the <em>left</em> block becomes the identity. Whatever those same operations do to the right block turns it into <InlineMath math="A^{-1}" />:</p>
            <BlockMath math="\left(\begin{array}{ccc|ccc} & A & & & I & \end{array}\right) \quad \longrightarrow \quad \left(\begin{array}{ccc|ccc} & I & & & A^{-1} & \end{array}\right)" />
            <p>The three permitted operations are the familiar ones: <strong>interchange</strong> two rows, <strong>multiply</strong> a row by a non-zero constant, and <strong>add a multiple</strong> of one row to another. Every operation must be applied right across the array, both blocks together.</p>
            <p>If at any stage a row of the left block becomes entirely zero, the matrix is <strong>singular</strong> — its determinant is zero and no inverse exists.</p>
            <p><strong>The Golden Rule:</strong> work down the leading diagonal one column at a time — first make the pivot entry <InlineMath math="1" />, then clear every other entry in that column to <InlineMath math="0" />, and only then move to the next column. Jumping around leads to undoing your own work.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Forgetting the right-hand block:</strong> every row operation must be carried out on <em>both</em> halves. Missing one is the single most common error.</li>
                <li><strong>Clearing above as well as below:</strong> unlike Gaussian elimination, which stops at upper triangular form, here you must keep going until the left block is the full identity — zeros above the diagonal too.</li>
                <li><strong>Not stating the operations:</strong> write each one down (<InlineMath math="R_2 \to R_2 - 2R_1" />). Marks are awarded for the operations, not just the answer.</li>
                <li><strong>Skipping the check:</strong> multiply <InlineMath math="A" /> by your answer. If you do not get <InlineMath math="I" /> exactly, there is an arithmetic slip to find.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "three-inverse-ex1",
            question: <p>Find the inverse of <InlineMath math="A = \begin{pmatrix} 2 & 1 & 1 \\ 1 & 3 & 2 \\ 1 & 0 & 0 \end{pmatrix}" /> using elementary row operations.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write <InlineMath math="A" /> alongside the identity matrix:</p>
                <BlockMath math="\left(\begin{array}{ccc|ccc} 2 & 1 & 1 & 1 & 0 & 0 \\ 1 & 3 & 2 & 0 & 1 & 0 \\ 1 & 0 & 0 & 0 & 0 & 1 \end{array}\right)" />
                <p><strong>Step 2:</strong> Swap rows 1 and 3 to put a convenient <InlineMath math="1" /> in the top-left pivot position (<InlineMath math="R_1 \leftrightarrow R_3" />):</p>
                <BlockMath math="\left(\begin{array}{ccc|ccc} 1 & 0 & 0 & 0 & 0 & 1 \\ 1 & 3 & 2 & 0 & 1 & 0 \\ 2 & 1 & 1 & 1 & 0 & 0 \end{array}\right)" />
                <p><strong>Step 3:</strong> Clear the rest of column 1, using <InlineMath math="R_2 \to R_2 - R_1" /> and <InlineMath math="R_3 \to R_3 - 2R_1" />:</p>
                <BlockMath math="\left(\begin{array}{ccc|ccc} 1 & 0 & 0 & 0 & 0 & 1 \\ 0 & 3 & 2 & 0 & 1 & -1 \\ 0 & 1 & 1 & 1 & 0 & -2 \end{array}\right)" />
                <p><strong>Step 4:</strong> Swap rows 2 and 3 so the next pivot is already <InlineMath math="1" /> (<InlineMath math="R_2 \leftrightarrow R_3" />), then use <InlineMath math="R_3 \to R_3 - 3R_2" />:</p>
                <BlockMath math="\left(\begin{array}{ccc|ccc} 1 & 0 & 0 & 0 & 0 & 1 \\ 0 & 1 & 1 & 1 & 0 & -2 \\ 0 & 0 & -1 & -3 & 1 & 5 \end{array}\right)" />
                <p><strong>Step 5:</strong> Make the last pivot <InlineMath math="1" /> with <InlineMath math="R_3 \to -R_3" />, then clear above it with <InlineMath math="R_2 \to R_2 - R_3" />:</p>
                <BlockMath math="\left(\begin{array}{ccc|ccc} 1 & 0 & 0 & 0 & 0 & 1 \\ 0 & 1 & 0 & -2 & 1 & 3 \\ 0 & 0 & 1 & 3 & -1 & -5 \end{array}\right)" />
                <p><strong>Step 6:</strong> The left block is now the identity, so the right block is the inverse:</p>
                <BlockMath math="A^{-1} = \begin{pmatrix} 0 & 0 & 1 \\ -2 & 1 & 3 \\ 3 & -1 & -5 \end{pmatrix}" />
                <p><strong>Check:</strong> the first row of <InlineMath math="A" /> times the first column of <InlineMath math="A^{-1}" /> gives <InlineMath math="2(0) + 1(-2) + 1(3) = 1" />, and the same row times the second column gives <InlineMath math="2(0) + 1(1) + 1(-1) = 0" /> — as required for <InlineMath math="AA^{-1} = I" />.</p>
              </div>
            )
          },
          {
            id: "three-inverse-ex2",
            question: <p>Show that <InlineMath math="B = \begin{pmatrix} 1 & 2 & 3 \\ 2 & 4 & 6 \\ 1 & 0 & 5 \end{pmatrix}" /> has no inverse.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Begin the row reduction. Using <InlineMath math="R_2 \to R_2 - 2R_1" />:</p>
                <BlockMath math="\begin{pmatrix} 1 & 2 & 3 \\ 2 & 4 & 6 \\ 1 & 0 & 5 \end{pmatrix} \longrightarrow \begin{pmatrix} 1 & 2 & 3 \\ 0 & 0 & 0 \\ 1 & 0 & 5 \end{pmatrix}" />
                <p><strong>Step 2:</strong> The second row has become entirely zero. This happened because row 2 of <InlineMath math="B" /> was exactly twice row 1 — the rows are not independent.</p>
                <p><strong>Step 3:</strong> A row of zeros in the left block means it can never be reduced to the identity, so <InlineMath math="B" /> is <strong>singular</strong> and has no inverse.</p>
                <p><strong>Confirming with the determinant:</strong> expanding along the first row,</p>
                <BlockMath math="\det B = 1(4 \times 5 - 6 \times 0) - 2(2 \times 5 - 6 \times 1) + 3(2 \times 0 - 4 \times 1)" />
                <BlockMath math="= 1(20) - 2(4) + 3(-4) = 20 - 8 - 12 = 0" />
                <p>A zero determinant confirms the matrix is singular.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "transformations-of-the-plane",
        title: "3. Transformations of the Plane",
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
          },
          {
            id: "gaussian-ex5",
            question: <p>Show that the system below has infinitely many solutions, give the general solution in terms of a parameter <InlineMath math="\lambda" />, and state the particular solution when <InlineMath math="\lambda = 1" />.</p>,
            solution: (
              <div className="space-y-2">
                <p>The system is <InlineMath math="x + 2y - z = 3" />, <InlineMath math="2x - y + 3z = 1" />, <InlineMath math="3x + y + 2z = 4" />.</p>
                <p><strong>Step 1:</strong> Write the augmented matrix:</p>
                <BlockMath math="\left(\begin{array}{ccc|c} 1 & 2 & -1 & 3 \\ 2 & -1 & 3 & 1 \\ 3 & 1 & 2 & 4 \end{array}\right)" />
                <p><strong>Step 2:</strong> Clear the first column with <InlineMath math="R_2 \to R_2 - 2R_1" /> and <InlineMath math="R_3 \to R_3 - 3R_1" />:</p>
                <BlockMath math="\left(\begin{array}{ccc|c} 1 & 2 & -1 & 3 \\ 0 & -5 & 5 & -5 \\ 0 & -5 & 5 & -5 \end{array}\right)" />
                <p><strong>Step 3:</strong> Rows 2 and 3 are now identical, so <InlineMath math="R_3 \to R_3 - R_2" /> produces a row of zeros:</p>
                <BlockMath math="\left(\begin{array}{ccc|c} 1 & 2 & -1 & 3 \\ 0 & -5 & 5 & -5 \\ 0 & 0 & 0 & 0 \end{array}\right)" />
                <p>The line <InlineMath math="0 = 0" /> is always true, so the third equation was <strong>redundant</strong> — it carried no new information. Two equations cannot pin down three unknowns, so there are <strong>infinitely many solutions</strong>.</p>
                <p><strong>Step 4:</strong> Introduce a parameter for the free variable. Let <InlineMath math="z = \lambda" />. From row 2:</p>
                <BlockMath math="-5y + 5\lambda = -5 \implies y - \lambda = 1 \implies y = 1 + \lambda" />
                <p><strong>Step 5:</strong> Back-substitute into row 1:</p>
                <BlockMath math="x + 2(1+\lambda) - \lambda = 3 \implies x + 2 + \lambda = 3 \implies x = 1 - \lambda" />
                <p><strong>Step 6:</strong> The general solution is:</p>
                <BlockMath math="x = 1 - \lambda, \qquad y = 1 + \lambda, \qquad z = \lambda" />
                <p><strong>Step 7:</strong> Setting <InlineMath math="\lambda = 1" /> gives the particular solution <InlineMath math="(0,\ 2,\ 1)" />.</p>
                <p><strong>Check:</strong> in the second equation, <InlineMath math="2(0) - 2 + 3(1) = 1" /> ✓</p>
              </div>
            )
          },
          {
            id: "gaussian-ex6",
            question: <p>A parabola with equation <InlineMath math="y = ax^2 + bx + c" /> passes through the points <InlineMath math="(1, 4)" />, <InlineMath math="(2, 3)" /> and <InlineMath math="(3, 6)" />. Form a system of equations and solve it to find the equation of the parabola.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Substitute each point into <InlineMath math="y = ax^2 + bx + c" />. Each one gives a linear equation in the three unknowns:</p>
                <BlockMath math="\begin{aligned} (1,4): &\quad a + b + c = 4 \\ (2,3): &\quad 4a + 2b + c = 3 \\ (3,6): &\quad 9a + 3b + c = 6 \end{aligned}" />
                <p><strong>Step 2:</strong> Eliminate <InlineMath math="c" /> by subtracting consecutive equations:</p>
                <BlockMath math="\begin{aligned} (2)-(1): &\quad 3a + b = -1 \\ (3)-(2): &\quad 5a + b = 3 \end{aligned}" />
                <p><strong>Step 3:</strong> Subtract these two to find <InlineMath math="a" />:</p>
                <BlockMath math="2a = 4 \implies a = 2" />
                <p><strong>Step 4:</strong> Back-substitute for <InlineMath math="b" />, then <InlineMath math="c" />:</p>
                <BlockMath math="3(2) + b = -1 \implies b = -7, \qquad 2 - 7 + c = 4 \implies c = 9" />
                <p><strong>Step 5:</strong> The parabola is:</p>
                <BlockMath math="y = 2x^2 - 7x + 9" />
                <p><strong>Check:</strong> at <InlineMath math="x=3" />, <InlineMath math="y = 18 - 21 + 9 = 6" /> ✓</p>
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
            <p>The sum formula comes from a neat trick worth knowing, since you may be asked to derive it. Write the series out, then write it again <strong>in reverse</strong> underneath:</p>
            <BlockMath math="\begin{aligned} S_n &= a + (a+d) + \cdots + \bigl(a+(n-1)d\bigr) \\ S_n &= \bigl(a+(n-1)d\bigr) + \cdots + (a+d) + a \end{aligned}" />
            <p>Adding the two lines pairs the first term of one with the last of the other. Every pair sums to the same total, <InlineMath math="2a + (n-1)d" />, and there are <InlineMath math="n" /> pairs:</p>
            <BlockMath math="2S_n = n\bigl[2a + (n-1)d\bigr] \quad\implies\quad S_n = \frac{n}{2}\bigl[2a + (n-1)d\bigr]" />
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
          },
          {
            id: "arithmetic-ex3",
            question: <p>How many terms are there in the arithmetic sequence <InlineMath math="7,\ 11,\ 15,\ \ldots,\ 111" />? Hence find the sum of the sequence.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Identify <InlineMath math="a" /> and <InlineMath math="d" />, then write a formula for the <InlineMath math="n" />th term:</p>
                <BlockMath math="a = 7, \quad d = 11 - 7 = 4 \quad\implies\quad u_n = 7 + (n-1)(4) = 4n + 3" />
                <p><strong>Step 2:</strong> The last term is <InlineMath math="111" />, so set <InlineMath math="u_n = 111" /> and solve for <InlineMath math="n" />:</p>
                <BlockMath math="4n + 3 = 111 \implies 4n = 108 \implies n = 27" />
                <p>There are <strong>27</strong> terms.</p>
                <p><strong>Step 3:</strong> Since the last term is known, the quicker sum formula applies:</p>
                <BlockMath math="S_{27} = \frac{27}{2}(a + l) = \frac{27}{2}(7 + 111) = \frac{27}{2}(118) = 27 \times 59 = 1593" />
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
          },
          {
            id: "geometric-ex4",
            question: <p>A geometric series has first term <InlineMath math="5" /> and common ratio <InlineMath math="1.5" />. Find the least number of terms for which the sum exceeds <InlineMath math="500" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Since <InlineMath math="r > 1" />, use the sum formula in the form that keeps the numbers positive:</p>
                <BlockMath math="S_n = \frac{a(r^n - 1)}{r - 1} = \frac{5(1.5^n - 1)}{0.5} = 10\left(1.5^n - 1\right)" />
                <p><strong>Step 2:</strong> Set up the inequality and simplify:</p>
                <BlockMath math="10\left(1.5^n - 1\right) > 500 \implies 1.5^n - 1 > 50 \implies 1.5^n > 51" />
                <p><strong>Step 3:</strong> The unknown is in the index, so take logarithms of both sides. Since <InlineMath math="\ln 1.5 > 0" />, the inequality sign is unchanged when we divide by it:</p>
                <BlockMath math="n\ln 1.5 > \ln 51 \implies n > \frac{\ln 51}{\ln 1.5} = \frac{3.9318}{0.4055} = 9.70" />
                <p><strong>Step 4:</strong> <InlineMath math="n" /> must be a whole number, so the least value is <InlineMath math="n = 10" />.</p>
                <p><strong>Check:</strong> <InlineMath math="S_9 = 10(1.5^9 - 1) = 374.4" /> — not enough — while <InlineMath math="S_{10} = 10(1.5^{10} - 1) = 566.7 > 500" /> ✓</p>
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
            <p>A series of the form <InlineMath math="a_0 + a_1x + a_2x^2 + \cdots" /> is called a <strong>power series</strong>. As more terms are added, some power series <strong>converge</strong> — the sum settles towards the function — while others <strong>diverge</strong>. A few expansions are worth knowing outright, since questions often expect you to quote rather than derive them:</p>
            <BlockMath math="\begin{aligned} e^x &= 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots &&\text{all } x \\ \sin x &= x - \frac{x^3}{3!} + \frac{x^5}{5!} - \cdots &&\text{all } x \\ \cos x &= 1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \cdots &&\text{all } x \\ \ln(1+x) &= x - \frac{x^2}{2} + \frac{x^3}{3} - \frac{x^4}{4} + \cdots &&-1 < x \le 1 \\ \tan x &= x + \frac{x^3}{3} + \frac{2x^5}{15} + \cdots &&|x| < \tfrac{\pi}{2} \end{aligned}" />
            <p>Note the ranges: <InlineMath math="e^x" />, <InlineMath math="\sin x" /> and <InlineMath math="\cos x" /> converge for every <InlineMath math="x" />, but <InlineMath math="\ln(1+x)" /> is only valid on <InlineMath math="-1 < x \le 1" />. Angles must be in <strong>radians</strong>.</p>
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
      },
      {
        id: "combining-expansions",
        title: "2. Combining Expansions",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>Differentiating a function like <InlineMath math="e^{2x}\sin x" /> four or five times is punishing, and each derivative gets messier than the last. It is almost always faster to build the series from the <strong>standard expansions</strong> instead. There are three techniques:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Multiply two series</strong> together, collecting like powers</li>
              <li><strong>Substitute</strong> a function into a standard series, e.g. <InlineMath math="u = x^2" /> in <InlineMath math="\ln(1+u)" /></li>
              <li><strong>Factorise into standard form</strong>, e.g. <InlineMath math="\ln(3+x) = \ln 3 + \ln\!\left(1 + \tfrac{x}{3}\right)" /></li>
            </ul>
            <p>The saving is real: a product that would need four rounds of the product rule reduces to multiplying out a bracket.</p>
            <p><strong>The Golden Rule:</strong> decide the highest power you need <em>first</em>, then take enough terms from each standard series to reach it — and discard any product that overshoots. If you want the <InlineMath math="x^3" /> term, a term in <InlineMath math="x^2" /> multiplied by one in <InlineMath math="x^2" /> can be ignored entirely.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Taking too few terms:</strong> to reach <InlineMath math="x^3" /> in a product you may still need the <InlineMath math="x^3" /> term of <em>each</em> factor, since it pairs with the constant term of the other.</li>
                <li><strong>Keeping terms you don't need:</strong> anything above the required power is wasted work and invites arithmetic slips — cross it out as you go.</li>
                <li><strong>Substituting carelessly:</strong> replacing <InlineMath math="x" /> by <InlineMath math="2x" /> means <em>every</em> <InlineMath math="x" /> changes, so <InlineMath math="\frac{x^2}{2}" /> becomes <InlineMath math="\frac{4x^2}{2} = 2x^2" />.</li>
                <li><strong>Ranges of validity carry over:</strong> <InlineMath math="\ln(1+u)" /> needs <InlineMath math="-1 < u \le 1" />, so substituting <InlineMath math="u = 2x" /> restricts the result to <InlineMath math="-\frac{1}{2} < x \le \frac{1}{2}" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "combining-ex1",
            question: <p>Use the standard expansions to find the series for <InlineMath math="e^{2x}\sin x" /> as far as the term in <InlineMath math="x^3" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write down each standard series, substituting <InlineMath math="2x" /> into the one for <InlineMath math="e^x" />. Take terms as far as <InlineMath math="x^3" />:</p>
                <BlockMath math="e^{2x} = 1 + 2x + \frac{(2x)^2}{2!} + \frac{(2x)^3}{3!} + \cdots = 1 + 2x + 2x^2 + \frac{4}{3}x^3 + \cdots" />
                <BlockMath math="\sin x = x - \frac{x^3}{3!} + \cdots = x - \frac{x^3}{6} + \cdots" />
                <p><strong>Step 2:</strong> Multiply, keeping only products whose total power is <InlineMath math="3" /> or less:</p>
                <BlockMath math="\begin{aligned} 1 \times x &= x \\ 1 \times \left(-\tfrac{x^3}{6}\right) &= -\tfrac{1}{6}x^3 \\ 2x \times x &= 2x^2 \\ 2x^2 \times x &= 2x^3 \end{aligned}" />
                <p><strong>Step 3:</strong> Every other product reaches <InlineMath math="x^4" /> or beyond, so discard them. Collect like powers:</p>
                <BlockMath math="e^{2x}\sin x = x + 2x^2 + \left(2 - \tfrac{1}{6}\right)x^3 + \cdots = x + 2x^2 + \frac{11}{6}x^3 + \cdots" />
              </div>
            )
          },
          {
            id: "combining-ex2",
            question: <p>Find the series for <InlineMath math="\ln(1 + x^2)" /> as far as the term in <InlineMath math="x^6" />, and state the range of values of <InlineMath math="x" /> for which it is valid.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Start from the standard expansion, using <InlineMath math="u" /> as the variable to keep the substitution clear:</p>
                <BlockMath math="\ln(1+u) = u - \frac{u^2}{2} + \frac{u^3}{3} - \cdots \qquad (-1 < u \le 1)" />
                <p><strong>Step 2:</strong> Substitute <InlineMath math="u = x^2" />. Each power of <InlineMath math="u" /> doubles in <InlineMath math="x" />, so three terms are enough to reach <InlineMath math="x^6" />:</p>
                <BlockMath math="\ln(1+x^2) = x^2 - \frac{(x^2)^2}{2} + \frac{(x^2)^3}{3} - \cdots = x^2 - \frac{x^4}{2} + \frac{x^6}{3} - \cdots" />
                <p><strong>Step 3:</strong> Carry the range through the substitution. We need <InlineMath math="-1 < x^2 \le 1" />, and since <InlineMath math="x^2 \ge 0" /> always, this reduces to <InlineMath math="x^2 \le 1" />:</p>
                <BlockMath math="-1 \le x \le 1" />
              </div>
            )
          },
          {
            id: "combining-ex3",
            question: <p>Find the series for <InlineMath math="\ln(3 + x)" /> as far as the term in <InlineMath math="x^3" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The standard series needs the form <InlineMath math="\ln(1 + \ldots)" />, so factor out the <InlineMath math="3" />:</p>
                <BlockMath math="\ln(3+x) = \ln\!\left[3\left(1 + \frac{x}{3}\right)\right] = \ln 3 + \ln\!\left(1 + \frac{x}{3}\right)" />
                <p><strong>Step 2:</strong> Expand the second term using <InlineMath math="u = \dfrac{x}{3}" />:</p>
                <BlockMath math="\ln\!\left(1 + \frac{x}{3}\right) = \frac{x}{3} - \frac{1}{2}\left(\frac{x}{3}\right)^2 + \frac{1}{3}\left(\frac{x}{3}\right)^3 - \cdots" />
                <p><strong>Step 3:</strong> Simplify each term carefully — the cube of <InlineMath math="\frac{x}{3}" /> brings a factor of <InlineMath math="27" />:</p>
                <BlockMath math="= \frac{x}{3} - \frac{x^2}{18} + \frac{x^3}{81} - \cdots" />
                <p><strong>Step 4:</strong> Add back the constant. Note that <InlineMath math="\ln 3" /> is the <InlineMath math="x^0" /> term of the series:</p>
                <BlockMath math="\ln(3+x) = \ln 3 + \frac{x}{3} - \frac{x^2}{18} + \frac{x^3}{81} - \cdots" />
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
            <p>Polar form is worth the effort because multiplication and division become simple. Writing <InlineMath math="z_1 = r_1(\cos\theta_1 + i\sin\theta_1)" /> and <InlineMath math="z_2 = r_2(\cos\theta_2 + i\sin\theta_2)" />:</p>
            <BlockMath math="\begin{aligned} z_1z_2 &= r_1r_2\bigl[\cos(\theta_1+\theta_2) + i\sin(\theta_1+\theta_2)\bigr] \\ \frac{z_1}{z_2} &= \frac{r_1}{r_2}\bigl[\cos(\theta_1-\theta_2) + i\sin(\theta_1-\theta_2)\bigr] \end{aligned}" />
            <p>In words: <strong>multiply the moduli and add the arguments</strong>. Geometrically, multiplying by a complex number of modulus <InlineMath math="r" /> and argument <InlineMath math="\theta" /> <em>scales</em> by <InlineMath math="r" /> and <em>rotates</em> by <InlineMath math="\theta" />. This gives a set of results worth knowing:</p>
            <BlockMath math="\begin{aligned} |z_1z_2| &= |z_1||z_2| & \arg(z_1z_2) &= \arg z_1 + \arg z_2 \\ \left|\frac{z_1}{z_2}\right| &= \frac{|z_1|}{|z_2|} & \arg\!\left(\frac{z_1}{z_2}\right) &= \arg z_1 - \arg z_2 \\ |\bar{z}| &= |z| & \arg(\bar{z}) &= -\arg z \\ z\bar{z} &= |z|^2 && \end{aligned}" />
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
          },
          {
            id: "polar-ex4",
            question: <p>Given <InlineMath math="z_1 = -1 + \sqrt{3}\,i" /> and <InlineMath math="z_2 = 1 + i" />, find <InlineMath math="|z_1z_2|" /> and <InlineMath math="\arg(z_1z_2)" /> <em>without</em> multiplying the two numbers out.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Find the modulus and argument of <InlineMath math="z_1" />. The point <InlineMath math="(-1, \sqrt{3})" /> lies in the <strong>second</strong> quadrant, so the argument is <InlineMath math="\pi" /> minus the acute reference angle:</p>
                <BlockMath math="|z_1| = \sqrt{(-1)^2 + (\sqrt{3})^2} = \sqrt{4} = 2, \qquad \arg z_1 = \pi - \tan^{-1}\!\left(\frac{\sqrt{3}}{1}\right) = \pi - \frac{\pi}{3} = \frac{2\pi}{3}" />
                <p><strong>Step 2:</strong> Do the same for <InlineMath math="z_2" />. The point <InlineMath math="(1,1)" /> is in the first quadrant, so no adjustment is needed:</p>
                <BlockMath math="|z_2| = \sqrt{1^2 + 1^2} = \sqrt{2}, \qquad \arg z_2 = \tan^{-1}(1) = \frac{\pi}{4}" />
                <p><strong>Step 3:</strong> Multiply the moduli and add the arguments:</p>
                <BlockMath math="|z_1z_2| = 2\sqrt{2}, \qquad \arg(z_1z_2) = \frac{2\pi}{3} + \frac{\pi}{4} = \frac{8\pi}{12} + \frac{3\pi}{12} = \frac{11\pi}{12}" />
                <p><strong>Step 4:</strong> Check the argument lies in the required range <InlineMath math="-\pi < \theta \le \pi" />. Since <InlineMath math="\frac{11\pi}{12} < \pi" />, no adjustment is needed.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "polynomial-roots",
        title: "3. Roots of Polynomial Equations",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>The <strong>Fundamental Theorem of Algebra</strong> guarantees that every polynomial equation of degree <InlineMath math="n" /> has exactly <InlineMath math="n" /> roots in the complex numbers (counting repeats). Some may be real, some may not — but the count is always <InlineMath math="n" />.</p>
            <p>When the coefficients are <strong>real</strong>, one extra fact does most of the work: complex roots always occur in <strong>conjugate pairs</strong>. If <InlineMath math="x + yi" /> is a root, so is <InlineMath math="x - yi" />. Multiplying their two factors together produces a quadratic with real coefficients:</p>
            <BlockMath math="\bigl(z - (x+yi)\bigr)\bigl(z - (x-yi)\bigr) = z^2 - 2xz + (x^2 + y^2)" />
            <p>That gives a reliable method: <strong>find one root, pair it with its conjugate, form the real quadratic factor, divide, and solve what's left.</strong></p>
            <p>A useful consequence is that you can predict the shape of the answer. A cubic with real coefficients has either three real roots, or one real root and one conjugate pair — it can never have exactly two non-real roots and one non-real left over, because they must pair up.</p>
            <p><strong>The Golden Rule:</strong> the conjugate-pair result holds <em>only</em> when every coefficient is real. Check that first; if the equation contains an <InlineMath math="i" /> in its coefficients, the pairing does not apply and you must solve directly.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Forgetting the real root:</strong> a cubic has <em>three</em> roots. Finding the conjugate pair is only two thirds of the answer.</li>
                <li><strong>Sign slip forming the quadratic:</strong> the middle coefficient is <InlineMath math="-2x" /> — twice the <em>real</em> part, negated — and the constant is <InlineMath math="x^2 + y^2" />, a sum, not a difference.</li>
                <li><strong>Verifying a root:</strong> if asked to <em>verify</em>, substitute and show the result is <InlineMath math="0" />; compute the powers of <InlineMath math="(x+yi)" /> step by step, and show the real and imaginary parts cancelling separately.</li>
                <li><strong>Dividing carelessly:</strong> after dividing by the quadratic factor the remainder must be exactly zero. If it isn't, the root or the factor is wrong — go back rather than pressing on.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "poly-roots-ex1",
            question: <p>Find all the roots of <InlineMath math="z^3 - 4z^2 + 14z - 20 = 0" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Look for a real root among the factors of the constant term <InlineMath math="20" />. Trying <InlineMath math="z = 2" />:</p>
                <BlockMath math="8 - 16 + 28 - 20 = 0 \ \checkmark" />
                <p>So <InlineMath math="z = 2" /> is a root and <InlineMath math="(z - 2)" /> is a factor.</p>
                <p><strong>Step 2:</strong> Divide to find the remaining quadratic factor:</p>
                <BlockMath math="z^3 - 4z^2 + 14z - 20 = (z-2)(z^2 - 2z + 10)" />
                <p><strong>Step 3:</strong> Solve the quadratic. The discriminant is negative, so the remaining roots are non-real:</p>
                <BlockMath math="z = \frac{2 \pm \sqrt{4 - 40}}{2} = \frac{2 \pm \sqrt{-36}}{2} = \frac{2 \pm 6i}{2} = 1 \pm 3i" />
                <p><strong>Step 4:</strong> The three roots are <InlineMath math="z = 2" />, <InlineMath math="z = 1 + 3i" /> and <InlineMath math="z = 1 - 3i" /> — one real root and a conjugate pair, exactly as expected for a real cubic.</p>
              </div>
            )
          },
          {
            id: "poly-roots-ex2",
            question: <p>Verify that <InlineMath math="z = 2 + i" /> is a root of <InlineMath math="z^4 - 2z^3 - 6z^2 + 22z - 15 = 0" />, and hence find all the roots.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Build up the powers of <InlineMath math="2+i" /> one at a time:</p>
                <BlockMath math="\begin{aligned} (2+i)^2 &= 4 + 4i + i^2 = 3 + 4i \\ (2+i)^3 &= (3+4i)(2+i) = 6 + 3i + 8i + 4i^2 = 2 + 11i \\ (2+i)^4 &= (3+4i)^2 = 9 + 24i + 16i^2 = -7 + 24i \end{aligned}" />
                <p><strong>Step 2:</strong> Substitute into the equation and collect real and imaginary parts separately:</p>
                <BlockMath math="(-7+24i) - 2(2+11i) - 6(3+4i) + 22(2+i) - 15" />
                <BlockMath math="\begin{aligned} \text{real}: &\quad -7 - 4 - 18 + 44 - 15 = 0 \\ \text{imaginary}: &\quad 24 - 22 - 24 + 22 = 0 \end{aligned}" />
                <p>Both parts are zero, so <InlineMath math="z = 2+i" /> is a root.</p>
                <p><strong>Step 3:</strong> The coefficients are real, so <InlineMath math="z = 2 - i" /> is also a root. Their combined factor is:</p>
                <BlockMath math="\bigl(z-(2+i)\bigr)\bigl(z-(2-i)\bigr) = z^2 - 4z + (4 + 1) = z^2 - 4z + 5" />
                <p><strong>Step 4:</strong> Divide the quartic by this quadratic:</p>
                <BlockMath math="z^4 - 2z^3 - 6z^2 + 22z - 15 = (z^2 - 4z + 5)(z^2 + 2z - 3)" />
                <p><strong>Step 5:</strong> Factorise the remaining quadratic:</p>
                <BlockMath math="z^2 + 2z - 3 = (z+3)(z-1) \implies z = -3 \ \text{ or } \ z = 1" />
                <p><strong>Step 6:</strong> The four roots are <InlineMath math="2 + i" />, <InlineMath math="2 - i" />, <InlineMath math="1" /> and <InlineMath math="-3" />.</p>
              </div>
            )
          },
          {
            id: "poly-roots-ex3",
            question: <p>A polynomial equation of degree 4 has <strong>real coefficients</strong>. Two of its roots are <InlineMath math="3i" /> and <InlineMath math="1 - i" />. Write down the other two roots and hence find the equation.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Because the coefficients are real, each given root brings its conjugate with it:</p>
                <BlockMath math="\text{the other roots are } \ -3i \ \text{ and } \ 1 + i" />
                <p><strong>Step 2:</strong> Pair each root with its conjugate to form two real quadratic factors. For <InlineMath math="\pm 3i" /> we have <InlineMath math="x = 0" />, <InlineMath math="y = 3" />:</p>
                <BlockMath math="z^2 - 2(0)z + (0 + 9) = z^2 + 9" />
                <p><strong>Step 3:</strong> For <InlineMath math="1 \pm i" /> we have <InlineMath math="x = 1" />, <InlineMath math="y = 1" />:</p>
                <BlockMath math="z^2 - 2(1)z + (1 + 1) = z^2 - 2z + 2" />
                <p><strong>Step 4:</strong> Multiply the two factors together:</p>
                <BlockMath math="(z^2+9)(z^2-2z+2) = z^4 - 2z^3 + 2z^2 + 9z^2 - 18z + 18" />
                <p><strong>Step 5:</strong> Collect like terms:</p>
                <BlockMath math="z^4 - 2z^3 + 11z^2 - 18z + 18 = 0" />
              </div>
            )
          }
        ]
      },
      {
        id: "de-moivre-fta",
        title: "4. De Moivre's Theorem & Roots",
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
            question: <p>Find the five fifth roots of unity — that is, solve <InlineMath math="z^5 = 1" /> — and describe their positions on an Argand diagram.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write <InlineMath math="1" /> in polar form. Crucially, add on multiples of <InlineMath math="2\pi" />, since these give the same number but different roots:</p>
                <BlockMath math="1 = \cos(2k\pi) + i\sin(2k\pi), \qquad k \in \mathbb{Z}" />
                <p><strong>Step 2:</strong> Apply De Moivre's Theorem with index <InlineMath math="\frac{1}{5}" />:</p>
                <BlockMath math="z = \cos\!\left(\frac{2k\pi}{5}\right) + i\sin\!\left(\frac{2k\pi}{5}\right)" />
                <p><strong>Step 3:</strong> Take <InlineMath math="k = 0, 1, 2, 3, 4" /> — five consecutive values give all five distinct roots, and any further <InlineMath math="k" /> simply repeats them. Adjusting into the range <InlineMath math="-\pi < \theta \le \pi" />:</p>
                <BlockMath math="\theta = 0,\ \pm\frac{2\pi}{5},\ \pm\frac{4\pi}{5}" />
                <p><strong>Step 4:</strong> Every root has modulus <InlineMath math="1" />, so all five lie on the <strong>unit circle</strong>, equally spaced by <InlineMath math="\frac{2\pi}{5}" />, with one of them at <InlineMath math="z = 1" />.</p>
                <p>This generalises: the <InlineMath math="n" />th roots of unity are <InlineMath math="n" /> equally spaced points on the unit circle, separated by <InlineMath math="\frac{2\pi}{n}" />, always including the point <InlineMath math="1" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "multiple-angle-formulae",
        title: "5. Multiple Angle Formulae",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>De Moivre's Theorem gives two powerful trigonometric tools, working in opposite directions.</p>
            <p><strong>Direction 1 — multiple angles into powers.</strong> Expand <InlineMath math="(\cos\theta + i\sin\theta)^n" /> in two different ways. De Moivre says it equals <InlineMath math="\cos n\theta + i\sin n\theta" />; the Binomial Theorem gives a sum of terms. Since the two must be equal, <strong>equate the real parts</strong> to get <InlineMath math="\cos n\theta" />, and the <strong>imaginary parts</strong> to get <InlineMath math="\sin n\theta" />.</p>
            <p><strong>Direction 2 — powers into multiple angles.</strong> Let <InlineMath math="z = \cos\theta + i\sin\theta" />. Then <InlineMath math="\frac{1}{z} = z^{-1} = \cos\theta - i\sin\theta" />, so adding and subtracting gives:</p>
            <BlockMath math="z + \frac{1}{z} = 2\cos\theta, \qquad z - \frac{1}{z} = 2i\sin\theta" />
            <p>and more generally — <strong>these are results you are expected to know</strong>:</p>
            <BlockMath math="z^k + \frac{1}{z^k} = 2\cos k\theta, \qquad z^k - \frac{1}{z^k} = 2i\sin k\theta" />
            <p>So to convert something like <InlineMath math="\cos^4\theta" /> into multiple angles, expand <InlineMath math="\left(z + \frac{1}{z}\right)^4" /> by the Binomial Theorem and pair the outer terms inwards — each pair collapses to a <InlineMath math="2\cos k\theta" />.</p>
            <p><strong>The Golden Rule:</strong> read the question to decide the direction. Going <em>from</em> <InlineMath math="\cos n\theta" /> <em>to</em> powers of <InlineMath math="\cos\theta" /> uses De Moivre with the Binomial Theorem; going <em>from</em> a power like <InlineMath math="\cos^n\theta" /> <em>to</em> multiple angles uses <InlineMath math="z + \frac{1}{z}" />.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Powers of <InlineMath math="i" />:</strong> the cycle is <InlineMath math="i^2 = -1" />, <InlineMath math="i^3 = -i" />, <InlineMath math="i^4 = 1" />. Getting one wrong flips a sign in the middle of the expansion.</li>
                <li><strong>Dropping the <InlineMath math="i" /> when equating:</strong> the imaginary part of <InlineMath math="4ic^3s" /> is <InlineMath math="4c^3s" />, not <InlineMath math="4ic^3s" /> — compare coefficients of <InlineMath math="i" />.</li>
                <li><strong>Not finishing the conversion:</strong> &ldquo;in terms of <InlineMath math="\cos\theta" />&rdquo; means <em>only</em> <InlineMath math="\cos\theta" />, so use <InlineMath math="\sin^2\theta = 1 - \cos^2\theta" /> to remove every sine.</li>
                <li><strong>Forgetting the <InlineMath math="2^n" />:</strong> <InlineMath math="\left(z + \frac{1}{z}\right)^n = (2\cos\theta)^n = 2^n\cos^n\theta" />, so you must divide by <InlineMath math="2^n" /> at the end.</li>
                <li><strong>Odd powers bring an <InlineMath math="i" />:</strong> <InlineMath math="(2i\sin\theta)^3 = -8i\sin^3\theta" />, since <InlineMath math="i^3 = -i" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "multiple-angle-ex1",
            question: <p>By considering <InlineMath math="(\cos\theta + i\sin\theta)^4" />, show that <InlineMath math="\cos 4\theta = 8\cos^4\theta - 8\cos^2\theta + 1" />, and find an expression for <InlineMath math="\sin 4\theta" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write <InlineMath math="c = \cos\theta" /> and <InlineMath math="s = \sin\theta" />. By De Moivre's Theorem:</p>
                <BlockMath math="(c + is)^4 = \cos 4\theta + i\sin 4\theta" />
                <p><strong>Step 2:</strong> Expand the same expression by the Binomial Theorem, with coefficients <InlineMath math="1,4,6,4,1" />:</p>
                <BlockMath math="(c+is)^4 = c^4 + 4c^3(is) + 6c^2(is)^2 + 4c(is)^3 + (is)^4" />
                <p><strong>Step 3:</strong> Simplify the powers of <InlineMath math="i" />, using <InlineMath math="i^2=-1" />, <InlineMath math="i^3=-i" />, <InlineMath math="i^4=1" />:</p>
                <BlockMath math="= c^4 + 4ic^3s - 6c^2s^2 - 4ics^3 + s^4" />
                <p><strong>Step 4:</strong> Equate real parts to obtain <InlineMath math="\cos 4\theta" />:</p>
                <BlockMath math="\cos 4\theta = c^4 - 6c^2s^2 + s^4" />
                <p><strong>Step 5:</strong> The answer must be in terms of <InlineMath math="\cos\theta" /> only, so replace <InlineMath math="s^2 = 1 - c^2" />:</p>
                <BlockMath math="\begin{aligned} \cos 4\theta &= c^4 - 6c^2(1-c^2) + (1-c^2)^2 \\ &= c^4 - 6c^2 + 6c^4 + 1 - 2c^2 + c^4 \\ &= 8c^4 - 8c^2 + 1 \end{aligned}" />
                <p><strong>Step 6:</strong> Now equate the imaginary parts, dropping the factor of <InlineMath math="i" />:</p>
                <BlockMath math="\sin 4\theta = 4c^3s - 4cs^3 = 4\sin\theta\cos\theta\left(\cos^2\theta - \sin^2\theta\right)" />
                <p><strong>Check:</strong> that last form is <InlineMath math="2(2\sin\theta\cos\theta)(\cos^2\theta - \sin^2\theta) = 2\sin 2\theta\cos 2\theta = \sin 4\theta" /> ✓</p>
              </div>
            )
          },
          {
            id: "multiple-angle-ex2",
            question: <p>By considering <InlineMath math="z = \cos\theta + i\sin\theta" />, show that <InlineMath math="\cos^4\theta = \dfrac{1}{8}\bigl[\cos 4\theta + 4\cos 2\theta + 3\bigr]" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Since <InlineMath math="z + \dfrac{1}{z} = 2\cos\theta" />, raising both sides to the fourth power gives:</p>
                <BlockMath math="\left(z + \frac{1}{z}\right)^4 = (2\cos\theta)^4 = 16\cos^4\theta" />
                <p><strong>Step 2:</strong> Expand the left-hand side by the Binomial Theorem. Each term is a power of <InlineMath math="z" /> times a power of <InlineMath math="\frac{1}{z}" />, so the powers partly cancel:</p>
                <BlockMath math="\left(z + \frac{1}{z}\right)^4 = z^4 + 4z^2 + 6 + \frac{4}{z^2} + \frac{1}{z^4}" />
                <p><strong>Step 3:</strong> Pair the outer terms inwards, so each pair has the form <InlineMath math="z^k + \frac{1}{z^k}" />:</p>
                <BlockMath math="= \left(z^4 + \frac{1}{z^4}\right) + 4\left(z^2 + \frac{1}{z^2}\right) + 6" />
                <p><strong>Step 4:</strong> Apply <InlineMath math="z^k + \frac{1}{z^k} = 2\cos k\theta" /> to each pair:</p>
                <BlockMath math="= 2\cos 4\theta + 4(2\cos 2\theta) + 6 = 2\cos 4\theta + 8\cos 2\theta + 6" />
                <p><strong>Step 5:</strong> Equate the two expressions and divide by <InlineMath math="16" />:</p>
                <BlockMath math="16\cos^4\theta = 2\cos 4\theta + 8\cos 2\theta + 6 \implies \cos^4\theta = \frac{1}{8}\bigl[\cos 4\theta + 4\cos 2\theta + 3\bigr]" />
              </div>
            )
          },
          {
            id: "multiple-angle-ex3",
            question: <p>Show that <InlineMath math="\sin^3\theta = \dfrac{1}{4}\bigl[3\sin\theta - \sin 3\theta\bigr]" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> This time the function is sine, so use the <em>subtraction</em> result <InlineMath math="z - \dfrac{1}{z} = 2i\sin\theta" />. Cube both sides, remembering <InlineMath math="i^3 = -i" />:</p>
                <BlockMath math="\left(z - \frac{1}{z}\right)^3 = (2i\sin\theta)^3 = 8i^3\sin^3\theta = -8i\sin^3\theta" />
                <p><strong>Step 2:</strong> Expand the left-hand side, with alternating signs and coefficients <InlineMath math="1,3,3,1" />:</p>
                <BlockMath math="\left(z - \frac{1}{z}\right)^3 = z^3 - 3z + \frac{3}{z} - \frac{1}{z^3}" />
                <p><strong>Step 3:</strong> Pair the outer terms inwards. Note the middle pair carries a minus sign:</p>
                <BlockMath math="= \left(z^3 - \frac{1}{z^3}\right) - 3\left(z - \frac{1}{z}\right)" />
                <p><strong>Step 4:</strong> Apply <InlineMath math="z^k - \frac{1}{z^k} = 2i\sin k\theta" /> to each pair:</p>
                <BlockMath math="= 2i\sin 3\theta - 3(2i\sin\theta) = 2i\sin 3\theta - 6i\sin\theta" />
                <p><strong>Step 5:</strong> Equate with Step 1 and divide through by <InlineMath math="-2i" />:</p>
                <BlockMath math="-8i\sin^3\theta = 2i\sin 3\theta - 6i\sin\theta \implies 4\sin^3\theta = 3\sin\theta - \sin 3\theta" />
                <p><strong>Step 6:</strong> Divide by <InlineMath math="4" />:</p>
                <BlockMath math="\sin^3\theta = \frac{1}{4}\bigl[3\sin\theta - \sin 3\theta\bigr]" />
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
        id: "first-principles",
        title: "1. Differentiation from First Principles",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>Every differentiation rule you use rests on a single definition. To find the gradient of the tangent to <InlineMath math="y = f(x)" /> at the point <InlineMath math="A\,(x,\,f(x))" />, take a second point <InlineMath math="B\,(x+h,\,f(x+h))" /> on the curve and calculate the gradient of the <strong>chord</strong> <InlineMath math="AB" />:</p>
            <BlockMath math="m_{AB} = \frac{f(x+h) - f(x)}{(x+h) - x} = \frac{f(x+h) - f(x)}{h}" />
            <p>As <InlineMath math="h" /> gets smaller, <InlineMath math="B" /> slides towards <InlineMath math="A" /> and the chord becomes indistinguishable from the tangent. The value the gradient approaches is the <strong>derivative</strong>:</p>
            <BlockMath math="f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}" />
            <p>Differentiating <strong>from first principles</strong> means using this definition directly — without any of the standard rules or known derivatives.</p>
            <p><strong>The Golden Rule:</strong> expand <InlineMath math="f(x+h)" /> completely, then subtract <InlineMath math="f(x)" />. Every surviving term <em>must</em> contain a factor of <InlineMath math="h" /> — if one doesn't, you have made an algebra slip. Cancel that <InlineMath math="h" /> against the denominator, and only then let <InlineMath math="h \to 0" />.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Setting <InlineMath math="h = 0" /> too early:</strong> you cannot substitute <InlineMath math="h=0" /> while <InlineMath math="h" /> is still in the denominator — that gives <InlineMath math="\frac{0}{0}" />. Cancel first, take the limit second.</li>
                <li><strong>Dropping the limit notation:</strong> write <InlineMath math="\lim_{h \to 0}" /> in front of every line until you actually take the limit. Marks are awarded for it.</li>
                <li><strong>Expanding <InlineMath math="(x+h)^3" /> carelessly:</strong> it is <InlineMath math="x^3 + 3x^2h + 3xh^2 + h^3" />, not <InlineMath math="x^3 + h^3" />.</li>
                <li><strong>Using the rules instead:</strong> if a question says &ldquo;from first principles&rdquo;, quoting <InlineMath math="nx^{n-1}" /> earns nothing, even with the right answer.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "first-principles-ex1",
            question: <p>Differentiate <InlineMath math="f(x) = 2x^2 - 5x" /> from first principles.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write down <InlineMath math="f(x+h)" /> and expand it fully:</p>
                <BlockMath math="f(x+h) = 2(x+h)^2 - 5(x+h) = 2x^2 + 4xh + 2h^2 - 5x - 5h" />
                <p><strong>Step 2:</strong> Subtract <InlineMath math="f(x) = 2x^2 - 5x" />. The terms without an <InlineMath math="h" /> cancel:</p>
                <BlockMath math="f(x+h) - f(x) = 4xh + 2h^2 - 5h" />
                <p><strong>Step 3:</strong> Divide by <InlineMath math="h" />, cancelling the common factor:</p>
                <BlockMath math="\frac{f(x+h)-f(x)}{h} = \frac{h(4x + 2h - 5)}{h} = 4x + 2h - 5" />
                <p><strong>Step 4:</strong> Now the limit can be taken safely:</p>
                <BlockMath math="f'(x) = \lim_{h \to 0}\,(4x + 2h - 5) = 4x - 5" />
              </div>
            )
          },
          {
            id: "first-principles-ex2",
            question: <p>Differentiate <InlineMath math="f(x) = x^3 - 2x" /> from first principles.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Expand <InlineMath math="f(x+h)" />, taking care with the cube:</p>
                <BlockMath math="f(x+h) = (x+h)^3 - 2(x+h) = x^3 + 3x^2h + 3xh^2 + h^3 - 2x - 2h" />
                <p><strong>Step 2:</strong> Subtract <InlineMath math="f(x) = x^3 - 2x" />:</p>
                <BlockMath math="f(x+h) - f(x) = 3x^2h + 3xh^2 + h^3 - 2h" />
                <p><strong>Step 3:</strong> Every term has a factor of <InlineMath math="h" />, so divide through:</p>
                <BlockMath math="\frac{f(x+h)-f(x)}{h} = 3x^2 + 3xh + h^2 - 2" />
                <p><strong>Step 4:</strong> Let <InlineMath math="h \to 0" />; the two terms still containing <InlineMath math="h" /> vanish:</p>
                <BlockMath math="f'(x) = \lim_{h \to 0}\,(3x^2 + 3xh + h^2 - 2) = 3x^2 - 2" />
              </div>
            )
          },
          {
            id: "first-principles-ex3",
            question: <p>Differentiate <InlineMath math="f(x) = \dfrac{1}{x}" /> from first principles.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Here <InlineMath math="f(x+h) = \dfrac{1}{x+h}" />. Subtracting gives a difference of two fractions, so combine them over a common denominator:</p>
                <BlockMath math="f(x+h) - f(x) = \frac{1}{x+h} - \frac{1}{x} = \frac{x - (x+h)}{x(x+h)} = \frac{-h}{x(x+h)}" />
                <p><strong>Step 2:</strong> Dividing by <InlineMath math="h" /> means multiplying by <InlineMath math="\dfrac{1}{h}" />, which cancels the <InlineMath math="h" /> in the numerator:</p>
                <BlockMath math="\frac{f(x+h)-f(x)}{h} = \frac{-h}{x(x+h)} \times \frac{1}{h} = \frac{-1}{x(x+h)}" />
                <p><strong>Step 3:</strong> There is no longer an <InlineMath math="h" /> in the denominator's way, so let <InlineMath math="h \to 0" />:</p>
                <BlockMath math="f'(x) = \lim_{h \to 0} \frac{-1}{x(x+h)} = \frac{-1}{x \cdot x} = -\frac{1}{x^2}" />
                <p>This agrees with the power rule: <InlineMath math="\frac{d}{dx}(x^{-1}) = -x^{-2}" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "differentiation-rules",
        title: "2. Rules & Standard Derivatives",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>Advanced Higher extends Higher differentiation with three key rules and a wider set of standard derivatives.</p>
            <BlockMath math="(uv)' = u'v + uv' \qquad \left(\frac{u}{v}\right)' = \frac{u'v - uv'}{v^2} \qquad \bigl(f(g(x))\bigr)' = f'(g(x))\,g'(x)" />
            <p>It also introduces three <strong>reciprocal trigonometric functions</strong>, which you must know by name:</p>
            <BlockMath math="\sec\theta = \frac{1}{\cos\theta}, \qquad \operatorname{cosec}\theta = \frac{1}{\sin\theta}, \qquad \cot\theta = \frac{1}{\tan\theta} = \frac{\cos\theta}{\sin\theta}" />
            <p>Note the pairing: <InlineMath math="\sec" /> goes with <InlineMath math="\cos" />, and <InlineMath math="\operatorname{cosec}" /> goes with <InlineMath math="\sin" /> — not the other way round. Together with the exponential and logarithmic functions, these give the standard derivatives for this course:</p>
            <BlockMath math="\begin{aligned} \frac{d}{dx}(\tan x) &= \sec^2 x & \frac{d}{dx}(\cot x) &= -\operatorname{cosec}^2 x \\ \frac{d}{dx}(\sec x) &= \sec x \tan x & \frac{d}{dx}(\operatorname{cosec} x) &= -\operatorname{cosec} x \cot x \\ \frac{d}{dx}(e^x) &= e^x & \frac{d}{dx}(\ln x) &= \frac{1}{x} \end{aligned}" />
            <p>The two functions beginning with &ldquo;co&rdquo; — <InlineMath math="\cot" /> and <InlineMath math="\operatorname{cosec}" /> — are the ones with <strong>negative</strong> derivatives, exactly as <InlineMath math="\cos" /> is. (The inverse trigonometric functions <InlineMath math="\sin^{-1}" />, <InlineMath math="\cos^{-1}" /> and <InlineMath math="\tan^{-1}" /> have their own topic.)</p>
            <p><strong>The Golden Rule:</strong> identify the structure before differentiating — a product, a quotient, or a composition — and apply the matching rule. For combinations, work from the outside in.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Quotient rule order:</strong> the numerator is <InlineMath math="u'v - uv'" />, in that order — reversing it flips the sign.</li>
                <li><strong>Chain rule inside factor:</strong> always multiply by the derivative of the inner function.</li>
                <li><strong>Standard derivatives:</strong> know the exact forms, e.g. <InlineMath math="\frac{d}{dx}(\tan x) = \sec^2 x" />, not <InlineMath math="\sec x" />.</li>
                <li><strong>Mixing up sec and cosec:</strong> <InlineMath math="\sec\theta = \frac{1}{\cos\theta}" /> — the names are deliberately crossed over, and it is a costly slip.</li>
                <li><strong>Losing the minus sign:</strong> <InlineMath math="\cot x" /> and <InlineMath math="\operatorname{cosec} x" /> both differentiate to <em>negative</em> expressions.</li>
                <li><strong>Powers of trig functions:</strong> <InlineMath math="\sec^3 x" /> means <InlineMath math="(\sec x)^3" />, so it needs the chain rule — differentiate the power first, then multiply by <InlineMath math="\sec x \tan x" />.</li>
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
          },
          {
            id: "diff-rules-ex4",
            question: <p>Differentiate (a) <InlineMath math="y = 5\operatorname{cosec} 3x" />, (b) <InlineMath math="y = \sec^3 x" />, and (c) <InlineMath math="y = x\cot x" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1 (a):</strong> Use <InlineMath math="\frac{d}{dx}(\operatorname{cosec} x) = -\operatorname{cosec} x \cot x" /> together with the chain rule, since the angle is <InlineMath math="3x" />:</p>
                <BlockMath math="\frac{dy}{dx} = 5 \times \bigl(-\operatorname{cosec} 3x \cot 3x\bigr) \times 3 = -15\operatorname{cosec} 3x \cot 3x" />
                <p><strong>Step 2 (b):</strong> Read <InlineMath math="\sec^3 x" /> as <InlineMath math="(\sec x)^3" />. Differentiate the power first, then multiply by the derivative of <InlineMath math="\sec x" />:</p>
                <BlockMath math="\frac{dy}{dx} = 3(\sec x)^2 \times \sec x \tan x = 3\sec^3 x \tan x" />
                <p><strong>Step 3 (c):</strong> This is a product, so use <InlineMath math="u'v + uv'" /> with <InlineMath math="u = x" /> and <InlineMath math="v = \cot x" />, remembering the minus sign:</p>
                <BlockMath math="\frac{dy}{dx} = (1)\cot x + x\bigl(-\operatorname{cosec}^2 x\bigr)" />
                <p><strong>Step 4:</strong> Tidy the result:</p>
                <BlockMath math="\frac{dy}{dx} = \cot x - x\operatorname{cosec}^2 x" />
              </div>
            )
          }
        ]
      },
      {
        id: "higher-derivatives",
        title: "3. Higher Derivatives",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>The derivative <InlineMath math="\frac{dy}{dx}" /> is itself a function of <InlineMath math="x" />, so it can be differentiated again. The result is the <strong>second derivative</strong>, written in any of these ways:</p>
            <BlockMath math="\frac{d^2y}{dx^2} = \frac{d}{dx}\!\left(\frac{dy}{dx}\right), \qquad f''(x), \qquad y''" />
            <p>Repeating the process gives the third, fourth and in general the <InlineMath math="n" />th derivative, <InlineMath math="\dfrac{d^ny}{dx^n}" /> or <InlineMath math="f^{(n)}(x)" />.</p>
            <p>The second derivative measures how the gradient itself is changing, which is what makes it a test for the <strong>nature of a stationary point</strong>. At a stationary point <InlineMath math="x = a" /> (where <InlineMath math="f'(a) = 0" />):</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><InlineMath math="f''(a) > 0" /> — the gradient is increasing, so a <strong>minimum</strong> turning point</li>
              <li><InlineMath math="f''(a) < 0" /> — the gradient is decreasing, so a <strong>maximum</strong> turning point</li>
              <li><InlineMath math="f''(a) = 0" /> — the test <strong>fails</strong>; fall back on a nature table</li>
            </ul>
            <p>Questions also ask you to compute the first few derivatives of a function and then <strong>conjecture</strong> a formula for the <InlineMath math="n" />th, so look for a pattern in three things at once: the sign, the numerical coefficient, and the power.</p>
            <p><strong>The Golden Rule:</strong> differentiate one step at a time, simplifying fully before starting the next step — an untidy first derivative makes the second far harder than it needs to be.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Getting the test backwards:</strong> positive second derivative means <em>minimum</em>. Picture a valley — the gradient rises from negative, through zero, to positive.</li>
                <li><strong>Assuming <InlineMath math="f''(a)=0" /> means a point of inflection:</strong> it does not. The test is simply inconclusive, and you must use a nature table instead.</li>
                <li><strong>Notation:</strong> <InlineMath math="\frac{d^2y}{dx^2}" /> is the second derivative, which is <em>not</em> the same as <InlineMath math="\left(\frac{dy}{dx}\right)^2" />.</li>
                <li><strong>Forgetting the <InlineMath math="y" />-coordinates:</strong> a stationary point is a <em>point</em> — substitute back into the original equation, not the derivative.</li>
                <li><strong>Conjectures need the sign pattern:</strong> alternating signs are captured by a factor of <InlineMath math="(-1)^n" /> or <InlineMath math="(-1)^{n-1}" /> — check which by testing <InlineMath math="n=1" />.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "higher-deriv-ex1",
            question: <p>Find the first and second derivatives of <InlineMath math="f(x) = x^4 - 3x^3 + 2x" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Differentiate term by term:</p>
                <BlockMath math="f'(x) = 4x^3 - 9x^2 + 2" />
                <p><strong>Step 2:</strong> Differentiate the result again. The constant <InlineMath math="2" /> disappears:</p>
                <BlockMath math="f''(x) = 12x^2 - 18x" />
              </div>
            )
          },
          {
            id: "higher-deriv-ex2",
            question: <p>Find the stationary points of <InlineMath math="y = x^3 - 3x^2 - 9x + 5" /> and determine their nature using the second derivative.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Differentiate and set equal to zero:</p>
                <BlockMath math="\frac{dy}{dx} = 3x^2 - 6x - 9 = 3(x^2 - 2x - 3) = 3(x-3)(x+1)" />
                <BlockMath math="\frac{dy}{dx} = 0 \implies x = 3 \ \text{ or } \ x = -1" />
                <p><strong>Step 2:</strong> Find the <InlineMath math="y" />-coordinates from the <em>original</em> equation:</p>
                <BlockMath math="\begin{aligned} x=3: &\quad y = 27 - 27 - 27 + 5 = -22 \\ x=-1: &\quad y = -1 - 3 + 9 + 5 = 10 \end{aligned}" />
                <p><strong>Step 3:</strong> Find the second derivative:</p>
                <BlockMath math="\frac{d^2y}{dx^2} = 6x - 6" />
                <p><strong>Step 4:</strong> Evaluate it at each stationary point:</p>
                <BlockMath math="\begin{aligned} x=3: &\quad 6(3) - 6 = 12 > 0 \implies \text{minimum} \\ x=-1: &\quad 6(-1) - 6 = -12 < 0 \implies \text{maximum} \end{aligned}" />
                <p>So <InlineMath math="(3, -22)" /> is a minimum turning point and <InlineMath math="(-1, 10)" /> is a maximum turning point.</p>
              </div>
            )
          },
          {
            id: "higher-deriv-ex3",
            question: <p>Given <InlineMath math="f(x) = \dfrac{1}{x}" />, find the first four derivatives and hence make a conjecture for <InlineMath math="f^{(n)}(x)" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write the function as <InlineMath math="x^{-1}" /> and differentiate repeatedly, keeping every result as a negative power so the pattern stays visible:</p>
                <BlockMath math="\begin{aligned} f'(x) &= -x^{-2} \\ f''(x) &= 2x^{-3} \\ f'''(x) &= -6x^{-4} \\ f^{(4)}(x) &= 24x^{-5} \end{aligned}" />
                <p><strong>Step 2:</strong> Examine the three patterns separately. The signs alternate starting from negative; the coefficients are <InlineMath math="1, 2, 6, 24" />, which are <InlineMath math="1!, 2!, 3!, 4!" />; and the power is <InlineMath math="-(n+1)" />.</p>
                <p><strong>Step 3:</strong> Since the <em>first</em> derivative is negative, the sign factor must be <InlineMath math="(-1)^n" />. Combining all three patterns:</p>
                <BlockMath math="f^{(n)}(x) = (-1)^n\,n!\,x^{-(n+1)} = \frac{(-1)^n\,n!}{x^{n+1}}" />
                <p><strong>Step 4:</strong> Check the conjecture against a known case. For <InlineMath math="n=3" />:</p>
                <BlockMath math="\frac{(-1)^{3}\,3!}{x^{4}} = \frac{-6}{x^4} = -6x^{-4} \ \checkmark" />
              </div>
            )
          }
        ]
      },
      {
        id: "inverse-trig-differentiation",
        title: "4. Inverse Trigonometric Differentiation",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>The derivatives of <InlineMath math="\sin^{-1}x" />, <InlineMath math="\cos^{-1}x" /> and <InlineMath math="\tan^{-1}x" /> are not obvious, but they all follow from one idea about inverse functions. If <InlineMath math="y" /> is the inverse of some function, we can swap the roles of the variables and use:</p>
            <BlockMath math="\frac{dy}{dx} = \frac{1}{\dfrac{dx}{dy}} \qquad \left(\text{provided } \frac{dx}{dy} \neq 0\right)" />
            <p>Take <InlineMath math="y = \tan^{-1}x" />. By definition this means <InlineMath math="x = \tan y" />, which is easy to differentiate:</p>
            <BlockMath math="\frac{dx}{dy} = \sec^2 y = 1 + \tan^2 y = 1 + x^2 \quad\implies\quad \frac{dy}{dx} = \frac{1}{1+x^2}" />
            <p>The same argument applied to <InlineMath math="\sin^{-1}" /> and <InlineMath math="\cos^{-1}" /> gives the three standard results:</p>
            <BlockMath math="\frac{d}{dx}\bigl(\sin^{-1}x\bigr) = \frac{1}{\sqrt{1-x^2}}, \qquad \frac{d}{dx}\bigl(\cos^{-1}x\bigr) = -\frac{1}{\sqrt{1-x^2}}, \qquad \frac{d}{dx}\bigl(\tan^{-1}x\bigr) = \frac{1}{1+x^2}" />
            <p>When the argument is a function rather than just <InlineMath math="x" />, apply the chain rule — replace <InlineMath math="x" /> by <InlineMath math="f(x)" /> throughout and multiply by <InlineMath math="f'(x)" />:</p>
            <BlockMath math="\frac{d}{dx}\bigl(\tan^{-1}f(x)\bigr) = \frac{f'(x)}{1 + \bigl[f(x)\bigr]^2}" />
            <p><strong>The Golden Rule:</strong> to derive one of these, write the inverse statement (<InlineMath math="y = \sin^{-1}x \iff x = \sin y" />), differentiate <em>that</em> with respect to <InlineMath math="y" />, invert it, and finally convert back into terms of <InlineMath math="x" /> using a Pythagorean identity.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong><InlineMath math="\sin^{-1}x" /> is not <InlineMath math="\frac{1}{\sin x}" />:</strong> the <InlineMath math="-1" /> denotes the inverse function. The reciprocal of <InlineMath math="\sin x" /> is <InlineMath math="\operatorname{cosec} x" />.</li>
                <li><strong>Losing the minus sign:</strong> <InlineMath math="\cos^{-1}" /> differentiates to the <em>negative</em> of the <InlineMath math="\sin^{-1}" /> result — that sign is the only difference between them.</li>
                <li><strong>Forgetting the chain rule:</strong> for <InlineMath math="\tan^{-1}(5x^2)" /> you must square the whole argument in the denominator — giving <InlineMath math="25x^4" />, not <InlineMath math="25x^2" /> — <em>and</em> multiply by the derivative of the inside.</li>
                <li><strong>Choosing the sign of the square root:</strong> in the derivation, <InlineMath math="\sqrt{1-x^2}" /> is taken as positive because the range of <InlineMath math="\sin^{-1}" /> is <InlineMath math="\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]" />, where <InlineMath math="\cos y \ge 0" />. State this — it is a marked step.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "inverse-trig-ex1",
            question: <p>Prove, from the definition of the inverse function, that <InlineMath math="\dfrac{d}{dx}\bigl(\sin^{-1}x\bigr) = \dfrac{1}{\sqrt{1-x^2}}" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Let <InlineMath math="y = \sin^{-1}x" />. By the definition of the inverse function this means:</p>
                <BlockMath math="x = \sin y" />
                <p><strong>Step 2:</strong> Differentiate with respect to <InlineMath math="y" />, then invert:</p>
                <BlockMath math="\frac{dx}{dy} = \cos y \quad\implies\quad \frac{dy}{dx} = \frac{1}{\cos y}" />
                <p><strong>Step 3:</strong> Convert back to <InlineMath math="x" /> using <InlineMath math="\sin^2 y + \cos^2 y = 1" />:</p>
                <BlockMath math="\cos^2 y = 1 - \sin^2 y = 1 - x^2 \quad\implies\quad \cos y = \pm\sqrt{1-x^2}" />
                <p><strong>Step 4:</strong> Choose the sign. The range of <InlineMath math="\sin^{-1}" /> is <InlineMath math="\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]" />, on which <InlineMath math="\cos y \ge 0" />, so the positive root is correct:</p>
                <BlockMath math="\frac{dy}{dx} = \frac{1}{\sqrt{1-x^2}}" />
              </div>
            )
          },
          {
            id: "inverse-trig-ex2",
            question: <p>Differentiate (a) <InlineMath math="y = \cos^{-1}(2x)" /> and (b) <InlineMath math="y = \tan^{-1}(5x^2)" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1 (a):</strong> Apply the standard result for <InlineMath math="\cos^{-1}" /> — note the minus sign — with the chain rule. The inner function is <InlineMath math="2x" />, so multiply by <InlineMath math="2" />:</p>
                <BlockMath math="\frac{dy}{dx} = -\frac{1}{\sqrt{1 - (2x)^2}} \times 2" />
                <p><strong>Step 2:</strong> Simplify, remembering the whole of <InlineMath math="2x" /> is squared:</p>
                <BlockMath math="\frac{dy}{dx} = -\frac{2}{\sqrt{1 - 4x^2}}" />
                <p><strong>Step 3 (b):</strong> Now the inner function is <InlineMath math="5x^2" />, whose derivative is <InlineMath math="10x" />:</p>
                <BlockMath math="\frac{dy}{dx} = \frac{1}{1 + (5x^2)^2} \times 10x" />
                <p><strong>Step 4:</strong> Square the inner function carefully — <InlineMath math="(5x^2)^2 = 25x^4" />, not <InlineMath math="25x^2" />:</p>
                <BlockMath math="\frac{dy}{dx} = \frac{10x}{1 + 25x^4}" />
              </div>
            )
          },
          {
            id: "inverse-trig-ex3",
            question: <p>Differentiate <InlineMath math="y = \sin^{-1}\!\left(\dfrac{x}{4}\right)" />, simplifying your answer.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Use the chain rule with inner function <InlineMath math="\dfrac{x}{4}" />, whose derivative is <InlineMath math="\dfrac{1}{4}" />:</p>
                <BlockMath math="\frac{dy}{dx} = \frac{1}{\sqrt{1 - \left(\frac{x}{4}\right)^2}} \times \frac{1}{4}" />
                <p><strong>Step 2:</strong> Simplify the surd by writing the inside as a single fraction:</p>
                <BlockMath math="\sqrt{1 - \frac{x^2}{16}} = \sqrt{\frac{16-x^2}{16}} = \frac{\sqrt{16-x^2}}{4}" />
                <p><strong>Step 3:</strong> Substitute back — the factors of <InlineMath math="4" /> cancel:</p>
                <BlockMath math="\frac{dy}{dx} = \frac{4}{\sqrt{16-x^2}} \times \frac{1}{4} = \frac{1}{\sqrt{16-x^2}}" />
              </div>
            )
          },
          {
            id: "inverse-trig-ex4",
            question: <p>Differentiate <InlineMath math="y = x^2\tan^{-1}x" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> This is a product, with <InlineMath math="u = x^2" /> and <InlineMath math="v = \tan^{-1}x" />:</p>
                <BlockMath math="u' = 2x, \qquad v' = \frac{1}{1+x^2}" />
                <p><strong>Step 2:</strong> Apply the product rule <InlineMath math="u'v + uv'" />:</p>
                <BlockMath math="\frac{dy}{dx} = 2x\tan^{-1}x + x^2 \times \frac{1}{1+x^2}" />
                <p><strong>Step 3:</strong> Tidy the second term. The <InlineMath math="\tan^{-1}x" /> cannot be simplified further, so it stays as it is:</p>
                <BlockMath math="\frac{dy}{dx} = 2x\tan^{-1}x + \frac{x^2}{1+x^2}" />
              </div>
            )
          }
        ]
      },
      {
        id: "implicit-differentiation",
        title: "5. Implicit Differentiation",
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
          },
          {
            id: "implicit-ex3",
            question: <p>Find the equation of the tangent to the curve <InlineMath math="x^2 + 2xy - y^2 = 7" /> at the point <InlineMath math="(2, 1)" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Confirm the point lies on the curve:</p>
                <BlockMath math="(2)^2 + 2(2)(1) - (1)^2 = 4 + 4 - 1 = 7 \ \checkmark" />
                <p><strong>Step 2:</strong> Differentiate implicitly, using the product rule on the <InlineMath math="2xy" /> term:</p>
                <BlockMath math="2x + 2\left(y + x\frac{dy}{dx}\right) - 2y\frac{dy}{dx} = 0" />
                <p><strong>Step 3:</strong> Gather the <InlineMath math="\frac{dy}{dx}" /> terms and factorise:</p>
                <BlockMath math="\frac{dy}{dx}\bigl(2x - 2y\bigr) = -(2x + 2y) \implies \frac{dy}{dx} = -\frac{x + y}{x - y}" />
                <p><strong>Step 4:</strong> Substitute <InlineMath math="(2,1)" /> to get the gradient of the tangent:</p>
                <BlockMath math="\frac{dy}{dx} = -\frac{2 + 1}{2 - 1} = -3" />
                <p><strong>Step 5:</strong> Use <InlineMath math="y - b = m(x - a)" />:</p>
                <BlockMath math="y - 1 = -3(x - 2) \implies y - 1 = -3x + 6 \implies 3x + y - 7 = 0" />
              </div>
            )
          },
          {
            id: "implicit-ex4",
            question: <p>Show that <InlineMath math="(2, 8)" /> is a stationary point on the curve <InlineMath math="x^2 + y^2 - 4x - 6y = 12" />, and determine its nature.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Check the point lies on the curve:</p>
                <BlockMath math="2^2 + 8^2 - 4(2) - 6(8) = 4 + 64 - 8 - 48 = 12 \ \checkmark" />
                <p><strong>Step 2:</strong> Differentiate implicitly and make <InlineMath math="\frac{dy}{dx}" /> the subject:</p>
                <BlockMath math="2x + 2y\frac{dy}{dx} - 4 - 6\frac{dy}{dx} = 0 \implies \frac{dy}{dx}\bigl(2y - 6\bigr) = 4 - 2x" />
                <BlockMath math="\frac{dy}{dx} = \frac{2 - x}{y - 3}" />
                <p><strong>Step 3:</strong> Substitute <InlineMath math="(2,8)" />. The numerator vanishes, so the point is stationary:</p>
                <BlockMath math="\frac{dy}{dx} = \frac{2 - 2}{8 - 3} = \frac{0}{5} = 0 \ \checkmark" />
                <p><strong>Step 4:</strong> For the nature, differentiate again. Writing <InlineMath math="p = \frac{dy}{dx}" />, the rearranged equation is <InlineMath math="p(y - 3) = 2 - x" />, so by the product rule:</p>
                <BlockMath math="\frac{dp}{dx}\bigl(y - 3\bigr) + p \cdot p = -1" />
                <p><strong>Step 5:</strong> Substitute <InlineMath math="y = 8" /> and <InlineMath math="p = 0" />, which removes the <InlineMath math="p^2" /> term:</p>
                <BlockMath math="\frac{dp}{dx}\bigl(8 - 3\bigr) + 0 = -1 \implies 5\frac{d^2y}{dx^2} = -1 \implies \frac{d^2y}{dx^2} = -\frac{1}{5}" />
                <p><strong>Step 6:</strong> Since <InlineMath math="\frac{d^2y}{dx^2} < 0" />, the point <InlineMath math="(2,8)" /> is a <strong>maximum</strong> turning point.</p>
                <p><strong>Sense check:</strong> completing the square gives <InlineMath math="(x-2)^2 + (y-3)^2 = 25" /> — a circle of centre <InlineMath math="(2,3)" /> and radius <InlineMath math="5" />. The point <InlineMath math="(2,8)" /> is the very top of that circle, so a maximum is exactly what we should expect.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "logarithmic-differentiation",
        title: "6. Logarithmic Differentiation",
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
          },
          {
            id: "log-diff-ex3",
            question: <p>Show that if <InlineMath math="y = a^x" />, where <InlineMath math="a" /> is a positive constant, then <InlineMath math="\dfrac{dy}{dx} = a^x \ln a" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The variable is in the index, so take natural logs of both sides and use <InlineMath math="\ln(a^x) = x\ln a" />:</p>
                <BlockMath math="\ln y = x \ln a" />
                <p><strong>Step 2:</strong> Differentiate implicitly. Note that <InlineMath math="\ln a" /> is a <em>constant</em>, so the right-hand side differentiates to just <InlineMath math="\ln a" />:</p>
                <BlockMath math="\frac{1}{y}\frac{dy}{dx} = \ln a" />
                <p><strong>Step 3:</strong> Multiply through by <InlineMath math="y" /> and substitute <InlineMath math="y = a^x" />:</p>
                <BlockMath math="\frac{dy}{dx} = y\ln a = a^x \ln a" />
                <p>This is a standard result worth remembering — and it confirms why <InlineMath math="e^x" /> is special: when <InlineMath math="a = e" />, <InlineMath math="\ln e = 1" /> and the derivative is <InlineMath math="e^x" /> itself.</p>
              </div>
            )
          },
          {
            id: "log-diff-ex4",
            question: <p>Differentiate <InlineMath math="y = (x^2+1)^x" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Both the base and the index involve <InlineMath math="x" />, so neither the power rule nor the result above applies. Take logs:</p>
                <BlockMath math="\ln y = x\ln(x^2+1)" />
                <p><strong>Step 2:</strong> Differentiate implicitly. The right-hand side is a product, and <InlineMath math="\ln(x^2+1)" /> needs the chain rule:</p>
                <BlockMath math="\frac{1}{y}\frac{dy}{dx} = \ln(x^2+1) + x \times \frac{2x}{x^2+1}" />
                <p><strong>Step 3:</strong> Tidy the second term:</p>
                <BlockMath math="\frac{1}{y}\frac{dy}{dx} = \ln(x^2+1) + \frac{2x^2}{x^2+1}" />
                <p><strong>Step 4:</strong> Multiply by <InlineMath math="y" /> and substitute it back:</p>
                <BlockMath math="\frac{dy}{dx} = (x^2+1)^x\left(\ln(x^2+1) + \frac{2x^2}{x^2+1}\right)" />
              </div>
            )
          }
        ]
      },
      {
        id: "parametric-differentiation",
        title: "7. Parametric Differentiation",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>When a curve is given by <InlineMath math="x" /> and <InlineMath math="y" /> in terms of a <strong>parameter</strong> <InlineMath math="t" />, each value of <InlineMath math="t" /> produces one point on the curve. Eliminating the parameter between the two equations gives the <strong>constraint equation</strong> — the ordinary relationship between <InlineMath math="x" /> and <InlineMath math="y" />. Several standard forms are worth recognising:</p>
            <BlockMath math="\begin{aligned} x = at^2,\ y = 2at &\ \longrightarrow\ y^2 = 4ax &&\text{parabola} \\ x = r\cos\theta,\ y = r\sin\theta &\ \longrightarrow\ x^2 + y^2 = r^2 &&\text{circle} \\ x = a\cos\theta,\ y = b\sin\theta &\ \longrightarrow\ \tfrac{x^2}{a^2} + \tfrac{y^2}{b^2} = 1 &&\text{ellipse} \\ x = a\sec\theta,\ y = b\tan\theta &\ \longrightarrow\ \tfrac{x^2}{a^2} - \tfrac{y^2}{b^2} = 1 &&\text{hyperbola} \\ x = ct,\ y = \tfrac{c}{t} &\ \longrightarrow\ xy = c^2 &&\text{rectangular hyperbola} \end{aligned}" />
            <p>Usually, though, we differentiate without eliminating anything. The gradient comes from the chain rule:</p>
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
          },
          {
            id: "parametric-ex3",
            question: <p>A curve has parametric equations <InlineMath math="x = 2\cos\theta" />, <InlineMath math="y = 5\sin\theta" />. Find its constraint equation and name the curve.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Rearrange each equation to isolate the trigonometric function:</p>
                <BlockMath math="\cos\theta = \frac{x}{2}, \qquad \sin\theta = \frac{y}{5}" />
                <p><strong>Step 2:</strong> Eliminate <InlineMath math="\theta" /> using the identity <InlineMath math="\cos^2\theta + \sin^2\theta = 1" />:</p>
                <BlockMath math="\left(\frac{x}{2}\right)^2 + \left(\frac{y}{5}\right)^2 = 1" />
                <p><strong>Step 3:</strong> Write it in standard form:</p>
                <BlockMath math="\frac{x^2}{4} + \frac{y^2}{25} = 1" />
                <p>This is an <strong>ellipse</strong>, centred on the origin, with semi-axes <InlineMath math="2" /> along <InlineMath math="x" /> and <InlineMath math="5" /> along <InlineMath math="y" />.</p>
              </div>
            )
          },
          {
            id: "parametric-ex4",
            question: <p>A curve is defined by <InlineMath math="x = 2t" />, <InlineMath math="y = t^2 - 1" />. Find the equation of the tangent at the point where <InlineMath math="t = 3" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Differentiate each equation with respect to <InlineMath math="t" /> and divide:</p>
                <BlockMath math="\frac{dx}{dt} = 2, \qquad \frac{dy}{dt} = 2t \qquad\implies\qquad \frac{dy}{dx} = \frac{2t}{2} = t" />
                <p><strong>Step 2:</strong> Evaluate the gradient at <InlineMath math="t = 3" />:</p>
                <BlockMath math="\left.\frac{dy}{dx}\right|_{t=3} = 3" />
                <p><strong>Step 3:</strong> Find the coordinates of the point by substituting <InlineMath math="t = 3" /> into the parametric equations:</p>
                <BlockMath math="x = 2(3) = 6, \qquad y = 3^2 - 1 = 8" />
                <p><strong>Step 4:</strong> Use <InlineMath math="y - b = m(x - a)" /> with <InlineMath math="m = 3" /> at <InlineMath math="(6, 8)" />:</p>
                <BlockMath math="y - 8 = 3(x - 6) \implies y = 3x - 10" />
              </div>
            )
          }
        ]
      },
      {
        id: "motion-in-a-plane",
        title: "8. Motion in a Plane",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>Parametric equations describe motion naturally when the parameter is <strong>time</strong>. If a point <InlineMath math="P" /> moves in the <InlineMath math="x" />–<InlineMath math="y" /> plane with position given by <InlineMath math="x = f(t)" /> and <InlineMath math="y = g(t)" />, then each derivative is a velocity in one direction:</p>
            <BlockMath math="\frac{dx}{dt} = \text{velocity in the } x \text{ direction}, \qquad \frac{dy}{dt} = \text{velocity in the } y \text{ direction}" />
            <p>These are the two components of the velocity. The <strong>speed</strong> is the magnitude of that velocity, found by Pythagoras:</p>
            <BlockMath math="|v| = \sqrt{\left(\frac{dx}{dt}\right)^2 + \left(\frac{dy}{dt}\right)^2}" />
            <p>This gives the instantaneous speed of the particle at time <InlineMath math="t" />. Note that speed is always positive, even when one or both components are negative.</p>
            <p><strong>The Golden Rule:</strong> most questions do not give you <InlineMath math="t" /> directly — they describe an <em>event</em> (&ldquo;when it hits the ground&rdquo;, &ldquo;when it reaches the target&rdquo;). Translate that event into an equation, solve it for <InlineMath math="t" /> first, and only then substitute into the derivatives.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Rejecting the wrong root:</strong> &ldquo;hits the ground&rdquo; usually gives <InlineMath math="t = 0" /> as well as the answer — but <InlineMath math="t=0" /> is the moment of launch, so discard it.</li>
                <li><strong>Squaring away the sign:</strong> a downward velocity is negative, but <InlineMath math="(-20)^2 = 400" />. Keep the sign while differentiating; it only disappears at the squaring stage.</li>
                <li><strong>Speed is not <InlineMath math="\frac{dy}{dx}" />:</strong> the gradient tells you the <em>direction</em> of travel; the speed needs both <InlineMath math="t" />-derivatives combined.</li>
                <li><strong>Units:</strong> if <InlineMath math="x" /> and <InlineMath math="y" /> are in metres and <InlineMath math="t" /> in seconds, the speed is in m/s — state it.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "motion-plane-ex1",
            question: <p>The position of a ball <InlineMath math="t" /> seconds after being struck is given by <InlineMath math="x = 12t" />, <InlineMath math="y = 20t - 5t^2" />, with distances in metres. Find the speed of the ball when it first hits the ground.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The ball is on the ground when <InlineMath math="y = 0" />:</p>
                <BlockMath math="20t - 5t^2 = 0 \implies 5t(4 - t) = 0 \implies t = 0 \ \text{ or } \ t = 4" />
                <p><strong>Step 2:</strong> <InlineMath math="t = 0" /> is the moment it was struck, so the ball lands at <InlineMath math="t = 4" />.</p>
                <p><strong>Step 3:</strong> Differentiate each coordinate with respect to <InlineMath math="t" />:</p>
                <BlockMath math="\frac{dx}{dt} = 12, \qquad \frac{dy}{dt} = 20 - 10t" />
                <p><strong>Step 4:</strong> Substitute <InlineMath math="t = 4" />. The vertical component is negative because the ball is falling:</p>
                <BlockMath math="\frac{dx}{dt} = 12, \qquad \frac{dy}{dt} = 20 - 40 = -20" />
                <p><strong>Step 5:</strong> Combine using Pythagoras:</p>
                <BlockMath math="|v| = \sqrt{12^2 + (-20)^2} = \sqrt{144 + 400} = \sqrt{544} = 4\sqrt{34} \approx 23.3\ \text{m/s}" />
              </div>
            )
          },
          {
            id: "motion-plane-ex2",
            question: <p>At time <InlineMath math="t" />, the position of a moving point is given by <InlineMath math="x = e^{2t}" />, <InlineMath math="y = e^{-t}" />. Find its speed when <InlineMath math="t = \ln 2" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Differentiate each coordinate, using the chain rule on both:</p>
                <BlockMath math="\frac{dx}{dt} = 2e^{2t}, \qquad \frac{dy}{dt} = -e^{-t}" />
                <p><strong>Step 2:</strong> Evaluate at <InlineMath math="t = \ln 2" />, using <InlineMath math="e^{2\ln 2} = e^{\ln 4} = 4" /> and <InlineMath math="e^{-\ln 2} = \frac{1}{2}" />:</p>
                <BlockMath math="\frac{dx}{dt} = 2 \times 4 = 8, \qquad \frac{dy}{dt} = -\frac{1}{2}" />
                <p><strong>Step 3:</strong> Combine the components:</p>
                <BlockMath math="|v| = \sqrt{8^2 + \left(-\tfrac{1}{2}\right)^2} = \sqrt{64 + \tfrac{1}{4}} = \sqrt{\tfrac{257}{4}} = \frac{\sqrt{257}}{2} \approx 8.02" />
              </div>
            )
          },
          {
            id: "motion-plane-ex3",
            question: <p>A particle moves so that its position at time <InlineMath math="t" /> is <InlineMath math="x = 5\cos t" />, <InlineMath math="y = 2\sin t" />. Show that its speed is <InlineMath math="\sqrt{4 + 21\sin^2 t}" />, and hence find its maximum and minimum speeds and the positions at which they occur.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Differentiate each coordinate:</p>
                <BlockMath math="\frac{dx}{dt} = -5\sin t, \qquad \frac{dy}{dt} = 2\cos t" />
                <p><strong>Step 2:</strong> Form the sum of the squares:</p>
                <BlockMath math="|v|^2 = 25\sin^2 t + 4\cos^2 t" />
                <p><strong>Step 3:</strong> Write everything in terms of <InlineMath math="\sin^2 t" /> using <InlineMath math="\cos^2 t = 1 - \sin^2 t" />:</p>
                <BlockMath math="|v|^2 = 25\sin^2 t + 4(1 - \sin^2 t) = 4 + 21\sin^2 t \implies |v| = \sqrt{4 + 21\sin^2 t}" />
                <p><strong>Step 4:</strong> Since <InlineMath math="0 \le \sin^2 t \le 1" />, the expression under the root runs from <InlineMath math="4" /> to <InlineMath math="25" />:</p>
                <BlockMath math="|v|_{\min} = \sqrt{4} = 2, \qquad |v|_{\max} = \sqrt{25} = 5" />
                <p><strong>Step 5:</strong> Identify the positions. The minimum occurs when <InlineMath math="\sin t = 0" />, so <InlineMath math="\cos t = \pm 1" /> and the particle is at <InlineMath math="(5, 0)" /> or <InlineMath math="(-5, 0)" />. The maximum occurs when <InlineMath math="\sin t = \pm 1" />, so <InlineMath math="\cos t = 0" /> and the particle is at <InlineMath math="(0, 2)" /> or <InlineMath math="(0, -2)" />.</p>
                <p>The path is an ellipse, and the particle travels fastest at the ends of the minor axis and slowest at the ends of the major axis.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "related-rates",
        title: "9. Related Rates of Change",
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
                <li><strong>Constant quantities differentiate to zero:</strong> when a question says an area or volume &ldquo;remains constant&rdquo;, that is the whole point — the derivative of the right-hand side is <InlineMath math="0" />, which is what lets you link the two rates.</li>
                <li><strong>Reading the sign:</strong> a negative rate means the quantity is <em>decreasing</em>. Say so in words; the sign alone is not the answer.</li>
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
          },
          {
            id: "related-rates-ex3",
            question: <p>A rectangle has sides <InlineMath math="x" /> cm and <InlineMath math="y" /> cm. Both are changing, but in such a way that the area stays constant at <InlineMath math="48" /> cm². If <InlineMath math="x" /> is increasing at <InlineMath math="0.25" /> cm/s, find the rate at which <InlineMath math="y" /> is changing when <InlineMath math="x = 4" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write the relationship. The area is fixed, so the right-hand side is a constant:</p>
                <BlockMath math="xy = 48" />
                <p><strong>Step 2:</strong> Differentiate with respect to <InlineMath math="t" />, using the product rule on the left. A constant differentiates to zero:</p>
                <BlockMath math="y\frac{dx}{dt} + x\frac{dy}{dt} = 0" />
                <p><strong>Step 3:</strong> Find the value of <InlineMath math="y" /> at the instant in question:</p>
                <BlockMath math="x = 4 \implies y = \frac{48}{4} = 12" />
                <p><strong>Step 4:</strong> Substitute <InlineMath math="x=4" />, <InlineMath math="y=12" /> and <InlineMath math="\frac{dx}{dt} = 0.25" />:</p>
                <BlockMath math="12(0.25) + 4\frac{dy}{dt} = 0 \implies 3 + 4\frac{dy}{dt} = 0" />
                <p><strong>Step 5:</strong> Solve for the rate:</p>
                <BlockMath math="\frac{dy}{dt} = -\frac{3}{4} = -0.75 \ \text{cm/s}" />
                <p>The negative sign means <InlineMath math="y" /> is <em>decreasing</em>, at <InlineMath math="0.75" /> cm/s — which makes sense, since the area must stay fixed as <InlineMath math="x" /> grows.</p>
              </div>
            )
          },
          {
            id: "related-rates-ex4",
            question: <p>An open-topped cylindrical tank of radius <InlineMath math="r" /> and height <InlineMath math="h" /> has a fixed total surface area of <InlineMath math="27\pi" /> cm². Find an expression for <InlineMath math="\dfrac{dr}{dh}" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> With no lid, the surface area is one circular base plus the curved surface:</p>
                <BlockMath math="\pi r^2 + 2\pi rh = 27\pi" />
                <p><strong>Step 2:</strong> Divide through by <InlineMath math="\pi" /> to simplify before differentiating:</p>
                <BlockMath math="r^2 + 2rh = 27" />
                <p><strong>Step 3:</strong> Differentiate with respect to <InlineMath math="h" />, treating <InlineMath math="r" /> as a function of <InlineMath math="h" />. The <InlineMath math="2rh" /> term needs the product rule:</p>
                <BlockMath math="2r\frac{dr}{dh} + 2\left(r + h\frac{dr}{dh}\right) = 0" />
                <p><strong>Step 4:</strong> Gather the <InlineMath math="\frac{dr}{dh}" /> terms and factorise:</p>
                <BlockMath math="\frac{dr}{dh}\bigl(2r + 2h\bigr) = -2r" />
                <p><strong>Step 5:</strong> Divide, cancelling the factor of <InlineMath math="2" />:</p>
                <BlockMath math="\frac{dr}{dh} = -\frac{2r}{2r + 2h} = -\frac{r}{r + h}" />
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
            <p>Two further standard integrals come directly from reversing the inverse trigonometric derivatives. These appear on the formula sheet, but you must recognise <em>when</em> to reach for them:</p>
            <BlockMath math="\int \frac{1}{\sqrt{a^2 - x^2}}\,dx = \sin^{-1}\!\left(\frac{x}{a}\right) + c, \qquad \int \frac{1}{a^2 + x^2}\,dx = \frac{1}{a}\tan^{-1}\!\left(\frac{x}{a}\right) + c" />
            <p>The signal is the <em>shape</em> of the denominator: a square root of &ldquo;constant minus <InlineMath math="x^2" />&rdquo; points to <InlineMath math="\sin^{-1}" />, while &ldquo;constant plus <InlineMath math="x^2" />&rdquo; with no root points to <InlineMath math="\tan^{-1}" />. If the coefficient of <InlineMath math="x^2" /> is not <InlineMath math="1" />, factor it out first to reach the standard form.</p>
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
          },
          {
            id: "standard-integrals-ex4",
            question: <p>Find (a) <InlineMath math="\displaystyle\int \frac{1}{\sqrt{25 - x^2}}\,dx" /> and (b) <InlineMath math="\displaystyle\int \frac{1}{9 + 4x^2}\,dx" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1 (a):</strong> The denominator is a square root of &ldquo;constant minus <InlineMath math="x^2" />&rdquo;, so this is the <InlineMath math="\sin^{-1}" /> form with <InlineMath math="a^2 = 25" />, giving <InlineMath math="a = 5" />:</p>
                <BlockMath math="\int \frac{1}{\sqrt{25 - x^2}}\,dx = \sin^{-1}\!\left(\frac{x}{5}\right) + c" />
                <p><strong>Step 2 (b):</strong> Here the coefficient of <InlineMath math="x^2" /> is not <InlineMath math="1" />, so factor it out of the denominator first:</p>
                <BlockMath math="9 + 4x^2 = 4\left(\frac{9}{4} + x^2\right) \implies \int \frac{1}{9+4x^2}\,dx = \frac{1}{4}\int \frac{1}{\left(\frac{3}{2}\right)^2 + x^2}\,dx" />
                <p><strong>Step 3:</strong> Now apply the standard form with <InlineMath math="a = \dfrac{3}{2}" />:</p>
                <BlockMath math="= \frac{1}{4} \times \frac{1}{\frac{3}{2}}\tan^{-1}\!\left(\frac{x}{\frac{3}{2}}\right) + c = \frac{1}{4} \times \frac{2}{3}\tan^{-1}\!\left(\frac{2x}{3}\right) + c" />
                <p><strong>Step 4:</strong> Simplify the constant:</p>
                <BlockMath math="\int \frac{1}{9+4x^2}\,dx = \frac{1}{6}\tan^{-1}\!\left(\frac{2x}{3}\right) + c" />
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
          },
          {
            id: "by-parts-ex3",
            question: <p>Find <InlineMath math="\displaystyle\int x^2 e^{3x}\,dx" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Take <InlineMath math="u = x^2" /> so that differentiating reduces the power. With <InlineMath math="\frac{dv}{dx} = e^{3x}" />, we get <InlineMath math="v = \frac{1}{3}e^{3x}" />:</p>
                <BlockMath math="\int x^2 e^{3x}\,dx = \frac{1}{3}x^2e^{3x} - \frac{2}{3}\int x e^{3x}\,dx" />
                <p><strong>Step 2:</strong> The remaining integral still has a power of <InlineMath math="x" />, so apply integration by parts a <strong>second</strong> time, now with <InlineMath math="u = x" />:</p>
                <BlockMath math="\int x e^{3x}\,dx = \frac{1}{3}xe^{3x} - \frac{1}{3}\int e^{3x}\,dx = \frac{1}{3}xe^{3x} - \frac{1}{9}e^{3x}" />
                <p><strong>Step 3:</strong> Substitute this back into Step 1, taking care with the <InlineMath math="-\frac{2}{3}" /> multiplying both terms:</p>
                <BlockMath math="\int x^2 e^{3x}\,dx = \frac{1}{3}x^2e^{3x} - \frac{2}{3}\left(\frac{1}{3}xe^{3x} - \frac{1}{9}e^{3x}\right)" />
                <p><strong>Step 4:</strong> Expand and tidy:</p>
                <BlockMath math="= \frac{1}{3}x^2e^{3x} - \frac{2}{9}xe^{3x} + \frac{2}{27}e^{3x} + c" />
                <p>Each application of the rule drops the power of <InlineMath math="x" /> by one, so an <InlineMath math="x^n" /> term needs <InlineMath math="n" /> applications.</p>
              </div>
            )
          },
          {
            id: "by-parts-ex4",
            question: <p>Find <InlineMath math="\displaystyle\int e^{2x}\sin x\,dx" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Neither factor simplifies when differentiated, so parts will not terminate. Give the integral a name so we can treat it as an unknown:</p>
                <BlockMath math="I = \int e^{2x}\sin x\,dx" />
                <p><strong>Step 2:</strong> Apply parts with <InlineMath math="u = e^{2x}" /> and <InlineMath math="\frac{dv}{dx} = \sin x" />, so <InlineMath math="v = -\cos x" />:</p>
                <BlockMath math="I = -e^{2x}\cos x + 2\int e^{2x}\cos x\,dx" />
                <p><strong>Step 3:</strong> Apply parts again to the new integral, keeping <InlineMath math="u = e^{2x}" /> — switching now would simply undo the first step:</p>
                <BlockMath math="\int e^{2x}\cos x\,dx = e^{2x}\sin x - 2\int e^{2x}\sin x\,dx = e^{2x}\sin x - 2I" />
                <p><strong>Step 4:</strong> The original integral has reappeared. Substitute back:</p>
                <BlockMath math="I = -e^{2x}\cos x + 2\left(e^{2x}\sin x - 2I\right) = -e^{2x}\cos x + 2e^{2x}\sin x - 4I" />
                <p><strong>Step 5:</strong> Now solve for <InlineMath math="I" /> algebraically, gathering both <InlineMath math="I" /> terms on the left:</p>
                <BlockMath math="5I = e^{2x}\left(2\sin x - \cos x\right)" />
                <p><strong>Step 6:</strong> Divide, remembering the constant of integration only at the end:</p>
                <BlockMath math="I = \frac{1}{5}e^{2x}\left(2\sin x - \cos x\right) + c" />
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
            <p>Advanced Higher also asks for the area between a curve and the <strong><InlineMath math="y" />-axis</strong>. The whole picture simply turns on its side: strips are now horizontal, so we integrate <InlineMath math="x" /> with respect to <InlineMath math="y" />, between <InlineMath math="y" />-limits:</p>
            <BlockMath math="\text{Area} = \int_c^d x\,dy" />
            <p>To use it, rearrange the equation of the curve to give <InlineMath math="x" /> in terms of <InlineMath math="y" /> before integrating.</p>
            <p><strong>The Golden Rule:</strong> for the area between curves, find the intersection points first (they are the limits), then integrate &ldquo;upper minus lower&rdquo;. If the region is bounded by the <InlineMath math="y" />-axis rather than the <InlineMath math="x" />-axis, switch to <InlineMath math="\int x\,dy" /> and use <InlineMath math="y" />-limits throughout.</p>
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
          },
          {
            id: "areas-ex-yaxis",
            question: <p>Find the area enclosed by the curve <InlineMath math="y = x^2" /> (for <InlineMath math="x \ge 0" />), the <InlineMath math="y" />-axis, and the lines <InlineMath math="y = 1" /> and <InlineMath math="y = 4" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The region is bounded by the <InlineMath math="y" />-axis and given <InlineMath math="y" />-limits, so integrate with respect to <InlineMath math="y" />. Rearrange the curve to give <InlineMath math="x" /> in terms of <InlineMath math="y" />, taking the positive root since <InlineMath math="x \ge 0" />:</p>
                <BlockMath math="y = x^2 \implies x = \sqrt{y} = y^{1/2}" />
                <p><strong>Step 2:</strong> Set up the integral with the <InlineMath math="y" />-limits:</p>
                <BlockMath math="\text{Area} = \int_1^4 y^{1/2}\,dy = \left[\frac{2}{3}y^{3/2}\right]_1^4" />
                <p><strong>Step 3:</strong> Evaluate, noting <InlineMath math="4^{3/2} = 8" /> and <InlineMath math="1^{3/2} = 1" />:</p>
                <BlockMath math="= \frac{2}{3}(8) - \frac{2}{3}(1) = \frac{16}{3} - \frac{2}{3} = \frac{14}{3}" />
                <p>The area is <InlineMath math="\dfrac{14}{3}" /> square units.</p>
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
      },
      {
        id: "applications-of-des",
        title: "5. Applications & Modelling",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>Differential equations earn their keep in modelling. Exam questions rarely hand you the equation — they describe a situation in words and expect you to <strong>form</strong> it first. The key is that the phrase &ldquo;rate of change&rdquo; means a derivative with respect to time, and &ldquo;proportional to&rdquo; introduces a constant:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>&ldquo;the rate of increase of <InlineMath math="P" /> is proportional to <InlineMath math="P" />&rdquo; <InlineMath math="\implies \dfrac{dP}{dt} = kP" /></li>
              <li>&ldquo;the rate of decrease of <InlineMath math="N" /> is proportional to <InlineMath math="N" />&rdquo; <InlineMath math="\implies \dfrac{dN}{dt} = -kN" /></li>
              <li>&ldquo;the rate of cooling is proportional to the excess temperature above the surroundings <InlineMath math="\theta_0" />&rdquo; <InlineMath math="\implies \dfrac{d\theta}{dt} = -k(\theta - \theta_0)" /></li>
            </ul>
            <p>That last one is <strong>Newton's law of cooling</strong>. The substitution <InlineMath math="u = \theta - \theta_0" /> turns it into the same separable equation as the others.</p>
            <p>The workflow is always the same: form the equation, separate the variables and integrate, then use the given data to pin down the constants. There are usually <strong>two</strong> unknowns — the constant of integration and the constant of proportionality <InlineMath math="k" /> — so expect two pieces of information.</p>
            <p><strong>The Golden Rule:</strong> translate the words into an equation before doing any calculus, and count your unknowns against the data you have been given. If you have two unknowns and only one condition, you have mis-formed the equation.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Sign of <InlineMath math="k" />:</strong> for decay or cooling, write the minus sign into the equation and keep <InlineMath math="k" /> positive. Doing both — a minus sign <em>and</em> a negative <InlineMath math="k" /> — reverses the model.</li>
                <li><strong>Using conditions in the wrong order:</strong> the initial condition (at <InlineMath math="t=0" />) gives the constant of integration most easily, because the exponential term becomes <InlineMath math="1" />. Find that first, then use the second condition for <InlineMath math="k" />.</li>
                <li><strong>Leaving the answer in log form:</strong> convert <InlineMath math="\ln P = kt + C" /> to <InlineMath math="P = Ae^{kt}" /> before substituting — it is far less error-prone.</li>
                <li><strong>Forgetting the surrounding temperature:</strong> in a cooling problem the variable that decays exponentially is the <em>excess</em> <InlineMath math="\theta - \theta_0" />, not <InlineMath math="\theta" /> itself. Add <InlineMath math="\theta_0" /> back at the end.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "de-applications-ex1",
            question: <p>A population grows at a rate proportional to its current size. Initially it is <InlineMath math="500" />, and after 3 hours it has reached <InlineMath math="2000" />. Find the population after 5 hours.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Translate the description into a differential equation:</p>
                <BlockMath math="\frac{dP}{dt} = kP" />
                <p><strong>Step 2:</strong> Separate the variables and integrate:</p>
                <BlockMath math="\int \frac{1}{P}\,dP = \int k\,dt \implies \ln P = kt + C" />
                <p><strong>Step 3:</strong> Convert to exponential form immediately, writing <InlineMath math="A = e^{C}" />:</p>
                <BlockMath math="P = Ae^{kt}" />
                <p><strong>Step 4:</strong> Use the initial condition <InlineMath math="P = 500" /> when <InlineMath math="t = 0" />. Since <InlineMath math="e^0 = 1" />, this gives <InlineMath math="A" /> at once:</p>
                <BlockMath math="500 = A \implies P = 500e^{kt}" />
                <p><strong>Step 5:</strong> Use the second condition, <InlineMath math="P = 2000" /> when <InlineMath math="t = 3" />, to find <InlineMath math="k" />:</p>
                <BlockMath math="2000 = 500e^{3k} \implies e^{3k} = 4 \implies k = \frac{\ln 4}{3}" />
                <p><strong>Step 6:</strong> Evaluate at <InlineMath math="t = 5" />:</p>
                <BlockMath math="P = 500e^{5k} = 500 \times 4^{5/3} = 500 \times 10.079 \approx 5040" />
              </div>
            )
          },
          {
            id: "de-applications-ex2",
            question: <p>A body at <InlineMath math="90^\circ\text{C}" /> is left to cool in a room kept at <InlineMath math="20^\circ\text{C}" />. After 10 minutes its temperature is <InlineMath math="60^\circ\text{C}" />. Using Newton's law of cooling, find its temperature after 25 minutes.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Newton's law of cooling gives, with room temperature <InlineMath math="20" />:</p>
                <BlockMath math="\frac{d\theta}{dt} = -k(\theta - 20)" />
                <p><strong>Step 2:</strong> Substitute <InlineMath math="u = \theta - 20" />. Since <InlineMath math="20" /> is constant, <InlineMath math="\frac{du}{dt} = \frac{d\theta}{dt}" />, so the equation becomes separable in <InlineMath math="u" />:</p>
                <BlockMath math="\frac{du}{dt} = -ku \implies u = Ae^{-kt}" />
                <p><strong>Step 3:</strong> At <InlineMath math="t = 0" /> the temperature is <InlineMath math="90" />, so the excess is <InlineMath math="u = 70" />:</p>
                <BlockMath math="A = 70 \implies u = 70e^{-kt}" />
                <p><strong>Step 4:</strong> At <InlineMath math="t = 10" /> the temperature is <InlineMath math="60" />, so the excess is <InlineMath math="40" />:</p>
                <BlockMath math="40 = 70e^{-10k} \implies e^{-10k} = \frac{4}{7} \implies k = \frac{1}{10}\ln\!\left(\frac{7}{4}\right) = 0.05596" />
                <p><strong>Step 5:</strong> Find the excess at <InlineMath math="t = 25" />:</p>
                <BlockMath math="u = 70e^{-25(0.05596)} = 70e^{-1.399} = 70 \times 0.2468 = 17.28" />
                <p><strong>Step 6:</strong> Add the room temperature back to get the actual temperature:</p>
                <BlockMath math="\theta = 20 + 17.28 = 37.3^\circ\text{C} \ \text{(1 d.p.)}" />
              </div>
            )
          },
          {
            id: "de-applications-ex3",
            question: <p>A tank leaks so that the rate of decrease of its volume is proportional to the square root of the volume remaining. Initially it holds <InlineMath math="100" /> litres, and after 5 minutes it holds <InlineMath math="64" /> litres. Find the volume after 10 minutes.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> The rate is <em>decreasing</em> and proportional to <InlineMath math="\sqrt{V}" />, so:</p>
                <BlockMath math="\frac{dV}{dt} = -k\sqrt{V}" />
                <p><strong>Step 2:</strong> Separate the variables, writing the left side with a negative index:</p>
                <BlockMath math="\int V^{-1/2}\,dV = \int -k\,dt \implies 2V^{1/2} = -kt + C" />
                <p><strong>Step 3:</strong> Apply the initial condition <InlineMath math="V = 100" /> at <InlineMath math="t = 0" />:</p>
                <BlockMath math="2\sqrt{100} = C \implies C = 20" />
                <p><strong>Step 4:</strong> Apply the second condition, <InlineMath math="V = 64" /> at <InlineMath math="t = 5" />, to find <InlineMath math="k" />:</p>
                <BlockMath math="2\sqrt{64} = -5k + 20 \implies 16 = -5k + 20 \implies k = 0.8" />
                <p><strong>Step 5:</strong> The model is therefore <InlineMath math="2\sqrt{V} = 20 - 0.8t" />. Substitute <InlineMath math="t = 10" />:</p>
                <BlockMath math="2\sqrt{V} = 20 - 8 = 12 \implies \sqrt{V} = 6 \implies V = 36" />
                <p>The tank holds <strong>36 litres</strong> after 10 minutes.</p>
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
            <p>Angles are measured through the normals. For two planes with normals <InlineMath math="\mathbf{n}_1" /> and <InlineMath math="\mathbf{n}_2" />, the angle between the planes equals the angle between the normals:</p>
            <BlockMath math="\cos\theta = \frac{|\mathbf{n}_1 \cdot \mathbf{n}_2|}{|\mathbf{n}_1||\mathbf{n}_2|}" />
            <p>The angle between a <strong>line and a plane</strong> is the one case that behaves differently. The line's direction <InlineMath math="\mathbf{d}" /> makes some angle with the normal, but the plane itself lies at <InlineMath math="90^\circ" /> to that normal — so the angle we want is the <em>complement</em>. Since <InlineMath math="\cos(90^\circ - \alpha) = \sin\alpha" />, the formula uses <strong>sine</strong>:</p>
            <BlockMath math="\sin\alpha = \frac{|\mathbf{d} \cdot \mathbf{n}|}{|\mathbf{d}||\mathbf{n}|}" />
            <p><strong>The Golden Rule:</strong> the coefficients <InlineMath math="(a, b, c)" /> in <InlineMath math="ax + by + cz = d" /> <em>are</em> the normal vector; find <InlineMath math="d" /> by substituting a point on the plane. For angles, use <InlineMath math="\cos" /> between two planes and <InlineMath math="\sin" /> between a line and a plane.</p>
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
          },
          {
            id: "planes-ex-angle",
            question: <p>Find the acute angle between the line <InlineMath math="\mathbf{r} = (1,-1,0) + t(2,1,2)" /> and the plane <InlineMath math="3x - y + 2z = 5" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Read off the direction of the line and the normal of the plane:</p>
                <BlockMath math="\mathbf{d} = (2,1,2), \qquad \mathbf{n} = (3,-1,2)" />
                <p><strong>Step 2:</strong> Compute the scalar product and the two magnitudes:</p>
                <BlockMath math="\mathbf{d}\cdot\mathbf{n} = 6 - 1 + 4 = 9" />
                <BlockMath math="|\mathbf{d}| = \sqrt{4+1+4} = 3, \qquad |\mathbf{n}| = \sqrt{9+1+4} = \sqrt{14}" />
                <p><strong>Step 3:</strong> This is a line and a plane, so use <strong>sine</strong> — not cosine. The modulus signs ensure the acute angle:</p>
                <BlockMath math="\sin\alpha = \frac{|\mathbf{d}\cdot\mathbf{n}|}{|\mathbf{d}||\mathbf{n}|} = \frac{9}{3\sqrt{14}} = \frac{3}{\sqrt{14}}" />
                <p><strong>Step 4:</strong> Take the inverse sine:</p>
                <BlockMath math="\alpha = \sin^{-1}\!\left(\frac{3}{\sqrt{14}}\right) = \sin^{-1}(0.8018) = 53.3^\circ \ \text{(1 d.p.)}" />
                <p>Had cosine been used by mistake, the answer would have been <InlineMath math="36.7^\circ" /> — the complement, and a very common lost mark.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "intersections-lines-planes",
        title: "4. Intersections of Lines and Planes",
        videoUrl: "",
        theory: (
          <div className="space-y-4">
            <p>In three dimensions, two lines need not meet even when they are not parallel — they can pass by one another at different heights. Such lines are called <strong>skew</strong>. Deciding which case applies is a standard exam question.</p>
            <p><strong>Two lines.</strong> Write both in parametric form using <em>different</em> parameters, say <InlineMath math="s" /> and <InlineMath math="t" />, and equate the components. That gives three equations in two unknowns. Solve any two of them, then <strong>substitute into the third to check</strong>:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Third equation satisfied → the lines <strong>intersect</strong>; substitute back for the point</li>
              <li>Third equation fails, directions not parallel → the lines are <strong>skew</strong></li>
              <li>Directions are scalar multiples → the lines are <strong>parallel</strong> (or identical)</li>
            </ul>
            <p><strong>A line and a plane.</strong> Substitute the parametric coordinates of the line into the plane equation. This gives a single equation in the parameter; solve it and substitute back to get the point.</p>
            <p><strong>Two planes.</strong> Non-parallel planes always meet in a <em>line</em>. Solve the two equations together, setting one variable equal to a parameter <InlineMath math="\lambda" />, and express the other two in terms of it.</p>
            <p><strong>Three planes.</strong> This is a <InlineMath math="3\times 3" /> system, so use Gaussian elimination. A unique solution means the planes meet at a single point; a row of zeros means they share a whole line; an inconsistent row means there is no common point at all.</p>
            <p><strong>The Golden Rule:</strong> when testing two lines, always use two different parameters, and <em>never</em> stop after solving two equations — the third equation is the entire test. Skipping it means you cannot distinguish intersecting lines from skew ones.</p>
            <div className="bg-slate-800 p-4 rounded-lg mt-4">
              <h4 className="text-white font-semibold mb-2">⚠️ Common Examiner Traps</h4>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Using <InlineMath math="t" /> for both lines:</strong> the two lines reach the meeting point at different parameter values, so a shared letter forces a false conclusion.</li>
                <li><strong>Skipping the third-equation check:</strong> two equations can always be solved for two unknowns — that alone proves nothing.</li>
                <li><strong>Confusing skew with parallel:</strong> skew lines have <em>non-parallel</em> directions but still never meet. Check the directions before naming the case.</li>
                <li><strong>Forgetting to find the point:</strong> if the lines do intersect, the question almost always wants the coordinates, not just the fact.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "intersections-ex1",
            question: <p>Show that the lines <InlineMath math="\mathbf{r} = (1,2,3) + s(1,1,2)" /> and <InlineMath math="\mathbf{r} = (1,5,6) + t(2,-1,1)" /> intersect, and find the point of intersection.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Equate the two position vectors component by component, using different parameters:</p>
                <BlockMath math="\begin{aligned} x: &\quad 1 + s = 1 + 2t \\ y: &\quad 2 + s = 5 - t \\ z: &\quad 3 + 2s = 6 + t \end{aligned}" />
                <p><strong>Step 2:</strong> Simplify the first two equations:</p>
                <BlockMath math="s = 2t, \qquad s = 3 - t" />
                <p><strong>Step 3:</strong> Solve them together:</p>
                <BlockMath math="2t = 3 - t \implies 3t = 3 \implies t = 1, \quad s = 2" />
                <p><strong>Step 4:</strong> Now test these values in the <em>third</em> equation — the step that decides the answer:</p>
                <BlockMath math="3 + 2(2) = 7 \qquad \text{and} \qquad 6 + 1 = 7 \ \checkmark" />
                <p>The third equation is satisfied, so the lines do intersect.</p>
                <p><strong>Step 5:</strong> Substitute <InlineMath math="s = 2" /> into the first line to find the point:</p>
                <BlockMath math="(1,2,3) + 2(1,1,2) = (3,\,4,\,7)" />
              </div>
            )
          },
          {
            id: "intersections-ex2",
            question: <p>Show that the lines <InlineMath math="\mathbf{r} = (1,2,3) + s(2,1,-1)" /> and <InlineMath math="\mathbf{r} = (2,0,1) + t(1,-1,2)" /> are skew.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> First check the directions. If <InlineMath math="(2,1,-1)" /> were a multiple of <InlineMath math="(1,-1,2)" />, the lines would be parallel — but doubling the first component gives <InlineMath math="2" />, while doubling the second gives <InlineMath math="-2 \neq 1" />. They are <strong>not</strong> parallel.</p>
                <p><strong>Step 2:</strong> Equate the components:</p>
                <BlockMath math="\begin{aligned} x: &\quad 1 + 2s = 2 + t \\ y: &\quad 2 + s = -t \\ z: &\quad 3 - s = 1 + 2t \end{aligned}" />
                <p><strong>Step 3:</strong> From the <InlineMath math="y" /> equation, <InlineMath math="t = -2 - s" />. Substitute into the <InlineMath math="x" /> equation:</p>
                <BlockMath math="1 + 2s = 2 + (-2 - s) = -s \implies 3s = -1 \implies s = -\tfrac{1}{3}, \quad t = -\tfrac{5}{3}" />
                <p><strong>Step 4:</strong> Test these values in the <InlineMath math="z" /> equation:</p>
                <BlockMath math="\text{LHS} = 3 - \left(-\tfrac{1}{3}\right) = \tfrac{10}{3}, \qquad \text{RHS} = 1 + 2\left(-\tfrac{5}{3}\right) = -\tfrac{7}{3}" />
                <p><strong>Step 5:</strong> Since <InlineMath math="\frac{10}{3} \neq -\frac{7}{3}" />, no pair of parameter values satisfies all three equations, so the lines never meet. As they are also not parallel, they are <strong>skew</strong>.</p>
              </div>
            )
          },
          {
            id: "intersections-ex3",
            question: <p>Find the point where the line <InlineMath math="\mathbf{r} = (1,0,2) + t(2,1,-1)" /> meets the plane <InlineMath math="3x + y - 2z = 5" />.</p>,
            solution: (
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Write the coordinates of a general point on the line in terms of <InlineMath math="t" />:</p>
                <BlockMath math="x = 1 + 2t, \qquad y = t, \qquad z = 2 - t" />
                <p><strong>Step 2:</strong> Substitute these into the equation of the plane:</p>
                <BlockMath math="3(1 + 2t) + t - 2(2 - t) = 5" />
                <p><strong>Step 3:</strong> Expand and collect terms in <InlineMath math="t" />:</p>
                <BlockMath math="3 + 6t + t - 4 + 2t = 5 \implies 9t - 1 = 5 \implies t = \frac{2}{3}" />
                <p><strong>Step 4:</strong> Substitute back into the line to get the coordinates:</p>
                <BlockMath math="\left(1 + \tfrac{4}{3},\ \tfrac{2}{3},\ 2 - \tfrac{2}{3}\right) = \left(\tfrac{7}{3},\ \tfrac{2}{3},\ \tfrac{4}{3}\right)" />
                <p><strong>Check:</strong> <InlineMath math="3\left(\tfrac{7}{3}\right) + \tfrac{2}{3} - 2\left(\tfrac{4}{3}\right) = 7 + \tfrac{2}{3} - \tfrac{8}{3} = 5" /> ✓</p>
              </div>
            )
          }
        ]
      }
    ]
  }
];
