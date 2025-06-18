export function width(searchParameters) {
  if (searchParameters.has('width')) {
    window.spwashi.parameters.width = +searchParameters.get('width');
  }
  return ['width', window.spwashi.parameters.width];
}