export const atHandler = {
  regex:   /^@=(.+)/,
  handler: (sideEffects, value) => {
    const identities = value.split(',');
    identities.forEach(id => {
      const node = window.spwashi.nodes.find(node => node.id === id || node.identity === id);
      if (node) {
        sideEffects.nodesImpacted.push(node);
      }
    });
    sideEffects.physicsChange = true;
  }
};