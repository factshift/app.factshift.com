import { ConfigModeHandler } from './base.js';
export class BonkModeHandler extends ConfigModeHandler {
  constructor(container) { super(container, 'bonk'); }
  fallback() {
    return `<div class="bonk-loading">Loading Bonk...</div>`;
  }
}
