export const advHigherMaths2026P2 = {
  year: 2026,
  papers: [
    {
      paperNumber: 2,
      questions: [
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P2 Q1</span></strong></small><p>Differentiate \\(f(x)=3\\sin^{-1}7x.\\)</p>`,
          answer: `\\(f'(x)=3\\times\\frac{1}{\\sqrt{1-(7x)^{2}}}\\times7=\\frac{21}{\\sqrt{1-49x^{2}}}\\)`,
          videoId: "4n8IcLrZeEY",
          timestamp: "9s",
          topics: ["Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P2 Q2</span></strong></small><p>Write down the binomial expansion of</p><p>\\(\\left(x^{2}-\\frac{5}{x}\\right)^{4}\\)</p><p>and simplify your answer.</p>`,
          answer: `\\(x^{8}-20x^{5}+150x^{2}-\\frac{500}{x}+\\frac{625}{x^{4}}\\)`,
          videoId: "4n8IcLrZeEY",
          timestamp: "58s",
          topics: ["Binomial Theorem"],
          subtopics: ["Binomial expansion"],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P2 Q3</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find and simplify the Maclaurin expansion, up to and including the term in \\(x^{3}\\), for:</p><p>(i) \\(e^{3x}\\)</p><p>(ii) \\(\\ln(1+x).\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Hence find and simplify the Maclaurin expansion, up to and including the term in \\(x^{3}\\), for \\(e^{3x}\\ln\\left(\\frac{1}{1+x}\\right).\\)</p>`,
          answer: `(a)(i) \\(e^{3x}=1+3x+\\frac{9}{2}x^{2}+\\frac{9}{2}x^{3}\\)<br>(a)(ii) \\(\\ln(1+x)=x-\\frac{1}{2}x^{2}+\\frac{1}{3}x^{3}\\)<br>(b) \\(e^{3x}\\ln\\left(\\frac{1}{1+x}\\right)=-e^{3x}\\ln(1+x)=-x-\\frac{5}{2}x^{2}-\\frac{10}{3}x^{3}\\)`,
          videoId: "4n8IcLrZeEY",
          timestamp: "291s",
          topics: ["Maclaurin Series"],
          subtopics: ["Maclaurin Series"],
          marks: [2, 2, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P2 Q4</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Use the Euclidean algorithm to find \\(d\\), the greatest common divisor of 1428 and 567.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Find integers \\(a\\) and \\(b\\) such that \\(1428a+567b=d.\\)</p>`,
          answer: `(a) \\(1428=2\\times567+294\\), \\(567=1\\times294+273\\), \\(294=1\\times273+21\\), \\(273=13\\times21\\), so \\(d=21\\)<br>(b) Working backwards, \\(21=2\\times1428-5\\times567\\), so \\(a=2\\) and \\(b=-5\\)`,
          videoId: "4n8IcLrZeEY",
          timestamp: "704s",
          topics: ["Number Theory"],
          subtopics: ["Euclidean algorithm"],
          marks: [1, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P2 Q5</span></strong></small><p>Given \\(y=x^{4x}\\), use logarithmic differentiation to find \\(\\frac{dy}{dx}.\\)<br>Write your answer in terms of \\(x.\\)</p>`,
          answer: `\\(\\ln y=4x\\ln x\\), so \\(\\frac{1}{y}\\frac{dy}{dx}=4\\ln x+4.\\)<br>\\(\\frac{dy}{dx}=x^{4x}(4\\ln x+4)=4x^{4x}(\\ln x+1)\\)`,
          videoId: "4n8IcLrZeEY",
          timestamp: "922s",
          topics: ["Differentiation"],
          subtopics: ["Logarithmic differentiation"],
          marks: [5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P2 Q6</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>An arithmetic sequence has terms \\(u_{3}=6\\) and \\(u_{11}=10.\\)<br>For this sequence, find the:</p><p>(i) common difference</p><p>(ii) first term</p><p>(iii) sum of the first 109 terms.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>The terms \\(v_{3}=18\\) and \\(v_{4}=27\\) form part of a geometric sequence.<br>For this sequence, find:</p><p>(i) the common ratio</p><p>(ii) the first term</p><p>(iii) an expression, in terms of \\(n\\), for the sum of the first \\(n\\) terms.</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Find algebraically the least value of \\(n\\) such that the sum of the geometric series exceeds the sum of the first 109 terms in the arithmetic sequence.</p>`,
          answer: `(a)(i) \\(8d=4\\), so \\(d=0.5\\)<br>(a)(ii) \\(a+2(0.5)=6\\), so \\(a=5\\)<br>(a)(iii) \\(S_{109}=\\frac{109}{2}\\left(10+108\\times0.5\\right)=3488\\)<br>(b)(i) \\(r=\\frac{27}{18}=1.5\\)<br>(b)(ii) \\(a(1.5)^{2}=18\\), so \\(a=8\\)<br>(b)(iii) \\(S_{n}=\\frac{8(1.5^{n}-1)}{0.5}=16(1.5^{n}-1)\\)<br>(c) \\(16(1.5^{n}-1)>3488\\Rightarrow1.5^{n}>219\\Rightarrow n>\\frac{\\ln219}{\\ln1.5}=13.29...\\), so the least value is \\(n=14\\)`,
          videoId: "4n8IcLrZeEY",
          timestamp: "1011s",
          topics: ["Sequences & Series"],
          subtopics: ["Arithmetic and geometric combined"],
          marks: [1, 1, 1, 1, 1, 1, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P2 Q7</span></strong></small><p>A curve is defined parametrically by</p><p>\\(x=3\\ln(2t+1),\\quad y=t-\\frac{1}{2}t^{2},\\) where \\(t>0.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find an expression for \\(\\frac{dy}{dx}.\\) Simplify your answer.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Find the coordinates of the stationary point on the curve.</p>`,
          answer: `(a) \\(\\frac{dx}{dt}=\\frac{6}{2t+1}\\) and \\(\\frac{dy}{dt}=1-t\\), so \\(\\frac{dy}{dx}=\\frac{(1-t)(2t+1)}{6}\\)<br>(b) \\(\\frac{dy}{dx}=0\\) gives \\(t=1\\) (since \\(t>0\\)), so the stationary point is \\(\\left(3\\ln 3,\\ \\frac{1}{2}\\right)\\)`,
          videoId: "4n8IcLrZeEY",
          timestamp: "1388s",
          topics: ["Differentiation"],
          subtopics: ["Parametric differentiation"],
          marks: [2, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P2 Q8</span></strong></small><p>The volume, \\(V\\) cubic metres, of water held in a reservoir is given by</p><p>\\(V=18(2+\\sqrt{h})^{6}-1152\\)</p><p>where \\(h\\) metres is the depth of water.<br>Water is pumped out of the reservoir at a constant rate of \\(0.6\\) m³s⁻¹.<br>Find the rate of change of the depth of water in the reservoir when the depth is 9 metres.</p>`,
          answer: `\\(\\frac{dV}{dh}=\\frac{54(2+\\sqrt{h})^{5}}{\\sqrt{h}}\\), which at \\(h=9\\) is \\(\\frac{54\\times5^{5}}{3}=56\\,250.\\)<br>\\(\\frac{dV}{dt}=\\frac{dV}{dh}\\times\\frac{dh}{dt}\\), so \\(-0.6=56\\,250\\times\\frac{dh}{dt}\\)<br>\\(\\frac{dh}{dt}=-\\frac{1}{93\\,750}\\) m/s (about \\(-1.07\\times10^{-5}\\) m/s)`,
          videoId: "4n8IcLrZeEY",
          timestamp: "1576s",
          topics: ["Differentiation"],
          subtopics: ["Related rates of change"],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P2 Q9</span></strong></small><p>Express \\(3442_{5}\\) in base 9.</p>`,
          answer: `\\(3442_{5}=3(125)+4(25)+4(5)+2=497_{10}\\)<br>\\(497\\div9=55\\) r 2, \\(55\\div9=6\\) r 1, \\(6\\div9=0\\) r 6, so the answer is \\(612_{9}\\)`,
          videoId: "4n8IcLrZeEY",
          timestamp: "1877s",
          topics: ["Number Theory"],
          subtopics: ["Number bases"],
          marks: [3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P2 Q10</span></strong></small><p>A curve is defined by the equation \\(x^{2}e^{6y}+x^{2}+y^{5}=50.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Find \\(\\frac{dy}{dx}\\) in terms of \\(x\\) and \\(y.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Given \\(x>0\\), explain why the derivative is never zero.</p>`,
          answer: `(a) \\(2xe^{6y}+6x^{2}e^{6y}\\frac{dy}{dx}+2x+5y^{4}\\frac{dy}{dx}=0\\), so \\(\\frac{dy}{dx}=\\frac{-2x(e^{6y}+1)}{6x^{2}e^{6y}+5y^{4}}\\)<br>(b) For \\(x>0\\), \\(-2x\\) is strictly negative and \\(e^{6y}+1\\) is strictly positive for every real \\(y\\), so the numerator is never zero. A fraction with a non-zero numerator cannot equal zero.`,
          videoId: "4n8IcLrZeEY",
          timestamp: "2026s",
          topics: ["Differentiation"],
          subtopics: ["Implicit differentiation"],
          marks: [4, 1]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P2 Q11</span></strong></small><p>Find</p><p>\\(\\int\\frac{2x+4}{x^{2}+4}\\,dx.\\)</p>`,
          answer: `Splitting the integral, \\(\\int\\frac{2x}{x^{2}+4}\\,dx=\\ln(x^{2}+4)\\) and \\(\\int\\frac{4}{x^{2}+4}\\,dx=2\\tan^{-1}\\left(\\frac{x}{2}\\right).\\)<br>\\(\\ln(x^{2}+4)+2\\tan^{-1}\\left(\\frac{x}{2}\\right)+C\\)`,
          videoId: "4n8IcLrZeEY",
          timestamp: "2315s",
          topics: ["Integration"],
          subtopics: ["Integrating rational functions"],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P2 Q12</span></strong></small><p>Prove by induction that \\(7^{n}+2\\) is divisible by 3 for all \\(n\\in\\mathbb{N}.\\)</p>`,
          answer: `When \\(n=1\\), \\(7^{1}+2=9=3\\times3\\), so the statement is true.<br>Assume true for \\(n=k\\), so \\(7^{k}+2=3M\\) for some integer \\(M\\), giving \\(7^{k}=3M-2.\\)<br>Then \\(7^{k+1}+2=7(3M-2)+2=21M-12=3(7M-4)\\), a multiple of 3.<br>True for \\(n=1\\), and true for \\(n=k\\) implies true for \\(n=k+1\\), so by induction the statement holds for all \\(n\\in\\mathbb{N}.\\)`,
          videoId: "4n8IcLrZeEY",
          timestamp: "2437s",
          topics: ["Methods of Proof"],
          subtopics: ["Proof by induction"],
          marks: [5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P2 Q13</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Express using partial fractions \\(\\frac{x+3}{(x+7)(x+5)}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Hence find the particular solution of the differential equation</p><p>\\(\\frac{dy}{dx}+\\frac{2}{x+3}y=\\frac{1}{(x+7)(x+5)(x+3)},\\) where \\(x\\ge0,\\)</p><p>given that \\(y=0\\) when \\(x=3.\\)</p>`,
          answer: `(a) \\(\\frac{x+3}{(x+7)(x+5)}=\\frac{2}{x+7}-\\frac{1}{x+5}\\)<br>(b) Integrating factor \\(e^{\\int\\frac{2}{x+3}dx}=(x+3)^{2}\\), so \\(\\frac{d}{dx}\\left(y(x+3)^{2}\\right)=\\frac{x+3}{(x+7)(x+5)}.\\)<br>\\(y(x+3)^{2}=2\\ln(x+7)-\\ln(x+5)+C\\)<br>\\(y=0\\) when \\(x=3\\) gives \\(C=-\\ln\\frac{25}{2}\\), so \\(y=\\frac{1}{(x+3)^{2}}\\ln\\left(\\frac{2(x+7)^{2}}{25(x+5)}\\right)\\)`,
          videoId: "4n8IcLrZeEY",
          timestamp: "2660s",
          topics: ["Partial Fractions", "Differential Equations"],
          subtopics: ["Proper rational functions", "First order linear"],
          marks: [2, 7]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P2 Q14</span></strong></small><p>The plane \\(\\pi\\) contains the points \\(P(2,3,-4)\\), \\(Q(3,5,1)\\) and \\(R(6,0,-6).\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Determine the Cartesian equation of \\(\\pi.\\)</p><p>The line \\(L\\) has symmetric equations</p><p>\\(\\frac{x-8}{2}=\\frac{y+2}{-1}=\\frac{z+2}{3}.\\)</p><p>\\(L\\) intersects \\(\\pi\\) at the point \\(S.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Find the coordinates of \\(S.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Calculate the size of the acute angle between \\(L\\) and \\(\\pi.\\)</p>`,
          answer: `(a) \\(\\vec{PQ}=(1,2,5)\\) and \\(\\vec{PR}=(4,-3,-2)\\), so \\(\\mathbf{n}=\\vec{PQ}\\times\\vec{PR}=(11,22,-11)\\), or \\((1,2,-1).\\)<br>\\(x+2y-z=12\\)<br>(b) With \\(x=2t+8,\\ y=-t-2,\\ z=3t-2\\): \\(-3t+6=12\\), so \\(t=-2\\) and \\(S(4,0,-8)\\)<br>(c) \\(\\sin\\theta=\\frac{|\\mathbf{d}\\cdot\\mathbf{n}|}{|\\mathbf{d}||\\mathbf{n}|}=\\frac{3}{\\sqrt{14}\\sqrt{6}}\\), so \\(\\theta=19.1^{\\circ}\\) (to 1 d.p.)`,
          videoId: "4n8IcLrZeEY",
          timestamp: "3081s",
          topics: ["Vectors"],
          subtopics: ["Equations of lines or planes", "Intersection of line and plane"],
          marks: [4, 3, 3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P2 Q15</span></strong></small><p>Let \\(r\\) be a positive real number and consider the following statement:</p><p>If \\(r\\) is irrational then \\(\\sqrt{r}\\) is irrational.</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Write down the contrapositive of the statement.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Hence prove that the statement is true.</p>`,
          answer: `(a) If \\(\\sqrt{r}\\) is rational then \\(r\\) is rational.<br>(b) Assume \\(\\sqrt{r}\\) is rational, so \\(\\sqrt{r}=\\frac{p}{q}\\) for integers \\(p\\) and \\(q\\) with \\(q\\neq0.\\)<br>Squaring gives \\(r=\\frac{p^{2}}{q^{2}}\\), a ratio of two integers with \\(q^{2}\\neq0\\), so \\(r\\) is rational.<br>The contrapositive is true, so the original statement is true.`,
          videoId: "4n8IcLrZeEY",
          timestamp: "3581s",
          topics: ["Methods of Proof"],
          subtopics: ["Proof by contrapositive"],
          marks: [1, 3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P2 Q16</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Given \\(y=\\ln(\\cos x),\\ 0\\le x<\\frac{\\pi}{2}\\), show that \\(\\frac{dy}{dx}=-\\tan x.\\)</p><p>For a function \\(g(x)\\), it is known that</p><p>\\(\\int xg(x)\\,dx=2x\\tan 2x-\\int2\\tan 2x\\,dx.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span></p><p>(i) Determine the exact value of \\(\\int_{0}^{\\frac{\\pi}{6}}xg(x)\\,dx.\\)</p><p>(ii) Find an expression for \\(g(x)\\) in terms of \\(x.\\)</p>`,
          answer: `(a) \\(\\frac{dy}{dx}=\\frac{1}{\\cos x}\\times(-\\sin x)=-\\frac{\\sin x}{\\cos x}=-\\tan x\\)<br>(b)(i) From (a), \\(\\int2\\tan 2x\\,dx=-\\ln(\\cos 2x)\\), so \\(\\int_{0}^{\\frac{\\pi}{6}}xg(x)\\,dx=\\left[2x\\tan 2x+\\ln(\\cos 2x)\\right]_{0}^{\\frac{\\pi}{6}}\\)<br>\\(=\\frac{\\pi}{3}\\sqrt{3}+\\ln\\frac{1}{2}-0=\\frac{\\pi\\sqrt{3}}{3}-\\ln 2\\)<br>(b)(ii) Comparing with \\(\\int u\\,dv=uv-\\int v\\,du\\) gives \\(v=2\\tan 2x\\), so \\(g(x)=\\frac{d}{dx}(2\\tan 2x)=4\\sec^{2}2x\\)`,
          videoId: "4n8IcLrZeEY",
          timestamp: "3725s",
          topics: ["Differentiation", "Integration"],
          subtopics: ["Product, quotient, chain rules", "Integration by parts"],
          marks: [2, 2, 1]
        }
      ]
    }
  ]
};
