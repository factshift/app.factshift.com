export function size(searchParameters) {
  if (searchParameters.has('size')) {
    window.spwashi.parameters.width  = +searchParameters.get('size').split(',')[0];
    window.spwashi.parameters.height = +searchParameters.get('size').split(',')[1];
  }
  return ['size', [window.spwashi.parameters.width, window.spwashi.parameters.height]]
}