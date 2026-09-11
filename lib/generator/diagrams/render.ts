import { type Element, type Pt, type Scene, add, bearing, pt, scale, sub, unit, LABEL_CLEARANCE } from './scene';

/**
 * Projecting a scene to SVG.
 *
 * Two passes, and the order is the point:
 *
 *   1. project the geometry to pixels, y flipped
 *   2. place every label in pixel space around its anchor
 *   3. take the bounding box of geometry *and* label boxes
 *   4. make that the viewBox
 *
 * Because the viewBox is derived from the content after the labels are placed,
 * a clipped diagram is not expressible. That removes a whole class of failure
 * without anyone having to look.
 *
 * Everything is drawn in `currentColor` so the diagram follows the page in
 * light mode, dark mode and print. verify.ts asserts no colour is hardcoded.
 */

const FONT = 13;
const SMALL = 11;
const MARGIN = 6;
const TARGET = 250;          // px across the geometry, before labels are added
/** The strip reserved under a not-to-scale figure for its note. */
const NOTE_STRIP = 13;
/** Clear space between a label's nearest edge and the thing it labels. */
const GAP = 8;
/**
 * Angle numbers sit closer than that.
 *
 * They are pushed outward from a point on their own arc, so the gap is between
 * the number and the curve it belongs to — and a number that stands well off
 * its arc stops looking like it is measuring that angle.
 */
const GAP_SMALL = 5;

/**
 * Estimated width of a string at a given font size.
 *
 * There is no DOM at generation time, so this is a per-character table rather
 * than a measurement, and it is deliberately generous: over-estimating makes
 * the collision check reject a layout that would have been fine, which is the
 * safe direction. Under-estimating would let two labels overlap on the page.
 */
export function textWidth(s: string, size: number): number {
  let w = 0;
  for (const ch of s) {
    if (/[A-Z]/.test(ch)) w += 0.70;
    else if (/[a-z0-9]/.test(ch)) w += 0.56;
    else if (/[.,'·]/.test(ch)) w += 0.30;
    else if (ch === ' ') w += 0.30;
    else w += 0.60;                       // °, √, cm — assume wide
  }
  return w * size * 1.12;
}

export interface Box { x: number; y: number; w: number; h: number }

export interface Placed {
  /** Geometry in pixel space, y already flipped. */
  px: (p: Pt) => Pt;
  /** `anchor` is the point the routine named, in pixels — the thing the
   *  label belongs to. Checks need it to tell a label that is beside its own
   *  vertex from one that has drifted onto unrelated ink. */
  labels: { text: string; at: Pt; anchor: Pt; away: Pt; box: Box; size: number;
            role?: 'tick-x' | 'tick-y'; rotate?: boolean }[];
  view: Box;
}

const boxesOverlap = (a: Box, b: Box): boolean =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

export const overlaps = boxesOverlap;

/**
 * An ellipse element's sweep, with the whole-ellipse default filled in.
 *
 * `from`/`to` are optional so a complete rim reads as `{ centre, rx, ry }`
 * rather than `{ ..., from: 0, to: 360 }`, and 0→360 is the same pair of
 * numbers as 0→0 once reduced, so the two callers that need the sweep resolve
 * it here rather than each guessing.
 */
export const ellipseSweep = (e: { from?: number; to?: number }): [number, number] =>
  [e.from ?? 0, e.to ?? 360];

/**
 * A point on an ellipse at parameter `deg`, turned by its tilt.
 *
 * The parameter is not the angle from the centre once the ellipse is turned,
 * which is why every place that walks an ellipse goes through this rather than
 * writing the cosines out. Three of them did, and adding the tilt to one and
 * not the others would have left the drawing and the checks disagreeing about
 * where the curve is.
 */
export function onEllipse(
  e: { centre: Pt; rx: number; ry: number; tilt?: number }, deg: number,
): Pt {
  const t = deg * Math.PI / 180;
  const [x, y] = [e.rx * Math.cos(t), e.ry * Math.sin(t)];
  if (!e.tilt) return pt(e.centre.x + x, e.centre.y + y);
  const p = e.tilt * Math.PI / 180;
  const [c, s] = [Math.cos(p), Math.sin(p)];
  return pt(e.centre.x + x * c - y * s, e.centre.y + x * s + y * c);
}

/** Gap between two boxes: 0 when they overlap or touch. */
function boxGap(a: Box, b: Box): number {
  const dx = Math.max(b.x - (a.x + a.w), a.x - (b.x + b.w), 0);
  const dy = Math.max(b.y - (a.y + a.h), a.y - (b.y + b.h), 0);
  return Math.hypot(dx, dy);
}

/** Every point the geometry touches, for the first bounding box. */
const dist = (a: Pt, b: Pt): number => Math.hypot(a.x - b.x, a.y - b.y);

/**
 * Does a segment touch a box — crossing it, or with an end inside it?
 *
 * Used only to rank a label's candidate directions, so it is the plain
 * separating-axis test rather than anything cleverer. `verify.ts` keeps its own
 * stricter version, including the clearance margin; this one only has to tell a
 * direction that lands on a line from one that does not.
 */
function boxMeetsSegment(box: Box, p: Pt, q: Pt): boolean {
  const [x0, y0, x1, y1] = [box.x, box.y, box.x + box.w, box.y + box.h];
  const inside = (r: Pt) => r.x >= x0 && r.x <= x1 && r.y >= y0 && r.y <= y1;
  if (inside(p) || inside(q)) return true;
  // the segment's own bounding box has to meet the label's
  if (Math.max(p.x, q.x) < x0 || Math.min(p.x, q.x) > x1) return false;
  if (Math.max(p.y, q.y) < y0 || Math.min(p.y, q.y) > y1) return false;
  // and the four corners must not all fall on one side of the segment's line
  const side = (r: Pt) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  const s = [
    side(pt(x0, y0)), side(pt(x1, y0)), side(pt(x1, y1)), side(pt(x0, y1)),
  ];
  return !(s.every(v => v > 0) || s.every(v => v < 0));
}

/** A box's four corners. */
export const boxCorners = (b: Box): Pt[] => [
  { x: b.x, y: b.y }, { x: b.x + b.w, y: b.y },
  { x: b.x, y: b.y + b.h }, { x: b.x + b.w, y: b.y + b.h },
];

/** Distance from a point to a segment, in pixels. */
export function pointToSegment(p: Pt, a: Pt, b: Pt): number {
  const ab = sub(b, a);
  const len = Math.hypot(ab.x, ab.y);
  if (len < 1e-9) return dist(p, a);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * ab.x + (p.y - a.y) * ab.y) / (len * len)));
  return dist(p, { x: a.x + ab.x * t, y: a.y + ab.y * t });
}

/** Do two segments cross? */
export function segmentsCross(a: Pt, b: Pt, c: Pt, d: Pt): boolean {
  const side = (p: Pt, q: Pt, r: Pt) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  const [d1, d2, d3, d4] = [side(a, b, c), side(a, b, d), side(c, d, a), side(c, d, b)];
  return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0));
}

/** Does a segment cross a box, or end inside it? */
export function crossesBox(box: Box, a: Pt, b: Pt): boolean {
  const inside = (p: Pt) =>
    p.x >= box.x && p.x <= box.x + box.w && p.y >= box.y && p.y <= box.y + box.h;
  if (inside(a) || inside(b)) return true;
  const [c0, c1, c2, c3] = [
    { x: box.x, y: box.y }, { x: box.x + box.w, y: box.y },
    { x: box.x + box.w, y: box.y + box.h }, { x: box.x, y: box.y + box.h },
  ];
  return segmentsCross(a, b, c0, c1) || segmentsCross(a, b, c1, c2)
    || segmentsCross(a, b, c2, c3) || segmentsCross(a, b, c3, c0);
}

/**
 * How far a label box sits from a segment, the way `verify` measures it.
 *
 * **Both sides must use this one.** `place()` used to rank its candidate seats
 * with a coarse crossing test while `verify` rejected anything within
 * `LABEL_CLEARANCE`, so the placer would settle on a seat 1.8px from a line,
 * call it clear, and hand `verify` a figure it was bound to throw out. Because
 * that rejection runs through a retry loop, the layout vanished without a word
 * and the variation read as having fewer questions than it has.
 */
export function labelGap(box: Box, a: Pt, b: Pt): number {
  if (crossesBox(box, a, b)) return 0;
  return Math.min(...boxCorners(box).map(c => pointToSegment(c, a, b)));
}

function geometryPoints(scene: Scene): Pt[] {
  const ps: Pt[] = [];
  for (const e of scene.elements) {
    switch (e.kind) {
      case 'segment': ps.push(e.from, e.to); break;
      case 'gridline': ps.push(e.from, e.to); break;
      case 'polygon': ps.push(...e.points); break;
      case 'circle': ps.push(pt(e.centre.x - e.r, e.centre.y - e.r), pt(e.centre.x + e.r, e.centre.y + e.r)); break;
      case 'arc': {
        // An arc is not a circle. Taking the whole circle's box left a narrow
        // sector adrift in a frame four times the size of the drawing, because
        // everything is scaled to the box and the box was mostly empty.
        //
        // The true extent is the two ends, plus whichever of the four compass
        // extremes the sweep actually passes through.
        const on = (deg: number) => pt(
          e.centre.x + e.r * Math.cos(deg * Math.PI / 180),
          e.centre.y + e.r * Math.sin(deg * Math.PI / 180));
        const sweep = ((e.to - e.from) % 360 + 360) % 360;
        ps.push(on(e.from), on(e.to), e.centre);
        for (const q of [0, 90, 180, 270]) {
          if (((q - e.from) % 360 + 360) % 360 <= sweep) ps.push(on(q));
        }
        break;
      }
      case 'ellipse': {
        // Sampled rather than reasoned about. Untilted, the extent is the two
        // ends plus whichever compass extremes the sweep passes; turned, the
        // extremes move off those four parameters and there is no longer a
        // short list to check. Every ten degrees is finer than the box needs.
        const [from, to] = ellipseSweep(e);
        const sweep = ((to - from) % 360 + 360) % 360 || 360;
        const steps = Math.max(4, Math.ceil(sweep / 10));
        for (let i = 0; i <= steps; i++) ps.push(onEllipse(e, from + sweep * i / steps));
        break;
      }
      case 'shadedSegment': ps.push(pt(e.centre.x - e.r, e.centre.y - e.r),
                                    pt(e.centre.x + e.r, e.centre.y + e.r)); break;
      case 'shadedShape': ps.push(...e.points); break;
      case 'shadedAngle': {
        // the apex and the two corners; the wedge never reaches past its own
        // arms, which are already inside the figure
        ps.push(e.at, ...e.arms.map(a => add(e.at, scale(unit(sub(a, e.at)), e.r))));
        break;
      }
      case 'rightAngle': ps.push(e.at, ...e.arms); break;
      case 'ticks': ps.push(e.from, e.to); break;
      case 'path': ps.push(...e.points); break;
      case 'dot': ps.push(e.at); break;
      case 'label': ps.push(e.anchor); break;
    }
  }
  return ps;
}

/**
 * Work out where everything lands, without emitting anything.
 *
 * Exported so the checks can inspect the same placement the renderer will use,
 * rather than a re-derivation that might differ from it.
 */
export function place(scene: Scene): Placed {
  const ps = geometryPoints(scene);
  const xs = ps.map(p => p.x), ys = ps.map(p => p.y);
  const [minX, maxX] = [Math.min(...xs), Math.max(...xs)];
  const [minY, maxY] = [Math.min(...ys), Math.max(...ys)];
  const spanX = Math.max(maxX - minX, 1e-9);
  const spanY = Math.max(maxY - minY, 1e-9);
  const k = (scene.target ?? TARGET) / Math.max(spanX, spanY);

  // y flips: mathematical up is screen down
  const px = (p: Pt): Pt => pt((p.x - minX) * k, (maxY - p.y) * k);

  // ── the ink a label ought to keep off ─────────────────────────────────
  //
  // Built only to *rank* a label's candidate directions. `verifyFigure` remains
  // the judge of whether the chosen one is acceptable, and that division is
  // what makes a rough test here safe: it can pick a better candidate, never
  // excuse a bad one.
  const ink: [Pt, Pt][] = [];
  for (const e of scene.elements) {
    if (e.kind === 'segment') ink.push([px(e.from), px(e.to)]);
    if (e.kind === 'polygon') {
      for (let i = 0; i < e.points.length; i++) {
        ink.push([px(e.points[i]), px(e.points[(i + 1) % e.points.length])]);
      }
    }
    // A gridline is a ruling rather than ink a label must avoid — see scene.ts.
  }

  const labels: Placed['labels'] = [];
  for (const e of scene.elements) {
    if (e.kind !== 'label') continue;
    const size = e.small ? SMALL : FONT;
    const a = px(e.anchor);
    // A turned label is as wide as a line is tall and as tall as the text is
    // long. Every measurement below - the push distance, the box, the
    // clearance checks that read the box - follows from these two, so the
    // swap is the whole of what rotation costs here.
    const w = e.rotate ? size : textWidth(e.text, size);
    const h = e.rotate ? textWidth(e.text, size) : size;

    /** Where the label lands when pushed away from a given point. */
    const seat = (from: Pt) => {
      // push directly away from the point the routine named, by enough to clear
      // the line or vertex being labelled
      const dir = unit(sub(a, from));
      // How far the label's own box reaches back toward the anchor, along the
      // direction it is being pushed. For an axis-aligned box that is exactly
      // |dir.x|·w/2 + |dir.y|·h/2, so pushing by that plus GAP leaves the box's
      // near edge GAP clear of the anchor whatever shape the text is.
      //
      // This used to use 0.42 rather than the true half-extent, which is fine
      // for a short label and wrong for a long one: "29 kilometres" pushed
      // sideways came out about 3px from the line it was labelling, near enough
      // to touch.
      const reach = Math.abs(dir.x) * w / 2 + Math.abs(dir.y) * h / 2;
      const at = add(a, scale(dir, (e.small ? GAP_SMALL : GAP) + reach));
      return { at, away: from, box: { x: at.x - w / 2, y: at.y - h / 2, w, h } };
    };

    const ownAway = px(e.away);
    const candidates = [e.away, ...(e.alternatives ?? [])].map(p => seat(px(p)));
    let chosen = candidates[0];
    /**
     * The **first** seat that clears, not the roomiest one.
     *
     * A label belongs beside the thing it names, so the preference order is the
     * answer and the search only has to find where it stops being possible.
     * Ranking by largest gap instead optimises the wrong quantity - the seat
     * furthest from every line is the seat furthest from the vertex too, and
     * letters drifted away from the corners they belonged to.
     *
     * "Clears" means what `verify` means by it: at least `LABEL_CLEARANCE` from
     * ink the label does not own. That is the part the original got wrong - it
     * asked only whether the box *crossed* something, so a seat 1.8px from a
     * line counted as clear and the figure was rejected further down the line.
     *
     * When nothing clears, the least bad seat is used and the figure will be
     * rejected by `verify` - which is the honest outcome, and better than
     * pretending.
     */
    if (candidates.length > 1) {
      /**
       * **Comfort first, then the bare minimum.**
       *
       * `LABEL_CLEARANCE` is the least a label may sit from ink it does not
       * label - not a target. Taking the first seat that merely satisfies it
       * put the pyramid's `B` 5.1px from a slant edge and the cuboid's `C`
       * 5.9px from a face, both reading as though they touched, while seats
       * thirty pixels clear sat further down the very same list.
       *
       * Widening the frame did not help, and that is the tell: there was room
       * all along and the rule was refusing to use it.
       */
      const COMFORT = LABEL_CLEARANCE * 2;
      let bestGap = -Infinity;
      let comfortable: typeof chosen | null = null;
      for (const c of candidates) {
        // The same ownership `verify` uses, and for the same reason: it asks
        // what the LABEL belongs to, not what this particular seat happens to
        // sit beside. Keying it on the candidate let the scorer believe a seat
        // was clear of an edge that verify would still measure.
        const owns = (q: Pt) => dist(a, q) < 1 || dist(ownAway, q) < 1;
        /**
         * Scored on the **clearance** `verify` demands, not on intersection.
         *
         * The two disagreed. `verify` rejects a label within `LABEL_CLEARANCE`
         * of ink it does not label; this loop asked only whether the box
         * *crossed* something. So a seat 1.8px from a line scored zero hits,
         * won as the first candidate, and handed `verify` a figure it was
         * certain to reject — and since that rejection goes through a retry
         * loop, the layout was discarded in silence and read as a variation
         * with fewer questions than it has.
         *
         * Inflating the box by the clearance makes the placer look for what
         * the verifier will accept. **Only a label offering alternatives can
         * move**: with one candidate this loop is skipped, so every figure
         * that already placed is untouched.
         */
        let gap = Infinity;
        for (const [s, t] of ink) {
          if (owns(s) || owns(t)) continue;
          gap = Math.min(gap, labelGap(c.box, s, t));
          if (gap <= 0) break;
        }
        for (const l of labels) gap = Math.min(gap, boxGap(c.box, l.box));
        if (gap >= COMFORT) { comfortable = c; break; }
        if (gap >= LABEL_CLEARANCE && bestGap < LABEL_CLEARANCE) {
          // the earliest seat that is merely legal, kept in case none is roomy
          bestGap = gap; chosen = c;
        } else if (gap > bestGap && bestGap < LABEL_CLEARANCE) {
          bestGap = gap; chosen = c;
        }
      }
      if (comfortable) chosen = comfortable;
    }
    /**
     * `away` reports the routine's **own** point, never the chosen candidate.
     *
     * The field does two jobs and they came apart when alternatives arrived. It
     * is the direction a label was pushed, and it is how `verify` knows what the
     * label belongs to: a segment is exempt from the clearance rule when one of
     * its ends sits within a pixel of the anchor or of `away`.
     *
     * A ring of fallbacks puts candidates twelve pixels out in eight directions,
     * and one of those lands on a vertex often enough to matter. Reporting that
     * as `away` told `verify` the label owned every edge meeting that vertex, so
     * it stopped checking them - measured at **0.96px**, just inside the
     * one-pixel threshold. The vector letter sat on the very line it named, in
     * about a third of draws, and nothing failed.
     *
     * Placement uses the chosen seat; ownership uses the routine's own point,
     * which is the one that carries the meaning.
     */
    labels.push({ text: e.text, at: chosen.at, anchor: a, away: px(e.away), size,
                  box: chosen.box, role: e.role, rotate: e.rotate });
  }

  // the view has to hold the geometry *and* the labels
  const gxs = ps.map(p => px(p).x), gys = ps.map(p => px(p).y);
  const allX = [...gxs, ...labels.flatMap(l => [l.box.x, l.box.x + l.box.w])];
  const allY = [...gys, ...labels.flatMap(l => [l.box.y, l.box.y + l.box.h])];
  const view: Box = {
    x: Math.min(...allX) - MARGIN,
    y: Math.min(...allY) - MARGIN,
    w: Math.max(...allX) - Math.min(...allX) + MARGIN * 2,
    // "not drawn to scale" is printed in the bottom-right corner of the view,
    // so on a figure whose lowest label is wide and central the two ran into
    // each other — "0.48 m" through "not drawn to scale" on the gatepost. The
    // note gets a strip of its own instead of a corner of somebody else's.
    h: Math.max(...allY) - Math.min(...allY) + MARGIN * 2 + (scene.notToScale ? NOTE_STRIP : 0),
  };
  return { px, labels, view };
}

const f = (n: number): string => `${Math.round(n * 100) / 100}`;

/** SVG for one element, in pixel space. */
function draw(e: Element, px: (p: Pt) => Pt): string {
  const stroke = (dashed?: boolean) =>
    `fill="none" stroke="currentColor" stroke-width="1.6"${dashed ? ' stroke-dasharray="5 4"' : ''}`;

  switch (e.kind) {
    case 'segment': {
      const [a, b] = [px(e.from), px(e.to)];
      return `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}" ${stroke(e.dashed)}/>`;
    }
    // Thin and pale, so the ruling stays behind everything drawn on it.
    // `currentColor` at reduced opacity rather than a fixed grey, for the same
    // reason every other stroke here uses it: the figure has to work on both
    // grounds and in print.
    case 'gridline': {
      const [a, b] = [px(e.from), px(e.to)];
      return `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}"`
        + ` fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.34"/>`;
    }
    case 'polygon': {
      const d = e.points.map(p => px(p)).map(p => `${f(p.x)},${f(p.y)}`).join(' ');
      return `<polygon points="${d}" ${stroke(e.dashed)} stroke-linejoin="round"/>`;
    }
    case 'circle': {
      const c = px(e.centre);
      const r = Math.abs(px(add(e.centre, pt(e.r, 0))).x - c.x);
      return `<circle cx="${f(c.x)}" cy="${f(c.y)}" r="${f(r)}" ${stroke(e.dashed)}/>`;
    }
    case 'arc': {
      const c = px(e.centre);
      const r = Math.abs(px(add(e.centre, pt(e.r, 0))).x - c.x);
      const p0 = px(add(e.centre, pt(e.r * Math.cos(e.from * Math.PI / 180), e.r * Math.sin(e.from * Math.PI / 180))));
      const p1 = px(add(e.centre, pt(e.r * Math.cos(e.to * Math.PI / 180), e.r * Math.sin(e.to * Math.PI / 180))));
      const sweepDeg = ((e.to - e.from) % 360 + 360) % 360;
      // y is flipped on screen, so an anticlockwise sweep draws clockwise.
      // `stroke()` here took no argument, so an arc marked dashed came out
      // solid — every one in the codebase, silently. A hemisphere hollowed out
      // of a cone was drawn as though it were part of the outline.
      return `<path d="M ${f(p0.x)} ${f(p0.y)} A ${f(r)} ${f(r)} 0 ${sweepDeg > 180 ? 1 : 0} 0 ${f(p1.x)} ${f(p1.y)}" ${stroke(e.dashed)}/>`;
    }
    case 'ellipse': {
      const c = px(e.centre);
      const rx = Math.abs(px(add(e.centre, pt(e.rx, 0))).x - c.x);
      const ry = Math.abs(px(add(e.centre, pt(0, e.ry))).y - c.y);
      // y is flipped on screen, so a turn anticlockwise in the scene draws
      // clockwise on the page
      const tilt = -(e.tilt ?? 0);
      if (e.from === undefined && e.to === undefined) {
        const turn = tilt ? ` transform="rotate(${f(tilt)} ${f(c.x)} ${f(c.y)})"` : '';
        return `<ellipse cx="${f(c.x)}" cy="${f(c.y)}" rx="${f(rx)}" ry="${f(ry)}"${turn} ${stroke(e.dashed)}/>`;
      }
      const [from, to] = ellipseSweep(e);
      const [p0, p1] = [px(onEllipse(e, from)), px(onEllipse(e, to))];
      const sweepDeg = ((to - from) % 360 + 360) % 360;
      return `<path d="M ${f(p0.x)} ${f(p0.y)} A ${f(rx)} ${f(ry)} ${f(tilt)} ` +
        `${sweepDeg > 180 ? 1 : 0} 0 ${f(p1.x)} ${f(p1.y)}" ${stroke(e.dashed)}/>`;
    }
    case 'shadedShape': {
      const d = e.points.map(p => { const q = px(p); return `${f(q.x)},${f(q.y)}`; }).join(' ');
      // the page's own ink at low opacity, so it follows the theme and prints
      return `<polygon points="${d}" fill="currentColor"` +
        ` fill-opacity="${f(0.13 * (e.tone ?? 1))}" stroke="none"/>`;
    }
    case 'shadedAngle': {
      const at = px(e.at);
      const on = (a: Pt) => px(add(e.at, scale(unit(sub(a, e.at)), e.r)));
      const [p0, p1] = [on(e.arms[0]), on(e.arms[1])];
      const rr = Math.abs(px(add(e.at, pt(e.r, 0))).x - at.x);
      // swept the short way round, the way an angle mark is
      const a0 = bearing(e.at, e.arms[0]);
      const a1 = bearing(e.at, e.arms[1]);
      const anticlockwise = ((a1 - a0) % 360 + 360) % 360 <= 180;
      const [q0, q1] = anticlockwise ? [p0, p1] : [p1, p0];
      // filled in the page's own ink at low opacity, so it follows the theme
      // and prints; y is flipped on screen, so an anticlockwise sweep draws
      // clockwise
      return `<path d="M ${f(at.x)} ${f(at.y)} L ${f(q0.x)} ${f(q0.y)} ` +
        `A ${f(rr)} ${f(rr)} 0 0 0 ${f(q1.x)} ${f(q1.y)} Z" ` +
        `fill="currentColor" fill-opacity="0.16" stroke="none"/>`;
    }
    case 'shadedSegment': {
      const on = (deg: number) => px(add(e.centre, pt(
        e.r * Math.cos(deg * Math.PI / 180), e.r * Math.sin(deg * Math.PI / 180))));
      const [p0, p1] = [on(e.from), on(e.to)];
      const c = px(e.centre);
      const rr = Math.abs(px(add(e.centre, pt(e.r, 0))).x - c.x);
      const sweepDeg = ((e.to - e.from) % 360 + 360) % 360;
      // filled in the page's own ink at low opacity, so it follows the theme
      // and prints; the chord and arc are stroked separately as usual
      return `<path d="M ${f(p0.x)} ${f(p0.y)} A ${f(rr)} ${f(rr)} 0 ` +
        `${sweepDeg > 180 ? 1 : 0} 0 ${f(p1.x)} ${f(p1.y)} Z" ` +
        `fill="currentColor" fill-opacity="0.13" stroke="none"/>`;
    }
    case 'rightAngle': {
      const at = px(e.at);
      const u = unit(sub(px(e.arms[0]), at));
      const v = unit(sub(px(e.arms[1]), at));
      const s = 11;
      const p1 = add(at, scale(u, s));
      const p2 = add(add(at, scale(u, s)), scale(v, s));
      const p3 = add(at, scale(v, s));
      return `<path d="M ${f(p1.x)} ${f(p1.y)} L ${f(p2.x)} ${f(p2.y)} L ${f(p3.x)} ${f(p3.y)}" ${stroke()}/>`;
    }
    case 'ticks': {
      const [a, b] = [px(e.from), px(e.to)];
      const m = pt((a.x + b.x) / 2, (a.y + b.y) / 2);
      const along = unit(sub(b, a));
      const across = pt(-along.y, along.x);
      return Array.from({ length: e.count }, (_, i) => {
        const off = (i - (e.count - 1) / 2) * 5;
        const c = add(m, scale(along, off));
        const t1 = add(c, scale(across, 5));
        const t2 = add(c, scale(across, -5));
        return `<line x1="${f(t1.x)}" y1="${f(t1.y)}" x2="${f(t2.x)}" y2="${f(t2.y)}" ${stroke()}/>`;
      }).join('');
    }
    case 'path': {
      // One stroke rather than a run of separate lines: joined, the corners
      // between samples round off and a sampled curve reads as a curve.
      const d = e.points.map(p => px(p))
        .map((p, i) => `${i ? 'L' : 'M'} ${f(p.x)} ${f(p.y)}`).join(' ');
      return `<path d="${d}" ${stroke(e.dashed)} stroke-linejoin="round" stroke-linecap="round"/>`;
    }
    case 'dot': {
      const c = px(e.at);
      // Filled, so it reads as a marked point rather than a small circle in
      // the figure. currentColor, like everything else here, so it follows the
      // theme and prints.
      // The scatter cloud is drawn smaller than a named point, because the
      // papers do: 2016 P1 Q5 makes its D and E plainly bigger than the eight
      // dots around them, so the two the question is about can be picked out
      // of the scatter. Drawn all one size, a named point landing inside the
      // cloud is indistinguishable from it.
      return `<circle cx="${f(c.x)}" cy="${f(c.y)}" r="${e.small ? 2.4 : 4.2}" fill="currentColor" stroke="none"/>`;
    }
    case 'label':
      return '';                            // drawn from the placed labels
  }
}

/**
 * The finished SVG, ready to drop into a question line.
 *
 * Responsive: a viewBox with no fixed width, `width:100%` so it never outgrows
 * its column, and `currentColor` throughout so it prints.
 *
 * **`max-width` is the figure's own width, and it must stay that way.**
 * Everything inside a viewBox is in view units, `font-size` included, so the
 * ratio between the displayed width and `view.w` scales the lettering as well
 * as the drawing. This used to be capped at a flat 320, which meant a figure
 * checked at 571 units across was shown at 56% - 11px lettering rendered at
 * 6.2px, and the "not drawn to scale" note at 5.6px. `verifyFigure` could not
 * see it: verification works in view units and the cap is applied afterwards.
 * Measured, 24 of the 92 figure-bearing topics were over 320.
 *
 * So: one view unit is one CSS pixel wherever the column allows it, and below
 * that the whole figure scales together. If a figure is too wide for the page,
 * the fix is a narrower figure, not a smaller rendering of a wide one.
 */
export function renderScene(scene: Scene): string {
  const p = place(scene);
  const body = scene.elements.map(e => draw(e, p.px)).join('');
  const labels = p.labels.map(l =>
    `<text x="${f(l.at.x)}" y="${f(l.at.y)}" font-size="${l.size}" fill="currentColor"` +
    ` text-anchor="middle" dominant-baseline="central"` +
    (l.rotate ? ` transform="rotate(-90 ${f(l.at.x)} ${f(l.at.y)})"` : '') +
    `>${l.text}</text>`).join('');
  const note = scene.notToScale
    ? `<text x="${f(p.view.x + p.view.w - 2)}" y="${f(p.view.y + p.view.h - 4)}" font-size="10"` +
      ` fill="currentColor" text-anchor="end" opacity="0.75">not drawn to scale</text>`
    : '';
  return `<svg viewBox="${f(p.view.x)} ${f(p.view.y)} ${f(p.view.w)} ${f(p.view.h)}"` +
    ` class="mx-auto block my-4" style="max-width:${Math.round(p.view.w)}px;width:100%"` +
    ` xmlns="http://www.w3.org/2000/svg" role="img">${body}${labels}${note}</svg>`;
}
