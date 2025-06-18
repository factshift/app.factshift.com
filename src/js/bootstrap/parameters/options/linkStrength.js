export function linkStrength(searchParameters) {
  if (searchParameters.has('linkStrength')) {
    window.spwashi.parameters.links.strength = +searchParameters.get('linkStrength');
  }
  return ['linkStrength', window.spwashi.parameters.links.strength];
}