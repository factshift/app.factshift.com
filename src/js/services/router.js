// services/router.js
// Simple routing integration service sensitive to app loading phases.
// It notifies registered listeners when the browser location changes.

const listeners = new Set();

function handleRouteChange() {
  const path = window.location.pathname;
  listeners.forEach(fn => {
    try {
      fn(path);
    } catch (err) {
      console.error('route listener failed', err);
    }
  });
}

export function initRouter() {
  window.addEventListener('popstate', handleRouteChange);
  // emit the initial route
  handleRouteChange();
}

export function registerRouteListener(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function clearRouteListeners() {
  listeners.clear();
  window.removeEventListener('popstate', handleRouteChange);
}
