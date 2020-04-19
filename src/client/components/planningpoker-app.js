import { html } from 'https://unpkg.com/lit-html/lit-html.js';
import { component, useCallback, useEffect, useState } from 'https://unpkg.com/haunted/haunted.js';
import { addListeners } from '../listeners.js';
import './planningpoker-opponent.js';

const shortId = () => Math.random().toString(36).slice(-9).toUpperCase();

function App() {
  const [gameState, setGameState] = useState({
    socket: undefined,
    gameId: undefined,
    id: undefined,
    name: undefined,
    players: [],
    revealed: {},
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = prompt('What is your name?', '');

    setGameState((currentState) => ({
      ...currentState,
      socket: io(),
      gameId: urlParams.get('gameId') || shortId(),
      name,
    }));
  }, []);

  useEffect(() => {
    if (gameState.socket) {
      addListeners(gameState, setGameState);
    }
  }, [gameState.socket]);

  const revealCard = useCallback(() => {
    const card = Math.ceil(Math.random() * 10);
    gameState.socket.emit('revealCard', card);
  }, [gameState.socket]);

  const hideCard = useCallback(() => {
    gameState.socket.emit('hideCard');
  }, [gameState.socket]);

  return html`
    <main>
      Game ID: ${gameState && gameState.gameId}<br />
      <div class="players">
        ${gameState && gameState.players.map((player) => {
          if (player.id === gameState.id) {
            return html`
              <div class="player">
                <div class="card">
                  <button type="button" @click=${revealCard}>Reveal</button>
                  <button type="button" @click=${hideCard}>Hide</button>
                </div>
                <div class="nickname">
                  ${player.name}
                </div>
              </div>
            `;
          }

          return html`
            <planningpoker-opponent
              .player=${player}
              .revealed=${gameState.revealed[player.id]}
            ></planningpoker-opponent>
          `;
        })}
      </div>
    </main>
  `;
}

customElements.define(
  'planningpoker-app',
  component(App, { useShadowDOM: false }),
);
