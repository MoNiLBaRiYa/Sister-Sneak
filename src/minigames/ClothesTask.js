/**
 * Sister Sneak: Phone Locked - Mini-Game: Fold Dry Sarees & Kurtas (Terrace)
 * Match 6 fluttering traditional clothes to their colored baskets!
 */

import { MiniGameBase } from './MiniGameBase.js';

export class ClothesTask extends MiniGameBase {
  constructor() {
    super({
      id: "CLOTHES_COLLECT",
      title: "Sort & Fold Dry Clothes",
      icon: "🧺",
      instructions: "Match and fold all 6 fluttering clothes into the laundry baskets!"
    });
    this.clothes = [
      { id: 1, name: "Pink Saree", emoji: "🥻", color: "#F472B6" },
      { id: 2, name: "Blue Kurta", emoji: "👕", color: "#38BDF8" },
      { id: 3, name: "Green Dupatta", emoji: "🧣", color: "#4ADE80" },
      { id: 4, name: "Yellow Ghagra", emoji: "👗", color: "#FBBF24" },
      { id: 5, name: "Red Bandhani", emoji: "🥻", color: "#EF4444" },
      { id: 6, name: "White Pajama", emoji: "👖", color: "#E2E8F0" }
    ];
    this.folded = 0;
  }

  render() {
    this.container.innerHTML = `
      <div style="width:100%; height:100%; position:relative; background:linear-gradient(to bottom, #BAE6FD, #E0F2FE); display:flex; flex-direction:column; align-items:center; justify-content:space-around; padding:12px;">
        <div style="position:absolute; top:35px; width:92%; height:4px; background:#475569; border-radius:2px;"></div>
        <div style="font-size:11px; font-weight:800; color:#0369A1;">☀️ Tap each fluttering cloth to fold into basket (0 / 6)</div>
        <div id="clothes-grid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; z-index:2; margin-top:10px;">
          ${this.clothes.map(c => `
            <button class="cloth-item-btn" data-id="${c.id}" style="background:#FFF; border:2px solid ${c.color}; border-radius:12px; padding:8px 12px; cursor:pointer; font-size:24px; display:flex; flex-direction:column; align-items:center; gap:2px; box-shadow:0 4px 10px rgba(0,0,0,0.1); transition:transform 0.15s;">
              ${c.emoji}
              <span style="font-size:8px; font-weight:800; color:#334155;">${c.name}</span>
            </button>
          `).join('')}
        </div>
        <div style="font-size:32px; margin-top:6px;">🧺</div>
      </div>
    `;

    const btns = this.container.querySelectorAll(".cloth-item-btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        btn.disabled = true;
        btn.style.transform = "scale(0.85)";
        btn.style.opacity = "0.3";
        btn.style.background = "#DCFCE7";
        btn.style.borderColor = "#16A34A";

        this.folded++;
        this.updateProgress(this.folded / this.clothes.length);
      });
    });
  }
}
