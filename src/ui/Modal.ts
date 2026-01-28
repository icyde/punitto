/**
 * Modal component for game over, settings, etc.
 */
export class Modal {
  private element: HTMLDivElement;
  private isVisible: boolean = false;

  constructor() {
    this.element = this.createModal();
    document.body.appendChild(this.element);
  }

  /**
   * Create modal HTML structure
   */
  private createModal(): HTMLDivElement {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title"></h2>
        </div>
        <div class="modal-body"></div>
        <div class="modal-footer"></div>
      </div>
    `;

    // Hide by default
    modal.style.display = 'none';

    return modal;
  }

  /**
   * Show the modal with content
   */
  show(title: string, body: string, buttons: { text: string; onClick: () => void; primary?: boolean }[]): void {
    const titleEl = this.element.querySelector('.modal-title');
    const bodyEl = this.element.querySelector('.modal-body');
    const footerEl = this.element.querySelector('.modal-footer');

    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.innerHTML = body;
    if (footerEl) {
      footerEl.innerHTML = '';
      buttons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn.text;
        button.className = btn.primary ? 'btn-primary' : 'btn-secondary';
        button.onclick = () => {
          btn.onClick();
          this.hide();
        };
        footerEl.appendChild(button);
      });
    }

    this.element.style.display = 'flex';
    this.isVisible = true;
  }

  /**
   * Hide the modal
   */
  hide(): void {
    this.element.style.display = 'none';
    this.isVisible = false;
  }

  /**
   * Check if modal is visible
   */
  visible(): boolean {
    return this.isVisible;
  }

  /**
   * Show game over modal
   */
  showGameOver(score: number, highScore: number, isNewHigh: boolean, onRestart: () => void): void {
    const confettiHtml = isNewHigh ? this.createConfettiHtml() : '';

    const body = `
      ${confettiHtml}
      <div class="game-over-content">
        ${isNewHigh ? '<div class="new-high-score">🎉 NEW HIGH SCORE! 🎉</div>' : ''}
        <div class="final-score">
          <div class="score-label">Final Score</div>
          <div class="score-value">${score.toLocaleString()}</div>
        </div>
        <div class="high-score">
          <div class="score-label">High Score</div>
          <div class="score-value">${highScore.toLocaleString()}</div>
        </div>
      </div>
    `;

    this.show('Game Over', body, [
      { text: 'Play Again', onClick: onRestart, primary: true }
    ]);
  }

  /**
   * Create confetti HTML for celebration
   */
  private createConfettiHtml(): string {
    const colors = ['#FF9EAA', '#FFD4A3', '#B4E7FF', '#FFD700', '#98D8AA'];
    const shapes = ['circle', 'square', 'triangle'];
    let confettiHtml = '<div class="confetti-container">';

    for (let i = 0; i < 30; i++) {
      const color = colors[i % colors.length];
      const shape = shapes[i % shapes.length];
      const left = Math.random() * 100;
      const delay = Math.random() * 0.5;
      const duration = 2 + Math.random() * 2;
      const size = 6 + Math.random() * 8;

      let shapeStyle = '';
      if (shape === 'circle') {
        shapeStyle = 'border-radius: 50%;';
      } else if (shape === 'triangle') {
        shapeStyle = `
          width: 0;
          height: 0;
          border-left: ${size / 2}px solid transparent;
          border-right: ${size / 2}px solid transparent;
          border-bottom: ${size}px solid ${color};
          background: transparent;
        `;
      }

      confettiHtml += `
        <div class="confetti" style="
          left: ${left}%;
          width: ${size}px;
          height: ${size}px;
          background: ${shape !== 'triangle' ? color : 'transparent'};
          ${shapeStyle}
          animation-delay: ${delay}s;
          animation-duration: ${duration}s;
        "></div>
      `;
    }

    confettiHtml += '</div>';
    return confettiHtml;
  }
}
