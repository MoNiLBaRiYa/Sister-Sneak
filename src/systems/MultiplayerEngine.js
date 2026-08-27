/**
 * Sister Sneak: Phone Locked - Production Online Multiplayer Client Engine
 * Connects directly to the Centralized WebSocket Server (ws:// / wss://).
 * Supports Among Us / Skribbl-style character selection sync and real-time chat broadcasts.
 */

import { SISTERS } from '../config/characters.js';

export class MultiplayerEngine {
  constructor(game) {
    this.game = game;
    this.isMultiplayer = false;
    this.isHost = false;
    this.roomCode = "";
    this.myPlayerId = "";
    this.socket = null;
    this.lobbyPlayers = [];
    this.localChannel = null;

    this.onRoomCreatedCallback = null;
    this.onJoinedCallback = null;
    this.onErrorCallback = null;

    this.initLocalChannel();
    this.checkUrlAutoJoin();
  }

  initLocalChannel() {
    try {
      this.localChannel = new BroadcastChannel('sister_sneak_multiplayer');
      this.localChannel.onmessage = (event) => {
        this.handleMessage(event.data);
      };
    } catch (e) {
      console.warn("BroadcastChannel not supported in this browser", e);
    }
  }

  getWebSocketUrl() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host || 'localhost:8080';
    return `${protocol}//${host}`;
  }

  getShareableLink(roomCode) {
    const code = roomCode || this.roomCode;
    const url = new URL(window.location.href);
    url.searchParams.set('room', code);
    return url.toString();
  }

  checkUrlAutoJoin() {
    try {
      const url = new URL(window.location.href);
      const codeFromUrl = url.searchParams.get('room');
      if (codeFromUrl) {
        setTimeout(() => {
          const tabMulti = document.getElementById('tab-multiplayer');
          const inputCode = document.getElementById('input-room-code');
          if (tabMulti) tabMulti.click();
          if (inputCode) inputCode.value = codeFromUrl.toUpperCase();
        }, 500);
      }
    } catch (e) {}
  }

  connectSocket(onConnected, onError) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      if (onConnected) onConnected();
      return;
    }

    try {
      const url = this.getWebSocketUrl();
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log("Connected to Sister Sneak Online Multiplayer Server:", url);
        if (onConnected) onConnected();
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (e) {
          console.error("Error parsing incoming message:", e);
        }
      };

      this.socket.onerror = (err) => {
        console.warn("WebSocket connection warning:", err);
        if (onError) onError(err);
      };

      this.socket.onclose = () => {
        console.log("WebSocket connection closed.");
      };
    } catch (e) {
      console.warn("Unable to open WebSocket, falling back to local channel", e);
      if (onError) onError(e);
    }
  }

  send(data) {
    data.roomCode = this.roomCode;
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
    if (this.localChannel) {
      try {
        this.localChannel.postMessage(data);
      } catch (e) {}
    }
  }

  broadcast(data) {
    this.send(data);
  }

  createRoom(hostSisterId, mummyId, customCode, onRoomCreated) {
    this.isMultiplayer = true;
    this.isHost = true;
    this.onRoomCreatedCallback = onRoomCreated;

    this.connectSocket(() => {
      this.send({
        type: 'CREATE_ROOM',
        customCode: customCode || '',
        sisterId: hostSisterId,
        name: `${SISTERS[hostSisterId]?.name || 'Host'} (You)`,
        mummyId: mummyId
      });
    }, (err) => {
      // Local offline fallback
      this.roomCode = (customCode || "1234").toUpperCase();
      this.myPlayerId = "host-" + Math.random().toString(36).substr(2, 4);
      this.lobbyPlayers = [{ id: this.myPlayerId, name: `${SISTERS[hostSisterId]?.name || 'Host'} (You)`, sisterId: hostSisterId, isHost: true }];
      if (onRoomCreated) onRoomCreated(this.roomCode);
      this.updateLobbyUI();
    });
  }

  joinRoom(roomCode, mySisterId, playerName, onJoined, onError) {
    this.isMultiplayer = true;
    this.isHost = false;
    this.roomCode = (roomCode || '').toUpperCase().replace(/[^A-Z0-9]/g, '').trim();
    this.onJoinedCallback = onJoined;
    this.onErrorCallback = onError;

    this.connectSocket(() => {
      this.send({
        type: 'JOIN_ROOM',
        roomCode: this.roomCode,
        sisterId: mySisterId,
        name: playerName || SISTERS[mySisterId]?.name || 'Sister'
      });
    }, (err) => {
      // Local fallback
      this.myPlayerId = "client-" + Math.random().toString(36).substr(2, 4);
      this.send({
        type: 'JOIN_LOBBY_LOCAL',
        roomCode: this.roomCode,
        senderId: this.myPlayerId,
        sisterId: mySisterId,
        name: playerName || SISTERS[mySisterId]?.name || 'Sister'
      });
      if (onJoined) onJoined(this.roomCode);
    });
  }

  updateMyCharacter(sisterId, name) {
    if (!this.isMultiplayer) return;
    this.send({
      type: 'UPDATE_CHARACTER',
      sisterId: sisterId,
      name: name || SISTERS[sisterId]?.name || 'Sister'
    });
  }

  exitMatch() {
    if (this.isMultiplayer) {
      this.send({
        type: 'LEAVE_ROOM',
        senderId: this.myPlayerId
      });
    }
    this.isMultiplayer = false;
    this.isHost = false;
    this.roomCode = "";
  }

  handleMessage(data) {
    switch (data.type) {
      case 'ROOM_CREATED':
        this.roomCode = data.roomCode;
        this.myPlayerId = data.playerId;
        this.lobbyPlayers = data.players || [];
        if (this.onRoomCreatedCallback) {
          this.onRoomCreatedCallback(this.roomCode);
        }
        this.updateLobbyUI();
        break;

      case 'ROOM_JOINED':
        this.roomCode = data.roomCode;
        this.myPlayerId = data.playerId;
        this.lobbyPlayers = data.players || [];
        if (this.onJoinedCallback) {
          this.onJoinedCallback(this.roomCode);
        }
        this.updateLobbyUI();
        break;

      case 'LOBBY_UPDATE':
        this.lobbyPlayers = data.players || [];
        this.updateLobbyUI();
        break;

      case 'START_GAME_SYNC':
        this.game.startMultiplayerRoundAsClient(data);
        break;

      case 'PLAYER_POS_SYNC':
        if (data.senderId !== this.myPlayerId) {
          this.game.updateRemotePlayerPosition(data);
        }
        break;

      case 'CLEANLINESS_SYNC':
        if (!this.isHost) {
          this.game.taskManager.cleanliness = data.cleanliness;
          if (data.completedTaskId) {
            this.game.taskManager.markTaskCompleted(data.completedTaskId);
          }
          this.game.taskManager.updateHUD();
        }
        break;

      case 'SABOTAGE_TRIGGERED':
        if (data.senderId !== this.myPlayerId) {
          this.game.sabotageSystem.triggerSabotage(data.sabotageType, data.floor);
        }
        break;

      case 'EMERGENCY_MEETING_CALLED':
        this.game.meetingEngine.startMeeting(data.reason);
        break;

      case 'VOTE_CAST_SYNC':
        if (this.game.meetingEngine.isActive) {
          this.game.meetingEngine.votes[data.sisterId] = data.targetId;
        }
        break;

      case 'CHAT_MESSAGE':
        if (data.senderId !== this.myPlayerId) {
          this.game.meetingEngine.receiveRemoteChatMessage(data);
        }
        break;

      case 'PLAYER_LEFT':
        this.game.handleRemotePlayerLeft(data);
        break;

      case 'ERROR':
        alert(data.message);
        if (this.onErrorCallback) this.onErrorCallback(new Error(data.message));
        break;
    }
  }

  updateLobbyUI() {
    const listEl = document.getElementById('mp-lobby-players-list');
    if (!listEl) return;
    listEl.innerHTML = "";

    this.lobbyPlayers.forEach((p) => {
      const char = SISTERS[p.sisterId] || SISTERS.RIDDHI;
      const isMe = (p.id === this.myPlayerId);

      const item = document.createElement('div');
      item.className = 'mp-player-item';
      item.innerHTML = `
        <div class="mp-player-avatar-wrapper">
          <img src="${char.image}" alt="${char.name}" class="mp-player-avatar-img" />
        </div>
        <div class="mp-player-info">
          <span class="mp-player-name">${p.isHost ? '👑 ' : ''}<strong>${char.name}</strong> ${isMe ? '(You)' : ''}</span>
          <span class="mp-player-tagline">${char.archetype}</span>
        </div>
      `;
      listEl.appendChild(item);
    });

    const countEl = document.getElementById('mp-player-count');
    if (countEl) countEl.innerText = `${this.lobbyPlayers.length} / 5 Sisters`;

    const startBtn = document.getElementById('btn-mp-start-game');
    if (startBtn) {
      startBtn.style.display = this.isHost ? 'flex' : 'none';
    }
  }

  syncMyPosition(player) {
    if (!this.isMultiplayer) return;
    this.send({
      type: 'PLAYER_POS_SYNC',
      senderId: this.myPlayerId,
      sisterId: player.id,
      floor: player.floor,
      x: player.x,
      y: player.y,
      vx: player.vx,
      vy: player.vy,
      facing: player.facing,
      isMoving: player.isMoving
    });
  }

  syncCleanliness(cleanliness, taskId = null) {
    if (!this.isMultiplayer) return;
    this.send({
      type: 'CLEANLINESS_SYNC',
      cleanliness: cleanliness,
      completedTaskId: taskId,
      completedBy: this.game.player?.id
    });
  }

  syncSabotage(sabotageType, floor) {
    if (!this.isMultiplayer) return;
    this.send({
      type: 'SABOTAGE_TRIGGERED',
      senderId: this.myPlayerId,
      sabotageType: sabotageType,
      floor: floor
    });
  }

  syncMeeting(reason) {
    if (!this.isMultiplayer) return;
    this.send({
      type: 'EMERGENCY_MEETING_CALLED',
      senderId: this.myPlayerId,
      reason: reason
    });
  }

  syncVote(sisterId, targetId) {
    if (!this.isMultiplayer) return;
    this.send({
      type: 'VOTE_CAST_SYNC',
      senderId: this.myPlayerId,
      sisterId: sisterId,
      targetId: targetId
    });
  }

  sendChat(text, sisterId, senderName, avatar, color) {
    if (!this.isMultiplayer) return;
    this.send({
      type: 'CHAT_MESSAGE',
      senderId: this.myPlayerId,
      sisterId: sisterId,
      senderName: senderName,
      avatar: avatar,
      color: color,
      text: text
    });
  }
}
