import { type Element, type Figure, type Pt, pt, scale, sideLabel } from '../scene';

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
    { kind: 'polygon', points: V },
    { kind: 'segment', from: O, to: V[0] },
    { kind: 'segment', from: O, to: V[1] },
    // the centre's name goes away from the shaded piece, which is where the
    // two radii and the arc all crowd together
    { kind: 'label', text: spec.centre, anchor: O, away: scale(dir(start + step / 2), r * 0.4) },
    ...V.map((p, i): Element => ({ kind: 'label', text: spec.names[i], anchor: p, away: O })),
  ];
  if (spec.radiusLabel) {
    // pushed away from the middle of the triangle it borders, not onto it
    elements.push(sideLabel(O, V[0], spec.radiusLabel,
      pt((V[0].x + V[1].x) / 3, (V[0].y + V[1].y) / 3)));
  }

  return {
    scene: { elements },
    claims: [
      { kind: 'length', from: O, to: V[0], value: r, shown: /\d/.test(spec.radiusLabel) },
      { kind: 'length', from: O, to: V[1], value: r, shown: false },
      // Every side equal is what makes it regular, and the equal angles at the
      // centre follow from that — which is the step the question turns on.
      ...V.map((p, i) => ({
        kind: 'length' as const, from: p, to: V[(i + 1) % n], value: side, shown: false,
      })),
      { kind: 'angle' as const, at: O, arms: [V[0], V[1]] as [Pt, Pt], value: step, shown: false },
    ],
  };
}
