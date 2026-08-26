/**
 * Sister Sneak: Phone Locked - Mini-Game: Plant Watering
 * Tap the watering can to water the potted money plants and holy Tulsi!
 */

import { MiniGameBase } from './MiniGameBase.js';

export class WateringTask extends MiniGameBase {
  constructor() {
    super({
      id: "PLANT_WATER",
      title: "Balcony Plant Watering",
      icon: "🌿",
      instructions: "Click 'POUR WATER' 5 times to thoroughly water all balcony pots!"
    });
    this.dropsPoured = 0;
  }

  render() {
    this.container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; background:#DCFCE7;">
        <div style="display:flex; gap:20px; align-items:flex-end;">
          <div style="text-align:center;"><div style="font-size:38px;">🪴</div><span style="font-size:10px; font-weight:700; color:#166534;">Money Plant</span></div>
          <div style="text-align:center;"><div style="font-size:46px;">🌿</div><span style="font-size:10px; font-weight:700; color:#166534;">Tulsi Kyara</span></div>
          <div style="text-align:center;"><div style="font-size:38px;">🌸</div><span style="font-size:10px; font-weight:700; color:#166534;">Mogra Pot</span></div>
        </div>
        <button id="btn-pour" style="background:#0D9488; color:#FFF; border:none; padding:10px 24px; border-radius:12px; font-size:14px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:8px;">
          🚿 POUR WATER (<span id="pour-count">0</span> / 5)
        </button>
      </div>
    `;

    const btn = this.container.querySelector("#btn-pour");
    const countSpan = this.container.querySelector("#pour-count");

    btn.addEventListener("click", () => {
      this.dropsPoured++;
      countSpan.innerText = this.dropsPoured;
      btn.style.transform = "scale(0.95)";
      setTimeout(() => { btn.style.transform = "scale(1)"; }, 100);

      this.updateProgress(this.dropsPoured / 5);
    });
  }
}
