export const advHigherMaths2024P2 = {
  year: 2024,
  papers: [
    {
      paperNumber: 2,
      questions: [
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P2 Q1</span></strong></small><p>Given \\(y = \\frac{\\sin 7x}{1 + x^2}\\), find \\(\\frac{dy}{dx}.\\)</p>`,
          answer: `\\(\\frac{7 \\cos 7x(1+x^2) - 2x \\sin 7x}{(1+x^2)^2}\\)`,
          videoId: "glLpgi1-Mxc",
          timestamp: "5s",
          topics: ["Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P2 Q2</span></strong></small><p>Use the Euclidean algorithm to find integers \\(a\\) and \\(b\\) such that \\(533a + 455b = 13.\\)</p>`,
          answer: `\\(a = 6, b = -7\\)`,
          videoId: "glLpgi1-Mxc",
          timestamp: "1m2s",
          topics: ["Number Theory"],
          subtopics: ["Euclidean algorithm"],
          marks: [3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P2 Q3</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Use Gaussian elimination to express \\(z\\) in terms of \\(\\lambda\\) for the system of equations:</p><p>\\(x - y - 3z = 1\\)<br>\\(2x - 3y - 5z = 8\\)<br>\\(x + 2y + \\lambda z = -7\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>State the value of \\(\\lambda\\) for which this system is inconsistent.</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Determine the solution of this system when \\(\\lambda = -1.\\)</p>`,
          answer: `(a) \\(z = \\frac{10}{\\lambda + 6}\\)<br>(b) \\(\\lambda = -6\\)<br>(c) \\(x = 3, y = 4, z = 2\\)`,
          videoId: "glLpgi1-Mxc",
          timestamp: "3m37s",
          topics: ["Systems of Equations"],
          subtopics: [],
          marks: [4, 1, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P2 Q4</span></strong></small><p>Solve the differential equation</p><p>\\(\\frac{d^2y}{dx^2} - 2\\frac{dy}{dx} - 8y = 0\\)</p><p>given that \\(y = -2\\) and \\(\\frac{dy}{dx} = 22\\) when \\(x = 0.\\)</p>`,
          answer: `\\(y = -5e^{-2x} + 3e^{4x}\\)`,
          videoId: "glLpgi1-Mxc",
          timestamp: "7m23s",
          topics: ["Differential Equations"],
          subtopics: ["Second order homogeneous"],
          marks: [5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P2 Q5</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>State and simplify the general term in the binomial expansion of \\(\\left(2x^2 - \\frac{1}{x^3}\\right)^{16}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Hence, or otherwise, find the coefficient of \\(\\frac{1}{x^{18}}\\) in the expansion of \\(\\left(2x^2 - \\frac{1}{x^3}\\right)^{16}.\\)</p>`,
          answer: `(a) \\(\\binom{16}{r}(-1)^r 2^{16-r} x^{32-5r}\\)<br>(b) \\(512512\\)`,
          videoId: "glLpgi1-Mxc",
          timestamp: "9m41s",
          topics: ["Binomial Theorem"],
          subtopics: ["General and specific terms"],
          marks: [3, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P2 Q6</span></strong></small><p>A curve is defined parametrically by \\(x = t^2\\) and \\(y = 4t \\ln t\\) where \\(t > 0.\\)<br>Find a fully simplified expression for:</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>\\(\\frac{dy}{dx}\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>\\(\\frac{d^2y}{dx^2}\\)</p>`,
          answer: `(a) \\(\\frac{2(\\ln t + 1)}{t}\\)<br>(b) \\(\\frac{-\\ln t}{t^3}\\)`,
          videoId: "glLpgi1-Mxc",
          timestamp: "12m28s",
          topics: ["Differentiation"],
          subtopics: ["Parametric differentiation"],
          marks: [3, 3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P2 Q7</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find and simplify the Maclaurin expansion, up to and including the term in \\(x^3\\), for:</p><p>(i) \\(e^{2x}\\)</p><p>(ii) \\(\\sin 3x\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Hence find the Maclaurin expansion for \\(e^{2 \\sin 3x}\\) up to and including the term in \\(x^3.\\)</p>`,
          answer: `(a)(i) \\(1 + 2x + 2x^2 + \\frac{4}{3}x^3\\)<br>(a)(ii) \\(3x - \\frac{9}{2}x^3\\)<br>(b) \\(1 + 6x + 18x^2 + 27x^3\\)`,
          videoId: "glLpgi1-Mxc",
          timestamp: "15m49s",
          topics: ["Maclaurin Series"],
          subtopics: [],
          marks: [2, 2, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P2 Q8</span></strong></small><p>A solid is formed by rotating part of the curve with equation \\(y = \\frac{1}{\\sqrt{1+x^2}}\\) about the \\(x\\)-axis through \\(2\\pi\\) radians, from \\(x = 0\\) to \\(x = a.\\)</p><p>The value of the volume of the solid is \\(\\frac{\\pi^2}{3}.\\)</p><p>Determine the value of \\(a.\\)</p>`,
          answer: `\\(\\sqrt{3}\\)`,
          videoId: "glLpgi1-Mxc",
          timestamp: "22m59s",
          topics: ["Integration"],
          subtopics: ["Volume of revolution"],
          marks: [5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P2 Q9</span></strong></small><p>An arithmetic sequence has first term \\(-3\\) and common difference \\(d.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>State an expression for the third term.</p><p>The eighth term is five times the third term.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Find the value of \\(d.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Determine algebraically the least number of terms required so that the sum of the associated series is greater than 500.</p>`,
          answer: `(a) \\(-3 + 2d\\)<br>(b) \\(d = 4\\)<br>(c) \\(18\\)`,
          videoId: "glLpgi1-Mxc",
          timestamp: "25m",
          topics: ["Sequences & Series"],
          subtopics: ["Arithmetic sequences and series"],
          marks: [1, 1, 3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P2 Q10</span></strong></small><p>A metal rod is heated such that its volume increases at a constant rate of \\(12 \\text{ mm}^3\\) per minute.</p><p>The volume of the rod is modelled, throughout the process, by \\(V = 5\\pi r^3\\), where \\(r\\) is measured in millimetres.</p><p>Find the rate at which \\(r\\) is increasing when \\(r = 10.\\)</p>`,
          answer: `\\(\\frac{1}{125\\pi} \\text{ mm per minute}\\)`,
          videoId: "glLpgi1-Mxc",
          timestamp: "29m45s",
          topics: ["Differentiation"],
          subtopics: ["Related rates of change"],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P2 Q11</span></strong></small><p>Consider statements A and B below.<br>For each statement: if true, provide a proof; if false, provide a counterexample.</p><p>A: The sum of the squares of any two consecutive integers is always prime.<br>B: The sum of the squares of any two consecutive integers is always odd.</p>`,
          answer: `Statement A is false: Counterexample, e.g., \\(3^2 + 4^2 = 25\\), which is not prime.<br>Statement B is true: Proof, let the integers be \\(k\\) and \\(k+1.\\) Then \\(k^2 + (k+1)^2 = 2(k^2 + k) + 1\\), which is odd.`,
          videoId: "glLpgi1-Mxc",
          timestamp: "32m",
          topics: ["Methods of Proof"],
          subtopics: ["Disproof by counterexample", "Direct proof"],
          marks: [3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P2 Q12</span></strong></small><p>Given \\(z = x + iy\\), \\(y \\neq 0\\), solve the equation</p><p>\\(z^2 + 20\\bar{z} - 156 = 0\\)</p><p>where \\(\\bar{z}\\) is the complex conjugate of \\(z.\\)</p>`,
          answer: `\\(z = 10 \\pm 12i\\)`,
          videoId: "glLpgi1-Mxc",
          timestamp: "33m40s",
          topics: ["Complex Numbers"],
          subtopics: ["Equations with complex roots"],
          marks: [5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P2 Q13</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Express \\(\\frac{-2}{x(x+1)}\\) in partial fractions.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Use integration by parts to find \\(\\int xe^{3x} dx.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Using your answers to (a) and (b), solve</p><p>\\(\\frac{dy}{dx} - \\frac{2y}{x(x+1)} = \\frac{x^3 e^{3x}}{(x+1)^2}.\\)</p>`,
          answer: `(a) \\(\\frac{-2}{x} + \\frac{2}{x+1}\\)<br>(b) \\(\\frac{1}{3}xe^{3x} - \\frac{1}{9}e^{3x} + c\\)<br>(c) \\(y = \\frac{x^2}{(x+1)^2} \\left( \\frac{1}{3}xe^{3x} - \\frac{1}{9}e^{3x} + c \\right)\\)`,
          videoId: "glLpgi1-Mxc",
          timestamp: "36m34s",
          topics: ["Partial Fractions", "Integration", "Differential Equations"],
          subtopics: ["Proper rational functions", "Integration by parts", "First order linear"],
          marks: [2, 3, 5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P2 Q14</span></strong></small><p>A plane passes through \\(A(2, -1, 8)\\), \\(B(1, 1, -1)\\) and \\(C(4, -2, 11).\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>(i) Determine \\(\\vec{AB}\\) and \\(\\vec{AC}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>(ii) Hence find the Cartesian equation of the plane.</p><p>A line is defined by the equations \\(\\frac{x-1}{1} = \\frac{y+1}{-1} = \\frac{z+1}{4}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Show that the line and the plane do not intersect.</p>`,
          answer: `(a)(i) \\(\\vec{AB} = \\begin{pmatrix} -1 \\\\ 2 \\\\ -9 \\end{pmatrix}\\), \\(\\vec{AC} = \\begin{pmatrix} 2 \\\\ -1 \\\\ 3 \\end{pmatrix}\\)<br>(a)(ii) \\(x + 5y + z = 5\\)<br>(b) Substituting parametric equations \\((x = 1 + \\lambda, y = -1 - \\lambda, z = -1 + 4\\lambda)\\) into the plane gives \\(-5 \\neq 5\\), so they do not intersect.`,
          videoId: "glLpgi1-Mxc",
          timestamp: "43m41s",
          topics: ["Vectors"],
          subtopics: ["Equations of lines or planes", "Intersection of line and plane"],
          marks: [1, 3, 3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P2 Q15</span></strong></small><p>A storage tank contains a mixture of salt and water. An additional amount of salt and water pours in while, at the same time, some of the existing mixture pours out.</p><p>The process can be modelled by the differential equation</p><p>\\(\\frac{dW}{dt} = \\frac{36 - W}{120}, W < 36\\)</p><p>where \\(W\\) is the amount of salt in kilograms at time \\(t\\) minutes. Initially, the storage tank contains 8 kilograms of salt.</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Express \\(W\\) in terms of \\(t.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Find the rate at which the amount of salt is increasing after 67 minutes.</p><p>As the process continues, the amount of salt approaches a limit \\(L\\) kilograms.</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Find the value of \\(L\\), justifying your answer.</p>`,
          answer: `(a) \\(W = 36 - 28e^{-\\frac{1}{120}t}\\)<br>(b) \\(\\frac{7}{30}e^{-\\frac{67}{120}}\\) (or \\(0.13\\)) kilograms per minute<br>(c) \\(L = 36\\), because \\(e^{-\\frac{1}{120}t} \\rightarrow 0\\) as \\(t \\rightarrow \\infty.\\)`,
          videoId: "glLpgi1-Mxc",
          timestamp: "48m54s",
          topics: ["Differential Equations"],
          subtopics: ["First order separable, in context"],
          marks: [5, 2, 1]
        }
      ]
    }
  ]
};
