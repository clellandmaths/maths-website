export const advHigherMaths2023P1 = {
  year: 2023,
  papers: [
    {
      paperNumber: 1,
      questions: [
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P1 Q1</span></strong></small><p>Given \\(y = 7x \\tan 2x\\), find \\(\\frac{dy}{dx}.\\)</p>`,
          answer: `\\(7 \\tan 2x + 14x \\sec^2 2x\\)`,
          videoId: "TIoIgzV5tjU",
          timestamp: "5s",
          topics: ["Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P1 Q2</span></strong></small><p>Express \\(\\frac{3x^2 - x - 14}{(x + 3)(x - 1)^2}\\) in partial fractions.</p>`,
          answer: `\\(\\frac{1}{x + 3} + \\frac{2}{x - 1} - \\frac{3}{(x - 1)^2}\\)`,
          videoId: "TIoIgzV5tjU",
          timestamp: "58s",
          topics: ["Partial Fractions"],
          subtopics: ["Proper rational functions"],
          marks: [3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P1 Q3</span></strong></small><p>A system of equations is defined by<br>\\(x - 3y + z = -1\\)<br>\\(3x - 2y + 4z = 11\\)<br>\\(x + 4y + 2z = 15\\)<br>Use Gaussian elimination to determine whether the system shows redundancy, inconsistency or has a unique solution.</p>`,
          answer: `Inconsistent (as the final row of the augmented matrix leads to an impossible equation, e.g., \\(0 = 2\\) or \\(14 \\neq 16\\))`,
          videoId: "TIoIgzV5tjU",
          timestamp: "4m3s",
          topics: ["Systems of Equations"],
          subtopics: [],
          marks: [3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P1 Q4</span></strong></small><p>Use integration by parts to find \\(\\int x^4 \\ln x \\, dx\\), \\(x > 0.\\)</p>`,
          answer: `\\(\\frac{1}{5}x^5 \\ln x - \\frac{x^5}{25} + c\\)`,
          videoId: "TIoIgzV5tjU",
          timestamp: "5m56s",
          topics: ["Integration"],
          subtopics: ["Integration by parts"],
          marks: [3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P1 Q5</span></strong></small><p>Find the particular solution of the differential equation<br>\\(\\frac{d^2y}{dx^2} - 4\\frac{dy}{dx} - 5y = 10x^2 + 11x - 23\\)<br>given that \\(y = 2\\), \\(\\frac{dy}{dx} = 14\\) when \\(x = 0.\\)</p>`,
          answer: `\\(y = 2e^{5x} - 3e^{-x} - 2x^2 + x + 3\\)`,
          videoId: "TIoIgzV5tjU",
          timestamp: "7m29s",
          topics: ["Differential Equations"],
          subtopics: ["Second order non-homogeneous"],
          marks: [9]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P1 Q6</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Express \\(z = 1 + \\sqrt{3}i\\) in polar form.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Hence, or otherwise, show that \\(z^3\\) is real.</p>`,
          answer: `(a) \\(2\\left(\\cos \\frac{\\pi}{3} + i \\sin \\frac{\\pi}{3}\\right)\\)<br>(b) Using de Moivre's Theorem, \\(z^3 = 2^3 \\left(\\cos \\frac{3\\pi}{3} + i \\sin \\frac{3\\pi}{3}\\right) = 8(\\cos \\pi + i \\sin \\pi) = -8.\\) Since the imaginary part is zero, \\(z^3\\) is real.`,
          videoId: "TIoIgzV5tjU",
          timestamp: "13m44s",
          topics: ["Complex Numbers"],
          subtopics: ["Argand diagram", "de Moivre's theorem"],
          marks: [2, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P1 Q7</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find an expression for \\(\\sum_{r=1}^{n} (r^2 + 3r)\\) in terms of \\(n.\\)<br>Express your answer in the form \\(\\frac{1}{3}n(n + a)(n + b).\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Hence, or otherwise, find \\(\\sum_{r=11}^{20} (r^2 + 3r).\\)</p>`,
          answer: `(a) \\(\\frac{1}{3}n(n + 1)(n + 5)\\)<br>(b) \\(2950\\)`,
          videoId: "TIoIgzV5tjU",
          timestamp: "15m54s",
          topics: ["Sequences & Series"],
          subtopics: ["Summation formulae"],
          marks: [2, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P1 Q8</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Consider the statement:<br>For all integers \\(a\\) and \\(b\\), if \\(a < b\\) then \\(a^2 < b^2.\\)<br>Find a counterexample to show that the statement is false.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Let \\(n\\) be an odd integer.<br>Prove directly that \\(n^2 - 1\\) is divisible by 4.</p>`,
          answer: `(a) e.g., let \\(a = -2\\) and \\(b = 1.\\) \\(-2 < 1\\) is true, but \\((-2)^2 < 1^2 \\Rightarrow 4 < 1\\) is false.<br>(b) Let \\(n = 2k + 1\\) for \\(k \\in \\mathbb{Z}.\\) Then \\(n^2 - 1 = (2k+1)^2 - 1 = 4k^2 + 4k = 4(k^2 + k)\\), which is divisible by 4.`,
          videoId: "TIoIgzV5tjU",
          timestamp: "19m30s",
          topics: ["Methods of Proof"],
          subtopics: ["Disproof by counterexample", "Direct proof"],
          marks: [1, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P1 Q9</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>State the matrix \\(A\\), associated with an anti-clockwise rotation of \\(\\frac{\\pi}{2}\\) radians about the origin.</p><p>The matrix \\(B\\) is given by \\(B = \\begin{pmatrix} -\\frac{\\sqrt{3}}{2} & \\frac{1}{2} \\\\ -\\frac{1}{2} & -\\frac{\\sqrt{3}}{2} \\end{pmatrix}.\\)<br>The matrix \\(AB\\) is associated with an anti-clockwise rotation of \\(\\alpha\\) radians about the origin.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>(i) Determine \\(AB.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>(ii) Find the value of \\(\\alpha.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Determine the least positive integer value of \\(n\\) such that \\((AB)^n = I\\), where \\(I\\) is the \\(2 \\times 2\\) identity matrix.</p>`,
          answer: `(a) \\(\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}\\)<br>(b)(i) \\(\\begin{pmatrix} \\frac{1}{2} & \\frac{\\sqrt{3}}{2} \\\\ -\\frac{\\sqrt{3}}{2} & \\frac{1}{2} \\end{pmatrix}\\)<br>(b)(ii) \\(\\frac{5\\pi}{3}\\) (or \\(-\\frac{\\pi}{3}\\))<br>(c) \\(6\\)`,
          videoId: "TIoIgzV5tjU",
          timestamp: "21m35s",
          topics: ["Matrices"],
          subtopics: ["Transformation matrices"],
          marks: [1, 1, 1, 1]
        }
      ]
    }
  ]
};
