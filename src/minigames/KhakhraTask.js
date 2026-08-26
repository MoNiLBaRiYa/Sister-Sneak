/**
 * Sister Sneak: Phone Locked - Mini-Game: Seal Khakhra Container (Kitchen)
 * Rotate/tap the airtight steel container lid until tightly sealed!
 */

import { MiniGameBase } from './MiniGameBase.js';

export class KhakhraTask extends MiniGameBase {
  constructor() {
    super({
      id: "SNACK_CONTAINER",
      title: "Seal Crispy Khakhra Dabba",
      icon: "📦",
      instructions: "Rotate and screw tight the 4 clips on the steel container so snacks stay fresh!"
    });
    this.latched = 0;
    this.totalLatches = 4;
  }

  render() {
    this.container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; background:#FFFBEB;">
        <div style="font-size:12px; font-weight:700; color:#78350F;">🫓 Lock all 4 airtight clips on the Methi Khakhra steel box:</div>
        <div style="width:180px; height:180px; background:#94A3B8; border:4px solid #475569; border-radius:50%; position:relative; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 20px rgba(0,0,0,0.2);">
          <span style="font-size:28px;">🫓</span>
          
          <button class="clip-btn" data-c="top" style="position:absolute; top:-12px; left:50%; transform:translateX(-50%); background:#EF4444; color:#FFF; border:2px solid #7F1D1D; border-radius:6px; padding:4px 10px; font-weight:800; font-size:10px; cursor:pointer;">UNLOCKED</button>
          <button class="clip-btn" data-c="bottom" style="position:absolute; bottom:-12px; left:50%; transform:translateX(-50%); background:#EF4444; color:#FFF; border:2px solid #7F1D1D; border-radius:6px; padding:4px 10px; font-weight:800; font-size:10px; cursor:pointer;">UNLOCKED</button>
          <button class="clip-btn" data-c="left" style="position:absolute; left:-12px; top:50%; transform:translateY(-50%) rotate(-90deg); background:#EF4444; color:#FFF; border:2px solid #7F1D1D; border-radius:6px; padding:4px 10px; font-weight:800; font-size:10px; cursor:pointer;">UNLOCKED</button>
          <button class="clip-btn" data-c="right" style="position:absolute; right:-12px; top:50%; transform:translateY(-50%) rotate(90deg); background:#EF4444; color:#FFF; border:2px solid #7F1D1D; border-radius:6px; padding:4px 10px; font-weight:800; font-size:10px; cursor:pointer;">UNLOCKED</button>
        </div>
      </div>
    `;

    const btns = this.container.querySelectorAll(".clip-btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.innerText === "LOCKED ✓") return;
        btn.innerText = "LOCKED ✓";
        btn.style.background = "#10B981";
        btn.style.borderColor = "#065F46";
        this.latched++;
        this.updateProgress(this.latched / this.totalLatches);
      });
    });
  }
}
