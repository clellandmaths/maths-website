export const advHigherMaths2019 = {
  year: 2019,
  papers: [
    {
      paperNumber: 1,
      questions: [
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q1(a)</span></strong></small><p>Differentiate \\(f(x) = x^6 \\cot 5x.\\)</p>`,
          answer: `\\(6x^5 \\cot 5x - 5x^6 \\text{cosec}^2 5x\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q1(b)</span></strong></small><p>Given \\(y = \\frac{2x^3+1}{x^3-4}\\), find \\(\\frac{dy}{dx}.\\) Simplify your answer.</p>`,
          answer: `\\(\\frac{-27x^2}{(x^3 - 4)^2}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q1(c)</span></strong></small><p>For \\(f(x) = \\cos^{-1} 2x\\), evaluate \\(f'\\left(\\frac{\\sqrt{3}}{4}\\right).\\)</p>`,
          answer: `\\(-4\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q2</span></strong></small><p>Matrix \\(A\\) is defined by</p><p>\\(A = \\begin{pmatrix} 2 & 1 & 4 \\\\ -3 & p & 2 \\\\ -1 & -2 & 5 \\end{pmatrix}\\)</p><p>where \\(p \\in \\mathbb{R}.\\)<br>(a) Given that the determinant of \\(A\\) is 3, find the value of \\(p.\\)</p><p>Matrix \\(B\\) is defined by</p><p>\\(B = \\begin{pmatrix} 0 & 1 \\\\ q & 3 \\\\ 4 & 0 \\end{pmatrix}\\)</p><p>where \\(q \\in \\mathbb{R}.\\)<br>(b) Find \\(AB.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Explain why \\(AB\\) does not have an inverse.</p>`,
          answer: `(a) \\(-3\\)<br>(b) \\(\\begin{pmatrix} q+16 & 5 \\\\ -3q+8 & -12 \\\\ -2q+20 & -7 \\end{pmatrix}\\)<br>(c) \\(AB\\) is not a square matrix, and inverses are only defined for square matrices.`,
          videoId: "",
          timestamp: "",
          topics: ["Matrices"],
          subtopics: ["Determinant and inverse", "Matrix operations"],
          marks: [3, 2, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q3</span></strong></small><p>The function \\(f(x)\\) is defined by \\(f(x) = x^2 - a^2.\\) The graph of \\(y = f(x)\\) is shown in the diagram.</p><img src="/img/Adv_Higher_Maths_Past_Papers/2019/2019_Q3.png" alt="Graph of y = x^2 - a^2"><p><span class="text-cyan-400 font-bold mr-1">(a)</span>State whether \\(f(x)\\) is odd, even or neither. Give a reason for your answer.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Sketch the graph of \\(y = |f(x)|.\\)</p>`,
          answer: `(a) Even. The graph is symmetrical about the \\(y\\)-axis (or \\(f(-x) = f(x)\\)).<br>(b) A curve with \\(x\\)-intercepts at \\(-a\\) and \\(a\\), a local maximum at \\((0, a^2)\\) on the \\(y\\)-axis, and exhibiting line symmetry about the \\(y\\)-axis.`,
          videoId: "",
          timestamp: "",
          topics: ["Functions & Graphs"],
          subtopics: ["Odd and even functions", "Sketching related functions"],
          marks: [1, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q4</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Express \\(\\frac{3x^2+x-17}{x^2-x-12}\\) in the form</p><p>\\(p + \\frac{qx+r}{x^2-x-12}\\)</p><p>where \\(p\\), \\(q\\) and \\(r\\) are integers.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Hence express \\(\\frac{3x^2+x-17}{x^2-x-12}\\) with partial fractions.</p>`,
          answer: `(a) \\(3 + \\frac{4x+19}{x^2-x-12}\\)<br>(b) \\(3 - \\frac{1}{x+3} + \\frac{5}{x-4}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Partial Fractions"],
          subtopics: ["Improper rational functions"],
          marks: [1, 3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q5</span></strong></small><p>For \\(x = \\ln(2t+7)\\) and \\(y = t^2\\), \\(t > 0\\), find</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>\\(\\frac{dy}{dx}\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>\\(\\frac{d^2y}{dx^2}.\\)</p>`,
          answer: `(a) \\(\\frac{1}{2}(2t+7)(2t)\\) or \\(2t^2+7t\\)<br>(b) \\(\\frac{1}{2}(2t+7)(4t+7)\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Parametric differentiation"],
          marks: [2, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q6</span></strong></small><p>A spherical balloon of radius \\(r\\) cm, \\(r > 0\\), deflates at a constant rate of 60 cm\\(^3\\)s\\(^{-1}.\\)<br>Calculate the rate of change of the radius with respect to time when \\(r = 3.\\)<br>[The volume of a sphere is given by \\(V = \\frac{4}{3}\\pi r^3.\\)]</p>`,
          answer: `\\(-\\frac{5}{3\\pi}\\) cm s\\(^{-1}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Related rates of change"],
          marks: [3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q7</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find an expression for \\(\\sum_{r=1}^{n}(6r+13)\\) in terms of \\(n.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Hence, or otherwise, find \\(\\sum_{r=p+1}^{20}(6r+13).\\)</p>`,
          answer: `(a) \\(3n^2 + 16n\\)<br>(b) \\(1520 - 3p^2 - 16p\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Sequences & Series"],
          subtopics: ["Summation formulae"],
          marks: [1, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q8</span></strong></small><p>Find the particular solution of the differential equation</p><p>\\(\\frac{d^2y}{dx^2} + 11\\frac{dy}{dx} + 28y = 0\\)</p><p>given that \\(y = 0\\) and \\(\\frac{dy}{dx} = 9\\), when \\(x = 0.\\)</p>`,
          answer: `\\(y = 3e^{-4x} - 3e^{-7x}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differential Equations"],
          subtopics: ["Second order homogeneous"],
          marks: [5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q9</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Write down and simplify the general term in the binomial expansion of</p><p>\\(\\left(2x^2 - \\frac{d}{x^3}\\right)^7\\),</p><p>where \\(d\\) is a constant.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Given that the coefficient of \\(\\frac{1}{x}\\) is \\(-70\\ 000\\), find the value of \\(d.\\)</p>`,
          answer: `(a) \\(\\binom{7}{r} 2^{7-r} (-d)^r x^{14-5r}\\)<br>(b) \\(d = 5\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Binomial Theorem"],
          subtopics: ["General and specific terms"],
          marks: [3, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q10</span></strong></small><p>A curve is defined implicitly by the equation \\(x^2 + y^2 = xy + 12.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find an expression for \\(\\frac{dy}{dx}\\) in terms of \\(x\\) and \\(y.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>There are two points where the tangent to the curve has equation \\(x = k\\), \\(k \\in \\mathbb{R}.\\)<br>Find the values of \\(k.\\)</p>`,
          answer: `(a) \\(\\frac{y - 2x}{2y - x}\\)<br>(b) \\(k = \\pm 4\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Implicit differentiation"],
          marks: [3, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q11</span></strong></small><p>Let \\(n\\) be a positive integer.</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find a counterexample to show that the following statement is false.</p><p>\\(n^2 + n + 1\\) is always a prime number.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>(i) Write down the contrapositive of:<br>If \\(n^2 - 2n + 7\\) is even then \\(n\\) is odd.</p><p>(ii) Use the contrapositive to prove that if \\(n^2 - 2n + 7\\) is even then \\(n\\) is odd.</p>`,
          answer: `(a) When \\(n=4\\), \\(n^2+n+1 = 21\\), which is not prime.<br>(b)(i) If \\(n\\) is even (not odd) then \\(n^2 - 2n + 7\\) is odd (not even).<br>(b)(ii) Let \\(n = 2k\\), \\(k \\in \\mathbb{N}.\\)<br>\\(n^2 - 2n + 7 = (2k)^2 - 2(2k) + 7 = 4k^2 - 4k + 7 = 2(2k^2 - 2k + 3) + 1.\\)<br>Since \\(2k^2 - 2k + 3 \\in \\mathbb{N}\\), this is odd. The contrapositive statement is true and therefore the original statement is true.`,
          videoId: "",
          timestamp: "",
          topics: ["Methods of Proof"],
          subtopics: ["Disproof by counterexample", "Proof by contrapositive"],
          marks: [1, 1, 3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q12</span></strong></small><p>Express \\(231_{11}\\) in base 7.</p>`,
          answer: `\\(543_7\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Number Theory"],
          subtopics: ["Number bases"],
          marks: [3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q13</span></strong></small><p>An electronic device contains a timer circuit that switches off when the voltage, \\(V\\), reaches a set value.<br>The rate of change of the voltage is given by</p><p>\\(\\frac{dV}{dt} = k(12 - V)\\),</p><p>where \\(k\\) is a constant, \\(t\\) is the time in seconds, and \\(0 \\le V < 12.\\)<br>Given that \\(V = 2\\) when \\(t = 0\\), express \\(V\\) in terms of \\(k\\) and \\(t.\\)</p>`,
          answer: `\\(V = 12 - 10e^{-kt}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differential Equations"],
          subtopics: ["First order separable, in context"],
          marks: [5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q14</span></strong></small><p>Prove by induction that</p><p>\\(\\sum_{r=1}^{n}r!r = (n+1)! - 1\\)</p><p>for all positive integers \\(n.\\)</p>`,
          answer: `Proof by induction showing true for \\(n=1\\) (LHS = RHS = 1), assuming true for \\(n=k\\), and showing the sum to \\(k+1\\) yields \\(((k+1)+1)! - 1\\), concluding the proof for all positive integers \\(n.\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Methods of Proof"],
          subtopics: ["Proof by induction"],
          marks: [5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q15</span></strong></small><p>The equations of two planes are given below.<br>\\(\\pi_1: 2x - 3y - z = 9\\)<br>\\(\\pi_2: x + y - 3z = 2\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Verify that the line of intersection, \\(L_1\\), of these two planes has parametric equations<br>\\(x = 2\\lambda + 3\\)<br>\\(y = \\lambda - 1\\)<br>\\(z = \\lambda\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Let \\(\\pi_3\\) be the plane with equation \\(-2x + 4y + 3z = 4.\\)<br>Calculate the acute angle between the line \\(L_1\\) and the plane \\(\\pi_3.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>\\(L_2\\) is the line perpendicular to \\(\\pi_3\\) passing through \\(P(1, 3, -2).\\)<br>Determine whether or not \\(L_1\\) and \\(L_2\\) intersect.</p>`,
          answer: `(a) Substitute \\(x, y, z\\) into both plane equations: e.g. \\(2(2\\lambda+3) - 3(\\lambda-1) - \\lambda = 4\\lambda + 6 - 3\\lambda + 3 - \\lambda = 9\\) (matches \\(\\pi_1\\)). \\((2\\lambda+3) + (\\lambda-1) - 3(\\lambda) = 2\\) (matches \\(\\pi_2\\)). Both verify successfully.<br>(b) \\(13^\\circ\\) or \\(0.229\\) radians<br>(c) The lines do not intersect (equating parameters leads to an inconsistency, e.g. \\(0 = -5\\)).`,
          videoId: "",
          timestamp: "",
          topics: ["Vectors"],
          subtopics: ["Intersection of planes", "Intersection of lines", "Intersection of line and plane"],
          marks: [2, 3, 4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q16</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Use integration by parts to find the exact value of</p><p>\\(\\int_{0}^{1}(x^2 - 2x + 1)e^{4x}dx.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>A solid is formed by rotating the curve with equation \\(y = 4(x - 1)e^{2x}\\) between \\(x = 0\\) and \\(x = 1\\) through \\(2\\pi\\) radians about the \\(x\\)-axis.<br>Find the exact value of the volume of this solid.</p>`,
          answer: `(a) \\(\\frac{1}{32}(e^4 - 13)\\)<br>(b) \\(\\frac{\\pi}{2}(e^4 - 13)\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Integration"],
          subtopics: ["Integration by parts", "Volume of revolution"],
          marks: [5, 3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q17</span></strong></small><p>The first three terms of a sequence are given by<br>\\(5x + 8,\\ -2x + 1,\\ x - 4\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>When \\(x = 11\\), show that the first three terms form the start of a geometric sequence, and state the value of the common ratio.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Given that the entire sequence is geometric for \\(x = 11\\)<br>(i) state why the associated series has a sum to infinity<br>(ii) calculate this sum to infinity.</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>There is a second value for \\(x\\) that also gives a geometric sequence.<br>For this second sequence<br>(i) show that \\(x^2 - 8x - 33 = 0\\)<br>(ii) find the first three terms<br>(iii) state the value of \\(S_{2n}\\) and justify your answer.</p>`,
          answer: `(a) Terms are 63, -21, 7. Ratios are \\(\\frac{-21}{63} = -\\frac{1}{3}\\) and \\(\\frac{7}{-21} = -\\frac{1}{3}.\\) Common ratio is \\(r = -\\frac{1}{3}.\\)<br>(b)(i) The sum to infinity exists because \\(\\left| -\\frac{1}{3} \\right| < 1.\\)<br>(b)(ii) \\(\\frac{189}{4}\\) or \\(47.25\\)<br>(c)(i) Equating ratios \\(\\frac{-2x+1}{5x+8} = \\frac{x-4}{-2x+1}\\) leads to \\(x^2-8x-33=0.\\)<br>(c)(ii) \\(x = -3\\), giving terms -7, 7, -7.<br>(c)(iii) \\(S_{2n} = 0\\) because \\(2n\\) is an even number of terms, and the pairs cancel each other out.`,
          videoId: "",
          timestamp: "",
          topics: ["Sequences & Series"],
          subtopics: ["Geometric sequences and series"],
          marks: [2, 1, 2, 2, 2, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2019 Q18</span></strong></small><p>The complex number \\(w\\) has been plotted on an Argand diagram, as shown below.</p><img src="/img/Adv_Higher_Maths_Past_Papers/2019/2019_Q18.png" alt="Argand diagram showing complex number w"><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Express \\(w\\) in<br>(i) Cartesian form<br>(ii) polar form.</p><p>The complex number \\(z_1\\) is a root of \\(z^3 = w\\), where<br>\\(z_1 = k\\left(\\cos \\frac{\\pi}{m} + i\\sin \\frac{\\pi}{m}\\right)\\)<br>for integers \\(k\\) and \\(m.\\)</p><p>Given that \\(a = 4\\),<br>(b) (i) use de Moivre's theorem to obtain the values of \\(k\\) and \\(m\\), and<br>(ii) find the remaining roots.</p>`,
          answer: `(a)(i) \\(a - a\\sqrt{3}i\\)<br>(a)(ii) \\(2a\\left(\\cos\\left(-\\frac{\\pi}{3}\\right) + i\\sin\\left(-\\frac{\\pi}{3}\\right)\\right)\\)<br>(b)(i) \\(k = 2\\) and \\(m = -9\\)<br>(b)(ii) \\(z_2 = 2\\left(\\cos\\left(\\frac{5\\pi}{9}\\right) + i\\sin\\left(\\frac{5\\pi}{9}\\right)\\right)\\)<br>\\(z_3 = 2\\left(\\cos\\left(-\\frac{7\\pi}{9}\\right) + i\\sin\\left(-\\frac{7\\pi}{9}\\right)\\right)\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Complex Numbers"],
          subtopics: ["Argand diagram", "de Moivre's theorem"],
          marks: [1, 3, 4, 2]
        }
      ]
    }
  ]
};
