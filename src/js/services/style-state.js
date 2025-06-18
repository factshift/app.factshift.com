// services/style-state.js

/**
 * Update a CSS custom property and optionally persist the value.
 * The category defaults to 'style.vars'.
 */
import { cacheItem, loadCachedItem } from './cache.js';

export const STYLE_VARS_CATEGORY = 'style.vars';

export function setCssVar(name, value, category = STYLE_VARS_CATEGORY) {
  document.documentElement.style.setProperty(name, value);
  if (window.spwashi && window.spwashi.setItem) {
    cacheItem(name, value, category);
  } else if (window.spwashi?.parameters?.debug) {
    console.warn(`[style-state] unable to cache ${name}`);
  }
}

/**
 * Load persisted CSS variables and apply them to the document.
 * `names` should be an array of CSS custom property names.
 */
export function loadCssVars(names = [], category = STYLE_VARS_CATEGORY) {
  if (!window.spwashi || !window.spwashi.getItem) return;
  names.forEach(name => {
    const stored = loadCachedItem(name, category);
    if (stored !== undefined) {
      document.documentElement.style.setProperty(name, stored);
    }
  });
}
