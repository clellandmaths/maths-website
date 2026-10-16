import { getRandomInt, nonZeroInt, Point, formatNum, gcd, simplifyFraction, formatFraction, formatFractionWithSub, formatTerm, formatEquation, generateTriangle } from "./utils";
import { GeneratedQuestion, Topic, TOPIC_GROUPS } from "./types";

export function generateDifferentiationQuestion(selectedTopic: string): Omit<GeneratedQuestion, "topic"> {
  const topics = TOPIC_GROUPS["Differentiation"];
  let type = topics.indexOf(selectedTopic as Topic);
  if (type === -1) type = Math.floor(Math.random() * topics.length);
  const actualTopic = topics[type];

  if (actualTopic === "Simple differentiation") {
    const a = (Math.random() > 0.5 ? 1 : -1) * getRandomInt(2, 6);
    const n = getRandomInt(2, 4);
    const b = (Math.random() > 0.5 ? 1 : -1) * getRandomInt(2, 5);
    const c = getRandomInt(1, 5);
    const d = getRandomInt(2, 5);
    
    const poly = `${a}x^${n} ${b > 0 ? '+' : '-'} ${Math.abs(b)}\\sqrt{x} + \\frac{${c}}{${d}x}`;
    const term1_prep = `${a}x^${n}`;
    const term2_prep = `${b > 0 ? '+' : '-'} ${Math.abs(b)}x^{\\frac{1}{2}}`;
    const term3_prep = `+ \\frac{${c}}{${d}}x^{-1}`;
    
    const term1_diff = `${a*n}x^${n-1 === 1 ? '' : n-1}`;
    const b_half = (Math.abs(b)%2 === 0) ? (Math.abs(b)/2).toString() : `\\frac{${Math.abs(b)}}{2}`;
    const term2_diff = `${b > 0 ? '+' : '-'} ${b_half}x^{-\\frac{1}{2}}`;
    const term3_diff = `- \\frac{${c}}{${d}}x^{-2}`;
    
    const term2_final = `${b > 0 ? '+' : '-'} \\frac{${Math.abs(b)%2 === 0 ? Math.abs(b)/2 : Math.abs(b)}}{${Math.abs(b)%2 === 0 ? '' : '2'}\\sqrt{x}}`;
    const term3_final = `- \\frac{${c}}{${d}x^2}`;

    return {
      subTopic: actualTopic,
      questionLines: [
        `Given that $y = ${poly}$, where $x > 0$, find $\\frac{dy}{dx}$.`,
        `Express your answer without any non-integer or negative powers of $x$.`
      ],
      boardQuestionLines: [
        `Differentiate and simplify:`,
        `$y = ${poly}$`
      ],
      solutionSteps: [
        `<strong>1.</strong> Prepare the expression for differentiation:`,
        `$y = ${term1_prep} ${term2_prep} ${term3_prep}$`,
        `<strong>2.</strong> Differentiate:`,
        `$\\frac{dy}{dx} = ${term1_diff} ${term2_diff} ${term3_diff}$`,
        `<strong>3.</strong> Express without negative or non-integer powers:`,
        `$\\frac{dy}{dx} = ${term1_diff} ${term2_final} ${term3_final}$`
      ],
      finalAnswer: `$\\frac{dy}{dx} = ${term1_diff} ${term2_final} ${term3_final}$`
    };
  }

  if (actualTopic === "Rate of change") {
    const a = getRandomInt(2, 5);
    const b = getRandomInt(2, 6);
    const t0 = getRandomInt(2, 4);
    
    const term2_sign = Math.random() > 0.5 ? '+' : '-';
    
    return {
      subTopic: actualTopic,
      questionLines: [
        `Calculate the rate of change of $f(t) = ${a}t ${term2_sign} \\frac{${b}}{t}$, where $t > 0$, when $t = ${t0}$.`
      ],
      boardQuestionLines: [
        `Find $f'(${t0})$ for:`,
        `$f(t) = ${a}t ${term2_sign} \\frac{${b}}{t}$`
      ],
      solutionSteps: [
        `<strong>1.</strong> Prepare $f(t)$ for differentiation:`,
        `$f(t) = ${a}t ${term2_sign} ${b}t^{-1}$`,
        `<strong>2.</strong> Differentiate:`,
        `$f'(t) = ${a} ${term2_sign === '+' ? '-' : '+'} ${b}t^{-2} = ${a} ${term2_sign === '+' ? '-' : '+'} \\frac{${b}}{t^2}$`,
        `<strong>3.</strong> Substitute $t = ${t0}$:`,
        `$f'(${t0}) = ${a} ${term2_sign === '+' ? '-' : '+'} \\frac{${b}}{${t0}^2} = ${a} ${term2_sign === '+' ? '-' : '+'} \\frac{${b}}{${t0*t0}} = \\frac{${term2_sign === '+' ? a*t0*t0 - b : a*t0*t0 + b}}{${t0*t0}}$`
      ],
      finalAnswer: `$f'(${t0}) = \\frac{${term2_sign === '+' ? a*t0*t0 - b : a*t0*t0 + b}}{${t0*t0}}$`
    };
  }
  
  if (actualTopic === "Equation of tangent") {
    const isAngle = Math.random() < 0.2;
    if (isAngle) {
      // The tangent to the curve y = x^3 - 3x^2 + x makes an angle of 45 deg...
      // m = tan(45) = 1
      // dy/dx = 3x^2 - 6x + 1 = 1 => 3x^2 - 6x = 0 => 3x(x - 2) = 0 => x=0, x=2
      // We can generate similar: y = a x^3 / 3 - a x^2 / 2 + c x ? No, let's keep integer coefficients.
      // let derivative be a(x - r1)(x - r2) + m. 
      // dy/dx = ax^2 - a(r1+r2)x + a*r1*r2 + m
      // so y = (a/3)x^3 - (a(r1+r2)/2)x^2 + (a*r1*r2 + m)x
      // to have integer coefficients, let a be a multiple of 6.
      const a = 6;
      const r1 = getRandomInt(-2, 0);
      const r2 = getRandomInt(1, 4);
      // Wait, let's just make smaller coefficients to avoid massive numbers.
      // If a=3, we just need r1+r2 to be even.
      const rs = [[0, 2], [1, -1], [-2, 2], [1, 3]];
      const [root1, root2] = rs[Math.floor(Math.random() * rs.length)];
      
      const pA = 1; // 3/3
      const pB = -3 * (root1 + root2) / 2;
      const m = Math.random() < 0.5 ? 1 : -1;
      const angle = m === 1 ? 45 : 135;
      const pC = 3 * root1 * root2 + m;
      
      const pBStr = pB === 0 ? '' : pB > 0 ? `+ ${Math.abs(pB) === 1 ? 'x^2' : Math.abs(pB) + 'x^2'}` : `- ${Math.abs(pB) === 1 ? 'x^2' : Math.abs(pB) + 'x^2'}`;
      const pCStr = pC === 0 ? '' : pC > 0 ? `+ ${Math.abs(pC) === 1 ? 'x' : Math.abs(pC) + 'x'}` : `- ${Math.abs(pC) === 1 ? 'x' : Math.abs(pC) + 'x'}`;
      const poly = `x^3 ${pBStr} ${pCStr}`.replace(/\s+/g, ' ').trim();

      return {
        subTopic: actualTopic,
        questionLines: [
          `The tangent to the curve $y = ${poly}$ makes an angle of $${angle}^\\circ$ with the positive direction of the $x$-axis.`,
          `Find the possible $x$-coordinates of the point of contact.`
        ],
        boardQuestionLines: [
          `Tangent to $y = ${poly}$ makes angle $${angle}^\\circ$ with positive $x$-axis.`,
          `Find $x$-coordinates.`
        ],
        solutionSteps: [
          `<strong>1.</strong> The gradient of the tangent is $m = \\tan(${angle}^\\circ) = ${m}$.`,
          `<strong>2.</strong> Differentiate to find the gradient function:`,
          `$\\frac{dy}{dx} = 3x^2 ${pB === 0 ? '' : pB * 2 > 0 ? '+ ' + (pB * 2) + 'x' : '- ' + Math.abs(pB * 2) + 'x'} ${pC === 0 ? '' : pC > 0 ? '+ ' + pC : '- ' + Math.abs(pC)}$`,
          `<strong>3.</strong> Equate derivative to $m$:`,
          `$3x^2 ${pB === 0 ? '' : pB * 2 > 0 ? '+ ' + (pB * 2) + 'x' : '- ' + Math.abs(pB * 2) + 'x'} ${pC === 0 ? '' : pC > 0 ? '+ ' + pC : '- ' + Math.abs(pC)} = ${m}$`,
          `$3x^2 ${pB === 0 ? '' : pB * 2 > 0 ? '+ ' + (pB * 2) + 'x' : '- ' + Math.abs(pB * 2) + 'x'} ${(pC - m) === 0 ? '' : (pC - m) > 0 ? '+ ' + (pC - m) : '- ' + Math.abs(pC - m)} = 0$`,
          `<strong>4.</strong> Solve the quadratic:`,
          `$3(x - ${root1 < 0 ? '('+root1+')' : root1})(x - ${root2 < 0 ? '('+root2+')' : root2}) = 0$`,
          `$x = ${root1}$ or $x = ${root2}$`
        ],
        finalAnswer: `$x = ${root1}$ or $x = ${root2}$`
      };
    } else {
      const type = getRandomInt(0, 4);
      let poly = "";
      let y0 = 0;
      let mt = 0;
      let x0 = 0;
      let prepSteps: string[] = [];
      let diffStr = "";
      
      if (type === 0) { // square root: a \sqrt{x}

        const a = getRandomInt(2, 6);
        const xs = [1, 4, 9, 16, 25];
        x0 = xs[Math.floor(Math.random() * xs.length)];
        y0 = a * Math.sqrt(x0);
        mt = a / (2 * Math.sqrt(x0)); // a / (2 sqrt(x))
        poly = `${a}\\sqrt{x}`;
        prepSteps = [
          `$y = ${a}x^{\\frac{1}{2}}$`
        ];
        diffStr = `\\frac{${a}}{2}x^{-\\frac{1}{2}} = \\frac{${a}}{2\\sqrt{x}}`;
      } else if (type === 1) { // 3 - 2/x
        const a = getRandomInt(2, 5);
        const b = getRandomInt(1, 4) * (Math.random() > 0.5 ? 1 : -1);
        x0 = getRandomInt(1, 4) * (Math.random() > 0.5 ? 1 : -1);
        y0 = a - b / x0;
        mt = b / (x0 * x0); // derivative of -b/x is b/x^2
        poly = `${a} ${b > 0 ? '-' : '+'} \\frac{${Math.abs(b)}}{x}`;
        prepSteps = [
          `$y = ${a} ${b > 0 ? '-' : '+'} ${Math.abs(b)}x^{-1}$`
        ];
        diffStr = `${b > 0 ? '+' : '-'}${Math.abs(b)}x^{-2} = \\frac{${b}}{x^2}`;
      } else if (type === 2) { // (x - 3)^2 or x^2(2x-1)
        if (Math.random() > 0.5) {
          const a = getRandomInt(1, 4) * (Math.random() > 0.5 ? 1 : -1);
          x0 = getRandomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
          y0 = (x0 - a) * (x0 - a);
          mt = 2 * (x0 - a);
          poly = `(x ${a < 0 ? '+' : '-'} ${Math.abs(a)})^2`;
          prepSteps = [
            `$y = x^2 ${a > 0 ? '-' : '+'} ${2 * Math.abs(a)}x + ${a * a}$`
          ];
          diffStr = `2x ${a > 0 ? '-' : '+'} ${2 * Math.abs(a)}`;
        } else {
          const a = getRandomInt(2, 4);
          const b = getRandomInt(1, 4) * (Math.random() > 0.5 ? 1 : -1);
          x0 = getRandomInt(1, 3) * (Math.random() > 0.5 ? 1 : -1);
          y0 = (x0 * x0) * (a * x0 + b);
          mt = 3 * a * x0 * x0 + 2 * b * x0;
          poly = `x^2(${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)})`;
          prepSteps = [
            `$y = ${a}x^3 ${b > 0 ? '+' : '-'} ${Math.abs(b)}x^2$`
          ];
          diffStr = `${3 * a}x^2 ${b > 0 ? '+' : '-'} ${2 * Math.abs(b)}x`;
        }
      } else { // polynomial
        const a = getRandomInt(1, 3);
        const b = getRandomInt(1, 4) * (Math.random() > 0.5 ? 1 : -1);
        const c = getRandomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
        const d = getRandomInt(1, 6) * (Math.random() > 0.5 ? 1 : -1);
        x0 = getRandomInt(-2, 2);
        
        y0 = a * Math.pow(x0, 3) + b * Math.pow(x0, 2) + c * x0 + d;
        mt = 3 * a * Math.pow(x0, 2) + 2 * b * x0 + c;
        
        const bStr = b === 0 ? '' : b > 0 ? `+ ${Math.abs(b) === 1 ? 'x^2' : Math.abs(b) + 'x^2'}` : `- ${Math.abs(b) === 1 ? 'x^2' : Math.abs(b) + 'x^2'}`;
        const cStr = c === 0 ? '' : c > 0 ? `+ ${Math.abs(c) === 1 ? 'x' : Math.abs(c) + 'x'}` : `- ${Math.abs(c) === 1 ? 'x' : Math.abs(c) + 'x'}`;
        const dStr = d === 0 ? '' : d > 0 ? `+ ${d}` : `- ${Math.abs(d)}`;
        poly = `${a === 1 ? '' : a === -1 ? '-' : a}x^3 ${bStr} ${cStr} ${dStr}`.replace(/\s+/g, ' ').trim();
        
        const diffB = 2 * b;
        const diffC = c;
        
        const diffBStr = diffB === 0 ? '' : diffB > 0 ? `+ ${Math.abs(diffB) === 1 ? 'x' : Math.abs(diffB) + 'x'}` : `- ${Math.abs(diffB) === 1 ? 'x' : Math.abs(diffB) + 'x'}`;
        const diffCStr = diffC === 0 ? '' : diffC > 0 ? `+ ${diffC}` : `- ${Math.abs(diffC)}`;
        diffStr = `${3 * a}x^2 ${diffBStr} ${diffCStr}`.replace(/\s+/g, ' ').trim();
      }

      // Check for fractions in y0 and mt to format them nicely
      // To keep things reasonable, let's format fractions or use decimals
      const y0Str = Number.isInteger(y0) ? `${y0}` : `${y0.toFixed(2).replace(/\.00$/, '')}`;
      const mtStr = Number.isInteger(mt) ? `${mt}` : `${mt.toFixed(2).replace(/\.00$/, '')}`;
      const cStrVal = y0 - mt * x0;
      const cStr = Number.isInteger(cStrVal) ? `${cStrVal > 0 ? '+ ' + cStrVal : '- ' + Math.abs(cStrVal)}` : `${cStrVal > 0 ? '+ ' + cStrVal.toFixed(2) : '- ' + Math.abs(cStrVal).toFixed(2)}`;

      return {
        subTopic: actualTopic,
        questionLines: [
          `Find the equation of the tangent to the curve $y = ${poly}$ at the point where $x = ${x0}$.`
        ],
        boardQuestionLines: [
          `Equation of tangent at $x = ${x0}$ for:`,
          `$y = ${poly}$`
        ],
        solutionSteps: [
          ...(prepSteps.length > 0 ? [`<strong>1.</strong> Prepare the equation:<br>${prepSteps[0]}`] : []),
          `<strong>${prepSteps.length > 0 ? '2' : '1'}.</strong> Differentiate to find $\\frac{dy}{dx}$:`,
          `$\\frac{dy}{dx} = ${diffStr}$`,
          `<strong>${prepSteps.length > 0 ? '3' : '2'}.</strong> Substitute $x = ${x0}$ to find the gradient $m$:`,
          `$m = ${mtStr}$`,
          `<strong>${prepSteps.length > 0 ? '4' : '3'}.</strong> Find the $y$-coordinate at $x = ${x0}$:`,
          `$y = ${y0Str}$`,
          `<strong>${prepSteps.length > 0 ? '5' : '4'}.</strong> Find the equation of the straight line through $(${x0}, ${y0Str})$ with gradient $m = ${mtStr}$:`,
          `$y - ${y0 < 0 ? '(' + y0Str + ')' : y0Str} = ${mtStr}(x - ${x0 < 0 ? '(' + x0 + ')' : x0})$`,
          `$y = ${mtStr}x ${cStr}$`
        ],
        finalAnswer: `$y = ${mtStr}x ${cStr === '+ 0' ? '' : cStr}$`
      };
    }
  }

  if (actualTopic === "Derived graphs") {
    // Describe the derived graph!
    const isLine = Math.random() < 0.3;
    const isParabola = Math.random() < 0.7;

    if (isLine) {
      const root = getRandomInt(-5, 5);
      const isPos = Math.random() < 0.5;
      return {
        subTopic: actualTopic,
        questionLines: [
          `The function $f(x)$ is a quadratic with a turning point at $x = ${root}$. The ${isPos ? 'minimum' : 'maximum'} turning point is the only turning point.`,
          `Describe the derived graph $y = f'(x)$.`
        ],
        boardQuestionLines: [
          `$f(x)$ is a quadratic with a ${isPos ? 'minimum' : 'maximum'} TP at $x = ${root}$.`,
          `Describe $y = f'(x)$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> The derived graph for a quadratic is a straight line.`,
          `<strong>2.</strong> At a turning point, the derivative is zero, so the derived graph passes through the $x$-axis at $x = ${root}$.`,
          `<strong>3.</strong> A ${isPos ? 'minimum' : 'maximum'} turning point goes from ${isPos ? 'negative' : 'positive'} gradient to ${isPos ? 'positive' : 'negative'} gradient.`,
          `<strong>4.</strong> Thus, the derived graph goes from ${isPos ? 'below' : 'above'} the $x$-axis to ${isPos ? 'above' : 'below'} the $x$-axis.`
        ],
        finalAnswer: `Straight line through $x = ${root}$ with a ${isPos ? 'positive' : 'negative'} gradient.`
      };
    }

    const r1 = getRandomInt(-4, 0);
    const r2 = getRandomInt(1, 5);
    const isPos = Math.random() < 0.5;

    return {
      subTopic: actualTopic,
      questionLines: [
        `The graph of a cubic function $f(x)$ has a ${isPos ? 'maximum' : 'minimum'} turning point at $x = ${r1}$ and a ${!isPos ? 'maximum' : 'minimum'} turning point at $x = ${r2}$.`,
        `Describe the key features of the derived graph $y = f'(x)$.`
      ],
      boardQuestionLines: [
        `$f(x)$ has a ${isPos ? 'max' : 'min'} TP at $x = ${r1}$ and a ${!isPos ? 'max' : 'min'} TP at $x = ${r2}$.`,
        `Describe the key features of $y = f'(x)$.`
      ],
      solutionSteps: [
        `<strong>1.</strong> The derived graph of a cubic has the shape of a parabola.`,
        `<strong>2.</strong> Turning points of $f(x)$ occur where $f'(x) = 0$, so the derived graph has roots at $x = ${r1}$ and $x = ${r2}$.`,
        `<strong>3.</strong> Determine the gradient between turning points. From $x = ${r1}$ (${isPos ? 'max' : 'min'}) to $x = ${r2}$ (${!isPos ? 'max' : 'min'}), the function goes ${isPos ? 'down' : 'up'}, so the gradient is ${isPos ? 'negative' : 'positive'}.`,
        `<strong>4.</strong> Thus, the parabola must be ${isPos ? 'below' : 'above'} the $x$-axis between these roots. This makes it a ${isPos ? 'positive (U-shaped)' : 'negative (n-shaped)'} parabola.`
      ],
      finalAnswer: `${isPos ? 'U-shaped' : 'n-shaped'} parabola with roots at $x = ${r1}$ and $x = ${r2}$.`
    };
  }

  if (actualTopic === "Trigonometric differentiation") {
    const isSin = Math.random() > 0.5;
    const a = getRandomInt(2, 6);
    const b = getRandomInt(2, 4);
    
    const angles = [
      { text: '\\frac{\\pi}{6}' },
      { text: '\\frac{\\pi}{4}' },
      { text: '\\frac{\\pi}{3}' }
    ];
    
    const angle = angles[Math.floor(Math.random() * angles.length)];
    const x0Text = angle.text;
    
    const derivativeFunc = isSin ? '\\cos' : '\\sin';
    const sign = isSin ? '' : '-';
    
    return {
      subTopic: actualTopic,
      questionLines: [
        `Given $f(x) = ${a}\\${isSin ? 'sin' : 'cos'}(${b}x)$, evaluate $f'\\left(${x0Text}\\right)$.`
      ],
      boardQuestionLines: [
        `Evaluate $f'\\left(${x0Text}\\right)$ for:`,
        `$f(x) = ${a}\\${isSin ? 'sin' : 'cos'}(${b}x)$`
      ],
      solutionSteps: [
        `<strong>1.</strong> Differentiate using the chain rule:`,
        `$f'(x) = ${sign}${a * b}\\${derivativeFunc.replace('\\\\', '\\')}(${b}x)$`,
        `<strong>2.</strong> Substitute $x = ${x0Text}$:`,
        `$f'\\left(${x0Text}\\right) = ${sign}${a * b}\\${derivativeFunc.replace('\\\\', '\\')}\\left(${b} \\times ${x0Text}\\right)$`
      ],
      finalAnswer: `$f'\\left(${x0Text}\\right) = ${sign}${a * b}\\left(${derivativeFunc.replace('\\\\', '\\')}\\left(${x0Text.replace('pi', b + '\\pi')}\\right)\\right)$`
    };
  }

  if (actualTopic === "Chain rule") {
    const type = getRandomInt(0, 4);
    
    if (type === 0) {
      // y = (ax + b)^n OR y = (ax + b)^(m/n)
      const a = getRandomInt(1, 4);
      const b = getRandomInt(1, 5) * (Math.random() < 0.5 ? 1 : -1);
      const isFractional = Math.random() < 0.3;
      const m = isFractional ? getRandomInt(3, 7) : getRandomInt(3, 5);
      const n2 = isFractional ? getRandomInt(2, 5) : 1;
      
      // ensure irreducible
      const gcd = (x:number, y:number):number => y === 0 ? x : gcd(y, x % y);
      const g = gcd(m, n2);
      const finalM = m / g;
      const finalN = n2 / g;
      const nStr = finalN === 1 ? `${finalM}` : `\\frac{${finalM}}{${finalN}}`;
      
      const inner = `${a===1?'':a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)}`;
      
      let resCoeffNum = finalM * a;
      let resCoeffDen = finalN;
      const gC = gcd(resCoeffNum, resCoeffDen);
      resCoeffNum /= gC;
      resCoeffDen /= gC;
      
      const coeffStr = resCoeffDen === 1 ? `${resCoeffNum}` : `\\frac{${resCoeffNum}}{${resCoeffDen}}`;
      
      const p2Num = finalM - finalN;
      const p2Den = finalN;
      const p2Str = p2Den === 1 ? `${p2Num}` : `\\frac{${p2Num}}{${p2Den}}`;
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Find the derivative of $y = (${inner})^{${nStr}}$.`
        ],
        boardQuestionLines: [
          `Differentiate:`,
          `$y = (${inner})^{${nStr}}$`
        ],
        solutionSteps: [
          `<strong>1.</strong> Apply the chain rule: power comes down, decrease power by 1, and multiply by the derivative of the bracket ($${a}$).`,
          `$\\frac{dy}{dx} = ${nStr}(${inner})^{${p2Str}} \\times (${a})$`,
          `<strong>2.</strong> Simplify:`,
          `$\\frac{dy}{dx} = ${coeffStr}(${inner})^{${p2Str}}$`
        ],
        finalAnswer: `$\\frac{dy}{dx} = ${coeffStr}(${inner})^{${p2Str}}$`
      };
    } else if (type === 1) {
      // y = c / (ax+b)^n or root
      if (Math.random() < 0.5) {
        // a / (x+b)^n
        const c = getRandomInt(2, 5);
        const a = getRandomInt(1, 3);
        const b = getRandomInt(1, 4) * (Math.random() < 0.5 ? 1 : -1);
        const n = getRandomInt(2, 4);
        const inner = `${a===1?'':a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)}`;
        return {
          subTopic: actualTopic,
          questionLines: [
            `Find the derivative of $f(x) = \\frac{${c}}{(${inner})^${n}}$.`,
            `Leave your answer with positive indices.`
          ],
          boardQuestionLines: [
            `Differentiate (leave with positive indices):`,
            `$f(x) = \\frac{${c}}{(${inner})^${n}}$`
          ],
          solutionSteps: [
            `<strong>1.</strong> Prepare the expression with negative indices:`,
            `$f(x) = ${c}(${inner})^{-${n}}$`,
            `<strong>2.</strong> Apply the chain rule:`,
            `$f'(x) = -${c * n}(${inner})^{-${n + 1}} \\times (${a})$`,
            `$f'(x) = -${c * n * a}(${inner})^{-${n + 1}}$`,
            `<strong>3.</strong> Express with positive indices:`,
            `$f'(x) = -\\frac{${c * n * a}}{(${inner})^{${n + 1}}}$`
          ],
          finalAnswer: `$f'(x) = -\\frac{${c * n * a}}{(${inner})^{${n + 1}}}$`
        };
      } else {
        // sqrt(ax + b)
        const a = getRandomInt(2, 5);
        const b = getRandomInt(1, 4) * (Math.random() < 0.5 ? 1 : -1);
        const inner = `${a===1?'':a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)}`;
        let fracA = a % 2 === 0 ? `${a / 2}` : `\\frac{${a}}{2}`;
        if (fracA === '1') fracA = '';
        return {
          subTopic: actualTopic,
          questionLines: [
            `Find the derivative of $y = \\sqrt{${inner}}$.`,
            `Leave your answer with positive indices.`
          ],
          boardQuestionLines: [
            `Differentiate (leave with positive indices):`,
            `$y = \\sqrt{${inner}}$`
          ],
          solutionSteps: [
            `<strong>1.</strong> Prepare the expression with fractional indices:`,
            `$y = (${inner})^{\\frac{1}{2}}$`,
            `<strong>2.</strong> Apply the chain rule:`,
            `$\\frac{dy}{dx} = \\frac{1}{2}(${inner})^{-\\frac{1}{2}} \\times (${a})$`,
            `$\\frac{dy}{dx} = \\frac{${a}}{2}(${inner})^{-\\frac{1}{2}}$`,
            `<strong>3.</strong> Express with positive indices/surds:`,
            `$\\frac{dy}{dx} = \\frac{${a}}{2\\sqrt{${inner}}}$`
          ],
          finalAnswer: `$\\frac{dy}{dx} = \\frac{${a}}{2\\sqrt{${inner}}}$`
        };
      }
    } else if (type === 2) {
      // trig
      if (Math.random() < 0.5) {
        // y = a cos^3 x
        const c = getRandomInt(1, 4);
        const isSin = Math.random() < 0.5;
        const fn = isSin ? '\\sin' : '\\cos';
        const d_fn = isSin ? '\\cos x' : '-\\sin x';
        const n = getRandomInt(2, 4);
        
        return {
          subTopic: actualTopic,
          questionLines: [
            `Find the derivative of $y = ${c===1?'':c}${fn}^${n} x$.`
          ],
          boardQuestionLines: [
            `Differentiate:`,
            `$y = ${c===1?'':c}${fn}^${n} x$`
          ],
          solutionSteps: [
            `<strong>1.</strong> Think of the expression as $y = ${c===1?'':c}(${fn} x)^${n}$.`,
            `<strong>2.</strong> Apply the chain rule:`,
            `$\\frac{dy}{dx} = ${c * n}(${fn} x)^{${n - 1}} \\times (${d_fn})$`,
            `<strong>3.</strong> Simplify:`,
            `$\\frac{dy}{dx} = ${!isSin ? '-' : ''}${c * n}${fn}${n-1===1?'':'^'+(n-1)} x ${isSin ? '\\cos x' : '\\sin x'}$`
          ],
          finalAnswer: `$\\frac{dy}{dx} = ${!isSin ? '-' : ''}${c * n}${fn}${n-1===1?'':'^'+(n-1)} x ${isSin ? '\\cos x' : '\\sin x'}$`
        };
      } else {
        // y = -cos(2x - pi/3)
        const c = getRandomInt(1, 3) * (Math.random() < 0.5 ? 1 : -1);
        const isSin = Math.random() < 0.5;
        const d_fn_sign = isSin ? '' : '-';
        const d_fn_name = isSin ? '\\cos' : '\\sin';
        const fn_name = isSin ? '\\sin' : '\\cos';
        const a = getRandomInt(2, 5);
        
        const angles = ['\\frac{\\pi}{3}', '\\frac{\\pi}{4}', '\\frac{\\pi}{6}'];
        const angle = angles[Math.floor(Math.random() * angles.length)];
        
        const inner = `${a}x - ${angle}`;
        
        const signProd = (!isSin) ? -1 * c : c;
        const cf = signProd * a;
        
        return {
          subTopic: actualTopic,
          questionLines: [
            `Find the derivative of $y = ${c===1?'':c===-1?'-':c}${fn_name}(${inner})$.`
          ],
          boardQuestionLines: [
            `Differentiate:`,
            `$y = ${c===1?'':c===-1?'-':c}${fn_name}(${inner})$`
          ],
          solutionSteps: [
            `<strong>1.</strong> The derivative of $${fn_name}(u)$ is $${d_fn_sign}${d_fn_name}(u) \\times u'$.`,
            `<strong>2.</strong> Here $u = ${inner}$, so $u' = ${a}$.`,
            `<strong>3.</strong> Apply chain rule:`,
            `$\\frac{dy}{dx} = ${c===1?'':c===-1?'-':c}(${d_fn_sign}${d_fn_name}(${inner})) \\times ${a}$`,
            `$\\frac{dy}{dx} = ${cf}${d_fn_name}(${inner})$`
          ],
          finalAnswer: `$\\frac{dy}{dx} = ${cf}${d_fn_name}(${inner})$`
        };
      }
    } else {
      // polynomial inside: y = (ax^2 + bx)^n
      const a = getRandomInt(1, 3);
      const b = getRandomInt(1, 4) * (Math.random() < 0.5 ? 1 : -1);
      const n = getRandomInt(2, 4);
      const inner = `${a===1?'':a}x^2 ${b > 0 ? '+' : '-'} ${Math.abs(b)}x`;
      const inner_d = `${2*a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)}`;
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Find the derivative of $y = (${inner})^${n}$.`
        ],
        boardQuestionLines: [
          `Differentiate:`,
          `$y = (${inner})^${n}$`
        ],
        solutionSteps: [
          `<strong>1.</strong> Apply the chain rule: multiply by power, decrease power by 1, multiply by derivative of bracket.`,
          `$\\frac{dy}{dx} = ${n}(${inner})^{${n - 1}} \\times (${inner_d})$`,
          `<strong>2.</strong> Simplify:`,
          `$\\frac{dy}{dx} = ${n}(${inner_d})(${inner})^{${n - 1}}$`
        ],
        finalAnswer: `$\\frac{dy}{dx} = ${n}(${inner_d})(${inner})^{${n - 1}}$`
      };
    }
  }
  
  if (actualTopic === "Stationary points") {
    const isBox = Math.random() < 0.15;
    const isClosedInt = Math.random() < 0.15;

    if (isBox) {
      // standard box problem: open top box, x by y, depth h
      // Let's use exactly the same structure, different area.
      // Area = x(2x) + 2(xh) + 2(2xh) = 2x^2 + 6xh = A => h = (A - 2x^2)/6x
      // V = 2x^2 * h = 2x^2(A - 2x^2)/6x = (A/3)x - (2/3)x^3
      // dV/dx = A/3 - 2x^2 = 0 => x^2 = A/6 => A must be multiple of 6, and A/6 a perfect square.
      // A = 6 * x^2. If x=2, A=24. x=3, A=54. x=4, A=96. x=5, A=150. x=6, A=216.
      const xVals = [2, 3, 4, 5, 6, 8, 10];
      const max_x = xVals[Math.floor(Math.random() * xVals.length)];
      const A = 6 * max_x * max_x;
      const v_x = A / 3;
      
      const max_V = v_x * max_x - (2/3) * max_x * max_x * max_x;
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `An open top box measures $x$ cm by $2x$ cm and has a depth of $h$ cm.`,
          `The outer surface has an area of $${A}\\text{ cm}^2$.`,
          `(a) Show that the volume of the cuboid is given by $V(x) = ${v_x}x - \\frac{2}{3}x^3$.`,
          `(b) Find the value of $x$ for which the volume is a maximum and calculate the volume.`
        ],
        boardQuestionLines: [
          `Open box: $x$ by $2x$ by $h$. Surface area $= ${A}$.`,
          `(a) Show $V(x) = ${v_x}x - \\frac{2}{3}x^3$.`,
          `(b) Find max volume and $x$ value.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Write an expression for the surface area: Area $= 2x^2 + 6xh = ${A}$.`,
          `<strong>2.</strong> Solve for $h$: $h = \\frac{${A} - 2x^2}{6x}$.`,
          `<strong>3.</strong> Substitute $h$ into Volume formula $V = 2x^2h$:`,
          `$V = 2x^2\\left(\\frac{${A} - 2x^2}{6x}\\right) = \\frac{1}{3}x(${A} - 2x^2) = ${v_x}x - \\frac{2}{3}x^3$.`,
          `<strong>4.</strong> For maximum volume, find $x$ where $V'(x) = 0$:`,
          `$V'(x) = ${v_x} - 2x^2 = 0 \\implies 2x^2 = ${v_x} \\implies x^2 = ${max_x * max_x}$.`,
          `<strong>5.</strong> Since $x > 0$, $x = ${max_x}$.`,
          `<strong>6.</strong> Substitute $x = ${max_x}$ into $V(x)$:<br>$V(${max_x}) = ${v_x}(${max_x}) - \\frac{2}{3}(${max_x})^3 = ${max_V}$.`
        ],
        finalAnswer: `(a) Proof<br>(b) $x = ${max_x}$, Max $V = ${max_V}$`
      };
    }

    if (isClosedInt) {
      // Find max and min values of f(x) on generic interval [0, a]
      // Let's use f(x) = x(x^2 - c) = x^3 - cx
      // f'(x) = 3x^2 - c = 0 => x^2 = c/3 => c must be multiple of 3.
      // let x = 1 => c=3 => f(x) = x^3 - 3x.
      // let x = 2 => c=12 => f(x) = x^3 - 12x.
      const rs = [1, 2, 3, 4];
      const r = rs[Math.floor(Math.random() * rs.length)];
      const c = 3 * r * r;
      const interMax = r + getRandomInt(1, 3);
      
      const v0 = 0;
      const vr = r * r * r - c * r;
      const vi = interMax * interMax * interMax - c * interMax;
      
      const maxVal = Math.max(v0, vr, vi);
      const minVal = Math.min(v0, vr, vi);
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `A function $f$ is defined by $f(x) = x(x^2 - ${c})$, where $0 \\le x \\le ${interMax}$.`,
          `Find the maximum and minimum values of $f$.`
        ],
        boardQuestionLines: [
          `$f(x) = x(x^2 - ${c})$ for $0 \\le x \\le ${interMax}$.`,
          `Find maximum and minimum values.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Expand the function: $f(x) = x^3 - ${c}x$.`,
          `<strong>2.</strong> Find the stationary points by setting $f'(x) = 0$:`,
          `$f'(x) = 3x^2 - ${c} = 0 \\implies x^2 = ${r*r} \\implies x = \\pm ${r}$.`,
          `<strong>3.</strong> Check the values of $f(x)$ at the stationary point $x = ${r}$ (since $-${r}$ is outside interval) and endpoints $x=0$, $x=${interMax}$:`,
          `$f(0) = 0$`,
          `$f(${r}) = (${r})^3 - ${c}(${r}) = ${vr}$`,
          `$f(${interMax}) = (${interMax})^3 - ${c}(${interMax}) = ${vi}$`,
          `<strong>4.</strong> The maximum is ${maxVal} and the minimum is ${minVal}.`
        ],
        finalAnswer: `Maximum: $${maxVal}$, Minimum: $${minVal}$`
      };
    }
    
    const isQuartic = Math.random() < 0.15;
    if (isQuartic) {
      const a = getRandomInt(1, 3) * (Math.random() < 0.5 ? 1 : -1);
      const r = getRandomInt(1, 4);
      const b = -2 * a * r * r;
      const aStr = a === 1 ? '' : a === -1 ? '-' : a;
      const bStr = b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
      const poly = `${aStr}x^4 ${bStr}x^2`;
      
      const v0 = 0;
      const vr = a * Math.pow(r, 4) + b * Math.pow(r, 2);
      const vm_r = v0; // It's even function, symmetric! Wait, vm_r = vr!
      
      const sec_0 = 2 * b;
      const sec_r = 12 * a * r * r + 2 * b;
      
      const nat0 = sec_0 > 0 ? 'minimum' : (sec_0 < 0 ? 'maximum' : 'point of inflection');
      const natr = sec_r > 0 ? 'minimum' : (sec_r < 0 ? 'maximum' : 'point of inflection');
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Find the coordinates and determine the nature of the stationary points of $y = ${poly}$.`
        ],
        boardQuestionLines: [
          `Find and justify the stationary points of:`,
          `$y = ${poly}$`
        ],
        solutionSteps: [
          `<strong>1.</strong> Differentiate to find $\\frac{dy}{dx}$:`,
          `$\\frac{dy}{dx} = ${4*a}x^3 ${2*b > 0 ? '+' : '-'} ${Math.abs(2*b)}x$`,
          `<strong>2.</strong> Set $\\frac{dy}{dx} = 0$ for stationary points:`,
          `$${4*a}x(x^2 - ${r*r}) = 0$`,
          `$x = 0$ or $x = \\pm ${r}$`,
          `<strong>3.</strong> Find the corresponding $y$-coordinates:`,
          `At $x = 0$, $y = 0$`,
          `At $x = \\pm ${r}$, $y = ${vr}$`,
          `<strong>4.</strong> Check the nature using the second derivative or a nature table:`,
          `$\\frac{d^2y}{dx^2} = ${12*a}x^2 ${2*b > 0 ? '+' : '-'} ${Math.abs(2*b)}$`,
          `At $x = 0$, $\\frac{d^2y}{dx^2} = ${sec_0}$ $\\implies$ ${nat0}`,
          `At $x = \\pm ${r}$, $\\frac{d^2y}{dx^2} = ${sec_r}$ $\\implies$ ${natr}`
        ],
        finalAnswer: `$(0, 0)$ is a ${nat0}.<br>$(\\pm ${r}, ${vr})$ are ${natr}s.`
      };
    }

    const rs = [[0, 2], [-4, -2], [-3, 1], [-2, 3], [-1, 2]];
    const [rt1, rt2] = rs[Math.floor(Math.random() * rs.length)];
    
    // So f'(x) = 3(x-rt1)(x-rt2) OR 6(x-rt1)(x-rt2)
    const mult = Math.random() < 0.4 ? 6 : (Math.random() < 0.5 ? 3 : -3);
    const k = mult; 
    
    const c3 = k / 3;
    const c2 = -k * (rt1 + rt2) / 2;
    const c1 = k * rt1 * rt2;
    const c0 = getRandomInt(-20, 20);
    
    const poly = `${c3===1?'':c3===-1?'-':c3}x^3 ${c2 > 0 ? '+' : ''}${c2 === 0 ? '' : c2 + 'x^2'} ${c1 > 0 ? '+' : ''}${c1 === 0 ? '' : c1 + 'x'} ${c0 > 0 ? '+' : ''}${c0 === 0 ? '' : c0}`;
    
    const val1 = c3 * rt1 * rt1 * rt1 + c2 * rt1 * rt1 + c1 * rt1 + c0;
    const val2 = c3 * rt2 * rt2 * rt2 + c2 * rt2 * rt2 + c1 * rt2 + c0;
    
    // derivative = kx^2 - k(rt1+rt2)x + k*rt1*rt2
    // second derivative = 2kx - k(rt1+rt2) = k(2x - (rt1+rt2))
    const sec1 = k * (2 * rt1 - (rt1 + rt2));
    const sec2 = k * (2 * rt2 - (rt1 + rt2));
    
    const nat1 = sec1 > 0 ? 'minimum' : (sec1 < 0 ? 'maximum' : 'point of inflection');
    const nat2 = sec2 > 0 ? 'minimum' : (sec2 < 0 ? 'maximum' : 'point of inflection');

    return {
      subTopic: actualTopic,
      questionLines: [
        `Find the coordinates and determine the nature of the stationary points of $y = ${poly}$.`
      ],
      boardQuestionLines: [
        `Find and justify the stationary points of:`,
        `$y = ${poly}$`
      ],
      solutionSteps: [
        `<strong>1.</strong> Differentiate to find $\\frac{dy}{dx}$:`,
        `$\\frac{dy}{dx} = ${k}x^2 ${-k*(rt1+rt2) > 0 ? '+' : ''}${-k*(rt1+rt2) === 0 ? '' : -k*(rt1+rt2) + 'x'} ${c1 > 0 ? '+' : ''}${c1 === 0 ? '' : c1}$`,
        `<strong>2.</strong> Set $\\frac{dy}{dx} = 0$ for stationary points:`,
        `$${k}(x - ${rt1 < 0 ? '('+rt1+')' : rt1})(x - ${rt2 < 0 ? '('+rt2+')' : rt2}) = 0$`,
        `$x = ${rt1}$ or $x = ${rt2}$`,
        `<strong>3.</strong> Find the corresponding $y$-coordinates:`,
        `At $x = ${rt1}$, $y = ${val1}$`,
        `At $x = ${rt2}$, $y = ${val2}$`,
        `<strong>4.</strong> Check the nature using the second derivative or a nature table:`,
        `$\\frac{d^2y}{dx^2} = ${2*k}x ${-k*(rt1+rt2) > 0 ? '+' : ''}${-k*(rt1+rt2) === 0 ? '' : -k*(rt1+rt2)}$`,
        `At $x = ${rt1}$, $\\frac{d^2y}{dx^2} = ${sec1}$ $\\implies$ ${nat1}`,
        `At $x = ${rt2}$, $\\frac{d^2y}{dx^2} = ${sec2}$ $\\implies$ ${nat2}`
      ],
      finalAnswer: `$(${rt1}, ${val1})$ is a ${nat1}.<br>$(${rt2}, ${val2})$ is a ${nat2}.`
    };
  }

  if (actualTopic === "Optimisation") {
    const side = getRandomInt(3, 6);
    const vol = side * side * side;
    
    return {
      subTopic: actualTopic,
      questionLines: [
        `Find the dimensions of a square-based cuboid with volume $${vol}$ cm$^3$ and minimum surface area.`
      ],
      boardQuestionLines: [
        `Square-based cuboid, Volume = $${vol}$`,
        `Find dimensions for minimum surface area.`
      ],
      solutionSteps: [
        `<strong>1.</strong> Let $x$ be length and breadth, $h$ be height. Surface area $A = 2x^2 + 4xh$. Volume $x^2h = ${vol} \\implies h = \\frac{${vol}}{x^2}$.`,
        `<strong>2.</strong> Substitute $h$ into $A$:`,
        `$A = 2x^2 + 4x\\left(\\frac{${vol}}{x^2}\\right) = 2x^2 + \\frac{${4*vol}}{x} = 2x^2 + ${4*vol}x^{-1}$`,
        `<strong>3.</strong> Differentiate to find turning points:`,
        `$\\frac{dA}{dx} = 4x - ${4*vol}x^{-2} = 4x - \\frac{${4*vol}}{x^2}$`,
        `<strong>4.</strong> Set derivative to zero:`,
        `$4x - \\frac{${4*vol}}{x^2} = 0 \\implies 4x^3 = ${4*vol} \\implies x^3 = ${vol} \\implies x = ${side}$`,
        `<strong>5.</strong> Verify it is a minimum using a nature table (derivative goes from - to +), then find height $h$:`,
        `$h = \\frac{${vol}}{${side}^2} = ${side}$`
      ],
      finalAnswer: `$${side}$ cm by $${side}$ cm by $${side}$ cm`
    };
  }

  return {
    subTopic: actualTopic,
    questionLines: ["Missing differentiation question"],
    boardQuestionLines: ["Missing"],
    solutionSteps: ["Error"],
    finalAnswer: "Error"
  };
}

