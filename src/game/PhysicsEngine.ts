import Matter from 'matter-js';
import { GAME_CONFIG } from '../utils/constants';
import { CustomRenderer } from './CustomRenderer';

/**
 * Physics engine wrapper around Matter.js
 * Handles initialization, update loop, and rendering
 */
export class PhysicsEngine {
  private engine: Matter.Engine;
  private render: Matter.Render;
  private world: Matter.World;
  private runner: Matter.Runner;
  private canvas: HTMLCanvasElement;
  private customRenderer: CustomRenderer;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // Create Matter.js engine with improved solver settings
    this.engine = Matter.Engine.create({
      gravity: {
        x: 0,
        y: GAME_CONFIG.GRAVITY,
        scale: 0.001
      },
      // Increase constraint iterations for better collision resolution in tight spaces
      constraintIterations: 4,
      positionIterations: 10,
      velocityIterations: 8
    });

    this.world = this.engine.world;

    // Create renderer with high DPI support
    this.render = Matter.Render.create({
      canvas: this.canvas,
      engine: this.engine,
      options: {
        width: GAME_CONFIG.CONTAINER_WIDTH,
        height: GAME_CONFIG.CONTAINER_HEIGHT,
        wireframes: false,
        background: '#FFF8F0', // Warm cream background
        pixelRatio: window.devicePixelRatio || 1 // Fix pixelation on Retina displays
      }
    });

    // Create runner for 60fps updates
    this.runner = Matter.Runner.create({
      delta: 1000 / GAME_CONFIG.FPS,
      isFixed: true
    });

    // Create custom renderer for sprites
    this.customRenderer = new CustomRenderer(this.canvas, this.engine);

    // Hook into Matter.js render loop to draw sprites on top
    Matter.Events.on(this.render, 'afterRender', () => {
      this.customRenderer.render();
    });

    // Clamp velocities after each update to prevent floating/explosion issues
    Matter.Events.on(this.engine, 'afterUpdate', () => {
      this.clampVelocities();
    });
  }

  /**
   * Clamp body velocities to prevent physics glitches
   * Particularly important when bodies are squeezed together
   */
  private clampVelocities(): void {
    const maxUpwardVelocity = -8; // Max upward velocity (negative Y is up)
    const maxHorizontalVelocity = 15;

    const bodies = Matter.Composite.allBodies(this.world);
    for (const body of bodies) {
      if (body.isStatic) continue;

      let vx = body.velocity.x;
      let vy = body.velocity.y;
      let clamped = false;

      // Clamp extreme upward velocity (the main issue)
      if (vy < maxUpwardVelocity) {
        vy = maxUpwardVelocity;
        clamped = true;
      }

      // Clamp horizontal velocity too
      if (Math.abs(vx) > maxHorizontalVelocity) {
        vx = Math.sign(vx) * maxHorizontalVelocity;
        clamped = true;
      }

      if (clamped) {
        Matter.Body.setVelocity(body, { x: vx, y: vy });
      }
    }
  }

  /**
   * Start the physics engine and renderer
   */
  start(): void {
    Matter.Render.run(this.render);
    Matter.Runner.run(this.runner, this.engine);
  }

  /**
   * Stop the physics engine and renderer
   */
  stop(): void {
    Matter.Render.stop(this.render);
    Matter.Runner.stop(this.runner);
  }

  /**
   * Add a body to the physics world
   */
  addBody(body: Matter.Body): void {
    Matter.World.add(this.world, body);
  }

  /**
   * Remove a body from the physics world
   */
  removeBody(body: Matter.Body): void {
    Matter.World.remove(this.world, body);
  }

  /**
   * Get the physics world
   */
  getWorld(): Matter.World {
    return this.world;
  }

  /**
   * Get the engine
   */
  getEngine(): Matter.Engine {
    return this.engine;
  }

  /**
   * Clear all bodies except static ones (walls)
   */
  clearDynamicBodies(): void {
    const bodies = Matter.Composite.allBodies(this.world);
    bodies.forEach(body => {
      if (!body.isStatic) {
        Matter.World.remove(this.world, body);
      }
    });
  }

  /**
   * Manual update step (if not using runner)
   */
  update(deltaTime: number): void {
    Matter.Engine.update(this.engine, deltaTime);
  }

  /**
   * Get the custom renderer
   */
  getCustomRenderer(): CustomRenderer {
    return this.customRenderer;
  }
}
