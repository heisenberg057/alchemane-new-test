'use client';

/** Oversized chrome "NATURAL" band with 100% badge over the N (SVG for full-bleed fit). */
export function Wordmark() {
  return (
    <div className="wordmark" aria-hidden="true">
      <svg viewBox="0 0 1000 150" role="presentation">
        <defs>
          <linearGradient id="ahlV2Chrome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="10%" stopColor="#f2f4f6" />
            <stop offset="28%" stopColor="#d3d9de" />
            <stop offset="44%" stopColor="#fafbfc" />
            <stop offset="52%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#c6ced5" />
            <stop offset="74%" stopColor="#e2e7ea" />
            <stop offset="90%" stopColor="#f4f6f8" />
            <stop offset="100%" stopColor="#dce1e5" />
          </linearGradient>
          <linearGradient id="ahlV2BadgeFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4686fe" />
            <stop offset="100%" stopColor="#1769ff" />
          </linearGradient>
          <filter id="ahlV2BadgeLift" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="2.5"
              floodColor="#1769ff"
              floodOpacity="0.38"
            />
          </filter>
        </defs>

        <text
          className="wordmark__glyphs"
          x="500"
          y="147"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
          textAnchor="middle"
          fill="#b8c0c7"
          opacity="0.32"
        >
          NATURAL
        </text>

        <text
          className="wordmark__glyphs"
          x="500"
          y="144"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
          textAnchor="middle"
          fill="url(#ahlV2Chrome)"
        >
          NATURAL
        </text>

        <g className="wordmark__badgeMark" filter="url(#ahlV2BadgeLift)">
          <circle cx="18" cy="15" r="23" fill="url(#ahlV2BadgeFill)" />
          <text
            className="wordmark__badge"
            x="18"
            y="20"
            textAnchor="middle"
            transform="rotate(-25 18 15)"
            fill="#ffffff"
          >
            100%
          </text>
        </g>
      </svg>
    </div>
  );
}
