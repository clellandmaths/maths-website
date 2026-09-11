import { GeneratedQuestion } from './types';
import { getRandomInt } from './utils';
import { BEARING_CONTEXTS, type BearingContext } from './n5-contexts';
import {
  bearingsTriangle, compassOf, travel, type BearingArc,
} from '../diagrams/shapes/bearings-triangle';
import { pt, type Pt } from '../diagrams/scene';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';

/**
 * The navigation questions: triangle trigonometry wrapped in bearings.
 *
 * These are the sine and cosine rules with a step bolted on at each end. The
 * angle inside the triangle is never given — it has to be read off the compass
 * arcs first — and the answer is usually wanted as a bearing, so it has to be
 * turned back afterwards. Both extra steps happen on the diagram.
 *
 *   2014 P2 Q10  three buoys: three sides, the angle, then the bearing back
 *   2015 P2 Q13  two towns due north-south, a bearing from each, find a side
 *   2017 P2 Q10  two towns due east-west, a bearing from each, one reflex
 *   2018 P2 Q13  ferry, trawler and yacht: three sides and a reflex bearing
 *   2025 P2 Q12  orienteering: two sides and one bearing, find a bearing
 *
 * Everything is built by placing the points from the bearings and then reading
 * the geometry back off them. Nothing is worked out twice: the printed bearings
 * come from the construction, and the answer is measured from the same points
 * the diagram is drawn from. That is the only way the picture and the prose
 * cannot drift apart, which at National 5 is the whole difficulty — a pupil who
 * cannot trust the diagram cannot start.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

const DEG = Math.PI / 180;
const sin = (d: number) => Math.sin(d * DEG);
const dp1 = (v: number) => v.toFixed(1);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Bearings are written with three digits, so 060° not 60°.
 *
 * Two forms, because there are two renderers. Prose goes through MathJax, so
 * the degree sign is `^{\circ}` inside `$…$`. A diagram is SVG, where `<text>`
 * is drawn exactly as written and `^{\circ}` would appear on the page as those
 * eight characters.
 */
const pad = (v: number) => String(Math.round(v) % 360).padStart(3, '0');
const brg = (v: number) => `${pad(v)}^{\\circ}`;
const brgPlain = (v: number) => `${pad(v)}°`;
const CARDINAL: Record<number, string> = { 0: 'north', 90: 'east', 180: 'south', 270: 'west' };

/**
 * A north arrow is only drawn where it would not lie along a side.
 *
 * 2015 leans on exactly this: Portlee is due south of Queenstown, so the side
 * PQ *is* the north line at P and the paper measures the 72° from it. Drawing
 * an arrow on top of the side would say nothing and look like an error.
 */
function needsArrow(points: Pt[], i: number): boolean {
  return !points.some((p, j) => j !== i && Math.abs(((compassOf(points[i], p) + 180) % 360) - 180) < 2);
}

/** The intro sentence with the context's letters put in. */
function intro(c: BearingContext): string {
  return c.intro.replace(/\{(\d)\}/g, (_, d) => `$${c.letters[Number(d)]}$`);
}

export function bearingsQuestion(kinds: string[]): Q {
  // The branch is chosen once, before the retry loop, not inside it.
  //
  // Choosing inside means a rejected layout re-enters the lottery rather than
  // retrying the branch that was asked for, so what reaches the page ends up
  // proportional to (chosen x survived) instead of to chosen. A figure that is
  // harder to lay out is then quietly buried by an easier one: the cuboid on
  // axes was picked half the time and reached the page 9% of the time.
  //
  // Fixing it here also makes a branch that can *never* lay out fail loudly
  // instead of silently substituting its neighbour, which is how a figure once
  // went missing entirely without a single check noticing.
  const kind = pick(kinds);
  for (let tries = 0; tries < 4000; tries++) {
    const c = pick(BEARING_CONTEXTS);
    // which way round the third point lies: every bearing in the question, and
    // the sign of the arithmetic at the end, follows from this one choice
    const side = pick([1, -1]);
    const q = kind === 'side' ? twoBearings(c, side)
      : kind === 'two-sides' ? twoSides(c, side)
      : threeSides(c, side, kind);
    if (q) return q;
  }
  throw new Error('bearings: no valid question found');
}

// ── two bearings from two known points: the sine rule for a side ────────────
// 2015 P2 Q13, 2017 P2 Q10. The two places lie on a cardinal line so the angle
// at each of them can be read straight off its bearing.
function twoBearings(c: BearingContext, side: number): Q | null {
  const [nA, nB, nC] = c.letters;
  const [rA, rB, rC] = c.refer;
  const base = pick([0, 90, 180, 270]);
  const d = getRandomInt(c.band[0], c.band[1]);
  const alpha = getRandomInt(26, 76);
  const beta = getRandomInt(26, 76);
  const gamma = 180 - alpha - beta;
  if (gamma < 26 || gamma > 110) return null;

  const bA = ((base - side * alpha) % 360 + 360) % 360;
  const bB = ((base + 180 + side * beta) % 360 + 360) % 360;
  const A = pt(0, 0);
  const B = travel(A, base, d);
  const AC = d * sin(beta) / sin(gamma);
  const C = travel(A, bA, AC);
  if (AC < d * 0.3 || AC > d * 3) return null;      // keep the drawing balanced

  const points: [Pt, Pt, Pt] = [A, B, C];
  const arcs: BearingArc[] = [
    { at: 0, to: 2, compass: bA, label: brgPlain(bA) },
    { at: 1, to: 2, compass: bB, label: brgPlain(bB) },
  ];
  const fig = bearingsTriangle({
    names: c.letters, points, arcs,
    north: [0, 1].filter(i => needsArrow(points, i)),
    sides: [`${d} ${c.short}`, '', ''],
  });
  if (!fig) return null;

  const prose = [
    intro(c),
    `${cap(rA)} is ${d} ${c.unit} due ${CARDINAL[(base + 180) % 360]} of ${rB}.`,
    `From ${rA}, the bearing of ${rC} is $${brg(bA)}$.`,
    `From ${rB}, the bearing of ${rC} is $${brg(bB)}$.`,
    `Calculate the distance between ${rA} and ${rC}.`,
    'Do not use a scale drawing.',
  ];
  // Four marks in both papers: •¹ calculate the angles of the triangle,
  // •² correct substitution into the sine rule, •³ rearrange it, •⁴ calculate
  // the side. All three angles are one mark between them, so they are one step.
  const steps = [
    `<strong>1.</strong> ${cap(rB)} is due ${CARDINAL[base]} of ${rA}, so the bearing of ${rB} from ${rA} is $${brg(base)}$ and the bearing back is $${brg((base + 180) % 360)}$. Each angle inside the triangle is the difference between two bearings, and the third follows from the angle sum:<br><br>$${nA} = ${alpha}^{\\circ}$, $${nB} = ${beta}^{\\circ}$, $${nC} = 180 - ${alpha} - ${beta} = ${gamma}^{\\circ}$`,
    `<strong>2.</strong> Now the sine rule, pairing each side with the angle opposite it. $${nA}${nC}$ is opposite $${nB}$, and $${nA}${nB}$ is opposite $${nC}$:<br><br>$\\frac{${nA}${nC}}{\\sin ${beta}^{\\circ}} = \\frac{${d}}{\\sin ${gamma}^{\\circ}}$`,
    `<strong>3.</strong> Rearrange to make $${nA}${nC}$ the subject:<br><br>$${nA}${nC} = \\frac{${d} \\times \\sin ${beta}^{\\circ}}{\\sin ${gamma}^{\\circ}}$`,
    `<strong>4.</strong> Evaluate:<br><br>$${nA}${nC} = ${dp1(AC)}$ ${c.short}`,
  ];
  const text = [...prose, ...steps].join(' ');
  if (verifyFigure(fig, text).length) return null;

  return {
    subTopic: 'Bearings with the Sine Rule',
    difficulty: 'exam',
    variationId: 'bearings.two-bearings',
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
    boardQuestionLines: [`${nA} is ${d} ${c.short} due ${CARDINAL[(base + 180) % 360]} of ${nB}. Bearing of ${nC}: ${brgPlain(bA)} from ${nA}, ${brgPlain(bB)} from ${nB}. Find ${nA}${nC}.`],
    solutionSteps: steps,
    stepMarks: [1, 1, 1, 1],
    finalAnswer: `$${dp1(AC)}$ ${c.unit}`,
    figure: fig,
  };
}

// ── three sides: the cosine rule, then the bearing back ─────────────────────
// 2014 P2 Q10 asks for the angle and then the shaded angle, 3 + 2; 2018 P2 Q13
// asks only for the bearing, 4 in one part. Both turn on the same figure, so
// both are generated from it, and the `angle` kind produces 2014's *whole*
// question rather than only its part (a).
function threeSides(c: BearingContext, side: number, kind: string): Q | null {
  const [nA, nB, nC] = c.letters;
  const [rA, rB, rC] = c.refer;
  const [lo, hi] = c.band;
  // Either all three distances are whole, as 2014 gives them, or all three
  // carry a decimal, as 2018 does. A drawing reading "12.2", "15.6", "15"
  // mixes the two and looks like one of them was rounded by accident.
  const oneDp = c.band[1] < 20 && getRandomInt(0, 1) === 0;
  const draw = () => oneDp
    ? getRandomInt(lo * 10, hi * 10 - 1) / 10
    : getRandomInt(lo, hi);
  const show = (v: number) => oneDp ? v.toFixed(1) : `${v}`;

  // B is the pivot: the two legs from it are given, and so is the third side
  const ba = draw(), bcLen = draw(), ca = draw();
  if (ba + bcLen <= ca * 1.03 || bcLen + ca <= ba * 1.03 || ca + ba <= bcLen * 1.03) return null;
  const phi = Math.acos((ba * ba + bcLen * bcLen - ca * ca) / (2 * ba * bcLen)) / DEG;
  if (phi < 26 || phi > 140) return null;

  const given = getRandomInt(1, 71) * 5 % 360;         // a bearing in whole degrees
  const B = pt(0, 0);
  const A = travel(B, given, ba);
  const C = travel(B, given + side * phi, bcLen);
  const answer = ((given + side * phi) % 360 + 360) % 360;
  // a bearing that rounds to 000 reads as no bearing at all
  if (Math.round(answer) % 360 === 0) return null;

  const points: [Pt, Pt, Pt] = [A, B, C];
  // 2018 states the bearing at the pivot; 2014 states it the other way round,
  // from the far point, and marks the wanted angle at the pivot unlabelled
  // 2018 states the bearing at the pivot; 2014 states it from the far point,
  // and its part (b) works back through the back bearing, which is the route
  // its scheme prices ("360 - 120 - [answer to (a)]"). So the two-part question
  // always takes 2014's arrangement.
  const atPivot = kind === 'angle' ? false : getRandomInt(0, 1) === 0;
  const stated = atPivot ? given : (given + 180) % 360;
  const arcs: BearingArc[] = atPivot
    ? [{ at: 1, to: 0, compass: given, label: brgPlain(given) }]
    : [{ at: 0, to: 1, compass: stated, label: brgPlain(stated) }];
  // The arc for the angle being *asked* for goes on only when the given
  // bearing is marked somewhere else. 2014 states its bearing at A and shades
  // the answer at B; 2018 states its at the pivot and draws nothing for the
  // answer. Two arcs at one vertex, same radius, merge into a circle.
  if (kind !== 'two-sides' && !atPivot) {
    // Shaded only where the words say shaded. 2014 P2 Q10 is the two-part
    // 'angle' shape and ends "find the size of the shaded angle"; the bearing
    // shape asks for a bearing by name and its paper shades nothing, so filling
    // it there would be ink asserting a region the question never mentions.
    arcs.push({ at: 1, to: 2, compass: answer, label: '', shade: kind === 'angle' });
  }

  const fig = bearingsTriangle({
    names: c.letters, points, arcs,
    north: [...new Set(arcs.map(a => a.at))].filter(v => needsArrow(points, v)),
    sides: [`${show(ba)} ${c.short}`, `${show(bcLen)} ${c.short}`,
            `${show(ca)} ${c.short}`],
  });
  if (!fig) return null;

  // 2018 lists the three distances and states the bearing separately; 2014
  // folds each distance into the sentence that places the point. Repeating a
  // distance in both would be the generator talking, not the exam.
  const setup = atPivot
    ? `${cap(rA)} is on a bearing of $${brg(given)}$ from ${rB}.`
    : `$${nB}$ is ${show(ba)} ${c.unit} from $${nA}$ on a bearing of $${brg(stated)}$.`;
  const facts = atPivot ? [
    `$${nA}${nB}$ is ${show(ba)} ${c.unit}.`,
    `$${nB}${nC}$ is ${show(bcLen)} ${c.unit}.`,
    `$${nC}${nA}$ is ${show(ca)} ${c.unit}.`,
    setup,
  ] : [
    setup,
    `$${nC}$ is ${show(bcLen)} ${c.unit} from $${nB}$.`,
    `$${nA}$ is ${show(ca)} ${c.unit} from $${nC}$.`,
  ];
  // **The whole of 2014 P2 Q10, both parts.** It was cloned as part (a) alone
  // for a long time and cited honestly as "2014 P2 Q10a" - but a pupil asking
  // for that question then got three of its five marks. Part (b) is the shaded
  // angle at the pivot, which is the bearing of the third point from it.
  const ask = kind === 'angle'
    ? [`<b>(a)</b>&nbsp;&nbsp;Calculate the size of angle $${nA}${nB}${nC}$.`,
       `<b>(b)</b>&nbsp;&nbsp;Hence find the size of the shaded angle.`]
    : [`Calculate the bearing of ${rC} from ${rB}.`];
  const prose = [intro(c), ...facts, ...ask];

  // The schemes pay for the substitution and for the value of cos separately —
  // 2014 P2 Q10(a) and 2018 P2 Q13 both read •¹ substitute correctly into the
  // cosine rule, •² calculate cos B correctly, •³ calculate the angle. So the
  // substitution and its evaluation are two steps, not one.
  const cosSub = `<strong>1.</strong> All three sides are known, so substitute into the cosine rule for the angle at $${nB}$:<br><br>$\\cos ${nB} = \\frac{${show(ba)}^{2} + ${show(bcLen)}^{2} - ${show(ca)}^{2}}{2 \\times ${show(ba)} \\times ${show(bcLen)}}$`;
  const cosVal = `<strong>2.</strong> Work that out:<br><br>$\\cos ${nB} = ${((ba * ba + bcLen * bcLen - ca * ca) / (2 * ba * bcLen)).toFixed(4)}$`;
  const angStep = `<strong>3.</strong> Take the inverse cosine:<br><br>$${nA}${nB}${nC} = ${dp1(phi)}^{\\circ}$`;
  // The scheme pays part (b) twice: "know how to calculate the angle", then
  // "correctly calculate the angle within a valid strategy". So the back
  // bearing and the arithmetic are two steps, not one.
  const backBearing = `<strong>4. (b)</strong> The bearing given is of $${nB}$ from $${nA}$, so the bearing of $${nA}$ from $${nB}$ is the back bearing:<br><br>$${Math.round(stated)} ${stated < 180 ? '+' : '-'} 180 = ${brg(given)}$`;
  const shaded = `<strong>5. (b)</strong> The shaded angle turns ${side > 0 ? 'clockwise' : 'anticlockwise'} from there by angle $${nA}${nB}${nC}$:<br><br>$${Math.round(given)} ${side > 0 ? '+' : '-'} ${dp1(phi)} = ${dp1(((given + side * phi) % 360 + 360) % 360)}^{\\circ}$`;
  // The first three carry their part label too when there are two parts, so the
  // hints read (a)(a)(a)(b)(b) rather than starting to name parts halfway.
  const partA = (t: string) => t.replace(/<\/strong>/, ' (a)</strong>');
  const steps = kind === 'angle'
    ? [partA(cosSub), partA(cosVal), partA(angStep), backBearing, shaded]
    : [
    cosSub, cosVal, angStep,
    atPivot
      ? `<strong>4.</strong> The bearing of ${rA} from ${rB} is $${brg(given)}$, and angle $${nA}${nB}${nC}$ turns ${side > 0 ? 'clockwise' : 'anticlockwise'} from there to $${nB}${nC}$, so the bearing to the nearest degree is:<br><br>$${Math.round(given)} ${side > 0 ? '+' : '-'} ${dp1(phi)} = ${dp1(((given + side * phi) % 360 + 360) % 360)}^{\\circ}$, that is $${brg(answer)}$`
      : `<strong>4.</strong> The bearing given is of $${nB}$ from $${nA}$, so the bearing of $${nA}$ from $${nB}$ is the back bearing, $${Math.round(stated)} ${stated < 180 ? '+' : '-'} 180 = ${brg(given)}$. Angle $${nA}${nB}${nC}$ turns ${side > 0 ? 'clockwise' : 'anticlockwise'} from there to $${nB}${nC}$:<br><br>$${Math.round(given)} ${side > 0 ? '+' : '-'} ${dp1(phi)} = ${dp1(((given + side * phi) % 360 + 360) % 360)}^{\\circ}$, that is $${brg(answer)}$`,
  ];
  const text = [...prose, ...steps].join(' ');
  if (verifyFigure(fig, text).length) return null;

  return {
    subTopic: kind === 'angle' ? 'Bearings with the Cosine Rule' : 'Finding a Bearing',
    difficulty: 'exam',
    variationId: kind === 'angle' ? 'bearings.three-sides-angle' : 'bearings.three-sides-bearing',
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
    boardQuestionLines: [`${nA}${nB} = ${show(ba)}, ${nB}${nC} = ${show(bcLen)}, ${nC}${nA} = ${show(ca)} ${c.short}. ${setup.replace(/\$/g, '')} ${ask.join(' ').replace(/<[^>]+>|&nbsp;|\$/g, '')}`],
    solutionSteps: steps,
    stepMarks: steps.map(() => 1),
    finalAnswer: kind === 'angle'
      ? `(a) $${dp1(phi)}^{\\circ}$<br>(b) $${dp1(((given + side * phi) % 360 + 360) % 360)}^{\\circ}$`
      : `$${brg(answer)}$`,
    figure: fig,
  };
}

// ── two sides and one bearing: the sine rule, then the bearing back ─────────
// 2025 P2 Q12. The angle inside the triangle comes from the bearing against the
// cardinal line, and the sine rule gives the angle opposite the known side.
function twoSides(c: BearingContext, side: number): Q | null {
  const [nA, nB, nC] = c.letters;
  const [rA, rB, rC] = c.refer;
  const base = pick([0, 90, 180, 270]);
  const ab = getRandomInt(c.band[0], c.band[1]);
  const alpha = getRandomInt(28, 72);
  const bcLen = Math.round(ab * (getRandomInt(70, 145) / 100));
  const ratio = ab * sin(alpha) / bcLen;
  if (ratio > 0.985) return null;
  const gamma = Math.asin(ratio) / DEG;
  // near 90° the two sine-rule solutions sit almost on top of each other and
  // the drawing stops settling which one is meant
  if (Math.abs(gamma - 90) < 14) return null;
  const beta = 180 - alpha - gamma;
  if (beta < 22) return null;

  const bC = ((base - side * alpha) % 360 + 360) % 360;
  const A = pt(0, 0);
  const B = travel(A, base, ab);
  const C = travel(A, bC, bcLen * sin(beta) / sin(alpha));
  const answer = compassOf(B, C);
  if (Math.round(answer) % 360 === 0) return null;

  const points: [Pt, Pt, Pt] = [A, B, C];
  const fig = bearingsTriangle({
    names: c.letters, points,
    arcs: [{ at: 0, to: 2, compass: bC, label: brgPlain(bC) }],
    north: [0, 1].filter(i => needsArrow(points, i)),
    sides: [`${ab} ${c.short}`, `${bcLen} ${c.short}`, ''],
  });
  if (!fig) return null;

  const prose = [
    intro(c),
    `${cap(rB)} is ${ab} ${c.unit} due ${CARDINAL[base]} of ${rA}.`,
    `The bearing of ${rC} from ${rA} is $${brg(bC)}$.`,
    `${cap(rC)} is ${bcLen} ${c.unit} from ${rB}.`,
    `Calculate the bearing of ${rC} from ${rB}.`,
  ];
  // 2025 P2 Q12 is four marks: •¹ correct substitution into the sine rule,
  // •² rearrange the equation, •³ calculate the angle, •⁴ calculate the bearing.
  // The angle at A comes from the bearings and is not paid for separately, so
  // it opens the substitution step.
  const steps = [
    `<strong>1.</strong> ${cap(rB)} is due ${CARDINAL[base]} of ${rA}, so its bearing from ${rA} is $${brg(base)}$ and the angle at $${nA}$ is the difference between that and $${brg(bC)}$, namely $${alpha}^{\\circ}$. Now substitute into the sine rule, pairing $${nA}${nB}$ with the angle at $${nC}$ and $${nB}${nC}$ with the angle at $${nA}$:<br><br>$\\frac{${bcLen}}{\\sin ${alpha}^{\\circ}} = \\frac{${ab}}{\\sin ${nC}}$`,
    `<strong>2.</strong> Rearrange to make $\\sin ${nC}$ the subject:<br><br>$\\sin ${nC} = \\frac{${ab} \\times \\sin ${alpha}^{\\circ}}{${bcLen}} = ${ratio.toFixed(4)}$`,
    `<strong>3.</strong> The diagram shows the ${gamma < 90 ? 'acute' : 'obtuse'} case, and the angles add to $180^{\\circ}$:<br><br>$${nC} = ${dp1(gamma)}^{\\circ}$, so $${nA}${nB}${nC} = 180 - ${alpha} - ${dp1(gamma)} = ${dp1(beta)}^{\\circ}$`,
    // which way the angle turns is a question about the picture, so it is read
    // off the picture: adding it must land on the bearing that was measured
    `<strong>4.</strong> The bearing of ${rA} from ${rB} is $${brg((base + 180) % 360)}$, and angle $${nA}${nB}${nC}$ turns ${Math.abs(((base + 180 + beta - answer + 540) % 360) - 180) < 0.5 ? 'clockwise' : 'anticlockwise'} from there:<br><br>$${brg(answer)}$`,
  ];
  const text = [...prose, ...steps].join(' ');
  if (verifyFigure(fig, text).length) return null;

  return {
    subTopic: 'Finding a Bearing',
    difficulty: 'exam',
    variationId: 'bearings.two-sides',
    stepMarks: [1, 1, 1, 1],
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
    boardQuestionLines: [`${nB} is ${ab} ${c.short} due ${CARDINAL[base]} of ${nA}. Bearing of ${nC} from ${nA} is ${brgPlain(bC)}. ${nB}${nC} = ${bcLen} ${c.short}. Bearing of ${nC} from ${nB}?`],
    solutionSteps: steps,
    finalAnswer: `$${brg(answer)}$`,
    figure: fig,
  };
}

export const BEARINGS_GENERATORS: Record<string, () => Q> = {
  'Bearings with the Sine Rule': () => bearingsQuestion(['side']),
  'Bearings with the Cosine Rule': () => bearingsQuestion(['angle']),
  'Finding a Bearing': () => bearingsQuestion(['bearing', 'two-sides']),
};
