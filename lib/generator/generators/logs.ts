import { getRandomInt, nonZeroInt, Point, formatNum, gcd, simplifyFraction, formatFraction, formatFractionWithSub, formatTerm, formatEquation, generateTriangle } from "./utils";
import { GeneratedQuestion, Topic, TOPIC_GROUPS } from "./types";

export function generateLogsQuestion(selectedTopic: string): Omit<GeneratedQuestion, "topic"> {
  const topics = TOPIC_GROUPS["Exponentials & Logarithms"];
  let type = topics.indexOf(selectedTopic as Topic);
  if (type === -1) type = Math.floor(Math.random() * topics.length);
  const actualTopic = topics[type];

  
  if (actualTopic === "Basic definition of logarithm") {
    const bases = [2, 3, 4, 5];
    const base = bases[Math.floor(Math.random() * bases.length)];
    const k = getRandomInt(2, 4);
    const x = Math.pow(base, k);
    
    return {
      subTopic: actualTopic,
      questionLines: [
        `Evaluate $\\log_{${base}}\\,${x}$.`
      ],
      boardQuestionLines: [
        `Evaluate:`,
        `$\\log_{${base}}\\,${x}$`
      ],
      solutionSteps: [
        `Definition: $\\log_a x$ means the power to which we must raise the base $a$ to get $x$.`,
        `$${base}^{${k}} = ${x}$ so $\\log_{${base}}\\,${x} = ${k}$.`
      ],
      finalAnswer: `$${k}$`
    };
  }

  if (actualTopic === "Using the laws of logarithms") {
    const type = getRandomInt(0, 2);
    
    if (type === 0) {
      // e.g. Evaluate log_10 40 + 2 log_10 5
      return {
        subTopic: actualTopic,
        questionLines: [
          `Evaluate $\\log\\,40 + 2\\,\\log\\,5$.`
        ],
        boardQuestionLines: [
          `Evaluate $\\log\\,40 + 2\\,\\log\\,5$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Apply power law: $\\log 40 + \\log 5^2$`,
          `$= \\log 40 + \\log 25$`,
          `<strong>2.</strong> Apply addition law: $\\log(40 \\times 25)$`,
          `$= \\log 1000$`,
          `$= 3$`
        ],
        finalAnswer: `$3$`
      };
    } else if (type === 1) {
      // e.g. Evaluate 2 log_3 6 - log_3 4
      return {
        subTopic: actualTopic,
        questionLines: [
          `Evaluate $2\\,\\log_3\\,6 - \\log_3\\,4$.`
        ],
        boardQuestionLines: [
          `Evaluate $2\\,\\log_3\\,6 - \\log_3\\,4$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Apply power law: $\\log_3 6^2 - \\log_3 4$`,
          `$= \\log_3 36 - \\log_3 4$`,
          `<strong>2.</strong> Apply subtraction law: $\\log_3\\left(\\frac{36}{4}\\right)$`,
          `$= \\log_3 9$`,
          `$= 2$`
        ],
        finalAnswer: `$2$`
      };
    } else {
      // e.g. express log_a 5 + log_a 80 - 2 log_a 10
      return {
        subTopic: actualTopic,
        questionLines: [
          `Express $\\log_a\\,5 + \\log_a\\,80 - 2\\,\\log_a\\,10$ in the form $\\log_a\\,k$ where $k$ is a positive integer.`
        ],
        boardQuestionLines: [
          `Express $\\log_a\\,5 + \\log_a\\,80 - 2\\,\\log_a\\,10$ as $\\log_a\\,k$.`
        ],
        solutionSteps: [
          `$= \\log_a 5 + \\log_a 80 - \\log_a 10^2$`,
          `$= \\log_a 5 + \\log_a 80 - \\log_a 100$`,
          `$= \\log_a \\left(\\frac{5 \\times 80}{100}\\right)$`,
          `$= \\log_a \\left(\\frac{400}{100}\\right)$`,
          `$= \\log_a 4$`
        ],
        finalAnswer: `$\\log_a 4$`
      };
    }
  }

  if (actualTopic === "Solving logarithmic equations") {
    const type = getRandomInt(0, 3);
    
    if (type === 0) {
      // log_a x + log_a B = log_a C (or similar basic log equation)
      const base = getRandomInt(2, 6);
      const isMinus = Math.random() > 0.5;
      const xAns = getRandomInt(2, 8);
      
      let term2, rhs;
      if (isMinus) {
        // log_a(x) - log_a(B) = log_a(C) => x/B = C => x = B*C
        const B = getRandomInt(2, 5);
        term2 = B;
        rhs = xAns * B;
      } else {
        // log_a(term2) + log_a(x) = log_a(rhs) => term2 * x = rhs
        const B = getRandomInt(2, 5);
        term2 = B;
        rhs = term2 * xAns;
      }
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Solve for $x$: $\\log_{${base}}\\,${isMinus ? 'x' : term2} ${isMinus ? '- \\log_{' + base + '}\\,' + term2 : '+ \\log_{' + base + '}\\,x'} = \\log_{${base}}\\,${rhs}$`
        ],
        boardQuestionLines: [
          `Solve for $x$:`,
          `$\\log_{${base}}\\,${isMinus ? 'x' : term2} ${isMinus ? '-' : '+'} \\log_{${base}}\\,${isMinus ? term2 : 'x'} = \\log_{${base}}\\,${rhs}$`
        ],
        solutionSteps: [
          `<strong>1.</strong> Use laws of logarithms to combine the left side:`,
          `$\\log_{${base}}\\,\\left(${isMinus ? '\\frac{x}{' + term2 + '}' : term2 + 'x'}\\right) = \\log_{${base}}\\,${rhs}$`,
          `<strong>2.</strong> Equate the arguments since the bases are the same:`,
          `$${isMinus ? '\\frac{x}{' + term2 + '}' : term2 + 'x'} = ${rhs}$`,
          `<strong>3.</strong> Solve for $x$:`,
          `$x = ${xAns}$`
        ],
        finalAnswer: `$x = ${xAns}$`
      };
    } else if (type === 1) {
      // Find base: log_a 45 - log_a 5 = 1/2
      const P = getRandomInt(3, 9);
      const a = P * P;
      const n = getRandomInt(2, 5);
      const m = n * P;
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Given that $\\log_a\\,${m} - \\log_a\\,${n} = \\frac{1}{2}$, find the value of $a$.`
        ],
        boardQuestionLines: [
          `Given $\\log_a\\,${m} - \\log_a\\,${n} = \\frac{1}{2}$, find $a$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Use subtraction law: $\\log_a \\left(\\frac{${m}}{${n}}\\right) = \\frac{1}{2}$`,
          `$\\log_a ${P} = \\frac{1}{2}$`,
          `<strong>2.</strong> Convert to exponential form: $a^{1/2} = ${P}$`,
          `$\\sqrt{a} = ${P}$`,
          `$a = ${a}$`
        ],
        finalAnswer: `$a = ${a}$`
      };
    } else if (type === 2) {
      // Solve log x + log (x+c) = k
      // We need x(x+c) = a^k
      const a = getRandomInt(2, 6);
      const k = 2; // Keep it simple
      const V = Math.pow(a, k); // e.g., 36
      
      const configs = [
        {a: 6, k: 2, V: 36, x_valid: 4, x_invalid: -9, c: 5},
        {a: 2, k: 3, V: 8, x_valid: 2, x_invalid: -4, c: 2},
        {a: 3, k: 2, V: 9, x_valid: 1, x_invalid: -9, c: 8},
        {a: 4, k: 2, V: 16, x_valid: 2, x_invalid: -8, c: 6},
        {a: 5, k: 2, V: 25, x_valid: 3, x_invalid: -8, c: 5} // Wait. 3*8 = 24. No. x^2 + cx = a^k -> 3 * 8 = 24 != 25. Let's fix this configs.
      ];
      const validConfigs = [
        {a: 6, k: 2, V: 36, x_valid: 4, x_invalid: -9, c: 5},
        {a: 2, k: 3, V: 8, x_valid: 2, x_invalid: -4, c: 2},
        {a: 3, k: 2, V: 9, x_valid: 1, x_invalid: -9, c: 8},
        {a: 4, k: 2, V: 16, x_valid: 2, x_invalid: -8, c: 6},
        {a: 2, k: 4, V: 16, x_valid: 2, x_invalid: -8, c: 6}
      ];
      const cfg = validConfigs[Math.floor(Math.random() * validConfigs.length)];
      
      const isDiffOfSquares = Math.random() > 0.5;
      
      if (isDiffOfSquares) {
         // log_a(x-d) + log_a(x+d) = k   => x^2 - d^2 = a^k => x^2 = a^k + d^2
         const sqConfigs = [
           { a: 2, k: 3, V: 8, d: 1, x_sq: 9, x_valid: 3},
           { a: 3, k: 2, V: 9, d: 4, x_sq: 25, x_valid: 5},
           { a: 2, k: 4, V: 16, d: 3, x_sq: 25, x_valid: 5},
           { a: 5, k: 2, V: 25, d: 11, x_sq: 144, x_valid: 12}
         ];
         const sqc = sqConfigs[Math.floor(Math.random() * sqConfigs.length)];
         return {
            subTopic: actualTopic,
            questionLines: [
              `Solve $\\log_{${sqc.a}}(x - ${sqc.d}) + \\log_{${sqc.a}}(x + ${sqc.d}) = ${sqc.k}$, where $x > ${sqc.d}$.`
            ],
            boardQuestionLines: [
              `Solve $\\log_{${sqc.a}}(x - ${sqc.d}) + \\log_{${sqc.a}}(x + ${sqc.d}) = ${sqc.k}$ ($x > ${sqc.d}$).`
            ],
            solutionSteps: [
              `<strong>1.</strong> Use laws of logarithms:`,
              `$\\log_{${sqc.a}} ((x - ${sqc.d})(x + ${sqc.d})) = ${sqc.k}$`,
              `$\\log_{${sqc.a}} (x^2 - ${sqc.d * sqc.d}) = ${sqc.k}$`,
              `<strong>2.</strong> Convert to exponential form:`,
              `$x^2 - ${sqc.d * sqc.d} = ${sqc.a}^{${sqc.k}}$`,
              `$x^2 - ${sqc.d * sqc.d} = ${sqc.V}$`,
              `$x^2 = ${sqc.x_sq}$`,
              `<strong>3.</strong> Solve for $x$:`,
              `$x = ${sqc.x_valid}$ or $x = -${sqc.x_valid}$`,
              `Since $x > ${sqc.d}$, $x = ${sqc.x_valid}$.`
            ],
            finalAnswer: `$x = ${sqc.x_valid}$`
         };
      }
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Solve $\\log_{${cfg.a}}\\,x + \\log_{${cfg.a}}\\,(x+${cfg.c}) = ${cfg.k}$, where $x > 0$.`
        ],
        boardQuestionLines: [
          `Solve $\\log_{${cfg.a}}\\,x + \\log_{${cfg.a}}\\,(x+${cfg.c}) = ${cfg.k}$ ($x>0$).`
        ],
        solutionSteps: [
          `<strong>1.</strong> Use laws of logarithms:`,
          `$\\log_{${cfg.a}} x(x+${cfg.c}) = ${cfg.k}$`,
          `<strong>2.</strong> Convert to exponential form:`,
          `$x(x+${cfg.c}) = ${cfg.a}^{${cfg.k}}$`,
          `$x^2 + ${cfg.c}x = ${cfg.V}$`,
          `$x^2 + ${cfg.c}x - ${cfg.V} = 0$`,
          `<strong>3.</strong> Solve the quadratic:`,
          `$(x - ${cfg.x_valid})(x + ${-cfg.x_invalid}) = 0$`,
          `$x = ${cfg.x_valid}$ or $x = ${cfg.x_invalid}$`,
          `Since $x > 0$, discard $x = ${cfg.x_invalid}$.`
        ],
        finalAnswer: `$x = ${cfg.x_valid}$`
      };
    } else {
      // Find base: log_a 75 = 2 + log_a 3
      const a = getRandomInt(4, 8);
      const asq = a * a;
      const n = getRandomInt(2, 4);
      const m = n * asq;
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Given that $\\log_a\\,${m} = 2 + \\log_a\\,${n}$, $a > 0$, find the value of $a$.`
        ],
        boardQuestionLines: [
          `$\\log_a\\,${m} = 2 + \\log_a\\,${n}$ ($a > 0$). Find $a$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Group terms on one side:`,
          `$\\log_a ${m} - \\log_a ${n} = 2$`,
          `<strong>2.</strong> Use division law of logarithms:`,
          `$\\log_a \\left(\\frac{${m}}{${n}}\\right) = 2$`,
          `$\\log_a ${asq} = 2$`,
          `<strong>3.</strong> Convert to exponential form:`,
          `$a^2 = ${asq}$`,
          `$a = ${a}$`
        ],
        finalAnswer: `$a = ${a}$`
      };
    }
  }

  if (actualTopic === "Solving exponential equations") {
    const type = getRandomInt(0, 1);
    
    if (type === 0) {
      // a^(bx + c) = d
      const base = getRandomInt(3, 7);
      const b = getRandomInt(2, 4);
      const c = getRandomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
      const d = getRandomInt(11, 23);
      
      const cStr = c > 0 ? `+${c}` : `${c}`;
      return {
        subTopic: actualTopic,
        questionLines: [
          `Solve $${base}^{${b}x${cStr}} = ${d}$, correct to 3 significant figures.`
        ],
        boardQuestionLines: [
          `Solve $${base}^{${b}x${cStr}} = ${d}$ (to 3 s.f.).`
        ],
        solutionSteps: [
          `$\\ln(${base}^{${b}x${cStr}}) = \\ln(${d})$`,
          `$(${b}x${cStr})\\ln(${base}) = \\ln(${d})$`,
          `$${b}x${cStr} = \\frac{\\ln(${d})}{\\ln(${base})}$`,
          `$${b}x = \\frac{\\ln(${d})}{\\ln(${base})} ${c > 0 ? '-' : '+'} ${Math.abs(c)}$`,
          `$x = \\left( \\frac{\\ln(${d})}{\\ln(${base})} ${c > 0 ? '-' : '+'} ${Math.abs(c)} \\right) \\div ${b}$`
        ],
        finalAnswer: `Evaluate $x$ using a calculator.`
      };
    } else {
      // Word problem M = A e^{kt}
      const A = Math.floor(Math.random() * 3 + 1) * 50; // 50, 100, 150
      const k = -((Math.floor(Math.random() * 50) + 10) / 10000).toFixed(4); // e.g. -0.0054
      const target = Math.floor(A * 0.8); // 80%
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `The mass of a substance is modelled by $M = ${A}\\,e^{${k}t}$ where $M$ is in micrograms and $t$ is years.`,
          `(a) Determine the initial mass.`,
          `(b) Calculate the time taken for the mass to decay to $${target}$ micrograms.`
        ],
        boardQuestionLines: [
          `$M = ${A}\\,e^{${k}t}$`,
          `(a) Initial mass?`,
          `(b) Time to reach $${target}$ mcg?`
        ],
        solutionSteps: [
          `(a) Initial mass is when $t=0$: $M = ${A}\\,e^{0} = ${A}$.`,
          `(b) $${target} = ${A}\\,e^{${k}t}$`,
          `$\\frac{${target}}{${A}} = e^{${k}t}$`,
          `$${target / A} = e^{${k}t}$`,
          `$\\ln(${target / A}) = ${k}t$`,
          `$t = \\frac{\\ln(${target / A})}{${k}}$`
        ],
        finalAnswer: `(a) $${A}$, (b) Evaluate $t$ using a calculator.`
      };
    }
  }

  if (actualTopic === "Finding relationship from straight line") {
    const isLogYvsX = Math.random() > 0.5;
    const isAnalytical = Math.random() > 0.5;
    
    if (isAnalytical) {
      // Worksheet 32 part 1 style: Obtain a formula for y in terms of x
      // e.g. log_3 y = log_3 x + log_3 7 => y = 7x
      // e.g. log_2 y = 2 log_2 x + log_2 0.5 => y = 0.5 x^2
      // e.g. log_6 y = x log_6 (1/6) + 1 => y = 6 * (1/6)^x
      
      const base = getRandomInt(2, 10);
      
      if (isLogYvsX) {
        // Linear in log_a y and x => y = a b^x
        // log_a y = x log_a b + log_a A -> log_6 y = x log_6 2 + log_6 4 -> wait: x log_6 2 ? No, it's usually x log_6 ... or log_a y = m x + c -> y = a^{mx+c}
        // Let's match worksheet: log_2 y = x log_2 3 + log_2 8
        const b = getRandomInt(2, 5);
        const A = getRandomInt(2, 8);
        return {
          subTopic: actualTopic,
          questionLines: [
            `Obtain a formula for $y$ in terms of $x$ for the following equation:`,
            `$\\log_{${base}}\\,y = x\\,\\log_{${base}}\\,${b} + \\log_{${base}}\\,${A}$`
          ],
          boardQuestionLines: [
            `Obtain a formula for $y$ in terms of $x$:`,
            `$\\log_{${base}}\\,y = x\\,\\log_{${base}}\\,${b} + \\log_{${base}}\\,${A}$`
          ],
          solutionSteps: [
            `<strong>1.</strong> Apply power law to $x\\,\\log_{${base}}\\,${b}$:`,
            `$\\log_{${base}}\\,y = \\log_{${base}}\\,${b}^x + \\log_{${base}}\\,${A}$`,
            `<strong>2.</strong> Apply addition law to combine terms on the right:`,
            `$\\log_{${base}}\\,y = \\log_{${base}}\\,(${A} \\times ${b}^x)$`,
            `<strong>3.</strong> Equate the arguments:`,
            `$y = ${A} \\times ${b}^x$`
          ],
          finalAnswer: `$y = ${A}(${b}^x)$`
        };
      } else {
        // Linear in log_a y and log_a x => y = A x^n
        // log_2 y = 4 log_2 x + 3 => wait, 3 is log_2 8. Let's do `n log_a x + log_a A` or `n log_a x + c`
        const n = getRandomInt(2, 5);
        const hasLogForA = Math.random() > 0.5;
        
        let term2, A, stepsA;
        if (hasLogForA) {
           A = getRandomInt(2, 8);
           term2 = `\\log_{${base}}\\,${A}`;
           stepsA = [
             `$\\log_{${base}}\\,y = \\log_{${base}}\\,x^{${n}} + \\log_{${base}}\\,${A}$`,
             `$\\log_{${base}}\\,y = \\log_{${base}}\\,(${A}x^{${n}})$`
           ];
        } else {
           const c = getRandomInt(1, 3);
           A = Math.pow(base, c);
           term2 = c;
           stepsA = [
             `$\\log_{${base}}\\,y = \\log_{${base}}\\,x^{${n}} + ${c}$`,
             `Rewrite ${c} as a logarithm: $${c} = \\log_{${base}}\\,${base}^{${c}} = \\log_{${base}}\\,${A}$`,
             `$\\log_{${base}}\\,y = \\log_{${base}}\\,x^{${n}} + \\log_{${base}}\\,${A}$`,
             `$\\log_{${base}}\\,y = \\log_{${base}}\\,(${A}x^{${n}})$`
           ];
        }
        
        return {
          subTopic: actualTopic,
          questionLines: [
            `Obtain a formula for $y$ in terms of $x$ for the following equation:`,
            `$\\log_{${base}}\\,y = ${n}\\,\\log_{${base}}\\,x + ${term2}$`
          ],
          boardQuestionLines: [
            `Obtain a formula for $y$ in terms of $x$:`,
            `$\\log_{${base}}\\,y = ${n}\\,\\log_{${base}}\\,x + ${term2}$`
          ],
          solutionSteps: [
            `<strong>1.</strong> Apply power law to ${n}$\\,\\log_{${base}}\\,x$:`,
            ...stepsA,
            `<strong>2.</strong> Equate the arguments:`,
            `$y = ${A}x^{${n}}$`
          ],
          finalAnswer: `$y = ${A}x^{${n}}$`
        };
      }
    }
    
    // Original Graph logic below 
    if (isLogYvsX) {
      // y = a b^x -> log_B y vs x
      const base = getRandomInt(2, 5);
      const mNum = 1;
      const mDen = 2; // gradient = 1/2
      const c = -1; // y-intercept = -1
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Two variables $x$ and $y$ are connected by the equation $y = ab^x$.`,
          `The graph of $\\log_{${base}}\\,y$ against $x$ is a straight line.`,
          `The line passes through $(0, ${c})$ and $(4, ${c + 4 * (mNum / mDen)})$. Find $a$ and $b$.`
        ],
        boardQuestionLines: [
          `$y = ab^x$. Graph of $\\log_{${base}}\\,y$ vs $x$ passes through $(0, ${c}), (4, ${c + 4 * (mNum / mDen)})$.`,
          `Find $a$ and $b$.`
        ],
        solutionSteps: [
          `$y = ab^x \\implies \\log_{${base}}\\,y = \\log_{${base}}\\,a + x\\,\\log_{${base}}\\,b$`,
          `So $m = \\log_{${base}}\\,b$ and $c = \\log_{${base}}\\,a$.`,
          `From points $(0, ${c})$ to $(4, ${c + 4 * (mNum / mDen)})$, gradient $m = \\frac{${mNum}}{${mDen}}$.`,
          `$\\log_{${base}}\\,b = \\frac{1}{2} \\implies b = ${base}^{1/2} = \\sqrt{${base}}$.`,
          `$y$-intercept $c = ${c} \\implies \\log_{${base}}\\,a = ${c} \\implies a = ${base}^{${c}} = \\frac{1}{${Math.pow(base, Math.abs(c))}}$.`
        ],
        finalAnswer: `$a = \\frac{1}{${Math.pow(base, Math.abs(c))}}, b = \\sqrt{${base}}$`
      };
    } else {
      // y = k x^n -> log_B y vs log_B x
      const base = getRandomInt(2, 5);
      const nNum = getRandomInt(2, 5);
      const nDen = getRandomInt(2, 5); // n = gradient
      const c = getRandomInt(1, 4); // y-intercept
      const k = Math.pow(base, c);
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Two variables $x$ and $y$ are connected by the equation $y = kx^n$.`,
          `The graph of $\\log_{${base}}\\,y$ against $\\log_{${base}}\\,x$ is a straight line.`,
          `The line passes through $(0, ${c})$ and $(${nDen}, ${c + nNum})$. Find $k$ and $n$.`
        ],
        boardQuestionLines: [
          `$y = kx^n$. Graph of $\\log_{${base}}\\,y$ vs $\\log_{${base}}\\,x$ passes through $(0, ${c}), (${nDen}, ${c + nNum})$.`,
          `Find $k$ and $n$.`
        ],
        solutionSteps: [
          `$y = kx^n \\implies \\log_{${base}}\\,y = \\log_{${base}}\\,k + n\\,\\log_{${base}}\\,x$`,
          `So $m = n$ and $c = \\log_{${base}}\\,k$.`,
          `From points $(0, ${c})$ and $(${nDen}, ${c + nNum})$, gradient $m = \\frac{${nNum}}{${nDen}}$.`,
          `So $n = \\frac{${nNum}}{${nDen}}$.`,
          `$y$-intercept $c = ${c} \\implies \\log_{${base}}\\,k = ${c} \\implies k = ${base}^{${c}} = ${k}$.`
        ],
        finalAnswer: `$n = \\frac{${nNum}}{${nDen}}, k = ${k}$`
      };
    }
  }

  return {
    subTopic: actualTopic,
    questionLines: ["Missing logarithms question"],
    boardQuestionLines: ["Missing"],
    solutionSteps: ["Error"],
    finalAnswer: "Error"
  };
}

