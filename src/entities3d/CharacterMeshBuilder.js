/**
 * Sister Sneak 3D - High-Quality Expressive Chibi 3D Character Mesh Builder
 * Builds adorable, stylized 3D models with cute anime/chibi proportions:
 * Big sparkling eyes with dual highlights, happy smiling mouths, blushing rosy cheeks,
 * multi-layered hair with front bangs & tendrils, authentic Indian Kurtis with gold zari trim,
 * traditional Mojari shoes, and distinct signature accessories for every sister and Mummy.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class CharacterMeshBuilder {
  // Helper: Generates high-contrast, vibrant Gujarati Bandhani Canvas Texture
  static createBandhaniTexture(baseColorHex = "#B91C1C", dotColorHex = "#FDE047") {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Rich Royal Maroon/Crimson Silk Fabric Base
    ctx.fillStyle = baseColorHex;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle fabric weave texture
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    for (let y = 0; y < 512; y += 4) {
      ctx.fillRect(0, y, 512, 2);
    }

    // Traditional Gujarati Bandhani "Chaukadi" Diamond Clusters
    const clusterStep = 64;
    for (let x = 32; x < 512; x += clusterStep) {
      for (let y = 32; y < 512; y += clusterStep) {
        // Center Large Golden Sun Dot
        ctx.fillStyle = dotColorHex; // Bright Gold
        ctx.beginPath();
        ctx.arc(x, y, 7.5, 0, Math.PI * 2);
        ctx.fill();

        // Surrounding 4-dot Diamond Motif (Crisp White & Gold)
        ctx.fillStyle = "#FFFFFF";
        const dist = 16;
        const subDist = 11;
        // Cardinal Dots
        [
          [x + dist, y], [x - dist, y], [x, y + dist], [x, y - dist]
        ].forEach(([px, py]) => {
          ctx.beginPath();
          ctx.arc(px, py, 4.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Diagonal Golden Dots
        ctx.fillStyle = dotColorHex;
        [
          [x + subDist, y + subDist], [x - subDist, y + subDist],
          [x + subDist, y - subDist], [x - subDist, y - subDist]
        ].forEach(([px, py]) => {
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 3);
    return texture;
  }

  static createSisterMesh(config) {
    const root = new THREE.Group();

    // 1. Color Palette & Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfbd38d,
      roughness: 0.45,
      metalness: 0.05
    });
    const hairColorHex = config.hairColor || "#1E1B18";
    const hairMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(hairColorHex),
      roughness: 0.4,
      metalness: 0.1
    });
    const dressColorHex = config.dressColor || config.color || "#F472B6";
    const dressMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(dressColorHex),
      roughness: 0.45,
      metalness: 0.08
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.25,
      metalness: 0.85
    });
    const whiteFabricMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.5
    });
    const shoeMat = new THREE.MeshStandardMaterial({
      color: 0x92400e,
      roughness: 0.35,
      metalness: 0.3
    });
    const blushMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.55
    });
    const bindiMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0xe11d48 });
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyeIrisMat = new THREE.MeshBasicMaterial({ color: 0x1c1917 });
    const eyeShineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lashMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });

    // Dedicated Contrasting Silk Dupatta Material (Royal Fuchsia / Magenta)
    const dupattaMat = new THREE.MeshStandardMaterial({
      color: 0xdb2777, // Vibrant Royal Magenta Pink
      roughness: 0.35,
      metalness: 0.15
    });

    // 2. Soft Circular Ground Shadow
    const shadowGeo = new THREE.PlaneGeometry(1.4, 1.4);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    root.add(shadow);

    // =========================================================================
    // 3. TORSO & ETHNIC KURTI DRESS (Sleek, Natural Tailored Indian Silhouette)
    // =========================================================================
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 0.92;

    // Upper Kurti Bodice (Flat-front anatomical depth, wider shoulders)
    const bodiceGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.44, 18);
    bodiceGeo.scale(1.0, 1.0, 0.62); // Flattened front-to-back depth
    const upperBodice = new THREE.Mesh(bodiceGeo, dressMat);
    upperBodice.position.y = 0.22;
    upperBodice.castShadow = true;
    torsoGroup.add(upperBodice);

    // Golden V-Neckline / Collar Trim
    const collar = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.024, 8, 16, Math.PI),
      goldMat
    );
    collar.position.set(0, 0.41, 0.09);
    collar.rotation.x = -Math.PI / 3;
    torsoGroup.add(collar);

    // Kurti Button Patti / Center Embroidery
    const pattiGeo = new THREE.BoxGeometry(0.04, 0.26, 0.02);
    const patti = new THREE.Mesh(pattiGeo, goldMat);
    patti.position.set(0, 0.22, 0.12);
    torsoGroup.add(patti);

    // Sleek Tailored Kurti Tunic (A-line with side slits, natural hip contour, NO round bell)
    const tunicGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.38, 18);
    tunicGeo.scale(1.0, 1.0, 0.62);
    const tunic = new THREE.Mesh(tunicGeo, dressMat);
    tunic.position.y = -0.16;
    tunic.castShadow = true;
    torsoGroup.add(tunic);

    // Golden Zari Hem Border on Kurti Bottom
    const hemGeo = new THREE.CylinderGeometry(0.262, 0.262, 0.035, 18, 1, true);
    hemGeo.scale(1.0, 1.0, 0.62);
    const hemTrim = new THREE.Mesh(hemGeo, goldMat);
    hemTrim.position.y = -0.34;
    torsoGroup.add(hemTrim);

    root.add(torsoGroup);
    root.torso = torsoGroup;

    // =========================================================================
    // 4. HEAD, EXPRESSIVE ANIME/CHIBI FACE & HAIR
    // =========================================================================
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.58;

    // Cute Chibi Head Sphere
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 28, 28),
      skinMat
    );
    head.castShadow = true;
    headGroup.add(head);
    root.head = headGroup;

    // Cute Rounded Ears on both sides
    const earGeo = new THREE.SphereGeometry(0.09, 12, 12);
    earGeo.scale(0.6, 1.2, 0.8);
    const leftEar = new THREE.Mesh(earGeo, skinMat);
    leftEar.position.set(0.41, 0, 0);
    headGroup.add(leftEar);
    const rightEar = new THREE.Mesh(earGeo, skinMat);
    rightEar.position.set(-0.41, 0, 0);
    headGroup.add(rightEar);

    // Gold Stud Earring Pins
    const studGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const leftStud = new THREE.Mesh(studGeo, goldMat);
    leftStud.position.set(0.44, -0.04, 0.02);
    headGroup.add(leftStud);
    const rightStud = new THREE.Mesh(studGeo, goldMat);
    rightStud.position.set(-0.44, -0.04, 0.02);
    headGroup.add(rightStud);

    // --- Eyes Group (Supports Natural Blinking) ---
    const eyesGroup = new THREE.Group();
    eyesGroup.position.set(0, 0.02, 0.35);

    // Helper: Build one Cute Sparkling Chibi Eye
    const createChibiEye = (isRight) => {
      const eyeRoot = new THREE.Group();
      const xOffset = isRight ? 0.14 : -0.14;
      eyeRoot.position.set(xOffset, 0, 0);

      // Eye White Base
      const eyeWhite = new THREE.Mesh(
        new THREE.SphereGeometry(0.095, 16, 16),
        eyeWhiteMat
      );
      eyeWhite.scale.set(1.0, 1.15, 0.4);
      eyeRoot.add(eyeWhite);

      // Dark Glossy Iris
      const iris = new THREE.Mesh(
        new THREE.SphereGeometry(0.065, 14, 14),
        eyeIrisMat
      );
      iris.scale.set(1.0, 1.15, 0.5);
      iris.position.set(isRight ? -0.01 : 0.01, -0.01, 0.02);
      eyeRoot.add(iris);

      // Primary Catchlight / Specular Shine (Top-Right)
      const shinePrimary = new THREE.Mesh(
        new THREE.SphereGeometry(0.026, 8, 8),
        eyeShineMat
      );
      shinePrimary.position.set(0.022, 0.032, 0.045);
      eyeRoot.add(shinePrimary);

      // Secondary Smaller Catchlight (Bottom-Left)
      const shineSecondary = new THREE.Mesh(
        new THREE.SphereGeometry(0.014, 6, 6),
        eyeShineMat
      );
      shineSecondary.position.set(-0.02, -0.03, 0.045);
      eyeRoot.add(shineSecondary);

      // Upper Eyelash Arc
      const upperLash = new THREE.Mesh(
        new THREE.TorusGeometry(0.085, 0.016, 6, 12, Math.PI * 0.75),
        lashMat
      );
      upperLash.rotation.z = isRight ? 0.4 : Math.PI - 0.4;
      upperLash.position.set(0, 0.055, 0.03);
      eyeRoot.add(upperLash);

      return eyeRoot;
    };

    const leftEyeMesh = createChibiEye(false);
    const rightEyeMesh = createChibiEye(true);
    eyesGroup.add(leftEyeMesh);
    eyesGroup.add(rightEyeMesh);
    headGroup.add(eyesGroup);
    root.eyes = eyesGroup;

    // Rosy Blushed Cheeks
    const leftBlush = new THREE.Mesh(new THREE.CircleGeometry(0.065, 12), blushMat);
    leftBlush.position.set(-0.21, -0.09, 0.36);
    leftBlush.rotation.y = -0.35;
    headGroup.add(leftBlush);

    const rightBlush = new THREE.Mesh(new THREE.CircleGeometry(0.065, 12), blushMat);
    rightBlush.position.set(0.21, -0.09, 0.36);
    rightBlush.rotation.y = 0.35;
    headGroup.add(rightBlush);

    // Delicate Eyebrows
    const browGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.11, 6);
    const leftBrow = new THREE.Mesh(browGeo, hairMat);
    leftBrow.rotation.z = -0.2;
    leftBrow.position.set(-0.14, 0.16, 0.38);
    headGroup.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeo, hairMat);
    rightBrow.rotation.z = 0.2;
    rightBrow.position.set(0.14, 0.16, 0.38);
    headGroup.add(rightBrow);

    // Red Chandlo / Bindi (Center Forehead)
    const bindi = new THREE.Mesh(new THREE.CircleGeometry(0.045, 14), bindiMat);
    bindi.position.set(0, 0.15, 0.41);
    headGroup.add(bindi);

    // Happy Uplifting Cute Smiling Mouth (Never an upside down frown!)
    const mouthGeo = new THREE.TorusGeometry(0.042, 0.012, 6, 16, Math.PI);
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, -0.13, 0.39);
    mouth.rotation.z = Math.PI; // Invert to create an upward happy smile
    mouth.rotation.x = -Math.PI / 10;
    headGroup.add(mouth);

    // =========================================================================
    // 5. VOLUMINOUS HAIR WITH LAYERED FRONT BANGS & SIGNATURE HAIRSTYLES
    // =========================================================================
    const hairGroup = new THREE.Group();

    // Main Hair Crown
    const hairCrown = new THREE.Mesh(
      new THREE.SphereGeometry(0.44, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.58),
      hairMat
    );
    hairCrown.position.set(0, 0.04, -0.02);
    hairGroup.add(hairCrown);

    // Layered Front Bangs / Fringe (Frames forehead beautifully)
    for (let i = -2; i <= 2; i++) {
      const bang = new THREE.Mesh(
        new THREE.ConeGeometry(0.09, 0.24, 8),
        hairMat
      );
      bang.rotation.x = Math.PI * 0.9;
      bang.rotation.z = i * 0.18;
      bang.position.set(i * 0.09, 0.24, 0.34);
      hairGroup.add(bang);
    }

    // Side Hair Tendrils (Framing Cheeks)
    const tendrilL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.015, 0.38, 8), hairMat);
    tendrilL.position.set(-0.38, 0, 0.15);
    tendrilL.rotation.z = -0.2;
    hairGroup.add(tendrilL);

    const tendrilR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.015, 0.38, 8), hairMat);
    tendrilR.position.set(0.38, 0, 0.15);
    tendrilR.rotation.z = 0.2;
    hairGroup.add(tendrilR);

    // -------------------------------------------------------------------------
    // CHARACTER SPECIFIC SIGNATURE HAIRSTYLES & ACCESSORIES
    // -------------------------------------------------------------------------
    if (config.id === "RIDDHI" || config.hairStyle === "two-braids") {
      // 🌸 Riddhi: Two Thick Glossy Braids with Pink Ribbons & Flowing Royal Magenta Dupatta
      const braidGeo = new THREE.CylinderGeometry(0.09, 0.04, 0.72, 8);
      const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 });

      // Left Braid
      const leftBraidGroup = new THREE.Group();
      leftBraidGroup.position.set(0.36, -0.05, -0.05);
      const leftBraid = new THREE.Mesh(braidGeo, hairMat);
      leftBraid.position.y = -0.32;
      leftBraidGroup.add(leftBraid);
      const leftRibbon = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 6, 12), ribbonMat);
      leftRibbon.position.set(0, -0.62, 0);
      leftBraidGroup.add(leftRibbon);
      hairGroup.add(leftBraidGroup);
      root.leftBraid = leftBraidGroup;

      // Right Braid
      const rightBraidGroup = new THREE.Group();
      rightBraidGroup.position.set(-0.36, -0.05, -0.05);
      const rightBraid = new THREE.Mesh(braidGeo, hairMat);
      rightBraid.position.y = -0.32;
      rightBraidGroup.add(rightBraid);
      const rightRibbon = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 6, 12), ribbonMat);
      rightRibbon.position.set(0, -0.62, 0);
      rightBraidGroup.add(rightRibbon);
      hairGroup.add(rightBraidGroup);
      root.rightBraid = rightBraidGroup;

      // Dangling Golden Jhumkas (Earrings with Ruby Pearls)
      const jhumkaGeo = new THREE.ConeGeometry(0.075, 0.12, 8);
      const jL = new THREE.Mesh(jhumkaGeo, goldMat);
      jL.position.set(0.44, -0.14, 0.06);
      headGroup.add(jL);
      const jR = new THREE.Mesh(jhumkaGeo, goldMat);
      jR.position.set(-0.44, -0.14, 0.06);
      headGroup.add(jR);

      // 1) Front Diagonal Silk Drape (Crossing chest to waist)
      const frontDrape = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.65, 0.04), dupattaMat);
      frontDrape.position.set(-0.06, 0.12, 0.15);
      frontDrape.rotation.z = -0.42;
      frontDrape.castShadow = true;
      torsoGroup.add(frontDrape);

      // Golden Zari lace border along front drape
      const frontLace = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.65, 0.045), goldMat);
      frontLace.position.set(-0.12, 0.12, 0.155);
      frontLace.rotation.z = -0.42;
      torsoGroup.add(frontLace);

      // 2) Left Shoulder Pleat / Gathered Shawl
      const shoulderShawl = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.36), dupattaMat);
      shoulderShawl.position.set(0.24, 0.28, 0);
      torsoGroup.add(shoulderShawl);

      // 3) Flowing Back Cape / Trailing Dupatta (Cascades down behind her)
      const backDrape = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.72, 0.04), dupattaMat);
      backDrape.position.set(0.12, -0.14, -0.16);
      backDrape.rotation.y = 0.15;
      backDrape.castShadow = true;
      torsoGroup.add(backDrape);

      // Golden Border along back drape hem
      const backHem = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.045), goldMat);
      backHem.position.set(0.12, -0.48, -0.16);
      torsoGroup.add(backHem);

    } else if (config.id === "SHRUTI" || config.hairStyle === "side-ponytail") {
      // 🎨 Shruti: Playful Wavy Bob with Layered Bangs + Artist's Paint Palette
      const bobBack = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), hairMat);
      bobBack.position.set(0, -0.08, -0.22);
      hairGroup.add(bobBack);

      // Side Flowing Tail
      const sidePony = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 14), hairMat);
      sidePony.position.set(0.38, 0.1, -0.12);
      hairGroup.add(sidePony);

      // Wooden Artist Paint Palette on waist
      const paletteMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.55 });
      const palette = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.04, 16), paletteMat);
      palette.rotation.z = Math.PI / 4;
      palette.position.set(-0.45, -0.06, 0.20);
      torsoGroup.add(palette);

      // 4 Bold Paint Blobs (Red, Yellow, Blue, Purple)
      const dabColors = [0xef4444, 0xfacc15, 0x3b82f6, 0xa855f7];
      dabColors.forEach((col, idx) => {
        const dab = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshBasicMaterial({ color: col }));
        dab.position.set(-0.12 + idx * 0.08, 0.03, (idx % 2 === 0 ? 0.04 : -0.04));
        palette.add(dab);
      });

      // Artist Paintbrush
      const brushHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.42, 6), new THREE.MeshStandardMaterial({ color: 0x78350f }));
      brushHandle.rotation.z = Math.PI / 3;
      brushHandle.position.set(0.36, 0.14, 0.12);
      headGroup.add(brushHandle);

      const brushTip = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.08, 6), goldMat);
      brushTip.position.set(0.52, 0.23, 0.12);
      brushTip.rotation.z = -Math.PI / 6;
      headGroup.add(brushTip);

    } else if (config.id === "JAHANVI" || config.hairStyle === "high-ponytail") {
      // 🎒 Jahanvi: High Bouncy Ponytail + Sports Headband + Travel Backpack
      const highPonyGroup = new THREE.Group();
      highPonyGroup.position.set(0, 0.38, -0.32);
      highPonyGroup.rotation.x = -0.55;

      const ponyMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.06, 0.8, 10), hairMat);
      ponyMesh.position.y = -0.38;
      highPonyGroup.add(ponyMesh);

      // Hair Tie
      const hairTie = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 6, 12), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
      highPonyGroup.add(hairTie);
      hairGroup.add(highPonyGroup);
      root.pony = highPonyGroup;

      // Cyan Athletic Headband
      const headband = new THREE.Mesh(
        new THREE.TorusGeometry(0.425, 0.04, 8, 24),
        new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3, emissive: 0x06b6d4, emissiveIntensity: 0.3 })
      );
      headband.position.set(0, 0.1, 0);
      headband.rotation.x = Math.PI / 2;
      headGroup.add(headband);

      // Adventurer Backpack on back
      const backpackMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.6 });
      const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.28), backpackMat);
      backpack.position.set(0, 0.15, -0.32);
      torsoGroup.add(backpack);

    } else if (config.id === "JISHA" || config.hairStyle === "cute-pigtails") {
      // 📚 Jisha: Adorable Twin Space Buns + Round Golden Glasses + Gujarati Notebook
      const bunGeo = new THREE.SphereGeometry(0.18, 14, 14);

      const leftBun = new THREE.Mesh(bunGeo, hairMat);
      leftBun.position.set(0.34, 0.38, -0.05);
      hairGroup.add(leftBun);

      const rightBun = new THREE.Mesh(bunGeo, hairMat);
      rightBun.position.set(-0.34, 0.38, -0.05);
      hairGroup.add(rightBun);

      // Golden Hairpin Pins
      const pinL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), goldMat);
      pinL.position.set(0.38, 0.46, 0.08);
      hairGroup.add(pinL);
      const pinR = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), goldMat);
      pinR.position.set(-0.38, 0.46, 0.08);
      hairGroup.add(pinR);

      // Stylish Round Golden Wireframe Spectacles (Glasses)
      const glassGeo = new THREE.TorusGeometry(0.12, 0.02, 8, 18);
      const leftGlass = new THREE.Mesh(glassGeo, goldMat);
      leftGlass.position.set(0.14, 0.02, 0.40);
      headGroup.add(leftGlass);

      const rightGlass = new THREE.Mesh(glassGeo, goldMat);
      rightGlass.position.set(-0.14, 0.02, 0.40);
      headGroup.add(rightGlass);

      const glassBridge = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12), goldMat);
      glassBridge.rotation.z = Math.PI / 2;
      glassBridge.position.set(0, 0.02, 0.42);
      headGroup.add(glassBridge);

      // Math Notebook in Arm
      const bookMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.4 });
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.44, 0.07), bookMat);
      book.position.set(0.35, 0, 0.2);
      book.rotation.set(0.3, 0.4, -0.2);
      torsoGroup.add(book);

    } else if (config.id === "JYEANA") {
      // ⚡ Jyeana: Sleek High Side-Ponytail + Glowing Cyan Smartwatch
      const highPony = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.05, 0.75, 10), hairMat);
      highPony.position.set(-0.28, 0.25, -0.25);
      highPony.rotation.set(-0.4, 0, -0.5);
      hairGroup.add(highPony);

      const ponyRibbon = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 6, 12), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
      ponyRibbon.position.set(-0.24, 0.45, -0.15);
      hairGroup.add(ponyRibbon);
    }

    headGroup.add(hairGroup);
    root.add(headGroup);

    // =========================================================================
    // 6. ARTICULATED ARMS & SLEEVES WITH CUTE HANDS
    // =========================================================================
    const armUpperGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.32, 10);
    const armLowerGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.30, 10);
    const handGeo = new THREE.SphereGeometry(0.08, 12, 12);
    handGeo.scale(0.8, 1.0, 0.7);

    // Left Arm Group
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(0.30, 1.18, 0);

    const leftUpperArm = new THREE.Mesh(armUpperGeo, dressMat);
    leftUpperArm.position.y = -0.14;
    leftUpperArm.castShadow = true;
    leftArmGroup.add(leftUpperArm);

    const leftLowerArm = new THREE.Mesh(armLowerGeo, skinMat);
    leftLowerArm.position.y = -0.38;
    leftLowerArm.castShadow = true;
    leftArmGroup.add(leftLowerArm);

    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.y = -0.54;
    leftArmGroup.add(leftHand);

    // Jyeana Glowing Smartwatch on Left Wrist
    if (config.id === "JYEANA") {
      const watchMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x06b6d4,
        emissiveIntensity: 1.5,
        roughness: 0.2
      });
      const watch = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.07, 12), watchMat);
      watch.position.set(0, -0.46, 0);
      leftArmGroup.add(watch);
    }

    root.add(leftArmGroup);
    root.leftArm = leftArmGroup;

    // Right Arm Group
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(-0.30, 1.18, 0);

    const rightUpperArm = new THREE.Mesh(armUpperGeo, dressMat);
    rightUpperArm.position.y = -0.14;
    rightUpperArm.castShadow = true;
    rightArmGroup.add(rightUpperArm);

    const rightLowerArm = new THREE.Mesh(armLowerGeo, skinMat);
    rightLowerArm.position.y = -0.38;
    rightLowerArm.castShadow = true;
    rightArmGroup.add(rightLowerArm);

    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.y = -0.54;
    rightArmGroup.add(rightHand);

    root.add(rightArmGroup);
    root.rightArm = rightArmGroup;

    // =========================================================================
    // 7. ARTICULATED LEGS & TRADITIONAL INDIAN MOJARI SHOES
    // =========================================================================
    const legGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.56, 10);
    const mojariGeo = new THREE.BoxGeometry(0.14, 0.08, 0.24);
    const mojariToe = new THREE.SphereGeometry(0.07, 8, 8);
    mojariToe.scale(1, 0.6, 1.4);

    // Left Leg
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(0.13, 0.52, 0);

    const leftLeg = new THREE.Mesh(legGeo, whiteFabricMat);
    leftLeg.position.y = -0.22;
    leftLeg.castShadow = true;
    leftLegGroup.add(leftLeg);

    const leftPayal = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.018, 6, 12), goldMat);
    leftPayal.rotation.x = Math.PI / 2;
    leftPayal.position.y = -0.46;
    leftLegGroup.add(leftPayal);

    const leftShoe = new THREE.Mesh(mojariGeo, shoeMat);
    leftShoe.position.set(0, -0.50, 0.04);
    leftLegGroup.add(leftShoe);

    const leftToe = new THREE.Mesh(mojariToe, goldMat);
    leftToe.position.set(0, -0.49, 0.15);
    leftLegGroup.add(leftToe);

    root.add(leftLegGroup);
    root.leftLeg = leftLegGroup;

    // Right Leg
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(-0.13, 0.52, 0);

    const rightLeg = new THREE.Mesh(legGeo, whiteFabricMat);
    rightLeg.position.y = -0.22;
    rightLeg.castShadow = true;
    rightLegGroup.add(rightLeg);

    const rightPayal = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.018, 6, 12), goldMat);
    rightPayal.rotation.x = Math.PI / 2;
    rightPayal.position.y = -0.46;
    rightLegGroup.add(rightPayal);

    const rightShoe = new THREE.Mesh(mojariGeo, shoeMat);
    rightShoe.position.set(0, -0.50, 0.04);
    rightLegGroup.add(rightShoe);

    const rightToe = new THREE.Mesh(mojariToe, goldMat);
    rightToe.position.set(0, -0.49, 0.15);
    rightLegGroup.add(rightToe);

    root.add(rightLegGroup);
    root.rightLeg = rightLegGroup;

    return root;
  }

  static createMummyMesh() {
    const root = new THREE.Group();

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfbd38d, roughness: 0.45 });
    const bandhaniTex = CharacterMeshBuilder.createBandhaniTexture("#B91C1C", "#FDE047");
    const sareeMat = new THREE.MeshStandardMaterial({
      map: bandhaniTex,
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.08
    });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.22, metalness: 0.88 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1e1b18, roughness: 0.5 });
    const gajraMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0xb91c1c });
    const sandalMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.4 });

    // Soft Ground Shadow
    const shadowGeo = new THREE.PlaneGeometry(1.4, 1.4);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    root.add(shadow);

    // =========================================================================
    // 1. SLEEK TAILORED BANDHANI SAREE BODY
    // =========================================================================
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 0.95;

    // Upper Blouse / Choli & Saree Wrap (Wider shoulders X, flat depth Z)
    const blouseGeo = new THREE.CylinderGeometry(0.28, 0.25, 0.46, 18);
    blouseGeo.scale(1.0, 1.0, 0.65);
    const upperTorso = new THREE.Mesh(blouseGeo, sareeMat);
    upperTorso.position.y = 0.25;
    upperTorso.castShadow = true;
    torsoGroup.add(upperTorso);

    // Saree Pleats & Petticoat (Graceful straight drape, flat-front silhouette)
    const sareeGeo = new THREE.CylinderGeometry(0.25, 0.29, 0.80, 18);
    sareeGeo.scale(1.0, 1.0, 0.65);
    const sareeSkirt = new THREE.Mesh(sareeGeo, sareeMat);
    sareeSkirt.position.y = -0.35;
    sareeSkirt.castShadow = true;
    torsoGroup.add(sareeSkirt);

    // Wide Golden Zari Hem Border (કાંઠો) along the saree base
    const hemGeo = new THREE.CylinderGeometry(0.294, 0.294, 0.07, 18, 1, true);
    hemGeo.scale(1.0, 1.0, 0.65);
    const hemBorder = new THREE.Mesh(hemGeo, goldMat);
    hemBorder.position.y = -0.72;
    torsoGroup.add(hemBorder);

    // Front Saree Pleat Center Line
    const pleatGeo = new THREE.BoxGeometry(0.12, 0.76, 0.04);
    const pleats = new THREE.Mesh(pleatGeo, sareeMat);
    pleats.position.set(0, -0.35, 0.17);
    torsoGroup.add(pleats);

    // -------------------------------------------------------------------------
    // PROMINENT GUJARATI BANDHANI SAREE PALLU (પલ્લું)
    // -------------------------------------------------------------------------
    // 1) Front Diagonal Wrap across Chest
    const frontPallu = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.65, 0.05), sareeMat);
    frontPallu.position.set(-0.06, 0.18, 0.16);
    frontPallu.rotation.z = -0.38;
    torsoGroup.add(frontPallu);

    // Golden Zari lace border on front pallu
    const frontPalluLace = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.65, 0.055), goldMat);
    frontPalluLace.position.set(-0.14, 0.18, 0.165);
    frontPalluLace.rotation.z = -0.38;
    torsoGroup.add(frontPalluLace);

    // 2) Left Shoulder Pleats
    const shoulderPallu = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.09, 0.38), sareeMat);
    shoulderPallu.position.set(0.26, 0.38, 0);
    torsoGroup.add(shoulderPallu);

    // 3) Flowing Back Pallu cascading down the back
    const backPallu = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.85, 0.05), sareeMat);
    backPallu.position.set(0.15, -0.12, -0.17);
    backPallu.rotation.y = 0.15;
    backPallu.castShadow = true;
    torsoGroup.add(backPallu);

    // Wide Golden Zari Border on Back Pallu End
    const backPalluBorder = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.055), goldMat);
    backPalluBorder.position.set(0.15, -0.51, -0.17);
    torsoGroup.add(backPalluBorder);

    root.add(torsoGroup);
    root.torso = torsoGroup;

    // Traditional Sandals & Feet under Saree
    const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.22), sandalMat);
    leftFoot.position.set(0.11, 0.04, 0.03);
    root.add(leftFoot);
    const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.22), sandalMat);
    rightFoot.position.set(-0.11, 0.04, 0.03);
    root.add(rightFoot);

    // =========================================================================
    // 2. HEAD & FACIAL FEATURES
    // =========================================================================
    const headGeo = new THREE.SphereGeometry(0.40, 24, 24);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.62;
    head.castShadow = true;
    root.add(head);
    root.head = head;

    // Big Royal Red Chandlo / Bindi
    const bindi = new THREE.Mesh(new THREE.CircleGeometry(0.065, 14), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
    bindi.position.set(0, 0.14, 0.39);
    head.add(bindi);

    // Sparkling Eyes with Dual Highlights
    const createMummyEye = (isRight) => {
      const eyeG = new THREE.Group();
      const xOff = isRight ? 0.13 : -0.13;
      eyeG.position.set(xOff, 0.03, 0.36);

      const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      sclera.scale.set(1.1, 0.95, 0.4);
      eyeG.add(sclera);

      const iris = new THREE.Mesh(new THREE.CircleGeometry(0.042, 12), new THREE.MeshBasicMaterial({ color: 0x1e1b18 }));
      iris.position.set(0, 0, 0.026);
      eyeG.add(iris);

      const shine = new THREE.Mesh(new THREE.CircleGeometry(0.016, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      shine.position.set(0.013, 0.015, 0.029);
      eyeG.add(shine);

      return eyeG;
    };
    head.add(createMummyEye(false));
    head.add(createMummyEye(true));

    // Golden Jhumkas (Flared outward for high visibility)
    const jhumkaGeo = new THREE.ConeGeometry(0.075, 0.13, 8);
    const leftJhumka = new THREE.Mesh(jhumkaGeo, goldMat);
    leftJhumka.position.set(0.44, -0.06, 0.08);
    head.add(leftJhumka);
    const rightJhumka = new THREE.Mesh(jhumkaGeo, goldMat);
    rightJhumka.position.set(-0.44, -0.06, 0.08);
    head.add(rightJhumka);

    // Gentle Authoritative Smile
    const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 6, 16, Math.PI), mouthMat);
    mouth.position.set(0, -0.13, 0.37);
    mouth.rotation.z = Math.PI;
    head.add(mouth);

    // Traditional Hair Juda & Fresh White Jasmine Gajra Garland
    const judaGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const juda = new THREE.Mesh(judaGeo, hairMat);
    juda.position.set(0, 0.08, -0.34);
    head.add(juda);

    // Multi-Petal Blooming Jasmine Gajra (ગજરો)
    const gajraGroup = new THREE.Group();
    gajraGroup.position.set(0, 0.08, -0.34);
    for (let p = 0; p < 12; p++) {
      const angle = (p / 12) * Math.PI * 2;
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), gajraMat);
      petal.position.set(Math.cos(angle) * 0.28, Math.sin(angle) * 0.28, 0.04);
      gajraGroup.add(petal);
    }
    head.add(gajraGroup);

    // =========================================================================
    // 3. ARMS WITH 4 STACKED GOLDEN WRIST BANGLES
    // =========================================================================
    const armGeo = new THREE.CylinderGeometry(0.075, 0.07, 0.56, 8);
    const bangleGeo = new THREE.TorusGeometry(0.09, 0.02, 8, 16);

    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(0.34, 1.22, 0);
    const leftArm = new THREE.Mesh(armGeo, sareeMat);
    leftArm.position.y = -0.28;
    leftArmGroup.add(leftArm);
    for (let b = 0; b < 4; b++) {
      const leftBangle = new THREE.Mesh(bangleGeo, goldMat);
      leftBangle.rotation.x = Math.PI / 2;
      leftBangle.position.set(0, -0.34 - b * 0.038, 0);
      leftArmGroup.add(leftBangle);
    }
    root.add(leftArmGroup);
    root.leftArm = leftArmGroup;

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(-0.34, 1.22, 0);
    const rightArm = new THREE.Mesh(armGeo, sareeMat);
    rightArm.position.y = -0.28;
    rightArmGroup.add(rightArm);
    for (let b = 0; b < 4; b++) {
      const rightBangle = new THREE.Mesh(bangleGeo, goldMat);
      rightBangle.rotation.x = Math.PI / 2;
      rightBangle.position.set(0, -0.34 - b * 0.038, 0);
      rightArmGroup.add(rightBangle);
    }
    root.add(rightArmGroup);
    root.rightArm = rightArmGroup;

    return root;
  }
}


