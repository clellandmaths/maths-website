export const advancedHigherMathsFormulaeList = {
    title: "Advanced Higher Maths Formulae List",
    sections: [
        {
            title: "1. Standard derivatives",
            content: `
                <div class="overflow-x-auto mb-6">
                    <table class="w-full text-sm border-collapse max-w-lg">
                        <thead>
                            <tr class="bg-gray-700 text-white">
                                <th class="border border-gray-500 p-2 text-center">$f(x)$</th>
                                <th class="border border-gray-500 p-2 text-center">$f'(x)$</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2 text-center">$\\sin^{-1} x$</td><td class="border border-gray-500 p-2 text-center">$\\frac{1}{\\sqrt{1-x^2}}$</td></tr>
                            <tr class="bg-gray-900"><td class="border border-gray-500 p-2 text-center">$\\cos^{-1} x$</td><td class="border border-gray-500 p-2 text-center">$-\\frac{1}{\\sqrt{1-x^2}}$</td></tr>
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2 text-center">$\\tan^{-1} x$</td><td class="border border-gray-500 p-2 text-center">$\\frac{1}{1+x^2}$</td></tr>
                            <tr class="bg-gray-900"><td class="border border-gray-500 p-2 text-center">$\\tan x$</td><td class="border border-gray-500 p-2 text-center">$\\sec^2 x$</td></tr>
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2 text-center">$\\cot x$</td><td class="border border-gray-500 p-2 text-center">$-\\text{cosec}^2 x$</td></tr>
                            <tr class="bg-gray-900"><td class="border border-gray-500 p-2 text-center">$\\sec x$</td><td class="border border-gray-500 p-2 text-center">$\\sec x \\tan x$</td></tr>
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2 text-center">$\\text{cosec } x$</td><td class="border border-gray-500 p-2 text-center">$-\\text{cosec } x \\cot x$</td></tr>
                            <tr class="bg-gray-900"><td class="border border-gray-500 p-2 text-center">$\\ln x$</td><td class="border border-gray-500 p-2 text-center">$\\frac{1}{x}$</td></tr>
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2 text-center">$e^x$</td><td class="border border-gray-500 p-2 text-center">$e^x$</td></tr>
                        </tbody>
                    </table>
                </div>
            `
        },
        {
            title: "2. Standard integrals",
            content: `
                <div class="overflow-x-auto mb-6">
                    <table class="w-full text-sm border-collapse max-w-lg">
                        <thead>
                            <tr class="bg-gray-700 text-white">
                                <th class="border border-gray-500 p-2 text-center">$f(x)$</th>
                                <th class="border border-gray-500 p-2 text-center">$\\int f(x) dx$</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2 text-center">$\\sec^2(ax)$</td><td class="border border-gray-500 p-2 text-center">$\\frac{1}{a}\\tan(ax) + c$</td></tr>
                            <tr class="bg-gray-900"><td class="border border-gray-500 p-2 text-center">$\\frac{1}{\\sqrt{a^2-x^2}}$</td><td class="border border-gray-500 p-2 text-center">$\\sin^{-1}\\left(\\frac{x}{a}\\right) + c$</td></tr>
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2 text-center">$\\frac{1}{a^2+x^2}$</td><td class="border border-gray-500 p-2 text-center">$\\frac{1}{a}\\tan^{-1}\\left(\\frac{x}{a}\\right) + c$</td></tr>
                            <tr class="bg-gray-900"><td class="border border-gray-500 p-2 text-center">$\\frac{1}{x}$</td><td class="border border-gray-500 p-2 text-center">$\\ln|x|+c$</td></tr>
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2 text-center">$e^{ax}$</td><td class="border border-gray-500 p-2 text-center">$\\frac{1}{a}e^{ax} + c$</td></tr>
                        </tbody>
                    </table>
                </div>
            `
        },
        {
            title: "3. Summations",
            content: `
                <p class="mb-3 font-bold">(Arithmetic series)</p>
                <p class="mb-4">$S_n = \\frac{1}{2}n[2a + (n-1)d]$</p>
                
                <p class="mb-3 font-bold">(Geometric series)</p>
                <p class="mb-4">$S_n = \\frac{a(1-r^n)}{1-r}$</p>

                <p class="mb-3">$\\sum_{r=1}^n r = \\frac{n(n+1)}{2}$</p>
                <p class="mb-3">$\\sum_{r=1}^n r^2 = \\frac{n(n+1)(2n+1)}{6}$</p>
                <p class="mb-3">$\\sum_{r=1}^n r^3 = \\frac{n^2(n+1)^2}{4}$</p>
            `
        },
        {
            title: "4. Binomial theorem",
            content: `
                <p class="mb-3">$(a+b)^n = \\sum_{r=0}^n \\binom{n}{r} a^{n-r}b^r$</p>
                <p class="mb-3">where $\\binom{n}{r} = {}^nC_r = \\frac{n!}{r!(n-r)!}$</p>
            `
        },
        {
            title: "5. Maclaurin expansion",
            content: `
                <p class="mb-3">$f(x) = f(0) + f'(0)x + \\frac{f''(0)x^2}{2!} + \\frac{f'''(0)x^3}{3!} + \\frac{f^{iv}(0)x^4}{4!} + \\dots$</p>
            `
        },
        {
            title: "6. De Moivre's theorem",
            content: `
                <p class="mb-3">$[r(\\cos\\theta + i\\sin\\theta)]^n = r^n(\\cos n\\theta + i\\sin n\\theta)$</p>
            `
        },
        {
            title: "7. Vector product",
            content: `
                <p class="mb-3">$\\mathbf{a} \\times \\mathbf{b} = |\\mathbf{a}||\\mathbf{b}|\\sin\\theta \\,\\mathbf{\\hat{n}}$</p>
                <p class="mb-3">$= \\left| \\begin{matrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\\\\\ a_1 & a_2 & a_3 \\\\\\\\ b_1 & b_2 & b_3 \\end{matrix} \\right| = \\mathbf{i}\\left| \\begin{matrix} a_2 & a_3 \\\\\\\\ b_2 & b_3 \\end{matrix} \\right| - \\mathbf{j}\\left| \\begin{matrix} a_1 & a_3 \\\\\\\\ b_1 & b_3 \\end{matrix} \\right| + \\mathbf{k}\\left| \\begin{matrix} a_1 & a_2 \\\\\\\\ b_1 & b_2 \\end{matrix} \\right|$</p>
            `
        },
        {
            title: "8. Matrix transformation",
            content: `
                <p class="mb-3">Anti-clockwise rotation through an angle, $\\theta$, about the origin,</p>
                <p class="mb-3">$\\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\\\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix}$</p>
            `
        }
    ]
}