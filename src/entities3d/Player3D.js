/**
 * Sister Sneak 3D - 3D Player Entity
 * Manages 360-degree free locomotion, smooth heading rotation,
 * rhythmic walk cycles (legs, arms, head bob), overhead name badges,
 * 3D objective waypoint compass arrow, and occlusion X-Ray silhouette.
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
    this.floorHeights = [0, 8, 16];

    this.x = 0;
    this.z = 0;
    this.y = this.floorHeights[this.floor];

    this.speed = config.speed || 3.5;
    this.walkCycle = 0;
    this.isMoving = false;
    this.facingAngle = 0;

    // 1. Prominent Ground Highlight Ring (Bright Cyan for Local Player)
    const ringGeo = new THREE.RingGeometry(0.75, 1.05, 32);
    this.groundRingMat = new THREE.MeshBasicMaterial({
      color: isLocalPlayer ? 0x00f0ff : new THREE.Color(config.color || 0xffffff),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: isLocalPlayer ? 0.95 : 0.45,
      depthTest: false
    });
    this.groundRing = new THREE.Mesh(ringGeo, this.groundRingMat);
    this.groundRing.rotation.x = -Math.PI / 2;
    this.groundRing.position.y = 0.05;
    this.groundRing.renderOrder = 998;
    this.mesh.add(this.groundRing);

    // 2. 3D Overhead Name Badge & Arrow
    const badgeText = isLocalPlayer ? `✨ YOU: ${config.name} ✨` : `👧 ${config.name}`;
    this.nameBadge = this.createNameTagSprite(badgeText, isLocalPlayer, config.color || "#FFF");
    this.mesh.add(this.nameBadge);

    // 3. 3D Waypoint Emergency Compass Arrow (Visible ONLY during Blackout / Blown Fuse / Emergency Sabotage)
    if (isLocalPlayer) {
      this.waypointPivot = new THREE.Group();
      this.waypointPivot.position.set(0, 0.2, 0);
      this.waypointPivot.visible = false; // Hidden during normal tasks

      // High-visibility Emergency Chevron Pointer
      const arrowGroup = new THREE.Group();
      arrowGroup.position.set(0, 0, 1.35);

      // Glowing Arrowhead Tip
      const coneGeo = new THREE.ConeGeometry(0.24, 0.55, 12);
      coneGeo.rotateX(Math.PI / 2);
      this.arrowMat = new THREE.MeshBasicMaterial({ color: 0xff1744, depthTest: false, transparent: true, opacity: 0.95 });
      const arrowCone = new THREE.Mesh(coneGeo, this.arrowMat);
      arrowCone.renderOrder = 999;
      arrowGroup.add(arrowCone);

      // Glowing Shaft
      const stemGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.38, 8);
      stemGeo.rotateX(Math.PI / 2);
      const arrowStem = new THREE.Mesh(stemGeo, this.arrowMat);
      arrowStem.position.set(0, 0, -0.38);
      arrowStem.renderOrder = 999;
      arrowGroup.add(arrowStem);

      this.waypointPivot.add(arrowGroup);
      this.mesh.add(this.waypointPivot);
    }

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

    // Subtle Marker Dot for Local Player
    if (isLocalPlayer) {
      ctx.fillStyle = '#06B6D4';
      ctx.beginPath();
      ctx.arc(150, 70, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(isLocalPlayer ? 2.8 : 2.2, isLocalPlayer ? 0.85 : 0.65, 1);
    sprite.position.y = 2.45;
    sprite.renderOrder = 999;
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

  updateWaypoint(target3DX, target3DZ, isEmergency = false, time = 0) {
    if (!this.waypointPivot) return;

    // ONLY display arrow during active emergencies (Blackout, Blown Fuse, Critical Sabotage)
    if (!isEmergency) {
      this.waypointPivot.visible = false;
      if (this.groundRingMat) {
        this.groundRingMat.color.set(0x00f0ff);
        this.groundRingMat.opacity = 0.35;
      }
      if (this.groundRing) this.groundRing.scale.set(1.0, 1.0, 1.0);
      return;
    }

    // Emergency Active: Show glowing red pulsating navigation beacon
    this.waypointPivot.visible = true;
    const dx = target3DX - this.x;
    const dz = target3DZ - this.z;
    const worldAngle = Math.atan2(dx, dz);
    this.waypointPivot.rotation.y = worldAngle - this.mesh.rotation.y;

    if (this.arrowMat) this.arrowMat.color.set(0xff1744);
    const pulse = 1.2 + Math.sin(time * 10) * 0.25;
    this.waypointPivot.scale.set(pulse, pulse, pulse);
    this.waypointPivot.position.y = 0.22 + Math.sin(time * 6) * 0.08;

    if (this.groundRingMat) {
      this.groundRingMat.color.set(0xff1744);
      this.groundRingMat.opacity = 0.8;
    }
    const ringPulse = 1.0 + Math.sin(time * 8) * 0.25;
    if (this.groundRing) this.groundRing.scale.set(ringPulse, ringPulse, 1.0);
  }

  update(dt, vx, vz, auraColor = null, isStealth = false) {
    const moveLen = Math.hypot(vx, vz);
    this.isMoving = moveLen > 0.05;

    // Natural Eye Blinking Animation
    if (this.mesh.eyes) {
      if (!this.blinkTimer) this.blinkTimer = 0;
      this.blinkTimer += dt;
      if (this.blinkTimer > 3.2) {
        this.mesh.eyes.scale.y = 0.1; // Blink closed
        if (this.blinkTimer > 3.32) {
          this.mesh.eyes.scale.y = 1.0; // Open
          this.blinkTimer = Math.random() * 0.8;
        }
      } else {
        this.mesh.eyes.scale.y = 1.0;
      }
    }

    if (this.isMoving) {
      this.walkCycle += dt * 10;
      // 360-degree rotation facing movement vector
      this.facingAngle = Math.atan2(vx, vz);
      this.mesh.rotation.y = this.facingAngle;

      // Animate Legs & Arms with heel-toe swing
      const legAngle = Math.sin(this.walkCycle) * 0.65;
      if (this.mesh.leftLeg) this.mesh.leftLeg.rotation.x = legAngle;
      if (this.mesh.rightLeg) this.mesh.rightLeg.rotation.x = -legAngle;
      if (this.mesh.leftArm) this.mesh.leftArm.rotation.x = -legAngle * 0.75;
      if (this.mesh.rightArm) this.mesh.rightArm.rotation.x = legAngle * 0.75;

      // Body Bobbing & Hip Sway
      if (this.mesh.torso) {
        this.mesh.torso.position.y = 0.95 + Math.abs(Math.sin(this.walkCycle)) * 0.08;
        this.mesh.torso.rotation.z = Math.sin(this.walkCycle) * 0.06;
      }
      if (this.mesh.head) {
        this.mesh.head.position.y = 1.65 + Math.abs(Math.sin(this.walkCycle)) * 0.08;
        this.mesh.head.rotation.z = -Math.sin(this.walkCycle) * 0.04;
      }

      // Secondary Motion on Hair Braids / Ponytails
      const hairSway = Math.sin(this.walkCycle) * 0.28;
      if (this.mesh.leftBraid) {
        this.mesh.leftBraid.rotation.z = -0.15 + hairSway;
        this.mesh.leftBraid.rotation.x = Math.abs(hairSway) * 0.4;
      }
      if (this.mesh.rightBraid) {
        this.mesh.rightBraid.rotation.z = 0.15 + hairSway;
        this.mesh.rightBraid.rotation.x = Math.abs(hairSway) * 0.4;
      }
      if (this.mesh.pony) {
        this.mesh.pony.rotation.x = -0.5 + Math.abs(Math.sin(this.walkCycle)) * 0.35;
        this.mesh.pony.rotation.z = hairSway * 0.6;
      }
    } else {
      // Idle Breathing & Subtle Rest
      this.walkCycle += dt * 2.5;
      const breath = Math.sin(this.walkCycle) * 0.03;
      if (this.mesh.torso) {
        this.mesh.torso.position.y = 0.95 + breath;
        this.mesh.torso.rotation.z = 0;
      }
      if (this.mesh.head) {
        this.mesh.head.position.y = 1.65 + breath;
        this.mesh.head.rotation.z = 0;
      }
      if (this.mesh.leftLeg) this.mesh.leftLeg.rotation.x = 0;
      if (this.mesh.rightLeg) this.mesh.rightLeg.rotation.x = 0;
      if (this.mesh.leftArm) this.mesh.leftArm.rotation.x = 0;
      if (this.mesh.rightArm) this.mesh.rightArm.rotation.x = 0;
      if (this.mesh.leftBraid) {
        this.mesh.leftBraid.rotation.set(0, 0, -0.15);
      }
      if (this.mesh.rightBraid) {
        this.mesh.rightBraid.rotation.set(0, 0, 0.15);
      }
      if (this.mesh.pony) {
        this.mesh.pony.rotation.set(-0.5 + breath * 2, 0, 0);
      }
    }

    // Ground Ring Pulsing
    if (this.isLocalPlayer) {
      const pulse = 0.9 + Math.sin(this.walkCycle * 2) * 0.12;
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
      if (child.isMesh && child !== this.groundRing && child !== this.waypointArrow) {
        child.material.transparent = true;
        child.material.opacity = isStealth ? 0.35 : 1.0;
      }
    });
  }

  destroy() {
    this.scene.remove(this.mesh);
  }
}
