// simulation/nodes/nodes.js

import { processNode } from "./data/process.js";
import { cacheNode, readNodePosition } from "./data/store.js";
import { debug } from "../../services/logger.js";
import { makeText, updateNodeTextSvg } from "./ui/text.js";
import { makeRect } from "./ui/rect.js";
import { makeCircle, updateCircle } from "./ui/circle.js";
import { makeImage, updateNodeImage } from "./ui/image.js";
import { getNodeColor, getNodeStrokeColor } from "./attr/colors.js";
import {pushNodeData, setNodeData} from "./data/set.js";
import { sortNodes } from "./data/sort.js";
import { normalize } from "./data/normalize.js";
import { getNode } from "./data/selectors/single.js";
import { getNodeId } from "./attr/id.js";
import { filterNode } from "./data/filter.js";

export const NODE_MANAGER = {
  getNode,
  initNodes: init,
  normalize,
  updateNodes: update,
  filterNode,
  processNode,
  cacheNode,
};

/**
 * Initialize and normalize nodes with optional immutability.
 *
 * @param {Array} nodes - The list of nodes to initialize.
 * @param {boolean} [isMutable=true] - Whether to normalize nodes in place or return new ones.
 * @returns {Array} - The sorted and initialized nodes.
 */
function init(nodes, isMutable = false) {
  const normalizedNodes = nodes.map((node, i) => {
    const nodeId = getNodeId(node, i);
    const readNode = readNodePosition({ id: nodeId });

    // Normalize each node, whether in place or returning a new object
    return NODE_MANAGER.normalize(node, i, { id: nodeId, ...readNode }, isMutable);
  });

  const activeNodes = sortNodes(normalizedNodes);
  isMutable ? pushNodeData(activeNodes) : setNodeData(activeNodes);
  return activeNodes;
}

/**
 * Update the D3 selection for nodes.
 *
 * @param {Object} g - The D3 selection of the group element.
 * @param {Array} nodes - The list of nodes to update.
 */
function update(g, nodes) {
  debug(`[nodes] update called with ${nodes.length} nodes`);
  const wrapperSelection = g
      .select('.nodes')
      .selectAll('g.wrapper')
      .data(nodes, d => d.id);

  wrapperSelection.join(enterNodes, updateNodes, removeNodes);
  debug(`[nodes] selection after join: ${wrapperSelection.size()}`);
}

/**
 * Handles the 'enter' phase of the D3 join for new nodes.
 *
 * @param {Object} enter - The D3 enter selection.
 * @returns {Object} - The created nodes.
 */
function enterNodes(enter) {
  const outerG = enter.append('g').classed('wrapper', true);

  const image = outerG.append('g').classed('image', true);
  const node = outerG.append('g').classed('node', true);
  const text = outerG.append('g').classed('text', true);

  makeImage(image);
  makeCircle(node);
  makeRect(node);
  makeText(text);

  return outerG;
}

/**
 * Handles the 'update' phase of the D3 join for existing nodes.
 *
 * @param {Object} outerG - The D3 update selection.
 * @returns {Object} - The updated nodes.
 */
function updateNodes(outerG) {
  const update = outerG.select('g.node');
  const image = outerG.select('g.image');
  const text = outerG.select('g.text');

  updateCircle(update);
  updateNodeTextSvg(text);
  updateNodeImage(image);

  update
      .select('rect')
      .attr('stroke-width', '1px')
      .attr('fill', getNodeColor)
      .attr('stroke', getNodeStrokeColor)
      .attr('fill', 'none')
      .attr('x', d => d.x - d.r)
      .attr('y', d => d.y - d.r);

  return outerG;
}

/**
 * Handles the 'exit' phase of the D3 join for removing nodes.
 *
 * @param {Object} remove - The D3 remove selection.
 */
function removeNodes(remove) {
  remove.select('g.node').remove();
  remove.select('g.text').remove();
  remove.select('g.image').remove();
}
