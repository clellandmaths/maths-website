export const advHigherMaths2023P2 = {
  year: 2023,
  papers: [
    {
      paperNumber: 2,
      questions: [
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P2 Q1</span></strong></small><p>The function \\(f\\) is defined by \\(f(x)=2 \\sin^{-1} 3x.\\)<br>Find \\(f'(x).\\)</p>`,
          answer: `\\(\\frac{6}{\\sqrt{1-9x^2}}\\) (or \\(\\frac{6}{\\sqrt{1-(3x)^2}}\\))`,
          videoId: "l5hreoPcQZQ",
          timestamp: "0s",
          topics: ["Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P2 Q2</span></strong></small><p>Find \\(\\int \\frac{x^2}{x^3+10}dx.\\)</p>`,
          answer: `\\(\\frac{1}{3}\\ln|x^3+10|+c\\)`,
          videoId: "l5hreoPcQZQ",
          timestamp: "53s",
          topics: ["Integration"],
          subtopics: ["Integration by substitution"],
          marks: [2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P2 Q3</span></strong></small><p>Matrix \\(A\\) is defined by</p><p>\\(A = \\begin{pmatrix} 2 & 2x & 4 \\\\ x & -1 & 0 \\\\ 1 & 0 & -2 \\end{pmatrix}\\)</p><p>where \\(x \\in \\mathbb{R}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find a simplified expression for the determinant of \\(A.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Hence, determine whether \\(A^{-1}\\) exists for all values of \\(x.\\)</p>`,
          answer: `(a) \\(4x^2+8\\)<br>(b) Since \\(4x^2+8 > 0\\) for all real \\(x\\), \\(A^{-1}\\) always exists.`,
          videoId: "l5hreoPcQZQ",
          timestamp: "2m58s",
          topics: ["Matrices"],
          subtopics: ["Determinant and inverse"],
          marks: [2, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P2 Q4</span></strong></small><p>Calculate the gradient of the tangent to the curve with equation \\(x^2y^2-2y=\\sin 3x\\) at the point (0,0).</p>`,
          answer: `\\(-\\frac{3}{2}\\)`,
          videoId: "l5hreoPcQZQ",
          timestamp: "5m22s",
          topics: ["Differentiation"],
          subtopics: ["Implicit differentiation"],
          marks: [3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P2 Q5</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Write down and simplify the general term in the binomial expansion of \\(\\left(3x-\\frac{2}{x^2}\\right)^8.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Hence, or otherwise, determine the coefficient of \\(x^{-1}.\\)</p>`,
          answer: `(a) \\(\\binom{8}{r}3^{8-r}(-2)^r x^{8-3r}\\)<br>(b) \\(-108864\\)`,
          videoId: "l5hreoPcQZQ",
          timestamp: "7m30s",
          topics: ["Binomial Theorem"],
          subtopics: ["General and specific terms"],
          marks: [3, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P2 Q6</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Use the Euclidean algorithm to find \\(d\\), the greatest common divisor of 703 and 399.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Find integers \\(a\\) and \\(b\\) such that \\(d=703a+399b.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Hence find integers \\(p\\) and \\(q\\) such that \\(76=703p+399q.\\)</p>`,
          answer: `(a) \\(19\\)<br>(b) \\(a=4, b=-7\\)<br>(c) \\(p=16, q=-28\\)`,
          videoId: "l5hreoPcQZQ",
          timestamp: "11m38s",
          topics: ["Number Theory"],
          subtopics: ["Euclidean algorithm"],
          marks: [1, 2, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P2 Q7</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Solve the differential equation</p><p>\\(\\frac{dy}{dx}-2y=6e^{5x}\\)</p><p>given that when \\(x=0, y=-1.\\) Express \\(y\\) in terms of \\(x.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>The solution of the differential equation in (a) is also a solution of</p><p>\\(\\frac{d^3y}{dx^3}-5\\frac{d^2y}{dx^2}=ke^{2x}\\), \\(k \\in \\mathbb{R}.\\)</p><p>Find the value of \\(k.\\)</p>`,
          answer: `(a) \\(y=2e^{5x}-3e^{2x}\\)<br>(b) \\(k=36\\)`,
          videoId: "l5hreoPcQZQ",
          timestamp: "15m48s",
          topics: ["Differential Equations"],
          subtopics: ["First order linear"],
          marks: [4, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P2 Q8</span></strong></small><p>The fourth and seventh terms of a geometric sequence are 9 and 243 respectively.</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find the:<br>(i) common ratio<br>(ii) first term.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Show that \\(\\frac{S_{2n}}{S_n} = 1+3^n\\) where \\(S_n\\) represents the sum of the first \\(n\\) terms of this geometric sequence.</p>`,
          answer: `(a)(i) \\(3\\)<br>(a)(ii) \\(\\frac{1}{3}\\)<br>(b) \\(S_n = \\frac{\\frac{1}{3}(1-3^n)}{1-3}\\) and \\(S_{2n} = \\frac{\\frac{1}{3}(1-3^{2n})}{1-3}.\\) Dividing gives \\(\\frac{1-3^{2n}}{1-3^n} = \\frac{(1-3^n)(1+3^n)}{1-3^n} = 1+3^n.\\)`,
          videoId: "l5hreoPcQZQ",
          timestamp: "21m1s",
          topics: ["Sequences & Series"],
          subtopics: ["Geometric sequences and series"],
          marks: [1, 1, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P2 Q9</span></strong></small><p>Express \\(572_{10}\\) in base 9.</p>`,
          answer: `\\(705_9\\)`,
          videoId: "l5hreoPcQZQ",
          timestamp: "25m17s",
          topics: ["Number Theory"],
          subtopics: ["Number bases"],
          marks: [2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P2 Q10</span></strong></small><p>A curve is defined by \\(y=x^{5x^2}\\), where \\(x>0.\\)<br>Find \\(\\frac{dy}{dx}\\) in terms of \\(x.\\)</p>`,
          answer: `\\(x^{5x^2}(10x \\ln x + 5x)\\)`,
          videoId: "l5hreoPcQZQ",
          timestamp: "26m49s",
          topics: ["Differentiation"],
          subtopics: ["Logarithmic differentiation"],
          marks: [5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P2 Q11</span></strong></small><p>On a building site, water is stored in a container. The container is a cone with diameter 180 cm at its widest point and height of 150 cm.</p><img src="/img/Adv_Higher_Maths_Past_Papers/2023/2023_P2_Q11.png" alt="Cross section of a cone with diameter 180cm and height 150cm"><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Show that when the water level is at a height of \\(h\\) cm, \\(0 \\le h \\le 150\\), the volume of water in the container can be written as</p><p>\\(V = \\frac{3\\pi h^3}{25}\\)</p><p>[The volume of a cone is given by \\(V = \\frac{1}{3}\\pi r^2 h.\\)]</p><p>Water is pumped into the container at a constant rate of 10 litres per second.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Find the rate at which the height is increasing when \\(h = 125.\\)</p>`,
          answer: `(a) From similar triangles, \\(\\frac{r}{h} = \\frac{90}{150} \\implies r = \\frac{3}{5}h.\\) Substituting: \\(V = \\frac{1}{3}\\pi \\left(\\frac{3}{5}h\\right)^2 h = \\frac{3\\pi h^3}{25}.\\)<br>(b) \\(\\frac{16}{9\\pi}\\) cm/s (or approx \\(0.57\\) cm/s)`,
          videoId: "l5hreoPcQZQ",
          timestamp: "29m41s",
          topics: ["Differentiation"],
          subtopics: ["Related rates of change"],
          marks: [1, 5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P2 Q12</span></strong></small><p>Prove by induction that, for all positive integers \\(n\\),</p><p>\\(\\sum_{r=1}^{n} 2^{r-1}r = 2^n(n-1)+1.\\)</p>`,
          answer: `Proof by induction showing true for \\(n=1\\) (LHS = RHS = 1), assuming true for \\(n=k\\), and showing the sum to \\(k+1\\) simplifies to \\(2^{k+1}(k+1-1)+1\\), concluding the proof for all positive integers \\(n.\\)`,
          videoId: "l5hreoPcQZQ",
          timestamp: "34m15s",
          topics: ["Methods of Proof"],
          subtopics: ["Proof by induction"],
          marks: [5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P2 Q13</span></strong></small><p>Points scored in the long jump element of the decathlon can be calculated using a solution of the differential equation</p><p>\\(\\frac{dP}{dm} = \\frac{1.4P}{m-220}\\), \\(m > 220\\)</p><p>where \\(m\\) is the distance jumped in centimetres and \\(P\\) the points scored.</p><p>Given that a jump of 807 centimetres scores 1079 points, find an expression for \\(P\\) in terms of \\(m.\\)</p>`,
          answer: `\\(P = 0.14(m-220)^{1.4}\\) (or \\(P = e^{1.4\\ln(m-220)-1.94}\\))`,
          videoId: "l5hreoPcQZQ",
          timestamp: "39m33s",
          topics: ["Differential Equations"],
          subtopics: ["First order separable, in context"],
          marks: [6]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P2 Q14</span></strong></small><p>A complex number is defined by \\(w=a+ib\\), where \\(a\\) and \\(b\\) are positive real numbers.</p><p>Given \\(w^2=8+6i\\), determine the values of \\(a\\) and \\(b.\\)</p>`,
          answer: `\\(a=3, b=1\\)`,
          videoId: "l5hreoPcQZQ",
          timestamp: "43m49s",
          topics: ["Complex Numbers"],
          subtopics: ["Equations with complex roots"],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2023 P2 Q15</span></strong></small><p>A function \\(f(x)\\) has the following properties:</p><p>\\(f'(x) = \\frac{x+1}{1+(x+1)^4}\\)</p><p>the first term in the Maclaurin expansion of \\(f(x)\\) is 1.</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find the Maclaurin expansion of \\(f(x)\\) up to and including the term in \\(x^2.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Use the substitution \\(u=(x+1)^2\\) to find \\(\\int \\frac{x+1}{1+(x+1)^4}dx.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Determine an expression for \\(f(x).\\)</p>`,
          answer: `(a) \\(1 + \\frac{1}{2}x - \\frac{1}{4}x^2\\)<br>(b) \\(\\frac{1}{2}\\tan^{-1}((x+1)^2)+c\\)<br>(c) \\(\\frac{1}{2}\\tan^{-1}((x+1)^2) + 1 - \\frac{\\pi}{8}\\)`,
          videoId: "l5hreoPcQZQ",
          timestamp: "46m43s",
          topics: ["Maclaurin Series", "Integration"],
          subtopics: ["Integration by substitution"],
          marks: [3, 3, 2]
        }
      ]
    }
  ]
};
