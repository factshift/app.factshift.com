export function slice(searchParameters) {
  const name = searchParameters.get('slice');
  if (name) {
    window.spwashi.parameters.slice = name;
  }
  return ['slice', name];
}
