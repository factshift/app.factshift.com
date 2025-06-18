export function nodeQueue(searchParameters) {
  if (searchParameters.has('nodeCount')) {
    window.spwashi.parameters.nodes       = window.spwashi.parameters.nodes || {};
    window.spwashi.parameters.nodes.count = +searchParameters.get('nodeCount');
  }
  return ['nodeCount', window.spwashi.parameters.nodes.count]
}