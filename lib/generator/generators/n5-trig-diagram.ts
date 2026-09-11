import { GeneratedQuestion } from './types';
import { getRandomInt } from './utils';
import { abbrev } from './n5-contexts';
import { triangleFromSides, trueAngle } from '../diagrams/shapes/triangle-sides';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';

/**
 * The triangle-trigonometry questions that carry a diagram.
 *
 * Paper 1 states its triangles in words, and those are built in
 * n5-triangle-trig.ts. Paper 2 draws them, and the drawing is not decoration:
 * 2015 P2 Q3 and 2019 P2 Q7 put *every* number on the figure and say only
 * "Triangle ABC is shown below. Calculate the length of AB."
 *
 * Eight questions, one figure. What changes between them is which three of the
 * six measurements are given and which one is wanted:
 *
 *   two sides and the angle between   -> the third side     2017 P2 Q3, 2026 P2 Q2
 *   three sides                       -> an angle           2019 P2 Q7, 2024 P2 Q3
 *   two sides and a non-included angle-> another angle      2023 P2 Q4
 *   two sides and the angle between   -> the area           2019 P2 Q3, 2022 P2 Q6
 *
 * The triangle is constructed from its three real side lengths, so every angle
 * on the page is the angle it claims to be: 147 degrees looks obtuse, 25 looks
 * sharp, and a pupil reading the shape is not misled.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

const TRIANGLES: [string, string, string][] = [
  ['A', 'B', 'C'], ['X', 'Y', 'Z'], ['P', 'Q', 'R'], ['D', 'E', 'F'],
  ['J', 'K', 'L'], ['F', 'G', 'H'], ['S', 'T', 'U'],
];
const UNITS = ['centimetres', 'metres', 'kilometres', 'millimetres'];
const dp1 = (v: number): string => v.toFixed(1);
const num = (v: number): string => `${Math.round(v * 100) / 100}`;

/**
 * A triangle that is worth drawing: no angle so sharp the arc cannot be read,
 * and no side so short its label has nowhere to sit.
 */
function drawable(ab: number, bc: number, ca: number): boolean {
  const angles = (['a', 'b', 'c'] as const).map(v => trueAngle(v, ab, bc, ca));
  return angles.every(x => x > 22 && x < 140)
    || (angles.filter(x => x > 140).length === 1 && angles.every(x => x > 14));
}

type Kind = 'side' | 'angle' | 'sine-angle' | 'area' | 'area-exact';

/** Sines a Paper 1 question can hand over as a fraction. */
const EXACT_SINES: [number, number][] = [
  [1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [4, 5],
  [1, 6], [5, 6], [3, 8], [5, 8], [7, 8], [4, 9], [7, 9], [3, 10], [7, 10],
];

/**
 * The topic chosen has to be the topic delivered. An earlier version let one
 * function pick a kind at random and mapped all three topic names to it, so
 * asking for "Area of a Triangle" could hand back a cosine rule question.
 */
export function trigDiagramQuestion(kinds: Kind[]): Q {
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
    const [A, B, C] = pick(TRIANGLES);
    const unit = pick(UNITS);
    const u = abbrev(unit);         // the drawing writes cm, the prose centimetres
    const turn = pick([0, 1, 2, 3] as const);

    // two sides and the angle between them fixes the triangle; three sides do
    // too. Either way all three sides are known before anything is drawn.
    const p = getRandomInt(4, 40);           // CA, meeting the angle at A
    const q = getRandomInt(4, 40);           // AB, meeting the angle at A
    /**
     * Never a right angle.
     *
     * The cosine rule survives it - cos 90 is 0 - but the question stops being
     * a cosine rule question: the term the whole method turns on vanishes, and
     * a pupil who spots it uses Pythagoras and never writes the substitution
     * the first mark is for. 2015 P2 Q3 sets 35, 2017 P2 Q3 sets 147, and no
     * paper sets 90. Measured: 8 draws in 600 were landing on it, and 0 do
     * now.
     */
    const angA = getRandomInt(25, 150);
    if (angA === 90) continue;
    const bc = Math.sqrt(p * p + q * q - 2 * p * q * Math.cos(angA * Math.PI / 180));
    if (bc < 3) continue;
    const sides = { ab: q, bc: Number(bc.toFixed(4)), ca: p };
    if (!drawable(sides.ab, sides.bc, sides.ca)) continue;

    if (kind === 'side') {
      // 2017 P2 Q3, 2026 P2 Q2: two sides and the included angle, find the third
      const answer = bc;
      const fig = triangleFromSides({
        sides, vertices: [A, B, C], turn,
        labels: { ab: `${q} ${u}`, bc: '', ca: `${p} ${u}` },
        angles: [{ at: 'a', label: `${angA}\u00b0` }],
      });
      if (!fig) continue;
      const prose = [
        `The diagram shows triangle $${A}${B}${C}$.`,
        `Calculate the length of $${B}${C}$. Give your answer correct to one decimal place.`,
      ];
      const steps = [
        `<strong>1.</strong> The angle at $${A}$ lies between the two known sides, so the cosine rule applies directly:<br><br>$${B}${C}^{2} = ${q}^{2} + ${p}^{2} - 2 \\times ${q} \\times ${p} \\times \\cos ${angA}^{\\circ}$`,
        `<strong>2.</strong> Evaluate the right hand side:<br><br>$${B}${C}^{2} = ${num(Number((bc * bc).toFixed(3)))}$`,
        `<strong>3.</strong> Take the square root:<br><br>$${B}${C} = ${dp1(answer)}$ ${unit}`,
      ];
      if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;
      return {
        subTopic: 'Cosine Rule from a Diagram',
        difficulty: 'exam',
        variationId: 'trig-diagram.cosine-side',
        questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
        boardQuestionLines: [`Two sides ${q} and ${p}, angle ${angA}. Third side?`],
        solutionSteps: steps,
        // •¹ correct substitution into the cosine rule, •² evaluate the square,
        // •³ take the root
        stepMarks: [1, 1, 1],
        finalAnswer: `$${dp1(answer)}$ ${unit}`,
        figure: fig,
      };
    }

    if (kind === 'area') {
      // 2019 P2 Q3, 2022 P2 Q6: two sides and the angle between, find the area
      const area = 0.5 * p * q * Math.sin(angA * Math.PI / 180);
      if (area < 20) continue;
      const fig = triangleFromSides({
        sides, vertices: [A, B, C], turn,
        labels: { ab: `${q} ${u}`, bc: '', ca: `${p} ${u}` },
        angles: [{ at: 'a', label: `${angA}\u00b0` }],
      });
      if (!fig) continue;
      const sq = u;
      const prose = [
        `The diagram shows triangle $${A}${B}${C}$.`,
        `Calculate the area of triangle $${A}${B}${C}$. Give your answer correct to the nearest whole number.`,
      ];
      const steps = [
        `<strong>1.</strong> The angle at $${A}$ lies between the two known sides, so use $\\text{Area} = \\frac{1}{2}ab\\sin C$ with that angle:<br><br>$\\text{Area} = \\frac{1}{2} \\times ${q} \\times ${p} \\times \\sin ${angA}^{\\circ}$`,
        `<strong>2.</strong> Evaluate and round:<br><br>$\\text{Area} = ${Math.round(area)}$ ${sq}$^{2}$`,
      ];
      if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;
      return {
        subTopic: 'Area of a Triangle from a Diagram',
        difficulty: 'exam',
        variationId: 'trig-diagram.area',
        questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
        boardQuestionLines: [`Area, sides ${q} and ${p}, included angle ${angA}`],
        solutionSteps: steps,
        // •¹ correct substitution into the area formula, •² calculate the area
        stepMarks: [1, 1],
        finalAnswer: `$${Math.round(area)}$ ${sq}$^{2}$`,
        figure: fig,
      };
    }

    if (kind === 'angle') {
      // 2019 P2 Q7, 2024 P2 Q3: three sides, find an angle
      const whole = { ab: q, bc: Math.round(bc), ca: p };
      if (!drawable(whole.ab, whole.bc, whole.ca)) continue;
      const smallest = getRandomInt(0, 1) === 0;
      const at = smallest
        ? (['a', 'b', 'c'] as const).reduce((m, v) =>
            trueAngle(v, whole.ab, whole.bc, whole.ca) < trueAngle(m, whole.ab, whole.bc, whole.ca) ? v : m, 'a' as const)
        : pick(['a', 'b', 'c'] as const);
      const name = { a: A, b: B, c: C }[at];
      const answer = trueAngle(at, whole.ab, whole.bc, whole.ca);
      const [arm1, arm2, opp] = at === 'a' ? [whole.ab, whole.ca, whole.bc]
        : at === 'b' ? [whole.ab, whole.bc, whole.ca]
        : [whole.bc, whole.ca, whole.ab];
      const fig = triangleFromSides({
        sides: whole, vertices: [A, B, C], turn,
        labels: {
          ab: `${whole.ab} ${u}`, bc: `${whole.bc} ${u}`, ca: `${whole.ca} ${u}`,
        },
      });
      if (!fig) continue;
      const prose = [
        `The diagram shows triangle $${A}${B}${C}$.`,
        smallest
          ? `Calculate the size of the smallest angle in triangle $${A}${B}${C}$. Give your answer correct to one decimal place.`
          : `Calculate the size of the angle at $${name}$. Give your answer correct to one decimal place.`,
      ];
      // •¹ correct substitution into the cosine rule, •² evaluate cos, •³ the
      // angle. Identifying which angle is wanted earns nothing, so it opens the
      // substitution rather than standing as a step.
      const steps = [
        (smallest
          ? `<strong>1.</strong> The smallest angle is opposite the shortest side, which is $${opp}$ ${unit}, so it is the angle at $${name}$. `
          : `<strong>1.</strong> The angle at $${name}$ lies between the sides of ${arm1} and ${arm2} ${unit}, and $${opp}$ ${unit} is opposite it. `)
          + `Rearranged, the cosine rule gives:<br><br>$\\cos ${name} = \\frac{${arm1}^{2} + ${arm2}^{2} - ${opp}^{2}}{2 \\times ${arm1} \\times ${arm2}}$`,
        `<strong>2.</strong> Work that out:<br><br>$\\cos ${name} = ${((arm1 * arm1 + arm2 * arm2 - opp * opp) / (2 * arm1 * arm2)).toFixed(4)}$`,
        `<strong>3.</strong> Take the inverse cosine:<br><br>$${name} = ${dp1(answer)}^{\\circ}$`,
      ];
      if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;
      return {
        subTopic: 'Cosine Rule from a Diagram',
        difficulty: 'exam',
        variationId: 'trig-diagram.cosine-angle',
        questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
        boardQuestionLines: [`Sides ${whole.ab}, ${whole.bc}, ${whole.ca}. Angle at ${name}?`],
        solutionSteps: steps,
        stepMarks: [1, 1, 1],
        finalAnswer: `$${dp1(answer)}^{\\circ}$`,
        figure: fig,
      };
    }

    if (kind === 'area-exact') {
      // 2017 P1 Q7, 2025 P1 Q5. Paper 1, so no calculator: the sine is handed
      // over as a fraction and the area comes out whole. That makes it a
      // different question from the Paper 2 one even though the formula is the
      // same — there is nothing to round, and an answer that needed rounding
      // would be a sign the numbers were wrong.
      const [sa, sb] = pick(EXACT_SINES);
      // no calculator, so the sides stay small enough to multiply in the head —
      // 2017 uses 8 and 12, 2025 uses 6 and 6
      if (p > 16 || q > 16) continue;
      const area = p * q * sa / (2 * sb);
      if (!Number.isInteger(area) || area < 6) continue;
      // sin alone does not fix the angle; the drawing settles which one it is
      const obtuse = getRandomInt(0, 1) === 0;
      const ang = Math.asin(sa / sb) * 180 / Math.PI;
      const angB = obtuse ? 180 - ang : ang;
      const third = Math.sqrt(p * p + q * q - 2 * p * q * Math.cos(angB * Math.PI / 180));
      const exact = { ab: q, bc: Number(third.toFixed(4)), ca: p };
      if (!drawable(exact.ab, exact.bc, exact.ca)) continue;

      const fig = triangleFromSides({
        sides: exact, vertices: [A, B, C], turn,
        labels: { ab: `${q} ${u}`, bc: '', ca: `${p} ${u}` },
      });
      if (!fig) continue;
      const prose = [
        `Triangle $${A}${B}${C}$ is shown in the diagram.`,
        `&bull;&nbsp; $${A}${B} = ${q}$ ${unit} and $${C}${A} = ${p}$ ${unit}`,
        `&bull;&nbsp; $\\sin ${A} = \\frac{${sa}}{${sb}}$`,
        `Calculate the area of triangle $${A}${B}${C}$.`,
      ];
      const steps = [
        `<strong>1.</strong> The angle at $${A}$ lies between the two given sides, so the area formula applies directly:<br><br>$\\text{Area} = \\frac{1}{2} \\times ${q} \\times ${p} \\times \\sin ${A}$`,
        `<strong>2.</strong> The sine is given, so nothing has to be worked out:<br><br>$\\text{Area} = \\frac{1}{2} \\times ${q} \\times ${p} \\times \\frac{${sa}}{${sb}} = ${area}$ ${u}$^{2}$`,
      ];
      if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;
      return {
        subTopic: 'Area of a Triangle from a Diagram',
        difficulty: 'exam',
        variationId: 'trig-diagram.area-exact',
        questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
        boardQuestionLines: [`Sides ${q} and ${p}, sin = ${sa}/${sb}. Area?`],
        solutionSteps: steps,
        // •¹ correct substitution into the area formula, •² calculate the area
        stepMarks: [1, 1],
        finalAnswer: `$${area}$ ${u}$^{2}$`,
        figure: fig,
      };
    }

    // 2023 P2 Q4: an angle and two sides, one of them opposite it — the sine
    // rule, and the pairing is the whole difficulty
    const whole = { ab: q, bc: Math.round(bc), ca: p };
    if (!drawable(whole.ab, whole.bc, whole.ca)) continue;
    const angAtA = trueAngle('a', whole.ab, whole.bc, whole.ca);
    const angAtB = trueAngle('b', whole.ab, whole.bc, whole.ca);
    // The question asks for the ACUTE angle, and 95 let it answer 90.0 - which
    // is neither acute nor obtuse. 4.0% of draws. The printed answer is this
    // rounded to one decimal place, so the guard has to sit below 89.95.
    if (angAtB >= 89.95) continue;             // keep the answer acute, as 2023 does
    const shownA = Math.round(angAtA);
    // The answer is recomputed from the ROUNDED angle on the figure, not from
    // the true one, so guarding angAtB alone let 90.0 through. Worse, the
    // Math.min(1, ...) below clamps an impossible ratio to exactly 90 - which
    // is the one value the question promises it is not. Guard the answer the
    // pupil is actually given.
    const sinB = whole.ca * Math.sin(shownA * Math.PI / 180) / whole.bc;
    if (sinB >= 1) continue;
    const answerB = Math.asin(sinB) * 180 / Math.PI;
    if (answerB >= 89.95) continue;
    const fig = triangleFromSides({
      sides: whole, vertices: [A, B, C], turn,
      labels: { ab: '', bc: `${whole.bc} ${u}`, ca: `${whole.ca} ${u}` },
      angles: [{ at: 'a', label: `${shownA}\u00b0` }],
    });
    if (!fig) continue;
    const prose = [
      `The diagram shows triangle $${A}${B}${C}$.`,
      `Calculate the size of acute angle $${A}${B}${C}$. Give your answer correct to one decimal place.`,
    ];
    // •¹ correct substitution into the sine rule, •² rearrange it, •³ the angle
    const steps = [
      `<strong>1.</strong> Pair each side with the angle opposite it. $${B}${C}$ is opposite $${A}$, and $${C}${A}$ is opposite $${B}$, so substituting gives:<br><br>$\\frac{\\sin ${B}}{${whole.ca}} = \\frac{\\sin ${shownA}^{\\circ}}{${whole.bc}}$`,
      `<strong>2.</strong> Rearrange to make $\\sin ${B}$ the subject:<br><br>$\\sin ${B} = \\frac{${whole.ca} \\times \\sin ${shownA}^{\\circ}}{${whole.bc}} = ${(whole.ca * Math.sin(shownA * Math.PI / 180) / whole.bc).toFixed(4)}$`,
      `<strong>3.</strong> Take the inverse sine:<br><br>$${B} = ${dp1(Math.asin(Math.min(1, whole.ca * Math.sin(shownA * Math.PI / 180) / whole.bc)) * 180 / Math.PI)}^{\\circ}$`,
    ];
    const answer = answerB;
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;
    return {
      subTopic: 'Sine Rule from a Diagram',
      difficulty: 'exam',
      variationId: 'trig-diagram.sine-angle',
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
      boardQuestionLines: [`Angle ${shownA}, sides ${whole.bc} and ${whole.ca}. Find the other angle.`],
      solutionSteps: steps,
      stepMarks: [1, 1, 1],
      finalAnswer: `$${dp1(answer)}^{\\circ}$`,
      figure: fig,
    };
  }
  throw new Error('trig-diagram: no valid question found');
}

export const TRIG_DIAGRAM_GENERATORS: Record<string, () => Q> = {
  'Cosine Rule from a Diagram': () => trigDiagramQuestion(['side', 'angle']),
  'Sine Rule from a Diagram': () => trigDiagramQuestion(['sine-angle']),
  'Area of a Triangle from a Diagram': () => trigDiagramQuestion(['area', 'area-exact']),
};
