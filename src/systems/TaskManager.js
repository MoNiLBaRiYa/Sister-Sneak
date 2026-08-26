/**
 * Sister Sneak: Phone Locked - Task Manager System
 * Manages task registry, mini-game execution, and Cleanliness Meter.
 * Synchronizes cleanliness across all online multiplayer peers.
 */

import { ClothesTask } from '../minigames/ClothesTask.js';
import { FridgeTask } from '../minigames/FridgeTask.js';
import { BedsheetTask } from '../minigames/BedsheetTask.js';
import { SwitchesTask } from '../minigames/SwitchesTask.js';
import { FootwearTask } from '../minigames/FootwearTask.js';
import { AcharTask } from '../minigames/AcharTask.js';
import { GlasswareTask } from '../minigames/GlasswareTask.js';
import { WateringTask } from '../minigames/WateringTask.js';

export class TaskManager {
  constructor(game) {
    this.game = game;
    this.cleanliness = 0; // 0% to 100%
    this.tasksCompletedCount = 0;
    this.activeMiniGame = null;

    this.miniGameMap = {
      CLOTHES_COLLECT: ClothesTask,
      FRIDGE_REFILL: FridgeTask,
      BEDSHEET_TUCK: BedsheetTask,
      SWITCHES_OFF: SwitchesTask,
      FOOTWEAR_MATCH: FootwearTask,
      ACHAR_HUNT: AcharTask,
      GLASSWARE_ALIGN: GlasswareTask,
      PLANT_WATER: WateringTask,
      TANK_VALVE: FridgeTask,
      SNACK_RAID: AcharTask,
      HOMEWORK: SwitchesTask
    };

    this.bindUI();
  }

  bindUI() {
    const closeBtn = document.getElementById("btn-close-minigame");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.closeMiniGame();
      });
    }
  }

  contributeCleanliness(amount) {
    this.cleanliness = Math.min(100, Math.max(0, this.cleanliness + amount));
    this.updateHUD();

    if (this.game.multiplayer && this.game.multiplayer.isMultiplayer) {
      this.game.multiplayer.syncCleanliness(this.cleanliness);
    }

    if (this.cleanliness >= 100) {
      this.game.triggerWin("CLEANLINESS_100");
    }
  }

  reduceCleanliness(amount) {
    this.cleanliness = Math.max(0, this.cleanliness - amount);
    this.updateHUD();

    if (this.game.multiplayer && this.game.multiplayer.isMultiplayer) {
      this.game.multiplayer.syncCleanliness(this.cleanliness);
    }
  }

  updateHUD() {
    const text = document.getElementById("cleanliness-text");
    const fill = document.getElementById("cleanliness-fill");
    if (text) text.innerText = `${Math.round(this.cleanliness)}%`;
    if (fill) fill.style.width = `${Math.round(this.cleanliness)}%`;
  }

  openTask(taskId) {
    if (this.activeMiniGame) return;

    // Check if floor is blacked out
    if (this.game.houseMap.isFloorBlackedOut(this.game.player.floor)) {
      alert("⚡ Power blackout on this floor! Fix the fuse box or wait for power before doing tasks!");
      return;
    }

    const TaskClass = this.miniGameMap[taskId] || ClothesTask;
    this.activeMiniGame = new TaskClass();

    const screen = document.getElementById("screen-minigame");
    const title = document.getElementById("mg-title");
    const icon = document.getElementById("mg-icon");
    const instructions = document.getElementById("mg-instructions");
    const viewport = document.getElementById("minigame-viewport");
    const fill = document.getElementById("mg-progress-fill");

    if (title) title.innerText = this.activeMiniGame.title;
    if (icon) icon.innerText = this.activeMiniGame.icon;
    if (instructions) instructions.innerText = this.activeMiniGame.instructions;
    if (fill) fill.style.width = "0%";

    screen.classList.remove("hidden");
    this.game.audio.playClick();

    this.activeMiniGame.start(
      viewport,
      () => {
        // Task completed successfully
        this.tasksCompletedCount++;
        this.game.audio.playTaskComplete();

        // Bonus speed or boost from characters
        let cleanBonus = 15;
        if (this.game.player.id === "SHRUTI" && (taskId === "BEDSHEET_TUCK" || taskId === "GLASSWARE_ALIGN")) {
          cleanBonus = 25; // Shruti's Artistic Flow
        }

        this.contributeCleanliness(cleanBonus);
        setTimeout(() => {
          this.closeMiniGame();
        }, 500);
      },
      () => {
        this.closeMiniGame();
      }
    );
  }

  closeMiniGame() {
    if (this.activeMiniGame) {
      this.activeMiniGame.destroy();
      this.activeMiniGame = null;
    }
    const screen = document.getElementById("screen-minigame");
    if (screen) screen.classList.add("hidden");
  }
}
