export function alphaDecay(searchParameters) {
  if (searchParameters.has('alphaDecay')) {
    window.spwashi.parameters.forces.alphaDecay = +searchParameters.get('alphaDecay');
  }

  return ['alphaDecay', window.spwashi.parameters.forces.alphaDecay];
}