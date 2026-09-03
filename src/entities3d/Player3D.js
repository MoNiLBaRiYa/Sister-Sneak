/**
 * Sister Sneak 3D - 3D Player Entity
 * Manages 3D positioning, smooth rotation, procedural walk animations,
 * clear "YOU" indicator badge with pulsating arrow, and visual power auras.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { CharacterMeshBuilder } from './CharacterMeshBuilder.js';

export class Player3D {
  constructor(config, scene, isLocalPlayer = false) {
    this.config = config;
    this.scene = scene;
    this.isLocalPlayer = isLocalPlayer;

    this.mesh = CharacterMeshBuilder.createSisterMesh(config);
    this.scene.add(this.mesh);

    this.floor = config.floor || 1;
    this.floorHeights = [0, 7.5, 15];

    this.x = 0;
    this.z = 0;
    this.y = this.floorHeights[this.floor];

    this.speed = config.speed || 3.5;
    this.walkCycle = 0;
    this.isMoving = false;
    this.facingAngle = 0;

    // 1. Prominent Ground Highlight Ring (Bright Cyan for Local Player)
    const ringGeo = new THREE.RingGeometry(0.7, 0.9, 32);
    this.groundRingMat = new THREE.MeshBasicMaterial({
      color: isLocalPlayer ? 0x00f0ff : new THREE.Color(config.color || 0xffffff),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: isLocalPlayer ? 0.95 : 0.4
    });
    this.groundRing = new THREE.Mesh(ringGeo, this.groundRingMat);
    this.groundRing.rotation.x = -Math.PI / 2;
    this.groundRing.position.y = 0.04;
    this.mesh.add(this.groundRing);

    // 2. 3D Overhead Name Badge & Arrow
    const badgeText = isLocalPlayer ? `✨ YOU: ${config.name} ✨` : `👧 ${config.name}`;
    this.nameBadge = this.createNameTagSprite(badgeText, isLocalPlayer, config.color || "#FFF");
    this.mesh.add(this.nameBadge);

    this.updatePosition(0, 0, this.floor);
  }

  createNameTagSprite(text, isLocalPlayer, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 90;
    const ctx = canvas.getContext('2d');

    // Background pill
    ctx.fillStyle = isLocalPlayer ? 'rgba(6, 182, 212, 0.95)' : 'rgba(15, 23, 42, 0.88)';
    ctx.beginPath();
    ctx.roundRect(10, 10, 280, 50, 14);
    ctx.fill();

    ctx.strokeStyle = isLocalPlayer ? '#FFFFFF' : '#475569';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Text
    ctx.font = isLocalPlayer ? 'bold 23px sans-serif' : 'bold 20px sans-serif';
    ctx.fillStyle = isLocalPlayer ? '#0F172A' : '#F8FAFC';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 150, 35);

    // Down Arrow for Local Player
    if (isLocalPlayer) {
      ctx.fillStyle = '#06B6D4';
      ctx.beginPath();
      ctx.moveTo(138, 62);
      ctx.lineTo(162, 62);
      ctx.lineTo(150, 80);
      ctx.closePath();
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(isLocalPlayer ? 2.8 : 2.2, isLocalPlayer ? 0.85 : 0.65, 1);
    sprite.position.y = 2.45;
    return sprite;
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

    // Ground Ring Pulsing
    if (this.isLocalPlayer) {
      const pulse = 0.85 + Math.sin(this.walkCycle * 2) * 0.15;
      this.groundRing.scale.set(pulse, pulse, pulse);
    }

    // Aura Color
    if (auraColor) {
      this.groundRingMat.color.set(auraColor);
      this.groundRingMat.opacity = 0.95;
    } else if (this.isLocalPlayer) {
      this.groundRingMat.color.set(0x00f0ff);
      this.groundRingMat.opacity = 0.9;
    }

    // Stealth Transparency
    this.mesh.traverse((child) => {
      if (child.isMesh && child !== this.groundRing) {
        child.material.transparent = true;
        child.material.opacity = isStealth ? 0.35 : 1.0;
      }
    });
  }

  destroy() {
    this.scene.remove(this.mesh);
  }
}
