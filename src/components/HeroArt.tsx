export function HeroArt() {
  return (
    <div className="relative w-full" style={{ aspectRatio: "1/1", maxWidth: 560 }}>
      <svg viewBox="0 0 600 600" className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id="goldFoil" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#f0d77a" />
            <stop offset="35%" stopColor="#c9a84c" />
            <stop offset="80%" stopColor="#7a5a14" />
            <stop offset="100%" stopColor="#3d2c08" />
          </radialGradient>
          <filter id="grain" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
            <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.42  0 0 0 0 0.15  0 0 0 0.55 0" />
            <feComposite in2="SourceGraphic" operator="in" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
          <filter id="rough">
            <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="3" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="14" />
          </filter>
        </defs>

        {/* thin outline circle, slightly cropped */}
        <circle cx="340" cy="290" r="270" fill="none" stroke="#c9a84c" strokeWidth="1" opacity="0.7" />

        {/* textured gold filled circle */}
        <g>
          <circle cx="320" cy="300" r="220" fill="url(#goldFoil)" />
          <circle cx="320" cy="300" r="220" fill="url(#goldFoil)" filter="url(#grain)" opacity="0.85" />
        </g>

        {/* rough hand-painted brushstroke */}
        <g filter="url(#rough)" opacity="0.95">
          <path
            d="M 30 360
               C 120 300, 240 320, 340 330
               C 440 340, 520 290, 600 280
               L 600 410
               C 500 420, 380 460, 250 430
               C 160 410, 80 440, 30 425 Z"
            fill="#f5f0e8"
          />
        </g>
        <g filter="url(#rough)" opacity="0.6">
          <path d="M 50 380 C 200 340, 380 380, 580 340 L 580 360 C 380 410, 200 380, 50 410 Z" fill="#f5f0e8" />
        </g>
      </svg>
    </div>
  );
}

export function ArchwayArt() {
  return (
    <svg viewBox="0 0 320 360" className="w-full max-w-[280px]">
      <defs>
        <radialGradient id="archGlow" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#f0d77a" />
          <stop offset="40%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#3d2c08" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
      </defs>
      {/* outer thin gold arch outline */}
      <path d="M 30 350 L 30 170 A 130 130 0 0 1 290 170 L 290 350" fill="none" stroke="#c9a84c" strokeWidth="1" opacity="0.7" />
      {/* dark stone walls */}
      <path d="M 50 350 L 50 175 A 110 110 0 0 1 270 175 L 270 350 Z" fill="url(#wall)" />
      {/* glowing arch opening */}
      <path d="M 110 350 L 110 200 A 50 50 0 0 1 210 200 L 210 350 Z" fill="url(#archGlow)" />
      {/* inner bright light core */}
      <ellipse cx="160" cy="220" rx="35" ry="60" fill="#f0d77a" opacity="0.55" />
      {/* steps */}
      {[0,1,2,3,4,5].map((i) => {
        const w = 150 + i * 18;
        const x = 160 - w/2;
        const y = 320 - i * 8;
        return <rect key={i} x={x} y={y} width={w} height={7} fill="#0a0a0a" stroke="#c9a84c" strokeWidth="0.4" opacity={0.9 - i*0.08} />;
      })}
    </svg>
  );
}
