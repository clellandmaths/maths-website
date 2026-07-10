export const advHigherMaths2018 = {
  year: 2018,
  papers: [
    {
      paperNumber: 1,
      questions: [
        {
          question: `<small><strong><span style="white-space: nowrap;">2018 Q1(a)</span></strong></small><p>Given \\(f(x) = \\sin^{-1} 3x\\) find \\(f'(x).\\)</p>`,
          answer: `\\(\\frac{3}{\\sqrt{1 - 9x^2}}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2018 Q1(b)</span></strong></small><p>Differentiate \\(y = \\frac{e^{5x}}{7x + 1}.\\)</p>`,
          answer: `\\(\\frac{5(7x + 1)e^{5x} - 7e^{5x}}{(7x + 1)^2}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2018 Q1(c)</span></strong></small><p>For \\(y \\cos x + y^2 = 6x\\), use implicit differentiation to find \\(\\frac{dy}{dx}.\\)</p>`,
          answer: `\\(\\frac{6 + y \\sin x}{\\cos x + 2y}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Implicit differentiation"],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2018 Q2</span></strong></small><p>Use partial fractions to find \\(\\int \\frac{3x - 7}{x^2 - 2x - 15} \\, dx.\\)</p>`,
          answer: `\\(2 \\ln|x + 3| + \\ln|x - 5| + c\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Partial Fractions", "Integration"],
          subtopics: ["Proper rational functions", "Integrating rational functions"],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2018 Q3</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Write down and simplify the general term in the binomial expansion of<br>\\(\\left(2x + \\frac{5}{x^2}\\right)^9.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Hence, or otherwise, find the term independent of \\(x.\\)</p>`,
          answer: `(a) \\(\\binom{9}{r} 2^{9-r} 5^r x^{9-3r}\\)<br>(b) \\(672000\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Binomial Theorem"],
          subtopics: ["General and specific terms"],
          marks: [3, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2018 Q4</span></strong></small><p>Given that \\(z_1 = 2 + 3i\\) and \\(z_2 = p - 6i\\), \\(p \\in \\mathbb{R}\\), find:</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>\\(z_1 \\overline{z}_2\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>the value of \\(p\\) such that \\(z_1 \\overline{z}_2\\) is a real number.</p>`,
          answer: `(a) \\((2p - 18) + (3p + 12)i\\)<br>(b) \\(p = -4\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Complex Numbers"],
          subtopics: ["Basic operations"],
          marks: [2, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2018 Q5</span></strong></small><p>Use the Euclidean algorithm to find integers \\(a\\) and \\(b\\) such that \\(306a + 119b = 17.\\)</p>`,
          answer: `\\(a = 2, b = -5\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Number Theory"],
          subtopics: ["Euclidean algorithm"],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2018 Q6</span></strong></small><p>On a suitable domain, a curve is defined parametrically by \\(x = t^2 + 1\\) and \\(y = \\ln(3t + 2).\\)<br>Find the equation of the tangent to the curve where \\(t = -\\frac{1}{3}.\\)</p>`,
          answer: `\\(y = -\\frac{9}{2}x + 5\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Parametric differentiation"],
          marks: [5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2018 Q7</span></strong></small><p>Matrices \\(C\\) and \\(D\\) are given by:<br>\\(C = \\begin{pmatrix} -2 & 1 & 2 \\\\ 1 & -1 & 0 \\\\ 1 & 0 & -1 \\end{pmatrix}\\) and \\(D = \\begin{pmatrix} 1 & 1 & 2 \\\\ k+3 & 0 & 2 \\\\ 1 & 1 & 1 \\end{pmatrix}\\), where \\(k \\in \\mathbb{R}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Obtain \\(2C' - D\\) where \\(C'\\) is the transpose of \\(C.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>(i) Find and simplify an expression for the determinant of \\(D.\\)<br>(ii) State the value of \\(k\\) such that \\(D^{-1}\\) does not exist.</p>`,
          answer: `(a) \\(\\begin{pmatrix} -5 & 1 & 0 \\\\ -k-1 & -2 & -2 \\\\ 3 & -1 & -3 \\end{pmatrix}\\)<br>(b)(i) \\(k + 3\\)<br>(b)(ii) \\(-3\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Matrices"],
          subtopics: ["Matrix operations", "Determinant and inverse"],
          marks: [2, 2, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2018 Q8</span></strong></small><p>Using the substitution \\(u = \\sin \\theta\\), or otherwise, evaluate</p><p>\\(\\int_{\\frac{\\pi}{6}}^{\\frac{\\pi}{2}} 2 \\sin^4 \\theta \\cos \\theta \\, d\\theta.\\)</p>`,
          answer: `\\(\\frac{31}{80}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Integration"],
          subtopics: ["Integration by substitution"],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2018 Q9</span></strong></small><p>Prove directly that:</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>the sum of any three consecutive integers is divisible by 3;</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>any odd integer can be expressed as the sum of two consecutive integers.</p>`,
          answer: `(a) Proof showing \\((n - 1) + n + (n + 1) = 3n\\), which is a multiple of 3 and thus divisible by 3.<br>(b) Proof showing any odd integer \\(2k + 1\\) (where \\(k \\in \\mathbb{Z}\\)) can be written as \\(k + (k + 1)\\), the sum of two consecutive integers.`,
          videoId: "",
          timestamp: "",
          topics: ["Methods of Proof"],
          subtopics: ["Direct proof"],
          marks: [2, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2018 Q10</span></strong></small><p>Given \\(z = x + iy\\) sketch the locus in the complex plane given by \\(|z| = |z - 2 + 2i|.\\)</p>`,
          answer: `A straight line representing the perpendicular bisector of the line segment joining \\((0, 0)\\) and \\((2, -2).\\) Equation of the line is \\(y = x - 2.\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Complex Numbers"],
          subtopics: ["Locus in the complex plane"],
          marks: [3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2018 Q11</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Obtain the matrix, \\(A\\), associated with an anticlockwise rotation of \\(\\frac{\\pi}{3}\\) radians about the origin.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Find the matrix, \\(B\\), associated with a reflection in the x-axis.</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Hence obtain the matrix, \\(P\\), associated with an anticlockwise rotation of \\(\\frac{\\pi}{3}\\) radians about the origin followed by reflection in the x-axis, expressing your answer using exact values.</p><p><span class="text-cyan-400 font-bold mr-1">(d)</span>Explain why matrix \\(P\\) is not associated with rotation about the origin.</p>`,
          answer: `(a) \\(\\begin{pmatrix} \\frac{1}{2} & -\\frac{\\sqrt{3}}{2} \\\\ \\frac{\\sqrt{3}}{2} & \\frac{1}{2} \\end{pmatrix}\\)<br>(b) \\(\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}\\)<br>(c) \\(\\begin{pmatrix} \\frac{1}{2} & -\\frac{\\sqrt{3}}{2} \\\\ -\\frac{\\sqrt{3}}{2} & -\\frac{1}{2} \\end{pmatrix}\\)<br>(d) \\(P\\) is not associated with rotation about the origin because it is not in the general form of a rotation matrix \\(\\begin{pmatrix} \\cos \\theta & -\\sin \\theta \\\\ \\sin \\theta & \\cos \\theta \\end{pmatrix}\\) (e.g. elements on the leading diagonal are not equal).`,
          videoId: "",
          timestamp: "",
          topics: ["Matrices"],
          subtopics: ["Transformation matrices"],
          marks: [1, 1, 2, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2018 Q12</span></strong></small><p>Prove by induction that, for all positive integers \\(n\\),</p><p>\\(\\sum_{r=1}^n 3^{r-1} = \\frac{1}{2}(3^n - 1).\\)</p>`,
          answer: `Proof by induction showing true for \\(n=1\\) (LHS = RHS = 1), assuming true for \\(n=k\\), and showing the sum to \\(k+1\\) simplifies to \\(\\frac{1}{2}(3^{k+1} - 1)\\), concluding the proof for all positive integers \\(n.\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Methods of Proof"],
          subtopics: ["Proof by induction"],
          marks: [5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2018 Q13</span></strong></small><p>An engineer has designed a lifting device. The handle turns a screw which shortens the horizontal length and increases the vertical height.</p><p>The device is modelled by a rhombus, with each side 25 cm.</p><p>The horizontal length is \\(x\\) cm, and the vertical height is \\(h\\) cm as shown.</p><img src="/img/Adv_Higher_Maths_Past_Papers/2018/2018_Q13_1.png" alt="Lifting device"><img src="/img/Adv_Higher_Maths_Past_Papers/2018/2018_Q13_2.png" alt="Rhombus model of the device"><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Show that \\(h = \\sqrt{2500 - x^2}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>The horizontal length decreases at a rate of 0.3 cm per second as the handle is turned.</p><p>Find the rate of change of the vertical height when \\(x = 30.\\)</p>`,
          answer: `(a) Using Pythagoras' theorem on a quarter of the rhombus: \\(\\left(\\frac{x}{2}\\right)^2 + \\left(\\frac{h}{2}\\right)^2 = 25^2.\\) Rearranging gives \\(x^2 + h^2 = 2500\\), hence \\(h = \\sqrt{2500 - x^2}.\\)<br>(b) \\(\\frac{9}{40}\\) cm s\\(^{-1}\\) (or \\(0.225\\) cm s\\(^{-1}\\))`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Related rates of change"],
          marks: [1, 5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2018 Q14</span></strong></small><p>A geometric sequence has first term 80 and common ratio \\(\\frac{1}{3}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>For this sequence, calculate:</p><p>(i) the \\(7^{\\text{th}}\\) term;<br>(ii) the sum to infinity of the associated geometric series.</p><p>The first term of this geometric sequence is equal to the first term of an arithmetic sequence.<br>The sum of the first five terms of this arithmetic sequence is 240.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>(i) Find the common difference of this sequence.<br>(ii) Write down and simplify an expression for the \\(n^{\\text{th}}\\) term.</p><p>Let \\(S_n\\) represent the sum of the first \\(n\\) terms of this arithmetic sequence.</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Find the values of \\(n\\) for which \\(S_n = 144.\\)</p>`,
          answer: `(a)(i) \\(\\frac{80}{729}\\)<br>(a)(ii) \\(120\\)<br>(b)(i) \\(-16\\)<br>(b)(ii) \\(96 - 16n\\)<br>(c) \\(n = 2, n = 9\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Sequences & Series"],
          subtopics: ["Arithmetic and geometric combined"],
          marks: [2, 2, 2, 1, 3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2018 Q15</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Use integration by parts to find \\(\\int x \\sin 3x \\, dx.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Hence find the particular solution of</p><p>\\(\\frac{dy}{dx} - \\frac{2}{x}y = x^3 \\sin 3x\\),  \\(x \\neq 0\\)</p><p>given that \\(x = \\pi\\) when \\(y = 0.\\)<br>Express your answer in the form \\(y = f(x).\\)</p>`,
          answer: `(a) \\(-\\frac{x}{3} \\cos 3x + \\frac{1}{9} \\sin 3x + c\\)<br>(b) \\(y = -\\frac{x^3}{3}\\cos 3x + \\frac{x^2}{9}\\sin 3x - \\frac{\\pi x^2}{3}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Integration", "Differential Equations"],
          subtopics: ["Integration by parts", "First order linear"],
          marks: [3, 7]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2018 Q16</span></strong></small><p>Planes \\(\\pi_1\\), \\(\\pi_2\\) and \\(\\pi_3\\) have equations:</p><p>\\(\\pi_1\\): \\(x - 2y + z = -4\\)<br>\\(\\pi_2\\): \\(3x - 5y - 2z = 1\\)<br>\\(\\pi_3\\): \\(-7x + 11y + az = -11\\)</p><p>where \\(a \\in \\mathbb{R}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Use Gaussian elimination to find the value of \\(a\\) such that the intersection of the planes \\(\\pi_1\\), \\(\\pi_2\\) and \\(\\pi_3\\) is a line.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Find the equation of the line of intersection of the planes when \\(a\\) takes this value.</p><p>The plane \\(\\pi_4\\) has equation \\(-9x + 15y + 6z = 20.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Find the acute angle between \\(\\pi_1\\) and \\(\\pi_4.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(d)</span>Describe the geometrical relationship between \\(\\pi_2\\) and \\(\\pi_4.\\) Justify your answer.</p>`,
          answer: `(a) \\(a = 8\\)<br>(b) \\(x = 22 + 9t, y = 13 + 5t, z = t\\) (or equivalent form)<br>(c) \\(43^{\\circ}\\) (or \\(0.75\\) rad)<br>(d) Planes \\(\\pi_2\\) and \\(\\pi_4\\) are parallel because the normal of \\(\\pi_4\\) is a scalar multiple of the normal of \\(\\pi_2.\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Vectors"],
          subtopics: ["Intersection of planes"],
          marks: [4, 2, 3, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2018 Q17</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Given \\(f(x) = e^{2x}\\) obtain the Maclaurin expansion for \\(f(x)\\) up to, and including, the term in \\(x^3.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>On a suitable domain, let \\(g(x) = \\tan x.\\)<br>(i) Show that the third derivative of \\(g(x)\\) is given by<br>\\(g'''(x) = 2 \\sec^4 x + 4 \\tan^2 x \\sec^2 x.\\)<br>(ii) Hence obtain the Maclaurin expansion for \\(g(x)\\) up to and including the term in \\(x^3.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Hence, or otherwise, obtain the Maclaurin expansion for \\(e^{2x} \\tan x\\) up to, and including, the term in \\(x^3.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(d)</span>Write down the first three non-zero terms in the Maclaurin expansion for<br>\\(2e^{2x} \\tan x + e^{2x} \\sec^2 x.\\)</p>`,
          answer: `(a) \\(1 + 2x + 2x^2 + \\frac{4}{3}x^3\\)<br>(b)(i) Proof using product/chain rule on \\(g''(x) = 2\\sec^2 x \\tan x.\\)<br>(b)(ii) \\(x + \\frac{1}{3}x^3\\)<br>(c) \\(x + 2x^2 + \\frac{7}{3}x^3\\)<br>(d) \\(1 + 4x + 7x^2\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Maclaurin Series", "Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [2, 3, 2, 2, 1]
        }
      ]
    }
  ]
};
