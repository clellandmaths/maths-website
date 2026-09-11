import { type Element, type Figure, type Pt, pt, scale } from '../scene';

/**
 * A regular polygon on a circle, with a diameter from one vertex.
 *
 * 2019 P1 Q11: a regular pentagon ABCDE on a circle centre O, AF a diameter,
 * and the design finished with the triangle EBF. The angle at F is asked for.
 *
 * The number of sides has to be odd, or the far end of the diameter lands on a
 * vertex and there is no F to name. The circle is dashed, as the paper draws
 * it: it is construction, not part of the logo.
 *
 * The whole question is that the vertices divide the turn equally, so the
 * angle at the centre between neighbours is 360/n, the rest of the straight
 * line is 180 - 360/n, and the isosceles triangle the two radii make gives the
 * answer as 180/n.
 */

export interface PolygonDiameterSpec {
  sides: number;
  radius: number;
  /** Where the first vertex sits, anticlockwise from east. */
  start: number;
  /** One letter per vertex, in order round the shape. */
  names: string[];
  /** The letter for the far end of the diameter. */
  far: string;
  centre: string;
}

const dir = (deg: number): Pt =>
  pt(Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180));

export function polygonDiameter(spec: PolygonDiameterSpec): Figure | null {
  const { sides: n, radius: r, start } = spec;
  // even and the diameter ends on a vertex; the answer stops being whole
  // outside 5 and 9 anyway
  if (n % 2 === 0 || n < 5 || n > 9 || r <= 0 || spec.names.length !== n) return null;

  const step = 360 / n;
  const O = pt(0, 0);
  const V = Array.from({ length: n }, (_, i) => scale(dir(start + i * step), r));
  const F = scale(dir(start + 180), r);
  const side = 2 * r * Math.sin(Math.PI / n);
  const [B, E] = [V[1], V[n - 1]];

  const elements: Element[] = [
    // the design's own shading, first, so every line is drawn over it
    { kind: 'shadedShape', points: [B, E, F] },
    { kind: 'circle', centre: O, r, dashed: true },
    { kind: 'polygon', points: V },
    // the diameter in two pieces, so the centre is an endpoint and can carry
    // its own letter
    { kind: 'segment', from: V[0], to: O },
    { kind: 'segment', from: O, to: F },
    // the rest of the design: the triangle the paper shades
    { kind: 'segment', from: E, to: B },
    { kind: 'segment', from: E, to: F },
    { kind: 'segment', from: B, to: F },
    ...V.map((p, i): Element => ({ kind: 'label', text: spec.names[i], anchor: p, away: O })),
    { kind: 'label', text: spec.far, anchor: F, away: O },
    // Two lines leave the centre and they are opposite each other, so the
    // letter goes square off the diameter — along it there is nowhere to sit.
    { kind: 'label', text: spec.centre, anchor: O, away: scale(dir(start + 90), r * 0.4) },
  ];

  return {
    scene: { elements },
    claims: [
      ...V.map((p) => ({ kind: 'length' as const, from: O, to: p, value: r, shown: false })),
      { kind: 'length', from: O, to: F, value: r, shown: false },
      // every side equal is what makes it regular, and the equal angles at the
      // centre follow from that
      ...V.map((p, i) => ({
        kind: 'length' as const, from: p, to: V[(i + 1) % n], value: side, shown: false,
      })),
      { kind: 'angle', at: O, arms: [V[0], V[1]], value: step, shown: false },
      // the diameter really is one, which is the step that turns the angle at
      // the centre into the angle beside it
      { kind: 'angle', at: O, arms: [V[0], F], value: 180, shown: false },
      // and the answer's own geometry
      { kind: 'angle', at: F, arms: [O, B], value: 180 / n, shown: false },
    ],
  };
}
