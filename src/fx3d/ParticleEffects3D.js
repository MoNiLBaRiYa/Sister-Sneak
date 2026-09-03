/**
 * Sister Sneak 3D - 3D Particle Effects & Trap Systems
 * Manages 3D Sleep Fog volumes, 3D Sticky Gum floor snares, 3D Paint splatters,
 * Orbiting Golden Stars, and EMP Lightning Arcs.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class ParticleEffects3D {
  constructor(scene) {
    this.scene = scene;
    this.gumTraps = [];
    this.activeSleepClouds = [];
    this.orbitingHalos = [];
  }

  // 1. 🌸 Riddhi Sleep Cloud Fog (Prankster 3D Volumetric Mist)
  spawnSleepCloud(x, y, z, duration = 8.0) {
    const particleCount = 60;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = 0.3 + Math.random() * 1.8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xc084fc, // Lavender Purple
      size: 1.4,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const cloud = new THREE.Points(geometry, material);
    cloud.position.set(x, y, z);
    this.scene.add(cloud);

    this.activeSleepClouds.push({ cloud, timer: duration });
  }

  // 2. 🎒 Jahanvi Sticky Bubblegum Snare (Prankster 3D Floor Mesh)
  spawnStickyGumTrap(x, y, z, duration = 12.0) {
    const gumGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.08, 16);
    const gumMat = new THREE.MeshStandardMaterial({
      color: 0xec4899, // Hot Pink Gum
      roughness: 0.2,
      metalness: 0.1
    });

    const gumMesh = new THREE.Mesh(gumGeo, gumMat);
    gumMesh.position.set(x, y + 0.04, z);
    gumMesh.receiveShadow = true;
    this.scene.add(gumMesh);

    this.gumTraps.push({ mesh: gumMesh, timer: duration, x, y, z, radius: 1.6 });
  }

  checkTrapTrigger(x, y, z) {
    for (let i = this.gumTraps.length - 1; i >= 0; i--) {
      const trap = this.gumTraps[i];
      if (Math.abs(trap.y - y) < 2.0) {
        const dist = Math.hypot(trap.x - x, trap.z - z);
        if (dist < trap.radius) {
          this.scene.remove(trap.mesh);
          this.gumTraps.splice(i, 1);
          return true;
        }
      }
    }
    return false;
  }

  // 3. 📚 Jisha Mummy's Ladli Halo (Innocent 3D Orbiting Stars)
  createLadliHalo(parentMesh) {
    const haloG = new THREE.Group();
    const starCount = 6;

    for (let i = 0; i < starCount; i++) {
      const starGeo = new THREE.OctahedronGeometry(0.12);
      const starMat = new THREE.MeshStandardMaterial({
        color: 0xfde047,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.8
      });
      const star = new THREE.Mesh(starGeo, starMat);
      const angle = (i / starCount) * Math.PI * 2;
      star.position.set(Math.cos(angle) * 0.7, 0, Math.sin(angle) * 0.7);
      haloG.add(star);
    }

    haloG.position.y = 2.2;
    parentMesh.add(haloG);
    this.orbitingHalos.push(haloG);
    return haloG;
  }

  update(dt) {
    // 1. Update Sleep Clouds
    for (let i = this.activeSleepClouds.length - 1; i >= 0; i--) {
      const item = this.activeSleepClouds[i];
      item.timer -= dt;
      item.cloud.rotation.y += dt * 0.2;
      if (item.timer <= 0) {
        this.scene.remove(item.cloud);
        this.activeSleepClouds.splice(i, 1);
      }
    }

    // 2. Update Sticky Gum Traps
    for (let i = this.gumTraps.length - 1; i >= 0; i--) {
      const trap = this.gumTraps[i];
      trap.timer -= dt;
      if (trap.timer <= 0) {
        this.scene.remove(trap.mesh);
        this.gumTraps.splice(i, 1);
      }
    }

    // 3. Rotate Orbiting Ladli Halos
    this.orbitingHalos.forEach((halo) => {
      halo.rotation.y += dt * 3.5;
    });
  }
}
