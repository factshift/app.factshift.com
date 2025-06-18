export function zoom(searchParameters) {
  if (searchParameters.has('zoom')) {
    window.spwashi.parameters.canzoom = !!(+searchParameters.get('zoom'));
  } else {
    window.spwashi.parameters.canzoom = true;
  }
  return ['zoom', window.spwashi.parameters.canzoom];
}