import { type Element, type Figure, type Pt, angleAt, angleMark, mid, pt, scale } from '../scene';

/**
 * A circle with a tangent at one point, a diameter, and a fourth point.
 *
 * 2015 P1 Q3: AC touches at B, DE is a diameter, F is on the circumference,
 * the tangent-chord angle at B and one angle at E are given, and the angle at
 * D between the two chords is asked for.
 *
 * The picture has to place four points on the circle and nothing else. Both
 * given angles are inscribed, so each one *is* an arc:
 *
 *   angle ABD = x  =>  the radius makes 90 - x with BD, so arc EB = 180 - 2x
 *   angle DEF = y  =>  arc EF = 180 - 2y
 *
 * B and F sit on opposite sides of the diameter, which is the whole reason the
 * two parts add rather than subtract. That is claimed, not assumed.
 */

export interface TangentSemicircleSpec {
  radius: number;
  /** Where the diameter's first end sits, anticlockwise from east. */
  start: number;
  /** The tangent-chord angle at B, between the tangent and the chord to D. */
  atB: number;
  /** The angle at E between the diameter and the chord to F. */
  atE: number;
  /** How far the tangent runs each side of the point of contact. */
  reach: number;
  names: { centre: string; contact: string; near: string; far: string;
           fourth: string; tangentA: string; tangentC: string };
}

const dir = (deg: number): Pt =>
  pt(Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180));

export function tangentSemicircle(spec: TangentSemicircleSpec): Figure | null {
  const { radius: r, start, atB: x, atE: y, reach } = spec;
  if (r <= 0 || reach <= 0) return null;
  // both given angles are inscribed, so each has to leave a real arc behind it
  if (x <= 0 || x >= 90 || y <= 0 || y >= 90) return null;

  const O = pt(0, 0);
  const D = scale(dir(start), r);
  const E = scale(dir(start + 180), r);
  // arc EB one way round, arc EF the other: that is what puts B and F on
  // opposite sides of the diameter
  const B = scale(dir(start + 180 + (180 - 2 * x)), r);
  const F = scale(dir(start + 180 - (180 - 2 * y)), r);
  const n = spec.names;

  // the tangent runs square to the radius at B
  const along = dir(start + 180 + (180 - 2 * x) + 90);
  const end = (k: number) => pt(B.x + along.x * reach * k, B.y + along.y * reach * k);
  // A is the end the given angle is measured from — the end on D's side.
  // Chosen by trying both rather than by reasoning about signs, because the
  // other end gives the supplement and looks entirely reasonable on the page.
  const [A, C] = Math.abs(angleAt(B, end(1), D) - x) < 1 ? [end(1), end(-1)]
                                                        : [end(-1), end(1)];

  const elements: Element[] = [
    { kind: 'circle', centre: O, r },
    { kind: 'segment', from: A, to: B },
    { kind: 'segment', from: B, to: C },
    // the diameter as two segments meeting at the centre, so the centre is an
    // endpoint and its own letter may sit beside it
    { kind: 'segment', from: D, to: O },
    { kind: 'segment', from: O, to: E },
    { kind: 'segment', from: D, to: B },
    { kind: 'segment', from: D, to: F },
    { kind: 'segment', from: B, to: E },
    { kind: 'segment', from: E, to: F },
    { kind: 'label', text: n.contact, anchor: B, away: O },
    { kind: 'label', text: n.near, anchor: D, away: O },
    { kind: 'label', text: n.far, anchor: E, away: O },
    { kind: 'label', text: n.fourth, anchor: F, away: O },
    { kind: 'label', text: n.tangentA, anchor: A, away: B },
    { kind: 'label', text: n.tangentC, anchor: C, away: B },
    // BD passes closer to the centre than anything else in the figure — it is
    // r cos(x) away and everything else is further — so the centre's letter is
    // pushed off it
    { kind: 'label', text: n.centre, anchor: O, away: mid(B, D) },
    ...angleMark(B, [A, D], `${x}°`),
    ...angleMark(E, [D, F], `${y}°`),
  ];

  return {
    scene: { elements },
    claims: [
      { kind: 'length', from: O, to: B, value: r, shown: false },
      { kind: 'length', from: O, to: D, value: r, shown: false },
      { kind: 'length', from: O, to: E, value: r, shown: false },
      { kind: 'length', from: O, to: F, value: r, shown: false },
      { kind: 'angle', at: B, arms: [A, D], value: x, shown: true },
      { kind: 'angle', at: E, arms: [D, F], value: y, shown: true },
      // the two facts the working rests on
      { kind: 'angle', at: B, arms: [A, O], value: 90, shown: false },
      { kind: 'angle', at: O, arms: [D, E], value: 180, shown: false },
      // the angle in a semicircle, which is what makes triangle DEF solvable
      { kind: 'angle', at: F, arms: [D, E], value: 90, shown: false },
      // and the answer's own geometry: B and F on opposite sides of DE, so the
      // two parts of the angle at D add. Drawn on the same side they would
      // subtract, and the figure would look no different to a glance.
      { kind: 'angle', at: D, arms: [B, F], value: 180 - x - y, shown: false },
    ],
  };
}
