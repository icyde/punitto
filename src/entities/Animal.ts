import Matter from 'matter-js';
import { ANIMAL_TIERS, AnimalTier, GAME_CONFIG, QUICK_MERGE_CONFIG } from '../utils/constants';

/**
 * Animal entity representing a droppable/mergeable circle
 */
export class Animal {
  private body: Matter.Body;
  private tier: number;
  private tierData: AnimalTier;
  private id: string;
  private createdAt: number;

  // Settle tracking for quick merge bonus
  private settledTime: number | null = null;
  private settleCheckStart: number | null = null;

  constructor(x: number, y: number, tier: number) {
    this.tier = tier;
    this.tierData = ANIMAL_TIERS[tier]!;
    this.id = `animal-${Date.now()}-${Math.random()}`;
    this.createdAt = Date.now();

    // Calculate radius based on tier scaling
    const radius = this.tierData.baseRadius * this.tierData.scale * GAME_CONFIG.ANIMAL_HITBOX_SCALE;

    // Create physics body
    this.body = Matter.Bodies.circle(x, y, radius, {
      restitution: 0.2, // Reduced bounciness to prevent energy gain
      friction: 0.8, // Higher friction prevents slipping between bodies
      frictionAir: 0.02, // Air resistance dampens floating/unexpected movement
      frictionStatic: 0.8, // Higher static friction for stability
      density: 0.001,
      slop: 0.01, // Small positional tolerance reduces jitter
      label: `animal-tier${tier}`,
      render: {
        fillStyle: 'transparent' // Hidden - CustomRenderer draws sprites on top
      }
    });

    // Store reference to this animal in the body
    (this.body as any).animalRef = this;
  }

  /**
   * Get the physics body
   */
  getBody(): Matter.Body {
    return this.body;
  }

  /**
   * Get the tier level (0-6)
   */
  getTier(): number {
    return this.tier;
  }

  /**
   * Get tier data
   */
  getTierData(): AnimalTier {
    return this.tierData;
  }

  /**
   * Get the radius
   */
  getRadius(): number {
    return this.tierData.baseRadius * this.tierData.scale * GAME_CONFIG.ANIMAL_HITBOX_SCALE;
  }

  /**
   * Get current position
   */
  getPosition(): { x: number; y: number } {
    return {
      x: this.body.position.x,
      y: this.body.position.y
    };
  }

  /**
   * Get unique ID
   */
  getId(): string {
    return this.id;
  }

  /**
   * Get how long this animal has existed (in ms)
   */
  getAge(): number {
    return Date.now() - this.createdAt;
  }

  /**
   * Check if this animal is touching another animal
   */
  isTouching(other: Animal): boolean {
    const pos1 = this.getPosition();
    const pos2 = other.getPosition();
    const distance = Math.sqrt(
      Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2)
    );

    const combinedRadius = this.getRadius() + other.getRadius();

    return distance < combinedRadius * 0.95; // Slight overlap required
  }

  /**
   * Check if this animal can merge with another
   * Big Floofs (tier 6) can merge too - they disappear instead of creating a new tier
   */
  canMergeWith(other: Animal): boolean {
    return this.tier === other.getTier();
  }

  /**
   * Update settle status based on current velocity
   * Should be called each physics tick
   */
  updateSettleStatus(): void {
    const velocity = this.body.velocity;
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

    if (speed < QUICK_MERGE_CONFIG.SETTLE_VELOCITY_THRESHOLD) {
      // Animal is moving slowly
      if (this.settleCheckStart === null) {
        this.settleCheckStart = Date.now();
      } else if (this.settledTime === null) {
        const elapsed = Date.now() - this.settleCheckStart;
        if (elapsed >= QUICK_MERGE_CONFIG.SETTLE_DURATION_MS) {
          this.settledTime = Date.now();
        }
      }
    } else {
      // Animal is moving, reset settle tracking
      this.settleCheckStart = null;
      this.settledTime = null;
    }
  }

  /**
   * Check if the animal has settled
   */
  isSettled(): boolean {
    return this.settledTime !== null;
  }

  /**
   * Get time since animal settled (ms), or null if not settled
   */
  getTimeSinceSettled(): number | null {
    if (this.settledTime === null) return null;
    return Date.now() - this.settledTime;
  }

  /**
   * Check if this animal qualifies for quick merge bonus
   */
  isQuickMergeEligible(): boolean {
    const timeSinceSettled = this.getTimeSinceSettled();
    if (timeSinceSettled === null) return false;
    return timeSinceSettled <= QUICK_MERGE_CONFIG.WINDOW_MS;
  }

  /**
   * Static method to create an animal from a body
   */
  static fromBody(body: Matter.Body): Animal | null {
    return (body as any).animalRef || null;
  }

  /**
   * Check if body represents an animal
   */
  static isAnimalBody(body: Matter.Body): boolean {
    return body.label.startsWith('animal-tier');
  }

  /**
   * Extract tier from body label
   */
  static getTierFromBody(body: Matter.Body): number {
    const match = body.label.match(/animal-tier(\d+)/);
    return match ? parseInt(match[1]!, 10) : -1;
  }
}
