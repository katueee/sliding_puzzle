import { useEffect, useState, useMemo } from 'react';
import styles from './ClearOverlay.module.css';

interface Props {
  moves: number;
  elapsed: number;
  onRestart: () => void;
  onShuffle: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** フルスクリーンに散らばるパーティクル */
function generateParticles() {
  const emojis = ['⭐', '✨', '💖', '🌟', '🎀', '♡', '☆', '🦄', '🌈', '💫', '🐰', '🎉', '🎊', '💝', '🌸', '🦋', '💎', '🍭'];
  return Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    char: emojis[i % emojis.length],
    delay: Math.random() * 2,
    size: 0.7 + Math.random() * 1.2,
    duration: 2 + Math.random() * 3,
  }));
}

/** 花火のように中心から放射するバースト */
function generateBursts() {
  return Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2;
    const dist = 30 + Math.random() * 35;
    return {
      id: i,
      x: 50 + Math.cos(angle) * dist,
      y: 50 + Math.sin(angle) * dist,
      delay: Math.random() * 0.5,
      char: ['✦', '★', '✧', '♦', '●'][i % 5],
      color: [
        '#ff88bb', '#ffaa55', '#ffee55', '#55ff88',
        '#55bbff', '#bb77ff', '#ff77dd', '#77ffdd',
      ][i % 8],
    };
  });
}

/** 紙吹雪（上から降り注ぐ） */
function generateConfetti() {
  const colors = [
    '#ff6b9d', '#c44dff', '#4dc9f6', '#ffcd56',
    '#ff6384', '#36a2eb', '#ff9f40', '#9966ff',
    '#ff69b4', '#00ced1', '#ffd700', '#ff1493',
  ];
  return Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 3,
    color: colors[i % colors.length],
    size: 4 + Math.random() * 6,
    duration: 2 + Math.random() * 2,
    rotate: Math.random() * 360,
    swayAmount: -20 + Math.random() * 40,
  }));
}

const ClearOverlay: React.FC<Props> = ({ moves, elapsed, onRestart, onShuffle }) => {
  const particles = useMemo(generateParticles, []);
  const bursts = useMemo(generateBursts, []);
  const confetti = useMemo(generateConfetti, []);
  const [phase, setPhase] = useState(0); // 0: initial, 1: effects visible, 2: content slides up

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 50);
    const t2 = setTimeout(() => setPhase(2), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // 星の数
  const starCount = moves <= 30 ? 3 : moves <= 60 ? 2 : 1;

  return (
    <div className={`${styles.overlay} ${phase >= 1 ? styles.visible : ''}`}>
      {/* 花火バースト */}
      {bursts.map((b) => (
        <span
          key={`burst-${b.id}`}
          className={styles.burst}
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            animationDelay: `${b.delay}s`,
            color: b.color,
            fontSize: '1rem',
          }}
        >
          {b.char}
        </span>
      ))}

      {/* 紙吹雪 */}
      {confetti.map((c) => (
        <div
          key={`confetti-${c.id}`}
          className={styles.confetti}
          style={{
            left: `${c.x}%`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            backgroundColor: c.color,
            width: `${c.size}px`,
            height: `${c.size * 0.6}px`,
            '--sway': `${c.swayAmount}px`,
            '--rotate': `${c.rotate}deg`,
          } as React.CSSProperties}
        />
      ))}

      {/* 浮遊パーティクル */}
      {particles.map((p) => (
        <span
          key={`p-${p.id}`}
          className={styles.particle}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size}rem`,
          }}
        >
          {p.char}
        </span>
      ))}

      {/* 下部コンテンツカード */}
      <div className={`${styles.content} ${phase >= 2 ? styles.contentVisible : ''}`}>
        <h2 className={styles.title}>
          <span className={styles.titleLine1}>🎉 できたね！🎉</span>
          <span className={styles.titleLine2}>すっごーい！！</span>
        </h2>

        {/* 星レーティング */}
        <div className={styles.stars}>
          {Array.from({ length: 3 }, (_, i) => (
            <span
              key={i}
              className={`${styles.starIcon} ${i < starCount ? styles.earned : styles.empty}`}
              style={{ animationDelay: `${0.6 + i * 0.25}s` }}
            >
              ★
            </span>
          ))}
        </div>

        {/* スコア表示 */}
        <div className={styles.stats}>
          <p className={styles.statLine}>
            <span className={styles.statEmoji}>🧩</span>
            <span>{moves} てで クリア！</span>
          </p>
          <p className={styles.statLine}>
            <span className={styles.statEmoji}>⏱️</span>
            <span>タイム: {formatTime(elapsed)}</span>
          </p>
        </div>

        {/* ボタン（横並び） */}
        <div className={styles.btnGroup}>
          <button className={styles.btn} onClick={onShuffle}>
            🔄 もういっかい！
          </button>
          <button className={`${styles.btn} ${styles.btnSub}`} onClick={onRestart}>
            もどる
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearOverlay;
