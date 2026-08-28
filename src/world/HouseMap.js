/**
 * Sister Sneak: Phone Locked - 3-Floor Cutaway House Map
 * High-detail Gujarati Joint Family Mansion with cozy furniture decor,
 * distinct room styling, dynamic Door Kundi locking collision, and
 * Among Us Blackout Fog-of-War Vision Spotlight.
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

  lockRoom(roomId, duration = 10.0) {
    const room = this.rooms.find(r => r.id === roomId);
    if (room) {
      room.lock(duration);
    }
  }

  lockRoomAt(x, y, floor, duration = 10.0) {
    const room = this.getRoomAt(x, y, floor);
    if (room) {
      room.lock(duration);
      return room;
    }
    // If not directly in a room, lock the closest room on that floor
    const floorRooms = this.rooms.filter(r => r.floor === floor && !r.isStairs);
    if (floorRooms.length > 0) {
      floorRooms.sort((a, b) => Math.abs((a.bounds.x + a.bounds.w / 2) - x) - Math.abs((b.bounds.x + b.bounds.w / 2) - x));
      floorRooms[0].lock(duration);
      return floorRooms[0];
    }
    return null;
  }

  checkDoorCollision(fromX, toX, floor) {
    for (const room of this.rooms) {
      if (room.checkCollision(fromX, toX, floor)) {
        return true;
      }
    }
    return false;
  }

  update(dt) {
    this.rooms.forEach((r) => r.update(dt));
  }

  draw(ctx, activeFloor) {
    // 1. Sky Background
    const skyGrad = ctx.createLinearGradient(0, 0, 0, FLOOR_Y[2] + 40);
    skyGrad.addColorStop(0, "#0284C7");
    skyGrad.addColorStop(1, "#7DD3FC");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Sun
    ctx.fillStyle = "#FDE047";
    ctx.beginPath();
    ctx.arc(110, 48, 28, 0, Math.PI * 2);
    ctx.fill();

    // 2. Outer Structure & Wooden Base Slabs
    this.floors.forEach((fl) => {
      const fy = fl.y;
      ctx.fillStyle = "#78350F";
      ctx.fillRect(40, fy + 10, CANVAS_WIDTH - 80, 184);

      ctx.fillStyle = "#271206";
      ctx.fillRect(30, fy + 186, CANVAS_WIDTH - 60, 24);
      ctx.fillStyle = "#B45309";
      ctx.fillRect(30, fy + 188, CANVAS_WIDTH - 60, 6);
      ctx.fillStyle = "#D97706";
      ctx.fillRect(30, fy + 194, CANVAS_WIDTH - 60, 2);

      // Floor Label
      const isActive = (activeFloor === fl.id);
      ctx.fillStyle = isActive ? "#F59E0B" : "#78350F";
      ctx.fillRect(8, fy + 70, 36, 44);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 16px 'Yatra One', Fredoka, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(fl.label, 26, fy + 98);
    });

    // 3. Draw All Themed Rooms
    this.rooms.forEach((room) => {
      const isBlackedOut = this.isFloorBlackedOut(room.floor);
      room.draw(ctx, isBlackedOut);
    });

    // 4. Architectural Decorations
    this.drawHouseDecorations(ctx);

    // 5. Draw Task Pins & Glowing Fuse Hotspots
    this.drawTaskPins(ctx, activeFloor);
  }

  // Among Us Style Blackout Fog-of-War:
  // Innocents get a tight flashlight circle; Imposters keep 100% full vision!
  drawBlackoutFogOfWar(ctx, player) {
    if (!player) return;
    const isBlackedOut = this.isFloorBlackedOut(player.floor);
    if (!isBlackedOut) return;

    ctx.save();
    const isImposter = (player.role === "imposter");

    if (isImposter) {
      // Imposter Night Vision: Subtle dark red tint with 100% full vision
      ctx.fillStyle = "rgba(185, 28, 28, 0.15)";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = "#F87171";
      ctx.font = "bold 14px Fredoka, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("👁️ IMPOSTER NIGHT VISION (Full Clear View)", CANVAS_WIDTH / 2, FLOOR_Y[player.floor] + 28);
    } else {
      // Innocent Limited Vision: Dark shadow mask with a circular flashlight spotlight around player
      const fogCanvas = document.createElement("canvas");
      fogCanvas.width = CANVAS_WIDTH;
      fogCanvas.height = CANVAS_HEIGHT;
      const fCtx = fogCanvas.getContext("2d");

      // Fill pitch black
      fCtx.fillStyle = "rgba(7, 10, 20, 0.94)";
      fCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Cut out circular player vision spotlight
      fCtx.globalCompositeOperation = "destination-out";
      const radGrad = fCtx.createRadialGradient(player.x, player.y - 15, 20, player.x, player.y - 15, 140);
      radGrad.addColorStop(0, "rgba(0, 0, 0, 1)");
      radGrad.addColorStop(0.7, "rgba(0, 0, 0, 0.8)");
      radGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      fCtx.fillStyle = radGrad;
      fCtx.beginPath();
      fCtx.arc(player.x, player.y - 15, 140, 0, Math.PI * 2);
      fCtx.fill();

      // Cut out faint glows for nearby fuse boxes
      this.hotspots.forEach(hs => {
        if (hs.floor === player.floor && hs.isFuseBox) {
          const fuseGrad = fCtx.createRadialGradient(hs.x, hs.y, 10, hs.x, hs.y, 70);
          fuseGrad.addColorStop(0, "rgba(0, 0, 0, 0.9)");
          fuseGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
          fCtx.fillStyle = fuseGrad;
          fCtx.beginPath();
          fCtx.arc(hs.x, hs.y, 70, 0, Math.PI * 2);
          fCtx.fill();
        }
      });

      // Draw the fog mask onto main canvas
      ctx.drawImage(fogCanvas, 0, 0);

      // Draw Flashlight guidance text
      ctx.fillStyle = "#FDE047";
      ctx.font = "bold 13px Fredoka, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("⚡ LIGHTS OUT! Follow your flashlight to the Fuse Box!", player.x, player.y - 50);
    }

    ctx.restore();
  }

  drawHouseDecorations(ctx) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(70, FLOOR_Y[2] + 45);
    ctx.lineTo(550, FLOOR_Y[2] + 45);
    ctx.stroke();

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
    const isFloorBlackout = this.isFloorBlackedOut(activeFloor);

    this.hotspots.forEach((hs) => {
      if (hs.floor !== activeFloor) return;

      const isTask = !!hs.taskId;
      const isDone = isTask && taskManager && taskManager.isTaskCompleted(hs.taskId);
      const isAssignedToMe = !isTask || !assignedTasks || assignedTasks.has(hs.taskId);
      const hover = Math.sin(time) * 4;

      ctx.save();

      // FUSE BOX CRITICAL SABOTAGE PIN
      if (hs.isFuseBox && isFloorBlackout) {
        ctx.fillStyle = "#EF4444";
        ctx.shadowColor = "#FBBF24";
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(hs.x, hs.y + hover, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = "#FEF08A";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 16px Fredoka, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("⚡", hs.x, hs.y + hover + 6);

        // Pulsing Label
        ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
        ctx.fillRect(hs.x - 55, hs.y + hover - 30, 110, 18);
        ctx.fillStyle = "#FEF08A";
        ctx.font = "bold 10px Fredoka, sans-serif";
        ctx.fillText("⚡ FIX BLOWN FUSE", hs.x, hs.y + hover - 17);

      } else if (hs.isEmergencyButton) {
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

        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(hs.x - 38, hs.y + hover - 28, 76, 16);
        ctx.fillStyle = "#FCA5A5";
        ctx.font = "bold 9px Fredoka, sans-serif";
        ctx.fillText("MEETING", hs.x, hs.y + hover - 16);

      } else if (hs.isStairHotspot) {
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

        ctx.font = "14px Fredoka, sans-serif";
        ctx.fillText(hs.icon, hs.x, hs.y + 12);

      } else {
        const pinY = hs.y - 14 + hover;

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

        ctx.font = "13px Fredoka, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(hs.icon, hs.x, pinY + 5);

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
