/**
 * Sister Sneak: Phone Locked - Mini-Game: Fix Fuse Box & Reset Circuit Breakers
 * Flip all tripped circuit breakers down to RESET (Green) to restore electricity!
 */

import { MiniGameBase } from './MiniGameBase.js';

export class SwitchesTask extends MiniGameBase {
  constructor() {
    super({
      id: "SWITCHES_OFF",
      title: "⚡ Fix Blown Fuse & Circuit Breakers",
      icon: "⚡",
      instructions: "Flip all 4 TRIPPED (Red) switches down to RESET (Green) to restore power!"
    });
    this.switches = [true, true, true, true]; // all tripped
  }

  render() {
    this.container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; background:linear-gradient(135deg, #1e293b, #0f172a); padding:16px; border-radius:14px; box-shadow:inset 0 0 20px rgba(0,0,0,0.8);">
        <div style="font-size:13px; font-weight:800; color:#F59E0B; text-align:center; letter-spacing:0.5px;">
          ⚡ HAVELI MAIN POWER DISTRIBUTION BOX ⚡
        </div>
        <div style="background:#334155; border:3px solid #64748B; border-radius:12px; padding:14px 20px; box-shadow:0 8px 24px rgba(0,0,0,0.5); display:grid; grid-template-columns:repeat(4, 1fr); gap:16px;">
          ${[0, 1, 2, 3].map((i) => `
            <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
              <div class="led-light" id="led-${i}" style="width:10px; height:10px; border-radius:50%; background:#EF4444; box-shadow:0 0 8px #EF4444;"></div>
              <button class="switch-toggle" data-idx="${i}" style="width:44px; height:68px; background:linear-gradient(180deg, #EF4444, #B91C1C); border:2px solid #7F1D1D; border-radius:8px; cursor:pointer; color:#FFF; font-weight:800; font-size:11px; transition:all 0.18s cubic-bezier(0.4, 0, 0.2, 1); box-shadow:0 4px 6px rgba(0,0,0,0.4); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px;">
                <span>⚡</span>
                <span>TRIP</span>
              </button>
              <span style="font-size:10px; font-weight:700; color:#CBD5E1;">${i === 0 ? "1F LIGHTS" : i === 1 ? "2F HALL" : i === 2 ? "3F SOLAR" : "MAIN FUSE"}</span>
            </div>
          `).join('')}
        </div>
        <div style="font-size:11px; color:#94A3B8; font-weight:600;">
          Click/Tap each red breaker to reset circuit
        </div>
      </div>
    `;

    const btns = this.container.querySelectorAll(".switch-toggle");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        if (this.switches[idx]) {
          this.switches[idx] = false;
          btn.style.background = "linear-gradient(180deg, #10B981, #047857)";
          btn.style.borderColor = "#064E3B";
          btn.innerHTML = "<span>✓</span><span>OK</span>";
          btn.style.transform = "translateY(6px)";
          btn.style.boxShadow = "inset 0 3px 6px rgba(0,0,0,0.4)";

          const led = this.container.querySelector(`#led-${idx}`);
          if (led) {
            led.style.background = "#10B981";
            led.style.boxShadow = "0 0 10px #10B981";
          }

          const offCount = this.switches.filter((s) => !s).length;
          this.updateProgress(offCount / 4);
        }
      });
    });
  }
}
