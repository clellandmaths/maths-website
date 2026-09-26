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

/**
 * **2018 P1 Q9 is a DECAGON and the clone drew one in 17 of 400 draws** —
 * pentagon 169, hexagon 102, octagon 80, nonagon 32, decagon 17. The spread
 * is not wrong in itself (every polygon is the same mathematics) but the
 * paper's own shape arriving one draw in twenty-four is. The owner: *"Raise
 * the decagon share on 2018 id only and shade the angle needed if possible?"*
 *
 * Both are keyed on `asked`. 2018 sits on the alias
 * `angles.polygon-produced-pre2023`; 2025 P2 Q7 is the target, is a pentagon,
 * shades nothing, and is **signed off** — so it keeps the old list, the old
 * spread and no shading. `pick` is one `getRandomInt` whatever the array's
 * length, so the draw costs the same either way.
 */
const P1_2018 = 'angles.polygon-produced-pre2023';

export function polygonAngleQuestion(_wanted?: string, asked?: string): Q {
  const forPaper2018 = asked === P1_2018;
  for (let tries = 0; tries < 3000; tries++) {
    /**
     * **Four attempts in five ask for the decagon, and that yields about a
     * third of the draws.** The weighting has to be that heavy because a
     * decagon figure survives `verifyFigure` far less often than a smaller
     * one — 4% of legal (angle, rotation) pairs against the pentagon's 47%.
     * Measured: the vertex letter beside the produced side and the angle
     * label at the outside point collide, because ten vertices sit close
     * together and the mark is drawn well back along the bisector to hold
     * its number.
     *
     * **What survives is faithful, which is why weighting is the right
     * answer here and not a figure change.** The decagon draws at given
     * angles 17 to 28 — the paper's own is 17 — across ten of the twelve
     * rotations, so roughly 140 questions, all of them the paper's shape.
     * Widening the figure to admit the rest would mean moving label
     * placement that 2025 P2 Q7 shares, and it is signed off.
     *
     * Seven is dropped by the whole-interior-angle guard below either way.
     */
    const n = forPaper2018
      ? (getRandomInt(1, 5) === 1 ? pick([5, 6, 8, 9]) : 10)
      : pick([5, 6, 7, 8, 9, 10]);
    const interior = 180 * (n - 2) / n;
    if (!Number.isInteger(interior)) continue;      // 7 and 9 are not whole
    /**
     * The angle given at the outside point, leaving a sensible answer.
     *
     * **Seventeen at the narrowest, which is the exam's own floor.** 2018 P1
     * Q9 is the sharper of the two papers at 17 degrees and 2025 P2 Q7 is 65,
     * so twelve was below anything the exam sets. It is a drawing constraint
     * as much as a fidelity one: below about 17 degrees the wedge cannot hold
     * its own number however far back along the bisector `angleMark` writes
     * it, and at 15 the figure printed a "15" overhanging both sides.
     */
    const given = getRandomInt(17, interior - 20);
    const answer = interior - given;
    /**
     * **A clear bend at E, as 2025 P2 Q7's 151°.** The asked angle and the
     * interior angle meet along the next side, and when they add to nearly
     * 180 the line from the outside point seems to run straight on into it -
     * F, E and D in a line the question never states. 50 of 400 draws, all
     * pentagons at 30° to 42°. The owner, on the 2025 re-review sheet: "Yes".
     * 2025's id only, a rejection after the draw; 2018 is untouched.
     */
    if (asked === 'angles.polygon-produced' && Math.abs(answer + interior - 180) <= 6) continue;

    const names = LETTERS.slice(0, n).split('');
    const point = LETTERS[n];
    const start = getRandomInt(0, 11) * 30;
    // the triangle's own sine rule fixes how far out the point sits
    const side = 1;
    const reach = side * Math.sin(answer * Math.PI / 180) / Math.sin(given * Math.PI / 180);
    /**
     * **How far the outside point stands off, and it may not squat.**
     *
     * The owner, on the closure sheet, against a 115-degree apex on an
     * octagon: *"Looks squished the angle, could it be made better by making
     * triangle a bit bigger and capping the size of that angle?"*
     *
     * `reach` is the triangle's own sine rule, so it says the shape directly:
     * the bigger the angle at the outside point, the shallower the triangle
     * and the closer that point sits to the polygon. The papers run
     *
     *   2025 P2 Q7   pentagon, 65 degrees   reach 0.75
     *   2018 P1 Q9   decagon,  17 degrees   reach 2.73
     *
     * and the floor of 0.35 let the clone reach 0.38 - half the shallowest
     * triangle either paper draws. Raising it to 0.7 caps the apex at 99
     * degrees and keeps about three draws in four, which is the same fix read
     * from both ends: a bigger triangle *is* a smaller angle.
     */
    if (reach < 0.7 || reach > 4) continue;

    const r = 1 / (2 * Math.sin(Math.PI / n));      // circumradius for unit side
    const fig = polygonPoint({
      sides: n, radius: r, start, names, point,
      reach, angleLabel: `${given}°`,
      shadeAsked: forPaper2018,
      // The number up against the outside point, not beside the asked
      // corner - on both papers, each on the owner's word: "Fix 2018 P1 Q9",
      // then, having read 2025's sheet, "Happy to go ahead with your
      // recommendation for 2025 P2 Q7" (both 2026-09-23). 2025 still shades
      // nothing, and its letters stay where they were: the letter move in
      // polygonPoint needs shading as well.
      markAtPoint: true,
    });
    if (!fig) continue;

    const [A, B, E] = [names[0], names[1], names[n - 1]];
    const prose = [
      `In the diagram, $${names.join('')}$ is a regular ${WORD[n]}.`,
      '',
      `&bull;&nbsp; Angle $${E}${point}${A}$ is $${given}^{\\circ}$`,
      `&bull;&nbsp; $${point}${A}${B}$ is a straight line`,
      // 2018 P1 Q9 shades the angle and names it that way — "Calculate the
      // size of shaded angle KJL" — where 2025 P2 Q7 shades nothing and asks
      // for "the size of angle FEA". The word follows the shading.
      `Calculate the size of ${forPaper2018 ? 'shaded ' : ''}angle $${point}${E}${A}$.`,
    ];
    // Two marks: the interior angle of the polygon, then the angle asked for.
    // The straight line and the angle sum are how the second is reached, not a
    // mark of their own, so they share its step.
    const steps = [
      `<strong>1.</strong> The interior angle of a regular ${WORD[n]}:<br><br>$\\frac{180 \\times (${n} - 2)}{${n}} = ${interior}^{\\circ}$`,
      `<strong>2.</strong> $${point}${A}${B}$ is a straight line, so the angle at $${A}$ inside the triangle is $180 - ${interior} = ${180 - interior}^{\\circ}$, and the angles of triangle $${point}${A}${E}$ add to $180^{\\circ}$:<br><br>$180 - ${given} - ${180 - interior} = ${answer}^{\\circ}$`,
    ];
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;
    /**
     * **2018 keeps the draws it was locked with; only the labelling moved.**
     *
     * Moving the number changed which layouts pass `verifyFigure`, and on its
     * own that let the wide apexes back in: the angle at the outside point
     * went from a median of 26 degrees to 83, and obtuse from 24 draws in 400
     * to 111. Nobody asked for that - the owner's comment was about where the
     * number and the shading sit - and the paper's own is a 17-degree sliver.
     *
     * So a draw must ALSO pass as the figure it was signed off with. That
     * holds the questions to the approved set exactly, and it costs no random:
     * both figures are built from numbers already drawn. 2025 P2 Q7 is held
     * the same way, to its own locked figure - unshaded.
     */
    const asLocked = polygonPoint({
      sides: n, radius: r, start, names, point,
      reach, angleLabel: `${given}°`, shadeAsked: forPaper2018,
    });
    if (!asLocked || verifyFigure(asLocked, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'A Side of a Polygon Produced',
      difficulty: 'exam',
      variationId: 'angles.polygon-produced',
      stepMarks: [1, 1],
      // 2025 P2 Q7 ends each bullet with a stop, "Angle EFA is 65°." inside
      // the maths. The owner, 2026-09-25: "if the only fixes is putting full
      // stops just do that without asking me". Its own id only, and after
      // verifyFigure, so no draw passes or fails differently.
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(2).map(l =>
        asked !== 'angles.polygon-produced' || !l.startsWith('&bull;') ? l
          : l.endsWith('$') ? `${l.slice(0, -1)}.$` : `${l}.`)],
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
    /**
     * **The diameter stands upright, because that is what makes it readable.**
     *
     * `V[0]` sits at `start` and the far point at `start + 180`, so AF is a
     * diameter at any rotation - but only at 90 or 270 is it *vertical*, and
     * only then is the whole figure symmetric about it. At 90 the vertices
     * either side pair off (for a pentagon, 18 with 162 and 234 with 306), and
     * the eye follows the chords straight away.
     *
     * This drew `getRandomInt(0, 11) * 30`, so ten rotations in twelve tilted
     * it. The owner, on the 2019 P1 Q11 card, seeing an upright decagon beside
     * a tilted pentagon: *"Agree with your recommendation."* Nothing measured
     * it; it was found by rendering two draws and looking at them, and the
     * tilted one is legal, correct and a tangle of crossing chords.
     *
     * **It is the pentagon that cannot be rotated, not the figure.** The first
     * pass held every draw upright, and `diagrams` failed it: 5 and 9 sides
     * times two uprights is four pictures in six hundred runs, against a floor
     * of eight. The first diagnosis was also sloppy - the tangle was found on
     * a *rotated pentagon* and the clean one was an *upright nonagon*, two
     * things changed at once, and rotation took the blame.
     *
     * Rendered one at a time, the answer is the shape. A rotated **pentagon**
     * is a tangle: five vertices means long chords that cross the diameter at
     * shallow angles. A rotated **nonagon** reads perfectly well, because its
     * chords are short and meet at open angles.
     *
     * So the pentagon stands upright - which is also 2019 P1 Q11's own figure,
     * A at the top and F at the bottom - and the nonagon keeps the full turn.
     * Two pictures plus twelve is fourteen, comfortably over the floor, and
     * the paper's own shape is always drawn the paper's own way.
     *
     * Rotation is explicitly not a thing to *split* for, and this is not a
     * split: `polygonDiameterQuestion` is its own dispatch entry with its own
     * draw loop, serving `angles.polygon-diameter` and nothing else, so no
     * other question can be reached from here.
     */
    const start = n === 5
      ? (getRandomInt(0, 1) === 0 ? 90 : 270)
      : getRandomInt(0, 11) * 30;
    const fig = polygonDiameter({
      sides: n, radius: 1, start,
      names, far, centre: 'O',
    });
    if (!fig) continue;
    /**
     * **The paper prints TWO diagrams and this printed one.** The first is the
     * bare polygon on its circle with every radius dashed in to a dotted
     * centre; the second adds the diameter, the chords and the shading. The
     * owner, with both in front of them: *"I wonder if we do what the paper
     * does and show the polygon before the shape is added? ... you can clearly
     * see what the adding does to the original diagram and where angles you
     * have might work something out."*
     *
     * It matters for the first mark. `AOB = 360/n` comes from the vertices
     * dividing the turn equally, and the dashed radii are exactly what make
     * that visible — the design figure never draws them, in the paper or here,
     * so with one figure a pupil had to know to imagine them.
     */
    const plainFig = polygonDiameter({
      sides: n, radius: 1, start,
      names, far, centre: 'O', plain: true,
    });
    if (!plainFig) continue;

    const [A, B] = [names[0], names[1]];
    const context = pick(LOGO_CONTEXTS);
    /**
     * Worded as the paper words it, now that there are two figures: the shape
     * is drawn first, then the design is added to it. 2019 P1 Q11 reads *"She
     * starts by drawing a regular pentagon ABCDE ... She then adds to the
     * design as shown in the diagram below."*
     */
    const prose = [
      `${context} is designed around a regular ${WORD[n]} $${names.join('')}$.`,
      `The vertices of the ${WORD[n]} lie on a circle with centre $O$.`,
      '',
      `The design is then completed as shown below.`,
      '',
      `&bull;&nbsp; $${A}${far}$ is a diameter of the circle`,
      `Calculate the size of angle $O${far}${B}$.`,
    ];
    const steps = [
      `<strong>1.</strong> The ${n} vertices divide the turn at the centre equally:<br><br>$${A}O${B} = \\frac{360}{${n}} = ${step}^{\\circ}$`,
      `<strong>2.</strong> $${A}O${far}$ is a straight line, so the angles at $O$ add to $180^{\\circ}$:<br><br>$${B}O${far} = 180 - ${step} = ${180 - step}^{\\circ}$`,
      `<strong>3.</strong> $O${B}$ and $O${far}$ are both radii, so triangle $O${B}${far}$ is isosceles and its other two angles are equal:<br><br>$O${far}${B} = \\frac{180 - ${180 - step}}{2} = ${answer}^{\\circ}$`,
    ];
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;
    // Both figures have to place cleanly, or the question arrives half drawn.
    if (verifyFigure(plainFig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'A Polygon and a Diameter',
      difficulty: 'exam',
      // •¹ the angle at the centre from the equal division, •² the angle on the
      // straight line, •³ the base angle of the isosceles triangle
      variationId: 'angles.polygon-diameter',
      stepMarks: [1, 1, 1],
      // the shape, then the design added to it — the paper's own order
      questionLines: [
        prose[0], prose[1], renderScene(plainFig.scene),
        prose[3], renderScene(fig.scene), ...prose.slice(5),
      ],
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
