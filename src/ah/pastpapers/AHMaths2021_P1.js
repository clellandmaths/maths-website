export const advHigherMaths2021P1 = {
  year: 2021,
  papers: [
    {
      paperNumber: 1,
      questions: [
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P1 Q1(a)</span></strong></small><p>Differentiate \\(y = x^3e^{5x}.\\)</p>`,
          answer: `\\(3x^2e^{5x} + 5x^3e^{5x}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P1 Q1(b)</span></strong></small><p>Given \\(y = \\frac{\\tan x}{x^6 + 1}\\)<br>find \\(\\frac{dy}{dx}.\\)</p>`,
          answer: `\\(\\frac{(x^6 + 1)\\sec^2 x - 6x^5\\tan x}{(x^6 + 1)^2}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P1 Q2</span></strong></small><p>Matrices \\(A\\) and \\(B\\) are defined as follows</p><p>\\(A = \\begin{pmatrix} -2 & 4 \\\\ -3 & 7 \\end{pmatrix}\\),<br>\\(B = \\begin{pmatrix} 4 & 0 \\\\ 2 & 3 \\\\ -2 & 1 \\end{pmatrix}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find \\(AB'\\), where \\(B'\\) is the transpose of \\(B.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Find \\(A^{-1}.\\)</p>`,
          answer: `(a) \\(\\begin{pmatrix} -8 & 8 & 8 \\\\ -12 & 15 & 13 \\end{pmatrix}\\)<br>(b) \\(\\frac{1}{2}\\begin{pmatrix} -7 & 4 \\\\ -3 & 2 \\end{pmatrix}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Matrices"],
          subtopics: ["Matrix operations", "Determinant and inverse"],
          marks: [2, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P1 Q3</span></strong></small><p>Use the substitution \\(u = \\sin \\theta\\) to find \\(\\int \\cos \\theta \\sin^3 \\theta \\, d\\theta.\\)<br>Write your answer in terms of \\(\\theta.\\)</p>`,
          answer: `\\(\\frac{1}{4}\\sin^4 \\theta + c\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Integration"],
          subtopics: ["Integration by substitution"],
          marks: [2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P1 Q4</span></strong></small><p>A system of equations is given by</p><p>\\(x + 2y + z = 5\\)<br>\\(3x - y + 2z = 4\\)<br>\\(-2x + 3y + \\lambda z = -8\\)</p><p>where \\(\\lambda \\in \\mathbb{R}.\\)</p><p>Use Gaussian elimination to determine the value of \\(\\lambda\\) for which this system of equations has no solution.</p>`,
          answer: `\\(-1\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Systems of Equations"],
          subtopics: [],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P1 Q5</span></strong></small><p>A solid is formed by rotating the curve with equation \\(y = 2\\sqrt{x}\\) between \\(x = 3\\) and \\(x = 5\\) through \\(2\\pi\\) radians about the \\(x\\)-axis.<br>Calculate the exact value of the volume of this solid.</p>`,
          answer: `\\(32\\pi\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Integration"],
          subtopics: ["Volume of revolution"],
          marks: [2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P1 Q6</span></strong></small><p>The velocity, \\(v\\) ms\\(^{-1}\\), of a particle after \\(t\\) seconds is given by \\(v = 3t^2 - e^{-2t}.\\) At time \\(t = 0\\) the displacement of the particle is zero.</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find an expression for the displacement of the particle.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Calculate the acceleration of the particle when \\(t = 0.\\)</p>`,
          answer: `(a) \\(t^3 + \\frac{1}{2}e^{-2t} - \\frac{1}{2}\\)<br>(b) \\(2\\) ms\\(^{-2}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation", "Integration"],
          subtopics: ["Rectilinear motion"],
          marks: [2, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P1 Q7</span></strong></small><p>A function is defined on a suitable domain by \\(f(x) = \\frac{x^2}{x - 2}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>For the graph of \\(y = f(x)\\)</p><p>(i) state the equation of the vertical asymptote<br>(ii) find the equation of the non-vertical asymptote. Justify your answer.</p><p>The turning points on the graph are (0, 0) and (4, 8). There are no other stationary points.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>On the diagram provided, sketch the graph of \\(y = f(x).\\)</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>(i) On the diagram provided, sketch the graph of \\(y = |f(x)|.\\) Show all asymptotes.</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>(ii) State the values of \\(k\\) for which \\(|f(x)| = k\\) has exactly two distinct solutions.</p>`,
          answer: `(a)(i) \\(x = 2\\)<br>(a)(ii) \\(y = x + 2\\) (Justification: As \\(x \\rightarrow \\pm \\infty\\), \\(\\frac{4}{x - 2} \\rightarrow 0\\))<br>(b) A sketch showing the shape of the curve approaching the asymptotes (\\(x = 2\\) and \\(y = x + 2\\)), with turning points at (0, 0) and (4, 8).<br>(c)(i) A sketch showing the shape of the curve approaching the asymptotes, with the negative section reflected above the \\(x\\)-axis.<br>(c)(ii) \\(0 < k < 8\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Functions & Graphs"],
          subtopics: ["Asymptotes", "Sketching related functions"],
          marks: [1, 2, 1, 1, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P1 Q8</span></strong></small><p>Find the particular solution of the differential equation</p><p>\\(\\frac{d^2y}{dx^2} + \\frac{dy}{dx} - 6y = 35e^{2x}\\)</p><p>given \\(y = 5\\) and \\(\\frac{dy}{dx} = 12\\) when \\(x = 0.\\)</p>`,
          answer: `\\(y = 4e^{2x} + e^{-3x} + 7xe^{2x}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differential Equations"],
          subtopics: ["Second order non-homogeneous"],
          marks: [9]
        }
      ]
    }
  ]
};
