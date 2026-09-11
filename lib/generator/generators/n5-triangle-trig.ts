import { GeneratedQuestion } from './types';

/** "a = b", or just "a" when the simplification changed nothing. */
const orSame = (raw: string, simplified: string): string =>
  raw === simplified ? raw : `${raw} = ${simplified}`;

import { getRandomInt, gcd, formatNum } from './utils';
import { triangleFromSides } from '../diagrams/shapes/triangle-sides';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';
import { abbrev } from './n5-contexts';

/**
 * The three Paper 1 triangle questions all print a figure, and none of these
 * drew one. Reported by the user after picking 2014 P1 Q5 and getting a
 * question with no image; `audit-lost-figures.mts` then found 17 such citations.
 *
 * **All four papers draw the same thing** - 2014 P1 Q5, 2018 P1 Q10, 2023 P1 Q6
 * and 2022 P1 Q9 - and it is simpler than it looks: a bare triangle with its
 * three vertices lettered and **only the given lengths written on it**. No angle
 * marks, no right angles, and the sines and the cosine stay in the prose where
 * the paper puts them. Opening the four images is what settled that; the first
 * plan here was to letter the angles too.
 *
 * The unknown side is drawn but left unlabelled, so the figure is to scale
 * without handing over the answer.
 */

/**
 * How heavy a denominator this variation's ANSWER may print.
 *
 * Chosen by the user on 2026-09-10 from a priced table, and every number is
 * anchored to what the cited paper's own answer uses. These are judgements
 * about difficulty rather than fixes for faults - nothing here was wrong, it
 * was heavier than the exam sets, and four of the five are non-calculator.
 *
 * **Cost was not the constraint.** Measured at 600 draws, even the strictest
 * column considered left more than 200 distinct questions per variation, and a
 * sheet needs six. The only thing at stake was how hard they should be.
 */
/** cosine-rule.angle-exact */
const MAX_COS_DEN = 20;

/**
 * National 5 sine rule, cosine rule and the area of a triangle — the versions
 * that need no diagram.
 *
 * Paper 1 asks all three without a picture, because without a calculator the
 * ratio has to be given:
 *
 *   "In triangle XYZ: XZ = 10 cm, YZ = 8 cm, cos Z = 1/8.
 *    Calculate the length of XY."                            2018 P1 Q10
 *   "In triangle ABC: AC = 5 m, BC = 6 m, cos C = 1/5.
 *    Calculate the length of AB."                            2023 P1 Q6
 *   "In triangle KLM: KM = 18 cm, sin K = 0.4, sin L = 0.9.
 *    Calculate the length of LM."                            2014 P1 Q5
 *
 * Every one has an exact whole-number answer, which is the constraint that
 * makes them non-calculator: the generator works backwards from that.
 *
 * The Paper 2 versions are the same maths with an angle in degrees and a
 * diagram. Stated in words — "In triangle ABC, a = 7 cm, b = 9 cm and angle C
 * is 40°" — they need no picture either, so those are built here as the skill
 * tier and the diagram versions can follow when the shape routine exists.
 *
 * Which side is opposite which angle is the whole difficulty of the sine rule,
 * so the naming is always explicit and the working names the pair it uses.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

/** Three distinct vertex letters, as the papers name them. */
const TRIANGLES: [string, string, string][] = [
  ['A', 'B', 'C'], ['X', 'Y', 'Z'], ['K', 'L', 'M'], ['P', 'Q', 'R'],
  ['D', 'E', 'F'], ['S', 'T', 'U'], ['J', 'K', 'L'], ['W', 'X', 'Y'],
];

const UNITS = ['centimetres', 'metres', 'millimetres', 'kilometres'];

/** A fraction in lowest terms as LaTeX, or a plain integer. */
function frac(n: number, d: number): string {
  const g = gcd(Math.abs(n), Math.abs(d)) || 1;
  let [a, b] = [n / g, d / g];
  if (b < 0) { a = -a; b = -b; }
  if (b === 1) return `${a}`;
  return a < 0 ? `-\\frac{${-a}}{${b}}` : `\\frac{${a}}{${b}}`;
}

const dp1 = (v: number): string => v.toFixed(1);

/** Three lengths that actually make a triangle, and not a very flat one. */
const validTriangle = (a: number, b: number, c: number): boolean =>
  a + b > c * 1.06 && b + c > a * 1.06 && c + a > b * 1.06;

// ── Paper 1: the cosine rule with the cosine given ───────────────────────
//    2018 P1 Q10, 2023 P1 Q6
//
//    c^2 = a^2 + b^2 - 2ab cos C
//
// Answer-first on the answer's *squareness*: a, b and cos C are searched until
// the result is a perfect square, which is what makes the question sit in the
// non-calculator paper.

function cosineRuleSideExact(): Q {
  for (let tries = 0; tries < 900; tries++) {
    const [A, B, C] = pick(TRIANGLES);
    const unit = pick(UNITS);
    const a = getRandomInt(4, 14), b = getRandomInt(4, 14);
    const den = pick([2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const numr = getRandomInt(-(den - 1), den - 1);
    if (numr === 0 || gcd(Math.abs(numr), den) !== 1) continue;
    const twoAbCos = 2 * a * b * numr / den;
    if (!Number.isInteger(twoAbCos)) continue;
    const cSq = a * a + b * b - twoAbCos;
    const c = Math.sqrt(cSq);
    if (!Number.isInteger(c) || c < 3) continue;
    if (!validTriangle(a, b, c)) continue;

    // C is the angle at the third vertex; a and b are the sides meeting there
    const cosTex = frac(numr, den);

    // 2018 P1 Q10 letters X, Y, Z and writes 10 cm and 8 cm on the two given
    // sides. XY - the answer - is drawn and not labelled.
    const u = abbrev(unit);
    const fig = triangleFromSides({
      sides: { ab: c, bc: a, ca: b },
      vertices: [A, B, C],
      labels: { ab: '', bc: `${a} ${u}`, ca: `${b} ${u}` },
      turn: pick([0, 1, 2, 3] as const),
    });
    if (!fig) continue;
    const givens = [
      `In triangle $${A}${B}${C}$:`,
      `&bull;&nbsp; $${A}${C} = ${b}$ ${unit}`,
      `&bull;&nbsp; $${B}${C} = ${a}$ ${unit}`,
      `&bull;&nbsp; $\\cos ${C} = ${cosTex}$`,
    ];
    const ask = `Calculate the length of $${A}${B}$.`;
    // Verify the figure against the words, as every other figure-bearing
    // variation does. Leaving this out is what put a measurement across the
    // line it measures on the very first render of these three.
    if (verifyFigure(fig, [...givens, ask].join(' ')).length) continue;

    return {
      subTopic: 'Cosine Rule: Finding a Side',
      difficulty: 'exam',
      variationId: 'cosine-rule.side-exact',
      questionLines: [...givens, renderScene(fig.scene), ask],
      boardQuestionLines: [`$${A}${C}=${b}$, $${B}${C}=${a}$, $\\cos ${C} = ${cosTex}$. Find $${A}${B}$`],
      solutionSteps: [
        `<strong>1.</strong> $${A}${B}$ is opposite the angle at $${C}$, so use the cosine rule in the form $${A}${B}^{2} = ${A}${C}^{2} + ${B}${C}^{2} - 2(${A}${C})(${B}${C})\\cos ${C}$:<br><br>$${A}${B}^{2} = ${b}^{2} + ${a}^{2} - 2 \\times ${b} \\times ${a} \\times ${cosTex}$`,
        `<strong>2.</strong> Work through it:<br><br>$${A}${B}^{2} = ${b * b} + ${a * a} - ${formatNum(twoAbCos)} = ${cSq}$`,
        `<strong>3.</strong> Take the square root:<br><br>$${A}${B} = ${c}$ ${unit}`,
      ],
      // •¹ correct substitution into the cosine rule, •² evaluate the square,
      // •³ take the root
      stepMarks: [1, 1, 1],
      finalAnswer: `$${c}$ ${unit}`,
      figure: fig,
    };
  }
  throw new Error('cosine-rule.side-exact: no valid question found');
}

// ── Paper 1: the cosine rule rearranged for the angle — 2022 P1 Q9 ───────
//
//    cos B = (a^2 + c^2 - b^2) / 2ac,  answered as a fraction in simplest form

function cosineRuleAngleExact(): Q {
  for (let tries = 0; tries < 900; tries++) {
    const [A, B, C] = pick(TRIANGLES);
    const unit = pick(UNITS);
    // sides named after the vertices they join
    const AB = getRandomInt(4, 14), BC = getRandomInt(3, 13), AC = getRandomInt(3, 14);
    if (!validTriangle(AB, BC, AC)) continue;
    const numr = AB * AB + BC * BC - AC * AC;
    const den = 2 * AB * BC;
    if (numr === 0) continue;
    const g = gcd(Math.abs(numr), den);
    if (g === den) continue;                       // a whole number is too easy
    if (Math.abs(numr) >= den) continue;           // |cos| must be under 1

    // **A sliver is not a triangle worth setting.** |cos B| above 0.95 puts the
    // angle under 18 degrees or over 162, which was 5.5% of draws - and it is
    // also the mechanism behind the heavy denominators. When cos is close to 1,
    // `den - |numr|` is small, and gcd(numr, den) divides that difference, so
    // the fraction has almost nothing to cancel and prints its full 2ab. That is
    // how a clone of a question answered 11/14 reached 265/364.
    if (Math.abs(numr) > 0.95 * den) continue;

    // 2022 P1 Q9 answers 11/14. The clone's MEDIAN was 25 and it reached 338,
    // so it was the typical question that was too heavy here, not the tail -
    // and removing every sliver triangle moved this by nothing, which is how
    // we know the two are separate faults.
    if (den / g > MAX_COS_DEN) continue;

    // 2022 P1 Q9 letters A, B, C and writes all three lengths on the figure:
    // 7 cm, 5 cm, 3 cm. The answer is a cosine rather than a length, so
    // there is nothing here to withhold.
    const u = abbrev(unit);
    const fig = triangleFromSides({
      sides: { ab: AB, bc: BC, ca: AC },
      vertices: [A, B, C],
      labels: { ab: `${AB} ${u}`, bc: `${BC} ${u}`, ca: `${AC} ${u}` },
      turn: pick([0, 1, 2, 3] as const),
    });
    if (!fig) continue;
    const givens = [
      `In triangle $${A}${B}${C}$:`,
      `&bull;&nbsp; $${A}${B} = ${AB}$ ${unit}`,
      `&bull;&nbsp; $${B}${C} = ${BC}$ ${unit}`,
      `&bull;&nbsp; $${A}${C} = ${AC}$ ${unit}`,
    ];
    const ask = `Calculate the value of $\\cos ${B}$. Give your answer in its simplest form.`;
    // Verify the figure against the words, as every other figure-bearing
    // variation does. Leaving this out is what put a measurement across the
    // line it measures on the very first render of these three.
    if (verifyFigure(fig, [...givens, ask].join(' ')).length) continue;


    return {
      subTopic: 'Cosine Rule: Finding an Angle',
      difficulty: 'exam',
      variationId: 'cosine-rule.angle-exact',
      questionLines: [...givens, renderScene(fig.scene), ask],
      boardQuestionLines: [`Sides ${AB}, ${BC}, ${AC}. Find $\\cos ${B}$`],
      // 2022 P1 Q9 is two marks, not three: •¹ correct substitution into the
      // cosine rule, •² calculate cos B in simplest form. Working the fraction
      // out and simplifying it are the same mark.
      solutionSteps: [
        `<strong>1.</strong> The angle at $${B}$ sits between $${A}${B}$ and $${B}${C}$, and $${A}${C}$ is opposite it. Rearranged, the cosine rule gives:<br><br>$\\cos ${B} = \\frac{${A}${B}^{2} + ${B}${C}^{2} - ${A}${C}^{2}}{2(${A}${B})(${B}${C})} = \\frac{${AB * AB} + ${BC * BC} - ${AC * AC}}{2 \\times ${AB} \\times ${BC}}$`,
        `<strong>2.</strong> Work it out and simplify:<br><br>$\\cos ${B} = ${orSame(`\\frac{${numr}}{${den}}`, frac(numr, den))}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$\\cos ${B} = ${frac(numr, den)}$`,
      figure: fig,
    };
  }
  throw new Error('cosine-rule.angle-exact: no valid question found');
}

// ── Paper 1: the sine rule with both sines given — 2014 P1 Q5 ────────────
//
//    LM / sin K = KM / sin L,  so  LM = KM sin K / sin L
//
// The pairing is the point: LM is opposite K, KM is opposite L. Both sines are
// given as one-place decimals, and the given side is chosen so the answer is
// whole.

function sineRuleSideExact(): Q {
  for (let tries = 0; tries < 900; tries++) {
    const [K, L, M] = pick(TRIANGLES);
    const unit = pick(UNITS);
    const sinK = getRandomInt(2, 8) / 10;
    const sinL = getRandomInt(3, 9) / 10;
    if (sinK >= sinL) continue;                    // keep the answer shorter than the given side
    const kNum = Math.round(sinK * 10), lNum = Math.round(sinL * 10);
    if (gcd(kNum, lNum) === Math.min(kNum, lNum) && kNum !== lNum) { /* fine */ }
    const step = lNum / gcd(kNum, lNum);
    const KM = step * getRandomInt(2, 6);
    const LM = KM * sinK / sinL;
    if (!Number.isInteger(LM) || LM < 3 || KM > 60) continue;

    // 2014 P1 Q5 letters K, L, M and writes only "18 cm" on KM. The third
    // side is needed to PLACE the triangle and is never labelled, so it is
    // recovered the way the sine rule gives it: both angles are taken acute,
    // which is what the paper's own figure shows.
    const angK = Math.asin(sinK), angL = Math.asin(sinL);
    const angM = Math.PI - angK - angL;
    if (angM <= 0.15) continue;                    // a sliver will not letter
    const KL = KM * Math.sin(angM) / sinL;
    const u = abbrev(unit);
    const fig = triangleFromSides({
      sides: { ab: KL, bc: LM, ca: KM },
      vertices: [K, L, M],
      labels: { ab: '', bc: '', ca: `${KM} ${u}` },
      turn: pick([0, 1, 2, 3] as const),
    });
    if (!fig) continue;
    const givens = [
      `In triangle $${K}${L}${M}$:`,
      `&bull;&nbsp; $${K}${M} = ${KM}$ ${unit}`,
      `&bull;&nbsp; $\\sin ${K} = ${sinK}$`,
      `&bull;&nbsp; $\\sin ${L} = ${sinL}$`,
    ];
    const ask = `Calculate the length of $${L}${M}$.`;
    // Verify the figure against the words, as every other figure-bearing
    // variation does. Leaving this out is what put a measurement across the
    // line it measures on the very first render of these three.
    if (verifyFigure(fig, [...givens, ask].join(' ')).length) continue;


    return {
      subTopic: 'Sine Rule: Finding a Side',
      difficulty: 'exam',
      variationId: 'sine-rule.side-exact',
      questionLines: [...givens, renderScene(fig.scene), ask],
      boardQuestionLines: [`$${K}${M}=${KM}$, $\\sin ${K}=${sinK}$, $\\sin ${L}=${sinL}$. Find $${L}${M}$`],
      // 2014 P1 Q5: •¹ correct substitution into the sine rule, •² know how to
      // solve it, •³ the correct calculation
      solutionSteps: [
        `<strong>1.</strong> Pair each side with the angle opposite it. $${L}${M}$ is opposite $${K}$, and $${K}${M}$ is opposite $${L}$, so substituting gives:<br><br>$\\frac{${L}${M}}{${sinK}} = \\frac{${KM}}{${sinL}}$`,
        `<strong>2.</strong> Multiply up to make $${L}${M}$ the subject:<br><br>$${L}${M} = \\frac{${KM} \\times ${sinK}}{${sinL}}$`,
        `<strong>3.</strong> Work it out:<br><br>$${L}${M} = ${LM}$ ${unit}`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$${LM}$ ${unit}`,
      figure: fig,
    };
  }
  throw new Error('sine-rule.side-exact: no valid question found');
}

// ── the calculator versions, stated in words ─────────────────────────────
//
// The Paper 2 questions carry a diagram, but the maths does not need one: an
// angle in degrees and the sides that meet it can simply be named. These are
// the skill tier, and the diagram versions can be added when the routine for a
// general triangle exists.

function cosineRuleSideDegrees(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const [A, B, C] = pick(TRIANGLES);
    const unit = pick(UNITS);
    const a = getRandomInt(4, 22), b = getRandomInt(4, 22);
    const angle = getRandomInt(25, 145);
    const cSq = a * a + b * b - 2 * a * b * Math.cos(angle * Math.PI / 180);
    const c = Math.sqrt(cSq);
    if (c < 3 || !validTriangle(a, b, c)) continue;
    if (Math.abs(c - Math.round(c)) < 0.04) continue;   // a whole answer belongs in Paper 1

    return {
      subTopic: 'Cosine Rule with a Given Angle',
      difficulty: 'skill',
      variationId: 'cosine-rule.side-degrees',
      questionLines: [
        `In triangle $${A}${B}${C}$:`,
        `&bull;&nbsp; $${A}${C} = ${b}$ ${unit}`,
        `&bull;&nbsp; $${B}${C} = ${a}$ ${unit}`,
        `&bull;&nbsp; angle $${C} = ${angle}^{\\circ}$`,
        `Calculate the length of $${A}${B}$. Give your answer correct to one decimal place.`,
      ],
      boardQuestionLines: [`Two sides ${b} and ${a}, included angle $${angle}^{\\circ}$. Find the third side`],
      solutionSteps: [
        `<strong>1.</strong> The angle at $${C}$ sits between the two known sides, so the cosine rule applies directly:<br><br>$${A}${B}^{2} = ${b}^{2} + ${a}^{2} - 2 \\times ${b} \\times ${a} \\times \\cos ${angle}^{\\circ}$`,
        `<strong>2.</strong> Evaluate the right hand side:<br><br>$${A}${B}^{2} = ${cSq.toFixed(3)}$`,
        `<strong>3.</strong> Take the square root and round:<br><br>$${A}${B} = ${dp1(c)}$ ${unit}`,
      ],
      finalAnswer: `$${dp1(c)}$ ${unit}`,
    };
  }
  throw new Error('cosine-rule.side-degrees: no valid question found');
}

function sineRuleSideDegrees(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const [A, B, C] = pick(TRIANGLES);
    const unit = pick(UNITS);
    const angA = getRandomInt(25, 105);
    const angB = getRandomInt(25, 105);
    if (angA + angB > 150) continue;
    const a = getRandomInt(5, 30);
    // a is opposite A; find b, opposite B
    const b = a * Math.sin(angB * Math.PI / 180) / Math.sin(angA * Math.PI / 180);
    if (b < 3 || b > 60) continue;
    if (Math.abs(b - Math.round(b)) < 0.04) continue;

    return {
      subTopic: 'Sine Rule with Given Angles',
      difficulty: 'skill',
      variationId: 'sine-rule.side-degrees',
      questionLines: [
        `In triangle $${A}${B}${C}$:`,
        `&bull;&nbsp; $${B}${C} = ${a}$ ${unit}`,
        `&bull;&nbsp; angle $${A} = ${angA}^{\\circ}$`,
        `&bull;&nbsp; angle $${B} = ${angB}^{\\circ}$`,
        `Calculate the length of $${A}${C}$. Give your answer correct to one decimal place.`,
      ],
      boardQuestionLines: [`$${B}${C}=${a}$, $${A}=${angA}^{\\circ}$, $${B}=${angB}^{\\circ}$. Find $${A}${C}$`],
      solutionSteps: [
        `<strong>1.</strong> Pair each side with the angle opposite it. $${B}${C}$ is opposite $${A}$, and $${A}${C}$ is opposite $${B}$:<br><br>$\\frac{${A}${C}}{\\sin ${B}} = \\frac{${B}${C}}{\\sin ${A}}$`,
        `<strong>2.</strong> Substitute:<br><br>$\\frac{${A}${C}}{\\sin ${angB}^{\\circ}} = \\frac{${a}}{\\sin ${angA}^{\\circ}}$`,
        `<strong>3.</strong> Multiply up and round:<br><br>$${A}${C} = \\frac{${a} \\times \\sin ${angB}^{\\circ}}{\\sin ${angA}^{\\circ}} = ${dp1(b)}$ ${unit}`,
      ],
      finalAnswer: `$${dp1(b)}$ ${unit}`,
    };
  }
  throw new Error('sine-rule.side-degrees: no valid question found');
}

function triangleArea(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const [A, B, C] = pick(TRIANGLES);
    const unit = pick(['centimetres', 'metres']);
    const a = getRandomInt(4, 24), b = getRandomInt(4, 24);
    const angle = getRandomInt(20, 155);
    const area = 0.5 * a * b * Math.sin(angle * Math.PI / 180);
    if (area < 8) continue;
    if (Math.abs(area - Math.round(area)) < 0.04) continue;
    const sq = unit === 'metres' ? 'square metres' : 'square centimetres';

    return {
      subTopic: 'Area of a Triangle',
      difficulty: 'skill',
      variationId: 'triangle-area.sine',
      questionLines: [
        `In triangle $${A}${B}${C}$:`,
        `&bull;&nbsp; $${A}${C} = ${b}$ ${unit}`,
        `&bull;&nbsp; $${B}${C} = ${a}$ ${unit}`,
        `&bull;&nbsp; angle $${C} = ${angle}^{\\circ}$`,
        `Calculate the area of triangle $${A}${B}${C}$. Give your answer correct to one decimal place.`,
      ],
      boardQuestionLines: [`Area with sides ${b}, ${a} and included angle $${angle}^{\\circ}$`],
      solutionSteps: [
        `<strong>1.</strong> The angle lies between the two known sides, so use $\\text{Area} = \\frac{1}{2}ab\\sin C$:<br><br>$\\text{Area} = \\frac{1}{2} \\times ${b} \\times ${a} \\times \\sin ${angle}^{\\circ}$`,
        `<strong>2.</strong> Evaluate and round:<br><br>$\\text{Area} = ${dp1(area)}$ ${sq}`,
      ],
      finalAnswer: `$${dp1(area)}$ ${sq}`,
    };
  }
  throw new Error('triangle-area.sine: no valid question found');
}

export const TRIANGLE_TRIG_GENERATORS: Record<string, () => Q> = {
  'Cosine Rule: Finding a Side': cosineRuleSideExact,
  'Cosine Rule: Finding an Angle': cosineRuleAngleExact,
  'Sine Rule: Finding a Side': sineRuleSideExact,
  'Cosine Rule with a Given Angle': cosineRuleSideDegrees,
  'Sine Rule with Given Angles': sineRuleSideDegrees,
  'Area of a Triangle': triangleArea,
};
