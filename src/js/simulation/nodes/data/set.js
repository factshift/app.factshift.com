/**
 * Safely retrieve the global `spwashi` object, initializing if not present.
 */
function getSpwashiGlobal() {
  if (!window.spwashi) {
    window.spwashi = { nodes: [], links: [] };
  }
  return window.spwashi;
}

function getSpwashiNodes() {
  return getSpwashiGlobal().nodes || [];
}

function setSpwashiNodes(nodes) {
  getSpwashiGlobal().nodes = nodes;
}

function getSpwashiLinks() {
  return getSpwashiGlobal().links || [];
}

function setSpwashiLinks(links) {
  getSpwashiGlobal().links = links;
}

/**
 * Set the active nodes globally in `window.spwashi.nodes`.
 *
 * @param {Array} activeNodes - The array of nodes to be set globally.
 */
export function setNodeData(activeNodes) {
  setSpwashiNodes(activeNodes);
}

/**
 * Push new nodes into the existing set of nodes, avoiding duplicates based on node `id`.
 *
 * @param {Array} newNodes - The array of new nodes to be added.
 */
export function pushNodeData(newNodes) {
  const currentNodes = getSpwashiNodes();
  const existingNodeIds = new Set(currentNodes.map(node => node.id));

  const uniqueNewNodes = newNodes.filter(node => !existingNodeIds.has(node.id));
  const updatedNodes = [...currentNodes, ...uniqueNewNodes]; // Combine existing and new unique nodes

  setSpwashiNodes(updatedNodes);
}

/**
 * Remove all nodes globally from `window.spwashi.nodes`.
 */
export function removeAllNodes() {
  setSpwashiNodes([]);
}

/**
 * Remove all links globally from `window.spwashi.links`.
 */
export function removeAllLinks() {
  setSpwashiLinks([]);
}

/**
 * Filter the global nodes based on the provided filter function.
 *
 * @param {Function} filter - The filter function to be applied on nodes.
 */
export function filterNodes(filter) {
  const filteredNodes = getSpwashiNodes().filter(filter);
  setSpwashiNodes(filteredNodes);
}

/**
 * Remove nodes and links of kind '__cluster'.
 */
export function removeClusterNodes() {
  const filteredNodes = getSpwashiNodes().filter(node => node.kind !== '__cluster');
  const filteredLinks = getSpwashiLinks().filter(link => link.source.kind !== '__cluster' && link.target.kind !== '__cluster');

  setSpwashiNodes(filteredNodes);
  setSpwashiLinks(filteredLinks);
}

/**
 * Remove a specific number of nodes from the global nodes.
 *
 * @param {number} amountToRemove - The number of nodes to remove.
 */
export function removeNodeCount(amountToRemove) {
  const nodes = getSpwashiNodes();
  const newLength = Math.max(0, nodes.length - amountToRemove);

  nodes.length = newLength;  // Mutate the original array to adjust its length
  setSpwashiNodes(nodes);
}
