/**
 * Toast notification for quest/achievement completion
 * Non-intrusive popup that auto-dismisses
 */
export class QuestToast {
  private container: HTMLDivElement;
  private activeToasts: HTMLDivElement[] = [];

  constructor() {
    this.container = this.createContainer();
    document.body.appendChild(this.container);
  }

  /**
   * Create toast container
   */
  private createContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
      width: 90%;
      max-width: 350px;
    `;

    return container;
  }

  /**
   * Show a toast notification
   */
  show(message: string, stars: number, type: 'quest' | 'achievement' = 'quest'): void {
    const toast = this.createToast(message, stars, type);
    this.container.appendChild(toast);
    this.activeToasts.push(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      this.dismissToast(toast);
    }, 3000);
  }

  /**
   * Create a toast element
   */
  private createToast(message: string, stars: number, type: 'quest' | 'achievement'): HTMLDivElement {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'quest' ? '📋' : '🏆';
    const typeLabel = type === 'quest' ? 'Quest Complete!' : 'Achievement Unlocked!';

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${typeLabel}</div>
        <div class="toast-message">${message}</div>
        <div class="toast-reward">+${stars}⭐</div>
      </div>
    `;

    toast.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      background: white;
      border-radius: 15px;
      padding: 12px 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      opacity: 0;
      transform: translateY(-20px);
      transition: all 0.3s ease-out;
      pointer-events: all;
      font-family: 'Fredoka', 'Quicksand', sans-serif;
    `;

    return toast;
  }

  /**
   * Dismiss a toast
   */
  private dismissToast(toast: HTMLDivElement): void {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';

    setTimeout(() => {
      if (this.container.contains(toast)) {
        this.container.removeChild(toast);
      }
      const index = this.activeToasts.indexOf(toast);
      if (index > -1) {
        this.activeToasts.splice(index, 1);
      }
    }, 300);
  }

  /**
   * Show quest completion toast
   */
  showQuestComplete(questName: string, stars: number): void {
    this.show(questName, stars, 'quest');
  }

  /**
   * Show achievement unlock toast
   */
  showAchievementUnlocked(achievementName: string, stars: number): void {
    this.show(achievementName, stars, 'achievement');
  }
}
