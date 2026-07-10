export const advHigherMaths2022P1 = {
  year: 2022,
  papers: [
    {
      paperNumber: 1,
      questions: [
        {
          question: `<small><strong><span style="white-space: nowrap;">2022 P1 Q1(a)</span></strong></small><p>Given \\(y = \\frac{1-3x}{x^2+4}\\), find \\(\\frac{dy}{dx}.\\) Simplify your answer.</p>`,
          answer: `\\(\\frac{3x^2 - 2x - 12}{(x^2+4)^2}\\)`,
          videoId: "h4S_1o19d4c",
          timestamp: "10s",
          topics: ["Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2022 P1 Q1(b)</span></strong></small><p>Given \\(f(x) = \\text{cosec } 5x\\), find \\(f'(x).\\)</p>`,
          answer: `\\(-5\\text{cosec } 5x \\cot 5x\\)`,
          videoId: "h4S_1o19d4c",
          timestamp: "1m1s",
          topics: ["Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2022 P1 Q2</span></strong></small><p>Use Gaussian elimination to solve the following system of equations:</p><p>\\(x - 2y + z = 4\\)<br>\\(2x + y - 3z = 3\\)<br>\\(x - 7y - 4z = 9\\)</p>`,
          answer: `\\(x = 2, y = -1, z = 0\\)`,
          videoId: "h4S_1o19d4c",
          timestamp: "2m39s",
          topics: ["Systems of Equations"],
          subtopics: [],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2022 P1 Q3</span></strong></small><p>Given that \\(z_1 = 5 + 3i\\) and \\(z_2 = 6 + 2i\\), express \\(z_1\\overline{z_2}\\) in the form \\(a + ib\\) where \\(a\\) and \\(b\\) are real numbers.</p>`,
          answer: `\\(36 + 8i\\)`,
          videoId: "h4S_1o19d4c",
          timestamp: "5m35s",
          topics: ["Complex Numbers"],
          subtopics: ["Basic operations"],
          marks: [2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2022 P1 Q4</span></strong></small><p>A curve is defined by the equation \\(y^3 + 4y = 2xy + 1.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Use implicit differentiation to find an expression for \\(\\frac{dy}{dx}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Find the gradient of the tangent to the curve when \\(y = -1.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Show that the curve has no stationary point.</p>`,
          answer: `(a) \\(\\frac{2y}{3y^2 + 4 - 2x}\\)<br>(b) \\(-2\\)<br>(c) Setting \\(\\frac{dy}{dx} = 0\\) yields \\(2y = 0 \\Rightarrow y = 0.\\) Substituting \\(y = 0\\) into the original equation gives \\(0 = 1\\), which is inconsistent. Therefore, there are no stationary points.`,
          videoId: "h4S_1o19d4c",
          timestamp: "6m35s",
          topics: ["Differentiation"],
          subtopics: ["Implicit differentiation"],
          marks: [3, 1, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2022 P1 Q5</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find, and simplify, the Maclaurin expansion for \\(e^{-4x}\\) up to and including the term in \\(x^3.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Hence find the first four terms of the Maclaurin expansion of \\(\\frac{3+2x}{e^{4x}}.\\)</p>`,
          answer: `(a) \\(1 - 4x + 8x^2 - \\frac{32}{3}x^3\\)<br>(b) \\(3 - 10x + 16x^2 - 16x^3\\)`,
          videoId: "h4S_1o19d4c",
          timestamp: "11m49s",
          topics: ["Maclaurin Series"],
          subtopics: [],
          marks: [2, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2022 P1 Q6</span></strong></small><p>Consider the statement: For all odd numbers \\(n\\), \\(n^2 + 4\\) is prime.</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find a counterexample to show that the statement is false.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Prove directly that the difference between the cubes of any two consecutive integers is not divisible by 3.</p>`,
          answer: `(a) e.g. when \\(n = 9\\), \\(n^2 + 4 = 85\\), which is divisible by 5 and therefore not prime.<br>(b) Let the consecutive integers be \\(n\\) and \\(n+1.\\) Then \\((n+1)^3 - n^3 = 3(n^2 + n) + 1\\), which leaves a remainder of 1 when divided by 3, so it is not divisible by 3.`,
          videoId: "h4S_1o19d4c",
          timestamp: "16m23s",
          topics: ["Methods of Proof"],
          subtopics: ["Disproof by counterexample", "Direct proof"],
          marks: [1, 3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2022 P1 Q7</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Use the substitution \\(u = y^2 + 1\\), or otherwise, to find the exact value of</p><p>\\(\\int_0^5 \\frac{4y}{\\sqrt{y^2+1}} \\,dy.\\)</p><p>Student engineers are using a 3D printer to make a model. Relative to a suitable set of axes, the cross-section of the model is symmetrical about the \\(y\\)-axis and is represented in the first quadrant by the curve \\(x = \\frac{4y}{\\sqrt{y^2+1}}\\), \\(0 \\le y \\le 5.\\)</p><img src="/img/Adv_Higher_Maths_Past_Papers/2022/2022_P1_Q7.png" alt="Curve of x = 4y / sqrt(y^2 + 1) bounding an area to the y-axis"><p><span class="text-cyan-400 font-bold mr-1">(b)</span>State the area of the cross-section.</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Express \\(\\frac{y^2}{y^2+1}\\) in the form \\(a + \\frac{b}{y^2+1}\\) where \\(a\\) and \\(b\\) are real numbers.</p><p>The curve \\(x = \\frac{4y}{\\sqrt{y^2+1}}\\), \\(0 \\le y \\le 5\\) will be rotated through \\(2\\pi\\) radians about the \\(y\\)-axis to make the model.</p><p><span class="text-cyan-400 font-bold mr-1">(d)</span>Find the volume of the model.</p>`,
          answer: `(a) \\(4(\\sqrt{26} - 1)\\)<br>(b) \\(8(\\sqrt{26} - 1)\\) (square units)<br>(c) \\(1 - \\frac{1}{y^2+1}\\)<br>(d) \\(16\\pi(5 - \\tan^{-1} 5)\\) (cubic units)`,
          videoId: "h4S_1o19d4c",
          timestamp: "19m57s",
          topics: ["Integration"],
          subtopics: ["Integration by substitution", "Volume of revolution"],
          marks: [4, 1, 1, 4]
        }
      ]
    }
  ]
};
