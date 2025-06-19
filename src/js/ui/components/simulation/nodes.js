import { NODE_MANAGER } from '../../../simulation/nodes/nodes';
import { getSimulationElements } from '../../../simulation/basic';
import { registerComponent } from '../../component-registry';
import { isDisplayEnabled } from '../../../simulation/data';

export function updateSimulationNodes(nodes) {
  const { wrapper } = getSimulationElements();
  const mode  = window.spwashi.parameters.mode;
  const phase = document.body?.dataset.phase || 'default';
  if (isDisplayEnabled('nodes', { mode, phase })) {
    NODE_MANAGER.updateNodes(wrapper, nodes);
  }
}

export function initSimulationNodes() {
  updateSimulationNodes(window.spwashi.nodes || []);
}

export const simulationNodes = { init: initSimulationNodes, update: updateSimulationNodes };

registerComponent('simulation-nodes', simulationNodes);
