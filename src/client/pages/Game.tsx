import React from 'react';
import GameContextProvider from '../context/GameContext';
import Players from '../components/Players';

interface GameProps {
  params: {
    gameId: string;
  };
}

const Game: React.FC<GameProps> = ({ params }) => {
  const { gameId } = params;

  return (
    <GameContextProvider gameId={gameId}>
      <h1>Game: {gameId}</h1>
      <Players />
    </GameContextProvider>
  );
};

export default Game;
