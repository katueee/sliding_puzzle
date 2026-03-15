import { useRef, useCallback } from 'react';
import type { Board, GridSize } from '../types/game';
import { getEmptyIndex, isAdjacent, toRowCol } from '../utils/puzzle';
import styles from './PuzzleBoard.module.css';

interface Props {
  board: Board;
  gridSize: GridSize;
  onMovePiece: (index: number) => void;
  disabled?: boolean;
}

/** 軽い振動フィードバック（対応端末のみ） */
function vibrate() {
  try {
    navigator?.vibrate?.(12);
  } catch {
    // 非対応端末は無視
  }
}

const PuzzleBoard: React.FC<Props> = ({ board, gridSize, onMovePiece, disabled }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const total = gridSize * gridSize;
  const emptyIndex = getEmptyIndex(board);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || !boardRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;

    const [eRow, eCol] = toRowCol(emptyIndex, gridSize);
    let targetIndex = -1;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && eCol > 0) targetIndex = emptyIndex - 1;
      if (dx < 0 && eCol < gridSize - 1) targetIndex = emptyIndex + 1;
    } else {
      if (dy > 0 && eRow > 0) targetIndex = emptyIndex - gridSize;
      if (dy < 0 && eRow < gridSize - 1) targetIndex = emptyIndex + gridSize;
    }

    if (targetIndex >= 0 && targetIndex < total) {
      vibrate();
      onMovePiece(targetIndex);
    }
  }, [emptyIndex, gridSize, total, onMovePiece]);

  const handlePieceClick = useCallback((index: number) => {
    vibrate();
    onMovePiece(index);
  }, [onMovePiece]);

  return (
    <div
      ref={boardRef}
      className={styles.board}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {board.map((value, index) => {
        if (value === 0) {
          return <div key="empty" className={styles.emptyCell} />;
        }

        const origRow = Math.floor((value - 1) / gridSize);
        const origCol = (value - 1) % gridSize;
        const bgPosX = -(origCol * (100 / (gridSize - 1)));
        const bgPosY = -(origRow * (100 / (gridSize - 1)));

        const canMove = !disabled && isAdjacent(index, emptyIndex, gridSize);

        return (
          <button
            key={value}
            className={`${styles.piece} ${canMove ? styles.movable : styles.locked}`}
            onClick={() => canMove && handlePieceClick(index)}
            aria-label={`ピース ${value}`}
            style={{
              backgroundPosition: `${bgPosX}% ${bgPosY}%`,
              backgroundSize: `${gridSize * 100}%`,
            }}
          >
            <span className={styles.pieceNumber}>{value}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PuzzleBoard;
