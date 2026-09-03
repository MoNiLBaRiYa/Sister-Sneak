/**
 * Sister Sneak 3D - Haveli Mansion Environment & 3D Interactive Task Stations
 * Renders 3-floor architectural Haveli with terracotta tiles, marble courtyard,
 * animated bouncing 3D chore task markers, and dynamic floor culling.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class HaveliWorld3D {
  constructor(scene, lighting) {
    this.scene = scene;
    this.lighting = lighting;

    this.floorGroups = [];
    this.taskMarkers = [];
    this.activeFloor = 1;
    this.markerTime = 0;

    this.buildMansion();
    this.createTaskMarkers();
  }

  buildMansion() {
    // Materials
    const floor0Mat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2 }); // Ground Marble
    const floor1Mat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 }); // Terracotta
    const floor2Mat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 }); // Terrace Stone
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.6 });   // Warm Cream Walls
    const railingMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 }); // Carved Wood Railing

    const floorHeights = [0, 7.5, 15];
    const width = 28;
    const depth = 14;

    // Floor 0: Ground Floor (Entry Foyer, Kitchen, Store Room)
    const g0 = new THREE.Group();
    const slab0 = new THREE.Mesh(new THREE.BoxGeometry(width, 0.4, depth), floor0Mat);
    slab0.position.y = -0.2;
    slab0.receiveShadow = true;
    g0.add(slab0);

    // Back Wall
    const backWall0 = new THREE.Mesh(new THREE.BoxGeometry(width, 4.0, 0.4), wallMat);
    backWall0.position.set(0, 2.0, -depth / 2);
    backWall0.receiveShadow = true;
    g0.add(backWall0);

    // Room Partitions
    const wall0A = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.8, depth), wallMat);
    wall0A.position.set(-5, 1.9, 0);
    g0.add(wall0A);

    const wall0B = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.8, depth), wallMat);
    wall0B.position.set(5, 1.9, 0);
    g0.add(wall0B);

    // Kitchen Counter & Gas Stove
    const kitchenCounter = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.0, 1.4), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 }));
    kitchenCounter.position.set(-9, 0.5, -4.5);
    g0.add(kitchenCounter);

    // Heirloom Steel Phone Lock Box
    const steelBox = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.2), new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.2 }));
    steelBox.position.set(0, 0.6, -4.5);
    steelBox.castShadow = true;
    g0.add(steelBox);

    this.scene.add(g0);
    this.floorGroups.push(g0);

    // Floor 1: Middle Floor (Living Hall, Sisters' Bedroom, Study Room)
    const g1 = new THREE.Group();
    g1.position.y = floorHeights[1];

    const slab1 = new THREE.Mesh(new THREE.BoxGeometry(width, 0.4, depth), floor1Mat);
    slab1.position.y = -0.2;
    slab1.receiveShadow = true;
    g1.add(slab1);

    const backWall1 = new THREE.Mesh(new THREE.BoxGeometry(width, 4.0, 0.4), wallMat);
    backWall1.position.set(0, 2.0, -depth / 2);
    backWall1.receiveShadow = true;
    g1.add(backWall1);

    const wall1A = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.8, depth), wallMat);
    wall1A.position.set(-4.5, 1.9, 0);
    g1.add(wall1A);

    const wall1B = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.8, depth), wallMat);
    wall1B.position.set(4.5, 1.9, 0);
    g1.add(wall1B);

    // Bedroom Beds
    const bedGeo = new THREE.BoxGeometry(2.4, 0.6, 3.2);
    const bedMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.6 });
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.position.set(9, 0.3, -3.5);
    g1.add(bed);

    // Study Desk
    const deskGeo = new THREE.BoxGeometry(2.6, 0.8, 1.2);
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.5 });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(-8.5, 0.4, -4.5);
    g1.add(desk);

    // Railing
    const rail1 = new THREE.Mesh(new THREE.BoxGeometry(width, 0.8, 0.15), railingMat);
    rail1.position.set(0, 0.4, depth / 2);
    g1.add(rail1);

    this.scene.add(g1);
    this.floorGroups.push(g1);

    // Floor 2: Top Terrace (Clotheslines, Solar Inverter, Water Tank)
    const g2 = new THREE.Group();
    g2.position.y = floorHeights[2];

    const slab2 = new THREE.Mesh(new THREE.BoxGeometry(width, 0.4, depth), floor2Mat);
    slab2.position.y = -0.2;
    slab2.receiveShadow = true;
    g2.add(slab2);

    // Solar Panels
    const solarGeo = new THREE.BoxGeometry(4.5, 0.1, 2.5);
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.8, roughness: 0.2 });
    const solar = new THREE.Mesh(solarGeo, solarMat);
    solar.position.set(-8, 0.5, -3);
    solar.rotation.x = 0.2;
    g2.add(solar);

    // Water Tank
    const tankGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.2, 16);
    const tankMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.position.set(9, 1.1, -3.5);
    g2.add(tank);

    // Railing
    const rail2 = new THREE.Mesh(new THREE.BoxGeometry(width, 0.9, 0.15), railingMat);
    rail2.position.set(0, 0.45, depth / 2);
    g2.add(rail2);

    this.scene.add(g2);
    this.floorGroups.push(g2);
  }

  createTaskMarkers() {
    const floorHeights = [0, 7.5, 15];

    const markersData = [
      // Floor 0: Ground Floor Tasks
      { id: "TASK_CHAI", text: "☕ Make Chai", x: -9, z: -3.5, floor: 0, color: "#F59E0B" },
      { id: "TASK_ACHAR", text: "🏺 Achar Jars", x: -11, z: 2, floor: 0, color: "#EAB308" },
      { id: "TASK_RANGOLI", text: "🧹 Clean Rangoli", x: 3, z: 1, floor: 0, color: "#EC4899" },
      { id: "LOCKBOX", text: "📦 Phone Lock Box (Meeting)", x: 0, z: -3.5, floor: 0, color: "#06B6D4" },

      // Floor 1: Middle Floor Tasks
      { id: "TASK_MATH", text: "📚 Do Math Homework", x: -8.5, z: -3.5, floor: 1, color: "#3B82F6" },
      { id: "TASK_BED", text: "🛏️ Fold Bedsheet", x: 9, z: -2.5, floor: 1, color: "#F43F5E" },
      { id: "TASK_TULSI", text: "🌿 Water Tulsi", x: 10, z: 3, floor: 1, color: "#10B981" },
      { id: "TASK_FUSE_1", text: "⚡ Fix Fuse Box", x: -11, z: -4, floor: 1, color: "#EF4444" },

      // Floor 2: Top Terrace Tasks
      { id: "TASK_CLOTHES", text: "🧺 Fold Dry Clothes", x: 0, z: 0, floor: 2, color: "#8B5CF6" },
      { id: "TASK_SOLAR", text: "☀️ Clean Solar Panels", x: -8, z: -2, floor: 2, color: "#06B6D4" },
      { id: "TASK_FUSE_2", text: "⚡ Terrace Switchboard", x: 8, z: -4, floor: 2, color: "#EF4444" }
    ];

    markersData.forEach((data) => {
      const sprite = this.createFloatingMarkerSprite(data.text, data.color);
      const baseY = floorHeights[data.floor] + 2.2;
      sprite.position.set(data.x, baseY, data.z);
      this.scene.add(sprite);

      this.taskMarkers.push({
        sprite,
        baseY,
        floor: data.floor,
        id: data.id
      });
    });
  }

  createFloatingMarkerSprite(text, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 90;
    const ctx = canvas.getContext('2d');

    // Glowing background bubble
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 304, 56, 16);
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Text Label
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 160, 36);

    // Pointer Pin
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(150, 64);
    ctx.lineTo(170, 64);
    ctx.lineTo(160, 80);
    ctx.closePath();
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(3.0, 0.85, 1);
    return sprite;
  }

  setFloorVisibility(activeFloor) {
    this.activeFloor = activeFloor;

    // Floor culling: Only show floors up to current floor + 1 for seamless visibility
    this.floorGroups.forEach((group, floorIndex) => {
      group.visible = (floorIndex <= activeFloor);
    });

    // Task markers visibility
    this.taskMarkers.forEach((marker) => {
      marker.sprite.visible = (marker.floor === activeFloor);
    });
  }

  update(dt) {
    this.markerTime += dt;

    // Bouncing animation for floating task markers
    this.taskMarkers.forEach((m) => {
      if (m.sprite.visible) {
        m.sprite.position.y = m.baseY + Math.sin(this.markerTime * 3) * 0.22;
      }
    });
  }
}
