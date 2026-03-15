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

  /** タッチ位置からグリッドのセルインデックスを算出 */
  const getTouchCellIndex = useCallback((clientX: number, clientY: number): number => {
    if (!boardRef.current) return -1;
    const rect = boardRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const col = Math.floor((x / rect.width) * gridSize);
    const row = Math.floor((y / rect.height) * gridSize);
    if (col < 0 || col >= gridSize || row < 0 || row >= gridSize) return -1;
    return row * gridSize + col;
  }, [gridSize]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || !boardRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const startX = touchStartRef.current.x;
    const startY = touchStartRef.current.y;
    touchStartRef.current = null;

    // タップ（スワイプではない）→ タッチしたセルを移動
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      const cellIndex = getTouchCellIndex(startX, startY);
      if (cellIndex >= 0 && cellIndex < total && board[cellIndex] !== 0) {
        if (isAdjacent(cellIndex, emptyIndex, gridSize)) {
          vibrate();
          onMovePiece(cellIndex);
        }
      }
      return;
    }

    // スワイプ → 空きマスに向かう方向のピースを移動
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
  }, [emptyIndex, gridSize, total, onMovePiece, getTouchCellIndex, board]);

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
