import { getRandomInt, nonZeroInt, Point, formatNum, gcd, simplifyFraction, formatFraction, formatFractionWithSub, formatTerm, formatEquation, generateTriangle } from "./utils";
import { GeneratedQuestion, Topic, TOPIC_GROUPS } from "./types";

export function generateIntegrationQuestion(selectedTopic: string): Omit<GeneratedQuestion, "topic"> {
  const topics = TOPIC_GROUPS["Integration"];
  let type = topics.indexOf(selectedTopic as Topic);
  if (type === -1) type = Math.floor(Math.random() * topics.length);
  const actualTopic = topics[type];

  if (actualTopic === "Simple indefinite integration") {
    const a = getRandomInt(2, 6) * 2;
    const p1 = getRandomInt(3, 5); // x^(p1/2) 
    const b = getRandomInt(2, 5);
    const p2 = getRandomInt(2, 4); // x^-p2
    const c = getRandomInt(1, 5);

    const term1_prep = `${a}x^{\\frac{${p1}}{2}}`;
    const term2_prep = `- ${b}x^{-${p2}}`;
    const term3_prep = `+ ${c}`;
    
    // Int(ax^{p1/2}) = a / (p1/2+1) x^(p1/2+1) = a / ((p1+2)/2) x^{(p1+2)/2} = 2a/(p1+2) x^{(p1+2)/2}
    const num1 = 2 * a;
    const den1 = p1 + 2;
    const gcd1 = (x:number, y:number):number => y === 0 ? x : gcd1(y, x % y);
    const g1 = gcd1(Math.abs(num1), Math.abs(den1));
    const finalNum1 = num1/g1;
    const finalDen1 = den1/g1;
    const frac1 = finalDen1 === 1 ? `${finalNum1}` : `\\frac{${finalNum1}}{${finalDen1}}`;

    const num2 = -b;
    const den2 = -p2 + 1; // den2 < 0 since p2 >= 2
    const g2 = gcd1(Math.abs(num2), Math.abs(den2));
    const finalNum2 = Math.abs(num2/g2);
    const finalDen2 = Math.abs(den2/g2);

    const sign2 = (num2/den2) > 0 ? '+' : '-';
    // const frac2 = finalDen2 === 1 ? `${finalNum2}` : `\\frac{${finalNum2}}{${finalDen2}}`;
    const term2_final = `${sign2} ${finalDen2 === 1 ? finalNum2 : '\\frac{'+finalNum2+'}{'+finalDen2+'}'}x^{-${p2-1}}`;

    return {
      subTopic: actualTopic,
      questionLines: [
        `Find $\\int\\left(${a}\\sqrt{x^{${p1}}} - \\frac{${b}}{x^{${p2}}} + ${c}\\right)\\,dx$`
      ],
      boardQuestionLines: [
        `Integrate:`,
        `$\\int\\left(${a}\\sqrt{x^{${p1}}} - \\frac{${b}}{x^{${p2}}} + ${c}\\right)\\,dx$`
      ],
      solutionSteps: [
        `<strong>1.</strong> Prepare for integration:`,
        `$\\int\\left(${term1_prep} ${term2_prep} ${term3_prep}\\right)\\,dx$`,
        `<strong>2.</strong> Integrate term-by-term:`,
        `$= \\frac{${a}x^{\\frac{${p1+2}}{2}}}{\\frac{${p1+2}}{2}} - \\frac{${b}x^{-${p2-1}}}{-${p2-1}} + ${c}x + c$`,
        `<strong>3.</strong> Simplify:`,
        `$= ${frac1}x^{\\frac{${p1+2}}{2}} ${term2_final} + ${c}x + c$`
      ],
      finalAnswer: `$${frac1}x^{\\frac{${p1+2}}{2}} ${term2_final} + ${c}x + c$`
    };
  }

  if (actualTopic === "Simple definite integration") {
    const type = getRandomInt(0, 2);
    
    if (type === 0) {
      // poly: \int_lower^upper a (x - c) dx or similar
      const a = getRandomInt(2, 5);
      const b = getRandomInt(2, 4);
      const lower = getRandomInt(0, 2);
      const upper = getRandomInt(3, 4);
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Evaluate $\\int^{${upper}}_{${lower}}\\left(${a+1}x^{${a}} - ${b+1}x^{${b}}\\right)\\,dx$`
        ],
        boardQuestionLines: [
          `Evaluate:`,
          `$\\int^{${upper}}_{${lower}}\\left(${a+1}x^{${a}} - ${b+1}x^{${b}}\\right)\\,dx$`
        ],
        solutionSteps: [
          `<strong>1.</strong> Integrate the terms:`,
          `$\\left[x^{${a+1}} - x^{${b+1}}\\right]^{${upper}}_{${lower}}$`,
          `<strong>2.</strong> Substitute limits:`,
          `$\\left(${upper}^{${a+1}} - ${upper}^{${b+1}}\\right) - \\left(${lower}^{${a+1}} - ${lower}^{${b+1}}\\right)$`,
          `<strong>3.</strong> Evaluate:`,
          `$\\left(${Math.pow(upper, a+1)} - ${Math.pow(upper, b+1)}\\right) - \\left(${Math.pow(lower, a+1)} - ${Math.pow(lower, b+1)}\\right)$`,
          `$(${Math.pow(upper, a+1) - Math.pow(upper, b+1)}) - (${Math.pow(lower, a+1) - Math.pow(lower, b+1)})$`,
          `$= ${Math.pow(upper, a+1) - Math.pow(upper, b+1) - (Math.pow(lower, a+1) - Math.pow(lower, b+1))}$`
        ],
        finalAnswer: `$${Math.pow(upper, a+1) - Math.pow(upper, b+1) - (Math.pow(lower, a+1) - Math.pow(lower, b+1))}$`
      };
    } else if (type === 1) {
      // chain rule: \int_1^2 (ax - 1)^3 dx
      const a = getRandomInt(2, 4);
      const n = getRandomInt(2, 3);
      const lower = getRandomInt(-1, 1);
      const upper = lower + 1;
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Evaluate $\\int^{${upper}}_{${lower}} (${a}x - 1)^${n}\\,dx$`
        ],
        boardQuestionLines: [
          `Evaluate:`,
          `$\\int^{${upper}}_{${lower}} (${a}x - 1)^${n}\\,dx$`
        ],
        solutionSteps: [
          `<strong>1.</strong> Integrate using the chain rule:`,
          `$\\left[\\frac{(${a}x - 1)^{${n+1}}}{${a} \\times ${n+1}}\\right]^{${upper}}_{${lower}} = \\left[\\frac{(${a}x - 1)^{${n+1}}}{${a*(n+1)}}\\right]^{${upper}}_{${lower}}$`,
          `<strong>2.</strong> Substitute limits:`,
          `$= \\left(\\frac{(${a*upper - 1})^{${n+1}}}{${a*(n+1)}}\\right) - \\left(\\frac{(${a*lower - 1})^{${n+1}}}{${a*(n+1)}}\\right)$`,
          `$= \\frac{${Math.pow(a*upper - 1, n+1)}}{${a*(n+1)}} - \\frac{${Math.pow(a*lower - 1, n+1)}}{${a*(n+1)}}$`,
          `$= \\frac{${Math.pow(a*upper - 1, n+1) - Math.pow(a*lower - 1, n+1)}}{${a*(n+1)}}$`
        ],
        finalAnswer: `$\\frac{${Math.pow(a*upper - 1, n+1) - Math.pow(a*lower - 1, n+1)}}{${a*(n+1)}}$`
      };
    } else {
      // Int trig: \int_0^{\pi/6} \sin 2x - \cos 2x dx
      return {
        subTopic: actualTopic,
        questionLines: [
          `Evaluate $\\int^{\\frac{\\pi}{6}}_{0} (\\sin 2x - \\cos 2x)\\,dx$`
        ],
        boardQuestionLines: [
          `Evaluate:`,
          `$\\int^{\\frac{\\pi}{6}}_{0} (\\sin 2x - \\cos 2x)\\,dx$`
        ],
        solutionSteps: [
          `<strong>1.</strong> Integrate the terms:`,
          `$\\left[ -\\frac{1}{2}\\cos 2x - \\frac{1}{2}\\sin 2x \\right]^{\\frac{\\pi}{6}}_{0}$`,
          `<strong>2.</strong> Substitute limits:`,
          `$= \\left( -\\frac{1}{2}\\cos\\left(\\frac{\\pi}{3}\\right) - \\frac{1}{2}\\sin\\left(\\frac{\\pi}{3}\\right) \\right) - \\left( -\\frac{1}{2}\\cos(0) - \\frac{1}{2}\\sin(0) \\right)$`,
          `<strong>3.</strong> Evaluate trig functions: $\\cos(\\frac{\\pi}{3}) = \\frac{1}{2}$, $\\sin(\\frac{\\pi}{3}) = \\frac{\\sqrt{3}}{2}$, $\\cos(0) = 1$, $\\sin(0) = 0$`,
          `$= \\left( -\\frac{1}{4} - \\frac{\\sqrt{3}}{4} \\right) - \\left( -\\frac{1}{2} - 0 \\right) = \\frac{1}{4} - \\frac{\\sqrt{3}}{4}$`,
          `$= \\frac{1 - \\sqrt{3}}{4}$`
        ],
        finalAnswer: `$\\frac{1 - \\sqrt{3}}{4}$`
      };
    }
  }

  if (actualTopic === "Integration using the chain rule") {
    const type = getRandomInt(0, 2);
    
    if (type === 0) {
      // Int (ax + b)^n
      const a = getRandomInt(2, 5);
      const b = getRandomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
      const n = getRandomInt(3, 6);
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Find $\\int(${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)})^{${n}}\\,dx$`
        ],
        boardQuestionLines: [
          `Integrate:`,
          `$\\int(${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)})^{${n}}\\,dx$`
        ],
        solutionSteps: [
          `<strong>1.</strong> Use the chain rule for integration (raise power by $1$, divide by new power and derivative of bracket):`,
          `$\\frac{(${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)})^{${n+1}}}{(${n+1})(${a})} + C$`,
          `<strong>2.</strong> Simplify:`,
          `$= \\frac{(${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)})^{${n+1}}}{${a*(n+1)}} + C$`
        ],
        finalAnswer: `$\\frac{1}{${a*(n+1)}}(${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)})^{${n+1}} + C$`
      };
    } else if (type === 1) {
      // Int c / (ax + b)^n
      const a = getRandomInt(2, 5);
      const b = getRandomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
      const n = getRandomInt(2, 4);
      const c = getRandomInt(2, 6);
      
      const newPow = -n + 1;
      const den = newPow * a;
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Find $\\int \\frac{${c}}{(${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)})^${n}}\\,dx$`
        ],
        boardQuestionLines: [
          `Integrate:`,
          `$\\int \\frac{${c}}{(${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)})^${n}}\\,dx$`
        ],
        solutionSteps: [
          `<strong>1.</strong> Prepare the expression with a negative index:`,
          `$= \\int ${c}(${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)})^{-${n}}\\,dx$`,
          `<strong>2.</strong> Integrate (raise power by 1, divide by new power and derivative of bracket):`,
          `$= ${c} \\frac{(${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)})^{${newPow}}}{(${newPow})(${a})} + C$`,
          `<strong>3.</strong> Simplify and rewrite with positive indices:`,
          `$= \\frac{${c}}{${den}} (${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)})^{${newPow}} + C = ${den < 0 ? '-' : ''}\\frac{${Math.abs(c)}}{${Math.abs(den)}(${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)})^${Math.abs(newPow)}} + C$`
        ],
        finalAnswer: `$${den < 0 ? '-' : ''}\\frac{${Math.abs(c)}}{${Math.abs(den)}(${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)})^${Math.abs(newPow)}} + C$`
      };
    } else {
      // fractional
      const a = getRandomInt(2, 4);
      const b = getRandomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
      
      // root(ax + b) => power 1/2
      return {
        subTopic: actualTopic,
        questionLines: [
          `Find $\\int \\sqrt{${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)}}\\:dx$`
        ],
        boardQuestionLines: [
          `Integrate:`,
          `$\\int \\sqrt{${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)}}\\:dx$`
        ],
        solutionSteps: [
          `<strong>1.</strong> Prepare with a fractional index:`,
          `$= \\int (${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)})^{\\frac{1}{2}}\\,dx$`,
          `<strong>2.</strong> Integrate (raise power to 3/2, divide by 3/2 and derivative of bracket ${a}):`,
          `$= \\frac{(${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)})^{\\frac{3}{2}}}{\\frac{3}{2} \\times ${a}} + C$`,
          `<strong>3.</strong> Simplify:`,
          `$= \\frac{2}{${3 * a}}(${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)})^{\\frac{3}{2}} + C$`
        ],
        finalAnswer: `$\\frac{2}{${3 * a}}(${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)})^{\\frac{3}{2}} + C$`
      };
    }
  }

  if (actualTopic === "Integrating a trigonometric function") {
    const type = getRandomInt(0, 2);
    
    if (type === 0) {
      // Int a sin(bx - c)
      const isSin = Math.random() > 0.5;
      const a = getRandomInt(1, 5);
      const b = getRandomInt(2, 5);
      
      const angles = ['\\frac{\\pi}{3}', '\\frac{\\pi}{4}', '\\frac{\\pi}{6}'];
      const angle = angles[Math.floor(Math.random() * angles.length)];
      
      const sign = isSin ? '-' : '';
      const integrated = isSin ? '\\cos' : '\\sin';
      
      const aStr = a === 1 ? '' : a;
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Find $\\int ${aStr}\\,${isSin ? '\\sin' : '\\cos'}(${b}x - ${angle})\\,dx$`
        ],
        boardQuestionLines: [
          `Integrate:`,
          `$\\int ${aStr}\\,${isSin ? '\\sin' : '\\cos'}(${b}x - ${angle})\\,dx$`
        ],
        solutionSteps: [
          `<strong>1.</strong> Use standard integrals ($\\int \\sin u = -\\cos u$, $\\int \\cos u = \\sin u$) and reverse the chain rule (divide by inner derivative $${b}$):`,
          `$${sign}\\frac{${a}}{${b}}\\,${integrated.replace('\\\\', '\\')}(${b}x - ${angle}) + C$`
        ],
        finalAnswer: `$${sign}\\frac{${a}}{${b}}\\,${integrated.replace('\\\\', '\\')}(${b}x - ${angle}) + C$`
      };
    } else if (type === 1) {
      // Int a cos(cx) - b sin(dx)
      const a = getRandomInt(2, 5);
      const b = getRandomInt(2, 5);
      const c = getRandomInt(2, 4);
      const d = getRandomInt(2, 4);
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Find $\\int (${a}\\cos ${c}x - ${b}\\sin ${d}x)\\,dx$`
        ],
        boardQuestionLines: [
          `Integrate:`,
          `$\\int (${a}\\cos ${c}x - ${b}\\sin ${d}x)\\,dx$`
        ],
        solutionSteps: [
          `<strong>1.</strong> Integrate term by term.`,
          `<strong>2.</strong> $\\int ${a}\\cos ${c}x \\,dx = \\frac{${a}}{${c}}\\sin ${c}x$`,
          `<strong>3.</strong> $\\int -${b}\\sin ${d}x \\,dx = -(-\\frac{${b}}{${d}}\\cos ${d}x) = +\\frac{${b}}{${d}}\\cos ${d}x$`,
          `<strong>4.</strong> Combine terms:`,
          `$= \\frac{${a}}{${c}}\\sin ${c}x + \\frac{${b}}{${d}}\\cos ${d}x + C$`
        ],
        finalAnswer: `$\\frac{${a}}{${c}}\\sin ${c}x + \\frac{${b}}{${d}}\\cos ${d}x + C$`
      };
    } else {
      // apply cos^2 x = 1/2 cos 2x + 1/2
      const a = getRandomInt(2, 5);
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `(a) Use the double angle formula $\\cos 2x = 2\\cos^2 x - 1$ to show that $\\cos^2 x = \\frac{1}{2}\\cos 2x + \\frac{1}{2}$.`,
          `(b) Hence find $\\int ${a}\\cos^2 x \\,dx$.`
        ],
        boardQuestionLines: [
          `(a) Show $\\cos^2 x = \\frac{1}{2}\\cos 2x + \\frac{1}{2}$.`,
          `(b) Hence find $\\int ${a}\\cos^2 x \\,dx$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> From $\\cos 2x = 2\\cos^2 x - 1$, add 1 to both sides: $2\\cos^2 x = \\cos 2x + 1$.`,
          `<strong>2.</strong> Divide by 2: $\\cos^2 x = \\frac{1}{2}\\cos 2x + \\frac{1}{2}$. This completes part (a).`,
          `<strong>3.</strong> For (b), substitute this expression into the integral:`,
          `$\\int ${a}\\cos^2 x \\,dx = \\int ${a}\\left(\\frac{1}{2}\\cos 2x + \\frac{1}{2}\\right)\\,dx = \\int \\left(\\frac{${a}}{2}\\cos 2x + \\frac{${a}}{2}\\right)\\,dx$`,
          `<strong>4.</strong> Integrate:`,
          `$= \\frac{${a}}{2 \\times 2}\\sin 2x + \\frac{${a}}{2}x + C = \\frac{${a}}{4}\\sin 2x + \\frac{${a}}{2}x + C$`
        ],
        finalAnswer: `(a) Proof<br>(b) $\\frac{${a}}{4}\\sin 2x + \\frac{${a}}{2}x + C$`
      };
    }
  }

  if (actualTopic === "Differential equations") {
    const type = getRandomInt(0, 3);
    
    if (type === 0) {
      // dy/dx = a x^2 + bx + c
      const a_coeff = getRandomInt(1, 3) * 3;
      const b_coeff = getRandomInt(1, 4) * 2 * (Math.random() > 0.5 ? 1 : -1);
      const c_coeff = getRandomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
      const x0 = getRandomInt(-2, 2);
      
      // y = a/3 x^3 + b/2 x^2 + cx + C
      // substitute to get y0
      const C = getRandomInt(-5, 5);
      const y0 = (a_coeff/3) * Math.pow(x0, 3) + (b_coeff/2) * Math.pow(x0, 2) + c_coeff * x0 + C;
      
      const poly = `${a_coeff}x^2 ${b_coeff > 0 ? '+' : '-'} ${Math.abs(b_coeff)}x ${c_coeff > 0 ? '+' : '-'} ${Math.abs(c_coeff)}`;
      const y_expr = `${a_coeff/3 === 1 ? '' : a_coeff/3 === -1 ? '-' : a_coeff/3}x^3 ${b_coeff/2 > 0 ? '+' : '-'} ${Math.abs(b_coeff/2) === 1 ? '' : Math.abs(b_coeff/2)}x^2 ${c_coeff > 0 ? '+' : '-'} ${Math.abs(c_coeff) === 1 ? '' : Math.abs(c_coeff)}x`;

      const isContext = Math.random() < 0.2;
      const questionStr = isContext ? 
        `The gradient of a tangent to a curve is given by $\\frac{dy}{dx} = ${poly}$. If the curve passes through the point $(${x0}, ${y0})$, find its equation.` : 
        `Find the equation of the curve $y = f(x)$ that satisfies $\\frac{dy}{dx} = ${poly}$, passing through $(${x0}, ${y0})$.`;

      return {
        subTopic: actualTopic,
        questionLines: [questionStr],
        boardQuestionLines: [
          `$\\frac{dy}{dx} = ${poly}$, passes through $(${x0}, ${y0})$.`,
          `Find $y$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Integrate to find $y$:`,
          `$y = \\int(${poly})\\,dx$`,
          `$y = ${y_expr} + C$`,
          `<strong>2.</strong> Substitute $x = ${x0}$ and $y = ${y0}$ to find $C$:`,
          `$${y0} = ${a_coeff/3}(${x0})^3 ${b_coeff/2 > 0 ? '+' : '-'} ${Math.abs(b_coeff/2)}(${x0})^2 ${c_coeff > 0 ? '+' : '-'} ${Math.abs(c_coeff)}(${x0}) + C$`,
          `$${y0} = ${(a_coeff/3)*(x0*x0*x0) + (b_coeff/2)*(x0*x0) + c_coeff*x0} + C$`,
          `$C = ${C}$`,
          `<strong>3.</strong> Write the particular solution:`,
          `$y = ${y_expr} ${C >= 0 ? '+' : '-'} ${Math.abs(C)}$`
        ],
        finalAnswer: `$y = ${y_expr} ${C >= 0 ? '+' : '-'} ${Math.abs(C)}$`
      };
    } else if (type === 1) {
      // kinematics -> ds/dt = a / dt^b + c 
      // let's stick to the v = ds/dt = 9\sqrt{t} - 12
      const isSqrt = Math.random() < 0.6;
      if (isSqrt) {
        let a = getRandomInt(2, 6);
        if (a % 2 !== 0) a++; // a is even
        const coef = (a/2) * 3; // so integration is integral a t^(1/2) dt = a/(3/2) t^(3/2) = (2a/3) t^(3/2)
        // Wait, if a=9, integral 9t^(1/2) dt = 6t^(3/2).
        const coef_t = getRandomInt(1, 4) * 3; 
        const a_val = coef_t; // e.g. 9
        const int_coef = coef_t * 2 / 3; // 6
        const c_val = getRandomInt(1, 5) * 2;
        
        const C = getRandomInt(1, 10);
        const t0 = 0;
        const s0 = C;
        
        return {
          subTopic: actualTopic,
          questionLines: [
            `The velocity of an object is given by $v = \\frac{ds}{dt} = ${a_val}\\sqrt{t} - ${c_val}$, where $s$ is the distance in metres and $t$ is the time in seconds.`,
            `Find an expression for the displacement $s$, given that when $t = ${t0}$, $s = ${s0}$.`
          ],
          boardQuestionLines: [
            `$\\frac{ds}{dt} = ${a_val}\\sqrt{t} - ${c_val}$.`,
            `Find $s$ given $s = ${s0}$ when $t = ${t0}$.`
          ],
          solutionSteps: [
            `<strong>1.</strong> Write the expression with fractional indices:`,
            `$\\frac{ds}{dt} = ${a_val}t^{\\frac{1}{2}} - ${c_val}$`,
            `<strong>2.</strong> Integrate to find $s$:`,
            `$s = \\int(${a_val}t^{\\frac{1}{2}} - ${c_val})\\,dt = \\frac{${a_val}t^{\\frac{3}{2}}}{\\frac{3}{2}} - ${c_val}t + C$`,
            `$s = ${int_coef}t^{\\frac{3}{2}} - ${c_val}t + C$`,
            `<strong>3.</strong> Substitute $t = ${t0}$, $s = ${s0}$:`,
            `$${s0} = 0 - 0 + C \\implies C = ${C}$`,
            `<strong>4.</strong> Final expression (in surd form):`,
            `$s = ${int_coef}\\sqrt{t^3} - ${c_val}t + ${C}$`
          ],
          finalAnswer: `$s = ${int_coef}\\sqrt{t^3} - ${c_val}t + ${C}$`
        };
      } else {
        // dy/dx = a/x^3 -> ax^{-3} -> integral a/-2 x^{-2} + C
        const a = getRandomInt(1, 4) * 2;
        const C = getRandomInt(1, 5);
        const x0 = 1;
        const y0 = (-a/2) * Math.pow(x0, -2) + C;
        
        return {
          subTopic: actualTopic,
          questionLines: [
            `Find the equation of the curve $y = f(x)$ that satisfies $\\frac{dy}{dx} = \\frac{${a}}{x^3}$, passing through $(${x0}, ${y0})$.`
          ],
          boardQuestionLines: [
            `$\\frac{dy}{dx} = \\frac{${a}}{x^3}$, passes $(${x0}, ${y0})$.`,
            `Find $y$.`
          ],
          solutionSteps: [
            `<strong>1.</strong> Prepare the expression: $\\frac{dy}{dx} = ${a}x^{-3}$`,
            `<strong>2.</strong> Integrate:`,
            `$y = \\int ${a}x^{-3}\\,dx = \\frac{${a}x^{-2}}{-2} + C = -${a/2}x^{-2} + C$`,
            `<strong>3.</strong> Substitute $x = ${x0}$, $y = ${y0}$:`,
            `$${y0} = -${a/2}(${x0})^{-2} + C \\implies C = ${C}$`,
            `<strong>4.</strong> Write final answer:`,
            `$y = -\\frac{${a/2}}{x^2} + ${C}$`
          ],
          finalAnswer: `$y = -\\frac{${a/2}}{x^2} + ${C}$`
        };
      }
    } else if (type === 2) {
      // Chain rule integral: f'(x) = a(bx - c)^n 
      const b = getRandomInt(2, 4);
      const n = getRandomInt(2, 3);
      const mult = getRandomInt(1, 3);
      const a = mult * b * (n+1); // to make integer coefficient after division by b*(n+1)
      const int_coef = mult;
      
      const c = getRandomInt(1, 5);
      const x0 = getRandomInt(1, 3);
      
      const C = getRandomInt(1, 10) * (Math.random() < 0.5 ? 1 : -1);
      const y0 = int_coef * Math.pow(b * x0 - c, n+1) + C;

      return {
        subTopic: actualTopic,
        questionLines: [
          `Find the equation of the curve $y = f(x)$ that satisfies $\\frac{dy}{dx} = ${a}(${b}x - ${c})^${n}$, passing through $(${x0}, ${y0})$.`
        ],
        boardQuestionLines: [
          `$\\frac{dy}{dx} = ${a}(${b}x - ${c})^${n}$, passes $(${x0}, ${y0})$.`,
          `Find $y$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Integrate using substitution/chain rule backwards:`,
          `$y = \\int {${a}(${b}x - ${c})^${n}}\\,dx$`,
          `$y = \\frac{${a}}{${b} \\times ${n+1}}(${b}x - ${c})^{${n+1}} + C$`,
          `$y = ${int_coef}(${b}x - ${c})^{${n+1}} + C$`,
          `<strong>2.</strong> Substitute $x = ${x0}$, $y = ${y0}$:`,
          `$${y0} = ${int_coef}(${b}(${x0}) - ${c})^{${n+1}} + C$`,
          `$${y0} = ${int_coef}(${b * x0 - c})^{${n+1}} + C$`,
          `$${y0} = ${int_coef * Math.pow(b * x0 - c, n+1)} + C \\implies C = ${C}$`,
          `<strong>3.</strong> Final equation:`,
          `$y = ${int_coef}(${b}x - ${c})^{${n+1}} ${C >= 0 ? '+' : '-'} ${Math.abs(C)}$`
        ],
        finalAnswer: `$y = ${int_coef}(${b}x - ${c})^{${n+1}} ${C >= 0 ? '+' : '-'} ${Math.abs(C)}$`
      };
    } else {
      // f'(x) = a cos(bx) => f(x) = a/b sin(bx)
      const b = getRandomInt(2, 4);
      const a = getRandomInt(1, 4) * b; // make it nicely divisible
      const int_coef = a / b;
      
      const isSin = Math.random() < 0.5;
      const fn = isSin ? '\\sin' : '\\cos';
      const int_fn = isSin ? '-\\cos' : '\\sin'; // integral of sin is -cos, integral of cos is sin
      
      // Let's use nice angles so the output is rational or exact
      const angles = [
        { text: '\\frac{\\pi}{2}', val: Math.PI / 2 },
        { text: '\\frac{\\pi}{3}', val: Math.PI / 3 }
      ];
      const angle = angles[0]; // let's stick to pi/2 for simplicity
      const C = getRandomInt(1, 5);
      
      let ev = 0;
      if (b === 2) {
        // angle is pi/2, so bx = pi.
        ev = isSin ? -(-1) : 0; // sin is 0. Wait, inside is cx.
        // If isSin=true, f'(x) = a sin(bx). int = -(a/b) cos(bx).
        // x = pi/2, bx = pi. cos(pi) = -1. -(a/b)*(-1) = a/b.
        // If isSin=false, f'(x) = a cos(bx). int = (a/b) sin(bx).
        // x = pi/2, bx = pi. sin(pi) = 0.
      }
      
      const vAtx = isSin ? -int_coef * Math.cos(b * angle.val) : int_coef * Math.sin(b * angle.val);
      const y0 = Math.round(vAtx) + C;

      return {
        subTopic: actualTopic,
        questionLines: [
          `Find $f(x)$ given $f'(x) = ${a}${fn}(${b}x)$ and $f\\left(${angle.text}\\right) = ${y0}$.`
        ],
        boardQuestionLines: [
          `$f'(x) = ${a}${fn}(${b}x)$`,
          `Given $f\\left(${angle.text}\\right) = ${y0}$, find $f(x)$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Integrate $f'(x)$:`,
          `$f(x) = \\int ${a}${fn}(${b}x)\\,dx = ${isSin ? '-' : ''}\\frac{${a}}{${b}}${int_fn.replace('-','')}(${b}x) + C$`,
          `$f(x) = ${isSin ? '-' : ''}${int_coef}${int_fn.replace('-','')}(${b}x) + C$`,
          `<strong>2.</strong> Substitute $x = ${angle.text}$, $f(x) = ${y0}$:`,
          `$${y0} = ${isSin ? '-' : ''}${int_coef}${int_fn.replace('-','')}\\left(${b} \\times ${angle.text}\\right) + C$`,
          `$${y0} = ${Math.round(vAtx)} + C \\implies C = ${C}$`,
          `<strong>3.</strong> Write final answer:`,
          `$f(x) = ${isSin ? '-' : ''}${int_coef}${int_fn.replace('-','')}(${b}x) ${C >= 0 ? '+' : '-'} ${Math.abs(C)}$`
        ],
        finalAnswer: `$f(x) = ${isSin ? '-' : ''}${int_coef}${int_fn.replace('-','')}(${b}x) ${C >= 0 ? '+' : '-'} ${Math.abs(C)}$`
      };
    }
  }

  if (actualTopic === "Area under a curve") {
    // Area of parabola crossing x axis
    // roots r1, r2
    const r1 = getRandomInt(-4, -1);
    const r2 = getRandomInt(1, 4);
    
    // y = - (x-r1)(x-r2) = -x^2 + (r1+r2)x - r1*r2
    const sum = r1+r2;
    const prod = -r1*r2;
    
    const term2 = sum === 0 ? '' : sum > 0 ? `+ ${sum}x` : `- ${-sum}x`;
    const term3 = prod === 0 ? '' : prod > 0 ? `+ ${prod}` : `- ${-prod}`;
    
    // int from r1 to r2 of -x^2 + sum x + prod
    // = [-x^3/3 + sum x^2 / 2 + prod x]
    
    const evalUpper = -Math.pow(r2, 3)/3 + sum * Math.pow(r2, 2)/2 + prod * r2;
    const evalLower = -Math.pow(r1, 3)/3 + sum * Math.pow(r1, 2)/2 + prod * r1;
    const area = evalUpper - evalLower;
    
    const areaRounded = Math.round(area * 6);
    const gcd1 = (x:number, y:number):number => y === 0 ? x : gcd1(y, x % y);
    const g = gcd1(Math.abs(areaRounded), 6);
    const num = areaRounded / g;
    const den = 6 / g;
    const areaStr = den === 1 ? `${num}` : `\\frac{${num}}{${den}}`;

    return {
      subTopic: actualTopic,
      questionLines: [
        `Find the area enclosed by the graph of $y = -x^2 ${term2} ${term3}$ and the $x$-axis.`
      ],
      boardQuestionLines: [
        `Find area between $x$-axis and:`,
        `$y = -x^2 ${term2} ${term3}$`
      ],
      solutionSteps: [
        `<strong>1.</strong> Find the roots by setting $y = 0$:`,
        `$-x^2 ${term2} ${term3} = 0 \\implies x^2 ${sum > 0 ? '-' : '+'}${Math.abs(sum)}x ${prod > 0 ? '-' : '+'}${Math.abs(prod)} = 0$`,
        `$(x ${-r1 > 0 ? '+' : '-'}${-r1})(x ${-r2 > 0 ? '+' : '-'}${-r2}) = 0 \\implies x = ${r1}, x = ${r2}$`,
        `<strong>2.</strong> Integrate between the roots:`,
        `$\\int^{${r2}}_{${r1}} (-x^2 ${term2} ${term3})\\,dx = \\left[ -\\frac{x^3}{3} + \\frac{${sum}x^2}{2} + ${prod}x \\right]^{${r2}}_{${r1}}$`,
        `<strong>3.</strong> Evaluate limits:`,
        `$= \\left( -\\frac{${Math.pow(r2, 3)}}{3} + \\frac{${sum*Math.pow(r2, 2)}}{2} + ${prod*r2} \\right) - \\left( -\\frac{${Math.pow(r1, 3)}}{3} + \\frac{${sum*Math.pow(r1, 2)}}{2} + ${prod*r1} \\right)$`,
        `$= ${areaStr}$`
      ],
      finalAnswer: `$${areaStr}$ units$^2$`
    };
  }
  
  if (actualTopic === "Area between two curves") {
    const type = getRandomInt(0, 2);
    
    if (type === 0 || type === 1) {
      const r1 = getRandomInt(0, 2);
      const r2 = getRandomInt(3, 5);
      
      const sum = r1 + r2;
      const prod = -(r1 * r2);
      
      const term2 = sum === 0 ? '' : sum > 0 ? `+ ${sum}x` : `- ${-sum}x`;
      const term3 = prod === 0 ? '' : prod > 0 ? `+ ${prod}` : `- ${-prod}`;
      
      // y = x
      // upper curve = x
      // lower curve = x^2 - (sum-1)x - prod = x^2 - sum x + x - prod
      
      const coeff2 = -(sum - 1);
      const const_term = -prod;
  
      const lower_term2 = coeff2 === 0 ? '' : coeff2 > 0 ? `+ ${coeff2}x` : `- ${-coeff2}x`;
      const lower_term3 = const_term === 0 ? '' : const_term > 0 ? `+ ${const_term}` : `- ${-const_term}`;
      
      const evalUpper = -Math.pow(r2, 3)/3 + sum * Math.pow(r2, 2)/2 + prod * r2;
      const evalLower = -Math.pow(r1, 3)/3 + sum * Math.pow(r1, 2)/2 + prod * r1;
      const area = evalUpper - evalLower;
      
      const areaRounded = Math.round(area * 6);
      const gcd1 = (x:number, y:number):number => y === 0 ? x : gcd1(y, x % y);
      const g = gcd1(Math.abs(areaRounded), 6);
      const num = areaRounded / g;
      const den = 6 / g;
      const areaStr = den === 1 ? `${num}` : `\\frac{${num}}{${den}}`;
  
      return {
        subTopic: actualTopic,
        questionLines: [
          `Find the area enclosed by the parabola $y = x^2 ${lower_term2} ${lower_term3}$ and the straight line $y = x$.`
        ],
        boardQuestionLines: [
          `Find area between:`,
          `$y = x^2 ${lower_term2} ${lower_term3}$ and $y = x$`
        ],
        solutionSteps: [
          `<strong>1.</strong> Equate to find points of intersection:`,
          `$x^2 ${lower_term2} ${lower_term3} = x \\implies x^2 ${coeff2 - 1 > 0 ? '+' : ''}${coeff2 - 1 === 0 ? '' : coeff2 - 1}x ${lower_term3} = 0$`,
          `$(x ${-r1 > 0 ? '+' : '-'}${Math.abs(r1)})(x ${-r2 > 0 ? '+' : '-'}${Math.abs(r2)}) = 0 \\implies x = ${r1}, x = ${r2}$`,
          `<strong>2.</strong> Identify 'Upper - Lower':`,
          `$x - (x^2 ${lower_term2} ${lower_term3}) = -x^2 ${term2} ${term3}$`,
          `<strong>3.</strong> Integrate Upper - Lower between limits:`,
          `$\\int^{${r2}}_{${r1}} (-x^2 ${term2} ${term3})\\,dx = \\left[ -\\frac{x^3}{3} + \\frac{${sum}x^2}{2} ${prod > 0 ? '+' : ''}${prod === 0 ? '' : prod + 'x'} \\right]^{${r2}}_{${r1}}$`,
          `<strong>4.</strong> Evaluate limits:`,
          `$= \\left( -\\frac{${Math.pow(r2, 3)}}{3} + \\frac{${sum*Math.pow(r2, 2)}}{2} + ${prod*r2} \\right) - \\left( -\\frac{${Math.pow(r1, 3)}}{3} + \\frac{${sum*Math.pow(r1, 2)}}{2} + ${prod*r1} \\right)$`,
          `$= ${areaStr}$`
        ],
        finalAnswer: `$${areaStr}$ units$^2$`
      };
    } else {
      return {
        subTopic: actualTopic,
        questionLines: [
          `Consider the curves $y = \\sin x$ and $y = \\cos 2x$ in the interval $0 \\le x \\le \\pi$.`,
          `(a) Find the $x$-coordinates of the points of intersection of these curves algebraically.`,
          `(b) Calculate the area enclosed between the two curves.`
        ],
        boardQuestionLines: [
          `Area between $y = \\sin x$ and $y = \\cos 2x$.`,
          `Find intersections, then area.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Intersection points:`,
          `$\\cos 2x = \\sin x \\implies 1 - 2\\sin^2 x = \\sin x$`,
          `$2\\sin^2 x + \\sin x - 1 = 0 \\implies (2\\sin x - 1)(\\sin x + 1) = 0$`,
          `$\\sin x = \\frac{1}{2}$ or $\\sin x = -1$ (out of range limit)`,
          `$x = \\frac{\\pi}{6}$ and $x = \\frac{5\\pi}{6}$`,
          `<strong>2.</strong> Upper curve is $\\sin x$, Lower is $\\cos 2x$. Integrate:`,
          `$\\int^{\\frac{5\\pi}{6}}_{\\frac{\\pi}{6}} (\\sin x - \\cos 2x)\\,dx = \\left[ -\\cos x - \\frac{1}{2}\\sin 2x \\right]^{\\frac{5\\pi}{6}}_{\\frac{\\pi}{6}}$`,
          `<strong>3.</strong> Evaluate limits:`,
          `$= \\left( -\\cos(\\frac{5\\pi}{6}) - \\frac{1}{2}\\sin(\\frac{5\\pi}{3}) \\right) - \\left( -\\cos(\\frac{\\pi}{6}) - \\frac{1}{2}\\sin(\\frac{\\pi}{3}) \\right)$`,
          `$= \\left( \\frac{\\sqrt{3}}{2} - \\frac{1}{2}(-\\frac{\\sqrt{3}}{2}) \\right) - \\left( -\\frac{\\sqrt{3}}{2} - \\frac{1}{2}(\\frac{\\sqrt{3}}{2}) \\right)$`,
          `$= \\left(\\frac{3\\sqrt{3}}{4}\\right) - \\left(-\\frac{3\\sqrt{3}}{4}\\right) = \\frac{6\\sqrt{3}}{4} = \\frac{3\\sqrt{3}}{2}$`
        ],
        finalAnswer: `(a) $x = \\frac{\\pi}{6}, \\frac{5\\pi}{6}$<br>(b) $\\frac{3\\sqrt{3}}{2}$`
      };
    }
  }

  return {
    subTopic: actualTopic,
    questionLines: ["Missing integration question"],
    boardQuestionLines: ["Missing"],
    solutionSteps: ["Error"],
    finalAnswer: "Error"
  };
}

