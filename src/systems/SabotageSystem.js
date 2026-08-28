/**
 * Sister Sneak: Phone Locked - Sabotage System (Imposter Abilities)
 * Manages Blackout, Door Kundi, and Floor Mess sabotages with Critical Countdown Timer
 * where Innocents must fix it at the switchboard or Imposter wins.
 */

import { SABOTAGE_COOLDOWNS } from '../config/constants.js';

export class SabotageSystem {
  constructor(game) {
    this.game = game;
    this.cooldowns = {
      BLACKOUT: 0,
      KUNDI: 0,
      MESS: 0
    };
    this.criticalSabotageActive = false;
    this.criticalTimer = 0;
    this.bindUI();
  }

  bindUI() {
    const btnBlackout = document.getElementById("sab-blackout");
    const btnKundi = document.getElementById("sab-kundi");
    const btnMess = document.getElementById("sab-mess");

    if (btnBlackout) {
      btnBlackout.addEventListener("click", () => this.triggerSabotage("BLACKOUT"));
    }
    if (btnKundi) {
      btnKundi.addEventListener("click", () => this.triggerSabotage("KUNDI"));
    }
    if (btnMess) {
      btnMess.addEventListener("click", () => this.triggerSabotage("MESS"));
    }
  }

  update(dt) {
    // Update cooldown timers
    Object.keys(this.cooldowns).forEach((k) => {
      if (this.cooldowns[k] > 0) {
        this.cooldowns[k] = Math.max(0, this.cooldowns[k] - dt);
      }
    });

    // Update Critical Sabotage Countdown
    if (this.criticalSabotageActive) {
      this.criticalTimer -= dt;
      const alertEl = document.getElementById("mummy-alert");
      if (alertEl) {
        alertEl.classList.remove("hidden");
        alertEl.innerHTML = `<span class="pulse-icon">🚨</span><span class="warning-text">CRITICAL SABOTAGE: FUSE OVERHEAT (${Math.ceil(this.criticalTimer)}s)! FIX AT SWITCHBOARD OR IMPOSTER WINS!</span>`;
      }

      if (this.criticalTimer <= 0) {
        this.criticalSabotageActive = false;
        this.game.triggerDefeat("CRITICAL_SABOTAGE_EXPIRED");
      }
    }

    this.updateUI();
  }

  updateUI() {
    const cdBlackout = document.getElementById("cd-blackout");
    const cdKundi = document.getElementById("cd-kundi");
    const cdMess = document.getElementById("cd-mess");
    const btnBlackout = document.getElementById("sab-blackout");
    const btnKundi = document.getElementById("sab-kundi");
    const btnMess = document.getElementById("sab-mess");

    if (btnBlackout) btnBlackout.disabled = this.cooldowns.BLACKOUT > 0;
    if (btnKundi) btnKundi.disabled = this.cooldowns.KUNDI > 0;
    if (btnMess) btnMess.disabled = this.cooldowns.MESS > 0;

    if (cdBlackout) cdBlackout.innerText = this.cooldowns.BLACKOUT > 0 ? `${Math.ceil(this.cooldowns.BLACKOUT)}s` : "";
    if (cdKundi) cdKundi.innerText = this.cooldowns.KUNDI > 0 ? `${Math.ceil(this.cooldowns.KUNDI)}s` : "";
    if (cdMess) cdMess.innerText = this.cooldowns.MESS > 0 ? `${Math.ceil(this.cooldowns.MESS)}s` : "";
  }

  triggerSabotage(type, targetFloor = null) {
    if (this.cooldowns[type] > 0) return;

    const cdMultiplier = (this.game.imposterSisterId === "JYEANA") ? 0.5 : 1.0;
    this.cooldowns[type] = SABOTAGE_COOLDOWNS[type] * cdMultiplier;

    this.game.camera.shake(0.5, 10);
    this.game.audio.playSabotageAlert();

    const floor = targetFloor !== null ? targetFloor : (this.game.player ? this.game.player.floor : 1);

    if (type === "BLACKOUT") {
      this.game.houseMap.setFloorBlackout(floor, true);
      this.criticalSabotageActive = true;
      this.criticalTimer = 35.0; // 35 seconds to fix or Imposter wins!
      this.game.showTopToast("🚨 CRITICAL SABOTAGE: Switchboard Blackout (35s)! Fix it at 1F Power Board!");
    } else if (type === "MESS") {
      this.game.taskManager.reduceCleanliness(15);
      this.game.showTopToast("🧹 Imposter spilled junk across the floors (-15% Cleanliness)!");
    } else if (type === "KUNDI") {
      this.game.showTopToast("🔒 Imposter locked bedroom doors for 8s!");
    }

    // Sync sabotage across all multiplayer peers
    if (this.game.multiplayer && this.game.multiplayer.isMultiplayer) {
      this.game.multiplayer.syncSabotage(type, floor);
    }

    if (this.game.player && this.game.player.role === "imposter" && this.game.player.id === "JAHANVI") {
      const nextFloor = (this.game.player.floor + 1) % 3;
      this.game.player.setFloor(nextFloor);
      this.game.camera.setFloor(nextFloor);
    }
  }

  resolveCriticalSabotage() {
    if (this.criticalSabotageActive) {
      this.criticalSabotageActive = false;
      this.game.houseMap.blackedOutFloors.clear();
      const alertEl = document.getElementById("mummy-alert");
      if (alertEl) alertEl.classList.add("hidden");
      this.game.showTopToast("✨ Critical Sabotage Resolved! Power restored! ✨");
    }
  }
}
