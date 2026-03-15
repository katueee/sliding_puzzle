import PuzzleImage from '../assets/PuzzleImage';
import styles from './PreviewModal.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

const PreviewModal: React.FC<Props> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>おてほん</h2>
        <div className={styles.imageWrap}>
          <PuzzleImage size={300} />
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          とじる
        </button>
      </div>
    </div>
  );
};

export default PreviewModal;
