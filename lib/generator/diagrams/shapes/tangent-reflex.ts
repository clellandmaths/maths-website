import { type Element, type Figure, type Pt, add, angleAt, angleMark, bearing, pt, scale } from '../scene';

/**
 * A tangent and two chords, with the reflex angle at the centre marked.
 *
 * 2026 P1 Q10: DE touches at B, A and C are on the circle, the angle between a
 * radius and a chord is given at B and so is the angle between the other chord
 * and the tangent. The answer is the reflex angle AOC.
 *
 * A and C go on opposite sides of OB, which is what makes the two angles at
 * the centre add up to the reflex one rather than overlap. Each is an
 * isosceles triangle away from a given:
 *
 *   angle OBC = p  =>  angle BOC = 180 - 2p
 *   angle ABE = q  =>  angle OBA = 90 - q, so angle BOA = 2q
 *
 * The reflex angle cannot be claimed as an angle — angleAt only ever returns
 * 0 to 180, so it would come back as its own supplement and confirm whatever
 * was drawn. What is claimed is the ordinary angle AOC, which pins the same
 * geometry from the other side.
 */

export interface TangentReflexSpec {
  radius: number;
  /** Where the point of contact sits, anticlockwise from east. */
  start: number;
  /** The angle at B between the radius and the chord to C. */
  atRadius: number;
  /** The angle at B between the chord to A and the tangent. */
  atTangent: number;
  /** Which way round A and C go. */
  flip: boolean;
  /** How far the tangent runs each side of the point of contact. */
  reach: number;
  names: { centre: string; contact: string; near: string; far: string;
           tangentD: string; tangentE: string };
}

const dir = (deg: number): Pt =>
  pt(Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180));

export function tangentReflex(spec: TangentReflexSpec): Figure | null {
  const { radius: r, start, atRadius: p, atTangent: q, reach } = spec;
  const s = spec.flip ? -1 : 1;
  const reflex = 180 - 2 * p + 2 * q;
  if (r <= 0 || reach <= 0) return null;
  // it has to be reflex, or the question asks for something that is not there
  if (p <= 0 || p >= 90 || q <= 0 || q >= 90 || reflex <= 185 || reflex >= 350) return null;

  const O = pt(0, 0);
  const B = scale(dir(start), r);
  const A = scale(dir(start - s * 2 * q), r);
  const C = scale(dir(start + s * (180 - 2 * p)), r);
  const n = spec.names;

  const along = dir(start + 90);
  const end = (k: number) => add(B, scale(along, reach * r * k));
  // E is the tangent end on A's side, since the given angle is measured from
  // it. Which end that is comes from measuring both, not from the sign of the
  // flip: the other end gives 180 - q and looks perfectly reasonable.
  const [E, D] = Math.abs(angleAt(B, A, end(1)) - q) < 1 ? [end(1), end(-1)]
                                                        : [end(-1), end(1)];

  // the reflex angle runs from one radius round through B to the other, so it
  // is drawn as the arc that passes B rather than the one that does not
  const [arcFrom, arcTo] = s > 0 ? [A, C] : [C, A];

  const elements: Element[] = [
    { kind: 'circle', centre: O, r },
    { kind: 'segment', from: D, to: B },
    { kind: 'segment', from: B, to: E },
    { kind: 'segment', from: O, to: B },
    { kind: 'segment', from: O, to: A },
    { kind: 'segment', from: O, to: C },
    { kind: 'segment', from: B, to: A },
    { kind: 'segment', from: B, to: C },
    { kind: 'arc', centre: O, r: r * 0.3, from: bearing(O, arcFrom), to: bearing(O, arcTo) },
    { kind: 'label', text: n.contact, anchor: B, away: O },
    { kind: 'label', text: n.near, anchor: A, away: O },
    { kind: 'label', text: n.far, anchor: C, away: O },
    { kind: 'label', text: n.tangentD, anchor: D, away: B },
    { kind: 'label', text: n.tangentE, anchor: E, away: B },
    // three radii leave the centre and the reflex arc fills two of the three
    // gaps between them, so the centre's letter goes in the third
    { kind: 'label', text: n.centre, anchor: O,
      away: scale(dir(start + s * (270 - p - q) + 180), r * 0.4) },
    ...angleMark(B, [O, C], `${p}°`),
    ...angleMark(B, [A, E], `${q}°`),
  ];

  return {
    scene: { elements },
    claims: [
      { kind: 'length', from: O, to: A, value: r, shown: false },
      { kind: 'length', from: O, to: B, value: r, shown: false },
      { kind: 'length', from: O, to: C, value: r, shown: false },
      { kind: 'angle', at: B, arms: [O, C], value: p, shown: true },
      { kind: 'angle', at: B, arms: [A, E], value: q, shown: true },
      // a radius meets a tangent at right angles, and the tangent is straight
      { kind: 'angle', at: B, arms: [O, E], value: 90, shown: false },
      { kind: 'angle', at: B, arms: [D, E], value: 180, shown: false },
      // the two angles at the centre the working finds
      { kind: 'angle', at: O, arms: [B, C], value: 180 - 2 * p, shown: false },
      { kind: 'angle', at: O, arms: [B, A], value: 2 * q, shown: false },
      // and the answer, stated the only way a measurement can state it: the
      // ordinary angle the reflex one is the rest of
      { kind: 'angle', at: O, arms: [A, C], value: 360 - reflex, shown: false },
    ],
  };
}
