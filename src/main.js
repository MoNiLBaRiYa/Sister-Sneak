/**
 * Sister Sneak: Phone Locked - Main Application Bootstrap
 * Initializes game engine, lobby character selector with custom illustrated avatars,
 * 3D rotating character hero stage, interactive power sandbox studio,
 * role preferences, instant character sync across lobby, and matchmaking connections.
 */

import { Game } from './core/Game.js';
import { SISTERS } from './config/characters.js';
import { MUMMIES } from './config/mummies.js';
import { HeroStage3D } from './engine3d/HeroStage3D.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const game = new Game(canvas);
  game.start();

  let selectedSister = "RIDDHI";
  let selectedMummy = "RIDDHI_MUMMY";

  // 1. Initialize Hero 3D Stage on Landing Page
  const heroContainer = document.getElementById('hero-stage-container');
  let heroStage = null;
  if (heroContainer) {
    heroStage = new HeroStage3D(heroContainer);
  }

  // Hero Power Preview FX Button
  const btnHeroPower = document.getElementById('btn-hero-test-power');
  if (btnHeroPower && heroStage) {
    btnHeroPower.addEventListener('click', () => {
      heroStage.triggerPowerBurst();
      game.audio.playPower();
      const s = SISTERS[selectedSister];
      game.showTopToast(`✨ Previewing ${s.name}'s Signature Power FX! ✨`);
    });
  }

  // 2. Populate Sister Selection Cards with Custom Avatars
  const sisterGrid = document.getElementById('sister-cards-grid');
  if (sisterGrid) {
    sisterGrid.innerHTML = "";
    Object.values(SISTERS).forEach((s, idx) => {
      const card = document.createElement('div');
      card.className = `sister-card ${idx === 0 ? 'selected' : ''}`;
      card.setAttribute('data-id', s.id);
      card.innerHTML = `
        <div class="card-avatar-wrapper">
          <img src="${s.image}" alt="${s.name}" class="card-avatar-img" />
        </div>
        <div class="card-name">${s.name}</div>
        <div class="card-tagline">${s.archetype}</div>
        <div class="card-power-stack">
          <div class="card-power-item innocent">
            <span class="p-badge">😇 SELF-HELP:</span>
            <span class="p-name">${s.innocentPower?.name}</span>
          </div>
          <div class="card-power-item prankster">
            <span class="p-badge">😈 TRAP/IRRITATE:</span>
            <span class="p-name">${s.pranksterPower?.name}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        document.querySelectorAll('.sister-card').forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedSister = s.id;
        game.selectedSisterId = s.id;

        // Update 3D Hero Stage Model
        if (heroStage) {
          heroStage.setSister(s.id);
        }

        // Sync character change to multiplayer lobby in real time
        if (game.multiplayer && game.multiplayer.isMultiplayer) {
          game.multiplayer.updateMyCharacter(s.id, s.name);
        }

        game.audio.playClick();
      });

      sisterGrid.appendChild(card);
    });
  }

  // 3. Wire Mummy Selection Cards
  const mummyCards = document.querySelectorAll('.mummy-card');
  mummyCards.forEach((mCard) => {
    mCard.addEventListener('click', () => {
      mummyCards.forEach((c) => c.classList.remove('selected'));
      mCard.classList.add('selected');
      selectedMummy = mCard.getAttribute('data-id');
      game.audio.playClick();
    });
  });

  // 4. Portal Navigation Tabs (Play, Powers, Mummy Guide, Lore, Roadmap)
  const portalTabs = [
    { btn: 'tab-portal-play', panel: 'portal-panel-play' },
    { btn: 'tab-portal-powers', panel: 'portal-panel-powers' },
    { btn: 'tab-portal-mummy', panel: 'portal-panel-mummy' },
    { btn: 'tab-portal-lore', panel: 'portal-panel-lore' },
    { btn: 'tab-portal-roadmap', panel: 'portal-panel-roadmap' }
  ];

  portalTabs.forEach(tab => {
    const btnEl = document.getElementById(tab.btn);
    const panelEl = document.getElementById(tab.panel);
    if (btnEl && panelEl) {
      btnEl.addEventListener('click', () => {
        portalTabs.forEach(t => {
          document.getElementById(t.btn)?.classList.remove('active');
          document.getElementById(t.panel)?.classList.add('hidden');
          document.getElementById(t.panel)?.classList.remove('active');
        });
        btnEl.classList.add('active');
        panelEl.classList.remove('hidden');
        panelEl.classList.add('active');
        game.audio.playClick();

        if (tab.btn === 'tab-portal-play' && heroStage) {
          setTimeout(() => heroStage.onResize(), 100);
        }
      });
    }
  });

  // 5. Interactive Sandbox Studio Buttons in TAB 2
  const sandboxBtns = document.querySelectorAll('.sandbox-btn');
  sandboxBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const powerType = btn.getAttribute('data-power');
      game.audio.playPower();

      if (powerType === "RIDDHI") {
        const sleepEl = document.getElementById("sleep-fog-overlay");
        sleepEl?.classList.remove("hidden");
        game.showTopToast("😴 Riddhi: Lavender Sleep Cloud Fog Active (Slows nearby by 60%)!");
        setTimeout(() => sleepEl?.classList.add("hidden"), 3000);
      } else if (powerType === "SHRUTI") {
        const paintEl = document.getElementById("paint-splatter-overlay");
        paintEl?.classList.remove("hidden");
        game.showTopToast("🎨 Shruti: Rangoli Paint Splatter Blinds Screen (5s)!");
        setTimeout(() => paintEl?.classList.add("hidden"), 3500);
      } else if (powerType === "JAHANVI") {
        const stickyEl = document.getElementById("sticky-trap-overlay");
        stickyEl?.classList.remove("hidden");
        game.showTopToast("🦶 Jahanvi: Sticky Bubblegum Snare Placed! Traps anyone stepping on it!");
        setTimeout(() => stickyEl?.classList.add("hidden"), 3000);
      } else if (powerType === "JISHA") {
        game.showTopToast("😇 Jisha: Mummy's Ladli Shield Active! Immune to suspicion & checks (12s)!");
      } else if (powerType === "JYEANA") {
        const glitchEl = document.getElementById("glitch-scanlines-overlay");
        glitchEl?.classList.remove("hidden");
        game.showTopToast("⚡ Jyeana: EMP Jammer Active! Controls are INVERTED (6s)!");
        setTimeout(() => glitchEl?.classList.add("hidden"), 3000);
      }
    });
  });

  // 6. Single Player vs Multiplayer Tabs
  const tabSingle = document.getElementById('tab-singleplayer');
  const tabMulti = document.getElementById('tab-multiplayer');
  const panelSingle = document.getElementById('singleplayer-options-panel');
  const panelMulti = document.getElementById('multiplayer-options-panel');
  const panelWaiting = document.getElementById('multiplayer-waiting-room');

  if (tabSingle && tabMulti) {
    tabSingle.addEventListener('click', () => {
      tabSingle.classList.add('active');
      tabMulti.classList.remove('active');
      panelSingle?.classList.remove('hidden');
      panelMulti?.classList.add('hidden');
      panelWaiting?.classList.add('hidden');
      game.audio.playClick();
    });

    tabMulti.addEventListener('click', () => {
      tabMulti.classList.add('active');
      tabSingle.classList.remove('active');
      panelSingle?.classList.add('hidden');
      panelMulti?.classList.remove('hidden');
      panelWaiting?.classList.add('hidden');
      game.audio.playClick();
    });
  }

  // 7. Start Game Button (Single Player Solo)
  const btnStart = document.getElementById('btn-start-game');
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      const rolePrefEl = document.querySelector('input[name="rolePref"]:checked');
      const rolePref = rolePrefEl ? rolePrefEl.value : "random";

      document.getElementById('screen-lobby').classList.add('hidden');
      game.audio.resume();
      game.audio.playClick();
      game.initRound(selectedSister, selectedMummy, rolePref);
    });
  }

  // 8. Multiplayer: Create Room
  const btnCreateRoom = document.getElementById('btn-create-room');
  const inputCustomHostCode = document.getElementById('input-custom-host-code');
  if (btnCreateRoom) {
    btnCreateRoom.addEventListener('click', () => {
      game.audio.playClick();
      btnCreateRoom.innerText = "Creating Room...";
      const customCode = inputCustomHostCode ? inputCustomHostCode.value.trim() : "";

      game.multiplayer.createRoom(selectedSister, selectedMummy, customCode, (code) => {
        btnCreateRoom.innerText = "Generate Room Code & Host";
        panelMulti?.classList.add('hidden');
        panelWaiting?.classList.remove('hidden');
        const codeDisplay = document.getElementById('mp-room-code-display');
        if (codeDisplay) codeDisplay.innerText = code;
        game.multiplayer.updateLobbyUI();
      });
    });
  }

  // 9. Multiplayer: Join Room
  const btnJoinRoom = document.getElementById('btn-join-room');
  const inputRoomCode = document.getElementById('input-room-code');
  if (btnJoinRoom && inputRoomCode) {
    btnJoinRoom.addEventListener('click', () => {
      const code = inputRoomCode.value.trim();
      if (!code) {
        alert("Please enter a valid 4-5 digit room code!");
        return;
      }
      game.audio.playClick();
      btnJoinRoom.innerText = "Connecting...";
      game.multiplayer.joinRoom(code, selectedSister, SISTERS[selectedSister].name, (joinedCode) => {
        btnJoinRoom.innerText = "Join Room";
        panelMulti?.classList.add('hidden');
        panelWaiting?.classList.remove('hidden');
        const codeDisplay = document.getElementById('mp-room-code-display');
        if (codeDisplay) codeDisplay.innerText = joinedCode;
        game.multiplayer.updateLobbyUI();
      }, (err) => {
        alert("Could not connect to room: " + (err.message || code));
        btnJoinRoom.innerText = "Join Room";
      });
    });
  }

  // 10. Copy Room Code Button
  const btnCopyCode = document.getElementById('btn-copy-code');
  if (btnCopyCode) {
    btnCopyCode.addEventListener('click', () => {
      const code = game.multiplayer.roomCode;
      navigator.clipboard.writeText(code).then(() => {
        btnCopyCode.innerText = "✅ Copied!";
        setTimeout(() => { btnCopyCode.innerText = "📋 Copy Code"; }, 1500);
      });
    });
  }

  // 11. Copy Direct Link Button
  const btnCopyLink = document.getElementById('btn-copy-invite-link');
  if (btnCopyLink) {
    btnCopyLink.addEventListener('click', () => {
      const link = game.multiplayer.getShareableLink();
      navigator.clipboard.writeText(link).then(() => {
        btnCopyLink.innerText = "✅ Link Copied!";
        setTimeout(() => { btnCopyLink.innerText = "🔗 Copy Direct Link"; }, 1500);
      });
    });
  }

  // 12. 1-Click Share on WhatsApp Button
  const btnShareWhatsapp = document.getElementById('btn-share-whatsapp');
  if (btnShareWhatsapp) {
    btnShareWhatsapp.addEventListener('click', () => {
      const code = game.multiplayer.roomCode;
      const link = game.multiplayer.getShareableLink();
      const msg = encodeURIComponent(`👧 Join my Sister Sneak match! 📱🔒\n\nRoom Code: *${code}*\nClick to join directly:\n${link}`);
      window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
    });
  }

  // 13. Multiplayer: Host Start Match
  const btnMpStart = document.getElementById('btn-mp-start-game');
  if (btnMpStart) {
    btnMpStart.addEventListener('click', () => {
      const rolePrefEl = document.querySelector('input[name="rolePref"]:checked');
      const rolePref = rolePrefEl ? rolePrefEl.value : "random";

      document.getElementById('screen-lobby').classList.add('hidden');
      game.audio.resume();
      game.audio.playClick();
      game.startMultiplayerRoundAsHost(selectedSister, selectedMummy, rolePref);
    });
  }

  // 14. Play Again Button
  const btnPlayAgain = document.getElementById('btn-play-again');
  if (btnPlayAgain) {
    btnPlayAgain.addEventListener('click', () => {
      document.getElementById('screen-gameover').classList.add('hidden');
      document.getElementById('screen-lobby').classList.remove('hidden');
      document.getElementById('game-hud').classList.add('hidden');
      document.getElementById('floor-switcher').classList.add('hidden');
      document.getElementById('sabotage-bar').classList.add('hidden');
      game.state = "LOBBY";
    });
  }

  // 15. Creator Message Toggle (Brother Monil)
  const btnToggleCreator = document.getElementById('btn-toggle-creator');
  const creatorBadge = document.getElementById('creator-corner-badge');
  if (btnToggleCreator && creatorBadge) {
    btnToggleCreator.addEventListener('click', (e) => {
      e.stopPropagation();
      creatorBadge.classList.toggle('minimized');
    });
  }
});
