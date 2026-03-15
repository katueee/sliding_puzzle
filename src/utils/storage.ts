import type { SavedSettings, GridSize } from '../types/game';

const STORAGE_KEY = 'sliding-puzzle-settings';

const defaultSettings: SavedSettings = {
  soundEnabled: true,
  lastGridSize: 4,
  bestMoves: { 3: null, 4: null },
  bestTime: { 3: null, 4: null },
  tutorialSeen: false,
};

export function loadSettings(): SavedSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultSettings };
    const parsed = JSON.parse(raw);
    return { ...defaultSettings, ...parsed };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSettings(settings: Partial<SavedSettings>): void {
  try {
    const current = loadSettings();
    const merged = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // localStorage unavailable — fail silently
  }
}

export function updateBestScore(
  gridSize: GridSize,
  moves: number,
  time: number
): void {
  const settings = loadSettings();
  const bestM = settings.bestMoves[gridSize];
  const bestT = settings.bestTime[gridSize];

  if (bestM === null || moves < bestM) {
    settings.bestMoves[gridSize] = moves;
  }
  if (bestT === null || time < bestT) {
    settings.bestTime[gridSize] = time;
  }
  saveSettings(settings);
}
