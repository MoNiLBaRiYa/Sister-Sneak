/**
 * Sister Sneak 3D - Procedural 3D Character Mesh Builder
 * Builds expressive stylized 3D models with articulated limbs for animations,
 * custom hair styles, accessories, and authentic Gujarati Bandhani cultural attire.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class CharacterMeshBuilder {
  // Helper: Generates procedural Gujarati Bandhani Tie-Dye Canvas Texture
  static createBandhaniTexture(baseColorHex = "#991B1B", dotColorHex = "#FDE68A") {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Base Saree Fabric
    ctx.fillStyle = baseColorHex;
    ctx.fillRect(0, 0, 256, 256);

    // Bandhani Traditional Dotted Diamond Clusters
    ctx.fillStyle = dotColorHex;
    for (let x = 16; x < 256; x += 32) {
      for (let y = 16; y < 256; y += 32) {
        // Center dot
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Surrounding 4-dot diamond cluster
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(x + 6, y, 1.8, 0, Math.PI * 2);
        ctx.arc(x - 6, y, 1.8, 0, Math.PI * 2);
        ctx.arc(x, y + 6, 1.8, 0, Math.PI * 2);
        ctx.arc(x, y - 6, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = dotColorHex;
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }

  static createSisterMesh(config) {
    const root = new THREE.Group();

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfbd38d, roughness: 0.5 });
    const hairMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(config.hairColor || "#1E1B18"), roughness: 0.6 });
    const dressMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(config.dressColor || config.color || "#F472B6"), roughness: 0.5 });
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x1e1b18 });
    const bindiMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.85 });
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0xb91c1c });
    const accessoryMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3, emissive: 0x06b6d4, emissiveIntensity: 0.4 });

    // 1. Root Pivot & Soft Ground Shadow
    const shadowGeo = new THREE.PlaneGeometry(1.3, 1.3);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.38 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    root.add(shadow);

    // 2. Torso / Kurta Dress
    const torsoGeo = new THREE.CylinderGeometry(0.35, 0.55, 0.9, 16);
    const torso = new THREE.Mesh(torsoGeo, dressMat);
    torso.position.y = 0.95;
    torso.castShadow = true;
    torso.receiveShadow = true;
    root.add(torso);
    root.torso = torso;

    // Golden / Colored Kurta Hem Trim
    const hemGeo = new THREE.TorusGeometry(0.55, 0.04, 8, 24);
    const hem = new THREE.Mesh(hemGeo, goldMat);
    hem.rotation.x = Math.PI / 2;
    hem.position.set(0, -0.42, 0);
    torso.add(hem);

    // 3. Head & Expressive Face
    const headGeo = new THREE.SphereGeometry(0.38, 24, 24);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.65;
    head.castShadow = true;
    root.add(head);
    root.head = head;

    // Eyes Group (Supports animated natural blinking)
    const eyesGroup = new THREE.Group();
    eyesGroup.position.set(0, 0.04, 0.32);

    // Left Eye (Sclera + Pupil + Highlight)
    const leftEyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), eyeWhiteMat);
    leftEyeWhite.position.set(0.12, 0, 0);
    const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), pupilMat);
    leftPupil.position.set(0.01, 0, 0.06);
    leftEyeWhite.add(leftPupil);
    eyesGroup.add(leftEyeWhite);

    // Right Eye
    const rightEyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), eyeWhiteMat);
    rightEyeWhite.position.set(-0.12, 0, 0);
    const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), pupilMat);
    rightPupil.position.set(-0.01, 0, 0.06);
    rightEyeWhite.add(rightPupil);
    eyesGroup.add(rightEyeWhite);

    head.add(eyesGroup);
    root.eyes = eyesGroup;

    // Red Chandlo / Bindi
    const bindi = new THREE.Mesh(new THREE.CircleGeometry(0.04, 12), bindiMat);
    bindi.position.set(0, 0.16, 0.37);
    head.add(bindi);

    // Cute Smile Mouth
    const mouthGeo = new THREE.TorusGeometry(0.06, 0.015, 6, 12, Math.PI);
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, -0.14, 0.34);
    mouth.rotation.x = Math.PI / 6;
    head.add(mouth);

    // 4. Hair Styles & Character Specific Accessories
    const hairCapGeo = new THREE.SphereGeometry(0.40, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    const hairCap = new THREE.Mesh(hairCapGeo, hairMat);
    hairCap.position.y = 0.04;
    head.add(hairCap);

    if (config.id === "RIDDHI" || config.hairStyle === "two-braids") {
      // 🌸 Riddhi: Two Braids with dynamic physics & Golden Jhumka Earrings & Pink Dupatta
      const braidGeo = new THREE.CylinderGeometry(0.08, 0.03, 0.65, 8);
      
      const leftBraidGroup = new THREE.Group();
      leftBraidGroup.position.set(0.35, -0.1, -0.05);
      const leftBraid = new THREE.Mesh(braidGeo, hairMat);
      leftBraid.position.y = -0.3;
      leftBraidGroup.add(leftBraid);
      head.add(leftBraidGroup);
      root.leftBraid = leftBraidGroup;

      const rightBraidGroup = new THREE.Group();
      rightBraidGroup.position.set(-0.35, -0.1, -0.05);
      const rightBraid = new THREE.Mesh(braidGeo, hairMat);
      rightBraid.position.y = -0.3;
      rightBraidGroup.add(rightBraid);
      head.add(rightBraidGroup);
      root.rightBraid = rightBraidGroup;

      // Golden Dangling Jhumka Earrings
      const jhumkaGeo = new THREE.ConeGeometry(0.05, 0.08, 8);
      const leftJhumka = new THREE.Mesh(jhumkaGeo, goldMat);
      leftJhumka.position.set(0.38, -0.08, 0.1);
      head.add(leftJhumka);
      const rightJhumka = new THREE.Mesh(jhumkaGeo, goldMat);
      rightJhumka.position.set(-0.38, -0.08, 0.1);
      head.add(rightJhumka);

      // Flowing Dupatta Scarf across torso
      const dupattaMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 });
      const dupattaGeo = new THREE.BoxGeometry(0.85, 0.1, 0.45);
      const dupatta = new THREE.Mesh(dupattaGeo, dupattaMat);
      dupatta.position.set(0, 0.25, 0.05);
      dupatta.rotation.z = -0.35;
      torso.add(dupatta);
    } else if (config.id === "SHRUTI" || config.hairStyle === "side-ponytail") {
      // 🎨 Shruti: Side Ponytail + Waist Artist Paint Palette
      const ponyGroup = new THREE.Group();
      ponyGroup.position.set(0.38, 0.15, -0.1);
      const pony = new THREE.Mesh(new THREE.SphereGeometry(0.20, 12, 12), hairMat);
      ponyGroup.add(pony);
      head.add(ponyGroup);
      root.pony = ponyGroup;

      // Artist Paint Palette on waist
      const paletteMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
      const paletteGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.04, 12);
      const palette = new THREE.Mesh(paletteGeo, paletteMat);
      palette.rotation.z = Math.PI / 4;
      palette.position.set(-0.42, -0.1, 0.15);
      torso.add(palette);

      // 3 Paint Dab Spots
      const dabColors = [0xef4444, 0x3b82f6, 0x10b981];
      dabColors.forEach((col, idx) => {
        const dab = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), new THREE.MeshBasicMaterial({ color: col }));
        dab.position.set(-0.08 + idx * 0.08, 0.03, 0);
        palette.add(dab);
      });
    } else if (config.id === "JAHANVI" || config.hairStyle === "high-ponytail") {
      // ⚡ Jahanvi: High Ponytail + Athletic Sporty Headband
      const highPonyGroup = new THREE.Group();
      highPonyGroup.position.set(0, 0.35, -0.3);
      highPonyGroup.rotation.x = -0.6;
      const ponyMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.05, 0.75, 8), hairMat);
      ponyMesh.position.y = -0.35;
      highPonyGroup.add(ponyMesh);
      head.add(highPonyGroup);
      root.pony = highPonyGroup;

      // Headband
      const bandMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3 });
      const bandGeo = new THREE.TorusGeometry(0.39, 0.04, 8, 24);
      const headband = new THREE.Mesh(bandGeo, bandMat);
      headband.position.set(0, 0.08, 0);
      headband.rotation.x = Math.PI / 2;
      head.add(headband);
    } else if (config.id === "JISHA" || config.hairStyle === "cute-pigtails") {
      // 😇 Jisha: Golden Circular Glasses & Pigtail Ribbon Buns
      const leftPig = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), hairMat);
      leftPig.position.set(0.38, 0.12, -0.05);
      head.add(leftPig);
      const rightPig = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), hairMat);
      rightPig.position.set(-0.38, 0.12, -0.05);
      head.add(rightPig);

      // Glasses
      const glassGeo = new THREE.TorusGeometry(0.11, 0.02, 8, 16);
      const leftGlass = new THREE.Mesh(glassGeo, goldMat);
      leftGlass.position.set(0.13, 0.04, 0.36);
      head.add(leftGlass);
      const rightGlass = new THREE.Mesh(glassGeo, goldMat);
      rightGlass.position.set(-0.13, 0.04, 0.36);
      head.add(rightGlass);
      const glassBridge = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.1), goldMat);
      glassBridge.rotation.z = Math.PI / 2;
      glassBridge.position.set(0, 0.04, 0.38);
      head.add(glassBridge);
    } else if (config.id === "JYEANA") {
      // 💡 Jyeana: Glowing Cyan LED Smartwatch on Left Wrist
      const highPony = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), hairMat);
      highPony.position.set(0, 0.28, -0.25);
      head.add(highPony);
    }

    // 5. Articulated Arms & Accessories
    const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.55, 8);
    
    // Left Arm
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(0.42, 1.25, 0);
    const leftArm = new THREE.Mesh(armGeo, dressMat);
    leftArm.position.y = -0.27;
    leftArm.castShadow = true;
    leftArmGroup.add(leftArm);

    // Jyeana Smartwatch on Left Wrist
    if (config.id === "JYEANA") {
      const watch = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.06, 10), accessoryMat);
      watch.position.set(0, -0.42, 0);
      leftArmGroup.add(watch);
    }

    root.add(leftArmGroup);
    root.leftArm = leftArmGroup;

    // Right Arm
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(-0.42, 1.25, 0);
    const rightArm = new THREE.Mesh(armGeo, dressMat);
    rightArm.position.y = -0.27;
    rightArm.castShadow = true;
    rightArmGroup.add(rightArm);
    root.add(rightArmGroup);
    root.rightArm = rightArmGroup;

    // 6. Articulated Legs
    const legGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.65, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0xede8d0, roughness: 0.6 });

    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(0.2, 0.55, 0);
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.y = -0.32;
    leftLeg.castShadow = true;
    leftLegGroup.add(leftLeg);
    root.add(leftLegGroup);
    root.leftLeg = leftLegGroup;

    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(-0.2, 0.55, 0);
    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.y = -0.32;
    rightLeg.castShadow = true;
    rightLegGroup.add(rightLeg);
    root.add(rightLegGroup);
    root.rightLeg = rightLegGroup;

    return root;
  }

  static createMummyMesh() {
    const root = new THREE.Group();

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfbd38d, roughness: 0.5 });
    const bandhaniTex = CharacterMeshBuilder.createBandhaniTexture("#991B1B", "#FDE68A");
    const sareeMat = new THREE.MeshStandardMaterial({
      map: bandhaniTex,
      color: 0xffffff,
      roughness: 0.45
    }); // Authentic Gujarati Bandhani Saree
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.85 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1e1b18, roughness: 0.6 });
    const gajraMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.85 }); // Jasmine Garland

    // 1. Saree Torso & Pleats
    const torsoGeo = new THREE.CylinderGeometry(0.48, 0.78, 1.25, 16);
    const torso = new THREE.Mesh(torsoGeo, sareeMat);
    torso.position.y = 1.05;
    torso.castShadow = true;
    root.add(torso);
    root.torso = torso;

    // Golden Zari Hem Border
    const hemBorder = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.05, 8, 24), goldMat);
    hemBorder.rotation.x = Math.PI / 2;
    hemBorder.position.set(0, -0.6, 0);
    torso.add(hemBorder);

    // Gold Bandhani Pallu Draped Across Shoulder
    const palluGeo = new THREE.BoxGeometry(0.95, 0.1, 0.55);
    const pallu = new THREE.Mesh(palluGeo, goldMat);
    pallu.position.set(0, 1.48, 0.12);
    pallu.rotation.z = -0.4;
    root.add(pallu);

    // 2. Head & Facial Features
    const headGeo = new THREE.SphereGeometry(0.42, 24, 24);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.88;
    head.castShadow = true;
    root.add(head);
    root.head = head;

    // Big Royal Red Chandlo / Bindi
    const bindi = new THREE.Mesh(new THREE.CircleGeometry(0.065, 14), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
    bindi.position.set(0, 0.16, 0.41);
    head.add(bindi);

    // Eyes
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), new THREE.MeshBasicMaterial({ color: 0x1e1b18 }));
    leftEye.position.set(0.14, 0.05, 0.38);
    head.add(leftEye);
    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), new THREE.MeshBasicMaterial({ color: 0x1e1b18 }));
    rightEye.position.set(-0.14, 0.05, 0.38);
    head.add(rightEye);

    // Golden Jhumkas
    const jhumkaGeo = new THREE.ConeGeometry(0.06, 0.1, 8);
    const leftJhumka = new THREE.Mesh(jhumkaGeo, goldMat);
    leftJhumka.position.set(0.44, -0.06, 0.1);
    head.add(leftJhumka);
    const rightJhumka = new THREE.Mesh(jhumkaGeo, goldMat);
    rightJhumka.position.set(-0.44, -0.06, 0.1);
    head.add(rightJhumka);

    // Traditional Hair Juda & Fresh Jasmine Gajra Garland
    const judaGeo = new THREE.SphereGeometry(0.30, 16, 16);
    const juda = new THREE.Mesh(judaGeo, hairMat);
    juda.position.set(0, 0.1, -0.38);
    head.add(juda);

    const gajraGeo = new THREE.TorusGeometry(0.28, 0.08, 8, 18);
    const gajra = new THREE.Mesh(gajraGeo, gajraMat);
    gajra.position.set(0, 0.1, -0.36);
    head.add(gajra);

    // 3. Arms with Golden Wrist Bangles
    const armGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.65, 8);
    const bangleGeo = new THREE.TorusGeometry(0.11, 0.025, 8, 16);

    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(0.52, 1.45, 0);
    const leftArm = new THREE.Mesh(armGeo, sareeMat);
    leftArm.position.y = -0.32;
    leftArmGroup.add(leftArm);
    const leftBangle = new THREE.Mesh(bangleGeo, goldMat);
    leftBangle.rotation.x = Math.PI / 2;
    leftBangle.position.set(0, -0.45, 0);
    leftArmGroup.add(leftBangle);
    root.add(leftArmGroup);
    root.leftArm = leftArmGroup;

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(-0.52, 1.45, 0);
    const rightArm = new THREE.Mesh(armGeo, sareeMat);
    rightArm.position.y = -0.32;
    rightArmGroup.add(rightArm);
    const rightBangle = new THREE.Mesh(bangleGeo, goldMat);
    rightBangle.rotation.x = Math.PI / 2;
    rightBangle.position.set(0, -0.45, 0);
    rightArmGroup.add(rightBangle);
    root.add(rightArmGroup);
    root.rightArm = rightArmGroup;

    return root;
  }
}

