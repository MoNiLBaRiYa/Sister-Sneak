/**
 * Sister Sneak: Phone Locked - Mini-Game: Glassware Alignment
 * Straighten and order the cutting chai glasses neatly in the wire stand!
 */

import { MiniGameBase } from './MiniGameBase.js';

export class GlasswareTask extends MiniGameBase {
  constructor() {
    super({
      id: "GLASSWARE_ALIGN",
      title: "Chai Glassware Alignment",
      icon: "🥛",
      instructions: "Tap the tilted chai glasses (🔄) to align them straight!"
    });
    this.straightened = 0;
  }

  render() {
    this.container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; background:#FAE8FF;">
        <div style="background:#451A03; border:4px solid #78350F; border-radius:12px; padding:16px 24px; display:flex; gap:16px; align-items:center;">
          ${[0, 1, 2, 3].map((i) => `
            <button class="glass-btn" data-idx="${i}" style="width:45px; height:65px; background:linear-gradient(to top, rgba(255,255,255,0.8), rgba(200,230,255,0.6)); border:2px solid #94A3B8; border-radius:4px; font-size:18px; cursor:pointer; transform:rotate(${i % 2 === 0 ? -18 : 22}deg); transition:transform 0.2s;">
              🥛
            </button>
          `).join('')}
        </div>
        <div style="font-size:12px; font-weight:700; color:#701A75;">Straighten all 4 tilted glasses!</div>
      </div>
    `;

    const btns = this.container.querySelectorAll(".glass-btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.style.transform === "rotate(0deg)") return;
        btn.style.transform = "rotate(0deg)";
        btn.style.borderColor = "#10B981";
        btn.style.background = "#DCFCE7";
        this.straightened++;
        this.updateProgress(this.straightened / 4);
      });
    });
  }
}
