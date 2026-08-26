/**
 * Sister Sneak: Phone Locked - Base Chibi Character Entity
 * Implements procedural vector Chibi rendering with walk cycles, expressions,
 * accessories, and active ability timers.
 */

import { FLOOR_Y } from '../config/constants.js';

export class Character {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.archetype = config.archetype;
    this.avatar = config.avatar;
    this.color = config.color;
    this.hairColor = config.hairColor || "#1E1B18";
    this.hairStyle = config.hairStyle || "ponytail";
    this.dressColor = config.dressColor || config.color;
    this.accessory = config.accessory || "";
    this.speed = config.speed || 3.5;
    this.baseSpeed = this.speed;

    this.floor = config.floor !== undefined ? config.floor : 1;
    this.x = config.x || 500;
    this.y = config.y || FLOOR_Y[this.floor] + 120;
    this.vx = 0;
    this.vy = 0;

    this.facing = "right";
    this.isMoving = false;
    this.walkCycle = 0;
    this.walkSpeed = 10;

    this.role = "innocent"; // "innocent" or "imposter"
    this.isEjected = false;
    this.isHidden = false; // For Riddhi's blanket stealth
    this.isDashing = false;
    this.stealthTimer = 0;
    this.buffTimer = 0;
    this.currentRoom = null;
    this.suspicion = 0; // 0 to 100
  }

  setFloor(newFloor, newX = null) {
    this.floor = newFloor;
    this.y = FLOOR_Y[newFloor] + 120;
    if (newX !== null) {
      this.x = newX;
    }
  }

  update(dt) {
    if (this.isMoving) {
      this.walkCycle += dt * this.walkSpeed;
    } else {
      this.walkCycle = 0;
    }

    // Update stealth timer
    if (this.stealthTimer > 0) {
      this.stealthTimer -= dt;
      this.isHidden = true;
    } else if (this.isHidden) {
      this.isHidden = false;
    }

    // Keep y within floor bounds
    const minY = FLOOR_Y[this.floor] + 70;
    const maxY = FLOOR_Y[this.floor] + 155;
    this.y = Math.max(minY, Math.min(maxY, this.y));

    // Keep x within house bounds
    this.x = Math.max(70, Math.min(1190, this.x));
  }

  draw(ctx) {
    if (this.isHidden || this.isEjected) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    // If buffed / dashing, draw glowing aura
    if (this.isDashing || this.buffTimer > 0) {
      ctx.fillStyle = "rgba(245, 158, 11, 0.35)";
      ctx.beginPath();
      ctx.arc(0, -15, 26, 0, Math.PI * 2);
      ctx.fill();
    }

    // Flip if facing left
    if (this.facing === "left") {
      ctx.scale(-1, 1);
    }

    // 1. Floor Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.beginPath();
    ctx.ellipse(0, 5, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    const bob = Math.abs(Math.sin(this.walkCycle)) * 3;
    const legSwing = Math.sin(this.walkCycle) * 6;

    // 2. Chibi Legs / Shoes
    ctx.fillStyle = "#FBBF24";
    ctx.fillRect(-6 - (this.isMoving ? legSwing : 0), -2 - bob, 5, 7);
    ctx.fillRect(2 + (this.isMoving ? legSwing : 0), -2 - bob, 5, 7);

    // 3. Indian Kurta / Dress Body
    ctx.fillStyle = this.dressColor;
    ctx.beginPath();
    ctx.moveTo(-10, -22 - bob);
    ctx.lineTo(10, -22 - bob);
    ctx.lineTo(13, -2 - bob);
    ctx.lineTo(-13, -2 - bob);
    ctx.closePath();
    ctx.fill();

    // Dupatta / Sash Stripe
    ctx.fillStyle = "#FFF";
    ctx.beginPath();
    ctx.moveTo(-9, -22 - bob);
    ctx.lineTo(11, -4 - bob);
    ctx.lineTo(7, -2 - bob);
    ctx.lineTo(-10, -18 - bob);
    ctx.closePath();
    ctx.fill();

    // 4. Arms
    ctx.fillStyle = "#FCD34D"; // Skin tone
    ctx.fillRect(-12, -18 - bob + (this.isMoving ? legSwing : 0), 4, 10);
    ctx.fillRect(8, -18 - bob - (this.isMoving ? legSwing : 0), 4, 10);

    // 5. Chibi Head
    ctx.fillStyle = "#FCD34D";
    ctx.beginPath();
    ctx.arc(0, -32 - bob, 14, 0, Math.PI * 2);
    ctx.fill();

    // 6. Hair & Unique Hairstyles
    ctx.fillStyle = this.hairColor;
    this.drawHair(ctx, bob);

    // 7. Expressive Chibi Face
    this.drawFace(ctx, bob);

    // 8. Unique Accessories
    this.drawAccessory(ctx, bob);

    ctx.restore();

    // 9. Overhead Name Badge
    this.drawNameBadge(ctx);
  }

  drawHair(ctx, bob) {
    ctx.fillStyle = this.hairColor;
    const hy = -32 - bob;

    ctx.beginPath();
    ctx.arc(0, hy - 2, 14, Math.PI, 0, false);
    ctx.lineTo(14, hy + 4);
    ctx.lineTo(-14, hy + 4);
    ctx.closePath();
    ctx.fill();

    if (this.hairStyle === "two-braids") {
      ctx.fillRect(-16, hy, 4, 18);
      ctx.fillRect(12, hy, 4, 18);
    } else if (this.hairStyle === "side-ponytail") {
      ctx.beginPath();
      ctx.ellipse(14, hy - 2, 8, 12, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.hairStyle === "high-ponytail") {
      ctx.beginPath();
      ctx.ellipse(8, hy - 14, 7, 14, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.hairStyle === "cute-pigtails") {
      ctx.beginPath();
      ctx.arc(-13, hy - 8, 6, 0, Math.PI * 2);
      ctx.arc(13, hy - 8, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.hairStyle === "short-bob") {
      ctx.fillRect(-15, hy, 4, 10);
      ctx.fillRect(11, hy, 4, 10);
      ctx.fillStyle = "#EF4444";
      ctx.fillRect(-12, hy - 12, 24, 3);
    }
  }

  drawFace(ctx, bob) {
    const hy = -32 - bob;

    ctx.fillStyle = "#1E1B18";
    ctx.beginPath();
    ctx.arc(3, hy, 2.5, 0, Math.PI * 2);
    ctx.arc(9, hy, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FFF";
    ctx.beginPath();
    ctx.arc(2.2, hy - 0.8, 1, 0, Math.PI * 2);
    ctx.arc(8.2, hy - 0.8, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#DC2626";
    ctx.beginPath();
    ctx.arc(6, hy - 6, 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#B45309";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(6, hy + 3, 2.5, 0, Math.PI);
    ctx.stroke();

    ctx.fillStyle = "rgba(244, 114, 182, 0.55)";
    ctx.beginPath();
    ctx.arc(0, hy + 2, 2.5, 0, Math.PI * 2);
    ctx.arc(12, hy + 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawAccessory(ctx, bob) {
    const hy = -32 - bob;
    if (this.accessory === "glasses") {
      ctx.strokeStyle = "#38BDF8";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0.5, hy - 3.5, 5.5, 6);
      ctx.strokeRect(6.5, hy - 3.5, 5.5, 6);
      ctx.beginPath();
      ctx.moveTo(6, hy);
      ctx.lineTo(6.5, hy);
      ctx.stroke();
    }
  }

  drawNameBadge(ctx) {
    ctx.save();
    ctx.font = "bold 11px Fredoka, sans-serif";
    const text = this.name;
    const tw = ctx.measureText(text).width;

    ctx.fillStyle = "rgba(28, 25, 23, 0.85)";
    ctx.beginPath();
    ctx.roundRect(this.x - tw / 2 - 8, this.y - 65, tw + 16, 18, 5);
    ctx.fill();

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#FEF3C7";
    ctx.textAlign = "center";
    ctx.fillText(text, this.x, this.y - 52);

    ctx.restore();
  }
}
