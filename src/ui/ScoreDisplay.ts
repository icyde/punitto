/**
 * Score display UI component
 */
export class ScoreDisplay {
  private element: HTMLDivElement;
  private currentScoreEl: HTMLSpanElement;
  private highScoreEl: HTMLSpanElement;

  constructor(parentElement: HTMLElement) {
    this.element = this.createScoreDisplay();
    parentElement.appendChild(this.element);

    this.currentScoreEl = this.element.querySelector('.current-score-value')!;
    this.highScoreEl = this.element.querySelector('.high-score-value')!;
  }

  /**
   * Create score display HTML with decorative banner styling
   */
  private createScoreDisplay(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'score-display';
    container.innerHTML = `
      <div class="score-banner">
        <div class="banner-decoration banner-left"></div>
        <div class="banner-content">
          <div class="current-score">
            <div class="score-label">Score</div>
            <div class="current-score-value">0</div>
          </div>
          <div class="score-divider"></div>
          <div class="high-score">
            <div class="score-label">Best</div>
            <div class="high-score-value">0</div>
          </div>
        </div>
        <div class="banner-decoration banner-right"></div>
      </div>
    `;

    return container;
  }

  /**
   * Update current score
   */
  updateScore(score: number): void {
    this.currentScoreEl.textContent = score.toLocaleString();
  }

  /**
   * Update high score
   */
  updateHighScore(highScore: number): void {
    this.highScoreEl.textContent = highScore.toLocaleString();
  }

  /**
   * Update both scores
   */
  update(score: number, highScore: number): void {
    this.updateScore(score);
    this.updateHighScore(highScore);
  }
}
