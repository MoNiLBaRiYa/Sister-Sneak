/**
 * Sister Sneak: Phone Locked - Mini-Game: Dry Clothes Collection
 * Tap or click the hanging clothes to clip pegs and collect them.
 */

import { MiniGameBase } from './MiniGameBase.js';

export class ClothesTask extends MiniGameBase {
  constructor() {
    super({
      id: "CLOTHES_COLLECT",
      title: "Dry Clothes Collection",
      icon: "🧺",
      instructions: "Click/tap each fluttering cloth to fold and put in basket!"
    });
    this.collected = 0;
    this.totalClothes = 4;
  }

  render() {
    this.container.innerHTML = `
      <div style="width:100%; height:100%; position:relative; background:linear-gradient(to bottom, #BAE6FD, #E0F2FE); display:flex; flex-direction:column; align-items:center; justify-content:space-around; padding:15px;">
        <div style="position:absolute; top:35px; width:90%; height:4px; background:#475569; border-radius:2px;"></div>
        <div id="clothes-line" style="display:flex; justify-content:space-around; width:85%; z-index:2; margin-top:20px;">
          <div class="cloth-item" data-id="1" style="cursor:pointer; font-size:48px; transition:transform 0.2s;">👗</div>
          <div class="cloth-item" data-id="2" style="cursor:pointer; font-size:48px; transition:transform 0.2s;">🥻</div>
          <div class="cloth-item" data-id="3" style="cursor:pointer; font-size:48px; transition:transform 0.2s;">👕</div>
          <div class="cloth-item" data-id="4" style="cursor:pointer; font-size:48px; transition:transform 0.2s;">👖</div>
        </div>
        <div style="font-size:42px; margin-top:20px;">🧺</div>
        <div style="font-size:12px; color:#0369A1; font-weight:700;">Tap all 4 clothes to finish!</div>
      </div>
    `;

    const items = this.container.querySelectorAll(".cloth-item");
    items.forEach((item) => {
      item.addEventListener("click", () => {
        if (item.style.opacity === "0.2") return;
        item.style.opacity = "0.2";
        item.style.transform = "translateY(50px) scale(0.6)";
        this.collected++;
        this.updateProgress(this.collected / this.totalClothes);
      });
    });
  }
}
