import { type Figure, type Pt, LABEL_CLEARANCE, angleAt, bearing, dist, pt, sub, unit } from './scene';
import {
  boxCorners, crossesBox, ellipseSweep, onEllipse, overlaps, place, pointToSegment,
  renderScene, segmentsCross, type Box,
} from './render';

/**
 * What a generated diagram has to satisfy before anyone looks at it.
 *
 * These are the checks that make it reasonable to review one contact sheet per
 * shape routine instead of every question. Two of them do the real work:
 *
 *   consistency   every labelled length and angle is re-measured off the
 *                 projected scene and compared with the number the question
 *                 prints. A mislabelled vertex or a wrong projection produces
 *                 a diagram that looks perfectly fine and is wrong, and this
 *                 is the only thing that catches it.
 *
 *   collisions    no two labels overlap, and no label sits on a line it does
 *                 not belong to. Label widths are estimated generously, so
 *                 this errs towards rejecting a layout that would have been
 *                 acceptable rather than passing one that is not.
 *
 * The rest are cheap and absolute: the figure must be inside its own viewBox,
 * no feature may be too small to label, and no colour may be hardcoded or the
 * diagram will not follow dark mode or print.
 */

/**
 * How far a label must stay from ink that is not its own.
 *
 * Defined in `scene.ts` as `LABEL_CLEARANCE`, because `render`'s placer has to
 * score its candidates against the same number this rejects them on.
 */
const CLEARANCE = LABEL_CLEARANCE;

export interface Problem { kind: string; detail: string }



/**
 * Does a line pass through a label's box?
 *
 * Measuring the distance from each corner is not enough, and that is not a
 * subtle failure: a line running diagonally across a wide label sits far from
 * all four corners while passing straight through the middle of the text. A
 * sector's radius went through the "6" of "16 cm" with every check green.
 */

/**
 * Check one figure. `claimedIn` is the question text, so the numbers in the
 * picture can be confirmed to be the numbers the pupil is given.
 */
export function verifyFigure(fig: Figure, claimedIn?: string): Problem[] {
  const out: Problem[] = [];
  const p = place(fig.scene);

  // ── 1. the picture agrees with the numbers ──────────────────────────────
  //
  // Lengths are compared as a ratio, since the drawing is scaled; angles are
  // compared directly, because an angle labelled 30 must *look* like 30 or the
  // diagram teaches the wrong intuition.
  const lengths = fig.claims.filter(c => c.kind === 'length') as Extract<typeof fig.claims[number], { kind: 'length' }>[];
  if (lengths.length >= 2) {
    const ratios = lengths.map(c => dist(p.px(c.from), p.px(c.to)) / c.value);
    const [lo, hi] = [Math.min(...ratios), Math.max(...ratios)];
    if (hi / lo > 1.02 && !fig.scene.notToScale) {
      out.push({
        kind: 'LENGTHS NOT TO SCALE',
        detail: `drawn lengths disagree with the labelled ones by ${((hi / lo - 1) * 100).toFixed(1)}%` +
          ` — either fix the construction or set notToScale`,
      });
    }
    // even compressed, the order of the sides must survive
    if (fig.scene.notToScale) {
      const byLabel = [...lengths].sort((a, b) => a.value - b.value);
      const drawn = byLabel.map(c => dist(p.px(c.from), p.px(c.to)));
      for (let i = 1; i < drawn.length; i++) {
        if (drawn[i] < drawn[i - 1] - 0.5) {
          out.push({
            kind: 'COMPRESSION REORDERED THE SIDES',
            detail: `${byLabel[i - 1].value} is drawn longer than ${byLabel[i].value}`,
          });
          break;
        }
      }
    }
  }
  for (const c of fig.claims) {
    if (c.kind !== 'bearing') continue;
    // measured on the page, where y runs downwards, so flip it back
    const a = p.px(c.from), b = p.px(c.to);
    const got = bearing({ x: a.x, y: -a.y }, { x: b.x, y: -b.y });
    // the smaller of the two ways round, so 359° and 1° are 2° apart
    const off = Math.abs(((got - c.degrees + 540) % 360) - 180);
    if (off > 1) {
      out.push({
        kind: 'DRAWN THE WRONG WAY ROUND',
        detail: `the question says this runs at ${c.degrees}°, but it is drawn at ${got.toFixed(0)}°`,
      });
    }
  }
  for (const c of fig.claims) {
    if (c.kind !== 'angle') continue;
    const got = angleAt(p.px(c.at), p.px(c.arms[0]), p.px(c.arms[1]));
    if (Math.abs(got - c.value) > 0.6) {
      out.push({
        kind: 'ANGLE WRONG',
        detail: `labelled ${c.value}° but drawn ${got.toFixed(1)}°`,
      });
    }
  }

  // ── 2. the numbers in the picture are the ones in the question ──────────
  if (claimedIn) {
    for (const c of fig.claims) {
      // a bearing is a direction, not a number the question prints
      if (c.shown === false || c.kind === 'bearing') continue;
      const v = `${Math.round(c.value * 100) / 100}`;
      if (!claimedIn.includes(v)) {
        out.push({
          kind: 'DIAGRAM SHOWS A NUMBER THE QUESTION DOES NOT',
          detail: `${v} appears in the figure but not in the question text`,
        });
      }
    }
  }

  // ── 3. labels do not collide, and a scale can be read as a scale ────────
  //
  // Two numbers printed against an axis are a *scale*: they are read by
  // comparing one with the next, so they have to be far enough apart to be read
  // as two numbers. **Not overlapping is not enough.** A half-period and a
  // period 36 degrees apart cleared the overlap rule by a hair and the eye read
  // them as the single blob "36 72" — legible to every check here and not to a
  // pupil. That was found by rendering a topic and looking at it, which is the
  // expensive way; this is the cheap one.
  //
  // The gap is only demanded between two labels that are both scale numbers.
  // Everywhere else a label just has to avoid ink, and widening that would
  // start rejecting figures that have always been fine.
  const TICK_GAP = 4;
  for (let i = 0; i < p.labels.length; i++) {
    for (let j = i + 1; j < p.labels.length; j++) {
      const [a, b] = [p.labels[i], p.labels[j]];
      if (overlaps(a.box, b.box)) {
        out.push({ kind: 'LABELS OVERLAP', detail: `"${a.text}" and "${b.text}"` });
        continue;
      }
      if (!a.role?.startsWith('tick') || !b.role?.startsWith('tick')) continue;
      const gapX = Math.max(a.box.x - (b.box.x + b.box.w), b.box.x - (a.box.x + a.box.w));
      const gapY = Math.max(a.box.y - (b.box.y + b.box.h), b.box.y - (a.box.y + a.box.h));
      // Apart in either direction is apart; only a pair close on *both* reads
      // as one number.
      if (Math.max(gapX, gapY) < TICK_GAP) {
        out.push({
          kind: 'SCALE NUMBERS TOO CLOSE TO READ APART',
          detail: `"${a.text}" and "${b.text}" are ${Math.max(gapX, gapY).toFixed(1)}px apart`,
        });
      }
    }
  }

  // ── 4. no label sits on ink it does not belong to ────────────────
  //
  // Straight ink and curved ink need different exemptions, so they are kept
  // apart. A label is allowed to sit close to the thing it labels, and only
  // that: beside its own vertex for a letter, on its own circle for a point
  // marked on one. Everything else has to keep clear.
  const segments: [Pt, Pt][] = [];
  // the same strokes minus the decorative ones, which are exempt from the
  // minimum-length rule but still have to stay clear of labels
  const measurable: [Pt, Pt][] = [];
  // `onIt` is the exemption a point marked on a circle earns — it is labelled
  // from that circle and has nowhere else to sit. Carried as a predicate rather
  // than a centre and a radius because an ellipse has no single radius, and
  // because no rim of a solid ever earns it: a measurement lying across the
  // base of a cone reads as badly as one lying across its side.
  const curves: { onIt: (p: Pt) => boolean; samples: [Pt, Pt][] }[] = [];
  for (const e of fig.scene.elements) {
    if (e.kind === 'segment') {
      const seg: [Pt, Pt] = [p.px(e.from), p.px(e.to)];
      segments.push(seg);
      if (!e.decoration) measurable.push(seg);
    }
    if (e.kind === 'polygon') {
      for (let i = 0; i < e.points.length; i++) {
        const seg: [Pt, Pt] = [p.px(e.points[i]), p.px(e.points[(i + 1) % e.points.length])];
        segments.push(seg);
        measurable.push(seg);
      }
    }
    // An arc is ink too, and a number resting on one reads as badly as a
    // number resting on a side. Sampled into chords fine enough that the sag
    // between samples stays under a pixel.
    if (e.kind === 'arc' || e.kind === 'circle') {
      const from = e.kind === 'arc' ? e.from : 0;
      const sweep = e.kind === 'arc' ? ((e.to - e.from) % 360 + 360) % 360 : 360;
      const steps = Math.max(4, Math.ceil(sweep / 10));
      const on = (deg: number) => p.px(pt(
        e.centre.x + e.r * Math.cos(deg * Math.PI / 180),
        e.centre.y + e.r * Math.sin(deg * Math.PI / 180)));
      const centre = p.px(e.centre);
      const r = Math.abs(p.px(pt(e.centre.x + e.r, e.centre.y)).x - centre.x);
      curves.push({
        onIt: q => Math.abs(dist(q, centre) - r) < 1.5,
        samples: Array.from({ length: steps }, (_, i): [Pt, Pt] =>
          [on(from + sweep * i / steps), on(from + sweep * (i + 1) / steps)]),
      });
    }
    // A rim is ink on the same terms, and it is the ink a solid's measurements
    // are most likely to drift onto — the diameter of a cone is written across
    // the very ellipse that draws its base.
    if (e.kind === 'ellipse') {
      const [efrom, eto] = ellipseSweep(e);
      const sweep = ((eto - efrom) % 360 + 360) % 360 || 360;
      const steps = Math.max(4, Math.ceil(sweep / 10));
      const on = (deg: number) => p.px(onEllipse(e, deg));
      const samples = Array.from({ length: steps }, (_, i): [Pt, Pt] =>
        [on(efrom + sweep * i / steps), on(efrom + sweep * (i + 1) / steps)]);
      curves.push({
        // A point marked on a rim earns the same exemption a point marked on a
        // circle does: the base of a cone standing on the axes has a named
        // point where it touches the x-axis, and there is nowhere else to put
        // its letter. Refused outright at first, on the reasoning that a
        // *measurement* lying across a rim reads as badly as one lying across
        // a side — true, and not the same thing as a point that is on it.
        onIt: q => Math.min(...samples.map(([a, b]) => pointToSegment(q, a, b))) < 1.5,
        samples,
      });
    }
    // A plotted curve is ink on exactly the same terms as an arc, and it is the
    // ink most likely to be drifted onto: every graph question in the papers
    // labels a point that lies *on* the curve, so the exemption earns its keep
    // here more than anywhere. Not measurable — the minimum-length rule is
    // about a side having room for its measurement, and a sample step is not a
    // side and never carries one.
    if (e.kind === 'path') {
      const px = e.points.map(q => p.px(q));
      const samples = px.slice(1).map((q, i): [Pt, Pt] => [px[i], q]);
      if (samples.length) {
        curves.push({
          onIt: q => Math.min(...samples.map(([a, b]) => pointToSegment(q, a, b))) < 1.5,
          samples,
        });
      }
    }
  }
  for (const l of p.labels) {
    const gapTo = (a: Pt, b: Pt) =>
      Math.min(...boxCorners(l.box).map(c => pointToSegment(c, a, b)));
    let hit: number | null = null;

    for (const [a, b] of segments) {
      // A label is exempt from the lines meeting at the point it was placed
      // against: a vertex letter from the sides meeting at its vertex, an
      // angle number from the two arms of the angle it measures. Both are
      // *meant* to sit there and there is nowhere else to put them — a 12
      // degree wedge cannot hold an 11px number without touching an arm, which
      // is why the papers print it touching one. Every other line still has to
      // be cleared.
      const own = (q: Pt) => dist(l.anchor, q) < 1 || dist(l.away, q) < 1;
      if (own(a) || own(b)) continue;
      if (crossesBox(l.box, a, b)) { hit = 0; break; }
      const d = gapTo(a, b);
      if (d < CLEARANCE) { hit = d; break; }
    }
    /**
     * **A scale number is the ruler, not the figure, and a ruler may be drawn
     * through.**
     *
     * 2014 P1 Q10 numbers its x-axis every 20 degrees and its wave runs
     * straight across those numbers; 2015 P1 Q6 prints its 360 where the sine
     * is arriving at the axis. No paper moves a scale number out of a curve's
     * way, because a scale is read by comparing one number with the next and
     * moving one breaks the row.
     *
     * Requiring six pixels between every tick number and the curve is what made
     * ours climb above the axis and back below it along a single axis - the
     * thing a reader notices first, and the reason this exemption exists.
     * Measured on `trig-graphs.shift` before it: the numbers came out 4.2 to
     * 4.9px from the curve, near it but never through it, and **every layout
     * was rejected**.
     *
     * This is the same principle the gridline already has in `scene.ts` - "a
     * ruling is not that kind of ink". It is narrow on purpose: a scale number
     * must still clear every other kind of ink, must still not collide with
     * another label, and must still sit inside the view. Only the plotted
     * curve is forgiven, and only for a number that is part of a scale.
     */
    const isScale = l.role === 'tick-x' || l.role === 'tick-y';

    for (const cv of curves) {
      if (hit !== null) break;
      if (isScale) break;
      // a point marked on a circle is labelled from that circle
      if (cv.onIt(l.anchor)) continue;
      for (const [a, b] of cv.samples) {
        // Curves count too. Measured across every figure, exactly one was
        // putting labels across its own arcs — so this is a repair, not a
        // hardening, and the exemption above is what keeps a point marked on
        // a circle legitimately labelled from it.
        if (!fig.scene.labelsMayCrossCurves && crossesBox(l.box, a, b)) { hit = 0; break; }
        const d = gapTo(a, b);
        if (d < CLEARANCE) { hit = d; break; }
      }
    }
    if (hit !== null) {
      out.push({
        kind: 'LABEL SITS ON A LINE',
        detail: `"${l.text}" is ${hit.toFixed(1)}px from ink it does not label`,
      });
    }
  }

  // ── 4b. no two strokes leave a point almost together ───────────────────
  //
  // Two lines out of the same point a few degrees apart read as one thick
  // line, and any arc drawn between them is too thin to see. A north arrow
  // running alongside the leg it measures from is the case that prompted this:
  // the picture was saying the question could not be asked that way round.
  for (let i = 0; i < segments.length; i++) {
    for (let j = i + 1; j < segments.length; j++) {
      const [a1, b1] = segments[i], [a2, b2] = segments[j];
      // the shared end, and the direction each runs away from it
      const ends: [Pt, Pt, Pt][] = [];
      if (dist(a1, a2) < 1) ends.push([a1, b1, b2]);
      else if (dist(a1, b2) < 1) ends.push([a1, b1, a2]);
      else if (dist(b1, a2) < 1) ends.push([b1, a1, b2]);
      else if (dist(b1, b2) < 1) ends.push([b1, a1, a2]);
      for (const [at, p1, p2] of ends) {
        if (dist(at, p1) < 12 || dist(at, p2) < 12) continue;   // stubs, not lines
        const between = angleAt(at, p1, p2);
        // Exactly together is a construction, not a fault: the chord figure
        // draws the height from the chord up to the arc straight through the
        // centre, so two of its strokes leave that point at 0 degrees and one
        // lies inside the other. What cannot be read is the sliver a few
        // degrees opens up.
        if (between > 1 && between < 7) {
          out.push({
            kind: 'TWO LINES ALMOST ON TOP OF EACH OTHER',
            detail: `they leave the same point ${between.toFixed(1)}° apart`,
          });
        }
      }
    }
  }

  // ── 5. everything is inside the view ────────────────────────────────────
  const v = p.view;
  for (const l of p.labels) {
    if (l.box.x < v.x - 0.01 || l.box.y < v.y - 0.01 ||
        l.box.x + l.box.w > v.x + v.w + 0.01 || l.box.y + l.box.h > v.y + v.h + 0.01) {
      out.push({ kind: 'LABEL OUTSIDE THE VIEW', detail: `"${l.text}"` });
    }
  }

  // ── 6. nothing too small to read or to label ────────────────────────────
  for (const [a, b] of measurable) {
    if (dist(a, b) < 26) {
      out.push({ kind: 'SEGMENT TOO SHORT', detail: `${dist(a, b).toFixed(1)}px — no room for a label` });
      break;
    }
  }
  for (const e of fig.scene.elements) {
    if (e.kind !== 'arc') continue;
    const sweep = ((e.to - e.from) % 360 + 360) % 360;
    if (sweep < 12 || sweep > 348) {
      out.push({ kind: 'ARC TOO SMALL', detail: `${sweep.toFixed(1)}° is not legible` });
    }
  }

  // ── 7. the drawing follows the page ─────────────────────────────────────
  const svg = renderScene(fig.scene);
  const colour = svg.match(/(?:fill|stroke)="(?!none|currentColor)([^"]+)"/);
  if (colour) {
    out.push({ kind: 'HARDCODED COLOUR', detail: `${colour[1]} — will not follow dark mode or print` });
  }
  if (!/viewBox="/.test(svg)) {
    out.push({ kind: 'NO VIEWBOX', detail: 'the diagram will not scale' });
  }

  return out;
}

/**
 * Is this configuration drawable at all?
 *
 * Called before a scene is built, so an impossible figure is never constructed
 * — sides that break the triangle inequality, angles that do not sum to 180.
 */
export const triangleExists = (a: number, b: number, c: number): boolean =>
  a > 0 && b > 0 && c > 0 && a + b > c && b + c > a && c + a > b;

/** A triangle drawn this flat has no room for labels inside it. */
export function tooFlat(A: Pt, B: Pt, C: Pt, minDeg = 22): boolean {
  return angleAt(A, B, C) < minDeg || angleAt(B, A, C) < minDeg || angleAt(C, A, B) < minDeg;
}

export { unit };
