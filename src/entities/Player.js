/**
 * Sister Sneak: Phone Locked - Controllable Player Entity
 * Handles user movement, sprinting, interaction, and active character abilities.
 */

import { Character } from './Character.js';

export class Player extends Character {
  constructor(config) {
    super(config);
    this.targetX = null;
    this.targetY = null;
    this.clickToMove = false;
    this.sprintTimer = 0;
    this.abilityCooldown = 0;
    this.maxAbilityCooldown = 25; // 25 seconds cooldown
  }

  handleInput(inputManager, dt) {
    const move = inputManager.getMovementVector();

    // Ability cooldown
    if (this.abilityCooldown > 0) {
      this.abilityCooldown = Math.max(0, this.abilityCooldown - dt);
    }

    if (this.buffTimer > 0) {
      this.buffTimer = Math.max(0, this.buffTimer - dt);
    }

    // Speed calculation
    let currentSpeed = this.speed;
    if (this.sprintTimer > 0) {
      this.sprintTimer -= dt;
      currentSpeed *= 1.8;
      this.isDashing = true;
    } else {
      this.isDashing = false;
    }

    if (this.buffTimer > 0) {
      currentSpeed *= 1.4;
    }

    if (move.active) {
      this.clickToMove = false;
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
        alert("🌸 Partner Courage Activated! +80% Speed & Task boost for 8s!");
      } else {
        this.stealthTimer = 8.0;
        alert("🤫 Blanket Stealth Activated! Hidden under blanket for 8s (Untargetable)!");
      }
    }

    // 2. Shruti
    else if (this.id === "SHRUTI") {
      if (this.role === "innocent") {
        game.taskManager.contributeCleanliness(25);
        alert("🎨 Artistic Flow Activated! Instantly generated +25% House Cleanliness!");
      } else {
        // Raise suspicion of a random innocent sister
        const innocents = game.bots.filter(b => b.role === "innocent");
        if (innocents.length > 0) {
          const target = innocents[Math.floor(Math.random() * innocents.length)];
          target.suspicion = Math.min(100, target.suspicion + 30);
          alert(`🎭 Fake Clue Fabricated! Framed ${target.name} (Suspicion +30)!`);
        }
      }
    }

    // 3. Jahanvi
    else if (this.id === "JAHANVI") {
      if (this.role === "innocent") {
        this.sprintTimer = 6.0;
        alert("🎒 Shortcut Master Sprint Activated! Super Speed Dash for 6s!");
      } else {
        const nextFloor = (this.floor + 1) % 3;
        this.setFloor(nextFloor);
        game.camera.setFloor(nextFloor);
        alert(`🌀 Floor Teleport Activated! Jumped instantly to Floor ${nextFloor + 1}F!`);
      }
    }

    // 4. Jisha
    else if (this.id === "JISHA") {
      if (this.role === "innocent") {
        this.suspicion = 0;
        game.bots.forEach(b => b.suspicion = Math.max(0, b.suspicion - 20));
        alert("📚 Universal Ladli Card Activated! Mummy's suspicion reset to 0% with sweet words!");
      } else {
        alert("🛡️ Innocent Shield Activated! Protected against the first vote in family meeting!");
      }
    }

    // 5. Jyeana
    else if (this.id === "JYEANA") {
      if (this.role === "innocent") {
        this.sprintTimer = 5.0;
        this.buffTimer = 5.0;
        alert("⚡ Quick Hint & Dash Activated! +40% Speed & Task clues highlighted!");
      } else {
        if (game.sabotageSystem) {
          game.sabotageSystem.cooldowns.BLACKOUT = 0;
          game.sabotageSystem.cooldowns.KUNDI = 0;
          game.sabotageSystem.cooldowns.MESS = 0;
          alert("⚡ Rapid Saboteur Activated! All sabotage cooldowns reset to 0s!");
        }
      }
    }

    return true;
  }
}
