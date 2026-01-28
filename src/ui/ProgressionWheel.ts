import { ANIMAL_TIERS } from '../utils/constants';
import { spriteLoader } from '../game/SpriteLoader';
import { ThemeManager } from '../game/ThemeManager';

/**
 * Circular progression wheel showing all 7 animal tiers
 * with the current "next" animal highlighted in the center
 */
export class ProgressionWheel {
  private element: HTMLDivElement;
  private centerEl: HTMLDivElement | null = null;
  private centerImgEl: HTMLImageElement | null = null;
  private tierElements: HTMLDivElement[] = [];
  private themeManager: ThemeManager;
  private lastNextTier: number = -1;

  constructor(parentElement: HTMLElement, themeManager: ThemeManager) {
    this.themeManager = themeManager;
    this.element = this.createWheel();
    parentElement.appendChild(this.element);
  }

  /**
   * Create the progression wheel HTML structure
   */
  private createWheel(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'progression-wheel';

    // Create center "NEXT" display
    this.centerEl = document.createElement('div');
    this.centerEl.className = 'wheel-center';

    const nextLabel = document.createElement('div');
    nextLabel.className = 'wheel-next-label';
    nextLabel.textContent = 'NEXT';

    this.centerImgEl = document.createElement('img');
    this.centerImgEl.className = 'wheel-next-img';
    this.centerImgEl.alt = 'Next animal';

    this.centerEl.appendChild(nextLabel);
    this.centerEl.appendChild(this.centerImgEl);
    container.appendChild(this.centerEl);

    // Create tier indicators around the wheel
    const theme = this.themeManager.getActiveTheme();
    const tierCount = ANIMAL_TIERS.length;

    for (let i = 0; i < tierCount; i++) {
      const tierEl = document.createElement('div');
      tierEl.className = 'wheel-tier';
      tierEl.dataset.tier = String(i);

      // Position in a circle (starting from top, going clockwise)
      // Angle: -90deg puts first item at top, then each item is spaced evenly
      const angle = -90 + (i * 360 / tierCount);
      const radius = 36; // Distance from center in pixels

      tierEl.style.setProperty('--angle', `${angle}deg`);
      tierEl.style.setProperty('--radius', `${radius}px`);

      // Add sprite image
      const img = document.createElement('img');
      img.className = 'wheel-tier-img';
      const themeAnimal = theme.animals[i];
      if (themeAnimal) {
        const sprite = spriteLoader.getSprite(themeAnimal.spritePath);
        img.src = sprite?.src || themeAnimal.spritePath;
      }
      img.alt = ANIMAL_TIERS[i]?.name || '';

      tierEl.appendChild(img);
      container.appendChild(tierEl);
      this.tierElements.push(tierEl);
    }

    return container;
  }

  /**
   * Update the wheel to show the next animal
   */
  updateNextAnimal(nextTier: number): void {
    if (nextTier === this.lastNextTier) return;
    this.lastNextTier = nextTier;

    const theme = this.themeManager.getActiveTheme();
    const themeAnimal = theme.animals[nextTier];

    // Update center image
    if (this.centerImgEl && themeAnimal) {
      const sprite = spriteLoader.getSprite(themeAnimal.spritePath);
      this.centerImgEl.src = sprite?.src || themeAnimal.spritePath;
    }

    // Update tier highlights - highlight the current tier
    this.tierElements.forEach((el, index) => {
      if (index === nextTier) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  /**
   * Refresh sprites when theme changes
   */
  refreshTheme(): void {
    const theme = this.themeManager.getActiveTheme();

    // Update tier sprites
    this.tierElements.forEach((el, index) => {
      const img = el.querySelector('img');
      const themeAnimal = theme.animals[index];
      if (img && themeAnimal) {
        const sprite = spriteLoader.getSprite(themeAnimal.spritePath);
        img.src = sprite?.src || themeAnimal.spritePath;
      }
    });

    // Force update center image
    this.lastNextTier = -1;
  }

  /**
   * Reset the wheel state (call on game reset)
   */
  reset(): void {
    this.lastNextTier = -1;
  }

  /**
   * Get the DOM element
   */
  getElement(): HTMLDivElement {
    return this.element;
  }
}
