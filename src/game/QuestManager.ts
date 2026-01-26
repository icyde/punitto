import { Quest, getRandomDailyQuest, getQuestById } from '../progression/quests';
import { Achievement, ACHIEVEMENTS } from '../progression/achievements';
import { GameStats } from './StatsTracker';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/storage';

/**
 * Quest state tracking
 */
interface QuestState {
  questId: string;
  progress: number;
  completed: boolean;
  date: string; // ISO date when quest was assigned
}

/**
 * Achievement state tracking
 */
interface AchievementState {
  achievementId: string;
  completed: boolean;
  dateCompleted?: string;
}

/**
 * Manages daily quests and lifetime achievements
 */
export class QuestManager {
  private currentQuest: QuestState | null = null;
  private achievementStates: Map<string, AchievementState> = new Map();
  private totalStars: number = 0;
  private onQuestComplete: ((quest: Quest) => void) | null = null;
  private onAchievementComplete: ((achievement: Achievement) => void) | null = null;

  constructor() {
    this.loadState();
    this.checkDailyQuestRotation();
  }

  /**
   * Load quest and achievement state from storage
   */
  private loadState(): void {
    // Load daily quest
    const questState = loadFromStorage<QuestState | null>(STORAGE_KEYS.DAILY_QUEST, null);
    if (questState) {
      this.currentQuest = questState;
    }

    // Load achievement states
    const achievementData = loadFromStorage<AchievementState[]>(STORAGE_KEYS.ACHIEVEMENTS, []);
    achievementData.forEach(state => {
      this.achievementStates.set(state.achievementId, state);
    });

    // Load total stars
    this.totalStars = loadFromStorage<number>(STORAGE_KEYS.TOTAL_STARS, 0);
  }

  /**
   * Save state to storage
   */
  private saveState(): void {
    saveToStorage(STORAGE_KEYS.DAILY_QUEST, this.currentQuest);
    saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, Array.from(this.achievementStates.values()));
    saveToStorage(STORAGE_KEYS.TOTAL_STARS, this.totalStars);
  }

  /**
   * Check if daily quest needs to rotate (new day)
   */
  private checkDailyQuestRotation(): void {
    if (!this.currentQuest) {
      // No quest assigned, create one
      this.assignNewDailyQuest();
      return;
    }

    const questDate = new Date(this.currentQuest.date);
    const today = new Date();

    // Check if it's a new day (midnight passed)
    if (this.isNewDay(questDate, today)) {
      this.assignNewDailyQuest();
    }
  }

  /**
   * Check if two dates are on different days
   */
  private isNewDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() !== date2.getFullYear() ||
      date1.getMonth() !== date2.getMonth() ||
      date1.getDate() !== date2.getDate()
    );
  }

  /**
   * Assign a new daily quest
   */
  private assignNewDailyQuest(): void {
    const quest = getRandomDailyQuest();
    this.currentQuest = {
      questId: quest.id,
      progress: 0,
      completed: false,
      date: new Date().toISOString()
    };
    this.saveState();
    console.log(`📋 New daily quest: ${quest.name}`);
  }

  /**
   * Update quest progress based on game stats
   */
  updateQuestProgress(_stats: GameStats, sessionData: {
    mergesThisGame: number;
    scoreThisGame: number;
    animalsCreatedThisGame: Record<number, number>;
    maxChainThisGame: number;
  }): void {
    if (!this.currentQuest || this.currentQuest.completed) return;

    const quest = getQuestById(this.currentQuest.questId);
    if (!quest) return;

    let progress = 0;

    switch (quest.type) {
      case 'merges':
        progress = sessionData.mergesThisGame;
        break;
      case 'score':
        progress = sessionData.scoreThisGame;
        break;
      case 'specific_animal':
        if (quest.tier !== undefined) {
          progress = sessionData.animalsCreatedThisGame[quest.tier] || 0;
        }
        break;
      case 'chain':
        progress = sessionData.maxChainThisGame;
        break;
    }

    this.currentQuest.progress = Math.max(this.currentQuest.progress, progress);

    // Check if quest completed
    if (this.currentQuest.progress >= quest.target && !this.currentQuest.completed) {
      this.completeQuest(quest);
    }

    this.saveState();
  }

  /**
   * Complete a quest
   */
  private completeQuest(quest: Quest): void {
    if (!this.currentQuest) return;

    this.currentQuest.completed = true;
    this.totalStars += quest.stars;
    this.saveState();

    console.log(`✨ Quest completed: ${quest.name} (+${quest.stars}⭐)`);

    if (this.onQuestComplete) {
      this.onQuestComplete(quest);
    }
  }

  /**
   * Check and update achievement progress
   */
  checkAchievements(stats: GameStats): void {
    ACHIEVEMENTS.forEach(achievement => {
      // Skip if already completed
      const state = this.achievementStates.get(achievement.id);
      if (state?.completed) return;

      // Check if achievement requirement is met
      let isCompleted = false;

      switch (achievement.type) {
        case 'games_played':
          isCompleted = stats.gamesPlayed >= achievement.target;
          break;
        case 'total_merges':
          isCompleted = stats.totalMerges >= achievement.target;
          break;
        case 'animals_created':
          if (achievement.tier !== undefined) {
            const count = stats.animalsCreated[achievement.tier] || 0;
            isCompleted = count >= achievement.target;
          }
          break;
        case 'chain_reactions':
          isCompleted = stats.chainReactions >= achievement.target;
          break;
        case 'big_floofs':
          isCompleted = stats.bigFloofsMerged >= achievement.target;
          break;
        case 'total_score':
          isCompleted = stats.totalScore >= achievement.target;
          break;
        case 'highest_tier':
          isCompleted = stats.highestTierReached >= achievement.target;
          break;
      }

      if (isCompleted) {
        this.completeAchievement(achievement);
      }
    });
  }

  /**
   * Complete an achievement
   */
  private completeAchievement(achievement: Achievement): void {
    this.achievementStates.set(achievement.id, {
      achievementId: achievement.id,
      completed: true,
      dateCompleted: new Date().toISOString()
    });

    this.totalStars += achievement.stars;
    this.saveState();

    console.log(`🏆 Achievement unlocked: ${achievement.name} (+${achievement.stars}⭐)`);

    if (this.onAchievementComplete) {
      this.onAchievementComplete(achievement);
    }
  }

  /**
   * Get current daily quest
   */
  getCurrentQuest(): { quest: Quest; state: QuestState } | null {
    if (!this.currentQuest) return null;

    const quest = getQuestById(this.currentQuest.questId);
    if (!quest) return null;

    return { quest, state: this.currentQuest };
  }

  /**
   * Get all achievements with their states
   */
  getAllAchievements(): Array<{ achievement: Achievement; completed: boolean }> {
    return ACHIEVEMENTS.map(achievement => ({
      achievement,
      completed: this.achievementStates.get(achievement.id)?.completed || false
    }));
  }

  /**
   * Get total stars earned
   */
  getTotalStars(): number {
    return this.totalStars;
  }

  /**
   * Set quest completion callback
   */
  setOnQuestComplete(callback: (quest: Quest) => void): void {
    this.onQuestComplete = callback;
  }

  /**
   * Set achievement completion callback
   */
  setOnAchievementComplete(callback: (achievement: Achievement) => void): void {
    this.onAchievementComplete = callback;
  }
}
