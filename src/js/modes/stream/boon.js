import { ModeHandler } from './base.js';

export class BoonModeHandler extends ModeHandler {
  fallback() {
    return `<div class="boon-loading">Loading Boons...</div>`;
  }
  render() {
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

    if (!boon.name || isNaN(boon.x) || isNaN(boon.y) || isNaN(boon.z) || !boon.boonhonk.description || isNaN(boon.boonhonk.level)) {
      this.container.displayMessage('Please fill in all Boon fields correctly.', 'warning');
      return;
    }

    this.container.stream.send(JSON.stringify(boon));

    this.boonNameField.value = '';
    this.boonXField.value = '';
    this.boonYField.value = '';
    this.boonZField.value = '';
    this.boonDescriptionField.value = '';
    this.boonLevelField.value = '';
    this.boonIsActiveField.checked = false;

    this.container.displayMessage('Boon message sent', 'success');
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
