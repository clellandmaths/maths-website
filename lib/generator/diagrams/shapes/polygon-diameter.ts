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
  /**
   * Draw the polygon BEFORE the design is added — the paper's first figure.
   *
   * **2019 P1 Q11 prints two diagrams and the clone printed one.** The first
   * is the bare polygon on its circle with every radius dashed in to a dotted
   * centre; the second adds the diameter, the chords and the shading. The
   * owner, looking at both: *"I wonder if we do what the paper does and show
   * the polygon before the shape is added? ... you can clearly see what the
   * adding does to the original diagram and where angles you have might work
   * something out."*
   *
   * That first figure is where the whole question comes from. The first mark
   * is `AOB = 360/n`, and the dashed radii are what make the turn visibly
   * divided into n equal parts. Without them a pupil has to know to imagine
   * them — which is exactly the gap the owner spotted.
   *
   * The second figure does not draw the radii, here or in the paper: by then
   * they have served their purpose and the design is what matters.
   */
  plain?: boolean;
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

  // ── the paper's FIRST figure: the polygon as it is drawn, before the
  //    design. Every radius dashed to a dotted centre, which is what shows
  //    the turn divided into n equal parts. See `plain` on the spec.
  if (spec.plain) {
    return {
      scene: {
        elements: [
          { kind: 'circle', centre: O, r, dashed: true },
          { kind: 'polygon', points: V },
          ...V.map((p): Element => ({ kind: 'segment', from: O, to: p, dashed: true })),
          { kind: 'dot', at: O, small: true },
          ...V.map((p, i): Element => ({ kind: 'label', text: spec.names[i], anchor: p, away: O })),
          // no diameter here, so the letter can sit straight below the centre
          //
          // **Except that a nonagon's gap there is only 40 degrees**, and the
          // letter pushed off O sat on the dashed radii in every nonagon draw.
          // The owner, on the 2019 re-review sheet: "Just move the O". So for
          // more than five sides it sits further out, centred in the gap where
          // it has widened; the pentagon, whose gap is 72, is drawn as before.
          n > 5
            ? { kind: 'label', text: spec.centre, anchor: scale(dir(start + 180), r * 0.3), away: O, centred: true }
            : { kind: 'label', text: spec.centre, anchor: O, away: scale(dir(start), r * 0.4) },
        ],
      },
      claims: [
        ...V.map((p) => ({ kind: 'length' as const, from: O, to: p, value: r, shown: false })),
        ...V.map((p, i) => ({
          kind: 'length' as const, from: p, to: V[(i + 1) % n], value: side, shown: false,
        })),
        { kind: 'angle', at: O, arms: [V[0], V[1]], value: step, shown: false },
      ],
    };
  }

  /**
   * **The design runs E to O to B, not E straight to B — and the shaded shape
   * is the arrowhead EOBF with its notch at the centre.**
   *
   * This drew a single chord `E–B` and shaded the triangle `EBF`. Counted off
   * the paper's second diagram: two of the radii dashed in the first diagram,
   * `OE` and `OB`, are **filled in solid** as part of the design, and the grey
   * region dips to a point at O. The owner: *"EO and BO clearly shown drawn on
   * the second diagram filling in the dotted lines of them from the first
   * diagram."*
   *
   * That is the whole design: the polygon, the diameter through O, the two
   * radii drawn in, and the two chords down to F.
   *
   * **Read off the scan three times before it was right.** The first reading
   * missed the paper's first diagram entirely; the second read this boundary
   * as a straight `E–B` passing above O. It is not — it meets O.
   */
  const elements: Element[] = [
    // the design's own shading, first, so every line is drawn over it
    { kind: 'shadedShape', points: [E, O, B, F] },
    { kind: 'circle', centre: O, r, dashed: true },
    { kind: 'polygon', points: V },
    // the diameter in two pieces, so the centre is an endpoint and can carry
    // its own letter
    { kind: 'segment', from: V[0], to: O },
    { kind: 'segment', from: O, to: F },
    // the two radii the design fills in, then the chords down to the far point
    { kind: 'segment', from: E, to: O },
    { kind: 'segment', from: O, to: B },
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
