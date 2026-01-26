/**
 * Daily quest system
 * Defines available quests and their requirements
 */

export type QuestType = 'merges' | 'animals_created' | 'score' | 'chain' | 'specific_animal' | 'big_floof';

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: QuestType;
  target: number;
  tier?: number; // For specific_animal quests
  stars: number; // Reward stars
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * Daily quest pool
 */
export const DAILY_QUESTS: Quest[] = [
  // Easy quests (3 stars)
  {
    id: 'quest_merges_15',
    name: 'Merge Master',
    description: 'Create 15 merges in a single game',
    type: 'merges',
    target: 15,
    stars: 3,
    difficulty: 'easy'
  },
  {
    id: 'quest_cats_5',
    name: 'Cat Collector',
    description: 'Create 5 Cats',
    type: 'specific_animal',
    target: 5,
    tier: 1,
    stars: 3,
    difficulty: 'easy'
  },
  {
    id: 'quest_score_2000',
    name: 'Score Chaser',
    description: 'Reach a score of 2000',
    type: 'score',
    target: 2000,
    stars: 3,
    difficulty: 'easy'
  },
  {
    id: 'quest_hamsters_10',
    name: 'Hamster Haven',
    description: 'Create 10 Hamsters',
    type: 'specific_animal',
    target: 10,
    tier: 0,
    stars: 3,
    difficulty: 'easy'
  },

  // Medium quests (4 stars)
  {
    id: 'quest_westies_3',
    name: 'Westie Whisperer',
    description: 'Create 3 Westies',
    type: 'specific_animal',
    target: 3,
    tier: 3,
    stars: 4,
    difficulty: 'medium'
  },
  {
    id: 'quest_chain_3',
    name: 'Chain Reaction',
    description: 'Trigger a 3-chain reaction',
    type: 'chain',
    target: 3,
    stars: 4,
    difficulty: 'medium'
  },
  {
    id: 'quest_score_5000',
    name: 'High Scorer',
    description: 'Reach a score of 5000',
    type: 'score',
    target: 5000,
    stars: 4,
    difficulty: 'medium'
  },
  {
    id: 'quest_shibas_5',
    name: 'Shiba Squad',
    description: 'Create 5 Shibas',
    type: 'specific_animal',
    target: 5,
    tier: 2,
    stars: 4,
    difficulty: 'medium'
  },

  // Hard quests (5 stars)
  {
    id: 'quest_chain_5',
    name: 'Chain Legend',
    description: 'Trigger a 5+ chain reaction',
    type: 'chain',
    target: 5,
    stars: 5,
    difficulty: 'hard'
  },
  {
    id: 'quest_big_floof_2',
    name: 'Ultimate Floof',
    description: 'Create 2 Big Floofs',
    type: 'specific_animal',
    target: 2,
    tier: 6,
    stars: 5,
    difficulty: 'hard'
  },
  {
    id: 'quest_score_10000',
    name: 'Score Legend',
    description: 'Reach a score of 10,000',
    type: 'score',
    target: 10000,
    stars: 5,
    difficulty: 'hard'
  },
  {
    id: 'quest_huskies_3',
    name: 'Husky Hero',
    description: 'Create 3 Huskies',
    type: 'specific_animal',
    target: 3,
    tier: 4,
    stars: 5,
    difficulty: 'hard'
  }
];

/**
 * Get a random daily quest
 */
export function getRandomDailyQuest(): Quest {
  const randomIndex = Math.floor(Math.random() * DAILY_QUESTS.length);
  return DAILY_QUESTS[randomIndex]!;
}

/**
 * Get quest by ID
 */
export function getQuestById(id: string): Quest | undefined {
  return DAILY_QUESTS.find(q => q.id === id);
}
