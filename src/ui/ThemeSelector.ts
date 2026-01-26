import { Theme, ALL_THEMES, isThemeUnlocked } from '../progression/themes';
import { QuestManager } from '../game/QuestManager';

/**
 * Theme selector UI
 * Shows all themes (locked and unlocked) with preview
 */
export class ThemeSelector {
  private element: HTMLDivElement;
  private questManager: QuestManager;
  private isVisible: boolean = false;
  private activeThemeId: string;
  private onThemeSelect: ((theme: Theme) => void) | null = null;

  constructor(questManager: QuestManager, activeThemeId: string) {
    this.questManager = questManager;
    this.activeThemeId = activeThemeId;
    this.element = this.createScreen();
    document.body.appendChild(this.element);
  }

  /**
   * Create theme selector HTML
   */
  private createScreen(): HTMLDivElement {
    const screen = document.createElement('div');
    screen.className = 'theme-selector-screen';
    screen.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 1600;
      display: none;
      overflow-y: auto;
      padding: 20px;
    `;

    screen.innerHTML = `
      <div class="theme-selector-container">
        <div class="theme-selector-header">
          <h1>Choose Theme</h1>
          <button class="close-btn">✕</button>
        </div>
        <div class="theme-list"></div>
      </div>
    `;

    // Set up close button
    const closeBtn = screen.querySelector('.close-btn');
    closeBtn?.addEventListener('click', () => this.hide());

    // Close on background click
    screen.addEventListener('click', (e) => {
      if (e.target === screen) {
        this.hide();
      }
    });

    return screen;
  }

  /**
   * Show the theme selector
   */
  show(): void {
    this.render();
    this.element.style.display = 'block';
    this.isVisible = true;
  }

  /**
   * Hide the theme selector
   */
  hide(): void {
    this.element.style.display = 'none';
    this.isVisible = false;
  }

  /**
   * Render theme list
   */
  private render(): void {
    const listEl = this.element.querySelector('.theme-list');
    if (!listEl) return;

    const totalStars = this.questManager.getTotalStars();

    listEl.innerHTML = ALL_THEMES.map(theme => {
      const unlocked = isThemeUnlocked(theme, totalStars);
      const isActive = theme.id === this.activeThemeId;

      return `
        <div class="theme-card ${unlocked ? 'unlocked' : 'locked'} ${isActive ? 'active' : ''}"
             data-theme-id="${theme.id}">
          <div class="theme-preview">
            ${this.renderThemePreview(theme, unlocked)}
          </div>
          <div class="theme-info">
            <h3 class="theme-name">${theme.name}</h3>
            <p class="theme-description">${theme.description}</p>

            ${!unlocked ? `
              <div class="theme-locked">
                <span class="lock-icon">🔒</span>
                <span class="unlock-requirement">Unlock: ${theme.unlockRequirement} ⭐</span>
              </div>
            ` : isActive ? `
              <div class="theme-active">✓ Currently Active</div>
            ` : `
              <button class="select-theme-btn" data-theme-id="${theme.id}">
                SELECT
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');

    // Add event listeners to select buttons
    listEl.querySelectorAll('.select-theme-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const themeId = (e.target as HTMLElement).dataset.themeId;
        const theme = ALL_THEMES.find(t => t.id === themeId);
        if (theme && this.onThemeSelect) {
          this.onThemeSelect(theme);
          this.hide();
        }
      });
    });
  }

  /**
   * Render theme preview (animal sprites)
   */
  private renderThemePreview(theme: Theme, unlocked: boolean): string {
    if (!unlocked) {
      return `<div class="preview-locked">🔒</div>`;
    }

    // Show first 3 animals as preview
    const previewAnimals = theme.animals.slice(0, 3);
    return `
      <div class="preview-animals">
        ${previewAnimals.map(animal => `
          <div class="preview-animal" title="${animal.name}">
            ${animal.name.charAt(0)}
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Set theme select callback
   */
  setOnThemeSelect(callback: (theme: Theme) => void): void {
    this.onThemeSelect = callback;
  }

  /**
   * Update active theme
   */
  setActiveTheme(themeId: string): void {
    this.activeThemeId = themeId;
    if (this.isVisible) {
      this.render();
    }
  }

  /**
   * Check if visible
   */
  visible(): boolean {
    return this.isVisible;
  }
}
