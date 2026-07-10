export const n5ApplicationsMathsFormulaeList = {
    title: "National 5 Applications of Mathematics Formulae List",
    sections: [
        {
            title: "1. Circle",
            content: `
                <p class="mb-3">Circumference of a circle: $C = \\pi d$</p>
                <p class="mb-3">Area of a circle: $A = \\pi r^2$</p>
            `
        },
        {
            title: "2. Theorem of Pythagoras",
            content: `
                <div class="flex flex-col items-center mb-4">
                    <svg width="250" height="120" viewBox="0 0 250 120" xmlns="http://www.w3.org/2000/svg">
                        <!-- Triangle -->
                        <path d="M 40 100 L 180 100 L 180 20 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
                        <!-- Right Angle Mark -->
                        <path d="M 165 100 L 165 85 L 180 85" fill="none" stroke="currentColor" stroke-width="1"/>
                        <!-- Labels -->
                        <text x="110" y="115" font-family="serif" font-style="italic" font-size="16" text-anchor="middle" fill="currentColor">a</text>
                        <text x="190" y="65" font-family="serif" font-style="italic" font-size="16" text-anchor="middle" fill="currentColor">b</text>
                        <text x="100" y="50" font-family="serif" font-style="italic" font-size="16" text-anchor="middle" fill="currentColor">c</text>
                    </svg>
                </div>
                <p class="mb-3 text-center">$a^2 + b^2 = c^2$</p>
            `
        },
        {
            title: "3. Volume",
            content: `
                <p class="mb-3">Volume of a cylinder: $V = \\pi r^2 h$</p>
                <p class="mb-3">Volume of a prism: $V = Ah$</p>
                <p class="mb-3">Volume of a cone: $V = \\frac{1}{3}\\pi r^2 h$</p>
                <p class="mb-3">Volume of a sphere: $V = \\frac{4}{3}\\pi r^3$</p>
            `
        },
        {
            title: "4. Standard deviation",
            content: `
                <p class="mb-3">$s = \\sqrt{\\frac{\\sum(x-\\bar{x})^2}{n-1}} = \\sqrt{\\frac{\\sum x^2 - (\\sum x)^2/n}{n-1}}$, where $n$ is the sample size.</p>
            `
        },
        {
            title: "5. Gradient",
            content: `
                <div class="flex flex-col items-center mb-4">
                    <svg width="300" height="120" viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg">
                        <!-- Triangle -->
                        <path d="M 20 100 L 220 100 L 220 20 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
                        <!-- Right Angle Mark -->
                        <path d="M 205 100 L 205 85 L 220 85" fill="none" stroke="currentColor" stroke-width="1"/>
                        <!-- Labels -->
                        <text x="120" y="115" font-family="sans-serif" font-size="14" text-anchor="middle" fill="currentColor">horizontal distance</text>
                        <text x="230" y="55" font-family="sans-serif" font-size="14" text-anchor="start" fill="currentColor">vertical</text>
                        <text x="230" y="70" font-family="sans-serif" font-size="14" text-anchor="start" fill="currentColor">height</text>
                    </svg>
                </div>
                <p class="mb-3 text-center">$\\text{gradient} = \\frac{\\text{vertical height}}{\\text{horizontal distance}}$</p>
            `
        }
    ]
};