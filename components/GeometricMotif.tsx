export default function GeometricMotif({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Arc — quarter circle construction */}
      <path
        d="M 40 220 A 180 180 0 0 1 220 40"
        stroke="var(--signal-mint)"
        strokeWidth="2"
        className="geo-line"
        style={{ '--geo-len': 290, animationDelay: '0.1s' } as React.CSSProperties}
      />

      {/* Right-angle triangle */}
      <path
        d="M 130 320 L 130 130 L 320 320 Z"
        stroke="var(--signal-mint)"
        strokeWidth="2"
        strokeLinejoin="round"
        className="geo-line"
        style={{ '--geo-len': 620, animationDelay: '0.5s' } as React.CSSProperties}
      />

      {/* Hypotenuse extended as a ray, with arrowhead */}
      <path
        d="M 130 130 L 355 355 M 340 335 L 358 358 L 335 340"
        stroke="var(--signal-mint)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="geo-line"
        style={{ '--geo-len': 340, animationDelay: '1s' } as React.CSSProperties}
      />

      {/* Right-angle mark */}
      <path
        d="M 130 300 L 150 300 L 150 320"
        stroke="var(--signal-mint)"
        strokeWidth="2"
        className="geo-line"
        style={{ '--geo-len': 40, animationDelay: '1.3s' } as React.CSSProperties}
      />

      {/* Pi symbol */}
      <path
        d="M 55 110 L 105 110 M 68 110 L 68 155 M 92 110 L 92 145 Q 92 155 100 155"
        stroke="var(--signal-mint)"
        strokeWidth="4"
        strokeLinecap="round"
        className="geo-line"
        style={{ '--geo-len': 140, animationDelay: '1.5s' } as React.CSSProperties}
      />
    </svg>
  );
}
