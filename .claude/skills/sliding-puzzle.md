# Skill: 1:1画像からスライドパズルPWAを作成する

任意の1:1（正方形）画像を使って、子ども向けスライドパズルPWAを新規作成、または既存プロジェクトに画像を差し替えるためのスキル。

---

## 前提条件

- Node.js 20+
- npm
- 1:1（正方形）のPNG/JPG画像（推奨: 1024x1024px以上）

---

## 1. 新規プロジェクト作成の場合

### 1.1 プロジェクト初期化

```bash
npm create vite@latest <project-name> -- --template react-ts
cd <project-name>
npm install
npm install -D vite-plugin-pwa workbox-window
```

### 1.2 ディレクトリ構成

```
<project-name>/
├── public/
│   ├── images/
│   │   ├── puzzle_3x3.png    ← 3x3用画像（1:1比率）
│   │   └── puzzle_4x4.png    ← 4x4用画像（1:1比率、別画像でも同一でもOK）
│   ├── pwa-192x192.png       ← PWAアイコン
│   ├── pwa-512x512.png       ← PWAアイコン
│   ├── apple-touch-icon.png  ← iOSアイコン
│   └── favicon.svg           ← ファビコン
├── src/
│   ├── main.tsx              ← エントリポイント（StrictMode）
│   ├── App.tsx               ← ルートコンポーネント
│   ├── App.css               ← グローバルスタイル・背景
│   ├── vite-env.d.ts         ← Vite型定義 + CSS Modules宣言
│   ├── types/
│   │   └── game.ts           ← 型定義
│   ├── hooks/
│   │   └── useGameState.ts   ← ゲーム状態管理（useReducer）
│   ├── utils/
│   │   ├── puzzle.ts         ← パズルロジック（シャッフル・解判定・スライド）
│   │   ├── storage.ts        ← localStorage永続化
│   │   └── sound.ts          ← Web Audio API効果音
│   └── components/
│       ├── PuzzleBoard.tsx + .module.css    ← パズル盤面（タッチドラッグ対応）
│       ├── GameHeader.tsx + .module.css     ← ステータスバー
│       ├── ActionButtons.tsx + .module.css  ← 操作ボタン
│       ├── PreviewModal.tsx + .module.css   ← 見本プレビュー（フルスクリーン）
│       ├── MiniPreview.tsx + .module.css    ← 見本サムネイル
│       ├── ClearOverlay.tsx + .module.css   ← クリア演出
│       └── Tutorial.tsx + .module.css       ← 初回チュートリアル
├── index.html
├── vite.config.ts
├── package.json
└── tsconfig*.json
```

---

## 2. 画像差し替えの場合（既存プロジェクト）

画像を差し替えるだけでパズルが動作する。以下の手順のみ：

1. 1:1画像を `public/images/` に配置
2. `src/App.tsx` の `getPuzzleImageUrl()` でパスを更新：

```tsx
function getPuzzleImageUrl(gridSize: GridSize): string {
  const base = import.meta.env.BASE_URL;
  return gridSize === 3
    ? `${base}images/<3x3用画像ファイル名>`
    : `${base}images/<4x4用画像ファイル名>`;
}
```

3. 必要に応じて `vite.config.ts` の `manifest` 内のアプリ名・説明を変更
4. 必要に応じて `index.html` の `<title>` と `<meta name="description">` を変更

---

## 3. コアアーキテクチャの設計原則

### 3.1 型定義 (`src/types/game.ts`)

```typescript
export type GridSize = 3 | 4;
export type PieceValue = number;
export type Board = PieceValue[];  // 1次元配列、左上→右下、0=空きマス
export type GameStatus = 'idle' | 'playing' | 'cleared';

export interface GameState {
  gridSize: GridSize;
  board: Board;
  moves: number;
  elapsed: number;  // 秒
  status: GameStatus;
  soundEnabled: boolean;
  showTutorial: boolean;
}

export interface SavedSettings {
  soundEnabled: boolean;
  lastGridSize: GridSize;
  bestMoves: Record<GridSize, number | null>;
  bestTime: Record<GridSize, number | null>;
  tutorialSeen: boolean;
}

export type GameAction =
  | { type: 'MOVE_PIECE'; index: number }
  | { type: 'SHUFFLE' }
  | { type: 'RESTART' }
  | { type: 'SET_GRID_SIZE'; size: GridSize }
  | { type: 'TICK' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'DISMISS_TUTORIAL' };
```

### 3.2 パズルロジック (`src/utils/puzzle.ts`)

重要な関数：

- **`createSolvedBoard(size)`** — 完成状態 `[1, 2, ..., n*n-1, 0]` を生成
- **`isSolved(board, size)`** — 完成判定
- **`slidePiecesTo(board, touchedIndex, size)`** — 同じ行/列のピースをまとめてスライド（1マス移動だけでなく複数マス一括移動）
- **`getSlidingIndices(board, touchedIndex, size)`** — アニメーション対象ピースの取得
- **`isSolvable(board, size)`** — 転倒数による解判定（奇数/偶数グリッド対応）
- **`shuffleBoard(size)`** — Fisher-Yatesシャッフル（解けない配置は除外）

### 3.3 画像のピース分割方式（CSS背景切り抜き）

画像を実際に分割せず、CSSで各ピースの表示領域を制御：

```tsx
// PuzzleBoard.tsx 内のピース描画
const origRow = Math.floor((value - 1) / gridSize);
const origCol = (value - 1) % gridSize;

<button className={styles.piece}>
  <img
    src={imageUrl}
    className={styles.pieceImg}
    style={{
      width: `${gridSize * 100}%`,    // 例: 3x3なら300%
      height: `${gridSize * 100}%`,
      left: `${-origCol * 100}%`,     // 水平オフセット
      top: `${-origRow * 100}%`,      // 垂直オフセット
    }}
  />
  <span className={styles.pieceNumber}>{value}</span>
</button>
```

```css
/* ピース内の画像は position:absolute + overflow:hidden で切り抜き */
.piece {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}
.pieceImg {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
```

### 3.4 タッチドラッグ操作（`PuzzleBoard.tsx`）

- `onTouchStart` → ドラッグ状態を初期化、スライド方向（x/y）を決定
- `touchmove` → ピースを指に追従させる（空きマス方向にクランプ）
- `touchend` → 5px以上移動で確定、残りをアニメーション補完。5px未満でスナップバック
- `onClick` → デスクトップのクリック操作フォールバック
- 二重操作防止に `animatingRef` を使用

### 3.5 状態管理 (`src/hooks/useGameState.ts`)

- `useReducer` でゲーム状態を一元管理
- タイマーは `useEffect` + `setInterval`（status === 'playing' 時のみ）
- クリア時に `updateBestScore()` で自動保存 + ファンファーレ再生
- 設定変更時に `saveSettings()` で永続化

### 3.6 効果音 (`src/utils/sound.ts`)

Web Audio API（外部ファイル不要）：

- `playMoveSound()` — 600→400Hz正弦波スイープ（120ms減衰）
- `playClearSound()` — 4段階ファンファーレ（上昇アルペジオ→和音→キラキラ→フィナーレ）
- `playTapSound()` — 800Hz短いビープ

---

## 4. クリア演出の設計

**重要**: オーバーレイは完全に透明（`background: none`）にし、完成したパズル画像をそのまま見せる。

### 4.1 オーバーレイ構造

```
overlay (position:fixed, background:none, pointer-events:none)
├── bursts[]      — 花火風バースト（放射状に広がる記号）
├── confetti[]    — 紙吹雪（上から降り注ぐ色付き矩形）
├── particles[]   — 浮遊パーティクル（絵文字がランダムに浮遊）
└── content       — 下部カード（pointer-events:auto）
    ├── title     — 「できたね！すっごーい！！」
    ├── stars     — ★評価（手数に応じて1〜3つ）
    ├── stats     — 手数・タイム表示
    └── buttons   — 「もういっかい！」「もどる」
```

### 4.2 CSS設計のポイント

```css
/* オーバーレイ: 完全に透明、エフェクトだけ */
.overlay {
  position: fixed;
  inset: 0;
  background: none;           /* 背景色なし！ */
  pointer-events: none;       /* タッチ透過 */
  z-index: 200;
}

/* 下部コンテンツカード: 独自の半透明背景 */
.content {
  pointer-events: auto;       /* ボタンだけタッチ受付 */
  background: rgba(255, 250, 255, 0.88);
  backdrop-filter: blur(12px);
  border-radius: 24px 24px 0 0;
  transform: translateY(100%);  /* 下からスライドイン */
}
```

### 4.3 パズル盤面の完成エフェクト

```css
/* App.css で盤面自体にゴールドのキラキラ枠 */
.puzzle-cleared {
  filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.6));
  animation: clearedGlow 2s ease-in-out infinite;
}
.puzzle-cleared::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 26px;
  background: linear-gradient(135deg, #ffd700, #ff88cc, #88ccff, ...);
  background-size: 400% 400%;
  animation: borderRainbow 3s linear infinite;
  z-index: -1;
}
```

---

## 5. PWA設定 (`vite.config.ts`)

```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/<repo-name>/',   // GitHub Pages用。ルートなら '/'
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: '<アプリ名>',
        short_name: '<短縮名>',
        description: '<説明>',
        theme_color: '#ffe8f5',
        background_color: '#ffe8f5',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/<repo-name>/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
```

---

## 6. GitHub Pages デプロイ (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci --legacy-peer-deps
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## 7. `index.html` テンプレート

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="theme-color" content="#ffe8f5" />
    <title><アプリ名></title>
    <meta name="description" content="<説明>" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 8. カスタマイズポイント一覧

| 項目 | ファイル | 変更箇所 |
|------|----------|----------|
| パズル画像 | `public/images/` + `App.tsx` | `getPuzzleImageUrl()` |
| アプリ名 | `index.html` + `vite.config.ts` | `<title>`, `manifest.name` |
| テーマカラー | `index.html` + `vite.config.ts` + `App.css` | `theme-color`, 背景グラデーション |
| 星評価の基準 | `ClearOverlay.tsx` | `starCount` の閾値 (`moves <= 30` 等) |
| クリア演出の絵文字 | `ClearOverlay.tsx` | `generateParticles()` の `emojis` 配列 |
| 効果音 | `utils/sound.ts` | 周波数・波形・タイミングを調整 |
| 難易度（グリッドサイズ） | `types/game.ts` | `GridSize` 型を拡張（例: `3 | 4 | 5`） |
| UI言語 | 各コンポーネント | テキスト文字列を変更 |
| 背景装飾 | `App.tsx` + `App.css` | `BG_CLOUDS`, `BG_STARS`, `BG_SPARKLES` |
| タッチ操作の感度 | `PuzzleBoard.tsx` | `movedEnough` 閾値（デフォルト5px） |

---

## 9. 注意事項

- **画像は必ず1:1（正方形）** — 非正方形だとピースの切り抜きがずれる
- **画像サイズ推奨: 1024x1024px** — 大きすぎると読み込み遅延、小さすぎるとぼやける
- **PWAアイコンは画像とは別に用意** — `pwa-192x192.png`, `pwa-512x512.png`
- **`vite.config.ts` の `base`** — GitHub Pagesではリポジトリ名に合わせる
- **解判定（転倒数）** — グリッドサイズを拡張する場合、`isSolvable()` は奇数/偶数グリッドの両方に対応済み
- **パフォーマンス** — CSS Modulesで名前衝突回避、`will-change: transform` でGPUアクセラレーション
- **オフライン対応** — Service Workerが全アセットをキャッシュ、オフラインでもプレイ可能
