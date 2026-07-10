export const advHigherMaths2024P1 = {
  year: 2024,
  papers: [
    {
      paperNumber: 1,
      questions: [
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P1 Q1</span></strong></small><p>Differentiate the following with respect to \\(x\\):</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>\\(y = \\cot 3x\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>\\(f(x) = 5x(4x - 7)^{\\frac{1}{2}}\\)</p>`,
          answer: `(a) \\(-3\\operatorname{cosec}^2 3x\\)<br>(b) \\(5(4x - 7)^{\\frac{1}{2}} + 10x(4x - 7)^{-\\frac{1}{2}}\\)`,
          videoId: "zPqCso-_dBg",
          timestamp: "6s",
          topics: ["Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [2, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P1 Q2</span></strong></small><p>A complex number is defined by \\(z = 1 + i.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Express \\(z\\) in polar form.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Use de Moivre's theorem to evaluate \\(z^8.\\)</p>`,
          answer: `(a) \\(\\sqrt{2}\\left(\\cos\\frac{\\pi}{4} + i\\sin\\frac{\\pi}{4}\\right)\\)<br>(b) \\(16\\)`,
          videoId: "zPqCso-_dBg",
          timestamp: "2m25s",
          topics: ["Complex Numbers"],
          subtopics: ["Argand diagram", "de Moivre's theorem"],
          marks: [2, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P1 Q3</span></strong></small><p>A geometric sequence of positive terms has third term 36 and fifth term 16.</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Calculate the value of the common ratio.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Calculate the value of the first term.</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>State why the associated geometric series has a sum to infinity.</p><p><span class="text-cyan-400 font-bold mr-1">(d)</span>Find the value of this sum to infinity.</p>`,
          answer: `(a) \\(\\frac{2}{3}\\)<br>(b) \\(81\\)<br>(c) Because \\(|\\frac{2}{3}| < 1\\) (or \\(-1 < \\frac{2}{3} < 1\\))<br>(d) \\(243\\)`,
          videoId: "zPqCso-_dBg",
          timestamp: "4m41s",
          topics: ["Sequences & Series"],
          subtopics: ["Geometric sequences and series"],
          marks: [2, 1, 1, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P1 Q4</span></strong></small><p>Matrix \\(A\\) is defined by \\(A = \\begin{pmatrix} 6 & 1 \\\\ 11 & 3 \\end{pmatrix}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find \\(A^{-1}\\), the inverse of matrix \\(A.\\)</p><p>Matrix \\(B\\) is defined by \\(B = \\begin{pmatrix} -4 & 3 \\\\ -5 & 2 \\end{pmatrix}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Find the matrix \\(M\\) such that \\(AM = B.\\)</p>`,
          answer: `(a) \\(\\frac{1}{7}\\begin{pmatrix} 3 & -1 \\\\ -11 & 6 \\end{pmatrix}\\)<br>(b) \\(\\begin{pmatrix} -1 & 1 \\\\ 2 & -3 \\end{pmatrix}\\)`,
          videoId: "zPqCso-_dBg",
          timestamp: "7m15s",
          topics: ["Matrices"],
          subtopics: ["Determinant and inverse", "Matrix operations"],
          marks: [2, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P1 Q5</span></strong></small><p>The function \\(f(x)\\) is defined by \\(f(x) = x^3 - x\\), \\(x \\in \\mathbb{R}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Determine whether \\(f(x)\\) is even, odd or neither.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Show that the graph of \\(y = f(x)\\) has a point of inflection.</p>`,
          answer: `(a) Odd (since \\(f(-x) = -x^3 + x = -(x^3 - x) = -f(x)\\))<br>(b) \\(f''(x) = 6x = 0\\) at \\(x = 0.\\) Since \\(f''(x) > 0\\) for \\(x > 0\\) and \\(f''(x) < 0\\) for \\(x < 0\\), concavity changes, indicating a point of inflection.`,
          videoId: "zPqCso-_dBg",
          timestamp: "9m16s",
          topics: ["Functions & Graphs"],
          subtopics: ["Odd and even functions", "Points of inflection"],
          marks: [2, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P1 Q6</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find the \\(2 \\times 2\\) matrix, \\(A\\), associated with a reflection in the \\(x\\)-axis.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Describe the transformation associated with the matrix \\(B = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Find the \\(2 \\times 2\\) matrix, \\(C\\), associated with a reflection in the \\(x\\)-axis followed by the transformation associated with \\(\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}.\\)</p>`,
          answer: `(a) \\(\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}\\)<br>(b) Reflection in the line \\(y = x.\\)<br>(c) \\(\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}\\)`,
          videoId: "zPqCso-_dBg",
          timestamp: "11m44s",
          topics: ["Matrices"],
          subtopics: ["Transformation matrices"],
          marks: [1, 1, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P1 Q7</span></strong></small><p>A curve is defined by the equation \\(x^2y + 4xy^2 = -32\\), \\(y > 0.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Use implicit differentiation to find an expression for \\(\\frac{dy}{dx}.\\)</p><p>The curve has only one stationary point.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Find the coordinates of the stationary point.</p>`,
          answer: `(a) \\(\\frac{-2xy - 4y^2}{x^2 + 8xy}\\)<br>(b) \\((-4, 2)\\)`,
          videoId: "zPqCso-_dBg",
          timestamp: "13m54s",
          topics: ["Differentiation"],
          subtopics: ["Implicit differentiation"],
          marks: [3, 3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2024 P1 Q8</span></strong></small><p>Use the substitution \\(u = \\tan 2x\\) to evaluate</p><p>\\(\\int_{0}^{\\frac{\\pi}{8}} \\frac{\\sqrt{\\tan 2x}}{\\cos^2 2x} \\,dx.\\)</p>`,
          answer: `\\(\\frac{1}{3}\\)`,
          videoId: "zPqCso-_dBg",
          timestamp: "17m33s",
          topics: ["Integration"],
          subtopics: ["Integration by substitution"],
          marks: [4]
        }
      ]
    }
  ]
};
