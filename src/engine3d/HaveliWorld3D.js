/**
 * Sister Sneak 3D - Haveli Mansion 3D Isometric Environment
 * Renders a rich, detailed 3-Floor Indian Joint-Family Haveli with real depth,
 * marble courtyard, kitchen counters, sofas, study desks, beds, potted plants,
 * drying clotheslines, and 3D floating chore stations.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class HaveliWorld3D {
  constructor(scene, lighting) {
    this.scene = scene;
    this.lighting = lighting;

    this.floorGroups = [];
    this.taskMarkers = [];
    this.clotheslines = [];
    this.activeFloor = 1;
    this.markerTime = 0;

    this.buildHaveli();
    this.createTaskMarkers();
  }

  buildHaveli() {
    const floorHeights = [0, 8, 16];
    const width = 30;
    const depth = 14;

    // Rich Materials
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.15, metalness: 0.05 });
    const terracottaMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.65 });
    const terraceStoneMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
    const wallPlasterMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.55 });
    const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.5 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.7 });
    const graniteMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
    const fabricPinkMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.8 });
    const fabricBlueMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.8 });
    const fabricYellowMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.8 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85, roughness: 0.2 });

    // =========================================================================
    // FLOOR 0: GROUND FLOOR (Entry Foyer, Marble Courtyard, Kitchen, Store)
    // =========================================================================
    const g0 = new THREE.Group();

    // Floor Base
    const slab0 = new THREE.Mesh(new THREE.BoxGeometry(width, 0.4, depth), marbleMat);
    slab0.position.y = -0.2;
    slab0.receiveShadow = true;
    g0.add(slab0);

    // High Back Wall with Decorative Archways
    const backWall0 = new THREE.Mesh(new THREE.BoxGeometry(width, 4.2, 0.4), wallPlasterMat);
    backWall0.position.set(0, 2.1, -depth / 2);
    backWall0.receiveShadow = true;
    g0.add(backWall0);

    // Left & Right Side Walls
    const leftWall0 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.2, depth), wallPlasterMat);
    leftWall0.position.set(-width / 2, 2.1, 0);
    g0.add(leftWall0);

    const rightWall0 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.2, depth), wallPlasterMat);
    rightWall0.position.set(width / 2, 2.1, 0);
    g0.add(rightWall0);

    // Low Half-Dividers (Never obstruct camera)
    const div0L = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.4, depth * 0.75), wallPlasterMat);
    div0L.position.set(-5.5, 0.7, -1);
    g0.add(div0L);

    const div0R = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.4, depth * 0.75), wallPlasterMat);
    div0R.position.set(5.5, 0.7, -1);
    g0.add(div0R);

    // Central Colorful Rangoli Mesh on Floor
    const rangoliGeo = new THREE.CircleGeometry(2.4, 32);
    const rangoliMat = new THREE.MeshBasicMaterial({ color: 0xec4899, side: THREE.DoubleSide });
    const rangoli = new THREE.Mesh(rangoliGeo, rangoliMat);
    rangoli.rotation.x = -Math.PI / 2;
    rangoli.position.set(0, 0.02, 0);
    g0.add(rangoli);

    const rangoliInner = new THREE.Mesh(new THREE.CircleGeometry(1.2, 32), new THREE.MeshBasicMaterial({ color: 0xfde047 }));
    rangoliInner.rotation.x = -Math.PI / 2;
    rangoliInner.position.set(0, 0.03, 0);
    g0.add(rangoliInner);

    // Central Table & Heirloom Steel Phone Lock Box
    const tableGeo = new THREE.BoxGeometry(2.4, 0.8, 1.8);
    const centerTable = new THREE.Mesh(tableGeo, darkWoodMat);
    centerTable.position.set(0, 0.4, -4.2);
    centerTable.castShadow = true;
    g0.add(centerTable);

    const lockBoxGeo = new THREE.BoxGeometry(1.4, 0.9, 1.1);
    const lockBox = new THREE.Mesh(lockBoxGeo, steelMat);
    lockBox.position.set(0, 1.25, -4.2);
    lockBox.castShadow = true;
    g0.add(lockBox);

    const goldHasp = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.2), goldMat);
    goldHasp.position.set(0, 1.25, -3.6);
    g0.add(goldHasp);

    // Kitchen Station (Left Room)
    const counterL = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.0, 1.8), graniteMat);
    counterL.position.set(-10.5, 0.5, -4.2);
    counterL.castShadow = true;
    g0.add(counterL);

    // Gas Stove & Chai Pot
    const stove = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 1.0), steelMat);
    stove.position.set(-10.5, 1.08, -4.2);
    g0.add(stove);

    const chaiPot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 0.45, 12), goldMat);
    chaiPot.position.set(-10.5, 1.35, -4.2);
    g0.add(chaiPot);

    // Store Room Achar Jars (Right Room)
    for (let i = -1; i <= 1; i++) {
      const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.35, 0.7, 12), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 }));
      jar.position.set(10.5 + i * 0.9, 0.35, -4.5);
      jar.castShadow = true;
      g0.add(jar);
    }

    this.scene.add(g0);
    this.floorGroups.push(g0);

    // =========================================================================
    // FLOOR 1: MIDDLE FLOOR (Living Room, Sisters' Bedroom, Study Room)
    // =========================================================================
    const g1 = new THREE.Group();
    g1.position.y = floorHeights[1];

    const slab1 = new THREE.Mesh(new THREE.BoxGeometry(width, 0.4, depth), terracottaMat);
    slab1.position.y = -0.2;
    slab1.receiveShadow = true;
    g1.add(slab1);

    const backWall1 = new THREE.Mesh(new THREE.BoxGeometry(width, 4.2, 0.4), wallPlasterMat);
    backWall1.position.set(0, 2.1, -depth / 2);
    backWall1.receiveShadow = true;
    g1.add(backWall1);

    const leftWall1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.2, depth), wallPlasterMat);
    leftWall1.position.set(-width / 2, 2.1, 0);
    g1.add(leftWall1);

    const rightWall1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.2, depth), wallPlasterMat);
    rightWall1.position.set(width / 2, 2.1, 0);
    g1.add(rightWall1);

    // Low Dividers
    const div1L = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.4, depth * 0.75), wallPlasterMat);
    div1L.position.set(-5.5, 0.7, -1);
    g1.add(div1L);

    const div1R = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.4, depth * 0.75), wallPlasterMat);
    div1R.position.set(5.5, 0.7, -1);
    g1.add(div1R);

    // Living Room Sofa & Teapoy Table (Center Room)
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.6, 1.4), new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.7 }));
    sofaBase.position.set(0, 0.3, -3.8);
    g1.add(sofaBase);

    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.1, 0.4), new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.7 }));
    sofaBack.position.set(0, 0.85, -4.5);
    g1.add(sofaBack);

    const teapoy = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.45, 1.0), darkWoodMat);
    teapoy.position.set(0, 0.22, -1.8);
    g1.add(teapoy);

    // Sisters' Bedroom Bed (Right Room)
    const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.6, 4.5), darkWoodMat);
    bedFrame.position.set(10.5, 0.3, -3.2);
    g1.add(bedFrame);

    const mattress = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.4, 4.2), fabricPinkMat);
    mattress.position.set(10.5, 0.7, -3.2);
    g1.add(mattress);

    const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.25, 0.8), fabricYellowMat);
    pillow1.position.set(9.5, 1.0, -4.8);
    g1.add(pillow1);

    const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.25, 0.8), fabricYellowMat);
    pillow2.position.set(11.5, 1.0, -4.8);
    g1.add(pillow2);

    // Study Room Desk & Bookshelf (Left Room)
    const studyDesk = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.9, 1.6), darkWoodMat);
    studyDesk.position.set(-10.5, 0.45, -4.2);
    g1.add(studyDesk);

    const openBook = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.6), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    openBook.position.set(-10.5, 0.95, -4.2);
    g1.add(openBook);

    // Potted Tulsi Plant on Balcony
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.3, 0.6, 12), terracottaMat);
    pot.position.set(13.0, 0.3, 4.5);
    g1.add(pot);

    const plant = new THREE.Mesh(new THREE.DodecahedronGeometry(0.5), new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 }));
    plant.position.set(13.0, 0.85, 4.5);
    g1.add(plant);

    // Railing
    const rail1 = new THREE.Mesh(new THREE.BoxGeometry(width, 0.8, 0.15), darkWoodMat);
    rail1.position.set(0, 0.4, depth / 2);
    g1.add(rail1);

    this.scene.add(g1);
    this.floorGroups.push(g1);

    // =========================================================================
    // FLOOR 2: TOP TERRACE (Clotheslines, Solar Inverter, Water Tank)
    // =========================================================================
    const g2 = new THREE.Group();
    g2.position.y = floorHeights[2];

    const slab2 = new THREE.Mesh(new THREE.BoxGeometry(width, 0.4, depth), terraceStoneMat);
    slab2.position.y = -0.2;
    slab2.receiveShadow = true;
    g2.add(slab2);

    // Terrace Railing around perimeter
    const rail2Back = new THREE.Mesh(new THREE.BoxGeometry(width, 0.9, 0.2), wallPlasterMat);
    rail2Back.position.set(0, 0.45, -depth / 2);
    g2.add(rail2Back);

    const rail2Front = new THREE.Mesh(new THREE.BoxGeometry(width, 0.9, 0.2), wallPlasterMat);
    rail2Front.position.set(0, 0.45, depth / 2);
    g2.add(rail2Front);

    // Clothesline Posts & Swaying Sarees
    const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 8), darkWoodMat);
    postL.position.set(-6, 1.2, 0);
    g2.add(postL);

    const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 8), darkWoodMat);
    postR.position.set(6, 1.2, 0);
    g2.add(postR);

    // Clothesline Wire
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 12, 6), steelMat);
    wire.rotation.z = Math.PI / 2;
    wire.position.set(0, 2.2, 0);
    g2.add(wire);

    // Hanging Colorful Sarees
    const cloth1 = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), fabricPinkMat);
    cloth1.position.set(-3, 1.4, 0);
    g2.add(cloth1);
    this.clotheslines.push(cloth1);

    const cloth2 = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), fabricBlueMat);
    cloth2.position.set(0.5, 1.4, 0);
    g2.add(cloth2);
    this.clotheslines.push(cloth2);

    const cloth3 = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), fabricYellowMat);
    cloth3.position.set(3.8, 1.4, 0);
    g2.add(cloth3);
    this.clotheslines.push(cloth3);

    // Solar Panel Unit
    const solarFrame = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.15, 2.8), steelMat);
    solarFrame.position.set(-10, 0.6, -3.5);
    solarFrame.rotation.x = 0.25;
    g2.add(solarFrame);

    const solarGrid = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.08, 2.6), new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.9, roughness: 0.1 }));
    solarGrid.position.set(-10, 0.7, -3.5);
    solarGrid.rotation.x = 0.25;
    g2.add(solarGrid);

    // Water Tank
    const waterTank = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 2.4, 16), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 }));
    waterTank.position.set(11, 1.2, -3.5);
    g2.add(waterTank);

    this.scene.add(g2);
    this.floorGroups.push(g2);
  }

  createTaskMarkers() {
    const floorHeights = [0, 8, 16];

    const markersData = [
      // Floor 0: Ground Floor Tasks
      { id: "TASK_CHAI", text: "☕ Make Chai", x: -10.5, z: -3.5, floor: 0, color: "#F59E0B" },
      { id: "TASK_ACHAR", text: "🏺 Achar Jars", x: 10.5, z: -3.5, floor: 0, color: "#EAB308" },
      { id: "TASK_RANGOLI", text: "🧹 Clean Rangoli", x: 0, z: 2.0, floor: 0, color: "#EC4899" },
      { id: "LOCKBOX", text: "📦 Phone Lock Box (Meeting)", x: 0, z: -3.0, floor: 0, color: "#06B6D4" },

      // Floor 1: Middle Floor Tasks
      { id: "TASK_MATH", text: "📚 Do Math Homework", x: -10.5, z: -3.2, floor: 1, color: "#3B82F6" },
      { id: "TASK_BED", text: "🛏️ Fold Bedsheet", x: 10.5, z: -2.0, floor: 1, color: "#F43F5E" },
      { id: "TASK_TULSI", text: "🌿 Water Tulsi", x: 12.5, z: 3.5, floor: 1, color: "#10B981" },
      { id: "TASK_FUSE_1", text: "⚡ Fix Fuse Box", x: -13.0, z: -3.5, floor: 1, color: "#EF4444" },

      // Floor 2: Top Terrace Tasks
      { id: "TASK_CLOTHES", text: "🧺 Fold Dry Clothes", x: 0, z: 0.5, floor: 2, color: "#8B5CF6" },
      { id: "TASK_SOLAR", text: "☀️ Clean Solar Panels", x: -10, z: -2.5, floor: 2, color: "#06B6D4" },
      { id: "TASK_FUSE_2", text: "⚡ Terrace Switchboard", x: 10, z: -4.0, floor: 2, color: "#EF4444" }
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

    // Glowing Pill Background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
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

    // Floor culling: Only render floors up to active floor
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

    // Bouncing animation for task markers
    this.taskMarkers.forEach((m) => {
      if (m.sprite.visible) {
        m.sprite.position.y = m.baseY + Math.sin(this.markerTime * 3) * 0.22;
      }
    });

    // Gentle swaying of terrace sarees in the breeze
    this.clotheslines.forEach((cloth, idx) => {
      cloth.rotation.x = Math.sin(this.markerTime * 2 + idx) * 0.18;
    });
  }
}
