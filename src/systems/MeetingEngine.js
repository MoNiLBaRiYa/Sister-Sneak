/**
 * Sister Sneak: Phone Locked - Meeting & Courtroom Engine
 * Orchestrates emergency meetings, Gujlish debates, live multiplayer chat, voting, and Mummy verdicts.
 */

import { DIALOGUES } from '../config/dialogues.js';

export class MeetingEngine {
  constructor(game) {
    this.game = game;
    this.isActive = false;
    this.votes = {};
    this.voteTimer = 25;
    this.timerInterval = null;
    this.hasVoted = false;
    this.jishaShieldUsed = false;

    this.bindUI();
  }

  bindUI() {
    const btnSkip = document.getElementById("btn-skip-vote");
    const btnVerdictCont = document.getElementById("btn-verdict-continue");
    const btnChatSend = document.getElementById("btn-meeting-chat-send");
    const chatInput = document.getElementById("meeting-chat-input");

    if (btnSkip) {
      btnSkip.addEventListener("click", () => {
        this.castVote("SKIP");
      });
    }

    if (btnVerdictCont) {
      btnVerdictCont.addEventListener("click", () => {
        this.closeVerdict();
      });
    }

    // Chat Send button
    if (btnChatSend && chatInput) {
      btnChatSend.addEventListener("click", () => {
        this.submitChat();
      });

      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          this.submitChat();
        }
      });
    }

    // Quick Chat Chips
    const qcChips = document.querySelectorAll(".qc-chip");
    qcChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const msg = chip.getAttribute("data-msg");
        if (msg) {
          this.sendChatMessage(msg);
        }
      });
    });
  }

  submitChat() {
    const input = document.getElementById("meeting-chat-input");
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    this.sendChatMessage(text);
  }

  sendChatMessage(text) {
    if (!this.game.player) return;
    const player = this.game.player;
    this.appendChatMessage(player.name, player.avatar, player.color, text, true);

    if (this.game.multiplayer && this.game.multiplayer.isMultiplayer) {
      this.game.multiplayer.sendChat(text, player.id, player.name, player.avatar, player.color);
    }
  }

  receiveRemoteChatMessage(data) {
    this.appendChatMessage(data.senderName, data.avatar || "👧", data.color || "#F59E0B", data.text, false);
  }

  appendChatMessage(name, avatar, color, text, isMe) {
    const log = document.getElementById("debate-log");
    if (!log) return;

    const entry = document.createElement("div");
    entry.className = `log-entry ${isMe ? 'my-chat-entry' : ''}`;
    entry.innerHTML = `
      <span class="log-avatar">${avatar}</span>
      <strong class="log-speaker" style="color:${color};">${name}${isMe ? ' (You)' : ''}:</strong>
      <span class="log-text">"${text}"</span>
    `;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
  }

  getAllSisters() {
    const remotes = Array.from(this.game.remotePlayers ? this.game.remotePlayers.values() : []);
    const player = this.game.player ? [this.game.player] : [];
    const bots = this.game.bots || [];
    return [...player, ...remotes, ...bots];
  }

  startMeeting(reason = "Sabotage Discovered!") {
    if (this.isActive) return;
    this.isActive = true;
    this.hasVoted = false;
    this.votes = {};
    this.voteTimer = 25;

    this.game.audio.playMeetingGong();
    this.game.teleportAllToCentralHall();

    const screen = document.getElementById("screen-meeting");
    const reasonHeader = document.getElementById("meeting-trigger-reason");
    const mummyName = document.getElementById("court-mummy-name");
    const mummyPortrait = document.getElementById("court-mummy-portrait");
    const mummyDialogue = document.getElementById("mummy-dialogue-bubble");

    if (reasonHeader) reasonHeader.innerText = reason;
    if (mummyName) mummyName.innerText = this.game.mummy.name;
    if (mummyPortrait) mummyPortrait.innerText = this.game.mummy.avatar;
    if (mummyDialogue) mummyDialogue.innerText = `"${this.game.mummy.dialogues.meeting}"`;

    this.populateDebateGrid();
    this.populateDebateLog();

    screen.classList.remove("hidden");

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.voteTimer--;
      const timeVal = document.getElementById("vote-timer-val");
      if (timeVal) timeVal.innerText = `${this.voteTimer}s`;

      if (this.voteTimer <= 0) {
        clearInterval(this.timerInterval);
        this.tallyVotes();
      }
    }, 1000);
  }

  populateDebateGrid() {
    const grid = document.getElementById("debate-sisters-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const allSisters = this.getAllSisters();

    allSisters.forEach((s) => {
      const lineObj = this.game.dialogueEngine.getRandomDebateLine(s.id);
      const isPlayer = s === this.game.player;

      const card = document.createElement("div");
      card.className = `debate-sister-card ${s.isEjected ? 'ejected' : ''}`;
      card.innerHTML = `
        <div class="debate-sister-header">
          <span class="debate-sister-avatar">${s.avatar}</span>
          <span class="debate-sister-name">${s.name} ${isPlayer ? '(You)' : ''}</span>
        </div>
        <div class="debate-alibi">
          "${lineObj.text}"
          <div style="font-size:9px; color:#888; margin-top:2px;">(${lineObj.trans})</div>
        </div>
        <div class="suspicion-meter-mini">
          <span>Suspicion:</span>
          <div class="susp-bar"><div class="susp-fill" style="width:${Math.round(s.suspicion)}%"></div></div>
        </div>
        ${!s.isEjected ? `<button class="btn-vote-sister" data-id="${s.id}">Vote ${s.name}</button>` : '<span style="font-size:10px; color:#999;">Already punished</span>'}
      `;

      const voteBtn = card.querySelector(".btn-vote-sister");
      if (voteBtn) {
        voteBtn.addEventListener("click", () => {
          this.castVote(s.id);
        });
      }

      grid.appendChild(card);
    });
  }

  populateDebateLog() {
    const log = document.getElementById("debate-log");
    if (!log) return;
    log.innerHTML = `<div class="log-entry system-entry">⚠️ Emergency Meeting called. Discuss and vote who the Imposter is!</div>`;

    const allSisters = this.getAllSisters();
    allSisters.forEach((s, idx) => {
      setTimeout(() => {
        if (!this.isActive) return;
        const line = this.game.dialogueEngine.getRandomDebateLine(s.id);
        this.appendChatMessage(s.name, s.avatar, s.color, line.text, s === this.game.player);
      }, (idx + 1) * 1500);
    });
  }

  castVote(targetId) {
    if (this.hasVoted) return;
    this.hasVoted = true;

    // Record local player's vote
    this.votes[this.game.player.id] = targetId;

    if (this.game.multiplayer && this.game.multiplayer.isMultiplayer) {
      this.game.multiplayer.syncVote(this.game.player.id, targetId);
    }

    // AI bot automated votes
    this.game.bots.forEach((bot) => {
      if (bot.isEjected) return;
      const candidates = this.getAllSisters().filter((s) => !s.isEjected);
      if (Math.random() < 0.3) {
        this.votes[bot.id] = "SKIP";
      } else {
        candidates.sort((a, b) => b.suspicion - a.suspicion);
        this.votes[bot.id] = candidates[0].id;
      }
    });

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.tallyVotes();
  }

  tallyVotes() {
    const counts = {};
    Object.values(this.votes).forEach((target) => {
      if (target !== "SKIP") {
        counts[target] = (counts[target] || 0) + 1;
      }
    });

    let maxVotes = 0;
    let ejectedId = null;
    let tie = false;

    Object.keys(counts).forEach((id) => {
      if (counts[id] > maxVotes) {
        maxVotes = counts[id];
        ejectedId = id;
        tie = false;
      } else if (counts[id] === maxVotes) {
        tie = true;
      }
    });

    // Check Jisha's Imposter Power: Innocent Shield (auto-cancel first vote)
    if (ejectedId === "JISHA" && this.game.imposterSisterId === "JISHA" && !this.jishaShieldUsed) {
      this.jishaShieldUsed = true;
      ejectedId = null;
    }

    if (tie || !ejectedId || maxVotes < 2) {
      this.showVerdict(null, "No consensus reached! Everyone go back to cleaning!");
    } else {
      const allSisters = this.getAllSisters();
      const ejectedChar = allSisters.find((s) => s.id === ejectedId);
      if (ejectedChar) {
        ejectedChar.isEjected = true;
        const isImposter = (ejectedChar.id === this.game.imposterSisterId);
        this.showVerdict(ejectedChar, isImposter ? "Unmasked the Imposter!" : "An Innocent sister was framed!");
      }
    }
  }

  showVerdict(ejectedSister, outcomeText) {
    const meetingScreen = document.getElementById("screen-meeting");
    const verdictScreen = document.getElementById("screen-verdict");
    const spotlight = document.getElementById("verdict-spotlight");
    const dialogue = document.getElementById("verdict-dialogue");

    if (meetingScreen) meetingScreen.classList.add("hidden");
    if (verdictScreen) verdictScreen.classList.remove("hidden");

    if (ejectedSister) {
      const isImposter = (ejectedSister.id === this.game.imposterSisterId);
      spotlight.innerHTML = `
        <div style="font-size:56px;">${ejectedSister.avatar}</div>
        <h3 style="color:${isImposter ? '#10B981' : '#EF4444'}; font-size:20px; margin-top:8px;">
          ${ejectedSister.name} was ${isImposter ? 'THE IMPOSTER! 🎉' : 'INNOCENT! 😢'}
        </h3>
      `;
      dialogue.innerText = `"${this.game.mummy.dialogues.verdictPunish}"`;

      if (isImposter) {
        setTimeout(() => {
          this.closeVerdict();
          this.game.triggerWin("VOTED_IMPOSTER");
        }, 3000);
        return;
      }
    } else {
      spotlight.innerHTML = `<div style="font-size:56px;">🤷‍♀️</div><h3>No Sister Punished</h3>`;
      dialogue.innerText = `"Koi saboot nathi! Safai chalu rakho!" (No clear evidence! Continue chores!)`;
    }
  }

  closeVerdict() {
    this.isActive = false;
    const verdictScreen = document.getElementById("screen-verdict");
    if (verdictScreen) verdictScreen.classList.add("hidden");
  }
}
