import { Game } from './game/Game';
import { GameUI } from './ui/GameUI';
import './style.css';

/**
 * Main entry point for Punitto game
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Hide loading message
  const loadingElement = document.querySelector('.loading');
  if (loadingElement) {
    loadingElement.remove();
  }

  // Get canvas element
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }

  // Initialize game and UI
  const game = new Game(canvas);
  new GameUI(game, canvas);

  // Start the game
  game.start();

  console.log('🎮 Punitto game initialized!');
  console.log('👆 Click or tap to drop animals!');
  console.log('📊 Score tracking enabled');
  console.log('⚠️ Watch out for the danger line!');
});
