/**
 * Sister Sneak: Phone Locked - Room Entity
 * Represents an individual room with visual furniture, boundaries,
 * and physical Door Kundi locking mechanisms with doorway collision.
 */

export class Room {
  constructor(config) {
    this.id = config.id;
    this.floor = config.floor;
    this.name = config.name;
    this.bounds = config.bounds; // { x, y, w, h }
    this.theme = config.theme;
    this.icon = config.icon;
    this.tasks = config.tasks || [];
    this.isStairs = config.isStairs || false;
    this.isMeetingRoom = config.isMeetingRoom || false;
    this.connectsTo = config.connectsTo || null;
    this.fanAngle = Math.random() * Math.PI * 2;

    // Door Kundi Sabotage Lock State
    this.isLocked = false;
    this.lockTimer = 0;
  }

  lock(duration = 10.0) {
    this.isLocked = true;
    this.lockTimer = duration;
  }

  unlock() {
    this.isLocked = false;
    this.lockTimer = 0;
  }

  contains(x, y, floor) {
    if (floor !== this.floor) return false;
    const b = this.bounds;
    return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
  }

  // Prevents characters from entering or exiting a locked room
  checkCollision(fromX, toX, floor) {
    if (floor !== this.floor || !this.isLocked) return false;
    const b = this.bounds;
    const isInsideBefore = fromX >= b.x && fromX <= b.x + b.w;
    const isInsideAfter = toX >= b.x && toX <= b.x + b.w;

    // If attempting to cross the room's doorway boundary
    if (isInsideBefore !== isInsideAfter) {
      return true; // BLOCKED by locked door!
    }
    return false;
  }

  update(dt) {
    this.fanAngle += dt * 8;

    if (this.lockTimer > 0) {
      this.lockTimer -= dt;
      if (this.lockTimer <= 0) {
        this.unlock();
      }
    }
  }

  draw(ctx, isBlackedOut = false) {
    const { x, y, w, h } = this.bounds;

    // Room Wallpaper / Back Wall
    ctx.fillStyle = this.theme;
    ctx.fillRect(x, y, w, h);

    // Floor Baseboard
    ctx.fillStyle = "#A88365";
    ctx.fillRect(x, y + h - 16, w, 16);
    ctx.fillStyle = "#8B5E3C";
    ctx.fillRect(x, y + h - 18, w, 2);

    // Ceiling Beams / Trim
    ctx.fillStyle = "#78350F";
    ctx.fillRect(x, y, w, 6);

    // Side Dividers / Wall Posts
    ctx.fillStyle = "#92400E";
    ctx.fillRect(x, y, 4, h);
    ctx.fillRect(x + w - 4, y, 4, h);

    // Draw Room-specific Props & Indian Interior Decors
    this.drawRoomProps(ctx, x, y, w, h);

    // Room Label Banner (Subtle, Top Left)
    ctx.fillStyle = "rgba(41, 37, 36, 0.75)";
    ctx.beginPath();
    ctx.roundRect(x + 10, y + 10, ctx.measureText(this.name).width + 36, 20, 6);
    ctx.fill();

    ctx.fillStyle = "#FDE68A";
    ctx.font = "bold 11px Fredoka, sans-serif";
    ctx.fillText(`${this.icon} ${this.name}`, x + 16, y + 24);

    // DOOR KUNDI SABOTAGE LOCK OVERLAY & HEAVY BARS
    if (this.isLocked) {
      ctx.save();
      // Red locked doorway tint
      ctx.fillStyle = "rgba(127, 29, 29, 0.65)";
      ctx.fillRect(x, y, w, h);

      // Heavy Iron Lattice Bars
      ctx.strokeStyle = "#450A0A";
      ctx.lineWidth = 4;
      for (let bx = x + 12; bx < x + w; bx += 24) {
        ctx.beginPath();
        ctx.moveTo(bx, y);
        ctx.lineTo(bx, y + h);
        ctx.stroke();
      }

      // Border glow
      ctx.strokeStyle = "#EF4444";
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);

      // Padlock Badge in Center
      const midX = x + w / 2;
      const midY = y + h / 2;
      ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
      ctx.beginPath();
      ctx.roundRect(midX - 60, midY - 20, 120, 36, 8);
      ctx.fill();

      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#F87171";
      ctx.font = "bold 12px Fredoka, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`🔒 KUNDI (${Math.ceil(this.lockTimer)}s)`, midX, midY + 4);
      ctx.restore();
    }

    // Blackout Overlay if floor lights are sabotaged
    if (isBlackedOut) {
      ctx.fillStyle = "rgba(10, 5, 25, 0.85)";
      ctx.fillRect(x, y, w, h);

      ctx.fillStyle = "#EF4444";
      ctx.font = "bold 12px Fredoka, sans-serif";
      ctx.fillText("⚡ FUSE BLOWN", x + w / 2 - 40, y + h / 2);
    }
  }

  drawRoomProps(ctx, x, y, w, h) {
    if (this.id === "BALCONY") {
      ctx.strokeStyle = "#4B5563";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let rx = x + 10; rx < x + w - 10; rx += 14) {
        ctx.moveTo(rx, y + h - 40);
        ctx.lineTo(rx, y + h - 16);
      }
      ctx.moveTo(x + 5, y + h - 40);
      ctx.lineTo(x + w - 5, y + h - 40);
      ctx.stroke();

      ctx.fillStyle = "#B45309";
      ctx.fillRect(x + 25, y + h - 36, 22, 20);
      ctx.fillStyle = "#15803D";
      ctx.beginPath();
      ctx.arc(x + 36, y + h - 42, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#16A34A";
      ctx.beginPath();
      ctx.arc(x + 120, y + 26, 12, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.id === "CENTRAL_HALL") {
      this.drawCeilingFan(ctx, x + w / 2, y + 25);

      ctx.fillStyle = "#78350F";
      ctx.fillRect(x + 40, y + h - 45, 110, 28);
      ctx.fillStyle = "#DC2626";
      ctx.fillRect(x + 45, y + h - 52, 100, 16);

      ctx.fillStyle = "#92400E";
      ctx.fillRect(x + 180, y + h - 35, 75, 20);
      
      ctx.fillStyle = "#F59E0B";
      ctx.fillRect(x + 198, y + h - 52, 38, 22);
      ctx.strokeStyle = "#78350F";
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 198, y + h - 52, 38, 22);
      ctx.fillStyle = "#DC2626";
      ctx.fillText("🔒📱", x + 204, y + h - 36);

      ctx.fillStyle = "#D97706";
      ctx.fillRect(x + 180, y + 25, 40, 30);
      ctx.fillStyle = "#FFFBEB";
      ctx.fillRect(x + 184, y + 29, 32, 22);
      ctx.fillStyle = "#78350F";
      ctx.fillText("👴👵", x + 190, y + 45);
    } else if (this.id === "KITCHEN") {
      ctx.fillStyle = "#334155";
      ctx.fillRect(x + 15, y + h - 45, w - 30, 30);

      ctx.fillStyle = "#94A3B8";
      ctx.fillRect(x + 20, y + 30, 45, h - 48);
      ctx.fillStyle = "#64748B";
      ctx.fillRect(x + 58, y + 60, 4, 20);

      ctx.fillStyle = "#CBD5E1";
      for (let dx = x + 85; dx < x + w - 40; dx += 24) {
        ctx.fillRect(dx, y + 35, 18, 22);
      }

      ctx.fillStyle = "#1E293B";
      ctx.fillRect(x + 120, y + h - 52, 35, 8);
      ctx.fillStyle = "#EA580C";
      ctx.fillRect(x + 130, y + h - 58, 14, 7);
    } else if (this.id === "BEDROOM_1") {
      this.drawCeilingFan(ctx, x + w / 2, y + 25);

      ctx.fillStyle = "#78350F";
      ctx.fillRect(x + 30, y + h - 42, 110, 26);
      ctx.fillStyle = "#EC4899";
      ctx.fillRect(x + 35, y + h - 46, 100, 12);
      ctx.fillStyle = "#FFF";
      ctx.fillRect(x + 40, y + h - 52, 28, 10);

      ctx.fillStyle = "#92400E";
      ctx.fillRect(x + 145, y + 25, 42, h - 42);
      ctx.fillStyle = "#F59E0B";
      ctx.fillRect(x + 150, y + 65, 4, 10);
    } else if (this.id === "TERRACE_DRY") {
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 20, y + 45);
      ctx.lineTo(x + w - 20, y + 45);
      ctx.stroke();

      const clothesColors = ["#EF4444", "#3B82F6", "#F59E0B", "#10B981", "#8B5CF6"];
      clothesColors.forEach((color, idx) => {
        const cx = x + 50 + idx * 80;
        ctx.fillStyle = color;
        ctx.fillRect(cx, y + 45, 36, 45);
        ctx.fillStyle = "#FEF3C7";
        ctx.fillRect(cx + 6, y + 42, 4, 6);
        ctx.fillRect(cx + 26, y + 42, 4, 6);
      });
    } else if (this.id === "TERRACE_TANK") {
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(x + 60, y + 30, 90, 80);
      ctx.fillStyle = "#334155";
      ctx.fillRect(x + 55, y + 25, 100, 10);
      ctx.fillStyle = "#0284C7";
      ctx.fillRect(x + 140, y + 90, 8, 50);
      ctx.fillStyle = "#EF4444";
      ctx.fillRect(x + 136, y + 105, 16, 8);
    } else if (this.id === "VERANDA") {
      this.drawRangoli(ctx, x + 60, y + h - 12);

      ctx.fillStyle = "#78350F";
      ctx.fillRect(x + 120, y + h - 38, 70, 22);
      ctx.fillStyle = "#EF4444";
      ctx.fillRect(x + 126, y + h - 34, 14, 6);
      ctx.fillStyle = "#3B82F6";
      ctx.fillRect(x + 150, y + h - 34, 14, 6);
    } else if (this.id === "STORE_ROOM") {
      ctx.fillStyle = "#B45309";
      ctx.fillRect(x + 30, y + h - 48, 70, 30);
      ctx.fillStyle = "#D97706";
      ctx.fillRect(x + 40, y + h - 70, 50, 24);

      ctx.fillStyle = "#FEF3C7";
      ctx.fillRect(x + 130, y + h - 40, 22, 24);
      ctx.fillStyle = "#B45309";
      ctx.fillRect(x + 130, y + h - 40, 22, 10);
    } else if (this.id === "BAR_COUNTER") {
      ctx.fillStyle = "#78350F";
      ctx.fillRect(x + 20, y + h - 45, w - 40, 30);

      ctx.fillStyle = "#C2410C";
      ctx.beginPath();
      ctx.arc(x + 45, y + h - 45, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#CBD5E1";
      for (let gx = x + 90; gx < x + 160; gx += 16) {
        ctx.fillRect(gx, y + h - 50, 10, 16);
      }
    } else if (this.id === "GROUND_BEDROOM") {
      this.drawCeilingFan(ctx, x + w / 2, y + 25);

      ctx.fillStyle = "#FFF";
      ctx.fillRect(x + 30, y + 60, 24, 30);
      ctx.fillStyle = "#10B981";
      ctx.fillRect(x + 34, y + 66, 6, 6);
      ctx.fillRect(x + 44, y + 66, 6, 6);
      ctx.fillRect(x + 34, y + 78, 6, 6);
    } else if (this.isStairs) {
      ctx.fillStyle = "#D97706";
      const numSteps = 7;
      const stepW = w / numSteps;
      const stepH = (h - 20) / numSteps;
      for (let s = 0; s < numSteps; s++) {
        ctx.fillRect(x + s * stepW, y + h - 16 - (s + 1) * stepH, stepW + 2, (s + 1) * stepH);
      }
      ctx.fillStyle = "#78350F";
      ctx.fillText("🪜 STAIRS", x + 20, y + 40);
    }
  }

  drawCeilingFan(ctx, cx, cy) {
    ctx.fillStyle = "#451A03";
    ctx.fillRect(cx - 3, cy - 15, 6, 15);
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#78350F";
    ctx.lineWidth = 5;
    for (let b = 0; b < 3; b++) {
      const angle = this.fanAngle + (b * Math.PI * 2) / 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * 32, cy + Math.sin(angle) * 14);
      ctx.stroke();
    }
  }

  drawRangoli(ctx, cx, cy) {
    ctx.fillStyle = "#F59E0B";
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#DC2626";
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFF";
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}
