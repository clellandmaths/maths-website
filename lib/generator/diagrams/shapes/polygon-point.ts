import { type Element, type Figure, type Pt, angleMark, pt, scale, sub, unit } from '../scene';

/**
 * A regular polygon with one side extended to a point outside it.
 *
 * 2018 P1 Q9 and 2025 P2 Q7 are the same picture with a different number of
 * sides: a side is produced past a vertex to a point, that point is joined back
 * to the vertex on the other side, and one angle of the triangle so formed is
 * given.
 *
 *   2018 P1 Q9  regular decagon, AKL a straight line, angle KLJ 17° -> 127°
 *   2025 P2 Q7  regular pentagon, FAB a straight line, angle EFA 65° -> 43°
 *
 * The whole question is that the extended side is *straight*: the angle inside
 * the triangle at that vertex is the polygon's exterior angle, not its interior
 * one. Nothing in the lengths says so, so the figure has to, and a bearing
 * claim asserts it.
 */

export interface PolygonPointSpec {
  /** Number of sides, 5 to 10. */
  sides: number;
  radius: number;
  /** Where the first vertex sits, anticlockwise from east. */
  start: number;
  /** One letter per vertex, in order round the shape. */
  names: string[];
  /** The point outside, on the produced side. */
  point: string;
  /** How far the point sits beyond the vertex. */
  reach: number;
  /** What to write in the angle at that point; empty leaves it unmarked. */
  angleLabel: string;
}

export function polygonPoint(spec: PolygonPointSpec): Figure | null {
  const { sides: n, radius: r, start, reach } = spec;
  if (n < 5 || n > 10 || r <= 0 || reach <= 0 || spec.names.length !== n) return null;

  const step = 360 / n;
  const V = Array.from({ length: n }, (_, i) => {
    const a = (start + i * step) * Math.PI / 180;
    return pt(r * Math.cos(a), r * Math.sin(a));
  });
  // produced past V[0], away from V[1] — so V[1], V[0] and P are one line
  const away = unit(sub(V[0], V[1]));
  const P = pt(V[0].x + away.x * reach, V[0].y + away.y * reach);
  const last = V[n - 1];
  const side = 2 * r * Math.sin(Math.PI / n);

  const elements: Element[] = [
    { kind: 'polygon', points: V },
    { kind: 'segment', from: V[0], to: P },
    { kind: 'segment', from: P, to: last },
    ...V.map((p, i): Element => ({ kind: 'label', text: spec.names[i], anchor: p, away: pt(0, 0) })),
    { kind: 'label', text: spec.point, anchor: P, away: pt(0, 0) },
  ];
  if (spec.angleLabel) elements.push(...angleMark(P, [V[0], last], spec.angleLabel));

  return {
    scene: { elements },
    claims: [
      // every side equal is what "regular" means, and the interior angle the
      // working uses follows from it
      ...V.map((p, i) => ({
        kind: 'length' as const, from: p, to: V[(i + 1) % n], value: side, shown: false,
      })),
      // The produced side really is straight. That is the whole question — the
      // angle inside the triangle at V[0] is the exterior angle, not the
      // interior one — and no length or angle above would notice if the point
      // were drawn a few degrees off the line.
      // Stated as a straight angle rather than as two measured directions.
      // Deriving the directions from the points just plotted would compare the
      // drawing with itself and agree whatever happened; 180 is an intent the
      // construction has to live up to.
      { kind: 'angle' as const, at: V[0], arms: [P, V[1]] as [Pt, Pt], value: 180, shown: false },
    ],
  };
}
