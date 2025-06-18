export function charge(searchParameters) {
  if (searchParameters.has('charge')) {
    window.spwashi.parameters.forces.charge = +searchParameters.get('charge');
  }
  return ['charge', window.spwashi.parameters.forces.charge];
}