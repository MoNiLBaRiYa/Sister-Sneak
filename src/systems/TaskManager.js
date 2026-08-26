/**
 * Sister Sneak: Phone Locked - Task Manager System
 * 18 Distinct Interactive Chores Across 3 Floors with Balanced Progress.
 */

import { ClothesTask } from '../minigames/ClothesTask.js';
import { FridgeTask } from '../minigames/FridgeTask.js';
import { BedsheetTask } from '../minigames/BedsheetTask.js';
import { SwitchesTask } from '../minigames/SwitchesTask.js';
import { FootwearTask } from '../minigames/FootwearTask.js';
import { AcharTask } from '../minigames/AcharTask.js';
import { GlasswareTask } from '../minigames/GlasswareTask.js';
import { WateringTask } from '../minigames/WateringTask.js';
import { PapadTask } from '../minigames/PapadTask.js';
import { SolarPanelTask } from '../minigames/SolarPanelTask.js';
import { KiteTask } from '../minigames/KiteTask.js';
import { SpiceRackTask } from '../minigames/SpiceRackTask.js';
import { ChaiTask } from '../minigames/ChaiTask.js';
import { KhakhraTask } from '../minigames/KhakhraTask.js';
import { HomeworkTask } from '../minigames/HomeworkTask.js';
import { RangoliTask } from '../minigames/RangoliTask.js';
import { TrunkLockTask } from '../minigames/TrunkLockTask.js';

export class TaskManager {
  constructor(game) {
    this.game = game;
    this.cleanliness = 0; // 0% to 100%
    this.tasksCompletedCount = 0;
    this.activeMiniGame = null;
    this.completedTasks = new Set(); // Stores completed taskId strings

    this.miniGameMap = {
      // 3F Terrace
      CLOTHES_COLLECT: ClothesTask,
      KITE_UNTANGLE: KiteTask,
      TANK_VALVE: FridgeTask,
      PAPAD_DRY: PapadTask,
      SOLAR_PANEL: SolarPanelTask,

      // 2F Living Hub
      PLANT_WATER: WateringTask,
      BEDSHEET_TUCK: BedsheetTask,
      HOMEWORK_MATH: HomeworkTask,
      SPICE_RACK: SpiceRackTask,
      FRIDGE_REFILL: FridgeTask,
      CHAI_FILTER: ChaiTask,
      SNACK_CONTAINER: KhakhraTask,

      // 1F Ground Floor
      FOOTWEAR_MATCH: FootwearTask,
      RANGOLI_TOUCHUP: RangoliTask,
      ACHAR_HUNT: AcharTask,
      TRUNK_LOCK: TrunkLockTask,
      GLASSWARE_ALIGN: GlasswareTask,
      SWITCHES_OFF: SwitchesTask
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

  reset() {
    this.cleanliness = 0;
    this.tasksCompletedCount = 0;
    this.completedTasks.clear();
    this.updateHUD();
  }

  isTaskCompleted(taskId) {
    return this.completedTasks.has(taskId);
  }

  markTaskCompleted(taskId) {
    this.completedTasks.add(taskId);
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
    if (text) text.innerText = `${Math.round(this.cleanliness)}% (${this.completedTasks.size} / 17 Chores)`;
    if (fill) fill.style.width = `${Math.round(this.cleanliness)}%`;
  }

  openTask(taskId) {
    if (this.activeMiniGame) return;

    // Check if task is already completed
    if (this.isTaskCompleted(taskId)) {
      this.game.audio.playClick();
      alert("✨ This chore is already 100% clean & completed! Look for other pending chores in the house.");
      return;
    }

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
        this.markTaskCompleted(taskId);
        this.game.audio.playTaskComplete();

        // Balanced Cleanliness contribution (~6% per task across 17 tasks)
        let cleanBonus = 6.0;
        if (this.game.player.id === "SHRUTI" && (taskId === "BEDSHEET_TUCK" || taskId === "GLASSWARE_ALIGN" || taskId === "RANGOLI_TOUCHUP")) {
          cleanBonus = 9.0; // Shruti's Artistic Flow perk
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
