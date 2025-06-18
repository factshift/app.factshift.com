export function debug(searchParameters) {
  if (searchParameters.has('debug')) {
    window.spwashi.parameters.debug = true;
    document.body.dataset.debug     = 'debug'
  }
  return ['debug', window.spwashi.parameters.debug];
}