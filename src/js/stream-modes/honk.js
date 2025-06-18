import { ConfigModeHandler } from './base.js';
export class HonkModeHandler extends ConfigModeHandler {
  constructor(container) { super(container, 'honk'); }
  fallback() {
    return `<div class="honk-loading">Loading Honk...</div>`;
  }
}
