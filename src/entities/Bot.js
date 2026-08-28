/**
 * Sister Sneak: Phone Locked - AI Bot Sister Entity
 * Rule-based pathfinding, task simulation, and prankster decision loop.
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
    this.sabotageTimer = 20.0 + Math.random() * 25.0;
  }

  updateAI(dt, game) {
    this.thinkTimer -= dt;

    if (this.role === "prankster") {
      this.sabotageTimer -= dt;
      if (this.sabotageTimer <= 0 && game.sabotageSystem) {
        const sabs = ["BLACKOUT", "KUNDI"];
        const chosen = sabs[Math.floor(Math.random() * sabs.length)];
        game.sabotageSystem.triggerSabotage(chosen, this.floor);
        this.sabotageTimer = 35.0 + Math.random() * 25.0;
      }
    }

    if (this.thinkTimer <= 0) {
      this.thinkTimer = 4.0 + Math.random() * 3.0;
      this.chooseNextGoal(game);
    }

    // Move toward target
    if (this.targetX !== null) {
      const dx = this.targetX - this.x;
      if (Math.abs(dx) > 10) {
        this.vx = Math.sign(dx) * this.speed * 50;
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

    this.x += this.vx * dt;
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
}
