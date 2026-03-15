import { useRef, useCallback, useEffect } from 'react';
import type { Board, GridSize } from '../types/game';
import { getEmptyIndex, isAdjacent, toRowCol } from '../utils/puzzle';
import styles from './PuzzleBoard.module.css';

interface Props {
  board: Board;
  gridSize: GridSize;
  onMovePiece: (index: number) => void;
  disabled?: boolean;
  imageUrl: string;
}

interface DragState {
  pieceIndex: number;
  pieceEl: HTMLButtonElement;
  startX: number;
  startY: number;
  direction: 'x' | 'y';
  maxDelta: number; // positive = right/down, negative = left/up
  cellSize: number;
  currentDelta: number;
  moved: boolean;
}

/** 軽い振動フィードバック */
function vibrate() {
  try { navigator?.vibrate?.(12); } catch { /* ignore */ }
}

const PuzzleBoard: React.FC<Props> = ({ board, gridSize, onMovePiece, disabled, imageUrl }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const emptyIndex = getEmptyIndex(board);

  // --- タッチ開始: ピース上でドラッグ開始 ---
  const handlePieceTouchStart = useCallback((e: React.TouchEvent<HTMLButtonElement>, index: number) => {
    if (disabled || !boardRef.current) return;
    if (!isAdjacent(index, emptyIndex, gridSize)) return;

    const touch = e.touches[0];
    const rect = boardRef.current.getBoundingClientRect();
    const cellSize = rect.width / gridSize;
    const [pRow, pCol] = toRowCol(index, gridSize);
    const [eRow, eCol] = toRowCol(emptyIndex, gridSize);

    const direction: 'x' | 'y' = pRow === eRow ? 'x' : 'y';
    const maxDelta = direction === 'x'
      ? (eCol - pCol) * cellSize
      : (eRow - pRow) * cellSize;

    const pieceEl = e.currentTarget;
    pieceEl.style.transition = 'none';
    pieceEl.style.zIndex = '10';

    dragRef.current = {
      pieceIndex: index,
      pieceEl,
      startX: touch.clientX,
      startY: touch.clientY,
      direction,
      maxDelta,
      cellSize,
      currentDelta: 0,
      moved: false,
    };

    vibrate();
  }, [disabled, emptyIndex, gridSize]);

  // --- タッチ中: 指に追従 (native listener for passive:false) ---
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const onTouchMove = (e: TouchEvent) => {
      const state = dragRef.current;
      if (!state) return;
      e.preventDefault();

      const touch = e.touches[0];
      const raw = state.direction === 'x'
        ? touch.clientX - state.startX
        : touch.clientY - state.startY;

      // 空きマス方向にのみクランプ
      let clamped: number;
      if (state.maxDelta > 0) {
        clamped = Math.max(0, Math.min(raw, state.maxDelta));
      } else {
        clamped = Math.min(0, Math.max(raw, state.maxDelta));
      }

      state.currentDelta = clamped;
      if (Math.abs(clamped) > 2) state.moved = true;

      const tx = state.direction === 'x' ? clamped : 0;
      const ty = state.direction === 'y' ? clamped : 0;
      state.pieceEl.style.transform = `translate(${tx}px, ${ty}px)`;
    };

    const onTouchEnd = () => {
      const state = dragRef.current;
      if (!state) return;
      dragRef.current = null;

      const moved = Math.abs(state.currentDelta) > state.cellSize * 0.3;

      // スナップバックアニメーション
      state.pieceEl.style.transition = 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)';
      state.pieceEl.style.transform = '';
      state.pieceEl.style.zIndex = '';

      if (moved) {
        // わずかな遅延でstate更新（アニメーション前にDOMをリセット）
        requestAnimationFrame(() => onMovePiece(state.pieceIndex));
      }
    };

    board.addEventListener('touchmove', onTouchMove, { passive: false });
    board.addEventListener('touchend', onTouchEnd);
    board.addEventListener('touchcancel', onTouchEnd);

    return () => {
      board.removeEventListener('touchmove', onTouchMove);
      board.removeEventListener('touchend', onTouchEnd);
      board.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [onMovePiece]);

  // --- クリック（デスクトップ or タップフォールバック） ---
  const handlePieceClick = useCallback((index: number) => {
    // ドラッグ後のクリックは無視
    if (dragRef.current) return;
    if (disabled) return;
    if (!isAdjacent(index, emptyIndex, gridSize)) return;
    vibrate();
    onMovePiece(index);
  }, [disabled, emptyIndex, gridSize, onMovePiece]);

  return (
    <div
      ref={boardRef}
      className={styles.board}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
      }}
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
            onTouchStart={(e) => handlePieceTouchStart(e, index)}
            onClick={() => handlePieceClick(index)}
            aria-label={`ピース ${value}`}
            style={{
              backgroundImage: `url("${imageUrl}")`,
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
