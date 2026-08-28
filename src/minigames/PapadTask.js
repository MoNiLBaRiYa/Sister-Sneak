/**
 * Sister Sneak: Phone Locked - Mini-Game: Sun-Dry Papad Grid (Terrace)
 * Flip and lay out raw spiced papads evenly across the cotton cloth in the sun.
 */

import { MiniGameBase } from './MiniGameBase.js';

export class PapadTask extends MiniGameBase {
  constructor() {
    super({
      id: "PAPAD_DRY",
      title: "Sun-Dry Papad Spread",
      icon: "🫓",
      instructions: "Tap each raw papad to lay flat and flip in the hot summer sun!"
    });
    this.flippedCount = 0;
    this.totalPapads = 6;
  }

  render() {
    this.container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; background:linear-gradient(to bottom, #FEF3C7, #FDE68A); padding:6px; border-radius:10px;">
        <div style="font-size:11px; font-weight:700; color:#78350F; text-align:center;">☀️ Spread all 6 spicy black-pepper papads on the cloth:</div>
        <div style="background:#FFF; border:2.5px solid #B45309; border-radius:10px; padding:6px 10px; display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; max-width:270px; width:90%; justify-items:center;">
          ${[0, 1, 2, 3, 4, 5].map((i) => `
            <button class="papad-btn" data-idx="${i}" style="width:54px; height:54px; border-radius:50%; background:#FBBF24; border:2.5px dashed #D97706; cursor:pointer; font-size:20px; display:flex; flex-direction:column; align-items:center; justify-content:center; transition:all 0.15s;">
              🫓
              <span style="font-size:7px; font-weight:800; color:#78350F;">Raw #${i+1}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    const btns = this.container.querySelectorAll(".papad-btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        btn.disabled = true;
        btn.style.background = "#FEF3C7";
        btn.style.borderStyle = "solid";
        btn.style.borderColor = "#16A34A";
        btn.innerHTML = "✨<span style='font-size:7px; font-weight:800; color:#16A34A;'>Dried!</span>";
        btn.style.transform = "scale(1.05)";
        
        this.flippedCount++;
        this.updateProgress(this.flippedCount / this.totalPapads);
      });
    });
  }
}
