import { ModeHandler } from './base.js';

export class PassiveModeHandler extends ModeHandler {
  fallback() {
    return `<div class="passive-loading">Loading Passive...</div>`;
  }
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
