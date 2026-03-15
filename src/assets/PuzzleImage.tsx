/**
 * ゆめかわユニコーン＋小動物のSVGイラスト
 * パズルの完成画像として使用
 * 後で実際のイラスト画像に差し替え可能
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
      {/* パステルグラデーション背景 */}
      <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffe0f0" />
        <stop offset="30%" stopColor="#e8d0ff" />
        <stop offset="60%" stopColor="#d0e8ff" />
        <stop offset="100%" stopColor="#c8ffef" />
      </linearGradient>
      {/* 虹グラデーション */}
      <linearGradient id="rainbow" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ffb3b3" />
        <stop offset="20%" stopColor="#ffd9b3" />
        <stop offset="40%" stopColor="#ffffb3" />
        <stop offset="60%" stopColor="#b3ffb3" />
        <stop offset="80%" stopColor="#b3d9ff" />
        <stop offset="100%" stopColor="#d9b3ff" />
      </linearGradient>
      {/* ユニコーンのたてがみ */}
      <linearGradient id="maneGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ff99cc" />
        <stop offset="50%" stopColor="#cc99ff" />
        <stop offset="100%" stopColor="#99ccff" />
      </linearGradient>
      {/* キラキラフィルタ */}
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* 背景 */}
    <rect width="400" height="400" fill="url(#bgGrad)" rx="8" />

    {/* ふわふわ雲 */}
    <g opacity="0.6">
      <ellipse cx="60" cy="60" rx="40" ry="18" fill="white" />
      <ellipse cx="45" cy="55" rx="25" ry="14" fill="white" />
      <ellipse cx="80" cy="55" rx="28" ry="15" fill="white" />

      <ellipse cx="320" cy="45" rx="35" ry="16" fill="white" />
      <ellipse cx="340" cy="40" rx="22" ry="12" fill="white" />
      <ellipse cx="305" cy="40" rx="20" ry="11" fill="white" />

      <ellipse cx="180" cy="35" rx="30" ry="13" fill="white" />
      <ellipse cx="200" cy="30" rx="20" ry="10" fill="white" />
    </g>

    {/* 虹 */}
    <path
      d="M 30 200 Q 200 30 370 200"
      fill="none"
      stroke="url(#rainbow)"
      strokeWidth="14"
      opacity="0.45"
      strokeLinecap="round"
    />
    <path
      d="M 45 210 Q 200 50 355 210"
      fill="none"
      stroke="url(#rainbow)"
      strokeWidth="8"
      opacity="0.3"
      strokeLinecap="round"
    />

    {/* キラキラ星たち */}
    {[
      { x: 50, y: 120, s: 8 },
      { x: 340, y: 100, s: 6 },
      { x: 100, y: 30, s: 5 },
      { x: 290, y: 25, s: 7 },
      { x: 370, y: 170, s: 5 },
      { x: 25, y: 180, s: 4 },
      { x: 200, y: 70, s: 6 },
      { x: 150, y: 55, s: 4 },
      { x: 260, y: 60, s: 5 },
    ].map(({ x, y, s }, i) => (
      <g key={i} filter="url(#glow)">
        <polygon
          points={`${x},${y - s} ${x + s * 0.3},${y - s * 0.3} ${x + s},${y} ${x + s * 0.3},${y + s * 0.3} ${x},${y + s} ${x - s * 0.3},${y + s * 0.3} ${x - s},${y} ${x - s * 0.3},${y - s * 0.3}`}
          fill="#fffbe0"
          opacity="0.9"
        />
      </g>
    ))}

    {/* ===== ユニコーン（メイン・躍動ポーズ） ===== */}
    <g transform="translate(120, 130)">
      {/* 体 */}
      <ellipse cx="90" cy="120" rx="75" ry="50" fill="white" />
      {/* 首 */}
      <path d="M 45 100 Q 30 60 50 30" stroke="white" strokeWidth="30" fill="none" strokeLinecap="round" />
      {/* 頭 */}
      <ellipse cx="52" cy="25" rx="30" ry="24" fill="white" />
      {/* 角 */}
      <polygon points="52,-5 46,25 58,25" fill="url(#maneGrad)" />
      <line x1="48" y1="8" x2="56" y2="8" stroke="white" strokeWidth="1.5" opacity="0.7" />
      <line x1="47" y1="14" x2="57" y2="14" stroke="white" strokeWidth="1.5" opacity="0.7" />
      {/* 耳 */}
      <ellipse cx="36" cy="8" rx="6" ry="10" fill="white" transform="rotate(-15, 36, 8)" />
      <ellipse cx="36" cy="8" rx="3" ry="6" fill="#ffcce0" transform="rotate(-15, 36, 8)" />
      {/* 目 */}
      <ellipse cx="42" cy="26" rx="4" ry="5" fill="#4a3560" />
      <ellipse cx="42" cy="24" rx="1.5" ry="2" fill="white" />
      {/* まつげ */}
      <path d="M 38 22 Q 36 19 34 20" stroke="#4a3560" strokeWidth="1.2" fill="none" />
      <path d="M 40 21 Q 39 18 37 18" stroke="#4a3560" strokeWidth="1.2" fill="none" />
      {/* 鼻 */}
      <ellipse cx="34" cy="32" rx="2" ry="1.5" fill="#ffb8d0" />
      {/* ほっぺ */}
      <ellipse cx="35" cy="34" rx="5" ry="3" fill="#ffcce0" opacity="0.5" />
      {/* 口（にっこり） */}
      <path d="M 37 35 Q 42 40 47 35" stroke="#e088a8" strokeWidth="1.2" fill="none" />

      {/* たてがみ */}
      <path d="M 60 5 Q 80 15 65 40 Q 85 30 70 55 Q 90 45 75 70"
        fill="none" stroke="url(#maneGrad)" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
      <path d="M 55 8 Q 75 20 60 45 Q 80 35 65 60"
        fill="none" stroke="#ffb3d9" strokeWidth="5" strokeLinecap="round" opacity="0.5" />

      {/* 前脚（跳ねてるポーズ） */}
      <path d="M 35 145 Q 20 170 10 195" stroke="white" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M 55 148 Q 40 175 25 195" stroke="white" strokeWidth="14" fill="none" strokeLinecap="round" />
      {/* 蹄 */}
      <ellipse cx="10" cy="197" rx="6" ry="4" fill="#ffcce0" />
      <ellipse cx="25" cy="197" rx="6" ry="4" fill="#ffcce0" />

      {/* 後脚 */}
      <path d="M 130 145 Q 145 175 150 195" stroke="white" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M 145 140 Q 160 165 170 195" stroke="white" strokeWidth="14" fill="none" strokeLinecap="round" />
      <ellipse cx="150" cy="197" rx="6" ry="4" fill="#ffcce0" />
      <ellipse cx="170" cy="197" rx="6" ry="4" fill="#ffcce0" />

      {/* しっぽ */}
      <path d="M 162 105 Q 195 80 190 120 Q 200 90 195 130"
        stroke="url(#maneGrad)" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.8" />
    </g>

    {/* ===== うさぎ（右下） ===== */}
    <g transform="translate(300, 280)">
      {/* 体 */}
      <ellipse cx="25" cy="50" rx="22" ry="28" fill="white" />
      {/* 頭 */}
      <circle cx="25" cy="22" r="18" fill="white" />
      {/* 耳 */}
      <ellipse cx="16" cy="-5" rx="6" ry="18" fill="white" />
      <ellipse cx="16" cy="-5" rx="3" ry="14" fill="#ffcce0" />
      <ellipse cx="34" cy="-5" rx="6" ry="18" fill="white" />
      <ellipse cx="34" cy="-5" rx="3" ry="14" fill="#ffcce0" />
      {/* 目 */}
      <ellipse cx="19" cy="20" rx="3" ry="3.5" fill="#4a3560" />
      <ellipse cx="19" cy="19" rx="1" ry="1.5" fill="white" />
      <ellipse cx="31" cy="20" rx="3" ry="3.5" fill="#4a3560" />
      <ellipse cx="31" cy="19" rx="1" ry="1.5" fill="white" />
      {/* 鼻 */}
      <ellipse cx="25" cy="26" rx="2.5" ry="2" fill="#ffb8d0" />
      {/* 口 */}
      <path d="M 23 28 Q 25 31 27 28" stroke="#e088a8" strokeWidth="1" fill="none" />
      {/* ほっぺ */}
      <ellipse cx="14" cy="26" rx="4" ry="2.5" fill="#ffcce0" opacity="0.5" />
      <ellipse cx="36" cy="26" rx="4" ry="2.5" fill="#ffcce0" opacity="0.5" />
      {/* 前足 */}
      <ellipse cx="15" cy="72" rx="7" ry="5" fill="white" />
      <ellipse cx="35" cy="72" rx="7" ry="5" fill="white" />
    </g>

    {/* ===== くま（左下） ===== */}
    <g transform="translate(30, 300)">
      {/* 体 */}
      <ellipse cx="30" cy="45" rx="22" ry="25" fill="#ffe8cc" />
      {/* 頭 */}
      <circle cx="30" cy="20" r="17" fill="#ffe8cc" />
      {/* 耳 */}
      <circle cx="15" cy="6" r="8" fill="#ffe8cc" />
      <circle cx="15" cy="6" r="4" fill="#ffcca0" />
      <circle cx="45" cy="6" r="8" fill="#ffe8cc" />
      <circle cx="45" cy="6" r="4" fill="#ffcca0" />
      {/* 目 */}
      <ellipse cx="23" cy="18" rx="2.5" ry="3" fill="#4a3560" />
      <ellipse cx="23" cy="17" rx="1" ry="1.2" fill="white" />
      <ellipse cx="37" cy="18" rx="2.5" ry="3" fill="#4a3560" />
      <ellipse cx="37" cy="17" rx="1" ry="1.2" fill="white" />
      {/* 鼻 */}
      <ellipse cx="30" cy="24" rx="4" ry="3" fill="#ffcca0" />
      <ellipse cx="30" cy="23" rx="2" ry="1.5" fill="#cc8866" />
      {/* 口 */}
      <path d="M 28 26 Q 30 29 32 26" stroke="#cc8866" strokeWidth="1" fill="none" />
      {/* ほっぺ */}
      <ellipse cx="17" cy="24" rx="4" ry="2.5" fill="#ffcca0" opacity="0.5" />
      <ellipse cx="43" cy="24" rx="4" ry="2.5" fill="#ffcca0" opacity="0.5" />
    </g>

    {/* ===== ねこ（中央下） ===== */}
    <g transform="translate(155, 310)">
      {/* 体 */}
      <ellipse cx="25" cy="40" rx="18" ry="22" fill="#e8e0f0" />
      {/* 頭 */}
      <circle cx="25" cy="18" r="15" fill="#e8e0f0" />
      {/* 耳 */}
      <polygon points="12,6 8,-8 18,2" fill="#e8e0f0" />
      <polygon points="13,4 10,-4 17,2" fill="#ffcce0" />
      <polygon points="38,6 42,-8 32,2" fill="#e8e0f0" />
      <polygon points="37,4 40,-4 33,2" fill="#ffcce0" />
      {/* 目 */}
      <ellipse cx="19" cy="16" rx="2.5" ry="3" fill="#4a3560" />
      <ellipse cx="19" cy="15" rx="1" ry="1.2" fill="white" />
      <ellipse cx="31" cy="16" rx="2.5" ry="3" fill="#4a3560" />
      <ellipse cx="31" cy="15" rx="1" ry="1.2" fill="white" />
      {/* 鼻 */}
      <polygon points="25,21 23,23 27,23" fill="#ffb8d0" />
      {/* ひげ */}
      <line x1="10" y1="22" x2="20" y2="23" stroke="#c0b0d0" strokeWidth="0.8" />
      <line x1="10" y1="25" x2="20" y2="25" stroke="#c0b0d0" strokeWidth="0.8" />
      <line x1="30" y1="23" x2="40" y2="22" stroke="#c0b0d0" strokeWidth="0.8" />
      <line x1="30" y1="25" x2="40" y2="25" stroke="#c0b0d0" strokeWidth="0.8" />
      {/* しっぽ */}
      <path d="M 40 50 Q 55 40 50 30" stroke="#e8e0f0" strokeWidth="5" fill="none" strokeLinecap="round" />
    </g>

    {/* ハート散らし */}
    {[
      { x: 85, y: 100, s: 0.6, c: '#ffb3d9' },
      { x: 320, y: 180, s: 0.5, c: '#d9b3ff' },
      { x: 250, y: 90, s: 0.4, c: '#ffb3b3' },
      { x: 50, y: 250, s: 0.5, c: '#b3d9ff' },
      { x: 350, y: 260, s: 0.4, c: '#ffcce0' },
    ].map(({ x, y, s, c }, i) => (
      <g key={`h${i}`} transform={`translate(${x}, ${y}) scale(${s})`} opacity="0.7">
        <path
          d="M 0 -8 C -8 -18, -22 -8, 0 8 C 22 -8, 8 -18, 0 -8 Z"
          fill={c}
        />
      </g>
    ))}

    {/* 小さな花 */}
    {[
      { x: 380, y: 370, c: '#ffcce0' },
      { x: 20, y: 370, c: '#d9ccff' },
      { x: 120, y: 380, c: '#cce0ff' },
    ].map(({ x, y, c }, i) => (
      <g key={`f${i}`} transform={`translate(${x}, ${y})`}>
        {[0, 72, 144, 216, 288].map((angle, j) => (
          <ellipse
            key={j}
            cx={Math.cos((angle * Math.PI) / 180) * 6}
            cy={Math.sin((angle * Math.PI) / 180) * 6}
            rx="5"
            ry="5"
            fill={c}
            opacity="0.7"
          />
        ))}
        <circle cx="0" cy="0" r="3" fill="#fffbe0" />
      </g>
    ))}
  </svg>
);

export default PuzzleImage;
