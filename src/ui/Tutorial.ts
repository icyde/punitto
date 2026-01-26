import { hasSeenTutorial, markTutorialSeen } from '../utils/storage';

/**
 * Tutorial overlay for first-time players
 */
export class Tutorial {
  private element: HTMLDivElement | null = null;

  constructor() {
    if (!hasSeenTutorial()) {
      this.show();
    }
  }

  /**
   * Show tutorial overlay
   */
  show(): void {
    this.element = this.createTutorial();
    document.body.appendChild(this.element);

    // Animate in
    requestAnimationFrame(() => {
      if (this.element) {
        this.element.style.opacity = '1';
      }
    });
  }

  /**
   * Create tutorial HTML
   */
  private createTutorial(): HTMLDivElement {
    const tutorial = document.createElement('div');
    tutorial.className = 'tutorial-overlay';
    tutorial.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 3000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      font-family: 'Fredoka', 'Quicksand', sans-serif;
    `;

    tutorial.innerHTML = `
      <div class="tutorial-content" style="
        background: white;
        border-radius: 25px;
        padding: 32px;
        max-width: 90%;
        width: 350px;
        text-align: center;
      ">
        <h1 style="
          font-size: 32px;
          color: #FF9EAA;
          margin: 0 0 24px 0;
        ">Welcome to Punitto!</h1>

        <div class="tutorial-step" style="margin-bottom: 24px;">
          <div style="font-size: 64px; margin-bottom: 12px;">👆</div>
          <h3 style="font-size: 20px; color: #5A4A42; margin: 0 0 8px 0;">Tap to Drop!</h3>
          <p style="font-size: 14px; color: #666; margin: 0;">
            Tap anywhere to drop cute animals into the container
          </p>
        </div>

        <div class="tutorial-step" style="margin-bottom: 24px;">
          <div style="font-size: 64px; margin-bottom: 12px;">✨</div>
          <h3 style="font-size: 20px; color: #5A4A42; margin: 0 0 8px 0;">Match 2 to Merge!</h3>
          <p style="font-size: 14px; color: #666; margin: 0;">
            When two identical animals touch, they merge into a bigger one
          </p>
        </div>

        <div class="tutorial-step" style="margin-bottom: 32px;">
          <div style="font-size: 64px; margin-bottom: 12px;">⚠️</div>
          <h3 style="font-size: 20px; color: #5A4A42; margin: 0 0 8px 0;">Watch the Line!</h3>
          <p style="font-size: 14px; color: #666; margin: 0;">
            Don't let animals stay above the danger line for too long!
          </p>
        </div>

        <button class="start-game-btn" style="
          background: linear-gradient(135deg, #FF9EAA 0%, #FFD4A3 100%);
          color: white;
          border: none;
          border-radius: 25px;
          padding: 16px 48px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(255, 158, 170, 0.4);
          transition: transform 0.2s ease;
        ">
          Let's Play! 🎮
        </button>
      </div>
    `;

    // Add button hover effect
    const btn = tutorial.querySelector('.start-game-btn') as HTMLElement;
    if (btn) {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
      });
      btn.addEventListener('click', () => {
        this.dismiss();
      });
    }

    // Dismiss on tap anywhere
    tutorial.addEventListener('click', (e) => {
      if (e.target === tutorial || (e.target as HTMLElement).classList.contains('start-game-btn')) {
        this.dismiss();
      }
    });

    return tutorial;
  }

  /**
   * Dismiss tutorial
   */
  dismiss(): void {
    if (!this.element) return;

    this.element.style.opacity = '0';

    setTimeout(() => {
      if (this.element && document.body.contains(this.element)) {
        document.body.removeChild(this.element);
      }
      this.element = null;
    }, 300);

    markTutorialSeen();
  }
}
