/**
 * Sister Sneak 3D - Haveli Mansion 3D Isometric Environment
 * Renders an authentic 3-Floor Indian Joint-Family Haveli with real physical room props:
 * Kitchen Stove & Chai Strainer, Study Desk & Math Workbook, Bed & Quilt,
 * Balcony Tulsi Kyaro, Terrace Clotheslines with swaying Sarees, Solar Panels,
 * Gujarati Barni Pickle Jars, Floor Rangoli, Shoe Rack, Phone Lock Box,
 * and dedicated 3D physical Staircase Rooms on all floors with wooden steps and banisters.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class HaveliWorld3D {
  constructor(scene, lighting) {
    this.scene = scene;
    this.lighting = lighting;

    this.floorGroups = [];
    this.taskMarkers = [];
    this.clotheslines = [];
    this.hinchkoSwings = [];
    this.steamingChaiPot = null;
    this.activeFloor = 1;
    this.markerTime = 0;

    this.buildHaveli();
    this.createTaskMarkers();
  }

  buildHaveli() {
    const floorHeights = [0, 8, 16];
    const width = 30;
    const depth = 14;

    // Materials
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.12, metalness: 0.05 });
    const terracottaMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.65 });
    const terraceStoneMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
    const wallPlasterMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.55 });
    const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.5 });
    const teakWoodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.45 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.8 });
    const graniteMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
    const fabricPinkMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.8 });
    const fabricBlueMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.8 });
    const fabricYellowMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.8 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 });
    const ceramicWhiteMat = new THREE.MeshStandardMaterial({ color: 0xfef9c3, roughness: 0.3 });
    const plantMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
    const lanternGlowMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    // =========================================================================
    // FLOOR 0: GROUND FLOOR (Entry Veranda, Courtyard, Kitchen, Store Room, 1F Stairwell)
    // =========================================================================
    const g0 = new THREE.Group();

    // Floor Base Slab
    const slab0 = new THREE.Mesh(new THREE.BoxGeometry(width, 0.4, depth), marbleMat);
    slab0.position.y = -0.2;
    slab0.receiveShadow = true;
    g0.add(slab0);

    // Decorative Back Wall
    const backWall0 = new THREE.Mesh(new THREE.BoxGeometry(width, 4.2, 0.4), wallPlasterMat);
    backWall0.position.set(0, 2.1, -depth / 2);
    backWall0.receiveShadow = true;
    g0.add(backWall0);

    // Left & Right Outer Walls
    const leftWall0 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.2, depth), wallPlasterMat);
    leftWall0.position.set(-width / 2, 2.1, 0);
    g0.add(leftWall0);

    const rightWall0 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.2, depth), wallPlasterMat);
    rightWall0.position.set(width / 2, 2.1, 0);
    g0.add(rightWall0);

    // Low Open Dividers
    const div0L = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, depth * 0.75), wallPlasterMat);
    div0L.position.set(-5.5, 0.6, -1.0);
    g0.add(div0L);

    const div0R = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, depth * 0.75), wallPlasterMat);
    div0R.position.set(5.5, 0.6, -1.0);
    g0.add(div0R);

    // 1. 🌸 Peacock Floor Rangoli with Gulal Bowls (Center Courtyard)
    const rangoliGeo = new THREE.CircleGeometry(2.4, 32);
    const rangoliMat = new THREE.MeshBasicMaterial({ color: 0xec4899, side: THREE.DoubleSide });
    const rangoli = new THREE.Mesh(rangoliGeo, rangoliMat);
    rangoli.rotation.x = -Math.PI / 2;
    rangoli.position.set(0, 0.02, 1.5);
    g0.add(rangoli);

    const rangoliInner = new THREE.Mesh(new THREE.CircleGeometry(1.2, 32), new THREE.MeshBasicMaterial({ color: 0xfde047 }));
    rangoliInner.rotation.x = -Math.PI / 2;
    rangoliInner.position.set(0, 0.03, 1.5);
    g0.add(rangoliInner);

    // Dry Gulal Bowls around Rangoli
    const bowlColors = [0xef4444, 0x10b981, 0x3b82f6];
    bowlColors.forEach((color, idx) => {
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.15, 12), new THREE.MeshStandardMaterial({ color, roughness: 0.4 }));
      bowl.position.set(-1.8 + idx * 1.8, 0.08, 3.2);
      g0.add(bowl);
    });

    // 2. 👡 Wooden Shoe Rack with Slippers (Veranda Entrance)
    const shoeRack = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, 0.8), darkWoodMat);
    shoeRack.position.set(6.5, 0.3, 1.5);
    g0.add(shoeRack);

    // 3. ☕ Grand Kitchen Counter, Gas Stove & Chai Strainer (Left Room)
    const kitchenCounter = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.0, 1.8), graniteMat);
    kitchenCounter.position.set(-10.5, 0.5, -4.2);
    kitchenCounter.castShadow = true;
    g0.add(kitchenCounter);

    // Gas Stove with Steel Body
    const stove = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.15, 1.0), steelMat);
    stove.position.set(-10.5, 1.08, -4.2);
    g0.add(stove);

    // Brass Chai Saucepan
    const chaiPot = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.45, 12), goldMat);
    chaiPot.position.set(-10.5, 1.35, -4.2);
    g0.add(chaiPot);
    this.steamingChaiPot = chaiPot;

    // Chai Strainer & Glass
    const chaiGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.35, 10), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.1, transparent: true, opacity: 0.85 }));
    chaiGlass.position.set(-9.2, 1.18, -4.2);
    g0.add(chaiGlass);

    const strainerHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 6), steelMat);
    strainerHandle.rotation.z = Math.PI / 3;
    strainerHandle.position.set(-9.3, 1.45, -4.2);
    g0.add(strainerHandle);

    // 4. 🏺 Dadi's Store Room: Ceramic Gujarati Barni Jars (Right Room)
    const storeShelf = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.15, 1.2), darkWoodMat);
    storeShelf.position.set(8.2, 0.9, -4.5);
    g0.add(storeShelf);

    for (let i = -1; i <= 1; i++) {
      const barni = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.65, 16), ceramicWhiteMat);
      barni.position.set(8.2 + i * 0.95, 1.3, -4.5);
      barni.castShadow = true;
      g0.add(barni);

      const barniCap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.18, 16), fabricYellowMat);
      barniCap.position.set(8.2 + i * 0.95, 1.68, -4.5);
      g0.add(barniCap);
    }

    // Steel Masala Dabba / Vaghariya Stand on Kitchen Shelf
    const masalaStand = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.25, 12), steelMat);
    masalaStand.position.set(-8.2, 1.15, -4.2);
    g0.add(masalaStand);

    // 5. 💡 1F Ground Power Board
    const fuseBox0 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.2), steelMat);
    fuseBox0.position.set(9.8, 2.0, -4.8);
    g0.add(fuseBox0);

    const led0 = new THREE.Mesh(new THREE.SphereGeometry(0.06), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    led0.position.set(9.8, 2.4, -4.68);
    g0.add(led0);

    // 6. 🛋️ GUJARATI HAVELI PROPS & LIVELY FURNITURE (Floor 0)
    this.buildHinchkoSwing(g0, teakWoodMat, darkWoodMat, goldMat, fabricYellowMat, fabricPinkMat);
    this.buildUrliWithPetals(g0, goldMat);
    this.buildMatkaWithTap(g0, terracottaMat, goldMat, darkWoodMat);
    this.buildToran(g0);

    // 7. 🚪 AUTHENTIC HAVELI SECRET PASSAGES (Floor 0)
    this.buildSecretPantryCabinet(g0, darkWoodMat, goldMat);
    this.buildSecretDadiTrunk(g0, darkWoodMat, goldMat);

    // 8. 🪜 DEDICATED 1F GROUND STAIRCASE ROOM & 3D WOODEN STEPS
    this.buildGroundStairRoom(g0, wallPlasterMat, teakWoodMat, darkWoodMat, goldMat, lanternGlowMat);

    this.scene.add(g0);
    this.floorGroups.push(g0);

    // =========================================================================
    // FLOOR 1: MIDDLE FLOOR (Living Hub, Study Desk, Bedroom, Balcony, 2F Stairwell)
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

    const div1L = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, depth * 0.75), wallPlasterMat);
    div1L.position.set(-5.5, 0.6, -1.0);
    g1.add(div1L);

    const div1R = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, depth * 0.75), wallPlasterMat);
    div1R.position.set(5.5, 0.6, -1.0);
    g1.add(div1R);

    // 1. 🛋️ Central Living Hall Sofa & Heirloom Phone Lock Box
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.6, 1.4), new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.7 }));
    sofaBase.position.set(0, 0.3, -3.8);
    g1.add(sofaBase);

    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.1, 0.4), new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.7 }));
    sofaBack.position.set(0, 0.85, -4.5);
    g1.add(sofaBack);

    // Center Teapoy Table
    const centerTable = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 1.2), darkWoodMat);
    centerTable.position.set(0, 0.25, -1.8);
    g1.add(centerTable);

    // Heirloom Steel Phone Lock Box with Brass Padlock
    const phoneBox = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.9), steelMat);
    phoneBox.position.set(0, 0.9, -1.8);
    phoneBox.castShadow = true;
    g1.add(phoneBox);

    const lockHasp = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.15), goldMat);
    lockHasp.position.set(0, 0.9, -1.32);
    g1.add(lockHasp);

    // 2. 📚 Study Corner Desk, Bookshelf & Open Math Homework (Left Room)
    const studyDesk = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.9, 1.6), darkWoodMat);
    studyDesk.position.set(-10.5, 0.45, -4.0);
    studyDesk.castShadow = true;
    g1.add(studyDesk);

    const studyChair = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.5, 1.0), darkWoodMat);
    studyChair.position.set(-10.5, 0.25, -2.5);
    g1.add(studyChair);

    // Open Math Workbook
    const mathBook = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.65), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }));
    mathBook.position.set(-10.5, 0.94, -4.0);
    g1.add(mathBook);

    const pencil = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 6), fabricYellowMat);
    pencil.rotation.z = Math.PI / 4;
    pencil.position.set(-9.8, 0.96, -3.9);
    g1.add(pencil);

    // 3. 🛏️ Sisters' Bedroom Bed (Cleanly inside Bedroom at x=8.2)
    const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.6, 4.2), darkWoodMat);
    bedFrame.position.set(8.2, 0.3, -3.2);
    g1.add(bedFrame);

    const mattress = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.4, 3.9), fabricPinkMat);
    mattress.position.set(8.2, 0.7, -3.2);
    g1.add(mattress);

    const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.22, 0.75), fabricYellowMat);
    pillow1.position.set(7.3, 0.95, -4.6);
    g1.add(pillow1);

    const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.22, 0.75), fabricYellowMat);
    pillow2.position.set(9.1, 0.95, -4.6);
    g1.add(pillow2);

    // 4. 🌿 Balcony Tulsi Kyaro Pedestal & Watering Can (Far Left)
    const tulsiPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.8, 12), terracottaMat);
    tulsiPedestal.position.set(-13.5, 0.4, 2.5);
    g1.add(tulsiPedestal);

    const tulsiBush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55), plantMat);
    tulsiBush.position.set(-13.5, 1.1, 2.5);
    g1.add(tulsiBush);

    const wateringLota = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.4, 10), goldMat);
    wateringLota.position.set(-12.4, 0.2, 2.5);
    g1.add(wateringLota);

    // 5. ⚡ 2F Hall Switchboard
    const fuseBox1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.2), steelMat);
    fuseBox1.position.set(4.5, 2.0, -4.5);
    g1.add(fuseBox1);

    const led1 = new THREE.Mesh(new THREE.SphereGeometry(0.06), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    led1.position.set(4.5, 2.4, -4.38);
    g1.add(led1);

    // Front Balcony Railing
    const rail1 = new THREE.Mesh(new THREE.BoxGeometry(width, 0.8, 0.15), darkWoodMat);
    rail1.position.set(0, 0.4, depth / 2);
    g1.add(rail1);

    // Framed Haveli Heritage Family Portrait on Central Living Wall
    const portraitFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 0.08), goldMat);
    portraitFrame.position.set(0, 2.8, -depth / 2 + 0.22);
    g1.add(portraitFrame);
    const portraitCanvas = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 0.02), new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 }));
    portraitCanvas.position.set(0, 2.8, -depth / 2 + 0.27);
    g1.add(portraitCanvas);

    // 6. 🚪 AUTHENTIC HAVELI SECRET PASSAGE & STACKED TRUNKS (Floor 1)
    this.buildSecretVintageAlmari(g1, darkWoodMat, goldMat, teakWoodMat);
    this.buildStackedTrunks(g1, steelMat, goldMat, teakWoodMat);

    // 7. 🪜 DEDICATED 2F LIVING HUB STAIRCASE ROOM (1F Down & 3F Up)
    this.buildHubStairRoom(g1, wallPlasterMat, teakWoodMat, darkWoodMat, goldMat, lanternGlowMat);

    this.scene.add(g1);
    this.floorGroups.push(g1);

    // =========================================================================
    // FLOOR 2: TOP TERRACE (Drying Sarees, Solar Panels, Inverter, 3F Stairwell)
    // =========================================================================
    const g2 = new THREE.Group();
    g2.position.y = floorHeights[2];

    const slab2 = new THREE.Mesh(new THREE.BoxGeometry(width, 0.4, depth), terraceStoneMat);
    slab2.position.y = -0.2;
    slab2.receiveShadow = true;
    g2.add(slab2);

    const rail2Back = new THREE.Mesh(new THREE.BoxGeometry(width, 0.9, 0.2), wallPlasterMat);
    rail2Back.position.set(0, 0.45, -depth / 2);
    g2.add(rail2Back);

    const rail2Front = new THREE.Mesh(new THREE.BoxGeometry(width, 0.9, 0.2), wallPlasterMat);
    rail2Front.position.set(0, 0.45, depth / 2);
    g2.add(rail2Front);

    // 1. 🧺 Clotheslines & Fluttering Sarees (Center Patio)
    const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 8), darkWoodMat);
    postL.position.set(-6, 1.2, 0.5);
    g2.add(postL);

    const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 8), darkWoodMat);
    postR.position.set(5.5, 1.2, 0.5);
    g2.add(postR);

    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 11.5, 6), steelMat);
    wire.rotation.z = Math.PI / 2;
    wire.position.set(-0.25, 2.2, 0.5);
    g2.add(wire);

    // Swaying Dupattas
    const cloth1 = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), fabricPinkMat);
    cloth1.position.set(-3, 1.4, 0.5);
    g2.add(cloth1);
    this.clotheslines.push(cloth1);

    const cloth2 = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), fabricBlueMat);
    cloth2.position.set(0.2, 1.4, 0.5);
    g2.add(cloth2);
    this.clotheslines.push(cloth2);

    const cloth3 = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), fabricYellowMat);
    cloth3.position.set(3.4, 1.4, 0.5);
    g2.add(cloth3);
    this.clotheslines.push(cloth3);

    // Wicker Laundry Basket
    const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.45, 0.7, 12), darkWoodMat);
    basket.position.set(-4.5, 0.35, 1.5);
    g2.add(basket);

    // 2. ☀️ Tilted Solar Inverter Panels with Squeegee Wiper (Left Roof)
    const solarFrame = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.15, 2.8), steelMat);
    solarFrame.position.set(-10, 0.6, -3.5);
    solarFrame.rotation.x = 0.25;
    g2.add(solarFrame);

    const solarGrid = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.08, 2.6), new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.9, roughness: 0.1 }));
    solarGrid.position.set(-10, 0.7, -3.5);
    solarGrid.rotation.x = 0.25;
    g2.add(solarGrid);

    // Wiper Squeegee
    const squeegee = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8), fabricYellowMat);
    squeegee.position.set(-7.5, 0.6, -3.0);
    squeegee.rotation.z = Math.PI / 4;
    g2.add(squeegee);

    // 3. ⚡ 3F Solar Inverter Switchboard (Shifted cleanly to x=7.5)
    const fuseBox2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.2), steelMat);
    fuseBox2.position.set(7.5, 2.0, -4.0);
    g2.add(fuseBox2);

    const led2 = new THREE.Mesh(new THREE.SphereGeometry(0.06), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    led2.position.set(7.5, 2.4, -3.88);
    g2.add(led2);

    // 4. 🚰 SINTEX ROOFTOP WATER TANK & SECRET TRAPDOOR (Floor 2)
    this.buildSintexWaterTank(g2);
    this.buildSecretTrapdoor(g2, darkWoodMat, steelMat, goldMat);

    // 5. 🪜 DEDICATED 3F ROOFTOP STAIRWELL ENCLOSURE (Stairhead Gazebo & Doorway)
    this.buildTerraceStairRoom(g2, wallPlasterMat, teakWoodMat, darkWoodMat, goldMat, lanternGlowMat);

    this.scene.add(g2);
    this.floorGroups.push(g2);
  }

  // Helper: Build 1F Ground Staircase Room
  buildGroundStairRoom(group, wallMat, woodMat, darkWoodMat, goldMat, glowMat) {
    const archX = 11.2;

    // Left archway wall post
    const archPost1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 4.0), wallMat);
    archPost1.position.set(archX, 1.6, -4.5);
    group.add(archPost1);

    // Right archway wall post
    const archPost2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 4.0), wallMat);
    archPost2.position.set(archX, 1.6, 4.5);
    group.add(archPost2);

    // Top lintel / arch header
    const archTop = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.8, 13.0), wallMat);
    archTop.position.set(archX, 3.4, 0);
    group.add(archTop);

    // Glowing Haveli Brass Lantern
    const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 0.35), glowMat);
    lantern.position.set(archX, 2.8, 0);
    group.add(lantern);

    const lanternFrame = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.55, 0.4), darkWoodMat);
    lanternFrame.position.set(archX, 2.8, 0);
    group.add(lanternFrame);

    // 3D Physical Steps ascending upward
    const stepCount = 6;
    const stepW = 2.4;
    const stepD = 0.65;
    const stepH = 0.32;

    for (let i = 0; i < stepCount; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(stepW, stepH * (i + 1), stepD), woodMat);
      step.position.set(13.2, (stepH * (i + 1)) / 2, -2.5 + i * stepD);
      step.castShadow = true;
      step.receiveShadow = true;
      group.add(step);
    }

    // Handrail Banister
    const handrail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, stepCount * stepD + 0.5), darkWoodMat);
    handrail.rotation.x = 0.42;
    handrail.position.set(12.0, 1.4, -0.8);
    group.add(handrail);

    // Balusters
    for (let i = 0; i < 4; i++) {
      const baluster = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.1, 8), goldMat);
      baluster.position.set(12.0, 0.6 + i * 0.28, -2.2 + i * 0.9);
      group.add(baluster);
    }
  }

  // Helper: Build 2F Living Hub Dual Staircase Room
  buildHubStairRoom(group, wallMat, woodMat, darkWoodMat, goldMat, glowMat) {
    const archX = 11.2;

    // Archway posts & lintel
    const archPost1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 4.0), wallMat);
    archPost1.position.set(archX, 1.6, -4.5);
    group.add(archPost1);

    const archPost2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 4.0), wallMat);
    archPost2.position.set(archX, 1.6, 4.5);
    group.add(archPost2);

    const archTop = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.8, 13.0), wallMat);
    archTop.position.set(archX, 3.4, 0);
    group.add(archTop);

    // Glowing Lantern
    const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 0.35), glowMat);
    lantern.position.set(archX, 2.8, 0);
    group.add(lantern);

    // Flight A: Steps descending down to 1F (Back section z = -4.5 to -1.5)
    for (let i = 0; i < 5; i++) {
      const stepDown = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.28 * (5 - i), 0.55), woodMat);
      stepDown.position.set(13.0, (0.28 * (5 - i)) / 2, -4.2 + i * 0.55);
      group.add(stepDown);
    }
    const railDown = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 2.8), darkWoodMat);
    railDown.rotation.x = -0.45;
    railDown.position.set(11.9, 1.1, -3.1);
    group.add(railDown);

    // Flight B: Steps ascending up to 3F (Front section z = 1.0 to 4.2)
    for (let i = 0; i < 5; i++) {
      const stepUp = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.28 * (i + 1), 0.55), woodMat);
      stepUp.position.set(13.2, (0.28 * (i + 1)) / 2, 1.2 + i * 0.55);
      group.add(stepUp);
    }
    const railUp = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 2.8), darkWoodMat);
    railUp.rotation.x = 0.45;
    railUp.position.set(12.1, 1.1, 2.3);
    group.add(railUp);
  }

  // Helper: Build 3F Terrace Rooftop Stairwell Enclosure
  buildTerraceStairRoom(group, wallMat, woodMat, darkWoodMat, goldMat, glowMat) {
    const shedX = 12.8;

    // Enclosed Stairhead Cabin Walls (Left, Right, Back)
    const shedWallL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.8, 5.0), wallMat);
    shedWallL.position.set(10.8, 1.4, 0);
    group.add(shedWallL);

    const shedWallR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.8, 5.0), wallMat);
    shedWallR.position.set(14.6, 1.4, 0);
    group.add(shedWallR);

    const shedWallBack = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.8, 0.3), wallMat);
    shedWallBack.position.set(12.7, 1.4, -2.5);
    group.add(shedWallBack);

    // Sloping Stairhead Canopy Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.25, 5.6), darkWoodMat);
    roof.position.set(12.7, 2.9, 0);
    roof.rotation.z = -0.08;
    group.add(roof);

    // Lantern above Doorway Opening
    const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.3), glowMat);
    lantern.position.set(10.8, 2.4, 0);
    group.add(lantern);

    // Descending Steps into the stairwell opening
    for (let i = 0; i < 4; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.25 * (4 - i), 0.6), woodMat);
      step.position.set(12.7, (0.25 * (4 - i)) / 2, -1.5 + i * 0.6);
      group.add(step);
    }
  }

  // 1. Gujarati Hinchko Swing with Brass Chains & Bolsters (હિંચકો)
  buildHinchkoSwing(group, teakWoodMat, darkWoodMat, goldMat, yellowMat, pinkMat) {
    const swingRoot = new THREE.Group();
    swingRoot.position.set(-2.0, 3.8, 2.0); // Pivot at ceiling height

    // Ceiling Mount Plates
    const plateGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 8);
    const p1 = new THREE.Mesh(plateGeo, goldMat); p1.position.set(-1.0, 0, -0.4); swingRoot.add(p1);
    const p2 = new THREE.Mesh(plateGeo, goldMat); p2.position.set(1.0, 0, -0.4); swingRoot.add(p2);
    const p3 = new THREE.Mesh(plateGeo, goldMat); p3.position.set(-1.0, 0, 0.4); swingRoot.add(p3);
    const p4 = new THREE.Mesh(plateGeo, goldMat); p4.position.set(1.0, 0, 0.4); swingRoot.add(p4);

    // Brass Suspension Chains
    const chainGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.9, 6);
    const c1 = new THREE.Mesh(chainGeo, goldMat); c1.position.set(-1.0, -1.45, -0.4); swingRoot.add(c1);
    const c2 = new THREE.Mesh(chainGeo, goldMat); c2.position.set(1.0, -1.45, -0.4); swingRoot.add(c2);
    const c3 = new THREE.Mesh(chainGeo, goldMat); c3.position.set(-1.0, -1.45, 0.4); swingRoot.add(c3);
    const c4 = new THREE.Mesh(chainGeo, goldMat); c4.position.set(1.0, -1.45, 0.4); swingRoot.add(c4);

    // Carved Teakwood Swing Seat Platform
    const seatPlatform = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.1), teakWoodMat);
    seatPlatform.position.set(0, -2.9, 0);
    seatPlatform.castShadow = true;
    swingRoot.add(seatPlatform);

    // Carved Backrest & Side Armrests
    const backRest = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.55, 0.08), teakWoodMat);
    backRest.position.set(0, -2.6, -0.5);
    swingRoot.add(backRest);

    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 1.0), darkWoodMat);
    armL.position.set(-1.16, -2.7, 0);
    swingRoot.add(armL);
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 1.0), darkWoodMat);
    armR.position.set(1.16, -2.7, 0);
    swingRoot.add(armR);

    // Silk Cushion (ગાદી)
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.95), yellowMat);
    cushion.position.set(0, -2.8, 0);
    swingRoot.add(cushion);

    // Cylindrical Bolsters (ઓશિકા)
    const bolsterGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.7, 12);
    const bL = new THREE.Mesh(bolsterGeo, pinkMat);
    bL.rotation.z = Math.PI / 2;
    bL.position.set(-0.7, -2.68, 0);
    swingRoot.add(bL);

    const bR = new THREE.Mesh(bolsterGeo, pinkMat);
    bR.rotation.z = Math.PI / 2;
    bR.position.set(0.7, -2.68, 0);
    swingRoot.add(bR);

    group.add(swingRoot);
    this.hinchkoSwings.push(swingRoot);
  }

  // 2. Brass Urli with Floating Flower Petals (પીતળની ઉરલી)
  buildUrliWithPetals(group, goldMat) {
    const urliGroup = new THREE.Group();
    urliGroup.position.set(3.8, 0.15, 2.2);

    // Ornate Brass Bowl
    const bowlGeo = new THREE.CylinderGeometry(0.65, 0.42, 0.28, 16);
    const bowl = new THREE.Mesh(bowlGeo, goldMat);
    urliGroup.add(bowl);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.04, 6, 16), goldMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.14;
    urliGroup.add(rim);

    // Translucent Water
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, transparent: true, opacity: 0.8 });
    const water = new THREE.Mesh(new THREE.CircleGeometry(0.6, 16), waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.12;
    urliGroup.add(water);

    // Floating Rose & Marigold Petals
    const roseMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4, side: THREE.DoubleSide });
    const marigoldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, side: THREE.DoubleSide });

    const petalAngles = [0, 0.8, 1.6, 2.4, 3.2, 4.0, 4.8, 5.6];
    petalAngles.forEach((ang, idx) => {
      const rad = 0.2 + (idx % 3) * 0.14;
      const pet = new THREE.Mesh(new THREE.CircleGeometry(0.08, 8), idx % 2 === 0 ? roseMat : marigoldMat);
      pet.rotation.x = -Math.PI / 2;
      pet.position.set(Math.cos(ang) * rad, 0.13, Math.sin(ang) * rad);
      urliGroup.add(pet);
    });

    group.add(urliGroup);
  }

  // 3. Earthen Matka on Stand with Brass Tap (માટલું અને નળ)
  buildMatkaWithTap(group, terracottaMat, goldMat, darkWoodMat) {
    const matkaGroup = new THREE.Group();
    matkaGroup.position.set(-7.5, 0, -4.2);

    // Black Iron Tripod Stand
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.3 });
    const standRing = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.03, 6, 16), ironMat);
    standRing.rotation.x = Math.PI / 2;
    standRing.position.y = 0.55;
    matkaGroup.add(standRing);

    for (let i = 0; i < 3; i++) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.58, 6), ironMat);
      const a = (i * Math.PI * 2) / 3;
      leg.position.set(Math.cos(a) * 0.35, 0.28, Math.sin(a) * 0.35);
      matkaGroup.add(leg);
    }

    // Terracotta Matka Sphere
    const pot = new THREE.Mesh(new THREE.SphereGeometry(0.44, 16, 16), terracottaMat);
    pot.position.y = 0.88;
    matkaGroup.add(pot);

    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.1, 12), terracottaMat);
    lid.position.y = 1.34;
    matkaGroup.add(lid);

    // Shiny Brass Tap
    const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.2, 6), goldMat);
    tap.rotation.x = Math.PI / 2;
    tap.position.set(0, 0.72, 0.44);
    matkaGroup.add(tap);

    // Brass Drinking Glass
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.22, 10), goldMat);
    glass.position.set(0.48, 0.65, 0.1);
    matkaGroup.add(glass);

    group.add(matkaGroup);
  }

  // 4. Marigold Flower Toran on Arch (ગલગોટા તોરણ)
  buildToran(group) {
    const toranGroup = new THREE.Group();
    toranGroup.position.set(0, 3.4, 0);

    const yellowMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const orangeMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 });

    const span = 10;
    const count = 16;
    for (let i = 0; i <= count; i++) {
      const frac = i / count;
      const x = -span / 2 + frac * span;
      const droop = -Math.sin(frac * Math.PI) * 0.4;
      const fl = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), i % 2 === 0 ? yellowMat : orangeMat);
      fl.position.set(x, droop, 0);
      toranGroup.add(fl);

      if (i % 3 === 0) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.16, 4), leafMat);
        leaf.rotation.x = Math.PI;
        leaf.position.set(x, droop - 0.1, 0);
        toranGroup.add(leaf);
      }
    }
    group.add(toranGroup);
  }

  // 5. Secret Passage 1: 1F Kitchen Ration Pantry (રસોડાનો કબાટ)
  buildSecretPantryCabinet(group, darkWoodMat, goldMat) {
    const cabGroup = new THREE.Group();
    cabGroup.position.set(-13.0, 0, -4.2);

    // Outer Cabinet Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.4, 1.0), darkWoodMat);
    body.position.y = 1.2;
    cabGroup.add(body);

    // Double Wooden Doors with Slats
    const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.68, 2.2, 0.08), darkWoodMat);
    doorL.position.set(-0.36, 1.2, 0.52);
    cabGroup.add(doorL);

    const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.68, 2.2, 0.08), darkWoodMat);
    doorR.position.set(0.36, 1.2, 0.52);
    cabGroup.add(doorR);

    // Brass Handles & Vintage Latch
    const handleL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2, 6), goldMat);
    handleL.position.set(-0.1, 1.2, 0.58);
    cabGroup.add(handleL);

    const handleR = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2, 6), goldMat);
    handleR.position.set(0.1, 1.2, 0.58);
    cabGroup.add(handleR);

    const latch = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.04), goldMat);
    latch.position.set(0, 1.4, 0.58);
    cabGroup.add(latch);

    // Subtle Gujju Brass Plaque
    const plaque = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.12, 0.02), goldMat);
    plaque.position.set(0, 2.25, 0.52);
    cabGroup.add(plaque);

    group.add(cabGroup);
  }

  // 6. Secret Passage 2: 1F Dadi's Heirloom Trunk (દાદીની પેટી)
  buildSecretDadiTrunk(group, darkWoodMat, goldMat) {
    const trunkGroup = new THREE.Group();
    trunkGroup.position.set(6.5, 0, -4.2);

    // Sturdy Wooden Trunk Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.75, 1.1), darkWoodMat);
    body.position.y = 0.38;
    trunkGroup.add(body);

    // Domed Curved Lid
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.6, 12, 1, false, 0, Math.PI), darkWoodMat);
    lid.rotation.z = Math.PI / 2;
    lid.position.set(0, 0.75, 0);
    trunkGroup.add(lid);

    // Brass Corner Brackets & Trim Straps
    const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.76, 1.12), goldMat);
    strapL.position.set(-0.55, 0.38, 0);
    trunkGroup.add(strapL);

    const strapR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.76, 1.12), goldMat);
    strapR.position.set(0.55, 0.38, 0);
    trunkGroup.add(strapR);

    // Big Brass Padlock & Hasp
    const lock = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.1), goldMat);
    lock.position.set(0, 0.68, 0.58);
    trunkGroup.add(lock);

    // Side Brass Carry Handles
    const handleL = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 6, 12), goldMat);
    handleL.position.set(-0.82, 0.45, 0);
    trunkGroup.add(handleL);

    const handleR = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 6, 12), goldMat);
    handleR.position.set(0.82, 0.45, 0);
    trunkGroup.add(handleR);

    group.add(trunkGroup);
  }

  // 7. Secret Passage 3: 2F Bedroom Vintage Almari (મોટો કબાટ)
  buildSecretVintageAlmari(group, darkWoodMat, goldMat, teakWoodMat) {
    const almariGroup = new THREE.Group();
    almariGroup.position.set(6.2, 0, -4.5);

    // Almari Main Cabinet
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.7, 1.0), darkWoodMat);
    body.position.y = 1.35;
    almariGroup.add(body);

    // Carved Top Arch Pediment / Crown
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.12, 16, 1, false, 0, Math.PI), teakWoodMat);
    crown.rotation.z = Math.PI / 2;
    crown.position.set(0, 2.7, 0.45);
    almariGroup.add(crown);

    // Left Door (Carved Wood Panels)
    const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.82, 2.4, 0.08), teakWoodMat);
    doorL.position.set(-0.43, 1.3, 0.52);
    almariGroup.add(doorL);

    // Right Door with Dressing Mirror
    const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.82, 2.4, 0.08), teakWoodMat);
    doorR.position.set(0.43, 1.3, 0.52);
    almariGroup.add(doorR);

    // Mirror Glass Panel on Right Door
    const mirrorMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, metalness: 0.95, roughness: 0.05 });
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.9, 0.02), mirrorMat);
    mirror.position.set(0.43, 1.35, 0.57);
    almariGroup.add(mirror);

    // Brass Handles & Keyhole
    const lock = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.05, 8), goldMat);
    lock.rotation.x = Math.PI / 2;
    lock.position.set(-0.06, 1.3, 0.58);
    almariGroup.add(lock);

    const pull = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 6, 10), goldMat);
    pull.position.set(-0.06, 1.22, 0.6);
    almariGroup.add(pull);

    group.add(almariGroup);
  }

  // 8. Secret Passage 4: 3F Rooftop Secret Trapdoor (ધાબાનો ચોર દરવાજો)
  buildSecretTrapdoor(group, darkWoodMat, steelMat, goldMat) {
    const trapGroup = new THREE.Group();
    trapGroup.position.set(-7.5, 0.02, -1.5);

    // Wooden Trapdoor Planks Frame
    const hatch = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 1.4), darkWoodMat);
    trapGroup.add(hatch);

    // Iron Straps & Rivets
    const strap1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 1.42), steelMat);
    strap1.position.set(-0.45, 0.01, 0);
    trapGroup.add(strap1);

    const strap2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 1.42), steelMat);
    strap2.position.set(0.45, 0.01, 0);
    trapGroup.add(strap2);

    // Brass Iron Pull Ring
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 6, 12), goldMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 0.06, 0);
    trapGroup.add(ring);

    group.add(trapGroup);
  }

  // 9. Sintex Rooftop Water Tank (પાણીની ટાંકી)
  buildSintexWaterTank(group) {
    const tankGroup = new THREE.Group();
    tankGroup.position.set(-13.0, 0, 3.5);

    const blackPlasticMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 });
    const whiteTextMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    const pvcPipeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3 });

    // Main Cylindrical Body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.9, 18), blackPlasticMat);
    body.position.y = 0.95;
    tankGroup.add(body);

    // Molded Rib Rings
    for (let i = 0; i < 3; i++) {
      const rib = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.04, 6, 18), blackPlasticMat);
      rib.rotation.x = Math.PI / 2;
      rib.position.y = 0.5 + i * 0.45;
      tankGroup.add(rib);
    }

    // Top Screwed Lid
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.15, 16), blackPlasticMat);
    lid.position.y = 1.95;
    tankGroup.add(lid);

    // White "SINTEX" Brand Band
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.91, 0.91, 0.22, 18), whiteTextMat);
    band.position.y = 1.25;
    tankGroup.add(band);

    // PVC Connecting Water Pipe down to floor
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 8), pvcPipeMat);
    pipe.position.set(0.92, 0.9, 0);
    tankGroup.add(pipe);

    group.add(tankGroup);
  }

  // 10. Stacked Heirloom Trunks in 2F Living (ટ્રંકનો થપ્પો)
  buildStackedTrunks(group, steelMat, goldMat, teakWoodMat) {
    const stackGroup = new THREE.Group();
    stackGroup.position.set(10.5, 0, 2.2);

    // Bottom Large Steel Trunk
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.55, 0.9), steelMat);
    b1.position.y = 0.275;
    stackGroup.add(b1);

    // Middle Teal Painted Trunk
    const tealMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.5 });
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.45, 0.75), tealMat);
    b2.position.y = 0.55 + 0.225;
    stackGroup.add(b2);

    // Top Brass Heirloom Chest
    const b3 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.35, 0.6), goldMat);
    b3.position.y = 1.0 + 0.175;
    stackGroup.add(b3);

    group.add(stackGroup);
  }

  createTaskMarkers() {
    const floorHeights = [0, 8, 16];

    const markersData = [
      // Floor 0: Ground Floor Tasks & Navigation
      { id: "HS_CHAI", text: "☕ Kitchen: Make Chai", x: -10.5, z: -4.2, floor: 0, color: "#F59E0B" },
      { id: "HS_RANGOLI", text: "🌸 Veranda: Rangoli", x: 0, z: 1.5, floor: 0, color: "#EC4899" },
      { id: "HS_VERANDA", text: "👡 Veranda: Shoe Rack", x: 6.5, z: 1.5, floor: 0, color: "#FBBF24" },
      { id: "HS_STORE_ACHAR", text: "🏺 Store: Achar Jars", x: 8.2, z: -4.2, floor: 0, color: "#D97706" },
      { id: "HS_SWITCHES", text: "⚡ 1F Ground Power Board", x: 9.8, z: -4.5, floor: 0, color: "#EF4444" },
      { id: "HS_STAIRS_G_UP", text: "🪜 Go Up to 2F (Stairwell)", x: 13.2, z: -0.5, floor: 0, color: "#10B981" },

      // Floor 1: Middle Floor Tasks & Central Meeting Hub
      { id: "HS_HOMEWORK", text: "📚 Study: Math Homework", x: -10.5, z: -4.0, floor: 1, color: "#3B82F6" },
      { id: "HS_BALCONY", text: "🌿 Balcony: Water Tulsi", x: -13.5, z: 2.5, floor: 1, color: "#10B981" },
      { id: "HS_PHONE_BOX", text: "📦 Phone Lock Box (Meeting)", x: 0, z: -1.8, floor: 1, color: "#06B6D4" },
      { id: "HS_BED_1", text: "🛏️ Bedroom: Fold Bed", x: 8.2, z: -3.2, floor: 1, color: "#F43F5E" },
      { id: "HS_FUSE_2F", text: "⚡ 2F Hall Switchboard", x: 4.5, z: -4.5, floor: 1, color: "#EF4444" },
      { id: "HS_STAIRS_HUB_DOWN", text: "🪜 Go Down to 1F", x: 12.8, z: -2.5, floor: 1, color: "#10B981" },
      { id: "HS_STAIRS_HUB_UP", text: "🪜 Go Up to 3F", x: 13.4, z: 1.5, floor: 1, color: "#10B981" },

      // Floor 2: Top Terrace Tasks & Navigation
      { id: "HS_SOLAR", text: "☀️ Roof: Solar Panels", x: -10.0, z: -3.5, floor: 2, color: "#06B6D4" },
      { id: "HS_CLOTHES", text: "🧺 Terrace: Fold Sarees", x: 0, z: 0.5, floor: 2, color: "#8B5CF6" },
      { id: "HS_FUSE_3F", text: "⚡ 3F Solar Inverter & Fuse", x: 7.5, z: -4.0, floor: 2, color: "#EF4444" },
      { id: "HS_STAIRS_T", text: "🪜 Go Down to 2F (Stairwell)", x: 13.2, z: -0.5, floor: 2, color: "#10B981" }
    ];

    markersData.forEach((data) => {
      const sprite = this.createFloatingMarkerSprite(data.text, data.color);
      const baseY = floorHeights[data.floor] + 2.5;
      sprite.position.set(data.x, baseY, data.z);
      this.scene.add(sprite);

      this.taskMarkers.push({
        sprite,
        baseY,
        floor: data.floor,
        id: data.id,
        x: data.x,
        z: data.z
      });
    });
  }

  createFloatingMarkerSprite(text, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 340;
    canvas.height = 95;
    const ctx = canvas.getContext('2d');

    // Glowing Pill Background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 324, 60, 16);
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Text Label
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 170, 38);

    // Pointer Pin
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(160, 68);
    ctx.lineTo(180, 68);
    ctx.lineTo(170, 86);
    ctx.closePath();
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(3.2, 0.9, 1);
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

    // Gentle oscillating swing physics for Gujarati Hinchko
    this.hinchkoSwings.forEach((swing) => {
      swing.rotation.x = Math.sin(this.markerTime * 1.6) * 0.07;
    });

    // Steam bobbing on Chai Pot
    if (this.steamingChaiPot) {
      this.steamingChaiPot.rotation.y += dt * 0.5;
    }
  }
}
