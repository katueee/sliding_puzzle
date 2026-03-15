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

/**
 * パズル盤面コンポーネント
 * SVG画像をbackground-imageでクリップして各ピースを表示
 */
const PuzzleBoard: React.FC<Props> = ({ board, gridSize, onMovePiece, disabled }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const total = gridSize * gridSize;
  const emptyIndex = getEmptyIndex(board);

  // スワイプ検知用
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

    // 最低移動距離
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;

    // スワイプ方向から移動するピースを決定
    const [eRow, eCol] = toRowCol(emptyIndex, gridSize);
    let targetIndex = -1;

    if (Math.abs(dx) > Math.abs(dy)) {
      // 横スワイプ: 右にスワイプ→空きマスの左のピースを動かす
      if (dx > 0 && eCol > 0) targetIndex = emptyIndex - 1;
      if (dx < 0 && eCol < gridSize - 1) targetIndex = emptyIndex + 1;
    } else {
      // 縦スワイプ: 下にスワイプ→空きマスの上のピースを動かす
      if (dy > 0 && eRow > 0) targetIndex = emptyIndex - gridSize;
      if (dy < 0 && eRow < gridSize - 1) targetIndex = emptyIndex + gridSize;
    }

    if (targetIndex >= 0 && targetIndex < total) {
      onMovePiece(targetIndex);
    }
  }, [emptyIndex, gridSize, total, onMovePiece]);

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

        // ピースの元の位置から背景位置を計算
        const origRow = Math.floor((value - 1) / gridSize);
        const origCol = (value - 1) % gridSize;
        const bgPosX = -(origCol * (100 / (gridSize - 1)));
        const bgPosY = -(origRow * (100 / (gridSize - 1)));

        const canMove = !disabled && isAdjacent(index, emptyIndex, gridSize);

        return (
          <button
            key={value}
            className={`${styles.piece} ${canMove ? styles.movable : ''}`}
            onClick={() => canMove && onMovePiece(index)}
            disabled={!canMove}
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
