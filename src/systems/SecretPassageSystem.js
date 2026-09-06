/**
 * Sister Sneak: Phone Locked - Authentic Haveli Secret Passages (ચોર દરવાજા અને કબાટ)
 * Allows the Prankster (and Jahanvi) to crawl through secret Almaris, Pantry Cabinets,
 * and Dadi's Trunk to travel between rooms and floors without being seen on staircases.
 * 
 * Includes anti-cheat role validation, route validation, and cooldown mechanisms.
 */

import { SECRET_PASSAGES } from '../config/constants.js';

export class SecretPassageSystem {
  constructor(game) {
    this.game = game;
    this.passages = SECRET_PASSAGES;
    this.activeNearbyPassage = null;
    this.passageCooldown = 0;
    this.maxCooldown = 8.0; // 8s tactical cooldown between sneaking
    this.isOpen = false;

    this.bindUI();
  }

  canPlayerUsePassages(player) {
    if (!player) return false;
    // Security check: only Prankster role OR Jahanvi (with Turbo Vent power)
    return player.role === 'prankster' || player.id === 'JAHANVI';
  }

  bindUI() {
    const modal = document.getElementById('modal-secret-passage');
    const closeBtn = document.getElementById('btn-close-passage-modal');
    const touchBtn = document.getElementById('btn-touch-passage');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    if (touchBtn) {
      const triggerTouchPassage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.tryOpenPassage();
      };
      touchBtn.addEventListener('touchstart', triggerTouchPassage, { passive: false });
      touchBtn.addEventListener('click', triggerTouchPassage);
    }

    // Key shortcut: V or click action when near passage
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyV' && this.game.state === 'PLAYING') {
        this.tryOpenPassage();
      }
    });
  }

  update(dt) {
    if (this.passageCooldown > 0) {
      this.passageCooldown = Math.max(0, this.passageCooldown - dt);
    }

    if (!this.game.player || this.game.state !== 'PLAYING') {
      this.activeNearbyPassage = null;
      this.updateHUDButton(false);
      return;
    }

    const p = this.game.player;
    if (!this.canPlayerUsePassages(p)) {
      this.activeNearbyPassage = null;
      this.updateHUDButton(false);
      return;
    }

    // Detect nearby secret passage entrance
    this.activeNearbyPassage = this.passages.find((pass) => {
      if (pass.floor !== p.floor) return false;
      const dist = Math.hypot(pass.x - p.x, pass.y - p.y);
      return dist <= (pass.radius || 48);
    }) || null;

    this.updateHUDButton(!!this.activeNearbyPassage);
  }

  updateHUDButton(isNear) {
    const touchBtn = document.getElementById('btn-touch-passage');

    if (touchBtn) {
      if (isNear && this.passageCooldown <= 0) {
        touchBtn.classList.remove('hidden');
      } else {
        touchBtn.classList.add('hidden');
      }
    }
  }

  tryOpenPassage() {
    if (!this.activeNearbyPassage) {
      if (this.canPlayerUsePassages(this.game.player)) {
        this.game.showTopToast("🚪 Walk near a Secret Almari, Pantry, or Dadi's Trunk to sneak through!");
      }
      return;
    }

    if (this.passageCooldown > 0) {
      this.game.showTopToast(`⏳ Secret passage on cooldown (${Math.ceil(this.passageCooldown)}s remaining)!`);
      return;
    }

    this.openModal(this.activeNearbyPassage);
  }

  openModal(currentPassage) {
    const modal = document.getElementById('modal-secret-passage');
    const nodesContainer = document.getElementById('passage-destinations-grid');
    const currentLabel = document.getElementById('passage-current-location');
    if (!modal || !nodesContainer) return;

    this.isOpen = true;
    if (currentLabel) {
      currentLabel.innerText = `You are inside: ${currentPassage.name} (${currentPassage.gujaratiName})`;
    }

    nodesContainer.innerHTML = '';

    // Get validated connected destinations
    const destinations = this.passages.filter(p => currentPassage.connectsTo.includes(p.id));

    destinations.forEach((dest) => {
      const btn = document.createElement('button');
      btn.className = 'passage-dest-card';
      const floorName = dest.floor === 2 ? '3F Terrace' : dest.floor === 1 ? '2F Living Hub' : '1F Ground Floor';
      
      btn.innerHTML = `
        <div class="passage-dest-icon">${dest.icon}</div>
        <div class="passage-dest-info">
          <strong class="passage-dest-title">${dest.name}</strong>
          <span class="passage-dest-gu">${dest.gujaratiName}</span>
          <small class="passage-dest-floor">📍 ${floorName}</small>
        </div>
        <span class="passage-sneak-arrow">Sneak ➔</span>
      `;

      btn.addEventListener('click', () => {
        this.travelToPassage(currentPassage, dest);
      });

      nodesContainer.appendChild(btn);
    });

    modal.classList.remove('hidden');
    if (this.game.audio) this.game.audio.playClick();
  }

  closeModal() {
    const modal = document.getElementById('modal-secret-passage');
    if (modal) modal.classList.add('hidden');
    this.isOpen = false;
  }

  travelToPassage(fromPassage, toPassage) {
    // Security & Route Validation
    if (!fromPassage.connectsTo.includes(toPassage.id)) {
      console.warn("Invalid passage route attempted.");
      return;
    }

    const player = this.game.player;
    if (!this.canPlayerUsePassages(player)) {
      console.warn("Unauthorized passage access.");
      return;
    }

    this.closeModal();
    this.passageCooldown = this.maxCooldown;

    // Trigger Sneak SFX (Creaking wooden Almari door)
    if (this.game.audio) {
      this.game.audio.playTaskComplete();
    }

    // Trigger 3D Ingress Sneak FX
    if (this.game.fx3D && player) {
      const p3d = this.game.coord2Dto3D(player.x, player.y, player.floor);
      this.game.fx3D.spawnDustPuff(p3d.x, player.floor * 8 + 0.1, p3d.z);
    }

    // Teleport player to destination
    this.game.setPlayerFloor(toPassage.floor, toPassage.x);
    if (player) {
      player.y = toPassage.y;
    }

    // Trigger 3D Egress Sneak FX at target
    setTimeout(() => {
      if (this.game.fx3D && player) {
        const p3d = this.game.coord2Dto3D(toPassage.x, toPassage.y, toPassage.floor);
        this.game.fx3D.spawnDustPuff(p3d.x, toPassage.floor * 8 + 0.1, p3d.z);
      }
      this.game.showTopToast(`🚪 Sneaked into ${toPassage.name} (${toPassage.gujaratiName})!`);
    }, 150);

    // Sync in multiplayer
    if (this.game.multiplayer && this.game.multiplayer.isMultiplayer) {
      this.game.multiplayer.syncMyPosition(player);
    }
  }
}
