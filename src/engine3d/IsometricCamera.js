/**
 * Sister Sneak 3D - Isometric Camera Controller
 * Smoothly tracks the player character with close, comfortable framing,
 * smooth damping, and floor elevation transitions.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class IsometricCamera {
  constructor() {
    const aspect = window.innerWidth / window.innerHeight;

    // Tight, focused Perspective Camera for clear character & chore visibility
    this.camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 1000);
    this.camera.isIsometric = true;

    // Comfortable close offset
    this.offset = new THREE.Vector3(12, 14, 12);
    this.target = new THREE.Vector3(0, 0, 0);

    this.currentFloor = 1;
    this.floorHeights = [0, 7.5, 15];

    this.camera.position.set(12, 21.5, 12);
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
      const targetY = floorY + 1.2;

      this.target.x = THREE.MathUtils.lerp(this.target.x, targetX, dt * 7);
      this.target.y = THREE.MathUtils.lerp(this.target.y, targetY, dt * 7);
      this.target.z = THREE.MathUtils.lerp(this.target.z, targetZ, dt * 7);

      const desiredPos = new THREE.Vector3(
        this.target.x + this.offset.x,
        this.target.y + this.offset.y,
        this.target.z + this.offset.z
      );

      this.camera.position.lerp(desiredPos, dt * 7);
      this.camera.lookAt(this.target);
    }
  }

  getThreeCamera() {
    return this.camera;
  }
}
