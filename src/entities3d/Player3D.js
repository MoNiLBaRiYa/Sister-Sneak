/**
 * Sister Sneak 3D - 3D Player Entity
 * Manages 3D positioning, smooth rotation, procedural walk animations, and visual power meshes.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { CharacterMeshBuilder } from './CharacterMeshBuilder.js';

export class Player3D {
  constructor(config, scene) {
    this.config = config;
    this.scene = scene;

    this.mesh = CharacterMeshBuilder.createSisterMesh(config);
    this.scene.add(this.mesh);

    this.floor = config.floor || 1;
    this.floorHeights = [0, 8, 16];

    this.x = 0;
    this.z = 0;
    this.y = this.floorHeights[this.floor];

    this.speed = config.speed || 3.5;
    this.walkCycle = 0;
    this.isMoving = false;
    this.facingAngle = 0;

    // Visual Power Aura Ring
    const ringGeo = new THREE.RingGeometry(0.8, 0.95, 32);
    this.auraMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0 });
    this.auraRing = new THREE.Mesh(ringGeo, this.auraMat);
    this.auraRing.rotation.x = -Math.PI / 2;
    this.auraRing.position.y = 0.05;
    this.mesh.add(this.auraRing);

    this.updatePosition(0, 0, this.floor);
  }

  setFloor(floor, targetX = null) {
    this.floor = Math.max(0, Math.min(2, floor));
    this.y = this.floorHeights[this.floor];
    if (targetX !== null) this.x = targetX;
    this.updatePosition(this.x, this.z, this.floor);
  }

  updatePosition(x, z, floor) {
    this.x = x;
    this.z = z;
    this.floor = floor;
    this.y = this.floorHeights[this.floor] || 0;
    this.mesh.position.set(this.x, this.y, this.z);
  }

  update(dt, vx, vz, auraColor = null, isStealth = false) {
    const moveLen = Math.hypot(vx, vz);
    this.isMoving = moveLen > 0.05;

    if (this.isMoving) {
      this.walkCycle += dt * 10;
      this.facingAngle = Math.atan2(vz, vx);
      this.mesh.rotation.y = -this.facingAngle + Math.PI / 2;

      // Animate Legs & Arms
      const legAngle = Math.sin(this.walkCycle) * 0.6;
      if (this.mesh.leftLeg) this.mesh.leftLeg.rotation.x = legAngle;
      if (this.mesh.rightLeg) this.mesh.rightLeg.rotation.x = -legAngle;
      if (this.mesh.leftArm) this.mesh.leftArm.rotation.x = -legAngle * 0.7;
      if (this.mesh.rightArm) this.mesh.rightArm.rotation.x = legAngle * 0.7;

      // Body Bobbing
      if (this.mesh.torso) this.mesh.torso.position.y = 0.95 + Math.abs(Math.sin(this.walkCycle)) * 0.08;
      if (this.mesh.head) this.mesh.head.position.y = 1.65 + Math.abs(Math.sin(this.walkCycle)) * 0.08;
    } else {
      // Idle Breathing
      this.walkCycle += dt * 2.5;
      const breath = Math.sin(this.walkCycle) * 0.03;
      if (this.mesh.torso) this.mesh.torso.position.y = 0.95 + breath;
      if (this.mesh.head) this.mesh.head.position.y = 1.65 + breath;
      if (this.mesh.leftLeg) this.mesh.leftLeg.rotation.x = 0;
      if (this.mesh.rightLeg) this.mesh.rightLeg.rotation.x = 0;
      if (this.mesh.leftArm) this.mesh.leftArm.rotation.x = 0;
      if (this.mesh.rightArm) this.mesh.rightArm.rotation.x = 0;
    }

    // Aura update
    if (auraColor) {
      this.auraMat.opacity = 0.85;
      this.auraMat.color.set(auraColor);
      this.auraRing.rotation.z += dt * 3;
    } else {
      this.auraMat.opacity = 0;
    }

    // Stealth Transparency
    this.mesh.traverse((child) => {
      if (child.isMesh && child !== this.auraRing) {
        child.material.transparent = true;
        child.material.opacity = isStealth ? 0.35 : 1.0;
      }
    });
  }

  destroy() {
    this.scene.remove(this.mesh);
  }
}
