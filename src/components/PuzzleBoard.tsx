import { useRef, useCallback, useEffect } from 'react';
import type { Board, GridSize } from '../types/game';
import { getEmptyIndex, toRowCol, getSlidingIndices } from '../utils/puzzle';
import styles from './PuzzleBoard.module.css';

interface Props {
  board: Board;
  gridSize: GridSize;
  onMovePiece: (index: number) => void;
  disabled?: boolean;
  imageUrl: string;
}

interface DragState {
  touchedIndex: number;
  slidingIndices: number[];
  slidingEls: HTMLElement[];
  axis: 'x' | 'y';
  /** 最大移動量px。正=右/下、負=左/上 */
  maxDelta: number;
  startX: number;
  startY: number;
  cellSize: number;
  currentDelta: number;
}

function vibrate() {
  try { navigator?.vibrate?.(12); } catch { /* ignore */ }
}

const PuzzleBoard: React.FC<Props> = ({ board, gridSize, onMovePiece, disabled, imageUrl }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  /** アニメーション中のフラグ（二重操作防止） */
  const animatingRef = useRef(false);
  const emptyIndex = getEmptyIndex(board);

  // --- タッチ開始 ---
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLButtonElement>, index: number) => {
    if (disabled || animatingRef.current || !boardRef.current) return;

    const sliding = getSlidingIndices(board, index, gridSize);
    if (sliding.length === 0) return;

    const touch = e.touches[0];
    const rect = boardRef.current.getBoundingClientRect();
    const cellSize = rect.width / gridSize;

    const [eRow, eCol] = toRowCol(emptyIndex, gridSize);
    const [tRow, tCol] = toRowCol(index, gridSize);

    const axis: 'x' | 'y' = eRow === tRow ? 'x' : 'y';
    const maxDelta = axis === 'x'
      ? (eCol < tCol ? -1 : 1) * cellSize
      : (eRow < tRow ? -1 : 1) * cellSize;

    const slidingEls = sliding.map(idx =>
      boardRef.current!.querySelector<HTMLElement>(`[data-cell-index="${idx}"]`)
    ).filter((el): el is HTMLElement => el !== null);

    // ドラッグ中はtransition無効、前面に
    for (const el of slidingEls) {
      el.style.transition = 'none';
      el.style.zIndex = '10';
    }

    dragRef.current = {
      touchedIndex: index,
      slidingIndices: sliding,
      slidingEls,
      axis,
      maxDelta,
      startX: touch.clientX,
      startY: touch.clientY,
      cellSize,
      currentDelta: 0,
    };

    vibrate();
  }, [board, disabled, emptyIndex, gridSize]);

  // --- タッチ移動 & 終了 ---
  useEffect(() => {
    const boardEl = boardRef.current;
    if (!boardEl) return;

    const onTouchMove = (e: TouchEvent) => {
      const state = dragRef.current;
      if (!state) return;
      e.preventDefault();

      const touch = e.touches[0];
      const raw = state.axis === 'x'
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

      const tx = state.axis === 'x' ? clamped : 0;
      const ty = state.axis === 'y' ? clamped : 0;
      for (const el of state.slidingEls) {
        el.style.transform = `translate(${tx}px, ${ty}px)`;
      }
    };

    const onTouchEnd = () => {
      const state = dragRef.current;
      if (!state) return;
      dragRef.current = null;

      const movedEnough = Math.abs(state.currentDelta) > 5; // 5px以上で確定

      if (movedEnough) {
        // ===== 残りを滑り切るアニメーション =====
        animatingRef.current = true;
        const remaining = state.maxDelta - state.currentDelta;
        // 残り距離に比例した時間（最小80ms, 最大180ms）
        const duration = Math.max(80, Math.min(180,
          Math.abs(remaining) / state.cellSize * 180
        ));

        const targetTx = state.axis === 'x' ? state.maxDelta : 0;
        const targetTy = state.axis === 'y' ? state.maxDelta : 0;

        for (const el of state.slidingEls) {
          el.style.transition = `transform ${duration}ms ease-out`;
          el.style.transform = `translate(${targetTx}px, ${targetTy}px)`;
        }

        // アニメーション完了後にstate更新
        const firstEl = state.slidingEls[0];
        const cleanup = () => {
          firstEl.removeEventListener('transitionend', cleanup);
          for (const el of state.slidingEls) {
            el.style.transition = '';
            el.style.transform = '';
            el.style.zIndex = '';
          }
          animatingRef.current = false;
          onMovePiece(state.touchedIndex);
        };
        firstEl.addEventListener('transitionend', cleanup);

        // フォールバック（transitionendが発火しない場合）
        setTimeout(cleanup, duration + 50);
      } else {
        // スナップバック
        for (const el of state.slidingEls) {
          el.style.transition = 'transform 0.12s ease-out';
          el.style.transform = '';
          el.style.zIndex = '';
        }
      }
    };

    boardEl.addEventListener('touchmove', onTouchMove, { passive: false });
    boardEl.addEventListener('touchend', onTouchEnd);
    boardEl.addEventListener('touchcancel', onTouchEnd);
    return () => {
      boardEl.removeEventListener('touchmove', onTouchMove);
      boardEl.removeEventListener('touchend', onTouchEnd);
      boardEl.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [onMovePiece]);

  // --- クリック（デスクトップ / タップフォールバック） ---
  const handleClick = useCallback((index: number) => {
    if (dragRef.current || animatingRef.current || disabled) return;
    const sliding = getSlidingIndices(board, index, gridSize);
    if (sliding.length === 0) return;
    vibrate();
    onMovePiece(index);
  }, [board, disabled, gridSize, onMovePiece]);

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

        // 元画像でのこのピースの位置（正のパーセント）
        const origRow = Math.floor((value - 1) / gridSize);
        const origCol = (value - 1) % gridSize;

        const [eRow, eCol] = toRowCol(emptyIndex, gridSize);
        const [pRow, pCol] = toRowCol(index, gridSize);
        const canSlide = !disabled && (eRow === pRow || eCol === pCol);

        return (
          <button
            key={value}
            data-cell-index={index}
            className={`${styles.piece} ${canSlide ? styles.movable : styles.locked}`}
            onTouchStart={(e) => handleTouchStart(e, index)}
            onClick={() => handleClick(index)}
            aria-label={`ピース ${value}`}
          >
            <img
              src={imageUrl}
              alt=""
              draggable={false}
              className={styles.pieceImg}
              style={{
                width: `${gridSize * 100}%`,
                height: `${gridSize * 100}%`,
                left: `${-origCol * 100}%`,
                top: `${-origRow * 100}%`,
              }}
            />
            <span className={styles.pieceNumber}>{value}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PuzzleBoard;
