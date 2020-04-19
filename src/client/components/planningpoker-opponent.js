import { html } from 'https://unpkg.com/lit-html/lit-html.js';
import { component } from 'https://unpkg.com/haunted/haunted.js';

function Opponent({ player, revealed }) {
  return html`
    <div class="player">
      <div class="card">
        ${revealed !== null ? revealed : 'Selecting...'}
      </div>
      <div class="nickname">
        ${player.name}
      </div>
    </div>
  `;
}

customElements.define(
  'planningpoker-opponent',
  component(Opponent, { useShadowDOM: false }),
);
