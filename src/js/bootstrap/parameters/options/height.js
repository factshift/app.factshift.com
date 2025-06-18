export function height(searchParameters) {
  if (searchParameters.has('height')) {
    window.spwashi.parameters.height = +searchParameters.get('height');
  }
  return ['height', window.spwashi.parameters.height];
}