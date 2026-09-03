/**
 * Sister Sneak: Phone Locked - Task Manager System
 * Manages personal task checklists for each sister (Among Us style),
 * tracks completion across all 3 floors, and executes multi-step interactive mini-games.
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
import { HOTSPOTS } from '../config/constants.js';

export class TaskManager {
  constructor(game) {
    this.game = game;
    this.cleanliness = 0;
    this.tasksCompletedCount = 0;
    this.activeMiniGame = null;
    this.completedTasks = new Set();
    this.assignedTasks = new Set();

    this.miniGameMap = {
      // 3F Terrace
      CLOTHES_COLLECT: ClothesTask,
      SOLAR_PANEL: SolarPanelTask,
      KITE_UNTANGLE: KiteTask,
      PAPAD_DRY: PapadTask,

      // 2F Living Hub
      PLANT_WATER: WateringTask,
      HOMEWORK_MATH: HomeworkTask,
      BEDSHEET_TUCK: BedsheetTask,
      SWITCHES_OFF: SwitchesTask,
      SPICE_RACK: SpiceRackTask,
      FRIDGE_REFILL: FridgeTask,
      SNACK_CONTAINER: KhakhraTask,

      // 1F Ground Floor
      CHAI_FILTER: ChaiTask,
      RANGOLI_TOUCHUP: RangoliTask,
      FOOTWEAR_MATCH: FootwearTask,
      ACHAR_HUNT: AcharTask,
      TRUNK_LOCK: TrunkLockTask,
      GLASSWARE_ALIGN: GlasswareTask
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

    const toggleBtn = document.getElementById("btn-toggle-tasklist");
    const drawer = document.getElementById("tasklist-drawer");
    if (toggleBtn && drawer) {
      toggleBtn.addEventListener("click", () => {
        drawer.classList.toggle("collapsed");
      });
    }
  }

  assignTasksForSister(sisterId, isMultiplayer = false) {
    this.assignedTasks.clear();
    const allTaskHotspots = HOTSPOTS.filter(hs => hs.taskId);

    if (!isMultiplayer) {
      allTaskHotspots.forEach(hs => this.assignedTasks.add(hs.taskId));
    } else {
      const sisterTaskPreferences = {
        RIDDHI: ["BEDSHEET_TUCK", "CLOTHES_COLLECT", "PLANT_WATER", "CHAI_FILTER"],
        SHRUTI: ["RANGOLI_TOUCHUP", "CHAI_FILTER", "BEDSHEET_TUCK", "SOLAR_PANEL"],
        JAHANVI: ["CLOTHES_COLLECT", "FOOTWEAR_MATCH", "SWITCHES_OFF", "ACHAR_HUNT"],
        JISHA: ["HOMEWORK_MATH", "PLANT_WATER", "CHAI_FILTER", "ACHAR_HUNT"],
        JYEANA: ["SWITCHES_OFF", "SOLAR_PANEL", "FOOTWEAR_MATCH", "HOMEWORK_MATH"]
      };

      const myPool = sisterTaskPreferences[sisterId] || ["BEDSHEET_TUCK", "PLANT_WATER", "SWITCHES_OFF", "CLOTHES_COLLECT"];
      myPool.forEach(t => this.assignedTasks.add(t));
    }

    this.updateTasklistDrawer();
  }

  reset() {
    this.cleanliness = 0;
    this.tasksCompletedCount = 0;
    this.completedTasks.clear();
    this.assignedTasks.clear();
    this.updateHUD();
  }

  isTaskCompleted(taskId) {
    return this.completedTasks.has(taskId);
  }

  markTaskCompleted(taskId) {
    this.completedTasks.add(taskId);
    this.updateHUD();
    this.updateTasklistDrawer();
  }

  contributeCleanliness(amount, taskId = null) {
    this.cleanliness = Math.min(100, Math.max(0, this.cleanliness + amount));
    this.updateHUD();

    if (this.game.multiplayer && this.game.multiplayer.isMultiplayer) {
      this.game.multiplayer.syncCleanliness(this.cleanliness, taskId);
    }

    if (this.cleanliness >= 100) {
      this.game.triggerWin("ALL_TASKS_COMPLETED");
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

  updateTasklistDrawer() {
    const listEl = document.getElementById("player-tasks-list");
    if (!listEl) return;
    listEl.innerHTML = "";

    const allTaskHotspots = HOTSPOTS.filter(hs => hs.taskId && this.assignedTasks.has(hs.taskId));

    allTaskHotspots.forEach((hs) => {
      const isDone = this.isTaskCompleted(hs.taskId);
      const floorLabel = hs.floor === 2 ? "3F" : hs.floor === 1 ? "2F" : "1F";

      const item = document.createElement("div");
      item.className = `task-checklist-item ${isDone ? 'completed' : ''}`;
      item.innerHTML = `
        <span class="task-check-icon">${isDone ? '✅' : '⬜'}</span>
        <span class="task-check-floor">${floorLabel}</span>
        <span class="task-check-name">${hs.label}</span>
      `;
      listEl.appendChild(item);
    });

    const myDone = allTaskHotspots.filter(h => this.isTaskCompleted(h.taskId)).length;
    const countBadge = document.getElementById("my-tasks-count");
    if (countBadge) countBadge.innerText = `${myDone} / ${allTaskHotspots.length}`;
  }

  openTask(taskId) {
    if (this.activeMiniGame) return;

    if (this.isTaskCompleted(taskId)) {
      this.game.audio.playClick();
      this.game.showTopToast("✨ This chore is already sparkling clean!");
      return;
    }

    if (this.game.houseMap.isFloorBlackedOut(this.game.player.floor) && taskId !== "SWITCHES_OFF") {
      this.game.showTopToast("⚡ Power blackout! Fix the fuse box switchboard first!");
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
        this.tasksCompletedCount++;
        this.markTaskCompleted(taskId);
        this.game.audio.playTaskComplete();

        if (taskId === "SWITCHES_OFF" || taskId === "SOLAR_PANEL") {
          this.game.sabotageSystem?.resolveCriticalSabotage();
        }

        let cleanBonus = 12.5;
        if (this.game.player.id === "SHRUTI" && (taskId === "BEDSHEET_TUCK" || taskId === "RANGOLI_TOUCHUP")) {
          cleanBonus = 18.0;
        }

        this.contributeCleanliness(cleanBonus, taskId);
        setTimeout(() => {
          this.closeMiniGame();
        }, 300);
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
