import { createDataSlice } from './slice.js';

const registry = new Map();
const meta = new Map();

function makeKey(key, mode = 'default', phase = 'default', sliceName = '') {
  return `${mode}:${phase}:${sliceName}:${key}`;
}

export function registerSlice(key, { initialData = [], dataSlice, aggregator = 'array', mode = 'default', phase = 'default', sliceName = '', display = true } = {}) {
  const regKey = makeKey(key, mode, phase, sliceName);
  const finalSlice = dataSlice || createDataSlice(initialData, aggregator);
  registry.set(regKey, { slice: finalSlice, display });
  meta.set(regKey, { query: { mode, phase, slice: sliceName || undefined }, data: finalSlice });
  return finalSlice;
}

export function getSlice(key, { mode = 'default', phase = 'default', sliceName = '' } = {}) {
  const regKey = makeKey(key, mode, phase, sliceName);
  return registry.get(regKey)?.slice;
}

export function getData(key, opts = {}) {
  return getSlice(key, opts)?.get();
}

export function toggleDisplay(key, { mode = 'default', phase = 'default', sliceName = '', display } = {}) {
  const regKey = makeKey(key, mode, phase, sliceName);
  const entry = registry.get(regKey);
  if (entry) {
    entry.display = typeof display === 'boolean' ? display : !entry.display;
  }
}

export function isDisplayEnabled(key, { mode = 'default', phase = 'default', sliceName = '' } = {}) {
  const regKey = makeKey(key, mode, phase, sliceName);
  return registry.get(regKey)?.display ?? false;
}

export function clearData(key, opts = {}) {
  const slice = getSlice(key, opts);
  slice?.clear();
}

export function getMeta(key, { mode = 'default', phase = 'default', sliceName = '' } = {}) {
  const regKey = makeKey(key, mode, phase, sliceName);
  return meta.get(regKey);
}
