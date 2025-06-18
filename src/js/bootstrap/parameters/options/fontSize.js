export function fontSize(searchParameters) {
  if (searchParameters.has('fontSize')) {
    window.spwashi.values.text.fontSize = searchParameters.get('fontSize').split(',').map(n => +n);
  }
  return ['fontSize', window.spwashi.values.text.fontSize];
}