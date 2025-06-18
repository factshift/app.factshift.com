export function alpha(searchParameters) {
  if (searchParameters.has('alpha')) {
    window.spwashi.parameters.forces.alpha = +searchParameters.get('alpha');
  }
  return ['alpha', window.spwashi.parameters.forces.alpha]
}