import { getRandomInt, nonZeroInt, Point, formatNum, gcd, simplifyFraction, formatFraction, formatFractionWithSub, formatTerm, formatEquation, generateTriangle } from "./utils";
import { GeneratedQuestion, Topic, TOPIC_GROUPS } from "./types";

export function generateVectorsQuestion(selectedTopic: string): Omit<GeneratedQuestion, "topic"> {
  const topics = TOPIC_GROUPS["Vectors"];
  let type = topics.indexOf(selectedTopic as Topic);
  if (type === -1) type = Math.floor(Math.random() * topics.length);
  const actualTopic = topics[type];

      const formatComp = (n: number) => n === 1 ? '' : n === -1 ? '-' : `${n}`;

  if (actualTopic === "Resultant of 3D vector pathways") {
    // Generate RS, ST, PT -> find RT, RP
    // Let's use generic names like A, B, C, D
    const v1 = [nonZeroInt(-4, 4), nonZeroInt(-4, 4), nonZeroInt(-4, 4)];
    const v2 = [nonZeroInt(-4, 4), nonZeroInt(-4, 4), nonZeroInt(-4, 4)];
    const v3 = [nonZeroInt(-4, 4), nonZeroInt(-4, 4), nonZeroInt(-4, 4)];
    
    // RT = RS + ST
    const rt = [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
    // RP = RT - PT = RT - v3
    const rp = [rt[0] - v3[0], rt[1] - v3[1], rt[2] - v3[2]];

    const cToIjk = (v: number[]) => {
      let parts = [];
      if (v[0] !== 0) parts.push(`${formatComp(v[0])}\\underline{i}`);
      if (v[1] !== 0) parts.push(`${v[1] > 0 && parts.length > 0 ? '+' : ''}${v[1] < 0 ? '-' : ''}${formatComp(Math.abs(v[1]))}\\underline{j}`);
      if (v[2] !== 0) parts.push(`${v[2] > 0 && parts.length > 0 ? '+' : ''}${v[2] < 0 ? '-' : ''}${formatComp(Math.abs(v[2]))}\\underline{k}`);
      return parts.length > 0 ? parts.join('') : '0';
    };

    return {
      subTopic: actualTopic,
      questionLines: [
        `Three vectors are defined as follows:`,
        `$\\overrightarrow{\\textsf{RS}} = ${cToIjk(v1)}$`,
        `$\\overrightarrow{\\textsf{ST}} = ${cToIjk(v2)}$`,
        `$\\overrightarrow{\\textsf{PT}} = ${cToIjk(v3)}$`,
        `(a) Find $\\overrightarrow{\\textsf{RT}}$.`,
        `(b) Hence, or otherwise, find $\\overrightarrow{\\textsf{RP}}$.`
      ],
      boardQuestionLines: [
        `$\\overrightarrow{\\textsf{RS}} = ${cToIjk(v1)}$, $\\overrightarrow{\\textsf{ST}} = ${cToIjk(v2)}$, $\\overrightarrow{\\textsf{PT}} = ${cToIjk(v3)}$`,
        `(a) Find $\\overrightarrow{\\textsf{RT}}$.`,
        `(b) Find $\\overrightarrow{\\textsf{RP}}$.`
      ],
      solutionSteps: [
        `<strong>1.</strong> Find RT: $\\overrightarrow{\\textsf{RT}} = \\overrightarrow{\\textsf{RS}} + \\overrightarrow{\\textsf{ST}}$`,
        `$= \\left( \\begin{smallmatrix} ${v1[0]} \\\\ ${v1[1]} \\\\ ${v1[2]} \\end{smallmatrix}\\right) + \\left( \\begin{smallmatrix} ${v2[0]} \\\\ ${v2[1]} \\\\ ${v2[2]} \\end{smallmatrix}\\right) = \\left( \\begin{smallmatrix} ${rt[0]} \\\\ ${rt[1]} \\\\ ${rt[2]} \\end{smallmatrix}\\right)$`,
        `$\\overrightarrow{\\textsf{RT}} = ${cToIjk(rt)}$.`,
        `<strong>2.</strong> Find RP: $\\overrightarrow{\\textsf{RP}} = \\overrightarrow{\\textsf{RT}} + \\overrightarrow{\\textsf{TP}} = \\overrightarrow{\\textsf{RT}} - \\overrightarrow{\\textsf{PT}}$`,
        `$= \\left( \\begin{smallmatrix} ${rt[0]} \\\\ ${rt[1]} \\\\ ${rt[2]} \\end{smallmatrix}\\right) - \\left( \\begin{smallmatrix} ${v3[0]} \\\\ ${v3[1]} \\\\ ${v3[2]} \\end{smallmatrix}\\right) = \\left( \\begin{smallmatrix} ${rp[0]} \\\\ ${rp[1]} \\\\ ${rp[2]} \\end{smallmatrix}\\right)$`
      ],
      finalAnswer: `$\\overrightarrow{\\textsf{RP}} = ${cToIjk(rp)}$`
    };
  }

  if (actualTopic === "Resultant of 2D vector pathways") {
    return {
      subTopic: actualTopic,
      questionLines: [
        `$\\textsf{PQRS}$ is a trapezium with $\\overrightarrow{\\textsf{RQ}}=2\\,\\overrightarrow{\\textsf{SP}}$.`,
        `Let $\\overrightarrow{\\textsf{PQ}}=\\mathbf{u}$ and $\\overrightarrow{\\textsf{RQ}}=\\mathbf{v}$.`,
        `(a) Express $\\overrightarrow{\\textsf{RP}}$ in terms of $\\mathbf{u}$ and $\\mathbf{v}$.`,
        `(b) Express $\\overrightarrow{\\textsf{RS}}$ in terms of $\\mathbf{u}$ and $\\mathbf{v}$, in its simplest form.`
      ],
      boardQuestionLines: [
        `Trapezium $\\textsf{PQRS}$. $\\overrightarrow{\\textsf{RQ}}=2\\,\\overrightarrow{\\textsf{SP}}$.`,
        `$\\overrightarrow{\\textsf{PQ}}=\\mathbf{u}$, $\\overrightarrow{\\textsf{RQ}}=\\mathbf{v}$.`,
        `(a) $\\overrightarrow{\\textsf{RP}}$ in terms of $\\mathbf{u}, \\mathbf{v}$.`,
        `(b) $\\overrightarrow{\\textsf{RS}}$ in simplest form.`
      ],
      solutionSteps: [
        `<strong>1.</strong> Find RP: $\\overrightarrow{\\textsf{RP}} = \\overrightarrow{\\textsf{RQ}} + \\overrightarrow{\\textsf{QP}} = \\overrightarrow{\\textsf{RQ}} - \\overrightarrow{\\textsf{PQ}}$`,
        `$= \\mathbf{v} - \\mathbf{u}$`,
        `<strong>2.</strong> Find RS: $\\overrightarrow{\\textsf{RS}} = \\overrightarrow{\\textsf{RP}} + \\overrightarrow{\\textsf{PS}} = \\overrightarrow{\\textsf{RP}} - \\overrightarrow{\\textsf{SP}}$`,
        `Since $\\overrightarrow{\\textsf{RQ}} = 2\\,\\overrightarrow{\\textsf{SP}}$, $\\overrightarrow{\\textsf{SP}} = \\frac{1}{2}\\overrightarrow{\\textsf{RQ}} = \\frac{1}{2}\\mathbf{v}$.`,
        `$\\overrightarrow{\\textsf{RS}} = (\\mathbf{v} - \\mathbf{u}) - \\frac{1}{2}\\mathbf{v} = \\frac{1}{2}\\mathbf{v} - \\mathbf{u}$`
      ],
      finalAnswer: `(a) $\\mathbf{v} - \\mathbf{u}$, (b) $\\frac{1}{2}\\mathbf{v} - \\mathbf{u}$`
    };
  }

  if (actualTopic === "Collinearity (Vectors)") {
    const isCollinear = Math.random() < 0.5;
    const ptA = [getRandomInt(-5, 5), getRandomInt(-5, 5), getRandomInt(-5, 5)];
    const dr = [nonZeroInt(-3, 3), nonZeroInt(-3, 3), nonZeroInt(-3, 3)];
    
    // Choose multiples
    const m1 = getRandomInt(1, 3);
    const m2 = isCollinear ? getRandomInt(-3, -1) : getRandomInt(1, 3);
    
    const ptB = [ptA[0] + m1 * dr[0], ptA[1] + m1 * dr[1], ptA[2] + m1 * dr[2]];
    let ptC = [ptA[0] + m2 * dr[0], ptA[1] + m2 * dr[1], ptA[2] + m2 * dr[2]];
    
    if (!isCollinear) {
      // tweak a component to break collinearity
      ptC[2] += nonZeroInt(1, 3);
    }
    
    const ab = [ptB[0] - ptA[0], ptB[1] - ptA[1], ptB[2] - ptA[2]];
    const ac = [ptC[0] - ptA[0], ptC[1] - ptA[1], ptC[2] - ptA[2]];

    let conc = "";
    if (isCollinear) {
      const k = m2 / m1;
      const kStr = Number.isInteger(k) ? `${k}` : `\\frac{${m2}}{${m1}}`;
      conc = `<strong>3.</strong> $\\overrightarrow{\\textsf{AC}} = ${kStr}\\overrightarrow{\\textsf{AB}}$, so $\\overrightarrow{\\textsf{AC}}$ and $\\overrightarrow{\\textsf{AB}}$ are parallel. $A$ is a common point, so $A, B$ and $C$ are collinear.`;
    } else {
      conc = `<strong>3.</strong> $\\overrightarrow{\\textsf{AC}}$ is not a scalar multiple of $\\overrightarrow{\\textsf{AB}}$, so they are not parallel. Thus $A, B$ and $C$ are not collinear.`;
    }

    return {
      subTopic: actualTopic,
      questionLines: [
        `Show that the points $A(${ptA.join(', ')})$, $B(${ptB.join(', ')})$ and $C(${ptC.join(', ')})$ are ${isCollinear ? '' : 'not '}collinear.`
      ],
      boardQuestionLines: [
        `Are $A(${ptA.join(', ')})$, $B(${ptB.join(', ')})$ and $C(${ptC.join(', ')})$ collinear?`
      ],
      solutionSteps: [
        `<strong>1.</strong> Vector AB: $\\overrightarrow{\\textsf{AB}} = \\left( \\begin{smallmatrix} ${ab[0]} \\\\ ${ab[1]} \\\\ ${ab[2]} \\end{smallmatrix}\\right)$`,
        `<strong>2.</strong> Vector AC: $\\overrightarrow{\\textsf{AC}} = \\left( \\begin{smallmatrix} ${ac[0]} \\\\ ${ac[1]} \\\\ ${ac[2]} \\end{smallmatrix}\\right)$`,
        conc
      ],
      finalAnswer: isCollinear ? `Collinear` : `Not collinear`
    };
  }

  if (actualTopic === "Ratio of division") {
    const isApplying = Math.random() < 0.5;

    if (isApplying) {
      // P splits AC in ratio r1:r2. 
      // A (Ax, Ay, k), P (Px, Py, Pz), C (k, Cy, Cz)
      // Find k and find P.
      // 2 * (P_z - k) = 5 * (C_z - P_z) -> r2(P_z - k) = r1(C_z - P_z)
      const r1 = 5;
      const r2 = 2;
      const k = getRandomInt(2, 6);
      let Pz = getRandomInt(6, 12);
      while (((r1 + r2) * Pz - r2 * k) % r1 !== 0) {
        Pz = getRandomInt(6, 12);
      }
      const Cz = ((r1 + r2) * Pz - r2 * k) / r1;

      let Px = getRandomInt(-5, 5);
      while (((r1 + r2) * Px - r1 * k) % r2 !== 0) {
        Px = getRandomInt(-5, 5);
      }
      const Ax = ((r1 + r2) * Px - r1 * k) / r2;

      let Ay = getRandomInt(-5, 5);
      let Cy = getRandomInt(-5, 12);
      while ((r1 * Cy + r2 * Ay) % (r1 + r2) !== 0) {
        Ay = getRandomInt(-5, 5);
        Cy = getRandomInt(-5, 12);
      }
      const Py = (r1 * Cy + r2 * Ay) / (r1 + r2);

      return {
        subTopic: actualTopic,
        questionLines: [
          `Point $P(x, y, ${Pz})$ splits the line segment joining $A(${Ax}, ${Ay}, k)$ and $C(k, ${Cy}, ${Cz})$ internally in the ratio $${r1} : ${r2}$.`,
          `(a) Calculate the value of $k$.`,
          `(b) Hence list the complete coordinates of point $P$.`
        ],
        boardQuestionLines: [
          `$P(x, y, ${Pz})$ splits $AC$ in ratio $${r1}:${r2}$.`,
          `$A(${Ax}, ${Ay}, k)$, $C(k, ${Cy}, ${Cz})$. Find $k$ and coordinates of $P$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> (a) Since $P$ splits $AC$ in ratio $${r1}:${r2}$, we have $${r2}\\overrightarrow{\\textsf{AP}} = ${r1}\\overrightarrow{\\textsf{PC}}$.`,
          `Equating the $z$-components:`,
          `$${r2}(P_z - A_z) = ${r1}(C_z - P_z) \\implies ${r2}(${Pz} - k) = ${r1}(${Cz} - ${Pz})$`,
          `$${r2 * Pz} - ${r2}k = ${r1 * (Cz - Pz)}$`,
          `$${r2}k = ${r2 * Pz - r1 * (Cz - Pz)} \\implies k = ${k}$.`,
          `<strong>2.</strong> (b) Now substitute $k=${k}$ into the $x$ and $y$ coordinate equations:`,
          `$${r2}\\overrightarrow{\\textsf{AP}}_x = ${r1}\\overrightarrow{\\textsf{PC}}_x \\implies ${r2}(x - (${Ax})) = ${r1}(${k} - x)$`,
          `$${r2}x - (${r2 * Ax}) = ${r1 * k} - ${r1}x \\implies ${r1+r2}x = ${r1 * k + r2 * Ax} \\implies x = ${Px}$`,
          `$${r2}\\overrightarrow{\\textsf{AP}}_y = ${r1}\\overrightarrow{\\textsf{PC}}_y \\implies ${r2}(y - ${Ay}) = ${r1}(${Cy} - y)$`,
          `$${r2}y - ${r2 * Ay} = ${r1 * Cy} - ${r1}y \\implies ${r1+r2}y = ${r1 * Cy + r2 * Ay} \\implies y = ${Py}$`,
          `<strong>3.</strong> Write coordinate point $P$:`,
          `$P(${Px}, ${Py}, ${Pz})$`
        ],
        finalAnswer: `(a) $k = ${k}$<br>(b) $P(${Px}, ${Py}, ${Pz})$`
      };
    } else {
      // Generate collinear points A, B, C with random ratio
      const ptA = [getRandomInt(-6, 6), getRandomInt(-6, 6), getRandomInt(-6, 6)];
      const dr = [nonZeroInt(-2, 2), nonZeroInt(-2, 2), nonZeroInt(-2, 2)];
      
      const r1 = getRandomInt(1, 4);
      const r2 = getRandomInt(1, 4);
      
      const ptB = [ptA[0] + r1 * dr[0], ptA[1] + r1 * dr[1], ptA[2] + r1 * dr[2]];
      const ptC = [ptB[0] + r2 * dr[0], ptB[1] + r2 * dr[1], ptB[2] + r2 * dr[2]];
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Points $A(${ptA.join(', ')})$, $B(${ptB.join(', ')})$ and $C(${ptC.join(', ')})$ are collinear.`,
          `State the ratio in which $B$ divides $AC$.`
        ],
        boardQuestionLines: [
          `$A(${ptA.join(', ')})$, $B(${ptB.join(', ')})$, $C(${ptC.join(', ')})$ are collinear.`,
          `Ratio $B$ divides $AC$?`
        ],
        solutionSteps: [
          `<strong>1.</strong> Look at the $x$-components (or any component):`,
          `$\\overrightarrow{\\textsf{AB}}_x = ${ptB[0]} - (${ptA[0]}) = ${ptB[0] - ptA[0]}$`,
          `$\\overrightarrow{\\textsf{BC}}_x = ${ptC[0]} - (${ptB[0]}) = ${ptC[0] - ptB[0]}$`,
          `<strong>2.</strong> Ratio is $\\overrightarrow{\\textsf{AB}} : \\overrightarrow{\\textsf{BC}} = ${r1 * dr[0]} : ${r2 * dr[0]} = ${r1} : ${r2}$.`
        ],
        finalAnswer: `$${r1} : ${r2}$`
      };
    }
  }

  if (actualTopic === "Dividing a line segment in a ratio") {
    const isApplying = Math.random() < 0.5;

    if (isApplying) {
      // The amazing multi-part BCE angle sequence!
      // Pick random integer coordinates for C
      const C = [getRandomInt(2, 6), getRandomInt(1, 5), getRandomInt(2, 6)];
      // Choose vectors v_CB and v_CE
      const vCB = [getRandomInt(1, 3), getRandomInt(1, 3), getRandomInt(1, 3) * (Math.random() > 0.5 ? 1 : -1)];
      const vCE = [getRandomInt(-3, -1), getRandomInt(1, 3), getRandomInt(-3, -1)];
      
      const B = [C[0] + vCB[0], C[1] + vCB[1], C[2] + vCB[2]];
      const E = [C[0] + vCE[0], C[1] + vCE[1], C[2] + vCE[2]];
      
      // A: C divides AB in ratio 2:1. Since B is C + vCB, A is C - 2 * vCB
      const A = [C[0] - 2 * vCB[0], C[1] - 2 * vCB[1], C[2] - 2 * vCB[2]];
      
      // D: C divides DE in ratio 3:1. Since E is C + vCE, D is C - 3 * vCE
      const D = [C[0] - 3 * vCE[0], C[1] - 3 * vCE[1], C[2] - 3 * vCE[2]];

      const dotCB_CE = vCB[0]*vCE[0] + vCB[1]*vCE[1] + vCB[2]*vCE[2];
      const magCB = Math.sqrt(vCB[0]*vCB[0] + vCB[1]*vCB[1] + vCB[2]*vCB[2]);
      const magCE = Math.sqrt(vCE[0]*vCE[0] + vCE[1]*vCE[1] + vCE[2]*vCE[2]);
      const cosVal = dotCB_CE / (magCB * magCE);
      const angle = Math.acos(Math.max(-1, Math.min(1, cosVal))) * (180 / Math.PI);

      return {
        subTopic: actualTopic,
        questionLines: [
          `(a) C divides the line segment joining $A(${A.join(', ')})$ and $B(${B.join(', ')})$ in the ratio $2 : 1$. Find the coordinates of $C$.`,
          `(b) $D$ has coordinates $(${D.join(', ')})$ and $C$ divides the vector pathway $\\overrightarrow{\\textsf{DE}}$ in the ratio $3 : 1$. Find the coordinates of $E$.`,
          `(c) Hence calculate the size of angle $\\angle \\text{BCE}$ to the nearest degree.`
        ],
        boardQuestionLines: [
          `$A(${A.join(', ')}), B(${B.join(', ')})$, $C$ divides $AB$ in $2:1$.`,
          `$D(${D.join(', ')})$, $C$ divides $\\overrightarrow{\\textsf{DE}}$ in $3:1$.`,
          `Find $C, E$, and $\\angle \\text{BCE}$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> (a) Let $C$ divide $AB$ in ratio $2:1$:`,
          `$\\mathbf{c} = \\frac{1}{3}(\\mathbf{a} + 2\\mathbf{b}) = \\frac{1}{3}\\left( \\left( \\begin{smallmatrix} ${A[0]} \\\\ ${A[1]} \\\\ ${A[2]} \\end{smallmatrix}\\right) + 2\\left( \\begin{smallmatrix} ${B[0]} \\\\ ${B[1]} \\\\ ${B[2]} \\end{smallmatrix}\\right) \\right) = \\left( \\begin{smallmatrix} ${C[0]} \\\\ ${C[1]} \\\\ ${C[2]} \\end{smallmatrix}\\right)$`,
          `Coordinates of $C$ are $(${C.join(', ')})$.`,
          `<strong>2.</strong> (b) $C$ divides $\\overrightarrow{\\textsf{DE}}$ in ratio $3:1$, so $3\\overrightarrow{\\textsf{CE}} = \\overrightarrow{\\textsf{DC}}$:`,
          `$3(\\mathbf{e} - \\mathbf{c}) = \\mathbf{c} - \\mathbf{d} \\implies 3\\mathbf{e} = 4\\mathbf{c} - \\mathbf{d}$`,
          `$3\\mathbf{e} = 4\\left( \\begin{smallmatrix} ${C[0]} \\\\ ${C[1]} \\\\ ${C[2]} \\end{smallmatrix}\\right) - \\left( \\begin{smallmatrix} ${D[0]} \\\\ ${D[1]} \\\\ ${D[2]} \\end{smallmatrix}\\right) = \\left( \\begin{smallmatrix} ${3*E[0]} \\\\ ${3*E[1]} \\\\ ${3*E[2]} \\end{smallmatrix}\\right) \\implies \\mathbf{e} = \\left( \\begin{smallmatrix} ${E[0]} \\\\ ${E[1]} \\\\ ${E[2]} \\end{smallmatrix}\\right)$`,
          `Coordinates of $E$ are $(${E.join(', ')})$.`,
          `<strong>3.</strong> (c) Angle $\\angle\\text{BCE}$ is formed by vectors pointing away from the vertex $C$: $\\overrightarrow{\\textsf{CB}}$ and $\\overrightarrow{\\textsf{CE}}$.`,
          `$\\overrightarrow{\\textsf{CB}} = \\mathbf{b} - \\mathbf{c} = \\left( \\begin{smallmatrix} ${vCB[0]} \\\\ ${vCB[1]} \\\\ ${vCB[2]} \\end{smallmatrix}\\right)$`,
          `$\\overrightarrow{\\textsf{CE}} = \\mathbf{e} - \\mathbf{c} = \\left( \\begin{smallmatrix} ${vCE[0]} \\\\ ${vCE[1]} \\\\ ${vCE[2]} \\end{smallmatrix}\\right)$`,
          `$\\overrightarrow{\\textsf{CB}} \\cdot \\overrightarrow{\\textsf{CE}} = ${vCB[0]}(${vCE[0]}) + ${vCB[1]}(${vCE[1]}) + ${vCB[2]}(${vCE[2]}) = ${dotCB_CE}$`,
          `$|\\overrightarrow{\\textsf{CB}}| = \\sqrt{${vCB[0]^2 + vCB[1]^2 + vCB[2]^2}} = \\sqrt{${vCB[0]*vCB[0] + vCB[1]*vCB[1] + vCB[2]*vCB[2]}}$`,
          `$|\\overrightarrow{\\textsf{CE}}| = \\sqrt{${vCE[0]^2 + vCE[1]^2 + vCE[2]^2}} = \\sqrt{${vCE[0]*vCE[0] + vCE[1]*vCE[1] + vCE[2]*vCE[2]}}$`,
          `$\\cos \\angle\\text{BCE} = \\frac{${dotCB_CE}}{\\sqrt{${vCB[0]*vCB[0] + vCB[1]*vCB[1] + vCB[2]*vCB[2]}} \\sqrt{${vCE[0]*vCE[0] + vCE[1]*vCE[1] + vCE[2]*vCE[2]}}} \\approx ${cosVal.toFixed(4)}$`,
          `$\\angle\\text{BCE} \\approx ${angle.toFixed(1)}^\\circ$`
        ],
        finalAnswer: `(a) $C(${C.join(', ')})$<br>(b) $E(${E.join(', ')})$<br>(c) ${Math.round(angle)}°`
      };
    } else {
      const ptA = [getRandomInt(-6, 6), getRandomInt(-6, 6), getRandomInt(-6, 6)];
      const dr = [nonZeroInt(-3, 3), nonZeroInt(-3, 3), nonZeroInt(-3, 3)];
      const r1 = getRandomInt(1, 4);
      const r2 = getRandomInt(1, 4);
      
      const totalParts = r1 + r2;
      const ptB = [ptA[0] + totalParts * dr[0], ptA[1] + totalParts * dr[1], ptA[2] + totalParts * dr[2]];
      const ptS = [ptA[0] + r1 * dr[0], ptA[1] + r1 * dr[1], ptA[2] + r1 * dr[2]];
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `$P$ and $Q$ are the points $(${ptA.join(', ')})$ and $(${ptB.join(', ')})$ respectively.`,
          `$S$ divides $PQ$ internally in the ratio $${r1} : ${r2}$.`,
          `Determine the coordinates of point $S$.`
        ],
        boardQuestionLines: [
          `$P(${ptA.join(', ')})$, $Q(${ptB.join(', ')})$.`,
          `$S$ divides $PQ$ in $${r1}:${r2}$. Find $S$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Let $S$ divide $PQ$ in ratio $${r1}:${r2}$. Then $${r2}\\overrightarrow{\\textsf{PS}} = ${r1}\\overrightarrow{\\textsf{SQ}}$.`,
          `$${r2}(\\mathbf{s} - \\mathbf{p}) = ${r1}(\\mathbf{q} - \\mathbf{s})$`,
          `<strong>2.</strong> Expand and rearrange:`,
          `$(${r1+r2})\\mathbf{s} = ${r1}\\mathbf{q} + ${r2}\\mathbf{p}$`,
          `$\\mathbf{s} = \\frac{1}{${r1+r2}}( ${r1} \\left( \\begin{smallmatrix} ${ptB[0]} \\\\ ${ptB[1]} \\\\ ${ptB[2]} \\end{smallmatrix}\\right) + ${r2} \\left( \\begin{smallmatrix} ${ptA[0]} \\\\ ${ptA[1]} \\\\ ${ptA[2]} \\end{smallmatrix}\\right) )$`,
          `$= \\frac{1}{${r1+r2}} \\left( \\begin{smallmatrix} ${r1*ptB[0] + r2*ptA[0]} \\\\ ${r1*ptB[1] + r2*ptA[1]} \\\\ ${r1*ptB[2] + r2*ptA[2]} \\end{smallmatrix}\\right) = \\left( \\begin{smallmatrix} ${ptS[0]} \\\\ ${ptS[1]} \\\\ ${ptS[2]} \\end{smallmatrix}\\right)$`
        ],
        finalAnswer: `$(${ptS.join(', ')})$`
      };
    }
  }

  if (actualTopic === "Unit vectors") {
    // k * AB is a unit vector
    const ptA = [getRandomInt(-5, 5), getRandomInt(-5, 5), getRandomInt(-5, 5)];
    const ptB = [ptA[0] + nonZeroInt(-4, 4), ptA[1] + nonZeroInt(-4, 4), ptA[2] + nonZeroInt(-4, 4)];
    
    // To make a nice square root, we can try to pick known Pythagorean triples in 3D
    // e.g. 2,3,6 => 4+9+36 = 49 (7)
    // 1,4,8 => 1+16+64 = 81 (9)
    // 2,10,11 => 4+100+121 = 225 (15)
    // 4,4,7 => 16+16+49 = 81 (9)
    const knowns = [
      [2, 3, 6], [1, 4, 8], [2, 10, 11], [4, 4, 7]
    ];
    const trip = knowns[Math.floor(Math.random() * knowns.length)];
    const signs = [Math.random() > 0.5 ? 1 : -1, Math.random() > 0.5 ? 1 : -1, Math.random() > 0.5 ? 1 : -1];
    
    ptB[0] = ptA[0] + trip[0] * signs[0];
    ptB[1] = ptA[1] + trip[1] * signs[1];
    ptB[2] = ptA[2] + trip[2] * signs[2];
    
    const mag = Math.sqrt(trip[0]*trip[0] + trip[1]*trip[1] + trip[2]*trip[2]);
    
    return {
      subTopic: actualTopic,
      questionLines: [
        `$A$ and $B$ are the points $(${ptA.join(', ')})$ and $(${ptB.join(', ')})$ respectively.`,
        `$k\\,\\overrightarrow{\\textsf{AB}}$ is a unit vector, where $k > 0$.`,
        `Determine the value of $k$.`
      ],
      boardQuestionLines: [
        `$A(${ptA.join(', ')})$, $B(${ptB.join(', ')})$.`,
        `$k\\,\\overrightarrow{\\textsf{AB}}$ is a unit vector ($k>0$). Find $k$.`
      ],
      solutionSteps: [
        `<strong>1.</strong> Vector AB: $\\overrightarrow{\\textsf{AB}} = \\left( \\begin{smallmatrix} ${ptB[0] - ptA[0]} \\\\ ${ptB[1] - ptA[1]} \\\\ ${ptB[2] - ptA[2]} \\end{smallmatrix}\\right)$`,
        `<strong>2.</strong> Magnitude: $|\\overrightarrow{\\textsf{AB}}| = \\sqrt{(${ptB[0] - ptA[0]})^2 + (${ptB[1] - ptA[1]})^2 + (${ptB[2] - ptA[2]})^2} = \\sqrt{${trip[0]*trip[0] + trip[1]*trip[1] + trip[2]*trip[2]}} = ${mag}$`,
        `<strong>3.</strong> Since $k\\,\\overrightarrow{\\textsf{AB}}$ is a unit vector, $k|\\overrightarrow{\\textsf{AB}}| = 1$.`,
        `$k = \\frac{1}{${mag}}$.`
      ],
      finalAnswer: `$k = \\frac{1}{${mag}}$`
    };
  }

  if (actualTopic === "Scalar product") {
    const type = getRandomInt(0, 5);

    if (type === 0) {
      // Find unknown component for perpendicular vectors
      const u = [nonZeroInt(-4, 4), nonZeroInt(-4, 4), nonZeroInt(-4, 4)];
      let v1 = nonZeroInt(-4, 4);
      let v2 = nonZeroInt(-4, 4);
      while ((-u[0] * v1 - u[1] * v2) % u[2] !== 0) {
        v1 = nonZeroInt(-4, 4);
        v2 = nonZeroInt(-4, 4);
      }
      const n = (-u[0] * v1 - u[1] * v2) / u[2];
      
      const useIjk = Math.random() > 0.5;
      
      if (useIjk) {
        const uIjk = `${u[0] === 1 ? '' : u[0] === -1 ? '-' : u[0]}\\underline{i} ${u[1] > 0 ? '+' : '-'} ${Math.abs(u[1]) === 1 ? '' : Math.abs(u[1])}\\underline{j} ${u[2] > 0 ? '+' : '-'} ${Math.abs(u[2]) === 1 ? '' : Math.abs(u[2])}\\underline{k}`.replace(/\s+/g, ' ').trim();
        const vIjk = `${v1 === 1 ? '' : v1 === -1 ? '-' : v1}\\underline{i} ${v2 > 0 ? '+' : '-'} ${Math.abs(v2) === 1 ? '' : Math.abs(v2)}\\underline{j} ${n >= 0 ? '+' : '-'} ${n === 0 ? '0' : Math.abs(n) === 1 ? '' : Math.abs(n) === 0 ? '0' : Math.abs(n)}\\underline{k}`.replace(/\s+/g, ' ').replace('- m\\underline{k}', '- m\\underline{k}').trim();
        
        // Wait, let's use variable m
        const questionV = vIjk.replace(/[-+]\s+\d*\\underline{k}$/, '').trim() + (n >= 0 ? ' + m\\underline{k}' : ' - m\\underline{k}').replace('+ m', '+ m').replace('- m', '- m');

        return {
          subTopic: actualTopic,
          questionLines: [
            `Two vectors are defined as $\\mathbf{u} = ${uIjk}$ and $\\mathbf{v} = ${v1 === 1 ? '' : v1 === -1 ? '-' : v1}\\underline{i} ${v2 > 0 ? '+' : '-'} ${Math.abs(v2)}\\underline{j} ${n >= 0 ? '+' : '-'} m\\underline{k}$.`,
            `Given that $\\mathbf{u}$ and $\\mathbf{v}$ are perpendicular, determine the value of $m$.`
          ],
          boardQuestionLines: [
            `$\\mathbf{u} = ${uIjk}$`,
            `$\\mathbf{v} = ${v1 === 1 ? '' : v1 === -1 ? '-' : v1}\\underline{i} ${v2 > 0 ? '+' : '-'} ${Math.abs(v2)}\\underline{j} + m\\underline{k}$`,
            `$\\mathbf{u} \\perp \\mathbf{v}$. Find $m$.`
          ],
          solutionSteps: [
            `<strong>1.</strong> Since $\\mathbf{u}$ and $\\mathbf{v}$ are perpendicular, their scalar product is zero: $\\mathbf{u} \\cdot \\mathbf{v} = 0$.`,
            `<strong>2.</strong> Calculate the scalar product:`,
            `$(${u[0]})(${v1}) + (${u[1]})(${v2}) + (${u[2]})m = 0$`,
            `$${u[0]*v1} + (${u[1]*v2}) + ${u[2]}m = 0$`,
            `$${u[0]*v1 + u[1]*v2} + ${u[2]}m = 0 \\implies ${u[2]}m = ${-(u[0]*v1 + u[1]*v2)}$`,
            `<strong>3.</strong> Solve for $m$:`,
            `$m = ${n}$`
          ],
          finalAnswer: `$m = ${n}$`
        };
      } else {
        return {
          subTopic: actualTopic,
          questionLines: [
            `Two vectors are defined as $\\mathbf{u} = \\left( \\begin{smallmatrix} ${u[0]} \\\\ ${u[1]} \\\\ ${u[2]} \\end{smallmatrix}\\right)$ and $\\mathbf{v} = \\left( \\begin{smallmatrix} ${v1} \\\\ ${v2} \\\\ n \\end{smallmatrix}\\right)$.`,
            `Given that $\\mathbf{u}$ and $\\mathbf{v}$ are perpendicular, determine the value of $n$.`
          ],
          boardQuestionLines: [
            `$\\mathbf{u} = \\left( \\begin{smallmatrix} ${u[0]} \\\\ ${u[1]} \\\\ ${u[2]} \\end{smallmatrix}\\right), \\mathbf{v} = \\left( \\begin{smallmatrix} ${v1} \\\\ ${v2} \\\\ n \\end{smallmatrix}\\right)$`,
            `$\\mathbf{u} \\perp \\mathbf{v}$. Find $n$.`
          ],
          solutionSteps: [
            `<strong>1.</strong> Since $\\mathbf{u}$ and $\\mathbf{v}$ are perpendicular, $\\mathbf{u} \\cdot \\mathbf{v} = 0$.`,
            `<strong>2.</strong> Express components:`,
            `$${u[0]}(${v1}) + ${u[1]}(${v2}) + ${u[2]}n = 0$`,
            `$${u[0]*v1 + u[1]*v2} + ${u[2]}n = 0$`,
            `$${u[2]}n = ${-(u[0]*v1 + u[1]*v2)}$`,
            `<strong>3.</strong> Divide to solve:`,
            `$n = ${n}$`
          ],
          finalAnswer: `$n = ${n}$`
        };
      }
    } else if (type === 1) {
      // Find angle BAC with points AB and AC
      const ptA = [getRandomInt(-3, 3), getRandomInt(-3, 3), getRandomInt(-3, 3)];
      const ptB = [ptA[0] + nonZeroInt(-3, 3), ptA[1] + nonZeroInt(-3, 3), ptA[2] + nonZeroInt(-3, 3)];
      const ptC = [ptA[0] + nonZeroInt(-3, 3), ptA[1] + nonZeroInt(-3, 3), ptA[2] + nonZeroInt(-3, 3)];
      
      const ab = [ptB[0]-ptA[0], ptB[1]-ptA[1], ptB[2]-ptA[2]];
      const ac = [ptC[0]-ptA[0], ptC[1]-ptA[1], ptC[2]-ptA[2]];
      
      const dot = ab[0]*ac[0] + ab[1]*ac[1] + ab[2]*ac[2];
      const mAB = Math.sqrt(ab[0]*ab[0] + ab[1]*ab[1] + ab[2]*ab[2]);
      const mAC = Math.sqrt(ac[0]*ac[0] + ac[1]*ac[1] + ac[2]*ac[2]);
      
      const cosVal = dot / (mAB * mAC);
      const angle = Math.acos(Math.max(-1, Math.min(1, cosVal))) * (180 / Math.PI);
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Points $A(${ptA.join(', ')})$, $B(${ptB.join(', ')})$ and $C(${ptC.join(', ')})$.`,
          `(a) Express $\\overrightarrow{\\textsf{AB}}$ and $\\overrightarrow{\\textsf{AC}}$ in component form.`,
          `(b) Hence calculate the size of angle $\\angle \\text{BAC}$ to the nearest degree.`
        ],
        boardQuestionLines: [
          `$A(${ptA.join(', ')})$, $B(${ptB.join(', ')})$, $C(${ptC.join(', ')})$.`,
          `Calculate angle $\\angle \\text{BAC}$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Express $\\overrightarrow{\\textsf{AB}}$ and $\\overrightarrow{\\textsf{AC}}$:`,
          `$\\overrightarrow{\\textsf{AB}} = \\left( \\begin{smallmatrix} ${ptB[0]} - ${ptA[0]} \\\\ ${ptB[1]} - ${ptA[1]} \\\\ ${ptB[2]} - ${ptA[2]} \\end{smallmatrix}\\right) = \\left( \\begin{smallmatrix} ${ab[0]} \\\\ ${ab[1]} \\\\ ${ab[2]} \\end{smallmatrix}\\right)$`,
          `$\\overrightarrow{\\textsf{AC}} = \\left( \\begin{smallmatrix} ${ptC[0]} - ${ptA[0]} \\\\ ${ptC[1]} - ${ptA[1]} \\\\ ${ptC[2]} - ${ptA[2]} \\end{smallmatrix}\\right) = \\left( \\begin{smallmatrix} ${ac[0]} \\\\ ${ac[1]} \\\\ ${ac[2]} \\end{smallmatrix}\\right)$`,
          `<strong>2.</strong> Calculate scalar product:`,
          `$\\overrightarrow{\\textsf{AB}} \\cdot \\overrightarrow{\\textsf{AC}} = ${ab[0]}(${ac[0]}) + ${(ab[1])}(${ac[1]}) + ${(ab[2])}(${ac[2]}) = ${dot}$`,
          `<strong>3.</strong> Calculate magnitudes:`,
          `$|\\overrightarrow{\\textsf{AB}}| = \\sqrt{${ab[0]}^2 + ${ab[1]}^2 + ${ab[2]}^2} = \\sqrt{${Math.round(mAB*mAB)}}$`,
          `$|\\overrightarrow{\\textsf{AC}}| = \\sqrt{${ac[0]}^2 + ${ac[1]}^2 + ${ac[2]}^2} = \\sqrt{${Math.round(mAC*mAC)}}$`,
          `<strong>4.</strong> Substitute into angle formula:`,
          `$\\cos \\angle\\text{BAC} = \\frac{\\overrightarrow{\\textsf{AB}} \\cdot \\overrightarrow{\\textsf{AC}}}{|\\overrightarrow{\\textsf{AB}}| |\\overrightarrow{\\textsf{AC}}|} = \\frac{${dot}}{\\sqrt{${Math.round(mAB*mAB)}}\\sqrt{${Math.round(mAC*mAC)}}}$`,
          `$\\cos \\angle\\text{BAC} \\approx ${cosVal.toFixed(4)}$`,
          `$\\angle\\text{BAC} \\approx ${angle.toFixed(1)}^\\circ$`
        ],
        finalAnswer: `${Math.round(angle)}°`
      };
    } else if (type === 2) {
      // Geometric scalar product with exact values
      // non-calculator style! angles like 30, 45, 60, 120, 135
      const chosen = [
        { angleText: '30^\\circ', cosText: '\\frac{\\sqrt{3}}{2}', cosVal: Math.sqrt(3)/2, aMagText: '\\sqrt{3}', bMagText: '2', aMag: Math.sqrt(3), bMag: 2, ans: '3' },
        { angleText: '45^\\circ', cosText: '\\frac{1}{\\sqrt{2}}', cosVal: 1/Math.sqrt(2), aMagText: '2\\sqrt{2}', bMagText: '3', aMag: 2*Math.sqrt(2), bMag: 3, ans: '6' },
        { angleText: '60^\\circ', cosText: '\\frac{1}{2}', cosVal: 0.5, aMagText: '4', bMagText: '5', aMag: 4, bMag: 5, ans: '10' },
        { angleText: '120^\\circ', cosText: '-\\frac{1}{2}', cosVal: -0.5, aMagText: '6', bMagText: '3', aMag: 6, bMag: 3, ans: '-9' },
        { angleText: '135^\\circ', cosText: '-\\frac{1}{\\sqrt{2}}', cosVal: -1/Math.sqrt(2), aMagText: '3\\sqrt{2}', bMagText: '5', aMag: 3*Math.sqrt(2), bMag: 5, ans: '-15' }
      ];
      
      const prob = chosen[Math.floor(Math.random() * chosen.length)];
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Two vectors $\\mathbf{a}$ and $\\mathbf{b}$ have magnitudes $|\\mathbf{a}| = ${prob.aMagText}$ and $|\\mathbf{b}| = ${prob.bMagText}$ respectively.`,
          `The angle between the vectors is $${prob.angleText}$.`,
          `Calculate the value of the scalar product $\\mathbf{a} \\cdot \\mathbf{b}$.`
        ],
        boardQuestionLines: [
          `$|\\mathbf{a}| = ${prob.aMagText}$, $|\\mathbf{b}| = ${prob.bMagText}$, angle $ = ${prob.angleText}$.`,
          `Find $\\mathbf{a} \\cdot \\mathbf{b}$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Use the formula for the scalar product:`,
          `$\\mathbf{a} \\cdot \\mathbf{b} = |\\mathbf{a}| |\\mathbf{b}| \\cos \\theta$`,
          `<strong>2.</strong> Substitute known values:`,
          `$\\mathbf{a} \\cdot \\mathbf{b} = (${prob.aMagText})(${prob.bMagText}) \\cos(${prob.angleText})$`,
          `<strong>3.</strong> Evaluate trig ratio: $\\cos(${prob.angleText}) = ${prob.cosText}$`,
          `$\\mathbf{a} \\cdot \\mathbf{b} = (${prob.aMagText})(${prob.bMagText}) \\left(${prob.cosText}\\right) = ${prob.ans}$`
        ],
        finalAnswer: `$${prob.ans}$`
      };
    } else if (type === 3) {
      // equilateral triangle with adjoined rectangle of side lengths
      // Triangle side = L, rectangle of length H.
      // a is side, b is side, c is rectangle.
      // calculate a . (a + b + c)
      // a . a + a . b + a . c
      // a . a = L^2
      // a . b = L * L * cos(120 or 60 degrees depending on alignment) -> let's say tail-to-tail angle is 120 (pointing out/in) or 60!
      // and a . c = 0 (perpendicular!)
      const L = [3, 4, 5][Math.floor(Math.random()*3)];
      const H = [5, 6, 8][Math.floor(Math.random()*3)];
      
      const ansNum = L*L + 0.5*L*L; // if angle is 60 (cos 60 = 0.5) => L^2 + 0.5 * L^2
      const ansNumStr = Number.isInteger(ansNum) ? `${ansNum}` : `\\frac{${L*L*3}}{2}`;
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `An equilateral triangle has side length $${L}$ units. Adjacent to it is a rectangle of length $${H}$ units and width $${L}$ units.`,
          `Let $\\mathbf{a}$ be the vector along a side of the triangle, $\\mathbf{b}$ be the vector along another side of the triangle pointing outward from the vertex (pointing at $60^\\circ$), and $\\mathbf{c}$ be perpendicular to $\\mathbf{a}$ along the rectangle edge.`,
          `Evaluate the expression $\\mathbf{a} \\cdot (\\mathbf{a} + \\mathbf{b} + \\mathbf{c})$ using geometric properties.`
        ],
        boardQuestionLines: [
          `Equilateral triangle side $L=${L}$ and rectangle height $H=${H}$.`,
          `Calculate $\\mathbf{a} \\cdot (\\mathbf{a} + \\mathbf{b} + \\mathbf{c})$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Expand the scalar product:`,
          `$\\mathbf{a} \\cdot (\\mathbf{a} + \\mathbf{b} + \\mathbf{c}) = \\mathbf{a} \\cdot \\mathbf{a} + \\mathbf{a} \\cdot \\mathbf{b} + \\mathbf{a} \\cdot \\mathbf{c}$`,
          `<strong>2.</strong> Calculate each term:`,
          `$\\mathbf{a} \\cdot \\mathbf{a} = |\\mathbf{a}|^2 = ${L}^2 = ${L*L}$`,
          `$\\mathbf{a} \\cdot \\mathbf{b} = |\\mathbf{a}| |\\mathbf{b}| \\cos(60^\\circ) = ${L} \\times ${L} \\times \\frac{1}{2} = ${L*L/2}$`,
          `$\\mathbf{a} \\cdot \\mathbf{c} = 0$ (since the rectangle side $\\mathbf{c}$ is perpendicular to $\\mathbf{a}$)`,
          `<strong>3.</strong> Sum the results:`,
          `$\\mathbf{a} \\cdot (\\mathbf{a} + \\mathbf{b} + \\mathbf{c}) = ${L*L} + ${L*L/2} + 0 = ${ansNumStr}$`
        ],
        finalAnswer: `$${ansNumStr}$`
      };
    } else if (type === 4) {
      // Algebraic compound scalar product u.(u+v)
      const u = [nonZeroInt(-4, 4), nonZeroInt(-4, 4), nonZeroInt(-2, 2)];
      const v = [nonZeroInt(-4, 4), nonZeroInt(-4, 4), nonZeroInt(-2, 2)];
      const uu = u[0]*u[0] + u[1]*u[1] + u[2]*u[2];
      const uv = u[0]*v[0] + u[1]*v[1] + u[2]*v[2];
      const val = uu + uv;
      
      return {
        subTopic: actualTopic,
        questionLines: [
          `Two vectors are defined as $\\mathbf{u} = \\left( \\begin{smallmatrix} ${u[0]} \\\\ ${u[1]} \\\\ ${u[2]} \\end{smallmatrix}\\right)$ and $\\mathbf{v} = \\left( \\begin{smallmatrix} ${v[0]} \\\\ ${v[1]} \\\\ ${v[2]} \\end{smallmatrix}\\right)$.`,
          `Evaluate the scalar product $\\mathbf{u} \\cdot (\\mathbf{u} + \\mathbf{v})$.`
        ],
        boardQuestionLines: [
          `$\\mathbf{u} = \\left( \\begin{smallmatrix} ${u[0]} \\\\ ${u[1]} \\\\ ${u[2]} \\end{smallmatrix}\\right), \\mathbf{v} = \\left( \\begin{smallmatrix} ${v[0]} \\\\ ${v[1]} \\\\ ${v[2]} \\end{smallmatrix}\\right)$`,
          `Evaluate $\\mathbf{u} \\cdot (\\mathbf{u} + \\mathbf{v})$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Expand the product using the distributive law:`,
          `$\\mathbf{u} \\cdot (\\mathbf{u} + \\mathbf{v}) = \\mathbf{u} \\cdot \\mathbf{u} + \\mathbf{u} \\cdot \\mathbf{v}$`,
          `<strong>2.</strong> Calculate $\\mathbf{u} \\cdot \\mathbf{u}$:`,
          `$\\mathbf{u} \\cdot \\mathbf{u} = (${u[0]})^2 + (${u[1]})^2 + (${u[2]})^2 = ${uu}$`,
          `<strong>3.</strong> Calculate $\\mathbf{u} \\cdot \\mathbf{v}$:`,
          `$\\mathbf{u} \\cdot \\mathbf{v} = (${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) + (${u[2]})(${v[2]}) = ${uv}$`,
          `<strong>4.</strong> Combine both scalar parts:`,
          `$${uu} + (${uv}) = ${val}$`
        ],
        finalAnswer: `$${val}$`
      };
    } else {
      // Find angle between two vectors directly (worksheet 1 format)
      const u = [nonZeroInt(-4, 4), nonZeroInt(-4, 4), nonZeroInt(-4, 4)];
      const v = [nonZeroInt(-4, 4), nonZeroInt(-4, 4), nonZeroInt(-4, 4)];
      
      const dot = u[0]*v[0] + u[1]*v[1] + u[2]*v[2];
      const mU = Math.sqrt(u[0]*u[0] + u[1]*u[1] + u[2]*u[2]);
      const mV = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
      
      const cosVal = dot / (mU * mV);
      const angle = Math.acos(Math.max(-1, Math.min(1, cosVal))) * (180 / Math.PI);

      const useIjk = Math.random() > 0.5;

      let uStr, vStr;
      if (useIjk) {
        uStr = `${u[0] === 1 ? '' : u[0] === -1 ? '-' : u[0]}\\underline{i} ${u[1] > 0 ? '+' : '-'} ${Math.abs(u[1]) === 1 ? '' : Math.abs(u[1])}\\underline{j} ${u[2] > 0 ? '+' : '-'} ${Math.abs(u[2]) === 1 ? '' : Math.abs(u[2])}\\underline{k}`.replace(/\s+/g, ' ').trim();
        vStr = `${v[0] === 1 ? '' : v[0] === -1 ? '-' : v[0]}\\underline{i} ${v[1] > 0 ? '+' : '-'} ${Math.abs(v[1]) === 1 ? '' : Math.abs(v[1])}\\underline{j} ${v[2] > 0 ? '+' : '-'} ${Math.abs(v[2]) === 1 ? '' : Math.abs(v[2])}\\underline{k}`.replace(/\s+/g, ' ').trim();
      } else {
        uStr = `\\left( \\begin{smallmatrix} ${u[0]} \\\\ ${u[1]} \\\\ ${u[2]} \\end{smallmatrix}\\right)`;
        vStr = `\\left( \\begin{smallmatrix} ${v[0]} \\\\ ${v[1]} \\\\ ${v[2]} \\end{smallmatrix}\\right)`;
      }

      return {
        subTopic: actualTopic,
        questionLines: [
          `Two vectors are defined as $\\mathbf{u} = ${uStr}$ and $\\mathbf{v} = ${vStr}$.`,
          `Calculate the size of the angle between $\\mathbf{u}$ and $\\mathbf{v}$.`
        ],
        boardQuestionLines: [
          `$\\mathbf{u} = ${uStr}$, $\\mathbf{v} = ${vStr}$.`,
          `Calculate the angle between $\\mathbf{u}$ and $\\mathbf{v}$.`
        ],
        solutionSteps: [
          `<strong>1.</strong> Calculate scalar product:`,
          `$\\mathbf{u} \\cdot \\mathbf{v} = (${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) + (${u[2]})(${v[2]}) = ${dot}$`,
          `<strong>2.</strong> Calculate magnitudes:`,
          `$|\\mathbf{u}| = \\sqrt{${u[0]}^2 + ${u[1]}^2 + ${u[2]}^2} = \\sqrt{${Math.round(mU*mU)}}$`,
          `$|\\mathbf{v}| = \\sqrt{${v[0]}^2 + ${v[1]}^2 + ${v[2]}^2} = \\sqrt{${Math.round(mV*mV)}}$`,
          `<strong>3.</strong> Substitute into angle formula:`,
          `$\\cos \\theta = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{|\\mathbf{u}| |\\mathbf{v}|} = \\frac{${dot}}{\\sqrt{${Math.round(mU*mU)}}\\sqrt{${Math.round(mV*mV)}}}$`,
          `$\\cos \\theta \\approx ${cosVal.toFixed(4)}$`,
          `$\\theta \\approx ${angle.toFixed(1)}^\\circ$`
        ],
        finalAnswer: `${angle.toFixed(1)}°`
      };
    }
  }

  return {
    subTopic: actualTopic,
    questionLines: ["Missing vectors question"],
    boardQuestionLines: ["Missing"],
    solutionSteps: ["Error"],
    finalAnswer: "Error"
  };
}

