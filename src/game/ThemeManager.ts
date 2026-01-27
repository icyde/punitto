import { Theme, getDefaultTheme, getThemeById, isThemeUnlocked } from '../progression/themes';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/storage';
import { spriteLoader } from './SpriteLoader';

/**
 * Manages theme loading, switching, and unlocking
 */
export class ThemeManager {
  private activeTheme: Theme;
  private unlockedThemes: Set<string> = new Set();
  private onThemeUnlocked: ((theme: Theme) => void) | null = null;

  constructor() {
    // Load unlocked themes first
    const unlocked = loadFromStorage<string[]>(STORAGE_KEYS.UNLOCKED_THEMES, []);
    this.unlockedThemes = new Set(unlocked);

    // Always ensure default theme is unlocked
    const defaultTheme = getDefaultTheme();
    this.unlockedThemes.add(defaultTheme.id);

    // Now load active theme (needs unlockedThemes to be set)
    this.activeTheme = this.loadActiveTheme();

    // Save state
    this.saveState();
  }

  /**
   * Save theme state to storage
   */
  private saveState(): void {
    saveToStorage(STORAGE_KEYS.UNLOCKED_THEMES, Array.from(this.unlockedThemes));
    saveToStorage(STORAGE_KEYS.ACTIVE_THEME, this.activeTheme.id);
  }

  /**
   * Load active theme from storage
   */
  private loadActiveTheme(): Theme {
    const themeId = loadFromStorage<string>(STORAGE_KEYS.ACTIVE_THEME, getDefaultTheme().id);
    const theme = getThemeById(themeId);

    if (!theme || !this.unlockedThemes.has(themeId)) {
      return getDefaultTheme();
    }

    return theme;
  }

  /**
   * Get active theme
   */
  getActiveTheme(): Theme {
    return this.activeTheme;
  }

  /**
   * Switch to a different theme
   */
  async switchTheme(theme: Theme): Promise<void> {
    if (!this.unlockedThemes.has(theme.id)) {
      console.warn(`Theme ${theme.name} is locked!`);
      return;
    }

    // Load theme sprites
    await spriteLoader.loadTheme(theme);

    this.activeTheme = theme;
    this.saveState();

    console.log(`✨ Switched to theme: ${theme.name}`);
  }

  /**
   * Check for new theme unlocks based on stars
   */
  checkUnlocks(totalStars: number): Theme | null {
    const themes = [
      getThemeById('pastel-paws'),
      getThemeById('ocean-dreams')
    ].filter(t => t !== undefined) as Theme[];

    for (const theme of themes) {
      // Skip if already unlocked
      if (this.unlockedThemes.has(theme.id)) {
        continue;
      }

      // Check if eligible for unlock
      if (isThemeUnlocked(theme, totalStars)) {
        this.unlockTheme(theme);
        return theme;
      }
    }

    return null;
  }

  /**
   * Unlock a theme
   */
  private unlockTheme(theme: Theme): void {
    this.unlockedThemes.add(theme.id);
    this.saveState();

    console.log(`🎉 Unlocked new theme: ${theme.name}`);

    if (this.onThemeUnlocked) {
      this.onThemeUnlocked(theme);
    }
  }

  /**
   * Check if a theme is unlocked
   */
  isThemeUnlocked(themeId: string): boolean {
    return this.unlockedThemes.has(themeId);
  }

  /**
   * Get all unlocked themes
   */
  getUnlockedThemes(): Theme[] {
    const themes: Theme[] = [];
    this.unlockedThemes.forEach(id => {
      const theme = getThemeById(id);
      if (theme) {
        themes.push(theme);
      }
    });
    return themes;
  }

  /**
   * Set theme unlock callback
   */
  setOnThemeUnlocked(callback: (theme: Theme) => void): void {
    this.onThemeUnlocked = callback;
  }

  /**
   * Preload active theme sprites
   */
  async preloadActiveTheme(): Promise<void> {
    await spriteLoader.loadTheme(this.activeTheme);
  }
}
