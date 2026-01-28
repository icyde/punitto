import Matter from 'matter-js';
import { ANIMAL_TIERS, AnimalTier, GAME_CONFIG } from '../utils/constants';

/**
 * Animal entity representing a droppable/mergeable circle
 */
export class Animal {
  private body: Matter.Body;
  private tier: number;
  private tierData: AnimalTier;
  private id: string;
  private createdAt: number;

  constructor(x: number, y: number, tier: number) {
    this.tier = tier;
    this.tierData = ANIMAL_TIERS[tier]!;
    this.id = `animal-${Date.now()}-${Math.random()}`;
    this.createdAt = Date.now();

    // Calculate radius based on tier scaling
    const radius = this.tierData.baseRadius * this.tierData.scale * GAME_CONFIG.ANIMAL_HITBOX_SCALE;

    // Create physics body
    this.body = Matter.Bodies.circle(x, y, radius, {
      restitution: 0.3, // Bounciness
      friction: 0.5,
      density: 0.001,
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
   */
  canMergeWith(other: Animal): boolean {
    return this.tier === other.getTier() && this.tier < 6; // Same tier and not max tier
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
