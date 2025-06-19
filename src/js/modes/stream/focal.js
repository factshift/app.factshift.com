import { ModeHandler } from './base.js';
import { focalPoint, initFocalSquare } from '../focal-point.js';

export class FocalModeHandler extends ModeHandler {
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
