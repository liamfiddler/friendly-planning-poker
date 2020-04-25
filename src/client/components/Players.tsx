import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import Loader from './Loader';
import LocalPlayer from './LocalPlayer';
import RemotePlayer from './RemotePlayer';

const Players: React.FC = () => {
  const [{ socket, id, players }] = useContext(GameContext);

  if (socket === undefined) {
    return <Loader />;
  }

  return (
    <div>
      {players.map((player) => {
        if (player.id === id) {
          return <LocalPlayer />;
        }

        return <RemotePlayer player={player} />;
      })}
    </div>
  );
};

export default Players;
