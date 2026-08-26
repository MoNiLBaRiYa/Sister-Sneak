/**
 * Sister Sneak: Phone Locked - Production Online Multiplayer Server
 * Serves static web app assets and manages real-time WebSocket rooms worldwide.
 * Deployable on Render, Railway, Fly.io, Heroku, AWS, or local Node.js.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

// MIME types dictionary
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

// 1. HTTP Server for Static Assets
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
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

// 2. Real-Time WebSocket Rooms Manager
let WebSocketServer;
try {
  WebSocketServer = require('ws').WebSocketServer || require('ws').Server;
} catch (e) {
  console.log("Note: Run 'npm install' to install ws package for Node.js WebSocket engine.");
}

const rooms = new Map(); // roomCode -> { hostSocket, players: Map<socket, playerObj>, state }

function generateRoomCode() {
  const words = ["SNEK", "CHAI", "DADI", "MUMY", "ROTI", "SAAF", "GHEE", "JALE", "KHAK", "KACH"];
  const code = words[Math.floor(Math.random() * words.length)] + Math.floor(10 + Math.random() * 90);
  return code;
}

function broadcastToRoom(roomCode, data, excludeSocket = null) {
  const room = rooms.get(roomCode);
  if (!room) return;
  const payload = JSON.stringify(data);

  room.players.forEach((player, socket) => {
    if (socket !== excludeSocket && socket.readyState === 1) { // 1 = OPEN
      socket.send(payload);
    }
  });
}

if (WebSocketServer) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    let currentRoomCode = null;
    let myPlayerId = 'p-' + Math.random().toString(36).substr(2, 6);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);

        switch (data.type) {
          case 'CREATE_ROOM': {
            const roomCode = generateRoomCode();
            currentRoomCode = roomCode;

            const newRoom = {
              code: roomCode,
              hostSocket: ws,
              players: new Map(),
              state: {
                cleanliness: 0,
                mummyId: data.mummyId || 'SOHINI',
                imposterSisterId: null,
                started: false
              }
            };

            const hostPlayer = {
              id: myPlayerId,
              name: data.name || 'Host',
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
            const roomCode = (data.roomCode || '').toUpperCase().trim();
            const room = rooms.get(roomCode);

            if (!room) {
              ws.send(JSON.stringify({
                type: 'ERROR',
                message: `Room "${roomCode}" not found! Check the 4-letter code and try again.`
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

            // Notify joiner
            ws.send(JSON.stringify({
              type: 'ROOM_JOINED',
              roomCode: roomCode,
              playerId: myPlayerId,
              players: playerList
            }));

            // Notify all other players in room
            broadcastToRoom(roomCode, {
              type: 'LOBBY_UPDATE',
              players: playerList
            }, ws);
            break;
          }

          case 'START_GAME':
          case 'START_GAME_SYNC': {
            const room = rooms.get(currentRoomCode);
            if (room) {
              room.state.started = true;
              room.state.imposterSisterId = data.imposterSisterId;
              room.state.mummyId = data.mummyId;

              // Broadcast START_GAME_SYNC to EVERYONE in the room including joiners
              broadcastToRoom(currentRoomCode, {
                type: 'START_GAME_SYNC',
                imposterSisterId: data.imposterSisterId,
                mummyId: data.mummyId,
                lobbyPlayers: Array.from(room.players.values())
              });
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
                isMoving: data.isMoving
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
                  cleanliness: data.cleanliness
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
        room.players.delete(ws);

        if (room.players.size === 0) {
          rooms.delete(currentRoomCode);
        } else {
          // If host left, assign new host
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
  console.log(`====================================================`);
  console.log(`  Sister Sneak Online Multiplayer Server Running!   `);
  console.log(`  Port: ${PORT}                                      `);
  console.log(`  Local URL: http://localhost:${PORT}                `);
  console.log(`====================================================`);
});
