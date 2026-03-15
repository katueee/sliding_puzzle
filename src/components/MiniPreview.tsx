import PuzzleImage from '../assets/PuzzleImage';
import styles from './MiniPreview.module.css';

interface Props {
  onClick: () => void;
}

const MiniPreview: React.FC<Props> = ({ onClick }) => (
  <button className={styles.preview} onClick={onClick} aria-label="おてほんを見る">
    <PuzzleImage size={60} />
  </button>
);

export default MiniPreview;
