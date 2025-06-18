export function fy(searchParameters) {
  if (searchParameters.has('fy')) {
    window.spwashi.values.fy = searchParameters.get('fy').split(',').map(n => +n);
  }
  return ['fy', window.spwashi.values.fy];
}