import { GeneratedQuestion } from './types';
import { getRandomInt } from './utils';
import { polygonPoint } from '../diagrams/shapes/polygon-point';
import { polygonDiameter } from '../diagrams/shapes/polygon-diameter';
import { barAndPolygon } from '../diagrams/shapes/bar-and-polygon';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';

/**
 * Angles in shapes — a regular polygon with a side produced.
 *
 *   2018 P1 Q9  regular decagon, AKL a straight line, angle KLJ 17° -> 127°
 *   2025 P2 Q7  regular pentagon, FAB a straight line, angle EFA 65° -> 43°
 *
 * The same picture with a different number of sides, and the same two steps:
 * the interior angle of a regular polygon, then the angles of a triangle. The
 * answer is always the interior angle less the one given, but a pupil has to
 * see *why* — that producing the side leaves the exterior angle inside the
 * triangle — and that is what the straight line in the figure says.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

const WORD: Record<number, string> = {
  5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon',
  9: 'nonagon', 10: 'decagon', 12: 'dodecagon',
};
// I is skipped, as the papers skip it. Eleven letters, so a decagon still
// leaves one over for the point outside — 2018 names it exactly this way:
// the decagon is ABCDEFGHJK and the point is L.
const LETTERS = 'ABCDEFGHJKL';

export function polygonAngleQuestion(): Q {
  for (let tries = 0; tries < 3000; tries++) {
    const n = pick([5, 6, 7, 8, 9, 10]);
    const interior = 180 * (n - 2) / n;
    if (!Number.isInteger(interior)) continue;      // 7 and 9 are not whole
    // the angle given at the outside point, leaving a sensible answer
    const given = getRandomInt(12, interior - 20);
    const answer = interior - given;

    const names = LETTERS.slice(0, n).split('');
    const point = LETTERS[n];
    const start = getRandomInt(0, 11) * 30;
    // the triangle's own sine rule fixes how far out the point sits
    const side = 1;
    const reach = side * Math.sin(answer * Math.PI / 180) / Math.sin(given * Math.PI / 180);
    if (reach < 0.35 || reach > 4) continue;

    const r = 1 / (2 * Math.sin(Math.PI / n));      // circumradius for unit side
    const fig = polygonPoint({
      sides: n, radius: r, start, names, point,
      reach, angleLabel: `${given}°`,
    });
    if (!fig) continue;

    const [A, B, E] = [names[0], names[1], names[n - 1]];
    const prose = [
      `In the diagram, $${names.join('')}$ is a regular ${WORD[n]}.`,
      '',
      `&bull;&nbsp; Angle $${E}${point}${A}$ is $${given}^{\\circ}$`,
      `&bull;&nbsp; $${point}${A}${B}$ is a straight line`,
      `Calculate the size of angle $${point}${E}${A}$.`,
    ];
    // Two marks: the interior angle of the polygon, then the angle asked for.
    // The straight line and the angle sum are how the second is reached, not a
    // mark of their own, so they share its step.
    const steps = [
      `<strong>1.</strong> The interior angle of a regular ${WORD[n]}:<br><br>$\\frac{180 \\times (${n} - 2)}{${n}} = ${interior}^{\\circ}$`,
      `<strong>2.</strong> $${point}${A}${B}$ is a straight line, so the angle at $${A}$ inside the triangle is $180 - ${interior} = ${180 - interior}^{\\circ}$, and the angles of triangle $${point}${A}${E}$ add to $180^{\\circ}$:<br><br>$180 - ${given} - ${180 - interior} = ${answer}^{\\circ}$`,
    ];
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'A Side of a Polygon Produced',
      difficulty: 'exam',
      variationId: 'angles.polygon-produced',
      stepMarks: [1, 1],
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(2)],
      boardQuestionLines: [`Regular ${WORD[n]}, side produced, angle ${given}° outside. Third angle?`],
      solutionSteps: steps,
      finalAnswer: `$${answer}^{\\circ}$`,
      figure: fig,
    };
  }
  throw new Error('polygon angle: no valid question found');
}

/**
 * A regular polygon on a circle, with a diameter from one vertex.
 *
 * 2019 P1 Q11. Three steps, all of them about the turn at the centre:
 *
 *   1. the vertices divide 360 equally, so neighbours are 360/n apart
 *   2. the diameter is a straight line, so what is left at the centre is
 *      180 - 360/n
 *   3. the two radii make an isosceles triangle, giving 180/n
 *
 * The number of sides has to be odd or the diameter ends on a vertex and there
 * is nothing to call F, and 180/n has to come out whole, which leaves the
 * pentagon and the nonagon. The design the paper draws around it — the
 * triangle joining the two neighbours of A to F — is decoration, and is drawn
 * because the paper draws it.
 */
const LOGO_CONTEXTS = [
  'A company logo', 'A school badge', 'A stained-glass window', 'A ceramic tile',
  'A garden paving slab', 'A wrought-iron gate panel', 'A quilt block',
  'A biscuit tin lid', 'A silver brooch', 'A café coaster',
  'A patchwork cushion', 'A carved wooden panel',
];

export function polygonDiameterQuestion(): Q {
  for (let tries = 0; tries < 3000; tries++) {
    // 5 and 9 are the only ones that work: even and the diameter lands on a
    // vertex, 7 and the answer is 25.71 degrees
    const n = pick([5, 9]);
    const answer = 180 / n;
    const step = 360 / n;

    const names = LETTERS.slice(0, n).split('');
    const far = LETTERS[n];
    const fig = polygonDiameter({
      sides: n, radius: 1, start: getRandomInt(0, 11) * 30,
      names, far, centre: 'O',
    });
    if (!fig) continue;

    const [A, B] = [names[0], names[1]];
    const context = pick(LOGO_CONTEXTS);
    const prose = [
      `${context} is designed around a regular ${WORD[n]} $${names.join('')}$.`,
      '',
      `&bull;&nbsp; The vertices of the ${WORD[n]} lie on a circle with centre $O$`,
      `&bull;&nbsp; $${A}${far}$ is a diameter of the circle`,
      `Calculate the size of angle $O${far}${B}$.`,
    ];
    const steps = [
      `<strong>1.</strong> The ${n} vertices divide the turn at the centre equally:<br><br>$${A}O${B} = \\frac{360}{${n}} = ${step}^{\\circ}$`,
      `<strong>2.</strong> $${A}O${far}$ is a straight line, so the angles at $O$ add to $180^{\\circ}$:<br><br>$${B}O${far} = 180 - ${step} = ${180 - step}^{\\circ}$`,
      `<strong>3.</strong> $O${B}$ and $O${far}$ are both radii, so triangle $O${B}${far}$ is isosceles and its other two angles are equal:<br><br>$O${far}${B} = \\frac{180 - ${180 - step}}{2} = ${answer}^{\\circ}$`,
    ];
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'A Polygon and a Diameter',
      difficulty: 'exam',
      // •¹ the angle at the centre from the equal division, •² the angle on the
      // straight line, •³ the base angle of the isosceles triangle
      variationId: 'angles.polygon-diameter',
      stepMarks: [1, 1, 1],
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(2)],
      boardQuestionLines: [`Regular ${WORD[n]} on a circle, centre O. ${A}${far} is a diameter. Find angle O${far}${B}.`],
      solutionSteps: steps,
      finalAnswer: `$${answer}^{\\circ}$`,
      figure: fig,
    };
  }
  throw new Error('polygon diameter: no valid question found');
}

/**
 * An H shape with a regular polygon against one upright.
 *
 * 2023 P2 Q5. Two steps and both of them are in the picture:
 *
 *   1. the crossbar meets the upright at a right angle
 *   2. the upright is a side of the polygon, so what is left below the corner
 *      is the exterior angle, 360/n
 *
 * so the answer is 90 + 360/n. The paper shades the angle rather than naming
 * it; this names it, because a generated sheet cannot rely on the grey
 * surviving a photocopier and three letters say the same thing exactly.
 */
export function barPolygonQuestion(): Q {
  for (let tries = 0; tries < 3000; tries++) {
    // 360/n has to be whole, which rules out 7 and 11
    const n = pick([5, 6, 8, 9, 10, 12]);
    const exterior = 360 / n;
    const answer = 90 + exterior;

    const names = { corner: 'B', barEnd: 'A', next: 'C' };
    const fig = barAndPolygon({
      sides: n, side: 1, reach: 1.8, mirror: getRandomInt(0, 1) === 1, names,
    });
    if (!fig) continue;

    const prose = [
      `A badge is made from an H shape joined to a regular ${WORD[n]}, as the diagram shows.`,
      '',
      `&bull;&nbsp; One side of the ${WORD[n]} lies along the upright of the H`,
      `&bull;&nbsp; The crossbar of the H meets that upright at $${names.corner}$`,
      `Calculate the size of the shaded angle $${names.barEnd}${names.corner}${names.next}$.`,
    ];
    const steps = [
      `<strong>1.</strong> The exterior angle of a regular ${WORD[n]}:<br><br>$\\frac{360}{${n}} = ${exterior}^{\\circ}$`,
      // Two marks: the exterior angle of the polygon, then the shaded angle.
      `<strong>2.</strong> The side $${names.corner}${names.next}$ turns through that exterior angle from the upright, and the crossbar meets the upright at a right angle, so the two parts add:<br><br>$${names.barEnd}${names.corner}${names.next} = 90 + ${exterior} = ${answer}^{\\circ}$`,
    ];
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'An H Shape and a Polygon',
      difficulty: 'exam',
      variationId: 'angles.bar-polygon',
      stepMarks: [1, 1],
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(2)],
      boardQuestionLines: [`H shape with a regular ${WORD[n]} on one upright. Find the angle between the crossbar and the next side.`],
      solutionSteps: steps,
      finalAnswer: `$${answer}^{\\circ}$`,
      figure: fig,
    };
  }
  throw new Error('bar polygon: no valid question found');
}

export const ANGLE_GENERATORS: Record<string, () => Q> = {
  'A Side of a Polygon Produced': polygonAngleQuestion,
  'A Polygon and a Diameter': polygonDiameterQuestion,
  'An H Shape and a Polygon': barPolygonQuestion,
};
