/**
 * Sister Sneak: Phone Locked - Room Entity
 * Represents an individual room with visual furniture, boundaries & interaction points.
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
  }

  contains(x, y, floor) {
    if (floor !== this.floor) return false;
    const b = this.bounds;
    return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
  }

  update(dt) {
    // Spin ceiling fans
    this.fanAngle += dt * 8;
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

    // Blackout Overlay if floor lights are sabotaged
    if (isBlackedOut) {
      ctx.fillStyle = "rgba(10, 5, 25, 0.85)";
      ctx.fillRect(x, y, w, h);

      // Warning flicker icon
      ctx.fillStyle = "#EF4444";
      ctx.font = "bold 12px Fredoka, sans-serif";
      ctx.fillText("⚡ FUSE BLOWN", x + w / 2 - 40, y + h / 2);
    }
  }

  drawRoomProps(ctx, x, y, w, h) {
    // 1. Balcony (Plants & Tulsi Kyara)
    if (this.id === "BALCONY") {
      // Railing
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

      // Tulsi Pot & Money Plant Pots
      ctx.fillStyle = "#B45309";
      ctx.fillRect(x + 25, y + h - 36, 22, 20); // Tulsi Pot
      ctx.fillStyle = "#15803D";
      ctx.beginPath();
      ctx.arc(x + 36, y + h - 42, 14, 0, Math.PI * 2);
      ctx.fill();

      // Hanging Creeper
      ctx.fillStyle = "#16A34A";
      ctx.beginPath();
      ctx.arc(x + 120, y + 26, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Central Hall (Sofa, Phone Lock Box on Table, Mummy Recliner, Wall Clocks)
    else if (this.id === "CENTRAL_HALL") {
      // Spinning Ceiling Fan
      this.drawCeilingFan(ctx, x + w / 2, y + 25);

      // Big Cozy Indian Wooden Sofa
      ctx.fillStyle = "#78350F";
      ctx.fillRect(x + 40, y + h - 45, 110, 28);
      ctx.fillStyle = "#DC2626"; // Red Marigold Cushion
      ctx.fillRect(x + 45, y + h - 52, 100, 16);

      // Center Teapoy Table with HEIRLOOM PHONE BOX
      ctx.fillStyle = "#92400E";
      ctx.fillRect(x + 180, y + h - 35, 75, 20);
      
      // Brass Locked Phone Box
      ctx.fillStyle = "#F59E0B";
      ctx.fillRect(x + 198, y + h - 52, 38, 22);
      ctx.strokeStyle = "#78350F";
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 198, y + h - 52, 38, 22);
      ctx.fillStyle = "#DC2626";
      ctx.fillText("🔒📱", x + 204, y + h - 36);

      // Ancestral Framed Photo on Wall
      ctx.fillStyle = "#D97706";
      ctx.fillRect(x + 180, y + 25, 40, 30);
      ctx.fillStyle = "#FFFBEB";
      ctx.fillRect(x + 184, y + 29, 32, 22);
      ctx.fillStyle = "#78350F";
      ctx.fillText("👴👵", x + 190, y + 45);
    }

    // 3. Kitchen (Gas Stove, Steel Dabba Rack, Fridge)
    else if (this.id === "KITCHEN") {
      // Kitchen Counter
      ctx.fillStyle = "#334155";
      ctx.fillRect(x + 15, y + h - 45, w - 30, 30);

      // Steel Fridge
      ctx.fillStyle = "#94A3B8";
      ctx.fillRect(x + 20, y + 30, 45, h - 48);
      ctx.fillStyle = "#64748B";
      ctx.fillRect(x + 58, y + 60, 4, 20); // Handle

      // Steel Dabba Racks
      ctx.fillStyle = "#CBD5E1";
      for (let dx = x + 85; dx < x + w - 40; dx += 24) {
        ctx.fillRect(dx, y + 35, 18, 22); // Steel containers
      }

      // Gas Stove & Chai Pan
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(x + 120, y + h - 52, 35, 8);
      ctx.fillStyle = "#EA580C";
      ctx.fillRect(x + 130, y + h - 58, 14, 7); // Chai pan
    }

    // 4. Bedroom 1 (Charpai / Bed, Wardrobe)
    else if (this.id === "BEDROOM_1") {
      this.drawCeilingFan(ctx, x + w / 2, y + 25);

      // Wooden Bed with colorful Indian Bedsheet
      ctx.fillStyle = "#78350F";
      ctx.fillRect(x + 30, y + h - 42, 110, 26);
      ctx.fillStyle = "#EC4899"; // Pink Bedsheet
      ctx.fillRect(x + 35, y + h - 46, 100, 12);
      ctx.fillStyle = "#FFF"; // Pillow
      ctx.fillRect(x + 40, y + h - 52, 28, 10);

      // Wooden Almirah / Wardrobe
      ctx.fillStyle = "#92400E";
      ctx.fillRect(x + 145, y + 25, 42, h - 42);
      ctx.fillStyle = "#F59E0B";
      ctx.fillRect(x + 150, y + 65, 4, 10);
    }

    // 5. Terrace Clothes & Tank
    else if (this.id === "TERRACE_DRY") {
      // Clothesline with fluttering clothes
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 20, y + 45);
      ctx.lineTo(x + w - 20, y + 45);
      ctx.stroke();

      // Hanging Kurtas, Sarees, Dupattas
      const clothesColors = ["#EF4444", "#3B82F6", "#F59E0B", "#10B981", "#8B5CF6"];
      clothesColors.forEach((color, idx) => {
        const cx = x + 50 + idx * 80;
        ctx.fillStyle = color;
        ctx.fillRect(cx, y + 45, 36, 45);
        ctx.fillStyle = "#FEF3C7"; // Clothes Pegs
        ctx.fillRect(cx + 6, y + 42, 4, 6);
        ctx.fillRect(cx + 26, y + 42, 4, 6);
      });
    }

    else if (this.id === "TERRACE_TANK") {
      // Big Overhead Black Sintex Water Tank
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(x + 60, y + 30, 90, 80);
      ctx.fillStyle = "#334155";
      ctx.fillRect(x + 55, y + 25, 100, 10);
      ctx.fillStyle = "#0284C7"; // Water pipe
      ctx.fillRect(x + 140, y + 90, 8, 50);
      ctx.fillStyle = "#EF4444"; // Red Valve
      ctx.fillRect(x + 136, y + 105, 16, 8);
    }

    // 6. Veranda (Shoe Rack, Chappals, Rangoli)
    else if (this.id === "VERANDA") {
      // Rangoli on floor
      this.drawRangoli(ctx, x + 60, y + h - 12);

      // Wooden Shoe Stand with Colorful Chappals
      ctx.fillStyle = "#78350F";
      ctx.fillRect(x + 120, y + h - 38, 70, 22);
      ctx.fillStyle = "#EF4444";
      ctx.fillRect(x + 126, y + h - 34, 14, 6); // Red sandal
      ctx.fillStyle = "#3B82F6";
      ctx.fillRect(x + 150, y + h - 34, 14, 6); // Blue sandal
    }

    // 7. Store Room (Trunks & Achar Jars)
    else if (this.id === "STORE_ROOM") {
      // Brass Vintage Trunks stacked
      ctx.fillStyle = "#B45309";
      ctx.fillRect(x + 30, y + h - 48, 70, 30);
      ctx.fillStyle = "#D97706";
      ctx.fillRect(x + 40, y + h - 70, 50, 24);

      // Ceramic White & Brown Barni Achar Jars
      ctx.fillStyle = "#FEF3C7";
      ctx.fillRect(x + 130, y + h - 40, 22, 24);
      ctx.fillStyle = "#B45309"; // Top half brown
      ctx.fillRect(x + 130, y + h - 40, 22, 10);
    }

    // 8. Bar / Counter (Chai Glasses & Water Matka)
    else if (this.id === "BAR_COUNTER") {
      ctx.fillStyle = "#78350F";
      ctx.fillRect(x + 20, y + h - 45, w - 40, 30);

      // Clay Water Matka
      ctx.fillStyle = "#C2410C";
      ctx.beginPath();
      ctx.arc(x + 45, y + h - 45, 14, 0, Math.PI * 2);
      ctx.fill();

      // Chai Cutting Glasses in wire stand
      ctx.fillStyle = "#CBD5E1";
      for (let gx = x + 90; gx < x + 160; gx += 16) {
        ctx.fillRect(gx, y + h - 50, 10, 16);
      }
    }

    // 9. Ground Bedroom & Switches
    else if (this.id === "GROUND_BEDROOM") {
      this.drawCeilingFan(ctx, x + w / 2, y + 25);

      // Switchboard on wall
      ctx.fillStyle = "#FFF";
      ctx.fillRect(x + 30, y + 60, 24, 30);
      ctx.fillStyle = "#10B981"; // Switch toggles
      ctx.fillRect(x + 34, y + 66, 6, 6);
      ctx.fillRect(x + 44, y + 66, 6, 6);
      ctx.fillRect(x + 34, y + 78, 6, 6);
    }

    // 10. Stairs Animation / Visual steps
    else if (this.isStairs) {
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

    // 3 Fan Blades
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
