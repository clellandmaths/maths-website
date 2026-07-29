// Higher Maths guided practice.
// Ported from the Clelland Maths app. Entries with `ref` are past paper
// questions the site already holds — referenced, not restated, so each exam
// question exists once and carries its own marks and diagram. The rest are
// maths.scot's examples and carry `solutionUrl` linking to his written
// solution, as agreed. See docs/guided-practice-attribution.md.
//
// Loaded with import() from the practice route only — never import this from a
// notes or paper page, or it lands in the shared bundle.
import type { PracticeCourse } from '../types';

export const higherMathsPractice: PracticeCourse = {
  courseId: 'higher',
  sections: [
    {
      id: "straight-line",
      title: "Straight Line",
      topics: [
        {
          name: "Straight Line",
          questions: [
            { question: `Find the equation of the straight line through \\((4,-1)\\) that is parallel to the line with equation \\(2x+y=5.\\)`, answer: `\\(y=-2x+7\\)`, videoId: "jXqWgCEP45c", timestamp: 25, solutionUrl: "https://www.maths.scot/higher/straight-lines#1" },
            { question: `A and B are the points \\((-8,7)\\) and \\((2,t).\\)<br>The line AB is parallel to the line with equation \\(5y-x=9.\\)<br>Determine the value of \\(t.\\)`, answer: `\\(t=9\\)`, videoId: "jXqWgCEP45c", timestamp: 1, solutionUrl: "https://www.maths.scot/higher/straight-lines#2" },
            { question: `Line \\(l_1\\) has equation \\(3x-4y=1.\\)<br>Line \\(l_2\\) is perpendicular to \\(l_1.\\)<br>The two lines intersect at \\((3,2).\\)<br>Determine the equation of \\(l_2.\\)`, answer: `\\(4x+3y=18\\)`, videoId: "jXqWgCEP45c", timestamp: 3, solutionUrl: "https://www.maths.scot/higher/straight-lines#3" },
            { question: `Three points A, B and C are defined as \\((1,-5)\\), \\((10,7)\\) and \\((4,-1)\\) respectively.<br>Are A, B and C collinear?<br>Justify your answer.`, answer: `Yes, A, B and C are collinear.`, videoId: "jXqWgCEP45c", timestamp: 5, solutionUrl: "https://www.maths.scot/higher/straight-lines#4" },
            { question: `Three points P, Q and R are defined as \\((-1,2)\\), \\((2,8)\\) and \\((-4,-7)\\) respectively.<br>Are P, Q and R collinear?<br>Justify your answer.`, answer: `No, P, Q and R are not collinear.`, videoId: "jXqWgCEP45c", timestamp: 7, solutionUrl: "https://www.maths.scot/higher/straight-lines#5" },
            { question: `The line \\(l_1\\) makes an angle of \\(30^\\circ\\) with the positive direction of the \\(x\\)-axis.<br>Find the equation of the line \\(l_2\\) which is perpendicular to \\(l_1\\) and passes through the point \\((-3,2\\sqrt{3}).\\)`, answer: `\\(y=-\\sqrt{3}x-\\sqrt{3}\\)`, videoId: "jXqWgCEP45c", timestamp: 9, solutionUrl: "https://www.maths.scot/higher/straight-lines#6" },
            { question: `The line \\(l_1\\) has a negative gradient and makes an angle of \\(30^\\circ\\) with the negative direction of the \\(x\\)-axis.<br>Find the equation of the line \\(l_2\\) which is perpendicular to \\(l_1\\) and passes through the point \\((-3,2\\sqrt{3}).\\)`, answer: `\\(y=\\sqrt{3}x+5\\sqrt{3}\\)`, videoId: "jXqWgCEP45c", timestamp: 10, solutionUrl: "https://www.maths.scot/higher/straight-lines#7" },
            { question: `Determine the acute angle that the line with equation \\(2x-3y=1\\) makes with the \\(y\\)-axis.`, answer: `\\(56.3^\\circ\\)`, videoId: "jXqWgCEP45c", timestamp: 13, solutionUrl: "https://www.maths.scot/higher/straight-lines#8" },
            { question: `P, Q and R are the points \\((2,-1)\\), \\((6,7)\\) and \\((3,-2)\\) respectively.<br>In triangle PQR, determine the equation of the median through R.`, answer: `\\(y=5x-17\\)`, videoId: "jXqWgCEP45c", timestamp: 15, solutionUrl: "https://www.maths.scot/higher/straight-lines#9" },
            { question: `A is \\((-3,4)\\) and B is \\((7,-6).\\)<br>Determine the equation of the perpendicular bisector of AB.`, answer: `\\(y=x-3\\)`, videoId: "jXqWgCEP45c", timestamp: 17, solutionUrl: "https://www.maths.scot/higher/straight-lines#10" },
            { question: `In triangle KLM, the vertices K, L and M are the points \\((-4,1)\\), \\((1,7)\\) and \\((3,3)\\) respectively.<br><b>(a)</b>&nbsp;&nbsp;Find the equation of the altitude from K.<br><b>(b)</b>&nbsp;&nbsp;Determine the coordinates of the point where the altitude from K intersects the straight line through L and M.`, answer: `(a) \\(x-2y=-6\\)<br>(b) \\((\\frac{12}{5},\\frac{21}{5})\\)`, videoId: "jXqWgCEP45c", timestamp: 19, solutionUrl: "https://www.maths.scot/higher/straight-lines#11" },
            { ref: "2017 P1 Q7", videoId: "jXqWgCEP45c", timestamp: 24 },
            { question: `Determine whether the line passing through \\((-4,2)\\) and \\((2,-7)\\) is perpendicular to the line with equation \\(3y=2x+9.\\)`, answer: `Yes, the lines are perpendicular.`, videoId: "jXqWgCEP45c", timestamp: 25, paper: "2021 P1 Q4" },
            { ref: "2025 P1 Q2", videoId: "jXqWgCEP45c", timestamp: 27 },
          ],
        },
      ],
    },
    {
      id: "polynomials",
      title: "Polynomials & Quadratics",
      topics: [
        {
          name: "Polynomials & Quadratics",
          questions: [
            { question: `<b>(a)</b>&nbsp;&nbsp;Show that \\(2x+3\\) is a factor of \\(2x^3+3x^2-2x-3.\\)<br><b>(b)</b>&nbsp;&nbsp;Hence factorise \\(2x^3+3x^2-2x-3\\) fully.`, answer: `\\((2x+3)(x-1)(x+1)\\)`, videoId: "4o5LKdk4riI", timestamp: 31, solutionUrl: "https://www.maths.scot/higher/polynomials#1" },
            { question: `Factorise \\(2x^3+9x^2-6x-5\\) fully.`, answer: `\\((x-1)(x+5)(2x+1)\\)`, videoId: "4o5LKdk4riI", timestamp: 234, solutionUrl: "https://www.maths.scot/higher/polynomials#2" },
            { question: `<b>(a)</b>&nbsp;&nbsp;Show that \\(x+2\\) is a factor of \\(2x^4+9x^3-x^2-18x+8.\\)<br><b>(b)</b>&nbsp;&nbsp;Hence factorise \\(2x^4+9x^3-x^2-18x+8\\) fully.`, answer: `\\((x+2)(x-1)(x+4)(2x-1)\\)`, videoId: "4o5LKdk4riI", timestamp: 394, solutionUrl: "https://www.maths.scot/higher/polynomials#3" },
            { question: `<b>(a)</b>&nbsp;&nbsp;Show that \\(x-3\\) is a factor of \\(2x^4-3x^3-19x-24.\\)<br><b>(b)</b>&nbsp;&nbsp;Hence factorise \\(2x^4-3x^3-19x-24\\) fully.`, answer: `\\((x-3)(x+1)(2x^2+x+8)\\)`, videoId: "4o5LKdk4riI", timestamp: 628, solutionUrl: "https://www.maths.scot/higher/polynomials#4" },
            { question: `For the polynomial \\(x^3-x^2+mx+n\\):<br>• \\(x-3\\) is a factor<br>• 54 is the remainder when it is divided by \\(x-5\\)<br><b>(a)</b>&nbsp;&nbsp;Determine the values of \\(m\\) and \\(n.\\)<br><b>(b)</b>&nbsp;&nbsp;Hence solve \\(x^3-x^2+mx+n=0.\\)`, answer: `(a) \\(m = -14, n = 24\\)<br>(b) \\(x = 3, x = 2, x = -4\\)`, videoId: "4o5LKdk4riI", timestamp: 914, solutionUrl: "https://www.maths.scot/higher/polynomials#5" },
            { question: `The same remainder is found when \\(x^3-6x^2+2x-p\\) and \\(x^3+5x^2+(2p+1)x-37\\) are divided by \\((x+2).\\) Find the value of \\(p.\\)`, answer: `\\(p = 3\\)`, videoId: "4o5LKdk4riI", timestamp: 1264, solutionUrl: "https://www.maths.scot/higher/polynomials#6" },
            { question: `Solve \\(x^3+3x^2-4x-12=0.\\)`, answer: `\\(x = 2, x = -2, x = -3\\)`, videoId: "4o5LKdk4riI", timestamp: 1394, solutionUrl: "https://www.maths.scot/higher/polynomials#7" },
            { question: `Solve \\(x^4-x^3-10x^2+4x+24=0.\\)`, answer: `\\(x = 2, x = -2, x = 3\\)`, videoId: "4o5LKdk4riI", timestamp: 1527, solutionUrl: "https://www.maths.scot/higher/polynomials#8" },
            { question: `The graph of \\(y=f(x),\\) where \\(f(x)=k(x-a)(x-b)^{2},\\) has a minimum turning point at \\((3,0)\\), a root \\(-2\\) and passes through the point \\((1,48).\\) Find the values of \\(a\\), \\(b\\) and \\(k.\\)`, answer: `\\(a = -2, b = 3, k = 4\\)`, videoId: "4o5LKdk4riI", timestamp: 1814, solutionUrl: "https://www.maths.scot/higher/polynomials#9" },
            { question: `Find the values of \\(k\\) for which \\(x^2+(k+3)x+4=0\\) has equal roots.`, answer: `\\(k = 1, k = -7\\)`, videoId: "4o5LKdk4riI", timestamp: 1941, solutionUrl: "https://www.maths.scot/higher/polynomials#10" },
            { question: `Find the range of values of \\(p\\) for which \\(2x^2+5x+p+1=0\\) has no real roots.`, answer: `\\(p > \\frac{17}{8}\\)`, videoId: "4o5LKdk4riI", timestamp: 2000, solutionUrl: "https://www.maths.scot/higher/polynomials#11" },
            { question: `Find the range of values of \\(a\\) for which \\(x^2-6x+a=0\\) has two distinct real roots.`, answer: `\\(a < 9\\)`, videoId: "4o5LKdk4riI", timestamp: 2054, solutionUrl: "https://www.maths.scot/higher/polynomials#12" },
            { question: `Find the range of values of \\(n\\) for which \\(x^2-nx+3-n=0\\) has two distinct real roots.`, answer: `\\(n < -6\\) or \\(n > 2\\)`, videoId: "4o5LKdk4riI", timestamp: 2090, solutionUrl: "https://www.maths.scot/higher/polynomials#13" },
            { question: `A rectangle has length \\(x\\) cm and a breadth that is \\(1\\) cm shorter than the length. Its area is less than \\(30\\) cm\\(^2.\\) Find the range of possible values of \\(x.\\)`, answer: `\\(1 < x < 6\\)`, videoId: "4o5LKdk4riI", timestamp: 2186, solutionUrl: "https://www.maths.scot/higher/polynomials#14" },
            { question: `Express \\(-2x^2+12x+5\\) in the form \\(a(x+b)^2+c.\\)`, answer: `\\(-2(x-3)^2+23\\)`, videoId: "4o5LKdk4riI", timestamp: 2357, solutionUrl: "https://www.maths.scot/higher/polynomials#15" },
            { question: `Express \\(4x^2-28x-1\\) in the form \\(p(x+q)^2+r.\\)`, answer: `\\(4(x-\\frac{7}{2})^2-50\\)`, videoId: "4o5LKdk4riI", timestamp: 2438, solutionUrl: "https://www.maths.scot/higher/polynomials#16" },
            { question: `Determine the point(s) of intersection of the parabola \\(y=x^2+3x-7\\) and the line \\(y=4x-1.\\)`, answer: `\\((3, 11)\\) and \\((-2, -9)\\)`, videoId: "4o5LKdk4riI", timestamp: 2489, solutionUrl: "https://www.maths.scot/higher/polynomials#17" },
            { question: `The line \\(y=5x-3\\) and the curve \\(y=x^3-8x+9\\) intersect at three points. One of these points is \\((3, 12).\\) Find the coordinates of the other two points of intersection.`, answer: `\\((1, 2)\\) and \\((-4, -23)\\)`, videoId: "4o5LKdk4riI", timestamp: 2583, solutionUrl: "https://www.maths.scot/higher/polynomials#18" },
            { ref: "2023 P1 Q5", videoId: "4o5LKdk4riI", timestamp: 2748 },
            { ref: "2023 P1 Q10", videoId: "4o5LKdk4riI", timestamp: 2927 },
            { ref: "2024 P1 Q8", videoId: "4o5LKdk4riI", timestamp: 3260 },
            { ref: "2024 P1 Q10", videoId: "4o5LKdk4riI", timestamp: 3375 },
            { ref: "2025 P1 Q7", videoId: "4o5LKdk4riI", timestamp: 3501 },
            { ref: "2025 P1 Q11", videoId: "4o5LKdk4riI", timestamp: 3640 },
            { ref: "2025 P2 Q2", videoId: "4o5LKdk4riI", timestamp: 3733 },
          ],
        },
      ],
    },
    {
      id: "sequences",
      title: "Sequences",
      topics: [
        {
          name: "Recurrence Relations",
          questions: [
            { question: `A sequence is generated by the recurrence relation \\(u_{n+1}=ku_n+4,\\) where \\(k\\) is a constant. Given \\(u_0=-1\\) and \\(u_1=7,\\) find the value of \\(k\\) and the value of \\(u_{3}.\\)`, answer: `\\(k = -3, \\quad u_3 = 55\\)`, videoId: "ZVcXyVk4uws", timestamp: 27, solutionUrl: "https://www.maths.scot/higher/sequences#1" },
            { question: `A sequence is defined by the recurrence relation \\(u_{n+1}=mu_n+c,\\) where \\(m\\) and \\(c\\) are constants. The first three terms of the sequence are \\(12,\\) \\(20\\) and \\(26.\\) Find the values of \\(m\\) and \\(c.\\) Hence find the value of the fourth term in the sequence.`, answer: `\\(m = \\frac{3}{4}, \\quad c = 11, \\quad u_4 = \\frac{61}{2}\\)`, videoId: "ZVcXyVk4uws", timestamp: 2, solutionUrl: "https://www.maths.scot/higher/sequences#2" },
            { question: `A sequence is generated by the recurrence relation \\(u_{n+1}=mu_n-3,\\) where \\(m\\) is a positive integer. Given \\(u_2=11\\) and \\(u_4=35,\\) find the value of \\(m\\) and the value of \\(u_{3}.\\)`, answer: `\\(m = 2, \\quad u_3 = 19\\)`, videoId: "ZVcXyVk4uws", timestamp: 5, solutionUrl: "https://www.maths.scot/higher/sequences#3" },
            { question: `A sequence is defined by the recurrence relation \\(u_{n+1}=\\frac{2}{3} u_n+4,\\) with \\(u_1=6.\\) Explain why this sequence approaches a limit as \\(n \\to \\infty\\) and calculate this limit.`, answer: `A limit exists because \\(-1 < \\frac{2}{3} < 1.\\) The limit \\(L = 12.\\)`, videoId: "ZVcXyVk4uws", timestamp: 8, solutionUrl: "https://www.maths.scot/higher/sequences#4" },
            { question: `The population of Common Blue butterflies in a woodland area is observed to be declining by \\(3.5\\%\\) per year. To increase the population, scientists plan to release \\(500\\) of this species within the woodland at the end of June each year. Let \\(u_n\\) represent the population at the beginning of July, \\(n\\) years after the first annual reintroduction. It is known that \\(u_n\\) and \\(u_{n+1}\\) satisfy the recurrence relation \\(u_{n+1}=au_{n}+b.\\)<br><b>(a)</b>&nbsp;&nbsp;State the values of \\(a\\) and \\(b.\\)<br><b>(b)</b>&nbsp;&nbsp;Explain whether or not the population will stabilise in the long term.<br><b>(c)</b>&nbsp;&nbsp;The population at the beginning of the reintroduction programme was estimated at \\(10,000.\\) Explain whether or not the population will ever exceed \\(15,000.\\)`, answer: `(a) \\(a = 0.965, \\ b = 500\\)<br>(b) Stabilises because \\(-1 < 0.965 < 1\\)<br>(c) No, because the limit is approximately \\(14,286.\\)`, videoId: "ZVcXyVk4uws", timestamp: 9, solutionUrl: "https://www.maths.scot/higher/sequences#5" },
            { question: `Sequences may be generated by recurrence relations of the form \\(u_{n+1}=ku_n-5,\\) \\(u_0=20,\\) where \\(k \\in \\mathbb{R}.\\)<br><b>(a)</b>&nbsp;&nbsp;Show that \\(u_2=20k^2-5k-5.\\)<br><b>(b)</b>&nbsp;&nbsp;Find the range of values of \\(k\\) for which \\(u_2 < u_0.\\)`, answer: `(b) \\(-1 < k < \\frac{5}{4}\\)`, videoId: "ZVcXyVk4uws", timestamp: 12, solutionUrl: "https://www.maths.scot/higher/sequences#6" },
            { question: `Sequences may be defined by the linear recurrence relation \\(u_{n+1}=(3-k)u_n-2.\\) Find the range of values of \\(k\\) for which such a sequence converges to a limit.`, answer: `\\(2 < k < 4\\)`, videoId: "ZVcXyVk4uws", timestamp: 16, solutionUrl: "https://www.maths.scot/higher/sequences#7" },
            { ref: "2016 P1 Q3", videoId: "ZVcXyVk4uws", timestamp: 17 },
            { ref: "2017 P1 Q9", videoId: "ZVcXyVk4uws", timestamp: 19 },
            { ref: "2019 P1 Q4", videoId: "ZVcXyVk4uws", timestamp: 21 },
            { question: `A sequence is generated by the recurrence relation \\(u_{n+1}=\\frac{2}{3}u_n+8,\\) \\(u_7=20.\\)<br><b>(a)</b>&nbsp;&nbsp;Determine the value of \\(u_5.\\)<br><b>(b)</b>&nbsp;&nbsp;Determine the limit of this sequence.`, answer: `(a) \\(u_5 = 15\\)<br>(b) Limit \\(= 24\\)`, videoId: "ZVcXyVk4uws", timestamp: 23, paper: "2021 P1 Q13" },
            { question: `A sequence of real numbers is such that the terms of the sequence satisfy the recurrence relation \\(u_{n+1}=9u_n-440\\) and \\(u_{n+1} > u_n\\) for all values of \\(n.\\) The difference between two particular terms, \\(u_{k+1}\\) and \\(u_k,\\) is \\(1000.\\) Determine, algebraically, the value of \\(u_k.\\)`, answer: `\\(u_k = 180\\)`, videoId: "ZVcXyVk4uws", timestamp: 25, paper: "2021 P2 Q12" },
            { ref: "2024 P1 Q2", videoId: "ZVcXyVk4uws", timestamp: 26 },
          ],
        },
      ],
    },
  ],
};
