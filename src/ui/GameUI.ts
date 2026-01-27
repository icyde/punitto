import { ScoreDisplay } from './ScoreDisplay';
import { Modal } from './Modal';
import { Game } from '../game/Game';
import { GAME_CONFIG, COLORS } from '../utils/constants';
import { spriteLoader } from '../game/SpriteLoader';

/**
 * Main game UI overlay manager
 */
export class GameUI {
  private game: Game;
  private container: HTMLDivElement;
  private scoreDisplay: ScoreDisplay;
  private modal: Modal;
  private dangerLineEl: HTMLDivElement | null = null;
  private previewEl: HTMLDivElement | null = null;
  private previewImgEl: HTMLImageElement | null = null;
  private lastPreviewTier: number = -1;

  constructor(game: Game, _canvas: HTMLCanvasElement) {
    this.game = game;
    this.container = this.createContainer();
    this.scoreDisplay = new ScoreDisplay(this.container);
    this.modal = new Modal();

    this.setupGameOverCallback();
    this.createDangerLine();
    this.createPreview();
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
      width: 100%;
      height: 100%;
      pointer-events: none;
    `;

    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.appendChild(container);
    }

    return container;
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
      top: ${GAME_CONFIG.DANGER_LINE_Y}px;
      width: ${GAME_CONFIG.CONTAINER_WIDTH}px;
      height: 2px;
      background: ${COLORS.DANGER_LINE};
      opacity: 0.5;
      pointer-events: none;
      border-top: 2px dashed ${COLORS.DANGER_LINE};
      transition: all 0.3s ease;
    `;

    this.container.appendChild(this.dangerLineEl);
  }

  /**
   * Create next animal preview
   */
  private createPreview(): void {
    this.previewEl = document.createElement('div');
    this.previewEl.className = 'next-preview';
    this.previewEl.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      width: 70px;
      height: 90px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 12px;
      border: 2px solid #FFB6C1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      pointer-events: none;
    `;

    const label = document.createElement('div');
    label.textContent = 'NEXT';
    label.style.cssText = `
      font-size: 10px;
      font-weight: bold;
      color: #5A4A42;
      margin-bottom: 4px;
      letter-spacing: 1px;
    `;

    this.previewImgEl = document.createElement('img');
    this.previewImgEl.style.cssText = `
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
    `;

    this.previewEl.appendChild(label);
    this.previewEl.appendChild(this.previewImgEl);
    this.container.appendChild(this.previewEl);
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
      });
    });
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
      } else {
        this.dangerLineEl.style.background = COLORS.DANGER_LINE;
        this.dangerLineEl.style.opacity = '0.5';
        this.dangerLineEl.style.height = '2px';
      }
    }

    // Update next animal preview
    this.updatePreview();
  }

  /**
   * Update the next animal preview
   */
  private updatePreview(): void {
    if (!this.previewImgEl) return;

    const nextTier = this.game.getNextAnimalTier();

    // Only update if tier changed
    if (nextTier === this.lastPreviewTier) return;
    this.lastPreviewTier = nextTier;

    const theme = this.game.getThemeManager().getActiveTheme();
    const themeAnimal = theme.animals[nextTier];
    if (!themeAnimal) return;

    const sprite = spriteLoader.getSprite(themeAnimal.spritePath);
    if (sprite && sprite.complete) {
      this.previewImgEl.src = sprite.src;
    } else {
      // Sprite not loaded yet, use path directly
      this.previewImgEl.src = themeAnimal.spritePath;
    }
  }
}
