/**
 * Sister Sneak 3D: Phone Locked - Master Game Engine
 * 3D Isometric WebGL Engine (Three.js), Asymmetric Powers,
 * Mummy FOV Vision Cone & Flying Chappal Danger System.
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

// 3D Engine Systems
import { ThreeRenderer } from '../engine3d/ThreeRenderer.js';
import { IsometricCamera } from '../engine3d/IsometricCamera.js';
import { Lighting3D } from '../engine3d/Lighting3D.js';
import { HaveliWorld3D } from '../engine3d/HaveliWorld3D.js';
import { Player3D } from '../entities3d/Player3D.js';
import { Mummy3D } from '../entities3d/Mummy3D.js';
import { FlyingChappal3D } from '../entities3d/FlyingChappal3D.js';
import { ParticleEffects3D } from '../fx3d/ParticleEffects3D.js';
import { VoiceSoundboard } from '../audio/VoiceSoundboard.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.state = "LOBBY"; // "LOBBY", "CUTSCENE", "PLAYING", "MEETING", "GAMEOVER"
    this.lastTime = 0;

    // Subsystems
    this.audio = new AudioManager();
    this.soundboard = new VoiceSoundboard();
    this.camera = new Camera();
    this.input = new InputManager(canvas);
    this.taskManager = new TaskManager(this);
    this.houseMap = new HouseMap(this);
    this.dialogueEngine = new DialogueEngine();
    this.sabotageSystem = new SabotageSystem(this);
    this.meetingEngine = new MeetingEngine(this);
    this.multiplayer = new MultiplayerEngine(this);

    // Initialize Three.js 3D Engine
    try {
      this.threeRenderer = new ThreeRenderer(canvas);
      this.isoCamera = new IsometricCamera();
      this.threeRenderer.setCamera(this.isoCamera.getThreeCamera());
      this.lighting3D = new Lighting3D(this.threeRenderer.scene);
      this.haveli3D = new HaveliWorld3D(this.threeRenderer.scene, this.lighting3D);
      this.particles3D = new ParticleEffects3D(this.threeRenderer.scene);
      this.chappal3D = new FlyingChappal3D(this.threeRenderer.scene);
    } catch (e) {
      console.warn("3D WebGL Initialization warning:", e);
    }

    // Entities
    this.player = null;
    this.player3D = null;
    this.bots = [];
    this.bots3D = new Map();
    this.remotePlayers = new Map();
    this.remotePlayers3D = new Map();
    this.mummy = null;
    this.mummy3D = null;
    this.pranksterSisterId = null;
    this.selectedSisterId = "RIDDHI";
    this.activeMummyId = "RIDDHI_MUMMY";

    this.activeNearbyHotspot = null;
    this.posSyncInterval = 0;

    this.bindHUDButtons();
  }

  coord2Dto3D(x2d, y2d, floor) {
    return {
      x: (x2d - 600) / 38,
      z: (y2d - (FLOOR_Y[floor] + 120)) / 38
    };
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
            if (this.isoCamera) this.isoCamera.setFloor(floorNum);
            if (this.player3D) this.player3D.setFloor(floorNum);
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

    // Pick Prankster
    if (rolePreference === "prankster") {
      this.pranksterSisterId = playerSisterId;
    } else if (rolePreference === "innocent") {
      const otherKeys = sisterKeys.filter((k) => k !== playerSisterId);
      this.pranksterSisterId = otherKeys[Math.floor(Math.random() * otherKeys.length)];
    } else {
      this.pranksterSisterId = sisterKeys[Math.floor(Math.random() * sisterKeys.length)];
    }

    // Pick Mummy
    const mummyKeys = ["RIDDHI_MUMMY", "SHRUTI_MUMMY", "JISHA_MUMMY", "JYEANA_MUMMY"];
    if (chosenMummyId === "RANDOM" || !MUMMIES[chosenMummyId]) {
      this.activeMummyId = mummyKeys[Math.floor(Math.random() * mummyKeys.length)];
    } else {
      this.activeMummyId = chosenMummyId;
    }
    this.mummy = new Mummy(MUMMIES[this.activeMummyId]);

    // Create 3D Mummy
    if (this.threeRenderer) {
      if (this.mummy3D) this.mummy3D.destroy();
      this.mummy3D = new Mummy3D(MUMMIES[this.activeMummyId], this.threeRenderer.scene);
    }

    // Create Player
    const pConfig = SISTERS[playerSisterId];
    this.player = new Player({
      ...pConfig,
      floor: 1,
      x: 500
    });
    this.player.role = (playerSisterId === this.pranksterSisterId) ? "prankster" : "innocent";

    // Create 3D Player
    if (this.threeRenderer) {
      if (this.player3D) this.player3D.destroy();
      this.player3D = new Player3D(pConfig, this.threeRenderer.scene);
    }

    // Create 4 AI Bots
    this.bots = [];
    this.bots3D.forEach(b3d => b3d.destroy());
    this.bots3D.clear();

    sisterKeys.forEach((key) => {
      if (key !== playerSisterId) {
        const bConfig = SISTERS[key];
        const bot = new Bot({
          ...bConfig,
          floor: Math.floor(Math.random() * 3),
          x: 200 + Math.random() * 800
        });
        bot.role = (key === this.pranksterSisterId) ? "prankster" : "innocent";
        this.bots.push(bot);

        if (this.threeRenderer) {
          const b3d = new Player3D(bConfig, this.threeRenderer.scene);
          this.bots3D.set(key, b3d);
        }
      }
    });

    this.taskManager.reset();
    this.taskManager.assignTasksForSister(playerSisterId, false);

    this.camera.setFloor(1);
    if (this.isoCamera) this.isoCamera.setFloor(1);
    this.updateHUDHeader();
    this.showIntroCutscene();
  }

  startMultiplayerRoundAsHost(hostSisterId, chosenMummyId = "RIDDHI_MUMMY", rolePreference = "random") {
    const hostLobbyEntry = this.multiplayer.lobbyPlayers.find(p => p.id === this.multiplayer.myPlayerId || p.isHost);
    const mySisterId = hostLobbyEntry ? hostLobbyEntry.sisterId : hostSisterId;
    this.selectedSisterId = mySisterId;

    const sisterKeys = Object.keys(SISTERS);
    const lobbyPlayers = this.multiplayer.lobbyPlayers;
    const humanSisterIds = lobbyPlayers.map(p => p.sisterId);

    if (rolePreference === "prankster") {
      this.pranksterSisterId = mySisterId;
    } else if (rolePreference === "innocent") {
      const otherKeys = sisterKeys.filter((k) => k !== mySisterId);
      this.pranksterSisterId = otherKeys[Math.floor(Math.random() * otherKeys.length)];
    } else {
      this.pranksterSisterId = sisterKeys[Math.floor(Math.random() * sisterKeys.length)];
    }

    const mummyKeys = ["RIDDHI_MUMMY", "SHRUTI_MUMMY", "JISHA_MUMMY", "JYEANA_MUMMY"];
    if (chosenMummyId === "RANDOM" || !MUMMIES[chosenMummyId]) {
      this.activeMummyId = mummyKeys[Math.floor(Math.random() * mummyKeys.length)];
    } else {
      this.activeMummyId = chosenMummyId;
    }
    this.mummy = new Mummy(MUMMIES[this.activeMummyId]);

    if (this.threeRenderer) {
      if (this.mummy3D) this.mummy3D.destroy();
      this.mummy3D = new Mummy3D(MUMMIES[this.activeMummyId], this.threeRenderer.scene);
    }

    const pConfig = SISTERS[mySisterId] || SISTERS.RIDDHI;
    this.player = new Player({
      ...pConfig,
      floor: 1,
      x: 500
    });
    this.player.role = (mySisterId === this.pranksterSisterId) ? "prankster" : "innocent";

    if (this.threeRenderer) {
      if (this.player3D) this.player3D.destroy();
      this.player3D = new Player3D(pConfig, this.threeRenderer.scene);
    }

    this.remotePlayers.clear();
    this.remotePlayers3D.forEach(rp3d => rp3d.destroy());
    this.remotePlayers3D.clear();
    this.bots = [];
    this.bots3D.forEach(b3d => b3d.destroy());
    this.bots3D.clear();

    sisterKeys.forEach((key) => {
      if (key !== mySisterId) {
        const isHuman = humanSisterIds.includes(key);
        const rConfig = SISTERS[key];
        if (isHuman) {
          const remotePlayer = new Player({
            ...rConfig,
            floor: 1,
            x: 600
          });
          remotePlayer.role = (key === this.pranksterSisterId) ? "prankster" : "innocent";
          this.remotePlayers.set(key, remotePlayer);

          if (this.threeRenderer) {
            const rp3d = new Player3D(rConfig, this.threeRenderer.scene);
            this.remotePlayers3D.set(key, rp3d);
          }
        } else {
          const bot = new Bot({
            ...rConfig,
            floor: Math.floor(Math.random() * 3),
            x: 200 + Math.random() * 800
          });
          bot.role = (key === this.pranksterSisterId) ? "prankster" : "innocent";
          this.bots.push(bot);

          if (this.threeRenderer) {
            const b3d = new Player3D(rConfig, this.threeRenderer.scene);
            this.bots3D.set(key, b3d);
          }
        }
      }
    });

    this.multiplayer.broadcast({
      type: 'START_GAME_SYNC',
      pranksterSisterId: this.pranksterSisterId,
      mummyId: this.activeMummyId,
      lobbyPlayers: this.multiplayer.lobbyPlayers
    });

    this.taskManager.reset();
    this.taskManager.assignTasksForSister(mySisterId, true);

    this.camera.setFloor(1);
    if (this.isoCamera) this.isoCamera.setFloor(1);
    this.updateHUDHeader();
    this.showIntroCutscene();
  }

  startMultiplayerRoundAsClient(data) {
    this.pranksterSisterId = data.pranksterSisterId;
    this.activeMummyId = data.mummyId || "RIDDHI_MUMMY";
    this.mummy = new Mummy(MUMMIES[this.activeMummyId]);

    if (this.threeRenderer) {
      if (this.mummy3D) this.mummy3D.destroy();
      this.mummy3D = new Mummy3D(MUMMIES[this.activeMummyId], this.threeRenderer.scene);
    }

    const myLobbyEntry = data.lobbyPlayers.find(p => p.id === this.multiplayer.myPlayerId);
    const mySisterId = myLobbyEntry ? myLobbyEntry.sisterId : this.selectedSisterId;
    this.selectedSisterId = mySisterId;

    const sisterKeys = Object.keys(SISTERS);
    const humanSisterIds = data.lobbyPlayers.map(p => p.sisterId);

    const pConfig = SISTERS[mySisterId] || SISTERS.RIDDHI;
    this.player = new Player({
      ...pConfig,
      floor: 1,
      x: 550
    });
    this.player.role = (mySisterId === this.pranksterSisterId) ? "prankster" : "innocent";

    if (this.threeRenderer) {
      if (this.player3D) this.player3D.destroy();
      this.player3D = new Player3D(pConfig, this.threeRenderer.scene);
    }

    this.remotePlayers.clear();
    this.remotePlayers3D.forEach(rp3d => rp3d.destroy());
    this.remotePlayers3D.clear();
    this.bots = [];
    this.bots3D.forEach(b3d => b3d.destroy());
    this.bots3D.clear();

    sisterKeys.forEach((key) => {
      if (key !== mySisterId) {
        const rConfig = SISTERS[key];
        if (humanSisterIds.includes(key)) {
          const remotePlayer = new Player({
            ...rConfig,
            floor: 1,
            x: 600
          });
          remotePlayer.role = (key === this.pranksterSisterId) ? "prankster" : "innocent";
          this.remotePlayers.set(key, remotePlayer);

          if (this.threeRenderer) {
            const rp3d = new Player3D(rConfig, this.threeRenderer.scene);
            this.remotePlayers3D.set(key, rp3d);
          }
        } else {
          const bot = new Bot({
            ...rConfig,
            floor: 1,
            x: 300 + Math.random() * 600
          });
          bot.role = (key === this.pranksterSisterId) ? "prankster" : "innocent";
          this.bots.push(bot);

          if (this.threeRenderer) {
            const b3d = new Player3D(rConfig, this.threeRenderer.scene);
            this.bots3D.set(key, b3d);
          }
        }
      }
    });

    this.taskManager.reset();
    this.taskManager.assignTasksForSister(mySisterId, true);

    document.getElementById('screen-lobby')?.classList.add('hidden');
    this.camera.setFloor(1);
    if (this.isoCamera) this.isoCamera.setFloor(1);
    this.updateHUDHeader();
    this.showIntroCutscene();
  }

  applyPranksterDebuffToInnocents(debuffType, floor, extraData = null) {
    this.bots.forEach((b) => {
      if (b.role === "innocent" && b.floor === floor) {
        if (debuffType === "SLEEP_CLOUD") {
          b.slowDebuffTimer = 8.0;
        } else if (debuffType === "PAINT_SPLATTER") {
          b.suspicion = Math.min(100, b.suspicion + 30);
        } else if (debuffType === "STICKY_GUM") {
          b.stickyTrapTimer = 5.0;
        } else if (debuffType === "FALSE_ALARM") {
          b.suspicion = Math.min(100, b.suspicion + 35);
          if (this.mummy) {
            this.mummy.investigateFloor(floor, b.x);
          }
        } else if (debuffType === "EMP_JAMMER") {
          b.glitchControlTimer = 6.0;
        }
      }
    });

    // 3D Visual Particle FX Triggers
    if (this.particles3D) {
      if (debuffType === "SLEEP_CLOUD") {
        this.particles3D.spawnSleepCloud(0, this.isoCamera.floorHeights[floor] || 0, 0, 8.0);
      } else if (debuffType === "STICKY_GUM" && extraData) {
        const c3d = this.coord2Dto3D(extraData.x, extraData.y, floor);
        this.particles3D.spawnStickyGumTrap(c3d.x, this.isoCamera.floorHeights[floor] || 0, c3d.z, 12.0);
      }
    }

    if (this.multiplayer && this.multiplayer.isMultiplayer) {
      this.multiplayer.send({
        type: 'PRANKSTER_DEBUFF',
        debuffType: debuffType,
        floor: floor,
        extraData: extraData
      });
    }
  }

  handleRemotePranksterDebuff(data) {
    if (this.player && this.player.role === "innocent") {
      if (data.debuffType === "SLEEP_CLOUD") {
        this.player.slowDebuffTimer = 8.0;
        this.showTopToast("😴 Sleep Cloud! You are drowsy and slowed by 60% for 8s!");
      } else if (data.debuffType === "PAINT_SPLATTER") {
        this.player.paintBlindTimer = 5.0;
        this.player.suspicion = Math.min(100, this.player.suspicion + 30);
        this.showTopToast("🎨 Paint Splatter! Your screen is blinded with Rangoli Paint!");
      } else if (data.debuffType === "STICKY_GUM") {
        this.player.stickyTrapTimer = 5.0;
        this.showTopToast("🦶 Trapped in Sticky Bubblegum! You cannot move for 5s!");
      } else if (data.debuffType === "FALSE_ALARM") {
        this.player.suspicion = Math.min(100, this.player.suspicion + 35);
        if (this.mummy) {
          this.mummy.investigateFloor(data.floor, this.player.x);
        }
        this.showTopToast("📢 False Alarm! Mummy is rushing to inspect you!");
      } else if (data.debuffType === "EMP_JAMMER") {
        this.player.glitchControlTimer = 6.0;
        this.player.taskFreezeTimer = 6.0;
        this.showTopToast("⚡ EMP Jammer! Your movement controls are GLITCHED & INVERTED for 6s!");
      }
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

    document.getElementById("game-hud")?.classList.remove("hidden");
    document.getElementById("floor-switcher")?.classList.remove("hidden");
    document.getElementById("touch-controls")?.classList.remove("hidden");

    if (this.player.role === "prankster") {
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
      if (this.player.role === "prankster") {
        roleBadge.className = "hud-badge role-badge imposter";
        roleBadge.innerHTML = `<span class="role-icon">😈</span><span class="role-text">Secret Prankster</span>`;
      } else {
        roleBadge.className = "hud-badge role-badge";
        roleBadge.innerHTML = `<span class="role-icon">😇</span><span class="role-text">Innocent Sister</span>`;
      }
    }

    if (charAvatar) charAvatar.innerText = this.player.avatar;
    if (charName) charName.innerText = this.player.name;

    if (powerName) {
      if (this.player.role === "prankster") {
        powerName.innerText = this.player.pranksterPower?.name || "Sabotage Power";
      } else {
        powerName.innerText = this.player.innocentPower?.name || "Power";
      }
    }
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
        this.player.handleInput(this.input, dt, this);
        this.updatePowerUI();

        // 3D Player Sync
        if (this.player3D) {
          const p3d = this.coord2Dto3D(this.player.x, this.player.y, this.player.floor);
          this.player3D.updatePosition(p3d.x, p3d.z, this.player.floor);
          this.player3D.update(dt, this.player.vx, this.player.vy, this.player.auraColor, this.player.stealthTimer > 0);

          // Update Flashlight spotlight cone during Blackouts
          if (this.lighting3D) {
            const isBlackoutActive = this.houseMap.isFloorBlackedOut(this.player.floor);
            this.lighting3D.setBlackout(isBlackoutActive);
            this.lighting3D.updateFlashlight(p3d.x, this.isoCamera.floorHeights[this.player.floor], p3d.z, this.player3D.facingAngle);
          }

          // Smooth Isometric Camera tracking
          if (this.isoCamera) {
            this.isoCamera.setFloor(this.player.floor);
            this.isoCamera.update(dt, { x: p3d.x, y: this.isoCamera.floorHeights[this.player.floor], z: p3d.z });
          }
        }

        // Network Position Broadcast
        this.posSyncInterval += dt;
        if (this.posSyncInterval > 0.06 && this.multiplayer.isMultiplayer) {
          this.posSyncInterval = 0;
          this.multiplayer.syncMyPosition(this.player);
        }

        // Detect current room & hotspots
        const room = this.houseMap.getRoomAt(this.player.x, this.player.y, this.player.floor);
        this.player.currentRoom = room;
        const roomLabel = document.getElementById("hud-room-name");
        if (roomLabel && room) roomLabel.innerText = room.name;

        this.activeNearbyHotspot = this.houseMap.getHotspotNear(this.player.x, this.player.y, this.player.floor);
        this.updateActionPrompt();

        if (this.input.consumeInteract() && this.activeNearbyHotspot) {
          this.handleHotspotInteraction(this.activeNearbyHotspot);
        }
        if (this.input.consumeAction()) {
          this.player.useAbility(this);
        }
      }

      // 2. AI Bots
      this.bots.forEach((bot) => {
        bot.updateAI(dt, this);
        if (this.bots3D.has(bot.id)) {
          const b3d = this.bots3D.get(bot.id);
          const pos = this.coord2Dto3D(bot.x, bot.y, bot.floor);
          b3d.updatePosition(pos.x, pos.z, bot.floor);
          b3d.update(dt, bot.vx, bot.vy, bot.auraColor, bot.stealthTimer > 0);
        }
      });

      // 3. Mummy Patrol & 3D FOV Cone
      if (this.mummy) {
        const allSisters = [this.player, ...Array.from(this.remotePlayers.values()), ...this.bots];
        this.mummy.update(dt, allSisters);
        this.updateMummyRadar();

        if (this.mummy3D) {
          const mpos = this.coord2Dto3D(this.mummy.x, this.mummy.y, this.mummy.floor);
          this.mummy3D.updatePosition(mpos.x, mpos.z, this.mummy.floor);
          const isAlarmed = this.mummy.floor === this.player.floor && Math.abs(this.mummy.x - this.player.x) < 220;
          this.mummy3D.update(dt, this.mummy.isMoving, this.mummy.facing, isAlarmed);

          // Flying Chappal Enrage Trigger
          if (this.mummy3D.isEnraged && !this.chappal3D.isActive && this.player.floor === this.mummy.floor) {
            this.soundboard.playVoiceLine("PAKDI_GAYI");
            const fromPos = this.mummy3D.mesh.position;
            const toPos = this.player3D.mesh.position;
            this.chappal3D.throw(fromPos, toPos, () => {
              this.soundboard.playChappalSlap();
              this.player.suspicion = 100;
              this.player.stickyTrapTimer = 4.0;
              this.showTopToast("🩴 MUMMY THREW HER CHAPPAL! You are STUNNED for 4s!");
              this.mummy3D.resetAnger();
            });
          }
        }
      }

      // 4. Update 3D Projectiles & Particles
      if (this.chappal3D) this.chappal3D.update(dt);
      if (this.particles3D) this.particles3D.update(dt);

      // 5. Sabotage System
      if (this.sabotageSystem) {
        this.sabotageSystem.update(dt);
      }

      this.updateScreenOverlays();
    }
  }

  updateScreenOverlays() {
    if (!this.player) return;

    const paintEl = document.getElementById("paint-splatter-overlay");
    const sleepEl = document.getElementById("sleep-fog-overlay");
    const glitchEl = document.getElementById("glitch-scanlines-overlay");
    const stickyEl = document.getElementById("sticky-trap-overlay");

    if (paintEl) {
      if (this.player.paintBlindTimer > 0) paintEl.classList.remove("hidden");
      else paintEl.classList.add("hidden");
    }

    if (sleepEl) {
      if (this.player.slowDebuffTimer > 0) sleepEl.classList.remove("hidden");
      else sleepEl.classList.add("hidden");
    }

    if (glitchEl) {
      if (this.player.glitchControlTimer > 0) glitchEl.classList.remove("hidden");
      else glitchEl.classList.add("hidden");
    }

    if (stickyEl) {
      if (this.player.stickyTrapTimer > 0) stickyEl.classList.remove("hidden");
      else stickyEl.classList.add("hidden");
    }
  }

  updatePowerUI() {
    const powerBtn = document.getElementById("btn-use-power");
    const cdLabel = document.getElementById("hud-power-cd");
    const touchPowerBtn = document.getElementById("btn-touch-power");
    const powerNameEl = document.getElementById("hud-power-name");

    if (this.player) {
      const activePower = (this.player.role === "prankster") ? this.player.pranksterPower : this.player.innocentPower;
      if (powerNameEl && activePower) {
        powerNameEl.innerText = activePower.name;
      }

      if (powerBtn) {
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

    if (this.activeNearbyHotspot && this.canvas) {
      prompt.classList.remove("hidden");
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = rect.width / this.canvas.width;
      const scaleY = rect.height / this.canvas.height;
      const screenX = rect.left + this.activeNearbyHotspot.x * scaleX;
      const screenY = rect.top + (this.activeNearbyHotspot.y - 15) * scaleY;

      prompt.style.left = `${screenX}px`;
      prompt.style.top = `${screenY}px`;

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
      if (this.isoCamera) this.isoCamera.setFloor(hs.targetFloor);
      if (this.player3D) this.player3D.setFloor(hs.targetFloor);
      this.updateFloorButtonsUI(hs.targetFloor);
      this.audio.playStairTransition();
    } else if (hs.taskId) {
      this.taskManager.openTask(hs.taskId);
    }
  }

  triggerWin(reason) {
    if (this.state === "GAMEOVER") return;
    this.state = "GAMEOVER";
    this.audio.playVictory();

    const screen = document.getElementById("screen-gameover");
    const banner = document.getElementById("gameover-banner");
    const sub = document.getElementById("gameover-subtitle");
    const pranksterReveal = document.getElementById("gameover-imposter-reveal");
    const outcome = document.getElementById("gameover-story-outcome");
    const statTasks = document.getElementById("stat-tasks-done");
    const statClean = document.getElementById("stat-clean-pct");

    if (banner) banner.innerText = "🎉 INNOCENTS WIN! 🎉";
    if (reason === "PRANKSTER_EJECTED") {
      if (sub) sub.innerText = "The Secret Prankster Was Unmasked!";
      if (outcome) outcome.innerText = "Mummy caught the Prankster and returned everyone's phones with fresh jalebis & kaju katli!";
    } else {
      if (sub) sub.innerText = "The House is 100% Sparkling Clean!";
      if (outcome) outcome.innerText = "Mummy inspected all 3 floors and returned all 5 phones on time!";
    }

    const pranksterChar = SISTERS[this.pranksterSisterId];
    if (pranksterReveal && pranksterChar) pranksterReveal.innerText = pranksterChar.name;
    if (statTasks) statTasks.innerText = this.taskManager.tasksCompletedCount;
    if (statClean) statClean.innerText = `${Math.round(this.taskManager.cleanliness)}%`;

    screen.classList.remove("hidden");
  }

  triggerDefeat(reason) {
    if (this.state === "GAMEOVER") return;
    this.state = "GAMEOVER";
    this.audio.playDefeat();

    const screen = document.getElementById("screen-gameover");
    const banner = document.getElementById("gameover-banner");
    const sub = document.getElementById("gameover-subtitle");
    const pranksterReveal = document.getElementById("gameover-imposter-reveal");
    const outcome = document.getElementById("gameover-story-outcome");

    if (banner) banner.innerText = "😈 PRANKSTER WINS! 😈";
    if (reason === "CRITICAL_SABOTAGE_EXPIRED") {
      if (sub) sub.innerText = "Critical Sabotage Expired (Fuse Overheat)!";
      if (outcome) outcome.innerText = "Innocents failed to repair the switchboard! Mummy blamed the innocent sisters while the Prankster won!";
    } else {
      if (sub) sub.innerText = "The Prankster Framed the Innocent Sisters!";
      if (outcome) outcome.innerText = "The Prankster tricked Mummy! The framed innocent sister gets deep-cleaning chore punishment while the Prankster relaxes!";
    }

    const pranksterChar = SISTERS[this.pranksterSisterId];
    if (pranksterReveal && pranksterChar) pranksterReveal.innerText = pranksterChar.name;

    screen.classList.remove("hidden");
  }

  render() {
    if (this.threeRenderer) {
      this.threeRenderer.render();
    }
  }
}
