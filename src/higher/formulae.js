export const higherMathsFormulaeList = {
    title: "Higher Maths Formulae List",
    sections: [
        {
            title: "1. Circle",
            content: `
                <p class="mb-3">The equation $x^{2}+y^{2}+2gx+2fy+c=0$ represents a circle centre $(-g,-f)$ and radius $\\sqrt{g^{2}+f^{2}-c}$.</p>
                <p class="mb-3">The equation $(x-a)^{2}+(y-b)^{2}=r^{2}$ represents a circle centre $(a,b)$ and radius $r$.</p>
            `
        },
        {
            title: "2. Scalar Product",
            content: `
                <p class="mb-3">$a \\cdot b = |a||b|\\cos \\theta$, where $\\theta$ is the angle between $a$ and $b$</p>
                <p class="mb-3">or</p>
                <p class="mb-3">$a \\cdot b = a_{1}b_{1} + a_{2}b_{2} + a_{3}b_{3}$ where $a = \\begin{pmatrix} a_{1} \\\\\\\\ a_{2} \\\\\\\\ a_{3} \\end{pmatrix}$ and $b = \\begin{pmatrix} b_{1} \\\\\\\\ b_{2} \\\\\\\\ b_{3} \\end{pmatrix}$</p>
            `
        },
        {
            title: "3. Trigonometric formulae",
            content: `
                <ul class="list-none pl-5 space-y-2">
                    <li>$\\sin(A \\pm B) = \\sin A \\cos B \\pm \\cos A \\sin B$</li>
                    <li>$\\cos(A \\pm B) = \\cos A \\cos B \\mp \\sin A \\sin B$</li>
                    <li>$\\sin 2A = 2 \\sin A \\cos A$</li>
                    <li>$\\cos 2A = \\cos^{2} A - \\sin^{2} A$</li>
                    <li class="pl-14">$= 2 \\cos^{2} A - 1$</li>
                    <li class="pl-14">$= 1 - 2 \\sin^{2} A$</li>
                </ul>
            `
        },
        {
            title: "4. Table of standard derivatives",
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
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2 text-center">$\\sin ax$</td><td class="border border-gray-500 p-2 text-center">$a \\cos ax$</td></tr>
                            <tr class="bg-gray-900"><td class="border border-gray-500 p-2 text-center">$\\cos ax$</td><td class="border border-gray-500 p-2 text-center">$-a \\sin ax$</td></tr>
                        </tbody>
                    </table>
                </div>
            `
        },
        {
            title: "5. Table of standard integrals",
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
                            <tr class="bg-gray-800"><td class="border border-gray-500 p-2 text-center">$\\sin ax$</td><td class="border border-gray-500 p-2 text-center">$-\\frac{1}{a} \\cos ax + C$</td></tr>
                            <tr class="bg-gray-900"><td class="border border-gray-500 p-2 text-center">$\\cos ax$</td><td class="border border-gray-500 p-2 text-center">$\\frac{1}{a} \\sin ax + C$</td></tr>
                        </tbody>
                    </table>
                </div>
            `
        }
    ]
};