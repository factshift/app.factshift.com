import { ConfigModeHandler } from './base.js';
export class BoneModeHandler extends ConfigModeHandler {
  constructor(container) { super(container, 'bone'); }
  fallback() {
    return `<div class="bone-loading">Loading Bone...</div>`;
  }
}
