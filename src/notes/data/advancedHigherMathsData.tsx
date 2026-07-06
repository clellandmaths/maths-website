import React from 'react';

import { InlineMath, BlockMath } from '@/src/notes/math-components';
import { Section } from '@/src/notes/types';

export const advancedHigherMathsData: Section[] = [
  {
    id: "binomial-partial-fractions",
    title: "Binomial Theorem and Partial Fractions",
    topics: [
      {
        id: "binomial-theorem",
        title: "1. Binomial Theorem",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <div>
              <p>For <InlineMath math="n \in \mathbb{N}" />, the Binomial Theorem states:</p>
              <BlockMath math="(x + y)^n = \binom{n}{0}x^n + \binom{n}{1}x^{n-1}y + \binom{n}{2}x^{n-2}y^2 + \binom{n}{3}x^{n-3}y^3 + \dots + \binom{n}{n}y^n" />
              <p className="mt-4">The <InlineMath math="r" />th term of <InlineMath math="(x + y)^n" /> is given by:</p>
              <BlockMath math="\binom{n}{r} x^{n-r} y^r" />
              <p className="mt-4">The binomial coefficient is calculated as:</p>
              <BlockMath math="^nC_r = \binom{n}{r} = \frac{n!}{r!(n-r)!}" />
            </div>
          </div>
        ),
        examples: []
      },
      {
        id: "partial-fractions",
        title: "2. Partial Fractions",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <div>
              <h4 className="text-lg font-semibold text-white">Distinct Linear Factors</h4>
              <BlockMath math="\frac{f(x)}{(x-a)(x+b)} = \frac{A}{x-a} + \frac{B}{x+b}" />
              
              <h4 className="text-lg font-semibold text-white mt-4">Repeated Linear Factors</h4>
              <BlockMath math="\frac{f(x)}{(x-a)^2} = \frac{A}{x-a} + \frac{B}{(x-a)^2}" />
              <BlockMath math="\frac{f(x)}{(x-a)(x-b)^2} = \frac{A}{x-a} + \frac{B}{x-b} + \frac{C}{(x-b)^2}" />
              
              <h4 className="text-lg font-semibold text-white mt-4">Irreducible Quadratic Factor</h4>
              <BlockMath math="\frac{f(x)}{(x-a)(x^2+bx+c)} = \frac{A}{x-a} + \frac{Bx+C}{x^2+bx+c}" />
              
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg mt-4">
                <p className="font-semibold text-amber-300 mb-1">Important:</p>
                <p className="text-amber-100/80">
                  If the numerator is of a higher (or equal) degree than the denominator, then algebraic long division should be used first to obtain a proper rational function.
                </p>
              </div>
            </div>
          </div>
        ),
        examples: []
      }
    ]
  },
  {
    id: "matrices",
    title: "Matrices",
    topics: [
      {
        id: "gaussian-elimination",
        title: "1. Gaussian Elimination",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <p>Elementary row operations are used to turn the matrix into upper-triangular form.</p>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Geometric Interpretation</h4>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>If one row's results are all zeros then the three planes do not intersect at a point but they intersect in a line.</li>
                <li>If one row has zeros in the x, y and z places but a non-zero number on the right of the line then there is no solution and the planes do not intersect.</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Ill-conditioning</h4>
              <p>This occurs when a small difference in the coefficients of the equations causes a large change in the solution.</p>
            </div>
          </div>
        ),
        examples: []
      },
      {
        id: "matrix-algebra",
        title: "2. Matrix Algebra",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <div>
              <h4 className="text-lg font-semibold text-white">Addition, Subtraction & Scalar Multiplication</h4>
              <p>Matrices can only be added or subtracted if they have the same order. Add or subtract entry-wise. Multiply each element by the scalar.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Matrix Multiplication</h4>
              <p>Multiply row 1 in first matrix by column 1 in the second matrix, then multiply row 1 in first matrix by column 2 in second matrix etc.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Determinants</h4>
              <p>The determinant of a 2x2 matrix <InlineMath math="A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}" /> is <InlineMath math="\det A = ad - bc" />.</p>
              <p className="mt-2">The determinant of a 3x3 matrix <InlineMath math="A = \begin{pmatrix} a & b & c \\ d & e & f \\ g & h & i \end{pmatrix}" /> is:</p>
              <BlockMath math="\det A = a\begin{vmatrix} e & f \\ h & i \end{vmatrix} - b\begin{vmatrix} d & f \\ g & i \end{vmatrix} + c\begin{vmatrix} d & e \\ g & h \end{vmatrix}" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Inverses</h4>
              <p>For an inverse of a matrix to exist the matrix must satisfy two conditions: the matrix must be square, and the determinant of the matrix must be non-zero.</p>
              <p className="mt-2">The inverse of a 2x2 matrix is <InlineMath math="A^{-1} = \frac{1}{\det A}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}" />.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Transpose of a Matrix</h4>
              <p>The transpose of a matrix is found by interchanging the rows and columns.</p>
            </div>
          </div>
        ),
        examples: []
      },
      {
        id: "transformations-of-the-plane",
        title: "3. Transformations of the Plane",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <div>
              <h4 className="text-lg font-semibold text-white">Rotation</h4>
              <p>Rotation through angle <InlineMath math="\theta" /> in the anticlockwise direction about the origin is represented by:</p>
              <BlockMath math="\begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Reflection</h4>
              <p>Reflection in the line which makes an angle of <InlineMath math="\theta" /> with the x-axis is given by:</p>
              <BlockMath math="\begin{pmatrix} \cos 2\theta & \sin 2\theta \\ \sin 2\theta & -\cos 2\theta \end{pmatrix}" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Scaling</h4>
              <p>Scaling is given by <InlineMath math="\begin{pmatrix} \lambda & 0 \\ 0 & \mu \end{pmatrix}" />. This has the effect of multiplying the x-coordinate by <InlineMath math="\lambda" /> and the y-coordinate by <InlineMath math="\mu" />.</p>
            </div>
          </div>
        ),
        examples: []
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
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <div>
              <p>An arithmetic sequence has the form <InlineMath math="a, a+d, a+2d, a+3d, \dots" /> where <InlineMath math="a" /> is the first term and <InlineMath math="d" /> is the common difference.</p>
              <p className="mt-2">The nth term is given by <InlineMath math="a + (n-1)d" />.</p>
              <p className="mt-2">The sum to n terms is given by <InlineMath math="S_n = \frac{n}{2}(2a + (n-1)d)" />.</p>
            </div>
          </div>
        ),
        examples: []
      },
      {
        id: "geometric-sequences-series",
        title: "2. Geometric Sequences & Series",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <div>
              <p>A geometric sequence has the form <InlineMath math="a, ar, ar^2, ar^3, \dots" /> where <InlineMath math="a" /> is the first term and <InlineMath math="r" /> is the common ratio.</p>
              <p className="mt-2">The nth term is given by <InlineMath math="ar^{n-1}" />.</p>
              <p className="mt-2">The sum to n terms is given by <InlineMath math="S_n = \frac{a(1-r^n)}{1-r}" />.</p>
              <p className="mt-2">Provided <InlineMath math="-1 < r < 1" />, the sum to infinity is given by <InlineMath math="S_\infty = \frac{a}{1-r}" />.</p>
            </div>
          </div>
        ),
        examples: []
      },
      {
        id: "maclaurin-series",
        title: "3. Maclaurin Series",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <div>
              <p>The method is to repeatedly differentiate the function and to substitute <InlineMath math="x = 0" /> into each answer.</p>
              <p className="mt-2">The Maclaurin series is then given by:</p>
              <BlockMath math="\sum_{r=0}^{\infty} f^{(r)}(0)\frac{x^r}{r!} = f(0) + f'(0)\frac{x}{1!} + f''(0)\frac{x^2}{2!} + f^{(3)}(0)\frac{x^3}{3!} + \dots" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Standard Maclaurin Series</h4>
              <BlockMath math="e^x = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \dots" />
              <BlockMath math="\ln(1+x) = x - \frac{x^2}{2} + \frac{x^3}{3} - \frac{x^4}{4} + \dots" />
              <BlockMath math="\cos x = 1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \dots" />
              <BlockMath math="\sin x = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \dots" />
            </div>
          </div>
        ),
        examples: []
      }
    ]
  },
  {
    id: "iterative-schemes",
    title: "Iterative Schemes",
    topics: [
      {
        id: "recurrence-relations",
        title: "1. Recurrence Relations",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <div>
              <p>A recurrence relation <InlineMath math="u_{n+1} = a u_n + b" /> converges to a limit if <InlineMath math="-1 < a < 1" />.</p>
              <p className="mt-2">The limit is given by <InlineMath math="l = \frac{b}{1-a}" />.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Fixed Point</h4>
              <p>For a recurrence relation <InlineMath math="u_{n+1} = a u_n + b" /> the corresponding equation is <InlineMath math="x = ax + b" />. The solution of the equation is the same as the limit and is called the fixed point.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Calculating Roots</h4>
              <p>To calculate a root using an iterative scheme you must decide whether the scheme converges or diverges. Convergence is decided by differentiating and substituting in the approximate root. If the answer is between -1 and 1, the scheme will converge. The closer the value is to zero the quicker the scheme will converge.</p>
            </div>
          </div>
        ),
        examples: []
      }
    ]
  },
  {
    id: "complex-numbers",
    title: "Complex Numbers",
    topics: [
      {
        id: "complex-intro-algebra",
        title: "1. Introduction & Algebraic Operations",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <div>
              <h4 className="text-lg font-semibold text-white">Definition</h4>
              <p>A complex number has the form <InlineMath math="z = a + bi" /> where <InlineMath math="a" /> and <InlineMath math="b" /> are real numbers and <InlineMath math="i = \sqrt{-1}" />.</p>
              <p className="mt-2"><InlineMath math="a" /> is called the real part (<InlineMath math="\text{Re } z = a" />) and <InlineMath math="b" /> is the imaginary part (<InlineMath math="\text{Im } z = b" />).</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Argand Diagram</h4>
              <p>A complex number <InlineMath math="z = a + bi" /> can be plotted on an Argand diagram. This is like a Cartesian coordinate diagram but with real (Re) and imaginary (Im) axes.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Complex Conjugate</h4>
              <p>The complex conjugate of <InlineMath math="z" /> is denoted <InlineMath math="\bar{z}" />. If <InlineMath math="z = a + bi" /> then <InlineMath math="\bar{z} = a - bi" />.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Division of Complex Numbers</h4>
              <ol className="list-decimal list-inside ml-4 mt-2 space-y-2">
                <li>Find the complex conjugate of the denominator.</li>
                <li>Multiply top and bottom by the conjugate of the denominator.</li>
                <li>Express answer in the form <InlineMath math="a + bi" />.</li>
              </ol>
            </div>
          </div>
        ),
        examples: []
      },
      {
        id: "polar-form-interpretations",
        title: "2. Polar Form & Geometric Interpretations",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <div>
              <h4 className="text-lg font-semibold text-white">Polar Form</h4>
              <p>The polar form of a complex number <InlineMath math="z = a + bi" /> is expressed as:</p>
              <BlockMath math="z = r(\cos\theta + i\sin\theta)" />
              <p className="mt-2">where the modulus <InlineMath math="r = \sqrt{a^2 + b^2}" /> and the argument <InlineMath math="\theta" /> is the angle between the positive Re-axis and the line from the origin to z.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Geometric Interpretations</h4>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li><InlineMath math="|z| = r" /> represents a circle with centre (0,0) and radius r.</li>
                <li><InlineMath math="|z - a| = r" /> represents a circle with centre a and radius r.</li>
                <li><InlineMath math="|z - a| = |z - b|" /> represents the points which lie on the perpendicular bisector of the line joining a and b.</li>
              </ul>
            </div>
          </div>
        ),
        examples: []
      },
      {
        id: "fundamental-de-moivre",
        title: "3. Fundamental Theorem of Algebra & De Moivre's",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <div>
              <h4 className="text-lg font-semibold text-white">Fundamental Theorem of Algebra</h4>
              <p>If a polynomial <InlineMath math="P(z)" /> has degree <InlineMath math="n" /> and <InlineMath math="P(z) = 0" /> then there are <InlineMath math="n" /> solutions.</p>
              <p className="mt-2">Note that if <InlineMath math="z" /> is a root then <InlineMath math="\bar{z}" /> is also a root.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">De Moivre's Theorem</h4>
              <BlockMath math="z = r(\cos\theta + i\sin\theta) \implies z^n = r^n(\cos n\theta + i\sin n\theta)" />
              <h5 className="font-semibold text-white mt-4">De Moivre's theorem for fractional powers</h5>
              <BlockMath math="(r(\cos\theta + i\sin\theta))^{\frac{p}{q}} = r^{\frac{p}{q}}\left(\cos\left(\frac{p}{q}\theta\right) + i\sin\left(\frac{p}{q}\theta\right)\right)" />
            </div>
          </div>
        ),
        examples: []
      }
    ]
  },
  {
    id: "methods-of-proof",
    title: "Methods of Proof",
    topics: [
      {
        id: "proofs",
        title: "1. Types of Proof",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <div>
              <h4 className="text-lg font-semibold text-white">Disproving by Counter Example</h4>
              <p>If you can find one example that will disprove the statement, then it must be false.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Proof by Exhaustion</h4>
              <p>If the statement is given for a small set of values, then showing that the statement is true for every value will be enough to prove it.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Proof by Contradiction</h4>
              <p>This method assumes that the statement is false and then shows that this leads to something we know to be false (a contradiction).</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Proof by Induction</h4>
              <ol className="list-decimal list-inside ml-4 mt-2 space-y-2">
                <li>Show that the statement holds for some value of <InlineMath math="n" /> (usually <InlineMath math="n = 1" />).</li>
                <li>Assume that the statement holds for some constant <InlineMath math="n = k" /> and using this assumption show that the statement holds for <InlineMath math="n = k + 1" />.</li>
              </ol>
              <p className="mt-2">Then the statement holds for all <InlineMath math="n \ge 1" />.</p>
            </div>
          </div>
        ),
        examples: []
      }
    ]
  },
  {
    id: "functions",
    title: "Functions",
    topics: [
      {
        id: "critical-points-curve-sketching",
        title: "1. Critical Points & Curve Sketching",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <div>
              <h4 className="text-lg font-semibold text-white">Critical and Stationary Points</h4>
              <p>A critical point exists where the derivative is zero or undefined.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Derivative Tests</h4>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>If <InlineMath math="f''(a) < 0" /> then the point is a maximum turning point.</li>
                <li>If <InlineMath math="f''(a) > 0" /> then the point is a minimum turning point.</li>
              </ul>
              <p className="mt-2">A non-horizontal point of inflection exists at <InlineMath math="x = a" /> when <InlineMath math="f''(a) = 0" /> but <InlineMath math="f'(a) \neq 0" /> and <InlineMath math="f''(x)" /> changes sign at <InlineMath math="x = a" />.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Curve Sketching Steps</h4>
              <ol className="list-decimal list-inside ml-4 mt-2 space-y-2">
                <li>Identify x-axis and y-axis intercepts.</li>
                <li>Identify turning points and their nature.</li>
                <li>Consider the behaviour as <InlineMath math="x \to \pm\infty" />. This could be a horizontal asymptote or a slant asymptote (the polynomial part after algebraic long division).</li>
                <li>Check where y is undefined (this means a vertical asymptote exists).</li>
                <li>Sketch the curve showing asymptotes, turning points and intercepts.</li>
              </ol>
            </div>
          </div>
        ),
        examples: []
      }
    ]
  },
  {
    id: "vectors",
    title: "Vectors",
    topics: [
      {
        id: "vector-products-lines-planes",
        title: "1. Products, Lines and Planes",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <div>
              <h4 className="text-lg font-semibold text-white">Scalar and Vector Product</h4>
              <p>The scalar product is <InlineMath math="\mathbf{p} \cdot \mathbf{q} = ad + be + cf" />.</p>
              <p className="mt-2">The vector product <InlineMath math="\mathbf{p} \times \mathbf{q}" /> is given by the determinant of a 3x3 matrix with <InlineMath math="\mathbf{i}, \mathbf{j}, \mathbf{k}" /> on the top row.</p>
              <p className="mt-2">The magnitude of the vector product is <InlineMath math="|\mathbf{a} \times \mathbf{b}| = |\mathbf{a}| |\mathbf{b}| \sin\theta" />.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Equations of Lines</h4>
              <p>Vector form: <InlineMath math="\mathbf{r} = \mathbf{a} + \lambda\mathbf{d}" /></p>
              <p>Parametric form: <InlineMath math="x = a_1 + \lambda d_1" />, <InlineMath math="y = a_2 + \lambda d_2" />, <InlineMath math="z = a_3 + \lambda d_3" /></p>
              <p>Symmetric form: <InlineMath math="\frac{x - a_1}{d_1} = \frac{y - a_2}{d_2} = \frac{z - a_3}{d_3}" /></p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Equations of Planes</h4>
              <p>Vector equation: <InlineMath math="\mathbf{r} \cdot \mathbf{n} = \mathbf{a} \cdot \mathbf{n}" /></p>
              <p>Cartesian equation: <InlineMath math="n_1 x + n_2 y + n_3 z = d" /> where <InlineMath math="d = \mathbf{a} \cdot \mathbf{n}" />.</p>
            </div>
          </div>
        ),
        examples: []
      }
    ]
  },
  {
    id: "differentiation",
    title: "Differentiation",
    topics: [
      {
        id: "differentiation-rules",
        title: "1. Rules and Standard Derivatives",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <div>
              <h4 className="text-lg font-semibold text-white">Rules</h4>
              <p>Product Rule: <InlineMath math="(fg)' = f'g + fg'" /></p>
              <p>Quotient Rule: <InlineMath math="\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}" /></p>
              <p>Chain Rule: <InlineMath math="\frac{d}{dx}(f(g(x))) = f'(g(x)) \cdot g'(x)" /></p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Standard Derivatives</h4>
              <p><InlineMath math="\frac{d}{dx}(e^x) = e^x" /></p>
              <p><InlineMath math="\frac{d}{dx}(\ln x) = \frac{1}{x}" /></p>
              <p><InlineMath math="\frac{d}{dx}(\sin^{-1} x) = \frac{1}{\sqrt{1-x^2}}" /></p>
              <p><InlineMath math="\frac{d}{dx}(\cos^{-1} x) = \frac{-1}{\sqrt{1-x^2}}" /></p>
              <p><InlineMath math="\frac{d}{dx}(\tan^{-1} x) = \frac{1}{1+x^2}" /></p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Implicit & Parametric</h4>
              <p>Implicit: Differentiate term by term, applying the chain rule <InlineMath math="\frac{d}{dx}f(y) = \frac{d}{dy}f(y) \cdot \frac{dy}{dx}" />.</p>
              <p>Parametric: <InlineMath math="\frac{dy}{dx} = \frac{\frac{dy}{dt}}{\frac{dx}{dt}}" /></p>
            </div>
          </div>
        ),
        examples: []
      }
    ]
  },
  {
    id: "integration",
    title: "Integration",
    topics: [
      {
        id: "integration-techniques",
        title: "1. Standard Integrals & Techniques",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <div>
              <h4 className="text-lg font-semibold text-white">Standard Integrals</h4>
              <p><InlineMath math="\int \sec^2 x \,dx = \tan x + c" /></p>
              <p><InlineMath math="\int \frac{1}{\sqrt{1-x^2}} \,dx = \sin^{-1} x + c" /></p>
              <p><InlineMath math="\int \frac{1}{1+x^2} \,dx = \tan^{-1} x + c" /></p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Integration by Substitution</h4>
              <p>Substitute <InlineMath math="u = u(x)" />, find <InlineMath math="\frac{du}{dx}" /> to replace <InlineMath math="dx" /> with <InlineMath math="du" />, integrate with respect to u.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Volumes of Solids of Revolution</h4>
              <p>The solid formed by rotating a curve between <InlineMath math="x = a" /> and <InlineMath math="x = b" /> about the x-axis has volume <InlineMath math="V = \int_a^b \pi y^2 \,dx" />.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Integration by Parts</h4>
              <BlockMath math="\int f g' = f g - \int f' g" />
            </div>
          </div>
        ),
        examples: []
      }
    ]
  },
  {
    id: "differential-equations",
    title: "Differential Equations",
    topics: [
      {
        id: "first-second-order-de",
        title: "1. First & Second Order DEs",
        videoUrl: "https://www.youtube.com/embed/placeholder",
        theory: (
          <div className="space-y-6 text-slate-300">
            <div>
              <h4 className="text-lg font-semibold text-white">Separable Differential Equations</h4>
              <p>If <InlineMath math="\frac{dy}{dx} = f(x)g(y)" /> then <InlineMath math="\int \frac{1}{g(y)} \,dy = \int f(x) \,dx" />.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">First Order Linear DEs</h4>
              <p>Form: <InlineMath math="\frac{dy}{dx} + P(x)y = f(x)" /></p>
              <p>Calculate the integrating factor <InlineMath math="I(x) = e^{\int P(x) \,dx}" />.</p>
              <p>Then <InlineMath math="\frac{d}{dx}(I(x)y) = I(x)f(x)" />.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Second Order Homogeneous Linear DEs</h4>
              <p>Form: <InlineMath math="a\frac{d^2 y}{dx^2} + b\frac{dy}{dx} + cy = 0" /></p>
              <p>Write down auxiliary equation: <InlineMath math="am^2 + bm + c = 0" />.</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Distinct real roots <InlineMath math="m_1, m_2" />: <InlineMath math="y = Ae^{m_1 x} + Be^{m_2 x}" /></li>
                <li>One repeated real root <InlineMath math="m" />: <InlineMath math="y = Ae^{mx} + Bxe^{mx}" /></li>
                <li>Complex roots <InlineMath math="p \pm qi" />: <InlineMath math="y = e^{px}(A\cos qx + B\sin qx)" /></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mt-4">Second Order Non-Homogeneous DEs</h4>
              <p>The general solution is <InlineMath math="y = y_c + y_p" /> where <InlineMath math="y_c" /> is the complementary solution (from the homogeneous equation) and <InlineMath math="y_p" /> is the particular integral calculated by making an educated guess based on <InlineMath math="f(x)" />.</p>
            </div>
          </div>
        ),
        examples: []
      }
    ]
  }
];
