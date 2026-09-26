import { GeneratedQuestion } from './types';
import type { Gen } from './n5';
import { getRandomInt } from './utils';
import { abbrev } from './n5-contexts';
import { triangleFromSides, trueAngle } from '../diagrams/shapes/triangle-sides';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';
import { angleMark, pt, type Figure, type Pt } from '../diagrams/scene';

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
/** The inverse of the `variationId` stamps — which kind makes which id. */
const ID_KIND: Record<string, Kind> = {
  'trig-diagram.cosine-side': 'side',
  'trig-diagram.cosine-angle': 'angle',
  'trig-diagram.cosine-angle-smallest': 'angle',
  'trig-diagram.sine-angle': 'sine-angle',
  'trig-diagram.area': 'area',
  'trig-diagram.area-exact': 'area-exact',
};

export function trigDiagramQuestion(kinds: Kind[], wanted?: string): Q {
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
  // Taught: the asked id names the kind that makes it. `kinds.length > 1` is
  // the freeze — a topic with one kind never drew a choice, and skipping `pick`
  // would move its numbers for nothing.
  const asked = ID_KIND[wanted ?? ''];
  const kind = kinds.length > 1 && asked !== undefined && kinds.includes(asked)
    ? asked : pick(kinds);
  /**
   * **Which angle the question points at, chosen once.**
   *
   * 2024 P2 Q3 fills in the angle at A and asks for "the shaded angle at A".
   * 2019 P2 Q7 shades nothing and asks for "the smallest angle in triangle
   * XYZ", leaving the pupil to work out which that is - a different first move
   * on the same three sides. Drawn inside the loop this was a coin toss, so
   * half the presses on 2024 P2 Q3 returned 2019's question with no shading,
   * which the owner read off the contact sheet.
   */
  // Taught: 2019 P2 Q7 asks for the smallest angle by name and 2024 P2 Q3
  // asks for a named one, which is why they are two ids.
  const smallestAngle = wanted !== undefined
    ? wanted === 'trig-diagram.cosine-angle-smallest'
    : getRandomInt(0, 1) === 0;
  // See the note at `obtuseAt` below: 2024 P2 Q3's shaded angle is obtuse and
  // its cosine negative, and the clone was reaching that in 22 draws of 300.
  // Chosen here, once, so a triangle with no obtuse angle can be rejected.
  const wantObtuse = wanted === 'trig-diagram.cosine-angle'
    && getRandomInt(0, 1) === 0;
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
        // **No rounding line.** 2026 P2 Q2, 2017 P2 Q3 and 2015 P2 Q3 all stop
        // at "calculate the length" and their schemes take 7.2..., 412.7...
        // and 0.78... as they come. The cosine-rule ANGLE branch of this same
        // file lost this line on exactly that reasoning; the SIDE branch was
        // missed. Owner's word on the 2026 locked-year pass, 2026-09-20.
        `Calculate the length of $${B}${C}$.`,
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
      // Never two equal given sides: both papers give two different ones
      // (25 and 32, 45 and 70), and 13 draws in 400 were isosceles. The
      // owner, on the 2022 re-review: "Yes", for 2022 P2 Q6 and 2019 P2 Q3.
      if (p === q) continue;
      const fig = triangleFromSides({
        sides, vertices: [A, B, C], turn,
        labels: { ab: `${q} ${u}`, bc: '', ca: `${p} ${u}` },
        angles: [{ at: 'a', label: `${angA}\u00b0` }],
      });
      if (!fig) continue;
      const sq = u;
      /*
       * **No rounding instruction, because neither paper gives one.**
       *
       * 2022 P2 Q6 and 2019 P2 Q3 both end at "Calculate the area of triangle
       * ...", and both markschemes accept the unrounded value: 339(.21...) and
       * 1224(.004...). This added "Give your answer correct to the nearest
       * whole number", which asks for something the paper does not.
       *
       * Edited in place rather than branched, on the owner's explicit word -
       * *"I agree edit in place for just this one"* - because 2019 P2 Q3 is
       * the only other paper here and the same change is right for it too, so
       * branching would have made two identical generators to avoid improving
       * an unreviewed question. `frozen` reports 2019 P2 Q3 as moved.
       *
       * The working still shows the unrounded value before the whole one, the
       * way the schemes write it, so the answer is reached rather than
       * asserted.
       */
      const prose = [
        `The diagram shows triangle $${A}${B}${C}$.`,
        `Calculate the area of triangle $${A}${B}${C}$.`,
      ];
      const steps = [
        `<strong>1.</strong> The angle at $${A}$ lies between the two known sides, so use $\\text{Area} = \\frac{1}{2}ab\\sin C$ with that angle:<br><br>$\\text{Area} = \\frac{1}{2} \\times ${q} \\times ${p} \\times \\sin ${angA}^{\\circ}$`,
        `<strong>2.</strong> Evaluate:<br><br>$\\text{Area} = ${area.toFixed(2)}\\ldots$, which is $${Math.round(area)}$ ${sq}$^{2}$ to the nearest square ${u}`,
      ];
      if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;
      return {
        subTopic: 'Area of a Triangle from a Diagram',
        difficulty: 'exam',
        variationId: 'trig-diagram.area',
        // Both papers list the three values after the diagram, as bullets with
        // no stops: "• FG = 25 centimetres • FH = 32 centimetres • Angle GFH =
        // 58°", and 2019's "• PR = 45 … • PQ = 70 … • Angle QPR = 129°". The
        // owner, on the 2022 re-review: "Yes", for both. Built after
        // verifyFigure, so no draw passes or fails differently.
        questionLines: [prose[0], renderScene(fig.scene),
          `&bull;&nbsp; $${A}${B} = ${q}$ ${unit}`,
          `&bull;&nbsp; $${A}${C} = ${p}$ ${unit}`,
          `&bull;&nbsp; Angle $${B}${A}${C} = ${angA}^{\\circ}$`,
          ...prose.slice(1)],
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
      const smallest = smallestAngle;
      /**
       * **2024 P2 Q3's shaded angle is OBTUSE, and that is the question.**
       *
       * The paper sets 25, 18 and 34 and asks for the angle at A — opposite
       * the longest side — so `cos A = -0.23` and the answer is 103 degrees.
       * Its markscheme pays a mark for evaluating that negative cosine.
       *
       * A triangle has at most one obtuse angle, so picking the vertex
       * uniformly gave an obtuse answer in only 22 draws of 300, and the sign
       * handling the question exists to test was the rare case. The owner, on
       * the 2024 P2 sheet: *"Agreed"*.
       *
       * Aiming at about half keeps the acute shape reachable — 2019 P2 Q7 is
       * on the sibling id and takes the `smallest` branch above, which is
       * untouched.
       */
      const obtuseAt = (['a', 'b', 'c'] as const).find(v =>
        trueAngle(v, whole.ab, whole.bc, whole.ca) > 90);
      // **Decided once per call, above the loop, and enforced by rejection.**
      // Reading the coin here instead only fired when the triangle happened to
      // carry an obtuse angle, which left the share at 18% rather than a half.
      // A triangle that cannot supply one is thrown back.
      if (wantObtuse && obtuseAt === undefined) continue;
      const at = smallest
        ? (['a', 'b', 'c'] as const).reduce((m, v) =>
            trueAngle(v, whole.ab, whole.bc, whole.ca) < trueAngle(m, whole.ab, whole.bc, whole.ca) ? v : m, 'a' as const)
        : wantObtuse && obtuseAt !== undefined
          ? obtuseAt
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
        // 2024 P2 Q3 fills in the angle it wants; 2019 P2 Q7 asks for the
        // smallest and marks nothing, leaving the pupil to find it.
        ...(smallest ? {} : { shadeAt: at }),
      });
      if (!fig) continue;
      const prose = [
        `The diagram shows triangle $${A}${B}${C}$.`,
        /**
         * **Neither paper asks for a decimal place, and neither shades
         * nothing.**
         *
         *   2019 P2 Q7   "Calculate the size of the smallest angle in
         *                triangle XYZ."      no shading, no rounding line
         *   2024 P2 Q3   "Calculate the size of the shaded angle at A."
         *                a solid wedge at A, no rounding line
         *
         * This printed "Give your answer correct to one decimal place" on
         * every draw, which neither paper does - their schemes take
         * 46.406... and 103(.29...) as they come - and asked for "the angle
         * at K" with nothing on the figure to say which angle that was.
         */
        smallest
          ? `Calculate the size of the smallest angle in triangle $${A}${B}${C}$.`
          : `Calculate the size of the shaded angle at $${name}$.`,
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
        variationId: smallest ? 'trig-diagram.cosine-angle-smallest'
          : 'trig-diagram.cosine-angle',
        /**
         * **2024 P2 Q3 gives the three sides in words, before the figure**:
         * "In triangle ABC: • AB = 25 metres • AC = 18 metres • BC = 34
         * metres." This printed only "The diagram shows triangle PQR." in 400
         * of 400. The owner, on the 2024 re-review sheet: "Yes", as on 2026
         * P2 Q2. After verifyFigure, and 2019's smallest-angle id is untouched.
         */
        questionLines: smallest
          ? [prose[0], renderScene(fig.scene), ...prose.slice(1)]
          : [`In triangle $${A}${B}${C}$:`,
             `&bull;&nbsp; $${A}${B} = ${whole.ab}$ ${unit}`,
             `&bull;&nbsp; $${A}${C} = ${whole.ca}$ ${unit}`,
             `&bull;&nbsp; $${B}${C} = ${whole.bc}$ ${unit}.`,
             renderScene(fig.scene), ...prose.slice(1)],
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
    // Two equal sides make the triangle isosceles, and the answer is then the
    // given angle, readable straight off the figure: 15 of 400 draws. The
    // owner, on the 2023 re-review: "Yes". This kind is 2023 P2 Q4's alone.
    if (whole.bc === whole.ca) continue;
    const fig = triangleFromSides({
      sides: whole, vertices: [A, B, C], turn,
      labels: { ab: '', bc: `${whole.bc} ${u}`, ca: `${whole.ca} ${u}` },
      angles: [{ at: 'a', label: `${shownA}\u00b0` }],
    });
    if (!fig) continue;
    const prose = [
      `The diagram shows triangle $${A}${B}${C}$.`,
      `Calculate the size of acute angle $${A}${B}${C}$.`,
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
      /**
       * **2023 P2 Q4 lists the givens in words, before the figure**: "The
       * diagram shows triangle JKL. • Angle KJL = 25° • JL = 10 metres • KL =
       * 7 metres". This printed the figure alone in 400 of 400. The owner, on
       * the 2023 re-review: "Yes", as on 2024 P2 Q3. After verifyFigure, so
       * no draw passes or fails differently; 2016's stepladder is its own
       * routine.
       */
      questionLines: [prose[0],
        `&bull;&nbsp; Angle $${B}${A}${C} = ${shownA}^{\\circ}$`,
        `&bull;&nbsp; $${A}${C} = ${whole.ca}$ ${unit}`,
        `&bull;&nbsp; $${B}${C} = ${whole.bc}$ ${unit}`,
        renderScene(fig.scene), ...prose.slice(1)],
      boardQuestionLines: [`Angle ${shownA}, sides ${whole.bc} and ${whole.ca}. Find the other angle.`],
      solutionSteps: steps,
      stepMarks: [1, 1, 1],
      finalAnswer: `$${dp1(answer)}^{\\circ}$`,
      figure: fig,
    };
  }
  throw new Error('trig-diagram: no valid question found');
}

/**
 * **2016 P2 Q8, drawn as its paper draws it — 2026-09-24.**
 *
 * A stepladder: two legs standing on the ground, the angle between the LONGER
 * leg and the ground given, x° at the other foot asked for. The same sine
 * rule as 2023 P2 Q4's bare triangle - the given angle faces the short leg,
 * x faces the long one - but the paper's picture is the ladder on a ground
 * line, legs labelled, no vertex letters. The owner, on the 2016 P2 sheet:
 * *"Yea draw as question and key it"*. Its own routine, reached only by
 * 2016's id, so 2023 P2 Q4 (SIGNED OFF) draws exactly as before.
 */
function stepladder(): Q {
  for (let tries = 0; tries < 2000; tries++) {
    const long = getRandomInt(24, 40) * 5;           // 120 to 200 cm, as 150
    const short = long - getRandomInt(1, 8) * 5;     // a little shorter, as 140
    const angA = getRandomInt(55, 75);               // at the longer leg's foot, as 66
    const sinB = long * Math.sin(angA * Math.PI / 180) / short;
    if (sinB >= 1) continue;
    const angB = Math.asin(sinB) * 180 / Math.PI;
    if (angB >= 89.5 || 180 - angA - angB < 12) continue;

    const base = long * Math.cos(angA * Math.PI / 180) + short * Math.cos(angB * Math.PI / 180);
    const A = pt(0, 0), B = pt(base, 0);
    const C = pt(long * Math.cos(angA * Math.PI / 180), long * Math.sin(angA * Math.PI / 180));
    const inside = pt((A.x + B.x + C.x) / 3, (A.y + B.y + C.y) / 3);
    const mid = (p: Pt, q: Pt) => pt((p.x + q.x) / 2, (p.y + q.y) / 2);
    // Each leg's number pushed square off the leg, not away from the middle:
    // on a leg this steep, pushing from the centroid slid the label along the
    // leg and onto it (1.6 and 1.8px, `verifyFigure`).
    const offLeg = (p: Pt, q: Pt): Pt => {
      const m = mid(p, q), k = Math.hypot(q.x - p.x, q.y - p.y);
      let n = pt(-(q.y - p.y) / k, (q.x - p.x) / k);
      if ((inside.x - m.x) * n.x + (inside.y - m.y) * n.y < 0) n = pt(-n.x, -n.y);
      return pt(m.x + n.x, m.y + n.y);
    };
    const r = Math.min(long, short) * 0.22;
    const fig: Figure = {
      scene: {
        elements: [
          { kind: 'segment', from: pt(-base * 0.25, 0), to: pt(base * 1.25, 0) },
          { kind: 'segment', from: A, to: C },
          { kind: 'segment', from: B, to: C },
          { kind: 'label', text: `${long} cm`, anchor: mid(A, C), away: offLeg(A, C) },
          { kind: 'label', text: `${short} cm`, anchor: mid(B, C), away: offLeg(B, C) },
          ...angleMark(A, [B, C], `${angA}°`, r),
          ...angleMark(B, [C, A], 'x°', r),
        ],
      },
      claims: [
        { kind: 'length', from: A, to: C, value: long },
        { kind: 'length', from: B, to: C, value: short },
        { kind: 'angle', at: A, arms: [B, C], value: angA },
      ],
    };
    const prose = [
      `A set of stepladders has legs ${long} centimetres and ${short} centimetres long.`,
      `When the stepladder is fully open, the angle between the longer leg and the ground is $${angA}^{\\circ}$.`,
      `Calculate $x^{\\circ}$, the size of the angle between the shorter leg and the ground.`,
    ];
    // •¹ correct substitution into the sine rule, •² rearrange, •³ find x
    const steps = [
      `<strong>1.</strong> Each leg is opposite the angle at the other foot: the ${long} cm leg is opposite $x^{\\circ}$, and the ${short} cm leg is opposite $${angA}^{\\circ}$. The sine rule pairs them:<br><br>$\\frac{\\sin x^{\\circ}}{${long}} = \\frac{\\sin ${angA}^{\\circ}}{${short}}$`,
      `<strong>2.</strong> Rearrange to make $\\sin x^{\\circ}$ the subject:<br><br>$\\sin x^{\\circ} = \\frac{${long} \\times \\sin ${angA}^{\\circ}}{${short}} = ${sinB.toFixed(4)}$`,
      `<strong>3.</strong> Take the inverse sine:<br><br>$x = ${dp1(angB)}$`,
    ];
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;
    return {
      subTopic: 'Sine Rule from a Diagram',
      difficulty: 'exam',
      variationId: 'trig-diagram.sine-angle',
      questionLines: [prose[0], prose[1], renderScene(fig.scene), prose[2]],
      boardQuestionLines: [`Legs ${long} and ${short}, ${angA}° at the longer leg's foot. Angle x at the other?`],
      solutionSteps: steps,
      stepMarks: [1, 1, 1],
      finalAnswer: `$x = ${dp1(angB)}$`,
      figure: fig,
    };
  }
  throw new Error('trig-diagram.sine-angle-pre2023: no valid question found');
}

/**
 * **2026 P2 Q2 in its own shape.** — 2026-09-25, the 2026 re-review.
 *
 * The paper: "In triangle XYZ: • XZ = 5 centimetres • YZ = 4 centimetres
 * • angle XZY = 106°", the figure, then "Calculate the length of XY." The
 * shared side branch put the numbers on the figure only, was obtuse in 47 of
 * 400 draws, and wrote mm, m, km or cm. The owner: *"Yes"* to the paper's
 * words, an obtuse angle and centimetres.
 *
 * Its own routine, entered from the dispatch on the asked id before anything
 * is drawn, so LOCKED 2015 P2 Q3 and 2017 P2 Q3, which arrive on their own
 * ids, read the shared stream exactly as before.
 */
function cosineSide2026(): Q {
  for (let tries = 0; tries < 4000; tries++) {
    const [A, B, C] = pick(TRIANGLES);
    const turn = pick([0, 1, 2, 3] as const);
    const p = getRandomInt(3, 15), q = getRandomInt(3, 15);   // AC and AB, cm
    if (p === q) continue;
    const angA = getRandomInt(95, 150);
    const bc = Math.sqrt(p * p + q * q - 2 * p * q * Math.cos(angA * Math.PI / 180));
    const sides = { ab: q, bc: Number(bc.toFixed(4)), ca: p };
    if (!drawable(sides.ab, sides.bc, sides.ca)) continue;
    const fig = triangleFromSides({
      sides, vertices: [A, B, C], turn,
      labels: { ab: `${q} cm`, bc: '', ca: `${p} cm` },
      angles: [{ at: 'a', label: `${angA}°` }],
    });
    if (!fig) continue;
    const prose = [
      `In triangle $${A}${B}${C}$:`,
      `&bull;&nbsp; $${A}${C} = ${p}$ centimetres`,
      `&bull;&nbsp; $${A}${B} = ${q}$ centimetres`,
      `&bull;&nbsp; angle $${B}${A}${C} = ${angA}^{\\circ}$`,
      `Calculate the length of $${B}${C}.$`,
    ];
    const steps = [
      `<strong>1.</strong> The angle at $${A}$ lies between the two known sides, so the cosine rule applies directly:<br><br>$${B}${C}^{2} = ${q}^{2} + ${p}^{2} - 2 \\times ${q} \\times ${p} \\times \\cos ${angA}^{\\circ}$`,
      `<strong>2.</strong> The angle is obtuse, so its cosine is negative and the last term adds:<br><br>$${B}${C}^{2} = ${num(Number((bc * bc).toFixed(3)))}$`,
      `<strong>3.</strong> Take the square root:<br><br>$${B}${C} = ${dp1(bc)}$ centimetres`,
    ];
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;
    return {
      subTopic: 'Cosine Rule from a Diagram',
      difficulty: 'exam',
      variationId: 'trig-diagram.cosine-side',
      questionLines: [...prose.slice(0, 4), renderScene(fig.scene), prose[4]],
      boardQuestionLines: [`${A}C = ${p} cm, ${A}B = ${q} cm, angle ${angA}°. Find ${B}${C}.`],
      solutionSteps: steps,
      stepMarks: [1, 1, 1],
      finalAnswer: `$${dp1(bc)}$ centimetres`,
      figure: fig,
    };
  }
  throw new Error('trig-diagram.cosine-side (2026): no valid question found');
}

export const TRIG_DIAGRAM_GENERATORS: Record<string, Gen> = {
  'Cosine Rule from a Diagram': (w, asked) => asked === 'trig-diagram.cosine-side'
    ? cosineSide2026() : trigDiagramQuestion(['side', 'angle'], w),
  'Sine Rule from a Diagram': (w, asked) => asked === 'trig-diagram.sine-angle-pre2023'
    ? stepladder() : trigDiagramQuestion(['sine-angle'], w),
  /**
   * **2025 P1 Q5 ends each bullet with a stop** — "AB = BC = 6 centimetres."
   * and "sin B = 2/3." — inside the maths where the line ends in it. The
   * owner, 2026-09-25: *"if the only fixes is putting full stops just do that
   * without asking me"*. Keyed on 2025's own id, after the draw, so no random
   * moves and 2017 P1 Q7 (`-pre2023`, its own wording) is untouched.
   */
  'Area of a Triangle from a Diagram': (w, asked) => {
    const q = trigDiagramQuestion(['area', 'area-exact'], w);
    return asked !== 'trig-diagram.area-exact' ? q : {
      ...q,
      questionLines: q.questionLines.map(l => !l.startsWith('&bull;') ? l
        : l.endsWith('$') ? `${l.slice(0, -1)}.$` : `${l}.`),
    };
  },
};
