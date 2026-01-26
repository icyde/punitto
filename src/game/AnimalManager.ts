import { Animal } from '../entities/Animal';
import { GAME_CONFIG, SPAWN_WEIGHTS } from '../utils/constants';
import { PhysicsEngine } from './PhysicsEngine';

/**
 * Manages animal spawning, tracking, and queue system
 */
export class AnimalManager {
  private animals: Map<string, Animal> = new Map();
  private queue: number[] = [];
  private physicsEngine: PhysicsEngine;

  constructor(physicsEngine: PhysicsEngine) {
    this.physicsEngine = physicsEngine;
    this.initializeQueue();
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
   * Generate random tier based on spawn weights
   */
  private generateRandomTier(): number {
    const weights: number[] = [];
    const tiers: number[] = [];

    // Build weighted arrays
    for (const [tierStr, weight] of Object.entries(SPAWN_WEIGHTS)) {
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
