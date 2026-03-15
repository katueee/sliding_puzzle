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
  /** ユーザーがタッチしたピースのboardインデックス */
  touchedIndex: number;
  /** ドラッグで動くピース群のboardインデックス */
  slidingIndices: number[];
  /** ドラッグで動くピース群のDOM要素 */
  slidingEls: HTMLElement[];
  /** ドラッグ方向 */
  axis: 'x' | 'y';
  /** 最大移動量px（正=右/下, 負=左/上） */
  maxDelta: number;
  /** タッチ開始座標 */
  startX: number;
  startY: number;
  /** 1セルのサイズpx */
  cellSize: number;
  /** 現在のクランプ済みdelta */
  currentDelta: number;
}

function vibrate() {
  try { navigator?.vibrate?.(12); } catch { /* ignore */ }
}

const PuzzleBoard: React.FC<Props> = ({ board, gridSize, onMovePiece, disabled, imageUrl }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const emptyIndex = getEmptyIndex(board);

  // --- ピース上でタッチ開始 ---
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLButtonElement>, index: number) => {
    if (disabled || !boardRef.current) return;

    // 同じ行 or 列にいるか確認し、動くピース群を取得
    const sliding = getSlidingIndices(board, index, gridSize);
    if (sliding.length === 0) return;

    const touch = e.touches[0];
    const rect = boardRef.current.getBoundingClientRect();
    const cellSize = rect.width / gridSize;

    const [eRow, eCol] = toRowCol(emptyIndex, gridSize);
    const [tRow, tCol] = toRowCol(index, gridSize);

    const axis: 'x' | 'y' = eRow === tRow ? 'x' : 'y';
    // 空きマス方向へ1セル分が最大移動量
    const maxDelta = axis === 'x'
      ? (eCol < tCol ? -1 : 1) * cellSize   // 空きが左なら左へ、右なら右へ
      : (eRow < tRow ? -1 : 1) * cellSize;

    // 動くピースのDOM要素を全取得
    const slidingEls = sliding.map(idx =>
      boardRef.current!.querySelector<HTMLElement>(`[data-cell-index="${idx}"]`)
    ).filter((el): el is HTMLElement => el !== null);

    // ドラッグ中はtransitionを切ってz-indexを上げる
    slidingEls.forEach(el => {
      el.style.transition = 'none';
      el.style.zIndex = '10';
    });

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

  // --- タッチ移動 & 終了（native listener: passive=false でスクロール防止）---
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

      // 全ピースを同時に移動
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

      const movedEnough = Math.abs(state.currentDelta) > state.cellSize * 0.25;

      // スナップバックアニメーション
      for (const el of state.slidingEls) {
        el.style.transition = 'transform 0.16s cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.transform = '';
        el.style.zIndex = '';
      }

      if (movedEnough) {
        requestAnimationFrame(() => onMovePiece(state.touchedIndex));
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

  // --- クリック（デスクトップ / タップのフォールバック） ---
  const handleClick = useCallback((index: number) => {
    if (dragRef.current || disabled) return;
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

        const origRow = Math.floor((value - 1) / gridSize);
        const origCol = (value - 1) % gridSize;
        const bgPosX = -(origCol * (100 / (gridSize - 1)));
        const bgPosY = -(origRow * (100 / (gridSize - 1)));

        // 同じ行/列にいるピースはスライド可能
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
