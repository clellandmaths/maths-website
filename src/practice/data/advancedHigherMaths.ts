// Advanced Higher Maths guided practice.
//
// Entries with `ref` are past paper questions the site already holds:
// referenced, not restated, so each exam question exists once and carries its
// own marks, diagram and video. Questions from years the archive does not stock
// are written inline with `paper` set. Everything else is a maths.scot example
// and carries `solutionUrl` linking to his written solution, which is a
// condition of using them — see docs/guided-practice-attribution.md.
//
// Integration, Number Theory and Methods of Proof came from the app and carry
// videoId/timestamp. The other eleven have no guided practice video filmed yet;
// referenced past paper questions still bring the paper's own video.
//
// Loaded with import() from the practice route only — never import this from a
// notes or paper page, or it lands in the shared bundle.
import type { PracticeCourse } from '../types';

export const advancedHigherMathsPractice: PracticeCourse = {
  courseId: 'ah',
  sections: [
    {
      id: "binomial-theorem",
      title: "Binomial Theorem",
      topics: [
        {
          name: "Binomial Theorem",
          questions: [
            { question: `Use the binomial theorem to expand and simplify \\((2x-y)^{5}\\).`, answer: `\\(32x^5-80x^4y+80x^3y^2-40x^2y^3+10xy^4-y^5\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/binomial-theorem#1" },
            { ref: "2017 Q1", solutionUrl: "https://www.maths.scot/advanced-higher/binomial-theorem#2" },
            { question: `(a) Write down and simplify the general term in the binomial expansion of \\(\\left(\\frac{2}{x}-3x\\right)^{12}\\). (b) Hence, or otherwise, find the coefficient of the term in \\(x^8\\).`, answer: `(a) \\(\\binom{12}{r} 2^{12-r} (-3)^r x^{2r-12}\\) (b) \\(15,588,936\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/binomial-theorem#3" },
            { question: `(a) Write down and simplify the general term in the binomial expansion of \\(\\left(5x+\\frac{2}{x^2}\\right)^{9}\\). (b) Hence, or otherwise, find the term that is independent of \\(x\\).`, answer: `(a) \\(\\binom{9}{r} 5^{9-r} 2^r x^{9-3r}\\) (b) \\(10,500,000\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/binomial-theorem#4" },
            { question: `(a) Find and simplify the general term in the binomial expansion of \\(\\left(3x^2-\\frac{a}{x^3}\\right)^{6}\\), where \\(a > 0\\) is a constant. (b) Given that the coefficient of \\(x^2\\) is \\(19,440\\), find the value of \\(a\\).`, answer: `(a) \\(\\binom{6}{r} 3^{6-r} (-a)^r x^{12-5r}\\) (b) \\(a=4\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/binomial-theorem#5" },
            { question: `Use the binomial theorem to determine the exact value of \\(1.02^{4}\\).`, answer: `\\(1.08243216\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/binomial-theorem#6" },
            { question: `Determine the coefficient of \\(x^3\\) in the expansion of \\(\\left(1+\\frac{x}{4}\\right)(2-x)^5\\).`, answer: `\\(-20\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/binomial-theorem#7" },
            { ref: "2019 Q9", solutionUrl: "https://www.maths.scot/advanced-higher/binomial-theorem#8" },
            { ref: "2023 P2 Q5", solutionUrl: "https://www.maths.scot/advanced-higher/binomial-theorem#9" },
            { ref: "2025 P1 Q1", solutionUrl: "https://www.maths.scot/advanced-higher/binomial-theorem#10" },
            { ref: "2026 P2 Q2", solutionUrl: "https://www.maths.scot/advanced-higher/binomial-theorem#11" },
          ],
        },
      ],
    },
    {
      id: "complex-numbers",
      title: "Complex Numbers",
      topics: [
        {
          name: "Complex Numbers",
          questions: [
            { question: `A complex number \\(z=2-\\sqrt{3}\\,i\\). (a) Write down the complex conjugate \\(\\overline{z}\\). (b) Find \\(z\\overline{z}\\).`, answer: `(a) \\(\\overline{z}=2+\\sqrt{3}\\,i\\) (b) \\(7\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/complex-numbers#1" },
            { question: `\\(z_1=3+4i\\) and \\(z_2=k-12i\\), \\(k\\in\\mathbb{R}\\). (a) Find and simplify \\(z_{1}\\overline{z_2}\\). (b) Find the value of \\(k\\) such that \\(z_{1}\\overline{z_2}\\in\\mathbb{R}\\).`, answer: `(a) \\((3k-48)+(4k+36)i\\) (b) \\(k=-9\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/complex-numbers#2" },
            { question: `\\(z=\\frac{3-i}{2+ni}\\in\\mathbb{R}\\) for some value \\(n\\in\\mathbb{R}\\). (a) Determine the value of \\(n\\). (b) Hence find the value of \\(z\\).`, answer: `(a) \\(n=-\\frac{2}{3}\\) (b) \\(z=\\frac{3}{2}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/complex-numbers#3" },
            { question: `Solve \\(x^2-4x+5=0\\) for \\(x\\in\\mathbb{C}\\).`, answer: `\\(x=2\\pm i\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/complex-numbers#4" },
            { question: `Solve the equation \\(z+2i\\,\\overline{z}=8+7i\\).`, answer: `\\(z = 2+3i\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/complex-numbers#5" },
            { question: `Find the values of \\(\\sqrt{3-4i}\\).`, answer: `\\(-2+i\\) and \\(2-i\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/complex-numbers#6" },
            { question: `The complex number \\(z=1+2i\\) is a root of the equation \\(z^3-5z^2+11z-15=0\\). Find the remaining roots.`, answer: `\\(z=1-2i\\), \\(z=3\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/complex-numbers#7" },
            { question: `The complex number \\(z=1-\\sqrt{3}\\,i\\) is a root of the polynomial equation \\(z^4+3z^2+2z+12=0\\). Find the remaining roots.`, answer: `\\(z=1+\\sqrt{3}\\,i\\) and \\(z=-1\\pm\\sqrt{2}\\,i\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/complex-numbers#8" },
            { question: `The complex number \\(z\\) has been plotted on an Argand diagram in the fourth quadrant with coordinates \\((k\\sqrt{3}, -k)\\). Express \\(z\\) in: (a) Cartesian form (b) polar form.`, answer: `(a) \\(z=k\\sqrt{3}-k\\,i\\) (b) \\(z=2k\\left(\\cos\\left(-\\frac{\\pi}{6}\\right)+i\\sin\\left(-\\frac{\\pi}{6}\\right)\\right)\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/complex-numbers#9" },
            { question: `Two complex numbers are defined as: \\(z=2\\left(\\cos\\frac{\\pi}{4}+i\\sin\\frac{\\pi}{4}\\right)\\), \\(w=3\\left(\\cos\\frac{5\\pi}{6}+i\\sin\\frac{5\\pi}{6}\\right)\\). Express in polar form: (a) \\(zw\\) (b) \\(\\frac{z}{w}\\).`, answer: `(a) \\(6\\left(\\cos\\left(-\\frac{11\\pi}{12}\\right)+i\\sin\\left(-\\frac{11\\pi}{12}\\right)\\right)\\) (b) \\(\\frac{2}{3}\\left(\\cos\\left(-\\frac{7\\pi}{12}\\right)+i\\sin\\left(-\\frac{7\\pi}{12}\\right)\\right)\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/complex-numbers#10" },
            { question: `Given \\(z=-1-i\\), write \\(z^{10}\\) in polar form.`, answer: `\\(z^{10}=32\\left(\\cos\\frac{\\pi}{2}+i\\sin\\frac{\\pi}{2}\\right)\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/complex-numbers#11" },
            { question: `Express each of the fourth roots of \\(-1+i\\) in polar form.`, answer: `\\(z_1 = \\sqrt[8]{2}\\left(\\cos\\frac{3\\pi}{16}+i\\sin\\frac{3\\pi}{16}\\right)\\), \\(z_2 = \\sqrt[8]{2}\\left(\\cos\\frac{11\\pi}{16}+i\\sin\\frac{11\\pi}{16}\\right)\\), \\(z_3 = \\sqrt[8]{2}\\left(\\cos\\left(-\\frac{13\\pi}{16}\\right)+i\\sin\\left(-\\frac{13\\pi}{16}\\right)\\right)\\), \\(z_4 = \\sqrt[8]{2}\\left(\\cos\\left(-\\frac{5\\pi}{16}\\right)+i\\sin\\left(-\\frac{5\\pi}{16}\\right)\\right)\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/complex-numbers#12" },
            { ref: "2022 P1 Q3", solutionUrl: "https://www.maths.scot/advanced-higher/complex-numbers#13" },
            { ref: "2023 P1 Q6", solutionUrl: "https://www.maths.scot/advanced-higher/complex-numbers#14" },
            { ref: "2024 P1 Q2", solutionUrl: "https://www.maths.scot/advanced-higher/complex-numbers#15" },
            { ref: "2024 P2 Q12", solutionUrl: "https://www.maths.scot/advanced-higher/complex-numbers#16" },
            { ref: "2025 P1 Q3", solutionUrl: "https://www.maths.scot/advanced-higher/complex-numbers#17" },
            { ref: "2026 P1 Q3", solutionUrl: "https://www.maths.scot/advanced-higher/complex-numbers#18" },
            { ref: "2026 P1 Q7", solutionUrl: "https://www.maths.scot/advanced-higher/complex-numbers#19" },
          ],
        },
      ],
    },
    {
      id: "differential-equations",
      title: "Differential Equations",
      topics: [
        {
          name: "Differential Equations",
          questions: [
            { question: `Find the general solution of the differential equation: \\(3y\\,\\frac{dy}{dx}=\\frac{2x}{y}\\).`, answer: `\\(y=\\sqrt[3]{x^2+c}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differential-equations#1" },
            { question: `Consider this differential equation, where \\(x>0\\) and \\(0<y<1\\): \\(x\\,\\frac{dy}{dx}=y-y^2\\). By making use of partial fractions, express \\(y\\) in terms of \\(x\\).`, answer: `\\(y=\\frac{kx}{1+kx}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differential-equations#2" },
            { question: `Consider the following differential equation: \\(\\frac{dy}{dx}=\\frac{\\sec y}{y}\\). It is known that \\(y=\\frac{\\pi}{2}\\) when \\(x=\\frac{\\pi}{4}\\). Find the particular solution, in implicit form.`, answer: `\\(y\\sin y+\\cos y = x+\\frac{\\pi}{4}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differential-equations#3" },
            { question: `Solve the differential equation: \\(\\frac{dy}{dx}+2y=5e^{3x}\\).`, answer: `\\(y=e^{3x}+\\frac{c}{e^{2x}}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differential-equations#4" },
            { question: `Find the general solution of the differential equation: \\(x\\,\\frac{dy}{dx}+2y=\\cos x\\).`, answer: `\\(y=\\frac{\\sin x}{x}+\\frac{\\cos x}{x^2}+\\frac{c}{x^2}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differential-equations#5" },
            { question: `Find the particular solution of the following differential equation, given that \\(y=2\\) and \\(\\frac{dy}{dx}=-11\\) when \\(x=0\\): \\(\\frac{d^{2}y}{dx^2}-3\\frac{dy}{dx}-10y=0\\).`, answer: `\\(y=3e^{-2x}-e^{5x}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differential-equations#6" },
            { question: `Find the general solution of the differential equation: \\(9\\frac{d^{2}y}{dx^2}-12\\frac{dy}{dx}+4y=0\\).`, answer: `\\(y=(A+Bx)e^{2x/3}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differential-equations#7" },
            { question: `Find the general solution of the differential equation: \\(\\frac{d^{2}y}{dx^2}+2\\frac{dy}{dx}+5y=0\\).`, answer: `\\(y=e^{-x}(A\\sin 2x+B\\cos 2x)\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differential-equations#8" },
            { question: `Find the general solution of the differential equation: \\(\\frac{d^{2}y}{dx^2}-5\\frac{dy}{dx}+4y=4x-1\\).`, answer: `\\(y=Ae^x+Be^{4x}+x+1\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differential-equations#9" },
            { question: `Find the general solution of the differential equation: \\(\\frac{d^{2}y}{dx^2}-4\\frac{dy}{dx}+4y=6e^{2x}\\).`, answer: `\\(y=Ae^{2x}+Bxe^{2x}+3x^{2}e^{2x}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differential-equations#10" },
            { ref: "2017 Q14", solutionUrl: "https://www.maths.scot/advanced-higher/differential-equations#11" },
            { ref: "2019 Q13", solutionUrl: "https://www.maths.scot/advanced-higher/differential-equations#12" },
            { ref: "2021 P1 Q8", solutionUrl: "https://www.maths.scot/advanced-higher/differential-equations#13" },
            { ref: "2022 P2 Q8", solutionUrl: "https://www.maths.scot/advanced-higher/differential-equations#14" },
            { ref: "2023 P1 Q5", solutionUrl: "https://www.maths.scot/advanced-higher/differential-equations#15" },
            { ref: "2023 P2 Q13", solutionUrl: "https://www.maths.scot/advanced-higher/differential-equations#16" },
            { ref: "2025 P2 Q14", solutionUrl: "https://www.maths.scot/advanced-higher/differential-equations#17" },
            { ref: "2026 P1 Q4", solutionUrl: "https://www.maths.scot/advanced-higher/differential-equations#18" },
          ],
        },
      ],
    },
    {
      id: "differentiation",
      title: "Differentiation",
      topics: [
        {
          name: "Differentiation",
          questions: [
            { question: `Differentiate \\(f(x)=x^7\\tan x\\).`, answer: `\\(7x^6\\tan x+x^7\\sec^2 x\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differentiation#1" },
            { question: `Given \\(y=e^{\\sin x}\\sec x\\), find \\(\\frac{dy}{dx}\\). Express your answer in its simplest form.`, answer: `\\((1+\\sec x\\tan x)e^{\\sin x}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differentiation#2" },
            { question: `Differentiate \\(f(x)=(\\ln 3x)(\\cos^{-1} 2x)\\).`, answer: `\\(\\frac{\\cos^{-1} 2x}{x}-\\frac{2\\ln 3x}{\\sqrt{1-4x^2}}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differentiation#3" },
            { question: `Differentiate \\(f(x)=\\frac{2x-1}{1-x^2}\\). Simplify the derivative fully.`, answer: `\\(\\frac{2x^2-2x+2}{(1-x^2)^2}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differentiation#4" },
            { question: `Differentiate \\(f(x)=\\frac{e^{1+x^2}}{1+x^2}\\). Express the derivative in its simplest form.`, answer: `\\(\\frac{2x^3 e^{1+x^2}}{(1+x^2)^2}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differentiation#5" },
            { question: `Given \\(y=\\ln(\\text{cosec } x^2)\\), find \\(\\frac{dy}{dx}\\).`, answer: `\\(-2x\\cot x^2\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differentiation#6" },
            { question: `\\(f(x)=\\tan^{-1}\\left(\\frac{x}{x^3-4}\\right)\\). Find \\(f'(2)\\).`, answer: `\\(-1\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differentiation#7" },
            { question: `For \\(y\\cot x-y^3=2x\\), use implicit differentiation to obtain an expression for \\(\\frac{dy}{dx}\\) in terms of \\(x\\) and \\(y\\).`, answer: `\\(\\frac{2+y\\text{cosec}^2 x}{\\cot x-3y^2}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differentiation#8" },
            { question: `Find \\(\\frac{dy}{dx}\\) for the function defined implicitly by \\(\\frac{x}{y}=e^y\\).`, answer: `\\(\\frac{y}{y^2 e^y+x}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differentiation#9" },
            { question: `Use implicit differentiation to find \\(\\frac{dy}{dx}\\) and \\(\\frac{d^2 y}{dx^2}\\) for the function defined by \\(\\frac{x}{y}=y+1\\).`, answer: `\\(\\frac{dy}{dx} = \\frac{y}{x+y^2}\\), \\(\\frac{d^2 y}{dx^2} = -\\frac{2y^3}{(x+y^2)^3}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differentiation#10" },
            { question: `A curve is defined parametrically by \\(x=(\\ln t)^2\\), \\(y=2\\ln t\\), where \\(t > 0\\). Find and simplify \\(\\frac{dy}{dx}\\) and \\(\\frac{d^2 y}{dx^2}\\).`, answer: `\\(\\frac{dy}{dx} = \\frac{1}{\\ln t}\\), \\(\\frac{d^2 y}{dx^2} = -\\frac{1}{2(\\ln t)^3}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differentiation#11" },
            { question: `The position \\((x,\\,y)\\) of a particle moving in two-dimensional space at time \\(t\\) seconds is given in metres by the parametric equations \\(x=2t\\), \\(y=\\sin t\\), where \\(t\\geqslant 0\\). Find the speed of the particle at time \\(2\\) seconds, correct to \\(3\\) significant figures.`, answer: `\\(2.04\\text{ m/s}\\)`, paper: "2012 Q12" },
            { question: `A curve is defined by \\(y=x^{x^2-2}\\). Use logarithmic differentiation to find \\(\\frac{dy}{dx}\\). Express your answer in terms of \\(x\\).`, answer: `\\(x^{x^2-2}\\left(2x\\ln x+x-\\frac{2}{x}\\right)\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differentiation#13" },
            { question: `Let \\(e^y=\\frac{(2x-1)e^{3x}}{(4x+1)^2}\\), \\(x\\in\\mathbb{R}\\), \\(x > \\frac{1}{2}\\). Use logarithmic differentiation to find \\(\\frac{dy}{dx}\\).`, answer: `\\(\\frac{2}{2x-1}+3-\\frac{8}{4x+1}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differentiation#14" },
            { question: `A spherical balloon of radius \\(r\\) cm is being inflated by a pump at a constant rate of \\(20\\text{ cm}^3\\text{ s}^{-1}\\). Calculate the rate of change of the radius with respect to time when \\(r=5\\). [Note: a sphere has volume \\(V=\\frac{4}{3}\\pi r^3\\).]`, answer: `\\(\\frac{1}{5\\pi}\\text{ cm s}^{-1}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differentiation#15" },
            { question: `The radius of a cylindrical column of liquid is decreasing at the rate of \\(0.02\\text{ m s}^{-1}\\) while the height is increasing at the rate of \\(0.01\\text{ m s}^{-1}\\). Find the rate of change of the volume when the radius is \\(0.6\\) metres and the height is \\(2\\) metres. [Recall that the volume of a cylinder is given by \\(V=\\pi r^2 h\\).]`, answer: `\\(-0.0444\\pi\\text{ m}^3\\text{ s}^{-1}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/differentiation#16" },
            { question: `A curve is defined by the parametric equations \\(x=t^2+t-1\\), \\(y=2t^2-t+2\\) for all \\(t\\). Show that the point \\(A(-1,\\,5)\\) lies on the curve and obtain an equation of the tangent to the curve at the point A.`, answer: `\\(y=5x+10\\)`, paper: "2002 Q3", solutionUrl: "https://www.maths.scot/advanced-higher/differentiation#17" },
          ],
        },
      ],
    },
    {
      id: "functions-and-graphs",
      title: "Functions & Graphs",
      topics: [
        {
          name: "Functions & Graphs",
          questions: [
            { question: `Identify the vertical asymptotes of the curve defined by the equation: \\(y=\\frac{x^2+1}{x^2-x-6}\\)`, answer: `\\(x=-2\\) and \\(x=3\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/functions-and-graphs#1" },
            { question: `Identify the vertical asymptote of the curve defined by the equation: \\(y=\\frac{\\sin x}{x(x-1)}\\)`, answer: `\\(x=1\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/functions-and-graphs#2" },
            { question: `A function is defined on a suitable domain by \\(f(x)=\\frac{3x^2+2}{x^2-2}\\). Obtain equations for the asymptotes of the graph of \\(y=f(x)\\).`, answer: `Vertical asymptotes: \\(x=-\\sqrt{2}\\) and \\(x=\\sqrt{2}\\). Horizontal asymptote: \\(y=3\\).`, solutionUrl: "https://www.maths.scot/advanced-higher/functions-and-graphs#3" },
            { question: `A function is defined on a suitable domain by \\(f(x)=\\frac{x^3-x}{x^2-2x-8}\\). Obtain equations for the asymptotes of the graph of \\(y=f(x)\\).`, answer: `Vertical asymptotes: \\(x=-2\\) and \\(x=4\\). Oblique asymptote: \\(y=x+2\\).`, solutionUrl: "https://www.maths.scot/advanced-higher/functions-and-graphs#4" },
            { question: `The function \\(f\\) is defined on a suitable domain by \\(f(x)=x^2+n\\), where the constant \\(n\\in\\mathbb{R}\\). State whether \\(f\\) is odd, even or neither. Give a reason for your answer.`, answer: `\\(f\\) is even.`, solutionUrl: "https://www.maths.scot/advanced-higher/functions-and-graphs#5" },
            { question: `The function \\(f\\) is defined on a suitable domain by \\(f(x)=x^3\\cos x\\). State whether \\(f\\) is odd, even or neither. Give a reason for your answer.`, answer: `\\(f\\) is odd.`, solutionUrl: "https://www.maths.scot/advanced-higher/functions-and-graphs#6" },
            { question: `The function \\(f\\) is defined on a suitable domain by \\(f(x)=e^{2x}\\). State whether \\(f\\) is odd, even or neither. Give a reason for your answer.`, answer: `\\(f\\) is neither even nor odd.`, solutionUrl: "https://www.maths.scot/advanced-higher/functions-and-graphs#7" },
            { question: `A function is defined on a suitable domain by \\(f(x)=\\frac{3x^2+2}{x^2-2}\\). Determine whether the graph of \\(y=f(x)\\) has any points of inflection. Justify your answer.`, answer: `The graph of \\(y=f(x)\\) has no points of inflection.`, solutionUrl: "https://www.maths.scot/advanced-higher/functions-and-graphs#8" },
            { question: `Determine the coordinates and natures of all stationary points and points of inflection on the graph of \\(y=2x^3-12x^2-30x+9\\).`, answer: `Maximum turning point at \\((-1,\\,25)\\), minimum turning point at \\((5,\\,-191)\\), and a non-horizontal point of inflection at \\((2,\\,-83)\\).`, solutionUrl: "https://www.maths.scot/advanced-higher/functions-and-graphs#9" },
            { question: `Find the coordinates of the point of inflexion on the graph of \\(y=\\sin x+\\tan x\\), where \\(-\\frac{\\pi}{2}< x<\\frac{\\pi}{2}\\).`, answer: `\\((0,\\,0)\\)`, paper: "2016 Exemplar Q10" },
            { ref: "2019 Q3", solutionUrl: "https://www.maths.scot/advanced-higher/functions-and-graphs#11" },
            { ref: "2024 P1 Q5", solutionUrl: "https://www.maths.scot/advanced-higher/functions-and-graphs#12" },
          ],
        },
      ],
    },
    {
      id: "integration",
      title: "Integration",
      topics: [
        {
          name: "Integration",
          questions: [
            { question: `Find \\(\\Large\\int\\normalsize \\large\\frac{3x^2\\,-\\,1}{2x^3\\,-\\,2x\\,+\\,1}\\normalsize\\,dx \\)`, answer: `\\( \\frac{1}{2}\\,ln\\vert 2x^3\\!-\\!2x+1\\vert +c \\)`, videoId: "S3lOe8FCO3k", timestamp: 18, solutionUrl: "https://www.maths.scot/advanced-higher/integration#1" },
            { question: `Find \\(\\Large\\int\\normalsize \\large\\frac{6\\,dx}{\\sqrt{4\\,-\\,9x^2}} \\)`, answer: `\\( 2\\,sin^{-1}\\left(\\frac{3x}{2}\\right)+c \\)`, videoId: "S3lOe8FCO3k", timestamp: 170, solutionUrl: "https://www.maths.scot/advanced-higher/integration#2" },
            { ref: "2018 Q2", videoId: "S3lOe8FCO3k", timestamp: 260, solutionUrl: "https://www.maths.scot/advanced-higher/integration#3" },
            { question: `Find the exact value of \\(\\Large\\int^{\\small 2\\normalsize}_{\\small 1\\normalsize} \\normalsize \\large\\frac{x\\,+\\,4}{(x\\,+\\,1)^2(2x\\,-\\,1)}\\normalsize\\,dx\\)`, answer: `\\( ln\\,2-\\frac{1}{6} \\)`, videoId: "S3lOe8FCO3k", timestamp: 427, paper: "Specimen Q11" },
            { question: `Use the substitution \\(u=tan\\,x\\) to find \\(\\Large\\int\\normalsize\\!\\large\\frac{dx}{sin\\,x\\,cos\\,x}\\)`, answer: `\\( ln\\vert tan\\,x\\vert+c \\)`, videoId: "S3lOe8FCO3k", timestamp: 781, solutionUrl: "https://www.maths.scot/advanced-higher/integration#5" },
            { ref: "2018 Q8", videoId: "S3lOe8FCO3k", timestamp: 893, solutionUrl: "https://www.maths.scot/advanced-higher/integration#6" },
            { ref: "2023 P1 Q4", videoId: "S3lOe8FCO3k", timestamp: 1068, solutionUrl: "https://www.maths.scot/advanced-higher/integration#7" },
            { question: `Find \\(\\Large\\int\\normalsize\\!x^2\\,e^{3x}\\,dx\\)`, answer: `\\( \\frac{1}{3} x^2\\,e^{3x}-\\frac{2}{9}\\,x\\,e^{3x}+\\frac{2}{27} e^{3x}+c \\)`, videoId: "S3lOe8FCO3k", timestamp: 1203, paper: "2016 Specimen Q5" },
            { question: `Use integration by parts to obtain \\(\\Large\\int\\normalsize\\!e^x\\,cos\\,x\\,dx\\)`, answer: `\\( \\frac{1}{2}\\left(e^x\\,cos\\,x+e^x\\,sin\\,x\\right)+c \\)`, videoId: "S3lOe8FCO3k", timestamp: 1344, solutionUrl: "https://www.maths.scot/advanced-higher/integration#9" },
            { ref: "2016 Q9", videoId: "S3lOe8FCO3k", timestamp: 1492, solutionUrl: "https://www.maths.scot/advanced-higher/integration#10" },
            { question: `Use integration to prove that the volume of a sphere of radius \\(r\\) is \\(\\frac{4}{3}\\pi r^{3}\\)`, answer: `\\( \\frac{4}{3} \\pi r^3 \\)`, videoId: "S3lOe8FCO3k", timestamp: 1701, solutionUrl: "https://www.maths.scot/advanced-higher/integration#11" },
            { ref: "2017 Q16", videoId: "S3lOe8FCO3k", timestamp: 1888, solutionUrl: "https://www.maths.scot/advanced-higher/integration#12" },
            { ref: "2019 Q16", videoId: "S3lOe8FCO3k", timestamp: 2040, solutionUrl: "https://www.maths.scot/advanced-higher/integration#13" },
            { ref: "2023 P2 Q2", solutionUrl: "https://www.maths.scot/advanced-higher/integration#14" },
            { ref: "2024 P1 Q8", solutionUrl: "https://www.maths.scot/advanced-higher/integration#15" },
            { ref: "2024 P2 Q8", solutionUrl: "https://www.maths.scot/advanced-higher/integration#16" },
            { ref: "2026 P2 Q11", solutionUrl: "https://www.maths.scot/advanced-higher/integration#17" },
          ],
        },
      ],
    },
    {
      id: "maclaurin-series",
      title: "Maclaurin Series",
      topics: [
        {
          name: "Maclaurin Series",
          questions: [
            { question: `Given \\(f(x)=e^{3x}\\), obtain the Maclaurin expansion for \\(f(x)\\) up to, and including, the term in \\(x^3\\).`, answer: `\\(1+3x+\\frac{9}{2}x^2+\\frac{9}{2}x^3+\\cdots\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/maclaurin-series#1" },
            { question: `Given \\(f(x)=\\sin 4x\\), obtain the Maclaurin expansion for \\(f(x)\\) up to, and including, the term in \\(x^3\\).`, answer: `\\(4x-\\frac{32}{3}x^3+\\cdots\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/maclaurin-series#2" },
            { question: `Use the answers from the previous two examples to obtain the Maclaurin expansion for \\(e^{3x}\\sin 4x\\) up to, and including, the term in \\(x^3\\).`, answer: `\\(4x+12x^2+\\frac{22}{3}x^3+\\cdots\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/maclaurin-series#3" },
            { question: `Use the answer to Example 3 to obtain the first three non-zero terms of the Maclaurin expansion for \\(\\frac{d}{dx}(e^{3x}\\sin 4x)\\).`, answer: `\\(4+24x+22x^2+\\cdots\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/maclaurin-series#4" },
            { question: `Given the following power series: \\(\\sec^2 x = 1+x^2+\\frac{2}{3}x^4+\\cdots\\) deduce the Maclaurin series for \\(\\tan 2x\\) up to, and including the term in \\(x^5\\).`, answer: `\\(2x+\\frac{8}{3}x^3+\\frac{64}{15}x^5+\\cdots\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/maclaurin-series#5" },
            { ref: "2023 P2 Q15" },
            { ref: "2024 P2 Q7", solutionUrl: "https://www.maths.scot/advanced-higher/maclaurin-series#7" },
            { ref: "2025 P2 Q6", solutionUrl: "https://www.maths.scot/advanced-higher/maclaurin-series#8" },
            { ref: "2026 P2 Q3", solutionUrl: "https://www.maths.scot/advanced-higher/maclaurin-series#9" },
          ],
        },
      ],
    },
    {
      id: "matrices",
      title: "Matrices",
      topics: [
        {
          name: "Matrices",
          questions: [
            { question: `Matrix \\(A\\) is defined by \\(A=\\begin{pmatrix} -4 & -3\\\\ 6 & 5 \\end{pmatrix}\\). Find: (a) \\(A^{-1}\\) (b) \\(A'\\).`, answer: `(a) \\(A^{-1} = \\frac{1}{2}\\begin{pmatrix} -5 & -3\\\\ 6 & 4 \\end{pmatrix}\\) (b) \\(A' = \\begin{pmatrix} -4 & 6\\\\ -3 & 5 \\end{pmatrix}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/matrices#1" },
            { question: `Matrix \\(P=\\begin{pmatrix} -9 & 3\\\\ n & 4 \\end{pmatrix}\\), where \\(n\\in\\mathbb{R}\\). Find the value of \\(n\\) such that \\(P\\) is singular.`, answer: `\\(n=-12\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/matrices#2" },
            { question: `Matrices \\(A=\\begin{pmatrix} 4 & 2\\\\ 1 & p \\end{pmatrix}\\) and \\(B=\\begin{pmatrix} 8 & 2\\\\ q & 1 \\end{pmatrix}\\). Given that \\(B=2A'\\), find \\(p\\) and \\(q\\).`, answer: `\\(p=\\frac{1}{2}\\), \\(q=4\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/matrices#3" },
            { question: `Show that \\(A=\\begin{pmatrix} \\frac{3}{5} & -\\frac{4}{5}\\\\ \\frac{4}{5} & \\frac{3}{5} \\end{pmatrix}\\) is orthogonal.`, answer: `\\(AA' = \\begin{pmatrix} 1 & 0\\\\ 0 & 1 \\end{pmatrix} = I\\), so \\(A\\) is orthogonal.`, solutionUrl: "https://www.maths.scot/advanced-higher/matrices#4" },
            { question: `A square matrix \\(A\\) is said to be symmetric if \\(A'=A\\) and skew-symmetric if \\(A'=-A\\). For any \\(2\\times 2\\) matrix \\(A\\), show that \\(A+A'\\) is symmetric and \\(A-A'\\) is skew-symmetric.`, answer: `Let \\(A=\\begin{pmatrix} a & b\\\\ c & d \\end{pmatrix}\\). Then \\((A+A')' = A+A'\\), so it is symmetric. \\((A-A')' = -(A-A')\\), so it is skew-symmetric.`, solutionUrl: "https://www.maths.scot/advanced-higher/matrices#5" },
            { question: `\\(A\\) is the matrix \\(\\begin{pmatrix} 3 & 0\\\\ \\lambda & -2 \\end{pmatrix}\\). Show that \\(A^2\\) can be expressed in the form \\(pA+qI\\), stating the values of \\(p\\) and \\(q\\).`, answer: `\\(A^2 = A+6I\\), so \\(p=1\\), \\(q=6\\).`, solutionUrl: "https://www.maths.scot/advanced-higher/matrices#6" },
            { question: `The matrix \\(A=\\begin{pmatrix} 2 & 3 & 1\\\\ -1 & \\mu & 4\\\\ 5 & 0 & -2 \\end{pmatrix}\\). Given that the determinant of \\(A\\) is \\(36\\), determine the value of \\(\\mu\\).`, answer: `\\(\\mu=2\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/matrices#7" },
            { question: `Obtain the value(s) of \\(p\\) for which the matrix \\(A=\\begin{pmatrix} p & 2 & 0\\\\ 3 & p & 1\\\\ 0 & -1 & -1 \\end{pmatrix}\\) is singular.`, answer: `\\(p=3\\) or \\(p=-2\\)`, paper: "2015 Q5" },
            { question: `Find the inverse of the non-singular matrix \\(A=\\begin{pmatrix} 1 & 2 & -1\\\\ -2 & 0 & 1\\\\ 1 & -1 & 0 \\end{pmatrix}\\).`, answer: `\\(A^{-1} = \\begin{pmatrix} 1 & 1 & 2\\\\ 1 & 1 & 1\\\\ 2 & 3 & 4 \\end{pmatrix}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/matrices#9" },
            { question: `(a) Write down the \\(2\\times 2\\) matrix \\(M_1\\) associated with reflection in the \\(x\\)-axis. (b) Write down the \\(2\\times 2\\) matrix \\(M_2\\) that represents reflection in the line \\(y=-x\\). (c) Find the \\(2\\times 2\\) matrix \\(M_3\\) associated with reflection in the line \\(y=-x\\) followed by reflection in the \\(x\\)-axis. (d) State the single transformation associated with \\(M_3\\).`, answer: `(a) \\(M_1 = \\begin{pmatrix} 1 & 0\\\\ 0 & -1 \\end{pmatrix}\\) (b) \\(M_2 = \\begin{pmatrix} 0 & -1\\\\ -1 & 0 \\end{pmatrix}\\) (c) \\(M_3 = \\begin{pmatrix} 0 & -1\\\\ 1 & 0 \\end{pmatrix}\\) (d) Anti-clockwise rotation of \\(\\frac{\\pi}{2}\\) radians about the origin.`, solutionUrl: "https://www.maths.scot/advanced-higher/matrices#10" },
            { ref: "2018 Q11", solutionUrl: "https://www.maths.scot/advanced-higher/matrices#11" },
            { ref: "2025 P1 Q4", solutionUrl: "https://www.maths.scot/advanced-higher/matrices#12" },
            { ref: "2025 P2 Q8", solutionUrl: "https://www.maths.scot/advanced-higher/matrices#13" },
            { ref: "2026 P1 Q5", solutionUrl: "https://www.maths.scot/advanced-higher/matrices#14" },
          ],
        },
      ],
    },
    {
      id: "methods-of-proof",
      title: "Methods of Proof",
      topics: [
        {
          name: "Methods of Proof",
          questions: [
            { question: `Find a counterexample to show that this statement is false: \\(\\forall n \\in \\mathbb R, \\sqrt{n^{2}} = n.\\)`, answer: `\\(n = -1\\) is a counterexample. \\(\\sqrt{(-1)^{2}} = 1\\), not \\(-1.\\)`, videoId: "f3CiNu2Jmak", timestamp: 55, solutionUrl: "https://www.maths.scot/advanced-higher/methods-of-proof#1" },
            { question: `Find a counterexample to show that the following conjecture is false:<br><i>Let \\(P_n\\) represent the product of the first \\(n\\) prime numbers. Then \\(P_{n}+1\\) is prime \\(\\forall n \\in \\mathbb N.\\)</i>`, answer: `\\(n = 6\\) is a counterexample. \\(P_{6}+1 = 2 \\times 3 \\times 5 \\times 7 \\times 11 \\times 13 + 1 = 30031 = 59 \\times 509\\) (which is composite).`, videoId: "f3CiNu2Jmak", timestamp: 100, solutionUrl: "https://www.maths.scot/advanced-higher/methods-of-proof#2" },
            { question: `Prove that if \\(a\\) is a multiple of \\(2\\) and \\(b\\) is a multiple of \\(3\\) then \\(ab\\) is a multiple of \\(6.\\)`, answer: `Let \\(a = 2m\\) and \\(b = 3n.\\) Then \\(ab = (2m)(3n) = 6mn.\\) Since \\(mn \\in \\mathbb Z\\), \\(6\\) is a factor of \\(ab.\\)`, videoId: "f3CiNu2Jmak", timestamp: 287, solutionUrl: "https://www.maths.scot/advanced-higher/methods-of-proof#3" },
            { question: `Prove that the sum of the squares of two odd numbers is even.`, answer: `Let the numbers be \\(2k-1\\) and \\(2l-1.\\) Sum of squares: \\((2k-1)^2 + (2l-1)^2 = 4k^2-4k+1 + 4l^2-4l+1 = 2(2k^2-2k+2l^2-2l+1).\\) This is a multiple of \\(2\\), therefore it is even.`, videoId: "f3CiNu2Jmak", timestamp: 393, solutionUrl: "https://www.maths.scot/advanced-higher/methods-of-proof#4" },
            { question: `Prove that any multiple of \\(3\\) can be expressed as the sum of three consecutive integers.`, answer: `Let the multiple of \\(3\\) be \\(n = 3k.\\) This can be rewritten as \\(k+k+k\\), which is equivalent to \\((k-1) + k + (k+1)\\) (the sum of three consecutive integers).`, videoId: "f3CiNu2Jmak", timestamp: 534, solutionUrl: "https://www.maths.scot/advanced-higher/methods-of-proof#5" },
            { question: `Use proof by contradiction to demonstrate that \\(\\sqrt{2}\\) is irrational.`, answer: `Assume \\(\\sqrt{2} = \\frac{p}{q}\\) (a fully simplified fraction). Squaring gives \\(p^2 = 2q^2\\), meaning \\(p^2\\) (and thus \\(p\\)) is even. Substitute \\(p=2m\\) to get \\(4m^2 = 2q^2\\), which simplifies to \\(q^2 = 2m^2.\\) This means \\(q^2\\) (and thus \\(q\\)) is also even. This contradicts the assumption that \\(\\frac{p}{q}\\) is fully simplified, so \\(\\sqrt{2}\\) must be irrational.`, videoId: "f3CiNu2Jmak", timestamp: 607, solutionUrl: "https://www.maths.scot/advanced-higher/methods-of-proof#6" },
            { question: `Use proof by contradiction to show that there is an infinite number of prime numbers.`, answer: `Assume there are finite primes \\(p_1, p_2, \\dots, p_n.\\) Let \\(P = (p_1 p_2 \\dots p_n) + 1.\\) \\(P\\) must be either a new prime greater than all others, or a composite number not divisible by any of the \\(n\\) primes (it always leaves a remainder of \\(1\\)). Both cases contradict the assumption of finite primes.`, videoId: "f3CiNu2Jmak", timestamp: 853, solutionUrl: "https://www.maths.scot/advanced-higher/methods-of-proof#7" },
            { question: `Use the contrapositive to prove that if \\(n^2\\) is a multiple of \\(3\\) then \\(n\\) is a multiple of \\(3.\\)`, answer: `The contrapositive is "If \\(n\\) is not a multiple of \\(3\\), then \\(n^2\\) is not a multiple of \\(3.\\)" Testing the two cases (\\(n=3k+1\\) and \\(n=3k+2\\)): \\((3k+1)^2 = 3(3k^2+2k)+1\\) and \\((3k+2)^2 = 3(3k^2+4k+1)+1.\\) In both cases, \\(n^2\\) leaves a remainder of \\(1\\) when divided by \\(3\\), proving the contrapositive and therefore the original statement.`, videoId: "f3CiNu2Jmak", timestamp: 1126, solutionUrl: "https://www.maths.scot/advanced-higher/methods-of-proof#8" },
            { question: `Prove by contrapositive that if \\(pq\\) is irrational then at least one of \\(p\\) or \\(q\\) is irrational.`, answer: `The contrapositive is "If \\(p\\) and \\(q\\) are both rational, then \\(pq\\) is rational." Let \\(p = \\frac{a}{b}\\) and \\(q = \\frac{c}{d}.\\) Their product \\(pq = \\frac{ac}{bd}\\), which is a rational fraction, proving the contrapositive and the original statement.`, videoId: "f3CiNu2Jmak", timestamp: 1393, solutionUrl: "https://www.maths.scot/advanced-higher/methods-of-proof#9" },
            { question: `Prove by induction that \\(\\forall n \\in \\mathbb N, 6^{n}+4\\) is divisible by \\(10.\\)`, answer: `Base case (\\(n=1\\)): \\(6^1+4 = 10\\) (divisible by \\(10\\)). Assume true for \\(n=k\\): \\(6^k+4 = 10a \\implies 6^k = 10a-4.\\) For \\(n=k+1\\): \\(6^{k+1}+4 = 6(6^k)+4 = 6(10a-4)+4 = 60a-20 = 10(6a-2).\\) Since this is a multiple of \\(10\\), it is true \\(\\forall n \\in \\mathbb N.\\)`, videoId: "f3CiNu2Jmak", timestamp: 1519, solutionUrl: "https://www.maths.scot/advanced-higher/methods-of-proof#10" },
            { question: `The Fibonacci sequence is defined by the recurrence relation: \\(F_1=F_2=1\\) and \\(F_{n+2}=F_{n+1}+F_{n}\\ (n \\ge 1).\\)<br>Prove by induction that, \\(\\forall n \\in \\mathbb N, F_1+F_2+\\dots +F_n=F_{n+2}-1.\\)`, answer: `Base case (\\(n=1\\)): \\(F_1 = F_3-1 \\implies 1 = 2-1\\) (True). Assume true for \\(k\\): \\(F_1+\\dots+F_k = F_{k+2}-1.\\) For \\(k+1\\): \\((F_1+\\dots+F_k) + F_{k+1} = (F_{k+2}-1) + F_{k+1} = (F_{k+2}+F_{k+1})-1 = F_{k+3}-1\\), completing the proof.`, videoId: "f3CiNu2Jmak", timestamp: 1776, solutionUrl: "https://www.maths.scot/advanced-higher/methods-of-proof#11" },
            { ref: "2016 Q5", videoId: "f3CiNu2Jmak", timestamp: 1989, solutionUrl: "https://www.maths.scot/advanced-higher/methods-of-proof#12" },
            { ref: "2019 Q14", videoId: "f3CiNu2Jmak", timestamp: 2256, solutionUrl: "https://www.maths.scot/advanced-higher/methods-of-proof#13" },
            { ref: "2023 P1 Q8", videoId: "f3CiNu2Jmak", timestamp: 2497, solutionUrl: "https://www.maths.scot/advanced-higher/methods-of-proof#14" },
            { ref: "2022 P1 Q6", videoId: "f3CiNu2Jmak", timestamp: 2664 },
            { ref: "2023 P2 Q12", videoId: "f3CiNu2Jmak", timestamp: 2878 },
            { ref: "2024 P2 Q11", videoId: "f3CiNu2Jmak", timestamp: 3196, solutionUrl: "https://www.maths.scot/advanced-higher/methods-of-proof#15" },
            { ref: "2025 P2 Q15", solutionUrl: "https://www.maths.scot/advanced-higher/methods-of-proof#16" },
            { ref: "2026 P2 Q12", solutionUrl: "https://www.maths.scot/advanced-higher/methods-of-proof#17" },
            { ref: "2026 P2 Q15", solutionUrl: "https://www.maths.scot/advanced-higher/methods-of-proof#18" },
          ],
        },
      ],
    },
    {
      id: "number-theory",
      title: "Number Theory",
      topics: [
        {
          name: "Number Theory",
          questions: [
            { question: `Use the Euclidean algorithm to find the greatest common divisor of \\(98\\) and \\(35.\\)`, answer: `The greatest common divisor of \\(98\\) and \\(35\\) is \\(7.\\)`, videoId: "nVZV1HfcKPg", timestamp: 58, solutionUrl: "https://www.maths.scot/advanced-higher/number-theory#1" },
            { question: `Use Euclid's algorithm to find the highest common factor of \\(714\\) and \\(221.\\)`, answer: `\\(\\text{hcf}(714, 221) = 17\\)`, videoId: "nVZV1HfcKPg", timestamp: 147, solutionUrl: "https://www.maths.scot/advanced-higher/number-theory#2" },
            { question: `Find integers \\(a\\) and \\(b\\) such that \\(319a+132b=11.\\)`, answer: `\\(a=5\\) and \\(b=-12\\)`, videoId: "nVZV1HfcKPg", timestamp: 233, solutionUrl: "https://www.maths.scot/advanced-higher/number-theory#3" },
            { question: `Show that the greatest common divisor of \\(133\\) and \\(612\\) is \\(1.\\) Hence find \\(x, y \\in \\mathbb Z\\) such that \\(133x+612y=1.\\)`, answer: `\\(x=-23\\) and \\(y=5\\)`, videoId: "nVZV1HfcKPg", timestamp: 453, solutionUrl: "https://www.maths.scot/advanced-higher/number-theory#4" },
            { question: `Convert the decimal number \\(3508\\) into base \\(7.\\)`, answer: `\\(3508_{10} = 13141_7\\)`, videoId: "nVZV1HfcKPg", timestamp: 916, solutionUrl: "https://www.maths.scot/advanced-higher/number-theory#5" },
            { question: `Use the division algorithm to convert \\(7054_{9}\\) into base \\(8.\\)`, answer: `\\(12040_8\\)`, videoId: "nVZV1HfcKPg", timestamp: 1030, solutionUrl: "https://www.maths.scot/advanced-higher/number-theory#6" },
            { ref: "2023 P2 Q6", videoId: "nVZV1HfcKPg", timestamp: 1175, solutionUrl: "https://www.maths.scot/advanced-higher/number-theory#7" },
            { ref: "2017 Q8", videoId: "nVZV1HfcKPg", timestamp: 1479 },
            { ref: "2018 Q5", videoId: "nVZV1HfcKPg", timestamp: 1687 },
            { ref: "2022 P2 Q3", videoId: "nVZV1HfcKPg", timestamp: 1859 },
            { ref: "2024 P2 Q2", videoId: "nVZV1HfcKPg", timestamp: 2021, solutionUrl: "https://www.maths.scot/advanced-higher/number-theory#9" },
            { ref: "2019 Q12", videoId: "nVZV1HfcKPg", timestamp: 2183 },
            { ref: "2023 P2 Q9", videoId: "nVZV1HfcKPg", timestamp: 2306, solutionUrl: "https://www.maths.scot/advanced-higher/number-theory#8" },
            { ref: "2025 P2 Q4", videoId: "nVZV1HfcKPg", timestamp: 0, solutionUrl: "https://www.maths.scot/advanced-higher/number-theory#10" },
            { ref: "2026 P2 Q4", solutionUrl: "https://www.maths.scot/advanced-higher/number-theory#11" },
            { ref: "2026 P2 Q9", solutionUrl: "https://www.maths.scot/advanced-higher/number-theory#12" },
          ],
        },
      ],
    },
    {
      id: "partial-fractions",
      title: "Partial Fractions",
      topics: [
        {
          name: "Partial Fractions",
          questions: [
            { question: `Write \\(\\frac{3x+23}{(x-4)(x+3)}\\) in partial fractions.`, answer: `\\(\\frac{5}{x-4} - \\frac{2}{x+3}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/partial-fractions#1" },
            { question: `Express \\(\\frac{8x-21}{x^2-3x}\\) in partial fractions.`, answer: `\\(\\frac{7}{x} + \\frac{1}{x-3}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/partial-fractions#2" },
            { question: `Write \\(\\frac{2-4x}{x^3-3x^2+2x}\\) in partial fractions.`, answer: `\\(\\frac{1}{x} + \\frac{2}{x-1}-\\frac{3}{x-2}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/partial-fractions#3" },
            { question: `Express \\(\\frac{7x+2}{x^{2}(x+2)}\\) in partial fractions.`, answer: `\\(\\frac{3}{x}+\\frac{1}{x^2}-\\frac{3}{x+2}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/partial-fractions#4" },
            { question: `Express \\(\\frac{1-5x}{x^3-2x^2+x}\\) in partial fractions.`, answer: `\\(\\frac{1}{x} - \\frac{1}{x-1} - \\frac{4}{(x-1)^2}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/partial-fractions#5" },
            { question: `Express \\(\\frac{3x^2+2}{x^3+2x}\\) in partial fractions.`, answer: `\\(\\frac{1}{x} + \\frac{2x}{x^2+2}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/partial-fractions#6" },
            { question: `Express \\(\\frac{x^2-x+6}{x^2+x-2}\\) in partial fractions.`, answer: `\\(1 - \\frac{4}{x+2}+\\frac{2}{x-1}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/partial-fractions#7" },
            { question: `Express \\(\\frac{3x^4-3x^3+7x^2-5x+6}{x^3-x^2+x-1}\\) in partial fractions.`, answer: `\\(3x+\\frac{4}{x-1}-\\frac{2}{x^2+1}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/partial-fractions#8" },
            { ref: "2022 P2 Q1", solutionUrl: "https://www.maths.scot/advanced-higher/partial-fractions#9" },
            { ref: "2023 P1 Q2", solutionUrl: "https://www.maths.scot/advanced-higher/partial-fractions#10" },
            { ref: "2024 P2 Q13" },
            { ref: "2025 P2 Q3", solutionUrl: "https://www.maths.scot/advanced-higher/partial-fractions#12" },
            { ref: "2026 P2 Q13", solutionUrl: "https://www.maths.scot/advanced-higher/partial-fractions#13" },
          ],
        },
      ],
    },
    {
      id: "sequences-and-series",
      title: "Sequences & Series",
      topics: [
        {
          name: "Sequences & Series",
          questions: [
            { question: `The second and fifth terms of an arithmetic sequence are \\(7\\) and \\(19\\) respectively. Find the sum of the first \\(50\\) terms of this sequence.`, answer: `\\(5050\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/sequences-and-series#1" },
            { question: `The second and fifth terms of an geometric sequence are \\(24\\) and \\(3\\) respectively. Find the sum of the first \\(10\\) terms of this sequence.`, answer: `\\(\\frac{3069}{32}\\) (or \\(95.90625\\))`, solutionUrl: "https://www.maths.scot/advanced-higher/sequences-and-series#2" },
            { question: `A geometric series has first term \\(6\\) and sum to infinity \\(18\\). Find its fourth term.`, answer: `\\(\\frac{16}{9}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/sequences-and-series#3" },
            { question: `The first three terms of a geometric series are given by \\(x+6\\), \\(x+2\\), \\(x-1\\). Find \\(x\\), explain why this series converges and find the sum to infinity.`, answer: `\\(x=10\\); it converges because \\(-1 < \\frac{3}{4} < 1\\); Sum to infinity is \\(64\\).`, solutionUrl: "https://www.maths.scot/advanced-higher/sequences-and-series#4" },
            { question: `Find the lowest value of \\(n\\) for which the sum \\(S_n\\) of the arithmetic series \\(5+8+11+14+\\cdots\\) exceeds \\(500\\).`, answer: `\\(n=18\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/sequences-and-series#5" },
            { question: `Find the sum of the finite arithmetic series \\(7+11+15+\\cdots+163\\).`, answer: `\\(3400\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/sequences-and-series#6" },
            { question: `Find the value of \\(L\\) for which \\(65+61+57+53+\\cdots+L = 96\\).`, answer: `\\(L = -59\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/sequences-and-series#7" },
            { question: `\\(S_n\\) is defined by \\(\\sum^{n}_{r=1}\\,\\left(r^3-2r\\right)\\). Find and fully factorise an expression for \\(S_{n}\\).`, answer: `\\(\\frac{n(n+1)(n^2+n-4)}{4}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/sequences-and-series#8" },
            { question: `Evaluate \\(\\sum^{50}_{r=20} 3r^2\\).`, answer: `\\(121,365\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/sequences-and-series#9" },
            { question: `The sum of the first twenty terms of an arithmetic sequence is \\(320\\). The twenty-first term is \\(37\\). What is the sum of the first ten terms?`, answer: `\\(60\\)`, paper: "2015 Q3", solutionUrl: "https://www.maths.scot/advanced-higher/sequences-and-series#10" },
            { ref: "2023 P1 Q7", solutionUrl: "https://www.maths.scot/advanced-higher/sequences-and-series#11" },
            { ref: "2023 P2 Q8", solutionUrl: "https://www.maths.scot/advanced-higher/sequences-and-series#12" },
            { ref: "2024 P1 Q3", solutionUrl: "https://www.maths.scot/advanced-higher/sequences-and-series#13" },
            { ref: "2024 P2 Q9", solutionUrl: "https://www.maths.scot/advanced-higher/sequences-and-series#14" },
            { ref: "2025 P2 Q10", solutionUrl: "https://www.maths.scot/advanced-higher/sequences-and-series#15" },
          ],
        },
      ],
    },
    {
      id: "systems-of-equations",
      title: "Systems of Equations",
      topics: [
        {
          name: "Systems of Equations",
          questions: [
            { question: `Use Gaussian elimination to solve this system of equations: \\(2x+y+z=2\\), \\(x-3y-z=5\\), \\(x+y+2z=3\\).`, answer: `\\(x=1\\), \\(y=-2\\), \\(z=2\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/systems-of-equations#1" },
            { question: `The points \\((1,-4)\\), \\((2,-2)\\) and \\((3,10)\\) lie on a parabola. Find the equation of the parabola.`, answer: `\\(y=5x^2-13x+4\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/systems-of-equations#2" },
            { question: `Use Gaussian elimination to show that this system of equations involves redundancy (\\(x+y+z=4\\), \\(3x-y+2z=13\\), \\(2x-2y+z=9\\)). Obtain a parametric solution of the system of equations.`, answer: `\\(x=\\frac{-3\\lambda+17}{4}\\), \\(y=-\\frac{\\lambda+1}{4}\\), \\(z=\\lambda\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/systems-of-equations#3" },
            { question: `Use Gaussian elimination to determine the value of \\(k\\) which leads to redundancy in this system of equations (\\(3x-y+z=2\\), \\(x+2y+2z=6\\), \\(x-5y+kz=-10\\)).`, answer: `\\(k=-3\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/systems-of-equations#4" },
            { question: `Use Gaussian elimination on the system of equations below to give an expression for \\(z\\) in terms of \\(\\lambda\\) (\\(x+2y+6z=5\\), \\(x-4y-2z=1\\), \\(x-y+\\lambda z=-3\\)). For what value of \\(\\lambda\\) is this system of equations inconsistent?`, answer: `\\(z=\\frac{6}{2-\\lambda}\\); inconsistent when \\(\\lambda=2\\).`, solutionUrl: "https://www.maths.scot/advanced-higher/systems-of-equations#5" },
            { question: `Is the following system of equations ill-conditioned? Explain your answer (\\(10x+9y=5\\), \\(9x+8y=4\\)).`, answer: `No, it is well-conditioned.`, solutionUrl: "https://www.maths.scot/advanced-higher/systems-of-equations#6" },
            { question: `Is the following system of equations ill-conditioned? Explain your answer (\\(300x-y=-1\\), \\(299x-y=-2\\)).`, answer: `Yes, it is ill-conditioned.`, solutionUrl: "https://www.maths.scot/advanced-higher/systems-of-equations#7" },
            { ref: "2016 Q4", solutionUrl: "https://www.maths.scot/advanced-higher/systems-of-equations#8" },
            { ref: "2023 P1 Q3", solutionUrl: "https://www.maths.scot/advanced-higher/systems-of-equations#9" },
            { ref: "2024 P2 Q3", solutionUrl: "https://www.maths.scot/advanced-higher/systems-of-equations#10" },
            { ref: "2026 P1 Q2", solutionUrl: "https://www.maths.scot/advanced-higher/systems-of-equations#11" },
          ],
        },
      ],
    },
    {
      id: "vectors",
      title: "Vectors",
      topics: [
        {
          name: "Vectors",
          questions: [
            { question: `Find the area of the parallelogram bounded by the vectors: \\(\\boldsymbol{a}=-\\boldsymbol{i}+3\\boldsymbol{j}+2\\boldsymbol{k}\\), \\(\\boldsymbol{b}=2\\boldsymbol{i}-2\\boldsymbol{j}+\\boldsymbol{k}\\).`, answer: `\\(3\\sqrt{10}\\text{ square units}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/vectors#1" },
            { question: `Find the volume of the parallelepiped bounded by the three vectors: \\(\\boldsymbol{a}=\\boldsymbol{i}+4\\boldsymbol{j}-2\\boldsymbol{k}\\), \\(\\boldsymbol{b}=3\\boldsymbol{i}+\\boldsymbol{k}\\), \\(\\boldsymbol{c}=-2\\boldsymbol{i}+\\boldsymbol{j}+5\\boldsymbol{k}\\).`, answer: `\\(75\\text{ cubic units}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/vectors#2" },
            { question: `Find the angle between the two planes: \\(x+2y-z=4\\), \\(2x-y-z=5\\).`, answer: `\\(\\approx 1.40\\text{ rad}\\) (or \\(80.4^\\circ\\))`, solutionUrl: "https://www.maths.scot/advanced-higher/vectors#3" },
            { question: `A straight line passes through the points \\(A(4,\\,-1,\\,2)\\) and \\(B(-2,\\,3,\\,7)\\). Obtain its symmetric equations.`, answer: `\\(\\frac{x-4}{-6} = \\frac{y+1}{4} = \\frac{z-2}{5}\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/vectors#4" },
            { question: `A plane contains the points \\(P(4,\\,1,\\,-5)\\), \\(Q(-1,\\,-2,\\,1)\\) and \\(R(3,\\,0,\\,-1)\\). Find its Cartesian equation.`, answer: `\\(3x-7y-z=10\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/vectors#5" },
            { question: `Determine the parametric equation of the line of intersection of the two planes: \\(\\pi_{1}\\!:\\,2x-y+z=4\\), \\(\\pi_{2}\\!:\\,4x+2y-z=0\\).`, answer: `\\(x=1-\\lambda,\\ y=-2+6\\lambda,\\ z=8\\lambda\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/vectors#6" },
            { question: `The symmetric equation of a line \\(l\\) is \\(\\frac{x-3}{4} = \\frac{y-2}{-1} = \\frac{z+1}{2}\\). Plane \\(\\pi\\) is defined by the equation \\(2x+y-z=4\\). Find the coordinates of the point of intersection of line \\(l\\) and plane \\(\\pi\\).`, answer: `\\((-1,\\,3,\\,-3)\\)`, solutionUrl: "https://www.maths.scot/advanced-higher/vectors#7" },
            { question: `Three vectors \\(\\overrightarrow{\\textsf{OA}}\\), \\(\\overrightarrow{\\textsf{OB}}\\) and \\(\\overrightarrow{\\textsf{OC}}\\) are given by \\(\\boldsymbol{u}\\), \\(\\boldsymbol{v}\\) and \\(\\boldsymbol{w}\\) where \\(\\boldsymbol{u}=5\\boldsymbol{i}+13\\boldsymbol{j}\\), \\(\\boldsymbol{v}=2\\boldsymbol{i}+\\boldsymbol{j}+3\\boldsymbol{k}\\), \\(\\boldsymbol{w}=\\boldsymbol{i}+4\\boldsymbol{j}-\\boldsymbol{k}\\). Calculate \\(\\boldsymbol{u}\\cdot(\\boldsymbol{v}\\times\\boldsymbol{w})\\). Interpret your result geometrically.`, answer: `\\(0\\); \\(\\boldsymbol{u}\\) lies in the same plane as the one containing both \\(\\boldsymbol{v}\\) and \\(\\boldsymbol{w}\\) (coplanar).`, paper: "2014 Q5" },
            { ref: "2016 Q14", solutionUrl: "https://www.maths.scot/advanced-higher/vectors#9" },
            { ref: "2018 Q16", solutionUrl: "https://www.maths.scot/advanced-higher/vectors#10" },
            { ref: "2019 Q15", solutionUrl: "https://www.maths.scot/advanced-higher/vectors#11" },
          ],
        },
      ],
    },
  ],
};
