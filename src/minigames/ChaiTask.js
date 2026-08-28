/**
 * Sister Sneak: Phone Locked - Mini-Game: Strain Masala Chai (Kitchen)
 * Tap the steel strainer repeatedly to filter fresh ginger-cardamom cutting chai!
 */

import { MiniGameBase } from './MiniGameBase.js';

export class ChaiTask extends MiniGameBase {
  constructor() {
    super({
      id: "CHAI_FILTER",
      title: "Strain Ginger Chai",
      icon: "☕",
      instructions: "Tap the strainer handle 5 times to filter the hot kadak masala chai!"
    });
    this.strainedClicks = 0;
    this.totalClicks = 5;
  }

  render() {
    this.container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; background:#FFEDD5; padding:6px; border-radius:10px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="font-size:30px;">🫖</div>
          <button id="btn-strain" style="background:#78350F; color:#FEF3C7; border:2.5px solid #451A03; border-radius:10px; padding:8px 14px; font-weight:800; font-size:11px; cursor:pointer; display:flex; align-items:center; gap:4px; box-shadow:0 4px 10px rgba(0,0,0,0.15); transition:transform 0.1s;">
            ☕ TAP TO STRAIN
          </button>
          <div style="font-size:26px;">🥛</div>
        </div>
        <div style="width:140px; height:12px; background:#FED7AA; border-radius:6px; border:1.5px solid #C2410C; overflow:hidden;">
          <div id="chai-fill" style="width:0%; height:100%; background:linear-gradient(90deg, #EA580C, #9A3412); transition:width 0.15s;"></div>
        </div>
        <div id="chai-status" style="font-size:9.5px; font-weight:700; color:#7C2D12;">Straining ginger & cardamom (${this.strainedClicks} / 5)</div>
      </div>
    `;

    const btn = this.container.querySelector("#btn-strain");
    const fill = this.container.querySelector("#chai-fill");
    const status = this.container.querySelector("#chai-status");

    btn.addEventListener("click", () => {
      if (this.isFinished) return;
      this.strainedClicks++;
      btn.style.transform = "scale(0.93)";
      setTimeout(() => { btn.style.transform = "scale(1)"; }, 100);

      const pct = (this.strainedClicks / this.totalClicks);
      fill.style.width = `${Math.round(pct * 100)}%`;
      status.innerText = `Filtered hot chai (${this.strainedClicks} / ${this.totalClicks})`;

      this.updateProgress(pct);
    });
  }
}
