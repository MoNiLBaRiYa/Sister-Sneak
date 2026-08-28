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
      <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; background:#E2E8F0; padding:6px; border-radius:10px;">
        <div style="font-size:10.5px; font-weight:700; color:#334155;">🗝️ Turn the heirloom brass key:</div>
        <div style="width:125px; height:105px; background:#78350F; border:3px solid #451A03; border-radius:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 6px 14px rgba(0,0,0,0.25);">
          <div style="width:12px; height:20px; background:#1C1917; border-radius:6px 6px 3px 3px; margin-bottom:6px;"></div>
          <button id="btn-turn-key" style="background:#FBBF24; border:2.5px solid #D97706; border-radius:50%; width:48px; height:48px; font-size:20px; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(0,0,0,0.3); transition:transform 0.2s ease-out;">
            🗝️
          </button>
        </div>
        <div id="key-status" style="font-size:9.5px; font-weight:700; color:#475569;">Rotations: 0 / 4</div>
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
        status.innerText = "🔒 Trunk locked!";
        status.style.color = "#16A34A";
      }
    });
  }
}
