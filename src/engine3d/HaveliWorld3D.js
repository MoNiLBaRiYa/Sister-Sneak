/**
 * Sister Sneak 3D - Haveli Mansion 3D Isometric Environment
 * Renders an authentic 3-Floor Indian Joint-Family Haveli with real physical room props:
 * Kitchen Stove & Chai Strainer, Study Desk & Math Workbook, Bed & Quilt,
 * Balcony Tulsi Kyaro, Terrace Clotheslines with swaying Sarees, Solar Panels,
 * Gujarati Barni Pickle Jars, Floor Rangoli, Shoe Rack, and Phone Lock Box.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class HaveliWorld3D {
  constructor(scene, lighting) {
    this.scene = scene;
    this.lighting = lighting;

    this.floorGroups = [];
    this.taskMarkers = [];
    this.clotheslines = [];
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
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.8 });
    const graniteMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
    const fabricPinkMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.8 });
    const fabricBlueMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.8 });
    const fabricYellowMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.8 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 });
    const ceramicWhiteMat = new THREE.MeshStandardMaterial({ color: 0xfef9c3, roughness: 0.3 });
    const plantMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });

    // =========================================================================
    // FLOOR 0: GROUND FLOOR (Entry Veranda, Courtyard, Kitchen, Store Room)
    // =========================================================================
    const g0 = new THREE.Group();

    // Floor Base Slab
    const slab0 = new THREE.Mesh(new THREE.BoxGeometry(width, 0.4, depth), marbleMat);
    slab0.position.y = -0.2;
    slab0.receiveShadow = true;
    g0.add(slab0);

    // Decorative Back Wall with Carved Arch Trim
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

    // Low Open Dividers (0.8m height so player & furniture are 100% visible)
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
    const storeShelf = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.15, 1.4), darkWoodMat);
    storeShelf.position.set(10.5, 0.9, -4.5);
    g0.add(storeShelf);

    for (let i = -1; i <= 1; i++) {
      // Ceramic Barni Body (White/Cream base)
      const barni = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.7, 16), ceramicWhiteMat);
      barni.position.set(10.5 + i * 1.1, 1.35, -4.5);
      barni.castShadow = true;
      g0.add(barni);

      // Mustard/Yellow Cloth Lid
      const barniCap = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 0.2, 16), fabricYellowMat);
      barniCap.position.set(10.5 + i * 1.1, 1.75, -4.5);
      g0.add(barniCap);
    }

    // 5. 💡 1F Ground Power Board
    const fuseBox0 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.2), steelMat);
    fuseBox0.position.set(13.5, 2.0, -3.5);
    g0.add(fuseBox0);

    const led0 = new THREE.Mesh(new THREE.SphereGeometry(0.06), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    led0.position.set(13.5, 2.4, -3.38);
    g0.add(led0);

    this.scene.add(g0);
    this.floorGroups.push(g0);

    // =========================================================================
    // FLOOR 1: MIDDLE FLOOR (Living Hub, Study Desk, Bedrooms, Balcony)
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

    // 3. 🛏️ Sisters' Bedroom Bed with Rumpled Quilt & Pillows (Right Room)
    const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.6, 4.4), darkWoodMat);
    bedFrame.position.set(10.5, 0.3, -3.2);
    g1.add(bedFrame);

    const mattress = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.4, 4.1), fabricPinkMat);
    mattress.position.set(10.5, 0.7, -3.2);
    g1.add(mattress);

    const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 0.8), fabricYellowMat);
    pillow1.position.set(9.4, 0.95, -4.8);
    g1.add(pillow1);

    const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 0.8), fabricYellowMat);
    pillow2.position.set(11.6, 0.95, -4.8);
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

    this.scene.add(g1);
    this.floorGroups.push(g1);

    // =========================================================================
    // FLOOR 2: TOP TERRACE (Drying Sarees, Solar Panels, Inverter)
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

    // 1. 🧺 Clotheslines & Fluttering Sarees with Laundry Basket (Center Patio)
    const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 8), darkWoodMat);
    postL.position.set(-6, 1.2, 0.5);
    g2.add(postL);

    const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 8), darkWoodMat);
    postR.position.set(6, 1.2, 0.5);
    g2.add(postR);

    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 12, 6), steelMat);
    wire.rotation.z = Math.PI / 2;
    wire.position.set(0, 2.2, 0.5);
    g2.add(wire);

    // Swaying Dupattas
    const cloth1 = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), fabricPinkMat);
    cloth1.position.set(-3, 1.4, 0.5);
    g2.add(cloth1);
    this.clotheslines.push(cloth1);

    const cloth2 = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), fabricBlueMat);
    cloth2.position.set(0.5, 1.4, 0.5);
    g2.add(cloth2);
    this.clotheslines.push(cloth2);

    const cloth3 = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), fabricYellowMat);
    cloth3.position.set(3.8, 1.4, 0.5);
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

    // 3. ⚡ 3F Solar Inverter Switchboard
    const fuseBox2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.2), steelMat);
    fuseBox2.position.set(10.0, 2.0, -4.0);
    g2.add(fuseBox2);

    const led2 = new THREE.Mesh(new THREE.SphereGeometry(0.06), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    led2.position.set(10.0, 2.4, -3.88);
    g2.add(led2);

    this.scene.add(g2);
    this.floorGroups.push(g2);
  }

  createTaskMarkers() {
    const floorHeights = [0, 8, 16];

    const markersData = [
      // Floor 0: Ground Floor Tasks
      { id: "HS_CHAI", text: "☕ Kitchen: Make Chai", x: -10.5, z: -4.2, floor: 0, color: "#F59E0B" },
      { id: "HS_RANGOLI", text: "🌸 Veranda: Rangoli", x: 0, z: 1.5, floor: 0, color: "#EC4899" },
      { id: "HS_VERANDA", text: "👡 Veranda: Shoe Rack", x: 6.5, z: 1.5, floor: 0, color: "#FBBF24" },
      { id: "HS_STORE_ACHAR", text: "🏺 Store: Achar Jars", x: 10.5, z: -4.2, floor: 0, color: "#D97706" },
      { id: "HS_SWITCHES", text: "⚡ 1F Power Board", x: 13.5, z: -3.5, floor: 0, color: "#EF4444" },

      // Floor 1: Middle Floor Tasks
      { id: "HS_HOMEWORK", text: "📚 Study: Math Homework", x: -10.5, z: -4.0, floor: 1, color: "#3B82F6" },
      { id: "HS_BALCONY", text: "🌿 Balcony: Water Tulsi", x: -13.5, z: 2.5, floor: 1, color: "#10B981" },
      { id: "HS_PHONE_BOX", text: "📦 Phone Lock Box (Meeting)", x: 0, z: -1.8, floor: 1, color: "#06B6D4" },
      { id: "HS_BED_1", text: "🛏️ Bedroom: Fold Bed", x: 10.5, z: -3.2, floor: 1, color: "#F43F5E" },
      { id: "HS_FUSE_2F", text: "⚡ 2F Hall Switchboard", x: 4.5, z: -4.5, floor: 1, color: "#EF4444" },

      // Floor 2: Top Terrace Tasks
      { id: "HS_CLOTHES", text: "🧺 Terrace: Fold Sarees", x: 0, z: 0.5, floor: 2, color: "#8B5CF6" },
      { id: "HS_SOLAR", text: "☀️ Roof: Solar Panels", x: -10.0, z: -3.5, floor: 2, color: "#06B6D4" },
      { id: "HS_FUSE_3F", text: "⚡ 3F Solar Inverter", x: 10.0, z: -4.0, floor: 2, color: "#EF4444" }
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
    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
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

    // Steam bobbing on Chai Pot
    if (this.steamingChaiPot) {
      this.steamingChaiPot.rotation.y += dt * 0.5;
    }
  }
}
