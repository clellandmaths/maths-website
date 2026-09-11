import {
  type Element, type Figure, type Pt, angleAt, angleMark, centroid, dist, mid, pt,
  sideLabel,
} from '../scene';

/**
 * A triangle built from its three side lengths.
 *
 * For the converse questions — "is this triangle right-angled? justify your
 * answer" — and deliberately **without a right-angle mark**, because whether
 * there is one is the answer. That is the whole difference between this and
 * the right-triangle routine, and drawing it wrong would give the mark away.
 *
 * The triangle is placed from the lengths themselves, so it is exactly to
 * scale. That is the honest way round: SQA's numbers are usually close to a
 * Pythagorean triple either way (88, 105, 137 against a true 137.06...), so a
 * pupil cannot settle it by eye and has to calculate — which is what the marks
 * are for.
 *
 *   2014 P2 Q6   three towns
 *   2017 P2 Q7   two triangles placed together
 *   2019 P2 Q11  a jet-ski course
 *   2023 P2 Q8   a wooden beam against a wall
 *   2026 P2 Q7   no context at all, and no diagram needed
 */

export interface TriangleSidesSpec {
  /** Side lengths, in the order opposite the vertices below. */
  sides: { ab: number; bc: number; ca: number };
  vertices: [string, string, string];
  /** What to write along each side; empty leaves it unlabelled. */
  labels: { ab: string; bc: string; ca: string };
  /**
   * An angle to mark at a vertex, with its size written inside the arc.
   *
   * The sine and cosine rule questions give an angle as often as a third side,
   * and the diagram has to show which vertex it sits at — that is the whole
   * difficulty of the sine rule. The angle is drawn true, because the triangle
   * is constructed from its real side lengths, so a 147 degree angle looks
   * obtuse and a 25 degree one looks sharp.
   */
  angles?: { at: 'a' | 'b' | 'c'; label: string }[];
  /**
   * A line from the apex C down to a point on AB, cutting the triangle in two.
   *
   * **2017 P2 Q7 is this and nothing produced it.** Two triangles are given
   * separately with their own side lengths, then placed together along their
   * common edge; the composite's base is the sum of the two bases the pupil is
   * handed, and forming it is the first thing the question asks for.
   *
   * `length` is the length the QUESTION states, not the distance between the
   * two plotted points. Claiming the measured distance would compare the
   * drawing with itself and pass whatever happened - the same trap this file
   * already avoids for angles. Where the stated length and the geometry
   * disagree, `verifyFigure` says so.
   *
   * AB must be the side that is split, so the caller leaves `labels.ab` empty
   * and labels the two parts instead.
   */
  cevian?: {
    /** How far along AB from A the foot sits, in the same units as the sides. */
    at: number;
    /** The length the question states for the cevian itself. */
    length: number;
    name: string;
    labels: { left: string; right: string; line: string };
  };
  /** Turn the whole thing, so the longest side is not always at the bottom. */
  turn?: 0 | 1 | 2 | 3;
}

/**
 * The angle at a vertex, from the three side lengths, by the cosine rule.
 *
 * A is between AB and CA, so BC is opposite it; B between AB and BC, with CA
 * opposite; C between BC and CA, with AB opposite.
 */
export function trueAngle(at: 'a' | 'b' | 'c', ab: number, bc: number, ca: number): number {
  const [p, q, opp] = at === 'a' ? [ab, ca, bc]
    : at === 'b' ? [ab, bc, ca]
    : [bc, ca, ab];
  const cos = (p * p + q * q - opp * opp) / (2 * p * q);
  return Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI;
}

export function triangleFromSides(spec: TriangleSidesSpec): Figure | null {
  const { ab, bc, ca } = spec.sides;
  // an impossible triangle is never built, rather than built and rejected
  if (ab + bc <= ca || bc + ca <= ab || ca + ab <= bc) return null;

  // A at the origin, B along the x-axis, C found by intersecting two circles
  const A = pt(0, 0);
  const B = pt(ab, 0);
  const cx = (ab * ab + ca * ca - bc * bc) / (2 * ab);
  const cySq = ca * ca - cx * cx;
  if (cySq <= 0) return null;
  const C = pt(cx, Math.sqrt(cySq));

  const turn = spec.turn ?? 0;
  const rot = (p: Pt): Pt => {
    switch (turn) {
      case 1: return pt(-p.y, p.x);
      case 2: return pt(-p.x, -p.y);
      case 3: return pt(p.y, -p.x);
      default: return p;
    }
  };
  const [P, Q, R] = [A, B, C].map(rot) as [Pt, Pt, Pt];
  const inside = centroid([P, Q, R]);
  const [nA, nB, nC] = spec.vertices;

  const elements: Element[] = [
    { kind: 'polygon', points: [P, Q, R] },
    { kind: 'label', text: nA, anchor: P, away: inside },
    { kind: 'label', text: nB, anchor: Q, away: inside },
    { kind: 'label', text: nC, anchor: R, away: inside },
  ];
  if (spec.labels.ab) elements.push(sideLabel(P, Q, spec.labels.ab, inside));
  if (spec.labels.bc) elements.push(sideLabel(Q, R, spec.labels.bc, inside));
  if (spec.labels.ca) elements.push(sideLabel(R, P, spec.labels.ca, inside));

  // The foot is placed in the same frame as A and B - before the turn - and
  // rotated with everything else, so it stays on AB whichever way up it lands.
  const cev = spec.cevian;
  const F = cev ? rot(pt(cev.at, 0)) : null;
  if (cev && F) {
    if (!(cev.at > 0 && cev.at < ab) || cev.length <= 0) return null;
    elements.push({ kind: 'segment', from: R, to: F });

    /**
     * **Everything near the foot has to be moved off it deliberately.**
     *
     * A cevian puts a second line into a corner of the base that previously had
     * one, and the first build of this had `verifyFigure` reject every figure it
     * made: the foot letter came out 3.7px from the base and a part measurement
     * 2.2px from the cevian, where 6 is the clearance. Three separate causes,
     * and none of them is fixed by nudging a constant.
     *
     * The foot letter pushes away from the APEX rather than from the centroid.
     * It shares the point F with the cevian, so the cevian is exempt and the
     * base is the only thing to clear - and away-from-the-centroid crosses the
     * base at a shallow angle, which is what left it short.
     */
    elements.push({
      kind: 'label', text: cev.name, anchor: F, away: R, alternatives: [inside],
    });

    /**
     * **Push a measurement perpendicular to the line it measures, not away from
     * the centroid.**
     *
     * Away-from-the-centroid is right for a plain triangle, where the only ink
     * near a side is that side. With a cevian it fails twice over: near the base
     * corner it sends the part measurement in the same direction as the vertex
     * letter and the two overlap, and near the foot it sends it into the cevian.
     * Perpendicular is the direction that is furthest from BOTH lines meeting at
     * the point, which is exactly what a crowded corner needs.
     *
     * Both perpendiculars are offered. The renderer keeps the first and takes
     * the other only if it collides, so this cannot make an uncrowded figure
     * worse.
     */
    const perpAway = (from: Pt, to: Pt, towards: Pt): [Pt, Pt] => {
      const at = mid(from, to);
      const dx = to.x - from.x, dy = to.y - from.y;
      const len = Math.hypot(dx, dy) || 1;
      const n = pt(-dy / len, dx / len);
      // The label is pushed AWAY from the point named, so naming the point on
      // the inside pushes it outward.
      const one = pt(at.x + n.x, at.y + n.y);
      const two = pt(at.x - n.x, at.y - n.y);
      return dist(one, towards) < dist(two, towards) ? [one, two] : [two, one];
    };

    if (cev.labels.left) {
      const [away, alt] = perpAway(P, F, inside);
      elements.push({ kind: 'label', text: cev.labels.left, anchor: mid(P, F), away, alternatives: [alt] });
    }
    if (cev.labels.right) {
      const [away, alt] = perpAway(F, Q, inside);
      elements.push({ kind: 'label', text: cev.labels.right, anchor: mid(F, Q), away, alternatives: [alt] });
    }
    // The cevian's own measurement goes into whichever region it fits; both
    // sides are offered and the renderer takes the one that collides least.
    if (cev.labels.line) {
      const [away, alt] = perpAway(R, F, P);
      elements.push({ kind: 'label', text: cev.labels.line, anchor: mid(R, F), away, alternatives: [alt] });
    }
  }

  const corner = { a: P, b: Q, c: R };
  const arms: Record<'a' | 'b' | 'c', [Pt, Pt]> = {
    a: [Q, R], b: [P, R], c: [P, Q],
  };
  for (const { at, label } of spec.angles ?? []) {
    elements.push(...angleMark(corner[at], arms[at], label));
  }

  const printed = (s: string) => /\d/.test(s);

  return {
    scene: { elements },
    claims: [
      { kind: 'length', from: P, to: Q, value: ab, shown: printed(spec.labels.ab) },
      { kind: 'length', from: Q, to: R, value: bc, shown: printed(spec.labels.bc) },
      { kind: 'length', from: R, to: P, value: ca, shown: printed(spec.labels.ca) },
      ...(cev && F ? [
        { kind: 'length' as const, from: P, to: F, value: cev.at, shown: printed(cev.labels.left) },
        { kind: 'length' as const, from: F, to: Q, value: ab - cev.at, shown: printed(cev.labels.right) },
        { kind: 'length' as const, from: R, to: F, value: cev.length, shown: printed(cev.labels.line) },
      ] : []),
      // An angle marked on the page must be the angle the side lengths imply.
      //
      // The value comes from the cosine rule, not from measuring the points
      // that were just plotted — measuring those would compare the drawing
      // with itself and pass whatever happened.
      ...(spec.angles ?? []).map(({ at }) => ({
        kind: 'angle' as const,
        at: corner[at],
        arms: arms[at],
        value: trueAngle(at, ab, bc, ca),
        shown: false,
      })),
    ],
  };
}

/** The largest angle in the triangle, which is the one worth testing. */
export function largestAngle(ab: number, bc: number, ca: number): number {
  const longest = Math.max(ab, bc, ca);
  const [p, q] = [ab, bc, ca].filter((_, i) => [ab, bc, ca][i] !== longest).length === 2
    ? [ab, bc, ca].filter(s => s !== longest)
    : [ab, bc, ca].sort((x, y) => x - y).slice(0, 2);
  const cos = (p * p + q * q - longest * longest) / (2 * p * q);
  return Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI;
}

export { angleAt, dist };
