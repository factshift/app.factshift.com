import {getAllNodes}     from "../../../simulation/nodes/data/selectors/multiple";
import {pushNode}        from "../../../simulation/nodes/data/operate";
import {pushLink}        from "../../../simulation/edges/data/pushLink";
import {processNode}     from "../../../simulation/nodes/data/process";
import {processSpwInput} from "../process-spw-input";

const groupNodeMap = {};

function getGroupNode(group, searchDict) {
  if (searchDict[group]) return searchDict[group];
  const groupNode   = {
    identity: 'group:' + group,
    kind:     '__group',
    name:     group,
    r:        30,
    text:     {
      fontSize: 30,
      color:    'white',
    },
    charge:   100,
  };
  searchDict[group] = groupNode;
  return groupNode;
}

export function runGroupCommand(sideEffects) {
  const width         = window.spwashi.parameters.width;
  const height        = window.spwashi.parameters.height;
  const gridColumnMax = 5;
  const gridRowMax    = 5;

  const nodes  = getAllNodes();
  const groups = nodes.reduce((acc, node) => {
    const group = node.colorindex;
    acc[group]  = acc[group] || [];
    acc[group].push(node);
    return acc;
  }, {});

  const widthSlice = width / Math.min(gridColumnMax, Object.keys(groups).length);
  const rowCount   = Math.ceil(Object.keys(groups).length / gridColumnMax);
  const groupNodes = Object.entries(groups).map(([group, nodes], i) => {
    const groupNode = getGroupNode(group, groupNodeMap);

    const x = (i % gridColumnMax) * widthSlice + widthSlice / 2;
    const y = (height / rowCount) * Math.floor(i / gridColumnMax) + height / rowCount / 2
    Object.assign(groupNode, {
      fx:         x,
      fy:         y,
      colorindex: +group,
    });

    return groupNode;
  });
  pushNode(...groupNodes.map(processNode));
  sideEffects.nodesImpacted.push(...groupNodes);
  window.spwashi.reinit();
  nodes.forEach(node => {
    const groupNode = groupNodeMap[node.colorindex];
    if (node === groupNode) return;
    if (groupNode) {
      node.x = groupNode.x;
      node.y = groupNode.y;
      pushLink(
        window.spwashi.links,
        {
          source:   groupNode.identity,
          target:   node.id,
          strength: .5
        }
      );
    }
  })
  sideEffects.physicsChange = true;
}

;