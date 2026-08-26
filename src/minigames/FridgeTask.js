/**
 * Sister Sneak: Phone Locked - Mini-Game: Fridge Water Refill
 * Hold the tap button to fill the chilled water bottle to the green line!
 */

import { MiniGameBase } from './MiniGameBase.js';

export class FridgeTask extends MiniGameBase {
  constructor() {
    super({
      id: "FRIDGE_REFILL",
      title: "Fridge Water Refill",
      icon: "🍾",
      instructions: "Hold 'FILL WATER' button to fill bottle up to the green target zone!"
    });
    this.fillLevel = 0;
    this.isFilling = false;
    this.interval = null;
  }

  render() {
    this.container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; background:#F8FAFC;">
        <div style="width:70px; height:160px; border:4px solid #475569; border-radius:12px; position:relative; background:#E2E8F0; overflow:hidden;">
          <!-- Target Zone (75% to 95%) -->
          <div style="position:absolute; bottom:75%; width:100%; height:20%; background:rgba(34, 197, 94, 0.4); border-top:2px dashed #16A34A; border-bottom:2px dashed #16A34A;"></div>
          <!-- Water Fill -->
          <div id="bottle-water" style="position:absolute; bottom:0; width:100%; height:0%; background:linear-gradient(to top, #0284C7, #38BDF8); transition:height 0.05s;"></div>
        </div>
        <button id="btn-fill-water" style="background:#0284C7; color:#FFF; border:none; padding:10px 24px; border-radius:10px; font-weight:700; font-size:14px; cursor:pointer;">
          💧 HOLD TO FILL
        </button>
        <div id="water-status" style="font-size:12px; color:#475569; font-weight:600;">Fill between the green dashed lines</div>
      </div>
    `;

    const btn = this.container.querySelector("#btn-fill-water");
    const water = this.container.querySelector("#bottle-water");
    const status = this.container.querySelector("#water-status");

    const startFill = () => {
      if (this.isFinished) return;
      this.isFilling = true;
      if (this.interval) clearInterval(this.interval);
      this.interval = setInterval(() => {
        if (!this.isFilling) return;
        this.fillLevel = Math.min(100, this.fillLevel + 2);
        water.style.height = `${this.fillLevel}%`;
        if (this.fillLevel >= 100) {
          status.innerText = "❌ Spilled! Emptying bottle...";
          status.style.color = "#DC2626";
          setTimeout(() => {
            this.fillLevel = 0;
            water.style.height = "0%";
            status.innerText = "Try again! Stop in the green zone.";
            status.style.color = "#475569";
          }, 800);
          this.isFilling = false;
        }
      }, 50);
    };

    const stopFill = () => {
      this.isFilling = false;
      if (this.interval) clearInterval(this.interval);

      if (this.fillLevel >= 75 && this.fillLevel <= 95) {
        status.innerText = "✅ Perfect fill! Bottle cold & ready!";
        status.style.color = "#16A34A";
        this.updateProgress(1.0);
      } else if (this.fillLevel < 75 && this.fillLevel > 0) {
        status.innerText = "Need more water! Hold longer.";
      }
    };

    btn.addEventListener("mousedown", startFill);
    btn.addEventListener("mouseup", stopFill);
    btn.addEventListener("mouseleave", stopFill);
    btn.addEventListener("touchstart", (e) => { e.preventDefault(); startFill(); });
    btn.addEventListener("touchend", stopFill);
  }

  destroy() {
    if (this.interval) clearInterval(this.interval);
    super.destroy();
  }
}
