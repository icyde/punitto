import { ANIMAL_TIERS, BIG_FLOOF_DISAPPEAR_SCORE } from '../utils/constants';
import { getHighScore, setHighScore } from '../utils/storage';

/**
 * Manages game scoring and high score tracking
 */
export class ScoreManager {
  private currentScore: number = 0;
  private highScore: number = 0;
  private isNewHighScore: boolean = false;

  constructor() {
    this.loadHighScore();
  }

  /**
   * Load high score from storage
   */
  private loadHighScore(): void {
    this.highScore = getHighScore();
  }

  /**
   * Get current score
   */
  getCurrentScore(): number {
    return this.currentScore;
  }

  /**
   * Get high score
   */
  getHighScore(): number {
    return this.highScore;
  }

  /**
   * Check if current score is a new high score
   */
  isNewHigh(): boolean {
    return this.isNewHighScore;
  }

  /**
   * Add points for a merge
   */
  addMergeScore(tier: number): void {
    const tierData = ANIMAL_TIERS[tier];
    if (!tierData) return;

    const points = tierData.score;
    this.currentScore += points;

    // Check for new high score
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      this.isNewHighScore = true;
      setHighScore(this.highScore);
    }

    console.log(`+${points} points! Total: ${this.currentScore}`);
  }

  /**
   * Add points for Big Floof disappear
   */
  addBigFloofDisappear(): void {
    this.currentScore += BIG_FLOOF_DISAPPEAR_SCORE;

    // Check for new high score
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      this.isNewHighScore = true;
      setHighScore(this.highScore);
    }

    console.log(`+${BIG_FLOOF_DISAPPEAR_SCORE} points (Big Floof!)! Total: ${this.currentScore}`);
  }

  /**
   * Reset score for new game
   */
  reset(): void {
    this.currentScore = 0;
    this.isNewHighScore = false;
    this.loadHighScore(); // Reload high score from storage
  }

  /**
   * Get score for a specific tier merge
   */
  static getScoreForTier(tier: number): number {
    const tierData = ANIMAL_TIERS[tier];
    return tierData?.score ?? 0;
  }
}
