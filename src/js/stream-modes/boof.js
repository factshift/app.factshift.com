import { ModeHandler } from './base.js';

export class BoofModeHandler extends ModeHandler {
  fallback() {
    return `<div class="boof-loading">Loading Boof...</div>`;
  }
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
      this.container.dispatchEvent(new CustomEvent('boof-received', { detail: data }));
    }
  }

  sendBoofMessage() {
    const message = this.boofInputField.value.trim();
    if (message) {
      this.container.stream.send(message);
      this.boofInputField.value = '';
      this.container.displayMessage('Boof message sent', 'success');
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
