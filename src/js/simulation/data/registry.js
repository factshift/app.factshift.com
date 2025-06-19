import { createDataSlice } from './slice.js';

const registry = new Map();

function makeKey(key, mode = 'default', phase = 'default') {
  return `${mode}:${phase}:${key}`;
}

export function registerSlice(key, { initialData = [], slice, aggregator = 'array', mode = 'default', phase = 'default', display = true } = {}) {
  const regKey = makeKey(key, mode, phase);
  const finalSlice = slice || createDataSlice(initialData, aggregator);
  registry.set(regKey, { slice: finalSlice, display });
  return finalSlice;
}

export function getSlice(key, { mode = 'default', phase = 'default' } = {}) {
  const regKey = makeKey(key, mode, phase);
  return registry.get(regKey)?.slice;
}

export function getData(key, opts = {}) {
  return getSlice(key, opts)?.get();
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

export function clearData(key, opts = {}) {
  const slice = getSlice(key, opts);
  slice?.clear();
}
