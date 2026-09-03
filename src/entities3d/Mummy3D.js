/**
 * Sister Sneak 3D - 3D Inspector Mummy Entity
 * Features visible 3D FOV Vision Cone, Dynamic Household Anger Meter,
 * and Enraged Chase logic.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { CharacterMeshBuilder } from './CharacterMeshBuilder.js';

export class Mummy3D {
  constructor(config, scene) {
    this.config = config;
    this.scene = scene;

    this.mesh = CharacterMeshBuilder.createMummyMesh();
    this.scene.add(this.mesh);

    this.floor = 1;
    this.floorHeights = [0, 8, 16];

    this.x = 0;
    this.z = 0;
    this.y = this.floorHeights[this.floor];

    this.patrolSpeed = config.patrolSpeed || 2.0;
    this.facingAngle = 0;
    this.walkCycle = 0;

    // -------------------------------------------------------------
    // Visible 3D FOV Vision Cone (Projected from Mummy's Eyes)
    // -------------------------------------------------------------
    const coneLength = 8.5;
    const coneRadius = 3.5;
    const coneGeo = new THREE.ConeGeometry(coneRadius, coneLength, 24, 1, true);
    // Rotate cone to point forward along Z
    coneGeo.rotateX(-Math.PI / 2);
    coneGeo.translate(0, 0, coneLength / 2);

    this.fovMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a, // Warm Caution Yellow
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    this.fovCone = new THREE.Mesh(coneGeo, this.fovMat);
    this.fovCone.position.set(0, 1.6, 0); // At eye height
    this.mesh.add(this.fovCone);

    this.angerMeter = 0; // 0% to 100%
    this.isEnraged = false;
  }

  setFloor(floor) {
    this.floor = Math.max(0, Math.min(2, floor));
    this.y = this.floorHeights[this.floor];
    this.mesh.position.y = this.y;
  }

  updatePosition(x, z, floor) {
    this.x = x;
    this.z = z;
    this.floor = floor;
    this.y = this.floorHeights[this.floor] || 0;
    this.mesh.position.set(this.x, this.y, this.z);
  }

  update(dt, isMoving, facingDir, isAlarmed = false) {
    if (isMoving) {
      this.walkCycle += dt * 8;
      this.facingAngle = (facingDir === "left") ? -Math.PI / 2 : Math.PI / 2;
      this.mesh.rotation.y = this.facingAngle;

      const armAngle = Math.sin(this.walkCycle) * 0.5;
      if (this.mesh.leftArm) this.mesh.leftArm.rotation.x = armAngle;
      if (this.mesh.rightArm) this.mesh.rightArm.rotation.x = -armAngle;
      if (this.mesh.torso) this.mesh.torso.position.y = 1.05 + Math.abs(Math.sin(this.walkCycle)) * 0.06;
    } else {
      this.walkCycle += dt * 2;
      const breath = Math.sin(this.walkCycle) * 0.02;
      if (this.mesh.torso) this.mesh.torso.position.y = 1.05 + breath;
    }

    // Dynamic FOV Cone Color (Yellow -> Alert Red)
    if (isAlarmed || this.isEnraged) {
      this.fovMat.color.set(0xef4444); // Red Alarm
      this.fovMat.opacity = 0.45;
    } else {
      this.fovMat.color.set(0xfef08a); // Yellow Caution
      this.fovMat.opacity = 0.25;
    }
  }

  increaseAnger(amount) {
    this.angerMeter = Math.min(100, this.angerMeter + amount);
    if (this.angerMeter >= 100) {
      this.isEnraged = true;
    }
  }

  resetAnger() {
    this.angerMeter = 0;
    this.isEnraged = false;
  }

  destroy() {
    this.scene.remove(this.mesh);
  }
}
