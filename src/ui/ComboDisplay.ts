import { COMBO_CONFIG } from '../utils/constants';

/**
 * Displays the current combo count and multiplier
 * Animated display with color intensity based on combo level
 */
export class ComboDisplay {
  private container: HTMLDivElement;
  private element: HTMLDivElement;
  private countEl: HTMLSpanElement;
  private multiplierEl: HTMLSpanElement;
  private timerEl: HTMLDivElement;
  private currentCombo: number = 0;
  private isVisible: boolean = false;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.element = this.createDisplay();
    this.countEl = this.element.querySelector('.combo-count')!;
    this.multiplierEl = this.element.querySelector('.combo-multiplier')!;
    this.timerEl = this.element.querySelector('.combo-timer-fill')!;
  }

  /**
   * Create the combo display element
   */
  private createDisplay(): HTMLDivElement {
    const display = document.createElement('div');
    display.className = 'combo-display';
    display.innerHTML = `
      <div class="combo-inner">
        <span class="combo-count">0</span>
        <span class="combo-label">COMBO</span>
        <span class="combo-multiplier">1.0x</span>
      </div>
      <div class="combo-timer">
        <div class="combo-timer-fill"></div>
      </div>
    `;
    display.style.opacity = '0';
    display.style.transform = 'scale(0.8)';
    this.container.appendChild(display);
    return display;
  }

  /**
   * Update the combo display
   */
  update(combo: number, multiplier: number, timeRemaining: number): void {
    if (combo === 0) {
      this.hide();
      return;
    }

    // Show if not visible
    if (!this.isVisible) {
      this.show();
    }

    // Update values
    this.countEl.textContent = combo.toString();
    this.multiplierEl.textContent = `${multiplier.toFixed(1)}x`;

    // Update timer bar
    const progress = Math.min(timeRemaining / COMBO_CONFIG.WINDOW_MS, 1);
    this.timerEl.style.width = `${progress * 100}%`;

    // Update color intensity based on combo level
    this.updateComboStyle(combo, multiplier);

    // Trigger bounce animation if combo increased
    if (combo > this.currentCombo) {
      this.triggerBounce();
    }

    this.currentCombo = combo;
  }

  /**
   * Update styling based on combo level
   */
  private updateComboStyle(combo: number, _multiplier: number): void {
    // Remove all level classes
    this.element.classList.remove('combo-level-1', 'combo-level-2', 'combo-level-3', 'combo-level-4', 'combo-level-5');

    // Add appropriate level class (caps at 5)
    const level = Math.min(combo, 5);
    if (level > 0) {
      this.element.classList.add(`combo-level-${level}`);
    }
  }

  /**
   * Trigger bounce animation
   */
  private triggerBounce(): void {
    this.element.classList.remove('combo-bounce');
    // Force reflow
    void this.element.offsetWidth;
    this.element.classList.add('combo-bounce');
  }

  /**
   * Show the combo display
   */
  show(): void {
    if (this.isVisible) return;
    this.isVisible = true;
    this.element.style.opacity = '1';
    this.element.style.transform = 'scale(1)';
    this.element.classList.add('combo-enter');
  }

  /**
   * Hide the combo display
   */
  hide(): void {
    if (!this.isVisible) return;
    this.isVisible = false;
    this.currentCombo = 0;
    this.element.style.opacity = '0';
    this.element.style.transform = 'scale(0.8)';
    this.element.classList.remove('combo-enter');
  }

  /**
   * Reset the display
   */
  reset(): void {
    this.hide();
    this.currentCombo = 0;
  }
}
