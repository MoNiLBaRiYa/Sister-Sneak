/**
 * Sister Sneak: Phone Locked - Controllable Player Entity
 * 
 * Implements Asymmetric Tactical Power Dynamics:
 * - INNOCENT POWERS (Self-Benefiting):
 *   * Riddhi: Blanket Sanctuary (Invisible to Mummy, 0% Suspicion, Gentle Escape Speed for 10s)
 *   * Shruti: Artistic Masterstroke (Auto-solve active chore or +20% Cleanliness burst + 6s Sprint)
 *   * Jahanvi: Turbo Vent Shortcut (Instant floor teleport + 7s Supersonic Dash 2.2x speed)
 *   * Jisha: Mummy's Ladli Shield (12s Total Immunity from Mummy + 0% Suspicion + Meeting Protection)
 *   * Jyeana: Smart Inverter Hack (Instantly restore blackouts on all floors + Night Vision + 7s Hyper Sprint)
 * 
 * - PRANKSTER POWERS (Trap Someone / Irritate & Disrupt All):
 *   * Riddhi: Sleep Cloud Trap (60% Slowdown fog on floor for 8s)
 *   * Shruti: Rangoli Paint Splatter (Blinds innocent screens with colorful paint for 5s + +30% Suspicion)
 *   * Jahanvi: Sticky Bubblegum Snare (Immobilizes & roots innocent sisters in place for 5s)
 *   * Jisha: False Alarm & Blame Transfer (Fakes emergency, sends Mummy chasing innocents + +35% Suspicion)
 *   * Jyeana: EMP Jammer & Inverted Controls (Glitch inverts movement controls Left⇋Right + freezes chores for 6s)
 */

import { Character } from './Character.js';
import { FLOOR_Y } from '../config/constants.js';

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
    this.maxAbilityCooldown = 25.0; // 25s tactical cooldown

    // Asymmetric Debuff Timers (Inflicted by Prankster Powers)
    this.slowDebuffTimer = 0;      // Riddhi: 60% Slowdown
    this.paintBlindTimer = 0;      // Shruti: Screen Paint Blindness
    this.stickyTrapTimer = 0;      // Jahanvi: 100% Rooted/Immobilized
    this.glitchControlTimer = 0;   // Jyeana: Inverted movement controls
    this.taskFreezeTimer = 0;      // Jyeana: Chore freeze

    // Self-Buff Timers (Innocent Powers)
    this.ladliShieldTimer = 0;     // Jisha: Golden Mummy Immunity
    this.activePowerLabel = null;
  }

  handleInput(input, dt, game = null) {
    if (this.abilityCooldown > 0) {
      this.abilityCooldown = Math.max(0, this.abilityCooldown - dt);
    }

    const move = input.getMovementVector();
    let currentSpeed = this.speed;

    // -------------------------------------------------------------
    // 1. Process Prankster Debuffs on Player
    // -------------------------------------------------------------
    // Jyeana EMP Jammer: Invert Controls (Left becomes Right, Up becomes Down)
    if (this.glitchControlTimer > 0) {
      this.glitchControlTimer = Math.max(0, this.glitchControlTimer - dt);
      move.x = -move.x;
      move.y = -move.y;
    }

    // Jahanvi Sticky Gum: 100% Immobilization (Cannot move at all)
    if (this.stickyTrapTimer > 0) {
      this.stickyTrapTimer = Math.max(0, this.stickyTrapTimer - dt);
      currentSpeed = 0;
    }

    // Riddhi Sleep Cloud: 60% Heavy Slowdown
    if (this.slowDebuffTimer > 0) {
      currentSpeed *= 0.40;
      this.slowDebuffTimer = Math.max(0, this.slowDebuffTimer - dt);
    }

    // Shruti Paint Splatter: Screen Blindness
    if (this.paintBlindTimer > 0) {
      this.paintBlindTimer = Math.max(0, this.paintBlindTimer - dt);
    }

    if (this.taskFreezeTimer > 0) {
      this.taskFreezeTimer = Math.max(0, this.taskFreezeTimer - dt);
    }

    // -------------------------------------------------------------
    // 2. Process Innocent Self-Buffs
    // -------------------------------------------------------------
    // Jisha Ladli Shield: Immunity to Mummy and Suspicion Reset
    if (this.ladliShieldTimer > 0) {
      this.ladliShieldTimer = Math.max(0, this.ladliShieldTimer - dt);
      this.suspicion = 0;
    }

    // Riddhi Blanket Stealth
    if (this.stealthTimer > 0) {
      this.stealthTimer = Math.max(0, this.stealthTimer - dt);
    }

    // Jahanvi Turbo Sprint / Jyeana Hyper Sprint
    if (this.sprintTimer > 0) {
      currentSpeed *= 1.95;
      this.sprintTimer = Math.max(0, this.sprintTimer - dt);
    }

    if (this.auraTimer > 0) {
      this.auraTimer = Math.max(0, this.auraTimer - dt);
      if (this.auraTimer <= 0) {
        this.auraColor = null;
        this.activePowerLabel = null;
      }
    }

    // -------------------------------------------------------------
    // 3. Movement Calculations
    // -------------------------------------------------------------
    if (currentSpeed === 0) {
      this.vx = 0;
      this.vy = 0;
      this.isMoving = false;
    } else if (Math.abs(move.x) > 0.05 || Math.abs(move.y) > 0.05) {
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

    // -------------------------------------------------------------
    // 4. Door Kundi Collision Check & 360-Degree Boundary Clamping
    // -------------------------------------------------------------
    const nextX = this.x + this.vx * dt;
    if (game && game.houseMap && game.houseMap.checkDoorCollision(this.x, nextX, this.floor)) {
      this.vx = 0;
      game.showTopToast("🔒 This room's door is locked with KUNDI from outside!");
    } else {
      this.x = Math.max(80, Math.min(1175, nextX));
    }

    const nextY = this.y + this.vy * dt;
    const baseFloorY = (FLOOR_Y && FLOOR_Y[this.floor] !== undefined) ? FLOOR_Y[this.floor] : 280;
    this.y = Math.max(baseFloorY + 50, Math.min(baseFloorY + 155, nextY));

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

    const isPrankster = (this.role === "prankster");
    const p3d = game.player3D ? game.player3D.mesh.position : { x: 0, y: 0, z: 0 };

    // =========================================================================
    // 1. 🌸 RIDDHI
    // =========================================================================
    if (this.id === "RIDDHI") {
      if (!isPrankster) {
        // INNOCENT: Blanket Sanctuary - Translucent Ghost Invisibility + 0% Suspicion for 10s
        this.stealthTimer = 10.0;
        this.suspicion = 0;
        this.sprintTimer = 10.0;
        this.auraColor = "#EC4899";
        this.auraTimer = 10.0;
        this.activePowerLabel = "🛌 BLANKET SANCTUARY (10s)";
        game.audio.playPower();
        game.showTopToast("🌸 Riddhi's Blanket Sanctuary ACTIVE! Ghost Invisibility & 0% Suspicion for 10s!");
      } else {
        // PRANKSTER: Sleep Cloud Trap - 3D volumetric purple mist cloud slowing all innocents by 60%
        this.auraColor = "#EF4444";
        this.auraTimer = 8.0;
        this.activePowerLabel = "😴 SLEEP CLOUD TRAP (8s)";
        if (game.particles3D) {
          game.particles3D.spawnSleepCloud(p3d.x, p3d.y, p3d.z, 8.0);
        }
        game.applyPranksterDebuffToInnocents("SLEEP_CLOUD", this.floor);
        game.audio.playPower();
        game.showTopToast("😈 Prankster Riddhi dropped a 3D Sleep Cloud! Nearby innocent sisters slowed by 60%!");
      }
    }

    // =========================================================================
    // 2. 🎨 SHRUTI
    // =========================================================================
    else if (this.id === "SHRUTI") {
      if (!isPrankster) {
        // INNOCENT: Artistic Masterstroke - Auto-completes nearest active chore + +25% Cleanliness + 6s Sprint
        this.auraColor = "#38BDF8";
        this.auraTimer = 6.0;
        this.sprintTimer = 6.0;
        this.activePowerLabel = "✨ MASTERSTROKE (+25%)";
        game.audio.playVictory();

        if (game.taskManager.activeMiniGame) {
          game.taskManager.activeMiniGame.updateProgress(1.0);
          game.showTopToast("🎨 Shruti's Artistic Masterstroke AUTO-SOLVED the current minigame! ✨");
        } else {
          const myAssigned = HOTSPOTS.filter(hs => hs.taskId && game.taskManager.assignedTasks.has(hs.taskId) && !game.taskManager.isTaskCompleted(hs.taskId));
          if (myAssigned.length > 0) {
            const nearest = myAssigned.reduce((prev, curr) => Math.hypot(curr.x - this.x, curr.y - this.y) < Math.hypot(prev.x - this.x, prev.y - this.y) ? curr : prev);
            game.taskManager.completeTask(nearest.taskId);
            game.showTopToast(`🎨 Masterstroke! Auto-Completed "${nearest.label}" (+25% Cleanliness)! ✨`);
          } else {
            game.taskManager.contributeCleanliness(25);
            game.showTopToast("🎨 Shruti's Masterstroke! Instant +25% Cleanliness Boost & Flow Speed!");
          }
        }
      } else {
        // PRANKSTER: Rangoli Paint Splatter - Blinds innocent screens with paint for 5s & drops cleanliness
        this.auraColor = "#DC2626";
        this.auraTimer = 6.0;
        this.activePowerLabel = "🎨 PAINT SPLATTER BLIND";
        game.applyPranksterDebuffToInnocents("PAINT_SPLATTER", this.floor);
        if (game.taskManager) game.taskManager.contributeCleanliness(-15);
        game.audio.playPower();
        game.showTopToast("😈 Prankster Shruti splattered Rangoli Paint! Blinds innocents & dropped -15% Cleanliness!");
      }
    }

    // =========================================================================
    // 3. 🎒 JAHANVI
    // =========================================================================
    else if (this.id === "JAHANVI") {
      if (!isPrankster) {
        // INNOCENT: Supersonic Turbo Dash (2.5x speed for 8s)
        this.sprintTimer = 8.0;
        this.auraColor = "#06B6D4";
        this.auraTimer = 8.0;
        this.activePowerLabel = "⚡ SUPERSONIC DASH (8s)";
        game.audio.playPower();
        game.showTopToast("⚡ Jahanvi's Supersonic Dash ACTIVE! 2.5x Speed Boost for 8s!");
      } else {
        // PRANKSTER: Sticky Bubblegum Snare - Spawns 3D sticky floor puddle trapping whoever steps on it for 3.5s
        this.auraColor = "#EF4444";
        this.auraTimer = 7.0;
        this.activePowerLabel = "🦶 STICKY GUM TRAP (12s)";
        if (game.particles3D) {
          game.particles3D.spawnStickyGumTrap(p3d.x, p3d.y, p3d.z, 12.0);
        }
        game.applyPranksterDebuffToInnocents("STICKY_GUM", this.floor, { x: this.x, y: this.y });
        game.audio.playPower();
        game.showTopToast("😈 Prankster Jahanvi placed a 3D Sticky Bubblegum puddle on the floor!");
      }
    }

    // =========================================================================
    // 4. 📚 JISHA
    // =========================================================================
    else if (this.id === "JISHA") {
      if (!isPrankster) {
        // INNOCENT: Mummy's Ladli Shield - Orbiting 3D Golden Star Crown + 12s 100% Immunity & 0% Suspicion
        this.ladliShieldTimer = 12.0;
        this.suspicion = 0;
        this.auraColor = "#F59E0B";
        this.auraTimer = 12.0;
        this.activePowerLabel = "⭐ MUMMY'S GOLDEN LADLI (12s)";
        if (game.particles3D && game.player3D && game.player3D.mesh) {
          game.particles3D.createLadliHalo(game.player3D.mesh);
        }
        game.audio.playVictory();
        if (game.taskManager.activeMiniGame && game.taskManager.activeMiniGame.id === "HOMEWORK_MATH") {
          game.taskManager.activeMiniGame.updateProgress(1.0);
          game.showTopToast("📚 Jisha's Genius Brain AUTO-SOLVED the study sheet! ⭐");
        } else {
          game.showTopToast("⭐ Jisha's Golden Ladli Shield! 100% Mummy Immunity & 0% Suspicion for 12s!");
        }
      } else {
        // PRANKSTER: False Alarm & Blame Transfer - Screams false alarm, sending Mummy to chase innocent sisters
        this.auraColor = "#7C3AED";
        this.auraTimer = 8.0;
        this.activePowerLabel = "📢 FALSE ALARM & BLAME";
        game.applyPranksterDebuffToInnocents("FALSE_ALARM", this.floor);
        game.audio.playDefeat();
        game.showTopToast("😈 Prankster Jisha screamed a FALSE ALARM! Mummy is rushing to inspect the nearest sister!");
      }
    }

    // =========================================================================
    // 5. ⚡ JYEANA
    // =========================================================================
    else if (this.id === "JYEANA") {
      if (!isPrankster) {
        // INNOCENT: Smart Inverter Hack - Restores all blacked-out floors + fixes blown fuses + 7s Hyper Sprint
        this.sprintTimer = 7.0;
        this.auraColor = "#10B981";
        this.auraTimer = 7.0;
        this.activePowerLabel = "⚡ SMART INVERTER OVERDRIVE";
        game.houseMap.blackedOutFloors.clear();
        game.sabotageSystem?.resolveCriticalSabotage();
        game.audio.playVictory();
        game.showTopToast("⚡ Jyeana's Smart Inverter Hack! Restored all lights + 7s Hyper Sprint!");
      } else {
        // PRANKSTER: EMP Jammer - Inverts controls + glitches scanlines + resets Sabotage cooldowns
        this.auraColor = "#EF4444";
        this.auraTimer = 7.0;
        this.activePowerLabel = "⚡ EMP CONTROLS JAMMER";
        game.applyPranksterDebuffToInnocents("EMP_JAMMER", this.floor);
        if (game.sabotageSystem) {
          game.sabotageSystem.cooldowns.BLACKOUT = 0;
          game.sabotageSystem.cooldowns.KUNDI = 0;
        }
        game.audio.playPower();
        game.showTopToast("😈 Prankster Jyeana pulsed an EMP Jammer! Controls inverted & Sabotage cooldowns reset!");
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
      ctx.font = "bold 12px Fredoka, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🛌 BLANKET SANCTUARY (Hidden)", this.x, this.y - 45);
      return;
    }

    if (this.ladliShieldTimer > 0) {
      ctx.save();
      ctx.shadowColor = "#FBBF24";
      ctx.shadowBlur = 24;
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y - 12, 30, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#FDE047";
      ctx.font = "bold 11px Fredoka, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("⭐ MUMMY'S GOLDEN LADLI", this.x, this.y - 45);
      ctx.restore();
    } else if (this.auraColor) {
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

    // Visual Sticky Gum indicator at feet
    if (this.stickyTrapTimer > 0) {
      ctx.save();
      ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
      ctx.beginPath();
      ctx.ellipse(this.x, this.y + 4, 20, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#FEF08A";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#FFF";
      ctx.font = "bold 10px Fredoka, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🦶 STUCK IN GUM!", this.x, this.y + 20);
      ctx.restore();
    }

    super.draw(ctx);
  }
}
