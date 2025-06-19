import {getAllNodes} from "./selectors/multiple.js";

export const cacheNode        = node => {
  window.spwashi.setItem('nodes', getAllNodes());
}
export const readNodePosition = node => {
  const nodes    = window.spwashi.getItem('nodes') || [];
  const readNode = nodes.find(n => n.id === node.id);
  if (readNode) return readNode;
  return {};
}
