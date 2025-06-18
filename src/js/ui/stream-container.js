// stream-container.js

import { NODE_MANAGER } from '../simulation/nodes/nodes';
import { focalPoint, initFocalSquare } from './focal-point';
import { DataManager } from '../services/data-manager.js';

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
 * Base class for different modes.
 */
class ModeHandler {
  constructor(container) {
    this.container = container;
  }

  setupDataManager() {
    if (!this.container.dataManager) return;
    this.container.dataManager
      .getAll()
      .then((items) => {
        if (typeof this.renderItems === 'function') {
          this.renderItems(items);
        }
      });
    if (typeof this.container.dataManager.onUpdate === 'function') {
      this.updateCb = (item) => {
        if (typeof this.renderItem === 'function') {
          this.renderItem(item);
        }
      };
      this.container.dataManager.onUpdate(this.updateCb);
    }
  }

  render() {
    return '';
  }

  setupEventListeners() {
    this.setupDataManager();
  }

  handleStreamMessage(data) {}

  cleanup() {
    if (this.updateCb && this.container.dataManager) {
      this.container.dataManager.offUpdate(this.updateCb);
    }
  }
}
/**
 * Generic configurable mode handler.
 */
class ConfigModeHandler extends ModeHandler {
  constructor(container, mode) {
    super(container);
    this.mode = mode;
    this.storageKey = `${mode}-settings`;
  }

  getDefaults() {
    return { name: '', description: '', intensity: 5, active: false, visible: true };
  }

  loadSettings() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || this.getDefaults();
    } catch {
      return this.getDefaults();
    }
  }

  render() {
    const vals = this.loadSettings();
    return `
      <form class="mode-form" data-mode="${this.mode}">
        <h3>${this.mode.charAt(0).toUpperCase() + this.mode.slice(1)} Settings</h3>
        <label>Name<input type="text" class="mode-name" value="${vals.name}"/></label>
        <label>Description<input type="text" class="mode-description" value="${vals.description}"/></label>
        <label>Intensity<input type="range" min="1" max="10" class="mode-intensity" value="${vals.intensity}"/></label>
        <label><input type="checkbox" class="mode-active" ${vals.active ? 'checked' : ''}/>Active</label>
        <label><input type="checkbox" class="mode-visible" ${vals.visible ? 'checked' : ''}/>Visible</label>
        <div class="button-group">
          <button type="button" class="save-settings">Save Settings</button>
          <button type="button" class="send-settings">Send to Backend</button>
        </div>
      </form>
    `;
  }

  setupEventListeners() {
    this.form = this.container.shadow.querySelector(`form[data-mode="${this.mode}"]`);
    if (!this.form) return;
    this.nameField = this.form.querySelector('.mode-name');
    this.descField = this.form.querySelector('.mode-description');
    this.intensityField = this.form.querySelector('.mode-intensity');
    this.activeField = this.form.querySelector('.mode-active');
    this.visibleField = this.form.querySelector('.mode-visible');
    this.saveBtn = this.form.querySelector('.save-settings');
    this.sendBtn = this.form.querySelector('.send-settings');
    this.saveBound = this.saveSettings.bind(this);
    this.sendBound = this.sendSettings.bind(this);
    this.saveBtn.addEventListener('click', this.saveBound);
    this.sendBtn.addEventListener('click', this.sendBound);
    super.setupEventListeners();
  }

  getSettings() {
    return {
      name: this.nameField.value.trim(),
      description: this.descField.value.trim(),
      intensity: parseInt(this.intensityField.value, 10),
      active: this.activeField.checked,
      visible: this.visibleField.checked,
    };
  }

  saveSettings() {
    const data = this.getSettings();
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    this.container.displayMessage(`${this.mode} settings saved locally`, 'success');
  }

  sendSettings() {
    const data = this.getSettings();
    if (this.container.stream && this.container.stream.readyState === WebSocket.OPEN) {
      this.container.stream.send(JSON.stringify({ type: `${this.mode}-settings`, data }));
      this.container.displayMessage(`${this.mode} settings sent`, 'info');
    } else {
      this.container.displayMessage('WebSocket not connected. Settings stored locally.', 'warning');
    }
  }

  cleanup() {
    if (this.saveBtn) this.saveBtn.removeEventListener('click', this.saveBound);
    if (this.sendBtn) this.sendBtn.removeEventListener('click', this.sendBound);
    super.cleanup();
  }
}

/**
 * Handler for Boof mode.
 */
class BoofModeHandler extends ModeHandler {
  render() {
    return `
      <div class="input-wrapper">
        <label for="boof-input">Enter Boof Message:</label>
        <input type="text" id="boof-input" class="boof-input" placeholder="Type your message here" />
        <button class="boof-submit">Send Boof</button>
      </div>
    `;
  }

  setupEventListeners() {
    this.boofInputField = this.container.shadow.querySelector('.boof-input');
    this.boofButton = this.container.shadow.querySelector('.boof-submit');
    this.sendBoofMessageBound = this.sendBoofMessage.bind(this);
    this.boofButton.addEventListener('click', this.sendBoofMessageBound);
    super.setupEventListeners();
  }

  handleStreamMessage(data) {
    if (data.content) {
      this.container.displayBoof(data);
      // Emit custom event
      this.container.dispatchEvent(new CustomEvent('boof-received', { detail: data }));
    }
  }

  sendBoofMessage() {
    const message = this.boofInputField.value.trim();
    if (message) {
      this.container.stream.send(message);
      this.boofInputField.value = ''; // Clear the input field after sending
      this.container.displayMessage('Boof message sent', 'success');
      // Emit custom event
      this.container.dispatchEvent(new CustomEvent('boof-sent', { detail: { content: message } }));
    } else {
      this.container.displayMessage('Cannot send an empty Boof message', 'warning');
    }
  }

  cleanup() {
    if (this.boofButton) {
      this.boofButton.removeEventListener('click', this.sendBoofMessageBound);
    }
    super.cleanup();
  }

  renderItems(items) {
    items.forEach((item) => this.renderItem(item));
  }

  renderItem(item) {
    this.container.displayBoof(item);
  }
}

/**
 * Handler for Boon mode.
 */
class BoonModeHandler extends ModeHandler {
  render() {
    // Set default values
    const defaultValues = {
      name: 'Default Boon Name',
      x: 0,
      y: 0,
      z: 0,
      description: 'Default description for the boon',
      level: 1,
      isActive: true,
    };

    return `
      <div class="boon-form">
        <h3>Create Boon</h3>
        <section>
          <fieldset>
            <legend>Basic Information</legend>
            <label for="boon-name">Name:</label>
            <input type="text" id="boon-name" class="boon-name" placeholder="Enter name" value="${defaultValues.name}" />
          </fieldset>
          <fieldset>
            <legend>Position</legend>
            <label for="boon-x">X:</label>
            <input type="number" id="boon-x" class="boon-x" placeholder="X-coordinate" value="${defaultValues.x}" />
            <label for="boon-y">Y:</label>
            <input type="number" id="boon-y" class="boon-y" placeholder="Y-coordinate" value="${defaultValues.y}" />
            <label for="boon-z">Z:</label>
            <input type="number" id="boon-z" class="boon-z" placeholder="Z-coordinate" value="${defaultValues.z}" />
          </fieldset>
          <fieldset>
            <legend>Boon Details</legend>
            <label for="boon-description">Description:</label>
            <input type="text" id="boon-description" class="boon-description" placeholder="Describe the boon" value="${defaultValues.description}" />
            <label for="boon-level">Level:</label>
            <input type="number" id="boon-level" class="boon-level" placeholder="Enter level" value="${defaultValues.level}" />
            <label for="boon-is-active">
              <input type="checkbox" id="boon-is-active" class="boon-is-active" ${defaultValues.isActive ? 'checked' : ''} />
              Is Active
            </label>
          </fieldset>
        </section>
        <button class="boon-submit">Send Boon</button>
      </div>
    `;
  }

  setupEventListeners() {
    const shadow = this.container.shadow;
    this.boonNameField = shadow.querySelector('.boon-name');
    this.boonXField = shadow.querySelector('.boon-x');
    this.boonYField = shadow.querySelector('.boon-y');
    this.boonZField = shadow.querySelector('.boon-z');
    this.boonDescriptionField = shadow.querySelector('.boon-description');
    this.boonLevelField = shadow.querySelector('.boon-level');
    this.boonIsActiveField = shadow.querySelector('.boon-is-active');
    this.boonButton = shadow.querySelector('.boon-submit');

    this.sendBoonMessageBound = this.sendBoonMessage.bind(this);
    this.boonButton.addEventListener('click', this.sendBoonMessageBound);

    super.setupEventListeners();
  }

  handleStreamMessage(data) {
    if (data.id && data.name && data.boonhonk) {
      this.container.processBoon(data);
      // Emit custom event
      this.container.dispatchEvent(new CustomEvent('boon-received', { detail: data }));
    }
  }

  sendBoonMessage() {
    const boon = {
      id: Date.now(),
      name: this.boonNameField.value.trim(),
      x: parseFloat(this.boonXField.value),
      y: parseFloat(this.boonYField.value),
      z: parseFloat(this.boonZField.value),
      boonhonk: {
        description: this.boonDescriptionField.value.trim(),
        level: parseInt(this.boonLevelField.value, 10),
        is_active: this.boonIsActiveField.checked,
      },
      image_id: null,
    };

    // Validate the boon data
    if (
        !boon.name ||
        isNaN(boon.x) ||
        isNaN(boon.y) ||
        isNaN(boon.z) ||
        !boon.boonhonk.description ||
        isNaN(boon.boonhonk.level)
    ) {
      this.container.displayMessage('Please fill in all Boon fields correctly.', 'warning');
      return;
    }

    // Send the Boon as a JSON string
    this.container.stream.send(JSON.stringify(boon));

    // Clear the form fields
    this.boonNameField.value = '';
    this.boonXField.value = '';
    this.boonYField.value = '';
    this.boonZField.value = '';
    this.boonDescriptionField.value = '';
    this.boonLevelField.value = '';
    this.boonIsActiveField.checked = false;

    this.container.displayMessage('Boon message sent', 'success');
    // Emit custom event
    this.container.dispatchEvent(new CustomEvent('boon-sent', { detail: boon }));
  }

  cleanup() {
    if (this.boonButton) {
      this.boonButton.removeEventListener('click', this.sendBoonMessageBound);
    }
    super.cleanup();
  }

  renderItems(items) {
    items.forEach((item) => this.renderItem(item));
  }

  renderItem(item) {
    this.container.processBoon(item);
  }
}

/**
 * Handler for Focal mode.
 */
class FocalModeHandler extends ModeHandler {
  render() {
    return `
      <button class="focal-submit">Set Focal Point</button>
    `;
  }

  setupEventListeners() {
    this.focalButton = this.container.shadow.querySelector('.focal-submit');
    this.setFocalPointBound = this.setFocalPoint.bind(this);
    this.focalButton.addEventListener('click', this.setFocalPointBound);
    initFocalSquare();
    super.setupEventListeners();
  }

  handleStreamMessage(data) {
    if (data.type === 'focal-point') {
      this.container.displayMessage(`Focal point updated: ${JSON.stringify(data.position)}`);
      // Emit custom event
      this.container.dispatchEvent(new CustomEvent('focal-point-received', { detail: data }));
    }
  }

  setFocalPoint() {
    const bounds = {
      x1: focalPoint.x - 50,
      y1: focalPoint.y - 50,
      x2: focalPoint.x + 50,
      y2: focalPoint.y + 50,
    };

    const focalData = {
      type: 'focal-point',
      position: { x: focalPoint.x, y: focalPoint.y },
      bounds,
    };

    this.container.stream.send(JSON.stringify(focalData));
    this.container.displayMessage(
        `Focal point sent with position (${focalData.position.x}, ${focalData.position.y}) and bounds (${bounds.x1}, ${bounds.y1}, ${bounds.x2}, ${bounds.y2})`,
        'success'
    );
    // Emit custom event
    this.container.dispatchEvent(new CustomEvent('focal-point-sent', { detail: focalData }));
  }

  cleanup() {
    if (this.focalButton) {
      this.focalButton.removeEventListener('click', this.setFocalPointBound);
    }
    super.cleanup();
  }

  renderItems(items) {
    items.forEach((item) => this.renderItem(item));
  }

  renderItem(item) {
    this.container.displayMessage(`[focal] ${JSON.stringify(item)}`);
  }
}

/**
 * Handler for Passive mode.
 */
class PassiveModeHandler extends ModeHandler {
  render() {
    return `<div class="passive-message">Passive mode active. Waiting for updates…</div>`;
  }

  renderItems(items) {
    items.forEach((item) => this.renderItem(item));
  }

  renderItem(item) {
    this.container.displayMessage(`[passive] ${JSON.stringify(item)}`);
  }
}

/**
/** Generic handlers for additional modes **/
class BaneModeHandler extends ConfigModeHandler {
  constructor(container) { super(container, 'bane'); }
}
class BoneModeHandler extends ConfigModeHandler {
  constructor(container) { super(container, 'bone'); }
}
class BonkModeHandler extends ConfigModeHandler {
  constructor(container) { super(container, 'bonk'); }
}
class HonkModeHandler extends ConfigModeHandler {
  constructor(container) { super(container, 'honk'); }
}
class LoreModeHandler extends ConfigModeHandler {
  constructor(container) { super(container, "lore"); }
}
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
        }
        .mode-selector select {
          padding: 0.5rem;
          font-size: 1rem;
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
