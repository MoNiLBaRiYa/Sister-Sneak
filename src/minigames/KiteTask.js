/**
 * Sister Sneak: Phone Locked - Mini-Game: Untangle Manja Kite Thread (Terrace)
 * Tap and slide the tangled kite thread knots to free them!
 */

import { MiniGameBase } from './MiniGameBase.js';

export class KiteTask extends MiniGameBase {
  constructor() {
    super({
      id: "KITE_UNTANGLE",
      title: "Untangle Kite Strings",
      icon: "🪁",
      instructions: "Tap the 4 tangled thread knots to free the rooftop kites!"
    });
    this.untangled = 0;
    this.totalKnots = 4;
  }

  render() {
    this.container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; background:linear-gradient(to bottom, #E0F2FE, #BAE6FD);">
        <div style="display:flex; justify-content:space-around; width:80%;">
          <div style="font-size:36px; transform:rotate(-15deg);">🪁</div>
          <div style="font-size:42px; transform:rotate(20deg);">🪁</div>
          <div style="font-size:36px; transform:rotate(-10deg);">🪁</div>
        </div>
        <div style="background:#FFF; border:3px solid #0284C7; border-radius:12px; padding:12px 16px; display:grid; grid-template-columns:repeat(4, 1fr); gap:12px;">
          ${[0, 1, 2, 3].map((i) => `
            <button class="knot-btn" data-idx="${i}" style="width:60px; height:60px; border-radius:10px; background:#FEE2E2; border:2px solid #EF4444; font-size:22px; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; transition:all 0.2s;">
              🪢
              <span style="font-size:8px; font-weight:800; color:#B91C1C; margin-top:2px;">Knot #${i+1}</span>
            </button>
          `).join('')}
        </div>
        <div style="font-size:11px; font-weight:700; color:#0369A1;">Tap all 4 tangled knots to free the thread!</div>
      </div>
    `;

    const btns = this.container.querySelectorAll(".knot-btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        btn.disabled = true;
        btn.style.background = "#DCFCE7";
        btn.style.borderColor = "#16A34A";
        btn.innerHTML = "✨<span style='font-size:8px; font-weight:800; color:#16A34A; margin-top:2px;'>Freed!</span>";
        this.untangled++;
        this.updateProgress(this.untangled / this.totalKnots);
      });
    });
  }
}
