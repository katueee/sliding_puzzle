/**
 * ゆめかわユニコーン＋小動物のSVGイラスト（プレビュー用）
 * App.tsxのcreatePuzzleSvgStringと同じ内容をReactコンポーネントとして描画
 */
const PuzzleImage: React.FC<{ size?: number; className?: string }> = ({
  size = 400,
  className,
}) => (
  <svg
    viewBox="0 0 400 400"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="p-bgGrad" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#fff0f8" />
        <stop offset="25%" stopColor="#f0e0ff" />
        <stop offset="50%" stopColor="#e0e8ff" />
        <stop offset="75%" stopColor="#d8f0f8" />
        <stop offset="100%" stopColor="#f8e8ff" />
      </linearGradient>
      <linearGradient id="p-rainbow" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ffb3b3" />
        <stop offset="16%" stopColor="#ffd0a0" />
        <stop offset="33%" stopColor="#ffffa0" />
        <stop offset="50%" stopColor="#a0ffb0" />
        <stop offset="66%" stopColor="#a0d0ff" />
        <stop offset="83%" stopColor="#c0a0ff" />
        <stop offset="100%" stopColor="#ffa0d0" />
      </linearGradient>
      <linearGradient id="p-maneGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffaadd" />
        <stop offset="35%" stopColor="#ddaaff" />
        <stop offset="70%" stopColor="#aaccff" />
        <stop offset="100%" stopColor="#aaffdd" />
      </linearGradient>
      <linearGradient id="p-hornGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fffbe0" />
        <stop offset="30%" stopColor="#ffccee" />
        <stop offset="70%" stopColor="#ddbbff" />
        <stop offset="100%" stopColor="#bbddff" />
      </linearGradient>
      <radialGradient id="p-glowPink" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffd0e8" stopOpacity={0.6} />
        <stop offset="100%" stopColor="#ffd0e8" stopOpacity={0} />
      </radialGradient>
      <radialGradient id="p-glowBlue" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#d0e8ff" stopOpacity={0.5} />
        <stop offset="100%" stopColor="#d0e8ff" stopOpacity={0} />
      </radialGradient>
      <filter id="p-glow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* 背景 */}
    <rect width="400" height="400" fill="url(#p-bgGrad)" rx="8" />
    {/* ふんわり光 */}
    <circle cx="100" cy="300" r="100" fill="url(#p-glowPink)" />
    <circle cx="320" cy="120" r="80" fill="url(#p-glowBlue)" />
    <circle cx="200" cy="200" r="120" fill="url(#p-glowPink)" opacity="0.3" />

    {/* ふわふわ雲 */}
    <g opacity="0.7">
      <ellipse cx="55" cy="55" rx="45" ry="20" fill="white" />
      <ellipse cx="38" cy="48" rx="28" ry="16" fill="white" />
      <ellipse cx="78" cy="48" rx="30" ry="17" fill="white" />
      <ellipse cx="62" cy="42" rx="18" ry="12" fill="white" />
      <ellipse cx="310" cy="40" rx="40" ry="18" fill="white" />
      <ellipse cx="335" cy="34" rx="25" ry="14" fill="white" />
      <ellipse cx="295" cy="34" rx="22" ry="13" fill="white" />
      <ellipse cx="180" cy="30" rx="34" ry="15" fill="white" />
      <ellipse cx="200" cy="24" rx="22" ry="12" fill="white" />
    </g>

    {/* 虹 */}
    <path d="M 20 220 Q 200 20 380 220" fill="none" stroke="url(#p-rainbow)" strokeWidth="18" opacity="0.35" strokeLinecap="round" />
    <path d="M 40 230 Q 200 50 360 230" fill="none" stroke="url(#p-rainbow)" strokeWidth="10" opacity="0.2" strokeLinecap="round" />

    {/* きらきら星 */}
    {[
      { x: 50, y: 120, s: 8 }, { x: 340, y: 100, s: 6 }, { x: 100, y: 25, s: 5 },
      { x: 290, y: 20, s: 7 }, { x: 370, y: 175, s: 5 }, { x: 22, y: 180, s: 4 },
      { x: 200, y: 65, s: 6 }, { x: 145, y: 50, s: 4 }, { x: 260, y: 55, s: 5 },
      { x: 380, y: 80, s: 3.5 },
    ].map(({ x, y, s }, i) => (
      <g key={i} filter="url(#p-glow)">
        <polygon
          points={`${x},${y - s} ${x + s * 0.3},${y - s * 0.3} ${x + s},${y} ${x + s * 0.3},${y + s * 0.3} ${x},${y + s} ${x - s * 0.3},${y + s * 0.3} ${x - s},${y} ${x - s * 0.3},${y - s * 0.3}`}
          fill="#fffbe0"
          opacity="0.9"
        />
      </g>
    ))}

    {/* ===== ユニコーン ===== */}
    <g transform="translate(110, 120)">
      <ellipse cx="95" cy="115" rx="80" ry="52" fill="white" />
      <ellipse cx="80" cy="108" rx="50" ry="30" fill="#fff5fa" opacity="0.5" />
      <path d="M 45 95 Q 28 55 50 25" stroke="white" strokeWidth="32" fill="none" strokeLinecap="round" />
      <path d="M 50 90 Q 35 60 52 30" stroke="#fff5fa" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.4" />
      <ellipse cx="52" cy="22" rx="32" ry="26" fill="white" />
      <ellipse cx="45" cy="18" rx="18" ry="14" fill="#fff8fc" opacity="0.4" />
      {/* 角 */}
      <polygon points="52,-12 44,22 60,22" fill="url(#p-hornGrad)" />
      <line x1="47" y1="2" x2="57" y2="2" stroke="white" strokeWidth="1.8" opacity="0.8" />
      <line x1="46" y1="8" x2="58" y2="8" stroke="white" strokeWidth="1.5" opacity="0.7" />
      <line x1="45" y1="14" x2="59" y2="14" stroke="white" strokeWidth="1.3" opacity="0.6" />
      <circle cx="52" cy="-10" r="3" fill="#fffbe0" opacity="0.8" />
      {/* 耳 */}
      <ellipse cx="34" cy="4" rx="7" ry="12" fill="white" transform="rotate(-20, 34, 4)" />
      <ellipse cx="34" cy="4" rx="3.5" ry="8" fill="#ffcce0" transform="rotate(-20, 34, 4)" />
      {/* 目 */}
      <ellipse cx="40" cy="24" rx="5" ry="6" fill="#4a3560" />
      <ellipse cx="40" cy="22" rx="2" ry="2.5" fill="white" />
      <circle cx="43" cy="26" r="1" fill="white" opacity="0.6" />
      {/* まつげ */}
      <path d="M 35 19 Q 32 15 30 16" stroke="#4a3560" strokeWidth="1.4" fill="none" />
      <path d="M 37 18 Q 35 14 33 14" stroke="#4a3560" strokeWidth="1.4" fill="none" />
      <path d="M 39 17 Q 38 14 36 13" stroke="#4a3560" strokeWidth="1.2" fill="none" />
      {/* 鼻 */}
      <ellipse cx="32" cy="30" rx="2.5" ry="2" fill="#ffb8d0" />
      {/* ほっぺ */}
      <ellipse cx="30" cy="33" rx="7" ry="4" fill="#ffcce0" opacity="0.45" />
      {/* 口 */}
      <path d="M 35 34 Q 40 40 48 34" stroke="#e088a8" strokeWidth="1.3" fill="none" />
      {/* たてがみ */}
      <path d="M 62 0 Q 85 12 68 38 Q 92 26 74 55 Q 98 42 80 72" fill="none" stroke="url(#p-maneGrad)" strokeWidth="10" strokeLinecap="round" opacity="0.85" />
      <path d="M 58 3 Q 78 18 62 42 Q 84 32 68 60" fill="none" stroke="#ffb3d9" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
      <path d="M 65 -2 Q 82 8 72 28" fill="none" stroke="#aaccff" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
      {/* 前脚 */}
      <path d="M 32 145 Q 15 172 5 200" stroke="white" strokeWidth="15" fill="none" strokeLinecap="round" />
      <path d="M 52 148 Q 35 178 22 200" stroke="white" strokeWidth="15" fill="none" strokeLinecap="round" />
      <ellipse cx="5" cy="202" rx="7" ry="4.5" fill="#ffcce0" />
      <ellipse cx="22" cy="202" rx="7" ry="4.5" fill="#ffcce0" />
      {/* 後脚 */}
      <path d="M 135 145 Q 150 178 155 200" stroke="white" strokeWidth="15" fill="none" strokeLinecap="round" />
      <path d="M 150 140 Q 165 168 175 200" stroke="white" strokeWidth="15" fill="none" strokeLinecap="round" />
      <ellipse cx="155" cy="202" rx="7" ry="4.5" fill="#ffcce0" />
      <ellipse cx="175" cy="202" rx="7" ry="4.5" fill="#ffcce0" />
      {/* しっぽ */}
      <path d="M 168 100 Q 205 72 198 115 Q 212 82 205 128 Q 218 95 210 138" stroke="url(#p-maneGrad)" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.85" />
      {/* 体のきらきら */}
      <circle cx="70" cy="105" r="2" fill="#fffbe0" opacity="0.7" />
      <circle cx="110" cy="100" r="1.5" fill="#fffbe0" opacity="0.6" />
      <circle cx="130" cy="120" r="2" fill="#e0e8ff" opacity="0.5" />
    </g>

    {/* ===== うさぎ ===== */}
    <g transform="translate(290, 265)">
      <ellipse cx="30" cy="55" rx="26" ry="32" fill="white" />
      <circle cx="30" cy="24" r="21" fill="white" />
      <ellipse cx="18" cy="-6" rx="7" ry="21" fill="white" />
      <ellipse cx="18" cy="-6" rx="3.5" ry="16" fill="#ffcce0" />
      <ellipse cx="42" cy="-6" rx="7" ry="21" fill="white" />
      <ellipse cx="42" cy="-6" rx="3.5" ry="16" fill="#ffcce0" />
      <ellipse cx="22" cy="22" rx="3.5" ry="4" fill="#4a3560" />
      <ellipse cx="22" cy="20.5" rx="1.2" ry="1.8" fill="white" />
      <ellipse cx="38" cy="22" rx="3.5" ry="4" fill="#4a3560" />
      <ellipse cx="38" cy="20.5" rx="1.2" ry="1.8" fill="white" />
      <ellipse cx="30" cy="29" rx="3" ry="2.5" fill="#ffb8d0" />
      <path d="M 27 31 Q 30 35 33 31" stroke="#e088a8" strokeWidth="1.2" fill="none" />
      <ellipse cx="15" cy="29" rx="5" ry="3" fill="#ffcce0" opacity="0.45" />
      <ellipse cx="45" cy="29" rx="5" ry="3" fill="#ffcce0" opacity="0.45" />
      <ellipse cx="18" cy="80" rx="8" ry="6" fill="white" />
      <ellipse cx="42" cy="80" rx="8" ry="6" fill="white" />
      <circle cx="50" cy="60" r="6" fill="white" />
      {/* リボン */}
      <path d="M 16 -12 Q 8 -20 4 -12 Q 0 -4 8 -8" fill="#ffaacc" opacity="0.8" />
      <path d="M 16 -12 Q 24 -20 28 -12 Q 32 -4 24 -8" fill="#ffaacc" opacity="0.8" />
      <circle cx="16" cy="-12" r="2" fill="#ff88aa" />
    </g>

    {/* ===== くま ===== */}
    <g transform="translate(20, 285)">
      <ellipse cx="35" cy="50" rx="26" ry="30" fill="#ffe8cc" />
      <circle cx="35" cy="22" r="20" fill="#ffe8cc" />
      <circle cx="16" cy="6" r="9" fill="#ffe8cc" />
      <circle cx="16" cy="6" r="5" fill="#ffcca0" />
      <circle cx="54" cy="6" r="9" fill="#ffe8cc" />
      <circle cx="54" cy="6" r="5" fill="#ffcca0" />
      <ellipse cx="27" cy="20" rx="3" ry="3.5" fill="#4a3560" />
      <ellipse cx="27" cy="18.5" rx="1.2" ry="1.5" fill="white" />
      <ellipse cx="43" cy="20" rx="3" ry="3.5" fill="#4a3560" />
      <ellipse cx="43" cy="18.5" rx="1.2" ry="1.5" fill="white" />
      <ellipse cx="35" cy="27" rx="5" ry="3.5" fill="#ffcca0" />
      <ellipse cx="35" cy="26" rx="2.5" ry="2" fill="#cc8866" />
      <path d="M 32 29 Q 35 33 38 29" stroke="#cc8866" strokeWidth="1.2" fill="none" />
      <ellipse cx="19" cy="27" rx="5" ry="3" fill="#ffcca0" opacity="0.45" />
      <ellipse cx="51" cy="27" rx="5" ry="3" fill="#ffcca0" opacity="0.45" />
      <ellipse cx="18" cy="72" rx="9" ry="7" fill="#ffe8cc" />
      <ellipse cx="52" cy="72" rx="9" ry="7" fill="#ffe8cc" />
      {/* 蝶ネクタイ */}
      <path d="M 28 38 Q 22 32 22 38 Q 22 44 28 38" fill="#aaccff" opacity="0.8" />
      <path d="M 28 38 Q 34 32 34 38 Q 34 44 28 38" fill="#aaccff" opacity="0.8" />
      <circle cx="28" cy="38" r="2" fill="#88aadd" />
    </g>

    {/* ===== ねこ ===== */}
    <g transform="translate(148, 300)">
      <ellipse cx="28" cy="44" rx="20" ry="25" fill="#e8e0f0" />
      <circle cx="28" cy="20" r="17" fill="#e8e0f0" />
      <polygon points="14,7 9,-10 21,3" fill="#e8e0f0" />
      <polygon points="15,5 11,-5 20,3" fill="#ffcce0" />
      <polygon points="42,7 47,-10 35,3" fill="#e8e0f0" />
      <polygon points="41,5 45,-5 36,3" fill="#ffcce0" />
      <ellipse cx="21" cy="18" rx="3" ry="3.5" fill="#4a3560" />
      <ellipse cx="21" cy="16.5" rx="1.2" ry="1.5" fill="white" />
      <ellipse cx="35" cy="18" rx="3" ry="3.5" fill="#4a3560" />
      <ellipse cx="35" cy="16.5" rx="1.2" ry="1.5" fill="white" />
      <polygon points="28,23 25,26 31,26" fill="#ffb8d0" />
      <line x1="10" y1="24" x2="22" y2="25" stroke="#c0b0d0" strokeWidth="0.8" />
      <line x1="10" y1="27" x2="22" y2="27" stroke="#c0b0d0" strokeWidth="0.8" />
      <line x1="34" y1="25" x2="46" y2="24" stroke="#c0b0d0" strokeWidth="0.8" />
      <line x1="34" y1="27" x2="46" y2="27" stroke="#c0b0d0" strokeWidth="0.8" />
      <path d="M 45 55 Q 62 42 56 28" stroke="#e8e0f0" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="56" cy="27" r="3" fill="#e0d0f0" />
      <ellipse cx="18" cy="64" rx="7" ry="5" fill="#e8e0f0" />
      <ellipse cx="38" cy="64" rx="7" ry="5" fill="#e8e0f0" />
    </g>

    {/* ちょうちょ */}
    <g transform="translate(80, 90) scale(0.9)" opacity="0.7">
      <path d="M 0 0 Q -12 -10 -8 -2 Q -14 -6 -4 2" fill="#ffccee" />
      <path d="M 0 0 Q 12 -10 8 -2 Q 14 -6 4 2" fill="#ddccff" />
      <circle cx="0" cy="0" r="1" fill="#aa88cc" />
    </g>
    <g transform="translate(340, 200) scale(0.7) rotate(15)" opacity="0.7">
      <path d="M 0 0 Q -12 -10 -8 -2 Q -14 -6 -4 2" fill="#ccddff" />
      <path d="M 0 0 Q 12 -10 8 -2 Q 14 -6 4 2" fill="#ffccdd" />
      <circle cx="0" cy="0" r="1" fill="#aa88cc" />
    </g>

    {/* ハート */}
    {[
      { x: 88, y: 108, s: 0.55, c: '#ffb3d9' },
      { x: 325, y: 185, s: 0.45, c: '#d9b3ff' },
      { x: 248, y: 85, s: 0.4, c: '#ffb3b3' },
      { x: 52, y: 255, s: 0.5, c: '#b3d9ff' },
      { x: 355, y: 268, s: 0.35, c: '#ffcce0' },
      { x: 160, y: 78, s: 0.3, c: '#ccddff' },
    ].map(({ x, y, s, c }, i) => (
      <g key={`h${i}`} transform={`translate(${x}, ${y}) scale(${s})`} opacity="0.6">
        <path d="M 0 -6 C -6 -14, -18 -6, 0 6 C 18 -6, 6 -14, 0 -6 Z" fill={c} />
      </g>
    ))}

    {/* 花 */}
    {[
      { x: 375, y: 365, c: '#ffcce0' },
      { x: 15, y: 365, c: '#d9ccff' },
      { x: 120, y: 385, c: '#cce0ff' },
      { x: 250, y: 378, c: '#ffe0cc' },
    ].map(({ x, y, c }, i) => (
      <g key={`f${i}`} transform={`translate(${x}, ${y})`} opacity="0.6">
        {[0, 72, 144, 216, 288].map((angle, j) => (
          <circle
            key={j}
            cx={Math.cos((angle * Math.PI) / 180) * 5}
            cy={Math.sin((angle * Math.PI) / 180) * 5}
            r="4.5"
            fill={c}
          />
        ))}
        <circle cx="0" cy="0" r="3" fill="#fffbe0" />
      </g>
    ))}

    {/* 草 */}
    <path d="M 0 395 Q 50 380 100 390 Q 150 395 200 385 Q 250 390 300 388 Q 350 392 400 385 L 400 400 L 0 400 Z" fill="#d8f5e0" opacity="0.4" />
    <path d="M 0 398 Q 80 390 160 395 Q 240 398 320 392 Q 360 395 400 393 L 400 400 L 0 400 Z" fill="#c8ecd8" opacity="0.3" />
  </svg>
);

export default PuzzleImage;
