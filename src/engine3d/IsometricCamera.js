/**
 * Sister Sneak 3D - Isometric Camera Controller
 * Smoothly tracks the player character with damping, floor elevation lerping, and isometric tilt.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class IsometricCamera {
  constructor() {
    const aspect = window.innerWidth / window.innerHeight;
    this.viewSize = 16;

    // Create Angled Perspective Camera for rich 3D depth with isometric look
    this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 1000);
    this.camera.isIsometric = true;

    // Isometric Angle Offsets
    this.offset = new THREE.Vector3(18, 22, 18);
    this.target = new THREE.Vector3(0, 0, 0);
    this.currentPosition = new THREE.Vector3(18, 22, 18);

    this.currentFloor = 1;
    this.floorHeights = [0, 8, 16]; // Floor 0 (Ground), Floor 1 (Middle), Floor 2 (Terrace)

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.target);
  }

  setFloor(floor) {
    this.currentFloor = Math.max(0, Math.min(2, floor));
  }

  update(dt, playerPosition = null) {
    const floorY = this.floorHeights[this.currentFloor] || 0;

    if (playerPosition) {
      // Lerp target position towards player (with floor height offset)
      const targetX = playerPosition.x || 0;
      const targetZ = playerPosition.z !== undefined ? playerPosition.z : (playerPosition.y || 0);
      const targetY = floorY + 1.2;

      this.target.x = THREE.MathUtils.lerp(this.target.x, targetX, dt * 6);
      this.target.y = THREE.MathUtils.lerp(this.target.y, targetY, dt * 6);
      this.target.z = THREE.MathUtils.lerp(this.target.z, targetZ, dt * 6);

      // Desired camera position
      const desiredPos = new THREE.Vector3(
        this.target.x + this.offset.x,
        this.target.y + this.offset.y,
        this.target.z + this.offset.z
      );

      this.camera.position.lerp(desiredPos, dt * 6);
      this.camera.lookAt(this.target);
    }
  }

  getThreeCamera() {
    return this.camera;
  }
}
