import Matter from 'matter-js';
import { Animal } from '../entities/Animal';
import { spriteLoader } from './SpriteLoader';
import { Theme } from '../progression/themes';

/**
 * Custom renderer for drawing sprites on animals
 * Overlays on top of Matter.js physics rendering
 */
export class CustomRenderer {
  private ctx: CanvasRenderingContext2D;
  private engine: Matter.Engine;
  private currentTheme: Theme | null = null;
  private useSprites: boolean = false;

  constructor(canvas: HTMLCanvasElement, engine: Matter.Engine) {
    this.ctx = canvas.getContext('2d')!;
    this.engine = engine;
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
    const size = radius * 2;

    // Save context state
    this.ctx.save();

    // Translate to animal position
    this.ctx.translate(pos.x, pos.y);
    this.ctx.rotate(body.angle);

    // Draw sprite centered
    this.ctx.drawImage(
      sprite,
      -radius,
      -radius,
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
