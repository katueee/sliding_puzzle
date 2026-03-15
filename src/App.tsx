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

/** パズル用SVG文字列（背景画像として使用）— ゆめかわユニコーン＋小動物 */
function createPuzzleSvgString(): string {
  const raw = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#fff0f8"/>
        <stop offset="25%" stop-color="#f0e0ff"/>
        <stop offset="50%" stop-color="#e0e8ff"/>
        <stop offset="75%" stop-color="#d8f0f8"/>
        <stop offset="100%" stop-color="#f8e8ff"/>
      </linearGradient>
      <linearGradient id="rainbow" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ffb3b3"/>
        <stop offset="16%" stop-color="#ffd0a0"/>
        <stop offset="33%" stop-color="#ffffa0"/>
        <stop offset="50%" stop-color="#a0ffb0"/>
        <stop offset="66%" stop-color="#a0d0ff"/>
        <stop offset="83%" stop-color="#c0a0ff"/>
        <stop offset="100%" stop-color="#ffa0d0"/>
      </linearGradient>
      <linearGradient id="maneGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffaadd"/>
        <stop offset="35%" stop-color="#ddaaff"/>
        <stop offset="70%" stop-color="#aaccff"/>
        <stop offset="100%" stop-color="#aaffdd"/>
      </linearGradient>
      <linearGradient id="hornGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fffbe0"/>
        <stop offset="30%" stop-color="#ffccee"/>
        <stop offset="70%" stop-color="#ddbbff"/>
        <stop offset="100%" stop-color="#bbddff"/>
      </linearGradient>
      <radialGradient id="glowPink" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffd0e8" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#ffd0e8" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="glowBlue" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#d0e8ff" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#d0e8ff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bgGrad)" rx="8"/>
    <circle cx="100" cy="300" r="100" fill="url(#glowPink)"/>
    <circle cx="320" cy="120" r="80" fill="url(#glowBlue)"/>
    <circle cx="200" cy="200" r="120" fill="url(#glowPink)" opacity="0.3"/>
    <g opacity="0.7">
      <ellipse cx="55" cy="55" rx="45" ry="20" fill="white"/>
      <ellipse cx="38" cy="48" rx="28" ry="16" fill="white"/>
      <ellipse cx="78" cy="48" rx="30" ry="17" fill="white"/>
      <ellipse cx="62" cy="42" rx="18" ry="12" fill="white"/>
      <ellipse cx="310" cy="40" rx="40" ry="18" fill="white"/>
      <ellipse cx="335" cy="34" rx="25" ry="14" fill="white"/>
      <ellipse cx="295" cy="34" rx="22" ry="13" fill="white"/>
      <ellipse cx="315" cy="28" rx="16" ry="10" fill="white"/>
      <ellipse cx="180" cy="30" rx="34" ry="15" fill="white"/>
      <ellipse cx="200" cy="24" rx="22" ry="12" fill="white"/>
      <ellipse cx="165" cy="25" rx="18" ry="10" fill="white"/>
    </g>
    <path d="M 20 220 Q 200 20 380 220" fill="none" stroke="url(#rainbow)" stroke-width="18" opacity="0.35" stroke-linecap="round"/>
    <path d="M 40 230 Q 200 50 360 230" fill="none" stroke="url(#rainbow)" stroke-width="10" opacity="0.2" stroke-linecap="round"/>
    <g fill="#fffbe0" opacity="0.9">
      <polygon points="50,120 53,127 60,128 55,132 56,140 50,136 44,140 45,132 40,128 47,127"/>
      <polygon points="340,100 342,105 348,106 344,109 345,114 340,111 335,114 336,109 332,106 338,105"/>
      <polygon points="100,25 102,30 107,31 104,33 104,38 100,35 96,38 96,33 93,31 98,30"/>
      <polygon points="290,20 292,24 296,25 293,27 294,31 290,29 286,31 287,27 284,25 288,24"/>
      <polygon points="370,175 372,179 376,180 373,182 374,186 370,184 366,186 367,182 364,180 368,179"/>
      <polygon points="22,180 24,184 28,185 25,187 26,191 22,189 18,191 19,187 16,185 20,184"/>
      <polygon points="200,65 202,69 206,70 203,72 204,76 200,74 196,76 197,72 194,70 198,69"/>
      <polygon points="145,50 147,53 150,54 148,56 148,59 145,57 142,59 142,56 140,54 143,53"/>
      <polygon points="260,55 262,58 265,59 263,61 263,64 260,62 257,64 257,61 255,59 258,58"/>
      <polygon points="380,80 381,83 384,84 382,85 382,88 380,86 378,88 378,85 376,84 379,83"/>
    </g>
    <g transform="translate(110,120)">
      <ellipse cx="95" cy="115" rx="80" ry="52" fill="white"/>
      <ellipse cx="80" cy="108" rx="50" ry="30" fill="#fff5fa" opacity="0.5"/>
      <path d="M 45 95 Q 28 55 50 25" stroke="white" stroke-width="32" fill="none" stroke-linecap="round"/>
      <path d="M 50 90 Q 35 60 52 30" stroke="#fff5fa" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.4"/>
      <ellipse cx="52" cy="22" rx="32" ry="26" fill="white"/>
      <ellipse cx="45" cy="18" rx="18" ry="14" fill="#fff8fc" opacity="0.4"/>
      <polygon points="52,-12 44,22 60,22" fill="url(#hornGrad)"/>
      <line x1="47" y1="2" x2="57" y2="2" stroke="white" stroke-width="1.8" opacity="0.8"/>
      <line x1="46" y1="8" x2="58" y2="8" stroke="white" stroke-width="1.5" opacity="0.7"/>
      <line x1="45" y1="14" x2="59" y2="14" stroke="white" stroke-width="1.3" opacity="0.6"/>
      <circle cx="52" cy="-10" r="3" fill="#fffbe0" opacity="0.8"/>
      <ellipse cx="34" cy="4" rx="7" ry="12" fill="white" transform="rotate(-20,34,4)"/>
      <ellipse cx="34" cy="4" rx="3.5" ry="8" fill="#ffcce0" transform="rotate(-20,34,4)"/>
      <ellipse cx="40" cy="24" rx="5" ry="6" fill="#4a3560"/>
      <ellipse cx="40" cy="22" rx="2" ry="2.5" fill="white"/>
      <circle cx="43" cy="26" r="1" fill="white" opacity="0.6"/>
      <path d="M 35 19 Q 32 15 30 16" stroke="#4a3560" stroke-width="1.4" fill="none"/>
      <path d="M 37 18 Q 35 14 33 14" stroke="#4a3560" stroke-width="1.4" fill="none"/>
      <path d="M 39 17 Q 38 14 36 13" stroke="#4a3560" stroke-width="1.2" fill="none"/>
      <ellipse cx="32" cy="30" rx="2.5" ry="2" fill="#ffb8d0"/>
      <ellipse cx="30" cy="33" rx="7" ry="4" fill="#ffcce0" opacity="0.45"/>
      <path d="M 35 34 Q 40 40 48 34" stroke="#e088a8" stroke-width="1.3" fill="none"/>
      <path d="M 62 0 Q 85 12 68 38 Q 92 26 74 55 Q 98 42 80 72"
        fill="none" stroke="url(#maneGrad)" stroke-width="10" stroke-linecap="round" opacity="0.85"/>
      <path d="M 58 3 Q 78 18 62 42 Q 84 32 68 60"
        fill="none" stroke="#ffb3d9" stroke-width="6" stroke-linecap="round" opacity="0.5"/>
      <path d="M 65 -2 Q 82 8 72 28"
        fill="none" stroke="#aaccff" stroke-width="4" stroke-linecap="round" opacity="0.4"/>
      <path d="M 32 145 Q 15 172 5 200" stroke="white" stroke-width="15" fill="none" stroke-linecap="round"/>
      <path d="M 52 148 Q 35 178 22 200" stroke="white" stroke-width="15" fill="none" stroke-linecap="round"/>
      <ellipse cx="5" cy="202" rx="7" ry="4.5" fill="#ffcce0"/>
      <ellipse cx="22" cy="202" rx="7" ry="4.5" fill="#ffcce0"/>
      <path d="M 135 145 Q 150 178 155 200" stroke="white" stroke-width="15" fill="none" stroke-linecap="round"/>
      <path d="M 150 140 Q 165 168 175 200" stroke="white" stroke-width="15" fill="none" stroke-linecap="round"/>
      <ellipse cx="155" cy="202" rx="7" ry="4.5" fill="#ffcce0"/>
      <ellipse cx="175" cy="202" rx="7" ry="4.5" fill="#ffcce0"/>
      <path d="M 168 100 Q 205 72 198 115 Q 212 82 205 128 Q 218 95 210 138"
        stroke="url(#maneGrad)" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.85"/>
      <path d="M 172 105 Q 200 82 196 118"
        stroke="#ffb3d9" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.4"/>
      <circle cx="70" cy="105" r="2" fill="#fffbe0" opacity="0.7"/>
      <circle cx="110" cy="100" r="1.5" fill="#fffbe0" opacity="0.6"/>
      <circle cx="55" cy="115" r="1.5" fill="#ffe0f0" opacity="0.5"/>
      <circle cx="130" cy="120" r="2" fill="#e0e8ff" opacity="0.5"/>
    </g>
    <g transform="translate(290,265)">
      <ellipse cx="30" cy="55" rx="26" ry="32" fill="white"/>
      <ellipse cx="24" cy="48" rx="14" ry="16" fill="#fff8fc" opacity="0.4"/>
      <circle cx="30" cy="24" r="21" fill="white"/>
      <circle cx="25" cy="20" r="10" fill="#fff8fc" opacity="0.3"/>
      <ellipse cx="18" cy="-6" rx="7" ry="21" fill="white"/>
      <ellipse cx="18" cy="-6" rx="3.5" ry="16" fill="#ffcce0"/>
      <ellipse cx="42" cy="-6" rx="7" ry="21" fill="white"/>
      <ellipse cx="42" cy="-6" rx="3.5" ry="16" fill="#ffcce0"/>
      <ellipse cx="22" cy="22" rx="3.5" ry="4" fill="#4a3560"/>
      <ellipse cx="22" cy="20.5" rx="1.2" ry="1.8" fill="white"/>
      <circle cx="24" cy="23.5" r="0.7" fill="white" opacity="0.5"/>
      <ellipse cx="38" cy="22" rx="3.5" ry="4" fill="#4a3560"/>
      <ellipse cx="38" cy="20.5" rx="1.2" ry="1.8" fill="white"/>
      <circle cx="40" cy="23.5" r="0.7" fill="white" opacity="0.5"/>
      <ellipse cx="30" cy="29" rx="3" ry="2.5" fill="#ffb8d0"/>
      <path d="M 27 31 Q 30 35 33 31" stroke="#e088a8" stroke-width="1.2" fill="none"/>
      <ellipse cx="15" cy="29" rx="5" ry="3" fill="#ffcce0" opacity="0.45"/>
      <ellipse cx="45" cy="29" rx="5" ry="3" fill="#ffcce0" opacity="0.45"/>
      <ellipse cx="18" cy="80" rx="8" ry="6" fill="white"/>
      <ellipse cx="42" cy="80" rx="8" ry="6" fill="white"/>
      <circle cx="50" cy="60" r="6" fill="white"/>
      <circle cx="52" cy="58" r="3" fill="#fff0f5" opacity="0.5"/>
      <path d="M 16 -12 Q 8 -20 4 -12 Q 0 -4 8 -8" fill="#ffaacc" opacity="0.8"/>
      <path d="M 16 -12 Q 24 -20 28 -12 Q 32 -4 24 -8" fill="#ffaacc" opacity="0.8"/>
      <circle cx="16" cy="-12" r="2" fill="#ff88aa"/>
    </g>
    <g transform="translate(20,285)">
      <ellipse cx="35" cy="50" rx="26" ry="30" fill="#ffe8cc"/>
      <ellipse cx="28" cy="44" rx="14" ry="15" fill="#fff0dd" opacity="0.4"/>
      <circle cx="35" cy="22" r="20" fill="#ffe8cc"/>
      <circle cx="16" cy="6" r="9" fill="#ffe8cc"/>
      <circle cx="16" cy="6" r="5" fill="#ffcca0"/>
      <circle cx="54" cy="6" r="9" fill="#ffe8cc"/>
      <circle cx="54" cy="6" r="5" fill="#ffcca0"/>
      <ellipse cx="27" cy="20" rx="3" ry="3.5" fill="#4a3560"/>
      <ellipse cx="27" cy="18.5" rx="1.2" ry="1.5" fill="white"/>
      <ellipse cx="43" cy="20" rx="3" ry="3.5" fill="#4a3560"/>
      <ellipse cx="43" cy="18.5" rx="1.2" ry="1.5" fill="white"/>
      <ellipse cx="35" cy="27" rx="5" ry="3.5" fill="#ffcca0"/>
      <ellipse cx="35" cy="26" rx="2.5" ry="2" fill="#cc8866"/>
      <path d="M 32 29 Q 35 33 38 29" stroke="#cc8866" stroke-width="1.2" fill="none"/>
      <ellipse cx="19" cy="27" rx="5" ry="3" fill="#ffcca0" opacity="0.45"/>
      <ellipse cx="51" cy="27" rx="5" ry="3" fill="#ffcca0" opacity="0.45"/>
      <ellipse cx="18" cy="72" rx="9" ry="7" fill="#ffe8cc"/>
      <ellipse cx="52" cy="72" rx="9" ry="7" fill="#ffe8cc"/>
      <path d="M 28 38 Q 22 32 22 38 Q 22 44 28 38" fill="#aaccff" opacity="0.8"/>
      <path d="M 28 38 Q 34 32 34 38 Q 34 44 28 38" fill="#aaccff" opacity="0.8"/>
      <circle cx="28" cy="38" r="2" fill="#88aadd"/>
    </g>
    <g transform="translate(148,300)">
      <ellipse cx="28" cy="44" rx="20" ry="25" fill="#e8e0f0"/>
      <ellipse cx="22" cy="38" rx="10" ry="12" fill="#efe8f8" opacity="0.4"/>
      <circle cx="28" cy="20" r="17" fill="#e8e0f0"/>
      <polygon points="14,7 9,-10 21,3" fill="#e8e0f0"/>
      <polygon points="15,5 11,-5 20,3" fill="#ffcce0"/>
      <polygon points="42,7 47,-10 35,3" fill="#e8e0f0"/>
      <polygon points="41,5 45,-5 36,3" fill="#ffcce0"/>
      <ellipse cx="21" cy="18" rx="3" ry="3.5" fill="#4a3560"/>
      <ellipse cx="21" cy="16.5" rx="1.2" ry="1.5" fill="white"/>
      <ellipse cx="35" cy="18" rx="3" ry="3.5" fill="#4a3560"/>
      <ellipse cx="35" cy="16.5" rx="1.2" ry="1.5" fill="white"/>
      <polygon points="28,23 25,26 31,26" fill="#ffb8d0"/>
      <line x1="10" y1="24" x2="22" y2="25" stroke="#c0b0d0" stroke-width="0.8"/>
      <line x1="10" y1="27" x2="22" y2="27" stroke="#c0b0d0" stroke-width="0.8"/>
      <line x1="34" y1="25" x2="46" y2="24" stroke="#c0b0d0" stroke-width="0.8"/>
      <line x1="34" y1="27" x2="46" y2="27" stroke="#c0b0d0" stroke-width="0.8"/>
      <ellipse cx="15" cy="25" rx="4" ry="2.5" fill="#e0c8e8" opacity="0.5"/>
      <ellipse cx="41" cy="25" rx="4" ry="2.5" fill="#e0c8e8" opacity="0.5"/>
      <path d="M 45 55 Q 62 42 56 28" stroke="#e8e0f0" stroke-width="6" fill="none" stroke-linecap="round"/>
      <circle cx="56" cy="27" r="3" fill="#e0d0f0"/>
      <ellipse cx="18" cy="64" rx="7" ry="5" fill="#e8e0f0"/>
      <ellipse cx="38" cy="64" rx="7" ry="5" fill="#e8e0f0"/>
    </g>
    <g transform="translate(80,90) scale(0.9)">
      <path d="M 0 0 Q -12 -10 -8 -2 Q -14 -6 -4 2" fill="#ffccee" opacity="0.7"/>
      <path d="M 0 0 Q 12 -10 8 -2 Q 14 -6 4 2" fill="#ddccff" opacity="0.7"/>
      <circle cx="0" cy="0" r="1" fill="#aa88cc"/>
    </g>
    <g transform="translate(340,200) scale(0.7) rotate(15)">
      <path d="M 0 0 Q -12 -10 -8 -2 Q -14 -6 -4 2" fill="#ccddff" opacity="0.7"/>
      <path d="M 0 0 Q 12 -10 8 -2 Q 14 -6 4 2" fill="#ffccdd" opacity="0.7"/>
      <circle cx="0" cy="0" r="1" fill="#aa88cc"/>
    </g>
    <g opacity="0.6">
      <path d="M 0 -6 C -6 -14,-18 -6,0 6 C 18 -6,6 -14,0 -6 Z" fill="#ffb3d9" transform="translate(88,108) scale(0.55)"/>
      <path d="M 0 -6 C -6 -14,-18 -6,0 6 C 18 -6,6 -14,0 -6 Z" fill="#d9b3ff" transform="translate(325,185) scale(0.45)"/>
      <path d="M 0 -6 C -6 -14,-18 -6,0 6 C 18 -6,6 -14,0 -6 Z" fill="#ffb3b3" transform="translate(248,85) scale(0.4)"/>
      <path d="M 0 -6 C -6 -14,-18 -6,0 6 C 18 -6,6 -14,0 -6 Z" fill="#b3d9ff" transform="translate(52,255) scale(0.5)"/>
      <path d="M 0 -6 C -6 -14,-18 -6,0 6 C 18 -6,6 -14,0 -6 Z" fill="#ffcce0" transform="translate(355,268) scale(0.35)"/>
      <path d="M 0 -6 C -6 -14,-18 -6,0 6 C 18 -6,6 -14,0 -6 Z" fill="#ccddff" transform="translate(160,78) scale(0.3)"/>
    </g>
    <g opacity="0.6">
      <g transform="translate(375,365)">
        <circle cx="6" cy="0" r="5" fill="#ffcce0"/><circle cx="-6" cy="0" r="5" fill="#ffcce0"/>
        <circle cx="0" cy="6" r="5" fill="#ffcce0"/><circle cx="0" cy="-6" r="5" fill="#ffcce0"/>
        <circle cx="4" cy="4" r="5" fill="#ffd8e8"/><circle cx="0" cy="0" r="3.5" fill="#fffbe0"/>
      </g>
      <g transform="translate(15,365)">
        <circle cx="5" cy="0" r="4.5" fill="#d9ccff"/><circle cx="-5" cy="0" r="4.5" fill="#d9ccff"/>
        <circle cx="0" cy="5" r="4.5" fill="#d9ccff"/><circle cx="0" cy="-5" r="4.5" fill="#d9ccff"/>
        <circle cx="3.5" cy="3.5" r="4.5" fill="#e0d4ff"/><circle cx="0" cy="0" r="3" fill="#fffbe0"/>
      </g>
      <g transform="translate(120,385)">
        <circle cx="4" cy="0" r="3.5" fill="#cce8ff"/><circle cx="-4" cy="0" r="3.5" fill="#cce8ff"/>
        <circle cx="0" cy="4" r="3.5" fill="#cce8ff"/><circle cx="0" cy="-4" r="3.5" fill="#cce8ff"/>
        <circle cx="0" cy="0" r="2.5" fill="#fffbe0"/>
      </g>
      <g transform="translate(250,378)">
        <circle cx="5" cy="0" r="4" fill="#ffe0cc"/><circle cx="-5" cy="0" r="4" fill="#ffe0cc"/>
        <circle cx="0" cy="5" r="4" fill="#ffe0cc"/><circle cx="0" cy="-5" r="4" fill="#ffe0cc"/>
        <circle cx="0" cy="0" r="3" fill="#fffbe0"/>
      </g>
    </g>
    <path d="M 0 395 Q 50 380 100 390 Q 150 395 200 385 Q 250 390 300 388 Q 350 392 400 385 L 400 400 L 0 400 Z" fill="#d8f5e0" opacity="0.4"/>
    <path d="M 0 398 Q 80 390 160 395 Q 240 398 320 392 Q 360 395 400 393 L 400 400 L 0 400 Z" fill="#c8ecd8" opacity="0.3"/>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(raw)}`;
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

  // SVGをdata URI化してCSS背景に使用
  const bgImageUrl = useMemo(() => createPuzzleSvgString(), []);

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
        {/* ふわふわ雲 */}
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
        {/* きらきら星 */}
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
        {/* 光の粒 */}
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

        {/* 盤面エリア — 画面の主役 */}
        <div className="puzzle-area">
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
        </div>

        {/* 盤面下: 見本サムネイル＋ベストスコア */}
        <div className="sub-info">
          <MiniPreview onClick={() => setShowPreview(true)} />
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
