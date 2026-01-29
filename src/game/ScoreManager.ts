import { ANIMAL_TIERS, MAX_TIER_DISAPPEAR_SCORE } from '../utils/constants';
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
   * @returns The points awarded
   */
  addMergeScore(tier: number): number {
    const tierData = ANIMAL_TIERS[tier];
    if (!tierData) return 0;

    const points = tierData.score;
    this.currentScore += points;

    // Check for new high score
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      this.isNewHighScore = true;
      setHighScore(this.highScore);
    }

    console.log(`+${points} points! Total: ${this.currentScore}`);
    return points;
  }

  /**
   * Add points for a merge with multipliers
   * @returns Object with base points, final points, and multiplier breakdown
   */
  addMergeScoreWithMultiplier(
    tier: number,
    comboMultiplier: number,
    riskBonus: number,
    quickBonus: number
  ): { base: number; final: number; combo: number; risk: number; quick: number } {
    const tierData = ANIMAL_TIERS[tier];
    if (!tierData) return { base: 0, final: 0, combo: 1, risk: 1, quick: 1 };

    const basePoints = tierData.score;
    const finalPoints = Math.round(basePoints * comboMultiplier * riskBonus * quickBonus);

    this.currentScore += finalPoints;

    // Check for new high score
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      this.isNewHighScore = true;
      setHighScore(this.highScore);
    }

    const multiplierStr = comboMultiplier > 1 || riskBonus > 1 || quickBonus > 1
      ? ` (${comboMultiplier.toFixed(1)}x × ${riskBonus.toFixed(2)}x × ${quickBonus.toFixed(2)}x)`
      : '';
    console.log(`+${finalPoints} points${multiplierStr}! Total: ${this.currentScore}`);

    return {
      base: basePoints,
      final: finalPoints,
      combo: comboMultiplier,
      risk: riskBonus,
      quick: quickBonus
    };
  }

  /**
   * Add points for max tier (Angel) disappear
   * @returns The bonus points awarded
   */
  addMaxTierDisappear(): number {
    this.currentScore += MAX_TIER_DISAPPEAR_SCORE;

    // Check for new high score
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      this.isNewHighScore = true;
      setHighScore(this.highScore);
    }

    console.log(`+${MAX_TIER_DISAPPEAR_SCORE} points (Angel Ascension!)! Total: ${this.currentScore}`);
    return MAX_TIER_DISAPPEAR_SCORE;
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
