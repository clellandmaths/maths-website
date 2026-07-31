export const advHigherMaths2026P1 = {
  year: 2026,
  papers: [
    {
      paperNumber: 1,
      questions: [
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P1 Q1</span></strong></small><p>Differentiate:</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>\\(y=3x^{4}\\sec 2x\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>\\(f(x)=\\frac{e^{5x}}{2x+1}\\), simplifying your answer.</p>`,
          answer: `(a) \\(\\frac{dy}{dx}=12x^{3}\\sec 2x+6x^{4}\\sec 2x\\tan 2x=6x^{3}\\sec 2x\\left(2+x\\tan 2x\\right)\\)<br>(b) \\(f'(x)=\\frac{(2x+1)5e^{5x}-2e^{5x}}{(2x+1)^{2}}=\\frac{e^{5x}(10x+3)}{(2x+1)^{2}}\\)`,
          videoId: "VoRxJtMeAY4",
          timestamp: "48s",
          topics: ["Differentiation"],
          subtopics: ["Product, quotient, chain rules"],
          marks: [2, 3]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P1 Q2</span></strong></small><p>A system of equations is given by</p><p>\\(x+y-z=9\\)<br>\\(2x-y+3z=-2\\)<br>\\(3x+2y-2z=21\\)</p><p>Use Gaussian elimination to solve this system of equations.</p>`,
          answer: `Reducing the augmented matrix to upper triangular form gives \\(2z=-2\\), so by back substitution<br>\\(x=3,\\ y=5,\\ z=-1\\)`,
          videoId: "VoRxJtMeAY4",
          timestamp: "248s",
          topics: ["Systems of Equations"],
          subtopics: [],
          marks: [4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P1 Q3</span></strong></small><p>A complex number is defined by \\(z=\\sqrt{3}+i.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Express \\(z\\) in polar form.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Use de Moivre's theorem to show that \\(z^{3}\\) is purely imaginary.</p>`,
          answer: `(a) \\(|z|=\\sqrt{3+1}=2\\) and \\(\\arg z=\\frac{\\pi}{6}\\), so \\(z=2\\left(\\cos\\frac{\\pi}{6}+i\\sin\\frac{\\pi}{6}\\right)\\)<br>(b) \\(z^{3}=2^{3}\\left(\\cos\\frac{\\pi}{2}+i\\sin\\frac{\\pi}{2}\\right)=8i.\\) The real part is zero, so \\(z^{3}\\) is purely imaginary.`,
          videoId: "VoRxJtMeAY4",
          timestamp: "441s",
          topics: ["Complex Numbers"],
          subtopics: ["Argand diagram", "de Moivre's theorem"],
          marks: [2, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P1 Q4</span></strong></small><p>Find the particular solution of the differential equation</p><p>\\(2\\frac{d^{2}y}{dx^{2}}-3\\frac{dy}{dx}+y=0\\)</p><p>given that \\(y=2\\) and \\(\\frac{dy}{dx}=-1\\) when \\(x=0.\\)</p>`,
          answer: `Auxiliary equation \\(2m^{2}-3m+1=0\\Rightarrow(2m-1)(m-1)=0\\), so \\(m=\\frac{1}{2}\\) and \\(m=1.\\)<br>General solution \\(y=Ae^{\\frac{1}{2}x}+Be^{x}\\), giving \\(A+B=2\\) and \\(\\frac{1}{2}A+B=-1.\\)<br>\\(A=6,\\ B=-4\\), so \\(y=6e^{\\frac{1}{2}x}-4e^{x}\\)`,
          videoId: "VoRxJtMeAY4",
          timestamp: "636s",
          topics: ["Differential Equations"],
          subtopics: ["Second order homogeneous"],
          marks: [5]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P1 Q5</span></strong></small><p>Matrix \\(A\\) is defined by \\(A=\\begin{pmatrix}3&5\\\\-2&x\\end{pmatrix}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>State an expression for the determinant of \\(A\\) in terms of \\(x.\\)</p><p>Matrix \\(A\\) is multiplied by matrix \\(B\\) such that \\(\\det AB=12x+40.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>State the determinant of \\(B.\\)</p><p>The inverse of matrix \\(B\\) is \\(B^{-1}=\\begin{pmatrix}1&-1\\\\-\\frac{5}{4}&\\frac{3}{2}\\end{pmatrix}.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(c)</span>Find matrix \\(B.\\)</p>`,
          answer: `(a) \\(\\det A=3x+10\\)<br>(b) \\(\\det AB=\\det A\\det B\\), so \\((3x+10)\\det B=4(3x+10)\\) and \\(\\det B=4\\)<br>(c) \\(\\det B^{-1}=\\frac{3}{2}-\\frac{5}{4}=\\frac{1}{4}\\), so \\(B=4\\begin{pmatrix}\\frac{3}{2}&1\\\\\\frac{5}{4}&1\\end{pmatrix}=\\begin{pmatrix}6&4\\\\5&4\\end{pmatrix}\\)`,
          videoId: "VoRxJtMeAY4",
          timestamp: "786s",
          topics: ["Matrices"],
          subtopics: ["Determinant and inverse", "Matrix operations"],
          marks: [1, 1, 2]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P1 Q6</span></strong></small><p><span class="text-cyan-400 font-bold mr-1">(a)</span>Use the substitution \\(u=x-1\\) to find \\(\\int x(x-1)^{4}\\,dx.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Hence find the exact volume of the solid formed by rotating the curve with equation \\(y=2\\sqrt{x}(x-1)^{2}\\) about the \\(x\\) axis through \\(2\\pi\\) radians, from \\(x=0\\) to \\(x=1.\\)</p>`,
          answer: `(a) With \\(u=x-1\\), \\(\\int(u+1)u^{4}\\,du=\\frac{u^{6}}{6}+\\frac{u^{5}}{5}+C=\\frac{(x-1)^{6}}{6}+\\frac{(x-1)^{5}}{5}+C\\)<br>(b) \\(V=\\pi\\int_{0}^{1}4x(x-1)^{4}\\,dx=4\\pi\\left[\\frac{(x-1)^{6}}{6}+\\frac{(x-1)^{5}}{5}\\right]_{0}^{1}=4\\pi\\left(0-\\left(\\frac{1}{6}-\\frac{1}{5}\\right)\\right)=\\frac{2\\pi}{15}\\) cubic units`,
          videoId: "VoRxJtMeAY4",
          timestamp: "959s",
          topics: ["Integration"],
          subtopics: ["Integration by substitution", "Volume of revolution"],
          marks: [3, 4]
        },
        {
          question: `<small><strong><span style="white-space: nowrap;">2026 P1 Q7</span></strong></small><p>The complex number \\(z=2+i\\) is a root of the polynomial equation</p><p>\\(z^{4}-2z^{3}-z^{2}+2z+10=0.\\)</p><p><span class="text-cyan-400 font-bold mr-1">(a)</span>State a second root of the equation.</p><p><span class="text-cyan-400 font-bold mr-1">(b)</span>Find the remaining roots.</p>`,
          answer: `(a) The coefficients are real, so roots occur in conjugate pairs: \\(z=2-i\\)<br>(b) \\((z-(2+i))(z-(2-i))=z^{2}-4z+5\\), and \\(z^{4}-2z^{3}-z^{2}+2z+10=(z^{2}-4z+5)(z^{2}+2z+2).\\)<br>Solving \\(z^{2}+2z+2=0\\) gives \\(z=\\frac{-2\\pm\\sqrt{-4}}{2}=-1\\pm i\\), so the remaining roots are \\(-1+i\\) and \\(-1-i\\)`,
          videoId: "VoRxJtMeAY4",
          timestamp: "1253s",
          topics: ["Complex Numbers"],
          subtopics: ["Equations with complex roots"],
          marks: [1, 5]
        }
      ]
    }
  ]
};
