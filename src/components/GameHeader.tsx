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

const GameHeader: React.FC<Props> = ({
  moves,
  elapsed,
  soundEnabled,
  gridSize,
  onToggleSound,
  onSetGridSize,
}) => (
  <header className={styles.header}>
    <h1 className={styles.title}>
      <span className={styles.titleIcon}>🦄</span>
      {' '}スライドパズル{' '}
      <span className={styles.titleIconRight}>✨</span>
    </h1>

    <div className={styles.controls}>
      <div className={styles.stats}>
        <span className={styles.stat}>
          <span className={styles.statIcon}>♡</span>
          {moves} て
        </span>
        <span className={styles.stat}>
          <span className={styles.statIcon}>⏱</span>
          {formatTime(elapsed)}
        </span>
      </div>

      <div className={styles.buttons}>
        <div className={styles.sizeToggle}>
          {([3, 4] as GridSize[]).map((size) => (
            <button
              key={size}
              className={`${styles.sizeBtn} ${gridSize === size ? styles.active : ''}`}
              onClick={() => onSetGridSize(size)}
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
    </div>
  </header>
);

export default GameHeader;
