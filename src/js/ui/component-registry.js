import { debug } from '../services/logger.js';

export const componentRegistry = new Map();

export function registerComponent(name, lifecycle) {
  if (!name || typeof lifecycle?.init !== 'function') {
    throw new Error('registerComponent requires a name and an init function');
  }
  componentRegistry.set(name, lifecycle);
  debug(`[ui] registered component: ${name}`);
}

export function initRegisteredComponents() {
  for (const [name, { init }] of componentRegistry) {
    try {
      debug(`[ui] init component: ${name}`);
      init();
      debug(`[ui] init complete: ${name}`);
    } catch (err) {
      console.error(`Failed to init component: ${name}`, err);
    }
  }
}

export function destroyRegisteredComponents() {
  for (const [name, { destroy }] of componentRegistry) {
    if (typeof destroy === 'function') {
      try {
        debug(`[ui] destroy component: ${name}`);
        destroy();
      } catch (err) {
        console.error(`Failed to destroy component: ${name}`, err);
      }
    }
  }
}
