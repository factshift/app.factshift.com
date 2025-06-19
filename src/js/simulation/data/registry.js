// registry.js
// Centralized registry for simulation data keyed by app mode and phase.
// Allows optional display control and memory management for snapshots.

const registry = new Map();

function makeKey(key, mode = 'default', phase = 'default') {
  return `${mode}:${phase}:${key}`;
}

export function registerData(key, data, { mode = 'default', phase = 'default', display = true } = {}) {
  const regKey = makeKey(key, mode, phase);
  registry.set(regKey, { data, display });
}

export function getData(key, { mode = 'default', phase = 'default' } = {}) {
  const regKey = makeKey(key, mode, phase);
  return registry.get(regKey)?.data;
}

export function toggleDisplay(key, { mode = 'default', phase = 'default', display } = {}) {
  const regKey = makeKey(key, mode, phase);
  const entry = registry.get(regKey);
  if (entry) {
    entry.display = typeof display === 'boolean' ? display : !entry.display;
  }
}

export function isDisplayEnabled(key, { mode = 'default', phase = 'default' } = {}) {
  const regKey = makeKey(key, mode, phase);
  return registry.get(regKey)?.display ?? false;
}

export function clearData(key, { mode = 'default', phase = 'default' } = {}) {
  registry.delete(makeKey(key, mode, phase));
}
