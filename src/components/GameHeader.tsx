import type { GridSize } from '../types/game';
import styles from './GameHeader.module.css';

interface Props {
  moves: number;
  elapsed: number;
  soundEnabled: boolean;
  gridSize: GridSize;
  onToggleSound: () => void;
  onSetGridSize: (size: GridSize) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** コンパクトなステータスバー。盤面を主役にするため最小限の情報のみ */
const GameHeader: React.FC<Props> = ({
  moves,
  elapsed,
  soundEnabled,
  gridSize,
  onToggleSound,
  onSetGridSize,
}) => (
  <header className={styles.header}>
    {/* 左: 手数・タイマー */}
    <div className={styles.stats}>
      <span className={styles.stat}>♡ {moves}</span>
      <span className={styles.statSep}>|</span>
      <span className={styles.stat}>⏱ {formatTime(elapsed)}</span>
    </div>

    {/* 右: 難易度・音 */}
    <div className={styles.actions}>
      <div className={styles.sizeToggle}>
        {([3, 4] as GridSize[]).map((size) => (
          <button
            key={size}
            className={`${styles.sizeBtn} ${gridSize === size ? styles.sizeActive : ''}`}
            onClick={() => onSetGridSize(size)}
            aria-label={`${size}×${size}に変更`}
          >
            {size}×{size}
          </button>
        ))}
      </div>
      <button
        className={styles.soundBtn}
        onClick={onToggleSound}
        aria-label={soundEnabled ? '音をオフにする' : '音をオンにする'}
      >
        {soundEnabled ? '🔔' : '🔕'}
      </button>
    </div>
  </header>
);

export default GameHeader;
