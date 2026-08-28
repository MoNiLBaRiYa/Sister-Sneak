/**
 * Sister Sneak: Phone Locked - Mini-Game: Trunk Achar Hunt
 * Tap the store room trunks & ceramic barni jars to uncover Dadi's Special Mango Achar!
 */

import { MiniGameBase } from './MiniGameBase.js';

export class AcharTask extends MiniGameBase {
  constructor() {
    super({
      id: "ACHAR_HUNT",
      title: "Trunk Achar Hunt",
      icon: "🧳",
      instructions: "Find Dadi's Famous Keri Achar Jar hidden inside the trunks!"
    });
    this.targetJarIndex = Math.floor(Math.random() * 4);
  }

  render() {
    this.container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; background:#E2E8F0; padding:6px; border-radius:10px;">
        <div style="font-size:10.5px; font-weight:700; color:#334155;">Search the trunks & ceramic jars:</div>
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;">
          ${[0, 1, 2, 3].map((i) => `
            <button class="trunk-btn" data-idx="${i}" style="background:#B45309; border:2.5px solid #78350F; border-radius:8px; width:52px; height:58px; font-size:20px; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#FFF; transition:all 0.15s;">
              🧳
              <span style="font-size:7px; font-weight:800; margin-top:2px;">Trunk #${i+1}</span>
            </button>
          `).join('')}
        </div>
        <div id="achar-feedback" style="font-size:9.5px; font-weight:700; color:#475569;">Tap a trunk to open!</div>
      </div>
    `;

    const btns = this.container.querySelectorAll(".trunk-btn");
    const feedback = this.container.querySelector("#achar-feedback");

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        if (idx === this.targetJarIndex) {
          btn.innerHTML = "🥭<span style='font-size:7px; font-weight:800; color:#FEF3C7;'>ACHAR!</span>";
          btn.style.background = "#10B981";
          btn.style.borderColor = "#065F46";
          feedback.innerText = "🎉 Found Dadi's Special Mango Achar!";
          feedback.style.color = "#16A34A";
          this.updateProgress(1.0);
        } else {
          btn.innerHTML = "🕸️<span style='font-size:7px; font-weight:800; color:#FEF3C7;'>Old Quilt</span>";
          btn.style.background = "#64748B";
          btn.disabled = true;
          feedback.innerText = "Just old quilts! Try another trunk.";
        }
      });
    });
  }
}
