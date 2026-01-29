import Matter from 'matter-js';
import { PhysicsEngine } from './PhysicsEngine';
import { Container } from '../entities/Container';
import { AnimalManager } from './AnimalManager';
import { Animal } from '../entities/Animal';
import { ScoreManager } from './ScoreManager';
import { ThemeManager } from './ThemeManager';
import { QuestManager } from './QuestManager';
import { StatsTracker } from './StatsTracker';
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
  private themeManager: ThemeManager;
  private questManager: QuestManager;
  private statsTracker: StatsTracker;
  private canvas: HTMLCanvasElement;
  private isRunning: boolean = false;
  private mergePairs: Set<string> = new Set(); // Track merges in progress

  // Danger line tracking
  private dangerStartTime: number | null = null;
  private isInDanger: boolean = false;
  private gameOverCallback: (() => void) | null = null;

  // Drop guide tracking
  private cursorX: number | null = null;
  private onMergeCallback: ((x: number, y: number, score: number) => void) | null = null;

  // Session tracking for quests
  private sessionMerges: number = 0;
  private sessionAnimalsCreated: Record<number, number> = {};
  private sessionMaxChain: number = 0;
  private currentChainCount: number = 0;

  // Spawn cooldown tracking
  private lastSpawnTime: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.physicsEngine = new PhysicsEngine(canvas);
    this.container = new Container();
    this.animalManager = new AnimalManager(this.physicsEngine);
    this.scoreManager = new ScoreManager();
    this.themeManager = new ThemeManager();
    this.questManager = new QuestManager();
    this.statsTracker = new StatsTracker();

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

    // Set up theme and sprite rendering
    this.setupTheme();
  }

  /**
   * Set up theme and load sprites
   */
  private async setupTheme(): Promise<void> {
    // Load sprites for active theme
    await this.themeManager.preloadActiveTheme();

    // Set theme on custom renderer
    const activeTheme = this.themeManager.getActiveTheme();
    this.physicsEngine.getCustomRenderer().setTheme(activeTheme);

    console.log(`🎨 Loaded theme: ${activeTheme.name}`);
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
    // Mouse: click to drop
    this.canvas.addEventListener('click', (e) => this.handleInput(e));

    // Touch: touchstart shows guide, touchend drops
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
        this.cursorX = touch.clientX - rect.left;
      }
    });
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
        this.cursorX = touch.clientX - rect.left;
      }
    });
    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      // Drop at current cursor position, then clear
      if (this.isRunning && this.cursorX !== null) {
        this.spawnAnimal(this.cursorX);
      }
      this.cursorX = null;
    });

    // Mouse: track cursor position for drop guide
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.cursorX = e.clientX - rect.left;
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.cursorX = null;
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
    const score = this.scoreManager.addMergeScore(tier);

    // Track merge stats
    this.sessionMerges++;
    this.statsTracker.recordMerge(tier);
    this.statsTracker.recordScore(score);

    // Trigger merge callback for score popup
    if (this.onMergeCallback) {
      this.onMergeCallback(mergeX, mergeY, score);
    }

    // Special case: Big Floof (tier 6) merge - just disappear
    if (tier === 6) {
      console.log('💫 Two Big Floofs merged and disappeared!');
      this.statsTracker.recordBigFloofMerge();
      const bonusScore = this.scoreManager.addBigFloofDisappear();
      this.statsTracker.recordScore(bonusScore);
      if (this.onMergeCallback) {
        this.onMergeCallback(mergeX, mergeY, bonusScore);
      }
      this.updateProgressTracking();
      return;
    }

    // Create new animal at next tier
    const newAnimal = new Animal(mergeX, mergeY, tier + 1);
    this.animalManager['animals'].set(newAnimal.getId(), newAnimal);
    this.physicsEngine.addBody(newAnimal.getBody());

    // Track new animal created
    this.trackAnimalCreated(tier + 1);

    console.log(`✨ Merged ${animalA.getTierData().name} + ${animalB.getTierData().name} → ${newAnimal.getTierData().name}`);

    // Update progress tracking
    this.updateProgressTracking();

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
        this.currentChainCount++;
        this.statsTracker.recordChainReaction();
        if (this.currentChainCount > this.sessionMaxChain) {
          this.sessionMaxChain = this.currentChainCount;
        }
        this.mergeAnimals(newAnimal, other);
        break; // Only one chain at a time
      }
    }

    // Reset chain count after chain completes
    setTimeout(() => {
      this.currentChainCount = 0;
    }, 500);
  }

  /**
   * Spawn an animal at the given X position
   */
  private spawnAnimal(x: number): void {
    // Check spawn cooldown to prevent spam clicking
    const now = Date.now();
    if (now - this.lastSpawnTime < GAME_CONFIG.SPAWN_COOLDOWN) {
      return; // Too soon, ignore this spawn attempt
    }
    this.lastSpawnTime = now;

    const bounds = this.container.getSpawnBounds();

    // Clamp X position within spawn bounds
    const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, x));

    // Get the tier that will be spawned
    const tier = this.animalManager.getNextTier();

    // Use AnimalManager to spawn
    this.animalManager.spawnAnimal(clampedX, bounds.spawnY);

    // Track the spawned animal
    this.trackAnimalCreated(tier);
  }

  /**
   * Track an animal being created (spawned or merged)
   */
  private trackAnimalCreated(tier: number): void {
    this.statsTracker.recordAnimalCreated(tier);
    if (!this.sessionAnimalsCreated[tier]) {
      this.sessionAnimalsCreated[tier] = 0;
    }
    this.sessionAnimalsCreated[tier]++;
  }

  /**
   * Update quest and achievement progress
   */
  private updateProgressTracking(): void {
    const stats = this.statsTracker.getStats();
    const sessionData = {
      mergesThisGame: this.sessionMerges,
      scoreThisGame: this.scoreManager.getCurrentScore(),
      animalsCreatedThisGame: this.sessionAnimalsCreated,
      maxChainThisGame: this.sessionMaxChain
    };

    this.questManager.updateQuestProgress(stats, sessionData);
    this.questManager.checkAchievements(stats);
  }

  /**
   * Check if any animals are above the danger line
   */
  private checkDangerLine(): void {
    const dangerLineY = this.container.getDangerLineY();
    const animals = this.animalManager.getAllAnimals();

    // Check if any settled animal is above the danger line
    // Ignore recently spawned animals (grace period for falling)
    const hasAnimalAboveLine = animals.some(animal => {
      // Skip animals that were just spawned
      if (animal.getAge() < GAME_CONFIG.DANGER_GRACE_PERIOD) {
        return false;
      }
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

    // Record game played and final progress
    this.statsTracker.recordGamePlayed();
    this.updateProgressTracking();

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
    this.animalManager.reset();
    this.mergePairs.clear();
    this.scoreManager.reset();
    this.isInDanger = false;
    this.dangerStartTime = null;

    // Reset session tracking
    this.sessionMerges = 0;
    this.sessionAnimalsCreated = {};
    this.sessionMaxChain = 0;
    this.currentChainCount = 0;

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

  /**
   * Get theme manager
   */
  getThemeManager(): ThemeManager {
    return this.themeManager;
  }

  /**
   * Get quest manager
   */
  getQuestManager(): QuestManager {
    return this.questManager;
  }

  /**
   * Get current cursor X position for drop guide
   */
  getCursorX(): number | null {
    return this.cursorX;
  }

  /**
   * Get spawn bounds for drop guide
   */
  getSpawnBounds(): { minX: number; maxX: number; spawnY: number } {
    return this.container.getSpawnBounds();
  }

  /**
   * Set merge callback for score popups
   */
  setOnMergeCallback(callback: (x: number, y: number, score: number) => void): void {
    this.onMergeCallback = callback;
  }

  /**
   * Update drop guide on custom renderer
   */
  updateDropGuide(): void {
    const cursorX = this.cursorX;
    const bounds = this.container.getSpawnBounds();
    const nextTier = this.animalManager.getNextTier();

    // Clamp cursor to spawn bounds
    let clampedX: number | null = null;
    if (cursorX !== null) {
      clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, cursorX));
    }

    this.physicsEngine.getCustomRenderer().setDropGuide(clampedX, bounds.spawnY, nextTier);
  }
}
