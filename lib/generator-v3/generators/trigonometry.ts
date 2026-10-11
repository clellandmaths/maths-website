import { getRandomInt, nonZeroInt, Point, formatNum, gcd, simplifyFraction, formatFraction, formatFractionWithSub, formatTerm, formatEquation, generateTriangle } from "./utils";
import { GeneratedQuestion, Topic, TOPIC_GROUPS } from "./types";

export function generateTrigonometryQuestion(selectedTopic: string): Omit<GeneratedQuestion, "topic"> {
  const topics = TOPIC_GROUPS["Trigonometry"];
  let type = topics.indexOf(selectedTopic as Topic);
  if (type === -1) type = Math.floor(Math.random() * topics.length);
  const actualTopic = topics[type];

  
  if (actualTopic === "Related angles") {
    // Exact values from worksheet: sin 150, tan 240, cos 315, tan 135, sin 210, cos 330, cos 225, tan 300, etc.
    const anglesAndValues = [
      { func: "sin", angle: 150, related: 30, quad: 2, sign: "+", exact: "\\frac{1}{2}" },
      { func: "tan", angle: 240, related: 60, quad: 3, sign: "+", exact: "\\sqrt{3}" },
      { func: "cos", angle: 315, related: 45, quad: 4, sign: "+", exact: "\\frac{1}{\\sqrt{2}}" },
      { func: "tan", angle: 135, related: 45, quad: 2, sign: "-", exact: "-1" },
      { func: "sin", angle: 210, related: 30, quad: 3, sign: "-", exact: "-\\frac{1}{2}" },
      { func: "cos", angle: 330, related: 30, quad: 4, sign: "+", exact: "\\frac{\\sqrt{3}}{2}" },
      { func: "cos", angle: 225, related: 45, quad: 3, sign: "-", exact: "-\\frac{1}{\\sqrt{2}}" },
      { func: "tan", angle: 300, related: 60, quad: 4, sign: "-", exact: "-\\sqrt{3}" },
      { func: "sin", angle: 240, related: 60, quad: 3, sign: "-", exact: "-\\frac{\\sqrt{3}}{2}" }
    ];

    const pick = anglesAndValues[Math.floor(Math.random() * anglesAndValues.length)];

    return {
      subTopic: actualTopic,
      questionLines: [
        `Evaluate the exact value of $\\${pick.func} ${pick.angle}^\\circ$.`
      ],
      boardQuestionLines: [
        `Exact value of:`,
        `$\\${pick.func} ${pick.angle}^\\circ$`
      ],
      solutionSteps: [
        `<strong>1.</strong> Identify the quadrant: $${pick.angle}^\\circ$ is in Quadrant ${pick.quad}.`,
        `<strong>2.</strong> In Quadrant ${pick.quad}, $\\${pick.func}$ is ${pick.sign === '+' ? 'positive' : 'negative'}.`,
        `<strong>3.</strong> Find the related acute angle:`,
        pick.quad === 2 ? `$\\alpha = 180^\\circ - ${pick.angle}^\\circ = ${pick.related}^\\circ$` :
        pick.quad === 3 ? `$\\alpha = ${pick.angle}^\\circ - 180^\\circ = ${pick.related}^\\circ$` :
        `$\\alpha = 360^\\circ - ${pick.angle}^\\circ = ${pick.related}^\\circ$`,
        `<strong>4.</strong> Evaluate:`,
        `$\\${pick.func} ${pick.angle}^\\circ = ${pick.sign === '+' ? '' : '-'}\\${pick.func} ${pick.related}^\\circ = ${pick.exact}$`
      ],
      finalAnswer: `$${pick.exact}$`
    };
  }

  if (actualTopic === "Addition formulae") {
    const isSin = Math.random() > 0.5;
    
    // 50% chance of angle evaluation, 50% chance of given tan/sin/cos find addition
    if (Math.random() < 0.5) {
      const cases = [
        { exp: "45 - 30", a: 45, b: 30, op: '-' },
        { exp: "45 + 30", a: 45, b: 30, op: '+' },
        { exp: "60 - 45", a: 60, b: 45, op: '-' },
        { exp: "60 + 45", a: 60, b: 45, op: '+' }
      ];
      const c = cases[Math.floor(Math.random() * cases.length)];
      const angle = c.op === '+' ? c.a + c.b : c.a - c.b;
      
      let answer = '';
      let expansion = '';
      let values = '';
      
      if (isSin) {
        expansion = `\\sin ${c.a}^\\circ \\cos ${c.b}^\\circ ${c.op === '+' ? '+' : '-'} \\cos ${c.a}^\\circ \\sin ${c.b}^\\circ`;
        if (c.a === 45 && c.b === 30) {
          values = `\\frac{1}{\\sqrt{2}}\\times\\frac{\\sqrt{3}}{2} ${c.op === '+' ? '+' : '-'} \\frac{1}{\\sqrt{2}}\\times\\frac{1}{2}`;
          answer = `\\frac{\\sqrt{3} ${c.op === '+' ? '+' : '-'} 1}{2\\sqrt{2}}`;
        } else { // 60, 45
          values = `\\frac{\\sqrt{3}}{2}\\times\\frac{1}{\\sqrt{2}} ${c.op === '+' ? '+' : '-'} \\frac{1}{2}\\times\\frac{1}{\\sqrt{2}}`;
          answer = `\\frac{\\sqrt{3} ${c.op === '+' ? '+' : '-'} 1}{2\\sqrt{2}}`;
        }
      } else {
        const realOp = c.op === '+' ? '-' : '+';
        expansion = `\\cos ${c.a}^\\circ \\cos ${c.b}^\\circ ${realOp} \\sin ${c.a}^\\circ \\sin ${c.b}^\\circ`;
        if (c.a === 45 && c.b === 30) {
          values = `\\frac{1}{\\sqrt{2}}\\times\\frac{\\sqrt{3}}{2} ${realOp} \\frac{1}{\\sqrt{2}}\\times\\frac{1}{2}`;
          answer = `\\frac{\\sqrt{3} ${realOp} 1}{2\\sqrt{2}}`;
        } else { // 60, 45
          values = `\\frac{1}{2}\\times\\frac{1}{\\sqrt{2}} ${realOp} \\frac{\\sqrt{3}}{2}\\times\\frac{1}{\\sqrt{2}}`;
          answer = `\\frac{1 ${realOp} \\sqrt{3}}{2\\sqrt{2}}`;
        }
      }

      return {
        subTopic: actualTopic,
        questionLines: [
          `Calculate the exact value of $\\${isSin ? 'sin' : 'cos'} ${angle}^\\circ$, given that $${angle}^\\circ = ${c.a}^\\circ ${c.op} ${c.b}^\\circ$.`
        ],
        boardQuestionLines: [
          `Exact value:`,
          `$\\${isSin ? 'sin' : 'cos'} ${angle}^\\circ$ (use $${angle}^\\circ = ${c.a}^\\circ ${c.op} ${c.b}^\\circ$)`
        ],
        solutionSteps: [
          `<strong>1.</strong> Use the addition formula $\\${isSin ? 'sin' : 'cos'} (${c.exp})^\\circ$:`,
          `$= ${expansion}$`,
          `<strong>2.</strong> Substitute exact values:`,
          `$= ${values}$`,
          `<strong>3.</strong> Simplify:`,
          `$= ${answer}$`
        ],
        finalAnswer: `$${answer}$`
      };
    } else {
      // Type 2: Given tan A = oppA/adjA and tan B = oppB/adjB, find sin(A +/- B) or cos(A +/- B)
      const triples = [
        { opp: 3, adj: 4, hyp: 5 },
        { opp: 5, adj: 12, hyp: 13 },
        { opp: 8, adj: 15, hyp: 17 }
      ];
      
      const trip1 = triples[Math.floor(Math.random() * triples.length)];
      const trip2 = triples[Math.floor(Math.random() * triples.length)];
      
      const isMinus = Math.random() > 0.5;
      const opSign = isMinus ? '-' : '+';
      const realCosOp = isMinus ? '+' : '-';
      
      let ansNum, ansDen;
      let expValues;
      let step3Str;
      
      ansDen = trip1.hyp * trip2.hyp;
      
      if (isSin) {
        if (isMinus) {
          ansNum = trip1.opp * trip2.adj - trip1.adj * trip2.opp;
          expValues = `\\left(\\frac{${trip1.opp}}{${trip1.hyp}}\\right)\\left(\\frac{${trip2.adj}}{${trip2.hyp}}\\right) - \\left(\\frac{${trip1.adj}}{${trip1.hyp}}\\right)\\left(\\frac{${trip2.opp}}{${trip2.hyp}}\\right)`;
          step3Str = `\\frac{${trip1.opp * trip2.adj}}{${ansDen}} - \\frac{${trip1.adj * trip2.opp}}{${ansDen}}`;
        } else {
          ansNum = trip1.opp * trip2.adj + trip1.adj * trip2.opp;
          expValues = `\\left(\\frac{${trip1.opp}}{${trip1.hyp}}\\right)\\left(\\frac{${trip2.adj}}{${trip2.hyp}}\\right) + \\left(\\frac{${trip1.adj}}{${trip1.hyp}}\\right)\\left(\\frac{${trip2.opp}}{${trip2.hyp}}\\right)`;
          step3Str = `\\frac{${trip1.opp * trip2.adj}}{${ansDen}} + \\frac{${trip1.adj * trip2.opp}}{${ansDen}}`;
        }
      } else {
        if (isMinus) {
          ansNum = trip1.adj * trip2.adj + trip1.opp * trip2.opp;
          expValues = `\\left(\\frac{${trip1.adj}}{${trip1.hyp}}\\right)\\left(\\frac{${trip2.adj}}{${trip2.hyp}}\\right) + \\left(\\frac{${trip1.opp}}{${trip1.hyp}}\\right)\\left(\\frac{${trip2.opp}}{${trip2.hyp}}\\right)`;
          step3Str = `\\frac{${trip1.adj * trip2.adj}}{${ansDen}} + \\frac{${trip1.opp * trip2.opp}}{${ansDen}}`;
        } else {
          ansNum = trip1.adj * trip2.adj - trip1.opp * trip2.opp;
          expValues = `\\left(\\frac{${trip1.adj}}{${trip1.hyp}}\\right)\\left(\\frac{${trip2.adj}}{${trip2.hyp}}\\right) - \\left(\\frac{${trip1.opp}}{${trip1.hyp}}\\right)\\left(\\frac{${trip2.opp}}{${trip2.hyp}}\\right)`;
          step3Str = `\\frac{${trip1.adj * trip2.adj}}{${ansDen}} - \\frac{${trip1.opp * trip2.opp}}{${ansDen}}`;
        }
      }
      
      const given1 = Math.random() > 0.5 ? `\\tan A = \\frac{${trip1.opp}}{${trip1.adj}}` : `\\sin A = \\frac{${trip1.opp}}{${trip1.hyp}}`;
      const given2 = Math.random() > 0.5 ? `\\tan B = \\frac{${trip2.opp}}{${trip2.adj}}` : `\\sin B = \\frac{${trip2.opp}}{${trip2.hyp}}`;
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Given $${given1}$ and $${given2}$ for acute angles $A$ and $B$, evaluate $\\${isSin ? 'sin' : 'cos'}(A ${opSign} B)$.`
        ],
        boardQuestionLines: [
          `$${given1}$ and $${given2}$ (acute angles).`,
          `Evaluate $\\${isSin ? 'sin' : 'cos'}(A ${opSign} B)$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Draw right-angled triangles for $A$ and $B$:`,
          `$\\sin A=\\frac{${trip1.opp}}{${trip1.hyp}}, \\cos A=\\frac{${trip1.adj}}{${trip1.hyp}}$`,
          `$\\sin B=\\frac{${trip2.opp}}{${trip2.hyp}}, \\cos B=\\frac{${trip2.adj}}{${trip2.hyp}}$`,
          `<strong>2.</strong> Expand $\\${isSin ? 'sin' : 'cos'}(A ${opSign} B)$:`,
          isSin ? `$= \\sin A \\cos B ${opSign} \\cos A \\sin B$` : `$= \\cos A \\cos B ${realCosOp} \\sin A \\sin B$`,
          `<strong>3.</strong> Substitute values:`,
          `$= ${expValues}$`,
          `$= ${step3Str} = \\frac{${ansNum}}{${ansDen}}$`
        ],
        finalAnswer: `$\\frac{${ansNum}}{${ansDen}}$`
      };
    }
  }

  if (actualTopic === "Double angle formulae") {
    const triples = [
      { opp: 3, adj: 4, hyp: 5 },
      { opp: 4, adj: 3, hyp: 5 },
      { opp: 5, adj: 12, hyp: 13 },
      { opp: 12, adj: 5, hyp: 13 },
      { opp: 8, adj: 15, hyp: 17 },
      { opp: 15, adj: 8, hyp: 17 }
    ];
    const triple = triples[Math.floor(Math.random() * triples.length)];
    const { opp, adj, hyp } = triple;
    const isGivenSin = Math.random() > 0.5;
    const isTargetSin = Math.random() > 0.5;
    
    if (isTargetSin) {
      return {
        subTopic: actualTopic,
        questionLines: [
          `Given that $\\${isGivenSin ? 'sin' : 'cos'} x = \\frac{${isGivenSin ? opp : adj}}{${hyp}}$, $0 < x < \\frac{\\pi}{2}$, find the exact value of $\\sin 2x$.`
        ],
        boardQuestionLines: [
          `Given $\\${isGivenSin ? 'sin' : 'cos'} x = \\frac{${isGivenSin ? opp : adj}}{${hyp}}$ ($0 < x < \\frac{\\pi}{2}$),`,
          `find exact value of $\\sin 2x$`
        ],
        solutionSteps: [
          `<strong>1.</strong> Draw a right-angled triangle with ${isGivenSin ? 'opposite' : 'adjacent'} $${isGivenSin ? opp : adj}$ and hypotenuse $${hyp}$.`,
          `<strong>2.</strong> Use Pythagoras to find the remaining side:`,
          `$a^2 = ${hyp}^2 - ${isGivenSin ? opp : adj}^2 = ${hyp*hyp} - ${isGivenSin ? opp*opp : adj*adj} \\implies a = ${isGivenSin ? adj : opp}$`,
          `$\\${isGivenSin ? 'cos' : 'sin'} x = \\frac{${isGivenSin ? adj : opp}}{${hyp}}$`,
          `<strong>3.</strong> Use the double angle identity $\\sin 2x = 2 \\sin x \\cos x$:`,
          `$= 2 \\left(\\frac{${opp}}{${hyp}}\\right) \\left(\\frac{${adj}}{${hyp}}\\right) = \\frac{${2 * opp * adj}}{${hyp * hyp}}$`
        ],
        finalAnswer: `$\\frac{${2 * opp * adj}}{${hyp * hyp}}$`
      };
    } else {
      const cos2xNum = (adj*adj) - (opp*opp);
      return {
        subTopic: actualTopic,
        questionLines: [
          `Given that $\\${isGivenSin ? 'sin' : 'cos'} x = \\frac{${isGivenSin ? opp : adj}}{${hyp}}$, $0 < x < \\frac{\\pi}{2}$, find the exact value of $\\cos 2x$.`
        ],
        boardQuestionLines: [
          `Given $\\${isGivenSin ? 'sin' : 'cos'} x = \\frac{${isGivenSin ? opp : adj}}{${hyp}}$ ($0 < x < \\frac{\\pi}{2}$),`,
          `find exact value of $\\cos 2x$`
        ],
        solutionSteps: [
          `<strong>1.</strong> Draw a right-angled triangle with ${isGivenSin ? 'opposite' : 'adjacent'} $${isGivenSin ? opp : adj}$ and hypotenuse $${hyp}$.`,
          `<strong>2.</strong> Use Pythagoras to find the remaining side:`,
          `$\\${isGivenSin ? 'cos' : 'sin'} x = \\frac{${isGivenSin ? adj : opp}}{${hyp}}$`,
          `<strong>3.</strong> Use the double angle identity $\\cos 2x = \\cos^2 x - \\sin^2 x$:`,
          `$= \\left(\\frac{${adj}}{${hyp}}\\right)^2 - \\left(\\frac{${opp}}{${hyp}}\\right)^2 = \\frac{${adj*adj}}{${hyp * hyp}} - \\frac{${opp*opp}}{${hyp*hyp}} = \\frac{${cos2xNum}}{${hyp * hyp}}$`
        ],
        finalAnswer: `$\\frac{${cos2xNum}}{${hyp * hyp}}$`
      };
    }
  }
  
  if (actualTopic === "Trig equations") {
    // Exact forms: 4sin^2 x = 1 (=> +/- 1/2), 2sin^2 x = 1 (=> +/- 1/sqrt(2)), 4sin^2 x = 3 (=> +/- sqrt(3)/2)
    const exactForms = [
      { a: 4, c: 1, val: "1/2", baseAng: 30 },
      { a: 2, c: 1, val: "1/\\sqrt{2}", baseAng: 45 },
      { a: 4, c: 3, val: "\\sqrt{3}/2", baseAng: 60 }
    ];
    const ef = exactForms[Math.floor(Math.random() * exactForms.length)];
    const isCos = Math.random() > 0.5;
    
    return {
      subTopic: actualTopic,
      questionLines: [
        `Solve $${ef.a} \\${isCos ? 'cos' : 'sin'}^2 x^\\circ = ${ef.c}$ for $0 \\le x < 360$.`
      ],
      boardQuestionLines: [
        `Solve for $0 \\le x < 360$:`,
        `$${ef.a} \\${isCos ? 'cos' : 'sin'}^2 x^\\circ = ${ef.c}$`
      ],
      solutionSteps: [
        `<strong>1.</strong> Rearrange to make $\\${isCos ? 'cos' : 'sin'} x$ the subject:`,
        `$\\${isCos ? 'cos' : 'sin'}^2 x^\\circ = \\frac{${ef.c === 4 ? 4 /* wont happen */ : ef.c}}{${ef.a === 2 ? 2 : ef.a}}$`,
        `$\\${isCos ? 'cos' : 'sin'} x^\\circ = \\pm ${ef.val}$`,
        `<strong>2.</strong> Find the related acute angle:`,
        `$\\alpha = ${ef.baseAng}^\\circ$`,
        `<strong>3.</strong> Since $\\${isCos ? 'cos' : 'sin'} x$ is both positive and negative, we have solutions in all four quadrants:`,
        `$x = ${ef.baseAng}, 180 - ${ef.baseAng}, 180 + ${ef.baseAng}, 360 - ${ef.baseAng}$`,
        `$= ${ef.baseAng}, ${180 - ef.baseAng}, ${180 + ef.baseAng}, ${360 - ef.baseAng}$`
      ],
      finalAnswer: `$x = ${ef.baseAng}^\\circ, ${180 - ef.baseAng}^\\circ, ${180 + ef.baseAng}^\\circ, ${360 - ef.baseAng}^\\circ$`
    };
  }

  if (actualTopic === "Double angle equations") {
    const cases = [
      { eq: "\\cos 2x^\\circ = \\sin x^\\circ", identity: "1 - 2 \\sin^2 x^\\circ", sub: "\\sin x^\\circ", quad: "2 \\sin^2 x^\\circ + \\sin x^\\circ - 1 = 0", factors: "(2 \\sin x^\\circ - 1)(\\sin x^\\circ + 1) = 0", roots: "\\frac{1}{2} \\text{ or } -1", sols: "30^\\circ, 150^\\circ, 270^\\circ" },
      { eq: "\\cos 2x^\\circ + \\sin x^\\circ = 0", identity: "1 - 2 \\sin^2 x^\\circ", sub: "\\sin x^\\circ",  quad: "2 \\sin^2 x^\\circ - \\sin x^\\circ - 1 = 0", factors: "(2 \\sin x^\\circ + 1)(\\sin x^\\circ - 1) = 0", roots: "-\\frac{1}{2} \\text{ or } 1", sols: "90^\\circ, 210^\\circ, 330^\\circ" },
      { eq: "\\cos 2x^\\circ = \\cos x^\\circ", identity: "2 \\cos^2 x^\\circ - 1", sub: "\\cos x^\\circ", quad: "2 \\cos^2 x^\\circ - \\cos x^\\circ - 1 = 0", factors: "(2 \\cos x^\\circ + 1)(\\cos x^\\circ - 1) = 0", roots: "-\\frac{1}{2} \\text{ or } 1", sols: "0^\\circ, 120^\\circ, 240^\\circ" },
      { eq: "\\cos 2x^\\circ + \\cos x^\\circ = 0", identity: "2 \\cos^2 x^\\circ - 1", sub: "\\cos x^\\circ", quad: "2 \\cos^2 x^\\circ + \\cos x^\\circ - 1 = 0", factors: "(2 \\cos x^\\circ - 1)(\\cos x^\\circ + 1) = 0", roots: "\\frac{1}{2} \\text{ or } -1", sols: "60^\\circ, 180^\\circ, 300^\\circ" },
      { eq: "\\sin 2x^\\circ + \\cos x^\\circ = 0", isSin: true, factors: "\\cos x^\\circ (2 \\sin x^\\circ + 1) = 0", roots: "\\cos x^\\circ = 0 \\text{ or } \\sin x^\\circ = -\\frac{1}{2}", sols: "90^\\circ, 210^\\circ, 270^\\circ, 330^\\circ" },
      { eq: "\\sin 2x^\\circ - \\cos x^\\circ = 0", isSin: true, factors: "\\cos x^\\circ (2 \\sin x^\\circ - 1) = 0", roots: "\\cos x^\\circ = 0 \\text{ or } \\sin x^\\circ = \\frac{1}{2}", sols: "30^\\circ, 90^\\circ, 150^\\circ, 270^\\circ" },
      { eq: "\\cos 2x^\\circ - 4\\sin x^\\circ + 5 = 0", identity: "1 - 2 \\sin^2 x^\\circ", sub: "\\sin x^\\circ", quad: "(1 - 2 \\sin^2 x^\\circ) - 4\\sin x^\\circ + 5 = 0 \\newline -2\\sin^2 x^\\circ - 4\\sin x^\\circ + 6 = 0 \\implies \\sin^2 x^\\circ + 2\\sin x^\\circ - 3 = 0", factors: "(\\sin x^\\circ + 3)(\\sin x^\\circ - 1) = 0", roots: "-3 \\text{ (no sol) or } 1", sols: "90^\\circ" },
      { eq: "3\\cos 2x^\\circ - \\cos x^\\circ + 1 = 0", identity: "2 \\cos^2 x^\\circ - 1", sub: "\\cos x^\\circ", quad: "3(2 \\cos^2 x^\\circ - 1) - \\cos x^\\circ + 1 = 0 \\newline 6\\cos^2 x^\\circ - \\cos x^\\circ - 2 = 0", factors: "(3\\cos x^\\circ - 2)(2\\cos x^\\circ + 1) = 0", roots: "\\frac{2}{3} \\text{ or } -\\frac{1}{2}", sols: "48.2^\\circ, 120^\\circ, 240^\\circ, 311.8^\\circ" },
      { eq: "2\\cos 2x^\\circ + \\cos x^\\circ - 1 = 0", identity: "2 \\cos^2 x^\\circ - 1", sub: "\\cos x^\\circ", quad: "2(2 \\cos^2 x^\\circ - 1) + \\cos x^\\circ - 1 = 0 \\newline 4\\cos^2 x^\\circ + \\cos x^\\circ - 3 = 0", factors: "(4\\cos x^\\circ - 3)(\\cos x^\\circ + 1) = 0", roots: "\\frac{3}{4} \\text{ or } -1", sols: "41.4^\\circ, 180^\\circ, 318.6^\\circ" }
    ];
    const c = cases[Math.floor(Math.random() * cases.length)];

    if (c.isSin) {
      return {
        subTopic: actualTopic,
        questionLines: [
          `Solve $${c.eq}$ for $0 \\le x < 360$.`
        ],
        boardQuestionLines: [
          `Solve for $0 \\le x < 360$:`,
          `$${c.eq}$`
        ],
        solutionSteps: [
          `<strong>1.</strong> Use the double angle identity $\\sin 2x = 2 \\sin x \\cos x$:`,
          `$2 \\sin x^\\circ \\cos x^\\circ ${c.eq.includes('-') ? '-' : '+'} \\cos x^\\circ = 0$`,
          `<strong>2.</strong> Factorise out $\\cos x^\\circ$:`,
          `$${c.factors}$`,
          `$${c.roots}$`,
          `<strong>3.</strong> Solve for $x$:`,
          `$= ${c.sols}$`
        ],
        finalAnswer: `$x = ${c.sols}$`
      };
    }

    return {
      subTopic: actualTopic,
      questionLines: [
        `Solve $${c.eq}$ for $0 \\le x < 360$.`
      ],
      boardQuestionLines: [
        `Solve for $0 \\le x < 360$:`,
        `$${c.eq}$`
      ],
      solutionSteps: [
        `<strong>1.</strong> Use the double angle identity $\\cos 2x = ${c.identity}$:`,
        `$${c.quad}$`,
        `<strong>2.</strong> Factorise the quadratic:`,
        `$${c.factors}$`,
        `$${c.sub} = ${c.roots}$`,
        `<strong>3.</strong> Solve for $x$:`,
        `$= ${c.sols}$`
      ],
      finalAnswer: `$x = ${c.sols}$`
    };
  }

  if (actualTopic === "The wave function") {
    const isMinMax = Math.random() > 0.5;

    // We can have triples, or we can have surds like sqrt(2) and 2.
    const triples = [
      { A: 3, B: 4, KText: "5", K: 5 },
      { A: 5, B: 12, KText: "13", K: 13 },
      { A: 8, B: 15, KText: "17", K: 17 },
      { A: "\\sqrt{2}", A_val: Math.SQRT2, A_sq: 2, B: 2, B_val: 2, B_sq: 4, KText: "\\sqrt{6}", K: Math.sqrt(6) },
      { A: "\\sqrt{3}", A_val: Math.sqrt(3), A_sq: 3, B: 1, B_val: 1, B_sq: 1, KText: "2", K: 2 },
      { A: "\\sqrt{5}", A_val: Math.sqrt(5), A_sq: 5, B: 3, B_val: 3, B_sq: 9, KText: "\\sqrt{14}", K: Math.sqrt(14) }
    ];

    const trip = triples[Math.floor(Math.random() * triples.length)];
    let A_str = trip.A as string | number;
    let B_str = trip.B as string | number;
    let A_val = (trip as any).A_val || Number(trip.A);
    let B_val = (trip as any).B_val || Number(trip.B);
    let A_sq = (trip as any).A_sq || (Number(trip.A) * Number(trip.A));
    let B_sq = (trip as any).B_sq || (Number(trip.B) * Number(trip.B));

    if (Math.random() > 0.5) {
      const temp_str = A_str; A_str = B_str; B_str = temp_str;
      const temp_val = A_val; A_val = B_val; B_val = temp_val;
      const temp_sq = A_sq; A_sq = B_sq; B_sq = temp_sq;
    }
    
    // Randomize signs
    const signA_coeff = Math.random() > 0.5 ? 1 : -1;
    const signB_coeff = Math.random() > 0.5 ? 1 : -1;
    A_val *= signA_coeff;
    B_val *= signB_coeff;
    
    const KText = trip.KText;
    const K = trip.K;

    const isCos = Math.random() > 0.5;
    const isMinusA = Math.random() > 0.5;
    
    let expansion;
    let signA, signB;
    
    if (isCos) {
      expansion = isMinusA
        ? `k \\cos x \\cos a + k \\sin x \\sin a`
        : `k \\cos x \\cos a - k \\sin x \\sin a`;
      signA = Math.sign(A_val); // k cos a = A
      signB = isMinusA ? Math.sign(B_val) : Math.sign(-B_val);
    } else {
      expansion = isMinusA
        ? `k \\sin x \\cos a - k \\cos x \\sin a`
        : `k \\sin x \\cos a + k \\cos x \\sin a`;
      signA = Math.sign(B_val); // k cos a = B
      signB = isMinusA ? Math.sign(-A_val) : Math.sign(A_val); 
    }

    const ang = Math.atan2(signB, signA) * (180 / Math.PI);
    const finalAng = (ang < 0 ? ang + 360 : ang).toFixed(1);

    const funcName = isCos ? '\\cos' : '\\sin';
    const opSign = isMinusA ? '-' : '+';
    
    const coeff1Str = isCos ? `k \\cos a = ${signA_coeff < 0 ? '-' : ''}${A_str}` : `k \\cos a = ${signB_coeff < 0 ? '-' : ''}${B_str}`;
    const coeff2Str = isCos ? `k \\sin a = ${signB === 1 ? '' : '-'}${B_str}` : `k \\sin a = ${signB === 1 ? '' : '-'}${A_str}`;
    const quadNum = signA>0 ? (signB>0 ? 1 : 4) : (signB>0 ? 2 : 3);
    const tanNum = isCos ? (isMinusA ? B_val : -B_val) : (isMinusA ? -A_val : A_val);
    const tanDen = isCos ? A_val : B_val;

    const exprStr = `${signA_coeff < 0 ? '-' : ''}${A_str} \\cos x^\\circ ${signB_coeff > 0 ? '+' : '-'} ${B_str}\\sin x^\\circ`;

    if (!isMinMax) {
      return {
        subTopic: actualTopic,
        questionLines: [
          `Express $${exprStr}$ in the form $k ${funcName} (x ${opSign} a)^\\circ$ where $k > 0$ and $0 \\le a < 360$.`
        ],
        boardQuestionLines: [
          `Express in $k ${funcName} (x ${opSign} a)^\\circ$:`,
          `$${exprStr}$`
        ],
        solutionSteps: [
          `<strong>1.</strong> Expand $k ${funcName}(x ${opSign} a)$:`,
          isCos ? `$= (k \\cos a) \\cos x ${isMinusA ? '+' : '-'} (k \\sin a) \\sin x$` : `$= (k \\cos a) \\sin x ${isMinusA ? '-' : '+'} (k \\sin a) \\cos x$`,
          `<strong>2.</strong> Compare coefficients: ${coeff1Str} and ${coeff2Str}.`,
          `Quadrants: $\\cos a$ is ${signA > 0 ? 'positive' : 'negative'}, $\\sin a$ is ${signB > 0 ? 'positive' : 'negative'}. so $a$ is in Quadrant ${quadNum}.`,
          `<strong>3.</strong> Find angle $a$:`,
          `$\\tan a = \\frac{k \\sin a}{k \\cos a} \\implies a = ${finalAng}^\\circ$.`,
          `<strong>4.</strong> Find $k$:`,
          `$k = \\sqrt{${A_sq} + ${B_sq}} = \\sqrt{${A_sq + B_sq}} = ${KText}$.`
        ],
        finalAnswer: `$${KText} ${funcName} (x ${opSign} ${finalAng})^\\circ$`
      };
    } else {
      const C = Math.floor(Math.random() * 5) + 1;
      const isMax = Math.random() > 0.5;
      const targetVal = isMax ? K + C : -K + C;
      
      // Where does k cos(x-a) = +k or -k?
      // cos(x-a) = 1 (if isMax) => x-a = 0, 360 => x = a
      // cos(x-a) = -1 (if isMin) => x-a = 180 => x = 180+a
      // sin(x-a) = 1 (if isMax) => x-a = 90 => x = 90+a
      // sin(x-a) = -1 (if isMin) => x-a = 270 => x = 270+a
      let xSolveSteps;
      let solveExp;
      let ansAngle;
      
      if (isCos) {
        if (isMax) { solveExp = `${funcName}(x ${opSign} ${finalAng})^\\circ = 1 \\implies x ${opSign} ${finalAng} = 0^\\circ`; ansAngle = isMinusA ? parseFloat(finalAng) : 360 - parseFloat(finalAng); }
        else { solveExp = `${funcName}(x ${opSign} ${finalAng})^\\circ = -1 \\implies x ${opSign} ${finalAng} = 180^\\circ`; ansAngle = isMinusA ? 180 + parseFloat(finalAng) : 180 - parseFloat(finalAng); }
      } else {
        if (isMax) { solveExp = `${funcName}(x ${opSign} ${finalAng})^\\circ = 1 \\implies x ${opSign} ${finalAng} = 90^\\circ`; ansAngle = isMinusA ? 90 + parseFloat(finalAng) : 90 - parseFloat(finalAng); }
        else { solveExp = `${funcName}(x ${opSign} ${finalAng})^\\circ = -1 \\implies x ${opSign} ${finalAng} = 270^\\circ`; ansAngle = isMinusA ? 270 + parseFloat(finalAng) : 270 - parseFloat(finalAng); }
      }
      
      if (ansAngle < 0) ansAngle += 360;
      if (ansAngle >= 360) ansAngle -= 360;

      return {
        subTopic: actualTopic,
        questionLines: [
          `<strong>(a)</strong> Express $${exprStr}$ in the form $k ${funcName} (x ${opSign} a)^\\circ$ where $k > 0$ and $0 \\le a < 360$.`,
          `<strong>(b)</strong> State the ${isMax ? 'maximum' : 'minimum'} value of $y = ${exprStr} + ${C}$ and the value of $x$ where it occurs ($0 \\le x < 360$).`
        ],
        boardQuestionLines: [
          `$y = ${exprStr} + ${C}$`,
          `Find the ${isMax ? 'max' : 'min'} value and the $x$ value where it occurs.`
        ],
        solutionSteps: [
          `<strong>(a)</strong> Expand $k ${funcName}(x ${opSign} a)$:`,
          `$k = \\sqrt{${A_sq} + ${B_sq}} = ${KText}$ and $a = ${finalAng}^\\circ$ (from quadrant ${quadNum}).`,
          `$\\implies ${KText} ${funcName} (x ${opSign} ${finalAng})^\\circ$.`,
          `<strong>(b)</strong> To find the ${isMax ? 'maximum' : 'minimum'}, rewrite $y = ${KText} ${funcName} (x ${opSign} ${finalAng})^\\circ + ${C}$.`,
          `The ${isMax ? 'maximum' : 'minimum'} value of $\\${funcName}$ is ${isMax ? '1' : '-1'}, so the ${isMax ? 'maximum' : 'minimum'} value is $${isMax ? '' : '-'}${KText} + ${C}$.`,
          `This occurs when $${solveExp}$.`,
          `$\\implies x = ${ansAngle.toFixed(1)}^\\circ$.`
        ],
        finalAnswer: `${isMax ? 'Max' : 'Min'} is $${isMax ? '' : '-'}${KText} + ${C}$ at $x = ${ansAngle.toFixed(1)}^\\circ$`
      };
    }
  }

  if (actualTopic === "Wave equations") {
    const triples = [[3, 4, 5], [5, 12, 13]];
    const trip = triples[Math.floor(Math.random() * triples.length)];
    let A = trip[0];
    let B = trip[1];
    if (Math.random() > 0.5) { A = trip[1]; B = trip[0]; }
    
    A *= Math.random() > 0.5 ? 1 : -1;
    B *= Math.random() > 0.5 ? 1 : -1;
    const K = trip[2];
    
    const isCos = Math.random() > 0.5;
    const isMinusA = Math.random() > 0.5;
    
    let expansion;
    let signA, signB;
    
    if (isCos) {
      expansion = isMinusA
        ? `k \\cos x \\cos a + k \\sin x \\sin a`
        : `k \\cos x \\cos a - k \\sin x \\sin a`;
      signA = Math.sign(A); // k cos a = A
      signB = isMinusA ? Math.sign(B) : Math.sign(-B);
    } else {
      expansion = isMinusA
        ? `k \\sin x \\cos a - k \\cos x \\sin a`
        : `k \\sin x \\cos a + k \\cos x \\sin a`;
      signA = Math.sign(B); // k cos a = B
      signB = isMinusA ? Math.sign(-A) : Math.sign(A); 
    }

    // Choose C such that it's nicely bounded and not K
    const vals = [1, 2, K - 1];
    const C = vals[Math.floor(Math.random() * vals.length)] * (Math.random() > 0.5 ? 1 : -1);

    const ang = Math.atan2(signB, signA) * (180 / Math.PI);
    const alpha = (ang < 0 ? ang + 360 : ang).toFixed(1);

    const relAng = isCos ? 
                   (Math.acos(Math.abs(C) / K) * (180 / Math.PI)).toFixed(1) :
                   (Math.asin(Math.abs(C) / K) * (180 / Math.PI)).toFixed(1);

    const quad1Str = isCos ? (C > 0 ? `Q1, Q4` : `Q2, Q3`) : (C > 0 ? `Q1, Q2` : `Q3, Q4`);
    
    const funcName = isCos ? '\\cos' : '\\sin';
    const opSign = isMinusA ? '-' : '+';
    
    const coeff1Str = isCos ? `k \\cos a = ${A}` : `k \\cos a = ${B}`;
    const coeff2Str = isCos ? `k \\sin a = ${isMinusA ? B : -B}` : `k \\sin a = ${isMinusA ? -A : A}`;
    const quadNum = signA>0 ? (signB>0 ? 1 : 4) : (signB>0 ? 2 : 3);
    const tanNum = isCos ? (isMinusA ? B : -B) : (isMinusA ? -A : A);
    const tanDen = isCos ? A : B;

    return {
      subTopic: actualTopic,
      questionLines: [
        `Solve $${A} \\cos x^\\circ ${B > 0 ? '+' : '-'} ${Math.abs(B)} \\sin x^\\circ = ${C}$ for $0 \\le x < 360$.`
      ],
      boardQuestionLines: [
        `Solve for $0 \\le x < 360$:`,
        `$${A} \\cos x^\\circ ${B > 0 ? '+' : '-'} ${Math.abs(B)} \\sin x^\\circ = ${C}$`
      ],
      solutionSteps: [
        `<strong>1.</strong> Express LHS as $k ${funcName}(x ${opSign} a)$: ${coeff1Str}, ${coeff2Str}.`,
        `$\\tan a = \\frac{${tanNum}}{${tanDen}} \\implies a = ${alpha}^\\circ$ (Quad ${quadNum}).`,
        `$k^2 = ${A*A} + ${B*B} = ${K*K} \\implies k = ${K}$.`,
        `So $${K} ${funcName}(x ${opSign} ${alpha})^\\circ = ${C}$.`,
        `<strong>2.</strong> Solve the equation:`,
        `$\\${funcName.substring(1)}(x ${opSign} ${alpha})^\\circ = \\frac{${C}}{${K}}$`,
        `<strong>3.</strong> Find the related acute angle:`,
        `$\\theta_{rel} = \\${funcName.substring(1)}^{-1}\\left(\\frac{${Math.abs(C)}}{${K}}\\right) = ${relAng}^\\circ$`,
        `<strong>4.</strong> Identify solutions in ${quad1Str} and solve for $x$.`
      ],
      finalAnswer: `Solve fully taking care of quadrants ${quad1Str} using shift of ${isMinusA ? '+' : '-'}${alpha}^\\circ.`
    };
  }

  if (actualTopic === "Trig identities") {
    const identities = [
      {
        q: "\\frac{\\sin 2x}{2\\cos x} - \\sin x \\cos^2 x = \\sin^3 x",
        lhs: "\\frac{\\sin 2x}{2\\cos x} - \\sin x \\cos^2 x",
        rhs: "\\sin^3 x",
        steps: [
          `<strong>1.</strong> Start with the Left Hand Side (LHS):`,
          `$= \\frac{\\sin 2x}{2\\cos x} - \\sin x \\cos^2 x$`,
          `<strong>2.</strong> Substitute $\\sin 2x = 2 \\sin x \\cos x$:`,
          `$= \\frac{2\\sin x \\cos x}{2\\cos x} - \\sin x \\cos^2 x$`,
          `<strong>3.</strong> Cancel $2\\cos x$ in the fraction:`,
          `$= \\sin x - \\sin x \\cos^2 x$`,
          `<strong>4.</strong> Factorise out $\\sin x$:`,
          `$= \\sin x (1 - \\cos^2 x)$`,
          `<strong>5.</strong> Use the identity $1 - \\cos^2 x = \\sin^2 x$:`,
          `$= \\sin x (\\sin^2 x)$`,
          `$= \\sin^3 x$`,
          `$= \\text{RHS}$`
        ]
      },
      {
        q: "(\\sin x + \\cos x)^2 = 1 + \\sin 2x",
        lhs: "(\\sin x + \\cos x)^2",
        rhs: "1 + \\sin 2x",
        steps: [
          `<strong>1.</strong> Start with the Left Hand Side (LHS):`,
          `$= (\\sin x + \\cos x)^2$`,
          `<strong>2.</strong> Expand the brackets:`,
          `$= \\sin^2 x + 2 \\sin x \\cos x + \\cos^2 x$`,
          `<strong>3.</strong> Rearrange and use $\\sin^2 x + \\cos^2 x = 1$:`,
          `$= (\\sin^2 x + \\cos^2 x) + 2 \\sin x \\cos x$`,
          `$= 1 + 2 \\sin x \\cos x$`,
          `<strong>4.</strong> Use the double angle identity $\\sin 2x = 2 \\sin x \\cos x$:`,
          `$= 1 + \\sin 2x$`,
          `$= \\text{RHS}$`
        ]
      },
      {
        q: "\\frac{\\cos 2x}{\\cos x + \\sin x} = \\cos x - \\sin x",
        lhs: "\\frac{\\cos 2x}{\\cos x + \\sin x}",
        rhs: "\\cos x - \\sin x",
        steps: [
          `<strong>1.</strong> Start with the Left Hand Side (LHS):`,
          `$= \\frac{\\cos 2x}{\\cos x + \\sin x}$`,
          `<strong>2.</strong> Substitute $\\cos 2x = \\cos^2 x - \\sin^2 x$:`,
          `$= \\frac{\\cos^2 x - \\sin^2 x}{\\cos x + \\sin x}$`,
          `<strong>3.</strong> Factorise the numerator as a difference of two squares:`,
          `$= \\frac{(\\cos x - \\sin x)(\\cos x + \\sin x)}{\\cos x + \\sin x}$`,
          `<strong>4.</strong> Cancel the common factor $(\\cos x + \\sin x)$:`,
          `$= \\cos x - \\sin x$`,
          `$= \\text{RHS}$`
        ]
      },
      {
        q: "\\frac{1 - \\cos 2x}{2 \\sin x} = \\sin x",
        lhs: "\\frac{1 - \\cos 2x}{2 \\sin x}",
        rhs: "\\sin x",
        steps: [
          `<strong>1.</strong> Start with the Left Hand Side (LHS):`,
          `$= \\frac{1 - \\cos 2x}{2 \\sin x}$`,
          `<strong>2.</strong> Substitute $\\cos 2x = 1 - 2 \\sin^2 x$:`,
          `$= \\frac{1 - (1 - 2 \\sin^2 x)}{2 \\sin x}$`,
          `<strong>3.</strong> Simplify the numerator:`,
          `$= \\frac{2 \\sin^2 x}{2 \\sin x}$`,
          `<strong>4.</strong> Cancel the common factor $2 \\sin x$:`,
          `$= \\sin x$`,
          `$= \\text{RHS}$`
        ]
      }
    ];

    const ident = identities[Math.floor(Math.random() * identities.length)];

    return {
      subTopic: actualTopic,
      questionLines: [
        `Show that $${ident.q}$.`
      ],
      boardQuestionLines: [
        `Show that:`,
        `$${ident.q}$`
      ],
      solutionSteps: ident.steps,
      finalAnswer: "Proof complete."
    };
  }

  return {
    subTopic: actualTopic,
    questionLines: ["Missing trigonometry question"],
    boardQuestionLines: ["Missing"],
    solutionSteps: ["Error"],
    finalAnswer: "Error"
  };
}

