import { getRandomInt, nonZeroInt, Point, formatNum, gcd, simplifyFraction, formatFraction, formatFractionWithSub, formatTerm, formatEquation, generateTriangle } from "./utils";
import { GeneratedQuestion, Topic, TOPIC_GROUPS } from "./types";

export function generateCircleQuestion(selectedTopic: string): Omit<GeneratedQuestion, "topic"> {
  const topics = TOPIC_GROUPS["Circle"];
  let type = topics.indexOf(selectedTopic as Topic);
  if (type === -1) type = Math.floor(Math.random() * topics.length);
  const actualTopic = topics[type];

  
  if (actualTopic === "Equation of circle") {
    if (Math.random() > 0.5) {
      // Variation 1: From diameter endpoints
      const x1 = getRandomInt(-5, 5) * 2 + 1; // Odd
      const y1 = getRandomInt(-5, 5) * 2;     // Even
      
      const dx = getRandomInt(1, 3) * 2;
      const dy = getRandomInt(1, 3) * 2;
      
      const x2 = x1 + dx;
      const y2 = y1 + dy;
      
      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2;
      const r2 = Math.pow((x1 - x2)/2, 2) + Math.pow((y1 - y2)/2, 2);

      return {
        subTopic: actualTopic,
        questionLines: [
          `A is the point $(${x1}, ${y1})$ and B is the point $(${x2}, ${y2})$.`,
          `The line segment AB is the diameter of a circle.`,
          `Determine the equation of this circle.`
        ],
        boardQuestionLines: [
          `AB is diameter of a circle.`,
          `$A(${x1}, ${y1})$ and $B(${x2}, ${y2})$.`,
          `Find equation of the circle.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Find the centre of the circle (midpoint of AB):`,
          `$C = \\left(\\frac{${x1} + ${x2}}{2}, \\frac{${y1} + ${y2}}{2}\\right) = \\left(\\frac{${x1+x2}}{2}, \\frac{${y1+y2}}{2}\\right) = (${cx}, ${cy})$`,
          `<strong>2.</strong> Find the radius squared $r^2$ using distance from C to A (or B):`,
          `$r^2 = (${x2} - ${cx})^2 + (${y2} - ${cy})^2 = (${x2 - cx})^2 + (${y2 - cy})^2 = ${r2}$`,
          `<strong>3.</strong> Write the equation of the circle:`,
          `$(x ${cx < 0 ? '+' : '-'} ${Math.abs(cx)})^2 + (y ${cy < 0 ? '+' : '-'} ${Math.abs(cy)})^2 = ${r2}$`
        ],
        finalAnswer: `$(x ${cx < 0 ? '+' : '-'} ${Math.abs(cx)})^2 + (y ${cy < 0 ? '+' : '-'} ${Math.abs(cy)})^2 = ${r2}$`
      };
    } else {
      // Variation 2: C1 expanded, same radius as C2
      const g = getRandomInt(-4, 4);
      const f = getRandomInt(-4, 4);
      const r2 = getRandomInt(10, 30);
      const c = g*g + f*f - r2;
      
      const signX = 2*g >= 0 ? '+' : '-';
      const signY = 2*f >= 0 ? '+' : '-';
      const signC = c >= 0 ? '+' : '-';
      
      const eqC1 = `x^2 + y^2 ${2*g === 0 ? '' : signX + ' ' + Math.abs(2*g) + 'x'} ${2*f === 0 ? '' : signY + ' ' + Math.abs(2*f) + 'y'} ${signC} ${Math.abs(c)} = 0`;

      const cx2 = getRandomInt(-5, 5);
      const cy2 = getRandomInt(-5, 5);
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Circle $C_1$ has equation $${eqC1}$.`,
          `Circle $C_2$ has centre $(${cx2}, ${cy2})$.`,
          `The two circles have equal radii. Find the equation of circle $C_2$.`
        ],
        boardQuestionLines: [
          `$C_1: ${eqC1}$`,
          `$C_2$ centre $(${cx2}, ${cy2})$.`,
          `Radii are equal. Find eq of $C_2$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Find the radius squared $r^2$ of Circle $C_1$:`,
          `$2g = ${2*g} \\implies g = ${g}$`,
          `$2f = ${2*f} \\implies f = ${f}$`,
          `$c = ${c}$`,
          `$r^2 = g^2 + f^2 - c = (${g})^2 + (${f})^2 - (${c}) = ${g*g} + ${f*f} ${-c >= 0 ? '+' : '-'} ${Math.abs(c)} = ${r2}$`,
          `<strong>2.</strong> Circle $C_2$ has the same radius squared ($r^2 = ${r2}$) and centre $(${cx2}, ${cy2})$.`,
          `<strong>3.</strong> Write the equation of $C_2$:`,
          `$(x ${cx2 < 0 ? '+' : '-'} ${Math.abs(cx2)})^2 + (y ${cy2 < 0 ? '+' : '-'} ${Math.abs(cy2)})^2 = ${r2}$`
        ],
        finalAnswer: `$(x ${cx2 < 0 ? '+' : '-'} ${Math.abs(cx2)})^2 + (y ${cy2 < 0 ? '+' : '-'} ${Math.abs(cy2)})^2 = ${r2}$`
      };
    }
  }

  if (actualTopic === "Intersection of circles") {
    if (Math.random() > 0.5) {
      // Variation 1: Show that they do not intersect.
      const x1 = getRandomInt(-2, 2);
      const y1 = getRandomInt(-2, 2);
      const r1 = getRandomInt(2, 4);
      
      // Pick center 2 such that distance > r1 + r2
      const dx = getRandomInt(6, 8) * (Math.random() > 0.5 ? 1 : -1);
      const dy = getRandomInt(6, 8) * (Math.random() > 0.5 ? 1 : -1);
      const x2 = x1 + dx;
      const y2 = y1 + dy;
      
      const distSq = dx*dx + dy*dy; // e.g. 36 + 64 = 100
      const r2 = getRandomInt(2, Math.floor(Math.sqrt(distSq)) - r1 - 1); // guarantee dist > r1 + r2
      
      const eqC1 = `(x ${x1 < 0 ? '+' : '-'} ${Math.abs(x1)})^2 + (y ${y1 < 0 ? '+' : '-'} ${Math.abs(y1)})^2 = ${r1*r1}`;
      
      const g2 = -x2;
      const f2 = -y2;
      const c2 = g2*g2 + f2*f2 - r2*r2;
      
      const xTerm = 2*g2 === 0 ? '' : (2*g2 > 0 ? `+ ${2*g2}x` : `- ${-2*g2}x`);
      const yTerm = 2*f2 === 0 ? '' : (2*f2 > 0 ? `+ ${2*f2}y` : `- ${-2*f2}y`);
      const cTerm = c2 > 0 ? `+ ${c2}` : `- ${-c2}`;
      
      const eqC2 = `x^2 + y^2 ${xTerm} ${yTerm} ${cTerm} = 0`;
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Circle $C_1$ has equation $${eqC1}$.`,
          `Circle $C_2$ has equation $${eqC2}$.`,
          `(a) Write down the centres and radii of circles $C_1$ and $C_2$.`,
          `(b) Show that $C_1$ and $C_2$ do not intersect.`
        ],
        boardQuestionLines: [
          `$C_1: ${eqC1}$`,
          `$C_2: ${eqC2}$`,
          `(a) Find centres & radii.`,
          `(b) Show they don't intersect.`
        ],
        solutionSteps: [
          `<strong>1.</strong> For $C_1$, centre is $(${x1}, ${y1})$ and $r_1 = \\sqrt{${r1*r1}} = ${r1}$.`,
          `<strong>2.</strong> For $C_2$, $2g = ${2*g2} \\implies g = ${g2}$, and $2f = ${2*f2} \\implies f = ${f2}$.`,
          `Centre $C_2$ is $(${x2}, ${y2})$.`,
          `$r_2 = \\sqrt{g^2 + f^2 - c} = \\sqrt{(${g2})^2 + (${f2})^2 - (${c2})} = \\sqrt{${g2*g2} + ${f2*f2} - (${c2})} = \\sqrt{${r2*r2}} = ${r2}$.`,
          `<strong>3.</strong> Calculate the distance between centres $d$:`,
          `$d = \\sqrt{(${x2} - ${x1})^2 + (${y2} - ${y1})^2} = \\sqrt{(${dx})^2 + (${dy})^2} = \\sqrt{${distSq}}$.`,
          `<strong>4.</strong> Calculate the sum of the radii:`,
          `$r_1 + r_2 = ${r1} + ${r2} = ${r1 + r2}$.`,
          `<strong>5.</strong> Compare $d$ with $r_1 + r_2$:`,
          `Since $d = \\sqrt{${distSq}} > ${r1+r2}$ (because $${distSq} > ${(r1+r2)*(r1+r2)}$), the distance between centres is greater than the sum of radii.`,
          `So $C_1$ and $C_2$ do not intersect.`
        ],
        finalAnswer: `Shown: $d = \\sqrt{${distSq}}$, sum of radii $= ${r1+r2}$. $d > r_1 + r_2$, so no intersection.`
      };
    } else {
      // Variation 2: C1 internally touches C2
      // Let C1 be larger circle, C2 be smaller one
      const r1_sq = getRandomInt(2, 5) * 10; // e.g. 20, 30, 40, 50
      const r1_val = `\\sqrt{${r1_sq}}`;
      
      const x1 = getRandomInt(-5, 5);
      const y1 = getRandomInt(-5, 5);
      
      const g1 = -x1;
      const f1 = -y1;
      const c1 = g1 * g1 + f1 * f1 - r1_sq;
      
      const xTerm = 2 * g1 === 0 ? '' : (2 * g1 > 0 ? `+ ${2 * g1}x` : `- ${-2 * g1}x`);
      const yTerm = 2 * f1 === 0 ? '' : (2 * f1 > 0 ? `+ ${2 * f1}y` : `- ${-2 * f1}y`);
      const cTerm = c1 > 0 ? `+ ${c1}` : `- ${-c1}`;
      
      const eqC1 = `x^2 + y^2 ${xTerm} ${yTerm} ${cTerm} = 0`;
      
      // Let distance between centers be simple like sqrt(10).
      // We know r2 = r1 - dist
      // If dist = sqrt(10), then C2 centre is x1 + 3, y1 + 1 etc.
      const dx = 3; 
      const dy = 1;
      const dist_sq = dx*dx + dy*dy; // 10
      
      const x2 = x1 + dx * (Math.random() > 0.5 ? 1 : -1);
      const y2 = y1 + dy * (Math.random() > 0.5 ? 1 : -1);
      
      const dist_val = `\\sqrt{${dist_sq}}`;
      
      // Let's assume C1 has radius like 3 sqrt(10) -> r1_sq = 90
      // Let's force r1_sq to be 40 or 90 so r1 = 2 sqrt(10) or 3 sqrt(10)
      const multiplier = Math.random() > 0.5 ? 2 : 3;
      const r1_sq_fixed = multiplier * multiplier * dist_sq; // 40 or 90
      
      const c1_fixed = g1 * g1 + f1 * f1 - r1_sq_fixed;
      const cTermFixed = c1_fixed > 0 ? `+ ${c1_fixed}` : `- ${-c1_fixed}`;
      const eqC1Fixed = `x^2 + y^2 ${xTerm} ${yTerm} ${cTermFixed} = 0`;
      
      const r2_multiplier = multiplier - 1; // 1 or 2
      const r2_sq = r2_multiplier * r2_multiplier * dist_sq; // 10 or 40
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `The circle $C_1$ has equation $${eqC1Fixed}$.`,
          `(a) Find the centre and radius of $C_1$.`,
          `A second circle, $C_2$, touches $C_1$ internally. The centre of $C_2$ is $(${x2}, ${y2})$.`,
          `(b) Determine the equation of $C_2$.`
        ],
        boardQuestionLines: [
          `$C_1: ${eqC1Fixed}$`,
          `$C_2$ touches $C_1$ internally.`,
          `$C_2$ centre is $(${x2}, ${y2})$.`,
          `Find equation of $C_2$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> For $C_1$: $2g = ${2*g1} \\implies g = ${g1}$, $2f = ${2*f1} \\implies f = ${f1}$.`,
          `Centre $C_1 = (${x1}, ${y1})$.`,
          `$r_1 = \\sqrt{(${g1})^2 + (${f1})^2 - (${c1_fixed})} = \\sqrt{${g1 * g1} + ${f1 * f1} - (${c1_fixed})} = \\sqrt{${r1_sq_fixed}} = ${multiplier}\\sqrt{10}$.`,
          `<strong>2.</strong> Distance between centres $d$:`,
          `$d = \\sqrt{(${x2} - ${x1})^2 + (${y2} - ${y1})^2} = \\sqrt{(${x2 - x1})^2 + (${y2 - y1})^2} = \\sqrt{${dist_sq}}$.`,
          `<strong>3.</strong> For internal touching, $r_2 = r_1 - d$ (assuming $C_1$ is the larger circle):`,
          `$r_2 = ${multiplier}\\sqrt{10} - \\sqrt{10} = ${r2_multiplier}\\sqrt{10}$.`,
          `$r_2^2 = (${r2_multiplier}\\sqrt{10})^2 = ${r2_sq}$.`,
          `<strong>4.</strong> Equation of $C_2$:`,
          `$(x ${x2 < 0 ? '+' : '-'} ${Math.abs(x2)})^2 + (y ${y2 < 0 ? '+' : '-'} ${Math.abs(y2)})^2 = ${r2_sq}$`
        ],
        finalAnswer: `$(x ${x2 < 0 ? '+' : '-'} ${Math.abs(x2)})^2 + (y ${y2 < 0 ? '+' : '-'} ${Math.abs(y2)})^2 = ${r2_sq}$`
      };
    }
  }
  
  if (actualTopic === "Tangent to a circle") {
    const isApplying = Math.random() > 0.8;
    const isExpanded = Math.random() > 0.5;

    if (isApplying) {
       const px = getRandomInt(-2, 2);
       const py = getRandomInt(-2, 2);
       const dirs = [[3, 4], [4, 3], [5, 12], [8, 15], [6, 8]]; 
       const trip = dirs[Math.floor(Math.random()*dirs.length)];
       const L = Math.sqrt(trip[0]*trip[0] + trip[1]*trip[1]);
       
       const mult1 = getRandomInt(1, 2);
       const mult2 = getRandomInt(1, 2);
       const r1 = mult1 * L;
       const r2 = mult2 * L;
       
       const signX = Math.random() > 0.5 ? 1 : -1;
       const signY = Math.random() > 0.5 ? 1 : -1;
       const dx = trip[0] * signX;
       const dy = trip[1] * signY;
       
       const cx1 = px - mult1 * dx;
       const cy1 = py - mult1 * dy;
       
       const cx2 = px + mult2 * dx;
       const cy2 = py + mult2 * dy;
       
       const g1 = -cx1, f1 = -cy1;
       const cTerm1 = cx1*cx1 + cy1*cy1 - r1*r1;
         
       const gxTerm1 = 2*g1 === 0 ? '' : (2*g1 > 0 ? `+ ${2*g1}x` : `- ${-2*g1}x`);
       const fyTerm1 = 2*f1 === 0 ? '' : (2*f1 > 0 ? `+ ${2*f1}y` : `- ${-2*f1}y`);
       const cTermStr1 = cTerm1 === 0 ? '' : (cTerm1 > 0 ? `+ ${cTerm1}` : `- ${-cTerm1}`);
       const eqC1 = `x^2 + y^2 ${gxTerm1} ${fyTerm1} ${cTermStr1} = 0`.replace(/\s+/g, ' ').trim();
       
       const eqC2 = `(x ${cx2 < 0 ? '+' : '-'} ${Math.abs(cx2)})^2 + (y ${cy2 < 0 ? '+' : '-'} ${Math.abs(cy2)})^2 = ${r2*r2}`;
       
       const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
       const gVal = gcd(Math.abs(dy), Math.abs(dx));
       const mdy = dy / gVal;
       const mdx = dx / gVal;
       
       const A_tan = mdx;
       const B_tan = mdy;
       const C_tan = -(mdy * py + mdx * px);
       
       let eqTan = `${A_tan !== 0 ? (A_tan === 1 ? 'x' : A_tan === -1 ? '-x' : A_tan + 'x') : ''}` + ` ` +
                     `${B_tan !== 0 ? (B_tan > 0 && A_tan !== 0 ? '+ ' + B_tan + 'y' : B_tan < 0 ? '- ' + Math.abs(B_tan) + 'y' : B_tan + 'y') : ''}` + ` ` +
                     `${C_tan > 0 ? '+ ' + C_tan : C_tan < 0 ? '- ' + Math.abs(C_tan) : ''} = 0`;
       eqTan = eqTan.replace(/\s+/g, ' ').trim();
                     
       return {
         subTopic: actualTopic,
         questionLines: [
           `The circles with equations $${eqC1}$ and $${eqC2}$ touch at one common point $P$.`,
           `<strong>(a)</strong> Find the coordinates of $P$, the point where the circles touch.`,
           `<strong>(b)</strong> Find the equation of the common tangent at $P$.`
         ],
         boardQuestionLines: [
           `Circles $${eqC1}$`,
           `and $${eqC2}$ touch at $P$.`,
           `(a) Find $P$.`,
           `(b) Find common tangent at $P$.`
         ],
         solutionSteps: [
           `<strong>(a)</strong> Find the centres and radii of both circles:`,
           `$C_1 = (${cx1}, ${cy1}), r_1 = ${r1}$`,
           `$C_2 = (${cx2}, ${cy2}), r_2 = ${r2}$`,
           `The distance between centres is $d = \\sqrt{(${cx2} - ${cx1 < 0 ? `(${cx1})` : cx1})^2 + (${cy2} - ${cy1 < 0 ? `(${cy1})` : cy1})^2} = ${r1+r2}$.`,
           `Since $d = r_1 + r_2$, the circles touch externally.`,
           `Point $P$ divides $C_1C_2$ in the ratio $r_1 : r_2 = ${r1} : ${r2}$. Step out from $C_1$ to find $P = (${px}, ${py})$.`,
           `<strong>(b)</strong> Gradient of radius $C_1 P = \\frac{${py} - ${cy1 < 0 ? `(${cy1})` : cy1}}{${px} - ${cx1 < 0 ? `(${cx1})` : cx1}} = \\frac{${dy}}{${dx}}$.`,
           `Gradient of tangent is $m = -\\frac{${dx}}{${dy}}$.`,
           `Equation of tangent: $y ${py < 0 ? '+' : '-'} ${Math.abs(py)} = -\\frac{${dx}}{${dy}}(x ${px < 0 ? '+' : '-'} ${Math.abs(px)})$.`,
           `$${Math.abs(dy)}(y ${py < 0 ? '+' : '-'} ${Math.abs(py)}) = ${dy > 0 ? -dx : dx}(x ${px < 0 ? '+' : '-'} ${Math.abs(px)})$.`,
           `$${eqTan}$`
         ],
         finalAnswer: `(a) $P(${px}, ${py})$<br>(b) $${eqTan}$`
       };
    }

    const cx = getRandomInt(-3, 3);
    const cy = getRandomInt(-3, 3);
    let px = cx;
    while (px === cx) px = cx + getRandomInt(-3, 3);
    let py = cy;
    while (py === cy) py = cy + getRandomInt(-3, 3);
    
    const r2 = Math.pow(px - cx, 2) + Math.pow(py - cy, 2);
    
    let eqC = '';
    if (isExpanded) {
        const g = -cx;
        const f = -cy;
        const c = g*g + f*f - r2;
        
        const xTerm = 2*g === 0 ? '' : (2*g > 0 ? `+ ${2*g}x` : `- ${-2*g}x`);
        const yTerm = 2*f === 0 ? '' : (2*f > 0 ? `+ ${2*f}y` : `- ${-2*f}y`);
        const cTerm = c === 0 ? '' : (c > 0 ? `+ ${c}` : `- ${-c}`);
        
        eqC = `x^2 + y^2 ${xTerm} ${yTerm} ${cTerm} = 0`.replace(/\s+/g, ' ').trim();
    } else {
        const xPart = cx === 0 ? `x^2` : `(x ${cx < 0 ? '+' : '-'} ${Math.abs(cx)})^2`;
        const yPart = cy === 0 ? `y^2` : `(y ${cy < 0 ? '+' : '-'} ${Math.abs(cy)})^2`;
        eqC = `${xPart} + ${yPart} = ${r2}`;
    }
    
    const dy = py - cy;
    const dx = px - cx;
    
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const g1 = gcd(Math.abs(dy), Math.abs(dx));
    
    let num = Math.abs(dy) / g1;
    let den = Math.abs(dx) / g1;
    if (dy * dx < 0) num = -num;
    const mRadFrac = den === 1 ? `${num}` : (num < 0 ? `-\\frac{${-num}}{${den}}` : `\\frac{${num}}{${den}}`);
    
    const mTanNum = -den * Math.sign(num);
    const mTanDen = Math.abs(num); 
    let mTanFrac = '';
    if (mTanDen === 1) {
        mTanFrac = `${mTanNum}`;
    } else {
        mTanFrac = (mTanNum * mTanDen < 0 ? '-' : '') + `\\frac{${Math.abs(mTanNum)}}{${Math.abs(mTanDen)}}`;
    }

    const a = Math.abs(mTanDen);
    const b_coeff = mTanNum * Math.sign(mTanDen);
    const right = a * py - b_coeff * px;

    return {
      subTopic: actualTopic,
      questionLines: [
        `Find the equation of the tangent to the circle $${eqC}$ at the point $P(${px}, ${py})$.`
      ],
      boardQuestionLines: [
        `Circle $${eqC}$.`,
        `Find tangent at $P(${px}, ${py})$.`
      ],
      solutionSteps: [
        `<strong>1.</strong> Find the centre of the circle:`,
        isExpanded ? `$2g = ${-2*cx} \\implies g = ${-cx}$.  $2f = ${-2*cy} \\implies f = ${-cy}$.` : `$C = (${cx}, ${cy})$ directly from brackets.`,
        `Centre $C = (${cx}, ${cy})$.`,
        `<strong>2.</strong> Find the gradient of the radius $CP$:`,
        `$m_{rad} = \\frac{${py} - ${cy < 0 ? `(${cy})` : cy}}{${px} - ${cx < 0 ? `(${cx})` : cx}} = ${mRadFrac}$.`,
        `<strong>3.</strong> The tangent is perpendicular to the radius, so $m_{tan} = -\\frac{1}{m_{rad}} = ${mTanFrac}$.`,
        `<strong>4.</strong> Substitute $P(${px}, ${py})$ and $m_{tan}$ into $y - b = m(x - a)$:`,
        `$y ${py < 0 ? '+' : '-'} ${Math.abs(py)} = ${mTanFrac} (x ${px < 0 ? '+' : '-'} ${Math.abs(px)})$`,
        `$${a}(y ${py < 0 ? '+' : '-'} ${Math.abs(py)}) = ${b_coeff}(x ${px < 0 ? '+' : '-'} ${Math.abs(px)})$`,
        `$${a}y ${py < 0 ? '+' : '-'} ${Math.abs(a * py)} = ${b_coeff < 0 ? '-' : ''}${Math.abs(b_coeff)}x ${-(b_coeff * px) > 0 ? '+' : '-'} ${Math.abs(b_coeff * px)}$`,
        `$${a}y = ${b_coeff}x ${right > 0 ? '+' : ''} ${right === 0 ? '' : right}$`
      ],
      finalAnswer: `$${a}y = ${b_coeff}x ${right > 0 ? '+' : ''} ${right === 0 ? '' : right}$`
    };
  }

  if (actualTopic === "Intersection of line and circle") {
    const isApplying = Math.random() > 0.8;
    const isYEq = isApplying ? true : Math.random() > 0.5;
    const m = isApplying ? [1, -1][Math.floor(Math.random() * 2)] : [1, -1, 2, -2][Math.floor(Math.random() * 4)];
    
    const t1 = getRandomInt(-3, 1);
    const t2 = t1 + getRandomInt(1, 4);
    const kStr = getRandomInt(-4, 4);
    
    let x1, y1, x2, y2;
    if (isYEq) {
       x1 = t1; y1 = m * x1 + kStr;
       x2 = t2; y2 = m * x2 + kStr;
    } else {
       y1 = t1; x1 = m * y1 + kStr;
       y2 = t2; x2 = m * y2 + kStr;
    }
    
    const mx_mid = (x1 + x2) / 2;
    const my_mid = (y1 + y2) / 2;
    
    let cx = 0, cy = 0;
    
    // Choose integer cx, cy for circle center
    for(let s = -5; s <= 5; s += 0.5) {
       let testCx, testCy;
       if (isYEq) {
          testCx = mx_mid - m * s;
          testCy = my_mid + s;
       } else {
          testCx = mx_mid + s;
          testCy = my_mid - m * s;
       }
       if (Number.isInteger(testCx) && Number.isInteger(testCy)) {
          cx = testCx; cy = testCy;
          if (Math.random() > 0.5) break; 
       }
    }
    
    if (isApplying) {
       // if applying, we want to give diameter endpoints D and F such that circle has center cx, cy
       // D = (cx + dx, cy + dy), F = (cx - dx, cy - dy)
       // Let's just use (cx-x1, cy-y1) as dx, dy? No, D, F don't have to be intersection points.
       // They just form the diameter.
       const dx = getRandomInt(1, 4);
       const dy = getRandomInt(1, 4) * (Math.random() > 0.5 ? 1 : -1);
       // Ensure r^2 matches what we needed for integer intersections = (cx-x1)^2 + (cy-y1)^2
       // But wait: r^2 is fixed to (cx-x1)^2 + (cy-y1)^2 for the intersection points x1, x2.
       // dx^2 + dy^2 MUST equal r^2 for integer D, F coordinates!
       // finding a Pythagorean decomposition of r^2 might be hard.
       // So we MUST set dx = cx - x1 and dy = cy - y1, or a variation of it.
       const dx_d = cx - x1;
       const dy_d = cy - y1;
       
       const pxD = cx + dx_d;
       const pyD = cy + dy_d;
       const pxF = cx - dx_d;
       const pyF = cy - dy_d;
       
       const r2 = Math.pow(cx - pxD, 2) + Math.pow(cy - pyD, 2);
       const cTerm = cx*cx + cy*cy - r2;
       const g = -cx;
       const f = -cy;
       
       const gxTerm = 2*g === 0 ? '' : (2*g > 0 ? `+ ${2*g}x` : `- ${-2*g}x`);
       const fyTerm = 2*f === 0 ? '' : (2*f > 0 ? `+ ${2*f}y` : `- ${-2*f}y`);
       const cTermStr = cTerm === 0 ? '' : (cTerm > 0 ? `+ ${cTerm}` : `- ${-cTerm}`);
       
       const eqC = `x^2 + y^2 ${gxTerm} ${fyTerm} ${cTermStr} = 0`.replace(/\s+/g, ' ').trim();
       
       let eqL = '';
       if (m === 1) eqL = `y = x ${kStr > 0 ? '+ ' + kStr : (kStr < 0 ? '- ' + Math.abs(kStr) : '')}`;
       else if (m === -1) eqL = `y = -x ${kStr > 0 ? '+ ' + kStr : (kStr < 0 ? '- ' + Math.abs(kStr) : '')}`;
       else eqL = `y = ${m}x ${kStr > 0 ? '+ ' + kStr : (kStr < 0 ? '- ' + Math.abs(kStr) : '')}`;
       eqL = eqL.trim();
       if (eqL.endsWith('=')) eqL += ' 0';
       if (eqL.endsWith('= x') && kStr === 0) eqL = 'y = x';
       if (eqL.endsWith('= -x') && kStr === 0) eqL = 'y = -x';

       const subExpr = eqL.split('=')[1].trim();

       return {
         subTopic: actualTopic,
         questionLines: [
           `<strong>(a)</strong> Find the equation of a circle which has $D(${pxD}, ${pyD})$ and $F(${pxF}, ${pyF})$ as its diameter.`,
           `Leave your answer in the form $x^2 + y^2 + 2gx + 2fy + c = 0$.`,
           `<strong>(b)</strong> Establish the coordinates of the points of intersection between the circle and the line $${eqL}$.`
         ],
         boardQuestionLines: [
           `(a) Find eq of circle with diameter $D(${pxD}, ${pyD})$ and $F(${pxF}, ${pyF})$.`,
           `Provide in expanded form.`,
           `(b) Find points of intersection with $${eqL}$.`
         ],
         solutionSteps: [
           `<strong>(a) 1.</strong> Centre is midpoint of DF: $\\left(\\frac{${pxD} + ${pxF < 0 ? `(${pxF})` : pxF}}{2}, \\frac{${pyD} + ${pyF < 0 ? `(${pyF})` : pyF}}{2}\\right) = (${cx}, ${cy})$.`,
           `<strong>(a) 2.</strong> Radius squared $r^2 = (${pxD} - ${cx < 0 ? `(${cx})` : cx})^2 + (${pyD} - ${cy < 0 ? `(${cy})` : cy})^2 = ${r2}$.`,
           `<strong>(a) 3.</strong> Form circle equation: $(x ${cx < 0 ? '+' : '-'} ${Math.abs(cx)})^2 + (y ${cy < 0 ? '+' : '-'} ${Math.abs(cy)})^2 = ${r2}$.`,
           `<strong>(a) 4.</strong> Expand: $x^2 ${-2*cx > 0 ? '+' : '-'} ${Math.abs(-2*cx)}x + ${cx*cx} + y^2 ${-2*cy > 0 ? '+' : '-'} ${Math.abs(-2*cy)}y + ${cy*cy} = ${r2}$.`,
           `$${eqC}$`,
           `<strong>(b) 1.</strong> Substitute the line $${eqL}$ into the circle.`,
           `$x^2 + (${subExpr})^2 ${gxTerm} ${fyTerm.replace('y', `(${subExpr})`)} ${cTermStr} = 0$`,
           `<strong>(b) 2.</strong> Solve quadratic to find $x = ${t1}, x = ${t2}$.`,
           `<strong>(b) 3.</strong> Substitute to find $y$ values: $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`
         ],
         finalAnswer: `(a) $${eqC}$<br>(b) $(${x1}, ${y1})$ and $(${x2}, ${y2})$`
       };
    }

    
    const r2 = Math.pow(cx - x1, 2) + Math.pow(cy - y1, 2);
    const cTerm = cx*cx + cy*cy - r2;
    const g = -cx;
    const f = -cy;
    
    const gxTerm = 2*g === 0 ? '' : (2*g > 0 ? `+ ${2*g}x` : `- ${-2*g}x`);
    const fyTerm = 2*f === 0 ? '' : (2*f > 0 ? `+ ${2*f}y` : `- ${-2*f}y`);
    const cTermStr = cTerm === 0 ? '' : (cTerm > 0 ? `+ ${cTerm}` : `- ${-cTerm}`);
    
    const eqC = `x^2 + y^2 ${gxTerm} ${fyTerm} ${cTermStr} = 0`.replace(/\s+/g, ' ').trim();
    
    let eqL = '';
    if (isYEq) {
        if (m === 1) eqL = `y = x ${kStr > 0 ? '+ ' + kStr : (kStr < 0 ? '- ' + Math.abs(kStr) : '')}`;
        else if (m === -1) eqL = `y = -x ${kStr > 0 ? '+ ' + kStr : (kStr < 0 ? '- ' + Math.abs(kStr) : '')}`;
        else eqL = `y = ${m}x ${kStr > 0 ? '+ ' + kStr : (kStr < 0 ? '- ' + Math.abs(kStr) : '')}`;
    } else {
        if (m === 1) eqL = `x = y ${kStr > 0 ? '+ ' + kStr : (kStr < 0 ? '- ' + Math.abs(kStr) : '')}`;
        else if (m === -1) eqL = `x = -y ${kStr > 0 ? '+ ' + kStr : (kStr < 0 ? '- ' + Math.abs(kStr) : '')}`;
        else eqL = `x = ${m}y ${kStr > 0 ? '+ ' + kStr : (kStr < 0 ? '- ' + Math.abs(kStr) : '')}`;
    }
    eqL = eqL.trim();
    if (eqL.endsWith('=')) eqL += ' 0';
    if (eqL.endsWith('= x') && kStr === 0) eqL = isYEq ? 'y = x' : 'x = y';
    if (eqL.endsWith('= -x') && kStr === 0) eqL = isYEq ? 'y = -x' : 'x = -y';

    const subExpr = isYEq ? eqL.split('=')[1].trim() : eqL.split('=')[1].trim();

    return {
      subTopic: actualTopic,
      questionLines: [
        `Find the coordinates of the points of intersection of the line $${eqL}$ and the circle $${eqC}$.`
      ],
      boardQuestionLines: [
        `Find points of intersection:`,
        `$${eqL}$ and $${eqC}$`
      ],
      solutionSteps: [
        `<strong>1.</strong> Substitute the line equation into the circle equation:`,
        isYEq ? `$x^2 + (${subExpr})^2 ${gxTerm} ${fyTerm.replace('y', `(${subExpr})`)} ${cTermStr} = 0$` : `$(${subExpr})^2 + y^2 ${gxTerm.replace('x', `(${subExpr})`)} ${fyTerm} ${cTermStr} = 0$`,
        `<strong>2.</strong> Expand and collect terms to form a quadratic equation in ${isYEq ? 'x' : 'y'}.`,
        `<strong>3.</strong> Factorise and solve for ${isYEq ? 'x' : 'y'}:`,
        `$${isYEq ? 'x' : 'y'} = ${t1}, ${isYEq ? 'x' : 'y'} = ${t2}$`,
        `<strong>4.</strong> Substitute ${isYEq ? 'x' : 'y'} back into the line equation to find ${isYEq ? 'y' : 'x'}:`,
        `$${isYEq ? 'x' : 'y'} = ${t1} \\implies ${isYEq ? 'y' : 'x'} = ${isYEq ? y1 : x1}$`,
        `$${isYEq ? 'x' : 'y'} = ${t2} \\implies ${isYEq ? 'y' : 'x'} = ${isYEq ? y2 : x2}$`
      ],
      finalAnswer: `$(${x1}, ${y1})$ and $(${x2}, ${y2})$`
    };
  }

  return {
    subTopic: actualTopic,
    questionLines: ["Missing circle question"],
    boardQuestionLines: ["Missing"],
    solutionSteps: ["Error"],
    finalAnswer: "Error"
  };
}

