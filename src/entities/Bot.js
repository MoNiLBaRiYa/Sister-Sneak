/**
 * Sister Sneak: Phone Locked - AI Bot Sister Entity
 * Rule-based pathfinding, task simulation, prankster decision loop, and debuff reactions.
 */

import { Character } from './Character.js';
import { FLOOR_Y, HOTSPOTS } from '../config/constants.js';

export class Bot extends Character {
  constructor(config) {
    super(config);
    this.state = "WANDER"; // "WANDER", "DOING_TASK", "SABOTAGING", "FLEEING"
    this.targetHotspot = null;
    this.targetX = config.x;
    this.taskTimer = 0;
    this.thinkTimer = 1.0 + Math.random() * 2.0;
    this.sabotageTimer = 18.0 + Math.random() * 20.0;
    this.abilityTimer = 15.0 + Math.random() * 15.0;

    // Debuff timers
    this.slowDebuffTimer = 0;
    this.stickyTrapTimer = 0;
    this.glitchControlTimer = 0;
    this.ladliShieldTimer = 0;
  }

  updateAI(dt, game) {
    this.thinkTimer -= dt;
    this.abilityTimer -= dt;

    // Update debuff timers
    if (this.slowDebuffTimer > 0) this.slowDebuffTimer = Math.max(0, this.slowDebuffTimer - dt);
    if (this.stickyTrapTimer > 0) this.stickyTrapTimer = Math.max(0, this.stickyTrapTimer - dt);
    if (this.glitchControlTimer > 0) this.glitchControlTimer = Math.max(0, this.glitchControlTimer - dt);
    if (this.ladliShieldTimer > 0) this.ladliShieldTimer = Math.max(0, this.ladliShieldTimer - dt);

    // Bot ability usage
    if (this.abilityTimer <= 0) {
      this.abilityTimer = 25.0 + Math.random() * 15.0;
      if (this.role === "prankster") {
        if (this.id === "RIDDHI") game.applyPranksterDebuffToInnocents("SLEEP_CLOUD", this.floor);
        else if (this.id === "SHRUTI") game.applyPranksterDebuffToInnocents("PAINT_SPLATTER", this.floor);
        else if (this.id === "JAHANVI") game.applyPranksterDebuffToInnocents("STICKY_GUM", this.floor, { x: this.x, y: this.y });
        else if (this.id === "JISHA") game.applyPranksterDebuffToInnocents("FALSE_ALARM", this.floor);
        else if (this.id === "JYEANA") game.applyPranksterDebuffToInnocents("EMP_JAMMER", this.floor);
      } else {
        // Innocent self buffs
        if (this.id === "RIDDHI") { this.stealthTimer = 10.0; this.suspicion = 0; }
        else if (this.id === "SHRUTI") { game.taskManager.contributeCleanliness(15); }
        else if (this.id === "JAHANVI") { this.sprintTimer = 7.0; }
        else if (this.id === "JISHA") { this.ladliShieldTimer = 12.0; this.suspicion = 0; }
        else if (this.id === "JYEANA") { game.houseMap.blackedOutFloors.clear(); this.sprintTimer = 7.0; }
      }
    }

    if (this.role === "prankster") {
      this.sabotageTimer -= dt;
      if (this.sabotageTimer <= 0 && game.sabotageSystem) {
        const sabs = ["BLACKOUT", "KUNDI"];
        const chosen = sabs[Math.floor(Math.random() * sabs.length)];
        game.sabotageSystem.triggerSabotage(chosen, this.floor);
        this.sabotageTimer = 30.0 + Math.random() * 20.0;
      }
    }

    // Immobilized by sticky trap!
    if (this.stickyTrapTimer > 0) {
      this.vx = 0;
      this.isMoving = false;
      this.update(dt);
      return;
    }

    if (this.thinkTimer <= 0) {
      this.thinkTimer = 4.0 + Math.random() * 3.0;
      this.chooseNextGoal(game);
    }

    // Move toward target
    if (this.targetX !== null) {
      const dx = this.targetX - this.x;
      if (Math.abs(dx) > 10) {
        let speed = this.speed * 50;
        if (this.slowDebuffTimer > 0) speed *= 0.40;
        if (this.sprintTimer > 0) speed *= 1.8;

        this.vx = Math.sign(dx) * speed;
        if (this.glitchControlTimer > 0) this.vx = -this.vx;

        this.facing = dx > 0 ? "right" : "left";
        this.isMoving = true;
      } else {
        this.vx = 0;
        this.isMoving = false;

        // If at a task hotspot, simulate inspecting/pretending to clean
        if (this.state === "WANDER" && this.targetHotspot) {
          this.state = "DOING_TASK";
          this.taskTimer = 4.0 + Math.random() * 5.0;
        }
      }
    }

    if (this.state === "DOING_TASK") {
      this.taskTimer -= dt;
      if (this.taskTimer <= 0) {
        this.state = "WANDER";
        this.chooseNextGoal(game);
      }
    }

    const nextX = this.x + this.vx * dt;
    if (game && game.houseMap && game.houseMap.checkDoorCollision(this.x, nextX, this.floor)) {
      this.vx = 0;
      this.isMoving = false;
      this.chooseNextGoal(game);
    } else {
      this.x = nextX;
    }
    this.update(dt);
  }

  chooseNextGoal(game) {
    // 25% chance to switch floor via stairs
    if (Math.random() < 0.25) {
      const otherFloors = [0, 1, 2].filter((f) => f !== this.floor);
      const chosenFloor = otherFloors[Math.floor(Math.random() * otherFloors.length)];
      this.setFloor(chosenFloor, 1050);
      this.targetX = 200 + Math.random() * 700;
      this.targetHotspot = null;
      return;
    }

    // Pick a hotspot on the current floor
    const floorHotspots = HOTSPOTS.filter((h) => h.floor === this.floor && !h.isStairHotspot);
    if (floorHotspots.length > 0 && Math.random() < 0.7) {
      const hs = floorHotspots[Math.floor(Math.random() * floorHotspots.length)];
      this.targetHotspot = hs;
      this.targetX = hs.x;
    } else {
      this.targetHotspot = null;
      this.targetX = 150 + Math.random() * 900;
    }
  }

  draw(ctx) {
    if (this.stealthTimer > 0) {
      ctx.save();
      ctx.globalAlpha = 0.38;
      super.draw(ctx);
      ctx.restore();
      return;
    }

    if (this.stickyTrapTimer > 0) {
      ctx.save();
      ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
      ctx.beginPath();
      ctx.ellipse(this.x, this.y + 4, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    super.draw(ctx);
  }
}
