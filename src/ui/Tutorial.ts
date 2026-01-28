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
      background: linear-gradient(135deg, rgba(255, 158, 170, 0.95) 0%, rgba(255, 212, 163, 0.95) 100%);
      z-index: 3000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.4s ease;
      font-family: 'Fredoka', 'Quicksand', sans-serif;
    `;

    tutorial.innerHTML = `
      <style>
        @keyframes tutorialBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes tutorialSparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.2) rotate(15deg); opacity: 0.8; }
        }
        @keyframes tutorialPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .tutorial-icon-bounce { animation: tutorialBounce 1s ease-in-out infinite; }
        .tutorial-icon-sparkle { animation: tutorialSparkle 1.5s ease-in-out infinite; }
        .tutorial-icon-pulse { animation: tutorialPulse 2s ease-in-out infinite; }
        .tutorial-step-indicator {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
        }
        .step-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 158, 170, 0.3);
        }
        .step-dot.active {
          background: #FF9EAA;
          transform: scale(1.2);
        }
        .shimmer-btn {
          background: linear-gradient(
            90deg,
            #FF9EAA 0%,
            #FFD4A3 25%,
            #FFFFFF 50%,
            #FFD4A3 75%,
            #FF9EAA 100%
          );
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      </style>
      <div class="tutorial-content" style="
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 30px;
        padding: 36px 32px;
        max-width: 90%;
        width: 360px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8);
        transform: scale(0.9);
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      ">
        <h1 style="
          font-family: 'Baloo 2', 'Fredoka', sans-serif;
          font-size: 34px;
          color: #FF9EAA;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 8px rgba(255, 158, 170, 0.2);
        ">Welcome to Punitto!</h1>

        <div class="tutorial-step-indicator">
          <div class="step-dot active"></div>
          <div class="step-dot active"></div>
          <div class="step-dot active"></div>
        </div>

        <div class="tutorial-step" style="margin-bottom: 20px;">
          <div class="tutorial-icon-bounce" style="font-size: 56px; margin-bottom: 8px;">👆</div>
          <h3 style="font-size: 18px; color: #5A4A42; margin: 0 0 6px 0; font-weight: 600;">Tap to Drop!</h3>
          <p style="font-size: 14px; color: #888; margin: 0; line-height: 1.4;">
            Tap anywhere to drop cute animals into the container
          </p>
        </div>

        <div class="tutorial-step" style="margin-bottom: 20px;">
          <div class="tutorial-icon-sparkle" style="font-size: 56px; margin-bottom: 8px;">✨</div>
          <h3 style="font-size: 18px; color: #5A4A42; margin: 0 0 6px 0; font-weight: 600;">Match 2 to Merge!</h3>
          <p style="font-size: 14px; color: #888; margin: 0; line-height: 1.4;">
            When two identical animals touch, they merge into a bigger one
          </p>
        </div>

        <div class="tutorial-step" style="margin-bottom: 28px;">
          <div class="tutorial-icon-pulse" style="font-size: 56px; margin-bottom: 8px;">⚠️</div>
          <h3 style="font-size: 18px; color: #5A4A42; margin: 0 0 6px 0; font-weight: 600;">Watch the Line!</h3>
          <p style="font-size: 14px; color: #888; margin: 0; line-height: 1.4;">
            Don't let animals stay above the danger line for too long!
          </p>
        </div>

        <button class="start-game-btn shimmer-btn" style="
          color: white;
          border: none;
          border-radius: 30px;
          padding: 18px 52px;
          font-size: 20px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(255, 158, 170, 0.4);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        ">
          Let's Play!
        </button>
      </div>
    `;

    // Add button hover/active effects
    const btn = tutorial.querySelector('.start-game-btn') as HTMLElement;
    const content = tutorial.querySelector('.tutorial-content') as HTMLElement;

    if (btn) {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-3px) scale(1.02)';
        btn.style.boxShadow = '0 8px 25px rgba(255, 158, 170, 0.5)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0) scale(1)';
        btn.style.boxShadow = '0 6px 20px rgba(255, 158, 170, 0.4)';
      });
      btn.addEventListener('mousedown', () => {
        btn.style.transform = 'translateY(0) scale(0.96)';
      });
      btn.addEventListener('mouseup', () => {
        btn.style.transform = 'translateY(-3px) scale(1.02)';
      });
      btn.addEventListener('click', () => {
        this.dismiss();
      });
    }

    // Animate content in after overlay fades in
    requestAnimationFrame(() => {
      if (content) {
        content.style.transform = 'scale(1)';
      }
    });

    // Dismiss on tap background
    tutorial.addEventListener('click', (e) => {
      if (e.target === tutorial) {
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
