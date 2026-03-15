import styles from './Tutorial.module.css';

interface Props {
  onDismiss: () => void;
}

/** 初回チュートリアル — 文字が読めなくても絵で伝わる設計 */
const Tutorial: React.FC<Props> = ({ onDismiss }) => (
  <div className={styles.overlay} onClick={onDismiss}>
    <div className={styles.card} onClick={(e) => e.stopPropagation()}>
      <div className={styles.icon}>🦄</div>

      <p className={styles.text}>
        ピースを うごかして
        <br />
        えを かんせいさせよう！
      </p>

      {/* タップジェスチャーのアニメーション図解 */}
      <div className={styles.demo}>
        <div className={styles.demoPiece} />
        <div className={styles.demoEmpty} />
        <span className={styles.demoHand}>👆</span>
      </div>

      <button className={styles.btn} onClick={onDismiss}>
        あそぶ！
      </button>
    </div>
  </div>
);

export default Tutorial;
