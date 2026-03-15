import styles from './MiniPreview.module.css';

interface Props {
  onClick: () => void;
  imageUrl: string;
}

/** 盤面の下に常に表示される見本サムネイル */
const MiniPreview: React.FC<Props> = ({ onClick, imageUrl }) => (
  <button className={styles.preview} onClick={onClick} aria-label="おてほんを おおきく みる">
    <div className={styles.imageWrap}>
      <img src={imageUrl} alt="おてほん" width={48} height={48} />
    </div>
    <span className={styles.label}>おてほん 👆</span>
  </button>
);

export default MiniPreview;
