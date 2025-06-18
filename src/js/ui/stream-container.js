// stream-container.js

import { NODE_MANAGER } from '../simulation/nodes/nodes';
import { DataManager } from '../services/data-manager.js';
import { MODE_DOCS } from '../config/mode-docs.js';
import { BoofModeHandler } from './modes/boof.js';
import { BoonModeHandler } from './modes/boon.js';
import { BaneModeHandler } from './modes/bane.js';
import { BoneModeHandler } from './modes/bone.js';
import { BonkModeHandler } from './modes/bonk.js';
import { HonkModeHandler } from './modes/honk.js';
import { LoreModeHandler } from './modes/lore.js';
import { FocalModeHandler } from './modes/focal.js';
import { PassiveModeHandler } from './modes/passive.js';

const BOON_ITEMS = [];
const BANE_ITEMS = [];
const BONE_ITEMS = [];
const BONK_ITEMS = [];
const HONK_ITEMS = [];
const BOOF_ITEMS = [];
const LORE_ITEMS = [];
const FOCAL_ITEMS = [];
const PASSIVE_ITEMS = [];

const modeConfig = {
  boon:  { strategy: 'static', staticItems: BOON_ITEMS, allowedStreams: ['static', 'live'] },
  bane:  { strategy: 'static', staticItems: BANE_ITEMS, allowedStreams: ['static'] },
  bone:  { strategy: 'static', staticItems: BONE_ITEMS, allowedStreams: ['static'] },
  bonk:  { strategy: 'static', staticItems: BONK_ITEMS, allowedStreams: ['static'] },
  honk:  { strategy: 'static', staticItems: HONK_ITEMS, allowedStreams: ['static'] },
  boof:  { strategy: 'static', staticItems: BOOF_ITEMS, allowedStreams: ['static', 'live'] },
  lore:  { strategy: 'static', staticItems: LORE_ITEMS, allowedStreams: ['static'] },
  focal: { strategy: 'static', staticItems: FOCAL_ITEMS, allowedStreams: ['static', 'live'] },
  passive: { strategy: 'static', staticItems: PASSIVE_ITEMS, allowedStreams: ['static', 'live'] },
};
/**
 * Main stream container class.
 */
class SpwashiStreamContainer extends HTMLElement {
  constructor() {
    super();
    this.currentMode = 'boon';
    this.initDataManager();
    this.modeHandlers = {
      boof: BoofModeHandler,
      boon: BoonModeHandler,
      bane: BaneModeHandler,
      bone: BoneModeHandler,
      bonk: BonkModeHandler,
      honk: HonkModeHandler,
      lore: LoreModeHandler,
      focal: FocalModeHandler,
      passive: PassiveModeHandler,
    };
  /**
   * Initializes the stream container and its event listeners.
   */
  setupStreamContainer() {
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render(); // Render the initial UI

    const room = document.getElementById("title-md5").innerText;
    console.log("ancient knowledge being used ... title-md5");
    try {
      this.stream = new WebSocket(`ws://${window.location.host}/ws/${room}`);
      this.setupStream();
    } catch (e) {
      console.warn("WebSocket unavailable", e);
      this.stream = { readyState: -1, send: () => {} };
    }
  }
  /**
   * Renders the UI based on the current mode.
   */
  render() {
    const template = document.createElement('template');
    template.innerHTML = this.getTemplateHtml();
    // Clear the shadow DOM and append the new content
    this.shadow.innerHTML = '';
    this.shadow.appendChild(template.content.cloneNode(true));

    // Always get reference to message container
    this.messageContainer = this.shadow.querySelector('.response-wrapper');

    // Get references to mode selection elements
    this.modeSelector = this.shadow.querySelector('.mode-selector select');
    this.modeSelector.value = this.currentMode;

    // Cleanup previous mode handler
    if (this.currentModeHandler) {
      this.currentModeHandler.cleanup();
    }

    // Initialize the current mode handler
    const ModeHandlerClass = this.modeHandlers[this.currentMode];
    if (ModeHandlerClass) {
      this.currentModeHandler = new ModeHandlerClass(this);
      this.currentModeHandler.setupEventListeners();
    } else {
      this.currentModeHandler = null;
    }

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Returns the HTML template for the component.
   */
  getTemplateHtml() {
    const modes = ['boon', 'bane', 'bone', 'bonk', 'honk', 'boof', 'lore', 'focal', 'passive'];
    const optionsHtml = modes
        .map(
            (mode) =>
                `<option value="${mode}" ${
                    this.currentMode === mode ? 'selected' : ''
                }>${mode.charAt(0).toUpperCase() + mode.slice(1)}</option>`
        )
        .join('');

    const docInfo = MODE_DOCS[this.currentMode] || {};
    const docsLink = docInfo.url || docInfo.file || '';

    let modeSpecificHtml = '';
    if (this.modeHandlers[this.currentMode]) {
      modeSpecificHtml = this.modeHandlers[this.currentMode].prototype.render();
    }

    return `
      <style>
        * {
          font-size: 0.9rem;
          box-sizing: border-box;
        }
        input, select, button {
          font-family: var(--font-family, monospace);
        }
        input, select {
          background: var(--form-background, #222);
          color: var(--accent-color-main, #f5deb3);
          padding: 0.5rem;
          margin: 0.5rem 0;
          font-size: 1rem;
          outline: thin solid var(--accent-color-main, #f5deb3);
          width: 100%;
        }
        label {
          display: flex;
          flex-direction: column;
          margin-bottom: 0.5rem;
        }
        fieldset {
          border: 1px solid var(--accent-color-main, #f5deb3);
          padding: 0.5rem;
          margin-bottom: 1rem;
        }
        legend {
          padding: 0 0.5rem;
        }
        .response-wrapper {
          font-size: 0.75rem;
          padding: 1rem;
          max-height: 200px;
          overflow-y: auto;
          background: #111;
          margin-bottom: 1rem;
        }
        .boon-form, .input-wrapper {
          margin-bottom: 1rem;
        }
        .boon-form section {
          display: flex;
          flex-direction: row;
        }
        button {
          padding: 0.5rem 1rem;
          margin: 0.5rem 0;
          background: var(--accent-color-main, #f5deb3);
          color: #fff;
          border: none;
          cursor: pointer;
          width: 100%;
        }
        button:hover {
          background: var(--accent-color-hover, #b6ae9a);
        }
        .mode-selector {
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .mode-selector select {
          padding: 0.5rem;
          font-size: 1rem;
        }
        .mode-docs-link {
          font-size: 0.8rem;
        }
        .message.info {
          color: var(--info-color, #00f);
        }
        .message.success {
          color: var(--success-color, #0f0);
        }
        .message.warning {
          color: var(--warning-color, #ff0);
        }
        .message.error {
          color: var(--error-color, #f00);
        }
        .boof-message {
          color: var(--accent-color-main, #f5deb3);
        }
      </style>
      <div class="mode-selector">
        <label>
          Select Mode:
          <select aria-label="Select Mode">
            ${optionsHtml}
          </select>
        </label>
        ${docsLink ? `<a href="${docsLink}" class="mode-docs-link" target="_blank" rel="noopener">API Docs</a>` : ''}
      </div>
      <div class="response-wrapper" aria-live="polite"></div>
      ${modeSpecificHtml}
    `;
  }

  /**
   * Sets up stream event listeners for message handling and error reporting.
   */
  setupStream() {
    this.stream.onmessage = (event) => this.handleStreamMessage(event);
    this.stream.onopen = () => {
      this.displayMessage('Stream connection opened', 'success');
      this.dispatchEvent(new Event('stream-open'));
    };
    this.stream.onclose = () => {
      this.displayMessage('Stream connection closed', 'warning');
      this.dispatchEvent(new Event('stream-close'));
    };
    this.stream.onerror = () => {
      this.displayMessage('Stream error', 'error');
      this.dispatchEvent(new Event('stream-error'));
    };
  }

  initDataManager() {
    const cfg = modeConfig[this.currentMode] || modeConfig.boon;
    const strategy =
      (cfg.allowedStreams || [cfg.strategy]).includes(window.spwashi.streamStrategy)
        ? window.spwashi.streamStrategy
        : cfg.strategy;
    this.dataManager = new DataManager({ mode: this.currentMode, ...cfg, strategy });
  }

  /**
   * Sets up event listeners for user input interactions.
   */
  setupEventListeners() {
    // Remove any existing event listeners to prevent duplicates
    if (this.modeSelector) {
      this.modeSelector.removeEventListener('change', this.handleModeChangeBound);
    }

    if (this.streamStrategyChangeBound) {
      document.removeEventListener('stream-strategy-change', this.streamStrategyChangeBound);
    }

    // Mode selector event listener
    this.handleModeChangeBound = this.handleModeChange.bind(this);
    this.modeSelector.addEventListener('change', this.handleModeChangeBound);

    this.streamStrategyChangeBound = this.handleStreamStrategyChange.bind(this);
    document.addEventListener('stream-strategy-change', this.streamStrategyChangeBound);
  }

  /**
   * Handles the mode change event.
   */
  handleModeChange() {
    this.currentMode = this.modeSelector.value;
    this.initDataManager();
    this.render(); // Re-render the UI based on the new mode
    // Emit custom event
    this.dispatchEvent(new CustomEvent('mode-changed', { detail: { mode: this.currentMode } }));
  }

  handleStreamStrategyChange() {
    this.initDataManager();
  }

  /**
   * Handles incoming stream messages, delegating to the current mode handler.
   *
   * @param {MessageEvent} event - The stream message event.
   */
  handleStreamMessage(event) {
    try {
      const data = JSON.parse(event.data);

      if (this.currentModeHandler && typeof this.currentModeHandler.handleStreamMessage === 'function') {
        this.currentModeHandler.handleStreamMessage(data);
      } else {
        // Default handling for messages not processed by mode handlers
        if (data.image_id) {
          this.displayMessage(`Received image with ID: ${data.image_id}`);
        } else {
          this.displayMessage(`Received message: ${event.data}`, 'info');
        }
      }
    } catch (error) {
      console.error('Error processing stream message:', error);
      this.displayMessage('Failed to process stream data.', 'error');
    }
  }

  /**
   * Processes a Boon object received from the server.
   *
   * @param {Object} boon - The Boon object to process.
   */
  processBoon(boon) {
    // Process the Boon object, e.g., add it to the NODE_MANAGER
    const node = {
      ...boon,
      fx: boon.x,
      fy: boon.y,
      id: `${boon.id}`, // Ensure id is a string
      callbacks: {
        click: (e, d) => {
          console.debug('Node clicked:', d);
        },
      },
    };
    NODE_MANAGER.initNodes([node], true);
    window.spwashi.reinit();

    // Display the Boon in the message container
    const boonElement = document.createElement('pre');
    boonElement.textContent = `Boon: ${boon.name}, Position: (${boon.x}, ${boon.y}, ${boon.z}), Description: ${boon.boonhonk.description}, Level: ${boon.boonhonk.level}, Active: ${boon.boonhonk.is_active}`;
    this.messageContainer.appendChild(boonElement);
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;

    // Emit custom event
    this.dispatchEvent(new CustomEvent('boon-processed', { detail: boon }));
  }

  /**
   * Displays a Boof message in the message container.
   *
   * @param {Object} boof - The Boof message object.
   */
  displayBoof(boof) {
    const boofElement = document.createElement('div');
    boofElement.textContent = `Boof: ${boof.content}`;
    boofElement.classList.add('boof-message');
    this.messageContainer.appendChild(boofElement);
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }

  /**
   * Displays a message in the message container.
   *
   * @param {string} message - The message to display.
   * @param {string} [type] - Optional message type for styling (e.g., 'info', 'success', 'warning', 'error').
   */
  displayMessage(message, type = 'info') {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('message', type);
    this.messageContainer.appendChild(messageElement);
    // Scroll to the bottom to show the latest message
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }
}

/**
 * Initializes and defines the custom stream container element.
*/
export function initStreamContainer() {
  customElements.define('spwashi-stream-container', SpwashiStreamContainer);
}
