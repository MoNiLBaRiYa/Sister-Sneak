/**
 * Sister Sneak: Phone Locked - Production Online Multiplayer Client Engine
 * Connects directly to the Centralized WebSocket Server (ws:// / wss://).
 * Supports playing with friends worldwide on separate devices and networks!
 */

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
    // 1. Send via online WebSocket
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
    // 2. Send via local BroadcastChannel
    if (this.localChannel) {
      try {
        this.localChannel.postMessage(data);
      } catch (e) {}
    }
  }

  broadcast(data) {
    this.send(data);
  }

  createRoom(hostSisterId, mummyId, onRoomCreated) {
    this.isMultiplayer = true;
    this.isHost = true;
    this.onRoomCreatedCallback = onRoomCreated;

    this.connectSocket(() => {
      this.send({
        type: 'CREATE_ROOM',
        sisterId: hostSisterId,
        name: 'Host (You)',
        mummyId: mummyId
      });
    }, (err) => {
      // Local offline fallback
      this.roomCode = "SNEK" + Math.floor(10 + Math.random() * 90);
      this.myPlayerId = "host-" + Math.random().toString(36).substr(2, 4);
      this.lobbyPlayers = [{ id: this.myPlayerId, name: 'Host (You)', sisterId: hostSisterId, isHost: true }];
      if (onRoomCreated) onRoomCreated(this.roomCode);
      this.updateLobbyUI();
    });
  }

  joinRoom(roomCode, mySisterId, playerName, onJoined, onError) {
    this.isMultiplayer = true;
    this.isHost = false;
    this.roomCode = roomCode.toUpperCase().trim();
    this.onJoinedCallback = onJoined;
    this.onErrorCallback = onError;

    this.connectSocket(() => {
      this.send({
        type: 'JOIN_ROOM',
        roomCode: this.roomCode,
        sisterId: mySisterId,
        name: playerName || 'Sister'
      });
    }, (err) => {
      // Local fallback
      this.myPlayerId = "client-" + Math.random().toString(36).substr(2, 4);
      this.send({
        type: 'JOIN_LOBBY_LOCAL',
        roomCode: this.roomCode,
        senderId: this.myPlayerId,
        sisterId: mySisterId,
        name: playerName || 'Sister'
      });
      if (onJoined) onJoined(this.roomCode);
    });
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
      const item = document.createElement('div');
      item.className = 'mp-player-item';
      item.innerHTML = `
        <span class="mp-player-icon">${p.isHost ? '👑' : '👧'}</span>
        <span class="mp-player-name"><strong>${p.name}</strong> (${p.sisterId})</span>
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

  syncCleanliness(cleanliness) {
    if (!this.isMultiplayer || !this.isHost) return;
    this.send({
      type: 'CLEANLINESS_SYNC',
      cleanliness: cleanliness
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
}
