import Matter from 'matter-js';
import { Animal } from '../entities/Animal';
import { spriteLoader } from './SpriteLoader';
import { Theme } from '../progression/themes';
import { ANIMAL_TIERS, GAME_CONFIG } from '../utils/constants';

/**
 * Custom renderer for drawing sprites on animals
 * Overlays on top of Matter.js physics rendering
 */
export class CustomRenderer {
  private ctx: CanvasRenderingContext2D;
  private engine: Matter.Engine;
  private currentTheme: Theme | null = null;
  private useSprites: boolean = false;
  private canvas: HTMLCanvasElement;

  // Drop guide state
  private dropGuideX: number | null = null;
  private dropGuideY: number = 0;
  private nextTier: number = 0;

  constructor(canvas: HTMLCanvasElement, engine: Matter.Engine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.engine = engine;

    // Enable image smoothing for better quality
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  /**
   * Set the current theme
   */
  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    this.useSprites = true;
  }

  /**
   * Render all animals with sprites
   */
  render(): void {
    if (!this.useSprites || !this.currentTheme) return;

    const bodies = Matter.Composite.allBodies(this.engine.world);

    bodies.forEach(body => {
      if (Animal.isAnimalBody(body)) {
        this.renderAnimal(body);
      }
    });

    // Draw drop guide on top
    this.renderDropGuide();
  }

  /**
   * Update drop guide position
   */
  setDropGuide(x: number | null, spawnY: number, nextTier: number): void {
    this.dropGuideX = x;
    this.dropGuideY = spawnY;
    this.nextTier = nextTier;
  }

  /**
   * Render the drop guide line and preview animal
   */
  private renderDropGuide(): void {
    if (this.dropGuideX === null || !this.currentTheme) return;

    const x = this.dropGuideX;
    const tierData = ANIMAL_TIERS[this.nextTier];
    if (!tierData) return;

    const radius = tierData.baseRadius * tierData.scale;

    // Draw vertical dashed guide line
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(255, 158, 170, 0.5)'; // Primary color with transparency
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([8, 8]);
    this.ctx.beginPath();
    this.ctx.moveTo(x, this.dropGuideY + radius);
    this.ctx.lineTo(x, this.canvas.height);
    this.ctx.stroke();
    this.ctx.restore();

    // Draw preview animal at spawn position
    const themeAnimal = this.currentTheme.animals[this.nextTier];
    if (!themeAnimal) return;

    const sprite = spriteLoader.getSprite(themeAnimal.spritePath);
    const spriteScale = GAME_CONFIG.ANIMAL_SPRITE_SCALE;
    const size = radius * 2 * spriteScale;

    this.ctx.save();
    this.ctx.globalAlpha = 0.7;
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    this.ctx.translate(x, this.dropGuideY);

    if (sprite && sprite.complete) {
      // Draw sprite (no clipping)
      this.ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
    } else {
      // Draw colored circle as fallback
      this.ctx.beginPath();
      this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = tierData.color;
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  /**
   * Render a single animal with sprite
   */
  private renderAnimal(body: Matter.Body): void {
    if (!this.currentTheme) return;

    const animal = Animal.fromBody(body);
    if (!animal) return;

    const tier = animal.getTier();
    const themeAnimal = this.currentTheme.animals[tier];
    if (!themeAnimal) return;

    const sprite = spriteLoader.getSprite(themeAnimal.spritePath);
    if (!sprite || !sprite.complete) {
      // Sprite not loaded, Matter.js will render the colored circle
      return;
    }

    const pos = body.position;
    const radius = animal.getRadius();
    // Draw sprite slightly smaller than physics body so hitbox matches visual better
    // The sprite's main body should match the physics circle
    const spriteScale = GAME_CONFIG.ANIMAL_SPRITE_SCALE;
    const size = radius * 2 * spriteScale;

    // Save context state
    this.ctx.save();

    // Enable high quality image rendering
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    // Translate to animal position
    this.ctx.translate(pos.x, pos.y);
    this.ctx.rotate(body.angle);

    // Draw sprite centered (no clipping - show full sprite)
    this.ctx.drawImage(
      sprite,
      -size / 2,
      -size / 2,
      size,
      size
    );

    // Restore context
    this.ctx.restore();
  }

  /**
   * Enable/disable sprite rendering
   */
  setUseSprites(use: boolean): void {
    this.useSprites = use;
  }
}
