export class ModeHandler {
  constructor(container) {
    this.container = container;
  }

  setupDataManager() {
    if (!this.container.dataManager) return;
    this.container.dataManager
      .getAll()
      .then((items) => {
        if (typeof this.renderItems === 'function') {
          this.renderItems(items);
        }
      });
    if (typeof this.container.dataManager.onUpdate === 'function') {
      this.updateCb = (item) => {
        if (typeof this.renderItem === 'function') {
          this.renderItem(item);
        }
      };
      this.container.dataManager.onUpdate(this.updateCb);
    }
  }

  render() {
    return '';
  }

  setupEventListeners() {
    this.setupDataManager();
  }

  handleStreamMessage(data) {}

  cleanup() {
    if (this.updateCb && this.container.dataManager) {
      this.container.dataManager.offUpdate(this.updateCb);
    }
  }
}

export class ConfigModeHandler extends ModeHandler {
  constructor(container, mode) {
    super(container);
    this.mode = mode;
    this.storageKey = `${mode}-settings`;
  }

  getDefaults() {
    return { name: '', description: '', intensity: 5, active: false, visible: true };
  }

  loadSettings() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || this.getDefaults();
    } catch {
      return this.getDefaults();
    }
  }

  render() {
    const vals = this.loadSettings();
    return `
      <form class="mode-form" data-mode="${this.mode}">
        <h3>${this.mode.charAt(0).toUpperCase() + this.mode.slice(1)} Settings</h3>
        <label>Name<input type="text" class="mode-name" value="${vals.name}"/></label>
        <label>Description<input type="text" class="mode-description" value="${vals.description}"/></label>
        <label>Intensity<input type="range" min="1" max="10" class="mode-intensity" value="${vals.intensity}"/></label>
        <label><input type="checkbox" class="mode-active" ${vals.active ? 'checked' : ''}/>Active</label>
        <label><input type="checkbox" class="mode-visible" ${vals.visible ? 'checked' : ''}/>Visible</label>
        <div class="button-group">
          <button type="button" class="save-settings">Save Settings</button>
          <button type="button" class="send-settings">Send to Backend</button>
        </div>
      </form>
    `;
  }

  setupEventListeners() {
    this.form = this.container.shadow.querySelector(`form[data-mode="${this.mode}"]`);
    if (!this.form) return;
    this.nameField = this.form.querySelector('.mode-name');
    this.descField = this.form.querySelector('.mode-description');
    this.intensityField = this.form.querySelector('.mode-intensity');
    this.activeField = this.form.querySelector('.mode-active');
    this.visibleField = this.form.querySelector('.mode-visible');
    this.saveBtn = this.form.querySelector('.save-settings');
    this.sendBtn = this.form.querySelector('.send-settings');
    this.saveBound = this.saveSettings.bind(this);
    this.sendBound = this.sendSettings.bind(this);
    this.saveBtn.addEventListener('click', this.saveBound);
    this.sendBtn.addEventListener('click', this.sendBound);
    super.setupEventListeners();
  }

  getSettings() {
    return {
      name: this.nameField.value.trim(),
      description: this.descField.value.trim(),
      intensity: parseInt(this.intensityField.value, 10),
      active: this.activeField.checked,
      visible: this.visibleField.checked,
    };
  }

  saveSettings() {
    const data = this.getSettings();
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    this.container.displayMessage(`${this.mode} settings saved locally`, 'success');
  }

  sendSettings() {
    const data = this.getSettings();
    if (this.container.stream && this.container.stream.readyState === WebSocket.OPEN) {
      this.container.stream.send(JSON.stringify({ type: `${this.mode}-settings`, data }));
      this.container.displayMessage(`${this.mode} settings sent`, 'info');
    } else {
      this.container.displayMessage('WebSocket not connected. Settings stored locally.', 'warning');
    }
  }

  cleanup() {
    if (this.saveBtn) this.saveBtn.removeEventListener('click', this.saveBound);
    if (this.sendBtn) this.sendBtn.removeEventListener('click', this.sendBound);
    super.cleanup();
  }
}
