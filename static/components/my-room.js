import { html } from 'https://unpkg.com/lit-html/lit-html.js';
import { component, useState } from 'https://unpkg.com/haunted/haunted.js';
import useInterval from '../hooks/useInterval.js';

function Room() {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('room') || Math.random().toString(36).slice(-9).toUpperCase();
  const [players, setPlayers] = useState([]);

  useInterval(async () => {
    if (!document.hidden) {
      const response = await fetch(`/api/room/${roomId}`);
      const roomStatus = await response.json();
      setPlayers(roomStatus.players);
    }
  }, 3000);

  return html`
    <main>
      ROOM: ${roomId}<br>
      <pre>${JSON.stringify(players, null, 2)}</pre>
    </main>
  `;
}

customElements.define('my-room', component(Room, { useShadowDOM: false }));
