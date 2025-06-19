function isLocalhost() {
  return /^(localhost|127\.|0\.0\.0\.0)/.test(window.location.hostname);
}

export function debug(searchParameters) {
  if (searchParameters.has('debug') || isLocalhost()) {
    window.spwashi.parameters.debug = true;
    document.body.dataset.debug = 'debug';
  }
  return ['debug', window.spwashi.parameters.debug];
}