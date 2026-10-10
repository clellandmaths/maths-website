import { GeneratedQuestion, Topic, TOPIC_GROUPS } from "./types";
import { getRandomInt, nonZeroInt, Point, formatNum, gcd, simplifyFraction, formatFraction, formatFractionWithSub, formatTerm, formatEquation, generateTriangle } from "./utils";

export function generateMedianQuestion(): Omit<GeneratedQuestion, "topic"> {
  const { A, B, C } = generateTriangle((A, B, C) => {
    let Mx = A.x + B.x;
    let My = A.y + B.y;
    let num = My - 2 * C.y;
    let den = Mx - 2 * C.x;
    return num !== 0 && den !== 0;
  });

  let Mx = A.x + B.x;
  let My = A.y + B.y;
  let mNum = My - 2 * C.y;
  let mDen = Mx - 2 * C.x;

  let M_fmt = `(${formatFraction(Mx, 2)}, ${formatFraction(My, 2)})`;
  let { num: m_num, den: m_den } = simplifyFraction(mNum, mDen);

  let m_fmt = formatFractionWithSub(m_num, m_den);

  let a_coeff = m_num;
  let b_coeff = -m_den;
  let c_coeff = m_den * C.y - m_num * C.x;
  let eq = formatEquation(a_coeff, b_coeff, c_coeff);

  return {
    subTopic: "Median",
    questionLines: [
      `A triangle has vertices $A(${A.x}, ${A.y})$, $B(${B.x}, ${B.y})$ and $C(${C.x}, ${C.y})$.`,
      `Find the equation of the median from $C$.`
    ],
    solutionSteps: [
      `<strong>1.</strong> Find the midpoint, $M$, of $AB$:<br><br>$M = \\left(\\frac{x_A + x_B}{2}, \\frac{y_A + y_B}{2} \\right)$<br><br>$M = \\left(\\frac{${A.x} + ${formatNum(B.x)}}{2}, \\frac{${A.y} + ${formatNum(B.y)}}{2} \\right)$<br><br>$M = ${M_fmt}$`,
      `<strong>2.</strong> Find the gradient of the median, $CM$:<br><br>$m_{CM} = \\frac{y_C - y_M}{x_C - x_M}$<br><br>$m_{CM} = \\frac{${C.y} - ${formatFraction(My, 2)}}{${C.x} - ${formatFraction(Mx, 2)}} = ${m_fmt}$`,
      `<strong>3.</strong> Find the equation of the line passing through $C(${C.x}, ${C.y})$ with gradient $m = ${m_fmt}$:<br><br>$y - b = m(x - a)$<br><br>$y - ${formatNum(C.y)} = ${m_fmt}(x - ${formatNum(C.x)})$<br><br>$${eq}$`,
    ],
    finalAnswer: `$${eq}$`,
  };
}



export function generateAltitudeQuestion(): Omit<GeneratedQuestion, "topic"> {
  const { A, B, C } = generateTriangle((A, B, C) => true);

  let mBC_num = C.y - B.y;
  let mBC_den = C.x - B.x;

  let bc_f = simplifyFraction(mBC_num, mBC_den);
  let alt_num = -bc_f.den;
  let alt_den = bc_f.num;

  let alt_m = simplifyFraction(alt_num, alt_den);

  let bc_fmt = formatFractionWithSub(bc_f.num, bc_f.den);
  let alt_fmt = formatFractionWithSub(alt_m.num, alt_m.den);

  let a_coeff = alt_m.num;
  let b_coeff = -alt_m.den;
  let c_coeff = alt_m.den * A.y - alt_m.num * A.x;
  let eq = formatEquation(a_coeff, b_coeff, c_coeff);

  return {
    subTopic: "Altitude",
    questionLines: [
      `A triangle has vertices $A(${A.x}, ${A.y})$, $B(${B.x}, ${B.y})$ and $C(${C.x}, ${C.y})$.`,
      `Find the equation of the altitude from $A$.`
    ],
    solutionSteps: [
      `<strong>1.</strong> Find the gradient of $BC$:<br><br>$m_{BC} = \\frac{y_C - y_B}{x_C - x_B}$<br><br>$m_{BC} = \\frac{${C.y} - ${formatNum(B.y)}}{${C.x} - ${formatNum(B.x)}} = ${bc_fmt}$`,
      `<strong>2.</strong> Find the gradient of the altitude:<br><br>Since the altitude is perpendicular to $BC$, $m_{alt} \\times m_{BC} = -1$<br><br>$m_{alt} = ${alt_fmt}$`,
      `<strong>3.</strong> Find the equation of the line passing through $A(${A.x}, ${A.y})$ with gradient $m = ${alt_fmt}$:<br><br>$y - b = m(x - a)$<br><br>$y - ${formatNum(A.y)} = ${alt_fmt}(x - ${formatNum(A.x)})$<br><br>$${eq}$`,
    ],
    finalAnswer: `$${eq}$`,
  };
}



export function generatePerpBisectorQuestion(): Omit<GeneratedQuestion, "topic"> {
  let A: Point, B: Point;
  while (true) {
    A = { x: getRandomInt(-10, 10), y: getRandomInt(-10, 10) };
    B = { x: getRandomInt(-10, 10), y: getRandomInt(-10, 10) };
    if (A.x === B.x || A.y === B.y) continue;
    break;
  }

  let mAB_num = B.y - A.y;
  let mAB_den = B.x - A.x;

  let ab_f = simplifyFraction(mAB_num, mAB_den);
  let perp_num = -ab_f.den;
  let perp_den = ab_f.num;
  let perp_m = simplifyFraction(perp_num, perp_den);

  let ab_fmt = formatFractionWithSub(ab_f.num, ab_f.den);
  let perp_fmt = formatFractionWithSub(perp_m.num, perp_m.den);

  let Mx = A.x + B.x;
  let My = A.y + B.y;
  let M_fmt = `\\left(${formatFraction(Mx, 2)}, ${formatFraction(My, 2)}\\right)`;

  let a_coeff = 2 * perp_m.num;
  let b_coeff = -2 * perp_m.den;
  let c_coeff = perp_m.den * My - perp_m.num * Mx;

  let g = gcd(gcd(a_coeff, b_coeff), c_coeff);
  a_coeff /= g;
  b_coeff /= g;
  c_coeff /= g;

  let eq = formatEquation(a_coeff, b_coeff, c_coeff);

  return {
    subTopic: "Perpendicular Bisector",
    questionLines: [
      `Find the equation of the perpendicular bisector of the line joining $A(${A.x}, ${A.y})$ and $B(${B.x}, ${B.y})$.`
    ],
    solutionSteps: [
      `<strong>1.</strong> Find the midpoint, $M$, of $AB$:<br><br>$M = \\left(\\frac{x_A + x_B}{2}, \\frac{y_A + y_B}{2} \\right)$<br><br>$M = \\left(\\frac{${A.x} + ${formatNum(B.x)}}{2}, \\frac{${A.y} + ${formatNum(B.y)}}{2} \\right)$<br><br>$M = ${M_fmt}$`,
      `<strong>2.</strong> Find the gradient of $AB$:<br><br>$m_{AB} = \\frac{y_B - y_A}{x_B - x_A}$<br><br>$m_{AB} = \\frac{${B.y} - ${formatNum(A.y)}}{${B.x} - ${formatNum(A.x)}} = ${ab_fmt}$`,
      `<strong>3.</strong> Find the gradient of the perpendicular bisector:<br><br>Since the lines are perpendicular, $m_{perp} \\times m_{AB} = -1$<br><br>$m_{perp} = ${perp_fmt}$`,
      `<strong>4.</strong> Find the equation of the line passing through $M ${M_fmt}$ with gradient $m = ${perp_fmt}$:<br><br>$y - b = m(x - a)$<br><br>$y - ${formatFraction(My, 2)} = ${perp_fmt}\\left(x - ${formatFraction(Mx, 2)}\\right)$<br><br>$${eq}$`,
    ],
    finalAnswer: `$${eq}$`,
  };
}



export function generateParallelLineQuestion(): Omit<GeneratedQuestion, "topic"> {
  let A = getRandomInt(-5, 5);
  let B = getRandomInt(-5, 5);
  while (A === 0 || B === 0 || gcd(A, B) !== 1) {
    A = getRandomInt(-5, 5);
    B = getRandomInt(-5, 5);
  }
  if (A < 0) {
    A = -A;
    B = -B;
  }

  const C = getRandomInt(-10, 10);
  const pt = { x: getRandomInt(-10, 10), y: getRandomInt(-10, 10) };

  let eq = formatEquation(A, B, C);
  const mFmt = formatFractionWithSub(-A, B);

  let c2 = -(A * pt.x + B * pt.y);
  const finalEq = formatEquation(A, B, c2);

  let bTerm = B > 0 ? `${B}y` : `-${Math.abs(B)}y`;
  let aTermRight = -A > 0 ? `${-A}x` : `-${Math.abs(A)}x`;
  let cTermRight = -C > 0 ? `+ ${-C}` : -C < 0 ? `- ${Math.abs(C)}` : "";

  return {
    subTopic: "Parallel Line",
    questionLines: [
      `Find the equation of a line passing through $P(${pt.x}, ${pt.y})$ and parallel to $${eq}$.`
    ],
    solutionSteps: [
      `<strong>1.</strong> Find the gradient of the given line:<br><br>Rearrange $${eq}$ to $y = mx + c$:<br>$${bTerm} = ${aTermRight} ${cTermRight}$<br>$y = ${mFmt}x + ...$<br><br>So, $m = ${mFmt}$`,
      `<strong>2.</strong> Parallel lines have equal gradients, so the new line has gradient $m = ${mFmt}$.`,
      `<strong>3.</strong> Find the equation of the line passing through $P(${pt.x}, ${pt.y})$:<br><br>$y - b = m(x - a)$<br><br>$y - ${formatNum(pt.y)} = ${mFmt}(x - ${formatNum(pt.x)})$<br><br>$${finalEq}$`,
    ],
    finalAnswer: `$${finalEq}$`,
  };
}



export function generatePerpendicularLineQuestion(): Omit<GeneratedQuestion, "topic"> {
  let A = getRandomInt(-5, 5);
  let B = getRandomInt(-5, 5);
  while (A === 0 || B === 0 || gcd(A, B) !== 1) {
    A = getRandomInt(-5, 5);
    B = getRandomInt(-5, 5);
  }
  if (A < 0) {
    A = -A;
    B = -B;
  }

  const C = getRandomInt(-10, 10);
  const pt = { x: getRandomInt(-10, 10), y: getRandomInt(-10, 10) };

  let eq = formatEquation(A, B, C);
  const m1Fmt = formatFractionWithSub(-A, B);
  const m2Fmt = formatFractionWithSub(B, A);

  let c2 = -(B * pt.x - A * pt.y);
  const finalEq = formatEquation(B, -A, c2);

  let bTerm = B > 0 ? `${B}y` : `-${Math.abs(B)}y`;
  let aTermRight = -A > 0 ? `${-A}x` : `-${Math.abs(A)}x`;
  let cTermRight = -C > 0 ? `+ ${-C}` : -C < 0 ? `- ${Math.abs(C)}` : "";

  return {
    subTopic: "Perpendicular Line",
    questionLines: [
      `Find the equation of $L_2$ passing through $(${pt.x}, ${pt.y})$, given it is perpendicular to $L_1$: $${eq}$.`
    ],
    solutionSteps: [
      `<strong>1.</strong> Find the gradient of $L_1$:<br><br>Rearrange $${eq}$ to $y = mx + c$:<br>$${bTerm} = ${aTermRight} ${cTermRight}$<br>$y = ${m1Fmt}x + ...$<br><br>So, $m_1 = ${m1Fmt}$`,
      `<strong>2.</strong> Since $L_2$ is perpendicular to $L_1$, $m_1 \\times m_2 = -1$.<br><br>So $m_2 = ${m2Fmt}$`,
      `<strong>3.</strong> Find the equation of $L_2$ passing through $(${pt.x}, ${pt.y})$:<br><br>$y - b = m(x - a)$<br><br>$y - ${formatNum(pt.y)} = ${m2Fmt}(x - ${formatNum(pt.x)})$<br><br>$${finalEq}$`,
    ],
    finalAnswer: `$${finalEq}$`,
  };
}



export function generateCollinearityQuestion(): Omit<GeneratedQuestion, "topic"> {
  const isCollinear = Math.random() < 0.5;

  let ptA = { x: getRandomInt(-8, 8), y: getRandomInt(-8, 8) };
  let dx = getRandomInt(1, 4);
  let dy = getRandomInt(-4, 4);
  while (dy === 0) {
    dy = getRandomInt(-4, 4);
  }

  let ptB = { x: ptA.x + dx, y: ptA.y + dy };
  let ptC: Point;

  if (isCollinear) {
    let mult = getRandomInt(2, 4);
    ptC = { x: ptA.x + mult * dx, y: ptA.y + mult * dy };
  } else {
    let mult = getRandomInt(2, 4);
    ptC = {
      x: ptA.x + mult * dx,
      y: ptA.y + mult * dy + (Math.random() < 0.5 ? 1 : -1),
    };
  }

  const mAB_n = ptB.y - ptA.y;
  const mAB_d = ptB.x - ptA.x;
  const mBC_n = ptC.y - ptB.y;
  const mBC_d = ptC.x - ptB.x;

  const ab_fmt = formatFractionWithSub(mAB_n, mAB_d);
  const bc_fmt = formatFractionWithSub(mBC_n, mBC_d);

  let conclusionStep = isCollinear
    ? `Since $m_{AB} = m_{BC} = ${ab_fmt}$, the lines $AB$ and $BC$ are parallel.<br>Furthermore, $B$ is a common point to both lines.<br><br>Therefore, the points $A$, $B$ and $C$ are collinear.`
    : `Since $m_{AB} \\neq m_{BC}$ ($${ab_fmt} \\neq ${bc_fmt}$), the lines $AB$ and $BC$ are not parallel.<br><br>Therefore, the points $A$, $B$ and $C$ are not collinear.`;

  return {
    subTopic: "Collinearity",
    questionLines: [
      `Are the points $A(${ptA.x}, ${ptA.y})$, $B(${ptB.x}, ${ptB.y})$ and $C(${ptC.x}, ${ptC.y})$ collinear? Justify your answer.`
    ],
    solutionSteps: [
      `<strong>1.</strong> Determine the gradient of $AB$:<br><br>$m_{AB} = \\frac{y_B - y_A}{x_B - x_A}$<br><br>$m_{AB} = \\frac{${ptB.y} - ${formatNum(ptA.y)}}{${ptB.x} - ${formatNum(ptA.x)}} = \\frac{${mAB_n}}{${mAB_d}} = ${ab_fmt}$`,
      `<strong>2.</strong> Determine the gradient of $BC$:<br><br>$m_{BC} = \\frac{y_C - y_B}{x_C - x_B}$<br><br>$m_{BC} = \\frac{${ptC.y} - ${formatNum(ptB.y)}}{${ptC.x} - ${formatNum(ptB.x)}} = \\frac{${mBC_n}}{${mBC_d}} = ${bc_fmt}$`,
      `<strong>3.</strong> Check for parallel lines and common points to form a conclusion:<br><br>${conclusionStep}`,
    ],
    finalAnswer: isCollinear ? `Yes, collinear.` : `Not collinear.`,
  };
}



export function generateTanThetaQuestion(): Omit<GeneratedQuestion, "topic"> {
  const isFindGradientOnly = Math.random() < 0.5;

  if (isFindGradientOnly) {
    // Some nice angles or random angles
    const angles = [30, 45, 60, 135, 120, 150, 50, 37.5, 13, 123.1, 116.6];
    const angle = angles[Math.floor(Math.random() * angles.length)];
    let grad = Math.tan(angle * Math.PI / 180);
    
    // nice formatting for known angles if needed, but the PDF just gives decimal approximations
    let gradStr = grad.toFixed(2);
    // special cases for exact math if you wanted, but pdf answers give 1.19, 0.77, etc.

    return {
      subTopic: "Angle with x-axis",
      questionLines: [
        `Calculate the gradient of the line given the angle it makes with the positive direction of the $x$-axis is $${angle}^\\circ$.`
      ],
      boardQuestionLines: [
        `Calculate the gradient of the line. Angle with positive $x$-axis $= ${angle}^\\circ$.`
      ],
      solutionSteps: [
        `<strong>1.</strong> The gradient is given by the formula $m = \\tan \\theta$.`,
        `<strong>2.</strong> $m = \\tan(${angle}^\\circ) \\approx ${gradStr}$`
      ],
      finalAnswer: `$${gradStr}$`,
    };
  }

  const angle = Math.random() < 0.5 ? 45 : 135;
  const m = angle === 45 ? 1 : -1;
  const pt = { x: getRandomInt(-10, 10), y: getRandomInt(-10, 10) };

  const c = pt.y - m * pt.x;
  let finalC = formatNum(-pt.y + m * pt.x);

  let eqStr = `y = ${m === 1 ? "x" : "-x"} ${c !== 0 ? (c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`) : ""}`;

  return {
    subTopic: "Angle with x-axis",
    questionLines: [
      `Determine the equation of the line passing through $(${pt.x}, ${pt.y})$ making an angle of $${angle}^\\circ$ with the positive $x$-axis.`
    ],
    boardQuestionLines: [
      `Find equation of line through $(${pt.x}, ${pt.y})$ making $${angle}^\\circ$ with positive $x$-axis.`
    ],
    solutionSteps: [
      `<strong>1.</strong> The gradient is given by $m = \\tan \\theta$.<br><br>$m = \\tan ${angle}^\\circ$<br>$m = ${m}$`,
      `<strong>2.</strong> Substitute into $y - b = m(x - a)$:<br><br>$y - ${formatNum(pt.y)} = ${m}(x - ${formatNum(pt.x)})$<br><br>$${eqStr}$`,
    ],
    finalAnswer: `$${eqStr}$`,
  };
}



export function generateCalculateAngleQuestion(): Omit<GeneratedQuestion, "topic"> {
  const isAngleBetweenLines = Math.random() < 0.3;

  if (isAngleBetweenLines) {
    let m1 = getRandomInt(1, 4);
    let m2 = getRandomInt(1, 4) * -1; // one positive, one negative gradient for nice diagram

    let a1 = Math.atan(m1) * (180 / Math.PI);
    let a2 = Math.atan(m2) * (180 / Math.PI);
    if (a1 < 0) a1 += 180;
    if (a2 < 0) a2 += 180;
    
    // the angle x is typically the acute angle or the angle formed between them
    let angleBet = Math.abs(a1 - a2);
    if (angleBet > 180) angleBet = 360 - angleBet;
    if (angleBet > 90) angleBet = 180 - angleBet;

    let eq1 = `y = ${m1 === 1 ? 'x' : m1 + 'x'}`;
    let eq2 = `y = ${m2 === -1 ? '-x' : m2 + 'x'} + ${getRandomInt(1, 8)}`;

    return {
      subTopic: "Calculate Angle",
      questionLines: [
        `The lines $${eq1}$ and $${eq2}$ intersect.`,
        `Calculate the size of the acute angle between the two lines.`
      ],
      boardQuestionLines: [
        `Lines $${eq1}$ and $${eq2}$.`,
        `Calculate acute angle between them.`
      ],
      solutionSteps: [
        `<strong>1.</strong> Determine the gradient of each line:<br>$m_1 = ${m1}$, $m_2 = ${m2}$`,
        `<strong>2.</strong> Calculate the angle each line makes with the positive $x$-axis using $m = \\tan \\theta$:<br>$\\tan \\theta_1 = ${m1} \\implies \\theta_1 = ${a1.toFixed(1)}^\\circ$<br>$\\tan \\theta_2 = ${m2} \\implies \\theta_2 = ${a2.toFixed(1)}^\\circ$`,
        `<strong>3.</strong> Calculate the angle between the lines:<br>Angle $= |${a1.toFixed(1)}^\\circ - ${a2.toFixed(1)}^\\circ| = ${Math.abs(a1 - a2).toFixed(1)}^\\circ$`,
        `Acute angle $= ${angleBet.toFixed(1)}^\\circ$`
      ],
      finalAnswer: `$${angleBet.toFixed(1)}^\\circ$`
    };
  }

  let A = { x: getRandomInt(-5, 5), y: getRandomInt(-5, 5) };
  let B = { x: getRandomInt(-5, 5), y: getRandomInt(-5, 5) };
  while (A.x === B.x || A.y === B.y) {
    B = { x: getRandomInt(-5, 5), y: getRandomInt(-5, 5) };
  }

  let num = B.y - A.y;
  let den = B.x - A.x;
  let f = simplifyFraction(num, den);

  let m_val = num / den;
  let angle = Math.atan(m_val) * (180 / Math.PI);
  if (angle < 0) angle += 180;

  let roundedAngle = angle.toFixed(1);

  return {
    subTopic: "Calculate Angle",
    questionLines: [
      `Calculate the size of the angle of the line connecting $A(${A.x}, ${A.y})$ and $B(${B.x}, ${B.y})$ and the positive direction of the $x$-axis.`
    ],
    boardQuestionLines: [
      `Angle of line connecting $A(${A.x}, ${A.y})$ and $B(${B.x}, ${B.y})$ with positive $x$-axis.`
    ],
    solutionSteps: [
      `<strong>1.</strong> Determine the gradient of the line $AB$:<br><br>$m_{AB} = \\frac{y_B - y_A}{x_B - x_A} = \\frac{${B.y} - ${formatNum(A.y)}}{${B.x} - ${formatNum(A.x)}} = ${formatFractionWithSub(f.num, f.den)}$`,
      `<strong>2.</strong> Use $m = \\tan \\theta$, where $\\theta$ is the angle with the positive $x$-axis:<br><br>$\\tan \\theta = ${formatFractionWithSub(f.num, f.den)}$`,
      `<strong>3.</strong> Calculate the angle:<br><br>$\\theta = \\tan^{-1}\\left(${formatFractionWithSub(f.num, f.den)}\\right) \\approx ${roundedAngle}^\\circ$`,
    ],
    finalAnswer: `$${roundedAngle}^\\circ$`,
  };
}



export function generateIntersectionQuestion(): Omit<GeneratedQuestion, "topic"> {
  let X = getRandomInt(-5, 5);
  let Y = getRandomInt(-5, 5);

  let A1, B1, A2, B2;
  while (true) {
    A1 = getRandomInt(-4, 4) || 1;
    B1 = getRandomInt(-4, 4) || 2;
    A2 = getRandomInt(-4, 4) || -1;
    B2 = getRandomInt(-4, 4) || 3;
    if (A1 * B2 !== A2 * B1) break;
  }

  let C1 = A1 * X + B1 * Y;
  let C2 = A2 * X + B2 * Y;

  let eq1 = formatEquation(A1, B1, -C1);
  let eq2 = formatEquation(A2, B2, -C2);

  return {
    subTopic: "Point of Intersection",
    questionLines: [
      `Find the point of intersection of $${eq1}$ and $${eq2}$.`
    ],
    solutionSteps: [
      `<strong>1.</strong> Set up the system of simultaneous equations to find the intersection point between the two lines.`,
      `<strong>2.</strong> Scale the equations where necessary to eliminate either $x$ or $y$ (by addition or subtraction), or use substitution.`,
      `<strong>3.</strong> Solve to find the coordinates $x = ${X}$ and $y = ${Y}$.<br><br>The point of intersection is $(${X}, ${Y})$.`,
    ],
    finalAnswer: `$(${X}, ${Y})$`,
  };
}



export function generateUnknownCoordinateQuestion(): Omit<GeneratedQuestion, "topic"> {
  let ptA = { x: getRandomInt(-10, 10), y: getRandomInt(-10, 10) };
  let dx = getRandomInt(1, 4) * (Math.random() < 0.5 ? 1 : -1);
  let dy = getRandomInt(1, 4) * (Math.random() < 0.5 ? 1 : -1);

  let ptB = { x: ptA.x + dx, y: ptA.y + dy };
  let m_fmt = formatFractionWithSub(dy, dx);

  let a_coeff = -dy;
  let b_coeff = dx;
  let c_coeff = getRandomInt(-10, 10);
  let eq = formatEquation(a_coeff, b_coeff, c_coeff);

  return {
    subTopic: "Unknown Coordinate",
    questionLines: [
      `Given $A(${ptA.x}, ${ptA.y})$ and $B(${ptB.x}, t)$, determine $t$ if line $AB$ is parallel to $${eq}$.`
    ],
    solutionSteps: [
      `<strong>1.</strong> Find the gradient of the given line by rearranging it into $y = mx + c$:<br><br>$m = ${m_fmt}$`,
      `<strong>2.</strong> Since the lines are parallel, they have equal gradients. Therefore, $m_{AB} = ${m_fmt}$.`,
      `<strong>3.</strong> Use the gradient formula $m = \\frac{y_2 - y_1}{x_2 - x_1}$ to solve for $t$:<br><br>$\\frac{t - ${formatNum(ptA.y)}}{${ptB.x} - ${formatNum(ptA.x)}} = ${m_fmt}$<br><br>$t = ${ptB.y}$`,
    ],
    finalAnswer: `$t = ${ptB.y}$`,
  };
}



