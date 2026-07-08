// Animated recreation of the full Clelland Maths logo.
// Geometry pixel-measured from the logo asset (836x536 trimmed canvas) using
// a labelled coordinate-grid overlay compared directly against source pixels:
// circle c(494.5,206.5) r192; square tangent to the circle (side = radius).
// There is no separate "arrow" shape at all. The square's top and right
// edges are outer silhouette boundaries (mint fill ending, no stroke drawn),
// while its corner — the lune between the square's corner and the circle's
// own arc — is simply left unfilled (black), which alone produces the
// arrow-like point. The only internal divider strokes are the vertical
// diameter (also the square's left edge) and the square's bottom edge.
// Pi is centred in the top-left quadrant, measured directly off the source
// (bbox centre ~413,133, not the quadrant bounding-box centre — the glyph
// sits closer to the circle's centre than a naive bbox-center placement).
const MINT = 'var(--signal-mint)';

// Lune: square's corner region outside the circle — top edge, right edge,
// then the circle's own arc back to the start. Filling this black (i.e.
// NOT filling it mint) is the entire "arrow".
const LUNE = 'M 494.5 14.5 L 686.5 14.5 L 686.5 206.5 A 192 192 0 0 0 494.5 14.5 Z';

function anim(delay: number, duration?: number): React.CSSProperties {
  return {
    animationDelay: `${delay}s`,
    ...(duration ? { animationDuration: `${duration}s` } : {}),
  };
}

export default function LogoAnimation({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: '836 / 536' }} aria-hidden="true">
      <svg viewBox="0 0 836 536" fill="none" className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="cm-mark">
            <rect x="0" y="0" width="836" height="536" fill="white" />
            {/* the lune — corner cut, this alone creates the arrow-like point */}
            <path d={LUNE} fill="black" />
            {/* vertical diameter (also the square's left edge) */}
            <path d="M 494.5 14.5 L 494.5 398.5" stroke="black" strokeWidth="17" />
            {/* square's bottom edge — internal divider between square and circle-quadrant fill */}
            <path d="M 494.5 206.5 L 686.5 206.5" stroke="black" strokeWidth="16" />
            {/* pi — centred in the top-left quadrant */}
            <path d="M 372 100 L 391 90 L 458 90" stroke="black" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 404 90 L 404 176" stroke="black" strokeWidth="28" strokeLinecap="round" />
            <path d="M 440 90 L 440 162 L 455 174" stroke="black" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
          </mask>
          <mask id="cm-notch">
            <rect x="0" y="0" width="836" height="536" fill="white" />
            {/* L-shaped right-angle marker — corner square stays mint */}
            <path d="M 740 446 L 740 514" stroke="black" strokeWidth="15" />
            <path d="M 732 454 L 802 454" stroke="black" strokeWidth="15" />
          </mask>
        </defs>

        {/* Phase 2 — mint fills with knockout holes */}
        <g className="geo-shape" style={anim(1.5)}>
          <g mask="url(#cm-mark)">
            <rect x="494.5" y="14.5" width="192" height="192" fill={MINT} />
            <circle cx="494.5" cy="206.5" r="192" fill={MINT} />
          </g>
          {/* triangle over the circle — the arc never shows through it */}
          <g mask="url(#cm-notch)">
            <path d="M 351 514 L 802 514 L 802 63 Z" fill={MINT} />
          </g>
        </g>

        {/* Phase 1 — construction strokes (fade out as the fill arrives) */}
        <g className="geo-construction" style={{ ...anim(1.5), '--geo-len': 100 } as React.CSSProperties}>
          <circle cx="494.5" cy="206.5" r="192" stroke={MINT} strokeWidth="2.5" pathLength={100} className="geo-line" style={anim(0, 0.9)} />
          <path d="M 351 514 L 802 514 L 802 63 Z" stroke={MINT} strokeWidth="2.5" strokeLinejoin="round" pathLength={100} className="geo-line" style={anim(0.15, 0.9)} />
          <path d="M 494.5 14.5 L 494.5 398.5" stroke={MINT} strokeWidth="2.5" pathLength={100} className="geo-line" style={anim(0.5, 0.9)} />
          <path d="M 494.5 206.5 L 686.5 206.5" stroke={MINT} strokeWidth="2.5" pathLength={100} className="geo-line" style={anim(0.65, 0.9)} />
          <path d={LUNE} stroke={MINT} strokeWidth="2.5" strokeLinejoin="round" pathLength={100} className="geo-line" style={anim(0.8, 0.9)} />
          <path d="M 740 446 L 740 514" stroke={MINT} strokeWidth="2.5" pathLength={100} className="geo-line" style={anim(0.9, 0.9)} />
          <path d="M 732 454 L 802 454" stroke={MINT} strokeWidth="2.5" pathLength={100} className="geo-line" style={anim(0.95, 0.9)} />
          <path d="M 372 100 L 391 90 L 458 90" stroke={MINT} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength={100} className="geo-line" style={anim(0.95, 0.9)} />
          <path d="M 404 90 L 404 176" stroke={MINT} strokeWidth="4" strokeLinecap="round" pathLength={100} className="geo-line" style={anim(1.05, 0.9)} />
          <path d="M 440 90 L 440 162 L 455 174" stroke={MINT} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength={100} className="geo-line" style={anim(1.15, 0.9)} />
        </g>
      </svg>

      {/* Phase 3 — the real wordmark stamps in */}
      <img
        src="/img/logo/wordmark.png"
        alt=""
        className="geo-stamp absolute inset-0 w-full h-full"
        style={anim(2.2)}
      />
    </div>
  );
}
