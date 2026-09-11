import { type Element, type Figure, type Pt, add, angleMark, centroid, pt, scale, shadeAngle } from '../scene';

/**
 * A diameter produced until it meets the tangent at another point.
 *
 * 2017 P1 Q9: DC is a diameter, produced beyond C to A; AB touches the circle
 * at B and runs on to E; the tangent-chord angle at B is given and the angle at
 * A is asked for.
 *
 * The picture is a right-angled triangle OBA with the circle drawn through B
 * and through the two ends of the diameter, so where A sits is not free: it is
 * exactly where the tangent crosses the diameter produced, at
 *
 *     OA = r / cos(angle BOA)
 *
 * and that is why the angle at the centre has to stay well inside a right
 * angle. As it approaches 90 the two lines become parallel and A runs off the
 * page.
 */

export interface TangentMeetsDiameterSpec {
  radius: number;
  /** Where the far end of the diameter sits, anticlockwise from east. */
  start: number;
  /** The tangent-chord angle at the point of contact. */
  given: number;
  /** Which side of the diameter the point of contact goes. */
  flip: boolean;
  /** How far the tangent runs beyond the point of contact. */
  reach: number;
  /**
   * How wide to draw the angle mark, as a fraction of the circle's radius.
   *
   * `angleMark` defaults to 0.22 of the shorter arm, and the shorter arm here
   * is the tangent stub - so the mark's size was set by how far the tangent
   * happened to be drawn, which has nothing to do with anything. It matters
   * because the tangent-chord wedge **always contains the circle's own minor
   * arc**: that is what the angle subtends. Near the point of contact the arc
   * hugs the tangent, so a small mark puts the number in the tightest part of
   * the wedge.
   */
  markRadius?: number;
  /** A frame of its own, in pixels across the geometry. */
  target?: number;
  /** Ceiling on the adaptive frame, as a multiple of the shared width. */
  frameCap?: number;
  names: { centre: string; contact: string; far: string; near: string;
           outside: string; tangentEnd: string };
}

const dir = (deg: number): Pt =>
  pt(Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180));

export function tangentMeetsDiameter(spec: TangentMeetsDiameterSpec): Figure | null {
  const { radius: r, start, given: t, reach } = spec;
  const s = spec.flip ? -1 : 1;
  // the angle at the centre in triangle OBA, which is what puts A somewhere
  // reachable
  const atO = 180 - 2 * t;
  if (r <= 0 || reach <= 0 || atO < 20 || atO > 75) return null;

  const O = pt(0, 0);
  const D = scale(dir(start), r);              // the far end of the diameter
  const C = scale(dir(start + 180), r);        // the near end, between O and A
  const B = scale(dir(start + s * 2 * t), r);  // the point of contact
  const A = scale(dir(start + 180), r / Math.cos(atO * Math.PI / 180));
  const n = spec.names;

  // the tangent carries on past B, so that the line touches the circle rather
  // than stopping at it
  const along = pt(B.x - A.x, B.y - A.y);
  const tangentEnd = add(B, scale(along, reach * r / Math.hypot(along.x, along.y)));

  const elements: Element[] = [
    shadeAngle(A, [C, B]),
    { kind: 'circle', centre: O, r },
    // the diameter and its production, in three pieces, so the centre and the
    // near end are both endpoints and may carry their own letters
    { kind: 'segment', from: D, to: O },
    { kind: 'segment', from: O, to: C },
    { kind: 'segment', from: C, to: A },
    { kind: 'segment', from: A, to: B },
    { kind: 'segment', from: B, to: tangentEnd },
    { kind: 'segment', from: O, to: B },
    { kind: 'segment', from: D, to: B },
    { kind: 'segment', from: C, to: B },
    { kind: 'label', text: n.far, anchor: D, away: O },
    { kind: 'label', text: n.contact, anchor: B, away: O },
    // the near end sits on the line, so its letter is pushed square off it
    // rather than along it
    { kind: 'label', text: n.near, anchor: C, away: B },
    { kind: 'label', text: n.outside, anchor: A, away: centroid([O, B, A]) },
    { kind: 'label', text: n.tangentEnd, anchor: tangentEnd, away: B },
    // three lines leave the centre; the widest gap between them is the one
    // spanned by the angle at the centre the working is about
    { kind: 'label', text: n.centre, anchor: O, away: scale(dir(start + s * t + 180), r * 0.4) },
    ...angleMark(B, [D, tangentEnd], `${t}°`, (spec.markRadius ?? 0.22) * r),
  ];

  /**
   * A frame of its own, sized to what this particular angle needs.
   *
   * A sits at `OA = r / cos(angle BOA)`, so the given angle decides the whole
   * shape of the drawing, and it squeezes it from both ends:
   *
   * - **a small given angle throws A far out.** The circle is then drawn small
   *   to fit A in, and everything inside it shrinks with it - including the
   *   tangent-chord number, which sits in the wedge between the tangent and
   *   the chord, and that wedge always contains the circle's own minor arc.
   *   That is what the angle subtends. At the shared width the number could
   *   not clear the arc below 61 degrees, so **the paper's own 58 was one of
   *   the angles this figure could not draw**.
   * - **a large given angle brings A in on top of C**, until the piece of the
   *   diameter between them is too short to draw.
   *
   * One number cannot serve both, so the frame is the larger of what each
   * needs, capped. Measured: at the shared 250 this drew 12 of the 28 angles
   * in range; sized this way it draws 22.
   */
  const reachOut = 1 / Math.cos(atO * Math.PI / 180);
  const roomForTheNumber = reachOut / 1.55;     // A far out, circle small
  const roomForCA = 0.30 / (reachOut - 1);      // A close in, CA short
  const frame = Math.min(spec.frameCap ?? 1.7, Math.max(1, roomForTheNumber, roomForCA));

  return {
    scene: { elements, target: spec.target ?? Math.round(250 * frame) },
    claims: [
      { kind: 'length', from: O, to: D, value: r, shown: false },
      { kind: 'length', from: O, to: C, value: r, shown: false },
      { kind: 'length', from: O, to: B, value: r, shown: false },
      { kind: 'angle', at: B, arms: [D, tangentEnd], value: t, shown: true },
      // a radius meets a tangent at right angles, which is where A comes from
      { kind: 'angle', at: B, arms: [O, A], value: 90, shown: false },
      // the diameter is straight, and A is on it produced — the step that turns
      // the angle at the centre into the angle in the triangle
      { kind: 'angle', at: O, arms: [D, C], value: 180, shown: false },
      { kind: 'angle', at: C, arms: [O, A], value: 180, shown: false },
      // and the tangent is one straight line through the point of contact
      { kind: 'angle', at: B, arms: [A, tangentEnd], value: 180, shown: false },
      // the answer's own geometry
      { kind: 'angle', at: A, arms: [C, B], value: 2 * t - 90, shown: false },
    ],
  };
}
