// services/cache.js

export const UI_CACHE_CATEGORY = 'ui.cache';

/**
 * Cache a value using window.spwashi's localStorage helpers.
 * Logs the action when debug mode is enabled.
 */
export function cacheItem(key, value, category = UI_CACHE_CATEGORY) {
  if (window.spwashi && window.spwashi.setItem) {
    window.spwashi.setItem(key, value, category);
    if (window.spwashi.parameters?.debug) {
      console.log(`[cache] set ${key} ->`, value);
    }
  } else if (window.spwashi?.parameters?.debug) {
    console.warn(`[cache] unable to set ${key}`);
  }
}

/**
 * Retrieve a cached value.
 * Logs the result when debug mode is enabled.
 */
export function loadCachedItem(key, category = UI_CACHE_CATEGORY) {
  if (!window.spwashi || !window.spwashi.getItem) return undefined;
  const value = window.spwashi.getItem(key, category);
  if (window.spwashi.parameters?.debug) {
    console.log(`[cache] load ${key} ->`, value);
  }
  return value;
}

/**
 * Load multiple cached values at once.
 */
export function loadCachedItems(keys = [], category = UI_CACHE_CATEGORY) {
  const out = {};
  keys.forEach(k => {
    const v = loadCachedItem(k, category);
    if (v !== undefined) out[k] = v;
  });
  return out;
}
