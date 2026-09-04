/**
 * Sister Sneak 3D - Hero Stage 3D Viewport
 * Interactive 3D Landing Page Showcase with Rotating Character Podium,
 * dynamic stage lighting, and interactive character power particle bursts.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { SISTERS } from '../config/characters.js';
import { CharacterMeshBuilder } from '../entities3d/CharacterMeshBuilder.js';

export class HeroStage3D {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.currentSisterId = "RIDDHI";
    this.currentMesh = null;
    this.rotationSpeed = 0.012;
    this.animTime = 0;
    this.particles = [];

    this.initThree();
  }

  initThree() {
    if (!this.container) return;

    const width = this.container.clientWidth || 280;
    const height = this.container.clientHeight || 240;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.set(0, 1.6, 4.5);
    this.camera.lookAt(0, 1.1, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(3, 5, 4);
    this.scene.add(dirLight);

    const cyanRim = new THREE.PointLight(0x06b6d4, 2.5, 8);
    cyanRim.position.set(-2, 2.5, -2);
    this.scene.add(cyanRim);

    const goldSpot = new THREE.PointLight(0xf59e0b, 2.0, 8);
    goldSpot.position.set(2, 0.5, 2);
    this.scene.add(goldSpot);

    // Glowing Rotating Podium
    this.podiumGroup = new THREE.Group();

    const podiumGeo = new THREE.CylinderGeometry(1.2, 1.35, 0.25, 32);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.6
    });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.y = -0.125;
    this.podiumGroup.add(podium);

    // Neon Edge Ring
    const ringGeo = new THREE.TorusGeometry(1.22, 0.04, 16, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.01;
    this.podiumGroup.add(ring);
    this.ringMat = ringMat;

    this.scene.add(this.podiumGroup);

    // Load initial sister
    this.setSister("RIDDHI");

    // Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    // Resize Handler
    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || 280;
    const height = this.container.clientHeight || 240;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setSister(sisterId) {
    this.currentSisterId = sisterId;
    const config = SISTERS[sisterId] || SISTERS.RIDDHI;

    if (this.currentMesh) {
      this.scene.remove(this.currentMesh);
    }

    this.currentMesh = CharacterMeshBuilder.createSisterMesh(config);
    this.currentMesh.position.set(0, 0, 0);
    this.scene.add(this.currentMesh);

    // Update ring color to match sister signature color
    if (this.ringMat) {
      this.ringMat.color.set(config.color || "#06b6d4");
    }
  }

  triggerPowerBurst() {
    const config = SISTERS[this.currentSisterId] || SISTERS.RIDDHI;
    const color = new THREE.Color(config.color || "#F59E0B");

    // Spawn 25 glowing orbital burst particles
    for (let i = 0; i < 25; i++) {
      const geo = new THREE.SphereGeometry(0.06 + Math.random() * 0.04, 8, 8);
      const mat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 1.0
      });
      const p = new THREE.Mesh(geo, mat);
      p.position.set(0, 1.2, 0);
      const angle = (i / 25) * Math.PI * 2;
      const speed = 1.8 + Math.random() * 1.5;
      p.velocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        (Math.random() - 0.2) * 2.0,
        Math.sin(angle) * speed
      );
      p.life = 1.0;
      this.scene.add(p);
      this.particles.push(p);
    }
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.animTime += 0.03;

    // Rotate character and podium
    if (this.currentMesh) {
      this.currentMesh.rotation.y += this.rotationSpeed;

      // Gentle breathing idle bounce
      this.currentMesh.position.y = Math.sin(this.animTime * 2) * 0.04;

      // Articulated gentle arm sway
      if (this.currentMesh.leftArm) {
        this.currentMesh.leftArm.rotation.x = Math.sin(this.animTime * 2) * 0.2;
      }
      if (this.currentMesh.rightArm) {
        this.currentMesh.rightArm.rotation.x = -Math.sin(this.animTime * 2) * 0.2;
      }
    }

    if (this.podiumGroup) {
      this.podiumGroup.rotation.y += this.rotationSpeed * 0.5;
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.position.addScaledVector(p.velocity, 0.016);
      p.life -= 0.025;
      p.material.opacity = Math.max(0, p.life);
      p.scale.multiplyScalar(0.96);

      if (p.life <= 0) {
        this.scene.remove(p);
        this.particles.splice(i, 1);
      }
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
