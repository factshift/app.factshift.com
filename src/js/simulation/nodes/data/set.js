export function setNodeData(activeNodes) {
  window.spwashi.nodes = activeNodes;
}

export function removeAllNodes() {
  window.spwashi.nodes.forEach(node => {
    // send delete request to server
    fetch('/api/nodes/' + node.id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(data => {
        filterNodes(dd => dd.id !== node.id);
        window.spwashi.reinit();
      })
      .catch(error => console.error('Error:', error));
  })
  window.spwashi.nodes = [];
}

export function filterNodes(filter) {
  window.spwashi.nodes = window.spwashi.nodes.filter(filter);
}

export function removeClusterNodes() {
  window.spwashi.nodes = window.spwashi.nodes.filter(node => node.kind !== '__cluster');
  window.spwashi.links = window.spwashi.links.filter(link => link.source.kind !== '__cluster' && link.target.kind !== '__cluster');
}

export function removeNodeCount(amountToRemove) {
  window.spwashi.nodes.length = Math.max(0, window.spwashi.nodes.length - amountToRemove);
}