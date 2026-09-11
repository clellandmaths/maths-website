import { type Element, type Figure, type Pt, pt, shadeAngle } from '../scene';

/**
 * An H shape with a regular polygon set against one of its uprights.
 *
 * 2023 P2 Q5: a logo made of an H and a regular decagon, with one side of the
 * decagon lying along the upright and the crossbar meeting it at a vertex. The
 * angle between the crossbar and the polygon's next side is asked for.
 *
 * The whole question is that the crossbar meets the upright square and the
 * upright is a side of the polygon, so the answer is a right angle plus the
 * exterior angle:
 *
 *     90 + 360/n
 *
 * Nothing here may be rotated. An H is an H, and a figure that is only correct
 * up to a turn would be wrong on the page — which is what the bearing claims
 * are for: no measurement of angles or lengths notices a diagram lying on its
 * side, and these do.
 */

export interface BarAndPolygonSpec {
  sides: number;
  /** Length of the polygon's side, which is also the part of the upright it covers. */
  side: number;
  /** How far the crossbar reaches to the other upright. */
  reach: number;
  /** Put the polygon on the left of the left upright instead. */
  mirror: boolean;
  names: { corner: string; barEnd: string; next: string };
}

export function barAndPolygon(spec: BarAndPolygonSpec): Figure | null {
  const { sides: n, side: s, reach: w } = spec;
  if (n < 5 || n > 12 || s <= 0 || w <= 0) return null;
  // the answer has to be whole, and 360/n is what decides that
  if (!Number.isInteger(360 / n)) return null;

  const m = spec.mirror ? -1 : 1;
  const at = (x: number, y: number): Pt => pt(m * x, y);

  // the polygon sits with one side on the upright, running from the corner up
  const step = 2 * Math.PI / n;
  const apothem = s / (2 * Math.tan(Math.PI / n));
  const R = s / (2 * Math.sin(Math.PI / n));
  const C = at(apothem, s / 2);
  // the corner is the lower end of that side, and the vertices run from it
  // around the far side of the polygon
  const first = Math.PI + Math.PI / n;
  const V = Array.from({ length: n }, (_, i) => at(
    apothem + R * Math.cos(first + i * step),
    s / 2 + R * Math.sin(first + i * step)));
  const Q = V[0];                             // lands exactly on the origin
  const next = V[1];
  const top = V[n - 1];                       // the other end of the side
  const ys = V.map(p => p.y);
  const [lo, hi] = [Math.min(...ys) - s * 0.2, Math.max(...ys) + s * 0.2];
  const P = at(-w, 0);
  const n_ = spec.names;

  const elements: Element[] = [
    { kind: 'polygon', points: V },
    // the upright, in the two pieces the polygon's side leaves of it
    { kind: 'segment', from: at(0, lo), to: Q },
    { kind: 'segment', from: top, to: at(0, hi) },
    // the other upright, and the bar between them
    { kind: 'segment', from: at(-w, lo), to: at(-w, hi) },
    { kind: 'segment', from: P, to: Q },
    // The angle the question asks for, shaded as the paper shades it, and
    // sized against the polygon's side rather than left to the default: the
    // two arms here are a long crossbar and one short side, and a wedge scaled
    // to the shorter of those comes out a grey speck.
    shadeAngle(Q, [P, next], s * 0.55),
    { kind: 'rightAngle', at: Q, arms: [P, top] },
    { kind: 'rightAngle', at: P, arms: [Q, at(-w, hi)] },
    // the corner's letter goes in the quarter the bar and the upright leave
    // empty below it, which is the direction away from the polygon
    { kind: 'label', text: n_.corner, anchor: Q, away: C },
    { kind: 'label', text: n_.barEnd, anchor: P, away: Q },
    { kind: 'label', text: n_.next, anchor: next, away: C },
  ];

  const interior = 180 - 360 / n;
  return {
    scene: { elements },
    claims: [
      // a regular polygon: every side the same and every corner the same
      ...V.map((p, i) => ({
        kind: 'length' as const, from: p, to: V[(i + 1) % n], value: s, shown: false,
      })),
      ...V.map((p, i) => ({
        kind: 'angle' as const, at: p,
        arms: [V[(i + n - 1) % n], V[(i + 1) % n]] as [Pt, Pt],
        value: interior, shown: false,
      })),
      // the bar meets the upright square, and the upright is the polygon's side
      { kind: 'angle', at: Q, arms: [P, top], value: 90, shown: false },
      { kind: 'angle', at: P, arms: [Q, at(-w, hi)], value: 90, shown: false },
      // upright means upright: an H on its side is not an H
      { kind: 'bearing', from: Q, to: top, degrees: 90, shown: false },
      { kind: 'bearing', from: Q, to: P, degrees: spec.mirror ? 0 : 180, shown: false },
      // and the answer's own geometry
      { kind: 'angle', at: Q, arms: [P, next], value: 90 + 360 / n, shown: false },
    ],
  };
}
