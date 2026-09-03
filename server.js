/**
 * Sister Sneak: Phone Locked - Production Online Multiplayer Server
 * Serves static web app assets and manages real-time WebSocket rooms worldwide.
 * Synchronizes character powers, visual auras, positions, and live chat across all devices.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/healthz' || req.url === '/ping') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }

  let filePath = path.join(__dirname, req.url === '/' || req.url.startsWith('/?') ? 'index.html' : req.url.split('?')[0]);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

let WebSocketServer;
try {
  WebSocketServer = require('ws').WebSocketServer || require('ws').Server;
} catch (e) {
  console.log("Note: Running WebSocket server.");
}

const rooms = new Map();

function generateRoomCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function broadcastToRoom(roomCode, data, excludeSocket = null) {
  const room = rooms.get(roomCode);
  if (!room) return;
  const payload = JSON.stringify(data);

  room.players.forEach((player, socket) => {
    if (socket !== excludeSocket && socket.readyState === 1) {
      socket.send(payload);
    }
  });
}

if (WebSocketServer) {
  const wss = new WebSocketServer({ server });

  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 15000);

  wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });

    let currentRoomCode = null;
    let myPlayerId = 'p-' + Math.random().toString(36).substr(2, 6);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);

        switch (data.type) {
          case 'CREATE_ROOM': {
            let roomCode = (data.customCode || '').toUpperCase().replace(/[^A-Z0-9]/g, '').trim();
            if (!roomCode || roomCode.length < 3) {
              roomCode = generateRoomCode();
            }

            if (rooms.has(roomCode) && rooms.get(roomCode).players.size > 0) {
              roomCode = generateRoomCode();
            }

            currentRoomCode = roomCode;

            const newRoom = {
              code: roomCode,
              hostSocket: ws,
              players: new Map(),
              state: {
                cleanliness: 0,
                mummyId: data.mummyId || 'RIDDHI_MUMMY',
                pranksterSisterId: null,
                started: false
              }
            };

            const hostPlayer = {
              id: myPlayerId,
              name: data.name || 'Host (You)',
              sisterId: data.sisterId || 'RIDDHI',
              isHost: true
            };

            newRoom.players.set(ws, hostPlayer);
            rooms.set(roomCode, newRoom);

            ws.send(JSON.stringify({
              type: 'ROOM_CREATED',
              roomCode: roomCode,
              playerId: myPlayerId,
              players: Array.from(newRoom.players.values())
            }));
            break;
          }

          case 'JOIN_ROOM': {
            const roomCode = (data.roomCode || '').toUpperCase().replace(/[^A-Z0-9]/g, '').trim();
            const room = rooms.get(roomCode);

            if (!room) {
              ws.send(JSON.stringify({
                type: 'ERROR',
                message: `Room "${roomCode}" not found! Check the room code and try again.`
              }));
              return;
            }

            if (room.players.size >= 5) {
              ws.send(JSON.stringify({
                type: 'ERROR',
                message: `Room "${roomCode}" is full (Max 5 sisters)!`
              }));
              return;
            }

            currentRoomCode = roomCode;
            const newPlayer = {
              id: myPlayerId,
              name: data.name || 'Sister',
              sisterId: data.sisterId || 'SHRUTI',
              isHost: false
            };

            room.players.set(ws, newPlayer);
            const playerList = Array.from(room.players.values());

            ws.send(JSON.stringify({
              type: 'ROOM_JOINED',
              roomCode: roomCode,
              playerId: myPlayerId,
              players: playerList
            }));

            broadcastToRoom(roomCode, {
              type: 'LOBBY_UPDATE',
              players: playerList
            }, ws);
            break;
          }

          case 'UPDATE_CHARACTER': {
            if (currentRoomCode && rooms.has(currentRoomCode)) {
              const room = rooms.get(currentRoomCode);
              const player = room.players.get(ws);
              if (player) {
                player.sisterId = data.sisterId;
                if (data.name) player.name = data.name;
                broadcastToRoom(currentRoomCode, {
                  type: 'LOBBY_UPDATE',
                  players: Array.from(room.players.values())
                });
              }
            }
            break;
          }

          case 'START_GAME':
          case 'START_GAME_SYNC': {
            const room = rooms.get(currentRoomCode);
            if (room) {
              room.state.started = true;
              room.state.pranksterSisterId = data.pranksterSisterId || data.imposterSisterId;
              room.state.mummyId = data.mummyId;

              broadcastToRoom(currentRoomCode, {
                type: 'START_GAME_SYNC',
                pranksterSisterId: room.state.pranksterSisterId,
                mummyId: data.mummyId,
                lobbyPlayers: Array.from(room.players.values())
              });
            }
            break;
          }

          case 'POWER_ACTIVATED': {
            if (currentRoomCode) {
              broadcastToRoom(currentRoomCode, {
                type: 'POWER_ACTIVATED',
                senderId: myPlayerId,
                sisterId: data.sisterId,
                powerName: data.powerName,
                auraColor: data.auraColor,
                isStealth: data.isStealth
              }, ws);
            }
            break;
          }

          case 'PRANKSTER_DEBUFF':
          case 'IMPOSTER_DEBUFF': {
            if (currentRoomCode) {
              broadcastToRoom(currentRoomCode, {
                type: 'PRANKSTER_DEBUFF',
                senderId: myPlayerId,
                debuffType: data.debuffType,
                floor: data.floor
              }, ws);
            }
            break;
          }

          case 'CHAT_MESSAGE': {
            if (currentRoomCode) {
              const safeText = String(data.text || '').replace(/[<>]/g, '').trim().substring(0, 150);
              const safeName = String(data.senderName || '').replace(/[<>]/g, '').trim().substring(0, 30);
              if (safeText.length > 0) {
                broadcastToRoom(currentRoomCode, {
                  type: 'CHAT_MESSAGE',
                  senderId: myPlayerId,
                  sisterId: data.sisterId,
                  senderName: safeName,
                  avatar: data.avatar,
                  color: data.color,
                  text: safeText
                });
              }
            }
            break;
          }

          case 'PLAYER_POS_SYNC': {
            if (currentRoomCode) {
              broadcastToRoom(currentRoomCode, {
                type: 'PLAYER_POS_SYNC',
                senderId: myPlayerId,
                sisterId: data.sisterId,
                floor: data.floor,
                x: data.x,
                y: data.y,
                vx: data.vx,
                vy: data.vy,
                facing: data.facing,
                isMoving: data.isMoving,
                auraColor: data.auraColor,
                isStealth: data.isStealth
              }, ws);
            }
            break;
          }

          case 'CLEANLINESS_SYNC': {
            if (currentRoomCode) {
              const room = rooms.get(currentRoomCode);
              if (room) {
                room.state.cleanliness = data.cleanliness;
                broadcastToRoom(currentRoomCode, {
                  type: 'CLEANLINESS_SYNC',
                  cleanliness: data.cleanliness,
                  completedTaskId: data.completedTaskId,
                  completedBy: data.completedBy
                }, ws);
              }
            }
            break;
          }

          case 'SABOTAGE_TRIGGERED': {
            if (currentRoomCode) {
              broadcastToRoom(currentRoomCode, {
                type: 'SABOTAGE_TRIGGERED',
                senderId: myPlayerId,
                sabotageType: data.sabotageType,
                floor: data.floor
              }, ws);
            }
            break;
          }

          case 'EMERGENCY_MEETING_CALLED': {
            if (currentRoomCode) {
              broadcastToRoom(currentRoomCode, {
                type: 'EMERGENCY_MEETING_CALLED',
                senderId: myPlayerId,
                reason: data.reason
              });
            }
            break;
          }

          case 'VOTE_CAST_SYNC': {
            if (currentRoomCode) {
              broadcastToRoom(currentRoomCode, {
                type: 'VOTE_CAST_SYNC',
                senderId: myPlayerId,
                sisterId: data.sisterId,
                targetId: data.targetId
              });
            }
            break;
          }

          case 'LEAVE_ROOM': {
            if (currentRoomCode && rooms.has(currentRoomCode)) {
              const room = rooms.get(currentRoomCode);
              const exitingPlayer = room.players.get(ws);
              room.players.delete(ws);

              if (exitingPlayer) {
                broadcastToRoom(currentRoomCode, {
                  type: 'PLAYER_LEFT',
                  playerId: exitingPlayer.id,
                  sisterId: exitingPlayer.sisterId,
                  playerName: exitingPlayer.name,
                  remainingPlayers: Array.from(room.players.values())
                });
              }

              if (room.players.size === 0) {
                rooms.delete(currentRoomCode);
              }
              currentRoomCode = null;
            }
            break;
          }

          default: {
            if (currentRoomCode) {
              broadcastToRoom(currentRoomCode, data, ws);
            }
          }
        }
      } catch (err) {
        console.error("Socket error processing message:", err);
      }
    });

    ws.on('close', () => {
      if (currentRoomCode && rooms.has(currentRoomCode)) {
        const room = rooms.get(currentRoomCode);
        const exitingPlayer = room.players.get(ws);
        room.players.delete(ws);

        if (exitingPlayer) {
          broadcastToRoom(currentRoomCode, {
            type: 'PLAYER_LEFT',
            playerId: exitingPlayer.id,
            sisterId: exitingPlayer.sisterId,
            playerName: exitingPlayer.name,
            remainingPlayers: Array.from(room.players.values())
          });
        }

        if (room.players.size === 0) {
          rooms.delete(currentRoomCode);
        } else {
          if (room.hostSocket === ws) {
            const nextSocket = room.players.keys().next().value;
            room.hostSocket = nextSocket;
            const nextPlayer = room.players.get(nextSocket);
            if (nextPlayer) nextPlayer.isHost = true;
          }

          broadcastToRoom(currentRoomCode, {
            type: 'LOBBY_UPDATE',
            players: Array.from(room.players.values())
          });
        }
      }
    });
  });
}

server.listen(PORT, () => {
  console.log(`Sister Sneak Server running on port ${PORT}`);
});
