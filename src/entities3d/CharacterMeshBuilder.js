/**
 * Sister Sneak 3D - Procedural 3D Character Mesh Builder
 * Builds expressive stylized 3D models with articulated limbs for animations,
 * custom hair styles, accessories, and Gujarati cultural attire.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class CharacterMeshBuilder {
  static createSisterMesh(config) {
    const root = new THREE.Group();

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfbd38d, roughness: 0.5 });
    const hairMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(config.hairColor || "#1E1B18"), roughness: 0.6 });
    const dressMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(config.dressColor || config.color || "#F472B6"), roughness: 0.5 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e1b18 });
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const bindiMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.8 });

    // 1. Root Pivot & Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(1.2, 1.2);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    root.add(shadow);

    // 2. Torso / Dress
    const torsoGeo = new THREE.CylinderGeometry(0.35, 0.55, 0.9, 16);
    const torso = new THREE.Mesh(torsoGeo, dressMat);
    torso.position.y = 0.95;
    torso.castShadow = true;
    torso.receiveShadow = true;
    root.add(torso);
    root.torso = torso;

    // 3. Head & Face
    const headGeo = new THREE.SphereGeometry(0.38, 24, 24);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.65;
    head.castShadow = true;
    root.add(head);
    root.head = head;

    // Eyes
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), eyeMat);
    leftEye.position.set(0.12, 0.04, 0.34);
    head.add(leftEye);

    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), eyeMat);
    rightEye.position.set(-0.12, 0.04, 0.34);
    head.add(rightEye);

    // Red Bindi
    const bindi = new THREE.Mesh(new THREE.CircleGeometry(0.04, 12), bindiMat);
    bindi.position.set(0, 0.16, 0.37);
    head.add(bindi);

    // 4. Hair Styles
    const hairCapGeo = new THREE.SphereGeometry(0.40, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    const hairCap = new THREE.Mesh(hairCapGeo, hairMat);
    hairCap.position.y = 0.04;
    head.add(hairCap);

    if (config.hairStyle === "two-braids") {
      // Riddhi: Two Braids
      const braidGeo = new THREE.CylinderGeometry(0.08, 0.04, 0.6, 8);
      const leftBraid = new THREE.Mesh(braidGeo, hairMat);
      leftBraid.position.set(0.35, -0.25, -0.05);
      leftBraid.rotation.z = -0.2;
      head.add(leftBraid);

      const rightBraid = new THREE.Mesh(braidGeo, hairMat);
      rightBraid.position.set(-0.35, -0.25, -0.05);
      rightBraid.rotation.z = 0.2;
      head.add(rightBraid);
    } else if (config.hairStyle === "side-ponytail") {
      // Shruti: Side Ponytail
      const ponyGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const pony = new THREE.Mesh(ponyGeo, hairMat);
      pony.position.set(0.38, 0.15, -0.1);
      head.add(pony);
    } else if (config.hairStyle === "high-ponytail") {
      // Jahanvi: High Ponytail
      const ponyGeo = new THREE.CylinderGeometry(0.14, 0.06, 0.65, 8);
      const pony = new THREE.Mesh(ponyGeo, hairMat);
      pony.position.set(0, 0.35, -0.3);
      pony.rotation.x = -0.6;
      head.add(pony);
    } else if (config.hairStyle === "cute-pigtails") {
      // Jisha: Cute Pigtails & Glasses
      const pigGeo = new THREE.SphereGeometry(0.14, 10, 10);
      const leftPig = new THREE.Mesh(pigGeo, hairMat);
      leftPig.position.set(0.38, 0.1, -0.05);
      head.add(leftPig);

      const rightPig = new THREE.Mesh(pigGeo, hairMat);
      rightPig.position.set(-0.38, 0.1, -0.05);
      head.add(rightPig);

      // Glasses
      const glassGeo = new THREE.TorusGeometry(0.11, 0.02, 8, 16);
      const leftGlass = new THREE.Mesh(glassGeo, goldMat);
      leftGlass.position.set(0.13, 0.04, 0.36);
      head.add(leftGlass);

      const rightGlass = new THREE.Mesh(glassGeo, goldMat);
      rightGlass.position.set(-0.13, 0.04, 0.36);
      head.add(rightGlass);
    }

    // 5. Articulated Arms
    const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.55, 8);
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(0.42, 1.25, 0);
    const leftArm = new THREE.Mesh(armGeo, dressMat);
    leftArm.position.y = -0.27;
    leftArm.castShadow = true;
    leftArmGroup.add(leftArm);
    root.add(leftArmGroup);
    root.leftArm = leftArmGroup;

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
    const sareeMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.4 }); // Royal Maroon Saree
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.8 }); // Gold Border
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1e1b18, roughness: 0.6 });
    const gajraMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.8 }); // Jasmine Garland

    // Saree Torso & Pleats
    const torsoGeo = new THREE.CylinderGeometry(0.45, 0.75, 1.2, 16);
    const torso = new THREE.Mesh(torsoGeo, sareeMat);
    torso.position.y = 1.05;
    torso.castShadow = true;
    root.add(torso);
    root.torso = torso;

    // Gold Pallu
    const palluGeo = new THREE.BoxGeometry(0.9, 0.08, 0.5);
    const pallu = new THREE.Mesh(palluGeo, goldMat);
    pallu.position.set(0, 1.45, 0.1);
    pallu.rotation.z = -0.4;
    root.add(pallu);

    // Head
    const headGeo = new THREE.SphereGeometry(0.42, 24, 24);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.85;
    head.castShadow = true;
    root.add(head);
    root.head = head;

    // Big Red Bindi
    const bindi = new THREE.Mesh(new THREE.CircleGeometry(0.06, 12), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
    bindi.position.set(0, 0.16, 0.41);
    head.add(bindi);

    // Hair Juda & Gajra
    const judaGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const juda = new THREE.Mesh(judaGeo, hairMat);
    juda.position.set(0, 0.1, -0.38);
    head.add(juda);

    const gajraGeo = new THREE.TorusGeometry(0.26, 0.07, 8, 16);
    const gajra = new THREE.Mesh(gajraGeo, gajraMat);
    gajra.position.set(0, 0.1, -0.36);
    head.add(gajra);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.65, 8);
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(0.5, 1.45, 0);
    const leftArm = new THREE.Mesh(armGeo, sareeMat);
    leftArm.position.y = -0.32;
    leftArmGroup.add(leftArm);
    root.add(leftArmGroup);
    root.leftArm = leftArmGroup;

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(-0.5, 1.45, 0);
    const rightArm = new THREE.Mesh(armGeo, sareeMat);
    rightArm.position.y = -0.32;
    rightArmGroup.add(rightArm);
    root.add(rightArmGroup);
    root.rightArm = rightArmGroup;

    return root;
  }
}
