// Animated recreation of the full Clelland Maths logo.
// Phase 1: construction strokes draw the geometry. Phase 2: the mint region
// (circle UNION square UNION triangle, exactly as in the logo) flood-fills
// while construction lines fade; the knockouts — pi, vertical diameter, square
// frame, arrow shaft + solid arrowhead, notch — are held as holes by an SVG
// mask. Phase 3: the real raster wordmark stamps in on top.
// Coordinate space matches the trimmed logo asset (836x536) pixel-for-pixel,
// so the wordmark overlay needs no alignment.
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
            <path d="M 490 34 L 490 394" stroke="black" strokeWidth="16" />
            {/* square frame */}
            <path d="M 490 214 L 490 29 L 675 29 L 675 214 Z" stroke="black" strokeWidth="14" />
            {/* arrow shaft + solid arrowhead, tip at the square's corner */}
            <path d="M 490 214 L 630 74" stroke="black" strokeWidth="16" />
            <polygon points="665,39 644,96 608,60" fill="black" />
            {/* pi */}
            <path d="M 356 112 Q 364 100 379 100 L 461 100" stroke="black" strokeWidth="28" strokeLinecap="round" />
            <path d="M 398 100 L 398 190" stroke="black" strokeWidth="28" strokeLinecap="round" />
            <path d="M 436 100 L 436 174 Q 436 190 452 187" stroke="black" strokeWidth="28" strokeLinecap="round" />
            {/* notch square */}
            <rect x="740" y="459" width="40" height="40" fill="black" />
          </mask>
        </defs>

        {/* Phase 2 — mint fill (circle + square + triangle) with knockout holes */}
        <g className="geo-shape" style={anim(1.5)} mask="url(#cm-knockouts)">
          <path d="M 352 512 L 802 512 L 802 62 Z" fill={MINT} />
          <rect x="490" y="29" width="185" height="185" fill={MINT} />
          <circle cx="490" cy="214" r="180" fill={MINT} />
        </g>

        {/* Phase 1 — construction strokes (fade out as the fill arrives) */}
        <g className="geo-construction" style={{ ...anim(1.5), '--geo-len': 100 } as React.CSSProperties}>
          <circle cx="490" cy="214" r="180" stroke={MINT} strokeWidth="2.5" pathLength={100} className="geo-line" style={anim(0, 0.9)} />
          <path d="M 352 512 L 802 512 L 802 62 Z" stroke={MINT} strokeWidth="2.5" strokeLinejoin="round" pathLength={100} className="geo-line" style={anim(0.15, 0.9)} />
          <path d="M 490 34 L 490 394" stroke={MINT} strokeWidth="2.5" pathLength={100} className="geo-line" style={anim(0.5, 0.9)} />
          <path d="M 490 214 L 490 29 L 675 29 L 675 214 Z" stroke={MINT} strokeWidth="2.5" pathLength={100} className="geo-line" style={anim(0.65, 0.9)} />
          <path d="M 490 214 L 630 74" stroke={MINT} strokeWidth="2.5" strokeLinecap="round" pathLength={100} className="geo-line" style={anim(0.8, 0.9)} />
          <path d="M 665 39 L 644 96 L 608 60 Z" stroke={MINT} strokeWidth="2.5" strokeLinejoin="round" pathLength={100} className="geo-line" style={anim(0.95, 0.9)} />
          <rect x="740" y="459" width="40" height="40" stroke={MINT} strokeWidth="2.5" pathLength={100} className="geo-line" style={anim(0.9, 0.9)} />
          <path d="M 356 112 Q 364 100 379 100 L 461 100" stroke={MINT} strokeWidth="4" strokeLinecap="round" pathLength={100} className="geo-line" style={anim(0.9, 0.9)} />
          <path d="M 398 100 L 398 190" stroke={MINT} strokeWidth="4" strokeLinecap="round" pathLength={100} className="geo-line" style={anim(1, 0.9)} />
          <path d="M 436 100 L 436 174 Q 436 190 452 187" stroke={MINT} strokeWidth="4" strokeLinecap="round" pathLength={100} className="geo-line" style={anim(1.1, 0.9)} />
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
