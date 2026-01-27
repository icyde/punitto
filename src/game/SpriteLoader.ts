import { Theme } from '../progression/themes';
import { GAME_CONFIG } from '../utils/constants';

/**
 * Sprite loader for animal images
 * Handles loading and caching of theme sprites
 */
export class SpriteLoader {
  private sprites: Map<string, HTMLImageElement> = new Map();
  private loadingPromises: Map<string, Promise<HTMLImageElement>> = new Map();
  private spriteScales: Map<string, number> = new Map();

  /**
   * Load a sprite image
   */
  async loadSprite(path: string): Promise<HTMLImageElement> {
    // Check if already loaded
    if (this.sprites.has(path)) {
      return this.sprites.get(path)!;
    }

    // Check if currently loading
    if (this.loadingPromises.has(path)) {
      return this.loadingPromises.get(path)!;
    }

    // Start loading
    const promise = new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();

      img.onload = () => {
        this.sprites.set(path, img);
        this.spriteScales.set(path, this.computeContentScale(img));
        this.loadingPromises.delete(path);
        resolve(img);
      };

      img.onerror = () => {
        console.warn(`Failed to load sprite: ${path}`);
        this.loadingPromises.delete(path);
        // Resolve with a placeholder instead of rejecting
        const placeholder = this.createPlaceholder();
        this.sprites.set(path, placeholder);
        this.spriteScales.set(path, GAME_CONFIG.ANIMAL_SPRITE_SCALE);
        resolve(placeholder);
      };

      img.src = path;
    });

    this.loadingPromises.set(path, promise);
    return promise;
  }

  /**
   * Create a placeholder image for missing sprites
   */
  private createPlaceholder(): HTMLImageElement {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Draw a simple circle as placeholder
      ctx.fillStyle = '#DDD';
      ctx.beginPath();
      ctx.arc(256, 256, 200, 0, Math.PI * 2);
      ctx.fill();
    }

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  /**
   * Load all sprites for a theme
   */
  async loadTheme(theme: Theme): Promise<void> {
    const promises = theme.animals.map(animal =>
      this.loadSprite(animal.spritePath)
    );

    await Promise.all(promises);
    console.log(`Loaded ${theme.name} theme sprites`);
  }

  /**
   * Get a loaded sprite
   */
  getSprite(path: string): HTMLImageElement | null {
    return this.sprites.get(path) || null;
  }

  /**
   * Get computed sprite scale (auto + global multiplier)
   */
  getSpriteScale(path: string): number {
    return this.spriteScales.get(path) ?? GAME_CONFIG.ANIMAL_SPRITE_SCALE;
  }

  /**
   * Check if a sprite is loaded
   */
  isSpriteLoaded(path: string): boolean {
    return this.sprites.has(path);
  }

  /**
   * Clear all loaded sprites
   */
  clear(): void {
    this.sprites.clear();
    this.loadingPromises.clear();
    this.spriteScales.clear();
  }

  /**
   * Compute scale to match sprite's visible radius to the hitbox
   */
  private computeContentScale(img: HTMLImageElement): number {
    const width = img.naturalWidth || img.width;
    const height = img.naturalHeight || img.height;
    if (!width || !height) {
      return GAME_CONFIG.ANIMAL_SPRITE_SCALE;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return GAME_CONFIG.ANIMAL_SPRITE_SCALE;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const centerX = width / 2;
    const centerY = height / 2;
    let maxDistance = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4 + 3;
        const alpha = data[index] ?? 0;
        if (alpha > GAME_CONFIG.SPRITE_ALPHA_THRESHOLD) {
          const dx = x + 0.5 - centerX;
          const dy = y + 0.5 - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > maxDistance) {
            maxDistance = distance;
          }
        }
      }
    }

    if (maxDistance <= 0) {
      return GAME_CONFIG.ANIMAL_SPRITE_SCALE;
    }

    const targetRadius = Math.min(width, height) / 2;
    const rawScale = (targetRadius / maxDistance) * GAME_CONFIG.ANIMAL_SPRITE_SCALE;

    return Math.max(
      GAME_CONFIG.SPRITE_SCALE_MIN,
      Math.min(GAME_CONFIG.SPRITE_SCALE_MAX, rawScale)
    );
  }
}

// Global sprite loader instance
export const spriteLoader = new SpriteLoader();
