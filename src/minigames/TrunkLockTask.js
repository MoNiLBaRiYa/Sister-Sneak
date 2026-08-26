/**
 * Sister Sneak: Phone Locked - Mini-Game: Oil Antique Trunk Lock (Store Room)
 * Rotate/turn the vintage brass key 4 times to securely lock the trunk!
 */

import { MiniGameBase } from './MiniGameBase.js';

export class TrunkLockTask extends MiniGameBase {
  constructor() {
    super({
      id: "TRUNK_LOCK",
      title: "Oil & Lock Antique Trunk",
      icon: "🗝️",
      instructions: "Tap the brass key to turn it 4 full rotations into the keyhole!"
    });
    this.rotations = 0;
    this.totalRotations = 4;
  }

  render() {
    this.container.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; background:#E2E8F0;">
        <div style="font-size:12px; font-weight:700; color:#334155;">🗝️ Turn the vintage heirloom brass key:</div>
        <div style="width:170px; height:150px; background:#78350F; border:4px solid #451A03; border-radius:16px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 8px 18px rgba(0,0,0,0.25);">
          <div style="width:16px; height:32px; background:#1C1917; border-radius:8px 8px 4px 4px; margin-bottom:10px;"></div>
          <button id="btn-turn-key" style="background:#FBBF24; border:3px solid #D97706; border-radius:50%; width:64px; height:64px; font-size:28px; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.3); transition:transform 0.25s ease-out;">
            🗝️
          </button>
        </div>
        <div id="key-status" style="font-size:11px; font-weight:700; color:#475569;">Rotations: 0 / 4</div>
      </div>
    `;

    const btn = this.container.querySelector("#btn-turn-key");
    const status = this.container.querySelector("#key-status");

    btn.addEventListener("click", () => {
      if (this.isFinished) return;
      this.rotations++;
      const deg = this.rotations * 90;
      btn.style.transform = `rotate(${deg}deg)`;

      status.innerText = `Rotations: ${this.rotations} / ${this.totalRotations}`;
      this.updateProgress(this.rotations / this.totalRotations);

      if (this.rotations >= this.totalRotations) {
        status.innerText = "🔒 Trunk securely locked!";
        status.style.color = "#16A34A";
      }
    });
  }
}
