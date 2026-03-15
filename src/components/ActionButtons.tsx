import type { GameStatus } from '../types/game';
import styles from './ActionButtons.module.css';

interface Props {
  status: GameStatus;
  onShuffle: () => void;
  onRestart: () => void;
  onShowPreview: () => void;
}

const ActionButtons: React.FC<Props> = ({
  status,
  onShuffle,
  onRestart,
  onShowPreview,
}) => (
  <div className={styles.buttons}>
    <button className={styles.btn} onClick={onShuffle}>
      <span className={styles.icon}>🔀</span>
      <span className={styles.label}>まぜる</span>
    </button>

    {status !== 'idle' && (
      <button className={styles.btn} onClick={onRestart}>
        <span className={styles.icon}>↩️</span>
        <span className={styles.label}>もどす</span>
      </button>
    )}

    <button className={styles.btn} onClick={onShowPreview}>
      <span className={styles.icon}>🖼️</span>
      <span className={styles.label}>おてほん</span>
    </button>
  </div>
);

export default ActionButtons;
