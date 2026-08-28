/**
 * Sister Sneak: Phone Locked - Mini-Game: Dadi's Footwear Match
 * Match the scattered pairs of traditional chappals and put them in the rack!
 */

import { MiniGameBase } from './MiniGameBase.js';

export class FootwearTask extends MiniGameBase {
  constructor() {
    super({
      id: "FOOTWEAR_MATCH",
      title: "Match Dadi's Footwear",
      icon: "👡",
      instructions: "Click matching pairs of chappals to arrange in the shoe rack!"
    });
    this.selected = null;
    this.matchedPairs = 0;
    this.totalPairs = 3;
  }

  render() {
    const items = [
      { id: "red_L", pair: "red", emoji: "👡 Red L" },
      { id: "blue_R", pair: "blue", emoji: "🩴 Blue R" },
      { id: "gold_L", pair: "gold", emoji: "👡 Gold L" },
      { id: "red_R", pair: "red", emoji: "👡 Red R" },
      { id: "blue_L", pair: "blue", emoji: "🩴 Blue L" },
      { id: "gold_R", pair: "gold", emoji: "👡 Gold R" }
    ];

    this.container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; background:#FEF3C7; padding:6px; border-radius:10px;">
        <div style="font-size:10.5px; font-weight:700; color:#78350F;">Select 2 of the same colored chappal to pair:</div>
        <div id="chappal-grid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; max-width:320px; width:95%;">
          ${items.map((it) => `
            <button class="chappal-btn" data-pair="${it.pair}" style="background:#FFF; border:2px solid #B45309; border-radius:8px; padding:6px 4px; font-size:9.5px; font-weight:700; cursor:pointer; transition:all 0.15s; text-align:center;">
              ${it.emoji}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    const btns = this.container.querySelectorAll(".chappal-btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;

        if (!this.selected) {
          this.selected = btn;
          btn.style.background = "#FDE68A";
          btn.style.borderColor = "#EA580C";
        } else if (this.selected === btn) {
          this.selected.style.background = "#FFF";
          this.selected.style.borderColor = "#B45309";
          this.selected = null;
        } else {
          if (this.selected.getAttribute("data-pair") === btn.getAttribute("data-pair")) {
            // Match found!
            this.selected.style.background = "#DCFCE7";
            this.selected.style.borderColor = "#16A34A";
            this.selected.disabled = true;
            btn.style.background = "#DCFCE7";
            btn.style.borderColor = "#16A34A";
            btn.disabled = true;
            this.selected = null;

            this.matchedPairs++;
            this.updateProgress(this.matchedPairs / this.totalPairs);
          } else {
            // No match
            const prev = this.selected;
            this.selected = null;
            prev.style.background = "#FEE2E2";
            btn.style.background = "#FEE2E2";
            setTimeout(() => {
              prev.style.background = "#FFF";
              prev.style.borderColor = "#B45309";
              btn.style.background = "#FFF";
              btn.style.borderColor = "#B45309";
            }, 300);
          }
        }
      });
    });
  }
}
