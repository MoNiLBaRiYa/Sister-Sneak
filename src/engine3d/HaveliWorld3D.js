/**
 * Sister Sneak 3D - Joint-Family Haveli Mansion 3D Architecture
 * 3-Floor Haveli with Indian Architectural elements:
 * - Floor 0 (Ground): Grand Foyer, Living Hall (Baithak), Grand Kitchen (Rasoi), Steel Lock Box
 * - Floor 1 (Middle): Study Room (Abhyas Khand), Sisters' Bedroom, Dressing Room
 * - Floor 2 (Top): Sunlit Terrace (Agasi), Solar Panels, Water Tank, Balcony with Tulsi plant
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class HaveliWorld3D {
  constructor(scene, lighting) {
    this.scene = scene;
    this.lighting = lighting;
    this.rooms = [];
    this.lockedDoors = new Map();
    this.buildMansion();
  }

  buildMansion() {
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Common Materials
    this.materials = {
      terracottaFloor: new THREE.MeshStandardMaterial({ color: 0xba5d39, roughness: 0.6, metalness: 0.1 }),
      marbleFloor: new THREE.MeshStandardMaterial({ color: 0xede8d0, roughness: 0.3, metalness: 0.2 }),
      terraceFloor: new THREE.MeshStandardMaterial({ color: 0xc47b58, roughness: 0.8 }),
      wallExterior: new THREE.MeshStandardMaterial({ color: 0xfdf6e2, roughness: 0.7 }),
      wallInterior: new THREE.MeshStandardMaterial({ color: 0xfff9eb, roughness: 0.8 }),
      woodTrim: new THREE.MeshStandardMaterial({ color: 0x5c3317, roughness: 0.5 }),
      brassGold: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.8 }),
      steelLockBox: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.2, metalness: 0.9 }),
      clothBlue: new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.9 }),
      clothPink: new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.9 }),
      solarBlue: new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.1, metalness: 0.7 })
    };

    // Build 3 Floors
    this.buildGroundFloor(0);
    this.buildFirstFloor(8);
    this.buildTerraceFloor(16);
  }

  buildGroundFloor(y) {
    const floorG = new THREE.Group();
    floorG.position.y = y;

    // Floor Base (32 x 20)
    const baseGeo = new THREE.BoxGeometry(34, 0.6, 20);
    const baseMesh = new THREE.Mesh(baseGeo, this.materials.terracottaFloor);
    baseMesh.position.y = -0.3;
    baseMesh.receiveShadow = true;
    floorG.add(baseMesh);

    // Decorative Central Marble Rangoli Courtyard
    const rangoliGeo = new THREE.BoxGeometry(10, 0.62, 10);
    const rangoliMesh = new THREE.Mesh(rangoliGeo, this.materials.marbleFloor);
    rangoliMesh.position.set(0, -0.3, 0);
    rangoliMesh.receiveShadow = true;
    floorG.add(rangoliMesh);

    // Steel Phone Lock Box in Central Hall
    const boxGeo = new THREE.BoxGeometry(1.6, 1.4, 1.2);
    const boxMesh = new THREE.Mesh(boxGeo, this.materials.steelLockBox);
    boxMesh.position.set(0, 0.7, -4);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    floorG.add(boxMesh);

    // Gold Padlock on Lockbox
    const lockGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16);
    const lockMesh = new THREE.Mesh(lockGeo, this.materials.brassGold);
    lockMesh.position.set(0, 1.4, -3.4);
    lockMesh.castShadow = true;
    floorG.add(lockMesh);

    // Kitchen Counter & Gas Stove (Left Room)
    const counterGeo = new THREE.BoxGeometry(6, 1.2, 2.5);
    const counterMesh = new THREE.Mesh(counterGeo, this.materials.woodTrim);
    counterMesh.position.set(-11, 0.6, -5);
    counterMesh.castShadow = true;
    floorG.add(counterMesh);

    // Living Room Sofa (Right Room)
    const sofaGeo = new THREE.BoxGeometry(5, 1.0, 2.2);
    const sofaMesh = new THREE.Mesh(sofaGeo, this.materials.clothBlue);
    sofaMesh.position.set(11, 0.5, -4);
    sofaMesh.castShadow = true;
    floorG.add(sofaMesh);

    // Low Cutaway Boundary Walls (Back & Sides only, front open for isometric view)
    this.createCutawayWalls(floorG, 34, 20, 3.5);

    // Room Lamp Lights
    this.lighting.addRoomLight(0, y + 3.2, 0, 0xffe6b3, 1.3, 16);
    this.lighting.addRoomLight(-11, y + 3.2, 0, 0xffd180, 1.1, 12);
    this.lighting.addRoomLight(11, y + 3.2, 0, 0xffe0b2, 1.1, 12);

    this.group.add(floorG);
  }

  buildFirstFloor(y) {
    const floorG = new THREE.Group();
    floorG.position.y = y;

    // Floor Base (34 x 20)
    const baseGeo = new THREE.BoxGeometry(34, 0.6, 20);
    const baseMesh = new THREE.Mesh(baseGeo, this.materials.marbleFloor);
    baseMesh.position.y = -0.3;
    baseMesh.receiveShadow = true;
    floorG.add(baseMesh);

    // Study Desk & Books (Left - Jisha's Study Zone)
    const deskGeo = new THREE.BoxGeometry(4.5, 1.1, 2.2);
    const deskMesh = new THREE.Mesh(deskGeo, this.materials.woodTrim);
    deskMesh.position.set(-11, 0.55, -4);
    deskMesh.castShadow = true;
    floorG.add(deskMesh);

    // 4-Poster Wooden Bed (Right - Sisters' Bedroom)
    const bedGeo = new THREE.BoxGeometry(5.5, 1.0, 4.5);
    const bedMesh = new THREE.Mesh(bedGeo, this.materials.clothPink);
    bedMesh.position.set(10, 0.5, -3);
    bedMesh.castShadow = true;
    floorG.add(bedMesh);

    this.createCutawayWalls(floorG, 34, 20, 3.5);

    this.lighting.addRoomLight(0, y + 3.2, 0, 0xffe6b3, 1.2, 14);
    this.lighting.addRoomLight(-11, y + 3.2, 0, 0x93c5fd, 1.2, 12);
    this.lighting.addRoomLight(11, y + 3.2, 0, 0xfbcfe8, 1.2, 12);

    this.group.add(floorG);
  }

  buildTerraceFloor(y) {
    const floorG = new THREE.Group();
    floorG.position.y = y;

    // Terrace Base (34 x 20)
    const baseGeo = new THREE.BoxGeometry(34, 0.6, 20);
    const baseMesh = new THREE.Mesh(baseGeo, this.materials.terraceFloor);
    baseMesh.position.y = -0.3;
    baseMesh.receiveShadow = true;
    floorG.add(baseMesh);

    // Solar Panel Grid (Left Terrace)
    const solarGeo = new THREE.BoxGeometry(6, 0.3, 4);
    const solarMesh = new THREE.Mesh(solarGeo, this.materials.solarBlue);
    solarMesh.rotation.x = 0.25;
    solarMesh.position.set(-10, 0.8, -4);
    solarMesh.castShadow = true;
    floorG.add(solarMesh);

    // Terrace Clothesline Poles & Fluttering Clothes
    const pole1Geo = new THREE.CylinderGeometry(0.08, 0.08, 2.5);
    const pole1 = new THREE.Mesh(pole1Geo, this.materials.woodTrim);
    pole1.position.set(6, 1.25, -5);
    pole1.castShadow = true;
    floorG.add(pole1);

    const pole2 = new THREE.Mesh(pole1Geo, this.materials.woodTrim);
    pole2.position.set(13, 1.25, -5);
    pole2.castShadow = true;
    floorG.add(pole2);

    // Fluttering Saree Cloth
    const clothGeo = new THREE.PlaneGeometry(5, 1.4);
    const clothMesh = new THREE.Mesh(clothGeo, this.materials.clothPink);
    clothMesh.position.set(9.5, 1.6, -5);
    clothMesh.castShadow = true;
    floorG.add(clothMesh);

    // Terrace Railing (Parapet)
    this.createCutawayWalls(floorG, 34, 20, 1.4);

    this.lighting.addRoomLight(0, y + 3.5, 0, 0xffedd5, 1.4, 18);

    this.group.add(floorG);
  }

  createCutawayWalls(group, width, depth, height) {
    const wallMat = this.materials.wallExterior;
    const halfW = width / 2;
    const halfD = depth / 2;
    const thick = 0.5;

    // Back Wall
    const backGeo = new THREE.BoxGeometry(width, height, thick);
    const backMesh = new THREE.Mesh(backGeo, wallMat);
    backMesh.position.set(0, height / 2, -halfD);
    backMesh.receiveShadow = true;
    backMesh.castShadow = true;
    group.add(backMesh);

    // Left Wall
    const leftGeo = new THREE.BoxGeometry(thick, height, depth);
    const leftMesh = new THREE.Mesh(leftGeo, wallMat);
    leftMesh.position.set(-halfW, height / 2, 0);
    leftMesh.receiveShadow = true;
    leftMesh.castShadow = true;
    group.add(leftMesh);

    // Right Wall
    const rightGeo = new THREE.BoxGeometry(thick, height, depth);
    const rightMesh = new THREE.Mesh(rightGeo, wallMat);
    rightMesh.position.set(halfW, height / 2, 0);
    rightMesh.receiveShadow = true;
    rightMesh.castShadow = true;
    group.add(rightMesh);
  }
}
