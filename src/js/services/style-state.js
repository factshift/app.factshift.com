// services/style-state.js

/**
 * Update a CSS custom property and optionally persist the value.
 * The category defaults to 'style.vars'.
 */
export function setCssVar(name, value, category = 'style.vars') {
  document.documentElement.style.setProperty(name, value);
  if (window.spwashi && window.spwashi.setItem) {
    window.spwashi.setItem(name, value, category);
  }
}

/**
 * Load persisted CSS variables and apply them to the document.
 * `names` should be an array of CSS custom property names.
 */
export function loadCssVars(names = [], category = 'style.vars') {
  if (!window.spwashi || !window.spwashi.getItem) return;
  names.forEach(name => {
    const stored = window.spwashi.getItem(name, category);
    if (stored !== undefined) {
      document.documentElement.style.setProperty(name, stored);
    }
  });
}
