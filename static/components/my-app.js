import { html } from 'https://unpkg.com/lit-html/lit-html.js';
import { component, useState } from 'https://unpkg.com/haunted/haunted.js';
import useInterval from '../hooks/useInterval.js';

const PLAYER_ID_KEY = 'playerId';

const shortId = () => Math.random().toString(36).slice(-9).toUpperCase();

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('room') || shortId();
  const playerId = localStorage.getItem(PLAYER_ID_KEY) || shortId();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // do something?
    // At this point in the project I realised socket.io might be a better choice....
  }, []);

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

customElements.define('my-app', component(App, { useShadowDOM: false }));
