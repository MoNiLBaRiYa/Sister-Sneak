/**
 * Sister Sneak: Phone Locked - Dialogue Engine
 * Renders typewriter text, speaker portraits, and Gujlish translations.
 */

import { DIALOGUES } from '../config/dialogues.js';

export class DialogueEngine {
  constructor() {
    this.dialogues = DIALOGUES;
  }

  getRandomDebateLine(sisterId) {
    const list = this.dialogues.DEBATE_LINES[sisterId] || [];
    if (list.length === 0) {
      return { text: "Hu toh chupchap safai karti hati!", trans: "I was just quietly cleaning!" };
    }
    return list[Math.floor(Math.random() * list.length)];
  }
}
