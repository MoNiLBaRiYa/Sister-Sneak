/**
 * Sister Sneak: Phone Locked - Camera & Viewport Controller
 * Keeps the mansion cross-section perfectly stable (Zero horizontal/vertical panning glitch).
 */

export class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.targetY = 0;
    this.zoom = 1.0;
    this.shakeDuration = 0;
    this.shakeIntensity = 0;
  }

  setFloor(floorIndex) {
    // Keep camera stable at center frame
    this.targetY = 0;
  }

  shake(duration = 0.3, intensity = 6) {
    this.shakeDuration = duration;
    this.shakeIntensity = intensity;
  }

  update(dt) {
    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
    }
  }

  apply(ctx) {
    ctx.save();
    let offsetX = 0;
    let offsetY = 0;

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
