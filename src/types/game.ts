/** ゲーム全体の型定義 */

/** パズルのグリッドサイズ */
export type GridSize = 3 | 4;

/** ピースの値（0 = 空きマス） */
export type PieceValue = number;

/** パズル盤面（1次元配列、左上から右下へ） */
export type Board = PieceValue[];

/** ゲームの状態 */
export type GameStatus = 'idle' | 'playing' | 'cleared';

/** ゲームの全状態 */
export interface GameState {
  gridSize: GridSize;
  board: Board;
  moves: number;
  elapsed: number; // 秒
  status: GameStatus;
  soundEnabled: boolean;
  showTutorial: boolean;
}

/** localStorage に保存する設定 */
export interface SavedSettings {
  soundEnabled: boolean;
  lastGridSize: GridSize;
  bestMoves: Record<GridSize, number | null>;
  bestTime: Record<GridSize, number | null>;
  tutorialSeen: boolean;
}

/** ゲームアクション */
export type GameAction =
  | { type: 'MOVE_PIECE'; index: number }
  | { type: 'SHUFFLE' }
  | { type: 'RESTART' }
  | { type: 'SET_GRID_SIZE'; size: GridSize }
  | { type: 'TICK' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'DISMISS_TUTORIAL' }
  | { type: 'LOAD_SETTINGS'; settings: Partial<SavedSettings> };
