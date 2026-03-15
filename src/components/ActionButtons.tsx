import type { GameStatus } from '../types/game';
import styles from './ActionButtons.module.css';

interface Props {
  status: GameStatus;
  onShuffle: () => void;
  onRestart: () => void;
  onShowPreview: () => void;
}

/**
 * 操作ボタン — 常に3つ固定配置で位置が変わらない。
 * 5歳児でも迷わない大きなタップターゲット。
 */
const ActionButtons: React.FC<Props> = ({
  status,
  onShuffle,
  onRestart,
  onShowPreview,
}) => (
  <div className={styles.row}>
    {/* 見本 */}
    <button className={styles.btn} onClick={onShowPreview}>
      <span className={styles.icon}>🖼️</span>
      <span className={styles.label}>おてほん</span>
    </button>

    {/* まぜる（メインアクション） */}
    <button className={`${styles.btn} ${styles.primary}`} onClick={onShuffle}>
      <span className={styles.icon}>🔀</span>
      <span className={styles.label}>まぜる</span>
    </button>

    {/* やりなおし — idle時はdisabledだが位置は固定 */}
    <button
      className={styles.btn}
      onClick={onRestart}
      disabled={status === 'idle'}
    >
      <span className={styles.icon}>↩️</span>
      <span className={styles.label}>もどす</span>
    </button>
  </div>
);

export default ActionButtons;
