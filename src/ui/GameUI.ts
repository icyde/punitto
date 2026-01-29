import { ScoreDisplay } from './ScoreDisplay';
import { ProgressionWheel } from './ProgressionWheel';
import { Modal } from './Modal';
import { AchievementScreen } from './AchievementScreen';
import { ThemeSelector } from './ThemeSelector';
import { Game } from '../game/Game';
import { GAME_CONFIG, COLORS } from '../utils/constants';

/**
 * Main game UI overlay manager
 */
export class GameUI {
  private game: Game;
  private container: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private appElement: HTMLDivElement | null = null;
  private scaleX: number = 1;
  private scaleY: number = 1;
  private scoreDisplay: ScoreDisplay;
  private progressionWheel: ProgressionWheel;
  private modal: Modal;
  private achievementScreen: AchievementScreen;
  private themeSelector: ThemeSelector;
  private dangerLineEl: HTMLDivElement | null = null;

  constructor(game: Game, canvas: HTMLCanvasElement) {
    this.game = game;
    this.canvas = canvas;
    this.container = this.createContainer();
    this.scoreDisplay = new ScoreDisplay(this.container);
    this.progressionWheel = new ProgressionWheel(
      this.container,
      this.game.getThemeManager()
    );
    this.modal = new Modal();

    // Initialize achievement and theme screens
    const questManager = this.game.getQuestManager();
    const themeManager = this.game.getThemeManager();
    this.achievementScreen = new AchievementScreen(questManager);
    this.themeSelector = new ThemeSelector(questManager, themeManager.getActiveTheme().id);

    // Wire up theme selector callback
    this.themeSelector.setOnThemeSelect((theme) => {
      themeManager.switchTheme(theme);
      this.progressionWheel.refreshTheme();
      this.themeSelector.setActiveTheme(theme.id);
    });

    // Wire up view themes from achievement screen
    this.achievementScreen.setOnViewThemes(() => {
      this.achievementScreen.hide();
      this.themeSelector.show();
    });

    this.setupGameOverCallback();
    this.setupMergeCallback();
    this.createDangerLine();
    this.createAchievementButton();
    this.syncOverlayToCanvas();
    this.setupResizeListener();
    this.startUpdateLoop();
  }

  /**
   * Create UI container
   */
  private createContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'game-ui';
    container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    `;

    this.appElement = document.getElementById('app') as HTMLDivElement | null;
    if (this.appElement) {
      this.appElement.appendChild(container);
    }

    return container;
  }

  /**
   * Keep UI overlay aligned to the canvas size/position
   */
  private syncOverlayToCanvas(): void {
    if (!this.appElement) return;

    const canvasRect = this.canvas.getBoundingClientRect();
    const appRect = this.appElement.getBoundingClientRect();

    const left = canvasRect.left - appRect.left;
    const top = canvasRect.top - appRect.top;

    this.container.style.left = `${left}px`;
    this.container.style.top = `${top}px`;
    this.container.style.width = `${canvasRect.width}px`;
    this.container.style.height = `${canvasRect.height}px`;

    this.scaleX = canvasRect.width / GAME_CONFIG.CONTAINER_WIDTH;
    this.scaleY = canvasRect.height / GAME_CONFIG.CONTAINER_HEIGHT;

    this.updateDangerLinePosition();
  }

  /**
   * Handle window resize to keep overlay aligned
   */
  private setupResizeListener(): void {
    window.addEventListener('resize', () => {
      this.syncOverlayToCanvas();
    });
  }

  /**
   * Position the danger line with canvas scaling applied
   */
  private updateDangerLinePosition(): void {
    if (!this.dangerLineEl) return;

    const scaledTop = GAME_CONFIG.DANGER_LINE_Y * this.scaleY;
    const scaledWidth = GAME_CONFIG.CONTAINER_WIDTH * this.scaleX;

    this.dangerLineEl.style.top = `${scaledTop}px`;
    this.dangerLineEl.style.width = `${scaledWidth}px`;
    this.dangerLineEl.style.left = '0px';
  }

  /**
   * Create achievement button near score banner
   */
  private createAchievementButton(): void {
    const button = document.createElement('button');
    button.className = 'achievement-btn';
    button.innerHTML = `
      <span class="achievement-btn-icon">⭐</span>
      <span class="achievement-btn-shine"></span>
    `;
    button.title = 'Achievements & Quests';

    button.addEventListener('click', () => {
      this.achievementScreen.show();
    });

    this.container.appendChild(button);
  }

  /**
   * Create danger line visual indicator
   */
  private createDangerLine(): void {
    this.dangerLineEl = document.createElement('div');
    this.dangerLineEl.className = 'danger-line';
    this.dangerLineEl.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      width: 0;
      height: 2px;
      background: ${COLORS.DANGER_LINE};
      opacity: 0.5;
      pointer-events: none;
      border-top: 2px dashed ${COLORS.DANGER_LINE};
      transition: all 0.3s ease;
    `;

    this.container.appendChild(this.dangerLineEl);
    this.updateDangerLinePosition();
  }

  /**
   * Set up game over callback
   */
  private setupGameOverCallback(): void {
    this.game.setGameOverCallback(() => {
      const scoreManager = this.game.getScoreManager();
      const score = scoreManager.getCurrentScore();
      const highScore = scoreManager.getHighScore();
      const isNewHigh = scoreManager.isNewHigh();

      this.modal.showGameOver(score, highScore, isNewHigh, () => {
        this.game.reset();
        this.progressionWheel.reset();
      });
    });
  }

  /**
   * Set up merge callback for score popups
   */
  private setupMergeCallback(): void {
    this.game.setOnMergeCallback((x, y, score) => {
      this.showScorePopup(x, y, score);
    });
  }

  /**
   * Show floating score popup
   */
  private showScorePopup(x: number, y: number, score: number): void {
    const scaledX = x * this.scaleX;
    const scaledY = y * this.scaleY;

    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = `+${score}`;
    popup.style.cssText = `
      position: absolute;
      left: ${scaledX}px;
      top: ${scaledY}px;
      font-size: 20px;
      font-weight: 700;
      color: #FF9EAA;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
      pointer-events: none;
      transform: translate(-50%, -50%);
      animation: scorePopup 0.8s ease-out forwards;
      z-index: 100;
    `;

    this.container.appendChild(popup);

    // Remove after animation
    setTimeout(() => {
      popup.remove();
    }, 800);
  }

  /**
   * Start UI update loop
   */
  private startUpdateLoop(): void {
    setInterval(() => {
      this.update();
    }, 100); // Update UI every 100ms
  }

  /**
   * Update UI elements
   */
  private update(): void {
    const scoreManager = this.game.getScoreManager();
    this.scoreDisplay.update(
      scoreManager.getCurrentScore(),
      scoreManager.getHighScore()
    );

    // Update danger line appearance based on danger state
    if (this.dangerLineEl) {
      const isInDanger = this.game.isInDangerState();
      const progress = this.game.getDangerProgress();

      if (isInDanger) {
        this.dangerLineEl.style.background = COLORS.DANGER_LINE_WARNING;
        this.dangerLineEl.style.opacity = `${0.5 + progress * 0.5}`;
        this.dangerLineEl.style.height = `${2 + progress * 4}px`;
        this.dangerLineEl.classList.add('active');

        // Spawn danger particles occasionally
        if (Math.random() < 0.1 * progress) {
          this.spawnDangerParticle();
        }
      } else {
        this.dangerLineEl.style.background = COLORS.DANGER_LINE;
        this.dangerLineEl.style.opacity = '0.5';
        this.dangerLineEl.style.height = '2px';
        this.dangerLineEl.classList.remove('active');
      }
    }

    // Update progression wheel with next animal
    const nextTier = this.game.getNextAnimalTier();
    this.progressionWheel.updateNextAnimal(nextTier);

    // Update drop guide
    this.updateDropGuide();
  }

  /**
   * Update drop guide position
   */
  private updateDropGuide(): void {
    this.game.updateDropGuide();
  }

  /**
   * Spawn a danger particle effect
   */
  private spawnDangerParticle(): void {
    if (!this.dangerLineEl) return;

    const particle = document.createElement('div');
    particle.className = 'danger-particle';

    const lineWidth = parseFloat(this.dangerLineEl.style.width) || GAME_CONFIG.CONTAINER_WIDTH * this.scaleX;
    const randomX = Math.random() * lineWidth;

    particle.style.left = `${randomX}px`;
    particle.style.top = '0';

    this.dangerLineEl.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode === this.dangerLineEl) {
        particle.remove();
      }
    }, 1000);
  }
}
