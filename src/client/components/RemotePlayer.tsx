import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { PlayerData } from '../../types/PlayerData';

interface RemotePlayerProps {
  player: PlayerData,
}

const RemotePlayer: React.FC<RemotePlayerProps> = ({ player }) => {
  const [{ revealed }] = useContext(GameContext);
  const { id, name } = player;
  const visibleCard = revealed[id];

  return (
    <div>
      <h2>{name}</h2>
      <div>
        {visibleCard && (
          <span>Player selected {visibleCard}</span>
        )}
        {!visibleCard && (
          <span>Player is selecting a card...</span>
        )}
      </div>
    </div>
  );
};

export default RemotePlayer;
