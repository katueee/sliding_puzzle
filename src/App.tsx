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
import './App.css';

/** パズル用SVG文字列（背景画像として使用） */
function createPuzzleSvgString(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="%23ffe0f0"/>
        <stop offset="30%" stop-color="%23e8d0ff"/>
        <stop offset="60%" stop-color="%23d0e8ff"/>
        <stop offset="100%" stop-color="%23c8ffef"/>
      </linearGradient>
      <linearGradient id="rainbow" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="%23ffb3b3"/>
        <stop offset="20%" stop-color="%23ffd9b3"/>
        <stop offset="40%" stop-color="%23ffffb3"/>
        <stop offset="60%" stop-color="%23b3ffb3"/>
        <stop offset="80%" stop-color="%23b3d9ff"/>
        <stop offset="100%" stop-color="%23d9b3ff"/>
      </linearGradient>
      <linearGradient id="maneGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="%23ff99cc"/>
        <stop offset="50%" stop-color="%23cc99ff"/>
        <stop offset="100%" stop-color="%2399ccff"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(%23bgGrad)" rx="8"/>
    <g opacity="0.6">
      <ellipse cx="60" cy="60" rx="40" ry="18" fill="white"/>
      <ellipse cx="45" cy="55" rx="25" ry="14" fill="white"/>
      <ellipse cx="80" cy="55" rx="28" ry="15" fill="white"/>
      <ellipse cx="320" cy="45" rx="35" ry="16" fill="white"/>
      <ellipse cx="340" cy="40" rx="22" ry="12" fill="white"/>
      <ellipse cx="305" cy="40" rx="20" ry="11" fill="white"/>
      <ellipse cx="180" cy="35" rx="30" ry="13" fill="white"/>
      <ellipse cx="200" cy="30" rx="20" ry="10" fill="white"/>
    </g>
    <path d="M 30 200 Q 200 30 370 200" fill="none" stroke="url(%23rainbow)" stroke-width="14" opacity="0.45" stroke-linecap="round"/>
    <path d="M 45 210 Q 200 50 355 210" fill="none" stroke="url(%23rainbow)" stroke-width="8" opacity="0.3" stroke-linecap="round"/>
    <g transform="translate(120,130)">
      <ellipse cx="90" cy="120" rx="75" ry="50" fill="white"/>
      <path d="M 45 100 Q 30 60 50 30" stroke="white" stroke-width="30" fill="none" stroke-linecap="round"/>
      <ellipse cx="52" cy="25" rx="30" ry="24" fill="white"/>
      <polygon points="52,-5 46,25 58,25" fill="url(%23maneGrad)"/>
      <line x1="48" y1="8" x2="56" y2="8" stroke="white" stroke-width="1.5" opacity="0.7"/>
      <line x1="47" y1="14" x2="57" y2="14" stroke="white" stroke-width="1.5" opacity="0.7"/>
      <ellipse cx="36" cy="8" rx="6" ry="10" fill="white" transform="rotate(-15,36,8)"/>
      <ellipse cx="36" cy="8" rx="3" ry="6" fill="%23ffcce0" transform="rotate(-15,36,8)"/>
      <ellipse cx="42" cy="26" rx="4" ry="5" fill="%234a3560"/>
      <ellipse cx="42" cy="24" rx="1.5" ry="2" fill="white"/>
      <path d="M 38 22 Q 36 19 34 20" stroke="%234a3560" stroke-width="1.2" fill="none"/>
      <path d="M 40 21 Q 39 18 37 18" stroke="%234a3560" stroke-width="1.2" fill="none"/>
      <ellipse cx="34" cy="32" rx="2" ry="1.5" fill="%23ffb8d0"/>
      <ellipse cx="35" cy="34" rx="5" ry="3" fill="%23ffcce0" opacity="0.5"/>
      <path d="M 37 35 Q 42 40 47 35" stroke="%23e088a8" stroke-width="1.2" fill="none"/>
      <path d="M 60 5 Q 80 15 65 40 Q 85 30 70 55 Q 90 45 75 70" fill="none" stroke="url(%23maneGrad)" stroke-width="8" stroke-linecap="round" opacity="0.8"/>
      <path d="M 55 8 Q 75 20 60 45 Q 80 35 65 60" fill="none" stroke="%23ffb3d9" stroke-width="5" stroke-linecap="round" opacity="0.5"/>
      <path d="M 35 145 Q 20 170 10 195" stroke="white" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path d="M 55 148 Q 40 175 25 195" stroke="white" stroke-width="14" fill="none" stroke-linecap="round"/>
      <ellipse cx="10" cy="197" rx="6" ry="4" fill="%23ffcce0"/>
      <ellipse cx="25" cy="197" rx="6" ry="4" fill="%23ffcce0"/>
      <path d="M 130 145 Q 145 175 150 195" stroke="white" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path d="M 145 140 Q 160 165 170 195" stroke="white" stroke-width="14" fill="none" stroke-linecap="round"/>
      <ellipse cx="150" cy="197" rx="6" ry="4" fill="%23ffcce0"/>
      <ellipse cx="170" cy="197" rx="6" ry="4" fill="%23ffcce0"/>
      <path d="M 162 105 Q 195 80 190 120 Q 200 90 195 130" stroke="url(%23maneGrad)" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.8"/>
    </g>
    <g transform="translate(300,280)">
      <ellipse cx="25" cy="50" rx="22" ry="28" fill="white"/>
      <circle cx="25" cy="22" r="18" fill="white"/>
      <ellipse cx="16" cy="-5" rx="6" ry="18" fill="white"/>
      <ellipse cx="16" cy="-5" rx="3" ry="14" fill="%23ffcce0"/>
      <ellipse cx="34" cy="-5" rx="6" ry="18" fill="white"/>
      <ellipse cx="34" cy="-5" rx="3" ry="14" fill="%23ffcce0"/>
      <ellipse cx="19" cy="20" rx="3" ry="3.5" fill="%234a3560"/>
      <ellipse cx="19" cy="19" rx="1" ry="1.5" fill="white"/>
      <ellipse cx="31" cy="20" rx="3" ry="3.5" fill="%234a3560"/>
      <ellipse cx="31" cy="19" rx="1" ry="1.5" fill="white"/>
      <ellipse cx="25" cy="26" rx="2.5" ry="2" fill="%23ffb8d0"/>
      <path d="M 23 28 Q 25 31 27 28" stroke="%23e088a8" stroke-width="1" fill="none"/>
      <ellipse cx="14" cy="26" rx="4" ry="2.5" fill="%23ffcce0" opacity="0.5"/>
      <ellipse cx="36" cy="26" rx="4" ry="2.5" fill="%23ffcce0" opacity="0.5"/>
      <ellipse cx="15" cy="72" rx="7" ry="5" fill="white"/>
      <ellipse cx="35" cy="72" rx="7" ry="5" fill="white"/>
    </g>
    <g transform="translate(30,300)">
      <ellipse cx="30" cy="45" rx="22" ry="25" fill="%23ffe8cc"/>
      <circle cx="30" cy="20" r="17" fill="%23ffe8cc"/>
      <circle cx="15" cy="6" r="8" fill="%23ffe8cc"/>
      <circle cx="15" cy="6" r="4" fill="%23ffcca0"/>
      <circle cx="45" cy="6" r="8" fill="%23ffe8cc"/>
      <circle cx="45" cy="6" r="4" fill="%23ffcca0"/>
      <ellipse cx="23" cy="18" rx="2.5" ry="3" fill="%234a3560"/>
      <ellipse cx="23" cy="17" rx="1" ry="1.2" fill="white"/>
      <ellipse cx="37" cy="18" rx="2.5" ry="3" fill="%234a3560"/>
      <ellipse cx="37" cy="17" rx="1" ry="1.2" fill="white"/>
      <ellipse cx="30" cy="24" rx="4" ry="3" fill="%23ffcca0"/>
      <ellipse cx="30" cy="23" rx="2" ry="1.5" fill="%23cc8866"/>
      <path d="M 28 26 Q 30 29 32 26" stroke="%23cc8866" stroke-width="1" fill="none"/>
      <ellipse cx="17" cy="24" rx="4" ry="2.5" fill="%23ffcca0" opacity="0.5"/>
      <ellipse cx="43" cy="24" rx="4" ry="2.5" fill="%23ffcca0" opacity="0.5"/>
    </g>
    <g transform="translate(155,310)">
      <ellipse cx="25" cy="40" rx="18" ry="22" fill="%23e8e0f0"/>
      <circle cx="25" cy="18" r="15" fill="%23e8e0f0"/>
      <polygon points="12,6 8,-8 18,2" fill="%23e8e0f0"/>
      <polygon points="13,4 10,-4 17,2" fill="%23ffcce0"/>
      <polygon points="38,6 42,-8 32,2" fill="%23e8e0f0"/>
      <polygon points="37,4 40,-4 33,2" fill="%23ffcce0"/>
      <ellipse cx="19" cy="16" rx="2.5" ry="3" fill="%234a3560"/>
      <ellipse cx="19" cy="15" rx="1" ry="1.2" fill="white"/>
      <ellipse cx="31" cy="16" rx="2.5" ry="3" fill="%234a3560"/>
      <ellipse cx="31" cy="15" rx="1" ry="1.2" fill="white"/>
      <polygon points="25,21 23,23 27,23" fill="%23ffb8d0"/>
      <line x1="10" y1="22" x2="20" y2="23" stroke="%23c0b0d0" stroke-width="0.8"/>
      <line x1="10" y1="25" x2="20" y2="25" stroke="%23c0b0d0" stroke-width="0.8"/>
      <line x1="30" y1="23" x2="40" y2="22" stroke="%23c0b0d0" stroke-width="0.8"/>
      <line x1="30" y1="25" x2="40" y2="25" stroke="%23c0b0d0" stroke-width="0.8"/>
      <path d="M 40 50 Q 55 40 50 30" stroke="%23e8e0f0" stroke-width="5" fill="none" stroke-linecap="round"/>
    </g>
    <g opacity="0.7">
      <path d="M 95 100 C 87 82,73 92,95 108 C 117 92,103 82,95 100 Z" fill="%23ffb3d9" transform="scale(0.6) translate(52,67)"/>
      <path d="M 95 100 C 87 82,73 92,95 108 C 117 92,103 82,95 100 Z" fill="%23d9b3ff" transform="scale(0.5) translate(590,260)"/>
      <path d="M 95 100 C 87 82,73 92,95 108 C 117 92,103 82,95 100 Z" fill="%23ffb3b3" transform="scale(0.4) translate(575,125)"/>
      <path d="M 95 100 C 87 82,73 92,95 108 C 117 92,103 82,95 100 Z" fill="%23b3d9ff" transform="scale(0.5) translate(50,400)"/>
    </g>
  </svg>`;
}

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

  // SVGをdata URI化してCSS背景に使用
  const bgImageUrl = useMemo(() => {
    const svgString = createPuzzleSvgString();
    return `data:image/svg+xml,${svgString}`;
  }, []);

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
      {/* 背景装飾 */}
      <div className="bg-decoration">
        {['⭐', '☆', '✦', '♡', '☆', '⭐', '✦'].map((char, i) => (
          <span
            key={i}
            className="bg-star"
            style={{
              left: `${10 + i * 14}%`,
              top: `${5 + (i % 3) * 8}%`,
              animationDelay: `${i * 0.7}s`,
              fontSize: `${0.6 + (i % 3) * 0.3}rem`,
            }}
          >
            {char}
          </span>
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

        <div className="puzzle-area">
          <div className="puzzle-with-preview">
            <div
              className="puzzle-wrapper"
              style={{ '--puzzle-image': `url("${bgImageUrl}")` } as React.CSSProperties}
            >
              <PuzzleBoard
                board={state.board}
                gridSize={state.gridSize}
                onMovePiece={handleMovePiece}
                disabled={state.status === 'cleared'}
              />
            </div>
            <MiniPreview onClick={() => setShowPreview(true)} />
          </div>
        </div>

        <ActionButtons
          status={state.status}
          onShuffle={handleShuffle}
          onRestart={handleRestart}
          onShowPreview={() => setShowPreview(true)}
        />

        {/* ベストスコア表示 */}
        <div className="best-scores">
          {(bestScores.moves !== null || bestScores.time !== null) && (
            <p className="best-text">
              🏆 ベスト: {bestScores.moves ?? '-'} て /{' '}
              {bestScores.time != null
                ? `${Math.floor(bestScores.time / 60)}:${(bestScores.time % 60).toString().padStart(2, '0')}`
                : '-'}
            </p>
          )}
        </div>
      </div>

      {/* モーダル・オーバーレイ */}
      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} />

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
