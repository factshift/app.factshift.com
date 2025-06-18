export const nodeQueueHandler = {
  regex:   /^nodeCount=(\d+)/,
  handler: (sideEffects, value) => {
    window.spwashi.parameters.nodes.count = parseInt(value);
    sideEffects.physicsChange             = true;
  }
};