import {
  add, mid, pt, scale, sideLabel, type Element, type Figure, type Pt,
} from '../scene';

/**
 * A regular polygon with its vertices on a circle, one segment shaded.
 *
 * 2026 P2 Q10: a regular pentagon on a circle of radius 11, find the shaded
 * segment. The vertices divide the full turn equally, which is the whole way
 * in — 360 over the number of sides gives the angle at the centre, and from
 * there it is a sector less a triangle like any other segment.
 *
 * Unlike the hexagon routine this takes an odd number of sides happily, since
 * nothing here joins opposite corners: every chord is a side.
 */

export interface PolygonInCircleSpec {
  sides: number;
  radius: number;
  /** Where the first vertex sits, anticlockwise from east. */
  start: number;
  /** One letter per vertex, in order round the shape. */
  names: string[];
  centre: string;
  /** What to write on the radius drawn to the first vertex. */
  radiusLabel: string;
}

const dir = (deg: number): Pt =>
  pt(Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180));

export function polygonInCircle(spec: PolygonInCircleSpec): Figure | null {
  const { sides: n, radius: r, start } = spec;
  if (n < 5 || n > 10 || r <= 0 || spec.names.length !== n) return null;

  const step = 360 / n;
  const O = pt(0, 0);
  const V = Array.from({ length: n }, (_, i) => scale(dir(start + i * step), r));
  const side = 2 * r * Math.sin(Math.PI / n);

  const elements: Element[] = [
    // the shaded piece first, so every line is drawn over it
    { kind: 'shadedSegment', centre: O, r, from: start, to: start + step },
    { kind: 'circle', centre: O, r },
    // 2026 P2 Q10 marks its centre with a filled dot, so this does too.
    { kind: 'dot', at: O },
    { kind: 'polygon', points: V },
    // **A radius to every vertex, dashed, as 2026 P2 Q10 draws them.** The
    // paper rules a dashed spoke from the centre to each of A, B, C, D and E,
    // which is what shows the pupil that the five angles at the centre are
    // equal - the step the whole question turns on. Two solid ones read as
    // part of the shape and left the other three unexplained.
    ...V.map((p): Element => ({ kind: 'segment', from: O, to: p, dashed: true })),
    // the centre's name goes away from the shaded piece, which is where the
    // two radii and the arc all crowd together - and into the gap between two
    // spokes on the far side. Straight away from the shaded piece is, on an
    // odd polygon, straight down a spoke: the pentagon's O sat on a dashed
    // radius in six draws of six. The owner, 2026 re-review: "Yes".
    { kind: 'label', text: spec.centre, anchor: O,
      away: scale(dir(start + (Math.floor(180 / step) + 0.5) * step + 180), r * 0.4) },
    ...V.map((p, i): Element => ({ kind: 'label', text: spec.names[i], anchor: p, away: O })),
  ];
  if (spec.radiusLabel) {
    /**
     * **Beside the radius, which is where the paper writes it.**
     *
     * 2026 P2 Q10 puts "11 cm" hard against the dashed radius OA, so it is
     * unmistakably the radius. This pushed away from a point two thirds of
     * the way toward the shaded piece, which is far from the label's own
     * anchor, and the number drifted into the middle of the polygon where
     * it reads as the distance from the centre to an edge.
     *
     * The point to move away from is now just off the radius, a quarter of
     * the way toward the shaded piece, so the push is short and the label
     * lands next to the line it names — still on the far side from the
     * shading, where the two radii and the arc crowd together.
     */
    elements.push(sideLabel(O, V[0], spec.radiusLabel,
      add(mid(O, V[0]), scale(dir(start + step / 2), r * 0.25))));
  }

  return {
    scene: { elements },
    claims: [
      { kind: 'length', from: O, to: V[0], value: r, shown: /\d/.test(spec.radiusLabel) },
      // every other spoke is the same radius, and now every one of them is drawn
      ...V.slice(1).map(p => ({ kind: 'length' as const, from: O, to: p, value: r, shown: false })),
      // Every side equal is what makes it regular, and the equal angles at the
      // centre follow from that — which is the step the question turns on.
      ...V.map((p, i) => ({
        kind: 'length' as const, from: p, to: V[(i + 1) % n], value: side, shown: false,
      })),
      { kind: 'angle' as const, at: O, arms: [V[0], V[1]] as [Pt, Pt], value: step, shown: false },
    ],
  };
}
