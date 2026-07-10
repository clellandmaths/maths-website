export const advHigherMaths2021P2 = {
  year: 2021,
  papers: [
    {
      paperNumber: 2,
      questions: [
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P2 Q1</span></strong></small><p>Given \\(f(x) = 3\\sec 2x\\) find the exact value of \\(f'\\left(\\frac{\\pi}{8}\\right).\\)</p>`,
          answer: `\\(6\\sqrt{2}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P2 Q2</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Use the Euclidean algorithm to find integers \\(a\\) and \\(b\\) such that \\(105a + 72b = 3.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Hence find integers \\(x\\) and \\(y\\) such that \\(105x + 72y = 360.\\)</p>`,
          answer: `(a) \\(a = 11\\), \\(b = -16\\)<br>(b) \\(x = 1320\\), \\(y = -1920\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Number Theory"],
          subtopics: ["Euclidean algorithm"],
          marks: [3, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P2 Q3</span></strong></small><p>Use integration by parts to find \\(\\int (2x + 3)\\cos 4x \\,dx.\\)</p>`,
          answer: `\\(\\frac{1}{4}(2x + 3)\\sin 4x + \\frac{1}{16}\\cos 4x + c\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Integration"],
          subtopics: ["Integration by parts"],
          marks: [3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P2 Q4</span></strong></small><p>A curve is defined parametrically by \\(x = \\sin^{-1} 2t\\) and \\(y = \\tan^{-1} t.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find \\(\\frac{dx}{dt}\\) and \\(\\frac{dy}{dt}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>When \\(t = 0\\) find the equation of the tangent to the curve.</p>`,
          answer: `(a) \\(\\frac{dx}{dt} = \\frac{2}{\\sqrt{1 - 4t^2}}\\)<br>\\(\\frac{dy}{dt} = \\frac{1}{1 + t^2}\\)<br>(b) \\(y = \\frac{1}{2}x\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Parametric differentiation"],
          marks: [3, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P2 Q5</span></strong></small><p>A non-singular matrix \\(A\\) satisfies the equation \\(A^2 = 2A + 5I\\), where \\(I\\) is the identity matrix.</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Express \\(A^4\\) in the form \\(pA + qI\\), where \\(p, q \\in \\mathbb{Z}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Express \\(A^{-1}\\) in the form \\(rA + sI\\), where \\(r, s \\in \\mathbb{Q}.\\)</p>`,
          answer: `(a) \\(28A + 45I\\)<br>(b) \\(\\frac{1}{5}A - \\frac{2}{5}I\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Matrices"],
          subtopics: ["Matrix operations", "Determinant and inverse"],
          marks: [2, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P2 Q6</span></strong></small><p>Solve the differential equation</p><p>\\(\\frac{dy}{dx} + 2xy = 14xe^{-x^2}\\)</p><p>given that when \\(x = 0\\), \\(y = 3.\\) Express \\(y\\) in terms of \\(x.\\)</p>`,
          answer: `\\(y = \\frac{7x^2 + 3}{e^{x^2}}\\) (or \\(y = (7x^2 + 3)e^{-x^2}\\))`,
          videoId: "",
          timestamp: "",
          topics: ["Differential Equations"],
          subtopics: ["First order linear"],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P2 Q7</span></strong></small><p>A complex number is defined by \\(z = a + 2i\\) where \\(a\\) is a positive real number.</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>State and simplify the binomial expansion of \\(z^3.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Given that \\(z^3 + 3z = b + 148i\\) where \\(b\\) is a real number, find the values of \\(a\\) and \\(b.\\)</p>`,
          answer: `(a) \\(a^3 - 12a + (6a^2 - 8)i\\)<br>(b) \\(a = 5\\), \\(b = 80\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Binomial Theorem", "Complex Numbers"],
          subtopics: ["Binomial expansion", "Basic operations"],
          marks: [3, 3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P2 Q8</span></strong></small><p>A curve is defined by \\(x^2y^3 + e^{2y} = 5.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find \\(\\frac{dy}{dx}\\) in terms of \\(x\\) and \\(y.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Show that there is only one stationary point on the curve.</p>`,
          answer: `(a) \\(\\frac{-2xy^3}{3x^2y^2 + 2e^{2y}}\\)<br>(b) Setting \\(\\frac{dy}{dx} = 0\\) gives \\(-2xy^3 = 0\\), so \\(x = 0\\) or \\(y = 0.\\)<br>When \\(x = 0\\), \\(e^{2y} = 5 \\Rightarrow y = \\frac{1}{2}\\ln 5.\\)<br>When \\(y = 0\\), \\(0 + 1 = 5\\) which has no solution.<br>Hence there is only one stationary point at \\((0, \\frac{1}{2}\\ln 5).\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Differentiation"],
          subtopics: ["Implicit differentiation"],
          marks: [4, 3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P2 Q9</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Express \\(\\frac{1}{x(5 - x)}\\) in partial fractions.</p><p>A small island is being populated by seals. The size of the seal population can be modelled by the differential equation</p><p>\\(\\frac{dP}{dt} = \\frac{1}{100}P(5 - P), \\quad 0 < P < 5\\)</p><p>where \\(P\\) (in hundreds) is the number of seals on the island \\(t\\) years after the seals arrive.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Given that there are 250 seals after 10 years, find an expression for \\(P\\) in terms of \\(t.\\)</p>`,
          answer: `(a) \\(\\frac{1}{5x} + \\frac{1}{5(5 - x)}\\)<br>(b) \\(P = \\frac{5e^{0.05t - 0.5}}{1 + e^{0.05t - 0.5}}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Partial Fractions", "Differential Equations"],
          subtopics: ["Proper rational functions", "First order separable, in context"],
          marks: [2, 8]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P2 Q10</span></strong></small><p>Prove by induction that</p><p>\\(\\sum_{r=2}^{n} \\frac{1}{r(r - 1)} = \\frac{n - 1}{n}\\)</p><p>for all positive integers \\(n \\ge 2.\\)</p>`,
          answer: `Proof by induction showing true for \\(n=2\\) (LHS = RHS = \\(\\frac{1}{2}\\)), assuming true for \\(n=k\\), and showing the sum to \\(k+1\\) simplifies to \\(\\frac{k}{k+1}\\), concluding the proof for all integers \\(n \\ge 2.\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Methods of Proof"],
          subtopics: ["Proof by induction"],
          marks: [5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P2 Q11(a)(b)</span></strong></small><p>Three consecutive terms of an arithmetic sequence are given by \\(x - 1, x - 7, 2x - 9.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>(i) Find the common difference.<br>(ii) Hence find the value of \\(x.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Given that \\(x - 1\\) is the \\(21^{st}\\) term, find</p><p>(i) the value of the first term<br>(ii) a simplified expression for the \\(n^{th}\\) term of the sequence.</p>`,
          answer: `(a)(i) \\(-6\\)<br>(a)(ii) \\(x = -4\\)<br>(b)(i) \\(115\\)<br>(b)(ii) \\(121 - 6n\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Sequences & Series"],
          subtopics: ["Arithmetic and geometric combined"],
          marks: [1, 1, 1, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P2 Q11(c)(d)</span></strong></small><p>Three consecutive terms of a geometric sequence are given by \\(y - 1, y - 7, 2y - 9.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Find the two possible values of \\(y\\) and the corresponding common ratios.</p><p>One of the values of \\(y\\) gives an associated geometric series which has a sum to infinity.</p><p><span class="text-cyan-400 font-bold mr-1">(d)</span>(i) Identify the value of \\(y\\) and justify your answer.<br>(ii) Determine whether \\(\\frac{64}{3}\\) is a possible value for this sum to infinity. Give a reason for your answer.</p>`,
          answer: `(c) \\(y = 5\\) with common ratio \\(-\\frac{1}{2}\\)<br>\\(y = -8\\) with common ratio \\(\\frac{5}{3}\\)<br>(d)(i) \\(y = 5\\) because \\(\\left|-\\frac{1}{2}\\right| < 1.\\)<br>(d)(ii) No. If the sum is \\(\\frac{64}{3}\\), then \\(a = 32\\), which would mean the term \\(y-1\\) would be -4 (not 4 as required by \\(y=5\\)).`,
          videoId: "",
          timestamp: "",
          topics: ["Sequences & Series"],
          subtopics: ["Arithmetic and geometric combined"],
          marks: [3, 1, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P2 Q12</span></strong></small><p>The points \\(A(4, 0, 8)\\), \\(B(6, -5, 4)\\) and \\(C(3, 4, 11)\\) all lie on the plane \\(\\pi_1.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find the Cartesian equation of \\(\\pi_1.\\)</p><p>The plane \\(\\pi_2\\) is parallel to \\(\\pi_1\\) and passes through the origin.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>State the equation of \\(\\pi_2.\\)</p><p>A sphere touches \\(\\pi_1\\), where \\(A\\) is the point of contact. The sphere also has a single point of contact, \\(Q\\), with \\(\\pi_2.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>(i) Find parametric equations for the line \\(AQ.\\)<br>(ii) Hence find the coordinates for \\(Q.\\)</p>`,
          answer: `(a) \\(x - 2y + 3z = 28\\)<br>(b) \\(x - 2y + 3z = 0\\)<br>(c)(i) \\(x = 4 + t\\), \\(y = -2t\\), \\(z = 8 + 3t\\)<br>(c)(ii) \\(Q(2, 4, 2)\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Vectors"],
          subtopics: ["Equations of lines or planes"],
          marks: [4, 1, 1, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2021 P2 Q13</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Express \\(-1\\) in the form \\(\\cos\\theta + i\\sin\\theta.\\)</p><p>The complex number \\(z_1\\) is defined by \\(z_1 = \\cos\\frac{\\pi}{5} + i\\sin\\frac{\\pi}{5}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Use de Moivre's theorem to show that \\(z_1\\) is a root of the equation \\(z^5 + 1 = 0.\\)</p><p>The complex number \\(z_2\\) is also a root of the equation \\(z^5 + 1 = 0.\\) Roots \\(z_1\\) and \\(z_2\\) have been plotted on an Argand diagram, as shown.</p><img src="/img/Adv_Higher_Maths_Past_Papers/2021/2021_P2_Q13.png" alt="Argand diagram showing z1 and z2"><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Express \\(z_2\\) in the form \\(\\cos\\theta + i\\sin\\theta.\\)</p><p>The remaining roots of the equation \\(z^5 + 1 = 0\\) are \\(z_3\\), \\(z_4\\) and \\(z_5.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(d)</span>Express \\(z_3\\), \\(z_4\\) and \\(z_5\\) in the form \\(\\cos\\theta + i\\sin\\theta\\), where \\(-\\pi < \\theta \\le \\pi.\\)</p><p>(e) Given \\(z_1 + z_2 + z_3 + z_4 + z_5 = 0\\), show algebraically that</p><p>\\(\\cos\\frac{\\pi}{5} + \\cos\\frac{3\\pi}{5} = \\frac{1}{2}.\\)</p>`,
          answer: `(a) \\(\\cos\\pi + i\\sin\\pi\\)<br>(b) \\(z_1^5 = \\cos\\left(5 \\times \\frac{\\pi}{5}\\right) + i\\sin\\left(5 \\times \\frac{\\pi}{5}\\right) = \\cos\\pi + i\\sin\\pi = -1.\\) Therefore, \\(z_1^5 + 1 = -1 + 1 = 0.\\)<br>(c) \\(\\cos\\frac{3\\pi}{5} + i\\sin\\frac{3\\pi}{5}\\)<br>(d) \\(\\cos\\left(-\\frac{\\pi}{5}\\right) + i\\sin\\left(-\\frac{\\pi}{5}\\right)\\), \\(\\cos\\left(-\\frac{3\\pi}{5}\\right) + i\\sin\\left(-\\frac{3\\pi}{5}\\right)\\) and \\(\\cos\\pi + i\\sin\\pi\\)<br>(e) Equating the real parts to zero gives:<br>\\(\\cos\\frac{\\pi}{5} + \\cos\\frac{3\\pi}{5} + \\cos\\left(-\\frac{\\pi}{5}\\right) + \\cos\\left(-\\frac{3\\pi}{5}\\right) + \\cos\\pi = 0\\)<br>Since \\(\\cos(-\\theta) = \\cos(\\theta)\\) and \\(\\cos\\pi = -1\\):<br>\\(2\\cos\\frac{\\pi}{5} + 2\\cos\\frac{3\\pi}{5} - 1 = 0\\)<br>\\(2\\left(\\cos\\frac{\\pi}{5} + \\cos\\frac{3\\pi}{5}\\right) = 1\\)<br>\\(\\cos\\frac{\\pi}{5} + \\cos\\frac{3\\pi}{5} = \\frac{1}{2}\\)`,
          videoId: "",
          timestamp: "",
          topics: ["Complex Numbers"],
          subtopics: ["de Moivre's theorem", "Equations with complex roots"],
          marks: [1, 1, 1, 2, 2]
        }
      ]
    }
  ]
};
