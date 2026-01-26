/**
 * LocalStorage utility functions
 * Handles persistent storage for game data
 */

const STORAGE_KEYS = {
  HIGH_SCORE: 'punitto_high_score',
  STATS: 'punitto_stats',
  SETTINGS: 'punitto_settings',
  TUTORIAL_SHOWN: 'punitto_tutorial_shown',
  DAILY_QUEST: 'punitto_daily_quest',
  ACHIEVEMENTS: 'punitto_achievements',
  ACTIVE_THEME: 'punitto_active_theme',
  UNLOCKED_THEMES: 'punitto_unlocked_themes',
  TOTAL_STARS: 'punitto_total_stars'
};

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Save data to localStorage
 */
export function saveToStorage<T>(key: string, value: T): void {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Load data from localStorage
 */
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (!isLocalStorageAvailable()) {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Remove data from localStorage
 */
export function removeFromStorage(key: string): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

/**
 * Clear all game data
 */
export function clearAllGameData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeFromStorage(key);
  });
}

// High score functions
export function getHighScore(): number {
  return loadFromStorage(STORAGE_KEYS.HIGH_SCORE, 0);
}

export function setHighScore(score: number): void {
  saveToStorage(STORAGE_KEYS.HIGH_SCORE, score);
}

// Settings functions
export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
}

export function getSettings(): GameSettings {
  return loadFromStorage(STORAGE_KEYS.SETTINGS, {
    soundEnabled: true,
    musicEnabled: true
  });
}

export function saveSettings(settings: GameSettings): void {
  saveToStorage(STORAGE_KEYS.SETTINGS, settings);
}

// Tutorial flag
export function hasSeenTutorial(): boolean {
  return loadFromStorage(STORAGE_KEYS.TUTORIAL_SHOWN, false);
}

export function markTutorialSeen(): void {
  saveToStorage(STORAGE_KEYS.TUTORIAL_SHOWN, true);
}

export { STORAGE_KEYS };
