export const advHigherMaths2017 = {
  year: 2017,
  papers: [
    {
      paperNumber: 1,
      questions: [
        {
          question: `<small><strong><span style="white-space: nowrap;">2017 Q1</span></strong></small><p>Write down the binomial expansion of \\(\\left(\\frac{2}{y^2}-5y\\right)^3\\) and simplify your answer.</p>`,
          answer: `\\(\\frac{8}{y^6} - \\frac{60}{y^3} + 150 - 125y^3\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Binomial Theorem"],
          subtopics: ["Binomial expansion"],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2017 Q2</span></strong></small><p>Express \\(\\frac{x^2-6x+20}{(x+1)(x-2)^2}\\) in partial fractions.</p>`,
          answer: `\\(\\frac{3}{x+1} - \\frac{2}{x-2} + \\frac{4}{(x-2)^2}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Partial Fractions"],
          subtopics: ["Proper rational functions"],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2017 Q3</span></strong></small><p>On a suitable domain, a function is defined by \\(f(x)=\\frac{e^{x^2-1}}{x^2-1}.\\)<br>Find \\(f'(x)\\) simplifying your answer.</p>`,
          answer: `\\(\\frac{2xe^{x^2-1}(x^2-2)}{(x^2-1)^2}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2017 Q4</span></strong></small><p>The fifth term of an arithmetic sequence is \\(-6\\) and the twelfth term is \\(-34.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Determine the values of the first term and the common difference.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Obtain algebraically the value of \\(n\\) for which \\(S_n = -144.\\)</p>`,
          answer: `(a) \\(a = 10\\), \\(d = -4\\)<br>(b) \\(n = 12\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Sequences & Series"],
          subtopics: ["Arithmetic sequences and series"],
          marks: [2, 3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2017 Q5</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>(i) Use Gaussian elimination on the system of equations below to give an expression for \\(z\\) in terms of \\(\\lambda.\\)</p><p>\\(x + 2y - z = -3\\)<br>\\(4x - 2y + 3z = 11\\)<br>\\(3x + y + 2\\lambda z = 8\\)</p><p>(ii) For what value of \\(\\lambda\\) is this system of equations inconsistent?</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Determine the solution of this system when \\(\\lambda = -2.5.\\)</p>`,
          answer: `(a)(i) \\(z = \\frac{11}{4\\lambda - 1}\\)<br>(a)(ii) \\(\\lambda = \\frac{1}{4}\\)<br>(b) \\(x = 2\\), \\(y = -3\\), \\(z = -1\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Systems of Equations"],
          subtopics: [],
          marks: [4, 1, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2017 Q6</span></strong></small><p>Use the substitution \\(u=5x^2\\) to find the exact value of \\(\\int_{0}^{\\frac{1}{\\sqrt{10}}} \\frac{x}{\\sqrt{1-25x^4}} dx.\\)</p>`,
          answer: `\\(\\frac{\\pi}{60}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Integration"],
          subtopics: ["Integration by substitution"],
          marks: [6]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2017 Q7</span></strong></small><p>Matrices \\(P\\) and \\(Q\\) are defined by \\(P = \\begin{pmatrix} x & 2 \\\\ -5 & -1 \\end{pmatrix}\\) and \\(Q = \\begin{pmatrix} 2 & -3 \\\\ 4 & y \\end{pmatrix}\\), where \\(x,y \\in \\mathbb{R}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Given the determinant of \\(P\\) is 2, obtain:</p><p>(i) The value of \\(x.\\)<br>(ii) \\(P^{-1}.\\)<br>(iii) \\(P^{-1}Q'\\), where \\(Q'\\) is the transpose of \\(Q.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>The matrix \\(R\\) is defined by \\(R = \\begin{pmatrix} 5 & -2 \\\\ z & -6 \\end{pmatrix}\\), where \\(z \\in \\mathbb{R}.\\)</p><p>Determine the value of \\(z\\) such that \\(R\\) is singular.</p>`,
          answer: `(a)(i) \\(x = 8\\)<br>(a)(ii) \\(P^{-1} = \\frac{1}{2}\\begin{pmatrix} -1 & -2 \\\\ 5 & 8 \\end{pmatrix}\\)<br>(a)(iii) \\(\\frac{1}{2}\\begin{pmatrix} 4 & -4-2y \\\\ -14 & 20+8y \\end{pmatrix}\\)<br>(b) \\(z = 15\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Matrices"],
          subtopics: ["Determinant and inverse", "Matrix operations"],
          marks: [1, 1, 2, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2017 Q8</span></strong></small><p>Use the Euclidean algorithm to find integers \\(a\\) and \\(b\\) such that \\(1595a + 1218b = 29.\\)</p>`,
          answer: `\\(a = 13, b = -17\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Number Theory"],
          subtopics: ["Euclidean algorithm"],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2017 Q9</span></strong></small><p>Solve \\(\\frac{dy}{dx} = e^{2x}(1+y^2)\\) given that when \\(x=0\\), \\(y=1.\\)<br>Express \\(y\\) in terms of \\(x.\\)</p>`,
          answer: `\\(y = \\tan\\left(\\frac{1}{2}e^{2x} + \\frac{\\pi}{4} - \\frac{1}{2}\\right)\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differential Equations"],
          subtopics: ["First order separable, without context"],
          marks: [5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2017 Q10</span></strong></small><p>\\(S_n\\) is defined by \\(\\sum_{r=1}^{n}\\left(r^2 + \\frac{1}{3}r\\right).\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find an expression for \\(S_n\\), fully factorising your answer.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Hence find an expression for \\(\\sum_{r=10}^{2p}\\left(r^2 + \\frac{1}{3}r\\right)\\) where \\(p > 5.\\)</p>`,
          answer: `(a) \\(\\frac{n(n+1)^2}{3}\\)<br>(b) \\(\\frac{2p(2p+1)^2}{3} - 300\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Sequences & Series"],
          subtopics: ["Summation formulae"],
          marks: [2, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2017 Q11</span></strong></small><p>Given \\(y = x^{2x^3+1}\\), use logarithmic differentiation to find \\(\\frac{dy}{dx}.\\)<br>Write your answer in terms of \\(x.\\)</p>`,
          answer: `\\(x^{2x^3+1} \\left(6x^2\\ln x + \\frac{2x^3+1}{x}\\right)\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Logarithmic differentiation"],
          marks: [5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2017 Q12</span></strong></small><p>In the diagram below part of the graph of \\(y=f(x)\\) has been omitted. The point \\((-1,-2)\\) lies on the graph and the line \\(y=\\frac{1}{2}x-3\\) is an asymptote.</p><img src="/img/Adv_Higher_Maths_Past_Papers/2017/2017_Q12.png" alt="Graph showing an asymptote and part of a curve with point (-1,-2)"><p>Given that \\(f(x)\\) is an odd function:</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Copy and complete the diagram, including any asymptotes and any points you know to be on the graph.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>\\(g(x)=|f(x)|.\\) On a separate diagram, sketch \\(g(x).\\)<br>Include known asymptotes and points.</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>State the range of values of \\(f'(x)\\) given that \\(f'(0)=2.\\)</p>`,
          answer: `(a) Graph drawn with half-turn symmetry at the origin. New features include asymptote \\(y = \\frac{1}{2}x + 3\\) and point \\((1, 2)\\) clearly indicated.<br>(b) Graph showing the points \\((-1, 2)\\) and \\((1, 2)\\), with asymptotes meeting on the positive y-axis forming a V-shape.<br>(c) \\(\\frac{1}{2} < f'(x) \\le 2\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Functions & Graphs"],
          subtopics: ["Asymptotes", "Odd and even functions", "Sketching related functions"],
          marks: [2, 2, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2017 Q13</span></strong></small><p>Let \\(n\\) be an integer.<br>Using proof by contrapositive, show that if \\(n^2\\) is even, then \\(n\\) is even.</p>`,
          answer: `The contrapositive is: "If \\(n\\) is odd, then \\(n^2\\) is odd."<br>Let \\(n = 2k + 1\\) for some integer \\(k.\\)<br>\\(n^2 = (2k + 1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1.\\)<br>Since \\(2k^2 + 2k\\) is an integer, \\(n^2\\) is odd.<br>Since the contrapositive statement is true, the original statement is true.`,
          videoId: "",
          timestamp: "",
          topics: ["Methods of Proof"],
          subtopics: ["Proof by contrapositive"],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2017 Q14</span></strong></small><p>Find the particular solution of the differential equation</p><p>\\(\\frac{d^2y}{dx^2} - 6\\frac{dy}{dx} + 9y = 8\\sin x + 19\\cos x\\)</p><p>given that \\(y = 7\\) and \\(\\frac{dy}{dx} = \\frac{1}{2}\\) when \\(x = 0.\\)</p>`,
          answer: `\\(y = 5e^{3x} - 14xe^{3x} - \\frac{1}{2}\\sin x + 2\\cos x\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differential Equations"],
          subtopics: ["Second order non-homogeneous"],
          marks: [10]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2017 Q15</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>A beam of light passes through the points \\(B(7,8,1)\\) and \\(T(-3,-22,6).\\)<br>Obtain parametric equations of the line representing the beam of light.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>A sheet of metal is represented by a plane containing the points \\(P(2,1,9)\\), \\(Q(1,2,7)\\) and \\(R(-3,7,1).\\)<br>Find the Cartesian equation of the plane.</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>The beam of light passes through a hole in the metal at point \\(H.\\)<br>Find the coordinates of \\(H.\\)</p>`,
          answer: `(a) \\(x = 2\\lambda + 7\\), \\(y = 6\\lambda + 8\\), \\(z = -\\lambda + 1\\) (or equivalent)<br>(b) \\(4x + 2y - z = 1\\)<br>(c) \\(H(3, -4, 3)\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Vectors"],
          subtopics: ["Equations of lines or planes", "Intersection of line and plane"],
          marks: [2, 4, 3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2017 Q16</span></strong></small><p>On a suitable domain, a curve is defined by the equation \\(4x^2 + 9y^2 = 36.\\) A section of the curve in the first quadrant, illustrated in the diagram below, is rotated \\(360^\\circ\\) about the \\(y\\)-axis.</p><img src="/img/Adv_Higher_Maths_Past_Papers/2017/2017_Q16.png" alt="Curve of 4x^2 + 9y^2 = 36 rotated about y-axis"><p>Calculate the exact value of the volume generated.</p>`,
          answer: `\\(12\\pi\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Integration"],
          subtopics: ["Volume of revolution"],
          marks: [5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2017 Q17</span></strong></small><p>The complex number \\(z = 2+i\\) is a root of the polynomial equation \\(z^4 - 6z^3 + 16z^2 - 22z + q = 0\\), where \\(q \\in \\mathbb{Z}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>State a second root of the equation.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Find the value of \\(q\\) and the remaining roots.</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Show the solutions to \\(z^4 - 6z^3 + 16z^2 - 22z + q = 0\\) on an Argand diagram.</p>`,
          answer: `(a) \\(2 - i\\)<br>(b) \\(q = 15\\)<br>Remaining roots are \\(1 + \\sqrt{2}i\\) and \\(1 - \\sqrt{2}i.\\)<br>(c) An Argand diagram showing the points \\((2, 1)\\), \\((2, -1)\\), \\((1, \\sqrt{2})\\), and \\((1, -\\sqrt{2})\\) plotted correctly relative to each other.`,
          videoId: "",
          timestamp: "",
          topics: ["Complex Numbers"],
          subtopics: ["Equations with complex roots", "Argand diagram"],
          marks: [1, 6, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2017 Q18</span></strong></small><p>The position of a particle at time \\(t\\) is given by the parametric equations \\(x=t\\cos t\\), \\(y=t\\sin t\\) (\\(t \\ge 0\\)).</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find an expression for the instantaneous speed of the particle.</p><p>The diagram below shows the path that the particle takes.</p><img src="/img/Adv_Higher_Maths_Past_Papers/2017/2017_Q18.png" alt="Spiral path of a particle with point A marked"><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Calculate the instantaneous speed of the particle at point A.</p>`,
          answer: `(a) \\(\\sqrt{1 + t^2}\\)<br>(b) \\(\\sqrt{1 + 9\\pi^2}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Parametric differentiation", "Rectilinear motion"],
          marks: [5, 2]
        }
      ]
    }
  ]
};
