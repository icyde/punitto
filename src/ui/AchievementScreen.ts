import { QuestManager } from '../game/QuestManager';

/**
 * Achievement screen UI
 * Shows daily quest and lifetime achievements
 */
export class AchievementScreen {
  private element: HTMLDivElement;
  private questManager: QuestManager;
  private isVisible: boolean = false;
  private onViewThemes: (() => void) | null = null;

  constructor(questManager: QuestManager) {
    this.questManager = questManager;
    this.element = this.createScreen();
    document.body.appendChild(this.element);
  }

  /**
   * Create achievement screen HTML
   */
  private createScreen(): HTMLDivElement {
    const screen = document.createElement('div');
    screen.className = 'achievement-screen';
    screen.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(255, 158, 170, 0.15) 0%, rgba(0, 0, 0, 0.75) 50%, rgba(180, 231, 255, 0.1) 100%);
      z-index: 1500;
      display: none;
      overflow-y: auto;
      padding: 20px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;

    screen.innerHTML = `
      <div class="achievement-container">
        <div class="achievement-header">
          <h1>Achievements</h1>
          <button class="close-btn">✕</button>
        </div>

        <div class="total-stars">
          <div class="star-icon">⭐</div>
          <div class="star-count">0</div>
          <div class="star-label">Total Stars</div>
        </div>

        <div class="daily-quest-section">
          <h2>Daily Quest</h2>
          <div class="daily-quest-card"></div>
        </div>

        <div class="achievements-section">
          <h2>Lifetime Achievements</h2>
          <div class="achievement-list"></div>
        </div>

        <div class="theme-button-container">
          <button class="view-themes-btn">🎨 View Themes</button>
        </div>
      </div>
    `;

    // Set up event listeners
    const closeBtn = screen.querySelector('.close-btn');
    closeBtn?.addEventListener('click', () => this.hide());

    const viewThemesBtn = screen.querySelector('.view-themes-btn');
    viewThemesBtn?.addEventListener('click', () => {
      if (this.onViewThemes) {
        this.onViewThemes();
      }
    });

    // Close on background click
    screen.addEventListener('click', (e) => {
      if (e.target === screen) {
        this.hide();
      }
    });

    return screen;
  }

  /**
   * Show the achievement screen
   */
  show(): void {
    this.render();
    this.element.style.display = 'block';
    this.isVisible = true;
  }

  /**
   * Hide the achievement screen
   */
  hide(): void {
    this.element.style.display = 'none';
    this.isVisible = false;
  }

  /**
   * Render achievement content
   */
  private render(): void {
    this.renderTotalStars();
    this.renderDailyQuest();
    this.renderAchievements();
  }

  /**
   * Render total stars
   */
  private renderTotalStars(): void {
    const starCount = this.element.querySelector('.star-count');
    if (starCount) {
      starCount.textContent = this.questManager.getTotalStars().toString();
    }
  }

  /**
   * Render daily quest
   */
  private renderDailyQuest(): void {
    const questCard = this.element.querySelector('.daily-quest-card');
    if (!questCard) return;

    const currentQuest = this.questManager.getCurrentQuest();

    if (!currentQuest) {
      questCard.innerHTML = '<p>No quest available</p>';
      return;
    }

    const { quest, state } = currentQuest;
    const progress = Math.min(state.progress, quest.target);
    const percentage = (progress / quest.target) * 100;

    questCard.innerHTML = `
      <div class="quest-card ${state.completed ? 'completed' : ''}">
        <div class="quest-header">
          <span class="quest-name">${quest.name}</span>
          <span class="quest-stars">${quest.stars}⭐</span>
        </div>
        <div class="quest-description">${quest.description}</div>
        <div class="quest-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="progress-text">${progress} / ${quest.target}</div>
        </div>
        ${state.completed ? '<div class="completed-badge">✓ Completed</div>' : ''}
      </div>
    `;
  }

  /**
   * Render all achievements
   */
  private renderAchievements(): void {
    const listEl = this.element.querySelector('.achievement-list');
    if (!listEl) return;

    const achievements = this.questManager.getAllAchievements();

    listEl.innerHTML = achievements
      .map(({ achievement, completed }) => {
        const difficultyStars = '⭐'.repeat(achievement.difficulty);
        const cardClass = completed ? 'completed' : 'locked';

        return `
          <div class="achievement-card ${cardClass}">
            <div class="achievement-icon">${completed ? '🏆' : '🔒'}</div>
            <div class="achievement-info">
              <div class="achievement-name">${achievement.name}</div>
              <div class="achievement-description">${achievement.description}</div>
              <div class="achievement-difficulty">${difficultyStars}</div>
            </div>
            <div class="achievement-reward">
              ${completed ? '✓' : `${achievement.stars}⭐`}
            </div>
          </div>
        `;
      })
      .join('');
  }

  /**
   * Set view themes callback
   */
  setOnViewThemes(callback: () => void): void {
    this.onViewThemes = callback;
  }

  /**
   * Check if visible
   */
  visible(): boolean {
    return this.isVisible;
  }
}
