/**
 * Sister Sneak: Phone Locked - 3-Floor Cutaway House Map
 * Manages rendering of the vertical house cross-section, rooms, and
 * visual differentiation between Pending vs Completed chores.
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT, FLOORS, FLOOR_Y, ROOMS, HOTSPOTS } from '../config/constants.js';
import { Room } from './Room.js';

export class HouseMap {
  constructor(game) {
    this.game = game;
    this.floors = FLOORS;
    this.rooms = [];
    this.hotspots = HOTSPOTS;
    this.blackedOutFloors = new Set();
    this.lockedRooms = new Set();

    this.initRooms();
  }

  initRooms() {
    Object.values(ROOMS).forEach((roomConfig) => {
      this.rooms.push(new Room(roomConfig));
    });
  }

  getRoomAt(x, y, floor) {
    return this.rooms.find((r) => r.contains(x, y, floor)) || null;
  }

  getHotspotNear(x, y, floor, threshold = 45) {
    return this.hotspots.find((hs) => {
      if (hs.floor !== floor) return false;
      const dist = Math.hypot(hs.x - x, hs.y - y);
      return dist <= (hs.radius || threshold);
    }) || null;
  }

  setFloorBlackout(floor, isBlackout) {
    if (isBlackout) {
      this.blackedOutFloors.add(floor);
    } else {
      this.blackedOutFloors.delete(floor);
    }
  }

  isFloorBlackedOut(floor) {
    return this.blackedOutFloors.has(floor);
  }

  update(dt) {
    this.rooms.forEach((r) => r.update(dt));
  }

  draw(ctx, activeFloor) {
    // 1. Draw House Exterior Background (Warm Terracotta / Sandstone Joint Family Mansion)
    ctx.fillStyle = "#180F0A";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Sunny Sky behind Terrace
    const skyGrad = ctx.createLinearGradient(0, 0, 0, FLOOR_Y[2] + 20);
    skyGrad.addColorStop(0, "#38BDF8");
    skyGrad.addColorStop(1, "#BAE6FD");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(40, 10, CANVAS_WIDTH - 80, FLOOR_Y[2] + 15);

    // Warm Sun on top left
    ctx.fillStyle = "#FBBF24";
    ctx.beginPath();
    ctx.arc(100, 45, 25, 0, Math.PI * 2);
    ctx.fill();

    // 2. Draw Floor Cross-Section Slabs (Teak Wood & Terracotta)
    this.floors.forEach((fl) => {
      const fy = fl.y;
      
      // Outer House Wall Border
      ctx.fillStyle = "#78350F";
      ctx.fillRect(45, fy + 12, CANVAS_WIDTH - 90, 180);

      // Floor Slab (Thick wooden beams separating floors)
      ctx.fillStyle = "#451A03";
      ctx.fillRect(35, fy + 188, CANVAS_WIDTH - 70, 24);
      ctx.fillStyle = "#B45309";
      ctx.fillRect(35, fy + 192, CANVAS_WIDTH - 70, 8);

      // Floor Number Label on side column
      ctx.fillStyle = activeFloor === fl.id ? "#F59E0B" : "#A8A29E";
      ctx.font = "bold 16px 'Yatra One', Fredoka, sans-serif";
      ctx.fillText(fl.label, 12, fy + 100);
    });

    // 3. Draw All Individual Rooms
    this.rooms.forEach((room) => {
      const isBlackedOut = this.isFloorBlackedOut(room.floor);
      room.draw(ctx, isBlackedOut);
    });

    // 4. Draw Hotspot Glowing Halos with Pending vs Completed Indicators
    this.drawHotspots(ctx, activeFloor);
  }

  drawHotspots(ctx, activeFloor) {
    const time = Date.now() / 300;
    const taskManager = this.game ? this.game.taskManager : null;

    this.hotspots.forEach((hs) => {
      if (hs.floor !== activeFloor) return;

      const pulse = Math.sin(time) * 4;
      const isTask = !!hs.taskId;
      const isDone = isTask && taskManager && taskManager.isTaskCompleted(hs.taskId);

      ctx.save();

      if (hs.isEmergencyButton) {
        // Red Emergency Phone Box
        ctx.strokeStyle = "rgba(239, 68, 68, 0.9)";
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(hs.x, hs.y, hs.radius + pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "18px Fredoka, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("🚨", hs.x, hs.y + 6);
      } else if (hs.isStairHotspot) {
        // Yellow Stairs
        ctx.strokeStyle = "rgba(245, 158, 11, 0.8)";
        ctx.fillStyle = "rgba(245, 158, 11, 0.2)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(hs.x, hs.y, hs.radius + pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "16px Fredoka, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(hs.icon, hs.x, hs.y + 5);
      } else if (isDone) {
        // ✅ COMPLETED CHORE: Soft Green ring + Green Checkmark Badge
        ctx.strokeStyle = "rgba(16, 185, 129, 0.6)";
        ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(hs.x, hs.y, hs.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();

        // Icon
        ctx.font = "16px Fredoka, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(hs.icon, hs.x, hs.y + 5);

        // Overhead Green Check Badge
        ctx.fillStyle = "#10B981";
        ctx.beginPath();
        ctx.arc(hs.x + 16, hs.y - 16, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 11px Fredoka, sans-serif";
        ctx.fillText("✓", hs.x + 16, hs.y - 12);
      } else {
        // ⚠️ PENDING CHORE: Bright Glowing Gold Ring + Pulsing Attention Indicator
        ctx.strokeStyle = "rgba(245, 158, 11, 0.95)";
        ctx.fillStyle = "rgba(245, 158, 11, 0.35)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(hs.x, hs.y, hs.radius + pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();

        // Icon
        ctx.font = "18px Fredoka, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(hs.icon, hs.x, hs.y + 6);

        // Overhead Yellow Warning/Pending Dot
        ctx.fillStyle = "#F59E0B";
        ctx.beginPath();
        ctx.arc(hs.x + 16, hs.y - 16, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#451A03";
        ctx.font = "bold 11px Fredoka, sans-serif";
        ctx.fillText("!", hs.x + 16, hs.y - 12);
      }

      ctx.restore();
    });
  }
}
