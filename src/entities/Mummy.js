/**
 * Sister Sneak: Phone Locked - Inspector Mummy Entity
 * Patrols the 3-floor mansion, checks rooms, and monitors sister behaviors.
 */

import { FLOOR_Y } from '../config/constants.js';

export class Mummy {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.avatar = config.avatar;
    this.personality = config.personality;
    this.patrolSpeed = config.patrolSpeed || 1.8;
    this.triggers = config.triggers || [];
    this.dialogues = config.dialogues || {};

    this.floor = 1;
    this.x = 550;
    this.y = FLOOR_Y[1] + 120;
    this.facing = "right";
    this.walkCycle = 0;
    this.isMoving = true;

    // Patrol waypoints across floors
    this.patrolWaypoints = [
      { floor: 1, x: 200 },
      { floor: 1, x: 900 },
      { floor: 1, x: 1100 }, // stairs
      { floor: 2, x: 300 },
      { floor: 2, x: 800 },
      { floor: 2, x: 1050 }, // stairs down
      { floor: 0, x: 250 },
      { floor: 0, x: 700 },
      { floor: 0, x: 950 }
    ];
    this.currentWaypointIndex = 0;
    this.pauseTimer = 0;
  }

  update(dt, sisters) {
    if (this.pauseTimer > 0) {
      this.pauseTimer -= dt;
      this.isMoving = false;
      return;
    }

    this.isMoving = true;
    this.walkCycle += dt * 8;

    const target = this.patrolWaypoints[this.currentWaypointIndex];

    // If on a different floor than target, transition smoothly
    if (this.floor !== target.floor) {
      this.floor = target.floor;
      this.y = FLOOR_Y[this.floor] + 120;
    }

    const dx = target.x - this.x;
    if (Math.abs(dx) > 10) {
      const step = Math.sign(dx) * this.patrolSpeed * 50 * dt;
      this.x += step;
      this.facing = dx > 0 ? "right" : "left";
    } else {
      // Reached waypoint, pause briefly and move to next
      this.pauseTimer = 2.0 + Math.random() * 2.0;
      this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.patrolWaypoints.length;
    }

    // Inspect nearby sisters on same floor
    if (sisters) {
      sisters.forEach((s) => {
        if (s.floor === this.floor && !s.isHidden && !s.isEjected && !(s.stealthTimer > 0)) {
          const dist = Math.abs(s.x - this.x);
          if (dist < 160) {
            // Check triggers
            if (s.isDashing) {
              s.suspicion = Math.min(100, s.suspicion + dt * 15);
            }
          }
        }
      });
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.facing === "left") {
      ctx.scale(-1, 1);
    }

    // Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
    ctx.beginPath();
    ctx.ellipse(0, 5, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    const bob = Math.abs(Math.sin(this.walkCycle)) * 2.5;

    // Saree Body (Traditional Royal Maroon / Silk)
    ctx.fillStyle = "#991B1B";
    ctx.beginPath();
    ctx.moveTo(-12, -26 - bob);
    ctx.lineTo(12, -26 - bob);
    ctx.lineTo(15, -2 - bob);
    ctx.lineTo(-15, -2 - bob);
    ctx.closePath();
    ctx.fill();

    // Saree Pallu & Gold Border
    ctx.fillStyle = "#F59E0B";
    ctx.beginPath();
    ctx.moveTo(-11, -26 - bob);
    ctx.lineTo(14, -6 - bob);
    ctx.lineTo(10, -2 - bob);
    ctx.lineTo(-13, -22 - bob);
    ctx.closePath();
    ctx.fill();

    // Mummy Head
    ctx.fillStyle = "#FCD34D";
    ctx.beginPath();
    ctx.arc(0, -36 - bob, 15, 0, Math.PI * 2);
    ctx.fill();

    // Traditional Saree Hair Bun (Juda with gajra flowers)
    ctx.fillStyle = "#1E1B18";
    ctx.beginPath();
    ctx.arc(0, -38 - bob, 15, Math.PI, 0, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-14, -36 - bob, 9, 0, Math.PI * 2); // Big Juda
    ctx.fill();

    // White Gajra Jasmine Garland
    ctx.fillStyle = "#FEF3C7";
    ctx.beginPath();
    ctx.arc(-14, -36 - bob, 11, 0, Math.PI * 2);
    ctx.stroke();

    // Face Details: Stern Eyebrows & Big Red Bindi
    ctx.fillStyle = "#DC2626";
    ctx.beginPath();
    ctx.arc(6, -38 - bob, 2.5, 0, Math.PI * 2); // Red bindi
    ctx.fill();

    // Eyes
    ctx.fillStyle = "#1E1B18";
    ctx.beginPath();
    ctx.arc(3, -33 - bob, 2, 0, Math.PI * 2);
    ctx.arc(9, -33 - bob, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Overhead Badge
    this.drawNameBadge(ctx);
  }

  drawNameBadge(ctx) {
    ctx.save();
    ctx.font = "bold 11px Fredoka, sans-serif";
    const text = `👑 ${this.name}`;
    const tw = ctx.measureText(text).width;

    ctx.fillStyle = "rgba(127, 29, 29, 0.9)";
    ctx.beginPath();
    ctx.roundRect(this.x - tw / 2 - 8, this.y - 70, tw + 16, 18, 5);
    ctx.fill();

    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#FDE68A";
    ctx.textAlign = "center";
    ctx.fillText(text, this.x, this.y - 57);

    ctx.restore();
  }
}
