export function boundingBox(searchParameters) {
  if (searchParameters.has('boundingBox')) {
    window.spwashi.parameters.forces.boundingBox = searchParameters.get('boundingBox') === '1'
  }
  return ['boundingBox', window.spwashi.parameters.forces.boundingBox]
}