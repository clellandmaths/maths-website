import { GeneratedQuestion, Topic, TOPIC_GROUPS } from "./types";
import { getRandomInt, nonZeroInt, Point, formatNum, gcd, simplifyFraction, formatFraction, formatFractionWithSub, formatTerm, formatEquation, generateTriangle } from "./utils";

export function generateFunctionsQuestion(selectedTopic: string): Omit<GeneratedQuestion, "topic"> {
  let type = -1;
  if (selectedTopic === "Domain and range") type = 0;
  else if (selectedTopic === "Composite functions") type = 1;
  else if (selectedTopic === "Inverse functions") type = 2;
  else if (selectedTopic === "Graphs of related functions") type = 3;

  if (type === -1) {
    type = Math.floor(Math.random() * 4);
  }

  const actualTopic = type === 0 ? "Domain and range" 
                    : type === 1 ? "Composite functions" 
                    : type === 2 ? "Inverse functions" 
                    : "Graphs of related functions";

  if (type === 0) {
    if (Math.random() < 0.5) {
      const r1 = getRandomInt(-5, 5);
      let r2 = getRandomInt(-5, 5);
      while (r1 === r2) r2 = getRandomInt(-5, 5);
      
      const b = -(r1 + r2);
      const c = r1 * r2;
      const bStr = b === 0 ? "" : b > 0 ? `+ ${b}x` : b === -1 ? `- x` : b === 1 ? `+ x` : `- ${-b}x`;
      const cStr = c === 0 ? "" : c > 0 ? `+ ${c}` : `- ${-c}`;
      
      let denomExp = `x^2 ${bStr} ${cStr}`.replace(/\s+/g, ' ').replace(/>/g,'>');
      const num = getRandomInt(1, 4) * (Math.random() < 0.5 ? 1 : -1);
      const numStr = num === 1 ? "x" : num === -1 ? "-x" : `${num}x`;
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `What values of $x$ cannot be in the domain of $f$ if:`,
          `$f(x)=\\frac{${numStr}}{${denomExp}}$`
        ],
        boardQuestionLines: [
          `What values of $x$ cannot be in the domain?`,
          `$f(x)=\\frac{${numStr}}{${denomExp}}$`
        ],
        solutionSteps: [
          `<strong>1.</strong> The denominator of a fraction cannot equal zero. This occurs when:`,
          `$${denomExp}=0$`,
          `<strong>2.</strong> Factorise the quadratic:`,
          `$(x${-r1 === 0 ? '' : -r1 > 0 ? '+' : ''}${-r1 === 0 ? '' : -r1})(x${-r2 === 0 ? '' : -r2 > 0 ? '+' : ''}${-r2 === 0 ? '' : -r2})=0$`,
          `<strong>3.</strong> Solve for $x$:`,
          `$x=${r1}$ or $x=${r2}$`
        ],
        finalAnswer: `$x=${r1}, x=${r2}$`
      };
    } else {
      const a = getRandomInt(1, 5);
      const b = getRandomInt(-10, 10);
      const bStr = b === 0 ? "" : b > 0 ? `+${b}` : `${b}`;
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `State the largest possible domain of $g$, given:`,
          `$g(x)=\\sqrt{${a === 1 ? "" : a}x${bStr}}$.`
        ],
        boardQuestionLines: [
          `State the largest possible domain:`,
          `$g(x)=\\sqrt{${a === 1 ? "" : a}x${bStr}}$`
        ],
        solutionSteps: [
          `<strong>1.</strong> The expression under a square root must be $\\ge 0$:`,
          `$${a === 1 ? "" : a}x${bStr} \\ge 0$`,
          `<strong>2.</strong> Solve the inequality:`,
          `$${a === 1 ? "" : a}x \\ge ${-b}$`,
          ...(a !== 1 ? [`$x \\ge ${formatFraction(-b, a)}$`] : []),
        ],
        finalAnswer: `$x \\ge ${a === 1 ? -b : formatFraction(-b, a)}$`
      };
    }
  } else if (type === 1) {
    const subType = Math.floor(Math.random() * 3);
    if (subType === 0 || subType === 1) {
      const a = getRandomInt(1, 5) * (Math.random() < 0.5 ? 1 : -1);
      const b = getRandomInt(1, 10) * (Math.random() < 0.5 ? 1 : -1);
      const c = getRandomInt(1, 4) * (Math.random() < 0.5 ? 1 : -1);
      const d = getRandomInt(1, 10) * (Math.random() < 0.5 ? 1 : -1);
      
      const aStr = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
      const cStr = c === 1 ? "x^2" : c === -1 ? "-x^2" : `${c}x^2`;

      const fStr = `${aStr} ${b > 0 ? '+' : '-'} ${Math.abs(b)}`;
      const gStr = `${cStr} ${d > 0 ? '+' : '-'} ${Math.abs(d)}`;
      
      if (subType === 0) {
        const a_x_c = a * c;
        const a_x_d_plus_b = a * d + b;
        const acStr = a_x_c === 1 ? "x^2" : a_x_c === -1 ? "-x^2" : `${a_x_c}x^2`;

        return {
          subTopic: actualTopic,
          questionLines: [
            `A function $f$ is defined on the set of real numbers by $f(x)=${fStr}$.`,
            `A second function $g$ is defined on the set of real numbers by $g(x)=${gStr}$.`,
            `Find an expression for $f(g(x))$, expanding and simplifying your answer.`
          ],
          boardQuestionLines: [
            `$f(x)=${fStr}$`,
            `$g(x)=${gStr}$`,
            `Find and simplify $f(g(x))$.`
          ],
          solutionSteps: [
            `<strong>1.</strong> Substitute $g(x)$ into $f(x)$.`,
            `$f(g(x)) = f(${gStr})$`,
            `<strong>2.</strong> Apply function $f$:`,
            `$= ${a}(${gStr}) ${b > 0 ? '+' : '-'} ${Math.abs(b)}$`,
            `$= ${acStr} ${a*d > 0 ? '+' : '-'} ${Math.abs(a*d)} ${b > 0 ? '+' : '-'} ${Math.abs(b)}$`,
            `$= ${acStr} ${a_x_d_plus_b >= 0 ? '+' : ''}${a_x_d_plus_b}$`
          ],
          finalAnswer: `$${acStr} ${a_x_d_plus_b >= 0 ? '+' : ''}${a_x_d_plus_b}$`
        };
      } else {
        const a2 = a*a;
        const ab2 = 2*a*b;
        const b2 = b*b;

        const a2Str = a2 === 1 ? "x^2" : `${a2}x^2`;
        
        return {
          subTopic: actualTopic,
          questionLines: [
            `A function $f$ is defined on the set of real numbers by $f(x)=${fStr}$.`,
            `A second function $g$ is defined on the set of real numbers by $g(x)=${gStr}$.`,
            `Find an expression for $g(f(x))$, expanding and simplifying your answer.`
          ],
          boardQuestionLines: [
            `$f(x)=${fStr}$`,
            `$g(x)=${gStr}$`,
            `Find and simplify $g(f(x))$.`
          ],
          solutionSteps: [
            `<strong>1.</strong> Substitute $f(x)$ into $g(x)$.`,
            `$g(f(x)) = g(${fStr})$`,
            `$= ${c}(${fStr})^2 ${d > 0 ? '+' : '-'} ${Math.abs(d)}$`,
            `<strong>2.</strong> Expand the bracket:`,
            `$(${fStr})^2 = ${a2Str} ${ab2 > 0 ? '+' : '-'} ${Math.abs(ab2)}x + ${b2}$`,
            `<strong>3.</strong> Substitute back and simplify:`,
            `$= ${c}(${a2Str} ${ab2 > 0 ? '+' : '-'} ${Math.abs(ab2)}x + ${b2}) ${d > 0 ? '+' : '-'} ${Math.abs(d)}$`,
            `$= ${c*a2 === 1 ? "x^2" : c*a2 === -1 ? "-x^2" : c*a2+"x^2"} ${c*ab2 >= 0 ? '+' : ''}${c*ab2}x ${c*b2+d >= 0 ? '+' : ''}${c*b2+d}$`
          ],
          finalAnswer: `$${c*a2 === 1 ? "x^2" : c*a2 === -1 ? "-x^2" : c*a2+"x^2"} ${c*ab2 >= 0 ? '+' : ''}${c*ab2}x ${c*b2+d >= 0 ? '+' : ''}${c*b2+d}$`
        };
      }
    } else {
      const a = getRandomInt(1, 5);
      return {
        subTopic: actualTopic,
        questionLines: [
          `A function $f$ is defined on a suitable domain by $f(x)=\\frac{x-${a}}{x+${a}}$.`,
          `Find an expression for $f(f(x))$ in its simplest form.`
        ],
        boardQuestionLines: [
          `$f(x)=\\frac{x-${a}}{x+${a}}$`,
          `Find and simplify $f(f(x))$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Substitute $f(x)$ into $f$.`,
          `$f(f(x)) = f\\left(\\frac{x-${a}}{x+${a}}\\right)$`,
          `<strong>2.</strong> Substitute this expression in place of $x$:`,
          `$\\frac{\\frac{x-${a}}{x+${a}} - ${a}}{\\frac{x-${a}}{x+${a}} + ${a}}$`,
          `<strong>3.</strong> Multiply numerator and denominator by $(x+${a})$:`,
          `$\\frac{(x-${a}) - ${a}(x+${a})}{(x-${a}) + ${a}(x+${a})}$`,
          `<strong>4.</strong> Expand and simplify:`,
          `$\\frac{x - ${a} - ${a}x - ${a*a}}{x - ${a} + ${a}x + ${a*a}} = \\frac{${1-a}x - ${a+a*a}}{${1+a}x + ${a*a-a}}$`
        ],
        finalAnswer: `$\\frac{${1-a}x - ${a+a*a}}{${1+a}x + ${a*a-a}}$`
      }
    }
  } else if (type === 2) {
    const t = Math.floor(Math.random() * 4);
    if (t === 0) { // ax+b
       const a = getRandomInt(2, 6) * (Math.random() < 0.5 ? 1 : -1);
       const b = getRandomInt(1, 10);
       return {
         subTopic: actualTopic,
         questionLines: [
           `A function $h$ is defined on the set of real numbers by $h(x)=${a}x-${b}$.`,
           `Find a formula for the inverse function, $h^{-1}(x)$.`
         ],
         boardQuestionLines: [
           `$h(x)=${a}x-${b}$`,
           `Find $h^{-1}(x)$.`
         ],
         solutionSteps: [
           `<strong>1.</strong> Let $y = h(x)$.`,
           `$y = ${a}x-${b}$`,
           `<strong>2.</strong> Rearrange to make $x$ the subject:`,
           `$y+${b} = ${a}x$`,
           `$x = \\frac{y+${b}}{${a}}$`,
           `<strong>3.</strong> Swap $x$ and $y$:`,
           `$h^{-1}(x) = \\frac{x+${b}}{${a}}$`
         ],
         finalAnswer: `$h^{-1}(x) = \\frac{x+${b}}{${a}}$`
       }
    }
    if (t === 1) { // ax^3+b
       const a = getRandomInt(2, 5);
       const b = getRandomInt(1, 10);
       return {
         subTopic: actualTopic,
         questionLines: [
           `A function $h$ is defined on the set of real numbers by $h(x)=${a}x^3-${b}$.`,
           `Find a formula for the inverse function, $h^{-1}(x)$.`
         ],
         boardQuestionLines: [
           `$h(x)=${a}x^3-${b}$`,
           `Find $h^{-1}(x)$.`
         ],
         solutionSteps: [
           `<strong>1.</strong> Let $y = h(x)$.`,
           `$y = ${a}x^3-${b}$`,
           `<strong>2.</strong> Rearrange to make $x$ the subject:`,
           `$y+${b} = ${a}x^3$`,
           `$\\frac{y+${b}}{${a}} = x^3$`,
           `$x = \\sqrt[3]{\\frac{y+${b}}{${a}}}$`,
           `<strong>3.</strong> Swap $x$ and $y$:`,
           `$h^{-1}(x) = \\sqrt[3]{\\frac{x+${b}}{${a}}}$`
         ],
         finalAnswer: `$h^{-1}(x) = \\sqrt[3]{\\frac{x+${b}}{${a}}}$`
       }
    }
    if (t === 2) { // a/x + b
       const a = getRandomInt(2, 6);
       const b = getRandomInt(1, 8);
       return {
         subTopic: actualTopic,
         questionLines: [
           `A function $f$ is defined on a suitable domain by $f(x)=\\frac{${a}}{x}+${b}$.`,
           `Find a formula for the inverse function, $f^{-1}(x)$.`
         ],
         boardQuestionLines: [
           `$f(x)=\\frac{${a}}{x}+${b}$`,
           `Find $f^{-1}(x)$.`
         ],
         solutionSteps: [
           `<strong>1.</strong> Let $y = f(x)$.`,
           `$y = \\frac{${a}}{x}+${b}$`,
           `<strong>2.</strong> Rearrange to make $x$ the subject:`,
           `$y-${b} = \\frac{${a}}{x}$`,
           `$(y-${b})x = ${a}$`,
           `$x = \\frac{${a}}{y-${b}}$`,
           `<strong>3.</strong> Write the inverse function:`,
           `$f^{-1}(x) = \\frac{${a}}{x-${b}}$`
         ],
         finalAnswer: `$f^{-1}(x) = \\frac{${a}}{x-${b}}$`
       };
    }
    
    // else (x-a)^3 
    const a = getRandomInt(1, 6);
    return {
      subTopic: actualTopic,
      questionLines: [
        `A function $g$ is defined on the set of real numbers by $g(x)=(x-${a})^3$.`,
        `Find a formula for the inverse function, $g^{-1}(x)$.`
      ],
      boardQuestionLines: [
        `$g(x)=(x-${a})^3$`,
        `Find $g^{-1}(x)$.`
      ],
      solutionSteps: [
        `<strong>1.</strong> Let $y = g(x)$.`,
        `$y = (x-${a})^3$`,
        `<strong>2.</strong> Rearrange to make $x$ the subject:`,
        `$\\sqrt[3]{y} = x-${a}$`,
        `$x = \\sqrt[3]{y}+${a}$`,
        `<strong>3.</strong> Write the inverse function:`,
        `$g^{-1}(x) = \\sqrt[3]{x}+${a}$`
      ],
      finalAnswer: `$g^{-1}(x) = \\sqrt[3]{x}+${a}$`
    };
  } else {
    // Graphs of related functions
    const tpx1 = getRandomInt(-5, 5);
    const tpy1 = getRandomInt(-5, 5);
    let tpx2 = getRandomInt(-5, 5);
    let tpy2 = getRandomInt(-5, 5);
    while (tpx1 === tpx2 || tpy1 === tpy2) {
       tpx2 = getRandomInt(-5, 5);
       tpy2 = getRandomInt(-5, 5);
    }
    
    const tNames = [
      (x: number) => ({ expr: `y=f(x-${x})`, dx: x, dy: 0, mx: 1, my: 1, desc: `translate right ${x}` }),
      (x: number) => ({ expr: `y=f(x+${x})`, dx: -x, dy: 0, mx: 1, my: 1, desc: `translate left ${x}` }),
      (x: number) => ({ expr: `y=f(x)+${x}`, dx: 0, dy: x, mx: 1, my: 1, desc: `translate up ${x}` }),
      (x: number) => ({ expr: `y=f(x)-${x}`, dx: 0, dy: -x, mx: 1, my: 1, desc: `translate down ${x}` }),
      (x: number) => ({ expr: `y=${x}f(x)`, dx: 0, dy: 0, mx: 1, my: x, desc: `stretch vertically by ${x}` }),
      (x: number) => ({ expr: `y=-${x}f(x)`, dx: 0, dy: 0, mx: 1, my: -x, desc: `stretch vertically by ${x} and reflect in x-axis` }),
      (x: number) => ({ expr: `y=f(-x)`, dx: 0, dy: 0, mx: -1, my: 1, desc: `reflect in y-axis` })
    ];
    
    const picks: number[] = [];
    while(picks.length < 2) {
      const r = Math.floor(Math.random() * tNames.length);
      if(!picks.includes(r)) picks.push(r);
    }
    
    const v1 = getRandomInt(2, 5);
    const t1 = tNames[picks[0]](v1);
    const v2 = getRandomInt(2, 5);
    const t2 = tNames[picks[1]](v2);
    
    return {
      subTopic: actualTopic,
      questionLines: [
        `The diagram of a function $f(x)$ has turning points mapped at $(${tpx1}, ${tpy1})$ and $(${tpx2}, ${tpy2})$.`,
        `Determine the new coordinates of these turning points on the graphs of the following related functions:`,
        `<b>(a)</b> $${t1.expr}$     <b>(b)</b> $${t2.expr}$`
      ],
      boardQuestionLines: [
        `$f(x)$ has turning points $(${tpx1}, ${tpy1})$, $(${tpx2}, ${tpy2})$.`,
        `Find the new turning points for:`,
        `<b>(a)</b> $${t1.expr}$     <b>(b)</b> $${t2.expr}$`
      ],
      solutionSteps: [
        `<strong>(a)</strong> The transformation is $${t1.expr}$. ${t1.desc}.`,
        `$(${tpx1}, ${tpy1}) \\rightarrow (${tpx1 * t1.mx + t1.dx}, ${tpy1 * t1.my + t1.dy})$`,
        `$(${tpx2}, ${tpy2}) \\rightarrow (${tpx2 * t1.mx + t1.dx}, ${tpy2 * t1.my + t1.dy})$`,
        `<strong>(b)</strong> The transformation is $${t2.expr}$. ${t2.desc}.`,
        `$(${tpx1}, ${tpy1}) \\rightarrow (${tpx1 * t2.mx + t2.dx}, ${tpy1 * t2.my + t2.dy})$`,
        `$(${tpx2}, ${tpy2}) \\rightarrow (${tpx2 * t2.mx + t2.dx}, ${tpy2 * t2.my + t2.dy})$`
      ],
      finalAnswer: `(a) $(${tpx1 * t1.mx + t1.dx}, ${tpy1 * t1.my + t1.dy})$, $(${tpx2 * t1.mx + t1.dx}, ${tpy2 * t1.my + t1.dy})$<br>(b) $(${tpx1 * t2.mx + t2.dx}, ${tpy1 * t2.my + t2.dy})$, $(${tpx2 * t2.mx + t2.dx}, ${tpy2 * t2.my + t2.dy})$`
    }
  }
}



