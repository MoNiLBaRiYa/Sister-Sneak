/**
 * Sister Sneak: Phone Locked - Camera & Viewport Controller
 * Provides smooth floor scrolling, cutaway zoom, and screen shake for sabotages.
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT, FLOOR_Y } from '../config/constants.js';

export class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.targetY = 0;
    this.zoom = 1.0;
    this.targetZoom = 1.0;

    this.shakeDuration = 0;
    this.shakeIntensity = 0;
  }

  setFloor(floorIndex) {
    // Center camera smoothly on the floor's vertical region
    const targetFloorY = FLOOR_Y[floorIndex];
    this.targetY = -(targetFloorY - (CANVAS_HEIGHT / 2 - 100));
  }

  shake(duration = 0.4, intensity = 8) {
    this.shakeDuration = duration;
    this.shakeIntensity = intensity;
  }

  update(dt) {
    // Smooth Lerp
    this.y += (this.targetY - this.y) * Math.min(1, dt * 6);
    this.zoom += (this.targetZoom - this.zoom) * Math.min(1, dt * 6);

    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
    }
  }

  apply(ctx) {
    ctx.save();
    let offsetX = 0;
    let offsetY = this.y;

    if (this.shakeDuration > 0) {
      offsetX += (Math.random() - 0.5) * this.shakeIntensity;
      offsetY += (Math.random() - 0.5) * this.shakeIntensity;
    }

    ctx.translate(offsetX, offsetY);
  }

  restore(ctx) {
    ctx.restore();
  }
}
