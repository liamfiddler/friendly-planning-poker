export const addListeners = (gameState, setGameState) => {
  gameState.socket.on('playerList', (players) => {
    setGameState((currentState) => ({
      ...currentState,
      players,
    }));
  });

  gameState.socket.on('getId', (id) => {
    setGameState((currentState) => ({
      ...currentState,
      id,
    }));
  });

  gameState.socket.on('revealCard', ({ id, card }) => {
    console.log(`${id} revealed the card "${card}"`);

    setGameState((currentState) => ({
      ...currentState,
      revealed: {
        ...currentState.revealed,
        [id]: card,
      },
    }));
  });

  gameState.socket.on('hideCard', ({ id }) => {
    console.log(`${id} hid their card`);

    setGameState((currentState) => ({
      ...currentState,
      revealed: {
        ...currentState.revealed,
        [id]: null,
      },
    }));
  });

  gameState.socket.emit('getId');
  gameState.socket.emit('joinGame', gameState.gameId, gameState.name);
};
