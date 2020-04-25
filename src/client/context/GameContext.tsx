import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useScript } from 'use-script';
import { PlayerData, PlayerID } from '../../types/PlayerData';

const socketioScript = {
  src: '/socket.io/socket.io.js',
};

interface GameState {
  socket?: SocketIO.Socket;
  gameId?: string;
  id?: PlayerID;
  name?: string;
  players?: PlayerData[],
  revealed?: Record<PlayerID, string>,
}

const defaultState: GameState = Object.freeze({
  socket: undefined,
  gameId: undefined,
  id: undefined,
  name: undefined,
  players: [],
  revealed: {},
});

type GameContextType = [GameState, Dispatch<SetStateAction<GameState>>];

export const GameContext = React.createContext<GameContextType>([
  defaultState,
  () => {
    throw new Error('Cannot modify game state before it is initialised');
  },
]);

const shortId = () => Math.random().toString(36).slice(-9).toUpperCase();

interface GameContextProps {
  gameId?: string;
  name?: string;
}

export const GameContextProvider: React.FC<GameContextProps> = ({ gameId, name, children }) => {
  const { loading, /* error */ } = useScript(socketioScript);

  const [gameState, setGameState] = useState({
    ...defaultState,
    gameId: gameId || shortId(),
    name,
  });

  useEffect(() => {
    if (!loading) {
      setGameState((currentState) => ({
        ...currentState,
        socket: io(),
      }));

      if (!name) {
        const newName = prompt('What is your name?', '');

        setGameState((currentState) => ({
          ...currentState,
          name: newName,
        }));
      }
    }
  }, [loading]);

  useEffect(() => {
    if (gameState.socket) {
      gameState.socket.on('playerList', (players: any[]) => {
        setGameState((currentState) => ({
          ...currentState,
          players,
        }));
      });

      gameState.socket.on('getId', (id: string) => {
        setGameState((currentState) => ({
          ...currentState,
          id,
        }));
      });

      gameState.socket.on('revealCard', ({ id, card }: { id: string; card: string; }) => {
        console.log(`${id} revealed the card "${card}"`);

        setGameState((currentState) => ({
          ...currentState,
          revealed: {
            ...currentState.revealed,
            [id]: card,
          },
        }));
      });

      gameState.socket.on('hideCard', ({ id }: { id: string }) => {
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
    }
  }, [gameState.socket]);

  return (
    <GameContext.Provider value={[ gameState, setGameState ]}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
