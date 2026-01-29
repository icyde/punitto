// Game configuration constants

export const GAME_CONFIG = {
  // Container dimensions (mobile-first) - narrower for more challenge
  CONTAINER_WIDTH: 300,
  CONTAINER_HEIGHT: 550,
  WALL_THICKNESS: 10,

  // Physics
  GRAVITY: 2.2,
  FPS: 60,

  // Spawn cooldown (prevent spam clicking)
  SPAWN_COOLDOWN: 350, // milliseconds between spawns

  // Danger line
  DANGER_LINE_Y: 120, // Distance from top of container
  DANGER_TIME_THRESHOLD: 3000, // 3 seconds in milliseconds
  DANGER_GRACE_PERIOD: 1000, // Ignore newly spawned animals for 1 second

  // Visual/physics alignment
  ANIMAL_HITBOX_SCALE: 1.0, // Base physics size multiplier
  ANIMAL_SPRITE_SCALE: 1.0, // Global sprite size multiplier
  SPRITE_ALPHA_THRESHOLD: 20, // Alpha cutoff for visible pixels (0-255)
  SPRITE_SCALE_MIN: 0.85, // Clamp per-sprite auto scale
  SPRITE_SCALE_MAX: 1.5,
  SPRITE_RADIUS_PERCENTILE: 0.95, // Use 95th percentile of pixel distances (ignores outliers)

  // Queue
  QUEUE_SIZE: 2, // Show next 2 animals
};

// Animal tier definitions
export interface AnimalTier {
  id: number;
  name: string;
  scale: number; // Size multiplier
  baseRadius: number;
  color: string; // Temporary placeholder colors
  score: number; // Points awarded on merge
}

export const ANIMAL_TIERS: AnimalTier[] = [
  {
    id: 0,
    name: 'Hamster',
    scale: 1.0,
    baseRadius: 20,
    color: '#FFB6C1', // Light pink
    score: 10
  },
  {
    id: 1,
    name: 'Cat',
    scale: 1.3,
    baseRadius: 20,
    color: '#FFA07A', // Light salmon
    score: 20
  },
  {
    id: 2,
    name: 'Shiba',
    scale: 1.6,
    baseRadius: 20,
    color: '#FFD700', // Gold
    score: 50
  },
  {
    id: 3,
    name: 'Westie',
    scale: 2.3,
    baseRadius: 20,
    color: '#98FB98', // Pale green
    score: 100
  },
  {
    id: 4,
    name: 'Husky',
    scale: 2.7,
    baseRadius: 20,
    color: '#87CEEB', // Sky blue
    score: 200
  },
  {
    id: 5,
    name: 'Golden',
    scale: 3.4,
    baseRadius: 20,
    color: '#DAA520', // Golden rod
    score: 500
  },
  {
    id: 6,
    name: 'Big Floof',
    scale: 4.0,
    baseRadius: 20,
    color: '#F0E68C', // Khaki
    score: 1000
  },
  {
    id: 7,
    name: 'Angel',
    scale: 4.6,
    baseRadius: 20,
    color: '#FFFACD', // Lemon chiffon / heavenly gold
    score: 2500
  }
];

// Spawn probability weights (heavily biased toward lower tiers for difficulty)
export const SPAWN_WEIGHTS = {
  0: 50, // Hamster - 50%
  1: 30, // Cat - 30%
  2: 15, // Shiba - 15%
  3: 5,  // Westie - 5%
  4: 0,  // Husky - not spawnable
  5: 0,  // Golden - not spawnable
  6: 0,  // Big Floof - not spawnable
  7: 0   // Angel - not spawnable (max tier)
};

// Score bonus for max tier (Angel) disappearing
export const MAX_TIER_DISAPPEAR_SCORE = 5000;

// Colors
export const COLORS = {
  DANGER_LINE: '#FF6B6B',
  DANGER_LINE_WARNING: '#FF0000',
  CONTAINER_BG: '#FFFFFF',
  WALL: '#E8D4C4' // Soft cream/beige - aligned with pastel theme
};

// Combo System Configuration
export const COMBO_CONFIG = {
  WINDOW_MS: 3000, // Time between merges to maintain combo
  CHAIN_EXTENSION_MS: 1000, // Extra time added per chain reaction
  MULTIPLIERS: [1.0, 1.5, 2.0, 2.5, 3.0], // Index = combo count (0, 1, 2, 3, 4+)
  MAX_COMBO: 4 // Cap at index 4 (3.0x)
};

// Difficulty Escalation Configuration
export interface DifficultyTier {
  minScore: number;
  weights: { 0: number; 1: number; 2: number; 3: number };
}

export const DIFFICULTY_CONFIG: DifficultyTier[] = [
  { minScore: 0, weights: { 0: 50, 1: 30, 2: 15, 3: 5 } },
  { minScore: 1000, weights: { 0: 40, 1: 35, 2: 18, 3: 7 } },
  { minScore: 2500, weights: { 0: 30, 1: 35, 2: 23, 3: 12 } },
  { minScore: 5000, weights: { 0: 20, 1: 35, 2: 28, 3: 17 } },
  { minScore: 10000, weights: { 0: 15, 1: 30, 2: 30, 3: 25 } }
];

// Risk Zone Configuration
export const RISK_ZONE_CONFIG = {
  DEPTH: 40, // Pixels below danger line that count as risk zone
  BONUS_MULTIPLIER: 1.25 // Score multiplier for merges in risk zone
};

// Quick Merge Configuration
export const QUICK_MERGE_CONFIG = {
  WINDOW_MS: 800, // Time after settle to qualify for quick merge
  BONUS_MULTIPLIER: 1.25, // Score multiplier for quick merges
  SETTLE_VELOCITY_THRESHOLD: 0.5, // Max velocity to be considered settled
  SETTLE_DURATION_MS: 200 // How long animal must be below velocity threshold
};
