import React, { useCallback, useContext, useState, ChangeEvent } from 'react';
import { GameContext } from '../context/GameContext';

const LocalPlayer: React.FC = () => {
  const [{ socket, id, name, revealed }] = useContext(GameContext);
  const [card, setCard] = useState(1);
  const visibleCard = revealed[id];

  const onChangeCard = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const cardNum = parseFloat(event.target.value);
    setCard(cardNum);
  }, [setCard]);

  const revealCard = useCallback(() => {
    socket.emit('revealCard', card);
  }, [socket, card]);

  const hideCard = useCallback(() => {
    socket.emit('hideCard');
  }, [socket]);

  return (
    <div>
      <h2>{name}</h2>
      <div>
        <input type="number" value={card} onChange={onChangeCard} disabled={!!visibleCard} />
        {visibleCard && <button type="button" onClick={hideCard}>Hide</button>}
        {!visibleCard && <button type="button" onClick={revealCard}>Reveal</button>}
      </div>
    </div>
  );
};

export default LocalPlayer;
