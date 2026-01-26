import Matter from 'matter-js';
import { PhysicsEngine } from './PhysicsEngine';
import { Container } from '../entities/Container';
import { AnimalManager } from './AnimalManager';
import { Animal } from '../entities/Animal';
import { ScoreManager } from './ScoreManager';
import { GAME_CONFIG } from '../utils/constants';

/**
 * Main game controller
 * Orchestrates physics, container, input, and game loop
 */
export class Game {
  private physicsEngine: PhysicsEngine;
  private container: Container;
  private animalManager: AnimalManager;
  private scoreManager: ScoreManager;
  private canvas: HTMLCanvasElement;
  private isRunning: boolean = false;
  private mergePairs: Set<string> = new Set(); // Track merges in progress

  // Danger line tracking
  private dangerStartTime: number | null = null;
  private isInDanger: boolean = false;
  private gameOverCallback: (() => void) | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.physicsEngine = new PhysicsEngine(canvas);
    this.container = new Container();
    this.animalManager = new AnimalManager(this.physicsEngine);
    this.scoreManager = new ScoreManager();

    this.initialize();
  }

  /**
   * Initialize the game
   */
  private initialize(): void {
    // Add container walls to physics world
    const walls = this.container.getWalls();
    walls.forEach(wall => {
      this.physicsEngine.addBody(wall);
    });

    // Set up collision detection
    this.setupCollisionDetection();

    // Set up input handlers
    this.setupInputHandlers();

    // Set up game loop for danger detection
    this.setupGameLoop();
  }

  /**
   * Set up game loop for checking danger line
   */
  private setupGameLoop(): void {
    setInterval(() => {
      if (this.isRunning) {
        this.checkDangerLine();
      }
    }, 100); // Check every 100ms
  }

  /**
   * Set up collision detection for merging
   */
  private setupCollisionDetection(): void {
    const engine = this.physicsEngine.getEngine();

    Matter.Events.on(engine, 'collisionStart', (event) => {
      if (!this.isRunning) return;

      event.pairs.forEach(pair => {
        this.handleCollision(pair.bodyA, pair.bodyB);
      });
    });
  }

  /**
   * Set up click/tap input handlers
   */
  private setupInputHandlers(): void {
    // Handle both mouse and touch events
    this.canvas.addEventListener('click', (e) => this.handleInput(e));
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.handleTouch(e);
    });
  }

  /**
   * Handle mouse click
   */
  private handleInput(event: MouseEvent): void {
    if (!this.isRunning) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;

    this.spawnAnimal(x);
  }

  /**
   * Handle touch event
   */
  private handleTouch(event: TouchEvent): void {
    if (!this.isRunning) return;

    const rect = this.canvas.getBoundingClientRect();
    const touch = event.touches[0];
    if (!touch) return;

    const x = touch.clientX - rect.left;

    this.spawnAnimal(x);
  }

  /**
   * Handle collision between two bodies
   */
  private handleCollision(bodyA: Matter.Body, bodyB: Matter.Body): void {
    // Check if both bodies are animals
    if (!Animal.isAnimalBody(bodyA) || !Animal.isAnimalBody(bodyB)) {
      return;
    }

    const animalA = Animal.fromBody(bodyA);
    const animalB = Animal.fromBody(bodyB);

    if (!animalA || !animalB) return;

    // Check if they can merge
    if (animalA.canMergeWith(animalB)) {
      // Create unique pair ID (sorted to avoid duplicates)
      const pairId = [animalA.getId(), animalB.getId()].sort().join('-');

      // Prevent duplicate merges
      if (this.mergePairs.has(pairId)) return;
      this.mergePairs.add(pairId);

      // Delay merge slightly to allow physics to settle
      setTimeout(() => {
        this.mergeAnimals(animalA, animalB);
        this.mergePairs.delete(pairId);
      }, 100);
    }
  }

  /**
   * Merge two animals
   */
  private mergeAnimals(animalA: Animal, animalB: Animal): void {
    // Verify both animals still exist
    const allAnimals = this.animalManager.getAllAnimals();
    if (!allAnimals.includes(animalA) || !allAnimals.includes(animalB)) {
      return;
    }

    const tier = animalA.getTier();

    // Calculate merge position (midpoint)
    const posA = animalA.getPosition();
    const posB = animalB.getPosition();
    const mergeX = (posA.x + posB.x) / 2;
    const mergeY = (posA.y + posB.y) / 2;

    // Remove both animals
    this.animalManager.removeAnimal(animalA);
    this.animalManager.removeAnimal(animalB);

    // Award score for merge
    this.scoreManager.addMergeScore(tier);

    // Special case: Big Floof (tier 6) merge - just disappear
    if (tier === 6) {
      console.log('💫 Two Big Floofs merged and disappeared!');
      this.scoreManager.addBigFloofDisappear();
      return;
    }

    // Create new animal at next tier
    const newAnimal = new Animal(mergeX, mergeY, tier + 1);
    this.animalManager['animals'].set(newAnimal.getId(), newAnimal);
    this.physicsEngine.addBody(newAnimal.getBody());

    console.log(`✨ Merged ${animalA.getTierData().name} + ${animalB.getTierData().name} → ${newAnimal.getTierData().name}`);

    // Check for chain reactions (after a short delay)
    setTimeout(() => {
      this.checkChainReactions(newAnimal);
    }, 200);
  }

  /**
   * Check if the newly created animal can trigger more merges
   */
  private checkChainReactions(newAnimal: Animal): void {
    const allAnimals = this.animalManager.getAllAnimals();

    for (const other of allAnimals) {
      if (other.getId() === newAnimal.getId()) continue;

      if (newAnimal.canMergeWith(other) && newAnimal.isTouching(other)) {
        console.log('⚡ Chain reaction triggered!');
        this.mergeAnimals(newAnimal, other);
        break; // Only one chain at a time
      }
    }
  }

  /**
   * Spawn an animal at the given X position
   */
  private spawnAnimal(x: number): void {
    const bounds = this.container.getSpawnBounds();

    // Clamp X position within spawn bounds
    const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, x));

    // Use AnimalManager to spawn
    this.animalManager.spawnAnimal(clampedX, bounds.spawnY);
  }

  /**
   * Check if any animals are above the danger line
   */
  private checkDangerLine(): void {
    const dangerLineY = this.container.getDangerLineY();
    const animals = this.animalManager.getAllAnimals();

    // Check if any animal is above the danger line
    const hasAnimalAboveLine = animals.some(animal => {
      const pos = animal.getPosition();
      return pos.y - animal.getRadius() < dangerLineY;
    });

    if (hasAnimalAboveLine) {
      if (!this.isInDanger) {
        // Just entered danger zone
        this.isInDanger = true;
        this.dangerStartTime = Date.now();
        console.log('⚠️ Danger! Animals above the line!');
      } else {
        // Check if we've been in danger too long
        const elapsedTime = Date.now() - (this.dangerStartTime ?? 0);
        if (elapsedTime >= GAME_CONFIG.DANGER_TIME_THRESHOLD) {
          this.triggerGameOver();
        }
      }
    } else {
      // Safe zone - reset danger
      if (this.isInDanger) {
        console.log('✅ Safe again!');
      }
      this.isInDanger = false;
      this.dangerStartTime = null;
    }
  }

  /**
   * Trigger game over
   */
  private triggerGameOver(): void {
    if (!this.isRunning) return;

    console.log('💀 Game Over!');
    this.isRunning = false;
    this.physicsEngine.stop();

    // Call game over callback if set
    if (this.gameOverCallback) {
      this.gameOverCallback();
    }
  }

  /**
   * Set game over callback
   */
  setGameOverCallback(callback: () => void): void {
    this.gameOverCallback = callback;
  }

  /**
   * Start the game
   */
  start(): void {
    this.isRunning = true;
    this.physicsEngine.start();
    console.log('Game started!');
  }

  /**
   * Stop the game
   */
  stop(): void {
    this.isRunning = false;
    this.physicsEngine.stop();
  }

  /**
   * Reset the game
   */
  reset(): void {
    this.animalManager.clearAll();
    this.mergePairs.clear();
    this.scoreManager.reset();
    this.isInDanger = false;
    this.dangerStartTime = null;
    this.isRunning = true;
    this.physicsEngine.start();
  }

  /**
   * Get next animal tier (for UI preview)
   */
  getNextAnimalTier(): number {
    return this.animalManager.getNextTier();
  }

  /**
   * Get animal queue (for UI preview)
   */
  getAnimalQueue(): number[] {
    return this.animalManager.getQueue();
  }

  /**
   * Get score manager
   */
  getScoreManager(): ScoreManager {
    return this.scoreManager;
  }

  /**
   * Check if in danger state
   */
  isInDangerState(): boolean {
    return this.isInDanger;
  }

  /**
   * Get danger progress (0-1)
   */
  getDangerProgress(): number {
    if (!this.isInDanger || !this.dangerStartTime) return 0;

    const elapsed = Date.now() - this.dangerStartTime;
    return Math.min(elapsed / GAME_CONFIG.DANGER_TIME_THRESHOLD, 1);
  }
}
