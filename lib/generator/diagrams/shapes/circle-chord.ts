import {
  type Element, type Figure, type Pt, bearing, dimensionArrow, mid, pt, sideLabel,
} from '../scene';

/**
 * A circle and a chord, drawn the way the paper draws it.
 *
 * This is the shape behind the National 5 Pythagoras-in-a-circle questions —
 * a milk tank, a perfume label, a train tunnel, a paving slab. What makes them
 * four-mark questions is that **the right-angled triangle is not part of the
 * object**: the pupil has to produce it by dropping a perpendicular from the
 * centre to the chord, which bisects it. That is the first markscheme line,
 * "marshal facts and recognise right-angled triangle".
 *
 * **So this draws what is given, and nothing else.** An earlier version drew
 * the perpendicular dashed, on the reasoning that dashed does not give the
 * step away. Every paper's answer is that it is not drawn at all — nor is the
 * right angle marked, in any of the seven. The clone review of 2026-09-17
 * found the construction drawn in on all five papers this served, and the
 * verdict is recorded in `docs/clone-verdicts.md`.
 *
 * A line is drawn here when the paper draws it, which is when its length is a
 * given on the figure:
 *
 *   the radius to a chord end       solid in 2016 and 2022, dashed in 2023,
 *                                   absent in 2014, 2015, 2018, 2026
 *   centre to the chord's midpoint  solid in 2026, where OB = 9 is the given
 *   midpoint to the far arc         solid in 2014, where AB = 27 is the given
 *
 * And the rest of the circle — the part that is not the shape — is drawn
 * solid where the paper draws the whole circle (2014, 2015, 2018, 2026),
 * dashed where the paper shows the cut-off piece as removed (2023), and not
 * at all where the object simply *is* a segment (2016, 2022).
 *
 *   major   the chord sits below the centre and the shape is the larger piece,
 *           so its height is r + d
 *   minor   the chord sits above the centre and the shape is the smaller piece,
 *           so its height is r - d
 */

export interface CircleChordSpec {
  radius: number;
  chord: number;
  /** The larger piece of the circle, or the smaller one. */
  major: boolean;
  /**
   * Names for the chord's ends and the centre — and the midpoint, where the
   * paper names it. 2026 P2 Q5 calls it B and states "B is the midpoint of
   * AC"; a figure that leaves it unlettered contradicts its own prose.
   */
  names: { a: string; b: string; centre: string; mid?: string };
  /**
   * What to write on the radius, the chord, the height, and the perpendicular
   * from the centre. **A label on the height or the perpendicular draws that
   * line, solid** — it is only ever labelled when it is a given.
   */
  labels: { radius: string; chord: string; height: string; centreToChord?: string };
  /**
   * The part of the circle that is not the shape. `none` for an object that
   * is a segment (a tunnel, a label); `solid` where the paper draws the whole
   * circle; `dashed` where it shows the removed piece as removed.
   */
  rest?: 'none' | 'solid' | 'dashed';
  /**
   * The radius from the centre to a chord end. Drawn only when the paper draws
   * it; its label goes on the line when it is drawn and in the prose when it
   * is not.
   */
  radiusLine?: 'solid' | 'dashed' | 'none';
  /** Fill the piece being asked about — the milk in the tank. */
  shade?: boolean;
  /**
   * Dashed lines from the chord's ends out to its dimension arrow, as
   * 2026 P2 Q5 draws them. Opt-in: this shape serves several questions and
   * only that one asked for it.
   */
  chordExtensions?: boolean;
  /**
   * Put the piece being asked about **below** the chord instead of above it.
   *
   * 2015 P2 Q12 is a container of liquid: the surface is the chord, the liquid
   * is shaded underneath it, and the depth is bracketed down the side.
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
  const rest = spec.rest ?? 'none';
  const radiusLine = spec.radiusLine ?? 'none';

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
    ...(spec.shade ? [{ kind: 'shadedSegment' as const, centre: O, r, from, to }] : []),
    { kind: 'arc', centre: O, r, from, to },
    // the other arc, from A back round to B, where the paper draws it
    ...(rest !== 'none'
      ? [{ kind: 'arc' as const, centre: O, r, from: to, to: from, dashed: rest === 'dashed' }]
      : []),
    { kind: 'segment', from: A, to: B },
    ...(radiusLine !== 'none'
      ? [{ kind: 'segment' as const, from: O, to: B, dashed: radiusLine === 'dashed' }]
      : []),
    // Solid, because a labelled line is a given. Never drawn otherwise — the
    // perpendicular is the construction the first mark pays for.
    ...(spec.labels.centreToChord ? [{ kind: 'segment' as const, from: O, to: M }] : []),
    ...(spec.labels.height ? [{ kind: 'segment' as const, from: M, to: T }] : []),
    { kind: 'label', text: spec.names.a, anchor: A, away: O },
    { kind: 'label', text: spec.names.b, anchor: B, away: O },
    // Pushed away from B, so it sits up and to the left of the centre: clear
    // of the radius to B, and clear of the vertical through the centre that
    // 2014 and 2026 draw. Pushed away from T, as it used to be, it landed on
    // that vertical every time.
    { kind: 'label', text: spec.names.centre, anchor: O, away: B },
    ...(spec.names.mid ? [{ kind: 'label' as const, text: spec.names.mid, anchor: M, away: T }] : []),
  ];

  // Each measurement sits beside the line it measures, pushed *sideways* off
  // the vertical rather than "away from B" — `sideLabel` shoves a label from
  // its reference point towards the middle of the side, and a reference that
  // is not square-on to a vertical line sends the label sliding up it.
  const rightOf = (y: number) => pt(Math.max(half, r * 0.5), y);
  if (radiusLine !== 'none' && spec.labels.radius) {
    /**
     * **Pushed away from A, the chord's far end.**
     *
     * Away from `pt(0, k * m)` — a point on the vertical at the chord's height
     * — works while the cut is deep, and fails as it shallows: at 2023 P1 Q10's
     * own proportions, radius 50 and chord 60, the number lands 4.6px off the
     * chord and `verifyFigure` throws the whole draw away. That mattered more
     * than it looks. The only shapes that *did* render were the ones whose
     * answer equals the chord, so every clone of this question gave its answer
     * away in the question — see the note in n5-pythagoras.ts.
     *
     * A is the other end of the chord, so pushing away from it carries the
     * label along the chord's own direction, into the open part of the major
     * piece, at every depth of cut.
     *
     * Keep the anchor on the midpoint. `verifyFigure` ties a measurement to the
     * segment it measures by that midpoint; moved even a little along the line,
     * the label stops being recognised as the radius's own and is then counted
     * against it — 0.0px from "ink it does not label", which is the radius line
     * it is sitting on and labelling.
     */
    elements.push(sideLabel(O, B, spec.labels.radius, A));
  }
  if (spec.labels.chord) {
    /**
     * **On an arrow outside the circle, which is what the paper draws.**
     *
     * The owner, on the 2026-2023 sign-off sheet: *"Have 3m drawn more centre
     * or use arrows like the question it's based on"*. 2026 P2 Q5 does the
     * second: the chord's 25 cm is a double-headed arrow standing clear to the
     * right of the whole circle, with the chord's ends carried out to it, while
     * the 9 cm sits on the segment from the centre. Nothing is written along
     * the chord itself.
     *
     * The old placement put the number a quarter of the way along the chord -
     * off-centre deliberately, to leave the midpoint free for the perpendicular
     * a pupil draws in - and then had to choose a side, which is where it came
     * unstuck. Away from T is outside the chord, on the side the cut removes,
     * and that side thins as the cut deepens until the arc closes in and the
     * label lands on it. At 2023 P1 Q10's proportions - radius 50, chord 60 -
     * `verifyFigure` rejected every draw with "4.0px from ink it does not
     * label", leaving only the shapes whose answer equals the chord, so the
     * clone gave its answer away in the question. The note above this block
     * already said what the fix was: *the paper prints that measurement on an
     * arrow outside the whole figure*.
     *
     * The gap clears the arc rather than guessing at one: the far edge of the
     * circle on the side away from T sits `|k + r|` from the chord, so the
     * arrow stands that far out and a little more. No side to choose and no
     * depth of cut it stops working at.
     */
    const clearArc = Math.abs(k + r) + r * 0.16;
    const outward = pt(M.x, M.y - m * 2 * r);
    elements.push(...dimensionArrow(A, B, outward, clearArc, spec.labels.chord,
      spec.chordExtensions === true));
  }
  if (spec.labels.height) elements.push(sideLabel(M, T, spec.labels.height, rightOf((k + r) * m / 2)));
  if (spec.labels.centreToChord) elements.push(sideLabel(O, M, spec.labels.centreToChord, rightOf(k * m / 2)));

  const printed = (s: string) => /\d/.test(s);

  return {
    scene: { elements },
    claims: [
      // the perpendicular from the centre really is perpendicular, and really
      // does land on the midpoint — the two facts the question turns on. Asserted
      // geometrically and never drawn: no paper marks the right angle.
      { kind: 'angle', at: M, arms: [O, B], value: 90, shown: false },
      { kind: 'length', from: A, to: M, value: spec.chord / 2, shown: false },
      { kind: 'length', from: M, to: B, value: spec.chord / 2, shown: false },
      { kind: 'length', from: O, to: B, value: r,
        shown: radiusLine !== 'none' && printed(spec.labels.radius) },
      { kind: 'length', from: A, to: B, value: spec.chord, shown: printed(spec.labels.chord) },
      { kind: 'length', from: M, to: T, value: spec.major ? r + d : r - d,
        shown: printed(spec.labels.height) },
      { kind: 'length', from: O, to: M, value: d,
        shown: printed(spec.labels.centreToChord ?? '') },
    ],
  };
}
