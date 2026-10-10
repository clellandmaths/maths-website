import {
  add, centroid, dist, type Element, type Figure, mid, type Pt, pt, sideLabel,
} from '../scene';

/**
 * A slant line off a base, with a perpendicular dropped from a point on it.
 *
 * 2016 P2 Q16 and 2023 P2 Q15 are this same picture with the letters moved
 * around, which is only visible once both are drawn: a base, a line leaving one
 * end of it at an angle, a point part-way up that line with a perpendicular
 * down to the base, and the far end of the slant joined back to the far end of
 * the base.
 *
 *   2016 P2 Q16  AD = 4, DB = 6, AE = EC = 3, DE perpendicular — find BC
 *   2023 P2 Q15  AB = 18, BD = 6, BC = 8, area of ADE = 160 — find AE
 *
 * The whole question turns on the small right-angled triangle sharing its angle
 * at the base corner with the large one. That is a fact about the drawing, so
 * the drawing has to make it plain: the slant is one straight line through the
 * point, not two segments that happen to meet.
 */

export interface SplitSideSpec {
  /** The base, left to right: the corner, the foot of the perpendicular, the far end. */
  base: [string, string, string];
  /** The point on the slant above the foot, then the far end of the slant. */
  on: string;
  far: string;
  /** Base positions. The first is the corner and is always 0. */
  at: [number, number, number];
  /** Height of the point on the slant above the foot. */
  height: number;
  /** How far past the point the slant runs, as a fraction of corner-to-point. */
  beyond: number;
  labels: {
    leftBase: string; rightBase: string;
    /** corner to the point, and the point onward to the far end. */
    lower: string; upper: string;
    perpendicular: string;
  };
}

export function splitSide(spec: SplitSideSpec): Figure | null {
  const [x0, x1, x2] = spec.at;
  if (x0 !== 0 || !(x1 > 0 && x2 > x1) || spec.height <= 0 || spec.beyond <= 0) return null;
  // The foot's name sits below the base between the two base measurements, so
  // it needs room on both sides. Too near either end and the three run together.
  if (x1 < x2 * 0.2 || x2 - x1 < x2 * 0.2) return null;

  const A = pt(0, 0);
  const M = pt(x1, 0);
  const E = pt(x2, 0);
  const P = pt(x1, spec.height);
  // the far end is on the ray through P, which is what makes the two triangles
  // share their angle at A — so it is built from P rather than placed beside it
  const Q = pt(P.x * (1 + spec.beyond), P.y * (1 + spec.beyond));

  const [nA, nM, nE] = spec.base;
  const inside = centroid([A, E, Q]);
  const L = spec.labels;

  const elements: Element[] = [
    { kind: 'segment', from: A, to: E },
    { kind: 'segment', from: A, to: Q },
    { kind: 'segment', from: P, to: M },
    { kind: 'segment', from: Q, to: E },
    { kind: 'label', text: nA, anchor: A, away: inside },
    { kind: 'label', text: nE, anchor: E, away: inside },
    { kind: 'label', text: spec.far, anchor: Q, away: inside },
    // the foot goes below the line, the point on the slant above it
    { kind: 'label', text: nM, anchor: M, away: pt(M.x, M.y + 1) },
    // pushed square out from the slant, not sideways: the slant runs through
    // this point, so anything pushed along it lands on the line
    { kind: 'label', text: spec.on, anchor: P, away: pt(P.x + P.y, P.y - P.x) },
    { kind: 'rightAngle', at: M, arms: [P, A] },
  ];
  if (L.leftBase) elements.push(sideLabel(A, M, L.leftBase, pt(x1 / 2, 1)));
  if (L.rightBase) elements.push(sideLabel(M, E, L.rightBase, pt((x1 + x2) / 2, 1)));
  // The two measurements along the slant are pushed square out from it, not
  // away from the middle of the figure. Near the corner the middle lies almost
  // *along* the slant, so a label pushed from there slides down the line it is
  // labelling instead of stepping off it — which is where both of these landed.
  const outward = pt(spec.height, -x1);
  if (L.lower) elements.push(sideLabel(A, P, L.lower, add(mid(A, P), outward)));
  if (L.upper) elements.push(sideLabel(P, Q, L.upper, add(mid(P, Q), outward)));
  // the perpendicular's measurement goes to its right, clear of both the slant
  // and the square corner mark, which is where 2023 prints it
  if (L.perpendicular) elements.push(sideLabel(P, M, L.perpendicular, pt(-x2, spec.height / 2)));

  const claim = (from: Pt, to: Pt, text: string) =>
    ({ kind: 'length' as const, from, to, value: dist(from, to), shown: /\d/.test(text) });

  return {
    scene: { elements },
    claims: [
      ...(L.leftBase ? [claim(A, M, L.leftBase)] : []),
      ...(L.rightBase ? [claim(M, E, L.rightBase)] : []),
      ...(L.lower ? [claim(A, P, L.lower)] : []),
      ...(L.upper ? [claim(P, Q, L.upper)] : []),
      ...(L.perpendicular ? [claim(P, M, L.perpendicular)] : []),
      // The whole base, claimed even when it carries no number — 2023 labels
      // neither part of it, and without this the far end is nowhere in the
      // figure's own description of itself, leaving anything that reads the
      // figure back to guess which point it is.
      { kind: 'length' as const, from: A, to: E, value: dist(A, E), shown: false },
      // drawn as a square mark, never as the number 90
      { kind: 'angle' as const, at: M, arms: [P, A] as [Pt, Pt], value: 90, shown: false },
      // the perpendicular is vertical, so the base it stands on is horizontal —
      // without this the whole figure could be drawn tilted and every length
      // and angle above would still agree
      { kind: 'bearing' as const, from: M, to: P, degrees: 90 },
    ],
  };
}

export { dist };
