import { type Element, type Figure, type Pt, add, centroid, mid, parallelMark,
         pt, scale, sideLabel, sub } from '../scene';

/**
 * A triangle cut by a line parallel to one of its sides.
 *
 * The similarity figure the papers use most: 2017 P1 Q15, 2024 P1 Q14 and
 * 2015 P2 Q9 are all this shape, asked three ways. The cut makes a smaller
 * triangle sharing the apex, and the two are similar because the parallel
 * gives them equal corresponding angles — which is why the parallel has to be
 * marked on the figure and not merely implied by the drawing.
 *
 * Everything follows from one ratio. The cut sits at t of the way down each
 * ray, so the near side is t times the far side, and t is what the question
 * hands over — as two lengths in 2017 and 2024, as two heights in 2015.
 */

export interface NestedTrianglesSpec {
  /** The far side, opposite the apex. */
  base: number;
  /** The angles at the two ends of it, in degrees. */
  angleLeft: number;
  angleRight: number;
  /** How far down the rays the cut sits, as a fraction. */
  cut: number;
  /** Turn the whole figure, anticlockwise from upright, in degrees. */
  rotate: number;
  names: { apex: string; nearLeft: string; nearRight: string;
           left: string; right: string };
  /** What to write on the two parallels. */
  nearLabel: string;
  farLabel: string;
  /**
   * Lengths along the left ray. 2017 P1 Q15 labels both parts of it — the one
   * it gives and the one it asks for — so this takes a list.
   */
  rayLabels?: { part: 'inner' | 'outer' | 'whole'; text: string }[];
  /** The papers' flag has a right angle where the base meets the left ray. */
  rightAngleAtLeft?: boolean;
  /**
   * Fill the two regions the cut makes, in two tones.
   *
   * **2015 P2 Q9 names its two regions by colour** - "triangle QRT represents
   * the red section, PQTS represents the blue section" - and our clone said
   * the same of a figure with nothing filled at all. The words pointed at two
   * coloured regions that were not on the page. The letters still name them,
   * so the question was answerable; the colours were doing nothing.
   *
   * A tone of zero leaves a section unfilled, which is what "the white
   * section" means: painting white a pale grey is not a small inaccuracy,
   * it is the one thing the word rules out.
   *
   * Off by default: 2017 P1 Q15 and 2024 P1 Q14 use this same figure and name
   * no regions, so filling theirs would be ink asserting a distinction their
   * questions never draw.
   */
  /** How dark each section is: the near triangle, then the far region. */
  shadeSections?: [number, number];
}

const dir = (deg: number): Pt =>
  pt(Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180));

const turn = (p: Pt, deg: number): Pt => {
  const c = Math.cos(deg * Math.PI / 180), s = Math.sin(deg * Math.PI / 180);
  return pt(p.x * c - p.y * s, p.x * s + p.y * c);
};

export function nestedTriangles(spec: NestedTrianglesSpec): Figure | null {
  const { base, angleLeft: aL, angleRight: aR, cut: t, rotate } = spec;
  const apexAngle = 180 - aL - aR;
  // The two points on the rays carry their letters pushed square off the cut,
  // and that clears the ray they sit on by sin(angle at the base) — so a base
  // angle much under 35 puts a letter on its own line.
  if (base <= 0 || aL < 35 || aR < 35 || apexAngle < 25) return null;
  if (t < 0.2 || t > 0.85) return null;

  const rad = Math.PI / 180;
  // the sine rule puts the apex where the two rays cross
  const leftRay = base * Math.sin(aR * rad) / Math.sin(apexAngle * rad);
  const L = turn(pt(0, 0), rotate);
  const R = turn(pt(base, 0), rotate);
  const A = turn(scale(dir(aL), leftRay), rotate);
  const B = add(A, scale(sub(L, A), t));      // on the left ray
  const C = add(A, scale(sub(R, A), t));      // on the right ray
  const n = spec.names;
  const inside = centroid([A, L, R]);

  // Anything sitting on a line gets pushed square off it. Away-from-the-middle
  // is enough for a corner, where two lines diverge, but B and C sit *on* a
  // ray with the line continuing past them in both directions, and a label
  // 13px along a direction 40 degrees off that line still has a corner on it.
  const offLine = (from: Pt, to: Pt, at: number, towardInside = true): Pt => {
    const anchor = add(from, scale(sub(to, from), at));
    const u = sub(to, from);
    const len = Math.hypot(u.x, u.y) || 1;
    const nrm = pt(-u.y / len, u.x / len);
    const toward = sub(inside, anchor);
    const sign = (toward.x * nrm.x + toward.y * nrm.y > 0 ? 1 : -1) * (towardInside ? 1 : -1);
    return add(anchor, scale(nrm, sign * base * 0.15));
  };
  const along = (from: Pt, to: Pt, at: number): Pt =>
    add(from, scale(sub(to, from), at));

  const elements: Element[] = [
    // Underneath the outline, so the lines and letters stay crisp on top. The
    // near triangle takes the darker tone: it is the one the question gives.
    ...(spec.shadeSections && spec.shadeSections[0] > 0
      ? [{ kind: 'shadedShape' as const, points: [A, B, C],
           tone: spec.shadeSections[0] }] : []),
    ...(spec.shadeSections && spec.shadeSections[1] > 0
      ? [{ kind: 'shadedShape' as const, points: [B, L, R, C],
           tone: spec.shadeSections[1] }] : []),
    { kind: 'segment', from: A, to: L },
    { kind: 'segment', from: A, to: R },
    { kind: 'segment', from: L, to: R },
    { kind: 'segment', from: B, to: C },
    // the parallel is the whole reason the two triangles are similar, so it is
    // marked rather than left to the eye
    ...parallelMark(B, C),
    ...parallelMark(L, R),
    { kind: 'label', text: n.apex, anchor: A, away: inside },
    { kind: 'label', text: n.left, anchor: L, away: inside },
    { kind: 'label', text: n.right, anchor: R, away: inside },
    { kind: 'label', text: n.nearLeft, anchor: B, away: offLine(A, L, t) },
    { kind: 'label', text: n.nearRight, anchor: C, away: offLine(A, R, t) },
    // A third of the way along, not the middle: the middle is where the
    // parallel chevron is, and the chevron reaches further off the line than
    // the label does.
    // The cut's measurement goes in the strip between the two parallels, where
    // the papers put it, but past the middle rather than before it. The strip
    // narrows to nothing at both ends as the rays converge, so a quarter of the
    // way along is against the ray however wide the strip is in the middle; and
    // the middle itself is where the chevron sits.
    // Square off the cut, on the base side of it. Pushing "away from the apex"
    // is not the same thing and only looks like it on a triangle that leans the
    // right way: with a right angle at the base the direction away from the
    // apex runs diagonally into the hypotenuse.
    { kind: 'label', text: spec.nearLabel, anchor: along(B, C, 0.65),
      away: offLine(B, C, 0.65, false) },
    { kind: 'label', text: spec.farLabel, anchor: along(L, R, 0.25), away: offLine(L, R, 0.25) },
  ];
  if (spec.rightAngleAtLeft) elements.push({ kind: 'rightAngle', at: L, arms: [A, R] });
  for (const r of spec.rayLabels ?? []) {
    const [from, to] = r.part === 'inner' ? [A, B]
                     : r.part === 'outer' ? [B, L] : [A, L];
    // square off the ray it measures, like everything else that sits on a line
    elements.push({ kind: 'label', text: r.text, anchor: mid(from, to),
                    away: offLine(from, to, 0.5) });
  }

  return {
    scene: { elements },
    claims: [
      { kind: 'length', from: B, to: C, value: base * t, shown: true },
      { kind: 'length', from: L, to: R, value: base, shown: true },
      // the two triangles share the apex angle, and the parallel makes the
      // other two pairs equal — the whole basis of the question
      { kind: 'angle', at: A, arms: [B, L], value: 0, shown: false },
      { kind: 'angle', at: A, arms: [C, R], value: 0, shown: false },
      { kind: 'angle', at: L, arms: [A, R], value: spec.rightAngleAtLeft ? 90 : aL, shown: false },
      // BC is parallel to LR, so the angle the cut makes with the ray is the
      // base angle itself — the corresponding angles that make the two
      // triangles similar, and the reason the question works at all. Stated as
      // 180 - aL at first, which every figure then failed: the co-interior
      // angle is the one on the other side of B.
      { kind: 'angle', at: B, arms: [A, C], value: aL, shown: false },
      { kind: 'angle', at: C, arms: [A, B], value: aR, shown: false },
    ],
  };
}
