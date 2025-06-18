// services/data-manager.js

import { StaticDataSource, LiveDataSource } from './data-sources.js';

export class DataManager {
  constructor({ mode, strategy = 'static', staticItems = [], wsUrl = '' }) {
    if (strategy === 'live') {
      this.source = new LiveDataSource(wsUrl);
    } else {
      this.source = new StaticDataSource(staticItems);
    }
    this.mode = mode;
  }

  getAll() {
    return this.source.fetchAll();
  }

  getOne(id) {
    return this.source.fetchOne(id);
  }

  onUpdate(cb) {
    if (this.source.subscribeUpdates) {
      this.source.subscribeUpdates(cb);
    }
  }

  offUpdate(cb) {
    if (this.source.unsubscribeUpdates) {
      this.source.unsubscribeUpdates(cb);
    }
  }
}
