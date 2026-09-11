import {
  type Element, type Figure, type Pt, bearing, mid, pt, sideLabel,
} from '../scene';

/**
 * A circular segment: an arc, its chord, and the perpendicular from the centre.
 *
 * This is the shape behind every one of the eight National 5 Pythagoras
 * questions — a tunnel cross-section, a paving slab, a perfume label, a door
 * sign. The thing that makes them four-mark questions is that **the
 * right-angled triangle is not part of the object**: the pupil has to produce
 * it by dropping a perpendicular from the centre to the chord, which bisects
 * it. That is the first markscheme line, "marshal facts and recognise
 * right-angled triangle".
 *
 * So the diagram draws what the paper draws — the shape, the chord, the centre
 * — with the construction dashed, because a solid line would give away the step
 * the marks are for. The half-chord is deliberately *not* labelled: working out
 * that it is half of the chord is part of the question.
 *
 *   major   the chord sits below the centre and the shape is the larger piece,
 *           so its height is r + d          (2016 P2 Q15, 2018 P2 Q12, 2022 P2 Q8)
 *   minor   the chord sits above the centre and the shape is the smaller piece,
 *           so its height is r - d          (2023 P1 Q10)
 */

export interface CircleChordSpec {
  radius: number;
  chord: number;
  /** The larger piece of the circle, or the smaller one. */
  major: boolean;
  /** Names for the chord's ends and the centre. */
  names: { a: string; b: string; centre: string };
  /**
   * What to write on the radius, the chord, the height, and the
   * perpendicular from the centre. 2026 P2 Q5 gives that last one and asks
   * for the radius, so it has to be labellable; the others leave it blank
   * because working out that it bisects the chord is the question.
   */
  labels: { radius: string; chord: string; height: string; centreToChord?: string };
  /** Draw the rest of the circle faintly, as some diets do. */
  showWholeCircle?: boolean;
  /**
   * Put the piece being asked about **below** the chord instead of above it.
   *
   * 2015 P2 Q12 is a container of liquid: the surface is the chord, the liquid
   * is shaded underneath it, and the depth is bracketed down the side. Until
   * this existed the shape could only be drawn the other way up, so that paper
   * was cited and not cloned.
   *
   * It is a mirror in the x-axis and nothing more. Every claim the figure makes
   * is a length or an angle, and reflection changes neither, so the checks
   * carry over unaltered.
   */
  flip?: boolean;
}

export function circleChord(spec: CircleChordSpec): Figure {
  const r = spec.radius;
  const half = spec.chord / 2;
  const d = Math.sqrt(r * r - half * half);      // centre to chord
  const k = spec.major ? -d : d;                 // where the chord sits
  const m = spec.flip ? -1 : 1;                  // mirrored in the x-axis

  const O = pt(0, 0);
  const A = pt(-half, k * m);
  const B = pt(half, k * m);
  const M = mid(A, B);
  const T = pt(0, r * m);                        // the far point of the arc

  // Anticlockwise from B round the far point to A, which is the piece being
  // asked about. Reflecting negates every bearing, which reverses the sweep —
  // so the two ends swap rather than each being negated.
  const [from, to] = spec.flip
    ? [bearing(O, A), bearing(O, B)]
    : [bearing(O, B), bearing(O, A)];

  const elements: Element[] = [
    ...(spec.showWholeCircle ? [{ kind: 'circle' as const, centre: O, r, dashed: true }] : []),
    { kind: 'arc', centre: O, r, from, to },
    { kind: 'segment', from: A, to: B },
    // the construction the pupil has to supply, so it is dashed
    { kind: 'segment', from: O, to: B, dashed: true },
    { kind: 'segment', from: O, to: M, dashed: true },
    { kind: 'segment', from: M, to: T, dashed: true },
    { kind: 'rightAngle', at: M, arms: [O, B] },
    { kind: 'label', text: spec.names.a, anchor: A, away: O },
    { kind: 'label', text: spec.names.b, anchor: B, away: O },
    { kind: 'label', text: spec.names.centre, anchor: O, away: T },
  ];

  // The radius is labelled along O-B, and the chord along A-B, each pushed
  // clear of the figure. The half-chord is left unlabelled on purpose.
  //
  // The two vertical measurements are pushed *sideways*, not "away from B".
  // `sideLabel` shoves a label from the point it is given towards the middle of
  // the side, so a reference point that is not square-on to a vertical line
  // sends the label sliding up that line instead of off it. Both of these sit
  // on the same vertical — M-T contains O-M — and with B as the reference the
  // height label landed on the line every single time: 2000 layouts, not one
  // legible, so the shape behind 2014 P1 Q12 never produced a question at all.
  // Nothing failed, because the id was shared with the branch that does work.
  const rightOf = (y: number) => pt(Math.max(half, r * 0.5), y);
  if (spec.labels.radius) elements.push(sideLabel(O, B, spec.labels.radius, pt(0, k * m)));
  // The chord's own label goes a quarter along it, not at its midpoint.
  //
  // The midpoint is where the whole construction meets: the perpendicular foot
  // M, its right-angle mark, and the dashed line down to the centre. A label
  // anchored there and pushed off the chord "away from the arc" lands on the
  // centre's side exactly when the centre is on that side — which is every
  // *minor* segment, and it sat on top of the right angle in all of them. The
  // major ones looked fine only because their centre is on the other side, so
  // half the questions were illegible and half were evidence that they were
  // not.
  //
  // The papers place it off-centre for the same reason: 2023 P1 Q10 puts its
  // "60 cm" well clear of the construction rather than in the middle of it.
  const quarter = pt(A.x + (B.x - A.x) * 0.28, A.y + (B.y - A.y) * 0.28);
  if (spec.labels.chord) {
    elements.push({ kind: 'label', text: spec.labels.chord, anchor: quarter, away: T });
  }
  if (spec.labels.height) elements.push(sideLabel(M, T, spec.labels.height, rightOf((k + r) * m / 2)));
  if (spec.labels.centreToChord) elements.push(sideLabel(O, M, spec.labels.centreToChord, rightOf(k * m / 2)));

  const printed = (s: string) => /\d/.test(s);

  return {
    scene: { elements },
    claims: [
      // the perpendicular from the centre really is perpendicular, and really
      // does land on the midpoint — the two facts the question turns on
      { kind: 'angle', at: M, arms: [O, B], value: 90, shown: false },
      { kind: 'length', from: A, to: M, value: spec.chord / 2, shown: false },
      { kind: 'length', from: M, to: B, value: spec.chord / 2, shown: false },
      { kind: 'length', from: O, to: B, value: r, shown: printed(spec.labels.radius) },
      { kind: 'length', from: A, to: B, value: spec.chord, shown: printed(spec.labels.chord) },
      { kind: 'length', from: M, to: T, value: spec.major ? r + d : r - d,
        shown: printed(spec.labels.height) },
      { kind: 'length', from: O, to: M, value: d,
        shown: printed(spec.labels.centreToChord ?? '') },
    ],
  };
}
