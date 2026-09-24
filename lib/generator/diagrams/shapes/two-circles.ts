import {
  type Element, type Figure, type Pt, bearing, dimensionArrow, mid, pt, sideLabel,
} from '../scene';

/**
 * The three two-circle figures, each read off its paper diagram rather than
 * inferred from the wording — the wording alone was not enough for any of them.
 *
 *   overlap    2024 P2 Q10, a door-number sign: two whole circles sharing the
 *              chord AB, so the width across both is 2(r + d).
 *
 *   half-turn  2017 P2 Q13, a logo: two major segments with half-turn symmetry
 *              about the midpoint of AB. AB is 48 cm with a radius of only
 *              14 cm, which is impossible for a chord — the picture shows AB is
 *              the *combined* straight edge, so each chord is half of it and the
 *              height is 2(r + d).
 *
 *   snowman    2019 P2 Q18: AB is a diameter of the head and a chord of the
 *              body, and the body's centre T sits on the head's circumference.
 *              That fixes the body's radius at r√2, which is the step the marks
 *              are for.
 */

export type TwoCircleKind = 'overlap' | 'half-turn' | 'snowman';

export interface TwoCirclesSpec {
  kind: TwoCircleKind;
  /** The radius given in the question. */
  radius: number;
  /** The chord given in the question — for the snowman this is the diameter. */
  chord: number;
  /**
   * `top` and `bottom` letter the far ends of the snowman's axis — the top of
   * the head and the foot of the body. 2019 P2 Q18 letters them C and D and
   * asks for "CD", so they are the two points its question is about.
   */
  names: { a: string; b: string; centre: string; centre2?: string; top?: string; bottom?: string };
  labels: { radius: string; chord: string };
}

export function twoCircles(spec: TwoCirclesSpec): Figure | null {
  const r = spec.radius;
  const elements: Element[] = [];
  const claims: Figure['claims'] = [];
  const printed = (s: string) => /\d/.test(s);
  const { a: NA, b: NB, centre: NC, centre2: NC2 } = spec.names;

  if (spec.kind === 'overlap') {
    // AB vertical, the two centres left and right of it
    const half = spec.chord / 2;
    if (half >= r) return null;
    const d = Math.sqrt(r * r - half * half);
    const A = pt(0, half), B = pt(0, -half);
    const C1 = pt(-d, 0), C2 = pt(d, 0);
    elements.push(
      { kind: 'circle', centre: C1, r },
      { kind: 'circle', centre: C2, r },
      { kind: 'segment', from: A, to: B, dashed: true },
      { kind: 'segment', from: A, to: C2, dashed: true },
      { kind: 'label', text: NA, anchor: A, away: pt(0, 0) },
      { kind: 'label', text: NB, anchor: B, away: pt(0, 0) },
      { kind: 'label', text: NC, anchor: C2, away: pt(0, 0) },
    );
    if (spec.labels.chord) elements.push(sideLabel(A, B, spec.labels.chord, C2));
    if (spec.labels.radius) elements.push(sideLabel(A, C2, spec.labels.radius, pt(0, 0)));
    claims.push(
      { kind: 'length', from: A, to: B, value: spec.chord, shown: printed(spec.labels.chord) },
      { kind: 'length', from: A, to: C2, value: r, shown: printed(spec.labels.radius) },
      { kind: 'length', from: B, to: C2, value: r, shown: false },
    );
    return { scene: { elements, labelsMayCrossCurves: true }, claims };
  }

  if (spec.kind === 'half-turn') {
    // AB horizontal, each half of it the chord of one segment; the upper
    // segment bulges above its chord, the lower one below, so the whole figure
    // turns onto itself through half a revolution about the midpoint of AB
    const each = spec.chord / 2;
    const half = each / 2;
    if (half >= r) return null;
    const d = Math.sqrt(r * r - half * half);
    const A = pt(-each, 0), M = pt(0, 0), B = pt(each, 0);
    const C1 = pt(-half, -d), C2 = pt(half, d);
    // Each shape is the *major* segment — most of a circle, cut off by its
    // chord. An arc sweeps anticlockwise from `from` to `to`, so the endpoints
    // have to be given in the order that takes the long way round: swap them
    // and the shape becomes a sliver. Taking C1's the same way round as C2's
    // drew one shape as 300 degrees of circle and the other as 60, which is
    // not "two identical shapes" and is what the paper's own picture shows.
    const arc = (centre: Pt, from: Pt, to: Pt) =>
      ({ kind: 'arc' as const, centre, r, from: bearing(centre, from), to: bearing(centre, to) });
    const sweep = (a: Element & { kind: 'arc' }) => ((a.to - a.from) % 360 + 360) % 360;
    const upper = arc(C2, B, M);
    const lower = arc(C1, A, M);
    // the two shapes are congruent, so a direction error shows as unequal sweeps
    if (Math.abs(sweep(upper) - sweep(lower)) > 0.5) return null;
    elements.push(
      lower,
      upper,
      { kind: 'segment', from: A, to: M },
      { kind: 'segment', from: M, to: B },
      // The radius to B, only where the paper draws it. 2017 P2 Q13 draws no
      // radius at all — it states the 14 cm in prose — and this drew one on
      // every badge, which is the construction the first mark pays for.
      ...(spec.labels.radius ? [{ kind: 'segment' as const, from: C2, to: B, dashed: true }] : []),
      { kind: 'label', text: NA, anchor: A, away: M },
      { kind: 'label', text: NB, anchor: B, away: M },
      /**
       * **Dotted centres, a height arrow, and AB's length off the crossing.**
       * — 2026-09-23
       *
       * The paper marks each centre with a dot and draws the height as an
       * arrow beside the logo, which is what tells a pupil what "the height"
       * is. This drew neither, and wrote AB's length at M — the half-turn
       * centre, where both arcs cross AB — in 16 of 16 renders. The owner:
       * *"Yes fix"*. Above the left half of AB is the one place neither
       * shape reaches: the lower shape is the part of its circle *below* its
       * chord, and the upper circle does not come down that far out.
       *
       * **And then not at all** (2026-09-24): there it read as the length of
       * that half, and the paper writes no length on AB — the owner: *"Remove
       * the 46 label from AB as it is ambiguous and original question doesn't
       * have it"*. The caller now passes an empty chord label; the placement
       * below stays for any caller that does pass one.
       *
       * This branch draws 2017 P2 Q13 alone; the snowman (2019 P2 Q18) and
       * the overlap (2024 P2 Q10), both locked, are the other two branches.
       */
      { kind: 'dot', at: C1 },
      { kind: 'dot', at: C2 },
      { kind: 'label', text: NC, anchor: C1, away: pt(C1.x + 1, C1.y) },
      { kind: 'label', text: NC2 ?? 'C', anchor: C2, away: pt(C2.x - 1, C2.y) },
    );
    const right = Math.max(each, half + r);
    elements.push(...dimensionArrow(
      pt(right, -(d + r)), pt(right, d + r), pt(right + 1, 0), r * 0.2, 'height'));
    if (spec.labels.chord) {
      elements.push(sideLabel(pt(-each, 0), pt(0, 0), spec.labels.chord, pt(-half, -1)));
    }
    if (spec.labels.radius) elements.push(sideLabel(C2, B, spec.labels.radius, pt(0, 0)));
    claims.push(
      { kind: 'length', from: A, to: B, value: spec.chord, shown: printed(spec.labels.chord) },
      { kind: 'length', from: C2, to: B, value: r, shown: printed(spec.labels.radius) },
    );
    return { scene: { elements, labelsMayCrossCurves: true }, claims };
  }

  // snowman: the head is a whole circle of radius r, its centre S on AB; the
  // body's centre T is r below S, on the head's circumference, and AB is a
  // chord of the body too
  const S = pt(0, 0);
  const T = pt(0, -r);
  const bodyR = Math.hypot(r, r);
  const A = pt(-r, 0), B = pt(r, 0);
  // The far ends of the axis: the top of the head and the foot of the body.
  const C = pt(0, r), D = pt(0, -r - bodyR);
  elements.push(
    { kind: 'circle', centre: S, r },
    { kind: 'circle', centre: T, r: bodyR },
    { kind: 'segment', from: A, to: B, dashed: true },
    // **One solid line the whole way down, C through S and T to D** — which is
    // how 2019 P2 Q18 draws it, and CD is what its question asks for. This drew
    // a short dashed S-to-T instead, with no C and no D, so the figure did not
    // contain the segment the question names.
    { kind: 'segment', from: C, to: D },
    // S and T sit one above the other on the axis, so their labels are pushed
    // sideways in opposite directions rather than up and down into each other
    { kind: 'label', text: NC, anchor: S, away: pt(-r, 0) },
    { kind: 'label', text: NC2 ?? 'T', anchor: T, away: pt(r, -r) },
    { kind: 'label', text: NA, anchor: A, away: S },
    { kind: 'label', text: NB, anchor: B, away: S },
    ...(spec.names.top ? [{ kind: 'label' as const, text: spec.names.top, anchor: C, away: S }] : []),
    ...(spec.names.bottom ? [{ kind: 'label' as const, text: spec.names.bottom, anchor: D, away: T }] : []),
  );
  // The diameter is not drawn on the paper's diagram, and cannot be: its
  // midpoint is S, so the measurement would sit on top of the centre's label.
  // The prose carries it, exactly as the paper does.
  claims.push(
    { kind: 'length', from: A, to: B, value: spec.chord, shown: printed(spec.labels.chord) },
    { kind: 'length', from: S, to: T, value: r, shown: false },
  );
  return { scene: { elements, labelsMayCrossCurves: true }, claims };
}

export { mid };
