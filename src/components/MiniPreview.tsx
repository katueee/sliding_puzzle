import PuzzleImage from '../assets/PuzzleImage';
import styles from './MiniPreview.module.css';

interface Props {
  onClick: () => void;
}

/** 盤面の下に常に表示される見本サムネイル */
const MiniPreview: React.FC<Props> = ({ onClick }) => (
  <button className={styles.preview} onClick={onClick} aria-label="おてほんを おおきく みる">
    <div className={styles.imageWrap}>
      <PuzzleImage size={48} />
    </div>
    <span className={styles.label}>おてほん 👆</span>
  </button>
);

export default MiniPreview;
