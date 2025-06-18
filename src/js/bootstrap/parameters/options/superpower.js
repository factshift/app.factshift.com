export function superpower(searchParameters) {
  if (searchParameters.has('superpower')) {
    window.spwashi.superpower.name = searchParameters.get('superpower');
  }
  return ['superpower', window.spwashi.superpower.name];
}