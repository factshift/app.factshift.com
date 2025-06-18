// services/data-sources.js

/**
 * A uniform interface for all data sources.
 * Methods may return a value or a Promise for that value.
 */
export class DataSource {
  /** Fetch all items: may be sync or async */
  fetchAll() { throw new Error('fetchAll not implemented'); }
  /** Fetch a single item by ID or index */
  fetchOne(id) { throw new Error('fetchOne not implemented'); }
  /** Subscribe to live updates: callback(item) */
  subscribeUpdates(callback) {}
  /** Unsubscribe from updates */
  unsubscribeUpdates(callback) {}
}

/** Static (hardcoded) Source */
export class StaticDataSource extends DataSource {
  constructor(items = []) {
    super();
    this.items = items;
  }
  fetchAll() {
    return this.items;
  }
  fetchOne(id) {
    return this.items.find(item => item.id === id);
  }
}

/** Live (async/WebSocket) Source */
export class LiveDataSource extends DataSource {
  constructor(wsUrl) {
    super();
    this.ws = new WebSocket(wsUrl);
    this.queue = [];
    this.callbacks = new Set();

    this.ws.onmessage = (event) => {
      const item = JSON.parse(event.data);
      this.queue.push(item);
      this.callbacks.forEach(cb => cb(item));
    };
  }

  async fetchAll() {
    return new Promise((resolve) => {
      this.ws.onopen = () => {
        this.ws.send(JSON.stringify({ type: 'get-all' }));
        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'all-items') {
            resolve(data.items);
          }
        };
      };
    });
  }

  fetchOne(id) {
    // For demo purposes we rely on fetchAll and filter
    return this.fetchAll().then(items => items.find(item => item.id === id));
  }

  subscribeUpdates(cb) {
    this.callbacks.add(cb);
  }

  unsubscribeUpdates(cb) {
    this.callbacks.delete(cb);
  }
}
