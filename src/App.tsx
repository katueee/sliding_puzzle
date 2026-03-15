import { useState, useMemo } from 'react';
import { useGameState } from './hooks/useGameState';
import PuzzleBoard from './components/PuzzleBoard';
import GameHeader from './components/GameHeader';
import ActionButtons from './components/ActionButtons';
import PreviewModal from './components/PreviewModal';
import ClearOverlay from './components/ClearOverlay';
import Tutorial from './components/Tutorial';
import MiniPreview from './components/MiniPreview';
import { loadSettings } from './utils/storage';
import type { GridSize } from './types/game';
import './App.css';

/** グリッドサイズに応じたパズル画像URLを返す */
function getPuzzleImageUrl(gridSize: GridSize): string {
  const base = import.meta.env.BASE_URL;
  return gridSize === 3
    ? `${base}images/unicorn_image_v1.png`
    : `${base}images/unicorn_image_v2.png`;
}

/** 背景の雲データ */
const BG_CLOUDS = [
  { w: 120, h: 50, left: '-5%', top: '12%', delay: '0s', opacity: 0.5 },
  { w: 100, h: 40, left: '60%', top: '6%', delay: '3s', opacity: 0.4 },
  { w: 80, h: 35, left: '30%', top: '18%', delay: '7s', opacity: 0.35 },
  { w: 140, h: 55, left: '75%', top: '20%', delay: '11s', opacity: 0.3 },
];

/** 背景の星データ */
const BG_STARS = [
  { char: '⭐', left: '8%', top: '5%', delay: '0s', size: '0.7rem', color: 'rgba(255,210,100,0.5)' },
  { char: '✦', left: '22%', top: '14%', delay: '0.8s', size: '0.5rem', color: 'rgba(255,180,220,0.5)' },
  { char: '☆', left: '38%', top: '4%', delay: '1.5s', size: '0.85rem', color: 'rgba(200,180,255,0.45)' },
  { char: '♡', left: '52%', top: '10%', delay: '2.2s', size: '0.6rem', color: 'rgba(255,160,200,0.5)' },
  { char: '✦', left: '68%', top: '3%', delay: '3s', size: '0.55rem', color: 'rgba(180,200,255,0.5)' },
  { char: '⭐', left: '82%', top: '12%', delay: '3.8s', size: '0.65rem', color: 'rgba(255,220,130,0.45)' },
  { char: '☆', left: '92%', top: '6%', delay: '4.5s', size: '0.5rem', color: 'rgba(220,180,255,0.5)' },
  { char: '♡', left: '15%', top: '22%', delay: '5.2s', size: '0.5rem', color: 'rgba(255,180,210,0.4)' },
  { char: '✦', left: '75%', top: '18%', delay: '6s', size: '0.45rem', color: 'rgba(180,220,255,0.45)' },
];

/** 光の粒データ */
const BG_SPARKLES = [
  { left: '12%', top: '30%', delay: '0s', color: 'rgba(255,200,230,0.6)' },
  { left: '28%', top: '50%', delay: '1.5s', color: 'rgba(200,180,255,0.5)' },
  { left: '45%', top: '25%', delay: '2.8s', color: 'rgba(255,230,180,0.5)' },
  { left: '62%', top: '45%', delay: '0.8s', color: 'rgba(180,220,255,0.5)' },
  { left: '78%', top: '35%', delay: '3.5s', color: 'rgba(255,200,220,0.6)' },
  { left: '90%', top: '55%', delay: '2s', color: 'rgba(220,200,255,0.5)' },
  { left: '35%', top: '70%', delay: '4s', color: 'rgba(200,240,220,0.5)' },
  { left: '55%', top: '60%', delay: '5s', color: 'rgba(255,210,240,0.5)' },
];

function App() {
  const {
    state,
    handleMovePiece,
    handleShuffle,
    handleRestart,
    handleSetGridSize,
    handleToggleSound,
    handleDismissTutorial,
  } = useGameState();

  const [showPreview, setShowPreview] = useState(false);

  // グリッドサイズに応じた画像URL
  const imageUrl = useMemo(() => getPuzzleImageUrl(state.gridSize), [state.gridSize]);

  // ベストスコア取得
  const bestScores = useMemo(() => {
    const settings = loadSettings();
    return {
      moves: settings.bestMoves[state.gridSize],
      time: settings.bestTime[state.gridSize],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.gridSize, state.status]);

  return (
    <div className="app">
      {/* 背景装飾レイヤー */}
      <div className="bg-decoration">
        {BG_CLOUDS.map((c, i) => (
          <div
            key={`cloud-${i}`}
            className="bg-cloud"
            style={{
              width: c.w,
              height: c.h,
              left: c.left,
              top: c.top,
              opacity: c.opacity,
              animationDelay: c.delay,
            }}
          />
        ))}
        {BG_STARS.map((s, i) => (
          <span
            key={`star-${i}`}
            className="bg-star"
            style={{
              left: s.left,
              top: s.top,
              animationDelay: s.delay,
              fontSize: s.size,
              color: s.color,
            }}
          >
            {s.char}
          </span>
        ))}
        {BG_SPARKLES.map((sp, i) => (
          <div
            key={`sparkle-${i}`}
            className="bg-sparkle"
            style={{
              left: sp.left,
              top: sp.top,
              animationDelay: sp.delay,
              background: sp.color,
              boxShadow: `0 0 6px ${sp.color}`,
            }}
          />
        ))}
      </div>

      <div className="app-container">
        <GameHeader
          moves={state.moves}
          elapsed={state.elapsed}
          soundEnabled={state.soundEnabled}
          gridSize={state.gridSize}
          onToggleSound={handleToggleSound}
          onSetGridSize={handleSetGridSize}
        />

        {/* 盤面エリア */}
        <div className="puzzle-area">
          <div className="puzzle-wrapper">
            <PuzzleBoard
              board={state.board}
              gridSize={state.gridSize}
              onMovePiece={handleMovePiece}
              disabled={state.status === 'cleared'}
              imageUrl={imageUrl}
            />
          </div>
        </div>

        {/* 盤面下: 見本サムネイル＋ベストスコア */}
        <div className="sub-info">
          <MiniPreview onClick={() => setShowPreview(true)} imageUrl={imageUrl} />
          {(bestScores.moves !== null || bestScores.time !== null) && (
            <span className="best-text">
              🏆 {bestScores.moves ?? '-'}て /{' '}
              {bestScores.time != null
                ? `${Math.floor(bestScores.time / 60)}:${(bestScores.time % 60).toString().padStart(2, '0')}`
                : '-'}
            </span>
          )}
        </div>

        {/* 操作ボタン */}
        <ActionButtons
          status={state.status}
          onShuffle={handleShuffle}
          onRestart={handleRestart}
          onShowPreview={() => setShowPreview(true)}
        />
      </div>

      {/* モーダル・オーバーレイ */}
      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} imageUrl={imageUrl} />

      {state.status === 'cleared' && (
        <ClearOverlay
          moves={state.moves}
          elapsed={state.elapsed}
          onRestart={handleRestart}
          onShuffle={handleShuffle}
        />
      )}

      {state.showTutorial && <Tutorial onDismiss={handleDismissTutorial} />}
    </div>
  );
}

export default App;
