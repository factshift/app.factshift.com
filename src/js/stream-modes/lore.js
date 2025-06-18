import { ConfigModeHandler } from './base.js';
export class LoreModeHandler extends ConfigModeHandler {
  constructor(container) { super(container, 'lore'); }
  fallback() {
    return `<div class="lore-loading">Loading Lore...</div>`;
  }
}
