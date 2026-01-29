import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/storage';

/**
 * Statistics tracking across all games
 */
export interface GameStats {
  gamesPlayed: number;
  totalMerges: number;
  animalsCreated: Record<number, number>; // Tier -> count
  highestTierReached: number;
  chainReactions: number;
  bigFloofsCreated: number;
  angelsMerged: number;
  totalScore: number;
  lastPlayedDate: string;
  // Difficulty stats
  maxCombo: number;
  riskZoneMerges: number;
  quickMerges: number;
  highestDifficultyReached: number;
}

/**
 * Tracks cumulative game statistics
 */
export class StatsTracker {
  private stats: GameStats;

  constructor() {
    this.stats = this.loadStats();
  }

  /**
   * Load stats from storage
   */
  private loadStats(): GameStats {
    return loadFromStorage<GameStats>(STORAGE_KEYS.STATS, {
      gamesPlayed: 0,
      totalMerges: 0,
      animalsCreated: {},
      highestTierReached: 0,
      chainReactions: 0,
      bigFloofsCreated: 0,
      angelsMerged: 0,
      totalScore: 0,
      lastPlayedDate: new Date().toISOString(),
      maxCombo: 0,
      riskZoneMerges: 0,
      quickMerges: 0,
      highestDifficultyReached: 0
    });
  }

  /**
   * Save stats to storage
   */
  private saveStats(): void {
    saveToStorage(STORAGE_KEYS.STATS, this.stats);
  }

  /**
   * Increment games played
   */
  recordGamePlayed(): void {
    this.stats.gamesPlayed++;
    this.stats.lastPlayedDate = new Date().toISOString();
    this.saveStats();
  }

  /**
   * Record a merge
   */
  recordMerge(tier: number): void {
    this.stats.totalMerges++;

    // Update highest tier reached
    const newTier = tier + 1;
    if (newTier > this.stats.highestTierReached) {
      this.stats.highestTierReached = newTier;
    }

    this.saveStats();
  }

  /**
   * Record an animal created
   */
  recordAnimalCreated(tier: number): void {
    if (!this.stats.animalsCreated[tier]) {
      this.stats.animalsCreated[tier] = 0;
    }
    this.stats.animalsCreated[tier]++;
    this.saveStats();
  }

  /**
   * Record a chain reaction
   */
  recordChainReaction(): void {
    this.stats.chainReactions++;
    this.saveStats();
  }

  /**
   * Record Angel merge (max tier ascension)
   */
  recordAngelMerge(): void {
    this.stats.angelsMerged++;
    this.saveStats();
  }

  /**
   * Record score
   */
  recordScore(score: number): void {
    this.stats.totalScore += score;
    this.saveStats();
  }

  /**
   * Update max combo if current is higher
   */
  updateMaxCombo(combo: number): void {
    if (combo > this.stats.maxCombo) {
      this.stats.maxCombo = combo;
      this.saveStats();
    }
  }

  /**
   * Record a risk zone merge
   */
  recordRiskZoneMerge(): void {
    this.stats.riskZoneMerges++;
    this.saveStats();
  }

  /**
   * Record a quick merge
   */
  recordQuickMerge(): void {
    this.stats.quickMerges++;
    this.saveStats();
  }

  /**
   * Update highest difficulty reached
   */
  updateHighestDifficulty(difficulty: number): void {
    if (difficulty > this.stats.highestDifficultyReached) {
      this.stats.highestDifficultyReached = difficulty;
      this.saveStats();
    }
  }

  /**
   * Get current stats
   */
  getStats(): Readonly<GameStats> {
    return { ...this.stats };
  }

  /**
   * Get animals created count for a specific tier
   */
  getAnimalsCreatedForTier(tier: number): number {
    return this.stats.animalsCreated[tier] || 0;
  }

  /**
   * Get total animals created
   */
  getTotalAnimalsCreated(): number {
    return Object.values(this.stats.animalsCreated).reduce((sum, count) => sum + count, 0);
  }

  /**
   * Reset all stats (for testing or reset functionality)
   */
  resetStats(): void {
    this.stats = {
      gamesPlayed: 0,
      totalMerges: 0,
      animalsCreated: {},
      highestTierReached: 0,
      chainReactions: 0,
      bigFloofsCreated: 0,
      angelsMerged: 0,
      totalScore: 0,
      lastPlayedDate: new Date().toISOString(),
      maxCombo: 0,
      riskZoneMerges: 0,
      quickMerges: 0,
      highestDifficultyReached: 0
    };
    this.saveStats();
  }
}
