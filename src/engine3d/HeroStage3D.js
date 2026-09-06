/**
 * Sister Sneak 3D - Hero Stage 3D Viewport
 * Interactive 3D Landing Page Showcase with Rotating Character Podium,
 * dynamic stage lighting, drag-to-rotate controls, eye blinking, and dual power particle bursts.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { SISTERS } from '../config/characters.js';
import { CharacterMeshBuilder } from '../entities3d/CharacterMeshBuilder.js';

export class HeroStage3D {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.currentSisterId = "RIDDHI";
    this.currentMesh = null;
    this.animTime = 0;
    this.particles = [];
    this.userRotationY = 0;
    this.isDragging = false;
    this.prevPointerX = 0;

    this.initThree();
  }

  initThree() {
    if (!this.container) return;

    const width = this.container.clientWidth || 320;
    const height = this.container.clientHeight || 240;

    // Scene
    this.scene = new THREE.Scene();

    // Camera (Centered nicely on the chibi character)
    this.camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    this.camera.position.set(0, 1.45, 3.8);
    this.camera.lookAt(0, 1.05, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // Studio 3-Point Lights
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.5);
    this.scene.add(ambientLight);

    // Front-Right Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(2.5, 3.5, 3.5);
    keyLight.castShadow = true;
    this.scene.add(keyLight);

    // Front-Left Soft Fill Light
    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.0);
    fillLight.position.set(-2.5, 2.0, 2.5);
    this.scene.add(fillLight);

    // Back Rim / Hair Highlights
    const backRim = new THREE.PointLight(0x38bdf8, 2.8, 8);
    backRim.position.set(0, 3.0, -2.5);
    this.scene.add(backRim);

    // Glowing Warm Ground Spotlight
    const goldSpot = new THREE.PointLight(0xf59e0b, 2.2, 7);
    goldSpot.position.set(1.5, 0.4, 1.5);
    this.scene.add(goldSpot);

    // Glowing Rotating Podium
    this.podiumGroup = new THREE.Group();

    const podiumGeo = new THREE.CylinderGeometry(1.2, 1.35, 0.22, 32);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.25,
      metalness: 0.7
    });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.y = -0.11;
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

    // Interactive Drag-to-Rotate
    this.bindInteraction();

    // Load initial sister
    this.setSister("RIDDHI");

    // Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    // Resize Handler
    window.addEventListener('resize', () => this.onResize());
    if (window.ResizeObserver && this.container) {
      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(this.container);
    }
  }

  bindInteraction() {
    const el = this.renderer.domElement;
    el.style.cursor = 'grab';

    const onPointerDown = (e) => {
      this.isDragging = true;
      this.prevPointerX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      el.style.cursor = 'grabbing';
    };

    const onPointerMove = (e) => {
      if (!this.isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const deltaX = clientX - this.prevPointerX;
      this.prevPointerX = clientX;
      this.userRotationY += deltaX * 0.015;
    };

    const onPointerUp = () => {
      this.isDragging = false;
      el.style.cursor = 'grab';
    };

    el.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    el.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || 320;
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

  triggerPowerBurst(mode = "innocent") {
    const config = SISTERS[this.currentSisterId] || SISTERS.RIDDHI;
    const isPrankster = (mode === "prankster");
    const color = isPrankster ? new THREE.Color("#EF4444") : new THREE.Color(config.color || "#10B981");

    // Spawn 40 glowing orbital burst particles
    for (let i = 0; i < 40; i++) {
      const geo = new THREE.SphereGeometry(0.06 + Math.random() * 0.05, 8, 8);
      const mat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 1.0
      });
      const p = new THREE.Mesh(geo, mat);
      p.position.set(0, 1.2, 0);
      const angle = (i / 40) * Math.PI * 2;
      const speed = (isPrankster ? 2.6 : 1.9) + Math.random() * 1.5;
      p.velocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        (Math.random() - 0.2) * (isPrankster ? 3.0 : 2.0),
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

    if (this.currentMesh) {
      // If user is not dragging, do a soft, charming showcase front sway
      if (!this.isDragging) {
        const autoSway = Math.sin(this.animTime * 0.9) * 0.35;
        this.currentMesh.rotation.y = this.userRotationY + autoSway;
      } else {
        this.currentMesh.rotation.y = this.userRotationY;
      }

      // Gentle breathing idle bounce
      this.currentMesh.position.y = Math.sin(this.animTime * 2.2) * 0.035;

      // Natural Eye Blinking on Hero Stage
      if (this.currentMesh.eyes) {
        const blinkCycle = this.animTime % 3.6;
        if (blinkCycle > 3.42) {
          this.currentMesh.eyes.scale.y = 0.1; // Closed
        } else {
          this.currentMesh.eyes.scale.y = 1.0; // Open
        }
      }

      // Articulated gentle arm sway
      if (this.currentMesh.leftArm) {
        this.currentMesh.leftArm.rotation.x = Math.sin(this.animTime * 2.2) * 0.15;
      }
      if (this.currentMesh.rightArm) {
        this.currentMesh.rightArm.rotation.x = -Math.sin(this.animTime * 2.2) * 0.15;
      }

      // Secondary motion on braids/ponytails
      const hairSway = Math.sin(this.animTime * 2.2) * 0.12;
      if (this.currentMesh.leftBraid) this.currentMesh.leftBraid.rotation.z = -0.1 + hairSway;
      if (this.currentMesh.rightBraid) this.currentMesh.rightBraid.rotation.z = 0.1 + hairSway;
      if (this.currentMesh.pony) this.currentMesh.pony.rotation.z = hairSway * 1.5;
    }

    if (this.podiumGroup) {
      this.podiumGroup.rotation.y += 0.005;
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.position.addScaledVector(p.velocity, 0.016);
      p.life -= 0.022;
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

