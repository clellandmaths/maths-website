import {
  type Element, type Figure, type Pt, centroid, pt, sideLabel,
} from '../scene';

/**
 * Two triangles standing apart, **drawn to one scale**, each with its own three
 * sides written on it.
 *
 * This is the first of the two figures 2017 P2 Q7 prints; the second is the
 * pair joined along their common edge and drawn bare, which `triangleFromSides`
 * produces from a cevian with empty labels.
 *
 * **They share a scene so that they share a scale.** Drawing them as two
 * separate figures was tried first and is simpler — each gets its own viewBox
 * and its own turn, and the labels never have to clear anything across the
 * gap — but each figure is then scaled to fill its own box, so a 6-7-8 triangle
 * and a 16-19-7 triangle come out the same size on the page. The paper draws A
 * visibly smaller than B, and that relative size is the cue that they fit
 * together: a pupil reads "these two make that one" off the picture before
 * reading a single number. One scene keeps it.
 *
 * What one scene costs, and how each cost is paid:
 *
 *   the two face each other across a gap, and the shared edge's length is
 *   written on both  ->  the gap is a fraction of the *scene*, not of one
 *   triangle, so it grows with the pair rather than with the smaller of them
 *
 *   each triangle is half the width it would have alone, so its own labels
 *   are relatively larger  ->  the caller searches turns, four for each
 *   triangle, and takes the first pair that verifies
 *
 *   a letter naming a region cannot be pushed off its anchor  ->  `centred`,
 *   seated at the incentre
 */

export interface TriangleSpec {
  /** The three sides, in the order they are drawn: base, right, left. */
  sides: [number, number, number];
  /** What to write on each, in the same order. Empty leaves it bare. */
  labels: [string, string, string];
  /** The letter inside, naming the triangle to the prose. */
  name: string;
  /** Which quarter-turn to draw it at. */
  turn?: 0 | 1 | 2 | 3;
}

export interface TwoTrianglesApartSpec {
  left: TriangleSpec;
  right: TriangleSpec;
}

/** One triangle's three corners, from its three side lengths. */
function corners(sides: [number, number, number], turn: 0 | 1 | 2 | 3): [Pt, Pt, Pt] | null {
  const [ab, bc, ca] = sides;
  if (ab + bc <= ca || bc + ca <= ab || ca + ab <= bc) return null;
  const cx = (ab * ab + ca * ca - bc * bc) / (2 * ab);
  const cySq = ca * ca - cx * cx;
  if (cySq <= 0) return null;
  const rot = (p: Pt): Pt => {
    switch (turn) {
      case 1: return pt(-p.y, p.x);
      case 2: return pt(-p.x, -p.y);
      case 3: return pt(p.y, -p.x);
      default: return p;
    }
  };
  return [pt(0, 0), pt(ab, 0), pt(cx, Math.sqrt(cySq))].map(rot) as [Pt, Pt, Pt];
}

/** The incentre — the point furthest from all three sides. */
function incentre(ps: [Pt, Pt, Pt], sides: [number, number, number]): Pt {
  const [P, Q, S] = ps;
  // each vertex weighted by the side opposite it
  const [wP, wQ, wS] = [sides[1], sides[2], sides[0]];
  const t = wP + wQ + wS;
  return pt((P.x * wP + Q.x * wQ + S.x * wS) / t, (P.y * wP + Q.y * wQ + S.y * wS) / t);
}

export function twoTrianglesApart(spec: TwoTrianglesApartSpec): Figure | null {
  const L = corners(spec.left.sides, spec.left.turn ?? 0);
  const R = corners(spec.right.sides, spec.right.turn ?? 0);
  if (!L || !R) return null;

  const spanX = (ps: Pt[]) => Math.max(...ps.map(p => p.x)) - Math.min(...ps.map(p => p.x));
  const minX = (ps: Pt[]) => Math.min(...ps.map(p => p.x));

  /**
   * The gap, measured against the **pair** rather than against either one.
   *
   * A gap set as a fraction of the left triangle is tiny whenever the left
   * triangle is the small one — which, for these questions, it usually is — and
   * that is exactly when the two "7 cm"s have least room between them. Half the
   * combined width is generous on the page and still leaves each triangle a
   * third of it.
   */
  const gap = (spanX(L) + spanX(R)) / 2;

  // Both are moved so the left starts at the origin and the right starts a gap
  // beyond where the left ends, whatever turn each was drawn at.
  const shiftBy = (ps: [Pt, Pt, Pt], dx: number): [Pt, Pt, Pt] =>
    ps.map(p => pt(p.x + dx, p.y)) as [Pt, Pt, Pt];
  const lp = shiftBy(L, -minX(L));
  const rp = shiftBy(R, -minX(R) + spanX(L) + gap);

  const elements: Element[] = [];
  const claims: Figure['claims'] = [];

  for (const [ps, t] of [[lp, spec.left], [rp, spec.right]] as const) {
    const [P, Q, S] = ps;
    const inside = centroid([P, Q, S]);
    elements.push({ kind: 'polygon', points: [P, Q, S] });
    elements.push({
      kind: 'label', text: t.name, anchor: incentre(ps, t.sides), away: S, centred: true,
    });

    const sidesOf: [Pt, Pt][] = [[P, Q], [Q, S], [S, P]];
    sidesOf.forEach(([a, b], i) => {
      if (t.labels[i]) elements.push(sideLabel(a, b, t.labels[i], inside));
      claims.push({
        kind: 'length', from: a, to: b, value: t.sides[i],
        shown: /\d/.test(t.labels[i]),
      });
    });
  }

  return { scene: { elements }, claims };
}
