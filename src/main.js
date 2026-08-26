/**
 * Sister Sneak: Phone Locked - Main Application Bootstrap
 * Initializes game engine, lobby character selector, role preferences,
 * and matchmaking connections.
 */

import { Game } from './core/Game.js';
import { SISTERS } from './config/characters.js';
import { MUMMIES } from './config/mummies.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const game = new Game(canvas);
  game.start();

  let selectedSister = "RIDDHI";
  let selectedMummy = "SOHINI";

  // 1. Populate Sister Selection Cards
  const sisterGrid = document.getElementById('sister-cards-grid');
  if (sisterGrid) {
    sisterGrid.innerHTML = "";
    Object.values(SISTERS).forEach((s, idx) => {
      const card = document.createElement('div');
      card.className = `sister-card ${idx === 0 ? 'selected' : ''}`;
      card.setAttribute('data-id', s.id);
      card.innerHTML = `
        <div class="card-avatar">${s.avatar}</div>
        <div class="card-name">${s.name}</div>
        <div class="card-tagline">${s.tagline}</div>
        <div class="card-power">⚡ ${s.powerName}</div>
      `;

      card.addEventListener('click', () => {
        document.querySelectorAll('.sister-card').forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedSister = s.id;
        game.audio.playClick();
      });

      sisterGrid.appendChild(card);
    });
  }

  // 2. Wire Mummy Selection Cards
  const mummyCards = document.querySelectorAll('.mummy-card');
  mummyCards.forEach((mCard) => {
    mCard.addEventListener('click', () => {
      mummyCards.forEach((c) => c.classList.remove('selected'));
      mCard.classList.add('selected');
      selectedMummy = mCard.getAttribute('data-id');
      game.audio.playClick();
    });
  });

  // Single Player vs Multiplayer Tabs
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

  // Start Game Button (Single Player Solo)
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

  // Multiplayer: Create Room
  const btnCreateRoom = document.getElementById('btn-create-room');
  if (btnCreateRoom) {
    btnCreateRoom.addEventListener('click', () => {
      game.audio.playClick();
      btnCreateRoom.innerText = "Creating Room...";
      game.multiplayer.createRoom(selectedSister, selectedMummy, (code) => {
        btnCreateRoom.innerText = "Generate Room Code & Host";
        panelMulti?.classList.add('hidden');
        panelWaiting?.classList.remove('hidden');
        const codeDisplay = document.getElementById('mp-room-code-display');
        if (codeDisplay) codeDisplay.innerText = code;
        game.multiplayer.updateLobbyUI();
      });
    });
  }

  // Multiplayer: Join Room
  const btnJoinRoom = document.getElementById('btn-join-room');
  const inputRoomCode = document.getElementById('input-room-code');
  if (btnJoinRoom && inputRoomCode) {
    btnJoinRoom.addEventListener('click', () => {
      const code = inputRoomCode.value.trim();
      if (!code) {
        alert("Please enter a valid room code!");
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

  // Copy Room Code Button
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

  // Multiplayer: Host Start Match
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

  // Play Again Button
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
});
