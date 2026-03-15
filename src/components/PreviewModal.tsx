import styles from './PreviewModal.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
}

const PreviewModal: React.FC<Props> = ({ open, onClose, imageUrl }) => {
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>おてほん</h2>
        <div className={styles.imageWrap}>
          <img src={imageUrl} alt="おてほん" />
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          とじる
        </button>
      </div>
    </div>
  );
};

export default PreviewModal;
