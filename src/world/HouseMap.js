/**
 * Sister Sneak: Phone Locked - 3-Floor Cutaway House Map
 * High-detail Gujarati Joint Family Mansion with cozy furniture decor,
 * distinct room styling, and sleek floating task pin markers (no flat circle clutter).
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

  getHotspotNear(x, y, floor, threshold = 48) {
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
    // 1. Warm Night/Day Sky Background
    const skyGrad = ctx.createLinearGradient(0, 0, 0, FLOOR_Y[2] + 40);
    skyGrad.addColorStop(0, "#0284C7");
    skyGrad.addColorStop(1, "#7DD3FC");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Warm Sun & Distant Clouds
    ctx.fillStyle = "#FDE047";
    ctx.beginPath();
    ctx.arc(110, 48, 28, 0, Math.PI * 2);
    ctx.fill();

    // 2. Draw House Outer Structure & Floor Cross-Sections
    this.floors.forEach((fl) => {
      const fy = fl.y;
      
      // Outer Mansion Sandstone Wall Frame
      ctx.fillStyle = "#78350F";
      ctx.fillRect(40, fy + 10, CANVAS_WIDTH - 80, 184);

      // Deep Teak Wooden Floor Base Slabs with Polished Bevel
      ctx.fillStyle = "#271206";
      ctx.fillRect(30, fy + 186, CANVAS_WIDTH - 60, 24);
      ctx.fillStyle = "#B45309";
      ctx.fillRect(30, fy + 188, CANVAS_WIDTH - 60, 6);
      ctx.fillStyle = "#D97706";
      ctx.fillRect(30, fy + 194, CANVAS_WIDTH - 60, 2);

      // Floor Label Ribbon on Side Column
      const isActive = activeFloor === fl.id;
      ctx.fillStyle = isActive ? "#F59E0B" : "#78350F";
      ctx.fillRect(8, fy + 70, 36, 44);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 16px 'Yatra One', Fredoka, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(fl.label, 26, fy + 98);
    });

    // 3. Draw All Individual Themed Rooms with Furniture Decor
    this.rooms.forEach((room) => {
      const isBlackedOut = this.isFloorBlackedOut(room.floor);
      room.draw(ctx, isBlackedOut);
    });

    // 4. Draw Rich Custom Architectural Features
    this.drawHouseDecorations(ctx);

    // 5. Draw Sleek Modern Task Pins (Floating 3D Diamond Markers)
    this.drawTaskPins(ctx, activeFloor);
  }

  drawHouseDecorations(ctx) {
    // 3F Terrace Rooftop Railing & Fluttering Kites
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(70, FLOOR_Y[2] + 45);
    ctx.lineTo(550, FLOOR_Y[2] + 45);
    ctx.stroke();

    // 2F Heritage Toran Wall Banner in Central Hall
    ctx.fillStyle = "#DC2626";
    for (let i = 480; i < 750; i += 28) {
      ctx.beginPath();
      ctx.moveTo(i, FLOOR_Y[1] + 24);
      ctx.lineTo(i + 14, FLOOR_Y[1] + 36);
      ctx.lineTo(i + 28, FLOOR_Y[1] + 24);
      ctx.fill();
    }
  }

  drawTaskPins(ctx, activeFloor) {
    const time = Date.now() / 250;
    const taskManager = this.game ? this.game.taskManager : null;
    const assignedTasks = taskManager ? taskManager.assignedTasks : null;

    this.hotspots.forEach((hs) => {
      if (hs.floor !== activeFloor) return;

      const isTask = !!hs.taskId;
      const isDone = isTask && taskManager && taskManager.isTaskCompleted(hs.taskId);
      const isAssignedToMe = !isTask || !assignedTasks || assignedTasks.has(hs.taskId);
      const hover = Math.sin(time) * 4;

      ctx.save();

      if (hs.isEmergencyButton) {
        // Red Pulsing Emergency Alarm Box
        ctx.fillStyle = "#EF4444";
        ctx.shadowColor = "#EF4444";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(hs.x, hs.y + hover, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "14px Fredoka, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("🚨", hs.x, hs.y + hover + 5);

        // Subtitle tag
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(hs.x - 38, hs.y + hover - 28, 76, 16);
        ctx.fillStyle = "#FCA5A5";
        ctx.font = "bold 9px Fredoka, sans-serif";
        ctx.fillText("MEETING", hs.x, hs.y + hover - 16);

      } else if (hs.isStairHotspot) {
        // Wooden Stairway Portal Indicator
        ctx.fillStyle = "#F59E0B";
        ctx.beginPath();
        ctx.arc(hs.x, hs.y + hover, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "14px Fredoka, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(hs.icon, hs.x, hs.y + hover + 5);

      } else if (isDone) {
        // ✨ COMPLETED TASK PIN: Sleek green checkmark pin
        ctx.fillStyle = "rgba(16, 185, 129, 0.9)";
        ctx.beginPath();
        ctx.arc(hs.x, hs.y - 12, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 12px Fredoka, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("✓", hs.x, hs.y - 8);

        // Neat item emoji below
        ctx.font = "14px Fredoka, sans-serif";
        ctx.fillText(hs.icon, hs.x, hs.y + 12);

      } else {
        // ⚠️ UNFINISHED TASK PIN: Sleek glowing golden diamond pin with icon
        const pinY = hs.y - 14 + hover;

        // Glowing Diamond Badge
        ctx.fillStyle = isAssignedToMe ? "#F59E0B" : "#94A3B8";
        if (isAssignedToMe) {
          ctx.shadowColor = "#FBBF24";
          ctx.shadowBlur = 10;
        }

        ctx.beginPath();
        ctx.arc(hs.x, pinY, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Icon inside pin
        ctx.font = "13px Fredoka, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(hs.icon, hs.x, pinY + 5);

        // Task Name Mini Tag
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        const labelWidth = Math.min(100, hs.label.length * 6 + 12);
        ctx.fillRect(hs.x - labelWidth / 2, pinY - 20, labelWidth, 14);

        ctx.fillStyle = isAssignedToMe ? "#FEF08A" : "#CBD5E1";
        ctx.font = "bold 8px Fredoka, sans-serif";
        ctx.fillText(hs.label, hs.x, pinY - 10);
      }

      ctx.restore();
    });
  }
}
