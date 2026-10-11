import { getRandomInt, nonZeroInt, Point, formatNum, gcd, simplifyFraction, formatFraction, formatFractionWithSub, formatTerm, formatEquation, generateTriangle } from "./utils";
import { GeneratedQuestion, Topic, TOPIC_GROUPS } from "./types";

export function generateQuadraticsQuestion(selectedTopic: string): Omit<GeneratedQuestion, "topic"> {
  const topics = TOPIC_GROUPS["Quadratics & Polynomials"];
  let type = topics.indexOf(selectedTopic as Topic);
  if (type === -1) type = Math.floor(Math.random() * topics.length);
  const actualTopic = topics[type];

      const formatComp = (n: number) => n === 1 ? '' : n === -1 ? '-' : `${n}`;

  if (actualTopic === "Completing the square") {
    // Write in form a(x+b)^2 + c
    // We want realistic questions. E.g.
    // 3x^2 + 6x + 1 -> 3(x+1)^2 - 2
    // 3 - 8x - x^2 -> 19 - (x+4)^2
    // 3x^2 + 9x + 1 -> 3(x + 3/2)^2 - 23/4
    // Reverse engineer from a(x+qNum/qDen)^2 + cNum/cDen
    // = a x^2 + 2 a (qNum/qDen) x + a (qNum/qDen)^2 + cNum/cDen
    
    const possibleA = [2, 3, 4, 5, -1, -1, -2, -3];
    const a = possibleA[Math.floor(Math.random() * possibleA.length)];
    
    // Choose if we want a fraction for b (qNum/qDen)
    const isFraction = Math.random() < 0.3;
    let bTermNum = getRandomInt(-5, 5);
    if (bTermNum === 0) bTermNum = 1;
    let bTermDen = isFraction ? 2 : 1; 
    
    // let's ensure bTermDen is 2, and bTermNum is odd
    if (isFraction && bTermNum % 2 === 0) bTermNum += 1;
    
    // we want integer c if possible, which means a * (bTermNum/bTermDen)^2 + cNum/cDen = r
    // Let r be a random integer (constant term of the expansion)
    const r = getRandomInt(-15, 15);
    
    // So the expression is a * x^2 + (2 * a * bTermNum / bTermDen) x + r
    const coeffX_num = 2 * a * bTermNum;
    const coeffX_den = bTermDen;
    let coeffX = coeffX_num / coeffX_den; // Should be integer because bTermDen is 1 or 2, and either a is even or we accept fractional x coefficient?
    // Wait, the PDF examples all have integer coefficients for x:
    // 3x^2 + 6x + 1, 2x^2 + 12x - 3, 5x^2 - 10x - 7, 3x^2 - 18x + 4, 3 - 8x - x^2, 3x^2 + 9x + 1
    // Notice 3x^2 + 9x + 1: x^2 coeff is 3, x coeff is 9.
    // 2 * 3 * bTerm = 9 => bTerm = 9/6 = 3/2. So bTerm = coeffX / (2a).
    
    // Let's generate from integer a, integer b (coeffX), integer c (r) instead!
    const coeffA = a;
    let coeffB = getRandomInt(-12, 12);
    if (coeffB === 0) coeffB = 4;
    const coeffC = r;
    
    // The expression is coeffA x^2 + coeffB x + coeffC
    // Completing the square:
    // coeffA (x^2 + (coeffB/coeffA) x) + coeffC
    // = coeffA (x + coeffB/(2*coeffA))^2 - coeffA * (coeffB/(2*coeffA))^2 + coeffC
    
    const p = coeffA;
    const qNum = coeffB;
    const qDen = 2 * coeffA;
    // simplify qNum/qDen
    const gcd = (x: number, y: number): number => y === 0 ? Math.abs(x) : gcd(y, x % y);
    const qGcd = gcd(qNum, qDen);
    let qN = qNum / qGcd;
    let qD = qDen / qGcd;
    if (qD < 0) { qN = -qN; qD = -qD; }
    
    // remainder term = coeffC - coeffA * (qNum/qDen)^2
    // = coeffC - coeffA * (qNum^2 / qDen^2)
    // = coeffC -  (qNum^2 / (4 * coeffA))
    const remNum = coeffC * (4 * coeffA) - (coeffB * coeffB);
    const remDen = 4 * coeffA;
    const rGcd = gcd(remNum, remDen);
    let rN = remNum / rGcd;
    let rD = remDen / rGcd;
    if (rD < 0) { rN = -rN; rD = -rD; }

    const formatFrac = (n: number, d: number) => {
      if (n === 0) return '0';
      if (d === 1) return `${n}`;
      return `\\frac{${Math.abs(n)}}{${d}}`;
    };

    let polyStr = "";
    if (coeffA === -1) polyStr += `-x^2`;
    else if (coeffA === 1) polyStr += `x^2`;
    else polyStr += `${coeffA}x^2`;
    
    if (coeffB > 0) polyStr += ` + ${coeffB}x`;
    else if (coeffB < 0) polyStr += ` - ${Math.abs(coeffB)}x`;
    
    if (coeffC > 0) polyStr += ` + ${coeffC}`;
    else if (coeffC < 0) polyStr += ` - ${Math.abs(coeffC)}`;
    
    // If coeffA is negative, write it reversed sometimes, e.g., 3 - 8x - x^2
    if (coeffA < 0 && Math.random() < 0.5) {
      polyStr = `${coeffC} ${coeffB > 0 ? '+' : '-'} ${Math.abs(coeffB)}x - ${Math.abs(coeffA) === 1 ? '' : Math.abs(coeffA)}x^2`;
      if (coeffC === 0) polyStr = `${coeffB}x - ${Math.abs(coeffA) === 1 ? '' : Math.abs(coeffA)}x^2`;
    }
    
    let qStr = qN === 0 ? '' : (qN > 0 ? `+ ${formatFrac(qN, qD)}` : `- ${formatFrac(-qN, qD)}`);
    const aStr = coeffA === 1 ? '' : coeffA === -1 ? '-' : `${coeffA}`;
    let remStr = rN === 0 ? '' : (rN > 0 ? `+ ${formatFrac(rN, rD)}` : `- ${formatFrac(-rN, rD)}`);

    return {
      subTopic: actualTopic,
      questionLines: [
        `Write $${polyStr}$ in the form $a(x+b)^2 + c$.`
      ],
      boardQuestionLines: [
        `Complete the square:`,
        `$${polyStr}$`
      ],
      solutionSteps: [
        `<strong>1.</strong> Factor out $${coeffA}$ from the $x$ terms:`,
        `$${coeffA}(x^2 ${coeffB/coeffA > 0 ? '+' : '-'} ${formatFrac(Math.abs(coeffB), Math.abs(coeffA))}x) ${coeffC >= 0 ? '+' : ''} ${coeffC}$`,
        `<strong>2.</strong> Complete the square inside the bracket:`,
        `$${coeffA}\\left[ (x ${qN >= 0 ? '+' : '-'} ${formatFrac(Math.abs(qN), qD)})^2 - \\left(${formatFrac(Math.abs(qN), qD)}\\right)^2 \\right] ${coeffC >= 0 ? '+' : ''} ${coeffC}$`,
        `<strong>3.</strong> Multiply out and simplify:`,
        `$${aStr}(x ${qStr})^2 - ${coeffA} \\times ${formatFrac(qN*qN, qD*qD)} ${coeffC >= 0 ? '+' : ''} ${coeffC}$`,
        `$${aStr}(x ${qStr})^2 ${remStr}$`
      ],
      finalAnswer: `$${aStr}(x ${qStr})^2 ${remStr}$`
    };
  }

  if (actualTopic === "Using the discriminant") {
    const type = getRandomInt(0, 2);
    
    if (type === 0) {
      // Find k for equal roots: (k+1)x^2 - 2(k+3)x + 3k = 0
      // discriminant: 4(k+3)^2 - 4(k+1)(3k) = 0
      // (k^2+6k+9) - (3k^2+3k) = 0 -> -2k^2 + 3k + 9 = 0 -> 2k^2 - 3k - 9 = 0 -> (2k+3)(k-3) = 0
      // Roots k = -3/2, k=3
      // We reverse engineer a quadratic in k: Ak^2 + Bk + C = 0
      // Let's use a list of pre-calculated nice equations
      const questions = [
        { eq: "x^2 + (k+1)x + 9 = 0", sol1: "5", sol2: "-7", a: "1", b: "(k+1)", c: "9", exp1: "(k+1)^2 - 36 = 0", exp2: "k^2 + 2k - 35 = 0" },
        { eq: "(k+1)x^2 - 2(k+3)x + 3k = 0", sol1: "3", sol2: "-\\frac{3}{2}", a: "k+1", b: "-2(k+3)", c: "3k", exp1: "4(k+3)^2 - 12k(k+1) = 0", exp2: "-8k^2 + 12k + 36 = 0" },
        { eq: "x^2 + (x+k)^2 - 8 = 0", sol1: "4", sol2: "-4", a: "2", b: "2k", c: "k^2-8", exp1: "(2k)^2 - 4(2)(k^2-8) = 0", exp2: "4k^2 - 8k^2 + 64 = 0" },
        { eq: "kx^2 - 12x + 9 = 0", sol1: "4", sol2: "4", a: "k", b: "-12", c: "9", exp1: "144 - 36k = 0", exp2: "36k = 144" },
        { eq: "x^2 - 8x + k = 0", sol1: "16", sol2: "16", a: "1", b: "-8", c: "k", exp1: "64 - 4k = 0", exp2: "4k = 64" }
      ];
      const q = questions[Math.floor(Math.random() * questions.length)];
      
      const ansStr = q.sol1 === q.sol2 ? `$k = ${q.sol1}$` : `$k = ${q.sol1}$ or $k = ${q.sol2}$`;
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Find the value(s) of $k$ given that the equation $${q.eq}$ has equal roots.`
        ],
        boardQuestionLines: [
          `Equation has equal roots:`,
          `$${q.eq}$`,
          `Find $k$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> If roots are equal, the discriminant is zero: $b^2 - 4ac = 0$`,
          `<strong>2.</strong> Identify $a, b, c$:<br>$a = ${q.a}$, $b = ${q.b}$, $c = ${q.c}$`,
          `<strong>3.</strong> Substitute and solve:<br>$${q.exp1}$`,
          `$${q.exp2}$`
        ],
        finalAnswer: ansStr
      };
    } else if (type === 1) {
      // Find range of values for real roots: 2 real and distinct roots
      // e.g. x^2 - (k-2)x + 4 = 0 -> b^2 - 4ac > 0 -> (k-2)^2 - 16 > 0 -> k^2 - 4k - 12 > 0 -> (k-6)(k+2) > 0 -> k > 6 or k < -2
      const c = getRandomInt(1, 4) * getRandomInt(1, 4); // square number 1, 4, 9, 16
      const c_val = c*c;
      const f = getRandomInt(-5, 5);
      const fStr = f > 0 ? `-${f}` : `+${-f}`; // so it evaluates to k-f
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Find the range of values for $k$ such that the equation $x^2 - (k${fStr})x + ${c_val} = 0$ has two real distinct roots.`
        ],
        boardQuestionLines: [
          `Equation has 2 real and distinct roots:`,
          `$x^2 - (k${fStr})x + ${c_val} = 0$`,
          `Find range for $k$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> For real distinct roots, $b^2 - 4ac > 0$.`,
          `<strong>2.</strong> Substitute $a=1, b=-(k${fStr}), c=${c_val}$:`,
          `$(-(k${fStr}))^2 - 4(1)(${c_val}) > 0$`,
          `$(k${fStr})^2 - ${4*c_val} > 0$`,
          `<strong>3.</strong> Solve the inequality: $(k${fStr} - ${2*c})(k${fStr} + ${2*c}) > 0$`,
          `$(k - ${f+2*c})(k - ${f-2*c}) > 0$`,
          `$k < ${Math.min(f+2*c, f-2*c)}$ or $k > ${Math.max(f+2*c, f-2*c)}$`
        ],
        finalAnswer: `$k < ${Math.min(f+2*c, f-2*c)}$ or $k > ${Math.max(f+2*c, f-2*c)}$`
      };
    } else {
      // Show that roots are always real
      return {
        subTopic: actualTopic,
        questionLines: [
          `Show that, if $k$ is a real number, the roots of the equation $kx^2 + 3x - 3 = 2kx$ are always real.`
        ],
        boardQuestionLines: [
          `Show that roots of $kx^2 + 3x - 3 = 2kx$ are always real.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Rearrange to standard form: $kx^2 + (3 - 2k)x - 3 = 0$`,
          `<strong>2.</strong> Identify $a=k, b=(3-2k), c=-3$.`,
          `<strong>3.</strong> Calculate the discriminant $b^2 - 4ac$:`,
          `$= (3 - 2k)^2 - 4(k)(-3)$`,
          `$= 9 - 12k + 4k^2 + 12k$`,
          `$= 4k^2 + 9$`,
          `<strong>4.</strong> Since $k^2 \\ge 0$ for all real $k$, $4k^2 + 9 > 0$.`,
          `Since $b^2 - 4ac > 0$, the roots are always real.`
        ],
        finalAnswer: `$b^2 - 4ac = 4k^2 + 9 > 0$`
      };
    }
  }

  if (actualTopic === "Quadratic inequalities") {
    // Solve e.g. 2x^2 + 5x - 3 < 0, 7 - 6x - x^2 >= 0, 4x^2 >= 8x + 5
    const r1 = getRandomInt(-5, 0);
    const r2 = getRandomInt(1, 5);
    const a = (Math.random() < 0.2 ? -1 : 1) * getRandomInt(1, 4); // positive or negative
    
    // (ax - rA)(x - rB) = a x^2 - (a rB + rA) x + rA rB
    const b = -(a * r2 + r1);
    const c = r1 * r2;
    
    let polyStr = "";
    if (a === -1) polyStr += `-x^2`;
    else if (a === 1) polyStr += `x^2`;
    else polyStr += `${a}x^2`;
    
    if (b > 0) polyStr += ` + ${b}x`;
    else if (b < 0) polyStr += ` - ${Math.abs(b)}x`;
    
    if (c > 0) polyStr += ` + ${c}`;
    else if (c < 0) polyStr += ` - ${Math.abs(c)}`;

    const symbols = ["<", ">", "\\le", "\\ge"];
    const ineqIdx = Math.floor(Math.random() * symbols.length);
    const ineqStr = symbols[ineqIdx];
    
    // The roots are rA/a and rB.
    const root1 = r1 / a;
    const root2 = r2;
    const r_min = Math.min(root1, root2);
    const r_max = Math.max(root1, root2);
    
    // Evaluate the condition
    // Let's sample a point clearly inside: (r_min + r_max)/2
    const testPoint = (r_min + r_max) / 2;
    const valAtTest = a * testPoint * testPoint + b * testPoint + c;
    
    let isBetween = false;
    if (ineqIdx === 0 || ineqIdx === 2) { // < or <=
      isBetween = valAtTest < 0;
    } else { // > or >=
      isBetween = valAtTest > 0;
    }
    
    const fmtR = (v: number) => Number.isInteger(v) ? `${v}` : `\\frac{${v > 0 ? (r1 % a === 0 ? r1/a : (Math.sign(r1) * Math.sign(a) > 0 ? Math.abs(r1) : -Math.abs(r1))) : '-1'}}{${Math.abs(a)}}`; // simplify frac conceptually
    // To make it robust, lets just output standard
    const factorisePrint = a < 0 ? `-(${Math.abs(a)}x ${r1>0?'-':'+'} ${Math.abs(r1)})(x ${r2>0?'-':'+'} ${Math.abs(r2)})` : `(${a}x ${r1>0?'-':'+'} ${Math.abs(r1)})(x ${r2>0?'-':'+'} ${Math.abs(r2)})`;

    let finalStr = "";
    const op1 = (ineqIdx === 0 || ineqIdx === 1) ? "<" : "\\le";
    const op2 = (ineqIdx === 0 || ineqIdx === 1) ? ">" : "\\ge";
    
    if (isBetween) {
      finalStr = `${fmtR(r_min)} ${op1} x ${op1} ${fmtR(r_max)}`;
    } else {
      finalStr = `x ${op1} ${fmtR(r_min)} \\text{ or } x ${op2} ${fmtR(r_max)}`;
    }

    return {
      subTopic: actualTopic,
      questionLines: [
        `Solve the quadratic inequality by sketching the parabola:`,
        `$${polyStr} ${ineqStr} 0$`
      ],
      boardQuestionLines: [
        `Solve:`,
        `$${polyStr} ${ineqStr} 0$`
      ],
      solutionSteps: [
        `<strong>1.</strong> Find the roots by setting the expression to $0$:`,
        `$${factorisePrint} = 0$`,
        `$x = ${fmtR(r_min)}$ and $x = ${fmtR(r_max)}$`,
        `<strong>2.</strong> Sketch the parabola. ${a > 0 ? "It is a positive parabola (U-shaped)." : "It is an inverted parabola (n-shaped)."}`,
        `<strong>3.</strong> Determine where the value is ${ineqIdx === 0 || ineqIdx === 2 ? "less than or equal to" : "greater than or equal to"} zero.`,
        `$${finalStr}$`
      ],
      finalAnswer: `$${finalStr}$`
    };
  }

  // Fallback for others (Factorising/Synthetic division)
  const isIntersection = Math.random() < 0.3;
  let r1v = getRandomInt(-3, -1);
  let r2v = getRandomInt(1, 4);
  while (r2v === -r1v) {
    r2v = getRandomInt(1, 4);
  }
  let r3v = getRandomInt(1, 5);
  
  const b = -(r1v + r2v + r3v);
  const c = (r1v*r2v) + (r2v*r3v) + (r3v*r1v);
  const d = -r1v*r2v*r3v;
  const poly2 = `x^3 ${b === 0 ? '' : b > 0 ? '+ ' + b + 'x^2' : '- ' + Math.abs(b) + 'x^2'} ${c === 0 ? '' : c > 0 ? '+ ' + c + 'x' : '- ' + Math.abs(c) + 'x'} ${d === 0 ? '' : d > 0 ? '+ ' + d : '- ' + Math.abs(d)}`;

  const factor1 = `(x ${r1v < 0 ? '+' : '-'} ${Math.abs(r1v)})`;
  const factor2 = `(x ${r2v < 0 ? '+' : '-'} ${Math.abs(r2v)})`;
  const factor3 = `(x ${r3v < 0 ? '+' : '-'} ${Math.abs(r3v)})`;

  if (isIntersection) {
    // Generate f(x) = x^3 + a x^2 + cx + d
    // Let's add some g(x) = p x^2 + q x + r
    // so f(x) + g(x) = poly2
    const p = getRandomInt(-3, 3);
    const q = getRandomInt(-5, 5);
    const r = getRandomInt(-5, 5);
    
    // Original = x^3 + b x^2 + c x + d 
    // New f(x) = Original - g(x)
    // f(x) = x^3 + (b-p)x^2 + (c-q)x + (d-r)
    const fb = b - p;
    const fc = c - q;
    const fd = d - r;
    const fStr = `x^3 ${fb === 0 ? '' : fb > 0 ? '+ ' + fb + 'x^2' : '- ' + Math.abs(fb) + 'x^2'} ${fc === 0 ? '' : fc > 0 ? '+ ' + fc + 'x' : '- ' + Math.abs(fc) + 'x'} ${fd === 0 ? '' : fd > 0 ? '+ ' + fd : '- ' + Math.abs(fd)}`;
    
    const gStr = `${p === 0 ? '' : p === 1 ? 'x^2' : p === -1 ? '-x^2' : p + 'x^2'} ${q === 0 ? '' : q > 0 ? (p === 0 ? q + 'x' : '+ ' + q + 'x') : '- ' + Math.abs(q) + 'x'} ${r === 0 ? '' : r > 0 ? (p===0 && q===0 ? r : '+ ' + r) : '- ' + Math.abs(r)}`;

    return {
      subTopic: actualTopic,
      questionLines: [
        `Find the $x$-coordinates of the points of intersection of $f(x) = ${fStr}$ and $g(x) = ${gStr || '0'}$.`
      ],
      boardQuestionLines: [
        `Find $x$-coordinates of intersection points of:`,
        `$f(x) = ${fStr}$`,
        `$g(x) = ${gStr || '0'}$`
      ],
      solutionSteps: [
        `<strong>1.</strong> Set $f(x) = g(x)$:<br>$${fStr} = ${gStr || '0'}$`,
        `<strong>2.</strong> Rearrange to form a single polynomial equal to zero:<br>$${poly2} = 0$`,
        `<strong>3.</strong> Use synthetic division to find roots, e.g. try $x=${r1v}, ${r2v}, ${r3v}$.`,
        `<strong>4.</strong> The factors are $${factor1}${factor2}${factor3} = 0$.`,
        `<strong>5.</strong> So $x = ${r1v}, x = ${r2v}, x = ${r3v}$.`
      ],
      finalAnswer: `$x = ${r1v}, x = ${r2v}, x = ${r3v}$`
    };
  }

  return {
    subTopic: actualTopic,
    questionLines: [
      `Show that $${factor1}$ is a factor of $${poly2}$ and factorise fully.`
    ],
    boardQuestionLines: [
      `Factorise fully knowing $${factor1}$ is a factor:`,
      `$${poly2}$`
    ],
    solutionSteps: [
      `<strong>1.</strong> Use synthetic division with root $x = ${r1v}$.`,
      `<strong>2.</strong> The remainder is $0$, hence $${factor1}$ is a factor.`,
      `<strong>3.</strong> Extract the quotient and factorise it to find the remaining factors:<br>Quotient factorises to $${factor2}${factor3}$.`
    ],
    finalAnswer: `Remainder = $0$<br>$${factor1}${factor2}${factor3}$`
  };
}

