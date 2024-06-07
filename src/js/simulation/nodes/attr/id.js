const idMap = new Map();

function getNodeRootId(node = {}, i = 0) {
  if (node.identity) return node.identity;
  return `node:[${i}]`;
}

export function getNodeId(node, i) {
  const root_id = getNodeRootId(node, i);
  const set     = idMap.get(root_id) || new Set;
  if (!set.has(node)) {
    node.id = node.id ?? (root_id + (set.size ? '[' + set.size + ']' : ''));
    set.add(node);
  }
  node.id = node.id ?? root_id;
  idMap.set(node.id, set);
  return node.id;
}
