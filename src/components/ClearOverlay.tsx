import { useEffect, useState } from 'react';
import styles from './ClearOverlay.module.css';

interface Props {
  moves: number;
  elapsed: number;
  onRestart: () => void;
  onShuffle: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  char: string;
  delay: number;
  size: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function generateParticles(): Particle[] {
  const chars = ['⭐', '✨', '💖', '🌟', '🎀', '♡', '☆', '🦄', '🌈', '💫', '🐰'];
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    char: chars[Math.floor(Math.random() * chars.length)],
    delay: Math.random() * 1.2,
    size: 0.6 + Math.random() * 1.0,
  }));
}

const ClearOverlay: React.FC<Props> = ({ moves, elapsed, onRestart, onShuffle }) => {
  const [particles] = useState(generateParticles);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // アニメーション開始を少し遅らせる
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // 星の数（手数に応じて）
  const starCount = moves <= 30 ? 3 : moves <= 60 ? 2 : 1;

  return (
    <div className={`${styles.overlay} ${show ? styles.visible : ''}`}>
      {/* パーティクル */}
      {particles.map((p) => (
        <span
          key={p.id}
          className={styles.particle}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${p.delay}s`,
            fontSize: `${p.size}rem`,
          }}
        >
          {p.char}
        </span>
      ))}

      <div className={styles.content}>
        <h2 className={styles.title}>できたね！すごい！</h2>
        <div className={styles.stars}>
          {Array.from({ length: 3 }, (_, i) => (
            <span
              key={i}
              className={`${styles.starIcon} ${i < starCount ? styles.earned : styles.empty}`}
              style={{ animationDelay: `${0.3 + i * 0.2}s` }}
            >
              ★
            </span>
          ))}
        </div>
        <div className={styles.stats}>
          <p>{moves} てで クリア！</p>
          <p>タイム: {formatTime(elapsed)}</p>
        </div>
        <div className={styles.btnGroup}>
          <button className={styles.btn} onClick={onShuffle}>
            もういっかい！
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
