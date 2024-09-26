import {NODE_MANAGER} from '../simulation/nodes/nodes';

const html = `<style>
    input {
        background: #222;
        color: var(--accent-color-main);
        padding: 1rem;
        margin: 1rem;
        line-height: 1;
        font-size: 1rem;
        outline: thin solid var(--accent-color-main);
        font-family: var(--font-family), monospace;
    }
    .response-wrapper {
        font-size: .5rem;
    }
</style>
<div class="response-wrapper"></div>
<label class="input-wrapper">
    <span>message</span>
    <input type="text" placeholder="[enter text]"/>
</label>
<button type="submit">Submit</button>
`;


class FactshiftWebSocketContainer extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    const template = document.createElement('template');
    template.innerHTML = html;

    const element = template.content.cloneNode(true);
    shadow.appendChild(element);

    this.ws = new WebSocket(`ws://${window.location.host}/ws`);
    this.messageContainer = shadow.querySelector('.response-wrapper');
    this.inputField = shadow.querySelector('.input-wrapper input');
    this.sendButton = shadow.querySelector('button[type="submit"]');

    this.setupWebSocket();
    this.setupEventListeners();
  }

  copyNodeToClipboard(node) {
    const nodeData = `ID: ${node.id}, Group: ${node.group}`;
    navigator.clipboard.writeText(nodeData).then(() => {
      const message = document.createElement('div');
      message.textContent = `Copied to clipboard: ${nodeData}`;
      this.messageContainer.appendChild(message);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  setupWebSocket() {
    this.ws.onmessage = ({data}) => {
      const newMessage = document.createElement('pre');
      let nodes = JSON.parse(data);

      console.log(nodes);

      NODE_MANAGER.initNodes(nodes.map(node => ({
        ...node,
        callbacks: {
          click: (e, d) => {
          }
        }
      })))
      window.spwashi.reinit();

      newMessage.textContent = `${JSON.stringify(nodes, null, 2)}`;
      this.messageContainer.appendChild(newMessage);
    };

    this.ws.onclose = () => {
      const closedMessage = document.createElement('div');
      closedMessage.textContent = 'WebSocket connection closed';
      this.messageContainer.appendChild(closedMessage);
    };

    this.ws.onerror = () => {
      const errorMessage = document.createElement('div');
      errorMessage.textContent = 'WebSocket error';
      this.messageContainer.appendChild(errorMessage);
    };
  }

  setupEventListeners() {
    this.sendButton.addEventListener('click', () => {
      const message = this.inputField.value;
      if (message) {
        this.ws.send(message);
        this.inputField.value = '';  // Clear the input field
      }
    });
  }
}

export function initWebSocketContainer() {
  customElements.define('factshift-websocket-container', FactshiftWebSocketContainer);
}