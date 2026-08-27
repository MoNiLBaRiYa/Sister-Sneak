/**
 * Sister Sneak: Phone Locked - Master Game Engine
 * Manages game loop, entity updates, render pipelines, custom cutscenes,
 * active character power system, real-time multiplayer network sync,
 * pause/exit management, and mobile responsiveness.
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT, FLOOR_Y } from '../config/constants.js';
import { SISTERS } from '../config/characters.js';
import { MUMMIES } from '../config/mummies.js';
import { HouseMap } from '../world/HouseMap.js';
import { Camera } from './Camera.js';
import { InputManager } from './Input.js';
import { AudioManager } from './Audio.js';
import { Player } from '../entities/Player.js';
import { Bot } from '../entities/Bot.js';
import { Mummy } from '../entities/Mummy.js';
import { TaskManager } from '../systems/TaskManager.js';
import { SabotageSystem } from '../systems/SabotageSystem.js';
import { MeetingEngine } from '../systems/MeetingEngine.js';
import { DialogueEngine } from '../systems/DialogueEngine.js';
import { MultiplayerEngine } from '../systems/MultiplayerEngine.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.state = "LOBBY"; // "LOBBY", "CUTSCENE", "PLAYING", "MEETING", "GAMEOVER"
    this.lastTime = 0;

    // Subsystems
    this.audio = new AudioManager();
    this.camera = new Camera();
    this.input = new InputManager(canvas);
    this.taskManager = new TaskManager(this);
    this.houseMap = new HouseMap(this);
    this.dialogueEngine = new DialogueEngine();
    this.sabotageSystem = new SabotageSystem(this);
    this.meetingEngine = new MeetingEngine(this);
    this.multiplayer = new MultiplayerEngine(this);

    // Entities
    this.player = null;
    this.bots = [];
    this.remotePlayers = new Map();
    this.mummy = null;
    this.imposterSisterId = null;
    this.selectedSisterId = "RIDDHI";
    this.activeMummyId = "RIDDHI_MUMMY";

    this.activeNearbyHotspot = null;
    this.posSyncInterval = 0;

    this.bindHUDButtons();
    this.setupMobileViewport();
  }

  setupMobileViewport() {
    const resize = () => {
      const container = document.getElementById('game-container');
      if (!container) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scale = Math.min(w / CANVAS_WIDTH, h / CANVAS_HEIGHT);
      
      // Auto-scale canvas on mobile screens while maintaining aspect ratio
      if (w < 1000) {
        this.canvas.style.width = `${Math.floor(CANVAS_WIDTH * scale)}px`;
        this.canvas.style.height = `${Math.floor(CANVAS_HEIGHT * scale)}px`;
      } else {
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', () => setTimeout(resize, 200));
    resize();
  }

  bindHUDButtons() {
    // Floor Navigation
    [0, 1, 2].forEach((floorNum) => {
      const btn = document.getElementById(`floor-btn-${floorNum}`);
      if (btn) {
        btn.addEventListener("click", () => {
          if (this.player && this.state === "PLAYING") {
            this.player.setFloor(floorNum);
            this.camera.setFloor(floorNum);
            this.updateFloorButtonsUI(floorNum);
            this.audio.playStairTransition();
          }
        });
      }
    });

    // Active Character Power HUD Button
    const powerBtn = document.getElementById("btn-use-power");
    const touchPowerBtn = document.getElementById("btn-touch-power");

    const triggerPower = () => {
      if (this.player && this.state === "PLAYING") {
        this.player.useAbility(this);
      }
    };

    if (powerBtn) powerBtn.addEventListener("click", triggerPower);
    if (touchPowerBtn) {
      touchPowerBtn.addEventListener("click", triggerPower);
      touchPowerBtn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        triggerPower();
      }, { passive: false });
    }

    // Key shortcut for power: Q or Space
    window.addEventListener("keydown", (e) => {
      if (e.code === "KeyQ" || e.code === "Space") {
        if (this.player && this.state === "PLAYING") {
          this.player.useAbility(this);
        }
      }
    });

    // Sound toggle
    const sndBtn = document.getElementById("btn-sound-toggle");
    if (sndBtn) {
      sndBtn.addEventListener("click", () => {
        const on = this.audio.toggleSound();
        sndBtn.innerText = on ? "🔊" : "🔇";
      });
    }

    // Help toggle
    const helpBtn = document.getElementById("btn-help-toggle");
    const closeHelp = document.getElementById("btn-close-help");
    const helpModal = document.getElementById("screen-help");
    if (helpBtn && helpModal) {
      helpBtn.addEventListener("click", () => helpModal.classList.remove("hidden"));
    }
    if (closeHelp && helpModal) {
      closeHelp.addEventListener("click", () => helpModal.classList.add("hidden"));
    }

    // Pause / Exit Menu Handlers
    const pauseBtn = document.getElementById("btn-pause-toggle");
    const pauseModal = document.getElementById("screen-pause");
    const btnResume = document.getElementById("btn-pause-resume");
    const btnExit = document.getElementById("btn-pause-exit");

    if (pauseBtn && pauseModal) {
      pauseBtn.addEventListener("click", () => {
        pauseModal.classList.remove("hidden");
      });
    }

    if (btnResume && pauseModal) {
      btnResume.addEventListener("click", () => {
        pauseModal.classList.add("hidden");
      });
    }

    if (btnExit && pauseModal) {
      btnExit.addEventListener("click", () => {
        pauseModal.classList.add("hidden");
        this.leaveMatchToLobby();
      });
    }
  }

  leaveMatchToLobby() {
    this.multiplayer.exitMatch();
    this.state = "LOBBY";
    this.taskManager.reset();

    document.getElementById("game-hud")?.classList.add("hidden");
    document.getElementById("floor-switcher")?.classList.add("hidden");
    document.getElementById("sabotage-bar")?.classList.add("hidden");
    document.getElementById("screen-minigame")?.classList.add("hidden");
    document.getElementById("screen-meeting")?.classList.add("hidden");
    document.getElementById("screen-verdict")?.classList.add("hidden");
    document.getElementById("screen-cutscene")?.classList.add("hidden");
    document.getElementById("screen-gameover")?.classList.add("hidden");
    document.getElementById("screen-lobby")?.classList.remove("hidden");
  }

  handleRemotePlayerLeft(data) {
    // Show toast banner
    this.showTopToast(`👧 ${data.playerName} (${data.sisterId}) left the match! AI bot took over.`);

    // Replace remote player with AI bot
    if (this.remotePlayers.has(data.sisterId)) {
      const exiting = this.remotePlayers.get(data.sisterId);
      this.remotePlayers.delete(data.sisterId);

      const bConfig = SISTERS[data.sisterId];
      const replacementBot = new Bot({
        ...bConfig,
        floor: exiting.floor,
        x: exiting.x
      });
      replacementBot.role = exiting.role;
      this.bots.push(replacementBot);
    }
  }

  showTopToast(msg) {
    let toast = document.getElementById("game-toast-banner");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "game-toast-banner";
      toast.className = "game-toast-banner";
      document.getElementById("game-container")?.appendChild(toast);
    }
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }

  initRound(playerSisterId, chosenMummyId = "RIDDHI_MUMMY", rolePreference = "random") {
    this.selectedSisterId = playerSisterId;
    const sisterKeys = Object.keys(SISTERS);

    // Pick Imposter
    if (rolePreference === "imposter") {
      this.imposterSisterId = playerSisterId;
    } else if (rolePreference === "innocent") {
      const otherKeys = sisterKeys.filter((k) => k !== playerSisterId);
      this.imposterSisterId = otherKeys[Math.floor(Math.random() * otherKeys.length)];
    } else {
      this.imposterSisterId = sisterKeys[Math.floor(Math.random() * sisterKeys.length)];
    }

    // Pick Mummy
    const mummyKeys = ["RIDDHI_MUMMY", "SHRUTI_MUMMY", "JISHA_MUMMY", "JYEANA_MUMMY"];
    if (chosenMummyId === "RANDOM" || !MUMMIES[chosenMummyId]) {
      this.activeMummyId = mummyKeys[Math.floor(Math.random() * mummyKeys.length)];
    } else {
      this.activeMummyId = chosenMummyId;
    }
    this.mummy = new Mummy(MUMMIES[this.activeMummyId]);

    // Create Player
    const pConfig = SISTERS[playerSisterId];
    this.player = new Player({
      ...pConfig,
      floor: 1,
      x: 500
    });
    this.player.role = (playerSisterId === this.imposterSisterId) ? "imposter" : "innocent";

    // Create 4 AI Bots
    this.bots = [];
    sisterKeys.forEach((key) => {
      if (key !== playerSisterId) {
        const bConfig = SISTERS[key];
        const bot = new Bot({
          ...bConfig,
          floor: Math.floor(Math.random() * 3),
          x: 200 + Math.random() * 800
        });
        bot.role = (key === this.imposterSisterId) ? "imposter" : "innocent";
        this.bots.push(bot);
      }
    });

    // Reset Cleanliness State & assign tasks
    this.taskManager.reset();
    this.taskManager.assignTasksForSister(playerSisterId, false);

    this.camera.setFloor(1);
    this.updateHUDHeader();

    // Show cutscene first
    this.showIntroCutscene();
  }

  startMultiplayerRoundAsHost(hostSisterId, chosenMummyId = "RIDDHI_MUMMY", rolePreference = "random") {
    this.selectedSisterId = hostSisterId;
    const sisterKeys = Object.keys(SISTERS);

    const lobbyPlayers = this.multiplayer.lobbyPlayers;
    const humanSisterIds = lobbyPlayers.map(p => p.sisterId);
    
    // Honor Role Preference
    if (rolePreference === "imposter") {
      this.imposterSisterId = hostSisterId;
    } else if (rolePreference === "innocent") {
      const otherKeys = sisterKeys.filter((k) => k !== hostSisterId);
      this.imposterSisterId = otherKeys[Math.floor(Math.random() * otherKeys.length)];
    } else {
      this.imposterSisterId = sisterKeys[Math.floor(Math.random() * sisterKeys.length)];
    }

    const mummyKeys = ["RIDDHI_MUMMY", "SHRUTI_MUMMY", "JISHA_MUMMY", "JYEANA_MUMMY"];
    if (chosenMummyId === "RANDOM" || !MUMMIES[chosenMummyId]) {
      this.activeMummyId = mummyKeys[Math.floor(Math.random() * mummyKeys.length)];
    } else {
      this.activeMummyId = chosenMummyId;
    }
    this.mummy = new Mummy(MUMMIES[this.activeMummyId]);

    // Create Host Player
    const pConfig = SISTERS[hostSisterId];
    this.player = new Player({
      ...pConfig,
      floor: 1,
      x: 500
    });
    this.player.role = (hostSisterId === this.imposterSisterId) ? "imposter" : "innocent";

    // Create Remote Players & Bots
    this.remotePlayers.clear();
    this.bots = [];

    sisterKeys.forEach((key) => {
      if (key !== hostSisterId) {
        const isHuman = humanSisterIds.includes(key);
        if (isHuman) {
          const rConfig = SISTERS[key];
          const remotePlayer = new Player({
            ...rConfig,
            floor: 1,
            x: 600
          });
          remotePlayer.role = (key === this.imposterSisterId) ? "imposter" : "innocent";
          this.remotePlayers.set(key, remotePlayer);
        } else {
          const bConfig = SISTERS[key];
          const bot = new Bot({
            ...bConfig,
            floor: Math.floor(Math.random() * 3),
            x: 200 + Math.random() * 800
          });
          bot.role = (key === this.imposterSisterId) ? "imposter" : "innocent";
          this.bots.push(bot);
        }
      }
    });

    // Broadcast START to all peers
    this.multiplayer.broadcast({
      type: 'START_GAME_SYNC',
      imposterSisterId: this.imposterSisterId,
      mummyId: this.activeMummyId,
      lobbyPlayers: this.multiplayer.lobbyPlayers
    });

    this.taskManager.reset();
    this.taskManager.assignTasksForSister(hostSisterId, true);

    this.camera.setFloor(1);
    this.updateHUDHeader();
    this.showIntroCutscene();
  }

  startMultiplayerRoundAsClient(data) {
    this.imposterSisterId = data.imposterSisterId;
    this.activeMummyId = data.mummyId || "RIDDHI_MUMMY";
    this.mummy = new Mummy(MUMMIES[this.activeMummyId]);

    const mySisterId = this.selectedSisterId;
    const sisterKeys = Object.keys(SISTERS);
    const humanSisterIds = data.lobbyPlayers.map(p => p.sisterId);

    // Create Client Player
    const pConfig = SISTERS[mySisterId];
    this.player = new Player({
      ...pConfig,
      floor: 1,
      x: 550
    });
    this.player.role = (mySisterId === this.imposterSisterId) ? "imposter" : "innocent";

    this.remotePlayers.clear();
    this.bots = [];

    sisterKeys.forEach((key) => {
      if (key !== mySisterId) {
        if (humanSisterIds.includes(key)) {
          const rConfig = SISTERS[key];
          const remotePlayer = new Player({
            ...rConfig,
            floor: 1,
            x: 600
          });
          remotePlayer.role = (key === this.imposterSisterId) ? "imposter" : "innocent";
          this.remotePlayers.set(key, remotePlayer);
        } else {
          const bConfig = SISTERS[key];
          const bot = new Bot({
            ...bConfig,
            floor: 1,
            x: 300 + Math.random() * 600
          });
          bot.role = (key === this.imposterSisterId) ? "imposter" : "innocent";
          this.bots.push(bot);
        }
      }
    });

    this.taskManager.reset();
    this.taskManager.assignTasksForSister(mySisterId, true);

    document.getElementById('screen-lobby')?.classList.add('hidden');
    this.camera.setFloor(1);
    this.updateHUDHeader();
    this.showIntroCutscene();
  }

  updateRemotePlayerPosition(data) {
    const remote = this.remotePlayers.get(data.sisterId);
    if (remote) {
      remote.floor = data.floor;
      remote.x = data.x;
      remote.y = data.y;
      remote.vx = data.vx;
      remote.vy = data.vy;
      remote.facing = data.facing;
      remote.isMoving = data.isMoving;
    }
  }

  showIntroCutscene() {
    this.state = "CUTSCENE";
    const screen = document.getElementById("screen-cutscene");
    const avatar = document.getElementById("cutscene-mummy-avatar");
    const tagline = document.getElementById("cutscene-mummy-tagline");
    const lockArt = document.getElementById("cutscene-lock-graphic");
    const speaker = document.getElementById("intro-speaker");
    const text = document.getElementById("intro-dialogue-text");
    const trans = document.getElementById("intro-translation");
    const contBtn = document.getElementById("btn-cutscene-continue");

    const mummyData = MUMMIES[this.activeMummyId] || MUMMIES.RIDDHI_MUMMY;

    if (avatar) avatar.innerText = mummyData.avatar;
    if (tagline) tagline.innerText = mummyData.cutsceneArt?.tagline || mummyData.personality;
    if (lockArt) lockArt.innerText = mummyData.cutsceneArt?.emoji || "📦🔒📱📱📱📱📱";
    if (speaker) speaker.innerText = mummyData.name;
    if (text) text.innerText = `"${mummyData.dialogues.intro}"`;
    if (trans) trans.innerText = `(${mummyData.dialogues.introTrans})`;

    screen.classList.remove("hidden");

    if (contBtn) {
      contBtn.onclick = () => {
        screen.classList.add("hidden");
        this.startPlaying();
      };
    }
  }

  startPlaying() {
    this.state = "PLAYING";

    // Show HUD & Controls
    document.getElementById("game-hud")?.classList.remove("hidden");
    document.getElementById("floor-switcher")?.classList.remove("hidden");
    document.getElementById("touch-controls")?.classList.remove("hidden");

    if (this.player.role === "imposter") {
      document.getElementById("sabotage-bar")?.classList.remove("hidden");
    } else {
      document.getElementById("sabotage-bar")?.classList.add("hidden");
    }
  }

  updateFloorButtonsUI(activeFloor) {
    [0, 1, 2].forEach((f) => {
      const btn = document.getElementById(`floor-btn-${f}`);
      if (btn) {
        if (f === activeFloor) btn.classList.add("active");
        else btn.classList.remove("active");
      }
    });
  }

  updateHUDHeader() {
    const roleBadge = document.getElementById("hud-role-badge");
    const charAvatar = document.getElementById("hud-char-avatar");
    const charName = document.getElementById("hud-char-name");
    const powerName = document.getElementById("hud-power-name");

    if (roleBadge) {
      if (this.player.role === "imposter") {
        roleBadge.className = "hud-badge role-badge imposter";
        roleBadge.innerHTML = `<span class="role-icon">😈</span><span class="role-text">Secret Imposter</span>`;
      } else {
        roleBadge.className = "hud-badge role-badge";
        roleBadge.innerHTML = `<span class="role-icon">😇</span><span class="role-text">Innocent Sister</span>`;
      }
    }

    if (charAvatar) charAvatar.innerText = this.player.avatar;
    if (charName) charName.innerText = this.player.name;

    if (powerName) {
      if (this.player.role === "imposter") {
        powerName.innerText = this.player.imposterPower?.name || "Sabotage Power";
      } else {
        powerName.innerText = this.player.innocentPower?.name || "Power";
      }
    }
  }

  teleportAllToCentralHall() {
    if (this.player) {
      this.player.setFloor(1, 600);
      this.camera.setFloor(1);
    }
    if (this.mummy) {
      this.mummy.floor = 1;
      this.mummy.x = 640;
    }
    this.remotePlayers.forEach((rp, idx) => {
      rp.setFloor(1, 520 + idx * 70);
    });
    this.bots.forEach((b, idx) => {
      b.setFloor(1, 450 + idx * 80);
    });
  }

  start() {
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(currentTime) {
    const dt = Math.min(0.1, (currentTime - this.lastTime) / 1000);
    this.lastTime = currentTime;

    this.update(dt);
    this.render();

    requestAnimationFrame(this.loop.bind(this));
  }

  update(dt) {
    this.camera.update(dt);
    this.houseMap.update(dt);

    if (this.state === "PLAYING") {
      // 1. Player Input & Movement
      if (this.player) {
        const click = this.input.consumeClick();
        if (click) {
          this.player.moveToPoint(click.x, click.y);
        }
        this.player.handleInput(this.input, dt);

        // Update Power Button cooldown UI
        this.updatePowerUI();

        // Network Position Broadcast
        this.posSyncInterval += dt;
        if (this.posSyncInterval > 0.06 && this.multiplayer.isMultiplayer) {
          this.posSyncInterval = 0;
          this.multiplayer.syncMyPosition(this.player);
        }

        // Detect current room
        const room = this.houseMap.getRoomAt(this.player.x, this.player.y, this.player.floor);
        this.player.currentRoom = room;
        const roomLabel = document.getElementById("hud-room-name");
        if (roomLabel && room) {
          roomLabel.innerText = room.name;
        }

        // Detect nearby hotspots
        this.activeNearbyHotspot = this.houseMap.getHotspotNear(this.player.x, this.player.y, this.player.floor);
        this.updateActionPrompt();

        // Handle interaction press
        if (this.input.consumeInteract() && this.activeNearbyHotspot) {
          this.handleHotspotInteraction(this.activeNearbyHotspot);
        }
      }

      // 2. Remote Connected Players
      this.remotePlayers.forEach((rp) => rp.update(dt));

      // 3. AI Bots
      this.bots.forEach((bot) => bot.updateAI(dt, this));

      // 4. Mummy Patrol
      if (this.mummy) {
        const allSisters = [this.player, ...Array.from(this.remotePlayers.values()), ...this.bots];
        this.mummy.update(dt, allSisters);
        this.updateMummyRadar();
      }

      // 5. Sabotage System
      if (this.sabotageSystem) {
        this.sabotageSystem.update(dt);
      }
    }
  }

  updatePowerUI() {
    const powerBtn = document.getElementById("btn-use-power");
    const cdLabel = document.getElementById("hud-power-cd");
    const touchPowerBtn = document.getElementById("btn-touch-power");

    if (this.player && powerBtn) {
      if (this.player.abilityCooldown > 0) {
        powerBtn.disabled = true;
        if (cdLabel) cdLabel.innerText = `(${Math.ceil(this.player.abilityCooldown)}s)`;
        if (touchPowerBtn) touchPowerBtn.style.opacity = "0.5";
      } else {
        powerBtn.disabled = false;
        if (cdLabel) cdLabel.innerText = "(READY)";
        if (touchPowerBtn) touchPowerBtn.style.opacity = "1";
      }
    }
  }

  updateMummyRadar() {
    const alert = document.getElementById("mummy-alert");
    if (!alert || !this.player || !this.mummy) return;

    if (this.mummy.floor === this.player.floor && Math.abs(this.mummy.x - this.player.x) < 220) {
      alert.classList.remove("hidden");
    } else {
      alert.classList.add("hidden");
    }
  }

  updateActionPrompt() {
    const prompt = document.getElementById("action-prompt");
    if (!prompt) return;

    if (this.activeNearbyHotspot) {
      prompt.classList.remove("hidden");
      prompt.style.left = `${this.activeNearbyHotspot.x}px`;
      prompt.style.top = `${this.activeNearbyHotspot.y - 15}px`;

      const pText = prompt.querySelector(".prompt-text");
      const kBadge = prompt.querySelector(".key-badge");
      const isTask = !!this.activeNearbyHotspot.taskId;
      const isDone = isTask && this.taskManager.isTaskCompleted(this.activeNearbyHotspot.taskId);

      if (isDone) {
        if (kBadge) kBadge.innerText = "✨";
        if (pText) pText.innerText = `${this.activeNearbyHotspot.label} (Cleaned)`;
      } else {
        if (kBadge) kBadge.innerText = "E";
        if (pText) pText.innerText = this.activeNearbyHotspot.label;
      }
    } else {
      prompt.classList.add("hidden");
    }
  }

  handleHotspotInteraction(hs) {
    if (hs.isEmergencyButton) {
      this.meetingEngine.startMeeting("Emergency Called at Phone Lock Box!");
      this.multiplayer.syncMeeting("Emergency Called at Phone Lock Box!");
    } else if (hs.isStairHotspot) {
      this.player.setFloor(hs.targetFloor, hs.targetX);
      this.camera.setFloor(hs.targetFloor);
      this.updateFloorButtonsUI(hs.targetFloor);
      this.audio.playStairTransition();
    } else if (hs.taskId) {
      this.taskManager.openTask(hs.taskId);
    }
  }

  triggerWin(reason) {
    this.state = "GAMEOVER";
    this.audio.playVictory();

    const screen = document.getElementById("screen-gameover");
    const banner = document.getElementById("gameover-banner");
    const sub = document.getElementById("gameover-subtitle");
    const imposterReveal = document.getElementById("gameover-imposter-reveal");
    const outcome = document.getElementById("gameover-story-outcome");
    const statTasks = document.getElementById("stat-tasks-done");
    const statClean = document.getElementById("stat-clean-pct");

    if (banner) banner.innerText = "🎉 INNOCENTS WIN! 🎉";
    if (sub) sub.innerText = "The House is 100% Sparkling Clean!";
    if (imposterReveal) imposterReveal.innerText = SISTERS[this.imposterSisterId].name;
    if (outcome) outcome.innerText = "Mummy opened the heirloom lockbox and returned all 5 phones with fresh jalebis & kaju katli!";

    if (statTasks) statTasks.innerText = this.taskManager.tasksCompletedCount;
    if (statClean) statClean.innerText = `${Math.round(this.taskManager.cleanliness)}%`;

    screen.classList.remove("hidden");
  }

  triggerDefeat(reason) {
    this.state = "GAMEOVER";
    this.audio.playDefeat();

    const screen = document.getElementById("screen-gameover");
    const banner = document.getElementById("gameover-banner");
    const sub = document.getElementById("gameover-subtitle");
    const imposterReveal = document.getElementById("gameover-imposter-reveal");
    const outcome = document.getElementById("gameover-story-outcome");

    if (banner) banner.innerText = "😈 IMPOSTER WINS! 😈";
    if (sub) sub.innerText = "The Imposter Framed the Innocent Sisters!";
    if (imposterReveal) imposterReveal.innerText = SISTERS[this.imposterSisterId].name;
    if (outcome) outcome.innerText = "The Imposter tricked Mummy! The framed innocent sister gets deep-cleaning chore punishment while the Imposter relaxes!";

    screen.classList.remove("hidden");
  }

  render() {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Apply Camera
    this.camera.apply(this.ctx);

    // 1. Draw House Cutaway Map & Rooms
    const activeFloor = this.player ? this.player.floor : 1;
    this.houseMap.draw(this.ctx, activeFloor);

    // 2. Draw Inspector Mummy
    if (this.mummy) {
      this.mummy.draw(this.ctx);
    }

    // 3. Draw Remote Human Players
    this.remotePlayers.forEach((rp) => rp.draw(this.ctx));

    // 4. Draw AI Bots
    this.bots.forEach((bot) => bot.draw(this.ctx));

    // 5. Draw Controllable Local Player
    if (this.player) {
      this.player.draw(this.ctx);
    }

    // Restore Camera
    this.camera.restore(this.ctx);
  }
}
