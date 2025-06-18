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
    try {
      const res = this.source.fetchAll();
      return res instanceof Promise ? res : Promise.resolve(res);
    } catch (err) {
      this.source.error = err;
      this.source.loading = false;
      return Promise.reject(err);
    }
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

  get loading() {
    return this.source.loading;
  }

  get error() {
    return this.source.error;
  }

  get loaded() {
    return this.source.loaded;
  }
}
