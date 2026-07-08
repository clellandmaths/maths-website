// Animated recreation of the full Clelland Maths logo.
// Geometry pixel-measured from the logo asset (836x536 trimmed canvas):
// circle c(494.5,206.5) r192; the square is tangent to the circle (side = r,
// top side on the top tangent, right side on the right tangent), so the
// arrowhead is the lune between the square's corner and the circle's arc —
// its concave base IS the arc. Knockouts: circle outline, square outline,
// vertical diameter, the 45-degree shaft bisecting the top-right quadrant,
// pi (centred in the top-left quadrant), and the L-shaped right-angle marker
// on the triangle (its corner square stays mint). The triangle is drawn over
// the circle, so the arc never shows through it — matching the real mark.
// Phases: construction strokes draw -> mint fills flood in (masked) -> the
// real raster wordmark stamps on top.
const MINT = 'var(--signal-mint)';

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
            {/* circle outline — the arc that shapes the arrowhead's base */}
            <circle cx="494.5" cy="206.5" r="192" stroke="black" strokeWidth="16" />
            {/* square outline (tangent square) */}
            <rect x="494.5" y="14.5" width="192" height="192" stroke="black" strokeWidth="16" />
            {/* vertical diameter */}
            <path d="M 494.5 14.5 L 494.5 398.5" stroke="black" strokeWidth="17" />
            {/* shaft bisecting the top-right quadrant */}
            <path d="M 494.5 206.5 L 630 71" stroke="black" strokeWidth="16" />
            {/* pi — centred in the top-left quadrant */}
            <path d="M 357 82 L 376 72 L 443 72" stroke="black" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 389 72 L 389 158" stroke="black" strokeWidth="28" strokeLinecap="round" />
            <path d="M 425 72 L 425 144 L 440 156" stroke="black" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
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
            {/* arrowhead tip poking past the square's corner */}
            <polygon points="700,1 680,53 648,21" fill={MINT} />
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
          <path d="M 494.5 206.5 L 686.5 206.5 L 686.5 14.5 L 494.5 14.5" stroke={MINT} strokeWidth="2.5" pathLength={100} className="geo-line" style={anim(0.65, 0.9)} />
          <path d="M 494.5 206.5 L 630 71" stroke={MINT} strokeWidth="2.5" strokeLinecap="round" pathLength={100} className="geo-line" style={anim(0.8, 0.9)} />
          <path d="M 700 1 L 680 53 L 648 21 Z" stroke={MINT} strokeWidth="2.5" strokeLinejoin="round" pathLength={100} className="geo-line" style={anim(0.95, 0.9)} />
          <path d="M 740 446 L 740 514" stroke={MINT} strokeWidth="2.5" pathLength={100} className="geo-line" style={anim(0.9, 0.9)} />
          <path d="M 732 454 L 802 454" stroke={MINT} strokeWidth="2.5" pathLength={100} className="geo-line" style={anim(0.95, 0.9)} />
          <path d="M 357 82 L 376 72 L 443 72" stroke={MINT} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength={100} className="geo-line" style={anim(0.95, 0.9)} />
          <path d="M 389 72 L 389 158" stroke={MINT} strokeWidth="4" strokeLinecap="round" pathLength={100} className="geo-line" style={anim(1.05, 0.9)} />
          <path d="M 425 72 L 425 144 L 440 156" stroke={MINT} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength={100} className="geo-line" style={anim(1.15, 0.9)} />
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
