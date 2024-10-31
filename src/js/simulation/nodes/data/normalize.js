import { getDocumentDataIndex } from "../../../modes/dataindex/util";

/**
 * @typedef {Object} Node
 * @property {string|number} id - Unique identifier for the node.
 * @property {string} [identity] - Optional identifier that represents the node’s identity.
 * @property {number} x - The x-coordinate position of the node.
 * @property {number} y - The y-coordinate position of the node.
 * @property {number} [fx] - Fixed x-coordinate for the node, used when the node is dragged.
 * @property {number} [fy] - Fixed y-coordinate for the node, used when the node is dragged.
 * @property {number} r - Radius of the node (for circle rendering).
 * @property {number} [z=0] - Z-index or depth of the node.
 * @property {string} [color] - Color of the node, used for rendering.
 * @property {number} [colorindex] - Index for determining the color.
 * @property {string} [url] - URL associated with the node, used for hyperlink interactions.
 * @property {string} [md5] - MD5 hash associated with the node, for reference in certain actions.
 * @property {Object} [callbacks] - Object containing callback functions for node interaction.
 * @property {Function} [callbacks.click] - Callback function invoked on node click.
 * @property {Function} [callbacks.ondrag] - Callback function invoked during node drag.
 * @property {Function} [getUrl] - Optional function to retrieve a URL for the node.
 * @property {string} [kind] - Type of the node, used for classification (e.g., '__cluster').
 * @property {boolean} [isSelected=false] - Indicates if the node is selected.
 */

/**
 * Normalizes the node by applying default values. Supports mutable (in-place)
 * or immutable (returning a new object) normalization based on the `isMutable` flag.
 *
 * @param {Node} node - The node object to be normalized.
 * @param {number} i - The index of the node in the list.
 * @param {Object} [override] - An optional object to override default values.
 * @param {boolean} [isMutable=true] - Whether to mutate the node in place or return a new object.
 * @returns {Node} The normalized node object.
 */
export function normalize(node, i, override = {}, isMutable = true) {
  // Step 1: Define default values for a new node
  const defaults = createDefaultNode(i);

  // Step 2: Apply normalization based on the `isMutable` flag
  const targetNode = isMutable ? node : { ...node };

  Object.assign(targetNode, defaults, override, {
    name: node.name || node.identity || defaults.name,  // Ensure name and idx are set correctly
  });


  // Step 3: Post-processing to ensure valid radius and image properties
  ensureValidDimensions(targetNode);

  return targetNode;  // Return the normalized node, either mutated or new
}

/**
 * Creates a default node object with standard values.
 *
 * @param {number} i - The index of the node.
 * @returns {Object} The default node object.
 */
function createDefaultNode(i) {
  return {
    image:      {},
    callbacks:  {},
    charge:     0,
    parts:      {},
    private:    {},
    text:       { fontSize: 20 },
    r:          1 * window.spwashi.parameters.nodes.radiusMultiplier,
    z:          0,
    x:          window.spwashi.parameters.startPos.x + i * 2,
    y:          window.spwashi.parameters.startPos.y,
    colorindex: getDocumentDataIndex(),
    name:       `node:${i}`,
    idx:        i,
  };
}

/**
 * Ensures the node has valid dimensions for rendering, adjusting radius and image offsets.
 *
 * @param {Node} node - The node object to process.
 */
function ensureValidDimensions(node) {
  node.r = Math.max(node.r, 1);

  node.image.r = isNaN(node.image.r) ? node.r : Math.max(10, node.image.r);
  node.image.offsetX = !isNaN(node.image.offsetX) ? node.image.offsetX : 0;
  node.image.offsetY = !isNaN(node.image.offsetY) ? node.image.offsetY : node.r;
}
