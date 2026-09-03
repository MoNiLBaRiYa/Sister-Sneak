/**
 * Sister Sneak 3D - Flying Chappal 3D Physics Projectile
 * When Mummy is Enraged (Anger Meter 100% or Catching Red-Handed),
 * she hurls a traditional Indian rubber slipper with a spinning parabolic physics arc!
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class FlyingChappal3D {
  constructor(scene) {
    this.scene = scene;
    this.isActive = false;

    // Create 3D Rubber Chappal Mesh (Sole + Strap)
    const chappalG = new THREE.Group();
    const soleGeo = new THREE.BoxGeometry(0.35, 0.06, 0.75);
    const soleMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.8 }); // Blue rubber sole
    const sole = new THREE.Mesh(soleGeo, soleMat);
    chappalG.add(sole);

    const strapGeo = new THREE.TorusGeometry(0.16, 0.03, 8, 12, Math.PI);
    const strapMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 }); // Yellow V-strap
    const strap = new THREE.Mesh(strapGeo, strapMat);
    strap.rotation.x = -Math.PI / 2;
    strap.position.set(0, 0.08, 0.1);
    chappalG.add(strap);

    this.mesh = chappalG;
    this.mesh.visible = false;
    this.scene.add(this.mesh);

    this.startPos = new THREE.Vector3();
    this.targetPos = new THREE.Vector3();
    this.currentPos = new THREE.Vector3();
    this.flightProgress = 0;
    this.flightDuration = 1.0; // 1s flight time
    this.arcHeight = 3.5;
  }

  throw(fromPos, toPos, onHitCallback = null) {
    this.startPos.copy(fromPos);
    this.startPos.y += 1.6; // from Mummy's hand
    this.targetPos.copy(toPos);
    this.targetPos.y += 1.0; // aim at sister's head
    this.onHit = onHitCallback;

    this.flightProgress = 0;
    this.isActive = true;
    this.mesh.visible = true;
    this.mesh.position.copy(this.startPos);
  }

  update(dt) {
    if (!this.isActive) return;

    this.flightProgress += dt / this.flightDuration;

    if (this.flightProgress >= 1.0) {
      // Reached Target: Hit!
      this.isActive = false;
      this.mesh.visible = false;
      if (this.onHit) {
        this.onHit();
      }
      return;
    }

    // Parabolic Interpolation
    const t = this.flightProgress;
    this.currentPos.lerpVectors(this.startPos, this.targetPos, t);
    this.currentPos.y += Math.sin(t * Math.PI) * this.arcHeight;

    this.mesh.position.copy(this.currentPos);

    // Dynamic Chappal Spin
    this.mesh.rotation.x += dt * 18;
    this.mesh.rotation.y += dt * 12;
  }

  destroy() {
    this.scene.remove(this.mesh);
  }
}
