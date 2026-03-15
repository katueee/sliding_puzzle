import styles from './Tutorial.module.css';

interface Props {
  onDismiss: () => void;
}

const Tutorial: React.FC<Props> = ({ onDismiss }) => (
  <div className={styles.overlay} onClick={onDismiss}>
    <div className={styles.card} onClick={(e) => e.stopPropagation()}>
      <div className={styles.icon}>🦄</div>
      <h2 className={styles.title}>あそびかた</h2>
      <p className={styles.text}>
        ピースを うごかして
        <br />
        えを かんせいさせよう！
      </p>
      <p className={styles.hint}>
        となりの ピースを タップすると
        <br />
        うごくよ
      </p>
      <button className={styles.btn} onClick={onDismiss}>
        わかった！
      </button>
    </div>
  </div>
);

export default Tutorial;
