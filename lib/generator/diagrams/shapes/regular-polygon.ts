import { type Element, type Figure, type Pt, pt } from '../scene';

/**
 * A regular polygon with its long diagonals drawn in.
 *
 * 2015 P2 Q11: a hexagonal table top whose three diagonals are 40 cm each. The
 * diagonals are the whole question — they cut the shape into six triangles, and
 * each triangle has two sides of half a diagonal with sixty degrees between
 * them, so the area follows without any measuring.
 *
 * Nothing on the figure is labelled, which is how the paper draws it: the
 * length is stated in the prose. That also avoids the obvious trap, since a
 * diagonal's midpoint is the centre, where all three cross — a label placed
 * there would sit on top of every one of them.
 */

export interface RegularPolygonSpec {
  /** An even number, so the long diagonals join opposite corners. */
  sides: number;
  /** Distance from the centre to a corner. */
  radius: number;
  /** Turn the whole shape, so a flat edge is not always at the bottom. */
  turn?: number;
}

export function regularPolygon(spec: RegularPolygonSpec): Figure | null {
  const n = spec.sides;
  if (n < 4 || n % 2 !== 0 || spec.radius <= 0) return null;

  const turn = spec.turn ?? 0;
  const corner = (i: number): Pt => {
    const a = (i * 360 / n + turn) * Math.PI / 180;
    return pt(spec.radius * Math.cos(a), spec.radius * Math.sin(a));
  };
  const ps = Array.from({ length: n }, (_, i) => corner(i));

  const elements: Element[] = [
    { kind: 'polygon', points: ps },
    ...Array.from({ length: n / 2 }, (_, i): Element =>
      ({ kind: 'segment', from: ps[i], to: ps[i + n / 2], dashed: true })),
  ];

  // The side of a regular polygon and its circumradius are equal only for a
  // hexagon, so the side length is computed rather than assumed.
  const side = 2 * spec.radius * Math.sin(Math.PI / n);

  return {
    scene: { elements },
    claims: [
      // Every side the same, which is what "regular" means. Nothing prints
      // these, but the to-scale check then confirms the shape really is
      // regular rather than merely closed — and a lopsided hexagon would make
      // the six equal triangles the working depends on a fiction.
      ...ps.map((p, i) => ({
        kind: 'length' as const, from: p, to: ps[(i + 1) % n], value: side, shown: false,
      })),
      ...Array.from({ length: n / 2 }, (_, i) => ({
        kind: 'length' as const, from: ps[i], to: ps[i + n / 2],
        value: 2 * spec.radius, shown: false,
      })),
    ],
  };
}
