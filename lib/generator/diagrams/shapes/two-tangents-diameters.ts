import { type Element, type Figure, type Pt, type Scene, add, angleMark, bearing, dist, mid, pt, scale, shadeAngle, sub } from '../scene';
import { place } from '../render';
import { verifyFigure } from '../verify';

/**
 * Two tangents meeting outside the circle, each crossing the other's diameter.
 *
 * 2024 P1 Q10: AC touches at B and CE touches at D; BF and DG are diameters;
 * BF produced meets the far tangent at E and DG produced meets the near one at
 * A. The angle at F between the chord FD and the diameter produced is given,
 * and the angle between the two tangents is asked for.
 *
 * It is the whole family in one picture — an inscribed angle, two diameters,
 * two radii meeting tangents at right angles — and every point in it follows
 * from the angle at the centre between the two radii:
 *
 *   C sits on its bisector, at r / cos(half of it)
 *   A and E sit where each diameter produced meets the other tangent,
 *   at r / cos(180 - it)
 *
 * so that angle cannot approach a right angle from above: at 90 the diameters
 * never meet the tangents at all, and A and E are not on the page.
 */

export interface TwoTangentsDiametersSpec {
  radius: number;
  /** Where the first point of contact sits, anticlockwise from east. */
  start: number;
  /** The angle at the centre between the two radii to the points of contact. */
  atCentre: number;
  /** A frame of its own, in pixels across the geometry. */
  target?: number;
  /** Ceiling on the adaptive frame, as a multiple of the shared width. */
  frameCap?: number;
  /** Which way round the second point of contact goes. */
  flip: boolean;
  /**
   * Write the given angle's size at F, as the paper does. Opt-in; `null` when
   * this layout has no room for it (see the end of the routine).
   */
  written?: boolean;
  names: { centre: string; touchB: string; touchD: string; outside: string;
           oppB: string; oppD: string; endA: string; endE: string };
}

const dir = (deg: number): Pt =>
  pt(Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180));

export function twoTangentsDiameters(spec: TwoTangentsDiametersSpec): Figure | null {
  const { radius: r, start, atCentre: k } = spec;
  const s = spec.flip ? -1 : 1;
  // Below 90 the diameters run parallel to the tangents they are meant to
  // cross and A and E do not exist. The real limits are tighter and were
  // measured rather than reasoned: every angle at the centre from 106 to 136
  // draws cleanly at every orientation, and past 136 the diameter's production
  // is too short to carry a letter.
  /**
   * 104 to 146, and both ends are measurements rather than taste.
   *
   * Below 104 the circle falls under a third of the width of the drawing - at
   * 98 it is 21% - and the figure reads as a small circle with big triangles
   * round it rather than as the paper's. At 104 it is 33%, at the paper's own
   * 110 it is 44%, and from 116 up it settles around 55%. 2024 P1 Q10's own
   * figure is 59%.
   *
   * Above 146 the produced diameters run out of room even with the frame
   * doing what it can.
   *
   * It was 106 to 136, with the generator taking only 118 to 136 - a floor the
   * note there recorded as "set by eye" - so **the paper's own 125, which
   * needs 110, was outside what this could draw**.
   */
  if (r <= 0 || k < 104 || k > 146) return null;

  const O = pt(0, 0);
  const B = scale(dir(start), r);
  const D = scale(dir(start + s * k), r);
  const F = scale(dir(start + 180), r);            // opposite B
  const G = scale(dir(start + s * k + 180), r);    // opposite D
  const out = r / Math.cos((180 - k) * Math.PI / 180);
  const E = scale(dir(start + 180), out);          // BF produced, meeting CD
  const A = scale(dir(start + s * k + 180), out);  // DG produced, meeting CB
  const C = scale(dir(start + s * k / 2), r / Math.cos(k / 2 * Math.PI / 180));
  const n = spec.names;
  // where the bisector of the angle at F crosses the tangent it is measured
  // against: it divides DE in the ratio of the two arms
  const bisects = add(D, scale(sub(E, D), dist(F, D) / (dist(F, D) + dist(F, E))));

  const elements: Element[] = [
    // shaded first, so every line is drawn over it
    shadeAngle(C, [B, D]),
    { kind: 'circle', centre: O, r },
    // **The centre is marked.** 2024 P1 Q10 puts a filled dot at O, and four
    // lines leave it, so without one the letter O floats in the middle of a
    // crossing with nothing saying which crossing it names. The same ruling
    // that put dots on `polygon-point`, `polygon-in-circle` and
    // `tangent-reflex`; this figure was missed at the time.
    { kind: 'dot', at: O },
    // each tangent in two pieces, so its point of contact is an endpoint
    { kind: 'segment', from: A, to: B },
    { kind: 'segment', from: B, to: C },
    { kind: 'segment', from: E, to: D },
    { kind: 'segment', from: D, to: C },
    // each diameter in two, and then its production to the far tangent
    { kind: 'segment', from: B, to: O },
    { kind: 'segment', from: O, to: F },
    { kind: 'segment', from: F, to: E },
    { kind: 'segment', from: D, to: O },
    { kind: 'segment', from: O, to: G },
    { kind: 'segment', from: G, to: A },
    // the chord the inscribed angle stands on, and the chord joining the two
    // points of contact
    { kind: 'segment', from: D, to: F },
    { kind: 'segment', from: B, to: D },
    { kind: 'label', text: n.touchB, anchor: B, away: O },
    { kind: 'label', text: n.touchD, anchor: D, away: O },
    /**
     * **Outside the circle, like every other point on it.**
     *
     * The owner, twice on the 2026-2023 sign-off sheet: *"G and F labels
     * unreadable move to outside of circle"*, and *"Move f and g to outside of
     * circle, original question had labels outside"*. Measured off the clone's
     * own SVG, F and G sat 73.3 from a centre of radius 76.3 - a hair *inside*
     * the arc and on top of it - while B and D sat outside at 91. On 2024 P1
     * Q10's figure all four are outside.
     *
     * They were pushed square off the nearby tangent, which reads as the
     * careful thing to do and sends them inward, because the tangent is the
     * side away from the circle.
     *
     * **Away from the centre is the obvious repair and it is the wrong one.**
     * F is the far end of B's diameter, so O, F and E lie very nearly on one
     * line; pushing F away from O carries its letter straight along FE, and
     * across 96 layouts *not one* verified. The pool fell from over twenty
     * questions to four, and it took `pool` to notice - drawing forty and
     * finding no failures says nothing, because the generator simply retries
     * until it lands on one of the four that work.
     *
     * Away from the **other tangent point** instead: F away from D, G away from
     * B. That is outward, because the far end of one diameter is on the
     * opposite side of the circle from the other's foot, and it is across the
     * line rather than along it. 80 of the same 96 layouts verify - better than
     * the 52 this figure managed before - and all 160 letters land outside.
     */
    { kind: 'label', text: n.oppB, anchor: F, away: D },
    { kind: 'label', text: n.oppD, anchor: G, away: B },
    { kind: 'label', text: n.endA, anchor: A, away: mid(O, B) },
    { kind: 'label', text: n.endE, anchor: E, away: mid(O, D) },
    { kind: 'label', text: n.outside, anchor: C, away: O },
    // four lines leave the centre; the quarter between the two far ends is the
    // one with no chord in it
    { kind: 'label', text: n.centre, anchor: O, away: scale(dir(start + s * k / 2), r * 0.4) },
    // The angle is marked, and written only when the spec asks (below).
    //
    // A number goes along its own bisector, and this bisector has nowhere to
    // put one. F is on the circle, so close to F the number is on the outline;
    // the far tangent runs D to E and closes the angle into a triangle, so far
    // from F it is on the tangent; and the arc DF bulges into what is left.
    // Measured across every angle at the centre from 104 to 144, the only
    // radii that clear all three are so large the arc spans the whole triangle
    // and reads as another outline. The paper can print the number because its
    // figure is not drawn to scale. This one is, so the arc says which angle
    // and the question says how big — which is how the papers mark plenty of
    // angles they have no room to write in.
    ...(spec.written ? [] : angleMark(F, [D, E])),
  ];

  /**
   * A frame of its own, sized to how far the figure reaches.
   *
   * C sits at `r / cos(k/2)` and the tangent ends beyond it, so the smaller
   * the angle at the centre the wider the whole drawing and the smaller the
   * circle has to be drawn inside it. Everything scaled to one shared width
   * meant the low end produced a circle a third of the width of its own
   * tangents, which is why the generator had a floor "set by eye" at 118 -
   * and why **the paper's own 125, which needs 110, was outside it**.
   *
   * Giving the figure a frame proportional to its reach draws the circle at a
   * sensible size whatever the angle, which is what the paper does.
   */
  const reachOut = 1 / Math.cos((180 - k) * Math.PI / 180);
  const roomForTheCircle = Math.abs(reachOut) / 1.6;

  /**
   * And room for the shortest segment, which is what squeezes the other end.
   *
   * Above 136 the pieces of the produced diameters come out around 23 to 26px
   * against a 26px minimum, while the reach term above is asking for nothing
   * because the figure is compact. Measuring the shortest segment asks for the
   * quantity the checker actually complains about, rather than guessing at
   * another constant.
   */
  const SHORTEST_WANTED = 32;
  const ends = elements.flatMap(e => (e.kind === 'segment' ? [e.from, e.to] : []));
  const span = Math.max(
    Math.max(...ends.map(q => q.x)) - Math.min(...ends.map(q => q.x)),
    Math.max(...ends.map(q => q.y)) - Math.min(...ends.map(q => q.y)), 1e-9);
  const shortest = Math.min(...elements.flatMap(e => (e.kind === 'segment'
    ? [Math.hypot(e.to.x - e.from.x, e.to.y - e.from.y)] : [])));
  const roomForSegments = (SHORTEST_WANTED * span) / (shortest * 250);

  const frame = Math.min(spec.frameCap ?? 1.8,
    Math.max(1, roomForTheCircle, roomForSegments));
  const target = spec.target ?? Math.round(250 * frame);

  const claims: Figure['claims'] = [
      { kind: 'length', from: O, to: B, value: r, shown: false },
      { kind: 'length', from: O, to: D, value: r, shown: false },
      { kind: 'length', from: O, to: F, value: r, shown: false },
      { kind: 'length', from: O, to: G, value: r, shown: false },
      // the given angle, which is the inscribed one plus the straight line
      { kind: 'angle', at: F, arms: [D, E], value: 180 - k / 2, shown: true },
      // both diameters are straight, and both are produced along that same line
      { kind: 'angle', at: O, arms: [B, F], value: 180, shown: false },
      { kind: 'angle', at: O, arms: [D, G], value: 180, shown: false },
      { kind: 'angle', at: F, arms: [B, E], value: 180, shown: false },
      { kind: 'angle', at: G, arms: [D, A], value: 180, shown: false },
      // both tangents are straight, and each meets its radius square
      { kind: 'angle', at: B, arms: [A, C], value: 180, shown: false },
      { kind: 'angle', at: D, arms: [E, C], value: 180, shown: false },
      { kind: 'angle', at: B, arms: [O, C], value: 90, shown: false },
      { kind: 'angle', at: D, arms: [O, C], value: 90, shown: false },
      // the angle at the centre the working finds, and the answer it leads to
      { kind: 'angle', at: O, arms: [B, D], value: k, shown: false },
      { kind: 'angle', at: C, arms: [B, D], value: 180 - k, shown: false },
  ];

  if (!spec.written) return { scene: { elements, target }, claims };

  /**
   * **The given angle written in, as 2024 P1 Q10 prints its 125°** (the owner,
   * 2026-09-28: "The original question has the size of the angle printed on
   * the diagram", then of the first try, "the arc for the angle is a bit big
   * and is coming out the line of the triangle").
   *
   * Still to scale, so the room is what the note above says: a crescent
   * between chord FD, the diameter produced FE, the circle and side DE. A small
   * arc sits tight in the corner at F and the number goes just beyond it, and
   * a spot is kept only when all of this holds:
   *
   *   - every corner of the number inside triangle FDE and outside the circle,
   *     where the renderer actually puts it
   *   - the number clear of the arc, and the arc short of side DE
   *   - the figure verifies
   *
   * Spots are tried nearest first, a fixed list and no randomness, so the
   * figure is the same for the same draw. It fits only while the angle at the
   * centre is 122 or less (119 degrees at F): above that DE closes on F and
   * there is no room at scale, which is why the generator stops there.
   */
  const text = `${180 - k / 2}°`;
  const ARC_PX = 16;
  const cross = (o: Pt, a: Pt, b: Pt) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const inTriangle = (q: Pt, a: Pt, b: Pt, c: Pt) => {
    const d1 = cross(a, b, q), d2 = cross(b, c, q), d3 = cross(c, a, q);
    return (d1 >= 0 && d2 >= 0 && d3 >= 0) || (d1 <= 0 && d2 <= 0 && d3 <= 0);
  };
  // Where the number lands, in pixels, and whether it is inside the angle.
  const landed = (scene: Scene) => {
    const p = place(scene);
    const L = p.labels.find(l => l.text === text)!;
    const corners = [pt(L.box.x, L.box.y), pt(L.box.x + L.box.w, L.box.y),
      pt(L.box.x, L.box.y + L.box.h), pt(L.box.x + L.box.w, L.box.y + L.box.h)];
    const perUnit = dist(p.px(O), p.px(pt(r, 0))) / r;
    const inside = corners.every(c => inTriangle(c, p.px(F), p.px(D), p.px(E))
      && dist(c, p.px(O)) > r * perUnit + 2);
    return { p, corners, perUnit, inside };
  };
  const fromE = bearing(F, E), toD = bearing(F, D);
  let sweep = ((toD - fromE) % 360 + 360) % 360;
  let turn = 1;
  if (sweep > 180) { sweep = 360 - sweep; turn = -1; }

  for (const d of [0.08, 0.1, 0.12, 0.14, 0.16, 0.2, 0.24, 0.28, 0.32]) {
    for (const t of [0.35, 0.25, 0.45, 0.15, 0.55]) {
      const deg = (fromE + turn * sweep * t) * Math.PI / 180;
      const label: Element = { kind: 'label', text, anchor: add(F, scale(pt(Math.cos(deg), Math.sin(deg)), d * r)),
        away: F, small: true };
      const probe = landed({ elements: [...elements, ...angleMark(F, [D, E]), label], target });
      if (!probe.inside) continue;
      const pF = probe.p.px(F), pD = probe.p.px(D), pE = probe.p.px(E);
      const toDE = Math.abs((pE.x - pD.x) * (pD.y - pF.y) - (pD.x - pF.x) * (pE.y - pD.y)) / dist(pD, pE);
      if (Math.min(...probe.corners.map(c => dist(c, pF))) < ARC_PX + 6) continue;
      const a = ARC_PX / probe.perUnit;
      if (ARC_PX > toDE - 5 || a > 0.85 * Math.min(dist(F, D), dist(F, E))) continue;
      const out: Figure = { scene: { elements: [...elements, ...angleMark(F, [D, E], undefined, a), label], target }, claims };
      if (verifyFigure(out).length || !landed(out.scene).inside) continue;
      return out;
    }
  }
  return null;
}
