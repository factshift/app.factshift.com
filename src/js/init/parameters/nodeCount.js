export function nodeCount__get(searchParameters) {
  if (searchParameters.has('nodeCount')) {
    window.spwashi.parameters.nodes       = window.spwashi.parameters.nodes || {};
    window.spwashi.parameters.nodes.count = +searchParameters.get('nodeCount');
  }
}