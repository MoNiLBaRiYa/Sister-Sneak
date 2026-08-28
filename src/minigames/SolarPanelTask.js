/**
 * Sister Sneak: Phone Locked - Mini-Game: Wipe Solar Panels (Terrace)
 * Tap/scrub the 3 dusty solar panels until sparkling clean!
 */

import { MiniGameBase } from './MiniGameBase.js';

export class SolarPanelTask extends MiniGameBase {
  constructor() {
    super({
      id: "SOLAR_PANEL",
      title: "Wipe Solar Glass Panels",
      icon: "☀️",
      instructions: "Click each dusty solar panel 3 times to scrub away summer sand!"
    });
    this.panelHealth = [3, 3, 3];
    this.totalClicks = 9;
    this.currentClicks = 0;
  }

  render() {
    this.container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; background:#0F172A; padding:6px; border-radius:10px;">
        <div style="font-size:10.5px; font-weight:700; color:#38BDF8;">⚡ Clean all 3 solar battery panels:</div>
        <div style="display:flex; gap:10px;">
          ${[0, 1, 2].map((i) => `
            <div class="solar-panel" data-idx="${i}" style="width:68px; height:90px; background:repeating-linear-gradient(0deg, #1E293B, #1E293B 8px, #0F172A 8px, #0F172A 16px); border:2.5px solid #64748B; border-radius:6px; cursor:pointer; position:relative; overflow:hidden; display:flex; flex-direction:column; align-items:center; justify-content:center;">
              <div class="dust-layer" style="position:absolute; inset:0; background:rgba(180, 83, 9, 0.7); display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:800; color:#FEF3C7; transition:opacity 0.2s;">
                🏜️
              </div>
              <span style="font-size:8.5px; font-weight:800; color:#38BDF8; z-index:2; margin-top:45px;">Panel #${i+1}</span>
            </div>
          `).join('')}
        </div>
        <div id="solar-status" style="font-size:9.5px; font-weight:700; color:#94A3B8;">Tap a panel to scrub!</div>
      </div>
    `;

    const panels = this.container.querySelectorAll(".solar-panel");
    const status = this.container.querySelector("#solar-status");

    panels.forEach((p) => {
      p.addEventListener("click", () => {
        const idx = parseInt(p.getAttribute("data-idx"), 10);
        if (this.panelHealth[idx] <= 0) return;

        this.panelHealth[idx]--;
        this.currentClicks++;
        const dust = p.querySelector(".dust-layer");
        
        if (dust) {
          dust.style.opacity = (this.panelHealth[idx] / 3).toString();
          if (this.panelHealth[idx] === 0) {
            dust.innerHTML = "✨";
            dust.style.background = "rgba(56, 189, 248, 0.3)";
            dust.style.opacity = "1";
            p.style.borderColor = "#38BDF8";
            p.style.boxShadow = "0 0 10px #38BDF8";
          }
        }

        status.innerText = `Scrubbing... (${this.currentClicks} / 9)`;
        status.style.color = "#38BDF8";
        this.updateProgress(this.currentClicks / this.totalClicks);
      });
    });
  }
}
