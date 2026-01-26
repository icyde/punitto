import { getSettings, saveSettings, GameSettings } from '../utils/storage';

/**
 * Audio manager for sound effects and music
 */
export class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private music: HTMLAudioElement | null = null;
  private settings: GameSettings;

  constructor() {
    this.settings = getSettings();
    this.loadAudio();
  }

  /**
   * Load all audio files
   */
  private loadAudio(): void {
    // Sound effects
    this.loadSound('drop1', '/src/assets/sounds/drop1.mp3');
    this.loadSound('drop2', '/src/assets/sounds/drop2.mp3');

    // Merge sounds (tier-specific)
    for (let i = 0; i <= 6; i++) {
      this.loadSound(`merge-tier${i}`, `/src/assets/sounds/merge-tier${i}.mp3`);
    }

    // Special sounds
    this.loadSound('bigFloof', '/src/assets/sounds/bigFloof.mp3');
    this.loadSound('danger', '/src/assets/sounds/danger.mp3');
    this.loadSound('gameOver', '/src/assets/sounds/gameOver.mp3');
    this.loadSound('highScore', '/src/assets/sounds/highScore.mp3');

    // UI clicks
    this.loadSound('click1', '/src/assets/sounds/click1.mp3');
    this.loadSound('click2', '/src/assets/sounds/click2.mp3');
    this.loadSound('click3', '/src/assets/sounds/click3.mp3');

    // Background music
    this.loadMusic('/src/assets/sounds/bgMusic.mp3');
  }

  /**
   * Load a sound effect
   */
  private loadSound(name: string, path: string): void {
    const audio = new Audio();
    audio.preload = 'auto';

    audio.addEventListener('error', () => {
      console.warn(`Failed to load sound: ${path}`);
    });

    audio.src = path;
    this.sounds.set(name, audio);
  }

  /**
   * Load background music
   */
  private loadMusic(path: string): void {
    this.music = new Audio();
    this.music.preload = 'auto';
    this.music.loop = true;
    this.music.volume = 0.5;

    this.music.addEventListener('error', () => {
      console.warn(`Failed to load music: ${path}`);
    });

    this.music.src = path;
  }

  /**
   * Play a sound effect
   */
  playSound(name: string): void {
    if (!this.settings.soundEnabled) return;

    const sound = this.sounds.get(name);
    if (!sound) return;

    // Clone the audio to allow overlapping plays
    const clone = sound.cloneNode() as HTMLAudioElement;
    clone.volume = 0.7;

    clone.play().catch(() => {
      // Silently fail (user interaction may be required)
    });
  }

  /**
   * Play drop sound (random variation)
   */
  playDrop(): void {
    const variation = Math.random() < 0.5 ? 'drop1' : 'drop2';
    this.playSound(variation);
  }

  /**
   * Play merge sound for specific tier
   */
  playMerge(tier: number): void {
    this.playSound(`merge-tier${tier}`);
  }

  /**
   * Play UI click sound (random variation)
   */
  playClick(): void {
    const variation = Math.floor(Math.random() * 3) + 1;
    this.playSound(`click${variation}`);
  }

  /**
   * Play Big Floof disappear sound
   */
  playBigFloof(): void {
    this.playSound('bigFloof');
  }

  /**
   * Play danger warning sound
   */
  playDanger(): void {
    this.playSound('danger');
  }

  /**
   * Play game over sound
   */
  playGameOver(): void {
    this.playSound('gameOver');
  }

  /**
   * Play high score jingle
   */
  playHighScore(): void {
    this.playSound('highScore');
  }

  /**
   * Start background music
   */
  startMusic(): void {
    if (!this.settings.musicEnabled || !this.music) return;

    this.music.play().catch(() => {
      console.log('Music autoplay prevented. User interaction required.');
    });
  }

  /**
   * Stop background music
   */
  stopMusic(): void {
    if (this.music) {
      this.music.pause();
      this.music.currentTime = 0;
    }
  }

  /**
   * Toggle sound effects
   */
  toggleSound(enabled: boolean): void {
    this.settings.soundEnabled = enabled;
    saveSettings(this.settings);
  }

  /**
   * Toggle background music
   */
  toggleMusic(enabled: boolean): void {
    this.settings.musicEnabled = enabled;
    saveSettings(this.settings);

    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  /**
   * Get current settings
   */
  getSettings(): GameSettings {
    return { ...this.settings };
  }
}
