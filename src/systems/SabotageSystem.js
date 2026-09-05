/**
 * Sister Sneak: Phone Locked - Sabotage System (Prankster Abilities)
 * Manages Switchboard Blackout and Door Kundi sabotages with Among Us Style Cooldowns (25s & 15s)
 * and Critical 35s Countdown Timer where Innocents must fix it at the fuse box or Prankster wins.
 */

import { SABOTAGE_COOLDOWNS } from '../config/constants.js';

export class SabotageSystem {
  constructor(game) {
    this.game = game;
    // Initial 10s warmup cooldown at round start (like Among Us)
    this.cooldowns = {
      BLACKOUT: 10,
      KUNDI: 10
    };
    this.criticalSabotageActive = false;
    this.criticalTimer = 0;
    this.bindUI();
  }

  bindUI() {
    const btnBlackout = document.getElementById("sab-blackout");
    const btnKundi = document.getElementById("sab-kundi");

    if (btnBlackout) {
      btnBlackout.addEventListener("click", () => this.triggerSabotage("BLACKOUT"));
    }
    if (btnKundi) {
      btnKundi.addEventListener("click", () => this.triggerSabotage("KUNDI"));
    }
  }

  update(dt) {
    if (this.game.state !== "PLAYING") {
      if (this.criticalSabotageActive) {
        this.resolveCriticalSabotage();
      }
      return;
    }

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
        alertEl.innerHTML = `<span class="pulse-icon">🚨</span><span class="warning-text">CRITICAL SABOTAGE: FUSE OVERHEAT (${Math.ceil(this.criticalTimer)}s)! FIX AT FUSE BOX OR PRANKSTER WINS!</span>`;
      }

      if (this.criticalTimer <= 0) {
        this.criticalSabotageActive = false;
        if (this.game.state === "PLAYING") {
          this.game.triggerDefeat("CRITICAL_SABOTAGE_EXPIRED");
        }
      }
    }

    this.updateUI();
  }

  updateUI() {
    const cdBlackout = document.getElementById("cd-blackout");
    const cdKundi = document.getElementById("cd-kundi");
    const btnBlackout = document.getElementById("sab-blackout");
    const btnKundi = document.getElementById("sab-kundi");

    if (btnBlackout) btnBlackout.disabled = this.cooldowns.BLACKOUT > 0;
    if (btnKundi) btnKundi.disabled = this.cooldowns.KUNDI > 0;

    if (cdBlackout) cdBlackout.innerText = this.cooldowns.BLACKOUT > 0 ? `${Math.ceil(this.cooldowns.BLACKOUT)}s` : "";
    if (cdKundi) cdKundi.innerText = this.cooldowns.KUNDI > 0 ? `${Math.ceil(this.cooldowns.KUNDI)}s` : "";
  }

  triggerSabotage(type, targetFloor = null) {
    if (this.cooldowns[type] > 0) return;

    const cdMultiplier = (this.game.pranksterSisterId === "JYEANA") ? 0.5 : 1.0;
    this.cooldowns[type] = (SABOTAGE_COOLDOWNS[type] || 20) * cdMultiplier;

    this.game.camera.shake(0.5, 10);
    this.game.audio.playSabotageAlert();

    const floor = targetFloor !== null ? targetFloor : (this.game.player ? this.game.player.floor : 1);

    if (type === "BLACKOUT") {
      this.game.houseMap.setFloorBlackout(floor, true);
      this.criticalSabotageActive = true;
      this.criticalTimer = 35.0; // 35 seconds to fix or Prankster wins!
      this.game.showTopToast(`🚨 CRITICAL SABOTAGE: Blackout on Floor ${floor === 2 ? '3F' : floor === 1 ? '2F' : '1F'} (35s)! Fix it at the Fuse Box!`);
    } else if (type === "KUNDI") {
      const player = this.game.player;
      const px = player ? player.x : 500;
      const py = player ? player.y : 300;
      const facing = player ? player.facing : 'right';
      const lockedRoom = this.game.houseMap.lockNextRoom(px, py, floor, facing, 10.0);
      const roomName = lockedRoom ? lockedRoom.name : "Adjacent Room";
      this.game.showTopToast(`🔒 Door Kundi: ${roomName} has been locked from outside (10s)!`);
    }

    // Sync sabotage across all multiplayer peers
    if (this.game.multiplayer && this.game.multiplayer.isMultiplayer) {
      this.game.multiplayer.syncSabotage(type, floor);
    }
  }

  resolveCriticalSabotage() {
    this.criticalSabotageActive = false;
    this.criticalTimer = 0;
    if (this.game.houseMap && this.game.houseMap.blackedOutFloors) {
      this.game.houseMap.blackedOutFloors.clear();
    }
    if (this.game.lighting3D) {
      this.game.lighting3D.setBlackout(false);
    }
    const alertEl = document.getElementById("mummy-alert");
    if (alertEl) {
      alertEl.classList.add("hidden");
      alertEl.innerHTML = "";
    }
    this.game.showTopToast("✨ Blown Fuse Repaired! Power & Lights 100% Restored! ✨");
  }
}
