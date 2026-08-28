/**
 * Sister Sneak: Phone Locked - Mini-Game: Bedsheet Straighten
 * Tap the 4 wrinkled corners of the mattress to tuck and make the bed neat!
 */

import { MiniGameBase } from './MiniGameBase.js';

export class BedsheetTask extends MiniGameBase {
  constructor() {
    super({
      id: "BEDSHEET_TUCK",
      title: "Bedsheet Straighten",
      icon: "🛏️",
      instructions: "Tap all 4 wrinkled corners (⚠️) to tuck them in!"
    });
    this.tuckedCount = 0;
  }

  render() {
    this.container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#FEF3C7; padding:4px; border-radius:10px;">
        <div style="width:210px; height:130px; background:#F472B6; border:3px solid #78350F; border-radius:10px; position:relative; box-shadow:0 6px 12px rgba(0,0,0,0.15);">
          <div style="position:absolute; top:8px; left:50%; transform:translateX(-50%); width:75px; height:18px; background:#FFF; border-radius:4px; border:1.5px solid #E5E7EB; display:flex; align-items:center; justify-content:center; font-size:8.5px; font-weight:700; color:#9CA3AF;">PILLOW</div>
          
          <!-- 4 Wrinkled Corner Buttons -->
          <button class="corner-btn" data-c="1" style="position:absolute; top:4px; left:4px; font-size:14px; cursor:pointer; background:#FFF; border:2px solid #DC2626; border-radius:50%; width:28px; height:28px;">⚠️</button>
          <button class="corner-btn" data-c="2" style="position:absolute; top:4px; right:4px; font-size:14px; cursor:pointer; background:#FFF; border:2px solid #DC2626; border-radius:50%; width:28px; height:28px;">⚠️</button>
          <button class="corner-btn" data-c="3" style="position:absolute; bottom:4px; left:4px; font-size:14px; cursor:pointer; background:#FFF; border:2px solid #DC2626; border-radius:50%; width:28px; height:28px;">⚠️</button>
          <button class="corner-btn" data-c="4" style="position:absolute; bottom:4px; right:4px; font-size:14px; cursor:pointer; background:#FFF; border:2px solid #DC2626; border-radius:50%; width:28px; height:28px;">⚠️</button>
        </div>
      </div>
    `;

    const btns = this.container.querySelectorAll(".corner-btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.innerText === "✨") return;
        btn.innerText = "✨";
        btn.style.borderColor = "#16A34A";
        btn.style.background = "#DCFCE7";
        this.tuckedCount++;
        this.updateProgress(this.tuckedCount / 4);
      });
    });
  }
}
