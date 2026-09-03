/**
 * Sister Sneak 3D - Isometric Top-Down Camera Controller
 * Smoothly tracks the player character with high-clarity top-down isometric perspective,
 * clear room visibility, and smooth floor transitions.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class IsometricCamera {
  constructor() {
    const aspect = window.innerWidth / window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 1000);
    this.camera.isIsometric = true;

    // Direct top-down isometric angle with optimal room framing
    this.offset = new THREE.Vector3(0, 19, 15);
    this.target = new THREE.Vector3(0, 0, 0);

    this.currentFloor = 1;
    this.floorHeights = [0, 8, 16];

    this.camera.position.set(0, 27, 15);
    this.camera.lookAt(this.target);
  }

  setFloor(floor) {
    this.currentFloor = Math.max(0, Math.min(2, floor));
  }

  update(dt, playerPosition = null) {
    const floorY = this.floorHeights[this.currentFloor] || 0;

    if (playerPosition) {
      const targetX = playerPosition.x || 0;
      const targetZ = playerPosition.z !== undefined ? playerPosition.z : 0;
      const targetY = floorY + 1.0;

      this.target.x = THREE.MathUtils.lerp(this.target.x, targetX, dt * 8);
      this.target.y = THREE.MathUtils.lerp(this.target.y, targetY, dt * 8);
      this.target.z = THREE.MathUtils.lerp(this.target.z, targetZ, dt * 8);

      const desiredPos = new THREE.Vector3(
        this.target.x + this.offset.x,
        this.target.y + this.offset.y,
        this.target.z + this.offset.z
      );

      this.camera.position.lerp(desiredPos, dt * 8);
      this.camera.lookAt(this.target);
    }
  }

  getThreeCamera() {
    return this.camera;
  }
}
