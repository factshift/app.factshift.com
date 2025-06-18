import { NODE_MANAGER } from '../../../simulation/nodes/nodes';
import { getSimulationElements } from '../../../simulation/basic';
import { registerComponent } from '../../component-registry';

export function updateSimulationNodes(nodes) {
  const { wrapper } = getSimulationElements();
  NODE_MANAGER.updateNodes(wrapper, nodes);
}

export function initSimulationNodes() {
  updateSimulationNodes(window.spwashi.nodes || []);
}

export const simulationNodes = { init: initSimulationNodes, update: updateSimulationNodes };

registerComponent('simulation-nodes', simulationNodes);
