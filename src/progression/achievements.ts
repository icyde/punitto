/**
 * Lifetime achievement system
 * Achievements track cumulative progress across all games
 */

export type AchievementType =
  | 'games_played'
  | 'total_merges'
  | 'animals_created'
  | 'chain_reactions'
  | 'total_score'
  | 'highest_tier';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  target: number;
  tier?: number; // For animals_created achievements
  stars: number; // Reward stars (1, 3, or 5)
  difficulty: 1 | 2 | 3; // Tier level
}

/**
 * All achievements (lifetime tracking)
 */
export const ACHIEVEMENTS: Achievement[] = [
  // Tier 1 achievements (1 star each)
  {
    id: 'ach_first_game',
    name: 'First Steps',
    description: 'Play your first game',
    type: 'games_played',
    target: 1,
    stars: 1,
    difficulty: 1
  },
  {
    id: 'ach_baby_floof',
    name: 'Baby Floof',
    description: 'Create your first Big Floof',
    type: 'animals_created',
    target: 1,
    tier: 6,
    stars: 1,
    difficulty: 1
  },
  {
    id: 'ach_dedicated',
    name: 'Dedicated',
    description: 'Play 10 games',
    type: 'games_played',
    target: 10,
    stars: 1,
    difficulty: 1
  },
  {
    id: 'ach_century',
    name: 'Century',
    description: 'Create 100 total merges',
    type: 'total_merges',
    target: 100,
    stars: 1,
    difficulty: 1
  },

  // Tier 2 achievements (3 stars each)
  {
    id: 'ach_hamster_hoarder',
    name: 'Hamster Hoarder',
    description: 'Create 50 Hamsters',
    type: 'animals_created',
    target: 50,
    tier: 0,
    stars: 3,
    difficulty: 2
  },
  {
    id: 'ach_cat_lady',
    name: 'Cat Lady',
    description: 'Create 30 Cats',
    type: 'animals_created',
    target: 30,
    tier: 1,
    stars: 3,
    difficulty: 2
  },
  {
    id: 'ach_shiba_squad',
    name: 'Shiba Squad',
    description: 'Create 20 Shibas',
    type: 'animals_created',
    target: 20,
    tier: 2,
    stars: 3,
    difficulty: 2
  },
  {
    id: 'ach_westie_warrior',
    name: 'Westie Warrior',
    description: 'Create 15 Westies',
    type: 'animals_created',
    target: 15,
    tier: 3,
    stars: 3,
    difficulty: 2
  },
  {
    id: 'ach_perfect_10',
    name: 'Perfect 10',
    description: 'Trigger 10 chain reactions',
    type: 'chain_reactions',
    target: 10,
    stars: 3,
    difficulty: 2
  },
  {
    id: 'ach_marathon',
    name: 'Marathon Runner',
    description: 'Play 50 games',
    type: 'games_played',
    target: 50,
    stars: 3,
    difficulty: 2
  },

  // Tier 3 achievements (5 stars each)
  {
    id: 'ach_floof_master',
    name: 'Floof Master',
    description: 'Create 10 Big Floofs',
    type: 'animals_created',
    target: 10,
    tier: 6,
    stars: 5,
    difficulty: 3
  },
  {
    id: 'ach_chain_legend',
    name: 'Chain Legend',
    description: 'Trigger 50 chain reactions',
    type: 'chain_reactions',
    target: 50,
    stars: 5,
    difficulty: 3
  },
  {
    id: 'ach_elite_player',
    name: 'Elite Player',
    description: 'Play 100 games',
    type: 'games_played',
    target: 100,
    stars: 5,
    difficulty: 3
  },
  {
    id: 'ach_merge_master',
    name: 'Merge Master',
    description: 'Create 1000 total merges',
    type: 'total_merges',
    target: 1000,
    stars: 5,
    difficulty: 3
  },
  {
    id: 'ach_completionist',
    name: 'Completionist',
    description: 'Reach the highest tier (Big Floof)',
    type: 'highest_tier',
    target: 6,
    stars: 5,
    difficulty: 3
  }
];

/**
 * Get achievement by ID
 */
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

/**
 * Get achievements by difficulty
 */
export function getAchievementsByDifficulty(difficulty: 1 | 2 | 3): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.difficulty === difficulty);
}
