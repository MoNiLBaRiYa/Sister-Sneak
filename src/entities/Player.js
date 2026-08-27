/**
 * Sister Sneak: Phone Locked - Controllable Player Entity
 * High-responsiveness physics, animated walking bobs, visual aura particles,
 * and game-feel feedback for character powers (no blocking alert popups).
 */

import { Character } from './Character.js';

export class Player extends Character {
  constructor(config = {}) {
    super(config);
    this.isControllable = true;
    this.targetX = null;
    this.targetY = null;
    this.clickToMove = false;
    this.currentRoom = null;
    this.auraColor = null;
    this.auraTimer = 0;
  }

  handleInput(input, dt) {
    const move = input.getMovementVector();
    let currentSpeed = this.speed;

    // Sprint & Buff timers
    if (this.sprintTimer > 0) {
      currentSpeed *= 1.6;
      this.sprintTimer = Math.max(0, this.sprintTimer - dt);
    }
    if (this.buffTimer > 0) {
      this.buffTimer = Math.max(0, this.buffTimer - dt);
    }
    if (this.stealthTimer > 0) {
      this.stealthTimer = Math.max(0, this.stealthTimer - dt);
    }
    if (this.auraTimer > 0) {
      this.auraTimer = Math.max(0, this.auraTimer - dt);
      if (this.auraTimer <= 0) this.auraColor = null;
    }

    // Direct WASD / Arrow / Joystick Movement
    if (Math.abs(move.x) > 0.05 || Math.abs(move.y) > 0.05) {
      this.clickToMove = false;
      this.targetX = null;
      this.targetY = null;

      this.vx = move.x * currentSpeed * 60;
      this.vy = move.y * currentSpeed * 60;
      this.isMoving = true;

      if (move.x < -0.1) this.facing = "left";
      else if (move.x > 0.1) this.facing = "right";
    } else if (this.clickToMove && this.targetX !== null) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 5) {
        this.vx = (dx / dist) * currentSpeed * 60;
        this.vy = (dy / dist) * currentSpeed * 60;
        this.isMoving = true;
        if (dx < 0) this.facing = "left";
        else this.facing = "right";
      } else {
        this.clickToMove = false;
        this.vx = 0;
        this.vy = 0;
        this.isMoving = false;
      }
    } else {
      this.vx = 0;
      this.vy = 0;
      this.isMoving = false;
    }

    // Apply movement
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.update(dt);
  }

  moveToPoint(targetX, targetY) {
    this.targetX = targetX;
    this.targetY = targetY;
    this.clickToMove = true;
  }

  useAbility(game) {
    if (this.abilityCooldown > 0) return false;
    this.abilityCooldown = this.maxAbilityCooldown;

    game.audio.playTaskComplete();

    // 1. Riddhi
    if (this.id === "RIDDHI") {
      if (this.role === "innocent") {
        this.buffTimer = 8.0;
        this.sprintTimer = 8.0;
        this.auraColor = "#F472B6";
        this.auraTimer = 8.0;
        game.showTopToast("🌸 Partner Courage Activated! +80% Speed & Task boost for 8s!");
      } else {
        this.stealthTimer = 8.0;
        this.auraColor = "rgba(255,255,255,0.4)";
        this.auraTimer = 8.0;
        game.showTopToast("🤫 Blanket Stealth Activated! Hidden under blanket for 8s!");
      }
    }

    // 2. Shruti
    else if (this.id === "SHRUTI") {
      if (this.role === "innocent") {
        game.taskManager.contributeCleanliness(20);
        this.auraColor = "#38BDF8";
        this.auraTimer = 4.0;
        game.showTopToast("🎨 Artistic Flow Activated! Instantly generated +20% Cleanliness!");
      } else {
        const innocents = game.bots.filter(b => b.role === "innocent");
        if (innocents.length > 0) {
          const target = innocents[Math.floor(Math.random() * innocents.length)];
          target.suspicion = Math.min(100, target.suspicion + 30);
          game.showTopToast(`🎭 Fake Clue Fabricated! Framed ${target.name}!`);
        }
      }
    }

    // 3. Jahanvi
    else if (this.id === "JAHANVI") {
      if (this.role === "innocent") {
        this.sprintTimer = 6.0;
        this.auraColor = "#F59E0B";
        this.auraTimer = 6.0;
        game.showTopToast("🎒 Shortcut Master Sprint Activated! Super Speed Dash for 6s!");
      } else {
        const nextFloor = (this.floor + 1) % 3;
        this.setFloor(nextFloor);
        game.camera.setFloor(nextFloor);
        game.updateFloorButtonsUI(nextFloor);
        game.showTopToast(`🌀 Floor Teleport Activated! Jumped to Floor ${nextFloor === 2 ? '3F' : nextFloor === 1 ? '2F' : '1F'}!`);
      }
    }

    // 4. Jisha
    else if (this.id === "JISHA") {
      if (this.role === "innocent") {
        this.suspicion = 0;
        this.auraColor = "#A78BFA";
        this.auraTimer = 5.0;
        game.bots.forEach(b => b.suspicion = Math.max(0, b.suspicion - 20));
        game.showTopToast("📚 Universal Ladli Card Activated! Mummy's suspicion reset to 0%!");
      } else {
        this.auraColor = "#8B5CF6";
        this.auraTimer = 8.0;
        game.showTopToast("🛡️ Innocent Shield Activated! Protected against the next meeting vote!");
      }
    }

    // 5. Jyeana
    else if (this.id === "JYEANA") {
      if (this.role === "innocent") {
        this.sprintTimer = 5.0;
        this.buffTimer = 5.0;
        this.auraColor = "#10B981";
        this.auraTimer = 5.0;
        game.showTopToast("⚡ Quick Hint & Dash Activated! +40% Speed Dash!");
      } else {
        if (game.sabotageSystem) {
          game.sabotageSystem.cooldowns.BLACKOUT = 0;
          game.sabotageSystem.cooldowns.KUNDI = 0;
          game.sabotageSystem.cooldowns.MESS = 0;
          this.auraColor = "#EF4444";
          this.auraTimer = 4.0;
          game.showTopToast("⚡ Rapid Saboteur Activated! All sabotage cooldowns reset to 0s!");
        }
      }
    }

    return true;
  }

  draw(ctx) {
    // Draw Active Power Glowing Aura
    if (this.auraColor) {
      ctx.save();
      ctx.shadowColor = this.auraColor;
      ctx.shadowBlur = 18;
      ctx.strokeStyle = this.auraColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.x, this.y - 10, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    super.draw(ctx);
  }
}
