/**
 * Sister Sneak: Phone Locked - Among Us Style Meeting & Courtroom Engine
 * Implements 2-Phase Emergency Meetings (Discussion Phase -> Voting Phase -> Vote Reveal -> Ejection Verdict)
 * with real-time multiplayer chat, bots voting, alibi dialogue logs, and win/loss resolution.
 */

import { DIALOGUES } from '../config/dialogues.js';

export class MeetingEngine {
  constructor(game) {
    this.game = game;
    this.isActive = false;
    this.phase = "IDLE"; // "DISCUSSION", "VOTING", "REVEAL", "VERDICT"
    this.discussionTimer = 12;
    this.votingTimer = 25;
    this.timerInterval = null;
    this.votes = {};      // { sisterId: targetId }
    this.votedSisters = new Set();
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
        if (this.phase === "VOTING") {
          this.castVote("SKIP");
        }
      });
    }

    if (btnVerdictCont) {
      btnVerdictCont.addEventListener("click", () => {
        this.closeVerdict();
      });
    }

    if (btnChatSend && chatInput) {
      btnChatSend.addEventListener("click", () => this.submitChat());
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") this.submitChat();
      });
    }

    // Quick Chat Chips
    const qcChips = document.querySelectorAll(".qc-chip");
    qcChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const msg = chip.getAttribute("data-msg");
        if (msg) this.sendChatMessage(msg);
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

  getLivingSisters() {
    return this.getAllSisters().filter(s => !s.isEjected);
  }

  startMeeting(reason = "Emergency Meeting Called!") {
    if (this.isActive) return;
    this.isActive = true;
    this.votes = {};
    this.votedSisters.clear();
    this.discussionTimer = 12;
    this.votingTimer = 25;

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

    screen.classList.remove("hidden");

    this.populateDebateLog();
    this.startDiscussionPhase();
  }

  // Phase 1: Discussion Phase (Chat open, voting locked)
  startDiscussionPhase() {
    this.phase = "DISCUSSION";
    this.populateDebateGrid(false);

    const timerBadge = document.getElementById("meeting-timer");
    const skipBtn = document.getElementById("btn-skip-vote");
    if (skipBtn) skipBtn.disabled = true;

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.discussionTimer--;
      if (timerBadge) {
        timerBadge.innerHTML = `🗣️ Discussion: <span id="vote-timer-val" style="color:#38BDF8;">${this.discussionTimer}s</span> (Voting locked)`;
      }

      if (this.discussionTimer <= 0) {
        clearInterval(this.timerInterval);
        this.startVotingPhase();
      }
    }, 1000);
  }

  // Phase 2: Voting Phase (Voting unlocked with secret checkmarks)
  startVotingPhase() {
    this.phase = "VOTING";
    this.populateDebateGrid(true);

    const skipBtn = document.getElementById("btn-skip-vote");
    if (skipBtn) skipBtn.disabled = false;

    // Trigger realistic, fair AI Bots automated votes during voting window
    this.game.bots.forEach((bot, idx) => {
      if (bot.isEjected) return;
      setTimeout(() => {
        if (this.phase !== "VOTING" || this.votedSisters.has(bot.id)) return;

        // Living other sisters (NEVER vote for self)
        const others = this.getLivingSisters().filter(s => s.id !== bot.id);
        if (others.length === 0) {
          this.recordVote(bot.id, "SKIP");
          return;
        }

        const isBotPrankster = (bot.role === "prankster");

        if (isBotPrankster) {
          // PRANKSTER BOT AI: Tries to blame an innocent sister or skips
          if (Math.random() < 0.35) {
            this.recordVote(bot.id, "SKIP");
          } else {
            const innocents = others.filter(s => s.id !== bot.id);
            innocents.sort((a, b) => b.suspicion - a.suspicion);
            const target = (Math.random() < 0.6 && innocents.length > 0)
              ? innocents[0]
              : innocents[Math.floor(Math.random() * innocents.length)];
            this.recordVote(bot.id, target ? target.id : "SKIP");
          }
        } else {
          // INNOCENT BOT AI: Evaluates evidence objectively
          const highestSuspicion = Math.max(...others.map(o => o.suspicion || 0), 0);

          // If nobody is strongly suspicious (< 45 suspicion), 70% chance to SKIP
          if (highestSuspicion < 45) {
            if (Math.random() < 0.70) {
              this.recordVote(bot.id, "SKIP");
              return;
            }
          }

          // Weighted probabilistic vote based on suspicion
          let totalWeight = 0;
          const weighted = others.map(s => {
            const baseSusp = Math.max(5, s.suspicion || 0);
            const w = Math.pow(baseSusp, 1.6);
            totalWeight += w;
            return { id: s.id, weight: w };
          });

          // 25% chance to skip even with suspicion if not 100% sure
          if (Math.random() < 0.25) {
            this.recordVote(bot.id, "SKIP");
            return;
          }

          let r = Math.random() * totalWeight;
          let chosenTarget = others[0].id;
          for (const item of weighted) {
            if (r <= item.weight) {
              chosenTarget = item.id;
              break;
            }
            r -= item.weight;
          }

          this.recordVote(bot.id, chosenTarget);
        }
      }, 1200 + idx * 1800 + Math.random() * 1500);
    });

    const timerBadge = document.getElementById("meeting-timer");
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.votingTimer--;
      if (timerBadge) {
        timerBadge.innerHTML = `🗳️ Voting Ends in: <span id="vote-timer-val" style="color:#EF4444;">${this.votingTimer}s</span>`;
      }

      if (this.votingTimer <= 0) {
        clearInterval(this.timerInterval);
        this.tallyVotes();
      }
    }, 1000);
  }

  populateDebateGrid(votingEnabled) {
    const grid = document.getElementById("debate-sisters-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const allSisters = this.getAllSisters();

    allSisters.forEach((s) => {
      const isPlayer = (s === this.game.player);
      const hasVoted = this.votedSisters.has(s.id);

      const card = document.createElement("div");
      card.className = `debate-sister-card ${s.isEjected ? 'ejected' : ''} ${hasVoted ? 'voted-state' : ''}`;
      card.innerHTML = `
        <div class="debate-sister-header">
          <span class="debate-sister-avatar">${s.avatar}</span>
          <div class="debate-sister-name-group">
            <span class="debate-sister-name">${s.name} ${isPlayer ? '(You)' : ''}</span>
            <span class="voted-indicator">${hasVoted ? '✅ VOTED' : (s.isEjected ? '❌ PUNISHED' : '⏳ THINKING')}</span>
          </div>
        </div>
        <div class="suspicion-meter-mini">
          <span>Suspicion:</span>
          <div class="susp-bar"><div class="susp-fill" style="width:${Math.round(s.suspicion)}%"></div></div>
        </div>
        ${!s.isEjected ? `
          <button class="btn-vote-sister" data-id="${s.id}" ${votingEnabled && !this.votedSisters.has(this.game.player.id) ? '' : 'disabled'}>
            ${votingEnabled ? `Vote ${s.name}` : '🔒 Discussing...'}
          </button>` : '<span class="ejected-label">Already Punished</span>'}
      `;

      const voteBtn = card.querySelector(".btn-vote-sister");
      if (voteBtn && votingEnabled) {
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
    log.innerHTML = `<div class="log-entry system-entry">⚠️ Emergency Meeting called. Discuss and vote who the Prankster is!</div>`;

    const livingSisters = this.getLivingSisters();
    livingSisters.forEach((s, idx) => {
      setTimeout(() => {
        if (!this.isActive) return;
        const line = this.game.dialogueEngine.getRandomDebateLine(s.id);
        this.appendChatMessage(s.name, s.avatar, s.color, line.text, s === this.game.player);
      }, (idx + 1) * 1200);
    });
  }

  castVote(targetId) {
    if (this.votedSisters.has(this.game.player.id)) return;
    this.recordVote(this.game.player.id, targetId);

    if (this.game.multiplayer && this.game.multiplayer.isMultiplayer) {
      this.game.multiplayer.syncVote(this.game.player.id, targetId);
    }
  }

  recordVote(sisterId, targetId) {
    this.votes[sisterId] = targetId;
    this.votedSisters.add(sisterId);
    this.populateDebateGrid(this.phase === "VOTING");

    // If all living sisters have cast votes, tally immediately!
    const living = this.getLivingSisters();
    if (this.votedSisters.size >= living.length) {
      if (this.timerInterval) clearInterval(this.timerInterval);
      setTimeout(() => this.tallyVotes(), 800);
    }
  }

  tallyVotes() {
    this.phase = "REVEAL";
    const counts = {};
    let skipVotes = 0;

    Object.entries(this.votes).forEach(([voterId, targetId]) => {
      if (targetId === "SKIP") {
        skipVotes++;
      } else {
        counts[targetId] = (counts[targetId] || 0) + 1;
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

    // Jisha's Prankster Shield
    if (ejectedId === "JISHA" && this.game.pranksterSisterId === "JISHA" && !this.jishaShieldUsed) {
      this.jishaShieldUsed = true;
      this.showVerdict(null, "Jisha used her Ladli Shield! Mummy excused her!");
      return;
    }

    // Ejection requires: strict lead over skip votes, no tie, and at least 2 votes
    if (tie || !ejectedId || maxVotes <= skipVotes || maxVotes < 2) {
      this.showVerdict(null, "No consensus was reached! (Skipped / Tie)");
    } else {
      const allSisters = this.getAllSisters();
      const ejectedChar = allSisters.find((s) => s.id === ejectedId);
      if (ejectedChar) {
        ejectedChar.isEjected = true;
        const isPrankster = (ejectedChar.id === this.game.pranksterSisterId);
        this.showVerdict(ejectedChar, isPrankster ? "Unmasked The Prankster!" : "An Innocent Sister was Punished!");
      }
    }
  }

  showVerdict(ejectedSister, outcomeText) {
    this.phase = "VERDICT";
    const meetingScreen = document.getElementById("screen-meeting");
    const verdictScreen = document.getElementById("screen-verdict");
    const spotlight = document.getElementById("verdict-spotlight");
    const dialogue = document.getElementById("verdict-dialogue");
    const title = document.getElementById("verdict-title");

    if (meetingScreen) meetingScreen.classList.add("hidden");
    if (verdictScreen) verdictScreen.classList.remove("hidden");

    if (ejectedSister) {
      const isPrankster = (ejectedSister.id === this.game.pranksterSisterId);
      if (title) title.innerText = outcomeText;
      spotlight.innerHTML = `
        <div class="verdict-avatar-circle">
          <img src="${ejectedSister.image || ''}" class="verdict-avatar-img" onerror="this.style.display='none'" />
          <span style="font-size:52px;">${ejectedSister.avatar}</span>
        </div>
        <h3 class="verdict-name-banner" style="color:${isPrankster ? '#10B981' : '#EF4444'};">
          ${ejectedSister.name} was ${isPrankster ? 'THE PRANKSTER! 😈' : 'NOT The Prankster! 😇'}
        </h3>
        <p class="verdict-sub-status">
          ${isPrankster ? '0 Pranksters remain.' : '1 Prankster remains.'}
        </p>
      `;
      dialogue.innerText = `"${this.game.mummy.dialogues.verdictPunish}"`;

      // 1. INNOCENTS WIN: Prankster was unmasked!
      if (isPrankster) {
        setTimeout(() => {
          this.closeVerdict();
          this.game.triggerWin("PRANKSTER_EJECTED");
        }, 3500);
        return;
      }

      // 2. PRANKSTER WINS: Only 1 innocent left alive!
      const livingInnocents = this.getLivingSisters().filter(s => s.id !== this.game.pranksterSisterId);
      if (livingInnocents.length <= 1) {
        setTimeout(() => {
          this.closeVerdict();
          this.game.triggerDefeat("PRANKSTER_MAJORITY");
        }, 3500);
        return;
      }
    } else {
      if (title) title.innerText = "No Sister Was Punished";
      spotlight.innerHTML = `
        <div style="font-size:60px;">🤷‍♀️</div>
        <h3 class="verdict-name-banner" style="color:#94A3B8;">No one was ejected. (Skipped / Tie)</h3>
        <p class="verdict-sub-status">1 Prankster remains.</p>
      `;
      dialogue.innerText = `"Koi saboot nathi! Badha potpotana kaam par laago!" (No proof! Everyone back to cleaning!)`;
    }
  }

  closeVerdict() {
    this.isActive = false;
    this.phase = "IDLE";
    const verdictScreen = document.getElementById("screen-verdict");
    if (verdictScreen) verdictScreen.classList.add("hidden");
  }
}
