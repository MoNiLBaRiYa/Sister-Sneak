/**
 * Sister Sneak: Phone Locked - Controllable Player Entity
 * Integrates direct Task-Solving Super Powers, Vent Shortcuts, Blanket Camouflage,
 * and Mummy Evasion mechanics.
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
    this.abilityCooldown = 0;
    this.maxAbilityCooldown = 15.0; // 15 seconds cooldown
  }

  handleInput(input, dt) {
    // Cooldown countdown
    if (this.abilityCooldown > 0) {
      this.abilityCooldown = Math.max(0, this.abilityCooldown - dt);
    }

    const move = input.getMovementVector();
    let currentSpeed = this.speed;

    // Sprint & Buff timers
    if (this.sprintTimer > 0) {
      currentSpeed *= 1.8;
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

    // Movement
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

    // 1. 🌸 RIDDHI: Cozy Blanket Stealth / Mummy Camouflage
    if (this.id === "RIDDHI") {
      this.stealthTimer = 10.0;
      this.auraColor = "#F472B6";
      this.auraTimer = 10.0;
      this.suspicion = 0;
      game.showTopToast("🌸 Riddhi's Cozy Blanket Camouflage! Invisible to Mummy for 10s!");
    }

    // 2. 🎨 SHRUTI: Master Artistic Touch (Instant Task Boost & Cleanliness Surge)
    else if (this.id === "SHRUTI") {
      this.auraColor = "#38BDF8";
      this.auraTimer = 6.0;

      // If active mini-game is open, instantly solve 60% of it!
      if (game.taskManager.activeMiniGame) {
        game.taskManager.activeMiniGame.updateProgress(1.0);
        game.showTopToast("🎨 Shruti's Artistic Flow AUTO-SOLVED the chore instantly! ✨");
      } else {
        game.taskManager.contributeCleanliness(20);
        game.showTopToast("🎨 Shruti's Master Touch! Generated +20% Cleanliness burst!");
      }
    }

    // 3. 🎒 JAHANVI: Secret Ventilation Shortcut (Teleport across floors & rooms)
    else if (this.id === "JAHANVI") {
      const nextFloor = (this.floor + 1) % 3;
      this.setFloor(nextFloor, 300 + Math.random() * 600);
      game.camera.setFloor(nextFloor);
      game.updateFloorButtonsUI(nextFloor);
      this.sprintTimer = 6.0;
      this.auraColor = "#F59E0B";
      this.auraTimer = 6.0;
      game.showTopToast(`🌀 Jahanvi's Secret Vent Portal! Teleported to Floor ${nextFloor === 2 ? '3F' : nextFloor === 1 ? '2F' : '1F'} + Super Dash!`);
    }

    // 4. 📚 JISHA: Universal Ladli & Genius Solver
    else if (this.id === "JISHA") {
      this.auraColor = "#A78BFA";
      this.auraTimer = 8.0;
      this.suspicion = 0;

      if (game.taskManager.activeMiniGame) {
        game.taskManager.activeMiniGame.updateProgress(1.0);
        game.showTopToast("📚 Jisha's Genius Brain AUTO-SOLVED the study riddle! ⭐");
      } else {
        game.bots.forEach(b => b.suspicion = Math.max(0, b.suspicion - 30));
        game.showTopToast("📚 Jisha's Universal Ladli Charm! Mummy's suspicion reset to 0%!");
      }
    }

    // 5. ⚡ JYEANA: Overdrive Switch Fixer & Sabotage Rush
    else if (this.id === "JYEANA") {
      this.sprintTimer = 7.0;
      this.auraColor = "#10B981";
      this.auraTimer = 7.0;

      // Fix power blackouts across all floors instantly
      game.houseMap.blackedOutFloors.clear();

      if (this.role === "imposter" && game.sabotageSystem) {
        game.sabotageSystem.cooldowns.BLACKOUT = 0;
        game.sabotageSystem.cooldowns.KUNDI = 0;
        game.sabotageSystem.cooldowns.MESS = 0;
        game.showTopToast("⚡ Jyeana's Rapid Saboteur! All sabotage cooldowns reset to 0s!");
      } else {
        game.showTopToast("⚡ Jyeana's Electric Overdrive! Restored all lights + 7s Hyper Sprint!");
      }
    }

    return true;
  }

  draw(ctx) {
    // Draw Stealth Blanket Camouflage Effect
    if (this.stealthTimer > 0) {
      ctx.save();
      ctx.globalAlpha = 0.45;
      super.draw(ctx);
      ctx.restore();

      // Draw floating Zzz icon over head
      ctx.fillStyle = "#F472B6";
      ctx.font = "bold 14px Fredoka, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🤫 HIDDEN", this.x, this.y - 45);
      return;
    }

    // Draw Active Power Glowing Aura
    if (this.auraColor) {
      ctx.save();
      ctx.shadowColor = this.auraColor;
      ctx.shadowBlur = 20;
      ctx.strokeStyle = this.auraColor;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y - 12, 26, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = this.auraColor;
      ctx.font = "bold 10px Fredoka, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("⚡ POWER ACTIVE", this.x, this.y - 42);
      ctx.restore();
    }

    super.draw(ctx);
  }
}
