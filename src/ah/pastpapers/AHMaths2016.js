export const advHigherMaths2016 = {
  year: 2016,
  papers: [
    {
      paperNumber: 1,
      questions: [
        {
          question: `<small><strong><span style="white-space: nowrap;">2016 Q1(a)</span></strong></small><p>Differentiate \\(y = x \\tan^{-1} 2x.\\)</p>`,
          answer: `\\(\\tan^{-1} 2x + \\frac{2x}{1 + 4x^2}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2016 Q1(b)</span></strong></small><p>Given \\(f(x) = \\frac{1 - x^2}{1 + 4x^2}\\), find \\(f'(x)\\), simplifying your answer.</p>`,
          answer: `\\(-\\frac{10x}{(1 + 4x^2)^2}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2016 Q1(c)</span></strong></small><p>A curve is given by the parametric equations \\(x = 6t\\) and \\(y = 1 - \\cos t.\\)<br>Find \\(\\frac{dy}{dx}\\) in terms of \\(t.\\)</p>`,
          answer: `\\(\\frac{1}{6}\\sin t\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Parametric differentiation"],
          marks: [2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2016 Q2</span></strong></small><p>A geometric sequence has second and fifth terms 108 and 4 respectively.</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Calculate the value of the common ratio.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>State why the associated geometric series has a sum to infinity.</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Find the value of this sum to infinity.</p>`,
          answer: `(a) \\(r = \\frac{1}{3}\\)<br>(b) A sum to infinity exists because \\(-1 < \\frac{1}{3} < 1\\)<br>(c) 486`,
          videoId: "",
          timestamp: "",
          topics: ["Sequences & Series"],
          subtopics: ["Geometric sequences and series"],
          marks: [3, 1, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2016 Q3</span></strong></small><p>Write down and simplify the general term in the binomial expansion of \\(\\left(\\frac{3}{x} - 2x\\right)^{13}.\\)<br>Hence, or otherwise, find the term in \\(x^9.\\)</p>`,
          answer: `General term: \\(\\binom{13}{r}(3)^{13-r}(-2)^rx^{2r-13}\\)<br>Term in \\(x^9\\): \\(-1437696x^9\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Binomial Theorem"],
          subtopics: ["General and specific terms"],
          marks: [5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2016 Q4</span></strong></small><p>Below is a system of equations:</p><p>\\(x + 2y + 3z = 3\\)<br>\\(2x - y + 4z = 5\\)<br>\\(x - 3y + 2\\lambda z = 2\\)</p><p>Use Gaussian elimination to find the value of \\(\\lambda\\) which leads to redundancy.</p>`,
          answer: `\\(\\lambda = \\frac{1}{2}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Systems of Equations"],
          subtopics: [],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2016 Q5</span></strong></small><p>Prove by induction that \\(\\sum_{r=1}^{n}r(3r - 1) = n^2(n + 1)\\) , \\(\\forall n \\in \\mathbb{N}.\\)</p>`,
          answer: `Proof by induction showing true for \\(n=1\\) (LHS = RHS = 2), assuming true for \\(n=k\\), and showing the sum to \\(k+1\\) simplifies to \\((k+1)^2((k+1) + 1)\\), concluding the proof for all \\(n \\in \\mathbb{N}.\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Methods of Proof"],
          subtopics: ["Proof by induction"],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2016 Q6</span></strong></small><p>Find Maclaurin expansions for \\(\\sin 3x\\) and \\(e^{4x}\\) up to and including the term in \\(x^3.\\)<br>Hence obtain an expansion for \\(e^{4x}\\sin 3x\\) up to and including the term in \\(x^3.\\)</p>`,
          answer: `\\(\\sin 3x = 3x - \\frac{9}{2}x^3 \\dots\\)<br>\\(e^{4x} = 1 + 4x + 8x^2 + \\frac{32}{3}x^3 \\dots\\)<br>\\(e^{4x}\\sin 3x = 3x + 12x^2 + \\frac{39}{2}x^3 \\dots\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Maclaurin Series"],
          subtopics: [],
          marks: [6]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2016 Q7</span></strong></small><p>A is the matrix \\(\\begin{pmatrix} 2 & 0 \\\\ \\lambda & -1 \\end{pmatrix}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find the determinant of matrix A.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Show that \\(A^2\\) can be expressed in the form \\(pA + qI\\), stating the values of \\(p\\) and \\(q.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Obtain a similar expression for \\(A^4.\\)</p>`,
          answer: `(a) \\(-2\\)<br>(b) \\(A^2 = A + 2I\\), so \\(p = 1\\) and \\(q = 2\\)<br>(c) \\(5A + 6I\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Matrices"],
          subtopics: ["Matrix operations", "Determinant and inverse"],
          marks: [1, 3, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2016 Q8</span></strong></small><p>Let \\(z = \\sqrt{3} - i.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Plot \\(z\\) on an Argand diagram.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Let \\(w = az\\) where \\(a > 0\\), \\(a \\in \\mathbb{R}.\\)<br>Express \\(w\\) in polar form.</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Express \\(w^8\\) in the form \\(ka^n(x + i\\sqrt{y})\\) where \\(k, x, y \\in \\mathbb{Z}.\\)</p>`,
          answer: `(a) Point plotted at \\((\\sqrt{3}, -1)\\) in the 4th quadrant of the Argand diagram.<br>(b) \\(2a\\left(\\cos\\left(-\\frac{\\pi}{6}\\right) + i\\sin\\left(-\\frac{\\pi}{6}\\right)\\right)\\)<br>(c) \\(128a^8(-1 + i\\sqrt{3})\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Complex Numbers"],
          subtopics: ["Argand diagram", "de Moivre's theorem"],
          marks: [1, 2, 3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2016 Q9</span></strong></small><p>Obtain \\(\\int x^7(\\ln x)^2 \\,dx.\\)</p>`,
          answer: `\\(\\frac{1}{8}x^8(\\ln x)^2 - \\frac{1}{32}x^8(\\ln x) + \\frac{1}{256}x^8 + c\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Integration"],
          subtopics: ["Integration by parts"],
          marks: [6]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2016 Q10</span></strong></small><p>For each of the following statements, decide whether it is true or false.<br>If true, give a proof; if false, give a counterexample.</p><p>A. If a positive integer \\(p\\) is prime, then so is \\(2p + 1.\\)</p><p>B. If a positive integer \\(n\\) has remainder 1 when divided by 3, then \\(n^3\\) also has remainder 1 when divided by 3.</p>`,
          answer: `A: False. Counterexample: let \\(p=7\\), then \\(2p+1 = 15\\), which is not prime.<br>B: True. Proof: let \\(n = 3a+1\\), then \\(n^3 = (3a+1)^3 = 27a^3 + 27a^2 + 9a + 1 = 3(9a^3 + 9a^2 + 3a) + 1\\), which leaves a remainder of 1 when divided by 3.`,
          videoId: "",
          timestamp: "",
          topics: ["Methods of Proof"],
          subtopics: ["Disproof by counterexample", "Direct proof"],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2016 Q11</span></strong></small><p>The height of a cube is increasing at the rate of 5 cm s\\(^{-1}.\\)<br>Find the rate of increase of the volume when the height of the cube is 3 cm.</p>`,
          answer: `\\(135 \\text{ cm}^3\\text{s}^{-1}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Related rates of change"],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2016 Q12</span></strong></small><p>Below is a diagram showing the graph of a linear function, \\(y = f(x).\\)</p><img src="/img/Adv_Higher_Maths_Past_Papers/2016/2016_Q12.png" alt="Graph of y = f(x)"><p>On separate diagrams show:</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>\\(y = |f(x) - c|\\)<br>(b) \\(y = |2f(x)|\\)</p>`,
          answer: `(a) V-shaped graph meeting the positive x-axis at \\(c\\) and passing through \\(2c\\) on the positive y-axis.<br>(b) Symmetrical V-shaped graph meeting the origin at \\((c, 0)\\) and passing through \\(2c\\) on the positive y-axis.`,
          videoId: "",
          timestamp: "",
          topics: ["Functions & Graphs"],
          subtopics: ["Sketching related functions"],
          marks: [2, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2016 Q13</span></strong></small><p>Express \\(\\frac{3x+32}{(x+4)(6-x)}\\) in partial fractions and hence evaluate</p><p>\\(\\int_{3}^{4}\\frac{3x+32}{(x+4)(6-x)} \\,dx.\\)</p><p>Give your answer in the form \\(\\ln\\left(\\frac{p}{q}\\right).\\)</p>`,
          answer: `Partial fractions: \\(\\frac{2}{x+4} + \\frac{5}{6-x}\\)<br>Integral evaluation: \\(\\ln\\left(\\frac{486}{49}\\right)\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Partial Fractions","Integration"],
          subtopics: ["Proper rational functions", "Integrating rational functions"],
          marks: [9]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2016 Q14</span></strong></small><p>Two lines \\(L_1\\) and \\(L_2\\) are given by the equations:</p><p>\\(L_1: x = 4 + 3\\lambda, y = 2 + 4\\lambda, z = -7\\lambda\\)<br>\\(L_2: \\frac{x - 3}{-2} = \\frac{y - 8}{1} = \\frac{z + 1}{3}\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Show that the lines \\(L_1\\) and \\(L_2\\) intersect and find the point of intersection.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Calculate the obtuse angle between the lines \\(L_1\\) and \\(L_2.\\)</p>`,
          answer: `(a) Point of intersection is \\((7, 6, -7)\\)<br>(b) \\(135.6^\\circ\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Vectors"],
          subtopics: ["Intersection of lines"],
          marks: [5, 4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2016 Q15</span></strong></small><p>Solve the differential equation</p><p>\\(\\frac{d^2y}{dx^2} + 5\\frac{dy}{dx} + 6y = 12x^2 + 2x - 5\\)</p><p>given \\(y = -6\\) and \\(\\frac{dy}{dx} = 3\\) , when \\(x = 0.\\)</p>`,
          answer: `\\(y = 8e^{-3x} - 15e^{-2x} + 2x^2 - 3x + 1\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differential Equations"],
          subtopics: ["Second order non-homogeneous"],
          marks: [10]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2016 Q16</span></strong></small><p>A beaker of liquid was placed in a fridge.</p><p>The rate of cooling is given by</p><p>\\(\\frac{dT}{dt} = -k(T - T_F)\\), \\(k > 0\\),</p><p>where \\(T_F\\) is the constant temperature in the fridge and \\(T\\) is the temperature of the liquid at time \\(t.\\)</p><ul><li>The constant temperature in the fridge is \\(4^\\circ\\text{C}.\\)</li><li>When first placed in the fridge, the temperature of the liquid was \\(25^\\circ\\text{C}.\\)</li><li>At 12 noon, the temperature of the liquid was \\(9.8^\\circ\\text{C}.\\)</li><li>At 12:15 pm, the temperature of the liquid had dropped to \\(6.5^\\circ\\text{C}.\\)</li></ul><p>At what time, to the nearest minute, was the liquid placed in the fridge?</p>`,
          answer: `11:37 am`,
          videoId: "",
          timestamp: "",
          topics: ["Differential Equations"],
          subtopics: ["First order separable, in context"],
          marks: [9]
        }
      ]
    }
  ]
};
