import { Theme } from '../progression/themes';

/**
 * Sprite loader for animal images
 * Handles loading and caching of theme sprites
 */
export class SpriteLoader {
  private sprites: Map<string, HTMLImageElement> = new Map();
  private loadingPromises: Map<string, Promise<HTMLImageElement>> = new Map();

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
    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.sprites.set(path, img);
        this.loadingPromises.delete(path);
        resolve(img);
      };

      img.onerror = () => {
        console.warn(`Failed to load sprite: ${path}`);
        this.loadingPromises.delete(path);
        // Resolve with a placeholder instead of rejecting
        const placeholder = this.createPlaceholder();
        this.sprites.set(path, placeholder);
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
  }
}

// Global sprite loader instance
export const spriteLoader = new SpriteLoader();
