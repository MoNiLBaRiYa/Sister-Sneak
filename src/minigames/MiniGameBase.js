/**
 * Sister Sneak: Phone Locked - Mini-Game Base Class
 * Standard interface for all chore mini-games.
 */

export class MiniGameBase {
  constructor(config = {}) {
    this.id = config.id || "MINI_GAME";
    this.title = config.title || "Chore Task";
    this.icon = config.icon || "✨";
    this.instructions = config.instructions || "Complete the chore!";
    this.container = null;
    this.onCompleteCallback = null;
    this.onCancelCallback = null;
    this.isFinished = false;
    this.progress = 0; // 0 to 1
  }

  start(container, onComplete, onCancel) {
    this.container = container;
    this.onCompleteCallback = onComplete;
    this.onCancelCallback = onCancel;
    this.isFinished = false;
    this.progress = 0;
    this.container.innerHTML = "";
    this.render();
  }

  render() {
    // Override in subclasses
  }

  updateProgress(val) {
    this.progress = Math.max(0, Math.min(1, val));
    const fill = document.getElementById("mg-progress-fill");
    if (fill) {
      fill.style.width = `${Math.round(this.progress * 100)}%`;
    }
    if (this.progress >= 1.0 && !this.isFinished) {
      this.complete();
    }
  }

  complete() {
    if (this.isFinished) return;
    this.isFinished = true;
    if (this.onCompleteCallback) {
      this.onCompleteCallback();
    }
  }

  cancel() {
    if (this.onCancelCallback) {
      this.onCancelCallback();
    }
  }

  destroy() {
    if (this.container) {
      this.container.innerHTML = "";
    }
  }
}
