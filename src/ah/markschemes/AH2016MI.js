export const advHigherMaths2016Markscheme = {
  year: 2016,
  papers: [
    {
      paperNumber: 1,
      questions: [
        {
          questionNumber: "1(a)",
          answer: `<p><strong>•¹ evidence of use of product rule</strong><br>\\( (...)tan^{-1}2x+x(...) \\)</p><p><strong>•² one resultant term of the product correct</strong><br>\\( 1.tan^{-1}2x \\) or \\( x.\\frac{1}{1+(2x)^2}.2 \\)</p><p><strong>•³ complete differentiation</strong><br>\\( tan^{-1}2x+\\frac{2x}{1+4x^2} \\)</p>`
        },
        {
          questionNumber: "1(b)",
          answer: `<p><strong>•⁴ evidence of use of quotient or product rule and one term of numerator correct</strong><br>\\( (-2x)(1+4x^2)- \\dots \\)</p><p><strong>•⁵ complete differentiation correctly</strong><br>\\( \\frac{...(1-x^2).8x}{(1+4x^2)^2} \\) or \\( \\frac{-10x}{(1+4x^2)^2} \\)</p><p><strong>•⁶ simplify answer</strong><br>\\( -\\frac{10x}{(1+4x^2)^2} \\)</p>`
        },
        {
          questionNumber: "1(c)",
          answer: `<p><strong>•⁷ correct derivatives</strong><br>\\( 76 \\) and \\( \\sin t \\)</p><p><strong>•⁸ find \\( \\frac{dy}{dx} \\)</strong><br>\\( \\frac{1}{6}\\sin t \\)</p>`
        },
        {
          questionNumber: "2(a)",
          answer: `<p><strong>•¹ interpret geometric series</strong><br>\\( ar=108 \\) and \\( ar^4=4 \\)</p><p><strong>•² evidence of strategy</strong><br>\\( \\frac{ar^4}{ar} \\) OR \\( r^3=\\frac{1}{27} \\)</p><p><strong>•³ value</strong><br>\\( r=\\frac{1}{3} \\)</p>`
        },
        {
          questionNumber: "2(b)",
          answer: `<p><strong>•⁴ know condition</strong><br>\\( -1<\\frac{1}{3}<1 \\)</p>`
        },
        {
          questionNumber: "2(c)",
          answer: `<p><strong>•⁵ calculate the first term</strong><br>\\( a=324 \\)</p><p><strong>•⁶ value</strong><br>\\( \\frac{324}{1-\\frac{1}{3}} \\) leading to \\( 486 \\)</p>`
        },
        {
          questionNumber: "3",
          answer: `<p><strong>•¹ state general term</strong><br>\\( ^{13}C_r(\\frac{3}{x})^{13-r}(-2x)^r \\)</p><p><strong>•² simplify powers of x OR coefficients</strong><br>\\( (3)^{13-r}(-2)^r \\) or \\( x^{2r-13} \\)</p><p><strong>•³ state simplified general term</strong><br>\\( ^{13}C_r(3)^{13-r}(-2)^rx^{2r-13} \\)</p><p><strong>•⁴ determine value of r</strong><br>\\( 2r-13=9 \\Rightarrow r=11 \\)</p><p><strong>•⁵ evaluate term</strong><br>\\( -1437696x^9 \\)</p>`
        },
        {
          questionNumber: "4",
          answer: `<p><strong>•¹ Construct augmented matrix</strong><br>\\( \\begin{pmatrix}1&2&3&13\\\\ 2&-1&4&15\\\\ 1&-3&2\\lambda&12\\end{pmatrix} \\)</p><p><strong>•² Use row operations to establish first two zero elements</strong><br>\\( \\begin{pmatrix}1&2&3&13\\\\ 0&5&2&1\\\\ 0&-5&2\\lambda-3&-1\\end{pmatrix} \\)</p><p><strong>•³ Establish third zero element OR recognise linear relationship between two rows</strong><br>\\( \\begin{pmatrix}1&2&3&13\\\\ 0&5&2&1\\\\ 0&0&2\\lambda-1&0\\end{pmatrix} \\) OR \\( 2\\lambda-3=-2 \\)</p><p><strong>•⁴ State value of \\( \\lambda \\)</strong><br>\\( \\lambda=\\frac{1}{2} \\)</p>`
        },
        {
          questionNumber: "5",
          answer: `<p><strong>•¹ show true for \\( n=1 \\)</strong><br>LHS: \\( 1(3-1)=2 \\) RHS: \\( 1^2(1+1)=2 .\\) So true for \\( n=1 \\)</p><p><strong>•² assume true for \\( n=k \\) AND consider \\( n=k+1 \\)</strong><br>\\( \\sum_{r=1}^{k}r(3r-1)=k^2(k+1) \\) and \\( \\sum_{r=1}^{k+1}r(3r-1)= \\dots \\)</p><p><strong>•³ correct statement of sum to \\( (k+1) \\) terms using inductive hypothesis</strong><br>\\( \\dots=\\sum_{r=1}^{k}r(3r-1)+(k+1)(3(k+1)-1) = k^2(k+1)+(k+1)(3k+2) \\)</p><p><strong>•⁴ express explicitly in terms of \\( (k+1) \\) or achieve stated aim/goal AND communicate</strong><br>\\( =(k+1)^2((k+1)+1) \\), thus if true for \\( n=k \\) then true for \\( n=k+1 \\) but since true for \\( n=1 \\), then by induction true for all \\( n \\in \\mathbb{N} \\)</p>`
        },
        {
          questionNumber: "6",
          answer: `<p><strong>•¹ for either function: first derivative and two evaluations OR all three derivatives OR all four evaluations</strong><br>\\( f(x)=\\sin 3x \\), \\( f(0)=0 \\) <br> \\( f'(x)=3\\cos 3x \\), \\( f'(0)=3 \\) <br> \\( f''(x)=-9\\sin 3x \\), \\( f''(0)=0 \\) <br> \\( f'''(x)=-27\\cos 3x \\), \\( f'''(0)=-27 \\)</p><p><strong>•² complete derivatives and evaluations AND substitute</strong><br>\\( f(x)=3x-\\frac{27}{3!}x^3 = 3x-\\frac{9}{2}x^3 \\)</p><p><strong>•³ for second function: first derivative and two evaluations OR all three derivatives OR all four evaluations</strong><br>\\( f(x)=e^{4x} \\), \\( f(0)=1 \\) <br> \\( f'(x)=4e^{4x} \\), \\( f'(0)=4 \\) <br> \\( f''(x)=16e^{4x} \\), \\( f''(0)=16 \\) <br> \\( f'''(x)=64e^{4x} \\), \\( f'''(0)=64 \\)</p><p><strong>•⁴ complete derivatives and evaluations AND substitute</strong><br>\\( f(x)=1+4x+\\frac{16x^2}{2}+\\frac{64x^3}{6} = 1+4x+8x^2+\\frac{32}{3}x^3 \\)</p><p><strong>•⁵ multiply expressions</strong><br>\\( e^{4x}\\sin 3x=(3x-\\frac{9}{2}x^3...)(1+4x+8x^2+\\frac{32}{3}x^3...) \\)</p><p><strong>•⁶ multiply out and simplify</strong><br>\\( =3x+12x^2+\\frac{39}{2}x^3... \\)</p>`
        },
        {
          questionNumber: "7(a)",
          answer: `<p><strong>•¹ calculate determinant</strong><br>\\( -2 \\)</p>`
        },
        {
          questionNumber: "7(b)",
          answer: `<p><strong>•² find \\( A^2 \\)</strong><br>\\( A^2=\\begin{pmatrix}4&0\\\\\\lambda&1\\end{pmatrix} \\)</p><p><strong>•³ use an appropriate method</strong><br>\\( \\begin{pmatrix}4&0\\\\\\lambda&1\\end{pmatrix}=\\begin{pmatrix}2&0\\\\\\lambda&-1\\end{pmatrix}+2\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix} \\)</p><p><strong>•⁴ write in required form and explicitly state values of p and q</strong><br>\\( A^2=A+2I \\Rightarrow p=1 \\) and \\( q=2 \\)</p>`
        },
        {
          questionNumber: "7(c)",
          answer: `<p><strong>•⁵ square expression found in (b)</strong><br>\\( A^4=(A+2I)^2 = A^2+4A+4I \\)</p><p><strong>•⁶ substitute for \\( A^2 \\) and complete process</strong><br>\\( =5A+6I \\)</p>`
        },
        {
          questionNumber: "8(a)",
          answer: `<p><strong>•¹ correctly plot z on Argand diagram</strong><br>Point in quadrant 4 with coordinates/labels for \\( \\sqrt{3} \\) and \\( -1 \\)</p>`
        },
        {
          questionNumber: "8(b)",
          answer: `<p><strong>•² find modulus or argument</strong><br>\\( w = 2a \\) or \\( \\arg(w)=-\\frac{\\pi}{6} \\)</p><p><strong>•³ complete and express in polar form</strong><br>\\( w=2a(\\cos(-\\frac{\\pi}{6})+i\\sin(-\\frac{\\pi}{6})) \\)</p>`
        },
        {
          questionNumber: "8(c)",
          answer: `<p><strong>•⁴ process modulus</strong><br>\\( 256a^8 \\)</p><p><strong>•⁵ process argument</strong><br>\\( \\dots(\\cos(-\\frac{8\\pi}{6})+i\\sin(-\\frac{8\\pi}{6})) \\)</p><p><strong>•⁶ evaluate and express in form \\( ka^n(x+i\\sqrt{y}) \\)</strong><br>\\( w^8=128a^8(-1+i\\sqrt{3}) \\)</p>`
        },
        {
          questionNumber: "9",
          answer: `<p><strong>•¹ know to use integration by parts and start process</strong><br>\\( \\frac{1}{8}x^8(\\ln x)^2 - \\dots \\)</p><p><strong>•² correct choice of functions to differentiate and integrate AND application thereof</strong><br>\\( \\dots - \\frac{1}{8}\\int x^8 \\times \\frac{d}{dx}((\\ln x)^2)dx \\)</p><p><strong>•³ differentiate \\( (\\ln x)^2 \\)</strong><br>\\( \\frac{1}{8}x^8(\\ln x)^2 - \\frac{1}{4}\\int x^7(\\ln x)dx \\)</p><p><strong>•⁴ know to use second application and begin process</strong><br>\\( \\dots - [\\frac{1}{32}x^8(\\ln x) - \\frac{1}{32}\\int x^8(\\frac{1}{x})dx] \\)</p><p><strong>•⁵ complete second application</strong><br>\\( \\dots - [\\frac{1}{32}x^8(\\ln x) - \\frac{1}{256}x^8] \\)</p><p><strong>•⁶ simplify</strong><br>\\( \\frac{1}{8}x^8(\\ln x)^2 - \\frac{1}{32}x^8(\\ln x) + \\frac{1}{256}x^8 + c \\)</p>`
        },
        {
          questionNumber: "10",
          answer: `<p><strong>•¹ give counterexample</strong><br>eg. choose \\( p=7 \\), \\( 2(7)+1=15 \\) and since \\( 15=5\\times3 \\), hence not prime, statement is false</p><p><strong>•² set up n</strong><br>\\( n=3a+1 \\), \\( a\\in\\mathbb{N}_0 \\)</p><p><strong>•³ consider expansion of \\( n^3 \\)</strong><br>\\( n^3=27a^3+27a^2+9a+1 \\)</p><p><strong>•⁴ complete proof with conclusion</strong><br>\\( =3(9a^3+9a^2+3a)+1 \\) and statement such as "so \\( n^3 \\) has remainder 1 when divided by 3... statement is true"</p>`
        },
        {
          questionNumber: "11",
          answer: `<p><strong>•¹ state differential equation</strong><br>\\( \\frac{dh}{dt}=5 \\)</p><p><strong>•² state relationship or apply chain rule</strong><br>\\( \\frac{dV}{dt}=\\frac{dV}{dh}\\cdot\\frac{dh}{dt} \\) OR \\( V=h^3 \\)</p><p><strong>•³ find the rate of change of volume with respect to height</strong><br>\\( \\frac{dV}{dh}=3h^2 \\)</p><p><strong>•⁴ evaluate</strong><br>\\( \\frac{dV}{dt}=3h^2\\times 5=3(3)^2\\times 5=135 \\text{ cm}^3\\text{s}^{-1} \\)</p>`
        },
        {
          questionNumber: "12(a)",
          answer: `<p><strong>•¹ correct shape</strong><br>V shape reflecting in x-axis</p><p><strong>•² graph passes through 2c on the positive y-axis</strong><br>Passes through (0, 2c) and meets x axis at c</p>`
        },
        {
          questionNumber: "12(b)",
          answer: `<p><strong>•³ graph of \\( y=|2f(x)| \\) passing through 2c on the positive y-axis</strong><br>Passes through \\( 2c \\) on y-axis</p><p><strong>•⁴ correct shape (symmetrical V) meeting positive x-axis at c</strong><br>V shape meeting x-axis at \\( c \\)</p>`
        },
        {
          questionNumber: "13",
          answer: `<p><strong>•¹ correct application of partial fractions</strong><br>\\( \\frac{3x+32}{(x+4)(6-x)}=\\frac{A}{x+4}+\\frac{B}{6-x} \\)</p><p><strong>•² starts process</strong><br>\\( 3x+32=A(6-x)+B(x+4) \\)</p><p><strong>•³ calculate one value</strong><br>\\( A=2 \\)</p><p><strong>•⁴ calculate second value</strong><br>\\( B=5 \\)</p><p><strong>•⁵ re-state integral in partial fractions</strong><br>\\( \\int_{3}^{4}(\\frac{2}{(x+4)}+\\frac{5}{(6-x)})dx \\)</p><p><strong>•⁶ one term correctly integrated</strong><br>\\( [2\\ln|x+4|\\dots \\)</p><p><strong>•⁷ Integrate second term correctly</strong><br>\\( \\dots-5\\ln|6-x|]_3^4 \\)</p><p><strong>•⁸ substitute limits</strong><br>\\( (2\\ln|4+4|-5\\ln|6-4|) - (2\\ln|3+4|-5\\ln|6-3|) \\)</p><p><strong>•⁹ evaluate to expected form</strong><br>\\( =\\ln\\frac{486}{49} \\)</p>`
        },
        {
          questionNumber: "14(a)",
          answer: `<p><strong>•¹ convert any two components of \\( L_2 \\) to parametric form</strong><br>two from \\( x=3-2\\mu, y=8+\\mu, z=-1+3\\mu \\)</p><p><strong>•² two linear equations involving two distinct parameters</strong><br>two from \\( 4+3\\lambda=3-2\\mu, 2+4\\lambda=8+\\mu, -7\\lambda=-1+3\\mu \\)</p><p><strong>•³ find parameter values</strong><br>\\( \\lambda=1, \\mu=-2 \\)</p><p><strong>•⁴ verify third component in both equations or equivalent</strong><br>eg \\( z_1=-7\\times1 \\) and \\( z_2=3(-2)-1 \\) therefore the lines intersect</p><p><strong>•⁵ find point of intersection</strong><br>\\( (7,6,-7) \\)</p>`
        },
        {
          questionNumber: "14(b)",
          answer: `<p><strong>•⁶ identify first direction vector</strong><br>\\( d_1=3i+4j-7k \\)</p><p><strong>•⁷ identify second direction vector</strong><br>\\( d_2=-2i+j+3k \\)</p><p><strong>•⁸ calculate magnitudes and scalar product</strong><br>\\( |d_1|=\\sqrt{74}, |d_2|=\\sqrt{14} \\) and \\( d_1 \\cdot d_2=-6+4-21=-23 \\)</p><p><strong>•⁹ calculate obtuse angle</strong><br>\\( \\cos^{-1}(\\frac{-23}{\\sqrt{74}\\sqrt{14}})\\approx 135.6^\\circ \\)</p>`
        },
        {
          questionNumber: "15",
          answer: `<p><strong>•¹ state auxiliary equation</strong><br>\\( m^2+5m+6=0 \\Rightarrow m=-3, m=-2 \\)</p><p><strong>•² solve auxiliary equation and state complementary function</strong><br>\\( y=Ae^{-3x}+Be^{-2x} \\)</p><p><strong>•³ construct particular integral</strong><br>\\( y=Cx^2+Dx+E \\)</p><p><strong>•⁴ differentiate particular integral</strong><br>\\( \\frac{dy}{dx}=2Cx+D \\) and \\( \\frac{d^2y}{dx^2}=2C \\)</p><p><strong>•⁵ calculate one coefficient of the particular integral</strong><br>\\( C=2 \\)</p><p><strong>•⁶ calculate remaining coefficients</strong><br>\\( D=-3, E=1 \\Rightarrow y=Ae^{-3x}+Be^{-2x}+2x^2-3x+1 \\)</p><p><strong>•⁷ differentiate general solution</strong><br>\\( \\frac{dy}{dx}=-3Ae^{-3x}-2Be^{-2x}+4x-3 \\)</p><p><strong>•⁸ construct equations using given conditions</strong><br>\\( A+B=-7 \\) and \\( 3A+2B=-6 \\) or equivalent</p><p><strong>•⁹ Find one coefficient</strong><br>\\( A=8 \\) or \\( B=-15 \\)</p><p><strong>•¹⁰ Find other coefficient and state particular solution</strong><br>\\( y=8e^{-3x}-15e^{-2x}+2x^2-3x+1 \\)</p>`
        },
        {
          questionNumber: "16",
          answer: `<p><strong>•¹ construct integral equation</strong><br>\\( \\int\\frac{1}{T-T_F}dT=\\int-k dt \\)</p><p><strong>•² integrate</strong><br>\\( \\ln(T-T_F)=-kt+c \\)</p><p><strong>•³ find constant, c</strong><br>\\( \\ln(9.8-4)=-k(0)+c \\Rightarrow c=\\ln 5.8 \\)</p><p><strong>•⁴ substitute using given information</strong><br>\\( \\ln(6.5-4)=-15k+\\ln 5.8 \\)</p><p><strong>•⁵ find constant, k</strong><br>\\( k=\\frac{\\ln 2.5-\\ln 5.8}{-15}=0.05610\\dots \\)</p><p><strong>•⁶ substitute given condition</strong><br>\\( \\ln(25-4)=-0.05610\\dots t+\\ln 5.8 \\)</p><p><strong>•⁷ know how to find time</strong><br>\\( t=\\frac{\\ln 21-\\ln 5.8}{-0.05610\\dots} \\)</p><p><strong>•⁸ calculate time</strong><br>\\( t=-22.93\\dots \\)</p><p><strong>•⁹ state the time to the nearest minute</strong><br>The liquid was placed in the fridge at 11:37 (am)</p>`
        }
      ]
    }
  ]
};