import { GeneratedQuestion } from './types';
import { getRandomInt } from './utils';
import { tangentCircle } from '../diagrams/shapes/tangent-circle';
import { tangentSemicircle } from '../diagrams/shapes/tangent-semicircle';
import { tangentMeetsDiameter } from '../diagrams/shapes/tangent-meets-diameter';
import { twoTangentsChord } from '../diagrams/shapes/two-tangents-chord';
import { twoTangentsDiameters } from '../diagrams/shapes/two-tangents-diameters';
import { tangentReflex } from '../diagrams/shapes/tangent-reflex';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';

/**
 * A tangent, a diameter through the point of contact, and a chord.
 *
 * 2022 P1 Q4. Three standard facts in sequence, none of them printed on the
 * figure — which is why the figure has to be unambiguous about what touches
 * what:
 *
 *   1. C, O and D are one straight line, so the angles at O add to 180
 *   2. OC and OE are both radii, so that triangle is isosceles
 *   3. the radius meets the tangent at right angles
 *
 * The answer comes out as 90 + half the given angle, so the given angle is
 * kept even and the answer is a whole number of degrees, as the paper's is.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

const SETS: { centre: string; contact: string; far: string; third: string;
              tangentA: string; tangentB: string }[] = [
  { centre: 'O', contact: 'C', far: 'D', third: 'E', tangentA: 'A', tangentB: 'B' },
  { centre: 'O', contact: 'P', far: 'R', third: 'S', tangentA: 'T', tangentB: 'U' },
  { centre: 'M', contact: 'K', far: 'L', third: 'N', tangentA: 'F', tangentB: 'G' },
  { centre: 'O', contact: 'B', far: 'D', third: 'E', tangentA: 'A', tangentB: 'C' },
];

export function tangentQuestion(): Q {
  for (let tries = 0; tries < 3000; tries++) {
    const n = pick(SETS);
    // even, so half of it is a whole number of degrees
    const given = getRandomInt(11, 79) * 2;
    const answer = 90 + given / 2;
    const contact = getRandomInt(0, 11) * 30;

    const fig = tangentCircle({
      radius: 1, contact, toE: given, reach: 1.5,
      names: n, angleLabel: `${given}°`,
    });
    if (!fig) continue;

    const prose = [
      `The diagram shows a circle with centre $${n.centre}$.`,
      '',
      `&bull;&nbsp; $${n.tangentA}${n.tangentB}$ is a tangent to the circle at the point $${n.contact}$`,
      `&bull;&nbsp; $${n.contact}${n.far}$ is a diameter of the circle`,
      `&bull;&nbsp; Angle $${n.third}${n.centre}${n.far}$ is $${given}^{\\circ}$`,
      `Calculate the size of angle $${n.tangentA}${n.contact}${n.third}$.`,
    ];
    const steps = [
      `<strong>1.</strong> $${n.contact}${n.centre}${n.far}$ is a straight line, so the angles at $${n.centre}$ add to $180^{\\circ}$:<br><br>$${n.third}${n.centre}${n.contact} = 180 - ${given} = ${180 - given}^{\\circ}$`,
      `<strong>2.</strong> $${n.centre}${n.contact}$ and $${n.centre}${n.third}$ are both radii, so triangle $${n.centre}${n.contact}${n.third}$ is isosceles and its other two angles are equal:<br><br>$${n.centre}${n.contact}${n.third} = \\frac{180 - ${180 - given}}{2} = ${given / 2}^{\\circ}$`,
      `<strong>3.</strong> A radius meets a tangent at right angles, so angle $${n.centre}${n.contact}${n.tangentA}$ is $90^{\\circ}$:<br><br>$${n.tangentA}${n.contact}${n.third} = 90 + ${given / 2} = ${answer}^{\\circ}$`,
    ];
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'A Tangent and a Diameter',
      difficulty: 'exam',
      variationId: 'angles.tangent-diameter',
      stepMarks: [1, 1, 1],
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(2)],
      boardQuestionLines: [`Tangent at ${n.contact}, diameter ${n.contact}${n.far}, angle ${n.third}${n.centre}${n.far} = ${given}°. Find ${n.tangentA}${n.contact}${n.third}.`],
      solutionSteps: steps,
      finalAnswer: `$${answer}^{\\circ}$`,
      figure: fig,
    };
  }
  throw new Error('tangent: no valid question found');
}

/**
 * A tangent, a diameter, and a fourth point on the circle.
 *
 * 2015 P1 Q3. Two given angles, four steps, and the answer is the sum of two
 * angles at D that the figure has to keep on opposite sides of the diameter:
 *
 *   1. a radius meets a tangent at right angles
 *   2. OB and OD are radii, so that triangle is isosceles
 *   3. the angle in a semicircle is 90 degrees
 *   4. the two parts at D add
 *
 * Both given angles stay acute, since each is an inscribed angle standing on
 * an arc the picture still has to show.
 */
const SEMI_SETS: TangentSemicircleNames[] = [
  { centre: 'O', contact: 'B', near: 'D', far: 'E', fourth: 'F', tangentA: 'A', tangentC: 'C' },
  { centre: 'O', contact: 'Q', near: 'P', far: 'R', fourth: 'S', tangentA: 'M', tangentC: 'N' },
  { centre: 'M', contact: 'K', near: 'H', far: 'L', fourth: 'N', tangentA: 'G', tangentC: 'J' },
  { centre: 'O', contact: 'C', near: 'A', far: 'D', fourth: 'E', tangentA: 'B', tangentC: 'F' },
];

type TangentSemicircleNames = { centre: string; contact: string; near: string;
  far: string; fourth: string; tangentA: string; tangentC: string };

export function tangentSemicircleQuestion(): Q {
  for (let tries = 0; tries < 3000; tries++) {
    const n = pick(SEMI_SETS);
    // the arc between the point of contact and the near end of the diameter
    // is 180 - 2x, and that arc is the room the tangent leaves for the near
    // end's letter. Past about 66 the two start to crowd each other.
    const x = getRandomInt(58, 66);       // the tangent-chord angle at B
    const y = getRandomInt(48, 72);       // the angle at E
    const first = 90 - x, second = 90 - y;
    const answer = first + second;

    const fig = tangentSemicircle({
      radius: 1, start: getRandomInt(0, 11) * 30, atB: x, atE: y, reach: 1.15,
      names: n,
    });
    if (!fig) continue;

    const prose = [
      `$${n.tangentA}${n.contact}${n.tangentC}$ is a tangent to the circle, centre $${n.centre}$, with point of contact $${n.contact}$.`,
      '',
      `&bull;&nbsp; $${n.near}${n.far}$ is a diameter of the circle and $${n.fourth}$ is a point on the circumference`,
      `&bull;&nbsp; Angle $${n.tangentA}${n.contact}${n.near}$ is $${x}^{\\circ}$`,
      `&bull;&nbsp; Angle $${n.near}${n.far}${n.fourth}$ is $${y}^{\\circ}$`,
      `Calculate the size of angle $${n.contact}${n.near}${n.fourth}$.`,
    ];
    const steps = [
      `<strong>1.</strong> A radius meets a tangent at right angles, so angle $${n.centre}${n.contact}${n.tangentA}$ is $90^{\\circ}$:<br><br>$${n.centre}${n.contact}${n.near} = 90 - ${x} = ${first}^{\\circ}$<br><br>$${n.centre}${n.contact}$ and $${n.centre}${n.near}$ are both radii, so triangle $${n.centre}${n.contact}${n.near}$ is isosceles:<br><br>$${n.contact}${n.near}${n.far} = ${first}^{\\circ}$`,
      `<strong>2.</strong> $${n.near}${n.far}$ is a diameter, so angle $${n.near}${n.fourth}${n.far}$ is $90^{\\circ}$ (the angle in a semicircle). The angles of triangle $${n.near}${n.fourth}${n.far}$ add to $180^{\\circ}$:<br><br>$${n.fourth}${n.near}${n.far} = 180 - 90 - ${y} = ${second}^{\\circ}$`,
      `<strong>3.</strong> $${n.contact}$ and $${n.fourth}$ are on opposite sides of $${n.near}${n.far}$, so the two parts add:<br><br>$${n.contact}${n.near}${n.fourth} = ${first} + ${second} = ${answer}^{\\circ}$`,
    ];
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'A Tangent and a Semicircle',
      difficulty: 'exam',
      variationId: 'angles.tangent-semicircle',
      stepMarks: [1, 1, 1],
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(2)],
      boardQuestionLines: [`Tangent at ${n.contact}, diameter ${n.near}${n.far}, ${n.fourth} on the circle. Angle ${n.tangentA}${n.contact}${n.near} = ${x}°, angle ${n.near}${n.far}${n.fourth} = ${y}°. Find ${n.contact}${n.near}${n.fourth}.`],
      solutionSteps: steps,
      finalAnswer: `$${answer}^{\\circ}$`,
      figure: fig,
    };
  }
  throw new Error('tangent semicircle: no valid question found');
}

/**
 * A diameter produced to meet the tangent.
 *
 * 2017 P1 Q9. The same three facts as the other tangent questions, but they
 * land in a triangle outside the circle rather than inside it:
 *
 *   1. a radius meets a tangent at right angles
 *   2. OB and OD are radii, so that triangle is isosceles
 *   3. the diameter produced is still a straight line
 *   4. the angles of the right-angled triangle OBA add to 180
 *
 * The answer works out as twice the given angle less 90, so it is even
 * whatever is chosen — as the paper's 26 is. What the range really controls is
 * where A lands: the angle at the centre is 180 - 2t, and as that approaches a
 * right angle the tangent and the diameter approach parallel and A runs off
 * the page.
 */
const MEET_SETS: MeetNames[] = [
  { centre: 'O', contact: 'B', far: 'D', near: 'C', outside: 'A', tangentEnd: 'E' },
  { centre: 'O', contact: 'P', far: 'S', near: 'R', outside: 'Q', tangentEnd: 'T' },
  { centre: 'M', contact: 'K', far: 'H', near: 'J', outside: 'G', tangentEnd: 'L' },
  { centre: 'O', contact: 'D', far: 'F', near: 'E', outside: 'C', tangentEnd: 'G' },
];

type MeetNames = { centre: string; contact: string; far: string; near: string;
  outside: string; tangentEnd: string };

export function tangentMeetsDiameterQuestion(): Q {
  for (let tries = 0; tries < 3000; tries++) {
    const n = pick(MEET_SETS);
    /**
     * 53 to 74, every one of them drawable, answers 16 to 58 degrees.
     *
     * It was 57 to 66, of which only 64, 65 and 66 ever produced a figure -
     * which is why this topic made **three** different questions, and why the
     * paper's own 58 was one it could not draw. See the shape routine for what
     * was squeezing it; the frame is now sized to the angle.
     *
     * Stops at 74 rather than the 76 that verifies, because past that A closes
     * on C: measured, the piece of diameter between them holds around 34px
     * from 70 to 74 and falls to 28 at 76, which reads as a mistake even
     * though it passes.
     */
    const t = getRandomInt(53, 74);        // the tangent-chord angle at B
    const atCentre = 180 - 2 * t;          // the angle at O in triangle OBA
    const answer = 90 - atCentre;          // which is 2t - 90

    const fig = tangentMeetsDiameter({
      radius: 1, start: getRandomInt(0, 11) * 30, given: t,
      flip: getRandomInt(0, 1) === 1, reach: 0.8, names: n,
      // The wedge this number sits in holds the circle's own minor arc, so the
      // mark cannot take its size from the tangent stub, which is what
      // `angleMark` would default to.
      markRadius: 0.35,
      // 53 and 54 throw A more than three radii out, and the circle has to be
      // drawn small to fit it in. 2.1 is what lets them be drawn at all, and
      // it is the widest any of these figures gets - about 570px.
      frameCap: 2.1,
    });
    if (!fig) continue;

    const prose = [
      `In the diagram, $${n.outside}${n.contact}${n.tangentEnd}$ is a tangent to the circle, centre $${n.centre}$.`,
      '',
      `&bull;&nbsp; $${n.far}${n.near}$ is a diameter of the circle`,
      `&bull;&nbsp; $${n.far}${n.near}${n.outside}$ is a straight line`,
      `&bull;&nbsp; Angle $${n.far}${n.contact}${n.tangentEnd}$ is $${t}^{\\circ}$`,
      `Calculate the size of the shaded angle $${n.near}${n.outside}${n.contact}$.`,
    ];
    const steps = [
      `<strong>1.</strong> A radius meets a tangent at right angles, so angle $${n.centre}${n.contact}${n.tangentEnd}$ is $90^{\\circ}$:<br><br>$${n.far}${n.contact}${n.centre} = 90 - ${t} = ${90 - t}^{\\circ}$`,
      `<strong>2.</strong> $${n.centre}${n.contact}$ and $${n.centre}${n.far}$ are both radii, so triangle $${n.centre}${n.contact}${n.far}$ is isosceles:<br><br>$${n.contact}${n.centre}${n.far} = 180 - 2 \\times ${90 - t} = ${2 * t}^{\\circ}$`,
      `<strong>3.</strong> $${n.far}${n.centre}${n.outside}$ is a straight line, so the angles at $${n.centre}$ add to $180^{\\circ}$:<br><br>$${n.contact}${n.centre}${n.outside} = 180 - ${2 * t} = ${atCentre}^{\\circ}$<br><br>The angles of triangle $${n.centre}${n.contact}${n.outside}$ add to $180^{\\circ}$, and the angle at $${n.contact}$ is the right angle:<br><br>$${n.near}${n.outside}${n.contact} = 180 - 90 - ${atCentre} = ${answer}^{\\circ}$`,
    ];
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'A Tangent Meeting a Diameter',
      difficulty: 'exam',
      variationId: 'angles.tangent-meets-diameter',
      stepMarks: [1, 1, 1],
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(2)],
      boardQuestionLines: [`Tangent at ${n.contact} meets diameter ${n.far}${n.near} produced at ${n.outside}. Angle ${n.far}${n.contact}${n.tangentEnd} = ${t}°. Find ${n.near}${n.outside}${n.contact}.`],
      solutionSteps: steps,
      finalAnswer: `$${answer}^{\\circ}$`,
      figure: fig,
    };
  }
  throw new Error('tangent meets diameter: no valid question found');
}

/**
 * Two tangents, and a chord parallel to a diameter.
 *
 * 2016 P2 Q5. The parallel lines are what carry the given angle out to the
 * circumference, and from there it is the same pair of right angles as every
 * other tangent question:
 *
 *   1. AC is parallel to ED, so the angle at A is what is left of 180
 *   2. OA and OC are radii, so triangle OAC is isosceles
 *   3. a radius meets a tangent at right angles, twice
 *   4. the angles of quadrilateral OABC add to 360
 *
 * The answer comes out as 360 - 2g, so the given angle has to be obtuse or
 * there is no figure: with g below 90 the "chord" would have to cross the
 * diameter it is parallel to.
 */
const CHORD_SETS: ChordNames[] = [
  { centre: 'O', touchA: 'A', touchC: 'C', outside: 'B', markedEnd: 'D', farEnd: 'E' },
  { centre: 'O', touchA: 'P', touchC: 'R', outside: 'Q', markedEnd: 'S', farEnd: 'T' },
  { centre: 'M', touchA: 'H', touchC: 'K', outside: 'J', markedEnd: 'F', farEnd: 'G' },
  { centre: 'O', touchA: 'B', touchC: 'D', outside: 'C', markedEnd: 'A', farEnd: 'E' },
];

type ChordNames = { centre: string; touchA: string; touchC: string;
  outside: string; markedEnd: string; farEnd: string };

export function twoTangentsChordQuestion(): Q {
  for (let tries = 0; tries < 3000; tries++) {
    const n = pick(CHORD_SETS);
    const g = getRandomInt(125, 155);      // the angle at the centre, given
    const atA = 180 - g;                   // allied with it across the parallels
    const atCentre = 2 * g - 180;          // the angle between the two radii
    const answer = 360 - 2 * g;

    const fig = twoTangentsChord({
      radius: 1, start: getRandomInt(0, 11) * 30, given: g,
      flip: getRandomInt(0, 1) === 1, names: n,
    });
    if (!fig) continue;

    const prose = [
      `The diagram below shows a circle, centre $${n.centre}$.`,
      '',
      `&bull;&nbsp; $${n.touchA}${n.outside}$ and $${n.touchC}${n.outside}$ are tangents to the circle`,
      `&bull;&nbsp; $${n.touchA}${n.touchC}$ and $${n.farEnd}${n.markedEnd}$ are parallel`,
      `&bull;&nbsp; Angle $${n.touchA}${n.centre}${n.markedEnd}$ is $${g}^{\\circ}$`,
      `Calculate the size of the shaded angle $${n.touchA}${n.outside}${n.touchC}$.`,
    ];
    const steps = [
      `<strong>1.</strong> $${n.touchA}${n.touchC}$ and $${n.farEnd}${n.markedEnd}$ are parallel, so the angles on the same side of $${n.centre}${n.touchA}$ add to $180^{\\circ}$:<br><br>$${n.centre}${n.touchA}${n.touchC} = 180 - ${g} = ${atA}^{\\circ}$`,
      `<strong>2.</strong> $${n.centre}${n.touchA}$ and $${n.centre}${n.touchC}$ are both radii, so triangle $${n.centre}${n.touchA}${n.touchC}$ is isosceles and the angle at $${n.touchC}$ is $${atA}^{\\circ}$ as well:<br><br>$${n.touchA}${n.centre}${n.touchC} = 180 - 2 \\times ${atA} = ${atCentre}^{\\circ}$`,
      `<strong>3.</strong> A radius meets a tangent at right angles, so angles $${n.centre}${n.touchA}${n.outside}$ and $${n.centre}${n.touchC}${n.outside}$ are both $90^{\\circ}$.<br><br>The angles of quadrilateral $${n.centre}${n.touchA}${n.outside}${n.touchC}$ add to $360^{\\circ}$:<br><br>$${n.touchA}${n.outside}${n.touchC} = 360 - 90 - 90 - ${atCentre} = ${answer}^{\\circ}$`,
    ];
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'Two Tangents and a Parallel Chord',
      difficulty: 'exam',
      variationId: 'angles.two-tangents-chord',
      stepMarks: [1, 1, 1],
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(2)],
      boardQuestionLines: [`Tangents ${n.touchA}${n.outside} and ${n.touchC}${n.outside}, chord ${n.touchA}${n.touchC} parallel to diameter ${n.farEnd}${n.markedEnd}, angle ${n.touchA}${n.centre}${n.markedEnd} = ${g}°. Find ${n.touchA}${n.outside}${n.touchC}.`],
      solutionSteps: steps,
      finalAnswer: `$${answer}^{\\circ}$`,
      figure: fig,
    };
  }
  throw new Error('two tangents chord: no valid question found');
}

/**
 * Two tangents and two diameters.
 *
 * 2024 P1 Q10. The longest chain in the group, and the only one that starts at
 * the circumference and works inwards:
 *
 *   1. BFE is a straight line, so the inscribed angle at F is what is left
 *   2. an angle at the centre is twice the angle at the circumference
 *   3. a radius meets a tangent at right angles, twice
 *   4. the angles of quadrilateral OBCD add to 360
 *
 * Everything is decided by the angle at the centre between the two radii: the
 * answer is what is left of 180, and the given angle is 180 less half of it.
 * Keeping it even keeps both whole.
 */
const DIAM_SETS: DiamNames[] = [
  { centre: 'O', touchB: 'B', touchD: 'D', outside: 'C', oppB: 'F', oppD: 'G', endA: 'A', endE: 'E' },
  { centre: 'O', touchB: 'P', touchD: 'R', outside: 'Q', oppB: 'T', oppD: 'U', endA: 'S', endE: 'V' },
  { centre: 'M', touchB: 'H', touchD: 'K', outside: 'J', oppB: 'N', oppD: 'P', endA: 'F', endE: 'L' },
  { centre: 'O', touchB: 'C', touchD: 'E', outside: 'D', oppB: 'G', oppD: 'H', endA: 'B', endE: 'F' },
];

type DiamNames = { centre: string; touchB: string; touchD: string; outside: string;
  oppB: string; oppD: string; endA: string; endE: string };

export function twoTangentsDiametersQuestion(): Q {
  for (let tries = 0; tries < 3000; tries++) {
    const n = pick(DIAM_SETS);
    /**
     * 104 to 146 even, answers 34 to 76 degrees.
     *
     * It was 118 to 136 - ten values - because the angle at the centre decides
     * how wide the whole drawing is, and at one shared width a wide drawing
     * means a small circle. The note here recorded that floor as **set by
     * eye**, and it put the paper's own question out of reach: 2024 P1 Q10
     * prints 125, which needs k = 110.
     *
     * The figure now takes a frame of its own, so the proportion is what is
     * being judged rather than the absolute size, and the floor is a measured
     * one: the circle must be at least a third of the width of the drawing.
     * See the shape routine for the numbers.
     *
     * k must stay even, or the given angle - 180 less half of it - is not a
     * whole number of degrees.
     */
    const k = getRandomInt(52, 73) * 2;     // the angle at the centre, even
    const given = 180 - k / 2;              // the angle printed at F
    const answer = 180 - k;

    const fig = twoTangentsDiameters({
      radius: 1, start: getRandomInt(0, 11) * 30, atCentre: k,
      flip: getRandomInt(0, 1) === 1, names: n,
    });
    if (!fig) continue;

    const prose = [
      `The diagram below shows a circle, centre $${n.centre}$.`,
      '',
      `&bull;&nbsp; $${n.endA}${n.outside}$ is a tangent to the circle at the point $${n.touchB}$`,
      `&bull;&nbsp; $${n.outside}${n.endE}$ is a tangent to the circle at the point $${n.touchD}$`,
      `&bull;&nbsp; $${n.touchD}${n.oppD}$ and $${n.touchB}${n.oppB}$ are diameters of the circle`,
      `&bull;&nbsp; Angle $${n.touchD}${n.oppB}${n.endE}$ is $${given}^{\\circ}$`,
      `Calculate the size of the shaded angle $${n.touchB}${n.outside}${n.touchD}$.`,
    ];
    const steps = [
      `<strong>1.</strong> $${n.touchB}${n.oppB}${n.endE}$ is a straight line, so the angles at $${n.oppB}$ add to $180^{\\circ}$:<br><br>$${n.touchD}${n.oppB}${n.touchB} = 180 - ${given} = ${k / 2}^{\\circ}$`,
      `<strong>2.</strong> The angle at the centre is twice the angle at the circumference standing on the same arc $${n.touchB}${n.touchD}$:<br><br>$${n.touchB}${n.centre}${n.touchD} = 2 \\times ${k / 2} = ${k}^{\\circ}$`,
      `<strong>3.</strong> A radius meets a tangent at right angles, so angles $${n.centre}${n.touchB}${n.outside}$ and $${n.centre}${n.touchD}${n.outside}$ are both $90^{\\circ}$.<br><br>The angles of quadrilateral $${n.centre}${n.touchB}${n.outside}${n.touchD}$ add to $360^{\\circ}$:<br><br>$${n.touchB}${n.outside}${n.touchD} = 360 - 90 - 90 - ${k} = ${answer}^{\\circ}$`,
    ];
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'Two Tangents and Two Diameters',
      difficulty: 'exam',
      variationId: 'angles.two-tangents-diameters',
      stepMarks: [1, 1, 1],
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(2)],
      boardQuestionLines: [`Tangents at ${n.touchB} and ${n.touchD} meet at ${n.outside}; ${n.touchB}${n.oppB} and ${n.touchD}${n.oppD} are diameters. Angle ${n.touchD}${n.oppB}${n.endE} = ${given}°. Find ${n.touchB}${n.outside}${n.touchD}.`],
      solutionSteps: steps,
      finalAnswer: `$${answer}^{\\circ}$`,
      figure: fig,
    };
  }
  throw new Error('two tangents diameters: no valid question found');
}

/**
 * A tangent, two chords, and a reflex angle at the centre.
 *
 * 2026 P1 Q10. Two isosceles triangles, one reached through the right angle
 * at the tangent, and the answer is the two angles at the centre added:
 *
 *   1. OB and OC are radii, so angle BOC = 180 - 2p
 *   2. a radius meets a tangent at right angles, so angle OBA = 90 - q
 *   3. OB and OA are radii, so angle BOA = 2q
 *   4. A and C are on opposite sides of OB, so the reflex angle is the sum
 *
 * The answer has to come out above 180 or the question is asking for an angle
 * that is not reflex, which needs the tangent angle to be the larger of the
 * two givens.
 */
const REFLEX_SETS: ReflexNames[] = [
  { centre: 'O', contact: 'B', near: 'A', far: 'C', tangentD: 'D', tangentE: 'E' },
  { centre: 'O', contact: 'Q', near: 'P', far: 'R', tangentD: 'S', tangentE: 'T' },
  { centre: 'M', contact: 'K', near: 'H', far: 'L', tangentD: 'F', tangentE: 'G' },
  { centre: 'O', contact: 'D', near: 'C', far: 'E', tangentD: 'A', tangentE: 'B' },
];

type ReflexNames = { centre: string; contact: string; near: string; far: string;
  tangentD: string; tangentE: string };

export function tangentReflexQuestion(): Q {
  for (let tries = 0; tries < 3000; tries++) {
    const n = pick(REFLEX_SETS);
    const p = getRandomInt(25, 45);        // between the radius and one chord
    const q = getRandomInt(50, 70);        // between the other chord and the tangent
    const first = 180 - 2 * p;             // the angle at the centre it gives
    const second = 2 * q;
    const answer = first + second;
    if (answer < 195 || answer > 265) continue;

    const fig = tangentReflex({
      radius: 1, start: getRandomInt(0, 11) * 30, atRadius: p, atTangent: q,
      flip: getRandomInt(0, 1) === 1, reach: 0.9, names: n,
    });
    if (!fig) continue;

    const prose = [
      `The diagram shows a circle with centre $${n.centre}$.`,
      '',
      `&bull;&nbsp; $${n.tangentD}${n.tangentE}$ is a tangent to the circle at the point $${n.contact}$`,
      `&bull;&nbsp; Angle $${n.centre}${n.contact}${n.far}$ is $${p}^{\\circ}$`,
      `&bull;&nbsp; Angle $${n.near}${n.contact}${n.tangentE}$ is $${q}^{\\circ}$`,
      `Calculate the size of the reflex angle $${n.near}${n.centre}${n.far}$.`,
    ];
    const steps = [
      `<strong>1.</strong> $${n.centre}${n.contact}$ and $${n.centre}${n.far}$ are both radii, so triangle $${n.centre}${n.contact}${n.far}$ is isosceles and the angle at $${n.far}$ is $${p}^{\\circ}$ as well:<br><br>$${n.contact}${n.centre}${n.far} = 180 - 2 \\times ${p} = ${first}^{\\circ}$`,
      `<strong>2.</strong> A radius meets a tangent at right angles, so angle $${n.centre}${n.contact}${n.tangentE}$ is $90^{\\circ}$:<br><br>$${n.centre}${n.contact}${n.near} = 90 - ${q} = ${90 - q}^{\\circ}$<br><br>$${n.centre}${n.contact}$ and $${n.centre}${n.near}$ are both radii, so triangle $${n.centre}${n.contact}${n.near}$ is isosceles too:<br><br>$${n.contact}${n.centre}${n.near} = 180 - 2 \\times ${90 - q} = ${second}^{\\circ}$`,
      `<strong>3.</strong> $${n.near}$ and $${n.far}$ are on opposite sides of $${n.centre}${n.contact}$, so the reflex angle is the two added:<br><br>reflex $${n.near}${n.centre}${n.far} = ${first} + ${second} = ${answer}^{\\circ}$`,
    ];
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'A Reflex Angle at the Centre',
      difficulty: 'exam',
      variationId: 'angles.tangent-reflex',
      stepMarks: [1, 1, 1],
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(2)],
      boardQuestionLines: [`Tangent at ${n.contact}. Angle ${n.centre}${n.contact}${n.far} = ${p}°, angle ${n.near}${n.contact}${n.tangentE} = ${q}°. Find reflex ${n.near}${n.centre}${n.far}.`],
      solutionSteps: steps,
      finalAnswer: `$${answer}^{\\circ}$`,
      figure: fig,
    };
  }
  throw new Error('tangent reflex: no valid question found');
}

export const TANGENT_GENERATORS: Record<string, () => Q> = {
  'A Tangent and a Diameter': tangentQuestion,
  'A Tangent and a Semicircle': tangentSemicircleQuestion,
  'A Tangent Meeting a Diameter': tangentMeetsDiameterQuestion,
  'Two Tangents and a Parallel Chord': twoTangentsChordQuestion,
  'Two Tangents and Two Diameters': twoTangentsDiametersQuestion,
  'A Reflex Angle at the Centre': tangentReflexQuestion,
};
