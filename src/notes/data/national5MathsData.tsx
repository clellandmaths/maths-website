import { Section } from '@/src/notes/types';

import { InlineMath, BlockMath } from '@/src/notes/math-components';

export const national5MathsData: Section[] = [
  {
    id: "numeracy",
    title: "Numeracy",
    topics: [
      {
        id: "fractions",
        title: "Fractions",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>
              Candidates must be able to perform operations and combinations of operations on fractions, including mixed numbers (e.g., 3<sup className="text-xs">1</sup>/<sub className="text-xs">2</sub>, 1<sup className="text-xs">1</sup>/<sub className="text-xs">3</sub>, 1<sup className="text-xs">1</sup>/<sub className="text-xs">4</sub>).
            </p>
            <p>
              You must be able to add and subtract simple fractions (e.g., <sup className="text-xs">1</sup>/<sub className="text-xs">2</sub> + <sup className="text-xs">1</sup>/<sub className="text-xs">4</sub> and <sup className="text-xs">2</sup>/<sub className="text-xs">3</sub> &minus; <sup className="text-xs">1</sup>/<sub className="text-xs">3</sub>).
            </p>
            <p>
              A key skill is understanding the interrelationships between fractions, decimal fractions, and percentages to choose an efficient route to a solution.
            </p>
          </div>
        ),
        examples: [
          {
            id: "fractions-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Adding Mixed Numbers</strong></p>
                <p>Calculate 2 1/3 + 1 1/4.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Add the whole numbers: 2 + 1 = 3.</p>
                <p>Step 2: Find a common denominator for the fractions (12): 4/12 + 3/12 = 7/12.</p>
                <p><strong>Answer:</strong> 3 7/12.</p>
              </div>
            )
          },
          {
            id: "fractions-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Dividing Fractions</strong></p>
                <p>Calculate 3/4 &divide; 2/5.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Flip the second fraction and multiply (keep, change, flip): 3/4 &times; 5/2.</p>
                <p>Step 2: Multiply numerators and denominators: 15/8.</p>
                <p><strong>Answer:</strong> 1 7/8.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "percentages",
        title: "Percentages",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <div>
              <h4 className="text-white font-semibold">Appreciation/Depreciation</h4>
              <p>
                You need to calculate compound interest and depreciation over time. It is encouraged to use the most efficient strategy, such as calculating a compound percentage using a decimal multiplier and a power, rather than a year-by-year approach.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold">Reverse Percentages</h4>
              <p>
                You must know how to use reverse percentages to calculate an original quantity before a percentage was added or subtracted (e.g., calculating the price excluding VAT).
              </p>
            </div>
          </div>
        ),
        examples: [
          {
            id: "percentages-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Compound Appreciation</strong></p>
                <p>A house is valued at £150,000 and appreciates by 4% each year. What is its value after 3 years?</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Find the multiplier: 100% + 4% = 104% = 1.04.</p>
                <p>Step 2: Apply the power for 3 years: 150,000 &times; 1.04<sup>3</sup>.</p>
                <p><strong>Answer:</strong> £168,729.60.</p>
              </div>
            )
          },
          {
            id: "percentages-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Reverse Percentages</strong></p>
                <p>A jacket is on sale for £60 after a 20% discount. What was the original price?</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Equate the sale price to the percentage of the original: 80% = £60.</p>
                <p>Step 2: Find 1% by dividing by 80, then multiply by 100 to find the original (100%): (60 / 80) &times; 100.</p>
                <p><strong>Answer:</strong> £75.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "surds",
        title: "Surds",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>
              Surds involve simplifying expressions and rationalising the denominators of fractions.
            </p>
            <p>
              Exact values are an important method of communication in maths, science, and technology.
            </p>
            <p className="flex items-center space-x-2">
              <span>The key rules to memorise are:</span>
            </p>
            <div className="flex flex-wrap gap-6 items-center bg-slate-800 p-4 rounded-lg">
               <BlockMath math="\sqrt{ab} = \sqrt{a} \times \sqrt{b}" />
               <span>and</span>
               <BlockMath math="\sqrt{\frac{a}{b}} = \frac{\sqrt{a}}{\sqrt{b}}" />
            </div>
          </div>
        ),
        examples: [
          {
            id: "surds-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Simplifying a Surd</strong></p>
                <p>Simplify <InlineMath math="\sqrt{72}" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Find the largest square number that is a factor of 72 (which is 36).</p>
                <p>Step 2: Rewrite: <InlineMath math="\sqrt{36 \times 2} = \sqrt{36} \times \sqrt{2}" />.</p>
                <p><strong>Answer:</strong> <InlineMath math="6\sqrt{2}" />.</p>
              </div>
            )
          },
          {
            id: "surds-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Rationalising a Denominator</strong></p>
                <p>Rationalise <InlineMath math="\frac{5}{\sqrt{3}}" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Multiply the top and bottom by the surd in the denominator: <InlineMath math="\frac{5 \times \sqrt{3}}{\sqrt{3} \times \sqrt{3}}" />.</p>
                <p><strong>Answer:</strong> <InlineMath math="\frac{5\sqrt{3}}{3}" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "indices",
        title: "Indices",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>
              Candidates must be able to multiply and divide using positive and negative indices, including fractions.
            </p>
            <p>
              Key laws of indices to apply include:
            </p>
            <div className="bg-slate-800 p-4 rounded-lg space-y-4">
              <BlockMath math="(ab)^m = a^m b^m" />
              <BlockMath math="(a^m)^n = a^{mn}" />
              <BlockMath math="a^{m/n} = \sqrt[n]{a^m}" />
              <BlockMath math="x^{-a} = \frac{1}{x^a}" />
            </div>
            <p>
              Where possible, applying the laws in combination is desirable as preparation for Higher Maths.
            </p>
          </div>
        ),
        examples: [
          {
            id: "indices-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Multiplication with Indices</strong></p>
                <p>Simplify <InlineMath math="2a^3 \times 4a^{-1}" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Multiply the numbers: 2 &times; 4 = 8.</p>
                <p>Step 2: Add the powers (since the bases are the same): 3 + (&minus;1) = 2.</p>
                <p><strong>Answer:</strong> <InlineMath math="8a^2" />.</p>
              </div>
            )
          },
          {
            id: "indices-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Fractional Indices</strong></p>
                <p>Evaluate <InlineMath math="8^{2/3}" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Apply the rule <InlineMath math="a^{m/n} = \sqrt[n]{a^m}" />. The denominator (3) becomes the root, and the numerator (2) becomes the power: <InlineMath math="(\sqrt[3]{8})^2" />.</p>
                <p>Step 2: The cube root of 8 is 2. Then square it: <InlineMath math="2^2 = 4" />.</p>
                <p><strong>Answer:</strong> 4.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "scientific-notation",
        title: "Scientific notation",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>
              You must be able to perform calculations using scientific notation.
            </p>
            <p>
              It is heavily linked to science and technology to represent very large or very small numbers (e.g., ms<sup className="-mt-1">&minus;1</sup>).
            </p>
          </div>
        ),
        examples: [
          {
            id: "scientific-notation-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Percentage Calculation with Scientific Notation (From SQA Marking Instructions)</strong></p>
                <p>Calculate 6.1% of <InlineMath math="3.27 \times 10^{-22}" /> grams.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Convert the percentage to a decimal or fraction: 6.1 / 100.</p>
                <p>Step 2: Multiply by the standard form number: <InlineMath math="\frac{6.1}{100} \times 3.27 \times 10^{-22}" />.</p>
                <p><strong>Answer:</strong> <InlineMath math="1.99 \times 10^{-23}" /> grams.</p>
              </div>
            )
          },
          {
            id: "scientific-notation-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Division (Outside Knowledge)</strong></p>
                <p>Calculate <BlockMath math="\frac{8 \times 10^5}{2 \times 10^2}" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Divide the regular numbers: 8 &divide; 2 = 4.</p>
                <p>Step 2: Subtract the indices for the powers of 10: 10<sup>5</sup> &divide; 10<sup>2</sup> = 10<sup>3</sup>.</p>
                <p><strong>Answer:</strong> <InlineMath math="4 \times 10^3" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "rounding",
        title: "Rounding",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>
              You need to round answers to a specified number of significant figures or decimal places.
            </p>
            <p>
              You should consider the effects of rounding appropriately. For example, there is a precision limitation if you round an angle prematurely after calculating it using trigonometry, especially as distances increase.
            </p>
          </div>
        ),
        examples: [
          {
            id: "rounding-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Rounding to Significant Figures</strong></p>
                <p>Round 45,872 to 2 significant figures.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Identify the second significant figure (5).</p>
                <p>Step 2: Look at the next digit (8). Because it is 5 or more, round the 5 up to 6. Replace the remaining digits before the decimal with zeros.</p>
                <p><strong>Answer:</strong> 46,000.</p>
              </div>
            )
          },
          {
            id: "rounding-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Rounding to Decimal Places</strong></p>
                <p>Round 3.14159 to 3 decimal places.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Identify the third decimal place (1).</p>
                <p>Step 2: Look at the next digit (5). Because it is 5 or more, round up.</p>
                <p><strong>Answer:</strong> 3.142.</p>
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "algebra",
    title: "Algebra",
    topics: [
      {
        id: "expanding",
        title: "Expanding",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <div>
              <h4 className="text-white font-semibold">Expanding Brackets</h4>
              <p>You must be able to multiply out algebraic expressions by multiplying every term inside the bracket by the term(s) outside.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold">Double Brackets</h4>
              <p>To expand two brackets, you multiply each term in the first bracket by each term in the second bracket. This is often summarised using the acronym "FOIL" (First, Outside, Inside, Last).</p>
            </div>
            <p>
              Candidates must be able to expand expressions ranging from <InlineMath math="(ax+b)(cx+d)" /> to multiplying a linear bracket by a trinomial bracket, <InlineMath math="(ax+b)(cx^2+dx+e)" />.
            </p>
          </div>
        ),
        examples: [
          {
            id: "expanding-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Single Brackets</strong></p>
                <p>Expand and simplify <InlineMath math="3(4x - 2) - 2(x + 5)" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Expand both brackets: <InlineMath math="12x - 6 - 2x - 10" />.</p>
                <p>Step 2: Collect like terms: <InlineMath math="10x - 16" />.</p>
              </div>
            )
          },
          {
            id: "expanding-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Double Brackets</strong></p>
                <p>Expand <InlineMath math="(2y + 3)(y - 4)" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Multiply terms (FOIL): <InlineMath math="2y^2 - 8y + 3y - 12" />.</p>
                <p><strong>Answer:</strong> <InlineMath math="2y^2 - 5y - 12" />.</p>
              </div>
            )
          },
          {
            id: "expanding-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Linear by Trinomial</strong></p>
                <p>Expand <InlineMath math="(x - 2)(x^2 + 3x - 1)" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Multiply x by the trinomial, then &minus;2 by the trinomial: <InlineMath math="x^3 + 3x^2 - x - 2x^2 - 6x + 2" />.</p>
                <p><strong>Answer:</strong> <InlineMath math="x^3 + x^2 - 7x + 2" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "factorising",
        title: "Factorising",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>
              Factorising is the inverse process to expanding brackets.
            </p>
            <p>
              You must be able to identify and extract a common factor, factorise the difference of two squares (e.g., <InlineMath math="p^2x^2 - a^2" />), and factorise trinomials with both unitary and non-unitary <InlineMath math="x^2" /> coefficients.
            </p>
            <p>
              Some expressions will require a combination of these methods (e.g., extracting a common factor before factorising a difference of squares).
            </p>
          </div>
        ),
        examples: [
          {
            id: "factorising-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Difference of Two Squares</strong></p>
                <p>Factorise <InlineMath math="9m^2 - 25" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Identify the square roots of both terms: 3m and 5.</p>
                <p><strong>Answer:</strong> <InlineMath math="(3m - 5)(3m + 5)" />.</p>
              </div>
            )
          },
          {
            id: "factorising-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Trinomials (Non-unitary)</strong></p>
                <p>Factorise <InlineMath math="2x^2 - 7x + 3" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Find terms that multiply to <InlineMath math="2x^2" /> and 3, but cross-multiply and add to make &minus;7x.</p>
                <p><strong>Answer:</strong> <InlineMath math="(2x - 1)(x - 3)" />.</p>
              </div>
            )
          },
          {
            id: "factorising-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Combination Method</strong></p>
                <p>Factorise <InlineMath math="3y^2 - 27" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Extract the common factor of 3: <InlineMath math="3(y^2 - 9)" />.</p>
                <p>Step 2: Factorise the remaining difference of squares.</p>
                <p><strong>Answer:</strong> <InlineMath math="3(y - 3)(y + 3)" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "functions",
        title: "Functions",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>
              A function is a mathematical relationship often denoted using functional notation like <InlineMath math="f(x)" /> or <InlineMath math="g(x)" />.
            </p>
            <p>
              Functional notation serves as an important alternative mathematical language to Leibniz's notation (using y).
            </p>
            <p>
              You must be able to substitute values into a function to evaluate it, and determine a missing variable when a function's overall output is given.
            </p>
          </div>
        ),
        examples: [
          {
            id: "functions-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Evaluating a function</strong></p>
                <p>A function is defined by <InlineMath math="f(x) = x^2 - 5x" />. Calculate <InlineMath math="f(-3)" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Substitute &minus;3 in place of x: <InlineMath math="(-3)^2 - 5(-3)" />.</p>
                <p>Step 2: Calculate: <InlineMath math="9 + 15" />.</p>
                <p><strong>Answer:</strong> 24.</p>
              </div>
            )
          },
          {
            id: "functions-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Finding an unknown</strong></p>
                <p>A function is defined as <InlineMath math="g(t) = 4t + 7" />. Given that <InlineMath math="g(a) = 35" />, find a.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Set the expression equal to 35: <InlineMath math="4a + 7 = 35" />.</p>
                <p>Step 2: Solve for a: <InlineMath math="4a = 28 \rightarrow a = 7" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "straight-line",
        title: "Straight line",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <div>
              <h4 className="text-white font-semibold">Gradient</h4>
              <p>The gradient (m) defines the steepness of a line. The formula is <InlineMath math="m = \frac{y_2 - y_1}{x_2 - x_1}" />. Parallel lines always have equal gradients.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold">Equation of a Line</h4>
              <p>Any straight line can be described using the General Equation <InlineMath math="y = mx + c" /> (where c is the y-intercept). Alternatively, use <InlineMath math="y - b = m(x - a)" /> to find the equation when given the gradient and any point (a, b) on the line.</p>
            </div>
          </div>
        ),
        examples: [
          {
            id: "straight-line-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Finding the Gradient</strong></p>
                <p>Calculate the gradient of the line passing through (&minus;2, 4) and (4, 16).</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Apply the formula: <InlineMath math="m = \frac{16 - 4}{4 - (-2)}" />.</p>
                <p><strong>Answer:</strong> <InlineMath math="m = \frac{12}{6} = 2" />.</p>
              </div>
            )
          },
          {
            id: "straight-line-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Finding the Equation</strong></p>
                <p>Find the equation of the line passing through (3, 5) with a gradient of &minus;2.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Substitute into <InlineMath math="y - b = m(x - a)" />: <InlineMath math="y - 5 = -2(x - 3)" />.</p>
                <p>Step 2: Expand and rearrange: <InlineMath math="y - 5 = -2x + 6 \rightarrow y = -2x + 11" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "equations",
        title: "Equations",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>
              You must be able to solve linear equations, including those with rational/fractional coefficients and variables on both sides.
            </p>
            <p>
              The primary method involves using inverse operations to add or subtract from both sides. The goal is to isolate the variable (the letter) on one side and the numerical constants on the other.
            </p>
          </div>
        ),
        examples: [
          {
            id: "equations-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Variables on Both Sides</strong></p>
                <p>Solve <InlineMath math="5p - 4 = 2p + 11" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Subtract 2p from both sides, and add 4 to both sides: <InlineMath math="3p = 15" />.</p>
                <p>Step 2: Divide by 3. <strong>Answer:</strong> <InlineMath math="p = 5" />.</p>
              </div>
            )
          },
          {
            id: "equations-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Fractional Equations</strong></p>
                <p>Solve <InlineMath math="\frac{2x + 1}{3} = 5" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Multiply both sides by 3 to eliminate the fraction: <InlineMath math="2x + 1 = 15" />.</p>
                <p>Step 2: Subtract 1 and divide by 2: <InlineMath math="2x = 14" />. <strong>Answer:</strong> <InlineMath math="x = 7" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "inequalities",
        title: "Inequalities",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>
              Inequalities (or inequations) are solved using the exact same steps and inverse operations as linear equations, but with an inequality sign in the middle.
            </p>
            <p>
              When evaluating real-life situations, limitations should be considered (e.g., the maximum safe load for a concrete beam).
            </p>
            <p className="font-semibold text-white">
              Crucial Rule: Whenever you multiply or divide an inequality by a negative number, the direction of the inequality sign must flip.
            </p>
          </div>
        ),
        examples: [
          {
            id: "inequalities-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Solving a standard Inequation</strong></p>
                <p>Solve <InlineMath math="4x + 7 < 23" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Subtract 7 from both sides: <InlineMath math="4x < 16" />.</p>
                <p><strong>Answer:</strong> <InlineMath math="x < 4" />.</p>
              </div>
            )
          },
          {
            id: "inequalities-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Negative Variables</strong></p>
                <p>Solve <InlineMath math="12 - 3y \geq 6" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Subtract 12 from both sides: <InlineMath math="-3y \geq -6" />.</p>
                <p>Step 2: Divide by &minus;3, remembering to flip the inequality sign. <strong>Answer:</strong> <InlineMath math="y \leq 2" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "algebraic-fractions",
        title: "Algebraic fractions",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <div>
              <h4 className="text-white font-semibold">Simplifying</h4>
              <p>You can only simplify an algebraic fraction if there is a common factor or identical bracket on the top and bottom. You cannot cancel individual terms inside brackets; you must fully factorise first.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold">Four Operations</h4>
              <p>You must be able to add, subtract, multiply, and divide algebraic fractions, expressing them in their simplest form.</p>
            </div>
          </div>
        ),
        examples: [
          {
            id: "algebraic-fractions-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Simplifying</strong></p>
                <p>Simplify <BlockMath math="\frac{(x - 4)(x + 2)}{x^2 - 16}" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Factorise the top using the difference of two squares: <InlineMath math="\frac{(x - 4)(x + 2)}{(x - 4)(x + 4)}" />.</p>
                <p>Step 2: Cancel the identical <InlineMath math="(x - 4)" /> brackets. <strong>Answer:</strong> <InlineMath math="\frac{x + 2}{x + 4}" />.</p>
              </div>
            )
          },
          {
            id: "algebraic-fractions-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Adding</strong></p>
                <p>Express <BlockMath math="\frac{a}{3} + \frac{b}{4}" /> as a single fraction.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Find a common denominator (ab) and scale the numerators: <InlineMath math="\frac{4a}{12} + \frac{3b}{12}" />.</p>
                <p><strong>Answer:</strong> <InlineMath math="\frac{4a + 3b}{12}" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "change-of-subject",
        title: "Change of subject",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>
              Changing the subject involves algebraically rearranging a formula to isolate a different variable.
            </p>
            <p>
              This applies to linear formulas, as well as those involving simple squares or square roots.
            </p>
            <p>
              You are expected to apply this to real-life contexts using formulae from science, health, and finance (e.g., <InlineMath math="E = \frac{1}{2}mv^2" /> or calculating the radius of a sphere given its volume).
            </p>
          </div>
        ),
        examples: [
          {
            id: "change-subject-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Linear Formula</strong></p>
                <p>Change the subject of <InlineMath math="P = 2L + 2B" /> to L.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Subtract 2B from both sides: <InlineMath math="P - 2B = 2L" />.</p>
                <p>Step 2: Divide both sides by 2. <strong>Answer:</strong> <InlineMath math="L = \frac{P - 2B}{2}" />.</p>
              </div>
            )
          },
          {
            id: "change-subject-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Using a root</strong></p>
                <p>Change the subject of <InlineMath math="A = \pi r^2" /> to r.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Divide by <InlineMath math="\pi" />: <InlineMath math="\frac{A}{\pi} = r^2" />.</p>
                <p>Step 2: Take the square root of both sides. <strong>Answer:</strong> <InlineMath math="r = \sqrt{\frac{A}{\pi}}" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "simultaneous-equations",
        title: "Simultaneous equations",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>
              You must be able to construct simultaneous equations from a written context and solve them algebraically or graphically.
            </p>
            <p>
              Contexts often include real-life situations such as comparing costs (e.g., hiring a car, mobile phone charges) or finding the exact intersection of moving objects.
            </p>
          </div>
        ),
        examples: [
          {
            id: "simultaneous-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Constructing and Solving</strong></p>
                <p>"4 apples and 2 bananas cost £2.40. 3 apples and 4 bananas cost £2.30." Find the cost of one apple (a) and one banana (b).</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Construct equations: <InlineMath math="4a + 2b = 240" /> and <InlineMath math="3a + 4b = 230" /> (working in pence).</p>
                <p>Step 2: Scale equations to eliminate b. Multiply the first by 2: <InlineMath math="8a + 4b = 480" />.</p>
                <p>Step 3: Subtract the second equation from the scaled first equation: <InlineMath math="(8a - 3a) = 480 - 230 \rightarrow 5a = 250 \rightarrow a = 50" />.</p>
                <p>Step 4: Substitute <InlineMath math="a = 50" /> back into an original equation: <InlineMath math="4(50) + 2b = 240 \rightarrow 200 + 2b = 240 \rightarrow 2b = 40 \rightarrow b = 20" />.</p>
                <p><strong>Answer:</strong> One apple costs £0.50, one banana costs £0.20.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "completing-the-square",
        title: "Completing the square",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>
              Completing the Square transforms a general quadratic <InlineMath math="y = ax^2 + bx + c" /> into the vertex form <InlineMath math="y = (x + p)^2 + q" />.
            </p>
            <p>
              It is a powerful technique because it works for all quadratics, even those that do not have real roots.
            </p>
            <p>
              Once in this form, you can immediately identify the exact coordinates of the parabola's turning point, which are given by <InlineMath math="(-p, q)" />.
            </p>
          </div>
        ),
        examples: [
          {
            id: "completing-square-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Completing the Square</strong></p>
                <p>Express <InlineMath math="x^2 + 8x + 5" /> in the form <InlineMath math="(x + p)^2 + q" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Halve the x coefficient (8 becomes 4) and place inside the squared bracket: <InlineMath math="(x + 4)^2" />.</p>
                <p>Step 2: Subtract the square of that number (16) and add the original constant (5): <InlineMath math="(x + 4)^2 - 16 + 5" />.</p>
                <p><strong>Answer:</strong> <InlineMath math="(x + 4)^2 - 11" />.</p>
              </div>
            )
          },
          {
            id: "completing-square-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Finding the Turning Point</strong></p>
                <p>State the turning point of <InlineMath math="y = x^2 - 6x + 10" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Complete the square: <InlineMath math="(x - 3)^2 - 9 + 10 = (x - 3)^2 + 1" />.</p>
                <p>Step 2: Extract coordinates <InlineMath math="(-p, q)" />. <strong>Answer:</strong> The turning point is (3, 1).</p>
              </div>
            )
          }
        ]
      },
      {
        id: "quadratics",
        title: "Quadratics",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <div>
              <h4 className="text-white font-semibold">Graphs</h4>
              <p>A quadratic function contains a squared term (<InlineMath math="x^2" />) and no higher powers. Its graph creates a shape known as a parabola. You must be able to identify the nature (minimum/maximum), the coordinates of the turning point, and the equation of the axis of symmetry.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold">Solving</h4>
              <p>To calculate the roots (x-intercepts), set the equation to zero. Try to solve by factorising first. If that isn't possible, use the Quadratic Formula: <BlockMath math="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" />.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold">The Discriminant</h4>
              <p>The expression <InlineMath math="b^2 - 4ac" /> is the discriminant. It dictates the nature of the roots:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><InlineMath math="b^2 - 4ac > 0" />: 2 real distinct roots.</li>
                <li><InlineMath math="b^2 - 4ac = 0" />: 1 repeated real root.</li>
                <li><InlineMath math="b^2 - 4ac < 0" />: No real roots.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "quadratics-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Factorising to Solve</strong></p>
                <p>Solve <InlineMath math="x^2 - 8x + 15 = 0" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Factorise the trinomial: <InlineMath math="(x - 3)(x - 5) = 0" />.</p>
                <p>Step 2: Set each bracket to zero. <strong>Answer:</strong> <InlineMath math="x = 3" /> or <InlineMath math="x = 5" />.</p>
              </div>
            )
          },
          {
            id: "quadratics-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Using the Discriminant</strong></p>
                <p>Determine the nature of the roots of <InlineMath math="2x^2 + 3x + 4 = 0" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Identify <InlineMath math="a = 2, b = 3, c = 4" /> and substitute into <InlineMath math="b^2 - 4ac" />: <InlineMath math="3^2 - 4(2)(4) = 9 - 32 = -23" />.</p>
                <p><strong>Answer:</strong> Since <InlineMath math="-23 < 0" />, there are no real roots.</p>
              </div>
            )
          },
          {
            id: "quadratics-ex3",
            question: (
              <div className="space-y-2">
                <p><strong>Using the Quadratic Formula</strong></p>
                <p>Solve <InlineMath math="x^2 + 5x - 2 = 0" /> to 1 d.p.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Identify <InlineMath math="a = 1, b = 5, c = -2" />.</p>
                <p>Step 2: Substitute into the formula: <BlockMath math="x = \frac{-5 \pm \sqrt{5^2 - 4(1)(-2)}}{2(1)} = \frac{-5 \pm \sqrt{25 + 8}}{2} = \frac{-5 \pm \sqrt{33}}{2}" />.</p>
                <p>Step 3: Calculate the two pathways: <InlineMath math="\frac{-5 + 5.74}{2}" /> and <InlineMath math="\frac{-5 - 5.74}{2}" />.</p>
                <p><strong>Answer:</strong> <InlineMath math="x = 0.4" /> or <InlineMath math="x = -5.4" />.</p>
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "geometry",
    title: "Geometry",
    topics: [
      {
        id: "gradient",
        title: "Gradient",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>
              The gradient (m) represents the steepness of a slope and is calculated using the formula <InlineMath math="m = \frac{y_2 - y_1}{x_2 - x_1}" />.
            </p>
            <p>
              Lines that are parallel have equal gradients.
            </p>
            <p>
              You must be able to recognise and interpret lines with a zero gradient (a perfectly horizontal line) and gradients that are undefined (a perfectly vertical line).
            </p>
          </div>
        ),
        examples: [
          {
            id: "gradient-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Calculating Gradient</strong></p>
                <p>Find the gradient of the straight line passing through the points A(2, &minus;5) and B(6, 11).</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Assign (x<sub className="text-xs">1</sub>, y<sub className="text-xs">1</sub>) to A and (x<sub className="text-xs">2</sub>, y<sub className="text-xs">2</sub>) to B.</p>
                <p>Step 2: Substitute into the formula: <InlineMath math="m = \frac{11 - (-5)}{6 - 2}" />.</p>
                <p>Step 3: Simplify: <InlineMath math="m = \frac{16}{4} = 4" />.</p>
                <p><strong>Answer:</strong> The gradient is 4.</p>
              </div>
            )
          },
          {
            id: "gradient-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Parallel Lines</strong></p>
                <p>Line L<sub className="text-xs">1</sub> passes through (0, 4) and (3, 10). Line L<sub className="text-xs">2</sub> passes through (&minus;1, 2) and (1, k). If L<sub className="text-xs">1</sub> and L<sub className="text-xs">2</sub> are parallel, find k.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Find the gradient of L<sub className="text-xs">1</sub>: <InlineMath math="m = \frac{10 - 4}{3 - 0} = 2" />.</p>
                <p>Step 2: Because they are parallel, L<sub className="text-xs">2</sub> also has a gradient of 2. Set up the equation for L<sub className="text-xs">2</sub>: <InlineMath math="\frac{k - 2}{1 - (-1)} = 2" />.</p>
                <p>Step 3: Solve for k: <InlineMath math="\frac{k - 2}{2} = 2 \rightarrow k - 2 = 4 \rightarrow k = 6" />.</p>
                <p><strong>Answer:</strong> k = 6.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "arcs-sectors",
        title: "Arcs & sectors",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>
              An arc is a fraction of the circumference, and a sector is a fraction of the circle's area.
            </p>
            <p>
              The formulae rely on the angle at the centre (x&deg;):
            </p>
            <div className="bg-slate-800 p-4 rounded-lg space-y-4">
              <BlockMath math="\text{Arc Length} = \frac{x}{360} \times \pi d" />
              <BlockMath math="\text{Sector Area} = \frac{x}{360} \times \pi r^2" />
            </div>
            <p>
              You must be able to calculate the length of an arc or the area of a sector, and also work backwards to find the angle at the centre or the radius when given the area/length.
            </p>
          </div>
        ),
        examples: [
          {
            id: "arcs-sectors-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Sector Area</strong></p>
                <p>Calculate the area of a sector with a radius of 8 cm and an angle of 45&deg;.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Substitute into the area formula: <InlineMath math="\text{Area} = \frac{45}{360} \times \pi \times 8^2" />.</p>
                <p>Step 2: Simplify the fraction (<InlineMath math="\frac{45}{360} = \frac{1}{8}" />) and multiply: <InlineMath math="\frac{1}{8} \times \pi \times 64" />.</p>
                <p><strong>Answer:</strong> <InlineMath math="8\pi" /> cm<sup className="text-xs">2</sup> (or approx. 25.13 cm<sup className="text-xs">2</sup>).</p>
              </div>
            )
          },
          {
            id: "arcs-sectors-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Working Backwards (Arc Length)</strong></p>
                <p>A sector has a radius of 10 cm and an arc length of 15 cm. Find the angle at the centre, x.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Set up the arc length equation (note d = 20): <InlineMath math="15 = \frac{x}{360} \times \pi \times 20" />.</p>
                <p>Step 2: Rearrange to solve for x: <InlineMath math="x = \frac{15 \times 360}{20\pi}" />.</p>
                <p><strong>Answer:</strong> x &approx; 85.9&deg;.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "volume",
        title: "Volume",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>
              You must be able to calculate the volume of standard solids:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Sphere (<InlineMath math="V = \frac{4}{3}\pi r^3" />)</li>
              <li>Cone (<InlineMath math="V = \frac{1}{3}\pi r^2 h" />)</li>
              <li>Pyramid (<InlineMath math="V = \frac{1}{3}Ah" />)</li>
              <li>Cylinder (<InlineMath math="V = \pi r^2 h" />)</li>
              <li>Prism (<InlineMath math="V = Ah" />)</li>
            </ul>
            <p>
              Complex problems will require calculating the volume of composite solids (shapes joined together) or simple fractional parts of solids (e.g., hemispheres).
            </p>
          </div>
        ),
        examples: [
          {
            id: "volume-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Volume of a Cone</strong></p>
                <p>A cone has a base radius of 6 cm and a height of 14 cm. Calculate its volume.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Substitute into the formula: <InlineMath math="V = \frac{1}{3} \times \pi \times 6^2 \times 14" />.</p>
                <p>Step 2: Calculate: <InlineMath math="\frac{1}{3} \times \pi \times 36 \times 14 = 12 \times 14 \times \pi" />.</p>
                <p><strong>Answer:</strong> <InlineMath math="168\pi" /> cm<sup className="text-xs">3</sup> (or approx. 527.79 cm<sup className="text-xs">3</sup>).</p>
              </div>
            )
          },
          {
            id: "volume-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Composite Solid (Hemisphere + Cylinder)</strong></p>
                <p>A silo is formed by a cylinder of radius 4 m and height 10 m, topped by a hemisphere of the same radius. Find the total volume.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Cylinder volume: <InlineMath math="V_1 = \pi \times 4^2 \times 10 = 160\pi" />.</p>
                <p>Step 2: Hemisphere volume: <InlineMath math="V_2 = \frac{1}{2} \times (\frac{4}{3}\pi \times 4^3) = \frac{1}{2} \times \frac{256\pi}{3} = \frac{128\pi}{3}" />.</p>
                <p>Step 3: Add them together: <InlineMath math="160\pi + 42.67\pi" />.</p>
                <p><strong>Answer:</strong> 202.67<InlineMath math="\pi" /> m<sup className="text-xs">3</sup> (or approx. 636.70 m<sup className="text-xs">3</sup>).</p>
              </div>
            )
          }
        ]
      },
      {
        id: "pythagoras",
        title: "Pythagoras",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <div>
              <h4 className="text-white font-semibold">Pythagoras' Theorem</h4>
              <p>For any right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides (<InlineMath math="a^2 + b^2 = c^2" />).</p>
            </div>
            <div>
              <h4 className="text-white font-semibold">Converse of Pythagoras</h4>
              <p>This is used to prove whether a triangle is right-angled. You square the longest side, separately sum the squares of the two shorter sides, and compare the results.</p>
            </div>
            <p>
              You must be able to apply Pythagoras in complex situations, including 3D problems (like finding the space diagonal inside a cuboid).
            </p>
          </div>
        ),
        examples: [
          {
            id: "pythagoras-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>3D Pythagoras</strong></p>
                <p>A rectangular box has a length of 12 cm, width of 4 cm, and height of 3 cm. Calculate the length of the longest diagonal stick that can fit inside the box.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Find the diagonal of the base (2D): <InlineMath math="d_1 = \sqrt{12^2 + 4^2} = \sqrt{144 + 16} = \sqrt{160}" />.</p>
                <p>Step 2: Use this base diagonal and the height to find the 3D diagonal: <InlineMath math="d_2 = \sqrt{(\sqrt{160})^2 + 3^2} = \sqrt{160 + 9} = \sqrt{169}" />.</p>
                <p><strong>Answer:</strong> 13 cm.</p>
              </div>
            )
          },
          {
            id: "pythagoras-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Converse of Pythagoras</strong></p>
                <p>A triangular plot of land has side lengths of 7 m, 24 m, and 25 m. Is the triangle right-angled?</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Square the longest side: 25<sup className="text-xs">2</sup> = 625.</p>
                <p>Step 2: Sum the squares of the other two sides: 7<sup className="text-xs">2</sup> + 24<sup className="text-xs">2</sup> = 49 + 576 = 625.</p>
                <p>Step 3: Compare and state conclusion: Since 25<sup className="text-xs">2</sup> = 7<sup className="text-xs">2</sup> + 24<sup className="text-xs">2</sup>, by the Converse of Pythagoras, the triangle is right-angled.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "angles-in-shapes",
        title: "Angles in shapes",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <div>
              <h4 className="text-white font-semibold">Polygons</h4>
              <p>The exterior angles of any regular polygon sum to 360&deg;.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold">Circle Properties</h4>
              <p>You must use circle properties to find missing angles. Key rules:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>A tangent meets a radius at exactly 90&deg;.</li>
                <li>The perpendicular bisector of any chord always passes through the centre of the circle.</li>
                <li>Any triangle formed by a chord and the centre of the circle is isosceles.</li>
              </ul>
            </div>
          </div>
        ),
        examples: [
          {
            id: "angles-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Regular Polygons</strong></p>
                <p>Find the size of one interior angle of a regular decagon (10 sides).</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Find the exterior angle first: 360&deg; &divide; 10 = 36&deg;.</p>
                <p>Step 2: Interior and exterior angles lie on a straight line (180&deg;). Subtract the exterior from 180&deg;: 180&deg; &minus; 36&deg;.</p>
                <p><strong>Answer:</strong> 144&deg;.</p>
              </div>
            )
          },
          {
            id: "angles-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Circle Geometry (Tangent)</strong></p>
                <p>A tangent touches a circle at point P. The centre of the circle is O and has a radius of 5 cm. A point Q lies on the tangent such that the distance OQ is 13 cm. Find the length of the tangent PQ.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Recognise that the radius OP and tangent PQ meet at a right angle (90&deg;), making &Delta;OPQ a right-angled triangle.</p>
                <p>Step 2: Use Pythagoras to find PQ: PQ<sup className="text-xs">2</sup> = 13<sup className="text-xs">2</sup> &minus; 5<sup className="text-xs">2</sup> = 169 &minus; 25 = 144.</p>
                <p><strong>Answer:</strong> PQ = 12 cm.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "similarity",
        title: "Similarity",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>
              Similarity involves the interrelationship of scale across length, area, and volume.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Scale Factor (Length):</strong> <InlineMath math="\text{Scale Factor} = \frac{\text{Corresponding Small Side}}{\text{Large Side}}" /> (or vice versa depending on the direction of scaling).</li>
              <li><strong>Area Factor:</strong> The Area Factor is equal to the <InlineMath math="(\text{Scale Factor})^2" />.</li>
              <li><strong>Volume Factor:</strong> The Volume Factor is equal to the <InlineMath math="(\text{Scale Factor})^3" />.</li>
            </ul>
          </div>
        ),
        examples: [
          {
            id: "similarity-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Area Similarity</strong></p>
                <p>Two similar badges are made. The small badge has a width of 3 cm and an area of 12 cm<sup className="text-xs">2</sup>. The large badge has a width of 9 cm. Calculate the area of the large badge.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Find the length Scale Factor (SF): 9 / 3 = 3.</p>
                <p>Step 2: Find the Area Factor: SF<sup className="text-xs">2</sup> = 3<sup className="text-xs">2</sup> = 9.</p>
                <p>Step 3: Multiply the small area by the Area Factor: 12 &times; 9.</p>
                <p><strong>Answer:</strong> 108 cm<sup className="text-xs">2</sup>.</p>
              </div>
            )
          },
          {
            id: "similarity-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Volume Similarity</strong></p>
                <p>Two mathematically similar coffee cups exist. The large cup has a height of 15 cm and holds 500 ml. The small cup has a height of 12 cm. Calculate the volume of the small cup.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Find the length reduction SF: 12 / 15 = 0.8.</p>
                <p>Step 2: Find the Volume Factor: 0.8<sup className="text-xs">3</sup> = 0.512.</p>
                <p>Step 3: Multiply the large volume by the Volume Factor: 500 &times; 0.512.</p>
                <p><strong>Answer:</strong> 256 ml.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "vectors",
        title: "Vectors",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <div>
              <h4 className="text-white font-semibold">Component Form & Operations</h4>
              <p>Vectors can be added or subtracted using directed line segments (nose-to-tail) or by algebraically adding/subtracting their x, y, and z components.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold">Magnitude</h4>
              <p>The magnitude (length) of a vector, denoted as |a|, is calculated using Pythagoras' theorem. For a 3D vector <InlineMath math="\begin{pmatrix} x \ y \ z \end{pmatrix}" />, the magnitude is <InlineMath math="\sqrt{x^2 + y^2 + z^2}" />.</p>
            </div>
          </div>
        ),
        examples: [
          {
            id: "vectors-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Adding Vector Components</strong></p>
                <p>Given <InlineMath math="u = \begin{pmatrix} 4 \ -2 \ 7 \end{pmatrix}" /> and <InlineMath math="v = \begin{pmatrix} -1 \ 5 \ 3 \end{pmatrix}" />, calculate the resultant vector 2u + v.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Scalar multiply u by 2: <InlineMath math="\begin{pmatrix} 8 \ -4 \ 14 \end{pmatrix}" />.</p>
                <p>Step 2: Add the components to v: <InlineMath math="\begin{pmatrix} 8 + (-1) \ -4 + 5 \ 14 + 3 \end{pmatrix}" />.</p>
                <p><strong>Answer:</strong> <InlineMath math="\begin{pmatrix} 7 \ 1 \ 17 \end{pmatrix}" />.</p>
              </div>
            )
          },
          {
            id: "vectors-ex2",
            question: (
              <div className="space-y-2">
                <p><strong>Calculating Magnitude</strong></p>
                <p>Find the magnitude of vector <InlineMath math="p = \begin{pmatrix} 2 \ -3 \ 6 \end{pmatrix}" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Apply the magnitude formula: <InlineMath math="|p| = \sqrt{2^2 + (-3)^2 + 6^2}" />.</p>
                <p>Step 2: Square the numbers: <InlineMath math="\sqrt{4 + 9 + 36} = \sqrt{49}" />.</p>
                <p><strong>Answer:</strong> <InlineMath math="|p| = 7" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "3d-coordinates",
        title: "3D coordinates",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>
              You must be able to determine the x, y, and z coordinates of a specific point from a diagram representing a 3-dimensional object (like a cuboid or pyramid).
            </p>
          </div>
        ),
        examples: [
          {
            id: "3d-coord-ex1",
            question: (
              <div className="space-y-2">
                <p><strong>Identifying 3D Vertices</strong></p>
                <p>A rectangular room is modelled on a 3D coordinate system. The origin (0, 0, 0) represents the bottom-left corner of the floor. The x-axis represents the length (8 m), the y-axis represents the width (6 m), and the z-axis represents the height (3 m). State the coordinates of the ceiling corner diagonally opposite the origin.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Travel along the x-axis to the end of the length: x = 8.</p>
                <p>Step 2: Travel along the y-axis to the end of the width: y = 6.</p>
                <p>Step 3: Travel up the z-axis to the ceiling: z = 3.</p>
                <p><strong>Answer:</strong> (8, 6, 3).</p>
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "trigonometry",
    title: "Trigonometry",
    topics: [
      {
        id: "area-of-triangle",
        title: "Area of a Triangle",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>The area of any non-right-angled triangle can be calculated if you know the lengths of two sides and the size of the angle included between them.</p>
            <p>The formula provided on the exam sheet is:</p>
            <BlockMath math="A = \frac{1}{2}ab\sin C" />
            <p>Candidates may also be required to work backwards from a given area to calculate a missing angle or side.</p>
          </div>
        ),
        examples: [
          {
            id: "area-ex1",
            question: (
              <div className="space-y-2">
                <p>A triangle has sides of 8 cm and 12 cm with an included angle of 30°. Calculate its area.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Substitute into the formula:</p>
                <BlockMath math="A = \frac{1}{2} \times 8 \times 12 \times \sin(30^\circ)" />
                <p>Step 2: Since <InlineMath math="\sin(30^\circ) = 0.5" />:</p>
                <BlockMath math="A = 4 \times 12 \times 0.5 = 24\text{ cm}^2" />
              </div>
            )
          },
          {
            id: "area-ex2",
            question: (
              <div className="space-y-2">
                <p>A triangle with sides 10 m and 6 m has an area of 15 m². Find the included angle, <InlineMath math="C" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Set up the equation:</p>
                <BlockMath math="15 = \frac{1}{2} \times 10 \times 6 \times \sin C" />
                <p>Step 2: Simplify:</p>
                <BlockMath math="15 = 30 \sin C" />
                <p>Step 3: Divide by 30:</p>
                <BlockMath math="\sin C = 0.5" />
                <p>Answer: <InlineMath math="C = \sin^{-1}(0.5) = 30^\circ" />.</p>
              </div>
            )
          },
          {
            id: "area-ex3",
            question: (
              <div className="space-y-2">
                <p>A triangle has an area of 40 cm², and sides of 10 cm and 16 cm. Calculate the size of the obtuse included angle.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Set up the equation:</p>
                <BlockMath math="40 = \frac{1}{2} \times 10 \times 16 \times \sin C" />
                <p>Step 2: Simplify:</p>
                <BlockMath math="40 = 80 \sin C" />
                <p>Step 3: Solve for <InlineMath math="\sin C" />:</p>
                <BlockMath math="\sin C = 0.5" />
                <p>Since the angle is obtuse, use the CAST diagram (Quadrant 2):</p>
                <p>Answer: <InlineMath math="C = 180^\circ - 30^\circ = 150^\circ" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "sine-rule",
        title: "Sine Rule",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>The Sine Rule is used for non-right-angled triangles when you know one corresponding side-and-angle pair, plus one additional piece of information.</p>
            <p>The formula provided on the exam sheet is:</p>
            <BlockMath math="\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C}" />
          </div>
        ),
        examples: [
          {
            id: "sine-rule-ex1",
            question: (
              <div className="space-y-2">
                <p>In <InlineMath math="\Delta PQR" />, angle <InlineMath math="P = 45^\circ" />, angle <InlineMath math="Q = 60^\circ" />, and side <InlineMath math="p = 10\text{ cm}" />. Find side <InlineMath math="q" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Set up the ratio:</p>
                <BlockMath math="\frac{q}{\sin(60^\circ)} = \frac{10}{\sin(45^\circ)}" />
                <p>Step 2: Multiply both sides by <InlineMath math="\sin(60^\circ)" />:</p>
                <BlockMath math="q = \frac{10\sin(60^\circ)}{\sin(45^\circ)}" />
                <p>Answer: <InlineMath math="q \approx 12.2\text{ cm}" />.</p>
              </div>
            )
          },
          {
            id: "sine-rule-ex2",
            question: (
              <div className="space-y-2">
                <p>In <InlineMath math="\Delta XYZ" />, side <InlineMath math="x = 8\text{ cm}" />, side <InlineMath math="y = 12\text{ cm}" />, and angle <InlineMath math="X = 30^\circ" />. Find angle <InlineMath math="Y" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Set up the ratio with angles on top for easier solving:</p>
                <BlockMath math="\frac{\sin Y}{12} = \frac{\sin(30^\circ)}{8}" />
                <p>Step 2: Rearrange to isolate <InlineMath math="\sin Y" />:</p>
                <BlockMath math="\sin Y = \frac{12\sin(30^\circ)}{8} = \frac{6}{8} = 0.75" />
                <p>Answer: <InlineMath math="Y = \sin^{-1}(0.75) \approx 48.6^\circ" />.</p>
              </div>
            )
          },
          {
            id: "sine-rule-ex3",
            question: (
              <div className="space-y-2">
                <p>In <InlineMath math="\Delta ABC" />, angle <InlineMath math="A = 40^\circ" />, angle <InlineMath math="B = 80^\circ" />, and side <InlineMath math="c = 15\text{ m}" />. Find side <InlineMath math="a" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: First find angle <InlineMath math="C" />.</p>
                <BlockMath math="C = 180^\circ - (40^\circ + 80^\circ) = 60^\circ" />
                <p>Step 2: Set up the sine rule ratio:</p>
                <BlockMath math="\frac{a}{\sin(40^\circ)} = \frac{15}{\sin(60^\circ)}" />
                <p>Step 3: Solve for <InlineMath math="a" />:</p>
                <BlockMath math="a = \frac{15\sin(40^\circ)}{\sin(60^\circ)}" />
                <p>Answer: <InlineMath math="a \approx 11.1\text{ m}" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "cosine-rule",
        title: "Cosine Rule",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>The Cosine Rule is used to find a missing side when two sides and the included angle are known, or to find a missing angle when all three sides are known.</p>
            <p>Both forms of the formula are provided on the exam sheet:</p>
            <BlockMath math="a^2 = b^2 + c^2 - 2bc\cos A" />
            <BlockMath math="\cos A = \frac{b^2 + c^2 - a^2}{2bc}" />
          </div>
        ),
        examples: [
          {
            id: "cosine-rule-ex1",
            question: (
              <div className="space-y-2">
                <p>A triangle has sides <InlineMath math="b = 5\text{ cm}" /> and <InlineMath math="c = 7\text{ cm}" />, with included angle <InlineMath math="A = 60^\circ" />. Find side <InlineMath math="a" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Substitute into the formula:</p>
                <BlockMath math="a^2 = 5^2 + 7^2 - 2(5)(7)\cos(60^\circ)" />
                <p>Step 2: Calculate:</p>
                <BlockMath math="a^2 = 25 + 49 - 70(0.5) = 74 - 35 = 39" />
                <p>Answer: <InlineMath math="a = \sqrt{39} \approx 6.24\text{ cm}" />.</p>
              </div>
            )
          },
          {
            id: "cosine-rule-ex2",
            question: (
              <div className="space-y-2">
                <p>A triangle has sides <InlineMath math="a = 4\text{ cm}" />, <InlineMath math="b = 5\text{ cm}" />, and <InlineMath math="c = 6\text{ cm}" />. Calculate angle <InlineMath math="A" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Substitute into the rearranged formula:</p>
                <BlockMath math="\cos A = \frac{5^2 + 6^2 - 4^2}{2(5)(6)}" />
                <p>Step 2: Simplify:</p>
                <BlockMath math="\cos A = \frac{25 + 36 - 16}{60} = \frac{45}{60} = 0.75" />
                <p>Answer: <InlineMath math="A = \cos^{-1}(0.75) \approx 41.4^\circ" />.</p>
              </div>
            )
          },
          {
            id: "cosine-rule-ex3",
            question: (
              <div className="space-y-2">
                <p>A triangle has sides 8 m, 10 m, and 14 m. Find the size of the largest angle.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>The largest angle is always opposite the largest side (14 m).</p>
                <p>Step 1: Substitute into the formula for the angle opposite the 14 m side:</p>
                <BlockMath math="\cos \theta = \frac{8^2 + 10^2 - 14^2}{2(8)(10)}" />
                <p>Step 2: Simplify:</p>
                <BlockMath math="\cos \theta = \frac{64 + 100 - 196}{160} = \frac{-32}{160} = -0.2" />
                <p>Step 3: Solve for the angle:</p>
                <p>Answer: <InlineMath math="\theta = \cos^{-1}(-0.2) \approx 101.5^\circ" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "bearings",
        title: "Bearings",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Bearings use trigonometry (often the sine or cosine rules) to calculate a distance or direction.</p>
            <p>Bearings are always measured clockwise from North and are expressed as three digits (e.g., <InlineMath math="045^\circ" />).</p>
            <p>A common error candidates make is treating non-right-angled bearing scenarios as right-angled triangles, which leads to incorrectly using basic SOH-CAH-TOA or Pythagoras instead of the sine/cosine rules.</p>
          </div>
        ),
        examples: [
          {
            id: "bearings-ex1",
            question: (
              <div className="space-y-2">
                <p>Ship A leaves port on a bearing of <InlineMath math="040^\circ" /> for 10 km. Ship B leaves the same port on a bearing of <InlineMath math="100^\circ" /> for 15 km. Find the distance between the two ships.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Find the angle between their paths at the port:</p>
                <BlockMath math="100^\circ - 040^\circ = 60^\circ" />
                <p>Step 2: Use the Cosine Rule to find the distance (<InlineMath math="d" />) between them:</p>
                <BlockMath math="d^2 = 10^2 + 15^2 - 2(10)(15)\cos(60^\circ)" />
                <p>Step 3: Calculate:</p>
                <BlockMath math="d^2 = 100 + 225 - 300(0.5) = 325 - 150 = 175" />
                <p>Answer: <InlineMath math="d = \sqrt{175} \approx 13.2\text{ km}" />.</p>
              </div>
            )
          },
          {
            id: "bearings-ex2",
            question: (
              <div className="space-y-2">
                <p>A hiker walks 5 km on a bearing of <InlineMath math="060^\circ" />, then 8 km on a bearing of <InlineMath math="150^\circ" />. How far is the hiker from the starting point?</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Find the internal angle. The interior angle between the two paths is <InlineMath math="90^\circ" />.</p>
                <p>Step 2: Since it forms a right-angled triangle, use Pythagoras:</p>
                <BlockMath math="d^2 = 5^2 + 8^2 = 25 + 64 = 89" />
                <p>Answer: <InlineMath math="d = \sqrt{89} \approx 9.4\text{ km}" />.</p>
              </div>
            )
          },
          {
            id: "bearings-ex3",
            question: (
              <div className="space-y-2">
                <p>Town B is 20 miles from Town A on a bearing of <InlineMath math="050^\circ" />. Town C is 30 miles from Town A on a bearing of <InlineMath math="130^\circ" />. Find the distance between Town B and Town C.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Angle at A is <InlineMath math="130^\circ - 050^\circ = 80^\circ" />.</p>
                <p>Step 2: Find distance BC using Cosine Rule:</p>
                <BlockMath math="BC^2 = 20^2 + 30^2 - 2(20)(30)\cos(80^\circ)" />
                <BlockMath math="BC^2 \approx 400 + 900 - 1200(0.1736) \approx 1091.6" />
                <p>Answer: <InlineMath math="BC \approx 33.0\text{ miles}" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "trig-graphs",
        title: "Trig Graphs",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>You must be familiar with the basic shapes of <InlineMath math="y = \sin x" />, <InlineMath math="y = \cos x" />, and <InlineMath math="y = \tan x" /> graphs between <InlineMath math="0^\circ" /> and <InlineMath math="360^\circ" />.</p>
            <p>The General Equation of a Trigonometric Function is <InlineMath math="y = a\sin(bx + c) + d" />.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>a:</strong> Amplitude (half the distance between the maximum and minimum values).</li>
              <li><strong>b:</strong> Frequency (the number of complete waves within <InlineMath math="360^\circ" />).</li>
              <li><strong>c:</strong> Phase Angle (translation left or right).</li>
              <li><strong>d:</strong> Vertical Shift (translation up or down).</li>
            </ul>
          </div>
        ),
        examples: [
          {
            id: "trig-graphs-ex1",
            question: (
              <div className="space-y-2">
                <p>State the amplitude and vertical shift of the graph <InlineMath math="y = 3\cos x + 4" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>The amplitude (<InlineMath math="a" />) is 3. The graph is shifted up vertically by 4 units (<InlineMath math="d" />).</p>
              </div>
            )
          },
          {
            id: "trig-graphs-ex2",
            question: (
              <div className="space-y-2">
                <p>A sine graph has a maximum value of 5 and a minimum of -5. It completes two full cycles between <InlineMath math="0^\circ" /> and <InlineMath math="360^\circ" />. State its equation.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: The amplitude is 5 (<InlineMath math="a = 5" />).</p>
                <p>Step 2: The frequency is 2 (<InlineMath math="b = 2" />).</p>
                <p>Answer: <InlineMath math="y = 5\sin(2x)" />.</p>
              </div>
            )
          },
          {
            id: "trig-graphs-ex3",
            question: (
              <div className="space-y-2">
                <p>The graph of <InlineMath math="y = \cos(x - a)^\circ" /> is shifted to the right by <InlineMath math="45^\circ" />. What is the value of <InlineMath math="a" />?</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>A shift to the right means the phase angle is subtracted from <InlineMath math="x" />.</p>
                <p>Answer: <InlineMath math="a = 45" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "trig-equations",
        title: "Trig Equations",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>You must be able to solve trigonometric equations for a given domain (usually <InlineMath math="0^\circ \le x \le 360^\circ" />).</p>
            <p>There are usually two solutions. The CAST diagram (or the symmetry of trigonometric graphs) is used to find the related angles in different quadrants depending on whether the trig ratio is positive or negative.</p>
          </div>
        ),
        examples: [
          {
            id: "trig-eq-ex1",
            question: (
              <div className="space-y-2">
                <p>Solve <InlineMath math="2\sin x - 1 = 0" /> for <InlineMath math="0^\circ \le x \le 360^\circ" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Rearrange to isolate <InlineMath math="\sin x" />:</p>
                <BlockMath math="2\sin x = 1 \Rightarrow \sin x = 0.5" />
                <p>Step 2: Find the base angle (Quadrant 1):</p>
                <BlockMath math="x = \sin^{-1}(0.5) = 30^\circ" />
                <p>Step 3: Since sine is positive, the second solution is in Quadrant 2 (S): <InlineMath math="180^\circ - 30^\circ" />.</p>
                <p>Answer: <InlineMath math="x = 30^\circ" /> and <InlineMath math="x = 150^\circ" />.</p>
              </div>
            )
          },
          {
            id: "trig-eq-ex2",
            question: (
              <div className="space-y-2">
                <p>Solve <InlineMath math="5\cos x + 2 = 0" /> for <InlineMath math="0^\circ \le x \le 360^\circ" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Rearrange:</p>
                <BlockMath math="5\cos x = -2 \Rightarrow \cos x = -0.4" />
                <p>Step 2: Find the related base angle (ignoring the negative sign):</p>
                <BlockMath math="\cos^{-1}(0.4) \approx 66.4^\circ" />
                <p>Step 3: Since cosine is negative, the solutions lie in Quadrants 2 (S) and 3 (T): <InlineMath math="180^\circ - 66.4^\circ" /> and <InlineMath math="180^\circ + 66.4^\circ" />.</p>
                <p>Answer: <InlineMath math="x = 113.6^\circ" /> and <InlineMath math="x = 246.4^\circ" />.</p>
              </div>
            )
          },
          {
            id: "trig-eq-ex3",
            question: (
              <div className="space-y-2">
                <p>Solve <InlineMath math="\tan x - 3 = 0" /> for <InlineMath math="0^\circ \le x \le 360^\circ" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Rearrange:</p>
                <BlockMath math="\tan x = 3" />
                <p>Step 2: Find the base angle (Quadrant 1):</p>
                <BlockMath math="x = \tan^{-1}(3) \approx 71.6^\circ" />
                <p>Step 3: Since tangent is positive, the second solution is in Quadrant 3 (T): <InlineMath math="180^\circ + 71.6^\circ" />.</p>
                <p>Answer: <InlineMath math="x = 71.6^\circ" /> and <InlineMath math="x = 251.6^\circ" />.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "trig-identities",
        title: "Trig Identities",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Trigonometric identities are used to simplify expressions. While many exist, you are only required to memorise two for National 5:</p>
            <BlockMath math="\sin^2 x + \cos^2 x = 1" />
            <BlockMath math="\tan x = \frac{\sin x}{\cos x}" />
            <p><strong>Crucial Note:</strong> These formulas are not given on the exam formula sheet and must be memorised.</p>
          </div>
        ),
        examples: [
          {
            id: "trig-id-ex1",
            question: (
              <div className="space-y-2">
                <p>Simplify <InlineMath math="4\sin^2 x + 4\cos^2 x" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Extract the common factor of 4:</p>
                <BlockMath math="4(\sin^2 x + \cos^2 x)" />
                <p>Step 2: Substitute the identity <InlineMath math="\sin^2 x + \cos^2 x = 1" />:</p>
                <BlockMath math="4(1) = 4" />
                <p>Answer: 4.</p>
              </div>
            )
          },
          {
            id: "trig-id-ex2",
            question: (
              <div className="space-y-2">
                <p>Show that <InlineMath math="\cos x \tan x = \sin x" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Substitute the identity for <InlineMath math="\tan x" />:</p>
                <BlockMath math="\cos x \times \left(\frac{\sin x}{\cos x}\right)" />
                <p>Step 2: The <InlineMath math="\cos x" /> terms cancel out.</p>
                <p>Answer: <InlineMath math="\sin x" />.</p>
              </div>
            )
          },
          {
            id: "trig-id-ex3",
            question: (
              <div className="space-y-2">
                <p>Simplify <InlineMath math="\frac{1 - \cos^2 x}{\cos^2 x}" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Substitute the rearranged identity <InlineMath math="\sin^2 x = 1 - \cos^2 x" />:</p>
                <BlockMath math="\frac{\sin^2 x}{\cos^2 x}" />
                <p>Step 2: Substitute the identity <InlineMath math="\tan x = \frac{\sin x}{\cos x}" />:</p>
                <BlockMath math="\left(\frac{\sin x}{\cos x}\right)^2 = \tan^2 x" />
                <p>Answer: <InlineMath math="\tan^2 x" />.</p>
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    id: "statistics",
    title: "Statistics",
    topics: [
      {
        id: "comparing-data-sets",
        title: "Comparing Data Sets",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>Candidates must calculate averages (mean or median) and measures of spread (Standard Deviation or Interquartile Range) to analyse data.</p>
            <p><strong>Crucial Update:</strong> The National 5 syllabus now requires the calculation of the Interquartile Range (IQR) (<InlineMath math="Q_3 - Q_1" />), having removed the Semi-Interquartile Range (SIQR).</p>
            <p><strong>Standard Deviation (<InlineMath math="s" />):</strong> This measures how spread out data is around the mean. The formula is provided on the exam sheet in two forms:</p>
            <BlockMath math="s = \sqrt{\frac{\sum(x - \bar{x})^2}{n - 1}}" />
            <p>and</p>
            <BlockMath math="s = \sqrt{\frac{\sum x^2 - (\sum x)^2 / n}{n - 1}}" />
            <h4 className="text-white font-semibold mt-4">Comparing Data</h4>
            <p>When comparing two datasets, you must provide two distinct statements using standard SQA phraseology:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Compare the average (e.g., "On average, [Subject A] was higher/lower...").</li>
              <li>Compare the spread using standard deviation or IQR (e.g., "The data for [Subject A] was more/less consistent" or "more/less varied").</li>
            </ul>
            <p>You must not just list the numbers; the context and comparative words are required.</p>
          </div>
        ),
        examples: [
          {
            id: "comparing-ex1",
            question: (
              <div className="space-y-2">
                <p>Find the mean and standard deviation of the dataset: 2, 4, 6, 8, 10.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Calculate the mean (<InlineMath math="\bar{x}" />):</p>
                <BlockMath math="\bar{x} = \frac{2+4+6+8+10}{5} = \frac{30}{5} = 6" />
                <p>Step 2: Calculate <InlineMath math="(x - \bar{x})^2" /> for each value:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><InlineMath math="(2 - 6)^2 = 16" /></li>
                  <li><InlineMath math="(4 - 6)^2 = 4" /></li>
                  <li><InlineMath math="(6 - 6)^2 = 0" /></li>
                  <li><InlineMath math="(8 - 6)^2 = 4" /></li>
                  <li><InlineMath math="(10 - 6)^2 = 16" /></li>
                </ul>
                <p>Step 3: Sum these values (<InlineMath math="\sum(x - \bar{x})^2" />):</p>
                <BlockMath math="16 + 4 + 0 + 4 + 16 = 40" />
                <p>Step 4: Substitute into the formula (<InlineMath math="n = 5" />, so <InlineMath math="n - 1 = 4" />):</p>
                <BlockMath math="s = \sqrt{\frac{40}{4}} = \sqrt{10}" />
                <p>Answer: <InlineMath math="s \approx 3.16" />.</p>
              </div>
            )
          },
          {
            id: "comparing-ex2",
            question: (
              <div className="space-y-2">
                <p>A teacher compares the test results of two classes. Class A has a mean of 65% and a standard deviation of 4.2. Class B has a mean of 72% and a standard deviation of 1.8. Make two valid comparisons.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p><strong>Statement 1 (Average):</strong> On average, the test scores in Class B were higher (<InlineMath math="72 > 65" />).</p>
                <p><strong>Statement 2 (Spread):</strong> The test scores in Class B were more consistent (or less varied) because their standard deviation is lower (<InlineMath math="1.8 < 4.2" />).</p>
              </div>
            )
          },
          {
            id: "comparing-ex3",
            question: (
              <div className="space-y-2">
                <p>Calculate the median and Interquartile Range (IQR) for the following set of data: 12, 15, 18, 20, 22, 25, 28.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: The data is already ordered from lowest to highest.</p>
                <p>Step 2: Find the median (<InlineMath math="Q_2" />), which is the middle value:</p>
                <BlockMath math="Q_2 = 20" />
                <p>Step 3: Find the lower quartile (<InlineMath math="Q_1" />) by finding the median of the lower half (12, 15, 18):</p>
                <BlockMath math="Q_1 = 15" />
                <p>Step 4: Find the upper quartile (<InlineMath math="Q_3" />) by finding the median of the upper half (22, 25, 28):</p>
                <BlockMath math="Q_3 = 25" />
                <p>Step 5: Calculate the IQR:</p>
                <BlockMath math="\text{IQR} = Q_3 - Q_1 = 25 - 15 = 10" />
                <p>Answer: Median = 20, IQR = 10.</p>
              </div>
            )
          }
        ]
      },
      {
        id: "line-of-best-fit",
        title: "Line of Best Fit",
        videoUrl: "",
        theory: (
          <div className="space-y-4 text-slate-300">
            <p>A scattergraph plots data points to show the relationship between two variables. You must be able to draw a straight "line of best fit" through the data.</p>
            <h4 className="text-white font-semibold">Determining the Equation</h4>
            <p>To find the equation of your line of best fit, you select two points that lie <strong>exactly</strong> on the line (not necessarily data points). You then calculate the gradient (<InlineMath math="m" />) and use <InlineMath math="y - b = m(x - a)" /> to find the equation in terms of the variables on the axes.</p>
            <h4 className="text-white font-semibold">Estimating</h4>
            <p>Once you have the linear model (the equation), you must be able to use it to estimate a <InlineMath math="y" />-value for a given <InlineMath math="x" />-value (or use transposition to find <InlineMath math="x" /> given <InlineMath math="y" />).</p>
          </div>
        ),
        examples: [
          {
            id: "lobf-ex1",
            question: (
              <div className="space-y-2">
                <p>A scattergraph shows the relationship between temperature (<InlineMath math="T" /> in °C) and ice cream sales (<InlineMath math="S" /> in £). A line of best fit is drawn, passing exactly through the points (10, 150) and (20, 300). Find the equation of the line of best fit in terms of <InlineMath math="S" /> and <InlineMath math="T" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Find the gradient (<InlineMath math="m" />):</p>
                <BlockMath math="m = \frac{300 - 150}{20 - 10} = \frac{150}{10} = 15" />
                <p>Step 2: Substitute <InlineMath math="m = 15" /> and the point (10, 150) into <InlineMath math="y - b = m(x - a)" />. Remember to use <InlineMath math="S" /> instead of <InlineMath math="y" /> and <InlineMath math="T" /> instead of <InlineMath math="x" />:</p>
                <BlockMath math="S - 150 = 15(T - 10)" />
                <p>Step 3: Expand and simplify:</p>
                <BlockMath math="S - 150 = 15T - 150 \Rightarrow S = 15T" />
                <p>Answer: <InlineMath math="S = 15T" />.</p>
              </div>
            )
          },
          {
            id: "lobf-ex2",
            question: (
              <div className="space-y-2">
                <p>Using the equation derived above (<InlineMath math="S = 15T" />), estimate the ice cream sales on a day when the temperature is 25°C.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Substitute <InlineMath math="T = 25" /> into the equation:</p>
                <BlockMath math="S = 15(25)" />
                <p>Step 2: Calculate the result:</p>
                <BlockMath math="S = 375" />
                <p>Answer: Estimated sales are £375.</p>
              </div>
            )
          },
          {
            id: "lobf-ex3",
            question: (
              <div className="space-y-2">
                <p>A scattergraph shows the relationship between the age of a car (<InlineMath math="A" /> in years) and its value (<InlineMath math="V" /> in £). A line of best fit passes exactly through the points (2, 8000) and (5, 3500). Find the equation of the line of best fit in terms of <InlineMath math="V" /> and <InlineMath math="A" />.</p>
              </div>
            ),
            solution: (
              <div className="space-y-2">
                <p>Step 1: Find the gradient (<InlineMath math="m" />):</p>
                <BlockMath math="m = \frac{3500 - 8000}{5 - 2} = \frac{-4500}{3} = -1500" />
                <p>Step 2: Substitute <InlineMath math="m = -1500" /> and the point (2, 8000) into the straight line equation. Use <InlineMath math="V" /> for <InlineMath math="y" /> and <InlineMath math="A" /> for <InlineMath math="x" />:</p>
                <BlockMath math="V - 8000 = -1500(A - 2)" />
                <p>Step 3: Expand and simplify:</p>
                <BlockMath math="V - 8000 = -1500A + 3000" />
                <BlockMath math="V = -1500A + 11000" />
                <p>Answer: <InlineMath math="V = -1500A + 11000" />.</p>
              </div>
            )
          }
        ]
      }
    ]
  }
];
