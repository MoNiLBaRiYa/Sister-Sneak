/**
 * Sister Sneak 3D - Lighting & Shadows Engine
 * Manages Ambient Light, Directional Sunlight, Room Lamps, and 3D Blackout Spotlights.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class Lighting3D {
  constructor(scene) {
    this.scene = scene;
    this.roomLights = [];
    this.isBlackout = false;

    // 1. Warm Ambient Light
    this.ambientLight = new THREE.AmbientLight(0xffeedd, 0.65);
    this.scene.add(this.ambientLight);

    // 2. Main Sun / Skylight casting soft directional shadows
    this.sunLight = new THREE.DirectionalLight(0xfffaf0, 0.95);
    this.sunLight.position.set(25, 45, 20);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 150;
    this.sunLight.shadow.camera.left = -30;
    this.sunLight.shadow.camera.right = 30;
    this.sunLight.shadow.camera.top = 30;
    this.sunLight.shadow.camera.bottom = -30;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // 3. Player Flashlight Spotlight (Active during Blackouts)
    this.flashlight = new THREE.SpotLight(0xfff8e7, 0, 24, Math.PI / 4, 0.4, 1.2);
    this.flashlight.castShadow = true;
    this.flashlight.shadow.mapSize.width = 1024;
    this.flashlight.shadow.mapSize.height = 1024;
    this.flashlight.shadow.bias = -0.001;
    this.flashlightTarget = new THREE.Object3D();
    this.scene.add(this.flashlight);
    this.scene.add(this.flashlightTarget);
    this.flashlight.target = this.flashlightTarget;

    // 4. Subtle Fill Light (Cyan/Night tone)
    this.fillLight = new THREE.DirectionalLight(0x38bdf8, 0.25);
    this.fillLight.position.set(-20, 20, -20);
    this.scene.add(this.fillLight);
  }

  addRoomLight(x, y, z, color = 0xffe0a3, intensity = 1.2, distance = 12) {
    const pointLight = new THREE.PointLight(color, intensity, distance, 1.5);
    pointLight.position.set(x, y, z);
    pointLight.castShadow = false; // keep perf smooth
    this.scene.add(pointLight);
    this.roomLights.push(pointLight);
    return pointLight;
  }

  setBlackout(isBlackout) {
    this.isBlackout = isBlackout;
    if (isBlackout) {
      // Dim ambient and room lights down
      this.ambientLight.intensity = 0.08;
      this.sunLight.intensity = 0.05;
      this.roomLights.forEach(light => light.intensity = 0.05);
      this.flashlight.intensity = 3.5;
    } else {
      // Normal warm joint-family haveli lights
      this.ambientLight.intensity = 0.65;
      this.sunLight.intensity = 0.95;
      this.roomLights.forEach(light => light.intensity = 1.2);
      this.flashlight.intensity = 0;
    }
  }

  updateFlashlight(playerX, playerY, playerZ, facingAngle) {
    if (!this.isBlackout) return;

    this.flashlight.position.set(playerX, playerY + 1.6, playerZ);
    const targetDistance = 8;
    this.flashlightTarget.position.set(
      playerX + Math.cos(facingAngle) * targetDistance,
      playerY + 0.5,
      playerZ + Math.sin(facingAngle) * targetDistance
    );
  }
}
