import Matter from 'matter-js';
import { GAME_CONFIG, COLORS } from '../utils/constants';

/**
 * Game container with physics boundaries
 * Creates left, right, and bottom walls to contain the animals
 */
export class Container {
  private leftWall: Matter.Body;
  private rightWall: Matter.Body;
  private bottomWall: Matter.Body;

  constructor() {
    const { CONTAINER_WIDTH, CONTAINER_HEIGHT, WALL_THICKNESS } = GAME_CONFIG;

    // Create left wall
    this.leftWall = Matter.Bodies.rectangle(
      WALL_THICKNESS / 2,
      CONTAINER_HEIGHT / 2,
      WALL_THICKNESS,
      CONTAINER_HEIGHT,
      {
        isStatic: true,
        friction: 0.3,
        render: {
          fillStyle: COLORS.WALL
        }
      }
    );

    // Create right wall
    this.rightWall = Matter.Bodies.rectangle(
      CONTAINER_WIDTH - WALL_THICKNESS / 2,
      CONTAINER_HEIGHT / 2,
      WALL_THICKNESS,
      CONTAINER_HEIGHT,
      {
        isStatic: true,
        friction: 0.3,
        render: {
          fillStyle: COLORS.WALL
        }
      }
    );

    // Create bottom wall
    this.bottomWall = Matter.Bodies.rectangle(
      CONTAINER_WIDTH / 2,
      CONTAINER_HEIGHT - WALL_THICKNESS / 2,
      CONTAINER_WIDTH,
      WALL_THICKNESS,
      {
        isStatic: true,
        friction: 0.5,
        render: {
          fillStyle: COLORS.WALL
        }
      }
    );
  }

  /**
   * Get all wall bodies to add to the world
   */
  getWalls(): Matter.Body[] {
    return [this.leftWall, this.rightWall, this.bottomWall];
  }

  /**
   * Get the danger line Y position (absolute canvas coordinate)
   */
  getDangerLineY(): number {
    return GAME_CONFIG.DANGER_LINE_Y;
  }

  /**
   * Check if a position is above the danger line
   */
  isAboveDangerLine(y: number): boolean {
    return y < this.getDangerLineY();
  }

  /**
   * Get spawn area bounds (safe area to drop animals)
   */
  getSpawnBounds(): { minX: number; maxX: number; spawnY: number } {
    return {
      minX: GAME_CONFIG.WALL_THICKNESS + 30, // Add padding for animal radius
      maxX: GAME_CONFIG.CONTAINER_WIDTH - GAME_CONFIG.WALL_THICKNESS - 30,
      spawnY: 10 // Near top of container
    };
  }
}
