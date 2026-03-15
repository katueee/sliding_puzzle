import { useReducer, useEffect, useCallback, useRef } from 'react';
import type { GameState, GameAction, GridSize } from '../types/game';
import { shuffleBoard, movePiece, isSolved, createSolvedBoard } from '../utils/puzzle';
import { loadSettings, saveSettings, updateBestScore } from '../utils/storage';
import { playMoveSound, playClearSound, playTapSound } from '../utils/sound';

function createInitialState(): GameState {
  const settings = loadSettings();
  const size = settings.lastGridSize || 4;
  return {
    gridSize: size,
    board: createSolvedBoard(size),
    moves: 0,
    elapsed: 0,
    status: 'idle',
    soundEnabled: settings.soundEnabled,
    showTutorial: !settings.tutorialSeen,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MOVE_PIECE': {
      if (state.status === 'cleared') return state;
      const newBoard = movePiece(state.board, action.index, state.gridSize);
      if (!newBoard) return state;
      const newMoves = state.moves + 1;
      const newStatus = isSolved(newBoard, state.gridSize) ? 'cleared' : 'playing';
      return {
        ...state,
        board: newBoard,
        moves: newMoves,
        status: state.status === 'idle' ? 'playing' : newStatus,
      };
    }
    case 'SHUFFLE': {
      const newBoard = shuffleBoard(state.gridSize);
      return {
        ...state,
        board: newBoard,
        moves: 0,
        elapsed: 0,
        status: 'playing',
      };
    }
    case 'RESTART': {
      return {
        ...state,
        board: createSolvedBoard(state.gridSize),
        moves: 0,
        elapsed: 0,
        status: 'idle',
      };
    }
    case 'SET_GRID_SIZE': {
      return {
        ...state,
        gridSize: action.size,
        board: createSolvedBoard(action.size),
        moves: 0,
        elapsed: 0,
        status: 'idle',
      };
    }
    case 'TICK': {
      if (state.status !== 'playing') return state;
      return { ...state, elapsed: state.elapsed + 1 };
    }
    case 'TOGGLE_SOUND': {
      return { ...state, soundEnabled: !state.soundEnabled };
    }
    case 'DISMISS_TUTORIAL': {
      return { ...state, showTutorial: false };
    }
    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const prevStatusRef = useRef(state.status);

  // タイマー
  useEffect(() => {
    if (state.status !== 'playing') return;
    const timer = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(timer);
  }, [state.status]);

  // クリア時のベストスコア保存＋効果音
  useEffect(() => {
    if (prevStatusRef.current !== 'cleared' && state.status === 'cleared') {
      updateBestScore(state.gridSize, state.moves, state.elapsed);
      if (state.soundEnabled) playClearSound();
    }
    prevStatusRef.current = state.status;
  }, [state.status, state.gridSize, state.moves, state.elapsed, state.soundEnabled]);

  // 設定の永続化
  useEffect(() => {
    saveSettings({
      soundEnabled: state.soundEnabled,
      lastGridSize: state.gridSize,
      tutorialSeen: !state.showTutorial || loadSettings().tutorialSeen,
    });
  }, [state.soundEnabled, state.gridSize, state.showTutorial]);

  const handleMovePiece = useCallback((index: number) => {
    if (state.soundEnabled) playMoveSound();
    dispatch({ type: 'MOVE_PIECE', index });
  }, [state.soundEnabled]);

  const handleShuffle = useCallback(() => {
    if (state.soundEnabled) playTapSound();
    dispatch({ type: 'SHUFFLE' });
  }, [state.soundEnabled]);

  const handleRestart = useCallback(() => {
    if (state.soundEnabled) playTapSound();
    dispatch({ type: 'RESTART' });
  }, [state.soundEnabled]);

  const handleSetGridSize = useCallback((size: GridSize) => {
    if (state.soundEnabled) playTapSound();
    dispatch({ type: 'SET_GRID_SIZE', size });
  }, [state.soundEnabled]);

  const handleToggleSound = useCallback(() => {
    dispatch({ type: 'TOGGLE_SOUND' });
  }, []);

  const handleDismissTutorial = useCallback(() => {
    saveSettings({ tutorialSeen: true });
    dispatch({ type: 'DISMISS_TUTORIAL' });
  }, []);

  return {
    state,
    handleMovePiece,
    handleShuffle,
    handleRestart,
    handleSetGridSize,
    handleToggleSound,
    handleDismissTutorial,
  };
}
