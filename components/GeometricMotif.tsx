// Animated construction of the actual Clelland Maths logo mark:
// pie-chart circle split by a vertical diameter, 45° growth arrow out of the
// top-right, pi symbol left of the diameter, right triangle behind (hypotenuse
// parallel to the arrow) with the detached square notch at its right angle.
export default function GeometricMotif({ className = '' }: { className?: string }) {
  const stroke = 'var(--signal-mint)';

  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ '--geo-len': 100 } as React.CSSProperties}
    >
      {/* Right triangle — background shape, drawn first */}
      <path
        d="M 150 385 L 370 385 L 370 165 Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
        pathLength={100}
        className="geo-line"
        style={{ animationDelay: '0.4s' }}
      />

      {/* Square notch inside the triangle's right angle */}
      <rect
        x="325"
        y="340"
        width="28"
        height="28"
        stroke={stroke}
        strokeWidth="2"
        pathLength={100}
        className="geo-line"
        style={{ animationDelay: '1.4s' }}
      />

      {/* Circle */}
      <circle
        cx="170"
        cy="145"
        r="130"
        stroke={stroke}
        strokeWidth="2"
        pathLength={100}
        className="geo-line"
        style={{ animationDelay: '0.1s' }}
      />

      {/* Vertical diameter — the pie cut */}
      <path
        d="M 170 15 L 170 275"
        stroke={stroke}
        strokeWidth="2"
        pathLength={100}
        className="geo-line"
        style={{ animationDelay: '1s' }}
      />

      {/* Arrow shaft — 45° out of the centre, past the circle's edge */}
      <path
        d="M 170 145 L 266 49"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        pathLength={100}
        className="geo-line"
        style={{ animationDelay: '1.3s' }}
      />

      {/* Solid arrowhead — appears once the shaft arrives */}
      <polygon
        points="285,30 278,60 255,37"
        fill={stroke}
        className="geo-fill"
        style={{ animationDelay: '1.7s' }}
      />

      {/* Pi — bar, left leg, right leg with curl */}
      <path
        d="M 82 102 Q 88 96 96 96 L 152 96"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
        pathLength={100}
        className="geo-line"
        style={{ animationDelay: '1.8s' }}
      />
      <path
        d="M 103 96 L 103 162"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
        pathLength={100}
        className="geo-line"
        style={{ animationDelay: '1.95s' }}
      />
      <path
        d="M 133 96 L 133 150 Q 133 162 145 160"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
        pathLength={100}
        className="geo-line"
        style={{ animationDelay: '2.1s' }}
      />
    </svg>
  );
}
