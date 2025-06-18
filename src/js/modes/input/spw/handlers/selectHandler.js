import {getAllNodes}   from "../../../simulation/nodes/data/selectors/multiple";
import {CLICKED_NODES} from "../commands/clicked";

function getNodeGroup(node) {
  return node.colorindex;
}

function groupNodes(nodes) {
  const nodeGroupMap = new Map();
  nodes.forEach((node) => {
    const group = getNodeGroup(node);
    nodeGroupMap.set(group, nodeGroupMap.get(group) || []);
    nodeGroupMap.get(group).push(node);
  }, {});
  return nodeGroupMap;
}

function getLargestGroupIndex(nodeGroupMap) {
  let matchingGroup;
  nodeGroupMap.forEach((nodes, group) => {
    if (!matchingGroup || nodes.length > nodeGroupMap.get(matchingGroup).length) {
      matchingGroup = group;
    }
  });
  return matchingGroup;
}

function getSmallestGroupIndex(nodeGroupMap) {
  let matchingGroup;
  nodeGroupMap.forEach((nodes, group) => {
    if (!matchingGroup || nodes.length < nodeGroupMap.get(matchingGroup).length) {
      matchingGroup = group;
    }
  });
  return matchingGroup;
}

export const selectHandler = {
  regex:   /^select=(.+)/,
  handler: (sideEffects, choice) => {
    switch (choice) {
      case 'all': {
        sideEffects.nodesSelected.push(...getAllNodes());
        sideEffects.nodesIgnored.length = 0;
        break;
      }
      case 'none': {
        sideEffects.nodesSelected.length = 0;
        sideEffects.nodesIgnored.push(...getAllNodes());
        break;
      }
      case 'most': {
        const nodes  = getAllNodes();
        const groups = groupNodes(nodes);
        const index  = getLargestGroupIndex(groups);
        nodes.forEach(node => {
          const group           = getNodeGroup(node);
          const effectCollector = (group === index) ? sideEffects.nodesSelected : sideEffects.nodesIgnored;
          effectCollector.push(node);
        });
        break;
      }
      case 'least': {
        const nodes  = getAllNodes();
        const groups = groupNodes(nodes);
        const index  = getSmallestGroupIndex(groups);
        nodes.forEach(node => {
          const group           = getNodeGroup(node);
          const effectCollector = (group === index) ? sideEffects.nodesSelected : sideEffects.nodesIgnored;
          effectCollector.push(node);
        });
        break;
      }
      case 'clicked': {
        const nodes = getAllNodes();

        nodes.forEach(node => {
          if (CLICKED_NODES.includes(node)) {
            sideEffects.nodesSelected.push(node);
          } else {
            sideEffects.nodesIgnored.push(node);
          }
        });
        break;
      }
      case 'g':
      case 'group':
      case 'groups': {
        const nodes = getAllNodes();
        nodes.forEach(node => {
          if (node.kind === '__group') {
            sideEffects.nodesSelected.push(node);
          } else {
            sideEffects.nodesIgnored.push(node);
          }
        });
        break;
      }
      default: {
        const nodes = getAllNodes();
        nodes.forEach(node => {
          if (node.colorindex === +choice) {
            sideEffects.nodesSelected.push(node);
          } else {
            sideEffects.nodesIgnored.push(node);
          }
        });
      }
    }
  }
}