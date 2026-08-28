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
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; background:#FEF3C7; padding:4px; border-radius:10px;">
        <div style="font-size:10.5px; font-weight:700; color:#78350F; text-align:center;">🎨 Fill all 5 missing powder petals in the rangoli:</div>
        <div style="width:130px; height:130px; border-radius:50%; background:#FFF; border:3px solid #B45309; position:relative; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.15);">
          <div style="width:30px; height:30px; border-radius:50%; background:#FBBF24; display:flex; align-items:center; justify-content:center; font-size:13px;">🪔</div>
          
          ${[0, 1, 2, 3, 4].map((i) => {
            const angle = (i * 72) * (Math.PI / 180);
            const x = Math.cos(angle) * 42;
            const y = Math.sin(angle) * 42;
            return `
              <button class="petal-btn" data-idx="${i}" style="position:absolute; transform:translate(${x}px, ${y}px); width:26px; height:26px; border-radius:50%; background:#E5E7EB; border:1.5px dashed #9CA3AF; cursor:pointer; font-size:10px; font-weight:800; color:#6B7280; transition:all 0.15s;">
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
        btn.style.transform += " scale(1.1)";

        this.filledPetals++;
        this.updateProgress(this.filledPetals / this.totalPetals);
      });
    });
  }
}
