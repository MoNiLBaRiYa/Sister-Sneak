/**
 * Sister Sneak: Phone Locked - Mini-Game: Arrange Masala Dabba (Kitchen)
 * Tap each spice bowl to place it neatly into the round brass masala box!
 */

import { MiniGameBase } from './MiniGameBase.js';

export class SpiceRackTask extends MiniGameBase {
  constructor() {
    super({
      id: "SPICE_RACK",
      title: "Organize Masala Dabba",
      icon: "🧂",
      instructions: "Click all 6 aromatic spices to arrange neatly in the brass spice dabba!"
    });
    this.spices = [
      { name: "Haldi (Turmeric)", color: "#FACC15", emoji: "🟡" },
      { name: "Lal Mirchi (Chili)", color: "#EF4444", emoji: "🔴" },
      { name: "Dhaniya Powder", color: "#A3E635", emoji: "🟢" },
      { name: "Rai (Mustard)", color: "#1E293B", emoji: "⚫" },
      { name: "Jeera (Cumin)", color: "#B45309", emoji: "🟤" },
      { name: "Hing (Asafoetida)", color: "#FEF08A", emoji: "⚪" }
    ];
    this.filledCount = 0;
  }

  render() {
    this.container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; background:#FFFBEB;">
        <div style="font-size:12px; font-weight:700; color:#78350F;">🥘 Place all 6 spices in the heirloom brass container:</div>
        <div style="background:#78350F; border:4px solid #451A03; border-radius:50%; width:210px; height:210px; display:grid; grid-template-columns:repeat(3, 1fr); padding:16px; gap:8px; align-items:center; justify-items:center; box-shadow:0 8px 20px rgba(0,0,0,0.25);">
          ${this.spices.map((s, idx) => `
            <button class="spice-btn" data-idx="${idx}" style="width:48px; height:48px; border-radius:50%; background:#FFF; border:2px solid #D97706; cursor:pointer; font-size:14px; display:flex; flex-direction:column; align-items:center; justify-content:center; transition:all 0.2s;">
              ${s.emoji}
            </button>
          `).join('')}
        </div>
        <div id="spice-status" style="font-size:11px; font-weight:700; color:#B45309;">Tap an empty spice cup!</div>
      </div>
    `;

    const btns = this.container.querySelectorAll(".spice-btn");
    const status = this.container.querySelector("#spice-status");

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        if (btn.disabled) return;

        btn.disabled = true;
        const spice = this.spices[idx];
        btn.style.background = spice.color;
        btn.style.borderColor = "#FFF";
        btn.style.transform = "scale(1.1)";

        this.filledCount++;
        status.innerText = `Added ${spice.name}! (${this.filledCount} / 6)`;
        this.updateProgress(this.filledCount / this.spices.length);
      });
    });
  }
}
