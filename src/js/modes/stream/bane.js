import { ConfigModeHandler } from './base.js';
export class BaneModeHandler extends ConfigModeHandler {
  constructor(container) { super(container, 'bane'); }
  fallback() {
    return `<div class="bane-loading">Loading Bane...</div>`;
  }
}
