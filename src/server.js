const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const playerData = {}; // TODO: Move this to Redis?

app.use(express.static(__dirname + '/client'));

app.get('/', (_request, response) => {
  response.sendFile(__dirname + '/client/index.html');
});

const emitPlayerDataToGame = (gameId) => {
  console.log(`Emitting player data to ${gameId}...`);

  if (gameId in io.sockets.adapter.rooms) {
    const room = io.sockets.adapter.rooms[gameId];
    const socketIds = Object.keys(room.sockets);
    const playerList = socketIds.map((socketId) => playerData[socketId]);
    io.to(gameId).emit('playerList', playerList);
  }
};

io.on('connection', (socket) => {
  playerData[socket.id] = {
    id: socket.id,
    name: 'Unknown',
    gameId: undefined,
  };

  const withCurrentGameId = (callback) => {
    const { gameId } = playerData[socket.id];

    if (gameId) {
      callback(gameId);
    }
  };

  socket.on('getId', () => {
    io.to(socket.id).emit('getId', socket.id);
  });

  socket.on('joinGame', (gameId, name) => {
    withCurrentGameId((currentGameId) => {
      socket.leave(currentGameId, () => {
        emitPlayerDataToGame(currentGameId);
      });
    });

    playerData[socket.id].gameId = gameId;
    playerData[socket.id].name = name;

    socket.join(gameId, () => {
      emitPlayerDataToGame(gameId);
    });
  });

  socket.on('disconnect', () => {
    withCurrentGameId(emitPlayerDataToGame);
    delete playerData[socket.id];
  });

  socket.on('revealCard', (card) => {
    const { id, gameId } = playerData[socket.id];
    io.to(gameId).emit('revealCard', { id, card });
  });

  socket.on('hideCard', () => {
    const { id, gameId } = playerData[socket.id];
    io.to(gameId).emit('hideCard', { id });
  });
});

http.listen(8080);
