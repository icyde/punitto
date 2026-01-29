import { Animal } from '../entities/Animal';
import { GAME_CONFIG, SPAWN_WEIGHTS, DIFFICULTY_CONFIG } from '../utils/constants';
import { PhysicsEngine } from './PhysicsEngine';

/**
 * Manages animal spawning, tracking, and queue system
 */
export class AnimalManager {
  private animals: Map<string, Animal> = new Map();
  private queue: number[] = [];
  private physicsEngine: PhysicsEngine;
  private currentScore: number = 0;
  private currentDifficultyIndex: number = 0;

  constructor(physicsEngine: PhysicsEngine) {
    this.physicsEngine = physicsEngine;
    this.initializeQueue();
  }

  /**
   * Set current score for difficulty scaling
   */
  setCurrentScore(score: number): void {
    this.currentScore = score;
    this.updateDifficultyTier();
  }

  /**
   * Update difficulty tier based on current score
   */
  private updateDifficultyTier(): void {
    for (let i = DIFFICULTY_CONFIG.length - 1; i >= 0; i--) {
      const tier = DIFFICULTY_CONFIG[i];
      if (tier && this.currentScore >= tier.minScore) {
        if (this.currentDifficultyIndex !== i) {
          this.currentDifficultyIndex = i;
          console.log(`📈 Difficulty increased to tier ${i + 1} (score: ${this.currentScore})`);
        }
        return;
      }
    }
  }

  /**
   * Get current difficulty tier index (0-4)
   */
  getDifficultyTier(): number {
    return this.currentDifficultyIndex;
  }

  /**
   * Get spawn weights for current difficulty
   */
  private getCurrentWeights(): { 0: number; 1: number; 2: number; 3: number } {
    const difficultyTier = DIFFICULTY_CONFIG[this.currentDifficultyIndex];
    return difficultyTier?.weights ?? SPAWN_WEIGHTS as { 0: number; 1: number; 2: number; 3: number };
  }

  /**
   * Initialize the animal queue
   */
  private initializeQueue(): void {
    for (let i = 0; i < GAME_CONFIG.QUEUE_SIZE; i++) {
      this.queue.push(this.generateRandomTier());
    }
  }

  /**
   * Generate random tier based on spawn weights (uses current difficulty)
   */
  private generateRandomTier(): number {
    const currentWeights = this.getCurrentWeights();
    const weights: number[] = [];
    const tiers: number[] = [];

    // Build weighted arrays from current difficulty weights
    for (const [tierStr, weight] of Object.entries(currentWeights)) {
      const tier = parseInt(tierStr, 10);
      if (weight > 0) {
        weights.push(weight);
        tiers.push(tier);
      }
    }

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < weights.length; i++) {
      random -= weights[i]!;
      if (random <= 0) {
        return tiers[i]!;
      }
    }

    return 0; // Default to tier 0
  }

  /**
   * Get the next animal tier from queue
   */
  getNextTier(): number {
    return this.queue[0] ?? 0;
  }

  /**
   * Get entire queue (for preview)
   */
  getQueue(): number[] {
    return [...this.queue];
  }

  /**
   * Spawn an animal at the given position
   */
  spawnAnimal(x: number, y: number): Animal {
    // Get tier from queue
    const tier = this.queue.shift() ?? 0;

    // Create animal
    const animal = new Animal(x, y, tier);

    // Add to tracking
    this.animals.set(animal.getId(), animal);

    // Add to physics world
    this.physicsEngine.addBody(animal.getBody());

    // Refill queue
    this.queue.push(this.generateRandomTier());

    return animal;
  }

  /**
   * Remove an animal from the game
   */
  removeAnimal(animal: Animal): void {
    this.animals.delete(animal.getId());
    this.physicsEngine.removeBody(animal.getBody());
  }

  /**
   * Get all active animals
   */
  getAllAnimals(): Animal[] {
    return Array.from(this.animals.values());
  }

  /**
   * Get animal by ID
   */
  getAnimalById(id: string): Animal | undefined {
    return this.animals.get(id);
  }

  /**
   * Clear all animals
   */
  clearAll(): void {
    this.animals.forEach(animal => {
      this.physicsEngine.removeBody(animal.getBody());
    });
    this.animals.clear();
  }

  /**
   * Reset manager (clear animals and reinitialize queue)
   */
  reset(): void {
    this.clearAll();
    this.queue = [];
    this.currentScore = 0;
    this.currentDifficultyIndex = 0;
    this.initializeQueue();
  }

  /**
   * Get count of active animals
   */
  getCount(): number {
    return this.animals.size;
  }

  /**
   * Find animals at a specific position (for collision detection)
   */
  getAnimalsAt(x: number, y: number, radius: number): Animal[] {
    const nearby: Animal[] = [];

    this.animals.forEach(animal => {
      const pos = animal.getPosition();
      const distance = Math.sqrt(
        Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)
      );

      if (distance < radius + animal.getRadius()) {
        nearby.push(animal);
      }
    });

    return nearby;
  }
}
