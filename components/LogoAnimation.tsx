// Animated recreation of the full Clelland Maths logo.
// Phase 1: construction strokes draw the geometry (circle, diameter, square +
// corner-to-corner arrow, triangle, notch, pi). Phase 2: shapes flood-fill mint
// while the construction lines fade — knockouts stay as holes via an SVG mask.
// Phase 3: the solid arrowhead pops at the square's corner. Phase 4: the real
// raster wordmark (extracted from the logo file) stamps in on top.
// Coordinate space matches the trimmed logo asset (836x536) exactly, so the
// wordmark overlay needs no alignment.
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
          <mask id="cm-knockouts">
            <rect x="0" y="0" width="836" height="536" fill="white" />
            {/* vertical diameter */}
            <path d="M 483 33 L 483 377" stroke="black" strokeWidth="10" />
            {/* square frame */}
            <path d="M 483 205 L 483 45 L 643 45 L 643 205 Z" stroke="black" strokeWidth="9" />
            {/* corner-to-corner arrow shaft */}
            <path d="M 483 205 L 643 45" stroke="black" strokeWidth="10" />
            {/* pi */}
            <path d="M 352 115 Q 360 104 374 104 L 456 104" stroke="black" strokeWidth="22" strokeLinecap="round" />
            <path d="M 392 104 L 392 196" stroke="black" strokeWidth="22" strokeLinecap="round" />
            <path d="M 430 104 L 430 180 Q 430 196 446 193" stroke="black" strokeWidth="22" strokeLinecap="round" />
            {/* notch square */}
            <rect x="663" y="433" width="39" height="39" fill="black" />
          </mask>
        </defs>

        {/* Phase 2 — mint fills with knockout holes */}
        <g className="geo-shape" style={anim(1.5)} mask="url(#cm-knockouts)">
          <path d="M 302 505 L 735 505 L 735 72 Z" fill={MINT} />
          <circle cx="483" cy="205" r="172" fill={MINT} />
        </g>

        {/* Phase 3 — solid arrowhead past the square's corner */}
        <polygon points="672,16 662,54 634,26" fill={MINT} className="geo-fill" style={anim(2.15)} />

        {/* Phase 1 — construction strokes (fade out as the fills arrive) */}
        <g className="geo-construction" style={{ ...anim(1.5), '--geo-len': 100 } as React.CSSProperties}>
          <circle cx="483" cy="205" r="172" stroke={MINT} strokeWidth="2.5" pathLength={100} className="geo-line" style={anim(0, 0.9)} />
          <path d="M 302 505 L 735 505 L 735 72 Z" stroke={MINT} strokeWidth="2.5" strokeLinejoin="round" pathLength={100} className="geo-line" style={anim(0.15, 0.9)} />
          <path d="M 483 33 L 483 377" stroke={MINT} strokeWidth="2.5" pathLength={100} className="geo-line" style={anim(0.5, 0.9)} />
          <path d="M 483 205 L 483 45 L 643 45 L 643 205 Z" stroke={MINT} strokeWidth="2.5" pathLength={100} className="geo-line" style={anim(0.65, 0.9)} />
          <path d="M 483 205 L 643 45" stroke={MINT} strokeWidth="2.5" strokeLinecap="round" pathLength={100} className="geo-line" style={anim(0.8, 0.9)} />
          <rect x="663" y="433" width="39" height="39" stroke={MINT} strokeWidth="2.5" pathLength={100} className="geo-line" style={anim(0.9, 0.9)} />
          <path d="M 352 115 Q 360 104 374 104 L 456 104" stroke={MINT} strokeWidth="4" strokeLinecap="round" pathLength={100} className="geo-line" style={anim(0.9, 0.9)} />
          <path d="M 392 104 L 392 196" stroke={MINT} strokeWidth="4" strokeLinecap="round" pathLength={100} className="geo-line" style={anim(1, 0.9)} />
          <path d="M 430 104 L 430 180 Q 430 196 446 193" stroke={MINT} strokeWidth="4" strokeLinecap="round" pathLength={100} className="geo-line" style={anim(1.1, 0.9)} />
        </g>
      </svg>

      {/* Phase 4 — the real wordmark stamps in */}
      <img
        src="/img/logo/wordmark.png"
        alt=""
        className="geo-stamp absolute inset-0 w-full h-full"
        style={anim(2.4)}
      />
    </div>
  );
}
