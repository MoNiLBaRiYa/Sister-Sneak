/**
 * Sister Sneak: Phone Locked - Mini-Game: Veranda Rangoli Touchup (Veranda)
 * Tap each missing petal to fill vibrant gulal powders into the festive floor rangoli!
 */

import { MiniGameBase } from './MiniGameBase.js';

export class RangoliTask extends MiniGameBase {
  constructor() {
    super({
      id: "RANGOLI_TOUCHUP",
      title: "Fill Festive Floor Rangoli",
      icon: "🌸",
      instructions: "Tap the 5 empty petals to fill in colorful festive rangoli powder!"
    });
    this.filledPetals = 0;
    this.totalPetals = 5;
    this.colors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#EC4899"];
  }

  render() {
    this.container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; background:#FEF3C7;">
        <div style="font-size:12px; font-weight:700; color:#78350F;">🎨 Fill all 5 missing powder petals in the veranda rangoli:</div>
        <div style="width:190px; height:190px; border-radius:50%; background:#FFF; border:4px solid #B45309; position:relative; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 16px rgba(0,0,0,0.15);">
          <div style="width:40px; height:40px; border-radius:50%; background:#FBBF24; display:flex; align-items:center; justify-content:center; font-size:16px;">🪔</div>
          
          ${[0, 1, 2, 3, 4].map((i) => {
            const angle = (i * 72) * (Math.PI / 180);
            const x = Math.cos(angle) * 60;
            const y = Math.sin(angle) * 60;
            return `
              <button class="petal-btn" data-idx="${i}" style="position:absolute; transform:translate(${x}px, ${y}px); width:34px; height:34px; border-radius:50%; background:#E5E7EB; border:2px dashed #9CA3AF; cursor:pointer; font-size:12px; font-weight:800; color:#6B7280; transition:all 0.2s;">
                ?
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;

    const btns = this.container.querySelectorAll(".petal-btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        if (btn.disabled) return;

        btn.disabled = true;
        btn.style.background = this.colors[idx];
        btn.style.borderStyle = "solid";
        btn.style.borderColor = "#FFF";
        btn.innerHTML = "🌸";
        btn.style.transform += " scale(1.15)";

        this.filledPetals++;
        this.updateProgress(this.filledPetals / this.totalPetals);
      });
    });
  }
}
