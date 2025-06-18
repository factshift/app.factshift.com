export function r(searchParameters) {
  if (searchParameters.has('r')) {
    window.spwashi.values.r = searchParameters.get('r').split(',').map(n => +n);
  }
  return ['r', window.spwashi.values.r];
}