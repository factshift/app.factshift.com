// websocket-container.js

import { NODE_MANAGER } from '../simulation/nodes/nodes';
import { focalPoint, initFocalSquare } from './focal-point';

/**
 * Base class for different modes.
 */
class ModeHandler {
  constructor(container) {
    this.container = container;
  }

  render() {
    return '';
  }

  setupEventListeners() {}

  handleWebSocketMessage(data) {}

  cleanup() {}
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
  }

  handleWebSocketMessage(data) {
    if (data.content) {
      this.container.displayBoof(data);
      // Emit custom event
      this.container.dispatchEvent(new CustomEvent('boof-received', { detail: data }));
    }
  }

  sendBoofMessage() {
    const message = this.boofInputField.value.trim();
    if (message) {
      this.container.ws.send(message);
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
  }

  handleWebSocketMessage(data) {
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
    this.container.ws.send(JSON.stringify(boon));

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
  }

  handleWebSocketMessage(data) {
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

    this.container.ws.send(JSON.stringify(focalData));
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
  }
}

/**
 * Main WebSocket container class.
 */
class SpwashiWebSocketContainer extends HTMLElement {
  constructor() {
    super();
    this.currentMode = 'boof';
    this.modeHandlers = {
      boof: BoofModeHandler,
      boon: BoonModeHandler,
      focal: FocalModeHandler,
      // Additional modes can be added here
    };
    this.setupWebSocketContainer();
  }

  /**
   * Initializes the WebSocket container and its event listeners.
   */
  setupWebSocketContainer() {
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render(); // Render the initial UI

    const room = document.getElementById('title-md5').innerText
    console.log('ancient knowledge being used ... title-md5')
    this.ws = new WebSocket(`ws://${window.location.host}/ws/${room}`);
    this.setupWebSocket();
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
    const modes = ['passive', 'boof', 'boon', 'focal'];
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
   * Sets up WebSocket event listeners for message handling and error reporting.
   */
  setupWebSocket() {
    this.ws.onmessage = (event) => this.handleWebSocketMessage(event);
    this.ws.onopen = () => {
      this.displayMessage('WebSocket connection opened', 'success');
      this.dispatchEvent(new Event('ws-open'));
    };
    this.ws.onclose = () => {
      this.displayMessage('WebSocket connection closed', 'warning');
      this.dispatchEvent(new Event('ws-close'));
    };
    this.ws.onerror = () => {
      this.displayMessage('WebSocket error', 'error');
      this.dispatchEvent(new Event('ws-error'));
    };
  }

  /**
   * Sets up event listeners for user input interactions.
   */
  setupEventListeners() {
    // Remove any existing event listeners to prevent duplicates
    if (this.modeSelector) {
      this.modeSelector.removeEventListener('change', this.handleModeChangeBound);
    }

    // Mode selector event listener
    this.handleModeChangeBound = this.handleModeChange.bind(this);
    this.modeSelector.addEventListener('change', this.handleModeChangeBound);
  }

  /**
   * Handles the mode change event.
   */
  handleModeChange() {
    this.currentMode = this.modeSelector.value;
    this.render(); // Re-render the UI based on the new mode
    // Emit custom event
    this.dispatchEvent(new CustomEvent('mode-changed', { detail: { mode: this.currentMode } }));
  }

  /**
   * Handles incoming WebSocket messages, delegating to the current mode handler.
   *
   * @param {MessageEvent} event - The WebSocket message event.
   */
  handleWebSocketMessage(event) {
    try {
      const data = JSON.parse(event.data);

      if (this.currentModeHandler && typeof this.currentModeHandler.handleWebSocketMessage === 'function') {
        this.currentModeHandler.handleWebSocketMessage(data);
      } else {
        // Default handling for messages not processed by mode handlers
        if (data.image_id) {
          this.displayMessage(`Received image with ID: ${data.image_id}`);
        } else {
          this.displayMessage(`Received message: ${event.data}`, 'info');
        }
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
      this.displayMessage('Failed to process WebSocket data.', 'error');
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
 * Initializes and defines the custom WebSocket container element.
 */
export function initWebSocketContainer() {
  customElements.define('spwashi-websocket-container', SpwashiWebSocketContainer);
}
