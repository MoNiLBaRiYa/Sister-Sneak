/**
 * Sister Sneak: Phone Locked - Mini-Game: Switch Off Lights & Fan
 * Flip all the running power switches to OFF to save electricity!
 */

import { MiniGameBase } from './MiniGameBase.js';

export class SwitchesTask extends MiniGameBase {
  constructor() {
    super({
      id: "SWITCHES_OFF",
      title: "Switch Off Lights & Fan",
      icon: "💡",
      instructions: "Flip all running red switches (ON) down to green (OFF)!"
    });
    this.switches = [true, true, true, true]; // all on
  }

  render() {
    this.container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; background:#E2E8F0; padding:6px; border-radius:10px;">
        <div style="background:#FFF; border:3px solid #475569; border-radius:10px; padding:10px 16px; box-shadow:0 4px 10px rgba(0,0,0,0.15); display:grid; grid-template-columns:repeat(4, 1fr); gap:10px;">
          ${[0, 1, 2, 3].map((i) => `
            <div style="display:flex; flex-direction:column; align-items:center; gap:3px;">
              <button class="switch-toggle" data-idx="${i}" style="width:32px; height:50px; background:#EF4444; border:2px solid #7F1D1D; border-radius:6px; cursor:pointer; color:#FFF; font-weight:800; font-size:10px; transition:all 0.15s;">
                ON
              </button>
              <span style="font-size:8px; font-weight:700; color:#64748B;">${i === 0 ? "💡 L1" : i === 1 ? "💡 L2" : i === 2 ? "🌀 FAN" : "🔌 AC"}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const btns = this.container.querySelectorAll(".switch-toggle");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        if (this.switches[idx]) {
          this.switches[idx] = false;
          btn.style.background = "#10B981";
          btn.style.borderColor = "#065F46";
          btn.innerText = "OFF";
          btn.style.transform = "translateY(4px)";

          const offCount = this.switches.filter((s) => !s).length;
          this.updateProgress(offCount / 4);
        }
      });
    });
  }
}
