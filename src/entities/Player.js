/**
 * Sister Sneak: Phone Locked - Controllable Player Entity
 * Implements Asymmetric Power Dynamics & Door Kundi Collision Prevention:
 * - Innocent Powers: Self & Team Buffs (Auto-solve, Sprint, Reset Suspicion, Restore Lights)
 * - Prankster Powers: Direct Sabotage & Debuffs onto Innocent Sisters (Slowdown Traps, Paint Blind, Door Locks, Blame Transfer)
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
    this.maxAbilityCooldown = 25.0; // Standard 25s cooldown like Among Us

    // Debuff timers caused by Prankster powers
    this.slowDebuffTimer = 0;
    this.paintBlindTimer = 0;
    this.taskFreezeTimer = 0;

    // Active power label text
    this.activePowerLabel = null;
  }

  handleInput(input, dt, game = null) {
    if (this.abilityCooldown > 0) {
      this.abilityCooldown = Math.max(0, this.abilityCooldown - dt);
    }

    const move = input.getMovementVector();
    let currentSpeed = this.speed;

    // Handle Debuffs from Prankster
    if (this.slowDebuffTimer > 0) {
      currentSpeed *= 0.45; // 55% Slowdown
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
      currentSpeed *= 1.85;
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
      if (this.auraTimer <= 0) {
        this.auraColor = null;
        this.activePowerLabel = null;
      }
    }

    // Movement calculation
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

    // Check Door Kundi collision before applying movement
    const nextX = this.x + this.vx * dt;
    if (game && game.houseMap && game.houseMap.checkDoorCollision(this.x, nextX, this.floor)) {
      this.vx = 0;
      game.showTopToast("🔒 This room's door is locked with KUNDI from outside!");
    } else {
      this.x = nextX;
    }

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
    const isPrankster = (this.role === "prankster");

    // =========================================================================
    // 1. 🌸 RIDDHI
    // =========================================================================
    if (this.id === "RIDDHI") {
      if (!isPrankster) {
        // INNOCENT: Self-Camouflage (Mummy ignores for 10s)
        this.stealthTimer = 10.0;
        this.auraColor = "#F472B6";
        this.auraTimer = 10.0;
        this.activePowerLabel = "🛌 COZY CAMOUFLAGE (10s)";
        this.suspicion = 0;
        game.showTopToast("🌸 Riddhi's Cozy Blanket Camouflage! Invisible to Mummy for 10s!");
      } else {
        // PRANKSTER: Sleep Cloud Trap (Slows down all innocent sisters by 55% for 8s)
        this.stealthTimer = 8.0;
        this.auraColor = "#EF4444";
        this.auraTimer = 8.0;
        this.activePowerLabel = "😴 SLEEP CLOUD TRAP (8s)";
        game.applyPranksterDebuffToInnocents("SLOW_TRAP", this.floor);
        game.showTopToast("😈 Prankster Riddhi dropped a Sleep Cloud! All innocent sisters slowed by 55%!");
      }
    }

    // =========================================================================
    // 2. 🎨 SHRUTI
    // =========================================================================
    else if (this.id === "SHRUTI") {
      if (!isPrankster) {
        // INNOCENT: Master Touch (Auto-solves active chore or +20% Cleanliness)
        this.auraColor = "#38BDF8";
        this.auraTimer = 6.0;
        this.activePowerLabel = "✨ ARTISTIC FLOW (+20%)";
        if (game.taskManager.activeMiniGame) {
          game.taskManager.activeMiniGame.updateProgress(1.0);
          game.showTopToast("🎨 Shruti's Artistic Flow AUTO-SOLVED the chore! ✨");
        } else {
          game.taskManager.contributeCleanliness(20);
          game.showTopToast("🎨 Shruti's Master Touch! Generated +20% Cleanliness burst!");
        }
      } else {
        // PRANKSTER: Fake Evidence Splatter (Raises innocents' suspicion by +35% and blinds vision)
        this.auraColor = "#DC2626";
        this.auraTimer = 6.0;
        this.activePowerLabel = "🎨 PAINT BLIND (+35% SUSP)";
        game.applyPranksterDebuffToInnocents("PAINT_FRAME", this.floor);
        game.showTopToast("😈 Prankster Shruti splattered Fake Paint! Framed innocent sisters (+35% Suspicion)!");
      }
    }

    // =========================================================================
    // 3. 🎒 JAHANVI
    // =========================================================================
    else if (this.id === "JAHANVI") {
      if (!isPrankster) {
        // INNOCENT: Self-Vent Teleport + Speed Dash to reach chores fast
        const nextFloor = (this.floor + 1) % 3;
        this.setFloor(nextFloor, 300 + Math.random() * 600);
        game.camera.setFloor(nextFloor);
        game.updateFloorButtonsUI(nextFloor);
        this.sprintTimer = 6.0;
        this.auraColor = "#F59E0B";
        this.auraTimer = 6.0;
        this.activePowerLabel = "🌀 VENT DASH (6s)";
        game.showTopToast(`🌀 Jahanvi's Secret Vent Portal! Jumped to Floor ${nextFloor === 2 ? '3F' : nextFloor === 1 ? '2F' : '1F'} + Super Dash!`);
      } else {
        // PRANKSTER: Vent Escape & Door Slam (Locks all doors on floor, trapping innocents)
        const nextFloor = (this.floor + 1) % 3;
        this.setFloor(nextFloor, 300 + Math.random() * 600);
        game.camera.setFloor(nextFloor);
        game.updateFloorButtonsUI(nextFloor);
        this.auraColor = "#EF4444";
        this.auraTimer = 6.0;
        this.activePowerLabel = "🚪 VENT & DOOR SLAM";
        game.applyPranksterDebuffToInnocents("DOOR_SLAM", this.floor);
        game.showTopToast("😈 Prankster Jahanvi vented away & SLAMMED all doors shut on innocents!");
      }
    }

    // =========================================================================
    // 4. 📚 JISHA
    // =========================================================================
    else if (this.id === "JISHA") {
      if (!isPrankster) {
        // INNOCENT: Self Study Genius (Auto-solves worksheet) + resets Mummy suspicion
        this.auraColor = "#A78BFA";
        this.auraTimer = 8.0;
        this.activePowerLabel = "⭐ GENIUS LADLI (0% SUSP)";
        this.suspicion = 0;
        if (game.taskManager.activeMiniGame) {
          game.taskManager.activeMiniGame.updateProgress(1.0);
          game.showTopToast("📚 Jisha's Genius Brain AUTO-SOLVED the study sheet! ⭐");
        } else {
          game.bots.forEach(b => b.suspicion = Math.max(0, b.suspicion - 30));
          game.showTopToast("📚 Jisha's Universal Ladli Charm! Mummy's suspicion reset to 0%!");
        }
      } else {
        // PRANKSTER: Blame Shift (Transfers her suspicion onto innocent sisters)
        this.auraColor = "#7C3AED";
        this.auraTimer = 8.0;
        this.activePowerLabel = "🎭 BLAME SHIFT CHARM";
        this.suspicion = 0;
        game.applyPranksterDebuffToInnocents("BLAME_SHIFT", this.floor);
        game.showTopToast("😈 Prankster Jisha shifted all blame onto innocent sisters!");
      }
    }

    // =========================================================================
    // 5. ⚡ JYEANA
    // =========================================================================
    else if (this.id === "JYEANA") {
      if (!isPrankster) {
        // INNOCENT: Self Overdrive (Restores blackouts instantly + 7s Hyper Sprint)
        this.sprintTimer = 7.0;
        this.auraColor = "#10B981";
        this.auraTimer = 7.0;
        this.activePowerLabel = "⚡ HYPER SPRINT (7s)";
        game.houseMap.blackedOutFloors.clear();
        game.sabotageSystem?.resolveCriticalSabotage();
        game.showTopToast("⚡ Jyeana's Electric Overdrive! Restored all lights + 7s Hyper Sprint!");
      } else {
        // PRANKSTER: Electrical Sabotage Surge (Freezes all innocent tasks for 8s + 0s sabotage cooldowns)
        this.sprintTimer = 7.0;
        this.auraColor = "#EF4444";
        this.auraTimer = 7.0;
        this.activePowerLabel = "⚡ SABOTAGE SURGE (0s CD)";
        if (game.sabotageSystem) {
          game.sabotageSystem.cooldowns.BLACKOUT = 0;
          game.sabotageSystem.cooldowns.KUNDI = 0;
        }
        game.applyPranksterDebuffToInnocents("TASK_FREEZE", this.floor);
        game.showTopToast("😈 Prankster Jyeana triggered an Electric Surge! All innocent tasks frozen for 8s!");
      }
    }

    // Broadcast power activation to multiplayer peers
    if (game.multiplayer && game.multiplayer.isMultiplayer) {
      game.multiplayer.syncPowerActivation(this.id, this.activePowerLabel || this.name + "'s Power", this.auraColor, this.stealthTimer > 0);
    }

    return true;
  }

  draw(ctx) {
    if (this.stealthTimer > 0) {
      ctx.save();
      ctx.globalAlpha = 0.38;
      super.draw(ctx);
      ctx.restore();

      ctx.fillStyle = "#F472B6";
      ctx.font = "bold 13px Fredoka, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🛌 COZY CAMOUFLAGE (Hidden)", this.x, this.y - 45);
      return;
    }

    if (this.auraColor) {
      ctx.save();
      ctx.shadowColor = this.auraColor;
      ctx.shadowBlur = 22;
      ctx.strokeStyle = this.auraColor;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y - 12, 28, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = this.auraColor;
      ctx.font = "bold 11px Fredoka, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(this.activePowerLabel || (this.role === "prankster" ? "😈 PRANKSTER POWER" : "⚡ INNOCENT POWER"), this.x, this.y - 45);
      ctx.restore();
    }

    super.draw(ctx);
  }
}
