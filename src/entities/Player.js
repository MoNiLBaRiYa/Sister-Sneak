/**
 * Sister Sneak: Phone Locked - Controllable Player Entity
 * Implements Asymmetric Power Dynamics:
 * - Innocent Powers: Self & Team Buffs (Auto-solve, Sprint, Reset Suspicion, Restore Lights)
 * - Imposter Powers: Direct Sabotage & Debuffs onto Innocent Sisters (Slowdown Traps, Paint Blind, Door Locks, Blame Transfer)
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
    this.maxAbilityCooldown = 15.0;

    // Debuff timers caused by Imposter powers
    this.slowDebuffTimer = 0;
    this.paintBlindTimer = 0;
    this.taskFreezeTimer = 0;
  }

  handleInput(input, dt) {
    if (this.abilityCooldown > 0) {
      this.abilityCooldown = Math.max(0, this.abilityCooldown - dt);
    }

    const move = input.getMovementVector();
    let currentSpeed = this.speed;

    // Handle Debuffs from Imposter
    if (this.slowDebuffTimer > 0) {
      currentSpeed *= 0.5; // 50% Slowdown
      this.slowDebuffTimer = Math.max(0, this.slowDebuffTimer - dt);
    }
    if (this.paintBlindTimer > 0) {
      this.paintBlindTimer = Math.max(0, this.paintBlindTimer - dt);
    }
    if (this.taskFreezeTimer > 0) {
      this.taskFreezeTimer = Math.max(0, this.taskFreezeTimer - dt);
    }

    // Handle Self Buffs
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
    const isImposter = (this.role === "imposter");

    // =========================================================================
    // 1. 🌸 RIDDHI
    // =========================================================================
    if (this.id === "RIDDHI") {
      if (!isImposter) {
        // INNOCENT: Self-Camouflage (Mummy ignores for 10s)
        this.stealthTimer = 10.0;
        this.auraColor = "#F472B6";
        this.auraTimer = 10.0;
        this.suspicion = 0;
        game.showTopToast("🌸 Riddhi's Cozy Blanket Camouflage! Invisible to Mummy for 10s!");
      } else {
        // IMPOSTER: Sleep Cloud Trap (Slows down all innocent sisters by 50% for 7s)
        this.stealthTimer = 8.0;
        this.auraColor = "#EF4444";
        this.auraTimer = 8.0;
        game.applyImposterDebuffToInnocents("SLOW_TRAP", this.floor);
        game.showTopToast("😈 Imposter Riddhi threw a Sleep Trap! All innocent sisters slowed by 50%!");
      }
    }

    // =========================================================================
    // 2. 🎨 SHRUTI
    // =========================================================================
    else if (this.id === "SHRUTI") {
      if (!isImposter) {
        // INNOCENT: Self Master Touch (Auto-solves active chore or +20% Cleanliness)
        this.auraColor = "#38BDF8";
        this.auraTimer = 6.0;
        if (game.taskManager.activeMiniGame) {
          game.taskManager.activeMiniGame.updateProgress(1.0);
          game.showTopToast("🎨 Shruti's Artistic Flow AUTO-SOLVED the chore! ✨");
        } else {
          game.taskManager.contributeCleanliness(20);
          game.showTopToast("🎨 Shruti's Master Touch! Generated +20% Cleanliness burst!");
        }
      } else {
        // IMPOSTER: Fake Evidence Splatter (Raises innocents' suspicion by +35% and blinds vision)
        this.auraColor = "#DC2626";
        this.auraTimer = 6.0;
        game.applyImposterDebuffToInnocents("PAINT_FRAME", this.floor);
        game.showTopToast("😈 Imposter Shruti splattered Fake Paint! Framed innocent sisters (+35% Suspicion)!");
      }
    }

    // =========================================================================
    // 3. 🎒 JAHANVI
    // =========================================================================
    else if (this.id === "JAHANVI") {
      if (!isImposter) {
        // INNOCENT: Self-Vent Teleport + Speed Dash to reach chores fast
        const nextFloor = (this.floor + 1) % 3;
        this.setFloor(nextFloor, 300 + Math.random() * 600);
        game.camera.setFloor(nextFloor);
        game.updateFloorButtonsUI(nextFloor);
        this.sprintTimer = 6.0;
        this.auraColor = "#F59E0B";
        this.auraTimer = 6.0;
        game.showTopToast(`🌀 Jahanvi's Secret Vent Portal! Jumped to Floor ${nextFloor === 2 ? '3F' : nextFloor === 1 ? '2F' : '1F'} + Super Dash!`);
      } else {
        // IMPOSTER: Vent Escape & Door Slam (Locks all doors on floor, trapping innocents)
        const nextFloor = (this.floor + 1) % 3;
        this.setFloor(nextFloor, 300 + Math.random() * 600);
        game.camera.setFloor(nextFloor);
        game.updateFloorButtonsUI(nextFloor);
        this.auraColor = "#EF4444";
        this.auraTimer = 6.0;
        game.applyImposterDebuffToInnocents("DOOR_SLAM", this.floor);
        game.showTopToast("😈 Imposter Jahanvi vented away & SLAMMED all doors shut on innocents!");
      }
    }

    // =========================================================================
    // 4. 📚 JISHA
    // =========================================================================
    else if (this.id === "JISHA") {
      if (!isImposter) {
        // INNOCENT: Self Study Genius (Auto-solves worksheet) + resets Mummy suspicion
        this.auraColor = "#A78BFA";
        this.auraTimer = 8.0;
        this.suspicion = 0;
        if (game.taskManager.activeMiniGame) {
          game.taskManager.activeMiniGame.updateProgress(1.0);
          game.showTopToast("📚 Jisha's Genius Brain AUTO-SOLVED the study sheet! ⭐");
        } else {
          game.bots.forEach(b => b.suspicion = Math.max(0, b.suspicion - 30));
          game.showTopToast("📚 Jisha's Universal Ladli Charm! Mummy's suspicion reset to 0%!");
        }
      } else {
        // IMPOSTER: Blame Shift (Transfers her suspicion onto innocent sisters)
        this.auraColor = "#7C3AED";
        this.auraTimer = 8.0;
        this.suspicion = 0;
        game.applyImposterDebuffToInnocents("BLAME_SHIFT", this.floor);
        game.showTopToast("😈 Imposter Jisha shifted all blame onto innocent sisters!");
      }
    }

    // =========================================================================
    // 5. ⚡ JYEANA
    // =========================================================================
    else if (this.id === "JYEANA") {
      if (!isImposter) {
        // INNOCENT: Self Overdrive (Restores blackouts instantly + 7s Hyper Sprint)
        this.sprintTimer = 7.0;
        this.auraColor = "#10B981";
        this.auraTimer = 7.0;
        game.houseMap.blackedOutFloors.clear();
        game.showTopToast("⚡ Jyeana's Electric Overdrive! Restored all lights + 7s Hyper Sprint!");
      } else {
        // IMPOSTER: Electrical Sabotage Surge (Freezes all innocent tasks for 8s + 0s sabotage cooldowns)
        this.sprintTimer = 7.0;
        this.auraColor = "#EF4444";
        this.auraTimer = 7.0;
        if (game.sabotageSystem) {
          game.sabotageSystem.cooldowns.BLACKOUT = 0;
          game.sabotageSystem.cooldowns.KUNDI = 0;
          game.sabotageSystem.cooldowns.MESS = 0;
        }
        game.applyImposterDebuffToInnocents("TASK_FREEZE", this.floor);
        game.showTopToast("😈 Imposter Jyeana triggered an Electric Surge! All innocent tasks frozen for 8s!");
      }
    }

    // Broadcast power activation to multiplayer
    if (game.multiplayer && game.multiplayer.isMultiplayer) {
      game.multiplayer.syncPowerActivation(this.id, this.name + "'s Power", this.auraColor, this.stealthTimer > 0);
    }

    return true;
  }

  draw(ctx) {
    if (this.stealthTimer > 0) {
      ctx.save();
      ctx.globalAlpha = 0.45;
      super.draw(ctx);
      ctx.restore();

      ctx.fillStyle = "#F472B6";
      ctx.font = "bold 14px Fredoka, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🤫 HIDDEN", this.x, this.y - 45);
      return;
    }

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
      ctx.fillText(this.role === "imposter" ? "😈 IMPOSTER POWER" : "⚡ INNOCENT POWER", this.x, this.y - 42);
      ctx.restore();
    }

    super.draw(ctx);
  }
}
