import { type Element, type Figure, type Pt, angleMark, parallelMark, pt, scale, shadeAngle, sub } from '../scene';

/**
 * Two tangents meeting outside the circle, with a chord parallel to a diameter.
 *
 * 2016 P2 Q5: AB and CB touch the circle at A and C, ED is a diameter, AC and
 * ED are parallel, the angle at the centre between OD and OA is given, and the
 * angle between the two tangents is asked for.
 *
 * Everything the question needs follows from where A is put:
 *
 *   the chord through A parallel to the diameter fixes C
 *   the two tangents meet on the bisector of angle AOC, at r / cos(AOC / 2)
 *
 * so the given angle alone decides the whole figure. Past about 155 the two
 * tangents are nearly parallel and their meeting point leaves the page; below
 * about 125 the chord is so near the edge that A and C crowd each other.
 */

export interface TwoTangentsChordSpec {
  radius: number;
  /** Where the diameter's marked end sits, anticlockwise from east. */
  start: number;
  /** The angle at the centre between the diameter and the radius to A. */
  given: number;
  /** Which side of the diameter the tangents go. */
  flip: boolean;
  names: { centre: string; touchA: string; touchC: string; outside: string;
           markedEnd: string; farEnd: string };
}

const dir = (deg: number): Pt =>
  pt(Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180));

export function twoTangentsChord(spec: TwoTangentsChordSpec): Figure | null {
  const { radius: r, start, given: g } = spec;
  const s = spec.flip ? -1 : 1;
  // the angle the two radii to the points of contact make, which is what the
  // whole figure is built on
  const atCentre = 2 * g - 180;
  if (r <= 0 || atCentre < 60 || atCentre > 140) return null;

  const O = pt(0, 0);
  const D = scale(dir(start), r);                    // the end the angle is measured from
  const E = scale(dir(start + 180), r);
  const A = scale(dir(start - s * g), r);
  // the other end of the chord through A parallel to the diameter
  const C = scale(dir(start + s * (g - 180)), r);
  const B = scale(dir(start - s * 90), r / Math.cos(atCentre / 2 * Math.PI / 180));
  const n = spec.names;

  // both chevrons have to run the same way round or they say nothing
  const along = dir(start);
  const [acFrom, acTo] = sub(C, A).x * along.x + sub(C, A).y * along.y > 0 ? [A, C] : [C, A];

  const elements: Element[] = [
    shadeAngle(B, [A, C]),
    { kind: 'circle', centre: O, r },
    // the diameter in two pieces, so the centre is an endpoint and may carry
    // its own letter
    { kind: 'segment', from: D, to: O },
    { kind: 'segment', from: O, to: E },
    { kind: 'segment', from: O, to: A },
    { kind: 'segment', from: A, to: C },
    { kind: 'segment', from: A, to: B },
    { kind: 'segment', from: C, to: B },
    ...parallelMark(O, D),
    ...parallelMark(acFrom, acTo),
    { kind: 'label', text: n.markedEnd, anchor: D, away: O },
    { kind: 'label', text: n.farEnd, anchor: E, away: O },
    { kind: 'label', text: n.touchA, anchor: A, away: O },
    { kind: 'label', text: n.touchC, anchor: C, away: O },
    { kind: 'label', text: n.outside, anchor: B, away: O },
    // three lines leave the centre and the diameter accounts for two of them,
    // so the whole half-plane away from the tangents is free
    { kind: 'label', text: n.centre, anchor: O, away: scale(dir(start - s * 90), r * 0.4) },
    ...angleMark(O, [D, A], `${g}°`),
  ];

  return {
    scene: { elements },
    claims: [
      { kind: 'length', from: O, to: A, value: r, shown: false },
      { kind: 'length', from: O, to: C, value: r, shown: false },
      { kind: 'length', from: O, to: D, value: r, shown: false },
      { kind: 'length', from: O, to: E, value: r, shown: false },
      { kind: 'angle', at: O, arms: [D, A], value: g, shown: true },
      { kind: 'angle', at: O, arms: [D, E], value: 180, shown: false },
      // a radius meets a tangent at right angles, at both points of contact
      { kind: 'angle', at: A, arms: [O, B], value: 90, shown: false },
      { kind: 'angle', at: C, arms: [O, B], value: 90, shown: false },
      // the chord really is parallel to the diameter, said as the angle the
      // working actually uses: the two allied angles across the transversal OA
      { kind: 'angle', at: A, arms: [C, O], value: 180 - g, shown: false },
      { kind: 'angle', at: O, arms: [A, C], value: atCentre, shown: false },
      // and the answer's own geometry
      { kind: 'angle', at: B, arms: [A, C], value: 360 - 2 * g, shown: false },
    ],
  };
}
