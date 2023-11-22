const nodesManager = {
  getNode:     getNode,
  initNodes:   initNodes,
  normalize:   normalize,
  updateNodes: updateNodes,
  filterNode:  filterNode,
  processNode: processNode,
  cacheNode:   cacheNode,
};

const idMap = new Map();

function getNodeImageHref(d) {
  return null;
  if (d.image.href === null) return null;
  return d.image.href || window.spwashi.images[(d.colorindex || 0) % (window.spwashi.images.length)];
}

function sortNodes(nodes) {
  return nodes.sort((a, b) => a.z - b.z);
}

function getNodeId(node, i) {
  const root_id = getNodeRootId(node, i);
  const set     = idMap.get(root_id) || new Set;
  if (!set.has(node)) {
    const set_id = root_id + (set.size ? '[' + set.size + ']' : '');
    node.id      = set_id;
    set.add(node);
  }
  node.id = node.id || root_id;
  idMap.set(node.id, set);
  return node.id;
}

function getNodeRootId(node = {}, i = 0) {
  if (node.identity) return node.identity;
  const indexedName = `node:[${i}]`;
  return indexedName;
};

function normalize(node, readNode, i) {
  const template = {
    image:      {},
    charge:     0,
    text:       {fontSize: 20},
    r:          1 * window.spwashi.parameters.nodes.radiusMultiplier,
    z:          0,
    x:          window.spwashi.parameters.startPos.x + i * 2,
    y:          window.spwashi.parameters.startPos.y,
    colorindex: getColorIndex(),
  };
  const fixedPos = {
    fx: null && window.spwashi.parameters.startPos.x + i * 20,
    fy: null && window.spwashi.parameters.startPos.y + (node.identity?.length ? (node.identity?.length * 2) : 0),
  }
  Object.assign(
    node,
    template,
    readNode,
    // fixedPos,
    {
      name: node.identity || ('node:' + i),
      idx:  i,
    },
    {
      ...node,
    }
  );
  node.r             = Math.max(node.r, 1)
  node.private       = {};
  node.image.r       = isNaN(node.image.r) ? node.r : Math.max(10, node.image.r);
  node.image.offsetX = !isNaN(node.image.offsetX) ? node.image.offsetX : 0;
  node.image.offsetY = !isNaN(node.image.offsetY) ? node.image.offsetY : node.r;
  return node;
}

function initNodes(nodes) {
  const count = nodes.length;
  for (let i = 0; i < count; i++) {
    const node     = {id: getNodeId(nodes[i], i),};
    const readNode = readNodePosition(node);

    window.spwashi.nodesManager.normalize(
      nodes[i],
      {...node, ...readNode},
      i
    );
  }

  const activeNodes = sortNodes(nodes);
  return window.spwashi.nodes = activeNodes;
}

function updateNodes(g, nodes) {
  const wrapperSelection =
          g
            .select('.nodes')
            .selectAll('g.wrapper')
            .data(nodes, d => d.id);

  const enterJoin  = enter => {
    const outerG = enter.append('g').classed('wrapper', true);
    const image  = outerG.append('g').classed('image', true);
    const node   = outerG.append('g').classed('node', true);
    const text   = outerG.append('text').classed('text', true)
    makeImage(image);
    makeCircle(node);
    makeRect(node);
    makeText(text);
    return outerG;
  }
  const updateJoin = outerG => {
    const update = outerG.select('g.node');
    const image  = outerG.select('g.image');
    const text   = outerG.select('text.text');

    updateCircle(update);
    updateNodeTextSvg(text);
    updateNodeImage(image);
    update
      .select('rect')
      .attr('stroke-width', '1px')
      .attr('fill', getNodeColor)
      .attr('stroke', getNodeStrokeColor)
      .attr('fill', 'none')
      .attr('x', d => (d.x) - (d.r))
      .attr('y', d => (d.y) - (d.r))


    return outerG;
  }
  const removeJoin = remove => {
    remove.select('g.node').remove();
    remove.select('text.text').remove();
    remove.select('g.image').remove();
  }

  wrapperSelection.join(enterJoin, updateJoin, removeJoin);
}

function filterNode(node) {
  return true;
}

function getNode(id) {
  return window.spwashi.nodes.find(n => n.id === id);
}

window.spwashi.getNodeImageHref = getNodeImageHref
window.spwashi.getNode          = nodesManager.getNode;
window.spwashi.nodesManager     = nodesManager;