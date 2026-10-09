import { type Element, type Figure, type Pt, angleAt, angleMark, pt, scale } from '../scene';

/**
 * A circle with a tangent, a diameter through the point of contact, and a
 * chord back to a third point.
 *
 * 2022 P1 Q4 exactly: AB touches at C, CD is a diameter, E is on the circle,
 * and the angle at the centre between OE and OD is given. It is the shape most
 * of the Angles in Shapes questions are built on, so the routine is written to
 * be reused rather than to serve one question.
 *
 * Two facts do all the work and neither is drawn as a number:
 *
 *   the radius meets the tangent at right angles
 *   C, O and D are one straight line, so the angles at O add to 180
 *
 * Both are claimed as stated intents — 90 and 180 — rather than measured off
 * the points, so a construction that failed to honour them would be caught
 * instead of confirming itself.
 */

export interface TangentCircleSpec {
  radius: number;
  /** Where the tangent touches, anticlockwise from east. */
  contact: number;
  /** The angle at the centre from the far end of the diameter round to E. */
  toE: number;
  /** How far the tangent runs each side of the point of contact. */
  reach: number;
  names: { centre: string; contact: string; far: string; third: string;
           tangentA: string; tangentB: string };
  /** What to write in the angle at the centre; empty leaves it unmarked. */
  angleLabel: string;
}

const dir = (deg: number): Pt =>
  pt(Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180));

export function tangentCircle(spec: TangentCircleSpec): Figure | null {
  const { radius: r, contact, toE, reach } = spec;
  if (r <= 0 || reach <= 0 || toE < 20 || toE > 160) return null;

  const O = pt(0, 0);
  const C = scale(dir(contact), r);
  const D = scale(dir(contact + 180), r);
  const E = scale(dir(contact + 180 + toE), r);
  const n = spec.names;

  // the tangent runs square to the radius, which is the fact the question uses
  // A is the end away from E, so the angle asked for is the obtuse one. Which
  // end that is depends on which side of the diameter E lies, and getting it
  // wrong gives the supplement — a perfectly plausible-looking wrong answer.
  const along = dir(contact + 90);
  const end = (k: number) => pt(C.x + along.x * reach * k, C.y + along.y * reach * k);
  // Which end is which is worked out by trying both, not by reasoning about
  // signs — the reasoning was wrong twice and the wrong end gives the
  // supplement, which looks entirely reasonable on the page.
  const [A, B] = angleAt(C, end(1), E) > 90 ? [end(1), end(-1)] : [end(-1), end(1)];

  const elements: Element[] = [
    { kind: 'circle', centre: O, r },
    { kind: 'segment', from: A, to: B },
    // The diameter is drawn as two segments meeting at the centre rather than
    // one passing through it. Identical on the page, but it makes the centre an
    // endpoint, so the centre's own letter and the angle number are allowed to
    // sit beside it — as a label may beside any vertex it belongs to.
    { kind: 'segment', from: C, to: O },
    { kind: 'segment', from: O, to: D },
    { kind: 'segment', from: C, to: E },
    { kind: 'segment', from: E, to: D },
    { kind: 'segment', from: O, to: E },
    // pushed opposite the marked angle, so it clears both the diameter running
    // through the centre and the arc of the angle mark
    { kind: 'label', text: n.centre, anchor: O,
      away: scale(dir(contact + 180 + toE / 2), r) },
    { kind: 'label', text: n.contact, anchor: C, away: O },
    { kind: 'label', text: n.far, anchor: D, away: O },
    { kind: 'label', text: n.third, anchor: E, away: O },
    { kind: 'label', text: n.tangentA, anchor: A, away: C },
    { kind: 'label', text: n.tangentB, anchor: B, away: C },
  ];
  if (spec.angleLabel) elements.push(...angleMark(O, [E, D], spec.angleLabel));

  return {
    scene: { elements },
    claims: [
      { kind: 'length', from: O, to: C, value: r, shown: false },
      { kind: 'length', from: O, to: D, value: r, shown: false },
      { kind: 'length', from: O, to: E, value: r, shown: false },
      { kind: 'angle', at: O, arms: [E, D], value: toE, shown: true },
      // the two facts the working rests on, stated rather than measured
      { kind: 'angle', at: C, arms: [A, O], value: 90, shown: false },
      { kind: 'angle', at: O, arms: [C, D], value: 180, shown: false },
      // and the answer's own geometry: A is the tangent end on the far side
      // from E, so the angle asked for is the obtuse one. Picking the other
      // end would give its supplement and look entirely reasonable.
      { kind: 'angle', at: C, arms: [A, E], value: 90 + toE / 2, shown: false },
    ],
  };
}
