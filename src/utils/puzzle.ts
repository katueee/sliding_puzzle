import type { Board, GridSize } from '../types/game';

/** 完成状態の盤面を生成（1,2,...,n*n-1, 0） */
export function createSolvedBoard(size: GridSize): Board {
  const total = size * size;
  const board: Board = [];
  for (let i = 1; i < total; i++) board.push(i);
  board.push(0);
  return board;
}

/** 盤面が完成状態かを判定 */
export function isSolved(board: Board, size: GridSize): boolean {
  const solved = createSolvedBoard(size);
  return board.every((v, i) => v === solved[i]);
}

/** 空きマス（0）のインデックスを取得 */
export function getEmptyIndex(board: Board): number {
  return board.indexOf(0);
}

/** 指定インデックスの行・列を取得 */
export function toRowCol(index: number, size: GridSize): [number, number] {
  return [Math.floor(index / size), index % size];
}

/** 指定インデックスが空きマスに隣接しているか判定 */
export function isAdjacent(index: number, emptyIndex: number, size: GridSize): boolean {
  const [r1, c1] = toRowCol(index, size);
  const [r2, c2] = toRowCol(emptyIndex, size);
  return (Math.abs(r1 - r2) + Math.abs(c1 - c2)) === 1;
}

/** ピースを移動（隣接なら入れ替え）。新しい盤面を返す */
export function movePiece(board: Board, index: number, size: GridSize): Board | null {
  const emptyIndex = getEmptyIndex(board);
  if (!isAdjacent(index, emptyIndex, size)) return null;
  const newBoard = [...board];
  [newBoard[index], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[index]];
  return newBoard;
}

/**
 * 転倒数を用いて解けるかどうかを判定（15パズルの解法条件）
 * - グリッドサイズが奇数: 転倒数が偶数なら解ける
 * - グリッドサイズが偶数: 転倒数 + 空きマスの下からの行番号 が奇数なら解ける
 */
export function isSolvable(board: Board, size: GridSize): boolean {
  let inversions = 0;
  const tiles = board.filter(v => v !== 0);
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] > tiles[j]) inversions++;
    }
  }

  if (size % 2 === 1) {
    return inversions % 2 === 0;
  } else {
    const emptyIndex = getEmptyIndex(board);
    const emptyRowFromBottom = size - Math.floor(emptyIndex / size);
    return (inversions + emptyRowFromBottom) % 2 === 1;
  }
}

/** 解ける状態のシャッフル盤面を生成 */
export function shuffleBoard(size: GridSize): Board {
  const total = size * size;
  let board: Board;
  do {
    // Fisher-Yates シャッフル
    board = createSolvedBoard(size);
    for (let i = total - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [board[i], board[j]] = [board[j], board[i]];
    }
  } while (!isSolvable(board, size) || isSolved(board, size));
  return board;
}
