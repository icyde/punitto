/**
 * Score display UI component
 */
export class ScoreDisplay {
  private element: HTMLDivElement;
  private currentScoreEl: HTMLSpanElement;
  private highScoreEl: HTMLSpanElement;
  private lastScore: number = 0;
  private lastHighScore: number = 0;
  private bounceTimeout: number | null = null;

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
   * Update current score with bounce animation on increase
   */
  updateScore(score: number): void {
    this.currentScoreEl.textContent = score.toLocaleString();

    // Trigger bounce animation if score increased
    if (score > this.lastScore) {
      this.triggerBounce();
    }
    this.lastScore = score;
  }

  /**
   * Trigger bounce animation on score element
   */
  private triggerBounce(): void {
    // Clear any existing timeout
    if (this.bounceTimeout !== null) {
      clearTimeout(this.bounceTimeout);
      this.currentScoreEl.classList.remove('score-bounce');
    }

    // Force reflow to restart animation
    void this.currentScoreEl.offsetWidth;

    this.currentScoreEl.classList.add('score-bounce');

    this.bounceTimeout = window.setTimeout(() => {
      this.currentScoreEl.classList.remove('score-bounce');
      this.bounceTimeout = null;
    }, 400);
  }

  /**
   * Update high score with celebration effect on new high
   */
  updateHighScore(highScore: number): void {
    this.highScoreEl.textContent = highScore.toLocaleString();

    // Add celebration effect if high score increased
    if (highScore > this.lastHighScore && this.lastHighScore > 0) {
      this.highScoreEl.classList.add('new-high');
    }
    this.lastHighScore = highScore;
  }

  /**
   * Reset high score celebration state
   */
  resetHighScoreCelebration(): void {
    this.highScoreEl.classList.remove('new-high');
  }

  /**
   * Update both scores
   */
  update(score: number, highScore: number): void {
    this.updateScore(score);
    this.updateHighScore(highScore);
  }
}
